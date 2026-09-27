import { randomBytes, randomUUID } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import { ApiError, ConversationClient, MemoryApi, type ClientEvent, type ConversationState, type SocketLike } from '@kotaru/client';
import { signAccessToken, signGrant } from '@kotaru/gateway';
import { MemoryStore } from '@kotaru/memory';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims, key } from './helpers.js';

/**
 * El cliente de la app (@kotaru/client) contra el gateway de verdad. Es la prueba de que
 * lo que la app vera coincide con lo que el servidor manda.
 */
let server: GatewayServerHandle | null = null;
afterEach(async () => {
  await server?.close();
  server = null;
});

const grant = async () => signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });
const socket = (url: string) => new WebSocket(url) as unknown as SocketLike;
const until = async (check: () => boolean, ms = 5000) => {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > ms) throw new Error('tiempo agotado');
    await new Promise((r) => setTimeout(r, 10));
  }
};
const silence = () => new Uint8Array(24000 * 2 * 0.02);

async function boot(port = 0, api?: Parameters<typeof startGatewayServer>[0]['api'], slowLlmMs = 0) {
  const { deps } = buildDeps();
  const resolve = slowLlmMs
    ? {
        ...deps.resolve,
        // LLM lento: cada evento tarda, para poder hablarle encima a mitad de respuesta.
        llm: (id: string) => {
          const inner = deps.resolve.llm(id);
          if (!inner) return undefined;
          return {
            ...inner,
            descriptor: inner.descriptor,
            estimate: inner.estimate.bind(inner),
            health: inner.health.bind(inner),
            async *stream(...args: Parameters<typeof inner.stream>) {
              for await (const event of inner.stream(...args)) {
                await new Promise((r) => setTimeout(r, slowLlmMs));
                if (args[2].signal.aborted) return;
                yield event;
              }
            },
          };
        },
      }
    : deps.resolve;
  server = await startGatewayServer({ port, keys: [key], audience: AUDIENCE, deps: { ...deps, resolve }, ...(api ? { api } : {}) });
  return server;
}

describe('cliente de conversacion contra el gateway', () => {
  it('recorre los estados de un turno y entrega texto y audio', async () => {
    const s = await boot();
    const events: ClientEvent[] = [];
    const client = new ConversationClient({ url: `ws://127.0.0.1:${s.port}`, getGrant: grant, createSocket: socket, onEvent: (e) => events.push(e) });
    await client.connect();
    client.startTalking();
    for (let i = 0; i < 10; i += 1) client.sendAudio(silence());
    client.stopTalking();
    await until(() => events.some((e) => e.type === 'turn_done'));

    const states = events.filter((e): e is Extract<ClientEvent, { type: 'state' }> => e.type === 'state').map((e) => e.state);
    expect(states).toEqual(['connecting', 'idle', 'listening', 'endpoint', 'thinking', 'speaking', 'idle'] satisfies ConversationState[]);
    expect(events.find((e) => e.type === 'user_transcript' && e.final)).toMatchObject({ text: 'me gusta el mar en invierno' });
    const reply = events.filter((e) => e.type === 'reply').at(-1) as { text: string };
    expect(reply.text.length).toBeGreaterThan(5);
    const audio = events.filter((e) => e.type === 'audio') as { sampleRate: number; pcm: Uint8Array }[];
    expect(audio.length).toBeGreaterThan(0);
    expect(audio.every((a) => a.sampleRate > 0 && a.pcm.byteLength > 0)).toBe(true);
    expect(events.some((e) => e.type === 'usage')).toBe(true);
    client.close();
  });

  it('hablar encima corta la respuesta (barge-in) y vuelve a escuchar', async () => {
    const s = await boot(0, undefined, 80);
    const events: ClientEvent[] = [];
    const client = new ConversationClient({ url: `ws://127.0.0.1:${s.port}`, getGrant: grant, createSocket: socket, onEvent: (e) => events.push(e) });
    await client.connect();
    client.startTalking();
    for (let i = 0; i < 10; i += 1) client.sendAudio(silence());
    client.stopTalking();
    await until(() => client.state === 'speaking');
    const repliesBefore = events.filter((e) => e.type === 'reply').length;

    client.startTalking();
    expect(client.state).toBe('listening');
    const states = events.filter((e): e is Extract<ClientEvent, { type: 'state' }> => e.type === 'state').map((e) => e.state);
    expect(states.slice(-2)).toEqual(['interrupted', 'listening']);
    await new Promise((r) => setTimeout(r, 200));
    // Lo que el servidor ya tenia en vuelo del turno viejo no aparece como respuesta nueva.
    expect(events.filter((e) => e.type === 'reply').length).toBe(repliesBefore);
    client.close();
  });

  it('si el servidor se reinicia, reconecta solo con un grant nuevo', async () => {
    const s = await boot();
    const port = s.port;
    const events: ClientEvent[] = [];
    let grants = 0;
    const client = new ConversationClient({
      url: `ws://127.0.0.1:${port}`,
      getGrant: async () => {
        grants += 1;
        return grant();
      },
      createSocket: socket,
      onEvent: (e) => events.push(e),
      reconnectDelayMs: () => 150,
      maxReconnectAttempts: 10,
    });
    await client.connect();
    await s.close();
    server = null;
    await until(() => client.state === 'reconnecting');
    await boot(port);
    await until(() => client.state === 'idle', 8000);
    expect(grants).toBeGreaterThanOrEqual(2);
    client.close();
  });
});

describe('API del centro de memoria desde el cliente', () => {
  it('lista, aprueba, edita, fija, olvida y traduce errores', async () => {
    const accessKey = { kid: 'a', secret: randomBytes(32) };
    const memory = new MemoryStore({ now: Date.now, newId: randomUUID, maxApprovedPerSubject: 1 });
    const retention = new Map<string, number>();
    const s = await boot(0, {
      keys: [accessKey], audience: 'api', memory, now: Date.now,
      retention: { get: async (x) => retention.get(x) ?? 30, set: async (x, d) => void (d === null ? retention.delete(x) : retention.set(x, d)) },
    });
    const api = new MemoryApi({
      baseUrl: `http://127.0.0.1:${s.port}`,
      getAccessToken: async () => signAccessToken({ sub: claims.subjectId, aud: 'api' }, accessKey, { nowSeconds: Math.floor(Date.now() / 1000) }),
    });
    const seed = async (text: string) => {
      const r = await memory.propose({ subjectId: claims.subjectId, companionId: 'rio', candidate: { kind: 'preference', text, confidence: 0.6 }, sourceTurnId: 't' });
      if (!r.ok) throw new Error(r.reason);
      return r.memory.id;
    };
    const a = await seed('me gusta el mar');
    const b = await seed('me gusta el cafe');

    expect((await api.list()).memories).toHaveLength(2);
    expect((await api.approve(a)).status).toBe('approved');
    await expect(api.approve(b)).rejects.toMatchObject({ status: 409, code: 'at_capacity' });
    expect(await api.update(a, { pinned: true, text: 'me encanta el mar' })).toMatchObject({ pinned: true, text: 'me encanta el mar' });
    await expect(api.update(a, { text: 'mi tarjeta es 4242424242424242' })).rejects.toBeInstanceOf(ApiError);
    await api.forget(a);
    expect((await api.list()).memories.map((m) => m.id)).toEqual([b]);
    expect(await api.setRetentionDays(7)).toBe(7);
    expect(await api.retentionDays()).toBe(7);
  });
});
