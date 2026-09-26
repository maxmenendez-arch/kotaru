/**
 * Conversacion completa contra los simuladores, de punta a punta.
 *
 * Levanta el gateway de verdad, se conecta por WebSocket como lo haria la app, y
 * ejecuta dos turnos. Sirve para ver el sistema funcionando sin telefono, sin nube y
 * sin gastar un centavo en proveedores.
 *
 *   npm run demo
 */
import { randomBytes } from 'node:crypto';
import WebSocket from 'ws';
import type { AudioChunk, ProviderContext, SpeechToTextProvider, TranscriptEvent } from '@kotaru/ai-contracts';
import { DefaultAiRouter } from '@kotaru/ai-router';
import {
  MockLlmProvider,
  MockModerationProvider,
  MockSttProvider,
  MockTtsProvider,
} from '@kotaru/ai-adapters-mock';
import { InMemoryUsageLedger, UsageMeter, evaluateSpend, entitlementFor } from '@kotaru/billing';
import { MemoryStore } from '@kotaru/memory';
import { InMemorySink } from '@kotaru/telemetry';
import { PROTOCOL_VERSION, signGrant, type ServerMessage, type SigningKey } from '@kotaru/gateway';
import { startGatewayServer } from './server.js';

const GUION = [
  'me gusta el mar en invierno',
  'voy a Lisboa el mes que viene',
];

/** STT que entrega una frase distinta por turno, para que la demo no sea monotona. */
class StttDemo implements SpeechToTextProvider {
  #index = 0;
  readonly #inner = new MockSttProvider(GUION[0]!);
  readonly descriptor = this.#inner.descriptor;

