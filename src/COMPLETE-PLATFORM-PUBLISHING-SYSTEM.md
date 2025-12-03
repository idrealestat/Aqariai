# 📱 **نظام النشر على المنصات وإدارة العملات - التوثيق الشامل الكامل**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌐 COMPLETE PLATFORM PUBLISHING & CURRENCY SYSTEM 🌐      ║
║                                                               ║
║   توثيق شامل 100% - نسخة مطابقة حرفياً                     ║
║   كل زر | كل دالة | كل مسار | كل استدعاء                   ║
║   RTL | Arabic | React | TypeScript | TailwindCSS           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🎯 **الهدف الكامل للنظام**

### **الأهداف الرئيسية:**

```
1. ✅ نشر العروض على المنصات العقارية السعودية
   - عقار ماب
   - حراج
   - OpenSooq
   - مستعمل
   - السوق المفتوح

2. ✅ إدارة العملات المتعددة
   - ريال سعودي (SAR) - العملة الأساسية
   - دولار أمريكي (USD)
   - يورو (EUR)
   - درهم إماراتي (AED)
   - دينار كويتي (KWD)
   - تحديث أسعار الصرف تلقائياً

3. ✅ التكامل مع "منصتي" (MyPlatform)
   - عرض العروض المنشورة
   - إحصائيات النشر
   - إدارة الحالة
   - تتبع الأداء

4. ✅ إدارة شاملة
   - نشر تلقائي/يدوي
   - جدولة النشر
   - تحديث العروض
   - حذف من المنصات
   - إحصائيات تفصيلية
```

---

## 🏗️ **البنية الكاملة للنظام**

### **1. هيكل الملفات الكامل**

```
📦 التطبيق
│
├── 📂 /components/
│   │
│   ├── 📂 /platform/                      (مجلد النشر على المنصات)
│   │   ├── 📄 PlatformPublisher.tsx      (المكون الرئيسي للنشر)
│   │   ├── 📄 PlatformSelector.tsx       (اختيار المنصات)
│   │   ├── 📄 PublishModal.tsx           (Modal النشر)
│   │   ├── 📄 PublishStatus.tsx          (حالة النشر)
│   │   ├── 📄 PublishHistory.tsx         (سجل النشر)
│   │   ├── 📄 PublishAnalytics.tsx       (إحصائيات النشر)
│   │   ├── 📄 BulkPublisher.tsx          (نشر جماعي)
│   │   ├── 📄 SchedulePublish.tsx        (جدولة النشر)
│   │   └── 📄 index.ts                   (تصدير موحد)
│   │
│   ├── 📂 /currency/                      (مجلد إدارة العملات)
│   │   ├── 📄 CurrencySelector.tsx       (اختيار العملة)
│   │   ├── 📄 CurrencyConverter.tsx      (محول العملات)
│   │   ├── 📄 CurrencyDisplay.tsx        (عرض السعر بالعملات)
│   │   ├── 📄 ExchangeRateWidget.tsx     (أسعار الصرف)
│   │   ├── 📄 CurrencySettings.tsx       (إعدادات العملات)
│   │   └── 📄 index.ts                   (تصدير موحد)
│   │
│   ├── 📄 MyPlatform.tsx                  (الصفحة الرئيسية - منصتي)
│   ├── 📄 OffersControlDashboard.tsx      (لوحة التحكم)
│   └── 📄 ... (مكونات أخرى)
│
├── 📂 /lib/
│   ├── 📄 platformAPI.ts                  (API المنصات)
│   ├── 📄 currencyAPI.ts                  (API العملات)
│   └── 📄 utils.ts                        (دوال مساعدة)
│
├── 📂 /types/
│   ├── 📄 platform.types.ts               (تعريفات المنصات)
│   └── 📄 currency.types.ts               (تعريفات العملات)
│
└── 📂 /hooks/
    ├── 📄 usePlatformPublish.ts           (Hook للنشر)
    └── 📄 useCurrency.ts                  (Hook للعملات)
```

---

## 📋 **التعريفات الكاملة (Types & Interfaces)**

### **1. Platform Types**

