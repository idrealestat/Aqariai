// /hooks/useNotificationsAPI.ts
// 🔔 Hook لربط الإشعارات الحقيقية (Real Notifications API)

import { useEffect, useCallback, useState } from 'react';
import NotificationsCore from '../core/ai-cores/AI_NotificationsEnhancedCore';

export function useNotificationsAPI(userId: string, setMessages?: any) {
  const [notifications, setNotifications] = useState<any[]>([]);

  // ✅ تهيئة نظام الإشعارات
  useEffect(() => {
    if (!userId) return;

    NotificationsCore.initializeNotificationsIntegration();

    const unsubscribe = NotificationsCore.subscribeToNotifications((notification) => {
      // إضافة الإشعار للقائمة
      setNotifications(prev => [notification, ...prev]);

      // إضافة الإشعار كرسالة في المساعد
      if (setMessages) {
        const notificationMessage = {
          role: 'assistant' as const,
          text: `🔔 ${notification.payload?.title || 'إشعار جديد'}: ${notification.payload?.message || ''}`,
          timestamp: Date.now(),
          actions: notification.contextActions || []
        };

        setMessages((prev: any[]) => [...prev, notificationMessage]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, setMessages]);

  // ✅ إرسال إشعار جديد
  const sendNotification = useCallback((notification: any) => {
    NotificationsCore.initializeNotificationsIntegration();
    // يمكن إضافة منطق إرسال الإشعار هنا
  }, []);

  // ✅ الحصول على الإشعارات
  const getNotifications = useCallback(() => {
    return notifications;
  }, [notifications]);

  return {
    notifications,
    sendNotification,
    getNotifications
  };
}
