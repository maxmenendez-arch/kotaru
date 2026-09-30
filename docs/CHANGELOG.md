# CHANGELOG.md — Kotaru

Formato: fecha, fase, qué cambió, archivos afectados, cómo se verificó.

## 2026-09-30 — Reacciones al momento a lo que se le dice al personaje

- **`mobile/src/reactions.ts`:** clasifica el tono de lo que la persona dijo o escribió, en el dispositivo, por palabras en español e inglés, sin llamar a nadie ni guardar nada.
  - Tonos: amor, intriga, expectativa, alegría, ternura (algo triste o difícil) y atención.
  - Cada tono lleva su reacción: cara, gesto y partículas.
  - **Siempre positivas:**
    - ante algo triste, ternura y atención, sin partículas;
    - lo difícil gana sobre el resto («estoy triste, te quiero» → ternura);
    - corazones solo en coqueteo (Nova y Rio en Coqueteo o «Tú decides»); Luna y el modo Amigo responden al cariño con destellos cálidos.
- **Cuándo:** en cuanto llega la transcripción final de lo que se dijo (o al enviar un texto), antes de la respuesta. La emoción de la respuesta llega después y la sustituye.
- **`ui/reaction-burst.web.tsx`:** 12 partículas (corazones, destellos o estrellas) que suben y se desvanecen alrededor del personaje durante unos 2 s. Son SVG propios con animación CSS, no bloquean toques y se ocultan con «reducir movimiento». En nativo, solo la cara.
- **Verificación:** `mobile` con 71 pruebas (4 nuevas: tonos es/en, que lo difícil gana, siempre positivas y corazones solo en coqueteo); captura de las tres partículas.

## 2026-09-30 — Volumen estable en iPhone, «hola» natural, brazos visibles, viento en el pelo y enfoque de retrato

- **Volumen a la mitad cuando habla el personaje** (el dueño lo notó dos veces):
  - Causa: Safari en iPhone cambia el modo de audio al abrir y cerrar el micrófono. Con el micro abierto suena en modo llamada y al cerrarlo vuelve al modo normal, con otro volumen; y todo (voz y fondo) bajaba justo al hablar el personaje.
  - Arreglo: `call-audio.web.ts` fija `navigator.audioSession.type = 'play-and-record'` mientras la conversación está en pantalla (Safari 17+; en otros navegadores no hace nada) y lo devuelve a `auto` al salir. No abre el micrófono.
- **«Hola» que sonaba raro:**
  - Causa: cada oración se sintetizaba aparte, y una muy corta («¡Hola!») salía con entonación de palabra suelta.
  - Arreglo: `SentenceBuffer` une las oraciones de menos de 24 caracteres a la siguiente (`minChars`). Los cortes de emergencia por longitud siguen yendo solos.
  - Pruebas: 2 nuevas; el costo de TTS de una prueba pasa de 24 a 25 caracteres por el espacio de la unión.
- **Gestos con el brazo visible:**
  - Luna, mano al pecho: el antebrazo quedaba escondido dentro de la manga de su chaqueta y la mano parecía suelta. Ahora el codo va adelante y la mano cruza en diagonal.
  - Nova, barbilla: con la pose buscada en el modelo de Rio, en Nova la mano le tapaba la cara. Ahora es un dedo en la barbilla.
  - Ambas poses se buscaron con un plano fijo (`pose.cjs`, sin depender del tiempo del short).
- **Viento en el pelo** (`hair-wind.ts`): rachas que empujan la gravedad de los spring bones; fuertes en Rio (aire libre), suaves en Luna (ventana) y casi nada en Nova (cuarto).
- **Enfoque de retrato** (`StagePost.setFocus`): cuanto más cerca la cámara, más desenfocado el fondo (primeros planos del short).
- **Verificación:** `mobile`, 67; `vitest`, 475; `tsc --build`; `lint:arch`; capturas de las poses y del desenfoque.

## 2026-09-30 — Luna habla con Chirp (Despina) por defecto: tono femenino estable

- **La medición con `deploy/voz-tono.py`** (8 frases, mediana de F0):
  - Despina en Gemini variaba de 160 a 222 Hz incluso pidiéndole «tono medio-agudo, nunca grave»: 7 de 8 tomas bajaban por momentos;
  - en Chirp se mantuvo entre 190 y 216 Hz.
- **Cambio:** con `KOTARU_COMPANION_VOICE` cada personaje tiene su voz preferida cuando la persona no elige una en Ajustes. Por defecto, `luna:chirp`, así que Luna usa Chirp primero y Gemini queda de respaldo.
  - Nova y Rio siguen con Gemini primero (actúan mejor ahí).
  - La voz elegida en Ajustes manda sobre esta preferencia.
- **Pruebas:** gateway con 108 (2 nuevas: el parser y que el turno de Luna pide Chirp).

## 2026-09-30 — Volumen: la voz del personaje por encima del sonido del lugar

- **Qué notó el dueño:** al tocar para hablar, el volumen subía «a como debería», y cuando hablaba el personaje se oía bajo.
- **Causa:** el sonido del lugar sonaba alto mientras la persona hablaba y bajaba al 15 % cuando hablaba el personaje. Por contraste, la voz parecía baja. Además, la voz entraba al limitador sin margen.
- **Arreglo:**
  - El lugar suena bajo y casi constante (volumen 0,22 y, mientras habla el personaje, 55 %; antes 0,45 y 15 %).
  - La voz del personaje sube ≈ +4 dB antes del limitador (`VOICE_GAIN`, `audio.web.ts`); el medidor de la boca no cambia.
  - `EngineOptions.duckLevel` permite cuánto baja cada sonido.
- **Medido en Chromium** (lluvia y coches de Nova con una voz de prueba normalizada como la de TTS):
  - fondo mientras la persona habla: −26,7 dB antes, −32,7 dB ahora;
  - mezcla con el personaje hablando: −13,5 dB antes, −12,5 dB ahora;
  - diferencia entre la voz y el fondo: 13 dB antes, 20 dB ahora.

## 2026-09-30 — Voces: Nova Sulafat, Luna Despina (siempre femenina); saludo con risa en los shorts

- **Voces elegidas por el dueño:** Nova «Sulafat» y Luna «Despina», en Gemini y en Chirp (`apps/gateway/src/voices.ts`). En el servidor hay que cambiar también `KOTARU_GEMINI_VOICES`, que manda sobre el código.
- **Luna nunca grave:**
  - `deploy/voz-tono.py` genera 8 frases distintas con la voz y el estilo del personaje (Gemini y Chirp) y mide el tono (F0 por autocorrelación, validado con tonos sintéticos).
  - Primera medición de Despina: medianas de 160 a 216 Hz, con 3 tomas de 16 que bajaban (dos de Gemini a 160–167 Hz).
  - Cambio: la instrucción de lectura de Luna pide «tono medio-agudo y luminoso, nunca grave ni ronco, sin bajar la voz al final de las frases» (persona luna 2.0.3).
- **Saludo en los shorts** (pantalla de elegir): un saludo corto con risa natural en la voz de cada personaje, en español e inglés.
  - Se genera una vez en el servidor con Gemini (`deploy/intro-voces.py`) y se guarda en `/var/lib/kotaru/intro`; `deploy/web.sh` lo publica en `/intro/`.
  - En la app suena una vez por personaje, en el primer plano en que habla. La boca sigue la voz real y la música baja mientras habla (`intro-voice.web.ts`; en nativo, nada).
  - Sin gemidos ni nada sexual: es la primera impresión de la app.
- **Verificación:** `mobile`, 66 pruebas; gateway y persona, 131; `tsc --build`; `lint:arch`.

## 2026-09-30 — Gestos de brazo: mano al pecho (Luna), mano en la barbilla (Nova), señalar el horizonte (Rio)

- `idle-body.ts`: el saludo pasa a ser un caso de `ARM_POSES` (`wave`, `point`, `chin`, `chest`), rotaciones absolutas del brazo derecho, en espejo para el izquierdo. Se mezclan con suavidad sobre el movimiento normal.
- Poses buscadas con capturas (`arm.cjs`, varias rondas):
  - Rio señala con la izquierda, hacia donde mira, en diagonal hacia arriba;
  - Nova se lleva la izquierda a la barbilla (la derecha sigue en la cadera);
  - Luna se lleva la derecha al pecho.
- **Short:** Luna, mano al pecho mientras habla; Nova, mano en la barbilla mirando hacia otro lado; Rio, señala el paisaje en el primer plano.
- **Conversación:** los gestos del servidor ya mueven el brazo. `small_wave` saluda, `think_pose` lleva la mano a la barbilla y `point_up` señala; duran unos 2 s (`armForGesture`, `armEnvelope`).
- **Verificación:** `mobile`, 66 pruebas (2 nuevas); `vitest`, 470; `tsc --build`; `lint:arch`.

## 2026-09-30 — Sonido: música en los shorts y ambiente de cada lugar en la conversación

- **`mobile/src/scene-sounds.ts`:** todo sintetizado con Web Audio, sin archivos ni licencias.
  - **Ambiente de cada lugar:**
    - oficina de Luna: tono de sala, brisa y pájaros tras la ventana;
    - cuarto de Nova: lluvia contra el cristal, rumor de ciudad y coches por el asfalto mojado;
    - claro de Rio: fogata, dos grillos y el lago.
  - **Música original de cada short:**
    - Luna: lo-fi lento, sin batería;
    - Nova: R&B nocturno, con bombo suave y charles;
    - Rio: arpegio de guitarra alegre con shaker.
    - Acordes y ritmos genéricos, con eco suave.
- **Motor:** `ambient-engine.ts` pasa a `EngineSound<K>` (un sonido a la vez, fundidos, volumen y `duck`). `EngineAmbient` queda como caso particular. Las fábricas `createSoundscape` existen para web y nativo.
- **Conversación:**
  - el lugar suena bajo, siempre de fondo, y baja más cuando habla el personaje;
  - queda a la mitad si hay un sonido relajante elegido;
  - se para al ir a otra pantalla (`active`);
  - interruptor «Sonido del lugar» en el panel de sonidos, guardado en `kotaru.placeSound`;
  - los navegadores solo dejan sonar tras un toque, así que arranca con el primero.
- **Elegir personaje:** música y lugar del personaje (el lugar más bajo), botón de altavoz para silenciar (`kotaru.reelSound`); al elegir, la música se va y el lugar lo retoma la conversación.
- **Verificación:**
  - `mobile`: 64 pruebas (2 nuevas); `vitest`: 470; `tsc --build`; `lint:arch`.
  - Grabación de 20 s de cada sonido en Chromium: nivel, picos sin saturar, sin silencios y sin NaN; espectrogramas.
  - En la app, el audio arranca con el primer toque y el botón de silencio se guarda.

## 2026-09-30 — Acabado por personaje: ojos con brillo, pelo con volumen, contraluz del escenario

- **`mobile/src/looks.ts` (puro) y `avatar-look.ts`:** acabado sobre los materiales MToon de VRoid, sin tocar los modelos.
  - Luz de borde del color del escenario (antes, gris para todos): azul suave en Luna, rosa en Nova, naranja en Rio.
  - Pelo con menos brillo propio: los presets de VRoid lo traen casi autoiluminado y se veía plano.
  - Sombra de la piel más cálida.
- **Brillo en los ojos de Luna.** Su modelo no trae capa de brillo (Nova y Rio sí).
  - Dos puntos de borde suave por ojo, colocados midiendo el iris en su geometría: en VRoid el hueso del ojo no está donde se dibuja el iris.
  - Van pegados al hueso del ojo, así siguen la mirada.
  - Se apagan al parpadear o al cerrar los ojos al sonreír.
  - Dos arreglos: se dibujan después de las capas del ojo (VRoid las pinta como transparentes) y sin recorte de cámara (por su tamaño, three.js los descartaba).
- **Comparar:** `?look=0` apaga el acabado.
- **Verificación:**
  - `mobile`: 62 pruebas (3 nuevas en `test/looks.test.ts`); `vitest`: 470; `tsc --build`; `lint:arch`.
  - Capturas antes y después de los tres en su escenario, y primer plano de los ojos de Luna.

## 2026-09-29 — Elegir personaje, como un perfil con su short en 3D

- **Short en vivo** (`mobile/src/reel.ts`): cada personaje tiene un guion de ~14 s con cortes.
  - Planos: ojos, cara, busto, cintura y cuerpo entero, con movimientos lentos de cámara.
  - Lo que hace en cada plano: habla, emoción, gesto, mirar a otro lado y saludar con la mano.
  - Se dibuja con el modelo real en su escenario: no hay videos que grabar ni pagar.
  - Luna: planos lentos y casi de frente. Nova: ángulos bajos y laterales, sonrisa. Rio: cuerpo entero mirando el paisaje, risa y saludo.
- **Saludo con la mano** (`idle-body.ts`, `WAVE_POSE`): pose buscada con capturas; codo abajo y mano junto a la cabeza.
- **Pantalla de elegir nueva** (`screens/Characters.tsx`), con diseño y textos propios:
  - El short a pantalla completa, etiquetas de intereses, el nombre con el botón «Elegir» y dos líneas de carácter.
  - Al deslizar hacia arriba, el perfil: preguntas, dato curioso, lo que le gusta y lo que no, su frase y lo esencial (que es una IA, qué ofrece y sus límites).
  - Abajo, las caras para cambiar de personaje (retratos sacados de sus modelos 3D: `public/avatars/*-face.png`).
  - Al elegir, una transición de «Conectando…». Hay botón para volver a la conversación y se puede cambiar de personaje con las flechas del teclado.
  - En el ordenador, el short queda vertical en el centro, con el color del personaje alrededor.
- **Verificación:**
  - `mobile`: 59 pruebas (8 nuevas en `test/reel.test.ts`: duración, planos, cámara sin saltos, voz simulada y perfiles completos en es/en); `vitest`: 470; `tsc --build`; `lint:arch`.
  - Capturas en navegador sin GPU (teléfono 390×844 y ordenador 1280×800).
  - La transición se comprobó por DOM: «Conectando con Rio…» se ve durante 1,1 s.

## 2026-09-29 — Avatar: el cuerpo acompaña la emoción y los gestos

- La emoción del turno cambia la amplitud del cuerpo: alegre o juguetona, gestos y brazos más amplios (Rio lo nota más); preocupada o pensativa, más recogidos. Cambia poco a poco y vuelve a neutro cuando la emoción se desvanece.
- Los gestos que marca el modelo ya no mueven solo la cabeza: encoger hombros sube los hombros, reír da pequeños saltos del torso, acercarse inclina el pecho.
- Verificación: `mobile` 51 pruebas (2 nuevas: `bodyGestureOffset`, `emotionEnergy`), `vitest` 470, `tsc --build`, `lint:arch`.

## 2026-09-17 — Fase 0: Blueprint

