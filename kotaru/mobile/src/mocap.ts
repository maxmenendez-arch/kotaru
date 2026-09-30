/**
 * Movimiento capturado de personas reales (CMU, ver public/motions/CREDITS.md) aplicado a los
 * personajes VRM. Pedido del dueño (2026-09-30): que no parezcan muñecos, con el peso en un pie
 * y luego en el otro, sin simetria, gestos reales al hablar y acciones (beber, arreglarse).
 *
 * Reajuste por direcciones de hueso: el esqueleto de la captura y el del personaje no tienen la
 * misma postura de reposo ni las mismas proporciones. Para cada hueso se busca la rotacion que
 * lleva la direccion del hueso del personaje a la del hueso capturado en reposo, y encima se
 * aplica la rotacion capturada (en el marco del personaje). Asi un mismo clip sirve para Luna,
 * Nova y Rio. Se pierde algo del giro sobre el eje del hueso (antebrazos), que no se nota.
 *
 * Puro (solo matematicas de three): se prueba sin navegador.
 */
import { Matrix4, Quaternion, Vector3 } from 'three';

export interface MotionClipJson {
  readonly v: 1;
  readonly source: string;
  readonly fps: number;
  readonly frames: number;
  readonly bones: readonly string[];
  readonly rest: { readonly dirs: Record<string, readonly number[]>; readonly thumbs?: Record<string, readonly number[]>; readonly up: readonly number[]; readonly left: readonly number[] };
  readonly q: string;
  readonly p: string;
}

export interface MotionClip {
  readonly source: string;
  readonly fps: number;
  readonly frames: number;
  readonly duration: number;
  readonly bones: readonly string[];
  readonly restDirs: ReadonlyMap<string, Vector3>;
  /** Hacia el pulgar en reposo (manos): para el giro de la muñeca. */
  readonly restThumbs: ReadonlyMap<string, Vector3>;
  readonly restUp: Vector3;
  readonly restLeft: Vector3;
  /** Rotaciones en el mundo del BVH, cuantizadas (cuadro, hueso, xyzw). */
  readonly q: Int16Array;
  /** Cadera relativa al reposo, en largos de pierna x 10000 (cuadro, xyz). */
  readonly p: Int16Array;
  /** Posicion media de la cadera en el suelo (x, z): se resta para que no se desplace. */
  readonly meanX: number;
  readonly meanZ: number;
}

