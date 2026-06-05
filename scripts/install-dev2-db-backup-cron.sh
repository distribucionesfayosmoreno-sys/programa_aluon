#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_SCRIPT="${PROJECT_ROOT}/scripts/backup-dev2-db.sh"
CRON_COMMENT_BEGIN="# ALUON DEV2 DB BACKUP BEGIN"
CRON_COMMENT_END="# ALUON DEV2 DB BACKUP END"
DEFAULT_BACKUP_DIR="${ALUON_BACKUP_DIR:-$HOME/aluon-backups/dev2/postgres}"
DEFAULT_LOG_FILE="${ALUON_BACKUP_LOG_FILE:-$HOME/aluon-backups/dev2/logs/dev2-db-backup.log}"
DOCKER_BIN="${ALUON_DOCKER_BIN:-$(command -v docker || echo docker)}"
CRON_JOB="0 4 * * * ALUON_DOCKER_BIN=\"${DOCKER_BIN}\" ALUON_BACKUP_DIR=\"${DEFAULT_BACKUP_DIR}\" ALUON_BACKUP_RETENTION_DAYS=\"${ALUON_BACKUP_RETENTION_DAYS:-30}\" \"${BACKUP_SCRIPT}\" >> \"${DEFAULT_LOG_FILE}\" 2>&1"

if [ ! -x "$BACKUP_SCRIPT" ]; then
  chmod +x "$BACKUP_SCRIPT"
fi

mkdir -p "$DEFAULT_BACKUP_DIR" "$(dirname "$DEFAULT_LOG_FILE")"

current_crontab="$(crontab -l 2>/dev/null || true)"
filtered_crontab="$(printf '%s\n' "$current_crontab" | awk -v begin="$CRON_COMMENT_BEGIN" -v end="$CRON_COMMENT_END" '
  $0 == begin { skip=1; next }
  $0 == end { skip=0; next }
  skip != 1 { print }
')"

{
  printf '%s\n' "$filtered_crontab"
  printf '%s\n' "$CRON_COMMENT_BEGIN"
  printf '%s\n' "$CRON_JOB"
  printf '%s\n' "$CRON_COMMENT_END"
} | crontab -

echo "Cron instalado para ejecutar el backup a las 04:00 cada día."
