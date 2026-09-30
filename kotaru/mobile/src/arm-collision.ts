/**
 * Que los brazos no se metan dentro de la ropa ni del cuerpo (pedido del dueño, 2026-09-30:
 * «los brazos se pierden detras de la camisa y de la saya»). La captura de movimiento viene de
 * una persona real mas delgada que la ropa de los personajes (la falda de Luna, el short de
 * Nova), y los gestos de codigo tampoco sabian cuanto ocupa cada uno.
 *
 * 1. Al cargar, se mide el volumen real del personaje en reposo, a franjas de 3 cm de alto:
 *    los vertices de cuerpo y ropa (sin brazos ni pelo), vistos desde arriba, como una elipse
 *    por franja (delante, detras, izquierda y derecha, que no tienen por que ser simetricos).
 * 2. Tambien se mide el grosor de cada tramo del brazo con su manga (la de Luna es ancha):
 *    el eje del brazo tiene que quedar fuera del cuerpo al menos ese grosor.
 * 3. En cada cuadro, despues de todas las poses, se recorre el brazo por puntos (codo, mitad
 *    del antebrazo, muñeca, punta de la mano). Si alguno cae dentro, se gira
 *    su tramo lo justo para sacarlo: el brazo desde el hombro (siempre hacia su lado, nunca
 *    por detras del cuerpo), el antebrazo desde el codo y la mano desde la muñeca (la muñeca
 *    se dobla, como una mano apoyada sobre la falda).
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
  /**
   * Silueta real de la franja vista desde arriba: distancia maxima al centro en cada uno de
   * SECTORS angulos. Asi un lazo o un pecho por delante no ensanchan los costados (con una
   * elipse si: el brazo, pegado al costado, quedaba «dentro» y salia disparado).
   */
  sectors?: Float32Array;
  pts?: number[];
}

const SECTORS = 24;

const ARM_BONES = new Set<string>();
for (const side of ['left', 'right']) {
  for (const part of ['Shoulder', 'UpperArm', 'LowerArm', 'Hand']) ARM_BONES.add(`${side}${part}`);
  for (const f of ['Thumb', 'Index', 'Middle', 'Ring', 'Little']) for (const s of ['Metacarpal', 'Proximal', 'Intermediate', 'Distal']) ARM_BONES.add(`${side}${f}${s}`);
}

