import { createSign } from 'node:crypto';
import {
  ProviderError,
  type AudioChunk,
  type CostEstimate,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
  type TextChunk,
  type TextToSpeechProvider,
  type VoiceConfig,
} from '@kotaru/ai-contracts';

/**
 * Google Cloud Text-to-Speech con voces Chirp 3 HD: las mismas voces que Gemini TTS (Leda,
 * Vindemiatrix, Algieba) sin el tope de 100 peticiones diarias del nivel 1 de Gemini.
 *
 * Verificado el 2026-09-29:
 * - https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd: nombres
 *   `<locale>-Chirp3-HD-<voz>` (p. ej. "en-US-Chirp3-HD-Kore"); Leda, Vindemiatrix y
 *   Algieba existen; en-US, es-ES y es-US; velocidad de 0,25x a 2x.
 * - https://cloud.google.com/text-to-speech/pricing: Chirp 3 HD, 30 USD por millon de
 *   caracteres; el primer millon de cada mes, gratis.
 *
 * No acepta instrucciones de actuacion (eso solo Gemini): el caracter se da con la
 * velocidad de cada personaje. Autenticacion con cuenta de servicio (JWT firmado con su
 * clave privada -> token OAuth), sin SDK. La clave vive en el servidor
 * (/etc/kotaru/google-tts.json, chmod 600) y nunca sale en logs.
 */
export const CHIRP_RATE = { version: 'google-chirp3-hd@2026-09-29', verifiedAt: '2026-09-29', perMillionCharsUsd: 30 } as const;

const TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const SAMPLE_RATE = 24000;
const CHUNK_BYTES = (SAMPLE_RATE * 2 * 100) / 1000;
/** Google limita la entrada a 5000 bytes; se corta antes, en un espacio. */
const MAX_CHARS_PER_REQUEST = 1500;

export interface GoogleServiceAccount {
  readonly client_email: string;
  readonly private_key: string;
  readonly token_uri?: string;
}

/** Voz Chirp 3 HD y velocidad de un personaje. */
export interface ChirpVoice {
  /** Nombre corto: Leda, Vindemiatrix, Algieba… */
  readonly voice: string;
  /** 0,25 a 2 (1 = normal). */
  readonly speakingRate?: number;
}

export interface ChirpTtsOptions {
  readonly credentials: GoogleServiceAccount;
  readonly voices: Readonly<Record<string, ChirpVoice>>;
  readonly fallback: ChirpVoice;
  /**
   * El operador reviso los terminos de Google Cloud (sin entrenamiento con los datos del
   * cliente; uso comercial del audio). Sin esto el router no lo elige.
   */
  readonly termsReviewed: boolean;
  readonly fetch?: typeof fetch;
  readonly now?: () => number;
}

/** Nombre de voz de Google para un locale de Kotaru: es-* -> es-US (salvo es-ES), en-* -> en-US. */
export function chirpVoiceName(voice: string, locale: string): { name: string; languageCode: string } {
  const languageCode = locale === 'es-ES' ? 'es-ES' : locale.startsWith('es') ? 'es-US' : 'en-US';
  return { name: `${languageCode}-Chirp3-HD-${voice}`, languageCode };
}

