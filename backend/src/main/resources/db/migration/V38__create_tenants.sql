CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY,
    nombre_comercial VARCHAR(255) NOT NULL,
    cif VARCHAR(255) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP NOT NULL
);

INSERT INTO tenants (id, nombre_comercial, cif, fecha_registro)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Tenant Demo',
    'DEMO-00000000',
    now()
)
ON CONFLICT (id) DO NOTHING;
