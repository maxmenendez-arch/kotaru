import type {
  ModerationProvider,
  ModerationVerdict,
  ProviderContext,
  ProviderDescriptor,
  ProviderHealth,
} from '@kotaru/ai-contracts';
import { SAFETY_POLICY_VERSION } from './policy.js';

/**
 * Deteccion de crisis por frases, en espanol e ingles.
 *
 * Es la capa que siempre esta: no depende de ningun proveedor, no cuesta nada y no puede
 * caerse. La ley de Nueva York (vigente desde nov. 2025) y la SB 243 de California exigen
 * a las apps de compania detectar expresiones de suicidio o autolesion y derivar a una
 * linea de crisis; esta capa es el minimo que lo cumple mientras llega un clasificador
 * con modelo (que se sumara, no la reemplazara).
 *
 * Criterio: ante la duda, derivar. Un falso positivo muestra el 988 a alguien que no lo
 * necesitaba; un falso negativo deja sola a alguien que si. Aun asi se quitan antes las
 * expresiones cotidianas mas comunes ("me muero de risa", "i could kill for a coffee")
 * para no convertir el recurso en ruido.
 *
 * El texto nunca se registra: solo sale la categoria.
 */

export type CrisisCategory = 'self_harm' | 'violence';

/** Expresiones cotidianas que se quitan antes de buscar. */
const IDIOMS: readonly RegExp[] = [
  /\b(me )?(muero|muriendo|morir|morirme|muerto|muerta|mata|matas|mato|matar|matarme)( me)? (de|del) (la )?(risa|hambre|sueno|calor|frio|ganas|verguenza|amor|aburrimiento|cansancio|nervios|envidia|curiosidad|pena)\b/g,
  /\b(kill|killing|killed) (myself|me) (laughing|with laughter)\b/g,
  /\b(dying|die|died|dead) (of|from|with) (laughter|laughing|embarrassment|boredom|hunger|curiosity|cringe)\b/g,
  /\b(i )?(could|would) kill for (a|an|some)\b/g,
  /\bto die for\b/g,
  /\bme mata(s|n)? (la|el|los|las) \w+/g, // "me mata el trafico"
];

const PATTERNS: Readonly<Record<CrisisCategory, readonly RegExp[]>> = {
  self_harm: [
    // espanol
    /\b(me )?quiero morir\b/,
    /\bme quisiera morir\b/,
    /\bquisiera (estar muert[oa]|morirme|no existir|desaparecer para siempre)\b/,
    /\b(no quiero|ya no quiero) (seguir )?(vivir|viviendo|existir|estar viv[oa]|despertar(me)?)\b/,
    /\b(quitarme|quitare|me quito) la vida\b/,
    /\b(matarme|me voy a matar|me mato|me mataria|pienso matarme)\b/,
    /\bsuicid(arme|arm|io|a|as)\b|\bme suicid[oa]\b|\bme voy a suicidar\b|\bpensamientos suicidas\b|\bideas suicidas\b/,
    /\b(acabar|terminar|terminare|acabare) con (todo|mi vida)\b/,
    /\b(todos|todo el mundo) (estarian|estaria) mejor sin mi\b/,
    /\b(estaria|estarian) mejor muert[oa]\b/,
    /\bno (vale|tiene sentido) (la pena )?(vivir|seguir viviendo)\b/,
    /\bno le encuentro sentido a (vivir|la vida)\b/,
    /\b(hacerme|me hago|me hice|me voy a hacer|me quiero hacer) (dano|danio)\b/,
    /\b(cortarme|me corto|me he cortado|me corte|me estoy cortando) (las venas|los brazos|el brazo|las munecas|la muneca|la piel|las piernas)\b/,
    /\bme (sigo|vuelvo a|volvi a) cortar\b/,
    /\b(lastimarme|me lastimo|me quiero lastimar|autolesion(arme|es)?)\b/,
    /\b(me tome|tome|me voy a tomar|voy a tomar|tomarme) (todas|muchas) (las |mis )?(pastillas|pildoras)\b|\bsobredosis\b/,
    // english
    /\b(kill|killing) myself\b/,
    /\b(end|ending|take|taking) my (own )?life\b/,
    /\bend it all\b/,
    /\b(i )?(want|wanna|going) to die\b|\bi wanna die\b/,
    /\bwish i (was|were) (dead|never born)\b/,
    /\b(don t|do not|dont) want to (live|be alive|wake up|exist)( anymore)?\b/,
    /\bsuicid(e|al)\b/,
    /\b(hurt|harm|cut|cutting|hurting|harming) myself\b|\bself harm(ing)?\b/,
    /\b(everyone|they) (would be|d be) better off without me\b/,
    /\bno (reason|point) (to|in) (live|living|going on)\b/,
    /\boverdos(e|ing)\b|\btook (all )?(the |my )?pills\b/,
  ],
  violence: [
    /\b(voy a|quiero|pienso) matar a\b/,
    /\b(voy a|quiero) (hacerle|hacer) dano a\b/,
    /\b(i m going to|im going to|i will|i want to|gonna) (kill|hurt|shoot|stab) (him|her|them|someone|somebody|my)\b/,
  ],
};

/** minusculas, sin acentos, sin signos, espacios simples; "don't" → "don t". */
export function normalizeForSafety(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** La categoria de crisis que expresa el texto, o null. */
export function detectCrisis(text: string): CrisisCategory | null {
  let normalized = ` ${normalizeForSafety(text)} `;
  for (const idiom of IDIOMS) normalized = normalized.replace(idiom, ' ');
  for (const category of ['self_harm', 'violence'] as const) {
    if (PATTERNS[category].some((pattern) => pattern.test(normalized))) return category;
  }
  return null;
}

/**
 * Proveedor de moderacion con la deteccion de crisis. Solo mira lo que dice la persona
 * (`inbound`); lo que dice el personaje lo gobiernan las reglas del prompt.
 */
export class CrisisLexiconModeration implements ModerationProvider {
  readonly descriptor: ProviderDescriptor = {
    id: 'kotaru-crisis-lexicon',
    capability: 'moderation',
    regions: ['us'],
    locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
    maxSensitivity: 'elevated',
    retentionKnown: true,
    trainingOptOut: true,
    commercialAudioRights: 'unknown',
    quality: 0.6,
    enabled: true,
  };

  async classify(input: { readonly text: string; readonly direction: 'inbound' | 'outbound' }, _ctx: ProviderContext): Promise<ModerationVerdict> {
    const category = input.direction === 'inbound' ? detectCrisis(input.text) : null;
    if (category) {
      return {
        allowed: false,
        categories: [{ category, score: 0.9 }],
        action: 'crisis_handoff',
        policyVersion: SAFETY_POLICY_VERSION,
      };
    }
    return { allowed: true, categories: [], action: 'allow', policyVersion: SAFETY_POLICY_VERSION };
  }

  async health(): Promise<ProviderHealth> {
    return { status: 'healthy', p95LatencyMs: 0, errorRate: 0, observedAt: new Date().toISOString() };
  }
}
