import type { AuthApi } from '@kotaru/client';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppleButton, appleAvailable } from '../apple';
import { newRawNonce, signInWithApple, SignInCancelled } from '../auth';
import { GoogleButton, googleConfigured } from '../google';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { space } from '../theme';
import { Body, Button, Screen, Title } from '../ui/kit';

/**
 * Login con Apple y Google, en el telefono y en la web (cada plataforma usa su modulo:
 * `apple.*.tsx`, `google.*.tsx`). Cada boton aparece solo si la app se compilo con su
 * identificador. La opcion de desarrollo aparece solo en builds de desarrollo.
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
  // Un nonce por intento de Google: el boton web de Google lo necesita antes del clic.
  const [googleNonce, setGoogleNonce] = useState(newRawNonce);
  const google = googleConfigured();

  useEffect(() => {
    appleAvailable().then(setApple);
  }, []);

  const run = async (attempt: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await attempt();
      onSignedIn();
    } catch (err) {
      if (!(err instanceof SignInCancelled)) setError(s.signInFailed);
    } finally {
      setBusy(false);
    }
  };

  const withGoogle = (idToken: string) => {
    const nonce = googleNonce;
    setGoogleNonce(newRawNonce());
    void run(() => auth.signInWithGoogle(idToken, nonce));
  };

  return (
    <Screen>
      <Title>{s.signInTitle}</Title>
      <View style={styles.block}>
        <Body>{s.signInBody}</Body>
      </View>
      <View style={styles.buttons}>
        {apple ? <AppleButton label={s.signInApple} onPress={() => run(() => signInWithApple(auth))} disabled={busy} /> : null}
        {google ? (
          <GoogleButton
            nonce={googleNonce}
            onIdToken={withGoogle}
            onCancel={() => setGoogleNonce(newRawNonce())}
            onError={() => setError(s.signInFailed)}
            disabled={busy}
          />
        ) : null}
      </View>
      {apple === false && !google ? <Body muted>{s.signInUnavailable}</Body> : null}
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
  buttons: { gap: space.m, marginBottom: space.l },
  dev: { marginTop: space.xxl },
});
