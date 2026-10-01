import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reactionFor, reactionOptions, MIXAMO } from '../src/character-motion.ts';
const require_ = () => ({ reactionOptions });

test('los gestos de la conversacion se convierten en animaciones que existen', () => {
  const files = new Set(MIXAMO.actions.map((a) => a.file));
  for (const g of ['small_wave', 'nod', 'shrug', 'laugh_soft', 'think_pose']) {
    const f = reactionFor('luna', 'neutral', g, 0.5, 0.5);
    assert.ok(f && files.has(f), `${g} -> ${f}`);
  }
});

test('cada emocion da reacciones que existen; las de Nova solo para Nova', () => {
  const { reactionOptions } = require_();
  for (const c of ['luna', 'nova', 'rio']) {
    for (const e of ['happy', 'warm', 'curious', 'thoughtful', 'playful', 'concerned', 'surprised', 'neutral']) {
      for (const f of reactionOptions(c, e, undefined)) {
        const spec = MIXAMO.actions.find((a) => a.file === f);
        assert.ok(spec, f);
        assert.ok(!spec!.only || spec!.only.includes(c), `${c} no puede ${f}`);
      }
    }
  }
});

test('un piropo tras otro no repite la misma reaccion', () => {
  for (const c of ['luna', 'nova', 'rio']) {
    const recent: string[] = [];
    for (let i = 0; i < 30; i++) {
      const f = reactionFor(c, 'warm', undefined, 0.7, (i * 0.618) % 1, recent);
      if (!f) continue;
      assert.ok(!recent.slice(-2).includes(f), `${c} repitio ${f}`);
      recent.push(f);
    }
    assert.ok(recent.length >= 15, `${c} reacciono ${recent.length} de 30`);
  }
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
