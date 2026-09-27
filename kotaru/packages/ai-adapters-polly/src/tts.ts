import { PollyClient, SynthesizeSpeechCommand, type SynthesizeSpeechCommandInput, type VoiceId } from '@aws-sdk/client-polly';
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

/**
 * Tarifa verificada el 2026-09-27 en https://aws.amazon.com/polly/pricing/:
 * motor Neural, 16 USD por millon de caracteres. Las etiquetas SSML no se facturan.
 */
export const POLLY_NEURAL_RATE = { version: 'polly-neural@2026-09-27', verifiedAt: '2026-09-27', perMillionCharsUsd: 16 } as const;

/**
 * Voces neurales por idioma, verificadas en available-voices.html el 2026-09-27.
 * La voz del companion (VoiceConfig.voiceId) elige entre femenina y masculina.
 */
const VOICES: Readonly<Record<Locale, { readonly female: VoiceId; readonly male: VoiceId; readonly language: string }>> = {
  'es-419': { female: 'Mia', male: 'Andres', language: 'es-MX' },
  'es-US': { female: 'Lupe', male: 'Pedro', language: 'es-US' },
  'es-ES': { female: 'Lucia', male: 'Sergio', language: 'es-ES' },
  'en-US': { female: 'Joanna', male: 'Matthew', language: 'en-US' },
};

/** Polly solo entrega PCM a 8 o 16 kHz (API_SynthesizeSpeech). */
const SAMPLE_RATE = 16000;
/** Trozos de 100 ms hacia el cliente: suficiente fluidez sin inundar el socket. */
const CHUNK_BYTES = (SAMPLE_RATE * 2 * 100) / 1000;
/** Limite documentado: 3000 caracteres facturables por peticion. Margen incluido. */
const MAX_CHARS_PER_REQUEST = 2500;

export interface PollyLike {
  send(command: SynthesizeSpeechCommand, options?: { abortSignal?: AbortSignal }): Promise<{
    AudioStream?: unknown;
    RequestCharacters?: number;
  }>;
}

export interface PollyOptions {
  readonly region?: string;
  /** Para pruebas: un cliente que imita a Polly. En produccion se crea con las credenciales del entorno. */
  readonly client?: PollyLike;
  /**
   * El operador confirma que la organizacion de AWS tiene la politica de exclusion de
   * servicios de IA (Polly figura en la lista). Sin ella, AWS puede guardar y usar el
   * texto enviado para mejorar el servicio, y el router no debe elegir este proveedor.
   */
  readonly aiOptOutConfirmed: boolean;
  /**
   * El operador confirma haber revisado los terminos de AWS sobre el uso comercial del
   * audio generado. Sin esa confirmacion el router no usa voces de Polly (regla del
   * proyecto: ninguna voz sin derechos comerciales verificados).
   */
  readonly commercialTermsReviewed: boolean;
  /** Voces cuyo companion habla con voz masculina (por id de voz de Kotaru). */
  readonly maleVoices?: readonly string[];
}

/**
 * Texto a voz con Amazon Polly, motor Neural, PCM 16 kHz.
 *
 * Recibe oraciones del orquestador y sintetiza cada una en cuanto llega, reenviando el
 * audio a medida que Polly lo entrega. Asi el primer audio sale al terminar la primera
 * oracion, no al final de la respuesta.
 *
 * No pide marcas de visemas: serian una segunda peticion facturada por cada oracion. La
 * boca del avatar se mueve con la envolvente de amplitud (ADR-001).
 */
