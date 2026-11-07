# Referencias Marver en el configurador ALUON

La opción **Configurador → Plantillas Marver del ZIP** incorpora el contenido de `plantillas/Archivo.zip` (análisis del 28/10/2026) al configurador de pedidos existente.

## Contenido importado

- 25 plantillas, incluidas peatonales con fijos, batientes, correderas telescópicas, bi-folding, vallados, Welcome, remates, accesorios, series especiales y presupuesto especial.
- 467 fichas de modelo por plantilla y 189 imágenes distintas, extraídas de los datos incrustados en el HTML. Los códigos se normalizan sin tildes ni espacios; se conserva el código original como referencia.
- 829 campos del inventario de recorrido, completados con opciones adicionales del otro inventario: 1.298 entradas de campo de los inventarios. Se añaden 17 campos de adjunto propios de ALUON en las plantillas donde no se había capturado uno (1.315 entradas en el catálogo adaptado). Incluyen repeticiones entre plantillas y campos de familias alternativas del portal original.
- Condiciones observadas para mostrar u ocultar campos, restricciones de modelo y opciones particulares. Los campos adicionales cuya aplicabilidad no pudo observarse se agrupan en un desplegable y requieren confirmación técnica. No se reproducen los bloqueos del portal que ocultaban todos los herrajes tras la casilla «ENTENDIDO».
- Diez PDF locales: cinco manuales y cinco catálogos. Se descargan bajo demanda. Las dos grabaciones son material de análisis y no se publican como documentación del cliente.

## Flujo

1. **Producto:** elegir origen Marver y plantilla. Cambiar de plantilla reinicia sus respuestas y adjuntos.
2. **Datos del pedido:** cliente del CRM o nombre manual, referencia, modelo visual, color y acabado de la plantilla.
3. **Fabricación:** apertura, lamas y opciones de instalación que correspondan.
4. **Medidas:** cotas específicas y rangos de captura del formulario original.
5. **Observaciones:** accesorios, opciones adicionales, adjuntos y descarga de documentación.
6. **Revisión:** resumen de respuestas, borrador, PDF paginado o envío a revisión técnica.

Los campos se distribuyen por su significado. Al cambiar un dato o modelo se eliminan respuestas y adjuntos que dejan de estar disponibles. La selección permanece en el borrador local; al guardar se conserva en el payload versionado y en el historial del configurador. Los adjuntos se copian a sus documentos versionados (PDF o imagen, hasta 5 MB por archivo y 8 MB en total).

El PDF de referencia contiene las respuestas de la plantilla y no utiliza cotas, croquis ni herrajes por defecto del configurador nativo. El tipo persistido es `REFERENCIA_MARVER`; el modelo se identifica como referencia Marver. No se asigna una serie técnica o tarifa ALUON por similitud visual. La continuación automática hacia un presupuesto tarifado se deshabilita hasta disponer de una equivalencia validada.

## Validación y límites

`MarverReferenceValidator` comprueba en el servidor la plantilla, el modelo, los identificadores de campo, tipos, opciones y rangos de los valores enviados. Reconstruye los nombres y etiquetas del resumen a partir del catálogo importado. Las referencias pueden guardarse como borrador, pendientes de revisión o anuladas; se rechazan la confirmación y la entrada en fabricación, también mediante el cambio administrativo de estado. No hace falta una migración de base de datos: se utiliza el payload y los documentos existentes.

Los límites HTML del portal son límites de captura, no límites de fabricación aprobados por ALUON. El ZIP no contiene tarifas ni una equivalencia entre modelos Marver y las series técnicas ALUON. Los precios, compatibilidades no observadas y nombres comerciales dudosos (Alma/Ámbar) requieren revisión antes de dar una oferta o fabricar. Los campos opcionales no se convierten en obligatorios sin evidencia en la documentación.

## Regeneración

Desde la copia del proyecto que ejecuta el configurador:

```bash
python3 scripts/import_marver_reference.py /ruta/a/plantillas/Archivo.zip
```

El importador usa exclusivamente la biblioteca estándar de Python. No ejecuta JavaScript del ZIP ni descarga recursos externos. Genera el catálogo estático y los recursos en `frontend/public/reference/marver`, y el mismo catálogo para la validación en `backend/src/main/resources/catalog/marver-reference.json`. Las imágenes se deduplican por contenido. Tras regenerar hay que reconstruir el frontend y reiniciar el backend.

## Verificación realizada

- Compilación y lint del frontend.
- Suite de backend con H2 y perfil de pruebas: 30 pruebas, sin fallos.
- Navegador: integridad de las 25 plantillas, IDs y opciones sin duplicados, campos condicionales y limpieza de valores ocultos, rango numérico, recorrido completo, documentación local, descarga PDF, recuperación local del borrador y retorno al catálogo nativo.
