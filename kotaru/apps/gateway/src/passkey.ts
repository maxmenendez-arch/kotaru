import { randomBytes } from 'node:crypto';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { AuthHttpError, openSession, type AuthDeps } from './auth.js';

/** Lo que las passkeys necesitan de la base. `PasskeyRepository` lo cumple. */
export interface PasskeyStore {
  createChallenge(input: {
    readonly kind: 'register' | 'login';
    readonly challenge: string;
    readonly userHandle: string | null;
    readonly expiresAtIso: string;
  }): Promise<string>;
  consumeChallenge(
    id: string,
    kind: 'register' | 'login',
    nowIso: string,
  ): Promise<{ readonly challenge: string; readonly userHandle: string | null } | null>;
  createAccountWithPasskey(input: {
    readonly userHandle: string;
    readonly credentialId: string;
    readonly publicKey: Uint8Array;
    readonly signCount: number;
    readonly transports: readonly string[];
    readonly backedUp: boolean;
  }): Promise<{ readonly accountId: string; readonly subjectId: string }>;
  findPasskey(credentialId: string): Promise<{
    readonly credentialId: string;
    readonly accountId: string;
    readonly subjectId: string;
    readonly userHandle: string;
    readonly publicKey: Uint8Array;
    readonly signCount: number;
    readonly transports: readonly string[];
  } | null>;
  markUsed(credentialId: string, signCount: number, nowIso: string): Promise<void>;
}

export interface PasskeyDeps {
  readonly store: PasskeyStore;
  /** Dominio de las passkeys (p. ej. kotaru.app): valen en ese dominio y sus subdominios. */
  readonly rpId: string;
  readonly rpName: string;
  /** Origenes desde los que se aceptan (https://app.kotaru.app, y las apps nativas). */
  readonly origins: readonly string[];
  /** Eventos de seguridad (sin datos personales): p. ej. una passkey con el contador atrasado. */
  readonly onSecurityEvent?: (event: string, fields: Record<string, unknown>) => void;
}

/** Tiempo para completar el dialogo de la passkey. */
const CHALLENGE_TTL_MS = 5 * 60_000;
const FLOW_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const B64URL = /^[A-Za-z0-9_-]+$/;

/**
 * Passkeys: POST /v1/auth/passkey/{register,login}/{options,verify}.
 *
 * Una passkey es una cuenta sin correo ni contrasena: el servidor inventa un user handle
 * aleatorio, el autenticador (Face ID, huella, PIN del equipo, gestor de contrasenas)
 * guarda la clave privada y el servidor solo la publica. Cada reto es de un solo uso,
 * caduca a los 5 minutos y se gasta aunque la verificacion falle.
 */
