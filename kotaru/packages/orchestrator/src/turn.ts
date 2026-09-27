import {
  type AudioChunk,
  type CostEstimate,
  type DomainMessage,
  type LanguageModelProvider,
  type LlmOptions,
  type ModerationProvider,
  type PredictedUsage,
  type ProviderContext,
  type QualityTier,
  type RouteDecision,
  type RouteOutcome,
  type RouteRequest,
  type SpeechToTextProvider,
  type TextChunk,
  type TextToSpeechProvider,
  type VoiceConfig,
} from '@kotaru/ai-contracts';
import type { MetricSink, TurnMetric } from '@kotaru/telemetry';
import { AsyncQueue } from './queue.js';
import { SentenceBuffer } from './sentences.js';
import type { TurnEvent, TurnStage } from './events.js';

export interface RouterPort {
  select(req: RouteRequest): RouteDecision;
  report(outcome: RouteOutcome): void;
}

export interface ProviderResolver {
  stt(id: string): SpeechToTextProvider | undefined;
  llm(id: string): LanguageModelProvider | undefined;
  tts(id: string): TextToSpeechProvider | undefined;
}

export interface TurnDeps {
  readonly router: RouterPort;
  readonly resolve: ProviderResolver;
  readonly moderation: ModerationProvider;
  readonly sink: MetricSink;
  readonly now: () => number;
  readonly infraCostUsd?: number;
}

export interface TurnInput {
  readonly conversationId: string;
  readonly turnId: string;
  readonly audio: AsyncIterable<AudioChunk>;
  readonly history: readonly DomainMessage[];
  readonly llmOptions: LlmOptions;
  readonly voice: VoiceConfig;
  readonly quality: QualityTier;
  readonly predicted: PredictedUsage;
}

/**
 * Graba el audio mientras se consume para poder reproducirlo ante un segundo
 * proveedor. Sin esto, un fallo de STT despues del primer chunk perderia la frase
 * del usuario: no se le puede pedir que la repita porque el proveedor fallo.
 */
class ReplayableAudio {
  readonly #recorded: AudioChunk[] = [];
  readonly #source: AsyncIterator<AudioChunk>;
  #exhausted = false;

  constructor(source: AsyncIterable<AudioChunk>) {
    this.#source = source[Symbol.asyncIterator]();
  }

