param(
    [switch]$SkipBuild,
    [ValidateRange(30, 900)]
    [int]$TimeoutSeconds = 300
)

# External programs such as Docker write diagnostics to stderr. Windows PowerShell
# turns that output into error records, so exit codes are checked explicitly below.
$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$EnvironmentFile = Join-Path $ProjectRoot ".env"

function Write-Step([string]$Message) {
    Write-Host "[....] $Message" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
    Write-Host "[ OK ] $Message" -ForegroundColor Green
}

function Stop-WithError([string]$Message) {
    Write-Host "[FAIL] $Message" -ForegroundColor Red
    exit 1
}

function Get-EnvironmentValue([string]$Name, [string]$DefaultValue = "") {
    $line = Get-Content -LiteralPath $EnvironmentFile | Where-Object {
        $_ -match "^\s*$([regex]::Escape($Name))\s*="
    } | Select-Object -Last 1

    if (-not $line) {
        return $DefaultValue
    }

    $value = ($line -split "=", 2)[1].Trim()
    return $value.Trim('"').Trim("'")
}

function Test-HttpEndpoint([string]$Url) {
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    } catch {
        return $false
    }
}

Set-Location -LiteralPath $ProjectRoot

Write-Host ""
Write-Host "FlexCheck presentation launcher" -ForegroundColor White
Write-Host "==============================" -ForegroundColor DarkGray

Write-Step "Checking Docker Desktop"
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Stop-WithError "Docker was not found. Install and start Docker Desktop first."
}

& docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Stop-WithError "Docker Desktop is installed but is not ready. Open it and wait for the engine to start."
}
Write-Ok "Docker is running"

Write-Step "Checking the environment file"
if (-not (Test-Path -LiteralPath $EnvironmentFile -PathType Leaf)) {
    Stop-WithError "The root .env file is missing. Copy .env.demo.example to .env and fill in the required values."
}

$requiredVariables = @(
    "ORACLE_URL",
    "ORACLE_USER",
    "ORACLE_PASSWORD",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD"
)

foreach ($name in $requiredVariables) {
    $value = Get-EnvironmentValue $name
    if ([string]::IsNullOrWhiteSpace($value) -or $value -match "^(your_|change_me)") {
        Stop-WithError "$name is missing or still contains a placeholder in .env."
    }
}

# Compose interpolates this value even when the optional local-Oracle profile is
# inactive. Avoid a distracting warning during remote-database demonstrations.
if ([string]::IsNullOrWhiteSpace((Get-EnvironmentValue "ORACLE_SYS_PASSWORD"))) {
    $env:ORACLE_SYS_PASSWORD = "unused-remote-demo"
}

& docker compose config --quiet
if ($LASTEXITCODE -ne 0) {
    Stop-WithError "Docker Compose could not validate docker-compose.yml and .env."
}
Write-Ok "Environment and Compose configuration are valid"

Write-Step $(if ($SkipBuild) { "Starting the existing demo images" } else { "Building and starting the complete demo stack" })
$composeArguments = @("compose", "up", "-d")
if (-not $SkipBuild) {
    $composeArguments += "--build"
}

& docker @composeArguments
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    & docker compose ps
    Stop-WithError "The Compose stack did not start. Review the Docker output above."
}

$gatewayPort = Get-EnvironmentValue "GATEWAY_PORT" "8088"
$kioskPort = Get-EnvironmentValue "KIOSK_PORT" "3000"
$adminPort = Get-EnvironmentValue "ADMIN_WEB_PORT" "3001"

$checks = @(
    [pscustomobject]@{ Name = "API gateway"; Url = "http://127.0.0.1:$gatewayPort/gateway/health" },
    [pscustomobject]@{ Name = "Kiosk"; Url = "http://127.0.0.1:$kioskPort" },
    [pscustomobject]@{ Name = "Admin portal"; Url = "http://127.0.0.1:$adminPort" }
)

Write-Step "Waiting for the application to become ready (up to $TimeoutSeconds seconds)"
$ready = @{}
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)

while ((Get-Date) -lt $deadline -and $ready.Count -lt $checks.Count) {
    foreach ($check in $checks) {
        if (-not $ready.ContainsKey($check.Name) -and (Test-HttpEndpoint $check.Url)) {
            $ready[$check.Name] = $true
            Write-Ok "$($check.Name) is responding"
        }
    }

    if ($ready.Count -lt $checks.Count) {
        Start-Sleep -Seconds 3
    }
}

$missing = @($checks | Where-Object { -not $ready.ContainsKey($_.Name) })
if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "The following checks did not become ready:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "  - $($_.Name): $($_.Url)" }
    Write-Host ""
    & docker compose ps
    Write-Host ""
    Write-Host "Recent container logs:" -ForegroundColor Yellow
    & docker compose logs --tail 80
    Stop-WithError "FlexCheck did not pass every readiness check."
}

Write-Host ""
Write-Host "FlexCheck is ready for the presentation." -ForegroundColor Green
Write-Host "Kiosk:       http://127.0.0.1:$kioskPort"
Write-Host "Admin:       http://127.0.0.1:$adminPort"
Write-Host "API health:  http://127.0.0.1:$gatewayPort/gateway/health"
Write-Host ""
Write-Host "Use scripts\stop-demo.cmd when the presentation is finished." -ForegroundColor DarkGray

