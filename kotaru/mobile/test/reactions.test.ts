import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reactionFor, MIXAMO } from '../src/character-motion.ts';

test('los gestos de la conversacion se convierten en animaciones que existen', () => {
  const files = new Set(MIXAMO.actions.map((a) => a.file));
  for (const g of ['small_wave', 'nod', 'shrug', 'laugh_soft', 'think_pose']) {
    const f = reactionFor('luna', 'neutral', g, 0.5, 0.5);
    assert.ok(f && files.has(f), `${g} -> ${f}`);
  }
});

test('cada emocion del modelo suele dar una reaccion; las de Nova solo para Nova', () => {
  const files = new Set(MIXAMO.actions.map((a) => a.file));
  let hits = 0;
  for (const c of ['luna', 'nova', 'rio']) {
    for (const e of ['happy', 'warm', 'curious', 'thoughtful', 'playful', 'concerned', 'surprised', 'neutral']) {
      for (const roll of [0, 0.3, 0.6, 0.9]) {
        const f = reactionFor(c, e, undefined, 0.7, roll);
        if (!f) continue;
        hits += 1;
        assert.ok(files.has(f), f);
        const only = MIXAMO.actions.find((a) => a.file === f)!.only;
        assert.ok(!only || only.includes(c), `${c} no puede ${f}`);
      }
    }
  }
  assert.ok(hits > 50, `reacciones: ${hits} de 96`);
  assert.equal(reactionFor('luna', 'happy', 'none', 0.3, 0), null);
  assert.equal(reactionFor('nova', 'playful', undefined, 0.7, 0), 'mx-blowing-a-kiss');
});

test('el muestrario incluye todas las de cada personaje y ninguna ajena', async () => {
  const { showcaseList } = await import('../src/character-motion.ts');
  assert.ok(showcaseList('nova').includes('mx-blowing-a-kiss'));
  assert.ok(!showcaseList('rio').includes('mx-blowing-a-kiss'));
  assert.ok(showcaseList('luna').length >= 14);
});

test('los reposos son solo los tranquilos', () => {
  assert.ok(MIXAMO.idle.every((c) => !/happy|side-to-side/.test(c.file)));
});

test('el reposo no inclina el tronco: queda la postura propia del personaje', async () => {
  const { TORSO, TORSO_KEEP } = await import('../src/character-motion.ts');
  assert.ok(TORSO_KEEP <= 0.35);
  for (const b of ['hips', 'spine', 'chest', 'upperChest']) assert.ok(TORSO.has(b));
  assert.ok(!TORSO.has('leftUpperArm'));
});
