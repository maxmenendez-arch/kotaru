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
  readonly messageRetentionDays: number;
  readonly infraCostUsdPerTurn: number;
  /** Proveedores de IA habilitados: mock, assemblyai, gemini, polly. */
  readonly providers: readonly string[];
  readonly providerSettings: ProviderSettings;
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
}

const KNOWN_PROVIDERS = new Set(['mock', 'assemblyai', 'gemini', 'polly']);

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
  };
  if (providers.includes('polly') && !(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY)) {
    problems.push('polly necesita AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY');
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
    messageRetentionDays: integer('KOTARU_MESSAGE_RETENTION_DAYS', 30, 1, 3650),
    infraCostUsdPerTurn: decimal('KOTARU_INFRA_COST_USD_PER_TURN', 0.0003, 0),
    providers,
    providerSettings,
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
