/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔔 Real Notifications API - نظام الإشعارات الحقيقي الشامل
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * نظام إشعارات متكامل مع جميع أجزاء التطبيق
 * 
 * الميزات:
 * - Real-time notifications
 * - Event-driven architecture
 * - Multi-category support
 * - Read/Unread tracking
 * - Priority levels
 * - Action buttons
 * - localStorage persistence
 * 
 * تاريخ الإنشاء: 5 نوفمبر 2025
 * آخر تحديث: 5 نوفمبر 2025
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📊 TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationCategory = 
  | 'customer'          // إدارة العملاء
  | 'appointment'       // المواعيد
  | 'property'          // العقارات
  | 'platform'          // المنصات العقارية
  | 'social'            // التواصل الاجتماعي
  | 'business_card'     // بطاقة الأعمال
  | 'analytics'         // التحليلات
  | 'request'           // الطلبات
  | 'offer'             // العروض
  | 'system';           // النظام

export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

export type NotificationAction = {
  label: string;
  action: string;
  params?: Record<string, any>;
};

export interface Notification {
  id: string;
  userId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  
  // المحتوى
  title: string;
  message: string;
  icon?: string;
  
  // البيانات المرتبطة
  relatedId?: string;           // معرف العنصر المرتبط
  relatedType?: string;         // نوع العنصر
  metadata?: Record<string, any>; // بيانات إضافية
  
  // الإجراءات
  actions?: NotificationAction[];
  
  // الحالة
  read: boolean;
  archived: boolean;
  
