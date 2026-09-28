import {
  NoViableRouteError,
  SENSITIVITY_ORDER,
  type AiRouter,
  type Capability,
  type CostEstimate,
  type ExcludedProvider,
  type HardConstraint,
  type PredictedUsage,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
  type QualityTier,
  type RouteDecision,
  type RouteOutcome,
  type RouteRequest,
  type ScoringWeights,
} from '@kotaru/ai-contracts';

export interface RegisteredProvider {
  readonly descriptor: ProviderDescriptor;
  estimate(predicted: PredictedUsage, ctx: ProviderContext): CostEstimate;
}

export interface CircuitBreakerOptions {
  /** Fallos consecutivos que abren el circuito. */
  readonly failureThreshold: number;
  /** Milisegundos que el circuito permanece abierto. */
  readonly openMs: number;
}

export interface RouterOptions {
  readonly weights?: Partial<ScoringWeights>;
  readonly circuitBreaker?: Partial<CircuitBreakerOptions>;
  /** Reloj inyectable: las pruebas no dependen del tiempo real. */
  readonly now?: () => number;
  /**
   * Preferencia del operador por capacidad: si ese proveedor pasa las restricciones duras
   * (region, retencion, derechos, presupuesto, circuito), va primero aunque puntue menos;
   * los demas quedan de respaldo en su orden. Sirve cuando la calidad es el producto (la
   * voz de un personaje) y el puntaje por precio elegiria la opcion barata.
   */
  readonly preferred?: Readonly<Partial<Record<Capability, string | readonly string[]>>>;
}

const DEFAULT_WEIGHTS: ScoringWeights = { quality: 1.0, cost: 0.8, latency: 0.5, health: 0.6 };
const DEFAULT_BREAKER: CircuitBreakerOptions = { failureThreshold: 3, openMs: 30_000 };

/** Reescalado de pesos por nivel de calidad pedido. */
const TIER_MULTIPLIERS: Readonly<Record<QualityTier, { quality: number; cost: number }>> = {
  economical: { quality: 0.5, cost: 2 },
  balanced: { quality: 1, cost: 1 },
  premium: { quality: 2, cost: 0.25 },
};

const HEALTH_SCORE: Readonly<Record<ProviderHealth['status'], number>> = {
  healthy: 1,
  degraded: 0.5,
  down: 0,
};

interface ProviderState {
  health: ProviderHealth;
  consecutiveFailures: number;
  circuitOpenUntilMs: number;
  killed: boolean;
}

interface Candidate {
  readonly provider: RegisteredProvider;
  readonly estimate: CostEstimate;
  readonly health: ProviderHealth;
}

/**
 * Router multiproveedor.
 *
 * Regla central: las restricciones duras se evaluan como filtro binario ANTES de
 * puntuar. Un precio bajo nunca compensa una region no permitida, una retencion
 * desconocida o un tope de gasto excedido.
 */
export class DefaultAiRouter implements AiRouter {
  readonly #providers = new Map<string, RegisteredProvider>();
  readonly #state = new Map<string, ProviderState>();
  readonly #weights: ScoringWeights;
  readonly #preferred: Readonly<Partial<Record<Capability, string | readonly string[]>>>;
  readonly #breaker: CircuitBreakerOptions;
  readonly #now: () => number;

  constructor(options: RouterOptions = {}) {
    this.#weights = { ...DEFAULT_WEIGHTS, ...options.weights };
    this.#preferred = options.preferred ?? {};
    this.#breaker = { ...DEFAULT_BREAKER, ...options.circuitBreaker };
    this.#now = options.now ?? (() => Date.now());
  }