```typescript
// File: /types/platform.types.ts

/**
 * المنصات العقارية المدعومة
 */
export enum Platform {
  AQAR_MAP = 'AQAR_MAP',           // عقار ماب
  HARAJ = 'HARAJ',                 // حراج
  OPENSOOQ = 'OPENSOOQ',           // OpenSooq
  MSTAML = 'MSTAML',               // مستعمل
  OPEN_MARKET = 'OPEN_MARKET',     // السوق المفتوح
}

/**
 * أسماء المنصات بالعربية
 */
export const PLATFORM_NAMES: Record<Platform, string> = {
  [Platform.AQAR_MAP]: 'عقار ماب',
  [Platform.HARAJ]: 'حراج',
  [Platform.OPENSOOQ]: 'أوبن سوق',
  [Platform.MSTAML]: 'مستعمل',
  [Platform.OPEN_MARKET]: 'السوق المفتوح',
};

/**
 * شعارات المنصات
 */
export const PLATFORM_LOGOS: Record<Platform, string> = {
  [Platform.AQAR_MAP]: '/platforms/aqarmap.png',
  [Platform.HARAJ]: '/platforms/haraj.png',
  [Platform.OPENSOOQ]: '/platforms/opensooq.png',
  [Platform.MSTAML]: '/platforms/mstaml.png',
  [Platform.OPEN_MARKET]: '/platforms/openmarket.png',
};

/**
 * ألوان المنصات
 */
export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.AQAR_MAP]: '#00A8E8',      // أزرق
  [Platform.HARAJ]: '#FF6B35',         // برتقالي
  [Platform.OPENSOOQ]: '#4CAF50',      // أخضر
  [Platform.MSTAML]: '#9C27B0',        // بنفسجي
  [Platform.OPEN_MARKET]: '#FF9800',   // برتقالي غامق
};

/**
 * حالة النشر
 */
export enum PublishStatus {
  DRAFT = 'DRAFT',                 // مسودة
  PENDING = 'PENDING',             // قيد الانتظار
  PUBLISHING = 'PUBLISHING',       // جاري النشر
  PUBLISHED = 'PUBLISHED',         // منشور
  FAILED = 'FAILED',               // فشل
  UPDATING = 'UPDATING',           // جاري التحديث
  DELETING = 'DELETING',           // جاري الحذف
  DELETED = 'DELETED',             // محذوف
  SCHEDULED = 'SCHEDULED',         // مجدول
}

/**
 * أسماء حالات النشر بالعربية
 */
export const PUBLISH_STATUS_NAMES: Record<PublishStatus, string> = {
  [PublishStatus.DRAFT]: 'مسودة',
  [PublishStatus.PENDING]: 'قيد الانتظار',
  [PublishStatus.PUBLISHING]: 'جاري النشر',
  [PublishStatus.PUBLISHED]: 'منشور',
  [PublishStatus.FAILED]: 'فشل',
  [PublishStatus.UPDATING]: 'جاري التحديث',
  [PublishStatus.DELETING]: 'جاري الحذف',
  [PublishStatus.DELETED]: 'محذوف',
  [PublishStatus.SCHEDULED]: 'مجدول',
};

/**
 * ألوان حالات النشر
 */
export const PUBLISH_STATUS_COLORS: Record<PublishStatus, string> = {
  [PublishStatus.DRAFT]: 'bg-gray-100 text-gray-700',
  [PublishStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [PublishStatus.PUBLISHING]: 'bg-blue-100 text-blue-700',
  [PublishStatus.PUBLISHED]: 'bg-green-100 text-green-700',
  [PublishStatus.FAILED]: 'bg-red-100 text-red-700',
  [PublishStatus.UPDATING]: 'bg-purple-100 text-purple-700',
  [PublishStatus.DELETING]: 'bg-orange-100 text-orange-700',
  [PublishStatus.DELETED]: 'bg-gray-100 text-gray-500',
  [PublishStatus.SCHEDULED]: 'bg-indigo-100 text-indigo-700',
};

/**
 * نوع النشر
 */
export enum PublishType {
  MANUAL = 'MANUAL',               // يدوي
  AUTOMATIC = 'AUTOMATIC',         // تلقائي
  SCHEDULED = 'SCHEDULED',         // مجدول
  BULK = 'BULK',                   // جماعي
}

/**
 * بيانات المنصة
 */
export interface PlatformData {
  platform: Platform;              // المنصة
  platformId?: string;             // معرف العرض على المنصة
  status: PublishStatus;           // الحالة
  publishedAt?: Date;              // تاريخ النشر
  lastUpdated?: Date;              // آخر تحديث
  viewCount?: number;              // عدد المشاهدات
  clickCount?: number;             // عدد النقرات
  leadCount?: number;              // عدد الاستفسارات
  errorMessage?: string;           // رسالة الخطأ
  externalUrl?: string;            // رابط العرض على المنصة
}

/**
 * إعدادات النشر
 */
export interface PublishSettings {
  autoPublish: boolean;            // نشر تلقائي
  selectedPlatforms: Platform[];   // المنصات المحددة
  publishDelay?: number;           // تأخير النشر (بالدقائق)
  autoUpdate: boolean;             // تحديث تلقائي
  autoDelete: boolean;             // حذف تلقائي
  notifyOnPublish: boolean;        // إشعار عند النشر
  notifyOnError: boolean;          // إشعار عند الخطأ
}

/**
 * سجل النشر
 */
export interface PublishHistoryItem {
  id: string;                      // معرف السجل
  offerId: string;                 // معرف العرض
  platform: Platform;              // المنصة
  action: 'PUBLISH' | 'UPDATE' | 'DELETE';  // الإجراء
  status: PublishStatus;           // الحالة
  publishType: PublishType;        // نوع النشر
  performedBy: string;             // المستخدم
  performedAt: Date;               // التاريخ
  errorMessage?: string;           // رسالة الخطأ
  metadata?: Record<string, any>;  // بيانات إضافية
}

/**
 * إحصائيات النشر
 */
export interface PublishAnalytics {
  totalPublished: number;          // إجمالي المنشور
  publishedByPlatform: Record<Platform, number>;  // حسب المنصة
  totalViews: number;              // إجمالي المشاهدات
  totalClicks: number;             // إجمالي النقرات
  totalLeads: number;              // إجمالي الاستفسارات
  successRate: number;             // نسبة النجاح
  failureRate: number;             // نسبة الفشل
  averagePublishTime: number;      // متوسط وقت النشر (بالثواني)
  topPlatform?: Platform;          // أفضل منصة
  recentPublishes: PublishHistoryItem[];  // آخر النشرات
}

/**
 * بيانات العرض للنشر
 */
export interface OfferPublishData {
  id: string;                      // معرف العرض
  title: string;                   // العنوان
  description: string;             // الوصف
  price: number;                   // السعر (بالريال)
  currency: string;                // العملة
  images: string[];                // الصور
  video?: string;                  // الفيديو
  location: {                      // الموقع
    city: string;
    district: string;
    latitude?: number;
    longitude?: number;
  };
  category: string;                // الفئة
  propertyType: string;            // نوع العقار
  area: number;                    // المساحة
  rooms?: number;                  // الغرف
  bathrooms?: number;              // الحمامات
  features: string[];              // المميزات
  contactInfo: {                   // معلومات التواصل
    name: string;
    phone: string;
    email?: string;
  };
  platforms?: PlatformData[];      // بيانات المنصات
}
```

