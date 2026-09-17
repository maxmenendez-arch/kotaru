import { describe, expect, it } from 'vitest';
import { parseAffect, type AudioChunk, type ProviderContext, type TextChunk } from '@kotaru/ai-contracts';
import {
  MockEmbeddingProvider,
  MockLlmProvider,
  MockModerationProvider,
  MockSttProvider,
  MockTtsProvider,
} from '../src/index.js';

function ctx(signal = new AbortController().signal): ProviderContext {
  return {
    requestId: 'req_1',
    subjectId: 'subj_1',
    region: 'us',
    locale: 'es-419',
    sensitivity: 'standard',
    budget: { sessionRemainingUsd: 0.5, monthlyRemainingUsd: 800, hardCapUsd: 1000 },
    deadlineMs: 5000,
    signal,
  };
}

async function* audio(seconds: number): AsyncIterable<AudioChunk> {
  const chunks = Math.max(1, Math.round(seconds / 0.02));
  for (let i = 0; i < chunks; i += 1) {
    yield { pcm: new Uint8Array(24000 * 2 * 0.02), sampleRate: 24000, seq: i };
  }
}

async function* text(parts: readonly string[]): AsyncIterable<TextChunk> {
  for (let i = 0; i < parts.length; i += 1) {
    yield { text: parts[i]!, isFinal: i === parts.length - 1 };
  }
}

describe('STT simulado', () => {
  it('emite parciales, endpoint, final y uso, en ese orden', async () => {
    const stt = new MockSttProvider('hola que tal');
    const events = [];
    for await (const event of stt.transcribeStream(audio(1), ctx())) events.push(event);

    expect(events.filter((e) => e.type === 'partial')).toHaveLength(3);
    const types = events.map((e) => e.type);
    expect(types.indexOf('endpoint')).toBeLessThan(types.indexOf('final'));
    expect(types.at(-1)).toBe('usage');
  });

  it('es determinista: dos ejecuciones producen la misma transcripcion final', async () => {
    const run = async () => {
      const out = [];
      for await (const e of new MockSttProvider('prueba estable').transcribeStream(audio(1), ctx())) {
        if (e.type === 'final') out.push(e.text);
      }
      return out;
    };
    expect(await run()).toEqual(await run());
  });

  it('cobra 0.15 USD por hora de audio', () => {
    const estimate = new MockSttProvider().estimate({ audioSeconds: 3600 }, ctx());
    expect(estimate.amountUsd).toBeCloseTo(0.15, 6);
    expect(estimate.basis).toBe('verified');
    expect(estimate.verifiedAt).toBe('2026-09-17');
  });
});

describe('LLM simulado', () => {
  it('emite una senal de emocion valida antes de los tokens', async () => {
    const llm = new MockLlmProvider('hola');
    const events = [];
    for await (const e of llm.stream([{ role: 'user', content: 'hey' }], opts(true), ctx())) {
      events.push(e);
    }
    expect(events[0]).toEqual({ type: 'affect', affect: { emotion: 'warm', intensity: 0.55, gesture: 'nod' } });
  });

  it('no emite emocion cuando el canal esta desactivado', async () => {
    const llm = new MockLlmProvider('hola');
    for await (const e of llm.stream([{ role: 'user', content: 'hey' }], opts(false), ctx())) {
      expect(e.type).not.toBe('affect');
    }
  });

  it('la cancelacion detiene la generacion y reporta stop cancelled', async () => {
    const controller = new AbortController();
    const llm = new MockLlmProvider('uno dos tres cuatro cinco seis siete ocho');
    const events = [];
    for await (const e of llm.stream([{ role: 'user', content: 'x' }], opts(false), ctx(controller.signal))) {
      events.push(e);
      if (events.filter((ev) => ev.type === 'token').length === 2) controller.abort();
    }
    const stop = events.find((e) => e.type === 'stop');
    expect(stop).toEqual({ type: 'stop', reason: 'cancelled' });
    expect(events.filter((e) => e.type === 'token')).toHaveLength(2);
  });

  it('cobra segun la tarifa verificada de Gemini Flash-Lite', () => {
    const estimate = new MockLlmProvider().estimate({ inputTokens: 152_000, outputTokens: 7_200 }, ctx());
    // 152000/1M*0.25 + 7200/1M*1.50 = 0.038 + 0.0108
    expect(estimate.amountUsd).toBeCloseTo(0.0488, 6);
  });
});

function opts(allowAffectChannel: boolean) {
  return {
    personaId: 'rio-v1',
    promptVersion: '0.1.0',
    maxOutputTokens: 256,
    temperature: 0.7,
    allowAffectChannel,
  };
}

describe('TTS simulado', () => {
  it('produce audio con marcas de visema', async () => {
    const chunks = [];
    for await (const c of new MockTtsProvider().synthesizeStream(
      text(['Hola. ', 'Me alegra verte.']),
      { voiceId: 'v1', locale: 'es-419', speed: 1, expressive: true },
      ctx(),
    )) {
      chunks.push(c);
    }
    expect(chunks).toHaveLength(2);
    expect(chunks[0]!.visemes?.[0]?.viseme).toBeDefined();
    expect(chunks[0]!.sampleRate).toBe(24000);
  });

  it('la cancelacion corta la sintesis', async () => {
    const controller = new AbortController();
    controller.abort();
    const chunks = [];
    for await (const c of new MockTtsProvider().synthesizeStream(
      text(['a', 'b', 'c']),
      { voiceId: 'v1', locale: 'en-US', speed: 1, expressive: false },
      ctx(controller.signal),
    )) {
      chunks.push(c);
    }
    expect(chunks).toHaveLength(0);
  });

  it('una hora de conversacion cuesta 0.384 USD en TTS', () => {
    const estimate = new MockTtsProvider().estimate({ characters: 24_000 }, ctx());
    expect(estimate.amountUsd).toBeCloseTo(0.384, 6);
  });
});

describe('moderacion simulada', () => {
  it('escala a crisis ante una senal de autolesion', async () => {
    const verdict = await new MockModerationProvider().classify(
      { text: 'a veces quiero morir', direction: 'inbound' },
      ctx(),
    );
    expect(verdict.action).toBe('crisis_handoff');
    expect(verdict.allowed).toBe(false);
  });

  it('permite una conversacion normal', async () => {
    const verdict = await new MockModerationProvider().classify(
      { text: 'hoy cocine pasta', direction: 'inbound' },
      ctx(),
    );
    expect(verdict.action).toBe('allow');
  });
});

describe('canal de emocion', () => {
  it('rechaza un gesto que no esta en la allowlist', () => {
    expect(parseAffect({ emotion: 'warm', intensity: 0.5, gesture: 'run_script' })).toBeNull();
  });

  it('rechaza una emocion inventada', () => {
    expect(parseAffect({ emotion: 'euphoric', intensity: 0.5 })).toBeNull();
  });

  it('recorta la intensidad al rango en vez de rechazarla', () => {
    expect(parseAffect({ emotion: 'happy', intensity: 9 })?.intensity).toBe(1);
    expect(parseAffect({ emotion: 'happy', intensity: -3 })?.intensity).toBe(0);
  });
});

describe('embeddings simulados', () => {
  it('son deterministas y de dimension declarada', async () => {
    const provider = new MockEmbeddingProvider();
    const a = await provider.embed(['recordar que le gusta el mar'], ctx());
    const b = await provider.embed(['recordar que le gusta el mar'], ctx());
    expect(a.dimensions).toBe(64);
    expect(Array.from(a.vectors[0]!)).toEqual(Array.from(b.vectors[0]!));
  });
});
