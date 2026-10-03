import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import WebSocket from 'ws';
import { PROTOCOL_VERSION, signAccessToken, signGrant, type ServerMessage } from '@kotaru/gateway';
import { purgeSubject } from '@kotaru/persistence';
import { loadConfig } from './config.js';
import { pgClient } from './pg-client.js';

/**
 * Prueba de humo contra un gateway EN MARCHA. Hace lo que haria la app:
 * salud → sesion de voz con un turno → centro de memoria → exportacion.
 *
 *   npm run smoke -- http://127.0.0.1:8080 [--voz]
 *
 * Usa las mismas claves que el gateway (lee el mismo entorno). Crea un usuario de
 * prueba nuevo cada vez y lo BORRA al terminar: no deja datos en produccion.
 *
 * El turno de voz solo se prueba con proveedores simulados. Con los reales costaria
 * dinero y, como la prueba envia silencio, el STT devolveria vacio y fallaria siempre;
 * se fuerza con --voz (por ejemplo, tras cambiar de proveedor, con alguien hablando).
 *
 * Con --audio=archivo.wav (PCM 16 bits mono a 24 kHz, con o sin cabecera WAV) el turno lleva
 * voz de verdad en vez de silencio: prueba de punta a punta con los proveedores reales
 * (oido, modelo y voz). Dice que proveedores contestaron, la emocion y el texto. Cuesta
 * centavos.
 */
const base = (process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'http://127.0.0.1:8080').replace(/\/$/, '');
const config = loadConfig(process.env);
const audioArg = process.argv.find((a) => a.startsWith('--audio='))?.slice('--audio='.length);
/** Con que personaje se prueba (--personaje=luna|nova|rio) y si con coqueteo sensual (--sensual). */
const companionArg = process.argv.find((a) => a.startsWith('--personaje='))?.slice('--personaje='.length);
const sensualArg = process.argv.includes('--sensual');
/** Modo elegido en la app para Nova o Rio (--modo=friend|flirt). */
const modeArg = process.argv.find((a) => a.startsWith('--modo='))?.slice('--modo='.length);
/** Voz elegida como en Ajustes (--voz=gemini|cartesia): comprueba que habla esa. */
const voiceArg = process.argv.find((a) => a.startsWith('--voz='))?.slice('--voz='.length);
const voice = Boolean(audioArg) || process.argv.includes('--voz') || config.providers.every((p) => p === 'mock');

/** PCM 16 bits del archivo: sin la cabecera WAV si la trae. */
function speech(path: string): Buffer {
  const raw = readFileSync(path);
  if (raw.subarray(0, 4).toString('latin1') !== 'RIFF') return raw;
  const at = raw.indexOf('data', 12, 'latin1');
  return at > 0 ? raw.subarray(at + 8) : raw.subarray(44);
}
const subjectId = randomUUID();
const conversationId = randomUUID();
const nowSeconds = () => Math.floor(Date.now() / 1000);
const steps: { step: string; ok: boolean; detail?: string }[] = [];
/** El turno de prueba acabo en derivacion de crisis (no se guarda conversacion). */
let crisisSeen = false;

