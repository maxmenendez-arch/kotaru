import { AuthApi, type AuthSession } from '@kotaru/client';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { appleIdToken } from './apple';

/**
 * Servidor de cuentas. Se fija al compilar con `EXPO_PUBLIC_KOTARU_SERVER_URL` (Expo
 * inserta las variables `EXPO_PUBLIC_*` en el bundle; no es un secreto). Sin ella la app
 * solo ofrece la conexion de desarrollo.
 */
export const SERVER_URL: string | null = process.env.EXPO_PUBLIC_KOTARU_SERVER_URL?.trim() || null;

const REFRESH_KEY = 'kotaru.refresh';

/**
 * Donde se guarda el token de renovacion entre aperturas:
 * - iOS/Android: solo en el almacen seguro del sistema (Keychain / Keystore).
 * - Web: en sessionStorage, que muere al cerrar la pestaña. Guardarlo mas tiempo en el
 *   navegador (localStorage) lo dejaria al alcance de cualquier script que lograra
 *   inyectarse; la CSP de la webapp lo dificulta, pero no se apuesta a ella.
 */
const secureStoreUsable = Platform.OS === 'ios' || Platform.OS === 'android';

function webStore(): Storage | null {
  try {
    return Platform.OS === 'web' ? globalThis.sessionStorage ?? null : null;
  } catch {
    return null;
  }
}

async function loadRefreshToken(): Promise<string | null> {
  try {
    if (secureStoreUsable) return await SecureStore.getItemAsync(REFRESH_KEY);
    return webStore()?.getItem(REFRESH_KEY) ?? null;
  } catch {
    return null;
  }
}

function persist(session: AuthSession | null): void {
  if (!secureStoreUsable) {
    try {
      const store = webStore();
      if (session) store?.setItem(REFRESH_KEY, session.refreshToken);
      else store?.removeItem(REFRESH_KEY);
    } catch {
      // Sin almacenamiento (modo privado): la sesion dura lo que la pagina.
    }
    return;
  }
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

/** 32 bytes aleatorios en hex: el nonce que liga el id token a este intento de login. */
export function newRawNonce(): string {
  return Array.from(Crypto.getRandomBytes(32), (b) => b.toString(16).padStart(2, '0')).join('');
}

export class SignInCancelled extends Error {}

/**
 * Login con Apple (nativo o web). A Apple se le pasa el SHA-256 del nonce y al servidor el
 * nonce tal cual; el servidor comprueba que el token lleve ese hash.
 */
export async function signInWithApple(auth: AuthApi): Promise<AuthSession> {
  const rawNonce = newRawNonce();
  const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
  const result = await appleIdToken(hashed);
  if (result.type === 'cancelled') throw new SignInCancelled();
  return auth.signInWithApple(result.idToken, rawNonce);
}
