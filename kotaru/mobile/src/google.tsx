/**
 * Login con Google: version web y de pruebas. En iOS y Android Metro elige
 * `google.native.ts`. En la web no se ofrece (la app web es solo para desarrollo).
 */
export function googleConfigured(): boolean {
  return false;
}

export type GoogleResult = { readonly type: 'success'; readonly idToken: string } | { readonly type: 'cancelled' };

export async function googleIdToken(_rawNonce: string): Promise<GoogleResult> {
  throw new Error('google_not_available');
}

export function GoogleButton(_props: { onPress: () => void; disabled?: boolean }): null {
  return null;
}
