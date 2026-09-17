import { randomBytes } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import { DefaultAiRouter } from '@kotaru/ai-router';
import {
  MockLlmProvider,
  MockModerationProvider,
  MockSttProvider,
  MockTtsProvider,
} from '@kotaru/ai-adapters-mock';
import { UsageMeter } from '@kotaru/billing';
import { MemoryStore } from '@kotaru/memory';
import { InMemorySink } from '@kotaru/telemetry';
import { PROTOCOL_VERSION, signGrant, type ServerMessage, type SessionGrant, type SigningKey } from '@kotaru/gateway';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';

const key: SigningKey = { kid: 'k1', secret: randomBytes(32) };
const AUDIENCE = 'gateway-test';

const claims: Omit<SessionGrant, 'iat' | 'exp' | 'jti'> = {
  subjectId: 'subj_int',
  conversationId: 'conv_int',
  plan: 'close',
  region: 'us',
  locale: 'es-419',
  sensitivity: 'standard',
  quality: 'balanced',
  budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 800, hardCapUsd: 1000 },
  maxSessionSeconds: 1800,
  aud: AUDIENCE,
};

function buildDeps(sttScript = 'me gusta el mar en invierno') {
  const stt = new MockSttProvider(sttScript);
  const llm = new MockLlmProvider('Qué bonito. Cuéntame más sobre eso.');
  const tts = new MockTtsProvider();
  const now = () => Date.now();

  const router = new DefaultAiRouter({ now })
    .register({ descriptor: stt.descriptor, estimate: (p, c) => stt.estimate({ audioSeconds: p.audioSeconds ?? 0 }, c) })
    .register({ descriptor: llm.descriptor, estimate: (p, c) => llm.estimate({ inputTokens: p.inputTokens ?? 0, outputTokens: p.outputTokens ?? 0 }, c) })
    .register({ descriptor: tts.descriptor, estimate: (p, c) => tts.estimate({ characters: p.characters ?? 0 }, c) });

  const meter = new UsageMeter();
  const sink = new InMemorySink();
  let counter = 0;
  const memory = new MemoryStore({ now, newId: () => `mem_${++counter}` });

  return {
    meter,
    sink,
    memory,
    deps: {
      router,
      resolve: {
        stt: (id: string) => (id === stt.descriptor.id ? stt : undefined),
        llm: (id: string) => (id === llm.descriptor.id ? llm : undefined),
        tts: (id: string) => (id === tts.descriptor.id ? tts : undefined),
      },
      moderation: new MockModerationProvider(),
      memory,
      meter,
      sink,
      budget: { hardCapUsd: 1000 },
      now,
      infraCostUsd: 0.0003,
    },
  };
}

interface Collected {
  readonly messages: ServerMessage[];
  readonly audioFrames: Buffer[];
}

function connect(port: number): Promise<{ socket: WebSocket; collected: Collected }> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://127.0.0.1:${port}`);
    const collected: Collected = { messages: [], audioFrames: [] };
    socket.on('message', (data: Buffer, isBinary: boolean) => {
      if (isBinary) collected.audioFrames.push(data);
      else collected.messages.push(JSON.parse(data.toString('utf8')) as ServerMessage);
    });
    socket.on('open', () => resolve({ socket, collected }));
    socket.on('error', reject);
  });
}

function waitFor(
  collected: Collected,
  predicate: (messages: readonly ServerMessage[]) => boolean,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = setInterval(() => {
      if (predicate(collected.messages)) {
        clearInterval(tick);
        resolve();
      } else if (Date.now() - started > timeoutMs) {
        clearInterval(tick);
        reject(new Error(`timeout; recibidos: ${collected.messages.map((m) => m.type).join(',')}`));
      }
    }, 10);
  });
}

let server: GatewayServerHandle | null = null;

afterEach(async () => {
  await server?.close();
  server = null;
});

describe('gateway de extremo a extremo', () => {
  it('rechaza un grant invalido y cierra', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);

    socket.send(JSON.stringify({ type: 'hello', grant: 'basura', protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'rejected'));

    expect(collected.messages[0]).toEqual({ type: 'rejected', reason: 'malformed' });
    socket.close();
  });

  it('rechaza un grant de otra audiencia', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);

    const grant = signGrant({ ...claims, aud: 'otra-cosa' }, key, { nowSeconds: Math.floor(Date.now() / 1000) });
    socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'rejected'));

    expect(collected.messages[0]).toMatchObject({ type: 'rejected', reason: 'wrong_audience' });
    socket.close();
  });

  it('ejecuta un turno completo: transcripcion, tokens, audio, uso y metrica', async () => {
    const { deps, meter, sink, memory } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);

    const grant = signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });
    socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));

    socket.send(JSON.stringify({ type: 'turn_start', turnId: 'turn_1' }));
    for (let i = 0; i < 8; i += 1) socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 'turn_1' }));

    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done'));

    const types = collected.messages.map((m) => m.type);
    expect(types).toContain('ready');
    expect(types).toContain('transcript');
    expect(types).toContain('token');
    expect(types).toContain('audio_meta');
    expect(types).toContain('usage');

    const final = collected.messages.find((m) => m.type === 'transcript' && m.final === true);
    expect(final).toMatchObject({ text: 'me gusta el mar en invierno' });

    // El audio llego como frames binarios, no como JSON.
    expect(collected.audioFrames.length).toBeGreaterThan(0);

    // El consumo quedo medido y la metrica llego al sink sin contenido.
    expect(meter.forSubject('subj_int').turns).toBe(1);
    expect(sink.turns).toHaveLength(1);
    expect(sink.turns[0]!.totalCostUsd).toBeGreaterThan(0);
    expect(JSON.stringify(sink.turns[0])).not.toContain('mar');

    // La memoria propuso algo, y quedo esperando aprobacion del usuario.
    const proposed = memory.list('subj_int');
    expect(proposed.length).toBeGreaterThan(0);
    expect(proposed.every((m) => m.status === 'proposed')).toBe(true);
    expect(memory.recall({ subjectId: 'subj_int', companionId: 'rio', text: 'mar' })).toHaveLength(0);

    socket.close();
  });

  it('el mismo grant no sirve dos veces', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const grant = signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });

    const first = await connect(server.port);
    first.socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(first.collected, (m) => m.some((x) => x.type === 'ready'));
    first.socket.close();

    const second = await connect(server.port);
    second.socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(second.collected, (m) => m.some((x) => x.type === 'rejected'));
    expect(second.collected.messages[0]).toMatchObject({ reason: 'replayed' });
    second.socket.close();
  });

  it('un mensaje antes del saludo es error de protocolo', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);

    socket.send(JSON.stringify({ type: 'turn_start', turnId: 'x' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'closing'));
    expect(collected.messages[0]).toMatchObject({ type: 'closing', reason: 'protocol_error' });
    socket.close();
  });
});
