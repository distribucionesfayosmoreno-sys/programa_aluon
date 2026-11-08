# ALUON permanente en Docker

La copia con Configurador es `/home/devadmin/PROGRAMA-ALUON-WEB`.
El proyecto Compose es `aluon-local`, visible en el Docker local conectado a
Portainer en `https://192.168.99.61:9443`.

- Aplicación: `http://192.168.99.61:5174`.
- Dominio: `https://desarrollowebaluon.iconseriespeliculas.xyz`.
- Imágenes de aplicación: `aluon-backend:local` y `aluon-frontend:local`.
- Configuración: `infra/docker-compose.permanent.yml`.
- Contraseña de PostgreSQL: archivo privado
  `/home/devadmin/.local/share/aluon-runtime/docker-permanent.env`, fuera de Git.
- Datos: volumen `aluon-permanent-pgdata`.
- Imágenes de simulaciones: volumen `aluon-permanent-assets`.

Los contenedores usan `restart: unless-stopped` y Docker tiene el arranque
habilitado en este equipo. La disponibilidad requiere que la máquina esté
encendida y conectada. El router en 5173 envía el dominio de ALUON al frontend;
los otros hosts conservan la ruta anterior hacia Fayos en el puerto 5175.

## Actualizar desde esta copia

```bash
cd /home/devadmin/PROGRAMA-ALUON-WEB
sg docker -c './scripts/deploy-local-docker.sh'
```

El script construye las imágenes y recrea los servicios sin borrar los volúmenes.
Portainer muestra también los proyectos Compose creados desde terminal; la
configuración de este proyecto se mantiene en este archivo Compose y el script.
Las imágenes están guardadas en el Docker de esta máquina; no se publican en
Docker Hub.

La copia inicial de la base local se guarda en
`/home/devadmin/.local/share/aluon-runtime/backups/` antes de restaurarla en el
volumen Docker. La base original en `127.0.0.1:3000` se conserva. Después del
traslado, la aplicación usa la copia Docker y los cambios nuevos quedan en su
volumen.

## Validación del traslado del 8 de noviembre de 2026

Se restauraron las 40 tablas de la base local y se comprobaron los recuentos de
filas antes de arrancar el backend. El respaldo inicial es
`/home/devadmin/.local/share/aluon-runtime/backups/aluon-before-docker-20261108T105412Z.dump`.
El frontend y backend se compilaron correctamente; la API de clientes, estados
de órdenes y configuraciones respondió HTTP 200 en los contenedores.