/** Perfil del cuerpo: franjas por altura en el espacio del modelo. */
export interface BodyProfile {
  readonly bands: ReadonlyMap<number, Readonly<Band>>;
  /** Grosor (radio, m) de cada tramo del brazo con su manga: upperArm, lowerArm, hand. */
  readonly radius?: Readonly<Record<'upperArm' | 'lowerArm' | 'hand', number>>;
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
  // Grosor del brazo: distancia de sus vertices al eje de su tramo (en reposo, en T).
  const seg = (a: VRMHumanBoneName, b: VRMHumanBoneName) => {
    const pa = pos(a);
    const pb = pos(b);
    return pa && pb ? { a: pa, b: pb } : null;
  };
  const segs: Record<string, { a: THREE.Vector3; b: THREE.Vector3 } | null> = {
    leftUpperArm: seg('leftUpperArm', 'leftLowerArm'),
    rightUpperArm: seg('rightUpperArm', 'rightLowerArm'),
    leftLowerArm: seg('leftLowerArm', 'leftHand'),
    rightLowerArm: seg('rightLowerArm', 'rightHand'),
  };
  const dists: Record<'upperArm' | 'lowerArm', number[]> = { upperArm: [], lowerArm: [] };
  const toSeg = (p: THREE.Vector3, sg: { a: THREE.Vector3; b: THREE.Vector3 }) => {
    const ab = sg.b.clone().sub(sg.a);
    const t = Math.max(0, Math.min(1, p.clone().sub(sg.a).dot(ab) / ab.lengthSq()));
    return p.distanceTo(sg.a.clone().addScaledVector(ab, t));
  };
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
      // Y si el brazo tira de el aunque sea un poco (la union de la manga con el cuerpo, que en
      // la pose en T sobresale hacia los lados), tampoco: ensancharia el costado.
      let best = 0;
      let bone = -1;
      let armPull = 0;
      for (let c = 0; c < 4; c++) {
        const w = skinWeight.getComponent(i, c);
        const bc = mesh.skeleton.bones[skinIndex.getComponent(i, c)];
        const hc = bc ? humanOf.get(bc) ?? nearestHuman(bc, humanOf) : null;
        if (w > 0 && hc && ARM_BONES.has(hc)) armPull += w;
        if (w > best) {
          best = w;
          bone = skinIndex.getComponent(i, c);
        }
      }
      const b = mesh.skeleton.bones[bone];
      const human = b ? humanOf.get(b) ?? nearestHuman(b, humanOf) : null;
      v.fromBufferAttribute(position, i);
      mesh.localToWorld(v);
      vrm.scene.worldToLocal(v);
      if (human && ARM_BONES.has(human)) {
        const sg = segs[human];
        if (sg) dists[human.endsWith('UpperArm') ? 'upperArm' : 'lowerArm'].push(toSeg(v, sg));
        continue;
      }
      if (v.y > top || armPull > 0.04) continue;
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
      (band.pts ??= []).push(l, f);
      bands.set(key, band);
    }
  });
  for (const band of bands.values()) {
    const cl = (band.minL + band.maxL) / 2;
    const cf = (band.minF + band.maxF) / 2;
    const sectors = new Float32Array(SECTORS);
    const pts = band.pts ?? [];
    for (let i = 0; i < pts.length; i += 2) {
      const dl = pts[i]! - cl;
      const df = pts[i + 1]! - cf;
      const k = sectorOf(Math.atan2(df, dl));
      sectors[k] = Math.max(sectors[k]!, Math.hypot(dl, df));
    }
    // Sectores sin vertices (huecos de la malla): el mayor de sus vecinos.
    for (let k = 0; k < SECTORS; k++) if (sectors[k] === 0) sectors[k] = Math.max(sectors[(k + 1) % SECTORS]!, sectors[(k + SECTORS - 1) % SECTORS]!);
    band.sectors = sectors;
    delete band.pts;
  }
  // Percentil 85: la manga entera menos pliegues sueltos. Con limites razonables.
  const pct = (xs: number[], fallback: number) => {
    if (xs.length < 20) return fallback;
    const sorted = xs.sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.85)]!;
  };
  const radius = {
    upperArm: Math.min(0.09, Math.max(0.035, pct(dists.upperArm, 0.045))),
    lowerArm: Math.min(0.08, Math.max(0.028, pct(dists.lowerArm, 0.035))),
    hand: 0.018,
  };
  return bands.size ? { bands, radius, up, left, fwd, origin: hips } : null;
}

function sectorOf(angle: number): number {
  return ((Math.round(((angle + Math.PI) / (2 * Math.PI)) * SECTORS) % SECTORS) + SECTORS) % SECTORS;
}

