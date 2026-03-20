$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontend = Join-Path $root 'frontend'
$backend = Join-Path $root 'backend'

Write-Host "Starting backend (Spring Boot)" -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "set SERVER_PORT=3000 && mvnw.cmd spring-boot:run" -WorkingDirectory $backend

Write-Host "Starting frontend (Vite)" -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory $frontend

Write-Host "Frontend and backend launched." -ForegroundColor Green
Write-Host "Backend: http://localhost:8080 (default)" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
