import type { Locale, Region } from '@kotaru/ai-contracts';

/**
 * Recursos de apoyo por region.
 *
 * Deliberadamente incompleto. Solo esta configurado lo que se pudo verificar; el resto
 * lanza en vez de devolver una lista vacia. Mostrarle una pantalla vacia a alguien en
 * crisis es peor que no lanzar el producto en esa region: el fallo tiene que ser
 * ruidoso en el despliegue, no silencioso frente al usuario.
 */
export interface SupportResource {
  readonly name: string;
  readonly contact: string;
  readonly languages: readonly Locale[];
  readonly hours: string;
  /** Fecha en que se comprobo que sigue vigente. */
  readonly verifiedAt: string;
}

export class UnconfiguredRegionError extends Error {
  readonly region: Region;
  constructor(region: Region) {
    super(
      `No hay recursos de apoyo configurados para la region '${region}'. ` +
        'Configurarlos y verificarlos es requisito de lanzamiento en esa region: ' +
        'una pantalla vacia no es una opcion aceptable.',
    );
    this.name = 'UnconfiguredRegionError';
    this.region = region;
  }
}

const RESOURCES: Partial<Record<Region, readonly SupportResource[]>> = {
  us: [
    {
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      languages: ['en-US', 'es-US', 'es-419'],
      hours: '24/7',
      verifiedAt: '2026-09-17',
    },
    {
      name: 'Crisis Text Line',
      contact: 'HOME / HOLA al 741741',
      languages: ['en-US', 'es-US'],
      hours: '24/7',
      verifiedAt: '2026-09-17',
    },
  ],
};

export function supportResourcesFor(region: Region, locale: Locale): readonly SupportResource[] {
  const forRegion = RESOURCES[region];
  if (!forRegion || forRegion.length === 0) throw new UnconfiguredRegionError(region);

  const matching = forRegion.filter((resource) => resource.languages.includes(locale));
  // Si no hay ninguno en el idioma del usuario, se devuelven todos: un recurso en otro
  // idioma sirve mas que ninguno, y la interfaz puede avisar del idioma.
  return matching.length > 0 ? matching : forRegion;
}

export function hasConfiguredResources(region: Region): boolean {
  const forRegion = RESOURCES[region];
  return forRegion !== undefined && forRegion.length > 0;
}
