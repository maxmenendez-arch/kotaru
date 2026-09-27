import { createHash } from 'node:crypto';
import {
  type AudioChunk,
  type DomainMessage,
  type ModerationProvider,
  type ProviderContext,
} from '@kotaru/ai-contracts';
import {
  entitlementFor,
  evaluateSpend,
  freeVoiceExhausted,
  type MeterSnapshot,
  type UsageLedger,
  type SpendBudget,
  type PlanId,
} from '@kotaru/billing';
import { DEFAULT_BACKPRESSURE, MAX_TEXT_TURN_CHARS, type ClientMessage, type CloseReason, type ServerMessage, type SessionGrant } from '@kotaru/gateway';
import { HeuristicExtractor, MemoryStore } from '@kotaru/memory';
import {
  AsyncQueue,
  runTurn,
  type ProviderResolver,
  type RouterPort,
} from '@kotaru/orchestrator';
import { buildSystemPrompt, memoryMessage, promptId, RIO_V1 } from '@kotaru/persona';
import { evaluateSafety, statesMinorAge } from '@kotaru/safety';
import type { MetricSink } from '@kotaru/telemetry';

/**
 * Donde se guarda la conversacion. `ConversationRepository` de @kotaru/persistence la
 * cumple. Opcional: sin ella la sesion funciona igual, solo que sin continuidad entre
 * sesiones y sin historial guardado.
 */
export interface ConversationLog {
  open(input: {
    readonly conversationId: string;
    readonly subjectId: string;
    readonly companionId: string;
    readonly atIso: string;
  }): Promise<unknown>;
  recentMessages(
    conversationId: string,
    subjectId: string,
    limit: number,
    nowIso: string,
  ): Promise<readonly { readonly role: 'user' | 'companion'; readonly content: string }[]>;
  appendTurn(turn: {
    readonly conversationId: string;
    readonly subjectId: string;
    readonly turnId: string;
    readonly locale: string;
    readonly userText: string;
    readonly companionText: string;
    readonly atIso: string;
    readonly sensitive: boolean;
  }): Promise<unknown>;
}

/** Donde queda constancia de que actuo una politica de seguridad (sin contenido). */
export interface SafetyLog {
  record(event: {
    readonly subjectId: string;
    readonly conversationId: string | null;
    readonly policyVersion: string;
    readonly outcome: 'allow' | 'soften' | 'refuse' | 'crisis_handoff' | 'block_minor';
    readonly atIso: string;
  }): Promise<void>;
}

/** Cuantos mensajes previos se recuperan al retomar una conversacion. */
const RESUME_MESSAGES = 20;
/** Mensajes escritos por sesion (una sesion dura como mucho 30 minutos). */
const TEXT_TURNS_PER_SESSION = 120;
/** Rafaga de mensajes escritos: como mucho TEXT_BURST en TEXT_BURST_WINDOW_MS. */
const TEXT_BURST = 4;
const TEXT_BURST_WINDOW_MS = 10_000;

export interface SessionDeps {
  readonly router: RouterPort;
  readonly resolve: ProviderResolver;
  readonly moderation: ModerationProvider;
  readonly memory: MemoryStore;
  /** Libro de consumo. En produccion, PostgreSQL; nunca se lee en cada evento. */
  readonly usage: UsageLedger;
  readonly sink: MetricSink;
  readonly budget: SpendBudget;
  readonly now: () => number;
  readonly infraCostUsd?: number;
  readonly conversations?: ConversationLog;
  readonly safety?: SafetyLog;
  /** Sin oido real: no se aceptan turnos de voz (ver `ready.voiceAvailable`). */
  readonly voiceUnavailable?: boolean;
}

export interface SessionTransport {
  send(message: ServerMessage): void;
  sendAudio(chunk: AudioChunk): void;
  close(reason: CloseReason): void;
}

/**
 * Una sesion de voz, independiente del transporte.
 *
 * El WebSocket vive en server.ts; aqui solo hay reglas. Asi la maquina de estados se
 * puede probar sin abrir un socket, y cambiar de WebSocket a WebRTC mas adelante no
 * toca la logica.
 */
export class GatewaySession {
  readonly #grant: SessionGrant;
  readonly #transport: SessionTransport;
  readonly #deps: SessionDeps;
  readonly #startedAtMs: number;
  readonly #history: DomainMessage[] = [];

