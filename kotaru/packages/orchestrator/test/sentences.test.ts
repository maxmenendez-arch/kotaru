import { describe, expect, it } from 'vitest';
import { SentenceBuffer } from '../src/sentences.js';

describe('SentenceBuffer', () => {
  it('entrega una oracion cuando se cierra con punto y espacio', () => {
    const buffer = new SentenceBuffer();
    expect(buffer.push('Hola')).toEqual([]);
    expect(buffer.push(' mundo.')).toEqual([]);
    expect(buffer.push(' Otra')).toEqual(['Hola mundo.']);
  });

  it('no parte un decimal ni una abreviatura', () => {
    const buffer = new SentenceBuffer();
    buffer.push('Cuesta 3');
    expect(buffer.push('.5 dolares')).toEqual([]);
    expect(buffer.push('. Fin')).toEqual(['Cuesta 3.5 dolares.']);
  });

  it('corta por longitud cuando el modelo no puntua', () => {
    const buffer = new SentenceBuffer(20);
    const out = buffer.push('palabra '.repeat(6));
    expect(out.length).toBeGreaterThan(0);
    expect(out[0]!.length).toBeLessThanOrEqual(20);
  });

  it('flush devuelve la cola sin puntuacion final', () => {
    const buffer = new SentenceBuffer();
    buffer.push('sin punto final');
    expect(buffer.flush()).toBe('sin punto final');
    expect(buffer.flush()).toBeNull();
  });
});
