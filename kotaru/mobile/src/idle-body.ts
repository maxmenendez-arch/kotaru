import type { Object3D } from 'three';
import type { VRMHumanBoneName } from '@pixiv/three-vrm';
import { DEFAULT_STYLE, type BodyStyle } from './body-styles.ts';

/**
 * Movimiento del cuerpo en reposo (A del plan de realismo): que el personaje no parezca
 * una estatua con cabeza movil. Todo es muy leve y lento, sin animaciones de terceros:
 *
 * - Respiracion: pecho y hombros, unas 15 veces por minuto.
 * - Cambio de peso: la cadera se inclina y se desplaza despacio (ciclo de ~9 s) y la
 *   columna compensa, como alguien de pie que se acomoda.
 * - Brazos y manos: balanceo minimo desfasado entre lados; dedos algo doblados, no rigidos.
 * - Al hablar: los codos se doblan un poco mas y las manos acompañan el ritmo de la voz.
 * - Mirada: pequeños saltos (microsacadas) cada pocos segundos, como hacen los ojos reales.
 *
 * Trabaja sobre la postura de partida (la que dejo relaxPose): suma desplazamientos a la
 * rotacion guardada de cada hueso, asi que no se acumula error cuadro a cuadro.
 */

type BoneLookup = (name: VRMHumanBoneName) => Object3D | null;

interface Base {
  bone: Object3D;
  x: number;
  y: number;
  z: number;
}

export interface BodyInput {
  /** Reducir movimiento (preferencia del sistema): solo respira, muy poco. */
  readonly still: boolean;
  readonly speaking: boolean;
  /** Volumen de la voz suavizado (0 a ~1,3). */
  readonly level: number;
  /** Multiplica el caracter (ondulacion, inclinacion, hombro): 1 normal, >1 coqueteo, <1 amigo. */
  readonly intensity?: number;
  /** La persona esta hablando: escucha activa (se inclina un poco hacia ella y asiente). */
  readonly listening?: boolean;
  /** Gesto que marco el modelo (nod, shrug, laugh_soft, lean_in…) y hace cuanto llego (s). */
  readonly gesture?: { readonly name: string; readonly age: number };
  /** Energia de la emocion actual: >1 alegre o entusiasta (gestos mas amplios), <1 triste o tranquila. */
  readonly energy?: number;
  /** Saludar con la mano (0 a 1). Atajo de `arm: { action: 'wave' }`. */
  readonly wave?: number;
  /** Gesto de brazo y cuanto (0 a 1; sube y baja suave). */
  readonly arm?: { readonly action: ArmAction; readonly weight: number };
}

export type ArmAction = 'wave' | 'point' | 'chin' | 'chest';

/**
 * Poses de los gestos de brazo, en rotaciones absolutas de huesos normalizados (radianes)
 * del brazo derecho; con `side: 'left'` se aplican en espejo al izquierdo. Buscadas con
 * capturas (como el saludo).
 */
export interface ArmPose {
  readonly side: 'right' | 'left';
  readonly upper: readonly [number, number, number];
  readonly lower: readonly [number, number, number];
  readonly hand: readonly [number, number, number];
  /** Movimiento de lado a lado de la mano (saludar). */
  readonly shake: number;
}

export const ARM_POSES: Record<ArmAction, ArmPose> = {
  // Saludar: codo abajo, mano junto a la cabeza, de lado a lado.
  wave: { side: 'right', upper: [0, 0.5, 0.8], lower: [0, 0, -2.1], hand: [0, 0, 0], shake: 0.22 },
  // Señalar el horizonte (Rio), con la izquierda: hacia donde mira.
  point: { side: 'left', upper: [0, 0.5, -0.2], lower: [0, 0.1, 0], hand: [0, 0, 0], shake: 0 },
  // Mano en la barbilla (Nova, con la izquierda: la derecha esta en la cadera).
  chin: { side: 'left', upper: [-0.7, 0.7, 0.65], lower: [0, 2.6, 0.2], hand: [0, 0, -0.6], shake: 0 },
  // Mano al pecho (Luna).
  chest: { side: 'right', upper: [-0.3, 1.0, 1.0], lower: [0, 1.9, -0.35], hand: [0, 0, 0], shake: 0 },
};

/** Gesto de brazo para un gesto del servidor en la conversacion (GESTURES de ai-contracts), si lo hay. */
/**
 * Gesto de brazo ocasional segun la emocion del personaje en la conversacion (sin pedirlo el
 * servidor): Luna se lleva la mano al pecho con ternura, Rio señala al horizonte con curiosidad,
 * Nova apoya la barbilla cuando algo le intriga. Solo con emocion clara (intensidad >= 0.7) y
 * aproximadamente una de cada tres veces, elegida de forma estable por el instante de la emocion
 * (el mismo momento siempre decide lo mismo; no hay azar por fotograma).
 */
