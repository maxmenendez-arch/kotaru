import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NOVA_POSES, SPOTS, POSE_HOLD } from '../src/nova-poses.ts';

test('cada pose de Nova usa puntos de mano que existen, y hay variedad', () => {
  assert.ok(NOVA_POSES.length >= 8);
  for (const p of NOVA_POSES) {
    assert.ok(p.a in SPOTS && p.b in SPOTS, p.name);
    assert.ok(Math.abs(p.tilt) < 0.3 && Math.abs(p.turn) < 0.4 && Math.abs(p.lean) < 0.15, `${p.name}: sin posturas forzadas`);
  }
  assert.equal(new Set(NOVA_POSES.map((p) => p.name)).size, NOVA_POSES.length);
});

test('las poses se mantienen un rato (no cambia de pose cada poco)', () => {
  assert.ok(POSE_HOLD[0] >= 8 && POSE_HOLD[1] > POSE_HOLD[0]);
});

test('los puntos de las manos estan cerca del cuerpo (a menos de 35 cm de su ancla)', () => {
  for (const [name, s] of Object.entries(SPOTS)) {
    assert.ok(Math.hypot(...s.off) < 0.35, name);
    assert.ok(s.curl >= 0 && s.curl <= 1, name);
  }
});
