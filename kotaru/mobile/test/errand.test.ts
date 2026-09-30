import { test } from 'node:test';
import assert from 'node:assert/strict';
import { errandAt, errandDuration, planErrand, ERRAND } from '../src/errand.ts';

const plan = planErrand(1, 1.0, 4);
const total = errandDuration(plan);

function sample(step = 0.05) {
  const out = [];
  for (let t = 0; t < total + 0.5; t += step) out.push({ t, ...errandAt(plan, t) });
  return out;
}

test('el recado empieza con el gesto, en su sitio, y termina de frente en su sitio', () => {
  const f0 = errandAt(plan, 0.8);
  assert.equal(f0.step, 'wait');
  assert.ok(f0.gesture > 0.9);
  assert.equal(f0.x, 0);
  const end = errandAt(plan, total + 0.1);
  assert.equal(end.step, 'done');
  assert.deepEqual([end.x, end.z, end.yaw, end.walk], [0, 0, 0, 0]);
});

test('sale por el lado elegido y la voz se va con ella', () => {
  const away = sample().find((f) => f.step === 'away')!;
  assert.ok(away.x > ERRAND.side - 0.01);
  assert.equal(away.pan, 1);
  assert.equal(away.far, 1);
  const left = errandAt(planErrand(-1, 1, 4), ERRAND.wait + ERRAND.turn + 1.5);
  assert.ok(left.x < 0 && left.pan < 0);
});

test('el vaso: lo trae, bebe y se lo lleva; no aparece ni desaparece en cuadro', () => {
  const frames = sample();
  const order: string[] = [];
  for (const f of frames) if (order[order.length - 1] !== f.glass) order.push(f.glass);
  assert.deepEqual(order, ['none', 'carry', 'drink', 'carry', 'none']);
  // Los cambios de «sin vaso» a «con vaso» (y al reves) solo pasan fuera de cuadro.
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]!;
    const b = frames[i]!;
    if ((a.glass === 'none') !== (b.glass === 'none') && b.step !== 'done') assert.equal(b.step, 'away', `cambio en ${b.step} a los ${b.t.toFixed(2)} s`);
  }
});

test('sin saltos: posicion y giro cambian poco entre cuadros (salvo el giro fuera de cuadro)', () => {
  const frames = sample(1 / 30);
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]!;
    const b = frames[i]!;
    assert.ok(Math.hypot(b.x - a.x, b.z - a.z) < 0.08, `salto de posicion en ${b.step}`);
    const dy = Math.abs(Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw)));
    if (a.step !== 'away' && b.step !== 'away') assert.ok(dy < 0.2, `giro brusco en ${a.step}->${b.step}`);
  }
});

test('anda a la velocidad del clip (los pies no patinan)', () => {
  const all = sample(0.01);
  const first = all.findIndex((f) => f.step === 'out');
  const end = all.findIndex((f, i) => i > first && f.step !== 'out');
  const out = all.slice(first, end);
  const a = out[5]!;
  const b = out[out.length - 5]!;
  const v = Math.hypot(b.x - a.x, b.z - a.z) / (b.t - a.t);
  assert.ok(Math.abs(v - 1.0) < 0.06, `velocidad ${v}`);
});
