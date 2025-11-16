#!/bin/sh
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

echo "Deteniendo infraestructura de Comercio..."
docker compose down
