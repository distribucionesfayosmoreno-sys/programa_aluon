CREATE TABLE IF NOT EXISTS customer_password_resets (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    registration_id UUID NOT NULL REFERENCES customer_registrations(id),
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_password_resets_token_hash ON customer_password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_customer_password_resets_registration_id ON customer_password_resets(registration_id);
