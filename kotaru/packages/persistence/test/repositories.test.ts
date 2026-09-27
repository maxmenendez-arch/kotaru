import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { loadMigrations, runMigrations } from '../src/migrate.js';
import { GrantRepository, UsageRepository } from '../src/usage-repository.js';
import { countRemainingFor, deleteAccount } from '../src/deletion.js';
import { pgliteClient } from './pglite-client.js';
import type { SqlClient } from '../src/client.js';

const MIGRATIONS = loadMigrations(fileURLToPath(new URL('../migrations', import.meta.url)));

let sql: SqlClient;

beforeEach(async () => {
  sql = pgliteClient(new PGlite());
  await runMigrations(sql, MIGRATIONS);
});

async function seedAccount(): Promise<{ accountId: string; subjectId: string; companionId: string }> {
  const accountId = randomUUID();
  const subjectId = randomUUID();
  const companionId = randomUUID();

  // Hash distinto por cuenta: el indice unico sobre email_hash impide que dos cuentas
  // compartan correo, que es justo lo que debe hacer.
  const emailHex = Buffer.from(`${accountId}@example.test`).toString('hex');
  await sql.query(
    `insert into identity.accounts (id, auth_provider, auth_subject, email_hash, email_encrypted)
     values ($1,'apple',$2, decode($3,'hex'), decode($3,'hex'))`,
    [accountId, `sub_${accountId}`, emailHex],
  );
  await sql.query('insert into identity.subject_links (account_id, subject_id) values ($1,$2)', [accountId, subjectId]);

  // companions es un catalogo compartido, no una tabla por usuario: se reutiliza.
  await sql.query(
    `insert into app.companions (id, slug, display_name, persona_version)
     values ($1,'rio','Rio','0.1.0') on conflict (slug) do nothing`,
    [companionId],
  );
  // Desde 0006 el companion se referencia por su slug.
  return { accountId, subjectId, companionId: 'rio' };
}

describe('libro de consumo', () => {
  it('registra y acumula por usuario', async () => {
    const { subjectId } = await seedAccount();
    const repo = new UsageRepository(sql);

    expect(await repo.record({ turnId: 't1', subjectId, voiceSeconds: 30, costUsd: 0.004 })).toBe(true);
    expect(await repo.record({ turnId: 't2', subjectId, voiceSeconds: 45, costUsd: 0.006 })).toBe(true);

    const usage = await repo.forSubject(subjectId);
    expect(usage.turns).toBe(2);
    expect(usage.voiceSeconds).toBeCloseTo(75, 3);
    expect(usage.costUsd).toBeCloseTo(0.01, 6);
  });

  it('un turno repetido no se cobra dos veces, y lo garantiza la base', async () => {
    const { subjectId } = await seedAccount();
    const repo = new UsageRepository(sql);

    expect(await repo.record({ turnId: 't1', subjectId, voiceSeconds: 30, costUsd: 0.004 })).toBe(true);
    expect(await repo.record({ turnId: 't1', subjectId, voiceSeconds: 30, costUsd: 0.004 })).toBe(false);

    expect((await repo.forSubject(subjectId)).turns).toBe(1);
    expect(await repo.totalCostUsd()).toBeCloseTo(0.004, 6);
  });

  it('dos escrituras simultaneas del mismo turno: solo una gana', async () => {
    const { subjectId } = await seedAccount();
    const repo = new UsageRepository(sql);
    const entry = { turnId: 'carrera', subjectId, voiceSeconds: 10, costUsd: 0.001 };

    const results = await Promise.all([repo.record(entry), repo.record(entry), repo.record(entry)]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect((await repo.forSubject(subjectId)).turns).toBe(1);
  });

  it('un usuario sin consumo devuelve ceros, no nulos', async () => {
    const repo = new UsageRepository(sql);
    expect(await repo.forSubject(randomUUID())).toEqual({ voiceSeconds: 0, costUsd: 0, turns: 0 });
  });
});

describe('grants usados', () => {
  it('un jti no se puede reclamar dos veces', async () => {
    const repo = new GrantRepository(sql);
    const expires = new Date(Date.now() + 120_000);
    expect(await repo.claim('jti-1', expires)).toBe(true);
    expect(await repo.claim('jti-1', expires)).toBe(false);
  });

  it('descarta los caducados', async () => {
    const repo = new GrantRepository(sql);
    await repo.claim('viejo', new Date(Date.now() - 60_000));
    await repo.claim('vivo', new Date(Date.now() + 60_000));
    expect(await repo.prune(new Date())).toBe(1);
    expect(await repo.claim('viejo', new Date(Date.now() + 60_000))).toBe(true);
  });
});

describe('borrado de cuenta', () => {
  it('borra todo el contenido del seudonimo y luego la identidad', async () => {
    const { accountId, subjectId, companionId } = await seedAccount();

    const conversationId = randomUUID();
    await sql.query('insert into app.conversations (id, subject_id, companion_id) values ($1,$2,$3)', [conversationId, subjectId, companionId]);
    await sql.query("insert into app.messages (id, conversation_id, role, content) values ($1,$2,'user','hola')", [randomUUID(), conversationId]);
    await sql.query(
      `insert into app.memories (id, subject_id, companion_id, kind, text, confidence, source_turn_id)
       values ($1,$2,$3,'preference','me gusta el mar',0.6,'t1')`,
      [randomUUID(), subjectId, companionId],
    );
    await new UsageRepository(sql).record({ turnId: 't1', subjectId, voiceSeconds: 10, costUsd: 0.001 });
    await sql.query(
      "insert into app.safety_events (id, subject_id, conversation_id, policy_version, outcome) values ($1,$2,$3,'safety-policy@0.2.0','allow')",
      [randomUUID(), subjectId, conversationId],
    );

    expect(await countRemainingFor(sql, subjectId)).toBeGreaterThan(0);

    const outcome = await deleteAccount(sql, accountId);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.subjectId).toBe(subjectId);

    // Lo que importa: no queda NADA, ni el contenido ni la identidad.
    expect(await countRemainingFor(sql, subjectId)).toBe(0);
    const account = await sql.query("select id from identity.accounts where id = $1", [accountId]);
    expect(account.rows).toHaveLength(0);
    const link = await sql.query("select subject_id from identity.subject_links where account_id = $1", [accountId]);
    expect(link.rows).toHaveLength(0);
  });

  it('no toca a otro usuario', async () => {
    const a = await seedAccount();
    const b = await seedAccount();
    const repo = new UsageRepository(sql);
    await repo.record({ turnId: 'ta', subjectId: a.subjectId, voiceSeconds: 10, costUsd: 0.001 });
    await repo.record({ turnId: 'tb', subjectId: b.subjectId, voiceSeconds: 10, costUsd: 0.001 });

    await deleteAccount(sql, a.accountId);

    expect(await countRemainingFor(sql, a.subjectId)).toBe(0);
    expect(await countRemainingFor(sql, b.subjectId)).toBe(1);
  });

  it('una cuenta inexistente falla con motivo, no en silencio', async () => {
    expect(await deleteAccount(sql, randomUUID())).toEqual({ ok: false, reason: 'account_not_found' });
  });
});

