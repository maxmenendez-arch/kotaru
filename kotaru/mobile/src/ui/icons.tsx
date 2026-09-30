import { Text } from 'react-native';

/**
 * Iconos en el movil nativo: por ahora un simbolo de texto (la pantalla inmersiva, que es
 * donde se usan, solo existe en la web; ver icons.web.tsx).
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

const GLYPH: Record<IconName, string> = {
  settings: '⚙',
  memory: '☰',
  history: '…',
  sounds: '♪',
  breathe: '~',
  heart: '♡',
  people: '☺',
  keyboard: '⌨',
  close: '×',
  pip: '▣',
  send: '➤',
  mic: '●',
  speaker: '🔊',
  speakerOff: '🔇',
};

export function Icon({ name, size = 22, color = '#F5F7FC' }: { name: IconName; size?: number; color?: string }) {
  return <Text style={{ fontSize: size * 0.8, lineHeight: size, color, textAlign: 'center', width: size }}>{GLYPH[name]}</Text>;
}
