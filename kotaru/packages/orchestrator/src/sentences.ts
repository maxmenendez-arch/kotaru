/**
 * Acumula tokens y entrega oraciones completas.
 *
 * El TTS cobra por caracter y sintetiza mejor con una unidad prosodica entera, asi
 * que no se le manda token por token. Pero esperar al parrafo completo dispara el
 * tiempo al primer byte de audio. La oracion es el equilibrio.
 */
export class SentenceBuffer {
  #buffer = '';
  readonly #maxChars: number;

  constructor(maxChars = 160) {
    this.#maxChars = maxChars;
  }

  /** Devuelve las oraciones que quedaron completas al anadir este token. */
  push(token: string): string[] {
    this.#buffer += token;
    const out: string[] = [];

    for (;;) {
      const boundary = findBoundary(this.#buffer);
      if (boundary === -1) break;
      out.push(this.#buffer.slice(0, boundary + 1).trim());
      this.#buffer = this.#buffer.slice(boundary + 1);
    }

    // Corte de emergencia: un modelo que nunca puntua no debe bloquear el audio.
    while (this.#buffer.length > this.#maxChars) {
      const cut = this.#buffer.lastIndexOf(' ', this.#maxChars);
      const at = cut > 0 ? cut : this.#maxChars;
      out.push(this.#buffer.slice(0, at).trim());
      this.#buffer = this.#buffer.slice(at);
    }

    return out.filter((s) => s.length > 0);
  }

  /** Lo que quede sin puntuacion final al terminar la generacion. */
  flush(): string | null {
    const rest = this.#buffer.trim();
    this.#buffer = '';
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
