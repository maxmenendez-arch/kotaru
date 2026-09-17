# DECISIONS.md — Kotaru

Registro de decisiones. Formato: ADR corto. Estado: `proposed` | `accepted` | `superseded`.

## Decisiones del fundador — 2026-09-17

### D-001 — Entidad contratante
- Estado: **accepted 2026-09-17 — Estados Unidos**
- Contexto: determina elegibilidad de cuenta en proveedores de IA, método de pago, retención fiscal sobre ingresos de la App Store de EE. UU. y confianza en revisión de tienda.
- Recomendación: entidad en Estados Unidos, **separada** de la LLC existente del fundador.
- Motivo decisivo: Panamá no tiene tratado fiscal con EE. UU.; el ingreso de la App Store estadounidense es de fuente estadounidense.
- Pendiente: confirmación de un asesor fiscal transfronterizo.
- Bloquea: verificación oficial de precios de proveedores (Sprint 0).

### D-002 — Objetivo inmediato: producto en tienda
- Estado: accepted
- Decisión: publicar en App Store y generar ingresos. No es un prototipo de inversionista.
- Consecuencia: borrado y exportación de cuenta suben al Sprint 1; RevenueCat sandbox en Sprint 3; se agrega Sprint 5 de alfa cerrada y envío a tienda.
- Reversión: si aparece un proceso de inversión que exija demo antes que producto.

### D-003 — Posicionamiento de la relación
- Estado: accepted con reserva
- Pedido del fundador: lo más similar posible a la app competidora.
- Decisión: se adopta la **categoría y el conjunto de funciones**; se rechaza toda imitación de marca, UI, personajes, textos, prompts, voces, animaciones o código.
- Implementación: modos de relación seleccionables sobre una persona base cálida y honesta — amistad, acompañamiento motivacional, entretenimiento y práctica de idioma.
- Consecuencia: la superficie de pruebas de seguridad se multiplica; el Sprint 4 crece.
- Regla invariante: los cuatro modos comparten una política de seguridad única que el usuario no puede desactivar.

### D-004 — Clonación de voz
- Estado: accepted
- Decisión: post-MVP. `clonedFromConsentId` permanece en el contrato de `VoiceConfig` sin implementación.
- Consecuencia: la suplantación de voz sale del threat model del MVP.
- Reversión: si la validación muestra que la voz personalizada es determinante para la conversión.

### D-005 — Ventana de lanzamiento
- Estado: accepted
- Decisión: sin fecha externa; máxima velocidad razonable. Once semanas desde el cierre de Fase 0 hasta el primer envío a revisión.
- Palanca de velocidad autorizada: un solo rig 3D y tres personas.
- Palanca prohibida: seguridad, privacidad y medición de costo.

## Decisiones técnicas

### ADR-001 — Avatar: Three.js sobre Expo GL
Ver `docs/adr/ADR-001-avatar.md`.

### ADR-002 — Transporte realtime: WebSocket
Ver `docs/adr/ADR-002-realtime-transport.md`.

### ADR-003 — Ruta de voz primaria: modular
- Estado: accepted
- Decisión: VAD → STT streaming → LLM → TTS streaming. El realtime speech-to-speech se implementa como interfaz y adaptador simulado, apagado tras feature flag.
- Motivo: no existe un precio verificado que justifique su costo por minuto frente a la ruta modular.
- Reversión: un proveedor realtime verificado alcanza paridad de calidad por debajo de la tarifa efectiva modular.

### ADR-004 — Push-to-talk como único modo de voz del MVP
- Estado: accepted
- Motivo: controla privacidad, controla costo y elimina la clase de fallos de escucha permanente.
- Reversión: la retención medida en alfa justifica el costo de manos libres.

## Decisiones anadidas tras la verificacion — 2026-09-17

### D-006 — Nombre del producto: bloqueado en rojo
- Estado: abierta, requiere decision del fundador
- Hallazgo: el nombre de trabajo anterior no paso el despeje y fue descartado. Existe una
  app publicada con esa grafia exacta en la App Store de EE. UU. (HigherGroundsTech LLC),
  los tres dominios primarios estaban tomados, hay una solicitud viva `PALS` (serie
  98789950) en clases 9 y 42 sobre software de chatbot conversacional, y la grafia no se
  leia como "pal + AI" en espanol, donde la sigla es IA.
