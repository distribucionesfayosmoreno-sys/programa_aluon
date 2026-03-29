ALTER TABLE customer_registrations
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