function decode(b64: string): Int16Array {
  const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

export function parseClip(json: MotionClipJson): MotionClip {
  const p = decode(json.p);
  let mx = 0;
  let mz = 0;
  for (let f = 0; f < json.frames; f++) {
    mx += p[f * 3]!;
    mz += p[f * 3 + 2]!;
  }
  return {
    source: json.source,
    fps: json.fps,
    frames: json.frames,
    duration: json.frames / json.fps,
    bones: json.bones,
    restDirs: new Map(Object.entries(json.rest.dirs).map(([k, v]) => [k, new Vector3(v[0], v[1], v[2])])),
    restThumbs: new Map(Object.entries(json.rest.thumbs ?? {}).map(([k, v]) => [k, new Vector3(v[0], v[1], v[2])])),
    restUp: new Vector3(...(json.rest.up as [number, number, number])),
    restLeft: new Vector3(...(json.rest.left as [number, number, number])),
    q: decode(json.q),
    p,
    meanX: mx / Math.max(1, json.frames),
    meanZ: mz / Math.max(1, json.frames),
  };
}

/** Esqueleto del personaje en reposo (espacio del modelo), antes de cualquier pose. */
export interface RigRest {
  /** Posicion en reposo de cada hueso normalizado que exista. */
  readonly positions: ReadonlyMap<string, Vector3>;
  /** Hueso padre (el humanoide mas cercano hacia arriba) de cada hueso; null en la cadera. */
  readonly parents: ReadonlyMap<string, string | null>;
}

/** Hacia donde apunta cada hueso en reposo: al hijo que usa la captura. */
const CHILD: Record<string, readonly string[]> = {
  hips: ['spine'],
  spine: ['chest'],
  chest: ['upperChest', 'neck'],
  upperChest: ['neck'],
  neck: ['head'],
  leftShoulder: ['leftUpperArm'],
  leftUpperArm: ['leftLowerArm'],
  leftLowerArm: ['leftHand'],
  leftHand: ['leftMiddleProximal', 'leftIndexProximal'],
  rightShoulder: ['rightUpperArm'],
  rightUpperArm: ['rightLowerArm'],
  rightLowerArm: ['rightHand'],
  rightHand: ['rightMiddleProximal', 'rightIndexProximal'],
  leftUpperLeg: ['leftLowerLeg'],
  leftLowerLeg: ['leftFoot'],
  leftFoot: ['leftToes'],
  rightUpperLeg: ['rightLowerLeg'],
  rightLowerLeg: ['rightFoot'],
  rightFoot: ['rightToes'],
};

/**
 * Huesos que mueve la captura. El cuello y la cabeza solo se usan en las acciones (beber,
 * arreglarse el pelo): el resto del tiempo los lleva la mirada (avatar-viewer).
 */
export const DRIVEN = [
  'hips',
  'spine',
  'chest',
  'upperChest',
  'neck',
  'head',
  'leftShoulder',
  'leftUpperArm',
  'leftLowerArm',
  'leftHand',
  'rightShoulder',
  'rightUpperArm',
  'rightLowerArm',
  'rightHand',
  'leftUpperLeg',
  'leftLowerLeg',
  'leftFoot',
  'rightUpperLeg',
  'rightLowerLeg',
  'rightFoot',
] as const;

/** Marco ortonormal a partir de una direccion principal y otra de apoyo. */
function frame2(main: Vector3, aux: Vector3): Matrix4 {
  const x = main.clone().normalize();
  const y = aux.clone().sub(x.clone().multiplyScalar(aux.dot(x))).normalize();
  const z = new Vector3().crossVectors(x, y);
  return new Matrix4().makeBasis(x, y, z);
}

/** Parte del giro de la muñeca que hace el antebrazo (en una persona, mas de la mitad). */
const FOREARM_TWIST = 0.6;

function basis(left: Vector3, up: Vector3): Matrix4 {
  const x = left.clone().normalize();
  const y = up.clone().sub(x.clone().multiplyScalar(up.dot(x))).normalize();
  const z = new Vector3().crossVectors(x, y);
  return new Matrix4().makeBasis(x, y, z);
}

/** Reajuste de un clip a un personaje concreto. */
export class Retarget {
  readonly #clip: MotionClip;
  readonly #rig: RigRest;
  readonly #m = new Quaternion();
  readonly #mInv = new Quaternion();
  readonly #fix = new Map<string, Quaternion>();
  readonly #index = new Map<string, number>();
  readonly #bones: string[];
  readonly #legLength: number;
  // Temporales (sin crear objetos por cuadro).
  readonly #a = new Quaternion();
  readonly #b = new Quaternion();
  readonly #world = new Map<string, Quaternion>();

  constructor(clip: MotionClip, rig: RigRest) {
    this.#clip = clip;
    this.#rig = rig;
    clip.bones.forEach((b, i) => this.#index.set(b, i));
    const pos = (b: string) => rig.positions.get(b);
    const hips = pos('hips')!;
    const upV = pos('spine')!.clone().sub(hips);
    const leftV = pos('leftUpperLeg')!.clone().sub(pos('rightUpperLeg')!);
    // M: del marco del BVH al del personaje (alinea la cadera en reposo).
    const m = basis(leftV, upV).multiply(basis(clip.restLeft, clip.restUp).transpose());
    this.#m.setFromRotationMatrix(m);
    this.#mInv.copy(this.#m).invert();
    this.#bones = DRIVEN.filter((b) => rig.positions.has(b) && this.#index.has(b));
    for (const b of this.#bones) {
      const child = (CHILD[b] ?? []).find((c) => rig.positions.has(c));
      const from = child ? pos(child)!.clone().sub(pos(b)!).normalize() : null;
      const bvh = clip.restDirs.get(b);
      this.#world.set(b, new Quaternion());
      if (b === 'hips' || !from || !bvh) {
        this.#fix.set(b, new Quaternion());
        continue;
      }
      const to = bvh.clone().applyQuaternion(this.#m).normalize();
      // Manos: con dos referencias (dedos y pulgar) para que la muñeca tenga su giro real; el
      // resto de huesos, solo con la direccion.
      const side = b === 'leftHand' ? 'left' : b === 'rightHand' ? 'right' : null;
      const thumbB = clip.restThumbs.get(b);
      const thumbNode = side ? pos(`${side}ThumbProximal`) ?? pos(`${side}ThumbMetacarpal`) : undefined;
      if (side && thumbB && thumbNode) {
        const thumbV = thumbNode.clone().sub(pos(b)!);
        const tb = thumbB.clone().applyQuaternion(this.#m);
        const r = frame2(to, tb).multiply(frame2(from, thumbV).transpose());
        this.#fix.set(b, new Quaternion().setFromRotationMatrix(r));
      } else this.#fix.set(b, new Quaternion().setFromUnitVectors(from, to));
    }
    for (const side of ['left', 'right'] as const) {
      const l = pos(`${side}LowerArm`);
      const h = pos(`${side}Hand`);
      if (l && h) this.#forearm[side] = h.clone().sub(l).normalize();
    }
    const toes = pos('leftToes') ?? pos('leftFoot')!;
    this.#legLength = Math.max(0.1, hips.y - toes.y);
    // De frente: en la sala de captura la persona miraba hacia cualquier lado. Se quita el
    // giro medio de la cadera (se conservan los giros pequeños, que son naturales).
    const up = upV.clone().normalize();
    const fwd = new Vector3().crossVectors(leftV.clone().normalize(), up).normalize();
    let sx = 0;
    let sz = 0;
    const w = new Quaternion();
    const f = new Vector3();
    const side = new Vector3().crossVectors(up, fwd);
    for (let t = 0; t < clip.duration; t += 0.25) {
      this.#sampleWorld('hips', t, w);
      w.premultiply(this.#m).multiply(this.#mInv);
      f.copy(fwd).applyQuaternion(w);
      sx += f.dot(side);
      sz += f.dot(fwd);
    }
    this.#face.setFromAxisAngle(up, -Math.atan2(sx, sz));
  }

  readonly #face = new Quaternion();
  readonly #forearm: { left?: Vector3; right?: Vector3 } = {};

  get bones(): readonly string[] {
    return this.#bones;
  }

  #sampleWorld(bone: string, t: number, out: Quaternion): Quaternion {
    const clip = this.#clip;
    const f = Math.min(clip.frames - 1, Math.max(0, t * clip.fps));
    const f0 = Math.floor(f);
    const f1 = Math.min(clip.frames - 1, f0 + 1);
    const bi = this.#index.get(bone)!;
    const read = (frame: number, q: Quaternion) => {
      const o = (frame * clip.bones.length + bi) * 4;
      return q.set(clip.q[o]! / 32767, clip.q[o + 1]! / 32767, clip.q[o + 2]! / 32767, clip.q[o + 3]! / 32767).normalize();
    };
    read(f0, out);
    read(f1, this.#a);
    return out.slerp(this.#a, f - f0);
  }

  /**
   * Pose en el segundo `t` del clip: rotacion local de cada hueso movido (en `out`) y
   * desplazamiento de la cadera respecto al reposo, en metros del personaje (en `hips`).
   * `inPlace` quita el avance por el suelo (queda el balanceo alrededor del sitio).
   */
  pose(t: number, out: Map<string, Quaternion>, hips: Vector3, inPlace = true): void {
    for (const b of this.#bones) {
      const w = this.#world.get(b)!;
      this.#sampleWorld(b, t, w);
      // Al marco del personaje y con la correccion de reposo del hueso.
      w.premultiply(this.#m).multiply(this.#mInv).premultiply(this.#face).multiply(this.#fix.get(b)!);
    }
    for (const b of this.#bones) {
      const parent = this.#parentDriven(b);
      const q = out.get(b) ?? new Quaternion();
      q.copy(this.#world.get(b)!);
      if (parent) q.premultiply(this.#b.copy(this.#world.get(parent)!).invert());
      out.set(b, q);
    }
    // El giro de la muñeca (palma arriba o abajo) no lo hace la muñeca sola: en un brazo real
    // lo reparte el antebrazo. Se pasa parte del giro de la mano al antebrazo (sin mover el
    // codo ni la mano: solo como gira el antebrazo sobre su eje).
    for (const side of ['left', 'right'] as const) {
      const axis = this.#forearm[side];
      const lower = out.get(`${side}LowerArm`);
      const hand = out.get(`${side}Hand`);
      if (!axis || !lower || !hand) continue;
      const d = hand.x * axis.x + hand.y * axis.y + hand.z * axis.z;
      const twist = this.#a.set(axis.x * d, axis.y * d, axis.z * d, hand.w);
      if (twist.lengthSq() < 1e-9) continue;
      twist.normalize();
      const part = this.#b.identity().slerp(twist, FOREARM_TWIST);
      lower.multiply(part);
      hand.premultiply(part.invert());
    }
    const clip = this.#clip;
    const f = Math.min(clip.frames - 1, Math.max(0, Math.round(t * clip.fps)));
    const px = (clip.p[f * 3]! - (inPlace ? clip.meanX : 0)) / 10000;
    const py = clip.p[f * 3 + 1]! / 10000;
    const pz = (clip.p[f * 3 + 2]! - (inPlace ? clip.meanZ : 0)) / 10000;
    hips.set(px, py, pz).applyQuaternion(this.#m).applyQuaternion(this.#face).multiplyScalar(this.#legLength);
  }

  #parentDriven(bone: string): string | null {
    let p = this.#rig.parents.get(bone) ?? null;
    while (p && !this.#world.has(p)) p = this.#rig.parents.get(p) ?? null;
    return p;
  }
}
