-- Coqueteo sensual (manuales de Nova y Rio, 2026-09-28): solo si la persona, adulta, lo
-- activa en Ajustes. Se guarda CUANDO lo activo (el consentimiento), no un simple si/no:
-- NULL = desactivado. Apagarlo vuelve a NULL.
alter table app.subject_settings add column sensual_flirting_since timestamptz;
