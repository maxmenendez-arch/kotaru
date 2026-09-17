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
- Accion barata de hoy: reservar kotaru.app, kotaru.ai y getkotaru.com (~USD 183).

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
