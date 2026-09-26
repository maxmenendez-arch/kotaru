create table app.memories (
  id             uuid primary key,
  subject_id     uuid        not null,
  companion_id   uuid        not null references app.companions (id) on delete restrict,
  kind           text        not null check (kind in ('fact','preference','plan','relationship','boundary')),
  text           text        not null,
  -- `proposed` es el default y no hay camino que inserte un aprobado directamente.
  status         text        not null default 'proposed'
                   check (status in ('proposed','approved','rejected')),
  pinned         boolean     not null default false,
  confidence     real        not null check (confidence >= 0 and confidence <= 1),
  source_turn_id text        not null,
  use_count      integer     not null default 0,
  last_used_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  expires_at     timestamptz
);

-- La regla de duplicados deja de ser una comprobacion de la aplicacion y pasa a ser
-- una restriccion de la base: dos procesos concurrentes no pueden colarla.
create unique index memories_no_duplicates_idx
  on app.memories (subject_id, companion_id, lower(text))
  where status <> 'rejected';

-- La recuperacion solo lee aprobados, asi que el indice no carga con el resto.
create index memories_recall_idx
  on app.memories (subject_id, companion_id)
  where status = 'approved';

create index memories_expiry_idx on app.memories (expires_at) where expires_at is not null;

-- NOTA: no hay columna de embeddings todavia, a proposito. Nada los escribe (la
-- recuperacion actual es lexica) y la dimension tiene que coincidir con el proveedor
-- que se acabe habilitando. Una columna vector con una dimension adivinada obliga a
-- recalcular todos los embeddings cuando se elija de verdad. Llega en su propia
-- migracion junto con el EmbeddingProvider.
