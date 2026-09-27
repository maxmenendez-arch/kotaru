/**
 * Contrato comun del login con Google. Metro elige `google.native.tsx` en iOS y Android y
 * `google.web.tsx` en la web; este archivo solo existe para el typecheck y las pruebas.
 */
export interface GoogleButtonProps {
  /** Nonce en claro: va tal cual dentro del token y tal cual al servidor. */
  readonly nonce: string;
  readonly onIdToken: (idToken: string) => void;
  readonly onCancel: () => void;
  readonly onError: (error: unknown) => void;
  readonly disabled?: boolean;
}

export function googleConfigured(): boolean {
  return false;
}

export function GoogleButton(_props: GoogleButtonProps): null {
  return null;
}
