/**
 * El "short" de presentacion de cada personaje en la pantalla de elegir: una secuencia de
 * planos de camara (ojos, cara, busto, cintura, cuerpo entero) con cortes, movimientos
 * lentos de camara y lo que hace el personaje en cada plano (hablar, emocion, gesto, mirar
 * a otro lado, saludar con la mano).
 *
 * No es un video grabado: se dibuja en vivo con el modelo 3D real, en su escenario. Pesa
 * menos que un video, siempre coincide con el personaje y no cuesta generarlo. Puro (sin
 * three.js) para poder probarlo.
 */
import type { CompanionId } from './companions';
import type { ArmAction } from './idle-body.ts';

/** `selfie`: el propio personaje sostiene el movil (Nova): cerca, desde arriba, gran angular. */
export type Focus = 'eyes' | 'face' | 'bust' | 'waist' | 'full' | 'selfie';

export interface CamKey {
  readonly focus: Focus;
  /** Giro alrededor del personaje en radianes (0 = de frente; + = desde su izquierda). */
  readonly yaw: number;
  /** Altura de la camara respecto al punto mirado, por metro de distancia (+ = desde arriba). */
  readonly pitch?: number;
  /** Solo selfie: distancia del movil a la cara (m; el brazo da ~0,35-0,6). */
  readonly dist?: number;
  /** Solo selfie: inclinacion del movil (radianes, + hacia su izquierda). */
  readonly roll?: number;
}

export type Look = 'camera' | 'away' | 'up';

export interface Shot {
  /** Duracion en segundos. */
  readonly dur: number;
  readonly from: CamKey;
  readonly to: CamKey;
  /** Habla (la boca se mueve) durante el plano. */
  readonly talk?: boolean;
  /** Emocion de la cara al empezar el plano (EMOTIONS de @kotaru/ai-contracts). */
  readonly emotion: string;
  /** Gesto de cabeza y cuerpo al empezar el plano (GESTURES). */
  readonly gesture?: string;
  readonly look?: Look;
  /** Accion de brazo: saludar con la mano (atajo de `arm: 'wave'`). */
  readonly wave?: boolean;
  /** Gesto de brazo durante el plano: saludar, señalar, mano en la barbilla o al pecho. */
  readonly arm?: ArmAction;
}

/** Puntos del modelo que sirven de referencia (alturas en metros, en el mundo). */
export interface Anchors {
  readonly headY: number;
  /** Altura de los ojos (si el modelo no tiene huesos de ojos, cabeza + 6 cm). */
  readonly eyeY: number;
  /** Donde esta el personaje en x y z (normalmente 0, 0). */
  readonly x: number;
  readonly z: number;
  /** Profundidad de los ojos (la cara esta ~8 cm por delante del hueso de la cabeza). */
  readonly eyeZ: number;
}

export interface ReelCamera {
  readonly fov: number;
  /** Giro de la camara sobre su eje (radianes): el movil inclinado del selfie. */
  readonly roll?: number;
  readonly position: readonly [number, number, number];
  readonly target: readonly [number, number, number];
}

export interface ReelCue {
  readonly index: number;
  /** Segundos desde que empezo este plano. */
  readonly age: number;
  readonly shot: Shot;
}

const FOV = 30;

/** Alto visible (m) y punto mirado de cada tipo de plano. */
function focusFrame(focus: Focus, a: Anchors): { span: number; y: number; z: number } {
  const top = a.headY + 0.11;
  switch (focus) {
    case 'eyes':
      // Ojos y boca: lo bastante lejos para que el flequillo no tape la camara.
      return { span: 0.2, y: a.eyeY - 0.025, z: a.eyeZ };
    case 'face':
      return { span: 0.36, y: a.headY + 0.02, z: (a.z + a.eyeZ) / 2 };
    case 'bust':
      return { span: 0.66, y: a.headY - 0.14, z: a.z };
    case 'waist':
      return { span: 1.05, y: a.headY - 0.36, z: a.z };
    case 'full':
      // De los pies a la cabeza con aire arriba y abajo.
      return { span: top * 1.12, y: top / 2, z: a.z };
    case 'selfie':
      // La camara la pone reelCamera (distancia del brazo); aqui solo el punto mirado: la cara.
      return { span: 0.4, y: a.eyeY - 0.04, z: a.eyeZ };
  }
}

