import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ChunkAssembler, floatToPcm16, pcm16ToFloat, resampleLinear } from '../src/pcm.ts';

test('float → int16 little-endian, con recorte', () => {
  const pcm = floatToPcm16(new Float32Array([0, 1, -1, 2, -2, 0.5]));
  const view = new DataView(pcm.buffer);
  assert.deepEqual(
    Array.from({ length: 6 }, (_, i) => view.getInt16(i * 2, true)),
    [0, 32767, -32768, 32767, -32768, 16384],
  );
  // little-endian: 32767 = ff 7f
  assert.equal(pcm[2], 0xff);
  assert.equal(pcm[3], 0x7f);
});

test('int16 → float ida y vuelta', () => {
  const src = new Float32Array([0, 0.25, -0.25, 0.999, -1]);
  const back = pcm16ToFloat(floatToPcm16(src));
  for (let i = 0; i < src.length; i++) assert.ok(Math.abs(back[i]! - src[i]!) < 1e-4);
});

test('int16 → float respeta byteOffset e ignora un byte suelto', () => {
  const buf = new Uint8Array([9, 0x00, 0x40, 0x00, 0xc0, 7]);
  const out = pcm16ToFloat(buf.subarray(1));
  assert.deepEqual(Array.from(out), [0.5, -0.5]);
});

test('remuestreo: misma frecuencia no copia', () => {
  const s = new Float32Array([1, 2, 3]);
  assert.equal(resampleLinear(s, 24000, 24000), s);
});

test('remuestreo 48k → 24k reduce a la mitad y conserva una rampa', () => {
  const s = Float32Array.from({ length: 480 }, (_, i) => i / 480);
  const out = resampleLinear(s, 48000, 24000);
  assert.equal(out.length, 240);
  assert.ok(Math.abs(out[100]! - 200 / 480) < 1e-6);
});

test('remuestreo 16k → 24k interpola', () => {
  const out = resampleLinear(new Float32Array([0, 1]), 16000, 24000);
  assert.equal(out.length, 3);
  assert.ok(Math.abs(out[1]! - 2 / 3) < 1e-6);
});

test('trozos exactos de 20 ms a 24 kHz desde 48 kHz, sin perder muestras entre llamadas', () => {
  const chunks: Uint8Array[] = [];
  const a = new ChunkAssembler(24000, 20, (c) => chunks.push(c));
  a.push(new Float32Array(1024), 48000); // 512 muestras a 24 kHz: 1 trozo (480) y sobran 32
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0]!.byteLength, 960);
  a.push(new Float32Array(1024), 48000); // 32 + 512 = 544: otro trozo, sobran 64
  assert.equal(chunks.length, 2);
  a.push(new Float32Array(832), 48000); // 64 + 416 = 480: justo uno
  assert.equal(chunks.length, 3);
});
