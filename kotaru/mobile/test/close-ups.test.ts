import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CloseUpDirector, FRAMINGS, PULL_OUT, PUSH_IN, zoomFov } from '../src/close-ups.ts';

test('nunca repite el encuadre de los dos ultimos ni el mismo tipo seguido', () => {
  const d = new CloseUpDirector();
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const names: string[] = [];
  for (let i = 0; i < 300; i++) names.push(d.start(i * 20, 4, rnd()).name);
  for (let i = 2; i < names.length; i++) {
    assert.notEqual(names[i], names[i - 1]);
    assert.notEqual(names[i], names[i - 2]);
    assert.notEqual(names[i]!.split('-')[0], names[i - 1]!.split('-')[0], `${names[i - 1]} -> ${names[i]}`);
  }
  assert.equal(new Set(names).size, FRAMINGS.length, 'usa todos los encuadres');
});

test('zoom suave de entrada y salida; el foco se pierde y vuelve', () => {
  const d = new CloseUpDirector();
  d.start(0, 5, 0);
  assert.equal(d.frame(0)!.weight, 0);
  const mid = d.frame(PUSH_IN / 2)!;
  assert.ok(mid.weight > 0.3 && mid.weight < 0.7 && mid.soft > 0.9);
  const held = d.frame(PUSH_IN + 0.5)!;
  assert.equal(held.weight, 1);
  assert.equal(held.soft, 0);
  let t = PUSH_IN;
  while (d.frame(t)) t += 0.05;
  assert.ok(t > PUSH_IN + PULL_OUT && t < 20);
  assert.equal(d.active, false);
});

test('soltar a mitad vuelve sin saltos; el zoom estrecha el angulo', () => {
  const d = new CloseUpDirector();
  d.start(0, 8, 0.5);
  d.release(PUSH_IN + 1);
  const after = d.frame(PUSH_IN + 1.05)!.weight;
  assert.ok(after > 0.95 && after < 1);
  assert.ok(zoomFov(0.2, 2) < zoomFov(0.78, 2));
  assert.ok(Math.abs(zoomFov(1, 1) - 53.13) < 0.1);
});
