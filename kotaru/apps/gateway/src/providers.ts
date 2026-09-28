import type {
  LanguageModelProvider,
  ModerationProvider,
  PredictedUsage,
  SpeechToTextProvider,
  TextToSpeechProvider,
} from '@kotaru/ai-contracts';
import { DefaultAiRouter } from '@kotaru/ai-router';
import { MockLlmProvider, MockSttProvider, MockTtsProvider } from '@kotaru/ai-adapters-mock';
import { CrisisLexiconModeration } from '@kotaru/safety';
import { AssemblyAiSttProvider } from '@kotaru/ai-adapters-assemblyai';
import { GeminiLlmProvider, GEMINI_RATES, GeminiTtsProvider } from '@kotaru/ai-adapters-gemini';
import { geminiVoices, maleVoiceIds } from './voices.js';
import { PollyTtsProvider } from '@kotaru/ai-adapters-polly';
import { CartesiaTtsProvider, KokoroTtsProvider, WhisperSttProvider } from '@kotaru/ai-adapters-together';
import type { ProviderResolver, RouterPort } from '@kotaru/orchestrator';
import type { ProviderSettings } from './config.js';

export interface ProviderSet {
  readonly router: RouterPort;
  readonly resolve: ProviderResolver;
  readonly moderation: ModerationProvider;
  /** Ids de los proveedores registrados, para el arranque y /readyz. */
  readonly registered: readonly string[];
  /** Proveedores registrados que el router NO podra elegir, con el motivo. */
  readonly blocked: readonly { readonly id: string; readonly reason: string }[];
  /**
   * Hay un modelo de lenguaje real pero el oido es simulado (p. ej. `gemini,mock-voice`
   * sin AssemblyAI). Con todo simulado (`mock`, desarrollo y pruebas) la voz sigue.
   */
  readonly voiceUnavailable: boolean;
  /** Proveedor de cada voz que se puede elegir en Ajustes (solo las que estan activas). */
  readonly voiceChoices: Readonly<Partial<Record<'gemini' | 'cartesia', string>>>;
}

/**
 * Arma el conjunto de proveedores segun KOTARU_PROVIDERS.
 *
 * - `mock`: simulados, gratis, respuestas fijas. Para probar la app contra el servidor.
 * - `mock-voice`: el oido y la voz simulados que falten (STT si no hay AssemblyAI, TTS si
 *   no hay Polly ni Kokoro), sin LLM simulado. Con `gemini,mock-voice` el chat de texto ya
 *   habla con el modelo real antes de tener las claves de voz.
 * - `assemblyai`, `gemini`, `polly`, `kokoro` y `whisper` (Kokoro-82M y Whisper Large v3
 *   en Together AI): los reales. Cada uno se registra con sus garantias
 *   declaradas (retencion, entrenamiento, derechos de audio) segun las confirmaciones del
 *   operador; el router excluye al que no las cumpla. No se mezclan en silencio: si se
 *   piden reales, el simulado solo entra si tambien se nombra.
 *
 * La moderacion es la deteccion de crisis de @kotaru/safety (frases en espanol e ingles):
 * no depende de ningun proveedor. Un clasificador con modelo se sumara a ella.
 */
