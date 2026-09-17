import type { QualityTier } from '@kotaru/ai-contracts';

export type PlanId = 'free' | 'connect' | 'close' | 'always';

export interface Plan {
  readonly id: PlanId;
  readonly priceUsd: number;
  /** Segundos de voz incluidos por periodo de facturacion. */
  readonly includedVoiceSeconds: number;
  /** Tope duro por sesion, independiente del saldo. Evita el bucle infinito accidental. */
  readonly maxSessionSeconds: number;
  /** Silencio tras el que la sesion se cierra sola. El microfono abierto cuesta dinero. */
  readonly idleTimeoutSeconds: number;
  readonly defaultQuality: QualityTier;
  readonly allowsPremiumRoute: boolean;
  readonly allowsAddOns: boolean;
}

/**
 * Asignaciones de D-008, calculadas a 0.52 USD/hora con 50% de margen de
 * contribucion en el usuario p95. Si D-011 pasa la prueba de calidad ciega, el costo
 * baja a 0.23 y estas cifras se recalculan: no se editan a mano.
 */
export const PLANS: Readonly<Record<PlanId, Plan>> = {
  free: {
    id: 'free',
    priceUsd: 0,
    includedVoiceSeconds: 45 * 60,
    maxSessionSeconds: 10 * 60,
    idleTimeoutSeconds: 45,
    defaultQuality: 'economical',
    allowsPremiumRoute: false,
    allowsAddOns: false,
  },
  connect: {
    id: 'connect',
    priceUsd: 7.99,
    includedVoiceSeconds: 5 * 3600,
    maxSessionSeconds: 30 * 60,
    idleTimeoutSeconds: 60,
    defaultQuality: 'balanced',
    allowsPremiumRoute: false,
    allowsAddOns: true,
  },
  close: {
    id: 'close',
    priceUsd: 14.99,
    includedVoiceSeconds: 12 * 3600,
    maxSessionSeconds: 45 * 60,
    idleTimeoutSeconds: 90,
    defaultQuality: 'balanced',
    allowsPremiumRoute: true,
    allowsAddOns: true,
  },
  always: {
    id: 'always',
    priceUsd: 24.99,
    includedVoiceSeconds: 20 * 3600,
    maxSessionSeconds: 60 * 60,
    idleTimeoutSeconds: 120,
    defaultQuality: 'premium',
    allowsPremiumRoute: true,
    allowsAddOns: true,
  },
};

/** Comision de tienda. 15% mientras se facture menos de USD 1M al ano (ADR-005). */
export const STORE_COMMISSION_SMALL_BUSINESS = 0.15;
export const STORE_COMMISSION_STANDARD = 0.3;
