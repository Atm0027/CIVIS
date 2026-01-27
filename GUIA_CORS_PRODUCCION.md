# GUÍA: Detección Automática de URLs

## Problema Original

El frontend estaba configurado con URL hardcodeada a http://localhost:8000/api.

En producción, necesitaba detectar automáticamente la URL real del dominio.

---

## Solución Implementada

### Función getApiBaseUrl() en config.js

```javascript
function getApiBaseUrl() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';
    }

    return `${protocol}//${hostname}/api`;
}
```

Esta función:
1. Detecta el dominio donde está ejecutándose el frontend
2. Detecta si usa HTTP o HTTPS
3. Construye la URL de la API automáticamente

---

## Cómo Funciona

En desarrollo (http://localhost:8000):
- Detecta: hostname = localhost
- Usa: http://localhost:8000/api

En producción (https://midominio.com):
- Detecta: hostname = midominio.com, protocol = https
- Usa: https://midominio.com/api

---

## Pasos para Usar

### 1. Descargar/Sincronizar

```bash
git pull origin main
```

### 2. Subir a Producción

Solo subir:
- public/js/config.js
- public/js/api.js

### 3. Verificar en Consola

```javascript
console.log(CONFIG.api.baseUrl);
// En localhost: http://localhost:8000/api
// En producción: https://tu-dominio.com/api
```

### 4. Test de Conexión

```javascript
fetch(CONFIG.api.baseUrl + '/videos')
    .then(r => r.json())
    .then(d => console.log('OK:', d))
    .catch(e => console.error('ERROR:', e));
```

---

## Checklist de Configuración

- [ ] Frontend actualizado: config.js con getApiBaseUrl()
- [ ] Archivos sincronizados y subidos a producción
- [ ] Test en consola: URL correcta
- [ ] Test de petición: Conecta con backend
- [ ] Backend accesible en la URL configurada
- [ ] Login funciona
- [ ] Datos se cargan correctamente

---

## Troubleshooting

### "Failed to fetch"

Causas posibles:
1. Backend no está accesible en esa URL
2. URL detectada es incorrecta
3. Problema de red o firewall

Verificar:
```javascript
console.log(CONFIG.api.baseUrl);
// Debe mostrar tu dominio, no localhost
```

### URL es localhost en producción

Causa: No sincronizaste los cambios correctamente

Solución:
1. Descarga nuevamente: git pull origin main
2. Limpia cache: Ctrl+Shift+Delete
3. Recarga: F5

### 401 en peticiones autenticadas

Token expirado o inválido. Hacer login de nuevo.

---

## Detalles Técnicos

### Variables Utilizadas

- window.location.hostname: Dominio actual
- window.location.protocol: http: o https:

### Lógica de Detección

Si el hostname es localhost o 127.0.0.1:
- Usa la URL de desarrollo: http://localhost:8000/api

Si es cualquier otro dominio:
- Usa el protocolo detectado + hostname + /api

---

## Archivos Modificados

- public/js/config.js - Función getApiBaseUrl()
- public/js/api.js - Mejor manejo de errores

Sin cambios en el backend.

---

Listo para producción.
