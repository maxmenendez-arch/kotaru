import { ConversationClient, MemoryApi, type ClientEvent, type SocketLike } from '@kotaru/client';

/**
 * Conexion con el servidor mientras no exista el servicio de login.
 *
 * En desarrollo se pegan a mano el grant y el token que imprime `bin/token.mjs` en el
 * servidor. El grant es de un solo uso: para una segunda sesion hace falta otro. Cuando
 * exista el login, `getGrant` y `getAccessToken` se los pediran al servicio de cuentas y
 * esta pantalla de desarrollo desaparece.
 */
export interface DevConnection {
  readonly serverUrl: string;
  readonly grant: string;
  readonly accessToken: string;
}

export function wsUrl(serverUrl: string): string {
  return serverUrl.trim().replace(/\/$/, '').replace(/^http/, 'ws');
}

export function createConversation(conn: DevConnection, onEvent: (e: ClientEvent) => void): ConversationClient {
  let used = false;
  return new ConversationClient({
    url: wsUrl(conn.serverUrl),
    getGrant: async () => {
      if (used) throw new Error('grant ya usado: genera otro con token.mjs');
      used = true;
      return conn.grant.trim();
    },
    createSocket: (url) => new WebSocket(url) as unknown as SocketLike,
    onEvent,
    maxReconnectAttempts: 1,
  });
}

export function createMemoryApi(conn: DevConnection): MemoryApi {
  return new MemoryApi({ baseUrl: conn.serverUrl.trim(), getAccessToken: async () => conn.accessToken.trim() });
}
