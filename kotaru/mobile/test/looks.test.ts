import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LOOKS, catchlightOpacity, materialKind } from '../src/looks.ts';

test('reconoce las partes de VRoid por el nombre del material', () => {
  assert.equal(materialKind('N00_000_Hair_00_HAIR (Instance)'), 'hair');
  assert.equal(materialKind('N00_000_00_HairBack_00_HAIR (Instance)'), 'hair');
  assert.equal(materialKind('N00_000_00_Body_00_SKIN (Instance)'), 'skin');
  assert.equal(materialKind('N00_000_00_EyeIris_00_EYE (Instance)'), 'eye');
  assert.equal(materialKind('N00_000_00_EyeHighlight_00_EYE (Instance)'), 'eye-highlight');
  assert.equal(materialKind('N00_000_00_FaceBrow_00_FACE (Instance)'), 'face');
  assert.equal(materialKind('N00_007_01_Tops_01_CLOTH (Instance)'), 'cloth');
  assert.equal(materialKind('otra cosa'), 'other');
});

test('el brillo de los ojos se ve con ojos abiertos o una sonrisa leve y se apaga al cerrarlos', () => {
  assert.equal(catchlightOpacity(0), 1);
  assert.equal(catchlightOpacity(0.4), 1);
  assert.ok(catchlightOpacity(0.6) > 0 && catchlightOpacity(0.6) < 1);
  assert.equal(catchlightOpacity(0.8), 0);
  assert.equal(catchlightOpacity(1), 0);
});

test('cada personaje tiene su luz de borde (no el gris de VRoid) y el pelo con menos brillo propio', () => {
  const rims = new Set(Object.values(LOOKS).map((l) => l.rim));
  assert.equal(rims.size, 3);
  assert.ok(!rims.has(0x404040));
  for (const look of Object.values(LOOKS)) {
    assert.ok(look.hairEmissive > 0.2 && look.hairEmissive < 1);
    assert.ok(look.catchlight.strength > 0 && look.catchlight.strength <= 1);
  }
});
