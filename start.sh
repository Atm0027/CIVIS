#!/bin/bash
set -e

echo "[CIVIS] 🚀 Iniciando script de arranque..."

# 1. Configurar puerto de Nginx
echo "[CIVIS] Configurando puerto Nginx: ${PORT}..."
rm -f /etc/nginx/conf.d/*.conf
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "[CIVIS] 🔍 Configuración Nginx generada:"
cat /etc/nginx/conf.d/default.conf

# 2. Ejecutar tareas deLaravel
echo "[CIVIS] Ejecutando migraciones..."
php artisan migrate --force --no-interaction

echo "[CIVIS] Verificando seeders..."
if php artisan db:seed --force --no-interaction; then
    echo "[CIVIS] ✅ Seeders ejecutados"
else
    echo "[CIVIS] ⚠️ Seeders ya ejecutados o error controlado"
fi

echo "[CIVIS] Limpiando caché..."
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

echo "[CIVIS] Enlazando storage..."
php artisan storage:link --no-interaction 2>/dev/null || true

echo "[CIVIS] Corrigiendo permisos..."
chown -R www-data:www-data /var/www/app/storage /var/www/app/bootstrap/cache
chmod -R 775 /var/www/app/storage /var/www/app/bootstrap/cache

# 3. Iniciar Supervisor (gestiona Nginx y PHP-FPM)
echo "[CIVIS] ✅ Iniciando Supervisor (Nginx + PHP-FPM)..."

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
