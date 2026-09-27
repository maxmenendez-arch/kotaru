import { SilentSpeaker, SimulatedMicrophone } from './audio-sim';
import type { AppAudio } from './audio-types';

/**
 * Audio de la app, detras de interfaces (`audio-types.ts`).
 *
 * En iOS y Android Metro elige `audio.native.ts`: captura PCM en streaming y reproduccion
 * en cola con react-native-audio-api. Este archivo es la version web: microfono simulado
 * que envia silencio y altavoz mudo, que ejercitan todo el camino de red sin audio real
 * (react-native-audio-api no graba ni tiene cola de reproduccion en la web).
 */
export * from './audio-types';

export function createAudio(): AppAudio {
  return { input: new SimulatedMicrophone(), output: new SilentSpeaker(), simulated: true };
}
