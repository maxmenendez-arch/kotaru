import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import { ProviderError, type LlmEvent, type LlmOptions, type ProviderContext } from '@kotaru/ai-contracts';
import { AFFECT_INSTRUCTION, AffectTagFilter, GeminiLlmProvider } from '../src/index.js';

let server: Server | null = null;
let lastRequest: { url: string; headers: IncomingMessage['headers']; body: any } | null = null;

type Reply = { status?: number; chunks?: unknown[]; json?: unknown; delayMs?: number; hang?: boolean; noTrailingBlank?: boolean };

async function fakeGemini(reply: Reply): Promise<string> {
  server = createServer(async (req, res) => {
    let raw = '';
    for await (const c of req) raw += c;
    lastRequest = { url: req.url ?? '', headers: req.headers, body: JSON.parse(raw) };
    if (reply.status && reply.status !== 200) {
      res.writeHead(reply.status, { 'content-type': 'application/json' }).end(JSON.stringify(reply.json ?? {}));
      return;
    }
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    const chunks = reply.chunks ?? [];
    for (const [i, chunk] of chunks.entries()) {
      // El ultimo sin linea en blanco final, a proposito: el adaptador no debe perderlo.
      const last = i === chunks.length - 1 && reply.noTrailingBlank;
      res.write(`data: ${JSON.stringify(chunk)}${last ? '' : '\r\n\r\n'}`);
      if (reply.delayMs) await new Promise((r) => setTimeout(r, reply.delayMs));
    }
    if (reply.hang) return; // deja la conexion abierta
    res.end();
  });
  await new Promise<void>((r) => server!.listen(0, '127.0.0.1', r));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

afterEach(async () => {
  server?.closeAllConnections();
  await new Promise<void>((r) => (server ? server.close(() => r()) : r()));
  server = null;
  lastRequest = null;
});

const opts: LlmOptions = { personaId: 'rio-v1', promptVersion: '0.1.0', maxOutputTokens: 256, temperature: 0.7, allowAffectChannel: true };
const ctx = (signal = new AbortController().signal, deadlineMs = 5000): ProviderContext => ({
  requestId: 'r', subjectId: 's', region: 'us', locale: 'es-419', sensitivity: 'standard',
  budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: 1 }, deadlineMs, signal,
});
const provider = (baseUrl: string) => new GeminiLlmProvider({ apiKey: 'clave-gemini', baseUrl, paidTierConfirmed: true });
async function collect(events: AsyncIterable<LlmEvent>) {
  const out: LlmEvent[] = [];
  for await (const e of events) out.push(e);
  return out;
}

const chunk = (text: string, extra: object = {}) => ({ candidates: [{ content: { role: 'model', parts: [{ text }] }, ...extra }] });

