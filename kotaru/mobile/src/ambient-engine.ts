import type { Ambient, AmbientKind } from './ambient-types';

/**
 * Motor de los sonidos relajantes, comun a la web y al movil: ruido filtrado y eventos
 * aleatorios (gotas, chasquidos, rafagas) con nodos de Web Audio. No hay archivos de audio:
 * nada que licenciar, nada que descargar, y cada sesion suena un poco distinta.
 *
 * Todo pasa por un volumen maestro que baja solo mientras habla el personaje (`duck`).
 * El contexto se crea al primer `play` (los navegadores no dejan sonar audio antes de un gesto).
 */

const FADE_S = 1.2;
/** Mientras habla el personaje el ambiente queda casi de fondo, para que se le entienda. */
const DUCK_LEVEL = 0.15;
/** Baja rapido cuando empieza a hablar y vuelve despacio cuando termina. */
const DUCK_DOWN_S = 0.15;
const DUCK_UP_S = 0.9;

export interface EngineOptions {
  /** Donde se conecta el volumen maestro (en la web, la mezcla con limitador). */
  readonly output?: (ctx: AudioContext) => AudioNode;
  /** El contexto es compartido con la voz: al cerrar la pantalla no se cierra. */
  readonly sharedContext?: boolean;
}

/** Un sonido en marcha: sus nodos y sus temporizadores, para pararlo limpio. */
export interface Voice {
  readonly out: GainNode;
  readonly stop: () => void;
}

export type Noises = { white: AudioBuffer; pink: AudioBuffer; brown: AudioBuffer };
export type Builder = (ctx: AudioContext, n: Noises) => Voice;

/**
 * Reproductor de un sonido a la vez (con fundido entre uno y otro), volumen maestro y
 * `duck`. Sirve para los sonidos relajantes (EngineAmbient), el ambiente de cada escenario
 * y la musica de los shorts (scene-sounds.ts): cambia solo el catalogo de sonidos.
 */
export class EngineSound<K extends string> {
  readonly available = true;
  #context: AudioContext | null = null;
  #master: GainNode | null = null;
  #noise: Noises | null = null;
  #current: { kind: K; voice: Voice } | null = null;
  #volume = 0.6;
  readonly #builders: Readonly<Record<K, Builder>>;
  #ducked = false;
  readonly #makeContext: () => AudioContext | null;
  readonly #beforePlay: () => void;
  readonly #options: EngineOptions;

  /**
   * @param makeContext crea el contexto de audio (Web Audio en el navegador,
   *   react-native-audio-api en iOS/Android: tienen los mismos nodos).
   * @param beforePlay se llama antes de sonar (en el movil activa la sesion de audio).
   */
  constructor(builders: Readonly<Record<K, Builder>>, makeContext: () => AudioContext | null, beforePlay: () => void = () => undefined, options: EngineOptions = {}, volume = 0.6) {
    this.#builders = builders;
    this.#volume = volume;
    this.#makeContext = makeContext;
    this.#beforePlay = beforePlay;
    this.#options = options;
  }

  get playing(): K | null {
    return this.#current?.kind ?? null;
  }

