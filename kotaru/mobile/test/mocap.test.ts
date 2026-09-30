import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { Quaternion, Vector3 } from 'three';
import { parseClip, Retarget, type MotionClipJson, type RigRest } from '../src/mocap.ts';
import { MotionPlayer } from '../src/motion-player.ts';

// Esqueleto de prueba en T, mirando a +Z (como un VRM 1), medidas humanas en metros.
function rig(): RigRest {
  const P: Record<string, [number, number, number]> = {
    hips: [0, 1, 0], spine: [0, 1.1, 0], chest: [0, 1.25, 0], upperChest: [0, 1.35, 0], neck: [0, 1.5, 0], head: [0, 1.6, 0],
    leftShoulder: [0.05, 1.45, 0], leftUpperArm: [0.15, 1.45, 0], leftLowerArm: [0.43, 1.45, 0], leftHand: [0.68, 1.45, 0], leftMiddleProximal: [0.76, 1.45, 0],
    rightShoulder: [-0.05, 1.45, 0], rightUpperArm: [-0.15, 1.45, 0], rightLowerArm: [-0.43, 1.45, 0], rightHand: [-0.68, 1.45, 0], rightMiddleProximal: [-0.76, 1.45, 0],
    leftUpperLeg: [0.1, 0.95, 0], leftLowerLeg: [0.1, 0.52, 0], leftFoot: [0.1, 0.08, 0], leftToes: [0.1, 0.02, 0.12],
    rightUpperLeg: [-0.1, 0.95, 0], rightLowerLeg: [-0.1, 0.52, 0], rightFoot: [-0.1, 0.08, 0], rightToes: [-0.1, 0.02, 0.12],
  };
  const parents: Record<string, string | null> = {
    hips: null, spine: 'hips', chest: 'spine', upperChest: 'chest', neck: 'upperChest', head: 'neck',
    leftShoulder: 'upperChest', leftUpperArm: 'leftShoulder', leftLowerArm: 'leftUpperArm', leftHand: 'leftLowerArm', leftMiddleProximal: 'leftHand',
    rightShoulder: 'upperChest', rightUpperArm: 'rightShoulder', rightLowerArm: 'rightUpperArm', rightHand: 'rightLowerArm', rightMiddleProximal: 'rightHand',
    leftUpperLeg: 'hips', leftLowerLeg: 'leftUpperLeg', leftFoot: 'leftLowerLeg', leftToes: 'leftFoot',
    rightUpperLeg: 'hips', rightLowerLeg: 'rightUpperLeg', rightFoot: 'rightLowerLeg', rightToes: 'rightFoot',
  };
  return { positions: new Map(Object.entries(P).map(([k, v]) => [k, new Vector3(...v)])), parents: new Map(Object.entries(parents)) };
}

/** Clip sintetico: mismo esqueleto que el de prueba y una rotacion por hueso (o la identidad). */
function clip(frames: number, rot: (bone: string, f: number) => Quaternion): MotionClipJson {
  const r = rig();
  const bones = ['hips', 'spine', 'chest', 'upperChest', 'neck', 'head', 'leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand', 'rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand', 'leftUpperLeg', 'leftLowerLeg', 'leftFoot', 'leftToes', 'rightUpperLeg', 'rightLowerLeg', 'rightFoot', 'rightToes'];
  const child: Record<string, string> = { hips: 'spine', spine: 'chest', chest: 'upperChest', upperChest: 'neck', neck: 'head', leftShoulder: 'leftUpperArm', leftUpperArm: 'leftLowerArm', leftLowerArm: 'leftHand', leftHand: 'leftMiddleProximal', rightShoulder: 'rightUpperArm', rightUpperArm: 'rightLowerArm', rightLowerArm: 'rightHand', rightHand: 'rightMiddleProximal', leftUpperLeg: 'leftLowerLeg', leftLowerLeg: 'leftFoot', leftFoot: 'leftToes', rightUpperLeg: 'rightLowerLeg', rightLowerLeg: 'rightFoot', rightFoot: 'rightToes' };
  const dirs: Record<string, number[]> = {};
  for (const b of bones) dirs[b] = child[b] ? r.positions.get(child[b]!)!.clone().sub(r.positions.get(b)!).normalize().toArray() : [0, 1, 0];
  const q = new Int16Array(frames * bones.length * 4);
  for (let f = 0; f < frames; f++) bones.forEach((b, i) => {
    const x = rot(b, f);
    q.set([x.x, x.y, x.z, x.w].map((v) => Math.round(v * 32767)), (f * bones.length + i) * 4);
  });
  const p = new Int16Array(frames * 3);
  const b64 = (a: Int16Array) => Buffer.from(a.buffer).toString('base64');
  return { v: 1, source: 'prueba', fps: 30, frames, bones, rest: { dirs, up: [0, 1, 0], left: [1, 0, 0] }, q: b64(q), p: b64(p) };
}

