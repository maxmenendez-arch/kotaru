import type { ChirpVoice, GeminiVoice } from '@kotaru/ai-adapters-gemini';
import { COMPANIONS, PERSONAS, type CompanionSlug } from '@kotaru/persona';

/**
 * Las 30 voces predefinidas de Gemini TTS (https://ai.google.dev/gemini-api/docs/speech-generation,
 * consultado el 2026-09-27). Google no publica el genero de cada una; el reparto de abajo es
 * `ASSUMPTION` hasta escucharlas, y por eso se puede cambiar sin tocar codigo con
 * KOTARU_GEMINI_VOICES=nova:Leda,luna:Achernar,rio:Achird.
 */
export const GEMINI_VOICE_NAMES = [
  'Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede', 'Callirrhoe', 'Autonoe',
  'Enceladus', 'Iapetus', 'Umbriel', 'Algieba', 'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar',
  'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi', 'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat',
] as const;

/**
 * Elegidas de oido por el dueño el 2026-09-28 con deploy/muestras-voz.sh: Nova "Leda"
 * (Youthful), Luna "Vindemiatrix" (Gentle, transmite paz) y Rio "Algieba" (Smooth, masculina).
 */
export const DEFAULT_GEMINI_VOICES: Readonly<Record<CompanionSlug, string>> = {
  nova: 'Leda',
  luna: 'Vindemiatrix',
  rio: 'Algieba',
};

/** Voz de Gemini y estilo de lectura de cada personaje. */
export function geminiVoices(overrides: Readonly<Partial<Record<CompanionSlug, string>>> = {}): Record<CompanionSlug, GeminiVoice> {
  const out = {} as Record<CompanionSlug, GeminiVoice>;
  for (const slug of COMPANIONS) {
    out[slug] = { voice: overrides[slug] ?? DEFAULT_GEMINI_VOICES[slug], style: PERSONAS[slug].delivery };
  }
  return out;
}

/**
 * Voz Chirp 3 HD de cada personaje: la misma que en Gemini (con los cambios de
 * KOTARU_GEMINI_VOICES) y una velocidad que da algo de su caracter, porque Chirp no acepta
 * instrucciones de actuacion: Nova algo mas lenta, Rio algo mas vivo.
 */
export const CHIRP_RATES: Readonly<Record<CompanionSlug, number>> = { nova: 0.95, luna: 0.95, rio: 1.03 };

export function chirpVoices(overrides: Readonly<Partial<Record<CompanionSlug, string>>> = {}): Record<CompanionSlug, ChirpVoice> {
  const out = {} as Record<CompanionSlug, ChirpVoice>;
  for (const slug of COMPANIONS) out[slug] = { voice: overrides[slug] ?? DEFAULT_GEMINI_VOICES[slug], speakingRate: CHIRP_RATES[slug] };
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

/**
 * `luna:<uuid>,rio:<uuid>` → ids de voz de Cartesia por personaje (KOTARU_CARTESIA_VOICES).
 * Solo se comprueba la forma (un id de Cartesia es un UUID); que exista lo dice Together.
 */
export function parseCartesiaVoices(raw: string | undefined, problems: string[]): Partial<Record<CompanionSlug, string>> {
  const out: Partial<Record<CompanionSlug, string>> = {};
  for (const pair of (raw ?? '').split(',').map((p) => p.trim()).filter(Boolean)) {
    const [slug, id] = pair.split(':').map((p) => p.trim());
    if (!slug || !id || !(COMPANIONS as readonly string[]).includes(slug)) {
      problems.push(`KOTARU_CARTESIA_VOICES: "${pair}" debe ser personaje:id (personajes: ${COMPANIONS.join(', ')})`);
      continue;
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      problems.push(`KOTARU_CARTESIA_VOICES: "${id}" no es un id de voz de Cartesia`);
      continue;
    }
    out[slug as CompanionSlug] = id;
  }
  return out;
}
