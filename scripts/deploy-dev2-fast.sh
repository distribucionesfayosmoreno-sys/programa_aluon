#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-192.168.99.14}"
USER="${DEPLOY_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/opt/aluon}"
COMPOSE_FILE="${COMPOSE_FILE:-infra/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-infra/.env.dev}"

REMOTE="${USER}@${SERVER_HOST}"
BASE="cd ${REMOTE_PATH}"
COMPOSE="docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE}"

echo "Fast deploy to DEV2 (${REMOTE})..."

echo "Syncing to origin/DEV2 (hard reset)..."
ssh "${REMOTE}" "${BASE} && git fetch --all && git reset --hard origin/DEV2"

echo "Building images (cache)..."
ssh "${REMOTE}" "${BASE} && DOCKER_BUILDKIT=0 COMPOSE_DOCKER_CLI_BUILD=0 ${COMPOSE} build"

echo "Recreating containers..."
ssh "${REMOTE}" "${BASE} && ${COMPOSE} up -d --force-recreate"

echo "Status:"
ssh "${REMOTE}" "${BASE} && ${COMPOSE} ps"

echo "Fast deploy complete."
