import type {
  AudioChunk,
  CostEstimate,
  Locale,
  ProviderContext,
  ProviderDescriptor,
  ProviderHealth,
  TextChunk,
  Usage,
} from './context.js';
import type { AffectSignal } from './affect.js';

export type TranscriptEvent =
  | { readonly type: 'partial'; readonly text: string; readonly atMs: number }
  | { readonly type: 'final'; readonly text: string; readonly atMs: number; readonly confidence?: number }
  | { readonly type: 'endpoint'; readonly atMs: number }
  | { readonly type: 'usage'; readonly usage: Usage; readonly cost: CostEstimate };

export interface SpeechToTextProvider {
  readonly descriptor: ProviderDescriptor;
  transcribeStream(
    input: AsyncIterable<AudioChunk>,
    ctx: ProviderContext,
  ): AsyncIterable<TranscriptEvent>;
  estimate(input: { readonly audioSeconds: number }, ctx: ProviderContext): CostEstimate;
  health(): Promise<ProviderHealth>;
}

export type LlmStopReason = 'complete' | 'length' | 'cancelled' | 'safety';

export type LlmEvent =
  | { readonly type: 'token'; readonly text: string }
  | { readonly type: 'affect'; readonly affect: AffectSignal }
  /**
   * El propio modelo juzga que la persona expresa riesgo de suicidio o autolesion (segunda
   * capa, detras del lexico de @kotaru/safety: capta lo que no se dice con palabras
   * explicitas). El orquestador corta la respuesta y deriva a los recursos de crisis.
   */
  | { readonly type: 'crisis_signal' }
  | { readonly type: 'stop'; readonly reason: LlmStopReason }
  | { readonly type: 'usage'; readonly usage: Usage; readonly cost: CostEstimate };

export interface DomainMessage {
  readonly role: 'system' | 'user' | 'companion';
  readonly content: string;
  readonly locale?: Locale;
}

export interface LlmOptions {
  readonly personaId: string;
  readonly promptVersion: string;
  readonly maxOutputTokens: number;
  readonly temperature: number;
  readonly allowAffectChannel: boolean;
}

export interface LanguageModelProvider {
  readonly descriptor: ProviderDescriptor;
  stream(
    messages: readonly DomainMessage[],
    options: LlmOptions,
    ctx: ProviderContext,
  ): AsyncIterable<LlmEvent>;
  estimate(
    input: { readonly inputTokens: number; readonly outputTokens: number },
    ctx: ProviderContext,
  ): CostEstimate;
  health(): Promise<ProviderHealth>;
}

export interface VoiceConfig {
  readonly voiceId: string;
  readonly locale: Locale;
  /** 0.8 .. 1.25 */
  readonly speed: number;
  readonly expressive: boolean;
  /**
   * Toda voz clonada exige consentimiento documentado y terminos de proveedor
   * que lo permitan. Sin implementacion en el MVP (D-004).
   */
  readonly clonedFromConsentId?: string;
}

export interface TextToSpeechProvider {
  readonly descriptor: ProviderDescriptor;
  synthesizeStream(
    text: AsyncIterable<TextChunk>,
    voice: VoiceConfig,
    ctx: ProviderContext,
  ): AsyncIterable<AudioChunk>;
  estimate(input: { readonly characters: number }, ctx: ProviderContext): CostEstimate;
  health(): Promise<ProviderHealth>;
}

export interface RealtimeConfig {
  readonly voice: VoiceConfig;
  readonly personaId: string;
  readonly promptVersion: string;
  readonly maxSessionSeconds: number;
}

export type RealtimeEvent =
  | TranscriptEvent
  | LlmEvent
  | { readonly type: 'audio'; readonly chunk: AudioChunk };

export interface RealtimeSession {
  readonly sessionId: string;
  send(chunk: AudioChunk): void;
  events(): AsyncIterable<RealtimeEvent>;
  interrupt(): Promise<void>;
  close(reason: string): Promise<void>;
}

export interface RealtimeSpeechProvider {
  readonly descriptor: ProviderDescriptor;
  createSession(config: RealtimeConfig, ctx: ProviderContext): Promise<RealtimeSession>;
  estimate(input: { readonly sessionSeconds: number }, ctx: ProviderContext): CostEstimate;
  health(): Promise<ProviderHealth>;
}

export type ModerationCategory =
  | 'self_harm'
  | 'sexual'
  | 'minor_safety'
  | 'harassment'
  | 'violence'
  | 'illegal'
  | 'impersonation'
  | 'prompt_injection';

export type ModerationAction = 'allow' | 'soften' | 'refuse' | 'crisis_handoff';

export interface ModerationVerdict {
  readonly allowed: boolean;
  readonly categories: readonly { readonly category: ModerationCategory; readonly score: number }[];
  readonly action: ModerationAction;
  readonly policyVersion: string;
}

export interface ModerationProvider {
  readonly descriptor: ProviderDescriptor;
  classify(
    input: { readonly text: string; readonly direction: 'inbound' | 'outbound' },
    ctx: ProviderContext,
  ): Promise<ModerationVerdict>;
  health(): Promise<ProviderHealth>;
}

export interface EmbeddingResult {
  readonly vectors: readonly Float32Array[];
  readonly model: string;
  readonly dimensions: number;
  readonly usage: Usage;
  readonly cost: CostEstimate;
}

export interface EmbeddingProvider {
  readonly descriptor: ProviderDescriptor;
  embed(texts: readonly string[], ctx: ProviderContext): Promise<EmbeddingResult>;
  health(): Promise<ProviderHealth>;
}

export type AnyProvider =
  | SpeechToTextProvider
  | LanguageModelProvider
  | TextToSpeechProvider
  | RealtimeSpeechProvider
  | ModerationProvider
  | EmbeddingProvider;
