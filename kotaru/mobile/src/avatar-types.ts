import type { ReactNode } from 'react';
import type { AffectState } from './avatar-motion';
import type { CompanionId } from './companions';

export interface AvatarProps {
  readonly companion: CompanionId;
  /** Diametro del retrato en puntos (alto del escenario si hay `width`). */
  readonly size: number;
  /** Ancho del escenario en puntos; sin el, el retrato es cuadrado (size x size). */
  readonly width?: number;
  /** true: el personaje aparece en su lugar (oficina, cuarto, montaña) en vez de sobre transparente. */
  readonly background?: boolean;
  /** Estado de la conversacion (STATE de @kotaru/client): escucha, piensa, habla... */
  readonly state: string;
  /** Ultima emocion que mando el servidor, o null. */
  readonly affect: AffectState | null;
  /** Volumen de lo que suena ahora (0-1), para mover la boca. */
  readonly level: () => number;
  /** Lo que se ve mientras carga o si el 3D no esta disponible (el monograma). */
  readonly fallback: ReactNode;
}
