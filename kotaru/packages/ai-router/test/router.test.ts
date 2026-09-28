import { describe, expect, it } from 'vitest';
import {
  NoViableRouteError,
  type CostEstimate,
  type PredictedUsage,
  type ProviderContext,
  type ProviderDescriptor,
  type RouteRequest,
} from '@kotaru/ai-contracts';
import { DefaultAiRouter, type RegisteredProvider } from '../src/index.js';

function ctx(overrides: Partial<ProviderContext> = {}): ProviderContext {
  return {
    requestId: 'req_1',
    subjectId: 'subj_1',
    region: 'us',
    locale: 'en-US',
    sensitivity: 'standard',
    budget: { sessionRemainingUsd: 0.5, monthlyRemainingUsd: 800, hardCapUsd: 1000 },
    deadlineMs: 5000,
    signal: new AbortController().signal,
    ...overrides,
  };
}

function provider(
  id: string,
  amountUsd: number,
  overrides: Partial<ProviderDescriptor> = {},
): RegisteredProvider {
  const descriptor: ProviderDescriptor = {
    id,
    capability: 'tts',
    regions: ['us'],
    locales: ['en-US', 'es-US'],
    maxSensitivity: 'elevated',
    retentionKnown: true,
    trainingOptOut: true,
    commercialAudioRights: true,
    quality: 0.8,
    enabled: true,
    ...overrides,
  };
  const estimate = (_p: PredictedUsage, _c: ProviderContext): CostEstimate => ({
    amountUsd,
    basis: 'verified',
    rateCardVersion: `${id}@test`,
    verifiedAt: '2026-09-17',
  });
  return { descriptor, estimate };
}

const req: RouteRequest = {
  capability: 'tts',
  quality: 'balanced',
  ctx: ctx(),
  predicted: { characters: 24_000 },
};

describe('restricciones duras', () => {
  it('excluye al proveedor mas barato si su region no esta permitida', () => {
    const router = new DefaultAiRouter()
      .register(provider('barato-eu', 0.01, { regions: ['eu'] }))
      .register(provider('caro-us', 0.38));

    const decision = router.select(req);
    expect(decision.providerId).toBe('caro-us');
    expect(decision.excluded).toContainEqual({ providerId: 'barato-eu', reason: 'region_not_allowed' });
  });

  it('excluye retencion desconocida por barato que sea', () => {
    const router = new DefaultAiRouter()
      .register(provider('sin-retencion', 0.001, { retentionKnown: false }))
      .register(provider('conocido', 0.38));

    const decision = router.select(req);
    expect(decision.providerId).toBe('conocido');
    expect(decision.excluded).toContainEqual({ providerId: 'sin-retencion', reason: 'retention_unknown' });
  });

  it('excluye a quien puede entrenar con el contenido del usuario, o no lo sabemos', () => {
    const router = new DefaultAiRouter()
      .register(provider('entrena', 0.001, { trainingOptOut: false }))
      .register(provider('quien-sabe', 0.002, { trainingOptOut: 'unknown' }))
      .register(provider('excluido', 0.38));

    const decision = router.select(req);
    expect(decision.providerId).toBe('excluido');
    expect(decision.excluded).toContainEqual({ providerId: 'entrena', reason: 'training_not_excluded' });
    expect(decision.excluded).toContainEqual({ providerId: 'quien-sabe', reason: 'training_not_excluded' });
  });

  it('excluye derechos comerciales de audio desconocidos en tts', () => {
    const router = new DefaultAiRouter()
      .register(provider('sin-derechos', 0.05, { commercialAudioRights: 'unknown' }))
      .register(provider('con-derechos', 0.38));

    expect(router.select(req).providerId).toBe('con-derechos');
  });

  it('excluye por locale no soportado', () => {
    const router = new DefaultAiRouter()
      .register(provider('solo-ingles', 0.01, { locales: ['en-US'] }))
      .register(provider('bilingue', 0.38, { locales: ['en-US', 'es-US', 'es-419'] }));

    const decision = router.select({ ...req, ctx: ctx({ locale: 'es-419' }) });
    expect(decision.excluded).toContainEqual({ providerId: 'solo-ingles', reason: 'locale_unsupported' });
  });

  it('excluye por sensibilidad superior a la soportada', () => {
    const router = new DefaultAiRouter()
      .register(provider('estandar', 0.01, { maxSensitivity: 'standard' }))
      .register(provider('restringido', 0.38, { maxSensitivity: 'restricted' }));

    const decision = router.select({ ...req, ctx: ctx({ sensitivity: 'restricted' }) });
    expect(decision.providerId).toBe('restringido');
  });

  it('excluye cuando la estimacion supera el presupuesto de sesion', () => {
    const router = new DefaultAiRouter()
      .register(provider('carisimo', 5.0))
      .register(provider('asequible', 0.2));

    const decision = router.select(req);
    expect(decision.providerId).toBe('asequible');
    expect(decision.excluded).toContainEqual({ providerId: 'carisimo', reason: 'spend_cap_exceeded' });
  });

  it('el kill switch saca al proveedor sin desplegar', () => {
    const router = new DefaultAiRouter()
      .register(provider('primario', 0.1))
      .register(provider('respaldo', 0.3));

    expect(router.select(req).providerId).toBe('primario');
    router.setKillSwitch('primario', true);
    const decision = router.select(req);
    expect(decision.providerId).toBe('respaldo');
    expect(decision.excluded).toContainEqual({ providerId: 'primario', reason: 'kill_switch' });
  });

  it('lanza NoViableRouteError cuando nadie sobrevive', () => {
    const router = new DefaultAiRouter().register(provider('unico', 0.1, { enabled: false }));
    expect(() => router.select(req)).toThrow(NoViableRouteError);
  });
});

