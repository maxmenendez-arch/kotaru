/** Region de servicio permitida para una peticion. */
export type Region = 'us' | 'eu' | 'latam' | 'apac';

export type Locale = 'en-US' | 'es-US' | 'es-ES' | 'es-419';

/** Clase de sensibilidad del contenido del turno. Gobierna que rutas son admisibles. */
export type Sensitivity = 'standard' | 'elevated' | 'restricted';

export type QualityTier = 'economical' | 'balanced' | 'premium';

export type Capability = 'stt' | 'llm' | 'tts' | 'realtime' | 'moderation' | 'embedding';

/** Presupuesto concedido a una peticion. El router lo evalua como restriccion dura. */
export interface BudgetGrant {
  readonly sessionRemainingUsd: number;
  readonly monthlyRemainingUsd: number;
  readonly hardCapUsd: number;
}

/**
 * Contexto de una llamada a proveedor.
 * Invariante: NUNCA lleva userId, email ni ninguna PII. Solo el pseudonimo `subjectId`.
 */
export interface ProviderContext {
  readonly requestId: string;
  readonly subjectId: string;
  readonly region: Region;
  readonly locale: Locale;
  readonly sensitivity: Sensitivity;
  readonly budget: BudgetGrant;
  readonly deadlineMs: number;
  readonly signal: AbortSignal;
}

export interface BilledUnit {
  readonly unit: string;
  readonly quantity: number;
}

/** Consumo reportado por el proveedor, suficiente para atribuir costo. */
export interface Usage {
  readonly audioSecondsIn?: number;
  readonly audioSecondsOut?: number;
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly cachedInputTokens?: number;
  readonly characters?: number;
  /** Unidades tal como el proveedor las factura, con su redondeo ya aplicado. */
  readonly billedUnits: readonly BilledUnit[];
}

/**
 * Estimacion de costo. `basis` distingue un supuesto de una tarifa verificada,
 * para que ningun tablero pueda presentar un supuesto como precio confirmado.
 */
export interface CostEstimate {
  readonly amountUsd: number;
  readonly basis: 'assumption' | 'verified';
  readonly rateCardVersion: string;
  /** ISO-8601. Obligatorio cuando basis === 'verified'. */
  readonly verifiedAt?: string;
}

export interface ProviderHealth {
  readonly status: 'healthy' | 'degraded' | 'down';
  readonly p95LatencyMs: number;
  readonly errorRate: number;
  readonly observedAt: string;
}

export interface ProviderDescriptor {
  readonly id: string;
  readonly capability: Capability;
  readonly regions: readonly Region[];
  readonly locales: readonly Locale[];
  readonly maxSensitivity: Sensitivity;
  readonly retentionKnown: boolean;
  readonly trainingOptOut: boolean | 'unknown';
  readonly commercialAudioRights: boolean | 'unknown';
  /** Calidad relativa 0..1, calibrada por benchmark propio, no por marketing del proveedor. */
  readonly quality: number;
  readonly enabled: boolean;
}

export type SampleRate = 16000 | 24000 | 48000;

export interface VisemeCue {
  readonly viseme: string;
  readonly atMs: number;
  readonly durationMs: number;
}

export interface AudioChunk {
  readonly pcm: Uint8Array;
  readonly sampleRate: SampleRate;
  readonly seq: number;
  readonly visemes?: readonly VisemeCue[];
}

export interface TextChunk {
  readonly text: string;
  readonly isFinal: boolean;
}

/** Orden de severidad de sensibilidad, para comparar contra `maxSensitivity`. */
export const SENSITIVITY_ORDER: Readonly<Record<Sensitivity, number>> = {
  standard: 0,
  elevated: 1,
  restricted: 2,
};
