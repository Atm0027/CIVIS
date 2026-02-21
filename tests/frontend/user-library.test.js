import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserLibrary } from '../../public/js/user-library.js';

// ===== HELPERS =====
const VIDEO_1 = { id: 1, title: 'Obtener DNI', description: 'Tutorial sobre el DNI', url: 'https://youtu.be/abc123', category: { name: 'Identidad' } };
const VIDEO_2 = { id: 2, title: 'Renovar Pasaporte', description: 'Cómo renovar el pasaporte', url: 'https://youtu.be/xyz789', category: { name: 'Viajes' } };
const VIDEO_3 = { id: 3, title: 'Pagar impuestos', description: '', url: '', category: null };

// ===== SETUP =====
beforeEach(() => {
    // Usar localStorage real de jsdom — limpiar entre tests
    localStorage.clear();
});

// -----------------------------------------------------------------------
// FAVORITOS
// -----------------------------------------------------------------------
describe('UserLibrary — Favoritos', () => {

    it('getFavorites() devuelve [] cuando no hay favoritos', () => {
        expect(UserLibrary.getFavorites()).toEqual([]);
    });

    it('toggleFavorite() añade un vídeo a favoritos', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        expect(UserLibrary.getFavorites()).toHaveLength(1);
        expect(UserLibrary.getFavorites()[0].id).toBe(1);
    });

    it('toggleFavorite() elimina el vídeo si ya es favorito (toggle off)', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        UserLibrary.toggleFavorite(VIDEO_1);
        expect(UserLibrary.getFavorites()).toHaveLength(0);
    });

    it('toggleFavorite() devuelve { action: "added" } al añadir', () => {
        const result = UserLibrary.toggleFavorite(VIDEO_1);
        expect(result.action).toBe('added');
        expect(result.id).toBe(1);
    });

    it('toggleFavorite() devuelve { action: "removed" } al eliminar', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        const result = UserLibrary.toggleFavorite(VIDEO_1);
        expect(result.action).toBe('removed');
    });

    it('isFavorite() devuelve true si está marcado como favorito', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        expect(UserLibrary.isFavorite(1)).toBe(true);
    });

    it('isFavorite() devuelve false si NO está en favoritos', () => {
        expect(UserLibrary.isFavorite(99)).toBe(false);
    });

    it('isFavorite() funciona con IDs de tipo string', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        expect(UserLibrary.isFavorite('1')).toBe(true);
    });

    it('removeFavorite() elimina directamente un favorito por ID', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        UserLibrary.toggleFavorite(VIDEO_2);
        UserLibrary.removeFavorite(1);
        expect(UserLibrary.isFavorite(1)).toBe(false);
        expect(UserLibrary.isFavorite(2)).toBe(true);
    });

    it('puede gestionar múltiples favoritos', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        UserLibrary.toggleFavorite(VIDEO_2);
        UserLibrary.toggleFavorite(VIDEO_3);
        expect(UserLibrary.getFavorites()).toHaveLength(3);
    });

    it('los favoritos persisten al volver a leer desde localStorage', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        // Simular "recarga": leer desde cero
        const freshFavorites = UserLibrary.getFavorites();
        expect(freshFavorites[0].id).toBe(1);
        expect(freshFavorites[0].title).toBe('Obtener DNI');
    });

    it('toggleFavorite() lanza error si no hay ID', () => {
        expect(() => UserLibrary.toggleFavorite({ title: 'Sin ID' })).toThrow();
    });

    it('los campos opcionales vacíos se normalizan correctamente', () => {
        UserLibrary.toggleFavorite(VIDEO_3);
        const saved = UserLibrary.getFavorites()[0];
        expect(saved.title).toBe('Pagar impuestos');
        expect(saved.description).toBe('');
        expect(saved.url).toBe('');
        expect(saved.category).toBeNull();
    });
});

