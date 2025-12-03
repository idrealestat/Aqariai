# 📱 **نظام النشر على المنصات - الجزء الثالث والأخير**

## 🔌 **Currency API Routes**

```typescript
// File: backend/src/routes/currency.routes.ts

import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as currencyController from '../controllers/currency.controller';

const router = Router();

/**
 * POST /api/currency/rates
 * جلب أسعار الصرف
 * 
 * Body: {
 *   baseCurrency: Currency,
 *   targetCurrencies: Currency[]
 * }
 * 
 * Response: {
 *   success: boolean,
 *   rates: ExchangeRate[]
 * }
 */
router.post('/rates', currencyController.getExchangeRates);

/**
 * POST /api/currency/convert
 * تحويل مبلغ من عملة لأخرى
 * 
 * Body: {
 *   amount: number,
 *   fromCurrency: Currency,
 *   toCurrency: Currency
 * }
 * 
 * Response: {
 *   success: boolean,
 *   convertedAmount: number
 * }
 */
router.post('/convert', currencyController.convertCurrency);

/**
 * POST /api/currency/multi-price
 * حساب السعر بعملات متعددة
 * 
 * Body: {
 *   baseAmount: number,
 *   baseCurrency: Currency,
 *   targetCurrencies: Currency[]
 * }
 * 
 * Response: {
 *   success: boolean,
 *   multiCurrencyPrice: MultiCurrencyPrice
 * }
 */
router.post('/multi-price', currencyController.getMultiCurrencyPrice);

/**
 * POST /api/currency/settings
 * حفظ إعدادات العملات
 * 
 * Body: {
 *   userId: string,
 *   settings: CurrencySettings
 * }
 * 
 * Response: {
 *   success: boolean
 * }
 */
router.post('/settings', auth, currencyController.saveSettings);

/**
 * GET /api/currency/settings/:userId
 * جلب إعدادات العملات
 * 
 * Response: {
 *   success: boolean,
 *   settings: CurrencySettings
 * }
 */
router.get('/settings/:userId', auth, currencyController.getSettings);

/**
 * POST /api/currency/update-rates
 * تحديث أسعار الصرف (Cron Job)
 * 
 * Response: {
 *   success: boolean,
 *   updated: number
 * }
 */
router.post('/update-rates', currencyController.updateRates);

export default router;
```

---

## 🎮 **Controllers الكاملة**

### **Platform Controller**

```typescript
// File: backend/src/controllers/platform.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Platform, PublishStatus, PublishType } from '@/types/platform.types';
import * as platformService from '../services/platform.service';

const prisma = new PrismaClient();

/**
 * نشر على منصة واحدة
 */
export async function publishToSingle(req: Request, res: Response) {
  try {
    const { offerId, platform, offerData } = req.body;
    const userId = req.user!.id;

    // التحقق من وجود العرض
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer || offer.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'العرض غير موجود',
      });
    }

    // النشر على المنصة
    const platformData = await platformService.publishToSinglePlatform(
      offerId,
      userId,
      platform,
      offerData
    );

    res.json({
      success: true,
      platformData,
    });
  } catch (error) {
    console.error('Error publishing to single platform:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء النشر',
    });
  }
}

/**
 * نشر على منصات متعددة
 */
export async function publishToMultiple(req: Request, res: Response) {
  try {
    const { offerId, platforms, offerData } = req.body;
    const userId = req.user!.id;

    // التحقق من وجود العرض
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer || offer.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'العرض غير موجود',
      });
    }

    // النشر على المنصات
    const results = await platformService.publishToMultiplePlatforms(
      offerId,
      userId,
      platforms,
      offerData
    );

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error publishing to multiple platforms:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء النشر',
    });
  }
}

/**
 * تحديث عرض منشور
 */
export async function updatePublished(req: Request, res: Response) {
  try {
    const { offerId, platform, platformId, updates } = req.body;
    const userId = req.user!.id;

    const platformData = await platformService.updatePublishedOffer(
      offerId,
      userId,
      platform,
      platformId,
      updates
    );

    res.json({
      success: true,
      platformData,
    });
  } catch (error) {
    console.error('Error updating published offer:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحديث',
    });
  }
}

/**
 * حذف من منصة
 */
export async function deleteFromPlatform(req: Request, res: Response) {
  try {
    const { offerId, platform, platformId } = req.body;
    const userId = req.user!.id;

    await platformService.deleteFromPlatform(
      offerId,
      userId,
      platform,
      platformId
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting from platform:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحذف',
    });
  }
}

/**
 * جلب حالة النشر
 */
export async function getStatus(req: Request, res: Response) {
  try {
    const { offerId } = req.params;
    const userId = req.user!.id;

    const platforms = await platformService.getPublishStatus(offerId, userId);

    res.json({
      success: true,
      platforms,
    });
  } catch (error) {
    console.error('Error getting publish status:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الحالة',
    });
  }
}

/**
 * جلب سجل النشر
 */
export async function getHistory(req: Request, res: Response) {
  try {
    const { offerId, platform, limit } = req.query;
    const userId = req.user!.id;

    const history = await platformService.getPublishHistory(
      userId,
      offerId as string | undefined,
      platform as Platform | undefined,
      limit ? parseInt(limit as string) : 50
    );

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error getting publish history:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب السجل',
    });
  }
}

/**
 * جلب الإحصائيات
 */
export async function getAnalytics(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (userId !== req.user!.id && !req.user!.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح',
      });
    }

    const analytics = await platformService.getPublishAnalytics(userId);

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
    });
  }
}

/**
 * جدولة النشر
 */
export async function schedulePublish(req: Request, res: Response) {
  try {
    const { offerId, platforms, scheduledFor, offerData } = req.body;
    const userId = req.user!.id;

    const scheduleId = await platformService.schedulePublish(
      offerId,
      userId,
      platforms,
      new Date(scheduledFor),
      offerData
    );

    res.json({
      success: true,
      scheduleId,
    });
  } catch (error) {
    console.error('Error scheduling publish:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الجدولة',
    });
  }
}

/**
 * نشر جماعي
 */
export async function bulkPublish(req: Request, res: Response) {
  try {
    const { offerIds, platforms } = req.body;
    const userId = req.user!.id;

    const results = await platformService.bulkPublish(
      offerIds,
      userId,
      platforms
    );

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error bulk publishing:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء النشر الجماعي',
    });
  }
}
```

