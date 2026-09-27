/** Frecuencia que espera el gateway del audio del microfono (PCM 16 bits mono). */
export const INPUT_SAMPLE_RATE = 24000;

export interface AudioInput {
  /**
   * Pide permiso si hace falta y empieza a entregar trozos de PCM 16 bits mono a
   * `INPUT_SAMPLE_RATE`. Resuelve `false` si no hay permiso o no se pudo abrir el micro.
   */
  start(onChunk: (pcm: Uint8Array) => void): Promise<boolean>;
  stop(): void;
}

export interface AudioOutput {
  play(pcm: Uint8Array, sampleRate: number): void;
  /** Barge-in: corta en seco lo que este sonando. */
  stopNow(): void;
  /** Se llama dentro de un gesto del usuario: los navegadores solo dejan sonar audio despues de uno. */
  unlock?(): void;
  dispose(): void;
}

export interface AppAudio {
  readonly input: AudioInput;
  readonly output: AudioOutput;
  /** true si el audio es simulado (se avisa en pantalla). */
  readonly simulated: boolean;
}
