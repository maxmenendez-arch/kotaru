-- El producto identifica a cada companion por su slug ('rio'), no por un uuid interno:
-- es lo que viaja en los grants, en la memoria y en la app. Las columnas companion_id de
-- conversaciones y recuerdos pasan a guardar el slug y a referenciarlo directamente.
alter table app.conversations drop constraint conversations_companion_id_fkey;
alter table app.memories      drop constraint memories_companion_id_fkey;

alter table app.conversations alter column companion_id type text using companion_id::text;
alter table app.memories      alter column companion_id type text using companion_id::text;

update app.conversations v set companion_id = c.slug
  from app.companions c where c.id::text = v.companion_id;
update app.memories m set companion_id = c.slug
  from app.companions c where c.id::text = m.companion_id;

alter table app.conversations add constraint conversations_companion_fkey
  foreign key (companion_id) references app.companions (slug) on update cascade on delete restrict;
alter table app.memories add constraint memories_companion_fkey
  foreign key (companion_id) references app.companions (slug) on update cascade on delete restrict;

-- El duplicado ignora los espacios de borde, igual que la regla en la aplicacion
-- (duplicateKey en @kotaru/memory). Antes solo ignoraba mayusculas.
drop index app.memories_no_duplicates_idx;
create unique index memories_no_duplicates_idx
  on app.memories (subject_id, companion_id, lower(btrim(text)))
  where status <> 'rejected';

-- El primer companion del catalogo.
insert into app.companions (id, slug, display_name, persona_version)
values (gen_random_uuid(), 'rio', 'Rio', '0.1.0')
on conflict (slug) do nothing;

-- `real` es de 4 bytes: 0.6 volvia como 0.6000000238. La confianza la compara el codigo
-- con umbrales, y un valor que no sobrevive ida y vuelta es un error esperando ocurrir.
alter table app.memories alter column confidence type double precision;
