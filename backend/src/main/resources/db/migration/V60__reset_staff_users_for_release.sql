-- Release bootstrap: the three staff accounts below are the only local and
-- deployed accounts allowed to enter the ALUON staff application.
DELETE FROM staff_sessions;
DELETE FROM users;

INSERT INTO users (tenant_id, username, password_hash, rol, nombre, apellidos, email, tipo_contrato, active)
VALUES
    ('00000000-0000-0000-0000-000000000000', 'admin', '$2b$12$GNV9rIh6jk72ee08jCM3GOzc1r3TZr..DwkHxdb7CofY6488cP7Z6', 'DIOS', 'Administrador', 'ALUON', 'admin@aluon.local', 'INDEFINIDO', true),
    ('00000000-0000-0000-0000-000000000000', 'diego.onate@aluon.es', '$2b$12$GNV9rIh6jk72ee08jCM3GOzc1r3TZr..DwkHxdb7CofY6488cP7Z6', 'ADMIN', 'Diego', 'Oñate', 'diego.onate@aluon.es', 'INDEFINIDO', true),
    ('00000000-0000-0000-0000-000000000000', 'daniel.onate@aluon.es', '$2b$12$GNV9rIh6jk72ee08jCM3GOzc1r3TZr..DwkHxdb7CofY6488cP7Z6', 'ADMIN', 'Daniel', 'Oñate', 'daniel.onate@aluon.es', 'INDEFINIDO', true);

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
