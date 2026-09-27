import { randomBytes, randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { signAccessToken, type SigningKey } from '@kotaru/gateway';
import { MemoryStore } from '@kotaru/memory';
import { startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { AUDIENCE, buildDeps, key as grantKey } from './helpers.js';

const accessKey: SigningKey = { kid: 'acc1', secret: randomBytes(32) };
const API_AUD = 'kotaru-api-test';

let server: GatewayServerHandle;
let memory: MemoryStore;
let retentionDays = new Map<string, number>();
const alice = randomUUID();
const bob = randomUUID();

const token = (sub: string, ttlSeconds?: number, nowSeconds = Math.floor(Date.now() / 1000)) =>
  signAccessToken({ sub, aud: API_AUD }, accessKey, { nowSeconds, ...(ttlSeconds !== undefined ? { ttlSeconds } : {}) });

async function call(method: string, path: string, opts: { sub?: string; body?: unknown; raw?: string; auth?: string } = {}) {
  const headers: Record<string, string> = {};
  if (opts.auth !== undefined) headers.authorization = opts.auth;
  else if (opts.sub) headers.authorization = `Bearer ${token(opts.sub)}`;
  if (opts.body !== undefined || opts.raw !== undefined) headers['content-type'] = 'application/json';
  const res = await fetch(`http://127.0.0.1:${server.port}${path}`, {
    method,
    headers,
    ...(opts.raw !== undefined ? { body: opts.raw } : opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
  const text = await res.text();
  return { status: res.status, body: text ? (JSON.parse(text) as Record<string, any>) : null };
}

async function seed(subjectId: string, text: string) {
  const r = await memory.propose({
    subjectId, companionId: 'rio', candidate: { kind: 'preference', text, confidence: 0.6 }, sourceTurnId: 't',
  });
  if (!r.ok) throw new Error(r.reason);
  return r.memory;
}

beforeEach(async () => {
  const { deps } = buildDeps();
  memory = new MemoryStore({ now: Date.now, newId: randomUUID, maxApprovedPerSubject: 2 });
  retentionDays = new Map();
  server = await startGatewayServer({
    port: 0,
    keys: [grantKey],
    audience: AUDIENCE,
    deps,
    api: {
      keys: [accessKey],
      audience: API_AUD,
      memory,
      now: Date.now,
      exportSubject: async (subjectId) => ({ subjectId, memories: await memory.list(subjectId) }),
      retention: {
        get: async (s) => retentionDays.get(s) ?? 30,
        set: async (s, d) => void (d === null ? retentionDays.delete(s) : retentionDays.set(s, d)),
      },
      rateLimit: { capacity: 30, refillPerSecond: 0.001 },
      corsOrigins: ['https://app.kotaru.test'],
    },
  });
});

afterEach(async () => {
  await server.close();
});

describe('salud', () => {
  it('healthz y readyz responden sin autenticacion', async () => {
    expect(await call('GET', '/healthz')).toEqual({ status: 200, body: { ok: true } });
    expect((await call('GET', '/readyz')).status).toBe(200);
  });
});

describe('autenticacion', () => {
  it('sin token, 401', async () => {
    expect(await call('GET', '/v1/memories')).toEqual({ status: 401, body: { error: 'unauthenticated' } });
  });

  it('token caducado, 401 con motivo', async () => {
    const old = token(alice, 60, Math.floor(Date.now() / 1000) - 3600);
    expect(await call('GET', '/v1/memories', { auth: `Bearer ${old}` })).toEqual({ status: 401, body: { error: 'token_expired' } });
  });

  it('un grant de voz no sirve como token de la API', async () => {
    const { signGrant } = await import('@kotaru/gateway');
    const grant = signGrant(
      {
        subjectId: alice, conversationId: 'c', plan: 'close', region: 'us', locale: 'es-419', sensitivity: 'standard',
        quality: 'balanced', budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: 1 },
        maxSessionSeconds: 60, aud: API_AUD,
      },
      accessKey,
      { nowSeconds: Math.floor(Date.now() / 1000) },
    );
    expect((await call('GET', '/v1/memories', { auth: `Bearer ${grant}` })).status).toBe(401);
  });
});

describe('centro de memoria', () => {
  it('lista solo lo del usuario del token', async () => {
    await seed(alice, 'me gusta el mar');
    await seed(bob, 'me gusta la montana');
    const res = await call('GET', '/v1/memories', { sub: alice });
    expect(res.status).toBe(200);
    expect(res.body!.memories.map((m: any) => m.text)).toEqual(['me gusta el mar']);
    expect(JSON.stringify(res.body)).not.toContain(alice);
  });

  it('aprobar, fijar, editar y borrar', async () => {
    const m = await seed(alice, 'me gusta el mar');
    expect((await call('POST', `/v1/memories/${m.id}/approve`, { sub: alice })).body!.memory.status).toBe('approved');
    const pinned = await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, body: { pinned: true, text: 'me encanta el mar' } });
    expect(pinned.body!.memory).toMatchObject({ pinned: true, text: 'me encanta el mar' });
    expect((await call('DELETE', `/v1/memories/${m.id}`, { sub: alice })).status).toBe(204);
    expect((await call('GET', '/v1/memories', { sub: alice })).body!.memories).toEqual([]);
  });

  it('rechazar', async () => {
    const m = await seed(alice, 'me gusta el cafe');
    expect((await call('POST', `/v1/memories/${m.id}/reject`, { sub: alice })).body!.memory.status).toBe('rejected');
  });

  it('lo de otro usuario responde 404 y no se toca', async () => {
    const m = await seed(bob, 'me gusta la montana');
    expect((await call('POST', `/v1/memories/${m.id}/approve`, { sub: alice })).status).toBe(404);
    expect((await call('DELETE', `/v1/memories/${m.id}`, { sub: alice })).status).toBe(404);
    expect((await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, body: { pinned: true } })).status).toBe(404);
    expect((await memory.get(m.id))!.status).toBe('proposed');
  });

  it('el tope se comunica como 409 y la lista avisa antes', async () => {
    const ids = [];
    for (const t of ['uno uno', 'dos dos', 'tres tres']) ids.push((await seed(alice, t)).id);
    await call('POST', `/v1/memories/${ids[0]}/approve`, { sub: alice });
    await call('POST', `/v1/memories/${ids[1]}/approve`, { sub: alice });
    expect(await call('POST', `/v1/memories/${ids[2]}/approve`, { sub: alice })).toEqual({ status: 409, body: { error: 'at_capacity' } });
    expect((await call('GET', '/v1/memories', { sub: alice })).body).toMatchObject({ atCapacity: true, approvedCount: 2 });
  });

  it('editar hacia algo bloqueado por el guardia es 422 y no se guarda', async () => {
    const m = await seed(alice, 'me gusta el mar');
    const res = await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, body: { text: 'mi tarjeta es 4242424242424242' } });
    expect(res).toEqual({ status: 422, body: { error: 'payment_card' } });
    expect((await memory.get(m.id))!.text).toBe('me gusta el mar');
  });

  it('valida el cuerpo: campos desconocidos, tipos, JSON roto, tamano', async () => {
    const m = await seed(alice, 'me gusta el mar');
    expect((await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, body: { status: 'approved' } })).body).toEqual({ error: 'unknown_field' });
    expect((await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, body: { pinned: 'si' } })).body).toEqual({ error: 'invalid_pinned' });
    expect((await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, raw: '{roto' })).body).toEqual({ error: 'invalid_json' });
    expect((await call('PATCH', `/v1/memories/${m.id}`, { sub: alice, raw: JSON.stringify({ text: 'x'.repeat(20_000) }) })).status).toBe(413);
  });

  it('un id que no es uuid no llega al almacenamiento', async () => {
    expect((await call('DELETE', "/v1/memories/1'%20or%20'1'='1", { sub: alice })).status).toBe(404);
  });
});

