# 💳 بطاقة الأعمال الرقمية - التوثيق الحرفي الكامل

## ⚠️ كل حرف وزر وحقل ووظيفة - بدون أي إضافة

---

# 📄 الملف: `/components/business-card-profile.tsx`

## معلومات أساسية:
- **السطور:** ~1700 سطر
- **المكون:** `BusinessCardProfile`
- **النوع:** Named Export
- **التعليق:** "Business Card Profile Component - Digital Business Card Display & Management"

---

# 🎯 Props

```typescript
interface BusinessCardProfileProps {
  user: User | null;
  onBack: () => void;
  onEditClick?: () => void;
}
```

**User Interface:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  type: string;
  plan?: string;
  companyName?: string;
  licenseNumber?: string;
  city?: string;
  district?: string;
}
```

---

# 📊 FormData Structure (23 حقل):

```typescript
{
  userName: string;
  companyName: string;
  falLicense: string;
  falExpiry: string;
  commercialRegistration: string;
  commercialExpiryDate: string;
  primaryPhone: string;
  email: string;
  domain: string;
  googleMapsLocation: string;
  location: string;
  coverImage: string;
  logoImage: string;
  profileImage: string;
  officialPlatform: string;
  bio: string;
  socialMedia: {
    tiktok: string;
    twitter: string;
    instagram: string;
    snapchat: string;
    youtube: string;
    facebook: string;
  };
  workingHours: {
    sunday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
    monday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
    tuesday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
    wednesday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
    thursday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
    friday: { open: '', close: '', isOpen: false },
    saturday: { open: '8:00 ص', close: '2:00 م', isOpen: true }
  };
  achievements: {
    totalDeals: 8,
    totalProperties: 12,
    totalClients: 45,
    yearsOfExperience: 5,
    awards: ['أفضل وسيط 2024'],
    certifications: ['رخصة فال'],
    topPerformer: true,
    verified: true
  };
}
```

---

# 📱 States (9 states):

```typescript
const [formData, setFormData] = useState(savedData || {...});
const [isEditingBio, setIsEditingBio] = useState(false);
const [showSaveSuccess, setShowSaveSuccess] = useState(false);
const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
const [showError, setShowError] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [isLoadingImages, setIsLoadingImages] = useState(true);
const [isSwapped, setIsSwapped] = useState(false);
```

---

# 🎨 الهيكل العام (بالترتيب)

```
BusinessCardProfile
├── 1. الإشعارات العائمة (3 إشعارات)
│   ├── رسالة ترحيب (أزرق)
│   ├── إشعار النجاح (أخضر)
│   └── إشعار الخطأ (أحمر)
│
├── 2. زر الحفظ العائم (أسفل يسار)
│
├── 3. الهيدر الملون
│   ├── أ. أزرار التحكم (عودة + تحرير)
│   ├── ب. الصور (قابلة للتبديل)
│   │   ├── الصورة الرئيسية (192x192px)
│   │   └── الشعار الصغير (64x64px)
│   ├── ج. الاسم والمعلومات
│   ├── د. شارة الوسيط (6 أنواع)
│   └── هـ. رخصة فال + السجل التجاري
│
├── 4. أزرار الإجراءات (4 أزرار رئيسية)
│   ├── تحميل vCard
│   ├── إرسال عرض
│   ├── إرسال طلب
│   └── حاسبة التمويل
│
├── 5. التبويبات (4 tabs)
│   ├── التبويب 1: البطاقة الرقمية (7 أقسام)
│   │   ├── 1. معلومات الاتصال
│   │   ├── 2. الموقع
│   │   ├── 3. نبذة عني
│   │   ├── 4. أيام وساعات العمل
│   │   ├── 5. الإنجازات
│   │   ├── 6. روابط التواصل الاجتماعي
│   │   └── 7. منصتي الإلكترونية
│   ├── التبويب 2: الإحصائيات
│   ├── التبويب 3: الأنشطة
│   └── التبويب 4: الإعدادات
│
└── 6. الفوتر
    └── شعار عقاري AI Aqari
