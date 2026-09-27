import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { BudgetGrant, Locale, QualityTier, Region, Sensitivity } from '@kotaru/ai-contracts';

/**
 * Grant de sesion de voz.
 *
 * Autoriza a ABRIR una conexion de tiempo real, no a consumir sin limite: es de vida
 * corta a proposito, para que un grant filtrado en un log o en el portapapeles caduque
 * antes de servir para algo.
 *
 * Invariante de privacidad: aqui NO va el correo, el nombre ni ningun identificador
 * de la persona. Solo `subjectId`, que es un seudonimo estable por usuario. El
 * gateway no necesita saber quien es alguien para servirle voz.
 */
export interface SessionGrant {
  readonly subjectId: string;
  readonly conversationId: string;
  readonly plan: string;
  readonly region: Region;
  readonly locale: Locale;
  readonly sensitivity: Sensitivity;
  readonly quality: QualityTier;
  readonly budget: BudgetGrant;
  /** Segundos maximos de sesion, independientes del presupuesto. */
  readonly maxSessionSeconds: number;
  /** Emitido en, epoch en segundos. */
  readonly iat: number;
  /** Expira en, epoch en segundos. */
  readonly exp: number;
  /** Identificador unico del grant, para impedir que se reutilice. */
  readonly jti: string;
  /** Para quien es este grant. Un grant de staging no abre produccion. */
  readonly aud: string;
}

export type GrantRejection =
  | 'malformed'
  | 'bad_signature'
  | 'expired'
  | 'not_yet_valid'
  | 'replayed'
  | 'wrong_audience';

export type GrantVerification =
  | { readonly ok: true; readonly grant: SessionGrant }
  | { readonly ok: false; readonly reason: GrantRejection };

export interface SigningKey {
  /** Identificador de la clave, para poder rotarla sin invalidar todo de golpe. */
  readonly kid: string;
  readonly secret: Uint8Array;
}

const MIN_SECRET_BYTES = 32;
const DEFAULT_TTL_SECONDS = 120;
const DEFAULT_SKEW_SECONDS = 30;

export class WeakSigningKeyError extends Error {
  constructor(bytes: number) {
    super(
      `La clave de firma tiene ${bytes} bytes; el minimo es ${MIN_SECRET_BYTES}. ` +
        'Una clave corta convierte la firma en decoracion.',
    );
    this.name = 'WeakSigningKeyError';
  }
}

export function signGrant(
  claims: Omit<SessionGrant, 'iat' | 'exp' | 'jti'>,
  key: SigningKey,
  options: { readonly nowSeconds: number; readonly ttlSeconds?: number },
): string {
  if (key.secret.byteLength < MIN_SECRET_BYTES) {
    throw new WeakSigningKeyError(key.secret.byteLength);
  }

  const iat = Math.floor(options.nowSeconds);
  const grant: SessionGrant = {
    ...claims,
    iat,
    exp: iat + (options.ttlSeconds ?? DEFAULT_TTL_SECONDS),
    jti: randomUUID(),
  };

  const header = b64url(JSON.stringify({ kid: key.kid, alg: 'HS256' }));
  const body = b64url(JSON.stringify(grant));
  const signature = sign(`${header}.${body}`, key.secret);
  return `${header}.${body}.${signature}`;
}

export interface VerifyOptions {
  readonly nowSeconds: number;
  readonly audience: string;
  readonly skewSeconds?: number;
  readonly replayGuard?: ReplayGuard;
}

export function verifyGrant(
  token: string,
  keys: readonly SigningKey[],
  options: VerifyOptions,
): GrantVerification {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed' };
  const [header, body, signature] = parts as [string, string, string];

  let kid: string;
  try {
    const parsed = JSON.parse(fromB64url(header)) as { kid?: unknown; typ?: unknown };
    if (typeof parsed.kid !== 'string') return { ok: false, reason: 'malformed' };
    // Un grant no lleva `typ`. Si lo lleva, es otro tipo de token (por ejemplo uno de
    // acceso a la API) y no abre una sesion de voz aunque la firma sea valida.
    if (parsed.typ !== undefined) return { ok: false, reason: 'malformed' };
    kid = parsed.kid;
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const key = keys.find((candidate) => candidate.kid === kid);
  if (!key) return { ok: false, reason: 'bad_signature' };

  const expected = sign(`${header}.${body}`, key.secret);
  if (!constantTimeEquals(signature, expected)) return { ok: false, reason: 'bad_signature' };

  let grant: SessionGrant;
  try {
    grant = JSON.parse(fromB64url(body)) as SessionGrant;
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (typeof grant.exp !== 'number' || typeof grant.iat !== 'number' || typeof grant.jti !== 'string') {
    return { ok: false, reason: 'malformed' };
  }

  const skew = options.skewSeconds ?? DEFAULT_SKEW_SECONDS;
  if (grant.aud !== options.audience) return { ok: false, reason: 'wrong_audience' };
  if (options.nowSeconds > grant.exp + skew) return { ok: false, reason: 'expired' };
  if (options.nowSeconds < grant.iat - skew) return { ok: false, reason: 'not_yet_valid' };

  if (options.replayGuard && !options.replayGuard.claim(grant.jti, grant.exp)) {
    return { ok: false, reason: 'replayed' };
  }

  return { ok: true, grant };
}

/**
 * Donde se reclama un jti. `ReplayGuard` lo cumple en memoria; en produccion lo cumple
 * una tabla (`GrantRepository` de @kotaru/persistence), que sobrevive a un reinicio y es
 * correcta con varias instancias de gateway. La operacion es una sola y atomica.
 */
export interface GrantClaimStore {
  claim(jti: string, expSeconds: number): boolean | Promise<boolean>;
}

/**
 * Verifica el grant y, solo si es valido, reclama su jti en el almacen.
 *
 * El orden importa: reclamar antes de verificar dejaria que un token falsificado gastara
 * el jti de uno legitimo.
 */
export async function verifyAndClaimGrant(
  token: string,
  keys: readonly SigningKey[],
  options: Omit<VerifyOptions, 'replayGuard'> & { readonly claims: GrantClaimStore },
): Promise<GrantVerification> {
  const { claims, ...verifyOptions } = options;
  const verification = verifyGrant(token, keys, verifyOptions);
  if (!verification.ok) return verification;
  const claimed = await claims.claim(verification.grant.jti, verification.grant.exp);
  return claimed ? verification : { ok: false, reason: 'replayed' };
}

/**
 * Impide que un grant se use dos veces. En memoria a proposito: con varias instancias
 * de gateway esto debe vivir en Redis, y el reemplazo es directo porque la interfaz
 * es una sola operacion atomica de "reclamar".
 */
export class ReplayGuard {
  readonly #seen = new Map<string, number>();

  claim(jti: string, expSeconds: number): boolean {
    if (this.#seen.has(jti)) return false;
    this.#seen.set(jti, expSeconds);
    return true;
  }

  /** Descarta los jti ya caducados; no hay nada que replayear con ellos. */
  prune(nowSeconds: number): void {
    for (const [jti, exp] of this.#seen) {
      if (exp < nowSeconds) this.#seen.delete(jti);
    }
  }

  get size(): number {
    return this.#seen.size;
  }
}

function sign(payload: string, secret: Uint8Array): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function b64url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromB64url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}
