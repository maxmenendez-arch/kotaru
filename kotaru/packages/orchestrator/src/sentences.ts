/**
 * Acumula tokens y entrega oraciones completas.
 *
 * El TTS cobra por caracter y sintetiza mejor con una unidad prosodica entera, asi
 * que no se le manda token por token. Pero esperar al parrafo completo dispara el
 * tiempo al primer byte de audio. La oracion es el equilibrio.
 */
export class SentenceBuffer {
  #buffer = '';
  /** Oraciones cortas completas que esperan a la siguiente para ir juntas. */
  #pending = '';
  readonly #maxChars: number;
  readonly #minChars: number;

  /**
   * @param minChars una oracion mas corta ("¡Hola!", "Mmm.") se une a la siguiente: sola, el
   *   TTS la entona como palabra suelta y suena rara (lo noto el dueño el 2026-09-29).
   */
  constructor(maxChars = 160, minChars = 24) {
    this.#maxChars = maxChars;
    this.#minChars = minChars;
  }

  #emit(sentence: string, out: string[]): void {
    const joined = this.#pending ? `${this.#pending} ${sentence}` : sentence;
    if (joined.length < this.#minChars) {
      this.#pending = joined;
      return;
    }
    this.#pending = '';
    out.push(joined);
  }

  /** Devuelve las oraciones que quedaron completas al anadir este token. */
  push(token: string): string[] {
    this.#buffer += token;
    const out: string[] = [];

    for (;;) {
      const boundary = findBoundary(this.#buffer);
      if (boundary === -1) break;
      const sentence = this.#buffer.slice(0, boundary + 1).trim();
      if (sentence) this.#emit(sentence, out);
      this.#buffer = this.#buffer.slice(boundary + 1);
    }

    // Corte de emergencia: un modelo que nunca puntua no debe bloquear el audio.
    while (this.#buffer.length > this.#maxChars) {
      const cut = this.#buffer.lastIndexOf(' ', this.#maxChars);
      const at = cut > 0 ? cut : this.#maxChars;
      // Corte por longitud: va sola (unida superaria el maximo), despues de lo pendiente.
      if (this.#pending) out.push(this.#pending);
      this.#pending = '';
      out.push(this.#buffer.slice(0, at).trim());
      this.#buffer = this.#buffer.slice(at);
    }

    return out.filter((s) => s.length > 0);
  }

  /** Lo que quede sin puntuacion final al terminar la generacion. */
  flush(): string | null {
    const rest = [this.#pending, this.#buffer.trim()].filter(Boolean).join(' ');
    this.#buffer = '';
    this.#pending = '';
    return rest.length > 0 ? rest : null;
  }
}

const TERMINATORS = new Set(['.', '!', '?', '\n']);

function findBoundary(text: string): number {
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]!;
    if (!TERMINATORS.has(char)) continue;
    // "3.5" no termina oracion: exige un espacio o salto DESPUES del terminador.
    // Un terminador al final del buffer no basta, porque el siguiente token podria
    // continuarlo: con los tokens "3", "." y "5" un corte prematuro mandaria "3." al
    // TTS y sonaria "tres punto". Esperar un token cuesta decenas de milisegundos;
    // partir un numero se oye. La ultima oracion de la respuesta no se pierde: la
    // recoge flush() cuando el modelo deja de generar.
    const next = text[i + 1];
    if (next === ' ' || next === '\n') return i;
  }
  return -1;
}
