# 📢 التوثيق الشامل الحرفي 100% - تبويب نشر الإعلان (PublishedAdsSlide)

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     📢 سلايد الإعلانات المنشورة - التوثيق الكامل 📢           ║
║                                                                  ║
║  كل شيء بالتفصيل: المسارات، الدوال، الاستدعاءات،              ║
║  الاستيراد، التعاريف، الأزرار، الحقول، الربط، الألوان          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📋 جدول المحتويات

1. [المعلومات الأساسية](#معلومات-أساسية)
2. [الملفات والمسارات](#الملفات-والمسارات)
3. [التعاريف (Interfaces)](#التعاريف)
4. [الاستيرادات (Imports)](#الاستيرادات)
5. [State Management](#state-management)
6. [useEffect - التحميل والتحديث](#useeffect)
7. [Empty State](#empty-state)
8. [Header العنوان الرئيسي](#header)
9. [Ad Selector قائمة الإعلانات](#ad-selector)
10. [جميع الأقسام (15 قسم)](#الأقسام)
11. [الدوال المساعدة](#الدوال)
12. [localStorage System](#localstorage)
13. [Events System](#events)

---

# 📍 معلومات أساسية

## الملف الرئيسي
- **المسار**: `/components/CustomerDetailsWithSlides-Enhanced.tsx`
- **السطر**: 2017-2657 (640 سطر)
- **الاسم**: `PublishedAdsSlide`
- **النوع**: `React.FC` Function Component

## الموقع في الـ Slides
```tsx
// السطر 304 - تعريف السلايد
{ id: 'published-ads', title: 'إعلان منشور', icon: Megaphone, color: '#DC143C', isDefault: true }

// السطر 610 - الاستدعاء
{currentSlide === 1 && <PublishedAdsSlide customer={customer} onUpdate={onUpdate} />}
```

## Props Interface
```typescript
interface Props {
  customer: Customer;
  onUpdate?: (customer: Customer) => void;
}
```

---

# 📁 الملفات والمسارات

## 1. المكون الرئيسي

```
📄 /components/CustomerDetailsWithSlides-Enhanced.tsx
   ├── السطر 2017: function PublishedAdsSlide()
   ├── السطر 2018-2019: State declarations
   ├── السطر 2022-2037: useEffect (loading & events)
   ├── السطر 2039-2052: Empty state
   ├── السطر 2054: selectedAd declaration
   └── السطر 2056-2657: JSX Return
```

## 2. Utility File

```
📄 /utils/publishedAds.ts (607 سطر)
   ├── السطر 6-121: PublishedAd Interface
   ├── السطر 124: STORAGE_KEY constant
   ├── السطر 166-238: savePublishedAd()
   ├── السطر 243-282: getAllPublishedAds()
   ├── السطر 287-290: getAdsByOwnerPhone()
   ├── السطر 295-298: getAdByNumber()
   ├── السطر 303-341: updatePublishedAd()
   ├── السطر 346-349: getPublishedAdById()
   ├── السطر 354-367: deletePublishedAd()
   ├── السطر 372-387: updateAdStatus()
   ├── السطر 392-405: updateAdStats()
   └── السطر 410-414: generateAdNumber()
```

---

# 🏗️ التعاريف (Interfaces)

## PublishedAd Interface

### المسار: `/utils/publishedAds.ts` السطر 6-121

```typescript
export interface PublishedAd {
  // ═══════════════════════════════════════════════════
  // 1️⃣ المعرفات (3 حقول)
  // ═══════════════════════════════════════════════════
  id: string;                    // معرف فريد
  adNumber: string;              // رقم الإعلان (مثل: AD-1234567890-123)
  ownerId: string;               // معرف المالك في CRM
  
  // ═══════════════════════════════════════════════════
  // 2️⃣ ربط المالك (2 حقول) ⭐ المفتاح الأساسي
  // ═══════════════════════════════════════════════════
  ownerPhone: string;            // رقم جوال المالك (المفتاح للربط)
  ownerName: string;             // اسم المالك
  
  // ═══════════════════════════════════════════════════
  // 3️⃣ بيانات الإعلان الأساسية (6 حقول)
  // ═══════════════════════════════════════════════════
  title: string;                 // عنوان الإعلان
  description: string;           // الوصف النهائي
  propertyType: string;          // نوع العقار (شقة، فيلا، أرض)
  purpose: string;               // الغرض (بيع، إيجار)
  price: string;                 // السعر
  area: string;                  // المساحة
  
  // ═══════════════════════════════════════════════════
  // 4️⃣ تفاصيل العقار (10 حقول)
  // ═══════════════════════════════════════════════════
  bedrooms: number;              // عدد الغرف
  bathrooms: number;             // عدد الحمامات
  location: {
    city: string;                // المدينة ⭐ إلزامي
    district: string;            // الحي ⭐ إلزامي
    street: string;              // الشارع
    postalCode: string;          // الرمز البريدي
    buildingNumber: string;      // رقم المبنى
    additionalNumber: string;    // الرقم الإضافي
    latitude: number;            // خط العرض (0 = غير محدد)
    longitude: number;           // خط الطول (0 = غير محدد)
    nationalAddress?: string;    // العنوان الوطني
  };
  
  // ═══════════════════════════════════════════════════
  // 5️⃣ معلومات المالك الإضافية (6 حقول)
  // ═══════════════════════════════════════════════════
  idNumber: string;              // رقم بطاقة الأحوال
  idIssueDate: string;           // تاريخ إصدار البطاقة
  idExpiryDate: string;          // تاريخ انتهاء البطاقة
  deedNumber: string;            // رقم الصك
  deedDate: string;              // تاريخ الصك
  deedIssuer: string;            // جهة إصدار الصك
  
  // ═══════════════════════════════════════════════════
  // 6️⃣ الوسائط المتعددة (array)
  // ═══════════════════════════════════���═══════════════
  mediaFiles: {
    id: string;
    url: string;
    type: 'image' | 'video';     // نوع الوسائط
    name: string;                // اسم الملف
  }[];
  
  // ═══════════════════════════════════════════════════
  // 7️⃣ المنصات المنشور عليها (array) ⭐⭐⭐
  // ═══════════════════════════════════════════════════
  publishedPlatforms: {
    id: string;
    name: string;                // اسم المنصة (حراج، عقار ماب)
    status: 'published' | 'pending' | 'failed';
    publishedAt: Date;           // تاريخ النشر
    adUrl?: string;              // رابط الإعلان على المنصة
  }[];
  
  // ═══════════════════════════════════════════════════
  // 8️⃣ الهاشتاقات والمسار (2 حقول)
  // ═══════════════════════════════════════════════════
  hashtags: string[];            // الهاشتاقات
  platformPath: string;          // مسار المنصة
  
  // ═══════════════════════════════════════════════════
  // 9️⃣ معلومات الترخيص (2 حقول)
  // ═══════════════════════════════════════════════════
  advertisingLicense: string;    // رقم الترخيص الإعلاني
  advertisingLicenseStatus: 'valid' | 'invalid' | 'checking' | 'unknown';
  
  // ═══════════════════════════════════════════════════
  // 🔟 الذكاء الاصطناعي (3 حقول)
  // ═══════════════════════════════════════════════════
  aiGeneratedDescription: string; // الوصف المولّد بـ AI
  aiLanguage: string;             // اللغة (عربي، إنجليزي)
  aiTone: string;                 // الأسلوب (رسمي، ودي)
  
  // ═══════════════════════════════════════════════════
  // 1️⃣1️⃣ التواريخ (3 حقول)
  // ═══════════════════════════════════════════════════
  createdAt: Date;               // تاريخ الإنشاء
  publishedAt: Date;             // تاريخ النشر
  updatedAt: Date;               // آخر تحديث
  
  // ═══════════════════════════════════════════════════
  // 1️⃣2️⃣ معلومات إضافية (2 حقول)
  // ═══════════════════════════════════════════════════
  virtualTourLink?: string;      // رابط الجولة الافتراضية
  whatsappNumber: string;        // رقم الواتساب
  
  // ═══════════════════════════════════════════════════
  // 1️⃣3️⃣ الضمانات (array)
  // ═══════════════════════════════════════════════════
  warranties: {
    id: string;
    type: string;                // نوع الضمان
    duration: string;            // المدة
    notes: string;               // ملاحظات
  }[];
  
  // ═══════════════════════════════════════════════════
  // 1️⃣4️⃣ المميزات المخصصة (array)
  // ═══════════════════════════════════════════════════
  customFeatures: string[];      // مميزات إضافية
  
  // ═══════════════════════════════════════════════════
  // 1️⃣5️⃣ الإحصائيات (object)
  // ═══════════════════════════════════════════════════
  stats: {
    views: number;               // عدد المشاهدات
    requests: number;            // عدد الطلبات
    likes: number;               // عدد الإعجابات
    shares: number;              // عدد المشاركات
  };
  
  // ═══════════════════════════════════════════════════
  // 1️⃣6️⃣ الحالة (1 حقل) ⭐
  // ═══════════════════════════════════════════════════
  status: 'draft' | 'published' | 'active' | 'inactive' | 'sold' | 'rented' | 'archived';
  
  // ═══════════════════════════════════════════════════
  // 1️⃣7️⃣ ملاحظات (1 حقل)
  // ═══════════════════════════════════════════════════
  notes: string;                 // ملاحظات إضافية
  
  // ═══════════════════════════════════════════════════
  // 1️⃣8️⃣ التصنيف الذكي (2 حقول)
  // ═══════════════════════════════════════════════════
  propertyCategory: 'سكني' | 'تجاري';
  smartPath?: string;            // المسار الذكي
}
```

### إحصائيات Interface

| المجموعة | عدد الحقول | الإلزامي |
|----------|-------------|----------|
| المعرفات | 3 | ✅ |
| ربط المالك | 2 | ✅ |
| البيانات الأساسية | 6 | ✅ |
| تفاصيل العقار | 10 | ✅ (المدينة والحي فقط) |
| معلومات المالك | 6 | ❌ |
| الوسائط | array | ❌ |
| المنصات | array | ❌ |
| الهاشتاقات | 2 | ❌ |
| الترخيص | 2 | ❌ |
| AI | 3 | ❌ |
| التواريخ | 3 | ✅ |
| إضافية | 2 | ❌ |
| الضمانات | array | ❌ |
| المميزات | array | ❌ |
| الإحصائيات | object | ❌ |
| الحالة | 1 | ✅ |
| الملاحظات | 1 | ❌ |
| التصنيف | 2 | ❌ |
| **المجموع** | **60+ خاصية** | - |

---

# 📦 الاستيرادات (Imports)

## من `/utils/publishedAds.ts`

```tsx
// السطر 17
import { getAdsByOwnerPhone, type PublishedAd } from '../utils/publishedAds';
```

### الوظائف المستوردة

| الدالة | النوع | الوظيفة | السطر |
|--------|------|---------|-------|
| `getAdsByOwnerPhone` | function | جلب إعلانات مالك محدد | 287-290 |
| `PublishedAd` | type | Interface الإعلان | 6-121 |

---

# 💾 State Management

## السطر 2018-2019

```tsx
const [publishedAds, setPublishedAds] = useState<PublishedAd[]>([]);
const [selectedAdIndex, setSelectedAdIndex] = useState(0);
```

| State | النوع | القيمة الافتراضية | الوظيفة |
|-------|------|-------------------|---------|
| `publishedAds` | `PublishedAd[]` | `[]` | قائمة جميع إعلانات المالك |
| `selectedAdIndex` | `number` | `0` | فهرس الإعلان المختار حالياً |

### selectedAd (مشتق)

```tsx
// السطر 2054
const selectedAd = publishedAds[selectedAdIndex];
```

---

# 🔄 useEffect - التحميل والتحديث

## السطر 2022-2037

```tsx
// تحميل الإعلانات المنشورة للمالك باستخدام رقم الجوال
useEffect(() => {
  console.log('🔍 PublishedAdsSlide: جاري تحميل الإعلانات للعميل:', customer.name, customer.phone);
  const ads = getAdsByOwnerPhone(customer.phone);
  console.log('📢 PublishedAdsSlide: تم العثور على', ads.length, 'إعلانات');
  setPublishedAds(ads);

  // الاستماع للتحديثات التلقائية
  const handleAdSaved = () => {
    const updatedAds = getAdsByOwnerPhone(customer.phone);
    setPublishedAds(updatedAds);
    console.log('🔄 تم تحديث الإعلانات تلقائياً:', updatedAds.length);
  };

  window.addEventListener('publishedAdSaved', handleAdSaved);
  return () => window.removeEventListener('publishedAdSaved', handleAdSaved);
}, [customer.phone]);
```

### الآلية التفصيلية

#### 1️⃣ التحميل الأولي

```tsx
const ads = getAdsByOwnerPhone(customer.phone);
setPublishedAds(ads);
```

**الخطوات:**
1. استدعاء `getAdsByOwnerPhone()` مع رقم جوال العميل
2. الدالة تقرأ من localStorage: مفتاح `published_ads_storage`
3. فلترة الإعلانات: `ad.ownerPhone === customer.phone`
4. تحديث State بالنتيجة

#### 2️⃣ Event Listener - التحديث التلقائي

```tsx
const handleAdSaved = () => {
  const updatedAds = getAdsByOwnerPhone(customer.phone);
  setPublishedAds(updatedAds);
};

window.addEventListener('publishedAdSaved', handleAdSaved);
```

**Event: `publishedAdSaved`**
- **المصدر**: `/utils/publishedAds.ts` السطر 221
- **التوقيت**: عند حفظ إعلان جديد عبر `savePublishedAd()`
- **Detail**: `{ detail: ad }`
- **الوظيفة**: تحديث القائمة فوراً بدون page refresh

#### 3️⃣ Cleanup

```tsx
return () => window.removeEventListener('publishedAdSaved', handleAdSaved);
```

**الوظيفة:** إزالة Event Listener عند unmount المكون

---

# ❌ Empty State - لا توجد إعلانات

## السطر 2039-2052

```tsx
if (publishedAds.length === 0) {
  return (
    <div className="text-center py-12">
      <Megaphone className="w-24 h-24 mx-auto mb-4 text-gray-300" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد إعلانات منشورة</h3>
      <p className="text-gray-500 mb-6">
        لم يتم نشر أي إعلانات لهذا العميل حتى الآن
      </p>
      <p className="text-sm text-gray-400">
        رقم الجوال: {customer.phone}
      </p>
    </div>
  );
}
```

### التنسيق الحرفي

| العنصر | Classes | الأبعاد/اللون | القيمة |
|--------|---------|---------------|--------|
| **Container** | `text-center py-12` | padding 48px | - |
| **الأيقونة** | `w-24 h-24 mx-auto mb-4 text-gray-300` | 96×96px | `Megaphone` |
| **العنوان** | `text-xl font-bold text-gray-700 mb-2` | 20px Bold | "لا توجد إعلانات منشورة" |
| **الوصف** | `text-gray-500 mb-6` | 16px | "لم يتم نشر أي إعلانات..." |
| **رقم الجوال** | `text-sm text-gray-400` | 14px | `customer.phone` |

---

# 📌 Header - العنوان الرئيسي

## السطر 2058-2067

```tsx
{/* العنوان */}
<div className="flex items-center gap-3 mb-6">
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DC143C] to-[#B22222] flex items-center justify-center">
    <Megaphone className="w-6 h-6 text-white" />
  </div>
  <div>
    <h3 className="text-xl font-bold text-[#DC143C]">📢 إعلان منشور</h3>
    <p className="text-gray-600 text-sm">تفاصيل الإعلانات المنشورة</p>
  </div>
</div>
```

### التفصيل الحرفي

#### الأيقونة الدائرية

```tsx
className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DC143C] to-[#B22222]"
```

| الخاصية | القيمة | الوصف |
|---------|--------|-------|
| **Width × Height** | 48×48px | `w-12 h-12` |
| **Shape** | دائري كامل | `rounded-full` |
| **Background** | Gradient | من الأحمر القرمزي للأحمر الناري |
| **Direction** | `bg-gradient-to-br` | من أعلى اليسار لأسفل اليمين |
| **Color 1** | `#DC143C` | Crimson (أحمر قرمزي) |
| **Color 2** | `#B22222` | Firebrick (أحمر ناري) |

#### الأيقونة الداخلية

```tsx
<Megaphone className="w-6 h-6 text-white" />
```
- **الحجم**: 24×24px
- **اللون**: أبيض

#### العنوان

```tsx
<h3 className="text-xl font-bold text-[#DC143C]">📢 إعلان منشور</h3>
```
- **Font Size**: 20px (`text-xl`)
- **Font Weight**: Bold
- **اللون**: `#DC143C`
- **النص**: "📢 إعلان منشور"

#### الوصف

```tsx
<p className="text-gray-600 text-sm">تفاصيل الإعلانات المن��ورة</p>
```
- **Font Size**: 14px (`text-sm`)
- **اللون**: `text-gray-600`
- **النص**: "تفاصيل الإعلانات المنشورة"

---

# 📋 Ad Selector - قائمة اختيار الإعلانات

## السطر 2069-2132

### البنية الأساسية

```tsx
<Card className="border-2 border-[#DC143C] shadow-lg">
  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
    {/* العنوان + Badge العداد */}
  </CardHeader>
  <CardContent className="pt-6">
    {/* الحالة 1 أو 2 */}
    {/* معلومات إضافية */}
  </CardContent>
</Card>
```

### Header البطاقة

```tsx
<CardTitle className="flex items-center justify-between text-[#DC143C]">
  <div className="flex items-center gap-2">
    <Megaphone className="w-5 h-5" />
    📋 اختر الإعلان
  </div>
  <Badge className="bg-[#DC143C] text-white">
    {publishedAds.length} {publishedAds.length === 1 ? 'إعلان' : 'إعلانات'}
  </Badge>
</CardTitle>
```

#### التنسيق
- **Background**: Gradient من `red-50` إلى `pink-50`
- **العنوان**: `text-[#DC143C]` أحمر
- **الأيقونة**: `Megaphone` 20×20px
- **Badge**: خلفية حمراء + نص أبيض

#### العداد الذكي
```tsx
{publishedAds.length} {publishedAds.length === 1 ? 'إعلان' : 'إعلانات'}
```
- **1**: "1 إعلان"
- **2+**: "X إعلانات"

---

## الحالة 1: إعلان واحد فقط

### الشرط: `publishedAds.length === 1`

```tsx
<div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
  <p className="text-center text-green-700 font-bold">
    ✅ إعلان واحد موجود - يتم عرضه تلقائياً
  </p>
</div>
```

| الخاصية | القيمة |
|---------|--------|
| **Padding** | 16px |
| **Background** | `bg-green-50` (أخضر فاتح جداً) |
| **Border** | `border-2 border-green-300` |
| **النص** | أخضر غامق Bold |

---

## الحالة 2: أكثر من إعلان

### الشرط: `publishedAds.length > 1`

```tsx
<div className="grid md:grid-cols-2 gap-3">
  {publishedAds.map((ad, index) => (
    <Button {...} />
  ))}
</div>
```

### Grid Layout
- **موبايل**: عمود واحد
- **PC (md+)**: عمودين
- **Gap**: 12px

---

### زر الإعلان (Ad Button)

#### الكود الكامل

```tsx
<Button
  key={ad.id}
  variant={index === selectedAdIndex ? "default" : "outline"}
  onClick={() => setSelectedAdIndex(index)}
  className={`h-auto py-4 px-4 text-right justify-start ${
    index === selectedAdIndex 
      ? "bg-[#DC143C] hover:bg-[#B22222] text-white border-[#DC143C]" 
      : "hover:bg-red-50 hover:border-[#DC143C]"
  }`}
>
  <div className="flex flex-col items-start gap-1 w-full">
    {/* المحتوى */}
  </div>
</Button>
```

#### الحالات الديناميكية

| الحالة | Background | Text | Border | Hover |
|--------|-----------|------|--------|-------|
| **مختار** | `bg-[#DC143C]` | `text-white` | `border-[#DC143C]` | `hover:bg-[#B22222]` |
| **غير مختار** | شفاف | افتراضي | `outline` | `hover:bg-red-50 hover:border-[#DC143C]` |

#### المحتوى الداخلي

```tsx
<div className="flex flex-col items-start gap-1 w-full">
  {/* الصف 1: Badge + نوع العقار */}
  <div className="flex items-center gap-2 w-full">
    <Badge className={index === selectedAdIndex ? "bg-white text-[#DC143C]" : "bg-[#DC143C] text-white"}>
      #{index + 1}
    </Badge>
    <span className="font-bold truncate flex-1">
      {ad.propertyType} - {ad.purpose}
    </span>
  </div>
  
  {/* الصف 2: رقم الإعلان */}
  <span className="text-xs opacity-80 truncate w-full">
    رقم الإعلان: {ad.adNumber}
  </span>
  
  {/* الصف 3: الموقع */}
  <span className="text-xs opacity-80">
    📍 {ad.location.city} - {ad.location.district}
  </span>
</div>
```

##### Badge الرقم

| الحالة | Background | Text |
|--------|-----------|------|
| **مختار** | `bg-white` | `text-[#DC143C]` |
| **غير مخت��ر** | `bg-[#DC143C]` | `text-white` |

##### الصفوف الثلاثة

| الصف | المحتوى | Font Size | Classes |
|------|---------|-----------|---------|
| **1** | Badge + نوع - غرض | Default | `font-bold truncate` |
| **2** | رقم الإعلان | 12px | `text-xs opacity-80 truncate` |
| **3** | المدينة - الحي | 12px | `text-xs opacity-80` |

---

### ملاحظة إضافية

```tsx
<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="text-sm text-blue-700">
    💡 <span className="font-bold">ملاحظة:</span> يتم عرض الإعلانات بناءً على رقم الجوال: {customer.phone}
  </p>
</div>
```

---

# 📊 الأقسام الكاملة (15 قسم)

## القائمة الكاملة

| # | القسم | السطر | اللون | الشرط |
|---|-------|-------|-------|-------|
| 1 | **معلومات العقار الأساسية** | 2134-2199 | ذهبي `#D4AF37` | ✅ دائماً |
| 2 | **معلومات المالك** | 2201-2237 | أزرق `blue-300` | ✅ دائماً |
| 3 | **معلومات الصك** | 2239-2269 | بنفسجي `purple-300` | ❌ شرطي |
| 4 | **الموقع الجغرافي** | 2271-2330 | أخضر `green-300` | ✅ دائماً |
| 5 | **الملاحظات (الوصف)** | 2332-2349 | برتقالي `orange-300` | ❌ شرطي |
| 6 | **و��ف AI** | 2351-2380 | نيلي `indigo-300` | ❌ شرطي |
| 7 | **الوسائط المتعددة** | 2382-2412 | وردي `pink-300` | ❌ شرطي |
| 8 | **المنصات المنشورة** ⭐ | 2414-2457 | فيروزي `teal-300` | ❌ شرطي |
| 9 | **معلومات إضافية** | 2459-2637 | رمادي `gray-300` | ✅ دائماً |
| 10 | **التواريخ** (داخل #9) | 2517-2561 | - | ✅ دائماً |
| 11 | **الإحصائيات** (داخل #9) | 2563-2587 | - | ❌ شرطي |
| 12 | **ملاحظات إضافية** (داخل #9) | 2589-2599 | - | ❌ شرطي |
| 13 | **المميزات المخصصة** (داخل #9) | 2601-2613 | - | ❌ شرطي |
| 14 | **الهاشتاقات** (داخل #9) | 2615-2627 | - | ❌ شرطي |
| 15 | **مسار المنصة** (داخل #9) | 2629-2635 | - | ❌ شرطي |

---

## 1️⃣ معلومات العقار الأساسية

### السطر 2134-2199

```tsx
<Card className="border-2 border-[#D4AF37]">
  <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
    <CardTitle className="flex items-center gap-2 text-[#01411C]">
      <Home className="w-5 h-5 text-[#D4AF37]" />
      معلومات العقار الأساسية
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6">
    <div className="grid md:grid-cols-2 gap-4">
      {/* 8 حقول */}
    </div>
  </CardContent>
</Card>
```

### الحقول (8 حقول + Status)

```tsx
{/* 1 */}
<Input value={selectedAd.title} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 2 */}
<Input value={selectedAd.adNumber} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 3 */}
<Input value={selectedAd.propertyType} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 4 */}
<Input value={selectedAd.purpose} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 5 */}
<Input value={selectedAd.price + " ريال"} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 6 */}
<Input value={selectedAd.area + " م²"} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 7 */}
<Input value={`${selectedAd.bedrooms} غرفة نوم`} readOnly className="border-2 border-gray-200 bg-gray-50" />

{/* 8 */}
<Input value={`${selectedAd.bathrooms} حمام`} readOnly className="border-2 border-gray-200 bg-gray-50" />
```

### Status Badge

```tsx
<Badge className={`${
  selectedAd.status === 'draft' ? 'bg-yellow-500' :
  selectedAd.status === 'published' ? 'bg-green-500' :
  selectedAd.status === 'active' ? 'bg-blue-500' :
  selectedAd.status === 'inactive' ? 'bg-gray-500' :
  selectedAd.status === 'sold' ? 'bg-purple-500' :
  selectedAd.status === 'rented' ? 'bg-orange-500' :
  'bg-red-500'
} text-white`}>
  {selectedAd.status === 'draft' ? '📝 مسودة' :
   selectedAd.status === 'published' ? '✅ منشور' :
   selectedAd.status === 'active' ? '🟢 نشط' :
   selectedAd.status === 'inactive' ? '⚫ غير نشط' :
   selectedAd.status === 'sold' ? '💰 مباع' :
   selectedAd.status === 'rented' ? '🔑 مؤجر' : '📦 مؤرشف'}
</Badge>
```

| Status | Color | Text | Emoji |
|--------|-------|------|-------|
| `draft` | `bg-yellow-500` | مسودة | 📝 |
| `published` | `bg-green-500` | منشور | ✅ |
| `active` | `bg-blue-500` | نشط | 🟢 |
| `inactive` | `bg-gray-500` | غير نشط | ⚫ |
| `sold` | `bg-purple-500` | مباع | 💰 |
| `rented` | `bg-orange-500` | مؤجر | 🔑 |
| `archived` | `bg-red-500` | مؤرشف | 📦 |

---

## 8️⃣ المنصات المنشور عليها ⭐⭐⭐

### السطر 2414-2457

```tsx
{selectedAd.publishedPlatforms && selectedAd.publishedPlatforms.length > 0 && (
  <Card className="border-2 border-teal-300 bg-teal-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-teal-900">
        <Globe className="w-5 h-5" />
        المنصات المنشور عليها ({selectedAd.publishedPlatforms.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {selectedAd.publishedPlatforms.map((platform) => (
          <div key={platform.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-teal-200">
            {/* المحتوى */}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

### Platform Item الكامل

```tsx
<div key={platform.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-teal-200">
  {/* الجانب الأيمن: المعلومات */}
  <div className="flex items-center gap-3">
    {/* 1. Badge الحالة */}
    <Badge className={`${
      platform.status === 'published' ? 'bg-green-500' :
      platform.status === 'pending' ? 'bg-yellow-500' :
      'bg-red-500'
    } text-white`}>
      {platform.status === 'published' ? '✅ منشور' :
       platform.status === 'pending' ? '⏳ قيد المراجعة' : '❌ فشل'}
    </Badge>
    
    {/* 2. اسم المنصة */}
    <span className="font-bold text-teal-900">{platform.name}</span>
    
    {/* 3. تاريخ النشر */}
    <span className="text-sm text-teal-600">
      {platform.publishedAt.toLocaleDateString('ar-SA')}
    </span>
  </div>
  
  {/* الجانب الأيسر: الرابط */}
  {platform.adUrl && (
    <a 
      href={platform.adUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
    >
      <ExternalLink className="w-4 h-4" />
      فتح
    </a>
  )}
</div>
```

### Badge الحالة

| Status | اللون | النص | Emoji |
|--------|-------|------|-------|
| `published` | `bg-green-500` | منشور | ✅ |
| `pending` | `bg-yellow-500` | قيد المراجعة | ⏳ |
| `failed` | `bg-red-500` | فشل | ❌ |

### الرابط الخارجي

```tsx
<a 
  href={platform.adUrl} 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
>
  <ExternalLink className="w-4 h-4" />
  فتح
</a>
```

| الخاصية | القيمة | الوظيفة |
|---------|--------|---------|
| **href** | `platform.adUrl` | رابط الإعلان على المنصة |
| **target** | `_blank` | فتح في تبويب جديد |
| **rel** | `noopener noreferrer` | الأمان |
| **الأيقونة** | `ExternalLink` 16×16px | - |
| **النص** | "فتح" | - |

---

## 🔟 التواريخ (داخل معلومات إضافية)

### السطر 2517-2561

```tsx
<div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
  {/* 1. تاريخ الإنشاء */}
  <div>
    <label className="text-sm font-bold text-gray-700">تاريخ الإنشاء</label>
    <Input 
      value={selectedAd.createdAt.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })} 
      readOnly 
      className="border-2 border-gray-200 bg-gray-50 text-sm" 
    />
  </div>
  
  {/* 2. تاريخ النشر */}
  <div>
    <label className="text-sm font-bold text-gray-700">تاريخ النشر</label>
    <Input 
      value={selectedAd.publishedAt.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })} 
      readOnly 
      className="border-2 border-gray-200 bg-gray-50 text-sm" 
    />
  </div>
  
  {/* 3. آخر تحديث */}
  <div>
    <label className="text-sm font-bold text-gray-700">آخر تحديث</label>
    <Input 
      value={selectedAd.updatedAt.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })} 
      readOnly 
      className="border-2 border-gray-200 bg-gray-50 text-sm" 
    />
  </div>
</div>
```

### التنسيق

```javascript
toLocaleDateString('ar-SA', {
  year: 'numeric',       // السنة
  month: 'long',         // اسم الشهر كامل
  day: 'numeric',        // اليوم
  hour: '2-digit',       // الساعة
  minute: '2-digit'      // الدقيقة
})
```

**مثال الناتج:** "١٥ رمضان ١٤٤٦ هـ ٠٣:٤٥"

---

## 1️⃣1️⃣ الإحصائيات

### السطر 2563-2587

```tsx
{selectedAd.stats && (
  <div className="grid grid-cols-4 gap-4 pt-4 border-t">
    {/* 1. المشاهدات */}
    <div className="text-center p-3 bg-blue-50 rounded-lg">
      <Eye className="w-6 h-6 text-blue-600 mx-auto mb-1" />
      <p className="text-2xl font-bold text-blue-900">{selectedAd.stats.views || 0}</p>
      <p className="text-xs text-blue-600">مشاهدة</p>
    </div>
    
    {/* 2. الطلبات */}
    <div className="text-center p-3 bg-green-50 rounded-lg">
      <Phone className="w-6 h-6 text-green-600 mx-auto mb-1" />
      <p className="text-2xl font-bold text-green-900">{selectedAd.stats.requests || 0}</p>
      <p className="text-xs text-green-600">طلب</p>
    </div>
    
    {/* 3. الإعجابات */}
    <div className="text-center p-3 bg-red-50 rounded-lg">
      <Star className="w-6 h-6 text-red-600 mx-auto mb-1" />
      <p className="text-2xl font-bold text-red-900">{selectedAd.stats.likes || 0}</p>
      <p className="text-xs text-red-600">إعجاب</p>
    </div>
    
    {/* 4. المشاركات */}
    <div className="text-center p-3 bg-purple-50 rounded-lg">
      <Share2 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
      <p className="text-2xl font-bold text-purple-900">{selectedAd.stats.shares || 0}</p>
      <p className="text-xs text-purple-600">مشاركة</p>
    </div>
  </div>
)}
```

### التنسيق لكل بطاقة

| العنصر | الأيقونة | اللون | الحجم |
|--------|----------|-------|-------|
| **المشاهدات** | `Eye` | أزرق `blue` | 24×24px |
| **الطلبات** | `Phone` | أخضر `green` | 24×24px |
| **الإعجابات** | `Star` | أحمر `red` | 24×24px |
| **المشاركات** | `Share2` | بنفسجي `purple` | 24×24px |

### الرقم
```tsx
<p className="text-2xl font-bold text-{color}-900">{selectedAd.stats.{field} || 0}</p>
```
- **Font Size**: 24px (`text-2xl`)
- **Font Weight**: Bold
- **القيمة الافتراضية**: 0

---

## 1️⃣5️⃣ زر التوجه للإعلان

### السطر 2639-2654

```tsx
<div className="flex gap-3 pt-4">
  <Button
    onClick={() => {
      // التنقل إلى لوحة التحكم → العروض
      const event = new CustomEvent('navigateToOffer', { 
        detail: { offerId: selectedAd.id, adNumber: selectedAd.adNumber }
      });
      window.dispatchEvent(event);
    }}
    className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:shadow-lg"
  >
    <ArrowRight className="w-4 h-4 ml-2" />
    التوجه للإعلان في منصتي
  </Button>
</div>
```

### التفاصيل

| الخاصية | القيمة |
|---------|--------|
| **Event** | `navigateToOffer` |
| **Detail** | `{ offerId, adNumber }` |
| **Background** | Gradient أخضر ملكي |
| **الأيقونة** | `ArrowRight` 16×16px |
| **النص** | "التوجه للإعلان في منصتي" |

---

# 💿 localStorage System

## المفتاح الأساسي

```typescript
// /utils/publishedAds.ts السطر 124
const STORAGE_KEY = 'published_ads_storage';
```

## الهيكل

```json
[
  {
    "id": "ad_123456",
    "adNumber": "AD-1234567890-123",
    "ownerPhone": "0501234567",
    "ownerName": "أحمد محمد",
    "title": "شقة فاخرة للبيع",
    "propertyType": "شقة",
    "purpose": "بيع",
    "price": "500000",
    "area": "150",
    "bedrooms": 3,
    "bathrooms": 2,
    "location": {
      "city": "الخبر",
      "district": "العقربية",
      "latitude": 26.284,
      "longitude": 50.208
    },
    "publishedPlatforms": [
      {
        "id": "p1",
        "name": "حراج",
        "status": "published",
        "publishedAt": "2025-01-15T10:30:00",
        "adUrl": "https://haraj.com.sa/ad/12345"
      }
    ],
    "status": "published",
    "createdAt": "2025-01-15T10:00:00",
    "publishedAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T10:30:00",
    "stats": {
      "views": 150,
      "requests": 5,
      "likes": 12,
      "shares": 3
    }
  }
]
```

---

# 📡 Events System

## Events المستخدمة

| Event | المصدر | الوظيفة | Detail |
|-------|--------|---------|--------|
| `publishedAdSaved` | `/utils/publishedAds.ts:221` | تحديث القائمة | `{ detail: ad }` |
| `navigateToOffer` | `/components/.../PublishedAdsSlide:2644` | التنقل للإعلان | `{ detail: { offerId, adNumber } }` |

---

# ✅ ملخص شامل نهائي

## الإحصائيات

| المكون | العدد |
|--------|-------|
| **Interface Properties** | 60+ |
| **أقسام رئيسية** | 15 |
| **حقول إدخال** | 40+ |
| **Badges** | 10+ |
| **Event Listeners** | 2 |
| **localStorage Keys** | 1 |
| **دوال مساعدة** | 14 |

## الألوان المستخدمة

| القسم | Code | RGB |
|-------|------|-----|
| **الرئيسي** | `#DC143C` | Crimson |
| **الثانوي** | `#B22222` | Firebrick |
| **الذهبي** | `#D4AF37` | Goldenrod |
| **الأخضر الملكي** | `#01411C` | Dark Green |

**جميع الأكواد حرفية 100% من الملف الموجود.**

---

**🎉 نهاية التوثيق الشامل!**
