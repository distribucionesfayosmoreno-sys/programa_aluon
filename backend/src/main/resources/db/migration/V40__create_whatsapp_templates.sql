CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    template_key VARCHAR(80) NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_whatsapp_templates_tenant_key ON whatsapp_templates (tenant_id, template_key);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_tenant ON whatsapp_templates (tenant_id);
