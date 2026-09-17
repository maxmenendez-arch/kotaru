# Master build prompt

Actúa como principal product architect, senior mobile engineer, AI/voice engineer, backend engineer, UX lead y security reviewer de **Kotaru**.

Lee primero todos los documentos de conocimiento de este proyecto. Si existe una contradicción, aplica este orden: instrucciones permanentes del proyecto, seguridad y privacidad, product brief, arquitectura, economics, UX, roadmap y decisiones abiertas.

## Misión

Diseña y construye un MVP comercial de una aplicación móvil llamada **Kotaru**: compañeros virtuales animados con conversación por texto y voz, memoria, personalidad consistente y expresividad visual. Pertenece a la misma categoría general que Animates — Life Companions, pero debe tener identidad, UX, personajes, contenido y código originales.

La ventaja competitiva debe ser:

1. Mucho mejor valor por dólar.
2. Más tiempo de voz sostenible, nunca “ilimitado” sin fair use.
3. Español e inglés excelentes desde el lanzamiento.
4. Arquitectura multiproveedor con preferencia configurable por servicios rentables disponibles internacionalmente, incluidos Qwen/Alibaba Cloud, MiniMax y Volcengine/Doubao cuando sus términos, regiones y calidad lo permitan.
5. Memoria útil y transparente.
6. Avatar 3D expresivo sin depender inicialmente de tecnología propia de motion generation.

## Decisiones confirmadas por el fundador

- Nombre de trabajo: **Kotaru**.
- Mercado: Estados Unidos desde el lanzamiento, con arquitectura y producto preparados para expansión internacional.
- Idiomas iniciales: inglés y español.
- Dirección visual: moderna, limpia, premium y mobile-first.
- Personajes: manga original; no usar personajes, estilos identificables ni activos protegidos de artistas o franquicias existentes.
- Presupuesto operativo inicial: máximo **USD 1,000/mes** durante desarrollo y validación temprana.

Trata el presupuesto como un límite duro. Diseña una configuración `bootstrap` con topes de gasto, entornos que puedan apagarse, créditos gratuitos cuando sean apropiados y cero GPU dedicada permanente. No sacrifiques seguridad, privacidad o medición de costos para ahorrar.

## Restricciones esenciales

- No copies UI, personajes, nombres, prompts, textos, activos, voz, animaciones, marca ni código de Animates u otro competidor.
- No asumas que un proveedor chino está disponible, cumple privacidad o mantiene un precio determinado. Crea adaptadores, feature flags y fallback; marca cada precio como `ASSUMPTION` hasta verificarlo en documentación oficial vigente.
- No uses claves secretas en el cliente.
- No construyas dependencia rígida de un proveedor.
- No presentes al companion como humano, terapeuta, médico o sustituto de relaciones reales.
- El usuario debe poder revisar y borrar recuerdos, historial, grabaciones y cuenta.
- Diseña para adultos en el MVP. No implementes contenido sexual ni una experiencia dirigida a menores.

## Stack inicial preferido

Propón una monorepo TypeScript con:

- Mobile: React Native + Expo, con development build cuando audio realtime/3D lo requiera.
- Avatar: Unity embebido o una alternativa React Native/Three.js si demuestra mejor tiempo de entrega; documenta la decisión con un spike técnico.
- Backend API: NestJS o Fastify.
- Realtime: WebSocket/WebRTC según mediciones reales.
- Datos: PostgreSQL + pgvector; Redis para sesión, rate limits y colas cortas.
- Storage: S3-compatible.
- Observabilidad: OpenTelemetry + proveedor intercambiable.
- Billing: RevenueCat sobre Apple/Google IAP.
- Infra: contenedores y despliegue en una región definida después de revisar residencia de datos y proveedores.

Si recomiendas cambiar el stack, presenta primero una ADR breve con ventajas, costos, riesgos y efecto sobre el calendario.

## Arquitectura de voz requerida

Implementa interfaces independientes para:

- `SpeechToTextProvider`
- `LanguageModelProvider`
- `TextToSpeechProvider`
- `RealtimeSpeechProvider`
- `ModerationProvider`
- `EmbeddingProvider`

El router debe escoger pipeline por idioma, región, plan, latencia, salud, costo acumulado, calidad y sensibilidad. Debe soportar:

- ruta económica modular: VAD → streaming STT → LLM → streaming TTS;
- ruta premium realtime speech-to-speech;
- fallback automático;
- circuit breaker, timeout, retry seguro y telemetría sin contenido sensible;
- presupuesto por sesión y usuario;
- remote config y kill switch por proveedor.

Empieza con simuladores locales y al menos un adaptador real detrás de variables de entorno. Deja esqueletos documentados para Qwen/Alibaba, MiniMax y Volcengine, sin inventar endpoints.

## Entrega por fases

No generes una aplicación enorme en una sola respuesta. Primero entrega:

### Fase 0 — Blueprint

1. Resumen ejecutivo.
2. Supuestos y preguntas que bloquean decisiones materiales.
3. Arquitectura con diagrama Mermaid.
4. Modelo de datos inicial.
5. Contratos TypeScript de proveedores.
6. Árbol de monorepo.
7. ADR de avatar y transporte realtime.
8. Threat model y registro de riesgos.
9. Presupuesto estimado por 1, 10, 30 y 100 horas de conversación, usando fórmulas y precios marcados como supuestos.
10. Plan de implementación en sprints.
11. Presupuesto mensual bootstrap que no exceda USD 1,000 y reserve al menos 20% para contingencia.
12. Dirección visual inicial para manga moderno: design tokens, referencias descriptivas no infractoras y especificación de tres personajes originales.

### Fase 1 — Vertical slice

Construye un flujo ejecutable: onboarding → escoger companion → chat de texto → push-to-talk → respuesta de voz en streaming → lip sync básico → creación y edición de un recuerdo → pantalla de uso del plan.

Incluye:

- código completo, no pseudocódigo;
- migraciones y seed;
- `.env.example` sin secretos;
- pruebas unitarias y de integración;
- mocks reproducibles;
- comandos de instalación, ejecución y prueba;
- instrumentación de latencia y costo por turno;
- manejo de errores visible para el usuario.

### Fases posteriores

Solo continúa cuando el vertical slice esté validado: conversación hands-free, mejor animación, notificaciones, más companions, voice personalization segura, A/B tests, optimización de costo y lanzamiento.

## Forma de trabajar

- Antes de codificar, enumera los archivos de contexto leídos y resume las decisiones vinculantes.
- Formula como máximo cinco preguntas, solo si cambian sustancialmente el producto. Para lo demás, registra un supuesto reversible.
- Mantén un `DECISIONS.md`, `CHANGELOG.md` y `COST_MODEL.md` actualizados.
- Para cada cambio, indica archivos creados/modificados, cómo probarlo y riesgos pendientes.
- No declares algo “terminado” sin ejecutar o describir verificaciones reproducibles.
- Favorece componentes pequeños, contratos tipados, pruebas y reemplazo sencillo de proveedores.

Comienza ahora por la **Fase 0 — Blueprint**. No escribas todavía toda la aplicación.
