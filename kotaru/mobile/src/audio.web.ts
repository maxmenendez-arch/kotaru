import { INPUT_SAMPLE_RATE, type AppAudio, type AudioInput, type AudioOutput } from './audio-types';
import { SilentSpeaker, SimulatedMicrophone } from './audio-sim';
import { ChunkAssembler, pcm16ToFloat } from './pcm';
import { audioContextCtor, sharedOutput } from './web-audio';

export * from './audio-types';

/**
 * Audio real en el navegador (webapp). Metro elige este archivo en la web; en iOS y
 * Android usa `audio.native.ts`.
 *
 * Micro: getUserMedia con cancelacion de eco, supresion de ruido y control de ganancia del
 * navegador; la pista se cierra al soltar el boton (el indicador de micro del navegador se
 * apaga). Las muestras salen por un AudioWorklet (o ScriptProcessor si el navegador no lo
 * tiene), se remuestrean a 24 kHz y se envian en trozos de 20 ms.
 *
 * Altavoz: cada trozo se programa justo detras del anterior en un AudioContext. El
 * navegador solo deja sonar audio despues de un gesto del usuario, asi que `unlock()` se
 * llama al pulsar el boton.
 *
 * No se guarda audio en ningun sitio.
 */

/** Servido desde mobile/public: la CSP de la webapp no admite scripts blob:. */
const WORKLET_URL = '/audio-capture-worklet.js';

class WebMicrophone implements AudioInput {
  #context: AudioContext | null = null;
  #workletLoaded: Promise<boolean> | null = null;
  #stream: MediaStream | null = null;
  #nodes: AudioNode[] = [];
  #generation = 0;

  async start(onChunk: (pcm: Uint8Array) => void): Promise<boolean> {
    this.stop();
    const generation = ++this.#generation;
    const Context = audioContextCtor();
    if (!Context || !navigator.mediaDevices?.getUserMedia) return false;

    // El contexto se crea y se reanuda dentro del gesto (pulsar el boton).
    this.#context ??= new Context();
    const context = this.#context;
    void context.resume();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
      });
    } catch {
      return false;
    }
    if (generation !== this.#generation) {
      stream.getTracks().forEach((t) => t.stop());
      return true;
    }
    this.#stream = stream;

    const assembler = new ChunkAssembler(INPUT_SAMPLE_RATE, 20, onChunk);
    const deliver = (samples: Float32Array) => {
      if (generation === this.#generation) assembler.push(samples, context.sampleRate);
    };

    const source = context.createMediaStreamSource(stream);
    // Un nodo que no llega al destino no se procesa en todos los navegadores: se conecta
    // a traves de una ganancia a cero, que no suena.
    const mute = context.createGain();
    mute.gain.value = 0;
    mute.connect(context.destination);

    let capture: AudioNode;
    if (await this.#loadWorklet(context)) {
      const node = new AudioWorkletNode(context, 'kotaru-capture');
      node.port.onmessage = (e: MessageEvent<Float32Array>) => deliver(e.data);
      capture = node;
    } else {
      const node = context.createScriptProcessor(1024, 1, 1);
      node.onaudioprocess = (e) => deliver(new Float32Array(e.inputBuffer.getChannelData(0)));
      capture = node;
    }
    if (generation !== this.#generation) {
      stream.getTracks().forEach((t) => t.stop());
      return true;
    }
    source.connect(capture);
    capture.connect(mute);
    this.#nodes = [source, capture, mute];
    return true;
  }

  #loadWorklet(context: AudioContext): Promise<boolean> {
    if (!context.audioWorklet) return Promise.resolve(false);
    this.#workletLoaded ??= context.audioWorklet.addModule(WORKLET_URL).then(
      () => true,
      () => false,
    );
    return this.#workletLoaded;
  }

  stop(): void {
    this.#generation += 1;
    for (const node of this.#nodes) node.disconnect();
    this.#nodes = [];
    this.#stream?.getTracks().forEach((t) => t.stop());
    this.#stream = null;
  }
}

/** Margen al empezar a sonar: absorbe trozos que llegan un poco tarde sin cortar la voz. */
const START_MARGIN_S = 0.12;

class WebSpeaker implements AudioOutput {
  #context: AudioContext | null = null;
  #analyser: AnalyserNode | null = null;
  #samples: Float32Array<ArrayBuffer> | null = null;
  #sources = new Set<AudioBufferSourceNode>();
  #nextStart = 0;

  unlock(): void {
    const out = sharedOutput();
    if (!out) return;
    if (this.#context !== out.context) {
      this.#context = out.context;
      this.#analyser = null;
    }
    void out.context.resume();
  }

  /** Todo lo que suena pasa por aqui camino de la mezcla, para medir su volumen. */
  #output(context: AudioContext): AudioNode {
    if (!this.#analyser) {
      this.#analyser = context.createAnalyser();
      this.#analyser.fftSize = 512;
      this.#analyser.connect(sharedOutput()?.bus ?? context.destination);
      this.#samples = new Float32Array(this.#analyser.fftSize);
    }
    return this.#analyser;
  }

  level(): number {
    const analyser = this.#analyser;
    const samples = this.#samples;
    if (!analyser || !samples || this.#sources.size === 0) return 0;
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (let i = 0; i < samples.length; i++) sum += samples[i]! * samples[i]!;
    // RMS de la voz hablada ronda 0.05-0.3: se lleva a 0-1.
    return Math.min(1, Math.sqrt(sum / samples.length) * 4);
  }

  /**
   * true mientras quede voz por sonar. El servidor suele mandar la respuesta mas rapido de
   * lo que se oye: el turno "termina" con varios segundos todavia en cola.
   */
  isPlaying(): boolean {
    return this.#sources.size > 0;
  }

  play(pcm: Uint8Array, sampleRate: number): void {
    if (pcm.byteLength < 2) return;
    this.unlock();
    const context = this.#context;
    if (!context) return;
    const samples = pcm16ToFloat(pcm);
    const buffer = context.createBuffer(1, samples.length, sampleRate);
    buffer.copyToChannel(samples, 0);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.#output(context));
    // Un poco de margen al empezar evita cortes; luego cada trozo va pegado al anterior.
    const at = Math.max(context.currentTime + START_MARGIN_S, this.#nextStart);
    source.start(at);
    this.#nextStart = at + buffer.duration;
    this.#sources.add(source);
    source.onended = () => this.#sources.delete(source);
  }

  stopNow(): void {
    for (const source of this.#sources) {
      try {
        source.stop();
      } catch {
        // ya habia terminado
      }
    }
    this.#sources.clear();
    this.#nextStart = 0;
  }

  dispose(): void {
    this.stopNow();
    // El contexto es compartido con los sonidos relajantes: no se cierra, solo se suelta.
    this.#analyser?.disconnect();
    this.#context = null;
    this.#analyser = null;
    this.#samples = null;
  }
}

export function createAudio(): AppAudio {
  if (!audioContextCtor()) {
    // Navegador sin Web Audio (o entorno de pruebas): el camino de red sigue funcionando.
    return { input: new SimulatedMicrophone(), output: new SilentSpeaker(), simulated: true };
  }
  return { input: new WebMicrophone(), output: new WebSpeaker(), simulated: false };
}
