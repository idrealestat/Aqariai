// 🔔 نظام الإشعارات المتقدم للـ CRM
// يدعم الإشعارات المباشرة والانتقال إلى البطاقات

export interface Notification {
  id: string;
  type: 
    | 'customer_added' 
    | 'customer_updated' 
    | 'ad_published' 
    | 'appointment_created'      // ✅ جديد - التقويم
    | 'appointment_updated'      // ✅ جديد - التقويم
    | 'appointment_reminder'     // ✅ جديد - التقويم
    | 'smart_match_found'        // ✅ جديد - الفرص الذكية
    | 'special_request_created'  // ✅ جديد - الطلبات الخاصة
    | 'special_request_matched'  // ✅ جديد - الطلبات الخاصة
    | 'finance_calculation_saved' // ✅ جديد - حاسبة التمويل
    | 'social_media_posted'      // ✅ جديد - التواصل الاجتماعي
    | 'general';
  title: string;
  message: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  timestamp: Date;
  read: boolean;
  actionType?: 
    | 'navigate_to_customer' 
    | 'navigate_to_ad' 
    | 'navigate_to_calendar'      // ✅ جديد
    | 'navigate_to_smart_matches' // ✅ جديد
    | 'navigate_to_special_requests' // ✅ جديد
    | 'navigate_to_finance'       // ✅ جديد
    | 'navigate_to_social';       // ✅ جديد
  actionData?: any;
}

const NOTIFICATIONS_KEY = 'crm_notifications_storage';
const UNREAD_CUSTOMERS_KEY = 'crm_unread_customers';
const UNREAD_ADS_KEY = 'crm_unread_ads';  // 🆕 للإعلانات غير المشاهدة

// 📌 حفظ الإشعارات
export const saveNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const notifications = getAllNotifications();
  
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false
  };
  
  notifications.unshift(newNotification);
  
  // الاحتفاظ بآخر 100 إشعار فقط
  const trimmedNotifications = notifications.slice(0, 100);
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmedNotifications));
  
  // إطلاق حدث للتحديث
  window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
    detail: newNotification 
  }));
  
  return newNotification;
};

// 📋 جلب جميع الإشعارات
export const getAllNotifications = (): Notification[] => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) return [];
    
    const notifications = JSON.parse(data);
    
    // تحويل timestamp إلى Date objects
    return notifications.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp)
    }));
  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error);
    return [];
  }
};

