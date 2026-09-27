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
