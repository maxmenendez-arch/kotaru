import {
  parseAffect,
  type AudioChunk,
  type CostEstimate,
  type DomainMessage,
  type EmbeddingProvider,
  type EmbeddingResult,
  type LanguageModelProvider,
  type LlmEvent,
  type LlmOptions,
  type ModerationProvider,
  type ModerationVerdict,
  type PredictedUsage,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
  type SpeechToTextProvider,
  type TextChunk,
  type TextToSpeechProvider,
  type TranscriptEvent,
  type VoiceConfig,
} from '@kotaru/ai-contracts';
import {
  ASSEMBLYAI_UNIVERSAL_STREAMING,
  GEMINI_31_FLASH_LITE,
  POLLY_NEURAL,
  cost,
  type RateCard,
} from './rate-cards.js';

const HEALTHY: ProviderHealth = {
  status: 'healthy',
  p95LatencyMs: 800,
  errorRate: 0,
  observedAt: '2026-09-17T00:00:00.000Z',
};

function descriptor(partial: Partial<ProviderDescriptor> & Pick<ProviderDescriptor, 'id' | 'capability'>): ProviderDescriptor {
  return {
    regions: ['us'],
    locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
    maxSensitivity: 'elevated',
    retentionKnown: true,
    trainingOptOut: true,
    commercialAudioRights: true,
    quality: 0.8,
    enabled: true,
    ...partial,
  };
}

/** STT simulado. Determinista: el mismo guion produce siempre los mismos eventos. */
export class MockSttProvider implements SpeechToTextProvider {
  readonly descriptor = descriptor({ id: 'mock-stt', capability: 'stt', quality: 0.82 });
  readonly #script: string;
  readonly #card: RateCard = ASSEMBLYAI_UNIVERSAL_STREAMING;

  constructor(script = 'hola, hoy me fue bien en el trabajo') {
    this.#script = script;
  }

  async *transcribeStream(
    input: AsyncIterable<AudioChunk>,
    ctx: ProviderContext,
  ): AsyncIterable<TranscriptEvent> {
    let audioSeconds = 0;
    for await (const chunk of input) {
      if (ctx.signal.aborted) break;
      audioSeconds += chunk.pcm.byteLength / (chunk.sampleRate * 2);
    }

    const words = this.#script.split(' ');
    let atMs = 0;
    for (let i = 1; i <= words.length; i += 1) {
      atMs += 180;
      yield { type: 'partial', text: words.slice(0, i).join(' '), atMs };
    }
    yield { type: 'endpoint', atMs };
    yield { type: 'final', text: this.#script, atMs: atMs + 120, confidence: 0.94 };
    yield {
      type: 'usage',
      usage: { audioSecondsIn: audioSeconds, billedUnits: [{ unit: 'audio_hour', quantity: audioSeconds / 3600 }] },
      cost: this.estimate({ audioSeconds }, ctx),
    };
  }

  estimate(input: { readonly audioSeconds: number }, _ctx: ProviderContext): CostEstimate {
    const rate = this.#card.sttPerAudioHourUsd ?? 0;
    return cost(this.#card, (input.audioSeconds / 3600) * rate);
  }

  async health(): Promise<ProviderHealth> {
    return HEALTHY;
  }
}

/** LLM simulado. Emite tokens, una senal de emocion validada, y respeta la cancelacion. */
export class MockLlmProvider implements LanguageModelProvider {
  readonly descriptor = descriptor({ id: 'mock-llm', capability: 'llm', quality: 0.78 });
  readonly #reply: string;
  readonly #card: RateCard = GEMINI_31_FLASH_LITE;

  constructor(reply = 'Me alegra escuchar eso. Cuentame que fue lo mejor del dia.') {
    this.#reply = reply;
  }

  async *stream(
    messages: readonly DomainMessage[],
    options: LlmOptions,
    ctx: ProviderContext,
  ): AsyncIterable<LlmEvent> {
    const inputTokens = estimateTokens(messages.map((m) => m.content).join(' '));

    if (options.allowAffectChannel) {
      const affect = parseAffect({ emotion: 'warm', intensity: 0.55, gesture: 'nod' });
      if (affect) yield { type: 'affect', affect };
    }

    const words = this.#reply.split(' ');
    let emitted = 0;
    for (const word of words) {
      if (ctx.signal.aborted) {
        yield { type: 'stop', reason: 'cancelled' };
        yield this.#usage(inputTokens, emitted, ctx);
        return;
      }
      emitted += 1;
      yield { type: 'token', text: emitted === 1 ? word : ` ${word}` };
    }

    yield { type: 'stop', reason: 'complete' };
    yield this.#usage(inputTokens, estimateTokens(this.#reply), ctx);
  }

  #usage(inputTokens: number, outputTokens: number, ctx: ProviderContext): LlmEvent {
    return {
      type: 'usage',
      usage: {
        inputTokens,
        outputTokens,
        billedUnits: [
          { unit: 'input_token', quantity: inputTokens },
          { unit: 'output_token', quantity: outputTokens },
        ],
      },
      cost: this.estimate({ inputTokens, outputTokens }, ctx),
    };
  }

  estimate(
    input: { readonly inputTokens: number; readonly outputTokens: number },
    _ctx: ProviderContext,
  ): CostEstimate {
    const inRate = this.#card.llmInputPerMillionUsd ?? 0;
    const outRate = this.#card.llmOutputPerMillionUsd ?? 0;
    return cost(
      this.#card,
      (input.inputTokens / 1e6) * inRate + (input.outputTokens / 1e6) * outRate,
    );
  }

  async health(): Promise<ProviderHealth> {
    return HEALTHY;
  }
}

/** TTS simulado. Produce audio sintetico con marcas de visema y cuenta caracteres reales. */
export class MockTtsProvider implements TextToSpeechProvider {
  readonly descriptor = descriptor({ id: 'mock-tts', capability: 'tts', quality: 0.85 });
  readonly #card: RateCard = POLLY_NEURAL;

