#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

docker compose --env-file "${ANZ_ENV_FILE:-$HOME/anz-page.env}" up -d --build
docker image prune -f
