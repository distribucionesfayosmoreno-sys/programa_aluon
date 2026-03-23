$ErrorActionPreference = "Stop"

# Usage:
# $env:DB_NAME="aluonbbdd"
# $env:DB_USER="aluon"
# $env:DB_PASSWORD="aluon"
# $env:DB_PORT="3000"   # optional
# .\scripts\db-connect-dev.ps1

$dbHost = "192.168.99.14"
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "3000" }
$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "aluonbbdd" }
$dbUser = if ($env:DB_USER) { $env:DB_USER } else { "aluon" }
$dbPassword = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "aluon" }

if (-not $dbName) { throw "DB_NAME is required" }
if (-not $dbUser) { throw "DB_USER is required" }
if (-not $dbPassword) { throw "DB_PASSWORD is required" }

$env:PGPASSWORD = $dbPassword

$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCmd) {
  $fallback = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
  if (Test-Path $fallback) {
    $psqlCmd = @{ Source = $fallback }
  } else {
    throw "psql no está disponible en PATH y no se encontró en $fallback"
  }
}

Write-Host "Connecting to ${dbHost}:${dbPort}/${dbName} as ${dbUser}..."
& $psqlCmd.Source "host=$dbHost port=$dbPort dbname=$dbName user=$dbUser sslmode=disable"
