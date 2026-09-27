import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { loadScript } from './web-script';

/**
 * Login con Google en la web, con Google Identity Services: Google dibuja su propio boton
 * y devuelve el id token con el nonce que se le dio al iniciarlo.
 *
 * Client id: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, el de tipo "web" de Google Cloud, con el
 * origen de la webapp (https://app.kotaru.app) en "Authorized JavaScript origins". Es el
 * mismo que usa Android y ya esta en KOTARU_GOOGLE_CLIENT_IDS. No es un secreto.
 */
const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || null;
const SCRIPT = 'https://accounts.google.com/gsi/client';

export interface GoogleButtonProps {
  readonly nonce: string;
  readonly onIdToken: (idToken: string) => void;
  readonly onCancel: () => void;
  readonly onError: (error: unknown) => void;
  readonly disabled?: boolean;
}

interface Gis {
  accounts: {
    id: {
      initialize(config: Record<string, unknown>): void;
      renderButton(el: HTMLElement, options: Record<string, unknown>): void;
    };
  };
}

export function googleConfigured(): boolean {
  return CLIENT_ID !== null;
}

export function GoogleButton({ nonce, onIdToken, onError }: GoogleButtonProps) {
  const host = useRef<View>(null);
  // Las funciones cambian en cada render; Google guarda la primera que se le pasa.
  const handlers = useRef({ onIdToken, onError });
  handlers.current = { onIdToken, onError };

  useEffect(() => {
    if (!CLIENT_ID) return;
    let live = true;
    loadScript(SCRIPT).then(
      () => {
        const google = (globalThis as unknown as { google?: Gis }).google;
        const el = host.current as unknown as HTMLElement | null;
        if (!live || !google || !el) return;
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          nonce,
          callback: (r: { credential?: string }) => {
            if (r.credential) handlers.current.onIdToken(r.credential);
          },
          ux_mode: 'popup',
          use_fedcm_for_button: true,
        });
        el.innerHTML = '';
        google.accounts.id.renderButton(el, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: Math.min(el.clientWidth || 320, 400),
        });
      },
      (error) => handlers.current.onError(error),
    );
    return () => {
      live = false;
    };
  }, [nonce]);

  return <View ref={host} style={{ minHeight: 44, alignItems: 'center' }} />;
}