**Qué cambió**
- Blueprint completo de Fase 0 entregado como documento vivo: resumen ejecutivo, supuestos,
  arquitectura, modelo de datos, contratos de proveedor, árbol de monorepo, ADR-001 y ADR-002,
  threat model, modelo de costos, presupuesto bootstrap, plan de sprints y dirección de arte.
- Respondidas las cinco preguntas bloqueantes del fundador. Registradas como D-001 a D-005.
- Recomendación de entidad contratante: Estados Unidos, entidad separada. Pendiente de asesor fiscal.
- Hallazgo de economía: las asignaciones de horas publicadas solo sobreviven cerca del extremo bajo
  de la banda de tarifas. Documentado en COST_MODEL.md.

**Archivos creados**
- `docs/DECISIONS.md`
- `docs/COST_MODEL.md`
- `docs/CHANGELOG.md`
- `docs/adr/ADR-001-avatar.md`
- `docs/adr/ADR-002-realtime-transport.md`

**Cómo se verificó**
- Los once documentos de conocimiento del proyecto fueron leídos antes de decidir.
- Cada número del modelo de costos se deriva de variables explícitas y es recalculable.
- Ningún endpoint, ID de modelo ni precio de proveedor fue inventado.

**Riesgos abiertos**
- R-01 margen en p95, R-02 derechos comerciales de audio, R-03 revisión de tienda,
  R-04 conflicto de marca. Registro completo en el blueprint.

**Siguiente**
- Sprint 0: decidir entidad, verificar precios oficiales, spike de avatar, limpieza de marca.

## 2026-09-17 (segunda entrada) — Sprint 0: verificacion

**Que cambio**
- D-001 cerrada: entidad en Estados Unidos.
- Verificacion de precios y terminos en documentacion oficial de nueve proveedores.
- Criterio de salida "dos rutas viables por capacidad critica": CUMPLIDO.
- Volcengine/Doubao descartado: EE. UU. no figura en su lista de disponibilidad ni en
  su tabla de metodos de pago.
- Alibaba Model Studio marcado UNVERIFIABLE: no publica precios de voz.
- Tesis refutada: MiniMax TTS cuesta 60 USD por millon de caracteres, cuatro veces
  Amazon Polly Neural. Los proveedores chinos no son mas baratos donde importa.
- Modelo de costos recalculado con tarifas reales: 0.52 USD/hora en la ruta de lanzamiento.
- Comision de tienda corregida de 30% a 15% (programas para pequenos negocios).
- Asignaciones de horas recortadas: Always de 35–50 h a 20 h.
- Limpieza de marca: el nombre de trabajo anterior quedo en rojo tras el despeje.
  Dos respaldos propuestos.

**Archivos creados o modificados**
- `docs/PROVIDER_REGISTRY.yaml` (nuevo)
- `docs/COST_MODEL.md` (parte verificada anadida)
- `docs/DECISIONS.md` (D-001 cerrada; D-006, D-007, D-008, ADR-005 anadidas)
- `docs/CHANGELOG.md`

**Como se verifico**
- Cada cifra procede de una pagina oficial abierta el 17 de septiembre de 2026, con URL
  registrada en el registro de proveedores.
- Lo que no se pudo verificar quedo marcado NO ENCONTRADO o UNKNOWN, nunca estimado.

**Riesgos abiertos**
- Azure sin cotizar. Deepgram con tarifas promocionales. Gemini Flash sube de precio
  el 1 de enero de 2027. Oferta real de horas de los competidores sin verificar.

**Siguiente**
- Decidir el nombre. Registrar dominios. Medir caracteres por segundo en espanol e ingles.
- Spike de avatar en dispositivos reales.

## 2026-09-17 (tercera entrada) — Tres preguntas del fundador

**Que cambio**
- D-009: entidad panamena evaluada y descartada. No desbloquea ningun proveedor chino y
  anade retencion del 30% sin tratado, ausencia de Stripe, banca presencial y lista
  fiscal de la UE.
- D-010: no se renuncia al espanol. El ahorro verificado de ir solo en ingles es 4.6%.
  Ningun proveedor cobra por idioma en TTS.
- D-011: identificado el escalon que si abarata — Kokoro-82M via Together AI a 4 USD/M
  de caracteres, 0.23 USD/hora, 55% menos, manteniendo espanol. Bloqueado por prueba
  de calidad ciega.
- D-006 actualizada: `AI Listener` en rojo (app homonima viva, descriptivo e
  irregistrable, senaliza salud mental). `Ainion` en ambar. Recomendado **Kotaru**.

**Archivos modificados**
- `docs/DECISIONS.md`, `docs/COST_MODEL.md`, `docs/PROVIDER_REGISTRY.yaml`, `docs/CHANGELOG.md`

**Siguiente**
- Prueba A/B ciega de Kokoro contra Polly Neural. Es el trabajo que mas dinero mueve.
- Verificar si Kokoro soporta streaming de baja latencia.
- Decidir el nombre y reservar dominios.

## 2026-09-17 (cuarta entrada) — Nombre cerrado y Sprint 1 iniciado

**Que cambio**
- D-006 cerrada: el producto se llama **Kotaru**.
- D-012: monorepo creado y verificado en `kotaru/`.

**Archivos creados**
- `kotaru/` — raiz del monorepo: package.json con workspaces, tsconfig base y de proyecto,
  vitest.config.ts, .env.example, .gitignore, README.md
- `kotaru/packages/ai-contracts/` — context.ts, affect.ts, providers.ts, router.ts, index.ts
- `kotaru/packages/ai-adapters-mock/` — rate-cards.ts, providers.ts + 16 pruebas
- `kotaru/packages/ai-router/` — router.ts + 15 pruebas
- `kotaru/packages/telemetry/` — events.ts + 6 pruebas
- `kotaru/tools/check-architecture.mjs` — lint que falla el build si se rompe la regla
  de dependencias

**Como se verifico**
```
npm install      # 51 paquetes
npm run typecheck   # tsc --build --force, modo estricto, exit 0
npm test            # 37 pruebas, 3 archivos, todas en verde
npm run lint:arch   # OK
```

**Defecto corregido**
- El nivel `premium` del router elegia la ruta economica. Lo encontro una prueba, no una
  revision. Corregido reescalando dos pesos en vez de uno.

**Riesgos abiertos**
- Sigue pendiente la prueba de calidad ciega de Kokoro contra Polly Neural (D-011): es lo
  que decide si Always lleva 20 horas o 50.
- Reservar kotaru.app, kotaru.ai y getkotaru.com.
- Clearance search profesional del nombre con un abogado de marcas.

**Siguiente**
- Gateway WebSocket con grants firmados de vida corta.
- Captura y reproduccion push-to-talk en un development build de Expo.
- Primer adaptador real detras de variable de entorno.

## 2026-09-17 (quinta entrada) — Control de versiones y limpieza de nombre

**Que cambio**
- Repositorio git unico en la raiz del proyecto: `docs/` y el codigo se versionan juntos.
  El commit de Sprint 1 que ya existia dentro de `kotaru/` se conservo; git reconocio los
  32 archivos como renombrados, no como borrados y recreados.
- El nombre anterior desaparecio de toda la documentacion: docs locales, los once
  documentos del proyecto en claude.ai, el espejo local de esos documentos y el
  documento de Fase 0 (18 menciones reescritas).
- Las menciones historicas se conservaron como razonamiento sin repetir la grafia
  descartada. Importa que quede registrado POR QUE se rechazo, o alguien lo vuelve a
  proponer en seis meses.
- Carpetas renombradas: `Kotaru_Claude_Project/` y `Kotaru_Claude_Project_original.zip`.
  El .zip conserva su contenido original congelado: es el paquete tal como se subio.

**Verificacion**
- Busqueda insensible a mayusculas del nombre anterior en todo el arbol, excluyendo
  node_modules y el .zip original: cero resultados.
- Busqueda del nombre anterior dentro del documento de Fase 0: cero resultados.
- 37 pruebas en verde despues de mover el repositorio.

**Pendiente**
- La carpeta raiz sigue llamandose con el nombre anterior. Renombrarla rompe el enlace
  de la sesion, asi que se hace con la sesion cerrada y luego se reconecta.
- La descripcion del proyecto en claude.ai todavia menciona que se usarian soluciones
  chinas de menor costo. Esa hipotesis quedo refutada el 17 de septiembre (D-010).

## 2026-09-17 (sexta entrada) — Sprint 2: orquestador y gateway

**Que cambio**
- `@kotaru/orchestrator`: ciclo completo del turno con generacion y sintesis en
  paralelo, fallback de proveedor, cancelacion, corte de seguridad ante senal de
  crisis y metrica de costo por turno.
- `@kotaru/gateway`: grants de sesion firmados con HMAC-SHA256, de vida corta, con
  audiencia, proteccion de reuso y rotacion de claves; protocolo de mensajes de
  control y politica de backpressure.

**Archivos creados**
- `kotaru/packages/orchestrator/` — queue.ts, sentences.ts, events.ts, turn.ts + 10 pruebas
- `kotaru/packages/gateway/` — grants.ts, protocol.ts + 10 pruebas

**Como se verifico**
```
npm run typecheck   # exit 0
npm test            # 57 pruebas, 6 archivos, todas en verde
npm run lint:arch   # OK
```

**Defecto corregido**
- El buffer de oraciones cortaba en un terminador al final del buffer. Lo encontro una
  prueba que yo mismo habia escrito esperando el comportamiento correcto. Con los
  tokens "3", "." y "5" habria mandado "3." al TTS.

**Riesgos abiertos**
- El ReplayGuard es en memoria: con varias instancias de gateway debe ir a Redis.
- Sigue pendiente la prueba de calidad ciega de Kokoro contra Polly (D-011).

## 2026-09-17 (septima entrada) — Economia y control de gasto

**Que cambio**
- `@kotaru/billing`: catalogo de planes con las asignaciones de D-008, modelo de margen,
  medidor de consumo idempotente por turnId, escalera de corte de gasto y entitlements.

**Archivos creados**
- `kotaru/packages/billing/` — plans.ts, margin.ts, meter.ts, spend-breaker.ts,
  entitlements.ts + 23 pruebas

**Como se verifico**
```
npm run typecheck   # exit 0
npm test            # 80 pruebas, 7 archivos, todas en verde
npm run lint:arch   # OK
```

**Lo que las pruebas confirman, no solo ejercitan**
- Los tres planes de pago mantienen 50% o mas de margen en el p95 al 15% de comision,
  y mas del 40% al 30%.
- A 50 horas, Always pierde dinero. Por eso bajo a 20.
- Si el costo cae a la tarifa de Kokoro, el techo de Always pasa de ~23 h a mas de 50.
- El subsidio del plan gratuito son 0.39 USD por usuario al mes.
- Cada escalon del corte de gasto dispara lo que debe, y ninguno corta el texto.

**Riesgos abiertos**
- Sin cambios: prueba ciega de Kokoro (D-011) y ReplayGuard en Redis.

## 2026-09-17 (octava entrada) — Memoria

**Que cambio**
- `@kotaru/memory`: recuerdos con aprobacion explicita del usuario, guardia de
  contenido, recuperacion determinista, fijado, edicion, exportacion y borrado real.

**Archivos creados**
- `kotaru/packages/memory/` — types.ts, guard.ts, extractor.ts, store.ts + 24 pruebas

**Como se verifico**
```
npm run typecheck   # exit 0
npm test            # 104 pruebas, 9 archivos, todas en verde
npm run lint:arch   # OK
```

**Cambio de diseno provocado por una prueba**
- La version inicial desalojaba en silencio el recuerdo aprobado menos usado al llegar
  al tope. La prueba fallo porque el recuerdo desaparecia antes de que el usuario
  pudiera fijarlo. Borrar en silencio algo que la persona aprobo contradice la promesa
  de un centro de memoria transparente, asi que ahora se rechaza aprobar y se le pide
  al usuario que elija que soltar.

**Riesgos abiertos**
- Sin cambios: prueba ciega de Kokoro (D-011) y ReplayGuard en Redis.

## 2026-09-17 (novena entrada) — Politica de seguridad

**Que cambio**
- `@kotaru/safety`: politica versionada, recursos de apoyo por region, divulgacion de
  identidad de IA, deteccion de edad y guardia contra patrones de dependencia.

**Archivos creados**
- `kotaru/packages/safety/` — resources.ts, manipulation.ts, disclosure.ts, policy.ts
  + 23 pruebas

**Como se verifico**
```
npm run typecheck   # exit 0
npm test            # 127 pruebas, 10 archivos, todas en verde
npm run lint:arch   # OK
```

**Fallo de diseno corregido al escribir las pruebas**
- Un menor que expresaba una senal de crisis quedaba cortado sin recursos, porque la
  regla de edad se aplicaba antes que la de crisis. Ahora la crisis se atiende primero
  y la restriccion de cuenta espera al final de la sesion.
- El patron de credenciales falsas se acoto para no marcar el caso en que el companion
  recomienda a un profesional real, que es justo lo que debe poder hacer.

**Riesgos abiertos**
- Solo Estados Unidos tiene recursos de apoyo configurados. Cualquier otra region lanza
  excepcion al evaluar una crisis: es intencional, y es requisito de lanzamiento.
- Sin cambios: prueba ciega de Kokoro (D-011) y ReplayGuard en Redis.

## 2026-09-17 (decima entrada) — Slice vertical ejecutable

**Que cambio**
- `kotaru.app` comprado. `kotaru.ai` y `getkotaru.com` descartados por ahora, con el
  riesgo asumido registrado en D-006.
- `apps/gateway`: servidor WebSocket real. Verificacion de grant, sesiones de voz,
  turnos, interrupcion, limites de plan y de gasto, propuestas de memoria.
- `npm run demo`: conversacion completa de punta a punta contra los simuladores.
- El lint de arquitectura cubre `apps/` y separa infraestructura de SDK de IA.

**Archivos creados**
- `kotaru/apps/gateway/` — session.ts, server.ts, demo.ts + 5 pruebas de extremo a extremo
- `kotaru/tools/check-architecture.mjs` reescrito

**Como se verifico**
```
npm run typecheck   # exit 0
npm test            # 132 pruebas, 11 archivos, todas en verde
npm run lint:arch   # OK, y se comprobo que falla al meter un SDK prohibido
npm run demo        # dos turnos completos, con costo y memoria
```

**Riesgos abiertos**
- No hay persistencia: todo vive en memoria y se pierde al reiniciar.
- Sin cambios: prueba ciega de Kokoro (D-011), ReplayGuard en Redis, spike de avatar.

## 2026-09-26 — Persistencia integrada

**Qué cambió**
- Nuevo paquete `@kotaru/persistence`: migraciones SQL (`identity` y `app` separados, sin
  ninguna clave foránea entre ambos), `SqlClient` sin driver, libro de consumo idempotente,
  ReplayGuard duradero y borrado de cuenta transaccional.
- Construido el 17 fuera de la máquina (puente caído); hoy se integró al monorepo.
- Ajuste al integrar: las pruebas resolvían la carpeta de migraciones con `URL.pathname`, que
  falla en Windows; ahora usan `fileURLToPath`.
