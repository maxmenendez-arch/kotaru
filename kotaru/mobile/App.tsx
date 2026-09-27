import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DevConnection } from './src/connection';
import type { Lang } from './src/i18n';
import { t } from './src/i18n';
import { Conversation } from './src/screens/Conversation';
import { Memories } from './src/screens/Memories';
import { Settings } from './src/screens/Settings';
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
  const [connection, setConnection] = useState<DevConnection | null>(null);
  const s = t(lang);

  if (!welcomed) {
    return (
      <>
        <StatusBar style="light" />
        <Welcome lang={lang} onLang={setLang} onDone={() => setWelcomed(true)} />
      </>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.body}>
        {tab === 'talk' ? <Conversation lang={lang} connection={connection} /> : null}
        {tab === 'memory' ? <Memories lang={lang} connection={connection} /> : null}
        {tab === 'settings' ? (
          <Settings
            lang={lang}
            connection={connection}
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
