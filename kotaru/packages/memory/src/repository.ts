import type { Memory } from './types.js';

export type ApproveOutcome =
  | { readonly ok: true; readonly memory: Memory }
  | { readonly ok: false; readonly reason: 'not_found' | 'at_capacity' | 'duplicate' };

export type SaveOutcome = 'saved' | 'not_found' | 'duplicate';

/**
 * Cambio parcial. Solo toca los campos que trae: fijar un recuerdo no puede deshacer una
 * aprobacion que ocurrio mientras tanto, ni perder un uso contado por otra sesion.
 */
export interface MemoryPatch {
  readonly text?: string;
  readonly pinned?: boolean;
  readonly status?: 'rejected';
}

export type UpdateResult =
  | { readonly outcome: 'saved'; readonly memory: Memory }
  | { readonly outcome: 'not_found' | 'duplicate' };

/**
 * Donde viven los recuerdos. Solo almacenamiento: las reglas (el guardia de contenido,
 * que nada nazca aprobado, el orden de recuperacion) estan en `MemoryStore` y son las
 * mismas para cualquier implementacion.
 *
 * Dos operaciones son atomicas a proposito, porque una comprobacion en la aplicacion no
 * lo seria con varias instancias:
 * - `insert` detecta el duplicado (mismo usuario, mismo companion, mismo texto sin
 *   distinguir mayusculas ni espacios de borde, no rechazado).
 * - `approveWithinCapacity` cuenta y aprueba sin que otra aprobacion se cuele en medio.
 */
export interface MemoryRepository {
  insert(memory: Memory): Promise<'inserted' | 'duplicate'>;
  get(id: string): Promise<Memory | undefined>;
  /** Cambia solo los campos del parche y devuelve el recuerdo tal como quedo. */
  update(id: string, patch: MemoryPatch, atIso: string): Promise<UpdateResult>;
  remove(id: string): Promise<boolean>;
  removeAllFor(subjectId: string): Promise<number>;
  listFor(subjectId: string): Promise<Memory[]>;
  /** Aprobados, de ese companion, no vencidos a `nowIso`. */
  recallable(subjectId: string, companionId: string, nowIso: string): Promise<Memory[]>;
  markUsed(ids: readonly string[], atIso: string): Promise<void>;
  countApproved(subjectId: string): Promise<number>;
  approveWithinCapacity(id: string, maxApproved: number, atIso: string): Promise<ApproveOutcome>;
  removeExpired(nowIso: string): Promise<number>;
}

/** Clave de duplicado. La base usa exactamente la misma expresion: lower(btrim(text)). */
export function duplicateKey(text: string): string {
  return text.trim().toLowerCase();
}

/** Implementacion en memoria. Pruebas, demo, y la referencia contra la que se mide SQL. */
export class InMemoryMemoryRepository implements MemoryRepository {
  readonly #rows = new Map<string, Memory>();

  async insert(memory: Memory): Promise<'inserted' | 'duplicate'> {
    if (this.#conflicts(memory)) return 'duplicate';
    this.#rows.set(memory.id, memory);
    return 'inserted';
  }

  async get(id: string): Promise<Memory | undefined> {
    return this.#rows.get(id);
  }

  async update(id: string, patch: MemoryPatch, atIso: string): Promise<UpdateResult> {
    const existing = this.#rows.get(id);
    if (!existing) return { outcome: 'not_found' };
    const memory: Memory = {
      ...existing,
      ...(patch.text !== undefined ? { text: patch.text } : {}),
      ...(patch.pinned !== undefined ? { pinned: patch.pinned } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      updatedAt: atIso,
    };
    if (memory.status !== 'rejected' && this.#conflicts(memory)) return { outcome: 'duplicate' };
    this.#rows.set(id, memory);
    return { outcome: 'saved', memory };
  }

  async remove(id: string): Promise<boolean> {
    return this.#rows.delete(id);
  }

  async removeAllFor(subjectId: string): Promise<number> {
    let removed = 0;
    for (const [id, memory] of this.#rows) {
      if (memory.subjectId === subjectId) {
        this.#rows.delete(id);
        removed += 1;
      }
    }
    return removed;
  }

  async listFor(subjectId: string): Promise<Memory[]> {
    return [...this.#rows.values()].filter((m) => m.subjectId === subjectId);
  }

  async recallable(subjectId: string, companionId: string, nowIso: string): Promise<Memory[]> {
    return [...this.#rows.values()].filter(
      (m) =>
        m.subjectId === subjectId &&
        m.companionId === companionId &&
        m.status === 'approved' &&
        (m.expiresAt === undefined || m.expiresAt > nowIso),
    );
  }

  async markUsed(ids: readonly string[], atIso: string): Promise<void> {
    for (const id of ids) {
      const m = this.#rows.get(id);
      if (m) this.#rows.set(id, { ...m, useCount: m.useCount + 1, lastUsedAt: atIso });
    }
  }

  async countApproved(subjectId: string): Promise<number> {
    let n = 0;
    for (const m of this.#rows.values()) if (m.subjectId === subjectId && m.status === 'approved') n += 1;
    return n;
  }

  async approveWithinCapacity(id: string, maxApproved: number, atIso: string): Promise<ApproveOutcome> {
    // Sin await entre contar y escribir: en un solo hilo esto ya es atomico.
    const existing = this.#rows.get(id);
    if (!existing) return { ok: false, reason: 'not_found' };
    if (existing.status === 'rejected' && this.#conflicts(existing)) {
      // Rescatar un rechazado que ya tiene gemelo vivo crearia un duplicado.
      return { ok: false, reason: 'duplicate' };
    }
    if (existing.status !== 'approved') {
      let n = 0;
      for (const m of this.#rows.values()) if (m.subjectId === existing.subjectId && m.status === 'approved') n += 1;
      if (n >= maxApproved) return { ok: false, reason: 'at_capacity' };
    }
    const memory: Memory = { ...existing, status: 'approved', updatedAt: atIso };
    this.#rows.set(id, memory);
    return { ok: true, memory };
  }

  async removeExpired(nowIso: string): Promise<number> {
    let removed = 0;
    for (const [id, m] of this.#rows) {
      if (m.expiresAt !== undefined && m.expiresAt <= nowIso) {
        this.#rows.delete(id);
        removed += 1;
      }
    }
    return removed;
  }

  #conflicts(memory: Memory): boolean {
    const key = duplicateKey(memory.text);
    for (const other of this.#rows.values()) {
      if (
        other.id !== memory.id &&
        other.subjectId === memory.subjectId &&
        other.companionId === memory.companionId &&
        other.status !== 'rejected' &&
        duplicateKey(other.text) === key
      ) {
        return true;
      }
    }
    return false;
  }
}