---

## 📍 **جميع الأزرار ووظائفها**

### **في MyPlatform.tsx:**

```typescript
/**
 * الأزرار في صفحة منصتي
 */

// 1. زر النشر على المنصات
<Button 
  onClick={() => setShowPublishModal(true)}
  className="bg-[#01411C]"
>
  <Globe className="w-4 h-4 ml-2" />
  نشر على المنصات
</Button>
// الهدف: فتح modal اختيار المنصات للنشر
// الاستدعاء: setShowPublishModal(true)
// المسار: /components/platform/PublishModal.tsx

// 2. زر عرض الحالة
<Button 
  onClick={() => setShowStatusModal(true)}
  variant="outline"
>
  <Eye className="w-4 h-4 ml-2" />
  عرض الحالة
</Button>
// الهدف: عرض حالة النشر على كل منصة
// الاستدعاء: setShowStatusModal(true)
// المسار: /components/platform/PublishStatus.tsx

// 3. زر تغيير العملة
<Button 
  onClick={() => setShowCurrencySelector(true)}
  variant="outline"
>
  <span>{CURRENCY_FLAGS[selectedCurrency]}</span>
  <span>{CURRENCY_NAMES[selectedCurrency]}</span>
  <ChevronDown className="w-4 h-4" />
</Button>
// الهدف: فتح قائمة اختيار العملة
// الاستدعاء: Dropdown من shadcn/ui
// المسار: /components/currency/CurrencyDisplay.tsx

// 4. زر تحديث أسعار الصرف
<Button 
  onClick={handleRefreshRates}
  variant="ghost"
  size="sm"
>
  <RefreshCw className="w-4 h-4" />
</Button>
// الهدف: تحديث أسعار الصرف الحالية
// الاستدعاء: getExchangeRates() من currencyAPI
// المسار: /lib/currencyAPI.ts

// 5. زر المشاركة (من النظام السابق)
<Button 
  onClick={() => setShowShareModal(true)}
  variant="outline"
>
  <Share2 className="w-4 h-4 ml-2" />
  مشاركة
</Button>
// الهدف: فتح modal المشاركة
// الاستدعاء: setShowShareModal(true)
// المسار: /components/share/EnhancedShareModal.tsx
```

---

### **في PlatformPublisher.tsx:**

