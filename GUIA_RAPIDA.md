# 🚀 GUÍA RÁPIDA - CIVIS

## ⚡ Inicio Rápido

### 1. Abrir el Proyecto
```bash
cd /Users/ftorres/Desktop/CIVIS
```

### 2. Abrir en el Navegador
**Opción A - Doble clic:**
- Busca el archivo `index.html` en Finder
- Haz doble clic para abrirlo en tu navegador predeterminado

**Opción B - Desde terminal:**
```bash
open index.html
```

**Opción C - Servidor local (recomendado para desarrollo):**
```bash
# Con Python 3
python3 -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

---

## ✅ Verificación de Funcionamiento

### 1. Comprueba que se carga correctamente
- ✅ Se ve el logo "Civis" con badge "MVP"
- ✅ Se muestra el perfil de usuario (Juan Pérez)
- ✅ Aparecen 6 tarjetas de videos
- ✅ La barra lateral muestra plazos cercanos

### 2. Prueba la Navegación
- ✅ Click en "Inicio / Feed" → Muestra videoteca
- ✅ Click en "Calendario de Plazos" → Muestra todos los plazos
- ✅ Click en "Preguntas Frecuentes" → Muestra FAQs
- ✅ Click en "Editar Perfil" → Muestra formulario de perfil

### 3. Prueba la Búsqueda
- ✅ Escribe "DNI" → Muestra solo el video de DNI
- ✅ Escribe "beca" → Muestra videos relacionados con becas
- ✅ Borra la búsqueda → Muestra todos los videos

### 4. Prueba el Perfil
- ✅ Click en "Editar Perfil"
- ✅ Cambia nombre, email y datos relevantes
- ✅ Click en "Guardar Cambios"
- ✅ Verifica que aparece mensaje de éxito
- ✅ Verifica que el perfil se actualiza en la sidebar

### 5. Responsive (Móvil)
- ✅ Reduce el tamaño de la ventana
- ✅ Verifica que la sidebar se oculta
- ✅ Aparece el botón de menú hamburguesa
- ✅ Click en el botón → La sidebar se muestra
- ✅ Click fuera o en la X → La sidebar se oculta

---

## 🐛 Solución de Problemas

### Problema: No se ven los estilos
**Causa:** Archivos CSS no encontrados
**Solución:**
```bash
# Verifica que existe el archivo
ls -la css/styles.css

# Verifica la ruta en index.html
grep "styles.css" index.html
```

### Problema: JavaScript no funciona
**Causa:** Scripts no cargados o errores en consola
**Solución:**
1. Abre las DevTools (F12 o Cmd+Option+I)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Verifica que todos los scripts existen:
```bash
ls -la js/
```

### Problema: "Cannot find mockDB"
**Causa:** Scripts en orden incorrecto
**Solución:**
Verifica el orden en `index.html`:
```html
<script src="js/config.js"></script>
<script src="js/utils.js"></script>
<script src="js/data.js"></script>      <!-- Debe estar ANTES de app.js -->
<script src="js/components.js"></script>
<script src="js/app.js"></script>
```

### Problema: Elementos no se renderizan
**Causa:** IDs incorrectos o JavaScript con errores
**Solución:**
1. Abre DevTools → Console
2. Escribe `mockDB` y presiona Enter
3. Debe mostrar el objeto con datos
4. Si no aparece, revisa `data.js`

---

## 🔍 Inspeccionar el Código

### Ver Variables Globales (en Console)
```javascript
// Ver configuración
console.log(CONFIG);

// Ver datos mock
console.log(mockDB);

// Ver usuario actual
console.log(currentUser);
```

### Probar Funciones (en Console)
```javascript
// Probar formateo de fecha
formatDate(new Date(), 'short');

// Probar días hasta fecha
daysUntil('2025-12-25');

// Probar validación de email
validateEmail('test@example.com');

// Ver componente de video
console.log(VideoCard(mockDB.videos[0]));
```

---

## 📊 Estructura de Archivos

```
CIVIS/
├── index.html              ← ⭐ ABRE ESTE ARCHIVO
├── index_old.html          ← Backup
├── README.md               ← Documentación
├── ESTRUCTURA.md           ← Detalles técnicos
├── RESUMEN_MODULARIZACION.md
├── GUIA_RAPIDA.md         ← 📍 ESTÁS AQUÍ
│
├── css/
│   └── styles.css
│
├── js/
│   ├── config.js
│   ├── utils.js
│   ├── data.js
│   ├── components.js
│   └── app.js
│
└── assets/
```

---

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `css/styles.css` o usa las clases de Tailwind en `index.html`

### Agregar más Videos
Edita `js/data.js`:
```javascript
videos: [
    // ... videos existentes
    {
        id: 7,
        title: "Tu nuevo video",
        description: "Descripción...",
        thumbnail: "https://placehold.co/600x400",
        tags: ["tag1", "tag2"]
    }
]
```

### Agregar más Plazos
Edita `js/data.js`:
```javascript
calendar: [
    // ... plazos existentes
    { date: "2026-04-15", title: "Nuevo plazo" }
]
```

### Agregar más FAQs
Edita `js/data.js`:
```javascript
faqs: [
    // ... faqs existentes
    {
        q: "¿Tu pregunta?",
        a: "Tu respuesta..."
    }
]
```

---

## 🚀 Pasar a Producción

### 1. Configurar para Producción
Edita `js/config.js`:
```javascript
app: {
    environment: "production",
    debug: false
},
api: {
    baseUrl: "https://tu-dominio.com/api"
}
```

### 2. Optimizar
```bash
# Minificar JavaScript (requiere terser)
npm install -g terser
terser js/app.js -o js/app.min.js

# Minificar CSS (requiere cssnano)
npm install -g cssnano-cli
cssnano css/styles.css css/styles.min.css
```

### 3. Actualizar referencias en index.html
```html
<link rel="stylesheet" href="css/styles.min.css">
<script src="js/app.min.js"></script>
```

---

## 📱 Testing Responsive

### Tamaños de Pantalla Recomendados

**Desktop:**
- 1920x1080 (Full HD)
- 1440x900 (MacBook Pro)
- 1366x768 (Laptop estándar)

**Tablet:**
- 1024x768 (iPad)
- 768x1024 (iPad vertical)

**Móvil:**
- 375x667 (iPhone SE)
- 414x896 (iPhone 11)
- 360x640 (Android estándar)

### En Chrome DevTools:
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Selecciona diferentes dispositivos
3. Verifica que todo funciona correctamente

---

## 🔐 Seguridad (Futuro)

Cuando integres con backend:
- ✅ Sanitiza todas las entradas de usuario
- ✅ Usa HTTPS siempre
- ✅ Implementa autenticación JWT
- ✅ Valida en servidor, no solo en cliente
- ✅ Protege contra XSS y CSRF

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Consulta `ESTRUCTURA.md` para detalles técnicos
3. Revisa `README.md` para información general

---

## ✅ Checklist Antes de Desplegar

- [ ] Todas las funcionalidades probadas
- [ ] Sin errores en consola
- [ ] Responsive en todos los dispositivos
- [ ] Imágenes optimizadas
- [ ] Código minificado
- [ ] HTTPS configurado
- [ ] Dominio configurado
- [ ] Analytics integrado (opcional)
- [ ] SEO optimizado (meta tags)
- [ ] Favicon agregado

---

**¡Disfruta construyendo CIVIS! 🏛️**

---

Última actualización: 12 de noviembre de 2025
