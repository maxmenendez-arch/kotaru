import { afterEach, describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION, signGrant } from '@kotaru/gateway';
import { InMemoryUsageLedger, UsageMeter, freeVoiceExhausted } from '@kotaru/billing';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims, connect, key, waitFor } from './helpers.js';

/**
 * Tope propio del plan gratuito: cuando las cuentas gratis gastan lo suyo, pierden la voz,
 * y quien paga sigue hablando aunque el tope global no se haya tocado.
 */
let server: GatewayServerHandle | null = null;
afterEach(async () => {
  await server?.close();
  server = null;
});

async function helloWith(plan: string, meter: UsageMeter) {
  const { deps } = buildDeps(undefined, new InMemoryUsageLedger(meter));
  server = await startGatewayServer({
    port: 0,
    keys: [key],
    audience: AUDIENCE,
    deps: { ...deps, budget: { hardCapUsd: 1000, freeCapUsd: 5 } },
  });
  const { socket, collected } = await connect(server.port);
  const grant = signGrant({ ...claims, plan, subjectId: `subj_${plan}` }, key, { nowSeconds: Math.floor(Date.now() / 1000) });
  socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
  await waitFor(collected, (m) => m.some((x) => x.type === 'ready' || x.type === 'limit' || x.type === 'rejected'));
  return { socket, collected };
}

describe('presupuesto del plan gratuito', () => {
  it('el medidor separa el gasto del plan gratuito', () => {
    const meter = new UsageMeter();
    meter.record({ turnId: 'a', subjectId: 's1', voiceSeconds: 1, costUsd: 2, at: 0, plan: 'free' });
    meter.record({ turnId: 'b', subjectId: 's2', voiceSeconds: 1, costUsd: 3, at: 0, plan: 'close' });
    expect(meter.freeCostUsd()).toBe(2);
    expect(meter.totalCostUsd()).toBe(5);
    expect(freeVoiceExhausted(4.99, { hardCapUsd: 50, freeCapUsd: 5 })).toBe(false);
    expect(freeVoiceExhausted(5, { hardCapUsd: 50, freeCapUsd: 5 })).toBe(true);
    expect(freeVoiceExhausted(999, { hardCapUsd: 50 })).toBe(false);
  });

  it('agotado el tope gratuito, una cuenta gratis recibe el limite de gasto', async () => {
    const meter = new UsageMeter();
    meter.record({ turnId: 'x', subjectId: 'otro', voiceSeconds: 10, costUsd: 5, at: 0, plan: 'free' });
    const { socket, collected } = await helloWith('free', meter);
    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'limit'));
    expect(collected.messages.find((m) => m.type === 'limit')).toMatchObject({ kind: 'spend' });
    socket.close();
  });

  it('con el tope gratuito agotado, un plan de pago sigue hablando', async () => {
    const meter = new UsageMeter();
    meter.record({ turnId: 'x', subjectId: 'otro', voiceSeconds: 10, costUsd: 5, at: 0, plan: 'free' });
    const { socket, collected } = await helloWith('close', meter);
    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    for (let i = 0; i < 8; i += 1) socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 't1' }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'turn_done' || x.type === 'limit'));
    expect(collected.messages.some((m) => m.type === 'limit')).toBe(false);
    // Y su turno cuenta como de pago, no como gratuito.
    expect(meter.freeCostUsd()).toBe(5);
    expect(meter.totalCostUsd()).toBeGreaterThan(5);
    socket.close();
  });
});
