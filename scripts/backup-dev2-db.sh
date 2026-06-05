#!/usr/bin/env bash
set -euo pipefail

DOCKER_BIN="${ALUON_DOCKER_BIN:-docker}"
DB_CONTAINER="${ALUON_DB_CONTAINER:-aluon-saas-postgres-dev2}"
DB_NAME="${ALUON_DB_NAME:-aluonbbdd}"
DB_USER="${ALUON_DB_USER:-aluon}"
BACKUP_DIR="${ALUON_BACKUP_DIR:-$HOME/aluon-backups/dev2/postgres}"
RETENTION_DAYS="${ALUON_BACKUP_RETENTION_DAYS:-30}"

timestamp="$(date -u +%Y-%m-%d_%H-%M-%S)"
backup_file="${BACKUP_DIR}/${DB_NAME}_${timestamp}.sql.gz"

if ! command -v "$DOCKER_BIN" >/dev/null 2>&1; then
  echo "docker no está disponible: ${DOCKER_BIN}" >&2
  exit 1
fi

if ! "$DOCKER_BIN" inspect -f '{{.State.Running}}' "$DB_CONTAINER" >/dev/null 2>&1; then
  echo "El contenedor PostgreSQL no está en ejecución: ${DB_CONTAINER}" >&2
  exit 1
fi

db_password="$("$DOCKER_BIN" exec "$DB_CONTAINER" sh -lc 'printf %s "$POSTGRES_PASSWORD"')"
if [ -z "$db_password" ]; then
  echo "No se pudo leer POSTGRES_PASSWORD desde ${DB_CONTAINER}" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "Generando backup de ${DB_NAME} en ${backup_file}"
"$DOCKER_BIN" exec -e PGPASSWORD="$db_password" "$DB_CONTAINER" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" \
  | gzip > "$backup_file"

chmod 600 "$backup_file"

find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete

echo "Backup completado: ${backup_file}"
