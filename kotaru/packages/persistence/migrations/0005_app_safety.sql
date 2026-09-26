-- Registra QUE se activo una politica y cual version, nunca que se dijo. Poder
-- responder "que politica estaba vigente" despues de un incidente es todo el punto.
create table app.safety_events (
  id              uuid primary key,
  subject_id      uuid        not null,
  conversation_id uuid        references app.conversations (id) on delete set null,
  policy_version  text        not null,
  outcome         text        not null
                    check (outcome in ('allow','soften','refuse','crisis_handoff','block_minor')),
  created_at      timestamptz not null default now()
);

create index safety_events_subject_idx on app.safety_events (subject_id, created_at desc);

-- El ReplayGuard, duradero. Redis es el camino rapido; este sobrevive a un reinicio.
create table app.used_grants (
  jti        text primary key,
  expires_at timestamptz not null
);

create index used_grants_expiry_idx on app.used_grants (expires_at);
