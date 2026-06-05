-- Operarios de prueba para la cadena de montaje
INSERT INTO users (tenant_id, username, password_hash, rol, nombre, apellidos, email, tipo_contrato)
VALUES 
('00000000-0000-0000-0000-000000000000', 'soldador1', '$2a$10$dXJ3ADWyyTXmJ5W5w.tHLOxK.0a0o6hQ3gJjX2Z7U1V9v2d1W1X1G', 'SOLDADOR', 'Paco', 'García (Soldadura)', 'paco.soldador@aluon.local', 'INDEFINIDO'),
('00000000-0000-0000-0000-000000000000', 'soldador2', '$2a$10$dXJ3ADWyyTXmJ5W5w.tHLOxK.0a0o6hQ3gJjX2Z7U1V9v2d1W1X1G', 'SOLDADOR', 'Luis', 'Martínez (Soldadura)', 'luis.soldador@aluon.local', 'INDEFINIDO'),
('00000000-0000-0000-0000-000000000000', 'montador1', '$2a$10$dXJ3ADWyyTXmJ5W5w.tHLOxK.0a0o6hQ3gJjX2Z7U1V9v2d1W1X1G', 'MONTADOR', 'Ana', 'López (Montaje)', 'ana.montador@aluon.local', 'INDEFINIDO'),
('00000000-0000-0000-0000-000000000000', 'montador2', '$2a$10$dXJ3ADWyyTXmJ5W5w.tHLOxK.0a0o6hQ3gJjX2Z7U1V9v2d1W1X1G', 'MONTADOR', 'Carlos', 'Ruiz (Montaje)', 'carlos.montador@aluon.local', 'INDEFINIDO'),
('00000000-0000-0000-0000-000000000000', 'almacen1', '$2a$10$dXJ3ADWyyTXmJ5W5w.tHLOxK.0a0o6hQ3gJjX2Z7U1V9v2d1W1X1G', 'ALMACEN', 'Laura', 'Sánchez (Almacén)', 'laura.almacen@aluon.local', 'INDEFINIDO')
ON CONFLICT (username) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
