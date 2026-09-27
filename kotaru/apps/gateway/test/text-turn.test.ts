import { afterEach, describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import { PROTOCOL_VERSION, signGrant } from '@kotaru/gateway';
import { InMemoryUsageLedger, UsageMeter } from '@kotaru/billing';
import { ConversationClient, type ClientEvent, type SocketLike } from '@kotaru/client';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims, connect, key, waitFor } from './helpers.js';

/** Escribirle a Rio: respuesta en texto, sin voz, y tambien con la voz en pausa. */
let server: GatewayServerHandle | null = null;
afterEach(async () => {
  await server?.close();
  server = null;
});

const grantFor = (plan = 'close') =>
  signGrant({ ...claims, plan, subjectId: `subj_text_${plan}` }, key, { nowSeconds: Math.floor(Date.now() / 1000) });

describe('turnos escritos', () => {
  it('responde con texto, sin audio, y cobra solo el modelo de lenguaje', async () => {
    const meter = new UsageMeter();
    const { deps, sink } = buildDeps(undefined, new InMemoryUsageLedger(meter));
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: grantFor(), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));

    socket.send(JSON.stringify({ type: 'text_turn', turnId: 't1', text: '  hoy fui al mar  ' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done'));

    expect(collected.messages.some((m) => m.type === 'token')).toBe(true);
    expect(collected.messages.some((m) => m.type === 'audio_meta')).toBe(false);
    expect(collected.audioFrames).toHaveLength(0);
    expect(sink.turns[0]).toMatchObject({ sttCostUsd: 0, ttsCostUsd: 0 });
    expect(sink.turns[0]!.llmCostUsd).toBeGreaterThan(0);
    expect(meter.forSubject('subj_text_close')).toMatchObject({ turns: 1, voiceSeconds: 0 });
    socket.close();
  });

  it('con la voz en pausa por el tope gratuito, escribir sigue funcionando', async () => {
    const meter = new UsageMeter();
    meter.record({ turnId: 'x', subjectId: 'otro', voiceSeconds: 1, costUsd: 5, at: 0, plan: 'free' });
    const { deps } = buildDeps(undefined, new InMemoryUsageLedger(meter));
    server = await startGatewayServer({
      port: 0, keys: [key], audience: AUDIENCE, deps: { ...deps, budget: { hardCapUsd: 1000, freeCapUsd: 5 } },
    });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: grantFor('free'), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'limit'));
    socket.send(JSON.stringify({ type: 'text_turn', turnId: 't1', text: 'hola' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done'));
    expect(collected.messages.some((m) => m.type === 'token')).toBe(true);
    socket.close();
  });

  it('mensajes vacios se ignoran, ids raros cierran, y una rafaga larga se corta sin colgar la app', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: grantFor(), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.send(JSON.stringify({ type: 'text_turn', turnId: 'a', text: '   ' }));
    // Dos seguidos son normales ("y tu?"): los dos pasan. El quinto en 10 s, no.
    for (const id of ['b', 'c', 'd', 'e', 'f']) socket.send(JSON.stringify({ type: 'text_turn', turnId: id, text: `mensaje ${id}` }));
    const doneIds = () => collected.messages.filter((m) => m.type === 'turn_done').map((m) => (m as { turnId: string }).turnId);
    await waitFor(collected, () => doneIds().includes('e') && doneIds().includes('f'));
    expect(doneIds()).not.toContain('a');
    // El descartado recibe turn_done (la app deja de esperar) pero ni una palabra de respuesta.
    expect(collected.messages.some((m) => m.type === 'token' && (m as { turnId: string }).turnId === 'f')).toBe(false);
    expect(collected.messages.some((m) => m.type === 'token' && (m as { turnId: string }).turnId === 'e')).toBe(true);
    socket.send(JSON.stringify({ type: 'text_turn', turnId: 'id con espacios', text: 'hola' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'closing'));
    expect(collected.messages.find((m) => m.type === 'closing')).toMatchObject({ reason: 'protocol_error' });
  });

  it('el cliente compartido escribe y recibe la respuesta', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const events: ClientEvent[] = [];
    const client = new ConversationClient({
      url: `ws://127.0.0.1:${server.port}`,
      getGrant: async () => grantFor(),
      createSocket: (url) => new WebSocket(url) as unknown as SocketLike,
      onEvent: (e) => events.push(e),
    });
    await client.connect();
    expect(client.sendText('   ')).toBeNull();
    client.sendText('cuéntame algo');
    const start = Date.now();
    while (!events.some((e) => e.type === 'turn_done') && Date.now() - start < 5000) await new Promise((r) => setTimeout(r, 20));
    const reply = events.filter((e) => e.type === 'reply').at(-1) as { text: string } | undefined;
    expect(reply?.text.length).toBeGreaterThan(0);
    client.close();
  });
});