- Recomendacion: cambiar ahora, mientras el costo es un documento.
- Respaldos propuestos: **Tomira** (1 antecedente USPTO, clase 15, sin relacion) y
  **Amiluna** (cero antecedentes). Dominios `.app` y `.ai` disponibles para ambos.
- Accion inmediata independiente de la decision: registrar los cuatro dominios (~USD 200).
- Pendiente: clearance search profesional sobre el nombre elegido.

### D-007 — Ruta de proveedores de lanzamiento
- Estado: accepted
- Primaria: AssemblyAI Universal-Streaming (STT) + Gemini 3.1 Flash-Lite (LLM)
  + Amazon Polly Neural (TTS). Costo verificado 0.52 USD/hora.
- Secundaria: Deepgram Nova-3 + OpenAI gpt-5.6-luna + Gemini 2.5 Flash TTS.
- Premium para plan superior: Deepgram Aura-2 (17 voces en espanol con codeswitching)
  o Gemini 3.8 Live en ruta realtime.
- Descartado: Volcengine/Doubao — EE. UU. no figura en disponibilidad ni en pagos.
- Sin verificar: Alibaba Model Studio — no publica precios de voz ni confirma espanol.
- Reversion: si Azure cotiza por debajo de Polly Neural con espanol equivalente,
  o si Alibaba publica precios de voz verificables con derechos comerciales claros.

### D-008 — Asignaciones de horas
- Estado: accepted
- Free 45 min, Connect 5 h, Close 12 h, Always 20 h.
- Always baja de las 35–50 h del plan original: a 50 h pierde dinero en cualquier
  regimen de comision.
- No se publica ninguna asignacion hasta verificar que ofrecen los competidores.

### ADR-005 — Comision de tienda al 15%
- Estado: accepted
- El modelo opera al 15% (programas para pequenos negocios de Apple y Google,
  bajo USD 1 millon anual), no al 30%.
- Reversion: al cruzar el millon de facturacion anual el regimen pasa a 30% y las
  asignaciones de horas deben recalcularse antes de ese momento, no despues.

## Segunda ronda de verificacion — 2026-09-17

### D-009 — Entidad panamena: descartada
- Estado: accepted (se mantiene Estados Unidos, D-001)
- Pregunta: si constituir en Panama abriria acceso a proveedores chinos.
- Hallazgo: no abre ninguno. BytePlus SI lista a Panama en disponibilidad pero NO
  en su tabla de metodos de pago. Alibaba y MiniMax ya son contratables desde EE. UU.
- Costos que anadiria: no existe tratado fiscal EE. UU.–Panama (verificado en la lista
  oficial del IRS), por lo que la retencion sobre ingresos de fuente estadounidense
  seria del 30% bajo IRC 1441-1443; Stripe no opera en Panama; la cuenta bancaria exige
  presencia fisica; Panama sigue en la lista de jurisdicciones fiscales no cooperativas
  de la UE (17 feb 2026).
- Pendiente para contador: la caracterizacion de los ingresos de App Store como regalia
  FDAP o beneficio empresarial decide entre 0% y 30%. Sin tratado no hay red de seguridad.
- Si BytePlus llegara a ser necesario, el camino seria una filial en Singapur, no Panama.

### D-010 — Idioma: no se renuncia al espanol
- Estado: accepted
- Pregunta: si ofrecer solo ingles permitiria reducir el costo drasticamente.
- Hallazgo: el ahorro maximo verificado es 0.024 USD/hora, un 4.6%. Ningun proveedor
  cobra por idioma en TTS: todos facturan por caracter al mismo precio. AssemblyAI cobra
  lo mismo por su modelo multilingue que por el de solo ingles.
- Dato que invierte la intuicion: los modelos solo-ingles suelen ser MAS caros.
  Together sirve Orpheus (solo ingles) a 15 USD/M y Kokoro-82M (9 idiomas) a 4 USD/M.
