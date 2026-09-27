import { AuthApi, type AuthSession } from '@kotaru/client';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Servidor de cuentas. Se fija al compilar con `EXPO_PUBLIC_KOTARU_SERVER_URL` (Expo
 * inserta las variables `EXPO_PUBLIC_*` en el bundle; no es un secreto). Sin ella la app
 * solo ofrece la conexion de desarrollo.
 */
export const SERVER_URL: string | null = process.env.EXPO_PUBLIC_KOTARU_SERVER_URL?.trim() || null;

const REFRESH_KEY = 'kotaru.refresh';

/**
 * El token de renovacion vive solo en el almacen seguro del sistema (Keychain /
 * Keystore). En la web no hay almacen seguro: ahi la sesion dura lo que la pestaña.
 */
const secureStoreUsable = Platform.OS === 'ios' || Platform.OS === 'android';

async function loadRefreshToken(): Promise<string | null> {
  if (!secureStoreUsable) return null;
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}

function persist(session: AuthSession | null): void {
  if (!secureStoreUsable) return;
  const op = session
    ? SecureStore.setItemAsync(REFRESH_KEY, session.refreshToken, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY })
    : SecureStore.deleteItemAsync(REFRESH_KEY);
  // Si falla, la sesion sigue valiendo en memoria; solo habra que entrar otra vez al reabrir.
  op.catch(() => undefined);
}

/**
 * Crea el cliente de cuentas y, si hay una sesion guardada, la retoma. `onSignedOut` avisa
 * cuando la sesion deja de valer por cualquier motivo (cierre, borrado de cuenta, token
 * de renovacion rechazado).
 */
export async function openAccount(serverUrl: string, onSignedOut: () => void): Promise<{ auth: AuthApi; restored: boolean }> {
  const refreshToken = await loadRefreshToken();
  const auth = new AuthApi({
    baseUrl: serverUrl,
    ...(refreshToken ? { restore: { refreshToken } } : {}),
    onSession: (session) => {
      persist(session);
      if (!session) onSignedOut();
    },
  });
  return { auth, restored: refreshToken !== null };
}

export function appleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return Promise.resolve(false);
  return AppleAuthentication.isAvailableAsync().catch(() => false);
}

/** 32 bytes aleatorios en hex: el nonce que liga el id token a este intento de login. */
export function newRawNonce(): string {
  return Array.from(Crypto.getRandomBytes(32), (b) => b.toString(16).padStart(2, '0')).join('');
}

export class SignInCancelled extends Error {}

/**
 * Login con Apple. A Apple se le pasa el SHA-256 del nonce y al servidor el nonce tal
 * cual; el servidor comprueba que el token lleve ese hash. No se piden nombre ni correo:
 * la cuenta no los necesita (minimizacion de datos).
 */
export async function signInWithApple(auth: AuthApi): Promise<AuthSession> {
  const rawNonce = newRawNonce();
  const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({ requestedScopes: [], nonce: hashed });
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') throw new SignInCancelled();
    throw error;
  }
  if (!credential.identityToken) throw new Error('apple_no_identity_token');
  return auth.signInWithApple(credential.identityToken, rawNonce);
}
