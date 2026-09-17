import type { CostEstimate } from '@kotaru/ai-contracts';

/**
 * Tarifas. Cada una declara si es un supuesto o una tarifa verificada en
 * documentacion oficial, con su fecha. Ver docs/PROVIDER_REGISTRY.yaml.
 */
export interface RateCard {
  readonly version: string;
  readonly basis: 'assumption' | 'verified';
  readonly verifiedAt?: string;
  readonly sttPerAudioHourUsd?: number;
  readonly llmInputPerMillionUsd?: number;
  readonly llmOutputPerMillionUsd?: number;
  readonly ttsPerMillionCharsUsd?: number;
}

export const ASSEMBLYAI_UNIVERSAL_STREAMING: RateCard = {
  version: 'assemblyai-universal-streaming@2026-09-17',
  basis: 'verified',
  verifiedAt: '2026-09-17',
  sttPerAudioHourUsd: 0.15,
};

export const GEMINI_31_FLASH_LITE: RateCard = {
  version: 'gemini-3.1-flash-lite@2026-09-17',
  basis: 'verified',
  verifiedAt: '2026-09-17',
  llmInputPerMillionUsd: 0.25,
  llmOutputPerMillionUsd: 1.5,
};

export const POLLY_NEURAL: RateCard = {
  version: 'polly-neural@2026-09-17',
  basis: 'verified',
  verifiedAt: '2026-09-17',
  ttsPerMillionCharsUsd: 16,
};

/** Candidata de D-011. Bloqueada por prueba de calidad ciega antes de habilitarse. */
export const KOKORO_TOGETHER: RateCard = {
  version: 'kokoro-82m-together@2026-09-17',
  basis: 'verified',
  verifiedAt: '2026-09-17',
  ttsPerMillionCharsUsd: 4,
};

export function cost(card: RateCard, amountUsd: number): CostEstimate {
  const base = {
    amountUsd: round6(amountUsd),
    basis: card.basis,
    rateCardVersion: card.version,
  } as const;
  return card.verifiedAt === undefined ? base : { ...base, verifiedAt: card.verifiedAt };
}

export function round6(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}
