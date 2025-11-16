#!/bin/sh
set -euo pipefail

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
fi

if command -v composer >/dev/null 2>&1 && [ -f composer.json ]; then
  composer install --no-interaction --prefer-dist
fi

php-fpm
