import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { PROTOCOL_VERSION, signGrant, type ServerMessage } from '@kotaru/gateway';
import { loadMigrations, runMigrations, type SqlClient } from '@kotaru/persistence';
import { pgliteClient } from '@kotaru/persistence/testing';
import { durableStores, startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims as baseClaims, connect, key, waitFor } from './helpers.js';

// En la base, subject_id es un uuid: el seudonimo real, no una etiqueta de prueba.
const claims = { ...baseClaims, subjectId: randomUUID() };

const MIGRATIONS = loadMigrations(
  fileURLToPath(new URL('../../../packages/persistence/migrations', import.meta.url)),
);

let sql: SqlClient;
let server: GatewayServerHandle | null = null;

beforeEach(async () => {
  sql = pgliteClient(new PGlite());
  await runMigrations(sql, MIGRATIONS);
});

afterEach(async () => {
  await server?.close();
  server = null;
});

/** Un gateway nuevo sobre la MISMA base: es lo que pasa en un reinicio o redespliegue. */
async function bootGateway(): Promise<GatewayServerHandle> {
  const stores = durableStores(sql);
  const { deps } = buildDeps(undefined, stores.usage);
  return startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps, grantClaims: stores.grantClaims });
}

async function hello(port: number, grant: string) {
  const conn = await connect(port);
  conn.socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
  await waitFor(conn.collected, (m) => m.some((x) => x.type === 'ready' || x.type === 'rejected'));
  return conn;
}

function usageOf(messages: readonly ServerMessage[]) {
  const usage = messages.filter((m) => m.type === 'usage').at(-1);
  if (!usage || usage.type !== 'usage') throw new Error('sin mensaje usage');
  return usage;
}

describe('gateway con PostgreSQL', () => {
  it('el consumo sobrevive a un reinicio del gateway', async () => {
    server = await bootGateway();
    const first = await hello(server.port, signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }));
    const before = usageOf(first.collected.messages).remainingSeconds;

    first.socket.send(JSON.stringify({ type: 'turn_start', turnId: 'turn_persist' }));
    for (let i = 0; i < 8; i += 1) first.socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
    first.socket.send(JSON.stringify({ type: 'turn_end', turnId: 'turn_persist' }));
    await waitFor(first.collected, (m) => m.some((x) => x.type === 'turn_done'));
    await waitFor(first.collected, (m) => m.filter((x) => x.type === 'usage').length >= 2);
    const after = usageOf(first.collected.messages).remainingSeconds;
    expect(after).toBeLessThan(before);
    first.socket.close();

    // Reinicio: servidor nuevo, memoria nueva, misma base.
    await server.close();
    server = await bootGateway();
    const second = await hello(server.port, signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }));
    expect(usageOf(second.collected.messages).remainingSeconds).toBe(after);
    second.socket.close();

    const { rows } = await sql.query<{ n: string }>("select count(*)::text as n from app.usage_ledger where turn_id = 'turn_persist'");
    expect(rows[0]!.n).toBe('1');
  });

  it('un grant usado sigue usado despues de reiniciar', async () => {
    const grant = signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });

    server = await bootGateway();
    const first = await hello(server.port, grant);
    expect(first.collected.messages.some((m) => m.type === 'ready')).toBe(true);
    first.socket.close();

    await server.close();
    server = await bootGateway();
    const second = await hello(server.port, grant);
    expect(second.collected.messages[0]).toMatchObject({ type: 'rejected', reason: 'replayed' });
    second.socket.close();
  });

  it('un grant invalido no gasta ningun jti', async () => {
    server = await bootGateway();
    const forged = signGrant({ ...claims, aud: 'otra-cosa' }, key, { nowSeconds: Math.floor(Date.now() / 1000) });
    const conn = await hello(server.port, forged);
    expect(conn.collected.messages[0]).toMatchObject({ type: 'rejected', reason: 'wrong_audience' });
    conn.socket.close();

    const { rows } = await sql.query<{ n: string }>('select count(*)::text as n from app.used_grants');
    expect(rows[0]!.n).toBe('0');
  });

  it('si la base falla, la sesion se cierra con motivo en vez de quedar colgada', async () => {
    const broken = {
      record: () => Promise.reject(new Error('db caida')),
      forSubject: () => Promise.reject(new Error('db caida')),
      totalCostUsd: () => Promise.reject(new Error('db caida')),
    };
    const { deps } = buildDeps(undefined, broken);
    server = await startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps });
    const conn = await connect(server.port);
    const grant = signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });
    conn.socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(conn.collected, (m) => m.some((x) => x.type === 'closing'));
    expect(conn.collected.messages.at(-1)).toEqual({ type: 'closing', reason: 'server_error' });
    conn.socket.close();
  });
});
