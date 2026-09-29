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
  #hipsBaseY: number | null = null;
  /** Desplazamiento de cabeza que suma este estilo (inclinacion, asentir, mirar alrededor). */
  readonly head = { x: 0, y: 0, z: 0 };

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

  #set(name: string, dx: number, dy: number, dz: number): void {
    const b = this.#bones.get(name);
    if (b) b.bone.rotation.set(b.x + dx, b.y + dy, b.z + dz);
  }

  update(time: number, dt: number, input: BodyInput): void {
    const st = this.#style;
    const t = time * st.tempo;
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
    const G = g * st.gesture;

    // Cambio de peso (y ondulacion de cadera: z e y desfasados dibujan un ocho).
    const shift = Math.sin((time * Math.PI * 2) / st.swayPeriod);
    const roll = Math.sin((time * Math.PI * 2) / st.swayPeriod * 2 + 0.8);
    const drift = Math.sin(t * 0.21 + 1.3);
    // Al hablar, la ondulacion sigue un poco mas viva (Nova) sin cambiar de ritmo.
    const swayAmp = st.sway * (1 + g * 0.4);
    this.#set('hips', 0, drift * 0.02 + roll * st.hipRoll * (0.6 + g * 0.6), shift * swayAmp);
    const hips = this.#bones.get('hips');
    if (hips && this.#hipsBaseY !== null) {
      // Rebote de piernas al hablar (Rio): suave, al ritmo de los gestos.
      const bounceTarget = st.bounce * g * Math.abs(Math.sin(time * st.gestureRate * Math.PI));
      this.#hipsY += (bounceTarget - this.#hipsY) * Math.min(1, dt * 8);
      hips.bone.position.y = this.#hipsBaseY + this.#hipsY;
    }
    this.#set('spine', breath * 0.012 * st.breath, Math.sin(t * 0.27) * 0.02 - roll * st.hipRoll * 0.5, -shift * swayAmp * 0.6);
    this.#set('chest', breath * 0.018 * st.breath - g * 0.01, Math.sin(t * 0.33 + 0.4) * 0.012, -shift * swayAmp * 0.3);
    this.#set('upperChest', breath * 0.008 * st.breath, 0, 0);
    // Hombros: respiran y, en Nova, uno rueda despacio al hablar.
    const shoulder = Math.sin(time * 1.1 + 0.5) * st.shoulderRoll * (0.3 + g);
    this.#set('leftShoulder', 0, shoulder * 0.5, -breath * 0.008 * st.breath + Math.max(0, shoulder) * 0.4);
    this.#set('rightShoulder', 0, -shoulder * 0.5, breath * 0.008 * st.breath - Math.max(0, -shoulder) * 0.4);

    // Brazos: balanceo en reposo; al hablar, gestos segun el caracter.
    const beat = Math.sin(time * st.gestureRate * Math.PI * 2 * 0.5) * G * Math.min(1, input.level);
    const alt = Math.sin(time * st.gestureRate * 0.9 + 1.2);
    const armL = Math.sin(t * 0.5) * st.armSwing + breath * 0.006;
    const armR = Math.sin(t * 0.5 + 1.7) * st.armSwing + breath * 0.006;
    // Brazo izquierdo: acompaña siempre. El derecho de Nova se queda en la cadera.
    const rightFree = st.handOnHip !== true;
    this.#set('leftUpperArm', -G * 0.12 - Math.max(0, alt) * G * 0.12, 0, -armL + shift * 0.01 + G * 0.12 + Math.max(0, alt) * G * 0.1);
    // Explicar: el antebrazo sube y baja, alternando manos, con el ritmo de la voz.
    const liftL = st.lift * g * (0.5 + 0.5 * Math.max(0, alt)) * (0.6 + 0.4 * Math.min(1, input.level));
    const liftR = st.lift * g * (0.5 + 0.5 * Math.max(0, -alt)) * (0.6 + 0.4 * Math.min(1, input.level));
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

    // Cabeza: inclinacion lenta (Nova), asentir al hablar (Luna, Rio) y mirar alrededor (Rio).
    const tilt = Math.sin(t * 0.37 + 0.9) * st.headTilt * (0.6 + g * 0.8);
    const nod = Math.sin(time * st.gestureRate * Math.PI * 0.5) * st.nod * g;
    // Al hablar mira a la persona: la mirada al paisaje se apaga en cuanto empieza a hablar.
    const look = st.lookAround * Math.max(0, 1 - g * 1.6) * this.#lookAround(time);
    this.head.x = nod;
    this.head.y = look;
    this.head.z = tilt;
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
      const away = r() < 0.45;
      this.#glance = away ? { x: (r() - 0.5) * 0.08, y: (r() - 0.5) * 0.04 } : { x: 0, y: 0 };
      this.#glanceAt = t + 1.2 + r() * 2.3;
    }
    return this.#glance;
  }
}
