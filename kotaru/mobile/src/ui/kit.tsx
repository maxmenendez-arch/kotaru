import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { color, radius, space, type } from '../theme';

export function Screen({ children }: { children: ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <Text accessibilityRole="header" style={styles.title}>
      {children}
    </Text>
  );
}

export function Body({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <Text style={[styles.body, muted ? styles.muted : null]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button(props: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'quiet' | 'danger';
  disabled?: boolean;
}) {
  const kind = props.kind ?? 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.label}
      accessibilityState={{ disabled: !!props.disabled }}
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.button,
        kind === 'primary' && styles.primary,
        kind === 'quiet' && styles.quiet,
        kind === 'danger' && styles.dangerButton,
        (pressed || props.disabled) && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.buttonText, kind !== 'primary' && { color: kind === 'danger' ? color.danger : color.cloud }]}>
        {props.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.ink, paddingHorizontal: space.xl, paddingTop: space.xxxl },
  title: { ...type.title, color: color.cloud, marginBottom: space.l },
  body: { ...type.body, color: color.cloud },
  muted: { color: color.mist },
  card: {
    backgroundColor: color.inkRaised,
    borderColor: color.inkLine,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: space.l,
    marginBottom: space.m,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: space.l,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: color.iris },
  quiet: { borderWidth: 1, borderColor: color.inkLine },
  dangerButton: { borderWidth: 1, borderColor: color.inkLine },
  buttonText: { ...type.support, fontWeight: '600', color: '#FFFFFF' },
});
