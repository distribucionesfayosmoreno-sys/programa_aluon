-- V10: Estaciones de producción para la cadena de montaje
CREATE TABLE production_stations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    station_code    VARCHAR(30) NOT NULL,
    sequence_order  INTEGER NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    operator_user_id BIGINT REFERENCES users(id),
    operator_name   VARCHAR(255),
    started_at      TIMESTAMP,
    completed_at    TIMESTAMP,
    block_reason    TEXT,
    blocked_at      TIMESTAMP,
    unblocked_at    TIMESTAMP,
    notes           TEXT,

    CONSTRAINT uq_production_station_order_code UNIQUE (order_id, station_code)
);

CREATE INDEX idx_prod_station_order ON production_stations(order_id);
CREATE INDEX idx_prod_station_tenant ON production_stations(tenant_id);

COMMENT ON TABLE production_stations IS 'Estaciones de la cadena de montaje por orden de producción';
