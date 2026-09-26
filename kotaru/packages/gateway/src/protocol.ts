import type { AudioChunk, ModerationAction } from '@kotaru/ai-contracts';
import type { GrantRejection } from './grants.js';

export const PROTOCOL_VERSION = 1;

/**
 * Mensajes del cliente al gateway.
 *
 * El audio viaja en frames binarios, no aqui: meter PCM en JSON lo infla un 33% en
 * base64 y anade una copia por chunk. Este canal es solo de control.
 */
export type ClientMessage =
  | { readonly type: 'hello'; readonly grant: string; readonly protocolVersion: number }
  /** El usuario presiono el boton de hablar. */
  | { readonly type: 'turn_start'; readonly turnId: string }
  /** El usuario lo solto. El gateway cierra el stream de audio de este turno. */
  | { readonly type: 'turn_end'; readonly turnId: string }
  /** Barge-in: el usuario habla encima de la respuesta. Cancela sintesis y generacion. */
  | { readonly type: 'interrupt'; readonly turnId: string }
  | { readonly type: 'bye' };

export type ServerMessage =
  | { readonly type: 'ready'; readonly sessionId: string; readonly maxSessionSeconds: number }
  | { readonly type: 'rejected'; readonly reason: GrantRejection }
  | { readonly type: 'transcript'; readonly turnId: string; readonly text: string; readonly final: boolean }
  | { readonly type: 'token'; readonly turnId: string; readonly text: string }
  | { readonly type: 'affect'; readonly turnId: string; readonly emotion: string; readonly intensity: number; readonly gesture?: string }
  | { readonly type: 'audio_meta'; readonly turnId: string; readonly seq: number; readonly sampleRate: AudioChunk['sampleRate'] }
  | { readonly type: 'safety'; readonly turnId: string; readonly action: ModerationAction }
  | { readonly type: 'turn_done'; readonly turnId: string }
  /**
   * Medidor visible. Se manda en minutos, no en dolares: el usuario compra tiempo de
   * conversacion, y mostrarle su costo de proveedor seria a la vez confuso y una
   * filtracion de margen.
   */
  | { readonly type: 'usage'; readonly remainingSeconds: number; readonly planSeconds: number }
  | { readonly type: 'limit'; readonly kind: 'plan' | 'session' | 'spend' }
  | { readonly type: 'closing'; readonly reason: CloseReason };

export type CloseReason =
  | 'client_bye'
  | 'grant_expired'
  | 'session_max_duration'
  | 'idle_timeout'
  | 'plan_limit'
  | 'spend_cap'
  | 'server_shutdown'
  /** Fallo interno, por ejemplo la base de datos. El cliente puede reintentar. */
  | 'server_error'
  | 'protocol_error';

/**
 * Limites de backpressure.
 *
 * Si el cliente deja de consumir audio, el gateway no puede acumularlo sin fin: en una
 * conversacion de voz un buffer grande no ayuda, solo retrasa. Al pasarse, se descarta
 * el audio mas viejo del turno en curso, que ya no tiene valor.
 */
export interface BackpressurePolicy {
  readonly maxBufferedAudioMs: number;
  readonly maxPendingControlMessages: number;
  readonly idleTimeoutMs: number;
}

export const DEFAULT_BACKPRESSURE: BackpressurePolicy = {
  maxBufferedAudioMs: 2_000,
  maxPendingControlMessages: 64,
  idleTimeoutMs: 45_000,
};

export function isClientMessage(value: unknown): value is ClientMessage {
  if (typeof value !== 'object' || value === null) return false;
  const type = (value as { type?: unknown }).type;
  return (
    type === 'hello' ||
    type === 'turn_start' ||
    type === 'turn_end' ||
    type === 'interrupt' ||
    type === 'bye'
  );
}
