import assert from 'node:assert/strict';
import { test } from 'node:test';
import { candleFlicker, neonPulse, PALETTES, SCENE_FOR, seeded, sway, type SceneId } from '../src/scenes.ts';

test('cada personaje tiene su fondo y su paleta', () => {
  assert.deepEqual(SCENE_FOR, { luna: 'luna-office', nova: 'nova-room', rio: 'rio-outdoors' });
  for (const id of Object.values(SCENE_FOR) as SceneId[]) {
    const p = PALETTES[id];
    assert.ok(p, id);
    assert.ok(p.fogNear < p.fogFar, `${id}: la niebla empieza antes de acabar`);
    // La niebla empieza detras del personaje (a ~1,4 m de la camara): no le nubla la cara.
    assert.ok(p.fogNear >= 3, `${id}: niebla demasiado cerca`);
  }
});

test('la escena sale igual cada vez (semilla fija)', () => {
  const a = seeded(42);
  const b = seeded(42);
  const xs = Array.from({ length: 5 }, () => a());
  assert.deepEqual(xs, Array.from({ length: 5 }, () => b()));
  for (const x of xs) assert.ok(x >= 0 && x < 1);
  assert.notDeepEqual(xs, Array.from({ length: 5 }, seeded(43)));
});

test('velas, neon y balanceo se mueven poco y nunca apagan del todo', () => {
  for (let t = 0; t < 60; t += 0.037) {
    const f = candleFlicker(t, 1.3);
    assert.ok(f >= 0.72 - 1e-9 && f <= 1 + 1e-9, `vela ${f}`);
    const n = neonPulse(t);
    assert.ok(n >= 0.85 - 1e-9 && n <= 1 + 1e-9, `neon ${n}`);
    assert.ok(Math.abs(sway(t, 0.5, 0.05)) <= 0.05 + 1e-9);
  }
  // Con "reducir movimiento" el visor pasa t = 0: todo queda en una posicion fija.
  assert.equal(sway(0, 0, 0.05), sway(0, 0, 0.05));
});

test('acabado de camara: cada escena tiene valores razonables', () => {
  for (const id of Object.keys(PALETTES) as SceneId[]) {
    const g = PALETTES[id].grade;
    assert.ok(g.blur >= 0 && g.blur <= 1);
    assert.ok(g.vignette < 0.6);
    assert.ok(g.saturation > 0.8 && g.saturation < 1.3);
    assert.ok(g.bloomThreshold > 0.2);
  }
});
