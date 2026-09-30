/** Los sonidos relajantes de la app. */
export type AmbientKind = 'rain' | 'fire' | 'waterfall' | 'wind' | 'waves';
export const AMBIENT_KINDS: readonly AmbientKind[] = ['rain', 'fire', 'waterfall', 'wind', 'waves'];

export interface Ambient {
  /** false donde todavia no hay sonidos (app nativa por ahora). */
  readonly available: boolean;
  readonly playing: AmbientKind | null;
  readonly volume: number;
  play(kind: AmbientKind): void;
  stop(): void;
  /** 0..1 */
  setVolume(volume: number): void;
  /** Baja el ambiente mientras habla el personaje. */
  duck(on: boolean): void;
  dispose(): void;
}

/** Un reproductor de un sonido a la vez con volumen y `duck` (ambiente de lugar, musica). */
export interface Soundscape<K extends string> {
  readonly available: boolean;
  readonly playing: K | null;
  play(kind: K): void;
  stop(): void;
  setVolume(volume: number): void;
  duck(on: boolean): void;
  dispose(): void;
}

export function silentSoundscape<K extends string>(): Soundscape<K> {
  return { available: false, playing: null, play() {}, stop() {}, setVolume() {}, duck() {}, dispose() {} };
}
