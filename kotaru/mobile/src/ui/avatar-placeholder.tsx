import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, View } from 'react-native';
import type { CompanionId } from '../companions';

/** Caras de cada personaje (sacadas de sus modelos 3D). */
export const FACE: Record<CompanionId, number> = {
  luna: require('../../public/avatars/luna-face.png'),
  nova: require('../../public/avatars/nova-face.png'),
  rio: require('../../public/avatars/rio-face.png'),
};

/**
 * Mientras carga el personaje en 3D (2-oct): su cara, suave y desenfocada, que «respira» con un
 * brillo lento, en vez de una letra. Se ve desde el primer instante y el 3D aparece encima.
 */
export function AvatarPlaceholder({ companion, tint, size = 150 }: { companion: CompanionId; tint: string; size?: number }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.9] });
  return (
    <View style={[styles.wrap, { backgroundColor: tint }]}>
      <Animated.View style={{ opacity }}>
        <Image source={FACE[companion]} style={{ width: size, height: size, borderRadius: size / 2 }} blurRadius={3} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
