import { generateKeyPairSync, randomBytes, randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { MemoryStore } from '@kotaru/memory';
import { AccountRepository, deleteAccount, loadMigrations, MIGRATIONS_DIR, PasskeyRepository, runMigrations, type SqlClient } from '@kotaru/persistence';
import { pgliteClient } from '@kotaru/persistence/testing';
import { durableStores, startGatewayServer, type GatewayServerHandle } from '../src/index.js';
import { ipv6Prefix64 } from '../src/api.js';
import { buildDeps } from './helpers.js';
import { SoftAuthenticator } from './soft-authenticator.js';
import { AuthApi } from '@kotaru/client';

const RP_ID = 'kotaru.test';
const ORIGIN = 'https://app.kotaru.test';
const grantKey = { kid: 'g', secret: randomBytes(32) };
const accessKey = { kid: 'a', secret: randomBytes(32) };

let sql: SqlClient;
let server: GatewayServerHandle;
let base: string;

async function post(path: string, body: unknown = {}, token?: string) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json().catch(() => ({}))) as Record<string, any> };
}

const subjectOf = (accessToken: string) =>
  JSON.parse(Buffer.from(accessToken.split('.')[1]!, 'base64url').toString('utf8')).sub as string;

async function register(auth: SoftAuthenticator, tweak: Parameters<SoftAuthenticator['register']>[2] = {}, origin = ORIGIN) {
  const start = await post('/v1/auth/passkey/register/options');
  expect(start.status).toBe(200);
  return post('/v1/auth/passkey/register/verify', { flowId: start.body.flowId, response: auth.register(start.body.options, origin, tweak) });
}

async function login(auth: SoftAuthenticator, tweak: Parameters<SoftAuthenticator['login']>[2] = {}, origin = ORIGIN) {
  const start = await post('/v1/auth/passkey/login/options');
  expect(start.status).toBe(200);
  return post('/v1/auth/passkey/login/verify', { flowId: start.body.flowId, response: auth.login(start.body.options, origin, tweak) });
}

beforeEach(async () => {
  sql = pgliteClient(new PGlite());
  await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
  const stores = durableStores(sql);
  const { deps } = buildDeps(undefined, stores.usage, stores.memories);
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
        accounts: new AccountRepository(sql),
        verifiers: {},
        emailHashKey: randomBytes(32),
        emailEncryptionKey: randomBytes(32),
        accessKeys: [accessKey],
        apiAudience: 'api',
        grantKeys: [grantKey],
        grantAudience: 'gw',
        monthlyHardCapUsd: 50,
        deleteAccount: (id) => deleteAccount(sql, id),
        now: Date.now,
        passkeys: { store: new PasskeyRepository(sql), rpId: RP_ID, rpName: 'Kotaru', origins: [ORIGIN] },
      },
    },
  });
  base = `http://127.0.0.1:${server.port}`;
});

afterEach(async () => {
  await server.close();
});

