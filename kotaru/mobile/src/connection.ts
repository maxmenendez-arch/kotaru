import { ApiError, ConversationClient, MemoryApi, type AuthApi, type ClientEvent, type SocketLike } from '@kotaru/client';
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

/** Con quien se habla y en que conversacion (para retomarla al volver al personaje). */
export interface ConversationTarget {
  readonly companion: string;
  readonly conversationId?: string;
  /** Avisa del id de conversacion que numero el servidor. */
  readonly onConversation?: (conversationId: string) => void;
}

export function createConversation(
  conn: Connection,
  lang: Lang,
  onEvent: (e: ClientEvent) => void,
  target: ConversationTarget = { companion: 'rio' },
): ConversationClient {
  const common = {
    url: wsUrl(conn.serverUrl),
    createSocket: (url: string) => new WebSocket(url) as unknown as SocketLike,
    onEvent,
  };
  if (conn.kind === 'account') {
    // Cada reconexion pide un grant nuevo para la misma conversacion: el servidor solo
    // deja retomar conversaciones propias, y numera el las nuevas.
    let conversationId: string | undefined = target.conversationId;
    return new ConversationClient({
      ...common,
      getGrant: async () => {
        const locale = localeFor(lang);
        const request = { locale, companion: target.companion };
        let issued;
        try {
          issued = await conn.auth.voiceGrant(conversationId ? { ...request, conversationId } : request);
        } catch (err) {
          // La conversacion guardada ya no existe (retencion, borrado): se empieza otra.
          if (!conversationId || !(err instanceof ApiError) || (err.status !== 404 && err.status !== 409)) throw err;
          issued = await conn.auth.voiceGrant(request);
        }
        if (issued.conversationId !== conversationId) target.onConversation?.(issued.conversationId);
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
