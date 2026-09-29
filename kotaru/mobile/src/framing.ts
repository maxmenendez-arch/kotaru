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

export function frameCamera(framing: Framing, aspect: number, headY: number): CameraSetup {
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
  const span = 1.0 - k * 0.24;
  const headTop = headY + 0.11;
  // Arriba quedan el selector y la linea del nombre: la cabeza empieza por debajo.
  const top = headTop + span * 0.17;
  const center = top - span / 2;
  const z = span / 2 / halfSpan(fov);
  return { fov, y: center + 0.04, z, targetY: center };
}

/**
 * Densidad de pixeles del lienzo: nitido en retratos pequeños, pero a pantalla completa
 * se limita a ~1,6 millones de pixeles dibujados (un telefono no puede con mas a 30 fps
 * con fondo y acabado de camara).
 */
export function pixelRatio(framing: Framing, width: number, height: number, device: number): number {
  const dpr = device > 0 ? device : 1;
  if (framing === 'portrait') return Math.min(dpr, 2);
  const cap = Math.min(dpr, 1.5);
  const budget = Math.sqrt(1_600_000 / Math.max(1, width * height));
  return Math.max(Math.min(1, dpr), Math.min(cap, budget));
}
