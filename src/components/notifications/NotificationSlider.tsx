/**
 * 📱 سلايدر الإشعارات
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: عرض قائمة الإشعارات في سلايدر جانبي
 * 📌 التصميم: Sheet component + قائمة إشعارات
 * ────────────────────────────────────────────────────────────────
 */

import { Bell, X, Trash2, Check, User, Phone, Calendar } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Notification } from './NotificationSystem';

interface NotificationSliderProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationSlider({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onDelete,
  onClearAll
}: NotificationSliderProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-[400px] p-0" dir="rtl">
        {/* Header */}
        <SheetHeader className="bg-gradient-to-r from-[#01411C] to-[#01411C]/80 text-white px-6 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white flex items-center gap-2">
              <Bell className="w-6 h-6" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <SheetDescription className="text-white/90 text-sm">
            تتبع ردود الوسطاء على عروضك وطلباتك
          </SheetDescription>
        </SheetHeader>

        {/* الأزرار العلوية */}
        {notifications.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-200 flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  notifications.forEach(n => {
                    if (!n.read) onMarkAsRead(n.id);
                  });
                }}
                className="flex-1 text-sm"
              >
                <Check className="w-4 h-4 ml-1" />
                وضع علامة مقروء للكل
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="flex-1 text-sm text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف الكل
            </Button>
          </div>
        )}

        {/* قائمة الإشعارات */}
        <ScrollArea className="h-[calc(100vh-160px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bell className="w-16 h-16 mb-4" />
              <p className="text-lg font-bold">لا توجد إشعارات</p>
              <p className="text-sm mt-1">سيتم إعلامك عند استلام عروض من الوسطاء</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                    !notification.read ? 'bg-green-50' : ''
                  }`}
                  onClick={() => onNotificationClick(notification)}
                >
                  {/* نقطة حمراء للإشعارات غير المقروءة */}
                  {!notification.read && (
                    <div className="absolute top-4 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* أيقونة */}
                    <div className="w-10 h-10 bg-gradient-to-br from-[#01411C] to-[#01411C]/80 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>

                    {/* المحتوى */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#01411C] mb-1">
                        عرض جديد من وسيط
                      </h4>
                      <p className="text-gray-700 text-sm mb-2">
                        <span className="font-bold">{notification.brokerName}</span> أرسل عرضاً على{' '}
                        <span className="font-bold">
                          {notification.offerType === 'offer' ? 'عرضك' : 'طلبك'}
                        </span>:{' '}
                        <span className="text-[#01411C]">{notification.offerTitle}</span>
                      </p>

                      {/* معلومات إضافية */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {notification.brokerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {notification.brokerPhone}
                        </span>
                      </div>

                      {/* التاريخ */}
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notification.createdAt)}
                      </div>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* خط فاصل للإشعارات غير المقروءة */}
                  {!notification.read && (
                    <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
