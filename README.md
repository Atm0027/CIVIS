# 🏛️ CIVIS - Tu Asistente Burocrático

## 📑 Tabla de Contenidos
- [Descripción](#-descripción)
- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Instalación y Uso](#-instalación-y-uso)
- [Credenciales de Demo](#-credenciales-de-demo)
- [Arquitectura](#-arquitectura)
- [Próximos Pasos](#-próximos-pasos)

---

## 🚀 Descripción

Civis es la plataforma digital que simplifica la burocracia en España, convirtiendo trámites complejos y llamadas interminables en procesos sencillos, visuales y accesibles 24/7 desde cualquier dispositivo.

En un entorno donde la burocracia es sinónimo de frustración, largas esperas y un lenguaje incomprensible, nuestra aplicación se erige como el asistente personal del ciudadano, ofreciendo una solución integral que mejora el acceso a la información burocrática en España.

---

## ✨ Características

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación completa
- **Inicio y cierre de sesión** seguro
- **Gestión de perfiles** con datos personales completos
- **Protección de páginas** con sistema de sesiones
- **Persistencia local** con localStorage

### �� Videoteca de Trámites
Guías audiovisuales paso a paso:
- Solicitar la Beca MEC
- Renovar el DNI
- Empadronarse
- Obtener el Certificado Digital
- Declaración de la RENTA
- Solicitar el NIE

### 📅 Calendario de Plazos
- Vista de plazos cercanos en sidebar
- Lista completa de todos los plazos
- Indicadores visuales de plazos activos/finalizados

### ❓ Preguntas Frecuentes
Respuestas claras a dudas burocráticas comunes

### 👤 Perfil de Usuario Completo
- **Información Personal**: Nombre, email, DNI/NIE, teléfono, fecha de nacimiento
- **Dirección**: Calle, localidad, código postal, provincia
- **Datos Relevantes**: Información adicional para personalización
- **Seguridad**: Cambio de contraseña, gestión de sesión

### 🔍 Búsqueda Avanzada
- Barra de búsqueda centrada y responsive
- Búsqueda por palabras completas
- Botón de limpiar búsqueda
- Contador de resultados en tiempo real

---

## 📁 Estructura del Proyecto

```
CIVIS/
│
├── 📄 index.html                    # Página principal (protegida)
│
├── 📂 pages/                        # Páginas de autenticación
│   ├── login.html                   # Inicio de sesión
│   └── register.html                # Registro de usuarios
│
├── 📂 css/                          # Estilos
│   └── styles.css                   # Estilos personalizados (~270 líneas)
│
├── 📂 js/                           # JavaScript
│   ├── auth.js                      # Sistema de autenticación (~340 líneas)
│   ├── config.js                    # Configuración (~65 líneas)
│   ├── utils.js                     # Utilidades (~200 líneas)
│   ├── data.js                      # Base de datos mock (~115 líneas)
│   ├── components.js                # Componentes UI (~180 líneas)
│   └── app.js                       # Lógica principal (~440 líneas)
│
├── 📂 assets/                       # Recursos (imágenes, iconos)
│
├── 📂 docs/                         # Documentación y backups
│   └── index_old.html               # Backup del archivo original
│
└── 📄 README.md                     # Este archivo
```

### Métricas del Código

| Archivo | Líneas | Funciones | Descripción |
|---------|--------|-----------|-------------|
| **pages/login.html** | ~145 | - | Página de inicio de sesión |
| **pages/register.html** | ~255 | - | Página de registro |
| **index.html** | ~313 | - | Página principal con perfil ampliado |
| **css/styles.css** | ~270 | - | Estilos personalizados + barra búsqueda |
| **js/auth.js** | ~340 | 15 | Sistema completo de autenticación |
| **js/config.js** | ~65 | - | Configuración centralizada |
| **js/utils.js** | ~200 | 14 | Funciones utilitarias |
| **js/data.js** | ~115 | - | Datos mock |
| **js/components.js** | ~180 | 11 | Componentes UI reutilizables |
| **js/app.js** | ~440 | 12 | Lógica principal + perfil |
| **TOTAL** | **~2,323** | **52** | **Completamente modular** |

---

## 🔐 Sistema de Autenticación

### Funcionalidades

#### Registro (`pages/register.html`)
- Validación de usuario (mínimo 3 caracteres)
- Validación de email
- Contraseñas seguras (mínimo 6 caracteres)
- Confirmación de contraseña
- Campos completos de perfil:
  - DNI/NIE (formato español validado)
  - Teléfono
  - Fecha de nacimiento
  - Dirección completa (calle, ciudad, CP, provincia)

#### Inicio de Sesión (`pages/login.html`)
- Login con usuario o email
- Sesión persistente (24 horas)
- Protección contra accesos no autorizados
- Redireccionamiento automático

#### Gestión de Perfil (`index.html`)
- Edición de todos los datos personales
- Actualización en tiempo real
- Validaciones de datos
- Botón de cerrar sesión

### Estructura de Usuario

```javascript
{
    id: "único",
    username: "usuario",
    email: "email@ejemplo.com",
    password: "hasheado",
    name: "Nombre Completo",
    dni: "12345678A",
    phone: "666777888",
    address: "Calle Principal 123",
    city: "Madrid",
    postalCode: "28001",
    province: "Madrid",
    country: "España",
    dateOfBirth: "1995-05-15",
    avatarUrl: "https://...",
    relevantData: "Datos adicionales",
    createdAt: "2025-11-12...",
    updatedAt: "2025-11-12...",
    isActive: true
}
```

### Seguridad

- ✅ Contraseñas hasheadas
- ✅ Validación de email
- ✅ Validación DNI formato español
- ✅ Sesiones con expiración (24h)
- ✅ Tokens únicos por sesión
- ✅ Protección de páginas con `requireAuth()`
- ✅ Sanitización de datos

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados
- **JavaScript ES6**: Lógica moderna
- **Tailwind CSS**: Framework de diseño
- **Google Fonts**: Tipografía Inter
- **LocalStorage**: Persistencia de datos
- **Git**: Control de versiones

---

## 📥 Instalación y Uso

### Opción 1: Abrir directamente
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Atm0027/CIVIS.git
   cd CIVIS
   ```

2. Abre `index.html` en tu navegador (te redirigirá a login)

3. Usa las credenciales de demo o crea una cuenta nueva

### Opción 2: Con servidor local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx http-server

# Luego abre: http://localhost:8000
```

---

## 🔑 Credenciales de Demo

```
Usuario: demo
Contraseña: demo123
```

Este usuario tiene datos precargados para explorar todas las funcionalidades.

---

## 🏗️ Arquitectura

### Módulos JavaScript

#### `js/auth.js` - Sistema de Autenticación
- `registerUser()`: Registro de usuarios
- `loginUser()`: Inicio de sesión
- `logoutUser()`: Cierre de sesión
- `getCurrentUser()`: Obtener usuario actual
- `isAuthenticated()`: Verificar autenticación
- `updateCurrentUser()`: Actualizar perfil
- `changePassword()`: Cambiar contraseña
- `requireAuth()`: Proteger páginas
- `redirectIfAuthenticated()`: Redirigir si autenticado

#### `js/app.js` - Lógica Principal
- `initializeApp()`: Inicialización
- `renderUserProfile()`: Renderiza perfil en sidebar
- `renderUpcomingDeadlines()`: Plazos cercanos
- `renderFeed()`: Videoteca de trámites
- `handleSearch()`: Búsqueda de videos
- `handleProfileSubmit()`: Guardar perfil
- `showPage()`: Navegación entre páginas
- `loadProfileData()`: Carga datos de perfil

#### `js/components.js` - Componentes UI
11 componentes reutilizables para la interfaz

#### `js/utils.js` - Utilidades
14 funciones helper (formateo, validación, localStorage, etc.)

#### `js/data.js` - Base de Datos Mock
Datos de ejemplo para desarrollo

#### `js/config.js` - Configuración
Variables de configuración centralizadas

### Flujo de Usuario

```
1. Usuario accede a index.html
   ↓
2. requireAuth() verifica sesión
   ↓
3a. SI autenticado → Carga aplicación
3b. NO autenticado → Redirige a pages/login.html
   ↓
4. Login exitoso → Redirige a index.html
   ↓
5. Usuario navega por la aplicación
   ↓
6. Edita perfil → Actualiza datos
   ↓
7. Cierra sesión → Redirige a login
```

---

## 🔮 Próximos Pasos

### Fase 1: Backend y Base de Datos
- [ ] API REST con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación JWT
- [ ] Integración con APIs gubernamentales

### Fase 2: Funcionalidades Avanzadas
- [ ] Notificaciones push de plazos
- [ ] Chat de asistente IA
- [ ] Sistema de favoritos
- [ ] Historial de trámites completados

### Fase 3: Expansión
- [ ] App móvil nativa (React Native)
- [ ] Integración con calendarios externos
- [ ] Sistema de recordatorios por email/SMS
- [ ] Multiidioma (catalán, euskera, gallego, inglés)

### Fase 4: Escalabilidad
- [ ] Cloud hosting (AWS/Azure)
- [ ] CDN para recursos estáticos
- [ ] Sistema de caché Redis
- [ ] Monitorización y analytics

---

## 👥 Contribución

¿Quieres contribuir? ¡Genial!

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👤 Autor

**Atm0027**
- GitHub: [@Atm0027](https://github.com/Atm0027)
- Email: atm00027@alu.medac.es

---

## 🙏 Agradecimientos

- A todos los que sufren la burocracia española
- A la comunidad open source
- A los usuarios que prueban y reportan issues

---

**¡Simplificando la burocracia, un trámite a la vez! 🎯**
