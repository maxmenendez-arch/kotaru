-- Seudonimos borrados recientemente. Un borrado de cuenta no puede cortar al instante una
-- sesion de voz en curso ni invalidar un token de acceso de 15 minutos: lo que esas
-- conexiones escriban despues del borrado quedaria huerfano y sin forma de encontrarlo.
-- El trabajo de retencion vuelve a barrer estos seudonimos durante 30 dias y luego
-- olvida tambien la lapida. Solo el seudonimo: ningun dato de identidad.
create table app.erased_subjects (
  erased_subject_id uuid primary key,
  erased_at         timestamptz not null default now()
);
