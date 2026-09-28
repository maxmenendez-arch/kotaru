import type { Lang } from './i18n';

/**
 * Lo que la app muestra de cada personaje. La personalidad y las reglas viven en el
 * servidor (@kotaru/persona); aqui solo nombre, linea de presentacion y color.
 * Los retratos definitivos llegaran como ilustraciones propias; mientras, un monograma.
 */
export type CompanionId = 'nova' | 'luna' | 'rio';

export interface Companion {
  readonly id: CompanionId;
  readonly name: string;
  readonly tagline: Readonly<Record<Lang, string>>;
  /** Color del anillo y del monograma (09_BRAND). Nunca es la unica señal: va con el nombre. */
  readonly accent: string;
  readonly tint: string;
  /** Luna ofrece "Respira conmigo" y sonidos relajantes a mano. */
  readonly calm: boolean;
}

/** Luna primero: el foco de la app es la compañia y la calma. */
export const COMPANIONS: readonly Companion[] = [
  {
    id: 'luna',
    name: 'Luna',
    tagline: {
      es: 'Compañía y calma: para cuando te sientes solo o con ansiedad.',
      en: 'Company and calm: for when you feel lonely or anxious.',
    },
    accent: '#9FB4FF',
    tint: '#1B2447',
    calm: true,
  },
  {
    id: 'nova',
    name: 'Nova',
    tagline: { es: 'Coqueta y atrevida: química, ingenio y tú marcas el ritmo.', en: 'Flirty and daring: chemistry, wit, and you set the pace.' },
    accent: '#FF5FA2',
    tint: '#4A1733',
    calm: false,
  },
  {
    id: 'rio',
    name: 'Rio',
    tagline: { es: 'Aventuras, juegos y risas; y si quieres, coqueteo.', en: 'Adventures, games and laughs; and flirting if you like.' },
    accent: '#F2A65A',
    tint: '#4A2A14',
    calm: false,
  },
];

export function companionById(id: CompanionId): Companion {
  return COMPANIONS.find((c) => c.id === id) ?? COMPANIONS[0]!;
}
