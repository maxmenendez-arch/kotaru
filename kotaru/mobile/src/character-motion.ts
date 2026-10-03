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
import { errandAt, planErrand, type ErrandFrame, type ErrandPlan } from './errand.ts';
import { NovaPoses } from './nova-poses.ts';

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
export const LIBRARY: { idle: ClipSpec[]; talk: ClipSpec[]; walk: ClipSpec[]; actions: ActionSpec[] } = {
  // De pie esperando: peso en un pie, cambios de postura, manos que se acomodan (CMU 82_08, 40_11).
  idle: [{ file: 'idle-82_08' }, { file: 'idle-82_08-m' }, { file: 'idle-40_11' }, { file: 'idle-40_11-m' }],
  // Explicando algo con las manos en una conversacion (CMU 18_08).
  talk: [{ file: 'talk-18_08' }, { file: 'talk-18_08-m' }],
  // Caminar tranquilo (CMU 16_15), en el sitio: el avance lo pone el recado (errand.ts).
  walk: [{ file: 'walk-16_15' }],
  // Acciones sueltas de vez en cuando, estando tranquilo (CMU 79_38, 81_01, 79_24). Beber no
  // sale suelto (el vaso apareceria de la nada): solo dentro del recado de ir a por agua.
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

/**
 * Animaciones profesionales de Mixamo (Adobe; uso comercial libre de regalias), descargadas con
 * la cuenta del dueño y convertidas en el servidor (scripts/fbx-convert.mjs). No estan en el
 * repositorio: la publicacion (deploy/web.sh) las copia desde /var/lib/kotaru/mixamo-json. Si
 * no estan (en desarrollo), se usan las capturas de CMU de LIBRARY.
 */
export const MIXAMO: { idle: ClipSpec[]; talk: ClipSpec[]; actions: ActionSpec[] } = {
  // Tranquilos: solo el reposo mas quieto. Medidos (30-sep): «breathing» y «neutral» cabecean
  // 15 grados y mecen la cadera hasta 14 cm; «weight shift» 8 cm. «Standing» apenas 1 cm y 3 grados.
  idle: [{ file: 'mx-standing-idle' }],
  talk: [
    { file: 'mx-general-conversation' },
    { file: 'mx-asking-a-question-with-one-hand' },
    { file: 'mx-asking-a-question-with-two-hands' },
    { file: 'mx-talking-finding-something-funny' },
    { file: 'mx-having-a-chat-at-the-watercooler' },
  ],
  actions: [
    { file: 'mx-thinking-while-standing' },
    { file: 'mx-being-bashful-while-standing', only: ['luna', 'nova'] },
    { file: 'mx-laughing-standing' },
    { file: 'mx-thoughtfully-nodding-head-yes' },
    { file: 'mx-shoulder-shrug' },
    { file: 'mx-looking-off-into-the-distance' },
    { file: 'mx-big-yawn-while-standing' },
    { file: 'mx-greeting-while-standing' },
    { file: 'mx-blowing-a-kiss', only: ['nova'] },
    { file: 'mx-hands-on-hips-looking-over-shoulder', only: ['nova'] },
    { file: 'mx-right-hand-on-hip', only: ['nova', 'rio'] },
  ],
};

/** Una accion: su clip y, si lleva algo en la mano (el vaso), en cual. */
export interface ActionSpec extends ClipSpec {
  readonly prop?: 'glass';
  readonly hand?: 'leftHand' | 'rightHand';
  /** Solo estos personajes (si no, todos). */
  readonly only?: readonly string[];
}

/** Cuanto se cierran los dedos alrededor del vaso (rad por falange). */
const GRIP = 0.95;

/** Cada cuanto (s, estando tranquilo) hace una accion: al azar entre estos dos valores. */
export const ACTION_EVERY: readonly [number, number] = [22, 45];
/** Acciones sueltas al azar y el recado del agua: apagados (solo reacciones a la conversacion). */
const AUTO_EXTRAS = false;
/** Hablando, en cuantos turnos gesticula (en el resto habla tranquila). */
const TALK_GESTURE_SHARE = 0.15;
/** Huesos del tronco y cuanto de la postura del clip de reposo/charla se conserva (0-1). */
export const TORSO = new Set(['hips', 'spine', 'chest', 'upperChest']);
export const TORSO_KEEP = 0.3;
/**
 * Postura de cada personaje encima del reposo (radianes por hueso, x/y/z locales). Nova (2-oct,
 * mas sensual, con buen gusto): cadera ladeada y algo girada, el torso compensa y el cuello
 * inclina la cabeza; la silueta en S de una pose relajada y segura.
 */
export const POSTURE: Readonly<Record<string, Readonly<Record<string, readonly [number, number, number]>>>> = {
  nova: {
    hips: [0, 0.07, 0.06],
    spine: [0, -0.02, -0.035],
    chest: [0.02, -0.03, -0.03],
    upperChest: [0, -0.02, -0.015],
    neck: [0.02, 0, 0.035],
  },
  // Luna, timida y tranquila: la cabeza algo ladeada hacia el otro lado y el pecho recogido.
  luna: {
    chest: [0.015, 0, 0],
    neck: [0.01, 0, -0.03],
  },
  // Rio, seguro: pecho arriba, hombros abiertos, la cadera apenas girada.
  rio: {
    hips: [0, 0.03, 0],
    chest: [-0.025, 0, 0],
    upperChest: [-0.015, 0, 0],
  },
};
/** Minimo entre dos reacciones (ms): no encadena gestos. */
const REACTION_COOLDOWN_MS = 6000;

/** Reacciones posibles para lo que pasa en la conversacion (gesto del servidor o emocion). */
export function reactionOptions(companion: string, emotion: string | undefined, gesture: string | undefined): string[] {
  const nova = companion === 'nova';
  const girl = companion === 'luna' || nova;
  const laugh = 'mx-laughing-standing';
  const nod = 'mx-thoughtfully-nodding-head-yes';
  const think = 'mx-thinking-while-standing';
  const shrug = 'mx-shoulder-shrug';
  const shy = 'mx-being-bashful-while-standing';
  const hip = 'mx-right-hand-on-hip';
  switch (gesture) {
    case 'small_wave':
      return ['mx-greeting-while-standing'];
    case 'nod':
      return [nod];
    case 'shrug':
      return [shrug];
    case 'laugh_soft':
      return [laugh];
    case 'think_pose':
      return [think];
    default:
      break;
  }
  switch (emotion) {
    case 'happy':
      return [laugh, nod, ...(girl ? [shy] : [hip])];
    case 'warm':
      // Un piropo cae aqui (o en playful): varias respuestas para no repetir la misma.
      return girl ? [shy, nod, laugh, ...(nova ? ['mx-blowing-a-kiss', hip] : [])] : [nod, laugh, hip];
    case 'curious':
      return [think, 'mx-looking-off-into-the-distance', nod];
    case 'thoughtful':
      return [nod, think];
    case 'concerned':
      return [nod];
    case 'surprised':
      return [shrug, laugh];
    case 'playful':
      if (nova) return ['mx-blowing-a-kiss', 'mx-hands-on-hips-looking-over-shoulder', hip, laugh, shy];
      if (companion === 'rio') return [hip, laugh, shrug];
      return [shy, laugh, shrug];
    default:
      return [nod, shrug];
  }
}

/** Cuantas reacciones recientes no se repiten (ni la ultima ni la anterior). */
export const REACTION_MEMORY = 2;

/**
 * Elige la reaccion: nunca una de las ultimas `REACTION_MEMORY` (repetir la misma seguida se ve
 * falso). Si todas las posibles se acaban de hacer, mejor ninguna. `roll` 0-1. Puro (se prueba).
 */
export function reactionFor(companion: string, emotion: string | undefined, gesture: string | undefined, intensity: number, roll: number, recent: readonly string[] = []): string | null {
  if (intensity < 0.5 && (!gesture || gesture === 'none')) return null;
  // Neutral: solo a veces (la mayoria de respuestas normales no piden gesto).
  if ((!emotion || emotion === 'neutral') && (!gesture || gesture === 'none') && roll > 0.35) return null;
  const avoid = new Set(recent.slice(-REACTION_MEMORY));
  const options = reactionOptions(companion, emotion, gesture).filter((f) => !avoid.has(f));
  if (!options.length) return null;
  return options[Math.min(options.length - 1, Math.floor(roll * options.length))]!;
}

/** Todas las animaciones que se pueden ver en el modo muestrario (?muestrario=1). */
export function showcaseList(companion: string): string[] {
  const ok = (a: ActionSpec) => !a.only || a.only.includes(companion);
  return [...MIXAMO.idle.map((c) => c.file), ...MIXAMO.talk.map((c) => c.file), ...MIXAMO.actions.filter(ok).map((a) => a.file)];
}

function flagParam(name: string): boolean {
  try {
    return new URLSearchParams(window.location.search).get(name) === '1';
  } catch {
    return false;
  }
}
/** Cada cuanto (s de calma acumulada) va a por un vaso de agua: es largo, asi que de tarde en tarde. */
export const ERRAND_EVERY: readonly [number, number] = [110, 220];
/**
 * Llevar el vaso andando: el brazo derecho como en este instante del clip de beber (s), con el
 * vaso a la altura de la cintura (comprobado con capturas).
 */
export let CARRY_T = 0.6;
export function setCarryT(v: number): void {
  CARRY_T = v;
}
/** Sentido del giro del personaje (comprobado con capturas: + = hacia +x de la escena). */
export let YAW_SIGN = 1;
export function setYawSign(v: number): void {
  YAW_SIGN = v;
}
/**
 * Gesto de «un momento» (indice arriba, mano a la altura del hombro), en rotaciones de los
 * huesos normalizados del brazo derecho, como ARM_POSES de idle-body.
 */
export const WAIT_POSE = { upper: [0, 0.6, 1.25], lower: [0, -0.4, -2.35], hand: [0, 0, 0] } as { upper: number[]; lower: number[]; hand: number[] };

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
const ARM_OUT: Record<string, number> = { luna: 0.08, nova: 0.06, rio: 0.03 };
/** Y un poco hacia delante (rad): las manos quedan por delante de la falda, no dentro. */
const ARM_FWD: Record<string, number> = { luna: 0.1, nova: 0.08, rio: 0.03 };

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
  readonly #walkP = new MotionPlayer();
  readonly #walk: Loaded[] = [];
  #errand: { plan: ErrandPlan; t: number } | null = null;
  #errandCalm = 0;
  #nextErrand = ERRAND_EVERY[0] + Math.random() * (ERRAND_EVERY[1] - ERRAND_EVERY[0]);
  #carry = 0;
  readonly #carryPose = new Map<string, THREE.Quaternion>();
  readonly #rootPos: THREE.Vector3;
  readonly #rootYaw: number;
  #frame: ErrandFrame | null = null;
  readonly #eul = new THREE.Euler();
  /** Nova: poses naturales que mantiene y cambia despacio (nova-poses.ts). */
  readonly #poses: NovaPoses | null;
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
  readonly #tmpE = new THREE.Euler();
  #clock = 0;

  readonly #armOut: readonly [THREE.Quaternion, THREE.Quaternion];

  constructor(vrm: VRM, rest: RigRest, companion: string) {
    this.#vrm = vrm;
    // Eje hacia delante del modelo (de la cadera): girar sobre el abre el brazo hacia fuera.
    const up = rest.positions.get('spine')!.clone().sub(rest.positions.get('hips')!).normalize();
    const left = rest.positions.get('leftUpperLeg')!.clone().sub(rest.positions.get('rightUpperLeg')!).normalize();
    const fwd = new THREE.Vector3().crossVectors(left, up).normalize();
    // Sin poses de codigo ni desvios de brazo: solo las animaciones de Mixamo (pedido del dueño,
    // 30-sep 23:18). Las poses de Nova (nova-poses.ts) quedan para pruebas.
    this.#poses = companion === 'nova' && flagParam('poses') ? new NovaPoses(vrm, { up, left, fwd }) : null;
    this.#companion = companion;
    const a = 0;
    const f = 0;
    void ARM_OUT;
    void ARM_FWD;
    // Hacia delante: giro sobre el eje lateral (el mismo sentido para los dos brazos).
    const forward = new THREE.Quaternion().setFromAxisAngle(left, FWD_SIGN * f);
    this.#armOut = [forward.clone().multiply(new THREE.Quaternion().setFromAxisAngle(fwd, -a)), forward.clone().multiply(new THREE.Quaternion().setFromAxisAngle(fwd, a))];
    const hips = vrm.humanoid.getNormalizedBoneNode('hips');
    this.#hipsBase = hips ? hips.position.clone() : null;
    this.#rootPos = vrm.scene.position.clone();
    this.#rootYaw = vrm.scene.rotation.y;
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
    const mine = (list: readonly ActionSpec[]) => list.filter((a) => !a.only || a.only.includes(companion));
    // Primero las de Mixamo; si no estan publicadas, las capturas de CMU de siempre.
    void Promise.all([load(MIXAMO.idle, this.#idle), load(MIXAMO.talk, this.#talk), load(mine(MIXAMO.actions), this.#actions as Loaded[])])
      .then(async (): Promise<void> => {
        if (this.#idle.length) await Promise.all([load(LIBRARY.walk, this.#walk), load(LIBRARY.actions.filter((x) => x.prop), this.#actions as Loaded[])]);
        else await Promise.all([load(LIBRARY.idle, this.#idle), load(LIBRARY.talk, this.#talk), load(LIBRARY.walk, this.#walk), load(LIBRARY.actions, this.#actions as Loaded[])]);
      })
      .then(() => {
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
      // Un solo clip en la lista: en bucle, sin fundirse a nada entre vuelta y vuelta.
      loop: loop || list.length === 1,
      fadeIn: 1.1,
      fadeOut: 1.1,
      randomStart: true,
      ...(pick.spec.from !== undefined ? { from: pick.spec.from } : {}),
      ...(pick.spec.to !== undefined ? { to: pick.spec.to } : {}),
      ...(pick.spec.rate !== undefined ? { rate: pick.spec.rate } : {}),
    });
  }

  /** Cuanto manda una pose de Nova (0-1): el choque de brazos la deja estar. */
  /**
   * Cuantas reacciones (o animaciones del muestrario) han empezado: el visor lo mira para
   * mandar al camarografo a un primer plano. `actionLength`: lo que dura la actual (s).
   */
  get reactions(): number {
    return this.#reactions;
  }

  /** Cuanto manda ahora la accion (0-1, con sus fundidos). */
  get actionWeight(): number {
    return this.#act.weight;
  }

  /** Archivo de la accion en curso (para elegir el plano del camarografo), o null. */
  get actionName(): string | null {
    return this.#action?.spec.file ?? null;
  }

  get actionLength(): number {
    return this.#action?.clip.duration ?? 0;
  }

  /** Hay una accion o un recado en curso (la cabeza no se endereza del todo). */
  get acting(): boolean {
    return this.#act.weight > 0.05 || this.#errand !== null;
  }

  get posed(): number {
    return this.#poses?.weight ?? 0;
  }

  #reacting = false;
  #companion = '';
  #lastAffectAt = -1;
  #lastReaction = -1e9;
  readonly #recentReactions: string[] = [];
  #reactions = 0;
  #wasSpeaking = false;
  #talkTurn = false;

  /** Reacciona a la conversacion con una animacion (si toca y no hay otra en curso). */
  #react(input: { still: boolean; noActions?: boolean; affect?: { emotion?: string; gesture?: string; intensity?: number; at: number } | null }): void {
    const a = input.affect;
    if (!a || a.at === this.#lastAffectAt || input.still || input.noActions) return;
    this.#lastAffectAt = a.at;
    const now = performance.now();
    if (this.#errand || this.#action || now - this.#lastReaction < REACTION_COOLDOWN_MS) return;
    const file = reactionFor(this.#companion, a.emotion, a.gesture, a.intensity ?? 0, Math.random(), this.#recentReactions);
    const clip = file && this.#actions.find((x) => x.spec.file === file);
    if (!clip) return;
    this.#lastReaction = now;
    this.#recentReactions.push(clip.spec.file);
    if (this.#recentReactions.length > 4) this.#recentReactions.shift();
    this.#reacting = true;
    this.#reactions += 1;
    this.#startAction(clip);
  }

  /** Hacer una accion ya (pruebas y shorts); por nombre de archivo o la primera que empiece asi. */
  act(prefix: string): boolean {
    if (this.#poses && prefix.startsWith('pose-')) return this.#poses.force(prefix.slice(5));
    if (this.#poses && prefix.startsWith('gesture-')) return this.#poses.force(prefix.slice(8));
    if (prefix === 'errand' || prefix === 'errand-left') return this.#startErrand(prefix === 'errand-left' ? -1 : 1);
    const found = [...this.#actions, ...this.#talk, ...this.#idle].find((a) => a.spec.file.startsWith(prefix)) as (Loaded & { readonly spec: ActionSpec }) | undefined;
    if (!found) return false;
    if (this.#action) this.#act.stop(this.#action.spec.file);
    this.#startAction(found);
    this.#reactions += 1;
    return true;
  }

  /** Recado de ir a por agua (errand.ts). Hace falta el clip de caminar y el de beber. */
  #startErrand(dir?: 1 | -1): boolean {
    const walk = this.#walk[0];
    const drink = this.#actions.find((a) => a.spec.file === 'act-drink-79_38');
    if (!walk?.clip.walkSpeed || !drink) return false;
    const side = dir ?? (Math.random() < 0.5 ? 1 : -1);
    const speed = walk.clip.walkSpeed * walk.retarget.legLength;
    this.#errand = { plan: planErrand(side, speed, drink.clip.duration), t: 0 };
    // Brazo de llevar el vaso: una pose del propio clip de beber.
    const hipsTmp = new THREE.Vector3();
    drink.retarget.pose(CARRY_T, this.#carryPose, hipsTmp);
    const hand = this.#vrm.humanoid.getRawBoneNode('rightHand');
    if (hand) placeGlass(this.#glass, hand, this.#vrm, 'rightHand');
    if (this.#action) this.#act.stop(this.#action.spec.file);
    this.#action = null;
    return true;
  }

  /**
   * Durante el recado: donde esta el personaje respecto a su sitio y hacia donde mira, para la
   * voz (pan y lejania) y la mirada. null si esta en su sitio.
   */
  get errand(): ErrandFrame | null {
    return this.#frame;
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
    input: {
      speaking: boolean;
      still: boolean;
      arm: { side: 'left' | 'right' | null; weight: number };
      busy?: boolean;
      noActions?: boolean;
      /** Ultima emocion o gesto de la conversacion: dispara una reaccion (reactionFor). */
      affect?: { emotion?: string; gesture?: string; intensity?: number; at: number } | null;
    },
  ): void {
    if (!this.#ready) return;
    // Acciones de vez en cuando, solo con el personaje tranquilo; hablar o escuchar las corta.
    const calm = !input.speaking && !input.busy && !input.still && !input.noActions;
    this.#calm = calm ? this.#calm + dt : 0;
    if (calm) this.#errandCalm += dt;
    // El recado sigue aunque le hablen o conteste (no interfiere con escuchar); solo lo cortan
    // reducir movimiento y los shorts.
    if (this.#errand && (input.still || input.noActions)) this.#endErrand();
    if (AUTO_EXTRAS && calm && !this.#errand && !this.#action && this.#errandCalm > this.#nextErrand && this.#startErrand()) {
      this.#errandCalm = 0;
      this.#nextErrand = ERRAND_EVERY[0] + Math.random() * (ERRAND_EVERY[1] - ERRAND_EVERY[0]);
    }
    this.#react(input);
    if (!calm && this.#action && !this.#errand && !this.#reacting) {
      this.#act.stop(this.#action.spec.file);
      this.#action = null;
    }
    const loose = this.#actions.filter((a) => !a.spec.prop);
    if (AUTO_EXTRAS && calm && !this.#action && !this.#errand && this.#calm > this.#nextAction && loose.length) {
      this.#startAction(loose[Math.floor(Math.random() * loose.length)]!);
      this.#nextAction = ACTION_EVERY[0] + Math.random() * (ACTION_EVERY[1] - ACTION_EVERY[0]);
      this.#calm = 0;
    }
    if (this.#action && !this.#act.isPlaying(this.#action.spec.file) && this.#act.weight < 0.001) {
      this.#action = null;
      this.#reacting = false;
    }
    this.#weight += ((input.still ? 0 : 1) - this.#weight) * Math.min(1, dt * 2);
    if (this.#weight < 0.001) return;
    // Hablando: casi siempre tranquila (reposo); de vez en cuando con gestos de conversacion.
    if (input.speaking && !this.#wasSpeaking) this.#talkTurn = Math.random() < TALK_GESTURE_SHARE;
    this.#wasSpeaking = input.speaking;
    const want = input.speaking && this.#talkTurn && this.#talk.length ? 'talk' : 'idle';
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
      // Tronco: la postura propia del personaje (recta) manda; del clip solo queda un tercio
      // de su inclinacion, lo justo para que respire y no se quede de palo (30-sep: Luna
      // empezaba derecha y luego se echaba hacia delante).
      node.quaternion.slerp(TORSO.has(name) ? this.#tmpQ.identity().slerp(q, TORSO_KEEP) : q, w);
      // Brazos algo separados del cuerpo (ver ARM_OUT), en el espacio del hombro. En una accion
      // no: la mano tiene que llegar a la boca o al pelo.
      const k = w * (1 - A);
      if (name === 'leftUpperArm') node.quaternion.premultiply(this.#tmpQ.identity().slerp(this.#armOut[0], k));
      if (name === 'rightUpperArm') node.quaternion.premultiply(this.#tmpQ.identity().slerp(this.#armOut[1], k));
    }
    // Postura propia del personaje sobre el reposo: Nova en contrapposto (el peso en una
    // cadera, el torso compensando, un hombro algo adelantado), con un vaiven lento.
    // Respiracion visible (2-oct): el pecho se abre y los hombros suben un pelo, ~14 veces por
    // minuto; el reposo de Mixamo, amortiguado, casi no la mostraba.
    this.#clock += dt;
    {
      const b = Math.sin(this.#clock * ((2 * Math.PI) / 4.3));
      const inhale = (b + 1) / 2;
      const k = W * (1 - A);
      const turn = (bone: string, x: number, z: number) => {
        const node = this.#vrm.humanoid.getNormalizedBoneNode(bone as VRMHumanBoneName);
        if (node) node.quaternion.multiply(this.#tmpQ.setFromEuler(this.#tmpE.set(x * k, 0, z * k)));
      };
      turn('chest', -0.012 * inhale, 0);
      turn('upperChest', -0.01 * inhale, 0);
      turn('leftShoulder', 0, 0.018 * inhale);
      turn('rightShoulder', 0, -0.018 * inhale);
    }
    const lean = POSTURE[this.#companion];
    if (lean) {
      const sway = 1 + 0.25 * Math.sin(this.#clock * 0.55);
      const k = W * (1 - A) * sway;
      for (const [bone, [x, y, z]] of Object.entries(lean)) {
        const node = this.#vrm.humanoid.getNormalizedBoneNode(bone as VRMHumanBoneName);
        if (node) node.quaternion.multiply(this.#tmpQ.setFromEuler(this.#tmpE.set(x * k, y * k, z * k)));
      }
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
      hips.position.lerp(new THREE.Vector3().copy(this.#hipsBase).addScaledVector(this.#player.hips, TORSO_KEEP), W);
      if (A > 0.001) hips.position.lerp(new THREE.Vector3().copy(this.#hipsBase).add(this.#act.hips), A);
    }
    // Nova: la pose manda en brazos, torso y cabeza (salvo en el recado del agua y las acciones).
    this.#poses?.update(dt, !this.#errand && !this.#action && !input.still && !input.noActions);
    const errandGlass = this.#errandFrame(dt, W);
    // El vaso: aparece y se va con la accion de beber; los dedos de esa mano lo rodean.
    const holding = errandGlass ? 'rightHand' : this.#action?.spec.prop === 'glass' ? this.#action.spec.hand : null;
    if (holding) this.#grip = holding;
    if (this.#grip) {
      const side = this.#grip === 'leftHand' ? 'left' : 'right';
      const sign = side === 'left' ? -1 : 1;
      const g = errandGlass ? 1 : holding ? A : 0;
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
    const showGlass = errandGlass || (holding !== null && A > 0.02);
    this.#glass.visible = showGlass;
    if (showGlass) for (const m of this.#glassMaterials) m.opacity = (m.userData['base'] as number) * (errandGlass ? 1 : Math.min(1, A * 1.4));
  }

  #endErrand(): void {
    this.#errand = null;
    this.#frame = null;
    this.#walkP.stop('walk');
    this.#carry = 0;
    this.#vrm.scene.position.copy(this.#rootPos);
    this.#vrm.scene.rotation.y = this.#rootYaw;
    if (this.#action?.spec.prop) {
      this.#act.stop(this.#action.spec.file);
      this.#action = null;
    }
  }

  /** Un cuadro del recado (si hay): andar, llevar el vaso, beber, el gesto. true si lleva el vaso. */
  #errandFrame(dt: number, W: number): boolean {
    const e = this.#errand;
    if (!e) return false;
    e.t += dt;
    const f = errandAt(e.plan, e.t);
    if (f.step === 'done') {
      this.#endErrand();
      return false;
    }
    this.#frame = f;
    const bone = (name: string) => this.#vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
    // Andar: el clip de caminar (en el sitio) manda sobre todo el cuerpo, cabeza incluida (mira
    // hacia donde va), segun cuanto anda.
    const walk = this.#walk[0];
    if (walk && f.walk > 0) this.#walkP.play('walk', walk.retarget, walk.clip.duration, { loop: true, fadeIn: 0.25, fadeOut: 0.4 });
    if (f.walk <= 0) this.#walkP.stop('walk');
    this.#walkP.update(dt);
    const WW = f.walk * this.#walkP.weight * this.#weight;
    if (WW > 0.001) {
      for (const [name, q] of this.#walkP.pose) {
        const node = bone(name);
        if (node) node.quaternion.slerp(q, name === 'neck' || name === 'head' ? WW * 0.9 : WW);
      }
      const hips = bone('hips');
      if (hips && this.#hipsBase) hips.position.lerp(new THREE.Vector3().copy(this.#hipsBase).add(this.#walkP.hips), WW);
    }
    // Beber: el clip de beber, ya con el vaso en la mano (lo trajo andando).
    if (f.step === 'drink' && !this.#action) {
      const drink = this.#actions.find((a) => a.spec.file === 'act-drink-79_38');
      if (drink) {
        this.#action = drink;
        this.#act.play(drink.spec.file, drink.retarget, drink.clip.duration, { fadeIn: 0.6, fadeOut: 0.7 });
      }
    }
    if (f.step !== 'drink' && this.#action?.spec.prop) {
      this.#act.stop(this.#action.spec.file);
      this.#action = null;
    }
    // Llevar el vaso: brazo derecho doblado, vaso a la altura de la cintura (mientras no bebe).
    const carrying = f.glass === 'carry';
    this.#carry += ((carrying ? 1 : 0) - this.#carry) * Math.min(1, dt * 5);
    const C = this.#carry * (1 - this.#act.weight) * this.#weight;
    if (C > 0.001) {
      for (const name of ['rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand']) {
        const q = this.#carryPose.get(name);
        const node = bone(name);
        if (q && node) node.quaternion.slerp(q, C);
      }
    }
    // «Un momento»: indice arriba con la mano derecha, los demas dedos recogidos.
    if (f.gesture > 0.001) {
      const g = f.gesture * this.#weight;
      const set = (name: string, r: number[]) => {
        const node = bone(name);
        if (!node) return;
        this.#tmpQ.setFromEuler(this.#eul.set(r[0]!, r[1]!, r[2]!));
        node.quaternion.slerp(this.#tmpQ, g);
      };
      set('rightUpperArm', WAIT_POSE.upper);
      set('rightLowerArm', WAIT_POSE.lower);
      set('rightHand', WAIT_POSE.hand);
      for (const fg of ['Index', 'Middle', 'Ring', 'Little']) {
        for (const [seg, k] of [['Proximal', 1], ['Intermediate', 1.1], ['Distal', 0.7]] as const) {
          const node = bone(`right${fg}${seg}`);
          if (node) node.rotation.z = node.rotation.z * (1 - g) + (fg === 'Index' ? 0 : 1.35 * k) * g;
        }
      }
      const thumb = bone('rightThumbDistal');
      if (thumb) thumb.rotation.y = thumb.rotation.y * (1 - g) + 0.6 * g;
    }
    // Donde esta: se mueve y se gira el personaje entero.
    void W;
    this.#vrm.scene.position.set(this.#rootPos.x + f.x, this.#rootPos.y, this.#rootPos.z + f.z);
    this.#vrm.scene.rotation.y = this.#rootYaw + YAW_SIGN * f.yaw;
    return f.glass !== 'none';
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
