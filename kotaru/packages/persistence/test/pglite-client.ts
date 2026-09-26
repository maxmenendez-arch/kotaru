import { PGlite } from '@electric-sql/pglite';
import type { SqlClient, SqlRow } from '../src/client.js';

/** Adaptador de PGlite al SqlClient, solo para pruebas. */
export function pgliteClient(db: PGlite): SqlClient {
  const wrap = (handle: { query: PGlite['query']; exec: PGlite['exec'] }): SqlClient => ({
    async query<T = SqlRow>(sql: string, params?: readonly unknown[]) {
      const result = await handle.query(sql, params ? [...params] : undefined);
      return { rows: result.rows as T[] };
    },
    async exec(sql: string) {
      await handle.exec(sql);
    },
    async transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
      return db.transaction(async (tx) => fn(wrap(tx as unknown as { query: PGlite['query']; exec: PGlite['exec'] }))) as Promise<T>;
    },
  });
  return wrap(db);
}
