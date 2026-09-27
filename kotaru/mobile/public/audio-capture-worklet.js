// Captura del microfono en la webapp (src/audio.web.ts). Junta bloques de 1024 muestras
// antes de enviarlos para no saturar el hilo principal con mensajes de 128.
class KotaruCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(1024);
    this.n = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.n++] = ch[i];
        if (this.n === this.buf.length) {
          this.port.postMessage(this.buf.slice(0));
          this.n = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('kotaru-capture', KotaruCapture);
