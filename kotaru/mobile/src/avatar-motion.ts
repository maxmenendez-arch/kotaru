/**
 * Logica pura del avatar 3D: que expresion poner segun la emocion, cuando parpadear, como
 * se mueve la cabeza en cada gesto y como abre la boca con el volumen de la voz. No depende
 * de three.js, para poder probarla sin navegador (test/avatar-motion.test.ts).
 *
 * Las expresiones son las predefinidas de VRM 1.0 que traen los modelos de VRoid: happy,
 * angry, sad, relaxed, surprised; bocas aa, ih, ou, ee, oh; blink. Nunca se usa "angry":
 * ningun personaje de Kotaru se enfada con la persona.
 */

export type FaceExpression = 'happy' | 'sad' | 'relaxed' | 'surprised';
export const FACE_EXPRESSIONS: readonly FaceExpression[] = ['happy', 'sad', 'relaxed', 'surprised'];
export type FaceWeights = Readonly<Record<FaceExpression, number>>;

const ZERO: FaceWeights = { happy: 0, sad: 0, relaxed: 0, surprised: 0 };

/**
 * Cara de cada emocion del servidor (EMOTIONS de @kotaru/ai-contracts) a intensidad 1.
 * Valores contenidos a proposito: una cara exagerada se lee como burla o como mascara.
 */
const FACES: Readonly<Record<string, Partial<Record<FaceExpression, number>>>> = {
  neutral: {},
  warm: { happy: 0.35, relaxed: 0.35 },
  happy: { happy: 0.75 },
  playful: { happy: 0.55, surprised: 0.1 },
  curious: { surprised: 0.3, happy: 0.1 },
  thoughtful: { relaxed: 0.3 },
  concerned: { sad: 0.45 },
  surprised: { surprised: 0.7 },
};

/** Gesto de reposo de cada personaje: Luna serena, Nova y Rio con media sonrisa. */
export const RESTING_FACE: Readonly<Record<string, Partial<Record<FaceExpression, number>>>> = {
  luna: { relaxed: 0.12, happy: 0.08 },
  // Mirada entornada y media sonrisa (2-oct): mas sensual sin cerrar los ojos.
  nova: { relaxed: 0.2, happy: 0.12 },
  rio: { happy: 0.18 },
};

/** Cuanto dura una emocion despues de llegar antes de volver al reposo. */
export const AFFECT_HOLD_MS = 7000;
const AFFECT_FADE_MS = 2500;

export interface AffectState {
  readonly emotion: string;
  readonly intensity: number;
  readonly gesture?: string;
  /** performance.now() / Date.now() de cuando llego. */
  readonly at: number;
}

/** Pesos de cara buscados ahora mismo: la emocion (desvaneciendose) sobre el reposo. */
export function targetFace(companion: string, affect: AffectState | null, now: number): FaceWeights {
  const rest = { ...ZERO, ...RESTING_FACE[companion] };
  if (!affect) return rest;
  const age = now - affect.at;
  const fade = age <= AFFECT_HOLD_MS ? 1 : Math.max(0, 1 - (age - AFFECT_HOLD_MS) / AFFECT_FADE_MS);
  if (fade === 0) return rest;
  const face = FACES[affect.emotion] ?? {};
  const k = Math.min(1, Math.max(0, affect.intensity)) * fade;
  const out = { ...ZERO };
  for (const name of FACE_EXPRESSIONS) {
    const mixed = (face[name] ?? 0) * k + rest[name] * (1 - k);
    out[name] = Math.min(1, mixed);
  }
  return out;
}

/** Acerca `current` a `target` sin saltos (suavizado exponencial, independiente de los fps). */
export function approach(current: number, target: number, dtSeconds: number, ratePerSecond: number): number {
  const k = 1 - Math.exp(-ratePerSecond * dtSeconds);
  return current + (target - current) * k;
}

/**
 * Parpadeo natural: cada 2,5 a 6 s, a veces doble. Devuelve el peso de "blink" (0 abierto,
 * 1 cerrado) en el instante `t` (segundos) y cuando toca el siguiente.
 */
export class Blinker {
  #next: number;
  #start = -1;
  #double = false;
  readonly #random: () => number;

  constructor(random: () => number = Math.random, now = 0) {
    this.#random = random;
    this.#next = now + 1 + random() * 2;
  }

  #lastEnd = -10;

