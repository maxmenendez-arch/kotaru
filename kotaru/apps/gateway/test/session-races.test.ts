import { afterEach, describe, expect, it } from 'vitest';
import type { AudioChunk, ProviderContext, SpeechToTextProvider, TranscriptEvent } from '@kotaru/ai-contracts';
import { PROTOCOL_VERSION, signGrant } from '@kotaru/gateway';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims, connect, key, waitFor } from './helpers.js';

/** Regresiones de la revision independiente del 2026-09-27. */
let server: GatewayServerHandle | null = null;
afterEach(async () => {
  await server?.close();
  server = null;
});

const frame = () => Buffer.alloc(24000 * 2 * 0.02);

describe('carreras en la sesion', () => {
  it('el STT recibe el audio mientras el usuario habla, no todo de golpe al soltar', async () => {
    const { deps } = buildDeps();
    const consumedAt: number[] = [];
    const inner = deps.resolve.stt('mock-stt')!;
    const spy: SpeechToTextProvider = {
      descriptor: inner.descriptor,
      estimate: inner.estimate.bind(inner),
      health: inner.health.bind(inner),
      transcribeStream(input: AsyncIterable<AudioChunk>, ctx: ProviderContext): AsyncIterable<TranscriptEvent> {
        async function* tap() {
          for await (const chunk of input) {
            consumedAt.push(Date.now());
            yield chunk;
          }
        }
        return inner.transcribeStream(tap(), ctx);
      },
    };
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps: { ...deps, resolve: { ...deps.resolve, stt: () => spy } } });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));

    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    for (let i = 0; i < 10; i += 1) {
      socket.send(frame(), { binary: true });
      await new Promise((r) => setTimeout(r, 20));
    }
    const releasedAt = Date.now();
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 't1' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done'));

    // La mayor parte del audio se consumio ANTES de soltar el boton.
    expect(consumedAt.filter((t) => t < releasedAt).length).toBeGreaterThanOrEqual(8);
    socket.close();
  });

  it('un turno que empieza mientras el anterior termina de guardarse no se pierde', async () => {
    const { deps } = buildDeps();
    // Guardar el historial tarda: justo la ventana en la que antes se borraba el turno nuevo.
    const slowLog = {
      open: async () => 'opened',
      recentMessages: async () => [],
      appendTurn: async () => {
        await new Promise((r) => setTimeout(r, 200));
        return true;
      },
    };
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps: { ...deps, conversations: slowLog } });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));

    const turn = (id: string) => {
      socket.send(JSON.stringify({ type: 'turn_start', turnId: id }));
      for (let i = 0; i < 8; i += 1) socket.send(frame(), { binary: true });
      socket.send(JSON.stringify({ type: 'turn_end', turnId: id }));
    };
    turn('t1');
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done' && x.turnId === 't1'));
    turn('t2'); // mientras t1 sigue guardando
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done' && x.turnId === 't2'), 5000);
    socket.close();
  });

  it('cerrar el socket a mitad de turno corta a los proveedores', async () => {
    const { deps } = buildDeps();
    let aborted = false;
    const inner = deps.resolve.llm('mock-llm')!;
    const slowLlm = {
      descriptor: inner.descriptor,
      estimate: inner.estimate.bind(inner),
      health: inner.health.bind(inner),
      async *stream(...args: Parameters<typeof inner.stream>) {
        for await (const event of inner.stream(...args)) {
          await new Promise((r) => setTimeout(r, 100));
          if (args[2].signal.aborted) {
            aborted = true;
            return;
          }
          yield event;
        }
      },
    };
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps: { ...deps, resolve: { ...deps.resolve, llm: () => slowLlm } } });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    for (let i = 0; i < 8; i += 1) socket.send(frame(), { binary: true });
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 't1' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'token'));
    socket.close();
    await new Promise((r) => setTimeout(r, 400));
    expect(aborted).toBe(true);
  });

  it('un segundo hello en el mismo socket no abre otra sesion', async () => {
    const { deps } = buildDeps();
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const { socket, collected } = await connect(server.port);
    const g = () => signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });
    socket.send(JSON.stringify({ type: 'hello', grant: g(), protocolVersion: PROTOCOL_VERSION }));
    socket.send(JSON.stringify({ type: 'hello', grant: g(), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    await new Promise((r) => setTimeout(r, 150));
    expect(collected.messages.filter((m) => m.type === 'ready')).toHaveLength(1);
    socket.close();
  });
});
