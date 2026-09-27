import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { radius } from './theme';

export type ProviderResult = { readonly type: 'success'; readonly idToken: string } | { readonly type: 'cancelled' };

/**
 * Sign in with Apple nativo (iPhone/iPad), con expo-apple-authentication. En la web Metro
 * elige `apple.web.tsx`.
 */
export function appleAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return Promise.resolve(false);
  return AppleAuthentication.isAvailableAsync().catch(() => false);
}

/** `hashedNonce`: el SHA-256 del nonce; el token de Apple lo lleva tal cual. */
export async function appleIdToken(hashedNonce: string): Promise<ProviderResult> {
  try {
    // Sin nombre ni correo: la cuenta no los necesita (minimizacion de datos).
    const credential = await AppleAuthentication.signInAsync({ requestedScopes: [], nonce: hashedNonce });
    if (!credential.identityToken) throw new Error('apple_no_identity_token');
    return { type: 'success', idToken: credential.identityToken };
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return { type: 'cancelled' };
    throw error;
  }
}

/** Boton oficial de Apple (su guia de marca lo exige). */
export function AppleButton({ onPress }: { onPress: () => void; label: string; disabled?: boolean }) {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
      cornerRadius={radius.control}
      style={{ height: 48, width: '100%' }}
      onPress={onPress}
    />
  );
}
