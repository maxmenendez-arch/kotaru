import { Pressable, StyleSheet, Text } from 'react-native';
import { radius } from './theme';
import { loadScript } from './web-script';

export type ProviderResult = { readonly type: 'success'; readonly idToken: string } | { readonly type: 'cancelled' };

/**
 * Sign in with Apple en la web, con el script oficial de Apple en modo ventana emergente.
 *
 * Necesita un Services ID de Apple (EXPO_PUBLIC_APPLE_WEB_SERVICE_ID) con el dominio de la
 * webapp y su direccion de retorno registrados; el mismo id va en
 * KOTARU_APPLE_CLIENT_IDS del servidor. No es un secreto.
 */
const SERVICE_ID = process.env.EXPO_PUBLIC_APPLE_WEB_SERVICE_ID?.trim() || null;
const SCRIPT = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

interface AppleIdJs {
  auth: {
    init(config: Record<string, unknown>): void;
    signIn(): Promise<{ authorization: { id_token: string } }>;
  };
}

export function appleAvailable(): Promise<boolean> {
  return Promise.resolve(SERVICE_ID !== null);
}

/** `hashedNonce`: el SHA-256 del nonce; el token de Apple lo lleva tal cual. */
export async function appleIdToken(hashedNonce: string): Promise<ProviderResult> {
  if (!SERVICE_ID) throw new Error('apple_not_configured');
  await loadScript(SCRIPT);
  const AppleID = (globalThis as unknown as { AppleID?: AppleIdJs }).AppleID;
  if (!AppleID) throw new Error('apple_script_missing');
  AppleID.auth.init({
    clientId: SERVICE_ID,
    scope: '',
    redirectURI: `${window.location.origin}/`,
    nonce: hashedNonce,
    usePopup: true,
  });
  try {
    const response = await AppleID.auth.signIn();
    return { type: 'success', idToken: response.authorization.id_token };
  } catch (error) {
    const code = (error as { error?: string }).error;
    if (code === 'popup_closed_by_user' || code === 'user_cancelled_authorize') return { type: 'cancelled' };
    throw error;
  }
}

/** Boton blanco con texto negro, uno de los estilos de la guia de marca de Apple para la web. */
export function AppleButton({ onPress, label, disabled }: { onPress: () => void; label: string; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} disabled={disabled} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: radius.control,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#000000', fontSize: 17, fontWeight: '600' },
});
