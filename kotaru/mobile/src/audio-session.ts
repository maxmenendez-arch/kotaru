import { AudioManager } from 'react-native-audio-api';

/**
 * Sesion de audio de iOS/Android, compartida por la voz (audio.native.ts) y los sonidos
 * relajantes (ambient.ts): una sola configuracion para que no se pisen.
 *
 * `playAndRecord` + `voiceChat`: iOS aplica cancelacion de eco, asi el micro no recoge la
 * voz del personaje (ni la lluvia) cuando el usuario la interrumpe.
 */
let configured = false;
export function configureAudioSession(): void {
  if (configured) return;
  configured = true;
  AudioManager.setAudioSessionOptions({
    iosCategory: 'playAndRecord',
    iosMode: 'voiceChat',
    iosOptions: ['defaultToSpeaker', 'allowBluetoothHFP'],
  });
}

/** Configura (una vez) y activa la sesion. */
export async function activateAudioSession(): Promise<void> {
  configureAudioSession();
  await AudioManager.setAudioSessionActivity(true);
}
