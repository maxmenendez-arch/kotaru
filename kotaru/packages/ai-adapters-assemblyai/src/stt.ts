import WebSocket from 'ws';
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
 * Tarifa verificada el 2026-09-27 en https://www.assemblyai.com/pricing:
 * Universal-Streaming (English y Multilingual) a 0.15 USD por hora de SESION.
 * Se factura el tiempo que el WebSocket esta abierto, no el audio enviado
 * (https://www.assemblyai.com/docs/faq/how-does-universal-streaming-session-based-pricing-work).
 */
export const ASSEMBLYAI_RATE = {
  version: 'assemblyai-universal-streaming@2026-09-27',
  verifiedAt: '2026-09-27',
  perSessionHourUsd: 0.15,
} as const;

export interface AssemblyAiOptions {
  readonly apiKey: string;
  /** Zona de datos de EE. UU. por defecto. */
  readonly url?: string;
  /** `universal-streaming-multilingual` cubre ingles y espanol (y FR, DE, IT, PT). */
  readonly speechModel?: 'universal-streaming-multilingual' | 'universal-streaming-english';
  /**
   * El operador confirma que la cuenta es de pago y que en Dashboard → Data Controls se
   * desactivo el uso para entrenamiento. Solo asi AssemblyAI ofrece retencion cero en
   * streaming. Sin esta confirmacion el router no elige este proveedor.
   */
  readonly zeroRetentionConfirmed: boolean;
  /** Palabras que el modelo debe reconocer bien (nombres de los companions). Max 100. */
  readonly keyterms?: readonly string[];
  /** Cuanto esperar el cierre del turno tras terminar el audio. */
  readonly finalizeTimeoutMs?: number;
}

const DEFAULT_URL = 'wss://streaming.us.assemblyai.com/v3/ws';
/** Los mensajes de audio deben durar entre 50 y 1000 ms; 100 ms es un buen punto medio. */
const FRAME_MS = 100;
const MIN_FRAME_MS = 50;

interface TurnMessage {
  readonly type: 'Turn';
  readonly transcript: string;
  readonly end_of_turn: boolean;
  readonly turn_order: number;
}
interface TerminationMessage {
  readonly type: 'Termination';
  readonly session_duration_seconds?: number;
  readonly audio_duration_seconds?: number;
}
type ServerMessage = TurnMessage | TerminationMessage | { readonly type: 'Begin' | string };

/**
 * STT en streaming de AssemblyAI (API v3, WebSocket).
 *
 * Un turno de Kotaru (pulsar para hablar) puede contener varios turnos de AssemblyAI si el
 * usuario hace pausas. El adaptador los junta y entrega UN `final` cuando termina el audio,
 * que es lo que el orquestador espera.
 *
 * El costo sale de la duracion de la sesion, porque asi factura el proveedor; por eso la
 * sesion se abre con el primer audio y se cierra (Terminate) en cuanto termina el turno.
 */
export class AssemblyAiSttProvider implements SpeechToTextProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #options: AssemblyAiOptions;
  #lastError: { at: number; code: string } | null = null;

  constructor(options: AssemblyAiOptions) {
    if (!options.apiKey) throw new Error('AssemblyAI: falta la clave de API');
    if ((options.keyterms?.length ?? 0) > 100) throw new Error('AssemblyAI: maximo 100 keyterms');
    this.#options = options;
    const english = options.speechModel === 'universal-streaming-english';
    this.descriptor = {
      id: 'assemblyai-stt',
      capability: 'stt',
      regions: ['us'],
      locales: english ? ['en-US'] : ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      retentionKnown: options.zeroRetentionConfirmed,
      trainingOptOut: options.zeroRetentionConfirmed ? true : 'unknown',
      commercialAudioRights: 'unknown',
      quality: 0.85,
      enabled: true,
    };
  }

  async *transcribeStream(input: AsyncIterable<AudioChunk>, ctx: ProviderContext): AsyncIterable<TranscriptEvent> {
    const iterator = input[Symbol.asyncIterator]();
    const first = await iterator.next();
    if (first.done) return;
    const sampleRate = first.value.sampleRate;
    const frameBytes = Math.round((sampleRate * 2 * FRAME_MS) / 1000);
    const minFrameBytes = Math.round((sampleRate * 2 * MIN_FRAME_MS) / 1000);

    const openedAt = Date.now();
    const socket = await this.#connect(sampleRate, ctx);
    const inbox = new Inbox<ServerMessage>();
    let closeCode: number | null = null;
    socket.on('message', (data: WebSocket.RawData, isBinary: boolean) => {
      if (isBinary) return;
      try {
        inbox.push(JSON.parse(data.toString()) as ServerMessage);
      } catch {
        // Un mensaje ilegible no tumba el turno; se ignora.
      }
    });
    socket.on('close', (code: number) => {
      closeCode = code;
      inbox.close();
    });
    const onAbort = () => {
      sendJson(socket, { type: 'Terminate' });
      socket.close();
    };
    ctx.signal.addEventListener('abort', onAbort, { once: true });

    // El audio sale en segundo plano mientras aqui se leen las transcripciones.
    let pending = Buffer.alloc(0);
    let inputDone = false;
    const pump = (async () => {
      const push = (pcm: Uint8Array) => {
        pending = Buffer.concat([pending, pcm]);
        while (pending.byteLength >= frameBytes) {
          if (socket.readyState === WebSocket.OPEN) socket.send(pending.subarray(0, frameBytes));
          pending = pending.subarray(frameBytes);
        }
      };
      push(first.value.pcm);
      for (let next = await iterator.next(); !next.done; next = await iterator.next()) {
        if (ctx.signal.aborted) break;
        if (next.value.sampleRate !== sampleRate) throw new ProviderError(this.descriptor.id, 'sample_rate_changed', false);
        push(next.value.pcm);
      }
      if (pending.byteLength > 0 && socket.readyState === WebSocket.OPEN) {
        // El ultimo trozo tambien debe durar al menos 50 ms: se completa con silencio.
        const last = pending.byteLength >= minFrameBytes ? pending : Buffer.concat([pending, Buffer.alloc(minFrameBytes - pending.byteLength)]);
        socket.send(last);
      }
      pending = Buffer.alloc(0);
      inputDone = true;
      // Pide a AssemblyAI que cierre ya el turno en curso, sin esperar al silencio.
      sendJson(socket, { type: 'ForceEndpoint' });
    })();
    pump.catch(() => undefined);

    const finals: string[] = [];
    let current = '';
    let openTurn = false;
    let lastEventAt = 0;
    let termination: TerminationMessage | null = null;
    const deadlineMs = this.#options.finalizeTimeoutMs ?? 1500;
    let finalizeDeadline: number | null = null;

    // Tras el ultimo audio se espera un margen minimo aunque no haya turno abierto: la
    // ultima palabra puede estar todavia en camino y no haber generado ni un parcial.
    const graceMs = 400;
    let graceUntil: number | null = null;

    try {
      for (;;) {
        if (inputDone && finalizeDeadline === null) {
          finalizeDeadline = Date.now() + deadlineMs;
          graceUntil = Date.now() + graceMs;
        }
        if (inputDone && !openTurn && graceUntil !== null && Date.now() >= graceUntil) {
          // Nada pendiente: el ultimo turno ya cerro, no hace falta esperar mas.
          break;
        }
        const wait =
          finalizeDeadline === null
            ? 250
            : Math.max(0, Math.min(finalizeDeadline, openTurn ? finalizeDeadline : graceUntil ?? finalizeDeadline) - Date.now());
        if (finalizeDeadline !== null && Date.now() >= finalizeDeadline) break;
        if (finalizeDeadline !== null && wait === 0) continue;
        const message = await inbox.next(wait);
        if (message === 'closed') break;
        if (message === 'timeout') continue;
        lastEventAt = Date.now() - openedAt;

        if (message.type === 'Turn') {
          const turn = message as TurnMessage;
          if (turn.end_of_turn) {
            if (turn.transcript.trim()) finals.push(turn.transcript.trim());
            current = '';
            openTurn = false;
          } else {
            current = turn.transcript;
            openTurn = turn.transcript.trim().length > 0;
            const text = [...finals, current].join(' ').trim();
            if (text) yield { type: 'partial', text, atMs: lastEventAt };
          }
        } else if (message.type === 'Termination') {
          termination = message as TerminationMessage;
          break;
        }
      }

      await pump;
      if (closeCode !== null && closeCode !== 1000 && finals.length === 0 && !ctx.signal.aborted) {
        throw sessionError(this.descriptor.id, closeCode);
      }
      if (current.trim()) finals.push(current.trim());

      yield { type: 'endpoint', atMs: lastEventAt };
      const text = finals.join(' ').trim();
      if (text) yield { type: 'final', text, atMs: Date.now() - openedAt };
    } catch (error) {
      this.#lastError = { at: Date.now(), code: error instanceof ProviderError ? error.code : 'error' };
      throw error;
    } finally {
      ctx.signal.removeEventListener('abort', onAbort);
      if (!termination) {
        sendJson(socket, { type: 'Terminate' });
        // Espera breve al resumen de facturacion; si no llega, se usa el tiempo medido.
        const late = await inbox.nextOfType('Termination', 300);
        if (late) termination = late as TerminationMessage;
      }
      socket.close();
    }

    const measured = (Date.now() - openedAt) / 1000;
    const sessionSeconds = termination?.session_duration_seconds ?? measured;
    yield {
      type: 'usage',
      usage: {
        ...(termination?.audio_duration_seconds !== undefined ? { audioSecondsIn: termination.audio_duration_seconds } : {}),
        billedUnits: [{ unit: 'session_hour', quantity: sessionSeconds / 3600 }],
      },
      cost: this.estimate({ audioSeconds: sessionSeconds }, ctx),
    };
  }

  /** `audioSeconds` se interpreta como segundos de sesion, que es lo que se factura. */
  estimate(input: { readonly audioSeconds: number }, _ctx: ProviderContext): CostEstimate {
    return {
      amountUsd: Math.round((input.audioSeconds / 3600) * ASSEMBLYAI_RATE.perSessionHourUsd * 1e6) / 1e6,
      basis: 'verified',
      rateCardVersion: ASSEMBLYAI_RATE.version,
      verifiedAt: ASSEMBLYAI_RATE.verifiedAt,
    };
  }

  async health(): Promise<ProviderHealth> {
    const recent = this.#lastError !== null && Date.now() - this.#lastError.at < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }

  #connect(sampleRate: number, ctx: ProviderContext): Promise<WebSocket> {
    const url = new URL(this.#options.url ?? DEFAULT_URL);
    url.searchParams.set('sample_rate', String(sampleRate));
    url.searchParams.set('encoding', 'pcm_s16le');
    url.searchParams.set('speech_model', this.#options.speechModel ?? 'universal-streaming-multilingual');
    if (this.#options.keyterms?.length) url.searchParams.set('keyterms_prompt', JSON.stringify(this.#options.keyterms));

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url, { headers: { Authorization: this.#options.apiKey }, handshakeTimeout: 5000 });
      const fail = (code: string, status?: number) => {
        socket.removeAllListeners();
        socket.on('error', () => undefined);
        socket.terminate();
        reject(new ProviderError(this.descriptor.id, code, status === undefined || status >= 500, status));
      };
      socket.once('open', () => {
        socket.removeAllListeners('error');
        socket.on('error', () => undefined);
        resolve(socket);
      });
      socket.once('unexpected-response', (_req, res) => fail('handshake_rejected', res.statusCode));
      socket.once('error', () => fail('connect_failed'));
      if (ctx.signal.aborted) fail('cancelled');
    });
  }
}

/** Codigos de cierre documentados en common-session-errors-and-closures. */
function sessionError(providerId: string, code: number): ProviderError {
  switch (code) {
    case 1008:
      return new ProviderError(providerId, 'unauthorized', false, code);
    case 3007:
      return new ProviderError(providerId, 'input_duration_or_rate', false, code);
    case 3009:
      return new ProviderError(providerId, 'too_many_sessions', true, code);
    default:
      return new ProviderError(providerId, 'session_closed', true, code);
  }
}

function sendJson(socket: WebSocket, message: unknown): void {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

/** Buzon de mensajes con espera acotada. */
class Inbox<T extends { type: string }> {
  readonly #items: T[] = [];
  #waiter: ((value: T | 'closed' | 'timeout') => void) | null = null;
  #closed = false;

  push(item: T): void {
    if (this.#waiter) {
      const w = this.#waiter;
      this.#waiter = null;
      w(item);
    } else this.#items.push(item);
  }

  close(): void {
    this.#closed = true;
    if (this.#waiter) {
      const w = this.#waiter;
      this.#waiter = null;
      w('closed');
    }
  }

  next(timeoutMs: number): Promise<T | 'closed' | 'timeout'> {
    const item = this.#items.shift();
    if (item) return Promise.resolve(item);
    if (this.#closed) return Promise.resolve('closed');
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.#waiter = null;
        resolve('timeout');
      }, timeoutMs);
      this.#waiter = (value) => {
        clearTimeout(timer);
        resolve(value);
      };
    });
  }

  async nextOfType(type: string, timeoutMs: number): Promise<T | null> {
    const until = Date.now() + timeoutMs;
    for (;;) {
      const remaining = until - Date.now();
      if (remaining <= 0) return null;
      const item = await this.next(remaining);
      if (item === 'closed' || item === 'timeout') return null;
      if (item.type === type) return item;
    }
  }
}
