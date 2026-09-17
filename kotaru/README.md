# Kotaru

Compañero de IA con personajes manga originales, voz y memoria. Monorepo TypeScript.

Estado: **Sprint 1 en curso.** Contratos de proveedor, router multiproveedor,
adaptadores simulados y telemetría de costo. Todavía no hay app móvil ni backend.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Instalación y verificación

```bash
npm install
npm run typecheck     # tsc --build en modo estricto sobre los cuatro paquetes
npm test              # 37 pruebas
npm run lint:arch     # verifica la regla de dependencias
```

Las tres deben pasar antes de cualquier commit.

## Paquetes

| Paquete | Responsabilidad | Dependencias permitidas |
|---|---|---|
| `@kotaru/ai-contracts` | Las seis interfaces de proveedor y los tipos del router | **ninguna**, a propósito |
| `@kotaru/ai-adapters-mock` | Simuladores deterministas de STT, LLM, TTS, moderación y embeddings | solo contratos |
| `@kotaru/ai-router` | Restricciones duras, puntuación, circuit breaker, presupuesto | solo contratos |
| `@kotaru/telemetry` | Eventos de costo y latencia, sin contenido de conversación | solo contratos |

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

## Siguiente

Gateway WebSocket con grants firmados, captura push-to-talk en Expo, y el primer
adaptador real detrás de variable de entorno.