```typescript
/**
 * الأزرار في مكون النشر
 */

// 1. زر "نشر على المنصات"
<Button onClick={handleOpenModal}>
  <Globe /> نشر على المنصات
</Button>
// الهدف: فتح modal اختيار المنصات
// الدالة: handleOpenModal()
// الحالة: setShowModal(true)

// 2. زر "عرض الحالة"
<Button onClick={handleShowStatus}>
  <Eye /> عرض الحالة
</Button>
// الهدف: عرض تفاصيل النشر
// الدالة: handleShowStatus()
// الحالة: setShowStatus(true)

// 3. زر "نشر على X منصة" (في Modal)
<Button onClick={handlePublish}>
  <Send /> نشر على {selectedPlatforms.length} منصة
</Button>
// الهدف: تنفيذ النشر
// الدالة: handlePublish()
// API: publishToMultiplePlatforms()

// 4. زر "إلغاء" (في Modal)
<Button onClick={handleCloseModal} variant="outline">
  إلغاء
</Button>
// الهدف: إغلاق Modal
// الدالة: handleCloseModal()
// الحالة: setShowModal(false)
```

---

### **في PlatformSelector.tsx:**

```typescript
/**
 * الأزرار في اختيار المنصات
 */

// 1. زر "تحديد الكل"
<button onClick={handleSelectAll}>
  تحديد الكل
</button>
// الهدف: تحديد جميع المنصات
// الدالة: handleSelectAll()
// التأثير: onChange(allPlatforms)

// 2. زر "إلغاء الكل"
<button onClick={handleDeselectAll}>
  إلغاء الكل
</button>
// الهدف: إلغاء جميع التحديدات
// الدالة: handleDeselectAll()
// التأثير: onChange([])

// 3. Checkbox لكل منصة
<Checkbox 
  checked={isSelected}
  onCheckedChange={() => handleTogglePlatform(platform)}
/>
// الهدف: تحديد/إلغاء منصة واحدة
// الدالة: handleTogglePlatform(platform)
// التأثير: تحديث selectedPlatforms
```

---

## 🗺️ **خريطة التكامل الكاملة**

```
📱 التطبيق الرئيسي (App.tsx)
│
├── 🏠 الصفحة الرئيسية
│   └── Header مع اختيار العملة العامة
│       └── <CurrencyDisplay />
│
├── 📍 منصتي (MyPlatform.tsx)
│   │
│   ├── 💰 اختيار العملة للصفحة
│   │   └── <CurrencyDisplay showSelector={true} />
│   │
│   ├── 📦 قائمة العروض
│   │   ├── 🏷️ بطاقة العرض
│   │   │   ├── 🖼️ صورة
│   │   │   ├── 📝 تفاصيل
│   │   │   ├── 💰 السعر بالعملة المختارة
│   │   │   │   └── <CurrencyDisplay />
│   │   │   │
│   │   │   └── ⚡ أزرار الإجراءات
│   │   │       ├── 🌐 نشر على المنصات
│   │   │       │   └── <PlatformPublisher />
│   │   │       │       ├── Modal النشر
│   │   │       │       │   └── <PublishModal />
│   │   │       │       │       ├── Tab: نشر فوري
│   │   │       │       │       │   └── <PlatformSelector />
│   │   │       │       │       ├── Tab: نشر مجدول
│   │   │       │       │       │   └── <SchedulePublish />
│   │   │       │       │       └── Tab: إعدادات
│   │   │       │       │
│   │   │       │       └── Modal الحالة
│   │   │       │           └── <PublishStatus />
│   │   │       │
│   │   │       ├── 📤 مشاركة
│   │   │       │   └── <EnhancedShareModal />
│   │   │       │
│   │   │       └── 👁️ عرض التفاصيل
│   │   │
│   │   └── ... (المزيد من العروض)
│   │
│   └── 📊 إحصائيات النشر
│       └── <PublishAnalytics />
│
├── 🎛️ لوحة التحكم (OffersControlDashboard.tsx)
│   ├── زر النشر على كل عرض
│   │   └── <PlatformPublisher variant="button" size="sm" />
│   │
│   └── زر المشاركة على كل عرض
│       └── <EnhancedShareModal />
│
└── 📄 تفاصيل العرض (SubOfferDetailModal.tsx)
    ├── معلومات كاملة
    ├── السعر بعملات متعددة
    │   └── <CurrencyDisplay displayCurrencies={[...]} />
    │
    ├── زر النشر
    │   └── <PlatformPublisher variant="card" />
    │
    └── زر المشاركة
        └── <EnhancedShareModal />
```

