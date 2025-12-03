import { useState, useEffect } from 'react';
import { Bell, X, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BrokerResponse {
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerEmail: string;
  message: string;
  price?: number;
  commission?: number;
  timeline?: string;
  timestamp: number;
  ownerViewed?: boolean;
}

interface OwnerNotification {
  id: string;
  offerId: string;
  offerTitle: string;
  offerType: 'sale' | 'rent' | 'buy-request' | 'rent-request';
  brokerResponse: BrokerResponse;
  timestamp: number;
  read: boolean;
}

interface OwnerNotificationSystemProps {
  userId: string;
  onNavigateToOffer?: (offerId: string, offerType: string) => void;
}

export function OwnerNotificationSystem({ userId, onNavigateToOffer }: OwnerNotificationSystemProps) {
  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // تحميل الإشعارات من localStorage
  useEffect(() => {
    loadNotifications();
    
    // تحديث الإشعارات كل 5 ثواني
    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  // تحميل الإشعارات
  const loadNotifications = () => {
    try {
      const notifs = JSON.parse(localStorage.getItem(`owner-notifications-${userId}`) || '[]') as OwnerNotification[];
      
      // ترتيب حسب الأحدث
      const sortedNotifs = notifs.sort((a, b) => b.timestamp - a.timestamp);
      
      setNotifications(sortedNotifs);
      setUnreadCount(sortedNotifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('خطأ في تحميل الإشعارات:', error);
    }
  };

  // فتح الإشعارات
  const handleOpenNotifications = () => {
    setIsOpen(true);
  };

  // إغلاق الإشعارات
  const handleCloseNotifications = () => {
    setIsOpen(false);
  };

  // تعليم الإشعار كمقروء
  const markAsRead = (notificationId: string) => {
    const updatedNotifs = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    localStorage.setItem(`owner-notifications-${userId}`, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    setUnreadCount(updatedNotifs.filter(n => !n.read).length);
  };

  // تعليم جميع الإشعارات كمقروءة
  const markAllAsRead = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(`owner-notifications-${userId}`, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    setUnreadCount(0);
  };

  // حذف إشعار
  const deleteNotification = (notificationId: string) => {
    const updatedNotifs = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem(`owner-notifications-${userId}`, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
    setUnreadCount(updatedNotifs.filter(n => !n.read).length);
  };

  // حذف جميع الإشعارات
  const clearAllNotifications = () => {
    localStorage.setItem(`owner-notifications-${userId}`, JSON.stringify([]));
    setNotifications([]);
    setUnreadCount(0);
  };

  // التنقل للعرض
  const handleNotificationClick = (notification: OwnerNotification) => {
    markAsRead(notification.id);
    
    if (onNavigateToOffer) {
      onNavigateToOffer(notification.offerId, notification.offerType);
    }
    
    setIsOpen(false);
  };

  // الحصول على نص نوع العرض
  const getOfferTypeText = (type: string) => {
    switch (type) {
      case 'sale': return 'عرض بيع';
      case 'rent': return 'عرض إيجار';
      case 'buy-request': return 'طلب شراء';
      case 'rent-request': return 'طلب استئجار';
      default: return 'عرض';
    }
  };

  // تنسيق الوقت
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <>
      {/* أيقونة الجرس */}
      <button
        onClick={handleOpenNotifications}
        className="relative p-2 rounded-lg bg-transparent border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
      >
        <Bell className="w-6 h-6 text-[#D4AF37]" />
        
        {/* عداد الإشعارات */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          </motion.div>
        )}
      </button>

      {/* سلايدر الإشعارات */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية معتمة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseNotifications}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            {/* السلايدر */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] overflow-hidden"
              dir="rtl"
            >
              {/* الهيدر */}
              <div className="bg-gradient-to-br from-[#01411C] to-[#065f41] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-lg">الإشعارات</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-white/80">{unreadCount} إشعار جديد</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleCloseNotifications}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* أزرار الإجراءات */}
              {notifications.length > 0 && (
                <div className="p-4 bg-[#f0fdf4] border-b border-[#D4AF37]/20 flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex-1 px-3 py-2 bg-white text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تعليم الكل كمقروء
                    </button>
                  )}
                  
                  <button
                    onClick={clearAllNotifications}
                    className="flex-1 px-3 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    حذف الكل
                  </button>
                </div>
              )}

              {/* قائمة الإشعارات */}
              <div className="overflow-y-auto h-[calc(100%-120px)]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mb-4">
                      <Bell className="w-10 h-10 text-[#065f41]" />
                    </div>
                    <h4 className="font-bold text-[#01411C] mb-2">لا توجد إشعارات</h4>
                    <p className="text-[#065f41]/60 text-sm">
                      ستظهر هنا الإشعارات عندما يرد عليك وسيط
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#D4AF37]/10">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 cursor-pointer transition-colors ${
                          notification.read 
                            ? 'bg-white hover:bg-gray-50' 
                            : 'bg-[#f0fdf4] hover:bg-[#D4AF37]/5'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          {/* الأيقونة */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.read ? 'bg-gray-100' : 'bg-[#D4AF37]/20'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              notification.read ? 'text-gray-500' : 'text-[#01411C]'
                            }`} />
                          </div>

                          {/* المحتوى */}
                          <div className="flex-1 min-w-0">
                            {/* نقطة جديد */}
                            {!notification.read && (
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-red-500">جديد</span>
                              </div>
                            )}

                            {/* العنوان */}
                            <h4 className={`font-bold mb-1 ${
                              notification.read ? 'text-gray-700' : 'text-[#01411C]'
                            }`}>
                              رد جديد من وسيط
                            </h4>

                            {/* التفاصيل */}
                            <p className="text-sm text-[#065f41]/80 mb-2">
                              على <span className="font-semibold">{getOfferTypeText(notification.offerType)}</span>: {notification.offerTitle}
                            </p>

                            {/* اسم الوسيط */}
                            <div className="bg-white rounded-lg p-2 mb-2 border border-[#D4AF37]/20">
                              <p className="text-sm">
                                <span className="text-[#065f41]/60">الوسيط:</span>{' '}
                                <span className="font-semibold text-[#01411C]">{notification.brokerResponse.brokerName}</span>
                              </p>
                              {notification.brokerResponse.price && (
                                <p className="text-sm mt-1">
                                  <span className="text-[#065f41]/60">السعر المقترح:</span>{' '}
                                  <span className="font-bold text-[#D4AF37]">
                                    {notification.brokerResponse.price.toLocaleString('ar-SA')} ريال
                                  </span>
                                </p>
                              )}
                            </div>

                            {/* الوقت */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#065f41]/60">
                                {formatTime(notification.timestamp)}
                              </span>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" />
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}