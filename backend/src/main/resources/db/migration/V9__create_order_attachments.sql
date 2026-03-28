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

ALTER TABLE IF EXISTS orders
    ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_order_attachments_order ON order_attachments (order_id);
CREATE INDEX IF NOT EXISTS idx_order_attachments_tenant ON order_attachments (tenant_id);
