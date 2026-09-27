import type { AuthApi } from '@kotaru/client';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { appleSignInAvailable, signInWithApple, SignInCancelled } from '../auth';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { radius, space } from '../theme';
import { Body, Button, Screen, Title } from '../ui/kit';

/**
 * Login. Solo Apple por ahora: Google necesita los client id de la consola de Google
 * (decision del propietario, ver README). La opcion de desarrollo aparece solo en builds
 * de desarrollo.
 */
export function SignIn({
  lang,
  auth,
  onSignedIn,
  onDevConnection,
}: {
  lang: Lang;
  auth: AuthApi;
  onSignedIn: () => void;
  onDevConnection: (() => void) | null;
}) {
  const s = t(lang);
  const [apple, setApple] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    appleSignInAvailable().then(setApple);
  }, []);

  const signIn = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signInWithApple(auth);
      onSignedIn();
    } catch (err) {
      if (!(err instanceof SignInCancelled)) setError(s.signInFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Title>{s.signInTitle}</Title>
      <View style={styles.block}>
        <Body>{s.signInBody}</Body>
      </View>
      {apple ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={radius.control}
          style={styles.apple}
          onPress={signIn}
        />
      ) : apple === false ? (
        <Body muted>{s.signInUnavailable}</Body>
      ) : null}
      {error ? (
        <View style={styles.block}>
          <Body muted>{error}</Body>
        </View>
      ) : null}
      {onDevConnection ? (
        <View style={styles.dev}>
          <Button label={s.useDevConnection} kind="quiet" onPress={onDevConnection} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: space.xl },
  apple: { height: 48, width: '100%' },
  dev: { marginTop: space.xxl },
});
