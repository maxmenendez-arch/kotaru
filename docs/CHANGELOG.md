# CHANGELOG.md — Kotaru

Formato: fecha, fase, qué cambió, archivos afectados, cómo se verificó.

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
