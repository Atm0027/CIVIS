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



Informe de Problema: Resolución de Error 502 Bad Gateway
Resumen del Incidente
El despliegue fallaba con un error persistente 502 Bad Gateway. Nginx no podía comunicarse con el backend PHP-FPM, resultando en que la aplicación no cargara.

Causas Raíz Identificadas
Confusión de Enlace TCP/IP: Inicialmente, PHP-FPM estaba configurado para escuchar en 127.0.0.1:9000. Sin embargo, dentro del entorno del contenedor Docker, Nginx a veces tenía problemas para resolver localhost vs 127.0.0.1 vs [::1], lo que llevaba a rechazos de conexión ("Connection refused").
Error de Permisos de Socket: Tras cambiar a un Socket de Dominio Unix (/var/run/php/php-fpm.sock) para evitar problemas de red, el archivo del socket fue creado por el usuario root (comportamiento por defecto de PHP-FPM). Nginx, ejecutándose como www-data, no podía acceder al archivo a pesar de tener permisos de lectura/escritura amplios (0666), probablemente debido a políticas de seguridad estrictas o restricciones en el directorio padre.
Pasos de Resolución
1. Cambio a Sockets de Dominio Unix
Abandonamos el enfoque TCP/IP (red) a favor de Sockets de Dominio Unix (archivos). Esto es más rápido y seguro ya que no expone un puerto de red.

Cambios Realizados:

Dockerfile: Se configuró PHP-FPM para crear un socket en /var/run/php/php-fpm.sock.
Configuración de Nginx: Se actualizó fastcgi_pass para apuntar a unix:/var/run/php/php-fpm.sock.
2. Implementación de Herramienta de Diagnóstico ("El Chivato")
Para identificar por qué fallaba la conexión al socket, inyectamos un script de diagnóstico en 
start.sh
.

Este script se ejecuta 10 segundos después del inicio.
Lista los archivos en /var/run/php/ en los logs.
Resultado: Confirmó que el socket existía pero era propiedad de root.
3. Corrección de Propietario del Socket
Modificamos el Dockerfile para instruir explícitamente a PHP-FPM que asigne la propiedad del socket al usuario del servidor web (www-data).

Código Añadido al Dockerfile:

dockerfile
RUN echo "[www]" > /usr/local/etc/php-fpm.d/zz-zz-force.conf && \
    echo "listen = /var/run/php/php-fpm.sock" >> /usr/local/etc/php-fpm.d/zz-zz-force.conf && \
    echo "listen.mode = 0666" >> /usr/local/etc/php-fpm.d/zz-zz-force.conf && \
    echo "listen.owner = www-data" >> /usr/local/etc/php-fpm.d/zz-zz-force.conf && \
    echo "listen.group = www-data" >> /usr/local/etc/php-fpm.d/zz-zz-force.conf
Resultado Final
El socket ahora es propiedad correcta de www-data.
Nginx puede comunicarse exitosamente con PHP-FPM.
La aplicación carga correctamente sin errores 502.
