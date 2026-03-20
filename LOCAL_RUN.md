# Levantar frontend y backend en local

## Opción PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File .\run-local.ps1
```

## Opción CMD (doble click)
```cmd
run-local.cmd
```

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Troubleshooting rápido
- Puerto en uso (frontend 5173): cambia puerto con `npm run dev -- --port 5174`.
- Puerto en uso (backend 3000): exporta `SERVER_PORT=3001` antes de arrancar.
- Fallo Maven: ejecuta `mvnw.cmd -v` en `backend` y revisa Java 17+.
- Fallo npm: ejecuta `npm install` en `frontend`.
- CORS/Proxy: si el frontend no llega al backend, revisa la URL base de API.

Notas:
- Ejecuta desde la raíz del proyecto.
- Si no tienes dependencias instaladas, ejecuta primero `npm install` en `frontend`.
