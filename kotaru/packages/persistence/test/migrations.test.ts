import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { loadMigrations, runMigrations } from '../src/migrate.js';
import { pgliteClient } from './pglite-client.js';

const MIGRATIONS = loadMigrations(fileURLToPath(new URL('../migrations', import.meta.url)));

async function migrated() {
  const db = new PGlite();
  const client = pgliteClient(db);
  const result = await runMigrations(client, MIGRATIONS);
  return { db, client, result };
}

describe('migraciones', () => {
  it('aplican todas contra un Postgres real', async () => {
    const { result } = await migrated();
    expect(result.applied).toEqual([
      '0001_identity', '0002_app_conversation', '0003_app_memory',
      '0004_app_usage', '0005_app_safety', '0006_companion_slugs', '0007_conversation_retention',
    ]);
    expect(result.skipped).toEqual([]);
  });

  it('son idempotentes: la segunda vez no aplica nada', async () => {
    const { client, result } = await migrated();
    expect(result.applied).toHaveLength(MIGRATIONS.length);
    const again = await runMigrations(client, MIGRATIONS);
    expect(again.applied).toEqual([]);
    expect(again.skipped).toHaveLength(MIGRATIONS.length);
  });

  it('crean los dos esquemas separados', async () => {
    const { client } = await migrated();
    const { rows } = await client.query<{ schema_name: string }>(
      "select schema_name from information_schema.schemata where schema_name in ('identity','app') order by 1",
    );
    expect(rows.map((r) => r.schema_name)).toEqual(['app', 'identity']);
  });

  it('NINGUNA clave foranea cruza de app a identity', async () => {
    const { client } = await migrated();
    const { rows } = await client.query<{ n: string }>(`
      select count(*)::text as n
      from information_schema.table_constraints tc
      join information_schema.constraint_column_usage ccu
        on tc.constraint_name = ccu.constraint_name
      where tc.constraint_type = 'FOREIGN KEY'
        and tc.table_schema = 'app'
        and ccu.table_schema = 'identity'
    `);
    // Es la prueba que defiende la separacion entre identidad y contenido.
    expect(rows[0]!.n).toBe('0');
  });

  it('las metricas de turno no tienen ninguna columna de contenido', async () => {
    const { client } = await migrated();
    const { rows } = await client.query<{ column_name: string; data_type: string }>(
      "select column_name, data_type from information_schema.columns where table_schema='app' and table_name='turn_metrics'",
    );
    const textColumns = rows.filter((r) => r.data_type === 'text').map((r) => r.column_name);
    // Solo identificadores y enums. Si alguien anade `transcript`, esta prueba lo caza.
    expect(textColumns.sort()).toEqual([
      'cost_basis', 'llm_provider', 'route_id', 'stt_provider', 'tts_provider', 'turn_id',
    ]);
  });
});
