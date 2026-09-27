import type { ApproveOutcome, Memory, MemoryKind, MemoryPatch, MemoryRepository, MemoryStatus, UpdateResult } from '@kotaru/memory';
import type { SqlClient } from './client.js';

interface MemoryRow {
  id: string;
  subject_id: string;
  companion_id: string;
  kind: MemoryKind;
  text: string;
  status: MemoryStatus;
  pinned: boolean;
  confidence: number;
  source_turn_id: string;
  use_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

// Las fechas salen de la base ya en ISO-8601 UTC con milisegundos, el mismo formato que
// usa el resto del codigo. Asi da igual que el driver devuelva Date o texto.
const ISO = (column: string) =>
  `to_char(${column} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as ${column}`;

const COLUMNS = `id::text, subject_id::text, companion_id, kind, text, status, pinned,
  confidence, source_turn_id, use_count,
  ${ISO('last_used_at')}, ${ISO('created_at')}, ${ISO('updated_at')}, ${ISO('expires_at')}`;

const UNIQUE_VIOLATION = '23505';

/**
 * Recuerdos en PostgreSQL. Cumple la misma especificacion que el repositorio en memoria
 * (`describeMemoryStore` de @kotaru/memory corre contra los dos).
 *
 * El duplicado lo decide el indice unico parcial, no una lectura previa: dos procesos que
 * proponen lo mismo a la vez no pueden colarlo. El tope de aprobados se protege con un
 * candado de transaccion por usuario, para que dos aprobaciones simultaneas no cuenten
 * ambas "hay sitio".
 */
export class SqlMemoryRepository implements MemoryRepository {
  readonly #sql: SqlClient;

  constructor(sql: SqlClient) {
    this.#sql = sql;
  }

