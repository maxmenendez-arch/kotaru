import type { SigningKey } from '@kotaru/gateway';

export interface GatewayConfig {
  readonly host: string;
  readonly port: number;
  readonly databaseUrl: string;
  readonly grantKeys: readonly SigningKey[];
  readonly accessKeys: readonly SigningKey[];
  readonly grantAudience: string;
  readonly apiAudience: string;
  readonly monthlyHardCapUsd: number;
  /** Tope mensual del plan gratuito, dentro del tope duro. */
  readonly freeMonthlyCapUsd: number;
  readonly messageRetentionDays: number;
  readonly infraCostUsdPerTurn: number;
  /** Proveedores de IA habilitados: mock, assemblyai, gemini, polly. */
  readonly providers: readonly string[];
  readonly providerSettings: ProviderSettings;
  /** Origenes web con acceso a la API (CORS). Vacio salvo para la version web. */
  readonly corsOrigins: readonly string[];
  /** Login con Apple/Google. Ausente si no esta configurado: la API responde 501. */
  readonly auth?: {
    readonly appleClientIds: readonly string[];
    readonly googleClientIds: readonly string[];
    readonly emailHashKey: Uint8Array;
    readonly emailEncryptionKey: Uint8Array;
    /** Passkeys (WebAuthn): dominio y origenes aceptados. Ausente si no se configuro. */
    readonly passkeys?: { readonly rpId: string; readonly origins: readonly string[] };
  };
  readonly trustProxy: boolean;
  /** IPs del proxy de las que se acepta X-Forwarded-For (vacio: cualquiera, con trustProxy). */
  readonly trustedProxies: readonly string[];
  /** Cupo diario de cuentas nuevas con passkey para todo el servidor. */
  readonly signupsPerDay: number;
}

/**
 * Claves y confirmaciones de cada proveedor real. Las confirmaciones las da el operador
 * tras hacer el trabajo fuera del codigo (activar la exclusion de entrenamiento, revisar
 * terminos). Sin ellas el adaptador se registra pero el router no lo elige.
 */
export interface ProviderSettings {
  readonly assemblyai?: { readonly apiKey: string; readonly zeroRetentionConfirmed: boolean };
  readonly gemini?: { readonly apiKey: string; readonly model: string; readonly paidTierConfirmed: boolean };
  readonly polly?: {
    readonly region: string;
    readonly aiOptOutConfirmed: boolean;
    readonly commercialTermsReviewed: boolean;
  };
  /** Kokoro-82M servido por Together AI (voz barata, pendiente de la prueba a ciegas D-011). */
  readonly kokoro?: {
    readonly apiKey: string;
    readonly zeroRetentionConfirmed: boolean;
    readonly commercialTermsReviewed: boolean;
  };
  /** Whisper Large v3 servido por Together AI (voz a texto; misma clave que Kokoro). */
  readonly whisper?: { readonly apiKey: string; readonly zeroRetentionConfirmed: boolean };
}

const KNOWN_PROVIDERS = new Set(['mock', 'mock-voice', 'assemblyai', 'gemini', 'polly', 'kokoro', 'whisper']);

export class ConfigError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`Configuracion invalida:\n  - ${problems.join('\n  - ')}`);
    this.name = 'ConfigError';
  }
}

/**
 * Lee y valida la configuracion del entorno. Si algo falta o esta mal, junta TODOS los
 * problemas y falla al arrancar, no a la primera peticion.
 *
 * Los mensajes de error nunca incluyen el valor de una variable: podria ser un secreto.
 */
