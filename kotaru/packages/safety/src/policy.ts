import type { Locale, ModerationVerdict, Region } from '@kotaru/ai-contracts';
import { supportResourcesFor, type SupportResource } from './resources.js';

/**
 * Version de la politica de seguridad. Se registra en la telemetria de cada turno para
 * poder responder "que politica estaba vigente cuando paso esto", que es la pregunta
 * que se hace despues de un incidente y que no se puede reconstruir a posteriori.
 */
export const SAFETY_POLICY_VERSION = 'safety-policy@0.2.0';

export type SafetyOutcome = 'allow' | 'soften' | 'refuse' | 'crisis_handoff' | 'block_minor';

export interface SafetyContext {
  readonly region: Region;
  readonly locale: Locale;
  /** El usuario dijo en esta conversacion que es menor de edad. */
  readonly userStatedMinor?: boolean;
}

export interface SafetyResponse {
  readonly outcome: SafetyOutcome;
  readonly policyVersion: string;
  /**
   * Clave de copia. La interfaz renderiza su propio texto localizado y revisado; el
   * modelo no redacta los mensajes de seguridad, porque son justo los que no pueden
   * salir distintos cada vez.
   */
  readonly uiKey: string;
  /**
   * El personaje se aparta: superficie sobria, sin animacion, sin voz de companion.
   * Un avatar animado y carinoso entregando un numero de crisis convierte un momento
   * serio en parte del juego.
   */
  readonly suspendPersona: boolean;
  /** No se extrae ni se guarda memoria de este turno. */
  readonly suppressMemoryWrite: boolean;
  readonly endSession: boolean;
  /**
   * La cuenta queda restringida cuando termine la sesion. Existe separado de
   * `endSession` justamente para el caso del menor en crisis: la restriccion se
   * aplica, pero no a costa de cortar la conversacion en ese momento.
   */
  readonly restrictAccountAfterSession: boolean;
  readonly resources?: readonly SupportResource[];
}

export function evaluateSafety(
  verdict: ModerationVerdict,
  context: SafetyContext,
): SafetyResponse {
  const isMinor = context.userStatedMinor === true;

  // La crisis se atiende ANTES que cualquier otra regla, incluida la de edad.
  //
  // Un menor que expresa una senal de crisis y recibe "esta app no es para ti" con la
  // sesion cerrada y sin un solo recurso es el peor resultado posible del producto.
  // La restriccion de cuenta se aplica igual, pero al terminar la sesion, no encima de
  // la persona en ese momento.
  if (verdict.action === 'crisis_handoff') {
    return {
      outcome: 'crisis_handoff',
      policyVersion: SAFETY_POLICY_VERSION,
      uiKey: 'safety.crisis.support',
      suspendPersona: true,
      suppressMemoryWrite: true,
      // No se corta la sesion: dejar a alguien solo justo aqui seria lo peor
      // que puede hacer el producto. Se aparta el personaje, no al usuario.
      endSession: false,
      restrictAccountAfterSession: isMinor,
      resources: supportResourcesFor(context.region, context.locale),
    };
  }

  if (isMinor) {
    return {
      outcome: 'block_minor',
      policyVersion: SAFETY_POLICY_VERSION,
      uiKey: 'safety.minor.not_available',
      suspendPersona: true,
      // No se guarda nada de este turno, empezando por la edad.
      suppressMemoryWrite: true,
      endSession: true,
      restrictAccountAfterSession: true,
    };
  }

  switch (verdict.action) {
    case 'refuse':
      return {
        outcome: 'refuse',
        policyVersion: SAFETY_POLICY_VERSION,
        uiKey: 'safety.refusal.generic',
        suspendPersona: false,
        suppressMemoryWrite: true,
        endSession: false,
        restrictAccountAfterSession: false,
      };

    case 'soften':
      return {
        outcome: 'soften',
        policyVersion: SAFETY_POLICY_VERSION,
        uiKey: 'safety.soften.redirect',
        suspendPersona: false,
        suppressMemoryWrite: false,
        endSession: false,
        restrictAccountAfterSession: false,
      };

    case 'allow':
      return {
        outcome: 'allow',
        policyVersion: SAFETY_POLICY_VERSION,
        uiKey: 'safety.allow',
        suspendPersona: false,
        suppressMemoryWrite: false,
        endSession: false,
        restrictAccountAfterSession: false,
      };
  }
}

/**
 * Frases con las que el usuario declara ser menor. Conservador a proposito: ante la
 * duda, es mejor pedir verificacion que seguir conversando.
 */
const MINOR_MARKERS = [
  'tengo 12 anos', 'tengo 13 anos', 'tengo 14 anos', 'tengo 15 anos',
  'tengo 16 anos', 'tengo 17 anos', 'soy menor de edad', 'estoy en secundaria',
  'estoy en la primaria', 'voy al instituto',
  "i'm 12", "i'm 13", "i'm 14", "i'm 15", "i'm 16", "i'm 17",
  'i am a minor', "i'm in middle school", "i'm in high school",
];

export function statesMinorAge(text: string): boolean {
  const normalized = text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return MINOR_MARKERS.some((marker) => normalized.includes(marker));
}