/** Radio del cuerpo en la direccion `angle` (interpolado entre sectores). */
function radiusAt(sectors: Float32Array, angle: number): number {
  const x = ((angle + Math.PI) / (2 * Math.PI)) * SECTORS;
  const k0 = ((Math.floor(x) % SECTORS) + SECTORS) % SECTORS;
  const k1 = (k0 + 1) % SECTORS;
  const t = x - Math.floor(x);
  return sectors[k0]! * (1 - t) + sectors[k1]! * t;
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
export function penetration(profile: BodyProfile, p: THREE.Vector3, out: THREE.Vector3, margin = MARGIN, side = 0): number {
  const y = profile.origin.y + p.dot(profile.up);
  const band = profile.bands.get(Math.floor(y / BAND));
  if (!band || band.n < 8) return 0;
  const l = p.dot(profile.left);
  const f = p.dot(profile.fwd);
  const cl = (band.minL + band.maxL) / 2;
  const cf = (band.minF + band.maxF) / 2;
  if (band.sectors) {
    const dl = l - cl;
    const df = f - cf;
    const r = Math.hypot(dl, df);
    const angle = Math.atan2(df, dl);
    const R = radiusAt(band.sectors, angle) + margin;
    if (r >= R) return 0;
    let nl = r > 1e-4 ? dl / r : side || 1;
    let nf = r > 1e-4 ? df / r : 0;
    if (side) {
      nl = side * Math.max(0.55, side * nl);
      nf = Math.max(nf, -0.3);
      const n = Math.hypot(nl, nf);
      nl /= n;
      nf /= n;
    }
    out.copy(profile.left).multiplyScalar(nl).add(profile.fwd.clone().multiplyScalar(nf)).normalize();
    return R - r;
  }
  const rl = (band.maxL - band.minL) / 2 + margin;
  const rf = (band.maxF - band.minF) / 2 + margin;
  const dl = (l - cl) / rl;
  const df = (f - cf) / rf;
  const d = Math.hypot(dl, df);
  if (d >= 1) return 0;
  // Salida radial desde el centro de la elipse (si esta justo en el centro, hacia fuera del lado del brazo).
  let nl = d > 1e-4 ? dl / d : side || 1;
  let nf = d > 1e-4 ? df / d : 0;
  // Con lado (el brazo): siempre hacia fuera por su lado, aunque el punto haya cruzado el
  // centro; nunca atravesando el cuerpo hacia atras o hacia el otro lado.
  if (side) {
    nl = side * Math.max(0.55, side * nl);
    nf = Math.max(nf, -0.3);
    const n = Math.hypot(nl, nf);
    nl /= n;
    nf /= n;
  }
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

  /**
   * `behind`: los brazos van a la espalda a proposito (Nova con las manos atras): el brazo
   * puede quedar por detras del cuerpo, no se empuja hacia su lado.
   */
  update(behind = 0): void {
    const root = this.#vrm.humanoid.normalizedHumanBonesRoot;
    const r = this.#profile.radius ?? { upperArm: 0.045, lowerArm: 0.035, hand: 0.018 };
    for (const side of ['left', 'right'] as const) {
      const upper = this.#bone(`${side}UpperArm`);
      const lower = this.#bone(`${side}LowerArm`);
      const hand = this.#bone(`${side}Hand`);
      const tip = this.#bone(`${side}MiddleProximal`) ?? hand;
      if (!upper || !lower || !hand || !tip) continue;
      const s = side === 'left' ? 1 : -1;
      const lateral = behind > 0.5 ? 0 : s;
      // Por tramos, del hombro a la mano; hasta 4 pasadas por si al sacar un punto entra otro.
      for (let pass = 0; pass < 4; pass++) {
        root.updateMatrixWorld(true);
        // Con las manos a la espalda, el brazo va pegado al costado a proposito: solo se
        // corrigen antebrazo y mano (si no, el brazo se abriria y las manos saldrian de detras).
        const armFree = behind < 0.3;
        // Del brazo, de media altura al codo: mas arriba, junto a la axila, el brazo toca el
        // costado (como en una persona) y empujarlo lo dejaria en cruz.
        const moved =
          (armFree && this.#push(upper, upper, lower, 0.65, Math.min(r.upperArm, 0.04), lateral)) ||
          (armFree && this.#push(upper, upper, lower, 1, Math.min(r.upperArm, 0.05), lateral)) ||
          this.#push(lower, lower, hand, 0.5, Math.min(r.lowerArm, 0.045), 0) ||
          this.#push(lower, lower, hand, 1, Math.min(r.lowerArm, 0.04), 0) ||
          this.#push(hand, hand, tip, 1.6, r.hand, 0);
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

  /**
   * El punto a la fraccion `at` del tramo from->to (1 = en `to`; mas de 1, pasado). Si esta
   * dentro del cuerpo (con el grosor `radius`), gira `pivot` para sacarlo. Devuelve si giro.
   */
  #push(pivot: THREE.Object3D, from: THREE.Object3D, to: THREE.Object3D, at: number, radius: number, side: number): boolean {
    const t = this.#tmp;
    const a = this.#model(from, t.a);
    const b = this.#model(to, t.b);
    const p = a.clone().lerp(b, at);
    const depth = penetration(this.#profile, p, t.dir, radius, side);
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
