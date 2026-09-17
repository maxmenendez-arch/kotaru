import { describe, expect, it } from 'vitest';
import { HeuristicExtractor, MemoryStore, type MemoryCandidate } from '../src/index.js';

function store(max?: number) {
  let clock = 1_789_000_000_000;
  let counter = 0;
  return new MemoryStore({
    now: () => (clock += 1000),
    newId: () => `mem_${String(++counter).padStart(3, '0')}`,
    ...(max !== undefined ? { maxApprovedPerSubject: max } : {}),
  });
}

const candidate = (text: string, extra: Partial<MemoryCandidate> = {}): MemoryCandidate => ({
  kind: 'preference',
  text,
  confidence: 0.6,
  ...extra,
});

const propose = (s: MemoryStore, text: string, extra: Partial<MemoryCandidate> = {}) =>
  s.propose({
    subjectId: 'subj_1',
    companionId: 'rio',
    candidate: candidate(text, extra),
    sourceTurnId: 'turn_1',
  });

describe('aprobacion del usuario', () => {
  it('lo propuesto no se recupera hasta que el usuario lo aprueba', () => {
    const s = store();
    const result = propose(s, 'me gusta el mar');
    expect(result.ok).toBe(true);

    expect(s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'mar' })).toHaveLength(0);

    if (!result.ok) return;
    s.approve(result.memory.id);
    expect(s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'mar' })).toHaveLength(1);
  });

  it('lo rechazado no vuelve nunca', () => {
    const s = store();
    const result = propose(s, 'me gusta el futbol');
    if (!result.ok) return;
    s.reject(result.memory.id);
    expect(s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'futbol' })).toHaveLength(0);
  });

  it('no propone dos veces lo mismo al mismo companion', () => {
    const s = store();
    propose(s, 'me gusta el mar');
    expect(propose(s, 'Me Gusta El Mar')).toEqual({ ok: false, reason: 'duplicate' });
  });

  it('pero otro companion si puede recordarlo por su cuenta', () => {
    const s = store();
    propose(s, 'me gusta el mar');
    const other = s.propose({
      subjectId: 'subj_1',
      companionId: 'nova',
      candidate: candidate('me gusta el mar'),
      sourceTurnId: 'turn_2',
    });
    expect(other.ok).toBe(true);
  });
});

describe('edicion y fijado', () => {
  it('editar conserva el id y vuelve a pasar por el guardia', () => {
    const s = store();
    const created = propose(s, 'me gusta el mar');
    if (!created.ok) return;

    const edited = s.edit(created.memory.id, 'me gusta el mar en invierno');
    expect(edited.ok).toBe(true);
    if (edited.ok) expect(edited.memory.id).toBe(created.memory.id);

    const blocked = s.edit(created.memory.id, 'mi tarjeta es 4242424242424242');
    expect(blocked).toEqual({ ok: false, reason: 'payment_card' });
    expect(s.list('subj_1')[0]!.text).toBe('me gusta el mar en invierno');
  });

  it('lo fijado sale primero aunque sea menos relevante', () => {
    const s = store();
    const pinned = propose(s, 'mi cumpleanos es en marzo');
    const relevant = propose(s, 'me gusta caminar por la playa');
    if (!pinned.ok || !relevant.ok) return;

    s.approve(pinned.memory.id);
    s.approve(relevant.memory.id);
    s.setPinned(pinned.memory.id, true);

    const recalled = s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'playa caminar' });
    expect(recalled[0]!.id).toBe(pinned.memory.id);
  });
});

