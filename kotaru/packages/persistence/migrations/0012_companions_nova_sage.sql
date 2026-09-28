-- Los tres personajes del elenco inicial (09_BRAND): Nova y Sage se suman a Rio. Las
-- conversaciones y la memoria apuntan al slug, asi que sin esta fila no se pueden abrir.
insert into app.companions (id, slug, display_name, persona_version)
values
  (gen_random_uuid(), 'nova', 'Nova', '1.0.0'),
  (gen_random_uuid(), 'sage', 'Sage', '1.0.0')
on conflict (slug) do nothing;

update app.companions set persona_version = '2.0.0' where slug = 'rio';
