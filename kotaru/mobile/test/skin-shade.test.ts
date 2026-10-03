import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKIN_SHADE, browShade, chinShade } from '../src/looks.ts';

test('la sombra del cuello llena bajo la barbilla y se apaga hacia abajo', () => {
  assert.equal(chinShade(0), 1);
  assert.ok(chinShade(0.01) > chinShade(0.02));
  assert.ok(chinShade(0.02) > chinShade(0.03));
  assert.equal(chinShade(0.04), 0);
  assert.equal(chinShade(-0.01), 0, 'nada por encima de la barbilla');
});

test('la sombra de la frente empieza sobre las cejas y no pasa de 1', () => {
  assert.equal(browShade(0), 0);
  assert.ok(browShade(0.03) > 0 && browShade(0.03) < 1);
  assert.equal(browShade(0.2), 1);
});

test('las sombras solo oscurecen la piel (multiplicadores entre 0,4 y 1)', () => {
  for (const c of ['luna', 'nova', 'rio']) {
    for (const v of [...SKIN_SHADE[c]!.chin, ...SKIN_SHADE[c]!.brow]) assert.ok(v >= 0.4 && v <= 1, `${c}: ${v}`);
  }
});
