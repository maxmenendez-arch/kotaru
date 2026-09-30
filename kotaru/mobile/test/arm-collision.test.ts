import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { penetration, type BodyProfile } from '../src/arm-collision.ts';

// Cuerpo de juguete: una franja a la altura de la cadera, 30 cm de ancho y 20 de fondo.
const profile: BodyProfile = {
  bands: new Map([[Math.floor(1.0 / 0.03), { minL: -0.15, maxL: 0.15, minF: -0.1, maxF: 0.1, n: 50 }]]),
  up: new THREE.Vector3(0, 1, 0),
  left: new THREE.Vector3(1, 0, 0),
  fwd: new THREE.Vector3(0, 0, 1),
  origin: new THREE.Vector3(0, 1.0, 0),
};

test('un punto dentro del cuerpo se empuja hacia fuera por el lado mas cercano', () => {
  const out = new THREE.Vector3();
  const d = penetration(profile, new THREE.Vector3(0.12, 0.005, 0), out);
  assert.ok(d > 0);
  assert.ok(out.x > 0.9, `sale hacia la izquierda: ${out.toArray()}`);
});

test('un punto delante del cuerpo sale hacia delante', () => {
  const out = new THREE.Vector3();
  assert.ok(penetration(profile, new THREE.Vector3(0, 0.005, 0.09), out) > 0);
  assert.ok(out.z > 0.9);
});

test('fuera del cuerpo (con margen) o en una franja sin medir no hay choque', () => {
  const out = new THREE.Vector3();
  assert.equal(penetration(profile, new THREE.Vector3(0.2, 0.005, 0), out), 0);
  assert.equal(penetration(profile, new THREE.Vector3(0, 0.5, 0), out), 0);
});
