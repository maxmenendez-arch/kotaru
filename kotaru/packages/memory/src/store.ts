import { guardMemoryText, type BlockedReason } from './guard.js';
import type { Memory, MemoryCandidate, MemoryStatus } from './types.js';

export interface MemoryStoreOptions {
  readonly now: () => number;
  readonly newId: () => string;
  /**
   * Tope de recuerdos aprobados por usuario. No es una restriccion tecnica: una
   * memoria que crece sin limite deja de ser revisable, y un centro de memoria que el
   * usuario no puede leer entero en una sentada no es transparente. Al llegar al tope
   * se rechaza aprobar mas; nunca se borra nada por la espalda.
   */
  readonly maxApprovedPerSubject?: number;
}

export type ProposeRejection = BlockedReason | 'duplicate';

export type ApproveRejection = 'not_found' | 'at_capacity';

export type ApproveResult =
  | { readonly ok: true; readonly memory: Memory }
  | { readonly ok: false; readonly reason: ApproveRejection };

export type ProposeResult =
  | { readonly ok: true; readonly memory: Memory }
  | { readonly ok: false; readonly reason: ProposeRejection };

export interface RecallQuery {
  readonly subjectId: string;
  readonly companionId: string;
  readonly text: string;
  readonly limit?: number;
}

const DEFAULT_MAX_APPROVED = 200;

export class MemoryStore {
  readonly #memories = new Map<string, Memory>();
  readonly #options: Required<MemoryStoreOptions>;

