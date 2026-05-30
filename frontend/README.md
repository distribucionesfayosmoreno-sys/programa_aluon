# Frontend (Vite + React)

## Variables de entorno

- `VITE_API_TARGET`: destino del proxy `/api` en desarrollo (por defecto `http://localhost:8080`).
- `VITE_BASE_URL`: base pública de la app cuando se despliega bajo un subpath (por ejemplo `/dev/` o `/app/`). Si no se define, se usa `/`.

## Nota sobre imágenes en Presupuestos

El wizard de presupuestos carga imágenes desde `public/ideas/aluon/images/*` y `public/assets/*`.
En despliegues bajo subpath, asegúrate de configurar `VITE_BASE_URL` para que se resuelvan correctamente.

