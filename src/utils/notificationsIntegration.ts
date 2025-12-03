/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 Notifications Integration Helpers
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * مساعدات لربط الإشعارات مع جميع أجزاء التطبيق
 * 
 * تاريخ الإنشاء: 5 نوفمبر 2025
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { NotificationsAPI } from '../api/notifications-real';

/**
 * الحصول على معرف المستخدم الحالي
 */
function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  // محاولة الحصول من localStorage
  try {
    const brokerData = localStorage.getItem('broker-registration-data');
    if (brokerData) {
      const parsed = JSON.parse(brokerData);
      return parsed.phone || parsed.id || 'anonymous';
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  
  return 'anonymous';
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 INTEGRATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * دمج مع customersManager
 */
export function integrateCustomersManager() {
  const userId = getCurrentUserId();
  
  // مراقبة إنشاء عميل جديد
  const originalCreateCustomer = (window as any).createCustomer;
  (window as any).createCustomer = function(...args: any[]) {
    const result = originalCreateCustomer?.apply(this, args);
    if (result) {
      NotificationsAPI.notifyCustomerAdded(userId, result);
    }
    return result;
  };
  
  // مراقبة تحديث عميل
  const originalUpdateCustomer = (window as any).updateCustomer;
  (window as any).updateCustomer = function(id: string, updates: any, ...args: any[]) {
    const changes = Object.keys(updates);
    const result = originalUpdateCustomer?.apply(this, [id, updates, ...args]);
    if (result) {
      NotificationsAPI.notifyCustomerUpdated(userId, result, changes);
    }
    return result;
  };
}

/**
 * دمج مع Calendar API
 */
export function integrateCalendarAPI() {
  const userId = getCurrentUserId();
  
  // الاستماع لإنشاء موعد
  window.addEventListener('appointmentCreated', (event: any) => {
    const appointment = event.detail;
    NotificationsAPI.notifyAppointmentAdded(userId, appointment);
  });
  
  // الاستماع لتحديث موعد
  window.addEventListener('appointmentUpdated', (event: any) => {
    const appointment = event.detail;
    NotificationsAPI.notifyAppointmentUpdated(userId, appointment);
  });
  
  // الاستماع لإلغاء موعد
  window.addEventListener('appointmentCancelled', (event: any) => {
    const appointment = event.detail;
    NotificationsAPI.notifyAppointmentCancelled(userId, appointment);
  });
}

/**
 * دمج مع نشر العقارات على المنصات
 */
export function integratePlatformPublishing() {
  const userId = getCurrentUserId();
  
  // الاستماع لنشر ناجح
  window.addEventListener('propertyPublished', (event: any) => {
    const { property, platforms } = event.detail;
    NotificationsAPI.notifyPropertyPublished(userId, property, platforms);
  });
  
  // الاستماع لفشل النشر
  window.addEventListener('publishFailed', (event: any) => {
    const { property, platform, error } = event.detail;
    NotificationsAPI.notifyPublishFailed(userId, property, platform, error);
  });
  
  // الاستماع لتحديث حالة المنصة
  window.addEventListener('platformStatusChanged', (event: any) => {
    const { property, platform, status } = event.detail;
    NotificationsAPI.notifyPlatformStatusUpdated(userId, property, platform, status);
  });
}

/**
 * دمج مع Social Media API
 */
export function integrateSocialMedia() {
  const userId = getCurrentUserId();
  
  // الاستماع لنشر منشور
  window.addEventListener('socialPostPublished', (event: any) => {
    const { post, platforms, results } = event.detail;
    
    // التحقق من النجاح
    const successPlatforms = results.filter((r: any) => r.success).map((r: any) => r.platform);
    const failedPlatforms = results.filter((r: any) => !r.success);
    
    if (successPlatforms.length > 0) {
      NotificationsAPI.notifySocialPostPublished(userId, post, successPlatforms);
    }
    
    // إشعارات الفشل
    failedPlatforms.forEach((result: any) => {
      NotificationsAPI.notifySocialPostFailed(userId, post, result.platform, result.error || 'فشل النشر');
    });
  });
}

/**
 * دمج مع Business Card
 */
export function integrateBusinessCard() {
  const userId = getCurrentUserId();
  
  // الاستماع لطلبات جدولة موعد
  window.addEventListener('appointmentRequestReceived', (event: any) => {
    const data = event.detail;
    NotificationsAPI.notifyAppointmentRequest(userId, data);
  });
  
  // الاستماع لطلبات سند قبض
  window.addEventListener('receiptRequestReceived', (event: any) => {
    const data = event.detail;
    NotificationsAPI.notifyReceiptRequest(userId, data);
  });
  
  // الاستماع لطلبات حسبة تمويل
  window.addEventListener('financingRequestReceived', (event: any) => {
    const data = event.detail;
    NotificationsAPI.notifyFinancingRequest(userId, data);
  });
}

/**
 * دمج مع Offers/Requests
 */
export function integrateOffersRequests() {
  const userId = getCurrentUserId();
  
  // الاستماع لإضافة عرض
  window.addEventListener('offerAdded', (event: any) => {
    const offer = event.detail;
    NotificationsAPI.notifyOfferAdded(userId, offer);
  });
  
  // الاستماع لتغيير حالة عرض
  window.addEventListener('offerStatusChanged', (event: any) => {
    const { offer, oldStatus, newStatus } = event.detail;
    NotificationsAPI.notifyOfferStatusChanged(userId, offer, oldStatus, newStatus);
  });
  
  // الاستماع لإضافة طلب
  window.addEventListener('requestAdded', (event: any) => {
    const request = event.detail;
    NotificationsAPI.notifyRequestAdded(userId, request);
  });
}

/**
 * دمج مع Analytics
 */
export function integrateAnalytics() {
  const userId = getCurrentUserId();
  
  // الاستماع لارتفاع المشاهدات
  window.addEventListener('highViewsDetected', (event: any) => {
    const { property, viewCount } = event.detail;
    NotificationsAPI.notifyHighViews(userId, property, viewCount);
  });
  
  // الاستماع لانخفاض المشاهدات
  window.addEventListener('lowViewsDetected', (event: any) => {
    const { property, viewCount } = event.detail;
    NotificationsAPI.notifyLowViews(userId, property, viewCount);
  });
  
  // الاستماع لتغيرات الأسعار
  window.addEventListener('priceChangeDetected', (event: any) => {
    const { area, changePercent, direction } = event.detail;
    NotificationsAPI.notifyPriceChange(userId, area, changePercent, direction);
  });
}

/**
 * دمج مع Customer Slides
 */
export function integrateCustomerSlides() {
  const userId = getCurrentUserId();
  
  window.addEventListener('customerSlideAdded', (event: any) => {
    const { customer, slideType } = event.detail;
    NotificationsAPI.notifyCustomerSlideAdded(userId, customer, slideType);
  });
}

/**
 * دمج مع Team Assignment
 */
export function integrateTeamAssignment() {
  const userId = getCurrentUserId();
  
  window.addEventListener('customerAssigned', (event: any) => {
    const { customer, agentName } = event.detail;
    NotificationsAPI.notifyCustomerAssigned(userId, customer, agentName);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 تهيئة شاملة
// ═══════════════════════════════════════════════════════════════════════════

/**
 * تهيئة جميع التكاملات
 */
export function initializeNotificationsIntegration() {
  if (typeof window === 'undefined') return;
  
  console.log('🔔 تهيئة نظام الإشعارات...');
  
  try {
    integrateCustomersManager();
    integrateCalendarAPI();
    integratePlatformPublishing();
    integrateSocialMedia();
    integrateBusinessCard();
    integrateOffersRequests();
    integrateAnalytics();
    integrateCustomerSlides();
    integrateTeamAssignment();
    
    console.log('✅ تم تهيئة نظام الإشعارات بنجاح');
  } catch (error) {
    console.error('❌ خطأ في تهيئة نظام الإشعارات:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📤 HELPER FUNCTIONS للاستخدام المباشر
// ═══════════════════════════════════════════════════════════════════════════

/**
 * إرسال إشعار مخصص
 */
export function sendCustomNotification(data: {
  title: string;
  message: string;
  category?: any;
  priority?: any;
  actions?: any[];
}) {
  const userId = getCurrentUserId();
  return NotificationsAPI.createNotification({
    userId,
    category: data.category || 'system',
    priority: data.priority || 'normal',
    title: data.title,
    message: data.message,
    actions: data.actions
  });
}

/**
 * إطلاق event للإشعار
 */
export function emitNotificationEvent(eventName: string, data: any) {
  if (typeof window === 'undefined') return;
  
  window.dispatchEvent(new CustomEvent(eventName, {
    detail: data
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// 📤 EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  initializeNotificationsIntegration,
  sendCustomNotification,
  emitNotificationEvent,
  
  // Individual integrations
  integrateCustomersManager,
  integrateCalendarAPI,
  integratePlatformPublishing,
  integrateSocialMedia,
  integrateBusinessCard,
  integrateOffersRequests,
  integrateAnalytics,
  integrateCustomerSlides,
  integrateTeamAssignment
};
