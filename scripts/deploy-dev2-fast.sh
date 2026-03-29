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
ssh "${REMOTE}" "${BASE} && PREV_SHA=\$(git rev-parse HEAD) && git fetch --all && git reset --hard origin/DEV2 && echo \$PREV_SHA > /tmp/aluon_prev_sha"

echo "Detecting changes to decide what to build..."
ssh "${REMOTE}" "${BASE} && PREV_SHA=\$(cat /tmp/aluon_prev_sha || true) && CURR_SHA=\$(git rev-parse HEAD) && \
  if [ -z \"\$PREV_SHA\" ] || [ \"\$PREV_SHA\" = \"\$CURR_SHA\" ]; then \
    echo \"No git changes detected.\"; \
    echo \"\" > /tmp/aluon_changed_files; \
  else \
    git diff --name-only \"\$PREV_SHA\"..\"\$CURR_SHA\" > /tmp/aluon_changed_files; \
  fi"

echo "Selecting services to build..."
ssh "${REMOTE}" "${BASE} && \
  CHANGED=\$(cat /tmp/aluon_changed_files || true); \
  BUILD_SERVICES=(); \
  if echo \"\$CHANGED\" | rg -q \"^backend/|^infra/docker-compose\\.yml$|^backend/Dockerfile\"; then BUILD_SERVICES+=(backend); fi; \
  if echo \"\$CHANGED\" | rg -q \"^frontend/|^infra/docker-compose\\.yml$|^frontend/Dockerfile\"; then BUILD_SERVICES+=(frontend); fi; \
  echo \"\${BUILD_SERVICES[@]}\" > /tmp/aluon_build_services; \
  echo \"Will build: \${BUILD_SERVICES[*]:-none}\""

echo "Building images (cache, BuildKit)..."
ssh "${REMOTE}" "${BASE} && BUILD_SERVICES=\$(cat /tmp/aluon_build_services || true) && \
  if [ -n \"\$BUILD_SERVICES\" ]; then \
    DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 ${COMPOSE} build ${COMPOSE_BUILD_FLAGS} \$BUILD_SERVICES; \
  else \
    echo \"Skipping build (no relevant changes).\"; \
  fi"

echo "Recreating containers..."
ssh "${REMOTE}" "${BASE} && ${COMPOSE} up -d ${COMPOSE_UP_FLAGS}"

echo "Status:"
ssh "${REMOTE}" "${BASE} && ${COMPOSE} ps"

echo "Fast deploy complete."
