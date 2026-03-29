#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-192.168.99.14}"
USER="${DEPLOY_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/opt/aluon}"
COMPOSE_FILE="${COMPOSE_FILE:-infra/docker-compose.yml}"
ENV_FILE="${ENV_FILE:-infra/.env.dev}"
COMPOSE_BUILD_FLAGS="${COMPOSE_BUILD_FLAGS:---parallel}"
COMPOSE_UP_FLAGS="${COMPOSE_UP_FLAGS:---remove-orphans}"

REMOTE="${USER}@${SERVER_HOST}"
BASE="cd ${REMOTE_PATH}"
COMPOSE="docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE}"

echo "Fast deploy to DEV2 (${REMOTE})..."

echo "Syncing to origin/DEV2 (hard reset)..."
ssh "${REMOTE}" "${BASE} && git fetch --all && git reset --hard origin/DEV2 && \
  if [ -f infra/.env.dev.secrets ]; then \
    grep -v '^SPRING_MAIL_' infra/.env.dev > /tmp/aluon_env && cat infra/.env.dev.secrets >> /tmp/aluon_env && mv /tmp/aluon_env infra/.env.dev; \
  fi"

echo "Building images (cache, BuildKit)..."
ssh "${REMOTE}" "${BASE} && DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 ${COMPOSE} build ${COMPOSE_BUILD_FLAGS}"

echo "Recreating containers..."
ssh "${REMOTE}" "${BASE} && ${COMPOSE} up -d ${COMPOSE_UP_FLAGS}"

echo "Status:"
ssh "${REMOTE}" "${BASE} && ${COMPOSE} ps"

echo "Fast deploy complete."
