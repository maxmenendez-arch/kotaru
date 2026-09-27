import { randomBytes, randomUUID } from 'node:crypto';
import WebSocket from 'ws';
import { DefaultAiRouter } from '@kotaru/ai-router';
import {
  MockLlmProvider,
  MockModerationProvider,
  MockSttProvider,
  MockTtsProvider,
} from '@kotaru/ai-adapters-mock';
import { InMemoryUsageLedger, UsageMeter, type UsageLedger } from '@kotaru/billing';
import { MemoryStore, type MemoryRepository } from '@kotaru/memory';
import { InMemorySink } from '@kotaru/telemetry';
import type { ServerMessage, SessionGrant, SigningKey } from '@kotaru/gateway';

export const key: SigningKey = { kid: 'k1', secret: randomBytes(32) };
export const AUDIENCE = 'gateway-test';

export const claims: Omit<SessionGrant, 'iat' | 'exp' | 'jti'> = {
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

export function buildDeps(
  sttScript = 'me gusta el mar en invierno',
  usage?: UsageLedger,
  memoryRepository?: MemoryRepository,
) {
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
  const memory = new MemoryStore({
    now,
    newId: () => randomUUID(),
    ...(memoryRepository ? { repository: memoryRepository } : {}),
  });

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
      usage: usage ?? new InMemoryUsageLedger(meter),
      sink,
      budget: { hardCapUsd: 1000 },
      now,
      infraCostUsd: 0.0003,
    },
  };
}

export interface Collected {
  readonly messages: ServerMessage[];
  readonly audioFrames: Buffer[];
}

export function connect(port: number): Promise<{ socket: WebSocket; collected: Collected }> {
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

export function waitFor(
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

