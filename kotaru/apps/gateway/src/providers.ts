import type { ModerationProvider } from '@kotaru/ai-contracts';
import { DefaultAiRouter } from '@kotaru/ai-router';
import { MockLlmProvider, MockModerationProvider, MockSttProvider, MockTtsProvider } from '@kotaru/ai-adapters-mock';
import type { ProviderResolver, RouterPort } from '@kotaru/orchestrator';

export interface ProviderSet {
  readonly router: RouterPort;
  readonly resolve: ProviderResolver;
  readonly moderation: ModerationProvider;
  /** Ids de los proveedores registrados, para el arranque y /readyz. */
  readonly registered: readonly string[];
}

/**
 * Arma el conjunto de proveedores segun la configuracion.
 *
 * Hoy solo existen los simulados: responden con guiones fijos y no cuestan nada, y
 * sirven para probar la app contra el servidor de verdad. Los adaptadores reales se
 * registran aqui cuando existan y esten habilitados por KOTARU_PROVIDERS.
 */
export function buildProviders(enabled: readonly string[], now: () => number): ProviderSet {
  const unknown = enabled.filter((id) => id !== 'mock');
  if (unknown.length > 0) {
    throw new Error(`Proveedores desconocidos en KOTARU_PROVIDERS: ${unknown.join(', ')}`);
  }

  const stt = new MockSttProvider();
  const llm = new MockLlmProvider();
  const tts = new MockTtsProvider();

  const router = new DefaultAiRouter({ now })
    .register({ descriptor: stt.descriptor, estimate: (p, c) => stt.estimate({ audioSeconds: p.audioSeconds ?? 0 }, c) })
    .register({ descriptor: llm.descriptor, estimate: (p, c) => llm.estimate({ inputTokens: p.inputTokens ?? 0, outputTokens: p.outputTokens ?? 0 }, c) })
    .register({ descriptor: tts.descriptor, estimate: (p, c) => tts.estimate({ characters: p.characters ?? 0 }, c) });

  return {
    router,
    resolve: {
      stt: (id) => (id === stt.descriptor.id ? stt : undefined),
      llm: (id) => (id === llm.descriptor.id ? llm : undefined),
      tts: (id) => (id === tts.descriptor.id ? tts : undefined),
    },
    moderation: new MockModerationProvider(),
    registered: [stt.descriptor.id, llm.descriptor.id, tts.descriptor.id],
  };
}
