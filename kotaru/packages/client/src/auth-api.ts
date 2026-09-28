import { ApiError } from './memory-api.js';

/** Opciones de WebAuthn en JSON (PublicKeyCredentialCreationOptionsJSON o ...RequestOptionsJSON). */
export type PasskeyOptionsJson = Record<string, unknown> & { readonly challenge: string };

export interface AuthSession {
  readonly accessToken: string;
  /** Epoch ms en que caduca el token de acceso. */
  readonly accessExpiresAt: number;
  readonly refreshToken: string;
  readonly newAccount: boolean;
}

/**
 * Cuentas: login con el id token de Apple o Google, renovacion, grant de voz y borrado.
 *
 * `AuthApi` guarda la sesion en memoria y renueva sola el token de acceso un minuto antes
 * de que caduque. Guardar el token de renovacion entre aperturas de la app es cosa de la
 * app, en el almacen seguro del sistema (Keychain / Keystore), nunca en almacenamiento
 * normal: `onSession` avisa cada vez que cambia para que la app lo persista.
 */
export class AuthApi {
  readonly #baseUrl: string;
  readonly #fetch: typeof fetch;
  readonly #now: () => number;
  readonly #onSession: (session: AuthSession | null) => void;
  #session: AuthSession | null = null;
  #refreshing: Promise<AuthSession> | null = null;
  /** Sube al cerrar sesion: una renovacion que llegue tarde no revive la sesion cerrada. */
  #generation = 0;

  constructor(options: {
    readonly baseUrl: string;
    readonly fetch?: typeof fetch;
    readonly now?: () => number;
    readonly onSession?: (session: AuthSession | null) => void;
    /** Sesion guardada de una apertura anterior. */
    readonly restore?: { readonly refreshToken: string };
  }) {
    this.#baseUrl = options.baseUrl.replace(/\/$/, '');
    // `fetch` del navegador exige llamarse sin otro `this` ("Illegal invocation" si se guarda
    // como metodo de la clase y se llama como this.#fetch(...)).
    this.#fetch = options.fetch ?? ((input, init) => fetch(input, init));
    this.#now = options.now ?? Date.now;
    this.#onSession = options.onSession ?? (() => undefined);
    if (options.restore) {
      this.#session = { accessToken: '', accessExpiresAt: 0, refreshToken: options.restore.refreshToken, newAccount: false };
    }
  }

  get signedIn(): boolean {
    return this.#session !== null;
  }

  /**
   * `rawNonce`: el valor aleatorio que la app genero para este login. A Apple se le pasa su
   * SHA-256; a Google, tal cual. El servidor comprueba que el token lo lleve.
   */
  signInWithApple(idToken: string, rawNonce: string): Promise<AuthSession> {
    return this.#login('/v1/auth/apple', idToken, rawNonce);
  }

  signInWithGoogle(idToken: string, rawNonce: string): Promise<AuthSession> {
    return this.#login('/v1/auth/google', idToken, rawNonce);
  }

  /**
   * Passkeys, en dos pasos cada una: el servidor da las opciones (con un reto de un solo
   * uso), el sistema operativo o el navegador firman con la passkey, y el servidor lo
   * verifica. `options` y `response` son el JSON estandar de WebAuthn; la llamada al
   * autenticador es cosa de la app (en la web, navigator.credentials).
   */
  passkeyRegistrationOptions(): Promise<{ flowId: string; options: PasskeyOptionsJson }> {
    return this.#call('POST', '/v1/auth/passkey/register/options', {});
  }

  completePasskeyRegistration(flowId: string, response: unknown): Promise<AuthSession> {
    return this.#passkey('/v1/auth/passkey/register/verify', flowId, response);
  }

  passkeyLoginOptions(): Promise<{ flowId: string; options: PasskeyOptionsJson }> {
    return this.#call('POST', '/v1/auth/passkey/login/options', {});
  }

  completePasskeyLogin(flowId: string, response: unknown): Promise<AuthSession> {
    return this.#passkey('/v1/auth/passkey/login/verify', flowId, response);
  }

  async #passkey(path: string, flowId: string, response: unknown): Promise<AuthSession> {
    const generation = ++this.#generation;
    return this.#accept(await this.#call('POST', path, { flowId, response }), generation);
  }

  /** Token de acceso vigente; lo renueva si falta menos de un minuto. */
  async accessToken(): Promise<string> {
    const session = this.#session;
    if (!session) throw new ApiError(401, 'signed_out');
    if (session.accessToken && session.accessExpiresAt - this.#now() > 60_000) return session.accessToken;
    // Una sola renovacion a la vez: el token de renovacion rota, y dos a la vez dejarian
    // una de ellas con un token ya gastado.
    this.#refreshing ??= this.#refresh(session.refreshToken).finally(() => {
      this.#refreshing = null;
    });
    return (await this.#refreshing).accessToken;
  }

  /** Un grant de voz nuevo (son de un solo uso). */
  async voiceGrant(
    options: { readonly conversationId?: string; readonly locale?: string; readonly companion?: string } = {},
  ): Promise<{ grant: string; conversationId: string }> {
    return this.#call('POST', '/v1/session/grant', options, await this.accessToken());
  }

  /** Borra la cuenta y todos sus datos. No se puede deshacer. */
  async deleteAccount(): Promise<void> {
    await this.#call('DELETE', '/v1/account', undefined, await this.accessToken());
    this.#set(null);
  }

  /** Cierra la sesion aqui y en el servidor (el token de renovacion deja de valer). */
  async signOut(): Promise<void> {
    const refreshToken = this.#session?.refreshToken;
    this.#set(null);
    if (refreshToken) await this.#call('POST', '/v1/auth/logout', { refreshToken }).catch(() => undefined);
  }

  async #login(path: string, idToken: string, nonce: string): Promise<AuthSession> {
    const generation = ++this.#generation;
    return this.#accept(await this.#call('POST', path, { idToken, nonce }), generation);
  }

  async #refresh(refreshToken: string): Promise<AuthSession> {
    const generation = this.#generation;
    try {
      return this.#accept(await this.#call('POST', '/v1/auth/refresh', { refreshToken }), generation);
    } catch (error) {
      // Renovacion rechazada: la sesion ya no vale (cuenta borrada, token robado y usado).
      if (error instanceof ApiError && error.status === 401 && generation === this.#generation) this.#set(null);
      throw error;
    }
  }

  #accept(
    body: { accessToken: string; expiresIn: number; refreshToken: string; newAccount: boolean },
    generation: number,
  ): AuthSession {
    if (generation !== this.#generation) throw new ApiError(401, 'signed_out');
    const session: AuthSession = {
      accessToken: body.accessToken,
      accessExpiresAt: this.#now() + body.expiresIn * 1000,
      refreshToken: body.refreshToken,
      newAccount: body.newAccount,
    };
    this.#set(session);
    return session;
  }

  #set(session: AuthSession | null): void {
    if (session === null) this.#generation += 1;
    this.#session = session;
    this.#onSession(session);
  }

  async #call<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
    const response = await this.#fetch(`${this.#baseUrl}${path}`, {
      method,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // Una pagina de error de un proxy (HTML) no es JSON.
      if (response.ok) throw new ApiError(response.status, 'invalid_response');
    }
    if (!response.ok) throw new ApiError(response.status, (data as { error?: string } | null)?.error ?? 'unknown');
    return data as T;
  }
}
