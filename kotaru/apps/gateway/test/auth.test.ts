import { createHash, createSign, generateKeyPairSync, randomBytes, randomUUID, type KeyObject } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { PROTOCOL_VERSION } from '@kotaru/gateway';
import { MemoryStore } from '@kotaru/memory';
import {
  AccountRepository,
  countRemainingFor,
  deleteAccount,
  loadMigrations,
  MIGRATIONS_DIR,
  runMigrations,
  type SqlClient,
} from '@kotaru/persistence';
import { pgliteClient } from '@kotaru/persistence/testing';
import { APPLE, durableStores, GOOGLE, IdTokenVerifier, startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { buildDeps, connect, waitFor } from './helpers.js';
import { AuthApi, ConversationClient, type AuthSession, type SocketLike } from '@kotaru/client';
import WebSocket from 'ws';

/**
 * Login con Apple y Google contra un JWKS falso con claves RSA generadas aqui: mismas
 * comprobaciones que con los reales, sin red.
 */
const APPLE_CLIENT = 'app.kotaru.mobile';
const GOOGLE_CLIENT = 'kotaru-test.apps.googleusercontent.com';
const grantKey = { kid: 'g', secret: randomBytes(32) };
const accessKey = { kid: 'a', secret: randomBytes(32) };

let sql: SqlClient;
let jwks: Server;
let server: GatewayServerHandle;
let base: string;
let signingKey: KeyObject;
const kid = 'k1';
let jwksHits = 0;
let jwksDown = false;

function idToken(claims: Record<string, unknown>, opts: { alg?: string; kid?: string; key?: KeyObject } = {}): string {
  const header = Buffer.from(JSON.stringify({ alg: opts.alg ?? 'RS256', kid: opts.kid ?? kid })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(JSON.stringify({ iat: now, exp: now + 600, ...claims })).toString('base64url');
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${body}`);
  return `${header}.${body}.${signer.sign(opts.key ?? signingKey).toString('base64url')}`;
}
/** El nonce que "genero la app" para cada login de estas pruebas. */
const RAW_NONCE = 'nonce-de-prueba-0123456789';
const apple = (sub: string, extra: Record<string, unknown> = {}) =>
  idToken({
    iss: 'https://appleid.apple.com', aud: APPLE_CLIENT, sub,
    nonce: createHash('sha256').update(RAW_NONCE).digest('hex'), ...extra,
  });
const google = (sub: string, extra: Record<string, unknown> = {}) =>
  idToken({ iss: 'https://accounts.google.com', aud: GOOGLE_CLIENT, sub, nonce: RAW_NONCE, ...extra });

async function post(path: string, body: unknown, token?: string) {
  if (/^\/v1\/auth\/(apple|google)$/.test(path) && typeof body === 'object' && body !== null && !('nonce' in body)) {
    body = { ...body, nonce: RAW_NONCE };
  }
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json()) as Record<string, any> };
}

beforeEach(async () => {
  const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
  signingKey = pair.privateKey;
  const jwk = { ...pair.publicKey.export({ format: 'jwk' }), kid, use: 'sig', alg: 'RS256' };
  jwksHits = 0;
  jwksDown = false;
  jwks = createServer((_req, res) => {
    jwksHits += 1;
    if (jwksDown) return void res.writeHead(503).end();
    res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ keys: [jwk] }));
  });
  await new Promise<void>((r) => jwks.listen(0, '127.0.0.1', r));
  const jwksUrl = `http://127.0.0.1:${(jwks.address() as AddressInfo).port}/keys`;

  sql = pgliteClient(new PGlite());
  await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
  const stores = durableStores(sql);
  const { deps } = buildDeps(undefined, stores.usage, stores.memories);
  const accounts = new AccountRepository(sql);
  server = await startGatewayServer({
    port: 0,
    keys: [grantKey],
    audience: 'gw',
    grantClaims: stores.grantClaims,
    deps: { ...deps, conversations: stores.conversations },
    api: {
      keys: [accessKey],
      audience: 'api',
      memory: new MemoryStore({ now: Date.now, newId: randomUUID, repository: stores.memories }),
      now: Date.now,
      auth: {
        accounts,
        verifiers: {
          apple: new IdTokenVerifier({ ...APPLE, jwksUrl, audiences: [APPLE_CLIENT] }),
          google: new IdTokenVerifier({ ...GOOGLE, jwksUrl, audiences: [GOOGLE_CLIENT] }),
        },
        emailHashKey: randomBytes(32),
        emailEncryptionKey: randomBytes(32),
        accessKeys: [accessKey],
        apiAudience: 'api',
        grantKeys: [grantKey],
        grantAudience: 'gw',
        monthlyHardCapUsd: 50,
        deleteAccount: (id) => deleteAccount(sql, id),
        now: Date.now,
      },
    },
  });
  base = `http://127.0.0.1:${server.port}`;
});

afterEach(async () => {
  await server.close();
  await new Promise<void>((r) => jwks.close(() => r()));
});

describe('login', () => {
  it('Apple crea la cuenta con un seudonimo nuevo, y el mismo login vuelve a la misma', async () => {
    const first = await post('/v1/auth/apple', { idToken: apple('apple-001', { email: 'ana@example.com', email_verified: 'true' }) });
    expect(first.status).toBe(200);
    expect(first.body).toMatchObject({ newAccount: true, expiresIn: 900 });
    const again = await post('/v1/auth/apple', { idToken: apple('apple-001') });
    expect(again.body.newAccount).toBe(false);

    const me = await fetch(`${base}/v1/memories`, { headers: { authorization: `Bearer ${again.body.accessToken}` } });
    expect(me.status).toBe(200);
  });

  it('el correo no se guarda en claro', async () => {
    await post('/v1/auth/apple', { idToken: apple('apple-002', { email: 'Ana@Example.com', email_verified: 'true' }) });
    const { rows } = await sql.query<{ h: Uint8Array | null; e: Uint8Array | null }>(
      "select email_hash as h, email_encrypted as e from identity.accounts where auth_subject = 'apple-002'",
    );
    expect(rows[0]!.h).not.toBeNull();
    expect(Buffer.from(rows[0]!.e!).toString('latin1')).not.toContain('example.com');
  });

  it('rechaza audiencia ajena, caducado, emisor equivocado, firma alterada, kid desconocido y HS256', async () => {
    const bad = [
      idToken({ iss: 'https://appleid.apple.com', aud: 'otra.app', sub: 'x' }),
      apple('x', { exp: Math.floor(Date.now() / 1000) - 3600 }),
      google('x'), // token de Google en la ruta de Apple
      apple('x').replace(/\.([^.]+)\./, (_m, p: string) => `.${Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(p, 'base64url').toString()), sub: 'otro' })).toString('base64url')}.`),
      apple('x', {}),
    ];
    bad[4] = idToken({ iss: 'https://appleid.apple.com', aud: APPLE_CLIENT, sub: 'x' }, { kid: 'inventado' });
    for (const token of bad) {
      expect((await post('/v1/auth/apple', { idToken: token })).body).toEqual({ error: 'invalid_id_token' });
    }
    const hs = (() => {
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', kid })).toString('base64url');
      const body = Buffer.from(JSON.stringify({ iss: 'https://appleid.apple.com', aud: APPLE_CLIENT, sub: 'x', exp: 9e9 })).toString('base64url');
      return `${header}.${body}.firma`;
    })();
    expect((await post('/v1/auth/apple', { idToken: hs })).body).toEqual({ error: 'invalid_id_token' });
  });

  it('el mismo correo por Google no se fusiona con la cuenta de Apple', async () => {
    const a = await post('/v1/auth/apple', { idToken: apple('apple-003', { email: 'luis@example.com', email_verified: 'true' }) });
    const g = await post('/v1/auth/google', { idToken: google('google-003', { email: 'luis@example.com', email_verified: true }) });
    expect(g.status).toBe(200);
    expect(g.body.newAccount).toBe(true);
    const ids = await sql.query<{ n: string }>('select count(*)::text as n from identity.accounts');
    expect(ids.rows[0]!.n).toBe('2');
    expect(a.body.accessToken).not.toBe(g.body.accessToken);
  });
});

describe('renovacion', () => {
  it('rota, y dos usos simultaneos del mismo token no dan dos sesiones', async () => {
    const login = await post('/v1/auth/google', { idToken: google('google-010') });
    const racing = await Promise.all([
      post('/v1/auth/refresh', { refreshToken: login.body.refreshToken }),
      post('/v1/auth/refresh', { refreshToken: login.body.refreshToken }),
    ]);
    expect(racing.filter((r) => r.status === 200)).toHaveLength(1);
    // El segundo uso cuenta como reutilizacion: la sesion entera queda revocada. La app
    // hace una sola renovacion a la vez (AuthApi), asi que esto solo pasa con una copia.
    const winner = racing.find((r) => r.status === 200)!;
    expect((await post('/v1/auth/refresh', { refreshToken: winner.body.refreshToken })).status).toBe(401);
  });
});

describe('grant de voz', () => {
  it('abre una sesion de voz con una conversacion numerada por el servidor', async () => {
    const login = await post('/v1/auth/apple', { idToken: apple('apple-020') });
    const issued = await post('/v1/session/grant', { locale: 'en-US' }, login.body.accessToken);
    expect(issued.status).toBe(200);
    expect(issued.body.conversationId).toMatch(/^[0-9a-f-]{36}$/);

    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: issued.body.grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.close();

    // Retomarla despues: si, porque ya existe y es suya.
    const resumed = await post('/v1/session/grant', { conversationId: issued.body.conversationId }, login.body.accessToken);
    expect(resumed.status).toBe(200);
    // La de otra persona: no.
    const other = await post('/v1/auth/apple', { idToken: apple('apple-021') });
    expect((await post('/v1/session/grant', { conversationId: issued.body.conversationId }, other.body.accessToken)).status).toBe(404);
  });

  it('cada conversacion es con un personaje: se elige al pedir el grant y no se mezcla al retomarla', async () => {
    const login = await post('/v1/auth/apple', { idToken: apple('apple-022') });
    expect((await post('/v1/session/grant', { companion: 'otro' }, login.body.accessToken)).status).toBe(400);
    const issued = await post('/v1/session/grant', { companion: 'nova' }, login.body.accessToken);
    expect(issued.status).toBe(200);
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: issued.body.grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.close();
    const { rows } = await sql.query<{ companion_id: string }>('select companion_id from app.conversations where id = $1', [issued.body.conversationId]);
    expect(rows[0]?.companion_id).toBe('nova');
    const again = await post('/v1/session/grant', { conversationId: issued.body.conversationId, companion: 'nova' }, login.body.accessToken);
    expect(again.status).toBe(200);
    const mixed = await post('/v1/session/grant', { conversationId: issued.body.conversationId, companion: 'sage' }, login.body.accessToken);
    expect(mixed.status).toBe(409);
  });

  it('sin token no hay grant', async () => {
    expect((await post('/v1/session/grant', {})).status).toBe(401);
  });
});

describe('borrado de cuenta desde la app', () => {
  it('borra todo, invalida la renovacion, y volver a entrar crea una cuenta nueva', async () => {
    const login = await post('/v1/auth/apple', { idToken: apple('apple-030', { email: 'eva@example.com', email_verified: 'true' }) });
    const issued = await post('/v1/session/grant', {}, login.body.accessToken);
    const { socket, collected } = await connect(server.port);
    socket.send(JSON.stringify({ type: 'hello', grant: issued.body.grant, protocolVersion: PROTOCOL_VERSION }));
    await waitFor(collected, (m) => m.some((x) => x.type === 'ready'));
    socket.send(JSON.stringify({ type: 'turn_start', turnId: 't1' }));
    for (let i = 0; i < 8; i += 1) socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
    socket.send(JSON.stringify({ type: 'turn_end', turnId: 't1' }));
    await waitFor(collected, (m) => m.filter((x) => x.type === 'usage').length >= 2);
    socket.close();

    const subject = await sql.query<{ s: string }>(
      "select l.subject_id::text as s from identity.subject_links l join identity.accounts a on a.id = l.account_id where a.auth_subject = 'apple-030'",
    );
    const subjectId = subject.rows[0]!.s;
    expect(await countRemainingFor(sql, subjectId)).toBeGreaterThan(0);

    const del = await fetch(`${base}/v1/account`, { method: 'DELETE', headers: { authorization: `Bearer ${login.body.accessToken}` } });
    expect(del.status).toBe(204);
    expect(await countRemainingFor(sql, subjectId)).toBe(0);
    expect((await sql.query("select 1 from identity.accounts where auth_subject = 'apple-030'")).rows).toHaveLength(0);
    expect((await post('/v1/auth/refresh', { refreshToken: login.body.refreshToken })).body).toEqual({ error: 'invalid_refresh' });

    const again = await post('/v1/auth/apple', { idToken: apple('apple-030') });
    expect(again.body.newAccount).toBe(true);
  });
});

describe('cliente de la app (AuthApi)', () => {
  it('inicia sesion, renueva sola, pide grants para hablar y borra la cuenta', async () => {
    let clock = Date.now();
    const saved: (AuthSession | null)[] = [];
    const auth = new AuthApi({ baseUrl: base, now: () => clock, onSession: (s) => saved.push(s) });
    const session = await auth.signInWithApple(apple('apple-040'), RAW_NONCE);
    expect(session.newAccount).toBe(true);
    const firstToken = await auth.accessToken();
    expect(firstToken).toBe(session.accessToken);

    // 14 minutos y medio despues: renueva sin que la app haga nada, y rota el de renovacion.
    clock += 14.5 * 60_000;
    const [a, b] = await Promise.all([auth.accessToken(), auth.accessToken()]);
    expect(a).toBe(b);
    expect(saved.at(-1)!.refreshToken).not.toBe(session.refreshToken);

    const events: string[] = [];
    const conversation = new ConversationClient({
      url: base.replace('http', 'ws'),
      getGrant: async () => (await auth.voiceGrant()).grant,
      createSocket: (url) => new WebSocket(url) as unknown as SocketLike,
      onEvent: (e) => e.type === 'state' && events.push(e.state),
    });
    await conversation.connect();
    expect(events.at(-1)).toBe('idle');
    conversation.close();

    await auth.deleteAccount();
    expect(auth.signedIn).toBe(false);
    expect(saved.at(-1)).toBeNull();
  });

  it('si la renovacion se rechaza, la sesion se da por cerrada', async () => {
    const auth = new AuthApi({ baseUrl: base, restore: { refreshToken: 'x'.repeat(43) } });
    await expect(auth.accessToken()).rejects.toMatchObject({ status: 401, code: 'invalid_refresh' });
    expect(auth.signedIn).toBe(false);
  });
});

describe('endurecimiento', () => {
  it('el nonce es obligatorio y tiene que coincidir con el firmado', async () => {
    expect((await post('/v1/auth/apple', { idToken: apple('apple-050'), nonce: undefined as unknown as string })).status).toBe(400);
    const res = await fetch(`${base}/v1/auth/apple`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ idToken: apple('apple-050') }),
    });
    expect(await res.json()).toEqual({ error: 'nonce_required' });
    expect((await post('/v1/auth/apple', { idToken: apple('apple-050'), nonce: 'otro-nonce-distinto-000' })).body).toEqual({ error: 'invalid_id_token' });
    // A Google se le pasa el nonce tal cual; el hash de Apple no sirve alli.
    expect((await post('/v1/auth/google', { idToken: google('g-050', { nonce: 'x'.repeat(20) }) })).body).toEqual({ error: 'invalid_id_token' });
  });

  it('reusar un token de renovacion ya usado revoca toda la sesion (robo detectado)', async () => {
    const login = await post('/v1/auth/google', { idToken: google('google-060') });
    const r1 = await post('/v1/auth/refresh', { refreshToken: login.body.refreshToken });
    expect(r1.status).toBe(200);
    // Alguien usa el viejo otra vez: fuera todos, tambien el nuevo.
    expect((await post('/v1/auth/refresh', { refreshToken: login.body.refreshToken })).status).toBe(401);
    expect((await post('/v1/auth/refresh', { refreshToken: r1.body.refreshToken })).status).toBe(401);
  });

  it('cerrar sesion invalida el token de renovacion en el servidor', async () => {
    const login = await post('/v1/auth/apple', { idToken: apple('apple-070') });
    expect((await post('/v1/auth/logout', { refreshToken: login.body.refreshToken })).body).toEqual({ ok: true });
    expect((await post('/v1/auth/refresh', { refreshToken: login.body.refreshToken })).status).toBe(401);
  });

  it('con el proveedor caido responde 503, no "token invalido"', async () => {
    jwksDown = true;
    expect(await post('/v1/auth/apple', { idToken: apple('apple-080') })).toEqual({ status: 503, body: { error: 'provider_unavailable' } });
  });

  it('logins simultaneos con kids inventados no disparan una descarga de claves por cada uno', async () => {
    await post('/v1/auth/apple', { idToken: apple('apple-090') }); // carga inicial
    const before = jwksHits;
    const forged = Array.from({ length: 15 }, (_, i) => idToken({ iss: 'https://appleid.apple.com', aud: APPLE_CLIENT, sub: 'x' }, { kid: `falso-${i}` }));
    await Promise.all(forged.map((t) => post('/v1/auth/apple', { idToken: t })));
    expect(jwksHits - before).toBeLessThanOrEqual(1);
  });
});
