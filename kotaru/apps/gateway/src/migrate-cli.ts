import { loadMigrations, MIGRATIONS_DIR, runMigrations } from '@kotaru/persistence';
import { pgClient } from './pg-client.js';

/**
 * Aplica las migraciones pendientes a la base de DATABASE_URL.
 *
 *   DATABASE_URL=postgres://usuario:clave@127.0.0.1:5432/kotaru npm run db:migrate
 *
 * Idempotente: correrlo dos veces no aplica nada la segunda. La URL nunca se imprime,
 * porque lleva la contrasena.
 */
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL. Ejemplo: postgres://kotaru:CLAVE@127.0.0.1:5432/kotaru');
  process.exit(2);
}

const sql = pgClient({ connectionString: url });
try {
  const result = await runMigrations(sql, loadMigrations(MIGRATIONS_DIR));
  console.log(`Aplicadas: ${result.applied.length ? result.applied.join(', ') : 'ninguna'}`);
  console.log(`Ya estaban: ${result.skipped.length}`);
} catch (error) {
  console.error(`Fallo la migracion: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await sql.close();
}
