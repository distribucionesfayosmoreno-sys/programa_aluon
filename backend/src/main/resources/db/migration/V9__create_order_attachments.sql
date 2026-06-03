CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    assigned_user_id BIGINT,
    codigo_orden VARCHAR(120) NOT NULL UNIQUE,
    modelo_puerta VARCHAR(80) NOT NULL,
    ancho_mm INTEGER NOT NULL,
    alto_mm INTEGER NOT NULL,
    notes TEXT,
    color VARCHAR(80),
    installer_name VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL,
    estado VARCHAR(32) NOT NULL,
    workflow_step VARCHAR(32) NOT NULL DEFAULT 'INBOX',
    workflow_stage VARCHAR(32) NOT NULL DEFAULT 'INBOX',
    cutlist_id UUID
);

CREATE TABLE IF NOT EXISTS order_attachments (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    order_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(120),
    file_size BIGINT NOT NULL,
    file_data BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_order_attachments_order FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE INDEX IF NOT EXISTS idx_order_attachments_order ON order_attachments (order_id);
CREATE INDEX IF NOT EXISTS idx_order_attachments_tenant ON order_attachments (tenant_id);