---

### **2. Currency Types**

```typescript
// File: /types/currency.types.ts

/**
 * العملات المدعومة
 */
export enum Currency {
  SAR = 'SAR',   // ريال سعودي
  USD = 'USD',   // دولار أمريكي
  EUR = 'EUR',   // يورو
  AED = 'AED',   // درهم إماراتي
  KWD = 'KWD',   // دينار كويتي
  GBP = 'GBP',   // جنيه إسترليني
  EGP = 'EGP',   // جنيه مصري
  QAR = 'QAR',   // ريال قطري
  BHD = 'BHD',   // دينار بحريني
  OMR = 'OMR',   // ريال عماني
}

/**
 * أسماء العملات بالعربية
 */
export const CURRENCY_NAMES: Record<Currency, string> = {
  [Currency.SAR]: 'ريال سعودي',
  [Currency.USD]: 'دولار أمريكي',
  [Currency.EUR]: 'يورو',
  [Currency.AED]: 'درهم إماراتي',
  [Currency.KWD]: 'دينار كويتي',
  [Currency.GBP]: 'جنيه إسترليني',
  [Currency.EGP]: 'جنيه مصري',
  [Currency.QAR]: 'ريال قطري',
  [Currency.BHD]: 'دينار بحريني',
  [Currency.OMR]: 'ريال عماني',
};

/**
 * رموز العملات
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.SAR]: 'ر.س',
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.AED]: 'د.إ',
  [Currency.KWD]: 'د.ك',
  [Currency.GBP]: '£',
  [Currency.EGP]: 'ج.م',
  [Currency.QAR]: 'ر.ق',
  [Currency.BHD]: 'د.ب',
  [Currency.OMR]: 'ر.ع',
};

/**
 * أعلام العملات (ISO 3166-1 alpha-2)
 */
export const CURRENCY_FLAGS: Record<Currency, string> = {
  [Currency.SAR]: '🇸🇦',
  [Currency.USD]: '🇺🇸',
  [Currency.EUR]: '🇪🇺',
  [Currency.AED]: '🇦🇪',
  [Currency.KWD]: '🇰🇼',
  [Currency.GBP]: '🇬🇧',
  [Currency.EGP]: '🇪🇬',
  [Currency.QAR]: '🇶🇦',
  [Currency.BHD]: '🇧🇭',
  [Currency.OMR]: '🇴🇲',
};

/**
 * سعر الصرف
 */
export interface ExchangeRate {
  from: Currency;                  // من عملة
  to: Currency;                    // إلى عملة
  rate: number;                    // السعر
  lastUpdated: Date;               // آخر تحديث
  source: string;                  // المصدر
}

/**
 * بيانات السعر بالعملات المتعددة
 */
export interface MultiCurrencyPrice {
  baseCurrency: Currency;          // العملة الأساسية
  baseAmount: number;              // المبلغ الأساسي
  conversions: {                   // التحويلات
    [key in Currency]?: number;
  };
  lastUpdated: Date;               // آخر تحديث
}

/**
 * إعدادات العملات
 */
export interface CurrencySettings {
  defaultCurrency: Currency;       // العملة الافتراضية
  displayCurrencies: Currency[];   // العملات المعروضة
  autoUpdate: boolean;             // تحديث تلقائي
  updateInterval: number;          // فترة التحديث (بالدقائق)
  roundDecimals: number;           // عدد الأرقام العشرية
  showSymbol: boolean;             // عرض الرمز
  symbolPosition: 'before' | 'after';  // موضع الرمز
}
```