  transcribeStream(input: AsyncIterable<AudioChunk>, ctx: ProviderContext): AsyncIterable<TranscriptEvent> {
    const guion = GUION[Math.min(this.#index++, GUION.length - 1)]!;
    return new MockSttProvider(guion).transcribeStream(input, ctx);
  }

  estimate(input: { readonly audioSeconds: number }, ctx: ProviderContext) {
    return this.#inner.estimate(input, ctx);
  }

  health() {
    return this.#inner.health();
  }
}

const key: SigningKey = { kid: 'demo', secret: randomBytes(32) };
const AUDIENCE = 'gateway-demo';
const now = () => Date.now();

const stt = new StttDemo();
const llm = new MockLlmProvider('Qué bonito. Cuéntame qué es lo que más te gusta de eso.');
const tts = new MockTtsProvider();
const meter = new UsageMeter();
const sink = new InMemorySink();
let memoryCounter = 0;
const memory = new MemoryStore({ now, newId: () => `mem_${++memoryCounter}` });
const budget = { hardCapUsd: 1000 };

const router = new DefaultAiRouter({ now })
  .register({ descriptor: stt.descriptor, estimate: (p, c) => stt.estimate({ audioSeconds: p.audioSeconds ?? 0 }, c) })
  .register({ descriptor: llm.descriptor, estimate: (p, c) => llm.estimate({ inputTokens: p.inputTokens ?? 0, outputTokens: p.outputTokens ?? 0 }, c) })
  .register({ descriptor: tts.descriptor, estimate: (p, c) => tts.estimate({ characters: p.characters ?? 0 }, c) });

const server = await startGatewayServer({
  port: 0,
  keys: [key],
  audience: AUDIENCE,
  deps: {
    router,
    resolve: {
      stt: () => stt,
      llm: () => llm,
      tts: () => tts,
    },
    moderation: new MockModerationProvider(),
    memory,
    usage: new InMemoryUsageLedger(meter),
    sink,
    budget,
    now,
    infraCostUsd: 0.0003,
  },
});

const grant = signGrant(
  {
    subjectId: 'subj_demo',
    conversationId: 'conv_demo',
    plan: 'close',
    region: 'us',
    locale: 'es-419',
    sensitivity: 'standard',
    quality: 'balanced',
    budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 800, hardCapUsd: 1000 },
    maxSessionSeconds: 1800,
    aud: AUDIENCE,
  },
  key,
  { nowSeconds: Math.floor(Date.now() / 1000) },
);

const socket = new WebSocket(`ws://127.0.0.1:${server.port}`);
const inbox: ServerMessage[] = [];
let audioFrames = 0;
let audioBytes = 0;

socket.on('message', (data: Buffer, isBinary: boolean) => {
  if (isBinary) {
    audioFrames += 1;
    audioBytes += data.byteLength;
    return;
  }
  inbox.push(JSON.parse(data.toString('utf8')) as ServerMessage);
});

const waitFor = (type: ServerMessage['type']): Promise<void> =>
  new Promise((resolve) => {
    const tick = setInterval(() => {
      if (inbox.some((m) => m.type === type)) {
        clearInterval(tick);
        resolve();
      }
    }, 5);
  });

await new Promise<void>((resolve) => socket.on('open', () => resolve()));

console.log('\n══ Kotaru — conversación de demostración ══\n');
console.log(`Gateway escuchando en el puerto ${server.port}`);

socket.send(JSON.stringify({ type: 'hello', grant, protocolVersion: PROTOCOL_VERSION }));
await waitFor('ready');
const ready = inbox.find((m) => m.type === 'ready');
console.log(`Sesión abierta · máximo ${ready?.type === 'ready' ? ready.maxSessionSeconds / 60 : '?'} minutos\n`);

for (let turn = 1; turn <= GUION.length; turn += 1) {
  const turnId = `turn_${turn}`;
  const before = inbox.length;
  const framesBefore = audioFrames;
  const startedAt = Date.now();

  socket.send(JSON.stringify({ type: 'turn_start', turnId }));
  for (let i = 0; i < 10; i += 1) socket.send(Buffer.alloc(24000 * 2 * 0.02), { binary: true });
  const endedSpeakingAt = Date.now();
  socket.send(JSON.stringify({ type: 'turn_end', turnId }));

  await new Promise<void>((resolve) => {
    const tick = setInterval(() => {
      if (inbox.some((m) => m.type === 'turn_done' && m.turnId === turnId)) {
        clearInterval(tick);
        resolve();
      }
    }, 5);
  });

  const messages = inbox.slice(before);
  const transcript = messages.find((m) => m.type === 'transcript' && m.final === true);
  const affect = messages.find((m) => m.type === 'affect');
  const reply = messages.filter((m) => m.type === 'token').map((m) => (m.type === 'token' ? m.text : '')).join('');
  const usage = [...messages].reverse().find((m) => m.type === 'usage');
  const metric = sink.turns.at(-1);

  console.log(`── Turno ${turn} ─────────────────────────────`);
  console.log(`  Usuario    │ ${transcript?.type === 'transcript' ? transcript.text : '(sin transcripción)'}`);
  console.log(`  Companion  │${reply}`);
  if (affect?.type === 'affect') {
    console.log(`  Emoción    │ ${affect.emotion} (${affect.intensity})${affect.gesture ? ` · ${affect.gesture}` : ''}`);
  }
  console.log(`  Audio      │ ${audioFrames - framesBefore} frames · ${(audioBytes / 1024).toFixed(0)} KB acumulados`);
  console.log(`  Latencia   │ ${Date.now() - endedSpeakingAt} ms desde que soltó el botón hasta fin de turno`);
  if (metric) {
    console.log(
      `  Costo      │ STT ${fmt(metric.sttCostUsd)} · LLM ${fmt(metric.llmCostUsd)} · TTS ${fmt(metric.ttsCostUsd)} · infra ${fmt(metric.infraCostUsd)} → total ${fmt(metric.totalCostUsd)} (${metric.costBasis})`,
    );
  }
  if (usage?.type === 'usage') {
    console.log(`  Plan       │ quedan ${(usage.remainingSeconds / 60).toFixed(1)} min de ${(usage.planSeconds / 60).toFixed(0)}`);
  }
  console.log(`  Total turno│ ${Date.now() - startedAt} ms\n`);
}

const spend = evaluateSpend(meter.totalCostUsd(), budget);
const entitlement = entitlementFor({
  planId: 'close',
  usedVoiceSeconds: meter.forSubject('subj_demo').voiceSeconds,
  spend,
});

console.log('── Estado final ─────────────────────────');
console.log(`  Turnos            │ ${meter.forSubject('subj_demo').turns}`);
console.log(`  Costo acumulado   │ ${fmt(meter.totalCostUsd())}`);
console.log(`  Presupuesto       │ ${(spend.spentFraction * 100).toFixed(4)}% del tope · nivel "${spend.level}"`);
console.log(`  Calidad efectiva  │ ${entitlement.quality}`);
console.log(`  Voz disponible    │ ${entitlement.canStartVoice ? 'sí' : `no (${entitlement.denial})`}`);

const proposals = memory.list('subj_demo');
console.log(`\n  Centro de memoria │ ${proposals.length} recuerdo(s) propuesto(s), ninguno activo todavía:`);
for (const item of proposals) {
  console.log(`    · [${item.status}] ${item.kind}: "${item.text}"`);
}
console.log('\n  El companion no puede usar ninguno hasta que el usuario los apruebe.\n');

socket.send(JSON.stringify({ type: 'bye' }));
socket.close();
await server.close();

function fmt(usd: number): string {
  return `$${usd.toFixed(6)}`;
}
