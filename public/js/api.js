/*
// ===== API SERVICE - COMUNICACIÓN CON LARAVEL =====
// Este archivo centraliza todas las llamadas HTTP a la API backend

/**
 * Función genérica para hacer peticiones fetch a la API
 * @param {string} endpoint - Ruta del endpoint (ej: '/videos')
 * @param {Object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<Object>} - Respuesta parseada como JSON
 */
async function fetchAPI(endpoint, options = {}) {
    const token = getToken();

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${CONFIG.api.baseUrl}${endpoint}`, config);

        // Manejar respuestas no autorizadas (token inválido o expirado)
        if (response.status === 401) {
            removeToken();
            // NO redirigir automáticamente aquí para permitir modo invitado.
            // La app redirigirá si es necesario en initializeApp().
            throw new Error('Sesión expirada o no iniciada.');
        }

        // Manejar errores HTTP
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en fetchAPI:', error);
        throw error;
    }
}

// ===== AUTENTICACIÓN =====

/**
 * Login del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} - Datos del usuario y token
 */
async function login(email, password) {
    const response = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    // Guardar token en localStorage
    if (response.token) {
        saveToken(response.token);
    }

    // Guardar usuario en localStorage
    if (response.user) {
        saveCurrentUser(response.user);
    }

    return response;
}

/**
 * Registro de nuevo usuario
 * @param {Object} userData - Datos del usuario (name, email, password, etc.)
 * @returns {Promise<Object>} - Datos del usuario registrado
 */
async function register(userData) {
    const response = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    // Opcionalmente auto-login después del registro
    if (response.token) {
        saveToken(response.token);
    }

    if (response.user) {
        saveCurrentUser(response.user);
    }

    return response;
}

/**
 * Logout del usuario
 * @returns {Promise<Object>} - Confirmación del logout
 */
async function logout() {
    try {
        await fetchAPI('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Error al hacer logout:', error);
    } finally {
        // Limpiar datos locales siempre
        removeToken();
        removeCurrentUser();
    }
}

// ===== VIDEOS / TRÁMITES =====

/**
 * Obtiene todos los videos/trámites
 * @returns {Promise<Array>} - Lista de videos
 */
async function getVideos() {
    return await fetchAPI('/videos');
}

/**
 * Obtiene un video específico por ID
 * @param {number} id - ID del video
 * @returns {Promise<Object>} - Datos del video
 */
async function getVideoById(id) {
    return await fetchAPI(`/videos/${id}`);
}

/**
 * Busca videos por término
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} - Videos que coinciden con la búsqueda
 */
async function searchVideos(query) {
    return await fetchAPI(`/videos/search?q=${encodeURIComponent(query)}`);
}

// ===== CALENDARIO =====

/**
 * Obtiene todos los eventos del calendario
 * @returns {Promise<Array>} - Lista de eventos/plazos
 */
async function getCalendar() {
    return await fetchAPI('/calendar');
}

/**
 * Obtiene eventos próximos (limitado)
 * @param {number} limit - Cantidad de eventos a obtener
 * @returns {Promise<Array>} - Eventos próximos
 */
async function getUpcomingDeadlines(limit = 2) {
    return await fetchAPI(`/calendar/upcoming?limit=${limit}`);
}

// ===== FAQs =====

/**
 * Obtiene todas las preguntas frecuentes
 * @returns {Promise<Array>} - Lista de FAQs
 */
async function getFaqs() {
    return await fetchAPI('/faqs');
}

/**
 * Busca en FAQs
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} - FAQs que coinciden
 */
async function searchFaqs(query) {
    return await fetchAPI(`/faqs/search?q=${encodeURIComponent(query)}`);
}

// ===== USUARIO =====

/**
 * Obtiene el perfil del usuario actual
 * @returns {Promise<Object>} - Datos del usuario
 */
async function getUserProfile() {
    return await fetchAPI('/user/profile');
}

/**
 * Actualiza el perfil del usuario
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} - Usuario actualizado
 */
async function updateUserProfile(updates) {
    return await fetchAPI('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
}

// ===== MANEJO DE TOKEN =====

/**
 * Guarda el token de autenticación
 * @param {string} token - Token JWT
 */
function saveToken(token) {
    localStorage.setItem('civis_auth_token', token);
}

/**
 * Obtiene el token de autenticación
 * @returns {string|null} - Token o null si no existe
 */
function getToken() {
    return localStorage.getItem('civis_auth_token');
}

/**
 * Elimina el token de autenticación
 */
function removeToken() {
    localStorage.removeItem('civis_auth_token');
}

/**
 * Verifica si hay un token válido (solo verifica existencia, no validez)
 * @returns {boolean} - true si existe token
 */
function hasToken() {
    return !!getToken();
}

// ===== MANEJO DE USUARIO EN LOCALSTORAGE =====

/**
 * Guarda datos del usuario actual
 * @param {Object} user - Datos del usuario
 */
function saveCurrentUser(user) {
    localStorage.setItem('civis_current_user', JSON.stringify(user));
}

/**
 * Obtiene datos del usuario actual desde localStorage
 * @returns {Object|null} - Usuario o null
 */
function getCurrentUserFromStorage() {
    const userData = localStorage.getItem('civis_current_user');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Elimina datos del usuario actual
 */
function removeCurrentUser() {
    localStorage.removeItem('civis_current_user');
}

// ===== VERIFICACIÓN DE AUTENTICACIÓN =====

/**
 * Verifica si el usuario está autenticado
 * Redirige a login si no lo está
 */
function requireAuth() {
    if (!hasToken()) {
        window.location.href = 'login.html';
    }
}

// ===== ESTADOS DE CARGA =====

/**
 * Muestra un loader/spinner en un contenedor
 * @param {HTMLElement} container - Contenedor donde mostrar el loader
 */
function showLoader(container) {
    container.innerHTML = `
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    `;
}

/**
 * Muestra mensaje de error en un contenedor
 * @param {HTMLElement} container - Contenedor
 * @param {string} message - Mensaje de error
 */
function showError(container, message) {
    container.innerHTML = ErrorMessage(message);
}
