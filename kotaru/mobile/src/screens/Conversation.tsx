import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApiError, STATE_LABELS, type ClientEvent, type ConversationClient, type ConversationState } from '@kotaru/client';
import { createAmbient, createSoundscape, type AmbientKind } from '../ambient';
import { keepCallAudio } from '../call-audio';
import { CINEMATIC_KEY, readFlag, writeFlag } from '../prefs';
import { classifyReaction, reactionFor, type Particles } from '../reactions';
import { ReactionBurst } from '../ui/reaction-burst';
import { SCENE_BUILDERS, SCENE_OF } from '../scene-sounds';
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
import { Icon, type IconName } from '../ui/icons';
import { EdgeGlow } from '../ui/edge-glow';
import { captionLine, charsForWidth } from '../captions';
import { SubtitleStrip } from '../ui/subtitle-strip';
import { HandsFreeVad, PreRoll, pcmLevel, pcmMs } from '../hands-free';
import { INPUT_SAMPLE_RATE } from '../audio-types';
import { autoPip, disposePip, openPip as openPipWindow, pipSupport, preparePip, type PipHandle } from '../pip';

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
/** Fondo de los paneles que flotan sobre el escenario: tinta al 72 % (texto blanco legible). */
const GLASS = 'rgba(11,16,32,0.72)';

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

const PLACE_KEY = 'kotaru.placeSound';
const HANDS_FREE_KEY = 'kotaru.handsFree';
/**
 * El lugar suena bajo y casi constante: si subia al escuchar y bajaba mucho al hablar el
 * personaje, su voz parecia mas baja por contraste (lo noto el dueño el 2026-09-29).
 */
const PLACE_VOLUME = 0.22;
const PLACE_DUCK = 0.55;

/** Como quiere la persona que le hablen; lo elige ella (no se deduce de la voz). */
export type AddressForm = 'masculine' | 'feminine' | 'neutral' | 'unset';
export type VoiceChoice = 'auto' | 'gemini' | 'chirp' | 'cartesia';
const VOICE_NAMES: Readonly<Record<string, string>> = { gemini: 'Gemini', chirp: 'Chirp', cartesia: 'Cartesia', kokoro: 'Kokoro' };

