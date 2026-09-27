import { ConversationClient, MemoryApi, type AuthApi, type ClientEvent, type SocketLike } from '@kotaru/client';
import type { Lang } from './i18n';

/**
 * Conexion de desarrollo: grant y token pegados a mano, los que imprime `bin/token.mjs`
 * en el servidor. El grant es de un solo uso: para una segunda sesion hace falta otro.
 * Solo sirve para probar el gateway sin cuentas.
 */
export interface DevConnection {
  readonly kind: 'dev';
  readonly serverUrl: string;
  readonly grant: string;
  readonly accessToken: string;
}

/** Conexion con cuenta: `AuthApi` renueva el token de acceso y pide un grant por sesion. */
export interface AccountConnection {
  readonly kind: 'account';
  readonly serverUrl: string;
  readonly auth: AuthApi;
}

export type Connection = DevConnection | AccountConnection;

export function wsUrl(serverUrl: string): string {
  return serverUrl.trim().replace(/\/$/, '').replace(/^http/, 'ws');
}

export function localeFor(lang: Lang): 'es-419' | 'en-US' {
  return lang === 'en' ? 'en-US' : 'es-419';
}

export function createConversation(conn: Connection, lang: Lang, onEvent: (e: ClientEvent) => void): ConversationClient {
  const common = {
    url: wsUrl(conn.serverUrl),
    createSocket: (url: string) => new WebSocket(url) as unknown as SocketLike,
    onEvent,
  };
  if (conn.kind === 'account') {
    // Cada reconexion pide un grant nuevo para la misma conversacion: el servidor solo
    // deja retomar conversaciones propias, y numera el las nuevas.
    let conversationId: string | undefined;
    return new ConversationClient({
      ...common,
      getGrant: async () => {
        const locale = localeFor(lang);
        const issued = await conn.auth.voiceGrant(conversationId ? { conversationId, locale } : { locale });
        conversationId = issued.conversationId;
        return issued.grant;
      },
    });
  }
  let used = false;
  return new ConversationClient({
    ...common,
    getGrant: async () => {
      if (used) throw new Error('grant ya usado: genera otro con token.mjs');
      used = true;
      return conn.grant.trim();
    },
    maxReconnectAttempts: 1,
  });
}

export function createMemoryApi(conn: Connection): MemoryApi {
  const getAccessToken = conn.kind === 'account' ? () => conn.auth.accessToken() : async () => conn.accessToken.trim();
  return new MemoryApi({ baseUrl: conn.serverUrl.trim(), getAccessToken });
}
