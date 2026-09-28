import type { SqlClient } from './client.js';

const ISO = (column: string, alias = column) =>
  `to_char(${column} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as ${alias}`;

export interface SubjectExport {
  readonly format: 'kotaru-export@1';
  readonly subjectId: string;
  readonly exportedAt: string;
  readonly settings: { readonly messageRetentionDays: number | null; readonly sensualFlirtingSince: string | null } | null;
  readonly conversations: readonly {
    readonly id: string;
    readonly companionId: string;
    readonly startedAt: string;
    readonly messages: readonly { readonly role: string; readonly content: string; readonly createdAt: string }[];
  }[];
  readonly memories: readonly Record<string, unknown>[];
  readonly usage: readonly { readonly turnId: string; readonly voiceSeconds: number; readonly recordedAt: string }[];
  readonly entitlements: readonly Record<string, unknown>[];
  readonly purchases: readonly Record<string, unknown>[];
  readonly safetyEvents: readonly { readonly policyVersion: string; readonly outcome: string; readonly createdAt: string }[];
}

/**
 * Todo lo que el servicio guarda sobre un seudonimo, en un documento.
 *
 * Deliberadamente fuera: el costo por turno (es un dato del negocio, no de la persona) y
 * las metricas de turno (no llevan subject_id). Los datos de identidad (correo, proveedor
 * de login) viven en otro esquema y los exporta quien tiene acceso a el.
 */
export async function exportSubject(sql: SqlClient, subjectId: string, nowIso: string): Promise<SubjectExport> {
  const settings = await sql.query<{ days: number | null; sensual_since: string | null }>(
    `select message_retention_days as days, ${ISO('sensual_flirting_since', 'sensual_since')}
     from app.subject_settings where subject_id = $1`,
    [subjectId],
  );

  const conversations = await sql.query<{ id: string; companion_id: string; started_at: string }>(
    `select id::text, companion_id, ${ISO('started_at')} from app.conversations
     where subject_id = $1 order by started_at`,
    [subjectId],
  );
  const messages = await sql.query<{ conversation_id: string; role: string; content: string; created_at: string }>(
    `select m.conversation_id::text, m.role, m.content, ${ISO('m.created_at', 'created_at')}
     from app.messages m join app.conversations c on c.id = m.conversation_id
     where c.subject_id = $1 order by m.created_at, m.role = 'companion'`,
    [subjectId],
  );

  const memories = await sql.query(
    `select id::text, companion_id, kind, text, status, pinned, confidence, use_count,
            ${ISO('created_at')}, ${ISO('updated_at')}, ${ISO('last_used_at')}, ${ISO('expires_at')}
     from app.memories where subject_id = $1 order by created_at`,
    [subjectId],
  );
  const usage = await sql.query<{ turn_id: string; voice_seconds: string; recorded_at: string }>(
    `select turn_id, voice_seconds::text, ${ISO('recorded_at')} from app.usage_ledger
     where subject_id = $1 order by recorded_at`,
    [subjectId],
  );
  const entitlements = await sql.query(
    `select plan_id, ${ISO('period_start')}, ${ISO('period_end')}, included_seconds, addon_seconds
     from app.entitlements where subject_id = $1 order by period_start`,
    [subjectId],
  );
  const purchases = await sql.query(
    `select provider_event_id, product_id, status, ${ISO('received_at')}
     from app.purchases where subject_id = $1 order by received_at`,
    [subjectId],
  );
  const safety = await sql.query<{ policy_version: string; outcome: string; created_at: string }>(
    `select policy_version, outcome, ${ISO('created_at')} from app.safety_events
     where subject_id = $1 order by created_at`,
    [subjectId],
  );

  return {
    format: 'kotaru-export@1',
    subjectId,
    exportedAt: nowIso,
    settings: settings.rows[0] ? { messageRetentionDays: settings.rows[0].days, sensualFlirtingSince: settings.rows[0].sensual_since } : null,
    conversations: conversations.rows.map((c) => ({
      id: c.id,
      companionId: c.companion_id,
      startedAt: c.started_at,
      messages: messages.rows
        .filter((m) => m.conversation_id === c.id)
        .map((m) => ({ role: m.role, content: m.content, createdAt: m.created_at })),
    })),
    memories: memories.rows,
    usage: usage.rows.map((u) => ({ turnId: u.turn_id, voiceSeconds: Number(u.voice_seconds), recordedAt: u.recorded_at })),
    entitlements: entitlements.rows,
    purchases: purchases.rows,
    safetyEvents: safety.rows.map((s) => ({ policyVersion: s.policy_version, outcome: s.outcome, createdAt: s.created_at })),
  };
}

export interface AccountExport {
  /** Como se entra: apple, google o passkey. El correo no se exporta en claro porque no se guarda en claro. */
  readonly signInMethod: string;
  readonly createdAt: string;
  readonly hasEmail: boolean;
  readonly passkeys: readonly {
    readonly createdAt: string;
    readonly lastUsedAt: string | null;
    readonly transports: readonly string[];
    readonly backedUp: boolean;
  }[];
}

/**
 * La parte de identidad de la exportacion: con que se entra y que passkeys tiene la cuenta
 * (fechas y tipo; nunca claves ni identificadores de credencial). Va aparte de
 * `exportSubject` porque vive en el esquema `identity`.
 */
export async function exportAccount(sql: SqlClient, subjectId: string): Promise<AccountExport | null> {
  const account = await sql.query<{ id: string; auth_provider: string; created_at: string; has_email: boolean }>(
    `select a.id::text as id, a.auth_provider, ${ISO('a.created_at', 'created_at')}, a.email_hash is not null as has_email
     from identity.accounts a join identity.subject_links l on l.account_id = a.id
     where l.subject_id = $1 and a.deleted_at is null`,
    [subjectId],
  );
  const row = account.rows[0];
  if (!row) return null;
  const passkeys = await sql.query<{ created_at: string; last_used_at: string | null; transports: string[]; backed_up: boolean }>(
    `select ${ISO('created_at')}, ${ISO('last_used_at')}, transports, backed_up
     from identity.passkeys where account_id = $1 order by created_at`,
    [row.id],
  );
  return {
    signInMethod: row.auth_provider,
    createdAt: row.created_at,
    hasEmail: row.has_email,
    passkeys: passkeys.rows.map((p) => ({
      createdAt: p.created_at,
      lastUsedAt: p.last_used_at,
      transports: p.transports ?? [],
      backedUp: p.backed_up,
    })),
  };
}