describe('exportacion y retencion', () => {
  it('exporta lo del usuario del token', async () => {
    await seed(alice, 'me gusta el mar');
    const res = await call('GET', '/v1/export', { sub: alice });
    expect(res.status).toBe(200);
    expect(res.body!.memories).toHaveLength(1);
  });

  it('lee y cambia la retencion, y valida el rango', async () => {
    expect((await call('GET', '/v1/settings/retention', { sub: alice })).body).toEqual({ messageRetentionDays: 30 });
    expect((await call('PUT', '/v1/settings/retention', { sub: alice, body: { days: 7 } })).body).toEqual({ messageRetentionDays: 7 });
    expect((await call('PUT', '/v1/settings/retention', { sub: alice, body: { days: 0 } })).status).toBe(400);
    expect((await call('PUT', '/v1/settings/retention', { sub: alice, body: { days: null } })).body).toEqual({ messageRetentionDays: 30 });
  });
});

describe('limite de peticiones', () => {
  it('corta al usuario que se pasa, sin afectar a otro', async () => {
    let limited = 0;
    for (let i = 0; i < 35; i += 1) if ((await call('GET', '/v1/memories', { sub: alice })).status === 429) limited += 1;
    expect(limited).toBe(5);
    expect((await call('GET', '/v1/memories', { sub: bob })).status).toBe(200);
  });
});

describe('CORS', () => {
  it('solo responde a los origenes permitidos', async () => {
    const pre = await fetch(`http://127.0.0.1:${server.port}/v1/memories`, {
      method: 'OPTIONS',
      headers: { origin: 'https://app.kotaru.test', 'access-control-request-method': 'GET' },
    });
    expect(pre.status).toBe(204);
    expect(pre.headers.get('access-control-allow-origin')).toBe('https://app.kotaru.test');
    expect(pre.headers.get('access-control-allow-headers')).toContain('authorization');

    const other = await fetch(`http://127.0.0.1:${server.port}/v1/memories`, { headers: { origin: 'https://malicioso.test' } });
    expect(other.headers.get('access-control-allow-origin')).toBeNull();
  });
});
