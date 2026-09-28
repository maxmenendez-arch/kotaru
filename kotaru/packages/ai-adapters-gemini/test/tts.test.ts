import { describe, expect, it } from 'vitest';
import { ProviderError, type AudioChunk, type ProviderContext, type TextChunk, type VoiceConfig } from '@kotaru/ai-contracts';
import { GeminiTtsProvider, rateFor } from '../src/index.js';

interface Call { url: string; headers: Record<string, string>; body: Record<string, any> }

/** PCM de `bytes` bytes, opcionalmente con cabecera WAV, repartido en eventos SSE. */
function fakeFetch(opts: { status?: number; wav?: boolean; bytesPerChar?: number; pieces?: number; errorEvent?: boolean } = {}) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    const body = JSON.parse(String(init.body));
    calls.push({ url, headers: init.headers as Record<string, string>, body });
    if (opts.status && opts.status >= 400) return new Response(JSON.stringify({ error: { status: 'PERMISSION_DENIED' } }), { status: opts.status });
    const text: string = body.input[0].content[0].text;
    let audio: Uint8Array = new Uint8Array(text.length * (opts.bytesPerChar ?? 1000));
    if (opts.wav) {
      const header = new Uint8Array(44);
      header.set([...'RIFF'].map((c) => c.charCodeAt(0)), 0);
      header.set([...'WAVE'].map((c) => c.charCodeAt(0)), 8);
      header.set([...'fmt '].map((c) => c.charCodeAt(0)), 12);
      new DataView(header.buffer).setUint32(16, 16, true);
      header.set([...'data'].map((c) => c.charCodeAt(0)), 36);
      const withHeader = new Uint8Array(44 + audio.byteLength);
      withHeader.set(header);
      withHeader.set(audio, 44);
      audio = withHeader;
    }
    const pieces = opts.pieces ?? 5;
    const size = Math.ceil(audio.byteLength / pieces);
    const events: string[] = [`data: ${JSON.stringify({ event_type: 'interaction.created' })}\n\n`];
    for (let at = 0; at < audio.byteLength; at += size) {
      const data = Buffer.from(audio.subarray(at, at + size)).toString('base64');
      events.push(`event: step.delta\ndata: ${JSON.stringify({ event_type: 'step.delta', delta: { type: 'audio', data, mime_type: 'audio/pcm' } })}\n\n`);
    }
    if (opts.errorEvent) events.push(`data: ${JSON.stringify({ event_type: 'error', error: { status: 'RESOURCE_EXHAUSTED' } })}\n\n`);
    events.push(`data: ${JSON.stringify({ event_type: 'interaction.completed', interaction: { usage: { total_output_tokens: 50 } } })}`);
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        for (const e of events) c.enqueue(new TextEncoder().encode(e));
        c.close();
      },
    });
    return new Response(stream, { status: 200, headers: { 'content-type': 'text/event-stream' } });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const ctx = (signal = new AbortController().signal): ProviderContext => ({
  requestId: 'r', subjectId: 's', region: 'us', locale: 'es-419', sensitivity: 'standard',
  budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: 1 }, deadlineMs: 5000, signal,
});
const voice = (extra: Partial<VoiceConfig> = {}): VoiceConfig => ({ voiceId: 'nova', locale: 'es-419', speed: 1, expressive: true, ...extra });
async function* sentences(...texts: string[]): AsyncIterable<TextChunk> {
  for (const text of texts) yield { text, isFinal: false };
}
async function collect(it: AsyncIterable<AudioChunk>) {
  const out: AudioChunk[] = [];
  for await (const c of it) out.push(c);
  return out;
}
const VOICES = {
  nova: { voice: 'Laomedeia', style: { es: 'alegre y curiosa', en: 'cheerful and curious' } },
  rio: { voice: 'Achird', style: { es: 'cálido y relajado', en: 'warm and relaxed' } },
};
const make = (f: typeof fetch, extra = {}) =>
  new GeminiTtsProvider({ apiKey: 'clave-de-prueba', fetch: f, paidTierConfirmed: true, voices: VOICES, fallback: VOICES.rio, now: () => Date.parse('2026-10-01'), ...extra });

