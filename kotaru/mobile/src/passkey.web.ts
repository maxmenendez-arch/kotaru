import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
  WebAuthnError,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';

export type PasskeyResult = { readonly type: 'success'; readonly response: unknown } | { readonly type: 'cancelled' };

/**
 * Passkeys en la webapp con la API estandar del navegador (WebAuthn), a traves de
 * @simplewebauthn/browser. Chrome, Safari, Edge y Firefox recientes las guardan en el
 * llavero del sistema, el gestor de contrasenas o el telefono (codigo QR).
 */
export function passkeysAvailable(): Promise<boolean> {
  return Promise.resolve(browserSupportsWebAuthn());
}

/** El usuario cerro el dialogo o no confirmo: no es un error que mostrar. */
function cancelled(error: unknown): boolean {
  if (error instanceof WebAuthnError) return error.code === 'ERROR_CEREMONY_ABORTED' || (error.cause as Error | undefined)?.name === 'NotAllowedError';
  return (error as { name?: string }).name === 'NotAllowedError' || (error as { name?: string }).name === 'AbortError';
}

export async function createPasskey(options: unknown): Promise<PasskeyResult> {
  try {
    return { type: 'success', response: await startRegistration({ optionsJSON: options as PublicKeyCredentialCreationOptionsJSON }) };
  } catch (error) {
    if (cancelled(error)) return { type: 'cancelled' };
    throw error;
  }
}

export async function getPasskey(options: unknown): Promise<PasskeyResult> {
  try {
    return { type: 'success', response: await startAuthentication({ optionsJSON: options as PublicKeyCredentialRequestOptionsJSON }) };
  } catch (error) {
    if (cancelled(error)) return { type: 'cancelled' };
    throw error;
  }
}
