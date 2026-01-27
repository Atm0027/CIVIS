# Imagen base
FROM php:8.4-fpm

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql

# Instalar Composer (sin dependencias del host)
COPY --from=composer:2.9.4 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/app

# Copiar y instalar dependencias PHP (caching optimizado)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar TODO el proyecto (incluye /public con frontend)
COPY . .

# Limpiar archivos innecesarios
RUN rm -rf node_modules package.json package-lock.json

EXPOSE 9000

COPY ./deploy/app/docker-php-entrypoint.sh /usr/local/bin/docker-php-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-php-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-php-entrypoint.sh"]
CMD ["php-fpm"]