export function loadConfig(env: Readonly<Record<string, string | undefined>>): GatewayConfig {
  const problems: string[] = [];

  const required = (name: string): string => {
    const value = env[name];
    if (value === undefined || value.trim() === '') {
      problems.push(`falta ${name}`);
      return '';
    }
    return value.trim();
  };

  const integer = (name: string, fallback: number, min: number, max: number): number => {
    const raw = env[name];
    if (raw === undefined || raw.trim() === '') return fallback;
    const value = Number(raw);
    if (!Number.isInteger(value) || value < min || value > max) {
      problems.push(`${name} debe ser un entero entre ${min} y ${max}`);
      return fallback;
    }
    return value;
  };

  const decimal = (name: string, fallback: number, min: number): number => {
    const raw = env[name];
    if (raw === undefined || raw.trim() === '') return fallback;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min) {
      problems.push(`${name} debe ser un numero mayor o igual que ${min}`);
      return fallback;
    }
    return value;
  };

  const databaseUrl = required('DATABASE_URL');
  if (databaseUrl && !/^postgres(ql)?:\/\//.test(databaseUrl)) problems.push('DATABASE_URL debe empezar por postgres://');

  const grantKeys = parseKeys('KOTARU_GRANT_KEYS', required('KOTARU_GRANT_KEYS'), problems);
  const accessKeys = parseKeys('KOTARU_ACCESS_KEYS', required('KOTARU_ACCESS_KEYS'), problems);

  // Reutilizar la misma clave para grants y tokens de acceso anula una de las defensas.
  const grantSecrets = new Set(grantKeys.map((k) => Buffer.from(k.secret).toString('hex')));
  if (accessKeys.some((k) => grantSecrets.has(Buffer.from(k.secret).toString('hex')))) {
    problems.push('KOTARU_ACCESS_KEYS no puede reutilizar una clave de KOTARU_GRANT_KEYS');
  }

  const providers = (env.KOTARU_PROVIDERS ?? 'mock')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const flag = (name: string): boolean => {
    const raw = env[name]?.trim().toLowerCase();
    if (raw === undefined || raw === '') return false;
    if (raw === 'true' || raw === 'false') return raw === 'true';
    problems.push(`${name} debe ser true o false`);
    return false;
  };

  for (const id of providers) if (!KNOWN_PROVIDERS.has(id)) problems.push(`KOTARU_PROVIDERS: proveedor desconocido "${id}"`);
  if (providers.length === 0) problems.push('KOTARU_PROVIDERS esta vacio');

  const providerSettings: ProviderSettings = {
    ...(providers.includes('assemblyai')
      ? { assemblyai: { apiKey: required('ASSEMBLYAI_API_KEY'), zeroRetentionConfirmed: flag('KOTARU_ASSEMBLYAI_ZERO_RETENTION_CONFIRMED') } }
      : {}),
    ...(providers.includes('gemini')
      ? {
          gemini: {
            apiKey: required('GEMINI_API_KEY'),
            model: env.GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite',
            paidTierConfirmed: flag('KOTARU_GEMINI_PAID_TIER_CONFIRMED'),
          },
        }
      : {}),
    ...(providers.includes('polly')
      ? {
          polly: {
            region: env.AWS_REGION?.trim() || 'us-east-1',
            aiOptOutConfirmed: flag('KOTARU_POLLY_AI_OPT_OUT_CONFIRMED'),
            commercialTermsReviewed: flag('KOTARU_POLLY_COMMERCIAL_TERMS_REVIEWED'),
          },
        }
      : {}),
    ...(providers.includes('kokoro')
      ? {
          kokoro: {
            apiKey: required('TOGETHER_API_KEY'),
            zeroRetentionConfirmed: flag('KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED'),
            commercialTermsReviewed: flag('KOTARU_TOGETHER_COMMERCIAL_TERMS_REVIEWED'),
          },
        }
      : {}),
  };
  if (providers.includes('whisper')) {
    (providerSettings as { whisper?: ProviderSettings['whisper'] }).whisper = {
      apiKey: providers.includes('kokoro') ? providerSettings.kokoro!.apiKey : required('TOGETHER_API_KEY'),
      zeroRetentionConfirmed: flag('KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED'),
    };
  }
  if (providers.includes('polly') && !(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY)) {
    problems.push('polly necesita AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY');
  }

  const list = (name: string) =>
    (env[name] ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  const secret32 = (name: string): Uint8Array | null => {
    const raw = env[name]?.trim();
    if (!raw) return null;
    const bytes = Buffer.from(raw, 'base64');
    if (bytes.byteLength !== 32) {
      problems.push(`${name} debe ser de 32 bytes en base64 (tiene ${bytes.byteLength})`);
      return null;
    }
    return new Uint8Array(bytes);
  };
  const appleClientIds = list('KOTARU_APPLE_CLIENT_IDS');
  const googleClientIds = list('KOTARU_GOOGLE_CLIENT_IDS');
  const emailHashKey = secret32('KOTARU_EMAIL_HASH_KEY');
  const emailEncryptionKey = secret32('KOTARU_EMAIL_ENCRYPTION_KEY');
  const rpId = env.KOTARU_WEBAUTHN_RP_ID?.trim().toLowerCase() || null;
  const passkeyOrigins = list('KOTARU_WEBAUTHN_ORIGINS');
  if (rpId || passkeyOrigins.length > 0) {
    // `localhost` solo para desarrollo: los navegadores lo tratan como contexto seguro.
    if (!rpId || (rpId !== 'localhost' && !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(rpId))) {
      problems.push('KOTARU_WEBAUTHN_RP_ID debe ser un dominio (p. ej. kotaru.app)');
    }
    if (passkeyOrigins.length === 0) problems.push('las passkeys necesitan KOTARU_WEBAUTHN_ORIGINS');
    for (const origin of passkeyOrigins) {
      if (origin.startsWith('android:apk-key-hash:')) continue;
      let host: string | null = null;
      try {
        const url = new URL(origin);
        const secure = url.protocol === 'https:' || (rpId === 'localhost' && url.protocol === 'http:');
        if (secure && url.origin === origin) host = url.hostname;
      } catch {
        host = null;
      }
      // Una passkey de kotaru.app vale en kotaru.app y sus subdominios, en ningun otro sitio.
      if (!host || !rpId || (host !== rpId && !host.endsWith(`.${rpId}`))) {
        problems.push(`KOTARU_WEBAUTHN_ORIGINS: ${origin} no es un origen https de ${rpId ?? 'el dominio'}`);
      }
    }
  }
  const passkeys = rpId && passkeyOrigins.length > 0 ? { rpId, origins: passkeyOrigins } : undefined;
  const wantsAuth = appleClientIds.length > 0 || googleClientIds.length > 0 || passkeys !== undefined;
  if (wantsAuth && (!emailHashKey || !emailEncryptionKey)) {
    problems.push('el login necesita KOTARU_EMAIL_HASH_KEY y KOTARU_EMAIL_ENCRYPTION_KEY');
  }
  if (emailHashKey && emailEncryptionKey && Buffer.from(emailHashKey).equals(Buffer.from(emailEncryptionKey))) {
    problems.push('KOTARU_EMAIL_HASH_KEY y KOTARU_EMAIL_ENCRYPTION_KEY deben ser distintas');
  }

  const config: GatewayConfig = {
    host: env.HOST?.trim() || '127.0.0.1',
    port: integer('PORT', 8080, 1, 65535),
    databaseUrl,
    grantKeys,
    accessKeys,
    grantAudience: env.KOTARU_GRANT_AUDIENCE?.trim() || 'kotaru-gateway',
    apiAudience: env.KOTARU_API_AUDIENCE?.trim() || 'kotaru-api',
    monthlyHardCapUsd: decimal('KOTARU_MONTHLY_HARD_CAP_USD', 50, 0),
    freeMonthlyCapUsd: decimal('KOTARU_FREE_MONTHLY_CAP_USD', 15, 0),
    messageRetentionDays: integer('KOTARU_MESSAGE_RETENTION_DAYS', 30, 1, 3650),
    infraCostUsdPerTurn: decimal('KOTARU_INFRA_COST_USD_PER_TURN', 0.0003, 0),
    providers,
    providerSettings,
    corsOrigins: (env.KOTARU_CORS_ORIGINS ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    ...(wantsAuth && emailHashKey && emailEncryptionKey
      ? { auth: { appleClientIds, googleClientIds, emailHashKey, emailEncryptionKey, ...(passkeys ? { passkeys } : {}) } }
      : {}),
    trustProxy: flag('KOTARU_TRUST_PROXY'),
    trustedProxies: list('KOTARU_TRUSTED_PROXIES'),
    signupsPerDay: integer('KOTARU_SIGNUPS_PER_DAY', 30, 1, 100_000),
  };

  if (problems.length > 0) throw new ConfigError(problems);
  return config;
}

/** Formato: "kid1:base64,kid2:base64". La primera es la que firma; todas verifican. */
function parseKeys(name: string, raw: string, problems: string[]): SigningKey[] {
  if (!raw) return [];
  const keys: SigningKey[] = [];
  for (const [index, part] of raw.split(',').entries()) {
    const separator = part.indexOf(':');
    const kid = part.slice(0, separator).trim();
    const encoded = part.slice(separator + 1).trim();
    if (separator <= 0 || !kid || !encoded) {
      problems.push(`${name}: la clave ${index + 1} no tiene el formato kid:base64`);
      continue;
    }
    const secret = Buffer.from(encoded, 'base64');
    if (secret.byteLength < 32) {
      problems.push(`${name}: la clave "${kid}" tiene ${secret.byteLength} bytes; el minimo es 32`);
      continue;
    }
    keys.push({ kid, secret: new Uint8Array(secret) });
  }
  if (new Set(keys.map((k) => k.kid)).size !== keys.length) problems.push(`${name}: hay kids repetidos`);
  return keys;
}
