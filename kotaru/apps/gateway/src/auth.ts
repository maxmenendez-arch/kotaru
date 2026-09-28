import { createCipheriv, createHash, createHmac, randomBytes, randomUUID } from 'node:crypto';
import type { Locale } from '@kotaru/ai-contracts';
import { signAccessToken, signGrant, type SigningKey } from '@kotaru/gateway';
import { IdentityProviderUnavailable, IdTokenError, type IdTokenVerifier } from './id-token.js';
import { handlePasskey, type PasskeyDeps } from './passkey.js';
import { COMPANIONS, DEFAULT_COMPANION, isCompanion, PERSONAS } from '@kotaru/persona';

/** Lo que el servicio de cuentas necesita de la base. `AccountRepository` lo cumple. */
export interface AccountStore {
  findOrCreate(input: {
    readonly provider: 'apple' | 'google';
    readonly providerSubject: string;
    readonly emailHash: Uint8Array | null;
    readonly emailEncrypted: Uint8Array | null;
  }): Promise<{ readonly accountId: string; readonly subjectId: string; readonly created: boolean }>;
  accountForSubject(subjectId: string): Promise<string | null>;
  storeRefresh(accountId: string, tokenHash: Uint8Array, expiresAtIso: string, familyExpiresAtIso: string): Promise<void>;
  rotateRefresh(
    oldHash: Uint8Array,
    newHash: Uint8Array,
    newExpiresAtIso: string,
    nowIso: string,
  ): Promise<{ readonly accountId: string; readonly subjectId: string } | null>;
  revokeAll(accountId: string): Promise<number>;
  revokeFamilyOf(tokenHash: Uint8Array): Promise<boolean>;
  currentPlan(subjectId: string, nowIso: string): Promise<string>;
  /** Personaje de la conversacion si existe y es de este seudonimo; si no, null. */
  conversationCompanion(subjectId: string, conversationId: string): Promise<string | null>;
}

export interface AuthDeps {
  /** Si la persona activo el coqueteo sensual (Ajustes). Sin esto, nunca es sensual. */
  readonly sensualFlirting?: (subjectId: string) => Promise<boolean>;
  readonly accounts: AccountStore;
  readonly verifiers: { readonly apple?: IdTokenVerifier; readonly google?: IdTokenVerifier };
  /** 32 bytes. HMAC del correo para buscarlo sin guardarlo en claro. */
  readonly emailHashKey: Uint8Array;
  /** 32 bytes. AES-256-GCM del correo, para poder escribirle. */
  readonly emailEncryptionKey: Uint8Array;
  readonly accessKeys: readonly SigningKey[];
  readonly apiAudience: string;
  readonly grantKeys: readonly SigningKey[];
  readonly grantAudience: string;
  readonly monthlyHardCapUsd: number;
  readonly deleteAccount: (accountId: string) => Promise<{ readonly ok: boolean }>;
  readonly now: () => number;
  /** Passkeys (WebAuthn). Ausente si no se configuro el dominio: esas rutas dan 501. */
  readonly passkeys?: PasskeyDeps;
}

export class AuthHttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

