/**
 * Reacciones al momento a lo que la persona dice, antes de que el personaje conteste: su cara,
 * un gesto y unas particulas (corazones, destellos, estrellas). Siempre positivas: ante algo
 * triste o dificil, la reaccion es de ternura y atencion, nunca de rechazo o enfado.
 *
 * Clasificacion ligera por palabras en el dispositivo (sin llamar a nadie, sin guardar nada):
 * basta con acertar el tono; la respuesta del personaje trae despues su propia emocion.
 * Corazones solo en coqueteo (Nova y Rio en modo Coqueteo o "tu decides"); con Luna o en
 * modo Amigo, un cariño equivale a destellos calidos, sin tono romantico.
 */
import type { CompanionId } from './companions';

export type ReactionKind = 'love' | 'intrigue' | 'expectation' | 'joy' | 'tender' | 'attentive';
export type Particles = 'hearts' | 'sparkles' | 'stars' | 'none';

export interface Reaction {
  readonly kind: ReactionKind;
  /** Emocion de la cara (EMOTIONS de ai-contracts). */
  readonly emotion: string;
  readonly intensity: number;
  /** Gesto (GESTURES de ai-contracts). */
  readonly gesture: string;
  readonly particles: Particles;
}

const norm = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// El orden importa: lo dificil primero (se responde con ternura aunque haya otras palabras).
const RULES: readonly [ReactionKind, RegExp][] = [
  ['tender', /\b(triste|solo|sola|ansiedad|ansios[oa]|miedo|lloro|llorando|mal dia|cansad[oa]|estresad[oa]|me duele|extrano a|sad|lonely|anxious|scared|crying|tired|stressed|bad day)\b/],
  ['love', /\b(te quiero|te amo|me gustas|me encantas|guap[oa]|lind[oa]|hermos[oa]|preciosa|precioso|bonit[oa]|beso|besos|carino|mi amor|abrazo|te extrano|love you|i like you|beautiful|gorgeous|cute|kiss|hug|miss you|sweetheart)\b/],
  ['joy', /\b(jaja\w*|jeje\w*|lol|haha\w*|feliz|genial|increible|lo logre|gane|que bien|me alegra|happy|awesome|amazing|i did it|great news)\b/],
  ['intrigue', /(\?|\b(adivina|secreto|misterio|sabes que|te cuento|imagina|que harias|y si|curioso|raro|extrano|guess|secret|mystery|imagine|what if|would you|weird|strange)\b)/],
  ['expectation', /\b(manana|esta noche|luego|pronto|plan|planes|vamos a|voy a|quiero que|sorpresa|viaje|cita|fin de semana|tonight|tomorrow|soon|let's|going to|i want to|surprise|trip|date|weekend)\b/],
];

export function classifyReaction(text: string): ReactionKind {
  const t = norm(text);
  for (const [kind, re] of RULES) if (re.test(t)) return kind;
  return 'attentive';
}

export function reactionFor(kind: ReactionKind, companion: CompanionId, mode: 'friend' | 'flirt' | 'ask'): Reaction {
  const romantic = companion !== 'luna' && mode !== 'friend';
  switch (kind) {
    case 'love':
      return romantic
        ? { kind, emotion: 'happy', intensity: 0.9, gesture: 'laugh_soft', particles: 'hearts' }
        : { kind, emotion: 'warm', intensity: 0.85, gesture: 'tilt_head', particles: 'sparkles' };
    case 'joy':
      return { kind, emotion: 'happy', intensity: 0.9, gesture: 'laugh_soft', particles: 'stars' };
    case 'intrigue':
      return { kind, emotion: 'curious', intensity: 0.8, gesture: 'tilt_head', particles: 'sparkles' };
    case 'expectation':
      return { kind, emotion: companion === 'luna' ? 'warm' : 'playful', intensity: 0.8, gesture: 'lean_in', particles: 'stars' };
    case 'tender':
      // Ternura y atencion, sin particulas: no se celebra algo dificil.
      return { kind, emotion: 'warm', intensity: 0.7, gesture: 'nod', particles: 'none' };
    case 'attentive':
      return { kind, emotion: 'warm', intensity: 0.5, gesture: 'nod', particles: 'none' };
  }
}
