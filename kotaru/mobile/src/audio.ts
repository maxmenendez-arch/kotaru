/**
 * Audio de la app, detras de interfaces.
 *
 * DECISION PENDIENTE: capturar PCM del microfono en streaming y reproducir PCM crudo no
 * lo hace ningun modulo del SDK base de Expo (expo-audio graba a archivo). Hace falta un
 * modulo nativo con config plugin. Mientras se elige y se prueba en dispositivo, la app
 * usa estas implementaciones simuladas, que ejercitan todo el camino de red.
 */
export interface AudioInput {
  /** Empieza a entregar trozos de PCM 16 bits mono a `sampleRate`. */
  start(onChunk: (pcm: Uint8Array) => void): void;
  stop(): void;
  readonly sampleRate: 24000;
}

export interface AudioOutput {
  play(pcm: Uint8Array, sampleRate: number): void;
  /** Barge-in: corta en seco lo que este sonando. */
  stopNow(): void;
}

/** Envia silencio en trozos de 20 ms mientras se mantiene pulsado. */
export class SimulatedMicrophone implements AudioInput {
  readonly sampleRate = 24000 as const;
  #timer: ReturnType<typeof setInterval> | null = null;

  start(onChunk: (pcm: Uint8Array) => void): void {
    this.stop();
    const bytes = (this.sampleRate * 2 * 20) / 1000;
    this.#timer = setInterval(() => onChunk(new Uint8Array(bytes)), 20);
  }

  stop(): void {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
  }
}

/** No reproduce: cuenta cuanto audio habria sonado (se muestra como subtitulo). */
export class SilentSpeaker implements AudioOutput {
  playedSeconds = 0;
  play(pcm: Uint8Array, sampleRate: number): void {
    this.playedSeconds += pcm.byteLength / (sampleRate * 2);
  }
  stopNow(): void {}
}
