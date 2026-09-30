import type { CompanionId } from './companions';
import { filter, fire, gain, lfo, loop, rain, type Builder, type Noises, type Voice } from './ambient-engine.ts';

/**
 * Sonido de fondo de cada lugar y musica de los shorts de presentacion. Todo sintetizado
 * con Web Audio (como los sonidos relajantes): no hay archivos, nada que licenciar, y la
 * musica es original (acordes y ritmos genericos tocados por instrumentos sinteticos).
 *
 * - Lugares: la oficina de Luna (pajaros y brisa del parque tras la ventana, tono de sala),
 *   el cuarto de Nova (lluvia contra la ventana, trafico lejano y coches que pasan por el
 *   asfalto mojado), el claro de Rio (fogata, grillos y el lago).
 * - Musica: Luna, lo-fi tranquilo; Nova, R&B nocturno; Rio, guitarra alegre.
 */

export type SceneSound = 'office' | 'city-night' | 'campfire';
export type ReelMusic = 'music-luna' | 'music-nova' | 'music-rio';

export const SCENE_OF: Readonly<Record<CompanionId, SceneSound>> = { luna: 'office', nova: 'city-night', rio: 'campfire' };
export const MUSIC_OF: Readonly<Record<CompanionId, ReelMusic>> = { luna: 'music-luna', nova: 'music-nova', rio: 'music-rio' };

// ---- Eventos sueltos -----------------------------------------------------------------

/** Llama a `fire(t)` con llegadas de Poisson (`rate` por segundo), programando 0,3 s por delante. */
function every(ctx: AudioContext, rate: number, fireAt: (t: number) => void, startIn = 0): () => void {
  let ahead = ctx.currentTime + startIn;
  const tick = () => {
    const until = ctx.currentTime + 0.3;
    while (ahead < until) {
      ahead += -Math.log(1 - Math.random()) / rate;
      fireAt(ahead);
    }
  };
  tick();
  const timer = setInterval(tick, 100);
  return () => clearInterval(timer);
}

/** Un trino: 2-5 notas cortas que suben o bajan, como un pajaro pequeño lejos. */
function chirp(ctx: AudioContext, out: AudioNode, t: number, level: number): void {
  const notes = 2 + Math.floor(Math.random() * 4);
  const base = 2800 + Math.random() * 2200;
  for (let i = 0; i < notes; i++) {
    const at = t + i * (0.07 + Math.random() * 0.05);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const f0 = base * (0.9 + Math.random() * 0.25);
    osc.frequency.setValueAtTime(f0, at);
    osc.frequency.exponentialRampToValueAtTime(f0 * (Math.random() < 0.5 ? 1.35 : 0.75), at + 0.06);
    const env = gain(ctx, 0);
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(level, at + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    osc.connect(env).connect(out);
    osc.start(at);
    osc.stop(at + 0.09);
  }
}

/** Un coche que pasa por asfalto mojado: soplido de ruido que sube y baja, con el filtro abriendose al acercarse. */
function carPass(ctx: AudioContext, out: AudioNode, n: Noises, t: number, level: number): void {
  const dur = 3 + Math.random() * 2.5;
  const src = ctx.createBufferSource();
  src.buffer = n.pink;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 0.8;
  bp.frequency.setValueAtTime(350, t);
  bp.frequency.linearRampToValueAtTime(1400, t + dur * 0.5);
  bp.frequency.linearRampToValueAtTime(300, t + dur);
  const env = gain(ctx, 0);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(level, t + dur * 0.5);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(env).connect(out);
  src.start(t, Math.random() * (n.pink.duration - dur - 0.1));
  src.stop(t + dur + 0.05);
}

/** Grillo: 3-4 pulsos rapidos a ~4,5 kHz. */
function cricket(ctx: AudioContext, out: AudioNode, t: number, pitch: number, level: number): void {
  const pulses = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < pulses; i++) {
    const at = t + i * 0.045;
    const osc = ctx.createOscillator();
    osc.frequency.value = pitch;
    const env = gain(ctx, 0);
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(level, at + 0.008);
    env.gain.linearRampToValueAtTime(0, at + 0.03);
    osc.connect(env).connect(out);
    osc.start(at);
    osc.stop(at + 0.04);
  }
}

// ---- Lugares --------------------------------------------------------------------------

