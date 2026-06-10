ALTER TABLE IF EXISTS aluon_saas_catalogo_puertas
    ADD COLUMN IF NOT EXISTS precio_tarifa_a NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS precio_tarifa_b NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS metros2_minimo NUMERIC(12, 4);