export function armForEmotion(companion: string, emotion: string | undefined, intensity: number, at: number): ArmAction | null {
  if (!emotion || intensity < 0.7) return null;
  const pick = EMOTION_ARMS[companion]?.[emotion];
  if (!pick) return null;
  return Math.floor(at / 1000) % 3 === 0 ? pick : null;
}

const EMOTION_ARMS: Record<string, Record<string, ArmAction>> = {
  luna: { warm: 'chest' },
  rio: { curious: 'point' },
  nova: { curious: 'chin' },
};

export function armForGesture(gesture: string | undefined): ArmAction | null {
  switch (gesture) {
    case 'small_wave':
      return 'wave';
    case 'think_pose':
      return 'chin';
    case 'point_up':
      return 'point';
    default:
      return null;
  }
}

/** Cuanto del gesto de brazo a los `age` segundos de pedirlo: sube, se mantiene ~2 s y baja. */
export function armEnvelope(age: number, hold = 2): number {
  if (age < 0) return 0;
  return Math.max(0, Math.min(1, age / 0.35, (hold + 0.45 - age) / 0.45));
}

/** @deprecated Solo para las pruebas de la pose del saludo. */
export const WAVE_POSE = ARM_POSES.wave;


/** Duraciones de los gestos de cuerpo (s): las mismas que los de cabeza. */
const BODY_GESTURE_LENGTH: Readonly<Record<string, number>> = { shrug: 1.2, laugh_soft: 1.2, lean_in: 1.6, nod: 0.9 };

export interface BodyGestureOffset {
  /** Hombros hacia arriba (rad, positivo = sube). */
  readonly shoulders: number;
  /** Pecho hacia delante (rad). */
  readonly chest: number;
  /** Pequeño salto del torso (rad en x de la columna, al reir). */
  readonly bounce: number;
}

/** Lo que el cuerpo acompaña a un gesto: encoger hombros, reir, acercarse. Nada si ya acabo. */
export function bodyGestureOffset(name: string | undefined, age: number): BodyGestureOffset {
  const length = name ? BODY_GESTURE_LENGTH[name] : undefined;
  if (!name || length === undefined || age < 0 || age > length) return { shoulders: 0, chest: 0, bounce: 0 };
  const x = age / length;
  const env = Math.sin(x * Math.PI);
  switch (name) {
    case 'shrug':
      return { shoulders: 0.16 * env, chest: 0, bounce: 0 };
    case 'laugh_soft':
      return { shoulders: 0.03 * env, chest: -0.02 * env, bounce: Math.sin(x * Math.PI * 6) * 0.018 * env };
    case 'lean_in':
      return { shoulders: 0, chest: 0.07 * env, bounce: 0 };
    case 'nod':
      return { shoulders: 0, chest: 0.015 * env, bounce: 0 };
    default:
      return { shoulders: 0, chest: 0, bounce: 0 };
  }
}

/** Energia del cuerpo segun la emocion (1 = neutra). */
export function emotionEnergy(emotion: string | undefined, intensity = 1): number {
  const base: Record<string, number> = { happy: 1.3, playful: 1.2, surprised: 1.2, curious: 1.05, warm: 0.95, thoughtful: 0.8, concerned: 0.75 };
  const e = emotion ? base[emotion] : undefined;
  if (e === undefined) return 1;
  return 1 + (e - 1) * Math.min(1, Math.max(0, intensity));
}

const FINGERS = ['Index', 'Middle', 'Ring', 'Little'] as const;
const SEGMENTS = ['Proximal', 'Intermediate', 'Distal'] as const;
/** Curvatura de reposo por dedo (el meñique, mas doblado) y por falange. */
const CURL: Record<(typeof FINGERS)[number], number> = { Index: 0.14, Middle: 0.22, Ring: 0.28, Little: 0.34 };
const SEGMENT_SCALE: Record<(typeof SEGMENTS)[number], number> = { Proximal: 1, Intermediate: 1.25, Distal: 0.8 };

export class IdleBody {
  readonly #bones = new Map<string, Base>();
  #gesture = 0;
  #glanceAt = 0;
  #glance = { x: 0, y: 0 };
  #seed = 0x2f6b1d;

