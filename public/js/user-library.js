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
        ratings: 'civis_ratings',
    };

    const EVENTS = {
        favoriteToggled: 'civis:favoriteToggled',
        watchedToggled: 'civis:watchedToggled',
        ratingChanged: 'civis:ratingChanged',
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
    // API PÚBLICA — VALORACIONES (Me gusta / No me gusta)
    // -----------------------------------------------------------------------

    /**
     * Lee el mapa de valoraciones: { [videoId]: 'like'|'dislike' }
     * @returns {Object}
     */
    function _getRatingsMap() {
        try {
            const raw = localStorage.getItem(KEYS.ratings);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    /**
     * Devuelve la valoración actual de un vídeo: 'like', 'dislike' o null.
     * @param {number|string} videoId
     * @returns {'like'|'dislike'|null}
     */
    function getRating(videoId) {
        const map = _getRatingsMap();
        return map[String(videoId)] || null;
    }

    /**
     * Alterna la valoración de un vídeo.
     * - Si se vota lo mismo dos veces, se elimina la valoración (toggle).
     * - Si se vota lo contrario, se cambia.
     * @param {number|string} videoId
     * @param {'like'|'dislike'} value
     * @returns {{ videoId: string, rating: 'like'|'dislike'|null }}
     */
    function toggleRating(videoId, value) {
        if (value !== 'like' && value !== 'dislike') {
            throw new Error('El valor de rating debe ser "like" o "dislike"');
        }

        const map = _getRatingsMap();
        const key = String(videoId);
        const current = map[key] || null;

        // Mismo voto → eliminar (toggle off)
        if (current === value) {
            delete map[key];
        } else {
            map[key] = value;
        }

        localStorage.setItem(KEYS.ratings, JSON.stringify(map));
        const newRating = map[key] || null;
        _dispatch(EVENTS.ratingChanged, { videoId: key, rating: newRating });
        return { videoId: key, rating: newRating };
    }

    /**
     * Elimina la valoración de un vídeo.
     * @param {number|string} videoId
     */
    function removeRating(videoId) {
        const map = _getRatingsMap();
        delete map[String(videoId)];
        localStorage.setItem(KEYS.ratings, JSON.stringify(map));
        _dispatch(EVENTS.ratingChanged, { videoId: String(videoId), rating: null });
    }

    // -----------------------------------------------------------------------
    // API PÚBLICA — UTILIDADES
    // -----------------------------------------------------------------------

    /**
     * Devuelve estadísticas de la librería del usuario.
     * @returns {{ favorites: number, watched: number, ratings: number }}
     */
    function getStats() {
        return {
            favorites: getFavorites().length,
            watched: getWatched().length,
            ratings: Object.keys(_getRatingsMap()).length,
        };
    }

    /**
     * Borra toda la librería personal (favoritos + vistos + valoraciones).
     * Útil para logout o reset.
     */
    function clearAll() {
        localStorage.removeItem(KEYS.favorites);
        localStorage.removeItem(KEYS.watched);
        localStorage.removeItem(KEYS.ratings);
    }

    // Exponer constantes de eventos también
    const events = EVENTS;

    return {
        getFavorites, isFavorite, toggleFavorite, removeFavorite,
        getWatched, isWatched, toggleWatched, removeWatched,
        getRating, toggleRating, removeRating,
        getStats, clearAll, events,
    };
})();

// Exponer como global para scripts clásicos del browser
if (typeof window !== 'undefined') {
    window.UserLibrary = UserLibrary;
}

// Exportar para tests (ESM - Vitest)
export { UserLibrary };
