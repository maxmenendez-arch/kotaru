# Kotaru

Compañero de IA con personajes manga originales, voz y memoria. Monorepo TypeScript.

Estado: **Sprint 2 en curso.** Contratos de proveedor, router multiproveedor,
adaptadores simulados, telemetría de costo, orquestador del turno, grants de sesión
firmados, control de gasto, memoria con aprobación del usuario, política de seguridad y un
gateway WebSocket que ata todo. Todavía no hay app móvil. Todavía no hay app móvil ni servidor desplegado.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Instalación y verificación

```bash
npm install
npm run typecheck     # tsc --build en modo estricto sobre los cuatro paquetes
npm test              # 154 pruebas
npm run lint:arch     # verifica la regla de dependencias
npm run demo          # una conversación completa, de punta a punta
```

Las tres deben pasar antes de cualquier commit.

## Paquetes

| Paquete | Responsabilidad | Dependencias permitidas |
|---|---|---|
| `@kotaru/ai-contracts` | Las seis interfaces de proveedor y los tipos del router | **ninguna**, a propósito |
| `@kotaru/ai-adapters-mock` | Simuladores deterministas de STT, LLM, TTS, moderación y embeddings | solo contratos |
| `@kotaru/ai-router` | Restricciones duras, puntuación, circuit breaker, presupuesto | solo contratos |
| `@kotaru/telemetry` | Eventos de costo y latencia, sin contenido de conversación | solo contratos |
| `@kotaru/orchestrator` | Ciclo del turno: transcripción, moderación, generación y síntesis en paralelo | contratos y telemetría |
| `@kotaru/gateway` | Grants de sesión firmados y protocolo de tiempo real | solo contratos |
| `@kotaru/billing` | Planes, márgenes, medidor idempotente, escalera de corte de gasto | solo contratos |
| `@kotaru/memory` | Recuerdos con aprobación explícita, guardia de contenido, exportación y borrado | solo contratos |
| `@kotaru/safety` | Política versionada, recursos de apoyo, divulgación de IA, guardia contra dependencia | solo contratos |

## Aplicaciones

| App | Responsabilidad | Dependencias permitidas |
|---|---|---|
| `@kotaru/app-gateway` | Servidor WebSocket: sesiones de voz, VAD, interrupción, backpressure | paquetes `@kotaru/*` e infraestructura (`ws`), **nunca** un SDK de IA |

## Reglas que el código hace cumplir

Estas no son convenciones: hay una prueba o un lint que falla si se rompen.

1. **La lógica de negocio nunca llama a un SDK de proveedor.** Solo
   `packages/ai-adapters-*` puede declarar dependencias de terceros.
   `npm run lint:arch` falla si otro paquete lo intenta.
2. **`ai-contracts` tiene cero dependencias.** Es el límite con los proveedores.
3. **Las restricciones duras se evalúan antes de puntuar.** Región, locale,
   sensibilidad, retención conocida, derechos comerciales del audio, tope de gasto
   y kill switch son filtros binarios. Un precio bajo nunca los compensa.
4. **La telemetría no lleva contenido.** `assertNoContent` rechaza claves no
   declaradas y cadenas que parecen texto de conversación. El sink falla en vez de
   guardar.
5. **El canal de emoción está en allowlist.** El modelo solo puede emitir las ocho
   emociones y los diez gestos declarados; cualquier otra cosa se descarta y se
   degrada a neutral.
6. **La cancelación del usuario no penaliza al proveedor.** Una interrupción no
   cuenta como fallo para el circuit breaker.
7. **Toda estimación de costo declara si es supuesto o tarifa verificada**, con
   fecha. Ver `../docs/PROVIDER_REGISTRY.yaml`.
8. **El fallback de proveedor solo actúa antes del primer evento emitido.** Una vez
   que el usuario oye la primera sílaba no se cambia de voz a mitad de frase: un
   fallo posterior termina el turno en vez de disimularlo.
9. **El grant de sesión no lleva identidad.** Solo un seudónimo estable. Hay una
   prueba que falla si aparece un correo o un campo de nombre en el payload.
10. **El texto nunca se corta.** Cuando el presupuesto apaga la voz, la app sigue
    siendo útil. Dejar al usuario sin nada sería castigarlo por una decisión de
    infraestructura que no tomó él.
11. **Un tope que nunca se ha disparado no es un tope.** La escalera de gasto tiene
    una prueba por escalón que simula gasto acumulado.
12. **Nada entra en la memoria sin que el usuario lo apruebe.** Lo propuesto no se
    recupera jamás: el companion no puede usar lo que todavía no le autorizaron.
13. **Nunca se borra un recuerdo aprobado sin decírselo al usuario.** Al llegar al
    tope se rechaza aprobar más y la interfaz pide elegir qué soltar. Olvidar es
    siempre decisión de la persona.
14. **Una región sin recursos de apoyo configurados lanza una excepción.** Mostrarle
    una pantalla vacía a alguien en crisis es peor que no lanzar ahí.
