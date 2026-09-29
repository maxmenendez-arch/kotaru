import { describe, expect, it } from 'vitest';
import { ProviderError, type AudioChunk, type ProviderContext, type TextChunk, type VoiceConfig } from '@kotaru/ai-contracts';
import { CARTESIA_RATE, CartesiaTtsProvider, cartesiaPrefix, DEFAULT_CARTESIA_VOICES } from '../src/index.js';

interface Call {
  readonly url: string;
  readonly headers: Record<string, string>;
  readonly body: Record<string, unknown>;
}

/** fetch falso: registra las peticiones y devuelve PCM en trozos irregulares. */
function fakeFetch(opts: { status?: number; errorBody?: unknown; bytesPerChar?: number; pieces?: number } = {}) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    calls.push({ url, headers: init.headers as Record<string, string>, body });
    if (opts.status && opts.status >= 400) {
      return new Response(JSON.stringify(opts.errorBody ?? {}), { status: opts.status });
    }
    const total = String(body.input).length * (opts.bytesPerChar ?? 900) + 1; // impar a proposito
    const pieces = opts.pieces ?? 7;
    const size = Math.ceil(total / pieces);
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let sent = 0; sent < total; sent += size) controller.enqueue(new Uint8Array(Math.min(size, total - sent)));
        controller.close();
      },
    });
    return new Response(stream, { status: 200, headers: { 'content-type': 'application/octet-stream' } });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const ctx = (signal = new AbortController().signal): ProviderContext => ({
  requestId: 'r', subjectId: 's', region: 'us', locale: 'es-419', sensitivity: 'standard',
  budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: 1 }, deadlineMs: 5000, signal,
});
const voice = (extra: Partial<VoiceConfig> = {}): VoiceConfig => ({ voiceId: 'rio-es', locale: 'es-419', speed: 1, expressive: true, ...extra });
async function* sentences(...texts: string[]): AsyncIterable<TextChunk> {
  for (const text of texts) yield { text, isFinal: false };
}
async function collect(it: AsyncIterable<AudioChunk>) {
  const out: AudioChunk[] = [];
  for await (const c of it) out.push(c);
  return out;
}
const make = (f: typeof fetch, extra = {}) =>
  new CartesiaTtsProvider({ apiKey: 'clave-de-prueba', fetch: f, zeroRetentionConfirmed: true, commercialTermsReviewed: true, maleVoices: ['rio'], ...extra });

describe('Cartesia Sonic-3 en Together AI', () => {
  it('pide Sonic-3 con la voz de cada personaje y el idioma, en PCM 16 bits a 24 kHz', async () => {
    const { impl, calls } = fakeFetch();
    const p = make(impl);
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ voiceId: 'luna' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ voiceId: 'rio' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hi.'), voice({ voiceId: 'nova', locale: 'en-US' }), ctx()));
    expect(calls[0]!.body).toEqual({
      model: 'cartesia/sonic-3', input: '<emotion value="calm"/><speed ratio="0.95"/>Hola.', voice: DEFAULT_CARTESIA_VOICES['luna'], language: 'es',
      response_format: 'raw', response_encoding: 'pcm_s16le', sample_rate: 24000, stream: false,
    });
    expect(calls[1]!.body.voice).toBe(DEFAULT_CARTESIA_VOICES['rio']);
    expect(calls[2]!.body).toMatchObject({ voice: DEFAULT_CARTESIA_VOICES['nova'], language: 'en' });
  });

  it('cada personaje actua con su emocion y velocidad (Nova coqueta, Rio con entusiasmo); se pueden cambiar', async () => {
    const { impl, calls } = fakeFetch();
    await collect(make(impl).synthesizeStream(sentences('Hola.'), voice({ voiceId: 'nova' }), ctx()));
    await collect(make(impl).synthesizeStream(sentences('Hola.'), voice({ voiceId: 'rio' }), ctx()));
    await collect(make(impl, { styles: { nova: { speed: 1 } } }).synthesizeStream(sentences('Hola.'), voice({ voiceId: 'nova' }), ctx()));
    await collect(make(impl).synthesizeStream(sentences('Hola.'), voice({ voiceId: 'desconocida' }), ctx()));
    expect(calls[0]!.body.input).toBe('<emotion value="flirtatious"/><speed ratio="0.92"/>Hola.');
    expect(calls[1]!.body.input).toBe('<emotion value="enthusiastic"/><speed ratio="1.05"/>Hola.');
    expect(calls[2]!.body.input).toBe('Hola.');
    expect(calls[3]!.body.input).toBe('Hola.');
  });

  it('las etiquetas solo admiten valores seguros (una emocion rara no se cuela en el texto)', () => {
    expect(cartesiaPrefix({ emotion: 'calm"/><x', speed: 9 })).toBe('<speed ratio="1.5"/>');
    expect(cartesiaPrefix(undefined)).toBe('');
  });

  it('las voces se pueden cambiar por personaje; un personaje desconocido usa la voz de su genero', async () => {
    const { impl, calls } = fakeFetch();
    const p = make(impl, { voices: { nova: 'otra-voz' }, maleVoices: ['rio', 'nuevo-chico'] });
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ voiceId: 'nova' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ voiceId: 'nuevo-chico' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ voiceId: 'desconocida' }), ctx()));
    expect(calls.map((c) => c.body.voice)).toEqual(['otra-voz', DEFAULT_CARTESIA_VOICES['rio'], DEFAULT_CARTESIA_VOICES['luna']]);
  });

  it('entrega trozos de 100 ms con muestras completas y estima a 65 USD por millon', async () => {
    const { impl } = fakeFetch();
    const chunks = await collect(make(impl).synthesizeStream(sentences('Una frase.'), voice({ voiceId: 'luna' }), ctx()));
    expect(chunks.every((c) => c.sampleRate === 24000 && c.pcm.byteLength % 2 === 0)).toBe(true);
    expect(chunks.slice(0, -1).every((c) => c.pcm.byteLength === 4800)).toBe(true);
    // 200 caracteres + 45 % de etiquetas de emocion y velocidad (ASSUMPTION: se cobran).
    expect(make(impl).estimate({ characters: 200 }, ctx())).toMatchObject({ amountUsd: 0.01885, basis: 'assumption', rateCardVersion: CARTESIA_RATE.version });
    expect(make(impl).descriptor).toMatchObject({ id: 'together-cartesia-sonic-3', capability: 'tts', trainingOptOut: true });
  });

  it('un error de Together es reintentable si es 429 o 5xx', async () => {
    const e = await collect(make(fakeFetch({ status: 503 }).impl).synthesizeStream(sentences('x.'), voice({ voiceId: 'luna' }), ctx())).catch((x: unknown) => x);
    expect(e).toBeInstanceOf(ProviderError);
    expect(e).toMatchObject({ retryable: true, status: 503 });
  });
});
