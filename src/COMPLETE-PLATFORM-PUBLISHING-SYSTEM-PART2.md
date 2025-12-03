# 📱 **نظام النشر على المنصات - الجزء الثاني**

## 🎨 **المكونات المتبقية**

### **3. PublishModal.tsx - Modal النشر**

```typescript
// File: /components/platform/PublishModal.tsx

'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Globe, Calendar, Settings as SettingsIcon, Send, Loader2 } from 'lucide-react';
import { Platform, OfferPublishData } from '@/types/platform.types';
import { PlatformSelector } from './PlatformSelector';
import { SchedulePublish } from './SchedulePublish';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatforms: Platform[];
  onPlatformsChange: (platforms: Platform[]) => void;
  onPublish: () => Promise<void>;
  publishing: boolean;
  offerData: OfferPublishData;
}

/**
 * Modal النشر على المنصات
 * 
 * التبويبات:
 * - نشر فوري: اختيار المنصات والنشر مباشرة
 * - نشر مجدول: جدولة النشر لوقت محدد
 * - إعدادات: تخصيص إعدادات النشر
 */
export function PublishModal({
  isOpen,
  onClose,
  selectedPlatforms,
  onPlatformsChange,
  onPublish,
  publishing,
  offerData,
}: PublishModalProps) {
  const [activeTab, setActiveTab] = useState('instant');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Globe className="w-6 h-6 text-[#01411C]" />
            نشر على المنصات العقارية
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instant">
              <Send className="w-4 h-4 ml-2" />
              نشر فوري
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 ml-2" />
              نشر مجدول
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="w-4 h-4 ml-2" />
              إعدادات
            </TabsTrigger>
          </TabsList>

          {/* تبويب النشر الفوري */}
          <TabsContent value="instant" className="space-y-4 mt-6">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onChange={onPlatformsChange}
              layout="grid"
            />
          </TabsContent>

          {/* تبويب النشر المجدول */}
          <TabsContent value="schedule" className="mt-6">
            <SchedulePublish
              offerId={offerData.id}
              offerData={offerData}
              onScheduled={() => {
                onClose();
              }}
            />
          </TabsContent>

          {/* تبويب الإعدادات */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                إعدادات النشر قيد التطوير...
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {activeTab === 'instant' && (
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              onClick={onPublish}
              disabled={publishing || selectedPlatforms.length === 0}
              className="bg-[#01411C] hover:bg-[#01411C]/90"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري النشر...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  نشر على {selectedPlatforms.length} منصة
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

### **4. CurrencyDisplay.tsx - عرض السعر بالعملات**

```typescript
// File: /components/currency/CurrencyDisplay.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import {
  Currency,
  MultiCurrencyPrice,
  CURRENCY_NAMES,
  CURRENCY_SYMBOLS,
  CURRENCY_FLAGS,
} from '@/types/currency.types';
import { getMultiCurrencyPrice, formatPrice } from '@/lib/currencyAPI';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface CurrencyDisplayProps {
  /** السعر الأساسي */
  baseAmount: number;
  
  /** العملة الأساسية */
  baseCurrency?: Currency;
  
  /** العملات المعروضة */
  displayCurrencies?: Currency[];
  
  /** العملة المحددة للعرض */
  selectedCurrency?: Currency;
  
  /** حجم النص */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** عرض dropdown لتغيير العملة */
  showSelector?: boolean;
  
  /** callback عند تغيير العملة */
  onCurrencyChange?: (currency: Currency) => void;
}

/**
 * مكون عرض السعر بعملات متعددة
 * 
 * الميزات:
 * - عرض السعر بالعملة المختارة
 * - تحويل تلقائي للعملات
 * - dropdown لاختيار العملة
 * - تحديث أسعار الصرف
 * 
 * @example
 * <CurrencyDisplay
 *   baseAmount={500000}
 *   baseCurrency={Currency.SAR}
 *   displayCurrencies={[Currency.SAR, Currency.USD, Currency.EUR]}
 *   showSelector={true}
 * />
 */
