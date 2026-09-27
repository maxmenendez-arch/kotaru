import { GoogleOneTapSignIn, GoogleSignInButton, isErrorWithCode, statusCodes } from 'react-native-nitro-google-signin';
import { Platform } from 'react-native';

export type GoogleResult = { readonly type: 'success'; readonly idToken: string } | { readonly type: 'cancelled' };

/**
 * Login con Google en iOS (SDK de Google Sign-In) y Android (Credential Manager), con
 * react-native-nitro-google-signin. Se eligio porque pasa el nonce en las dos
 * plataformas; la version gratuita de @react-native-google-signin no lo admite y el
 * servidor lo exige (ADR-003).
 *
 * Client id (no son secretos): EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (el "web" de Google
 * Cloud, que en Android es la audiencia del token) y EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID.
 * Los dos tienen que estar tambien en KOTARU_GOOGLE_CLIENT_IDS del servidor.
 */
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || null;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || null;

export function googleConfigured(): boolean {
  if (!WEB_CLIENT_ID) return false;
  return Platform.OS === 'android' || (Platform.OS === 'ios' && IOS_CLIENT_ID !== null);
}

/**
 * Abre el selector de cuentas de Google y devuelve el id token. `rawNonce` va tal cual
 * dentro del token (claim `nonce`); el servidor lo compara con el que le manda la app.
 * No se piden permisos extra: solo el perfil basico que incluye el login.
 */
export async function googleIdToken(rawNonce: string): Promise<GoogleResult> {
  if (!WEB_CLIENT_ID) throw new Error('google_not_configured');
  GoogleOneTapSignIn.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    nonce: rawNonce,
  });
  try {
    if (Platform.OS === 'android') await GoogleOneTapSignIn.checkPlayServices(true);
    const response = await GoogleOneTapSignIn.presentExplicitSignIn();
    if (response.type !== 'success' || !response.data) return { type: 'cancelled' };
    return { type: 'success', idToken: response.data.idToken };
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) return { type: 'cancelled' };
    throw error;
  }
}

export interface GoogleButtonProps {
  /** Nonce en claro: va tal cual dentro del token y tal cual al servidor. */
  readonly nonce: string;
  readonly onIdToken: (idToken: string) => void;
  readonly onCancel: () => void;
  readonly onError: (error: unknown) => void;
  readonly disabled?: boolean;
}

/** Boton oficial de Google (marca exigida por Google). */
export function GoogleButton({ nonce, onIdToken, onCancel, onError, disabled }: GoogleButtonProps) {
  const press = () => {
    googleIdToken(nonce).then((r) => (r.type === 'success' ? onIdToken(r.idToken) : onCancel()), onError);
  };
  return (
    <GoogleSignInButton
      signInBehavior="none"
      onPress={press}
      disabled={disabled ?? false}
      size="wide"
      colorScheme="light"
      style={{ alignSelf: 'stretch', height: 48 }}
    />
  );
}
