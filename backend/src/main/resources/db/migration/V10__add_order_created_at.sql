ALTER TABLE IF EXISTS orders
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;

UPDATE orders
SET created_at = NOW()
WHERE created_at IS NULL;