const ACCESS_TTL_SECONDS = 15 * 60;
/** Sin usar la app durante 60 dias, hay que volver a iniciar sesion. */
const REFRESH_TTL_DAYS = 60;
/** Y como mucho cada 180 dias, aunque se use a diario: renovar no alarga para siempre. */
const SESSION_MAX_DAYS = 180;
const LOCALES: readonly Locale[] = ['en-US', 'es-US', 'es-ES', 'es-419'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Inicio de sesion (sin autenticar): POST /v1/auth/apple, /v1/auth/google, /v1/auth/refresh.
 * Devuelve la respuesta ya escrita; lanza AuthHttpError para errores con codigo.
 */
export async function handleLogin(path: string, body: unknown, deps: AuthDeps): Promise<unknown> {
  if (path === '/v1/auth/logout') {
    const token = (body as { refreshToken?: unknown } | null)?.refreshToken;
    if (typeof token !== 'string' || token.length < 20 || token.length > 200) throw new AuthHttpError(400, 'invalid_body');
    await deps.accounts.revokeFamilyOf(hash(token));
    return { ok: true };
  }

  if (path === '/v1/auth/refresh') {
    const token = (body as { refreshToken?: unknown } | null)?.refreshToken;
    if (typeof token !== 'string' || token.length < 20 || token.length > 200) throw new AuthHttpError(400, 'invalid_body');
    const next = randomBytes(32).toString('base64url');
    const ref = await deps.accounts.rotateRefresh(hash(token), hash(next), refreshExpiry(deps), iso(deps));
    if (!ref) throw new AuthHttpError(401, 'invalid_refresh');
    return session(ref.subjectId, next, deps, false);
  }

  if (path.startsWith('/v1/auth/passkey/')) {
    if (!deps.passkeys) throw new AuthHttpError(501, 'provider_not_configured');
    return handlePasskey(path, body, deps, deps.passkeys);
  }

  const provider = path === '/v1/auth/apple' ? 'apple' : path === '/v1/auth/google' ? 'google' : null;
  if (!provider) throw new AuthHttpError(404, 'not_found');
  const verifier = deps.verifiers[provider];
  if (!verifier) throw new AuthHttpError(501, 'provider_not_configured');

  const { idToken, nonce } = (body ?? {}) as { idToken?: unknown; nonce?: unknown };
  if (typeof idToken !== 'string' || idToken.length > 8192) throw new AuthHttpError(400, 'invalid_body');
  // El nonce ata el id token a ESTE intento de login: un token interceptado (un log, un
  // cliente web comprometido) no sirve para abrir otra sesion sin el nonce original.
  if (typeof nonce !== 'string' || nonce.length < 16 || nonce.length > 128) throw new AuthHttpError(400, 'nonce_required');

  let identity;
  try {
    identity = await verifier.verify(idToken);
  } catch (error) {
    if (error instanceof IdTokenError) throw new AuthHttpError(401, 'invalid_id_token');
    if (error instanceof IdentityProviderUnavailable) throw new AuthHttpError(503, 'provider_unavailable');
    throw error;
  }
  // Apple firma el SHA-256 del nonce que le pasa la app; Google firma el nonce tal cual.
  const expectedNonce = provider === 'apple' ? createHash('sha256').update(nonce).digest('hex') : nonce;
  if (identity.nonce !== expectedNonce) throw new AuthHttpError(401, 'invalid_id_token');

  const account = await deps.accounts.findOrCreate({
    provider,
    providerSubject: identity.subject,
    emailHash: identity.email ? createHmac('sha256', deps.emailHashKey).update(identity.email).digest() : null,
    emailEncrypted: identity.email
      ? encrypt(identity.email, deps.emailEncryptionKey, `${provider}:${identity.subject}`)
      : null,
  });
  return openSession(account, deps);
}

/** Abre una sesion nueva (una familia de tokens de renovacion) para una cuenta. */
export async function openSession(
  account: { readonly accountId: string; readonly subjectId: string; readonly created: boolean },
  deps: AuthDeps,
): Promise<unknown> {
  const refresh = randomBytes(32).toString('base64url');
  await deps.accounts.storeRefresh(
    account.accountId,
    hash(refresh),
    refreshExpiry(deps),
    new Date(deps.now() + SESSION_MAX_DAYS * 86_400_000).toISOString(),
  );
  return session(account.subjectId, refresh, deps, account.created);
}

/** Personajes con coqueteo (manuales de Nova y Rio); Luna nunca coquetea. */
const FLIRTING_COMPANIONS: ReadonlySet<string> = new Set(COMPANIONS.filter((slug) => PERSONAS[slug].flirts));

/** POST /v1/session/grant (autenticado): un grant de voz de un solo uso. */
export async function issueGrant(subjectId: string, body: unknown, deps: AuthDeps): Promise<unknown> {
  const input = (body ?? {}) as { conversationId?: unknown; locale?: unknown; companion?: unknown };
  const locale = input.locale === undefined ? 'es-419' : input.locale;
  if (typeof locale !== 'string' || !LOCALES.includes(locale as Locale)) throw new AuthHttpError(400, 'invalid_locale');
  const companion = input.companion === undefined ? DEFAULT_COMPANION : input.companion;
  if (!isCompanion(companion)) throw new AuthHttpError(400, 'invalid_companion');

  let conversationId: string;
  if (input.conversationId === undefined) {
    conversationId = randomUUID();
  } else {
    if (typeof input.conversationId !== 'string' || !UUID.test(input.conversationId)) throw new AuthHttpError(400, 'invalid_conversation');
    // Retomar solo conversaciones propias. Una que no existe todavia no se acepta del
    // cliente: las nuevas las numera el servidor.
    const owner = await deps.accounts.conversationCompanion(subjectId, input.conversationId);
    if (owner === null) throw new AuthHttpError(404, 'not_found');
    // Cada conversacion es con un personaje: retomarla con otro mezclaria su historial.
    if (owner !== companion) throw new AuthHttpError(409, 'companion_mismatch');
    conversationId = input.conversationId;
  }

  const plan = await deps.accounts.currentPlan(subjectId, iso(deps));
  // Solo con los personajes que coquetean y si la persona lo activo. Luna, nunca.
  const sensual = FLIRTING_COMPANIONS.has(companion) && (await deps.sensualFlirting?.(subjectId)) === true;
  const grant = signGrant(
    {
      subjectId,
      conversationId,
      companionId: companion,
      ...(sensual ? { intimacy: 'sensual' as const } : {}),
      plan,
      region: 'us',
      locale: locale as Locale,
      sensitivity: 'standard',
      quality: 'balanced',
      budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: deps.monthlyHardCapUsd, hardCapUsd: deps.monthlyHardCapUsd },
      maxSessionSeconds: 1800,
      aud: deps.grantAudience,
    },
    deps.grantKeys[0]!,
    { nowSeconds: Math.floor(deps.now() / 1000) },
  );
  return { grant, conversationId };
}

