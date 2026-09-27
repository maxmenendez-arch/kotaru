import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApiError, STATE_LABELS, type ClientEvent, type ConversationClient, type ConversationState } from '@kotaru/client';
import { createAudio } from '../audio';
import { createConversation, type Connection } from '../connection';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { Body, Button, Card, Screen } from '../ui/kit';

/**
 * Conversacion por voz (pulsar para hablar).
 *
 * El retrato es un marcador abstracto hasta que exista el arte original del personaje.
 * El estado se comunica con un anillo tranquilo MAS una etiqueta de texto que lee el
 * lector de pantalla (09_BRAND): nunca solo con color o movimiento, y nunca con una
 * forma de onda, que se lee como vigilancia.
 */
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
  const client = useRef<ConversationClient | null>(null);
  const audio = useRef(createAudio()).current;
  const mic = useRef(audio.input);
  const speaker = useRef(audio.output);

  useEffect(
    () => () => {
      client.current?.close();
      audio.input.stop();
      audio.output.dispose();
    },
    [audio],
  );

  const onEvent = (e: ClientEvent) => {
    switch (e.type) {
      case 'state':
        setState(e.state);
        if (e.state === 'interrupted') speaker.current.stopNow();
        return;
      case 'user_transcript':
        setHeard(e.text);
        return;
      case 'reply':
        setReply(e.text);
        return;
      case 'audio':
        speaker.current.play(e.pcm, e.sampleRate);
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
    client.current = createConversation(connection, lang, onEvent);
    setLimitNote(null);
    try {
      await client.current.connect();
      return true;
    } catch (err) {
      setError(connectMessage(err, s));
      return false;
    }
  };

  /** Escribirle a Rio. Si la conversacion se cerro (inactividad), se reabre sola. */
  const sendText = async () => {
    const text = draft.trim();
    if (!text || !connection) return;
    if (!client.current || state === 'closed') {
      if (!(await connect())) return;
    }
    speaker.current.stopNow();
    if (client.current?.sendText(text)) {
      setHeard(text);
      setReply('');
      setDraft('');
      setError(null);
    }
  };

  const pressIn = () => {
    if (!client.current || state === 'closed' || state === 'limit_reached') return;
    setHeard('');
    setReply('');
    // Barge-in: Rio calla en cuanto se pulsa, sin esperar al servidor.
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

  return (
    <Screen>
      <View style={styles.portraitArea}>
        <View style={[styles.ring, { borderColor: RING[state] }]}>
          <View style={styles.portrait} accessibilityLabel="Rio" accessibilityRole="image">
            <Text style={styles.initial}>R</Text>
          </View>
        </View>
        <Text accessibilityLiveRegion="polite" accessibilityRole="text" style={styles.state}>
          {label}
        </Text>
        {minutes !== null ? <Text style={styles.minutes}>{s.minutesLeft(minutes)}</Text> : null}
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

      <View style={styles.captions}>
        {heard ? (
          <Text style={styles.heard}>
            <Text style={styles.speaker}>{s.you}: </Text>
            {heard}
          </Text>
        ) : null}
        {reply ? (
          <Text style={styles.reply}>
            <Text style={styles.speaker}>Rio: </Text>
            {reply}
          </Text>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {connection ? (
        <View style={styles.compose}>
          <TextInput
            accessibilityLabel={s.writePlaceholder}
            placeholder={s.writePlaceholder}
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
      ) : (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={listening ? s.releaseToSend : s.holdToTalk}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={[styles.talk, listening && styles.talkOn]}
          >
            <Text style={[styles.talkText, listening && styles.talkTextOn]}>{listening ? s.releaseToSend : s.holdToTalk}</Text>
          </Pressable>
          {audio.simulated ? <Text style={styles.note}>{s.simulatedMic}</Text> : null}
        </>
      )}
    </Screen>
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
  portraitArea: { alignItems: 'center', marginBottom: space.xl },
  ring: { width: 188, height: 188, borderRadius: radius.pill, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  portrait: { width: 164, height: 164, borderRadius: radius.pill, backgroundColor: color.inkRaised, alignItems: 'center', justifyContent: 'center' },
  initial: { ...type.display, color: color.mist },
  state: { ...type.body, color: color.cloud, marginTop: space.m },
  minutes: { ...type.micro, color: color.mist, marginTop: space.xs },
  captions: { flex: 1, gap: space.m },
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
