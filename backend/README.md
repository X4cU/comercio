# COMERCIO Backend

Backend API del sistema COMERCIO (Laravel + PostgreSQL + Keycloak listo para JWT).

## Migraciones

```bash
cd ~/comercio/infra
docker compose exec backend php /var/www/html/artisan migrate
```

## Probar el backend

```bash
cd ~/comercio/infra
docker compose exec backend php /var/www/html/artisan route:list
```

### Healthcheck

```bash
curl http://localhost:9000/api/v1/health
```
