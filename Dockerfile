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

# Hacer ejecutable el script de inicio
RUN chmod +x start.sh

# Puerto por defecto de Railway
EXPOSE 8080

# Usar start.sh como comando de inicio
CMD ["bash", "start.sh"]
