CREATE TABLE IF NOT EXISTS aluon_saas_quote_documents (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    quote_request_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
    file_name VARCHAR(180) NOT NULL,
    content_type VARCHAR(80) NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    data BYTEA NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_documents_quote_request_id ON aluon_saas_quote_documents(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_quote_documents_tenant_id ON aluon_saas_quote_documents(tenant_id);

