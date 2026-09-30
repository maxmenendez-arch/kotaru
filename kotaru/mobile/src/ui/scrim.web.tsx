/**
 * Degradado oscuro sobre el short (web): de transparente arriba a casi negro abajo, para que
 * el texto se lea sobre cualquier plano. En nativo, un velo liso (scrim.tsx).
 */
export function Scrim({ from = 0.35, strength = 0.92 }: { from?: number; strength?: number }) {
  const start = Math.round(from * 100);
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `linear-gradient(to bottom, rgba(8,10,20,0.35) 0%, rgba(8,10,20,0) 14%, rgba(8,10,20,0) ${start}%, rgba(8,10,20,${strength * 0.75}) ${Math.min(95, start + 25)}%, rgba(8,10,20,${strength}) 100%)`,
      }}
    />
  );
}