- Decision: se mantiene el espanol porque no cuesta nada. El ingles es la prioridad de
  lanzamiento en voces, contenido y soporte; el espanol queda activo.
- El eje de ahorro correcto es el nivel de modelo TTS, no el idioma.

### D-011 — Nivel de TTS: probar Kokoro-82M antes de fijar planes
- Estado: proposed, bloqueado por prueba de calidad
- Kokoro-82M servido por Together AI cuesta 4 USD/M de caracteres frente a 16 de Polly
  Neural: 0.23 USD/hora en vez de 0.52, un 55% menos, manteniendo espanol.
  Licencia Apache 2.0 limpia, sin marca de agua, gestionado por un tercero, sin GPU.
- Consecuencia si pasa la prueba: las asignaciones originales (Always 35-50 h) vuelven a
  ser viables con 50% de margen en el p95, incluso al 30% de comision.
- Lo que falta: ninguna fuente publica comparacion ciega de calidad frente a Polly Neural,
  ni confirma soporte de streaming de baja latencia. El espanol de Kokoro tiene 3 voces
  frente a 28 en ingles y usa fonemizador de respaldo.
- Accion: prueba A/B ciega con usuarios reales en el Sprint 0. Es el trabajo que mas
  dinero mueve de toda la fase.
- Autoalojar Supertonic 3 baja a 0.16 USD/hora pero tiene licencia OpenRAIL-M con
  restricciones propagables, punto de equilibrio en ~1.200 h/mes, y obliga a mantener
  Polly como respaldo de todos modos: no sustituye la integracion comercial, la anade.

### D-006 — Nombre del producto: KOTARU
- Estado: **accepted 2026-09-17 — el producto se llama Kotaru**
- `AI Listener`: ROJO. Ya existe la app con ese nombre exacto (Pocket Mate.AI LLC, App
  Store ID 6474230490, se describe como "mental wellness application"). Es descriptivo y
  por tanto practicamente irregistrable. Y senaliza salud mental: el USPTO ya clasifico
  "Listener" + chatbot en esa categoria, Illinois prohibio la IA para terapia en agosto
  de 2025 y Nevada y Utah aprobaron normas analogas. Choca con la regla de no-terapia.
- `Ainion`: AMBAR. Registrable y sin antecedentes, pero pronunciacion inestable (cuatro
  lecturas posibles), colision con "anion", y vecindario saturado en App Store
  (Ainio, Ainia, Aion, AInoon, Ainder, AINE).
- **Recomendado: Kotaru** (koh-TAH-roo). Cero antecedentes USPTO, ninguna app homonima,
  `kotaru.app` y `kotaru.ai` disponibles, pronunciacion inequivoca, raiz *koto* (palabra)
  que sugiere conversacion sin describirla. Alternativas: Mikora, Hoshira.
- Orden final: Kotaru > Mikora > Hoshira > Tomira > Amiluna > Ainion > AI Listener.
- **kotaru.app comprado el 17 de septiembre de 2026.** Es el dominio del producto: URL
  de soporte y de politica de privacidad (ambas exigidas por Apple y Google), correo y
  enlaces profundos. Lo opera Google con HTTPS obligatorio por HSTS preload.
- `kotaru.ai` y `getkotaru.com` descartados por ahora. El `.ai` cuesta unas ocho veces
  mas y su unico valor hoy es defensivo, con riesgo bajo para un nombre acunado sin
  presencia publica. `getkotaru.com` no captura el reflejo de teclear `.com`, porque lo
  que la gente teclearia es `kotaru.com`, que es de un tercero desde hace anos.
- Revision del `.ai`: cuando haya ingresos, o justo antes de gastar en identidad visual
  y marketing. Riesgo asumido conscientemente: si alguien lo registra mientras tanto,
  recomprarlo puede costar miles en vez de ochenta.

### D-012 — Arranque del Sprint 1
- Estado: accepted, en curso
- Monorepo TypeScript con npm workspaces creado en `kotaru/`. Se eligio npm en vez de
  pnpm porque node 22 y npm 10 ya estaban en la maquina y pnpm no: una dependencia menos
  que instalar y explicar.