  readonly #style: BodyStyle;
  #hipsY = 0;
  #intensity = 1;
  #listen = 0;
  #energy = 1;
  #armAction: ArmAction | null = null;
  #armWeight = 0;
  #hipsBaseY: number | null = null;
  /** Desplazamiento de cabeza que suma este estilo (inclinacion, asentir, mirar alrededor). */
  readonly head = { x: 0, y: 0, z: 0 };

  /** Gesto de brazo en curso: que lado y cuanto (la captura de movimiento no pisa ese brazo). */
  get arm(): { readonly side: 'left' | 'right' | null; readonly weight: number } {
    return { side: this.#armAction ? ARM_POSES[this.#armAction].side : null, weight: this.#armAction ? this.#armWeight : 0 };
  }

  constructor(bone: BoneLookup, style: BodyStyle = DEFAULT_STYLE) {
    this.#style = style;
    const names: VRMHumanBoneName[] = [
      'hips',
      'spine',
      'chest',
      'upperChest',
      'leftShoulder',
      'rightShoulder',
      'leftUpperArm',
      'rightUpperArm',
      'leftLowerArm',
      'rightLowerArm',
      'leftHand',
      'rightHand',
    ];
    for (const side of ['left', 'right'] as const) {
      for (const f of FINGERS) for (const s of SEGMENTS) names.push(`${side}${f}${s}` as VRMHumanBoneName);
    }
    for (const name of names) {
      const b = bone(name);
      if (b) this.#bones.set(name, { bone: b, x: b.rotation.x, y: b.rotation.y, z: b.rotation.z });
    }
    // Dedos relajados: se fijan una vez (el izquierdo dobla con z negativa, el derecho positiva).
    for (const side of ['left', 'right'] as const) {
      const sign = side === 'left' ? -1 : 1;
      for (const f of FINGERS) {
        for (const s of SEGMENTS) {
          const base = this.#bones.get(`${side}${f}${s}`);
          if (!base) continue;
          base.z += sign * CURL[f] * SEGMENT_SCALE[s];
          base.bone.rotation.z = base.z;
        }
      }
    }
    // Postura propia del personaje (manos juntas, mano en la cadera...).
    for (const side of ['left', 'right'] as const) {
      const pose = style.pose[side];
      for (const [part, off] of [['UpperArm', pose.upper], ['LowerArm', pose.lower], ['Hand', pose.hand]] as const) {
        const base = this.#bones.get(`${side}${part}`);
        if (!base) continue;
        base.x += off[0];
        base.y += off[1];
        base.z += off[2];
        base.bone.rotation.set(base.x, base.y, base.z);
      }
    }
    const hips = this.#bones.get('hips');
    if (hips) this.#hipsBaseY = hips.bone.position.y;
  }

  /** Cuantos huesos encontro (para pruebas y diagnostico). */
  get boneCount(): number {
    return this.#bones.size;
  }

  /** Lleva un brazo hacia una pose absoluta en proporcion w (la derecha tal cual; la izquierda en espejo). */
  #applyArm(pose: ArmPose, w: number, time: number): void {
    const side = pose.side === 'left' ? 'left' : 'right';
    const mirror = side === 'left' ? -1 : 1;
    const shake = Math.sin(time * 9) * pose.shake;
    const parts: [string, readonly number[], number][] = [
      [`${side}UpperArm`, pose.upper, 0],
      [`${side}LowerArm`, pose.lower, shake],
      [`${side}Hand`, pose.hand, shake * 0.4],
    ];
    for (const [name, [x, y, z], extra] of parts) {
      const b = this.#bones.get(name);
      if (!b) continue;
      const r = b.bone.rotation;
      const tx = x!;
      const ty = y! * mirror;
      const tz = (z! + extra) * mirror;
      r.set(r.x + (tx - r.x) * w, r.y + (ty - r.y) * w, r.z + (tz - r.z) * w);
    }
  }

