import {
  EMOTIONS,
  parseAffect,
  ProviderError,
  type AffectSignal,
  type CostEstimate,
  type DomainMessage,
  type LanguageModelProvider,
  type LlmEvent,
  type LlmOptions,
  type LlmStopReason,
  type ProviderContext,
  type ProviderDescriptor,
  type ProviderHealth,
} from '@kotaru/ai-contracts';

/**
 * Tarifas verificadas el 2026-09-27 en https://ai.google.dev/gemini-api/docs/pricing
 * (nivel de pago Standard, por millon de tokens de texto). Los tokens de razonamiento
 * se facturan como salida (https://ai.google.dev/gemini-api/docs/thinking).
 */
export const GEMINI_RATES: Readonly<Record<string, { input: number; cachedInput: number; output: number }>> = {
  'gemini-3.1-flash-lite': { input: 0.25, cachedInput: 0.025, output: 1.5 },
  'gemini-3.5-flash-lite': { input: 0.3, cachedInput: 0.3, output: 2.5 },
};
const RATE_VERSION_DATE = '2026-09-27';

export interface GeminiOptions {
  readonly apiKey: string;
  /** `gemini-3.1-flash-lite` es estable; `gemini-3.5-flash-lite` es la alternativa. */
  readonly model?: keyof typeof GEMINI_RATES;
  readonly baseUrl?: string;
  /**
   * El operador confirma que la clave es de un proyecto con facturacion activa. En el
   * nivel gratuito Google usa las conversaciones para mejorar sus productos y personas
   * pueden leerlas; con usuarios reales eso no es aceptable. Sin esta confirmacion el
   * descriptor declara `trainingOptOut: false` y el router lo excluye.
   */
  readonly paidTierConfirmed: boolean;
  /** Gemini 3 no permite apagar el razonamiento; `minimal` es lo mas cercano. */
  readonly thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
  readonly fetch?: typeof fetch;
}

const DEFAULT_BASE = 'https://generativelanguage.googleapis.com';

interface GeminiChunk {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: {
    promptTokenCount?: number;
    cachedContentTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
  };
}

/**
 * LLM de Google Gemini por la API REST `streamGenerateContent` con SSE.
 *
 * Notas de diseño, verificadas en la documentacion el 2026-09-27:
 * - `generateContent` figura como "Legacy" frente a la nueva Interactions API, sin fecha de
 *   retiro. Se usa porque es la forma documentada y estable de hoy; cambiar de API queda
 *   encerrado en este archivo.
 * - La temperatura NO se envia: para Gemini 3 Google recomienda dejar el valor por defecto
 *   (1.0) y advierte de bucles con valores menores.
 * - Los filtros de seguridad de Google vienen apagados por defecto en Gemini 3. La
 *   seguridad de Kotaru no depende de ellos (vive en @kotaru/safety).
 * - Canal de emocion (`affect`): si `allowAffectChannel`, se pide al modelo que empiece con
 *   una etiqueta `[[emocion]]` de la lista cerrada EMOTIONS. `AffectTagFilter` la quita del
 *   texto antes de que llegue a la voz o a la pantalla y la valida; si el modelo no la pone
 *   o pone otra cosa, la respuesta sigue igual y simplemente no hay emocion.
 */
export class GeminiLlmProvider implements LanguageModelProvider {
  readonly descriptor: ProviderDescriptor;
  readonly #options: GeminiOptions;
  readonly #model: keyof typeof GEMINI_RATES;
  readonly #fetch: typeof fetch;
  #lastError: number | null = null;

