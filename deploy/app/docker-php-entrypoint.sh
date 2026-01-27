#!/bin/sh
set -e

# ¡Crítico! para aplicar cambios de permiso incluso con volúmenes
echo "Corrigiendo permisos de storage..."
chown -R www-data:www-data /var/www/app/storage
chmod -R 755 /var/www/app/storage

# Armar base de datos
php artisan migrate --force --no-interaction

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- php-fpm "$@"
fi

exec "$@"