/**
 * Ventana flotante en el movil nativo: todavia no (hace falta el modo imagen en imagen de
 * iOS y Android, con el 3D nativo). La web la tiene en pip.web.ts.
 */
export type PipMode = 'document' | 'video' | null;

export interface PipOptions {
  readonly canvas: unknown;
  readonly name: string;
  readonly aiBadge: string;
  readonly accent: string;
  readonly talkLabel: string;
  readonly releaseLabel: string;
  readonly backLabel: string;
  onTalkStart(): void;
  onTalkEnd(): void;
  onClosed(): void;
  onFailed?(reason: string): void;
}

export interface PipHandle {
  update(stateLabel: string, listening: boolean, canTalk: boolean): void;
  close(): void;
}

export function pipSupport(): PipMode {
  return null;
}

export async function openPip(_options: PipOptions): Promise<PipHandle | null> {
  return null;
}

export function preparePip(_canvas: unknown): void {}

export function disposePip(): void {}

export function autoPip(_open: () => void): () => void {
  return () => undefined;
}
