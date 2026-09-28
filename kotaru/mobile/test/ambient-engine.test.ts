import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EngineAmbient } from '../src/ambient-engine.ts';

/** Contexto de audio falso: solo lo que usa el motor, y registra las rampas de volumen. */
function fakeContext() {
  const ramps: { node: string; value: number; at: number }[] = [];
  let closed = false;
  const param = (node: string) => ({
    value: 0,
    setValueAtTime() {},
    cancelScheduledValues() {},
    linearRampToValueAtTime(value: number, at: number) {
      ramps.push({ node, value, at });
    },
    exponentialRampToValueAtTime() {},
  });
  let gains = 0;
  const node = (extra: object = {}) => ({ connect: (n: unknown) => n, disconnect() {}, start() {}, stop() {}, ...extra });
  const ctx = {
    currentTime: 10,
    sampleRate: 8000,
    destination: node(),
    resume: async () => undefined,
    close: async () => {
      closed = true;
    },
    createGain: () => node({ gain: param(`gain${gains++}`) }),
    createBuffer: (_c: number, length: number) => ({ duration: length / 8000, copyToChannel() {} }),
    createBufferSource: () => node({ buffer: null, loop: false }),
    createBiquadFilter: () => node({ type: '', frequency: param('f'), Q: param('q') }),
    createOscillator: () => node({ frequency: param('o') }),
  };
  return { ctx: ctx as unknown as AudioContext, ramps, isClosed: () => closed };
}

test('mientras habla el personaje el fondo baja al 15 % en 0,15 s y vuelve en 0,9 s', () => {
  const { ctx, ramps } = fakeContext();
  const ambient = new EngineAmbient(() => ctx);
  ambient.setVolume(0.8);
  ambient.play('rain');
  // gain0 es el volumen maestro (el primero que se crea).
  const master = () => ramps.filter((r) => r.node === 'gain0');
  ambient.duck(true);
  const down = master().at(-1)!;
  assert.ok(Math.abs(down.value - 0.8 * 0.15) < 1e-9, `bajo a ${down.value}`);
  assert.ok(Math.abs(down.at - (10 + 0.15)) < 1e-9);
  ambient.duck(false);
  const up = master().at(-1)!;
  assert.ok(Math.abs(up.value - 0.8) < 1e-9);
  assert.ok(Math.abs(up.at - (10 + 0.9)) < 1e-9);
  // Repetir el mismo estado no programa otra rampa (se llama cada 100 ms).
  const count = master().length;
  ambient.duck(false);
  assert.equal(master().length, count);
  ambient.dispose();
});

test('con contexto compartido (web) sale por la mezcla y al cerrar no cierra el contexto', () => {
  const { ctx, isClosed } = fakeContext();
  let connectedTo: unknown = null;
  const bus = { marker: 'bus' };
  const ambient = new EngineAmbient(() => ctx, () => undefined, { output: () => bus as unknown as AudioNode, sharedContext: true });
  const originalCreateGain = ctx.createGain.bind(ctx);
  (ctx as unknown as { createGain: () => unknown }).createGain = () => {
    const g = originalCreateGain() as unknown as { connect: (n: unknown) => unknown };
    const connect = g.connect;
    g.connect = (n: unknown) => {
      if (connectedTo === null) connectedTo = n;
      return connect(n);
    };
    return g;
  };
  ambient.play('fire');
  assert.equal(connectedTo, bus);
  ambient.dispose();
  assert.equal(isClosed(), false);
});

test('sin contexto compartido (movil) al cerrar si se cierra', () => {
  const { ctx, isClosed } = fakeContext();
  const ambient = new EngineAmbient(() => ctx);
  ambient.play('waves');
  ambient.dispose();
  assert.equal(isClosed(), true);
});
