import type {
  LanguageModelProvider,
  ModerationProvider,
  PredictedUsage,
  SpeechToTextProvider,
  TextToSpeechProvider,
} from '@kotaru/ai-contracts';
import { DefaultAiRouter } from '@kotaru/ai-router';
import { MockLlmProvider, MockModerationProvider, MockSttProvider, MockTtsProvider } from '@kotaru/ai-adapters-mock';
import { AssemblyAiSttProvider } from '@kotaru/ai-adapters-assemblyai';
import { GeminiLlmProvider, GEMINI_RATES } from '@kotaru/ai-adapters-gemini';
import { PollyTtsProvider } from '@kotaru/ai-adapters-polly';
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
}

/**
 * Arma el conjunto de proveedores segun KOTARU_PROVIDERS.
 *
 * - `mock`: simulados, gratis, respuestas fijas. Para probar la app contra el servidor.
 * - `assemblyai`, `gemini`, `polly`: los reales. Cada uno se registra con sus garantias
 *   declaradas (retencion, entrenamiento, derechos de audio) segun las confirmaciones del
 *   operador; el router excluye al que no las cumpla. No se mezclan en silencio: si se
 *   piden reales, el simulado solo entra si tambien se nombra.
 *
 * La moderacion sigue siendo la simulada: todavia no hay proveedor real de moderacion, y
 * la politica de seguridad de Kotaru (@kotaru/safety) se aplica igual sobre su veredicto.
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
  }
  if (settings.assemblyai) {
    const s = new AssemblyAiSttProvider({
      apiKey: settings.assemblyai.apiKey,
      zeroRetentionConfirmed: settings.assemblyai.zeroRetentionConfirmed,
      keyterms: ['Kotaru', 'Rio', 'Nova', 'Sage'],
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
    });
    add(tts, t);
  }

  const router = new DefaultAiRouter({ now });
  for (const p of stt.values()) router.register({ descriptor: p.descriptor, estimate: (u: PredictedUsage, c) => p.estimate({ audioSeconds: u.audioSeconds ?? 0 }, c) });
  for (const p of llm.values()) router.register({ descriptor: p.descriptor, estimate: (u: PredictedUsage, c) => p.estimate({ inputTokens: u.inputTokens ?? 0, outputTokens: u.outputTokens ?? 0 }, c) });
  for (const p of tts.values()) router.register({ descriptor: p.descriptor, estimate: (u: PredictedUsage, c) => p.estimate({ characters: u.characters ?? 0 }, c) });

  const all = [...stt.values(), ...llm.values(), ...tts.values()];
  return {
    router,
    resolve: {
      stt: (id) => stt.get(id),
      llm: (id) => llm.get(id),
      tts: (id) => tts.get(id),
    },
    moderation: new MockModerationProvider(),
    registered: all.map((p) => p.descriptor.id),
    blocked: all.flatMap((p) => {
      const d = p.descriptor;
      if (!d.retentionKnown) return [{ id: d.id, reason: 'retencion sin confirmar' }];
      if (d.trainingOptOut !== true) return [{ id: d.id, reason: 'exclusion de entrenamiento sin confirmar' }];
      if (d.capability === 'tts' && d.commercialAudioRights !== true) return [{ id: d.id, reason: 'derechos comerciales del audio sin revisar' }];
      return [];
    }),
  };
}
