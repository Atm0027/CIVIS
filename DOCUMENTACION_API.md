# 📡 Documentación de la API - CIVIS

> **Base URL:** `http://localhost:8000/api`  
> **Formato:** JSON  
> **Autenticación:** Bearer Token (Laravel Sanctum)

---

## 📑 Índice

1. [Autenticación](#-autenticación)
2. [Categorías](#-categorías)
3. [Videos / Trámites](#-videos--trámites)
4. [Preguntas Frecuentes (FAQs)](#-preguntas-frecuentes-faqs)
5. [Calendario / Plazos](#-calendario--plazos)
6. [Perfil de Usuario](#-perfil-de-usuario)
7. [Uploads (Archivos)](#-uploads-archivos)
8. [Códigos de Error](#-códigos-de-error)

---

## 🔐 Autenticación

### POST `/api/auth/register`
**Descripción:** Registra un nuevo usuario en el sistema.

**Cuerpo de la petición:**
```json
{
    "username": "juan_perez",
    "name": "Juan",
    "surname": "Pérez",
    "email": "juan@ejemplo.com",
    "password": "miPassword123",
    "dni": "12345678A",
    "phone": "600123456",
    "dateOfBirth": "1990-05-15",
    "address": "Calle Mayor 10",
    "city": "Madrid",
    "postalCode": "28001",
    "province": "Madrid"
}
```

**Respuesta exitosa (201):**
```json
{
    "token": "1|abc123...",
    "user": {
        "id": 1,
        "username": "juan_perez",
        "name": "Juan",
        "surname": "Pérez",
        "email": "juan@ejemplo.com",
        "role": "user"
    }
}
```

**Campos obligatorios:** `username`, `name`, `email`, `password`

---

### POST `/api/auth/login`
**Descripción:** Inicia sesión con usuario/email y contraseña.

**Cuerpo de la petición:**
```json
{
    "login": "juan@ejemplo.com",
    "password": "miPassword123"
}
```

> **Nota:** El campo `login` acepta tanto email como nombre de usuario.

**Respuesta exitosa (200):**
```json
{
    "token": "2|xyz789...",
    "user": {
        "id": 1,
        "username": "juan_perez",
        "name": "Juan",
        "surname": "Pérez",
        "dni": "12345678A",
        "email": "juan@ejemplo.com",
        "role": "user"
    }
}
```

**Error (401):**
```json
{
    "message": "Credenciales incorrectas"
}
```

---

### POST `/api/auth/logout`
**Descripción:** Cierra la sesión del usuario actual.

**Requiere:** Token de autenticación

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
    "message": "OK"
}
```

---

### GET `/api/auth/me`
**Descripción:** Obtiene los datos del usuario autenticado.

**Requiere:** Token de autenticación

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
    "user": {
        "id": 1,
        "username": "juan_perez",
        "name": "Juan",
        "surname": "Pérez",
        "email": "juan@ejemplo.com",
        "dni": "12345678A",
        "phone": "600123456",
        "dateOfBirth": "1990-05-15",
        "address": "Calle Mayor 10",
        "city": "Madrid",
        "postalCode": "28001",
        "province": "Madrid",
        "role": "user"
    }
}
```

---

## 📂 Categorías

### GET `/api/categories`
**Descripción:** Devuelve la lista de todas las categorías de trámites.

**Respuesta exitosa (200):**
```json
[
    {
        "id": 1,
        "name": "Estudios",
        "slug": "estudios"
    },
    {
        "id": 2,
        "name": "Ciudadanía",
        "slug": "ciudadania"
    },
    {
        "id": 3,
        "name": "Empleo",
        "slug": "empleo"
    }
]
```

---

### POST `/api/categories`
**Descripción:** Crea una nueva categoría.

**Requiere:** Token de autenticación + Rol Admin

**Cuerpo de la petición:**
```json
{
    "name": "Vivienda",
    "slug": "vivienda"
}
```

**Respuesta exitosa (201):**
```json
{
    "id": 4,
    "name": "Vivienda",
    "slug": "vivienda"
}
```

---

## 📹 Videos / Trámites

### GET `/api/videos`
**Descripción:** Devuelve la lista paginada de todos los videos/trámites.

**Parámetros de query opcionales:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category` | string | Filtrar por slug de categoría |
| `q` | string | Buscar por título o descripción |
| `page` | integer | Número de página |

**Ejemplos:**
- `GET /api/videos` - Todos los videos
- `GET /api/videos?category=estudios` - Videos de la categoría "Estudios"
- `GET /api/videos?q=beca` - Buscar videos con "beca"

**Respuesta exitosa (200):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "title": "Cómo solicitar una beca",
            "description": "Guía paso a paso para solicitar becas oficiales",
            "url": "https://www.youtube.com/watch?v=video1",
            "duration": 420,
            "category_id": 1,
            "published": true,
            "process_start_date": null,
            "process_end_date": null,
            "category": {
                "id": 1,
                "name": "Estudios",
                "slug": "estudios"
            }
        }
    ],
    "last_page": 1,
    "per_page": 10,
    "total": 10
}
```

---

### GET `/api/videos/search`
**Descripción:** Alias de búsqueda de videos.

**Parámetros de query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Término de búsqueda (requerido) |

**Ejemplo:** `GET /api/videos/search?q=NIE`

**Respuesta:** Igual que `GET /api/videos`

---

### GET `/api/videos/{id}`
**Descripción:** Devuelve los detalles de un video específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del video |

**Ejemplo:** `GET /api/videos/5`

**Respuesta exitosa (200):**
```json
{
    "id": 5,
    "title": "Solicitud de NIE",
    "description": "Trámite para obtener el NIE",
    "url": "https://www.youtube.com/watch?v=video5",
    "duration": 260,
    "category_id": 2,
    "published": true,
    "process_start_date": "2026-02-01",
    "process_end_date": "2026-03-31",
    "category": {
        "id": 2,
        "name": "Ciudadanía",
        "slug": "ciudadania"
    }
}
```

**Error (404):**
```json
{
    "message": "No query results for model [App\\Models\\Video] 999"
}
```

---

### POST `/api/videos`
**Descripción:** Crea un nuevo video/trámite.

**Requiere:** Token de autenticación + Rol Admin

**Cuerpo de la petición:**
```json
{
    "title": "Nuevo Trámite",
    "description": "Descripción del trámite",
    "url": "https://www.youtube.com/watch?v=abc123",
    "category_id": 1,
    "duration": 300,
    "process_start_date": "2026-02-01",
    "process_end_date": "2026-03-15"
}
```

**Campos obligatorios:** `title`, `url`, `category_id`

**Respuesta exitosa (201):**
```json
{
    "id": 11,
    "title": "Nuevo Trámite",
    "description": "Descripción del trámite",
    "url": "https://www.youtube.com/watch?v=abc123",
    "category_id": 1,
    "duration": 300,
    "process_start_date": "2026-02-01",
    "process_end_date": "2026-03-15"
}
```

---

### PUT `/api/videos/{id}`
**Descripción:** Actualiza un video existente.

**Requiere:** Token de autenticación + Rol Admin

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del video a actualizar |

**Cuerpo de la petición:**
```json
{
    "title": "Título Actualizado",
    "description": "Nueva descripción",
    "url": "https://www.youtube.com/watch?v=xyz789",
    "category_id": 2,
    "duration": 450
}
```

**Respuesta exitosa (200):**
```json
{
    "id": 11,
    "title": "Título Actualizado",
    "description": "Nueva descripción",
    "url": "https://www.youtube.com/watch?v=xyz789",
    "category_id": 2,
    "duration": 450
}
```

---

### DELETE `/api/videos/{id}`
**Descripción:** Elimina un video específico.

**Requiere:** Token de autenticación + Rol Admin

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del video a eliminar |

**Ejemplo:** `DELETE /api/videos/11`

**Respuesta exitosa (200):**
```json
{
    "message": "Video eliminado correctamente"
}
```

---

### DELETE `/api/videos/bulk`
**Descripción:** Elimina múltiples videos a la vez.

**Requiere:** Token de autenticación + Rol Admin

**Cuerpo de la petición:**
```json
{
    "ids": [1, 2, 5, 8]
}
```

**Respuesta exitosa (200):**
```json
{
    "message": "Se eliminaron 4 videos correctamente",
    "count": 4
}
```

---

## ❓ Preguntas Frecuentes (FAQs)

### GET `/api/faqs`
**Descripción:** Devuelve la lista de todas las preguntas frecuentes.

**Parámetros de query opcionales:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Buscar por pregunta o respuesta |

**Ejemplos:**
- `GET /api/faqs` - Todas las FAQs
- `GET /api/faqs?q=NIE` - Buscar FAQs sobre "NIE"

**Respuesta exitosa (200):**
```json
[
    {
        "id": 1,
        "question": "¿Cómo solicito el NIE?",
        "answer": "Para solicitar el NIE debes acudir a la oficina de extranjería...",
        "published": true
    },
    {
        "id": 2,
        "question": "¿Qué documentos necesito para empadronarme?",
        "answer": "Necesitarás tu DNI o pasaporte, contrato de alquiler...",
        "published": true
    }
]
```

---

### GET `/api/faqs/search`
**Descripción:** Alias de búsqueda de FAQs.

**Parámetros de query:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Término de búsqueda (requerido) |

**Ejemplo:** `GET /api/faqs/search?q=empadronamiento`

**Respuesta:** Igual que `GET /api/faqs`

---

## 📅 Calendario / Plazos

### GET `/api/deadlines`
**Descripción:** Devuelve todos los plazos y eventos del calendario.

**Respuesta exitosa (200):**
```json
[
    {
        "id": 1,
        "title": "Plazo Beca MEC",
        "date": "2026-03-15",
        "end_date": "2026-04-30",
        "type": "deadline"
    },
    {
        "id": 5,
        "title": "Solicitud de NIE",
        "date": "2026-02-01",
        "end_date": "2026-03-31",
        "type": "video"
    }
]
```

> **Nota:** Incluye tanto deadlines como videos con fechas de proceso.

---

### GET `/api/deadlines/{id}`
**Descripción:** Devuelve los detalles de un plazo específico.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del deadline |

**Ejemplo:** `GET /api/deadlines/1`

**Respuesta exitosa (200):**
```json
{
    "id": 1,
    "title": "Plazo Beca MEC",
    "description": "Convocatoria general de becas",
    "start_date": "2026-03-15",
    "end_date": "2026-04-30"
}
```

---

### GET `/api/calendar`
**Descripción:** Alias de `/api/deadlines`. Devuelve todos los eventos.

**Respuesta:** Igual que `GET /api/deadlines`

---

### GET `/api/calendar/upcoming`
**Descripción:** Devuelve los plazos más próximos.

**Parámetros de query opcionales:**
| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `limit` | integer | Cantidad máxima de resultados | 2 |

**Ejemplo:** `GET /api/calendar/upcoming?limit=5`

**Respuesta exitosa (200):**
```json
[
    {
        "id": 1,
        "title": "Plazo Beca MEC",
        "start_date": "2026-03-15",
        "end_date": "2026-04-30"
    },
    {
        "id": 2,
        "title": "Declaración RENTA",
        "start_date": "2026-04-01",
        "end_date": "2026-06-30"
    }
]
```

---

## 👤 Perfil de Usuario

### GET `/api/auth/user/profile`
**Descripción:** Obtiene el perfil completo del usuario autenticado.

**Requiere:** Token de autenticación

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
    "user": {
        "id": 1,
        "username": "juan_perez",
        "name": "Juan",
        "surname": "Pérez",
        "email": "juan@ejemplo.com",
        "dni": "12345678A",
        "phone": "600123456",
        "dateOfBirth": "1990-05-15",
        "address": "Calle Mayor 10",
        "city": "Madrid",
        "postalCode": "28001",
        "province": "Madrid",
        "relevantData": "Información adicional",
        "role": "user"
    }
}
```

---

### PUT `/api/auth/user/profile`
**Descripción:** Actualiza el perfil del usuario autenticado.

**Requiere:** Token de autenticación

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
    "name": "Juan Carlos",
    "surname": "Pérez García",
    "dni": "12345678A",
    "phone": "600654321",
    "dateOfBirth": "1990-05-15",
    "address": "Avenida Principal 25",
    "city": "Barcelona",
    "postalCode": "08001",
    "province": "Barcelona",
    "relevantData": "Actualización de datos"
}
```

**Campo obligatorio:** `name`

**Respuesta exitosa (200):**
```json
{
    "id": 1,
    "username": "juan_perez",
    "name": "Juan Carlos",
    "surname": "Pérez García",
    "email": "juan@ejemplo.com",
    "dni": "12345678A",
    "phone": "600654321",
    "dateOfBirth": "1990-05-15",
    "address": "Avenida Principal 25",
    "city": "Barcelona",
    "postalCode": "08001",
    "province": "Barcelona",
    "relevantData": "Actualización de datos"
}
```

---

## 📁 Uploads (Archivos)

### GET `/api/uploads`
**Descripción:** Lista los archivos subidos por el usuario.

**Requiere:** Token de autenticación

**Respuesta exitosa (200):**
```json
[
    {
        "id": 1,
        "filename": "documento.pdf",
        "path": "/uploads/documento.pdf",
        "user_id": 1,
        "created_at": "2026-02-01T10:30:00.000000Z"
    }
]
```

---

### POST `/api/uploads`
**Descripción:** Sube un nuevo archivo.

**Requiere:** Token de autenticación + Rol Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `file` | File | Archivo a subir |

**Respuesta exitosa (201):**
```json
{
    "id": 2,
    "filename": "imagen.png",
    "path": "/uploads/imagen.png",
    "user_id": 1,
    "created_at": "2026-02-05T14:00:00.000000Z"
}
```

---

### DELETE `/api/uploads/{id}`
**Descripción:** Elimina un archivo subido.

**Requiere:** Token de autenticación + Rol Admin

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del archivo a eliminar |

**Respuesta exitosa (200):**
```json
{
    "message": "Archivo eliminado correctamente"
}
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| `200` | OK - Petición exitosa |
| `201` | Created - Recurso creado correctamente |
| `401` | Unauthorized - Token inválido o no proporcionado |
| `403` | Forbidden - Sin permisos para esta acción |
| `404` | Not Found - Recurso no encontrado |
| `422` | Unprocessable Entity - Errores de validación |
| `500` | Internal Server Error - Error del servidor |

### Ejemplo de Error de Validación (422):
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 6 characters."]
    }
}
```

---

## 🔑 Ejemplo de Uso con cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "admin@civis.local", "password": "admin1234"}'
```

### Obtener Videos (con token)
```bash
curl -X GET http://localhost:8000/api/videos \
  -H "Authorization: Bearer 1|abc123..." \
  -H "Accept: application/json"
```

### Buscar Videos
```bash
curl -X GET "http://localhost:8000/api/videos?q=beca" \
  -H "Accept: application/json"
```

---

## 📊 Resumen de Endpoints

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Registrar usuario |
| POST | `/api/auth/login` | ❌ | Iniciar sesión |
| POST | `/api/auth/logout` | ✅ | Cerrar sesión |
| GET | `/api/auth/me` | ✅ | Obtener usuario actual |
| GET | `/api/auth/user/profile` | ✅ | Obtener perfil |
| PUT | `/api/auth/user/profile` | ✅ | Actualizar perfil |
| GET | `/api/categories` | ❌ | Listar categorías |
| POST | `/api/categories` | ✅ Admin | Crear categoría |
| GET | `/api/videos` | ❌ | Listar videos |
| GET | `/api/videos/search` | ❌ | Buscar videos |
| GET | `/api/videos/{id}` | ❌ | Detalle de video |
| POST | `/api/videos` | ✅ Admin | Crear video |
| PUT | `/api/videos/{id}` | ✅ Admin | Actualizar video |
| DELETE | `/api/videos/{id}` | ✅ Admin | Eliminar video |
| DELETE | `/api/videos/bulk` | ✅ Admin | Eliminar múltiples |
| GET | `/api/faqs` | ❌ | Listar FAQs |
| GET | `/api/faqs/search` | ❌ | Buscar FAQs |
| GET | `/api/deadlines` | ❌ | Listar plazos |
| GET | `/api/deadlines/{id}` | ❌ | Detalle de plazo |
| GET | `/api/calendar` | ❌ | Alias de deadlines |
| GET | `/api/calendar/upcoming` | ❌ | Plazos próximos |
| GET | `/api/uploads` | ✅ | Listar archivos |
| POST | `/api/uploads` | ✅ Admin | Subir archivo |
| DELETE | `/api/uploads/{id}` | ✅ Admin | Eliminar archivo |

---

**Última actualización:** 2026-02-05  
**Versión de API:** 1.0
