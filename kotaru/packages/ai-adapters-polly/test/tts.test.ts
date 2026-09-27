import { describe, expect, it } from 'vitest';
import type { SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { ProviderError, type AudioChunk, type ProviderContext, type TextChunk, type VoiceConfig } from '@kotaru/ai-contracts';
import { PollyTtsProvider, type PollyLike } from '../src/index.js';

/** Cliente falso: registra las peticiones y devuelve PCM en trozos irregulares. */
function fakePolly(opts: { fail?: { name: string; status: number }; bytesPerChar?: number; pieces?: number } = {}) {
  const calls: SynthesizeSpeechCommand['input'][] = [];
  const client: PollyLike = {
    async send(command) {
      calls.push(command.input);
      if (opts.fail) throw Object.assign(new Error('x'), { name: opts.fail.name, $metadata: { httpStatusCode: opts.fail.status } });
      const total = (command.input.Text?.length ?? 0) * (opts.bytesPerChar ?? 700) + 1; // impar a proposito
      const pieces = opts.pieces ?? 7;
      return {
        AudioStream: (async function* () {
          const size = Math.ceil(total / pieces);
          for (let sent = 0; sent < total; sent += size) yield new Uint8Array(Math.min(size, total - sent));
        })(),
      };
    },
  };
  return { client, calls };
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
const make = (client: PollyLike, extra = {}) =>
  new PollyTtsProvider({ client, aiOptOutConfirmed: true, commercialTermsReviewed: true, ...extra });

describe('Amazon Polly neural', () => {
  it('pide neural en PCM a 16 kHz con la voz del idioma, una peticion por oracion', async () => {
    const { client, calls } = fakePolly();
    await collect(make(client).synthesizeStream(sentences('Hola.', 'Que tal?'), voice(), ctx()));
    expect(calls).toHaveLength(2);
    expect(calls[0]).toMatchObject({ Engine: 'neural', OutputFormat: 'pcm', SampleRate: '16000', VoiceId: 'Mia', LanguageCode: 'es-MX', Text: 'Hola.', TextType: 'text' });
  });

  it('elige voz masculina o femenina segun el companion, y por idioma', async () => {
    const { client, calls } = fakePolly();
    const p = make(client, { maleVoices: ['sage-voz'] });
    await collect(p.synthesizeStream(sentences('Hi.'), voice({ voiceId: 'sage-voz', locale: 'en-US' }), ctx()));
    await collect(p.synthesizeStream(sentences('Hola.'), voice({ locale: 'es-ES' }), ctx()));
    expect(calls.map((c) => c.VoiceId)).toEqual(['Matthew', 'Lucia']);
  });

  it('reenvia el audio en trozos de 100 ms, siempre con muestras completas', async () => {
    const { client } = fakePolly();
    const chunks = await collect(make(client).synthesizeStream(sentences('Una oracion de prueba.'), voice(), ctx()));
    expect(chunks.every((c) => c.sampleRate === 16000 && c.pcm.byteLength % 2 === 0)).toBe(true);
    expect(chunks.slice(0, -1).every((c) => c.pcm.byteLength === 3200)).toBe(true);
    expect(chunks.map((c) => c.seq)).toEqual(chunks.map((_, i) => i));
  });

  it('la velocidad va por SSML con el texto escapado: el usuario no puede inyectar etiquetas', async () => {
    const { client, calls } = fakePolly();
    await collect(make(client).synthesizeStream(sentences('uno <break time="10s"/> & dos'), voice({ speed: 1.1 }), ctx()));
    expect(calls[0]).toMatchObject({ TextType: 'ssml' });
    expect(calls[0]!.Text).toBe('<speak><prosody rate="110%">uno &lt;break time=&quot;10s&quot;/&gt; &amp; dos</prosody></speak>');
  });

  it('parte un texto enorme por debajo del limite de 3000 caracteres', async () => {
    const { client, calls } = fakePolly({ bytesPerChar: 1 });
    await collect(make(client).synthesizeStream(sentences(('palabra '.repeat(900)).trim()), voice(), ctx()));
    expect(calls.length).toBe(3);
    expect(calls.every((c) => (c.Text?.length ?? 0) <= 2500)).toBe(true);
  });

  it('cobra 16 USD por millon de caracteres, con tarifa verificada', () => {
    const { client } = fakePolly();
    expect(make(client).estimate({ characters: 1000 }, ctx())).toEqual({
      amountUsd: 0.016, basis: 'verified', rateCardVersion: 'polly-neural@2026-09-27', verifiedAt: '2026-09-27',
    });
  });

  it('el limite de ritmo es reintentable; credenciales malas no', async () => {
    const throttled = fakePolly({ fail: { name: 'ThrottlingException', status: 400 } });
    const e1 = await collect(make(throttled.client).synthesizeStream(sentences('x.'), voice(), ctx())).catch((e: unknown) => e);
    expect(e1).toBeInstanceOf(ProviderError);
    expect(e1).toMatchObject({ code: 'throttling', retryable: true });

    const denied = fakePolly({ fail: { name: 'UnrecognizedClientException', status: 403 } });
    const e2 = await collect(make(denied.client).synthesizeStream(sentences('x.'), voice(), ctx())).catch((e: unknown) => e);
    expect(e2).toMatchObject({ code: 'unrecognized_client', retryable: false, status: 403 });
  });

  it('al interrumpir no pide mas oraciones', async () => {
    const { client, calls } = fakePolly();
    const controller = new AbortController();
    const out: AudioChunk[] = [];
    for await (const c of make(client).synthesizeStream(sentences('Uno.', 'Dos.', 'Tres.'), voice(), ctx(controller.signal))) {
      out.push(c);
      controller.abort();
    }
    expect(calls).toHaveLength(1);
  });

  it('sin exclusion de IA ni terminos revisados, el router no puede usarlo', () => {
    const p = new PollyTtsProvider({ client: fakePolly().client, aiOptOutConfirmed: false, commercialTermsReviewed: false });
    expect(p.descriptor).toMatchObject({ retentionKnown: false, commercialAudioRights: 'unknown' });
  });
});
