import { useEffect, useMemo } from 'react';
import type { Particles } from '../reactions';

/**
 * Particulas de una reaccion (corazones, destellos, estrellas) que suben y se desvanecen
 * alrededor del personaje durante ~2 s. Dibujadas con SVG propio y animacion CSS: no
 * bloquean toques ni al lector de pantalla (la reaccion ya se ve en la cara).
 */
const SHAPES: Record<Exclude<Particles, 'none'>, string> = {
  hearts: 'M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 8.2a4.3 4.3 0 0 1 7.5 2.3c0 5.4-7.5 10-7.5 10z',
  sparkles: 'M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z',
  stars: 'M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z',
};
const COLORS: Record<Exclude<Particles, 'none'>, readonly string[]> = {
  hearts: ['#FF5FA2', '#FF8AC0', '#FFB3D5'],
  sparkles: ['#FFE8A3', '#FFFFFF', '#C7B8FF'],
  stars: ['#FFD27A', '#FFE8A3', '#9FB4FF'],
};

let styleInjected = false;
function injectStyle() {
  if (styleInjected || typeof document === 'undefined') return;
  styleInjected = true;
  const el = document.createElement('style');
  el.textContent = `@keyframes kotaru-rise{0%{transform:translate(0,0) scale(.4) rotate(0deg);opacity:0}15%{opacity:1}100%{transform:translate(var(--dx),-180px) scale(1) rotate(var(--rot));opacity:0}}
@media (prefers-reduced-motion: reduce){.kotaru-particle{animation-duration:0s!important;display:none}}`;
  document.head.appendChild(el);
}

export function ReactionBurst({ particles, burst }: { particles: Particles; /** cambia en cada reaccion */ burst: number }) {
  useEffect(injectStyle, []);
  const items = useMemo(() => {
    if (particles === 'none' || burst === 0) return [];
    const colors = COLORS[particles];
    return Array.from({ length: 12 }, (_, i) => ({
      key: `${burst}-${i}`,
      left: 30 + Math.random() * 40,
      top: 38 + Math.random() * 18,
      size: 22 + Math.random() * 20,
      dx: `${(Math.random() - 0.5) * 90}px`,
      rot: `${(Math.random() - 0.5) * 60}deg`,
      delay: Math.random() * 0.5,
      color: colors[i % colors.length]!,
    }));
  }, [particles, burst]);
  if (particles === 'none' || items.length === 0) return null;
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((p) => (
        <svg
          key={p.key}
          className="kotaru-particle"
          viewBox="0 0 24 24"
          width={p.size}
          height={p.size}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: 0,
            filter: `drop-shadow(0 0 6px ${p.color})`,
            animation: `kotaru-rise 2s ease-out ${p.delay}s forwards`,
            ['--dx' as string]: p.dx,
            ['--rot' as string]: p.rot,
          }}
        >
          <path d={SHAPES[particles]} fill={p.color} />
        </svg>
      ))}
    </div>
  );
}