  #audio: AsyncQueue<AudioChunk> | null = null;
  #turnId: string | null = null;
  #abort: AbortController | null = null;
  /** El turno en curso, que corre en segundo plano desde turn_start. */
  #running: Promise<void> | null = null;
  #lastActivityMs: number;
  #closed = false;
  #turnsCompleted = 0;
  #textTurns = 0;
  /** Momentos de los ultimos mensajes escritos (para el limite de rafaga). */
  #recentTextAtMs: number[] = [];
  /**
   * Consumo leido del libro. Se refresca al abrir la sesion, al empezar cada turno y al
   * terminarlo: ahi es donde puede haber cambiado (otro dispositivo, el turno recien
   * cobrado). Los chequeos intermedios, como los plazos, leen esta copia y no la base.
   */
  #usage: { subject: MeterSnapshot; totalCostUsd: number; freeCostUsd: number } = {
    subject: { voiceSeconds: 0, costUsd: 0, turns: 0 },
    totalCostUsd: 0,
    freeCostUsd: 0,
  };

  constructor(grant: SessionGrant, transport: SessionTransport, deps: SessionDeps) {
    this.#grant = grant;
    this.#transport = transport;
    this.#deps = deps;
    this.#startedAtMs = deps.now();
    this.#lastActivityMs = this.#startedAtMs;

    // El prompt del personaje, versionado. Las reglas (es una IA, no es profesional, no
    // presiona) van fijas dentro y ninguna personalizacion las quita.
    this.#history.push({ role: 'system', content: buildSystemPrompt(RIO_V1, grant.locale) });
  }

  get turnsCompleted(): number {
    return this.#turnsCompleted;
  }

  async start(): Promise<void> {
    await this.#refreshUsage();
    await this.#resumeConversation();
    const entitlement = this.#entitlement();
    this.#transport.send({
      type: 'ready',
      ...(this.#deps.voiceUnavailable ? { voiceAvailable: false } : {}),
      sessionId: this.#grant.jti,
      maxSessionSeconds: Math.min(this.#grant.maxSessionSeconds, entitlement.maxSessionSeconds),
    });
    this.#sendUsage();

    if (!entitlement.canStartVoice) {
      this.#transport.send({ type: 'limit', kind: this.#limitKind() });
    }
  }

  async handle(message: ClientMessage): Promise<void> {
    if (this.#closed) return;
    this.#lastActivityMs = this.#deps.now();

    switch (message.type) {
      case 'hello':
        // El saludo lo resuelve el servidor antes de crear la sesion.
        return;

      case 'turn_start': {
        // Un id de turno raro (enorme, con espacios o simbolos) no llega a ningun sitio.
        if (!/^[A-Za-z0-9_.:-]{1,64}$/.test(message.turnId)) {
          this.#transport.close('protocol_error');
          this.#closed = true;
          return;
        }
        // Sin oido real, un turno de voz seria una respuesta a una frase inventada. La app
        // no deberia mandarlo; si llega (version vieja), se cierra sin respuesta.
        if (this.#deps.voiceUnavailable) {
          this.#transport.send({ type: 'turn_done', turnId: message.turnId });
          return;
        }
        // Sin await aqui a proposito: el audio del turno llega en los frames siguientes y
        // tiene que encontrar la cola ya abierta. La copia del consumo se refresco al
        // cerrar el turno anterior, que es donde cambia.
        const entitlement = this.#entitlement();
        if (!entitlement.canStartVoice) {
          this.#transport.send({ type: 'limit', kind: this.#limitKind() });
          return;
        }
        // Un turno nuevo mientras sigue el anterior es un barge-in aunque el cliente no
        // haya mandado `interrupt`: el anterior se corta.
        this.#abort?.abort();
        this.#audio?.close();

        const audio = new AsyncQueue<AudioChunk>();
        const abort = new AbortController();
        this.#turnId = message.turnId;
        this.#audio = audio;
        this.#abort = abort;
        // El turno arranca YA, no al soltar el boton: el STT recibe el audio en tiempo
        // real mientras el usuario habla. Esperar a turn_end para mandarlo todo de golpe
        // lo haria llegar mas rapido que el tiempo real, y AssemblyAI cierra la sesion
        // (codigo 3007) cuando eso pasa.
        this.#running = this.#runTurn(message.turnId, { audio }, abort).catch(() => {
          // Un fallo del turno (base de datos, proveedor sin alternativa) cierra la sesion
          // con un motivo que la app entiende, igual que antes.
          if (!this.#closed) {
            this.#transport.close('server_error');
            this.#closed = true;
          }
        });
        return;
      }

      case 'text_turn': {
        if (!/^[A-Za-z0-9_.:-]{1,64}$/.test(message.turnId) || typeof message.text !== 'string') {
          this.#transport.close('protocol_error');
          this.#closed = true;
          return;
        }
        const text = message.text.trim().slice(0, MAX_TEXT_TURN_CHARS);
        if (text === '') return;
        // Escribir cuesta poco (solo el modelo de lenguaje), pero no es gratis: como mucho
        // TEXT_BURST mensajes cada TEXT_BURST_WINDOW_MS (dos mensajes seguidos, "y tu?",
        // son normales) y TEXT_TURNS_PER_SESSION por sesion. Sigue funcionando cuando la voz
        // esta en pausa por el tope de gasto: la app sigue en texto.
        const now = this.#deps.now();
        this.#recentTextAtMs = this.#recentTextAtMs.filter((at) => now - at < TEXT_BURST_WINDOW_MS);
        if (this.#recentTextAtMs.length >= TEXT_BURST) {
          // Se descarta, pero la app no se queda esperando una respuesta que no llegara.
          this.#transport.send({ type: 'turn_done', turnId: message.turnId });
          return;
        }
        if (this.#textTurns >= TEXT_TURNS_PER_SESSION) {
          this.#transport.send({ type: 'limit', kind: 'session' });
          return;
        }
        this.#textTurns += 1;
        this.#recentTextAtMs.push(now);
        this.#abort?.abort();
        this.#audio?.close();
        const abort = new AbortController();
        this.#turnId = message.turnId;
        this.#audio = null;
        this.#abort = abort;
        this.#running = this.#runTurn(message.turnId, { text }, abort).catch(() => {
          if (!this.#closed) {
            this.#transport.close('server_error');
            this.#closed = true;
          }
        });
        return;
      }

      case 'turn_end': {
        if (this.#turnId !== message.turnId || !this.#audio) return;
        this.#audio.close();
        return;
      }

      case 'interrupt':
        // Barge-in. Cancela generacion y sintesis; el turno termina donde este.
        this.#abort?.abort();
        this.#audio?.close();
        return;

      case 'bye':
        this.#transport.close('client_bye');
        this.#closed = true;
        return;
    }
  }

  /** La conexion se cerro: corta el turno en curso para no seguir pagando proveedores. */
  dispose(): void {
    this.#closed = true;
    this.#abort?.abort();
    this.#audio?.close();
  }

  /** Espera a que termine el turno en curso (apagado limpio y pruebas). */
  async settled(): Promise<void> {
    await this.#running;
  }

  pushAudio(chunk: AudioChunk): void {
    if (this.#closed || !this.#audio) return;
    this.#lastActivityMs = this.#deps.now();
    this.#audio.push(chunk);
  }

  /** Se llama desde un temporizador del servidor. Devuelve el motivo si toca cerrar. */
  checkDeadlines(): CloseReason | null {
    if (this.#closed) return null;
    const now = this.#deps.now();
    const entitlement = this.#entitlement();

    if (now - this.#lastActivityMs >= DEFAULT_BACKPRESSURE.idleTimeoutMs) return 'idle_timeout';

    const elapsedSeconds = (now - this.#startedAtMs) / 1000;
    const maxSeconds = Math.min(this.#grant.maxSessionSeconds, entitlement.maxSessionSeconds);
    if (elapsedSeconds >= maxSeconds) return 'session_max_duration';

    if (this.#grant.exp * 1000 < now) return 'grant_expired';
    return null;
  }

  async #runTurn(
    turnId: string,
    source: { readonly audio: AsyncQueue<AudioChunk> } | { readonly text: string },
    abort: AbortController,
  ): Promise<void> {
    const ctx = this.#context(abort.signal);

    let transcript = 'text' in source ? source.text : '';
    let reply = '';
    let voiceSeconds = 0;
    const history = await this.#recallIntoHistory();
    // El id que manda la app solo es unico dentro de su sesion ("turn_1" lo usan todos).
    // Para cobrar y medir hace falta uno unico en todo el sistema: se deriva del grant
    // (unico por sesion) y del id del cliente. Es determinista, asi que un reintento del
    // mismo turno en la misma sesion sigue sin cobrarse dos veces.
    const turnKey = createHash('sha256').update(`${this.#grant.jti}\u0000${turnId}`).digest('hex').slice(0, 32);

    const events = runTurn(
      {
        conversationId: this.#grant.conversationId,
        turnId: turnKey,
        ...('text' in source ? { text: source.text, speak: false } : { audio: source.audio }),
        history,
        llmOptions: {
          personaId: RIO_V1.id,
          promptVersion: promptId(RIO_V1),
          maxOutputTokens: 256,
          temperature: 0.7,
          allowAffectChannel: true,
        },
        voice: { voiceId: 'rio-es', locale: this.#grant.locale, speed: 1, expressive: true },
        quality: this.#entitlement().quality,
        predicted: { audioSeconds: 20, inputTokens: 2_000, outputTokens: 120, characters: 400 },
      },
      ctx,
      {
        router: this.#deps.router,
        resolve: this.#deps.resolve,
        moderation: this.#deps.moderation,
        sink: this.#deps.sink,
        now: this.#deps.now,
        infraCostUsd: this.#deps.infraCostUsd ?? 0,
      },
    );

    let suppressMemory = false;
    let endAfterTurn: CloseReason | null = null;

    for await (const event of events) {
      switch (event.type) {
        case 'transcript_partial':
          this.#transport.send({ type: 'transcript', turnId, text: event.text, final: false });
          break;

        case 'transcript_final':
          transcript = event.text;
          this.#transport.send({ type: 'transcript', turnId, text: event.text, final: true });
          break;

        case 'affect':
          this.#transport.send({
            type: 'affect',
            turnId,
            emotion: event.affect.emotion,
            intensity: event.affect.intensity,
            ...(event.affect.gesture !== undefined ? { gesture: event.affect.gesture } : {}),
          });
          break;

        case 'token':
          reply += event.text;
          this.#transport.send({ type: 'token', turnId, text: event.text });
          break;

        case 'audio':
          voiceSeconds += event.chunk.pcm.byteLength / (event.chunk.sampleRate * 2);
          this.#transport.send({
            type: 'audio_meta',
            turnId,
            seq: event.chunk.seq,
            sampleRate: event.chunk.sampleRate,
          });
          this.#transport.sendAudio(event.chunk);
          break;

        case 'safety': {
          const response = evaluateSafety(event.verdict, {
            region: this.#grant.region,
            locale: this.#grant.locale,
            userStatedMinor: statesMinorAge(transcript),
          });
          suppressMemory = response.suppressMemoryWrite;
          await this.#deps.safety
            ?.record({
              subjectId: this.#grant.subjectId,
              conversationId: this.#grant.conversationId,
              policyVersion: response.policyVersion,
              outcome: response.outcome,
              atIso: new Date(this.#deps.now()).toISOString(),
            })
            .catch(() => undefined);
          this.#transport.send({ type: 'safety', turnId, action: event.verdict.action });
          if (response.endSession) endAfterTurn = 'protocol_error';
          break;
        }

        case 'done':
          await this.#deps.usage.record({
            turnId: turnKey,
            subjectId: this.#grant.subjectId,
            voiceSeconds,
            costUsd: event.metric.totalCostUsd,
            at: this.#deps.now(),
            plan: this.#grant.plan,
          });
          break;

        case 'degraded':
        case 'failed':
          break;
      }
    }

    this.#turnsCompleted += 1;
    this.#transport.send({ type: 'turn_done', turnId });

    if (transcript && reply) {
      this.#history.push({ role: 'user', content: transcript });
      this.#history.push({ role: 'companion', content: reply });
      if (!suppressMemory) await this.#proposeMemories(transcript, reply, turnId);
      await this.#saveTurn(turnId, transcript, reply, suppressMemory);
    }

    await this.#refreshUsage();
    this.#sendUsage();

    const entitlement = this.#entitlement();
    if (!entitlement.canStartVoice) {
      this.#transport.send({ type: 'limit', kind: this.#limitKind() });
    }
    if (endAfterTurn !== null) {
      this.#transport.close(endAfterTurn);
      this.#closed = true;
    }

    // Solo si sigue siendo el turno actual: mientras este terminaba (guardando memoria,
    // historial, consumo) pudo empezar otro, y su estado no se toca.
    if (this.#turnId === turnId) {
      this.#audio = null;
      this.#turnId = null;
      this.#abort = null;
      this.#running = null;
    }
  }

  async #resumeConversation(): Promise<void> {
    const log = this.#deps.conversations;
    if (!log) return;
    const nowIso = new Date(this.#deps.now()).toISOString();
    await log.open({
      conversationId: this.#grant.conversationId,
      subjectId: this.#grant.subjectId,
      companionId: 'rio',
      atIso: nowIso,
    });
    const previous = await log.recentMessages(
      this.#grant.conversationId,
      this.#grant.subjectId,
      RESUME_MESSAGES,
      nowIso,
    );
    for (const message of previous) this.#history.push({ role: message.role, content: message.content });
  }

  /**
   * Guarda el turno. `sensitive` cuando la politica de seguridad aparto el turno de la
   * memoria: esos mensajes se guardan con retencion corta. Si guardar falla, la
   * conversacion sigue; perder el historial de un turno es mejor que cortarlo.
   */
  async #saveTurn(turnId: string, userText: string, companionText: string, sensitive: boolean): Promise<void> {
    await this.#deps.conversations
      ?.appendTurn({
        conversationId: this.#grant.conversationId,
        subjectId: this.#grant.subjectId,
        turnId,
        locale: this.#grant.locale,
        userText,
        companionText,
        atIso: new Date(this.#deps.now()).toISOString(),
        sensitive,
      })
      .catch(() => undefined);
  }

  async #proposeMemories(userText: string, companionText: string, turnId: string): Promise<void> {
    const candidates = new HeuristicExtractor().extract({ userText, companionText, turnId });
    for (const candidate of candidates) {
      // Quedan en `proposed`: el usuario los aprueba en el centro de memoria. Si guardar
      // falla, la conversacion sigue: perder una propuesta es mejor que cortar el turno.
      await this.#deps.memory
        .propose({
          subjectId: this.#grant.subjectId,
          companionId: 'rio',
          candidate,
          sourceTurnId: turnId,
        })
        .catch(() => undefined);
    }
  }

  async #recallIntoHistory(): Promise<readonly DomainMessage[]> {
    const last = this.#history.at(-1);
    const recalled = await this.#deps.memory.recall({
      subjectId: this.#grant.subjectId,
      companionId: 'rio',
      text: typeof last?.content === 'string' ? last.content : '',
      limit: 5,
    });
    // Como bloque de datos delimitado: un recuerdo es texto del usuario y no puede colarse
    // como instruccion (ver @kotaru/persona).
    const block = memoryMessage(recalled, this.#grant.locale);
    return block ? [...this.#history, block] : this.#history;
  }

  async #refreshUsage(): Promise<void> {
    const [subject, totalCostUsd, freeCostUsd] = await Promise.all([
      this.#deps.usage.forSubject(this.#grant.subjectId),
      this.#deps.usage.totalCostUsd(),
      this.#grant.plan === 'free' ? this.#deps.usage.freeCostUsd() : Promise.resolve(0),
    ]);
    this.#usage = { subject, totalCostUsd, freeCostUsd };
  }

  #context(signal: AbortSignal): ProviderContext {
    const used = this.#usage.subject;
    return {
      requestId: `${this.#grant.jti}:${this.#turnsCompleted}`,
      subjectId: this.#grant.subjectId,
      region: this.#grant.region,
      locale: this.#grant.locale,
      sensitivity: this.#grant.sensitivity,
      budget: {
        sessionRemainingUsd: Math.max(0, this.#grant.budget.sessionRemainingUsd - used.costUsd),
        monthlyRemainingUsd: Math.max(
          0,
          this.#deps.budget.hardCapUsd - this.#usage.totalCostUsd,
        ),
        hardCapUsd: this.#deps.budget.hardCapUsd,
      },
      deadlineMs: 15_000,
      signal,
    };
  }

  #entitlement() {
    const used = this.#usage.subject;
    return entitlementFor({
      planId: this.#grant.plan as PlanId,
      usedVoiceSeconds: used.voiceSeconds,
      spend: this.#spend(),
    });
  }

  /** La escalera de gasto global, mas el tope propio del plan gratuito. */
  #spend() {
    const spend = evaluateSpend(this.#usage.totalCostUsd, this.#deps.budget);
    if (this.#grant.plan === 'free' && freeVoiceExhausted(this.#usage.freeCostUsd, this.#deps.budget)) {
      return { ...spend, disableFreeVoice: true };
    }
    return spend;
  }

  #limitKind(): 'plan' | 'session' | 'spend' {
    const spend = this.#spend();
    if (spend.voiceKillSwitch || spend.disableFreeVoice) return 'spend';
    return 'plan';
  }

  #sendUsage(): void {
    const entitlement = this.#entitlement();
    this.#transport.send({
      type: 'usage',
      remainingSeconds: Math.round(entitlement.remainingVoiceSeconds),
      planSeconds: Math.round(
        entitlement.remainingVoiceSeconds + this.#usage.subject.voiceSeconds,
      ),
    });
  }
}
