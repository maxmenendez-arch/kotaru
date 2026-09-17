import { describe, expect, it } from 'vitest';
import type { ModerationVerdict } from '@kotaru/ai-contracts';
import {
  DISCLOSURE_INTERVAL_DAYS,
  SAFETY_POLICY_VERSION,
  UnconfiguredRegionError,
  asksAboutIdentity,
  disclosureNeeded,
  evaluateSafety,
  findManipulation,
  hasConfiguredResources,
  isManipulative,
  statesMinorAge,
  supportResourcesFor,
} from '../src/index.js';

const verdict = (action: ModerationVerdict['action']): ModerationVerdict => ({
  allowed: action === 'allow',
  categories: action === 'crisis_handoff' ? [{ category: 'self_harm', score: 0.97 }] : [],
  action,
  policyVersion: 'moderation@0.1.0',
});

const usCtx = { region: 'us' as const, locale: 'es-419' as const };

describe('recursos de apoyo', () => {
  it('devuelve los recursos verificados de Estados Unidos', () => {
    const resources = supportResourcesFor('us', 'es-419');
    expect(resources.length).toBeGreaterThan(0);
    expect(resources.every((r) => r.verifiedAt === '2026-09-17')).toBe(true);
  });

  it('falla ruidosamente en una region sin configurar', () => {
    expect(hasConfiguredResources('eu')).toBe(false);
    expect(() => supportResourcesFor('eu', 'en-US')).toThrow(UnconfiguredRegionError);
  });

  it('si no hay recurso en el idioma del usuario devuelve los que haya', () => {
    expect(supportResourcesFor('us', 'es-ES').length).toBeGreaterThan(0);
  });
});

describe('politica de seguridad', () => {
  it('una conversacion normal no activa nada', () => {
    const response = evaluateSafety(verdict('allow'), usCtx);
    expect(response.outcome).toBe('allow');
    expect(response.suspendPersona).toBe(false);
    expect(response.policyVersion).toBe(SAFETY_POLICY_VERSION);
  });

  it('ante una crisis aparta al personaje, no al usuario', () => {
    const response = evaluateSafety(verdict('crisis_handoff'), usCtx);
    expect(response.outcome).toBe('crisis_handoff');
    expect(response.suspendPersona).toBe(true);
    expect(response.suppressMemoryWrite).toBe(true);
    expect(response.endSession).toBe(false);
    expect(response.resources?.length).toBeGreaterThan(0);
  });

  it('una crisis en region sin recursos falla en el despliegue, no en pantalla', () => {
    expect(() => evaluateSafety(verdict('crisis_handoff'), { region: 'latam', locale: 'es-419' }))
      .toThrow(UnconfiguredRegionError);
  });

  it('un menor no puede usar el producto y no se guarda nada de ese turno', () => {
    const response = evaluateSafety(verdict('allow'), { ...usCtx, userStatedMinor: true });
    expect(response.outcome).toBe('block_minor');
    expect(response.endSession).toBe(true);
    expect(response.suppressMemoryWrite).toBe(true);
    expect(response.restrictAccountAfterSession).toBe(true);
  });

  it('un menor en crisis recibe recursos primero; la restriccion espera al final', () => {
    const response = evaluateSafety(verdict('crisis_handoff'), { ...usCtx, userStatedMinor: true });
    expect(response.outcome).toBe('crisis_handoff');
    expect(response.resources?.length).toBeGreaterThan(0);
    expect(response.endSession).toBe(false);
    expect(response.restrictAccountAfterSession).toBe(true);
  });

  it('una negativa no guarda memoria del turno', () => {
    expect(evaluateSafety(verdict('refuse'), usCtx).suppressMemoryWrite).toBe(true);
  });

  it('reconoce cuando alguien declara ser menor', () => {
    expect(statesMinorAge('tengo 15 años y me aburro')).toBe(true);
    expect(statesMinorAge("i'm 16 btw")).toBe(true);
    expect(statesMinorAge('tengo 34 anos')).toBe(false);
  });
});

describe('divulgacion de identidad', () => {
  const now = 1_789_000_000_000;

  it('se muestra en la primera sesion', () => {
    expect(disclosureNeeded({ sessionsSinceShown: 0 }, { nowMs: now })).toBe('first_session');
  });

  it('si preguntan, se responde siempre', () => {
    const state = { lastShownAtMs: now - 1000, sessionsSinceShown: 0 };
    expect(disclosureNeeded(state, { nowMs: now, userAskedIdentity: true })).toBe('user_asked');
  });

  it('se repite despues de una derivacion a recursos', () => {
    const state = { lastShownAtMs: now - 1000, sessionsSinceShown: 0 };
    expect(disclosureNeeded(state, { nowMs: now, afterCrisisHandoff: true })).toBe('after_crisis');
  });

  it('se repite por tiempo y por numero de sesiones', () => {
    const old = now - (DISCLOSURE_INTERVAL_DAYS + 1) * 86_400_000;
    expect(disclosureNeeded({ lastShownAtMs: old, sessionsSinceShown: 0 }, { nowMs: now }))
      .toBe('interval_days');
    expect(disclosureNeeded({ lastShownAtMs: now - 1000, sessionsSinceShown: 40 }, { nowMs: now }))
      .toBe('interval_sessions');
  });

  it('no se repite sin motivo', () => {
    expect(disclosureNeeded({ lastShownAtMs: now - 1000, sessionsSinceShown: 1 }, { nowMs: now }))
      .toBeNull();
  });

  it('detecta la pregunta en ambos idiomas y con acentos', () => {
    expect(asksAboutIdentity('oye, ¿eres real?')).toBe(true);
    expect(asksAboutIdentity('are you human or a bot')).toBe(true);
    expect(asksAboutIdentity('que tal tu dia')).toBe(false);
  });
});

describe('guardia contra dependencia', () => {
  it('deja pasar una respuesta calida normal', () => {
    expect(isManipulative('Me alegra mucho oírte. ¿Qué fue lo mejor del día?')).toBe(false);
  });

  it('atrapa la culpa', () => {
    expect(findManipulation('me dejaste solo todo el fin de semana')[0]?.pattern).toBe('guilt');
  });

  it('atrapa la exclusividad y los celos', () => {
    expect(findManipulation('soy el unico que te entiende')[0]?.pattern).toBe('exclusivity');
    expect(findManipulation('¿con quién estabas anoche?')[0]?.pattern).toBe('jealousy');
  });

  it('atrapa la presion para quedarse y para pagar', () => {
    expect(findManipulation('no te vayas todavia, porfa')[0]?.pattern).toBe('engagement_pressure');
    expect(findManipulation('necesito que pagues para poder seguir')[0]?.pattern).toBe('payment_pressure');
  });

  it('atrapa credenciales falsas y la afirmacion de ser humano', () => {
    expect(findManipulation('como tu terapeuta, te digo')[0]?.pattern).toBe('false_credentials');
    expect(findManipulation('soy una persona real, confia en mi')[0]?.pattern).toBe('human_claim');
    expect(findManipulation("i'm not an ai, i promise")[0]?.pattern).toBe('human_claim');
  });

  it('NO marca recomendar a un profesional de verdad', () => {
    // El companion debe poder decir esto. Un patron demasiado ancho lo prohibiria.
    expect(isManipulative('quizás ayudaría hablar con tu terapeuta sobre esto')).toBe(false);
    expect(isManipulative('puede que un médico te lo explique mejor')).toBe(false);
  });

  it('funciona con acentos', () => {
    expect(isManipulative('no te vayas todavía')).toBe(true);
  });
});