  async *stream(): AsyncIterable<AudioChunk> {
    for (const chunk of this.#recorded) yield chunk;
    while (!this.#exhausted) {
      const next = await this.#source.next();
      if (next.done === true) {
        this.#exhausted = true;
        return;
      }
      this.#recorded.push(next.value);
      yield next.value;
    }
  }
}

interface Opened<T> {
  readonly providerId: string;
  readonly first: IteratorResult<T>;
  readonly iterator: AsyncIterator<T>;
  readonly fellBack: boolean;
}

/**
 * Abre un stream probando el proveedor elegido y luego sus fallbacks.
 *
 * La regla es deliberada: el fallback solo actua ANTES de emitir el primer evento.
 * Una vez que el usuario oye la primera silaba no se puede cambiar de voz a mitad
 * de frase sin que suene a otra persona, asi que un fallo posterior termina el turno
 * en vez de disimularlo.
 */
async function openWithFallback<T>(
  stage: TurnStage,
  decision: RouteDecision,
  open: (providerId: string) => AsyncIterable<T>,
  deps: TurnDeps,
  out: AsyncQueue<TurnEvent>,
): Promise<Opened<T>> {
  const candidates = [decision.providerId, ...decision.fallbacks];
  let lastError: unknown;

  for (let i = 0; i < candidates.length; i += 1) {
    const providerId = candidates[i]!;
    const startedAt = deps.now();
    try {
      const iterator = open(providerId)[Symbol.asyncIterator]();
      const first = await iterator.next();
      if (i > 0) {
        out.push({ type: 'degraded', stage, from: candidates[0]!, to: providerId });
      }
      return { providerId, first, iterator, fellBack: i > 0 };
    } catch (error) {
      lastError = error;
      deps.router.report({
        routeId: decision.routeId,
        providerId,
        ok: false,
        latencyMs: deps.now() - startedAt,
        error: 'upstream',
      });
    }
  }
  throw lastError ?? new Error(`sin candidatos para la etapa '${stage}'`);
}

/** Ejecuta un turno completo y emite sus eventos en orden de llegada. */
export function runTurn(
  input: TurnInput,
  ctx: ProviderContext,
  deps: TurnDeps,
): AsyncIterable<TurnEvent> {
  const out = new AsyncQueue<TurnEvent>();
  void drive(input, ctx, deps, out);
  return out;
}

async function drive(
  input: TurnInput,
  ctx: ProviderContext,
  deps: TurnDeps,
  out: AsyncQueue<TurnEvent>,
): Promise<void> {
  const startedAt = deps.now();
  const costs = { stt: 0, llm: 0, tts: 0 };
  const providers: { stt?: string; llm?: string; tts?: string } = {};
  let fallbackUsed = false;
  let allVerified = true;
  let endpointAt: number | undefined;
  let finalAt: number | undefined;
  let llmTtftMs: number | undefined;
  let ttsTtfbMs: number | undefined;
  let userSpeechMs: number | undefined;
  let transcript = '';

  const account = (estimate: CostEstimate, bucket: 'stt' | 'llm' | 'tts'): void => {
    costs[bucket] += estimate.amountUsd;
    if (estimate.basis !== 'verified') allVerified = false;
  };

  const finish = (interrupted: boolean): void => {
    const metric = buildMetric({
      input,
      providers,
      costs,
      infraCostUsd: deps.infraCostUsd ?? 0,
      turnTotalMs: deps.now() - startedAt,
      allVerified,
      fallbackUsed,
      interrupted,
      createdAt: new Date(deps.now()).toISOString(),
      ...(endpointAt !== undefined && finalAt !== undefined
        ? { endpointToFinalMs: finalAt - endpointAt }
        : {}),
      ...(llmTtftMs !== undefined ? { llmTtftMs } : {}),
      ...(ttsTtfbMs !== undefined ? { ttsTtfbMs } : {}),
      ...(userSpeechMs !== undefined ? { userSpeechMs } : {}),
    });
    deps.sink.emitTurn(metric);
    out.push({ type: 'done', metric });
    out.close();
  };

  try {
    // ---- 1. Transcripcion -------------------------------------------------
    const audio = new ReplayableAudio(input.audio);
    const sttDecision = deps.router.select({
      capability: 'stt',
      quality: input.quality,
      ctx,
      predicted: input.predicted,
    });

    const stt = await openWithFallback<import('@kotaru/ai-contracts').TranscriptEvent>(
      'stt',
      sttDecision,
      (id) => {
        const provider = deps.resolve.stt(id);
        if (!provider) throw new Error(`proveedor STT no registrado: ${id}`);
        return provider.transcribeStream(audio.stream(), ctx);
      },
      deps,
      out,
    );
    providers.stt = stt.providerId;
    fallbackUsed ||= stt.fellBack;

    for (let step = stt.first; step.done !== true; step = await stt.iterator.next()) {
      const event = step.value;
      switch (event.type) {
        case 'partial':
          out.push({ type: 'transcript_partial', text: event.text });
          break;
        case 'endpoint':
          endpointAt = deps.now();
          userSpeechMs = event.atMs;
          break;
        case 'final':
          finalAt = deps.now();
          transcript = event.text;
          out.push({ type: 'transcript_final', text: event.text });
          break;
        case 'usage':
          account(event.cost, 'stt');
          break;
      }
    }

    if (ctx.signal.aborted) {
      out.push({ type: 'failed', stage: 'stt', reason: 'cancelled' });
      finish(true);
      return;
    }

    if (transcript.trim() === '') {
      // Silencio o ruido: responder a nada cuesta dinero y confunde. El turno termina aqui.
      out.push({ type: 'failed', stage: 'stt', reason: 'no_speech' });
      finish(false);
      return;
    }

    // ---- 2. Moderacion de entrada ----------------------------------------
    const verdict = await deps.moderation.classify(
      { text: transcript, direction: 'inbound' },
      ctx,
    );
    if (!verdict.allowed) {
      out.push({ type: 'safety', verdict });
      finish(false);
      return;
    }

    // ---- 3. Generacion y sintesis, en paralelo ---------------------------
    const messages: DomainMessage[] = [
      ...input.history,
      { role: 'user', content: transcript, locale: ctx.locale },
    ];

    const llmDecision = deps.router.select({
      capability: 'llm',
      quality: input.quality,
      ctx,
      predicted: input.predicted,
    });
    const ttsDecision = deps.router.select({
      capability: 'tts',
      quality: input.quality,
      ctx,
      predicted: input.predicted,
    });

    const sentences = new AsyncQueue<TextChunk>();
    let spokenCharacters = 0;

    const generation = (async (): Promise<void> => {
      const llm = await openWithFallback<import('@kotaru/ai-contracts').LlmEvent>(
        'llm',
        llmDecision,
        (id) => {
          const provider = deps.resolve.llm(id);
          if (!provider) throw new Error(`proveedor LLM no registrado: ${id}`);
          return provider.stream(messages, input.llmOptions, ctx);
        },
        deps,
        out,
      );
      providers.llm = llm.providerId;
      fallbackUsed ||= llm.fellBack;

      const buffer = new SentenceBuffer();
      const emit = (text: string): void => {
        spokenCharacters += text.length;
        sentences.push({ text, isFinal: false });
      };

      for (let step = llm.first; step.done !== true; step = await llm.iterator.next()) {
        const event = step.value;
        switch (event.type) {
          case 'affect':
            out.push({ type: 'affect', affect: event.affect });
            break;
          case 'token':
            if (llmTtftMs === undefined) llmTtftMs = deps.now() - startedAt;
            out.push({ type: 'token', text: event.text });
            for (const sentence of buffer.push(event.text)) emit(sentence);
            break;
          case 'usage':
            account(event.cost, 'llm');
            break;
          case 'stop':
            break;
        }
      }

      const tail = buffer.flush();
      if (tail !== null) emit(tail);
      sentences.close();
    })();

    const synthesis = (async (): Promise<void> => {
      const tts = await openWithFallback<AudioChunk>(
        'tts',
        ttsDecision,
        (id) => {
          const provider = deps.resolve.tts(id);
          if (!provider) throw new Error(`proveedor TTS no registrado: ${id}`);
          return provider.synthesizeStream(sentences, input.voice, ctx);
        },
        deps,
        out,
      );
      providers.tts = tts.providerId;
      fallbackUsed ||= tts.fellBack;

      for (let step = tts.first; step.done !== true; step = await tts.iterator.next()) {
        if (ttsTtfbMs === undefined) ttsTtfbMs = deps.now() - startedAt;
        out.push({ type: 'audio', chunk: step.value });
      }

      const provider = deps.resolve.tts(tts.providerId);
      if (provider) account(provider.estimate({ characters: spokenCharacters }, ctx), 'tts');
    })();

    await Promise.all([generation, synthesis]);
    finish(ctx.signal.aborted);
  } catch (error) {
    const stage: TurnStage = providers.llm === undefined ? 'stt' : 'tts';
    const reason = error instanceof Error && error.name === 'NoViableRouteError'
      ? 'no_viable_route'
      : 'provider_failed_mid_stream';
    out.push({ type: 'failed', stage, reason });
    finish(ctx.signal.aborted);
  }
}

interface MetricParts {
  input: TurnInput;
  providers: { stt?: string; llm?: string; tts?: string };
  costs: { stt: number; llm: number; tts: number };
  infraCostUsd: number;
  turnTotalMs: number;
  allVerified: boolean;
  fallbackUsed: boolean;
  interrupted: boolean;
  createdAt: string;
  endpointToFinalMs?: number;
  llmTtftMs?: number;
  ttsTtfbMs?: number;
  userSpeechMs?: number;
}

function buildMetric(parts: MetricParts): TurnMetric {
  const { providers, costs } = parts;
  const routeId = `stt:${providers.stt ?? '-'}|llm:${providers.llm ?? '-'}|tts:${providers.tts ?? '-'}`;
  const total = costs.stt + costs.llm + costs.tts + parts.infraCostUsd;

  return {
    conversationId: parts.input.conversationId,
    turnId: parts.input.turnId,
    routeId: routeId.slice(0, 64),
    ...(providers.stt !== undefined ? { sttProvider: providers.stt } : {}),
    ...(providers.llm !== undefined ? { llmProvider: providers.llm } : {}),
    ...(providers.tts !== undefined ? { ttsProvider: providers.tts } : {}),
    ...(parts.endpointToFinalMs !== undefined ? { endpointToFinalMs: parts.endpointToFinalMs } : {}),
    ...(parts.llmTtftMs !== undefined ? { llmTtftMs: parts.llmTtftMs } : {}),
    ...(parts.ttsTtfbMs !== undefined ? { ttsTtfbMs: parts.ttsTtfbMs } : {}),
    ...(parts.userSpeechMs !== undefined ? { userSpeechMs: parts.userSpeechMs } : {}),
    turnTotalMs: parts.turnTotalMs,
    sttCostUsd: round6(costs.stt),
    llmCostUsd: round6(costs.llm),
    ttsCostUsd: round6(costs.tts),
    infraCostUsd: round6(parts.infraCostUsd),
    totalCostUsd: round6(total),
    costBasis: parts.allVerified ? 'verified' : 'assumption',
    fallbackUsed: parts.fallbackUsed,
    interrupted: parts.interrupted,
    createdAt: parts.createdAt,
  };
}

function round6(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}
