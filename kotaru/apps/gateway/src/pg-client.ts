import pg from 'pg';
import type { SqlClient, SqlRow } from '@kotaru/persistence';

type Queryable = Pick<pg.Pool | pg.PoolClient, 'query'>;

export interface PgSqlClient extends SqlClient {
  /** Cierra el pool. Llamar una vez, al apagar el proceso. */
  close(): Promise<void>;
}

/**
 * `SqlClient` sobre node-postgres: el cliente de produccion.
 *
 * Los repositorios no saben que existe; hablan con `SqlClient`, igual que en las pruebas
 * con PGlite. Aqui vive lo unico que depende del driver: el pool y como se hace una
 * transaccion con el.
 *
 * Una transaccion toma UNA conexion del pool y la retiene hasta el COMMIT o ROLLBACK.
 * Hacerla sobre el pool directamente mandaria cada sentencia por una conexion distinta y
 * el BEGIN no protegeria nada. Una transaccion anidada usa SAVEPOINT.
 */
export function pgClient(config: pg.PoolConfig): PgSqlClient {
  const pool = new pg.Pool(config);
  // Un error de una conexion ociosa (la base se reinicia, un corte de red) llega como
  // evento. Sin este manejador tumba el proceso entero; con el, el pool la descarta y la
  // siguiente consulta abre otra.
  pool.on('error', () => {});

  return {
    ...wrap(pool, async (fn) => {
      const conn = await pool.connect();
      try {
        await conn.query('begin');
        const result = await fn(wrapTx(conn, 0));
        await conn.query('commit');
        return result;
      } catch (error) {
        await conn.query('rollback').catch(() => {});
        throw error;
      } finally {
        conn.release();
      }
    }),
    close: () => pool.end(),
  };
}

function wrap(
  handle: Queryable,
  transaction: <T>(fn: (tx: SqlClient) => Promise<T>) => Promise<T>,
): SqlClient {
  return {
    async query<T = SqlRow>(sql: string, params?: readonly unknown[]) {
      const result = await handle.query(sql, params ? [...params] : undefined);
      return { rows: result.rows as T[] };
    },
    async exec(sql: string) {
      // Sin parametros, node-postgres usa el protocolo simple, que admite varias
      // sentencias en un solo envio: es lo que necesita una migracion.
      await handle.query(sql);
    },
    transaction,
  };
}

function wrapTx(conn: pg.PoolClient, depth: number): SqlClient {
  return wrap(conn, async (fn) => {
    const name = `sp_${depth + 1}`;
    await conn.query(`savepoint ${name}`);
    try {
      const result = await fn(wrapTx(conn, depth + 1));
      await conn.query(`release savepoint ${name}`);
      return result;
    } catch (error) {
      await conn.query(`rollback to savepoint ${name}`).catch(() => {});
      throw error;
    }
  });
}