describe('Gemini streamGenerateContent', () => {
  it('pide el modelo por la ruta SSE, con la clave en cabecera y nunca en la URL', async () => {
    const base = await fakeGemini({ chunks: [chunk('Hola', { finishReason: 'STOP' })] });
    await collect(provider(base).stream([{ role: 'user', content: 'hola' }], opts, ctx()));
    expect(lastRequest!.url).toBe('/v1beta/models/gemini-3.1-flash-lite:streamGenerateContent?alt=sse');
    expect(lastRequest!.headers['x-goog-api-key']).toBe('clave-gemini');
    expect(lastRequest!.url).not.toContain('clave');
  });

  it('traduce la conversacion: system aparte, companion como model, roles repetidos juntos', async () => {
    const base = await fakeGemini({ chunks: [chunk('ok', { finishReason: 'STOP' })] });
    await collect(
      provider(base).stream(
        [
          { role: 'system', content: 'Eres Rio.' },
          { role: 'user', content: 'hola' },
          { role: 'companion', content: 'hola!' },
          { role: 'system', content: 'Recuerdos: le gusta el mar' },
          { role: 'user', content: 'que tal' },
          { role: 'user', content: 'sigo aqui' },
        ],
        opts,
        ctx(),
      ),
    );
    const body = lastRequest!.body;
    expect(body.systemInstruction.parts[0].text).toBe(`Eres Rio.\n\nRecuerdos: le gusta el mar\n\n${AFFECT_INSTRUCTION}`);
    expect(body.contents.map((c: any) => c.role)).toEqual(['user', 'model', 'user']);
    expect(body.contents[2].parts).toEqual([{ text: 'que tal' }, { text: 'sigo aqui' }]);
    expect(body.generationConfig).toEqual({ maxOutputTokens: 256, thinkingConfig: { thinkingLevel: 'minimal' } });
    expect(body.generationConfig.temperature).toBeUndefined();
  });

  it('emite los tokens en orden, ignora el razonamiento y cobra el razonamiento como salida', async () => {
    const base = await fakeGemini({
      chunks: [
        { candidates: [{ content: { parts: [{ text: 'pensando...', thought: true }] } }] },
        chunk('Qué '),
        chunk('bonito.', { finishReason: 'STOP' }),
        { usageMetadata: { promptTokenCount: 1000, candidatesTokenCount: 100, thoughtsTokenCount: 100 } },
      ],
    });
    const events = await collect(provider(base).stream([{ role: 'user', content: 'hola' }], opts, ctx()));
    expect(events.filter((e) => e.type === 'token').map((e) => (e as { text: string }).text).join('')).toBe('Qué bonito.');
    expect(events.find((e) => e.type === 'stop')).toEqual({ type: 'stop', reason: 'complete' });
    const usage = events.find((e) => e.type === 'usage') as Extract<LlmEvent, { type: 'usage' }>;
    expect(usage.usage).toMatchObject({ inputTokens: 1000, outputTokens: 200 });
    // 1000 * 0.25/1e6 + 200 * 1.5/1e6 = 0.00055
    expect(usage.cost).toMatchObject({ amountUsd: 0.00055, basis: 'verified', verifiedAt: '2026-09-27' });
  });

  it('corte por seguridad o por longitud se informa como tal', async () => {
    const safety = await fakeGemini({ chunks: [chunk('', { finishReason: 'SAFETY' })] });
    expect((await collect(provider(safety).stream([{ role: 'user', content: 'x' }], opts, ctx()))).find((e) => e.type === 'stop')).toEqual({ type: 'stop', reason: 'safety' });
  });

  it('429 es reintentable; 400 no; el mensaje nunca lleva la clave', async () => {
    const limited = await fakeGemini({ status: 429, json: { error: { code: 429, status: 'RESOURCE_EXHAUSTED' } } });
    const e1 = await collect(provider(limited).stream([{ role: 'user', content: 'x' }], opts, ctx())).catch((e: unknown) => e);
    expect(e1).toBeInstanceOf(ProviderError);
    expect(e1).toMatchObject({ code: 'resource_exhausted', retryable: true, status: 429 });
    expect(String((e1 as Error).message)).not.toContain('clave');

    server!.close();
    const bad = await fakeGemini({ status: 400, json: { error: { code: 400, status: 'INVALID_ARGUMENT' } } });
    const e2 = await collect(provider(bad).stream([{ role: 'user', content: 'x' }], opts, ctx())).catch((e: unknown) => e);
    expect(e2).toMatchObject({ code: 'invalid_argument', retryable: false });
  });

  it('interrumpir (barge-in) corta el stream y lo informa como cancelado', async () => {
    const base = await fakeGemini({ chunks: [chunk('uno '), chunk('dos '), chunk('tres ')], delayMs: 200, hang: true });
    const controller = new AbortController();
    const events: LlmEvent[] = [];
    const started = Date.now();
    for await (const e of provider(base).stream([{ role: 'user', content: 'x' }], opts, ctx(controller.signal))) {
      events.push(e);
      if (e.type === 'token') controller.abort();
    }
    expect(Date.now() - started).toBeLessThan(1500);
    expect(events.find((e) => e.type === 'stop')).toEqual({ type: 'stop', reason: 'cancelled' });
    // Lo ya procesado se cobra igual: estimado y marcado como supuesto, no como tarifa exacta.
    const usage = events.at(-1) as Extract<LlmEvent, { type: 'usage' }>;
    expect(usage.type).toBe('usage');
    expect(usage.cost.basis).toBe('assumption');
    expect(usage.cost.amountUsd).toBeGreaterThan(0);
  });

  it('un servidor que no responde a tiempo es un error reintentable', async () => {
    const base = await fakeGemini({ chunks: [], hang: true });
    const error = await collect(provider(base).stream([{ role: 'user', content: 'x' }], opts, ctx(undefined, 300))).catch((e: unknown) => e);
    expect(error).toMatchObject({ retryable: true });
  });

  it('sin nivel de pago confirmado no declara exclusion de entrenamiento', () => {
    const p = new GeminiLlmProvider({ apiKey: 'k', paidTierConfirmed: false });
    expect(p.descriptor.trainingOptOut).toBe(false);
  });

  it('la conversacion debe terminar en un mensaje del usuario', async () => {
    const base = await fakeGemini({ chunks: [] });
    const error = await collect(provider(base).stream([{ role: 'system', content: 'x' }], opts, ctx())).catch((e: unknown) => e);
    expect(error).toMatchObject({ code: 'no_user_message', retryable: false });
  });

  it('no pierde el ultimo evento si el stream no termina en linea en blanco', async () => {
    const base = await fakeGemini({
      chunks: [chunk('Hola.'), { candidates: [{ finishReason: 'MAX_TOKENS' }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } }],
      noTrailingBlank: true,
    });
    const events = await collect(provider(base).stream([{ role: 'user', content: 'x' }], opts, ctx()));
    expect(events.find((e) => e.type === 'stop')).toEqual({ type: 'stop', reason: 'length' });
    expect(events.find((e) => e.type === 'usage')).toMatchObject({ usage: { inputTokens: 10, outputTokens: 5 } });
  });
});

