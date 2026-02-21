import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Toast } from '../../public/js/toast.js';

// ===== HELPERS =====
function getContainer() {
    return document.getElementById('toast-container');
}

function getAllToasts() {
    const container = getContainer();
    return container ? Array.from(container.querySelectorAll('.toast')) : [];
}

// ===== TESTS =====
describe('Toast - Sistema de notificaciones', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // --- show() ---
    describe('Toast.show()', () => {

        it('crea el contenedor #toast-container si no existe', () => {
            expect(getContainer()).toBeNull();
            Toast.show({ message: 'Hola', type: 'info' });
            expect(getContainer()).not.toBeNull();
        });

        it('reutiliza el contenedor existente (no duplica)', () => {
            Toast.show({ message: 'Uno', type: 'info' });
            Toast.show({ message: 'Dos', type: 'info' });
            expect(document.querySelectorAll('#toast-container').length).toBe(1);
        });

        it('apila múltiples toasts en el contenedor', () => {
            Toast.show({ message: 'Toast 1', type: 'success' });
            Toast.show({ message: 'Toast 2', type: 'error' });
            Toast.show({ message: 'Toast 3', type: 'warning' });
            expect(getAllToasts().length).toBe(3);
        });

        it('no hace nada si no se pasa mensaje', () => {
            Toast.show({});
            expect(getAllToasts().length).toBe(0);
        });

        it('el toast muestra el mensaje indicado', () => {
            const msg = 'Operación completada con éxito';
            Toast.show({ message: msg, type: 'success' });
            const toastMsg = getContainer().querySelector('.toast-message');
            expect(toastMsg.textContent).toBe(msg);
        });

        it('devuelve el elemento DOM del toast', () => {
            const el = Toast.show({ message: 'Test', type: 'info' });
            expect(el).toBeInstanceOf(HTMLElement);
            expect(el.classList.contains('toast')).toBe(true);
        });

    });

    // --- Tipos de toast ---
    describe('Tipos de toast', () => {

        it('aplica clase toast-success para type="success"', () => {
            Toast.show({ message: 'OK', type: 'success' });
            expect(getAllToasts()[0].classList.contains('toast-success')).toBe(true);
        });

        it('aplica clase toast-error para type="error"', () => {
            Toast.show({ message: 'Fallo', type: 'error' });
            expect(getAllToasts()[0].classList.contains('toast-error')).toBe(true);
        });

        it('aplica clase toast-warning para type="warning"', () => {
            Toast.show({ message: 'Atención', type: 'warning' });
            expect(getAllToasts()[0].classList.contains('toast-warning')).toBe(true);
        });

        it('usa toast-info por defecto si no se especifica type', () => {
            Toast.show({ message: 'Info' });
            expect(getAllToasts()[0].classList.contains('toast-info')).toBe(true);
        });

        it('el toast tiene el icono SVG renderizado', () => {
            Toast.show({ message: 'Con icono', type: 'success' });
            const icon = getContainer().querySelector('.toast-icon svg');
            expect(icon).not.toBeNull();
        });

    });

    // --- Accesibilidad ---
    describe('Accesibilidad', () => {

        it('el contenedor tiene aria-live="polite"', () => {
            Toast.show({ message: 'Test', type: 'info' });
            expect(getContainer().getAttribute('aria-live')).toBe('polite');
        });

        it('cada toast tiene role="alert"', () => {
            Toast.show({ message: 'Test', type: 'error' });
            expect(getAllToasts()[0].getAttribute('role')).toBe('alert');
        });

        it('el botón de cierre tiene aria-label descriptivo', () => {
            Toast.show({ message: 'Test', type: 'info' });
            const closeBtn = getAllToasts()[0].querySelector('.toast-close');
            expect(closeBtn).not.toBeNull();
            expect(closeBtn.getAttribute('aria-label')).toBeTruthy();
        });

    });

    // --- Auto-dismiss ---
    describe('Auto-dismiss', () => {

        it('añade clase toast-exit al toast después del duration indicado', () => {
            Toast.show({ message: 'Temporal', type: 'info', duration: 2000 });
            expect(getAllToasts().length).toBe(1);

            vi.advanceTimersByTime(2100);

            // En jsdom, animationend no se dispara solo, pero sí la clase toast-exit
            const toast = getAllToasts()[0];
            expect(toast.classList.contains('toast-exit')).toBe(true);
        });

        it('con duration=0 el toast persiste indefinidamente', () => {
            Toast.show({ message: 'Permanente', type: 'warning', duration: 0 });
            vi.advanceTimersByTime(60000); // 1 minuto
            expect(getAllToasts().length).toBe(1);
            expect(getAllToasts()[0].classList.contains('toast-exit')).toBe(false);
        });

        it('el botón de cierre añade la clase toast-exit al hacer click', () => {
            Toast.show({ message: 'Click me', type: 'error', duration: 0 });
            const toast = getAllToasts()[0];
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.click();
            expect(toast.classList.contains('toast-exit')).toBe(true);
        });

    });

});
