import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Object3D } from 'three';
import { IdleBody, bodyGestureOffset, emotionEnergy } from '../src/idle-body.ts';

function rig() {
  const bones = new Map<string, Object3D>();
  const lookup = (name: string) => {
    if (name.includes('Thumb')) return null;
    let b = bones.get(name);
    if (!b) {
      b = new Object3D();
      if (name === 'leftUpperArm') b.rotation.z = -1.2;
      bones.set(name, b);
    }
    return b;
  };
  return { bones, lookup };
}

test('encuentra torso, brazos y dedos', () => {
    const { lookup } = rig();
    assert.equal(new IdleBody(lookup as never).boneCount, 12 + 2 * 4 * 3);
  });

test('dobla los dedos hacia la palma en cada mano', () => {
    const { bones, lookup } = rig();
    new IdleBody(lookup as never);
    assert.ok(bones.get('leftMiddleProximal')!.rotation.z < 0);
    assert.ok(bones.get('rightMiddleProximal')!.rotation.z > 0);
  });

test('se mueve alrededor de la postura de partida sin alejarse', () => {
    const { bones, lookup } = rig();
    const body = new IdleBody(lookup as never);
    for (let t = 0; t < 30; t += 1 / 30) body.update(t, 1 / 30, { still: false, speaking: t > 10 && t < 20, level: 0.8 });
    assert.ok(Math.abs(bones.get('leftUpperArm')!.rotation.z + 1.2) < 0.15);
    assert.ok(Math.abs(bones.get('hips')!.rotation.z) < 0.05);
  });

test('al hablar dobla mas el codo', () => {
    const { bones, lookup } = rig();
    const body = new IdleBody(lookup as never);
    for (let t = 0; t < 2; t += 1 / 30) body.update(t, 1 / 30, { still: false, speaking: false, level: 0 });
    const quiet = bones.get('leftLowerArm')!.rotation.y;
    for (let t = 2; t < 4; t += 1 / 30) body.update(t, 1 / 30, { still: false, speaking: true, level: 0.8 });
    assert.ok(bones.get('leftLowerArm')!.rotation.y < quiet - 0.1);
  });

test('con movimiento reducido solo respira', () => {
    const { bones, lookup } = rig();
    const body = new IdleBody(lookup as never);
    body.update(5, 1 / 30, { still: true, speaking: true, level: 1 });
    assert.equal(bones.get('hips')!.rotation.z, 0);
    assert.equal(bones.get('leftUpperArm')!.rotation.z, -1.2);
  });

test('la mirada vuelve casi siempre al centro y cambia cada pocos segundos', () => {
    const body = new IdleBody((() => null) as never);
    const seen = new Set<string>();
    for (let t = 0; t < 60; t += 0.1) {
      const g = body.glance(t);
      assert.ok(Math.abs(g.x) <= 0.04);
      seen.add(`${g.x},${g.y}`);
    }
    assert.ok(seen.size > 3);
  });

test('gestos de cuerpo: encoger hombros sube los hombros y termina a tiempo', () => {
  assert.ok(bodyGestureOffset('shrug', 0.6).shoulders > 0.1);
  assert.deepEqual(bodyGestureOffset('shrug', 2), { shoulders: 0, chest: 0, bounce: 0 });
  assert.ok(bodyGestureOffset('lean_in', 0.8).chest > 0.05);
  assert.deepEqual(bodyGestureOffset('small_wave', 0.5), { shoulders: 0, chest: 0, bounce: 0 });
});

test('energia por emocion: alegre amplia, preocupada recoge, desconocida neutra', () => {
  assert.ok(emotionEnergy('happy', 1) > 1.2);
  assert.ok(emotionEnergy('concerned', 1) < 0.8);
  assert.equal(emotionEnergy('neutral', 1), 1);
  assert.ok(Math.abs(emotionEnergy('happy', 0) - 1) < 1e-9);
});

import { armEnvelope, armForGesture } from '../src/idle-body.ts';

test('gestos del servidor en la conversacion: saludar, pensar y señalar mueven el brazo', () => {
  assert.equal(armForGesture('small_wave'), 'wave');
  assert.equal(armForGesture('think_pose'), 'chin');
  assert.equal(armForGesture('point_up'), 'point');
  assert.equal(armForGesture('nod'), null);
  assert.equal(armEnvelope(-1), 0);
  assert.ok(armEnvelope(0.1) > 0 && armEnvelope(0.1) < 1);
  assert.equal(armEnvelope(1), 1);
  assert.equal(armEnvelope(3), 0);
});

test('gesto por emocion: solo con emocion clara, del personaje que toca y no siempre', async () => {
  const { armForEmotion } = await import('../src/idle-body.ts');
  assert.equal(armForEmotion('luna', 'warm', 0.9, 3000), 'chest');
  assert.equal(armForEmotion('rio', 'curious', 0.9, 0), 'point');
  assert.equal(armForEmotion('nova', 'curious', 0.8, 6000), 'chin');
  assert.equal(armForEmotion('luna', 'warm', 0.5, 3000), null);
  assert.equal(armForEmotion('luna', 'happy', 0.9, 3000), null);
  assert.equal(armForEmotion('rio', 'warm', 0.9, 3000), null);
  const hits = Array.from({ length: 30 }, (_, i) => armForEmotion('luna', 'warm', 0.9, i * 1000)).filter(Boolean).length;
  assert.equal(hits, 10);
});
