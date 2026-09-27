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