/**
 * Distancia para que quepa el alto `span` con el angulo vertical dado; en pantallas muy
 * estrechas (telefono en vertical) tambien debe caber de ancho: medio cuerpo mide ~0,5 del
 * alto visible de ancho.
 */
function distanceFor(span: number, aspect: number): number {
  const half = Math.tan(((FOV / 2) * Math.PI) / 180);
  const byHeight = span / 2 / half;
  // Como minimo 18 cm de ancho: los dos ojos enteros (antes, en vertical, el plano de los
  // ojos dejaba solo uno, la nariz y la boca).
  const byWidth = Math.max(span * 0.5, 0.18) / 2 / (half * Math.max(0.3, aspect));
  return Math.max(byHeight, byWidth);
}

function smooth(x: number): number {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

function keyCamera(key: CamKey, a: Anchors, aspect: number): { pos: [number, number, number]; target: [number, number, number] } {
  const { span, y, z } = focusFrame(key.focus, a);
  const d = distanceFor(span, aspect);
  const pitch = key.pitch ?? 0.04;
  return {
    pos: [a.x + Math.sin(key.yaw) * d, y + pitch * d, z + Math.cos(key.yaw) * d],
    target: [a.x, y, z],
  };
}

export function reelDuration(shots: readonly Shot[]): number {
  return shots.reduce((s, x) => s + x.dur, 0);
}

/** Que plano toca en el segundo `t` (la secuencia se repite). */
export function reelCue(shots: readonly Shot[], t: number): ReelCue {
  const total = reelDuration(shots);
  let at = ((t % total) + total) % total;
  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i]!;
    if (at < shot.dur || i === shots.length - 1) return { index: i, age: at, shot };
    at -= shot.dur;
  }
  return { index: 0, age: 0, shot: shots[0]! };
}

/**
 * Brillo del short en el segundo `t` (1 = normal). Solo al volver a empezar el bucle (del
 * ultimo plano al primero) pasa un instante por casi negro, como un fundido de trailer: ese
 * salto, de cuerpo entero a un primer plano de los ojos, era el unico corte que se notaba
 * brusco. Tambien hace de fundido de entrada al abrir el perfil. Los cortes de dentro siguen
 * secos.
 */
export function reelFade(shots: readonly Shot[], t: number, width = 0.35): number {
  const total = reelDuration(shots);
  const at = ((t % total) + total) % total;
  const d = Math.min(at, total - at);
  return d >= width ? 1 : 0.15 + 0.85 * smooth(d / width);
}

/**
 * Camara en el segundo `t`: dentro de cada plano se desliza despacio de `from` a `to`
 * (suavizado); entre planos, corte seco, como en un trailer. La distancia y la altura se
 * interpolan en el espacio del plano para que el movimiento sea un arco alrededor del
 * personaje, no una linea recta que lo atraviese.
 */
