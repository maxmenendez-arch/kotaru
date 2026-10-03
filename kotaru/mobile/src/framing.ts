/**
 * Encuadre de la camara del avatar. Puro (sin three.js) para poder probarlo.
 *
 * - `portrait`: el retrato redondo de siempre (busto).
 * - `stage`: el escenario ancho sobre la conversacion (busto con algo de fondo).
 * - `immersive`: pantalla completa con el personaje de tres cuartos (cabeza a cadera) y
 *   los controles flotando encima, abajo. La cabeza queda cerca del borde de arriba para
 *   que el panel de conversacion no la tape.
 */

export type Framing = 'portrait' | 'stage' | 'immersive';

export interface CameraSetup {
  readonly fov: number;
  /** Posicion de la camara (x siempre 0, frente al personaje). */
  readonly y: number;
  readonly z: number;
  /** Punto al que mira (x 0, z 0). */
  readonly targetY: number;
}

/** Media altura visible por metro de distancia con ese angulo vertical. */
function halfSpan(fovDeg: number): number {
  return Math.tan(((fovDeg / 2) * Math.PI) / 180);
}

/**
 * `freeBottom` (solo inmersivo): donde empieza el panel de abajo, como fraccion del alto
 * (0 arriba, 1 abajo). Si el panel crece (subtitulos), la camara se aleja lo justo para
 * que la cara entera quede por encima del panel.
 */
export function frameCamera(framing: Framing, aspect: number, headY: number, freeBottom = 1): CameraSetup {
  const focusY = headY - 0.03;
  if (framing === 'portrait') return { fov: 20, y: focusY + 0.03, z: 1.5, targetY: focusY };
  if (framing === 'stage') {
    // Escenario bajo (con conversacion en pantalla): mas cerca de la cara.
    return { fov: aspect > 2.1 ? 15 : 26, y: focusY + 0.03, z: 1.35, targetY: focusY };
  }
  const fov = 30;
  // Alto visible a la altura del personaje: en vertical (telefono), de la cabeza a la
  // cadera; en horizontal (ordenador) algo mas cerca, de la cabeza a la cintura.
  const k = Math.min(1, Math.max(0, (aspect - 0.7) / 0.9));
  const headTop = headY + 0.11;
  // La barbilla queda unos 23 cm por debajo de lo alto de la cabeza; con 5 % de margen
  // sobre el panel. Nunca mas lejos de lo que muestra medio cuerpo (1,6 m).
  const room = Math.max(0.08, Math.min(1, freeBottom) - 0.05 - 0.17);
  // Algo mas abierto (30-sep): se ve mas cuerpo y respira el plano.
  const span = Math.min(1.6, Math.max(1.2 - k * 0.24, 0.23 / room));
  // Arriba quedan el selector y la linea del nombre: la cabeza empieza por debajo.
  const top = headTop + span * 0.17;
  const center = top - span / 2;
  const z = span / 2 / halfSpan(fov);
  // Camara a la altura de los ojos, inclinada hacia el encuadre: si quedara a la altura del
  // pecho, el personaje (que mira a la camara) bajaria la vista y pareceria cabizbajo.
  return { fov, y: Math.max(center + 0.04, headY - 0.04), z, targetY: center };
}

/**
 * Densidad de pixeles del lienzo: nitido en retratos pequeños, pero a pantalla completa
 * se limita a ~1,6 millones de pixeles dibujados (un telefono no puede con mas a 30 fps
 * con fondo y acabado de camara).
 */
export function pixelRatio(framing: Framing, width: number, height: number, device: number): number {
  const dpr = device > 0 ? device : 1;
  if (framing === 'portrait') return Math.min(dpr, 2);
  // 1,8 (antes 1,5): en el telefono la cara se ve nitida y sigue dentro del presupuesto.
  const cap = Math.min(dpr, 1.8);
  const budget = Math.sqrt(1_600_000 / Math.max(1, width * height));
  return Math.max(Math.min(1, dpr), Math.min(cap, budget));
}

/** Ruido suave 1D (valor interpolado con curva de Hermite), determinista: -1 a 1. */
export function smoothNoise(t: number, seed: number): number {
  const hash = (n: number) => {
    const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

/** Varias octavas de ruido: mas organico que una sola. */
function fbm(t: number, seed: number): number {
  return smoothNoise(t, seed) * 0.6 + smoothNoise(t * 2.13, seed + 7) * 0.28 + smoothNoise(t * 4.7, seed + 13) * 0.12;
}

export interface Drift {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly tx: number;
  readonly ty: number;
  /** Giro de la camara sobre su eje (radianes): el horizonte nunca esta perfecto a pulso. */
  readonly roll: number;
}

/**
 * Camarografo (2-oct): camara al hombro. El pulso es ruido suave (no senos: no se nota ningun
 * ciclo), con la respiracion del operador (subir y bajar lento), un horizonte que se ladea
 * unas decimas de grado y, cada ~16 s, un leve paso hacia el personaje y vuelta, como quien
 * reencuadra. Milimetros y decimas de grado: se siente, no marea.
 */
export function cameraDrift(t: number): Drift {
  const x = 0.009 * fbm(t * 0.35, 1) + 0.0015 * fbm(t * 1.6, 2);
  // Respiracion: ~15 por minuto, 4 mm.
  const breathe = 0.004 * Math.sin(t * 2 * Math.PI * 0.25 + 0.6 * smoothNoise(t * 0.1, 3));
  const y = 0.006 * fbm(t * 0.3, 4) + breathe;
  const cycle = ((t % 16) + 16) % 16;
  const refocus = cycle < 4 ? 0.5 - 0.5 * Math.cos((cycle / 4) * 2 * Math.PI) : 0;
  const z = -0.025 * refocus + 0.006 * fbm(t * 0.2, 5);
  const roll = 0.006 * fbm(t * 0.25, 6);
  return { x, y, z, tx: x * 0.35 + 0.004 * fbm(t * 0.22, 8), ty: y * 0.35, roll };
}
