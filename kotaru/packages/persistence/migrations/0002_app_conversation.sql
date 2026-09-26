-- Todo lo de aqui se indexa por subject_id, un seudonimo. Ninguna tabla de este
-- esquema referencia identity: un volcado de `app` no contiene correo ni nombre.
create schema if not exists app;

create table app.companions (
  id              uuid primary key,
  slug            text        not null unique,
  display_name    text        not null,
  persona_version text        not null,
  created_at      timestamptz not null default now()
);

create table app.conversations (
  id           uuid primary key,
  subject_id   uuid        not null,
  companion_id uuid        not null references app.companions (id) on delete restrict,
  started_at   timestamptz not null default now(),
  last_turn_at timestamptz,
  closed_at    timestamptz
);

create index conversations_subject_idx on app.conversations (subject_id, started_at desc);

create table app.messages (
  id              uuid primary key,
  conversation_id uuid        not null references app.conversations (id) on delete cascade,
  role            text        not null check (role in ('system', 'user', 'companion')),
  content         text        not null,
  locale          text,
  created_at      timestamptz not null default now(),
  -- Retencion: lo pone la preferencia del usuario al escribir, y un trabajo nocturno
  -- borra lo vencido.
  expires_at      timestamptz
);

create index messages_conversation_idx on app.messages (conversation_id, created_at);
create index messages_expiry_idx on app.messages (expires_at) where expires_at is not null;
