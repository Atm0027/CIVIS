# 🏛️ CIVIS - Tu Asistente Burocrático

> Plataforma digital que simplifica la burocracia en España, convirtiendo trámites complejos en procesos sencillos, visuales y accesibles 24/7 desde cualquier dispositivo.

---

## 📑 Tabla de Contenidos
- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [API Endpoints](#-api-endpoints)
- [Credenciales de Demo](#-credenciales-de-demo)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🚀 Descripción

Civis es la plataforma digital que simplifica la burocracia en España, convirtiendo trámites complejos y llamadas interminables en procesos sencillos, visuales y accesibles 24/7 desde cualquier dispositivo.

En un entorno donde la burocracia es sinónimo de frustración, largas esperas y un lenguaje incomprensible, nuestra aplicación se erige como el asistente personal del ciudadano, ofreciendo una solución integral que mejora el acceso a la información burocrática en España.

Este proyecto combina:
- **Backend**: API RESTful construida con Laravel 11
- **Frontend**: Interfaz de usuario moderna con HTML, CSS y JavaScript vanilla

---

## ✨ Características

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación completa
- **Inicio y cierre de sesión** seguro con tokens JWT
- **Gestión de perfiles** con datos personales completos
- **Protección de páginas** con sistema de sesiones
- **API de autenticación** con Laravel Sanctum

### 📹 Videoteca de Trámites
Guías audiovisuales paso a paso organizadas por categorías:
- Estudios (Beca MEC, matrículas)
- Empleo (contratos, prestaciones)
- Ciudadanía (DNI, NIE, empadronamiento)
- Certificados digitales
- Declaración de la RENTA

### 📅 Calendario de Plazos
- Vista de plazos cercanos en sidebar
- Lista completa de todos los plazos
- Indicadores visuales de plazos activos/finalizados
- API para gestión de plazos

### ❓ Preguntas Frecuentes
- Respuestas claras a dudas burocráticas comunes
- Sistema de búsqueda
- Gestión desde el backend

### 👤 Perfil de Usuario Completo
- **Información Personal**: Nombre, email, DNI/NIE, teléfono, fecha de nacimiento
- **Dirección**: Calle, localidad, código postal, provincia
- **Datos Relevantes**: Información adicional para personalización
- **Seguridad**: Cambio de contraseña, gestión de sesión

### 🔍 Búsqueda Avanzada
- Barra de búsqueda centrada y responsive
- Búsqueda por palabras completas
- Filtros por categoría
- Contador de resultados en tiempo real

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework**: Laravel 11
- **Base de datos**: MySQL/PostgreSQL
- **Autenticación**: Laravel Sanctum
- **API**: RESTful API con JSON
- **PHP**: 8.2+

### Frontend
- **HTML5**: Semántico y accesible
- **CSS3**: Custom properties, Flexbox, Grid
- **JavaScript**: ES6+ Vanilla (sin frameworks)
- **Arquitectura**: Modular y componetizada

### DevOps
- **Control de versiones**: Git
- **Servidor local**: PHP Artisan serve / Vite
- **Gestión de dependencias**: Composer, NPM

---

## 📁 Estructura del Proyecto

```
CIVIS/
├── 📂 app/                          # Lógica de la aplicación Laravel
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php       # Controlador base
│   │   │   └── Api/                 # Controladores de la API REST
│   │   │       ├── AuthController.php   # Login, logout, registro
│   │   │       ├── VideoController.php  # CRUD de videos
│   │   │       ├── CategoryController.php
│   │   │       ├── DeadlineController.php
│   │   │       └── FaqController.php
│   │   ├── Middleware/              # Middlewares personalizados
│   │   │   └── IsAdmin.php          # Validar rol de administrador
│   │   └── Resources/               # Transformadores de respuestas API
│   │       ├── CategoryResource.php
│   │       ├── DeadlineResource.php
│   │       ├── FaqResource.php
│   │       ├── UploadResource.php
│   │       └── UserResource.php
│   ├── Models/                      # Modelos Eloquent
│   │   ├── User.php
│   │   ├── Video.php
│   │   ├── Category.php
│   │   ├── Deadline.php
│   │   ├── Faq.php
│   │   └── Upload.php
│   └── Providers/                   # Service Providers
│       └── AppServiceProvider.php
│
├── 📂 bootstrap/                    # Inicialización de Laravel
│   ├── app.php
│   ├── providers.php
│   └── cache/
│
├── 📂 config/                       # Archivos de configuración
│   ├── app.php, auth.php, cache.php
│   ├── cors.php, database.php
│   ├── filesystems.php, logging.php
│   ├── mail.php, queue.php
│   ├── sanctum.php, services.php
│   └── session.php
│
├── 📂 database/
│   ├── migrations/                  # Estructura de tablas de BD
│   │   ├── 0001_01_01_* (tablas base)
│   │   ├── 2026_01_14_* (categorías, videos, FAQs, plazos)
│   │   ├── 2026_01_15_* (autenticación, uploads, roles)
│   │   ├── 2026_01_27_* (username)
│   │   ├── 2026_02_03_* (perfil de usuario)
│   │   └── 2026_02_05_* (fechas de procesamiento de videos)
│   ├── seeders/                     # Datos de prueba
│   │   ├── CivisSeeder.php
│   │   └── DatabaseSeeder.php
│   └── factories/                   # Factories para testing
│       └── UserFactory.php
│
├── 📂 public/                       # 🌐 FRONTEND ESTÁTICO (archivos públicos)
│   ├── css/
│   │   ├── styles.css               # Estilos principales (gradiente naranja/azul)
│   │   └── calendar.css             # Estilos específicos del calendario
│   │
│   ├── js/
│   │   ├── config.env.js            # Configuración de entorno
│   │   ├── config.js                # Configuración de la API (URL, endpoints)
│   │   ├── api.js                   # Funciones para llamar a la API REST
│   │   ├── auth.js                  # Login/logout/registro en frontend
│   │   ├── app.js                   # Lógica principal de la aplicación
│   │   ├── components.js            # Componentes HTML reutilizables
│   │   ├── selection.js             # Lógica de selección múltiple de videos
│   │   ├── videos.js                # Gestión de carga/edición de videos (admin)
│   │   ├── calendar.js              # Lógica del calendario de plazos
│   │   └── video-detail.js          # Detalle de video individual
│   │
│   ├── index.html                   # 🏠 Página principal (Videoteca de Trámites)
│   ├── login.html                   # 🔐 Formulario de inicio de sesión
│   ├── register.html                # 📝 Formulario de registro de usuario
│   ├── usuario.html                 # 👤 Perfil de usuario (editar datos)
│   ├── videos.html                  # 📹 Gestión de videos (Admin)
│   ├── calendario.html              # 📅 Lista de plazos burocráticos
│   ├── preguntasFrecuentes.html     # ❓ Preguntas frecuentes
│   ├── plantilla.html               # 📺 Plantilla para detalle de video
│   ├── robots.txt                   # SEO
│   └── index.php                    # Punto de entrada de Laravel
│
├── 📂 routes/
│   ├── api.php                      # Rutas de la API REST (/api/*)
│   ├── web.php                      # Rutas de páginas web
│   └── console.php                  # Comandos de consola
│
├── 📂 storage/                      # Almacenamiento de la aplicación
│   ├── app/                         # Archivos de aplicación
│   ├── framework/                   # Cache, sesiones, vistas compiladas
│   └── logs/                        # Archivos de registro
│
├── 📂 deploy/                       # Configuración de despliegue
│   ├── nginx/
│   │   └── conf.d/
│   │       └── civis.conf           # Config de Nginx (template con ${PORT})
│   └── supervisord.conf             # Config de Supervisor (Nginx + PHP-FPM)
│
├── .env                             # Variables de entorno (no subir a Git)
├── composer.json                    # Dependencias PHP
├── docker-compose.yml               # Configuración de contenedores
├── Dockerfile                       # Imagen Docker de la aplicación
├── README.md                        # Este archivo
└── artisan                          # CLI de Laravel
```

---

## 📄 Descripción de Archivos Importantes

### Frontend - Páginas HTML

| Archivo | Descripción | Función |
|---------|-------------|---------|
| `public/index.html` | **Página principal** | Videoteca con grid de trámites, búsqueda, sidebar con perfil y plazos cercanos |
| `public/login.html` | **Inicio de sesión** | Gradiente naranja/azul, tarjeta con formulario de autenticación |
| `public/register.html` | **Registro** | Formulario con nombre, email, DNI, teléfono, dirección, provincia |
| `public/usuario.html` | **Perfil de usuario** | Formulario editable de datos personales y cambio de contraseña |
| `public/videos.html` | **Gestión de videos (Admin)** | Interfaz para cargar, editar y eliminar videos (solo para admins) |
| `public/calendario.html` | **Calendario de plazos** | Lista completa de plazos burocráticos con indicadores activos/finalizados |
| `public/preguntasFrecuentes.html` | **FAQs** | Preguntas y respuestas sobre trámites comunes |
| `public/plantilla.html` | **Detalle de video** | Página para visualizar un video individual con información completa |

### Frontend - JavaScript

| Archivo | Función | Usado en |
|---------|---------|----------|
| `public/js/config.env.js` | Variables de entorno (API_URL, etc.) | Global |
| `public/js/config.js` | Configuración global de la API | Global |
| `public/js/api.js` | Funciones para llamadas REST (login, getVideos, getDeadlines, etc.) | Global |
| `public/js/auth.js` | Gestión de autenticación y sesiones | Global |
| `public/js/app.js` | Lógica principal: carga de datos, renderizado, navegación | index.html |
| `public/js/components.js` | Componentes reutilizables (tarjetas, items, etc.) | app.js, otros |
| `public/js/selection.js` | Lógica de selección múltiple de videos | videos.html |
| `public/js/videos.js` | Gestión de carga/edición/eliminación de videos (admin) | videos.html |
| `public/js/calendar.js` | Lógica de calendario y visualización de plazos | calendario.html |
| `public/js/video-detail.js` | Funcionalidad de detalle de video (reproducción, info) | plantilla.html |

### Frontend - CSS

| Archivo | Contenido |
|---------|-----------|
| `public/css/styles.css` | **Estilos principales**: variables CSS, gradientes, sidebar, tarjetas, formularios, responsive design |
| `public/css/calendar.css` | **Estilos del calendario**: grid de plazos, indicadores visuales, animaciones |

### Backend - Rutas API

#### Públicas (Sin autenticación)
- `GET /api/ping` - Ping de estado del servidor
- `GET /api/status` - Estado de la API y conexión a BD
- `GET /api/categories` - Listar todas las categorías
- `GET /api/videos` - Listar todos los videos con filtros
- `GET /api/videos/{id}` - Obtener detalles de un video
- `GET /api/faqs` - Listar todas las FAQs
- `GET /api/deadlines` - Listar todos los plazos
- `GET /api/deadlines/{id}` - Obtener detalles de un plazo
- `GET /api/calendar` - Ver calendario de plazos
- `GET /api/calendar/upcoming` - Próximos plazos

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener usuario actual (requiere token)
- `POST /api/auth/logout` - Cerrar sesión (requiere token)
- `GET /api/auth/user/profile` - Obtener perfil del usuario (requiere token)
- `PUT /api/auth/user/profile` - Actualizar perfil del usuario (requiere token)

#### Favoritos (Requiere autenticación)
- `GET /api/favorites` - Listar videos favoritos
- `GET /api/favorites/calendar` - Ver plazos de favoritos
- `GET /api/favorites/upcoming` - Próximos plazos de favoritos
- `POST /api/favorites/{videoId}/toggle` - Alternar favorito
- `GET /api/favorites/{videoId}/check` - Verificar si es favorito

#### Admin (Requiere autenticación + rol admin)
- `POST /api/videos` - Crear nuevo video
- `PUT /api/videos/{id}` - Actualizar video
- `DELETE /api/videos/{id}` - Eliminar video
- `DELETE /api/videos/bulk` - Eliminar múltiples videos
- `POST /api/categories` - Crear categoría
- `POST /api/uploads` - Cargar archivo
- `DELETE /api/uploads/{id}` - Eliminar archivo
- `GET /api/uploads` - Listar archivos cargados

### Backend - Controladores

| Archivo | Funcionalidad |
|---------|---------------|
| `app/Http/Controllers/Api/AuthController.php` | Autenticación: login, logout, registro, perfil de usuario |
| `app/Http/Controllers/Api/VideoController.php` | CRUD de videos: listar, mostrar, crear, editar, eliminar, eliminar en masa |
| `app/Http/Controllers/Api/CategoryController.php` | Gestión de categorías: listar, crear |
| `app/Http/Controllers/Api/DeadlineController.php` | Gestión de plazos: listar, mostrar, plazos próximos |
| `app/Http/Controllers/Api/FaqController.php` | Gestión de FAQs: listar, mostrar |
| `app/Http/Controllers/Api/FavoriteController.php` | Gestión de favoritos: listar, alternar, verificar |
| `app/Http/Controllers/Api/UploadController.php` | Gestión de subidas: listar, cargar, eliminar archivos |


---

## 🚀 Instalación y Configuración

### Requisitos Previos
- PHP 8.2 o superior
- Composer
- Node.js y NPM
- MySQL/PostgreSQL
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Atm0027/CIVIS.git
   cd CIVIS
   ```

2. **Instalar dependencias PHP**
   ```bash
   composer install
   ```

3. **Instalar dependencias Node.js**
   ```bash
   npm install
   ```

4. **Configurar el archivo de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y configura:
   - Conexión a base de datos
   - APP_KEY (se genera en el siguiente paso)
   - URL de la aplicación

5. **Generar clave de aplicación**
   ```bash
   php artisan key:generate
   ```

6. **Ejecutar migraciones**
   ```bash
   php artisan migrate
   ```

7. **Sembrar datos de prueba (opcional)**
   ```bash
   php artisan db:seed
   ```

8. **Compilar assets del frontend (opcional)**
   ```bash
   npm run dev
   # o para producción
   npm run build
   ```

9. **Iniciar el servidor de desarrollo**
   ```bash
   php artisan serve
   ```

10. **Acceder a la aplicación**
    - Backend API: `http://127.0.0.1:8000`
    - Frontend principal: `http://127.0.0.1:8000/index`
    - Login: `http://127.0.0.1:8000/login`

---

## 💻 Uso

### Acceso a la Aplicación

#### Interfaz Web (Frontend)
- **Página principal**: `/index` - Videoteca de trámites
- **Login**: `/login` - Iniciar sesión
- **Registro**: `/register` - Crear cuenta
- **Perfil de usuario**: `/usuario` - Editar datos personales
- **Gestión de videos (Admin)**: `/videos` - Subir/editar videos
- **Calendario**: `/calendario` - Ver plazos burocráticos
- **Preguntas frecuentes**: `/preguntasFrecuentes` - FAQs

#### API (Backend)
La API REST está disponible en `/api/*`. Ver sección de [Backend - Rutas API](#backend---rutas-api).

### Credenciales de Demo

Si has ejecutado los seeders, puedes usar:
```
Email: admin@civis.local
Contraseña: admin1234
```

Este usuario tiene rol **admin** y acceso completo a funcionalidades administrativas (crear/editar videos).

### Despliegue con Docker (Opcional)

Si prefieres ejecutar la aplicación en contenedores:

```bash
# Construir y levantar los contenedores
docker-compose up -d

# Ejecutar migraciones dentro del contenedor
docker-compose exec app php artisan migrate

# Ejecutar seeders
docker-compose exec app php artisan db:seed

# Ver logs
docker-compose logs -f app

# Detener contenedores
docker-compose down
```

---

## 🏗️ Arquitectura

### Modelo de Arquitectura

CIVIS utiliza una arquitectura **separada cliente-servidor**:

- **Frontend**: Aplicación HTML/CSS/JavaScript vanilla ejecutándose en el navegador del usuario
- **Backend**: API RESTful construida con Laravel 11 que gestiona datos y autenticación
- **Base de Datos**: MySQL/PostgreSQL para almacenamiento persistente

### Backend (Laravel)

Sigue el patrón **MVC** de Laravel:

- **Models** (Eloquent): Representan entidades de BD (User, Video, Category, Deadline, FAQ, Upload, Favorite)
- **Controllers** (API Resources): Gestionan la lógica de negocio y responden en JSON
- **Routes** (API): Definen endpoints públicos, autenticados y administrativos
- **Middleware**: Validación de tokens (Sanctum), roles (IsAdmin)
- **Resources**: Transforman modelos en respuestas JSON consistentes
- **Migrations**: Versionan la estructura de la BD

### Frontend (JavaScript Vanilla)

Modularizado en componentes independientes:

- **config files**: Configuración global y variables de entorno
- **api.js**: Capa de abstracción para llamadas HTTP (fetch API)
- **auth.js**: Gestión de sesiones y tokens JWT
- **app.js**: Lógica principal de inicialización y eventos
- **components.js**: Funciones para crear elementos HTML dinámicos
- **Páginas HTML**: Cada página (index.html, videos.html, etc.) maneja su propia UI

### Flujo de Autenticación

```
1. Usuario ingresa credenciales → Frontend (login.html)
   ↓
2. Frontend llama POST /api/auth/login → Backend (AuthController)
   ↓
3. Backend valida → Genera token JWT (Sanctum)
   ↓
4. Frontend almacena token en localStorage
   ↓
5. Peticiones posteriores incluyen: Authorization: Bearer {token}
   ↓
6. Middleware 'auth:sanctum' valida token en cada petición
   ↓
7. Usuario autenticado → Acceso a rutas protegidas
```

### Flujo de Datos - Videoteca

```
1. Usuario accede → index.html (frontend)
   ↓
2. JavaScript carga → GET /api/videos + GET /api/categories
   ↓
3. Backend retorna JSON → VideoController::index()
   ↓
4. Frontend renderiza → Grid de tarjetas en JavaScript
   ↓
5. Usuario selecciona video → Redirección a plantilla.html?id={id}
   ↓
6. Frontend carga → GET /api/videos/{id}
   ↓
7. Muestra detalle en plantilla.html con video-detail.js
```

### Seguridad

- **CORS**: Configurado en `config/cors.php` para permitir requests del frontend
- **Autenticación**: Laravel Sanctum con tokens bearer
- **Autorización**: Middleware `IsAdmin` para proteger rutas administrativas
- **Validación**: Todas las peticiones POST/PUT validadas en backend
- **Proteción de Páginas**: Frontend protege acceso a páginas autenticadas

---

---

## 🎨 Características del Diseño

### Sistema de Colores
- **Amarillo**: `#FEC544` - Color principal
- **Rojo**: `#CF2D33` - Acentos
- **Azul**: `#2563EB` - Links y estados
- **Sidebar**: `#1F2937` - Fondo oscuro
- **Background**: `#F9FAFB` - Fondo claro

### Responsive Design
- Mobile First
- Breakpoints optimizados
- Sidebar colapsable en móviles
- Grid adaptativo para tarjetas

---

## 🧪 Testing

```bash
# Ejecutar tests
php artisan test

# Con cobertura
php artisan test --coverage
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto utiliza el framework Laravel, que está licenciado bajo la [MIT license](https://opensource.org/licenses/MIT).

---

## 📞 Contacto

Para más información sobre el proyecto, contacta con el equipo de desarrollo.

---

## 🙏 Agradecimientos

- **Laravel**: Por proporcionar un framework PHP excepcional
- **Comunidad Open Source**: Por las herramientas y librerías utilizadas

---

## 📚 Recursos Adicionales

### Documentación de Laravel
- [Documentación oficial](https://laravel.com/docs)
- [Laracasts](https://laracasts.com) - Video tutoriales
- [Laravel News](https://laravel-news.com) - Noticias y artículos

### Recursos de JavaScript
- [MDN Web Docs](https://developer.mozilla.org/) - Documentación web
- [JavaScript.info](https://javascript.info/) - Tutorial moderno

---

**¡Bienvenido a CIVIS - Tu asistente burocrático digital! 🏛️**