function check(step: string, ok: boolean, detail?: string): void {
  steps.push({ step, ok, ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'OK   ' : 'FALLO'} ${step}${detail ? ` — ${detail}` : ''}`);
}

try {
  const health = await fetch(`${base}/healthz`);
  check('healthz', health.status === 200);
  const ready = await fetch(`${base}/readyz`);
  check('readyz (base de datos)', ready.status === 200);

  if (!voice) check('turno de voz', true, 'omitido: proveedores reales (usa --voz para forzarlo)');
  if (voice) {
    const grant = signGrant(
      {
        subjectId, conversationId, plan: 'close',
        ...(companionArg ? { companionId: companionArg } : {}),
        ...(sensualArg ? { intimacy: 'sensual' as const } : {}), region: 'us', locale: 'es-419', sensitivity: 'standard',
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

    if (modeArg) ws.send(JSON.stringify({ type: 'mode', mode: modeArg }));
    if (voiceArg) ws.send(JSON.stringify({ type: 'voice_choice', choice: voiceArg }));
    ws.send(JSON.stringify({ type: 'turn_start', turnId: 'smoke_1' }));
    const frame = 24000 * 2 * 0.02;
    if (audioArg) {
      // Voz real, a ritmo de tiempo real (como la manda el microfono).
      const pcm = speech(audioArg);
      for (let at = 0; at < pcm.byteLength; at += frame) {
        ws.send(pcm.subarray(at, Math.min(pcm.byteLength, at + frame)), { binary: true });
        await new Promise((r) => setTimeout(r, 20));
      }
    } else {
      for (let i = 0; i < 25; i += 1) ws.send(Buffer.alloc(frame), { binary: true });
    }
    ws.send(JSON.stringify({ type: 'turn_end', turnId: 'smoke_1' }));
    await until(() => messages.some((m) => m.type === 'turn_done'), audioArg ? 60_000 : 10_000);
    await until(() => messages.filter((m) => m.type === 'usage').length >= 2);
    const crisis = messages.some((m) => m.type === 'safety' && m.action === 'crisis_handoff');
    crisisSeen = crisis;
    check(
      'turno completo',
      crisis || (messages.some((m) => m.type === 'token') && audioFrames > 0),
      crisis ? 'derivado a recursos de crisis (sin respuesta del personaje)' : `${audioFrames} frames de audio`,
    );
    if (audioArg) {
      const heard = messages.filter((m) => m.type === 'transcript' && m.final).map((m) => (m as { text: string }).text).join(' ');
      const reply = messages.filter((m) => m.type === 'token').map((m) => (m as { text: string }).text).join('');
      if (process.argv.includes('--mostrar')) console.log(`\n${companionArg ?? 'rio'}${sensualArg ? ' (sensual)' : ''}${modeArg ? ` [${modeArg}]` : ''} responde: ${reply}\n`);
      const affect = messages.find((m) => m.type === 'affect') as { emotion?: string; gesture?: string } | undefined;
      check('oyo la voz', heard.trim().length > 0, `"${heard.slice(0, 80)}"`);
      if (crisis) check('seguridad', true, 'crisis detectada: se muestran los recursos (988)');
      check('respuesta sin etiquetas de emocion', !/\[\[|\]\]/.test(reply), `"${reply.slice(0, 100)}"`);
      check('emocion para el avatar', true, affect ? `${affect.emotion}${affect.gesture ? ` + gesto ${affect.gesture}` : ''}` : 'no llego (no es un fallo)');
      if (voiceArg && !crisis) {
        const used = (messages.find((m) => m.type === 'voice_used') as { voice?: string } | undefined)?.voice;
        check('voz elegida', used === voiceArg, `pedida ${voiceArg}, hablo ${used ?? 'sin aviso'}`);
      }
      const sql = pgClient({ connectionString: config.databaseUrl, max: 1 });
      try {
        await new Promise((r) => setTimeout(r, 500));
        const rows = await sql.query<{ stt_provider: string; llm_provider: string; tts_provider: string; fallback_used: boolean; total_cost_usd: string }>(
          'select stt_provider, llm_provider, tts_provider, fallback_used, total_cost_usd from app.turn_metrics where conversation_id = $1',
          [conversationId],
        );
        const m = rows.rows[0];
        check('proveedores del turno', Boolean(m), m ? `oido ${m.stt_provider}, modelo ${m.llm_provider}, voz ${m.tts_provider}${m.fallback_used ? ' (respaldo)' : ''}, ${m.total_cost_usd} USD` : 'sin metrica');
      } finally {
        await sql.close();
      }
    }
    ws.send(JSON.stringify({ type: 'bye' }));
    ws.close();
  }

  const auth = { authorization: `Bearer ${signAccessToken({ sub: subjectId, aud: config.apiAudience }, config.accessKeys[0]!, { nowSeconds: nowSeconds() })}` };
  const list = await fetch(`${base}/v1/memories`, { headers: auth });
  const body = (await list.json()) as { memories?: unknown[] };
  check('centro de memoria', list.status === 200, `${body.memories?.length ?? 0} recuerdo(s) propuesto(s)`);

  const exported = await fetch(`${base}/v1/export`, { headers: auth });
  const data = (await exported.json()) as { conversations?: { messages: unknown[] }[] };
  check(
    'exportacion',
    exported.status === 200 && (!voice || (data.conversations?.[0]?.messages.length ?? 0) === 2 || crisisSeen),
    voice ? 'la conversacion quedo guardada' : undefined,
  );

  const noAuth = await fetch(`${base}/v1/memories`);
  check('sin token no hay datos', noAuth.status === 401);
} catch (error) {
  check('ejecucion', false, error instanceof Error ? error.message : String(error));
} finally {
  // El usuario de prueba no se queda en la base.
  const sql = pgClient({ connectionString: config.databaseUrl, max: 1 });
  try {
    await new Promise((r) => setTimeout(r, 300)); // deja terminar escrituras en curso
    const rows = await purgeSubject(sql, subjectId);
    check('limpieza del usuario de prueba', true, `${rows} fila(s) borradas`);
  } catch (error) {
    check('limpieza del usuario de prueba', false, error instanceof Error ? error.message : String(error));
  } finally {
    await sql.close();
  }
}

const failed = steps.filter((s) => !s.ok).length;
console.log(failed === 0 ? '\nTodo en orden.' : `\n${failed} paso(s) fallaron.`);
process.exit(failed === 0 ? 0 : 1);
