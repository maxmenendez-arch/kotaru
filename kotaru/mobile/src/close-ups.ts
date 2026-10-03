/**
 * Modo cinematico: un camarografo que, cuando el personaje reacciona (rie, se sonroja, lanza
 * un beso), hace zoom a un primer plano y vuelve al plano de siempre. Los encuadres siguen las
 * referencias del dueño (1-oct): plano medio de cabeza a pecho, la cara entera, un detalle de
 * ojo y boca descentrado, y cara y torso descentrados a un lado. Mientras dura, el camarografo
 * se desliza un poco de lado; al hacer zoom el foco se pierde un instante y vuelve.
 *
 * Nunca repite el encuadre de los dos ultimos planos. Puro (sin three.js): se prueba.
 */

export interface Framing {
  readonly name: string;
  /** Alto visible a la distancia del personaje (m): cuanto mas chico, mas zoom. */
  readonly span: number;
  /** Punto mirado respecto a la cabeza: lado (m, + a la izquierda de la pantalla) y altura. */
  readonly dx: number;
  readonly dy: number;
  /** El camarografo se desliza de lado (m) durante el plano: de `slide[0]` a `slide[1]`. */
  readonly slide: readonly [number, number];
}

/** Encuadres de las referencias, con su variante hacia el otro lado cuando es descentrado. */
export const FRAMINGS: readonly Framing[] = [
  { name: 'medio', span: 0.78, dx: 0, dy: -0.2, slide: [-0.05, 0.05] },
  { name: 'cara', span: 0.36, dx: 0, dy: 0.0, slide: [0.04, -0.04] },
  { name: 'detalle-izq', span: 0.2, dx: 0.035, dy: 0.0, slide: [0.08, 0.12] },
  { name: 'detalle-der', span: 0.2, dx: -0.035, dy: 0.0, slide: [-0.08, -0.12] },
  { name: 'lado-izq', span: 0.62, dx: 0.11, dy: -0.17, slide: [0.12, 0.2] },
  { name: 'lado-der', span: 0.62, dx: -0.11, dy: -0.17, slide: [-0.12, -0.2] },
];

/** Segundos del zoom de entrada y de vuelta. */
export const PUSH_IN = 1.2;
export const PULL_OUT = 1.4;

export interface CloseUpFrame {
  /** Cuanto manda el primer plano sobre el plano normal (0-1, curva suave). */
  readonly weight: number;
  readonly framing: Framing;
  /** Deslizamiento lateral del camarografo en este instante (m). */
  readonly slide: number;
  /** Desenfoque del personaje para el cambio de foco (0 nitido - 1 blando). */
  readonly soft: number;
}

const smooth = (x: number): number => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};
/** Campana 0-1-0 en [0, 1]. */
const bell = (x: number): number => (x <= 0 || x >= 1 ? 0 : Math.sin(x * Math.PI));

export class CloseUpDirector {
  #framing: Framing | null = null;
  #start = 0;
  #hold = 0;
  readonly #recent: string[] = [];

  /** Primer plano que dura lo que la reaccion (`length` s). `roll` 0-1 elige el encuadre. */
  start(t: number, length: number, roll: number, want?: 'wide' | 'close'): Framing {
    const avoid = new Set(this.#recent.slice(-2));
    // El detalle y el lateral a un lado no se siguen del mismo a otro lado (se veria igual).
    const last = this.#recent[this.#recent.length - 1]?.split('-')[0];
    let options = FRAMINGS.filter((f) => !avoid.has(f.name) && f.name.split('-')[0] !== last);
    if (!options.length) options = FRAMINGS.filter((f) => !avoid.has(f.name));
    // El plano segun la reaccion: una risa o un gesto de cuerpo piden aire (plano medio o
    // lateral); la ternura o un beso, cerca (cara o detalle). Si no queda ninguno sin repetir,
    // cualquiera de los permitidos.
    if (want) {
      const fit = options.filter((f) => (want === 'wide' ? f.span >= 0.6 : f.span <= 0.4));
      if (fit.length) options = fit;
    }
    const pick = options[Math.min(options.length - 1, Math.floor(roll * options.length))]!;
    this.#recent.push(pick.name);
    if (this.#recent.length > 4) this.#recent.shift();
    this.#framing = pick;
    this.#start = t;
    this.#hold = Math.max(1.5, Math.min(6, length - PUSH_IN - 0.3));
    return pick;
  }

  get active(): boolean {
    return this.#framing !== null;
  }

  /** Volver ya al plano normal (sin salto). */
  release(t: number): void {
    if (!this.#framing) return;
    const age = t - this.#start;
    if (age < PUSH_IN + this.#hold) this.#hold = Math.max(0, age - PUSH_IN);
  }

  /** Cortar del todo (se apago el modo cinematico, empieza un short). */
  stop(): void {
    this.#framing = null;
  }

  frame(t: number): CloseUpFrame | null {
    const f = this.#framing;
    if (!f) return null;
    const age = t - this.#start;
    const out = age - PUSH_IN - this.#hold;
    if (out >= PULL_OUT) {
      this.#framing = null;
      return null;
    }
    const weight = out > 0 ? 1 - smooth(out / PULL_OUT) : smooth(age / PUSH_IN);
    const k = smooth(age / (PUSH_IN + this.#hold + PULL_OUT));
    const slide = f.slide[0] + (f.slide[1] - f.slide[0]) * k;
    // El foco se pierde a mitad del zoom de entrada y vuelve al llegar (al salir, menos).
    const soft = out > 0 ? 0.5 * bell(out / PULL_OUT) : bell(age / PUSH_IN);
    return { weight, framing: f, slide, soft };
  }
}

/**
 * Angulo vertical (grados) para ver `span` metros a `distance` metros: el zoom.
 */
export function zoomFov(span: number, distance: number): number {
  return (2 * Math.atan(span / 2 / Math.max(0.05, distance)) * 180) / Math.PI;
}
