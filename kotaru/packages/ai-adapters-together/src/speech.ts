import {
  ProviderError,
  type AudioChunk,
  type CostEstimate,
  type Locale,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
  type TextChunk,
  type TextToSpeechProvider,
  type VoiceConfig,
} from '@kotaru/ai-contracts';

/** Tarifa de un modelo de voz de Together, por millon de caracteres. */
export interface TogetherVoiceRate {
  readonly version: string;
  readonly verifiedAt: string;
  readonly perMillionCharsUsd: number;
}

/** Lo que distingue un modelo de voz de Together de otro. */
export interface TogetherVoiceModel {
  /** Id del proveedor en Kotaru (router, metricas). */
  readonly id: string;
  /** Modelo en la API de Together. */
  readonly model: string;
  readonly rate: TogetherVoiceRate;
  /** Calidad relativa para el router (0-1). */
  readonly quality: number;
  /** Voz e idioma para un personaje (voiceId de Kotaru) en un locale. */
  voiceFor(voiceId: string, locale: Locale, male: boolean): { readonly voice: string; readonly language: string };
}

const DEFAULT_BASE = 'https://api.together.ai';

/** 24 kHz: una de las frecuencias que acepta el protocolo de Kotaru. */
const SAMPLE_RATE = 24000;
/** Trozos de 100 ms hacia el cliente. */
const CHUNK_BYTES = (SAMPLE_RATE * 2 * 100) / 1000;
/** Oraciones largas se parten: menos espera hasta el primer audio y peticiones acotadas. */
const MAX_CHARS_PER_REQUEST = 1000;

export interface TogetherSpeechOptions {
  readonly apiKey: string;
  readonly baseUrl?: string;
  readonly fetch?: typeof fetch;
  /**
   * El operador confirma que la cuenta de Together tiene activada la retencion cero (Zero
   * Data Retention, en Privacy & Security). Together dice no entrenar sin consentimiento,
   * pero sin ZDR guarda el texto un tiempo no publicado: el router no debe elegirlo.
   */
  readonly zeroRetentionConfirmed: boolean;
  /** El operador confirma haber revisado los terminos de Together sobre el uso comercial del audio. */
  readonly commercialTermsReviewed: boolean;
  /** Voces cuyo companion habla con voz masculina (por id de voz de Kotaru). */
  readonly maleVoices?: readonly string[];
}

/**
 * Texto a voz servido por Together AI (API REST `/v1/audio/speech`, sin SDK). Cada modelo
 * (Kokoro, Cartesia...) solo aporta su `TogetherVoiceModel`.
 *
 * Una peticion por oracion, en PCM 16 bits a 24 kHz sin cabecera (`response_format: raw`),
 * leyendo el cuerpo a medida que llega. No usa el modo `stream` de Together: su formato de
 * eventos no esta documentado para Kokoro, y la oracion ya es la unidad de latencia del
 * orquestador (la primera suena mientras el modelo escribe la segunda).
 */
