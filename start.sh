#!/bin/bash
set -e

echo "[CIVIS] 🚀 Iniciando sistema..."

# 1. Aplicar variables de entorno al template de Nginx
echo "[CIVIS] Configurando servidor web (Puerto: ${PORT})..."
rm -f /etc/nginx/conf.d/*.conf
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 2. Preparar directorios de Laravel (asegurar que existen)
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p bootstrap/cache
mkdir -p resources/views

# 3. Base de Datos: Migraciones y Seeders
if [ -n "$DATABASE_URL" ] || [ -n "$DB_URL" ]; then
    echo "[CIVIS] Ejecutando base de datos..."
    php artisan migrate --force --no-interaction || echo "[CIVIS] ⚠️ Error en migraciones"
    php artisan db:seed --force --no-interaction || echo "[CIVIS] ⚠️ Seeders ya estaban presentes o fallaron"
else
    echo "[CIVIS] ⚠️ WARNING: No se detectó URL de base de datos."
fi

# 4. Optimizaciones de Producción
echo "[CIVIS] Optimizando para producción..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize
php artisan storage:link --no-interaction || true

# 5. Ajuste final de permisos (solo sobre lo necesario)
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 6. Arranque de servicios via Supervisor
echo "[CIVIS] ✅ Todo listo. Iniciando servicios..."


exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
