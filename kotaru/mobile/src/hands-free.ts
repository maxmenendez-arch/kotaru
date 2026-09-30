/**
 * Manos libres: detecta cuando la persona empieza y termina de hablar, para no tener que
 * mantener pulsado el boton. Pedido del dueño (2026-09-30): hablarle mientras se hacen otras
 * cosas en el movil o el ordenador (ventana flotante), y tambien como opcion en pantalla normal.
 *
 * Todo ocurre en el dispositivo y no se guarda nada: el micro esta abierto, pero al servidor
 * solo se envia la voz entre "empieza a hablar" y "termina" (mas un trocito de antes, para no
 * cortar la primera silaba). El silencio y el ruido de fondo no salen del dispositivo, asi que
 * el costo es el mismo que pulsando el boton.
 *
 * Deteccion por energia con suelo de ruido adaptativo (sin modelos ni dependencias):
 * - empieza cuando el nivel supera `factor` veces el ruido de fondo durante `startMs`;
 * - termina tras `endMs` por debajo, o al llegar a `maxTurnMs`;
 * - mientras el personaje habla o piensa (`busy`), hace falta hablar mas fuerte y mas rato
 *   (`bargeFactor`, `bargeMs`): asi su propia voz, que el cancelador de eco no quite del todo,
 *   no dispara un turno, pero la persona si puede interrumpirle.
 * - Se apaga solo tras `idleOffMs` sin que nadie hable (privacidad y costo).
 */

export interface VadOptions {
  readonly startMs: number;
  readonly endMs: number;
  readonly maxTurnMs: number;
  /** Nivel minimo absoluto (RMS 0-1) para contar como voz, aunque el ruido de fondo sea bajisimo. */
  readonly minLevel: number;
  readonly factor: number;
  readonly bargeFactor: number;
  readonly bargeMs: number;
  readonly idleOffMs: number;
}

export const VAD_DEFAULTS: VadOptions = {
  startMs: 160,
  endMs: 900,
  maxTurnMs: 30_000,
  minLevel: 0.012,
  factor: 3,
  bargeFactor: 2.2,
  bargeMs: 320,
  idleOffMs: 5 * 60_000,
};

export type VadEvent = 'start' | 'end' | 'idle-off' | null;

export class HandsFreeVad {
  readonly #o: VadOptions;
  #floor = 0.004;
  #speaking = false;
  #above = 0;
  #below = 0;
  #turnStart = 0;
  #lastVoice: number;

  constructor(now: number, options: Partial<VadOptions> = {}) {
    this.#o = { ...VAD_DEFAULTS, ...options };
    this.#lastVoice = now;
  }

  get inTurn(): boolean {
    return this.#speaking;
  }

  /** Umbral actual (para pruebas y para el indicador). */
  threshold(busy: boolean): number {
    const base = Math.max(this.#o.minLevel, this.#floor * this.#o.factor);
    return busy ? base * this.#o.bargeFactor : base;
  }

  /**
   * Un trozo de audio: su nivel (RMS 0-1), su duracion y el instante. `busy` = el personaje
   * esta hablando o pensando. Devuelve lo que hay que hacer.
   */
  push(level: number, frameMs: number, now: number, busy: boolean): VadEvent {
    const threshold = this.threshold(busy && !this.#speaking);
    const loud = level >= threshold;
    if (!this.#speaking) {
      // El ruido de fondo se aprende solo con lo que no es voz (sube despacio, baja rapido).
      if (!loud) this.#floor += (level - this.#floor) * (level < this.#floor ? 0.1 : 0.02);
      this.#above = loud ? this.#above + frameMs : 0;
      if (this.#above >= (busy ? this.#o.bargeMs : this.#o.startMs)) {
        this.#speaking = true;
        this.#above = 0;
        this.#below = 0;
        this.#turnStart = now;
        this.#lastVoice = now;
        return 'start';
      }
      if (now - this.#lastVoice >= this.#o.idleOffMs) {
        this.#lastVoice = now;
        return 'idle-off';
      }
      return null;
    }
    if (loud) {
      this.#below = 0;
      this.#lastVoice = now;
    } else {
      this.#below += frameMs;
    }
    if (this.#below >= this.#o.endMs || now - this.#turnStart >= this.#o.maxTurnMs) {
      this.#speaking = false;
      this.#below = 0;
      this.#above = 0;
      return 'end';
    }
    return null;
  }

  /** Corta el turno en curso sin evento (al apagar manos libres). */
  reset(now: number): void {
    this.#speaking = false;
    this.#above = 0;
    this.#below = 0;
    this.#lastVoice = now;
  }
}

/** Nivel (RMS 0-1) de un trozo PCM de 16 bits little-endian. */
export function pcmLevel(pcm: Uint8Array): number {
  const n = Math.floor(pcm.length / 2);
  if (!n) return 0;
  const view = new DataView(pcm.buffer, pcm.byteOffset, n * 2);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const v = view.getInt16(i * 2, true) / 32768;
    sum += v * v;
  }
  return Math.sqrt(sum / n);
}

/** Duracion en ms de un trozo PCM de 16 bits mono. */
export function pcmMs(pcm: Uint8Array, sampleRate: number): number {
  return (pcm.length / 2 / sampleRate) * 1000;
}

/** Guarda los ultimos `ms` de audio para enviarlos al empezar (no se corta la primera silaba). */
export class PreRoll {
  readonly #max: number;
  #chunks: { pcm: Uint8Array; ms: number }[] = [];
  #total = 0;

  constructor(ms: number) {
    this.#max = ms;
  }

  push(pcm: Uint8Array, ms: number): void {
    this.#chunks.push({ pcm, ms });
    this.#total += ms;
    while (this.#chunks.length > 1 && this.#total - this.#chunks[0]!.ms >= this.#max) {
      this.#total -= this.#chunks.shift()!.ms;
    }
  }

  drain(): Uint8Array[] {
    const out = this.#chunks.map((c) => c.pcm);
    this.#chunks = [];
    this.#total = 0;
    return out;
  }
}