describe('restricciones del esquema', () => {
  it('la base impide un recuerdo duplicado del mismo companion', async () => {
    const { subjectId, companionId } = await seedAccount();
    const insert = (id: string) =>
      sql.query(
        `insert into app.memories (id, subject_id, companion_id, kind, text, confidence, source_turn_id)
         values ($1,$2,$3,'preference','Me Gusta El Mar',0.6,'t1')`,
        [id, subjectId, companionId],
      );
    await insert(randomUUID());
    await expect(insert(randomUUID())).rejects.toThrow();
  });

  it('un recuerdo nace propuesto, nunca aprobado', async () => {
    const { subjectId, companionId } = await seedAccount();
    const id = randomUUID();
    await sql.query(
      `insert into app.memories (id, subject_id, companion_id, kind, text, confidence, source_turn_id)
       values ($1,$2,$3,'fact','vivo en Miami',0.6,'t1')`,
      [id, subjectId, companionId],
    );
    const { rows } = await sql.query<{ status: string }>('select status from app.memories where id = $1', [id]);
    expect(rows[0]!.status).toBe('proposed');
  });

  it('rechaza una confianza fuera de rango', async () => {
    const { subjectId, companionId } = await seedAccount();
    await expect(
      sql.query(
        `insert into app.memories (id, subject_id, companion_id, kind, text, confidence, source_turn_id)
         values ($1,$2,$3,'fact','x',9,'t1')`,
        [randomUUID(), subjectId, companionId],
      ),
    ).rejects.toThrow();
  });
});

describe('identidad', () => {
  it('dos cuentas no pueden compartir correo', async () => {
    const hex = Buffer.from('mismo@example.test').toString('hex');
    const insert = (id: string) =>
      sql.query(
        `insert into identity.accounts (id, auth_provider, auth_subject, email_hash, email_encrypted)
         values ($1,'apple',$2, decode($3,'hex'), decode($3,'hex'))`,
        [id, `sub_${id}`, hex],
      );
    await insert(randomUUID());
    await expect(insert(randomUUID())).rejects.toThrow();
  });
});
