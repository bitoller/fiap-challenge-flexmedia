$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeDirectory = Join-Path $scriptDirectory "runtime"
$composeFile = Get-ChildItem -LiteralPath $runtimeDirectory -Recurse -Filter "docker-compose.yml" | Select-Object -First 1

if (-not $composeFile) {
    throw "CompreFace is not downloaded yet. Nothing to stop."
}

docker compose -f $composeFile.FullName down
Write-Host "CompreFace stopped."
