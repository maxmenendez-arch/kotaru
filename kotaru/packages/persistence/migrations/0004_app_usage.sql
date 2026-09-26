-- Metricas de turno. NINGUNA columna de contenido, por construccion: todo es un
-- identificador, un numero, un enum o una marca de tiempo.
create table app.turn_metrics (
  turn_id             text primary key,
  conversation_id     uuid        not null references app.conversations (id) on delete cascade,
  route_id            text        not null,
  stt_provider        text,
  llm_provider        text,
  tts_provider        text,
  endpoint_to_final_ms integer,
  llm_ttft_ms         integer,
  tts_ttfb_ms         integer,
  turn_total_ms       integer     not null,
  user_speech_ms      integer,
  stt_cost_usd        numeric(12,6) not null,
  llm_cost_usd        numeric(12,6) not null,
  tts_cost_usd        numeric(12,6) not null,
  infra_cost_usd      numeric(12,6) not null,
  total_cost_usd      numeric(12,6) not null,
  cost_basis          text        not null check (cost_basis in ('assumption','verified')),
  fallback_used       boolean     not null,
  interrupted         boolean     not null,
  created_at          timestamptz not null default now()
);

-- La clave primaria ES la garantia de idempotencia: un reintento del cliente, una
-- reconexion o un webhook duplicado no pueden cobrar dos veces el mismo turno.
create table app.usage_ledger (
  turn_id      text primary key,
  subject_id   uuid          not null,
  voice_seconds numeric(10,3) not null check (voice_seconds >= 0),
  cost_usd     numeric(12,6)  not null check (cost_usd >= 0),
  recorded_at  timestamptz    not null default now()
);

create index usage_ledger_subject_idx on app.usage_ledger (subject_id, recorded_at desc);

create table app.spend_rollup (
  day            date primary key,
  total_cost_usd numeric(12,6) not null default 0,
  turns          integer       not null default 0
);

create table app.entitlements (
  subject_id       uuid          not null,
  period_start     timestamptz   not null,
  period_end       timestamptz   not null,
  plan_id          text          not null,
  included_seconds integer       not null,
  addon_seconds    integer       not null default 0,
  primary key (subject_id, period_start)
);

-- Conciliacion de compras, idempotente por el identificador de evento del proveedor.
create table app.purchases (
  provider_event_id text primary key,
  subject_id        uuid        not null,
  product_id        text        not null,
  status            text        not null,
  raw_payload       jsonb       not null,
  received_at       timestamptz not null default now()
);