```

---

# 1️⃣ الإشعارات العائمة (3 إشعارات)

## أ. رسالة الترحيب (أزرق):

```typescript
{showWelcomeMessage && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
    <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle className="w-5 h-5" />
        <span className="font-bold">مرحباً بعودتك! 🎉</span>
      </div>
      <p className="text-sm">تم استعادة بياناتك المحفوظة بنجاح</p>
    </div>
  </div>
)}
```

**الشرط:** `showWelcomeMessage` (يظهر لمدة 5 ثواني فقط)  
**اللون:** `bg-blue-500`  
**النص:**
- العنوان: "مرحباً بعودتك! 🎉"
- الوصف: "تم استعادة بياناتك المحفوظة بنجاح"

---

## ب. إشعار النجاح (أخضر):

```typescript
{showSaveSuccess && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      <span className="font-bold">تم الحفظ بنجاح! ✅</span>
    </div>
  </div>
)}
```

**الشرط:** `showSaveSuccess` (يظهر لمدة 3 ثواني)  
**اللون:** `bg-green-500`  
**النص:** "تم الحفظ بنجاح! ✅"

---

## ج. إشعار الخطأ (أحمر):

```typescript
{showError && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
    <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
      <AlertCircle className="w-5 h-5" />
      <span className="font-bold">{errorMessage}</span>
    </div>
  </div>
)}
```

**الشرط:** `showError` (يظهر لمدة 3 ثواني)  
**اللون:** `bg-red-500`  
**النص:** متغير حسب `errorMessage`

---

# 2️⃣ زر الحفظ العائم

```typescript
<button
  onClick={handleManualSave}
  className="fixed bottom-24 left-4 z-40 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-[#D4AF37]"
  title="حفظ التغييرات"
>
  <Save className="w-6 h-6" />
</button>
```

**الموقع:** `fixed bottom-24 left-4`  
**الألوان:**
- Background: Gradient من `#01411C` إلى `#065f41`
- Border: `border-[#D4AF37]`
**الأيقونة:** `<Save className="w-6 h-6" />`  
**Hover:** `hover:scale-110` (تكبير 110%)

---

# 3️⃣ الهيدر الملون

**الحاوية:**
```css
bg-gradient-to-r from-[#01411C] to-[#065f41]
text-white
p-6
relative
bg-cover bg-center
```

**خلفية ديناميكية:** إذا `coverImage` موجودة:
```javascript
backgroundImage: `url(${formData.coverImage})`
backgroundBlendMode: 'overlay'
backgroundColor: 'rgba(1, 65, 28, 0.85)'
```

---

## أ. أزرار التحكم

```typescript
<div className="flex items-center justify-between mb-4">
  {/* زر العودة */}
  <Button
    onClick={onBack}
    variant="ghost"
    className="text-white hover:bg-white/20"
  >
    <ArrowRight className="w-4 h-4 ml-2" />
    عودة
  </Button>

  {/* زر التحرير */}
  {onEditClick && (
    <Button
      onClick={onEditClick}
      variant="ghost"
      className="text-white hover:bg-white/20 border border-white/30"
    >
      <Edit className="w-4 h-4 ml-2" />
      تحرير
    </Button>
  )}
</div>
```

**زر العودة:**
- الأيقونة: `<ArrowRight />`
- النص: "عودة"
- Hover: `hover:bg-white/20`

**زر التحرير:**
- الشرط: `onEditClick` موجود
- الأيقونة: `<Edit />`
- النص: "تحرير"
- Border: `border-white/30`

---

## ب. الصور (قابلة للتبديل بالنقر)

