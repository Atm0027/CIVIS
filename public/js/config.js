// ===== CONFIGURACIÓN DE LA APLICACIÓN CIVIS =====
// ✅ Archivo actualizado para conexión con Laravel

const CONFIG = {
    // Información de la aplicación
    app: {
        name: "Civis",
        version: "1.0.0",
        environment: "development", // development, staging, production
        debug: true
    },

    // ⚠️ IMPORTANTE: Configuración de API Laravel
    // Ajustar según tu entorno de desarrollo
    api: {
        baseUrl: "http://localhost:8000/api", // URL de tu API Laravel
        timeout: 10000, // 10 segundos
        
        // Endpoints de la API
        // NOTA: Estos deben coincidir con las rutas definidas en Laravel (routes/api.php)
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

    // Configuración de notificaciones (futuro)
    notifications: {
        enabled: true,
        daysBeforeDeadline: 7,
        emailEnabled: false, // Activar cuando esté implementado en backend
        smsEnabled: false
    },

    // Configuración de búsqueda
    search: {
        minCharacters: 2, // Mínimo de caracteres para buscar
        debounceTime: 300 // Milisegundos de espera antes de buscar
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
        cdnUrl: "" // Vacío por ahora, configurar si se usa CDN
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