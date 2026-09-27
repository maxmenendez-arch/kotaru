-- Inicio de sesion con passkey (WebAuthn): sin terceros, sin correo y sin contrasena.
--
-- Una cuenta de passkey se identifica como las de Apple o Google: auth_provider='passkey'
-- y auth_subject = el user handle aleatorio que el servidor le dio al registrarla (lo que
-- el autenticador devuelve al entrar). Solo se guarda la clave PUBLICA de cada passkey:
-- una copia de la base no permite entrar.
create table identity.passkeys (
  credential_id text        primary key,
  account_id    uuid        not null references identity.accounts (id) on delete cascade,
  public_key    bytea       not null,
  sign_count    bigint      not null default 0,
  transports    text[]      not null default '{}',
  backed_up     boolean     not null default false,
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz
);

create index passkeys_account_idx on identity.passkeys (account_id);

-- Retos de un solo uso (registro y entrada). Se consumen al verificar, salga bien o mal,
-- y caducan a los pocos minutos; la retencion barre los viejos.
create table identity.webauthn_challenges (
  id          uuid        primary key,
  kind        text        not null check (kind in ('register', 'login')),
  challenge   text        not null,
  user_handle text,
  expires_at  timestamptz not null,
  used_at     timestamptz
);

create index webauthn_challenges_expiry_idx on identity.webauthn_challenges (expires_at);
