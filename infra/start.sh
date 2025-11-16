#!/bin/sh
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

echo "Levantando infraestructura de Comercio..."
docker compose up -d --build