export async function handlePasskey(path: string, body: unknown, auth: AuthDeps, deps: PasskeyDeps): Promise<unknown> {
  const now = auth.now();
  const nowIso = new Date(now).toISOString();
  const expiresAtIso = new Date(now + CHALLENGE_TTL_MS).toISOString();

  if (path === '/v1/auth/passkey/register/options') {
    const userHandle = randomBytes(32);
    const options = await generateRegistrationOptions({
      rpName: deps.rpName,
      rpID: deps.rpId,
      userID: userHandle,
      // Lo que el gestor de passkeys muestra. Sin datos personales: el nombre y la fecha
      // bastan para distinguirla si hay varias.
      userName: `Kotaru ${nowIso.slice(0, 10)}`,
      userDisplayName: 'Kotaru',
      attestationType: 'none',
      authenticatorSelection: { residentKey: 'required', userVerification: 'required' },
      timeout: CHALLENGE_TTL_MS,
    });
    const flowId = await deps.store.createChallenge({
      kind: 'register',
      challenge: options.challenge,
      userHandle: options.user.id,
      expiresAtIso,
    });
    return { flowId, options };
  }

  if (path === '/v1/auth/passkey/login/options') {
    // Sin lista de credenciales: el autenticador ofrece las passkeys de Kotaru que tenga.
    const options = await generateAuthenticationOptions({
      rpID: deps.rpId,
      userVerification: 'required',
      timeout: CHALLENGE_TTL_MS,
    });
    const flowId = await deps.store.createChallenge({ kind: 'login', challenge: options.challenge, userHandle: null, expiresAtIso });
    return { flowId, options };
  }

  if (path !== '/v1/auth/passkey/register/verify' && path !== '/v1/auth/passkey/login/verify') {
    throw new AuthHttpError(404, 'not_found');
  }
  const { flowId, response } = (body ?? {}) as { flowId?: unknown; response?: unknown };
  if (typeof flowId !== 'string' || !FLOW_ID.test(flowId)) throw new AuthHttpError(400, 'invalid_body');
  if (!response || typeof response !== 'object' || JSON.stringify(response).length > 16_384) {
    throw new AuthHttpError(400, 'invalid_body');
  }
  const credentialId = (response as { id?: unknown }).id;
  if (typeof credentialId !== 'string' || credentialId.length > 1024 || !B64URL.test(credentialId)) {
    throw new AuthHttpError(400, 'invalid_body');
  }

  if (path === '/v1/auth/passkey/register/verify') {
    const flow = await deps.store.consumeChallenge(flowId, 'register', nowIso);
    if (!flow || !flow.userHandle) throw new AuthHttpError(401, 'invalid_challenge');
    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: response as RegistrationResponseJSON,
        expectedChallenge: flow.challenge,
        expectedOrigin: [...deps.origins],
        expectedRPID: deps.rpId,
        requireUserVerification: true,
      });
    } catch {
      throw new AuthHttpError(401, 'invalid_passkey');
    }
    if (!verification.verified) throw new AuthHttpError(401, 'invalid_passkey');
    const { credential, credentialBackedUp } = verification.registrationInfo;
    const account = await deps.store
      .createAccountWithPasskey({
        userHandle: flow.userHandle,
        credentialId: credential.id,
        publicKey: credential.publicKey,
        signCount: credential.counter,
        transports: (credential.transports ?? []).slice(0, 8),
        backedUp: credentialBackedUp,
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.message === 'passkey_already_registered') {
          throw new AuthHttpError(409, 'passkey_already_registered');
        }
        throw error;
      });
    return openSession({ ...account, created: true }, auth);
  }

  if (path === '/v1/auth/passkey/login/verify') {
    const flow = await deps.store.consumeChallenge(flowId, 'login', nowIso);
    if (!flow) throw new AuthHttpError(401, 'invalid_challenge');
    const stored = await deps.store.findPasskey(credentialId);
    // Misma respuesta para "no existe" y "firma mala": no se revela que passkeys hay.
    if (!stored) throw new AuthHttpError(401, 'invalid_passkey');
    const returnedHandle = (response as { response?: { userHandle?: unknown } }).response?.userHandle;
    if (returnedHandle !== undefined && returnedHandle !== stored.userHandle) throw new AuthHttpError(401, 'invalid_passkey');
    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: response as AuthenticationResponseJSON,
        expectedChallenge: flow.challenge,
        expectedOrigin: [...deps.origins],
        expectedRPID: deps.rpId,
        requireUserVerification: true,
        credential: {
          id: stored.credentialId,
          publicKey: stored.publicKey as Uint8Array<ArrayBuffer>,
          counter: stored.signCount,
          transports: stored.transports as never,
        },
      });
    } catch (error) {
      // Un contador que retrocede es senal de una passkey clonada: se registra para poder
      // investigarlo (sin el id de la cuenta ni de la credencial).
      if (error instanceof Error && /counter/i.test(error.message)) deps.onSecurityEvent?.('passkey_counter_regression', {});
      throw new AuthHttpError(401, 'invalid_passkey');
    }
    if (!verification.verified) throw new AuthHttpError(401, 'invalid_passkey');
    await deps.store.markUsed(stored.credentialId, verification.authenticationInfo.newCounter, nowIso);
    return openSession({ accountId: stored.accountId, subjectId: stored.subjectId, created: false }, auth);
  }

  throw new AuthHttpError(404, 'not_found');
}