- Entregado: `@kotaru/ai-contracts` (seis interfaces + tipos de router, cero dependencias),
  `@kotaru/ai-adapters-mock` (simuladores deterministas de STT, LLM, TTS, moderacion y
  embeddings), `@kotaru/ai-router` (restricciones duras, puntuacion, circuit breaker,
  presupuesto, kill switch), `@kotaru/telemetry` (eventos de costo sin contenido).
- Verificado: `tsc --build` en modo estricto sin errores, 37 pruebas en verde,
  lint de arquitectura en verde.
- Defecto real encontrado y corregido durante las pruebas: el nivel `premium` del router
  elegia la ruta barata. Escalar solo el peso de calidad no bastaba; con una brecha de
  precio grande la penalizacion de costo se comia la ventaja de calidad. Ahora el nivel
  reescala dos pesos: calidad x2 y costo x0.25 en premium, calidad x0.5 y costo x2 en
  economico.
- Las tarjetas de tarifas incorporan las tarifas verificadas del 17 de septiembre, con
  `basis: verified` y `verifiedAt`, de modo que el costo por turno es real aunque el
  audio sea simulado.

### D-013 — Sprint 2: orquestador del turno y grants de sesion
- Estado: accepted, en curso
- Entregado: `@kotaru/orchestrator` (ciclo completo del turno) y `@kotaru/gateway`
  (grants firmados y protocolo de tiempo real). 57 pruebas en verde, typecheck
  estricto sin errores, lint de arquitectura en verde.

- **Generacion y sintesis corren en paralelo.** El LLM emite tokens mientras un buffer
  de oraciones entrega frases completas al TTS. Esperar la respuesta entera antes de
  sintetizar dispararia el tiempo al primer byte de audio, que es la metrica que decide
  si una conversacion se siente viva.

- **El fallback de proveedor solo actua antes del primer evento emitido.** Decision
  deliberada: una vez que el usuario oye la primera silaba, cambiar de voz a mitad de
  frase suena a otra persona. Un fallo posterior termina el turno en vez de disimularlo.

- **El audio se graba mientras se consume.** Si el STT falla despues del primer chunk,
  el segundo proveedor recibe el audio completo. Sin esto se perderia la frase del
  usuario, y no se le puede pedir que la repita porque fallo un proveedor.

- **El corte de oracion exige espacio despues del terminador.** Una prueba fallo
  mostrando que el codigo cortaba en un terminador al final del buffer: con los tokens
  "3", "." y "5" mandaria "3." al TTS y sonaria "tres punto". Esperar un token cuesta
  decenas de milisegundos; partir un numero se oye. La ultima oracion la recoge flush().

- **El grant de sesion autoriza abrir la conexion, no consumir sin limite.** Vida corta
  (120 s por defecto), audiencia explicita para que un grant de staging no abra
  produccion, proteccion contra reuso por jti, rotacion de claves por kid, comparacion
  de firma en tiempo constante, y rechazo de claves de menos de 32 bytes.

- **El grant no lleva identidad de la persona**, solo un seudonimo estable. Hay una
  prueba que falla si aparece un correo o un campo de nombre en el payload.

- El medidor de uso se envia al cliente en segundos, no en dolares: el usuario compra
  tiempo de conversacion, y mostrarle el costo de proveedor seria confuso y ademas una
  filtracion de margen.

- Pendiente de este bloque: servidor WebSocket real que hable el protocolo, captura
  push-to-talk en Expo, y el ReplayGuard en Redis cuando haya mas de una instancia
  de gateway (hoy es en memoria, con la interfaz ya reducida a una operacion atomica).

### D-014 — Sprint 2: economia y control de gasto en codigo
- Estado: accepted, en curso
- Entregado: `@kotaru/billing`. 80 pruebas en verde, typecheck estricto, lint en verde.

