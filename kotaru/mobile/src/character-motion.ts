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
export const LIBRARY: { idle: ClipSpec[]; talk: ClipSpec[] } = {
  // De pie esperando: peso en un pie, cambios de postura, manos que se acomodan (CMU 82_08, 40_11).
  idle: [{ file: 'idle-82_08' }, { file: 'idle-82_08-m' }, { file: 'idle-40_11' }, { file: 'idle-40_11-m' }],
  // Explicando algo con las manos en una conversacion (CMU 18_08).
  talk: [{ file: 'talk-18_08' }, { file: 'talk-18_08-m' }],
};

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
  readonly #hipsBase: THREE.Vector3 | null;
  #mode: 'idle' | 'talk' | null = null;
  #current: string | null = null;
  #ready = false;
  #weight = 0;
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
    void Promise.all([load(LIBRARY.idle, this.#idle), load(LIBRARY.talk, this.#talk)]).then(() => {
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

  /**
   * Un cuadro. `speaking`: habla (gestos capturados); `arm`: gesto de brazo en curso (ese brazo
   * lo lleva idle-body); `still`: reducir movimiento (sin captura).
   */
  update(dt: number, input: { speaking: boolean; still: boolean; arm: { side: 'left' | 'right' | null; weight: number } }): void {
    if (!this.#ready) return;
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
    const W = this.#weight * this.#player.weight;
    for (const [name, q] of this.#player.pose) {
      const node = this.#vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
      if (!node) continue;
      let w = W;
      if (input.arm.side && input.arm.weight > 0 && name.startsWith(input.arm.side) && /Shoulder|Arm|Hand/.test(name)) w *= 1 - input.arm.weight;
      node.quaternion.slerp(q, w);
      // Brazos algo separados del cuerpo (ver ARM_OUT), en el espacio del hombro.
      if (name === 'leftUpperArm') node.quaternion.premultiply(this.#tmpQ.identity().slerp(this.#armOut[0], w));
      if (name === 'rightUpperArm') node.quaternion.premultiply(this.#tmpQ.identity().slerp(this.#armOut[1], w));
    }
    const hips = this.#vrm.humanoid.getNormalizedBoneNode('hips');
    if (hips && this.#hipsBase) {
      hips.position.lerp(new THREE.Vector3().copy(this.#hipsBase).add(this.#player.hips), W);
    }
  }
}
