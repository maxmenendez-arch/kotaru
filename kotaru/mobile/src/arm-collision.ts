/**
 * Que los brazos no se metan dentro de la ropa ni del cuerpo (pedido del dueño, 2026-09-30:
 * «los brazos se pierden detras de la camisa y de la saya»). La captura de movimiento viene de
 * una persona real mas delgada que la ropa de los personajes (la falda de Luna, el short de
 * Nova), y los gestos de codigo tampoco sabian cuanto ocupa cada uno.
 *
 * 1. Al cargar, se mide el volumen real del personaje en reposo, a franjas de 3 cm de alto:
 *    los vertices de cuerpo y ropa (sin brazos ni pelo), vistos desde arriba, como una elipse
 *    por franja (delante, detras, izquierda y derecha, que no tienen por que ser simetricos).
 * 2. En cada cuadro, despues de todas las poses, se miran el codo, la muñeca y la punta de la
 *    mano. Si alguno cae dentro de su franja (mas un margen), se gira el brazo desde el hombro
 *    (o el antebrazo desde el codo) lo justo para sacarlo hacia fuera, en la direccion mas
 *    corta. Asi las manos quedan apoyadas sobre la falda, no dentro.
 */
import * as THREE from 'three';
import type { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';

const BAND = 0.03;
const MARGIN = 0.025;

interface Band {
  /** Extremos en el eje lateral (izquierda +) y en el frontal (delante +), metros. */
  minL: number;
  maxL: number;
  minF: number;
  maxF: number;
  n: number;
}

const ARM_BONES = new Set<string>();
for (const side of ['left', 'right']) {
  for (const part of ['Shoulder', 'UpperArm', 'LowerArm', 'Hand']) ARM_BONES.add(`${side}${part}`);
  for (const f of ['Thumb', 'Index', 'Middle', 'Ring', 'Little']) for (const s of ['Metacarpal', 'Proximal', 'Intermediate', 'Distal']) ARM_BONES.add(`${side}${f}${s}`);
}

/** Perfil del cuerpo: franjas por altura en el espacio del modelo. */
export interface BodyProfile {
  readonly bands: ReadonlyMap<number, Readonly<Band>>;
  readonly up: THREE.Vector3;
  readonly left: THREE.Vector3;
  readonly fwd: THREE.Vector3;
  readonly origin: THREE.Vector3;
}

/** Mide el cuerpo en reposo (llamar antes de cambiar la pose). */
export function measureBody(vrm: VRM): BodyProfile | null {
  const pos = (b: VRMHumanBoneName) => {
    const n = vrm.humanoid.getNormalizedBoneNode(b);
    return n ? vrm.scene.worldToLocal(n.getWorldPosition(new THREE.Vector3())) : null;
  };
  const hips = pos('hips');
  const spine = pos('spine');
  const lLeg = pos('leftUpperLeg');
  const rLeg = pos('rightUpperLeg');
  const neck = pos('neck');
  if (!hips || !spine || !lLeg || !rLeg || !neck) return null;
  const up = spine.clone().sub(hips).normalize();
  const left = lLeg.clone().sub(rLeg).normalize();
  const fwd = new THREE.Vector3().crossVectors(left, up).normalize();
  // Nombre humanoide de cada hueso real (para saber que vertices son de los brazos).
  const humanOf = new Map<THREE.Object3D, string>();
  for (const name of Object.keys(vrm.humanoid.humanBones)) {
    const raw = vrm.humanoid.getRawBoneNode(name as VRMHumanBoneName);
    if (raw) humanOf.set(raw, name);
  }
  const bands = new Map<number, Band>();
  const top = neck.y - 0.04;
  vrm.scene.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  vrm.scene.traverse((o) => {
    const mesh = o as THREE.SkinnedMesh;
    if (!mesh.isSkinnedMesh) return;
    const geo = mesh.geometry;
    const position = geo.getAttribute('position');
    const skinIndex = geo.getAttribute('skinIndex');
    const skinWeight = geo.getAttribute('skinWeight');
    if (!position || !skinIndex || !skinWeight) return;
    // Vertices del pelo (y de la cara): fuera, por su material.
    const skip = new Uint8Array(position.count);
    const materials = ([] as THREE.Material[]).concat(mesh.material);
    const index = geo.getIndex();
    const groups = geo.groups.length ? geo.groups : [{ start: 0, count: index ? index.count : position.count, materialIndex: 0 }];
    for (const g of groups) {
      const name = (materials[g.materialIndex ?? 0]?.name ?? '').toUpperCase();
      if (!/HAIR|FACE|EYE/.test(name)) continue;
      for (let k = g.start; k < g.start + g.count; k++) skip[index ? index.getX(k) : k] = 1;
    }
    for (let i = 0; i < position.count; i++) {
      if (skip[i]) continue;
      // Hueso que mas pesa en el vertice: si es del brazo o la mano, no es cuerpo.
      let best = 0;
      let bone = -1;
      for (let c = 0; c < 4; c++) {
        const w = skinWeight.getComponent(i, c);
        if (w > best) {
          best = w;
          bone = skinIndex.getComponent(i, c);
        }
      }
      const b = mesh.skeleton.bones[bone];
      const human = b ? humanOf.get(b) ?? nearestHuman(b, humanOf) : null;
      if (human && ARM_BONES.has(human)) continue;
      v.fromBufferAttribute(position, i);
      mesh.localToWorld(v);
      vrm.scene.worldToLocal(v);
      if (v.y > top) continue;
      const key = Math.floor(v.y / BAND);
      const rel = v.clone().sub(hips);
      const l = rel.dot(left);
      const f = rel.dot(fwd);
      const band = bands.get(key) ?? { minL: l, maxL: l, minF: f, maxF: f, n: 0 };
      band.minL = Math.min(band.minL, l);
      band.maxL = Math.max(band.maxL, l);
      band.minF = Math.min(band.minF, f);
      band.maxF = Math.max(band.maxF, f);
      band.n++;
      bands.set(key, band);
    }
  });
  return bands.size ? { bands, up, left, fwd, origin: hips } : null;
}

function nearestHuman(bone: THREE.Object3D, humanOf: Map<THREE.Object3D, string>): string | null {
  let p: THREE.Object3D | null = bone.parent;
  while (p) {
    const h = humanOf.get(p);
    if (h) return h;
    p = p.parent;
  }
  return null;
}

/**
 * Cuanto esta dentro un punto (espacio del modelo, relativo a la cadera en reposo): > 0 si esta
 * dentro, con la direccion para salir (en el plano horizontal). Puro: se prueba sin modelo.
 */
export function penetration(profile: BodyProfile, p: THREE.Vector3, out: THREE.Vector3): number {
  const y = profile.origin.y + p.dot(profile.up);
  const band = profile.bands.get(Math.floor(y / BAND));
  if (!band || band.n < 8) return 0;
  const l = p.dot(profile.left);
  const f = p.dot(profile.fwd);
  const cl = (band.minL + band.maxL) / 2;
  const cf = (band.minF + band.maxF) / 2;
  const rl = (band.maxL - band.minL) / 2 + MARGIN;
  const rf = (band.maxF - band.minF) / 2 + MARGIN;
  const dl = (l - cl) / rl;
  const df = (f - cf) / rf;
  const d = Math.hypot(dl, df);
  if (d >= 1) return 0;
  // Salida radial desde el centro de la elipse (si esta justo en el centro, hacia fuera del lado del brazo).
  const nl = d > 1e-4 ? dl / d : 1;
  const nf = d > 1e-4 ? df / d : 0;
  out.copy(profile.left).multiplyScalar(nl * rl).add(profile.fwd.clone().multiplyScalar(nf * rf)).normalize();
  // Distancia aproximada hasta el borde (m).
  return (1 - d) * Math.hypot(nl * rl, nf * rf);
}

/** Corrige los brazos del modelo en el cuadro actual (despues de todas las poses). */
export class ArmCollider {
  readonly #vrm: VRM;
  readonly #profile: BodyProfile;
  readonly #tmp = {
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    axis: new THREE.Vector3(),
    q: new THREE.Quaternion(),
    pq: new THREE.Quaternion(),
    inv: new THREE.Matrix4(),
    sq: new THREE.Quaternion(),
  };

  constructor(vrm: VRM, profile: BodyProfile) {
    this.#vrm = vrm;
    this.#profile = profile;
  }

  update(): void {
    const root = this.#vrm.humanoid.normalizedHumanBonesRoot;
    for (const side of ['left', 'right'] as const) {
      const upper = this.#bone(`${side}UpperArm`);
      const lower = this.#bone(`${side}LowerArm`);
      const hand = this.#bone(`${side}Hand`);
      const tip = this.#bone(`${side}MiddleProximal`) ?? hand;
      if (!upper || !lower || !hand || !tip) continue;
      // Hasta 3 pasadas: codo y muñeca desde el hombro; la punta de la mano desde el codo.
      for (let pass = 0; pass < 3; pass++) {
        root.updateMatrixWorld(true);
        const moved = this.#push(upper, lower) || this.#push(upper, hand) || this.#push(lower, tip);
        if (!moved) break;
      }
    }
  }

  #bone(name: string): THREE.Object3D | null {
    return this.#vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
  }

  /** Espacio del modelo (el de la escena del VRM), relativo a la cadera en reposo. */
  #model(node: THREE.Object3D, out: THREE.Vector3): THREE.Vector3 {
    node.getWorldPosition(out);
    this.#vrm.scene.worldToLocal(out);
    return out.sub(this.#profile.origin);
  }

  /** Si `point` esta dentro del cuerpo, gira `pivot` para sacarlo. Devuelve si giro. */
  #push(pivot: THREE.Object3D, point: THREE.Object3D): boolean {
    const t = this.#tmp;
    const p = this.#model(point, t.a);
    const depth = penetration(this.#profile, p, t.dir);
    if (depth <= 0) return false;
    const c = this.#model(pivot, t.b);
    const arm = p.clone().sub(c);
    const len = arm.length();
    if (len < 1e-3) return false;
    // Giro en el espacio del modelo que lleva el punto hacia fuera la profundidad necesaria.
    t.axis.crossVectors(arm, t.dir);
    if (t.axis.lengthSq() < 1e-8) return false;
    t.axis.normalize();
    const angle = Math.min(0.35, (depth + 0.005) / len);
    t.q.setFromAxisAngle(t.axis, angle);
    // Al espacio del padre del hueso: local' = inv(padre) * giro * padre * local.
    const parent = pivot.parent!;
    parent.getWorldQuaternion(t.pq);
    this.#vrm.scene.getWorldQuaternion(t.sq);
    t.pq.premultiply(t.sq.invert()); // padre en el espacio del modelo
    const toLocal = t.pq.clone().invert().multiply(t.q).multiply(t.pq);
    pivot.quaternion.premultiply(toLocal);
    return true;
  }
}
