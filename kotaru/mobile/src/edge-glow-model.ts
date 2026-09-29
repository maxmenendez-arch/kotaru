/**
 * Logica del borde luminoso (ui/edge-glow.web.tsx), sin DOM para poder probarla.
 */

/** Intensidad objetivo del halo (0-1) segun el estado y el volumen del momento. */
export function glowStrength(state: string, level: number, t: number, reduce: boolean): number {
  const v = Math.max(0, Math.min(1, level));
  switch (state) {
    case 'listening':
      // Siempre visible al escuchar (se sabe que el micro esta abierto) y crece con la voz.
      return reduce ? 0.8 : 0.45 + 0.55 * v;
    case 'speaking':
      return reduce ? 0.6 : 0.2 + 0.7 * v;
    case 'thinking':
      return reduce ? 0.35 : 0.25 + 0.15 * (0.5 + 0.5 * Math.sin(t * 3));
    default:
      return 0;
  }
}

/** Colores del degradado: calidos al escucharte, los del personaje cuando habla. */
export function glowColors(state: string, accent: string): readonly string[] {
  if (state === 'listening') return ['#FF8A3D', '#FFB35C', '#FF5FA2', '#FF8A3D'];
  if (state === 'thinking') return ['#9FB4FF', accent, '#9FB4FF'];
  return [accent, '#FFFFFF', accent, '#FFB35C'];
}
