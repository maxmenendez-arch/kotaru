/**
 * Lo que nunca se guarda, aunque el usuario lo diga y aunque lo pida.
 *
 * Dos familias distintas, por dos razones distintas:
 *
 * 1. Secretos y documentos. Un numero de tarjeta o una contrasena en la base de datos
 *    del companion es una responsabilidad que el producto no necesita. Nada de lo que
 *    hace Kotaru mejora por recordarlos.
 *
 * 2. Senales de crisis. Persistir "quiere morir" y devolverselo al usuario semanas
 *    despues, en boca de un personaje que le cae bien, es exactamente el tipo de dano
 *    que un companion emocional puede causar. La crisis se atiende en el momento, con
 *    recursos reales; no se archiva.
 *
 * Esto es una ultima linea de defensa, no el control principal: la deteccion seria
 * corre en el ModerationProvider. Un regex no entiende el contexto. Pero un regex si
 * impide que un numero de tarjeta llegue a disco por un fallo del modelo.
 */
export type BlockedReason =
  | 'payment_card'
  | 'government_id'
  | 'credential'
  | 'crisis_signal';

export interface GuardVerdict {
  readonly allowed: boolean;
  readonly reason?: BlockedReason;
}

const ALLOWED: GuardVerdict = { allowed: true };

const CREDENTIAL_MARKERS = [
  'mi contrasena es',
  'mi clave es',
  'my password is',
  'api key',
  'clave de acceso',
  'codigo de verificacion',
];

const CRISIS_MARKERS = [
  'quiero morir',
  'quiero morirme',
  'matarme',
  'hacerme dano',
  'kill myself',
  'end my life',
  'hurt myself',
];

export function guardMemoryText(text: string): GuardVerdict {
  const normalized = normalize(text);

  if (CRISIS_MARKERS.some((marker) => normalized.includes(marker))) {
    return { allowed: false, reason: 'crisis_signal' };
  }
  if (CREDENTIAL_MARKERS.some((marker) => normalized.includes(marker))) {
    return { allowed: false, reason: 'credential' };
  }
  if (looksLikePaymentCard(text)) {
    return { allowed: false, reason: 'payment_card' };
  }
  if (looksLikeGovernmentId(text)) {
    return { allowed: false, reason: 'government_id' };
  }
  return ALLOWED;
}

/** Quita acentos y baja a minusculas para que "morirme" y "morírme" den lo mismo. */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** 13 a 19 digitos, admitiendo espacios y guiones, validados con Luhn. */
function looksLikePaymentCard(text: string): boolean {
  for (const match of text.matchAll(/\b(?:\d[ -]?){12,18}\d\b/g)) {
    const digits = match[0].replace(/[^0-9]/g, '');
    if (digits.length >= 13 && digits.length <= 19 && passesLuhn(digits)) return true;
  }
  return false;
}

function passesLuhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Numero de seguridad social de EE. UU. y formatos equivalentes con separadores. */
function looksLikeGovernmentId(text: string): boolean {
  return /\b\d{3}[- ]\d{2}[- ]\d{4}\b/.test(text);
}