  /**
   * Parpadear ahora (si no lo hizo hace nada): las personas parpadean al mover la mirada de un
   * sitio a otro. Lo llama el visor al cambiar de punto de mirada.
   */
  nudge(t: number): void {
    if (this.#start < 0 && t - this.#lastEnd > 1.2) this.#next = t;
  }

  weight(t: number): number {
    if (this.#start < 0 && t >= this.#next) {
      this.#start = t;
      this.#double = this.#random() < 0.2;
    }
    if (this.#start < 0) return 0;
    const length = this.#double ? 0.46 : 0.22;
    const x = (t - this.#start) / length;
    if (x >= 1) {
      this.#start = -1;
      this.#lastEnd = t;
      this.#next = t + 2.5 + this.#random() * 3.5;
      return 0;
    }
    // Cierre rapido y apertura mas lenta (como un parpado de verdad), una o dos veces.
    const closes = this.#double ? 2 : 1;
    const y = (x * closes) % 1;
    return y < 0.3 ? Math.sin((y / 0.3) * (Math.PI / 2)) : 1 - Math.pow((y - 0.3) / 0.7, 0.7);
  }
}

export interface HeadOffset {
  /** Rotaciones en radianes: x asiente, y gira, z inclina. */
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

const GESTURE_LENGTH: Readonly<Record<string, number>> = { nod: 0.9, tilt_head: 1.8, laugh_soft: 1.2, lean_in: 1.6, shrug: 1.2 };

/** Movimiento de cabeza del gesto que llego hace `ageSeconds`; nada si ya acabo. */
export function gestureOffset(gesture: string | undefined, ageSeconds: number): HeadOffset {
  const length = gesture ? GESTURE_LENGTH[gesture] : undefined;
  if (!gesture || length === undefined || ageSeconds < 0 || ageSeconds > length) return { x: 0, y: 0, z: 0 };
  const x = ageSeconds / length;
  const envelope = Math.sin(x * Math.PI);
  switch (gesture) {
    case 'nod':
      return { x: Math.sin(x * Math.PI * 2) * 0.12 * envelope, y: 0, z: 0 };
    case 'tilt_head':
      return { x: 0, y: 0, z: 0.14 * envelope };
    case 'laugh_soft':
      return { x: -0.05 * envelope + Math.sin(x * Math.PI * 6) * 0.02 * envelope, y: 0, z: 0 };
    case 'lean_in':
      return { x: 0.08 * envelope, y: 0, z: 0 };
    case 'shrug':
      return { x: 0, y: 0, z: -0.06 * envelope };
    default:
      return { x: 0, y: 0, z: 0 };
  }
}

/** Postura de cabeza segun el estado de la conversacion: escucha atento, piensa mirando arriba. */
export function stateOffset(state: string): HeadOffset {
  switch (state) {
    case 'listening':
    case 'endpoint':
      return { x: 0.03, y: 0, z: 0.07 };
    case 'thinking':
      return { x: -0.06, y: 0.08, z: 0 };
    default:
      return { x: 0, y: 0, z: 0 };
  }
}

/**
 * Boca al hablar a partir del volumen (0-1) de lo que suena. Varia la forma de la vocal
 * con el tiempo para que no parezca una trampilla que abre y cierra.
 */
/** Pesos de las vocales de la boca (expresiones del VRM). */
export interface Visemes {
  readonly aa: number;
  readonly ih: number;
  readonly ou: number;
  readonly ee: number;
  readonly oh: number;
}

/**
 * Labios desde el sonido (2-oct): que vocal se esta diciendo, aproximada por donde cae la
 * energia de la voz (los formantes). Mucha energia en 700-1200 Hz es boca abierta («a»); en
 * 250-700 Hz sin agudos, labios redondos («o», «u»); en 2200-3800 Hz, labios estirados («e»,
 * «i»). Las sibilantes (s, ch) cierran algo la boca (se ven los dientes, no la garganta).
 * `db`: espectro del analizador (dB por banda), `binHz`: ancho de cada banda, `level`: 0-1.
 */
export function visemesFromSpectrum(db: ArrayLike<number>, binHz: number, level: number): Visemes {
  const band = (lo: number, hi: number) => {
    let sum = 0;
    for (let i = Math.max(1, Math.floor(lo / binHz)); i <= Math.min(db.length - 1, Math.ceil(hi / binHz)); i++) sum += Math.pow(10, (db[i] ?? -140) / 10);
    return sum;
  };
  const b1 = band(250, 700);
  const b2 = band(700, 1200);
  const b3 = band(1200, 2200);
  const b4 = band(2200, 3800);
  const sib = band(4500, 8000);
  const total = b1 + b2 + b3 + b4 + 1e-12;
  const r1 = b1 / total;
  const r2 = b2 / total;
  const r3 = b3 / total;
  const r4 = b4 / total;
  const hiss = sib / (total + sib);
  const open = Math.min(1, Math.max(0, level)) * (1 - 0.55 * hiss);
  const raw = {
    aa: Math.max(0, r2 * 1.3 + r1 * 0.35),
    oh: Math.max(0, r1 * 0.9 + r2 * 0.3 - r4 * 0.6),
    ou: Math.max(0, r1 * 1.1 - r3 * 0.7 - r4 * 0.7),
    ee: Math.max(0, r4 * 1.4 + r3 * 0.3 - r2 * 0.4),
    ih: Math.max(0, r3 * 1.0 + r4 * 0.5 - r1 * 0.2),
  };
  const sum = raw.aa + raw.oh + raw.ou + raw.ee + raw.ih;
  // Un fondo de «a» siempre: hablando, la mandibula se abre aunque la vocal no este clara.
  const k = (name: keyof typeof raw) => (sum > 1e-6 ? raw[name] / sum : 0) * 0.75 + (name === 'aa' ? 0.25 : 0);
  return { aa: open * k('aa'), ih: open * k('ih') * 0.8, ou: open * k('ou') * 0.9, ee: open * k('ee') * 0.8, oh: open * k('oh') * 0.9 };
}

export function mouthShapes(open: number, t: number): { aa: number; oh: number; ih: number } {
  const o = Math.min(1, Math.max(0, open));
  const wobble = (Math.sin(t * 11) + 1) / 2;
  return { aa: o * (0.55 + 0.35 * wobble), oh: o * 0.35 * (1 - wobble), ih: o * 0.2 * wobble };
}
