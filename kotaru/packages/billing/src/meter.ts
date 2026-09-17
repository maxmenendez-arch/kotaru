export interface UsageEntry {
  readonly turnId: string;
  readonly subjectId: string;
  readonly voiceSeconds: number;
  readonly costUsd: number;
  /** Epoch en milisegundos. */
  readonly at: number;
}

export interface MeterSnapshot {
  readonly voiceSeconds: number;
  readonly costUsd: number;
  readonly turns: number;
}

const EMPTY: MeterSnapshot = { voiceSeconds: 0, costUsd: 0, turns: 0 };

/**
 * Medidor de consumo.
 *
 * Idempotente por `turnId` a proposito: un reintento del cliente, una reconexion o un
 * webhook duplicado no pueden cobrarle dos veces el mismo turno al usuario ni inflar
 * el gasto del mes. Es la misma propiedad que se exige a la conciliacion de compras.
 */
export class UsageMeter {
  readonly #seenTurns = new Set<string>();
  readonly #bySubject = new Map<string, { voiceSeconds: number; costUsd: number; turns: number }>();
  #totalCostUsd = 0;

  /** Devuelve true si la entrada se conto; false si era un duplicado. */
  record(entry: UsageEntry): boolean {
    if (this.#seenTurns.has(entry.turnId)) return false;
    this.#seenTurns.add(entry.turnId);

    const current = this.#bySubject.get(entry.subjectId) ?? { voiceSeconds: 0, costUsd: 0, turns: 0 };
    this.#bySubject.set(entry.subjectId, {
      voiceSeconds: current.voiceSeconds + entry.voiceSeconds,
      costUsd: current.costUsd + entry.costUsd,
      turns: current.turns + 1,
    });
    this.#totalCostUsd += entry.costUsd;
    return true;
  }

  forSubject(subjectId: string): MeterSnapshot {
    const found = this.#bySubject.get(subjectId);
    return found ? { ...found } : EMPTY;
  }

  /** Gasto acumulado del periodo, en todos los usuarios. Alimenta el corte de gasto. */
  totalCostUsd(): number {
    return Math.round(this.#totalCostUsd * 1e6) / 1e6;
  }

  /** Cierre de periodo de facturacion. El gasto se reinicia con el mes. */
  reset(): void {
    this.#seenTurns.clear();
    this.#bySubject.clear();
    this.#totalCostUsd = 0;
  }
}
