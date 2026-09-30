/** Frecuencia que espera el gateway del audio del microfono (PCM 16 bits mono). */
export const INPUT_SAMPLE_RATE = 24000;

export interface AudioInput {
  /**
   * Pide permiso si hace falta y empieza a entregar trozos de PCM 16 bits mono a
   * `INPUT_SAMPLE_RATE`. Resuelve `false` si no hay permiso o no se pudo abrir el micro.
   */
  start(onChunk: (pcm: Uint8Array) => void): Promise<boolean>;
  /** Deja de entregar audio (el micro puede quedar abierto y en silencio: ver `release`). */
  stop(): void;
  /** Cierra el micro de verdad (salir de la conversacion). */
  release?(): void;
  /**
   * Abre el micro en silencio (sin procesar ni enviar nada) si aun no lo esta: al conectar,
   * para que el telefono entre en modo llamada y el volumen sea el bueno desde el principio.
   */
  warm?(): Promise<boolean>;
  /** Volumen de lo que entra ahora (0 a 1), solo para efectos visuales; no se guarda. */
  level?(): number;
}

export interface AudioOutput {
  play(pcm: Uint8Array, sampleRate: number): void;
  /** Barge-in: corta en seco lo que este sonando. */
  stopNow(): void;
  /** Se llama dentro de un gesto del usuario: los navegadores solo dejan sonar audio despues de uno. */
  unlock?(): void;
  /**
   * Volumen de lo que suena AHORA (0 a 1), para mover la boca del avatar. Solo se mide el
   * nivel en el momento: no se guarda ni se analiza el contenido del audio.
   */
  level?(): number;
  /**
   * De donde viene la voz: -1 (izquierda) a 1 (derecha) y lejania 0-1 (el personaje se fue al
   * otro lado del cuarto a por agua: errand.ts). Opcional; por defecto, delante y cerca.
   */
  place?(pan: number, far: number): void;
  /** true mientras quede voz en cola por sonar (aunque el turno ya haya terminado). */
  isPlaying?(): boolean;
  dispose(): void;
}

export interface AppAudio {
  readonly input: AudioInput;
  readonly output: AudioOutput;
  /** true si el audio es simulado (se avisa en pantalla). */
  readonly simulated: boolean;
}
