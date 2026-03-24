CREATE TABLE IF NOT EXISTS customer_registrations (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    nombre_comercial VARCHAR(255) NOT NULL,
    razon_social VARCHAR(255),
    persona_contacto VARCHAR(255),
    email VARCHAR(160) NOT NULL,
    telefono_whatsapp VARCHAR(40) NOT NULL,
    direccion VARCHAR(255),
    cp VARCHAR(20),
    poblacion VARCHAR(120),
    provincia VARCHAR(120),
    pais VARCHAR(120),
    status VARCHAR(16) NOT NULL,
    tariff_code VARCHAR(50),
    customer_id UUID,
    auto_approve_quotes BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP
);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS auto_approve_quotes BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_customer_registrations_status ON customer_registrations(status);
CREATE INDEX IF NOT EXISTS idx_customer_registrations_created_at ON customer_registrations(created_at);
