# COST_MODEL.md — Kotaru

**Todo valor de este archivo es `ASSUMPTION` hasta que exista un precio oficial con `verified_at`.**
Nunca se presenta un supuesto como tarifa confirmada, ni en un tablero ni en una conversación comercial.

## Fórmulas

```
Ruta modular (primaria):
  costo_hora = min_stt x r_stt + tok_in x r_in + tok_out x r_out
             + chars_tts x r_tts + r_infra_hora

Ruta realtime (apagada en el MVP):
  costo_hora = seg_audio_in x r_rt_in + seg_audio_out x r_rt_out
             + tok_texto_y_herramientas + r_infra_hora
```

Se miden dos relojes distintos y no son intercambiables: **minutos hablados por el usuario**
y **minutos de sesión**. Los proveedores difieren en cuál facturan.

## Perfil de una hora de conversación (ASSUMPTION)

| Variable | Valor | Origen |
|---|---:|---|
| Minutos de sesión | 60 | definición |
| Minutos hablados por el usuario | 21 | 35% de la sesión |
| Minutos hablados por el compañero | 24 | 40% de la sesión |
| min_stt (stream abierto) | 23 | push-to-talk + margen |
| Turnos por hora | 80 | ciclo medio 45 s |
| tok_in por turno | 1,900 | persona 700 + memorias 300 + resumen 300 + historial 600 |
| tok_out por turno | 90 | ~55 palabras habladas |
| tok_in por hora | 152,000 | |
| tok_out por hora | 7,200 | |
| chars_tts por hora | 24,000 | 4,400 palabras x 5.5 caracteres |

El caché de prompt puede recortar buena parte de tok_in. No se descuenta hasta verificarlo por proveedor.

## Banda de tarifas (ASSUMPTION)

| Componente | Unidad | Baja | Base | Alta |
|---|---|---:|---:|---:|
| STT | USD/min | 0.0020 | 0.0060 | 0.0150 |
| LLM entrada | USD/M tok | 0.10 | 0.30 | 1.00 |
| LLM salida | USD/M tok | 0.40 | 1.20 | 3.00 |
| TTS | USD/M chars | 3.00 | 10.00 | 30.00 |
| Infra + moderación + memoria | USD/hora | 0.010 | 0.030 | 0.080 |

## Costo por hora

| Componente | Baja | Base | Alta |
|---|---:|---:|---:|
| STT | 0.046 | 0.138 | 0.345 |
| LLM entrada | 0.015 | 0.046 | 0.152 |
| LLM salida | 0.003 | 0.009 | 0.022 |
| TTS | 0.072 | 0.240 | 0.720 |
| Infra y servicios | 0.010 | 0.030 | 0.080 |
| **Total/hora** | **0.15** | **0.46** | **1.32** |

El TTS domina el costo en el caso base y en el alto. Es la primera palanca de optimización.

## Escenarios por usuario de pago

| Horas/mes | Baja | Base | Alta |
|---|---:|---:|---:|
| 1 | 0.15 | 0.46 | 1.32 |
| 10 | 1.46 | 4.62 | 13.19 |
| 30 | 4.38 | 13.87 | 39.56 |
| 100 | 14.61 | 46.22 | 131.86 |

## Compuerta de margen

Ingreso neto tras 30% de comisión de tienda. Horas máximas manteniendo 50% de margen de contribución.

| Plan | Precio | Neto 30% | Máx. banda baja | Máx. base | Máx. banda alta | Prometido hoy |
|---|---:|---:|---:|---:|---:|---|
| Connect | 7.99 | 5.59 | 18.6 | 6.0 | 2.1 | 3–5 h |
| Close | 14.99 | 10.49 | 35.0 | 11.4 | 4.0 | 12–20 h |
| Always | 24.99 | 17.49 | 58.3 | 18.9 | 6.6 | 35–50 h |

**Hallazgo central.** Las asignaciones publicadas solo sobreviven si el costo mezclado aterriza
cerca de 0.15 USD/hora. En el caso base, Always a 50 h cuesta 23.11 contra 17.49 de ingreso neto:
pierde 5.62 por usuario que agote el plan, antes de reembolsos, soporte y subsidio de usuarios gratuitos.

Regla: no publicar Always por encima de 35 h hasta tener costo mezclado verificado <= 0.25 USD/hora.

## Presupuesto bootstrap mensual

| Categoría | Techo | Esperado base (alfa 25 usuarios, 150 h) |
|---|---:|---:|
| APIs de IA — operación alfa | 250 | 69 |
| APIs de IA — benchmark | 150 | 80 |
| Backend, base de datos, almacenamiento | 140 | 110 |
| Observabilidad, correo, soporte | 60 | 20 |
| Diseño, activos, pruebas | 100 | 100 |
| Tiendas, dominio, varios | 100 | 45 |
| **Sobre de planificación** | **800** | **424** |
| Contingencia (20%) | 200 | — |
| **Techo total** | **1,000** | |

