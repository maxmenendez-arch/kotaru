/**
 * Conversiones de PCM sin dependencias, para poder probarlas con Node.
 *
 * El gateway recibe PCM 16 bits little-endian mono a 24 kHz y devuelve PCM 16 bits a la
 * frecuencia que indique cada `audio_meta` (Polly: 16 kHz). El audio nativo trabaja en
 * float32 entre -1 y 1.
 */

/** float32 [-1, 1] → int16 little-endian. Recorta lo que se salga del rango. */
export function floatToPcm16(samples: Float32Array): Uint8Array {
  const out = new Uint8Array(samples.length * 2);
  const view = new DataView(out.buffer);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(i * 2, s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff), true);
  }
  return out;
}

/** int16 little-endian → float32 [-1, 1]. Un byte suelto al final se ignora. */
export function pcm16ToFloat(pcm: Uint8Array): Float32Array<ArrayBuffer> {
  const n = pcm.byteLength >> 1;
  const out = new Float32Array(n);
  const view = new DataView(pcm.buffer, pcm.byteOffset, n * 2);
  for (let i = 0; i < n; i++) out[i] = view.getInt16(i * 2, true) / 0x8000;
  return out;
}

/**
 * Remuestreo lineal. Basta para voz: el micro entrega a la frecuencia pedida casi siempre
 * y esto solo cubre el caso en que el hardware no puede (p. ej. 48 kHz fijo).
 */
export function resampleLinear(samples: Float32Array, from: number, to: number): Float32Array {
  if (from === to || samples.length === 0) return samples;
  const length = Math.max(1, Math.round((samples.length * to) / from));
  const out = new Float32Array(length);
  const step = from / to;
  for (let i = 0; i < length; i++) {
    const pos = i * step;
    const j = Math.floor(pos);
    const frac = pos - j;
    const a = samples[Math.min(j, samples.length - 1)]!;
    const b = samples[Math.min(j + 1, samples.length - 1)]!;
    out[i] = a + (b - a) * frac;
  }
  return out;
}
