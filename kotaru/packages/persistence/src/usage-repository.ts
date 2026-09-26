import type { SqlClient } from './client.js';

export interface UsageEntry {
  readonly turnId: string;
  readonly subjectId: string;
  readonly voiceSeconds: number;
  readonly costUsd: number;
}

export interface SubjectUsage {
  readonly voiceSeconds: number;
  readonly costUsd: number;
  readonly turns: number;
}

/**
 * Libro de consumo.
 *
 * La idempotencia no la impone la aplicacion sino la clave primaria: `on conflict do
 * nothing` sobre `turn_id`. Dos procesos concurrentes registrando el mismo turno no
 * pueden cobrarlo dos veces, que es exactamente lo que una comprobacion en memoria no
 * puede garantizar.
 */
export class UsageRepository {
  readonly #sql: SqlClient;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  /** Devuelve true si se conto; false si el turno ya estaba registrado. */
  async record(entry: UsageEntry): Promise<boolean> {
    const { rows } = await this.#sql.query<{ turn_id: string }>(
      `insert into app.usage_ledger (turn_id, subject_id, voice_seconds, cost_usd)
       values ($1, $2, $3, $4)
       on conflict (turn_id) do nothing
       returning turn_id`,
      [entry.turnId, entry.subjectId, entry.voiceSeconds, entry.costUsd],
    );
    return rows.length > 0;
  }

  async forSubject(subjectId: string): Promise<SubjectUsage> {
    const { rows } = await this.#sql.query<{ seconds: string; cost: string; turns: string }>(
      `select coalesce(sum(voice_seconds), 0)::text as seconds,
              coalesce(sum(cost_usd), 0)::text      as cost,
              count(*)::text                        as turns
       from app.usage_ledger where subject_id = $1`,
      [subjectId],
    );
    const row = rows[0]!;
    return {
      voiceSeconds: Number(row.seconds),
      costUsd: Number(row.cost),
      turns: Number(row.turns),
    };
  }

  /** Gasto del periodo, en todos los usuarios. Alimenta la escalera de corte. */
  async totalCostUsd(since?: Date): Promise<number> {
    const { rows } = await this.#sql.query<{ total: string }>(
      since
        ? `select coalesce(sum(cost_usd), 0)::text as total from app.usage_ledger where recorded_at >= $1`
        : `select coalesce(sum(cost_usd), 0)::text as total from app.usage_ledger`,
      since ? [since.toISOString()] : [],
    );
    return Number(rows[0]!.total);
  }
}

/**
 * ReplayGuard duradero. Redis es el camino rapido en produccion; este sobrevive a un
 * reinicio y es la fuente de verdad. La operacion de reclamar es un solo INSERT, que
 * es atomico incluso con varias instancias de gateway.
 */
export class GrantRepository {
  readonly #sql: SqlClient;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  async claim(jti: string, expiresAt: Date): Promise<boolean> {
    const { rows } = await this.#sql.query<{ jti: string }>(
      `insert into app.used_grants (jti, expires_at) values ($1, $2)
       on conflict (jti) do nothing returning jti`,
      [jti, expiresAt.toISOString()],
    );
    return rows.length > 0;
  }

  /** Descarta los caducados: con ellos no hay nada que reutilizar. */
  async prune(now: Date): Promise<number> {
    const { rows } = await this.#sql.query<{ jti: string }>(
      'delete from app.used_grants where expires_at < $1 returning jti',
      [now.toISOString()],
    );
    return rows.length;
  }
}
