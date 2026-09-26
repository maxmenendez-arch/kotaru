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
import { GatewaySession, type SessionDeps } from './session.js';

export interface GatewayServerOptions {
  readonly port: number;
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
  const http: Server = createServer();
  const wss = new WebSocketServer({ server: http });
  const sampleRate = options.sampleRate ?? 24000;
  const grantClaims = options.grantClaims ?? new ReplayGuard();

  wss.on('connection', (socket: WebSocket) => {
    let session: GatewaySession | null = null;
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
      void handleMessage(data, isBinary).catch(() => {
        send({ type: 'closing', reason: 'server_error' });
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
          if (session) return;
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
    });
  });

  await new Promise<void>((resolve) => http.listen(options.port, resolve));
  const address = http.address();
  const port = typeof address === 'object' && address !== null ? address.port : options.port;

  return {
    port,
    close: () =>
      new Promise<void>((resolve) => {
        wss.clients.forEach((client) => client.terminate());
        wss.close(() => http.close(() => resolve()));
      }),
  };
}