describe('passkeys', () => {
  it('registrarse crea una cuenta nueva con sesion, sin correo ni nombre', async () => {
    const auth = new SoftAuthenticator();
    const start = await post('/v1/auth/passkey/register/options');
    expect(start.body.options).toMatchObject({
      rp: { id: RP_ID, name: 'Kotaru' },
      authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
      attestation: 'none',
    });
    expect(start.body.options.user.name).toMatch(/^Kotaru \d{4}-\d{2}-\d{2}$/);
    const done = await post('/v1/auth/passkey/register/verify', { flowId: start.body.flowId, response: auth.register(start.body.options, ORIGIN) });
    expect(done.status).toBe(200);
    expect(done.body).toMatchObject({ newAccount: true, expiresIn: 900 });
    const me = await fetch(`${base}/v1/memories`, { headers: { authorization: `Bearer ${done.body.accessToken}` } });
    expect(me.status).toBe(200);
    const row = await sql.query<{ n: number }>("select count(*)::int as n from identity.accounts where auth_provider = 'passkey' and email_hash is null");
    expect(row.rows[0]!.n).toBe(1);
  });

  it('entrar con la misma passkey vuelve a la misma cuenta, y el token de renovacion funciona', async () => {
    const auth = new SoftAuthenticator();
    const created = await register(auth);
    const again = await login(auth);
    expect(again.status).toBe(200);
    expect(again.body.newAccount).toBe(false);
    expect(subjectOf(again.body.accessToken)).toBe(subjectOf(created.body.accessToken));
    const refreshed = await post('/v1/auth/refresh', { refreshToken: again.body.refreshToken });
    expect(refreshed.status).toBe(200);
  });

  it('cada reto sirve una sola vez, aunque el primer intento falle', async () => {
    const auth = new SoftAuthenticator();
    await register(auth);
    const start = await post('/v1/auth/passkey/login/options');
    const bad = await post('/v1/auth/passkey/login/verify', { flowId: start.body.flowId, response: auth.login(start.body.options, 'https://evil.example') });
    expect(bad).toMatchObject({ status: 401, body: { error: 'invalid_passkey' } });
    const retry = await post('/v1/auth/passkey/login/verify', { flowId: start.body.flowId, response: auth.login(start.body.options, ORIGIN) });
    expect(retry).toMatchObject({ status: 401, body: { error: 'invalid_challenge' } });
  });

  it('un reto de registro no vale para entrar, ni al reves', async () => {
    const auth = new SoftAuthenticator();
    await register(auth);
    const reg = await post('/v1/auth/passkey/register/options');
    const res = await post('/v1/auth/passkey/login/verify', { flowId: reg.body.flowId, response: auth.login({ challenge: reg.body.options.challenge, rpId: RP_ID }, ORIGIN) });
    expect(res.body.error).toBe('invalid_challenge');
  });

  it('rechaza otro origen, otro dominio y la falta de verificacion del usuario al registrarse', async () => {
    expect((await register(new SoftAuthenticator(), {}, 'https://kotaru.test.evil.example')).status).toBe(401);
    expect((await register(new SoftAuthenticator(), { rpId: 'evil.example' })).status).toBe(401);
    // Sin el bit UV (solo presencia): alguien toco el aparato, pero no se identifico.
    expect((await register(new SoftAuthenticator(), { flags: 0x41 })).status).toBe(401);
    const row = await sql.query<{ n: number }>('select count(*)::int as n from identity.accounts');
    expect(row.rows[0]!.n).toBe(0);
  });

  it('rechaza una firma hecha con otra clave y una passkey que nunca se registro', async () => {
    const auth = new SoftAuthenticator();
    await register(auth);
    const other = generateKeyPairSync('ec', { namedCurve: 'P-256' }).privateKey;
    expect(await login(auth, { key: other })).toMatchObject({ status: 401, body: { error: 'invalid_passkey' } });
    expect(await login(new SoftAuthenticator())).toMatchObject({ status: 401, body: { error: 'invalid_passkey' } });
  });

  it('un contador que retrocede delata una passkey clonada', async () => {
    const auth = new SoftAuthenticator();
    await register(auth);
    expect((await login(auth, { counter: 10 })).status).toBe(200);
    expect((await login(auth, { counter: 4 })).status).toBe(401);
  });

  it('el user handle tiene que ser el de la cuenta', async () => {
    const auth = new SoftAuthenticator();
    await register(auth);
    auth.userHandle = Buffer.from(randomBytes(32)).toString('base64url');
    expect((await login(auth)).status).toBe(401);
  });

  it('la misma passkey no registra dos cuentas', async () => {
    const auth = new SoftAuthenticator();
    expect((await register(auth)).status).toBe(200);
    expect(await register(auth)).toMatchObject({ status: 409, body: { error: 'passkey_already_registered' } });
  });

  it('tras borrar la cuenta, la passkey ya no entra', async () => {
    const auth = new SoftAuthenticator();
    const created = await register(auth);
    const del = await fetch(`${base}/v1/account`, { method: 'DELETE', headers: { authorization: `Bearer ${created.body.accessToken}` } });
    expect(del.status).toBe(204);
    expect((await login(auth)).status).toBe(401);
  });

  it('cuerpos malformados se rechazan sin llegar a la verificacion', async () => {
    const start = await post('/v1/auth/passkey/login/options');
    expect((await post('/v1/auth/passkey/login/verify', { flowId: 'x', response: {} })).status).toBe(400);
    expect((await post('/v1/auth/passkey/login/verify', { flowId: start.body.flowId, response: { id: 'no base64!' } })).status).toBe(400);
    // Demasiado grande: lo corta ya el lector del cuerpo (413) o la comprobacion de tamano.
    expect([400, 413]).toContain((await post('/v1/auth/passkey/login/verify', { flowId: start.body.flowId, response: { id: 'a'.repeat(20_000) } })).status);
    expect((await post('/v1/auth/passkey/nada')).status).toBe(404);
  });

  it('el cliente compartido (AuthApi) hace los dos flujos y queda con sesion', async () => {
    const auth = new SoftAuthenticator();
    const api = new AuthApi({ baseUrl: base });
    const reg = await api.passkeyRegistrationOptions();
    const created = await api.completePasskeyRegistration(reg.flowId, auth.register(reg.options as never, ORIGIN));
    expect(created.newAccount).toBe(true);
    expect(api.signedIn).toBe(true);
    await api.signOut();
    const log = await api.passkeyLoginOptions();
    const session = await api.completePasskeyLogin(log.flowId, auth.login(log.options as never, ORIGIN));
    expect(subjectOf(session.accessToken)).toBe(subjectOf(created.accessToken));
    expect((await api.voiceGrant()).grant).toBeTypeOf('string');
  });

  it('AuthApi usa el fetch global como lo exige el navegador (sin otro this)', async () => {
    const original = globalThis.fetch;
    // Como en Chrome: llamar a fetch con un `this` que no es la ventana lanza TypeError.
    globalThis.fetch = function (this: unknown, input: RequestInfo | URL, init?: RequestInit) {
      if (this !== undefined && this !== globalThis) throw new TypeError('Illegal invocation');
      return original(input, init);
    } as typeof fetch;
    try {
      const api = new AuthApi({ baseUrl: base });
      const { flowId } = await api.passkeyLoginOptions();
      expect(flowId).toMatch(/^[0-9a-f-]{36}$/);
    } finally {
      globalThis.fetch = original;
    }
  });

  it('crear cuentas tiene su propio limite por IP, mas estricto que entrar', async () => {
    for (let i = 0; i < 3; i += 1) expect((await post('/v1/auth/passkey/register/options')).status).toBe(200);
    expect(await post('/v1/auth/passkey/register/options')).toMatchObject({ status: 429, body: { error: 'signup_rate_limited' } });
    // Entrar sigue funcionando desde esa IP.
    expect((await post('/v1/auth/passkey/login/options')).status).toBe(200);
  });
});

