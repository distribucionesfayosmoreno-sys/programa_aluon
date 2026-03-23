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

## Subir cambios a DEV2
1) En tu repo local, asegúrate de tener los cambios en el remoto (push).
2) En el servidor DEV2, sincroniza y reconstruye:
```powershell
ssh root@192.168.99.14 "cd /opt/aluon && git fetch --all && git reset --hard origin/DEV2"
ssh root@192.168.99.14 "cd /opt/aluon/infra && DOCKER_BUILDKIT=0 COMPOSE_DOCKER_CLI_BUILD=0 docker compose --env-file .env.dev -f docker-compose.yml build"
ssh root@192.168.99.14 "cd /opt/aluon/infra && docker compose --env-file .env.dev -f docker-compose.yml up -d"
```

### Script para Git Bash
```bash
cd /c/proyectos/PROGRAMA-ALUON
bash ./scripts/deploy-dev2.sh -Pull
```
