# INSTRUCCIONES RÁPIDAS PARA EL COMPAÑERO

## Problema
- Frontend no puede conectar con el backend
- Error: "Failed to fetch"

## Solución
El frontend ahora detecta automáticamente la URL según el entorno:
- Desarrollo: http://localhost:8000/api
- Producción: https://tu-dominio.com/api (automático)

Sin cambios en el backend.

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| public/js/config.js | Detección automática de URL |
| public/js/api.js | Mejor logging de errores |

---

## Pasos para Desplegar

1. Descargar/sincronizar los cambios
2. Subir a producción:
   - public/js/config.js
   - public/js/api.js
3. Verificar en consola (F12):
   ```javascript
   console.log(CONFIG.api.baseUrl);
   // Debe mostrar tu dominio, no localhost
   ```
4. Test de conexión:
   ```javascript
   fetch(CONFIG.api.baseUrl + '/videos')
       .then(r => r.json())
       .then(d => console.log('OK:', d))
       .catch(e => console.error('ERROR:', e));
   ```

---

## Si Falla

Verificar:
1. La URL base es correcta: console.log(CONFIG.api.baseUrl);
2. El backend está corriendo en esa URL
3. El servidor es accesible desde tu red

Si persiste el error, ver documentación completa en GUIA_CORS_PRODUCCION.md

