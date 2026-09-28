import { PGlite } from '@electric-sql/pglite';
import { describeMemoryStore } from '@kotaru/memory/testing';
import { loadMigrations, MIGRATIONS_DIR, runMigrations } from '../src/migrate.js';
import { SqlMemoryRepository } from '../src/memory-repository.js';
import { pgliteClient } from './pglite-client.js';

const MIGRATIONS = loadMigrations(MIGRATIONS_DIR);

// La misma especificacion que corre contra el repositorio en memoria, ahora contra
// PostgreSQL. Una base nueva por almacen: las pruebas no se ven entre si.
describeMemoryStore(
  'PostgreSQL (PGlite)',
  async () => {
    const sql = pgliteClient(new PGlite());
    await runMigrations(sql, MIGRATIONS);
    // Nova y Sage los da de alta la migracion 0012.
    return new SqlMemoryRepository(sql);
  },
  { subject: (n) => `00000000-0000-4000-9000-${String(n).padStart(12, '0')}` },
);
