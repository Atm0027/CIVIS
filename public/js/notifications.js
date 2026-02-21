// ===== MÓDULO: SISTEMA DE NOTIFICACIONES - CIVIS =====
// Gestiona avisos, recordatorios y alertas del sistema.
// Persiste en localStorage.

const Notifications = (() => {
    const STORAGE_KEY = 'civis_notifications';

    // -----------------------------------------------------------------------
    // PERSISTENCIA
    // -----------------------------------------------------------------------

    function _getAll() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function _saveAll(notifications) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        // Emitir evento para que la UI se actualice
        document.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: notifications }));
    }

    // -----------------------------------------------------------------------
    // API PÚBLICA
    // -----------------------------------------------------------------------

    /**
     * Añade una nueva notificación
     * @param {Object} notification - { title, message, type, date, link }
     */
    function add(notification) {
        const notifications = _getAll();
        const newNotification = {
            id: Date.now(),
            read: false,
            createdAt: new Date().toISOString(),
            title: notification.title || 'Aviso',
            message: notification.message || '',
            type: notification.type || 'info', // info, warning, success, error
            date: notification.date || null,
            link: notification.link || null
        };

        notifications.unshift(newNotification);
        _saveAll(notifications);
        return newNotification;
    }

    /**
     * Obtiene todas las notificaciones
     */
    function getAll() {
        return _getAll();
    }

    /**
     * Obtiene el número de notificaciones no leídas
     */
    function getUnreadCount() {
        return _getAll().filter(n => !n.read).length;
    }

    /**
     * Marca una notificación como leída
     */
    function markAsRead(id) {
        const notifications = _getAll();
        const n = notifications.find(item => item.id === id);
        if (n) {
            n.read = true;
            _saveAll(notifications);
        }
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    function markAllAsRead() {
        const notifications = _getAll();
        notifications.forEach(n => n.read = true);
        _saveAll(notifications);
    }

    /**
     * Elimina una notificación
     */
    function remove(id) {
        const notifications = _getAll().filter(item => item.id !== id);
        _saveAll(notifications);
    }

    /**
     * Limpia todas las notificaciones
     */
    function clear() {
        _saveAll([]);
    }

    // -----------------------------------------------------------------------
    // LÓGICA DE NEGOCIO (Alertas automáticas)
    // -----------------------------------------------------------------------

    /**
     * Comprueba si hay alertas automáticas basadas en datos del usuario
     * @param {Object} user - Datos del usuario actual
     */
    function checkSystemAlerts(user) {
        if (!user) return;

        // Ejemplo: Aviso si no tiene el DNI completado
        if (!user.dni) {
            const hasDniAlert = _getAll().some(n => n.type === 'warning' && n.message.includes('DNI'));
            if (!hasDniAlert) {
                add({
                    title: 'Perfil Incompleto',
                    message: 'Te recomendamos añadir tu DNI en el perfil para agilizar los trámites.',
                    type: 'warning',
                    link: 'usuario.html'
                });
            }
        }

        // Aquí se podrían añadir chequeos de fechas de caducidad si existieran en el modelo
    }

    return {
        add,
        getAll,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
        remove,
        clear,
        checkSystemAlerts
    };
})();

// Exponer como global para scripts clásicos
if (typeof window !== 'undefined') {
    window.Notifications = Notifications;
}

// Exportar para tests
export { Notifications };
