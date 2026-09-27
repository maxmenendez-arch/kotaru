import { describe, expect, it } from 'vitest';
import { ProviderError, type AudioChunk, type ProviderContext, type TranscriptEvent } from '@kotaru/ai-contracts';
import { WhisperSttProvider } from '../src/index.js';

interface Call { url: string; headers: Record<string, string>; form: FormData }

function fakeFetch(opts: { status?: number; text?: string } = {}) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    calls.push({ url, headers: init.headers as Record<string, string>, form: init.body as FormData });
    if (opts.status && opts.status >= 400) return new Response('{}', { status: opts.status });
    return new Response(JSON.stringify({ text: opts.text ?? ' Hola Rio, ¿cómo estás? ' }), { status: 200 });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const ctx = (locale: ProviderContext['locale'] = 'es-419', signal = new AbortController().signal): ProviderContext => ({
  requestId: 'r', subjectId: 's', region: 'us', locale, sensitivity: 'standard',
  budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: 1 }, deadlineMs: 5000, signal,
});

/** `seconds` de tono (o de silencio) a 24 kHz, en trozos de 20 ms. */
async function* audio(seconds: number, amplitude = 8000): AsyncIterable<AudioChunk> {
  const perChunk = 480;
  const total = Math.round(seconds * 24000);
  let seq = 0;
  for (let done = 0; done < total; done += perChunk) {
    const n = Math.min(perChunk, total - done);
    const pcm = new Uint8Array(n * 2);
    const view = new DataView(pcm.buffer);
    for (let i = 0; i < n; i++) view.setInt16(i * 2, Math.round(amplitude * Math.sin((done + i) / 10)), true);
    yield { pcm, sampleRate: 24000, seq: seq++ };
  }
}
async function collect(it: AsyncIterable<TranscriptEvent>) {
  const out: TranscriptEvent[] = [];
  for await (const e of it) out.push(e);
  return out;
}
const make = (f: typeof fetch) => new WhisperSttProvider({ apiKey: 'clave-de-prueba', fetch: f, zeroRetentionConfirmed: true });

describe('Whisper Large v3 en Together AI', () => {
  it('manda el turno como WAV con modelo, idioma y pista de nombres; devuelve el texto final', async () => {
    const { impl, calls } = fakeFetch();
    const events = await collect(make(impl).transcribeStream(audio(1.5), ctx()));
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe('https://api.together.ai/v1/audio/transcriptions');
    expect(calls[0]!.headers.authorization).toBe('Bearer clave-de-prueba');
    const form = calls[0]!.form;
    expect(form.get('model')).toBe('openai/whisper-large-v3');
    expect(form.get('language')).toBe('es');
    expect(form.get('prompt')).toContain('Kotaru');
    const file = form.get('file') as Blob;
    const head = new Uint8Array(await file.arrayBuffer()).slice(0, 44);
    expect(String.fromCharCode(...head.slice(0, 4))).toBe('RIFF');
    expect(new DataView(head.buffer).getUint32(24, true)).toBe(24000);
    expect(file.size).toBe(44 + 1.5 * 24000 * 2);
    expect(events.find((e) => e.type === 'final')).toMatchObject({ text: 'Hola Rio, ¿cómo estás?' });
  });

  it('en inglés pide en', async () => {
    const { impl, calls } = fakeFetch();
    await collect(make(impl).transcribeStream(audio(1), ctx('en-US')));
    expect(calls[0]!.form.get('language')).toBe('en');
  });

  it('silencio o un toque de medio segundo no se envian (Whisper inventa frases con el silencio)', async () => {
    const { impl, calls } = fakeFetch();
    const quiet = await collect(make(impl).transcribeStream(audio(2, 50), ctx()));
    const short = await collect(make(impl).transcribeStream(audio(0.1), ctx()));
    expect(calls).toHaveLength(0);
    expect(quiet.some((e) => e.type === 'final')).toBe(false);
    expect(short.some((e) => e.type === 'final')).toBe(false);
  });

  it('cobra 0,0015 USD por minuto de voz enviada, con tarifa verificada', async () => {
    const { impl } = fakeFetch();
    const events = await collect(make(impl).transcribeStream(audio(60), ctx()));
    expect(events.find((e) => e.type === 'usage')).toMatchObject({
      cost: { amountUsd: 0.0015, basis: 'verified', verifiedAt: '2026-09-27' },
    });
  });

  it('un error del servidor es reintentable; una clave mala no', async () => {
    const e1 = await collect(make(fakeFetch({ status: 503 }).impl).transcribeStream(audio(1), ctx())).catch((e: unknown) => e);
    expect(e1).toBeInstanceOf(ProviderError);
    expect(e1).toMatchObject({ retryable: true, status: 503 });
    const e2 = await collect(make(fakeFetch({ status: 401 }).impl).transcribeStream(audio(1), ctx())).catch((e: unknown) => e);
    expect(e2).toMatchObject({ retryable: false, status: 401 });
  });

  it('si el turno se cancela, no llama', async () => {
    const { impl, calls } = fakeFetch();
    const controller = new AbortController();
    controller.abort();
    await collect(make(impl).transcribeStream(audio(1), ctx('es-419', controller.signal)));
    expect(calls).toHaveLength(0);
  });

  it('sin retencion cero confirmada, el router no puede usarlo', () => {
    const p = new WhisperSttProvider({ apiKey: 'k', fetch: fakeFetch().impl, zeroRetentionConfirmed: false });
    expect(p.descriptor).toMatchObject({ retentionKnown: false, trainingOptOut: 'unknown' });
  });
});
