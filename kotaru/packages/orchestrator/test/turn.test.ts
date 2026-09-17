import { describe, expect, it } from 'vitest';
import {
  type AudioChunk,
  type CostEstimate,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
  type TextChunk,
  type TextToSpeechProvider,
  type VoiceConfig,
} from '@kotaru/ai-contracts';
import { DefaultAiRouter } from '@kotaru/ai-router';
import {
  MockLlmProvider,
  MockModerationProvider,
  MockSttProvider,
  MockTtsProvider,
} from '@kotaru/ai-adapters-mock';
import { InMemorySink } from '@kotaru/telemetry';
import { runTurn, type ProviderResolver, type TurnEvent } from '../src/index.js';

function ctx(signal = new AbortController().signal): ProviderContext {
  return {
    requestId: 'req_1',
    subjectId: 'subj_1',
    region: 'us',
    locale: 'es-419',
    sensitivity: 'standard',
    budget: { sessionRemainingUsd: 5, monthlyRemainingUsd: 800, hardCapUsd: 1000 },
    deadlineMs: 10_000,
    signal,
  };
}

async function* audio(chunks = 10): AsyncIterable<AudioChunk> {
  for (let i = 0; i < chunks; i += 1) {
    yield { pcm: new Uint8Array(24000 * 2 * 0.02), sampleRate: 24000, seq: i };
  }
}

/** TTS que falla al abrir el stream, para ejercitar el fallback. */
class FailingTts implements TextToSpeechProvider {
  readonly descriptor: ProviderDescriptor = {
    id: 'tts-roto',
    capability: 'tts',
    regions: ['us'],
    locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
    maxSensitivity: 'elevated',
    retentionKnown: true,
    trainingOptOut: true,
    commercialAudioRights: true,
    quality: 0.9,
    enabled: true,
  };

  async *synthesizeStream(
    _text: AsyncIterable<TextChunk>,
    _voice: VoiceConfig,
    _c: ProviderContext,
  ): AsyncIterable<AudioChunk> {
    throw new Error('502 del proveedor');
  }

  estimate(): CostEstimate {
    return { amountUsd: 0.001, basis: 'verified', rateCardVersion: 'roto@test', verifiedAt: '2026-09-17' };
  }

  async health(): Promise<ProviderHealth> {
    return { status: 'healthy', p95LatencyMs: 100, errorRate: 0, observedAt: '2026-09-17T00:00:00.000Z' };
  }
}

function harness(options: { brokenTts?: boolean; crisis?: boolean } = {}) {
  const stt = new MockSttProvider('hoy me fue bien en el trabajo');
  const llm = new MockLlmProvider('Me alegra mucho. Cuentame que fue lo mejor.');
  const tts = new MockTtsProvider();
  const broken = new FailingTts();

  let clock = 1_000_000;
  const now = () => (clock += 5);

  const router = new DefaultAiRouter({ now: () => clock })
    .register({ descriptor: stt.descriptor, estimate: (p, c) => stt.estimate({ audioSeconds: p.audioSeconds ?? 0 }, c) })
    .register({ descriptor: llm.descriptor, estimate: (p, c) => llm.estimate({ inputTokens: p.inputTokens ?? 0, outputTokens: p.outputTokens ?? 0 }, c) })
    .register({ descriptor: tts.descriptor, estimate: (p, c) => tts.estimate({ characters: p.characters ?? 0 }, c) });

  if (options.brokenTts) {
    // Mas calidad que el mock, asi que el router lo elige primero y falla.
    router.register({ descriptor: broken.descriptor, estimate: () => broken.estimate() });
  }

  const resolve: ProviderResolver = {
    stt: (id) => (id === stt.descriptor.id ? stt : undefined),
    llm: (id) => (id === llm.descriptor.id ? llm : undefined),
    tts: (id) => (id === tts.descriptor.id ? tts : id === broken.descriptor.id ? broken : undefined),
  };

  const sink = new InMemorySink();

  return { router, resolve, sink, now, moderation: new MockModerationProvider() };
}

