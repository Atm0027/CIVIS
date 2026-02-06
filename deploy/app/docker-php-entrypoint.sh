#!/bin/sh
set -e

APP_DIR="/var/www/app"

# ============================================================
# 1. Generar config.env.js con la URL de API inyectada
# ============================================================
echo "[CIVIS] Generando configuración del frontend..."

# Usar FRONTEND_API_URL, o APP_URL + /api como fallback
if [ -n "$FRONTEND_API_URL" ]; then
    API_BASE_URL="$FRONTEND_API_URL"
else
    API_BASE_URL="${APP_URL:-http://localhost}/api"
fi

cat > "${APP_DIR}/public/js/config.env.js" << EOF
// ========================================================
// CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE - NO EDITAR
// Configurar via docker-compose.yml: FRONTEND_API_URL
// ========================================================
window.CIVIS_ENV = {
    API_BASE_URL: "${API_BASE_URL}",
    GENERATED_AT: "$(date -Iseconds 2>/dev/null || date)"
};
console.log('[CIVIS] API URL:', window.CIVIS_ENV.API_BASE_URL);
EOF

echo "[CIVIS] API URL configurada: ${API_BASE_URL}"

# ============================================================
# 2. Corregir permisos de storage
# ============================================================
echo "[CIVIS] Corrigiendo permisos de storage..."
chown -R www-data:www-data /var/www/app/storage
chmod -R 755 /var/www/app/storage

# ============================================================
# 3. Ejecutar migraciones y links
# ============================================================
echo "[CIVIS] Ejecutando migraciones y enlaces..."
php artisan migrate --force --no-interaction
php artisan storage:link --no-interaction || echo "[CIVIS] Enlace de storage ya existe."

echo "[CIVIS] Ejecutando seeders..."
if php artisan db:seed --force --no-interaction; then
    echo "[CIVIS] ✅ Seeders ejecutados correctamente"
else
    echo "[CIVIS] ⚠️ Seeders ya ejecutados o error (esto es normal si ya existen datos)"
fi

# ============================================================
# 4. Limpiar caché de configuración para aplicar CORS
# ============================================================
echo "[CIVIS] Limpiando caché..."
php artisan config:clear 2>/dev/null || true

# ============================================================
# 5. Iniciar PHP-FPM
# ============================================================
if [ "${1#-}" != "$1" ]; then
    set -- php-fpm "$@"
fi

exec "$@"
