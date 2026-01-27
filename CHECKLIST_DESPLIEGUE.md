# CHECKLIST FINAL PARA DESPLEGAR EN PRODUCCIÓN

## Objetivo
Que el frontend se comunique correctamente con el backend en producción.

---

## Cambios Realizados

El frontend ahora detecta automáticamente la URL del backend:
- public/js/config.js - Detecta automáticamente según el dominio
- public/js/api.js - Mejor manejo de errores de conexión

Backend: Sin cambios necesarios.

---

## Pasos para Desplegar

### Paso 1: Descargar/Sincronizar

```bash
git pull origin main
```

### Paso 2: Subir a Producción

Solo necesitas subir:
- public/js/config.js
- public/js/api.js

### Paso 3: Verificar en Navegador

1. Abre tu sitio: https://tu-dominio.com
2. Abre Consola (F12)
3. Ejecuta:
   ```javascript
   console.log(CONFIG.api.baseUrl);
   ```
   Debe mostrar: https://tu-dominio.com/api (no localhost)

---

## Pruebas

### Test 1: URL correcta

```javascript
console.log(CONFIG.api.baseUrl);
// Esperado: https://tu-dominio.com/api
```

### Test 2: Conexión

```javascript
fetch(CONFIG.api.baseUrl + '/videos')
    .then(r => r.json())
    .then(d => console.log('OK:', d))
    .catch(e => console.error('ERROR:', e));
```

### Test 3: Network Tab

1. F12 → Network
2. Haz una petición
3. Verifica que la URL es correcta

---

## Solucionar Problemas

### Error: "Failed to fetch"

Causas:
- Backend no está accesible en esa URL
- La URL detectada es incorrecta
- Problema de red

Verificar:
1. Consola: console.log(CONFIG.api.baseUrl);
2. Backend está corriendo en esa URL
3. El servidor es accesible

### Error: 401 Unauthorized

Causa: Token inválido o expirado

Solución:
```javascript
console.log(localStorage.getItem('civis_auth_token'));
// Si está vacío, hacer login de nuevo
```

### Error: 200 pero sin datos

Causa: Normal, el backend responde pero no tiene datos.

Verificar que hay datos en la base de datos del backend.

---

## Checklist Final

- [ ] Cambios descargados/sincronizados
- [ ] public/js/config.js y api.js subidos a producción
- [ ] Consola muestra URL correcta
- [ ] Test de conexión funciona
- [ ] Login funciona
- [ ] Datos se cargan correctamente

---

Listo para producción.
