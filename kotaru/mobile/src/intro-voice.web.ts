import { visemesFromSpectrum, type Visemes } from './avatar-motion';
import type { CompanionId } from './companions';
import type { Lang } from './i18n';
import { sharedOutput } from './web-audio';

/**
 * Voz de los shorts de presentacion: un saludo corto con risa, generado una vez en el
 * servidor (deploy/intro-voces.py) y servido en /intro/<personaje>-<idioma>.wav. Suena por la
 * misma mezcla que la voz de la conversacion, y da su volumen para mover la boca.
 */
export interface IntroVoice {
  play(id: CompanionId, lang: Lang): void;
  stop(): void;
  playing(): boolean;
  /** Volumen de lo que suena ahora (0 a ~1), para la boca. */
  level(): number;
  /** Vocal que suena ahora (labios). */
  visemes(): Visemes | null;
  dispose(): void;
}

export function createIntroVoice(): IntroVoice {
  const cache = new Map<string, Promise<AudioBuffer | null>>();
  let source: AudioBufferSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  const buf = new Float32Array(1024);
  let spec: Float32Array<ArrayBuffer> | null = null;
  let token = 0;

  const load = (url: string, ctx: AudioContext) => {
    if (!cache.has(url)) {
      cache.set(
        url,
        fetch(url)
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
          .then((data) => ctx.decodeAudioData(data))
          .catch(() => null),
      );
    }
    return cache.get(url)!;
  };

  // Funciones sueltas (sin this): la pantalla las pasa al visor tal cual.
  const level = () => {
    if (!source || !analyser) return 0;
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) sum += v * v;
    return Math.min(1, Math.sqrt(sum / buf.length) * 6);
  };

  const stop = () => {
    token++;
    try {
      source?.stop();
    } catch {
      // ya parado
    }
    source = null;
  };

  return {
    play(id, lang) {
      const out = sharedOutput();
      if (!out) return;
      stop();
      const mine = ++token;
      void out.context.resume();
      void load(`/intro/${id}-${lang}.wav`, out.context).then((audio) => {
        if (!audio || mine !== token) return;
        const src = out.context.createBufferSource();
        src.buffer = audio;
        analyser = out.context.createAnalyser();
        analyser.fftSize = 1024;
        const gain = out.context.createGain();
        gain.gain.value = 0.9;
        src.connect(analyser).connect(gain).connect(out.bus);
        src.onended = () => {
          if (source === src) source = null;
        };
        src.start();
        source = src;
      });
    },
    stop,
    playing: () => source !== null,
    level,
    visemes() {
      if (!source || !analyser) return null;
      if (!spec || spec.length !== analyser.frequencyBinCount) spec = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(spec);
      return visemesFromSpectrum(spec, analyser.context.sampleRate / analyser.fftSize, Math.min(1, level() * 0.75));
    },
    dispose() {
      stop();
      cache.clear();
    },
  };
}
