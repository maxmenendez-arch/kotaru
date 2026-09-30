import type { ExtractionInput, MemoryCandidate, MemoryExtractor } from './types.js';

/**
 * Extractor determinista para pruebas y desarrollo.
 *
 * Reconoce unas pocas formas explicitas en espanol e ingles. No pretende ser bueno:
 * pretende ser predecible, para que las pruebas del resto del sistema no dependan de
 * un modelo. En produccion se sustituye por uno basado en LLM detras de esta interfaz.
 */
export class HeuristicExtractor implements MemoryExtractor {
  extract(input: ExtractionInput): readonly MemoryCandidate[] {
    const candidates: MemoryCandidate[] = [];
    const text = input.userText.trim();
    const lowered = text.toLowerCase();

    for (const [marker, kind] of MARKERS) {
      const at = lowered.indexOf(marker);
      if (at === -1) continue;
      const statement = text.slice(at).split(/[.!?\n]/)[0]?.trim();
      if (statement && statement.length > marker.length + 2) {
        candidates.push({ kind, text: statement, confidence: 0.6 });
      }
    }

    return dedupe(candidates);
  }
}

const MARKERS: readonly (readonly [string, MemoryCandidate['kind']])[] = [
  ['me llamo', 'fact'],
  ['mi nombre es', 'fact'],
  ['trabajo en', 'fact'],
  ['vivo en', 'fact'],
  ['me gusta', 'preference'],
  ['odio', 'preference'],
  ['prefiero', 'preference'],
  ['no quiero hablar de', 'boundary'],
  ['no me hables de', 'boundary'],
  ['voy a', 'plan'],
  ['mi hermana', 'relationship'],
  ['mi hermano', 'relationship'],
  // Para personalizar (manuales, 2026-09-30): como quiere que le llamen, de donde es, sus
  // favoritos, metas, lo que aprende, fechas y quienes son importantes para la persona.
  ['llámame', 'preference'],
  ['llamame', 'preference'],
  ['soy de', 'fact'],
  ['mi cumpleaños', 'fact'],
  ['mi cumpleanos', 'fact'],
  ['mi comida favorita', 'preference'],
  ['mi canción favorita', 'preference'],
  ['mi cancion favorita', 'preference'],
  ['mi película favorita', 'preference'],
  ['mi pelicula favorita', 'preference'],
  ['mi meta', 'plan'],
  ['quiero aprender', 'plan'],
  ['estoy aprendiendo', 'fact'],
  ['mi perro', 'relationship'],
  ['mi perra', 'relationship'],
  ['mi gato', 'relationship'],
  ['mi gata', 'relationship'],
  ['mi pareja', 'relationship'],
  ['mi mejor amig', 'relationship'],
  ['mi mamá', 'relationship'],
  ['mi mama', 'relationship'],
  ['mi papá', 'relationship'],
  ['mi hija', 'relationship'],
  ['mi hijo', 'relationship'],
  ['my name is', 'fact'],
  ['i work at', 'fact'],
  ['i live in', 'fact'],
  ['i like', 'preference'],
  ['i hate', 'preference'],
  ["i don't want to talk about", 'boundary'],
  ['call me', 'preference'],
  ["i'm from", 'fact'],
  ['my birthday', 'fact'],
  ['my favorite', 'preference'],
  ['my favourite', 'preference'],
  ['my goal', 'plan'],
  ['i want to learn', 'plan'],
  ["i'm learning", 'fact'],
  ['my dog', 'relationship'],
  ['my cat', 'relationship'],
  ['my partner', 'relationship'],
  ['my best friend', 'relationship'],
  ['my mom', 'relationship'],
  ['my dad', 'relationship'],
];

function dedupe(candidates: readonly MemoryCandidate[]): MemoryCandidate[] {
  const seen = new Set<string>();
  const out: MemoryCandidate[] = [];
  for (const candidate of candidates) {
    const key = candidate.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
  }
  return out;
}
