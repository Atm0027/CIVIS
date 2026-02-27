import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Notifications } from '../../public/js/notifications.js';

describe('Notifications Module', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should start with an empty list', () => {
        expect(Notifications.getAll()).toEqual([]);
        expect(Notifications.getUnreadCount()).toBe(0);
    });

    it('should add a notification', () => {
        const n = Notifications.add({ title: 'Test', message: 'Message' });
        expect(Notifications.getAll()).toHaveLength(1);
        expect(n.title).toBe('Test');
        expect(n.read).toBe(false);
    });

    it('should return unread count correctly', () => {
        Notifications.add({ title: '1' });
        Notifications.add({ title: '2' });
        expect(Notifications.getUnreadCount()).toBe(2);

        const all = Notifications.getAll();
        Notifications.markAsRead(all[0].id);
        expect(Notifications.getUnreadCount()).toBe(1);
    });

    it('should mark all as read', () => {
        Notifications.add({ title: '1' });
        Notifications.add({ title: '2' });
        Notifications.markAllAsRead();
        expect(Notifications.getUnreadCount()).toBe(0);
    });

    it('should remove a notification', () => {
        const n = Notifications.add({ title: '1' });
        Notifications.remove(n.id);
        expect(Notifications.getAll()).toHaveLength(0);
    });

    it('should emit a custom event when updated', () => {
        const spy = vi.fn();
        document.addEventListener('notificationsUpdated', spy);

        Notifications.add({ title: 'Event' });

        expect(spy).toHaveBeenCalled();
        document.removeEventListener('notificationsUpdated', spy);
    });

    it('should generate a system alert if DNI is missing', () => {
        const user = { name: 'Test', dni: null };
        Notifications.checkSystemAlerts(user);

        const all = Notifications.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].type).toBe('warning');
        expect(all[0].message).toContain('DNI');
    });

    it('should not duplicate DNI system alert', () => {
        const user = { name: 'Test', dni: null };
        Notifications.checkSystemAlerts(user);
        Notifications.checkSystemAlerts(user);

        expect(Notifications.getAll()).toHaveLength(1);
    });

    // ===== Tests para checkDeadlineAlerts =====

    it('should generate an alert for an event within 7 days', () => {
        // Crear una fecha 3 días en el futuro
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);
        const dateStr = futureDate.toISOString().split('T')[0];

        const events = [
            { id: 1, title: 'Plazo DNI', date: dateStr, end_date: null }
        ];

        Notifications.checkDeadlineAlerts(events);

        const all = Notifications.getAll();
        expect(all.length).toBeGreaterThanOrEqual(1);
        expect(all.some(n => n.message.includes('deadline-1-inicio'))).toBe(true);
        expect(all[0].type).toBe('warning');
        expect(all[0].link).toBe('calendario.html');
    });

    it('should NOT generate an alert for a distant event (>7 days)', () => {
        const farDate = new Date();
        farDate.setDate(farDate.getDate() + 30);
        const dateStr = farDate.toISOString().split('T')[0];

        const events = [
            { id: 2, title: 'Plazo lejano', date: dateStr, end_date: null }
        ];

        Notifications.checkDeadlineAlerts(events);

        const all = Notifications.getAll();
        expect(all).toHaveLength(0);
    });

    it('should NOT duplicate deadline alerts for the same event', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);
        const dateStr = futureDate.toISOString().split('T')[0];

        const events = [
            { id: 3, title: 'Plazo repetido', date: dateStr, end_date: null }
        ];

        Notifications.checkDeadlineAlerts(events);
        Notifications.checkDeadlineAlerts(events);

        const matching = Notifications.getAll().filter(n => n.message.includes('deadline-3-inicio'));
        expect(matching).toHaveLength(1);
    });

    it('should generate alerts for both start and end dates when within range', () => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);

        const events = [
            {
                id: 4,
                title: 'Plazo doble',
                date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }
        ];

        Notifications.checkDeadlineAlerts(events);

        const all = Notifications.getAll();
        expect(all.some(n => n.message.includes('deadline-4-inicio'))).toBe(true);
        expect(all.some(n => n.message.includes('deadline-4-fin'))).toBe(true);
        expect(all).toHaveLength(2);
    });
});
