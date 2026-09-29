import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { AMBIENT_KINDS, type AmbientKind } from '../ambient-types';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';

/**
 * Herramientas de calma de Luna: sonidos relajantes y respiracion guiada.
 *
 * No son tratamiento: son tecnicas de autocuidado conocidas (respiracion lenta), y la app
 * no promete ningun efecto clinico (06_SAFETY). El texto de cada fase se ve siempre; la
 * animacion es un apoyo y se apaga con "reducir movimiento".
 */

export function CalmBar({
  lang,
  soundsAvailable,
  playing,
  volume,
  onPlay,
  onStop,
  onVolume,
  onBreathe,
  soundsOnly,
  startOpen,
}: {
  /** Solo la lista de sonidos, sin "Respira conmigo" (pantalla inmersiva: tiene su icono). */
  soundsOnly?: boolean;
  /** La lista de sonidos ya abierta. */
  startOpen?: boolean;
  lang: Lang;
  soundsAvailable: boolean;
  playing: AmbientKind | null;
  volume: number;
  onPlay: (kind: AmbientKind) => void;
  onStop: () => void;
  onVolume: (volume: number) => void;
  onBreathe: () => void;
}) {
  const s = t(lang);
  const [open, setOpen] = useState(startOpen === true);
  return (
    <View style={styles.bar}>
      <View style={[styles.row, soundsOnly && { display: 'none' }]}>
        <Pill label={s.breatheWithMe} onPress={onBreathe} />
        {soundsAvailable ? (
          <Pill
            label={playing ? `${s.sounds}: ${s.ambient[playing]}` : s.sounds}
            on={open || playing !== null}
            onPress={() => setOpen((o) => !o)}
            expanded={open}
          />
        ) : null}
      </View>
      {open && soundsAvailable ? (
        <View style={styles.sounds} accessibilityLabel={s.sounds}>
          <View style={styles.row}>
            {AMBIENT_KINDS.map((kind) => (
              <Pill
                key={kind}
                small
                label={s.ambient[kind]}
                on={playing === kind}
                onPress={() => (playing === kind ? onStop() : onPlay(kind))}
              />
            ))}
          </View>
          <View style={styles.row}>
            <Pill small label={s.volumeDown} onPress={() => onVolume(Math.max(0, volume - 0.15))} />
            <Text style={styles.volume} accessibilityLiveRegion="polite">
              {s.volumeLabel(Math.round(volume * 100))}
            </Text>
            <Pill small label={s.volumeUp} onPress={() => onVolume(Math.min(1, volume + 0.15))} />
            {playing ? <Pill small label={s.soundsOff} onPress={onStop} /> : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Pill({
  label,
  onPress,
  on,
  small,
  expanded,
}: {
  label: string;
  onPress: () => void;
  on?: boolean;
  small?: boolean;
  expanded?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on === true, ...(expanded !== undefined ? { expanded } : {}) }}
      onPress={onPress}
      style={[styles.pill, small && styles.pillSmall, on && styles.pillOn]}
    >
      <Text style={[styles.pillText, small && styles.pillTextSmall, on && styles.pillTextOn]}>{label}</Text>
    </Pressable>
  );
}

/** Inhalar 4 s, sostener 4 s, exhalar 6 s: la que Luna guia de palabra. */
const PHASES = [
  { key: 'inhale', seconds: 4, to: 1 },
  { key: 'hold', seconds: 4, to: 1 },
  { key: 'exhale', seconds: 6, to: 0.55 },
] as const;

export function BreatheOverlay({ lang, accent, onClose }: { lang: Lang; accent: string; onClose: () => void }) {
  const s = t(lang);
  const scale = useRef(new Animated.Value(0.55)).current;
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState<number>(PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion, () => undefined);
  }, []);

  // Cada fase: animar el circulo y contar hacia atras de segundo en segundo.
  useEffect(() => {
    const current = PHASES[phase]!;
    setLeft(current.seconds);
    if (!reduceMotion) {
      Animated.timing(scale, {
        toValue: current.to,
        duration: current.seconds * 1000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      }).start();
    }
    const tick = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    const next = setTimeout(() => {
      if (phase === PHASES.length - 1) setCycles((c) => c + 1);
      setPhase((p) => (p + 1) % PHASES.length);
    }, current.seconds * 1000);
    return () => {
      clearInterval(tick);
      clearTimeout(next);
    };
  }, [phase, reduceMotion, scale]);

  const label = s.breathePhase[PHASES[phase]!.key];
  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <Text style={styles.overlayTitle} accessibilityRole="header">
        {s.breatheWithMe}
      </Text>
      <View style={styles.circleArea}>
        <Animated.View
          style={[
            styles.circle,
            { borderColor: accent, backgroundColor: `${accent}22`, transform: [{ scale: reduceMotion ? 0.8 : scale }] },
          ]}
        />
        <View style={styles.circleText} pointerEvents="none">
          <Text style={styles.phase} accessibilityLiveRegion="polite">
            {label}
          </Text>
          <Text style={styles.count}>{left}</Text>
        </View>
      </View>
      <Text style={styles.hint}>{cycles >= 3 ? s.breatheWell : s.breatheHint}</Text>
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
        <Text style={styles.closeText}>{s.breatheDone}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { marginBottom: space.s, gap: space.s },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s, alignItems: 'center', justifyContent: 'center' },
  sounds: { gap: space.s },
  pill: {
    paddingVertical: space.s,
    paddingHorizontal: space.l,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.inkLine,
    backgroundColor: color.inkRaised,
  },
  pillSmall: { paddingVertical: space.xs, paddingHorizontal: space.m },
  pillOn: { borderColor: '#9FB4FF', backgroundColor: '#1B2447' },
  pillText: { ...type.support, color: color.cloud },
  pillTextSmall: { ...type.micro },
  pillTextOn: { fontWeight: '600' },
  volume: { ...type.micro, color: color.mist, minWidth: 72, textAlign: 'center' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
    gap: space.xl,
  },
  overlayTitle: { ...type.title, color: color.cloud },
  circleArea: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 260, height: 260, borderRadius: radius.pill, borderWidth: 2 },
  circleText: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  phase: { ...type.title, color: color.cloud },
  count: { ...type.display, color: color.cloud, marginTop: space.s },
  hint: { ...type.support, color: color.mist, textAlign: 'center', maxWidth: 320 },
  close: { paddingVertical: space.m, paddingHorizontal: space.xl, borderRadius: radius.pill, backgroundColor: color.iris },
  closeText: { ...type.body, color: '#FFFFFF', fontWeight: '600' },
});
