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

/**
 * Voz y fondo dentro de la ventana flotante de video (iPhone): una salida de la mezcla como
 * pista de audio. Al pasar a la ventana, la mezcla deja de sonar por la pagina y suena solo
 * por el video (asi no se oye doble y sigue sonando fuera de Safari).
 */
let pipDestination: MediaStreamAudioDestinationNode | null = null;

export function pipVoiceTrack(): MediaStreamTrack | null {
  const out = sharedOutput();
  if (!out) return null;
  pipDestination ??= out.context.createMediaStreamDestination();
  return pipDestination.stream.getAudioTracks()[0] ?? null;
}

export function routeVoiceToPip(on: boolean): void {
  const out = sharedOutput();
  if (!out || !pipDestination) return;
  try {
    if (on) {
      out.bus.connect(pipDestination);
      out.bus.disconnect(out.context.destination);
    } else {
      out.bus.connect(out.context.destination);
      out.bus.disconnect(pipDestination);
    }
  } catch {
    // Ya estaba asi.
  }
}
