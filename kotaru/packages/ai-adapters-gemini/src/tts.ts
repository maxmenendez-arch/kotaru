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
 * Tarifas verificadas el 2026-09-27 en https://ai.google.dev/gemini-api/docs/pricing
 * (nivel de pago, por millon de tokens; el audio son 25 tokens por segundo). Suben el
 * 1 de enero de 2027; `rateFor` elige segun la fecha.
 */
export const GEMINI_TTS_RATES = {
  'gemini-3.8-flash-lite-tts': [
    { until: '2027-01-01', input: 0.5, outputAudio: 6 },
    { until: '9999-12-31', input: 1, outputAudio: 12 },
  ],
  'gemini-3.8-flash-tts': [
    { until: '2027-01-01', input: 0.5, outputAudio: 9 },
    { until: '9999-12-31', input: 1, outputAudio: 18 },
  ],
} as const;
export type GeminiTtsModel = keyof typeof GEMINI_TTS_RATES;
const RATE_VERSION_DATE = '2026-09-27';
const AUDIO_TOKENS_PER_SECOND = 25;
/**
 * ASSUMPTION: caracteres por segundo al hablar, para estimar el audio antes de sintetizar
 * (04_VOICE_ECONOMICS: medirlo en espanol e ingles). El costo real sale del consumo que
 * devuelve Google.
 */
const CHARS_PER_SECOND = 15;

const DEFAULT_BASE = 'https://generativelanguage.googleapis.com';
const SAMPLE_RATE = 24000;
const CHUNK_BYTES = (SAMPLE_RATE * 2 * 100) / 1000;
const MAX_CHARS_PER_REQUEST = 1200;

/** Voz de Gemini y forma de hablar de un personaje (por id de voz de Kotaru). */
export interface GeminiVoice {
  /** Una de las 30 voces predefinidas (Kore, Leda, Achird…). */
  readonly voice: string;
  /** Como habla, en lenguaje natural (`speech_metadata.style`). */
  readonly style: { readonly es: string; readonly en: string };
}

export interface GeminiTtsOptions {
  readonly apiKey: string;
  readonly model?: GeminiTtsModel;
  readonly baseUrl?: string;
  readonly fetch?: typeof fetch;
  /** Misma confirmacion que el LLM: sin facturacion, Google usa el contenido. */
  readonly paidTierConfirmed: boolean;
  /** Voz por personaje. Una voz de Kotaru que no este aqui usa `fallback`. */
  readonly voices: Readonly<Record<string, GeminiVoice>>;
  readonly fallback: GeminiVoice;
  readonly now?: () => number;
}

interface StreamEvent {
  event_type?: string;
  delta?: { type?: string; data?: string; mime_type?: string };
  error?: { message?: string; status?: string; code?: number };
}

/**
 * Texto a voz con Gemini TTS por la Interactions API (`POST /v1beta/interactions`, SSE).
 *
 * Una peticion por oracion (el orquestador las entrega en cuanto el modelo las termina),
 * con la voz y el estilo del personaje. El texto se lee tal cual (Gemini 3.8 TTS trata el
 * texto como transcripcion literal) y el estilo va aparte, como anotacion.
 *
 * Verificado en la documentacion el 2026-09-27: formato de la peticion, eventos
 * `step.delta` con `delta.type = "audio"` y base64, PCM 16 bits a 24 kHz. El audio puede
 * llegar con cabecera WAV; se quita.
 */
