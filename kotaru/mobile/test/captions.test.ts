import assert from 'node:assert/strict';
import { test } from 'node:test';
import { captionLine, charsForWidth } from '../src/captions.ts';

test('si cabe, la linea va entera y sin espacios de sobra', () => {
  assert.equal(captionLine('  Hola,   ¿qué tal?  ', 40), 'Hola, ¿qué tal?');
});

test('si no cabe, se ve el final y se corta por delante en una palabra entera', () => {
  const line = captionLine('Te propongo un juego: esta noche inventamos una escena juntos', 30);
  assert.ok(line.startsWith('…'));
  assert.ok(line.length <= 30);
  assert.ok(line.endsWith('juntos'));
  assert.ok(!/^…\S*[a-z]$/.test(line.split(' ')[0]!) || line.split(' ')[0] === '…' + line.split(' ')[0]!.slice(1));
  const words = 'Te propongo un juego: esta noche inventamos una escena juntos'.split(' ');
  for (const w of line.slice(1).split(' ')) assert.ok(words.includes(w), `palabra cortada: ${w}`);
});

test('caracteres por ancho: razonable en telefono y nunca menos de 12', () => {
  assert.ok(charsForWidth(360) >= 38 && charsForWidth(360) <= 45);
  assert.equal(charsForWidth(50), 12);
});