/**
 * DELETE /v1/account (autenticado): borrado completo, requisito de las tiendas. Revoca
 * los tokens de renovacion; los de acceso caducan solos en 15 minutos y lo que escriban
 * lo barre la lapida del borrado.
 */
export async function deleteOwnAccount(subjectId: string, deps: AuthDeps): Promise<void> {
  const accountId = await deps.accounts.accountForSubject(subjectId);
  if (!accountId) throw new AuthHttpError(404, 'not_found');
  await deps.accounts.revokeAll(accountId);
  const result = await deps.deleteAccount(accountId);
  // Dos borrados simultaneos: el segundo ya no encuentra la cuenta. Para quien lo pidio,
  // el resultado es el que queria.
  if (!result.ok && (result as { reason?: string }).reason !== 'account_not_found') {
    throw new AuthHttpError(500, 'deletion_failed');
  }
}

function session(subjectId: string, refreshToken: string, deps: AuthDeps, created: boolean) {
  const accessToken = signAccessToken({ sub: subjectId, aud: deps.apiAudience }, deps.accessKeys[0]!, {
    nowSeconds: Math.floor(deps.now() / 1000),
    ttlSeconds: ACCESS_TTL_SECONDS,
  });
  return { accessToken, expiresIn: ACCESS_TTL_SECONDS, refreshToken, newAccount: created };
}

function hash(token: string): Uint8Array {
  return createHash('sha256').update(token).digest();
}

function refreshExpiry(deps: AuthDeps): string {
  return new Date(deps.now() + REFRESH_TTL_DAYS * 86_400_000).toISOString();
}

function iso(deps: AuthDeps): string {
  return new Date(deps.now()).toISOString();
}

/**
 * version (1) | iv (12) | tag (16) | texto cifrado. El login (proveedor:sub) va como dato
 * autenticado: un cifrado copiado a otra fila no se descifra.
 */
function encrypt(text: string, key: Uint8Array, boundTo: string): Uint8Array {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(boundTo, 'utf8'));
  const body = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return Buffer.concat([Buffer.from([1]), iv, cipher.getAuthTag(), body]);
}

