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
});
