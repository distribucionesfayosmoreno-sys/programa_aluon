#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ALUON_DOCKER_ENV_FILE:-/home/devadmin/.local/share/aluon-runtime/docker-permanent.env}"
if [[ -f "$PROJECT_ROOT/.env.local" ]]; then
  set -a
  # Keep local integration keys out of the repository while making them
  # available to the persistent compose stack.
  source "$PROJECT_ROOT/.env.local"
  set +a
fi
if ! docker info >/dev/null 2>&1; then
  echo "Sin acceso a Docker. Prueba: sg docker -c '$0'" >&2
  exit 1
fi
compose=(docker compose --env-file "$ENV_FILE" -f "$PROJECT_ROOT/infra/docker-compose.permanent.yml")
"${compose[@]}" config --quiet
"${compose[@]}" build
"${compose[@]}" up -d --wait --wait-timeout 240
"${compose[@]}" ps
