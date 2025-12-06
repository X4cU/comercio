FROM php:8.2-fpm

# Dependencias del sistema
RUN apt-get update \
    && apt-get install -y \
        git \
        unzip \
        libpq-dev \
        libzip-dev \
        libicu-dev \
        libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip intl opcache \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Instalar dependencias Laravel (solo si existe composer.json)
COPY composer.json composer.lock* ./
RUN composer install --no-interaction --prefer-dist || true

# Copiar app
COPY . .

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