```typescript
{/* الصورة الرئيسية */}
<img 
  src={!isSwapped 
    ? (formData.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=01411C&color=D4AF37&size=192')
    : (formData.logoImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.companyName || 'Company') + '&background=D4AF37&color=01411C&size=192')
  } 
  alt={!isSwapped ? "Profile" : "Company Logo"} 
  className="w-48 h-48 rounded-full border-4 border-[#D4AF37] shadow-lg object-cover cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
  onClick={handleSwapImages}
/>

{/* الشعار الصغير */}
{(formData.logoImage || formData.profileImage) && (
  <div 
    className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
    onClick={handleSwapImages}
  >
    <img 
      src={isSwapped 
        ? (formData.profileImage || '...')
        : (formData.logoImage || '...')
      } 
      alt={isSwapped ? "Profile" : "Logo"} 
      className="w-full h-full object-cover rounded-full"
    />
  </div>
)}
```

**التفاصيل:**
- **الصورة الرئيسية:**
  - الحجم: `w-48 h-48` (192x192px) - **مكبرة 40%**
  - Border: `border-4 border-[#D4AF37]`
  - Hover: `hover:scale-105` (تكبير 105%)
  - Active: `active:scale-95` (تصغير عند الضغط)
  - Fallback: `ui-avatars.com` مع ألوان النظام
- **الشعار الصغير:**
  - الحجم: `w-16 h-16` (64x64px)
  - الموقع: `-bottom-2 -right-2` (أسفل يمين)
  - Border: `border-4 border-white`
  - Hover: `hover:scale-110`

**آلية التبديل:**
- النقر على أي صورة → تبديل `isSwapped`
- `!isSwapped`: Profile كبير + Logo صغير
- `isSwapped`: Logo كبير + Profile صغير

---

## ج. الاسم والمعلومات

```typescript
<h1 className="text-3xl font-bold mb-2">{formData.userName || user?.name || 'اسم الوسيط'}</h1>
<p className="text-white/90 mb-1">{formData.companyName || user?.companyName || 'اسم الشركة'}</p>
<p className="text-white/80 text-sm">رخصة فال: {formData.falLicense || user?.licenseNumber || 'غير محدد'}</p>
```

**الترتيب:**
1. **الاسم:** `text-3xl font-bold` (24px)
2. **اسم الشركة:** `text-white/90` (90% opacity)
3. **رخصة فال:** `text-white/80 text-sm` (80% opacity)

---

## د. شارة الوسيط (6 أنواع)

```typescript
const getBadgeType = () => {
  const { totalDeals, yearsOfExperience } = formData.achievements;
  
  if (totalDeals >= 100 && yearsOfExperience >= 10) return 'diamond';
  if (totalDeals >= 50 && yearsOfExperience >= 5) return 'platinum';
  if (totalDeals >= 30 && yearsOfExperience >= 3) return 'gold';
  if (totalDeals >= 15 && yearsOfExperience >= 2) return 'silver';
  if (totalDeals >= 5 && yearsOfExperience >= 1) return 'bronze';
  
  return 'starter';
};
```

**أنواع الشارات (6):**

### 1. وسيط ماسي (Diamond):
- **الشرط:** 100+ صفقة + 10+ سنوات
- **الأيقونة:** `<Crown />`
- **اللون:** `text-cyan-400`
- **BG:** `bg-cyan-50`
- **Gradient:** `from-cyan-400 to-blue-600`

### 2. وسيط بلاتيني (Platinum):
- **الشرط:** 50+ صفقة + 5+ سنوات
- **الأيقونة:** `<Trophy />`
- **اللون:** `text-purple-600`
- **BG:** `bg-purple-100`
- **Gradient:** `from-purple-400 to-pink-400`

### 3. وسيط ذهبي (Gold):
- **الشرط:** 30+ صفقة + 3+ سنوات
- **الأيقونة:** `<Trophy />`
- **اللون:** `text-[#D4AF37]`
- **BG:** `bg-yellow-50`
- **Gradient:** `from-yellow-400 to-yellow-600`

