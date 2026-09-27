import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { STATE_LABELS, type ClientEvent, type ConversationClient, type ConversationState } from '@kotaru/client';
import { SilentSpeaker, SimulatedMicrophone } from '../audio';
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
  const client = useRef<ConversationClient | null>(null);
  const mic = useRef(new SimulatedMicrophone());
  const speaker = useRef(new SilentSpeaker());

  useEffect(() => () => client.current?.close(), []);

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
        setError(e.reason);
        return;
      default:
        return;
    }
  };

  const connect = async () => {
    if (!connection) return;
    setError(null);
    client.current?.close();
    client.current = createConversation(connection, lang, onEvent);
    try {
      await client.current.connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : s.error);
    }
  };

  const pressIn = () => {
    if (!client.current || state === 'closed' || state === 'limit_reached') return;
    setHeard('');
    setReply('');
    client.current.startTalking();
    mic.current.start((pcm) => client.current?.sendAudio(pcm));
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
      {state === 'limit_reached' ? <Body muted>{s.limitNote}</Body> : null}

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

      {!connection ? (
        <Body muted>{s.notConnected}</Body>
      ) : state === 'closed' ? (
        <Button label={s.connect} onPress={connect} />
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
          <Text style={styles.note}>{s.simulatedMic}</Text>
        </>
      )}
    </Screen>
  );
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
  note: { ...type.micro, color: color.mist, textAlign: 'center', marginBottom: space.l },
  safety: { borderColor: color.mist },
  safetyTitle: { ...type.title, color: color.cloud, marginBottom: space.s },
  error: { ...type.support, color: color.danger, marginBottom: space.s },
});
