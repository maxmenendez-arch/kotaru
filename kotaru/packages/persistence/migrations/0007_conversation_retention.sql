-- Preferencias del usuario que el servidor necesita aplicar. Por ahora solo una: cuanto
-- tiempo se guardan sus mensajes. NULL = el valor por defecto del servicio.
create table app.subject_settings (
  subject_id             uuid primary key,
  message_retention_days integer check (message_retention_days between 1 and 3650),
  updated_at             timestamptz not null default now()
);

-- Cada mensaje sabe de que turno viene. Con el indice unico, reintentar el guardado de
-- un turno (reconexion, reintento del gateway) no duplica la conversacion.
alter table app.messages add column turn_id text;
create unique index messages_turn_role_idx
  on app.messages (conversation_id, turn_id, role)
  where turn_id is not null;