### 4. وسيط فضي (Silver):
- **الشرط:** 15+ صفقة + 2+ سنوات
- **الأيقونة:** `<Medal />`
- **اللون:** `text-gray-500`
- **BG:** `bg-gray-100`
- **Gradient:** `from-gray-300 to-gray-500`

### 5. وسيط برونزي (Bronze):
- **الشرط:** 5+ صفقة + 1+ سنة
- **الأيقونة:** `<Award />`
- **اللون:** `text-orange-600`
- **BG:** `bg-orange-50`
- **Gradient:** `from-orange-400 to-orange-600`

### 6. وسيط نشط (Starter):
- **الشرط:** افتراضي (للجميع)
- **الأيقونة:** `<Zap />`
- **اللون:** `text-blue-600`
- **BG:** `bg-blue-50`
- **Gradient:** `from-blue-400 to-blue-600`

---

## هـ. رخصة فال + السجل التجاري

```typescript
{/* رخصة فال */}
<div className={`inline-block px-3 py-1 rounded-full ${
  licenseColor === 'green' ? 'bg-green-100 text-green-700' :
  licenseColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
  licenseColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
}`}>
  {daysLeft !== null ? `رخصة فال: ${daysLeft} يوم متبقي` : 'رخصة فال: غير محدد'}
</div>

{/* السجل التجاري */}
{formData.commercialRegistration && (
  <div className={`inline-block px-3 py-1 rounded-full ${
    commercialColor === 'green' ? 'bg-green-100 text-green-700' :
    commercialColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
    commercialColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
  }`}>
    {commercialDaysLeft !== null ? `السجل التجاري: ${commercialDaysLeft} يوم متبقي` : 'السجل التجاري: غير محدد'}
  </div>
)}
```

**الألوان حسب الأيام المتبقية:**
- **أخضر:** أكثر من 90 يوم (`bg-green-100 text-green-700`)
- **أصفر:** 31-90 يوم (`bg-yellow-100 text-yellow-700`)
- **أحمر:** 30 يوم أو أقل (`bg-red-100 text-red-700`)
- **رمادي:** غير محدد (`bg-gray-100 text-gray-700`)

---

# 4️⃣ أزرار الإجراءات (4 أزرار رئيسية)

**Grid:** `grid-cols-2 md:grid-cols-4 gap-4 mb-6`

---

## 1. زر تحميل vCard

```typescript
<button
  onClick={handleDownloadVCard}
  className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-[#D4AF37] hover:scale-105"
>
  <Download className="w-6 h-6 text-[#01411C]" />
  <span className="text-sm font-medium text-[#01411C]">تحميل vCard</span>
</button>
```

**التفاصيل:**
- **الأيقونة:** `<Download className="w-6 h-6 text-[#01411C]" />`
- **النص:** "تحميل vCard"
- **Border:** `border-[#D4AF37]`
- **Hover:** `hover:scale-105` (تكبير 105%)

**الوظيفة:** `handleDownloadVCard()`
- يستدعي `downloadVCard()` من `/utils/vcardGenerator.ts`
- يحمّل ملف `.vcf` للاتصال
- Toast: "✅ تم تحميل بطاقة الاتصال بنجاح!"

**البيانات المرسلة:**
```javascript
{
  name: formData.userName || user?.name || '',
  jobTitle: 'وسيط عقاري',
  company: formData.companyName || user?.companyName || '',
  phone: formData.primaryPhone || user?.phone || '',
  whatsapp: user?.whatsapp || formData.primaryPhone || '',
  email: formData.email || user?.email || '',
  website1: formData.domain ? `https://${formData.domain}.aqariai.com` : '',
  website2: formData.officialPlatform || '',
  googleMapsLocation: formData.googleMapsLocation || ''
}
```

---

## 2. زر إرسال عرض

```typescript
<button
  onClick={handleSendOffer}
  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#01411C] to-[#065f41] text-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105"