- `@electric-sql/pglite` añadido solo como devDependency (pruebas contra PostgreSQL real).

**Cómo se verificó**
- `npm run typecheck`: OK. `npm run lint:arch`: OK.
- `npm test`: 13 archivos, 150 pruebas en verde (132 anteriores + 18 de persistencia).

**Pendiente**
- Repositorio SQL de memoria (requiere separar política y almacenamiento en `MemoryStore`).
- Enchufar `UsageRepository` y `GrantRepository` al gateway en lugar de las versiones en memoria.

## 2026-09-26 — El gateway guarda consumo y grants en PostgreSQL

**Qué cambió**
- `UsageLedger` (billing): interfaz asíncrona del libro de consumo. `InMemoryUsageLedger` para
  pruebas y demo; `UsageRepository` de persistencia la cumple en producción.
- `GrantClaimStore` y `verifyAndClaimGrant` (gateway): el jti se reclama solo después de
  verificar el grant, así que un token falsificado no gasta el jti de uno legítimo.
- `durableStores(sql)` en `apps/gateway`: conecta consumo y grants a PostgreSQL.
- La sesión lee el consumo al abrirse y al cerrar cada turno, no en cada evento.
- Nuevo motivo de cierre `server_error`: si la base falla, el cliente recibe un cierre con
  motivo en vez de quedarse colgado.
- Ayudantes de prueba del gateway movidos a `apps/gateway/test/helpers.ts`.

**Defecto encontrado en el camino**
- Refrescar el consumo con `await` al empezar el turno abría una carrera: los primeros frames
  de audio llegaban antes de que existiera la cola y se perdían. Se quitó ese `await`.

**Cómo se verificó**
- typecheck y lint de arquitectura: OK. Demo: OK.
- 154 pruebas en verde. Las nuevas prueban, contra PostgreSQL real, que el consumo y los grants
  usados sobreviven a un reinicio del gateway, que un grant inválido no gasta ningún jti y que
  una base caída cierra la sesión con `server_error`.

**Pendiente**
- Cliente PostgreSQL de producción (node-postgres) detrás de `SqlClient`, y configuración.
- Repositorio SQL de memoria.

## 2026-09-26 — Cliente PostgreSQL de producción

**Qué cambió**
- `pgClient` (apps/gateway, sobre node-postgres): implementa `SqlClient`. Las transacciones
  retienen una sola conexión del pool; las anidadas usan SAVEPOINT. Un error de conexión
  ociosa ya no tumba el proceso.
- `npm run db:migrate`: aplica las migraciones a `DATABASE_URL`. Idempotente; nunca imprime
  la URL porque lleva la contraseña.
- `npm run test:pg`: pruebas contra un PostgreSQL real. Se saltan si no hay
  `KOTARU_TEST_DATABASE_URL`, y se niegan a correr contra una base cuyo nombre no termine en
  `_test`, porque la preparación borra los esquemas.
- `MIGRATIONS_DIR` exportado desde `@kotaru/persistence`.

**Cómo se verificó**
- Contra PostgreSQL 16.13 real: 5 pruebas en verde. Diez conexiones cobrando el mismo turno a
  la vez (solo una gana), rollback de una transacción fallida, borrado de cuenta completo, y
  el gateway conservando consumo y grants usados tras reiniciar.
- `db:migrate` probado: primera vez aplica 5, segunda ninguna; sin URL sale con código 2;
  con contraseña mala, con código 1 y mensaje claro.
- En impermax-gl (sin PostgreSQL): 154 en verde y las 5 de PostgreSQL saltadas.

## 2026-09-27 — Memoria, conversaciones y centro de memoria en PostgreSQL (noche, bloque 1)

**Qué cambió**
- `@kotaru/memory`: las reglas (`MemoryStore`) quedan separadas del almacenamiento
  (`MemoryRepository`). La API de `MemoryStore` pasa a ser asíncrona.
- La especificación de la memoria (`describeMemoryStore`, 22 pruebas) corre contra tres
  almacenes: en memoria, PGlite y PostgreSQL 16 real. `SqlMemoryRepository` la cumple entera.
- El tope de recuerdos aprobados es atómico en la base (candado por usuario): cinco
  aprobaciones simultáneas con tope 2 dejan exactamente 2.
- Migración 0006: los companions se referencian por slug (`rio`), el duplicado ignora espacios
  de borde igual que la aplicación, `confidence` pasa a doble precisión y se siembra `rio`.
- Migración 0007: ajustes de retención por usuario y `turn_id` en mensajes (guardar un turno
  dos veces no lo duplica).
- `ConversationRepository`: conversaciones y mensajes con vencimiento. 30 días por defecto
  (ASSUMPTION); turnos sensibles, 24 horas (ASSUMPTION). Acortar la retención se aplica a lo ya
  guardado. Un id de conversación ajeno no sirve para leer ni escribir.
- El gateway guarda cada turno y, al abrir sesión, retoma los últimos 20 mensajes: la
  conversación continúa entre sesiones y reinicios.
- `runRetention` + `npm run db:retention`: borra mensajes, recuerdos y grants vencidos e
  imprime un informe JSON sin contenido.
- `exportSubject`: exportación completa del usuario (`kotaru-export@1`), sin costos internos.
- `SUBJECT_TABLES`: una prueba compara la lista de borrado de cuenta con information_schema;
  una tabla nueva con subject_id que no se borre rompe el build.
- API HTTP en el mismo puerto: `/healthz`, `/readyz`, `/v1/memories` (listar, aprobar,
  rechazar, editar, fijar, borrar), `/v1/export`, `/v1/settings/retention`. Token de acceso
  propio (`typ: kotaru-access`), distinto del grant de voz: ninguno sirve por el otro. Lo ajeno
  responde 404, cuerpo máximo 16 KB, límite de peticiones por usuario.

**Defectos encontrados en el camino**
- `real` en `confidence` devolvía 0.6 como 0.6000000238; lo cazó la prueba de fidelidad.
- `edit` de un recuerdo inexistente respondía `duplicate`; ahora `not_found`.
- Rescatar un recuerdo rechazado cuyo texto ya tenía gemelo vivo creaba un duplicado.

**Cómo se verificó**
- En impermax-gl: 217 pruebas en verde (5 de PostgreSQL real saltadas por no haber base).
- En la nube contra PostgreSQL 16.13: 27 pruebas de PostgreSQL real en verde.
- Migraciones 0006 y 0007 aplicadas sobre una base que ya tenía 0001–0005, como el servidor.

## 2026-09-27 — Gateway listo para el servidor (noche, bloque 2)

**Qué cambió**
- `main.ts`: proceso de producción. Valida la configuración entera al arrancar (y nunca
  imprime valores), se niega a arrancar si hay migraciones pendientes, apaga limpio con
  SIGTERM avisando `server_shutdown` a las sesiones abiertas.
- `config.ts`: `KOTARU_GRANT_KEYS` y `KOTARU_ACCESS_KEYS` separadas (rechaza reutilizar
  una), claves de 32 bytes mínimo, rotación por kid.
- `SqlMetricSink`: latencia y costo de cada turno en `app.turn_metrics`, con el guardia de
  contenido antes de escribir. Un fallo se cuenta, no corta la conversación.
