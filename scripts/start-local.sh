#!/bin/bash

# Terminar cualquier proceso existente en los puertos del backend (8080) y frontend (5173)
echo "Revisando puertos locales..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Obtener la ruta raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Cargar variables de entorno desde .env.local (si existe)
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  echo "📦 Cargando variables desde .env.local..."
  set -a
  source "$PROJECT_ROOT/.env.local"
  set +a
fi

# Configurar JAVA_HOME para usar OpenJDK 21 instalado mediante Homebrew
export JAVA_HOME="/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"

# Configurar orígenes CORS permitidos para desarrollo local
export APP_CORS_ALLOWED_ORIGINS="http://localhost:5173,https://app-aluon-unqc.vercel.app,https://aluondev.iconseriespeliculas.xyz"

echo "🚀 Iniciando Backend (Java 21 + Spring Boot)..."
cd "$PROJECT_ROOT/backend"
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