export function reelCamera(shots: readonly Shot[], t: number, a: Anchors, aspect: number): ReelCamera {
  const { shot, age } = reelCue(shots, t);
  const k = smooth(age / shot.dur);
  if (shot.from.focus === 'selfie') return selfieCamera(shot, k, t, a);
  const from = focusFrame(shot.from.focus, a);
  const to = focusFrame(shot.to.focus, a);
  const span = lerp(from.span, to.span, k);
  const y = lerp(from.y, to.y, k);
  const z = lerp(from.z, to.z, k);
  const yaw = lerp(shot.from.yaw, shot.to.yaw, k);
  const pitch = lerp(shot.from.pitch ?? 0.04, shot.to.pitch ?? 0.04, k);
  const d = distanceFor(span, aspect);
  // Camara en mano tambien en Luna y Rio (2-oct): un pulso suave proporcional a la distancia.
  const hx = d * (0.004 * Math.sin(t * 1.3) + 0.002 * Math.sin(t * 3.7 + 0.8));
  const hy = d * (0.003 * Math.sin(t * 1.1 + 1.9) + 0.0015 * Math.sin(t * 4.1));
  return {
    fov: FOV,
    roll: 0.006 * Math.sin(t * 0.9 + 0.4),
    position: [a.x + Math.sin(yaw) * d + hx, y + pitch * d + hy, z + Math.cos(yaw) * d],
    target: [a.x + hx * 0.3, y, z],
  };
}

/** Angulo vertical de la camara frontal de un movil en vertical (~26 mm). */
export const SELFIE_FOV = 60;

/**
 * Selfie: el movil en la mano del personaje, a la distancia del brazo, un poco por encima de
 * los ojos y mirando hacia abajo, inclinado, con el pulso de una mano que lo sostiene.
 */
function selfieCamera(shot: Shot, k: number, t: number, a: Anchors): ReelCamera {
  const d = lerp(shot.from.dist ?? 0.55, shot.to.dist ?? 0.55, k);
  const yaw = lerp(shot.from.yaw, shot.to.yaw, k);
  const pitch = lerp(shot.from.pitch ?? 0.3, shot.to.pitch ?? 0.3, k);
  const roll = lerp(shot.from.roll ?? 0, shot.to.roll ?? 0, k);
  // Pulso: unos milimetros y algo de giro, lento (la mano no tiembla, se mece).
  const hx = 0.006 * Math.sin(t * 1.9) + 0.003 * Math.sin(t * 4.3 + 1.1);
  const hy = 0.005 * Math.sin(t * 1.4 + 0.6) + 0.002 * Math.sin(t * 5.1);
  const hr = 0.018 * Math.sin(t * 1.1 + 0.3);
  // Se mira un poco por debajo de los ojos: la cara arriba del cuadro, con hombros y fondo.
  const ty = a.eyeY - 0.1;
  const tz = a.eyeZ;
  return {
    fov: SELFIE_FOV,
    roll: roll + hr,
    position: [a.x + Math.sin(yaw) * d + hx, ty + pitch * d + hy, tz + Math.cos(yaw) * d],
    target: [a.x + hx * 0.5, ty, tz],
  };
}

/** Camara del inicio de un plano (para pruebas y para el primer cuadro). */
export function shotStart(shot: Shot, a: Anchors, aspect: number): { pos: [number, number, number]; target: [number, number, number] } {
  return keyCamera(shot.from, a, aspect);
}

/**
 * Volumen simulado de voz mientras "habla" en el short: silabas de ~80 ms agrupadas en
 * palabras con pausas cortas, para que la boca no se mueva como un metronomo.
 */
export function reelVoice(age: number): number {
  const word = Math.sin(age * 3.1) * 0.5 + 0.5;
  const syllable = Math.abs(Math.sin(age * 12.5));
  const pause = Math.sin(age * 1.3 + 0.7) > -0.55 ? 1 : 0.1;
  return (0.25 + 0.45 * syllable * (0.4 + 0.6 * word)) * pause;
}

/**
 * Guiones de cada personaje (~14 s en bucle). Cada uno cuenta su caracter:
 * Luna, calma y confianza (planos lentos, casi de frente); Nova, coqueteo (angulos bajos
 * y laterales, miradas que se van y vuelven, sonrisa); Rio, energia al aire libre
 * (cuerpo entero mirando el paisaje, risa, saludo con la mano).
 */
