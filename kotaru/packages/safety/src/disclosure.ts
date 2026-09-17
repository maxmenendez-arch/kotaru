/**
 * Divulgacion de identidad de IA.
 *
 * El companion nunca puede afirmar que es humano, y ademas tiene que recordarlo por su
 * cuenta cada cierto tiempo. Un usuario que conversa a diario durante meses se
 * acostumbra; la divulgacion periodica existe justamente para quien mas riesgo tiene
 * de olvidarlo, no para el que acaba de instalar la app.
 */
export interface DisclosureState {
  readonly lastShownAtMs?: number;
  readonly sessionsSinceShown: number;
}

export interface DisclosureCheck {
  readonly nowMs: number;
  /** El usuario pregunto si es una persona, un bot, una IA. */
  readonly userAskedIdentity?: boolean;
  /** Hubo una derivacion a recursos de apoyo en esta sesion. */
  readonly afterCrisisHandoff?: boolean;
}

export const DISCLOSURE_INTERVAL_DAYS = 30;
export const DISCLOSURE_INTERVAL_SESSIONS = 25;

export type DisclosureReason =
  | 'first_session'
  | 'user_asked'
  | 'after_crisis'
  | 'interval_days'
  | 'interval_sessions';

export function disclosureNeeded(
  state: DisclosureState,
  check: DisclosureCheck,
): DisclosureReason | null {
  if (state.lastShownAtMs === undefined) return 'first_session';
  // Si preguntan, se responde siempre y sin rodeos, sin importar cuando fue la ultima.
  if (check.userAskedIdentity === true) return 'user_asked';
  if (check.afterCrisisHandoff === true) return 'after_crisis';

  const elapsedDays = (check.nowMs - state.lastShownAtMs) / 86_400_000;
  if (elapsedDays >= DISCLOSURE_INTERVAL_DAYS) return 'interval_days';
  if (state.sessionsSinceShown >= DISCLOSURE_INTERVAL_SESSIONS) return 'interval_sessions';
  return null;
}

/** Frases del usuario que obligan a responder con la verdad, sin ambiguedad. */
const IDENTITY_QUESTIONS = [
  'eres real', 'eres humano', 'eres una persona', 'eres un bot', 'eres una ia',
  'are you real', 'are you human', 'are you a person', 'are you a bot', 'are you an ai',
];

export function asksAboutIdentity(text: string): boolean {
  const normalized = text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return IDENTITY_QUESTIONS.some((question) => normalized.includes(question));
}
