import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Avatar } from '../avatar';
import type { AffectState } from '../avatar-motion';
import { PROFILES } from '../character-profiles';
import { COMPANIONS, companionById, type CompanionId } from '../companions';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { Button } from '../ui/kit';

/**
 * Elegir personaje: una vista animada en 3D de cada uno en su lugar (saluda, mueve la
 * boca, cambia de cara y respira; el mismo visor de la conversacion), con sus cualidades y
 * lo que ofrece. Se ve la primera vez y desde el nombre del personaje en la conversacion.
 *
 * La vista animada no es un video grabado: se dibuja en el momento (pesa menos que un
 * video, se ve nitida y siempre coincide con el personaje real). Solo hay una a la vez.
 * Sin 3D (movil nativo o navegador sin WebGL) se ve el monograma.
 */
export function Characters({ lang, current, onChoose }: { lang: Lang; current?: CompanionId; onChoose: (id: CompanionId) => void }) {
  const s = t(lang);
  const [selected, setSelected] = useState<CompanionId>(current ?? 'luna');
  const companion = companionById(selected);
  const profile = PROFILES[selected];
  const { width, height } = useWindowDimensions();
  const previewWidth = Math.round(Math.min(width - 2 * space.l, 560));
  const previewHeight = Math.round(Math.min(previewWidth * 0.75, height * 0.45));

  // La "pelicula" de presentacion: saluda (boca con volumen simulado y cara alegre), calla,
  // y vuelve a empezar. Cambia al elegir otro personaje.
  const [talking, setTalking] = useState(true);
  const [affect, setAffect] = useState<AffectState | null>(null);
  const started = useRef(performance.now());
  useEffect(() => {
    started.current = performance.now();
    setTalking(true);
    setAffect({ emotion: 'happy', intensity: 0.7, at: performance.now() } as AffectState);
    const timer = setInterval(() => {
      const t = (performance.now() - started.current) / 1000;
      const phase = t % 9;
      setTalking(phase < 4);
      if (Math.abs(phase - 6) < 0.3) setAffect({ emotion: selected === 'luna' ? 'relaxed' : 'happy', intensity: 0.6, at: performance.now() } as AffectState);
    }, 250);
    return () => clearInterval(timer);
  }, [selected]);
  const level = () => {
    if (!talking) return 0;
    const t = performance.now() / 1000;
    return 0.35 + 0.35 * Math.abs(Math.sin(t * 12.5)) + 0.15 * Math.sin(t * 5.3);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text accessibilityRole="header" style={styles.title}>
        {s.chooseTitle}
      </Text>
      <Text style={styles.intro}>{s.chooseIntro}</Text>

      <View style={styles.tabs} accessibilityRole="radiogroup" accessibilityLabel={s.chooseCompanion}>
        {COMPANIONS.map((c) => {
          const on = c.id === selected;
          return (
            <Pressable
              key={c.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on, checked: on }}
              accessibilityLabel={c.name}
              onPress={() => setSelected(c.id)}
              style={[styles.tab, on && { borderColor: c.accent, backgroundColor: c.tint }]}
            >
              <Text style={[styles.tabText, on && styles.tabTextOn]}>{c.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={[styles.preview, { width: previewWidth, height: previewHeight, borderColor: companion.accent, backgroundColor: companion.tint }]}
        accessibilityRole="image"
        accessibilityLabel={`${companion.name}: ${profile.greeting[lang]}`}
      >
        <Avatar
          key={selected}
          companion={selected}
          size={previewHeight}
          {...(Platform.OS === 'web' ? { width: previewWidth, background: true } : {})}
          state={talking ? 'speaking' : 'idle'}
          affect={affect}
          level={level}
          fallback={<Text style={[styles.initial, { color: companion.accent }]}>{companion.name[0]}</Text>}
        />
        <View style={styles.caption} pointerEvents="none">
          <Text numberOfLines={2} style={styles.captionText}>
            {profile.greeting[lang]}
          </Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={[styles.name, { color: companion.accent }]}>{companion.name}</Text>
        <Text style={styles.ai}>{s.aiBadge}</Text>
      </View>
      <Text style={styles.tagline}>{companion.tagline[lang]}</Text>

      <View style={styles.qualities}>
        {profile.qualities[lang].map((q) => (
          <View key={q} style={[styles.quality, { borderColor: companion.accent }]}>
            <Text style={styles.qualityText}>{q}</Text>
          </View>
        ))}
      </View>

      <View style={styles.attributes}>
        {profile.attributes[lang].map((a) => (
          <View key={a.label} style={styles.attribute}>
            <Text style={styles.attributeLabel}>{a.label}</Text>
            <Text style={styles.attributeValue}>{a.value}</Text>
          </View>
        ))}
      </View>

      <Button label={s.chooseButton(companion.name)} onPress={() => onChoose(selected)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.ink },
  content: { paddingHorizontal: space.l, paddingTop: space.xl, paddingBottom: space.xxxl, gap: space.m, alignItems: 'stretch', maxWidth: 600, width: '100%', alignSelf: 'center' },
  title: { ...type.title, color: color.cloud },
  intro: { ...type.support, color: color.mist },
  tabs: { flexDirection: 'row', gap: space.s },
  tab: { flex: 1, alignItems: 'center', paddingVertical: space.s, borderRadius: radius.pill, borderWidth: 1, borderColor: color.inkLine },
  tabText: { ...type.body, color: color.mist },
  tabTextOn: { color: color.cloud, fontWeight: '600' },
  preview: { alignSelf: 'center', borderRadius: radius.sheet, borderWidth: 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  initial: { ...type.display },
  caption: { position: 'absolute', left: space.m, right: space.m, bottom: space.m, padding: space.s, borderRadius: radius.control, backgroundColor: 'rgba(11,16,32,0.7)' },
  captionText: { ...type.support, color: color.cloud, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'baseline', gap: space.s },
  name: { ...type.display },
  ai: { ...type.micro, color: color.mist, letterSpacing: 0.5 },
  tagline: { ...type.body, color: color.cloud },
  qualities: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  quality: { paddingVertical: 4, paddingHorizontal: space.m, borderRadius: radius.pill, borderWidth: 1 },
  qualityText: { ...type.support, color: color.cloud },
  attributes: { gap: space.m, marginBottom: space.s },
  attribute: { gap: 2 },
  attributeLabel: { ...type.micro, color: color.mist, textTransform: 'uppercase', letterSpacing: 0.8 },
  attributeValue: { ...type.body, color: color.cloud },
});
