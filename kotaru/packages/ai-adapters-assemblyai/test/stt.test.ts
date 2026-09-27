import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import { WebSocketServer, type WebSocket } from 'ws';
import { ProviderError, type AudioChunk, type ProviderContext, type TranscriptEvent } from '@kotaru/ai-contracts';
import { AssemblyAiSttProvider } from '../src/index.js';

/**
 * Servidor falso que habla el protocolo documentado de AssemblyAI v3 (Begin, Turn,
 * Termination, ForceEndpoint, Terminate). Las pruebas no tocan la red ni gastan dinero.
 */
interface Script {
  readonly partialsEveryBytes?: number;
  readonly words?: readonly string[];
  /** Cierra la sesion con este codigo tras el primer audio. */
  readonly closeWith?: number;
  /** Rechaza el handshake con este estado HTTP. */
  readonly rejectStatus?: number;
  /** Emite un fin de turno a mitad (pausa del usuario) tras estos bytes. */
  readonly midTurnEndAfterBytes?: number;
}

interface Seen {
  headers: Record<string, string | string[] | undefined>;
  query: URLSearchParams;
  frameBytes: number[];
  control: string[];
}

let wss: WebSocketServer | null = null;

async function fakeServer(script: Script): Promise<{ url: string; seen: Seen }> {
  const seen: Seen = { headers: {}, query: new URLSearchParams(), frameBytes: [], control: [] };
  wss = new WebSocketServer({
    port: 0,
    verifyClient: (_info, done) => (script.rejectStatus ? done(false, script.rejectStatus) : done(true)),
  });
  wss.on('connection', (socket: WebSocket, req) => {
    seen.headers = req.headers;
    seen.query = new URL(req.url ?? '/', 'http://x').searchParams;
    const words = script.words ?? ['hola', 'que', 'tal'];
    let bytes = 0;
    let turnOrder = 0;
    let emitted = 0;
    let sentMidEnd = false;
    const started = Date.now();
    socket.send(JSON.stringify({ type: 'Begin', id: 'sess_1', expires_at: 0 }));
    socket.on('message', (data: Buffer, isBinary: boolean) => {
      if (isBinary) {
        seen.frameBytes.push(data.byteLength);
        bytes += data.byteLength;
        if (script.closeWith) {
          socket.close(script.closeWith, 'cerrado');
          return;
        }
        if (script.midTurnEndAfterBytes && !sentMidEnd && bytes >= script.midTurnEndAfterBytes) {
          sentMidEnd = true;
          socket.send(JSON.stringify({ type: 'Turn', turn_order: turnOrder++, end_of_turn: true, transcript: 'primera parte' }));
          return;
        }
        const every = script.partialsEveryBytes ?? 6400;
        const target = Math.min(words.length, Math.floor(bytes / every));
        if (target > emitted) {
          emitted = target;
          socket.send(JSON.stringify({ type: 'Turn', turn_order: turnOrder, end_of_turn: false, transcript: words.slice(0, target).join(' ') }));
        }
        return;
      }
      const message = JSON.parse(data.toString()) as { type: string };
      seen.control.push(message.type);
      if (message.type === 'ForceEndpoint' && emitted > 0) {
        socket.send(JSON.stringify({ type: 'Turn', turn_order: turnOrder++, end_of_turn: true, transcript: words.slice(0, emitted).join(' ') }));
      }
      if (message.type === 'Terminate') {
        socket.send(JSON.stringify({ type: 'Termination', audio_duration_seconds: 2, session_duration_seconds: 36 }));
        socket.close(1000);
      }
      void started;
    });
  });
  await new Promise<void>((resolve) => wss!.once('listening', () => resolve()));
  const port = (wss.address() as AddressInfo).port;
  return { url: `ws://127.0.0.1:${port}/v3/ws`, seen };
}

afterEach(async () => {
  await new Promise<void>((resolve) => (wss ? wss.close(() => resolve()) : resolve()));
  wss = null;
});

function ctx(signal = new AbortController().signal): ProviderContext {
  return {
    requestId: 'r', subjectId: 's', region: 'us', locale: 'es-419', sensitivity: 'standard',
    budget: { sessionRemainingUsd: 1, monthlyRemainingUsd: 1, hardCapUsd: 1 }, deadlineMs: 5000, signal,
  };
}

/** Audio a ritmo real en trozos de 20 ms, como lo manda el telefono. */
async function* audio(ms: number, sampleRate: 16000 | 24000 = 24000): AsyncIterable<AudioChunk> {
  const chunkBytes = (sampleRate * 2 * 20) / 1000;
  for (let i = 0; i < ms / 20; i += 1) {
    yield { pcm: new Uint8Array(chunkBytes), sampleRate, seq: i };
    if (i % 5 === 4) await new Promise((r) => setTimeout(r, 5));
  }
}

async function collect(events: AsyncIterable<TranscriptEvent>): Promise<TranscriptEvent[]> {
  const out: TranscriptEvent[] = [];
  for await (const e of events) out.push(e);
  return out;
}

const provider = (url: string, extra: Partial<ConstructorParameters<typeof AssemblyAiSttProvider>[0]> = {}) =>
  new AssemblyAiSttProvider({ apiKey: 'clave-de-prueba', url, zeroRetentionConfirmed: true, finalizeTimeoutMs: 800, ...extra });

