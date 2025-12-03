/**
 * مدير إشعارات المالك
 * 
 * يدير إنشاء وحذف الإشعارات للمالك عندما يرد عليه وسيط
 */

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

/**
 * إنشاء إشعار جديد للمالك عندما يرد عليه وسيط
 */
export function createOwnerNotification(
  ownerId: string,
  offerId: string,
  offerTitle: string,
  offerType: 'sale' | 'rent' | 'buy-request' | 'rent-request',
  brokerResponse: BrokerResponse
): void {
  try {
    // جلب الإشعارات الحالية
    const notifications = JSON.parse(
      localStorage.getItem(`owner-notifications-${ownerId}`) || '[]'
    ) as OwnerNotification[];

    // إنشاء إشعار جديد
    const newNotification: OwnerNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      offerId,
      offerTitle,
      offerType,
      brokerResponse,
      timestamp: Date.now(),
      read: false,
    };

    // إضافة الإشعار الجديد في البداية
    const updatedNotifications = [newNotification, ...notifications];

    // حفظ الإشعارات
    localStorage.setItem(
      `owner-notifications-${ownerId}`,
      JSON.stringify(updatedNotifications)
    );

    console.log('✅ تم إنشاء إشعار للمالك:', {
      ownerId,
      offerId,
      brokerName: brokerResponse.brokerName,
    });
  } catch (error) {
    console.error('❌ خطأ في إنشاء إشعار المالك:', error);
  }
}

/**
 * حذف إشعارات محددة للعرض/الطلب
 * يُستخدم عند قبول أو رفض المالك لعرض وسيط
 */
export function deleteOwnerNotificationsForOffer(
  ownerId: string,
  offerId: string,
  brokerId?: string
): void {
  try {
    // جلب الإشعارات الحالية
    const notifications = JSON.parse(
      localStorage.getItem(`owner-notifications-${ownerId}`) || '[]'
    ) as OwnerNotification[];

    // تصفية الإشعارات
    const updatedNotifications = notifications.filter((notif) => {
      // إذا كان هناك brokerId محدد، احذف إشعارات هذا الوسيط فقط
      if (brokerId) {
        return !(notif.offerId === offerId && notif.brokerResponse.brokerId === brokerId);
      }
      // إذا لم يكن هناك brokerId، احذف كل إشعارات هذا العرض
      return notif.offerId !== offerId;
    });

    // حفظ الإشعارات المحدثة
    localStorage.setItem(
      `owner-notifications-${ownerId}`,
      JSON.stringify(updatedNotifications)
    );

    console.log('✅ تم حذف إشعارات المالك للعرض:', {
      ownerId,
      offerId,
      brokerId,
    });
  } catch (error) {
    console.error('❌ خطأ في حذف إشعارات المالك:', error);
  }
}

/**
 * حذف جميع إشعارات المالك
 */
export function clearAllOwnerNotifications(ownerId: string): void {
  try {
    localStorage.setItem(`owner-notifications-${ownerId}`, JSON.stringify([]));
    console.log('✅ تم حذف جميع إشعارات المالك:', ownerId);
  } catch (error) {
    console.error('❌ خطأ في حذف جميع إشعارات المالك:', error);
  }
}

/**
 * الحصول على عدد الإشعارات غير المقروءة
 */
export function getUnreadOwnerNotificationsCount(ownerId: string): number {
  try {
    const notifications = JSON.parse(
      localStorage.getItem(`owner-notifications-${ownerId}`) || '[]'
    ) as OwnerNotification[];

    return notifications.filter((n) => !n.read).length;
  } catch (error) {
    console.error('❌ خطأ في حساب الإشعارات غير المقروءة:', error);
    return 0;
  }
}

/**
 * تعليم إشعار كمقروء
 */
export function markOwnerNotificationAsRead(
  ownerId: string,
  notificationId: string
): void {
  try {
    const notifications = JSON.parse(
      localStorage.getItem(`owner-notifications-${ownerId}`) || '[]'
    ) as OwnerNotification[];

    const updatedNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );

    localStorage.setItem(
      `owner-notifications-${ownerId}`,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error('❌ خطأ في تعليم الإشعار كمقروء:', error);
  }
}