/** Oficina de dia: tono de sala, brisa del parque y pajaros al otro lado de la ventana. */
function office(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const room = loop(ctx, n.pink);
  room.connect(filter(ctx, 'lowpass', 380)).connect(gain(ctx, 0.3)).connect(out);
  const breeze = loop(ctx, n.brown);
  const bg = gain(ctx, 0.35);
  breeze.connect(filter(ctx, 'bandpass', 500, 0.8)).connect(bg).connect(out);
  const gust = lfo(ctx, bg.gain, 0.05, 0.18, 0.5);
  // Por la ventana: pajaros amortiguados.
  const window = filter(ctx, 'lowpass', 5200);
  window.connect(out);
  const stopBirds = every(ctx, 0.55, (t) => chirp(ctx, window, t, 0.05 + Math.random() * 0.06), 0.5);
  return { out, stop: () => { stopBirds(); gust.stop(); room.stop(); breeze.stop(); out.disconnect(); } };
}

/** Cuarto de noche: lluvia en la ventana, rumor de ciudad y coches pasando por la calle mojada. */
function cityNight(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  // La lluvia se oye a traves del cristal: sin los agudos.
  const glass = filter(ctx, 'lowpass', 3800);
  const rainLevel = gain(ctx, 0.75);
  glass.connect(rainLevel).connect(out);
  const r = rain(ctx, n);
  r.out.gain.value = 1;
  r.out.connect(glass);
  const hum = loop(ctx, n.brown);
  hum.connect(filter(ctx, 'lowpass', 180)).connect(gain(ctx, 0.35)).connect(out);
  const street = filter(ctx, 'lowpass', 2500);
  street.connect(out);
  const stopCars = every(ctx, 1 / 7, (t) => carPass(ctx, street, n, t, 0.12 + Math.random() * 0.12), 2);
  return { out, stop: () => { stopCars(); r.stop(); hum.stop(); out.disconnect(); } };
}

/** Claro de montaña al atardecer: fogata cerca, grillos y el lago que golpea la orilla. */
function campfire(ctx: AudioContext, n: Noises): Voice {
  const out = gain(ctx, 0);
  const f = fire(ctx, n);
  f.out.gain.value = 0.7;
  f.out.connect(out);
  const shore = loop(ctx, n.brown);
  const lp = filter(ctx, 'lowpass', 450);
  const lap = gain(ctx, 0.2);
  shore.connect(lp).connect(lap).connect(out);
  const lapLfo = lfo(ctx, lap.gain, 0.22, 0.05, 0.3);
  const crickets = filter(ctx, 'highpass', 2500);
  crickets.connect(out);
  const stopA = every(ctx, 1.1, (t) => cricket(ctx, crickets, t, 4400, 0.018));
  const stopB = every(ctx, 0.8, (t) => cricket(ctx, crickets, t, 4950, 0.012), 0.4);
  return { out, stop: () => { stopA(); stopB(); lapLfo.stop(); f.stop(); shore.stop(); out.disconnect(); } };
}

// ---- Musica ---------------------------------------------------------------------------

const NOTE = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

interface Song {
  readonly bpm: number;
  /** Acordes (notas MIDI), uno por compas de 4 tiempos. */
  readonly chords: readonly (readonly number[])[];
  readonly pad: number;
  readonly pluck: number;
  /** Probabilidad de nota de arpegio en cada corchea. */
  readonly density: number;
  readonly bass: number;
  readonly drums: 'none' | 'soft' | 'shaker';
  /** Brillo del sonido (corte del filtro del pad, Hz). */
  readonly tone: number;
}

/** Progresiones y ritmos genericos (no son canciones existentes). */
export const SONGS: Readonly<Record<ReelMusic, Song>> = {
  // Lo-fi tranquilo: Fmaj7 - Em7 - Dm7 - Cmaj7.
  'music-luna': { bpm: 70, chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]], pad: 0.09, pluck: 0.07, density: 0.35, bass: 0.1, drums: 'none', tone: 1400 },
  // R&B nocturno: Am9 - Fmaj7 - Dm9 - Esus4.
  'music-nova': { bpm: 82, chords: [[57, 60, 64, 67, 71], [53, 57, 60, 64], [50, 53, 57, 60, 64], [52, 57, 59, 64]], pad: 0.08, pluck: 0.05, density: 0.25, bass: 0.16, drums: 'soft', tone: 1100 },
  // Guitarra alegre de fogata: G - D - Em - C.
  'music-rio': { bpm: 104, chords: [[55, 59, 62, 67], [50, 54, 57, 62], [52, 55, 59, 64], [48, 52, 55, 60]], pad: 0.035, pluck: 0.08, density: 0.85, bass: 0.12, drums: 'shaker', tone: 2200 },
};

