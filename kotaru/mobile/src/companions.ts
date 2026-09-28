import type { Lang } from './i18n';

/**
 * Lo que la app muestra de cada personaje. La personalidad y las reglas viven en el
 * servidor (@kotaru/persona); aqui solo nombre, linea de presentacion y color.
 * Los retratos definitivos llegaran como ilustraciones propias; mientras, un monograma.
 */
export type CompanionId = 'nova' | 'sage' | 'rio';

export interface Companion {
  readonly id: CompanionId;
  readonly name: string;
  readonly tagline: Readonly<Record<Lang, string>>;
  /** Color del anillo y del monograma (09_BRAND). Nunca es la unica señal: va con el nombre. */
  readonly accent: string;
  readonly tint: string;
}

export const COMPANIONS: readonly Companion[] = [
  {
    id: 'nova',
    name: 'Nova',
    tagline: { es: 'Chispa creativa: ideas, juegos y ocurrencias.', en: 'Creative spark: ideas, games and wild thoughts.' },
    accent: '#7C5CFF',
    tint: '#2A1F5C',
  },
  {
    id: 'sage',
    name: 'Sage',
    tagline: { es: 'Calma y claridad: para pensar en voz alta.', en: 'Calm and clarity: for thinking out loud.' },
    accent: '#37D6C8',
    tint: '#123A45',
  },
  {
    id: 'rio',
    name: 'Rio',
    tagline: { es: 'Calidez social: el día a día y práctica de idiomas.', en: 'Social warmth: everyday chat and language practice.' },
    accent: '#F2A65A',
    tint: '#4A2A14',
  },
];

export function companionById(id: CompanionId): Companion {
  return COMPANIONS.find((c) => c.id === id) ?? COMPANIONS[2]!;
}