  /** Mezcla la pose normal (base + desplazamiento) con una rotacion absoluta, en proporcion w. */
  #setMix(name: string, d: readonly number[], abs: readonly [number, number, number], w: number): void {
    const b = this.#bones.get(name);
    if (!b) return;
    const mix = (base: number, off: number, target: number) => base + off + (target - base - off) * w;
    b.bone.rotation.set(mix(b.x, d[0]!, abs[0]), mix(b.y, d[1]!, abs[1]), mix(b.z, d[2]!, abs[2]));
  }

  #set(name: string, dx: number, dy: number, dz: number): void {
    const b = this.#bones.get(name);
    if (b) b.bone.rotation.set(b.x + dx, b.y + dy, b.z + dz);
  }

  update(time: number, dt: number, input: BodyInput): void {
    const st = this.#style;
    // El modo cambia el caracter poco a poco (no de golpe).
    this.#intensity += ((input.intensity ?? 1) - this.#intensity) * Math.min(1, dt * 1.5);
    const k = this.#intensity;
    // En coqueteo, ademas, algo mas lento.
    const t = time * st.tempo * (k > 1 ? 1 / (1 + (k - 1) * 0.3) : 1);
    const breath = Math.sin(time * 1.6 * Math.min(1, st.tempo + 0.1));
    if (input.still) {
      this.#set('spine', breath * 0.006, 0, 0);
      this.#set('chest', breath * 0.009, 0, 0);
      this.head.x = this.head.y = this.head.z = 0;
      return;
    }

    // Gesto al hablar: sube rapido, baja despacio.
    const target = input.speaking ? Math.min(1, 0.35 + input.level * 0.6) : 0;
    const rate = target > this.#gesture ? 5 : 1.5;
    this.#gesture += (target - this.#gesture) * Math.min(1, dt * rate);
    const g = this.#gesture;
    // La emocion cambia la amplitud poco a poco: alegre, gestos mas grandes; triste, mas recogidos.
    this.#energy += ((input.energy ?? 1) - this.#energy) * Math.min(1, dt * 1.2);
    const E = this.#energy;
    const G = g * st.gesture * E;
    const bg = bodyGestureOffset(input.gesture?.name, input.gesture?.age ?? -1);

    // Cambio de peso (y ondulacion de cadera: z e y desfasados dibujan un ocho).
    const shift = Math.sin((time * Math.PI * 2) / st.swayPeriod);
    const roll = Math.sin((time * Math.PI * 2) / st.swayPeriod * 2 + 0.8);
    const drift = Math.sin(t * 0.21 + 1.3);
    // Al hablar, la ondulacion sigue un poco mas viva (Nova) sin cambiar de ritmo.
    const swayAmp = st.sway * (1 + g * 0.4) * k;
    this.#set('hips', 0, drift * 0.02 + roll * st.hipRoll * k * (0.6 + g * 0.6), shift * swayAmp);
    const hips = this.#bones.get('hips');
    if (hips && this.#hipsBaseY !== null) {
      // Rebote de piernas al hablar (Rio): suave, al ritmo de los gestos.
      const bounceTarget = st.bounce * g * Math.abs(Math.sin(time * st.gestureRate * Math.PI));
      this.#hipsY += (bounceTarget - this.#hipsY) * Math.min(1, dt * 8);
      hips.bone.position.y = this.#hipsBaseY + this.#hipsY;
    }
    this.#set('spine', breath * 0.012 * st.breath + bg.bounce, Math.sin(t * 0.27) * 0.02 - roll * st.hipRoll * 0.5, -shift * swayAmp * 0.6);
    // Escucha activa: se inclina hacia la persona poco a poco (y vuelve al dejar de oir).
    this.#listen += ((input.listening ? 1 : 0) - this.#listen) * Math.min(1, dt * 2);
    const L = this.#listen;
    this.#set('chest', breath * 0.018 * st.breath - g * 0.01 + L * 0.05 + bg.chest, Math.sin(t * 0.33 + 0.4) * 0.012, -shift * swayAmp * 0.3);
    this.#set('upperChest', breath * 0.008 * st.breath, 0, 0);
    // Hombros: respiran y, en Nova, uno rueda despacio al hablar.
    const shoulder = Math.sin(time * 1.1 + 0.5) * st.shoulderRoll * k * (0.3 + g);
    this.#set('leftShoulder', 0, shoulder * 0.5, -breath * 0.008 * st.breath + Math.max(0, shoulder) * 0.4 + bg.shoulders);
    this.#set('rightShoulder', 0, -shoulder * 0.5, breath * 0.008 * st.breath - Math.max(0, -shoulder) * 0.4 - bg.shoulders);

    // Brazos: balanceo en reposo; al hablar, gestos segun el caracter.
    const beat = Math.sin(time * st.gestureRate * Math.PI * 2 * 0.5) * G * Math.min(1, input.level);
    const alt = Math.sin(time * st.gestureRate * 0.9 + 1.2);
    const armL = Math.sin(t * 0.5) * st.armSwing + breath * 0.006;
    const armR = Math.sin(t * 0.5 + 1.7) * st.armSwing + breath * 0.006;
    // Brazo izquierdo: acompaña siempre. El derecho de Nova se queda en la cadera.
    const rightFree = st.handOnHip !== true;
    this.#set('leftUpperArm', -G * 0.12 - Math.max(0, alt) * G * 0.12, 0, -armL + shift * 0.01 + G * 0.12 + Math.max(0, alt) * G * 0.1);
    // Explicar: el antebrazo sube y baja, alternando manos, con el ritmo de la voz.
    const liftL = st.lift * E * g * (0.5 + 0.5 * Math.max(0, alt)) * (0.6 + 0.4 * Math.min(1, input.level));
    const liftR = st.lift * E * g * (0.5 + 0.5 * Math.max(0, -alt)) * (0.6 + 0.4 * Math.min(1, input.level));
    this.#set('leftLowerArm', 0, -G * 0.55 - liftL - beat * 0.12 - Math.sin(t * 0.7) * 0.02, 0);
    this.#set('leftHand', Math.sin(t * 0.9) * 0.03 + beat * 0.06, 0, -G * 0.12);
    if (rightFree) {
      this.#set('rightUpperArm', -G * 0.12 - Math.max(0, -alt) * G * 0.12, 0, armR + shift * 0.01 - G * 0.12 - Math.max(0, -alt) * G * 0.1);
      this.#set('rightLowerArm', 0, G * 0.5 + liftR + beat * 0.1 + Math.sin(t * 0.7 + 2) * 0.02, 0);
      this.#set('rightHand', Math.sin(t * 0.9 + 1.1) * 0.03 - beat * 0.06, 0, G * 0.12);
    } else {
      // Mano en la cadera: solo un leve acompañamiento de la respiracion y del vaiven.
      this.#set('rightUpperArm', 0, 0, armR * 0.5 - shift * swayAmp * 0.5);
      this.#set('rightLowerArm', 0, Math.sin(t * 0.4) * 0.02, 0);
      this.#set('rightHand', 0, 0, 0);
    }

    // Gesto de brazo (saludar, señalar, barbilla, pecho): sube y baja suave sobre lo anterior.
    const wanted = input.arm ?? (input.wave ? { action: 'wave' as const, weight: input.wave } : null);
    if (wanted && wanted.weight > 0) this.#armAction = wanted.action;
    this.#armWeight += ((wanted?.weight ?? 0) - this.#armWeight) * Math.min(1, dt * 4);
    if (this.#armAction && this.#armWeight > 0.001) this.#applyArm(ARM_POSES[this.#armAction], this.#armWeight, time);

    // Cabeza: inclinacion lenta (Nova), asentir al hablar (Luna, Rio) y mirar alrededor (Rio).
    const tilt = Math.sin(t * 0.37 + 0.9) * st.headTilt * k * (0.6 + g * 0.8);
    const nod = Math.sin(time * st.gestureRate * Math.PI * 0.35) * st.nod * g * 0.8;
    // Al hablar mira a la persona: la mirada al paisaje se apaga en cuanto empieza a hablar.
    const look = st.lookAround * Math.max(0, 1 - g * 1.6) * this.#lookAround(time);
    // Al escuchar: la cabeza un poco ladeada y asentimientos lentos cada pocos segundos.
    const listenNod = L * st.nod * 1.1 * Math.max(0, Math.sin(time * 0.7)) ** 4;
    this.head.x = nod + listenNod + L * 0.03;
    this.head.y = look * (1 - L);
    this.head.z = tilt + L * 0.05;
  }

  #lookTarget = 0;
  #lookAt = 0;
  #look = 0;
  /** Cada pocos segundos mira hacia un lado del paisaje y vuelve (-1 a 1, suave). */
  #lookAround(time: number): number {
    if (time >= this.#lookAt) {
      this.#seed = (this.#seed * 1664525 + 1013904223) >>> 0;
      const r = this.#seed / 4294967296;
      this.#lookTarget = this.#lookTarget !== 0 ? 0 : r < 0.5 ? -1 : 1;
      this.#lookAt = time + (this.#lookTarget !== 0 ? 1.6 : 3.5 + r * 3);
    }
    this.#look += (this.#lookTarget - this.#look) * 0.04;
    return this.#look;
  }

  /**
   * Desvio de la mirada en metros a la distancia de la camara: cada 1,2-3,5 s salta a un
   * punto cercano al centro (casi siempre de vuelta al centro), como los ojos reales.
   */
  glance(t: number): { x: number; y: number } {
    if (t >= this.#glanceAt) {
      const r = () => {
        this.#seed = (this.#seed * 1664525 + 1013904223) >>> 0;
        return this.#seed / 4294967296;
      };
      // Menos saltos de mirada y mas cortos: muchos seguidos parecian nerviosos.
      const away = r() < 0.3;
      this.#glance = away ? { x: (r() - 0.5) * 0.05, y: (r() - 0.5) * 0.025 } : { x: 0, y: 0 };
      this.#glanceAt = t + 2.5 + r() * 4;
    }
    return this.#glance;
  }
}
