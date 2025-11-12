// ===== FUNCIONES UTILITARIAS CIVIS =====

/**
 * Formatea una fecha según el locale español
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - 'short' o 'long'
 * @returns {string} - Fecha formateada
 */
function formatDate(date, format = 'long') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options = format === 'short'
        ? { day: 'numeric', month: 'short' }
        : { day: 'numeric', month: 'long', year: 'numeric' };

    return dateObj.toLocaleDateString('es-ES', options);
}

/**
 * Calcula los días restantes hasta una fecha
 * @param {Date|string} targetDate - Fecha objetivo
 * @returns {number} - Días restantes (negativo si ya pasó)
 */
function daysUntil(targetDate) {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Verifica si una fecha ya pasó
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} - true si ya pasó
 */
function isPastDate(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
}

/**
 * Sanitiza una cadena de texto para evitar XSS
 * @param {string} str - Cadena a sanitizar
 * @returns {string} - Cadena sanitizada
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} - Texto truncado
 */
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Debounce - Retrasa la ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Milisegundos de espera
 * @returns {Function} - Función con debounce
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor a guardar
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return false;
    }
}

/**
 * Obtiene datos de localStorage
 * @param {string} key - Clave
 * @returns {any} - Valor guardado o null
 */
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error leyendo de localStorage:', error);
        return null;
    }
}

/**
 * Elimina datos de localStorage
 * @param {string} key - Clave
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error eliminando de localStorage:', error);
        return false;
    }
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Genera un ID único simple
 * @returns {string} - ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Muestra un toast/notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duración en ms
 */
function showToast(message, type = 'info', duration = 3000) {
    // Esta función se puede implementar con una librería de notificaciones
    // Por ahora solo hace console.log
    console.log(`[${type.toUpperCase()}] ${message}`);

    // TODO: Implementar con una librería como Toastify o crear componente propio
}

/**
 * Filtra un array de objetos por múltiples campos
 * @param {Array} array - Array a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array} fields - Campos en los que buscar
 * @returns {Array} - Array filtrado
 */
function filterByMultipleFields(array, searchTerm, fields) {
    const term = searchTerm.toLowerCase();
    return array.filter(item =>
        fields.some(field => {
            const value = item[field];
            if (Array.isArray(value)) {
                return value.some(v => v.toLowerCase().includes(term));
            }
            return String(value).toLowerCase().includes(term);
        })
    );
}

/**
 * Ordena un array de objetos por un campo
 * @param {Array} array - Array a ordenar
 * @param {string} field - Campo por el que ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} - Array ordenado
 */
function sortByField(array, field, order = 'asc') {
    return [...array].sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// Exportar funciones (comentado por ahora, descomentar al usar módulos ES6)
// export { 
//     formatDate, 
//     daysUntil, 
//     isPastDate, 
//     sanitizeHTML, 
//     truncateText,
//     debounce,
//     saveToLocalStorage,
//     getFromLocalStorage,
//     removeFromLocalStorage,
//     validateEmail,
//     generateId,
//     showToast,
//     filterByMultipleFields,
//     sortByField
// };
