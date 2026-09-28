/**
 * Un solo contexto de audio para todo lo que suena en la webapp: la voz del personaje y
 * los sonidos relajantes. Antes cada uno tenia el suyo y el sistema operativo los sumaba
 * sin control: con lluvia o fogata de fondo la suma podia pasar del maximo y la voz se
 * oia rasposa. Ahora se mezclan aqui y pasan por un limitador antes del altavoz.
 *
 * El microfono sigue con su propio contexto (solo captura, no suena).
 */

type Ctor = typeof AudioContext;

export function audioContextCtor(): Ctor | null {
  const w = globalThis as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

let shared: { context: AudioContext; bus: AudioNode } | null = null;

/**
 * El contexto compartido y la entrada de la mezcla final. Se crea la primera vez que se
 * pide (dentro de un gesto: los navegadores no dejan sonar antes) y no se cierra al salir
 * de la pantalla: la siguiente conversacion lo reutiliza.
 */
export function sharedOutput(): { context: AudioContext; bus: AudioNode } | null {
  if (shared && shared.context.state !== 'closed') return shared;
  const Context = audioContextCtor();
  if (!Context) return null;
  const context = new Context();
  // Limitador suave: no toca la voz a volumen normal, solo frena los picos de la suma.
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.knee.value = 6;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  limiter.connect(context.destination);
  shared = { context, bus: limiter };
  return shared;
}
