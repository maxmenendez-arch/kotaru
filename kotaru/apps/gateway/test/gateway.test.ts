import { afterEach, describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION, signGrant } from '@kotaru/gateway';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims, connect, key, waitFor } from './helpers.js';

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
    const proposed = await memory.list('subj_int');
    expect(proposed.length).toBeGreaterThan(0);
    expect(proposed.every((m) => m.status === 'proposed')).toBe(true);
    expect(await memory.recall({ subjectId: 'subj_int', companionId: 'rio', text: 'mar' })).toHaveLength(0);

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
