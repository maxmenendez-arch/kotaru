import type { SqlClient } from './client.js';

export interface RetentionReport {
  readonly messages: number;
  readonly memories: number;
  readonly usedGrants: number;
  readonly ranAt: string;
}

/**
 * El trabajo nocturno de retencion. Borra lo vencido de las tres fuentes que vencen y
 * devuelve cuanto borro de cada una.
 *
 * El informe no es decorativo: una purga que deja de correr en silencio se ve igual que
 * una purga que no encontro nada. Quien la programe debe registrar el informe y alertar
 * si deja de llegar.
 */
export async function runRetention(sql: SqlClient, nowIso: string): Promise<RetentionReport> {
  const count = async (statement: string) =>
    (await sql.query(`${statement} returning 1 as ok`, [nowIso])).rows.length;

  return {
    messages: await count('delete from app.messages where expires_at is not null and expires_at <= $1'),
    memories: await count('delete from app.memories where expires_at is not null and expires_at <= $1'),
    usedGrants: await count('delete from app.used_grants where expires_at < $1'),
    ranAt: nowIso,
  };
}
