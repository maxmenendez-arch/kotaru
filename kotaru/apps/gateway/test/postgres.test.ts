import { randomUUID } from 'node:crypto';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION, signGrant } from '@kotaru/gateway';
import {
  countRemainingFor,
  deleteAccount,
  loadMigrations,
  MIGRATIONS_DIR,
  runMigrations,
  UsageRepository,
} from '@kotaru/persistence';
import { durableStores, pgClient, startGatewayServer, type GatewayServerHandle, type PgSqlClient } from '../src/index.js';
import { AUDIENCE, buildDeps, claims as baseClaims, connect, key, waitFor } from './helpers.js';

/**
 * Pruebas contra un PostgreSQL de verdad, no simulado.
 *
 * Solo corren si existe KOTARU_TEST_DATABASE_URL, y solo contra una base cuyo nombre
 * termine en `_test`: la preparacion BORRA los esquemas, y apuntarla por error a la base
 * de produccion no puede ser posible.
 *
 *   KOTARU_TEST_DATABASE_URL=postgres://kotaru_test:CLAVE@127.0.0.1:5432/kotaru_test npm run test:pg
 */
const URL_ENV = process.env.KOTARU_TEST_DATABASE_URL;
const dbName = URL_ENV ? new URL(URL_ENV).pathname.replace(/^\//, '') : '';
if (URL_ENV && !dbName.endsWith('_test')) {
  throw new Error(`KOTARU_TEST_DATABASE_URL apunta a "${dbName}". Solo se aceptan bases *_test.`);
}

describe.skipIf(!URL_ENV)('PostgreSQL real', () => {
  let sql: PgSqlClient;
  let server: GatewayServerHandle | null = null;

  beforeAll(async () => {
    sql = pgClient({ connectionString: URL_ENV!, max: 10 });
    await sql.exec(`
      drop schema if exists app cascade;
      drop schema if exists identity cascade;
      drop table if exists schema_migrations;
    `);
    await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
  });

  afterEach(async () => {
    await server?.close();
    server = null;
  });

  afterAll(async () => {
    await sql?.close();
  });

  it('las migraciones son idempotentes contra el servidor real', async () => {
    const again = await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
    expect(again.applied).toEqual([]);
    expect(again.skipped).toHaveLength(5);
  });

  it('diez conexiones cobrando el mismo turno a la vez: solo una gana', async () => {
    // Con PGlite todo corre en un solo hilo. Aqui el pool abre conexiones reales y las
    // escrituras compiten de verdad en el servidor.
    const repo = new UsageRepository(sql);
    const subjectId = randomUUID();
    const entry = { turnId: `carrera_${randomUUID()}`, subjectId, voiceSeconds: 10, costUsd: 0.001 };
    const results = await Promise.all(Array.from({ length: 10 }, () => repo.record(entry)));
    expect(results.filter(Boolean)).toHaveLength(1);
    expect((await repo.forSubject(subjectId)).turns).toBe(1);
  });

  it('una transaccion que falla no deja nada escrito', async () => {
    const turnId = `rollback_${randomUUID()}`;
    await expect(
      sql.transaction(async (tx) => {
        await tx.query(
          'insert into app.usage_ledger (turn_id, subject_id, voice_seconds, cost_usd) values ($1,$2,1,0.001)',
          [turnId, randomUUID()],
        );
        throw new Error('fallo a mitad');
      }),
    ).rejects.toThrow('fallo a mitad');
    const { rows } = await sql.query('select 1 from app.usage_ledger where turn_id = $1', [turnId]);
    expect(rows).toHaveLength(0);
  });

  it('el borrado de cuenta no deja nada del seudonimo', async () => {
    const accountId = randomUUID();
    const subjectId = randomUUID();
    const hex = Buffer.from(`${accountId}@example.test`).toString('hex');
    await sql.query(
      `insert into identity.accounts (id, auth_provider, auth_subject, email_hash, email_encrypted)
       values ($1,'apple',$2, decode($3,'hex'), decode($3,'hex'))`,
      [accountId, `sub_${accountId}`, hex],
    );
    await sql.query('insert into identity.subject_links (account_id, subject_id) values ($1,$2)', [accountId, subjectId]);
    await new UsageRepository(sql).record({ turnId: `del_${randomUUID()}`, subjectId, voiceSeconds: 5, costUsd: 0.001 });

    const outcome = await deleteAccount(sql, accountId);
    expect(outcome.ok).toBe(true);
    expect(await countRemainingFor(sql, subjectId)).toBe(0);
  });

  it('el gateway conserva consumo y grants usados entre reinicios', async () => {
    const claims = { ...baseClaims, subjectId: randomUUID() };
    const boot = () => {
      const stores = durableStores(sql);
      const { deps } = buildDeps(undefined, stores.usage);
      return startGatewayServer({ port: 0, keys: [key], audience: AUDIENCE, deps, grantClaims: stores.grantClaims });
    };
    const hello = async (port: number, grant: string) => {
      const conn = await connect(port);
      conn.socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
      await waitFor(conn.collected, (m) => m.some((x) => x.type === 'ready' || x.type === 'rejected'));
      return conn;
    };
    const remaining = (messages: readonly { type: string }[]) => {
      const usage = messages.filter((m) => m.type === 'usage').at(-1) as { remainingSeconds: number } | undefined;
      if (!usage) throw new Error('sin usage');
      return usage.remainingSeconds;
    };
    const grant = signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) });

    server = await boot();
    const first = await hello(server.port, grant);
    const turnId = `pg_${randomUUID()}`;
    first.socket.send(JSON.stringify({ type: 'turn_start', turnId }));
    for (let i = 0; i < 8; i += 1) first.socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
    first.socket.send(JSON.stringify({ type: 'turn_end', turnId }));
    await waitFor(first.collected, (m) => m.filter((x) => x.type === 'usage').length >= 2);
    const after = remaining(first.collected.messages);
    first.socket.close();

    // Reinicio: proceso nuevo, misma base.
    await server.close();
    server = await boot();

    // El grant ya usado no vuelve a servir...
    const replay = await hello(server.port, grant);
    expect(replay.collected.messages[0]).toMatchObject({ type: 'rejected', reason: 'replayed' });
    replay.socket.close();

    // ...y un grant nuevo ve el consumo que habia antes del reinicio.
    const fresh = await hello(server.port, signGrant(claims, key, { nowSeconds: Math.floor(Date.now() / 1000) }));
    expect(remaining(fresh.collected.messages)).toBe(after);
    fresh.socket.close();

    const { rows } = await sql.query<{ n: string }>('select count(*)::text as n from app.usage_ledger where turn_id = $1', [turnId]);
    expect(rows[0]!.n).toBe('1');
  });
});