---

## 🔄 **Data Flow (تدفق البيانات)**

```
1. المستخدم يفتح "منصتي"
   ↓
2. يختار عملة للعرض (مثلاً USD)
   ↓
3. يتم جلب أسعار الصرف من API
   API: getExchangeRates(SAR, [USD, EUR, AED])
   ↓
4. يتم تحويل جميع الأسعار تلقائياً
   API: getMultiCurrencyPrice(baseAmount, SAR, [USD...])
   ↓
5. العروض تُعرض بالعملة المختارة
   Component: <CurrencyDisplay selectedCurrency={USD} />
   ↓
6. المستخدم ينقر "نشر على المنصات"
   ↓
7. يُفتح Modal اختيار المنصات
   Component: <PublishModal />
   ↓
8. المستخدم يختار المنصات (مثلاً: عقار ماب + حراج)
   Component: <PlatformSelector />
   ↓
9. المستخدم ينقر "نشر"
   ↓
10. يتم إرسال طلب للـ API
    API: publishToMultiplePlatforms(offerId, [AQAR_MAP, HARAJ], offerData)
    ↓
11. Backend ينشر على كل منصة
    Service: platformService.publishToSinglePlatform()
    ↓
12. تسجيل النشر في Database
    Prisma: PlatformPublish.create()
    Prisma: PublishHistory.create()
    ↓
13. إرجاع النتيجة للـ Frontend
    Response: { success: true, results: {...} }
    ↓
14. تحديث UI بالحالة الجديدة
    State: setPlatformsStatus(results)
    ↓
15. عرض رسالة نجاح
    Toast: "تم النشر بنجاح على 2 منصة"
```

---

## 📋 **Checklist التنفيذ الكامل**

### **Frontend:**

```
☐ Types
  ☐ platform.types.ts (جميع التعريفات)
  ☐ currency.types.ts (جميع التعريفات)

☐ API Functions
  ☐ platformAPI.ts (9 دوال)
  ☐ currencyAPI.ts (7 دوال)

☐ Components - Platform
  ☐ PlatformPublisher.tsx
  ☐ PlatformSelector.tsx
  ☐ PublishModal.tsx
  ☐ PublishStatus.tsx
  ☐ PublishHistory.tsx
  ☐ PublishAnalytics.tsx
  ☐ BulkPublisher.tsx
  ☐ SchedulePublish.tsx
  ☐ index.ts (تصدير)

☐ Components - Currency
  ☐ CurrencySelector.tsx
  ☐ CurrencyConverter.tsx
  ☐ CurrencyDisplay.tsx
  ☐ ExchangeRateWidget.tsx
  ☐ CurrencySettings.tsx
  ☐ index.ts (تصدير)

☐ Integration
  ☐ MyPlatform.tsx (إضافة النشر + العملات)
  ☐ OffersControlDashboard.tsx (إضافة أزرار)
  ☐ SubOfferDetailModal.tsx (إضافة أزرار)

☐ Hooks
  ☐ usePlatformPublish.ts
  ☐ useCurrency.ts
```

---

### **Backend:**

```
☐ Database
  ☐ Schema: PlatformPublish
  ☐ Schema: PublishHistory
  ☐ Schema: ScheduledPublish
  ☐ Schema: CurrencySettings
  ☐ Schema: ExchangeRate
  ☐ Migration: npx prisma migrate dev

☐ Services
  ☐ platform.service.ts (9 دوال)
  ☐ currency.service.ts (6 دوال)
  ☐ externalPlatform.service.ts (التكامل مع المنصات الخارجية)

☐ Controllers
  ☐ platform.controller.ts (9 controllers)
  ☐ currency.controller.ts (6 controllers)

☐ Routes
  ☐ platform.routes.ts (9 routes)
  ☐ currency.routes.ts (6 routes)
  ☐ تسجيل Routes في app.ts

☐ Cron Jobs
  ☐ updateExchangeRates (كل ساعة)
  ☐ processScheduledPublishes (كل 5 دقائق)

☐ External APIs
  ☐ Aqar Map API Integration
  ☐ Haraj API Integration
  ☐ OpenSooq API Integration
  ☐ Currency Exchange API (مثل fixer.io)
```

---

## 🎯 **أمثلة استخدام كاملة**

### **مثال 1: نشر عرض على منصات متعددة**

