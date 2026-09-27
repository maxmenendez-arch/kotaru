import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { Body, Button, Screen } from '../ui/kit';

/**
 * Primera pantalla: aviso de que es una IA y confirmacion de mayoria de edad. Va antes
 * de cualquier conversacion y no se puede saltar (06_SAFETY).
 */
export function Welcome({ lang, onLang, onDone }: { lang: Lang; onLang: (l: Lang) => void; onDone: () => void }) {
  const s = t(lang);
  const [adult, setAdult] = useState(false);
  return (
    <Screen>
      <View style={styles.langRow}>
        {(['es', 'en'] as const).map((l) => (
          <Pressable key={l} accessibilityRole="button" accessibilityState={{ selected: lang === l }} onPress={() => onLang(l)} style={[styles.lang, lang === l && styles.langOn]}>
            <Text style={styles.langText}>{l.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <Text accessibilityRole="header" style={styles.brand}>
        {s.welcomeTitle}
      </Text>
      <Text style={styles.tagline}>{s.tagline}</Text>
      <View style={styles.block}>
        <Body>{s.disclosure}</Body>
      </View>
      <View style={styles.block}>
        <Body muted>{s.memoryPromise}</Body>
      </View>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: adult }}
        onPress={() => setAdult(!adult)}
        style={styles.check}
      >
        <View style={[styles.box, adult && styles.boxOn]}>{adult ? <Text style={styles.tick}>✓</Text> : null}</View>
        <Body>{s.ageConfirm}</Body>
      </Pressable>
      <Button label={s.understood} onPress={onDone} disabled={!adult} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.s },
  lang: { paddingHorizontal: space.m, paddingVertical: space.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: color.inkLine },
  langOn: { borderColor: color.iris },
  langText: { ...type.micro, color: color.cloud },
  brand: { ...type.display, color: color.cloud, marginTop: space.xxxl },
  tagline: { ...type.body, color: color.mist, marginBottom: space.xxl },
  block: { marginBottom: space.l },
  check: { flexDirection: 'row', alignItems: 'center', gap: space.m, marginVertical: space.xl },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: color.mist, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: color.iris, borderColor: color.iris },
  tick: { color: '#FFFFFF', fontWeight: '700' },
});
