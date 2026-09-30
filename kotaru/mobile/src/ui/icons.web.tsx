import type { ReactElement } from 'react';

/**
 * Iconos propios de Kotaru (trazos simples, 24x24, dibujados para la app; no vienen de
 * ninguna libreria). En la web son SVG en linea: nitidos a cualquier tamaño y sin
 * descargas. En el movil nativo hay una version de texto (icons.tsx).
 */
export type IconName =
  | 'settings'
  | 'memory'
  | 'history'
  | 'sounds'
  | 'breathe'
  | 'heart'
  | 'people'
  | 'keyboard'
  | 'close'
  | 'pip'
  | 'send'
  | 'mic'
  | 'speaker'
  | 'speakerOff';

const PATHS: Record<IconName, ReactElement> = {
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
      <circle cx="12" cy="12" r="6.6" />
    </>
  ),
  memory: (
    <>
      <path d="M5 4.5h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" />
      <path d="M5 17a3 3 0 0 1 3-3h9.5M9 8.5h5" />
    </>
  ),
  history: (
    <>
      <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4 3.5v-3.5h-.5a2 2 0 0 1-2-2z" />
      <path d="M8.5 9h7M8.5 12h4.5" />
    </>
  ),
  sounds: (
    <>
      <path d="M9.5 17.5V6l9-2v11.5" />
      <circle cx="7" cy="17.5" r="2.5" />
      <circle cx="16" cy="15.5" r="2.5" />
    </>
  ),
  breathe: (
    <>
      <path d="M3.5 9h10a3 3 0 1 0-3-3" />
      <path d="M3.5 13h14a3 3 0 1 1-3 3" />
      <path d="M3.5 17h6" />
    </>
  ),
  speaker: (
    <>
      <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  speakerOff: (
    <>
      <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" />
      <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
    </>
  ),
  heart: <path d="M12 19.5s-7-4.3-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.2c0 5-7 9.3-7 9.3z" />,
  people: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 6M17 13.8a5.5 5.5 0 0 1 3.5 5.2" />
    </>
  ),
  keyboard: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="2" />
      <path d="M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  pip: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <rect x="12" y="11.5" width="7" height="5.5" rx="1" />
    </>
  ),
  send: <path d="M4.5 12l15-7-5 15-2.5-6.2z" />,
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
    </>
  ),
};

export function Icon({ name, size = 22, color = '#F5F7FC' }: { name: IconName; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      {PATHS[name]}
    </svg>
  );
}