  play(kind: K): void {
    this.#beforePlay();
    const ctx = this.#ensure();
    if (!ctx || !this.#master) return;
    void ctx.resume();
    if (this.#current?.kind === kind) return;
    this.#fadeOutCurrent();
    const voice = this.#builders[kind](ctx, this.#noise!);
    voice.out.gain.setValueAtTime(0, ctx.currentTime);
    voice.out.gain.linearRampToValueAtTime(1, ctx.currentTime + FADE_S);
    voice.out.connect(this.#master);
    this.#current = { kind, voice };
  }

  stop(): void {
    this.#fadeOutCurrent();
  }

  setVolume(volume: number): void {
    this.#volume = Math.min(1, Math.max(0, volume));
    this.#applyMaster();
  }

  get volume(): number {
    return this.#volume;
  }

  duck(on: boolean): void {
    if (this.#ducked === on) return;
    this.#ducked = on;
    this.#applyMaster(on ? DUCK_DOWN_S : DUCK_UP_S);
  }

  dispose(): void {
    this.#current?.voice.stop();
    this.#current = null;
    if (this.#options.sharedContext) this.#master?.disconnect();
    else void this.#context?.close();
    this.#context = null;
    this.#master = null;
  }

  #ensure(): AudioContext | null {
    if (this.#context) return this.#context;
    const ctx = this.#makeContext();
    if (!ctx) return null;
    this.#context = ctx;
    this.#master = ctx.createGain();
    this.#master.connect(this.#options.output?.(ctx) ?? ctx.destination);
    this.#noise = { white: noise(ctx, 'white'), pink: noise(ctx, 'pink'), brown: noise(ctx, 'brown') };
    this.#applyMaster(0);
    return ctx;
  }

  #applyMaster(rampS = 0.3): void {
    if (!this.#context || !this.#master) return;
    const target = this.#volume * (this.#ducked ? DUCK_LEVEL : 1);
    const now = this.#context.currentTime;
    this.#master.gain.cancelScheduledValues(now);
    this.#master.gain.setValueAtTime(this.#master.gain.value, now);
    this.#master.gain.linearRampToValueAtTime(target, now + Math.max(0.01, rampS));
  }

  #fadeOutCurrent(): void {
    const current = this.#current;
    const ctx = this.#context;
    this.#current = null;
    if (!current || !ctx) return;
    const now = ctx.currentTime;
    current.voice.out.gain.cancelScheduledValues(now);
    current.voice.out.gain.setValueAtTime(current.voice.out.gain.value, now);
    current.voice.out.gain.linearRampToValueAtTime(0, now + FADE_S);
    setTimeout(() => current.voice.stop(), FADE_S * 1000 + 100);
  }
}

/** Los sonidos relajantes (lluvia, fuego, cascada, viento, olas). */
export class EngineAmbient extends EngineSound<AmbientKind> implements Ambient {
  constructor(makeContext: () => AudioContext | null, beforePlay: () => void = () => undefined, options: EngineOptions = {}) {
    super(BUILDERS, makeContext, beforePlay, options);
  }
}

// ---- Ruido base ----------------------------------------------------------------------

/** 6 s de ruido en bucle. Rosa y marron con los filtros clasicos (Kellet / integrador). */
function noise(ctx: AudioContext, color: 'white' | 'pink' | 'brown'): AudioBuffer {
  const length = ctx.sampleRate * 6;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  // Se llena aparte y se copia: en el movil getChannelData puede devolver una copia.
  const data = new Float32Array(length);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === 'white') {
      data[i] = white * 0.5;
    } else if (color === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  buffer.copyToChannel(data, 0);
  return buffer;
}

export function loop(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  // Empezar en un punto al azar: dos sonidos iguales no se sincronizan.
  src.start(0, Math.random() * buffer.duration);
  return src;
}

export function filter(ctx: AudioContext, type: BiquadFilterType, frequency: number, q = 0.7): BiquadFilterNode {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = q;
  return f;
}

export function gain(ctx: AudioContext, value: number): GainNode {
  const g = ctx.createGain();
  g.gain.value = value;
  return g;
}

/** Oscilador lento que mueve un parametro entre `min` y `max`. */
export function lfo(ctx: AudioContext, param: AudioParam, hz: number, min: number, max: number): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.frequency.value = hz;
  const depth = gain(ctx, (max - min) / 2);
  param.value = (max + min) / 2;
  osc.connect(depth).connect(param);
  osc.start();
  return osc;
}

/**
 * Eventos cortos al azar (gotas, chasquidos): cada 100 ms se programan los del siguiente
 * tramo, con `rate` eventos por segundo de media.
 */
export function scatter(
  ctx: AudioContext,
  out: AudioNode,
  noiseBuffer: AudioBuffer,
  opts: { rate: number; minMs: number; maxMs: number; band: [number, number]; level: [number, number] },
): () => void {
  let ahead = ctx.currentTime;
  const tick = () => {
    const until = ctx.currentTime + 0.25;
    while (ahead < until) {
      ahead += -Math.log(1 - Math.random()) / opts.rate; // llegadas de Poisson
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      const bp = filter(ctx, 'bandpass', opts.band[0] + Math.random() * (opts.band[1] - opts.band[0]), 2 + Math.random() * 4);
      const env = gain(ctx, 0);
      const peak = opts.level[0] + Math.random() * (opts.level[1] - opts.level[0]);
      const dur = (opts.minMs + Math.random() * (opts.maxMs - opts.minMs)) / 1000;
      env.gain.setValueAtTime(0, ahead);
      env.gain.linearRampToValueAtTime(peak, ahead + 0.002);
      env.gain.exponentialRampToValueAtTime(0.0001, ahead + dur);
      src.connect(bp).connect(env).connect(out);
      src.start(ahead, Math.random() * (noiseBuffer.duration - 0.2), dur + 0.02);
    }
  };
  tick();
  const timer = setInterval(tick, 100);
  return () => clearInterval(timer);
}

// ---- Los cinco sonidos ---------------------------------------------------------------


export function rain(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const bed = loop(ctx, n.pink);
  bed.connect(filter(ctx, 'highpass', 500)).connect(filter(ctx, 'lowpass', 7000)).connect(gain(ctx, 0.55)).connect(out);
  const stopDrops = scatter(ctx, out, n.white, { rate: 28, minMs: 8, maxMs: 30, band: [2500, 6500], level: [0.05, 0.25] });
  return { out, stop: () => { stopDrops(); bed.stop(); out.disconnect(); } };
}

export function fire(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const rumble = loop(ctx, n.brown);
  const rumbleGain = gain(ctx, 0.35);
  rumble.connect(filter(ctx, 'lowpass', 420)).connect(rumbleGain).connect(out);
  const flicker = lfo(ctx, rumbleGain.gain, 0.3, 0.25, 0.45);
  const stopCrackle = scatter(ctx, out, n.white, { rate: 9, minMs: 2, maxMs: 12, band: [1500, 5000], level: [0.1, 0.5] });
  const stopPops = scatter(ctx, out, n.white, { rate: 1.2, minMs: 15, maxMs: 45, band: [600, 1800], level: [0.3, 0.8] });
  return { out, stop: () => { stopCrackle(); stopPops(); flicker.stop(); rumble.stop(); out.disconnect(); } };
}

function waterfall(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const body = loop(ctx, n.pink);
  const lp = filter(ctx, 'lowpass', 2800);
  body.connect(filter(ctx, 'highpass', 120)).connect(lp).connect(gain(ctx, 0.9)).connect(out);
  const shimmer = lfo(ctx, lp.frequency, 0.07, 2400, 3200);
  const hiss = loop(ctx, n.white);
  hiss.connect(filter(ctx, 'highpass', 5000)).connect(gain(ctx, 0.06)).connect(out);
  return { out, stop: () => { shimmer.stop(); body.stop(); hiss.stop(); out.disconnect(); } };
}

export function wind(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const src = loop(ctx, n.brown);
  const bp = filter(ctx, 'bandpass', 600, 1.2);
  const g = gain(ctx, 0.8);
  src.connect(bp).connect(g).connect(out);
  const sweep = lfo(ctx, bp.frequency, 0.06, 280, 950);
  const gust = lfo(ctx, g.gain, 0.11, 0.35, 1.0);
  const whistle = loop(ctx, n.pink);
  const wbp = filter(ctx, 'bandpass', 1400, 8);
  const wg = gain(ctx, 0.05);
  whistle.connect(wbp).connect(wg).connect(out);
  const wsweep = lfo(ctx, wbp.frequency, 0.045, 1100, 1900);
  return { out, stop: () => { sweep.stop(); gust.stop(); wsweep.stop(); src.stop(); whistle.stop(); out.disconnect(); } };
}

export function waves(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const src = loop(ctx, n.brown);
  const lp = filter(ctx, 'lowpass', 700);
  const swell = gain(ctx, 0.5);
  src.connect(lp).connect(swell).connect(out);
  // Una ola cada ~9 s: sube el volumen y abre el filtro a la vez (la espuma).
  const surge = lfo(ctx, swell.gain, 0.11, 0.08, 1.0);
  const foam = lfo(ctx, lp.frequency, 0.11, 400, 1600);
  const spray = loop(ctx, n.white);
  const sprayGain = gain(ctx, 0.04);
  spray.connect(filter(ctx, 'highpass', 3500)).connect(sprayGain).connect(out);
  const sprayLfo = lfo(ctx, sprayGain.gain, 0.11, 0.0, 0.08);
  return { out, stop: () => { surge.stop(); foam.stop(); sprayLfo.stop(); src.stop(); spray.stop(); out.disconnect(); } };
}

const BUILDERS: Readonly<Record<AmbientKind, (ctx: AudioContext, n: Noises) => Voice>> = { rain, fire, waterfall, wind, waves };

