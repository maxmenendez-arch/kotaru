/**
 * Canal lateral de emocion. El modelo NO puede emitir nombres de animacion
 * arbitrarios ni comandos al cliente: solo estos valores, validados aqui
 * antes de cruzar al dispositivo.
 */
export const EMOTIONS = [
  'neutral',
  'warm',
  'happy',
  'curious',
  'thoughtful',
  'concerned',
  'playful',
  'surprised',
] as const;

export const GESTURES = [
  'none',
  'small_wave',
  'nod',
  'tilt_head',
  'lean_in',
  'shrug',
  'laugh_soft',
  'think_pose',
  'point_up',
  'clap_light',
] as const;

export type Emotion = (typeof EMOTIONS)[number];
export type Gesture = (typeof GESTURES)[number];

export interface AffectSignal {
  readonly emotion: Emotion;
  readonly intensity: number;
  readonly gesture?: Gesture;
}

export function isEmotion(value: unknown): value is Emotion {
  return typeof value === 'string' && (EMOTIONS as readonly string[]).includes(value);
}

export function isGesture(value: unknown): value is Gesture {
  return typeof value === 'string' && (GESTURES as readonly string[]).includes(value);
}

/**
 * Valida y normaliza una senal de emocion que viene del modelo.
 * Devuelve null si no es admisible: el llamador degrada a 'neutral' en vez de confiar.
 * La intensidad se recorta al rango, nunca se rechaza por estar fuera.
 */
export function parseAffect(raw: unknown): AffectSignal | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const candidate = raw as Record<string, unknown>;

  if (!isEmotion(candidate['emotion'])) return null;

  const rawIntensity = candidate['intensity'];
  if (typeof rawIntensity !== 'number' || Number.isNaN(rawIntensity)) return null;
  const intensity = Math.min(1, Math.max(0, rawIntensity));

  const rawGesture = candidate['gesture'];
  if (rawGesture === undefined) {
    return { emotion: candidate['emotion'], intensity };
  }
  if (!isGesture(rawGesture)) return null;

  return { emotion: candidate['emotion'], intensity, gesture: rawGesture };
}
