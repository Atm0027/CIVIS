Informe de Problemas y Soluciones - Proyecto CIVIS
Este informe resume los obstáculos técnicos encontrados durante el despliegue de la plataforma CIVIS en Cloudflare (Frontend) y Railway (Backend), junto con las soluciones implementadas para lograr un sistema 100% funcional.

1. Error 405 / Fallo de API en el Frontend
El Problema
La aplicación web en Cloudflare Pages no podía cargar los vídeos porque la variable del backend (API_BASE_URL) no estaba llegando al navegador. Al estar vacía, el navegador intentaba hacer peticiones a rutas inexistentes, devolviendo errores 405 Method Not Allowed.

La Solución
Se modificó el Comando de Compilación en Cloudflare para generar dinámicamente un archivo de configuración en cada despliegue:

bash
echo "window.CIVIS_ENV = { API_BASE_URL: 'https://civis-production-6ad2.up.railway.app/api' };" > public/js/config.env.js
2. Errores 502 Bad Gateway y Caídas del Servidor
El Problema
El backend en Railway se caía constantemente. Los logs indicaban que la aplicación no encontraba una base de datos válida y que las variables de entorno (como APP_KEY) tenían comillas innecesarias que Laravel no podía interpretar.

La Solución
Se creó un servicio de PostgreSQL dedicado dentro del proyecto de Railway.
Se limpiaron las variables de entorno en el panel de Railway, eliminando todas las comillas dobles (") de los valores.
Se habilitó la ejecución automática de tablas mediante el comando: php artisan migrate --force.
3. Fallo de DNS Interno (Base de Datos)
El Problema
Incluso con la base de datos creada, el backend no podía conectarse. Railway devolvía el error: could not translate host name "Postgres.railway.internal". Esto indicaba un fallo en la red interna de Railway para resolver el nombre del servidor.

La Solución
Se utilizó la Conexión Pública (TCP Proxy). Se configuró el backend para usar la URL externa y el puerto específico asignado por Railway:

Host: crossover.proxy.rlwy.net
Puerto: 19075
4. Desajuste de Puertos (Efecto CORS)
El Problema
El sistema mostraba un error de CORS persistente y un 502 Bad Gateway. Al analizar los Network Flow Logs, se descubrió que Railway buscaba la aplicación en el puerto 8000, mientras que el contenedor estaba configurado internamente para usar el 9000 (PHP-FPM). Como Railway no encontraba la app, la conexión moría y el navegador bloqueaba la respuesta por seguridad.

La Solución
Se sincronizaron los puertos forzando a Laravel a escuchar en el puerto esperado por Railway mediante el Start Command:

bash
php artisan serve --host=0.0.0.0 --port=8000
Estado Final del Proyecto
Frontend: ✅ Conectado y recibiendo datos de la API.
Backend: ✅ Procesando peticiones con Status 200/204.
Base de Datos: ✅ Migrada y con todas las tablas creadas (users, videos, etc.).
Resultado: El proyecto CIVIS está oficialmente desplegado y listo para su uso.
