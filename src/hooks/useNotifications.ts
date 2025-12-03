/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔔 useNotifications Hook - هوك استخدام الإشعارات
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Hook لإدارة الإشعارات في الواجهة
 * 
 * الميزات:
 * - Real-time updates
 * - Auto-refresh
 * - Action execution
 * - Settings management
 * 
 * تاريخ الإنشاء: 5 نوفمبر 2025
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import type { Notification, NotificationCategory, NotificationSettings } from '../api/notifications-real';
import { NotificationsAPI } from '../api/notifications-real';
import { useAIActions } from './useAIActions';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>(
    NotificationsAPI.getNotificationSettings()
  );
  const { executeAction } = useAIActions();

  // تحميل الإشعارات
  const loadNotifications = useCallback(() => {
    const userNotifications = NotificationsAPI.getUserNotifications(userId);
    setNotifications(userNotifications);
    setUnreadCount(NotificationsAPI.getUnreadCount(userId));
  }, [userId]);

  // الاستماع للتحديثات
  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    const handleSettingsUpdate = (event: any) => {
      setSettings(event.detail.settings);
    };

    window.addEventListener('notifications-updated', handleUpdate);
    window.addEventListener('notification-settings-updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('notifications-updated', handleUpdate);
      window.removeEventListener('notification-settings-updated', handleSettingsUpdate);
    };
  }, [loadNotifications]);

  // تحديد كمقروء
  const markAsRead = useCallback((notificationId: string) => {
    if (NotificationsAPI.markAsRead(notificationId)) {
      loadNotifications();
    }
  }, [loadNotifications]);

  // تحديد الكل كمقروء
  const markAllAsRead = useCallback(() => {
    NotificationsAPI.markAllAsRead(userId);
    loadNotifications();
  }, [userId, loadNotifications]);

  // حذف إشعار
  const deleteNotification = useCallback((notificationId: string) => {
    if (NotificationsAPI.deleteNotification(notificationId)) {
      loadNotifications();
    }
  }, [loadNotifications]);

  // حذف المقروءة
  const deleteReadNotifications = useCallback(() => {
    NotificationsAPI.deleteReadNotifications(userId);
    loadNotifications();
  }, [userId, loadNotifications]);

  // تنفيذ إجراء
  const executeNotificationAction = useCallback((action: any) => {
    executeAction(action, undefined, userId);
  }, [executeAction, userId]);

  // تحديث الإعدادات
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    NotificationsAPI.updateNotificationSettings(newSettings);
    setSettings(NotificationsAPI.getNotificationSettings());
  }, []);

  // جلب حسب الفئة
  const getByCategory = useCallback((category: NotificationCategory) => {
    return NotificationsAPI.getUserNotifications(userId, { category });
  }, [userId]);

  // جلب غير المقروءة فقط
  const getUnread = useCallback(() => {
    return NotificationsAPI.getUserNotifications(userId, { unreadOnly: true });
  }, [userId]);

  return {
    // Data
    notifications,
    unreadCount,
    settings,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
    executeNotificationAction,
    updateSettings,

    // Queries
    getByCategory,
    getUnread,

    // Refresh
    refresh: loadNotifications
  };
}

export default useNotifications;
