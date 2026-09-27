# ADR-003 — Módulos nativos de audio y de login con Google

- Fecha: 2026-09-27
- Estado: accepted, pendiente de prueba en dispositivo

## Contexto

La app necesita tres cosas que el SDK base de Expo no cubre:

1. Captura del micrófono en streaming, en PCM, mientras se mantiene pulsado el botón.
2. Reproducción en cola de trozos de PCM según llegan del gateway, cortable al instante
   (barge-in).
3. Login con Google que meta en el id token un nonce elegido por la app. El servidor lo exige
   para que un token interceptado no abra otra sesión.

## Audio: opciones

| Criterio | expo-audio 57 (`useAudioStream`) | react-native-audio-api 0.13 (Software Mansion) |
|---|---|---|
| Captura PCM en streaming | sí (nuevo en SDK 57) | sí (`AudioRecorder.onAudioReady`) |
| Reproducir PCM en cola | no (solo archivos o URL) | sí (`AudioBufferQueueSourceNode`) |
| Sesión de audio de iOS | la fija en `record` + `measurement` al capturar | configurable: `playAndRecord` + `voiceChat` |
| Cancelación de eco | no (`measurement` la desactiva) | sí, con `voiceChat` |
| Expo Go | sí | no (build de desarrollo) |
| Licencia | MIT | MIT |

## Decisión (audio)

**react-native-audio-api para captura y reproducción.** Con dos librerías, cada una
reconfigura a su manera la sesión de audio de iOS y se pisan: expo-audio la cambia a
`record` al capturar, lo que corta la reproducción y quita la cancelación de eco. Una sola
librería con `playAndRecord` + `voiceChat` evita ese conflicto.

Config plugin sin modo de audio en segundo plano ni servicio en primer plano de Android (Kotaru
no habla con la pantalla apagada) y sin FFmpeg (solo se reproduce PCM).

La app sube PCM 16 bits a 24 kHz: unos 48 KB/s mientras se habla. ADR-002 preveía Opus; queda
como mejora si el consumo de datos móviles resulta un problema. Pide codificar en el cliente
y decodificar en el gateway antes del STT.

## Login con Google: opciones

| Criterio | @react-native-google-signin (versión gratuita) | la misma, versión Universal (de pago) | react-native-nitro-google-signin 2.3 | expo-auth-session |
|---|---|---|---|---|
| Nonce propio | no | sí | sí (iOS: GIDSignIn; Android: Credential Manager) | sí |
| Flujo nativo | sí | sí | sí | navegador (Google desaconseja los esquemas propios en Android) |
| Madurez | alta | alta | baja: publicada en junio de 2026 | en desuso para Google |
| Costo | gratis | suscripción | gratis, MIT | gratis |

## Decisión (Google)

**react-native-nitro-google-signin, con la versión fijada (2.3.0 exacta).** Es la única
opción gratuita con flujo nativo y nonce en las dos plataformas. El riesgo es su juventud:
por eso queda aislada en `mobile/src/google.native.tsx` (una función `googleIdToken(nonce)` y
un botón), y cambiarla por la versión Universal de @react-native-google-signin toca solo ese
archivo. Revisar cada actualización antes de subir la versión, porque está en el camino de
autenticación.

El token de Google en Android lleva como audiencia el client id **web**, y en iOS el de
**iOS**: el servidor acepta los dos (`KOTARU_GOOGLE_CLIENT_IDS`).

## Consecuencias

- La app ya no corre en Expo Go: hace falta un build de desarrollo o EAS.
- Nada de esto se ha probado aún en un teléfono. La web conserva el micrófono simulado.
