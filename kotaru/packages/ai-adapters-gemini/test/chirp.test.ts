import { createVerify, generateKeyPairSync } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ProviderError, type AudioChunk, type ProviderContext, type TextChunk, type VoiceConfig } from '@kotaru/ai-contracts';
import { CHIRP_RATE, ChirpTtsProvider, chirpVoiceName, stripWav } from '../src/index.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const credentials = {
  client_email: 'kotaru-voz@kotaru-509922.iam.gserviceaccount.com',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  token_uri: 'https://oauth2.googleapis.com/token',
};

interface Call { url: string; headers: Record<string, string>; body: string }

function wav(bytes: number): string {
  const out = new Uint8Array(44 + bytes);
  const put = (s: string, at: number) => out.set([...s].map((c) => c.charCodeAt(0)), at);
  put('RIFF', 0);
  put('WAVE', 8);
  put('fmt ', 12);
  new DataView(out.buffer).setUint32(16, 16, true);
  put('data', 36);
  new DataView(out.buffer).setUint32(40, bytes, true);
  return Buffer.from(out).toString('base64');
}

function fakeFetch(opts: { ttsStatus?: number; tokenStatus?: number; bytesPerChar?: number } = {}) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    calls.push({ url, headers: init.headers as Record<string, string>, body: String(init.body) });
    if (url.includes('oauth2')) {
      if (opts.tokenStatus) return new Response('{"error":"invalid_grant"}', { status: opts.tokenStatus });
      return new Response(JSON.stringify({ access_token: 'token-de-prueba', expires_in: 3600 }), { status: 200 });
    }
    if (opts.ttsStatus) return new Response('{"error":{"status":"PERMISSION_DENIED"}}', { status: opts.ttsStatus });
    const body = JSON.parse(String(init.body));
    return new Response(JSON.stringify({ audioContent: wav(body.input.text.length * (opts.bytesPerChar ?? 960)) }), { status: 200 });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const ctx = (): ProviderContext =>
  ({ requestId: 'r', subjectId: 's', region: 'us', locale: 'es-US', sensitivity: 'normal', budget: { remainingUsd: 1 }, deadlineMs: 5000, signal: new AbortController().signal }) as unknown as ProviderContext;
const voice = (v: Partial<VoiceConfig> = {}): VoiceConfig => ({ voiceId: 'nova', locale: 'es-US', ...v }) as VoiceConfig;
async function* sentences(...texts: string[]): AsyncIterable<TextChunk> {
  for (const text of texts) yield { text, isFinal: false };
}
async function collect(it: AsyncIterable<AudioChunk>) {
  const out: AudioChunk[] = [];
  for await (const c of it) out.push(c);
  return out;
}
const make = (f: typeof fetch, extra = {}) =>
  new ChirpTtsProvider({
    credentials,
    fetch: f,
    termsReviewed: true,
    voices: { nova: { voice: 'Leda', speakingRate: 0.95 }, luna: { voice: 'Vindemiatrix' }, rio: { voice: 'Algieba', speakingRate: 1.03 } },
    fallback: { voice: 'Algieba' },
    ...extra,
  });

