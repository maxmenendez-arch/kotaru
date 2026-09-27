import type { SqlClient } from './client.js';

export type SafetyOutcomeRecord = 'allow' | 'soften' | 'refuse' | 'crisis_handoff' | 'block_minor';

/**
 * Registro de que una politica de seguridad actuo: cual, que version y con que
 * resultado. NUNCA que se dijo. Permite responder despues de un incidente "que politica
 * estaba vigente" sin guardar el contenido sensible que lo provoco.
 */
export class SafetyEventRepository {
  readonly #sql: SqlClient;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  async record(event: {
    readonly subjectId: string;
    readonly conversationId: string | null;
    readonly policyVersion: string;
    readonly outcome: SafetyOutcomeRecord;
    readonly atIso: string;
  }): Promise<void> {
    await this.#sql.query(
      `insert into app.safety_events (id, subject_id, conversation_id, policy_version, outcome, created_at)
       values (gen_random_uuid(), $1,
               (select id from app.conversations where id = $2::uuid and subject_id = $1),
               $3, $4, $5)`,
      [event.subjectId, event.conversationId, event.policyVersion, event.outcome, event.atIso],
    );
  }
}