  constructor(options: GeminiOptions) {
    if (!options.apiKey) throw new Error('Gemini: falta la clave de API');
    this.#options = options;
    this.#model = options.model ?? 'gemini-3.1-flash-lite';
    if (!GEMINI_RATES[this.#model]) throw new Error(`Gemini: modelo sin tarifa verificada: ${this.#model}`);
    this.#fetch = options.fetch ?? fetch;
    this.descriptor = {
      id: `gemini-${this.#model.replace(/^gemini-/, '')}`,
      capability: 'llm',
      regions: ['us'],
      locales: ['en-US', 'es-US', 'es-ES', 'es-419'],
      maxSensitivity: 'elevated',
      // 55 dias de retencion para deteccion de abuso, documentado en usage-policies.
      retentionKnown: true,
      trainingOptOut: options.paidTierConfirmed,
      commercialAudioRights: 'unknown',
      quality: 0.8,
      enabled: true,
    };
  }

  async *stream(messages: readonly DomainMessage[], options: LlmOptions, ctx: ProviderContext): AsyncIterable<LlmEvent> {
    const body = this.#body(messages, options);
    const signal = AbortSignal.any([ctx.signal, AbortSignal.timeout(ctx.deadlineMs)]);

    let response: Response;
    try {
      response = await this.#fetch(
        `${this.#options.baseUrl ?? DEFAULT_BASE}/v1beta/models/${this.#model}:streamGenerateContent?alt=sse`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': this.#options.apiKey },
          body: JSON.stringify(body),
          signal,
        },
      );
    } catch (error) {
      if (ctx.signal.aborted) {
        yield { type: 'stop', reason: 'cancelled' };
        return;
      }
      this.#lastError = Date.now();
      throw new ProviderError(this.descriptor.id, signal.aborted ? 'deadline' : 'network', true);
    }

    if (!response.ok) {
      this.#lastError = Date.now();
      throw await httpError(this.descriptor.id, response);
    }

    let usage: GeminiChunk['usageMetadata'];
    let stop: LlmStopReason = 'complete';
    let emittedChars = 0;
    const tag = options.allowAffectChannel ? new AffectTagFilter() : null;
    try {
      for await (const chunk of sse(response)) {
        if (chunk.usageMetadata) usage = chunk.usageMetadata;
        if (chunk.promptFeedback?.blockReason) stop = 'safety';
        const candidate = chunk.candidates?.[0];
        for (const part of candidate?.content?.parts ?? []) {
          // Los resumenes de razonamiento no son respuesta; nunca llegan al usuario.
          if (part.thought || !part.text) continue;
          emittedChars += part.text.length;
          if (!tag) {
            yield { type: 'token', text: part.text };
            continue;
          }
          const out = tag.push(part.text);
          if (out.crisis) yield { type: 'crisis_signal' };
          if (out.affect) yield { type: 'affect', affect: out.affect };
          if (out.text) yield { type: 'token', text: out.text };
        }
        if (candidate?.finishReason) stop = mapFinish(candidate.finishReason);
      }
    } catch (error) {
      if (ctx.signal.aborted) {
        yield { type: 'stop', reason: 'cancelled' };
        // Cortado a mitad (barge-in): Google no manda el consumo, pero la entrada ya se
        // proceso y lo emitido se cobra. Se estima (~4 caracteres por token) y se marca
        // como supuesto, para no subestimar el costo del turno sin decirlo.
        const inputTokens = Math.ceil(JSON.stringify(body.contents).length / 4) + Math.ceil(JSON.stringify(body.systemInstruction ?? '').length / 4);
        const outputTokens = Math.ceil(emittedChars / 4);
        const estimate = this.#cost(inputTokens, 0, outputTokens);
        yield {
          type: 'usage',
          usage: {
            inputTokens,
            outputTokens,
            billedUnits: [
              { unit: 'input_token_estimated', quantity: inputTokens },
              { unit: 'output_token_estimated', quantity: outputTokens },
            ],
          },
          cost: { amountUsd: estimate.amountUsd, basis: 'assumption', rateCardVersion: estimate.rateCardVersion },
        };
        return;
      }
      this.#lastError = Date.now();
      throw new ProviderError(this.descriptor.id, 'stream_interrupted', true);
    }

    const rest = tag?.flush();
    if (rest) yield { type: 'token', text: rest };
    yield { type: 'stop', reason: stop };
    const inputTokens = usage?.promptTokenCount ?? 0;
    const cached = usage?.cachedContentTokenCount ?? 0;
    const outputTokens = (usage?.candidatesTokenCount ?? 0) + (usage?.thoughtsTokenCount ?? 0);
    yield {
      type: 'usage',
      usage: {
        inputTokens,
        outputTokens,
        ...(cached > 0 ? { cachedInputTokens: cached } : {}),
        billedUnits: [
          { unit: 'input_token', quantity: inputTokens },
          { unit: 'output_token', quantity: outputTokens },
        ],
      },
      cost: this.#cost(inputTokens - cached, cached, outputTokens),
    };
  }

  estimate(input: { readonly inputTokens: number; readonly outputTokens: number }, _ctx: ProviderContext): CostEstimate {
    return this.#cost(input.inputTokens, 0, input.outputTokens);
  }

  async health(): Promise<ProviderHealth> {
    const recent = this.#lastError !== null && Date.now() - this.#lastError < 60_000;
    return { status: recent ? 'degraded' : 'healthy', p95LatencyMs: 0, errorRate: recent ? 1 : 0, observedAt: new Date().toISOString() };
  }

  #cost(input: number, cached: number, output: number): CostEstimate {
    const rate = GEMINI_RATES[this.#model]!;
    const usd = (input * rate.input + cached * rate.cachedInput + output * rate.output) / 1e6;
    return {
      amountUsd: Math.round(usd * 1e6) / 1e6,
      basis: 'verified',
      rateCardVersion: `${this.#model}@${RATE_VERSION_DATE}`,
      verifiedAt: RATE_VERSION_DATE,
    };
  }

