import { describe, expect, it } from 'vitest';
import { MemoryStore, type MemoryCandidate, type MemoryRepository } from '../src/index.js';

/**
 * La especificacion de la memoria, independiente de donde se guarde.
 *
 * Corre dos veces: contra el repositorio en memoria (aqui) y contra PostgreSQL (en
 * @kotaru/persistence). Si una regla se cumple en una y no en la otra, falla una de las
 * dos. Es lo que permite cambiar de almacenamiento sin cambiar de comportamiento.
 */
export function describeMemoryStore(
  name: string,
  makeRepository: () => Promise<MemoryRepository> | MemoryRepository,
  ids: { readonly subject: (n: number) => string } = { subject: (n) => `subj_${n}` },
): void {
  const S1 = ids.subject(1);
  const S2 = ids.subject(2);

  async function store(max?: number) {
    let clock = 1_789_000_000_000;
    let counter = 0;
    const prefix = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    return new MemoryStore({
      now: () => (clock += 1000),
      newId: () => idFor(prefix, ++counter),
      repository: await makeRepository(),
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
    s.propose({ subjectId: S1, companionId: 'rio', candidate: candidate(text, extra), sourceTurnId: 'turn_1' });

  const proposed = async (s: MemoryStore, text: string, extra: Partial<MemoryCandidate> = {}) => {
    const result = await propose(s, text, extra);
    if (!result.ok) throw new Error(`no se pudo proponer: ${result.reason}`);
    return result.memory;
  };

  describe(`memoria: ${name}`, () => {
    describe('aprobacion del usuario', () => {
      it('lo propuesto no se recupera hasta que el usuario lo aprueba', async () => {
        const s = await store();
        const m = await proposed(s, 'me gusta el mar');
        expect(await s.recall({ subjectId: S1, companionId: 'rio', text: 'mar' })).toHaveLength(0);
        await s.approve(m.id);
        expect(await s.recall({ subjectId: S1, companionId: 'rio', text: 'mar' })).toHaveLength(1);
      });

      it('lo rechazado no vuelve nunca', async () => {
        const s = await store();
        const m = await proposed(s, 'me gusta el futbol');
        await s.reject(m.id);
        expect(await s.recall({ subjectId: S1, companionId: 'rio', text: 'futbol' })).toHaveLength(0);
      });

      it('no propone dos veces lo mismo al mismo companion', async () => {
        const s = await store();
        await proposed(s, 'me gusta el mar');
        expect(await propose(s, '  Me Gusta El Mar ')).toEqual({ ok: false, reason: 'duplicate' });
      });

      it('pero otro companion si puede recordarlo por su cuenta', async () => {
        const s = await store();
        await proposed(s, 'me gusta el mar');
        const other = await s.propose({
          subjectId: S1, companionId: 'nova', candidate: candidate('me gusta el mar'), sourceTurnId: 'turn_2',
        });
        expect(other.ok).toBe(true);
      });

      it('tras rechazar algo se puede volver a proponer, pero no rescatar el viejo como duplicado', async () => {
        const s = await store();
        const old = await proposed(s, 'me gusta el mar');
        await s.reject(old.id);
        const again = await proposed(s, 'me gusta el mar');
        await s.approve(again.id);
        expect(await s.approve(old.id)).toEqual({ ok: false, reason: 'duplicate' });
      });

      it('el guardia bloquea antes de guardar nada', async () => {
        const s = await store();
        const r = await propose(s, 'mi tarjeta es 4242424242424242');
        expect(r).toEqual({ ok: false, reason: 'payment_card' });
        expect(await s.list(S1)).toHaveLength(0);
      });
    });

    describe('edicion y fijado', () => {
      it('editar conserva el id y vuelve a pasar por el guardia', async () => {
        const s = await store();
        const m = await proposed(s, 'me gusta el mar');
        const edited = await s.edit(m.id, 'me gusta el mar en invierno');
        expect(edited.ok).toBe(true);
        if (edited.ok) expect(edited.memory.id).toBe(m.id);

        expect(await s.edit(m.id, 'mi tarjeta es 4242424242424242')).toEqual({ ok: false, reason: 'payment_card' });
        expect((await s.list(S1))[0]!.text).toBe('me gusta el mar en invierno');
      });

      it('editar algo que no existe dice not_found, no otra cosa', async () => {
        const s = await store();
        expect(await s.edit(MISSING_ID, 'hola que tal')).toEqual({ ok: false, reason: 'not_found' });
      });

      it('editar hasta chocar con otro recuerdo se rechaza como duplicado', async () => {
        const s = await store();
        await proposed(s, 'me gusta el mar');
        const b = await proposed(s, 'me gusta el cafe');
        expect(await s.edit(b.id, 'ME GUSTA EL MAR')).toEqual({ ok: false, reason: 'duplicate' });
      });

      it('lo fijado sale primero aunque sea menos relevante', async () => {
        const s = await store();
        const pinned = await proposed(s, 'mi cumpleanos es en marzo');
        const relevant = await proposed(s, 'me gusta caminar por la playa');
        await s.approve(pinned.id);
        await s.approve(relevant.id);
        await s.setPinned(pinned.id, true);
        const recalled = await s.recall({ subjectId: S1, companionId: 'rio', text: 'playa caminar' });
        expect(recalled[0]!.id).toBe(pinned.id);
      });
    });

    describe('borrado y exportacion', () => {
      it('olvidar borra de verdad', async () => {
        const s = await store();
        const m = await proposed(s, 'me gusta el mar');
        await s.approve(m.id);
        expect(await s.forget(m.id)).toBe(true);
        expect(await s.list(S1)).toHaveLength(0);
        expect(await s.forget(m.id)).toBe(false);
      });

      it('el borrado de cuenta no toca a otro usuario', async () => {
        const s = await store();
        await proposed(s, 'me gusta el mar');
        await s.propose({ subjectId: S2, companionId: 'rio', candidate: candidate('me gusta la montana'), sourceTurnId: 't' });
        expect(await s.forgetAll(S1)).toBe(1);
        expect(await s.list(S1)).toHaveLength(0);
        expect(await s.list(S2)).toHaveLength(1);
      });

      it('la exportacion incluye lo propuesto, no solo lo aprobado', async () => {
        const s = await store();
        const a = await proposed(s, 'me gusta el mar');
        await proposed(s, 'me gusta el cafe');
        await s.approve(a.id);
        const exported = await s.exportFor(S1);
        expect(exported.subjectId).toBe(S1);
        expect(exported.memories.map((m) => m.status).sort()).toEqual(['approved', 'proposed']);
      });
    });

    describe('vencimiento y tope', () => {
      it('un recuerdo vencido no se recupera y prune lo elimina', async () => {
        const s = await store();
        const m = await proposed(s, 'voy a Lisboa la semana que viene', { kind: 'plan', expiresAt: '2020-01-01T00:00:00.000Z' });
        await s.approve(m.id);
        expect(await s.recall({ subjectId: S1, companionId: 'rio', text: 'Lisboa' })).toHaveLength(0);
        expect(await s.prune()).toBeGreaterThanOrEqual(1);
        expect(await s.list(S1)).toHaveLength(0);
      });

      it('al llegar al tope no borra nada: rechaza aprobar y deja decidir al usuario', async () => {
        const s = await store(2);
        const ids: string[] = [];
        for (const text of ['recuerdo uno', 'recuerdo dos', 'recuerdo tres']) ids.push((await proposed(s, text)).id);

        expect((await s.approve(ids[0]!)).ok).toBe(true);
        expect((await s.approve(ids[1]!)).ok).toBe(true);
        expect(await s.isAtCapacity(S1)).toBe(true);
        expect(await s.approve(ids[2]!)).toEqual({ ok: false, reason: 'at_capacity' });

        expect(await s.list(S1)).toHaveLength(3);
        expect(await s.countApproved(S1)).toBe(2);

        await s.forget(ids[0]!);
        expect((await s.approve(ids[2]!)).ok).toBe(true);
      });

      it('reaprobar algo ya aprobado no cuenta contra el tope', async () => {
        const s = await store(1);
        const m = await proposed(s, 'recuerdo unico');
        expect((await s.approve(m.id)).ok).toBe(true);
        expect((await s.approve(m.id)).ok).toBe(true);
      });

      it('aprobaciones simultaneas no pasan el tope', async () => {
        const s = await store(2);
        const ids: string[] = [];
        for (const text of ['uno a', 'dos b', 'tres c', 'cuatro d', 'cinco e']) ids.push((await proposed(s, text)).id);
        const results = await Promise.all(ids.map((id) => s.approve(id)));
        expect(results.filter((r) => r.ok)).toHaveLength(2);
        expect(await s.countApproved(S1)).toBe(2);
      });

      it('aprobar algo que no existe dice not_found', async () => {
        const s = await store();
        expect(await s.approve(MISSING_ID)).toEqual({ ok: false, reason: 'not_found' });
      });
    });

    describe('recuperacion', () => {
      it('cuenta los usos y marca la ultima vez', async () => {
        const s = await store();
        const m = await proposed(s, 'me gusta el mar');
        await s.approve(m.id);
        await s.recall({ subjectId: S1, companionId: 'rio', text: 'mar' });
        const after = await s.recall({ subjectId: S1, companionId: 'rio', text: 'mar' });
        expect(after[0]!.useCount).toBe(2);
        expect(after[0]!.lastUsedAt).toBeDefined();
        expect((await s.get(m.id))!.useCount).toBe(2);
      });

      it('no cruza recuerdos entre companions', async () => {
        const s = await store();
        const m = await proposed(s, 'me gusta el mar');
        await s.approve(m.id);
        expect(await s.recall({ subjectId: S1, companionId: 'nova', text: 'mar' })).toHaveLength(0);
      });

      it('el orden es determinista con los mismos datos', async () => {
        const build = async () => {
          const s = await store();
          for (const text of ['me gusta el mar', 'me gusta la playa', 'me gusta el cafe']) {
            await s.approve((await proposed(s, text)).id);
          }
          return (await s.recall({ subjectId: S1, companionId: 'rio', text: 'gusta' })).map((m) => m.text);
        };
        expect(await build()).toEqual(await build());
      });

      it('lo que devuelve es fiel a lo guardado: campos opcionales y tipos', async () => {
        const s = await store();
        const m = await proposed(s, 'voy a Roma en mayo', { kind: 'plan', expiresAt: '2099-05-01T00:00:00.000Z' });
        const got = (await s.get(m.id))!;
        expect(got).toEqual(m);
        expect(got.lastUsedAt).toBeUndefined();
      });
    });
  });
}

const MISSING_ID = '00000000-0000-4000-8000-000000000000';

/**
 * Ids con forma de uuid: sirven para la implementacion en memoria y para la columna uuid
 * de PostgreSQL por igual. El prefijo es aleatorio por almacen, asi que dos almacenes no
 * chocan aunque compartan base.
 */
function idFor(prefixHex8: string, n: number): string {
  return `${prefixHex8}-0000-4000-8000-${String(n).padStart(12, '0')}`;
}
