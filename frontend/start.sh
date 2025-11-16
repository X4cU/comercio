#!/bin/sh
set -euo pipefail

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
fi

if command -v npm >/dev/null 2>&1 && [ -f package.json ]; then
  npm install
fi

npm run dev -- --host 0.0.0.0 --port 5173
