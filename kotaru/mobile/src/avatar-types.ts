import type { ReactNode } from 'react';
import type { AffectState } from './avatar-motion';
import type { CompanionId } from './companions';

export interface AvatarProps {
  readonly companion: CompanionId;
  /** Diametro del retrato en puntos. */
  readonly size: number;
  /** Estado de la conversacion (STATE de @kotaru/client): escucha, piensa, habla... */
  readonly state: string;
  /** Ultima emocion que mando el servidor, o null. */
  readonly affect: AffectState | null;
  /** Volumen de lo que suena ahora (0-1), para mover la boca. */
  readonly level: () => number;
  /** Lo que se ve mientras carga o si el 3D no esta disponible (el monograma). */
  readonly fallback: ReactNode;
}
