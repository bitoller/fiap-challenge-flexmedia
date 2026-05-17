$ErrorActionPreference = "Stop"

$version = "1.2.0"
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeDirectory = Join-Path $scriptDirectory "runtime"
$zipPath = Join-Path $scriptDirectory "CompreFace_$version.zip"
$downloadUrl = "https://github.com/exadel-inc/CompreFace/releases/download/v$version/CompreFace_$version.zip"

if (-not (Test-Path -LiteralPath $runtimeDirectory)) {
    New-Item -ItemType Directory -Path $runtimeDirectory | Out-Null
}

Write-Host "Downloading CompreFace $version..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

Write-Host "Extracting CompreFace..."
Expand-Archive -LiteralPath $zipPath -DestinationPath $runtimeDirectory -Force

$resolvedScriptDirectory = (Resolve-Path -LiteralPath $scriptDirectory).Path
$resolvedZipPath = (Resolve-Path -LiteralPath $zipPath).Path
if ($resolvedZipPath.StartsWith($resolvedScriptDirectory, [System.StringComparison]::OrdinalIgnoreCase)) {
    Remove-Item -LiteralPath $resolvedZipPath -Force
}

$composeFile = Get-ChildItem -LiteralPath $runtimeDirectory -Recurse -Filter "docker-compose.yml" | Select-Object -First 1
if (-not $composeFile) {
    throw "CompreFace was downloaded, but no docker-compose.yml file was found in $runtimeDirectory."
}

Write-Host "CompreFace is ready."
Write-Host "Start it with:"
Write-Host "  .\infra\compreface\start-compreface.ps1"
Write-Host "Then open http://localhost:8000 and create a Face Verification service."
