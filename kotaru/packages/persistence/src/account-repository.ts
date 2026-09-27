import { randomUUID } from 'node:crypto';
import type { SqlClient } from './client.js';

export interface AccountRef {
  readonly accountId: string;
  readonly subjectId: string;
}

const UNIQUE_VIOLATION = '23505';

/**
 * Cuentas (esquema `identity`). Aqui vive el unico puente entre una persona y su
 * seudonimo; el resto del sistema solo conoce el seudonimo.
 */
export class AccountRepository {
  readonly #sql: SqlClient;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  /**
   * Busca la cuenta de ese login o la crea con un seudonimo nuevo.
   *
   * Si el correo ya pertenece a otra cuenta (el mismo correo entrando por Apple y por
   * Google), NO se fusionan: se crea la cuenta sin correo. Unir cuentas por correo es una
   * decision de seguridad (quien controla ese correo en cada proveedor) que merece su
   * propio flujo con confirmacion, no un efecto secundario del login.
   */
  async findOrCreate(input: {
    readonly provider: 'apple' | 'google';
    readonly providerSubject: string;
    readonly emailHash: Uint8Array | null;
    readonly emailEncrypted: Uint8Array | null;
  }): Promise<AccountRef & { readonly created: boolean }> {
    return this.#sql.transaction(async (tx) => {
      const found = await tx.query<{ account_id: string; subject_id: string }>(
        `select a.id::text as account_id, l.subject_id::text as subject_id
         from identity.accounts a join identity.subject_links l on l.account_id = a.id
         where a.auth_provider = $1 and a.auth_subject = $2 and a.deleted_at is null`,
        [input.provider, input.providerSubject],
      );
      if (found.rows[0]) {
        return { accountId: found.rows[0].account_id, subjectId: found.rows[0].subject_id, created: false };
      }

      const accountId = randomUUID();
      const subjectId = randomUUID();
      // Punto de guardado manual (no una transaccion anidada): si el INSERT choca, la
      // transaccion sigue usable para decidir que hacer.
      const tryInsert = async (hash: Uint8Array | null, encrypted: Uint8Array | null): Promise<boolean> => {
        await tx.query('savepoint account_insert');
        try {
          await tx.query(
            `insert into identity.accounts (id, auth_provider, auth_subject, email_hash, email_encrypted)
             values ($1, $2, $3, $4, $5)`,
            [accountId, input.provider, input.providerSubject, hash, encrypted],
          );
          await tx.query('release savepoint account_insert');
          return true;
        } catch (error) {
          await tx.query('rollback to savepoint account_insert');
          if ((error as { code?: string }).code !== UNIQUE_VIOLATION) throw error;
          return false;
        }
      };

      if (!(await tryInsert(input.emailHash, input.emailEncrypted))) {
        // O el mismo login entro dos veces a la vez (gana el otro), o el correo es de
        // otra cuenta (se crea sin correo).
        const raced = await tx.query<{ account_id: string; subject_id: string }>(
          `select a.id::text as account_id, l.subject_id::text as subject_id
           from identity.accounts a join identity.subject_links l on l.account_id = a.id
           where a.auth_provider = $1 and a.auth_subject = $2 and a.deleted_at is null`,
          [input.provider, input.providerSubject],
        );
        if (raced.rows[0]) return { accountId: raced.rows[0].account_id, subjectId: raced.rows[0].subject_id, created: false };
        if (!(await tryInsert(null, null))) throw new Error('no se pudo crear la cuenta');
      }
      await tx.query('insert into identity.subject_links (account_id, subject_id) values ($1, $2)', [accountId, subjectId]);
      return { accountId, subjectId, created: true };
    });
  }

  async accountForSubject(subjectId: string): Promise<string | null> {
    const { rows } = await this.#sql.query<{ account_id: string }>(
      'select account_id::text from identity.subject_links where subject_id = $1',
      [subjectId],
    );
    return rows[0]?.account_id ?? null;
  }

  /** Primer token de una familia nueva (un inicio de sesion). */
  async storeRefresh(accountId: string, tokenHash: Uint8Array, expiresAtIso: string, familyExpiresAtIso: string): Promise<void> {
    await this.#sql.query(
      `insert into identity.refresh_tokens (token_hash, account_id, family_id, expires_at, family_expires_at)
       values ($1, $2, $3, least($4::timestamptz, $5::timestamptz), $5)`,
      [tokenHash, accountId, randomUUID(), expiresAtIso, familyExpiresAtIso],
    );
  }

  /**
   * Cambia un token de renovacion por otro, en una transaccion con la fila bloqueada: dos
   * usos simultaneos del mismo token no dan dos sesiones.
   *
   * Si el token ya se habia usado, alguien tiene una copia (el ladron o el dueno, da igual
   * cual): se revoca la familia entera y ambos tienen que volver a iniciar sesion.
   */
  async rotateRefresh(oldHash: Uint8Array, newHash: Uint8Array, newExpiresAtIso: string, nowIso: string): Promise<AccountRef | null> {
    return this.#sql.transaction(async (tx) => {
      const found = await tx.query<{ account_id: string; family_id: string; used: boolean; alive: boolean; family_expires_at: string }>(
        `select account_id::text, family_id::text, used_at is not null as used,
                (expires_at > $2 and family_expires_at > $2) as alive,
                to_char(family_expires_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as family_expires_at
         from identity.refresh_tokens where token_hash = $1 for update`,
        [oldHash, nowIso],
      );
      const row = found.rows[0];
      if (!row) return null;
      if (row.used) {
        await tx.query('delete from identity.refresh_tokens where family_id = $1', [row.family_id]);
        return null;
      }
      if (!row.alive) return null;

      const link = await tx.query<{ subject_id: string }>(
        `select l.subject_id::text from identity.subject_links l join identity.accounts a on a.id = l.account_id
         where l.account_id = $1 and a.deleted_at is null`,
        [row.account_id],
      );
      const subjectId = link.rows[0]?.subject_id;
      if (!subjectId) return null;

      await tx.query('update identity.refresh_tokens set used_at = $2 where token_hash = $1', [oldHash, nowIso]);
      await tx.query(
        `insert into identity.refresh_tokens (token_hash, account_id, family_id, expires_at, family_expires_at)
         values ($1, $2, $3, least($4::timestamptz, $5::timestamptz), $5)`,
        [newHash, row.account_id, row.family_id, newExpiresAtIso, row.family_expires_at],
      );
      return { accountId: row.account_id, subjectId };
    });
  }

  /** Cierra la sesion de ese token (toda su familia). Devuelve si existia. */
  async revokeFamilyOf(tokenHash: Uint8Array): Promise<boolean> {
    const { rows } = await this.#sql.query(
      `delete from identity.refresh_tokens
       where family_id = (select family_id from identity.refresh_tokens where token_hash = $1)
       returning 1 as ok`,
      [tokenHash],
    );
    return rows.length > 0;
  }

  async revokeAll(accountId: string): Promise<number> {
    const { rows } = await this.#sql.query('delete from identity.refresh_tokens where account_id = $1 returning 1 as ok', [accountId]);
    return rows.length;
  }

  /** Plan vigente del seudonimo; sin fila de periodo actual, el gratuito. */
  async currentPlan(subjectId: string, nowIso: string): Promise<string> {
    const { rows } = await this.#sql.query<{ plan_id: string }>(
      `select plan_id from app.entitlements
       where subject_id = $1 and period_start <= $2 and period_end > $2
       order by period_start desc limit 1`,
      [subjectId, nowIso],
    );
    return rows[0]?.plan_id ?? 'free';
  }

  /** La conversacion existe y es de este seudonimo. */
  async ownsConversation(subjectId: string, conversationId: string): Promise<boolean> {
    const { rows } = await this.#sql.query('select 1 as ok from app.conversations where id = $1 and subject_id = $2', [
      conversationId,
      subjectId,
    ]);
    return rows.length > 0;
  }
}
