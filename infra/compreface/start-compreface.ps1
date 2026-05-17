$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeDirectory = Join-Path $scriptDirectory "runtime"
$composeFile = Get-ChildItem -LiteralPath $runtimeDirectory -Recurse -Filter "docker-compose.yml" | Select-Object -First 1

if (-not $composeFile) {
    throw "CompreFace is not downloaded yet. Run .\infra\compreface\download-compreface.ps1 first."
}

docker compose -f $composeFile.FullName up -d
Write-Host "CompreFace is starting at http://localhost:8000"
