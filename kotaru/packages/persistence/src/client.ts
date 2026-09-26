export type SqlRow = Record<string, unknown>;

/**
 * Cliente SQL minimo.
 *
 * Existe para que los repositorios no se aten a un driver concreto: las pruebas corren
 * contra PGlite (Postgres compilado a WebAssembly, sin servidor) y produccion contra
 * node-postgres, con el mismo codigo. Si el repositorio importara el driver, probarlo
 * exigiria levantar una base de datos y nadie lo haria.
 */
export interface SqlClient {
  query<T = SqlRow>(sql: string, params?: readonly unknown[]): Promise<{ rows: T[] }>;
  exec(sql: string): Promise<void>;
  transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T>;
}
