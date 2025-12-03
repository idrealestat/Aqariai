/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔔🤖 Notifications AI Integration Hook - ربط الإشعارات بالمساعد الذكي
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * هذا الـ Hook يربط نظام الإشعارات مع المساعد الذكي بربط API حقيقي
 * 
 * الميزات:
 * - قراءة تفصيلية للإشعارات
 * - تحليل مصدر الإشعار
 * - تحديد نوع التغيير بدقة
 * - توقيت الإشعار بالضبط
 * - سياق كامل للإشعار
 * 
 * تاريخ الإنشاء: 5 نوفمبر 2025
 * آخر تحديث: 5 نوفمبر 2025
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useCallback, useState } from 'react';
import { NotificationsAPI } from '../api/notifications-real';
import type { Notification, NotificationCategory } from '../api/notifications-real';

// ═══════════════════════════════════════════════════════════════════════════
// 📊 TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * معلومات الإشعار المُحللة للمساعد الذكي
 */
export interface NotificationAIContext {
  // معلومات أساسية
  id: string;
  title: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  
  // المصدر والفئة
  source: NotificationSource;
  category: NotificationCategory;
  categoryArabic: string;
  
  // التغيير الذي حصل
  changeType: ChangeType;
  changeTypeArabic: string;
  changeDetails: string;
  changedFields?: string[];
  
  // البيانات المرتبطة
  relatedData: {
    entityId?: string;
    entityType?: string;
    entityName?: string;
    oldValue?: any;
    newValue?: any;
    additionalInfo?: Record<string, any>;
  };
  
  // الأولوية والحالة
  priority: 'critical' | 'high' | 'normal' | 'low';
  isRead: boolean;
  isUrgent: boolean;
  
  // الإجراءات المقترحة
  suggestedActions: string[];
  quickReplies: string[];
  
  // سياق إضافي
  locationInApp: string;
  relatedPage?: string;
}

/**
 * مصدر الإشعار
 */
export type NotificationSource = 
  | 'customer_management'      // إدارة العملاء
  | 'appointments'             // المواعيد
  | 'social_media'             // التواصل الاجتماعي
  | 'property_platforms'       // المنصات العقارية
  | 'requests'                 // الطلبات
  | 'offers'                   // العروض
  | 'business_card'            // بطاقة الأعمال
  | 'analytics'                // التحليلات
  | 'system';                  // النظام

/**
 * نوع التغيير
 */
export type ChangeType =
  | 'created'                  // إنشاء جديد
  | 'updated'                  // تحديث
  | 'deleted'                  // حذف
  | 'assigned'                 // تعيين
  | 'status_changed'           // تغيير حالة
  | 'published'                // نشر
  | 'failed'                   // فشل
  | 'completed'                // اكتمال
  | 'cancelled'                // إلغاء
  | 'reminder'                 // تذكير
  | 'alert';                   // تنبيه

/**
 * إحصائيات الإشعارات للمساعد الذكي
 */
