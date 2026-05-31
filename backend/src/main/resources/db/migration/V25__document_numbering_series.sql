CREATE TABLE IF NOT EXISTS document_number_series (
    tenant_id UUID NOT NULL,
    series_date DATE NOT NULL,
    last_sequence INTEGER NOT NULL,
    PRIMARY KEY (tenant_id, series_date)
);

ALTER TABLE quote_requests
    ADD COLUMN IF NOT EXISTS series_date DATE,
    ADD COLUMN IF NOT EXISTS series_sequence INTEGER;

CREATE INDEX IF NOT EXISTS idx_quote_requests_series_date_seq
    ON quote_requests (series_date, series_sequence);

