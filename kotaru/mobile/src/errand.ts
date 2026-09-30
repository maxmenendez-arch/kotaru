/**
 * «Espera, ya regreso»: el personaje va a por un vaso de agua fuera de cuadro y vuelve
 * (pedido del dueño, 2026-09-30: que el vaso no aparezca de la nada en la mano).
 *
 * Guion: hace el gesto de «un momento» con el indice, se gira y sale andando hacia un lado del
 * cuarto (un poco hacia el fondo), pasa unos segundos fuera (coge el vaso de una mesa), vuelve
 * con el vaso, se pone de frente, bebe, vuelve a salir a dejarlo y regresa.
 *
 * Aqui solo esta el plan en el tiempo (puro, sin three.js: se prueba solo). character-motion
 * lo convierte en poses (andar, beber, el gesto) y posicion; la voz se mueve con el
 * personaje (pan y lejania: audio.web).
 */

export type ErrandStep = 'wait' | 'turnOut' | 'out' | 'away' | 'in' | 'turnFront' | 'drink' | 'done';

export interface ErrandFrame {
  readonly step: ErrandStep;
  /** Segundos dentro del paso y su fraccion (0-1). */
  readonly age: number;
  readonly k: number;
  /** Posicion del personaje respecto a su sitio (m): x a su lado, z hacia la camara. */
  readonly x: number;
  readonly z: number;
  /** Giro sobre si mismo (rad; 0 = de frente a la camara; + hacia +x). */
  readonly yaw: number;
  /** Cuanto anda (0-1): el clip de caminar. */
  readonly walk: number;
  /** Gesto de «un momento» (0-1). */
  readonly gesture: number;
  /** El vaso: no esta, lo lleva en la mano, o esta bebiendo. */
  readonly glass: 'none' | 'carry' | 'drink';
  /** Para la voz: -1 (izquierda de la pantalla) a 1, y lejania 0 (en su sitio) a 1 (fuera). */
  readonly pan: number;
  readonly far: number;
  /** Mirada hacia donde anda en vez de a la camara (0-1). */
  readonly lookAhead: number;
}

export interface ErrandPlan {
  /** Hacia que lado sale: +1 o -1 (x de la escena). */
  readonly dir: 1 | -1;
  /** Velocidad al andar (m/s): la del clip de caminar en este personaje (sin patinar). */
  readonly speed: number;
  /** Cuanto dura el trago (el clip de beber, s). */
  readonly drink: number;
  /** A donde va (m): de lado y un poco hacia el fondo. */
  readonly target: { readonly x: number; readonly z: number };
  readonly steps: readonly { readonly step: ErrandStep; readonly dur: number; readonly trip: 1 | 2 }[];
}

export const ERRAND = {
  /** Gesto de «un momento». */
  wait: 1.6,
  /** Girar para salir o para ponerse de frente. */
  turn: 0.8,
  /** Fuera de cuadro: coger el vaso / dejarlo. */
  fetch: 3.2,
  leave: 1.6,
  /** Hasta donde anda (m, de lado; y hacia el fondo). */
  side: 2.1,
  back: 0.6,
} as const;

export function planErrand(dir: 1 | -1, speed: number, drink: number): ErrandPlan {
  const target = { x: dir * ERRAND.side, z: -ERRAND.back };
  const walk = Math.hypot(target.x, target.z) / Math.max(0.3, speed);
  const trip = (n: 1 | 2, away: number) =>
    [
      { step: 'turnOut' as const, dur: ERRAND.turn, trip: n },
      { step: 'out' as const, dur: walk * 0.96, trip: n },
      { step: 'away' as const, dur: away, trip: n },
      { step: 'in' as const, dur: walk, trip: n },
      { step: 'turnFront' as const, dur: ERRAND.turn, trip: n },
    ];
  return {
    dir,
    speed,
    drink,
    target,
    steps: [{ step: 'wait', dur: ERRAND.wait, trip: 1 }, ...trip(1, ERRAND.fetch), { step: 'drink', dur: drink, trip: 1 }, ...trip(2, ERRAND.leave)],
  };
}

