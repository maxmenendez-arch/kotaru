import { createPublicKey, verify, type JsonWebKey, type KeyObject } from 'node:crypto';

/**
 * Verificacion de los id tokens de Apple y Google (JWT firmados con RS256).
 *
 * Se hace a mano con node:crypto en vez de con una libreria para que quede a la vista
 * cada comprobacion que importa:
 * - solo RS256 (nada de `alg: none` ni HS256 con la clave publica como secreto);
 * - la clave se busca por `kid` en el JWKS oficial del proveedor, con cache;
 * - emisor, audiencia (nuestros client ids), caducidad y fecha de emision.
 */
export interface IdTokenIssuer {
  readonly name: 'apple' | 'google';
  readonly jwksUrl: string;
  readonly issuers: readonly string[];
  /** Nuestros client ids en ese proveedor (bundle id de iOS, services id, client id web/Android). */
  readonly audiences: readonly string[];
}

export const APPLE: Omit<IdTokenIssuer, 'audiences'> = {
  name: 'apple',
  jwksUrl: 'https://appleid.apple.com/auth/keys',
  issuers: ['https://appleid.apple.com'],
};

export const GOOGLE: Omit<IdTokenIssuer, 'audiences'> = {
  name: 'google',
  jwksUrl: 'https://www.googleapis.com/oauth2/v3/certs',
  issuers: ['https://accounts.google.com', 'accounts.google.com'],
};

export interface VerifiedIdentity {
  readonly provider: 'apple' | 'google';
  readonly subject: string;
  /** Solo si el proveedor dice que esta verificado. */
  readonly email: string | null;
  /** El nonce que firmo el proveedor, para atar el token a este intento de login. */
  readonly nonce: string | null;
}

/** El proveedor no responde (JWKS caido o lento). No es culpa del token: es un 503. */
export class IdentityProviderUnavailable extends Error {
  constructor(readonly provider: string) {
    super(`${provider}: claves no disponibles`);
    this.name = 'IdentityProviderUnavailable';
  }
}

export class IdTokenError extends Error {
  constructor(readonly reason: string) {
    super(`id token invalido: ${reason}`);
    this.name = 'IdTokenError';
  }
}

const SKEW_SECONDS = 60;
const JWKS_TTL_MS = 60 * 60 * 1000;
const JWKS_MIN_REFRESH_MS = 60 * 1000;
const JWKS_TIMEOUT_MS = 3000;

export class IdTokenVerifier {
  readonly #issuer: IdTokenIssuer;
  readonly #fetch: typeof fetch;
  readonly #now: () => number;
  #keys = new Map<string, KeyObject>();
  /** Ultimo intento de carga, haya salido bien o mal: marca el ritmo de reintentos. */
  #attemptedAt = 0;
  /** Ultima carga buena: marca la caducidad de la cache. */
  #loadedAt = 0;
  #loading: Promise<void> | null = null;

  constructor(issuer: IdTokenIssuer, options: { readonly fetch?: typeof fetch; readonly now?: () => number } = {}) {
    if (issuer.audiences.length === 0) throw new Error(`${issuer.name}: sin client ids configurados`);
    this.#issuer = issuer;
    this.#fetch = options.fetch ?? fetch;
    this.#now = options.now ?? Date.now;
  }

  async verify(token: string): Promise<VerifiedIdentity> {
    const parts = token.split('.');
    if (parts.length !== 3) throw new IdTokenError('malformed');
    const [h, p, sig] = parts as [string, string, string];

    let header: { alg?: unknown; kid?: unknown };
    let claims: Record<string, unknown>;
    try {
      header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8')) as typeof header;
      claims = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')) as Record<string, unknown>;
    } catch {
      throw new IdTokenError('malformed');
    }
    if (header.alg !== 'RS256') throw new IdTokenError('alg_not_allowed');
    if (typeof header.kid !== 'string') throw new IdTokenError('no_kid');

    const key = await this.#key(header.kid);
    const valid = verify('RSA-SHA256', Buffer.from(`${h}.${p}`), key, Buffer.from(sig, 'base64url'));
    if (!valid) throw new IdTokenError('bad_signature');

    const nowSeconds = Math.floor(this.#now() / 1000);
    if (typeof claims.iss !== 'string' || !this.#issuer.issuers.includes(claims.iss)) throw new IdTokenError('wrong_issuer');
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!aud.some((a) => typeof a === 'string' && this.#issuer.audiences.includes(a))) throw new IdTokenError('wrong_audience');
    if (typeof claims.exp !== 'number' || nowSeconds > claims.exp + SKEW_SECONDS) throw new IdTokenError('expired');
    if (typeof claims.iat === 'number' && claims.iat > nowSeconds + SKEW_SECONDS) throw new IdTokenError('not_yet_valid');
    if (typeof claims.sub !== 'string' || claims.sub.length === 0 || claims.sub.length > 255) throw new IdTokenError('no_subject');

    // Apple manda email_verified como texto "true"; Google como booleano.
    const verified = claims.email_verified === true || claims.email_verified === 'true';
    const email = verified && typeof claims.email === 'string' ? claims.email.trim().toLowerCase() : null;
    const nonce = typeof claims.nonce === 'string' ? claims.nonce : null;
    return { provider: this.#issuer.name, subject: claims.sub, email, nonce };
  }

  async #key(kid: string): Promise<KeyObject> {
    const now = this.#now();
    const fresh = now - this.#loadedAt < JWKS_TTL_MS;
    const cached = this.#keys.get(kid);
    if (cached && fresh) return cached;

    // Recarga si la cache vencio o el kid es desconocido (el proveedor pudo rotar), pero
    // como mucho una vez por minuto y UNA sola a la vez: tokens con kids inventados o un
    // proveedor caido no se convierten en un martillo contra Apple o Google.
    if (now - this.#attemptedAt >= JWKS_MIN_REFRESH_MS || (!fresh && this.#keys.size === 0)) {
      this.#loading ??= this.#load().finally(() => {
        this.#loading = null;
      });
    }
    if (this.#loading) await this.#loading.catch(() => undefined);

    const key = this.#keys.get(kid);
    if (key) return key; // aunque la recarga fallara: una clave vieja valida sigue valiendo
    if (this.#keys.size === 0) throw new IdentityProviderUnavailable(this.#issuer.name);
    throw new IdTokenError('unknown_kid');
  }

  async #load(): Promise<void> {
    this.#attemptedAt = this.#now();
    let body: { keys?: (JsonWebKey & { kid?: string; kty?: string; use?: string })[] };
    try {
      const response = await this.#fetch(this.#issuer.jwksUrl, { signal: AbortSignal.timeout(JWKS_TIMEOUT_MS) });
      if (!response.ok) throw new Error(`http ${response.status}`);
      body = (await response.json()) as typeof body;
    } catch {
      throw new IdentityProviderUnavailable(this.#issuer.name);
    }
    const keys = new Map<string, KeyObject>();
    for (const jwk of body.keys ?? []) {
      if (jwk.kty !== 'RSA' || typeof jwk.kid !== 'string' || (jwk.use !== undefined && jwk.use !== 'sig')) continue;
      try {
        keys.set(jwk.kid, createPublicKey({ key: jwk, format: 'jwk' }));
      } catch {
        // Una clave mal formada no invalida las demas.
      }
    }
    if (keys.size === 0) throw new IdentityProviderUnavailable(this.#issuer.name);
    this.#keys = keys;
    this.#loadedAt = this.#now();
  }
}
