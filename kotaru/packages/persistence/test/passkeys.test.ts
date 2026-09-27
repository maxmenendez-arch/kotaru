import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { loadMigrations, runMigrations } from '../src/migrate.js';
import { PasskeyAlreadyRegistered, PasskeyRepository } from '../src/passkey-repository.js';
import { deleteAccount } from '../src/deletion.js';
import { runRetention } from '../src/retention.js';
import { pgliteClient } from './pglite-client.js';
import type { SqlClient } from '../src/client.js';

const MIGRATIONS = loadMigrations(fileURLToPath(new URL('../migrations', import.meta.url)));
const NOW = '2026-09-27T12:00:00.000Z';
const LATER = '2026-09-27T12:10:00.000Z';

let sql: SqlClient;
let repo: PasskeyRepository;

beforeEach(async () => {
  sql = pgliteClient(new PGlite());
  await runMigrations(sql, MIGRATIONS);
  repo = new PasskeyRepository(sql);
});

const passkey = (credentialId = 'cred-1') => ({
  userHandle: 'handle-1',
  credentialId,
  publicKey: new Uint8Array([1, 2, 3]),
  signCount: 0,
  transports: ['internal', 'hybrid'],
  backedUp: true,
});

describe('retos de passkey', () => {
  it('se gastan una sola vez y solo con su tipo', async () => {
    const id = await repo.createChallenge({ kind: 'login', challenge: 'abc', userHandle: null, expiresAtIso: LATER });
    expect(await repo.consumeChallenge(id, 'register', NOW)).toBeNull();
    expect(await repo.consumeChallenge(id, 'login', NOW)).toEqual({ challenge: 'abc', userHandle: null });
    expect(await repo.consumeChallenge(id, 'login', NOW)).toBeNull();
  });

  it('caducan, y la retencion los barre', async () => {
    const id = await repo.createChallenge({ kind: 'register', challenge: 'x', userHandle: 'h', expiresAtIso: NOW });
    expect(await repo.consumeChallenge(id, 'register', LATER)).toBeNull();
    const report = await runRetention(sql, LATER);
    expect(report.webauthnChallenges).toBe(1);
  });
});

describe('cuentas con passkey', () => {
  it('crea cuenta, seudonimo y passkey juntos, y la encuentra por su id', async () => {
    const created = await repo.createAccountWithPasskey(passkey());
    const found = await repo.findPasskey('cred-1');
    expect(found).toMatchObject({
      credentialId: 'cred-1',
      accountId: created.accountId,
      subjectId: created.subjectId,
      userHandle: 'handle-1',
      signCount: 0,
      transports: ['internal', 'hybrid'],
    });
    expect(Array.from(found!.publicKey)).toEqual([1, 2, 3]);
  });

  it('una passkey ya registrada no crea una segunda cuenta ni deja restos', async () => {
    await repo.createAccountWithPasskey(passkey());
    await expect(repo.createAccountWithPasskey({ ...passkey(), userHandle: 'otro' })).rejects.toBeInstanceOf(PasskeyAlreadyRegistered);
    const accounts = await sql.query<{ n: number }>("select count(*)::int as n from identity.accounts where auth_provider = 'passkey'");
    expect(accounts.rows[0]!.n).toBe(1);
  });

  it('el contador solo avanza', async () => {
    await repo.createAccountWithPasskey(passkey());
    await repo.markUsed('cred-1', 5, NOW);
    await repo.markUsed('cred-1', 3, LATER);
    expect((await repo.findPasskey('cred-1'))!.signCount).toBe(5);
  });

  it('borrar la cuenta borra sus passkeys', async () => {
    const { accountId } = await repo.createAccountWithPasskey(passkey());
    expect((await deleteAccount(sql, accountId)).ok).toBe(true);
    expect(await repo.findPasskey('cred-1')).toBeNull();
    const left = await sql.query<{ n: number }>('select count(*)::int as n from identity.passkeys');
    expect(left.rows[0]!.n).toBe(0);
  });
});
