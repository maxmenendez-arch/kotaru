import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { PROTOCOL_VERSION, signAccessToken, signGrant, type ServerMessage } from '@kotaru/gateway';
import { MemoryStore } from '@kotaru/memory';
import { ConversationRepository, exportSubject } from '@kotaru/persistence';
import { randomBytes } from 'node:crypto';
import { loadMigrations, runMigrations, type SqlClient } from '@kotaru/persistence';
import { pgliteClient } from '@kotaru/persistence/testing';
import { durableStores, startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, claims as baseClaims, connect, key, waitFor } from './helpers.js';

// En la base, subject_id es un uuid: el seudonimo real, no una etiqueta de prueba.
const claims = { ...baseClaims, subjectId: randomUUID(), conversationId: randomUUID() };

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
  const { deps } = buildDeps(undefined, stores.usage, stores.memories);
  return startGatewayServer({
    port: 0,
    keys: [key],
    audience: AUDIENCE,
    deps: { ...deps, conversations: stores.conversations },
    grantClaims: stores.grantClaims,
  });
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

    // Lo que el turno propuso recordar quedo en la base, en `proposed`, esperando al usuario.
    const memories = await sql.query<{ status: string }>(
      'select status from app.memories where subject_id = $1',
      [claims.subjectId],
    );
    expect(memories.rows.length).toBeGreaterThan(0);
    expect(memories.rows.every((m) => m.status === 'proposed')).toBe(true);

    // Y la conversacion quedo guardada: lo que dijo el usuario y lo que respondio.
    const messages = await sql.query<{ role: string; content: string }>(
      'select role, content from app.messages where conversation_id = $1 order by created_at',
      [claims.conversationId],
    );
    expect(messages.rows.map((m) => m.role)).toEqual(['user', 'companion']);
    expect(messages.rows[0]!.content).toBe('me gusta el mar en invierno');
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

  it('la conversacion continua tras reiniciar: el modelo recibe lo que se hablo antes', async () => {
    const seen: string[][] = [];
    const bootSpying = async () => {
      const stores = durableStores(sql);
      const { deps } = buildDeps('hoy quiero hablar de musica', stores.usage, stores.memories);
      const resolve = {
        ...deps.resolve,
        llm: (id: string) => {
          const llm = deps.resolve.llm(id);
          if (!llm) return undefined;
          return new Proxy(llm, {
            get(target, prop, receiver) {
              if (prop === 'stream') {
                return (messages: readonly { content: unknown }[], ...rest: unknown[]) => {
                  seen.push(messages.map((m) => String(m.content)));
                  return (target.stream as (...a: unknown[]) => unknown).call(target, messages, ...rest);
                };
              }
              return Reflect.get(target, prop, receiver);
            },
          });
        },
      };
      return startGatewayServer({
        port: 0, keys: [key], audience: AUDIENCE,
        deps: { ...deps, resolve, conversations: stores.conversations },
        grantClaims: stores.grantClaims,
      });
    };
    const turn = async (port: number, turnId: string) => {
      const conn = await hello(port, signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }));
      conn.socket.send(JSON.stringify({ type: 'turn_start', turnId }));
      for (let i = 0; i < 8; i += 1) conn.socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
      conn.socket.send(JSON.stringify({ type: 'turn_end', turnId }));
      await waitFor(conn.collected, (m) => m.filter((x) => x.type === 'usage').length >= 2);
      conn.socket.close();
    };

    server = await bootSpying();
    await turn(server.port, 'antes');
    await server.close();

    server = await bootSpying();
    await turn(server.port, 'despues');

    expect(seen).toHaveLength(2);
    // El segundo turno, ya en otro proceso, lleva el turno anterior en su historial.
    expect(seen[1]!.filter((c) => c === 'hoy quiero hablar de musica')).toHaveLength(2);
    expect(seen[0]!.filter((c) => c === 'hoy quiero hablar de musica')).toHaveLength(1);
  });

  it('la API del centro de memoria trabaja sobre PostgreSQL de punta a punta', async () => {
    const accessKey = { kid: 'acc', secret: randomBytes(32) };
    const stores = durableStores(sql);
    const { deps } = buildDeps(undefined, stores.usage, stores.memories);
    const memory = new MemoryStore({ now: Date.now, newId: randomUUID, repository: stores.memories });
    const conversations = new ConversationRepository(sql);
    server = await startGatewayServer({
      port: 0, keys: [key], audience: AUDIENCE,
      deps: { ...deps, conversations: stores.conversations },
      grantClaims: stores.grantClaims,
      api: {
        keys: [accessKey], audience: 'api', memory, now: Date.now,
        exportSubject: (s) => exportSubject(sql, s, new Date().toISOString()),
        retention: {
          get: (s) => conversations.retentionDaysFor(s),
          set: (s, d) => conversations.setRetentionDays(s, d, new Date().toISOString()),
        },
        ready: async () => (await sql.query('select 1 as ok')).rows.length === 1,
      },
    });
    const proposed = await memory.propose({
      subjectId: claims.subjectId, companionId: 'rio',
      candidate: { kind: 'preference', text: 'me gusta el jazz', confidence: 0.7 }, sourceTurnId: 't',
    });
    if (!proposed.ok) throw new Error(proposed.reason);

    const auth = { authorization: `Bearer ${signAccessToken({ sub: claims.subjectId, aud: 'api' }, accessKey, { nowSeconds: Math.floor(Date.now() / 1000) })}` };
    const base = `http://127.0.0.1:${server.port}`;

    expect((await fetch(`${base}/readyz`)).status).toBe(200);
    const approved = await fetch(`${base}/v1/memories/${proposed.memory.id}/approve`, { method: 'POST', headers: auth });
    expect(approved.status).toBe(200);
    const row = await sql.query<{ status: string }>('select status from app.memories where id = $1', [proposed.memory.id]);
    expect(row.rows[0]!.status).toBe('approved');

    const put = await fetch(`${base}/v1/settings/retention`, {
      method: 'PUT', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify({ days: 14 }),
    });
    expect(await put.json()).toEqual({ messageRetentionDays: 14 });

    const exported = (await (await fetch(`${base}/v1/export`, { headers: auth })).json()) as { memories: unknown[]; settings: unknown };
    expect(exported.memories).toHaveLength(1);
    expect(exported.settings).toEqual({ messageRetentionDays: 14 });
  });
});
