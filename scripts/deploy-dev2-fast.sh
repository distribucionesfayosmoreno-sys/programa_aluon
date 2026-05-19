#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-192.168.99.14}"
USER="${DEPLOY_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/opt/aluon}"
COMPOSE_FILE="${COMPOSE_FILE:-infra/docker-compose.dev2.yml}"
ENV_FILE="${ENV_FILE:-infra/.env.dev2}"
COMPOSE_BUILD_FLAGS="${COMPOSE_BUILD_FLAGS:---parallel}"
COMPOSE_UP_FLAGS="${COMPOSE_UP_FLAGS:---remove-orphans}"

REMOTE="${USER}@${SERVER_HOST}"
REPO_URL="${REPO_URL:-$(git remote get-url origin)}"

BASE="cd ${REMOTE_PATH}"
COMPOSE="docker compose --env-file ${ENV_FILE} -f ${COMPOSE_FILE}"

echo "Fast deploy to DEV2 (${REMOTE})..."

echo "Ensuring remote repo exists at ${REMOTE_PATH}..."
ssh "${REMOTE}" "set -euo pipefail; \
  if echo '${REPO_URL}' | grep -Eq '^git@github\\.com:|^ssh://git@github\\.com/'; then \
    mkdir -p \"\$HOME/.ssh\"; \
    chmod 700 \"\$HOME/.ssh\"; \
    touch \"\$HOME/.ssh/known_hosts\"; \
    chmod 600 \"\$HOME/.ssh/known_hosts\"; \
    if ! ssh-keygen -F github.com >/dev/null 2>&1; then \
      echo 'Adding github.com to known_hosts...'; \
      ssh-keyscan -H github.com >> \"\$HOME/.ssh/known_hosts\" 2>/dev/null; \
    fi; \
  fi; \
  if [ -d '${REMOTE_PATH}/.git' ]; then \
    exit 0; \
  fi; \
  if [ -e '${REMOTE_PATH}' ] && [ ! -d '${REMOTE_PATH}' ]; then \
    echo 'ERROR: REMOTE_PATH exists but is not a directory: ${REMOTE_PATH}' >&2; \
    exit 1; \
  fi; \
  mkdir -p '${REMOTE_PATH}'; \
  if [ -z '${REPO_URL}' ]; then \
    echo 'ERROR: REPO_URL is empty (set REPO_URL=...)' >&2; \
    exit 1; \
  fi; \
  git clone '${REPO_URL}' '${REMOTE_PATH}'; \
  cd '${REMOTE_PATH}'; \
  git fetch --all; \
  git checkout -B DEV2 origin/DEV2"

echo "Syncing to origin/DEV2 (hard reset)..."
ssh "${REMOTE}" "${BASE} && git fetch --all && git reset --hard origin/DEV2"

echo "Injecting secrets into env file (if present)..."
ssh "${REMOTE}" "${BASE} && if [ -f infra/.env.dev2.secrets ]; then \
  grep -v '^SPRING_MAIL_' infra/.env.dev2 > /tmp/aluon_env && cat infra/.env.dev2.secrets >> /tmp/aluon_env && mv /tmp/aluon_env infra/.env.dev2; \
fi"

echo "Building images (cache, BuildKit)..."
ssh "${REMOTE}" "${BASE} && DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 ${COMPOSE} build ${COMPOSE_BUILD_FLAGS}"

echo "Recreating containers..."
ssh "${REMOTE}" "${BASE} && ${COMPOSE} up -d ${COMPOSE_UP_FLAGS}"

echo "Status:"
ssh "${REMOTE}" "${BASE} && ${COMPOSE} ps"

echo "Fast deploy complete."
