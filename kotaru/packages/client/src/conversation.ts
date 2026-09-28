import type { ClientMessage, CloseReason, ServerMessage } from '@kotaru/gateway';

/**
 * Debe coincidir con PROTOCOL_VERSION de @kotaru/gateway. Se repite aqui para no
 * arrastrar codigo del servidor a la app; una prueba compara ambos valores.
 */
export const CLIENT_PROTOCOL_VERSION = 1;

/**
 * Estados de la conversacion tal como los define 09_BRAND (tabla de estados). Cada uno
 * tiene su etiqueta accesible: ningun estado se comunica solo con color o animacion.
 */
export type ConversationState =
  | 'connecting'
  | 'idle'
  | 'listening'
  | 'endpoint'
  | 'thinking'
  | 'speaking'
  | 'interrupted'
  | 'reconnecting'
  | 'limit_reached'
  | 'safety_handoff'
  | 'closed';

export const STATE_LABELS: Readonly<Record<'es' | 'en', Readonly<Record<ConversationState, string>>>> = {
  es: {
    connecting: 'Conectando',
    idle: 'Esperando',
    listening: 'Escuchando',
    endpoint: 'Procesando tu mensaje',
    thinking: 'Pensando',
    speaking: 'Hablando',
    interrupted: 'Te escucho',
    reconnecting: 'Reconectando',
    limit_reached: 'Voz en pausa',
    safety_handoff: 'Información de apoyo',
    closed: 'Conversación cerrada',
  },
  en: {
    connecting: 'Connecting',
    idle: 'Waiting',
    listening: 'Listening',
    endpoint: 'Processing your message',
    thinking: 'Thinking',
    speaking: 'Speaking',
    interrupted: "I'm listening",
    reconnecting: 'Reconnecting',
    limit_reached: 'Voice paused',
    safety_handoff: 'Support information',
    closed: 'Conversation closed',
  },
};

/** Lo minimo de un WebSocket que usa el cliente. Cumplen el del navegador, RN y `ws`. */
export interface SocketLike {
  readonly readyState: number;
  binaryType: string;
  send(data: string | ArrayBufferLike | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
  onopen: ((ev: unknown) => void) | null;
  onclose: ((ev: { code?: number }) => void) | null;
  onerror: ((ev: unknown) => void) | null;
  onmessage: ((ev: { data: unknown }) => void) | null;
}

export type ClientEvent =
  | { readonly type: 'state'; readonly state: ConversationState }
  | { readonly type: 'user_transcript'; readonly text: string; readonly final: boolean }
  | { readonly type: 'reply'; readonly text: string }
  /** Emocion de la respuesta (una de EMOTIONS del servidor) para el avatar; puede no llegar. */
  | { readonly type: 'affect'; readonly emotion: string; readonly intensity: number; readonly gesture?: string }
  | { readonly type: 'audio'; readonly pcm: Uint8Array; readonly sampleRate: number; readonly seq: number }
  | { readonly type: 'usage'; readonly remainingSeconds: number; readonly planSeconds: number }
  | { readonly type: 'turn_done'; readonly turnId: string }
  /** Que voz hablo en el turno: gemini, cartesia, kokoro u other (prueba de voces). */
  | { readonly type: 'voice_used'; readonly voice: string }
  /** Al conectar: si el servidor puede oir de verdad. Si no, solo texto. */
  | { readonly type: 'voice'; readonly available: boolean }
  | { readonly type: 'rejected'; readonly reason: string }
  /** Por que se paro la voz: el plan del usuario, la sesion, o el tope de gasto del servicio. */
  | { readonly type: 'limit'; readonly kind: 'plan' | 'session' | 'spend' }
  | { readonly type: 'closed'; readonly reason: CloseReason | 'network' | 'gave_up' };

export interface ConversationClientOptions {
  readonly url: string;
  /** Un grant NUEVO en cada llamada: son de un solo uso, y reconectar necesita otro. */
  readonly getGrant: () => Promise<string>;
  readonly createSocket: (url: string) => SocketLike;
  readonly onEvent: (event: ClientEvent) => void;
  readonly newTurnId?: () => string;
  /** Reintentos ante caidas o reinicios del servidor. */
  readonly maxReconnectAttempts?: number;
  readonly reconnectDelayMs?: (attempt: number) => number;
}

/** Motivos de cierre tras los que tiene sentido reconectar solo. */
const RECOVERABLE: ReadonlySet<string> = new Set(['server_shutdown', 'server_error', 'network']);
const OPEN = 1;

/**
 * Cliente de una conversacion de voz con el gateway.
 *
 * Traduce el protocolo a estados de interfaz y a eventos simples (texto del usuario,
 * respuesta, audio con su frecuencia). No toca el microfono ni el altavoz: la app le da
 * audio con `sendAudio` y reproduce lo que llega en eventos `audio`. Asi la misma logica
 * se prueba en Node contra el gateway real.
 */
export class ConversationClient {
  readonly #o: ConversationClientOptions;
  #socket: SocketLike | null = null;
  #state: ConversationState = 'closed';
  #turnId: string | null = null;
  #reply = '';
  #pendingAudio: { sampleRate: number; seq: number }[] = [];
  #attempt = 0;
  #closedByUser = false;
  #counter = 0;
  #mode: 'friend' | 'flirt' | 'ask' = 'ask';
  #voiceChoice: 'auto' | 'gemini' | 'cartesia' = 'auto';