describe('canal de emocion de Gemini', () => {
  const run = (parts: string[]) => {
    const f = new AffectTagFilter();
    const out = parts.map((p) => f.push(p));
    return { text: out.map((o) => o.text).join('') + f.flush(), affects: out.filter((o) => o.affect).map((o) => o.affect) };
  };

  it('quita la etiqueta aunque llegue partida y emite la emocion', () => {
    expect(run(['[[ha', 'ppy]] ¡Qué ', 'bien!'])).toEqual({ text: '¡Qué bien!', affects: [{ emotion: 'happy', intensity: 0.7 }] });
    expect(run(['  [[Concerned]]\nOye, ¿estás bien?'])).toEqual({ text: 'Oye, ¿estás bien?', affects: [{ emotion: 'concerned', intensity: 0.7 }] });
  });

  it('sin etiqueta, el texto pasa intacto y sin emocion', () => {
    expect(run(['Hola, ', 'qué tal'])).toEqual({ text: 'Hola, qué tal', affects: [] });
    expect(run(['[nota] hola'])).toEqual({ text: '[nota] hola', affects: [] });
  });

  it('una emocion fuera de la lista se quita pero no se emite; una etiqueta rota no se come la respuesta', () => {
    expect(run(['[[furioso]] vale'])).toEqual({ text: 'vale', affects: [] });
    expect(run(['[[', 'esto no se cierra nunca y sigue y sigue y sigue'])).toEqual({ text: '[[esto no se cierra nunca y sigue y sigue y sigue', affects: [] });
  });

  it('el proveedor emite affect antes del texto y sin la etiqueta en los tokens', async () => {
    const base = await fakeGemini({ chunks: [chunk('[[play'), chunk('ful]] Te '), chunk('reto.', { finishReason: 'STOP' })] });
    const events = await collect(provider(base).stream([{ role: 'user', content: 'hola' }], opts, ctx()));
    const affect = events.findIndex((e) => e.type === 'affect');
    const firstToken = events.findIndex((e) => e.type === 'token');
    expect(events[affect]).toEqual({ type: 'affect', affect: { emotion: 'playful', intensity: 0.7 } });
    expect(affect).toBeLessThan(firstToken);
    expect(events.filter((e) => e.type === 'token').map((e) => (e as { text: string }).text).join('')).toBe('Te reto.');
  });

  it('sin canal de emocion no se pide etiqueta ni se filtra nada', async () => {
    const base = await fakeGemini({ chunks: [chunk('[[happy]] hola', { finishReason: 'STOP' })] });
    const events = await collect(provider(base).stream([{ role: 'user', content: 'hola' }], { ...opts, allowAffectChannel: false }, ctx()));
    expect(lastRequest!.body.systemInstruction).toBeUndefined();
    expect(events.filter((e) => e.type === 'token').map((e) => (e as { text: string }).text).join('')).toBe('[[happy]] hola');
  });
});