>
  <Home className="w-6 h-6" />
  <span className="text-sm font-medium">إرسال عرض</span>
</button>
```

**التفاصيل:**
- **الأيقونة:** `<Home className="w-6 h-6" />`
- **النص:** "إرسال عرض"
- **BG:** Gradient من `#01411C` إلى `#065f41`

**الوظيفة:** `handleSendOffer()`
1. ينشئ رابط: `#/send-offer/${brokerPhone}/${brokerName}`
2. ينسخ الرابط
3. Toast: "✅ تم نسخ رابط إرسال العرض!"
4. يفتح WhatsApp مع الرسالة:
```
السلام عليكم

يمكنك إرسال عرضك العقاري عبر هذا الرابط:
[الرابط]
```

---

## 3. زر إرسال طلب

```typescript
<button
  onClick={handleSendRequest}
  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105"
>
  <Search className="w-6 h-6" />
  <span className="text-sm font-medium">إرسال طلب</span>
</button>
```

**التفاصيل:**
- **الأيقونة:** `<Search className="w-6 h-6" />`
- **النص:** "إرسال طلب"
- **BG:** Gradient من `blue-500` إلى `blue-600`

**الوظيفة:** `handleSendRequest()`
1. ينشئ رابط: `#/send-request/${brokerPhone}/${brokerName}`
2. ينسخ الرابط
3. Toast: "✅ تم نسخ رابط إرسال الطلب!"
4. يفتح WhatsApp مع الرسالة:
```
السلام عليكم

يمكنك إرسال طلبك العقاري عبر هذا الرابط:
[الرابط]
```

---

## 4. زر حاسبة التمويل

```typescript
<button
  onClick={handleFinanceCalculator}
  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105"
>
  <Calculator className="w-6 h-6" />
  <span className="text-sm font-medium">حاسبة التمويل</span>
</button>
```

**التفاصيل:**
- **الأيقونة:** `<Calculator className="w-6 h-6" />`
- **النص:** "حاسبة التمويل"
- **BG:** Gradient من `#D4AF37` إلى `yellow-600`

**الوظيفة:** `handleFinanceCalculator()`
1. ينشئ linkId فريد: `finance-${Date.now()}-${random}`
2. يحفظ في localStorage: `finance_link_broker_${linkId}`
3. ينشئ رابط: `/finance-link/${linkId}`
4. Toast: "✅ تم نسخ رابط حاسبة التمويل!"
5. يفتح WhatsApp مع الرسالة:
```
السلام عليكم

تفضل رابط حاسبة التمويل العقاري:
[الرابط]

يرجى تعبئة البيانات وسنتواصل معك قريباً
```

---

# 5️⃣ التبويبات (4 tabs)

**Component:** `<Tabs defaultValue="card">`

```typescript
<TabsList className="grid w-full grid-cols-4 mb-6">
  <TabsTrigger value="card">البطاقة الرقمية</TabsTrigger>
  <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
  <TabsTrigger value="activities">الأنشطة</TabsTrigger>
  <TabsTrigger value="settings">الإعدادات</TabsTrigger>
</TabsList>
```

**Grid:** `grid-cols-4` (4 تبويبات متساوية)

---

# 🎉 انتهى الجزء الأول!

## ✅ ما تم توثيقه حتى الآن:

1. ✅ Props + FormData (23 حقل)
2. ✅ States (9 states)
3. ✅ الهيكل العام
4. ✅ الإشعارات (3 أنواع)
5. ✅ زر الحفظ العائم
6. ✅ الهيدر الملون (5 أجزاء)
7. ✅ الصور (قابلة للتبديل)
8. ✅ شارة الوسيط (6 أنواع)
9. ✅ رخصة فال + السجل التجاري
10. ✅ أزرار الإجراءات (4 أزرار)

**التالي:** التبويبات الأربعة بالتفصيل...

سأكمل في الملف التالي!
