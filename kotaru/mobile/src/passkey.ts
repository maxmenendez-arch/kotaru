/**
 * Contrato de las passkeys en la app. Metro elige `passkey.web.ts` en la web; en iOS y
 * Android (este archivo) todavia no hay passkeys: necesitan el dominio asociado de la app,
 * que depende de la cuenta de Apple Developer y de la firma de Android.
 */
export type PasskeyResult = { readonly type: 'success'; readonly response: unknown } | { readonly type: 'cancelled' };

export function passkeysAvailable(): Promise<boolean> {
  return Promise.resolve(false);
}

export async function createPasskey(_options: unknown): Promise<PasskeyResult> {
  throw new Error('passkeys_not_available');
}

export async function getPasskey(_options: unknown): Promise<PasskeyResult> {
  throw new Error('passkeys_not_available');
}
