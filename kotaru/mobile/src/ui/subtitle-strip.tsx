import { useRef, useState } from 'react';
import { Platform, ScrollView, Text, type StyleProp, type TextStyle } from 'react-native';
/**
 * Subtitulo de la respuesta del personaje: una sola linea con la respuesta entera. Mientras
 * llega, se queda pegada al final (lo ultimo que dice); deslizando hacia la derecha se vuelve
 * atras por lo que dijo antes, en la misma linea (pedido del dueño, 2026-09-30). Si la persona
 * esta leyendo hacia atras, no se la mueve; al volver al final, sigue la respuesta otra vez.
 */
export function SubtitleStrip({ text, style }: { text: string; style: StyleProp<TextStyle> }) {
  const ref = useRef<ScrollView>(null);
  const pinned = useRef(true);
  const [width, setWidth] = useState(0);
  const [back, setBack] = useState(false);
  const previous = useRef(text);
  // Respuesta nueva (no la continuacion de la anterior): vuelve a seguir el final.
  if (!text.startsWith(previous.current.slice(0, 12))) pinned.current = true;
  previous.current = text;
  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onContentSizeChange={() => {
        if (pinned.current) ref.current?.scrollToEnd({ animated: false });
      }}
      onScroll={(e) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const atEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 8;
        pinned.current = atEnd;
        setBack(contentOffset.x > 4);
      }}
      scrollEventThrottle={32}
      contentContainerStyle={{ minWidth: width, justifyContent: 'center' }}
      style={
        (Platform.OS === 'web' && back
          ? // Borde izquierdo difuminado: hay mas texto hacia atras.
            { maskImage: 'linear-gradient(to right, transparent, black 28px)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 28px)' }
          : null) as object
      }
      accessibilityLabel={text}
    >
      <Text
        accessibilityLiveRegion="polite"
        style={[style, { flexShrink: 0 }, Platform.OS === 'web' ? ({ whiteSpace: 'nowrap' } as object) : null]}
      >
        {text}
      </Text>
    </ScrollView>
  );
}
