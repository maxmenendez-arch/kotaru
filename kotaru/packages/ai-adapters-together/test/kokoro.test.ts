import { describe, expect, it } from 'vitest';
import { ProviderError, type AudioChunk, type ProviderContext, type TextChunk, type VoiceConfig } from '@kotaru/ai-contracts';
import { KokoroTtsProvider } from '../src/index.js';

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
  new KokoroTtsProvider({ apiKey: 'clave-de-prueba', fetch: f, zeroRetentionConfirmed: true, commercialTermsReviewed: true, ...extra });

describe('Kokoro-82M en Together AI', () => {
  it('pide Kokoro en PCM 16 bits a 24 kHz, con la voz y el idioma, una peticion por oracion', async () => {
    const { impl, calls } = fakeFetch();
    await collect(make(impl).synthesizeStream(sentences('Hola.', '¿Qué tal?'), voice(), ctx()));
    expect(calls).toHaveLength(2);
    expect(calls[0]!.url).toBe('https://api.together.ai/v1/audio/speech');
    expect(calls[0]!.headers.authorization).toBe('Bearer clave-de-prueba');
    expect(calls[0]!.body).toEqual({
      model: 'hexgrad/Kokoro-82M', input: 'Hola.', voice: 'ef_dora', language: 'es',
      response_format: 'raw', response_encoding: 'pcm_s16le', sample_rate: 24000, stream: false,
    });
  });

  it('elige voz masculina o femenina segun el companion, y por idioma', async () => {
    const { impl, calls } = fakeFetch();
    const p = make(impl, { maleVoices: ['sage-voz'] });
    await collect(p.synthesizeStream(sentences('Hi.'), voice({ voiceId: 'sage-voz', locale: 'en-US' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ locale: 'es-ES' }), ctx()));
    expect(calls.map((c) => [c.body.voice, c.body.language])).toEqual([['am_michael', 'en'], ['ef_dora', 'es']]);
  });

  it('reenvia el audio en trozos de 100 ms, siempre con muestras completas', async () => {
    const { impl } = fakeFetch();
    const chunks = await collect(make(impl).synthesizeStream(sentences('Una oración de prueba.'), voice(), ctx()));
    expect(chunks.every((c) => c.sampleRate === 24000 && c.pcm.byteLength % 2 === 0)).toBe(true);
    expect(chunks.slice(0, -1).every((c) => c.pcm.byteLength === 4800)).toBe(true);
    expect(chunks.map((c) => c.seq)).toEqual(chunks.map((_, i) => i));
  });

  it('parte un texto enorme en peticiones acotadas', async () => {
    const { impl, calls } = fakeFetch({ bytesPerChar: 1 });
    await collect(make(impl).synthesizeStream(sentences('palabra '.repeat(300).trim()), voice(), ctx()));
    expect(calls.length).toBe(3);
    expect(calls.every((c) => String(c.body.input).length <= 1000)).toBe(true);
  });

  it('cobra 4 USD por millon de caracteres, con tarifa verificada', () => {
    const { impl } = fakeFetch();
    expect(make(impl).estimate({ characters: 1000 }, ctx())).toEqual({
      amountUsd: 0.004, basis: 'verified', rateCardVersion: 'together-kokoro@2026-09-27', verifiedAt: '2026-09-27',
    });
  });

  it('el limite de ritmo es reintentable; una clave mala no', async () => {
    const limited = fakeFetch({ status: 429 });
    const e1 = await collect(make(limited.impl).synthesizeStream(sentences('x.'), voice(), ctx())).catch((e: unknown) => e);
    expect(e1).toBeInstanceOf(ProviderError);
    expect(e1).toMatchObject({ retryable: true, status: 429 });

    const denied = fakeFetch({ status: 401, errorBody: { error: { code: 'invalid_api_key' } } });
    const e2 = await collect(make(denied.impl).synthesizeStream(sentences('x.'), voice(), ctx())).catch((e: unknown) => e);
    expect(e2).toMatchObject({ code: 'invalid_api_key', retryable: false, status: 401 });
  });

  it('al interrumpir no pide mas oraciones', async () => {
    const { impl, calls } = fakeFetch();
    const controller = new AbortController();
    for await (const _ of make(impl).synthesizeStream(sentences('Uno.', 'Dos.', 'Tres.'), voice(), ctx(controller.signal))) {
      controller.abort();
    }
    expect(calls).toHaveLength(1);
  });

  it('sin retencion cero ni terminos revisados, el router no puede usarlo', () => {
    const p = new KokoroTtsProvider({ apiKey: 'k', fetch: fakeFetch().impl, zeroRetentionConfirmed: false, commercialTermsReviewed: false });
    expect(p.descriptor).toMatchObject({ retentionKnown: false, trainingOptOut: 'unknown', commercialAudioRights: 'unknown' });
  });

  it('la clave no aparece en el cuerpo de la peticion', async () => {
    const { impl, calls } = fakeFetch();
    await collect(make(impl).synthesizeStream(sentences('Hola.'), voice(), ctx()));
    expect(JSON.stringify(calls[0]!.body)).not.toContain('clave-de-prueba');
  });
});
