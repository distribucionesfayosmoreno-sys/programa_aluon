#!/bin/bash
# ============================================================
# deploy-preprod.sh
# Despliega PREPROD en el servidor remoto vía SSH.
#
# Flujo:
#   1. Copia el docker-compose y el .env al servidor vía scp
#   2. Conecta por SSH y lanza "docker compose up -d --pull always"
#      (NO hace git clone — usa las imágenes ya subidas a Docker Hub)
#
# Prerrequisito: haber ejecutado push-preprod.sh antes.
#
# Uso: ./scripts/deploy-preprod.sh [remote_host] [remote_user]
# Ejemplo: ./scripts/deploy-preprod.sh 192.168.99.14 root
# ============================================================
set -euo pipefail

REMOTE_HOST="${1:-192.168.99.14}"
REMOTE_USER="${2:-root}"
APP_DIR="/opt/aluon-preprod"
ENV_NAME="preprod"
DB_NAME="aluonbbddpreprod"
DB_USER="aluon"
DB_PASSWORD="aluon"
DB_PORT="3000"
BACKEND_PORT="8081"
FRONTEND_PORT="5174"

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${PROJECT_ROOT}/infra/portainer-preprod.yml"
ENV_FILE="${PROJECT_ROOT}/infra/.env.pre"

echo "🚀 Desplegando PREPROD en $REMOTE"
echo "   Frontend:  http://${REMOTE_HOST}:${FRONTEND_PORT}"
echo "   Backend:   http://${REMOTE_HOST}:${BACKEND_PORT}"
echo "   DB:        ${REMOTE_HOST}:${DB_PORT}/${DB_NAME}"
echo ""

# ── Paso 1: asegurarse de que el directorio existe en el servidor ──
ssh "${REMOTE}" "mkdir -p ${APP_DIR}"

# ── Paso 2: copiar el compose y el env al servidor ────────────────
echo "📤 Copiando archivos de configuración al servidor..."
scp "${COMPOSE_FILE}" "${REMOTE}:${APP_DIR}/docker-compose.yml"
scp "${ENV_FILE}"     "${REMOTE}:${APP_DIR}/.env"

# ── Paso 3: lanzar los contenedores (pull de Docker Hub) ─────────
echo "🐳 Levantando contenedores en el servidor..."
ssh "${REMOTE}" bash <<DEPLOY
set -e
cd "${APP_DIR}"

# Crear volumen si no existe (primera vez)
docker volume create aluon-pgdata-preprod 2>/dev/null || true

ENV_NAME="${ENV_NAME}" \
DB_NAME="${DB_NAME}" \
DB_USER="${DB_USER}" \
DB_PASSWORD="${DB_PASSWORD}" \
DB_PORT="${DB_PORT}" \
BACKEND_PORT="${BACKEND_PORT}" \
FRONTEND_PORT="${FRONTEND_PORT}" \
docker compose --env-file .env -f docker-compose.yml up -d --pull always

echo "✅ PREPROD desplegado en http://${REMOTE_HOST}:${FRONTEND_PORT}"
DEPLOY
