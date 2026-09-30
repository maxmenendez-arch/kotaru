import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createMemoryApi, type Connection, type DevConnection } from '../connection';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { color, radius, space, type } from '../theme';
import { Body, Button, Card, Screen, Title } from '../ui/kit';
import type { AddressForm, VoiceChoice } from './Conversation';

const ADDRESS_FORMS: readonly AddressForm[] = ['masculine', 'feminine', 'neutral'];

const VOICE_CHOICES: readonly VoiceChoice[] = ['auto', 'gemini', 'chirp', 'cartesia'];
const RETENTION_CHOICES = [7, 30, 90, 365] as const;

export function Settings({
  lang,
  connection,
  onConnection,
  showDevConnection,
  voiceChoice = 'auto',
  onVoiceChoice,
  address = 'unset',
  onAddress,
  backgrounds = true,
  onBackgrounds,
}: {
  lang: Lang;
  connection: Connection | null;
  onConnection: (c: DevConnection) => void;
  /** En builds de produccion con servidor de cuentas no se ofrece la conexion manual. */
  showDevConnection: boolean;
  voiceChoice?: VoiceChoice;
  onVoiceChoice?: (choice: VoiceChoice) => void;
  address?: AddressForm;
  onAddress?: (form: AddressForm) => void;
  backgrounds?: boolean;
  onBackgrounds?: (on: boolean) => void;
}) {
  const s = t(lang);
  const [days, setDays] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [draft, setDraft] = useState<DevConnection>(
    connection?.kind === 'dev' ? connection : { kind: 'dev', serverUrl: '', grant: '', accessToken: '' },
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sensual, setSensual] = useState<boolean | null>(null);
  const [confirmSensual, setConfirmSensual] = useState(false);
  const [sensualNote, setSensualNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const account = connection?.kind === 'account' ? connection : null;

  // Al cerrar sesion o borrar la cuenta, `AuthApi` avisa y la app vuelve al login.
  const signOut = async () => {
    if (!account || busy) return;
    setBusy(true);
    await account.auth.signOut();
    setBusy(false);
  };

  const deleteAccount = async () => {
    if (!account || busy) return;
    setBusy(true);
    try {
      await account.auth.deleteAccount();
    } catch {
      setNote(s.error);
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!connection) return;
    createMemoryApi(connection).retentionDays().then(setDays, () => setDays(null));
    createMemoryApi(connection).sensualFlirting().then(setSensual, () => setSensual(null));
  }, [connection]);

  const changeSensual = async (on: boolean) => {
    if (!connection) return;
    try {
      setSensual(await createMemoryApi(connection).setSensualFlirting(on, on));
      setConfirmSensual(false);
      setSensualNote(s.sensualNextConversation);
    } catch {
      setSensualNote(s.error);
    }
  };

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

        {connection && sensual !== null ? (
          <Card>
            <Text style={styles.label}>{s.sensualTitle}</Text>
            <Body muted>{s.sensualBody}</Body>
            <Text style={styles.status} accessibilityLiveRegion="polite">
              {sensual ? s.sensualOn : s.sensualOff}
            </Text>
            {sensual ? (
              <Button label={s.sensualDisable} kind="quiet" onPress={() => changeSensual(false)} />
            ) : confirmSensual ? (
              <>
                <Body>{s.sensualConfirm}</Body>
                <View style={styles.choices}>
                  <Button label={s.sensualEnable} onPress={() => changeSensual(true)} />
                  <Button label={s.cancel} kind="quiet" onPress={() => setConfirmSensual(false)} />
                </View>
              </>
            ) : (
              <Button label={s.sensualEnable} kind="quiet" onPress={() => setConfirmSensual(true)} />
            )}
            {sensualNote ? <Body muted>{sensualNote}</Body> : null}
          </Card>
        ) : null}

        {onBackgrounds && Platform.OS === 'web' ? (
          <Card>
            <Text style={styles.label}>{s.backgroundsTitle}</Text>
            <Body muted>{s.backgroundsBody}</Body>
            <View style={styles.choices} accessibilityRole="radiogroup" accessibilityLabel={s.backgroundsTitle}>
              <Button label={s.backgroundsOn} kind={backgrounds ? 'primary' : 'quiet'} onPress={() => onBackgrounds(true)} />
              <Button label={s.backgroundsOff} kind={backgrounds ? 'quiet' : 'primary'} onPress={() => onBackgrounds(false)} />
            </View>
          </Card>
        ) : null}

        {onAddress ? (
          <Card>
            <Text style={styles.label}>{s.addressTitle}</Text>
            <Body muted>{s.addressBody}</Body>
            <View style={styles.choices} accessibilityRole="radiogroup" accessibilityLabel={s.addressTitle}>
              {ADDRESS_FORMS.map((f) => (
                <Button key={f} label={s.addressChoices[f]} kind={f === address ? 'primary' : 'quiet'} onPress={() => onAddress(address === f ? 'unset' : f)} />
              ))}
            </View>
          </Card>
        ) : null}

        {connection && onVoiceChoice ? (
          <Card>
            <Text style={styles.label}>{s.voiceTestTitle}</Text>
            <Body muted>{s.voiceTestBody}</Body>
            <View style={styles.choices} accessibilityRole="radiogroup" accessibilityLabel={s.voiceTestTitle}>
              {VOICE_CHOICES.map((c) => (
                <Button
                  key={c}
                  label={s.voiceChoices[c]}
                  kind={c === voiceChoice ? 'primary' : 'quiet'}
                  onPress={() => onVoiceChoice(c)}
                />
              ))}
            </View>
          </Card>
        ) : null}

        {account ? (
          <Card>
            <Text style={styles.label}>{s.account}</Text>
            <Button label={s.signOut} kind="quiet" onPress={signOut} disabled={busy} />
            <View style={{ marginTop: space.l }}>
              {confirmDelete ? (
                <>
                  <Body>{s.deleteWarning}</Body>
                  <View style={styles.choices}>
                    <Button label={s.deleteConfirm} kind="danger" onPress={deleteAccount} disabled={busy} />
                    <Button label={s.cancel} kind="quiet" onPress={() => setConfirmDelete(false)} disabled={busy} />
                  </View>
                </>
              ) : (
                <Button label={s.deleteAccount} kind="danger" onPress={() => setConfirmDelete(true)} disabled={busy} />
              )}
            </View>
          </Card>
        ) : null}

        {showDevConnection && !account ? (
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
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...type.support, color: color.mist, marginBottom: space.m },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  status: { ...type.body, color: color.cloud, fontWeight: '600', marginVertical: space.m },
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
