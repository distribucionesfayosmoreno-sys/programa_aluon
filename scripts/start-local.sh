#!/bin/bash

# Terminar cualquier proceso existente en los puertos del backend (8080) y frontend (5173)
echo "Revisando puertos locales..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Obtener la ruta raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTIVE_PROFILE="${SPRING_PROFILES_ACTIVE:-local}"
DB_PORT="${DB_PORT:-3000}"
COMPOSE_FILE="$PROJECT_ROOT/infra/docker-compose.yml"
COMPOSE_ENV_ARGS=()
DEV2_VOLUME_NAME="aluon-pgdata-dev2"

if [ "$ACTIVE_PROFILE" = "dev2" ]; then
  COMPOSE_FILE="$PROJECT_ROOT/infra/docker-compose.dev2.yml"
fi

# Cargar variables de entorno desde .env.local (si existe)
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  echo "📦 Cargando variables desde .env.local..."
  set -a
  source "$PROJECT_ROOT/.env.local"
  set +a
  COMPOSE_ENV_ARGS=(--env-file "$PROJECT_ROOT/.env.local")
fi

# Configurar JAVA_HOME para usar OpenJDK 21 instalado mediante Homebrew
export JAVA_HOME="/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"

# Configurar orígenes CORS permitidos para desarrollo local
export APP_CORS_ALLOWED_ORIGINS="http://localhost:5173,https://app-aluon-unqc.vercel.app,https://aluondev.iconseriespeliculas.xyz"

echo "🐘 Levantando PostgreSQL local (${ACTIVE_PROFILE})..."
if [ "$ACTIVE_PROFILE" = "dev2" ]; then
  docker volume inspect "$DEV2_VOLUME_NAME" >/dev/null 2>&1 || docker volume create "$DEV2_VOLUME_NAME" >/dev/null
fi

docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$COMPOSE_FILE" up -d postgres

echo "⏳ Esperando a que PostgreSQL responda en el puerto ${DB_PORT}..."
for attempt in {1..30}; do
  if nc -z localhost "$DB_PORT" >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! nc -z localhost "$DB_PORT" >/dev/null 2>&1; then
  echo "❌ PostgreSQL no responde en localhost:${DB_PORT}"
  exit 1
fi

echo "🗄️  Aplicando migraciones SQL en la BBDD local..."
cd "$PROJECT_ROOT/backend"
./mvnw -q -DskipTests \
  -Dflyway.url="${SPRING_DATASOURCE_URL:-jdbc:postgresql://localhost:3000/${DB_NAME:-aluonbbdd}}" \
  -Dflyway.user="${SPRING_DATASOURCE_USERNAME:-${DB_USER:-aluon}}" \
  -Dflyway.password="${SPRING_DATASOURCE_PASSWORD:-${DB_PASSWORD:-aluon}}" \
  flyway:repair flyway:migrate

echo "🚀 Iniciando Backend (Java 21 + Spring Boot)..."
./mvnw spring-boot:run &
BACKEND_PID=$!

echo "🚀 Iniciando Frontend (Vite + React)..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

# Detener los procesos al salir (Ctrl+C)
trap "echo -e '\nStopping local environment...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM EXIT

echo "--------------------------------------------------------"
echo "Backend corriendo en segundo plano (PID: $BACKEND_PID)"
echo "Frontend corriendo en segundo plano (PID: $FRONTEND_PID) -> http://localhost:5173"
echo "Presiona Ctrl+C para detener ambos."
echo "--------------------------------------------------------"

# Esperar a que los subprocesos terminen
wait