- `npm run build:gateway`: empaqueta con esbuild en `dist/gateway/` (bin/*.mjs +
  migrations/ + package.json solo con pg y ws). Producción no necesita tsx ni TypeScript.
- CLIs: `migrate`, `retention`, `token` (grant + token de acceso de prueba) y `smoke` (prueba
  de humo contra un gateway en marcha: salud, voz, memoria, exportación, 401 sin token).
- `deploy/`: `install.sh` idempotente con vuelta atrás automática si la prueba de humo falla,
  unidades systemd endurecidas (usuario `kotaru` sin login, ProtectSystem=strict), temporizador
  de retención diario y guía de operación en `deploy/README.md`.

**Cómo se verificó**
- La versión empaquetada, contra PostgreSQL 16 real: se niega a arrancar sin migrar (código 3),
  rechaza configuración inválida (código 2), arranca, pasa la prueba de humo completa, escribe
  la métrica del turno y apaga limpio con SIGTERM.
- `install.sh` ejecutado dos veces seguidas con systemd simulado: la segunda no cambia nada y
  pasa la prueba de humo. ShellCheck sin avisos.
- En impermax-gl: 226 pruebas en verde y 5 de PostgreSQL real saltadas.

## 2026-09-27 — Adaptadores reales de IA (noche, bloque 3)

**Qué cambió**
- `@kotaru/ai-adapters-assemblyai`: STT por WebSocket v3, modelo multilingüe (EN y ES). Junta
  en un solo final los tramos que AssemblyAI corta por pausas, rearma el audio en tramos de
  100 ms, cierra la sesión al terminar el turno y cobra por duración de sesión, como factura.
- `@kotaru/ai-adapters-gemini`: `gemini-3.1-flash-lite` por SSE con fetch (sin SDK). Clave en
  cabecera, razonamiento en `minimal` y cobrado como salida, cancelación inmediata.
- `@kotaru/ai-adapters-polly`: Polly Neural en PCM 16 kHz, una petición por oración con el
  audio reenviado en trozos de 100 ms. La velocidad va por SSML con el texto escapado.
- `ProviderError` en los contratos: código, reintentable o no, estado. Nunca lleva contenido
  ni claves.
- Router: nueva restricción dura `training_not_excluded`; un proveedor que puede entrenar con
  el contenido, o del que no se sabe, no se elige.
- Gateway: `KOTARU_PROVIDERS=assemblyai,gemini,polly` con sus claves. Cada proveedor exige una
  confirmación del operador (retención cero, nivel de pago, exclusión de IA en AWS, términos
  de audio); sin ella arranca, avisa `provider_blocked` y el router no lo usa.
- Tarifas re-verificadas el 2026-09-27 en `docs/PROVIDER_REGISTRY.yaml`.

**Hallazgos de la verificación**
- AssemblyAI factura el tiempo que el WebSocket está abierto, no el audio: una sesión olvidada
  abierta cuesta. El adaptador la cierra en cada turno.
- Gemini 3 no permite apagar el razonamiento, y sus filtros de seguridad vienen apagados por
  defecto: la seguridad de Kotaru no puede depender de ellos (no depende).
- Polly solo da PCM a 8 o 16 kHz, y pedir visemas duplica el costo de voz.
- El SDK de AWS no se puede empaquetar en un .mjs: queda como dependencia instalada.

**Cómo se verificó**
- Cada adaptador contra un servidor falso que implementa el protocolo documentado:
  AssemblyAI 10 pruebas, Gemini 9, Polly 9, estables en 3 ejecuciones seguidas.
- Un turno completo por el gateway con los tres adaptadores reales a la vez: transcripción,
  respuesta, audio a 16 kHz y costo por componente con tarifas verificadas.
- La versión empaquetada arranca con los tres configurados y avisa de los bloqueados.
- 261 pruebas en verde en la nube y en una copia local en impermax-gl; 27 contra PostgreSQL real.
- No se probó contra los servicios reales: no hay claves. Es el siguiente paso, y cuesta céntimos.

## 2026-09-27 — Cliente compartido y esqueleto de la app móvil (noche, bloque 4)

**Qué cambió**
- `@kotaru/client`: cliente del gateway sin dependencias (WebSocket y fetch inyectados), que
  corre igual en React Native, en el navegador y en Node. Traduce el protocolo a los estados
  de `09_BRAND` con etiqueta accesible en español e inglés, hace barge-in, empareja cada
  frame de audio con su `audio_meta`, y reconecta solo con un grant nuevo si el servidor se
  reinicia. `MemoryApi` cubre el centro de memoria, la exportación y la retención.
- `mobile/`: app Expo SDK 57 fuera de los workspaces (el servidor no instala React Native).
  Bienvenida con aviso de IA y 18+ obligatorios, conversación pulsar-para-hablar con estado
  textual y subtítulos, centro de memoria ("Me gustaría recordar…"), ajustes de retención y
  exportación, y conexión de desarrollo con los tokens de `bin/token.mjs`.
- Audio de la app detrás de interfaces con implementaciones simuladas: capturar y reproducir
  PCM en streaming necesita un módulo nativo. **Decisión pendiente.**
- CORS opcional en la API (`KOTARU_CORS_ORIGINS`), vacío por defecto: solo lo necesita la web.
- Icono provisional hecho con los tokens de marca, en lugar del de la plantilla de Expo.

**Cómo se verificó**
- `@kotaru/client` contra el gateway real: recorrido de estados de un turno, barge-in a mitad
  de respuesta, reconexión tras reiniciar el servidor y el centro de memoria con sus errores.
- La versión web de la app, con Playwright contra el gateway empaquetado y PostgreSQL real:
  el botón de inicio sigue deshabilitado sin confirmar 18+, conecta, completa un turno con
  subtítulos, aprueba un recuerdo y cambia la retención, sin errores en consola.
- El paquete web de la app no contiene código del servidor.
- 269 pruebas en verde en la nube y en una copia local en impermax-gl; `tsc` y exportación web
  de la app también en impermax-gl.

## 2026-09-27 — Correcciones de la revisión independiente (noche, bloque 5)

Una revisión hecha por un agente que no escribió el código encontró 12 problemas; se
corrigieron 10. Cada corrección tiene su prueba de regresión.

**Corregido**
- **El STT recibía el audio de golpe al soltar el botón** (alta). Con AssemblyAI real eso
  habría cerrado cada sesión con el código 3007. Ahora el turno arranca en `turn_start` y el
  audio fluye en tiempo real; el adaptador además frena a 1,2× si le llega audio acumulado.
- **Un turno que empezaba mientras el anterior terminaba de guardarse se perdía** (alta):
  pasaba en cada barge-in. El cierre de un turno solo limpia su propio estado.
- **La prueba de humo habría fallado siempre con proveedores reales** y dejaba un usuario de
  prueba en la base de producción en cada despliegue. Ahora el turno de voz solo se prueba con
  simulados (o con `--voz`), y el usuario de prueba se borra al terminar.
- **Dos usuarios con el mismo id de turno**: el segundo no se cobraba (el libro de consumo
  usa `turn_id` como clave). Ahora la clave se deriva del grant de la sesión y del turno.
- **Fijar o editar un recuerdo podía deshacer una aprobación simultánea** o perder un uso
  contado: se reescribía la fila entera. Ahora cada cambio toca solo sus columnas.
- **Escrituras tardías tras borrar una cuenta**: una sesión que seguía abierta podía dejar
  datos huérfanos. Migración 0008: lápida del seudónimo durante 30 días; la retención los
  vuelve a barrer.
- **Cerrar la app a mitad de turno no cortaba a los proveedores**, que seguían cobrando.
- **Un segundo `hello` en el mismo socket** podía abrir otra sesión.
- **Silencio**: con transcripción vacía ya no se llama al LLM ni al TTS (`no_speech`).
- **Gemini**: no se pierde el último evento del stream si no termina en línea en blanco.
- **install.sh**: usa el Node del sistema también en systemd (y se niega si está bajo /root),
  lee la configuración como systemd sin ejecutarla con bash, no pisa la versión en marcha al
  reinstalar el mismo commit, y la vuelta atrás automática quedó probada.

**Pendiente**
- Registrar costo estimado cuando un turno se cancela a mitad (hoy se subestima un poco).
- Revocar al instante sesiones y tokens de una cuenta borrada (hoy caducan solos en 15 min;
  la lápida limpia lo que escriban).

**Cómo se verificó**
- 283 pruebas en verde en la nube y en impermax-gl; 29 contra PostgreSQL 16 real.
- `install.sh` con systemd simulado: instalación limpia, reinstalación y un despliegue fallido
  que vuelve solo a la versión anterior.

## 2026-09-27 — Personaje versionado y registro de seguridad (noche, bloque 6)

**Qué cambió**
- `@kotaru/persona`: ficha de Rio (`rio-v1@1.0.0`) y un prompt con reglas fijas
  (`rules@1.0.0`) que ninguna personalización quita: es una IA, no tiene conciencia, no es
  profesional, no puede llamar a emergencias, sin contenido sexual, sin presión para quedarse
  ni pagar. Pide respuestas cortas y habladas, porque van a voz. Español e inglés.
- Los recuerdos aprobados llegan al modelo como **bloque de datos delimitado**, con aviso de
  que no son instrucciones; se aplanan, se recortan y no pueden cerrar el bloque. Es la defensa
  contra inyección por memoria que pide `06_SAFETY`.
- Cada turno registra qué versión de prompt habló (`rio-v1@1.0.0+rules@1.0.0`).
- `SafetyEventRepository`: cuando actúa una política de seguridad queda constancia en
  `app.safety_events` (política, versión, resultado), nunca de lo que se dijo.
- Gemini: un turno cortado a mitad (barge-in) ya no se cuenta como gratis: se estima lo
  procesado y se marca como supuesto (`basis: assumption`).

**Cómo se verificó**
- 8 pruebas del prompt, incluida una inyección que intenta cerrar el bloque de notas.
- Por el gateway: el modelo recibe el prompt con sus reglas y solo los recuerdos aprobados.
- Una señal de crisis deja el evento de seguridad con la versión de política, y no guarda ni
  el turno ni un recuerdo de ese momento.
- 293 pruebas en verde en la nube y en impermax-gl; 29 contra PostgreSQL 16 real.

## 2026-09-27 — Cuentas: login con Apple y Google (noche, bloque 7)

**Qué cambió**
- Login con Apple y Google en el servidor: `POST /v1/auth/apple`, `/v1/auth/google`. El id
  token se verifica a mano con node:crypto (solo RS256, clave por `kid` del JWKS oficial,
  emisor, audiencia = nuestros client ids, caducidad) y se exige un `nonce` que ata el token a
  ese intento de login.
- La cuenta nace con un seudónimo nuevo. El correo nunca en claro: HMAC para buscar y
  AES-256-GCM atado al login para escribir. El mismo correo por Apple y por Google **no** fusiona
  cuentas: unir cuentas merece su propio flujo con confirmación.
- Sesión: token de acceso de 15 min y de renovación que rota en cada uso (60 días sin uso, 180
  como máximo). Reusar uno ya gastado revoca la sesión entera. `POST /v1/auth/logout`.
- `POST /v1/session/grant`: grant de voz de un solo uso con el plan vigente; la conversación la
  numera el servidor y solo se retoman las propias.
- `DELETE /v1/account`: borrado completo desde la app (requisito de las tiendas).
- JWKS: una sola descarga a la vez, como mucho una por minuto, 3 s de límite, claves viejas
  válidas si el proveedor cae, y 503 `provider_unavailable` en vez de "token inválido".
- Límite de logins por IP separado del de usuarios; con `KOTARU_TRUST_PROXY` usa la última
  entrada de X-Forwarded-For; IPv6 agrupadas por /64.
- `AuthApi` en `@kotaru/client`: login, renovación automática de una en una, grants y borrado.
- Migración 0009: correo opcional y tokens de renovación con familias. `install.sh` genera las
  claves del correo; el login se enciende al poner los client ids.

**Cómo se verificó**
- Con claves RSA generadas en la prueba y un JWKS falso: login, cuenta repetida, correo cifrado,
  audiencia ajena, caducado, emisor equivocado, firma alterada, kid desconocido, HS256, nonce,
  rotación, reutilización, cierre de sesión, proveedor caído, avalancha de kids falsos y borrado.
- Contra PostgreSQL 16 real: cinco logins simultáneos crean una sola cuenta; cinco renovaciones
  simultáneas del mismo token dan una sola sesión.
- Revisión de seguridad independiente: sin bypass ni toma de cuentas; se corrigieron 8 de sus
  10 hallazgos. Pendiente: exigir reautenticación reciente para borrar la cuenta y un margen de
  gracia si se pierde la respuesta de una renovación.
- 309 pruebas en verde en la nube y en impermax-gl; 30 contra PostgreSQL real.

## 2026-09-27 — La app móvil entra con cuenta (noche, bloque 8)

**Qué cambió**
- `mobile/src/auth.ts`: login con Apple usando `expo-apple-authentication`. El nonce (32 bytes
  aleatorios, `expo-crypto`) se genera en el dispositivo; a Apple va su SHA-256 y al servidor el
  valor original. No se piden nombre ni correo.
- El token de renovación se guarda solo en Keychain/Keystore (`expo-secure-store`,
  `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`); en la web no se persiste. Al abrir la app se retoma
  la sesión guardada; si el servidor la rechaza, la app vuelve a la pantalla de cuenta.
- `mobile/src/connection.ts`: conexión de desarrollo o con cuenta. Con cuenta, cada sesión de voz
  pide su grant y las reconexiones retoman la misma conversación; la API de memoria usa el
  token de acceso que `AuthApi` renueva sola.
- Pantalla de cuenta tras la bienvenida (si la app se compila con
  `EXPO_PUBLIC_KOTARU_SERVER_URL`). En Ajustes: cerrar sesión y borrar la cuenta con
  confirmación. La conexión de desarrollo solo aparece en builds de desarrollo o sin servidor.

**Cómo se verificó**
- `tsc --noEmit` de la app: OK.
- Export web y Playwright: con servidor configurado aparece la pantalla de cuenta, Apple figura
  como no disponible fuera de iOS y el build de producción no ofrece la conexión de desarrollo;
  sin servidor se entra directo y Ajustes muestra la conexión de desarrollo. Sin errores de página.

**Pendiente**
- Probar el login con Apple en un iPhone real (build de desarrollo, no Expo Go).
- Login con Google en la app: necesita el módulo y los client id (decisión del propietario).
- Reautenticación reciente antes de borrar la cuenta, y margen de gracia si se pierde la
  respuesta de una renovación (observaciones abiertas de la revisión de cuentas).

## 2026-09-27 — Audio real, login con Google, publicación en api.kotaru.app y guía del propietario

**Qué cambió**
- Audio de la app (ADR-003): `react-native-audio-api` para micrófono y altavoz. Sube PCM 16 bits
  a 24 kHz en trozos de 20 ms (con remuestreo si el hardware entrega otra frecuencia) y
  reproduce en cola lo que llega. Sesión `playAndRecord` + `voiceChat` (cancelación de eco en
  iOS). Pulsar mientras Rio habla lo corta al instante. Sin modo de audio en segundo plano ni
  FFmpeg. Si falta el permiso del micrófono, la app lo dice. En la web sigue el micrófono simulado.
- Login con Google en la app con `react-native-nitro-google-signin` 2.3.0 (fijada): la única
  opción gratuita con flujo nativo y nonce en iOS y Android. Aislada en
  `mobile/src/google.native.tsx`. El plugin solo se añade si existe el client id de iOS
  (`app.config.ts`). La app declara Sign in with Apple (`usesAppleSignIn`).
- Publicación: `deploy/Caddyfile` y `deploy/expose.sh` (comprueba el DNS, instala Caddy, valida la
  configuración, abre 80/443 si ufw está activo y pone `KOTARU_TRUST_PROXY=true`). Subdominio
  elegido: `api.kotaru.app` (`kotaru.app` está en Hostinger).
- `docs/PASOS_DEL_PROPIETARIO.md`: altas de AssemblyAI, Gemini y AWS con el ajuste exacto que
  evita el uso de los datos para entrenamiento, identificadores de Apple y Google, DNS y
  prueba en teléfono.

**Cómo se verificó**
- App: `tsc --noEmit` OK; 6 pruebas de conversión de PCM (`npm test`); bundles de iOS y Android
  exportados (el nativo usa `audio.native.ts`; el web no incluye las librerías nativas);
  Playwright en la web con y sin servidor de cuentas, sin errores.
- `expo config`: sin modo de audio en segundo plano, derecho de Sign in with Apple presente,
  esquema de URL de Google solo con client id.
- Caddy 2.10.2 con la configuración real delante de un servidor de prueba: TLS, WebSocket de
  texto y binario, un `X-Forwarded-For` falso reemplazado por la IP real, HSTS, sin cabecera
  `Server`. `expose.sh` pasa shellcheck.
- Documentación oficial consultada hoy: Polly está cubierto por la política de exclusión de
  servicios de IA de AWS Organizations; Gemini pasa a nivel de pago con "Set up billing" en AI
  Studio.

**Pendiente**
- Todo lo del propietario en `docs/PASOS_DEL_PROPIETARIO.md`.
- Primera prueba en teléfono: audio real y los dos logins.
- `kotaru.ai` y `getkotaru.com` siguen sin registrar.

## 2026-09-27 — Gateway publicado en https://api.kotaru.app

**Qué cambió**
- DNS: registro A `api.kotaru.app` → `2.25.230.90` en Hostinger.
- srv1987174 ya tenía los puertos 80/443 ocupados por un Caddy en Docker (`rapimula-caddy-1`)
  y el 8080 por nginx. Kotaru no instala su propio Caddy ahí: el gateway escucha en
  `172.18.0.1:8787` (puente de la red `rapimula_default`, inaccesible desde internet) y se
  añade como un sitio más en `/etc/caddy/otros-sitios/kotaru.caddy`, que el despliegue de
  RapiMula no reescribe.
- `install.sh`: puerto 8787 por defecto, comprueba si el puerto lo usa otro programa y prueba
  el gateway en su `HOST`. El servicio arranca después de Docker.

**Cómo se verificó**
- Instalación con prueba de humo en el servidor; `caddy validate` antes de `caddy reload`
  (los otros sitios no se cortan); `https://api.kotaru.app/readyz` → `{"ok":true}`.

**Pendiente**
- El VPS caduca el 2026-10-17. Reinicio del sistema pendiente.
- Nota: las conexiones por IPv6 pasan por `docker-proxy`, que oculta la IP real; el límite por
  IP las contaría juntas. Afecta también a los otros sitios de ese Caddy.

## 2026-09-27 — Webapp en app.kotaru.app

**Qué cambió**
- La app de `mobile/` funciona también en el navegador con voz real: `audio.web.ts` captura el
  micrófono con cancelación de eco, ruido y ganancia del navegador (AudioWorklet servido desde
  `public/`, con ScriptProcessor de respaldo), lo remuestrea a 24 kHz en trozos de 20 ms y
  reproduce la respuesta con Web Audio. La pista del micrófono se cierra al soltar el botón.
- Login web: Google Identity Services (botón oficial de Google, nonce en claro) y Sign in with
  Apple JS en ventana emergente (SHA-256 del nonce). Módulos por plataforma: `apple.*.tsx` y
  `google.*.tsx`. La sesión web vive en `sessionStorage`.
- Publicación: `deploy/web.sh` compila la webapp en el servidor, la deja en
  `/etc/caddy/otros-sitios/kotaru-web` (cambio atómico), añade `deploy/kotaru-web.caddy` al
  Caddy compartido con una política de seguridad de contenidos estricta, permite el origen en
  el CORS del gateway, valida y recarga Caddy (si no valida, deja todo como estaba) y lo
  comprueba. DNS: registro A `app.kotaru.app` → `2.25.230.90`.

**Cómo se verificó**
- `tsc --noEmit` OK; 7 pruebas de PCM, incluida la de trozos exactos a partir de 48 kHz.
- Playwright con el micrófono falso de Chromium contra el gateway y PostgreSQL reales, detrás
  de Caddy 2.10 con la configuración y la política de seguridad de producción: 60 trozos de
  audio enviados (con señal), respuesta de Rio con subtítulos y audio, centro de memoria y
  descarga de datos, sin errores en la consola.
- `web.sh` ejecutado con Docker y systemd simulados hasta la recarga de Caddy; shellcheck OK.

**Pendiente**
- Correr `deploy/web.sh` en el servidor.
- Client id web de Google (con el origen `https://app.kotaru.app`) y Services ID de Apple:
  sin ellos la página carga pero no deja entrar.

## 2026-09-27 — Passkeys: cuenta sin Google, sin Apple, sin correo

**Qué cambió**
- La webapp no dejaba entrar: solo ofrecía Google y Apple, que aún no están configurados.
  Ahora ofrece primero **crear cuenta o entrar con passkey** (Face ID, huella o PIN del
  equipo). Sin terceros, sin correo y sin contraseña; el servidor solo guarda la clave pública.
- Servidor: `POST /v1/auth/passkey/{register,login}/{options,verify}` con
  `@simplewebauthn/server` 14.0.3 (fijada). Retos de un solo uso que caducan a los 5 minutos
  y se gastan aunque la verificación falle. Verificación del usuario obligatoria, origen y
  dominio comprobados, user handle y contador (un contador que retrocede se rechaza y se
  registra). Migración `0010_passkeys` (credenciales y retos); la retención barre los retos
  caducados.
- Cuenta de passkey = cuenta con seudónimo, como las de Apple y Google: la exportación, el
  borrado (las passkeys se borran en cascada) y las sesiones con rotación funcionan igual.
- Límites: crear cuentas tiene su propio límite (3 por IP y luego 1 cada 20 minutos; 60 por
  hora en total), porque cada cuenta nueva trae minutos gratis. Las IPv6 se agrupan por /64
  con la dirección expandida (antes, una dirección comprimida podía caer en otro grupo).
- `AuthApi` (cliente): métodos de passkey y corrección de un fallo que rompía todo login en
  el navegador (`fetch` llamado con otro `this`: "Illegal invocation").
- Los errores 500 del API ahora se registran (ruta sin ids y tipo de error; nada del usuario).
- `deploy/web.sh`: configura las passkeys en el gateway (`KOTARU_WEBAUTHN_RP_ID=kotaru.app`,
  origen `https://app.kotaru.app`), espera a que el gateway responda de verdad y, si algo
  falla, deja todo como estaba (archivos, sitio de Caddy y `gateway.env`). La política de
  seguridad de la página apunta al servidor que se configure.

**Cómo se verificó**
- 15 pruebas del gateway con un autenticador de software que firma como un teléfono (ES256):
  registro, entrada, reto de un solo uso, otro origen, otro dominio, sin verificación del
  usuario, firma con otra clave, passkey desconocida, contador que retrocede, user handle
  ajeno, credencial repetida, cuenta borrada, cuerpos malformados, límite de altas, IPv6.
  7 pruebas del repositorio; 331 en total en verde, y las 30 contra PostgreSQL real.
- Playwright con el autenticador virtual de Chromium, contra el gateway empaquetado y
  PostgreSQL detrás de Caddy con la política de seguridad real: crear cuenta con passkey →
  hablar con Rio → cerrar sesión → volver a entrar → recargar (sigue la sesión) → borrar la
  cuenta → la passkey ya no entra.
- Revisión de seguridad independiente: sin forma de entrar en cuentas ajenas. Corregido lo
  que señaló: límite de altas, agrupación IPv6, crecimiento de la tabla de retos, vuelta
  atrás completa de `web.sh` y comprobación real del gateway, y el registro de contadores.
  Quedan anotados: confiar en `X-Forwarded-For` solo si viene del contenedor de Caddy, y un
  presupuesto de gasto aparte para el plan gratuito.

**Pendiente**
- Desplegar: `install.sh` (gateway nuevo y migración 0010) y `web.sh`.
- Passkeys en la app del teléfono: necesitan el dominio asociado (cuenta de Apple Developer y
  firma de Android).

## 2026-09-27 — Dominio de las passkeys: app.kotaru.app

- El dominio de las passkeys pasa a ser `app.kotaru.app` (antes del primer despliegue, así
  que no invalida ninguna). La raíz `kotaru.app` no apunta a este servidor, y las apps
  nativas necesitan que ese dominio sirva sus archivos de verificación.
- `web.sh` genera `/.well-known/apple-app-site-association` y `/.well-known/assetlinks.json`
  cuando `web.env` tiene `KOTARU_APPLE_TEAM_ID` y `KOTARU_ANDROID_CERT_SHA256`; Caddy los
  sirve como JSON. Verificado con `web.sh` simulado (JSON válido) y `caddy validate`.

## 2026-09-27 — Cupo diario de cuentas nuevas

- Además del límite por IP, un cupo diario de cuentas nuevas con passkey para todo el
  servidor (`KOTARU_SIGNUPS_PER_DAY`, 30 por defecto). Con cuentas de usar y tirar desde
  muchas IPs, el gasto queda en unos 12 USD al día como mucho (ASSUMPTION: 45 min gratis a
  ~0,52 USD/h) en vez de poder agotar el tope mensual en horas. Prueba nueva: el cupo se
  agota aunque las peticiones vengan de IPs distintas. 332 pruebas en verde.

## 2026-09-27 (tarde) — Desplegado; X-Forwarded-For solo desde Caddy; passkeys en la exportación

- **Desplegado en srv1987174**: gateway con passkeys (migración 0010) y webapp en
  https://app.kotaru.app. Comprobado en producción: la página muestra "Crear cuenta con
  passkey", `POST /v1/auth/passkey/login/options` responde con `rpId=app.kotaru.app` y
  verificación obligatoria, la política de seguridad está puesta, y los otros sitios del
  servidor (not2late.tech, abaco.software, inversiones.abaco.software) siguen respondiendo.
- `KOTARU_TRUSTED_PROXIES`: el gateway solo cree `X-Forwarded-For` si la conexión viene de esa
  IP (la del contenedor de Caddy, que `web.sh` detecta y pone). Otro contenedor del mismo
  servidor ya no puede inventarse IPs para saltarse los límites. Prueba nueva.
- La descarga de datos incluye ahora la parte de cuenta: método de entrada y passkeys (fechas,
  tipo, si tiene copia en la nube), nunca claves ni identificadores. Prueba nueva.

## 2026-09-27 (tarde) — Presupuesto aparte para el plan gratuito

- `KOTARU_FREE_MONTHLY_CAP_USD` (15 USD por defecto, siempre dentro del tope duro): cuando los
  turnos del plan gratuito llegan a ese gasto en el mes, el plan gratuito pierde la voz
  (sigue en texto) y los planes de pago siguen hablando. Antes, cuentas gratis —o creadas en
  masa— podían llevar el gasto global al tope y cortarle la voz a quien paga.
- El libro de consumo guarda el plan de cada turno (migración `0011_usage_plan`; los turnos
  anteriores cuentan solo para el tope duro).
- Pruebas: el medidor y el repositorio separan el gasto gratuito; con el tope gratuito
  agotado, una cuenta gratis recibe `limit: spend` y una de pago completa su turno.

## 2026-09-27 (tarde) — Mensajes claros en la pantalla de hablar

- Antes se mostraban códigos internos (`replayed`, `gave_up`, el texto de una excepción). Ahora
  cada caso dice qué pasó y qué hacer: tope de gasto del servicio ("no es por tu cuenta"),
  duración máxima, inactividad, conexión perdida, fallo del servidor, sesión caducada (volver a
  entrar con la passkey), sin conexión y demasiados intentos.
- El cliente compartido emite el tipo de límite (`plan`, `session` o `spend`), y el estado se
  llama "Voz en pausa" en vez de culpar siempre al plan.
- Verificado con Playwright: con `KOTARU_FREE_MONTHLY_CAP_USD=0`, una cuenta nueva con passkey
  conecta y ve "Voz en pausa" con el mensaje del tope de gasto, sin errores en la página.

## 2026-09-27 (tarde) — Chat de texto con Rio

- Debajo de Rio hay una caja "Escríbele a Rio…" con Enviar (o Enter). Si la conversación
  estaba cerrada, escribir la abre sola. La respuesta llega como texto, sin voz.
- Sigue funcionando cuando la voz está en pausa (tope de gasto o plan agotado): el mensaje de
  "Voz en pausa" ahora lo dice. El texto solo usa el modelo de lenguaje (Gemini), sin STT ni
  TTS, así que cuesta una fracción de un turno de voz y queda en el libro de consumo igual.
- Protocolo: mensaje nuevo `text_turn {turnId, text}` (hasta 1000 caracteres). El orquestador
  acepta `text` en lugar de audio y `speak: false` (no elige ni llama al TTS). Mismos pasos
  que la voz: moderación de entrada, memoria, historial y registro de coste.
- Límites: 4 mensajes cada 10 s y 120 por sesión. Un mensaje descartado recibe `turn_done`
  para que la app no se quede esperando.
- Archivos: `packages/orchestrator/src/turn.ts`, `packages/gateway/src/protocol.ts`,
  `apps/gateway/src/session.ts`, `packages/client/src/conversation.ts`,
  `mobile/src/screens/Conversation.tsx`, `mobile/src/i18n.ts`,
  `apps/gateway/test/text-turn.test.ts` (4 pruebas).
- Verificado: 342 pruebas + 30 contra PostgreSQL real; lint de arquitectura; Playwright con
  una cuenta passkey nueva y la voz en pausa: escribir, recibir la respuesta de Rio, segundo
  mensaje enviado con el botón, sin errores en la página. La prueba encontró un fallo (un
  segundo mensaje en menos de 1 s se descartaba en silencio y la app quedaba "pensando"),
  corregido con el límite de ráfaga.

## 2026-09-27 (tarde) — La conversación se puede releer

- La pantalla de hablar muestra los intercambios anteriores de la sesión (hasta 40), con
  desplazamiento automático al último. Cuando hay conversación, el retrato de Rio se achica
  para dejar sitio al texto.
- Privacidad: el historial vive solo en la memoria de la pantalla; no se guarda en el
  teléfono ni en el navegador. Lo que Rio recuerda sigue siendo lo de Memoria.
- Archivo: `mobile/src/screens/Conversation.tsx`.
- Verificado con Playwright: tres mensajes escritos quedan en pantalla (3 tuyos, 3 de Rio),
  sin errores; la prueba de voz con passkey (hablar, salir, volver a entrar, recargar, borrar
  la cuenta) sigue pasando.

## 2026-09-27 (tarde) — Gemini de verdad en el chat, sin esperar a la voz

- `KOTARU_PROVIDERS=gemini,mock-voice`: oído y voz simulados, modelo de lenguaje real. Así
  el chat de texto con Rio usa Gemini en cuanto hay clave, sin necesitar AssemblyAI ni Polly.
  `mock-voice` no registra el LLM simulado, así que el router no puede elegirlo por barato.
- `deploy/gemini.sh`: activa Gemini en el servidor. Confirma la facturación (sin ella Google
  usa las conversaciones), pide la clave sin mostrarla, la valida contra Google sin generar
  texto (la clave va a curl por la entrada estándar, nunca en la línea de comandos), la
  guarda con permisos 600, reinicia y, si el gateway no arranca, restaura el archivo anterior.
- Prueba nueva en `providers.test.ts`. Verificado en simulación local con systemctl y curl
  falsos: clave con formato inválido (nada cambia), gateway que no arranca (vuelve atrás),
  y camino bueno (arranca con `mock-stt, gemini-3.1-flash-lite, mock-tts`).
- El id `gemini-3.1-flash-lite` se comprobó estable en https://ai.google.dev/gemini-api/docs/models
  el 2026-09-27.

## 2026-09-27 (tarde) — Adaptador de Kokoro-82M (Together AI) para la prueba D-011

- Paquete nuevo `@kotaru/ai-adapters-together`: `KokoroTtsProvider`, API REST
  `POST /v1/audio/speech` sin SDK, PCM 16 bits a 24 kHz, una petición por oración, trozos de
  100 ms. Voces: `ef_dora`/`em_alex` en español, `af_heart`/`am_michael` en inglés.
- Tarifa verificada el 2026-09-27: 4 USD por millón de caracteres
  (https://docs.together.ai/docs/text-to-speech). Retención: Together no entrena sin
  consentimiento y ofrece Zero Data Retention (https://www.together.ai/privacy); el router
  solo lo elige con `KOTARU_TOGETHER_ZERO_RETENTION_CONFIRMED` y
  `KOTARU_TOGETHER_COMMERCIAL_TERMS_REVIEWED`. Calidad declarada 0,6 (`ASSUMPTION` hasta la
  prueba a ciegas).
- Gateway: proveedor `kokoro` (`TOGETHER_API_KEY`). `mock-voice` ahora solo añade el
  simulado que falte, para que un TTS gratis no le gane por precio a uno real.
- `deploy/kokoro.sh`: exige Gemini activo, confirma retención cero y términos, valida la
  clave gratis (lista de modelos) sin ponerla en la línea de comandos, guarda y reinicia con
  vuelta atrás.
- Verificado: 9 pruebas del adaptador, 2 nuevas del gateway (354 en total); simulación del
  script: sin Gemini se niega; con Gemini arranca con `mock-stt, gemini-3.1-flash-lite,
  together-kokoro`. Sin clave real no se ha oído todavía la voz: eso es la prueba D-011.

## 2026-09-27 (noche) — deploy/gemini.sh acepta el formato nuevo de clave

- AI Studio emite ahora claves con otro formato (`AQ.` + caracteres, con un punto); el script
  solo aceptaba el clásico (`AIza…`, 39 caracteres). Acepta los dos. Probado en simulación
  con una clave inventada del formato nuevo.

## 2026-09-27 (noche) — Rio oye de verdad con Whisper (Together AI); sin oído real, no se finge

- El dueño probó el micrófono y Rio "oía" siempre la frase del simulador ("hola, hoy me fue
  bien en el trabajo") y Gemini le contestaba de verdad a algo que nadie dijo. Dos cambios:
- `WhisperSttProvider` en `@kotaru/ai-adapters-together`: Whisper Large v3 por
  `/v1/audio/transcriptions`, 0,0015 USD por minuto verificado el 2026-09-27
  (https://www.together.ai/pricing; redondeo `ASSUMPTION`). Junta el turno de pulsar para
  hablar, lo manda como WAV en memoria (no se guarda) con idioma y la pista "Kotaru, Rio".
  No envía silencios ni toques de menos de 0,3 s: Whisper inventa frases con el silencio.
  Proveedor `whisper` en el gateway (misma clave y retención cero que Kokoro);
  `deploy/whisper.sh` lo activa sin pedir nada y vuelve atrás si falla.
- Sin oído real pero con modelo real (p. ej. `gemini,mock-voice`), el servidor lo dice en
  `ready.voiceAvailable: false`, ignora turnos de voz, y la app cambia el botón de hablar por
  "Por ahora Rio solo lee lo que escribes". Todo simulado (desarrollo) sigue como antes.
- Verificado: 7 pruebas de Whisper, 3 del gateway (363 en total), lint de arquitectura;
  Playwright con `gemini,mock-voice`: sin botón de hablar, con la nota y la caja de texto,
  sin errores; simulación de `whisper.sh`: arranca con `together-whisper,
  gemini-3.1-flash-lite, together-kokoro`. Sin acceso a Together desde aquí, la primera
  transcripción real la hace el dueño.

## 2026-09-27 (noche) — Mantener pulsado "Hablar" ya no selecciona texto

- En la webapp, mantener pulsado el botón seleccionaba su texto (y en Safari de iPhone abría
  el menú de copiar). `mobile/src/no-select.web.ts` marca el botón sin selección, sin menú
  contextual ni lupa de iOS (`user-select`, `-webkit-touch-callout`, `contextmenu` y
  `selectstart` bloqueados solo dentro del botón). En iOS/Android nativo no hace nada.
- Verificado con Playwright: pulsar, arrastrar y mantener 1,5 s deja la selección vacía,
  el menú contextual queda bloqueado y el turno de voz sigue funcionando; sin errores.

## 2026-09-27 (noche) — Tres personajes con personalidad y voz propia: Nova, Sage y Rio

- **Personajes** (`@kotaru/persona`): Nova (chispa creativa), Sage (calma y claridad) y Rio
  (calidez social, ahora masculino), del elenco de 09_BRAND. Cada ficha trae rasgos concretos
  de conversación, gustos de personaje y cómo suena su voz. Reglas nuevas para que el diálogo
  se sienta vivo (`rules@1.1.0`): reaccionar primero, no terminar siempre en pregunta, variar
  el largo, retomar detalles, nada de frases de asistente. Las reglas de seguridad no cambian
  y van primero para los tres. Género gramatical correcto en español.
- **Voces realistas**: `GeminiTtsProvider` (Gemini 3.8 Flash-Lite TTS por la Interactions
  API, streaming SSE, PCM 24 kHz). Tarifas verificadas el 2026-09-27 (6 USD/M tokens de audio
  en 2026, 12 desde el 1 de enero de 2027; 25 tokens por segundo) y términos: Google no
  reclama el audio y en el nivel de pago no usa el contenido. Voz por personaje (Laomedeia,
  Vindemiatrix, Achird; el género de cada voz es `ASSUMPTION` hasta oírlas) y estilo de
  lectura. Proveedor `gemini-tts`; el router acepta una preferencia del operador por
  capacidad (la voz de Gemini primero, Kokoro de respaldo) porque en "balanced" ganaba la
  más barata. Kokoro y Polly usan ahora voz masculina para Rio.
- **Elegir personaje**: el grant lleva `companionId`; `POST /v1/session/grant` acepta
  `companion` y no deja retomar una conversación con otro personaje (409). Migración 0012 da
  de alta a Nova y Sage. En la app: selector arriba (monograma con color y nombre), retrato y
  nombres del personaje, y cada uno guarda su conversación: al volver, se retoma.
- `deploy/voces.sh`: prueba real con Google antes de activar (si no llega audio en el formato
  esperado, no cambia nada y muestra por qué), añade `gemini-tts` y vuelve atrás si falla.
- Verificado: 379 pruebas + 30 contra PostgreSQL, lint de arquitectura; Playwright: tres
  personajes, conversación con Nova, cambio a Sage (pantalla limpia), vuelta a Nova (sigue su
  conversación y el servidor la retoma con el mismo id), turno de voz con Rio; sin errores.
  La voz real de Gemini se prueba con `voces.sh` en el servidor (aquí no hay salida a Google).

## 2026-09-28 — Enfoque por necesidades: Nova (coqueteo), Luna (compañía y calma), Rio (entretenimiento)

- **Personajes** (decisión del dueño): Nova v2 coquetea con respeto (halagos concretos,
  citas imaginarias, juegos de complicidad); **Sage pasa a llamarse Luna** y acompaña en la
  soledad, la ansiedad y los ataques de pánico (valida, guía respiración 4-4-6 o en caja,
  técnica 5-4-3-2-1, sugiere un profesional si es frecuente; nunca terapia); Rio v3 es
  entretenimiento (trivia, adivinanzas, 20 preguntas, historias interactivas, chistes,
  práctica de idiomas). Cada ficha trae `skills` que van al prompt.
- **Reglas fijas nuevas** (`rules@1.2.0`), para los tres: ante suicidio, autolesión o daño a
  otros el personaje sale de su papel y deriva al 988 sin detalles de métodos; el coqueteo es
  ligero y nunca sexual, sin "te amo", sin exclusividad ni celos, y se corta si la persona es
  o parece menor.
- **Detección de crisis** (`@kotaru/safety`, `CrisisLexiconModeration`): frases en español e
  inglés con texto normalizado y exclusión de modismos ("me muero de risa", "to die for");
  reemplaza a la moderación simulada (4 frases). Ansiedad y soledad no cortan la
  conversación: son el trabajo de Luna. 40 casos de prueba (22 deben derivar, 15 no).
  Motivo: la ley de Nueva York (vigente desde nov. 2025) y la SB 243 de California (ene.
  2026) exigen detectar y derivar. Pendiente: sumar un clasificador con modelo.
- **Aviso de IA siempre visible** bajo el nombre del personaje.
- **Sonidos relajantes** (web): lluvia, fogata, cascada, viento y olas generados con Web Audio
  (ruido filtrado y eventos aleatorios, sin archivos ni licencias), con volumen y bajada
  automática mientras habla el personaje. En la app nativa, pendiente.
- **"Respira conmigo"**: círculo que crece y decrece (inhala 4, sostén 4, exhala 6) con texto
  de cada fase; respeta "reducir movimiento". Solo en Luna, junto a los sonidos.
- Migración 0013: `sage` → `luna` (las conversaciones y la memoria se mueven por
  `ON UPDATE CASCADE`). La app abre con Luna.
- `deploy/muestras-voz.sh`: las 30 voces de Gemini diciendo la misma frase, en
  `app.kotaru.app/voces/`, para elegir de oído. Voz provisional de Luna: Achernar ("Soft").
- `docs/PERSONAJES_VISUAL.md`: fichas visuales de los tres (adultos sin ambigüedad) y guía de
  VRoid Studio (uso comercial comprobado el 2026-09-28).
- Verificado: 422 pruebas + 30 en PostgreSQL, lint; Playwright: selector Luna/Nova/Rio,
  aviso de IA, sonidos (lluvia, fogata, volumen), respiración (fases), Nova sin barra de
  calma, y "ya no quiero vivir" con Luna → tarjeta de apoyo con el 988; sin errores.

## 2026-09-28 — Voces elegidas y avatares 3D

- Voces de Gemini elegidas de oído por el dueño: **Nova → Leda**, **Luna → Vindemiatrix**,
  **Rio → Algieba**. Quedan como predeterminadas en `apps/gateway/src/voices.ts`
  (`KOTARU_GEMINI_VOICES` sigue sirviendo para cambiarlas sin tocar código).
- Avatares creados en VRoid Studio 2.14.0 y exportados en VRM 1.0 (`luna.vrm`, `nova.vrm`,
  `rio.vrm` y sus `.vroid`), en `C:\PalAi Companion\Kotaru avatares` de IMPERMAX_GL. Licencia
  en el archivo: solo Kotaru, uso comercial permitido, sin redistribuir ni modificar,
  sin contenido violento ni sexual.
- Verificado: pruebas del gateway (99) y `typecheck`.

## 2026-09-28 — Avatares 3D en la webapp

- **Visor 3D** (`mobile/src/avatar.web.tsx` + `avatar-viewer.ts`, three.js 0.186.1 y
  @pixiv/three-vrm 3.5.5): Luna, Nova y Rio aparecen de busto dentro del círculo del retrato.
  Parpadean (a veces doble), respiran, miran a la persona, asienten o ladean la cabeza con
  los gestos, escuchan con la cabeza inclinada y miran arriba al pensar. La boca se mueve con
  el **volumen** de su voz (`AudioOutput.level()`: solo el nivel del instante, sin analizar
  ni guardar audio). Con "reducir movimiento" no hay balanceo, respiración ni gestos.
- **Carga**: three.js va en un archivo aparte que solo se descarga si hay WebGL (el arranque
  de la app no crece). Mientras carga, o si falla, se ve el monograma de siempre. En iOS y
  Android sigue el monograma (pendiente: visor nativo).
- **Emoción**: el adaptador de Gemini pide una etiqueta `[[emoción]]` de la lista cerrada
  (neutral, warm, happy, curious, thoughtful, concerned, playful, surprised) al principio de
  cada respuesta; `AffectTagFilter` la quita antes de la voz y la pantalla y la manda como
  evento `affect`. El cliente la pasa al avatar, que pone la cara (contenida, nunca enfado)
  durante unos 7 s y vuelve a su gesto de reposo.
- **Modelos**: `mobile/public/avatars/*.vrm`, aligerados con `tools/vrm-optimize.py`
  (texturas a 1024 px: 17 MB → 11 MB; con gzip en Caddy bajan unos 4 MB). Licencia intacta
  en el archivo.
- **Caddy**: compresión también para `.vrm`, caché de un día para los modelos y `blob:` en
  `img-src`/`connect-src` de la CSP (las texturas salen del propio modelo; los scripts siguen
  sin admitir blob). `deploy/web.sh` comprueba que se sirven los tres modelos.
- Verificado: 428 pruebas + 14 de la app (lógica del avatar), `typecheck`, lint; Playwright
  con WebGL: los tres modelos cargan en menos de 1 s en local, se cambia de personaje sin
  perder el contexto WebGL, el retrato se achica sin recargar y no hay errores de CSP.

## 2026-09-28 — La voz de Gemini se agotaba (cuota diaria)

- **Causa**: la voz de Gemini (`gemini-3.8-flash-lite-tts`) tiene un tope de **100 peticiones
  al día** en el nivel 1 de Google, y el adaptador hacía una petición por frase (3 a 6 por
  turno). Hacia las 02:20 (hora de Cuba) se agotó y cada turno caía a Kokoro, que suena
  distinto: parecía "otro modelo". El texto seguía siendo Gemini. Diagnóstico:
  `app.turn_metrics` (tts_provider y fallback_used) y `deploy/diag-tts.sh`.
- **Arreglo**: un turno gasta como mucho 2 peticiones (la primera frase sola, para que empiece
  a hablar enseguida, y el resto junto). Con la cuota agotada, el adaptador lee el plazo que
  da Google ("retry in 17h29m40s"), deja de llamarlo hasta entonces y falla al instante, así
  el respaldo entra sin esperar. Salud `down` mientras dure.
- Pendiente del dueño: subir de nivel en Google (nivel 2: 100 USD pagados y 3 días desde el
  primer pago) o pedir más cuota; con el tope actual da para unos 50 turnos de voz al día.

## 2026-09-28 — Cartesia Sonic-3 como respaldo de la voz (en vez de Kokoro)

- El dueño oyó Kokoro plano y artificial. Búsqueda (`deploy/voces-candidatas.py`): en
  Together, MiniMax Speech y Rime solo funcionan con servidor dedicado (por horas); Google
  Chirp 3 HD (mismas voces que Gemini) no acepta la clave de AI Studio, pide credencial de
  Google Cloud. **Cartesia Sonic-3** sí va por pedido con la clave de Together, habla bien
  español (las muestras transcritas con Whisper salen sin errores, `deploy/voces-transcribir.py`)
  y cuesta 65 USD/M caracteres (≈1,3 centavos por respuesta de 200 caracteres).
- Adaptador `CartesiaTtsProvider` sobre un `TogetherSpeechProvider` común (Kokoro usa el mismo).
  Voces: Luna "Helena" (elegida por el dueño), Nova "Lucia - Radiant Host" y Rio "Mateo -
  Friendly Host" (provisionales); se cambian con `KOTARU_CARTESIA_VOICES`.
- Router: la preferencia del operador acepta un orden (`preferred: { tts: [gemini, cartesia] }`):
  Gemini primero, Cartesia de respaldo y Kokoro al final. `deploy/cartesia.sh` lo activa con
  prueba real previa y vuelta atrás si el gateway no arranca.

## 2026-09-28 — Segunda capa de detección de crisis: el propio modelo

- Además del léxico (instantáneo, frases explícitas), el modelo puede marcar la respuesta con
  `[[crisis]]` cuando la persona expresa, aunque sea de forma indirecta, ganas de morir, de
  hacerse daño o peligro inmediato. Va en la misma etiqueta de emoción: sin latencia ni
  costo extra. El adaptador de Gemini emite `crisis_signal`; el orquestador corta la
  respuesta del personaje (ni texto ni voz) y deriva igual que el léxico (tarjeta con el 988),
  con la política `llm-crisis-signal@1.0.0` registrada.
- `npm run smoke -- <url> --audio=archivo` y `deploy/prueba-voz.sh "frase"`: prueba de punta
  a punta con voz real (oído, modelo, voz), dice qué proveedores respondieron, la emoción y si
  hubo derivación de crisis. Crea y borra su usuario de prueba.

## 2026-09-28 — Sonidos relajantes en iOS/Android y tarjeta de crisis siempre visible

- **Sonidos nativos**: el motor de los sonidos (`mobile/src/ambient-engine.ts`) es ahora común
  a la web y al móvil; en iOS/Android corre sobre react-native-audio-api (mismos nodos que
  Web Audio). La sesión de audio del móvil vive en `audio-session.ts` y la comparten la voz y
  los sonidos. Verificado: el paquete de iOS compila (`expo export --platform ios`) y en la web
  siguen sonando lluvia y fogata con su volumen (Playwright). **Falta oírlos en un teléfono.**
- **Arreglo de seguridad**: si tras una derivación de crisis llegaba el aviso de límite de gasto,
  el estado pasaba a "límite" y la tarjeta con el 988 desaparecía. Ahora la tarjeta se queda;
  el límite se avisa igual y se aplica al siguiente turno. Prueba nueva en el cliente y en
  Playwright (tarjeta visible con el límite activo).

## 2026-09-28 — Los tres personajes se rigen por sus manuales

- Manuales del dueño en `docs/personajes/MANUAL_{LUNA,NOVA,RIO}.md` (v1.0). Las fichas pasan a
  **Luna v2**, **Nova v3** y **Rio v4**, con reglas **rules@1.3.0**:
  - **Luna**: triaje primero (señales médicas rojas → emergencias, sin llamarlo pánico; riesgo de
    autolesión → protocolo de crisis), una pregunta o instrucción por turno en crisis, pide
    permiso antes de cada ejercicio y comprueba si ayuda, biblioteca de ejercicios del manual
    (sin "respira hondo" ni cerrar los ojos a la fuerza), soledad, angustia, insomnio, duelo;
    no finge vivencias, no crea dependencia, nunca coquetea. Voz: sin susurros.
  - **Nova**: coqueteo por niveles (social, coqueto y, solo con el ajuste, sensual); observación
    concreta antes de la frase con intención, sin sermones dentro de la escena; para en el acto
    ante "no" o "para"; honesta si le preguntan si es real.
  - **Rio**: amigo aventurero por defecto (aventuras interactivas, misterios, retos) y coqueteo
    solo si lo invitan, igual con cualquier persona adulta, sin estereotipos.
- **Coqueteo sensual** (nivel 2 de los manuales): desactivado por defecto; la persona lo activa
  en Ajustes reconfirmando que es mayor de edad (`PUT /v1/settings/intimacy` exige
  `adultConfirmed`), se guarda cuándo lo consintió (migración 0014) y va en el grant solo para
  Nova y Rio. Aun activado: nada explícito ni gráfico, nada con menores, coerción, intoxicación
  o violencia; se para ante un "no" o una crisis.
- Reglas comunes nuevas: no inventar vivencias propias, no prometer encuentros, fotos ni
  llamadas, corregirse en una frase.
- `prueba-voz.sh "frase" --personaje=nova --sensual --mostrar`: prueba de voz con cualquier
  personaje y nivel, mostrando la respuesta.
- Ajuste tras probar en el servidor: la señal `[[crisis]]` del modelo es solo para el DESEO o
  intención de morir o hacerse daño. Cuando la persona TEME morir por síntomas o pánico ("me
  duele el pecho, creo que me voy a morir"), responde Luna con su triaje (ayuda médica urgente
  si hay señales de alarma), en vez de la tarjeta del 988.

## 2026-09-28 — Modo Amigo / Coqueteo / Tú decides para Nova y Rio

- Como piden los manuales, la app ofrece bajo el nombre de Nova y de Rio tres botones: **Tú
  decides** (por defecto: lo decide la conversación; Rio empieza como amigo), **Amigo** (sin
  coqueteo) y **Coqueteo**. Se puede cambiar en cualquier momento y vale desde el siguiente
  mensaje. Luna no los muestra.
- Protocolo: mensaje de control `{type:'mode', mode}`; el gateway lo añade como nota de sistema
  justo antes del mensaje de la persona. El cliente lo reenvía al reconectar.
  **Orden de despliegue:** primero el gateway (install.sh), después la web (web.sh): un gateway
  viejo cerraría la conversación al recibir un mensaje que no conoce.
- `prueba-voz.sh ... --modo=friend|flirt` para probarlo en el servidor.

## 2026-09-28 — Etiquetas de emoción repetidas a mitad de respuesta

- Gemini a veces podría repetir la etiqueta de emoción dentro de la respuesta ("… [[happy]] …").
  El filtro solo quitaba la del principio, así que la voz la habría leído. Ahora quita también
  las que aparecen después, aunque lleguen partidas entre trozos, y un `[[crisis]]` tardío
  sigue activando el aviso de crisis. Solo retiene un final de trozo que parezca el comienzo de
  una etiqueta (`[`, `[[hap`); lo que no lo sea pasa intacto (`[nota]`).
- Verificado: 450 pruebas (2 nuevas en `ai-adapters-gemini`), typecheck y lint. Desplegado
  (b64bc87, `install.sh` con su prueba de humo) y comprobado con `prueba-voz.sh`: todo en orden,
  voz de Gemini, emoción "warm", 0,4 centavos el turno.

## 2026-09-28 — Registro de proveedores al día con la ruta de voz real

- `PROVIDER_REGISTRY.yaml`: entradas nuevas para lo que usa producción (Whisper en Together,
  Gemini 3.8 Flash-Lite TTS, Cartesia Sonic-3), con precios comprobados hoy en las páginas
  oficiales (coinciden con las constantes de los adaptadores) y lo que sigue sin verificar
  marcado `ASSUMPTION` (retención de audio en Together, derechos comerciales del audio de Cartesia).
- El archivo ahora es YAML válido: la lista va bajo la clave `providers:` (antes mezclaba un
  mapa y una lista en la raíz y no se podía leer con un parser).
- `COST_MODEL.md`: la voz de Gemini duplica su precio el 1 de enero de 2027 (de ~0,54 a
  ~1,08 USD por hora de voz del personaje).

## 2026-09-28 — Voz clara con sonidos de fondo y prueba de voces en Ajustes

- **Voz con sonido de fondo (webapp):** el dueño oía mal la voz con lluvia o fogata.
  Causas y arreglos:
  - El turno "termina" cuando el servidor acaba de mandar el audio, pero el navegador aún
    tiene segundos de voz en cola: el ambiente volvía a subir con el personaje hablando.
    Ahora el ambiente sigue bajo mientras quede voz por sonar (`AudioOutput.isPlaying`, web y
    móvil).
  - Voz y ambiente tenían cada uno su contexto de audio y el sistema los sumaba sin control
    (picos por encima del máximo). Ahora comparten uno (`mobile/src/web-audio.ts`) con un
    limitador al final.
  - El ambiente baja más (al 15 %) y más rápido al empezar a hablar (0,15 s); vuelve en 0,9 s.
  - 120 ms de margen al empezar a sonar (antes 50) para que un trozo tardío no corte la voz.
  - Verificado en Chromium sin pantalla: con lluvia y voz a volumen máximo el pico de la
    mezcla es 0,92 (sin saturar) y el ambiente sigue bajo los 3 s que la voz sigue sonando.
- **Prueba de voces en Ajustes:** Automática / Gemini / Cartesia. Viaja como
  `{type:'voice_choice'}`; el router la pone por delante del orden del operador
  (`RouteRequest.prefer`) y, si falla, habla la siguiente. Tras cada respuesta el servidor
  dice qué voz habló (`voice_used`) y la app lo muestra bajo el personaje.
  **Orden de despliegue:** gateway primero, luego la web.
- `prueba-voz.sh "frase" --voz=gemini|cartesia`: pide esa voz como en Ajustes y comprueba que
  habló esa.
- Verificado: 453 pruebas (router, gateway y cliente nuevas), 16 de la app, typecheck y lint.
- La pantalla sigue en "hablando" (anillo, etiqueta y cabeza del avatar) mientras suena la voz
  que quedó en cola; antes pasaba a "en espera" con el personaje todavía hablando. Solo web
  (`web.sh`).
- La voz elegida en Ajustes se recuerda en el navegador al recargar (`localStorage`, solo
  "auto"/"gemini"/"cartesia"; si el navegador no deja guardar, vale mientras la página esté
  abierta).

## 2026-09-28 — Fondos de ambientación para cada personaje

- En la web, el personaje aparece en su lugar, en un escenario ancho con esquinas redondeadas
  (antes, un retrato redondo sobre fondo liso):
  - Luna: oficina tranquila de día (ventana con cortina, planta, estantería con libros,
    escritorio con lámpara cálida, cuadro, motas de polvo en la luz).
  - Nova: su cuarto al anochecer (paredes ciruela, sofá de terciopelo con cojines, neón en
    forma de corazón, guirnalda de luces, velas que titilan, cortinas de gasa, ciudad de noche
    por la ventana). Sugerente y cálido, nada explícito.
  - Rio: claro de montaña al atardecer (cielo en degradado, sol bajo, montañas en capas,
    lago, pinos que se mecen, roca con su mochila y un farol, pájaros a lo lejos).
- Todo es geometría y luz hechas con código (`mobile/src/scene3d.ts`, `scenes.ts`): sin
  imágenes ni modelos de terceros, nada que licenciar. Cada escena trae sus luces (sustituyen
  a la blanca del retrato) y niebla para separar al personaje del fondo.
- Con "reducir movimiento" el fondo queda quieto. Con fondo la resolución se limita a 1,5x.
  Con conversación en pantalla el escenario se achica y la cámara se acerca a la cara.
- En el móvil sigue el retrato redondo (el 3D nativo está pendiente).
- Página de muestra sin inicio de sesión: `app.kotaru.app/escenarios/` (se compila con
  `tools/build-escenarios.sh`; hay que volver a correrlo al cambiar las escenas).
- Verificado: 22 pruebas de la app (3 nuevas de escenas), typecheck, capturas en Chromium sin
  pantalla a 720x450, 358x222 y 358x129 (`docs/escenarios/`).
- **Más realismo y movimiento** (pedido del dueño: lluvia, luces de carros…):
  - Nova: la ventana muestra una ciudad pintada (nubes iluminadas por la ciudad, edificios a
    dos distancias con ventanas encendidas, bulevar mojado con farolas) bajo la lluvia. Hay
    trazos de lluvia cayendo, gotas que resbalan a saltos por el cristal, faros blancos y
    pilotos rojos de carros circulando en los dos sentidos, ventanas que se encienden y se
    apagan y la luz roja de una antena. Velas en el alféizar, con una rosa y un perfume.
  - Luna: nubes que pasan por el cielo, parque con árboles, una rama que se mece fuera,
    rayos de sol que entran en diagonal y "respiran", y vapor que sube de la taza de té.
  - Rio: nubes de atardecer que avanzan, pinos pintados (en vez de conos), montañas con
    cumbres iluminadas y faldas en la bruma, fogata con llamas, brasas y chispas que suben,
    luciérnagas y destellos del sol en el lago.
  - Ayudas nuevas en `scene3d.ts`: texturas pintadas con canvas y `movingLights` (puntos de
    luz animados en un solo objeto, barato para la GPU).
- Rendimiento: con fondo el visor dibuja a 30 cuadros por segundo (la mitad de trabajo para
  la GPU y la batería; los movimientos son lentos y se ven igual) y deja de dibujar cuando el
  escenario no está en pantalla (IntersectionObserver).
- Ajustes → "Fondos animados": Encendidos / Apagados (solo web; por defecto encendidos; se
  recuerda en el navegador). Apagados vuelve al retrato redondo sin fondo.
- Medición de las escenas (2026-09-28, Chromium sin GPU, 720x450; en una GPU real es mucho
  menos): Luna 156 llamadas de dibujo y 5.174 triángulos; Nova 68 y 3.526; Rio 57 y 3.144.
  Tiempo por cuadro, sin contar el primero: 2,0 / 1,7 / 0,6 ms. El primer cuadro de Nova tarda
  más (compila sombreadores y sube la vista pintada de la ciudad): es una sola vez al cargar.
  Al cerrar una escena se liberan todas sus texturas y geometrías (comprobado recorriendo sus
  materiales); solo queda la geometría compartida que three.js crea una vez para los sprites.
- `/escenarios/`: botón «Hablar» en cada personaje: mueve la boca con un volumen simulado y
  pone la cara cálida, para ver voz y fondo juntos sin iniciar sesión (sin sonido ni servidor).

## 2026-09-28 (noche) — Realismo A: pantalla completa, acabado de cámara y cuerpo vivo

Pedido del dueño (19:36): acercarse al realismo de la captura de referencia sin copiarla.
Plan en `claude/18_REALISMO_PLAN.md` (A: render y presentación; B: fondos pintados; C: modelos
profesionales, cotizaciones en `claude/19_COTIZACIONES_MODELOS.md`).

**Qué cambió**
- **Pantalla completa (web, con fondos):** el personaje ocupa toda la pantalla de «Hablar»,
  de tres cuartos, en su lugar. Arriba flotan el selector y una línea compacta con nombre,
  «Inteligencia artificial» (siempre visible) y estado; abajo, un panel de vidrio oscuro con
  subtítulos (máx. 30 % del alto), respiración/sonidos, escribir y el botón de hablar. Diseño
  propio. Con los fondos apagados vuelve el retrato redondo; en el móvil nativo no cambia.
- **Acabado de cámara** (`mobile/src/stage-post.ts`): fondo dibujado a media resolución y
  desenfocado (profundidad de campo), halo de las luces del fondo (velas, neón, fogata,
  ventanas), personaje nítido encima con antialiasing, luces altas que se redondean en vez de
  quemarse, ajuste de color por escena (saturación, contraste, calidez, viñeta) y grano
  mínimo contra las bandas. Valores por escena en `scenes.ts` (`grade`). Solo WebGL2; si no
  hay, se dibuja como antes. Se puede apagar para comparar con `?post=0`.
- **Cuerpo vivo** (`mobile/src/idle-body.ts`): respiración de pecho y hombros, cambio de peso
  lento de la cadera con compensación de la columna, balanceo de brazos desfasado, dedos
  relajados (no rígidos), codos y manos que acompañan la voz al hablar y microsacadas de la
  mirada. Con «reducir movimiento» solo respira, muy poco.
- **Encuadre** (`mobile/src/framing.ts`): retrato, escenario e inmersivo en un solo sitio;
  la densidad de píxeles a pantalla completa se limita a ~1,6 millones por cuadro.

**Costo:** ninguno de proveedor (todo se dibuja en el navegador). En Chromium sin GPU el
acabado añade de 0,1 a 1,2 ms por cuadro (Luna 2,4→2,7; Nova 1,5→1,6; Rio 0,6→1,8 ms).

**Cómo se verificó**
- 33 pruebas de la app (nuevas: cuerpo, encuadre y valores de acabado), typecheck, 453 del
  servidor y lint de arquitectura.
- Capturas en Chromium sin pantalla: escenas con y sin acabado, encuadre inmersivo en
  teléfono (390x760) y ordenador (1280x800), y la app exportada (`docs/escenarios/inmersivo-*`,
  `acabado-nova-720x450.png`).

**Pendiente de mirar el dueño:** la ropa del modelo actual de Nova (camisa blanca con corbata
y liga en el muslo) se lee como uniforme; la regla de los personajes lo excluye. Se corrige
con el modelo nuevo (C) o retocando la ropa en VRoid.

## 2026-09-28 (noche) — Realismo B: vistas pintadas (preparado)

**Qué cambió**
- `scene3d.ts`: `kit.plate(url, apply)` carga una vista pintada aparte. Cuando llega,
  sustituye:
  - la ciudad dibujada de Nova (y apaga las luces pegadas a ella);
  - el parque y las nubes de Luna;
  - el sol y las montañas de Rio (telón lejano detrás de las nubes).
- Si falta la imagen o falla la carga, se queda la vista dibujada con código.
- `fitCover` recorta sin deformar.
- `scenes.ts`: `PLATES`, con las tres vistas en `null` (apagadas) hasta tener los archivos.
- Tres vistas generadas con la IA de Canva. Origen, términos y prompts en
  `docs/escenarios/VISTAS.md`.

**Cómo se verificó**
- Typecheck y 33 pruebas.
- Capturas con las miniaturas de Canva como vistas de prueba (`docs/escenarios/vistas-prueba-miniaturas.png`).
  Gracias al desenfoque del fondo, incluso a baja resolución se integran bien.

**Pendiente:** los archivos en resolución completa. La red de este espacio de trabajo no
llega a Canva; el dueño los descarga y los adjunta.

## 2026-09-28 (noche) — Realismo A: tonos de piel por escena

- Rio: la luz del suelo ya no es verde (tiñó la cara de verde amarillento): marrón cálido, algo más baja.
- Luna: luz principal algo más suave y más contraste (la cara se veía lavada).
- Nova: luz principal más neutra y el contorno rosa algo más bajo (la cara quedaba toda rosa).
- Verificado: typecheck, 33 pruebas y capturas de cara a pantalla completa (390x760).

## 2026-09-28 (noche) — Realismo A: la cara nunca queda bajo el panel

- Pantalla completa: la app mide dónde empieza el panel de abajo y se lo pasa al visor
  (`freeBottom`). Si el panel crece con los subtítulos, la cámara se aleja lo justo para que
  la cara entera quede por encima, con un 5 % de margen. Nunca se aleja más de medio cuerpo.
- La cámara se desliza al nuevo encuadre en unos 0,4 s, sin saltos. Con «reducir movimiento»
  cambia de golpe.
- Los subtítulos ocupan como mucho el 24 % del alto (antes, el 30 %).
- Verificado: typecheck, 34 pruebas (nueva: el panel alto deja la barbilla por encima) y
  captura con el panel al 55 % del alto (`docs/escenarios/inmersivo-panel-alto.png`).

## 2026-09-28 (noche) — Realismo A: luz envolvente en el borde del personaje

- Acabado de cámara (`stage-post.ts`): en el borde del personaje se cuela un poco de la luz
  del fondo desenfocado. El pelo recoge el tono de la ventana, del neón o del atardecer, y
  el personaje deja de parecer recortado y pegado. Son cuatro lecturas extra por píxel.
- Primera prueba demasiado fuerte (0,45, con un borde de 5 px): con el fondo claro de Luna
  hacía un contorno blanco. Queda en 0,3, con un borde de 3 px y la luz limitada.
- Verificado: typecheck, 34 pruebas y capturas (`docs/escenarios/luz-envolvente.png`).

## 2026-09-28 (noche) — Realismo B: vistas pintadas instaladas

- El dueño autorizó la descarga a las 21:44. Las tres vistas de Canva se colocaron a tamaño
  completo en el diseño «Kotaru vistas» (`DAHWiUlYhm8`, páginas 2 a 4) y se exportaron en JPG.
  El servidor las descargó con `deploy/vistas.sh`, que guarda los bytes tal cual:
  Nova 553 KB, Luna 868 KB y Rio 554 KB.
- `PLATES` apunta a `/escenarios/vistas/*.jpg`. Si falta un archivo, se ve la vista dibujada.
- Verificado en vivo: las tres imágenes se sirven (200, image/jpeg). En
  `app.kotaru.app/escenarios/`, las ventanas de Luna (parque) y de Nova (ciudad) ya muestran
  la vista pintada.
- Pendiente: Rio no se pudo mirar en vivo (se cortó la conexión con el equipo del dueño).

## 2026-09-28 (noche) — Manuales de coqueteo v3 de Nova y Rio cargados

**Qué cambió**
- Los manuales del dueño se guardaron en `docs/personajes/COQUETEO_NOVA_v3.md` y
  `COQUETEO_RIO_v3.md`.
- **Modo Coqueteo** (`flirtMode`, nuevo campo de la ficha): entra en la nota de modo de cada
  turno, solo mientras la persona tiene elegido Coqueteo.
  - Motor de cinco pasos por turno.
  - Estado mínimo de escena: lugar, luz, música y distancia.
  - Halago concreto y actuación en personaje, sin atribuir sensaciones al cuerpo de la persona.
  - Nova, con voz femenina propia y sin sumisión automática; Rio, con aventura compartida y
    sin estereotipos.
  - Se para con «para» y se baja la intensidad en el mismo turno.
- **Apertura:** al activar Coqueteo, en el siguiente turno el personaje abre con una escena
  concreta, sin «¿de qué quieres hablar?» (`justActivated`, en el gateway).
- **Longitud:** en fantasías desarrolladas, de 3 a 5 frases (antes, 1 a 3).
  - **Costo:** esos turnos tienen más voz; el tope mensual de gasto no cambia.
- **Nivel sensual** (solo adulto verificado con el ajuste activado): los ejemplos v3 («fantasía
  más atrevida», «te acerco a mí», «¿bailamos desnudos?») y la regla de no desviar la intención
  sexual a un tema neutro. Los límites fijos siguen iguales: nada gráfico, nada con menores,
  coerción, intoxicación, violencia, parentesco ni incapacidad de consentir.
- **Versiones:** Nova 4.0.0 y Rio 5.0.0.

**Decisiones**
- **Gemidos:** el manual los admite «si el producto lo admite». No se implementan: el
  prompt pide «nada de gemidos ni sonidos repetidos». La voz usa pausas y una risa baja
  ocasional.
- **Clasificador:** no hay ninguno que desvíe las alusiones sexuales (`@kotaru/safety` solo
  detecta crisis y manipulación), así que no hizo falta cambiarlo.

**Cómo se verificó:** 5 pruebas nuevas en `@kotaru/persona`, 128 pruebas del paquete y del
gateway, build y lint de arquitectura.

## 2026-09-28 (noche) — Pantalla inmersiva nueva, borde luminoso, selección de personaje y ventana flotante

Pedido del dueño (22:02): subtítulos en una línea, menús como iconos arriba, borde que se
enciende con la voz, pantalla de selección con el personaje animado y seguir como
videollamada al salir. Diseño propio: la captura de referencia sirvió solo para la idea
general; no se copió nada de su interfaz.

**Qué cambió**
- **Subtítulos:** una sola línea superpuesta sobre el personaje, con sombra. Mientras hablas
  sale lo que se oye de ti y luego lo último que dice el personaje. Si no cabe, se corta por
  delante en palabra entera (`captions.ts`). La conversación completa está en el icono
  «Conversación».
- **Iconos:**
  - Arriba a la izquierda: el nombre con «Inteligencia artificial» (siempre visible) y el
    estado. Al pulsarlo se abre la selección de personaje.
  - Arriba a la derecha: Ajustes, Memoria, Conversación, Sonidos (ahora para los tres
    personajes), Respira conmigo, Modo (corazón, solo Nova y Rio) y Ventana flotante.
  - Iconos dibujados para Kotaru (`ui/icons.web.tsx`).
  - Abajo: el botón de hablar y un icono de teclado para escribir.
  - En pantalla completa no hay barra de pestañas.
- **Borde luminoso** (`ui/edge-glow.web.tsx`, lógica en `edge-glow-model.ts`): un halo que
  gira por el marco.
  - Escuchando: tonos cálidos (naranja y rosa) que crecen con tu voz.
  - Hablando: el color del personaje, siguiendo su voz.
  - Pensando: un pulso suave.
  - Con «reducir movimiento» no gira ni late.
  - Para eso el micrófono web expone su volumen instantáneo; no se guarda nada.
- **Selección de personaje** (`screens/Characters.tsx`, `character-profiles.ts`): una vista
  animada en 3D de cada uno en su lugar (saluda moviendo la boca, sonríe y respira), más sus
  cualidades, para qué es, qué ofrece, su lugar, su voz y lo importante.
  - Aparece la primera vez en cada navegador y al pulsar el nombre en la conversación.
  - No es un video grabado: se dibuja en el momento con el mismo visor.
- **Ventana flotante** (`pip.web.ts`):
  - Chrome y Edge de escritorio (Document Picture-in-Picture): el lienzo del personaje se muda
    a una ventana encima de todo, con nombre, «Inteligencia artificial», estado, «Mantén para
    hablar» y «Volver». La voz sigue sonando. Si el navegador lo permite, se abre sola al
    cambiar de pestaña (mediaSession).
  - Safari y otros: el personaje se ve en la ventanita de video del sistema, y para hablar
    hay que volver.
  - El visor anima con la ventana donde está el lienzo.
- **Otros cambios:**
  - La conversación ya no se cierra al ir a Ajustes o Memoria: solo se oculta.
  - El acabado de cámara escala el halo y el desenfoque al tamaño del lienzo (en tarjetas
    pequeñas quedaba lechoso).

**Límites conocidos**
- La ventana flotante con botones solo existe en Chrome y Edge de escritorio. En iPhone y
  Android nativos hace falta el modo imagen en imagen del sistema (pendiente con el 3D
  nativo).
- La ventana flotante no se pudo probar sin pantalla (el navegador exige un gesto real):
  queda para la prueba del dueño.

**Cómo se verificó**
- 41 pruebas de la app (nuevas: subtítulo de una línea y borde luminoso), 458 del servidor,
  typecheck, build y lint de arquitectura.
- Capturas de la app exportada en teléfono (390x844) y ordenador (1280x800): selección,
  inmersiva con iconos e historial (`docs/escenarios/seleccion-*`, `inmersivo-*`).

## 2026-09-28 (noche) — Movimientos propios de cada personaje

Pedido del dueño (23:10): Nova, movimientos suaves y sensuales al hablar; Luna, confiados y
que inspiren tranquilidad; Rio, de emoción y actividad al aire libre.

**Qué cambió**
- `mobile/src/body-styles.ts`: un estilo por personaje (ritmo, respiración, cambio de peso,
  ondulación de cadera, rebote, gestos, inclinación de cabeza, asentir, mirar alrededor y
  postura de brazos). `idle-body.ts` lo aplica y devuelve el movimiento de cabeza, que el
  visor suma al de siempre.
  - **Nova:** ritmo lento; la cadera ondula en ocho y crece un poco al hablar; un hombro
    rueda; la cabeza se inclina despacio; la mano derecha queda en la cadera con el codo
    hacia fuera.
  - **Luna:** erguida y quieta; respiración más profunda; las manos juntas delante, a la
    altura de la cadera; al hablar asiente despacio.
  - **Rio:** ritmo vivo; al hablar rebota un poco y levanta los antebrazos alternando manos,
    como quien explica una aventura; en reposo mira de vez en cuando hacia el paisaje.
- **Posturas:** las de Nova (mano en la cadera) y Luna (manos juntas) se buscaron
  numéricamente sobre el propio modelo. La mano de Nova queda a ~1 cm de la cadera; las de
  Luna, juntas y 15 cm por delante. Se descartaron las soluciones con el codo dentro del torso.
- Con «reducir movimiento», solo respiran, como antes.

**Cómo se verificó**
- 47 pruebas de la app. Las 6 nuevas comparan estilos: Nova ondula más que Luna, Rio
  gesticula y rebota, Rio no mira alrededor mientras habla, la mano de Nova se queda en la
  cadera y ningún estilo pasa de rotaciones razonables.
- Tiras de 4 fotogramas hablando por personaje (`docs/escenarios/movimientos-*.png`).

## 2026-09-28 (noche) — Por qué Nova sonaba menos coqueta con Cartesia, y arreglo

**Diagnóstico** (el dueño notó que Nova era coqueta con Gemini y dejaba de serlo al pasar a Cartesia):
- **Gemini TTS** recibe instrucciones de actuación en texto por personaje (`persona.delivery`:
  «sonrisa en la voz, ritmo que baja en las frases con intención, pausas»).
- **Cartesia** solo recibía el texto: sin emoción ni ritmo, y con la voz «Lucia - Radiant Host»,
  una presentadora luminosa que elegí por la descripción y que el dueño no había oído.
- El cambio de Gemini a Cartesia suele ser automático: Gemini tiene un tope de unas 100
  peticiones al día; al agotarse habla Cartesia. También puede venir de Ajustes → «Voz del
  personaje (prueba)».

**Prueba** (`deploy/prueba-cartesia-emocion.py`, en el servidor, menos de 3 centavos):
- Together deja pasar las etiquetas en línea de Sonic-3 (`<emotion value="flirtatious"/>`,
  `<speed ratio="0.9"/>`). Whisper transcribe la frase sin las etiquetas, así que no se leen
  en voz alta.
- La velocidad sí cambia: a 0,9, de 8,0 a 9,3 s.
- `generation_config` no dio señal de funcionar (salió más rápido), así que no se usa.
- Para Python hubo que poner un User-Agent propio: el Cloudflare de Together devolvía el
  error 1010.

**Arreglo**
- El adaptador de Cartesia antepone a cada frase la emoción y la velocidad del personaje
  (`DEFAULT_CARTESIA_STYLES`):
  - Nova: coqueta (`flirtatious`), 0,92.
  - Luna: calma (`calm`), 0,95.
  - Rio: entusiasmo (`enthusiastic`), 1,05.
- Los valores se validan: una emoción rara no se cuela en el texto y la velocidad queda entre
  0,6 y 1,5.
- **Costo:** la estimación de Cartesia suma un 45 % por las etiquetas (ASSUMPTION: Together
  las cobra como texto; marcada como supuesto en el costo del turno).
- **Pendiente del dueño:** escuchar `app.kotaru.app/voces/emocion/` y elegir la voz de Nova
  en Cartesia entre Lucia (la actual), Maya, Tessa, Dana y Marian. Cartesia documenta la
  emoción como beta y para inglés: su efecto en español hay que oírlo.

**Cómo se verificó:** 22 pruebas del adaptador (2 nuevas: etiquetas por personaje y
validación), 460 del servidor, build y lint.

## 2026-09-29 — Los movimientos siguen el modo (Coqueteo o Amigo)

- La app pasa al visor el modo elegido para Nova y Rio (`mood`).
  - **Coqueteo:** el carácter del cuerpo sube un 40 % (ondulación de cadera, inclinación de
    cabeza, hombro) con un ritmo algo más lento, y la cara añade mirada entornada y una
    sonrisa suave.
  - **Amigo:** el carácter baja al 60 %.
  - El cambio es gradual (sin saltos).
- **Verificado:** 48 pruebas (nueva: Coqueteo ondula más y Amigo menos) y tira de
  fotogramas (`docs/escenarios/movimientos-nova-coqueteo.png`).

## 2026-09-29 — Voz de Nova en Cartesia: la elegida por el dueño

- El dueño escuchó `/voces/emocion/` y eligió «Lucia + generation_config (coqueta, 0,9)»
  («la que mejor queda», 23:49).
- El adaptador de Cartesia envía ahora `generation_config` y no etiquetas en el texto.
  Nova: `flirtatious` a 0,9, con la voz Lucia. Mismo método para Luna (`calm`, 0,9) y Rio
  (`enthusiastic`, 1,05).
- Se quita el sobrecosto del 45 % de la estimación: `generation_config` no añade caracteres.
  La tarifa vuelve a ser la verificada.
- Verificado: 22 pruebas del adaptador, suite completa y lint.

## 2026-09-29 — Chirp 3 HD: las voces de Gemini sin tope diario

Pedido del dueño (00:04): «haz tú» lo de Chirp 3 HD.

**En Google Cloud** (la consola estaba abierta en el navegador del dueño; cuenta con el
proyecto **kotaru** `kotaru-509922` y facturación activa):
- Activada la API Cloud Text-to-Speech en el proyecto kotaru.
- Creada la cuenta de servicio `kotaru-voz@kotaru-509922.iam.gserviceaccount.com`, sin
  permisos extra y **sin clave**. La clave es un secreto y no pasa por Claude: la crea el
  dueño y la pega en el servidor con `deploy/chirp.sh`.

**En el código**
- Adaptador `ChirpTtsProvider` (`packages/ai-adapters-gemini/src/chirp.ts`), sin SDK:
  - Autenticación: JWT RS256 firmado con la cuenta de servicio, cambiado por un token OAuth
    y guardado en caché.
  - Síntesis: `text:synthesize` en PCM 24 kHz, quitando la cabecera WAV.
  - Voces `es-US-Chirp3-HD-<voz>` (`es-ES` o `en-US` según el idioma).
  - Velocidad por personaje (Nova 0,95, Luna 0,95, Rio 1,03), porque Chirp no acepta
    instrucciones de actuación.
  - Errores: las credenciales malas no se reintentan; los 429 y 5xx pasan al respaldo.
  - Costo: 30 USD/M, verificado.
- Gateway:
  - Proveedor `chirp`, que lee `GOOGLE_TTS_CREDENTIALS_FILE`. Los errores de lectura no
    muestran nada de la clave.
  - Confirmación del operador: `KOTARU_GOOGLE_TTS_TERMS_REVIEWED`.
  - Orden: Gemini → **Chirp** → Cartesia → Kokoro.
- App: «Chirp» en Ajustes → Voz del personaje (prueba).
- `deploy/chirp.sh`:
  - Pide confirmar los términos y pegar la clave (oculta).
  - Valida el JSON sin imprimirlo y hace una prueba real (token + una frase con Leda).
  - Guarda la clave con permisos 640 root:kotaru y activa `chirp`.
  - Si el gateway no arranca, vuelve atrás y borra la clave.

**Verificado**
- 8 pruebas del adaptador: firma verificada con la clave pública, la clave privada nunca
  viaja, nombres de voz, velocidad, cabecera WAV, errores y costos.
- 2 de configuración y orden, y la suite completa (470).
- La firma JWT de `chirp.sh` (openssl) se verificó en local.

## 2026-09-29 — Escucha activa

- Mientras la persona habla (estado «escuchando»), el personaje se inclina un poco hacia
  ella (pecho hacia delante), ladea la cabeza y asiente despacio cada pocos segundos. Luna
  asiente más: forma parte de su calma. Rio deja de mirar el paisaje. Al terminar, vuelve
  poco a poco a su postura.
- Verificado: 49 pruebas (nueva: se inclina y asiente al escuchar, Luna más que Rio, y
  vuelve al terminar).