export class PollyTtsProvider implements TextToSpeechProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #client: PollyLike;
  readonly #maleVoices: ReadonlySet<string>;
  #lastError: number | null = null;

  constructor(options: PollyOptions) {
    this.#client = options.client ?? new PollyClient({ region: options.region ?? 'us-east-1' });
    this.#maleVoices = new Set(options.maleVoices ?? []);
    this.descriptor = {
      id: 'polly-neural',
      capability: 'tts',
      regions: ['us'],
      locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      retentionKnown: options.aiOptOutConfirmed,
      trainingOptOut: options.aiOptOutConfirmed ? true : 'unknown',
      commercialAudioRights: options.commercialTermsReviewed ? true : 'unknown',
      quality: 0.75,
      enabled: true,
    };
  }

  async *synthesizeStream(text: AsyncIterable<TextChunk>, voice: VoiceConfig, ctx: ProviderContext): AsyncIterable<AudioChunk> {
    const voices = VOICES[voice.locale];
    const voiceId = this.#maleVoices.has(voice.voiceId) ? voices.male : voices.female;
    let seq = 0;

    for await (const chunk of text) {
      if (ctx.signal.aborted) return;
      for (const piece of split(chunk.text.trim())) {
        const input: SynthesizeSpeechCommandInput = {
          Engine: 'neural',
          OutputFormat: 'pcm',
          SampleRate: String(SAMPLE_RATE),
          VoiceId: voiceId,
          LanguageCode: voices.language as SynthesizeSpeechCommandInput['LanguageCode'],
          ...ssmlOrText(piece, voice.speed),
        };
        let stream: AsyncIterable<Uint8Array>;
        try {
          const response = await this.#client.send(new SynthesizeSpeechCommand(input), { abortSignal: ctx.signal });
          stream = toAsyncIterable(response.AudioStream);
        } catch (error) {
          if (ctx.signal.aborted) return;
          this.#lastError = Date.now();
          throw toProviderError(this.descriptor.id, error);
        }

        // Rearma en trozos de 100 ms y con numero par de bytes (muestras de 16 bits).
        let carry: Uint8Array = new Uint8Array(0);
        for await (const bytes of stream) {
          if (ctx.signal.aborted) return;
          carry = concat(carry, bytes);
          while (carry.byteLength >= CHUNK_BYTES) {
            yield { pcm: carry.slice(0, CHUNK_BYTES), sampleRate: SAMPLE_RATE, seq: seq++ };
            carry = carry.slice(CHUNK_BYTES);
          }
        }
        const even = carry.byteLength - (carry.byteLength % 2);
        if (even > 0) yield { pcm: carry.slice(0, even), sampleRate: SAMPLE_RATE, seq: seq++ };
      }
    }
  }

  estimate(input: { readonly characters: number }, _ctx: ProviderContext): CostEstimate {
    return {
      amountUsd: Math.round(((input.characters * POLLY_NEURAL_RATE.perMillionCharsUsd) / 1e6) * 1e6) / 1e6,
      basis: 'verified',
      rateCardVersion: POLLY_NEURAL_RATE.version,
      verifiedAt: POLLY_NEURAL_RATE.verifiedAt,
    };
  }

  async health(): Promise<ProviderHealth> {
    const recent = this.#lastError !== null && Date.now() - this.#lastError < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }
}

/** Velocidad distinta de 1: SSML con <prosody rate>, que el motor neural admite. */
function ssmlOrText(text: string, speed: number): Pick<SynthesizeSpeechCommandInput, 'Text' | 'TextType'> {
  if (Math.abs(speed - 1) < 0.01) return { Text: text, TextType: 'text' };
  const rate = Math.round(Math.min(1.25, Math.max(0.8, speed)) * 100);
  return { Text: `<speak><prosody rate="${rate}%">${escapeXml(text)}</prosody></speak>`, TextType: 'ssml' };
}

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
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

function toAsyncIterable(stream: unknown): AsyncIterable<Uint8Array> {
  if (stream && typeof (stream as AsyncIterable<Uint8Array>)[Symbol.asyncIterator] === 'function') {
    return stream as AsyncIterable<Uint8Array>;
  }
  if (stream instanceof Uint8Array) {
    return (async function* () {
      yield stream;
    })();
  }
  throw new Error('Polly no devolvio audio');
}

function toProviderError(providerId: string, error: unknown): ProviderError {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  const status = e.$metadata?.httpStatusCode;
  const code = (e.name ?? 'error').replace(/Exception$/, '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  const retryable = status === undefined || status === 429 || status >= 500 || code === 'throttling';
  return new ProviderError(providerId, code, retryable, status);
}
