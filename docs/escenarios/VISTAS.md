# Vistas pintadas de los escenarios (B del plan de realismo)

Imágenes de fondo lejano: lo que se ve por la ventana de Luna y de Nova, y el telón de
montañas de Rio. El resto de cada escena sigue en 3D con código (`mobile/src/scene3d.ts`).
Encima de la imagen siguen la lluvia, las gotas, las nubes, las velas, las luces y los personajes.

## Origen y licencia

- **Generadas con la IA de Canva** (generate-image) el 2026-09-28, desde la cuenta del dueño.
- **Términos:** [Canva AI Product Terms](https://www.canva.com/policies/ai-product-terms/),
  vigentes desde el 2026-06-26 y comprobados el 2026-09-28. Dicen:
  - El resultado es del usuario («you own your Output»), salvo lo que incorpore contenido con
    licencia de Canva.
  - Se puede usar «for any lawful purpose», bajo el propio riesgo del usuario.
  - **No se puede** hacer creer que el contenido es humano.
  - **No se pueden** quitar ni alterar las etiquetas de procedencia ni los metadatos.
- **Consecuencias para Kotaru:**
  - **No son exclusivas.** Otro usuario puede recibir algo parecido y quizá no tengan
    copyright. Sirven de fondo, no como marca ni como personaje.
  - **No se presentan como arte hecho a mano.** El crédito dirá «Fondos generados con IA (Canva)».
  - Si se recortan o se comprimen, hay que **conservar los metadatos** (por ejemplo, con
    `exiftool -tagsFromFile original.jpg nuevo.jpg`).
- Los prompts piden «original scene» sin personas ni texto, y no nombran ningún artista,
  estudio ni obra.

| Escena | Archivo esperado | Canva (id de la imagen) | Prompt (resumen) |
|---|---|---|---|
| Nova | `mobile/public/escenarios/vistas/nova-room.jpg` | [MAHWiJjSeec](https://www.canva.com/M/MAHWiJjSeec) | Ciudad de noche con lluvia vista desde una ventana, anime pintado, 4:5 |
| Luna | `mobile/public/escenarios/vistas/luna-office.jpg` | [MAHWiJJ8VaQ](https://www.canva.com/M/MAHWiJJ8VaQ) | Parque verde por la mañana, anime pintado, 1:1 |
| Rio | `mobile/public/escenarios/vistas/rio-outdoors.jpg` | [MAHWiFLg590](https://www.canva.com/M/MAHWiFLg590) | Montañas y lago al atardecer, anime pintado, 2:1 |

## Estado

El código ya las carga: basta con poner la ruta en `PLATES` (`mobile/src/scenes.ts`). Si
falta la imagen, se ve la vista dibujada con código. Probado el 2026-09-28 con las
miniaturas de Canva (`vistas-prueba-miniaturas.png`).

**Cómo se instalan** (el dueño autorizó la descarga el 2026-09-28 a las 21:44):
- En Canva, el diseño «Kotaru vistas» (`DAHWiUlYhm8`) tiene una página por vista: 2 Nova
  (1600x2000), 3 Luna (1600x1600) y 4 Rio (2400x1200).
- Se exportan en JPG y se descargan en el servidor con `deploy/vistas.sh`, que guarda los
  bytes tal cual (sin tocar los metadatos). Después, `deploy/web.sh`.
- Las imágenes no están en git: viven en el servidor, en `mobile/public/escenarios/vistas/`.
  Si faltan, la app usa la vista dibujada.