export function CurrencyDisplay({
  baseAmount,
  baseCurrency = Currency.SAR,
  displayCurrencies = [Currency.SAR, Currency.USD, Currency.EUR, Currency.AED],
  selectedCurrency: initialCurrency,
  size = 'md',
  showSelector = true,
  onCurrencyChange,
}: CurrencyDisplayProps) {
  // ====== STATE ======
  
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    initialCurrency || baseCurrency
  );
  const [multiPrice, setMultiPrice] = useState<MultiCurrencyPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // ====== EFFECTS ======
  
  useEffect(() => {
    fetchPrices();
  }, [baseAmount, baseCurrency]);
  
  // ====== HANDLERS ======
  
  /**
   * جلب الأسعار بالعملات المختلفة
   */
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const prices = await getMultiCurrencyPrice(
        baseAmount,
        baseCurrency,
        displayCurrencies
      );
      setMultiPrice(prices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * تحديث الأسعار
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPrices();
    setRefreshing(false);
  };
  
  /**
   * تغيير العملة
   */
  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };
  
  // ====== COMPUTED VALUES ======
  
  /** السعر بالعملة المحددة */
  const displayAmount = multiPrice
    ? multiPrice.conversions[selectedCurrency] || baseAmount
    : baseAmount;
  
  /** النص المنسق */
  const formattedPrice = formatPrice(displayAmount, selectedCurrency);
  
  /** حجم الخط */
  const fontSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];
  
  // ====== RENDER ======
  
  if (loading && !multiPrice) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>جاري التحميل...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3" dir="rtl">
      {/* السعر */}
      <div className="flex items-baseline gap-2">
        <span className={`${fontSize} font-bold text-[#D4AF37]`}>
          {displayAmount.toLocaleString('ar-SA')}
        </span>
        <span className="text-lg text-gray-600">
          {CURRENCY_SYMBOLS[selectedCurrency]}
        </span>
      </div>
      
      {/* اختيار العملة */}
      {showSelector && displayCurrencies.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span>{CURRENCY_FLAGS[selectedCurrency]}</span>
              <span>{CURRENCY_NAMES[selectedCurrency]}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" dir="rtl">
            {displayCurrencies.map((currency) => (
              <DropdownMenuItem
                key={currency}
                onClick={() => handleCurrencyChange(currency)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-lg">{CURRENCY_FLAGS[currency]}</span>
                <span>{CURRENCY_NAMES[currency]}</span>
                {multiPrice?.conversions[currency] && (
                  <Badge variant="secondary" className="mr-auto">
                    {formatPrice(multiPrice.conversions[currency]!, currency)}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* زر التحديث */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefresh}
        disabled={refreshing}
        className="p-2"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
      </Button>
      
      {/* آخر تحديث */}
      {multiPrice && (
        <span className="text-xs text-gray-500">
          آخر تحديث: {new Date(multiPrice.lastUpdated).toLocaleTimeString('ar-SA')}
        </span>
      )}
    </div>
  );
}
```

---

### **5. التكامل مع MyPlatform.tsx**

```typescript
// File: /components/MyPlatform.tsx - إضافة النشر والعملات

'use client';

import React, { useState, useEffect } from 'react';
import { PlatformPublisher } from './platform/PlatformPublisher';
import { CurrencyDisplay } from './currency/CurrencyDisplay';
import { Currency } from '@/types/currency.types';

export function MyPlatform() {
  const [offers, setOffers] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(Currency.SAR);

  // ... الكود الموجود ...

  return (
    <div className="container mx-auto p-6" dir="rtl">
      {/* عنوان الصفحة مع اختيار العملة */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">منصتي</h1>
        
        {/* اختيار العملة العامة */}
        <CurrencyDisplay
          baseAmount={0}
          baseCurrency={Currency.SAR}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          showSelector={true}
          size="sm"
        />
      </div>

      {/* قائمة العروض */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="border rounded-lg p-4 space-y-4">
            {/* صورة العرض */}
            <img
              src={offer.images[0]}
              alt={offer.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            {/* تفاصيل العرض */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{offer.title}</h3>
              
              {/* السعر بالعملة المختارة */}
              <CurrencyDisplay
                baseAmount={offer.price}
                baseCurrency={Currency.SAR}
                selectedCurrency={selectedCurrency}
                size="md"
                showSelector={false}
              />
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {offer.description}
              </p>
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="space-y-2">
              {/* زر النشر على المنصات */}
              <PlatformPublisher
                offerId={offer.id}
                offerData={offer}
                variant="button"
                size="md"
                onPublishSuccess={(platforms) => {
                  console.log('Published to:', platforms);
                  // تحديث البيانات
                }}
              />
              
              {/* أزرار أخرى */}
              {/* ... */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🗄️ **Database Schema (Prisma)**

```prisma
// File: backend/prisma/schema.prisma

// جدول المنصات المنشورة
model PlatformPublish {
  id            String    @id @default(cuid())
  
  // العرض
  offerId       String
  offer         Offer     @relation(fields: [offerId], references: [id], onDelete: Cascade)
  
  // المستخدم
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // المنصة
  platform      String    // AQAR_MAP, HARAJ, etc.
  platformId    String?   // معرف العرض على المنصة
  externalUrl   String?   // رابط العرض على المنصة
  
  // الحالة
  status        String    // DRAFT, PENDING, PUBLISHED, FAILED, etc.
  errorMessage  String?
  
  // الإحصائيات
  viewCount     Int       @default(0)
  clickCount    Int       @default(0)
  leadCount     Int       @default(0)
  
  // التواريخ
  publishedAt   DateTime?
  lastUpdated   DateTime  @updatedAt
  createdAt     DateTime  @default(now())
  
  @@unique([offerId, platform])
  @@index([userId])
  @@index([platform])
  @@index([status])
}

// جدول سجل النشر
model PublishHistory {
  id            String    @id @default(cuid())
  
  // العرض
  offerId       String
  offer         Offer     @relation(fields: [offerId], references: [id], onDelete: Cascade)
  
  // المستخدم
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // التفاصيل
  platform      String
  action        String    // PUBLISH, UPDATE, DELETE
  publishType   String    // MANUAL, AUTOMATIC, SCHEDULED, BULK
  status        String
  errorMessage  String?
  
  // البيانات الإضافية
  metadata      Json?
  
  // التاريخ
  performedAt   DateTime  @default(now())
  
  @@index([offerId])
  @@index([userId])
  @@index([platform])
  @@index([performedAt])
}

// جدول النشر المجدول
model ScheduledPublish {
  id            String    @id @default(cuid())
  
  // العرض
  offerId       String
  offer         Offer     @relation(fields: [offerId], references: [id], onDelete: Cascade)
  
  // المستخدم
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // المنصات
  platforms     String[]  // ['AQAR_MAP', 'HARAJ', ...]
  
  // الموعد
  scheduledFor  DateTime
  
  // الحالة
  status        String    // PENDING, SENT, FAILED, CANCELLED
  errorMessage  String?
  
  // التواريخ
  executedAt    DateTime?
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([scheduledFor])
  @@index([status])
}

// جدول إعدادات العملات
model CurrencySettings {
  id                String    @id @default(cuid())
  
  // المستخدم
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // الإعدادات
  defaultCurrency   String    @default("SAR")
  displayCurrencies String[]  @default(["SAR", "USD", "EUR"])
  autoUpdate        Boolean   @default(true)
  updateInterval    Int       @default(60) // دقائق
  roundDecimals     Int       @default(2)
  showSymbol        Boolean   @default(true)
  symbolPosition    String    @default("after") // before, after
  
  // التواريخ
  updatedAt         DateTime  @updatedAt
  createdAt         DateTime  @default(now())
}

// جدول أسعار الصرف
model ExchangeRate {
  id            String    @id @default(cuid())
  
  // العملات
  fromCurrency  String
  toCurrency    String
  
  // السعر
  rate          Float
  
  // المصدر
  source        String    @default("API")
  
  // التاريخ
  lastUpdated   DateTime  @default(now())
  createdAt     DateTime  @default(now())
  
  @@unique([fromCurrency, toCurrency])
  @@index([lastUpdated])
}

// تحديث جدول Offer
model Offer {
  // ... الحقول الموجودة ...
  
  // علاقات النشر
  platformPublishes   PlatformPublish[]
  publishHistory      PublishHistory[]
  scheduledPublishes  ScheduledPublish[]
}

// تحديث جدول User  
model User {
  // ... الحقول الموجودة ...
  
  // علاقات النشر
  platformPublishes   PlatformPublish[]
  publishHistory      PublishHistory[]
  scheduledPublishes  ScheduledPublish[]
  currencySettings    CurrencySettings?
}
```

---

## 🔌 **API Endpoints الكاملة**

```typescript
// File: backend/src/routes/platform.routes.ts

import { Router } from 'express';
import { auth } from '../middleware/auth';
import * as platformController from '../controllers/platform.controller';

const router = Router();

/**
 * POST /api/platform/publish/single
 * نشر عرض على منصة واحدة
 * 
 * Body: {
 *   offerId: string,
 *   platform: Platform,
 *   offerData: OfferPublishData
 * }
 * 
 * Response: {
 *   success: boolean,
 *   platformData: PlatformData
 * }
 */
router.post('/publish/single', auth, platformController.publishToSingle);

/**
 * POST /api/platform/publish/multiple
 * نشر عرض على منصات متعددة
 * 
 * Body: {
 *   offerId: string,
 *   platforms: Platform[],
 *   offerData: OfferPublishData
 * }
 * 
 * Response: {
 *   success: boolean,
 *   results: Record<Platform, PlatformData>
 * }
 */
router.post('/publish/multiple', auth, platformController.publishToMultiple);

/**
 * PUT /api/platform/update
 * تحديث عرض منشور
 * 
 * Body: {
 *   offerId: string,
 *   platform: Platform,
 *   platformId: string,
 *   updates: Partial<OfferPublishData>
 * }
 * 
 * Response: {
 *   success: boolean,
 *   platformData: PlatformData
 * }
 */
router.put('/update', auth, platformController.updatePublished);

/**
 * DELETE /api/platform/delete
 * حذف عرض من منصة
 * 
 * Body: {
 *   offerId: string,
 *   platform: Platform,
 *   platformId: string
 * }
 * 
 * Response: {
 *   success: boolean
 * }
 */
router.delete('/delete', auth, platformController.deleteFromPlatform);

/**
 * GET /api/platform/status/:offerId
 * جلب حالة النشر لعرض
 * 
 * Response: {
 *   success: boolean,
 *   platforms: Record<Platform, PlatformData>
 * }
 */
router.get('/status/:offerId', auth, platformController.getStatus);

/**
 * GET /api/platform/history
 * جلب سجل النشر
 * 
 * Query: {
 *   offerId?: string,
 *   platform?: Platform,
 *   limit?: number
 * }
 * 
 * Response: {
 *   success: boolean,
 *   history: PublishHistoryItem[]
 * }
 */
router.get('/history', auth, platformController.getHistory);

/**
 * GET /api/platform/analytics/:userId
 * جلب إحصائيات النشر
 * 
 * Response: {
 *   success: boolean,
 *   analytics: PublishAnalytics
 * }
 */
router.get('/analytics/:userId', auth, platformController.getAnalytics);

/**
 * POST /api/platform/schedule
 * جدولة نشر عرض
 * 
 * Body: {
 *   offerId: string,
 *   platforms: Platform[],
 *   scheduledFor: string (ISO date),
 *   offerData: OfferPublishData
 * }
 * 
 * Response: {
 *   success: boolean,
 *   scheduleId: string
 * }
 */
router.post('/schedule', auth, platformController.schedulePublish);

/**
 * POST /api/platform/bulk-publish
 * نشر جماعي لعدة عروض
 * 
 * Body: {
 *   offerIds: string[],
 *   platforms: Platform[]
 * }
 * 
 * Response: {
 *   success: boolean,
 *   results: Record<string, Record<Platform, PlatformData>>
 * }
 */
router.post('/bulk-publish', auth, platformController.bulkPublish);

export default router;
```

سأكمل باقي الملف في الرسالة التالية مع Currency Routes و Controllers...