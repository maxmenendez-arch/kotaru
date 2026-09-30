import { randomBytes } from 'node:crypto';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

  it('el login necesita las dos claves del correo, de 32 bytes y distintas', () => {
    expect(problems({ ...valid(), KOTARU_APPLE_CLIENT_IDS: 'app.kotaru.mobile' })).toEqual([
      'el login necesita KOTARU_EMAIL_HASH_KEY y KOTARU_EMAIL_ENCRYPTION_KEY',
    ]);
    const same = k();
    expect(problems({ ...valid(), KOTARU_APPLE_CLIENT_IDS: 'x', KOTARU_EMAIL_HASH_KEY: same, KOTARU_EMAIL_ENCRYPTION_KEY: same })).toContain(
      'KOTARU_EMAIL_HASH_KEY y KOTARU_EMAIL_ENCRYPTION_KEY deben ser distintas',
    );
    const ok = loadConfig({ ...valid(), KOTARU_GOOGLE_CLIENT_IDS: 'a,b', KOTARU_EMAIL_HASH_KEY: k(), KOTARU_EMAIL_ENCRYPTION_KEY: k() });
    expect(ok.auth?.googleClientIds).toEqual(['a', 'b']);
    expect(loadConfig(valid()).auth).toBeUndefined();
  });

  it('passkeys: dominio y origenes https de ese dominio', () => {
    const keys = { KOTARU_EMAIL_HASH_KEY: k(), KOTARU_EMAIL_ENCRYPTION_KEY: k() };
    const ok = loadConfig({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'kotaru.app', KOTARU_WEBAUTHN_ORIGINS: 'https://app.kotaru.app,https://kotaru.app' });
    expect(ok.auth?.passkeys).toEqual({ rpId: 'kotaru.app', origins: ['https://app.kotaru.app', 'https://kotaru.app'] });
    expect(ok.auth?.appleClientIds).toEqual([]);
    expect(problems({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'kotaru.app' })).toEqual(['las passkeys necesitan KOTARU_WEBAUTHN_ORIGINS']);
    expect(problems({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'kotaru.app', KOTARU_WEBAUTHN_ORIGINS: 'http://app.kotaru.app' })).toHaveLength(1);
    expect(problems({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'kotaru.app', KOTARU_WEBAUTHN_ORIGINS: 'https://kotaru.app.evil.example' })).toHaveLength(1);
    expect(problems({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'kotaru.app', KOTARU_WEBAUTHN_ORIGINS: 'https://app.kotaru.app/ruta' })).toHaveLength(1);
    // Desarrollo local: localhost vale, tambien por http.
    expect(problems({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'localhost', KOTARU_WEBAUTHN_ORIGINS: 'http://localhost:8081' })).toEqual([]);
    expect(problems({ ...valid(), ...keys, KOTARU_WEBAUTHN_RP_ID: 'kotaru.app', KOTARU_WEBAUTHN_ORIGINS: 'http://localhost:8081' })).toHaveLength(1);
    expect(problems({ ...valid(), KOTARU_WEBAUTHN_RP_ID: 'kotaru.app', KOTARU_WEBAUTHN_ORIGINS: 'https://app.kotaru.app' })).toEqual([
      'el login necesita KOTARU_EMAIL_HASH_KEY y KOTARU_EMAIL_ENCRYPTION_KEY',
    ]);
  });

  it('cartesia: misma clave de Together, voces por personaje validadas', () => {
    const env = { ...valid(), KOTARU_PROVIDERS: 'gemini,cartesia', GEMINI_API_KEY: 'g', TOGETHER_API_KEY: 't', KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED: 'true' };
    const ok = loadConfig({ ...env, KOTARU_CARTESIA_VOICES: 'nova:c0925108-d541-4dc4-bbae-39f4e57ba10c' });
    expect(ok.providerSettings.cartesia).toMatchObject({ apiKey: 't', zeroRetentionConfirmed: true, voices: { nova: 'c0925108-d541-4dc4-bbae-39f4e57ba10c' } });
    expect(problems({ ...env, KOTARU_CARTESIA_VOICES: 'nova:Lucia,pepe:c0925108-d541-4dc4-bbae-39f4e57ba10c' })).toEqual([
      'KOTARU_CARTESIA_VOICES: "Lucia" no es un id de voz de Cartesia',
      'KOTARU_CARTESIA_VOICES: "pepe:c0925108-d541-4dc4-bbae-39f4e57ba10c" debe ser personaje:id (personajes: nova, luna, rio)',
    ]);
  });

  it('chirp: lee la cuenta de servicio del archivo; los errores no muestran la clave', () => {
    const dir = mkdtempSync(join(tmpdir(), 'kotaru-chirp-'));
    const good = join(dir, 'google-tts.json');
    writeFileSync(good, JSON.stringify({ type: 'service_account', client_email: 'kotaru-voz@p.iam.gserviceaccount.com', private_key: '-----BEGIN PRIVATE KEY-----\nSECRETO\n-----END PRIVATE KEY-----\n', token_uri: 'https://oauth2.googleapis.com/token' }));
    const env = { ...valid(), KOTARU_PROVIDERS: 'gemini,chirp', GEMINI_API_KEY: 'g', GOOGLE_TTS_CREDENTIALS_FILE: good, KOTARU_GOOGLE_TTS_TERMS_REVIEWED: 'true' };
    const ok = loadConfig(env);
    expect(ok.providerSettings.chirp).toMatchObject({ termsReviewed: true, credentials: { client_email: 'kotaru-voz@p.iam.gserviceaccount.com' } });

    const broken = join(dir, 'roto.json');
    writeFileSync(broken, '{"type":"service_account","private_key":"SECRETO"');
    const p1 = problems({ ...env, GOOGLE_TTS_CREDENTIALS_FILE: broken });
    expect(p1).toEqual([`chirp: no se pudo leer ${broken} (falta o no es JSON)`]);
    expect(p1.join(' ')).not.toContain('SECRETO');

    const notSa = join(dir, 'otro.json');
    writeFileSync(notSa, JSON.stringify({ type: 'authorized_user', client_id: 'x' }));
    expect(problems({ ...env, GOOGLE_TTS_CREDENTIALS_FILE: notSa })).toEqual([`chirp: ${notSa} no es la clave de una cuenta de servicio de Google (JSON)`]);
    expect(problems({ ...env, GOOGLE_TTS_CREDENTIALS_FILE: join(dir, 'no-existe.json') })).toHaveLength(1);
  });
});

describe('voz por personaje (KOTARU_COMPANION_VOICE)', () => {
  it('por defecto Luna con Chirp; se puede cambiar y los errores se avisan', async () => {
    const { parseCompanionVoice } = await import('../src/config.js');
    const problems: string[] = [];
    expect(parseCompanionVoice(undefined, problems)).toEqual({ luna: 'chirp' });
    expect(parseCompanionVoice('luna:gemini,nova:chirp', problems)).toEqual({ luna: 'gemini', nova: 'chirp' });
    expect(parseCompanionVoice('', problems)).toEqual({});
    expect(problems).toEqual([]);
    parseCompanionVoice('yuki:chirp,luna:robot', problems);
    expect(problems).toHaveLength(2);
  });
});
