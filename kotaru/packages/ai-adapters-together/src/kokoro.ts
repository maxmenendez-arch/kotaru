import type { Locale } from '@kotaru/ai-contracts';
import { TogetherSpeechProvider, type TogetherSpeechOptions } from './speech.js';

/**
 * Tarifa verificada el 2026-09-27 en https://docs.together.ai/docs/text-to-speech:
 * Kokoro-82M, 4 USD por millon de caracteres (Polly Neural: 16). Es la palanca de D-011.
 */
export const KOKORO_RATE = { version: 'together-kokoro@2026-09-27', verifiedAt: '2026-09-27', perMillionCharsUsd: 4 } as const;

/**
 * Voces de Kokoro por idioma (https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md,
 * consultado el 2026-09-27). En español solo hay tres (ef_dora, em_alex, em_santa) y el
 * propio modelo avisa de que su soporte fuera del inglés puede ser flojo.
 */
const VOICES: Readonly<Record<Locale, { readonly female: string; readonly male: string; readonly language: string }>> = {
  'es-419': { female: 'ef_dora', male: 'em_alex', language: 'es' },
  'es-US': { female: 'ef_dora', male: 'em_alex', language: 'es' },
  'es-ES': { female: 'ef_dora', male: 'em_alex', language: 'es' },
  'en-US': { female: 'af_heart', male: 'am_michael', language: 'en' },
};

export type KokoroOptions = TogetherSpeechOptions;

/** Kokoro-82M en Together: la voz mas barata; ultimo respaldo (el dueño la nota poco natural). */
export class KokoroTtsProvider extends TogetherSpeechProvider {
  constructor(options: KokoroOptions) {
    super(
      {
        id: 'together-kokoro',
        model: 'hexgrad/Kokoro-82M',
        rate: KOKORO_RATE,
        // Por debajo del resto: el dueño la oyo plana y poco natural (2026-09-28).
        quality: 0.6,
        voiceFor: (_voiceId, locale, male) => {
          const v = VOICES[locale];
          return { voice: male ? v.male : v.female, language: v.language };
        },
      },
      options,
    );
  }
}
