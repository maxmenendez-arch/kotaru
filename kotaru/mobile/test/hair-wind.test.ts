import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WIND, gust } from '../src/hair-wind.ts';

test('rachas de viento entre 0 y 1, variadas, y mas viento al aire libre (Rio) que en el cuarto (Nova)', () => {
  const values = Array.from({ length: 600 }, (_, i) => gust(i * 0.1, 0.6));
  assert.ok(values.every((v) => v >= 0 && v <= 1));
  assert.ok(Math.max(...values) - Math.min(...values) > 0.3, 'sin rachas');
  assert.ok(WIND.rio.strength > WIND.luna.strength && WIND.luna.strength > WIND.nova.strength);
});
