import type { Ambient } from './ambient-types';
import { EngineAmbient } from './ambient-engine';
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
