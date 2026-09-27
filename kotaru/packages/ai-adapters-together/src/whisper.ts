import {
  ProviderError,
  type AudioChunk,
  type CostEstimate,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
  type SpeechToTextProvider,
  type TranscriptEvent,
} from '@kotaru/ai-contracts';

/**
 * Tarifa verificada el 2026-09-27 en https://www.together.ai/pricing: Whisper Large v3,
 * 0,0015 USD por minuto de audio (0,09 USD por hora de lo que dice la persona; solo se
 * envia lo grabado con el boton pulsado). ASSUMPTION: se factura prorrateado por segundo;
 * la pagina no publica el redondeo.
 */
export const WHISPER_RATE = { version: 'together-whisper-large-v3@2026-09-27', verifiedAt: '2026-09-27', perMinuteUsd: 0.0015 } as const;

const MODEL = 'openai/whisper-large-v3';
const DEFAULT_BASE = 'https://api.together.ai';
/** Menos de esto no es una frase: se descarta sin llamar (y sin cobrar). */
const MIN_SECONDS = 0.3;
/**
 * Pico por debajo del cual se considera silencio (PCM 16 bits). Whisper "transcribe" el
 * silencio con frases inventadas ("Subtitulos por…"); mejor no enviarlo.
 */
const SILENCE_PEAK = 500;
/** Nombres propios que Whisper escribiria mal sin pista. */
const PROMPT = 'Kotaru, Rio.';

export interface WhisperOptions {
  readonly apiKey: string;
  readonly baseUrl?: string;
  readonly fetch?: typeof fetch;
  /** Retencion cero confirmada en la organizacion de Together (ver KokoroOptions). */
  readonly zeroRetentionConfirmed: boolean;
}

/**
 * Voz a texto con Whisper Large v3 servido por Together AI (`/v1/audio/transcriptions`).
 *
 * No es streaming: junta el audio del turno (pulsar para hablar) y lo transcribe al soltar.
 * La latencia extra es la de una peticion corta, aceptable con boton; la conversacion
 * manos libres pedira un STT en streaming. El audio viaja como WAV en memoria y no se
 * guarda en ningun sitio.
 */
export class WhisperSttProvider implements SpeechToTextProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #options: WhisperOptions;
  readonly #fetch: typeof fetch;
  #lastError: number | null = null;

  constructor(options: WhisperOptions) {
    if (!options.apiKey) throw new Error('Together: falta la clave de API');
    this.#options = options;
    this.#fetch = options.fetch ?? fetch;
    this.descriptor = {
      id: 'together-whisper',
      capability: 'stt',
      regions: ['us'],
      locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      retentionKnown: options.zeroRetentionConfirmed,
      trainingOptOut: options.zeroRetentionConfirmed ? true : 'unknown',
      commercialAudioRights: 'unknown',
      quality: 0.75,
      enabled: true,
    };
  }

  async *transcribeStream(input: AsyncIterable<AudioChunk>, ctx: ProviderContext): AsyncIterable<TranscriptEvent> {
    const startedAt = Date.now();
    const parts: Uint8Array[] = [];
    let bytes = 0;
    let sampleRate = 24000;
    for await (const chunk of input) {
      if (ctx.signal.aborted) return;
      sampleRate = chunk.sampleRate;
      parts.push(chunk.pcm);
      bytes += chunk.pcm.byteLength;
    }
    if (ctx.signal.aborted) return;

    const pcm = join(parts, bytes - (bytes % 2));
    const seconds = pcm.byteLength / (sampleRate * 2);
    yield { type: 'endpoint', atMs: Date.now() - startedAt };
    if (seconds < MIN_SECONDS || peak(pcm) < SILENCE_PEAK) return;

    const form = new FormData();
    form.append('file', new Blob([wav(pcm, sampleRate)], { type: 'audio/wav' }), 'turno.wav');
    form.append('model', MODEL);
    form.append('language', ctx.locale.startsWith('es') ? 'es' : 'en');
    form.append('prompt', PROMPT);
    form.append('response_format', 'json');

    const signal = AbortSignal.any([ctx.signal, AbortSignal.timeout(ctx.deadlineMs)]);
    let response: Response;
    try {
      response = await this.#fetch(`${this.#options.baseUrl ?? DEFAULT_BASE}/v1/audio/transcriptions`, {
        method: 'POST',
        headers: { authorization: `Bearer ${this.#options.apiKey}` },
        body: form,
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

    let text = '';
    try {
      text = (((await response.json()) as { text?: string }).text ?? '').trim();
    } catch {
      this.#lastError = Date.now();
      throw new ProviderError(this.descriptor.id, 'bad_response', true);
    }
    if (text) yield { type: 'final', text, atMs: Date.now() - startedAt };
    yield {
      type: 'usage',
      usage: { audioSecondsIn: seconds, billedUnits: [{ unit: 'audio_minute', quantity: seconds / 60 }] },
      cost: this.estimate({ audioSeconds: seconds }, ctx),
    };
  }

  estimate(input: { readonly audioSeconds: number }, _ctx: ProviderContext): CostEstimate {
    return {
      amountUsd: Math.round(((input.audioSeconds / 60) * WHISPER_RATE.perMinuteUsd) * 1e6) / 1e6,
      basis: 'verified',
      rateCardVersion: WHISPER_RATE.version,
      verifiedAt: WHISPER_RATE.verifiedAt,
    };
  }

  async health(): Promise<ProviderHealth> {
    const recent = this.#lastError !== null && Date.now() - this.#lastError < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }
}

function join(parts: readonly Uint8Array[], length: number): Uint8Array {
  const out = new Uint8Array(length);
  let at = 0;
  for (const part of parts) {
    const take = Math.min(part.byteLength, length - at);
    if (take <= 0) break;
    out.set(part.subarray(0, take), at);
    at += take;
  }
  return out;
}

/** Pico absoluto de un PCM 16 bits little-endian. */
function peak(pcm: Uint8Array): number {
  const view = new DataView(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let max = 0;
  for (let i = 0; i + 1 < pcm.byteLength; i += 2) {
    const v = Math.abs(view.getInt16(i, true));
    if (v > max) max = v;
  }
  return max;
}

/** Cabecera WAV de 44 bytes para PCM 16 bits mono. */
function wav(pcm: Uint8Array, sampleRate: number): Uint8Array {
  const out = new Uint8Array(44 + pcm.byteLength);
  const view = new DataView(out.buffer);
  const ascii = (at: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i));
  };
  ascii(0, 'RIFF');
  view.setUint32(4, 36 + pcm.byteLength, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, 'data');
  view.setUint32(40, pcm.byteLength, true);
  out.set(pcm, 44);
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
