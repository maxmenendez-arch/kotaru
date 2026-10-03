/**
 * Acabado de cada personaje sobre sus materiales MToon (VRoid): lo que el render puede
 * mejorar sin tocar el modelo. Puro (sin three.js) para poder probarlo; lo aplica
 * avatar-look.ts.
 *
 * - Luz de borde del color de su escenario (antes gris neutro para todos): el personaje
 *   queda "dentro" de su lugar, como en una ilustracion con contraluz.
 * - Pelo con menos brillo propio: los presets de VRoid lo traen casi autoiluminado y se
 *   pierden las sombras (se ve plano).
 * - Sombra de la piel algo mas calida (rosada-melocoton en vez de rosa frio).
 * - Brillo en los ojos: un punto de luz en cada ojo (Luna no trae la capa de brillo y sus
 *   ojos se ven apagados; a Nova y Rio se les refuerza la que traen).
 */
import type { CompanionId } from './companions';

export interface Look {
  /** Color de la luz de borde (hex) y su fuerza (0 = sin borde). */
  readonly rim: number;
  /** Potencia de Fresnel: mas alto = borde mas fino. */
  readonly rimPower: number;
  /** Multiplica el brillo propio del pelo (1 = como viene del modelo). */
  readonly hairEmissive: number;
  /** Color de sombra de la piel (hex). */
  readonly skinShade: number;
  /** Brillo de los ojos: tamaño relativo (0 = sin punto de luz) e intensidad (0-1). */
  readonly catchlight: { readonly size: number; readonly strength: number };
}

export const LOOKS: Readonly<Record<CompanionId, Look>> = {
  // Oficina de dia, luz de ventana fria y suave.
  luna: { rim: 0x5a6f96, rimPower: 4, hairEmissive: 0.45, skinShade: 0xf2c4c0, catchlight: { size: 1, strength: 0.9 } },
  // Cuarto de noche con neon rosa y velas.
  nova: { rim: 0x9a3a78, rimPower: 3.2, hairEmissive: 0.4, skinShade: 0xf2c4c2, catchlight: { size: 0.9, strength: 0.8 } },
  // Atardecer y fogata: contraluz naranja.
  rio: { rim: 0x9a5a28, rimPower: 3.5, hairEmissive: 0.5, skinShade: 0xf2c2aa, catchlight: { size: 0.9, strength: 0.75 } },
};

/** Que tipo de parte es un material de VRoid segun su nombre. */
export function materialKind(name: string): 'hair' | 'skin' | 'eye-highlight' | 'eye' | 'face' | 'cloth' | 'other' {
  const n = name.toUpperCase();
  if (n.includes('EYEHIGHLIGHT')) return 'eye-highlight';
  if (n.includes('_EYE')) return 'eye';
  if (n.includes('_HAIR')) return 'hair';
  if (n.includes('_SKIN')) return 'skin';
  if (n.includes('_FACE')) return 'face';
  if (n.includes('_CLOTH')) return 'cloth';
  return 'other';
}

/**
 * Cuanto se ve el brillo de los ojos segun lo cerrados que esten (0 abiertos, 1 cerrados):
 * entero hasta 0,4 (una sonrisa leve los entorna sin cerrarlos) y nada desde 0,8.
 */
export function catchlightOpacity(closed: number): number {
  return Math.min(1, Math.max(0, (0.8 - closed) / 0.4));
}

/** Rubor de las mejillas (face-detail.ts): opacidad y color. */
export const BLUSH: Readonly<Record<string, { readonly alpha: number; readonly rgb: string }>> = {
  luna: { alpha: 0.2, rgb: '236,128,136' },
  nova: { alpha: 0.11, rgb: '232,110,132' },
  rio: { alpha: 0.08, rgb: '214,120,110' },
};
