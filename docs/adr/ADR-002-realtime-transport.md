# ADR-002 — Transporte realtime

- Fecha: 2026-09-17
- Estado: proposed, con compuerta de medición

## Contexto

El MVP usa push-to-talk, que es medio dúplex. La interrupción es un evento de control,
no audio simultáneo en ambos sentidos.

## Opciones

| Criterio | WebSocket sobre TLS | WebRTC |
|---|---|---|
| Ajuste a push-to-talk | directo | sobredimensionado |
| Infraestructura extra | ninguna | STUN y TURN, con costo de ancho de banda |
| Costo bajo el techo de USD 1,000 | compatible | TURN es gasto variable difícil de acotar |
| Pérdida de paquetes en móvil | se maneja en aplicación | nativo |
| Cancelación de eco | no aplica en medio dúplex | nativa, necesaria en manos libres |
| Complejidad del gateway | una conexión, protocolo propio | señalización más medios |
| Depuración | trivial | requiere herramientas específicas |

## Decisión

WebSocket sobre TLS con protocolo de mensajes tipado y versionado. Audio del usuario en trozos
Opus de 20 ms hacia arriba; audio del compañero hacia abajo; control (`start`, `endpoint`,
`interrupt`, `budget_warning`, `limit_reached`) en el mismo canal.

Autenticación con grant firmado por el servidor, de vida corta, emitido por el Product API y
presentado en el primer frame. El gateway nunca acepta un token de larga duración ni una clave de proveedor.

## Consecuencias

- El cliente implementa buffer de reproducción con jitter propio, reconexión con reanudación
  de sesión y backpressure.
- Expo requiere development build con módulo de audio nativo para PCM/Opus en streaming.
- La interrupción es un mensaje de control: detiene la reproducción local de inmediato y cancela
  LLM y TTS aguas arriba en el mismo viaje.

## Compuerta de medición

Se reevalúa WebRTC si, sobre LTE con 2% de pérdida de paquetes, ocurre cualquiera de estas:
p95 de fin de habla a primer byte de audio sobre 3.0 s por causa de transporte; interrupción
sobre 200 ms por buffering; o cortes audibles en más del 5% de los turnos.

## Disparador de reversión

Manos libres entra al alcance, o se habilita una ruta realtime speech-to-speech que exija
transporte de medios de extremo a extremo.
