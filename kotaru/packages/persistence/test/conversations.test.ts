import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import type { SqlClient } from '../src/client.js';
import { ConversationOwnershipError, ConversationRepository } from '../src/conversation-repository.js';
import { SUBJECT_TABLES } from '../src/deletion.js';
import { exportSubject } from '../src/export.js';
import { loadMigrations, MIGRATIONS_DIR, runMigrations } from '../src/migrate.js';
import { runRetention } from '../src/retention.js';
import { UsageRepository } from '../src/usage-repository.js';
import { pgliteClient } from './pglite-client.js';

const MIGRATIONS = loadMigrations(MIGRATIONS_DIR);
const T0 = '2026-09-01T12:00:00.000Z';
const at = (minutes: number) => new Date(Date.parse(T0) + minutes * 60_000).toISOString();
const days = (n: number) => new Date(Date.parse(T0) + n * 86_400_000).toISOString();

let sql: SqlClient;
let repo: ConversationRepository;

beforeEach(async () => {
  sql = pgliteClient(new PGlite());
  await runMigrations(sql, MIGRATIONS);
  repo = new ConversationRepository(sql);
});

async function conversationWithTurns(n: number, subjectId = randomUUID()) {
  const conversationId = randomUUID();
  await repo.open({ conversationId, subjectId, companionId: 'rio', atIso: T0 });
  for (let i = 1; i <= n; i += 1) {
    await repo.appendTurn({
      conversationId, subjectId, turnId: `t${i}`, locale: 'es-419',
      userText: `pregunta ${i}`, companionText: `respuesta ${i}`, atIso: at(i), sensitive: false,
    });
  }
  return { conversationId, subjectId };
}

describe('conversaciones', () => {
  it('abrir dos veces la misma conversacion la retoma', async () => {
    const subjectId = randomUUID();
    const conversationId = randomUUID();
    expect(await repo.open({ conversationId, subjectId, companionId: 'rio', atIso: T0 })).toBe('opened');
    expect(await repo.open({ conversationId, subjectId, companionId: 'rio', atIso: T0 })).toBe('resumed');
  });

  it('el id de conversacion de otra persona no sirve para abrirla', async () => {
    const { conversationId } = await conversationWithTurns(1);
    await expect(
      repo.open({ conversationId, subjectId: randomUUID(), companionId: 'rio', atIso: T0 }),
    ).rejects.toBeInstanceOf(ConversationOwnershipError);
  });

  it('ni para leer sus mensajes ni para escribir en ella', async () => {
    const { conversationId } = await conversationWithTurns(2);
    const intruder = randomUUID();
    expect(await repo.recentMessages(conversationId, intruder, 10, at(10))).toEqual([]);
    await expect(
      repo.appendTurn({
        conversationId, subjectId: intruder, turnId: 'x', locale: 'es', userText: 'a', companionText: 'b',
        atIso: at(20), sensitive: false,
      }),
    ).rejects.toBeInstanceOf(ConversationOwnershipError);
  });

  it('devuelve los ultimos mensajes en orden cronologico, usuario antes que companion', async () => {
    const { conversationId, subjectId } = await conversationWithTurns(5);
    const recent = await repo.recentMessages(conversationId, subjectId, 4, at(10));
    expect(recent.map((m) => m.content)).toEqual(['pregunta 4', 'respuesta 4', 'pregunta 5', 'respuesta 5']);
    expect(recent.map((m) => m.role)).toEqual(['user', 'companion', 'user', 'companion']);
  });

  it('guardar el mismo turno dos veces no lo duplica', async () => {
    const { conversationId, subjectId } = await conversationWithTurns(1);
    const again = await repo.appendTurn({
      conversationId, subjectId, turnId: 't1', locale: 'es-419',
      userText: 'pregunta 1', companionText: 'respuesta 1', atIso: at(1), sensitive: false,
    });
    expect(again).toBe(false);
    expect(await repo.recentMessages(conversationId, subjectId, 50, at(10))).toHaveLength(2);
  });
});

