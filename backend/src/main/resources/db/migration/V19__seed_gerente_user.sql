-- Seeding the manager user with ID 1234 and Role DIOS
DELETE FROM users WHERE id = 1234 OR username = 'gerente';

INSERT INTO users (id, tenant_id, username, password_hash, rol, nombre, apellidos, email, tipo_contrato)
VALUES (1234, '00000000-0000-0000-0000-000000000000', 'gerente', '$2a$10$dXJ3ADWyyTXmJ5W5w.tHLOxK.0a0o6hQ3gJjX2Z7U1V9v2d1W1X1G', 'DIOS', 'Gerente', 'Aluon', 'gerente@aluon.com', 'INDEFINIDO');

-- Reajustar la secuencia de ids autoincrementales para evitar colisiones futuras
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
