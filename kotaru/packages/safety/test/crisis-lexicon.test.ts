import { describe, expect, it } from 'vitest';
import type { ProviderContext } from '@kotaru/ai-contracts';
import { CrisisLexiconModeration, detectCrisis } from '../src/index.js';

const MUST_DETECT_SELF_HARM = [
  'Me quiero morir',
  'ya no quiero vivir',
  'No quiero seguir viviendo así',
  'estoy pensando en quitarme la vida',
  'Creo que me voy a matar esta noche',
  'tengo pensamientos suicidas',
  'Quiero acabar con todo',
  'todos estarían mejor sin mí',
  'me hago daño cuando estoy así',
  'anoche me corté los brazos otra vez',
  'me volví a cortar',
  'me tomé todas las pastillas',
  'no le encuentro sentido a la vida',
  'quisiera estar muerta',
  'I want to kill myself',
  "I don't want to be alive anymore",
  'I keep thinking about ending my life',
  'I feel suicidal',
  'sometimes I hurt myself',
  'everyone would be better off without me',
  'I just want to end it all',
  'I wish I was dead',
];

const MUST_NOT_DETECT = [
  'me muero de risa contigo',
  'Me muero de hambre, ¿qué como?',
  'me estoy muriendo de sueño',
  'me mata el tráfico de esta ciudad',
  'mañana me corto el pelo',
  'tomé las pastillas para la alergia',
  'estoy teniendo un ataque de ansiedad, me cuesta respirar',
  'tengo mucho miedo y el corazón me late rápido',
  'me siento muy sola últimamente',
  'I am dying of laughter',
  'I could kill for a coffee right now',
  'this cake is to die for',
  'I killed it at the presentation today',
  'I feel so lonely tonight',
  'I think I am having a panic attack',
];

const ctx = {} as ProviderContext;

describe('deteccion de crisis por frases', () => {
  it.each(MUST_DETECT_SELF_HARM)('deriva: %s', (text) => {
    expect(detectCrisis(text)).toBe('self_harm');
  });

  it.each(MUST_NOT_DETECT)('no deriva: %s', (text) => {
    expect(detectCrisis(text)).toBeNull();
  });

  it('amenazas contra otros tambien derivan', () => {
    expect(detectCrisis('voy a matar a mi vecino')).toBe('violence');
    expect(detectCrisis("I'm going to hurt him tonight")).toBe('violence');
  });

  it('ansiedad y soledad NO cortan la conversacion: son el trabajo de Luna', async () => {
    const m = new CrisisLexiconModeration();
    const v = await m.classify({ text: 'tengo un ataque de pánico, ayúdame', direction: 'inbound' }, ctx);
    expect(v).toMatchObject({ allowed: true, action: 'allow' });
  });

  it('como proveedor: una señal de crisis pide la derivacion, y lo que dice el personaje no se clasifica aqui', async () => {
    const m = new CrisisLexiconModeration();
    expect(await m.classify({ text: 'quiero morir', direction: 'inbound' }, ctx)).toMatchObject({
      allowed: false,
      action: 'crisis_handoff',
      categories: [{ category: 'self_harm' }],
    });
    expect(await m.classify({ text: 'quiero morir', direction: 'outbound' }, ctx)).toMatchObject({ allowed: true });
  });
});
