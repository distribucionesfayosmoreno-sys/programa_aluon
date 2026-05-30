-- Elimina las tablas legacy fantasma que quedaron al fallar el renombrado de V20 (debido a ddl-auto: update)
-- El CASCADE eliminará también cualquier foreign key constraint (como fk3dp7edagdh76yed9a9nswmxxy) 
-- que apuntase a 'customers' en lugar de a 'aluon_saas_clientes'.

DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS delivery_addresses CASCADE;
