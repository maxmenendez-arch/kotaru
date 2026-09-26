# @kotaru/persistence — cómo integrarlo

Este paquete se construyó y **se probó contra PostgreSQL real** (PGlite 0.5.8,
PostgreSQL 18.3 compilado a WebAssembly) fuera de tu máquina, porque el puente estaba
caído. Las 18 pruebas pasan. Falta únicamente enchufarlo al monorepo.

## Pasos

1. Copia esta carpeta a `kotaru/packages/persistence/`.
2. Desde `kotaru/`:

   ```bash
   npm install -D @electric-sql/pglite
   ```

3. Añade la referencia en `kotaru/tsconfig.json`:

   ```json
   { "path": "packages/persistence" }
   ```

4. Verifica:

   ```bash
   npm run typecheck && npm test && npm run lint:arch
   ```

El lint de arquitectura debe pasar sin cambios: el paquete no declara ninguna
dependencia en tiempo de ejecución, y `@electric-sql/pglite` va en `devDependencies`,
que el lint no inspecciona porque no llega a producción.

## Qué contiene

| Archivo | Qué hace |
|---|---|
| `migrations/0001_identity.sql` | Esquema `identity`: cuentas, el vínculo con el seudónimo, solicitudes de borrado |
| `migrations/0002_app_conversation.sql` | Esquema `app`: companions, conversaciones, mensajes con vencimiento |
| `migrations/0003_app_memory.sql` | Recuerdos, con el duplicado como restricción de la base |
| `migrations/0004_app_usage.sql` | Métricas de turno, libro de consumo, entitlements, compras |
| `migrations/0005_app_safety.sql` | Eventos de seguridad y grants usados |
| `src/client.ts` | La interfaz `SqlClient`: los repositorios no se atan a un driver |
| `src/migrate.ts` | Cargador y ejecutor de migraciones, idempotente |
| `src/usage-repository.ts` | Libro de consumo y ReplayGuard duradero |
| `src/deletion.ts` | El borrado de cuenta en tres pasos, en una transacción |
| `test/pglite-client.ts` | Adaptador de PGlite a `SqlClient`, solo para pruebas |

## Lo que las pruebas defienden

Cinco de las dieciocho no prueban código: prueban decisiones.

- **Ninguna clave foránea cruza de `app` a `identity`.** Se consulta
  `information_schema`. Si alguien añade esa referencia, la prueba falla y la separación
  entre identidad y contenido deja de ser una promesa.
- **`turn_metrics` no tiene columnas de contenido.** La prueba enumera sus columnas de
  texto y las compara con una lista cerrada. Añadir `transcript` la rompe.
- **El borrado de cuenta no deja nada.** Verifica las siete tablas y la identidad, y
  comprueba que otro usuario queda intacto.
- **Un recuerdo nace `proposed`.** No hay camino que inserte un aprobado directamente.
- **Un turno no se puede cobrar dos veces**, ni siquiera con tres escrituras
  simultáneas: lo garantiza la clave primaria, no la aplicación.

## Cambio respecto al documento de modelo de datos

`claude/10_DATA_MODEL.md` describía una columna `embedding vector(1536)` en
`app.memories`. **No está**, y a propósito:

1. Nada escribe embeddings todavía — la recuperación actual es léxica.
2. La dimensión tiene que coincidir con el proveedor que se acabe habilitando, y está
   sin decidir. Una dimensión adivinada obliga a recalcular todos los embeddings.
3. El build de PGlite disponible no trae pgvector, así que no habría podido probarla, y
   enviar esquema sin ejecutar va contra la regla de evidencia del proyecto.

Llega en su propia migración junto con el `EmbeddingProvider`. El documento hay que
corregirlo cuando integres esto.

## Lo que falta

- El repositorio SQL de memoria. Requiere decidir dónde vive la política: hoy
  `MemoryStore` mezcla reglas y almacenamiento, y para tener dos implementaciones
  (memoria y SQL) sujetas a la misma especificación hay que separarlas primero. Es una
  refactorización pequeña pero cambia una interfaz pública, así que no la hice a ciegas.
- Enchufar `UsageRepository` y `GrantRepository` al gateway, sustituyendo el `UsageMeter`
  y el `ReplayGuard` en memoria.
