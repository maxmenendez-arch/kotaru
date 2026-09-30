import { AudioContext as NativeAudioContext } from 'react-native-audio-api';
import { silentSoundscape, type Ambient, type Soundscape } from './ambient-types';
import { EngineAmbient, EngineSound, type Builder } from './ambient-engine';
import { activateAudioSession } from './audio-session';

export * from './ambient-types';

/**
 * Sonidos relajantes en iOS y Android con react-native-audio-api, que tiene los mismos
 * nodos que Web Audio: el motor es el mismo que en la web (`ambient-engine.ts`). La sesion
 * de audio es la misma que usa la voz (ver audio-session.ts), asi suenan juntos y el
 * ambiente baja cuando habla el personaje.
 */
export function createAmbient(): Ambient {
  try {
    return new EngineAmbient(
      // Los tipos de la libreria no son los del DOM, pero la forma y el comportamiento si.
      () => new NativeAudioContext() as unknown as AudioContext,
      () => void activateAudioSession(),
    );
  } catch {
    return { available: false, playing: null, volume: 0, play() {}, stop() {}, setVolume() {}, duck() {}, dispose() {} };
  }
}

/** Ambiente de un lugar o musica de un short (scene-sounds.ts). */
export function createSoundscape<K extends string>(builders: Readonly<Record<K, Builder>>, volume: number): Soundscape<K> {
  try {
    return new EngineSound<K>(builders, () => new NativeAudioContext() as unknown as AudioContext, () => void activateAudioSession(), {}, volume);
  } catch {
    return silentSoundscape<K>();
  }
}
