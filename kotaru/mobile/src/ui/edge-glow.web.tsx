import { useEffect, useRef } from 'react';
import { glowColors, glowStrength } from '../edge-glow-model';

/**
 * Borde de la pantalla que se enciende con la voz (pantalla inmersiva, web): un halo de
 * color que recorre el marco y respira con el volumen, como los asistentes de voz del
 * telefono. Es un diseño propio: degradado conico que gira, visible solo en una franja
 * suave junto a los bordes.
 *
 * - Escuchando: tonos calidos (naranja y rosa), siguiendo el volumen de tu voz.
 * - Hablando: el color del personaje, siguiendo el volumen de su voz.
 * - Pensando: un pulso lento y suave.
 * - En reposo o cerrado: apagado.
 *
 * Nunca es la unica señal del estado (el texto del estado esta arriba a la izquierda). Con
 * "reducir movimiento" no gira ni late: solo se enciende y se apaga.
 * Solo lee el volumen del instante (como la boca del avatar): no guarda ni analiza audio.
 */
export function EdgeGlow({ state, level, accent }: { state: string; level: () => number; accent: string }) {
  const ring = useRef<HTMLDivElement | null>(null);
  const live = useRef({ state, level, accent });
  live.current = { state, level, accent };

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      reduce = false;
    }
    let frame = 0;
    let angle = 0;
    let shown = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { state: st, level: lv, accent: ac } = live.current;
      const target = glowStrength(st, lv(), now / 1000, reduce);
      // Se enciende rapido y se apaga despacio.
      shown += (target - shown) * Math.min(1, dt * (target > shown ? 10 : 3));
      if (!reduce) angle = (angle + dt * (st === 'listening' ? 70 : 40)) % 360;
      const c = glowColors(st, ac);
      el.style.opacity = shown.toFixed(3);
      el.style.background = `conic-gradient(from ${angle.toFixed(1)}deg, ${c.join(', ')}, ${c[0]})`;
      // Franja suave en los cuatro bordes: dos degradados (horizontal y vertical) sumados.
      const w = (14 + shown * 26).toFixed(0);
      const mask = `linear-gradient(to right, #000, transparent ${w}px, transparent calc(100% - ${w}px), #000), linear-gradient(to bottom, #000, transparent ${w}px, transparent calc(100% - ${w}px), #000)`;
      el.style.maskImage = mask;
      el.style.setProperty('-webkit-mask-image', mask);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0,
        zIndex: 5,
        // Los dos degradados de la mascara se suman: queda solo el marco, con borde suave.
        maskComposite: 'add',
        WebkitMaskComposite: 'source-over',
        mixBlendMode: 'screen',
      }}
    />
  );
}
