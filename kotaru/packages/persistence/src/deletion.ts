import type { SqlClient } from './client.js';

export type DeletionOutcome =
  | { readonly ok: true; readonly subjectId: string; readonly rowsDeleted: number }
  | { readonly ok: false; readonly reason: 'account_not_found' | 'no_subject_link' };

/**
 * Borrado de cuenta.
 *
 * Este es el costo honesto de separar identidad y contenido: como nada en `app`
 * referencia a `identity`, borrar la cuenta NO arrastra el contenido en cascada. Hay
 * que resolver el seudonimo, borrar por seudonimo, y solo entonces borrar el vinculo y
 * la cuenta. Todo en una transaccion: un borrado que se completa a medias en silencio
 * es peor que uno que falla.
 *
 * El orden importa. Si se borrara el vinculo primero, el seudonimo se perderia y el
 * contenido quedaria huerfano para siempre, sin forma de encontrarlo.
 */
export async function deleteAccount(sql: SqlClient, accountId: string): Promise<DeletionOutcome> {
  return sql.transaction(async (tx) => {
    const account = await tx.query<{ id: string }>(
      'select id from identity.accounts where id = $1',
      [accountId],
    );
    if (account.rows.length === 0) return { ok: false, reason: 'account_not_found' };

    const link = await tx.query<{ subject_id: string }>(
      'select subject_id from identity.subject_links where account_id = $1',
      [accountId],
    );
    if (link.rows.length === 0) return { ok: false, reason: 'no_subject_link' };

    const subjectId = link.rows[0]!.subject_id;
    let rowsDeleted = 0;

    // En orden de dependencia. `messages` cae con `conversations` por cascada.
    const statements: readonly string[] = [
      'delete from app.safety_events where subject_id = $1',
      'delete from app.usage_ledger where subject_id = $1',
      'delete from app.purchases where subject_id = $1',
      'delete from app.entitlements where subject_id = $1',
      'delete from app.memories where subject_id = $1',
      'delete from app.conversations where subject_id = $1',
    ];
    for (const statement of statements) {
      const result = await tx.query<{ ok: number }>(`${statement} returning 1 as ok`, [subjectId]);
      rowsDeleted += result.rows.length;
    }

    await tx.query('delete from identity.subject_links where account_id = $1', [accountId]);
    await tx.query('delete from identity.accounts where id = $1', [accountId]);

    return { ok: true, subjectId, rowsDeleted };
  });
}

/** Comprueba que no quedo nada del seudonimo. Se usa para verificar un borrado. */
export async function countRemainingFor(sql: SqlClient, subjectId: string): Promise<number> {
  const tables = [
    'app.safety_events', 'app.usage_ledger', 'app.purchases',
    'app.entitlements', 'app.memories', 'app.conversations',
  ];
  let total = 0;
  for (const table of tables) {
    const { rows } = await sql.query<{ n: string }>(
      `select count(*)::text as n from ${table} where subject_id = $1`,
      [subjectId],
    );
    total += Number(rows[0]!.n);
  }
  const messages = await sql.query<{ n: string }>(
    `select count(*)::text as n from app.messages m
     join app.conversations c on c.id = m.conversation_id where c.subject_id = $1`,
    [subjectId],
  );
  return total + Number(messages.rows[0]!.n);
}
