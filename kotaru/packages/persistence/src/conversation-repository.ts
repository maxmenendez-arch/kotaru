import type { SqlClient } from './client.js';

export interface ConversationRepositoryOptions {
  /**
   * Retencion de mensajes cuando el usuario no eligio otra. ASSUMPTION: 30 dias. Es una
   * decision de producto y legal pendiente; vive aqui como parametro, no enterrada en SQL.
   */
  readonly defaultRetentionDays?: number;
  /**
   * Un turno marcado sensible (crisis, contenido que la politica de seguridad aparto de
   * la memoria) se guarda mucho menos. ASSUMPTION: 24 horas, suficiente para que la
   * conversacion inmediata tenga contexto y no mas. Ver 06_SAFETY: "avoid retaining
   * crisis content longer than necessary".
   */
  readonly sensitiveRetentionHours?: number;
}

export interface OpenConversation {
  readonly conversationId: string;
  readonly subjectId: string;
  readonly companionId: string;
  readonly atIso: string;
}

export interface TurnRecord {
  readonly conversationId: string;
  readonly subjectId: string;
  readonly turnId: string;
  readonly locale: string;
  readonly userText: string;
  readonly companionText: string;
  readonly atIso: string;
  readonly sensitive: boolean;
}

export interface StoredMessage {
  readonly role: 'user' | 'companion';
  readonly content: string;
  readonly createdAt: string;
}

export class ConversationOwnershipError extends Error {
  constructor() {
    super('la conversacion pertenece a otro usuario');
    this.name = 'ConversationOwnershipError';
  }
}

const DEFAULT_RETENTION_DAYS = 30;
const SENSITIVE_RETENTION_HOURS = 24;

/**
 * Conversaciones y mensajes. `messages` es la unica tabla del sistema con texto de
 * conversacion, y cada fila nace con su fecha de vencimiento.
 */
export class ConversationRepository {
  readonly #sql: SqlClient;
  readonly #defaultDays: number;
  readonly #sensitiveHours: number;

  constructor(sql: SqlClient, options: ConversationRepositoryOptions = {}) {
    this.#sql = sql;
    this.#defaultDays = options.defaultRetentionDays ?? DEFAULT_RETENTION_DAYS;
    this.#sensitiveHours = options.sensitiveRetentionHours ?? SENSITIVE_RETENTION_HOURS;
  }

  /**
   * Abre la conversacion o la retoma. Si el id ya existe con otro usuario, falla: un id
   * de conversacion no puede servir para leer lo de otra persona.
   */
  async open(input: OpenConversation): Promise<'opened' | 'resumed'> {
    const inserted = await this.#sql.query<{ id: string }>(
      `insert into app.conversations (id, subject_id, companion_id, started_at)
       values ($1, $2, $3, $4) on conflict (id) do nothing returning id::text`,
      [input.conversationId, input.subjectId, input.companionId, input.atIso],
    );
    if (inserted.rows.length > 0) return 'opened';

