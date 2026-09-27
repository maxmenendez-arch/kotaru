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