export class ChirpTtsProvider implements TextToSpeechProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #options: ChirpTtsOptions;
  readonly #fetch: typeof fetch;
  readonly #now: () => number;
  #token: { value: string; expiresAt: number } | null = null;
  #lastError: number | null = null;

  constructor(options: ChirpTtsOptions) {
    if (!options.credentials?.client_email || !options.credentials.private_key) {
      throw new Error('Chirp: faltan client_email o private_key en la cuenta de servicio');
    }
    this.#options = options;
    this.#fetch = options.fetch ?? fetch;
    this.#now = options.now ?? Date.now;
    this.descriptor = {
      id: 'google-chirp3-hd',
      capability: 'tts',
      regions: ['us'],
      locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      retentionKnown: options.termsReviewed,
      trainingOptOut: options.termsReviewed,
      commercialAudioRights: options.termsReviewed ? true : 'unknown',
      // Mismas voces que Gemini, sin su actuacion: por debajo de Gemini y por encima de Cartesia.
      quality: 0.86,
      enabled: true,
    };
  }

  /** Token OAuth de la cuenta de servicio (cacheado hasta un minuto antes de caducar). */
  async #accessToken(signal: AbortSignal): Promise<string> {
    if (this.#token && this.#now() < this.#token.expiresAt - 60_000) return this.#token.value;
    const { client_email, private_key, token_uri } = this.#options.credentials;
    const audience = token_uri ?? 'https://oauth2.googleapis.com/token';
    const iat = Math.floor(this.#now() / 1000);
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claims = b64url(JSON.stringify({ iss: client_email, scope: SCOPE, aud: audience, iat, exp: iat + 3600 }));
    const signer = createSign('RSA-SHA256');
    signer.update(`${header}.${claims}`);
    const assertion = `${header}.${claims}.${signer.sign(private_key).toString('base64url')}`;
    const response = await this.#fetch(audience, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }).toString(),
      signal,
    });
    if (!response.ok) {
      this.#lastError = this.#now();
      // 400/401: credenciales malas o revocadas; no tiene sentido reintentar.
      throw new ProviderError(this.descriptor.id, `auth_http_${response.status}`, response.status >= 500, response.status);
    }
    const body = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!body.access_token) throw new ProviderError(this.descriptor.id, 'auth_no_token', false);
    this.#token = { value: body.access_token, expiresAt: this.#now() + (body.expires_in ?? 3600) * 1000 };
    return this.#token.value;
  }

  async *synthesizeStream(text: AsyncIterable<TextChunk>, voice: VoiceConfig, ctx: ProviderContext): AsyncIterable<AudioChunk> {
    const chosen = this.#options.voices[voice.voiceId] ?? this.#options.fallback;
    const { name, languageCode } = chirpVoiceName(chosen.voice, voice.locale);
    const rate = chosen.speakingRate !== undefined ? Math.min(2, Math.max(0.25, chosen.speakingRate)) : undefined;
    let seq = 0;

    for await (const chunk of text) {
      if (ctx.signal.aborted) return;
      for (const piece of split(chunk.text.trim())) {
        const signal = AbortSignal.any([ctx.signal, AbortSignal.timeout(ctx.deadlineMs)]);
        let response: Response;
        try {
          const token = await this.#accessToken(signal);
          response = await this.#fetch(TTS_URL, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
            body: JSON.stringify({
              input: { text: piece },
              voice: { languageCode, name },
              audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: SAMPLE_RATE, ...(rate !== undefined && rate !== 1 ? { speakingRate: rate } : {}) },
            }),
            signal,
          });
        } catch (error) {
          if (ctx.signal.aborted) return;
          if (error instanceof ProviderError) throw error;
          this.#lastError = this.#now();
          throw new ProviderError(this.descriptor.id, signal.aborted ? 'deadline' : 'network', true);
        }
        if (!response.ok) {
          this.#lastError = this.#now();
          if (response.status === 401) this.#token = null;
          throw new ProviderError(this.descriptor.id, `http_${response.status}`, response.status === 429 || response.status >= 500, response.status);
        }
        const body = (await response.json()) as { audioContent?: string };
        if (!body.audioContent) {
          this.#lastError = this.#now();
          throw new ProviderError(this.descriptor.id, 'empty_audio', true);
        }
        const pcm = stripWav(new Uint8Array(Buffer.from(body.audioContent, 'base64')));
        const even = pcm.byteLength - (pcm.byteLength % 2);
        for (let at = 0; at < even; at += CHUNK_BYTES) {
          if (ctx.signal.aborted) return;
          yield { pcm: pcm.slice(at, Math.min(even, at + CHUNK_BYTES)), sampleRate: SAMPLE_RATE, seq: seq++ };
        }
      }
    }
  }

  estimate(input: { readonly characters: number }, _ctx: ProviderContext): CostEstimate {
    // Sin descontar el millon gratis de cada mes: mejor sobrestimar.
    return {
      amountUsd: Math.round(((input.characters * CHIRP_RATE.perMillionCharsUsd) / 1e6) * 1e6) / 1e6,
      basis: 'verified',
      rateCardVersion: CHIRP_RATE.version,
      verifiedAt: CHIRP_RATE.verifiedAt,
    };
  }

  async health(): Promise<ProviderHealth> {
    const recent = this.#lastError !== null && this.#now() - this.#lastError < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }
}

function b64url(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64url');
}

/** LINEAR16 llega con cabecera WAV: se busca el bloque "data" y se devuelve lo que sigue. */
export function stripWav(bytes: Uint8Array): Uint8Array {
  const ascii = (at: number) => String.fromCharCode(...bytes.subarray(at, at + 4));
  if (bytes.byteLength < 12 || ascii(0) !== 'RIFF' || ascii(8) !== 'WAVE') return bytes;
  let at = 12;
  while (at + 8 <= bytes.byteLength) {
    const size = new DataView(bytes.buffer, bytes.byteOffset + at + 4, 4).getUint32(0, true);
    if (ascii(at) === 'data') return bytes.slice(at + 8, Math.min(bytes.byteLength, at + 8 + size));
    at += 8 + size;
  }
  return new Uint8Array(0);
}

function split(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  let rest = text;
  while (rest.length > MAX_CHARS_PER_REQUEST) {
    const cut = rest.lastIndexOf(' ', MAX_CHARS_PER_REQUEST);
    const at = cut > 0 ? cut : MAX_CHARS_PER_REQUEST;
    out.push(rest.slice(0, at));
    rest = rest.slice(at).trimStart();
  }
  if (rest) out.push(rest);
  return out;
}
