DO $$
BEGIN
    IF to_regclass('public.quote_items') IS NOT NULL
        AND to_regclass('public.aluon_saas_quote_items') IS NULL THEN
        ALTER TABLE quote_items RENAME TO aluon_saas_quote_items;
    END IF;
END $$;

ALTER TABLE IF EXISTS aluon_saas_quote_items
    ADD COLUMN IF NOT EXISTS unidades INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_aluon_saas_quote_items_tenant_id ON aluon_saas_quote_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_aluon_saas_quote_items_quote_request_id ON aluon_saas_quote_items(quote_request_id);

