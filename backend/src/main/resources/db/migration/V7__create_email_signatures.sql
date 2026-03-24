CREATE TABLE IF NOT EXISTS email_signatures (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    role VARCHAR(160),
    phone VARCHAR(60),
    email VARCHAR(160) NOT NULL,
    website VARCHAR(200),
    address VARCHAR(220),
    logo_url VARCHAR(500),
    accent_color VARCHAR(20),
    html TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_signatures_tenant_id ON email_signatures (tenant_id);
