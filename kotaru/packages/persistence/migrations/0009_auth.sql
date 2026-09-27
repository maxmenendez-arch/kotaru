-- Inicio de sesion con Apple y Google.
--
-- Apple solo entrega el correo la primera vez (y a veces uno de reenvio privado); Google
-- puede no entregarlo si no se pide. Una cuenta sin correo es valida: se identifica por
-- (auth_provider, auth_subject), que es lo que firma el proveedor.
alter table identity.accounts alter column email_hash drop not null;
alter table identity.accounts alter column email_encrypted drop not null;

-- Tokens de renovacion. Solo se guarda su hash: una copia de la base no permite abrir
-- sesiones. Rotan en cada uso y se agrupan en familias (un inicio de sesion = una familia):
--   - un token ya usado que vuelve a aparecer delata un robo, y se revoca la familia entera;
--   - la familia tiene fecha de fin absoluta: renovar no alarga una sesion para siempre.
create table identity.refresh_tokens (
  token_hash        bytea       primary key,
  account_id        uuid        not null references identity.accounts (id) on delete cascade,
  family_id         uuid        not null,
  created_at        timestamptz not null default now(),
  expires_at        timestamptz not null,
  family_expires_at timestamptz not null,
  used_at           timestamptz
);

create index refresh_tokens_account_idx on identity.refresh_tokens (account_id);
create index refresh_tokens_family_idx on identity.refresh_tokens (family_id);
create index refresh_tokens_expiry_idx on identity.refresh_tokens (expires_at);
