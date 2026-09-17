# ADR-001 — Avatar

- Fecha: 2026-09-17
- Estado: proposed, pendiente del spike del Sprint 0

## Contexto

El MVP necesita visemas, parpadeo, idle, mirada, 6–8 estados emocionales y 10–15 gestos reutilizables,
en iOS y Android, sin GPU en la nube, con un presupuesto que solo paga un rig de producción.

## Opciones

| Criterio | Unity embebido (UaaL) | Three.js sobre Expo GL |
|---|---|---|
| Tamaño añadido al binario | decenas de MB por plataforma | marginal |
| Cadena de herramientas | dos: C# y TypeScript | una: TypeScript |
| Iteración y OTA | build nativo por cambio | actualización OTA de lógica |
| Calidad visual techo | alta | suficiente para retrato estilizado |
| Riesgo de integración RN | alto | bajo |
| Contratación | requiere perfil Unity | cubierto por el equipo RN |
| Licenciamiento | revisar según ingresos | sin costo de licencia |

## Decisión

Three.js sobre Expo GL con rig glTF de personaje único: blendshapes para visemas y expresión,
esqueleto para gestos, y una máquina de estados finita en `packages/avatar` con
`idle`, `listen`, `think`, `speak`, `interrupt`, `reconnect`.

La animación labial usa el timing de visemas del TTS cuando el proveedor lo entrega, y cae a
envolvente de amplitud cuando no. El respaldo no es opcional: un proveedor económico probablemente
no devuelva marcas de tiempo fonémicas.

## Spike que valida o revierte — 3 días, antes de encargar el rig

| Prueba | Criterio de aceptación |
|---|---|
| Android de gama baja | 30 fps estables durante 10 min de habla |
| iPhone de 3 años | 30 fps sin subida térmica que degrade audio |
| Batería | < 12% por 30 min con pantalla activa |
| Sincronía labial | desfase percibido < 80 ms con respaldo de amplitud |
| Coexistencia con audio streaming | sin cortes de audio bajo carga de render |

## Consecuencias

- El brief de arte entrega glTF con visemas y expresiones nombradas según convención fija,
  más animaciones de esqueleto exportadas por separado.
- `packages/avatar` expone una API independiente del motor: cambiar a Unity no toca `apps/mobile`
  fuera del componente de render.
- Nova y Sage se presentan como retrato ilustrado animado por capas hasta validar.

## Disparador de reversión

Fallo del criterio de fps o de batería en el Android objetivo, o una dirección de arte que exija
pelo y tela simulados. Se abre ADR-001b para Unity embebido antes de escribir la capa de animación.