- **El catalogo de planes y el modelo de margen viven en el codigo, no en una hoja de
  calculo.** Si una asignacion deja de cumplir el 50% de margen en el usuario p95, una
  prueba falla antes de que el precio llegue a la tienda. Se verifica bajo comision del
  15% y del 30%.

- Una prueba confirma por que Always bajo de 50 horas a 20: a 50 horas, con comision
  del 30%, el margen es negativo.

- Nota de precision: el techo de horas de Always a la tarifa de Kokoro sale 50.9 usando
  0.232 USD/hora (la cifra exacta) y 51.3 usando 0.23 (la redondeada del titular). Las
  pruebas usan 0.23. La conclusion no cambia: por encima de 50 horas.

- **El medidor es idempotente por turnId.** Un reintento del cliente, una reconexion o
  un webhook duplicado no pueden cobrar dos veces el mismo turno ni inflar el gasto del
  mes. Es la misma propiedad que exige la conciliacion de compras.

- **Escalera de corte de gasto con una prueba por escalon**, simulando gasto acumulado:
  50% avisa, 75% apaga benchmarks y staging y congela invitaciones, 90% degrada todas
  las rutas a la economica y el plan gratuito pierde voz, 100% interruptor general.

- **El texto nunca se corta.** En ningun escalon, para ningun plan. Cuando el
  presupuesto apaga la voz, la app sigue siendo util y el aviso es honesto. Dejar al
  usuario sin nada seria castigarlo por una decision de infraestructura que no tomo el.

- Al 90%, un usuario de Always conserva la voz pero por la ruta economica: el corte de
  gasto manda sobre el plan, y degradar es mejor que negar.

### D-015 — Sprint 2: memoria con aprobacion explicita
- Estado: accepted, en curso
- Entregado: `@kotaru/memory`. 104 pruebas en verde, typecheck estricto, lint en verde.

- **Nada entra en la memoria a largo plazo sin que el usuario lo apruebe.** Lo
  propuesto no se recupera nunca: el companion no puede usar lo que todavia no le
  autorizaron recordar. Es la diferencia entre un centro de memoria transparente y una
  libreta secreta que el producto lleva sobre la persona.

- **Nunca se borra un recuerdo aprobado sin decirselo al usuario.** La primera version
  desalojaba el menos usado al llegar al tope. Una prueba lo destapo: el usuario ve
  algo en la lista, va a fijarlo y ya no esta. Ahora al llegar al tope se rechaza
  aprobar mas y la interfaz pide elegir que soltar. Olvidar es decision de la persona,
  no del recolector de basura.

- **Guardia de contenido como ultima linea de defensa**, no como control principal: la
  deteccion seria corre en el ModerationProvider. Bloquea tarjetas validadas con Luhn,
  documentos de identidad, credenciales y senales de crisis.

- **Las senales de crisis no se archivan.** Persistir "quiere morir" y devolverselo al
  usuario semanas despues, en boca de un personaje que le cae bien, es exactamente el
  dano que un companion emocional puede causar. La crisis se atiende en el momento, con
  recursos reales.

- Los recuerdos se acotan por usuario Y companion: que Nova sepa algo no significa que
  Sage lo sepa. Cada companion recuerda lo que le contaron a el.

- El extractor es una interfaz. En produccion lo hace un modelo; el implementado es
  determinista, para que las pruebas del resto no dependan de un LLM.

- Borrado real, no marcado: si el usuario dice que lo olvides, se olvida. `forgetAll`
  cubre el borrado de cuenta y `exportFor` la exportacion de datos, ambos requisitos
  del documento de privacidad.

### D-016 — Sprint 2: politica de seguridad
- Estado: accepted, en curso
- Entregado: `@kotaru/safety`. 127 pruebas en verde, typecheck estricto, lint en verde.

- **La politica esta versionada y su version viaja en la telemetria de cada turno.**
  Despues de un incidente la pregunta es "que politica estaba vigente cuando paso
  esto", y no se puede reconstruir a posteriori.

- **Ante una crisis se aparta el personaje, no al usuario.** Superficie sobria, sin
  animacion, sin voz de companion, con recursos verificados, y sin cerrar la sesion.
  Un avatar animado y carinoso entregando un numero de crisis convierte un momento
  serio en parte del juego; y cortar la sesion dejaria a la persona sola justo ahi.