// -----------------------------------------------------------------------
// VÍDEOS VISTOS
// -----------------------------------------------------------------------
describe('UserLibrary — Vistos', () => {

    it('getWatched() devuelve [] cuando no hay vídeos vistos', () => {
        expect(UserLibrary.getWatched()).toEqual([]);
    });

    it('toggleWatched() añade un vídeo a la lista de vistos', () => {
        UserLibrary.toggleWatched(VIDEO_1);
        expect(UserLibrary.getWatched()).toHaveLength(1);
    });

    it('toggleWatched() elimina el vídeo si ya está en vistos', () => {
        UserLibrary.toggleWatched(VIDEO_1);
        UserLibrary.toggleWatched(VIDEO_1);
        expect(UserLibrary.getWatched()).toHaveLength(0);
    });

    it('isWatched() devuelve true si ya ha sido visto', () => {
        UserLibrary.toggleWatched(VIDEO_2);
        expect(UserLibrary.isWatched(2)).toBe(true);
    });

    it('isWatched() devuelve false si NO ha sido visto', () => {
        expect(UserLibrary.isWatched(99)).toBe(false);
    });

    it('removeWatched() elimina un visto por ID', () => {
        UserLibrary.toggleWatched(VIDEO_1);
        UserLibrary.toggleWatched(VIDEO_2);
        UserLibrary.removeWatched(1);
        expect(UserLibrary.isWatched(1)).toBe(false);
        expect(UserLibrary.isWatched(2)).toBe(true);
    });
});

// -----------------------------------------------------------------------
// FAVORITOS y VISTOS son independientes
// -----------------------------------------------------------------------
describe('UserLibrary — independencia de listas', () => {

    it('marcar como favorito NO lo añade a vistos', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        expect(UserLibrary.isWatched(1)).toBe(false);
    });

    it('marcar como visto NO lo añade a favoritos', () => {
        UserLibrary.toggleWatched(VIDEO_1);
        expect(UserLibrary.isFavorite(1)).toBe(false);
    });

    it('un vídeo puede estar en ambas listas simultáneamente', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        UserLibrary.toggleWatched(VIDEO_1);
        expect(UserLibrary.isFavorite(1)).toBe(true);
        expect(UserLibrary.isWatched(1)).toBe(true);
    });
});

// -----------------------------------------------------------------------
// ESTADÍSTICAS
// -----------------------------------------------------------------------
describe('UserLibrary — getStats()', () => {

    it('devuelve { favorites: 0, watched: 0 } cuando todo está vacío', () => {
        expect(UserLibrary.getStats()).toEqual({ favorites: 0, watched: 0 });
    });

    it('cuenta correctamente favoritos y vistos', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        UserLibrary.toggleFavorite(VIDEO_2);
        UserLibrary.toggleWatched(VIDEO_3);
        expect(UserLibrary.getStats()).toEqual({ favorites: 2, watched: 1 });
    });
});

// -----------------------------------------------------------------------
// CLEAR ALL
// -----------------------------------------------------------------------
describe('UserLibrary — clearAll()', () => {

    it('borra tanto favoritos como vistos', () => {
        UserLibrary.toggleFavorite(VIDEO_1);
        UserLibrary.toggleWatched(VIDEO_2);
        UserLibrary.clearAll();
        expect(UserLibrary.getFavorites()).toEqual([]);
        expect(UserLibrary.getWatched()).toEqual([]);
    });
});

// -----------------------------------------------------------------------
// EVENTOS
// -----------------------------------------------------------------------
describe('UserLibrary — custom events', () => {

    it('toggleFavorite() dispara el evento civis:favoriteToggled', () => {
        const handler = vi.fn();
        document.addEventListener('civis:favoriteToggled', handler);
        UserLibrary.toggleFavorite(VIDEO_1);
        document.removeEventListener('civis:favoriteToggled', handler);
        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][0].detail).toMatchObject({ id: 1, action: 'added' });
    });

    it('toggleWatched() dispara el evento civis:watchedToggled', () => {
        const handler = vi.fn();
        document.addEventListener('civis:watchedToggled', handler);
        UserLibrary.toggleWatched(VIDEO_1);
        document.removeEventListener('civis:watchedToggled', handler);
        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][0].detail).toMatchObject({ id: 1, action: 'added' });
    });
});