  #body(messages: readonly DomainMessage[], options: LlmOptions) {
    const parts = messages.filter((m) => m.role === 'system').map((m) => m.content);
    if (options.allowAffectChannel) parts.push(AFFECT_INSTRUCTION);
    const system = parts.join('\n\n');
    const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (const message of messages) {
      if (message.role === 'system') continue;
      const role = message.role === 'user' ? 'user' : 'model';
      const last = contents.at(-1);
      // Dos mensajes seguidos del mismo rol se juntan: la API espera turnos alternos.
      if (last && last.role === role) last.parts.push({ text: message.content });
      else contents.push({ role, parts: [{ text: message.content }] });
    }
    if (contents.length === 0 || contents.at(-1)!.role !== 'user') {
      throw new ProviderError(this.descriptor.id, 'no_user_message', false);
    }
    return {
      ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
      contents,
      generationConfig: {
        maxOutputTokens: options.maxOutputTokens,
        thinkingConfig: { thinkingLevel: this.#options.thinkingLevel ?? 'minimal' },
      },
    };
  }
}

/** Lo que se pide al modelo para el canal de emocion (va al final de las instrucciones). */
export const AFFECT_INSTRUCTION =
  `Formato técnico: empieza SIEMPRE tu respuesta con una sola etiqueta de emoción, así: [[happy]]. ` +
  `Valores posibles: ${EMOTIONS.join(', ')}. Elige la que mejor refleja cómo dices esta respuesta. ` +
  `La etiqueta la lee la app para animar tu cara: no se pronuncia, no la menciones y no la repitas. ` +
  `Excepción de seguridad: si la persona expresa, aunque sea de forma indirecta, ganas de morir, de ` +
  `hacerse daño o de quitarse la vida, o que está en peligro inmediato, usa [[crisis]] en lugar de la emoción.`;

/** Etiqueta mas larga que se espera al principio: "[[thoughtful]]" con algo de margen. */
const TAG_WINDOW = 32;

/**
 * Quita la etiqueta `[[emocion]]` del principio del texto que llega por trozos. Mientras no
 * sabe si hay etiqueta retiene lo recibido (como mucho TAG_WINDOW caracteres); luego deja
 * pasar todo tal cual. Una etiqueta invalida se quita igual, sin emocion.
 */
export class AffectTagFilter {
  #buffer = '';
  #done = false;

  push(text: string): { text: string; affect?: AffectSignal; crisis?: true } {
    if (this.#done) return { text };
    this.#buffer += text;
    const lead = this.#buffer.trimStart();
    if (lead.length === 0) return { text: '' };
    if (!lead.startsWith('[')) return this.#release(this.#buffer);
    if (lead.length > 1 && !lead.startsWith('[[')) return this.#release(this.#buffer);
    const end = lead.indexOf(']]');
    if (end === -1) {
      return lead.length > TAG_WINDOW ? this.#release(this.#buffer) : { text: '' };
    }
    const name = lead.slice(2, end).trim().toLowerCase();
    const after = lead.slice(end + 2).replace(/^\s+/, '');
    const out = this.#release(after);
    if (name === 'crisis') return { ...out, crisis: true, affect: { emotion: 'concerned', intensity: 0.8 } };
    const affect = parseAffect({ emotion: name, intensity: 0.7 });
    return affect ? { ...out, affect } : out;
  }

  /** Al terminar la respuesta: lo que quedara retenido (una etiqueta sin cerrar se descarta). */
  flush(): string {
    if (this.#done) return '';
    const lead = this.#buffer.trimStart();
    this.#done = true;
    this.#buffer = '';
    return lead.startsWith('[[') ? '' : lead;
  }

  #release(text: string): { text: string } {
    this.#done = true;
    this.#buffer = '';
    return { text };
  }
}

function mapFinish(reason: string): LlmStopReason {
  switch (reason) {
    case 'STOP':
      return 'complete';
    case 'MAX_TOKENS':
      return 'length';
    case 'SAFETY':
    case 'PROHIBITED_CONTENT':
    case 'BLOCKLIST':
    case 'SPII':
    case 'RECITATION':
      return 'safety';
    default:
      return 'complete';
  }
}

async function httpError(providerId: string, response: Response): Promise<ProviderError> {
  let status = '';
  try {
    const body = (await response.json()) as { error?: { status?: string } };
    status = body.error?.status ?? '';
  } catch {
    // cuerpo no JSON
  }
  const retryable = response.status === 429 || response.status >= 500;
  return new ProviderError(providerId, (status || `http_${response.status}`).toLowerCase(), retryable, response.status);
}

/** Lee un cuerpo SSE y entrega cada `data:` ya parseado. */
async function* sse(response: Response): AsyncIterable<GeminiChunk> {
  if (!response.body) return;
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const bytes of response.body as unknown as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(bytes, { stream: true });
    let boundary: number;
    while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
      const event = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, '');
      const data = event
        .split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n');
      if (data) yield JSON.parse(data) as GeminiChunk;
    }
  }
  // Un ultimo evento sin linea en blanco final: suele ser el que trae el consumo y el
  // motivo de parada, asi que no se puede tirar.
  const rest = (buffer + decoder.decode())
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n');
  if (rest.trim()) yield JSON.parse(rest) as GeminiChunk;
}
