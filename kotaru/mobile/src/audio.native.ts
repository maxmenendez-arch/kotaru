import { AudioContext, AudioManager, AudioRecorder, type AudioBufferQueueSourceNode } from 'react-native-audio-api';
import { configureAudioSession } from './audio-session';
import { INPUT_SAMPLE_RATE, type AppAudio, type AudioInput, type AudioOutput } from './audio-types';
import { floatToPcm16, pcm16ToFloat, resampleLinear } from './pcm';

export * from './audio-types';

/**
 * Audio real en iOS y Android con react-native-audio-api (Software Mansion, MIT).
 *
 * Una sola libreria gobierna la sesion de audio para captura y reproduccion (con dos se
 * pisan); la configuracion esta en audio-session.ts y la comparten los sonidos relajantes.
 *
 * No se guarda audio en ningun sitio: los trozos van al gateway y se olvidan.
 */
/** 20 ms por trozo: poca latencia y pocas llamadas al puente. */
const CHUNK_MS = 20;

class NativeMicrophone implements AudioInput {
  #recorder: AudioRecorder | null = null;
  #generation = 0;

  async start(onChunk: (pcm: Uint8Array) => void): Promise<boolean> {
    this.stop();
    const generation = ++this.#generation;
    const permission = await AudioManager.requestRecordingPermissions();
    if (permission !== 'Granted') return false;
    // Se solto el boton mientras se pedia el permiso.
    if (generation !== this.#generation) return true;
    configureAudioSession();
    await AudioManager.setAudioSessionActivity(true);

    const recorder = new AudioRecorder();
    const registered = recorder.onAudioReady(
      { sampleRate: INPUT_SAMPLE_RATE, bufferLength: (INPUT_SAMPLE_RATE * CHUNK_MS) / 1000, channelCount: 1 },
      (event) => {
        if (generation !== this.#generation) return;
        const { buffer } = event;
        const samples = buffer.getChannelData(0).subarray(0, event.numFrames);
        // La frecuencia pedida es orientativa: si el hardware entrega otra, se remuestrea.
        onChunk(floatToPcm16(resampleLinear(samples, buffer.sampleRate, INPUT_SAMPLE_RATE)));
      },
    );
    if (registered.status === 'error') return false;
    const started = await recorder.start();
    if (started.status === 'error') {
      recorder.clearOnAudioReady();
      return false;
    }
    if (generation !== this.#generation) {
      recorder.clearOnAudioReady();
      void recorder.stop();
      return true;
    }
    this.#recorder = recorder;
    return true;
  }

  stop(): void {
    this.#generation += 1;
    const recorder = this.#recorder;
    this.#recorder = null;
    if (!recorder) return;
    recorder.clearOnAudioReady();
    void recorder.stop();
  }
}

class NativeSpeaker implements AudioOutput {
  #context: AudioContext | null = null;
  #queue: AudioBufferQueueSourceNode | null = null;

  play(pcm: Uint8Array, sampleRate: number): void {
    if (pcm.byteLength < 2) return;
    configureAudioSession();
    this.#context ??= new AudioContext();
    const context = this.#context;
    // Se remuestrea a la frecuencia del contexto en vez de fiar la conversion al motor:
    // Polly entrega 16 kHz y el contexto suele ir a 48 kHz.
    const samples = resampleLinear(pcm16ToFloat(pcm), sampleRate, context.sampleRate) as Float32Array<ArrayBuffer>;
    const buffer = context.createBuffer(1, samples.length, context.sampleRate);
    buffer.copyToChannel(samples, 0);
    if (!this.#queue) {
      // La cola sigue viva cuando se vacia (suena silencio) y retoma al llegar mas audio.
      const queue = context.createBufferQueueSource();
      queue.connect(context.destination);
      queue.start();
      this.#queue = queue;
    }
    this.#queue.enqueueBuffer(buffer);
  }

  stopNow(): void {
    const queue = this.#queue;
    this.#queue = null;
    if (!queue) return;
    queue.clearBuffers();
    queue.stop();
    queue.disconnect();
  }

  dispose(): void {
    this.stopNow();
    void this.#context?.close();
    this.#context = null;
  }
}

export function createAudio(): AppAudio {
  return { input: new NativeMicrophone(), output: new NativeSpeaker(), simulated: false };
}
