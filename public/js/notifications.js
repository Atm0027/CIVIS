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

        // Aviso si no tiene el DNI completado
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
    }

    /**
     * Comprueba eventos del calendario y genera notificaciones
     * para aquellos cuya fecha esté dentro del umbral configurado.
     * @param {Array} events - Eventos del calendario (desde la API /calendar o /calendar/upcoming)
     */
    function checkDeadlineAlerts(events) {
        if (!Array.isArray(events) || events.length === 0) return;

        // Obtener el umbral de días desde la configuración (fallback: 7 días)
        const daysThreshold = (typeof CONFIG !== 'undefined' && CONFIG.notifications)
            ? CONFIG.notifications.daysBeforeDeadline
            : 7;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const limitDate = new Date(today);
        limitDate.setDate(limitDate.getDate() + daysThreshold);

        const allNotifications = _getAll();

        events.forEach(event => {
            // Comprobar fecha de inicio (date) y fecha de fin (end_date)
            const datesToCheck = [];
            if (event.date) datesToCheck.push({ dateStr: event.date, label: 'inicio' });
            if (event.end_date) datesToCheck.push({ dateStr: event.end_date, label: 'fin' });

            datesToCheck.forEach(({ dateStr, label }) => {
                // Normalizar la fecha (puede llegar como 'YYYY-MM-DD HH:mm:ss' o ISO)
                const eventDate = new Date(dateStr.split(' ')[0].split('T')[0]);

                // Solo alertar si la fecha está entre hoy y el límite (inclusive)
                if (eventDate >= today && eventDate <= limitDate) {
                    // Crear un identificador único para evitar duplicados
                    const alertKey = `deadline-${event.id}-${label}`;
                    const alreadyExists = allNotifications.some(
                        n => n.message && n.message.includes(alertKey)
                    );

                    if (!alreadyExists) {
                        const formattedDate = eventDate.toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        });
                        const daysRemaining = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                        const daysText = daysRemaining === 0
                            ? 'Hoy'
                            : daysRemaining === 1
                                ? 'Mañana'
                                : `En ${daysRemaining} días`;

                        add({
                            title: `📅 Plazo próximo: ${event.title}`,
                            message: `${daysText} (${formattedDate}) — ${label === 'inicio' ? 'Fecha de inicio' : 'Fecha límite'} [${alertKey}]`,
                            type: 'warning',
                            date: dateStr,
                            link: 'calendario.html'
                        });
                    }
                }
            });
        });
    }

    return {
        add,
        getAll,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
        remove,
        clear,
        checkSystemAlerts,
        checkDeadlineAlerts
    };
})();

// Exponer como global para scripts clásicos
if (typeof window !== 'undefined') {
    window.Notifications = Notifications;
}

// Nota: export eliminado para compatibilidad con scripts clásicos del browser.
