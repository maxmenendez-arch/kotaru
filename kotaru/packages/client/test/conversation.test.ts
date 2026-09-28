import { describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION } from '@kotaru/gateway';
import { CLIENT_PROTOCOL_VERSION, ConversationClient, STATE_LABELS, type ClientEvent, type SocketLike } from '../src/index.js';

describe('cliente', () => {
  it('habla la misma version de protocolo que el servidor', () => {
    expect(CLIENT_PROTOCOL_VERSION).toBe(PROTOCOL_VERSION);
  });

  it('todo estado tiene etiqueta accesible en los dos idiomas', () => {
    expect(Object.keys(STATE_LABELS.es).sort()).toEqual(Object.keys(STATE_LABELS.en).sort());
    for (const lang of ['es', 'en'] as const) for (const label of Object.values(STATE_LABELS[lang])) expect(label.length).toBeGreaterThan(0);
  });

  it('un grant rechazado rechaza connect con el motivo', async () => {
    const events: ClientEvent[] = [];
    let socket!: FakeSocket;
    const client = new ConversationClient({
      url: 'ws://x', getGrant: async () => 'g', onEvent: (e) => events.push(e),
      createSocket: () => (socket = new FakeSocket((m) => m.type === 'hello' && socket.receive({ type: 'rejected', reason: 'replayed' }))),
    });
    await expect(client.connect()).rejects.toThrow(/replayed/);
    expect(events).toContainEqual({ type: 'rejected', reason: 'replayed' });
  });

  it('el modo elegido se envia y se reenvia al reconectar', async () => {
    const sent: { type: string; mode?: string }[] = [];
    let socket!: FakeSocket;
    const client = new ConversationClient({
      url: 'ws://x', getGrant: async () => 'g', onEvent: () => undefined,
      createSocket: () =>
        (socket = new FakeSocket((m) => {
          sent.push(m as { type: string; mode?: string });
          if (m.type === 'hello') socket.receive({ type: 'ready', sessionId: 's', protocolVersion: PROTOCOL_VERSION, voiceAvailable: true });
        })),
    });
    client.setMode('friend');
    await client.connect();
    expect(sent.filter((m) => m.type === 'mode')).toEqual([{ type: 'mode', mode: 'friend' }]);
    client.setMode('flirt');
    expect(sent.filter((m) => m.type === 'mode').at(-1)).toEqual({ type: 'mode', mode: 'flirt' });
    client.close();
  });

  it('la voz elegida en Ajustes se envia al conectar y al cambiarla; "auto" no manda nada al conectar', async () => {
    const sent: { type: string; choice?: string }[] = [];
    let socket!: FakeSocket;
    const make = () =>
      new ConversationClient({
        url: 'ws://x', getGrant: async () => 'g', onEvent: () => undefined,
        createSocket: () =>
          (socket = new FakeSocket((m) => {
            sent.push(m as { type: string; choice?: string });
            if (m.type === 'hello') socket.receive({ type: 'ready', sessionId: 's', protocolVersion: PROTOCOL_VERSION, voiceAvailable: true });
          })),
      });
    const auto = make();
    await auto.connect();
    expect(sent.filter((m) => m.type === 'voice_choice')).toEqual([]);
    auto.close();
    const client = make();
    client.setVoiceChoice('cartesia');
    await client.connect();
    expect(sent.filter((m) => m.type === 'voice_choice')).toEqual([{ type: 'voice_choice', choice: 'cartesia' }]);
    client.setVoiceChoice('auto');
    expect(sent.filter((m) => m.type === 'voice_choice').at(-1)).toEqual({ type: 'voice_choice', choice: 'auto' });
    client.close();
  });

  it('el aviso de limite no tapa la tarjeta de crisis', async () => {
    const events: ClientEvent[] = [];
    let socket!: FakeSocket;
    const client = new ConversationClient({
      url: 'ws://x', getGrant: async () => 'g', onEvent: (e) => events.push(e), newTurnId: () => 't1',
      createSocket: () =>
        (socket = new FakeSocket((m) => m.type === 'hello' && socket.receive({ type: 'ready', sessionId: 's', protocolVersion: PROTOCOL_VERSION, voiceAvailable: true }))),
    });
    await client.connect();
    client.sendText('ya no quiero vivir');
    socket.receive({ type: 'safety', turnId: 't1', action: 'crisis_handoff' });
    socket.receive({ type: 'limit', kind: 'spend' });
    await new Promise((r) => setTimeout(r, 5));
    expect(client.state).toBe('safety_handoff');
    expect(events).toContainEqual({ type: 'limit', kind: 'spend' });
    client.close();
  });

  it('pasa la emocion del turno actual al avatar y descarta la de un turno viejo', async () => {
    const events: ClientEvent[] = [];
    let socket!: FakeSocket;
    const client = new ConversationClient({
      url: 'ws://x', getGrant: async () => 'g', onEvent: (e) => events.push(e), newTurnId: () => 't1',
      createSocket: () =>
        (socket = new FakeSocket((m) => m.type === 'hello' && socket.receive({ type: 'ready', sessionId: 's', protocolVersion: PROTOCOL_VERSION, voiceAvailable: true }))),
    });
    await client.connect();
    expect(client.sendText('hola')).toBe('t1');
    socket.receive({ type: 'affect', turnId: 'viejo', emotion: 'sad', intensity: 1 });
    socket.receive({ type: 'affect', turnId: 't1', emotion: 'happy', intensity: 0.7, gesture: 'nod' });
    await new Promise((r) => setTimeout(r, 5));
    expect(events.filter((e) => e.type === 'affect')).toEqual([{ type: 'affect', emotion: 'happy', intensity: 0.7, gesture: 'nod' }]);
    client.close();
  });
});

/** Socket falso minimo: abre al instante y deja al test responder. */
class FakeSocket implements SocketLike {
  readyState = 0;
  binaryType = 'arraybuffer';
  onopen: SocketLike['onopen'] = null;
  onclose: SocketLike['onclose'] = null;
  onerror: SocketLike['onerror'] = null;
  onmessage: SocketLike['onmessage'] = null;
  constructor(private readonly onClientMessage: (m: { type: string }) => void) {
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.({});
    }, 0);
  }
  send(data: unknown): void {
    if (typeof data === 'string') this.onClientMessage(JSON.parse(data) as { type: string });
  }
  close(): void {
    this.readyState = 3;
    this.onclose?.({ code: 1000 });
  }
  receive(message: object): void {
    setTimeout(() => this.onmessage?.({ data: JSON.stringify(message) }), 0);
  }
}
