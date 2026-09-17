/**
 * Cola asincrona de un solo consumidor.
 *
 * El turno tiene dos productores que avanzan a la vez —el LLM emitiendo tokens y
 * el TTS emitiendo audio— y un solo consumidor, que es el cliente. Sin esto habria
 * que esperar a que el LLM termine antes de sintetizar, y el primer byte de audio
 * llegaria al final de la frase completa en vez de al final de la primera oracion.
 */
export class AsyncQueue<T> implements AsyncIterable<T> {
  readonly #items: T[] = [];
  readonly #waiters: ((result: IteratorResult<T>) => void)[] = [];
  #closed = false;
  #error: unknown = undefined;

  push(item: T): void {
    if (this.#closed) return;
    const waiter = this.#waiters.shift();
    if (waiter) waiter({ value: item, done: false });
    else this.#items.push(item);
  }

  close(): void {
    if (this.#closed) return;
    this.#closed = true;
    while (this.#waiters.length > 0) {
      this.#waiters.shift()!({ value: undefined, done: true });
    }
  }

  fail(error: unknown): void {
    this.#error = error;
    this.close();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (;;) {
      if (this.#items.length > 0) {
        yield this.#items.shift()!;
        continue;
      }
      if (this.#closed) {
        if (this.#error !== undefined) throw this.#error;
        return;
      }
      const next = await new Promise<IteratorResult<T>>((resolve) => {
        this.#waiters.push(resolve);
      });
      if (next.done) {
        if (this.#error !== undefined) throw this.#error;
        return;
      }
      yield next.value;
    }
  }
}