  async *synthesizeStream(
    text: AsyncIterable<TextChunk>,
    voice: VoiceConfig,
    ctx: ProviderContext,
  ): AsyncIterable<AudioChunk> {
    let seq = 0;
    let atMs = 0;
    for await (const chunk of text) {
      if (ctx.signal.aborted) return;
      const durationMs = Math.max(20, Math.round((chunk.text.length / 15) * 1000 / voice.speed));
      const samples = Math.round((24000 * durationMs) / 1000);
      yield {
        pcm: new Uint8Array(samples * 2),
        sampleRate: 24000,
        seq: seq++,
        visemes: [{ viseme: visemeFor(chunk.text), atMs, durationMs }],
      };
      atMs += durationMs;
    }
  }

  estimate(input: { readonly characters: number }, _ctx: ProviderContext): CostEstimate {
    const rate = this.#card.ttsPerMillionCharsUsd ?? 0;
    return cost(this.#card, (input.characters / 1e6) * rate);
  }

  async health(): Promise<ProviderHealth> {
    return HEALTHY;
  }
}

/** Moderacion simulada. Determinista y conservadora: ante duda, escala. */
export class MockModerationProvider implements ModerationProvider {
  readonly descriptor = descriptor({ id: 'mock-moderation', capability: 'moderation', quality: 0.7 });

  async classify(
    input: { readonly text: string; readonly direction: 'inbound' | 'outbound' },
    _ctx: ProviderContext,
  ): Promise<ModerationVerdict> {
    const lowered = input.text.toLowerCase();
    const crisis = ['quiero morir', 'hacerme dano', 'kill myself', 'end my life'];
    if (crisis.some((marker) => lowered.includes(marker))) {
      return {
        allowed: false,
        categories: [{ category: 'self_harm', score: 0.97 }],
        action: 'crisis_handoff',
        policyVersion: 'safety-policy@0.1.0',
      };
    }
    return {
      allowed: true,
      categories: [],
      action: 'allow',
      policyVersion: 'safety-policy@0.1.0',
    };
  }

  async health(): Promise<ProviderHealth> {
    return HEALTHY;
  }
}

/** Embeddings simulados. Vectores deterministas derivados del texto. */
export class MockEmbeddingProvider implements EmbeddingProvider {
  readonly descriptor = descriptor({ id: 'mock-embedding', capability: 'embedding', quality: 0.7 });
  readonly #dimensions = 64;

  async embed(texts: readonly string[], _ctx: ProviderContext): Promise<EmbeddingResult> {
    const vectors = texts.map((text) => {
      const vector = new Float32Array(this.#dimensions);
      let hash = 2166136261;
      for (let i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
        vector[i % this.#dimensions] = ((hash >>> 0) % 2000) / 1000 - 1;
      }
      return vector;
    });

    return {
      vectors,
      model: 'mock-embedding-v1',
      dimensions: this.#dimensions,
      usage: { characters: texts.join('').length, billedUnits: [{ unit: 'character', quantity: texts.join('').length }] },
      cost: { amountUsd: 0, basis: 'assumption', rateCardVersion: 'mock@0' },
    };
  }

  async health(): Promise<ProviderHealth> {
    return HEALTHY;
  }
}

/** Estimador de tokens para los simuladores. No pretende igualar a un tokenizador real. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function visemeFor(text: string): string {
  const first = text.trim().charAt(0).toLowerCase();
  if ('aeiou'.includes(first)) return `vowel_${first}`;
  if (first === '') return 'sil';
  return 'consonant';
}

/** Estimador generico para registrar un simulador en el router. */
export function estimatorFor(
  provider: SpeechToTextProvider | LanguageModelProvider | TextToSpeechProvider,
): (predicted: PredictedUsage, ctx: ProviderContext) => CostEstimate {
  return (predicted, ctx) => {
    if ('transcribeStream' in provider) {
      return provider.estimate({ audioSeconds: predicted.audioSeconds ?? 0 }, ctx);
    }
    if ('stream' in provider) {
      return provider.estimate(
        { inputTokens: predicted.inputTokens ?? 0, outputTokens: predicted.outputTokens ?? 0 },
        ctx,
      );
    }
    return provider.estimate({ characters: predicted.characters ?? 0 }, ctx);
  };
}