export const REELS: Readonly<Record<CompanionId, readonly Shot[]>> = {
  luna: [
    { dur: 2.4, from: { focus: 'eyes', yaw: 0.12 }, to: { focus: 'eyes', yaw: 0.03 }, emotion: 'warm' },
    { dur: 3.0, from: { focus: 'face', yaw: -0.34 }, to: { focus: 'face', yaw: -0.2 }, talk: true, emotion: 'warm', gesture: 'nod' },
    { dur: 3.2, from: { focus: 'full', yaw: 0.3 }, to: { focus: 'full', yaw: 0.16 }, emotion: 'thoughtful', look: 'away' },
    { dur: 3.0, from: { focus: 'bust', yaw: 0.02 }, to: { focus: 'bust', yaw: -0.06 }, talk: true, emotion: 'warm', gesture: 'tilt_head', arm: 'chest' },
    { dur: 2.8, from: { focus: 'full', yaw: -0.22 }, to: { focus: 'full', yaw: -0.06 }, emotion: 'happy', wave: true },
  ],
  // Nova se graba a si misma con el movil (selfie): cerca, desde arriba, inclinado, mirando
  // a la camara; el brazo izquierdo sostiene el movil. Cada plano cambia de distancia o lado.
  nova: [
    { dur: 3.0, from: { focus: 'selfie', yaw: 0.05, dist: 0.62, roll: 0.06 }, to: { focus: 'selfie', yaw: -0.02, dist: 0.58, roll: 0.03 }, talk: true, emotion: 'playful', arm: 'selfie' },
    { dur: 2.8, from: { focus: 'selfie', yaw: 0.3, dist: 0.55, pitch: 0.38, roll: 0.12 }, to: { focus: 'selfie', yaw: 0.22, dist: 0.52, pitch: 0.36, roll: 0.1 }, emotion: 'playful', gesture: 'tilt_head', arm: 'selfie' },
    { dur: 3.0, from: { focus: 'selfie', yaw: -0.08, dist: 0.72, pitch: 0.42, roll: -0.04 }, to: { focus: 'selfie', yaw: -0.14, dist: 0.75, pitch: 0.45, roll: -0.06 }, talk: true, emotion: 'happy', gesture: 'laugh_soft', arm: 'selfie' },
    { dur: 2.6, from: { focus: 'selfie', yaw: -0.28, dist: 0.5, pitch: 0.24, roll: -0.1 }, to: { focus: 'selfie', yaw: -0.2, dist: 0.48, pitch: 0.22, roll: -0.08 }, emotion: 'warm', look: 'away', arm: 'selfie' },
    { dur: 2.8, from: { focus: 'selfie', yaw: 0.12, dist: 0.6, roll: 0.05 }, to: { focus: 'selfie', yaw: 0.04, dist: 0.56, roll: 0.02 }, talk: true, emotion: 'playful', gesture: 'lean_in', arm: 'selfie' },
  ],
  rio: [
    // Plano medio mirando el paisaje (antes cuerpo entero señalando: lo mostraba demasiado).
    { dur: 2.8, from: { focus: 'waist', yaw: 0.42 }, to: { focus: 'waist', yaw: 0.28 }, emotion: 'curious', look: 'away' },
    { dur: 2.4, from: { focus: 'face', yaw: -0.26 }, to: { focus: 'face', yaw: -0.1 }, talk: true, emotion: 'happy', gesture: 'laugh_soft' },
    // El unico plano entero: el saludo (con la postura capturada ya no parece un muñeco).
    { dur: 2.4, from: { focus: 'full', yaw: -0.16 }, to: { focus: 'full', yaw: -0.28 }, emotion: 'happy', wave: true },
    { dur: 2.8, from: { focus: 'bust', yaw: 0.32, pitch: -0.1 }, to: { focus: 'bust', yaw: 0.18 }, talk: true, emotion: 'playful', gesture: 'nod' },
    { dur: 2.2, from: { focus: 'eyes', yaw: 0.08 }, to: { focus: 'eyes', yaw: 0 }, emotion: 'happy' },
  ],
};
