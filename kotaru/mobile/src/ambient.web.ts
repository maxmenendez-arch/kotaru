import type { Ambient } from './ambient-types';
import { EngineAmbient } from './ambient-engine';

export * from './ambient-types';

/** Sonidos relajantes en el navegador (Web Audio). El motor esta en `ambient-engine.ts`. */
type Ctor = typeof AudioContext;
function audioContextCtor(): Ctor | null {
  const w = globalThis as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export function createAmbient(): Ambient {
  const Context = audioContextCtor();
  if (!Context) return { available: false, playing: null, volume: 0, play() {}, stop() {}, setVolume() {}, duck() {}, dispose() {} };
  return new EngineAmbient(() => new Context());
}
