#!/bin/bash
# ============================================================
# push-dev2.sh
# Construye y sube las imágenes Docker de DEV2 a Docker Hub.
# Uso: ./scripts/push-dev2.sh [backend_image] [frontend_image]
# ============================================================
set -euo pipefail

BACKEND_IMAGE="${1:-r0dr1g0m0r3n0/aluon-backend:dev2}"
FRONTEND_IMAGE="${2:-r0dr1g0m0r3n0/aluon-frontend:dev2}"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📦 Construyendo imagen Backend → $BACKEND_IMAGE"
docker build -t "$BACKEND_IMAGE" "$PROJECT_ROOT/backend"

echo "📦 Construyendo imagen Frontend → $FRONTEND_IMAGE"
docker build -t "$FRONTEND_IMAGE" "$PROJECT_ROOT/frontend"

echo "🚀 Subiendo imágenes a Docker Hub..."
docker push "$BACKEND_IMAGE"
docker push "$FRONTEND_IMAGE"

echo "✅ Listo. Imágenes DEV2 subidas."
