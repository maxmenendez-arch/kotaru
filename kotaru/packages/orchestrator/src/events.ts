import type { AffectSignal, AudioChunk, Capability, ModerationVerdict } from '@kotaru/ai-contracts';
import type { TurnMetric } from '@kotaru/telemetry';

export type TurnStage = Extract<Capability, 'stt' | 'llm' | 'tts' | 'moderation'>;

export type TurnFailure =
  | 'no_viable_route'
  | 'provider_failed_mid_stream'
  | 'cancelled'
  | 'budget_exhausted';

export type TurnEvent =
  | { readonly type: 'transcript_partial'; readonly text: string }
  | { readonly type: 'transcript_final'; readonly text: string }
  | { readonly type: 'affect'; readonly affect: AffectSignal }
  | { readonly type: 'token'; readonly text: string }
  | { readonly type: 'audio'; readonly chunk: AudioChunk }
  | { readonly type: 'safety'; readonly verdict: ModerationVerdict }
  /** Se cambio de proveedor antes de emitir nada. El usuario no deberia notarlo. */
  | { readonly type: 'degraded'; readonly stage: TurnStage; readonly from: string; readonly to: string }
  | { readonly type: 'failed'; readonly stage: TurnStage; readonly reason: TurnFailure }
  | { readonly type: 'done'; readonly metric: TurnMetric };
