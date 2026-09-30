import { silentSoundscape, type Ambient, type Soundscape } from './ambient-types';
import { EngineAmbient, EngineSound, type Builder } from './ambient-engine';
import { audioContextCtor, sharedOutput } from './web-audio';

export * from './ambient-types';

/**
 * Sonidos relajantes en el navegador (Web Audio). El motor esta en `ambient-engine.ts`.
 * Suenan en el mismo contexto que la voz (web-audio.ts), mezclados antes del limitador.
 */
export function createAmbient(): Ambient {
  if (!audioContextCtor()) return { available: false, playing: null, volume: 0, play() {}, stop() {}, setVolume() {}, duck() {}, dispose() {} };
  return new EngineAmbient(() => sharedOutput()?.context ?? null, () => undefined, {
    output: (ctx) => sharedOutput()?.bus ?? ctx.destination,
    sharedContext: true,
  });
}

/** Ambiente de un lugar o musica de un short (scene-sounds.ts), en el contexto de la voz. */
export function createSoundscape<K extends string>(builders: Readonly<Record<K, Builder>>, volume: number): Soundscape<K> {
  if (!audioContextCtor()) return silentSoundscape<K>();
  return new EngineSound<K>(builders, () => sharedOutput()?.context ?? null, () => undefined, { output: (ctx) => sharedOutput()?.bus ?? ctx.destination, sharedContext: true }, volume);
}
