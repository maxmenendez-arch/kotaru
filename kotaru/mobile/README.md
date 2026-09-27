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
- **Cuenta:** si la app se compila con `EXPO_PUBLIC_KOTARU_SERVER_URL`, tras la bienvenida
  pide entrar con Apple (iPhone/iPad). El nonce se genera en el dispositivo; a Apple va su
  SHA-256 y al servidor el valor original. No se piden nombre ni correo. El token de
  renovación se guarda solo en Keychain/Keystore (`expo-secure-store`, solo este
  dispositivo); en la web no se guarda. Cada sesión de voz pide su propio grant y las
  reconexiones retoman la misma conversación.
- **Ajustes:** cuánto se guardan las conversaciones, descarga de datos, cerrar sesión y
  borrar la cuenta (con confirmación). La conexión de desarrollo (grant y token pegados a
  mano, de `bin/token.mjs`) solo aparece en builds de desarrollo o sin servidor de cuentas.
- Español e inglés; tokens de color y tipografía de `09_BRAND_AND_ART_DIRECTION.md`.

## Lo que falta (y por qué)

- **Audio real.** El micrófono y el altavoz están detrás de interfaces (`src/audio.ts`) con
  implementaciones simuladas: el micrófono envía silencio y el altavoz no suena. El SDK
  base de Expo no captura PCM en streaming (expo-audio graba a archivo), así que hace falta
  un módulo nativo con config plugin. **Decisión pendiente:** elegir ese módulo y probarlo
  en un dispositivo real. Todo el camino de red ya funciona con el simulado.
- **Login con Google.** Falta el módulo de Google Sign-In y los client id de la consola
  de Google (decisión del propietario). El servidor ya lo acepta (`/v1/auth/google`).
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
npm run build:web       # exporta la versión web a dist/
```

Con cuentas: `EXPO_PUBLIC_KOTARU_SERVER_URL=https://api.ejemplo npx expo start --clear`
(`--clear` porque Metro guarda en caché el valor anterior). El login con Apple necesita un
build de desarrollo en iOS (`npx expo run:ios`), no Expo Go, y que el gateway tenga
configurado el client id de Apple (el bundle id `app.kotaru.mobile`).

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
