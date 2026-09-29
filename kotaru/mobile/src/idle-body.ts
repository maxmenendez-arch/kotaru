import type { Object3D } from 'three';
import type { VRMHumanBoneName } from '@pixiv/three-vrm';

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

  constructor(bone: BoneLookup) {
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
  }

  /** Cuantos huesos encontro (para pruebas y diagnostico). */
  get boneCount(): number {
    return this.#bones.size;
  }

  #set(name: string, dx: number, dy: number, dz: number): void {
    const b = this.#bones.get(name);
    if (b) b.bone.rotation.set(b.x + dx, b.y + dy, b.z + dz);
  }

  update(t: number, dt: number, input: BodyInput): void {
    const breath = Math.sin(t * 1.6);
    if (input.still) {
      this.#set('spine', breath * 0.006, 0, 0);
      this.#set('chest', breath * 0.009, 0, 0);
      return;
    }

    // Gesto al hablar: sube rapido, baja despacio.
    const target = input.speaking ? Math.min(1, 0.35 + input.level * 0.6) : 0;
    const rate = target > this.#gesture ? 5 : 1.5;
    this.#gesture += (target - this.#gesture) * Math.min(1, dt * rate);
    const g = this.#gesture;

    const shift = Math.sin((t * Math.PI * 2) / 9);
    const drift = Math.sin(t * 0.21 + 1.3);
    this.#set('hips', 0, drift * 0.025, shift * 0.02);
    this.#set('spine', breath * 0.012, Math.sin(t * 0.27) * 0.02, -shift * 0.012);
    this.#set('chest', breath * 0.018 - g * 0.01, Math.sin(t * 0.33 + 0.4) * 0.012, -shift * 0.006);
    this.#set('upperChest', breath * 0.008, 0, 0);
    this.#set('leftShoulder', 0, 0, -breath * 0.008);
    this.#set('rightShoulder', 0, 0, breath * 0.008);

    // Brazos: balanceo desfasado; al hablar, codos algo mas doblados y un vaiven con la voz.
    const beat = Math.sin(t * 3.1) * g * Math.min(1, input.level);
    const armL = Math.sin(t * 0.5) * 0.015 + breath * 0.006;
    const armR = Math.sin(t * 0.5 + 1.7) * 0.015 + breath * 0.006;
    this.#set('leftUpperArm', -g * 0.06, 0, -armL + shift * 0.01 + g * 0.05);
    this.#set('rightUpperArm', -g * 0.06, 0, armR + shift * 0.01 - g * 0.05);
    this.#set('leftLowerArm', 0, -g * 0.35 - beat * 0.08 - Math.sin(t * 0.7) * 0.02, 0);
    this.#set('rightLowerArm', 0, g * 0.3 + beat * 0.06 + Math.sin(t * 0.7 + 2) * 0.02, 0);
    this.#set('leftHand', Math.sin(t * 0.9) * 0.03 + beat * 0.05, 0, -g * 0.08);
    this.#set('rightHand', Math.sin(t * 0.9 + 1.1) * 0.03 - beat * 0.05, 0, g * 0.08);
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
