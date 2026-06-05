#!/usr/bin/env bash
set -euo pipefail

DOCKER_BIN="${ALUON_DOCKER_BIN:-docker}"
DB_CONTAINER="${ALUON_DB_CONTAINER:-aluon-saas-postgres-dev2}"
DB_NAME="${ALUON_DB_NAME:-aluonbbdd}"
DB_USER="${ALUON_DB_USER:-aluon}"
BACKUP_DIR="${ALUON_BACKUP_DIR:-$HOME/aluon-backups/dev2/postgres}"

usage() {
  cat <<'EOF'
Uso:
  scripts/restore-dev2-db.sh [--yes] [archivo-backup.sql.gz]

Si no se indica archivo, se usa el backup más reciente de la carpeta por defecto.
EOF
}

confirm_restore() {
  if [ "${1:-}" = "--yes" ]; then
    return 0
  fi

  printf 'Este proceso va a BORRAR el contenido de %s y restaurarlo desde el backup.\n' "$DB_NAME"
  read -r -p 'Escribe RESTAURAR para continuar: ' answer
  [ "$answer" = "RESTAURAR" ]
}

resolve_backup_file() {
  if [ "${1:-}" != "" ] && [ "${1:-}" != "--yes" ]; then
    printf '%s\n' "$1"
    return 0
  fi

  find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz" -print | sort | tail -n 1
}

if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  usage
  exit 0
fi

force_flag=""
backup_arg=""
for arg in "${@:-}"; do
  case "$arg" in
    --yes) force_flag="--yes" ;;
    *) backup_arg="$arg" ;;
  esac
done

backup_file="$(resolve_backup_file "$backup_arg")"
if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
  echo "No se encontró ningún backup válido." >&2
  exit 1
fi

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

if ! confirm_restore "$force_flag"; then
  echo "Restauración cancelada."
  exit 0
fi

echo "Preparando restauración de ${DB_NAME} desde ${backup_file}"
"$DOCKER_BIN" exec -e PGPASSWORD="$db_password" "$DB_CONTAINER" \
  psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

gunzip -c "$backup_file" | "$DOCKER_BIN" exec -i -e PGPASSWORD="$db_password" "$DB_CONTAINER" \
  psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1

echo "Restauración completada desde: ${backup_file}"