export function Conversation({
  lang,
  connection,
  voiceChoice = 'auto',
  address = 'unset',
  backgrounds = true,
  onNavigate,
  requestedCompanion,
  active = true,
}: {
  lang: Lang;
  connection: Connection | null;
  voiceChoice?: VoiceChoice;
  /** Como quiere que le hablen (Ajustes, «Cómo te hablo»). */
  address?: AddressForm;
  /** false: retrato redondo sin fondo (Ajustes). */
  backgrounds?: boolean;
  /** Pantalla inmersiva: los iconos llevan a Ajustes, Memoria o la seleccion de personaje. */
  onNavigate?: (to: 'settings' | 'memory' | 'characters') => void;
  /** Personaje elegido en la pantalla de seleccion. */
  requestedCompanion?: CompanionId;
  /** false mientras se ve otra pantalla (la conversacion sigue viva, pero el lugar no suena). */
  active?: boolean;
}) {
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
  // Que voz hablo en la ultima respuesta (solo se muestra si se eligio una en Ajustes).
  const [voiceUsed, setVoiceUsed] = useState<string | null>(null);
  const [companionId, setCompanionId] = useState<CompanionId>('luna');
  const companion = companionById(companionId);
  // Por personaje: su conversacion en el servidor (para retomarla) y lo que se vio en pantalla.
  const conversations = useRef<Partial<Record<CompanionId, string>>>({});
  // Modo de Nova y Rio (manuales): se recuerda por personaje mientras la app esta abierta.
  const [modes, setModes] = useState<Partial<Record<CompanionId, ConversationMode>>>({});
  const mode = modes[companionId] ?? 'ask';
  const screens = useRef<Partial<Record<CompanionId, Exchange[]>>>({});
  const nextId = useRef(0);
  const scroll = useRef<ScrollView | null>(null);
  const client = useRef<ConversationClient | null>(null);
  const audio = useRef(createAudio()).current;
  const ambient = useRef(createAmbient()).current;
  const [ambientKind, setAmbientKind] = useState<AmbientKind | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(ambient.volume);
  // Sonido del lugar (lluvia y coches en el cuarto de Nova, pajaros en la oficina de Luna,
  // fogata y grillos en el claro de Rio): bajo, siempre de fondo, y baja mas cuando hablan.
  const place = useRef(createSoundscape(SCENE_BUILDERS, PLACE_VOLUME, PLACE_DUCK)).current;
  const [placeOn, setPlaceOnState] = useState(() => readFlag(PLACE_KEY, true));
  const setPlaceOn = (on: boolean) => {
    setPlaceOnState(on);
    writeFlag(PLACE_KEY, on);
  };
  const placeWanted = active && backgrounds && placeOn;
  const startPlace = () => {
    // Los navegadores solo dejan sonar despues de un toque: se reintenta en cada uno.
    if (placeWanted) place.play(SCENE_OF[companionId]);
    // iPhone: la ventana flotante necesita un video ya en marcha en el momento del toque.
    if (backgrounds && typeof document !== 'undefined') preparePip(document.querySelector<HTMLCanvasElement>('#kotaru-stage canvas'));
  };
  useEffect(() => {
    if (placeWanted) place.play(SCENE_OF[companionId]);
    else place.stop();
  }, [placeWanted, companionId, place]);
  // Un solo modo de audio (llamada) mientras la conversacion esta en pantalla: asi el volumen
  // no cambia al abrir y cerrar el microfono en cada turno (call-audio.web.ts).
  useEffect(() => {
    keepCallAudio(active);
    // Al salir de la conversacion el micro (abierto en silencio entre turnos) se cierra.
    if (!active) mic.current.release?.();
    return () => keepCallAudio(false);
  }, [active]);
  // Con un sonido relajante elegido (lluvia, olas...), el lugar queda mas bajo debajo.
  useEffect(() => place.setVolume(ambientKind ? PLACE_VOLUME * 0.5 : PLACE_VOLUME), [ambientKind, place]);
  // Reaccion al momento a lo que dice la persona (reactions.ts): cara, gesto y particulas.
  const [burst, setBurst] = useState<{ n: number; particles: Particles }>({ n: 0, particles: 'none' });
  const react = (text: string) => {
    const r = reactionFor(classifyReaction(text), companionId, mode);
    setAffect({ emotion: r.emotion, intensity: r.intensity, gesture: r.gesture, at: performance.now() });
    setBurst((b) => ({ n: b.n + 1, particles: r.particles }));
  };
  const [breathing, setBreathing] = useState(false);
  // Pantalla inmersiva: panel abierto desde un icono y si se esta escribiendo.
  const [sheet, setSheet] = useState<null | 'history' | 'sounds' | 'mode'>(null);
  const [typing, setTyping] = useState(false);
  // Ventana flotante tipo videollamada (pip.web.ts).
  const pipAvailable = backgrounds && pipSupport() !== null;
  const pip = useRef<PipHandle | null>(null);
  // Emocion de la ultima respuesta, para la cara del avatar.
  const [affect, setAffect] = useState<AffectState | null>(null);
  const mic = useRef(audio.input);
  const speaker = useRef(audio.output);

  useEffect(installNoSelect, []);

  // El servidor manda la respuesta mas rapido de lo que se oye: el turno termina con voz
  // todavia en cola. El ambiente sigue bajo hasta que esa voz acaba de sonar.
  const speakingState = useRef(false);
  // true mientras suena la voz que quedo en cola despues de terminar el turno.
  const [voiceTail, setVoiceTail] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      const playing = speaker.current.isPlaying?.() === true;
      ambient.duck(speakingState.current || playing);
      place.duck(speakingState.current || playing);
      setVoiceTail((was) => (was === playing ? was : playing));
    }, 100);
    return () => clearInterval(timer);
  }, [ambient, place]);

  useEffect(
    () => () => {
      client.current?.close();
      audio.input.stop();
      audio.input.release?.();
      audio.output.dispose();
      ambient.dispose();
      place.dispose();
    },
    [audio, ambient, place],
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
        // El ambiente baja mientras habla el personaje (ver el efecto de mas abajo, que
        // ademas espera a que termine de sonar lo que quedo en cola).
        speakingState.current = e.state === 'speaking';
        ambient.duck(speakingState.current || speaker.current.isPlaying?.() === true);
        if (e.state === 'interrupted') speaker.current.stopNow();
        return;
      case 'user_transcript':
        setHeard(e.text);
        if (e.final && e.text.trim()) react(e.text);
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
      case 'voice_used':
        setVoiceUsed(VOICE_NAMES[e.voice] ?? e.voice);
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
    // En el mismo toque: micro abierto en silencio (iPhone en modo llamada, volumen bueno
    // desde el principio). No se oye ni se envia nada hasta pulsar para hablar.
    if (voiceOn) void mic.current.warm?.();
    client.current?.close();
    const who = companionId;
    const next = createConversation(connection, lang, onEvent, {
      companion: who,
      ...(conversations.current[who] ? { conversationId: conversations.current[who] } : {}),
      onConversation: (id) => {
        conversations.current[who] = id;
      },
    });
    next.setMode(modes[who] ?? 'ask');
    next.setVoiceChoice(voiceChoice);
    next.setAddress(address);
    client.current = next;
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
    // El lienzo del personaje vuelve de la ventana flotante antes de cambiarlo.
    pip.current?.close();
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

  // Personaje elegido en la pantalla de seleccion.
  useEffect(() => {
    if (requestedCompanion) choose(requestedCompanion);
    // Solo cuando cambia la eleccion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedCompanion]);

  /** Escribirle al personaje. Si la conversacion se cerro (inactividad), se reabre sola. */
  const sendText = async () => {
    const text = draft.trim();
    if (!text || !connection) return;
    if (!client.current || state === 'closed') {
      if (!(await connect())) return;
    }
    speaker.current.stopNow();
    if (client.current?.sendText(text)) {
      react(text);
      archiveCurrent();
      setHeard(text);
      setReply('');
      setDraft('');
      setError(null);
    }
  };

  const pressIn = () => {
    if (!client.current || state === 'closed' || state === 'limit_reached' || !voiceOn || handsFreeOn) return;
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
    if (handsFreeOn) return;
    mic.current.stop();
    client.current?.stopTalking();
  };

  // ---- Manos libres (hands-free.ts) ------------------------------------------------------
  // Opcion guardada (pantalla normal o completa) y encendido automatico mientras la ventana
  // flotante esta abierta, para hablarle mientras se hacen otras cosas. El micro queda abierto,
  // pero al servidor solo va la voz detectada; el indicador «Manos libres» se ve siempre.
  const [handsFree, setHandsFreeState] = useState(() => readFlag(HANDS_FREE_KEY, false));
  const setHandsFree = (on: boolean) => {
    setHandsFreeState(on);
    writeFlag(HANDS_FREE_KEY, on);
  };
  const [pipHands, setPipHands] = useState(false);
  const handsFreeOn =
    (handsFree || pipHands) &&
    active &&
    !!connection &&
    voiceOn &&
    state !== 'closed' &&
    state !== 'connecting' &&
    state !== 'reconnecting' &&
    state !== 'limit_reached' &&
    state !== 'safety_handoff';
  // El personaje habla o piensa: hace falta hablar mas claro para interrumpirle (eco).
  const busyRef = useRef(false);
  busyRef.current = state === 'thinking' || state === 'speaking' || state === 'endpoint' || voiceTail;
  const beginHandsFreeRef = useRef(() => {});
  beginHandsFreeRef.current = () => {
    archiveCurrent();
    setHeard('');
    setReply('');
    speaker.current.stopNow();
    client.current?.startTalking();
  };
  const handsFreeIdleRef = useRef(() => {});
  handsFreeIdleRef.current = () => {
    setHandsFree(false);
    setPipHands(false);
    setError(s.handsFreeIdleOff);
  };
  useEffect(() => {
    if (!handsFreeOn) return;
    const vad = new HandsFreeVad(performance.now());
    const roll = new PreRoll(300);
    let inTurn = false;
    let stopped = false;
    mic.current
      .start((pcm) => {
        if (stopped) return;
        const ms = pcmMs(pcm, INPUT_SAMPLE_RATE);
        const event = vad.push(pcmLevel(pcm), ms, performance.now(), busyRef.current);
        if (event === 'start') {
          beginHandsFreeRef.current();
          for (const chunk of roll.drain()) client.current?.sendAudio(chunk);
          inTurn = true;
        }
        if (inTurn) client.current?.sendAudio(pcm);
        else roll.push(pcm, ms);
        if (event === 'end') {
          inTurn = false;
          client.current?.stopTalking();
        }
        if (event === 'idle-off') handsFreeIdleRef.current();
      })
      .then(
        (ok) => {
          if (!ok && !stopped) {
            setError(s.micDenied);
            setHandsFree(false);
            setPipHands(false);
          }
        },
        () => setError(s.error),
      );
    return () => {
      stopped = true;
      mic.current.stop();
      if (inTurn) client.current?.stopTalking();
    };
  }, [handsFreeOn]);

  // La ventana flotante llama a lo ultimo (no a la version de cuando se abrio).
  const pressInRef = useRef(pressIn);
  const pressOutRef = useRef(pressOut);
  pressInRef.current = pressIn;
  pressOutRef.current = pressOut;

  const openPip = async () => {
    if (pip.current) return;
    const canvas = typeof document !== 'undefined' ? document.querySelector<HTMLCanvasElement>('#kotaru-stage canvas') : null;
    if (!canvas) return;
    const handle = await openPipWindow({
      canvas,
      name: companion.name,
      aiBadge: s.aiBadge,
      accent: companion.accent,
      talkLabel: s.holdToTalk,
      releaseLabel: s.releaseToSend,
      backLabel: s.pipBack,
      onTalkStart: () => pressInRef.current(),
      onTalkEnd: () => pressOutRef.current(),
      onClosed: () => {
        pip.current = null;
        setPipHands(false);
      },
      // Si no se abre, se dice por que (antes el icono no hacia nada y no se sabia la causa).
      onFailed: (why) => {
        pip.current = null;
        setPipHands(false);
        setError(why === 'not-ready' ? s.pipNotReady : s.pipFailed(why));
      },
    }).catch(() => null);
    pip.current = handle;
    // En la ventana flotante no se puede mantener pulsado: se escucha solo (manos libres).
    if (handle) setPipHands(true);
  };
  // iPhone: el video de la ventana flotante se prepara al entrar (tiene que estar ya en marcha
  // cuando se toque el icono) y se quita al salir de la conversacion.
  useEffect(() => {
    if (!active || !backgrounds || !pipAvailable) {
      disposePip();
      return;
    }
    const find = () => document.querySelector<HTMLCanvasElement>('#kotaru-stage canvas');
    preparePip(find());
    const timer = setInterval(() => preparePip(find()), 2000);
    return () => clearInterval(timer);
  }, [active, backgrounds, pipAvailable]);
  useEffect(() => () => disposePip(), []);
  const openPipRef = useRef(openPip);
  openPipRef.current = openPip;

  // Estado en la ventana flotante.
  useEffect(() => {
    const pipLabel = STATE_LABELS[lang][state === 'idle' && voiceTail ? 'speaking' : state];
    pip.current?.update(
      handsFreeOn ? `${s.handsFreeBadge} · ${pipLabel}` : pipLabel,
      state === 'listening',
      !!client.current && state !== 'closed' && voiceOn && !handsFreeOn,
      handsFreeOn ? (state === 'listening' ? s.handsFreeHearing : s.handsFreeBadge) : undefined,
    );
  });

  // Con la conversacion abierta, el navegador puede abrir la ventana flotante solo al
  // cambiar de pestaña (Chrome, si la persona lo permite). Al irse de la pantalla, se cierra.
  useEffect(() => {
    if (!pipAvailable || state === 'closed') return;
    return autoPip(() => void openPipRef.current());
  }, [pipAvailable, state === 'closed']);
  useEffect(() => () => pip.current?.close(), []);

  useEffect(() => {
    client.current?.setVoiceChoice(voiceChoice);
    if (voiceChoice === 'auto') setVoiceUsed(null);
  }, [voiceChoice]);
  useEffect(() => {
    client.current?.setAddress(address);
  }, [address]);

  const chooseMode = (m: ConversationMode) => {
    setModes((all) => ({ ...all, [companionId]: m }));
    client.current?.setMode(m);
  };

  // Lo que se muestra: si el turno ya termino pero la voz sigue sonando, sigue "hablando"
  // (anillo, etiqueta y cabeza del avatar), no "en espera".
  const shown: ConversationState = state === 'idle' && voiceTail ? 'speaking' : state;
  const label = STATE_LABELS[lang][shown];
  const listening = state === 'listening';
  // Con conversacion en pantalla, el retrato se achica para dejar sitio al texto.
  const compact = history.length > 0 || state === 'safety_handoff' || breathing;

  // En la web, con fondos, el personaje ocupa toda la pantalla en su lugar (oficina,
  // cuarto, montaña) y los controles flotan encima. En el movil sigue el retrato redondo.
  const ringColor = shown === 'idle' || shown === 'closed' ? companion.accent : RING[shown];
  const immersive = backgrounds && Platform.OS === 'web';
  const [area, setArea] = useState<{ width: number; height: number } | null>(null);
  // Donde empieza el panel de abajo (fraccion del alto): la camara deja la cara por encima.
  const [panelTop, setPanelTop] = useState(1);

  const avatar = (size: number, width?: number) => (
    <Avatar
      companion={companionId}
      size={size}
      {...(width !== undefined ? { width, background: true, immersive: true, freeBottom: panelTop } : {})}
      {...(companion.flirts && mode !== 'ask' ? { mood: mode } : {})}
      cinematic={readFlag(CINEMATIC_KEY, true)}
      state={shown}
      affect={affect}
      level={() => speaker.current.level?.() ?? 0}
      visemes={() => speaker.current.visemes?.() ?? null}
      onPresence={(pan, far) => speaker.current.place?.(pan, far)}
      fallback={<Text style={[styles.initial, compact && !immersive && styles.initialCompact, { color: companion.accent }]}>{companion.name[0]}</Text>}
    />
  );

  const picker = <CompanionPicker selected={companionId} onChoose={choose} label={s.chooseCompanion} lang={lang} floating={immersive} />;

  // Nombre, aviso de IA (siempre visible: leyes de NY y California) y estado en texto.
  const identity = (
    <>
      <Text accessibilityRole="header" style={styles.name}>
        {companion.name}
      </Text>
      <Text style={styles.aiBadge}>{s.aiBadge}</Text>
      <Text accessibilityLiveRegion="polite" accessibilityRole="text" style={styles.state}>
        {label}
      </Text>
      {handsFreeOn ? <Text style={[styles.state, styles.handsFreeBadge]}>● {s.handsFreeBadge}</Text> : null}
    </>
  );
  const extras = (
    <>
      {state === 'closed' && history.length === 0 ? <Text style={[styles.tagline, immersive && styles.taglineFloating]}>{companion.tagline[lang]}</Text> : null}
      {companion.flirts ? <ModePicker mode={mode} onChoose={chooseMode} lang={lang} accent={companion.accent} /> : null}
      {minutes !== null && voiceOn ? <Text style={styles.minutes}>{s.minutesLeft(minutes)}</Text> : null}
      {voiceChoice !== 'auto' && voiceUsed ? <Text style={styles.minutes}>{s.voiceUsed(voiceUsed)}</Text> : null}
    </>
  );

  const notices = (
    <>
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
    </>
  );

  const hasCaptions = history.length > 0 || heard !== '' || reply !== '';
  const captions =
    !immersive || hasCaptions ? (
      <ScrollView
        ref={scroll}
        style={immersive ? [styles.captionsFloating, { maxHeight: Math.round((area?.height ?? 600) * 0.24) }] : styles.captions}
        contentContainerStyle={immersive ? styles.captionsFloatingContent : styles.captionsContent}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {history.map((x) => (
          <ExchangeView key={x.id} heard={x.heard} reply={x.reply} you={s.you} them={companion.name} past />
        ))}
        <ExchangeView heard={heard} reply={reply} you={s.you} them={companion.name} />
      </ScrollView>
    ) : null;

  const controls = (
    <>
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
            style={[styles.input, immersive && styles.inputFloating]}
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
          {handsFreeOn ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={s.handsFreePause}
              {...({ dataSet: { [NO_SELECT_ATTR]: 'true' } } as object)}
              onPress={() => {
                setHandsFree(false);
                setPipHands(false);
              }}
              style={[styles.talk, listening && styles.talkOn]}
            >
              <Text selectable={false} style={[styles.talkText, listening && styles.talkTextOn]}>{listening ? s.handsFreeHearing : s.handsFreeOn}</Text>
            </Pressable>
          ) : (
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
          )}
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: handsFree }}
            onPress={() => setHandsFree(!handsFree)}
            style={styles.handsFreeLink}
          >
            <Text style={styles.handsFreeLinkText}>{handsFree ? s.handsFreeDisable : s.handsFreeEnable}</Text>
          </Pressable>
          {audio.simulated ? <Text style={styles.note}>{s.simulatedMic}</Text> : null}
        </>
      )}
    </>
  );

  const breathe = breathing ? <BreatheOverlay lang={lang} accent={companion.accent} onClose={() => setBreathing(false)} /> : null;

  if (immersive) {
    const lineChars = charsForWidth(Math.min(area?.width ?? 400, 600) - 2 * space.l);
    // Una sola linea superpuesta: lo que se oye de ti mientras hablas y, despues, lo ultimo
    // que dice el personaje. Todo lo anterior esta en el icono de conversacion.
    const line =
      listening || (heard && !reply)
        ? { who: s.you, text: captionLine(heard, lineChars - s.you.length - 2), muted: true }
        : reply
          ? { who: null, text: reply, muted: false, scroll: true }
          : state === 'closed' && history.length === 0
            ? { who: null, text: companion.tagline[lang], muted: true }
            : null;
    const iconColor = color.cloud;
    return (
      <View
        style={[styles.immersive, { backgroundColor: companion.tint }]}
        onStartShouldSetResponderCapture={() => {
          startPlace();
          return false;
        }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (!area || Math.abs(area.width - width) > 1 || Math.abs(area.height - height) > 1) setArea({ width, height });
        }}
      >
        {/* El escenario detras de todo, a pantalla completa. */}
        {area ? (
          <View nativeID="kotaru-stage" style={styles.immersiveStage} accessibilityLabel={companion.name} accessibilityRole="image">
            {avatar(Math.round(area.height), Math.round(area.width))}
          </View>
        ) : null}
        <ReactionBurst particles={burst.particles} burst={burst.n} />
        <EdgeGlow state={shown} level={() => (shown === 'listening' ? mic.current.level?.() ?? 0.3 : speaker.current.level?.() ?? 0)} accent={companion.accent} />

        {/* Arriba a la izquierda: quien es (siempre dice que es una IA) y en que estado esta. */}
        <View style={styles.topLeft} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${companion.name}. ${s.iconCharacters}`}
            onPress={() => onNavigate?.('characters')}
            style={styles.identityFloating}
          >
            <View style={[styles.chipDot, { backgroundColor: companion.tint, borderColor: companion.accent }]}>
              <Text style={[styles.chipInitial, { color: companion.accent }]}>{companion.name[0]}</Text>
            </View>
            <View>
              <View style={styles.nameRow}>
                <Text accessibilityRole="header" style={styles.nameFloating}>
                  {companion.name}
                </Text>
                <View style={[styles.stateDot, { backgroundColor: ringColor }]} />
              </View>
              <Text style={styles.aiBadgeFloating}>{s.aiBadge}</Text>
            </View>
          </Pressable>
          <Text accessibilityLiveRegion="polite" accessibilityRole="text" style={styles.stateFloating}>
            {label}
          </Text>
          {handsFreeOn ? <Text style={[styles.minutesFloating, styles.handsFreeBadge]}>● {s.handsFreeBadge}</Text> : null}
          {minutes !== null && voiceOn ? <Text style={styles.minutesFloating}>{s.minutesLeft(minutes)}</Text> : null}
          {voiceChoice !== 'auto' && voiceUsed ? <Text style={styles.minutesFloating}>{s.voiceUsed(voiceUsed)}</Text> : null}
        </View>

        {/* Arriba a la derecha: las opciones como iconos. */}
        <View style={styles.topRight} pointerEvents="box-none">
          <IconButton icon="settings" label={s.iconSettings} onPress={() => onNavigate?.('settings')} color={iconColor} />
          <IconButton icon="memory" label={s.iconMemory} onPress={() => onNavigate?.('memory')} color={iconColor} />
          <IconButton icon="history" label={s.iconHistory} onPress={() => setSheet(sheet === 'history' ? null : 'history')} on={sheet === 'history'} color={iconColor} />
          {ambient.available ? (
            <IconButton icon="sounds" label={s.sounds} onPress={() => setSheet(sheet === 'sounds' ? null : 'sounds')} on={sheet === 'sounds' || ambientKind !== null || (placeOn && place.available)} color={iconColor} />
          ) : null}
          <IconButton icon="breathe" label={s.iconBreathe} onPress={() => setBreathing(true)} color={iconColor} />
          {companion.flirts ? (
            <IconButton icon="heart" label={s.iconMode} onPress={() => setSheet(sheet === 'mode' ? null : 'mode')} on={sheet === 'mode' || mode === 'flirt'} color={mode === 'flirt' ? companion.accent : iconColor} />
          ) : null}
          {pipAvailable ? <IconButton icon="pip" label={s.iconPip} onPress={() => void openPip()} color={iconColor} /> : null}
          {connection && voiceOn ? (
            <IconButton icon="mic" label={handsFree ? s.handsFreeDisable : s.handsFreeEnable} onPress={() => setHandsFree(!handsFree)} on={handsFree} color={iconColor} />
          ) : null}
        </View>

        {/* Paneles pequeños que abren los iconos. */}
        {sheet === 'sounds' ? (
          <View style={styles.popover}>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: placeOn }}
              onPress={() => setPlaceOn(!placeOn)}
              style={styles.placeRow}
            >
              <Text style={styles.placeText}>{s.placeSound}</Text>
              <Text style={[styles.placeValue, placeOn && { color: companion.accent }]}>{placeOn ? s.on : s.off}</Text>
            </Pressable>
            <CalmBar
              lang={lang}
              soundsAvailable={ambient.available}
              playing={ambientKind}
              volume={ambientVolume}
              soundsOnly
              startOpen
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
          </View>
        ) : null}
        {sheet === 'mode' && companion.flirts ? (
          <View style={styles.popover}>
            <ModePicker mode={mode} onChoose={(m) => { chooseMode(m); setSheet(null); }} lang={lang} accent={companion.accent} />
          </View>
        ) : null}
        {sheet === 'history' ? (
          <View style={styles.historySheet}>
            <View style={styles.sheetHeader}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>{s.historyTitle}</Text>
              <IconButton icon="close" label={s.close} onPress={() => setSheet(null)} color={iconColor} />
            </View>
            <ScrollView ref={scroll} contentContainerStyle={styles.captionsFloatingContent} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
              {hasCaptions ? null : <Text style={styles.tagline}>{s.historyEmpty}</Text>}
              {history.map((x) => (
                <ExchangeView key={x.id} heard={x.heard} reply={x.reply} you={s.you} them={companion.name} past />
              ))}
              <ExchangeView heard={heard} reply={reply} you={s.you} them={companion.name} />
            </ScrollView>
          </View>
        ) : null}

        {/* Abajo: avisos, el subtitulo de una linea y los controles. */}
        <View
          style={styles.bottom}
          pointerEvents="box-none"
          onLayout={(e) => {
            if (!area) return;
            const top = Math.round((e.nativeEvent.layout.y / area.height) * 50) / 50;
            if (Math.abs(top - panelTop) >= 0.02) setPanelTop(top);
          }}
        >
          <View style={styles.bottomInner} pointerEvents="box-none">
          {notices}
          {line && 'scroll' in line ? (
            <SubtitleStrip text={line.text} style={styles.subtitle} />
          ) : line ? (
            // Lo que se oye de ti es de una linea (avanza por delante, captions.ts); la frase del
            // personaje en reposo puede ocupar dos para no cortarse a mitad en el movil.
            <Text numberOfLines={line.muted ? 2 : 1} accessibilityLiveRegion="polite" style={[styles.subtitle, line.muted && styles.subtitleMuted]}>
              {line.who ? <Text style={styles.speaker}>{line.who}: </Text> : null}
              {line.text}
            </Text>
          ) : null}
          {error ? <Text style={styles.errorFloating}>{error}</Text> : null}
          {typing && connection ? (
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
                autoFocus
                style={[styles.input, styles.inputFloating]}
              />
              <IconButton icon="send" label={s.send} onPress={() => void sendText()} disabled={!draft.trim()} color={iconColor} />
            </View>
          ) : null}
          <View style={styles.controlRow}>
            {connection ? (
              <IconButton icon="keyboard" label={s.iconKeyboard} onPress={() => setTyping((v) => !v)} on={typing} color={iconColor} />
            ) : null}
            <View style={styles.controlMain}>
              {!connection ? (
                <Text style={styles.noteFloating}>{s.notConnected}</Text>
              ) : state === 'closed' ? (
                <Button label={s.connect} onPress={() => void connect()} />
              ) : !voiceOn ? (
                <Text style={styles.noteFloating}>{s.voiceNotYet(companion.name)}</Text>
              ) : (
                handsFreeOn ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={s.handsFreePause}
                    {...({ dataSet: { [NO_SELECT_ATTR]: 'true' } } as object)}
                    onPress={() => {
                      setHandsFree(false);
                      setPipHands(false);
                    }}
                    style={[styles.talk, styles.talkFloating, listening && styles.talkOn]}
                  >
                    <Icon name="mic" size={20} color={listening ? color.ink : '#FFFFFF'} />
                    <Text selectable={false} style={[styles.talkText, listening && styles.talkTextOn]}>{listening ? s.handsFreeHearing : s.handsFreeOn}</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={listening ? s.releaseToSend : s.holdToTalk}
                    {...({ dataSet: { [NO_SELECT_ATTR]: 'true' } } as object)}
                    onPressIn={pressIn}
                    onPressOut={pressOut}
                    style={[styles.talk, styles.talkFloating, listening && styles.talkOn]}
                  >
                    <Icon name="mic" size={20} color={listening ? color.ink : '#FFFFFF'} />
                    <Text selectable={false} style={[styles.talkText, listening && styles.talkTextOn]}>{listening ? s.releaseToSend : s.holdToTalk}</Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
          {audio.simulated && connection && state !== 'closed' ? <Text style={styles.noteFloating}>{s.simulatedMic}</Text> : null}
          </View>
        </View>
        {breathe}
      </View>
    );
  }

  return (
    <Screen>
      {picker}
      <View style={[styles.portraitArea, compact && styles.portraitAreaCompact]}>
        <View style={[styles.ring, compact && styles.ringCompact, { borderColor: ringColor }]}>
          <View style={[styles.portrait, compact && styles.portraitCompact, { backgroundColor: companion.tint }]} accessibilityLabel={companion.name} accessibilityRole="image">
            {avatar(compact ? PORTRAIT_COMPACT : PORTRAIT)}
          </View>
        </View>
        {identity}
        {extras}
      </View>
      {notices}
      {captions}
      {controls}
      {breathe}
    </Screen>
  );
}

/**
 * Los tres personajes, arriba. Monograma con su color MAS el nombre escrito: el color nunca
 * es la unica señal (09_BRAND). Se puede cambiar en cualquier momento.
 */
/** Boton redondo de vidrio con un icono (pantalla inmersiva). El nombre va al lector de pantalla. */
function IconButton({ icon, label, onPress, on, disabled, color: tint }: { icon: IconName; label: string; onPress: () => void; on?: boolean; disabled?: boolean; color: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on === true, disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, on && styles.iconButtonOn, (pressed || disabled) && styles.iconButtonPressed]}
      {...({ title: label } as object)}
    >
      <Icon name={icon} color={tint} />
    </Pressable>
  );
}

function CompanionPicker({
  selected,
  onChoose,
  label,
  lang,
  floating,
}: {
  selected: CompanionId;
  onChoose: (id: CompanionId) => void;
  label: string;
  lang: Lang;
  floating?: boolean;
}) {
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
            style={[styles.chip, floating && styles.chipFloating, on && { borderColor: c.accent, backgroundColor: c.tint }]}
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

type ConversationMode = 'ask' | 'friend' | 'flirt';
const MODES: readonly ConversationMode[] = ['ask', 'friend', 'flirt'];

/** Amigo / Coqueteo / Tú decides (manuales de Nova y Rio): se puede cambiar en cualquier momento. */
function ModePicker({ mode, onChoose, lang, accent }: { mode: ConversationMode; onChoose: (m: ConversationMode) => void; lang: Lang; accent: string }) {
  const s = t(lang);
  return (
    <View style={styles.modes} accessibilityRole="radiogroup" accessibilityLabel={s.modeLabel}>
      {MODES.map((m) => {
        const on = m === mode;
        return (
          <Pressable
            key={m}
            accessibilityRole="radio"
            accessibilityState={{ selected: on, checked: on }}
            accessibilityLabel={s.modes[m]}
            onPress={() => onChoose(m)}
            style={[styles.mode, on && { borderColor: accent }]}
          >
            <Text style={[styles.modeText, on && styles.modeTextOn]}>{s.modes[m]}</Text>
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
  placeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44, paddingHorizontal: space.s, marginBottom: space.s, borderBottomWidth: 1, borderBottomColor: color.inkLine },
  placeText: { ...type.body, color: color.cloud },
  placeValue: { ...type.body, color: color.mist, fontWeight: '600' },
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
  // Pantalla completa (web con fondos): el escenario detras y los controles encima.
  immersive: { flex: 1, overflow: 'hidden' },
  immersiveStage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  immersiveColumn: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: space.l, paddingTop: space.l },
  // Arriba, en una sola linea compacta para no tapar la cara.
  identityFloating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s,
    paddingVertical: space.xs,
    paddingLeft: space.xs,
    paddingRight: space.m,
    borderRadius: radius.pill,
    backgroundColor: GLASS,
  },
  nameFloating: { ...type.support, fontWeight: '600', color: color.cloud },
  aiBadgeFloating: { ...type.micro, color: color.mist, letterSpacing: 0.5 },
  stateFloating: { ...type.micro, color: color.cloud, paddingHorizontal: space.s, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: GLASS, overflow: 'hidden' },
  extrasFloating: { alignItems: 'center' },
  taglineFloating: { marginTop: 0, marginBottom: space.s },
  spacer: { flex: 1 },
  // Panel de abajo: vidrio oscuro para que el texto se lea sobre cualquier fondo (AA).
  panel: { borderRadius: radius.sheet, backgroundColor: GLASS, padding: space.l, paddingBottom: space.s, marginBottom: space.m, gap: space.xs },
  captionsFloating: { marginBottom: space.m },
  captionsFloatingContent: { gap: space.l },
  inputFloating: { backgroundColor: 'rgba(11,16,32,0.6)' },
  chipFloating: { backgroundColor: GLASS, borderColor: 'rgba(255,255,255,0.18)' },
  stateDot: { width: 8, height: 8, borderRadius: radius.pill },
  topLeft: { position: 'absolute', top: space.l, left: space.l, zIndex: 6, alignItems: 'flex-start', gap: space.xs, maxWidth: '60%' },
  topRight: { position: 'absolute', top: space.l, right: space.l, zIndex: 6, gap: space.s, alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  minutesFloating: { ...type.micro, color: color.cloud, paddingHorizontal: space.s, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: GLASS, overflow: 'hidden' },
  iconButton: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: GLASS, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  iconButtonOn: { borderColor: 'rgba(255,255,255,0.6)' },
  iconButtonPressed: { opacity: 0.6 },
  // Casi opaco: debajo queda la cabecera (nombre y estado) y se leian las dos cosas a la vez.
  popover: { position: 'absolute', top: space.l, right: 44 + 2 * space.l, zIndex: 7, maxWidth: 320, padding: space.m, borderRadius: radius.card, backgroundColor: 'rgba(11,16,32,0.96)' },
  historySheet: { position: 'absolute', top: space.l, left: space.l, right: 44 + 2 * space.l, bottom: 140, zIndex: 8, maxWidth: 560, padding: space.l, borderRadius: radius.sheet, backgroundColor: 'rgba(11,16,32,0.9)' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.m },
  sheetTitle: { ...type.title, color: color.cloud, flex: 1 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6, alignItems: 'center', paddingHorizontal: space.l, paddingBottom: space.m },
  bottomInner: { width: '100%', maxWidth: 600, gap: space.s },
  subtitle: {
    ...type.body,
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  handsFreeLink: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', paddingHorizontal: space.m },
  handsFreeLinkText: { ...type.micro, color: color.mist, textDecorationLine: 'underline' },
  handsFreeBadge: { color: '#37D6C8' },
  subtitleMuted: { color: '#E6E9F2', fontStyle: 'italic' },
  errorFloating: { ...type.support, color: color.danger, textAlign: 'center', backgroundColor: GLASS, borderRadius: radius.control, padding: space.xs, overflow: 'hidden' },
  noteFloating: { ...type.support, color: color.cloud, textAlign: 'center', backgroundColor: GLASS, borderRadius: radius.control, padding: space.s, overflow: 'hidden' },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  controlMain: { flex: 1 },
  talkFloating: { flexDirection: 'row', gap: space.s, marginBottom: 0, height: 56 },
  ringCompact: { width: PORTRAIT_COMPACT + 16, height: PORTRAIT_COMPACT + 16 },
  portraitCompact: { width: PORTRAIT_COMPACT, height: PORTRAIT_COMPACT },
  initialCompact: { ...type.title },
  state: { ...type.support, color: color.mist, marginTop: space.xs },
  minutes: { ...type.micro, color: color.mist, marginTop: space.xs },
  modes: { flexDirection: 'row', gap: space.xs, marginTop: space.s },
  mode: { paddingVertical: 4, paddingHorizontal: space.m, borderRadius: radius.pill, borderWidth: 1, borderColor: color.inkLine },
  modeText: { ...type.micro, color: color.mist },
  modeTextOn: { color: color.cloud, fontWeight: '600' },
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