    const existing = await this.#sql.query<{ subject_id: string }>(
      'select subject_id::text from app.conversations where id = $1',
      [input.conversationId],
    );
    if (existing.rows[0]?.subject_id !== input.subjectId) throw new ConversationOwnershipError();
    return 'resumed';
  }

  /** Los ultimos mensajes vigentes, en orden cronologico, para dar continuidad. */
  async recentMessages(
    conversationId: string,
    subjectId: string,
    limit: number,
    nowIso: string,
  ): Promise<StoredMessage[]> {
    const { rows } = await this.#sql.query<{ role: 'user' | 'companion'; content: string; created_at: string }>(
      `select * from (
         select m.role, m.content,
                to_char(m.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
                m.created_at as ts, m.role = 'companion' as second
         from app.messages m
         join app.conversations c on c.id = m.conversation_id
         where m.conversation_id = $1 and c.subject_id = $2
           and m.role in ('user', 'companion')
           and (m.expires_at is null or m.expires_at > $4)
         order by m.created_at desc, (m.role = 'companion') desc
         limit $3
       ) recent order by ts asc, second asc`,
      [conversationId, subjectId, limit, nowIso],
    );
    return rows.map((r) => ({ role: r.role, content: r.content, createdAt: r.created_at }));
  }

  /**
   * Guarda un turno completo (lo que dijo el usuario y lo que respondio el companion) en
   * una transaccion. Idempotente por turno: repetirlo no duplica nada. Devuelve false si
   * el turno ya estaba.
   */
  async appendTurn(turn: TurnRecord): Promise<boolean> {
    return this.#sql.transaction(async (tx) => {
      const owner = await tx.query<{ subject_id: string }>(
        'select subject_id::text from app.conversations where id = $1',
        [turn.conversationId],
      );
      if (owner.rows[0]?.subject_id !== turn.subjectId) throw new ConversationOwnershipError();

      const expiresAt = turn.sensitive
        ? addHours(turn.atIso, this.#sensitiveHours)
        : addDays(turn.atIso, await this.#retentionDays(tx, turn.subjectId));

      // El companion responde despues: un milisegundo mas, para que el orden cronologico
      // sea estable aunque ambos se guarden en el mismo instante.
      const replyAt = new Date(Date.parse(turn.atIso) + 1).toISOString();
      const inserted = await tx.query<{ id: string }>(
        `insert into app.messages (id, conversation_id, role, content, locale, created_at, expires_at, turn_id)
         values (gen_random_uuid(), $1, 'user', $2, $3, $4, $6, $7),
                (gen_random_uuid(), $1, 'companion', $5, $3, $8, $6, $7)
         on conflict (conversation_id, turn_id, role) where turn_id is not null do nothing
         returning id::text`,
        [turn.conversationId, turn.userText, turn.locale, turn.atIso, turn.companionText, expiresAt, turn.turnId, replyAt],
      );
      if (inserted.rows.length === 0) return false;

      await tx.query('update app.conversations set last_turn_at = $2 where id = $1', [turn.conversationId, replyAt]);
      return true;
    });
  }

  /** Dias de retencion vigentes para este usuario. */
  async retentionDaysFor(subjectId: string): Promise<number> {
    return this.#retentionDays(this.#sql, subjectId);
  }

  /**
   * El usuario elige cuanto se guardan sus mensajes. `null` vuelve al valor por defecto.
   * Se aplica tambien a lo ya guardado: acortar la retencion borra lo que quede fuera en
   * la proxima pasada del trabajo de retencion, no solo lo que se escriba despues.
   */
  async setRetentionDays(subjectId: string, days: number | null, atIso: string): Promise<void> {
    if (days !== null && (!Number.isInteger(days) || days < 1 || days > 3650)) {
      throw new RangeError('la retencion debe ser un entero entre 1 y 3650 dias');
    }
    await this.#sql.transaction(async (tx) => {
      await tx.query(
        `insert into app.subject_settings (subject_id, message_retention_days, updated_at)
         values ($1, $2, $3)
         on conflict (subject_id) do update set message_retention_days = $2, updated_at = $3`,
        [subjectId, days, atIso],
      );
      const effective = days ?? this.#defaultDays;
      // Recalcula el vencimiento de lo guardado sin tocar lo sensible, que ya vence antes.
      await tx.query(
        `update app.messages m set expires_at = m.created_at + make_interval(days => $2)
         from app.conversations c
         where c.id = m.conversation_id and c.subject_id = $1
           and (m.expires_at is null or m.expires_at > m.created_at + make_interval(hours => $3))`,
        [subjectId, effective, this.#sensitiveHours],
      );
    });
  }

  /** La persona activo el coqueteo sensual (Ajustes). */
  async sensualFlirtingFor(subjectId: string): Promise<boolean> {
    const { rows } = await this.#sql.query<{ enabled: boolean }>(
      'select sensual_flirting_since is not null as enabled from app.subject_settings where subject_id = $1',
      [subjectId],
    );
    return rows[0]?.enabled ?? false;
  }

  /** Activa (guardando cuando se consintio) o desactiva el coqueteo sensual. */
  async setSensualFlirting(subjectId: string, on: boolean, atIso: string): Promise<void> {
    await this.#sql.query(
      `insert into app.subject_settings (subject_id, sensual_flirting_since, updated_at)
       values ($1, $2, $3)
       on conflict (subject_id) do update
         set sensual_flirting_since = case when $2::timestamptz is null then null
                                           else coalesce(app.subject_settings.sensual_flirting_since, $2::timestamptz) end,
             updated_at = $3`,
      [subjectId, on ? atIso : null, atIso],
    );
  }

  async #retentionDays(sql: SqlClient, subjectId: string): Promise<number> {
    const { rows } = await sql.query<{ days: number | null }>(
      'select message_retention_days as days from app.subject_settings where subject_id = $1',
      [subjectId],
    );
    return rows[0]?.days ?? this.#defaultDays;
  }
}

function addDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * 86_400_000).toISOString();
}

function addHours(iso: string, hours: number): string {
  return new Date(Date.parse(iso) + hours * 3_600_000).toISOString();
}
