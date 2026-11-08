# Tercera opción: Marver · Recorrido del vídeo

Disponible dentro de **Configurador**, junto a **Catálogo ALUON** y
**Plantillas Marver del ZIP**. La referencia visual es la grabación
`Grabación 2026-10-28 135242.mp4`, de 1 h 00 min 12 s, recibida en este servidor.
El vídeo no se copia a los recursos públicos ni a las imágenes Docker.

## Recorrido reproducido

- Familias agrupadas y tarjetas gráficas, como en 01:30 de la grabación.
- Formulario continuo en una tarjeta blanca; galería de modelos y colores de
  cinco columnas en escritorio, selecciones verdes, campos y medidas en el orden
  del formulario original. Véanse 11:00, 16:00 y 30:00.
- Esquemas de apertura con imágenes ampliables, observados en 12:30 y 32:30.
- Ventana «Detalle del pedido» con modelo, acabado, esquema y respuestas; acciones
  «Guardar Formulario» y «Editar formulario», como en 15:00 y 55:00.
- Pantalla «¿Qué desea hacer?»: resumen de líneas, edición, eliminación,
  «Añadir otra puerta», detalle y finalización; referencia en 08:30.
- PDF de referencia con las respuestas de todas las líneas, cliente, referencia
  y observaciones. Se conserva la marca ALUON y el acceso al CRM.

Se reutilizan las 25 plantillas, modelos, gráficos y condiciones del catálogo
Marver importado. Las opciones adicionales cuya aplicabilidad no se observó
permanecen identificadas al final del formulario. El diseño se adapta a móvil.
No se reproduce la navegación de correo, vídeos externos o contenidos ajenos al
configurador que aparecen en la grabación.

## Persistencia

El borrador de esta vista es independiente del borrador de las otras dos opciones.
Se conserva localmente en `aluon-marver-video-draft`, incluso mientras se edita
una línea. Los borradores guardados en el servidor se recuperan desde esta vista;
el guardado utiliza la sesión de personal y los permisos existentes.

El producto persistido es `REFERENCIA_MARVER`, con `presentation: MARVER_VIDEO`.
`videoForms` contiene las fichas de todas las líneas, con un máximo de 50. El
servidor valida cada ficha y reconstruye sus etiquetas; la primera ficha se
conserva también en `referenceSpecification` para compatibilidad. El documento
versionado y la auditoría conservan el presupuesto completo. Los adjuntos se
almacenan una sola vez en `generatedDocuments` y se restauran por formulario y
campo; el máximo conjunto es 8 MB. No se requiere migración de base de datos.

«Finalizar presupuesto» envía a `PENDING_REVIEW`; no confirma fabricación ni
calcula precios Marver como si fueran una tarifa ALUON. El servidor mantiene
esta restricción para todas las líneas y también en los cambios administrativos.

## Verificación

- Compilación TypeScript/Vite y lint de los componentes modificados.
- 34 pruebas del backend, incluidas validación de líneas secundarias,
  estados, identificadores y conservación de fichas, adjuntos y auditoría.
- Navegador: tres opciones, 25 tarjetas de plantilla, selección de modelo y
  color, ampliación de esquema, medida de 980 mm, adjunto, detalle, dos líneas,
  edición conservando orden, recuperación tras recarga y descarga de PDF.
- Adaptación móvil y conservación de las dos vistas anteriores.
