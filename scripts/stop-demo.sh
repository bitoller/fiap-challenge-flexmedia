#!/usr/bin/env bash

set -u

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

echo "Stopping FlexCheck..."
if ! docker compose down; then
  echo "FlexCheck could not be stopped cleanly. Check that Docker Desktop is running." >&2
  exit 1
fi

echo "FlexCheck stopped. Database volumes were preserved."

