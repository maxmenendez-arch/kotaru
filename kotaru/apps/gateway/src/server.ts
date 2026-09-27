import { createServer, type Server } from 'node:http';
import { WebSocketServer, type WebSocket } from 'ws';
import type { AudioChunk, SampleRate } from '@kotaru/ai-contracts';
import {
  ReplayGuard,
  isClientMessage,
  type GrantClaimStore,
  PROTOCOL_VERSION,
  type ServerMessage,
  type SigningKey,
  verifyAndClaimGrant,
} from '@kotaru/gateway';
import { createApiHandler, type ApiDeps } from './api.js';
import { GatewaySession, type SessionDeps } from './session.js';

export interface GatewayServerOptions {
  readonly port: number;
  /** Interfaz de red. Por defecto todas; en produccion 127.0.0.1 detras del proxy TLS. */
  readonly host?: string;
  readonly keys: readonly SigningKey[];
  readonly audience: string;
  readonly deps: SessionDeps;
  /** Frecuencia de muestreo que el cliente promete enviar. */
  readonly sampleRate?: SampleRate;
  readonly deadlineCheckMs?: number;
  /**
   * Donde se reclaman los grants. Por defecto en memoria, que se olvida al reiniciar:
   * en produccion va la tabla, para que un grant no sirva dos veces tras un despliegue.
   */
  readonly grantClaims?: GrantClaimStore;
  /** API HTTP (centro de memoria, exportacion, ajustes, salud) en el mismo puerto. */
  readonly api?: ApiDeps;
}

export interface GatewayServerHandle {
  readonly port: number;
  close(): Promise<void>;
}

/**
 * Servidor WebSocket.
 *
 * Los mensajes de control van en texto como JSON; el audio va en frames binarios. Meter
 * PCM en JSON lo inflaria un tercio en base64 y anadiria una copia por chunk, que en una
 * conversacion de voz se paga en latencia.
 */
export async function startGatewayServer(
  options: GatewayServerOptions,
): Promise<GatewayServerHandle> {
  const api = options.api ? createApiHandler(options.api) : null;
  const http: Server = createServer((req, res) => {
    void (async () => {
      if (api && (await api(req, res))) return;
      res.writeHead(404, { 'content-type': 'application/json' }).end('{"error":"not_found"}');
    })().catch(() => {
      if (!res.headersSent) res.writeHead(500).end();
    });
  });
  const wss = new WebSocketServer({ server: http });
  const sampleRate = options.sampleRate ?? 24000;
  const grantClaims = options.grantClaims ?? new ReplayGuard();

  wss.on('connection', (socket: WebSocket) => {
    let session: GatewaySession | null = null;
    // Se marca en el acto, antes de cualquier await: un segundo `hello` que llegue mientras
    // se verifica el primero no puede abrir una segunda sesion en el mismo socket.
    let helloSeen = false;
    let inboundSeq = 0;
    let deadlineTimer: NodeJS.Timeout | null = null;

    const send = (message: ServerMessage): void => {
      if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(message));
    };

    const shutdown = (): void => {
      if (deadlineTimer) clearInterval(deadlineTimer);
      deadlineTimer = null;
      if (socket.readyState === socket.OPEN) socket.close();
    };

    socket.on('message', (data: Buffer, isBinary: boolean) => {
      // Un fallo de la base (o de cualquier dependencia) no puede quedar como promesa
      // rechazada sin dueno: cerraria el proceso o dejaria al cliente colgado. Se cierra
      // la sesion con un motivo que el cliente entiende.
      void handleMessage(data, isBinary).catch((error: unknown) => {
        // Un id de conversacion ajeno no se arregla reconectando: es error de protocolo,
        // no de servidor, para que la app no reintente con grants nuevos.
        const ownership = error instanceof Error && error.name === 'ConversationOwnershipError';
        send({ type: 'closing', reason: ownership ? 'protocol_error' : 'server_error' });
        shutdown();
      });
    });

    const handleMessage = async (data: Buffer, isBinary: boolean): Promise<void> => {
      {
        if (isBinary) {
          if (!session) return;
          const chunk: AudioChunk = {
            pcm: new Uint8Array(data),
            sampleRate,
            seq: inboundSeq++,
          };
          session.pushAudio(chunk);
          return;
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(data.toString('utf8'));
        } catch {
          send({ type: 'closing', reason: 'protocol_error' });
          shutdown();
          return;
        }
        if (!isClientMessage(parsed)) {
          send({ type: 'closing', reason: 'protocol_error' });
          shutdown();
          return;
        }

        if (parsed.type === 'hello') {
          if (helloSeen) return;
          helloSeen = true;
          if (parsed.protocolVersion !== PROTOCOL_VERSION) {
            send({ type: 'closing', reason: 'protocol_error' });
            shutdown();
            return;
          }

          const verification = await verifyAndClaimGrant(parsed.grant, options.keys, {
            nowSeconds: Math.floor(options.deps.now() / 1000),
            audience: options.audience,
            claims: grantClaims,
          });
          if (!verification.ok) {
            send({ type: 'rejected', reason: verification.reason });
            shutdown();
            return;
          }

          session = new GatewaySession(
            verification.grant,
            {
              send,
              sendAudio: (chunk) => {
                if (socket.readyState === socket.OPEN) socket.send(chunk.pcm, { binary: true });
              },
              close: (reason) => {
                send({ type: 'closing', reason });
                shutdown();
              },
            },
            options.deps,
          );
          await session.start();

          deadlineTimer = setInterval(() => {
            const reason = session?.checkDeadlines();
            if (reason) {
              send({ type: 'closing', reason });
              shutdown();
            }
          }, options.deadlineCheckMs ?? 1000);
          if (typeof deadlineTimer.unref === 'function') deadlineTimer.unref();
          return;
        }

        // Cualquier otro mensaje antes del saludo es un error de protocolo: el grant
        // autoriza la sesion, y sin el no hay nada que hacer con lo que venga.
        if (!session) {
          send({ type: 'closing', reason: 'protocol_error' });
          shutdown();
          return;
        }
        await session.handle(parsed);
      }
    };

    socket.on('close', () => {
      if (deadlineTimer) clearInterval(deadlineTimer);
      // El cliente se fue: lo que estuviera generando ya no lo oira nadie y cuesta dinero.
      session?.dispose();
    });
  });

  await new Promise<void>((resolve, reject) => {
    http.once('error', reject);
    if (options.host) http.listen(options.port, options.host, resolve);
    else http.listen(options.port, resolve);
  });
  const address = http.address();
  const port = typeof address === 'object' && address !== null ? address.port : options.port;

  return {
    port,
    close: () =>
      new Promise<void>((resolve) => {
        // Avisar antes de cortar: la app distingue "el servidor se reinicia, reconecta"
        // de "se cayo la red". Despues se corta igual, sin esperar al cliente.
        const shutdownNotice = JSON.stringify({ type: 'closing', reason: 'server_shutdown' } satisfies ServerMessage);
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(shutdownNotice);
            client.close(1001, 'server_shutdown');
          }
        });
        const hard = setTimeout(() => wss.clients.forEach((client) => client.terminate()), 500);
        hard.unref();
        wss.close(() => {
          clearTimeout(hard);
          http.close(() => resolve());
          http.closeAllConnections?.();
        });
      }),
  };
}
