import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { elbowPoint, twoBoneIK } from '../src/ik.ts';

test('el codo queda a la distancia del brazo y del antebrazo, hacia el polo', () => {
  const a = new THREE.Vector3(0, 0, 0);
  const t = new THREE.Vector3(0, -0.4, 0);
  const e = elbowPoint(a, t, new THREE.Vector3(1, -0.2, 0), 0.28, 0.25, new THREE.Vector3());
  assert.ok(Math.abs(e.distanceTo(a) - 0.28) < 1e-6);
  assert.ok(Math.abs(e.distanceTo(t) - 0.25) < 1e-6);
  assert.ok(e.x > 0, 'hacia el polo');
});

test('la mano llega al objetivo con una cadena real de three.js', () => {
  const root = new THREE.Object3D();
  const upper = new THREE.Object3D();
  const lower = new THREE.Object3D();
  const hand = new THREE.Object3D();
  root.add(upper);
  upper.add(lower);
  lower.add(hand);
  upper.position.set(0.2, 1.4, 0);
  lower.position.set(0.28, 0, 0); // en T, hacia +x
  hand.position.set(0.25, 0, 0);
  root.rotation.y = 0.3; // que el padre no sea la identidad
  root.updateMatrixWorld(true);
  const target = new THREE.Vector3(0.12, 1.0, -0.15);
  twoBoneIK(upper, lower, hand, target, new THREE.Vector3(0.6, 1.1, -0.4));
  root.updateMatrixWorld(true);
  const got = hand.getWorldPosition(new THREE.Vector3());
  assert.ok(got.distanceTo(target) < 1e-4, `la mano quedo a ${got.distanceTo(target)} m`);
});

test('si el objetivo esta fuera de alcance, el brazo se estira hacia el', () => {
  const root = new THREE.Object3D();
  const upper = new THREE.Object3D();
  const lower = new THREE.Object3D();
  const hand = new THREE.Object3D();
  root.add(upper);
  upper.add(lower);
  lower.add(hand);
  lower.position.set(0.3, 0, 0);
  hand.position.set(0.3, 0, 0);
  root.updateMatrixWorld(true);
  twoBoneIK(upper, lower, hand, new THREE.Vector3(0, -2, 0), new THREE.Vector3(1, 0, 0));
  root.updateMatrixWorld(true);
  const got = hand.getWorldPosition(new THREE.Vector3());
  assert.ok(Math.abs(got.y + 0.6) < 1e-3 && Math.abs(got.x) < 0.01);
});
