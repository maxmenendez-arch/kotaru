import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import { WebSocketServer } from 'ws';
import { DefaultAiRouter } from '@kotaru/ai-router';
import { AssemblyAiSttProvider } from '@kotaru/ai-adapters-assemblyai';
import { GeminiLlmProvider } from '@kotaru/ai-adapters-gemini';
import { PollyTtsProvider, type PollyLike } from '@kotaru/ai-adapters-polly';
import { MockModerationProvider } from '@kotaru/ai-adapters-mock';
import { InMemoryUsageLedger } from '@kotaru/billing';
import { MemoryStore } from '@kotaru/memory';
import { InMemorySink } from '@kotaru/telemetry';
import { PROTOCOL_VERSION, signGrant, type ServerMessage } from '@kotaru/gateway';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, claims, connect, key, waitFor } from './helpers.js';

/**
 * Un turno completo por el gateway con los TRES adaptadores reales, cada uno hablando con
 * un servidor falso que sigue el protocolo documentado. Prueba el cableado de verdad
 * (formatos de audio, orden de eventos, costos verificados) sin red ni gasto.
 */
let aai: WebSocketServer | null = null;
let gemini: Server | null = null;
let gateway: GatewayServerHandle | null = null;
let geminiBody: any = null;

afterEach(async () => {
  await gateway?.close();
  gemini?.closeAllConnections();
  await new Promise<void>((r) => (gemini ? gemini.close(() => r()) : r()));
  await new Promise<void>((r) => (aai ? aai.close(() => r()) : r()));
  aai = gemini = gateway = null;
});

async function fakeAssemblyAi(): Promise<string> {
  aai = new WebSocketServer({ port: 0 });
  aai.on('connection', (socket) => {
    let frames = 0;
    socket.on('message', (data: Buffer, isBinary: boolean) => {
      if (isBinary) {
        frames += 1;
        if (frames === 2) socket.send(JSON.stringify({ type: 'Turn', turn_order: 0, end_of_turn: false, transcript: 'me gusta' }));
        return;
      }
      const m = JSON.parse(data.toString()) as { type: string };
      if (m.type === 'ForceEndpoint') socket.send(JSON.stringify({ type: 'Turn', turn_order: 0, end_of_turn: true, transcript: 'Me gusta el mar en invierno.' }));
      if (m.type === 'Terminate') {
        socket.send(JSON.stringify({ type: 'Termination', session_duration_seconds: 3, audio_duration_seconds: 1 }));
        socket.close(1000);
      }
    });
  });
  await new Promise<void>((r) => aai!.once('listening', () => r()));
  return `ws://127.0.0.1:${(aai.address() as AddressInfo).port}/v3/ws`;
}

async function fakeGemini(): Promise<string> {
  gemini = createServer(async (req, res) => {
    let raw = '';
    for await (const c of req) raw += c;
    geminiBody = JSON.parse(raw);
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    const chunks = [
      { candidates: [{ content: { parts: [{ text: 'Qué bonito. ' }] } }] },
      { candidates: [{ content: { parts: [{ text: 'Cuéntame más.' }] }, finishReason: 'STOP' }] },
      { usageMetadata: { promptTokenCount: 400, candidatesTokenCount: 20, thoughtsTokenCount: 0 } },
    ];
    for (const c of chunks) res.write(`data: ${JSON.stringify(c)}\n\n`);
    res.end();
  });
  await new Promise<void>((r) => gemini!.listen(0, '127.0.0.1', r));
  return `http://127.0.0.1:${(gemini.address() as AddressInfo).port}`;
}

const polly: PollyLike = {
  async send(command) {
    const bytes = (command.input.Text?.length ?? 0) * 600;
    return { AudioStream: (async function* () { yield new Uint8Array(bytes); })() };
  },
};

describe('gateway con adaptadores reales (contra servidores falsos)', () => {
  it('transcribe, responde, sintetiza y cobra con tarifas verificadas', async () => {
    const stt = new AssemblyAiSttProvider({ apiKey: 'k', url: await fakeAssemblyAi(), zeroRetentionConfirmed: true, finalizeTimeoutMs: 800 });
    const llm = new GeminiLlmProvider({ apiKey: 'k', baseUrl: await fakeGemini(), paidTierConfirmed: true });
    const tts = new PollyTtsProvider({ client: polly, aiOptOutConfirmed: true, commercialTermsReviewed: true });
    const now = () => Date.now();
    const router = new DefaultAiRouter({ now })
      .register({ descriptor: stt.descriptor, estimate: (p, c) => stt.estimate({ audioSeconds: p.audioSeconds ?? 0 }, c) })
      .register({ descriptor: llm.descriptor, estimate: (p, c) => llm.estimate({ inputTokens: p.inputTokens ?? 0, outputTokens: p.outputTokens ?? 0 }, c) })
      .register({ descriptor: tts.descriptor, estimate: (p, c) => tts.estimate({ characters: p.characters ?? 0 }, c) });
    const sink = new InMemorySink();

    gateway = await startGatewayServer({
      port: 0, keys: [key], audience: AUDIENCE,
      deps: {
        router,
        resolve: { stt: () => stt, llm: () => llm, tts: () => tts },
        moderation: new MockModerationProvider(),
        memory: new MemoryStore({ now, newId: () => crypto.randomUUID() }),
        usage: new InMemoryUsageLedger(),
        sink,
        budget: { hardCapUsd: 50 },
        now,
        infraCostUsd: 0,
      },
    });

    const { socket, collected } = await connect(gateway.port);
    socket.send(JSON.stringify({ type: 'hello', grant: signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    for (let i = 0; i < 10; i += 1) {
      socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
      await new Promise((r) => setTimeout(r, 15));
    }
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 't1' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done'), 8000);

    const final = collected.messages.find((m): m is Extract<ServerMessage, { type: 'transcript' }> => m.type === 'transcript' && m.final);
    expect(final?.text).toBe('Me gusta el mar en invierno.');
    expect(collected.messages.filter((m) => m.type === 'token').map((m) => (m as { text: string }).text).join('')).toBe('Qué bonito. Cuéntame más.');
    // El LLM recibio lo que dijo el usuario, como ultimo mensaje de usuario.
    expect(geminiBody.contents.at(-1)).toEqual({ role: 'user', parts: [{ text: 'Me gusta el mar en invierno.' }] });
    // El audio de Polly llega a 16 kHz y la app lo sabe por audio_meta.
    const meta = collected.messages.filter((m) => m.type === 'audio_meta');
    expect(meta.length).toBeGreaterThan(0);
    expect(meta.every((m) => (m as { sampleRate: number }).sampleRate === 16000)).toBe(true);
    expect(collected.audioFrames.length).toBe(meta.length);

    const metric = sink.turns[0]!;
    expect(metric).toMatchObject({ sttProvider: 'assemblyai-stt', llmProvider: 'gemini-3.1-flash-lite', ttsProvider: 'polly-neural', costBasis: 'verified' });
    // 3 s de sesion STT + 400/20 tokens + 25 caracteres hablados: 'Qué bonito.' es corta y va
    // unida a 'Cuéntame más.' en una sola frase para la voz (SentenceBuffer, minChars).
    expect(metric.sttCostUsd).toBeCloseTo((3 / 3600) * 0.15, 6);
    expect(metric.llmCostUsd).toBeCloseTo((400 * 0.25 + 20 * 1.5) / 1e6, 6);
    expect(metric.ttsCostUsd).toBeCloseTo((25 * 16) / 1e6, 6);
    socket.close();
  });
});
