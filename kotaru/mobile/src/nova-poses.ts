/**
 * Poses de Nova (pedido del dueño, 2026-09-30, con dibujos de referencia): en vez de mover los
 * brazos todo el rato, mantiene una pose natural un rato (manos en la cadera, corazon con las
 * manos, una mano en la nuca, la barbilla en la mano...) respirando, y pasa despacio a otra.
 * De vez en cuando, un gesto suelto encima: enredarse un mechon en el dedo o morderse la uña.
 *
 * Las manos se colocan con cinematica inversa (ik.ts) en puntos del propio cuerpo (la cadera,
 * el pecho, la cabeza), asi que siguen al cuerpo cuando cambia el peso de pierna. Las piernas
 * y la cadera siguen con la captura de estar de pie. Los cambios son lentos (≈2 s) y suaves.
 */
import * as THREE from 'three';
import type { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';
import { twoBoneIK } from './ik.ts';

/** Donde va una mano, respecto a una parte del cuerpo: lateral (hacia su lado), arriba, delante (m). */
interface Spot {
  /** 'head': el hueso de la cabeza nace a la altura de la mandibula (no en el centro de la cara). */
  readonly at: 'hips' | 'chest' | 'head';
  readonly off: readonly [number, number, number];
  /** Hacia donde apunta el codo (desde el hombro): lateral, arriba, delante. */
  readonly elbow: readonly [number, number, number];
  /** Muñeca: flexion, ladeo, giro (rad) sobre la mano recta. */
  readonly wrist: readonly [number, number, number];
  /** Dedos: 0 relajados, 1 cerrados; `index` = el indice estirado. */
  readonly curl: number;
  readonly index?: boolean;
}

export const SPOTS = {
  // Mano en la cadera: el dorso hacia fuera, los dedos hacia delante y abajo.
  hip: { at: 'hips', off: [0.15, 0.08, -0.01], elbow: [0.5, -0.1, -0.25], wrist: [0, 0, 0.5], curl: 0.3 },
  // Apoyada en el muslo, algo mas abajo y delante.
  thigh: { at: 'hips', off: [0.1, -0.15, 0.08], elbow: [0.15, -0.4, -0.4], wrist: [0, 0, -0.2], curl: 0.35 },
  // Colgando relajada, junto al muslo.
  down: { at: 'hips', off: [0.17, -0.24, 0.03], elbow: [0.08, -0.3, -0.5], wrist: [0, 0, -0.15], curl: 0.4 },
  // Corazon con las manos delante del pecho.
  heart: { at: 'chest', off: [0.03, 0.06, 0.24], elbow: [0.45, -0.45, 0.0], wrist: [0, 0.2, 0.5], curl: 0.75 },
  // Mano en la nuca, el codo arriba y fuera.
  nape: { at: 'head', off: [0.07, -0.07, -0.05], elbow: [0.6, 0.35, 0.1], wrist: [0, 0, 0.3], curl: 0.3 },
  // Mano sobre la cabeza.
  crown: { at: 'head', off: [0.05, 0.1, 0.0], elbow: [0.6, 0.45, 0.15], wrist: [0, 0, 0.4], curl: 0.3 },
  // La barbilla apoyada en la mano.
  chin: { at: 'head', off: [0.02, -0.04, 0.12], elbow: [0.25, -0.6, 0.25], wrist: [0, 0, 0.6], curl: 0.55 },
  // Abrazando la cintura, sujetando el codo del otro brazo.
  hold: { at: 'chest', off: [-0.07, -0.16, 0.13], elbow: [0.35, -0.6, 0.1], wrist: [0, 0, 0.1], curl: 0.5 },
  // Mano en el escote, sobre la clavicula.
  collar: { at: 'chest', off: [-0.03, 0.07, 0.13], elbow: [0.3, -0.6, 0.15], wrist: [0, 0, 0.3], curl: 0.35 },
  // Gesto: enredarse un mechon junto a la cara en el dedo.
  twirl: { at: 'head', off: [0.13, -0.045, 0.05], elbow: [0.45, -0.45, 0.2], wrist: [0, 0, 0.3], curl: 0.5, index: true },
  // Gesto: morderse la uña del indice.
  bite: { at: 'head', off: [0.012, -0.03, 0.115], elbow: [0.3, -0.6, 0.2], wrist: [0, 0, 0.7], curl: 0.8, index: true },
} satisfies Record<string, Spot>;

export type SpotName = keyof typeof SPOTS;

export interface NovaPose {
  readonly name: string;
  /** Mano del lado del peso y la otra (se elige al azar cual es cual). */
  readonly a: SpotName;
  readonly b: SpotName;
  /** Cabeza: ladeo y giro (rad); cuerpo: inclinacion hacia delante (rad). */
  readonly tilt: number;
  readonly turn: number;
  readonly lean: number;
}

/** Las poses de las referencias del dueño. */
export const NOVA_POSES: readonly NovaPose[] = [
  { name: 'manos-cadera', a: 'hip', b: 'hip', tilt: 0.08, turn: 0, lean: 0 },
  { name: 'corazon', a: 'heart', b: 'heart', tilt: 0.14, turn: 0, lean: 0.06 },
  { name: 'nuca', a: 'nape', b: 'thigh', tilt: 0.12, turn: 0.05, lean: 0 },
  { name: 'una-cadera', a: 'hip', b: 'down', tilt: 0.06, turn: 0, lean: 0 },
  { name: 'barbilla', a: 'chin', b: 'hold', tilt: 0.1, turn: 0.08, lean: 0.03 },
  { name: 'manos-nuca', a: 'nape', b: 'nape', tilt: 0.06, turn: 0, lean: -0.02 },
  { name: 'cadera-muslo', a: 'hip', b: 'thigh', tilt: 0.07, turn: 0, lean: 0 },
  { name: 'cabeza', a: 'crown', b: 'nape', tilt: 0.1, turn: 0, lean: -0.03 },
  { name: 'escote', a: 'collar', b: 'down', tilt: 0.12, turn: 0.25, lean: 0.02 },
];

/** Cuanto mantiene cada pose (s) y cuanto tarda en pasar a otra. */
export const POSE_HOLD: readonly [number, number] = [9, 20];
const POSE_BLEND = 2.2;
/** Gestos sueltos encima de la pose: cada cuanto (s) y cuanto duran. */
const GESTURE_EVERY: readonly [number, number] = [25, 50];
const GESTURE_HOLD: readonly [number, number] = [3.5, 5.5];

const smooth = (k: number) => k * k * (3 - 2 * k);

interface Hand {
  pos: THREE.Vector3;
  elbow: THREE.Vector3;
  wrist: THREE.Vector3;
  curl: number;
  index: number;
}

export class NovaPoses {
  readonly #vrm: VRM;
  readonly #up: THREE.Vector3;
  readonly #left: THREE.Vector3;
  readonly #fwd: THREE.Vector3;
  #pose: NovaPose = NOVA_POSES[0]!;
  #side: 1 | -1 = 1;
  #from: { l: Hand; r: Hand; tilt: number; turn: number; lean: number } | null = null;
  #blend = 1;
  #hold = POSE_HOLD[0];
  #gesture: { spot: SpotName; side: 'l' | 'r'; t: number; dur: number } | null = null;
  #gestureIn = GESTURE_EVERY[0];
  #time = 0;
  #weight = 0;
  readonly #fingerRest = new Map<THREE.Object3D, number>();
  #last: { l: Hand; r: Hand; tilt: number; turn: number; lean: number } | null = null;

  constructor(vrm: VRM, axes: { up: THREE.Vector3; left: THREE.Vector3; fwd: THREE.Vector3 }) {
    this.#vrm = vrm;
    this.#up = axes.up;
    this.#left = axes.left;
    this.#fwd = axes.fwd;
    this.#pick();
    this.#blend = 1;
  }

  /** Cuanto manda la pose (0-1). */
  get weight(): number {
    return this.#weight;
  }

  /** Pose actual (pruebas). */
  get pose(): string {
    return this.#pose.name;
  }

  /** Pasar ya a una pose (pruebas: ?act=pose-corazon) o a un gesto (?act=gesture-bite). */
  force(name: string): boolean {
    const p = NOVA_POSES.find((x) => x.name === name);
    if (p) {
      this.#startPose(p);
      return true;
    }
    if (name === 'twirl' || name === 'bite') {
      this.#gesture = { spot: name, side: Math.random() < 0.5 ? 'l' : 'r', t: 0, dur: 5 };
      return true;
    }
    return false;
  }

  #pick(): void {
    const options = NOVA_POSES.filter((p) => p !== this.#pose);
    this.#startPose(options[Math.floor(Math.random() * options.length)]!);
  }

  #startPose(p: NovaPose): void {
    this.#from = this.#last;
    this.#pose = p;
    this.#side = Math.random() < 0.5 ? 1 : -1;
    this.#blend = 0;
    this.#hold = POSE_HOLD[0] + Math.random() * (POSE_HOLD[1] - POSE_HOLD[0]);
  }

  /**
   * Un cuadro, despues de la captura (piernas y cadera) y antes del choque de brazos. `on`: si
   * manda la pose (no durante el recado del agua ni otras acciones); entra y sale con fundido.
   */
  update(dt: number, on: boolean): void {
    this.#time += dt;
    this.#weight += ((on ? 1 : 0) - this.#weight) * Math.min(1, dt * 1.2);
    if (this.#weight < 0.001) return;
    if (on) {
      this.#hold -= dt;
      if (this.#hold <= 0 && this.#blend >= 1) this.#pick();
      this.#gestureIn -= dt;
      if (!this.#gesture && this.#gestureIn <= 0 && this.#blend >= 1) {
        this.#gesture = { spot: Math.random() < 0.6 ? 'twirl' : 'bite', side: Math.random() < 0.5 ? 'l' : 'r', t: 0, dur: GESTURE_HOLD[0] + Math.random() * (GESTURE_HOLD[1] - GESTURE_HOLD[0]) };
        this.#gestureIn = GESTURE_EVERY[0] + Math.random() * (GESTURE_EVERY[1] - GESTURE_EVERY[0]);
      }
    }
    this.#blend = Math.min(1, this.#blend + dt / POSE_BLEND);
    const k = smooth(this.#blend);
    const root = this.#vrm.humanoid.normalizedHumanBonesRoot;
    root.updateMatrixWorld(true);
    // Mano del lado del peso = `a` (el lado cambia al azar con cada pose).
    const spotL = this.#side === 1 ? this.#pose.a : this.#pose.b;
    const spotR = this.#side === 1 ? this.#pose.b : this.#pose.a;
    const target = { l: this.#hand('left', SPOTS[spotL]), r: this.#hand('right', SPOTS[spotR]), tilt: this.#pose.tilt * this.#side, turn: this.#pose.turn * this.#side, lean: this.#pose.lean };
    // Gesto encima: sube, se queda (con un leve movimiento del dedo) y vuelve a la pose.
    if (this.#gesture) {
      const g = this.#gesture;
      g.t += dt;
      const env = smooth(Math.max(0, Math.min(1, g.t / 1.1, (g.dur - g.t) / 1.1)));
      const side = g.side === 'l' ? 'left' : 'right';
      const h = this.#hand(side, SPOTS[g.spot]);
      // Enredarse el pelo: el dedo da vueltas despacio; morderse: un leve vaiven.
      const wob = g.spot === 'twirl' ? 0.012 : 0.004;
      h.pos.addScaledVector(this.#up, Math.sin(g.t * 2.2) * wob).addScaledVector(this.#fwd, Math.cos(g.t * 2.2) * wob);
      const cur = target[g.side];
      lerpHand(cur, h, env);
      if (g.spot === 'bite') target.tilt += -0.05 * env * (g.side === 'l' ? 1 : -1);
      if (g.t >= g.dur) this.#gesture = null;
    }
    let now = target;
    if (this.#from && k < 1) {
      now = {
        l: lerpHand(cloneHand(this.#from.l), target.l, k),
        r: lerpHand(cloneHand(this.#from.r), target.r, k),
        tilt: this.#from.tilt + (target.tilt - this.#from.tilt) * k,
        turn: this.#from.turn + (target.turn - this.#from.turn) * k,
        lean: this.#from.lean + (target.lean - this.#from.lean) * k,
      };
    }
    this.#last = { l: cloneHand(now.l), r: cloneHand(now.r), tilt: now.tilt, turn: now.turn, lean: now.lean };
    this.#apply(now, this.#weight);
  }

  /** Punto (espacio de la escena) donde va una mano, su codo, y como van muñeca y dedos. */
  #hand(side: 'left' | 'right', spot: Spot): Hand {
    const s = side === 'left' ? 1 : -1;
    const scene = this.#vrm.scene;
    const anchorBone = spot.at === 'hips' ? 'hips' : spot.at === 'chest' ? 'upperChest' : 'head';
    const node = this.#bone(anchorBone) ?? this.#bone('chest') ?? this.#bone('hips')!;
    const base = scene.worldToLocal(node.getWorldPosition(new THREE.Vector3()));
    const shoulder = scene.worldToLocal(this.#bone(`${side}UpperArm`)!.getWorldPosition(new THREE.Vector3()));
    const pos = base.addScaledVector(this.#left, s * spot.off[0]).addScaledVector(this.#up, spot.off[1]).addScaledVector(this.#fwd, spot.off[2]);
    const elbow = shoulder.addScaledVector(this.#left, s * spot.elbow[0]).addScaledVector(this.#up, spot.elbow[1]).addScaledVector(this.#fwd, spot.elbow[2]);
    return { pos, elbow, wrist: new THREE.Vector3(...spot.wrist), curl: spot.curl, index: spot.index ? 1 : 0 };
  }

  #bone(name: string): THREE.Object3D | null {
    return this.#vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
  }

  #apply(p: { l: Hand; r: Hand; tilt: number; turn: number; lean: number }, w: number): void {
    const scene = this.#vrm.scene;
    const q = new THREE.Quaternion();
    // Cuerpo: inclinacion hacia delante; cabeza ladeada y algo girada (sobre lo que haya).
    const rot = (name: string, axis: THREE.Vector3, angle: number) => {
      const n = this.#bone(name);
      if (n && angle) n.quaternion.premultiply(q.setFromAxisAngle(axis, angle * w));
    };
    rot('spine', this.#left, p.lean * 0.6);
    rot('chest', this.#left, p.lean * 0.4);
    rot('head', this.#fwd, p.tilt);
    rot('neck', this.#up, p.turn * 0.5);
    rot('head', this.#up, p.turn * 0.5);
    this.#vrm.humanoid.normalizedHumanBonesRoot.updateMatrixWorld(true);
    for (const side of ['left', 'right'] as const) {
      const h = side === 'left' ? p.l : p.r;
      const upper = this.#bone(`${side}UpperArm`);
      const lower = this.#bone(`${side}LowerArm`);
      const hand = this.#bone(`${side}Hand`);
      if (!upper || !lower || !hand) continue;
      const before = [upper.quaternion.clone(), lower.quaternion.clone(), hand.quaternion.clone()];
      twoBoneIK(upper, lower, hand, scene.localToWorld(h.pos.clone()), scene.localToWorld(h.elbow.clone()));
      const sign = side === 'left' ? -1 : 1;
      // Muñeca: la mano recta respecto al antebrazo, con la flexion de la pose (y respira un poco).
      const breathe = Math.sin(this.#time * 0.5 + (side === 'left' ? 0 : 2)) * 0.03;
      hand.quaternion.setFromEuler(new THREE.Euler(h.wrist.x, h.wrist.y * sign, (h.wrist.z + breathe) * sign));
      const after = [upper.quaternion.clone(), lower.quaternion.clone(), hand.quaternion.clone()];
      [upper, lower, hand].forEach((n, i) => n.quaternion.copy(before[i]!).slerp(after[i]!, w));
      // Dedos.
      for (const f of ['Index', 'Middle', 'Ring', 'Little'] as const) {
        const curl = f === 'Index' ? h.curl * (1 - h.index) : h.curl;
        for (const [seg, kk] of [['Proximal', 1], ['Intermediate', 1.1], ['Distal', 0.7]] as const) {
          const n = this.#bone(`${side}${f}${seg}`);
          if (!n) continue;
          if (!this.#fingerRest.has(n)) this.#fingerRest.set(n, n.rotation.z);
          const rest = this.#fingerRest.get(n)!;
          n.rotation.z = rest + (rest + sign * 1.3 * kk * curl - rest) * w;
        }
      }
    }
  }
}

function cloneHand(h: Hand): Hand {
  return { pos: h.pos.clone(), elbow: h.elbow.clone(), wrist: h.wrist.clone(), curl: h.curl, index: h.index };
}

function lerpHand(a: Hand, b: Hand, k: number): Hand {
  a.pos.lerp(b.pos, k);
  a.elbow.lerp(b.elbow, k);
  a.wrist.lerp(b.wrist, k);
  a.curl += (b.curl - a.curl) * k;
  a.index += (b.index - a.index) * k;
  return a;
}