export class GeminiTtsProvider implements TextToSpeechProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #options: GeminiTtsOptions;
  readonly #model: GeminiTtsModel;
  readonly #fetch: typeof fetch;
  readonly #now: () => number;
  #lastError: number | null = null;
  /** Cuota agotada (p. ej. el tope diario de peticiones): no se llama a Google hasta entonces. */
  #blockedUntil = 0;

  constructor(options: GeminiTtsOptions) {
    if (!options.apiKey) throw new Error('Gemini TTS: falta la clave de API');
    this.#options = options;
    this.#model = options.model ?? 'gemini-3.8-flash-lite-tts';
    this.#fetch = options.fetch ?? fetch;
    this.#now = options.now ?? Date.now;
    this.descriptor = {
      id: this.#model,
      capability: 'tts',
      regions: ['us'],
      locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      retentionKnown: true,
      trainingOptOut: options.paidTierConfirmed,
      // "Google won't claim ownership over that content" (ai.google.dev/gemini-api/terms,
      // consultado el 2026-09-27). Solo con el nivel de pago confirmado.
      commercialAudioRights: options.paidTierConfirmed ? true : 'unknown',
      quality: this.#model === 'gemini-3.8-flash-tts' ? 0.92 : 0.88,
      enabled: true,
    };
  }

  async *synthesizeStream(text: AsyncIterable<TextChunk>, voice: VoiceConfig, ctx: ProviderContext): AsyncIterable<AudioChunk> {
    const chosen = this.#options.voices[voice.voiceId] ?? this.#options.fallback;
    const style = voice.locale.startsWith('es') ? chosen.style.es : chosen.style.en;
    let seq = 0;

    if (this.#now() < this.#blockedUntil) {
      // Cuota agotada: se falla al instante para que el orquestador pase al respaldo sin
      // esperar a Google en cada turno.
      throw new ProviderError(this.descriptor.id, 'quota_exhausted', true, 429);
    }

    for await (const group of batched(text)) {
      if (ctx.signal.aborted) return;
      for (const piece of split(group)) {
        const signal = AbortSignal.any([ctx.signal, AbortSignal.timeout(ctx.deadlineMs)]);
        let response: Response;
        try {
          response = await this.#fetch(`${this.#options.baseUrl ?? DEFAULT_BASE}/v1beta/interactions`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-goog-api-key': this.#options.apiKey, accept: 'text/event-stream' },
            body: JSON.stringify({
              model: this.#model,
              input: [
                {
                  type: 'user_input',
                  content: [
                    {
                      type: 'text',
                      text: piece,
                      ...(voice.expressive ? { annotations: [{ type: 'speech_metadata', style }] } : {}),
                    },
                  ],
                },
              ],
              response_format: { type: 'audio' },
              generation_config: { speech_config: [{ voice: chosen.voice }] },
              stream: true,
            }),
            signal,
          });
        } catch {
          if (ctx.signal.aborted) return;
          this.#lastError = this.#now();
          throw new ProviderError(this.descriptor.id, signal.aborted ? 'deadline' : 'network', true);
        }
        if (!response.ok) {
          this.#lastError = this.#now();
          const error = await httpError(this.descriptor.id, response);
          if (error.status === 429) this.#blockedUntil = this.#now() + error.retryAfterMs;
          throw error;
        }

        const pcm = new PcmStripper();
        let carry: Uint8Array = new Uint8Array(0);
        try {
          for await (const event of sse(response)) {
            if (ctx.signal.aborted) return;
            if (event.error) {
              this.#lastError = this.#now();
              const quota = quotaWait(`${event.error.status ?? ''} ${event.error.message ?? ''}`, event.error.code);
              if (quota !== null) {
                this.#blockedUntil = this.#now() + quota;
                throw new ProviderError(this.descriptor.id, 'quota_exhausted', true, 429);
              }
              throw new ProviderError(this.descriptor.id, (event.error.status ?? 'stream_error').toLowerCase(), true);
            }
            if (event.event_type !== 'step.delta' || event.delta?.type !== 'audio' || !event.delta.data) continue;
            carry = concat(carry, pcm.push(base64(event.delta.data)));
            while (carry.byteLength >= CHUNK_BYTES) {
              yield { pcm: carry.slice(0, CHUNK_BYTES), sampleRate: SAMPLE_RATE, seq: seq++ };
              carry = carry.slice(CHUNK_BYTES);
            }
          }
        } catch (error) {
          if (ctx.signal.aborted) return;
          if (error instanceof ProviderError) throw error;
          this.#lastError = this.#now();
          throw new ProviderError(this.descriptor.id, 'stream_interrupted', true);
        }
        const even = carry.byteLength - (carry.byteLength % 2);
        if (even > 0) yield { pcm: carry.slice(0, even), sampleRate: SAMPLE_RATE, seq: seq++ };
      }
    }
  }

  estimate(input: { readonly characters: number }, _ctx: ProviderContext): CostEstimate {
    const rate = rateFor(this.#model, this.#now());
    const audioTokens = (input.characters / CHARS_PER_SECOND) * AUDIO_TOKENS_PER_SECOND;
    const textTokens = input.characters / 4;
    const usd = (audioTokens * rate.outputAudio + textTokens * rate.input) / 1e6;
    return {
      amountUsd: Math.round(usd * 1e6) / 1e6,
      // La tarifa esta verificada; los caracteres por segundo, no.
      basis: 'assumption',
      rateCardVersion: `${this.#model}@${RATE_VERSION_DATE}`,
    };
  }

  async health(): Promise<ProviderHealth> {
    if (this.#now() < this.#blockedUntil) {
      return { status: 'down', p95LatencyMs: 0, errorRate: 1, observedAt: new Date().toISOString() };
    }
    const recent = this.#lastError !== null && this.#now() - this.#lastError < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }
}

export function rateFor(model: GeminiTtsModel, nowMs: number): { input: number; outputAudio: number } {
  const day = new Date(nowMs).toISOString().slice(0, 10);
  return GEMINI_TTS_RATES[model].find((r) => day < r.until) ?? GEMINI_TTS_RATES[model].at(-1)!;
}

/**
 * Quita la cabecera WAV si el primer trozo la trae ("RIFF"… hasta el bloque "data").
 * Si no, deja pasar el PCM tal cual.
 */
class PcmStripper {
  #decided = false;
  #pending: Uint8Array = new Uint8Array(0);

  push(bytes: Uint8Array): Uint8Array {
    if (this.#decided) return bytes;
    this.#pending = concat(this.#pending, bytes);
    if (this.#pending.byteLength < 12) return new Uint8Array(0);
    const riff = ascii(this.#pending, 0, 4) === 'RIFF' && ascii(this.#pending, 8, 4) === 'WAVE';
    if (!riff) {
      this.#decided = true;
      const out = this.#pending;
      this.#pending = new Uint8Array(0);
      return out;
    }
    // Recorre los bloques hasta "data".
    let at = 12;
    while (at + 8 <= this.#pending.byteLength) {
      const id = ascii(this.#pending, at, 4);
      const size = new DataView(this.#pending.buffer, this.#pending.byteOffset + at + 4, 4).getUint32(0, true);
      if (id === 'data') {
        this.#decided = true;
        const out = this.#pending.slice(at + 8);
        this.#pending = new Uint8Array(0);
        return out;
      }
      at += 8 + size;
    }
    return new Uint8Array(0);
  }
}

function ascii(bytes: Uint8Array, at: number, length: number): string {
  return String.fromCharCode(...bytes.subarray(at, at + length));
}

function base64(data: string): Uint8Array {
  return new Uint8Array(Buffer.from(data, 'base64'));
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

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.byteLength === 0) return b;
  if (b.byteLength === 0) return a;
  const out = new Uint8Array(a.byteLength + b.byteLength);
  out.set(a, 0);
  out.set(b, a.byteLength);
  return out;
}

async function httpError(providerId: string, response: Response): Promise<ProviderError & { retryAfterMs: number }> {
  let status = '';
  let message = '';
  try {
    const body = (await response.json()) as { error?: { status?: string; message?: string } };
    status = body.error?.status ?? '';
    message = body.error?.message ?? '';
  } catch {
    // cuerpo no JSON
  }
  const retryable = response.status === 429 || response.status >= 500;
  const error = new ProviderError(providerId, (status || `http_${response.status}`).toLowerCase(), retryable, response.status);
  return Object.assign(error, { retryAfterMs: quotaWait(message, response.status) ?? QUOTA_MIN_WAIT_MS });
}

/** Sin plazo en el mensaje, un 429 aparta a Gemini este tiempo. */
const QUOTA_MIN_WAIT_MS = 60_000;
/** Nunca mas de un dia: si Google dice otra cosa rara, se vuelve a probar manana. */
const QUOTA_MAX_WAIT_MS = 24 * 3600_000;

/**
 * Cuanto esperar si el error es de cuota. Google lo dice en el mensaje ("Please retry in
 * 17h29m40s" o "retry in 12.5s"); null si no es un error de cuota.
 */
export function quotaWait(message: string, code?: number): number | null {
  const isQuota = code === 429 || /rate limit|quota|resource.?exhausted/i.test(message);
  if (!isQuota) return null;
  const m = /retry in\s+(?:(\d+)h)?(?:(\d+)m)?(?:([\d.]+)s)?/i.exec(message);
  if (!m || (!m[1] && !m[2] && !m[3])) return QUOTA_MIN_WAIT_MS;
  const ms = ((Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0)) * 60 + Number(m[3] ?? 0)) * 1000;
  return Math.min(QUOTA_MAX_WAIT_MS, Math.max(1000, Math.ceil(ms)));
}

/**
 * Agrupa el texto que llega por frases en MENOS peticiones: la primera frase sale sola
 * (para que la voz empiece cuanto antes) y todo lo demas va junto en una segunda peticion.
 * Cada peticion cuenta para la cuota diaria de Google, asi que un turno usa 1 o 2, no una
 * por frase.
 */
async function* batched(text: AsyncIterable<TextChunk>): AsyncIterable<string> {
  let first = true;
  let rest = '';
  for await (const chunk of text) {
    const piece = chunk.text.trim();
    if (!piece) continue;
    if (first) {
      first = false;
      yield piece;
    } else {
      rest = rest ? `${rest} ${piece}` : piece;
    }
  }
  if (rest) yield rest;
}

/** Lee un cuerpo SSE y entrega cada `data:` ya parseado (ignora `[DONE]` y comentarios). */
async function* sse(response: Response): AsyncIterable<StreamEvent> {
  if (!response.body) return;
  const decoder = new TextDecoder();
  let buffer = '';
  const parse = (event: string): StreamEvent | null => {
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n');
    if (!data || data === '[DONE]') return null;
    return JSON.parse(data) as StreamEvent;
  };
  for await (const bytes of response.body as unknown as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(bytes, { stream: true });
    let boundary: number;
    while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
      const event = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, '');
      const parsed = parse(event);
      if (parsed) yield parsed;
    }
  }
  const last = parse(buffer + decoder.decode());
  if (last) yield last;
}