export interface NotificationsAIStats {
  total: number;
  unread: number;
  today: number;
  critical: number;
  byCategory: Record<NotificationCategory, number>;
  bySource: Record<NotificationSource, number>;
  recentChanges: NotificationAIContext[];
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * تحويل الفئة إلى عربي
 */
function getCategoryArabic(category: NotificationCategory): string {
  const map: Record<NotificationCategory, string> = {
    'customer': 'إدارة العملاء',
    'appointment': 'المواعيد',
    'social': 'التواصل الاجتماعي',
    'platform': 'المنصات العقارية',
    'request': 'الطلبات',
    'offer': 'العروض',
    'property': 'العقارات',
    'business_card': 'بطاقة الأعمال',
    'analytics': 'التحليلات',
    'system': 'النظام'
  };
  return map[category] || category;
}

/**
 * تحديد مصدر الإشعار من الفئة
 */
function getNotificationSource(notification: Notification): NotificationSource {
  const categoryToSource: Record<NotificationCategory, NotificationSource> = {
    'customer': 'customer_management',
    'appointment': 'appointments',
    'social': 'social_media',
    'platform': 'property_platforms',
    'request': 'requests',
    'offer': 'offers',
    'property': 'offers',
    'business_card': 'business_card',
    'analytics': 'analytics',
    'system': 'system'
  };
  return categoryToSource[notification.category] || 'system';
}

/**
 * تحديد نوع التغيير من العنوان والرسالة
 */
function determineChangeType(notification: Notification): ChangeType {
  const title = notification.title.toLowerCase();
  const message = notification.message.toLowerCase();
  
  if (title.includes('جديد') || title.includes('تم إضافة')) return 'created';
  if (title.includes('تحديث') || title.includes('تم تحديث')) return 'updated';
  if (title.includes('حذف') || title.includes('تم حذف')) return 'deleted';
  if (title.includes('تعيين') || title.includes('معين')) return 'assigned';
  if (title.includes('نشر') || title.includes('تم النشر')) return 'published';
  if (title.includes('فشل') || title.includes('خطأ')) return 'failed';
  if (title.includes('اكتمل') || title.includes('مكتمل')) return 'completed';
  if (title.includes('ألغي') || title.includes('إلغاء')) return 'cancelled';
  if (title.includes('تذكير') || message.includes('تذكير')) return 'reminder';
  if (notification.priority === 'critical' || notification.priority === 'high') return 'alert';
  
  return 'updated';
}

/**
 * ترجمة نوع التغيير للعربية
 */
function getChangeTypeArabic(changeType: ChangeType): string {
  const map: Record<ChangeType, string> = {
    'created': 'إنشاء جديد',
    'updated': 'تحديث',
    'deleted': 'حذف',
    'assigned': 'تعيين',
    'status_changed': 'تغيير حالة',
    'published': 'نشر',
    'failed': 'فشل',
    'completed': 'اكتمال',
    'cancelled': 'إلغاء',
    'reminder': 'تذكير',
    'alert': 'تنبيه'
  };
  return map[changeType] || 'تحديث';
}

/**
 * حساب الوقت النسبي بالعربية
 */
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays === 1) return 'أمس';
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  
  return then.toLocaleDateString('ar-SA');
}

/**
 * استخراج الإجراءات المقترحة
 */
function getSuggestedActions(notification: Notification, changeType: ChangeType): string[] {
  const actions: string[] = [];
  
  // إجراءات حسب الفئة
  switch (notification.category) {
    case 'customer':
      actions.push('عرض تفاصيل العميل');
      actions.push('تحديث معلومات العميل');
      if (changeType === 'created') {
        actions.push('حجز موعد مع العميل');
        actions.push('إضافة ملاحظة');
      }
      break;
      
    case 'appointment':
      actions.push('عرض تفاصيل الموعد');
      actions.push('تعديل الموعد');
      if (changeType === 'created') {
        actions.push('تأكيد الموعد');
      } else if (changeType === 'reminder') {
        actions.push('الاتصال بالعميل');
      }
      break;
      
    case 'social':
      actions.push('عرض المنشور');
      actions.push('متابعة الإحصائيات');
      if (changeType === 'published') {
        actions.push('مشاركة المنشور');
      } else if (changeType === 'failed') {
        actions.push('إعادة المحاولة');
      }
      break;
      
    case 'request':
      actions.push('عرض تفاصيل الطلب');
      actions.push('تحديث حالة الطلب');
      if (changeType === 'created') {
        actions.push('البحث عن عقار مناسب');
      }
      break;
  }
  
  // إجراءات عامة
  actions.push('تحديد كمقروء');
  if (notification.priority === 'critical') {
    actions.unshift('اتخاذ إجراء فوري');
  }
  
  return actions;
}

/**
 * إنشاء ردود سريعة
 */
function getQuickReplies(notification: Notification, changeType: ChangeType): string[] {
  const replies: string[] = [];
  
  switch (notification.category) {
    case 'customer':
      replies.push('عرّفني على هذا العميل');
      replies.push('ما هي الخطوة التالية؟');
      break;
      
    case 'appointment':
      replies.push('متى موعدي القادم؟');
      replies.push('هل هناك تعارض؟');
      break;
      
    case 'social':
      replies.push('كيف أداء المنشور؟');
      replies.push('أين نُشر؟');
      break;
      
    case 'request':
      replies.push('أعطني تفاصيل الطلب');
      replies.push('هل هو مستعجل؟');
      break;
  }
  
  replies.push('ماذا حدث بالضبط؟');
  replies.push('متى حدث ذلك؟');
  
  return replies;
}

