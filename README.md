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
│   │   └── Controllers/Api/         # Controladores de la API REST
│   │       ├── AuthController.php   # Login, logout, registro
│   │       ├── VideoController.php  # CRUD de videos
│   │       ├── CategoryController.php
│   │       ├── DeadlineController.php
│   │       └── FaqController.php
│   └── Models/                      # Modelos Eloquent (User, Video, etc.)
│
├── 📂 database/
│   ├── migrations/                  # Estructura de tablas de BD
│   ├── seeders/                     # Datos de prueba
│   └── database.sqlite              # Base de datos SQLite local
│
├── 📂 public/                       # 🌐 FRONTEND ESTÁTICO (archivos públicos)
│   ├── css/
│   │   └── styles.css               # Estilos principales (gradiente naranja/azul)
│   ├── js/
│   │   ├── config.js                # Configuración de la API (URL, endpoints)
│   │   ├── api.js                   # Funciones para llamar a la API REST
│   │   ├── auth.js                  # Login/logout/registro en frontend
│   │   ├── app.js                   # Lógica principal (cargar videos, plazos)
│   │   ├── components.js            # Componentes HTML reutilizables
│   │   └── utils.js                 # Utilidades (formatear fechas, debounce)
│   │
│   ├── index.html                   # 🏠 Página principal (Videoteca de Trámites)
│   ├── login.html                   # 🔐 Formulario de inicio de sesión
│   ├── register.html                # 📝 Formulario de registro de usuario
│   ├── usuario.html                 # 👤 Perfil de usuario (editar datos)
│   ├── calendario.html              # 📅 Lista de plazos burocráticos
│   ├── preguntasFrecuentes.html     # ❓ Preguntas frecuentes
│   └── index.php                    # Punto de entrada de Laravel
│
├── 📂 resources/views/              # Vistas Blade (versión dinámica)
│   ├── index.blade.php              # Página principal con asset()
│   ├── login.blade.php              # Login con rutas Blade
│   ├── register.blade.php           # Registro con validación
│   ├── usuario.blade.php            # Perfil de usuario
│   ├── calendario.blade.php         # Calendario de plazos
│   └── preguntasFrecuentes.blade.php
│
├── 📂 routes/
│   ├── web.php                      # Rutas de páginas web
│   └── api.php                      # Rutas de la API REST (/api/*)
│
├── .env                             # Variables de entorno (no subir a Git)
├── composer.json                    # Dependencias PHP
├── package.json                     # Dependencias Node.js
└── vite.config.js                   # Configuración del bundler
```

---

## 📄 Descripción de Archivos Importantes

### Frontend - Páginas HTML

| Archivo | Descripción | Contenido Visual |
|---------|-------------|------------------|
| `public/index.html` | **Página principal** | Sidebar oscuro con perfil de usuario, buscador, grid de tarjetas "Videoteca de Trámites" |
| `public/login.html` | **Inicio de sesión** | Gradiente naranja/azul, tarjeta blanca centrada con formulario |
| `public/register.html` | **Registro** | Formulario completo: nombre, email, DNI, teléfono, dirección |
| `public/usuario.html` | **Perfil de usuario** | Formulario editable con datos personales y opción de cambiar contraseña |
| `public/calendario.html` | **Calendario de plazos** | Lista de fechas importantes con indicador abierto/cerrado |
| `public/preguntasFrecuentes.html` | **FAQs** | Preguntas y respuestas sobre trámites comunes |

### Frontend - JavaScript

| Archivo | Función |
|---------|---------|
| `public/js/config.js` | Define `CONFIG` con URL de API (`http://localhost:8000/api`), endpoints y opciones |
| `public/js/api.js` | Funciones `fetchAPI()`, `login()`, `getVideos()`, `getDeadlines()`, etc. |
| `public/js/auth.js` | Gestión de sesión: `loginUser()`, `logoutUser()`, `isAuthenticated()`, `redirectIfAuthenticated()` |
| `public/js/app.js` | Inicialización de la app, carga de datos, eventos de navegación, renderizado de tarjetas |
| `public/js/components.js` | Componentes HTML: `VideoCard()`, `DeadlineItem()`, `FaqCard()`, `ErrorMessage()` |
| `public/js/utils.js` | Utilidades: `formatDate()`, `debounce()`, `validateEmail()`, `sanitizeHTML()` |

