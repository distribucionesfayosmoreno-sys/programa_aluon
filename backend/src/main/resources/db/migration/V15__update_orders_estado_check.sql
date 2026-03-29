ALTER TABLE IF EXISTS orders
    DROP CONSTRAINT IF EXISTS orders_estado_check;

ALTER TABLE IF EXISTS orders
    ADD CONSTRAINT orders_estado_check
    CHECK (estado IN (
        'PENDIENTE_MATERIAL',
        'PRESUPUESTO',
        'EN_PRODUCCION',
        'LISTO_MONTAJE',
        'INSTALADA',
        'FACTURADA'
    ));