describe('AssemblyAI streaming v3', () => {
  it('se autentica con la clave sin "Bearer" y pide el modelo multilingue en pcm_s16le', async () => {
    const { url, seen } = await fakeServer({});
    await collect(provider(url, { keyterms: ['Kotaru', 'Rio'] }).transcribeStream(audio(600), ctx()));
    expect(seen.headers.authorization).toBe('clave-de-prueba');
    expect(seen.query.get('speech_model')).toBe('universal-streaming-multilingual');
    expect(seen.query.get('encoding')).toBe('pcm_s16le');
    expect(seen.query.get('sample_rate')).toBe('24000');
    expect(JSON.parse(seen.query.get('keyterms_prompt')!)).toEqual(['Kotaru', 'Rio']);
  });

  it('manda el audio en tramos de entre 50 y 1000 ms, aunque le lleguen de 20', async () => {
    const { url, seen } = await fakeServer({});
    await collect(provider(url).transcribeStream(audio(730), ctx()));
    const msPerByte = 1000 / (24000 * 2);
    const durations = seen.frameBytes.map((b) => b * msPerByte);
    expect(Math.min(...durations)).toBeGreaterThanOrEqual(50);
    expect(Math.max(...durations)).toBeLessThanOrEqual(1000);
    expect(seen.frameBytes.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(24000 * 2 * 0.73);
  });

  it('entrega parciales, un solo final y cierra la sesion con Terminate', async () => {
    const { url, seen } = await fakeServer({ partialsEveryBytes: 9600 });
    const events = await collect(provider(url).transcribeStream(audio(800), ctx()));
    const partials = events.filter((e) => e.type === 'partial');
    const finals = events.filter((e) => e.type === 'final');
    expect(partials.length).toBeGreaterThan(0);
    expect(finals).toEqual([expect.objectContaining({ text: 'hola que tal' })]);
    expect(events.map((e) => e.type).slice(-3)).toEqual(['endpoint', 'final', 'usage']);
    expect(seen.control).toEqual(['ForceEndpoint', 'Terminate']);
  });

  it('cobra por duracion de sesion, que es como factura AssemblyAI', async () => {
    const { url } = await fakeServer({});
    const events = await collect(provider(url).transcribeStream(audio(400), ctx()));
    const usage = events.find((e) => e.type === 'usage');
    // 36 s de sesion a 0.15 USD/h = 0.0015 USD
    expect(usage).toMatchObject({ cost: { amountUsd: 0.0015, basis: 'verified', verifiedAt: '2026-09-27' } });
  });

  it('junta en un final los tramos que AssemblyAI corto por una pausa', async () => {
    const { url } = await fakeServer({ midTurnEndAfterBytes: 9600, partialsEveryBytes: 20000, words: ['y', 'luego', 'esto'] });
    const events = await collect(provider(url).transcribeStream(audio(900), ctx()));
    const final = events.find((e) => e.type === 'final');
    // La pausa cerro 'primera parte'; lo que siguio se suma, en orden, al mismo final.
    expect(final).toMatchObject({ text: 'primera parte y luego' });
  });

  it('una clave rechazada es un error no reintentable', async () => {
    const { url } = await fakeServer({ rejectStatus: 401 });
    const error = await collect(provider(url).transcribeStream(audio(200), ctx())).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ProviderError);
    expect(error).toMatchObject({ code: 'handshake_rejected', retryable: false, status: 401 });
  });

  it('un cierre 1008 a mitad de sesion se traduce a unauthorized', async () => {
    const { url } = await fakeServer({ closeWith: 1008 });
    const error = await collect(provider(url).transcribeStream(audio(300), ctx())).catch((e: unknown) => e);
    expect(error).toMatchObject({ code: 'unauthorized', retryable: false });
  });

  it('cancelar corta la sesion enseguida', async () => {
    const { url, seen } = await fakeServer({});
    const controller = new AbortController();
    const started = Date.now();
    setTimeout(() => controller.abort(), 150);
    await collect(provider(url).transcribeStream(audio(5000), ctx(controller.signal))).catch(() => undefined);
    expect(Date.now() - started).toBeLessThan(2500);
    expect(seen.control).toContain('Terminate');
  });

  it('sin confirmar retencion cero, el router no puede elegirlo', () => {
    const p = new AssemblyAiSttProvider({ apiKey: 'k', zeroRetentionConfirmed: false });
    expect(p.descriptor.retentionKnown).toBe(false);
    expect(p.descriptor.trainingOptOut).toBe('unknown');
  });

  it('el modelo solo-ingles no se ofrece para espanol', () => {
    const p = new AssemblyAiSttProvider({ apiKey: 'k', zeroRetentionConfirmed: true, speechModel: 'universal-streaming-english' });
    expect(p.descriptor.locales).toEqual(['en-US']);
  });

  it('si le llega audio acumulado, no lo manda a mas de 1.2x tiempo real', async () => {
    const { url, seen } = await fakeServer({});
    // 3 s de audio entregados de golpe, como tras un corte de red.
    async function* burst(): AsyncIterable<AudioChunk> {
      for (let i = 0; i < 150; i += 1) yield { pcm: new Uint8Array(960), sampleRate: 24000, seq: i };
    }
    const started = Date.now();
    await collect(provider(url).transcribeStream(burst(), ctx()));
    const elapsed = Date.now() - started;
    // 3000 ms de audio con 1000 ms de margen a 1.2x: al menos ~1650 ms de envio.
    expect(elapsed).toBeGreaterThanOrEqual(1500);
    expect(seen.frameBytes.reduce((a, b) => a + b, 0)).toBe(150 * 960);
  });
});
