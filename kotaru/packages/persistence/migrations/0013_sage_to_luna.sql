-- Sage pasa a llamarse Luna (decision del dueño, 2026-09-28) y cambia de papel: compania y
-- calma. Las conversaciones y la memoria apuntan al slug con ON UPDATE CASCADE, asi que
-- renombrarlo aqui las mueve con el; nadie pierde su historial.
update app.companions set slug = 'luna', display_name = 'Luna', persona_version = '1.0.0' where slug = 'sage';
update app.companions set persona_version = '3.0.0' where slug = 'rio';
update app.companions set persona_version = '2.0.0' where slug = 'nova';
