import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserLibrary } from './shims/user-library.shim.js';

// ===== TESTS: SISTEMA DE VALORACIONES =====

describe('UserLibrary — Ratings', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    // --- getRating ---
    it('debería devolver null si no hay valoración', () => {
        expect(UserLibrary.getRating(42)).toBeNull();
    });

    // --- toggleRating: like ---
    it('debería guardar "like" al votar positivo', () => {
        UserLibrary.toggleRating(1, 'like');
        expect(UserLibrary.getRating(1)).toBe('like');
    });

    it('debería guardar "dislike" al votar negativo', () => {
        UserLibrary.toggleRating(1, 'dislike');
        expect(UserLibrary.getRating(1)).toBe('dislike');
    });

    // --- toggleRating: toggle-off ---
    it('debería eliminar "like" al votar "like" dos veces (toggle off)', () => {
        UserLibrary.toggleRating(1, 'like');
        UserLibrary.toggleRating(1, 'like');
        expect(UserLibrary.getRating(1)).toBeNull();
    });

    it('debería eliminar "dislike" al votar "dislike" dos veces (toggle off)', () => {
        UserLibrary.toggleRating(5, 'dislike');
        UserLibrary.toggleRating(5, 'dislike');
        expect(UserLibrary.getRating(5)).toBeNull();
    });

    // --- toggleRating: cambio de voto ---
    it('debería cambiar de "like" a "dislike"', () => {
        UserLibrary.toggleRating(2, 'like');
        UserLibrary.toggleRating(2, 'dislike');
        expect(UserLibrary.getRating(2)).toBe('dislike');
    });

    it('debería cambiar de "dislike" a "like"', () => {
        UserLibrary.toggleRating(2, 'dislike');
        UserLibrary.toggleRating(2, 'like');
        expect(UserLibrary.getRating(2)).toBe('like');
    });

    // --- valores inválidos ---
    it('debería lanzar error si el valor no es "like" ni "dislike"', () => {
        expect(() => UserLibrary.toggleRating(1, 'meh')).toThrow();
    });

    // --- removeRating ---
    it('debería eliminar una valoración con removeRating', () => {
        UserLibrary.toggleRating(3, 'like');
        UserLibrary.removeRating(3);
        expect(UserLibrary.getRating(3)).toBeNull();
    });

    // --- múltiples vídeos independientes ---
    it('debería mantener valoraciones independientes por vídeo', () => {
        UserLibrary.toggleRating(10, 'like');
        UserLibrary.toggleRating(11, 'dislike');
        UserLibrary.toggleRating(12, 'like');

        expect(UserLibrary.getRating(10)).toBe('like');
        expect(UserLibrary.getRating(11)).toBe('dislike');
        expect(UserLibrary.getRating(12)).toBe('like');
    });

    // --- getStats incluye ratings ---
    it('debería reflejar el número de valoraciones en getStats', () => {
        UserLibrary.toggleRating(1, 'like');
        UserLibrary.toggleRating(2, 'dislike');
        expect(UserLibrary.getStats().ratings).toBe(2);
    });

    // --- clearAll limpia valoraciones ---
    it('debería borrar las valoraciones al llamar a clearAll', () => {
        UserLibrary.toggleRating(1, 'like');
        UserLibrary.clearAll();
        expect(UserLibrary.getRating(1)).toBeNull();
        expect(UserLibrary.getStats().ratings).toBe(0);
    });

    // --- custom event ---
    it('debería emitir el evento civis:ratingChanged al votar', () => {
        const spy = vi.fn();
        document.addEventListener('civis:ratingChanged', spy);

        UserLibrary.toggleRating(7, 'like');

        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0].detail).toMatchObject({ videoId: '7', rating: 'like' });

        document.removeEventListener('civis:ratingChanged', spy);
    });

    it('debería emitir el evento con rating null al hacer toggle off', () => {
        const spy = vi.fn();
        UserLibrary.toggleRating(8, 'like'); // primer voto
        document.addEventListener('civis:ratingChanged', spy);
        UserLibrary.toggleRating(8, 'like'); // toggle off

        expect(spy.mock.calls[0][0].detail).toMatchObject({ videoId: '8', rating: null });

        document.removeEventListener('civis:ratingChanged', spy);
    });

    // --- persistencia ---
    it('debería persistir las valoraciones entre lecturas', () => {
        UserLibrary.toggleRating(99, 'dislike');
        // Simular nueva "carga" leyendo de localStorage directamente vía UserLibrary
        expect(UserLibrary.getRating(99)).toBe('dislike');
    });

    // --- ID numérico y string equivalentes ---
    it('debería tratar el ID numérico y string como equivalentes', () => {
        UserLibrary.toggleRating(20, 'like');
        expect(UserLibrary.getRating('20')).toBe('like');
    });
});
