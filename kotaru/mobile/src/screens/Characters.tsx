import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { createSoundscape } from '../ambient';
import { Avatar } from '../avatar';
import { createIntroVoice } from '../intro-voice';
import { keepMusicAudio } from '../call-audio';
import { PROFILES } from '../character-profiles';
import { REELS } from '../reel';
import { COMPANIONS, companionById, type CompanionId } from '../companions';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { readFlag, writeFlag } from '../prefs';
import { MUSIC_BUILDERS, MUSIC_OF, SCENE_BUILDERS, SCENE_OF } from '../scene-sounds';
import { Icon } from '../ui/icons';
import { Scrim } from '../ui/scrim';

/**
 * Elegir personaje, como un perfil: el personaje a pantalla completa en un "short" que se
 * dibuja en vivo en 3D (reel.ts: planos de cerca y de lejos, habla, gestos, saludo) en su
 * lugar, con sus intereses, su nombre y dos lineas de caracter. Al deslizar hacia arriba,
 * su perfil (preguntas, lo que le gusta y lo que no, su frase y lo esencial: que es una
 * IA y lo que ofrece). Abajo, las caras para cambiar de personaje.
 *
 * Solo hay un short a la vez (un modelo 3D). Sin 3D (movil nativo o navegador sin WebGL)
 * se ve el monograma de color. Con "reducir movimiento", un plano fijo sin cortes.
 */

/** Colores de las etiquetas (marca): texto oscuro sobre todos, contraste AA. */
const CHIP_COLORS = ['#9FB4FF', '#FF5FA2', '#37D6C8', '#F2A65A', '#C7B8FF', '#B8E986'] as const;
const FACE: Record<CompanionId, number> = {
  luna: require('../../public/avatars/luna-face.png'),
  nova: require('../../public/avatars/nova-face.png'),
  rio: require('../../public/avatars/rio-face.png'),
};
const STRIP_HEIGHT = 92;
const CONNECT_MS = 1100;
const SOUND_KEY = 'kotaru.reelSound';