function makeSong(song: Song): Builder {
  return (ctx: AudioContext, n: Noises): Voice => {
    const out = gain(ctx, 0);
    // Un eco suave para que no suene seco.
    const echo = ctx.createDelay(1);
    echo.delayTime.value = (60 / song.bpm) * 0.75;
    const feedback = gain(ctx, 0.28);
    const echoTone = filter(ctx, 'lowpass', 2600);
    echo.connect(echoTone).connect(feedback).connect(echo);
    echoTone.connect(gain(ctx, 0.5)).connect(out);
    const dry = gain(ctx, 1);
    dry.connect(out);
    dry.connect(echo);

    const beat = 60 / song.bpm;
    const bar = beat * 4;
    let next = ctx.currentTime + 0.1;
    let step = 0;
    const nodes: AudioScheduledSourceNode[] = [];
    const track = (node: AudioScheduledSourceNode) => {
      nodes.push(node);
      node.onended = () => {
        const i = nodes.indexOf(node);
        if (i >= 0) nodes.splice(i, 1);
      };
    };

    const pad = (notes: readonly number[], t: number) => {
      const lp = filter(ctx, 'lowpass', song.tone, 0.5);
      const env = gain(ctx, 0);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(song.pad, t + bar * 0.3);
      env.gain.setValueAtTime(song.pad, t + bar * 0.85);
      env.gain.linearRampToValueAtTime(0, t + bar * 1.1);
      lp.connect(env).connect(dry);
      for (const m of notes) {
        for (const detune of [-6, 6]) {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.value = NOTE(m);
          osc.detune.value = detune;
          const g = gain(ctx, 1 / notes.length);
          osc.connect(g).connect(lp);
          osc.start(t);
          osc.stop(t + bar * 1.15);
          track(osc);
        }
      }
    };
    const pluck = (m: number, t: number, level: number) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = NOTE(m);
      const env = gain(ctx, 0);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(level, t + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(filter(ctx, 'lowpass', 3200)).connect(env).connect(dry);
      osc.start(t);
      osc.stop(t + 1);
      track(osc);
    };
    const bassNote = (m: number, t: number, dur: number) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = NOTE(m - 12);
      const env = gain(ctx, 0);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(song.bass, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(env).connect(dry);
      osc.start(t);
      osc.stop(t + dur + 0.05);
      track(osc);
    };
    const tick = (t: number, level: number, hp: number, len: number) => {
      const src = ctx.createBufferSource();
      src.buffer = n.white;
      const env = gain(ctx, 0);
      env.gain.setValueAtTime(level, t);
      env.gain.exponentialRampToValueAtTime(0.0001, t + len);
      src.connect(filter(ctx, 'highpass', hp)).connect(env).connect(out);
      src.start(t, Math.random() * 4, len + 0.02);
      track(src);
    };
    const kick = (t: number) => {
      const osc = ctx.createOscillator();
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
      const env = gain(ctx, 0);
      env.gain.setValueAtTime(0.22, t);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.connect(env).connect(out);
      osc.start(t);
      osc.stop(t + 0.32);
      track(osc);
    };

    // Secuenciador en corcheas, programando 0,4 s por delante.
    const schedule = () => {
      while (next < ctx.currentTime + 0.4) {
        const eighth = step % 8;
        const chord = song.chords[Math.floor(step / 8) % song.chords.length]!;
        if (eighth === 0) {
          if (song.pad > 0) pad(chord, next);
          bassNote(chord[0]!, next, beat * 1.8);
        }
        if (eighth === 4 || (song.drums === 'soft' && eighth === 7)) bassNote(chord[0]!, next, beat * 0.9);
        if (Math.random() < song.density) {
          const m = chord[Math.floor(Math.random() * chord.length)]! + 12;
          pluck(m, next, song.pluck * (eighth % 2 === 0 ? 1 : 0.7));
        }
        if (song.drums === 'soft') {
          if (eighth === 0 || eighth === 4) kick(next);
          if (eighth % 2 === 1) tick(next, 0.03, 7000, 0.04);
        } else if (song.drums === 'shaker') {
          tick(next, eighth % 2 === 0 ? 0.035 : 0.02, 6000, 0.06);
          tick(next + beat / 4, 0.015, 6500, 0.05);
        }
        next += beat / 2;
        step++;
      }
    };
    schedule();
    const timer = setInterval(schedule, 100);
    return {
      out,
      stop: () => {
        clearInterval(timer);
        for (const node of nodes.slice()) {
          try {
            node.stop();
          } catch {
            // ya parado
          }
        }
        out.disconnect();
      },
    };
  };
}

export const SCENE_BUILDERS: Readonly<Record<SceneSound, Builder>> = { office, 'city-night': cityNight, campfire };
export const MUSIC_BUILDERS: Readonly<Record<ReelMusic, Builder>> = {
  'music-luna': makeSong(SONGS['music-luna']),
  'music-nova': makeSong(SONGS['music-nova']),
  'music-rio': makeSong(SONGS['music-rio']),
};