/**
 * تحديد الموقع في التطبيق
 */
function getLocationInApp(source: NotificationSource): string {
  const locations: Record<NotificationSource, string> = {
    'customer_management': 'إدارة العملاء > قائمة العملاء',
    'appointments': 'المواعيد > التقويم',
    'social_media': 'التواصل الاجتماعي > المنشورات',
    'property_platforms': 'المنصات العقارية > نشر الإعلانات',
    'requests': 'الطلبات > قائمة الطلبات',
    'offers': 'العروض > قائمة العروض',
    'business_card': 'بطاقة الأعمال > الطلبات الواردة',
    'analytics': 'التحليلات > لوحة المعلومات',
    'system': 'الإعدادات > النظام'
  };
  return locations[source] || 'الصفحة الرئيسية';
}

/**
 * تحديد الصفحة المرتبطة
 */
function getRelatedPage(source: NotificationSource): string | undefined {
  const pages: Record<NotificationSource, string> = {
    'customer_management': 'customer-management-72',
    'appointments': 'calendar',
    'social_media': 'social-media',
    'property_platforms': 'my-platform',
    'requests': 'requests',
    'offers': 'offers',
    'business_card': 'business-card',
    'analytics': 'analytics',
    'system': 'settings'
  };
  return pages[source];
}

/**
 * استخراج تفاصيل التغيير
 */
