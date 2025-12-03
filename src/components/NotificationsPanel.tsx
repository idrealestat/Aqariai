import React, { useState, useEffect } from 'react';
import { Bell, X, UserPlus, UserCheck, FileText, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import {
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  navigateFromNotification,
  type Notification
} from '../utils/notificationsSystem';
// استخدام دالة بسيطة بدلاً من date-fns
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return date.toLocaleDateString('ar-SA');
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    const allNotifications = getAllNotifications();
    setNotifications(allNotifications);
    setUnreadCount(getUnreadNotificationsCount());
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notificationsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate);
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    navigateFromNotification(notification);
    onClose();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleDeleteAll = () => {
    if (confirm('هل تريد حذف جميع الإشعارات؟')) {
      deleteAllNotifications();
    }
  };

  const handleDeleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'customer_added':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'customer_updated':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'ad_published':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="fixed top-0 left-0 w-full max-w-md h-full bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <Card className="h-full rounded-none border-0 flex flex-col">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#01411C] to-[#065f41] text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                <div>
                  <CardTitle className="text-white">الإشعارات</CardTitle>
                  {unreadCount > 0 && (
                    <p className="text-xs text-white/80 mt-1">
                      {unreadCount} إشعار غير مقروء
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex gap-2 p-3 border-b bg-gray-50 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs"
              >
                ✓ وضع علامة مقروء على الكل
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3 ml-1" />
                حذف الكل
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Bell className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-center">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}

                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`font-bold text-sm ${
                              !notification.read ? 'text-[#01411C]' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-red-600 flex-shrink-0"
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>

                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>

                          {/* Customer info */}
                          {notification.customerName && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span>👤 {notification.customerName}</span>
                              {notification.customerPhone && (
                                <span>📱 {notification.customerPhone}</span>
                              )}
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {notification.actionType === 'navigate_to_customer' && (
                              <Badge variant="outline" className="text-xs">
                                اضغط للانتقال
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 🔔 زر الإشعارات (للاستخدام في الهيدر)
export const NotificationsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(getUnreadNotificationsCount());
    };

    updateCount();
    window.addEventListener('notificationsUpdated', updateCount);

    return () => {
      window.removeEventListener('notificationsUpdated', updateCount);
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};