import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ApiError, type MemoryList, type MemoryView } from '@kotaru/client';
import { createMemoryApi, type DevConnection } from '../connection';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, space, type } from '../theme';
import { Body, Button, Card, Screen, Title } from '../ui/kit';

/**
 * Centro de memoria (05_UX): todo lo que el companion recuerda, visible y bajo control
 * del usuario. Lo propuesto se presenta como una pregunta ("Me gustaria recordar…"),
 * nunca como un hecho consumado.
 */
export function Memories({ lang, connection }: { lang: Lang; connection: DevConnection | null }) {
  const s = t(lang);
  const [data, setData] = useState<MemoryList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!connection) return;
    try {
      setData(await createMemoryApi(connection).list('rio'));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.code : s.error);
    }
  }, [connection, s.error]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError && err.code === 'at_capacity' ? s.atCapacity : err instanceof ApiError ? err.code : s.error);
    }
  };

  if (!connection) {
    return (
      <Screen>
        <Title>{s.memoryTitle}</Title>
        <Body muted>{s.notConnected}</Body>
      </Screen>
    );
  }

  const api = createMemoryApi(connection);
  const proposed = data?.memories.filter((m) => m.status === 'proposed') ?? [];
  const kept = data?.memories.filter((m) => m.status === 'approved') ?? [];

  const row = (m: MemoryView) => (
    <Card key={m.id}>
      <Body>{m.text}</Body>
      <View style={styles.actions}>
        {m.status === 'proposed' ? (
          <>
            <Button label={s.approve} onPress={() => act(() => api.approve(m.id))} />
            <Button label={s.notNow} kind="quiet" onPress={() => act(() => api.reject(m.id))} />
          </>
        ) : (
          <>
            <Button label={m.pinned ? s.unpin : s.pin} kind="quiet" onPress={() => act(() => api.update(m.id, { pinned: !m.pinned }))} />
            <Button label={s.forget} kind="danger" onPress={() => act(() => api.forget(m.id))} />
          </>
        )}
      </View>
    </Card>
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <Title>{s.memoryTitle}</Title>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {data && data.memories.length === 0 ? <Body muted>{s.memoryEmpty}</Body> : null}
        {proposed.length > 0 ? <Text style={styles.section}>{s.wouldLike}</Text> : null}
        {proposed.map(row)}
        {kept.map(row)}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: space.s, marginTop: space.m },
  section: { ...type.support, color: color.mist, marginBottom: space.s },
  error: { ...type.support, color: color.danger, marginBottom: space.m },
});
