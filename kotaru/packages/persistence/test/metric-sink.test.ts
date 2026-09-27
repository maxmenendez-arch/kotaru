import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import type { TurnMetric } from '@kotaru/telemetry';
import { loadMigrations, MIGRATIONS_DIR, runMigrations } from '../src/migrate.js';
import { SqlMetricSink } from '../src/metric-sink.js';
import { pgliteClient } from './pglite-client.js';

const metric = (conversationId: string, turnId: string): TurnMetric => ({
  conversationId, turnId, routeId: 'mock-stt+mock-llm+mock-tts',
  sttProvider: 'mock-stt', llmProvider: 'mock-llm', ttsProvider: 'mock-tts',
  llmTtftMs: 120.4, turnTotalMs: 900.6,
  sttCostUsd: 0.0001, llmCostUsd: 0.0002, ttsCostUsd: 0.0003, infraCostUsd: 0.0001, totalCostUsd: 0.0007,
  costBasis: 'assumption', fallbackUsed: false, interrupted: false, createdAt: new Date().toISOString(),
});

describe('metricas de turno en la base', () => {
  it('escribe latencia y costo, una vez por turno', async () => {
    const sql = pgliteClient(new PGlite());
    await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
    const conversationId = randomUUID();
    await sql.query("insert into app.conversations (id, subject_id, companion_id) values ($1, gen_random_uuid(), 'rio')", [conversationId]);

    const sink = new SqlMetricSink(sql);
    sink.emitTurn(metric(conversationId, 't1'));
    sink.emitTurn(metric(conversationId, 't1'));
    await sink.flush();

    const { rows } = await sql.query<{ n: string; cost: string; ttft: number }>(
      'select count(*)::text as n, sum(total_cost_usd)::text as cost, max(llm_ttft_ms) as ttft from app.turn_metrics',
    );
    expect(rows[0]).toMatchObject({ n: '1', cost: '0.000700', ttft: 120 });
    expect(sink.failures).toBe(0);
  });

  it('si la escritura falla, lo cuenta en vez de romper la conversacion', async () => {
    const sql = pgliteClient(new PGlite());
    await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
    const sink = new SqlMetricSink(sql);
    sink.emitTurn(metric(randomUUID(), 't1')); // conversacion inexistente: viola la clave foranea
    await sink.flush();
    expect(sink.failures).toBe(1);
  });

  it('una metrica con contenido se rechaza antes de llegar a la base', () => {
    const sink = new SqlMetricSink({ query: async () => ({ rows: [] }), exec: async () => {}, transaction: async (fn) => fn(null as never) });
    expect(() => sink.emitTurn({ ...metric(randomUUID(), 't'), transcript: 'hola que tal' } as unknown as TurnMetric)).toThrow(/Fuga de contenido/);
  });
});