describe('Gemini TTS (Interactions API)', () => {
  it('pide la voz y el estilo del personaje, en streaming, una peticion por oracion', async () => {
    const { impl, calls } = fakeFetch();
    await collect(make(impl).synthesizeStream(sentences('Hola.', '¿Qué tal tu día?'), voice(), ctx()));
    expect(calls).toHaveLength(2);
    expect(calls[0]!.url).toBe('https://generativelanguage.googleapis.com/v1beta/interactions');
    expect(calls[0]!.headers['x-goog-api-key']).toBe('clave-de-prueba');
    expect(calls[0]!.body).toEqual({
      model: 'gemini-3.8-flash-lite-tts',
      input: [{ type: 'user_input', content: [{ type: 'text', text: 'Hola.', annotations: [{ type: 'speech_metadata', style: 'alegre y curiosa' }] }] }],
      response_format: { type: 'audio' },
      generation_config: { speech_config: [{ voice: 'Laomedeia' }] },
      stream: true,
    });
  });

  it('cada personaje suena con su voz; en ingles usa el estilo en ingles; sin expresividad no manda estilo', async () => {
    const { impl, calls } = fakeFetch();
    const p = make(impl);
    await collect(p.synthesizeStream(sentences('Hi.'), voice({ voiceId: 'rio', locale: 'en-US' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ voiceId: 'desconocida' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ expressive: false }), ctx()));
    expect(calls[0]!.body.generation_config.speech_config[0].voice).toBe('Achird');
    expect(calls[0]!.body.input[0].content[0].annotations[0].style).toBe('warm and relaxed');
    expect(calls[1]!.body.generation_config.speech_config[0].voice).toBe('Achird');
    expect(calls[2]!.body.input[0].content[0].annotations).toBeUndefined();
  });

  it('entrega PCM a 24 kHz en trozos de 100 ms con muestras completas, con o sin cabecera WAV', async () => {
    for (const wav of [false, true]) {
      const { impl } = fakeFetch({ wav });
      const chunks = await collect(make(impl).synthesizeStream(sentences('Una oración de prueba.'), voice(), ctx()));
      const total = chunks.reduce((n, c) => n + c.pcm.byteLength, 0);
      expect(total).toBe('Una oración de prueba.'.length * 1000);
      expect(chunks.every((c) => c.sampleRate === 24000 && c.pcm.byteLength % 2 === 0)).toBe(true);
      expect(chunks.slice(0, -1).every((c) => c.pcm.byteLength === 4800)).toBe(true);
      expect(chunks.map((c) => c.seq)).toEqual(chunks.map((_, i) => i));
    }
  });

  it('estima con la tarifa del momento: sube el 1 de enero de 2027', () => {
    expect(rateFor('gemini-3.8-flash-lite-tts', Date.parse('2026-12-31T23:00:00Z'))).toEqual({ until: '2027-01-01', input: 0.5, outputAudio: 6 });
    expect(rateFor('gemini-3.8-flash-lite-tts', Date.parse('2027-01-01T00:00:00Z'))).toMatchObject({ input: 1, outputAudio: 12 });
    const { impl } = fakeFetch();
    // 1500 caracteres ≈ 100 s de voz ≈ 2500 tokens de audio a 6 USD/M + 375 de texto a 0,5 USD/M.
    expect(make(impl).estimate({ characters: 1500 }, ctx())).toMatchObject({ amountUsd: 0.015188, basis: 'assumption' });
  });

  it('errores: permiso denegado no es reintentable; un error dentro del stream si', async () => {
    const e1 = await collect(make(fakeFetch({ status: 403 }).impl).synthesizeStream(sentences('x.'), voice(), ctx())).catch((e: unknown) => e);
    expect(e1).toBeInstanceOf(ProviderError);
    expect(e1).toMatchObject({ code: 'permission_denied', retryable: false, status: 403 });
    const e2 = await collect(make(fakeFetch({ errorEvent: true }).impl).synthesizeStream(sentences('x.'), voice(), ctx())).catch((e: unknown) => e);
    expect(e2).toMatchObject({ code: 'resource_exhausted', retryable: true });
  });

  it('al interrumpir no pide mas oraciones', async () => {
    const { impl, calls } = fakeFetch();
    const controller = new AbortController();
    for await (const _ of make(impl).synthesizeStream(sentences('Uno.', 'Dos.', 'Tres.'), voice(), ctx(controller.signal))) controller.abort();
    expect(calls).toHaveLength(1);
  });

  it('sin nivel de pago confirmado, el router no puede usarla', () => {
    const p = make(fakeFetch().impl, { paidTierConfirmed: false });
    expect(p.descriptor).toMatchObject({ trainingOptOut: false, commercialAudioRights: 'unknown' });
  });
});
