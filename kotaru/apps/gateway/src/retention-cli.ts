import { runRetention } from '@kotaru/persistence';
import { pgClient } from './pg-client.js';

/**
 * Trabajo de retencion: borra mensajes, recuerdos y grants vencidos.
 *
 *   DATABASE_URL=... npm run db:retention
 *
 * Imprime una linea JSON con lo que borro, para que el registro del sistema (journald)
 * la guarde. Sin contenido: solo cuentas y la hora.
 */
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL.');
  process.exit(2);
}

const sql = pgClient({ connectionString: url });
try {
  const report = await runRetention(sql, new Date().toISOString());
  console.log(JSON.stringify({ event: 'retention', ...report }));
} catch (error) {
  console.error(JSON.stringify({ event: 'retention_failed', error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
} finally {
  await sql.close();
}
