ALTER TABLE aluon_saas_quote_documents
    ADD COLUMN IF NOT EXISTS tipo VARCHAR(40),
    ADD COLUMN IF NOT EXISTS numero_documento VARCHAR(80);

-- Backfill desde file_name (si existe).
-- Reglas:
-- - numero_documento: file_name sin ".pdf" y sin prefijo "presupuesto-" cuando aplique
-- - tipo: PRESUPUESTO por defecto
UPDATE aluon_saas_quote_documents
SET
    tipo = COALESCE(tipo, 'PRESUPUESTO'),
    numero_documento = COALESCE(
        numero_documento,
        CASE
            WHEN file_name ILIKE 'presupuesto-%' THEN regexp_replace(regexp_replace(file_name, '\\.pdf$', ''), '^presupuesto-', '')
            ELSE regexp_replace(file_name, '\\.pdf$', '')
        END
    )
WHERE file_name IS NOT NULL;

ALTER TABLE aluon_saas_quote_documents
    ALTER COLUMN tipo SET NOT NULL,
    ALTER COLUMN numero_documento SET NOT NULL;

ALTER TABLE aluon_saas_quote_documents
    DROP COLUMN IF EXISTS file_name;

CREATE INDEX IF NOT EXISTS idx_quote_documents_tipo ON aluon_saas_quote_documents(tipo);
CREATE INDEX IF NOT EXISTS idx_quote_documents_numero_documento ON aluon_saas_quote_documents(numero_documento);