describe('Google Cloud TTS con voces Chirp 3 HD', () => {
  it('nombres de voz: es-US para español (es-ES si es España) y en-US para ingles', () => {
    expect(chirpVoiceName('Leda', 'es-419')).toEqual({ name: 'es-US-Chirp3-HD-Leda', languageCode: 'es-US' });
    expect(chirpVoiceName('Leda', 'es-ES').name).toBe('es-ES-Chirp3-HD-Leda');
    expect(chirpVoiceName('Algieba', 'en-US').name).toBe('en-US-Chirp3-HD-Algieba');
  });

  it('firma el JWT de la cuenta de servicio con su clave (RS256) y pide el token una sola vez', async () => {
    const { impl, calls } = fakeFetch();
    const p = make(impl);
    await collect(p.synthesizeStream(sentences('Hola.', 'Qué tal.'), voice(), ctx()));
    const tokenCalls = calls.filter((c) => c.url.includes('oauth2'));
    expect(tokenCalls).toHaveLength(1);
    const assertion = new URLSearchParams(tokenCalls[0]!.body).get('assertion')!;
    const [h, c, sig] = assertion.split('.');
    const claims = JSON.parse(Buffer.from(c!, 'base64url').toString());
    expect(claims).toMatchObject({ iss: credentials.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: credentials.token_uri });
    const verify = createVerify('RSA-SHA256');
    verify.update(`${h}.${c}`);
    expect(verify.verify(publicKey, Buffer.from(sig!, 'base64url'))).toBe(true);
    // La clave privada nunca viaja: solo la afirmacion firmada.
    expect(calls.some((x) => x.body.includes('PRIVATE KEY'))).toBe(false);
  });

  it('pide la voz Chirp 3 HD del personaje en PCM 24 kHz con su velocidad, y quita la cabecera WAV', async () => {
    const { impl, calls } = fakeFetch({ bytesPerChar: 960 });
    const chunks = await collect(make(impl).synthesizeStream(sentences('Hola.'), voice(), ctx()));
    const tts = calls.find((c) => c.url.includes('texttospeech'))!;
    expect(tts.headers['authorization']).toBe('Bearer token-de-prueba');
    expect(JSON.parse(tts.body)).toEqual({
      input: { text: 'Hola.' },
      voice: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Leda' },
      audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 24000, speakingRate: 0.95 },
    });
    const total = chunks.reduce((n, c) => n + c.pcm.byteLength, 0);
    expect(total).toBe(5 * 960);
    expect(chunks.every((c) => c.sampleRate === 24000 && c.pcm.byteLength % 2 === 0)).toBe(true);
  });

  it('Luna sin velocidad no la envia; un personaje desconocido usa la voz de respaldo', async () => {
    const { impl, calls } = fakeFetch();
    await collect(make(impl).synthesizeStream(sentences('Hola.'), voice({ voiceId: 'luna' }), ctx()));
    await collect(make(impl).synthesizeStream(sentences('Hi.'), voice({ voiceId: 'otro', locale: 'en-US' }), ctx()));
    const bodies = calls.filter((c) => c.url.includes('texttospeech')).map((c) => JSON.parse(c.body));
    expect(bodies[0].audioConfig.speakingRate).toBeUndefined();
    expect(bodies[0].voice.name).toBe('es-US-Chirp3-HD-Vindemiatrix');
    expect(bodies[1].voice.name).toBe('en-US-Chirp3-HD-Algieba');
  });

  it('credenciales malas: error no reintentable; 429 y 5xx: reintentables (el router pasa al respaldo)', async () => {
    const bad = fakeFetch({ tokenStatus: 400 });
    const e1 = await collect(make(bad.impl).synthesizeStream(sentences('Hola.'), voice(), ctx())).catch((e) => e);
    expect(e1).toBeInstanceOf(ProviderError);
    expect(e1.retryable).toBe(false);
    const busy = fakeFetch({ ttsStatus: 429 });
    const e2 = await collect(make(busy.impl).synthesizeStream(sentences('Hola.'), voice(), ctx())).catch((e) => e);
    expect(e2.retryable).toBe(true);
    const denied = fakeFetch({ ttsStatus: 403 });
    const e3 = await collect(make(denied.impl).synthesizeStream(sentences('Hola.'), voice(), ctx())).catch((e) => e);
    expect(e3.retryable).toBe(false);
  });

  it('sin terminos revisados, el router no lo puede elegir; costo a 30 USD por millon', () => {
    const { impl } = fakeFetch();
    expect(make(impl, { termsReviewed: false }).descriptor).toMatchObject({ trainingOptOut: false, commercialAudioRights: 'unknown' });
    expect(make(impl).estimate({ characters: 1000 }, ctx())).toMatchObject({ amountUsd: 0.03, basis: 'verified', rateCardVersion: CHIRP_RATE.version });
  });

  it('quita la cabecera WAV y deja pasar PCM sin cabecera', () => {
    expect(stripWav(new Uint8Array(Buffer.from(wav(10), 'base64'))).byteLength).toBe(10);
    expect(stripWav(new Uint8Array([1, 2, 3, 4])).byteLength).toBe(4);
  });

  it('una cuenta de servicio sin clave se rechaza al arrancar', () => {
    expect(() => make(fakeFetch().impl, { credentials: { client_email: 'x', private_key: '' } })).toThrow(/private_key/);
  });
});
