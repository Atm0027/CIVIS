// ===== MÓDULO: LIBRERÍA PERSONAL DEL USUARIO (Favoritos + Vistos) =====
// Persiste en localStorage para acceso inmediato sin necesidad de autenticación.
// Listo para sincronizar con API cuando los endpoints estén disponibles.

const UserLibrary = (() => {

    // -----------------------------------------------------------------------
    // CONSTANTES
    // -----------------------------------------------------------------------
    const KEYS = {
        favorites: 'civis_favorites',
        watched: 'civis_watched',
    };

    const EVENTS = {
        favoriteToggled: 'civis:favoriteToggled',
        watchedToggled: 'civis:watchedToggled',
    };

    // -----------------------------------------------------------------------
    // PERSISTENCIA — LocalStorage
    // -----------------------------------------------------------------------

    /** Lee una lista del localStorage. Devuelve [] si no existe o está corrupto. */
    function _read(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    /** Escribe una lista en el localStorage. */
    function _write(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    /** Normaliza un ítem para garantizar estructura consistente. */
    function _normalizeItem(item) {
        if (typeof item !== 'object' || !item) return null;
        return {
            id: item.id,
            title: item.title || 'Sin título',
            description: (item.description || '').substring(0, 150),
            url: item.url || '',
            category: item.category || null,
            savedAt: item.savedAt || new Date().toISOString(),
        };
    }

    /** Emite un custom event en el documento (para que otros módulos reaccionen). */
    function _dispatch(eventName, detail) {
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent(eventName, { detail }));
        }
    }

    // -----------------------------------------------------------------------
    // API PÚBLICA — FAVORITOS
    // -----------------------------------------------------------------------

    /**
     * Devuelve todos los favoritos guardados.
     * @returns {Array<Object>}
     */
    function getFavorites() {
        return _read(KEYS.favorites);
    }

    /**
     * Comprueba si un vídeo está marcado como favorito.
     * @param {number|string} videoId
     * @returns {boolean}
     */
    function isFavorite(videoId) {
        return getFavorites().some(item => String(item.id) === String(videoId));
    }

    /**
     * Añade o elimina un vídeo de favoritos (toggle).
     * @param {Object} video - Debe tener al menos { id, title }
     * @returns {{ action: 'added'|'removed', id: number|string }}
     */
    function toggleFavorite(video) {
        const normalized = _normalizeItem(video);
        if (!normalized || !normalized.id) throw new Error('El vídeo no tiene ID válido');

        const list = getFavorites();
        const existingIndex = list.findIndex(item => String(item.id) === String(normalized.id));

        let action;
        if (existingIndex !== -1) {
            list.splice(existingIndex, 1);
            action = 'removed';
        } else {
            list.push(normalized);
            action = 'added';
        }

        _write(KEYS.favorites, list);
        _dispatch(EVENTS.favoriteToggled, { id: normalized.id, action });
        return { action, id: normalized.id };
    }

    /**
     * Elimina un favorito por ID.
     * @param {number|string} videoId
     */
    function removeFavorite(videoId) {
        const list = getFavorites().filter(item => String(item.id) !== String(videoId));
        _write(KEYS.favorites, list);
        _dispatch(EVENTS.favoriteToggled, { id: videoId, action: 'removed' });
    }

    // -----------------------------------------------------------------------
    // API PÚBLICA — VÍDEOS VISTOS
    // -----------------------------------------------------------------------

    /**
     * Devuelve todos los vídeos marcados como vistos.
     * @returns {Array<Object>}
     */
    function getWatched() {
        return _read(KEYS.watched);
    }

    /**
     * Comprueba si un vídeo ha sido visto.
     * @param {number|string} videoId
     * @returns {boolean}
     */
    function isWatched(videoId) {
        return getWatched().some(item => String(item.id) === String(videoId));
    }

    /**
     * Añade o elimina un vídeo de la lista de vistos (toggle).
     * @param {Object} video - Debe tener al menos { id, title }
     * @returns {{ action: 'added'|'removed', id: number|string }}
     */
    function toggleWatched(video) {
        const normalized = _normalizeItem(video);
        if (!normalized || !normalized.id) throw new Error('El vídeo no tiene ID válido');

        const list = getWatched();
        const existingIndex = list.findIndex(item => String(item.id) === String(normalized.id));

        let action;
        if (existingIndex !== -1) {
            list.splice(existingIndex, 1);
            action = 'removed';
        } else {
            list.push(normalized);
            action = 'added';
        }

        _write(KEYS.watched, list);
        _dispatch(EVENTS.watchedToggled, { id: normalized.id, action });
        return { action, id: normalized.id };
    }

    /**
     * Elimina un vídeo de la lista de vistos por ID.
     * @param {number|string} videoId
     */
    function removeWatched(videoId) {
        const list = getWatched().filter(item => String(item.id) !== String(videoId));
        _write(KEYS.watched, list);
        _dispatch(EVENTS.watchedToggled, { id: videoId, action: 'removed' });
    }

    // -----------------------------------------------------------------------
    // API PÚBLICA — UTILIDADES
    // -----------------------------------------------------------------------

    /**
     * Devuelve estadísticas de la librería del usuario.
     * @returns {{ favorites: number, watched: number }}
     */
    function getStats() {
        return {
            favorites: getFavorites().length,
            watched: getWatched().length,
        };
    }

    /**
     * Borra toda la librería personal (favoritos + vistos).
     * Útil para logout o reset.
     */
    function clearAll() {
        localStorage.removeItem(KEYS.favorites);
        localStorage.removeItem(KEYS.watched);
    }

    // Exponer constantes de eventos también
    const events = EVENTS;

    return {
        getFavorites, isFavorite, toggleFavorite, removeFavorite,
        getWatched, isWatched, toggleWatched, removeWatched,
        getStats, clearAll, events,
    };
})();

// Exponer como global para scripts clásicos del browser
if (typeof window !== 'undefined') {
    window.UserLibrary = UserLibrary;
}

// Exportar para tests (ESM - Vitest)
export { UserLibrary };