---

## 🔧 **API Functions (الدوال الكاملة)**

### **1. Platform API**

```typescript
// File: /lib/platformAPI.ts

import { 
  Platform, 
  PublishStatus, 
  OfferPublishData,
  PlatformData,
  PublishHistoryItem,
  PublishAnalytics,
} from '@/types/platform.types';

/**
 * نشر عرض على منصة واحدة
 * 
 * @param offerId - معرف العرض
 * @param platform - المنصة
 * @param offerData - بيانات العرض
 * @returns بيانات النشر
 * 
 * @example
 * const result = await publishToSinglePlatform(
 *   'offer_123',
 *   Platform.AQAR_MAP,
 *   offerData
 * );
 */
export async function publishToSinglePlatform(
  offerId: string,
  platform: Platform,
  offerData: OfferPublishData
): Promise<PlatformData> {
  try {
    const response = await fetch('/api/platform/publish/single', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        platform,
        offerData,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل النشر');
    }

    return data.platformData;
  } catch (error) {
    console.error(`Error publishing to ${platform}:`, error);
    throw error;
  }
}

/**
 * نشر عرض على منصات متعددة
 * 
 * @param offerId - معرف العرض
 * @param platforms - المنصات
 * @param offerData - بيانات العرض
 * @returns نتائج النشر لكل منصة
 * 
 * @example
 * const results = await publishToMultiplePlatforms(
 *   'offer_123',
 *   [Platform.AQAR_MAP, Platform.HARAJ],
 *   offerData
 * );
 */
export async function publishToMultiplePlatforms(
  offerId: string,
  platforms: Platform[],
  offerData: OfferPublishData
): Promise<Record<Platform, PlatformData>> {
  try {
    const response = await fetch('/api/platform/publish/multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        platforms,
        offerData,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل النشر');
    }

    return data.results;
  } catch (error) {
    console.error('Error publishing to multiple platforms:', error);
    throw error;
  }
}

/**
 * تحديث عرض منشور على منصة
 * 
 * @param offerId - معرف العرض
 * @param platform - المنصة
 * @param platformId - معرف العرض على المنصة
 * @param updates - التحديثات
 * @returns بيانات المنصة المحدثة
 */
export async function updatePublishedOffer(
  offerId: string,
  platform: Platform,
  platformId: string,
  updates: Partial<OfferPublishData>
): Promise<PlatformData> {
  try {
    const response = await fetch('/api/platform/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        platform,
        platformId,
        updates,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل التحديث');
    }

    return data.platformData;
  } catch (error) {
    console.error(`Error updating offer on ${platform}:`, error);
    throw error;
  }
}

/**
 * حذف عرض من منصة
 * 
 * @param offerId - معرف العرض
 * @param platform - المنصة
 * @param platformId - معرف العرض على المنصة
 * @returns نتيجة الحذف
 */
export async function deleteFromPlatform(
  offerId: string,
  platform: Platform,
  platformId: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/platform/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        platform,
        platformId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل الحذف');
    }

    return true;
  } catch (error) {
    console.error(`Error deleting from ${platform}:`, error);
    throw error;
  }
}

/**
 * جلب حالة النشر لعرض
 * 
 * @param offerId - معرف العرض
 * @returns حالات النشر على كل منصة
 */
export async function getPublishStatus(
  offerId: string
): Promise<Record<Platform, PlatformData>> {
  try {
    const response = await fetch(`/api/platform/status/${offerId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل جلب الحالة');
    }

    return data.platforms;
  } catch (error) {
    console.error('Error fetching publish status:', error);
    throw error;
  }
}

/**
 * جلب سجل النشر
 * 
 * @param offerId - معرف العرض (اختياري)
 * @param platform - المنصة (اختياري)
 * @param limit - عدد السجلات
 * @returns سجل النشر
 */
