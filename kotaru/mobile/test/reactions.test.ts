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

test('sin gesto, solo con emocion intensa y a veces; las de Nova solo para Nova', () => {
  assert.equal(reactionFor('luna', 'happy', 'none', 0.5, 0), null);
  assert.equal(reactionFor('luna', 'happy', 'none', 0.9, 0.9), null);
  assert.equal(reactionFor('luna', 'happy', 'none', 0.9, 0.1), 'mx-laughing-standing');
  assert.equal(reactionFor('nova', 'playful', undefined, 0.9, 0.1), 'mx-blowing-a-kiss');
  assert.notEqual(reactionFor('rio', 'playful', undefined, 0.9, 0.1), 'mx-blowing-a-kiss');
  assert.equal(reactionFor('rio', 'warm', undefined, 0.9, 0.1), null);
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
