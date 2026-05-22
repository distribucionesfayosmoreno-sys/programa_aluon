#!/bin/bash
# ============================================================
# deploy-dev2.sh
# Despliega la rama DEV2 en el servidor remoto vía SSH.
# El servidor clona/actualiza el repo y levanta los contenedores.
#
# Uso: ./scripts/deploy-dev2.sh [remote_host] [remote_user]
# Ejemplo: ./scripts/deploy-dev2.sh 192.168.99.14 root
# ============================================================
set -euo pipefail

REMOTE_HOST="${1:-192.168.99.14}"
REMOTE_USER="${2:-root}"
APP_DIR="/opt/aluon"
ENV_NAME="dev2"
DB_NAME="aluonbbdd"
DB_USER="aluon"
DB_PASSWORD="aluon"
DB_PORT="3000"
BACKEND_PORT="8080"
FRONTEND_PORT="5173"
BRANCH="DEV2"

REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Obtener URL del repositorio remoto
REPO_URL=$(git -C "$PROJECT_ROOT" remote get-url origin 2>/dev/null || echo "")
if [ -z "$REPO_URL" ]; then
  echo "❌ No se pudo obtener la URL del repositorio remoto." >&2
  exit 1
fi

echo "🚀 Desplegando rama '$BRANCH' en $REMOTE ($ENV_NAME)"
echo "   Repositorio: $REPO_URL"
echo "   Frontend:    http://${REMOTE_HOST}:${FRONTEND_PORT}"
echo "   Backend:     http://${REMOTE_HOST}:${BACKEND_PORT}"
echo "   DB:          ${REMOTE_HOST}:${DB_PORT}/${DB_NAME}"
echo ""

# ── Paso 1: clonar o actualizar el repo en el servidor ──────
ssh "${REMOTE}" bash <<BOOTSTRAP
set -e
if [ ! -d "${APP_DIR}/.git" ]; then
  echo "📥 Clonando repositorio en ${APP_DIR}..."
  mkdir -p "${APP_DIR}"
  git clone "${REPO_URL}" "${APP_DIR}"
fi
cd "${APP_DIR}"
git remote set-url origin "${REPO_URL}"
git fetch --all
if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
  git checkout "${BRANCH}"
else
  git checkout -b "${BRANCH}" "origin/${BRANCH}"
fi
git pull --ff-only origin "${BRANCH}"
echo "✅ Repositorio actualizado a rama ${BRANCH}"
BOOTSTRAP

# ── Paso 2: levantar los contenedores ───────────────────────
ssh "${REMOTE}" bash <<DEPLOY
set -e
cd "${APP_DIR}"

COMPOSE_FILE=""
if [ -f "infra/docker-compose.${ENV_NAME}.yml" ]; then
  COMPOSE_FILE="infra/docker-compose.${ENV_NAME}.yml"
elif [ -f "infra/docker-compose.yml" ]; then
  COMPOSE_FILE="infra/docker-compose.yml"
else
  echo "❌ No se encontró un docker-compose válido en ${APP_DIR}" >&2
  exit 1
fi

ENV_FILE_OPT=""
if [ -f "infra/.env.${ENV_NAME}" ]; then
  ENV_FILE_OPT="--env-file infra/.env.${ENV_NAME}"
fi

echo "🐳 Levantando contenedores con \$COMPOSE_FILE..."
ENV_NAME="${ENV_NAME}" \
DB_NAME="${DB_NAME}" \
DB_USER="${DB_USER}" \
DB_PASSWORD="${DB_PASSWORD}" \
DB_PORT="${DB_PORT}" \
BACKEND_PORT="${BACKEND_PORT}" \
FRONTEND_PORT="${FRONTEND_PORT}" \
docker compose \$ENV_FILE_OPT -f "\$COMPOSE_FILE" up -d --build
echo "✅ DEV2 desplegado en http://${REMOTE_HOST}:${FRONTEND_PORT}"
DEPLOY
