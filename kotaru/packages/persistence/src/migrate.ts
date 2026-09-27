import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SqlClient } from './client.js';

export interface Migration {
  readonly id: string;
  readonly sql: string;
}

/**
 * Migraciones: archivos SQL numerados, aplicados en orden.
 *
 * Sin DSL de ORM a proposito. El esquema es la interfaz entre el codigo y los datos, y
 * debe poder leerlo alguien que sepa SQL y no sepa nada de este repositorio.
 */
/** Carpeta de migraciones del paquete, resuelta desde este archivo (src o dist). */
export const MIGRATIONS_DIR = fileURLToPath(new URL('../migrations', import.meta.url));

export function loadMigrations(directory: string): Migration[] {
  return readdirSync(directory)
    .filter((name) => name.endsWith('.sql'))
    .sort()
    .map((name) => ({ id: name.replace(/\.sql$/, ''), sql: readFileSync(join(directory, name), 'utf8') }));
}

export interface MigrationResult {
  readonly applied: readonly string[];
  readonly skipped: readonly string[];
}

export async function runMigrations(
  client: SqlClient,
  migrations: readonly Migration[],
): Promise<MigrationResult> {
  await client.exec(`
    create table if not exists schema_migrations (
      id         text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const { rows } = await client.query<{ id: string }>('select id from schema_migrations');
  const already = new Set(rows.map((row) => row.id));

  const applied: string[] = [];
  const skipped: string[] = [];

  for (const migration of migrations) {
    if (already.has(migration.id)) {
      skipped.push(migration.id);
      continue;
    }
    // Cada migracion en su propia transaccion: si la tercera falla, las dos primeras
    // quedan aplicadas y registradas, y reintentar continua donde se quedo.
    await client.transaction(async (tx) => {
      await tx.exec(migration.sql);
      await tx.query('insert into schema_migrations (id) values ($1)', [migration.id]);
    });
    applied.push(migration.id);
  }

  return { applied, skipped };
}
