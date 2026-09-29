/**
 * Subtitulo de una sola linea (pantalla inmersiva): se ve lo ultimo que se dijo, como en
 * una videollamada con subtitulos. Si no cabe, se corta por delante en un limite de
 * palabra y se marca con "…"; asi la linea avanza mientras llega la respuesta.
 */
export function captionLine(text: string, maxChars: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const budget = Math.max(1, maxChars - 1);
  const tail = clean.slice(clean.length - budget);
  const space = tail.indexOf(' ');
  // Si la cola empieza a mitad de palabra, se salta hasta la siguiente (si queda algo).
  const cut = space >= 0 && space < tail.length - 1 && clean[clean.length - budget - 1] !== ' ' ? tail.slice(space + 1) : tail;
  return `…${cut.trimStart()}`;
}

/** Cuantos caracteres caben en una linea de ese ancho (letra de 16 px: ~8,6 px de media). */
export function charsForWidth(width: number, fontSize = 16): number {
  return Math.max(12, Math.floor(width / (fontSize * 0.54)));
}
