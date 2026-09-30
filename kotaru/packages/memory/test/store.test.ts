import { describe, expect, it } from 'vitest';
import { HeuristicExtractor, InMemoryMemoryRepository } from '../src/index.js';
import { describeMemoryStore } from './spec.js';

describeMemoryStore('en memoria', () => new InMemoryMemoryRepository());

describe('extractor determinista', () => {
  it('reconoce una preferencia explicita', () => {
    const candidates = new HeuristicExtractor().extract({
      userText: 'Hoy me gusta mucho el mar. Nada mas.',
      companionText: 'Que bien.',
      turnId: 'turn_1',
    });
    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({ kind: 'preference' });
  });

  it('no inventa nada cuando no hay marcador', () => {
    expect(new HeuristicExtractor().extract({ userText: 'hola', companionText: 'hola', turnId: 't' })).toHaveLength(0);
  });
});

describe('extractor: datos para personalizar (2026-09-30)', () => {
  it('propone apodos, favoritos, metas y personas importantes, en los dos idiomas', async () => {
    const { HeuristicExtractor } = await import('../src/index.js');
    const x = new HeuristicExtractor();
    const got = (t: string) => x.extract({ userText: t, companionText: '', turnId: 't' }).map((c) => c.kind);
    expect(got('Llámame Maxi, así me dicen todos')).toContain('preference');
    expect(got('Mi comida favorita es el arroz con pollo')).toContain('preference');
    expect(got('Quiero aprender a tocar guitarra este año')).toContain('plan');
    expect(got('Mi perro se llama Toby')).toContain('relationship');
    expect(got('Call me Max')).toContain('preference');
    expect(got('My goal is to run a marathon')).toContain('plan');
    expect(got('Hola, ¿qué tal?')).toEqual([]);
  });
});
