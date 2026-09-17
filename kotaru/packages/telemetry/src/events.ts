import type { Capability, CostEstimate } from '@kotaru/ai-contracts';

/**
 * Metrica de un turno. Invariante del proyecto: NUNCA contiene texto de la
 * conversacion, ni transcripciones, ni memorias, ni prompts. Solo identificadores,
 * numeros y enums. `assertNoContent` lo hace cumplir en tiempo de ejecucion.
 */
export interface TurnMetric {
  readonly conversationId: string;
  readonly turnId: string;
  readonly routeId: string;
  readonly sttProvider?: string;
  readonly llmProvider?: string;
  readonly ttsProvider?: string;

  readonly endpointToFinalMs?: number;
  readonly llmTtftMs?: number;
  readonly ttsTtfbMs?: number;
  readonly turnTotalMs: number;

  readonly userSpeechMs?: number;
  readonly sessionMs?: number;

  readonly sttCostUsd: number;
  readonly llmCostUsd: number;
  readonly ttsCostUsd: number;
  readonly infraCostUsd: number;
  readonly totalCostUsd: number;
  readonly costBasis: 'assumption' | 'verified';

  readonly fallbackUsed: boolean;
  readonly interrupted: boolean;
  readonly createdAt: string;
}

export interface CostEvent {
  readonly requestId: string;
  readonly capability: Capability;
  readonly providerId: string;
  readonly estimate: CostEstimate;
  readonly createdAt: string;
}

/** Claves permitidas en una metrica de turno. Cualquier otra se rechaza. */
const ALLOWED_TURN_KEYS: ReadonlySet<string> = new Set<keyof TurnMetric & string>([
  'conversationId', 'turnId', 'routeId',
  'sttProvider', 'llmProvider', 'ttsProvider',
  'endpointToFinalMs', 'llmTtftMs', 'ttsTtfbMs', 'turnTotalMs',
  'userSpeechMs', 'sessionMs',
  'sttCostUsd', 'llmCostUsd', 'ttsCostUsd', 'infraCostUsd', 'totalCostUsd', 'costBasis',
  'fallbackUsed', 'interrupted', 'createdAt',
]);

/** Valores de texto que si se permiten, por ser identificadores o enums cerrados. */
const FREE_TEXT_ALLOWED: ReadonlySet<string> = new Set([
  'conversationId', 'turnId', 'routeId',
  'sttProvider', 'llmProvider', 'ttsProvider',
  'costBasis', 'createdAt',
]);

export class ContentLeakError extends Error {
  readonly key: string;
  constructor(key: string, detail: string) {
    super(`Fuga de contenido en telemetria: la clave '${key}' ${detail}`);
    this.name = 'ContentLeakError';
    this.key = key;
  }
}

/**
 * Falla si una metrica trae una clave no declarada o una cadena que parece
 * contenido de conversacion en vez de un identificador.
 *
 * El criterio de "parece contenido": mas de 64 caracteres, o contiene un espacio.
 * Un id, un nombre de proveedor o una fecha ISO nunca llevan espacios.
 */
export function assertNoContent(metric: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(metric)) {
    if (!ALLOWED_TURN_KEYS.has(key)) {
      throw new ContentLeakError(key, 'no esta en la lista de claves permitidas');
    }
    if (typeof value !== 'string') continue;
    if (!FREE_TEXT_ALLOWED.has(key)) {
      throw new ContentLeakError(key, 'no deberia ser una cadena');
    }
    if (value.length > 64) {
      throw new ContentLeakError(key, `mide ${value.length} caracteres; el limite es 64`);
    }
    if (/\s/.test(value)) {
      throw new ContentLeakError(key, 'contiene espacios, lo que sugiere texto de conversacion');
    }
  }
}

export interface MetricSink {
  emitTurn(metric: TurnMetric): void;
  emitCost(event: CostEvent): void;
}

/** Sink en memoria para pruebas y desarrollo. En produccion se sustituye por OpenTelemetry. */
export class InMemorySink implements MetricSink {
  readonly turns: TurnMetric[] = [];
  readonly costs: CostEvent[] = [];

  emitTurn(metric: TurnMetric): void {
    assertNoContent(metric as unknown as Record<string, unknown>);
    this.turns.push(metric);
  }

  emitCost(event: CostEvent): void {
    this.costs.push(event);
  }

  totalCostUsd(): number {
    return this.turns.reduce((sum, t) => sum + t.totalCostUsd, 0);
  }
}