  constructor(options: MemoryStoreOptions) {
    this.#options = {
      maxApprovedPerSubject: options.maxApprovedPerSubject ?? DEFAULT_MAX_APPROVED,
      now: options.now,
      newId: options.newId,
    };
  }

  /** Crea un candidato en estado `proposed`. Todavia no es recuperable. */
  propose(input: {
    readonly subjectId: string;
    readonly companionId: string;
    readonly candidate: MemoryCandidate;
    readonly sourceTurnId: string;
  }): ProposeResult {
    const verdict = guardMemoryText(input.candidate.text);
    if (!verdict.allowed) return { ok: false, reason: verdict.reason! };

    // El duplicado se mide por usuario Y companion: cada companion recuerda lo que le
    // contaron a el. Que Nova sepa algo no significa que Sage lo sepa.
    const duplicate = this.#find(input.subjectId).some(
      (memory) =>
        memory.companionId === input.companionId &&
        memory.status !== 'rejected' &&
        memory.text.trim().toLowerCase() === input.candidate.text.trim().toLowerCase(),
    );
    if (duplicate) return { ok: false, reason: 'duplicate' };

    const timestamp = new Date(this.#options.now()).toISOString();
    const memory: Memory = {
      id: this.#options.newId(),
      subjectId: input.subjectId,
      companionId: input.companionId,
      kind: input.candidate.kind,
      text: input.candidate.text,
      status: 'proposed',
      pinned: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      useCount: 0,
      sourceTurnId: input.sourceTurnId,
      confidence: input.candidate.confidence,
      ...(input.candidate.expiresAt !== undefined ? { expiresAt: input.candidate.expiresAt } : {}),
    };
    this.#memories.set(memory.id, memory);
    return { ok: true, memory };
  }

  /**
   * Aprueba un recuerdo propuesto.
   *
   * Al llegar al tope NO se desaloja nada. Un recuerdo aprobado lo aprobo la persona;
   * borrarlo en silencio para hacer sitio contradice la promesa de un centro de
   * memoria transparente, y ademas produce un fallo desconcertante: el usuario ve algo
   * en la lista, va a fijarlo y ya no esta. En su lugar se rechaza la aprobacion y la
   * interfaz pide elegir que soltar. La decision de olvidar es siempre del usuario.
   */
  approve(id: string): ApproveResult {
    const existing = this.#memories.get(id);
    if (!existing) return { ok: false, reason: 'not_found' };
    if (
      existing.status !== 'approved' &&
      this.countApproved(existing.subjectId) >= this.#options.maxApprovedPerSubject
    ) {
      return { ok: false, reason: 'at_capacity' };
    }
    return { ok: true, memory: this.#transition(id, 'approved')! };
  }

  /** La interfaz lo usa para avisar antes de que el usuario intente aprobar. */
  isAtCapacity(subjectId: string): boolean {
    return this.countApproved(subjectId) >= this.#options.maxApprovedPerSubject;
  }

  reject(id: string): Memory | undefined {
    return this.#transition(id, 'rejected');
  }

  /** El usuario corrige el texto. Vuelve a pasar por el guardia. */
  edit(id: string, text: string): ProposeResult {
    const existing = this.#memories.get(id);
    if (!existing) return { ok: false, reason: 'duplicate' };

    const verdict = guardMemoryText(text);
    if (!verdict.allowed) return { ok: false, reason: verdict.reason! };

    const updated: Memory = {
      ...existing,
      text,
      updatedAt: new Date(this.#options.now()).toISOString(),
    };
    this.#memories.set(id, updated);
    return { ok: true, memory: updated };
  }

  setPinned(id: string, pinned: boolean): Memory | undefined {
    const existing = this.#memories.get(id);
    if (!existing) return undefined;
    const updated: Memory = {
      ...existing,
      pinned,
      updatedAt: new Date(this.#options.now()).toISOString(),
    };
    this.#memories.set(id, updated);
    return updated;
  }

  /** Borrado real, no marcado. Si el usuario dice que lo olvides, se olvida. */
  forget(id: string): boolean {
    return this.#memories.delete(id);
  }

  /** Borrado de cuenta. Devuelve cuantos recuerdos se eliminaron. */
  forgetAll(subjectId: string): number {
    let removed = 0;
    for (const [id, memory] of this.#memories) {
      if (memory.subjectId === subjectId) {
        this.#memories.delete(id);
        removed += 1;
      }
    }
    return removed;
  }

  /**
   * Recupera lo que el companion puede usar en este turno.
   * Solo aprobados: lo propuesto y lo rechazado no existe para el modelo.
   */
  recall(query: RecallQuery): readonly Memory[] {
    const nowIso = new Date(this.#options.now()).toISOString();
    const terms = tokenize(query.text);

    const scored = this.#find(query.subjectId)
      .filter(
        (memory) =>
          memory.status === 'approved' &&
          memory.companionId === query.companionId &&
          (memory.expiresAt === undefined || memory.expiresAt > nowIso),
      )
      .map((memory) => ({ memory, score: relevance(memory, terms) }))
      .sort(compareForRecall);

    const chosen = scored.slice(0, query.limit ?? 8).map((entry) => entry.memory);

    for (const memory of chosen) {
      this.#memories.set(memory.id, {
        ...memory,
        useCount: memory.useCount + 1,
        lastUsedAt: nowIso,
      });
    }
    return chosen.map((memory) => this.#memories.get(memory.id)!);
  }

  /** Todo lo del usuario, para el centro de memoria. Incluye lo propuesto. */
  list(subjectId: string): readonly Memory[] {
    return this.#find(subjectId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  /** Exportacion de datos. Todo lo que el producto guarda sobre esta persona. */
  exportFor(subjectId: string): { readonly subjectId: string; readonly memories: readonly Memory[] } {
    return { subjectId, memories: this.list(subjectId) };
  }

  /** Elimina lo vencido. Devuelve cuantos se fueron. */
  prune(): number {
    const nowIso = new Date(this.#options.now()).toISOString();
    let removed = 0;
    for (const [id, memory] of this.#memories) {
      if (memory.expiresAt !== undefined && memory.expiresAt <= nowIso) {
        this.#memories.delete(id);
        removed += 1;
      }
    }
    return removed;
  }

  countApproved(subjectId: string): number {
    return this.#find(subjectId).filter((memory) => memory.status === 'approved').length;
  }

  #find(subjectId: string): Memory[] {
    return [...this.#memories.values()].filter((memory) => memory.subjectId === subjectId);
  }

  #transition(id: string, status: MemoryStatus): Memory | undefined {
    const existing = this.#memories.get(id);
    if (!existing) return undefined;
    const updated: Memory = {
      ...existing,
      status,
      updatedAt: new Date(this.#options.now()).toISOString(),
    };
    this.#memories.set(id, updated);
    return updated;
  }

}

function compareForRecall(
  a: { memory: Memory; score: number },
  b: { memory: Memory; score: number },
): number {
  if (a.memory.pinned !== b.memory.pinned) return a.memory.pinned ? -1 : 1;
  if (b.score !== a.score) return b.score - a.score;
  if (b.memory.updatedAt !== a.memory.updatedAt) {
    return b.memory.updatedAt.localeCompare(a.memory.updatedAt);
  }
  // Desempate estable: sin esto, dos recuerdos iguales podrian alternar entre turnos.
  return a.memory.id.localeCompare(b.memory.id);
}

function relevance(memory: Memory, terms: readonly string[]): number {
  if (terms.length === 0) return 0;
  const words = new Set(tokenize(memory.text));
  let hits = 0;
  for (const term of terms) if (words.has(term)) hits += 1;
  return hits / terms.length;
}

const STOP_WORDS = new Set([
  'que', 'de', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'en', 'me', 'mi', 'es',
  'the', 'a', 'an', 'of', 'to', 'is', 'my', 'i', 'and', 'in',
]);

function tokenize(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}