const input = (transcriptSource = audio()) => ({
  conversationId: 'conv_01',
  turnId: 'turn_01',
  audio: transcriptSource,
  history: [{ role: 'system' as const, content: 'Eres un companion calido y honesto.' }],
  llmOptions: {
    personaId: 'rio-v1',
    promptVersion: '0.1.0',
    maxOutputTokens: 256,
    temperature: 0.7,
    allowAffectChannel: true,
  },
  voice: { voiceId: 'rio-es', locale: 'es-419' as const, speed: 1, expressive: true },
  quality: 'balanced' as const,
  predicted: { audioSeconds: 1380, inputTokens: 152_000, outputTokens: 7_200, characters: 24_000 },
});

async function collect(stream: AsyncIterable<TurnEvent>): Promise<TurnEvent[]> {
  const events: TurnEvent[] = [];
  for await (const event of stream) events.push(event);
  return events;
}

describe('turno completo', () => {
  it('recorre transcripcion, emocion, tokens y audio, y termina con la metrica', async () => {
    const h = harness();
    const events = await collect(runTurn(input(), ctx(), { ...h, infraCostUsd: 0.0003 }));
    const types = events.map((e) => e.type);

    expect(types).toContain('transcript_partial');
    expect(types).toContain('transcript_final');
    expect(types).toContain('affect');
    expect(types).toContain('token');
    expect(types).toContain('audio');
    expect(types.at(-1)).toBe('done');

    // El orden importa: el final llega antes que el primer token.
    expect(types.indexOf('transcript_final')).toBeLessThan(types.indexOf('token'));
  });

  it('el audio empieza antes de que termine la generacion', async () => {
    const h = harness();
    const events = await collect(runTurn(input(), ctx(), h));
    const types = events.map((e) => e.type);
    const firstAudio = types.indexOf('audio');
    const lastToken = types.lastIndexOf('token');

    expect(firstAudio).toBeGreaterThan(-1);
    expect(firstAudio).toBeLessThan(lastToken);
  });

  it('atribuye costo a las tres etapas y suma la infraestructura', async () => {
    const h = harness();
    const events = await collect(runTurn(input(), ctx(), { ...h, infraCostUsd: 0.0003 }));
    const done = events.at(-1);
    if (done?.type !== 'done') throw new Error('el turno no termino');

    const m = done.metric;
    expect(m.sttCostUsd).toBeGreaterThan(0);
    expect(m.llmCostUsd).toBeGreaterThan(0);
    expect(m.ttsCostUsd).toBeGreaterThan(0);
    expect(m.infraCostUsd).toBeCloseTo(0.0003, 6);
    expect(m.totalCostUsd).toBeCloseTo(
      m.sttCostUsd + m.llmCostUsd + m.ttsCostUsd + m.infraCostUsd,
      6,
    );
    expect(m.costBasis).toBe('verified');
  });

  it('la metrica llega al sink y no lleva contenido de la conversacion', async () => {
    const h = harness();
    await collect(runTurn(input(), ctx(), h));
    expect(h.sink.turns).toHaveLength(1);
    const serialized = JSON.stringify(h.sink.turns[0]);
    expect(serialized).not.toContain('trabajo');
    expect(serialized).not.toContain('alegra');
  });

  it('cambia de proveedor de TTS sin que el usuario oiga nada raro', async () => {
    const h = harness({ brokenTts: true });
    const events = await collect(runTurn(input(), ctx(), h));

    const degraded = events.find((e) => e.type === 'degraded');
    expect(degraded).toMatchObject({ type: 'degraded', stage: 'tts', from: 'tts-roto', to: 'mock-tts' });
    expect(events.some((e) => e.type === 'audio')).toBe(true);

    const done = events.at(-1);
    if (done?.type !== 'done') throw new Error('el turno no termino');
    expect(done.metric.fallbackUsed).toBe(true);
    expect(done.metric.ttsProvider).toBe('mock-tts');
  });
});

describe('seguridad', () => {
  it('una senal de crisis detiene el turno antes del modelo', async () => {
    const h = harness();
    const events = await collect(
      runTurn(
        { ...input(), audio: audio() },
        ctx(),
        { ...h, resolve: { ...h.resolve, stt: () => new MockSttProvider('a veces quiero morir') } },
      ),
    );

    const safety = events.find((e) => e.type === 'safety');
    expect(safety).toMatchObject({ type: 'safety', verdict: { action: 'crisis_handoff' } });
    expect(events.some((e) => e.type === 'token')).toBe(false);
    expect(events.some((e) => e.type === 'audio')).toBe(false);
    expect(events.at(-1)?.type).toBe('done');
  });
});
