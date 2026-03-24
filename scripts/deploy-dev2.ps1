param(
  [string]$ServerHost = "192.168.99.14",
  [string]$User = "root",
  [string]$RemotePath = "/opt/aluon",
  [string]$ComposeFile = "infra/docker-compose.dev2.yml",
  [string]$EnvFile = "infra/.env.dev2",
  [switch]$Pull
)

$ErrorActionPreference = "Stop"

$remote = "$User@$ServerHost"
$base = "cd $RemotePath"
$compose = "docker compose --env-file $EnvFile -f $ComposeFile"

Write-Host "Deploying to DEV2 ($remote)..." -ForegroundColor Cyan

if ($Pull) {
  Write-Host "Pulling latest changes..." -ForegroundColor Yellow
  ssh $remote "$base && git pull"
}

Write-Host "Building images..." -ForegroundColor Yellow
ssh $remote "$base && DOCKER_BUILDKIT=0 COMPOSE_DOCKER_CLI_BUILD=0 $compose build"

Write-Host "Recreating containers..." -ForegroundColor Yellow
ssh $remote "$base && $compose up -d --force-recreate"

Write-Host "Status:" -ForegroundColor Yellow
ssh $remote "$base && $compose ps"

Write-Host "Deploy complete." -ForegroundColor Green
