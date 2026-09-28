import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AFFECT_HOLD_MS, approach, Blinker, gestureOffset, mouthShapes, RESTING_FACE, stateOffset, targetFace } from '../src/avatar-motion.ts';

test('sin emocion, cada personaje tiene su cara de reposo', () => {
  assert.deepEqual(targetFace('luna', null, 0), { happy: 0.08, sad: 0, relaxed: 0.12, surprised: 0 });
  assert.equal(targetFace('rio', null, 0).happy, RESTING_FACE['rio']!.happy);
});

test('la emocion se ve a su intensidad, se mantiene y luego vuelve al reposo', () => {
  const affect = { emotion: 'happy', intensity: 1, at: 1000 };
  assert.equal(targetFace('nova', affect, 1000).happy, 0.75);
  assert.equal(targetFace('nova', affect, 1000 + AFFECT_HOLD_MS).happy, 0.75);
  assert.deepEqual(targetFace('nova', affect, 1000 + AFFECT_HOLD_MS + 60_000), targetFace('nova', null, 0));
  const mid = targetFace('nova', affect, 1000 + AFFECT_HOLD_MS + 1250).happy;
  assert.ok(mid > 0.15 && mid < 0.75);
});

test('emocion desconocida o intensidad fuera de rango no rompe nada', () => {
  assert.deepEqual(targetFace('luna', { emotion: 'furioso', intensity: 1, at: 0 }, 0), { happy: 0, sad: 0, relaxed: 0, surprised: 0 });
  const face = targetFace('luna', { emotion: 'concerned', intensity: 7, at: 0 }, 0);
  assert.equal(face.sad, 0.45);
  for (const v of Object.values(face)) assert.ok(v >= 0 && v <= 1);
});

test('approach converge sin pasarse, igual a cualquier fps', () => {
  let a = 0;
  for (let i = 0; i < 60; i++) a = approach(a, 1, 1 / 60, 4);
  let b = 0;
  for (let i = 0; i < 30; i++) b = approach(b, 1, 1 / 30, 4);
  assert.ok(Math.abs(a - b) < 1e-9);
  assert.ok(a < 1 && a > 0.95);
});

test('parpadea cada pocos segundos, rapido, y vuelve a abrir', () => {
  const blinker = new Blinker(() => 0.5, 0);
  let closed = 0;
  let blinks = 0;
  let prev = 0;
  for (let t = 0; t < 30; t += 1 / 60) {
    const w = blinker.weight(t);
    assert.ok(w >= 0 && w <= 1);
    if (w > 0.5) closed += 1 / 60;
    if (prev === 0 && w > 0) blinks++;
    prev = w;
  }
  assert.ok(blinks >= 4 && blinks <= 10, `parpadeos: ${blinks}`);
  assert.ok(closed < 1, 'los ojos casi siempre abiertos');
});

test('gestos: asentir mueve la cabeza arriba y abajo y termina; los desconocidos no hacen nada', () => {
  const peak = Math.max(...Array.from({ length: 90 }, (_, i) => Math.abs(gestureOffset('nod', i / 100).x)));
  assert.ok(peak > 0.02 && peak < 0.2);
  assert.deepEqual(gestureOffset('nod', 5), { x: 0, y: 0, z: 0 });
  assert.deepEqual(gestureOffset('point_up', 0.3), { x: 0, y: 0, z: 0 });
  assert.deepEqual(gestureOffset(undefined, 0.3), { x: 0, y: 0, z: 0 });
  assert.ok(stateOffset('listening').z > 0);
  assert.deepEqual(stateOffset('idle'), { x: 0, y: 0, z: 0 });
});

test('la boca se abre con el volumen y se cierra en silencio', () => {
  assert.deepEqual(mouthShapes(0, 1.23), { aa: 0, oh: 0, ih: 0 });
  const loud = mouthShapes(1, 0.4);
  assert.ok(loud.aa >= 0.55 && loud.aa <= 0.9);
  const clipped = mouthShapes(5, 0.4);
  assert.deepEqual(clipped, loud);
});