export function Characters({
  lang,
  current,
  onChoose,
  onBack,
}: {
  lang: Lang;
  current?: CompanionId;
  onChoose: (id: CompanionId) => void;
  /** Volver a la conversacion sin cambiar (solo si ya habia uno elegido). */
  onBack?: () => void;
}) {
  const s = t(lang);
  const [selected, setSelected] = useState<CompanionId>(current ?? 'luna');
  const [heroHeight, setHeroHeight] = useState(0);
  const [scrolled, setScrolled] = useState(0);
  const [connecting, setConnecting] = useState<CompanionId | null>(null);
  const scroll = useRef<ScrollView>(null);
  // Sonido del short: musica propia de cada personaje y, debajo, el sonido de su lugar.
  // Mas alta que antes (0,65) y sin apagarse del todo mientras saluda (0,4): en el telefono
  // apenas se oia.
  const music = useRef(createSoundscape(MUSIC_BUILDERS, 0.9, 0.4)).current;
  const place = useRef(createSoundscape(SCENE_BUILDERS, 0.18)).current;
  // Saludo con risa en su voz, una vez por personaje mostrado, en el primer plano en que habla.
  const intro = useRef(createIntroVoice()).current;
  const greeted = useRef<CompanionId | null>(null);
  const onReelShot = (index: number) => {
    const firstTalk = REELS[selected].findIndex((shot) => shot.talk);
    if (index !== firstTalk || greeted.current === selected || !soundOn || connecting) return;
    greeted.current = selected;
    intro.play(selected, lang);
  };
  // La musica baja mientras saluda.
  useEffect(() => {
    const timer = setInterval(() => {
      const talking = intro.playing();
      music.duck(talking);
      place.duck(talking);
    }, 100);
    return () => clearInterval(timer);
  }, [intro, music, place]);
  const [soundOn, setSoundOnState] = useState(() => readFlag(SOUND_KEY, true));
  const playSound = (id: CompanionId, on = soundOn) => {
    if (!on || connecting) return;
    keepMusicAudio(true);
    music.play(MUSIC_OF[id]);
    place.play(SCENE_OF[id]);
  };
  const setSoundOn = (on: boolean) => {
    setSoundOnState(on);
    writeFlag(SOUND_KEY, on);
    if (on) playSound(selected, true);
    else {
      intro.stop();
      music.stop();
      place.stop();
    }
  };
  // Intenta sonar al entrar y al cambiar de personaje (si el navegador aun no deja, sonara
  // con el primer toque: ver onStartShouldSetResponderCapture).
  useEffect(() => {
    playSound(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  useEffect(
    () => () => {
      music.dispose();
      place.dispose();
      intro.dispose();
      keepMusicAudio(false);
    },
    [music, place],
  );
  const { width, height } = useWindowDimensions();
  const companion = companionById(selected);
  const profile = PROFILES[selected];
  const wide = width > 700;
  // En pantallas anchas el short queda de pie en el centro (como un telefono), con el
  // color del personaje alrededor: un plano vertical no se estira a 16:9.
  const stageWidth = wide ? Math.min(width, Math.round(height * 0.62)) : width;
  const columnWidth = Math.min(stageWidth, 520);
  const stageLeft = (width - stageWidth) / 2;

  const choose = (id: CompanionId) => {
    if (connecting) return;
    setConnecting(id);
    // La musica se va; el lugar lo retoma la conversacion.
    intro.stop();
    music.stop();
    place.stop();
    setTimeout(() => onChoose(id), CONNECT_MS);
  };
  const switchTo = (id: CompanionId) => {
    intro.stop();
    greeted.current = null;
    setSelected(id);
    scroll.current?.scrollTo({ y: 0, animated: false });
    setScrolled(0);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setScrolled(e.nativeEvent.contentOffset.y);

  // Teclado (web): flechas para cambiar de personaje.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      const i = COMPANIONS.findIndex((c) => c.id === selected);
      if (e.key === 'ArrowRight') switchTo(COMPANIONS[(i + 1) % COMPANIONS.length]!.id);
      else if (e.key === 'ArrowLeft') switchTo(COMPANIONS[(i + COMPANIONS.length - 1) % COMPANIONS.length]!.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const profileOpen = heroHeight > 0 && scrolled > heroHeight * 0.35;
  const veil = Math.min(0.72, scrolled / Math.max(1, height * 0.7));
  const topSpace = Math.max(0, height - STRIP_HEIGHT - heroHeight);
  // La pista de «desliza» se va en cuanto se empieza a deslizar (ya cumplio su funcion).
  const hintOpacity = Math.max(0, 1 - scrolled / Math.max(1, heroHeight * 0.2));

  return (
    <View
      style={[styles.screen, wide && { backgroundColor: companion.tint }]}
      onStartShouldSetResponderCapture={() => {
        playSound(selected);
        return false;
      }}
    >
      {/* El short, de fondo. */}
      <View
        style={[styles.stage, { width: stageWidth, left: stageLeft }]}
        accessibilityRole="image"
        accessibilityLabel={`${companion.name}. ${profile.hook[lang].join(' ')}`}
      >
        <Avatar
          key={selected}
          companion={selected}
          size={height}
          {...(Platform.OS === 'web' ? { width: stageWidth, background: true, immersive: true, reel: true, onReelShot, reelLevel: intro.level, reelVisemes: intro.visemes } : {})}
          state="idle"
          affect={null}
          level={() => 0}
          fallback={
            <View style={[styles.fallback, { backgroundColor: companion.tint }]}>
              <Text style={[styles.initial, { color: companion.accent }]}>{companion.name[0]}</Text>
            </View>
          }
        />
        <Scrim from={0.38} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(8,10,20,${veil})` }]} />
      </View>

      {/* Encima: el nombre y, al deslizar, el perfil. */}
      <ScrollView
        ref={scroll}
        style={[styles.scroller, { bottom: STRIP_HEIGHT }]}
        contentContainerStyle={[styles.scrollContent, { width: columnWidth }]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: topSpace }} />
        <View onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)} style={styles.hero}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={soundOn ? s.reelSoundOn : s.reelSoundOff}
            onPress={() => setSoundOn(!soundOn)}
            style={styles.soundButton}
          >
            <Icon name={soundOn ? 'speaker' : 'speakerOff'} size={18} color={color.cloud} />
          </Pressable>
          <View style={styles.tags}>
            {profile.tags[lang].map((tag, i) => (
              <View key={tag} style={[styles.tag, { backgroundColor: CHIP_COLORS[(i + COMPANIONS.indexOf(companion)) % CHIP_COLORS.length] }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.nameRow}>
            <Text accessibilityRole="header" style={styles.name} numberOfLines={1}>
              {companion.name}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={s.pickLong(companion.name)}
              onPress={() => choose(selected)}
              style={({ pressed }) => [styles.pick, pressed && styles.pressed]}
            >
              <Text style={styles.pickText}>{s.pick}</Text>
              <Text style={styles.pickArrow}>→</Text>
            </Pressable>
          </View>
          {profile.hook[lang].map((line) => (
            <Text key={line} style={styles.hook}>
              {line}
            </Text>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.profileHint}
            onPress={() => scroll.current?.scrollTo({ y: heroHeight * 0.9, animated: true })}
            style={[styles.hint, { opacity: hintOpacity }]}
          >
            <Text style={styles.hintText}>⌃ {s.profileHint}</Text>
          </Pressable>
        </View>

        <View style={styles.profile}>
          {profile.questions[lang].map((item, i) =>
            i === 1 ? (
              <View key={item.q} style={[styles.card, { borderColor: companion.accent }]}>
                <Text style={[styles.cardLabel, { color: companion.accent }]}>{item.q}</Text>
                <Text style={styles.cardText}>{item.a}</Text>
              </View>
            ) : (
              <View key={item.q} style={styles.qa}>
                <Text style={styles.q}>{item.q}</Text>
                <Text style={styles.a}>{item.a}</Text>
              </View>
            ),
          )}
          <View style={styles.lists}>
            <View style={styles.list}>
              <Text style={styles.q}>{s.likes}</Text>
              {profile.likes[lang].map((x) => (
                <Text key={x} style={styles.listItem}>
                  <Text style={{ color: color.aqua }}>✓ </Text>
                  {x}
                </Text>
              ))}
            </View>
            <View style={styles.list}>
              <Text style={styles.q}>{s.dislikes}</Text>
              {profile.dislikes[lang].map((x) => (
                <Text key={x} style={styles.listItem}>
                  <Text style={{ color: color.danger }}>– </Text>
                  {x}
                </Text>
              ))}
            </View>
          </View>
          <View style={[styles.card, styles.quote]}>
            <Text style={[styles.cardLabel, { color: companion.accent }]}>{s.quoteLabel}</Text>
            <Text style={styles.quoteText}>“{profile.quote[lang]}”</Text>
          </View>
          <Text style={[styles.q, styles.essentials]}>{s.essentials}</Text>
          {profile.attributes[lang].map((a) => (
            <View key={a.label} style={styles.qa}>
              <Text style={styles.attrLabel}>{a.label}</Text>
              <Text style={styles.a}>{a.value}</Text>
            </View>
          ))}
          <View style={{ height: space.xxxl + space.xl }} />
        </View>
      </ScrollView>

      {/* Con el perfil abierto, franjas de fondo arriba (bajo el nombre) y abajo (bajo «Elegir»):
          el texto que pasa por detras ya no se mezcla con ellos. */}
      <View
        pointerEvents="none"
        style={[styles.topBand, { left: stageLeft, width: stageWidth, opacity: profileOpen ? 1 : 0 }]}
      />
      {profileOpen ? <View pointerEvents="none" style={[styles.ctaBand, { left: stageLeft, width: stageWidth, bottom: STRIP_HEIGHT }]} /> : null}

      {/* Arriba: volver y la marca de IA (siempre visible). */}
      <View style={[styles.top, { left: stageLeft + space.l, right: stageLeft + space.l }]} pointerEvents="box-none">
        {onBack ? (
          <Pressable accessibilityRole="button" accessibilityLabel={s.backToTalk} onPress={onBack} style={styles.round}>
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.roundSpacer} />
        )}
        <Text style={[styles.topName, !profileOpen && styles.hidden]}>{companion.name}</Text>
        <View style={styles.aiPill}>
          <Text style={styles.aiText}>
            {s.aiBadge}
            {companion.flirts ? ` · ${s.adultsOnly}` : ''}
          </Text>
        </View>
      </View>

      {/* Abajo, fijo: elegir (con el perfil abierto) y las caras. */}
      {profileOpen ? (
        <View style={[styles.cta, { bottom: STRIP_HEIGHT + space.s, width: columnWidth - 2 * space.l }]}>
          <Pressable accessibilityRole="button" onPress={() => choose(selected)} style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}>
            <Text style={styles.pickText}>{s.pickLong(companion.name)}</Text>
            <Text style={styles.pickArrow}>→</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={[styles.strip, { left: stageLeft, right: stageLeft }]} accessibilityRole="radiogroup" accessibilityLabel={s.chooseCompanion}>
        {COMPANIONS.map((c) => {
          const on = c.id === selected;
          return (
            <Pressable
              key={c.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on, checked: on }}
              accessibilityLabel={c.name}
              onPress={() => switchTo(c.id)}
              style={styles.face}
            >
              <View style={[styles.faceRing, { borderColor: on ? c.accent : 'transparent' }]}>
                <Image source={FACE[c.id]} style={[styles.faceImage, { backgroundColor: c.tint }]} accessibilityIgnoresInvertColors />
              </View>
              <Text style={[styles.faceName, on && styles.faceNameOn]}>{c.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {connecting ? <Connecting id={connecting} label={s.connectingTo(companionById(connecting).name)} /> : null}
    </View>
  );
}

/** Transicion al elegir: su cara con un anillo que gira mientras se abre la conversacion. */
function Connecting({ id, label }: { id: CompanionId; label: string }) {
  const c = companionById(id);
  const spin = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const native = Platform.OS !== 'web';
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: native }).start();
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: native }));
    loop.start();
    return () => loop.stop();
  }, [fade, spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={[styles.connecting, { opacity: fade }]} accessibilityLiveRegion="polite" accessibilityLabel={label}>
      <View style={styles.connectFace}>
        <Animated.View style={[styles.connectRing, { borderTopColor: c.accent, transform: [{ rotate }] }]} />
        <Image source={FACE[id]} style={[styles.connectImage, { backgroundColor: c.tint }]} accessibilityIgnoresInvertColors />
      </View>
      <Text style={styles.connectText}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#05070F', overflow: 'hidden' },
  stage: { position: 'absolute', top: 0, bottom: 0, overflow: 'hidden' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 120, fontWeight: '700' },
  scroller: { position: 'absolute', top: 0, left: 0, right: 0 },
  scrollContent: { alignSelf: 'center' },
  hero: { paddingHorizontal: space.l, paddingBottom: space.s, gap: space.s },
  soundButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(11,16,32,0.55)', marginBottom: space.xs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: space.xs },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 12, lineHeight: 16, fontWeight: '800', color: '#0B1020', letterSpacing: 0.6, textTransform: 'uppercase' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  name: { flex: 1, fontSize: 46, lineHeight: 52, fontWeight: '800', color: color.cloud, letterSpacing: -0.5 },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: color.cloud, paddingHorizontal: space.l, paddingVertical: 10, borderRadius: radius.pill, minHeight: 44 },
  pickText: { fontSize: 16, fontWeight: '700', color: color.ink },
  pickArrow: { fontSize: 18, fontWeight: '700', color: color.ink },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  hook: { ...type.body, color: color.cloud, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 },
  hint: { alignSelf: 'flex-start', paddingVertical: space.s, minHeight: 44, justifyContent: 'center' },
  hintText: { ...type.micro, color: color.mist },
  profile: { paddingHorizontal: space.l, gap: space.l, paddingTop: space.s },
  qa: { gap: 4 },
  q: { ...type.support, color: color.mist },
  a: { ...type.body, color: color.cloud },
  card: { borderRadius: radius.card, padding: space.l, backgroundColor: 'rgba(21,27,49,0.85)', borderLeftWidth: 3, gap: space.s },
  cardLabel: { ...type.micro, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  cardText: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: color.cloud },
  lists: { flexDirection: 'row', gap: space.l },
  list: { flex: 1, gap: 6 },
  listItem: { ...type.support, color: color.cloud },
  quote: { borderLeftWidth: 0, borderWidth: 1, borderColor: color.inkLine },
  quoteText: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: color.cloud, fontStyle: 'italic' },
  essentials: { marginTop: space.s, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '700' },
  attrLabel: { ...type.micro, color: color.mist, textTransform: 'uppercase', letterSpacing: 0.8 },
  top: { position: 'absolute', top: space.m, left: space.l, right: space.l, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(11,16,32,0.55)', alignItems: 'center', justifyContent: 'center' },
  roundSpacer: { width: 44, height: 44 },
  backGlyph: { fontSize: 30, lineHeight: 32, color: color.cloud, marginTop: -3 },
  topName: { ...type.body, fontWeight: '700', color: color.cloud },
  hidden: { opacity: 0 },
  aiPill: { paddingHorizontal: space.m, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: 'rgba(11,16,32,0.55)' },
  aiText: { ...type.micro, color: color.cloud, letterSpacing: 0.3 },
  cta: { position: 'absolute', alignSelf: 'center' },
  topBand: { position: 'absolute', top: 0, height: space.m * 2 + 44, backgroundColor: 'rgba(8,10,20,0.94)', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  ctaBand: { position: 'absolute', height: 50 + space.s * 2, backgroundColor: 'rgba(8,10,20,0.9)' },
  ctaButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: color.cloud, borderRadius: radius.pill, minHeight: 50 },
  strip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: STRIP_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space.xl,
    backgroundColor: 'rgba(5,7,15,0.92)',
  },
  face: { alignItems: 'center', gap: 4, minWidth: 56 },
  faceRing: { borderWidth: 2.5, borderRadius: 32, padding: 2 },
  faceImage: { width: 54, height: 54, borderRadius: 27 },
  faceName: { ...type.micro, color: color.mist },
  faceNameOn: { color: color.cloud, fontWeight: '700' },
  connecting: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#05070F', alignItems: 'center', justifyContent: 'center', gap: space.xl },
  connectFace: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  connectRing: { position: 'absolute', width: 132, height: 132, borderRadius: 66, borderWidth: 3, borderColor: 'rgba(255,255,255,0.08)' },
  connectImage: { width: 116, height: 116, borderRadius: 58 },
  connectText: { ...type.body, color: color.cloud },
});
