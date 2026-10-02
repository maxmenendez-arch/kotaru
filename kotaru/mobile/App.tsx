import { StatusBar } from 'expo-status-bar';
import type { AuthApi } from '@kotaru/client';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { openAccount, SERVER_URL } from './src/auth';
import type { Connection } from './src/connection';
import type { Lang } from './src/i18n';
import { t } from './src/i18n';
import { preloadAvatars } from './src/avatar';
import { Conversation, type AddressForm, type VoiceChoice } from './src/screens/Conversation';
import { Memories } from './src/screens/Memories';
import { Settings } from './src/screens/Settings';
import { Characters } from './src/screens/Characters';
import type { CompanionId } from './src/companions';
import { SignIn } from './src/screens/SignIn';
import { Welcome } from './src/screens/Welcome';
import { color, space, type } from './src/theme';

type Tab = 'talk' | 'memory' | 'settings' | 'characters';

/**
 * Esqueleto de la app. Navegacion minima por pestañas en estado local: cuando haya mas
 * de tres pantallas conviene pasar a Expo Router (recomendado por la guia de Expo del
 * proyecto, AGENTS.md).
 */
export default function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [welcomed, setWelcomed] = useState(false);
  // La primera vez (en este navegador) se elige personaje antes de hablar.
  const [tab, setTab] = useState<Tab>(() => (readFlag(CHOSEN_KEY, false) ? 'talk' : 'characters'));
  const [requested, setRequested] = useState<CompanionId | undefined>(undefined);
  const [connection, setConnection] = useState<Connection | null>(null);
  // Voz elegida en Ajustes para probar. En la web se recuerda en este navegador (no es un
  // dato personal: solo "auto", "gemini" o "cartesia").
  const [address, setAddressState] = useState<AddressForm>(readAddress);
  const setAddress = (form: AddressForm) => {
    setAddressState(form);
    writeAddress(form);
  };
  const [voiceChoice, setVoiceChoiceState] = useState<VoiceChoice>(readVoiceChoice);
  const setVoiceChoice = (choice: VoiceChoice) => {
    setVoiceChoiceState(choice);
    writeVoiceChoice(choice);
  };
  // Fondos animados detras del personaje (web). Encendidos por defecto; se recuerda igual.
  const [backgrounds, setBackgroundsState] = useState<boolean>(() => readFlag(BACKGROUNDS_KEY, true));
  const setBackgrounds = (on: boolean) => {
    setBackgroundsState(on);
    writeFlag(BACKGROUNDS_KEY, on);
  };
  // Con servidor de cuentas configurado: 'loading' hasta leer la sesion guardada,
  // 'signin' si no la hay, 'app' dentro. Sin servidor se entra directo (desarrollo).
  const [gate, setGate] = useState<'loading' | 'signin' | 'app'>(SERVER_URL ? 'loading' : 'app');
  const [auth, setAuth] = useState<AuthApi | null>(null);
  const s = t(lang);
  const showDevConnection = __DEV__ || !SERVER_URL;

  // Los modelos 3D se empiezan a bajar ya, mientras se lee la bienvenida o se entra.
  useEffect(() => {
    if (Platform.OS === 'web') preloadAvatars();
  }, []);

  useEffect(() => {
    if (!SERVER_URL) return;
    const serverUrl = SERVER_URL;
    let live = true;
    openAccount(serverUrl, () => {
      if (!live) return;
      setConnection(null);
      setGate('signin');
    }).then(({ auth: api, restored }) => {
      if (!live) return;
      setAuth(api);
      if (restored) {
        setConnection({ kind: 'account', serverUrl, auth: api });
        setGate('app');
      } else {
        setGate('signin');
      }
    });
    return () => {
      live = false;
    };
  }, []);

  if (!welcomed) {
    return (
      <>
        <StatusBar style="light" />
        <Welcome lang={lang} onLang={setLang} onDone={() => setWelcomed(true)} />
      </>
    );
  }

  if (gate !== 'app') {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        {gate === 'signin' && auth && SERVER_URL ? (
          <SignIn
            lang={lang}
            auth={auth}
            onSignedIn={() => {
              setConnection({ kind: 'account', serverUrl: SERVER_URL as string, auth });
              setTab('talk');
              setGate('app');
            }}
            onDevConnection={
              showDevConnection
                ? () => {
                    setTab('settings');
                    setGate('app');
                  }
                : null
            }
          />
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.body}>
        {/* La conversacion no se desmonta al ir a otra pantalla: sigue viva (y su voz
            sonando) como en una llamada; solo se oculta. */}
        <View style={[styles.body, tab !== 'talk' && styles.hidden]}>
          <Conversation
            lang={lang}
            connection={connection}
            voiceChoice={voiceChoice}
            address={address}
            backgrounds={backgrounds}
            requestedCompanion={requested}
            active={tab === 'talk'}
            onNavigate={(to) => setTab(to === 'memory' ? 'memory' : to === 'settings' ? 'settings' : 'characters')}
          />
        </View>
        {tab === 'characters' ? (
          <Characters
            lang={lang}
            current={requested}
            {...(readFlag(CHOSEN_KEY, false) ? { onBack: () => setTab('talk') } : {})}
            onChoose={(id) => {
              setRequested(id);
              writeFlag(CHOSEN_KEY, true);
              setTab('talk');
            }}
          />
        ) : null}
        {tab === 'memory' ? <Memories lang={lang} connection={connection} /> : null}
        {tab === 'settings' ? (
          <Settings
            lang={lang}
            connection={connection}
            showDevConnection={showDevConnection}
            voiceChoice={voiceChoice}
            onVoiceChoice={setVoiceChoice}
            address={address}
            onAddress={setAddress}
            backgrounds={backgrounds}
            onBackgrounds={setBackgrounds}
            onConnection={(c) => {
              setConnection(c);
              setTab('talk');
            }}
          />
        ) : null}
      </View>
      {/* En la pantalla inmersiva de la web, las opciones estan en iconos: sin barra abajo. */}
      <View style={[styles.tabs, (tab === 'characters' || (tab === 'talk' && backgrounds && Platform.OS === 'web')) && styles.hidden]} accessibilityRole="tablist">
        {(
          [
            ['talk', s.tabTalk],
            ['characters', s.tabCharacters],
            ['memory', s.tabMemory],
            ['settings', s.tabSettings],
          ] as const
        ).map(([id, label]) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === id }}
            onPress={() => setTab(id)}
            style={styles.tab}
          >
            <Text style={[styles.tabText, tab === id && styles.tabOn]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ink },
  body: { flex: 1 },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: color.inkLine, paddingBottom: space.l },
  tab: { flex: 1, alignItems: 'center', paddingVertical: space.m },
  tabText: { ...type.support, color: color.mist },
  tabOn: { color: color.cloud, fontWeight: '600' },
  hidden: { display: 'none' },
});

