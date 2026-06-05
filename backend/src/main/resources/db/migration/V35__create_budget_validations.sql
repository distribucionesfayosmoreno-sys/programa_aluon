CREATE TABLE IF NOT EXISTS budget_validations (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    budget_number VARCHAR(80) NOT NULL,
    request_id VARCHAR(80) NOT NULL,
    customer_name VARCHAR(160) NOT NULL,
    model_label VARCHAR(120),
    m2 NUMERIC(12, 2),
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    approved_at TIMESTAMP,
    approved_by_user_id BIGINT
);

ALTER TABLE budget_validations
    ADD CONSTRAINT fk_budget_validations_approved_by_user
    FOREIGN KEY (approved_by_user_id) REFERENCES users (id);

ALTER TABLE budget_validations
    ADD CONSTRAINT chk_budget_validations_status
    CHECK (status IN ('PENDIENTE', 'APROBADO'));

CREATE UNIQUE INDEX IF NOT EXISTS uq_budget_validations_budget_number
    ON budget_validations (budget_number);

CREATE INDEX IF NOT EXISTS idx_budget_validations_tenant_id
    ON budget_validations (tenant_id);

CREATE INDEX IF NOT EXISTS idx_budget_validations_status
    ON budget_validations (status);

CREATE INDEX IF NOT EXISTS idx_budget_validations_created_at
    ON budget_validations (created_at DESC);
