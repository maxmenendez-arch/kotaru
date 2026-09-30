import { View } from 'react-native';

/** Velo oscuro liso en nativo (en la web es un degradado: scrim.web.tsx). */
export function Scrim({ strength = 0.92 }: { from?: number; strength?: number }) {
  return <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', backgroundColor: `rgba(8,10,20,${strength * 0.7})` }} />;
}