describe('cupo diario de cuentas nuevas', () => {
  it('se agota para todo el servidor aunque las peticiones vengan de IPs distintas', async () => {
    await server.close();
    const stores = durableStores(sql);
    const { deps } = buildDeps(undefined, stores.usage, stores.memories);
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
        trustProxy: true,
        signupsPerDay: 2,
        auth: {
          accounts: new AccountRepository(sql),
          verifiers: {},
          emailHashKey: randomBytes(32),
          emailEncryptionKey: randomBytes(32),
          accessKeys: [accessKey],
          apiAudience: 'api',
          grantKeys: [grantKey],
          grantAudience: 'gw',
          monthlyHardCapUsd: 50,
          deleteAccount: (id) => deleteAccount(sql, id),
          now: Date.now,
          passkeys: { store: new PasskeyRepository(sql), rpId: RP_ID, rpName: 'Kotaru', origins: [ORIGIN] },
        },
      },
    });
    base = `http://127.0.0.1:${server.port}`;
    const from = (ip: string) =>
      fetch(`${base}/v1/auth/passkey/register/options`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: '{}' });
    expect((await from('203.0.113.1')).status).toBe(200);
    expect((await from('203.0.113.2')).status).toBe(200);
    expect((await from('203.0.113.3')).status).toBe(429);
  });
});

describe('IPv6: una red /64 cuenta como una sola IP', () => {
  it('expande las direcciones comprimidas antes de cortar', () => {
    expect(ipv6Prefix64('2001:db8::5:1:2:3')).toBe('2001:db8:0:0::/64');
    expect(ipv6Prefix64('2001:db8:0:0:6::1')).toBe('2001:db8:0:0::/64');
    expect(ipv6Prefix64('2001:db8:0:1::1')).toBe('2001:db8:0:1::/64');
    expect(ipv6Prefix64('2001:DB8:AAAA:BBBB:1:2:3:4')).toBe('2001:db8:aaaa:bbbb::/64');
    expect(ipv6Prefix64('::1')).toBe('0:0:0:0::/64');
    expect(ipv6Prefix64('fe80::1%eth0')).toBe('fe80:0:0:0::/64');
  });
});
