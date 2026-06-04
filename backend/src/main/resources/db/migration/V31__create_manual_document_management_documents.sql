CREATE TABLE IF NOT EXISTS document_management_manual_documents (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    customer_name VARCHAR(160) NOT NULL,
    type VARCHAR(40) NOT NULL,
    number VARCHAR(80) NOT NULL,
    status_label VARCHAR(40) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_manual_document_management_created_at
    ON document_management_manual_documents(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_manual_document_management_type_number
    ON document_management_manual_documents(tenant_id, lower(type), lower(number));
