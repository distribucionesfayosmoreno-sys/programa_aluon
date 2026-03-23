#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-192.168.99.14}"
USER="${DEPLOY_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/opt/aluon}"
COMPOSE_FILE="${COMPOSE_FILE:-infra/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-infra/.env.dev}"

PULL=0
if [[ "${1:-}" == "-Pull" || "${1:-}" == "--pull" ]]; then
  PULL=1
fi

REMOTE="${USER}@${SERVER_HOST}"
BASE="cd ${REMOTE_PATH}"
COMPOSE="docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE}"

echo "Deploying to DEV2 (${REMOTE})..."

if [[ $PULL -eq 1 ]]; then
  echo "Syncing to origin/DEV2 (hard reset)..."
  ssh "${REMOTE}" "${BASE} && git fetch --all && git reset --hard origin/DEV2"
fi

echo "Building images..."
ssh "${REMOTE}" "${BASE} && DOCKER_BUILDKIT=0 COMPOSE_DOCKER_CLI_BUILD=0 ${COMPOSE} build"

echo "Recreating containers..."
ssh "${REMOTE}" "${BASE} && ${COMPOSE} up -d --force-recreate"

echo "Status:"
ssh "${REMOTE}" "${BASE} && ${COMPOSE} ps"

echo "Deploy complete."