El rig de avatar es un costo irregular de una sola vez. Se amortiza en tres meses o se aprueba aparte;
no se disimula dentro del presupuesto operativo.

## Escalera de corte automático

| Umbral | Acción |
|---|---|
| 50% | Notificación con proyección de cierre de mes |
| 75% | Se apagan benchmark y staging; se congela el registro de invitados |
| 90% | Todas las rutas degradan a económica; el plan gratuito pierde voz y conserva texto |
| 100% | Kill switch de voz; la app sigue en texto con aviso honesto |

Un tope que nunca se ejecutó no es un tope: se prueba con un test que simula gasto acumulado.

## Campos obligatorios por proveedor antes de habilitar

currency, unit, input_price, output_price, free_tier, volume_discount, minimum_charge, rounding,
caching_discount, egress, verified_at, pricing_source (URL oficial), tax_applicability,
data_retention, training_opt_out, commercial_audio_rights.

Un `UNKNOWN` en `commercial_audio_rights` bloquea la habilitación, por barato que sea el proveedor.

---

# PARTE VERIFICADA — 2026-09-17

Lo anterior es el modelo derivado de supuestos. Esta parte lo sustituye para las
rutas verificadas en documentacion oficial el 17 de septiembre de 2026.
Entidad contratante: Estados Unidos.

## Costo por hora con tarifas verificadas

Mismo perfil: 23 min STT, 152.000 tok in, 7.200 tok out, 24.000 chars TTS, 0.030 infra.

| Ruta | STT | LLM | TTS | Infra | Total/hora |
|---|---:|---:|---:|---:|---:|
| A — lanzamiento: AssemblyAI + Gemini 3.1 Flash-Lite + Polly Neural | 0.058 | 0.049 | 0.384 | 0.030 | **0.52** |
| B — generativa: AssemblyAI + Gemini Flash-Lite + Gemini 2.5 Flash TTS | 0.058 | 0.049 | 0.403 | 0.030 | **0.54** |
| C — mejor espanol: Deepgram Nova-3 + Gemini Flash-Lite + Aura-2 | 0.177 | 0.049 | 0.720 | 0.030 | **0.98** |
| D — realtime: Gemini 3.8 Live | — | — | — | 0.030 | **~0.72** |
| E — MiniMax completo | 0.146 | 0.055 | 1.440 | 0.030 | **1.67** |

Conclusiones:
- La estimacion base de 0.46 fue correcta dentro del 13%. El piso realista es **0.52/hora**,
  no 0.15: ese extremo solo se alcanza con voces concatenativas inservibles para compania emocional.
- El TTS es el 74% del costo de la ruta de lanzamiento. STT y LLM juntos no llegan a 0.11/hora.
  Toda optimizacion debe atacar caracteres sintetizados, no tokens.
- El realtime (Gemini Live ~0.72/h) ya no es la ruta cara: se situa entre la modular de
  lanzamiento y la de mejor espanol, y elimina toda la orquestacion STT-LLM-TTS.
- MiniMax cuesta 3.2 veces la ruta de lanzamiento. La tesis de "proveedores chinos mas baratos"
  no sobrevivio a los precios reales.

## Correccion de comision de tienda

El modelo anterior uso 30%. Para un desarrollador que factura menos de USD 1 millon al ano,
**Apple y Google cobran 15%** por sus programas para pequenos negocios. El ano uno opera al 15%.

## Compuerta de margen rehecha

Asignacion maxima manteniendo 50% de margen de contribucion en el usuario p95
(supuesto: el p95 consume el 90% de su plan), a 0.52 USD/hora.

| Plan | Precio | Neto 15% | Max horas 15% | Neto 30% | Max horas 30% | Prometido antes |
|---|---:|---:|---:|---:|---:|---|
| Connect | 7.99 | 6.79 | 7.2 | 5.59 | 6.0 | 3–5 h |
| Close | 14.99 | 12.74 | 13.6 | 10.49 | 11.2 | 12–20 h |
| Always | 24.99 | 21.24 | 22.7 | 17.49 | 18.7 | 35–50 h |

## Asignaciones recomendadas

| Plan | Precio | Horas | Margen p95 al 15% | Margen p95 al 30% |
|---|---:|---:|---:|---:|
| Free | 0 | 45 min | subsidio de 0.39/mes por usuario | igual |
| Connect | 7.99 | **5 h** | 65% | 58% |
| Close | 14.99 | **12 h** | 56% | 46% |
| Always | 24.99 | **20 h** | 56% | 46% |

**Always baja de 35–50 horas a 20.** A 35 h esta en equilibrio exacto al 30% de comision;
a 50 h pierde dinero en ambos regimenes.

## Subsidio del plan gratuito

Cada usuario Free cuesta 0.39/mes en voz. Con 10 gratuitos por cada usuario de pago,
el subsidio consume 3.90 de los 6.79 netos de un Connect. El limite del plan gratuito
debe ajustarse por remote config sin desplegar.

## Advertencias de evidencia

