/**
 * 🔔 نظام الإشعارات الكامل
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: عرض إشعارات ردود الوسطاء للمالك
 * 📌 الميزات: جرس + سلايدر + دائرة حمراء نابضة + تتبع ذكي
 * ────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '../ui/badge';
import { NotificationSlider } from './NotificationSlider';

interface NotificationSystemProps {
  currentUser: any;
  onNavigateToOffer?: (offerId: string, offerType: 'offer' | 'request') => void;
}

export interface Notification {
  id: string;
  type: 'broker_response';
  offerId: string;
  offerType: 'offer' | 'request';
  offerTitle: string;
  brokerName: string;
  brokerPhone: string;
  responseId: string;
  createdAt: string;
  read: boolean;
}

export function NotificationSystem({ currentUser, onNavigateToOffer }: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // تحميل الإشعارات من localStorage
  useEffect(() => {
    if (!currentUser?.phone) return;

    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem(`notifications-${currentUser.phone}`);
        if (stored) {
          const notifs: Notification[] = JSON.parse(stored);
          setNotifications(notifs);
          setUnreadCount(notifs.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('❌ [Notifications] خطأ في تحميل الإشعارات:', error);
      }
    };

    loadNotifications();

    // مراقبة التغييرات في localStorage
    const checkForNewNotifications = setInterval(() => {
      loadNotifications();
    }, 2000); // كل ثانيتين

    return () => clearInterval(checkForNewNotifications);
  }, [currentUser?.phone]);

  // تحديث الإشعارات عند فتح السلايدر
  const handleOpen = () => {
    setIsOpen(true);
  };

  // وضع علامة "مقروء" على إشعار
  const markAsRead = (notificationId: string) => {
    if (!currentUser?.phone) return;

    try {
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      setNotifications(updated);
      localStorage.setItem(`notifications-${currentUser.phone}`, JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.read).length);
    } catch (error) {
      console.error('❌ [Notifications] خطأ في تحديث الإشعار:', error);
    }
  };

  // حذف إشعار
  const deleteNotification = (notificationId: string) => {
    if (!currentUser?.phone) return;

    try {
      const updated = notifications.filter(n => n.id !== notificationId);
      setNotifications(updated);
      localStorage.setItem(`notifications-${currentUser.phone}`, JSON.stringify(updated));
      setUnreadCount(updated.filter(n => !n.read).length);
    } catch (error) {
      console.error('❌ [Notifications] خطأ في حذف الإشعار:', error);
    }
  };

  // حذف جميع الإشعارات
  const clearAll = () => {
    if (!currentUser?.phone) return;

    try {
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem(`notifications-${currentUser.phone}`);
    } catch (error) {
      console.error('❌ [Notifications] خطأ في حذف الإشعارات:', error);
    }
  };

  // الانتقال إلى العرض/الطلب
  const handleNavigate = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    onNavigateToOffer?.(notification.offerId, notification.offerType);
  };

  return (
    <>
      {/* أيقونة الجرس */}
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="الإشعارات"
      >
        <Bell className="w-6 h-6 text-white" />
        
        {/* عداد الإشعارات */}
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center p-0 px-1.5 animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* سلايدر الإشعارات */}
      <NotificationSlider
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNavigate}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onClearAll={clearAll}
      />
    </>
  );
}

/**
 * 📝 دالة مساعدة: إضافة إشعار جديد
 */
export function addBrokerResponseNotification(
  ownerPhone: string,
  offerId: string,
  offerType: 'offer' | 'request',
  offerTitle: string,
  brokerName: string,
  brokerPhone: string,
  responseId: string
) {
  try {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: 'broker_response',
      offerId,
      offerType,
      offerTitle,
      brokerName,
      brokerPhone,
      responseId,
      createdAt: new Date().toISOString(),
      read: false
    };

    const stored = localStorage.getItem(`notifications-${ownerPhone}`);
    const existing: Notification[] = stored ? JSON.parse(stored) : [];
    
    // تجنب التكرار
    const isDuplicate = existing.some(n => 
      n.responseId === responseId && n.offerId === offerId
    );
    
    if (!isDuplicate) {
      existing.unshift(notification); // إضافة في البداية
      
      // حفظ آخر 100 إشعار فقط
      const limited = existing.slice(0, 100);
      localStorage.setItem(`notifications-${ownerPhone}`, JSON.stringify(limited));
      
      console.log('✅ [Notifications] تم إضافة إشعار جديد:', notification);
    }
  } catch (error) {
    console.error('❌ [Notifications] خطأ في إضافة الإشعار:', error);
  }
}

/**
 * 📝 دالة مساعدة: حذف إشعار عند قبول/رفض
 */
export function removeNotificationByResponse(ownerPhone: string, responseId: string) {
  try {
    const stored = localStorage.getItem(`notifications-${ownerPhone}`);
    if (!stored) return;

    const notifications: Notification[] = JSON.parse(stored);
    const updated = notifications.filter(n => n.responseId !== responseId);
    
    localStorage.setItem(`notifications-${ownerPhone}`, JSON.stringify(updated));
    console.log('✅ [Notifications] تم حذف الإشعار للرد:', responseId);
  } catch (error) {
    console.error('❌ [Notifications] خطأ في حذف الإشعار:', error);
  }
}
