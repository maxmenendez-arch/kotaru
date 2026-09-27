import { randomUUID } from 'node:crypto';
import WebSocket from 'ws';
import { PROTOCOL_VERSION, signAccessToken, signGrant, type ServerMessage } from '@kotaru/gateway';
import { loadConfig } from './config.js';

/**
 * Prueba de humo contra un gateway EN MARCHA. Hace lo que haria la app:
 * salud → sesion de voz con un turno → centro de memoria → exportacion.
 *
 *   npm run smoke -- http://127.0.0.1:8080
 *
 * Usa las mismas claves que el gateway (lee el mismo entorno). Crea un usuario de
 * prueba nuevo cada vez; no toca datos de nadie. Sale con codigo 0 si todo va bien.
 */
const base = (process.argv[2] ?? 'http://127.0.0.1:8080').replace(/\/$/, '');
const config = loadConfig(process.env);
const subjectId = randomUUID();
const conversationId = randomUUID();
const nowSeconds = () => Math.floor(Date.now() / 1000);
const steps: { step: string; ok: boolean; detail?: string }[] = [];

function check(step: string, ok: boolean, detail?: string): void {
  steps.push({ step, ok, ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'OK   ' : 'FALLO'} ${step}${detail ? ` — ${detail}` : ''}`);
}

try {
  const health = await fetch(`${base}/healthz`);
  check('healthz', health.status === 200);
  const ready = await fetch(`${base}/readyz`);
  check('readyz (base de datos)', ready.status === 200);

  const grant = signGrant(
    {
      subjectId, conversationId, plan: 'close', region: 'us', locale: 'es-419', sensitivity: 'standard',
      quality: 'balanced', budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: config.monthlyHardCapUsd },
      maxSessionSeconds: 300, aud: config.grantAudience,
    },
    config.grantKeys[0]!,
    { nowSeconds: nowSeconds() },
  );

  const messages: ServerMessage[] = [];
  let audioFrames = 0;
  const ws = new WebSocket(base.replace(/^http/, 'ws'));
  await new Promise<void>((resolve, reject) => {
    ws.on('open', () => resolve());
    ws.on('error', reject);
  });
  ws.on('message', (data: Buffer, isBinary: boolean) => {
    if (isBinary) audioFrames += 1;
    else messages.push(JSON.parse(data.toString('utf8')) as ServerMessage);
  });
  const until = async (predicate: () => boolean, ms = 10_000) => {
    const start = Date.now();
    while (!predicate()) {
      if (Date.now() - start > ms) throw new Error(`tiempo agotado; llegaron: ${messages.map((m) => m.type).join(',')}`);
      await new Promise((r) => setTimeout(r, 20));
    }
  };

  ws.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
  await until(() => messages.some((m) => m.type === 'ready' || m.type === 'rejected'));
  check('sesion de voz aceptada', messages.some((m) => m.type === 'ready'), messages.find((m) => m.type === 'rejected') ? 'rechazada' : undefined);

  ws.send(JSON.stringify({ type: 'turn_start', turnId: 'smoke_1' }));
  for (let i = 0; i < 25; i += 1) ws.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
  ws.send(JSON.stringify({ type: 'turn_end', turnId: 'smoke_1' }));
  await until(() => messages.some((m) => m.type === 'turn_done'));
  await until(() => messages.filter((m) => m.type === 'usage').length >= 2);
  check('turno completo', messages.some((m) => m.type === 'token') && audioFrames > 0, `${audioFrames} frames de audio`);
  ws.send(JSON.stringify({ type: 'bye' }));
  ws.close();

  const auth = { authorization: `Bearer ${signAccessToken({ sub: subjectId, aud: config.apiAudience }, config.accessKeys[0]!, { nowSeconds: nowSeconds() })}` };
  const list = await fetch(`${base}/v1/memories`, { headers: auth });
  const body = (await list.json()) as { memories?: unknown[] };
  check('centro de memoria', list.status === 200, `${body.memories?.length ?? 0} recuerdo(s) propuesto(s)`);

  const exported = await fetch(`${base}/v1/export`, { headers: auth });
  const data = (await exported.json()) as { conversations?: { messages: unknown[] }[] };
  check('exportacion', exported.status === 200 && (data.conversations?.[0]?.messages.length ?? 0) === 2, 'la conversacion quedo guardada');

  const noAuth = await fetch(`${base}/v1/memories`);
  check('sin token no hay datos', noAuth.status === 401);
} catch (error) {
  check('ejecucion', false, error instanceof Error ? error.message : String(error));
}

const failed = steps.filter((s) => !s.ok).length;
console.log(failed === 0 ? '\nTodo en orden.' : `\n${failed} paso(s) fallaron.`);
process.exit(failed === 0 ? 0 : 1);