const near = (a: Quaternion, b: Quaternion, eps = 0.02) => Math.abs(a.dot(b)) > 1 - eps;

test('mismo esqueleto y sin movimiento: cada hueso queda en reposo', () => {
  const rt = new Retarget(parseClip(clip(10, () => new Quaternion())), rig());
  const out = new Map<string, Quaternion>();
  const hips = new Vector3();
  rt.pose(0.1, out, hips);
  for (const [b, q] of out) assert.ok(near(q, new Quaternion()), b);
  assert.ok(hips.length() < 1e-6);
});

test('el codo doblado en la captura se dobla en el personaje (solo ese hueso)', () => {
  const bend = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 1.2);
  const rt = new Retarget(parseClip(clip(10, (b) => (b === 'leftLowerArm' || b === 'leftHand' ? bend : new Quaternion()))), rig());
  const out = new Map<string, Quaternion>();
  rt.pose(0.1, out, new Vector3());
  assert.ok(near(out.get('leftLowerArm')!, bend));
  assert.ok(near(out.get('leftHand')!, new Quaternion()), 'la mano sigue al antebrazo sin girar de mas');
  assert.ok(near(out.get('leftUpperArm')!, new Quaternion()));
});

test('si en la captura la persona miraba de lado, el personaje queda de frente', () => {
  const turned = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  const rt = new Retarget(parseClip(clip(20, (b) => turned.clone())), rig());
  const out = new Map<string, Quaternion>();
  rt.pose(0.2, out, new Vector3());
  assert.ok(near(out.get('hips')!, new Quaternion()), 'cadera de frente');
});

test('los clips de la app se cargan y dan rotaciones validas para un personaje', () => {
  for (const file of ['idle-82_08', 'idle-82_08-m', 'idle-40_11', 'talk-18_08', 'act-drink-79_38', 'act-drink-79_38-m', 'act-hair-81_01', 'act-adjust-79_24']) {
    const c = parseClip(JSON.parse(readFileSync(new URL(`../public/motions/${file}.json`, import.meta.url), 'utf8')) as MotionClipJson);
    assert.ok(c.duration >= 2, file);
    const rt = new Retarget(c, rig());
    const out = new Map<string, Quaternion>();
    const hips = new Vector3();
    for (const t of [0, c.duration / 2, c.duration - 0.05]) {
      rt.pose(t, out, hips);
      for (const [b, q] of out) assert.ok(Number.isFinite(q.w) && Math.abs(q.length() - 1) < 1e-3, `${file} ${b}`);
      // En su sitio: la cadera no se aleja mas de un palmo.
      assert.ok(Math.hypot(hips.x, hips.z) < 0.25, `${file} se desplaza ${hips.toArray()}`);
    }
  }
});

test('mezclador: entra con fundido, cambia de clip sin saltos y deja de pesar al parar', () => {
  const a = new Retarget(parseClip(clip(60, () => new Quaternion())), rig());
  const bend = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 1);
  const b = new Retarget(parseClip(clip(60, (x) => (x === 'leftLowerArm' ? bend : new Quaternion()))), rig());
  const m = new MotionPlayer();
  m.play('a', a, 2, { fadeIn: 0.5, loop: true });
  m.update(0.25);
  assert.ok(m.weight > 0.4 && m.weight < 0.6);
  m.update(0.5);
  assert.equal(m.weight, 1);
  m.stop('a');
  m.play('b', b, 2, { fadeIn: 0.5, loop: true });
  let prev = 0;
  for (let i = 0; i < 10; i++) {
    m.update(0.05);
    const angle = 2 * Math.acos(Math.min(1, Math.abs(m.pose.get('leftLowerArm')!.w)));
    assert.ok(angle >= prev - 1e-6 && angle - prev < 0.2, 'sin saltos');
    prev = angle;
  }
  m.stop('b');
  for (let i = 0; i < 40; i++) m.update(0.05);
  assert.equal(m.weight, 0);
});

test('biblioteca: cada clip existe, las acciones duran poco y el vaso va en la mano del lado correcto', async () => {
  const { LIBRARY } = await import('../src/character-motion.ts');
  const all = [...LIBRARY.idle, ...LIBRARY.talk, ...LIBRARY.actions];
  for (const spec of all) assert.ok(readFileSync(new URL(`../public/motions/${spec.file}.json`, import.meta.url)).length > 1000, spec.file);
  for (const a of LIBRARY.actions) {
    const c = parseClip(JSON.parse(readFileSync(new URL(`../public/motions/${a.file}.json`, import.meta.url), 'utf8')) as MotionClipJson);
    assert.ok(c.duration <= 7, `${a.file}: una accion suelta no debe tardar demasiado`);
    if (a.prop === 'glass') assert.equal(a.hand, a.file.endsWith('-m') ? 'leftHand' : 'rightHand', a.file);
  }
});
