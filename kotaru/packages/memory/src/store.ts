import { guardMemoryText, type BlockedReason } from './guard.js';
import { InMemoryMemoryRepository, type ApproveOutcome, type MemoryRepository } from './repository.js';
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
  /** Donde se guardan. Por defecto en memoria; en produccion, PostgreSQL. */
  readonly repository?: MemoryRepository;
}

export type ProposeRejection = BlockedReason | 'duplicate';

export type ApproveRejection = 'not_found' | 'at_capacity' | 'duplicate';

export type ApproveResult = ApproveOutcome;

export type EditRejection = BlockedReason | 'duplicate' | 'not_found';

export type EditResult =
  | { readonly ok: true; readonly memory: Memory }
  | { readonly ok: false; readonly reason: EditRejection };

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
  readonly #repo: MemoryRepository;
  readonly #now: () => number;
  readonly #newId: () => string;
  readonly #max: number;

  constructor(options: MemoryStoreOptions) {
    this.#repo = options.repository ?? new InMemoryMemoryRepository();
    this.#now = options.now;
    this.#newId = options.newId;
    this.#max = options.maxApprovedPerSubject ?? DEFAULT_MAX_APPROVED;
  }

  /** Crea un candidato en estado `proposed`. Todavia no es recuperable. */
  async propose(input: {
    readonly subjectId: string;
    readonly companionId: string;
    readonly candidate: MemoryCandidate;
    readonly sourceTurnId: string;
  }): Promise<ProposeResult> {
    const verdict = guardMemoryText(input.candidate.text);
    if (!verdict.allowed) return { ok: false, reason: verdict.reason! };

    const timestamp = this.#isoNow();
    const memory: Memory = {
      id: this.#newId(),
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
    // El duplicado se mide por usuario Y companion: cada companion recuerda lo que le
    // contaron a el. Lo decide el repositorio de forma atomica, no una lectura previa.
    const outcome = await this.#repo.insert(memory);
    if (outcome === 'duplicate') return { ok: false, reason: 'duplicate' };
    return { ok: true, memory };
  }

  /**
   * Aprueba un recuerdo propuesto.
   *
   * Al llegar al tope NO se desaloja nada. Un recuerdo aprobado lo aprobo la persona;
   * borrarlo en silencio para hacer sitio contradice la promesa de un centro de
   * memoria transparente. En su lugar se rechaza la aprobacion y la interfaz pide
   * elegir que soltar. La decision de olvidar es siempre del usuario.
   */
  approve(id: string): Promise<ApproveResult> {
    return this.#repo.approveWithinCapacity(id, this.#max, this.#isoNow());
  }

  /** La interfaz lo usa para avisar antes de que el usuario intente aprobar. */
  async isAtCapacity(subjectId: string): Promise<boolean> {
    return (await this.#repo.countApproved(subjectId)) >= this.#max;
  }

  reject(id: string): Promise<Memory | undefined> {
    return this.#transition(id, 'rejected');
  }

  /** El usuario corrige el texto. Vuelve a pasar por el guardia y por el duplicado. */
  async edit(id: string, text: string): Promise<EditResult> {
    const existing = await this.#repo.get(id);
    if (!existing) return { ok: false, reason: 'not_found' };

    const verdict = guardMemoryText(text);
    if (!verdict.allowed) return { ok: false, reason: verdict.reason! };

    const updated: Memory = { ...existing, text, updatedAt: this.#isoNow() };
    const outcome = await this.#repo.save(updated);
    if (outcome !== 'saved') return { ok: false, reason: outcome };
    return { ok: true, memory: updated };
  }

  async setPinned(id: string, pinned: boolean): Promise<Memory | undefined> {
    const existing = await this.#repo.get(id);
    if (!existing) return undefined;
    const updated: Memory = { ...existing, pinned, updatedAt: this.#isoNow() };
    return (await this.#repo.save(updated)) === 'saved' ? updated : undefined;
  }

  /** Busca uno. La API lo usa para comprobar de quien es antes de tocarlo. */
  get(id: string): Promise<Memory | undefined> {
    return this.#repo.get(id);
  }

  /** Borrado real, no marcado. Si el usuario dice que lo olvides, se olvida. */
  forget(id: string): Promise<boolean> {
    return this.#repo.remove(id);
  }

  /** Borrado de cuenta. Devuelve cuantos recuerdos se eliminaron. */
  forgetAll(subjectId: string): Promise<number> {
    return this.#repo.removeAllFor(subjectId);
  }

  /**
   * Recupera lo que el companion puede usar en este turno.
   * Solo aprobados: lo propuesto y lo rechazado no existe para el modelo.
   */
  async recall(query: RecallQuery): Promise<readonly Memory[]> {
    const nowIso = this.#isoNow();
    const terms = tokenize(query.text);

    const candidates = await this.#repo.recallable(query.subjectId, query.companionId, nowIso);
    const chosen = candidates
      .map((memory) => ({ memory, score: relevance(memory, terms) }))
      .sort(compareForRecall)
      .slice(0, query.limit ?? 8)
      .map((entry) => entry.memory);

    if (chosen.length > 0) await this.#repo.markUsed(chosen.map((m) => m.id), nowIso);
    return chosen.map((memory) => ({ ...memory, useCount: memory.useCount + 1, lastUsedAt: nowIso }));
  }

  /** Todo lo del usuario, para el centro de memoria. Incluye lo propuesto. */
  async list(subjectId: string): Promise<readonly Memory[]> {
    const rows = await this.#repo.listFor(subjectId);
    return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
  }

  /** Exportacion de datos. Todo lo que el producto guarda sobre esta persona. */
  async exportFor(
    subjectId: string,
  ): Promise<{ readonly subjectId: string; readonly memories: readonly Memory[] }> {
    return { subjectId, memories: await this.list(subjectId) };
  }

  /** Elimina lo vencido. Devuelve cuantos se fueron. */
  prune(): Promise<number> {
    return this.#repo.removeExpired(this.#isoNow());
  }

  countApproved(subjectId: string): Promise<number> {
    return this.#repo.countApproved(subjectId);
  }

  async #transition(id: string, status: MemoryStatus): Promise<Memory | undefined> {
    const existing = await this.#repo.get(id);
    if (!existing) return undefined;
    const updated: Memory = { ...existing, status, updatedAt: this.#isoNow() };
    return (await this.#repo.save(updated)) === 'saved' ? updated : undefined;
  }

  #isoNow(): string {
    return new Date(this.#now()).toISOString();
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
