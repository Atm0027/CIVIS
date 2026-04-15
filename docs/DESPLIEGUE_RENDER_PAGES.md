# Guía de Despliegue 100% Gratuito: Render + Neon + Cloudflare Pages

Esta es la guía paso a paso para poner en marcha tu proyecto con el ecosistema gratuito actual, garantizando que Docker y Laravel corran perfectamente usando la infraestructura en código (`render.yaml`) que ya hemos preparado.

---

## 🔥 PASO 1: La Base de Datos (Supabase)

Supabase es una extraordinaria alternativa de código abierto a Firebase y ofrece una base de datos PostgreSQL alojada y robusta en su capa gratuita (para siempre).

1. Entra a [Supabase.com](https://supabase.com) y regístrate con GitHub.
2. Crea un nuevo proyecto. Introduce un nombre (ej. `civis-db`) y una **contraseña fuerte**. *(Guarda bien esa contraseña, Supabase no te la mostrará nuevamente jamás).*
3. Elige la región de tu servidor (idealmente la más cercana a donde ubicarás el backend en Render).
4. Espera de 1 a 2 minutos a que Inicialice la base de datos.
5. Ve a **Project Settings (Engranaje) -> Database**.
6. En la parte superior, busca la sección de **Connection string (URI)**.
7. Asegúrate de tener seleccionado Node.js/URI y **usar el esquema de Pooling (Puerto 6543)** si lo marca (esto evita que el servidor llegue al límite). Tu URI lucirá más o menos así:
   `postgresql://postgres:[TU-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres` (O con puerto 6543).
8. Reemplaza `[YOUR-PASSWORD]` por la contraseña que escogiste y **copia toda la URL**.

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