function extractChangeDetails(notification: Notification, changeType: ChangeType): string {
  const { title, message, data } = notification;
  
  // تحليل البيانات المُرفقة
  if (data) {
    if (data.changes && Array.isArray(data.changes)) {
      return `تم تغيير: ${data.changes.join('، ')}`;
    }
    if (data.platforms && Array.isArray(data.platforms)) {
      return `المنصات: ${data.platforms.join('، ')}`;
    }
    if (data.status) {
      return `الحالة الجديدة: ${data.status}`;
    }
  }
  
  // استخراج من الرسالة
  return message || title;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 MAIN HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook لربط الإشعارات بالمساعد الذكي
 */
export function useNotificationsAIIntegration(userId: string) {
  const [aiContexts, setAIContexts] = useState<NotificationAIContext[]>([]);
  const [stats, setStats] = useState<NotificationsAIStats>({
    total: 0,
    unread: 0,
    today: 0,
    critical: 0,
    byCategory: {} as any,
    bySource: {} as any,
    recentChanges: []
  });

  /**
   * تحويل إشعار إلى سياق AI
   */
  const parseNotificationForAI = useCallback((notification: Notification): NotificationAIContext => {
    const source = getNotificationSource(notification);
    const changeType = determineChangeType(notification);
    const changeDetails = extractChangeDetails(notification, changeType);
    
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      timeAgo: getTimeAgo(notification.timestamp),
      
      source,
      category: notification.category,
      categoryArabic: getCategoryArabic(notification.category),
      
      changeType,
      changeTypeArabic: getChangeTypeArabic(changeType),
      changeDetails,
      changedFields: notification.data?.changes,
      
      relatedData: {
        entityId: notification.entityId,
        entityType: notification.entityType,
        entityName: notification.data?.name || notification.data?.title,
        additionalInfo: notification.data
      },
      
      priority: notification.priority,
      isRead: notification.read,
      isUrgent: notification.priority === 'critical' || notification.priority === 'high',
      
      suggestedActions: getSuggestedActions(notification, changeType),
      quickReplies: getQuickReplies(notification, changeType),
      
      locationInApp: getLocationInApp(source),
      relatedPage: getRelatedPage(source)
    };
  }, []);

  /**
   * تحليل جميع الإشعارات
   */
  const analyzeNotifications = useCallback(() => {
    const notifications = NotificationsAPI.getUserNotifications(userId);
    
    // تحويل لسياق AI
    const contexts = notifications.map(parseNotificationForAI);
    setAIContexts(contexts);
    
    // حساب الإحصائيات
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const categoryCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    
    let unreadCount = 0;
    let todayCount = 0;
    let criticalCount = 0;
    
    contexts.forEach(ctx => {
      if (!ctx.isRead) unreadCount++;
      if (new Date(ctx.timestamp) >= todayStart) todayCount++;
      if (ctx.priority === 'critical') criticalCount++;
      
      categoryCounts[ctx.category] = (categoryCounts[ctx.category] || 0) + 1;
      sourceCounts[ctx.source] = (sourceCounts[ctx.source] || 0) + 1;
    });
    
    setStats({
      total: contexts.length,
      unread: unreadCount,
      today: todayCount,
      critical: criticalCount,
      byCategory: categoryCounts as any,
      bySource: sourceCounts as any,
      recentChanges: contexts.slice(0, 5)
    });
  }, [userId, parseNotificationForAI]);

  /**
   * الاستماع للتحديثات
   */
  useEffect(() => {
    // تحليل أولي
    analyzeNotifications();
    
    // الاستماع للتحديثات
    const handleUpdate = () => {
      analyzeNotifications();
    };
    
    window.addEventListener('notifications-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('notifications-updated', handleUpdate);
    };
  }, [analyzeNotifications]);

  /**
   * البحث في الإشعارات
   */
  const searchNotifications = useCallback((query: string): NotificationAIContext[] => {
    const lowerQuery = query.toLowerCase();
    return aiContexts.filter(ctx => 
      ctx.title.toLowerCase().includes(lowerQuery) ||
      ctx.message.toLowerCase().includes(lowerQuery) ||
      ctx.changeDetails.toLowerCase().includes(lowerQuery) ||
      ctx.categoryArabic.toLowerCase().includes(lowerQuery)
    );
  }, [aiContexts]);

  /**
   * الحصول على إشعارات حسب الفئة
   */
  const getByCategory = useCallback((category: NotificationCategory): NotificationAIContext[] => {
    return aiContexts.filter(ctx => ctx.category === category);
  }, [aiContexts]);

  /**
   * الحصول على إشعارات حسب المصدر
   */
  const getBySource = useCallback((source: NotificationSource): NotificationAIContext[] => {
    return aiContexts.filter(ctx => ctx.source === source);
  }, [aiContexts]);

  /**
   * الحصول على إشعارات غير مقروءة
   */
  const getUnread = useCallback((): NotificationAIContext[] => {
    return aiContexts.filter(ctx => !ctx.isRead);
  }, [aiContexts]);

  /**
   * الحصول على إشعارات حرجة
   */
  const getCritical = useCallback((): NotificationAIContext[] => {
    return aiContexts.filter(ctx => ctx.isUrgent);
  }, [aiContexts]);

  /**
   * إنشاء ملخص نصي للمساعد الذكي
   */
  const generateAISummary = useCallback((): string => {
    if (aiContexts.length === 0) {
      return '✅ لا توجد إشعارات جديدة';
    }
    
    const { total, unread, today, critical } = stats;
    
    let summary = `📊 **ملخص الإشعارات:**\n\n`;
    summary += `• الإجمالي: ${total} إشعار\n`;
    summary += `• غير المقروءة: ${unread} إشعار\n`;
    summary += `• اليوم: ${today} إشعار\n`;
    
    if (critical > 0) {
      summary += `• ⚠️ حرجة: ${critical} إشعار\n`;
    }
    
    summary += `\n**آخر التغييرات:**\n`;
    stats.recentChanges.slice(0, 3).forEach((ctx, i) => {
      summary += `${i + 1}. ${ctx.changeTypeArabic}: ${ctx.title} (${ctx.timeAgo})\n`;
    });
    
    return summary;
  }, [aiContexts, stats]);

  return {
    // البيانات
    contexts: aiContexts,
    stats,
    
    // الدوال
    searchNotifications,
    getByCategory,
    getBySource,
    getUnread,
    getCritical,
    generateAISummary,
    parseNotificationForAI,
    
    // تحديث يدوي
    refresh: analyzeNotifications
  };
}
