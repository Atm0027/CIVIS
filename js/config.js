// ===== CONFIGURACIÓN DE LA APLICACIÓN CIVIS =====
// Este archivo contiene configuraciones básicas para la aplicación

const CONFIG = {
    // Información de la aplicación
    app: {
        name: "Civis",
        version: "1.0.0",
        environment: "development", // development, staging, production
        debug: true
    },

    // Configuración de API (para futuro backend)
    api: {
        baseUrl: "http://localhost:8000/api", // Cambiar en producción
        timeout: 10000, // 10 segundos
        endpoints: {
            videos: "/videos",
            calendar: "/calendar",
            faqs: "/faqs",
            user: "/user",
            auth: "/auth"
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
        daysBeforeDeadline: 7, // Notificar X días antes del plazo
        emailEnabled: false, // Activar cuando esté el backend
        smsEnabled: false // Activar cuando esté el backend
    },

    // Configuración de búsqueda
    search: {
        minCharacters: 2, // Mínimo de caracteres para buscar
        debounceTime: 300 // Milisegundos de espera antes de buscar
    },

    // Configuración de localStorage
    storage: {
        keys: {
            user: "civis_user_data",
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

    // URLs de recursos externos (para cuando tengamos hosting propio)
    resources: {
        placeholderImages: "https://placehold.co",
        cdnUrl: "" // Vacío por ahora
    }
};

// Exportar configuración (comentado por ahora, descomentar al usar módulos ES6)
// export default CONFIG;
