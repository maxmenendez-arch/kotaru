-- Identidad. Este esquema y `app` NO comparten ninguna clave foranea: esa es la
-- separacion entre quien es alguien y lo que conversa. Ver claude/10_DATA_MODEL.md.
create schema if not exists identity;

create table identity.accounts (
  id               uuid primary key,
  auth_provider    text        not null,
  auth_subject     text        not null,
  -- Nunca el correo en claro. El hash sirve para buscar; el cifrado, para escribirle.
  email_hash       bytea       not null,
  email_encrypted  bytea       not null,
  created_at       timestamptz not null default now(),
  deleted_at       timestamptz,
  constraint accounts_auth_unique unique (auth_provider, auth_subject)
);

create unique index accounts_email_hash_idx on identity.accounts (email_hash)
  where deleted_at is null;

-- El unico puente entre una persona y sus datos. Una fila por cuenta.
create table identity.subject_links (
  account_id uuid primary key references identity.accounts (id) on delete restrict,
  subject_id uuid not null unique,
  created_at timestamptz not null default now()
);

-- Un borrado que se completa a medias en silencio es peor que uno que falla.
create table identity.deletion_requests (
  id             uuid primary key,
  account_id     uuid        not null references identity.accounts (id) on delete restrict,
  requested_at   timestamptz not null default now(),
  completed_at   timestamptz,
  failure_reason text
);

create index deletion_requests_pending_idx on identity.deletion_requests (requested_at)
  where completed_at is null;
