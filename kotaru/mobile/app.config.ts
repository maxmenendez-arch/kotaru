import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Configuracion dinamica encima de app.json.
 *
 * El login con Google solo se añade cuando existe el client id de iOS: su config plugin
 * necesita el esquema de URL (el client id al reves) y falla sin el. Los client id no son
 * secretos (van dentro de la app); se pasan como variables EXPO_PUBLIC_* al compilar.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const plugins = [...(config.plugins ?? [])];
  if (iosClientId) {
    plugins.push(['react-native-nitro-google-signin', { iosUrlScheme: reverseClientId(iosClientId) }]);
  }
  return { ...config, name: config.name ?? 'Kotaru', slug: config.slug ?? 'kotaru', plugins };
};

/** "123-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123-abc" */
export function reverseClientId(clientId: string): string {
  const suffix = '.apps.googleusercontent.com';
  if (!clientId.endsWith(suffix)) throw new Error(`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID no parece un client id de iOS: ${clientId}`);
  return `com.googleusercontent.apps.${clientId.slice(0, -suffix.length)}`;
}