export function buildProviders(enabled: readonly string[], settings: ProviderSettings, now: () => number): ProviderSet {
  const stt = new Map<string, SpeechToTextProvider>();
  const llm = new Map<string, LanguageModelProvider>();
  const tts = new Map<string, TextToSpeechProvider>();
  const add = <T extends { descriptor: { id: string } }>(map: Map<string, T>, provider: T) => map.set(provider.descriptor.id, provider);

  if (enabled.includes('mock')) {
    const s = new MockSttProvider();
    const l = new MockLlmProvider();
    const t = new MockTtsProvider();
    add(stt, s);
    add(llm, l);
    add(tts, t);
  } else if (enabled.includes('mock-voice')) {
    // Solo lo que falte: un simulado gratis junto a uno real lo ganaria siempre por precio.
    if (!settings.assemblyai && !settings.whisper) add(stt, new MockSttProvider());
    if (!settings.polly && !settings.kokoro && !settings.cartesia && !settings.geminiTts) add(tts, new MockTtsProvider());
  }
  if (settings.assemblyai) {
    const s = new AssemblyAiSttProvider({
      apiKey: settings.assemblyai.apiKey,
      zeroRetentionConfirmed: settings.assemblyai.zeroRetentionConfirmed,
      keyterms: ['Kotaru', 'Rio', 'Nova', 'Luna'],
    });
    add(stt, s);
  }
  if (settings.gemini) {
    if (!(settings.gemini.model in GEMINI_RATES)) throw new Error(`GEMINI_MODEL sin tarifa verificada: ${settings.gemini.model}`);
    const l = new GeminiLlmProvider({
      apiKey: settings.gemini.apiKey,
      model: settings.gemini.model as keyof typeof GEMINI_RATES,
      paidTierConfirmed: settings.gemini.paidTierConfirmed,
    });
    add(llm, l);
  }
  if (settings.polly) {
    const t = new PollyTtsProvider({
      region: settings.polly.region,
      aiOptOutConfirmed: settings.polly.aiOptOutConfirmed,
      commercialTermsReviewed: settings.polly.commercialTermsReviewed,
      maleVoices: maleVoiceIds(),
    });
    add(tts, t);
  }
  if (settings.whisper) {
    add(stt, new WhisperSttProvider({ apiKey: settings.whisper.apiKey, zeroRetentionConfirmed: settings.whisper.zeroRetentionConfirmed }));
  }
  if (settings.kokoro) {
    add(
      tts,
      new KokoroTtsProvider({
        apiKey: settings.kokoro.apiKey,
        zeroRetentionConfirmed: settings.kokoro.zeroRetentionConfirmed,
        commercialTermsReviewed: settings.kokoro.commercialTermsReviewed,
        maleVoices: maleVoiceIds(),
      }),
    );
  }

  if (settings.cartesia) {
    add(
      tts,
      new CartesiaTtsProvider({
        apiKey: settings.cartesia.apiKey,
        zeroRetentionConfirmed: settings.cartesia.zeroRetentionConfirmed,
        commercialTermsReviewed: settings.cartesia.commercialTermsReviewed,
        maleVoices: maleVoiceIds(),
        voices: settings.cartesia.voices,
      }),
    );
  }

  if (settings.geminiTts) {
    const voices = geminiVoices(settings.geminiTts.voices);
    add(
      tts,
      new GeminiTtsProvider({
        apiKey: settings.geminiTts.apiKey,
        model: settings.geminiTts.model,
        paidTierConfirmed: settings.geminiTts.paidTierConfirmed,
        voices,
        fallback: voices.rio,
        now,
      }),
    );
  }

  // La voz es el producto: Gemini TTS primero; si falla o se agota su cuota diaria, Cartesia
  // (natural en español); Kokoro y Polly quedan al final. Sin esto, en el nivel "balanced"
  // ganaria siempre la mas barata.
  const ttsOrder = [
    ...(settings.geminiTts ? [settings.geminiTts.model] : []),
    ...(settings.cartesia ? ['together-cartesia-sonic-3'] : []),
  ];
  const router = new DefaultAiRouter({ now, preferred: ttsOrder.length > 0 ? { tts: ttsOrder } : {} });
  for (const p of stt.values()) router.register({ descriptor: p.descriptor, estimate: (u: PredictedUsage, c) => p.estimate({ audioSeconds: u.audioSeconds ?? 0 }, c) });
  for (const p of llm.values()) router.register({ descriptor: p.descriptor, estimate: (u: PredictedUsage, c) => p.estimate({ inputTokens: u.inputTokens ?? 0, outputTokens: u.outputTokens ?? 0 }, c) });
  for (const p of tts.values()) router.register({ descriptor: p.descriptor, estimate: (u: PredictedUsage, c) => p.estimate({ characters: u.characters ?? 0 }, c) });

  const all = [...stt.values(), ...llm.values(), ...tts.values()];
  const realLlm = [...llm.keys()].some((id) => !id.startsWith('mock-'));
  const realStt = [...stt.keys()].some((id) => !id.startsWith('mock-'));
  return {
    router,
    resolve: {
      stt: (id) => stt.get(id),
      llm: (id) => llm.get(id),
      tts: (id) => tts.get(id),
    },
    // Deteccion de crisis por frases (es/en), siempre activa y sin proveedor externo.
    moderation: new CrisisLexiconModeration(),
    registered: all.map((p) => p.descriptor.id),
    voiceUnavailable: realLlm && !realStt,
    voiceChoices: {
      ...(settings.geminiTts && tts.has(settings.geminiTts.model) ? { gemini: settings.geminiTts.model } : {}),
      ...(tts.has('together-cartesia-sonic-3') ? { cartesia: 'together-cartesia-sonic-3' } : {}),
    },
    blocked: all.flatMap((p) => {
      const d = p.descriptor;
      if (!d.retentionKnown) return [{ id: d.id, reason: 'retencion sin confirmar' }];
      if (d.trainingOptOut !== true) return [{ id: d.id, reason: 'exclusion de entrenamiento sin confirmar' }];
      if (d.capability === 'tts' && d.commercialAudioRights !== true) return [{ id: d.id, reason: 'derechos comerciales del audio sin revisar' }];
      return [];
    }),
  };
}