// ✅ وضع علامة مقروء على إشعار
export const markNotificationAsRead = (notificationId: string) => {
  const notifications = getAllNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

// ✅ وضع علامة مقروء على جميع الإشعارات
export const markAllNotificationsAsRead = () => {
  const notifications = getAllNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

// 🔢 عدد الإشعارات غير المقروءة
export const getUnreadNotificationsCount = (): number => {
  const notifications = getAllNotifications();
  return notifications.filter(n => !n.read).length;
};

// 🔴 إضافة عميل إلى قائمة غير المشاهدة (للدائرة الحمراء)
export const markCustomerAsUnread = (customerId: string) => {
  const unreadCustomers = getUnreadCustomers();
  
  if (!unreadCustomers.includes(customerId)) {
    unreadCustomers.push(customerId);
    localStorage.setItem(UNREAD_CUSTOMERS_KEY, JSON.stringify(unreadCustomers));
    window.dispatchEvent(new CustomEvent('customerUnreadStatusChanged', {
      detail: { customerId, unread: true }
    }));
  }
};

// ✅ إزالة عميل من قائمة غير المشاهدة
export const markCustomerAsRead = (customerId: string) => {
  const unreadCustomers = getUnreadCustomers();
  const filtered = unreadCustomers.filter(id => id !== customerId);
  
  localStorage.setItem(UNREAD_CUSTOMERS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('customerUnreadStatusChanged', {
    detail: { customerId, unread: false }
  }));
};

// 📋 جلب العملاء غير المشاهدين
export const getUnreadCustomers = (): string[] => {
  try {
    const data = localStorage.getItem(UNREAD_CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('خطأ في جلب العملاء غير المشاهدين:', error);
    return [];
  }
};

// ❓ هل العميل غير مشاهد؟
export const isCustomerUnread = (customerId: string): boolean => {
  const unreadCustomers = getUnreadCustomers();
  return unreadCustomers.includes(customerId);
};

// ═══════════════════════════════════════════════════════════════
// 🆕 نظام الإعلانات غير المشاهدة (للدائرة الحمراء على الإعلانات)
// ═══════════════════════════════════════════════════════════════

// 🔴 إضافة إعلان إلى قائمة غير المشاهدة
export const markAdAsUnread = (adId: string) => {
  const unreadAds = getUnreadAds();
  
  if (!unreadAds.includes(adId)) {
    unreadAds.push(adId);
    localStorage.setItem(UNREAD_ADS_KEY, JSON.stringify(unreadAds));
    window.dispatchEvent(new CustomEvent('adUnreadStatusChanged', {
      detail: { adId, unread: true }
    }));
  }
};

// ✅ إزالة إعلان من قائمة غير المشاهدة
export const markAdAsRead = (adId: string) => {
  const unreadAds = getUnreadAds();
  const filtered = unreadAds.filter(id => id !== adId);
  
  localStorage.setItem(UNREAD_ADS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('adUnreadStatusChanged', {
    detail: { adId, unread: false }
  }));
};

// 📋 جلب الإعلانات غير المشاهدة
export const getUnreadAds = (): string[] => {
  try {
    const data = localStorage.getItem(UNREAD_ADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('خطأ في جلب الإعلانات غير المشاهدة:', error);
    return [];
  }
};

// ❓ هل الإعلان غير مشاهد؟
export const isAdUnread = (adId: string): boolean => {
  const unreadAds = getUnreadAds();
  return unreadAds.includes(adId);
};

// 🚀 إنشاء إشعار عميل جديد
export const notifyNewCustomer = (customerData: {
  id: string;
  name: string;
  phone: string;
  adNumber?: string;
}) => {
  const notification = saveNotification({
    type: 'customer_added',
    title: '✅ تم إضافة عميل جديد',
    message: `تم إضافة العميل "${customerData.name}" إلى إدارة العملاء`,
    customerId: customerData.id,
    customerName: customerData.name,
    customerPhone: customerData.phone,
    actionType: 'navigate_to_customer',
    actionData: { customerId: customerData.id }
  });
  
  // وضع علامة غير مشاهد على العميل
  markCustomerAsUnread(customerData.id);
  
  return notification;
};

// 🔄 إنشاء إشعار تحديث عميل
export const notifyCustomerUpdated = (customerData: {
  id: string;
  name: string;
  phone: string;
  adNumber?: string;
}) => {
  const notification = saveNotification({
    type: 'customer_updated',
    title: '🔄 تم إضافة معلومات إلى اسم العميل',
    message: `تم تحديث معلومات العميل "${customerData.name}"`,
    customerId: customerData.id,
    customerName: customerData.name,
    customerPhone: customerData.phone,
    actionType: 'navigate_to_customer',
    actionData: { customerId: customerData.id }
  });
  
  // وضع علامة غير مشاهد على العميل
  markCustomerAsUnread(customerData.id);
  
  return notification;
};

// 📢 إنشاء إشعار إعلان منشور
export const notifyAdPublished = (adData: {
  adNumber: string;
  ownerName: string;
  ownerPhone: string;
  customerId: string;
  platformsCount: number;
}) => {
  const notification = saveNotification({
    type: 'ad_published',
    title: '📢 تم نشر إعلان جديد',
    message: `تم نشر الإعلان رقم ${adData.adNumber} للعميل "${adData.ownerName}" على ${adData.platformsCount} منصة`,
    customerId: adData.customerId,
    customerName: adData.ownerName,
    customerPhone: adData.ownerPhone,
    actionType: 'navigate_to_customer',
    actionData: { 
      customerId: adData.customerId,
      adNumber: adData.adNumber 
    }
  });
  
  // 🔴 وضع علامة غير مشاهد على العميل (الدائرة الحمراء)
  markCustomerAsUnread(adData.customerId);
  
  // 🔴 وضع علامة غير مشاهد على الإعلان (الدائرة الحمراء في لوحة التحكم)
  markAdAsUnread(adData.adNumber);
  
  return notification;
};

// 🗑️ حذف إشعار
export const deleteNotification = (notificationId: string) => {
  const notifications = getAllNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

// 🗑️ حذف جميع الإشعارات
export const deleteAllNotifications = () => {
  localStorage.removeItem(NOTIFICATIONS_KEY);
  window.dispatchEvent(new Event('notificationsUpdated'));
};

// 🔔 إظهار إشعار متصفح (اختياري)
export const showBrowserNotification = async (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
      dir: 'rtl',
      lang: 'ar'
    });
  }
};

// 🎯 التنقل إلى بطاقة العميل من الإشعار
export const navigateFromNotification = (notification: Notification) => {
  markNotificationAsRead(notification.id);
  
  if (notification.actionType === 'navigate_to_customer' && notification.customerId) {
    // إطلاق حدث مخصص للانتقال إلى بطاقة العميل
    window.dispatchEvent(new CustomEvent('navigateToCustomer', {
      detail: {
        customerId: notification.customerId,
        customerPhone: notification.customerPhone,
        fromNotification: true
      }
    }));
  }
};

// ═══════════════════════════════════════════════════════════════
// 📅 إشعارات التقويم والمواعيد
// ═══════════════════════════════════════════════════════════════

// 📅 إنشاء إشعار موعد جديد
export const notifyAppointmentCreated = (appointmentData: {
  id: string;
  title: string;
  customerName?: string;
  date: string;
  time: string;
}) => {
  const notification = saveNotification({
    type: 'appointment_created',
    title: '📅 تم إنشاء موعد جديد',
    message: `موعد "${appointmentData.title}" ${appointmentData.customerName ? `مع ${appointmentData.customerName}` : ''} في ${appointmentData.date} - ${appointmentData.time}`,
    actionType: 'navigate_to_calendar',
    actionData: { appointmentId: appointmentData.id }
  });
  
  return notification;
};

// 🔄 إنشاء إشعار تحديث موعد
export const notifyAppointmentUpdated = (appointmentData: {
  id: string;
  title: string;
  customerName?: string;
  date: string;
  time: string;
}) => {
  const notification = saveNotification({
    type: 'appointment_updated',
    title: '🔄 تم تحديث موعد',
    message: `تم تحديث موعد "${appointmentData.title}" ${appointmentData.customerName ? `مع ${appointmentData.customerName}` : ''} إلى ${appointmentData.date} - ${appointmentData.time}`,
    actionType: 'navigate_to_calendar',
    actionData: { appointmentId: appointmentData.id }
  });
  
  return notification;
};

// ⏰ إنشاء إشعار تذكير بموعد
export const notifyAppointmentReminder = (appointmentData: {
  id: string;
  title: string;
  customerName?: string;
  date: string;
  time: string;
  minutesUntil: number;
}) => {
  const notification = saveNotification({
    type: 'appointment_reminder',
    title: '⏰ تذكير: موعد قريب',
    message: `موعد "${appointmentData.title}" ${appointmentData.customerName ? `مع ${appointmentData.customerName}` : ''} بعد ${appointmentData.minutesUntil} دقيقة`,
    actionType: 'navigate_to_calendar',
    actionData: { appointmentId: appointmentData.id }
  });
  
  return notification;
};

// ═══════════════════════════════════════════════════════════════
// 🎯 إشعارات الفرص الذكية
// ═══════════════════════════════════════════════════════════════

// 🎯 إنشاء إشعار فرصة ذكية جديدة
export const notifySmartMatchFound = (matchData: {
  id: string;
  offerType: string;
  requestType: string;
  matchScore: number;
  location?: string;
}) => {
  const notification = saveNotification({
    type: 'smart_match_found',
    title: '🎯 تم إيجاد فرصة ذكية جديدة',
    message: `تطابق بين ${matchData.offerType} و ${matchData.requestType} بنسبة ${matchData.matchScore}%${matchData.location ? ` في ${matchData.location}` : ''}`,
    actionType: 'navigate_to_smart_matches',
    actionData: { matchId: matchData.id }
  });
  
  return notification;
};

// ═══════════════════════════════════════════════════════════════
// 📋 إشعارات الطلبات الخاصة
// ═══════════════════════════════════════════════════════════════

// 📋 إنشاء إشعار طلب خاص جديد
export const notifySpecialRequestCreated = (requestData: {
  id: string;
  propertyType: string;
  location: string;
  budget: string;
}) => {
  const notification = saveNotification({
    type: 'special_request_created',
    title: '📋 تم إنشاء طلب خاص جديد',
    message: `طلب ${requestData.propertyType} في ${requestData.location} بميزانية ${requestData.budget}`,
    actionType: 'navigate_to_special_requests',
    actionData: { requestId: requestData.id }
  });
  
  return notification;
};

// ✅ إنشاء إشعار تطابق طلب خاص
export const notifySpecialRequestMatched = (matchData: {
  requestId: string;
  propertyType: string;
  location: string;
  ownerName: string;
  ownerPhone: string;
}) => {
  const notification = saveNotification({
    type: 'special_request_matched',
    title: '✅ تم إيجاد تطابق لطلبك الخاص',
    message: `تم إيجاد ${matchData.propertyType} في ${matchData.location} - تواصل مع ${matchData.ownerName}`,
    actionType: 'navigate_to_special_requests',
    actionData: { 
      requestId: matchData.requestId,
      ownerPhone: matchData.ownerPhone
    }
  });
  
  return notification;
};

// ═══════════════════════════════════════════════════════════════
// 💰 إشعارات حاسبة التمويل
// ═══════════════════════════════════════════════════════════════

// 💰 إنشاء إشعار حفظ حساب تمويلي
export const notifyFinanceCalculationSaved = (calculationData: {
  id: string;
  propertyPrice: string;
  monthlyPayment: string;
  customerName?: string;
}) => {
  const notification = saveNotification({
    type: 'finance_calculation_saved',
    title: '💰 تم حفظ حساب تمويلي جديد',
    message: `عقار بقيمة ${calculationData.propertyPrice} - قسط شهري ${calculationData.monthlyPayment}${calculationData.customerName ? ` للعميل ${calculationData.customerName}` : ''}`,
    actionType: 'navigate_to_finance',
    actionData: { calculationId: calculationData.id }
  });
  
  return notification;
};

// ═══════════════════════════════════════════════════════════════
// 📱 إشعارات التواصل الاجتماعي
// ═══════════════════════════════════════════════════════════════

// 📱 إنشاء إشعار نشر على التواصل الاجتماعي
export const notifySocialMediaPosted = (postData: {
  id: string;
  platforms: string[];
  propertyType?: string;
  adNumber?: string;
}) => {
  const platformsText = postData.platforms.join(' و ');
  const notification = saveNotification({
    type: 'social_media_posted',
    title: '📱 تم النشر على التواصل الاجتماعي',
    message: `تم نشر ${postData.propertyType || 'المحتوى'}${postData.adNumber ? ` (${postData.adNumber})` : ''} على ${platformsText}`,
    actionType: 'navigate_to_social',
    actionData: { postId: postData.id }
  });
  
  return notification;
};