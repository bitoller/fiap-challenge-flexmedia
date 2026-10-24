#!/usr/bin/env bash

set -u

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
SKIP_BUILD=false
TIMEOUT_SECONDS=300

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --timeout)
      if [[ $# -lt 2 || ! "$2" =~ ^[0-9]+$ || "$2" -lt 30 ]]; then
        echo "[FAIL] --timeout requires a number of at least 30 seconds."
        exit 1
      fi
      TIMEOUT_SECONDS="$2"
      shift 2
      ;;
    *)
      echo "[FAIL] Unknown option: $1"
      echo "Usage: bash scripts/start-demo.sh [--skip-build] [--timeout SECONDS]"
      exit 1
      ;;
  esac
done

step() { printf '[....] %s\n' "$1"; }
ok() { printf '[ OK ] %s\n' "$1"; }
fail() { printf '[FAIL] %s\n' "$1" >&2; exit 1; }

env_value() {
  local name="$1"
  local fallback="${2:-}"
  local line
  line="$(grep -E "^[[:space:]]*${name}[[:space:]]*=" "$ENV_FILE" 2>/dev/null | tail -n 1 || true)"
  if [[ -z "$line" ]]; then
    printf '%s' "$fallback"
    return
  fi

  local value="${line#*=}"
  value="$(printf '%s' "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  printf '%s' "$value"
}

cd "$PROJECT_ROOT" || exit 1

printf '\nFlexCheck presentation launcher\n'
printf '%s\n' '=============================='

step "Checking Docker Desktop"
command -v docker >/dev/null 2>&1 || fail "Docker was not found. Install and start Docker Desktop first."
docker info >/dev/null 2>&1 || fail "Docker Desktop is installed but is not ready. Open it and wait for the engine to start."
ok "Docker is running"

step "Checking the environment file"
[[ -f "$ENV_FILE" ]] || fail "The root .env file is missing. Copy .env.demo.example to .env and fill in the required values."

for name in ORACLE_URL ORACLE_USER ORACLE_PASSWORD ADMIN_USERNAME ADMIN_PASSWORD; do
  value="$(env_value "$name")"
  if [[ -z "$value" || "$value" == your_* || "$value" == change_me* ]]; then
    fail "$name is missing or still contains a placeholder in .env."
  fi
done

# Compose interpolates this value even when the optional local-Oracle profile is
# inactive. Avoid a distracting warning during remote-database demonstrations.
if [[ -z "$(env_value ORACLE_SYS_PASSWORD)" ]]; then
  export ORACLE_SYS_PASSWORD="unused-remote-demo"
fi

docker compose config --quiet || fail "Docker Compose could not validate docker-compose.yml and .env."
ok "Environment and Compose configuration are valid"

if [[ "$SKIP_BUILD" == true ]]; then
  step "Starting the existing demo images"
  docker compose up -d || fail "The Compose stack did not start. Review the Docker output above."
else
  step "Building and starting the complete demo stack"
  docker compose up -d --build || fail "The Compose stack did not start. Review the Docker output above."
fi

gateway_port="$(env_value GATEWAY_PORT 8088)"
kiosk_port="$(env_value KIOSK_PORT 3000)"
admin_port="$(env_value ADMIN_WEB_PORT 3001)"

labels=("API gateway" "Kiosk" "Admin portal")
urls=(
  "http://127.0.0.1:${gateway_port}/gateway/health"
  "http://127.0.0.1:${kiosk_port}"
  "http://127.0.0.1:${admin_port}"
)
ready=(0 0 0)
ready_count=0
deadline=$((SECONDS + TIMEOUT_SECONDS))

step "Waiting for the application to become ready (up to ${TIMEOUT_SECONDS} seconds)"
while (( SECONDS < deadline && ready_count < ${#urls[@]} )); do
  for index in "${!urls[@]}"; do
    if [[ "${ready[$index]}" -eq 0 ]] && curl --silent --show-error --fail --max-time 5 "${urls[$index]}" >/dev/null 2>&1; then
      ready[$index]=1
      ready_count=$((ready_count + 1))
      ok "${labels[$index]} is responding"
    fi
  done

  if (( ready_count < ${#urls[@]} )); then
    sleep 3
  fi
done

if (( ready_count < ${#urls[@]} )); then
  printf '\nThe following checks did not become ready:\n' >&2
  for index in "${!urls[@]}"; do
    if [[ "${ready[$index]}" -eq 0 ]]; then
      printf '  - %s: %s\n' "${labels[$index]}" "${urls[$index]}" >&2
    fi
  done
  printf '\n'
  docker compose ps
  printf '\nRecent container logs:\n'
  docker compose logs --tail 80
  fail "FlexCheck did not pass every readiness check."
fi

printf '\nFlexCheck is ready for the presentation.\n'
printf 'Kiosk:       http://127.0.0.1:%s\n' "$kiosk_port"
printf 'Admin:       http://127.0.0.1:%s\n' "$admin_port"
printf 'API health:  http://127.0.0.1:%s/gateway/health\n\n' "$gateway_port"
printf 'Use bash scripts/stop-demo.sh when the presentation is finished.\n'