  // التواريخ
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 💾 STORAGE
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'aqar_notifications';
const SETTINGS_KEY = 'aqar_notification_settings';

/**
 * إعدادات الإشعارات
 */
export interface NotificationSettings {
  enabled: boolean;
  categories: Record<NotificationCategory, boolean>;
  sound: boolean;
  desktop: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  categories: {
    customer: true,
    appointment: true,
    property: true,
    platform: true,
    social: true,
    business_card: true,
    analytics: true,
    request: true,
    offer: true,
    system: true
  },
  sound: true,
  desktop: true
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    
    // إطلاق event للتحديث
    window.dispatchEvent(new CustomEvent('notifications-updated', {
      detail: { notifications }
    }));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

function getSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📢 NOTIFICATION CREATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * إنشاء إشعار عام
 */
export function createNotification(data: {
  userId: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  relatedId?: string;
  relatedType?: string;
  metadata?: Record<string, any>;
  actions?: NotificationAction[];
  expiresIn?: number; // بالساعات
}): Notification {
  const settings = getSettings();
  
  // التحقق من تفعيل الإشعارات
  if (!settings.enabled || !settings.categories[data.category]) {
    console.log('Notifications disabled for category:', data.category);
  }
  
  const notification: Notification = {
    id: generateId(),
    userId: data.userId,
    category: data.category,
    priority: data.priority || 'normal',
    title: data.title,
    message: data.message,
    icon: data.icon,
    relatedId: data.relatedId,
    relatedType: data.relatedType,
    metadata: data.metadata,
    actions: data.actions,
    read: false,
    archived: false,
    createdAt: new Date().toISOString(),
    expiresAt: data.expiresIn 
      ? new Date(Date.now() + data.expiresIn * 60 * 60 * 1000).toISOString()
      : undefined
  };
  
  const notifications = getNotifications();
  notifications.unshift(notification);
  saveNotifications(notifications);
  
  // إشعار Desktop إذا كان مفعل
  if (settings.desktop && settings.enabled && settings.categories[data.category]) {
    showDesktopNotification(notification);
  }
  
  console.log('✅ تم إنشاء إشعار:', notification.title);
  
  return notification;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1️⃣ إشعارات إدارة العملاء (CRM)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * عميل جديد مُضاف
 */
export function notifyCustomerAdded(userId: string, customer: any) {
  return createNotification({
    userId,
    category: 'customer',
    priority: 'normal',
    title: '✅ تم إضافة عميل جديد',
    message: `تم إضافة العميل ${customer.name} بنجاح`,
    icon: '👤',
    relatedId: customer.id,
    relatedType: 'customer',
    metadata: { customerName: customer.name, customerPhone: customer.phone },
    actions: [
      { label: 'عرض البطاقة', action: 'open_customer_card', params: { customerId: customer.id } }
    ]
  });
}

/**
 * تحديث بيانات عميل
 */
export function notifyCustomerUpdated(userId: string, customer: any, changes: string[]) {
  return createNotification({
    userId,
    category: 'customer',
    priority: 'low',
    title: '📝 تم تحديث بيانات عميل',
    message: `تم تحديث: ${changes.join('، ')} للعميل ${customer.name}`,
    icon: '✏️',
    relatedId: customer.id,
    relatedType: 'customer',
    metadata: { customerName: customer.name, changes },
    actions: [
      { label: 'عرض التغييرات', action: 'open_customer_card', params: { customerId: customer.id } }
    ]
  });
}

/**
 * إضافة سلايد جديد في بطاقة العميل
 */
export function notifyCustomerSlideAdded(userId: string, customer: any, slideType: string) {
  return createNotification({
    userId,
    category: 'customer',
    priority: 'normal',
    title: '📎 إضافة محتوى جديد',
    message: `تم إضافة ${slideType} للعميل ${customer.name}`,
    icon: '📎',
    relatedId: customer.id,
    relatedType: 'customer',
    metadata: { customerName: customer.name, slideType },
    actions: [
      { label: 'عرض المحتوى', action: 'open_customer_card', params: { customerId: customer.id } }
    ]
  });
}

/**
 * تعيين عميل لوسيط
 */
export function notifyCustomerAssigned(userId: string, customer: any, agentName: string) {
  return createNotification({
    userId,
    category: 'customer',
    priority: 'high',
    title: '👥 تعيين عميل جديد',
    message: `تم تعيين العميل ${customer.name} إلى ${agentName}`,
    icon: '🎯',
    relatedId: customer.id,
    relatedType: 'customer',
    metadata: { customerName: customer.name, agentName },
    actions: [
      { label: 'عرض البطاقة', action: 'open_customer_card', params: { customerId: customer.id } }
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 2️⃣ إشعارات المواعيد (Calendar)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * موعد جديد مُضاف
 */
export function notifyAppointmentAdded(userId: string, appointment: any) {
  return createNotification({
    userId,
    category: 'appointment',
    priority: 'high',
    title: '📅 موعد جديد',
    message: `تم إضافة موعد: ${appointment.title}`,
    icon: '📅',
    relatedId: appointment.id,
    relatedType: 'appointment',
    metadata: { 
      title: appointment.title, 
      start: appointment.start,
      clientName: appointment.client_name 
    },
    actions: [
      { label: 'عرض التفاصيل', action: 'navigate_calendar', params: { appointmentId: appointment.id } }
    ],
    expiresIn: 24
  });
}

/**
 * تحديث موعد
 */
export function notifyAppointmentUpdated(userId: string, appointment: any) {
  return createNotification({
    userId,
    category: 'appointment',
    priority: 'normal',
    title: '📝 تحديث موعد',
    message: `تم تحديث الموعد: ${appointment.title}`,
    icon: '✏️',
    relatedId: appointment.id,
    relatedType: 'appointment',
    metadata: { title: appointment.title, start: appointment.start },
    actions: [
      { label: 'عرض التفاصيل', action: 'navigate_calendar', params: { appointmentId: appointment.id } }
    ]
  });
}

/**
 * إلغاء موعد
 */
export function notifyAppointmentCancelled(userId: string, appointment: any) {
  return createNotification({
    userId,
    category: 'appointment',
    priority: 'high',
    title: '❌ إلغاء موعد',
    message: `تم إلغاء الموعد: ${appointment.title}`,
    icon: '🚫',
    relatedId: appointment.id,
    relatedType: 'appointment',
    metadata: { title: appointment.title, clientName: appointment.client_name }
  });
}

/**
 * تذكير بموعد قريب
 */
export function notifyAppointmentReminder(userId: string, appointment: any, minutesBefore: number) {
  return createNotification({
    userId,
    category: 'appointment',
    priority: 'critical',
    title: '⏰ تذكير بموعد',
    message: `موعد بعد ${minutesBefore} دقيقة: ${appointment.title}`,
    icon: '⏰',
    relatedId: appointment.id,
    relatedType: 'appointment',
    metadata: { title: appointment.title, start: appointment.start },
    actions: [
      { label: 'عرض التفاصيل', action: 'navigate_calendar', params: { appointmentId: appointment.id } }
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 3️⃣ إشعارات المنصات العقارية (Platforms)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * نشر إعلان على المنصات
 */
export function notifyPropertyPublished(userId: string, property: any, platforms: string[]) {
  return createNotification({
    userId,
    category: 'platform',
    priority: 'high',
    title: '🎉 تم نشر الإعلان',
    message: `تم نشر "${property.title}" على ${platforms.join('، ')}`,
    icon: '🏠',
    relatedId: property.id,
    relatedType: 'property',
    metadata: { 
      propertyTitle: property.title, 
      platforms,
      publishedAt: new Date().toISOString()
    },
    actions: [
      { label: 'عرض الإعلان', action: 'view_property', params: { propertyId: property.id } }
    ]
  });
}

/**
 * فشل النشر على منصة
 */
export function notifyPublishFailed(userId: string, property: any, platform: string, error: string) {
  return createNotification({
    userId,
    category: 'platform',
    priority: 'critical',
    title: '❌ فشل النشر',
    message: `فشل نشر "${property.title}" على ${platform}: ${error}`,
    icon: '⚠️',
    relatedId: property.id,
    relatedType: 'property',
    metadata: { propertyTitle: property.title, platform, error },
    actions: [
      { label: 'إعادة المحاولة', action: 'retry_publish', params: { propertyId: property.id, platform } }
    ]
  });
}

/**
 * تحديث حالة النشر
 */
export function notifyPlatformStatusUpdated(userId: string, property: any, platform: string, status: string) {
  const statusEmoji = status === 'active' ? '✅' : status === 'paused' ? '⏸️' : '🔄';
  return createNotification({
    userId,
    category: 'platform',
    priority: 'normal',
    title: `${statusEmoji} تحديث حالة النشر`,
    message: `تم تحديث حالة "${property.title}" على ${platform} إلى: ${status}`,
    icon: statusEmoji,
    relatedId: property.id,
    relatedType: 'property',
    metadata: { propertyTitle: property.title, platform, status }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 4️⃣ إشعارات التواصل الاجتماعي (Social Media)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * نشر منشور على التواصل الاجتماعي
 */
export function notifySocialPostPublished(userId: string, post: any, platforms: string[]) {
  return createNotification({
    userId,
    category: 'social',
    priority: 'normal',
    title: '📱 تم النشر على وسائل التواصل',
    message: `تم نشر المنشور على: ${platforms.join('، ')}`,
    icon: '✅',
    relatedId: post.id,
    relatedType: 'social_post',
    metadata: { 
      postId: post.id,
      platforms,
      publishedAt: new Date().toISOString()
    },
    actions: [
      { label: 'عرض الإحصائيات', action: 'view_post_analytics', params: { postId: post.id } }
    ]
  });
}

/**
 * فشل النشر على منصة تواصل
 */
export function notifySocialPostFailed(userId: string, post: any, platform: string, error: string) {
  return createNotification({
    userId,
    category: 'social',
    priority: 'high',
    title: '❌ فشل النشر',
    message: `فشل النشر على ${platform}: ${error}`,
    icon: '⚠️',
    relatedId: post.id,
    relatedType: 'social_post',
    metadata: { postId: post.id, platform, error },
    actions: [
      { label: 'إعادة المحاولة', action: 'retry_social_publish', params: { postId: post.id, platform } }
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 5️⃣ إشعارات بطاقة الأعمال (Business Card)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * طلب جدولة موعد من بطاقة الأعمال
 */
export function notifyAppointmentRequest(userId: string, data: any) {
  return createNotification({
    userId,
    category: 'business_card',
    priority: 'high',
    title: '📅 طلب جدولة موعد',
    message: `${data.name} يطلب جدولة موعد`,
    icon: '📞',
    relatedId: data.id,
    relatedType: 'appointment_request',
    metadata: { 
      name: data.name, 
      phone: data.phone, 
      preferredDate: data.preferredDate 
    },
    actions: [
      { label: 'جدولة الموعد', action: 'schedule_appointment', params: { requestId: data.id } },
      { label: 'التواصل', action: 'contact_client', params: { phone: data.phone } }
    ]
  });
}

/**
 * طلب سند قبض
 */
export function notifyReceiptRequest(userId: string, data: any) {
  return createNotification({
    userId,
    category: 'business_card',
    priority: 'high',
    title: '💰 طلب سند قبض',
    message: `${data.name} يطلب سند قبض بمبلغ ${data.amount} ريال`,
    icon: '💵',
    relatedId: data.id,
    relatedType: 'receipt_request',
    metadata: { 
      name: data.name, 
      phone: data.phone, 
      amount: data.amount 
    },
    actions: [
      { label: 'إنشاء السند', action: 'create_receipt', params: { requestId: data.id } }
    ]
  });
}

/**
 * طلب حسبة تمويل
 */
export function notifyFinancingRequest(userId: string, data: any) {
  return createNotification({
    userId,
    category: 'business_card',
    priority: 'high',
    title: '🏦 طلب حسبة تمويل',
    message: `${data.name} يطلب حسبة تمويل لعقار بقيمة ${data.propertyValue} ريال`,
    icon: '💳',
    relatedId: data.id,
    relatedType: 'financing_request',
    metadata: { 
      name: data.name, 
      phone: data.phone, 
      propertyValue: data.propertyValue 
    },
    actions: [
      { label: 'إرسال الحسبة', action: 'send_financing', params: { requestId: data.id } }
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 6️⃣ إشعارات العروض والطلبات (Offers/Requests)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * عرض جديد
 */
export function notifyOfferAdded(userId: string, offer: any) {
  return createNotification({
    userId,
    category: 'offer',
    priority: 'normal',
    title: '🏠 عرض جديد',
    message: `تم إضافة عرض: ${offer.title}`,
    icon: '✨',
    relatedId: offer.id,
    relatedType: 'offer',
    metadata: { offerTitle: offer.title, price: offer.price },
    actions: [
      { label: 'عرض التفاصيل', action: 'view_offer', params: { offerId: offer.id } }
    ]
  });
}

/**
 * تحديث حالة عرض
 */
export function notifyOfferStatusChanged(userId: string, offer: any, oldStatus: string, newStatus: string) {
  return createNotification({
    userId,
    category: 'offer',
    priority: 'high',
    title: '🔄 تحديث حالة عرض',
    message: `تم تحديث حالة "${offer.title}" من ${oldStatus} إلى ${newStatus}`,
    icon: newStatus === 'active' ? '✅' : newStatus === 'hidden' ? '🔒' : '📦',
    relatedId: offer.id,
    relatedType: 'offer',
    metadata: { offerTitle: offer.title, oldStatus, newStatus }
  });
}

/**
 * طلب جديد
 */
export function notifyRequestAdded(userId: string, request: any) {
  return createNotification({
    userId,
    category: 'request',
    priority: request.urgency === 'مستعجل' ? 'high' : 'normal',
    title: request.urgency === 'مستعجل' ? '🚨 طلب مستعجل' : '📋 طلب جديد',
    message: `طلب جديد: ${request.title}`,
    icon: '📝',
    relatedId: request.id,
    relatedType: 'request',
    metadata: { requestTitle: request.title, budget: request.budget, urgency: request.urgency },
    actions: [
      { label: 'عرض التفاصيل', action: 'view_request', params: { requestId: request.id } }
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 7️⃣ إشعارات التحليلات (Analytics)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ارتفاع في المشاهدات
 */
export function notifyHighViews(userId: string, property: any, viewCount: number) {
  return createNotification({
    userId,
    category: 'analytics',
    priority: 'normal',
    title: '📈 ارتفاع في المشاهدات',
    message: `"${property.title}" حصل على ${viewCount} مشاهدة في آخر 24 ساعة!`,
    icon: '👀',
    relatedId: property.id,
    relatedType: 'property',
    metadata: { propertyTitle: property.title, viewCount },
    actions: [
      { label: 'عرض الإحصائيات', action: 'view_analytics', params: { propertyId: property.id } }
    ]
  });
}

/**
 * انخفاض في المشاهدات
 */
export function notifyLowViews(userId: string, property: any, viewCount: number) {
  return createNotification({
    userId,
    category: 'analytics',
    priority: 'high',
    title: '📉 انخفاض في المشاهدات',
    message: `"${property.title}" انخفضت مشاهداته إلى ${viewCount} فقط`,
    icon: '⚠️',
    relatedId: property.id,
    relatedType: 'property',
    metadata: { propertyTitle: property.title, viewCount },
    actions: [
      { label: 'تحسين الإعلان', action: 'edit_property', params: { propertyId: property.id } }
    ]
  });
}

/**
 * تنبيه بتغير الأسعار
 */
export function notifyPriceChange(userId: string, area: string, changePercent: number, direction: 'up' | 'down') {
  const icon = direction === 'up' ? '📈' : '📉';
  const verb = direction === 'up' ? 'ارتفعت' : 'انخفضت';
  
  return createNotification({
    userId,
    category: 'analytics',
    priority: 'high',
    title: `${icon} تغير في الأسعار`,
    message: `${verb} أسعار ${area} بنسبة ${Math.abs(changePercent)}%`,
    icon,
    metadata: { area, changePercent, direction },
    actions: [
      { label: 'عرض التحليل', action: 'view_market_analysis', params: { area } }
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 📱 DESKTOP NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

async function showDesktopNotification(notification: Notification) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  
  // طلب الإذن
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/logo.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'critical'
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * جلب جميع الإشعارات للمستخدم
 */
export function getUserNotifications(userId: string, options?: {
  unreadOnly?: boolean;
  category?: NotificationCategory;
  limit?: number;
}): Notification[] {
  let notifications = getNotifications().filter(n => n.userId === userId);
  
  // تصفية غير المقروءة فقط
  if (options?.unreadOnly) {
    notifications = notifications.filter(n => !n.read);
  }
  
  // تصفية حسب الفئة
  if (options?.category) {
    notifications = notifications.filter(n => n.category === options.category);
  }
  
  // الحد الأقصى
  if (options?.limit) {
    notifications = notifications.slice(0, options.limit);
  }
  
  return notifications;
}

/**
 * تحديد إشعار كمقروء
 */
export function markAsRead(notificationId: string): boolean {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  
  if (index === -1) return false;
  
  notifications[index].read = true;
  notifications[index].readAt = new Date().toISOString();
  
  saveNotifications(notifications);
  return true;
}

/**
 * تحديد جميع الإشعارات كمقروءة
 */
export function markAllAsRead(userId: string): number {
  const notifications = getNotifications();
  let count = 0;
  
  notifications.forEach(n => {
    if (n.userId === userId && !n.read) {
      n.read = true;
      n.readAt = new Date().toISOString();
      count++;
    }
  });
  
  if (count > 0) {
    saveNotifications(notifications);
  }
  
  return count;
}

/**
 * حذف إشعار
 */
export function deleteNotification(notificationId: string): boolean {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  
  if (filtered.length === notifications.length) return false;
  
  saveNotifications(filtered);
  return true;
}

/**
 * حذف جميع الإشعارات المقروءة
 */
export function deleteReadNotifications(userId: string): number {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => !(n.userId === userId && n.read));
  const count = notifications.length - filtered.length;
  
  if (count > 0) {
    saveNotifications(filtered);
  }
  
  return count;
}

/**
 * الحصول على عدد الإشعارات غير المقروءة
 */
export function getUnreadCount(userId: string): number {
  return getNotifications().filter(n => n.userId === userId && !n.read).length;
}

/**
 * الحصول على الإعدادات
 */
export function getNotificationSettings(): NotificationSettings {
  return getSettings();
}

/**
 * تحديث الإعدادات
 */
export function updateNotificationSettings(settings: Partial<NotificationSettings>): void {
  const current = getSettings();
  const updated = { ...current, ...settings };
  saveSettings(updated);
  
  window.dispatchEvent(new CustomEvent('notification-settings-updated', {
    detail: { settings: updated }
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// 📤 EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const NotificationsAPI = {
  // General
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  
  // Settings
  getNotificationSettings,
  updateNotificationSettings,
  
  // Customer
  notifyCustomerAdded,
  notifyCustomerUpdated,
  notifyCustomerSlideAdded,
  notifyCustomerAssigned,
  
  // Appointments
  notifyAppointmentAdded,
  notifyAppointmentUpdated,
  notifyAppointmentCancelled,
  notifyAppointmentReminder,
  
  // Platforms
  notifyPropertyPublished,
  notifyPublishFailed,
  notifyPlatformStatusUpdated,
  
  // Social Media
  notifySocialPostPublished,
  notifySocialPostFailed,
  
  // Business Card
  notifyAppointmentRequest,
  notifyReceiptRequest,
  notifyFinancingRequest,
  
  // Offers/Requests
  notifyOfferAdded,
  notifyOfferStatusChanged,
  notifyRequestAdded,
  
  // Analytics
  notifyHighViews,
  notifyLowViews,
  notifyPriceChange
};

export default NotificationsAPI;