describe('circuit breaker', () => {
  it('abre tras tres fallos consecutivos y excluye al proveedor', () => {
    let now = 1_000_000;
    const router = new DefaultAiRouter({ now: () => now })
      .register(provider('inestable', 0.1))
      .register(provider('estable', 0.3));

    expect(router.select(req).providerId).toBe('inestable');

    for (let i = 0; i < 3; i += 1) {
      router.report({ routeId: 'r', providerId: 'inestable', ok: false, latencyMs: 900, error: 'upstream' });
    }

    const decision = router.select(req);
    expect(decision.providerId).toBe('estable');
    expect(decision.excluded).toContainEqual({ providerId: 'inestable', reason: 'circuit_open' });

    now += 30_001;
    expect(router.select(req).providerId).toBe('inestable');
  });

  it('una cancelacion del usuario no cuenta como fallo del proveedor', () => {
    const router = new DefaultAiRouter().register(provider('p', 0.1));
    for (let i = 0; i < 10; i += 1) {
      router.report({ routeId: 'r', providerId: 'p', ok: false, latencyMs: 10, error: 'cancelled' });
    }
    expect(router.isCircuitOpen('p')).toBe(false);
  });

  it('un exito reinicia la cuenta de fallos', () => {
    const router = new DefaultAiRouter().register(provider('p', 0.1));
    router.report({ routeId: 'r', providerId: 'p', ok: false, latencyMs: 10, error: 'upstream' });
    router.report({ routeId: 'r', providerId: 'p', ok: false, latencyMs: 10, error: 'upstream' });
    router.report({ routeId: 'r', providerId: 'p', ok: true, latencyMs: 10 });
    router.report({ routeId: 'r', providerId: 'p', ok: false, latencyMs: 10, error: 'upstream' });
    expect(router.isCircuitOpen('p')).toBe(false);
  });
});

describe('puntuacion', () => {
  it('el nivel economico prefiere el mas barato aunque tenga menos calidad', () => {
    const router = new DefaultAiRouter()
      .register(provider('premium', 0.38, { quality: 0.95 }))
      .register(provider('economico', 0.09, { quality: 0.7 }));

    expect(router.select({ ...req, quality: 'economical' }).providerId).toBe('economico');
  });

  it('el nivel premium prefiere la calidad aunque cueste mas', () => {
    const router = new DefaultAiRouter()
      .register(provider('premium', 0.38, { quality: 0.95 }))
      .register(provider('economico', 0.09, { quality: 0.7 }));

    expect(router.select({ ...req, quality: 'premium' }).providerId).toBe('premium');
  });

  it('el desempate es determinista: la misma entrada da siempre la misma ruta', () => {
    const build = () =>
      new DefaultAiRouter()
        .register(provider('bbb', 0.2))
        .register(provider('aaa', 0.2));

    expect(build().select(req).providerId).toBe('aaa');
    expect(build().select(req).providerId).toBe('aaa');
  });

  it('expone los fallbacks en orden de puntuacion', () => {
    const router = new DefaultAiRouter()
      .register(provider('primero', 0.05, { quality: 0.9 }))
      .register(provider('segundo', 0.2, { quality: 0.85 }))
      .register(provider('tercero', 0.3, { quality: 0.6 }));

    const decision = router.select(req);
    expect(decision.providerId).toBe('primero');
    expect(decision.fallbacks).toEqual(['segundo', 'tercero']);
  });
});

describe('preferencia del operador', () => {
  const req = (quality: 'balanced' | 'premium' = 'balanced'): RouteRequest => ({
    capability: 'tts', quality, ctx: ctx(), predicted: { characters: 300 } as PredictedUsage,
  });

  it('el preferido va primero aunque puntue menos; los demas quedan de respaldo', () => {
    const cheap = provider('barata', 0.001, { capability: 'tts', quality: 0.6 });
    const good = provider('realista', 0.01, { capability: 'tts', quality: 0.88 });
    const plain = new DefaultAiRouter().register(cheap).register(good);
    expect(plain.select(req()).providerId).toBe('barata');
    const pinned = new DefaultAiRouter({ preferred: { tts: 'realista' } }).register(cheap).register(good);
    const d = pinned.select(req());
    expect(d.providerId).toBe('realista');
    expect(d.fallbacks).toEqual(['barata']);
  });

  it('si el preferido no pasa las restricciones duras, no se fuerza', () => {
    const cheap = provider('barata', 0.001, { capability: 'tts', quality: 0.6 });
    const blocked = provider('realista', 0.01, { capability: 'tts', quality: 0.88, trainingOptOut: false });
    const r = new DefaultAiRouter({ preferred: { tts: 'realista' } }).register(cheap).register(blocked);
    expect(r.select(req()).providerId).toBe('barata');
  });
});
