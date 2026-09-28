import assert from 'node:assert/strict';
import { test } from 'node:test';
import { t } from '../src/i18n.ts';

/** Rutas de todas las hojas (textos o funciones) de un objeto de textos. */
function leaves(value: unknown, prefix = ''): Map<string, unknown> {
  const out = new Map<string, unknown>();
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      for (const [path, leaf] of leaves(child, prefix ? `${prefix}.${key}` : key)) out.set(path, leaf);
    }
  } else {
    out.set(prefix, value);
  }
  return out;
}

const es = leaves(t('es'));
const en = leaves(t('en'));

test('el inglés tiene exactamente las mismas claves que el español', () => {
  const missing = [...es.keys()].filter((k) => !en.has(k));
  const extra = [...en.keys()].filter((k) => !es.has(k));
  assert.deepEqual({ missing, extra }, { missing: [], extra: [] });
});

test('cada texto tiene el mismo tipo en los dos idiomas y ninguno está vacío', () => {
  for (const [key, value] of es) {
    const other = en.get(key);
    assert.equal(typeof other, typeof value, key);
    if (typeof value === 'string') {
      assert.notEqual(value.trim(), '', `es.${key}`);
      assert.notEqual(String(other).trim(), '', `en.${key}`);
    }
  }
});
