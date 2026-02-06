#!/bin/bash
set -e

echo "[CIVIS] Iniciando aplicación..."

# Ejecutar migraciones
echo "[CIVIS] Ejecutando migraciones..."
php artisan migrate --force --no-interaction

# Ejecutar seeders
echo "[CIVIS] Ejecutando seeders..."
if php artisan db:seed --force --no-interaction; then
    echo "[CIVIS] ✅ Seeders ejecutados correctamente"
else
    echo "[CIVIS] ⚠️ Seeders ya ejecutados o hubo un error"
fi

# Limpiar caché
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true

# Crear enlace de storage
php artisan storage:link --no-interaction 2>/dev/null || true

echo "[CIVIS] ✅ Iniciando servidor en puerto ${PORT:-8000}..."

# Iniciar servidor Laravel
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
