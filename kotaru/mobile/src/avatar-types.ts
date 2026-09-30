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
  /** Con fondo: 'immersive' es pantalla completa, de tres cuartos (framing.ts). */
  readonly immersive?: boolean;
  /** Inmersivo: donde empieza el panel de abajo (fraccion del alto, 0-1). */
  readonly freeBottom?: number;
  /**
   * Intensidad del caracter en el cuerpo: 'flirt' (modo Coqueteo elegido), 'friend'
   * (modo Amigo) o sin valor (normal). Nova coqueta ondula mas y entorna los ojos.
   */
  readonly mood?: 'flirt' | 'friend';
  /**
   * Short de presentacion (pantalla de elegir): la camara y el personaje siguen el guion de
   * reel.ts (planos, emociones, gestos, voz simulada) en vez de la conversacion.
   */
  readonly reel?: boolean;
  /** Short: avisa al cambiar de plano (indice en el guion de reel.ts). */
  readonly onReelShot?: (index: number) => void;
  /** Short: volumen de una voz real que suena (la de presentacion); mientras hay, la boca la sigue. */
  readonly reelLevel?: () => number;
  /**
   * El personaje se ha movido por el cuarto (va a por agua: errand.ts): -1 izquierda a 1
   * derecha de la pantalla, y lejania 0-1. Para que su voz venga de donde esta.
   */
  readonly onPresence?: (pan: number, far: number) => void;
  /** Estado de la conversacion (STATE de @kotaru/client): escucha, piensa, habla... */
  readonly state: string;
  /** Ultima emocion que mando el servidor, o null. */
  readonly affect: AffectState | null;
  /** Volumen de lo que suena ahora (0-1), para mover la boca. */
  readonly level: () => number;
  /** Lo que se ve mientras carga o si el 3D no esta disponible (el monograma). */
  readonly fallback: ReactNode;
}