  register(provider: RegisteredProvider, health?: ProviderHealth): this {
    const id = provider.descriptor.id;
    this.#providers.set(id, provider);
    this.#state.set(id, {
      health: health ?? {
        status: 'healthy',
        p95LatencyMs: 1000,
        errorRate: 0,
        observedAt: new Date(this.#now()).toISOString(),
      },
      consecutiveFailures: 0,
      circuitOpenUntilMs: 0,
      killed: false,
    });
    return this;
  }

  /** Kill switch por proveedor, operado por remote config sin desplegar. */
  setKillSwitch(providerId: string, killed: boolean): void {
    const state = this.#state.get(providerId);
    if (state) state.killed = killed;
  }

  observeHealth(providerId: string, health: ProviderHealth): void {
    const state = this.#state.get(providerId);
    if (state) state.health = health;
  }

  healthOf(providerId: string): ProviderHealth | undefined {
    return this.#state.get(providerId)?.health;
  }

  isCircuitOpen(providerId: string): boolean {
    const state = this.#state.get(providerId);
    if (!state) return false;
    return state.circuitOpenUntilMs > this.#now();
  }

  select(req: RouteRequest): RouteDecision {
    const excluded: ExcludedProvider[] = [];
    const candidates: Candidate[] = [];

    for (const provider of this.#providers.values()) {
      const state = this.#state.get(provider.descriptor.id);
      if (!state) continue;

      const reason = this.#hardConstraint(provider.descriptor, state, req);
      if (reason !== null) {
        excluded.push({ providerId: provider.descriptor.id, reason });
        continue;
      }

      const estimate = provider.estimate(req.predicted, req.ctx);
      const affordable = Math.min(
        req.ctx.budget.sessionRemainingUsd,
        req.ctx.budget.monthlyRemainingUsd,
        req.ctx.budget.hardCapUsd,
      );
      if (estimate.amountUsd > affordable) {
        excluded.push({ providerId: provider.descriptor.id, reason: 'spend_cap_exceeded' });
        continue;
      }

      candidates.push({ provider, estimate, health: state.health });
    }

    if (candidates.length === 0) {
      throw new NoViableRouteError(req.capability, excluded);
    }

    const scored = this.#score(candidates, req);
    // Preferencia del operador: los proveedores listados van primero y en ese orden (el
    // primero es la opcion principal y los siguientes, los respaldos preferidos). Los que no
    // pueden usarse ya se excluyeron arriba; el resto sigue ordenado por puntuacion.
    const pinned = this.#preferred[req.capability];
    const order = pinned === undefined ? [] : typeof pinned === 'string' ? [pinned] : pinned;
    for (const id of [...order].reverse()) {
      const at = scored.findIndex((s) => s.candidate.provider.descriptor.id === id);
      if (at > 0) scored.unshift(...scored.splice(at, 1));
    }
    const winner = scored[0]!;

    return {
      routeId: `${req.capability}:${winner.candidate.provider.descriptor.id}@${winner.candidate.estimate.rateCardVersion}`,
      providerId: winner.candidate.provider.descriptor.id,
      estimate: winner.candidate.estimate,
      score: winner.score,
      fallbacks: scored.slice(1).map((s) => s.candidate.provider.descriptor.id),
      excluded,
    };
  }

  report(outcome: RouteOutcome): void {
    const state = this.#state.get(outcome.providerId);
    if (!state) return;

    if (outcome.ok) {
      state.consecutiveFailures = 0;
      return;
    }

    // Una cancelacion es el usuario interrumpiendo, no un fallo del proveedor.
    if (outcome.error === 'cancelled') return;

    state.consecutiveFailures += 1;
    if (state.consecutiveFailures >= this.#breaker.failureThreshold) {
      state.circuitOpenUntilMs = this.#now() + this.#breaker.openMs;
      state.consecutiveFailures = 0;
    }
  }

  #hardConstraint(
    descriptor: ProviderDescriptor,
    state: ProviderState,
    req: RouteRequest,
  ): HardConstraint | null {
    if (state.killed) return 'kill_switch';
    if (!descriptor.enabled) return 'disabled';
    if (descriptor.capability !== req.capability) return 'capability_missing';
    if (!descriptor.regions.includes(req.ctx.region)) return 'region_not_allowed';
    if (!descriptor.locales.includes(req.ctx.locale)) return 'locale_unsupported';
    if (SENSITIVITY_ORDER[descriptor.maxSensitivity] < SENSITIVITY_ORDER[req.ctx.sensitivity]) {
      return 'sensitivity_unsupported';
    }
    if (!descriptor.retentionKnown) return 'retention_unknown';
    // Regla del proyecto (06_SAFETY): solo proveedores que NO entrenan con el contenido
    // del usuario. `unknown` cuenta como no: se falla cerrado.
    if (descriptor.trainingOptOut !== true) return 'training_not_excluded';
    if (
      (req.capability === 'tts' || req.capability === 'realtime') &&
      descriptor.commercialAudioRights !== true
    ) {
      return 'commercial_rights_unknown';
    }
    if (state.circuitOpenUntilMs > this.#now()) return 'circuit_open';
    return null;
  }

  #score(
    candidates: readonly Candidate[],
    req: RouteRequest,
  ): { candidate: Candidate; score: number }[] {
    const costs = candidates.map((c) => c.estimate.amountUsd);
    const latencies = candidates.map((c) => c.health.p95LatencyMs);
    const normCost = makeNormalizer(costs);
    const normLatency = makeNormalizer(latencies);

    // El nivel pedido reescala DOS pesos, no uno. Escalar solo la calidad no basta:
    // con una brecha de precio grande, la penalizacion de costo se come la ventaja
    // de calidad y 'premium' termina eligiendo la ruta barata, que es justo lo que
    // el usuario que paga por calidad no pidio.
    const tier = TIER_MULTIPLIERS[req.quality];
    const qualityWeight = this.#weights.quality * tier.quality;
    const costWeight = this.#weights.cost * tier.cost;

    return candidates
      .map((candidate) => ({
        candidate,
        score:
          qualityWeight * candidate.provider.descriptor.quality -
          costWeight * normCost(candidate.estimate.amountUsd) -
          this.#weights.latency * normLatency(candidate.health.p95LatencyMs) +
          this.#weights.health * HEALTH_SCORE[candidate.health.status],
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Desempate determinista: sin el, la misma entrada podria dar rutas distintas.
        return a.candidate.provider.descriptor.id.localeCompare(b.candidate.provider.descriptor.id);
      });
  }
}

/** Normaliza a 0..1 dentro del conjunto de candidatos. Un solo candidato normaliza a 0. */
function makeNormalizer(values: readonly number[]): (value: number) => number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  if (span === 0) return () => 0;
  return (value: number) => (value - min) / span;
}
