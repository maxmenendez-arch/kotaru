import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApiError, STATE_LABELS, type ClientEvent, type ConversationClient, type ConversationState } from '@kotaru/client';
import { createAmbient, type AmbientKind } from '../ambient';
import { createAudio } from '../audio';
import { Avatar } from '../avatar';
import type { AffectState } from '../avatar-motion';
import { BreatheOverlay, CalmBar } from '../ui/calm';
import { COMPANIONS, companionById, type Companion, type CompanionId } from '../companions';
import { createConversation, type Connection } from '../connection';
import { installNoSelect, NO_SELECT_ATTR } from '../no-select';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { Body, Button, Card, Screen } from '../ui/kit';

/**
 * Conversacion por voz (pulsar para hablar).
 *
 * El retrato es el modelo 3D del personaje en la web (avatar.web.tsx) y el monograma en
 * las apps nativas o mientras carga.
 * El estado se comunica con un anillo tranquilo MAS una etiqueta de texto que lee el
 * lector de pantalla (09_BRAND): nunca solo con color o movimiento, y nunca con una
 * forma de onda, que se lee como vigilancia.
 */
/**
 * Lo que se ha dicho en esta conversacion, para poder releerlo. Vive solo en memoria de la
 * pantalla: no se guarda en el telefono ni en el navegador (la memoria de Rio es aparte y
 * se ve y se edita en Memoria). Como mucho HISTORY_MAX intercambios.
 */
const HISTORY_MAX = 40;
interface Exchange {
  readonly id: number;
  readonly heard: string;
  readonly reply: string;
}

/** Diametro del retrato (y del avatar 3D), normal y achicado. */
const PORTRAIT = 188;
const PORTRAIT_COMPACT = 88;

const RING: Record<ConversationState, string> = {
  connecting: color.inkLine,
  idle: color.inkLine,
  listening: color.aqua,
  endpoint: color.aqua,
  thinking: color.iris,
  speaking: color.pulse,
  interrupted: color.aqua,
  reconnecting: color.mist,
  limit_reached: color.mist,
  safety_handoff: color.mist,
  closed: color.inkLine,
};

