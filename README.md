# 🏛️ CIVIS - Tu Asistente Burocrático

## � Tabla de Contenidos
- [Descripción](#-descripción)
- [Características del MVP](#-características-del-mvp)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura Modular](#-arquitectura-modular)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Instalación y Uso](#-instalación-y-uso)
- [Público Objetivo](#-público-objetivo)
- [Próximos Pasos](#-próximos-pasos)

---

## 🚀 Descripción

## 🚀 Descripción

Civis es la plataforma digital que simplifica la burocracia en España, convirtiendo trámites complejos y llamadas interminables en procesos sencillos, visuales y accesibles 24/7 desde cualquier dispositivo.

En un entorno donde la burocracia es sinónimo de frustración, largas esperas y un lenguaje incomprensible, nuestra aplicación se erige como el asistente personal del ciudadano, ofreciendo una solución integral que mejora el acceso a la información burocrática en España.

---

## ✨ Características del MVP

1. **🎥 Videoteca de Trámites**: Guías audiovisuales paso a paso para trámites esenciales
   - Solicitar la Beca MEC
   - Renovar el DNI
   - Empadronarse
   - Obtener el Certificado Digital
   - Declaración de la RENTA
   - Solicitar el NIE

2. **📅 Calendario de Plazos**: Notificaciones sobre fechas límite importantes
   - Vista de plazos cercanos en sidebar
   - Lista completa de todos los plazos
   - Indicadores visuales de plazos activos/finalizados

3. **❓ Preguntas Frecuentes**: Respuestas claras a dudas burocráticas comunes
   - Explicaciones sobre empadronamiento
   - Diferencias entre Certificado Digital y Cl@ve
   - Información sobre NIE, RENTA, DNI

4. **👤 Perfil de Usuario**: Personalización basada en datos relevantes
   - Edición de información personal
   - Datos relevantes para mostrar contenido personalizado
   - Persistencia de preferencias

---

## 📁 Estructura del Proyecto

### Vista General

```
CIVIS/
│
├── 📄 index.html              ← Archivo HTML principal (MODULARIZADO)
├── 📄 index_old.html          ← Backup del archivo original
│
├── 📚 Documentación/
│   ├── README.md              ← Este archivo (documentación completa)
│   ├── ESTRUCTURA.md          ← Detalles técnicos adicionales
│   ├── RESUMEN_MODULARIZACION.md
│   ├── GUIA_RAPIDA.md         ← Guía de inicio rápido
│   └── .gitignore             ← Control de versiones
│
├── 🎨 css/
│   └── styles.css             ← Estilos personalizados (85 líneas)
│
├── ⚙️ js/
│   ├── config.js              ← Configuración de la aplicación
│   ├── utils.js               ← Funciones utilitarias (14 funciones)
│   ├── data.js                ← Base de datos simulada (mockDB)
│   ├── components.js          ← Componentes UI reutilizables
│   └── app.js                 ← Lógica principal de la aplicación
│
└── 📦 assets/                 ← Recursos (imágenes, iconos, etc.)
```

### Métricas del Código

| Archivo | Líneas | Funciones | Descripción |
|---------|--------|-----------|-------------|
| `index.html` | ~255 | 0 | Estructura HTML pura |
| `styles.css` | ~85 | 0 | Estilos CSS personalizados |
| `config.js` | ~65 | 0 | Configuración centralizada |
| `utils.js` | ~200 | 14 | Funciones utilitarias |
| `data.js` | ~115 | 0 | Datos mock (usuario, videos, calendario, FAQs) |
| `components.js` | ~180 | 11 | Componentes UI reutilizables |
| `app.js` | ~350 | 10 | Lógica principal |
| **TOTAL** | **~1,250** | **35** | **Completamente modular** |

---

## 🏗️ Arquitectura Modular

### Descripción de Módulos

#### 📄 **index.html**
- Estructura HTML semántica y limpia
- Sin estilos ni scripts inline
- Referencias ordenadas a archivos externos
- Sistema de páginas mediante clases `page-content`

#### 🎨 **css/styles.css**
Estilos personalizados que complementan Tailwind CSS:
- Fuente Inter aplicada globalmente
- Scrollbars personalizados
- Animaciones y transiciones suaves
- Estilos para enlaces de navegación
- Hover effects en tarjetas de video

#### ⚙️ **js/config.js**
Configuración centralizada:
- Información de la aplicación (nombre, versión, entorno)
- URLs de API para futuro backend
- Configuración de paginación y notificaciones
- Settings de búsqueda y localStorage
- Configuración de locale (es-ES) y formatos de fecha

#### 🛠️ **js/utils.js**
14 funciones utilitarias reutilizables:
- **Fechas**: `formatDate()`, `daysUntil()`, `isPastDate()`
- **Seguridad**: `sanitizeHTML()`, `validateEmail()`
- **UI**: `truncateText()`, `showToast()`, `debounce()`
- **Storage**: `saveToLocalStorage()`, `getFromLocalStorage()`, `removeFromLocalStorage()`
- **Filtrado**: `filterByMultipleFields()`, `sortByField()`
- **Otros**: `generateId()`

#### 💾 **js/data.js**
Base de datos simulada (mockDB):
```javascript
mockDB = {
    user: {
        name, email, avatarUrl, relevantData
    },
    videos: [
        { id, title, description, thumbnail, tags[] }
        // 6 videos de trámites
    ],
    calendar: [
        { date, title }
        // 6 plazos importantes
    ],
    faqs: [
        { q, a }
        // 5 preguntas frecuentes
    ]
}
```

#### 🎨 **js/components.js**
11 componentes UI reutilizables:
- `VideoCard()` - Tarjeta de video
- `DeadlineItem()` - Item de plazo
- `CalendarListItem()` - Item de calendario
- `FaqCard()` - Tarjeta de FAQ
- `TagBadge()` - Badge de etiqueta
- `SuccessMessage()` - Mensaje de éxito
- `ErrorMessage()` - Mensaje de error
- `SkeletonCard()` - Loader animado
- `EmptyState()` - Estado vacío
- `UserProfileSidebar()` - Perfil en sidebar
- `Modal()` - Modal genérico

#### ⚡ **js/app.js**
Lógica principal de la aplicación:

**Inicialización:**
- `initializeApp()` - Punto de entrada
- `getElements()` - Referencias del DOM
- `setupEventListeners()` - Configuración de eventos

**Renderizado:**
- `renderUserProfile()` - Perfil en sidebar
- `renderUpcomingDeadlines()` - Plazos cercanos
- `renderFeed()` - Grid de videos
- `renderCalendarPage()` - Lista completa de plazos
- `renderFaqPage()` - Lista de FAQs

**Navegación:**
- `showPage()` - Cambio entre páginas (Feed, Calendario, FAQs, Perfil)

**Handlers:**
- `handleSearch()` - Búsqueda en tiempo real
- `handleProfileSubmit()` - Guardar cambios de perfil

### Flujo de Datos

```
┌─────────────┐
│ index.html  │ ← Estructura HTML
└──────┬──────┘
       │
       ├─→ 📄 config.js      (Configuración global)
       │
       ├─→ 📄 utils.js       (Funciones auxiliares)
       │
       ├─→ 📄 data.js        (Mock Database)
       │        │
       │        ↓
       ├─→ 📄 components.js  (Componentes UI)
       │        │
       │        ↓
       └─→ 📄 app.js         (Lógica principal)
                │
                ↓
         Renderiza la UI
         Gestiona eventos
         Actualiza el DOM
```

### Orden de Carga de Scripts

```html
<!-- Orden correcto en index.html -->
<script src="js/config.js"></script>      <!-- 1. Configuración -->
<script src="js/utils.js"></script>       <!-- 2. Utilidades -->
<script src="js/data.js"></script>        <!-- 3. Datos -->
<script src="js/components.js"></script>  <!-- 4. Componentes -->
<script src="js/app.js"></script>         <!-- 5. Lógica principal -->
```

---

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Actual)
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos personalizados y animaciones
- **JavaScript (ES6+)**: Lógica de la aplicación
- **Tailwind CSS (CDN)**: Framework CSS utility-first para diseño rápido
- **Google Fonts**: Fuente Inter para tipografía moderna

### Backend (Planificado)
- **PHP**: Lógica del servidor y API REST
- **PostgreSQL**: Base de datos relacional
- **JWT**: Autenticación y autorización

### Despliegue (Planificado)
- **AWS EC2**: Servidor de aplicaciones
- **AWS RDS**: Base de datos PostgreSQL gestionada
- **CI/CD Pipeline**: Integración y despliegue continuos
- **HTTPS/SSL**: Certificados de seguridad

---

## 🚦 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Opcionalmente: Python 3, PHP o Node.js para servidor local

### Instalación

1. **Clonar o descargar el proyecto:**
```bash
cd /Users/ftorres/Desktop/CIVIS
```

2. **Abrir directamente:**
```bash
# Opción A: Doble clic en index.html desde el Finder

# Opción B: Desde terminal
open index.html
```

3. **O iniciar servidor local (recomendado):**

```bash
# Con Python 3
python3 -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con PHP
php -S localhost:8000

# Con Node.js (requiere http-server)
npx http-server -p 8000
```

Luego abre en el navegador: `http://localhost:8000`

### Uso de la Aplicación

1. **Explorar Videoteca**: Navega por los videos de trámites en la página principal
2. **Buscar Trámites**: Usa la barra de búsqueda para filtrar por nombre o tags
3. **Ver Calendario**: Consulta todos los plazos importantes
4. **Leer FAQs**: Resuelve dudas comunes sobre burocracia
5. **Editar Perfil**: Personaliza tu información para contenido relevante

### Verificación de Funcionamiento

✅ **Checklist:**
- [ ] Se carga el logo "Civis" con badge MVP
- [ ] Aparece el perfil de usuario (Juan Pérez)
- [ ] Se muestran 6 tarjetas de videos
- [ ] Sidebar muestra plazos cercanos
- [ ] Búsqueda filtra correctamente
- [ ] Navegación entre páginas funciona
- [ ] Editar perfil guarda cambios
- [ ] Responsive funciona en móvil

---

## 🎯 Público Objetivo

### Usuarios Principales

1. **👨‍🎓 Estudiantes y Jóvenes**
   - Primera vez realizando trámites burocráticos
   - Necesitan guías claras y paso a paso
   - Familiarizados con tecnología digital

2. **� Población Inmigrante**
   - Barreras lingüísticas
   - Desconocimiento del sistema español
   - Necesitan información accesible y visual

3. **👴 Adultos Mayores**
   - Conocimientos burocráticos anticuados
   - Poca familiaridad con trámites online
   - Requieren explicaciones simples

4. **💼 Autónomos y Startups**
   - Trámites empresariales complejos
   - Necesitan optimizar tiempo
   - Requieren información precisa sobre plazos

### Necesidades que Cubrimos
- ✅ Información clara y accesible 24/7
- ✅ Guías visuales paso a paso
- ✅ Recordatorios de plazos importantes
- ✅ Lenguaje sencillo y comprensible
- ✅ Acceso desde cualquier dispositivo

---

## � Características Responsive

La aplicación está completamente optimizada para:

### 📱 **Móvil** (320px - 767px)
- Sidebar colapsable con menú hamburguesa
- Grid de videos en 1 columna
- Navegación táctil optimizada
- Overlay para cerrar sidebar

### 📱 **Tablet** (768px - 1023px)
- Sidebar visible pero colapsable
- Grid de videos en 2 columnas
- Experiencia híbrida móvil/desktop

### 💻 **Desktop** (1024px+)
- Sidebar fija siempre visible
- Grid de videos en 3 columnas
- Máximo aprovechamiento del espacio
- Hover effects mejorados

---

## 🚀 Ventajas de la Arquitectura Modular

### ✅ Mantenibilidad
- Código organizado por responsabilidades
- Fácil localizar y corregir bugs
- Cada archivo tiene un propósito claro
- Comentarios descriptivos en el código

### ✅ Escalabilidad
- Fácil agregar nuevas funcionalidades
- Estructura preparada para integración con backend
- Sistema de componentes reutilizables
- Configuración centralizada

### ✅ Colaboración
- Múltiples desarrolladores trabajando simultáneamente
- Menos conflictos en Git
- Revisiones de código más sencillas
- División clara de tareas

### ✅ Reutilización
- 14 funciones utilitarias compartidas
- 11 componentes UI reutilizables
- Configuración global accesible
- Datos mock fácilmente extensibles

### ✅ Performance
- Posibilidad de lazy loading
- Caché de navegador más eficiente
- Minificación por archivo
- Optimización selectiva

### ✅ Testing
- Funciones aisladas fáciles de testear
- Unit tests por módulo
- Mocks más sencillos
- Integración continua preparada

---

---

## 🔄 Próximos Pasos

### Fase 1 - Backend e Integración (Corto Plazo)
- [ ] Implementar API REST en PHP
- [ ] Conectar con base de datos PostgreSQL
- [ ] Sistema de autenticación de usuarios (JWT)
- [ ] Gestión de contenido de videos (CRUD)
- [ ] Sistema de subida de archivos
- [ ] Migraciones de base de datos

### Fase 2 - Funcionalidades Avanzadas (Medio Plazo)
- [ ] Sistema de notificaciones por email/SMS
- [ ] Calendario interactivo real (FullCalendar.js)
- [ ] Reproductor de video integrado (Video.js)
- [ ] Sistema de favoritos y guardados
- [ ] Historial de trámites completados
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Sistema de comentarios y valoraciones
- [ ] Compartir en redes sociales

### Fase 3 - Optimización y Escalabilidad (Largo Plazo)
- [ ] PWA (Progressive Web App) para instalación
- [ ] Modo offline con Service Workers
- [ ] Chat de soporte en tiempo real
- [ ] Panel de administración completo
- [ ] Analytics y métricas de uso
- [ ] A/B Testing de funcionalidades
- [ ] Multiidioma (Español, Inglés, Catalán, etc.)
- [ ] Accesibilidad mejorada (WCAG 2.1)

### Fase 4 - Despliegue en Producción
- [ ] Configurar AWS EC2 con autoscaling
- [ ] Configurar AWS RDS para PostgreSQL
- [ ] Implementar CI/CD con GitHub Actions
- [ ] Configurar dominio personalizado y DNS
- [ ] Instalar certificados SSL/HTTPS
- [ ] Configurar CDN para assets estáticos
- [ ] Monitoreo y logging (CloudWatch)
- [ ] Backup automático de base de datos

---

## � Documentación Adicional

- **GUIA_RAPIDA.md**: Guía de inicio rápido y troubleshooting
- **ESTRUCTURA.md**: Detalles técnicos profundos de la arquitectura
- **RESUMEN_MODULARIZACION.md**: Historial de cambios y modularización

---

## 🤝 Contribuciones

Este es un proyecto MVP (Minimum Viable Product). Las contribuciones son bienvenidas.

### Cómo Contribuir
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Usar nombres descriptivos en español
- Comentar funciones complejas
- Seguir la estructura modular existente
- Probar antes de hacer commit

---

## � Reporte de Bugs

Si encuentras un bug, por favor:
1. Verifica que no esté ya reportado en Issues
2. Incluye pasos para reproducirlo
3. Adjunta capturas de pantalla si es relevante
4. Indica navegador y versión

---

## 📄 Licencia

[Por definir]

---

## 📞 Contacto

**Proyecto**: CIVIS - Tu Asistente Burocrático  
**Versión**: 1.0.0 MVP  
**Estado**: ✅ En desarrollo activo  
**Última actualización**: 12 de noviembre de 2025

---

## 🎉 Agradecimientos

Gracias por tu interés en CIVIS. Este proyecto nace de la necesidad de simplificar la burocracia en España y hacerla accesible para todos.

**¡Juntos podemos hacer la burocracia más humana! 🏛️✨**

---

