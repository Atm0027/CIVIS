#!/bin/bash
set -e

echo "[CIVIS] 🚀 Iniciando script de arranque..."

# 1. Configurar puerto de Nginx
echo "[CIVIS] Configurando puerto Nginx: ${PORT}..."
rm -f /etc/nginx/conf.d/*.conf
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "[CIVIS] 🔍 Configuración Nginx generada:"
cat /etc/nginx/conf.d/default.conf

# 2. Preparar entorno Laravel
echo "[CIVIS] Preparando directorios..."
mkdir -p /var/www/app/storage/framework/cache/data
mkdir -p /var/www/app/storage/framework/app/cache
mkdir -p /var/www/app/storage/framework/sessions
mkdir -p /var/www/app/storage/framework/views
mkdir -p /var/www/app/resources/views

echo "[CIVIS] Ejecutando migraciones..."
php artisan migrate --force --no-interaction || echo "[CIVIS] ⚠️ Error en migraciones"

echo "[CIVIS] Verificando seeders..."
php artisan db:seed --force --no-interaction || echo "[CIVIS] ⚠️ Seeders ya ejecutados o error controlado"

echo "[CIVIS] Gestionando caché..."
# Usamos || true para que no detenga el arranque si hay errores menores
php artisan config:clear || true
php artisan cache:clear || true
php artisan view:clear || true
php artisan route:clear || true

echo "[CIVIS] Enlazando storage..."
php artisan storage:link --no-interaction || true

echo "[CIVIS] Corrigiendo permisos..."
chown -R www-data:www-data /var/www/app/storage /var/www/app/bootstrap/cache
chmod -R 775 /var/www/app/storage /var/www/app/bootstrap/cache

# 3. Iniciar Supervisor (gestiona Nginx y PHP-FPM)
echo "[CIVIS] ✅ Iniciando Supervisor (Nginx + PHP-FPM)..."

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
