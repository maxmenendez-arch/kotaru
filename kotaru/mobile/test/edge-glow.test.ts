import assert from 'node:assert/strict';
import { test } from 'node:test';
import { glowColors, glowStrength } from '../src/edge-glow-model.ts';

test('apagado en reposo o cerrado; siempre visible al escuchar aunque no hables', () => {
  assert.equal(glowStrength('idle', 1, 0, false), 0);
  assert.equal(glowStrength('closed', 1, 0, false), 0);
  assert.ok(glowStrength('listening', 0, 0, false) >= 0.4);
});

test('crece con el volumen al escuchar y al hablar, sin pasar de 1', () => {
  assert.ok(glowStrength('listening', 1, 0, false) > glowStrength('listening', 0.2, 0, false));
  assert.ok(glowStrength('speaking', 0.9, 0, false) > glowStrength('speaking', 0.1, 0, false));
  assert.ok(glowStrength('speaking', 5, 0, false) <= 1);
});

test('con reducir movimiento, fijo (no late con el volumen ni con el tiempo)', () => {
  assert.equal(glowStrength('listening', 0.1, 0, true), glowStrength('listening', 0.9, 3, true));
  assert.equal(glowStrength('thinking', 0, 0, true), glowStrength('thinking', 0, 1.3, true));
});

test('calido al escucharte; el color del personaje cuando habla', () => {
  assert.ok(glowColors('listening', '#123456').includes('#FF8A3D'));
  assert.ok(glowColors('speaking', '#FF5FA2').includes('#FF5FA2'));
});