const CHOSEN_KEY = 'kotaru.characterChosen';

const VOICE_KEY = 'kotaru.voiceChoice';

function readVoiceChoice(): VoiceChoice {
  try {
    const v = (globalThis as { localStorage?: Storage }).localStorage?.getItem(VOICE_KEY);
    return v === 'gemini' || v === 'chirp' || v === 'cartesia' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

function writeVoiceChoice(choice: VoiceChoice): void {
  try {
    (globalThis as { localStorage?: Storage }).localStorage?.setItem(VOICE_KEY, choice);
  } catch {
    // Navegador privado o sin almacenamiento: vale solo mientras la pagina este abierta.
  }
}

const ADDRESS_KEY = 'kotaru.address';

/** «Cómo te hablo»: se guarda en el dispositivo y se envia al conectar (no va a la memoria). */
function readAddress(): AddressForm {
  try {
    const v = (globalThis as { localStorage?: Storage }).localStorage?.getItem(ADDRESS_KEY);
    return v === 'masculine' || v === 'feminine' || v === 'neutral' ? v : 'unset';
  } catch {
    return 'unset';
  }
}

function writeAddress(form: AddressForm): void {
  try {
    (globalThis as { localStorage?: Storage }).localStorage?.setItem(ADDRESS_KEY, form);
  } catch {
    // Sin almacenamiento: vale mientras la pagina este abierta.
  }
}

const BACKGROUNDS_KEY = 'kotaru.backgrounds';

function readFlag(key: string, fallback: boolean): boolean {
  try {
    const v = (globalThis as { localStorage?: Storage }).localStorage?.getItem(key);
    return v === 'on' ? true : v === 'off' ? false : fallback;
  } catch {
    return fallback;
  }
}

function writeFlag(key: string, on: boolean): void {
  try {
    (globalThis as { localStorage?: Storage }).localStorage?.setItem(key, on ? 'on' : 'off');
  } catch {
    // Sin almacenamiento: vale mientras la pagina este abierta.
  }
}
