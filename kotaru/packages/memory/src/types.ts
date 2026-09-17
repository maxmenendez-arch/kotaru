export type MemoryKind =
  | 'fact'
  | 'preference'
  | 'plan'
  | 'relationship'
  | 'boundary';

/**
 * Nada llega a la memoria a largo plazo sin que el usuario lo apruebe.
 *
 * Es la diferencia entre un centro de memoria transparente y una libreta secreta que
 * el producto lleva sobre la persona. `proposed` no se recupera nunca: el companion no
 * puede usar lo que todavia no le autorizaron recordar.
 */
export type MemoryStatus = 'proposed' | 'approved' | 'rejected';

export interface Memory {
  readonly id: string;
  readonly subjectId: string;
  readonly companionId: string;
  readonly kind: MemoryKind;
  readonly text: string;
  readonly status: MemoryStatus;
  readonly pinned: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly useCount: number;
  readonly sourceTurnId: string;
  readonly confidence: number;
  readonly lastUsedAt?: string;
  /** Vencimiento para lo que deja de ser cierto solo: un viaje, una fecha, un plan. */
  readonly expiresAt?: string;
}

export interface MemoryCandidate {
  readonly kind: MemoryKind;
  readonly text: string;
  readonly confidence: number;
  readonly expiresAt?: string;
}

export interface ExtractionInput {
  readonly userText: string;
  readonly companionText: string;
  readonly turnId: string;
}

/**
 * En produccion esto lo hace un modelo. La interfaz existe para que la logica de
 * memoria no dependa de como se extrae, y para poder probar el resto con un extractor
 * determinista.
 */
export interface MemoryExtractor {
  extract(input: ExtractionInput): readonly MemoryCandidate[];
}
