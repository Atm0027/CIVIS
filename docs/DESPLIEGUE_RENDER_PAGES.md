# Guía de Despliegue 100% Gratuito: Render + Neon + Cloudflare Pages

Esta es la guía paso a paso para poner en marcha tu proyecto con el ecosistema gratuito actual, garantizando que Docker y Laravel corran perfectamente usando la infraestructura en código (`render.yaml`) que ya hemos preparado.

---

## 🔥 PASO 1: La Base de Datos (Neon.tech)

Como Render ya no da bases de datos de forma permanente, utilizaremos **Neon**, que te regala un servidor PostgreSQL ultrarrápido sin requerir tarjeta de crédito.

1. Entra a [Neon.tech](https://neon.tech) y regístrate con GitHub o correo.
2. Crea un nuevo proyecto. Llámalo `civis-db`.
3. Elige la región más cercana a ti (o a tu servidor de Render, por ejemplo, US East o Frankfurt).
4. Dale a **Create Project**.
5. Se abrirá una pantalla con un resumen. Busca la cadena de conexión en el panel `Connection Details`.
6. Tiene formato `postgres://[usuario]:[contraseña]@[servidor].aws.neon.tech/neondb?sslmode=require`. **Cópiala completa y guárdala.**

---

## 🚀 PASO 2: El Backend de Docker (Render.com)

Render será el cerebro de la aplicación. Cargará tu `Dockerfile` y expondrá tu API hacia el frontend.

1. Loguéate en [Render.com](https://render.com) usando GitHub.
2. En el panel principal (Dashboard), arriba a la derecha, haz clic en **New** y elige **"Blueprint"** (muy importante).
3. Conecta tu cuenta y selecciona el repositorio de GitHub donde acabas de guardar los archivos de CIVIS.
4. Al detectarlo, Render leerá el archivo `render.yaml` que incluí en tu código. Inmediatamente te mostrará unas casillas en blanco para llenar las "Variables de Entorno Secretas". 
5. Llénalas de la siguiente manera:
   - `DATABASE_URL` -> *(Pega aquí la URL larguísima del Paso 1)*.
   - `APP_KEY` -> *(Pega tu clave generada con base64 local, ej: `base64:...`)*
   - `APP_URL` -> Escribe al azar un nombre asumiendo cómo te nombrará Render. Ej: `https://civis-backend.onrender.com`
   - `CORS_ALLOWED_ORIGINS` -> Escribe al azar el nombre que tendrá Cloudflare. Ej: `https://civis-frontend.pages.dev`
   - *(Nota: Todos estos nombres podrás editarlos desde el panel después de que se despliegue y te den los nombres definitivos)*.
6. Pulsa en **Apply**. Render empezará a clonar el proyecto, instalar Docker, PHP, lanzar las migraciones automáticas (`start.sh`) y en un par de minutos estará online. 
7. **IMPORTANTE:** Cuando el despliegue termine con éxito, Render te dará arriba tu URL pública oficial (ej. `https://civis-app-5x8d.onrender.com`). Cópiala.

---

## 🎨 PASO 3: El Frontend (Cloudflare Pages)

Tu backend ya está en línea esperando recibir llamadas. Ahora hay que colgar la página web (`/public`) en la red mundial sin coste y permitirle hablar con tu backend de Render.

1. Abre de nuevo el código de tu proyecto local en tu editor (VS Code, Cursor, etc.).
2. Abre el archivo `public/js/config.js`.
3. Busca la línea: `return 'https://civis-backend.onrender.com/api';` y reemplázala por la URL **exacta y oficial** que te dio Render en el Paso 2:
   ```javascript
   // Debería quedar así:
   return 'https://civis-app-5x8d.onrender.com/api'; 
   ```
4. Sube la carpeta `/public` y lánzala:
   - Entra a [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Páginas (Pages)** -> **Upload Assets** (Atajo directo).
   - Arrastra tu carpeta `public` que modificaste hace 1 minuto a la caja remarcada.
   - Cloudflare desplegará todo el HTML, CSS y videos que tenías ahí, ofreciéndote un link rápido como `civis-front.pages.dev`.

### 🔗 El enlace Final:
Lo último que resta es avisarle a tu backend (Render) que autorice ese enlace de tu frontend (Cloudflare).
1. Entra a tu app en **Render**.
2. Ve a la pestaña lateral **"Environment"** (Entorno).
3. Busca el campo `CORS_ALLOWED_ORIGINS` y modifica su valor actual por la URL final de `pages.dev` que te dio Cloudflare. También asegúrate de en `FRONTEND_API_URL` poner esa ruta (ej. `https://civis-app-5x8d.onrender.com/api`).
4. Pulsa guardar cambios.

¡Abre tu enlace de Cloudflare Pages y verás cómo el Frontend carga instantáneamente, conectándose perfecto con el motor y la base PostgreSQL de Render!