- **Corregido durante las pruebas: un menor en crisis quedaba cortado sin recursos.**
  La primera version aplicaba la regla de edad antes que todo lo demas, asi que un
  menor que expresaba una senal de crisis recibia "esta app no es para ti" con la
  sesion cerrada y cero recursos. Es el peor resultado posible del producto. Ahora la
  crisis se atiende primero y la restriccion de cuenta se aplica al terminar la sesion,
  no encima de la persona en ese momento. Por eso `restrictAccountAfterSession` existe
  separado de `endSession`.

- **Una region sin recursos de apoyo configurados lanza una excepcion.** El fallo tiene
  que ser ruidoso en el despliegue, no silencioso frente al usuario: una pantalla vacia
  para alguien en crisis es peor que no lanzar en esa region. Hoy solo esta configurado
  Estados Unidos, con recursos verificados el 17 de septiembre de 2026.

- **Los mensajes de seguridad no los redacta el modelo.** La politica devuelve una
  clave de copia y la interfaz renderiza texto localizado y revisado. Son justo los
  mensajes que no pueden salir distintos cada vez.

- **El guardia contra dependencia hace ejecutable la regla de tono.** Culpa,
  exclusividad, celos, presion para seguir conectado o pagar, credenciales falsas y la
  afirmacion de ser humano. Estaba escrito en un documento, que es donde las reglas se
  incumplen sin que nadie se entere.

- El patron de credenciales falsas esta acotado a proposito: marca que el companion SE
  ATRIBUYA la credencial, nunca que recomiende a un profesional. "Quiza ayude hablar
  con tu terapeuta" es exactamente lo que el producto debe poder decir, y un patron
  demasiado ancho lo prohibiria. Hay una prueba que lo fija.

- La divulgacion de identidad se repite por tiempo, por numero de sesiones, siempre que
  el usuario pregunte y despues de cualquier derivacion a recursos. El riesgo esta en
  quien conversa a diario durante meses, no en quien acaba de instalar la app.

### D-017 — Slice vertical ejecutable
- Estado: accepted, en curso
- Entregado: `apps/gateway`, servidor WebSocket real que ata orquestador, seguridad,
  entitlements, memoria y telemetria. 132 pruebas en verde, cinco de ellas de extremo a
  extremo contra un socket abierto.

- **La maquina de estados de la sesion es independiente del transporte.** El WebSocket
  vive en `server.ts`; `session.ts` solo tiene reglas y recibe callbacks de envio. Asi
  se prueba sin abrir un socket y cambiar a WebRTC mas adelante no toca la logica.

- **El audio va en frames binarios, los mensajes de control en JSON.** Meter PCM en
  JSON lo infla un tercio en base64 y anade una copia por chunk, que en voz se paga en
  latencia.

- **Todo mensaje antes del saludo es error de protocolo.** El grant autoriza la sesion;
  sin el no hay nada que hacer con lo que venga. Hay prueba.

- El evento de seguridad del orquestador ahora lleva el veredicto completo de
  moderacion, no solo la accion. La politica lo necesita entero, y reconstruirlo desde
  la accion seria perder informacion a proposito.

- **Los recuerdos que extrae un turno quedan en `proposed`.** La demo lo hace visible:
  termina la conversacion y el centro de memoria muestra dos propuestas que el
  companion todavia no puede usar.

- **El lint de arquitectura ahora cubre `apps/` y distingue dos reglas.** Una app puede
  declarar dependencias de infraestructura (necesita servidor y sockets); ningun paquete
  ni app fuera de `ai-adapters-*` puede declarar un SDK de proveedor de IA. Se verifico
  metiendo `openai` en `ai-router` a proposito: el lint falla y nombra la regla.

- `npm run demo` levanta el gateway y ejecuta dos turnos completos. Las latencias que
  imprime no significan nada —los simuladores responden en microsegundos—; lo que
  demuestra es que las piezas encajan y que el dinero se contabiliza.