export function Conversation({ lang, connection }: { lang: Lang; connection: Connection | null }) {
  const s = t(lang);
  const [state, setState] = useState<ConversationState>('closed');
  const [heard, setHeard] = useState('');
  const [reply, setReply] = useState('');
  const [minutes, setMinutes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitNote, setLimitNote] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [history, setHistory] = useState<Exchange[]>([]);
  // El servidor dice al conectar si puede oir de verdad; hasta entonces se asume que si.
  const [voiceOn, setVoiceOn] = useState(true);
  const [companionId, setCompanionId] = useState<CompanionId>('luna');
  const companion = companionById(companionId);
  // Por personaje: su conversacion en el servidor (para retomarla) y lo que se vio en pantalla.
  const conversations = useRef<Partial<Record<CompanionId, string>>>({});
  const screens = useRef<Partial<Record<CompanionId, Exchange[]>>>({});
  const nextId = useRef(0);
  const scroll = useRef<ScrollView | null>(null);
  const client = useRef<ConversationClient | null>(null);
  const audio = useRef(createAudio()).current;
  const ambient = useRef(createAmbient()).current;
  const [ambientKind, setAmbientKind] = useState<AmbientKind | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(ambient.volume);
  const [breathing, setBreathing] = useState(false);
  // Emocion de la ultima respuesta, para la cara del avatar.
  const [affect, setAffect] = useState<AffectState | null>(null);
  const mic = useRef(audio.input);
  const speaker = useRef(audio.output);

  useEffect(installNoSelect, []);

  useEffect(
    () => () => {
      client.current?.close();
      audio.input.stop();
      audio.output.dispose();
      ambient.dispose();
    },
    [audio, ambient],
  );

  /** Pasa el intercambio que se ve ahora al historial antes de empezar uno nuevo. */
  const archiveCurrent = () => {
    if (!heard && !reply) return;
    const entry = { id: nextId.current++, heard, reply };
    setHistory((h) => [...h, entry].slice(-HISTORY_MAX));
  };

  const onEvent = (e: ClientEvent) => {
    switch (e.type) {
      case 'state':
        setState(e.state);
        // El ambiente baja mientras habla el personaje, para que se le entienda.
        ambient.duck(e.state === 'speaking');
        if (e.state === 'interrupted') speaker.current.stopNow();
        return;
      case 'user_transcript':
        setHeard(e.text);
        return;
      case 'reply':
        setReply(e.text);
        return;
      case 'affect':
        setAffect({
          emotion: e.emotion,
          intensity: e.intensity,
          ...(e.gesture !== undefined ? { gesture: e.gesture } : {}),
          at: performance.now(),
        });
        return;
      case 'audio':
        speaker.current.play(e.pcm, e.sampleRate);
        return;
      case 'voice':
        setVoiceOn(e.available);
        return;
      case 'usage':
        setMinutes(Math.floor(e.remainingSeconds / 60));
        return;
      case 'rejected':
        setError(s.grantRejected);
        return;
      case 'limit':
        setLimitNote(e.kind === 'spend' ? s.limitSpend : e.kind === 'session' ? s.limitSession : s.limitNote);
        return;
      case 'closed':
        setError(closedMessage(e.reason, s));
        return;
      default:
        return;
    }
  };

  const connect = async (): Promise<boolean> => {
    if (!connection) return false;
    setError(null);
    speaker.current.unlock?.();
    client.current?.close();
    const who = companionId;
    client.current = createConversation(connection, lang, onEvent, {
      companion: who,
      ...(conversations.current[who] ? { conversationId: conversations.current[who] } : {}),
      onConversation: (id) => {
        conversations.current[who] = id;
      },
    });
    setLimitNote(null);
    try {
      await client.current.connect();
      return true;
    } catch (err) {
      setError(connectMessage(err, s));
      return false;
    }
  };

  /**
   * Cambiar de personaje: se cierra la conversacion actual y se muestra la del otro, con
   * lo que ya se habia dicho en pantalla. Al conectar se retoma su conversacion.
   */
  const choose = (next: CompanionId) => {
    if (next === companionId) return;
    const current = [...history, ...(heard || reply ? [{ id: nextId.current++, heard, reply }] : [])].slice(-HISTORY_MAX);
    screens.current[companionId] = current;
    mic.current.stop();
    speaker.current.stopNow();
    client.current?.close();
    client.current = null;
    setState('closed');
    setHeard('');
    setReply('');
    setError(null);
    setLimitNote(null);
    setHistory(screens.current[next] ?? []);
    setAffect(null);
    setCompanionId(next);
  };

  /** Escribirle al personaje. Si la conversacion se cerro (inactividad), se reabre sola. */
  const sendText = async () => {
    const text = draft.trim();
    if (!text || !connection) return;
    if (!client.current || state === 'closed') {
      if (!(await connect())) return;
    }
    speaker.current.stopNow();
    if (client.current?.sendText(text)) {
      archiveCurrent();
      setHeard(text);
      setReply('');
      setDraft('');
      setError(null);
    }
  };

  const pressIn = () => {
    if (!client.current || state === 'closed' || state === 'limit_reached' || !voiceOn) return;
    archiveCurrent();
    setHeard('');
    setReply('');
    // Barge-in: el personaje calla en cuanto se pulsa, sin esperar al servidor.
    speaker.current.stopNow();
    speaker.current.unlock?.();
    client.current.startTalking();
    mic.current.start((pcm) => client.current?.sendAudio(pcm)).then(
      (ok) => {
        if (!ok) {
          setError(s.micDenied);
          client.current?.stopTalking();
        }
      },
      () => setError(s.error),
    );
  };
  const pressOut = () => {
    mic.current.stop();
    client.current?.stopTalking();
  };

  const label = STATE_LABELS[lang][state];
  const listening = state === 'listening';
  // Con conversacion en pantalla, el retrato se achica para dejar sitio al texto.
  const compact = history.length > 0 || state === 'safety_handoff' || breathing;

  return (
    <Screen>
      <CompanionPicker selected={companionId} onChoose={choose} label={s.chooseCompanion} lang={lang} />
      <View style={[styles.portraitArea, compact && styles.portraitAreaCompact]}>
        <View style={[styles.ring, compact && styles.ringCompact, { borderColor: state === 'idle' || state === 'closed' ? companion.accent : RING[state] }]}>
          <View
            style={[styles.portrait, compact && styles.portraitCompact, { backgroundColor: companion.tint }]}
            accessibilityLabel={companion.name}
            accessibilityRole="image"
          >
            <Avatar
              companion={companionId}
              size={compact ? PORTRAIT_COMPACT : PORTRAIT}
              state={state}
              affect={affect}
              level={() => speaker.current.level?.() ?? 0}
              fallback={
                <Text style={[styles.initial, compact && styles.initialCompact, { color: companion.accent }]}>{companion.name[0]}</Text>
              }
            />
          </View>
        </View>
        <Text accessibilityRole="header" style={styles.name}>
          {companion.name}
        </Text>
        {/* Siempre visible (leyes de NY y California: avisar de que es una IA). */}
        <Text style={styles.aiBadge}>{s.aiBadge}</Text>
        <Text accessibilityLiveRegion="polite" accessibilityRole="text" style={styles.state}>
          {label}
        </Text>
        {state === 'closed' && history.length === 0 ? <Text style={styles.tagline}>{companion.tagline[lang]}</Text> : null}
        {minutes !== null && voiceOn ? <Text style={styles.minutes}>{s.minutesLeft(minutes)}</Text> : null}
      </View>

      {state === 'safety_handoff' ? (
        <Card style={styles.safety}>
          <Text accessibilityRole="header" style={styles.safetyTitle}>
            {s.safetyTitle}
          </Text>
          <Body>{s.safetyBody}</Body>
        </Card>
      ) : null}
      {state === 'reconnecting' ? <Body muted>{s.reconnectingNote}</Body> : null}
      {state === 'limit_reached' ? (
        <View style={styles.limit}>
          <Body muted>{limitNote ?? s.limitNote}</Body>
        </View>
      ) : null}

      <ScrollView
        ref={scroll}
        style={styles.captions}
        contentContainerStyle={styles.captionsContent}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {history.map((x) => (
          <ExchangeView key={x.id} heard={x.heard} reply={x.reply} you={s.you} them={companion.name} past />
        ))}
        <ExchangeView heard={heard} reply={reply} you={s.you} them={companion.name} />
      </ScrollView>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {companion.calm ? (
        <CalmBar
          lang={lang}
          soundsAvailable={ambient.available}
          playing={ambientKind}
          volume={ambientVolume}
          onPlay={(kind) => {
            ambient.play(kind);
            setAmbientKind(kind);
          }}
          onStop={() => {
            ambient.stop();
            setAmbientKind(null);
          }}
          onVolume={(v) => {
            ambient.setVolume(v);
            setAmbientVolume(v);
          }}
          onBreathe={() => setBreathing(true)}
        />
      ) : null}

      {connection ? (
        <View style={styles.compose}>
          <TextInput
            accessibilityLabel={s.writePlaceholder(companion.name)}
            placeholder={s.writePlaceholder(companion.name)}
            placeholderTextColor={color.mist}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => void sendText()}
            returnKeyType="send"
            maxLength={1000}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.send}
            accessibilityState={{ disabled: !draft.trim() }}
            disabled={!draft.trim()}
            onPress={() => void sendText()}
            style={[styles.sendButton, !draft.trim() && styles.sendOff]}
          >
            <Text style={styles.sendText}>{s.send}</Text>
          </Pressable>
        </View>
      ) : null}

      {!connection ? (
        <Body muted>{s.notConnected}</Body>
      ) : state === 'closed' ? (
        <Button label={s.connect} onPress={() => void connect()} />
      ) : !voiceOn ? (
        <Text style={styles.note}>{s.voiceNotYet(companion.name)}</Text>
      ) : (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={listening ? s.releaseToSend : s.holdToTalk}
            // Web: sin seleccion de texto ni menu al mantener pulsado (no-select.web.ts).
            // `dataSet` es de react-native-web y no esta en los tipos de React Native.
            {...({ dataSet: { [NO_SELECT_ATTR]: 'true' } } as object)}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={[styles.talk, listening && styles.talkOn]}
          >
            <Text selectable={false} style={[styles.talkText, listening && styles.talkTextOn]}>{listening ? s.releaseToSend : s.holdToTalk}</Text>
          </Pressable>
          {audio.simulated ? <Text style={styles.note}>{s.simulatedMic}</Text> : null}
        </>
      )}
      {breathing ? <BreatheOverlay lang={lang} accent={companion.accent} onClose={() => setBreathing(false)} /> : null}
    </Screen>
  );
}

