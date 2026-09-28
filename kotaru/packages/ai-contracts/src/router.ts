import type {
  Capability,
  CostEstimate,
  ProviderContext,
  ProviderHealth,
  QualityTier,
  Usage,
} from './context.js';

/**
 * Motivos por los que un proveedor queda EXCLUIDO antes de puntuar.
 * Son restricciones duras: se evaluan como filtro binario, nunca como penalizacion
 * que un buen precio pueda compensar.
 */
export type HardConstraint =
  | 'disabled'
  | 'region_not_allowed'
  | 'locale_unsupported'
  | 'capability_missing'
  | 'sensitivity_unsupported'
  | 'retention_unknown'
  | 'training_not_excluded'
  | 'commercial_rights_unknown'
  | 'spend_cap_exceeded'
  | 'kill_switch'
  | 'circuit_open';

export interface PredictedUsage {
  readonly audioSeconds?: number;
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly characters?: number;
  readonly sessionSeconds?: number;
}

export interface RouteRequest {
  readonly capability: Capability;
  readonly quality: QualityTier;
  readonly ctx: ProviderContext;
  readonly predicted: PredictedUsage;
  /**
   * Proveedores que pide esta peticion, en orden (p. ej. la voz elegida para probar en
   * Ajustes). Van antes que la preferencia del operador; si no pasan las restricciones
   * duras, se ignoran y el resto sigue de respaldo.
   */
  readonly prefer?: readonly string[];
}

export interface ExcludedProvider {
  readonly providerId: string;
  readonly reason: HardConstraint;
}

export interface RouteDecision {
  readonly routeId: string;
  readonly providerId: string;
  readonly estimate: CostEstimate;
  readonly score: number;
  readonly fallbacks: readonly string[];
  readonly excluded: readonly ExcludedProvider[];
}

export type RouteError = 'timeout' | 'upstream' | 'cancelled' | 'quota';

export interface RouteOutcome {
  readonly routeId: string;
  readonly providerId: string;
  readonly ok: boolean;
  readonly latencyMs: number;
  readonly usage?: Usage;
  readonly cost?: CostEstimate;
  readonly error?: RouteError;
}

export interface ScoringWeights {
  readonly quality: number;
  readonly cost: number;
  readonly latency: number;
  readonly health: number;
}

export interface AiRouter {
  select(req: RouteRequest): RouteDecision;
  /** Alimenta salud, circuit breaker y presupuesto. NUNCA recibe contenido. */
  report(outcome: RouteOutcome): void;
  healthOf(providerId: string): ProviderHealth | undefined;
}

/** Se lanza cuando ningun proveedor sobrevive a las restricciones duras. */
export class NoViableRouteError extends Error {
  readonly excluded: readonly ExcludedProvider[];
  readonly capability: Capability;

  constructor(capability: Capability, excluded: readonly ExcludedProvider[]) {
    super(
      `No hay ruta viable para la capacidad '${capability}'. ` +
        `Excluidos: ${excluded.map((e) => `${e.providerId}(${e.reason})`).join(', ') || 'ninguno registrado'}`,
    );
    this.name = 'NoViableRouteError';
    this.capability = capability;
    this.excluded = excluded;
  }
}
