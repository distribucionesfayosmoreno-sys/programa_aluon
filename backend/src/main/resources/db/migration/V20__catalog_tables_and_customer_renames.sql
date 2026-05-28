DO $$
BEGIN
    IF to_regclass('public.customers') IS NOT NULL
        AND to_regclass('public.aluon_saas_clientes') IS NULL THEN
        ALTER TABLE customers RENAME TO aluon_saas_clientes;
    END IF;

    IF to_regclass('public.delivery_addresses') IS NOT NULL
        AND to_regclass('public.aluon_saas_direcciones_entrega') IS NULL THEN
        ALTER TABLE delivery_addresses RENAME TO aluon_saas_direcciones_entrega;
    END IF;
END $$;

ALTER TABLE quote_items
    ADD COLUMN IF NOT EXISTS product_category VARCHAR(32),
    ADD COLUMN IF NOT EXISTS color_code VARCHAR(32),
    ADD COLUMN IF NOT EXISTS primer_required BOOLEAN,
    ADD COLUMN IF NOT EXISTS opening_variant VARCHAR(32),
    ADD COLUMN IF NOT EXISTS floor_clearance_mm INTEGER,
    ADD COLUMN IF NOT EXISTS larguero BOOLEAN,
    ADD COLUMN IF NOT EXISTS marco_superior BOOLEAN,
    ADD COLUMN IF NOT EXISTS bisagras BOOLEAN,
    ADD COLUMN IF NOT EXISTS portero_automatico BOOLEAN;

CREATE TABLE IF NOT EXISTS aluon_saas_catalogo_productos (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    modelo VARCHAR(32) NOT NULL,
    imagen_modelo TEXT,
    UNIQUE (tenant_id, modelo)
);

CREATE TABLE IF NOT EXISTS aluon_saas_catalogo_puertas (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    modelo_id UUID NOT NULL REFERENCES aluon_saas_catalogo_productos(id) ON DELETE CASCADE,
    producto VARCHAR(32) NOT NULL,
    imagen_modelo TEXT,
    UNIQUE (tenant_id, modelo_id, producto)
);

CREATE TABLE IF NOT EXISTS aluon_saas_catalogo_producto_variantes (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    puerta_id UUID NOT NULL REFERENCES aluon_saas_catalogo_puertas(id) ON DELETE CASCADE,
    variante VARCHAR(32) NOT NULL,
    imagen_variante TEXT,
    UNIQUE (tenant_id, puerta_id, variante)
);

-- Seed básico (tenant global 0000...) para no romper flujos locales.
INSERT INTO aluon_saas_catalogo_productos (id, tenant_id, modelo, imagen_modelo)
VALUES
    ('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000000000', 'PREMIUM', 'aluon-premium'),
    ('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000000000', 'CLASSIC', 'aluon-classic'),
    ('00000000-0000-0000-0000-000000002003', '00000000-0000-0000-0000-000000000000', 'INOX', 'aluon-inox'),
    ('00000000-0000-0000-0000-000000002004', '00000000-0000-0000-0000-000000000000', 'VENECIANA', 'aluon-veneciana')
ON CONFLICT (tenant_id, modelo) DO NOTHING;

-- Productos (categoría) con imagen por modelo + producto
INSERT INTO aluon_saas_catalogo_puertas (id, tenant_id, modelo_id, producto, imagen_modelo)
VALUES
    ('00000000-0000-0000-0000-000000002101', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002001', 'PUERTA_PASO', 'door-paso-premium'),
    ('00000000-0000-0000-0000-000000002102', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002001', 'PUERTA_GARAJE', 'door-garaje-premium'),
    ('00000000-0000-0000-0000-000000002103', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002001', 'VALLA', 'door-valla-premium'),
    ('00000000-0000-0000-0000-000000002104', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002001', 'REJA', 'door-reja-premium')
ON CONFLICT (tenant_id, modelo_id, producto) DO NOTHING;

-- Variantes de apertura (demo) por producto: puerta paso + puerta garaje
INSERT INTO aluon_saas_catalogo_producto_variantes (id, tenant_id, puerta_id, variante, imagen_variante)
VALUES
    ('00000000-0000-0000-0000-000000002201', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002101', 'PEATONAL', 'var-peatonal'),
    ('00000000-0000-0000-0000-000000002202', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002101', 'ABATIBLE_UNA', 'var-abatible-una'),
    ('00000000-0000-0000-0000-000000002203', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002101', 'ABATIBLE_DOS', 'var-abatible-dos'),
    ('00000000-0000-0000-0000-000000002204', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000002102', 'CORREDERA', 'var-corredera')
ON CONFLICT (tenant_id, puerta_id, variante) DO NOTHING;

