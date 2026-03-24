-- Rebuild users table to match new schema with autoincremental PK
CREATE TABLE IF NOT EXISTS users_new (
    id BIGSERIAL PRIMARY KEY,
    legacy_uuid UUID UNIQUE,
    tenant_id UUID NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono NUMERIC(9),
    horario VARCHAR(150),
    tipo_contrato VARCHAR(50) NOT NULL,
    foto BYTEA
);

INSERT INTO users_new (legacy_uuid, tenant_id, username, password_hash, rol, nombre, apellidos, email, telefono, horario, tipo_contrato, foto)
SELECT
    id,
    tenant_id,
    username,
    password_hash,
    rol,
    COALESCE(username, 'SIN_NOMBRE'),
    'SIN_APELLIDOS',
    COALESCE(username, 'sin-email@aluon.local'),
    NULL,
    NULL,
    'INDEFINIDO',
    NULL
FROM users;

-- Migrar FK de budget_validations -> users
ALTER TABLE budget_validations
    ADD COLUMN IF NOT EXISTS approved_by_user_id_new BIGINT;

UPDATE budget_validations b
SET approved_by_user_id_new = u.id
FROM users_new u
WHERE b.approved_by_user_id = u.legacy_uuid;

ALTER TABLE budget_validations
    DROP CONSTRAINT IF EXISTS fk3agu7xm6u77pluw72orpe7ybx;

ALTER TABLE budget_validations
    DROP COLUMN IF EXISTS approved_by_user_id;

ALTER TABLE budget_validations
    RENAME COLUMN approved_by_user_id_new TO approved_by_user_id;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

ALTER TABLE budget_validations
    ADD CONSTRAINT fk_budget_validations_users
    FOREIGN KEY (approved_by_user_id) REFERENCES users(id);
