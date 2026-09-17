import {
  type AudioChunk,
  type DomainMessage,
  type ModerationProvider,
  type ProviderContext,
} from '@kotaru/ai-contracts';
import {
  entitlementFor,
  evaluateSpend,
  UsageMeter,
  type SpendBudget,
  type PlanId,
} from '@kotaru/billing';
import { DEFAULT_BACKPRESSURE, type ClientMessage, type CloseReason, type ServerMessage, type SessionGrant } from '@kotaru/gateway';
import { HeuristicExtractor, MemoryStore } from '@kotaru/memory';
import {
  AsyncQueue,
  runTurn,
  type ProviderResolver,
  type RouterPort,
} from '@kotaru/orchestrator';
import { evaluateSafety, statesMinorAge } from '@kotaru/safety';
import type { MetricSink } from '@kotaru/telemetry';

export interface SessionDeps {
  readonly router: RouterPort;
  readonly resolve: ProviderResolver;
  readonly moderation: ModerationProvider;
  readonly memory: MemoryStore;
  readonly meter: UsageMeter;
  readonly sink: MetricSink;
  readonly budget: SpendBudget;
  readonly now: () => number;
  readonly infraCostUsd?: number;
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
  #lastActivityMs: number;
  #closed = false;
  #turnsCompleted = 0;

  constructor(grant: SessionGrant, transport: SessionTransport, deps: SessionDeps) {
    this.#grant = grant;
    this.#transport = transport;
    this.#deps = deps;
    this.#startedAtMs = deps.now();
    this.#lastActivityMs = this.#startedAtMs;

    this.#history.push({
      role: 'system',
      content: 'Eres un companion calido y honesto. Nunca afirmas ser humano.',
    });
  }

  get turnsCompleted(): number {
    return this.#turnsCompleted;
  }

  start(): void {
    const entitlement = this.#entitlement();
    this.#transport.send({
      type: 'ready',
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
        const entitlement = this.#entitlement();
        if (!entitlement.canStartVoice) {
          this.#transport.send({ type: 'limit', kind: this.#limitKind() });
          return;
        }
        this.#turnId = message.turnId;
        this.#audio = new AsyncQueue<AudioChunk>();
        this.#abort = new AbortController();
        return;
      }

      case 'turn_end': {
        if (this.#turnId !== message.turnId || !this.#audio) return;
        this.#audio.close();
        await this.#runTurn(message.turnId);
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

  async #runTurn(turnId: string): Promise<void> {
    const ctx = this.#context();
    const audio = this.#audio;
    if (!audio) return;

    let transcript = '';
    let reply = '';
    let voiceSeconds = 0;

    const events = runTurn(
      {
        conversationId: this.#grant.conversationId,
        turnId,
        audio,
        history: this.#recallIntoHistory(),
        llmOptions: {
          personaId: 'rio-v1',
          promptVersion: '0.1.0',
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
          this.#transport.send({ type: 'safety', turnId, action: event.verdict.action });
          if (response.endSession) endAfterTurn = 'protocol_error';
          break;
        }

        case 'done':
          this.#deps.meter.record({
            turnId,
            subjectId: this.#grant.subjectId,
            voiceSeconds,
            costUsd: event.metric.totalCostUsd,
            at: this.#deps.now(),
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
      if (!suppressMemory) this.#proposeMemories(transcript, reply, turnId);
    }

    this.#sendUsage();

    const entitlement = this.#entitlement();
    if (!entitlement.canStartVoice) {
      this.#transport.send({ type: 'limit', kind: this.#limitKind() });
    }
    if (endAfterTurn !== null) {
      this.#transport.close(endAfterTurn);
      this.#closed = true;
    }

    this.#audio = null;
    this.#turnId = null;
    this.#abort = null;
  }

  #proposeMemories(userText: string, companionText: string, turnId: string): void {
    const candidates = new HeuristicExtractor().extract({ userText, companionText, turnId });
    for (const candidate of candidates) {
      // Quedan en `proposed`: el usuario los aprueba en el centro de memoria.
      this.#deps.memory.propose({
        subjectId: this.#grant.subjectId,
        companionId: 'rio',
        candidate,
        sourceTurnId: turnId,
      });
    }
  }

  #recallIntoHistory(): readonly DomainMessage[] {
    const last = this.#history.at(-1);
    const recalled = this.#deps.memory.recall({
      subjectId: this.#grant.subjectId,
      companionId: 'rio',
      text: typeof last?.content === 'string' ? last.content : '',
      limit: 5,
    });
    if (recalled.length === 0) return this.#history;

    return [
      ...this.#history,
      {
        role: 'system',
        content: `Recuerdos aprobados por el usuario: ${recalled.map((m) => m.text).join('; ')}`,
      },
    ];
  }

  #context(): ProviderContext {
    const used = this.#deps.meter.forSubject(this.#grant.subjectId);
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
          this.#deps.budget.hardCapUsd - this.#deps.meter.totalCostUsd(),
        ),
        hardCapUsd: this.#deps.budget.hardCapUsd,
      },
      deadlineMs: 15_000,
      signal: this.#abort?.signal ?? new AbortController().signal,
    };
  }

  #entitlement() {
    const used = this.#deps.meter.forSubject(this.#grant.subjectId);
    return entitlementFor({
      planId: this.#grant.plan as PlanId,
      usedVoiceSeconds: used.voiceSeconds,
      spend: evaluateSpend(this.#deps.meter.totalCostUsd(), this.#deps.budget),
    });
  }

  #limitKind(): 'plan' | 'session' | 'spend' {
    const spend = evaluateSpend(this.#deps.meter.totalCostUsd(), this.#deps.budget);
    if (spend.voiceKillSwitch || spend.disableFreeVoice) return 'spend';
    return 'plan';
  }

  #sendUsage(): void {
    const entitlement = this.#entitlement();
    this.#transport.send({
      type: 'usage',
      remainingSeconds: Math.round(entitlement.remainingVoiceSeconds),
      planSeconds: Math.round(
        entitlement.remainingVoiceSeconds + this.#deps.meter.forSubject(this.#grant.subjectId).voiceSeconds,
      ),
    });
  }
}
