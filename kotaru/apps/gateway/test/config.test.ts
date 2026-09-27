import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig } from '../src/config.js';

const k = () => randomBytes(32).toString('base64');
const valid = () => ({
  DATABASE_URL: 'postgres://u:secreto-que-no-debe-salir@127.0.0.1:5432/kotaru',
  KOTARU_GRANT_KEYS: `g1:${k()}`,
  KOTARU_ACCESS_KEYS: `a1:${k()}`,
});

function problems(env: Record<string, string | undefined>): readonly string[] {
  try {
    loadConfig(env);
    return [];
  } catch (error) {
    if (error instanceof ConfigError) return error.problems;
    throw error;
  }
}

describe('configuracion', () => {
  it('con lo minimo arranca y pone valores seguros por defecto', () => {
    const config = loadConfig(valid());
    expect(config).toMatchObject({ host: '127.0.0.1', port: 8080, messageRetentionDays: 30, providers: ['mock'] });
    expect(config.grantKeys[0]!.kid).toBe('g1');
  });

  it('junta todos los problemas de una vez', () => {
    expect(problems({})).toEqual(['falta DATABASE_URL', 'falta KOTARU_GRANT_KEYS', 'falta KOTARU_ACCESS_KEYS']);
  });

  it('rechaza claves cortas, mal formadas o repetidas', () => {
    expect(problems({ ...valid(), KOTARU_GRANT_KEYS: `g1:${randomBytes(16).toString('base64')}` })[0]).toMatch(/16 bytes/);
    expect(problems({ ...valid(), KOTARU_GRANT_KEYS: 'sin-dos-puntos' })[0]).toMatch(/formato kid:base64/);
    expect(problems({ ...valid(), KOTARU_GRANT_KEYS: `g1:${k()},g1:${k()}` })).toContain('KOTARU_GRANT_KEYS: hay kids repetidos');
  });

  it('no deja usar la misma clave para grants y tokens de acceso', () => {
    const shared = k();
    expect(problems({ ...valid(), KOTARU_GRANT_KEYS: `g1:${shared}`, KOTARU_ACCESS_KEYS: `a1:${shared}` })).toEqual([
      'KOTARU_ACCESS_KEYS no puede reutilizar una clave de KOTARU_GRANT_KEYS',
    ]);
  });

  it('valida numeros y rangos', () => {
    expect(problems({ ...valid(), PORT: '99999', KOTARU_MESSAGE_RETENTION_DAYS: '0', KOTARU_MONTHLY_HARD_CAP_USD: '-1' })).toHaveLength(3);
  });

  it('ningun mensaje de error contiene el valor de una variable', () => {
    const env = { ...valid(), DATABASE_URL: 'mysql://u:secreto-que-no-debe-salir@x/y', PORT: 'abc' };
    const text = problems(env).join('\n');
    expect(text).not.toContain('secreto-que-no-debe-salir');
    expect(text).not.toContain('abc');
  });
});
