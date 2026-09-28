import type { GeminiVoice } from '@kotaru/ai-adapters-gemini';
import { COMPANIONS, PERSONAS, type CompanionSlug } from '@kotaru/persona';

/**
 * Las 30 voces predefinidas de Gemini TTS (https://ai.google.dev/gemini-api/docs/speech-generation,
 * consultado el 2026-09-27). Google no publica el genero de cada una; el reparto de abajo es
 * `ASSUMPTION` hasta escucharlas, y por eso se puede cambiar sin tocar codigo con
 * KOTARU_GEMINI_VOICES=nova:Leda,sage:Sulafat,rio:Achird.
 */
export const GEMINI_VOICE_NAMES = [
  'Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede', 'Callirrhoe', 'Autonoe',
  'Enceladus', 'Iapetus', 'Umbriel', 'Algieba', 'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar',
  'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi', 'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat',
] as const;

/** Nova: "Upbeat"; Sage: "Gentle"; Rio: "Friendly" (descripciones de Google). */
export const DEFAULT_GEMINI_VOICES: Readonly<Record<CompanionSlug, string>> = {
  nova: 'Laomedeia',
  sage: 'Vindemiatrix',
  rio: 'Achird',
};

/** Voz de Gemini y estilo de lectura de cada personaje. */
export function geminiVoices(overrides: Readonly<Partial<Record<CompanionSlug, string>>> = {}): Record<CompanionSlug, GeminiVoice> {
  const out = {} as Record<CompanionSlug, GeminiVoice>;
  for (const slug of COMPANIONS) {
    out[slug] = { voice: overrides[slug] ?? DEFAULT_GEMINI_VOICES[slug], style: PERSONAS[slug].delivery };
  }
  return out;
}

/** Ids de voz (slugs) que Kokoro y Polly deben leer con voz masculina. */
export function maleVoiceIds(): string[] {
  return COMPANIONS.filter((slug) => PERSONAS[slug].gender === 'male');
}

/** `nova:Leda,rio:Achird` → { nova: 'Leda', rio: 'Achird' }; los errores van a `problems`. */
export function parseVoiceOverrides(raw: string | undefined, problems: string[]): Partial<Record<CompanionSlug, string>> {
  const out: Partial<Record<CompanionSlug, string>> = {};
  for (const pair of (raw ?? '').split(',').map((p) => p.trim()).filter(Boolean)) {
    const [slug, voice] = pair.split(':').map((p) => p.trim());
    if (!slug || !voice || !(COMPANIONS as readonly string[]).includes(slug)) {
      problems.push(`KOTARU_GEMINI_VOICES: "${pair}" debe ser personaje:Voz (personajes: ${COMPANIONS.join(', ')})`);
      continue;
    }
    if (!(GEMINI_VOICE_NAMES as readonly string[]).includes(voice)) {
      problems.push(`KOTARU_GEMINI_VOICES: "${voice}" no es una voz de Gemini`);
      continue;
    }
    out[slug as CompanionSlug] = voice;
  }
  return out;
}
