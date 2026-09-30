import type { CompanionId } from './companions';
import type { Lang } from './i18n';

/** Voz de los shorts de presentacion: en el movil nativo aun no (el short solo existe en la web). */
export interface IntroVoice {
  play(id: CompanionId, lang: Lang): void;
  stop(): void;
  playing(): boolean;
  level(): number;
  dispose(): void;
}

export function createIntroVoice(): IntroVoice {
  return { play() {}, stop() {}, playing: () => false, level: () => 0, dispose() {} };
}
