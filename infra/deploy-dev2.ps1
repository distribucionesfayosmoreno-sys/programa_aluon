Param(
  [string]$RemoteHost = "192.168.99.14",
  [string]$RemoteUser = "root",
  [string]$AppDir = "/opt/aluon",
  [string]$EnvName = "dev2",
  [string]$DbName = "aluonbbdd",
  [string]$DbUser = "aluon",
  [string]$DbPassword = "aluon",
  [string]$DbPort = "3000",
  [string]$BackendPort = "8080",
  [string]$FrontendPort = "5173",
  [string]$Branch = "",
  [string]$ComposePath = ""
)

$ErrorActionPreference = "Stop"

function Require-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $name"
  }
}

Require-Command git
Require-Command ssh

if ([string]::IsNullOrWhiteSpace($Branch)) {
  $Branch = (git branch --show-current).Trim()
  if ([string]::IsNullOrWhiteSpace($Branch)) {
    $Branch = "main"
  }
}

$RepoUrl = (git remote get-url upstream).Trim()
if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
  throw "Could not resolve git remote 'upstream'."
}

$Remote = "$RemoteUser@$RemoteHost"

Write-Host "Deploying branch '$Branch' to $Remote ($EnvName)"

$remoteBootstrap = @"
set -e
if [ ! -d "$AppDir/.git" ]; then
  mkdir -p "$AppDir"
  git clone "$RepoUrl" "$AppDir"
fi
cd "$AppDir"
git fetch --all
if git show-ref --verify --quiet "refs/heads/$Branch"; then
  git checkout "$Branch"
else
  git checkout -b "$Branch" "origin/$Branch"
fi
git pull --ff-only origin "$Branch"
"@

$remoteDeploy = @"
set -e
cd "$AppDir"
if [ -z "$ComposePath" ]; then
  if [ -f "infra/docker-compose.yml" ]; then
    COMPOSE_FILE="infra/docker-compose.yml"
  elif [ -f "docker-compose.yml" ]; then
    COMPOSE_FILE="docker-compose.yml"
  else
    echo "Compose file not found in $AppDir"
    exit 1
  fi
else
  COMPOSE_FILE="$ComposePath"
fi

ENV_NAME="$EnvName" \
DB_NAME="$DbName" \
DB_USER="$DbUser" \
DB_PASSWORD="$DbPassword" \
DB_PORT="$DbPort" \
BACKEND_PORT="$BackendPort" \
FRONTEND_PORT="$FrontendPort" \
docker compose -f "$COMPOSE_FILE" up -d --build
"@

Write-Host "Connecting to $Remote (you may be prompted for the SSH password)..."
ssh $Remote $remoteBootstrap
ssh $Remote $remoteDeploy

Write-Host "Done."
