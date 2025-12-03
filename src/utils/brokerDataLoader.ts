/**
 * 🔧 دالة تحميل بيانات الوسيط من بطاقة الأعمال الرقمية
 * Broker Data Loader from Digital Business Card
 * 
 * تُستخدم لجلب معلومات الوسيط المحفوظة في بطاقة الأعمال
 * لعرضها في المستندات المالية والفواتير
 */

export interface BrokerInfo {
  id: string;
  name: string;
  companyName?: string;
  licenseNumber?: string;
  phone: string;
  email?: string;
  logoImage?: string;
  signature?: string;
  commercialRegistration?: string;
}

/**
 * تحميل بيانات الوسيط من localStorage
 * @param userId - معرف المستخدم
 * @returns بيانات الوسيط أو null
 */
export function loadBrokerInfo(userId: string): BrokerInfo | null {
  try {
    const STORAGE_KEY = `business_card_${userId}`;
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (!savedData) {
      return null;
    }

    const businessCardData = JSON.parse(savedData);
    
    // تحويل بيانات بطاقة الأعمال إلى BrokerInfo
    return {
      id: userId,
      name: businessCardData.userName || '',
      companyName: businessCardData.companyName || '',
      licenseNumber: businessCardData.falLicense || '',
      phone: businessCardData.primaryPhone || '',
      email: businessCardData.email || '',
      logoImage: businessCardData.logoImage || '',
      signature: businessCardData.signature || '',
      commercialRegistration: businessCardData.commercialRegistration || '',
    };
  } catch (error) {
    console.error('خطأ في تحميل بيانات الوسيط:', error);
    return null;
  }
}

/**
 * حفظ توقيع الوسيط في بطاقة الأعمال
 * @param userId - معرف المستخدم
 * @param signatureDataUrl - صورة التوقيع بصيغة base64
 */
export function saveBrokerSignature(userId: string, signatureDataUrl: string): boolean {
  try {
    const STORAGE_KEY = `business_card_${userId}`;
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (!savedData) {
      return false;
    }

    const businessCardData = JSON.parse(savedData);
    businessCardData.signature = signatureDataUrl;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businessCardData));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ التوقيع:', error);
    return false;
  }
}

/**
 * إنشاء بيانات وسيط افتراضية للاختبار
 * @param userId - معرف المستخدم
 * @returns بيانات وسيط افتراضية
 */
export function createDefaultBrokerInfo(userId: string): BrokerInfo {
  return {
    id: userId,
    name: 'محمد الأحمد',
    companyName: 'مؤسسة الأحلام العقارية',
    licenseNumber: '1234567890',
    phone: '0501234567',
    email: 'info@alahlam.sa',
    logoImage: '',
    signature: '',
    commercialRegistration: '1010123456',
  };
}
