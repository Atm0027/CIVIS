# Guía Definitiva: Despliegue en Oracle Cloud + Cloudflare Tunnels

¡Excelente elección! Oracle Cloud ("Always Free") con Cloudflare Tunnels es la arquitectura más robusta, segura y gratuita que puedes conseguir para un proyecto con Docker.

Esta guía asume que ya tienes tu aplicación alojada en GitHub (o similar) para poder descargarla en el servidor.

---

## FASE 1: Obtener la Máquina en Oracle Cloud ☁️

1. **Crear Instancia:**
   - Entra a tu panel de Oracle Cloud y ve a **Instances** -> **Create Instance**.
   - **Imagen (OS):** Cambia Oracle Linux por **Ubuntu 22.04 o 24.04**.
   - **Shape (Procesador):** Ve a "Ampere" y selecciona la máquina virtual de **ARM** (VM.Standard.A1.Flex). Ponle 4 OCPUs y 24 GB de RAM (es la versión gratuita masiva). Si no hay disponibilidad temporal de ARM, usa la **VM.Standard.E2.1.Micro** (AMD con 1GB RAM).
   - **Claves SSH:** ¡Súper importante! Dale a **"Save private key"** antes de terminar. Se descargará un archivo `.key`. Lo vas a necesitar para conectarte a tu servidor.
2. **Conectarte a la máquina:**
   Abre una terminal en tu computadora y usa tu clave descargada:
   ```bash
   # En Windows puedes usar PowerShell o CMD
   ssh -i ruta/a/tu/clave.key ubuntu@<IP-PUBLICA-DE-ORACLE>
   ```

---

## FASE 2: Preparando el VPS 🛠️

Una vez dentro de la terminal negra de tu servidor Oracle, hay que instalar las herramientas base (Docker y Git):
```bash
sudo apt update
sudo apt install curl git -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Dar permisos a tu usuario para no tener que usar 'sudo' con docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## FASE 3: Clonar tu Proyecto 📦

Descarga tu código de GitHub en el servidor:
```bash
git clone https://github.com/Atm0027/CIVIS.git
cd CIVIS
```

*(Si tu repositorio es privado, te pedirá que inicies sesión con tu Personal Access Token de Github).*

---

## FASE 4: Crear El Túnel en Cloudflare 🛡️

Tu objetivo es que Cloudflare se conecte a tu servidor internamente sin que abras puertos públicos.

1. Entra al dashboard de tu dominio en Cloudflare.
2. Ve a **Zero Trust** (panel lateral izquierdo) -> **Networks** -> **Tunnels**.
3. Dale a **Create a tunnel**, elige `cloudflared` y ponle nombre (ej. `civis-tunnel`).
4. Te mostrará un comando grande (para instalarlo) pero verás que tiene un **Token**. Solo necesitas copiar el texto final del Token (es muy largo).
5. En esa misma pantalla, dale a "Next", y en la sección **Public Hostname** configura:
   - **Subdomain / Domain:** (ej. el dominio principal que hayas comprado).
   - **Service Type:** `HTTP`
   - **URL:** `nginx:80` (Esto le indica al túnel que busque el contenedor nginx de tu docker-compose).

---

## FASE 5: Ediciones en Producción (Servidor) 🚀

Para no dañar tu código local que usas para desarrollar, edita el archivo *directamente en el servidor*:
```bash
nano docker-compose.yml
```

Realiza estos dos cambios críticos dentro del archivo:

### 1. Variables de Producción (Sección `app`)
Cambia los valores para apuntar a tu dominio real:
```yaml
      - APP_ENV=production
      - APP_DEBUG=false
      # Actualiza estas URLs con tu dominio final:
      - APP_URL=https://tu-dominio.com
      - CORS_ALLOWED_ORIGINS=https://tu-dominio.com
      - FRONTEND_API_URL=https://tu-dominio.com/api
      - SANCTUM_STATEFUL_DOMAINS=tu-dominio.com
```

### 2. Cerrar puertos y añadir el Túnel (Bloque Final)
Busca la sección del `nginx` y bórra/comenta el bloque `ports`:
```yaml
   nginx:
     image: nginx:1.29.4-alpine
     # QUITAR ESTO DE AQUÍ PARA PROTEGER EL SERVIDOR
     # ports:
     #  - "80:80"  
```

Luego, al final del archivo antes de `networks:`, pega el nuevo contenedor que comunicará la máquina con Cloudflare:
```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: civis-tunnel
    command: tunnel run
    environment:
      # CAMBIA ESTO POR TU TOKEN DE CLOUDFLARE
      - TUNNEL_TOKEN=eyJh...PEGALO_AQUI
    networks:
      - laravel
    restart: unless-stopped
    depends_on:
      - nginx
```
*(Para salir de nano guardando: presiona `Ctrl+X`, luego la letra `Y`, y luego `Enter`)*.

---

## FASE 6: ¡Elevación y Lanzamiento! 🚀

Con el túnel configurado, ya solo te queda encender todo:
```bash
# Levantar los contenedores en modo silencioso (-d)
docker-compose up -d --build
```

Y finalmente, ejecutar las tablas de la base de datos de producción de Laravel:
```bash
docker exec civis-app php artisan migrate --force
```

**¡Felicidades! 🎉** 
Si vas a tu dominio HTTPS configurado, Cloudflare gestionará el tráfico, lo cifrará, y se lo enviará a tu cuenta de Oracle de forma privada para que el contenedor NGINX levante tu frontend CIVIS y todo fluya correctamente.
