// ===== CONFIGURACIÓN DE LA APLICACIÓN CIVIS =====
// Archivo de configuración centralizada para conexión con Laravel
// Soporta automáticamente desarrollo y producción

/**
 * Detecta automáticamente la URL base según el entorno
 * Prioridad:
 * 1. window.CIVIS_ENV.API_BASE_URL (inyectado via Docker)
 * 2. Detección automática basada en hostname
 *
 * @returns {string} URL base de la API
 */
function getApiBaseUrl() {
    // 1. Usar configuración inyectada desde Docker si existe
    if (window.CIVIS_ENV && window.CIVIS_ENV.API_BASE_URL) {
        return window.CIVIS_ENV.API_BASE_URL;
    }

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;

    // 2. Desarrollo local con php artisan serve
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '8000') {
        return 'http://localhost:8000/api';
    }

    // 3. Producción/Docker: mismo dominio, ruta /api
    // Ejemplo: http://civis.local/api o https://civis.com/api
    return `${protocol}//${hostname}${port ? ':' + port : ''}/api`;
}

const CONFIG = {
    // Información de la aplicación
    app: {
        name: "Civis",
        version: "1.0.0",
        environment: window.location.hostname === 'localhost' ? "development" : "production",
        debug: window.location.hostname === 'localhost'
    },

    // Configuración de API Laravel
    // La URL se detecta automáticamente según el entorno
    api: {
        baseUrl: getApiBaseUrl(), // URL automática según entorno
        timeout: 10000, // 10 segundos

        // Endpoints de la API
        // Deben coincidir con las rutas definidas en Laravel (routes/api.php)
        endpoints: {
            // Autenticación
            login: "/auth/login",
            register: "/auth/register",
            logout: "/auth/logout",

            // Videos/Trámites
            videos: "/videos",
            videoById: "/videos/:id",
            searchVideos: "/videos/search",

            // Calendario
            calendar: "/calendar",
            upcomingDeadlines: "/calendar/upcoming",

            // FAQs
            faqs: "/faqs",
            searchFaqs: "/faqs/search",

            // Usuario
            userProfile: "/user/profile",
            updateProfile: "/user/profile"
        }
    },

    // Configuración de paginación
    pagination: {
        videosPerPage: 9,
        calendarItemsPerPage: 10,
        faqsPerPage: 5
    },

    // Configuración de notificaciones
    notifications: {
        enabled: true,
        daysBeforeDeadline: 7,
        emailEnabled: false,
        smsEnabled: false
    },

    // Configuración de búsqueda
    search: {
        minCharacters: 2,
        debounceTime: 300
    },

    // Configuración de localStorage
    storage: {
        keys: {
            token: "civis_auth_token",
            user: "civis_current_user",
            preferences: "civis_user_preferences",
            favorites: "civis_favorites"
        }
    },

    // Configuración de fechas y localización
    locale: {
        language: "es-ES",
        timezone: "Europe/Madrid",
        dateFormat: {
            short: { day: 'numeric', month: 'short' },
            long: { day: 'numeric', month: 'long', year: 'numeric' }
        }
    },

    // URLs de recursos externos
    resources: {
        placeholderImages: "https://placehold.co",
        defaultAvatar: "https://ui-avatars.com/api/?name=Usuario&background=3b82f6&color=fff",
        cdnUrl: ""
    },

    // Configuración de validación
    validation: {
        password: {
            minLength: 6,
            requireUppercase: false,
            requireNumbers: false,
            requireSpecialChars: false
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    }
};

// ===== FUNCIONES DE CONFIGURACIÓN ÚTILES =====

/**
 * Obtiene la URL completa de un endpoint
 * @param {string} endpointKey - Clave del endpoint en CONFIG.api.endpoints
 * @param {Object} params - Parámetros para reemplazar en la URL (ej: {id: 5})
 * @returns {string} - URL completa
 */
function getApiUrl(endpointKey, params = {}) {
    let endpoint = CONFIG.api.endpoints[endpointKey];

    // Reemplazar parámetros dinámicos (ej: :id)
    Object.keys(params).forEach(key => {
        endpoint = endpoint.replace(`:${key}`, params[key]);
    });

    return `${CONFIG.api.baseUrl}${endpoint}`;
}

/**
 * Verifica si estamos en modo desarrollo
 * @returns {boolean}
 */
function isDevelopment() {
    return CONFIG.app.environment === 'development';
}

/**
 * Verifica si estamos en modo producción
 * @returns {boolean}
 */
function isProduction() {
    return CONFIG.app.environment === 'production';
}

/**
 * Log condicional (solo en desarrollo)
 * @param  {...any} args - Argumentos a loguear
 */
function debugLog(...args) {
    if (CONFIG.app.debug && isDevelopment()) {
        console.log('[CIVIS DEBUG]', ...args);
    }
}

// Log de configuración en desarrollo
if (isDevelopment()) {
    console.log('[CIVIS] Modo Desarrollo - API Base URL:', CONFIG.api.baseUrl);
} else {
    console.log('[CIVIS] Modo Producción - API Base URL:', CONFIG.api.baseUrl);
}