export function errandDuration(plan: ErrandPlan): number {
  return plan.steps.reduce((s, x) => s + x.dur, 0);
}

const smooth = (k: number) => k * k * (3 - 2 * k);
/** Giro por el camino corto de a hasta b. */
function turnTo(a: number, b: number, k: number): number {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * smooth(k);
}

/** Donde esta y que hace el personaje a los `t` segundos del recado. */
export function errandAt(plan: ErrandPlan, t: number): ErrandFrame {
  const out = Math.atan2(plan.target.x, plan.target.z);
  const back = Math.atan2(-plan.target.x, -plan.target.z);
  let start = 0;
  for (const s of plan.steps) {
    if (t < start + s.dur) {
      const age = t - start;
      const k = Math.min(1, age / s.dur);
      return frame(plan, s.step, s.trip, age, k, out, back);
    }
    start += s.dur;
  }
  return { step: 'done', age: 0, k: 1, x: 0, z: 0, yaw: 0, walk: 0, gesture: 0, glass: 'none', pan: 0, far: 0, lookAhead: 0 };
}

function frame(plan: ErrandPlan, step: ErrandStep, trip: 1 | 2, age: number, k: number, out: number, back: number): ErrandFrame {
  const T = plan.target;
  const dist = Math.hypot(T.x, T.z);
  // El vaso: lo trae en el primer viaje (de vuelta) y se lo lleva en el segundo (de ida).
  const glass = (inTrip: 'out' | 'in' | 'front'): ErrandFrame['glass'] => (trip === 1 ? (inTrip === 'out' ? 'none' : 'carry') : inTrip === 'out' ? 'carry' : 'none');
  const voice = (x: number, z: number) => ({ pan: Math.max(-1, Math.min(1, x / 1.4)), far: Math.min(1, Math.hypot(x, z) / dist) });
  const base = { step, age, k, gesture: 0, lookAhead: 0 };
  switch (step) {
    case 'wait': {
      // Sube el indice, lo mantiene y lo baja justo antes de girarse.
      const g = Math.min(1, age / 0.35, (ERRAND.wait - age) / 0.4);
      return { ...base, x: 0, z: 0, yaw: 0, walk: 0, gesture: Math.max(0, g), glass: 'none', pan: 0, far: 0 };
    }
    case 'turnOut': {
      const x = T.x * 0.04 * k * k;
      const z = T.z * 0.04 * k * k;
      return { ...base, x, z, yaw: turnTo(0, out, k), walk: smooth(k), glass: glass('out'), lookAhead: smooth(k), ...voice(x, z) };
    }
    case 'out': {
      const f = 0.04 + 0.96 * k;
      return { ...base, x: T.x * f, z: T.z * f, yaw: out, walk: 1, glass: glass('out'), lookAhead: 1, ...voice(T.x * f, T.z * f) };
    }
    case 'away':
      // Fuera de cuadro: ya de vuelta hacia su sitio (el giro no se ve).
      return { ...base, x: T.x, z: T.z, yaw: back, walk: 0, glass: glass('in'), lookAhead: 1, pan: Math.sign(T.x), far: 1 };
    case 'in': {
      const f = 1 - k;
      return { ...base, x: T.x * f, z: T.z * f, yaw: back, walk: 1, glass: glass('in'), lookAhead: 1 - smooth(Math.max(0, (k - 0.8) / 0.2)) * 0.5, ...voice(T.x * f, T.z * f) };
    }
    case 'turnFront':
      return { ...base, x: 0, z: 0, yaw: turnTo(back, 0, k), walk: 1 - smooth(k), glass: glass('front'), lookAhead: 0.5 * (1 - smooth(k)), pan: 0, far: 0 };
    case 'drink':
      return { ...base, x: 0, z: 0, yaw: 0, walk: 0, glass: 'drink', pan: 0, far: 0 };
    default:
      return { ...base, x: 0, z: 0, yaw: 0, walk: 0, glass: 'none', pan: 0, far: 0 };
  }
}
