# Portones en el asistente de presupuestos

La adaptación del análisis Portalum de 30/10/2026 se incorpora como una ficha técnica opcional en el paso **Medidas** del asistente existente. Las series PREMIUM, CLASSIC, INOX y VENECIANA siguen siendo las series de ALUON para calcular la tarifa. El análisis no establece equivalencias entre estas series y los paneles de Portalum.

## Datos y correspondencias

La fuente de datos es `backend/src/main/resources/catalog/portones.json`, publicada en `GET /api/catalog/portones`. El servidor valida contra esta misma referencia; el frontend la consulta para mostrar opciones y límites.

| Familia de referencia | Categoría actual | Apertura actual |
| --- | --- | --- |
| Corredera de 1/2 hojas, telescópica y con peatonal integrada | PUERTA_GARAJE | CORREDERA |
| Pivotante de 1 hoja | PUERTA_PASO | ABATIBLE_UNA |
| Pivotante de 2 hojas o desiguales | PUERTA_PASO | ABATIBLE_DOS |
| Peatonal de 1 hoja pequeña/grande | PUERTA_PASO | PEATONAL |
| Peatonal de 2 hojas pequeñas/grandes | PUERTA_PASO | ABATIBLE_DOS |
| Vallado pilastra, horizontal, enmarcado y vertical | VALLA | VALLA |

Se incluyen 15 variantes, 16 referencias de panel (incluido sin panel), 18 acabados estándar, 6 maderas, 3 anodizados y Otro RAL. Las combinaciones de panel se restringen por variante; el vallado horizontal admite M100/M200/M330 en horizontal. Los pesos se muestran como estimaciones del relleno, sin marco ni herrajes.

La ficha recoge variante, panel, orientación, acabado, RAL personalizado, guía, perfil de cierre, motor, fotocélula y banda resistiva. El sentido de apertura, marco superior, medidas y accesorios existentes mantienen sus campos actuales. Las medidas del vallado se introducen en milímetros, por fijo: se añade una línea por fijo.

## Validación y conservación

- El backend comprueba que categoría y apertura coinciden con la variante y valida los límites de medidas documentados.
- Las peatonales requieren holgura inferior de 10–15 mm.
- Solo correderas y pivotantes admiten motor. Al solicitarlo se exige fotocélula, banda resistiva o ambas.
- La ficha se guarda en `aluon_saas_quote_items.porton_configuration`, se devuelve en la API y se muestra en el resumen, detalle, resultado y PDF de presupuesto/albarán.
- Las líneas anteriores conservan un valor nulo. La migración aditiva es `V59__quote_items_porton_configuration.sql`; debe aplicarse antes de arrancar esta versión del backend. Los entornos con Flyway desactivado deben ejecutarla por su procedimiento habitual.
- Los presupuestos con ficha técnica requieren validación manual, incluso para clientes con aprobación automática. El precio sigue siendo el de la tarifa ALUON: panel, acabado, motor y accesorios requieren valoración expresa.

## Datos pendientes de confirmar

El análisis da criterios contradictorios para la cola de la corredera. No se calcula ni se incorpora al despiece. Tampoco se inventan mínimos de altura para peatonales ni mínimos de ancho para vallados o peatonales de dos hojas cuando no se documentan. Los rangos admitidos son referencias comerciales y requieren revisión de viabilidad antes de fabricar.

No se añaden certificados, garantías, normativa, referencias de perfilería ni motores al catálogo de fabricación de ALUON sin una equivalencia validada. No se generan enlaces a descargas: el texto aportado contiene etiquetas «PDF», sin sus direcciones. La galería, el SEO y las páginas públicas descritas pertenecen a un sitio comercial y no forman parte de este asistente interno.

## Verificación

- Frontend: `npm ci`, `npm run build` y `npm run lint` en `frontend`.
- Backend: `bash mvnw test` en `backend`, con la base de datos de pruebas configurada y V59 aplicada. Para ejecutar la suite aislada sin los seeders del perfil local:

```bash
bash mvnw test \
  -Dspring.profiles.active=test \
  -Dapp.tenant.default-id=00000000-0000-0000-0000-000000000000 \
  -Dspring.mail.host=localhost \
  -Dspring.datasource.url=jdbc:h2:mem:porton-tests \
  -Dspring.datasource.driver-class-name=org.h2.Driver \
  -Dspring.jpa.database-platform=org.hibernate.dialect.H2Dialect \
  -Dspring.jpa.properties.hibernate.tenant_identifier_resolver=com.aluon.core.tenant.service.CurrentTenantIdentifierResolverImpl \
  -Dspring.jpa.hibernate.ddl-auto=create-drop \
  -Dspring.flyway.enabled=false
```

Las pruebas cubren límites de las 15 variantes, combinaciones de panel, seguridad, holgura, rechazo de opciones incompatibles, conversión de almacenamiento, migración aditiva, conservación del importe de tarifa y revisión manual. La migración se prueba por separado en H2; la suite aislada no verifica todas las migraciones históricas de PostgreSQL.
