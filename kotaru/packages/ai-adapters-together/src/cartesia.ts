import type { Locale } from '@kotaru/ai-contracts';
import { TogetherSpeechProvider, type TogetherSpeechOptions } from './speech.js';

/**
 * Tarifa verificada el 2026-09-28 en https://www.together.ai/pricing: Cartesia Sonic-3,
 * 65 USD por millon de caracteres (Kokoro: 4; Gemini TTS: ~6 USD/M tokens de audio).
 */
export const CARTESIA_RATE = { version: 'together-cartesia-sonic-3@2026-09-28', verifiedAt: '2026-09-28', perMillionCharsUsd: 65 } as const;

/**
 * Voces de Cartesia (ids de https://api.together.ai/v1/voices?model=cartesia/sonic-3,
 * consultado el 2026-09-28). Sonic-3 es multilingue: la misma voz habla español con
 * `language: es`; transcritas con Whisper, las muestras salieron sin un solo error.
 * Luna la eligio el dueño; Nova y Rio, por su descripcion hasta que las oiga. Se cambian con
 * KOTARU_CARTESIA_VOICES=luna:<id>,nova:<id>,rio:<id>.
 */
export const DEFAULT_CARTESIA_VOICES: Readonly<Record<string, string>> = {
  /** "Helena - Solution Facilitator": elegida de oido por el dueño el 2026-09-28. */
  luna: '8a6d0b8e-8cd8-4952-a41e-b7af18662135',
  /** "Lucia - Radiant Host": luminosa y segura, para el coqueteo ligero. */
  nova: 'c0925108-d541-4dc4-bbae-39f4e57ba10c',
  /** "Mateo - Friendly Host": chico, cercano y con energia, para el entretenimiento. */
  rio: '2fc4f1ec-bfd0-46f1-8e6d-d4279eaaf838',
};

export interface CartesiaOptions extends TogetherSpeechOptions {
  /** Voz por personaje (voiceId de Kotaru -> id de voz de Cartesia). */
  readonly voices?: Readonly<Record<string, string>>;
}

/**
 * Cartesia Sonic-3 en Together: voz natural y expresiva en español, sin cuota diaria. Es el
 * respaldo de Gemini TTS (cuando se agota su tope diario) antes de Kokoro.
 */
export class CartesiaTtsProvider extends TogetherSpeechProvider {
  constructor(options: CartesiaOptions) {
    const voices = { ...DEFAULT_CARTESIA_VOICES, ...options.voices };
    super(
      {
        id: 'together-cartesia-sonic-3',
        model: 'cartesia/sonic-3',
        rate: CARTESIA_RATE,
        // ASSUMPTION: por encima de Kokoro y por debajo de Gemini TTS hasta la prueba de oido.
        quality: 0.85,
        voiceFor: (voiceId: string, locale: Locale, male: boolean) => ({
          voice: voices[voiceId] ?? (male ? voices['rio']! : voices['luna']!),
          language: locale.startsWith('es') ? 'es' : 'en',
        }),
      },
      options,
    );
  }
}