```typescript
// في MyPlatform.tsx

import { PlatformPublisher } from '@/components/platform';
import { Platform } from '@/types/platform.types';

function OfferCard({ offer }) {
  const handlePublishSuccess = (platforms: Platform[]) => {
    console.log('Published to:', platforms);
    toast.success(`تم النشر على ${platforms.length} منصة`);
    
    // تحديث البيانات
    refetchOffers();
  };

  return (
    <div className="offer-card">
      {/* ... محتوى البطاقة ... */}
      
      <PlatformPublisher
        offerId={offer.id}
        offerData={offer}
        variant="button"
        size="md"
        onPublishSuccess={handlePublishSuccess}
      />
    </div>
  );
}
```

---

### **مثال 2: عرض السعر بعملات متعددة**

```typescript
// في MyPlatform.tsx

import { CurrencyDisplay } from '@/components/currency';
import { Currency } from '@/types/currency.types';

function OfferCard({ offer }) {
  const [selectedCurrency, setSelectedCurrency] = useState(Currency.SAR);

  return (
    <div className="offer-card">
      <h3>{offer.title}</h3>
      
      <CurrencyDisplay
        baseAmount={offer.price}
        baseCurrency={Currency.SAR}
        displayCurrencies={[
          Currency.SAR,
          Currency.USD,
          Currency.EUR,
          Currency.AED,
        ]}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        size="lg"
        showSelector={true}
      />
      
      {/* ... باقي المحتوى ... */}
    </div>
  );
}
```

---

### **مثال 3: جدولة نشر**

```typescript
// في OfferDetailPage.tsx

import { schedulePublish } from '@/lib/platformAPI';
import { Platform } from '@/types/platform.types';

async function handleSchedulePublish() {
  const scheduledFor = new Date('2024-12-25T10:00:00');
  
  try {
    const scheduleId = await schedulePublish(
      offer.id,
      [Platform.AQAR_MAP, Platform.HARAJ],
      scheduledFor,
      offer
    );
    
    toast.success('تم جدولة النشر بنجاح');
  } catch (error) {
    toast.error('فشل في جدولة النشر');
  }
}
```

---

## 🚀 **البدء السريع**

### **الخطوة 1: تثبيت المكونات (5 دقائق)**

```bash
# نسخ المكونات
cp -r /components/platform /your-project/components/
cp -r /components/currency /your-project/components/

# نسخ Types
cp /types/platform.types.ts /your-project/types/
cp /types/currency.types.ts /your-project/types/

# نسخ API Functions
cp /lib/platformAPI.ts /your-project/lib/
cp /lib/currencyAPI.ts /your-project/lib/
```

---

### **الخطوة 2: إعداد Backend (10 دقائق)**

```bash
cd backend

# تحديث Schema
# نسخ الـ Schema من الأعلى إلى prisma/schema.prisma

# تشغيل Migration
npx prisma migrate dev --name add_platform_currency_system

# نسخ Services & Controllers & Routes
cp services/* /your-backend/src/services/
cp controllers/* /your-backend/src/controllers/
cp routes/* /your-backend/src/routes/

# تسجيل Routes في app.ts
```

---

### **الخطوة 3: Integration (15 دقيقة)**

```typescript
// في MyPlatform.tsx

import { PlatformPublisher } from '@/components/platform';
import { CurrencyDisplay } from '@/components/currency';

// إضافة في كل بطاقة عرض
<PlatformPublisher offerId={offer.id} offerData={offer} />
<CurrencyDisplay baseAmount={offer.price} />
```

---

## ✅ **النتيجة النهائية**

```
✅ نظام نشر كامل على 5 منصات عقارية
✅ نظام عملات يدعم 10 عملات
✅ تكامل كامل مع "منصتي"
✅ 17 مكون جاهز
✅ 15 API function
✅ 15 endpoint
✅ 5 Database tables
✅ جميع الأزرار موثقة
✅ جميع الدوال موثقة
✅ جميع المسارات موثقة
✅ أمثلة استخدام كاملة
✅ جاهز للنسخ والتنفيذ!
```

---

**🎯 الحالة:** ✅ **توثيق كامل 100%**

**📁 الملفات:**
- COMPLETE-PLATFORM-PUBLISHING-SYSTEM.md (Part 1)
- COMPLETE-PLATFORM-PUBLISHING-SYSTEM-PART2.md (Part 2)
- COMPLETE-PLATFORM-PUBLISHING-SYSTEM-PART3.md (Part 3 - هذا الملف)

**🚀 جاهز للتنفيذ الفوري!**