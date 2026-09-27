import { INPUT_SAMPLE_RATE, type AudioInput, type AudioOutput } from './audio-types';

/** Envia silencio en trozos de 20 ms mientras se mantiene pulsado. */
export class SimulatedMicrophone implements AudioInput {
  #timer: ReturnType<typeof setInterval> | null = null;

  async start(onChunk: (pcm: Uint8Array) => void): Promise<boolean> {
    this.stop();
    const bytes = (INPUT_SAMPLE_RATE * 2 * 20) / 1000;
    this.#timer = setInterval(() => onChunk(new Uint8Array(bytes)), 20);
    return true;
  }

  stop(): void {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
  }
}

/** No reproduce: cuenta cuanto audio habria sonado. */
export class SilentSpeaker implements AudioOutput {
  playedSeconds = 0;
  play(pcm: Uint8Array, sampleRate: number): void {
    this.playedSeconds += pcm.byteLength / (sampleRate * 2);
  }
  stopNow(): void {}
  dispose(): void {}
}
