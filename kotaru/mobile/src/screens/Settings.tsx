import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createMemoryApi, type DevConnection } from '../connection';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { Body, Button, Card, Screen, Title } from '../ui/kit';

const RETENTION_CHOICES = [7, 30, 90, 365] as const;

export function Settings({
  lang,
  connection,
  onConnection,
}: {
  lang: Lang;
  connection: DevConnection | null;
  onConnection: (c: DevConnection) => void;
}) {
  const s = t(lang);
  const [days, setDays] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [draft, setDraft] = useState<DevConnection>(connection ?? { serverUrl: '', grant: '', accessToken: '' });

  useEffect(() => {
    if (!connection) return;
    createMemoryApi(connection).retentionDays().then(setDays, () => setDays(null));
  }, [connection]);

  const choose = async (d: number) => {
    if (!connection) return;
    try {
      setDays(await createMemoryApi(connection).setRetentionDays(d));
    } catch {
      setNote(s.error);
    }
  };

  const exportData = async () => {
    if (!connection) return;
    try {
      const data = await createMemoryApi(connection).exportAll();
      setNote(s.exported(Math.ceil(JSON.stringify(data).length / 1024)));
    } catch {
      setNote(s.error);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }}>
        <Title>{s.settingsTitle}</Title>
        {connection ? (
          <Card>
            <Text style={styles.label}>{s.retention}</Text>
            <View style={styles.choices}>
              {RETENTION_CHOICES.map((d) => (
                <Button key={d} label={s.days(d)} kind={days === d ? 'primary' : 'quiet'} onPress={() => choose(d)} />
              ))}
            </View>
            <View style={{ marginTop: space.l }}>
              <Button label={s.exportData} kind="quiet" onPress={exportData} />
            </View>
            {note ? <Body muted>{note}</Body> : null}
          </Card>
        ) : null}

        <Card>
          <Text style={styles.label}>{s.devConnection}</Text>
          {(
            [
              ['serverUrl', s.serverUrl],
              ['grant', s.grant],
              ['accessToken', s.accessToken],
            ] as const
          ).map(([field, label]) => (
            <TextInput
              key={field}
              accessibilityLabel={label}
              placeholder={label}
              placeholderTextColor={color.mist}
              autoCapitalize="none"
              autoCorrect={false}
              value={draft[field]}
              onChangeText={(v) => setDraft({ ...draft, [field]: v })}
              style={styles.input}
            />
          ))}
          <Button label={s.save} onPress={() => onConnection(draft)} disabled={!draft.serverUrl || !draft.grant || !draft.accessToken} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...type.support, color: color.mist, marginBottom: space.m },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  input: {
    ...type.support,
    color: color.cloud,
    borderWidth: 1,
    borderColor: color.inkLine,
    borderRadius: radius.control,
    padding: space.m,
    marginBottom: space.m,
  },
});
