-- Plan con el que se hizo cada turno. El plan gratuito tiene su propio tope de gasto
-- (KOTARU_FREE_MONTHLY_CAP_USD): cuentas gratis no pueden agotar el presupuesto de todos.
-- Nulo en los turnos anteriores a esta migracion (cuentan solo para el tope duro).
alter table app.usage_ledger add column plan text;
create index usage_ledger_free_idx on app.usage_ledger (recorded_at) where plan = 'free';
