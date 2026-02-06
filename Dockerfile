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

# Configuración de PHP-FPM: asegurar que escuche en el puerto 9000
RUN sed -i 's|listen = /usr/local/var/run/php-fpm.sock|listen = 9000|g' /usr/local/etc/php-fpm.d/www.conf || true \
    && sed -i 's|listen = 127.0.0.1:9000|listen = 9000|g' /usr/local/etc/php-fpm.d/www.conf || true

# Copiar configuraciones de deploy
COPY deploy/nginx/conf.d/civis.conf /etc/nginx/conf.d/default.conf.template
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY deploy/php-fpm/zz-civis.conf /usr/local/etc/php-fpm.d/zz-civis.conf

# Eliminar configs por defecto de Nginx que causan conflictos
RUN rm -rf /etc/nginx/sites-enabled/* /etc/nginx/sites-available/* \
    /etc/nginx/conf.d/default.conf

# Forzar a PHP a escuchar en el puerto 9000 (TCP) para evitar Error 502
RUN sed -i 's/listen = .*/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/*.conf || true

# Limpiar archivos innecesarios
RUN rm -rf node_modules package.json package-lock.json

# Hacer ejecutable el script de inicio
RUN chmod +x start.sh

# Crear directorios necesarios y asignar permisos
RUN mkdir -p /var/log/supervisor /var/log/nginx /var/run/php \
    /var/www/app/resources/views \
    /var/www/app/storage/framework/cache/data \
    /var/www/app/storage/framework/views \
    /var/www/app/storage/framework/sessions \
    /var/www/app/bootstrap/cache && \
    chown -R www-data:www-data /var/run/php /var/www/app && \
    chmod -R 775 /var/www/app/storage /var/www/app/bootstrap/cache && \
    chmod 777 /var/run/php

EXPOSE 8080

CMD ["bash", "start.sh"]
