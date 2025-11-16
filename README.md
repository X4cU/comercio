# Comercio — Infraestructura

Esta fase entrega la infraestructura base del sistema **Comercio** usando Docker Compose, Laravel, React, PostgreSQL y Keycloak.

## Estructura
```
/comercio
├── backend/        # Código Laravel + Dockerfile y scripts
├── frontend/       # Código React + Dockerfile y scripts
└── infra/          # Orquestación Docker, Nginx y Keycloak
```

## Requisitos previos
- Docker 24+
- Docker Compose Plugin

## Puesta en marcha
1. Copia las variables de entorno:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Desde `infra/` ejecuta el script de arranque:
   ```bash
   cd infra
   ./start.sh
   ```
   Esto es equivalente a ejecutar `docker compose up -d --build`.
3. Accede a:
   - Frontend: http://localhost
   - Backend (Nginx): http://localhost:9000
   - API directa (PHP-FPM): interno `comercio_backend:9000`
   - Keycloak: http://localhost:8080 (admin/admin)

## Detener servicios
```bash
cd infra
./stop.sh
```

## Keycloak
Importa `infra/keycloak/realm-export.json` desde la consola de administración para inicializar el realm `comercio` con los clientes necesarios.
