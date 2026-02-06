# Imagen base
FROM php:8.4-fpm

# Instalar extensiones necesarias y servidor web
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    nginx \
    supervisor \
    gettext-base \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2.9.4 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/app

# Copiar y instalar dependencias PHP
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar archivos del proyecto
COPY . .

# Copiar configuraciones de deploy
COPY deploy/nginx/conf.d/civis.conf /etc/nginx/conf.d/default.conf.template
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY deploy/php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf

# Limpiar archivos innecesarios
RUN rm -rf node_modules package.json package-lock.json

# Hacer ejecutable el script de inicio
RUN chmod +x start.sh

# Crear directorios de logs si no existen
RUN mkdir -p /var/log/supervisor /var/log/nginx

EXPOSE 8080

CMD ["bash", "start.sh"]