  async insert(memory: Memory): Promise<'inserted' | 'duplicate'> {
    try {
      await this.#sql.query(
        `insert into app.memories (id, subject_id, companion_id, kind, text, status, pinned, confidence,
           source_turn_id, use_count, last_used_at, created_at, updated_at, expires_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        params(memory),
      );
      return 'inserted';
    } catch (error) {
      if (isUniqueViolation(error)) return 'duplicate';
      throw error;
    }
  }

  async get(id: string): Promise<Memory | undefined> {
    const { rows } = await this.#sql.query<MemoryRow>(`select ${COLUMNS} from app.memories where id = $1`, [id]);
    return rows[0] ? toMemory(rows[0]) : undefined;
  }

  async update(id: string, patch: MemoryPatch, atIso: string): Promise<UpdateResult> {
    // Una sola sentencia que toca solo lo que cambia: sin leer-y-reescribir, no hay
    // ventana en la que otra escritura (una aprobacion, un uso contado) se pierda.
    const sets: string[] = ['updated_at = $2'];
    const values: unknown[] = [id, atIso];
    if (patch.text !== undefined) {
      values.push(patch.text);
      sets.push(`text = $${values.length}`);
    }
    if (patch.pinned !== undefined) {
      values.push(patch.pinned);
      sets.push(`pinned = $${values.length}`);
    }
    if (patch.status !== undefined) {
      values.push(patch.status);
      sets.push(`status = $${values.length}`);
    }
    try {
      const { rows } = await this.#sql.query<MemoryRow>(
        `update app.memories set ${sets.join(', ')} where id = $1 returning ${COLUMNS}`,
        values,
      );
      return rows[0] ? { outcome: 'saved', memory: toMemory(rows[0]) } : { outcome: 'not_found' };
    } catch (error) {
      if (isUniqueViolation(error)) return { outcome: 'duplicate' };
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    const { rows } = await this.#sql.query('delete from app.memories where id = $1 returning 1 as ok', [id]);
    return rows.length > 0;
  }

  async removeAllFor(subjectId: string): Promise<number> {
    const { rows } = await this.#sql.query('delete from app.memories where subject_id = $1 returning 1 as ok', [subjectId]);
    return rows.length;
  }

  async listFor(subjectId: string): Promise<Memory[]> {
    const { rows } = await this.#sql.query<MemoryRow>(
      `select ${COLUMNS} from app.memories where subject_id = $1`,
      [subjectId],
    );
    return rows.map(toMemory);
  }

  async recallable(subjectId: string, companionId: string, nowIso: string): Promise<Memory[]> {
    const { rows } = await this.#sql.query<MemoryRow>(
      `select ${COLUMNS} from app.memories
       where subject_id = $1 and companion_id = $2 and status = 'approved'
         and (expires_at is null or expires_at > $3)`,
      [subjectId, companionId, nowIso],
    );
    return rows.map(toMemory);
  }

  async markUsed(ids: readonly string[], atIso: string): Promise<void> {
    if (ids.length === 0) return;
    await this.#sql.query(
      `update app.memories set use_count = use_count + 1, last_used_at = $2 where id = any($1::uuid[])`,
      [[...ids], atIso],
    );
  }

  async countApproved(subjectId: string): Promise<number> {
    const { rows } = await this.#sql.query<{ n: string }>(
      `select count(*)::text as n from app.memories where subject_id = $1 and status = 'approved'`,
      [subjectId],
    );
    return Number(rows[0]!.n);
  }

  async approveWithinCapacity(id: string, maxApproved: number, atIso: string): Promise<ApproveOutcome> {
    try {
      return await this.#sql.transaction(async (tx) => {
        const found = await tx.query<{ subject_id: string }>(
          'select subject_id::text from app.memories where id = $1',
          [id],
        );
        if (found.rows.length === 0) return { ok: false, reason: 'not_found' } as const;
        const subjectId = found.rows[0]!.subject_id;

        // Un candado por usuario hasta el fin de la transaccion: la cuenta y la escritura
        // quedan juntas aunque haya otras aprobaciones en otras conexiones.
        await tx.query('select pg_advisory_xact_lock(hashtext($1))', [subjectId]);

        const current = await tx.query<MemoryRow>(`select ${COLUMNS} from app.memories where id = $1`, [id]);
        const row = current.rows[0];
        if (!row) return { ok: false, reason: 'not_found' } as const;

        if (row.status !== 'approved') {
          const count = await tx.query<{ n: string }>(
            `select count(*)::text as n from app.memories where subject_id = $1 and status = 'approved'`,
            [subjectId],
          );
          if (Number(count.rows[0]!.n) >= maxApproved) return { ok: false, reason: 'at_capacity' } as const;
        }

        const updated = await tx.query<MemoryRow>(
          `update app.memories set status = 'approved', updated_at = $2 where id = $1 returning ${COLUMNS}`,
          [id, atIso],
        );
        return { ok: true, memory: toMemory(updated.rows[0]!) } as const;
      });
    } catch (error) {
      // Rescatar un rechazado cuyo texto ya tiene gemelo vivo choca con el indice unico.
      if (isUniqueViolation(error)) return { ok: false, reason: 'duplicate' };
      throw error;
    }
  }

  async removeExpired(nowIso: string): Promise<number> {
    const { rows } = await this.#sql.query(
      'delete from app.memories where expires_at is not null and expires_at <= $1 returning 1 as ok',
      [nowIso],
    );
    return rows.length;
  }
}

function params(m: Memory): unknown[] {
  return [
    m.id, m.subjectId, m.companionId, m.kind, m.text, m.status, m.pinned, m.confidence,
    m.sourceTurnId, m.useCount, m.lastUsedAt ?? null, m.createdAt, m.updatedAt, m.expiresAt ?? null,
  ];
}

function toMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    subjectId: row.subject_id,
    companionId: row.companion_id,
    kind: row.kind,
    text: row.text,
    status: row.status,
    pinned: row.pinned,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    useCount: Number(row.use_count),
    sourceTurnId: row.source_turn_id,
    confidence: Number(row.confidence),
    ...(row.last_used_at !== null ? { lastUsedAt: row.last_used_at } : {}),
    ...(row.expires_at !== null ? { expiresAt: row.expires_at } : {}),
  };
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === UNIQUE_VIOLATION;
}
