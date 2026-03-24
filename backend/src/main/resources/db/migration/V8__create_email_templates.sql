CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    template_key VARCHAR(80) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body_html TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_email_templates_tenant_key ON email_templates (tenant_id, template_key);
CREATE INDEX IF NOT EXISTS idx_email_templates_tenant ON email_templates (tenant_id);
