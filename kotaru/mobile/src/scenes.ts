/**
 * Fondos de ambientacion de cada personaje: la parte pura (sin three.js), para poder
 * probarla sin navegador (test/scenes.test.ts). Las escenas 3D estan en scene3d.ts.
 *
 * - Luna: una oficina tranquila de dia (ventana grande, plantas, libros, madera).
 * - Nova: su cuarto al anochecer (luz rosa y ambar, velas, terciopelo, neon, ciudad).
 * - Rio: un claro de montaña al atardecer (pinos, lago, montañas, cielo encendido).
 *
 * Todo se construye con codigo: ni imagenes ni modelos de terceros, nada que licenciar.
 */

export type SceneId = 'luna-office' | 'nova-room' | 'rio-outdoors';

export const SCENE_FOR: Readonly<Record<string, SceneId>> = {
  luna: 'luna-office',
  nova: 'nova-room',
  rio: 'rio-outdoors',
};

/** Colores de cada escena (hexadecimal 0xRRGGBB). */
export interface ScenePalette {
  /** Niebla: separa al personaje del fondo y oculta los bordes de la escena. */
  readonly fog: number;
  readonly fogNear: number;
  readonly fogFar: number;
  /** Luz de cielo y de suelo (HemisphereLight). */
  readonly sky: number;
  readonly ground: number;
  readonly hemiIntensity: number;
  /** Luz que recorta la silueta del personaje desde atras. */
  readonly rim: number;
  readonly rimIntensity: number;
  /** Luz principal sobre la cara (sustituye a la blanca del retrato sin fondo). */
  readonly key: number;
  readonly keyIntensity: number;
  /** Postproceso del escenario (ver stage-post.ts). */
  readonly grade: SceneGrade;
}

/**
 * Acabado "de camara" de cada lugar. El fondo se desenfoca (el personaje queda nitido),
 * lo que brilla desprende halo, y el color se ajusta como en una foto revelada.
 */
export interface SceneGrade {
  /** Desenfoque del fondo, 0 (nitido) a 1 (muy suave). */
  readonly blur: number;
  /** Intensidad del halo de las luces del fondo. */
  readonly bloom: number;
  /** Brillo a partir del cual algo desprende halo (lineal, 0-1). */
  readonly bloomThreshold: number;
  readonly saturation: number;
  readonly contrast: number;
  /** Calidez: positivo mas calido (rojo arriba, azul abajo). */
  readonly warmth: number;
  /** Oscurecimiento de las esquinas, 0-1. */
  readonly vignette: number;
  /**
   * Exposicion del personaje (solo el, no el fondo): 1 = como sale del render. Donde las
   * luces del lugar se suman (neon, fogata, contraluz) la cara se quemaba y quedaba plana;
   * bajarla un poco devuelve el sombreado sin oscurecer el escenario.
   */
  readonly exposure?: number;
  /**
   * Etalonaje de cine (2-oct): tinte de sombras y de luces (RGB, pequeño: ±0,05), cuanto se
   * levantan los negros (mate, 0-0,08) y grano de pelicula (0-0,05).
   */
  readonly shadows?: readonly [number, number, number];
  readonly highlights?: readonly [number, number, number];
  readonly matte?: number;
  readonly grain?: number;
}

export const PALETTES: Readonly<Record<SceneId, ScenePalette>> = {
  'luna-office': {
    fog: 0xe9e4da,
    fogNear: 3.2,
    fogFar: 9,
    sky: 0xf4f1ea,
    ground: 0x9c8a74,
    hemiIntensity: 0.45,
    rim: 0xfff2dc,
    rimIntensity: 1.0,
    key: 0xfff6ea,
    keyIntensity: 0.85,
    grade: { blur: 0.7, bloom: 0.25, bloomThreshold: 0.85, saturation: 1.05, contrast: 1.07, warmth: 0.01, vignette: 0.28, exposure: 0.9, shadows: [-0.012, 0.006, 0.02], highlights: [0.03, 0.016, -0.012], matte: 0.035, grain: 0.022 },
  },
  'nova-room': {
    fog: 0x1c0f22,
    fogNear: 3.0,
    fogFar: 8,
    // Relleno menos morado (2-oct): la piel se veia rosa entera; el neon queda en el contorno.
    sky: 0x5c4a68,
    ground: 0x261a20,
    hemiIntensity: 0.5,
    rim: 0xff5fae,
    rimIntensity: 1.3,
    key: 0xfff2ea,
    keyIntensity: 1.6,
    grade: { blur: 0.8, bloom: 0.75, bloomThreshold: 0.55, saturation: 1.12, contrast: 1.1, warmth: 0.0, vignette: 0.5, exposure: 0.8, shadows: [0.006, -0.01, 0.03], highlights: [0.035, 0.008, 0.004], matte: 0.04, grain: 0.03 },
  },
  'rio-outdoors': {
    fog: 0xf0b98a,
    fogNear: 5,
    fogFar: 26,
    sky: 0xa9c6e8,
    ground: 0x6a5238,
    hemiIntensity: 0.75,
    rim: 0xffb060,
    rimIntensity: 3.0,
    key: 0xfff0dc,
    keyIntensity: 1.8,
    grade: { blur: 0.6, bloom: 0.6, bloomThreshold: 0.7, saturation: 1.08, contrast: 1.05, warmth: 0.015, vignette: 0.32, exposure: 0.7, shadows: [-0.015, 0.008, 0.028], highlights: [0.04, 0.018, -0.02], matte: 0.03, grain: 0.024 },
  },
};

/**
 * Vistas pintadas de cada lugar (B del plan de realismo): la ciudad de Nova, el parque de
 * Luna y las montañas de Rio. Se cargan aparte, despues de la escena; si no hay imagen (null)
 * o falla (p. ej. aun no se han descargado), se ve la vista dibujada con codigo. Van en
 * mobile/public/escenarios/vistas/ (se descargan con deploy/vistas.sh).
 * Origen y licencia de cada imagen: docs/escenarios/VISTAS.md.
 */
export const PLATES: Record<SceneId, string | null> = {
  'luna-office': '/escenarios/vistas/luna-office.jpg',
  'nova-room': '/escenarios/vistas/nova-room.jpg',
  'rio-outdoors': '/escenarios/vistas/rio-outdoors.jpg',
};

/** Generador pseudoaleatorio con semilla (mulberry32): la escena sale igual cada vez. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Parpadeo de una vela: suma de senos de frecuencias no multiplos (no se repite a la vista),
 * entre `min` y 1. `phase` desincroniza varias velas.
 */
export function candleFlicker(t: number, phase: number, min = 0.72): number {
  const n =
    Math.sin(t * 7.3 + phase) * 0.5 +
    Math.sin(t * 13.1 + phase * 2.1) * 0.3 +
    Math.sin(t * 23.7 + phase * 3.7) * 0.2;
  // n en [-1, 1] -> [min, 1]
  return min + ((n + 1) / 2) * (1 - min);
}

/** Pulso lento del neon (respira, no parpadea: nada de destellos). */
export function neonPulse(t: number): number {
  return 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(t * 1.1));
}

/** Balanceo de hojas, ramas o cortinas: pequeño, lento y distinto para cada una. */
export function sway(t: number, phase: number, amount: number): number {
  return (Math.sin(t * 0.9 + phase) * 0.7 + Math.sin(t * 1.7 + phase * 1.3) * 0.3) * amount;
}