export async function getPublishHistory(
  offerId?: string,
  platform?: Platform,
  limit: number = 50
): Promise<PublishHistoryItem[]> {
  try {
    const params = new URLSearchParams();
    if (offerId) params.append('offerId', offerId);
    if (platform) params.append('platform', platform);
    params.append('limit', limit.toString());

    const response = await fetch(`/api/platform/history?${params}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل جلب السجل');
    }

    return data.history;
  } catch (error) {
    console.error('Error fetching publish history:', error);
    throw error;
  }
}

/**
 * جلب إحصائيات النشر
 * 
 * @param userId - معرف المستخدم
 * @returns إحصائيات النشر
 */
export async function getPublishAnalytics(
  userId: string
): Promise<PublishAnalytics> {
  try {
    const response = await fetch(`/api/platform/analytics/${userId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل جلب الإحصائيات');
    }

    return data.analytics;
  } catch (error) {
    console.error('Error fetching publish analytics:', error);
    throw error;
  }
}

/**
 * جدولة نشر عرض
 * 
 * @param offerId - معرف العرض
 * @param platforms - المنصات
 * @param scheduledFor - موعد النشر
 * @param offerData - بيانات العرض
 * @returns معرف الجدولة
 */
export async function schedulePublish(
  offerId: string,
  platforms: Platform[],
  scheduledFor: Date,
  offerData: OfferPublishData
): Promise<string> {
  try {
    const response = await fetch('/api/platform/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        platforms,
        scheduledFor: scheduledFor.toISOString(),
        offerData,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل الجدولة');
    }

    return data.scheduleId;
  } catch (error) {
    console.error('Error scheduling publish:', error);
    throw error;
  }
}

/**
 * نشر جماعي لعدة عروض
 * 
 * @param offerIds - معرفات العروض
 * @param platforms - المنصات
 * @returns نتائج النشر
 */
export async function bulkPublish(
  offerIds: string[],
  platforms: Platform[]
): Promise<Record<string, Record<Platform, PlatformData>>> {
  try {
    const response = await fetch('/api/platform/bulk-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerIds,
        platforms,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل النشر الجماعي');
    }

    return data.results;
  } catch (error) {
    console.error('Error bulk publishing:', error);
    throw error;
  }
}
```

---

### **2. Currency API**

```typescript
// File: /lib/currencyAPI.ts

import {
  Currency,
  ExchangeRate,
  MultiCurrencyPrice,
  CurrencySettings,
} from '@/types/currency.types';

/**
 * جلب أسعار الصرف الحالية
 * 
 * @param baseCurrency - العملة الأساسية
 * @param targetCurrencies - العملات المستهدفة
 * @returns أسعار الصرف
 * 
 * @example
 * const rates = await getExchangeRates(
 *   Currency.SAR,
 *   [Currency.USD, Currency.EUR]
 * );
 */
export async function getExchangeRates(
  baseCurrency: Currency = Currency.SAR,
  targetCurrencies: Currency[] = Object.values(Currency)
): Promise<ExchangeRate[]> {
  try {
    const response = await fetch('/api/currency/rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseCurrency,
        targetCurrencies,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل جلب أسعار الصرف');
    }

    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

/**
 * تحويل مبلغ من عملة إلى أخرى
 * 
 * @param amount - المبلغ
 * @param fromCurrency - من عملة
 * @param toCurrency - إلى عملة
 * @returns المبلغ المحول
 * 
 * @example
 * const converted = await convertCurrency(1000, Currency.SAR, Currency.USD);
 * // returns: 266.67 (تقريباً)
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): Promise<number> {
  try {
    // إذا كانت نفس العملة
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const response = await fetch('/api/currency/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        fromCurrency,
        toCurrency,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل التحويل');
    }

    return data.convertedAmount;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

/**
 * حساب السعر بعملات متعددة
 * 
 * @param baseAmount - المبلغ الأساسي
 * @param baseCurrency - العملة الأساسية
 * @param targetCurrencies - العملات المستهدفة
 * @returns الأسعار بالعملات المختلفة
 * 
 * @example
 * const prices = await getMultiCurrencyPrice(
 *   500000,
 *   Currency.SAR,
 *   [Currency.USD, Currency.EUR, Currency.AED]
 * );
 */
export async function getMultiCurrencyPrice(
  baseAmount: number,
  baseCurrency: Currency = Currency.SAR,
  targetCurrencies: Currency[] = Object.values(Currency)
): Promise<MultiCurrencyPrice> {
  try {
    const response = await fetch('/api/currency/multi-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseAmount,
        baseCurrency,
        targetCurrencies,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل حساب الأسعار');
    }

    return data.multiCurrencyPrice;
  } catch (error) {
    console.error('Error getting multi-currency price:', error);
    throw error;
  }
}

/**
 * تنسيق السعر بالعملة
 * 
 * @param amount - المبلغ
 * @param currency - العملة
 * @param locale - اللغة
 * @returns السعر المنسق
 * 
 * @example
 * formatPrice(500000, Currency.SAR, 'ar-SA')
 * // returns: "٥٠٠٬٠٠٠ ر.س"
 */
export function formatPrice(
  amount: number,
  currency: Currency,
  locale: string = 'ar-SA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * حفظ إعدادات العملات
 * 
 * @param userId - معرف المستخدم
 * @param settings - الإعدادات
 * @returns نجاح الحفظ
 */
export async function saveCurrencySettings(
  userId: string,
  settings: CurrencySettings
): Promise<boolean> {
  try {
    const response = await fetch('/api/currency/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        settings,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل حفظ الإعدادات');
    }

    return true;
  } catch (error) {
    console.error('Error saving currency settings:', error);
    throw error;
  }
}

/**
 * جلب إعدادات العملات
 * 
 * @param userId - معرف المستخدم
 * @returns الإعدادات
 */
export async function getCurrencySettings(
  userId: string
): Promise<CurrencySettings> {
  try {
    const response = await fetch(`/api/currency/settings/${userId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل جلب الإعدادات');
    }

    return data.settings;
  } catch (error) {
    console.error('Error fetching currency settings:', error);
    // إرجاع إعدادات افتراضية
    return {
      defaultCurrency: Currency.SAR,
      displayCurrencies: [Currency.SAR, Currency.USD, Currency.EUR],
      autoUpdate: true,
      updateInterval: 60,
      roundDecimals: 2,
      showSymbol: true,
      symbolPosition: 'after',
    };
  }
}
```

---

## 🎨 **المكونات الكاملة (Components)**

### **1. PlatformPublisher.tsx - المكون الرئيسي للنشر**

```typescript
// File: /components/platform/PlatformPublisher.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Globe, 
  Upload, 
  Check, 
  X, 
  Loader2,
  ChevronDown,
  Settings,
  Calendar,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Platform,
  PublishStatus,
  OfferPublishData,
  PlatformData,
  PLATFORM_NAMES,
  PLATFORM_LOGOS,
  PLATFORM_COLORS,
  PUBLISH_STATUS_NAMES,
  PUBLISH_STATUS_COLORS,
} from '@/types/platform.types';
import {
  publishToSinglePlatform,
  publishToMultiplePlatforms,
  getPublishStatus,
} from '@/lib/platformAPI';
import { PlatformSelector } from './PlatformSelector';
import { PublishModal } from './PublishModal';
import { PublishStatus as PublishStatusComponent } from './PublishStatus';

/**
 * Props المكون
 */
interface PlatformPublisherProps {
  /** معرف العرض */
  offerId: string;
  
  /** بيانات العرض الكاملة */
  offerData: OfferPublishData;
  
  /** عرض كزر صغير أو كبطاقة كاملة */
  variant?: 'button' | 'card';
  
  /** حجم الزر */
  size?: 'sm' | 'md' | 'lg';
  
  /** callback عند نجاح النشر */
  onPublishSuccess?: (platforms: Platform[]) => void;
  
  /** callback عند فشل النشر */
  onPublishError?: (error: Error) => void;
}

/**
 * المكون الرئيسي للنشر على المنصات
 * 
 * الأزرار والوظائف:
 * - زر "نشر على المنصات": فتح modal اختيار المنصات
 * - زر "عرض الحالة": عرض حالة النشر الحالية
 * - زر "إعدادات": فتح إعدادات النشر
 * 
 * @example
 * <PlatformPublisher
 *   offerId="offer_123"
 *   offerData={offerData}
 *   variant="button"
 *   size="md"
 *   onPublishSuccess={(platforms) => console.log('Published to:', platforms)}
 * />
 */
export function PlatformPublisher({
  offerId,
  offerData,
  variant = 'button',
  size = 'md',
  onPublishSuccess,
  onPublishError,
}: PlatformPublisherProps) {
  // ====== STATE ======
  
  /** حالة فتح modal الاختيار */
  const [showModal, setShowModal] = useState(false);
  
  /** حالة فتح عرض الحالة */
  const [showStatus, setShowStatus] = useState(false);
  
  /** المنصات المحددة */
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  
  /** حالة النشر الحالية */
  const [platformsStatus, setPlatformsStatus] = useState<Record<Platform, PlatformData>>({} as any);
  
  /** حالة التحميل */
  const [loading, setLoading] = useState(false);
  
  /** حالة النشر */
  const [publishing, setPublishing] = useState(false);
  
  // ====== EFFECTS ======
  
  /**
   * جلب حالة النشر عند التحميل
   */
  useEffect(() => {
    fetchPublishStatus();
  }, [offerId]);
  
  // ====== HANDLERS ======
  
  /**
   * جلب حالة النشر الحالية
   */
  const fetchPublishStatus = async () => {
    setLoading(true);
    try {
      const status = await getPublishStatus(offerId);
      setPlatformsStatus(status);
    } catch (error) {
      console.error('Error fetching publish status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * معالج النشر على المنصات المحددة
   */
  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('يرجى اختيار منصة واحدة على الأقل');
      return;
    }
    
    setPublishing(true);
    
    try {
      toast.info(`جاري النشر على ${selectedPlatforms.length} منصة...`);
      
      const results = await publishToMultiplePlatforms(
        offerId,
        selectedPlatforms,
        offerData
      );
      
      // تحديث الحالة
      setPlatformsStatus((prev) => ({
        ...prev,
        ...results,
      }));
      
      // حساب النجاح والفشل
      const successCount = Object.values(results).filter(
        (r) => r.status === PublishStatus.PUBLISHED
      ).length;
      const failCount = selectedPlatforms.length - successCount;
      
      if (successCount > 0) {
        toast.success(
          `تم النشر بنجاح على ${successCount} منصة${
            failCount > 0 ? ` (${failCount} فشل)` : ''
          }`
        );
        
        if (onPublishSuccess) {
          onPublishSuccess(selectedPlatforms);
        }
      } else {
        toast.error('فشل النشر على جميع المنصات');
        
        if (onPublishError) {
          onPublishError(new Error('فشل النشر'));
        }
      }
      
      // إغلاق Modal
      setShowModal(false);
      
      // إعادة تعيين الاختيارات
      setSelectedPlatforms([]);
      
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error('حدث خطأ أثناء النشر');
      
      if (onPublishError) {
        onPublishError(error as Error);
      }
    } finally {
      setPublishing(false);
    }
  };
  
  /**
   * معالج فتح modal الاختيار
   */
  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  /**
   * معالج إغلاق modal الاختيار
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlatforms([]);
  };
  
  /**
   * معالج فتح عرض الحالة
   */
  const handleShowStatus = () => {
    setShowStatus(true);
  };
  
  /**
   * معالج إغلاق عرض الحالة
   */
  const handleCloseStatus = () => {
    setShowStatus(false);
  };
  
  // ====== COMPUTED VALUES ======
  
  /** عدد المنصات المنشورة */
  const publishedCount = Object.values(platformsStatus).filter(
    (p) => p.status === PublishStatus.PUBLISHED
  ).length;
  
  /** هل العرض منشور على أي منصة */
  const isPublished = publishedCount > 0;
  
  // ====== RENDER ======
  
  /**
   * عرض كزر
   */
  if (variant === 'button') {
    return (
      <>
        {/* زر النشر الرئيسي */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenModal}
            disabled={loading || publishing}
            size={size}
            className="bg-[#01411C] hover:bg-[#01411C]/90"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري النشر...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 ml-2" />
                نشر على المنصات
                {isPublished && (
                  <Badge variant="secondary" className="mr-2 bg-green-100 text-green-700">
                    {publishedCount}
                  </Badge>
                )}
              </>
            )}
          </Button>
          
          {/* زر عرض الحالة */}
          {isPublished && (
            <Button
              onClick={handleShowStatus}
              variant="outline"
              size={size}
            >
              <Eye className="w-4 h-4 ml-2" />
              عرض الحالة
            </Button>
          )}
        </div>
        
        {/* Modal الاختيار */}
        <PublishModal
          isOpen={showModal}
          onClose={handleCloseModal}
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={setSelectedPlatforms}
          onPublish={handlePublish}
          publishing={publishing}
          offerData={offerData}
        />
        
        {/* عرض الحالة */}
        <PublishStatusComponent
          isOpen={showStatus}
          onClose={handleCloseStatus}
          offerId={offerId}
          platformsStatus={platformsStatus}
          onRefresh={fetchPublishStatus}
        />
      </>
    );
  }
  
  /**
   * عرض كبطاقة كاملة
   */
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4" dir="rtl">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#01411C]" />
          النشر على المنصات العقارية
        </h3>
        
        {isPublished && (
          <Badge className="bg-green-100 text-green-700">
            منشور على {publishedCount} منصة
          </Badge>
        )}
      </div>
      
      {/* قائمة المنصات المنشورة */}
      {isPublished && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(platformsStatus)
            .filter(([_, data]) => data.status === PublishStatus.PUBLISHED)
            .map(([platform, data]) => (
              <div
                key={platform}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={PLATFORM_LOGOS[platform as Platform]}
                  alt={PLATFORM_NAMES[platform as Platform]}
                  className="w-8 h-8 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {PLATFORM_NAMES[platform as Platform]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.viewCount || 0} مشاهدة
                  </p>
                </div>
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              </div>
            ))}
        </div>
      )}
      
      {/* الأزرار */}
      <div className="flex gap-3">
        <Button
          onClick={handleOpenModal}
          disabled={loading || publishing}
          className="flex-1 bg-[#01411C] hover:bg-[#01411C]/90"
        >
          {publishing ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري النشر...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 ml-2" />
              {isPublished ? 'نشر على منصات إضافية' : 'نشر الآن'}
            </>
          )}
        </Button>
        
        {isPublished && (
          <Button
            onClick={handleShowStatus}
            variant="outline"
          >
            <Eye className="w-4 h-4 ml-2" />
            التفاصيل
          </Button>
        )}
      </div>
      
      {/* Modals */}
      <PublishModal
        isOpen={showModal}
        onClose={handleCloseModal}
        selectedPlatforms={selectedPlatforms}
        onPlatformsChange={setSelectedPlatforms}
        onPublish={handlePublish}
        publishing={publishing}
        offerData={offerData}
      />
      
      <PublishStatusComponent
        isOpen={showStatus}
        onClose={handleCloseStatus}
        offerId={offerId}
        platformsStatus={platformsStatus}
        onRefresh={fetchPublishStatus}
      />
    </div>
  );
}
```

---

### **2. PlatformSelector.tsx - اختيار المنصات**

```typescript
// File: /components/platform/PlatformSelector.tsx

'use client';

import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import {
  Platform,
  PLATFORM_NAMES,
  PLATFORM_LOGOS,
  PLATFORM_COLORS,
} from '@/types/platform.types';

/**
 * Props المكون
 */
interface PlatformSelectorProps {
  /** المنصات المحددة */
  selectedPlatforms: Platform[];
  
  /** callback عند تغيير الاختيار */
  onChange: (platforms: Platform[]) => void;
  
  /** المنصات المعطلة */
  disabledPlatforms?: Platform[];
  
  /** عرض كشبكة أو قائمة */
  layout?: 'grid' | 'list';
}

/**
 * مكون اختيار المنصات
 * 
 * الوظائف:
 * - اختيار منصة واحدة أو أكثر
 * - تحديد الكل / إلغاء تحديد الكل
 * - عرض حالة كل منصة
 * 
 * @example
 * <PlatformSelector
 *   selectedPlatforms={selected}
 *   onChange={setSelected}
 *   layout="grid"
 * />
 */
export function PlatformSelector({
  selectedPlatforms,
  onChange,
  disabledPlatforms = [],
  layout = 'grid',
}: PlatformSelectorProps) {
  // ====== HANDLERS ======
  
  /**
   * معالج تحديد/إلغاء تحديد منصة
   */
  const handleTogglePlatform = (platform: Platform) => {
    if (disabledPlatforms.includes(platform)) {
      return;
    }
    
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };
  
  /**
   * معالج تحديد الكل
   */
  const handleSelectAll = () => {
    const availablePlatforms = Object.values(Platform).filter(
      (p) => !disabledPlatforms.includes(p)
    );
    onChange(availablePlatforms);
  };
  
  /**
   * معالج إلغاء تحديد الكل
   */
  const handleDeselectAll = () => {
    onChange([]);
  };
  
  // ====== COMPUTED VALUES ======
  
  /** عدد المنصات المتاحة */
  const availableCount = Object.values(Platform).length - disabledPlatforms.length;
  
  /** هل تم تحديد الكل */
  const allSelected = selectedPlatforms.length === availableCount;
  
  // ====== RENDER ======
  
  return (
    <div className="space-y-4" dir="rtl">
      {/* عنوان مع أزرار التحديد */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          اختر المنصات ({selectedPlatforms.length}/{availableCount})
        </h4>
        
        <div className="flex gap-2">
          {!allSelected && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-[#01411C] hover:underline"
            >
              تحديد الكل
            </button>
          )}
          
          {selectedPlatforms.length > 0 && (
            <button
              onClick={handleDeselectAll}
              className="text-sm text-gray-600 hover:underline"
            >
              إلغاء الكل
            </button>
          )}
        </div>
      </div>
      
      {/* قائمة المنصات */}
      <div
        className={
          layout === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
            : 'space-y-2'
        }
      >
        {Object.values(Platform).map((platform) => {
          const isSelected = selectedPlatforms.includes(platform);
          const isDisabled = disabledPlatforms.includes(platform);
          
          return (
            <div
              key={platform}
              onClick={() => handleTogglePlatform(platform)}
              className={`
                flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  isSelected
                    ? 'border-[#01411C] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {/* Checkbox */}
              <Checkbox
                checked={isSelected}
                disabled={isDisabled}
                onCheckedChange={() => handleTogglePlatform(platform)}
              />
              
              {/* شعار المنصة */}
              <img
                src={PLATFORM_LOGOS[platform]}
                alt={PLATFORM_NAMES[platform]}
                className="w-10 h-10 object-contain"
              />
              
              {/* معلومات المنصة */}
              <div className="flex-1">
                <Label className="cursor-pointer">
                  {PLATFORM_NAMES[platform]}
                </Label>
                
                {isDisabled && (
                  <p className="text-xs text-gray-500 mt-1">
                    منشور بالفعل
                  </p>
                )}
              </div>
              
              {/* Badge للمنصة */}
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[platform] }}
              />
            </div>
          );
        })}
      </div>
      
      {/* ملاحظة */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <span className="font-bold">نصيحة:</span> يمكنك النشر على عدة منصات دفعة
          واحدة لزيادة فرص الوصول
        </p>
      </div>
    </div>
  );
}
```

---

سأكمل باقي المكونات في الرسالة التالية...