- Las tarifas de Deepgram STT son promocionales segun su propia pagina. Se modela con la regular.
- Gemini Flash sube de precio el 1 de enero de 2027: entrada 0.75 -> 1.50, salida 3.75 -> 7.50.
  Toda proyeccion a 12 meses debe usar las tarifas de 2027.
- El efectivo de Gemini TTS depende de la tasa de caracteres por segundo del habla real.
  A 15 car/s son 16.79; a 12 car/s son 20.99. Medir en espanol e ingles.
- Azure AI Speech quedo sin cotizar: su pagina de precios no renderiza sin sesion.
- Sin verificar: que ofrecen realmente los competidores premium en horas de voz.
  Sin ese dato la promesa de "mas minutos por dolar" no se puede sostener ni descartar.

Detalle por proveedor, con URLs y estado de habilitacion: `docs/PROVIDER_REGISTRY.yaml`.

---

# ESCALON DE TTS — 2026-09-17, segunda ronda

## El idioma no es el eje de ahorro

Renunciar al espanol ahorra 0.024 USD/hora (4.6%). Ningun proveedor cobra por idioma en
TTS; todos facturan por caracter al mismo precio (verificado en Amazon, Google, Azure,
ElevenLabs, Rime, Cartesia). AssemblyAI cobra lo mismo por multilingue que por solo-ingles.
El unico descuento por idioma hallado (Deepgram streaming monolingue, 17% menos) conduce
a una opcion que sigue costando el doble que AssemblyAI.

Los modelos solo-ingles suelen ser mas caros: Together sirve Orpheus (solo ingles) a
15 USD/M y Kokoro-82M (9 idiomas, incluido espanol) a 4 USD/M.

## Rutas por nivel de TTS

Base fija STT + LLM + infra = 0.1363 USD/hora. TTS = 24.000 caracteres = 0.024 M.

| Ruta TTS | USD/M chars | TTS/hora | Total/hora | vs base | Espanol |
|---|---:|---:|---:|---:|---|
| Supertonic 3 autoalojado CPU | ~0.80 | 0.019 | **0.156** | -70% | si, 31 idiomas |
| Kokoro-82M via Together AI | 4.00 | 0.096 | **0.232** | -55% | si, 3 voces |
| Google Standard / Polly Standard | 4.00 | 0.096 | 0.232 | -55% | si |
| Deepgram Aura-1 (solo ingles) | 15.00 | 0.360 | 0.496 | -4.6% | NO |
| **Polly Neural (linea base)** | 16.00 | 0.384 | **0.520** | — | si |
| Deepgram Aura-2 / Chirp 3 HD | 30.00 | 0.720 | 0.856 | +65% | si |
| ElevenLabs Flash/Turbo | 50.00 | 1.200 | 1.336 | +157% | si |

STT alternativo: Groq Whisper Large v3 Turbo a 0.04 USD/hora de audio = 0.0153 USD/hora
de conversacion (frente a 0.0575 de AssemblyAI). Factura audio procesado, no stream
abierto, asi que exige trocear con VAD en cliente y anade 150-300 ms por chunk.

## Asignaciones a 0.23 USD/hora

Mismo criterio: 50% de margen de contribucion en el usuario p95 que consume el 90% del plan.

| Plan | Precio | Max horas a 0.52 | Max horas a 0.23 (15%) | Max horas a 0.23 (30%) | Prometia el plan original |
|---|---:|---:|---:|---:|---|
| Connect | 7.99 | 7.2 | **16.3** | 13.4 | 3-5 h |
| Close | 14.99 | 13.6 | **30.5** | 25.1 | 12-20 h |
| Always | 24.99 | 22.7 | **50.9** | 41.9 | 35-50 h |

A 0.23 USD/hora las asignaciones originales vuelven a ser viables en ambos regimenes de
comision. La promesa comercial del proyecto depende de esta unica decision tecnica.

Rendimiento del presupuesto de 1.000 USD/mes:

| Ruta | USD/h | Horas de conversacion/mes |
|---|---:|---:|
| Polly Neural (actual) | 0.520 | 1.922 |
| Solo ingles con Aura-1 | 0.496 | 2.015 |
| Kokoro via Together | 0.232 | **4.305** |
| Supertonic autoalojado | 0.156 | 6.431 |
| Supertonic + Groq Whisper Turbo | 0.113 | 8.824 |

## Lo que bloquea la decision

- Ninguna fuente oficial publica comparacion ciega de calidad de Kokoro frente a Polly
  Neural. Para un companion emocional la voz es el producto. Se decide con prueba A/B
  ciega, no con una tabla de precios.
- No esta documentado si Kokoro soporta streaming de baja latencia. Si genera por lotes,
  la ventaja de costo se paga en latencia percibida.
- El espanol de Kokoro tiene 3 voces frente a 28 en ingles y usa fonemizador de respaldo.
- Supertonic (aun mas barato) tiene licencia OpenRAIL-M con restricciones propagables,
  punto de equilibrio en ~1.200 h/mes, streaming no documentado, y obliga a mantener un
  proveedor comercial como respaldo de todos modos.
