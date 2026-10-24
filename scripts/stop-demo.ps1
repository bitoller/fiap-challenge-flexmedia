$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $ProjectRoot

Write-Host "Stopping FlexCheck..." -ForegroundColor Cyan
& docker compose down

if ($LASTEXITCODE -ne 0) {
    Write-Host "FlexCheck could not be stopped cleanly. Check that Docker Desktop is running." -ForegroundColor Red
    exit 1
}

Write-Host "FlexCheck stopped. Database volumes were preserved." -ForegroundColor Green

