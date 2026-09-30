/**
 * Movimiento capturado de cada personaje (mocap.ts + motion-player.ts) conectado al modelo VRM:
 * carga los clips, elige la base segun el momento (de pie en reposo o hablando con las manos) y
 * lo aplica sobre el movimiento de codigo, respetando los gestos de brazo y la mirada.
 *
 * Los clips estan en /motions/*.json (se cargan despues del modelo, sin bloquear; si fallan, el
 * personaje sigue con el movimiento de codigo). Se puede apagar con ?mocap=0.
 */
import * as THREE from 'three';
import type { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';
import { parseClip, Retarget, type MotionClip, type MotionClipJson, type RigRest } from './mocap.ts';
import { MotionPlayer } from './motion-player.ts';

interface ClipSpec {
  readonly file: string;
  /** Tramo util del clip (s): se recorta lo que no sirve (arranques, pasos fuera de sitio). */
  readonly from?: number;
  readonly to?: number;
  readonly rate?: number;
}

/** Que clips usa cada momento. De pie: reposo real con cambios de peso; hablando: gestos. */
// Cada clip tiene su version en espejo (-m): el doble de variedad y el peso pasa de un pie
// al otro. Solo tramos en los que la persona esta en su sitio (sin pasos ni giros grandes).
export const LIBRARY: { idle: ClipSpec[]; talk: ClipSpec[]; actions: ActionSpec[] } = {
  // De pie esperando: peso en un pie, cambios de postura, manos que se acomodan (CMU 82_08, 40_11).
  idle: [{ file: 'idle-82_08' }, { file: 'idle-82_08-m' }, { file: 'idle-40_11' }, { file: 'idle-40_11-m' }],
  // Explicando algo con las manos en una conversacion (CMU 18_08).
  talk: [{ file: 'talk-18_08' }, { file: 'talk-18_08-m' }],
  // Acciones sueltas de vez en cuando, estando tranquilo (CMU 79_38, 81_01, 79_24).
  actions: [
    { file: 'act-drink-79_38', prop: 'glass', hand: 'rightHand' },
    { file: 'act-drink-79_38-m', prop: 'glass', hand: 'leftHand' },
    { file: 'act-hair-81_01' },
    { file: 'act-hair-81_01-m' },
    // Arreglarse la ropa: abrocharse y alisar la camisa a la altura del pecho.
    { file: 'act-adjust-79_24' },
    { file: 'act-adjust-79_24-m' },
  ],
};

/** Una accion: su clip y, si lleva algo en la mano (el vaso), en cual. */
export interface ActionSpec extends ClipSpec {
  readonly prop?: 'glass';
  readonly hand?: 'leftHand' | 'rightHand';
}

/** Cuanto se cierran los dedos alrededor del vaso (rad por falange). */
const GRIP = 0.95;

/** Cada cuanto (s, estando tranquilo) hace una accion: al azar entre estos dos valores. */
export const ACTION_EVERY: readonly [number, number] = [22, 45];

const cache = new Map<string, Promise<MotionClip | null>>();

export function loadClip(file: string): Promise<MotionClip | null> {
  let p = cache.get(file);
  if (!p) {
    p = fetch(`/motions/${file}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<MotionClipJson>) : null))
      .then((j) => (j ? parseClip(j) : null))
      .catch(() => null);
    cache.set(file, p);
  }
  return p;
}

/** Esqueleto de reposo del modelo (llamar ANTES de cambiar su pose). */
export function rigRest(vrm: VRM): RigRest {
  const positions = new Map<string, THREE.Vector3>();
  const parents = new Map<string, string | null>();
  const nameOf = new Map<THREE.Object3D, string>();
  vrm.scene.updateMatrixWorld(true);
  const humanBones = vrm.humanoid.humanBones as Partial<Record<VRMHumanBoneName, unknown>>;
  for (const name of Object.keys(humanBones) as VRMHumanBoneName[]) {
    const node = vrm.humanoid.getNormalizedBoneNode(name);
    if (!node) continue;
    nameOf.set(node, name);
    positions.set(name, vrm.scene.worldToLocal(node.getWorldPosition(new THREE.Vector3())));
  }
  for (const [node, name] of nameOf) {
    let p = node.parent;
    while (p && !nameOf.has(p)) p = p.parent;
    parents.set(name, p ? nameOf.get(p)! : null);
  }
  return { positions, parents };
}

interface Loaded {
  readonly spec: ClipSpec;
  readonly clip: MotionClip;
  readonly retarget: Retarget;
}

/**
 * Cuanto se separan los brazos del cuerpo (rad) respecto a la captura: la persona capturada era
 * mas delgada que la ropa de los personajes, y las manos atravesaban la falda (Luna) o el short
 * (Nova). Se abren un poco hacia fuera, mas cuanto mas ancha es la ropa.
 */
const ARM_OUT: Record<string, number> = { luna: 0.2, nova: 0.14, rio: 0.08 };
/** Y un poco hacia delante (rad): las manos quedan por delante de la falda, no dentro. */
const ARM_FWD: Record<string, number> = { luna: 0.3, nova: 0.2, rio: 0.08 };

/** Sentido del giro «hacia delante» (comprobado con capturas). */
export let FWD_SIGN = -1;
export function setFwdSign(v: number): void {
  FWD_SIGN = v;
}

export class CharacterMotion {
  readonly #player = new MotionPlayer();
  readonly #vrm: VRM;
  readonly #idle: Loaded[] = [];
  readonly #talk: Loaded[] = [];
  readonly #actions: (Loaded & { readonly spec: ActionSpec })[] = [];
  readonly #act = new MotionPlayer();
  #action: (Loaded & { readonly spec: ActionSpec }) | null = null;
  #calm = 0;
  #nextAction = ACTION_EVERY[0] + Math.random() * (ACTION_EVERY[1] - ACTION_EVERY[0]);
  readonly #glass: THREE.Group;
  readonly #glassMaterials: THREE.Material[];
  readonly #hipsBase: THREE.Vector3 | null;
  #mode: 'idle' | 'talk' | null = null;
  #current: string | null = null;
  #ready = false;
  #weight = 0;
  #grip: 'leftHand' | 'rightHand' | null = null;
  readonly #fingerRest = new Map<THREE.Object3D, number>();
  readonly #tmpQ = new THREE.Quaternion();

  readonly #armOut: readonly [THREE.Quaternion, THREE.Quaternion];

  constructor(vrm: VRM, rest: RigRest, companion: string) {
    this.#vrm = vrm;
    // Eje hacia delante del modelo (de la cadera): girar sobre el abre el brazo hacia fuera.
    const up = rest.positions.get('spine')!.clone().sub(rest.positions.get('hips')!).normalize();
    const left = rest.positions.get('leftUpperLeg')!.clone().sub(rest.positions.get('rightUpperLeg')!).normalize();
    const fwd = new THREE.Vector3().crossVectors(left, up).normalize();
    const a = ARM_OUT[companion] ?? 0.1;
    const f = ARM_FWD[companion] ?? 0.1;
    // Hacia delante: giro sobre el eje lateral (el mismo sentido para los dos brazos).
    const forward = new THREE.Quaternion().setFromAxisAngle(left, FWD_SIGN * f);
    this.#armOut = [forward.clone().multiply(new THREE.Quaternion().setFromAxisAngle(fwd, -a)), forward.clone().multiply(new THREE.Quaternion().setFromAxisAngle(fwd, a))];
    const hips = vrm.humanoid.getNormalizedBoneNode('hips');
    this.#hipsBase = hips ? hips.position.clone() : null;
    const load = async (specs: readonly ClipSpec[], into: Loaded[]) => {
      for (const spec of specs) {
        const clip = await loadClip(spec.file);
        if (clip) into.push({ spec, clip, retarget: new Retarget(clip, rest) });
      }
    };
    const glass = makeGlass();
    this.#glass = glass.group;
    this.#glassMaterials = glass.materials;
    this.#glass.visible = false;
    void Promise.all([load(LIBRARY.idle, this.#idle), load(LIBRARY.talk, this.#talk), load(LIBRARY.actions, this.#actions as Loaded[])]).then(() => {
      this.#ready = this.#idle.length > 0;
    });
  }

  get ready(): boolean {
    return this.#ready;
  }

  #start(list: Loaded[], name: string, loop: boolean): void {
    // Otro distinto del que suena (si hay mas de uno): que no se repita el mismo gesto.
    const options = list.length > 1 ? list.filter((l) => `${name}:${l.spec.file}` !== this.#current) : list;
    const pick = options[Math.floor(Math.random() * options.length)]!;
    const key = `${name}:${pick.spec.file}`;
    if (this.#current && this.#current !== key) this.#player.stop(this.#current);
    this.#current = key;
    this.#player.play(key, pick.retarget, pick.clip.duration, {
      loop,
      fadeIn: 1.1,
      fadeOut: 1.1,
      randomStart: true,
      ...(pick.spec.from !== undefined ? { from: pick.spec.from } : {}),
      ...(pick.spec.to !== undefined ? { to: pick.spec.to } : {}),
      ...(pick.spec.rate !== undefined ? { rate: pick.spec.rate } : {}),
    });
  }

  /** Hacer una accion ya (pruebas y shorts); por nombre de archivo o la primera que empiece asi. */
  act(prefix: string): boolean {
    const found = this.#actions.find((a) => a.spec.file.startsWith(prefix));
    if (!found) return false;
    this.#startAction(found);
    return true;
  }

  #startAction(a: Loaded & { readonly spec: ActionSpec }): void {
    this.#action = a;
    this.#act.play(a.spec.file, a.retarget, a.clip.duration, { fadeIn: 0.7, fadeOut: 0.8 });
    // El vaso va en la mano de la accion (el hueso real, que es el que se dibuja).
    if (a.spec.prop === 'glass' && a.spec.hand) {
      const hand = this.#vrm.humanoid.getRawBoneNode(a.spec.hand);
      if (hand) placeGlass(this.#glass, hand, this.#vrm, a.spec.hand);
    }
  }

  /**
   * Un cuadro. `speaking`: habla (gestos capturados); `arm`: gesto de brazo en curso (ese brazo
   * lo lleva idle-body); `still`: reducir movimiento (sin captura); `busy`: escucha o piensa
   * (sin acciones sueltas); `noActions`: nunca acciones (shorts).
   */
  update(
    dt: number,
    input: { speaking: boolean; still: boolean; arm: { side: 'left' | 'right' | null; weight: number }; busy?: boolean; noActions?: boolean },
  ): void {
    if (!this.#ready) return;
    // Acciones de vez en cuando, solo con el personaje tranquilo; hablar o escuchar las corta.
    const calm = !input.speaking && !input.busy && !input.still && !input.noActions;
    this.#calm = calm ? this.#calm + dt : 0;
    if (!calm && this.#action) {
      this.#act.stop(this.#action.spec.file);
      this.#action = null;
    }
    if (calm && !this.#action && this.#calm > this.#nextAction && this.#actions.length) {
      this.#startAction(this.#actions[Math.floor(Math.random() * this.#actions.length)]!);
      this.#nextAction = ACTION_EVERY[0] + Math.random() * (ACTION_EVERY[1] - ACTION_EVERY[0]);
      this.#calm = 0;
    }
    if (this.#action && !this.#act.isPlaying(this.#action.spec.file) && this.#act.weight < 0.001) this.#action = null;
    this.#weight += ((input.still ? 0 : 1) - this.#weight) * Math.min(1, dt * 2);
    if (this.#weight < 0.001) return;
    const want = input.speaking && this.#talk.length ? 'talk' : 'idle';
    // Un clip tras otro (al azar, nunca el mismo dos veces seguidas), con fundido entre ellos.
    const ending = this.#current !== null && this.#player.remaining(this.#current) < 1.2;
    if (want !== this.#mode || ending) {
      this.#mode = want;
      this.#start(want === 'talk' ? this.#talk : this.#idle, want, false);
    }
    this.#player.update(dt);
    this.#act.update(dt);
    const W = this.#weight * this.#player.weight;
    // La accion va encima de la base y manda del todo mientras dura (con sus fundidos).
    const A = this.#weight * this.#act.weight;
    const armMask = (name: string, w: number) =>
      input.arm.side && input.arm.weight > 0 && name.startsWith(input.arm.side) && /Shoulder|Arm|Hand/.test(name) ? w * (1 - input.arm.weight) : w;
    for (const [name, q] of this.#player.pose) {
      if (name === 'neck' || name === 'head') continue;
      const node = this.#vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
      if (!node) continue;
      const w = armMask(name, W);
      node.quaternion.slerp(q, w);
      // Brazos algo separados del cuerpo (ver ARM_OUT), en el espacio del hombro. En una accion
      // no: la mano tiene que llegar a la boca o al pelo.
      const k = w * (1 - A);
      if (name === 'leftUpperArm') node.quaternion.premultiply(this.#tmpQ.identity().slerp(this.#armOut[0], k));
      if (name === 'rightUpperArm') node.quaternion.premultiply(this.#tmpQ.identity().slerp(this.#armOut[1], k));
    }
    if (A > 0.001) {
      for (const [name, q] of this.#act.pose) {
        const node = this.#vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
        if (!node) continue;
        // Cuello y cabeza acompañan (echar la cabeza atras al beber), sin quitar del todo la mirada.
        node.quaternion.slerp(q, armMask(name, name === 'neck' || name === 'head' ? A * 0.85 : A));
      }
    }
    const hips = this.#vrm.humanoid.getNormalizedBoneNode('hips');
    if (hips && this.#hipsBase) {
      hips.position.lerp(new THREE.Vector3().copy(this.#hipsBase).add(this.#player.hips), W);
      if (A > 0.001) hips.position.lerp(new THREE.Vector3().copy(this.#hipsBase).add(this.#act.hips), A);
    }
    // El vaso: aparece y se va con la accion de beber; los dedos de esa mano lo rodean.
    const holding = this.#action?.spec.prop === 'glass' ? this.#action.spec.hand : null;
    if (holding) this.#grip = holding;
    if (this.#grip) {
      const side = this.#grip === 'leftHand' ? 'left' : 'right';
      const sign = side === 'left' ? -1 : 1;
      const g = holding ? A : 0;
      for (const f of ['Index', 'Middle', 'Ring', 'Little']) {
        for (const [seg, k] of [['Proximal', 1], ['Intermediate', 1.1], ['Distal', 0.7]] as const) {
          const node = this.#vrm.humanoid.getNormalizedBoneNode(`${side}${f}${seg}` as VRMHumanBoneName);
          if (!node) continue;
          if (!this.#fingerRest.has(node)) this.#fingerRest.set(node, node.rotation.z);
          node.rotation.z = this.#fingerRest.get(node)! + sign * GRIP * k * g;
        }
      }
      if (!holding && A < 0.001) this.#grip = null;
    }
    const showGlass = holding !== null && A > 0.02;
    this.#glass.visible = showGlass;
    if (showGlass) for (const m of this.#glassMaterials) m.opacity = (m.userData['base'] as number) * Math.min(1, A * 1.4);
  }
}

/** Vaso de agua sencillo (cristal y agua), en metros. */
function makeGlass(): { group: THREE.Group; materials: THREE.Material[] } {
  const group = new THREE.Group();
  group.name = 'kotaru-glass';
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xe8f4ff, transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0, depthWrite: false, side: THREE.DoubleSide });
  glassMat.userData['base'] = 0.35;
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x8fc8f0, transparent: true, opacity: 0.55, roughness: 0.1, depthWrite: false });
  waterMat.userData['base'] = 0.55;
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.028, 0.11, 24, 1, true), glassMat);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.028, 24).rotateX(-Math.PI / 2).translate(0, -0.055, 0), glassMat);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.027, 0.07, 24), waterMat);
  water.position.y = -0.018;
  group.add(wall, bottom, water);
  group.renderOrder = 5;
  return { group, materials: [glassMat, waterMat] };
}

/**
 * Pone el vaso en la mano: entre el pulgar y los dedos, con su eje hacia el pulgar (como se
 * sujeta un vaso). Se calcula con la mano en reposo del propio modelo.
 */
function placeGlass(glass: THREE.Group, hand: THREE.Object3D, vrm: VRM, side: 'leftHand' | 'rightHand'): void {
  const prefix = side === 'leftHand' ? 'left' : 'right';
  const local = (bone: VRMHumanBoneName) => {
    const node = vrm.humanoid.getRawBoneNode(bone);
    return node ? hand.worldToLocal(node.getWorldPosition(new THREE.Vector3())) : null;
  };
  const finger = local(`${prefix}MiddleProximal` as VRMHumanBoneName) ?? new THREE.Vector3(side === 'leftHand' ? 0.08 : -0.08, 0, 0);
  const index = local(`${prefix}IndexProximal` as VRMHumanBoneName) ?? finger.clone().add(new THREE.Vector3(0, 0, 0.02));
  const little = local(`${prefix}LittleProximal` as VRMHumanBoneName) ?? finger.clone().add(new THREE.Vector3(0, 0, -0.02));
  const f = finger.clone().normalize();
  // Un vaso se sujeta con los nudillos a lo largo de el: su eje va del meñique al indice.
  const across = index.clone().sub(little);
  const axis = across.sub(f.clone().multiplyScalar(across.dot(f))).normalize();
  const palm = new THREE.Vector3().crossVectors(f, axis).normalize().multiplyScalar(GLASS_PALM * (side === 'leftHand' ? -1 : 1));
  // Dentro de la mano: a la altura de los nudillos, hacia la palma (lo que mide el vaso de radio).
  glass.position.copy(finger).multiplyScalar(0.6).add(palm.multiplyScalar(0.045));
  glass.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  glass.scale.setScalar(1 / Math.max(1e-6, hand.getWorldScale(new THREE.Vector3()).x));
  hand.add(glass);
  glass.traverse((o) => {
    o.layers.mask = hand.layers.mask;
    o.frustumCulled = false;
  });
}

/** Lado de la palma (comprobado con capturas). */
export let GLASS_PALM = -1;
export function setGlassPalm(v: number): void {
  GLASS_PALM = v;
}
