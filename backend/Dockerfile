FROM php:8.2-fpm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libpq-dev \
        libzip-dev \
        libicu-dev \
        libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring xml ctype bcmath intl zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader --no-interaction || true

COPY . .

RUN php artisan config:cache || true \
    && php artisan route:cache || true

CMD ["php-fpm"]
