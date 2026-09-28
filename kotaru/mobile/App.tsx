import { StatusBar } from 'expo-status-bar';
import type { AuthApi } from '@kotaru/client';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { openAccount, SERVER_URL } from './src/auth';
import type { Connection } from './src/connection';
import type { Lang } from './src/i18n';
import { t } from './src/i18n';
import { Conversation, type VoiceChoice } from './src/screens/Conversation';
import { Memories } from './src/screens/Memories';
import { Settings } from './src/screens/Settings';
import { SignIn } from './src/screens/SignIn';
import { Welcome } from './src/screens/Welcome';
import { color, space, type } from './src/theme';

type Tab = 'talk' | 'memory' | 'settings';

/**
 * Esqueleto de la app. Navegacion minima por pestañas en estado local: cuando haya mas
 * de tres pantallas conviene pasar a Expo Router (recomendado por la guia de Expo del
 * proyecto, AGENTS.md).
 */
export default function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [welcomed, setWelcomed] = useState(false);
  const [tab, setTab] = useState<Tab>('talk');
  const [connection, setConnection] = useState<Connection | null>(null);
  // Voz elegida en Ajustes para probar (se olvida al recargar: es para comparar, no una preferencia).
  const [voiceChoice, setVoiceChoice] = useState<VoiceChoice>('auto');
  // Con servidor de cuentas configurado: 'loading' hasta leer la sesion guardada,
  // 'signin' si no la hay, 'app' dentro. Sin servidor se entra directo (desarrollo).
  const [gate, setGate] = useState<'loading' | 'signin' | 'app'>(SERVER_URL ? 'loading' : 'app');
  const [auth, setAuth] = useState<AuthApi | null>(null);
  const s = t(lang);
  const showDevConnection = __DEV__ || !SERVER_URL;

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
        {tab === 'talk' ? <Conversation lang={lang} connection={connection} voiceChoice={voiceChoice} /> : null}
        {tab === 'memory' ? <Memories lang={lang} connection={connection} /> : null}
        {tab === 'settings' ? (
          <Settings
            lang={lang}
            connection={connection}
            showDevConnection={showDevConnection}
            voiceChoice={voiceChoice}
            onVoiceChoice={setVoiceChoice}
            onConnection={(c) => {
              setConnection(c);
              setTab('talk');
            }}
          />
        ) : null}
      </View>
      <View style={styles.tabs} accessibilityRole="tablist">
        {(
          [
            ['talk', s.tabTalk],
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
});
