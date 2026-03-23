# Arranque Local (Windows)

## Requisitos
- Java 17+
- Node.js 18+
- PostgreSQL (psql opcional)

## 1) Backend (Spring Boot)
### Usando BBDD DEV2 (PostgreSQL remoto)
Configura estas variables antes de arrancar:
```powershell
$env:SPRING_PROFILES_ACTIVE="dev2"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.99.14:3000/aluonbbdd"
$env:SPRING_DATASOURCE_USERNAME="aluon"
$env:SPRING_DATASOURCE_PASSWORD="aluon"
```

Arranque:
```powershell
cd backend
$env:SERVER_PORT=3000
.\mvnw.cmd spring-boot:run
```

## 2) Frontend (Vite)
```powershell
cd frontend
npm install
npm run dev
```

## URLs
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Conexión a BBDD dev (opcional)
```powershell
.\scripts\db-connect-dev.ps1
```
