import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Object3D } from 'three';
import { BODY_STYLES, DEFAULT_STYLE, styleFor } from '../src/body-styles.ts';
import { IdleBody } from '../src/idle-body.ts';

function rig() {
  const bones = new Map<string, Object3D>();
  const lookup = (name: string) => {
    if (name.includes('Thumb')) return null;
    let b = bones.get(name);
    if (!b) {
      b = new Object3D();
      if (name === 'leftUpperArm') b.rotation.z = -1.2;
      if (name === 'rightUpperArm') b.rotation.z = 1.2;
      bones.set(name, b);
    }
    return b;
  };
  return { bones, lookup };
}

function run(style = DEFAULT_STYLE, speaking = true, seconds = 6) {
  const { bones, lookup } = rig();
  const body = new IdleBody(lookup as never, style);
  const seen = { hipsZ: 0, leftLower: 0, headZ: 0, headY: 0, hipsPosY: 0 };
  for (let t = 0; t < seconds; t += 1 / 30) {
    body.update(t, 1 / 30, { still: false, speaking, level: 0.8 });
    seen.hipsZ = Math.max(seen.hipsZ, Math.abs(bones.get('hips')!.rotation.z));
    seen.leftLower = Math.max(seen.leftLower, Math.abs(bones.get('leftLowerArm')!.rotation.y));
    seen.headZ = Math.max(seen.headZ, Math.abs(body.head.z));
    // Tras el primer par de segundos (el gesto de hablar tarda un momento en subir).
    if (t > 2) seen.headY = Math.max(seen.headY, Math.abs(body.head.y));
    seen.hipsPosY = Math.max(seen.hipsPosY, bones.get('hips')!.position.y);
  }
  return { seen, bones, body };
}

test('cada personaje tiene su estilo; uno desconocido usa el neutro', () => {
  assert.equal(styleFor('nova'), BODY_STYLES['nova']);
  assert.equal(styleFor('nadie'), DEFAULT_STYLE);
});

test('Nova ondula la cadera e inclina la cabeza mas que Luna', () => {
  const nova = run(BODY_STYLES['nova']).seen;
  const luna = run(BODY_STYLES['luna']).seen;
  assert.ok(nova.hipsZ > luna.hipsZ * 2);
  assert.ok(nova.headZ > luna.headZ);
});

test('Rio gesticula con los antebrazos y rebota al hablar mucho mas que Luna', () => {
  const rio = run(BODY_STYLES['rio']).seen;
  const luna = run(BODY_STYLES['luna']).seen;
  assert.ok(rio.leftLower > luna.leftLower + 0.4);
  assert.ok(rio.hipsPosY > 0.004);
  assert.equal(luna.hipsPosY, 0);
});

test('Rio mira alrededor en reposo (y no mientras habla)', () => {
  assert.ok(run(BODY_STYLES['rio'], false, 20).seen.headY > 0.05);
  assert.ok(run(BODY_STYLES['rio'], true, 20).seen.headY < 0.02);
});

test('Nova mantiene la mano en la cadera al hablar: el brazo derecho casi no se mueve', () => {
  const { bones } = run(BODY_STYLES['nova']);
  const pose = BODY_STYLES['nova']!.pose.right;
  assert.ok(Math.abs(bones.get('rightLowerArm')!.rotation.z - pose.lower[2]) < 0.05);
});

test('ningun estilo pasa de rotaciones razonables (sin atravesar el cuerpo)', () => {
  for (const style of Object.values(BODY_STYLES)) {
    const { seen } = run(style);
    assert.ok(seen.hipsZ < 0.12);
    assert.ok(seen.headZ < 0.15);
  }
});

test('el modo Coqueteo intensifica la ondulacion de Nova y el modo Amigo la suaviza', () => {
  const measure = (intensity: number) => {
    const { bones, lookup } = rig();
    const body = new IdleBody(lookup as never, BODY_STYLES['nova']);
    let max = 0;
    for (let t = 0; t < 12; t += 1 / 30) {
      body.update(t, 1 / 30, { still: false, speaking: true, level: 0.8, intensity });
      if (t > 4) max = Math.max(max, Math.abs(bones.get('hips')!.rotation.z));
    }
    return max;
  };
  assert.ok(measure(1.4) > measure(1) * 1.2);
  assert.ok(measure(0.6) < measure(1) * 0.8);
});

test('al escuchar se inclina hacia la persona y asiente (Luna mas que Rio); al dejar de oir vuelve', () => {
  const measure = (style: string) => {
    const { bones, lookup } = rig();
    const body = new IdleBody(lookup as never, BODY_STYLES[style]);
    let chestMax = 0;
    let nodMax = 0;
    for (let t = 0; t < 8; t += 1 / 30) {
      body.update(t, 1 / 30, { still: false, speaking: false, level: 0, listening: true });
      if (t > 2) {
        chestMax = Math.max(chestMax, bones.get('chest')!.rotation.x);
        nodMax = Math.max(nodMax, body.head.x);
      }
    }
    for (let t = 8; t < 12; t += 1 / 30) body.update(t, 1 / 30, { still: false, speaking: false, level: 0, listening: false });
    return { chestMax, nodMax, after: bones.get('chest')!.rotation.x };
  };
  const luna = measure('luna');
  const rio = measure('rio');
  assert.ok(luna.chestMax > 0.04);
  assert.ok(luna.nodMax > rio.nodMax);
  assert.ok(luna.after < 0.03);
});
