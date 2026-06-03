ALTER TABLE aluon_saas_catalogo_productos
    ALTER COLUMN imagen_modelo TYPE TEXT USING imagen_modelo::TEXT,
    ALTER COLUMN imagen_card TYPE TEXT USING imagen_card::TEXT;

ALTER TABLE aluon_saas_catalogo_puertas
    ALTER COLUMN imagen_modelo TYPE TEXT USING imagen_modelo::TEXT;

ALTER TABLE aluon_saas_catalogo_producto_variantes
    ALTER COLUMN imagen_variante TYPE TEXT USING imagen_variante::TEXT,
    ALTER COLUMN imagen_card TYPE TEXT USING imagen_card::TEXT;