describe('retencion', () => {
  it('los mensajes vencen a los 30 dias por defecto y el trabajo nocturno los borra', async () => {
    const { conversationId, subjectId } = await conversationWithTurns(1);
    expect(await repo.recentMessages(conversationId, subjectId, 10, days(29))).toHaveLength(2);
    expect(await repo.recentMessages(conversationId, subjectId, 10, days(31))).toHaveLength(0);

    const report = await runRetention(sql, days(31));
    expect(report.messages).toBe(2);
    const left = await sql.query('select 1 from app.messages');
    expect(left.rows).toHaveLength(0);
  });

  it('un turno sensible vence en 24 horas, aunque el usuario guarde todo un ano', async () => {
    const subjectId = randomUUID();
    await repo.setRetentionDays(subjectId, 365, T0);
    const conversationId = randomUUID();
    await repo.open({ conversationId, subjectId, companionId: 'rio', atIso: T0 });
    await repo.appendTurn({
      conversationId, subjectId, turnId: 'crisis', locale: 'es', userText: 'algo muy dificil',
      companionText: 'estoy aqui', atIso: T0, sensitive: true,
    });
    await repo.appendTurn({
      conversationId, subjectId, turnId: 'normal', locale: 'es', userText: 'hola', companionText: 'hola',
      atIso: at(5), sensitive: false,
    });
    expect((await runRetention(sql, days(2))).messages).toBe(2);
    expect(await repo.recentMessages(conversationId, subjectId, 10, days(2))).toHaveLength(2);
  });

  it('acortar la retencion se aplica tambien a lo ya guardado', async () => {
    const { conversationId, subjectId } = await conversationWithTurns(1);
    await repo.setRetentionDays(subjectId, 7, at(30));
    expect(await repo.retentionDaysFor(subjectId)).toBe(7);
    expect((await runRetention(sql, days(8))).messages).toBe(2);
    expect(await repo.recentMessages(conversationId, subjectId, 10, days(8))).toHaveLength(0);
  });

  it('volver al valor por defecto con null', async () => {
    const subjectId = randomUUID();
    await repo.setRetentionDays(subjectId, 90, T0);
    await repo.setRetentionDays(subjectId, null, T0);
    expect(await repo.retentionDaysFor(subjectId)).toBe(30);
  });

  it('rechaza una retencion fuera de rango', async () => {
    await expect(repo.setRetentionDays(randomUUID(), 0, T0)).rejects.toBeInstanceOf(RangeError);
    await expect(repo.setRetentionDays(randomUUID(), 1.5, T0)).rejects.toBeInstanceOf(RangeError);
  });

  it('el informe cuenta tambien recuerdos vencidos y grants caducados', async () => {
    await sql.query(
      `insert into app.memories (id, subject_id, companion_id, kind, text, confidence, source_turn_id, expires_at)
       values (gen_random_uuid(), gen_random_uuid(), 'rio', 'plan', 'viaje', 0.5, 't', $1)`,
      [at(1)],
    );
    await sql.query('insert into app.used_grants (jti, expires_at) values ($1, $2)', ['viejo', at(1)]);
    const report = await runRetention(sql, at(60));
    expect(report).toMatchObject({ memories: 1, usedGrants: 1, ranAt: at(60) });
  });
});

describe('exportacion', () => {
  it('incluye conversaciones con sus mensajes, ajustes y consumo, y nada de otro usuario', async () => {
    const { subjectId } = await conversationWithTurns(2);
    await conversationWithTurns(1); // otra persona
    await repo.setRetentionDays(subjectId, 60, T0);
    await new UsageRepository(sql).record({ turnId: 'u1', subjectId, voiceSeconds: 12.5, costUsd: 0.002 });

    const exported = await exportSubject(sql, subjectId, days(1));
    expect(exported.format).toBe('kotaru-export@1');
    expect(exported.settings).toEqual({ messageRetentionDays: 60 });
    expect(exported.conversations).toHaveLength(1);
    expect(exported.conversations[0]!.messages.map((m) => m.content)).toEqual([
      'pregunta 1', 'respuesta 1', 'pregunta 2', 'respuesta 2',
    ]);
    expect(exported.usage).toEqual([{ turnId: 'u1', voiceSeconds: 12.5, recordedAt: expect.any(String) }]);
    // El costo es un dato del negocio, no de la persona.
    expect(JSON.stringify(exported)).not.toContain('cost');
  });
});

describe('cobertura del borrado de cuenta', () => {
  it('toda tabla de app con subject_id esta en la lista de borrado', async () => {
    const { rows } = await sql.query<{ table_name: string }>(
      `select table_name from information_schema.columns
       where table_schema = 'app' and column_name = 'subject_id' order by table_name`,
    );
    const inSchema = rows.map((r) => `app.${r.table_name}`).sort();
    expect([...SUBJECT_TABLES].sort()).toEqual(inSchema);
  });
});
