Param(
  [string]$BackendImage = "r0dr1g0m0r3n0/aluon-backend:preprod",
  [string]$FrontendImage = "r0dr1g0m0r3n0/aluon-frontend:preprod"
)

$ErrorActionPreference = "Stop"

function Require-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $name"
  }
}

Require-Command docker

Write-Host "Building images for PREPROD..."
docker build -t $BackendImage .\backend
if ($LASTEXITCODE -ne 0) { throw "Backend build failed." }

docker build -t $FrontendImage .\frontend
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed." }

Write-Host "Pushing images..."
docker push $BackendImage
if ($LASTEXITCODE -ne 0) { throw "Backend push failed." }

docker push $FrontendImage
if ($LASTEXITCODE -ne 0) { throw "Frontend push failed." }

Write-Host "Done. Images tagged as :preprod"
