import { randomUUID } from 'node:crypto';
import type { SqlClient } from './client.js';

export class PasskeyAlreadyRegistered extends Error {
  constructor() {
    super('passkey_already_registered');
  }
}

export interface StoredPasskey {
  readonly credentialId: string;
  readonly accountId: string;
  readonly subjectId: string;
  /** El user handle de la cuenta (base64url): lo que el autenticador devuelve al entrar. */
  readonly userHandle: string;
  readonly publicKey: Uint8Array;
  readonly signCount: number;
  readonly transports: readonly string[];
}

/**
 * Passkeys (WebAuthn) y sus retos de un solo uso, en el esquema `identity`. Solo se
 * guardan claves publicas.
 */
export class PasskeyRepository {
  readonly #sql: SqlClient;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  async createChallenge(input: {
    readonly kind: 'register' | 'login';
    readonly challenge: string;
    readonly userHandle: string | null;
    readonly expiresAtIso: string;
  }): Promise<string> {
    const id = randomUUID();
    // Barre de paso unos cuantos retos caducados: la tabla no crece entre las pasadas de
    // la retencion aunque alguien pida opciones sin parar.
    await this.#sql.query(
      `delete from identity.webauthn_challenges
       where id in (select id from identity.webauthn_challenges where expires_at < now() limit 50)`,
    );
    await this.#sql.query(
      `insert into identity.webauthn_challenges (id, kind, challenge, user_handle, expires_at)
       values ($1, $2, $3, $4, $5)`,
      [id, input.kind, input.challenge, input.userHandle, input.expiresAtIso],
    );
    return id;
  }

  /**
   * Gasta el reto: una sola vez, sin caducar y del tipo esperado. Queda gastado aunque la
   * verificacion que venga despues falle, asi un reto nunca sirve para dos intentos.
   */
  async consumeChallenge(
    id: string,
    kind: 'register' | 'login',
    nowIso: string,
  ): Promise<{ readonly challenge: string; readonly userHandle: string | null } | null> {
    const result = await this.#sql.query<{ challenge: string; user_handle: string | null }>(
      `update identity.webauthn_challenges set used_at = $3
       where id = $1 and kind = $2 and used_at is null and expires_at > $3
       returning challenge, user_handle`,
      [id, kind, nowIso],
    );
    const row = result.rows[0];
    return row ? { challenge: row.challenge, userHandle: row.user_handle } : null;
  }

  /**
   * Crea la cuenta y su primera passkey en una sola transaccion: nunca queda una cuenta sin
   * forma de entrar. Una passkey ya registrada (mismo credential id) lanza
   * `PasskeyAlreadyRegistered`.
   */
  async createAccountWithPasskey(input: {
    readonly userHandle: string;
    readonly credentialId: string;
    readonly publicKey: Uint8Array;
    readonly signCount: number;
    readonly transports: readonly string[];
    readonly backedUp: boolean;
  }): Promise<{ readonly accountId: string; readonly subjectId: string }> {
    const accountId = randomUUID();
    const subjectId = randomUUID();
    try {
      await this.#sql.transaction(async (tx) => {
        await tx.query(
          `insert into identity.accounts (id, auth_provider, auth_subject) values ($1, 'passkey', $2)`,
          [accountId, input.userHandle],
        );
        await tx.query('insert into identity.subject_links (account_id, subject_id) values ($1, $2)', [accountId, subjectId]);
        await tx.query(
          `insert into identity.passkeys (credential_id, account_id, public_key, sign_count, transports, backed_up)
           values ($1, $2, $3, $4, $5, $6)`,
          [input.credentialId, accountId, input.publicKey, input.signCount, input.transports, input.backedUp],
        );
      });
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new PasskeyAlreadyRegistered();
      throw error;
    }
    return { accountId, subjectId };
  }

  async findPasskey(credentialId: string): Promise<StoredPasskey | null> {
    const result = await this.#sql.query<{
      credential_id: string;
      account_id: string;
      subject_id: string;
      user_handle: string;
      public_key: Uint8Array;
      sign_count: string | number;
      transports: string[];
    }>(
      `select p.credential_id, p.account_id::text as account_id, l.subject_id::text as subject_id,
              a.auth_subject as user_handle, p.public_key, p.sign_count, p.transports
       from identity.passkeys p
       join identity.accounts a on a.id = p.account_id
       join identity.subject_links l on l.account_id = a.id
       where p.credential_id = $1 and a.deleted_at is null and a.auth_provider = 'passkey'`,
      [credentialId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      credentialId: row.credential_id,
      accountId: row.account_id,
      subjectId: row.subject_id,
      userHandle: row.user_handle,
      publicKey: new Uint8Array(row.public_key),
      signCount: Number(row.sign_count),
      transports: row.transports ?? [],
    };
  }

  /**
   * Registra un uso. Solo avanza el contador (nunca lo baja): dos entradas a la vez con la
   * misma passkey no pueden dejarlo por detras.
   */
  async markUsed(credentialId: string, signCount: number, nowIso: string): Promise<void> {
    await this.#sql.query(
      `update identity.passkeys set sign_count = greatest(sign_count, $2), last_used_at = $3
       where credential_id = $1`,
      [credentialId, signCount, nowIso],
    );
  }
}
