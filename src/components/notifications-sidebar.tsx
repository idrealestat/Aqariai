import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, MessageSquare, Phone, Calendar, User, CheckCircle, Clock, AlertCircle, FileText, Trash2, Target, DollarSign, Share2 } from "lucide-react";
import { Badge } from "./ui/badge";
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

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, tab?: string) => void;
}

// استخدام دالة بسيطة لحساب الوقت المنقضي
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

// دالة لتحديد الأيقونة بناءً على النوع
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'customer_added':
      return <User className="w-5 h-5" />;
    case 'customer_updated':
      return <CheckCircle className="w-5 h-5" />;
    case 'ad_published':
      return <FileText className="w-5 h-5" />;
    case 'appointment_created':
    case 'appointment_updated':
    case 'appointment_reminder':
      return <Calendar className="w-5 h-5" />;
    case 'smart_match_found':
      return <Target className="w-5 h-5" />;
    case 'special_request_created':
    case 'special_request_matched':
      return <MessageSquare className="w-5 h-5" />;
    case 'finance_calculation_saved':
      return <DollarSign className="w-5 h-5" />;
    case 'social_media_posted':
      return <Share2 className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

// دالة لتحديد الألوان بناءً على النوع
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'customer_added':
      return 'bg-blue-100 text-blue-600';
    case 'customer_updated':
      return 'bg-green-100 text-green-600';
    case 'ad_published':
      return 'bg-purple-100 text-purple-600';
    case 'appointment_created':
    case 'appointment_updated':
      return 'bg-indigo-100 text-indigo-600';
    case 'appointment_reminder':
      return 'bg-orange-100 text-orange-600';
    case 'smart_match_found':
      return 'bg-emerald-100 text-emerald-600';
    case 'special_request_created':
      return 'bg-cyan-100 text-cyan-600';
    case 'special_request_matched':
      return 'bg-teal-100 text-teal-600';
    case 'finance_calculation_saved':
      return 'bg-amber-100 text-amber-600';
    case 'social_media_posted':
      return 'bg-pink-100 text-pink-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function NotificationsSidebar({ isOpen, onClose, onNavigate }: NotificationsSidebarProps) {
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
    // وضع علامة مقروء
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }

    // التنقل بناءً على نوع الإشعار
    if (notification.actionType === 'navigate_to_customer') {
      onNavigate('crm');
    } else if (notification.actionType === 'navigate_to_ad') {
      onNavigate('requests');
    } else if (notification.actionType === 'navigate_to_calendar') {
      onNavigate('calendar');
    } else if (notification.actionType === 'navigate_to_smart_matches') {
      onNavigate('smart-matches');
    } else if (notification.actionType === 'navigate_to_special_requests') {
      // فتح Left Slider مع صفحة الطلبات الخاصة
      window.dispatchEvent(new CustomEvent('openLeftSlider', { detail: { page: 'special-requests' } }));
    } else if (notification.actionType === 'navigate_to_finance') {
      // فتح Left Slider مع حاسبة التمويل
      window.dispatchEvent(new CustomEvent('openLeftSlider', { detail: { page: 'finance-calculator' } }));
    } else if (notification.actionType === 'navigate_to_social') {
      // فتح Left Slider مع النشر على التواصل الاجتماعي
      window.dispatchEvent(new CustomEvent('openLeftSlider', { detail: { page: 'social-media' } }));
    }

    onClose();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const handleDeleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notificationId);
    loadNotifications();
  };

  const handleDeleteAllNotifications = () => {
    deleteAllNotifications();
    loadNotifications();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Notifications Sidebar */}
          <motion.aside
            dir="rtl"
            className="fixed top-0 left-0 z-50 h-full w-[85%] md:w-[400px] bg-white shadow-2xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#f0fdf4] to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="w-6 h-6 text-[#01411C]" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#01411C]">الإشعارات</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="إغلاق الإشعارات"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1 text-xs bg-[#01411C] text-white rounded-full hover:bg-[#023a2a] transition-colors"
                >
                  قراءة الكل
                </button>
                <button 
                  onClick={handleDeleteAllNotifications}
                  className="px-3 py-1 text-xs border border-red-400 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                  حذف الكل
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={`p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer ${
                      !notification.read ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)} flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm truncate ${
                            !notification.read ? "font-bold text-[#01411C]" : "font-semibold text-gray-700"
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            aria-label="حذف الإشعار"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد إشعارات</h3>
                  <p className="text-sm text-gray-400">ستظهر الإشعارات الجديدة هنا</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  // ✅ إصلاح: الانتقال مباشرة لتبويب الإشعارات
                  onNavigate("settings", "notifications");
                  onClose();
                }}
                className="w-full text-sm text-[#01411C] hover:bg-white p-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                إعدادات الإشعارات
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}