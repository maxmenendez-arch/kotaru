# Kotaru — app móvil (esqueleto)

Expo SDK 57, React Native 0.86, TypeScript. Fuera de los workspaces del monorepo a
propósito: instalar el servidor no descarga React Native, y la app no arrastra
dependencias del servidor. Comparte con el monorepo solo `@kotaru/client`
(`../packages/client`), que no tiene dependencias en tiempo de ejecución.

## Qué hay

- **Bienvenida:** aviso de que Rio es una IA (no persona, no terapeuta, no llama a
  emergencias) y confirmación de 18+. No se puede saltar.
- **Hablar:** pulsar para hablar, estados con etiqueta de texto accesible (nunca solo color),
  subtítulos de lo que dijiste y de la respuesta, minutos restantes, paneles de reconexión,
  límite de plan y apoyo en crisis. Barge-in: pulsar mientras Rio habla corta su respuesta.
- **Memoria:** lo que Rio quiere recordar aparece como pregunta ("Me gustaría recordar…"),
  con Recordar / Ahora no; lo aprobado se puede fijar u olvidar.
- **Audio:** en iOS y Android, micrófono y altavoz reales con `react-native-audio-api`
  (`src/audio.native.ts`): PCM 16 bits a 24 kHz en trozos de 20 ms hacia el gateway, y
  reproducción en cola de lo que responde Rio. Una sola librería gobierna la sesión de audio
  (`playAndRecord` + `voiceChat`, con cancelación de eco en iOS). Pulsar mientras Rio habla
  lo corta al instante. No se guarda audio. En la web (`src/audio.web.ts`), micrófono del
  navegador con cancelación de eco (AudioWorklet servido desde `public/`) y reproducción con
  Web Audio.
- **Cuenta:** si la app se compila con `EXPO_PUBLIC_KOTARU_SERVER_URL`, tras la bienvenida
  pide crear cuenta o entrar con una **passkey** (web; en el teléfono falta el dominio
  asociado, que depende de las cuentas de Apple y de la firma de Android), o con Apple o
  Google, en iOS, Android y la web (`apple.*.tsx`,
  `google.*.tsx`; cada botón aparece solo si se compila con su identificador). El nonce se genera en el dispositivo; a Apple va su
  SHA-256 y al servidor el valor original. No se piden nombre ni correo. El token de
  renovación se guarda solo en Keychain/Keystore (`expo-secure-store`, solo este
  dispositivo); en la web, en `sessionStorage` (dura lo que la pestaña). Cada sesión de voz pide su propio grant y las
  reconexiones retoman la misma conversación.
- **Ajustes:** cuánto se guardan las conversaciones, descarga de datos, cerrar sesión y
  borrar la cuenta (con confirmación). La conexión de desarrollo (grant y token pegados a
  mano, de `bin/token.mjs`) solo aparece en builds de desarrollo o sin servidor de cuentas.
- Español e inglés; tokens de color y tipografía de `09_BRAND_AND_ART_DIRECTION.md`.

## Webapp

La misma app se publica en `https://app.kotaru.app` con `deploy/web.sh` (ver
`deploy/README.md`). Verificado el 2026-09-27 detrás de Caddy con su política de seguridad
real: micrófono falso de Chromium → 60 trozos de 20 ms enviados, respuesta de Rio con
subtítulos y audio, centro de memoria y descarga de datos, sin errores en la consola.

## Lo que falta (y por qué)

- **Probar en un teléfono.** El audio real y el login con Apple y Google necesitan un build
  de desarrollo (`npx expo run:ios` / `run:android` o EAS), no Expo Go, y aún no se han
  probado en un dispositivo.
- **Arte del personaje e identidad.** El retrato es un marcador abstracto y el icono es
  provisional (un anillo `iris` con un punto `pulse`, hecho con los tokens de marca) hasta
  tener arte original y la identidad visual encargada tras la búsqueda de marca.
- **Navegación.** Pestañas en estado local; con más pantallas conviene Expo Router.

## Probar

```bash
cd mobile
npm install
npx expo start          # Expo Go o simulador
npm run typecheck
npm test                # conversiones de PCM (node --test)
npm run build:web       # exporta la versión web a dist/
```

Con cuentas y audio real (build de desarrollo, no Expo Go):

```bash
export EXPO_PUBLIC_KOTARU_SERVER_URL=https://api.kotaru.app
export EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=....apps.googleusercontent.com   # opcional
export EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=....apps.googleusercontent.com   # opcional
npx expo run:ios        # o run:android
```

Ninguno de estos valores es secreto: van dentro de la app. Metro guarda en caché los
`EXPO_PUBLIC_*`: al cambiarlos, arranca con `--clear`. El plugin de Google solo se añade si
existe el client id de iOS (`app.config.ts`). Cómo obtener cada identificador:
`docs/PASOS_DEL_PROPIETARIO.md`.

Sin cuentas, para conectar con un gateway local: arráncalo con `KOTARU_CORS_ORIGINS` apuntando al origen
de la web (solo la versión web lo necesita), genera tokens con `bin/token.mjs` y pégalos en
Ajustes.

La versión web se verificó así de punta a punta el 2026-09-27 con Playwright contra el
gateway empaquetado y PostgreSQL real: bienvenida (el botón sigue deshabilitado hasta
confirmar 18+), conexión, un turno de voz simulado con subtítulos, aprobar un recuerdo y
cambiar la retención, sin errores en la consola.

El 2026-09-27 se verificó también en la web: con servidor de cuentas configurado aparece la
pantalla de cuenta (Apple no disponible fuera de iOS) y el build de producción no ofrece la
conexión de desarrollo; sin servidor, se entra directo como antes. El login real con Apple
queda por probar en un iPhone.
