import type { AuthApi } from '@kotaru/client';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppleButton, appleAvailable } from '../apple';
import { ApiError } from '@kotaru/client';
import { newRawNonce, signInWithApple, signInWithPasskey, SignInCancelled, signUpWithPasskey } from '../auth';
import { passkeysAvailable } from '../passkey';
import { GoogleButton, googleConfigured } from '../google';
import type { Lang } from '../i18n';
import { t } from '../i18n';
import { space } from '../theme';
import { Body, Button, Screen, Title } from '../ui/kit';

/**
 * Cuenta: passkey (sin terceros; primero porque no depende de ninguna cuenta externa),
 * Apple y Google, en el telefono y en la web (cada plataforma usa su modulo:
 * `passkey.*.ts`, `apple.*.tsx`, `google.*.tsx`). Apple y Google aparecen solo si la app se
 * compilo con su identificador. La opcion de desarrollo, solo en builds de desarrollo.
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
  const [passkeys, setPasskeys] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Un nonce por intento de Google: el boton web de Google lo necesita antes del clic.
  const [googleNonce, setGoogleNonce] = useState(newRawNonce);
  const google = googleConfigured();

  useEffect(() => {
    appleAvailable().then(setApple);
    passkeysAvailable().then(setPasskeys);
  }, []);

  const run = async (attempt: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await attempt();
      onSignedIn();
    } catch (err) {
      if (err instanceof SignInCancelled) return;
      setError(err instanceof ApiError && err.status === 409 ? s.passkeyExists : s.signInFailed);
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
      {passkeys ? (
        <View style={styles.buttons}>
          <Button label={s.passkeyCreate} onPress={() => run(() => signUpWithPasskey(auth))} disabled={busy} />
          <Button label={s.passkeySignIn} kind="quiet" onPress={() => run(() => signInWithPasskey(auth))} disabled={busy} />
          <Body muted>{s.passkeyHint}</Body>
        </View>
      ) : null}
      {passkeys && (apple || google) ? <Body muted>{s.orOther}</Body> : null}
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
      {apple === false && passkeys === false && !google ? <Body muted>{s.signInUnavailable}</Body> : null}
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
