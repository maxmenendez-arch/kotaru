import type { Ambient } from './ambient-types';

export * from './ambient-types';

/**
 * iOS y Android: todavia sin sonidos (la version web esta en `ambient.web.ts`). Llegaran
 * con react-native-audio-api, que ofrece los mismos nodos que Web Audio.
 */
export function createAmbient(): Ambient {
  return { available: false, playing: null, volume: 0, play() {}, stop() {}, setVolume() {}, duck() {}, dispose() {} };
}
