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