export class TogetherSpeechProvider implements TextToSpeechProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #options: TogetherSpeechOptions;
  readonly #spec: TogetherVoiceModel;
  readonly #fetch: typeof fetch;
  readonly #maleVoices: ReadonlySet<string>;
  #lastError: number | null = null;

  constructor(spec: TogetherVoiceModel, options: TogetherSpeechOptions) {
    if (!options.apiKey) throw new Error('Together: falta la clave de API');
    this.#spec = spec;
    this.#options = options;
    this.#fetch = options.fetch ?? fetch;
    this.#maleVoices = new Set(options.maleVoices ?? []);
    this.descriptor = {
      id: spec.id,
      capability: 'tts',
      regions: ['us'],
      locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      retentionKnown: options.zeroRetentionConfirmed,
      trainingOptOut: options.zeroRetentionConfirmed ? true : 'unknown',
      commercialAudioRights: options.commercialTermsReviewed ? true : 'unknown',
      quality: spec.quality,
      enabled: true,
    };
  }

  async *synthesizeStream(text: AsyncIterable<TextChunk>, voice: VoiceConfig, ctx: ProviderContext): AsyncIterable<AudioChunk> {
    const chosen = this.#spec.voiceFor(voice.voiceId, voice.locale, this.#maleVoices.has(voice.voiceId));
    let seq = 0;

    for await (const chunk of text) {
      if (ctx.signal.aborted) return;
      for (const piece of split(chunk.text.trim())) {
        const signal = AbortSignal.any([ctx.signal, AbortSignal.timeout(ctx.deadlineMs)]);
        let response: Response;
        try {
          response = await this.#fetch(`${this.#options.baseUrl ?? DEFAULT_BASE}/v1/audio/speech`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${this.#options.apiKey}` },
            body: JSON.stringify({
              model: this.#spec.model,
              input: piece,
              voice: chosen.voice,
              language: chosen.language,
              response_format: 'raw',
              response_encoding: 'pcm_s16le',
              sample_rate: SAMPLE_RATE,
              // La velocidad (voice.speed) no se envia: Together no documenta ese parametro.
              stream: false,
            }),
            signal,
          });
        } catch {
          if (ctx.signal.aborted) return;
          this.#lastError = Date.now();
          throw new ProviderError(this.descriptor.id, signal.aborted ? 'deadline' : 'network', true);
        }
        if (!response.ok) {
          this.#lastError = Date.now();
          throw await httpError(this.descriptor.id, response);
        }
        if (!response.body) throw new ProviderError(this.descriptor.id, 'empty_audio', true);

        // Rearma en trozos de 100 ms y con numero par de bytes (muestras de 16 bits).
        let carry: Uint8Array = new Uint8Array(0);
        try {
          for await (const bytes of response.body as unknown as AsyncIterable<Uint8Array>) {
            if (ctx.signal.aborted) return;
            carry = concat(carry, bytes);
            while (carry.byteLength >= CHUNK_BYTES) {
              yield { pcm: carry.slice(0, CHUNK_BYTES), sampleRate: SAMPLE_RATE, seq: seq++ };
              carry = carry.slice(CHUNK_BYTES);
            }
          }
        } catch {
          if (ctx.signal.aborted) return;
          this.#lastError = Date.now();
          throw new ProviderError(this.descriptor.id, 'stream_interrupted', true);
        }
        const even = carry.byteLength - (carry.byteLength % 2);
        if (even > 0) yield { pcm: carry.slice(0, even), sampleRate: SAMPLE_RATE, seq: seq++ };
      }
    }
  }

  estimate(input: { readonly characters: number }, _ctx: ProviderContext): CostEstimate {
    return {
      amountUsd: Math.round(((input.characters * this.#spec.rate.perMillionCharsUsd) / 1e6) * 1e6) / 1e6,
      basis: 'verified',
      rateCardVersion: this.#spec.rate.version,
      verifiedAt: this.#spec.rate.verifiedAt,
    };
  }

  async health(): Promise<ProviderHealth> {
    const recent = this.#lastError !== null && Date.now() - this.#lastError < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }
}

/** Parte un texto largo en trozos por debajo del limite, cortando en espacios. */
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
  const out = new Uint8Array(a.byteLength + b.byteLength);
  out.set(a, 0);
  out.set(b, a.byteLength);
  return out;
}

async function httpError(providerId: string, response: Response): Promise<ProviderError> {
  let code = '';
  try {
    const body = (await response.json()) as { error?: { code?: string; type?: string } };
    code = body.error?.code ?? body.error?.type ?? '';
  } catch {
    // cuerpo no JSON
  }
  const retryable = response.status === 429 || response.status >= 500;
  return new ProviderError(providerId, (code || `http_${response.status}`).toLowerCase(), retryable, response.status);
}
