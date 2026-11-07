# Programa ALUON

El repositorio de referencia es https://github.com/R0dr1g0M0r3n0/PROGRAMA-ALUON.
La versión recuperada parte de su rama `local`, commit `8a98cfc` del 17 de octubre de 2026.
Incluye **Configurador** en el sidebar, además de **Presupuestos**, con cinco tipos
de producto y croquis de apertura interior y exterior.

## Recuperación del entorno local — 7 de noviembre de 2026

El respaldo de esta recuperación está en la rama
`respaldo/configurador-2026-11-07` de
https://github.com/distribucionesfayosmoreno-sys/programa_aluon.
Contiene el código recuperado del repositorio personal, las correcciones de carga
de fuentes y CORS, el frontend compilado y los recursos gráficos originales del Mac.
Las ramas antiguas `LOCAL` y `DEV2` de Distribuciones no incluyen el configurador de octubre.

En esta copia, `origin` apunta al repositorio personal y `distribuciones` al repositorio
que contiene el respaldo. La rama de trabajo local es `local-octubre`.

Servicios locales: frontend en el puerto 5173, backend en 8080 y PostgreSQL en 3000.
La base de datos local contiene datos de demostración; sus datos y las herramientas
instaladas en el equipo no forman parte de este respaldo de Git.

Validación de esta recuperación: `npm run build`, `npm run lint`, 25 pruebas del backend
con `./mvnw -B test` y comprobaciones de los cinco productos y croquis en navegador.

Consulta [la documentación de despliegue](docs/deployment.md) para los entornos desplegados.
