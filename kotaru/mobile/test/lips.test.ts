import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visemesFromSpectrum } from '../src/avatar-motion.ts';

/** Espectro de juguete: -100 dB salvo un pico en `hz` (y opcional un segundo). */
const spectrum = (peaks: number[], binHz = 93.75, n = 256) => {
  const db = new Float32Array(n).fill(-100);
  for (const hz of peaks) {
    const i = Math.round(hz / binHz);
    for (let k = -1; k <= 1; k++) db[i + k] = -30;
  }
  return db;
};
const top = (v: object) => (Object.entries(v) as [string, number][]).sort((a, b) => b[1] - a[1])[0]![0];

test('la vocal sale de donde cae la energia de la voz', () => {
  assert.equal(top(visemesFromSpectrum(spectrum([950]), 93.75, 0.8)), 'aa');
  const e = visemesFromSpectrum(spectrum([3000]), 93.75, 0.8);
  assert.ok(e.ee > e.aa * 0.9 && e.ee > e.ou, JSON.stringify(e));
  const u = visemesFromSpectrum(spectrum([350]), 93.75, 0.8);
  assert.ok(u.ou + u.oh > u.ee + u.ih, JSON.stringify(u));
});

test('en silencio la boca cierra; las sibilantes la abren menos', () => {
  const quiet = visemesFromSpectrum(spectrum([950]), 93.75, 0);
  assert.equal(quiet.aa + quiet.ih + quiet.ou + quiet.ee + quiet.oh, 0);
  const vowel = visemesFromSpectrum(spectrum([950]), 93.75, 0.8);
  const hiss = visemesFromSpectrum(spectrum([950, 6000, 6500, 7000]), 93.75, 0.8);
  const sum = (v: typeof vowel) => v.aa + v.ih + v.ou + v.ee + v.oh;
  assert.ok(sum(hiss) < sum(vowel));
});

import { Blinker } from '../src/avatar-motion.ts';

test('el parpado cierra rapido y abre despacio; al mover la mirada parpadea', () => {
  const b = new Blinker(() => 0.5, 0);
  b.nudge(10);
  const w = (t: number) => b.weight(t);
  assert.equal(w(10), 0);
  assert.ok(w(10.066) > 0.95, 'cerrado a los 66 ms');
  assert.ok(w(10.15) > 0.3, 'aun entreabierto al abrir');
  assert.equal(w(10.25), 0);
  b.nudge(10.5);
  assert.equal(w(10.5), 0, 'no repite enseguida');
});

import { BLUSH } from '../src/looks.ts';
test('rubor suave: nunca opaco, apenas en Rio', () => {
  for (const b of Object.values(BLUSH)) assert.ok(b.alpha > 0 && b.alpha <= 0.25);
  assert.ok(BLUSH.rio!.alpha < BLUSH.luna!.alpha);
});