### Frontend - CSS

| Archivo | Contenido |
|---------|-----------|
| `public/css/styles.css` | **Estilos completos** del frontend: variables CSS, gradientes, sidebar oscuro, tarjetas, formularios, responsive design |

### Backend - Rutas

| Archivo | Rutas Definidas |
|---------|-----------------|
| `routes/web.php` | `/`, `/index`, `/login`, `/register`, `/usuario`, `/calendario`, `/preguntas-frecuentes` |
| `routes/api.php` | `/api/login`, `/api/videos`, `/api/categories`, `/api/faqs`, `/api/deadlines`, `/api/me` |

### Backend - Controladores

| Archivo | Funcionalidad |
|---------|---------------|
| `app/Http/Controllers/Api/AuthController.php` | Login, logout, obtener usuario actual |
| `app/Http/Controllers/Api/VideoController.php` | Listar y filtrar videos por categoría |
| `app/Http/Controllers/Api/CategoryController.php` | Listar categorías de trámites |
| `app/Http/Controllers/Api/DeadlineController.php` | Listar plazos burocráticos |
| `app/Http/Controllers/Api/FaqController.php` | Listar preguntas frecuentes |


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
- **Página principal**: `/index`
- **Login**: `/login`
- **Registro**: `/register`
- **Perfil de usuario**: `/usuario`
- **Calendario**: `/calendario`
- **Preguntas frecuentes**: `/preguntas-frecuentes`

#### API (Backend)
La API REST está disponible en `/api/*`. Ver sección de [API Endpoints](#-api-endpoints).

### Credenciales de Demo

Si has ejecutado los seeders, puedes usar:
```
Email: admin@civis.local
Contraseña: admin1234
```

---

## 🏗️ Arquitectura

### Backend (Laravel)

El backend sigue el patrón **MVC** (Model-View-Controller) de Laravel:

- **Models**: Representan las entidades de la base de datos (User, Video, Category, Deadline, FAQ)
- **Controllers**: Gestionan la lógica de negocio y responden a las peticiones HTTP
- **Views**: Plantillas Blade que renderizan el HTML
- **Routes**: Definen los endpoints tanto para web como para API

### Frontend (JavaScript Vanilla)

El frontend está modularizado en varios archivos:

- **config.js**: Configuración global (URLs, constantes)
- **api.js**: Funciones para comunicarse con la API
- **auth.js**: Gestión de autenticación (login, logout, registro)
- **components.js**: Componentes reutilizables de UI
- **utils.js**: Funciones de utilidad
- **app.js**: Lógica principal de la aplicación

### Flujo de Datos

```
Usuario → Frontend (HTML/CSS/JS) → API (Laravel) → Base de Datos
                                    ↓
                               Respuesta JSON
```

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/register` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión
- `GET /api/me` - Obtener usuario autenticado

### Categorías
- `GET /api/categories` - Listar todas las categorías

### Videos
- `GET /api/videos` - Listar todos los videos
- `GET /api/videos?category={slug}` - Filtrar videos por categoría
- `GET /api/videos/{id}` - Obtener detalles de un video

### Plazos (Deadlines)
- `GET /api/deadlines` - Listar todos los plazos
- `GET /api/deadlines/{id}` - Obtener detalles de un plazo

### Preguntas Frecuentes
- `GET /api/faqs` - Listar todas las FAQs
- `GET /api/faqs/{id}` - Obtener detalles de una FAQ

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