/**
 * Los tres personajes, arriba. Monograma con su color MAS el nombre escrito: el color nunca
 * es la unica señal (09_BRAND). Se puede cambiar en cualquier momento.
 */
function CompanionPicker({ selected, onChoose, label, lang }: { selected: CompanionId; onChoose: (id: CompanionId) => void; label: string; lang: Lang }) {
  return (
    <View style={styles.picker} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {COMPANIONS.map((c: Companion) => {
        const on = c.id === selected;
        return (
          <Pressable
            key={c.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: on, checked: on }}
            accessibilityLabel={c.name}
            accessibilityHint={c.tagline[lang]}
            onPress={() => onChoose(c.id)}
            style={[styles.chip, on && { borderColor: c.accent, backgroundColor: c.tint }]}
          >
            <View style={[styles.chipDot, { backgroundColor: c.tint, borderColor: c.accent }]}>
              <Text style={[styles.chipInitial, { color: c.accent }]}>{c.name[0]}</Text>
            </View>
            <Text style={[styles.chipName, on && styles.chipNameOn]}>{c.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Un intercambio: lo que dijiste (o escribiste) y lo que contesto el personaje. */
function ExchangeView({ heard, reply, you, them, past }: { heard: string; reply: string; you: string; them: string; past?: boolean }) {
  if (!heard && !reply) return null;
  return (
    <View style={[styles.exchange, past && styles.past]}>
      {heard ? (
        <Text style={styles.heard}>
          <Text style={styles.speaker}>{you}: </Text>
          {heard}
        </Text>
      ) : null}
      {reply ? (
        <Text style={styles.reply}>
          <Text style={styles.speaker}>{them}: </Text>
          {reply}
        </Text>
      ) : null}
    </View>
  );
}

/** Por que se cerro, en palabras de la persona; null si no hace falta decir nada. */
function closedMessage(reason: string, s: ReturnType<typeof t>): string | null {
  switch (reason) {
    case 'client_bye':
      return null;
    case 'idle_timeout':
      return s.closedIdle;
    case 'session_max_duration':
      return s.limitSession;
    case 'spend_cap':
      return s.limitSpend;
    case 'plan_limit':
      return s.limitNote;
    case 'server_error':
    case 'server_shutdown':
      return s.closedServer;
    default:
      return s.closedGone;
  }
}

/** Fallo al conectar: sesion caducada, sin red, o grant rechazado. */
function connectMessage(err: unknown, s: ReturnType<typeof t>): string {
  if (err instanceof ApiError && err.status === 401) return s.sessionExpired;
  if (err instanceof ApiError && err.status === 429) return s.tooManyAttempts;
  if (err instanceof TypeError) return s.offline;
  return s.grantRejected;
}

const styles = StyleSheet.create({
  picker: { flexDirection: 'row', justifyContent: 'center', gap: space.s, marginBottom: space.l },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s,
    paddingVertical: space.xs,
    paddingLeft: space.xs,
    paddingRight: space.m,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.inkLine,
  },
  chipDot: { width: 28, height: 28, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chipInitial: { ...type.support, fontWeight: '600' },
  chipName: { ...type.support, color: color.mist },
  chipNameOn: { color: color.cloud, fontWeight: '600' },
  name: { ...type.title, color: color.cloud, marginTop: space.m },
  aiBadge: { ...type.micro, color: color.mist, marginTop: 2, letterSpacing: 0.5 },
  tagline: { ...type.support, color: color.mist, marginTop: space.xs, textAlign: 'center' },
  portraitArea: { alignItems: 'center', marginBottom: space.xl },
  ring: { width: PORTRAIT + 24, height: PORTRAIT + 24, borderRadius: radius.pill, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  portrait: { width: PORTRAIT, height: PORTRAIT, borderRadius: radius.pill, backgroundColor: color.inkRaised, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initial: { ...type.display, color: color.mist },
  portraitAreaCompact: { marginBottom: space.l },
  ringCompact: { width: PORTRAIT_COMPACT + 16, height: PORTRAIT_COMPACT + 16 },
  portraitCompact: { width: PORTRAIT_COMPACT, height: PORTRAIT_COMPACT },
  initialCompact: { ...type.title },
  state: { ...type.support, color: color.mist, marginTop: space.xs },
  minutes: { ...type.micro, color: color.mist, marginTop: space.xs },
  captions: { flex: 1, marginBottom: space.m },
  captionsContent: { gap: space.l, flexGrow: 1, justifyContent: 'flex-end' },
  exchange: { gap: space.s },
  // Lo anterior, separado por una linea fina (sin bajar el contraste del texto).
  past: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.inkLine, paddingBottom: space.l },
  heard: { ...type.body, color: color.mist },
  reply: { ...type.body, color: color.cloud },
  speaker: { fontWeight: '600' },
  talk: { height: 64, borderRadius: radius.pill, backgroundColor: color.iris, alignItems: 'center', justifyContent: 'center', marginBottom: space.s },
  talkOn: { backgroundColor: color.aqua },
  talkText: { ...type.body, fontWeight: '600', color: '#FFFFFF' },
  // Sobre aqua el blanco no contrasta; ink si (10:1).
  talkTextOn: { color: color.ink },
  limit: { marginBottom: space.m },
  note: { ...type.micro, color: color.mist, textAlign: 'center', marginBottom: space.l },
  compose: { flexDirection: 'row', gap: space.s, marginBottom: space.m },
  input: {
    ...type.body,
    flex: 1,
    color: color.cloud,
    borderWidth: 1,
    borderColor: color.inkLine,
    borderRadius: radius.pill,
    paddingHorizontal: space.l,
    paddingVertical: space.m,
  },
  sendButton: { borderRadius: radius.pill, backgroundColor: color.inkRaised, borderWidth: 1, borderColor: color.iris, paddingHorizontal: space.l, justifyContent: 'center' },
  sendOff: { borderColor: color.inkLine },
  sendText: { ...type.support, color: color.cloud, fontWeight: '600' },
  safety: { borderColor: color.mist },
  safetyTitle: { ...type.title, color: color.cloud, marginBottom: space.s },
  error: { ...type.support, color: color.danger, marginBottom: space.s },
});