15. **Los mensajes de seguridad no los redacta el modelo.** La política devuelve una
    clave de copia; la interfaz renderiza texto revisado. Son justo los mensajes que
    no pueden salir distintos cada vez.

## Tarifas incorporadas

Las tarjetas de tarifas en `packages/ai-adapters-mock/src/rate-cards.ts` son las
verificadas el 17 de septiembre de 2026:

| Componente | Proveedor | Tarifa |
|---|---|---|
| STT | AssemblyAI Universal-Streaming | $0.15 / hora de audio |
| LLM | Gemini 3.1 Flash-Lite | $0.25 / $1.50 por millón de tokens |
| TTS | Amazon Polly Neural | $16 por millón de caracteres |
| TTS candidato | Kokoro-82M vía Together AI | $4 por millón de caracteres |

Una hora de conversación con el perfil de referencia cuesta **$0.52**. Con Kokoro
bajaría a **$0.23**, pendiente de la prueba de calidad ciega (D-011).

## Secretos

`.env.example` lista los nombres de variables, nunca valores. Las claves de
proveedor viven en el gestor de secretos del servidor: jamás en el código, en los
prompts, en el bundle móvil, en los logs ni en la analítica.

## El turno, de principio a fin

`runTurn()` en `@kotaru/orchestrator` ejecuta: transcripción con fallback y repetición
del audio grabado, moderación de entrada, y después **generación y síntesis en
paralelo**. El modelo emite tokens mientras el búfer de oraciones va entregando frases
completas al TTS, así que el primer byte de audio sale antes de que termine la
respuesta. Hay una prueba que lo verifica comparando índices de eventos.

El turno termina siempre con una métrica de costo atribuida a las tres etapas más
infraestructura, que pasa por el guardia de contenido antes de guardarse.

## Economía, en el código

`@kotaru/billing` no es un módulo de facturación: es la restricción comercial escrita
como código verificable. El catálogo de planes lleva las asignaciones de D-008, y hay
pruebas que fallan si una asignación deja de cumplir el 50% de margen en el usuario
p95 — bajo comisión del 15% **y** del 30%. Otra prueba confirma por qué Always bajó de
50 horas a 20: a 50 horas el margen es negativo.

La escalera de corte de gasto va del aviso al 50% hasta el interruptor general al 100%,
pasando por el 90%, donde todas las rutas se degradan a la económica y el plan gratuito
pierde la voz pero conserva el texto.

## Memoria

`@kotaru/memory` implementa el centro de memoria transparente: extracción, aprobación
explícita, edición, fijado, exportación y borrado real. Un guardia bloquea lo que nunca
debe quedar en disco —tarjetas validadas con Luhn, documentos de identidad, credenciales
y señales de crisis— como última línea de defensa detrás del `ModerationProvider`.

La señal de crisis se bloquea por una razón concreta: persistir "quiere morir" y
devolvérselo al usuario semanas después, en boca de un personaje que le cae bien, es
exactamente el daño que un companion emocional puede causar. Eso se atiende en el
momento, con recursos reales; no se archiva.

## Seguridad

`@kotaru/safety` define qué pasa cuando la moderación levanta la mano. La política está
versionada y su versión viaja en la telemetría de cada turno, para poder responder
"qué política estaba vigente cuando pasó esto" — la pregunta que se hace después de un
incidente y que no se puede reconstruir a posteriori.

Ante una crisis se aparta el personaje, no al usuario: superficie sobria, sin animación,
sin voz de companion, con recursos verificados, y **sin cerrar la sesión**. Dejar a
alguien solo justo ahí sería lo peor que puede hacer el producto.

El guardia contra dependencia convierte la regla de tono —nada de culpa, exclusividad,
celos ni presión para seguir conectado o pagar— en algo que una prueba puede romper. Y
está acotado con cuidado: marca que el companion *se atribuya* una credencial, nunca que
recomiende a un profesional de verdad.

## La demostración

`npm run demo` levanta el gateway de verdad, se conecta por WebSocket como lo haría la
app, y ejecuta dos turnos completos contra los simuladores. Imprime la transcripción, la
respuesta, la emoción, los frames de audio, el costo atribuido a cada etapa, los minutos
restantes del plan y el centro de memoria con sus propuestas sin aprobar.

Sirve para ver el sistema entero funcionando sin teléfono, sin nube y sin gastar un
centavo. **Las latencias que imprime no significan nada**: los simuladores responden en
microsegundos. Lo que la demo demuestra es que las piezas encajan y que el dinero se
contabiliza, no que el producto sea rápido.

## Siguiente

Captura push-to-talk en un development build de Expo, persistencia en PostgreSQL con
pgvector, y los adaptadores reales de AssemblyAI, Gemini y Polly detrás de variables de
entorno — estos últimos cuando existan las cuentas, porque escribir código que no se
puede ejecutar va contra la regla de evidencia del proyecto.