describe('borrado y exportacion', () => {
  it('olvidar borra de verdad', () => {
    const s = store();
    const created = propose(s, 'me gusta el mar');
    if (!created.ok) return;
    s.approve(created.memory.id);

    expect(s.forget(created.memory.id)).toBe(true);
    expect(s.list('subj_1')).toHaveLength(0);
    expect(s.forget(created.memory.id)).toBe(false);
  });

  it('el borrado de cuenta no toca a otro usuario', () => {
    const s = store();
    propose(s, 'me gusta el mar');
    s.propose({
      subjectId: 'subj_2',
      companionId: 'rio',
      candidate: candidate('me gusta la montana'),
      sourceTurnId: 't',
    });

    expect(s.forgetAll('subj_1')).toBe(1);
    expect(s.list('subj_1')).toHaveLength(0);
    expect(s.list('subj_2')).toHaveLength(1);
  });

  it('la exportacion incluye lo propuesto, no solo lo aprobado', () => {
    const s = store();
    const a = propose(s, 'me gusta el mar');
    propose(s, 'me gusta el cafe');
    if (a.ok) s.approve(a.memory.id);

    const exported = s.exportFor('subj_1');
    expect(exported.subjectId).toBe('subj_1');
    expect(exported.memories).toHaveLength(2);
    expect(exported.memories.map((m) => m.status).sort()).toEqual(['approved', 'proposed']);
  });
});

describe('vencimiento y tope', () => {
  it('un recuerdo vencido no se recupera y prune lo elimina', () => {
    const s = store();
    const created = propose(s, 'voy a Lisboa la semana que viene', {
      kind: 'plan',
      expiresAt: '2020-01-01T00:00:00.000Z',
    });
    if (!created.ok) return;
    s.approve(created.memory.id);

    expect(s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'Lisboa' })).toHaveLength(0);
    expect(s.prune()).toBe(1);
    expect(s.list('subj_1')).toHaveLength(0);
  });

  it('al llegar al tope no borra nada: rechaza aprobar y deja decidir al usuario', () => {
    const s = store(2);
    const ids: string[] = [];
    for (const text of ['recuerdo uno', 'recuerdo dos', 'recuerdo tres']) {
      const result = propose(s, text);
      if (result.ok) ids.push(result.memory.id);
    }

    expect(s.approve(ids[0]!).ok).toBe(true);
    expect(s.approve(ids[1]!).ok).toBe(true);
    expect(s.isAtCapacity('subj_1')).toBe(true);

    expect(s.approve(ids[2]!)).toEqual({ ok: false, reason: 'at_capacity' });

    // Lo importante: nada se perdio. Los tres siguen ahi, el tercero sin aprobar.
    expect(s.list('subj_1')).toHaveLength(3);
    expect(s.countApproved('subj_1')).toBe(2);

    // El usuario suelta uno y entonces si entra el nuevo.
    s.forget(ids[0]!);
    expect(s.approve(ids[2]!).ok).toBe(true);
  });

  it('reaprobar algo ya aprobado no cuenta contra el tope', () => {
    const s = store(1);
    const created = propose(s, 'recuerdo unico');
    if (!created.ok) return;
    expect(s.approve(created.memory.id).ok).toBe(true);
    expect(s.approve(created.memory.id).ok).toBe(true);
  });

});

describe('recuperacion', () => {
  it('cuenta los usos y marca la ultima vez', () => {
    const s = store();
    const created = propose(s, 'me gusta el mar');
    if (!created.ok) return;
    s.approve(created.memory.id);

    s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'mar' });
    const after = s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'mar' });

    expect(after[0]!.useCount).toBe(2);
    expect(after[0]!.lastUsedAt).toBeDefined();
  });

  it('no cruza recuerdos entre companions', () => {
    const s = store();
    const created = propose(s, 'me gusta el mar');
    if (!created.ok) return;
    s.approve(created.memory.id);

    expect(s.recall({ subjectId: 'subj_1', companionId: 'nova', text: 'mar' })).toHaveLength(0);
  });

  it('el orden es determinista con los mismos datos', () => {
    const build = () => {
      const s = store();
      for (const text of ['me gusta el mar', 'me gusta la playa', 'me gusta el cafe']) {
        const result = propose(s, text);
        if (result.ok) s.approve(result.memory.id);
      }
      return s.recall({ subjectId: 'subj_1', companionId: 'rio', text: 'gusta' }).map((m) => m.text);
    };
    expect(build()).toEqual(build());
  });
});

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
    expect(
      new HeuristicExtractor().extract({ userText: 'hola', companionText: 'hola', turnId: 't' }),
    ).toHaveLength(0);
  });
});
