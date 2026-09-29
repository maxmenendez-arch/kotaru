/**
 * Forma de moverse de cada personaje (pedido del dueño, 2026-09-28): todos respiran y
 * cambian el peso, pero cada uno con su caracter, sobre todo al hablar.
 *
 * - Nova: suave y sensual. Ritmo lento, cadera que ondula en ocho, hombro que rueda,
 *   cabeza que se inclina y una mano apoyada en la cadera. Elegante, nunca explicito.
 * - Luna: confiada y tranquila. Postura erguida y quieta, manos juntas delante,
 *   respiracion profunda y lenta; al hablar, asiente despacio y abre un poco las manos.
 * - Rio: emocion y aire libre. Ritmo vivo, rebote en las piernas, gestos amplios con los
 *   dos brazos al hablar y miradas alrededor, como quien disfruta del paisaje.
 *
 * Todo en radianes y metros, sobre la postura relajada (relaxPose). Valores pequeños a
 * proposito: se nota el caracter sin que el cuerpo atraviese la ropa.
 */
export interface BodyStyle {
  /** Multiplica la velocidad de todos los ciclos (1 = normal). */
  readonly tempo: number;
  /** Respiracion: amplitud del pecho. */
  readonly breath: number;
  /** Cambio de peso: inclinacion lateral de la cadera y periodo en segundos. */
  readonly sway: number;
  readonly swayPeriod: number;
  /** Giro de cadera (y), para la ondulacion en ocho (Nova). */
  readonly hipRoll: number;
  /** Rebote vertical de la cadera en metros al hablar (Rio). */
  readonly bounce: number;
  /** Balanceo de brazos en reposo. */
  readonly armSwing: number;
  /** Gestos de brazos y manos al hablar (0 = casi nada, 1 = amplios). */
  readonly gesture: number;
  /** Cuanto levanta el antebrazo al explicar (alterna izquierda y derecha). */
  readonly lift: number;
  /** Ritmo de los gestos al hablar (Hz). */
  readonly gestureRate: number;
  /** Inclinacion lateral de cabeza, asentimientos al hablar y rodar de hombro. */
  readonly headTilt: number;
  readonly nod: number;
  readonly shoulderRoll: number;
  /** Miradas alrededor (amplitud del giro de cabeza en reposo). */
  readonly lookAround: number;
  /** La mano derecha descansa en la cadera (no gesticula con ella). */
  readonly handOnHip?: boolean;
  /** Postura de brazos (desplazamientos sobre la relajada). */
  readonly pose: {
    readonly left: { readonly upper: readonly [number, number, number]; readonly lower: readonly [number, number, number]; readonly hand: readonly [number, number, number] };
    readonly right: { readonly upper: readonly [number, number, number]; readonly lower: readonly [number, number, number]; readonly hand: readonly [number, number, number] };
  };
}

const ZERO = [0, 0, 0] as const;
const NEUTRAL_POSE = { left: { upper: ZERO, lower: ZERO, hand: ZERO }, right: { upper: ZERO, lower: ZERO, hand: ZERO } };

export const DEFAULT_STYLE: BodyStyle = {
  tempo: 1,
  breath: 1,
  sway: 0.02,
  swayPeriod: 9,
  hipRoll: 0.025,
  bounce: 0,
  armSwing: 0.015,
  gesture: 0.6,
  lift: 0.3,
  gestureRate: 3.1,
  headTilt: 0.02,
  nod: 0.01,
  shoulderRoll: 0,
  lookAround: 0,
  pose: NEUTRAL_POSE,
};

export const BODY_STYLES: Readonly<Record<string, BodyStyle>> = {
  nova: {
    tempo: 0.8,
    breath: 1.1,
    sway: 0.05,
    swayPeriod: 6.5,
    hipRoll: 0.06,
    bounce: 0,
    armSwing: 0.02,
    gesture: 0.45,
    lift: 0.35,
    gestureRate: 1.6,
    headTilt: 0.07,
    nod: 0.015,
    shoulderRoll: 0.05,
    lookAround: 0,
    // Mano derecha en la cadera, codo hacia fuera (buscado numericamente sobre el modelo:
    // la mano queda a ~1 cm de la cadera, el codo fuera del cuerpo).
    handOnHip: true,
    pose: {
      left: { upper: ZERO, lower: ZERO, hand: ZERO },
      right: { upper: [0, 0, -0.4], lower: [0, 0.2, 1.2], hand: [0, 0, -0.15] },
    },
  },
  luna: {
    tempo: 0.7,
    breath: 1.35,
    sway: 0.01,
    swayPeriod: 12,
    hipRoll: 0.01,
    bounce: 0,
    armSwing: 0.006,
    gesture: 0.3,
    lift: 0.12,
    gestureRate: 1.2,
    headTilt: 0.035,
    nod: 0.045,
    shoulderRoll: 0,
    lookAround: 0,
    // Manos juntas delante, a la altura de la cadera (buscado numericamente: manos a ~7 cm
    // una de otra y 15 cm por delante; codos fuera del torso).
    pose: {
      left: { upper: [-0.4, 0, -0.1], lower: [0, 0, -0.9], hand: [0, 0, 0.1] },
      right: { upper: [-0.4, 0, 0.1], lower: [0, 0, 0.9], hand: [0, 0, -0.1] },
    },
  },
  rio: {
    tempo: 1.35,
    breath: 1.1,
    sway: 0.03,
    swayPeriod: 5,
    hipRoll: 0.03,
    bounce: 0.012,
    armSwing: 0.03,
    gesture: 1,
    lift: 1.1,
    gestureRate: 2.4,
    headTilt: 0.025,
    nod: 0.03,
    shoulderRoll: 0.03,
    lookAround: 0.18,
    // Brazos algo mas pegados al cuerpo: asi los gestos se leen como impulso, no como pose.
    pose: {
      left: { upper: [0, 0, -0.12], lower: ZERO, hand: ZERO },
      right: { upper: [0, 0, 0.12], lower: ZERO, hand: ZERO },
    },
  },
};

export function styleFor(companion: string): BodyStyle {
  return BODY_STYLES[companion] ?? DEFAULT_STYLE;
}
