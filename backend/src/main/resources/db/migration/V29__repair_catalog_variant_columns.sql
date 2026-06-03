ALTER TABLE aluon_saas_catalogo_productos
    ADD COLUMN IF NOT EXISTS nombre VARCHAR(120),
    ADD COLUMN IF NOT EXISTS descripcion TEXT,
    ADD COLUMN IF NOT EXISTS imagen_card TEXT,
    ADD COLUMN IF NOT EXISTS orden INTEGER,
    ADD COLUMN IF NOT EXISTS activo BOOLEAN;

UPDATE aluon_saas_catalogo_productos
SET nombre = COALESCE(nombre, CASE modelo
        WHEN 'CLASSIC' THEN 'SERIE CLASSIC'
        WHEN 'INOX' THEN 'SERIE INOX'
        WHEN 'PREMIUM' THEN 'SERIE PREMIUM'
        WHEN 'VENECIANA' THEN 'SERIE VENECIANA'
        ELSE 'SERIE ' || modelo
    END),
    descripcion = COALESCE(descripcion, 'Familia configurable desde administración.'),
    imagen_card = COALESCE(imagen_card, imagen_modelo),
    orden = COALESCE(orden, CASE modelo
        WHEN 'CLASSIC' THEN 10
        WHEN 'INOX' THEN 20
        WHEN 'PREMIUM' THEN 30
        WHEN 'VENECIANA' THEN 40
        ELSE 999
    END),
    activo = COALESCE(activo, TRUE);

ALTER TABLE aluon_saas_catalogo_productos
    ALTER COLUMN nombre SET NOT NULL,
    ALTER COLUMN orden SET NOT NULL,
    ALTER COLUMN activo SET NOT NULL;

ALTER TABLE aluon_saas_catalogo_producto_variantes
    ADD COLUMN IF NOT EXISTS nombre VARCHAR(120),
    ADD COLUMN IF NOT EXISTS descripcion TEXT,
    ADD COLUMN IF NOT EXISTS imagen_card TEXT,
    ADD COLUMN IF NOT EXISTS orden INTEGER,
    ADD COLUMN IF NOT EXISTS activo BOOLEAN;

UPDATE aluon_saas_catalogo_producto_variantes
SET nombre = COALESCE(nombre, CASE variante
        WHEN 'PEATONAL' THEN 'PUERTA'
        WHEN 'ABATIBLE_UNA' THEN 'ABATIBLE UNA HOJA'
        WHEN 'ABATIBLE_DOS' THEN 'ABATIBLE DOS HOJAS'
        WHEN 'CORREDERA' THEN 'PUERTA CORREDERA'
        WHEN 'VALLA' THEN 'VALLA'
        ELSE variante
    END),
    descripcion = COALESCE(descripcion, 'Opción configurable desde administración.'),
    imagen_card = COALESCE(imagen_card, imagen_variante),
    orden = COALESCE(orden, CASE variante
        WHEN 'PEATONAL' THEN 10
        WHEN 'VALLA' THEN 20
        WHEN 'CORREDERA' THEN 30
        WHEN 'ABATIBLE_UNA' THEN 40
        WHEN 'ABATIBLE_DOS' THEN 50
        ELSE 999
    END),
    activo = COALESCE(activo, TRUE);

ALTER TABLE aluon_saas_catalogo_producto_variantes
    ALTER COLUMN nombre SET NOT NULL,
    ALTER COLUMN orden SET NOT NULL,
    ALTER COLUMN activo SET NOT NULL;
