import type { SqlClient } from './client.js';
import { purgeSubject } from './deletion.js';

/** Cuanto tiempo se siguen barriendo los seudonimos borrados. Mas que cualquier token. */
const ERASED_SWEEP_DAYS = 30;

export interface RetentionReport {
  readonly messages: number;
  readonly memories: number;
  readonly usedGrants: number;
  /** Tokens de renovacion caducados (o de familias terminadas). */
  readonly refreshTokens: number;
  /** Retos de passkey caducados. */
  readonly webauthnChallenges: number;
  /** Filas escritas por sesiones que seguian abiertas cuando se borro la cuenta. */
  readonly lateWritesOfErased: number;
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

  const erased = await sql.query<{ id: string }>(
    `select erased_subject_id::text as id from app.erased_subjects
     where erased_at > $1::timestamptz - make_interval(days => $2)`,
    [nowIso, ERASED_SWEEP_DAYS],
  );
  let lateWritesOfErased = 0;
  for (const { id } of erased.rows) lateWritesOfErased += await purgeSubject(sql, id);
  await sql.query(
    'delete from app.erased_subjects where erased_at <= $1::timestamptz - make_interval(days => $2)',
    [nowIso, ERASED_SWEEP_DAYS],
  );

  return {
    messages: await count('delete from app.messages where expires_at is not null and expires_at <= $1'),
    memories: await count('delete from app.memories where expires_at is not null and expires_at <= $1'),
    usedGrants: await count('delete from app.used_grants where expires_at < $1'),
    refreshTokens: await count('delete from identity.refresh_tokens where expires_at < $1 or family_expires_at < $1'),
    webauthnChallenges: await count('delete from identity.webauthn_challenges where expires_at < $1'),
    lateWritesOfErased,
    ranAt: nowIso,
  };
}