  constructor(options: ConversationClientOptions) {
    this.#o = options;
  }

  get state(): ConversationState {
    return this.#state;
  }

  /** Conecta y espera `ready`. Rechaza si el servidor rechaza el grant. */
  async connect(): Promise<void> {
    this.#closedByUser = false;
    this.#set(this.#attempt > 0 ? 'reconnecting' : 'connecting');
    const grant = await this.#o.getGrant();
    await new Promise<void>((resolve, reject) => {
      const socket = this.#o.createSocket(this.#o.url);
      socket.binaryType = 'arraybuffer';
      this.#socket = socket;
      let settled = false;

      socket.onopen = () => {
        this.#send({ type: 'hello', grant, protocolVersion: CLIENT_PROTOCOL_VERSION });
      };
      socket.onmessage = (ev) => {
        if (typeof ev.data !== 'string') {
          this.#onAudio(toBytes(ev.data));
          return;
        }
        let message: ServerMessage;
        try {
          message = JSON.parse(ev.data) as ServerMessage;
        } catch {
          return;
        }
        if (!settled && message.type === 'ready') {
          settled = true;
          this.#attempt = 0;
          this.#o.onEvent({ type: 'voice', available: message.voiceAvailable !== false });
          if (this.#mode !== 'ask') this.#send({ type: 'mode', mode: this.#mode });
          if (this.#voiceChoice !== 'auto') this.#send({ type: 'voice_choice', choice: this.#voiceChoice });
          this.#set('idle');
          resolve();
        } else if (!settled && message.type === 'rejected') {
          settled = true;
          this.#o.onEvent({ type: 'rejected', reason: message.reason });
          reject(new Error(`grant rechazado: ${message.reason}`));
        }
        this.#onMessage(message);
      };
      socket.onerror = () => {
        if (!settled) {
          settled = true;
          reject(new Error('no se pudo conectar'));
        }
      };
      socket.onclose = () => {
        if (this.#socket === socket) this.#socket = null;
        if (!settled) {
          settled = true;
          reject(new Error('conexion cerrada antes de estar lista'));
          return;
        }
        if (!this.#closedByUser && this.#state !== 'closed') void this.#recover('network');
      };
    });
  }

  /**
   * El usuario pulsa para hablar. Si el companion estaba hablando, es un barge-in: se
   * corta su respuesta en el acto y se empieza a escuchar.
   */
  startTalking(): string {
    if (this.#state === 'speaking' || this.#state === 'thinking') this.interrupt();
    const turnId = this.#o.newTurnId?.() ?? `turn_${Date.now().toString(36)}_${++this.#counter}`;
    this.#turnId = turnId;
    this.#reply = '';
    this.#send({ type: 'turn_start', turnId });
    this.#set('listening');
    return turnId;
  }

  /**
   * Escribirle a Rio. La respuesta llega como texto (eventos `reply`), sin voz. Funciona
   * tambien con la voz en pausa. Devuelve el id del turno, o null si no hay conexion.
   */
  sendText(text: string): string | null {
    const clean = text.trim();
    if (!clean || this.#socket?.readyState !== OPEN) return null;
    if (this.#state === 'speaking' || this.#state === 'thinking') this.interrupt();
    const turnId = this.#o.newTurnId?.() ?? `turn_${Date.now().toString(36)}_${++this.#counter}`;
    this.#turnId = turnId;
    this.#reply = '';
    this.#send({ type: 'text_turn', turnId, text: clean });
    if (this.#state !== 'limit_reached') this.#set('thinking');
    return turnId;
  }

  /**
   * Modo elegido para Nova o Rio (amigo, coqueteo o que lo decida la conversacion). Se
   * recuerda y se reenvia al reconectar; vale desde el siguiente mensaje.
   */
  setMode(mode: 'friend' | 'flirt' | 'ask'): void {
    this.#mode = mode;
    if (this.#socket?.readyState === OPEN) this.#send({ type: 'mode', mode });
  }

  /**
   * Voz elegida en Ajustes para probar (Gemini o Cartesia; 'auto' deja el orden del
   * servidor). Se recuerda y se reenvia al reconectar; vale desde la siguiente respuesta.
   */
  setVoiceChoice(choice: 'auto' | 'gemini' | 'cartesia'): void {
    this.#voiceChoice = choice;
    if (this.#socket?.readyState === OPEN) this.#send({ type: 'voice_choice', choice });
  }

  /** PCM 16 bits mono, en trozos pequenos (20-100 ms). */
  sendAudio(pcm: Uint8Array): void {
    if (this.#state !== 'listening' || this.#socket?.readyState !== OPEN) return;
    this.#socket.send(pcm);
  }

  stopTalking(): void {
    if (!this.#turnId || this.#state !== 'listening') return;
    this.#send({ type: 'turn_end', turnId: this.#turnId });
    this.#set('endpoint');
  }

  /** Corta la respuesta en curso. La app debe parar el audio que este sonando. */
  interrupt(): void {
    if (!this.#turnId) return;
    this.#send({ type: 'interrupt', turnId: this.#turnId });
    this.#pendingAudio = [];
    this.#set('interrupted');
  }

  close(): void {
    this.#closedByUser = true;
    this.#send({ type: 'bye' });
    this.#socket?.close(1000);
    this.#socket = null;
    this.#set('closed');
  }

  #onMessage(message: ServerMessage): void {
    switch (message.type) {
      case 'transcript':
        if (message.turnId !== this.#turnId) return;
        this.#o.onEvent({ type: 'user_transcript', text: message.text, final: message.final });
        if (message.final && this.#state === 'endpoint') this.#set('thinking');
        return;
      case 'token':
        if (message.turnId !== this.#turnId || this.#state === 'interrupted') return;
        this.#reply += message.text;
        this.#o.onEvent({ type: 'reply', text: this.#reply });
        if (this.#state === 'endpoint' || this.#state === 'thinking') this.#set('speaking');
        return;
      case 'affect':
        if (message.turnId !== this.#turnId || this.#state === 'interrupted') return;
        this.#o.onEvent({
          type: 'affect',
          emotion: message.emotion,
          intensity: message.intensity,
          ...(message.gesture !== undefined ? { gesture: message.gesture } : {}),
        });
        return;
      case 'audio_meta':
        if (message.turnId !== this.#turnId || this.#state === 'interrupted') return;
        this.#pendingAudio.push({ sampleRate: message.sampleRate, seq: message.seq });
        return;
      case 'turn_done':
        if (message.turnId !== this.#turnId) return;
        this.#o.onEvent({ type: 'turn_done', turnId: message.turnId });
        if (this.#state !== 'safety_handoff' && this.#state !== 'limit_reached' && this.#state !== 'listening') this.#set('idle');
        return;
      case 'voice_used':
        if (message.turnId !== this.#turnId) return;
        this.#o.onEvent({ type: 'voice_used', voice: message.voice });
        return;
      case 'usage':
        this.#o.onEvent({ type: 'usage', remainingSeconds: message.remainingSeconds, planSeconds: message.planSeconds });
        return;
      case 'limit':
        // Una derivacion de crisis no se tapa con el aviso de limite: la tarjeta de ayuda
        // sigue a la vista (el limite se avisa igual y se aplica al siguiente turno).
        if (this.#state !== 'safety_handoff') this.#set('limit_reached');
        this.#o.onEvent({ type: 'limit', kind: message.kind });
        return;
      case 'safety':
        if (message.action === 'crisis_handoff') this.#set('safety_handoff');
        return;
      case 'closing':
        this.#closedByUser = !RECOVERABLE.has(message.reason);
        if (RECOVERABLE.has(message.reason)) {
          void this.#recover(message.reason);
        } else {
          this.#set('closed');
          this.#o.onEvent({ type: 'closed', reason: message.reason });
        }
        return;
      default:
        return;
    }
  }

  #onAudio(pcm: Uint8Array): void {
    // Cada frame binario va precedido de su audio_meta, en orden.
    const meta = this.#pendingAudio.shift();
    if (!meta || this.#state === 'interrupted') return;
    if (this.#state === 'endpoint' || this.#state === 'thinking') this.#set('speaking');
    this.#o.onEvent({ type: 'audio', pcm, sampleRate: meta.sampleRate, seq: meta.seq });
  }

  async #recover(reason: CloseReason | 'network'): Promise<void> {
    if (this.#state === 'reconnecting') return;
    const max = this.#o.maxReconnectAttempts ?? 3;
    this.#socket?.close();
    this.#socket = null;
    this.#turnId = null;
    this.#pendingAudio = [];
    this.#set('reconnecting');
    while (this.#attempt < max && !this.#closedByUser) {
      this.#attempt += 1;
      const delay = this.#o.reconnectDelayMs?.(this.#attempt) ?? Math.min(8000, 500 * 2 ** (this.#attempt - 1));
      await new Promise((r) => setTimeout(r, delay));
      if (this.#closedByUser) return;
      try {
        this.#state = 'reconnecting';
        await this.connect();
        return;
      } catch {
        // siguiente intento
      }
    }
    this.#set('closed');
    this.#o.onEvent({ type: 'closed', reason: this.#closedByUser ? reason : 'gave_up' });
  }

  #send(message: ClientMessage): void {
    if (this.#socket?.readyState === OPEN) this.#socket.send(JSON.stringify(message));
  }

  #set(state: ConversationState): void {
    if (this.#state === state) return;
    this.#state = state;
    this.#o.onEvent({ type: 'state', state });
  }
}

function toBytes(data: unknown): Uint8Array {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  return new Uint8Array(0);
}
