import { createHmac, timingSafeEqual } from 'node:crypto';
import { WeakSigningKeyError, type SigningKey } from './grants.js';

/**
 * Token de acceso a la API HTTP (centro de memoria, exportacion, ajustes).
 *
 * Es distinto del grant de sesion a proposito:
 * - el grant abre UNA conexion de voz y se quema al usarse;
 * - el token de acceso sirve para varias llamadas durante unos minutos.
 *
 * Para que uno no pueda hacerse pasar por el otro, la cabecera lleva `typ` y cada
 * verificador exige el suyo. Ademas conviene firmarlos con claves distintas
 * (KOTARU_ACCESS_KEYS frente a KOTARU_GRANT_KEYS).
 */
export interface AccessClaims {
  /** El seudonimo del usuario. Nunca el correo ni el nombre. */
  readonly sub: string;
  readonly aud: string;
  readonly iat: number;
  readonly exp: number;
}

export type AccessRejection = 'malformed' | 'bad_signature' | 'expired' | 'not_yet_valid' | 'wrong_audience';

export type AccessVerification =
  | { readonly ok: true; readonly claims: AccessClaims }
  | { readonly ok: false; readonly reason: AccessRejection };

export const ACCESS_TOKEN_TYPE = 'kotaru-access';
const MIN_SECRET_BYTES = 32;
const DEFAULT_TTL_SECONDS = 900;
const SKEW_SECONDS = 30;

export function signAccessToken(
  claims: { readonly sub: string; readonly aud: string },
  key: SigningKey,
  options: { readonly nowSeconds: number; readonly ttlSeconds?: number },
): string {
  if (key.secret.byteLength < MIN_SECRET_BYTES) throw new WeakSigningKeyError(key.secret.byteLength);
  const iat = Math.floor(options.nowSeconds);
  const body: AccessClaims = { sub: claims.sub, aud: claims.aud, iat, exp: iat + (options.ttlSeconds ?? DEFAULT_TTL_SECONDS) };
  const header = b64url(JSON.stringify({ kid: key.kid, alg: 'HS256', typ: ACCESS_TOKEN_TYPE }));
  const payload = b64url(JSON.stringify(body));
  return `${header}.${payload}.${hmac(`${header}.${payload}`, key.secret)}`;
}

export function verifyAccessToken(
  token: string,
  keys: readonly SigningKey[],
  options: { readonly nowSeconds: number; readonly audience: string },
): AccessVerification {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed' };
  const [header, payload, signature] = parts as [string, string, string];

  let parsedHeader: { kid?: unknown; typ?: unknown };
  try {
    parsedHeader = JSON.parse(fromB64url(header)) as { kid?: unknown; typ?: unknown };
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (typeof parsedHeader.kid !== 'string' || parsedHeader.typ !== ACCESS_TOKEN_TYPE) {
    return { ok: false, reason: 'malformed' };
  }

  const key = keys.find((k) => k.kid === parsedHeader.kid);
  if (!key) return { ok: false, reason: 'bad_signature' };
  if (!equals(signature, hmac(`${header}.${payload}`, key.secret))) return { ok: false, reason: 'bad_signature' };

  let claims: AccessClaims;
  try {
    claims = JSON.parse(fromB64url(payload)) as AccessClaims;
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (typeof claims.sub !== 'string' || typeof claims.exp !== 'number' || typeof claims.iat !== 'number') {
    return { ok: false, reason: 'malformed' };
  }
  if (claims.aud !== options.audience) return { ok: false, reason: 'wrong_audience' };
  if (options.nowSeconds > claims.exp + SKEW_SECONDS) return { ok: false, reason: 'expired' };
  if (options.nowSeconds < claims.iat - SKEW_SECONDS) return { ok: false, reason: 'not_yet_valid' };
  return { ok: true, claims };
}

function hmac(data: string, secret: Uint8Array): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function b64url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromB64url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}
