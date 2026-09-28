import { afterEach, describe, expect, it } from 'vitest';
import type { DomainMessage, LlmOptions } from '@kotaru/ai-contracts';
import { PROTOCOL_VERSION, signGrant } from '@kotaru/gateway';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims, connect, key, waitFor } from './helpers.js';

let server: GatewayServerHandle | null = null;
afterEach(async () => {
  await server?.close();
  server = null;
});

describe('lo que recibe el modelo', () => {
  it('el prompt del personaje con sus reglas, y los recuerdos aprobados como datos', async () => {
    const { deps, memory } = buildDeps('hoy quiero hablar del mar');
    const seen: { messages: readonly DomainMessage[]; options: LlmOptions }[] = [];
    const inner = deps.resolve.llm('mock-llm')!;
    const spy = {
      descriptor: inner.descriptor,
      estimate: inner.estimate.bind(inner),
      health: inner.health.bind(inner),
      stream(messages: readonly DomainMessage[], options: LlmOptions, ctx: Parameters<typeof inner.stream>[2]) {
        seen.push({ messages, options });
        return inner.stream(messages, options, ctx);
      },
    };
    const approved = await memory.propose({
      subjectId: claims.subjectId, companionId: 'rio',
      candidate: { kind: 'preference', text: 'le gusta el mar en invierno', confidence: 0.7 }, sourceTurnId: 't0',
    });
    const pending = await memory.propose({
      subjectId: claims.subjectId, companionId: 'rio',
      candidate: { kind: 'preference', text: 'le gusta el mar de noche', confidence: 0.7 }, sourceTurnId: 't0',
    });
    if (!approved.ok || !pending.ok) throw new Error('seed');
    await memory.approve(approved.memory.id);

    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps: { ...deps, resolve: { ...deps.resolve, llm: () => spy } } });
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }), protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    for (let i = 0; i < 8; i += 1) socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 't1' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done'));
    socket.close();

    const call = seen[0]!;
    expect(call.options).toMatchObject({ personaId: 'rio-v4', promptVersion: 'rio-v4@4.0.0+rules@1.3.0' });
    expect(call.messages[0]).toMatchObject({ role: 'system' });
    expect(call.messages[0]!.content).toMatch(/eres una IA/i);
    const notes = call.messages.find((m) => m.role === 'system' && m.content.includes('<notas>'));
    expect(notes?.content).toContain('- le gusta el mar en invierno');
    // Lo propuesto y no aprobado no llega al modelo.
    expect(JSON.stringify(call.messages)).not.toContain('de noche');
  });
});
