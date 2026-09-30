/**
 * Mezclador de clips capturados (mocap.ts) para un personaje: una base en bucle (de pie en
 * reposo, o contando algo con las manos mientras habla) y acciones sueltas encima (beber,
 * arreglarse el pelo), todo con fundidos suaves para que nunca salte.
 *
 * El bucle se cierra con un fundido del final al principio del mismo clip, y cada capa entra y
 * sale con su propio fundido. El resultado es una rotacion local por hueso y el desplazamiento
 * de la cadera; avatar-viewer los aplica encima del movimiento de codigo (idle-body), con el
 * peso que toque (los gestos de brazo y la mirada siguen mandando donde deben).
 */
import { Quaternion, Vector3 } from 'three';
import { Retarget } from './mocap.ts';

interface Layer {
  readonly name: string;
  readonly retarget: Retarget;
  readonly duration: number;
  readonly loop: boolean;
  /** Tramo del clip que se usa: [desde, hasta) en segundos. */
  readonly from: number;
  readonly to: number;
  time: number;
  weight: number;
  target: number;
  readonly fadeIn: number;
  readonly fadeOut: number;
  /** Velocidad: 1 = tiempo real. */
  readonly rate: number;
}

export interface PlayOptions {
  readonly loop?: boolean;
  readonly fadeIn?: number;
  readonly fadeOut?: number;
  readonly from?: number;
  readonly to?: number;
  readonly rate?: number;
  /** Empezar en un punto al azar del tramo (para que dos bases no vayan sincronizadas). */
  readonly randomStart?: boolean;
}

const LOOP_FADE = 0.8;

export class MotionPlayer {
  readonly #layers: Layer[] = [];
  readonly #tmp = new Map<string, Quaternion>();
  readonly #tmpHips = new Vector3();
  readonly #tmp2 = new Map<string, Quaternion>();
  readonly #tmpHips2 = new Vector3();
  readonly pose = new Map<string, Quaternion>();
  readonly hips = new Vector3();

  play(name: string, retarget: Retarget, duration: number, options: PlayOptions = {}): void {
    const from = options.from ?? 0;
    const to = Math.min(duration, options.to ?? duration);
    // Si ya suena, no se reinicia.
    const current = this.#layers.find((l) => l.name === name && l.target > 0);
    if (current) return;
    const span = to - from;
    this.#layers.push({
      name,
      retarget,
      duration,
      loop: options.loop ?? false,
      from,
      to,
      time: options.randomStart ? Math.random() * span : 0,
      weight: 0,
      target: 1,
      fadeIn: options.fadeIn ?? 0.6,
      fadeOut: options.fadeOut ?? 0.6,
      rate: options.rate ?? 1,
    });
  }

  /** Deja de sonar (con su fundido de salida). */
  stop(name: string): void {
    for (const l of this.#layers) if (l.name === name) l.target = 0;
  }

  isPlaying(name: string): boolean {
    return this.#layers.some((l) => l.name === name && l.target > 0);
  }

  /** Cuanto falta para que termine una accion suelta (s), o 0. */
  remaining(name: string): number {
    const l = this.#layers.find((x) => x.name === name && x.target > 0 && !x.loop);
    return l ? Math.max(0, l.to - l.from - l.time) : 0;
  }

  /** Peso total (0 a 1) con el que la captura manda sobre el movimiento de codigo. */
  get weight(): number {
    return Math.min(1, this.#layers.reduce((s, l) => s + l.weight, 0));
  }

  update(dt: number): void {
    for (const l of this.#layers) {
      l.time += dt * l.rate;
      const span = l.to - l.from;
      if (!l.loop && l.time >= span - l.fadeOut) l.target = 0;
      if (l.loop && l.time >= span) l.time -= span - LOOP_FADE;
      const speed = l.target > l.weight ? 1 / l.fadeIn : 1 / l.fadeOut;
      l.weight += Math.sign(l.target - l.weight) * Math.min(Math.abs(l.target - l.weight), dt * speed);
    }
    // Fuera las capas que ya se apagaron.
    for (let i = this.#layers.length - 1; i >= 0; i--) {
      const l = this.#layers[i]!;
      if (l.target === 0 && l.weight <= 0.001) this.#layers.splice(i, 1);
    }
    // Mezcla: cada capa se funde sobre lo acumulado segun su peso relativo.
    let acc = 0;
    let first = true;
    for (const l of this.#layers) {
      if (l.weight <= 0.001) continue;
      this.#sample(l);
      acc += l.weight;
      const k = first ? 1 : l.weight / acc;
      for (const [bone, q] of this.#tmp) {
        const out = this.pose.get(bone);
        if (!out || first) this.pose.set(bone, (out ?? new Quaternion()).copy(q));
        else out.slerp(q, k);
      }
      if (first) this.hips.copy(this.#tmpHips);
      else this.hips.lerp(this.#tmpHips, k);
      first = false;
    }
  }

  /** Muestra de una capa, con el cierre del bucle fundido (final -> principio). */
  #sample(l: Layer): void {
    const span = l.to - l.from;
    l.retarget.pose(l.from + Math.min(l.time, span - 1e-3), this.#tmp, this.#tmpHips);
    if (l.loop && l.time > span - LOOP_FADE) {
      // Cerca del final: se mezcla con el principio para que el salto no se note.
      const k = (l.time - (span - LOOP_FADE)) / LOOP_FADE;
      l.retarget.pose(l.from + (l.time - (span - LOOP_FADE)), this.#tmp2, this.#tmpHips2);
      const s = k * k * (3 - 2 * k);
      for (const [bone, q] of this.#tmp) q.slerp(this.#tmp2.get(bone)!, s);
      this.#tmpHips.lerp(this.#tmpHips2, s);
    }
  }
}
