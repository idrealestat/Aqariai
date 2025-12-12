# 💼 بطاقة الأعمال الرقمية - التوثيق الحرفي الكامل

## ⚠️ كل حرف وزر وحقل ووظيفة - بدون أي إضافة

---

# 📄 الملفات (2):

## 1. `/components/business-card-profile.tsx` - عرض البطاقة
## 2. `/components/business-card-edit.tsx` - تحرير البطاقة

---

# 🎯 Props (متطابقة تقريباً)

## BusinessCardProfile:
```typescript
interface BusinessCardProfileProps {
  user: User | null;
  onBack: () => void;
  onEditClick?: () => void; // ← فقط في Profile
}
```

## BusinessCardEdit:
```typescript
interface BusinessCardEditProps {
  user: User | null;
  onBack: () => void;
}
```

---

# 📊 FormData (البيانات المشتركة):

```typescript
{
  userName: string;
  companyName: string;
  falLicense: string;
  falExpiry: string;
  commercialRegistration: string;
  commercialExpiryDate?: string;
  primaryPhone: string;
  email: string;
  domain: string;
  googleMapsLocation: string;
  location: string; // المدينة
  coverImage: string;
  logoImage: string;
  profileImage: string;
  officialPlatform: string;
  bio: string; // نبذة (300 حرف كحد أقصى)
  
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
    friday: { open: '', close: '', isOpen: false }, // مغلق
    saturday: { open: '8:00 ص', close: '2:00 م', isOpen: true }
  };
  
  achievements: {
    totalDeals: number; // 8 افتراضياً
    totalProperties: number; // 12 افتراضياً
    totalClients: number; // 45 افتراضياً
    yearsOfExperience: number; // 5 افتراضياً
    awards: string[]; // ['أفضل وسيط 2024']
    certifications: string[]; // ['رخصة فال']
    topPerformer: boolean; // true
    verified: boolean; // true
  };
}
```

---

# 🗂️ التخزين:

**المفتاح:** `business_card_${user?.id || user?.phone || 'default'}`

**التخزين:**
- **البيانات النصية:** `localStorage` (بدون صور)
- **الصور (3):** `IndexedDB` عبر `/utils/imageStorage`
  - `coverImage` - صورة الغلاف
  - `logoImage` - شعار الشركة  
  - `profileImage` - الصورة الشخصية

**الربط:**
- يرسل Event `'businessCardUpdated'` عند كل تغيير
- تستقبله `/components/MyPlatform.tsx`

---

# 🎨 الأقسام الرئيسية (Profile & Edit)

## أولاً: business-card-profile.tsx (العرض)

### 🏗️ الهيكل الكامل:

```
BusinessCardProfile
├── 1. الإشعارات (3)
│   ├── رسالة ترحيب (عند استعادة البيانات)
│   ├── إشعار الحفظ الناجح
│   └── إشعار الخطأ
│
├── 2. زر الحفظ العائم (أسفل يسار)
│
├── 3. الهيدر الملون
│   ├── أ. أزرار التحكم (أعلى)
│   │   ├── زر "عودة" (يسار)
│   │   └── زر "تحرير" (يمين)
│   ├── ب. الصورة الرئيسية (مركز - قابلة للتبديل)
│   │   └── الشعار الصغير (أسفل يمين - قابل للتبديل)
│   ├── ج. الاسم + الشركة
│   ├── د. شارة المستوى (6 مستويات)
│   └── هـ. رخصة فال + السجل التجاري (مع عداد الأيام)
│
├── 4. الأزرار الرئيسية (4 أزرار)
│   ├── تحميل vCard
│   ├── إرسال عرض
│   ├── إرسال طلب
│   └── حاسبة التمويل
│
├── 5. التبويبات (Tabs - 6 تبويبات)
│   ├── "نبذة عني" ← NبذةTab
│   ├── "معلومات الاتصال" ← ContactTab
│   ├── "أوقات العمل" ← WorkingHoursTab
│   ├── "إنجازاتي" ← AchievementsTab
│   ├── "آخر الأنشطة" ← ActivitiesTab
│   └── "إحصائياتي" ← StatisticsTab
│
└── 6. فوتر (حقوق + معلومات النظام)
```

---

### 🎯 التفاصيل الحرفية:

---

## 1️⃣ الإشعارات (3)

### أ. رسالة ترحيب:
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

**النص (حرفياً):**
- **العنوان:** "مرحباً بعودتك! 🎉"
- **الوصف:** "تم استعادة بياناتك المحفوظة بنجاح"

---

### ب. إشعار الحفظ:
```typescript
{showSaveSuccess && (
  <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
    <CheckCircle className="w-5 h-5" />
    <span className="font-bold">تم الحفظ بنجاح! ✅</span>
  </div>
)}
```

**النص:** "تم الحفظ بنجاح! ✅"

---

### ج. إشعار الخطأ:
```typescript
{showError && (
  <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
    <AlertCircle className="w-5 h-5" />
    <span className="font-bold">{errorMessage}</span>
  </div>
)}
```

---

## 2️⃣ زر الحفظ العائم

```typescript
<button
  onClick={handleManualSave}
  className="fixed bottom-24 left-4 z-40 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-[#D4AF37]"
  title="حفظ التغييرات"
>
  <Save className="w-6 h-6" />
</button>
```

**الموقع:** `bottom-24 left-4` (أسفل يسار)  
**الأيقونة:** `<Save />`  
**Title:** "حفظ التغييرات"

---

## 3️⃣ الهيدر الملون

**Background:**
```css
bg-gradient-to-r from-[#01411C] to-[#065f41]
```

**إذا توجد صورة غلاف:**
```css
backgroundImage: url(${formData.coverImage})
backgroundBlendMode: overlay
backgroundColor: rgba(1, 65, 28, 0.85)
```

---

### أ. أزرار التحكم

**1. زر "عودة":**
```typescript
<Button
  onClick={onBack}
  variant="ghost"
  className="text-white hover:bg-white/20"
>
  <ArrowRight className="w-4 h-4 ml-2" />
  عودة
</Button>
```

**2. زر "تحرير":**
```typescript
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
```

---

### ب. الصورة الرئيسية (قابلة للتبديل)

```typescript
{/* الصورة الرئيسية - مكبرة 40% (192px) */}
<img 
  src={!isSwapped 
    ? (formData.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name) + '&background=01411C&color=D4AF37&size=192')
    : (formData.logoImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.companyName) + '&background=D4AF37&color=01411C&size=192')
  } 
  alt={!isSwapped ? "Profile" : "Company Logo"} 
  className="w-48 h-48 rounded-full border-4 border-[#D4AF37] shadow-lg object-cover cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
  onClick={handleSwapImages}
/>

{/* الشعار الصغير - أسفل يمين */}
{(formData.logoImage || formData.profileImage) && (
  <div 
    className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
    onClick={handleSwapImages}
  >
    <img 
      src={isSwapped 
        ? (formData.profileImage || ...)
        : (formData.logoImage || ...)
      } 
      ...
    />
  </div>
)}
```

**التفاصيل:**
- **الصورة الكبيرة:** `w-48 h-48` (192px)
- **الصورة الصغيرة:** `w-16 h-16` (64px)
- **onClick:** `handleSwapImages` (تبديل بين الصورة والشعار)
- **عند عدم وجود صورة:** يستخدم `ui-avatars.com` API

---

### ج. الاسم + الشركة

```typescript
<h1 className="text-4xl font-bold text-white drop-shadow-lg">
  {formData.userName || user?.name || 'اسم الوسيط'}
</h1>
<p className="text-xl text-white/90">
  {formData.companyName || user?.companyName || 'اسم الشركة'}
</p>
```

**الأحجام:**
- **الاسم:** `text-4xl` (36px)
- **الشركة:** `text-xl` (20px)

---

### د. شارة المستوى (6 مستويات)

**الحساب:**
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

**الشارات (بالترتيب):**

| المستوى | الشروط | الأيقونة | اللون | الاسم |
|---------|--------|----------|-------|------|
| diamond | 100+ صفقة + 10+ سنة | Crown | `text-cyan-400` | وسيط ماسي |
| platinum | 50+ صفقة + 5+ سنة | Trophy | `text-purple-600` | وسيط بلاتيني |
| gold | 30+ صفقة + 3+ سنة | Trophy | `text-[#D4AF37]` | وسيط ذهبي |
| silver | 15+ صفقة + 2+ سنة | Medal | `text-gray-500` | وسيط فضي |
| bronze | 5+ صفقة + 1+ سنة | Award | `text-orange-600` | وسيط برونزي |
| starter | افتراضي | Zap | `text-blue-600` | وسيط نشط |

---

### هـ. رخصة فال + السجل التجاري

**رخصة فال:**
```typescript
<div className="flex items-center justify-between">
  <span className="text-sm">رخصة فال</span>
  <span className="text-sm font-bold">{formData.falLicense || 'غير محدد'}</span>
</div>
{formData.falExpiry && (
  <div className={`text-xs text-center mt-1 ${
    licenseColor === 'green' ? 'text-green-400' :
    licenseColor === 'yellow' ? 'text-yellow-400' :
    licenseColor === 'red' ? 'text-red-400' : 'text-gray-400'
  }`}>
    {daysLeft === null ? 'لم يحدد تاريخ الانتهاء' :
     daysLeft > 0 ? `باقي ${daysLeft} يوم` :
     daysLeft === 0 ? 'تنتهي اليوم!' : `منتهية منذ ${Math.abs(daysLeft)} يوم`}
  </div>
)}
```

**الألوان:**
- **أخضر:** أكثر من 90 يوم
- **أصفر:** 31-90 يوم
- **أحمر:** 30 يوم أو أقل

**السجل التجاري:** نفس المنطق والألوان

---

## 4️⃣ الأزرار الرئيسية (4 أزرار)

**Grid:** `grid-cols-2 md:grid-cols-4 gap-4`

---

### 1. زر "تحميل vCard"

```typescript
<button
  onClick={handleDownloadVCard}
  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#D4AF37]"
>
  <Download className="w-8 h-8 text-[#01411C]" />
  <span className="text-sm font-semibold text-[#01411C]">تحميل vCard</span>
</button>
```

**الوظيفة:** `downloadVCard()` - يحمل ملف `.vcf` بمعلومات الاتصال

**البيانات المُصدّرة:**
- name, jobTitle: 'وسيط عقاري', company, phone, whatsapp, email
- website1: `${formData.domain}.aqariai.com`
- website2: `formData.officialPlatform`
- googleMapsLocation

**الرسالة:** "✅ تم تحميل بطاقة الاتصال بنجاح!"

---

### 2. زر "إرسال عرض"

```typescript
<button
  onClick={handleSendOffer}
  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
>
  <Send className="w-8 h-8 text-white" />
  <span className="text-sm font-semibold text-white">إرسال عرض</span>
</button>
```

**الوظيفة:**
1. ينشئ رابط: `${window.location.origin}#/send-offer/${brokerPhone}/${brokerName}`
2. ينسخ الرابط للحافظة
3. يفتح واتساب بالرسالة (حرفياً):
```
السلام عليكم

يمكنك إرسال عرضك العقاري عبر هذا الرابط:
[الرابط]
```

**الرسالة:** "✅ تم نسخ رابط إرسال العرض!"

---

### 3. زر "إرسال طلب"

```typescript
<button
  onClick={handleSendRequest}
  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
>
  <Search className="w-8 h-8 text-white" />
  <span className="text-sm font-semibold text-white">إرسال طلب</span>
</button>
```

**الوظيفة:**
1. ينشئ رابط: `${window.location.origin}#/send-request/${brokerPhone}/${brokerName}`
2. ينسخ الرابط
3. يفتح واتساب بالرسالة (حرفياً):
```
السلام عليكم

يمكنك إرسال طلبك العقاري عبر هذا الرابط:
[الرابط]
```

**الرسالة:** "✅ تم نسخ رابط إرسال الطلب!"

---

### 4. زر "حاسبة التمويل"

```typescript
<button
  onClick={handleFinanceCalculator}
  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-[#01411C]"
>
  <Calculator className="w-8 h-8 text-[#01411C]" />
  <span className="text-sm font-semibold text-[#01411C]">حاسبة التمويل</span>
</button>
```

**الوظيفة:**
1. ينشئ linkId فريد: `finance-${Date.now()}-${Math.random()}`
2. يحفظ في localStorage: `finance_link_broker_${linkId}`
3. ينشئ رابط: `${window.location.origin}/finance-link/${linkId}`
4. يفتح واتساب بالرسالة (حرفياً):
```
السلام عليكم

تفضل رابط حاسبة التمويل العقاري:
[الرابط]

يرجى تعبئة البيانات وسنتواصل معك قريباً
```

**الرسالة:** "✅ تم نسخ رابط حاسبة التمويل!"

---

## 5️⃣ التبويبات (6 تبويبات)

**Component:** `<Tabs defaultValue="bio">`

**قائمة التبويبات:**
```typescript
<TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent">
```

---

### التبويب 1: "نبذة عني"

**Value:** `"bio"`

```typescript
<TabsTrigger 
  value="bio" 
  className="data-[state=active]:bg-[#01411C] data-[state=active]:text-white"
>
  <FileText className="w-4 h-4 ml-2" />
  نبذة عني
</TabsTrigger>
```

**المحتوى:**
```typescript
<TabsContent value="bio">
  {formData.bio ? (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#01411C]">
          <FileText className="w-5 h-5" />
          نبذة عني
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditingBio ? (
          <div className="space-y-3">
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="min-h-[150px] text-right"
              maxLength={300}
            />
            <div className="flex justify-between items-center">
              <Button onClick={() => {
                handleManualSave();
                setIsEditingBio(false);
              }}>
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
              <span className="text-sm text-gray-500">{formData.bio.length}/300 حرف</span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 leading-relaxed text-right mb-4">{formData.bio}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingBio(true)}
            >
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-4">لم تضف نبذة عنك بعد</p>
        <Button onClick={() => setIsEditingBio(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة نبذة
        </Button>
      </CardContent>
    </Card>
  )}
</TabsContent>
```

**الحد الأقصى:** 300 حرف  
**إذا فارغة:** "لم تضف نبذة عنك بعد" + زر "إضافة نبذة"

---

### التبويب 2: "معلومات الاتصال"

**Value:** `"contact"`

**المحتوى (6 حقول):**

1. **الهاتف:** `formData.primaryPhone || user?.phone`
2. **البريد الإلكتروني:** `formData.email || user?.email`
3. **الموقع:** `formData.location`
4. **المنصة الإلكترونية:** `formData.officialPlatform`
5. **النطاق:** `${formData.domain}.aqariai.com`
6. **الموقع على الخريطة:** `formData.googleMapsLocation`

**كل حقل:**
```typescript
<div className="flex items-start gap-3">
  <[Icon] className="w-5 h-5 text-[#D4AF37] mt-1" />
  <div className="flex-1">
    <p className="text-sm text-gray-500 mb-1">[Label]</p>
    <p className="font-medium text-gray-900">[Value] || '[Empty]'</p>
  </div>
</div>
```

---

### التبويب 3: "أوقات العمل"

**Value:** `"working-hours"`

**أيام العمل (7 أيام):**
- الأحد - السبت (حرفياً بالعربية)

**كل يوم:**
```typescript
<div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center">
      <Calendar className="w-6 h-6 text-[#01411C]" />
    </div>
    <div>
      <p className="font-semibold text-[#01411C]">{daysArabic[day]}</p>
      {hours.isOpen ? (
        <p className="text-sm text-gray-600">
          {hours.open} - {hours.close}
        </p>
      ) : (
        <p className="text-sm text-red-500">مغلق</p>
      )}
    </div>
  </div>
  {hours.isOpen && (
    <Badge className="bg-green-500 text-white">مفتوح</Badge>
  )}
</div>
```

**إذا مغلق:** Badge أحمر "مغلق"  
**إذا مفتوح:** Badge أخضر "مفتوح" + الساعات

---

### التبويب 4: "إنجازاتي"

**Value:** `"achievements"`

**المحتوى (4 بطاقات + 2 قوائم):**

**البطاقات (Grid 2×2):**

1. **صفقة مكتملة:**
```typescript
<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
  <CardContent className="p-6 text-center">
    <Home className="w-12 h-12 mx-auto mb-2" />
    <p className="text-3xl font-bold mb-1">{formData.achievements.totalDeals}</p>
    <p className="text-sm opacity-90">صفقة مكتملة</p>
  </CardContent>
</Card>
```

2. **عقار مدار:**
```typescript
<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
  ... {formData.achievements.totalProperties} ...
  <p className="text-sm opacity-90">عقار مدار</p>
</Card>
```

3. **عميل راضي:**
```typescript
<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
  ... {formData.achievements.totalClients} ...
  <p className="text-sm opacity-90">عميل راضي</p>
</Card>
```

4. **سنوات خبرة:**
```typescript
<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
  ... {formData.achievements.yearsOfExperience} ...
  <p className="text-sm opacity-90">سنوات خبرة</p>
</Card>
```

**الجوائز:**
```typescript
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-[#D4AF37]">
      <Trophy className="w-5 h-5" />
      الجوائز والأوسمة
    </CardTitle>
  </CardHeader>
  <CardContent>
    {formData.achievements.awards.map((award, idx) => (
      <div key={idx} className="flex items-center gap-3 mb-2">
        <Trophy className="w-5 h-5 text-[#D4AF37]" />
        <span className="text-gray-700">{award}</span>
      </div>
    ))}
  </CardContent>
</Card>
```

**الشهادات:**
```typescript
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-[#01411C]">
      <Award className="w-5 h-5" />
      الشهادات والتراخيص
    </CardTitle>
  </CardHeader>
  <CardContent>
    {formData.achievements.certifications.map((cert, idx) => (
      <Badge key={idx} className="bg-[#01411C] text-white mr-2 mb-2">
        {cert}
      </Badge>
    ))}
  </CardContent>
</Card>
```

---

### التبويب 5: "آخر الأنشطة"

**Value:** `"activities"`

**البيانات (5 أنشطة ثابتة):**
```typescript
const recentActivities = [
  { id: 1, title: 'عقد صفقة جديدة', time: 'منذ ساعتين', icon: Home, color: 'green' },
  { id: 2, title: 'اجتماع مع عميل', time: 'منذ 3 ساعات', icon: Users, color: 'blue' },
  { id: 3, title: 'معاينة عقار', time: 'منذ 5 ساعات', icon: MapPin, color: 'purple' },
  { id: 4, title: 'تحديث قائمة العقارات', time: 'أمس', icon: FileText, color: 'orange' },
  { id: 5, title: 'اتصال مع مالك عقار', time: 'أمس', icon: Phone, color: 'red' }
];
```

**كل نشاط:**
```typescript
<Card key={activity.id} className="mb-3 hover:shadow-md transition-shadow">
  <CardContent className="p-4">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
        <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.time}</p>
      </div>
      <Clock className="w-4 h-4 text-gray-400" />
    </div>
  </CardContent>
</Card>
```

---

### التبويب 6: "إحصائياتي"

**Value:** `"statistics"`

**البيانات (5 إحصائيات ثابتة):**
```typescript
const statistics = [
  { id: 1, label: 'العقارات المباعة', value: '24', icon: Home, color: 'blue' },
  { id: 2, label: 'العملاء النشطين', value: '45', icon: Users, color: 'green' },
  { id: 3, label: 'الصفقات الجارية', value: '12', icon: TrendingUp, color: 'purple' },
  { id: 4, label: 'المعاينات هذا الشهر', value: '18', icon: MapPin, color: 'orange' },
  { id: 5, label: 'متوسط التقييم', value: '4.8', icon: Star, color: 'yellow' }
];
```

**كل إحصائية:**
```typescript
<Card className="text-center hover:scale-105 transition-transform">
  <CardContent className="p-6">
    <activity.icon className={`w-12 h-12 mx-auto mb-3 text-${stat.color}-500`} />
    <p className="text-4xl font-bold text-[#01411C] mb-2">{stat.value}</p>
    <p className="text-sm text-gray-600">{stat.label}</p>
  </CardContent>
</Card>
```

---

## 6️⃣ روابط التواصل الاجتماعي (6 منصات)

**إذا توجد روابط:**
```typescript
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-[#01411C]">
      <Share2 className="w-5 h-5" />
      روابط التواصل الاجتماعي
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-3">
      {socialMediaPlatforms
        .filter(platform => formData.socialMedia[platform.key])
        .map(platform => (
          <a
            key={platform.key}
            href={formData.socialMedia[platform.key]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {platform.displayIcon}
            <span className="text-sm font-medium">{platform.name}</span>
          </a>
        ))
      }
    </div>
  </CardContent>
</Card>
```

**المنصات (بالترتيب):**
1. **تيكتوك:** حرف T أسود
2. **اكس (Twitter):** أيقونة Twitter سوداء
3. **انستقرام:** أيقونة Instagram وردية
4. **سناب شات:** إيموجي 👻 على خلفية صفراء
5. **يوتيوب:** أيقونة Youtube حمراء
6. **فيسبوك:** أيقونة Facebook زرقاء

---

# 🎨 ثانياً: business-card-edit.tsx (التحرير)

### 🏗️ الهيكل الكامل:

```
BusinessCardEdit
├── 1. الإشعارات (2)
│   ├── إشعار الحفظ الناجح
│   └── إشعار الخطأ
│
├── 2. الهيدر الثابت
│   ├── زر "عودة" (يسار)
│   ├── زر "حفظ والعودة" (يمين)
│   └── العنوان + الوصف
│
├── 3. شريط الحفظ التلقائي
│   ├── مؤشر الحالة (مفعّل/معطّل)
│   ├── زر تبديل الحفظ التلقائي
│   └── زر "حفظ الآن"
│
└── 4. الأقسام (5 أقسام)
    ├── قسم الصور (3 صور)
    ├── قسم المعلومات الأساسية (7 حقول)
    ├── قسم النبذة (1 Textarea)
    ├── قسم التواصل الاجتماعي (6 حقول)
    ├── قسم أيام وساعات العمل (7 أيام)
    └── أزرار إدارة البيانات (حذف/تصدير)
```

---

### التفاصيل الحرفية:

---

## 1️⃣ الهيدر الثابت

```typescript
<div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 shadow-lg">
  <div className="max-w-4xl mx-auto">
    {/* أزرار */}
    <div className="flex items-center justify-between mb-2">
      <Button
        onClick={onBack}
        variant="ghost"
        className="text-white hover:bg-white/20"
      >
        <ArrowRight className="w-4 h-4 ml-2" />
        عودة
      </Button>
      
      <Button
        onClick={() => {
          handleManualSave();
          onBack();
        }}
        className="bg-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37]/90"
      >
        <Save className="w-4 h-4 ml-1" />
        حفظ والعودة
      </Button>
    </div>
    
    {/* العنوان */}
    <div className="flex items-center gap-2">
      <Upload className="w-6 h-6" />
      <h1 className="text-2xl font-bold">تحرير بطاقة الأعمال الرقمية</h1>
    </div>
    <p className="text-white/80 text-sm mt-1">
      قم بتحديث معلومات بطاقتك الرقمية بما في ذلك الصور والمعلومات الأساسية وأوقات العمل وروابط التواصل
    </p>
  </div>
</div>
```

**النصوص (حرفياً):**
- **العنوان:** "تحرير بطاقة الأعمال الرقمية"
- **الوصف:** "قم بتحديث معلومات بطاقتك الرقمية بما في ذلك الصور والمعلومات الأساسية وأوقات العمل وروابط التواصل"

---

## 2️⃣ شريط الحفظ التلقائي

```typescript
<div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-3 mb-6">
  <div className="flex items-center justify-between gap-4 flex-wrap">
    {/* مؤشر الحالة */}
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-green-700">
        <strong>الحفظ التلقائي: {autoSaveEnabled ? 'مفعّل ✅' : 'معطّل ⏸️'}</strong>
      </span>
    </div>
    
    {/* أزرار */}
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
        className="border-[#D4AF37] text-[#01411C]"
      >
        {autoSaveEnabled ? '⏸️ إيقاف الحفظ التلقائي' : '▶️ تفعيل الحفظ التلقائي'}
      </Button>
      <Button
        size="sm"
        onClick={handleManualSave}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        <Save className="w-4 h-4 ml-1" />
        حفظ الآن
      </Button>
    </div>
  </div>
</div>
```

**النصوص:**
- **مفعّل:** "الحفظ التلقائي: مفعّل ✅"
- **معطّل:** "الحفظ التلقائي: معطّل ⏸️"
- **زر إيقاف:** "⏸️ إيقاف الحفظ التلقائي"
- **زر تفعيل:** "▶️ تفعيل الحفظ التلقائي"
- **زر حفظ:** "حفظ الآن"

---

## 3️⃣ قسم الصور (3 صور)

**Grid:** `grid-cols-1 md:grid-cols-3 gap-4`

**كل صورة (نفس البنية):**

```typescript
<div className="space-y-2">
  <Label>[النص]</Label>
  <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 text-center">
    {formData.[imageField] ? (
      <div className="relative">
        <img src={formData.[imageField]} alt="[Alt]" className="w-full max-w-full h-auto object-contain rounded [shape]" />
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2"
          onClick={() => setFormData({ ...formData, [imageField]: '' })}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    ) : (
      <label className="cursor-pointer">
        <Upload className="w-8 h-8 mx-auto text-[#D4AF37]" />
        <p className="text-sm text-gray-600 mt-2">اضغط لرفع [النص]</p>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload('[type]', file);
          }}
        />
      </label>
    )}
  </div>
</div>
```

**الصور الثلاث:**

| الصورة | Label | النص عند الرفع | Type | Shape |
|--------|-------|----------------|------|-------|
| coverImage | صورة الغلاف | "اضغط لرفع الصورة" | 'cover' | - |
| logoImage | شعار الشركة | "اضغط لرفع الشعار" | 'logo' | - |
| profileImage | الصورة الشخصية | "اضغط لرفع الصورة" | 'profile' | `rounded-full` |

---

## 4️⃣ قسم المعلومات الأساسية (7 حقول)

**Grid:** `grid-cols-1 md:grid-cols-2 gap-4`

**الحقول (بالترتيب):**

1. **المنصة الإلكترونية الرسمية:**
```typescript
<Label>المنصة الإلكترونية الرسمية</Label>
<Input
  value={formData.officialPlatform}
  onChange={(e) => setFormData({ ...formData, officialPlatform: e.target.value })}
  placeholder="https://..."
  className="text-right"
/>
```

2. **النطاق (Domain):**
```typescript
<Label>النطاق (Domain)</Label>
<Input
  value={formData.domain}
  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
  placeholder="my-platform"
  className="text-right"
/>
```

3. **موقع Google Maps:**
```typescript
<Label>موقع Google Maps</Label>
<Input
  value={formData.googleMapsLocation}
  onChange={(e) => setFormData({ ...formData, googleMapsLocation: e.target.value })}
  placeholder="رابط الموقع على خرائط جوجل"
  className="text-right"
/>
```

4. **المدينة:**
```typescript
<Label>المدينة</Label>
<Input
  value={formData.location}
  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
  placeholder="المدينة"
  className="text-right"
/>
```

5. **رقم السجل التجاري:**
```typescript
<Label>رقم السجل التجاري</Label>
<Input
  value={formData.commercialRegistration}
  onChange={(e) => setFormData({ ...formData, commercialRegistration: e.target.value })}
  placeholder="1234567890"
  className="text-right"
/>
```

6. **تاريخ انتهاء السجل التجاري:**
```typescript
<Label>تاريخ انتهاء السجل التجاري</Label>
<Input
  type="date"
  value={formData.commercialExpiryDate || ''}
  onChange={(e) => setFormData({ ...formData, commercialExpiryDate: e.target.value })}
  className="text-right"
/>
```

7. **تاريخ انتهاء رخصة فال:**
```typescript
<Label>تاريخ انتهاء رخصة فال</Label>
<Input
  type="date"
  value={formData.falExpiry}
  onChange={(e) => setFormData({ ...formData, falExpiry: e.target.value })}
  className="text-right"
/>
```

---

## 5️⃣ قسم النبذة

**العنوان:** "نبذة عني"

```typescript
<Textarea
  value={formData.bio}
  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
  placeholder="اكتب نبذة عنك وعن خبراتك في المجال العقاري..."
  className="min-h-[120px] text-right"
  maxLength={300}
/>
<p className="text-sm text-gray-500 text-left">{formData.bio.length}/300 حرف</p>
```

**الحد الأقصى:** 300 حرف  
**Placeholder:** "اكتب نبذة عنك وعن خبراتك في المجال العقاري..."

---

## 6️⃣ قسم التواصل الاجتماعي (6 حقول)

**العنوان:** "روابط التواصل الاجتماعي"

**Grid:** `grid-cols-1 md:grid-cols-2 gap-4`

**المنصات (بالترتيب مع أيقوناتها):**

1. **تيكتوك:** حرف T أسود
2. **اكس:** Twitter أيقونة سوداء
3. **انستقرام:** Instagram أيقونة وردية
4. **سناب شات:** 👻 على خلفية صفراء
5. **يوتيوب:** Youtube أيقونة حمراء
6. **فيسبوك:** Facebook أيقونة زرقاء

**كل حقل:**
```typescript
<div className="space-y-2">
  <Label className="flex items-center gap-2">
    {platform.icon}
    {platform.name}
  </Label>
  <Input
    value={formData.socialMedia[platform.key]}
    onChange={(e) => setFormData({ 
      ...formData, 
      socialMedia: { ...formData.socialMedia, [platform.key]: e.target.value }
    })}
    placeholder={`رابط ${platform.name}`}
    className="text-right"
  />
</div>
```

---

## 7️⃣ قسم أيام وساعات العمل

**العنوان:** "أيام وساعات العمل"

**الأيام (7 أيام):**
- **الأحد** - **السبت**

**كل يوم:**
```typescript
<div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
  <div className="w-24 font-semibold text-[#01411C]">{daysArabic[day]}</div>
  
  {/* Checkbox مفتوح */}
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={hours.isOpen}
      onChange={(e) => setFormData({
        ...formData,
        workingHours: {
          ...formData.workingHours,
          [day]: { ...hours, isOpen: e.target.checked }
        }
      })}
      className="w-4 h-4"
    />
    <span className="text-sm">مفتوح</span>
  </label>

  {/* أوقات العمل (إذا مفتوح) */}
  {hours.isOpen && (
    <div className="flex items-center gap-2">
      <Input
        type="time"
        value={hours.open}
        onChange={(e) => setFormData({
          ...formData,
          workingHours: {
            ...formData.workingHours,
            [day]: { ...hours, open: e.target.value }
          }
        })}
        className="w-32 text-sm"
      />
      <span className="text-sm text-gray-600">إلى</span>
      <Input
        type="time"
        value={hours.close}
        onChange={(e) => setFormData({
          ...formData,
          workingHours: {
            ...formData.workingHours,
            [day]: { ...hours, close: e.target.value }
          }
        })}
        className="w-32 text-sm"
      />
    </div>
  )}
</div>
```

**الأوقات الافتراضية:**
- **الأحد-الخميس + السبت:** `8:00 ص - 2:00 م` (مفتوح)
- **الجمعة:** فارغ (مغلق)

---

## 8️⃣ أزرار إدارة البيانات

**Background:** `bg-yellow-50 border-2 border-yellow-300`  
**العنوان:** "إدارة البيانات المحفوظة"

**الأزرار (3):**

1. **حذف جميع البيانات:**
```typescript
<Button
  size="sm"
  variant="outline"
  onClick={() => {
    const confirmed = confirm('هل تريد حذف جميع البيانات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.');
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      // إعادة تعيين FormData للقيم الافتراضية
      window.location.reload();
    }
  }}
  className="text-red-600 hover:bg-red-50"
>
  <Trash2 className="w-4 h-4 ml-2" />
  حذف جميع البيانات
</Button>
```

**رسالة التأكيد (حرفياً):**
```
هل تريد حذف جميع البيانات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.
```

2. **تصدير البيانات (JSON):**
```typescript
<Button
  size="sm"
  variant="outline"
  onClick={() => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `business-card-${user?.name || 'data'}.json`;
    link.click();
  }}
>
  <Download className="w-4 h-4 ml-2" />
  تصدير البيانات (JSON)
</Button>
```

3. **استيراد البيانات:**
```typescript
<Button
  size="sm"
  variant="outline"
  onClick={() => document.getElementById('import-file')?.click()}
>
  <Upload className="w-4 h-4 ml-2" />
  استيراد بيانات
</Button>
<input
  id="import-file"
  type="file"
  accept=".json"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setFormData(imported);
          handleManualSave();
          toast.success('تم استيراد البيانات بنجاح!');
        } catch (error) {
          toast.error('خطأ في قراءة الملف');
        }
      };
      reader.readAsText(file);
    }
  }}
/>
```

---

# 🎉 انتهى التوثيق الحرفي الكامل

## ✅ ما تم توثيقه:

### BusinessCardProfile (عرض البطاقة):
1. ✅ 3 إشعارات
2. ✅ زر الحفظ العائم
3. ✅ الهيدر الملون (5 أجزاء)
   - الصورة القابلة للتبديل
   - 6 مستويات الشارات
   - عداد الأيام (رخصة + سجل)
4. ✅ 4 أزرار رئيسية (مع رسائل واتساب حرفياً)
5. ✅ 6 تبويبات كاملة
6. ✅ 6 منصات تواصل اجتماعي

### BusinessCardEdit (تحرير البطاقة):
1. ✅ الهيدر الثابت
2. ✅ شريط الحفظ التلقائي
3. ✅ 5 أقسام:
   - 3 صور
   - 7 حقول معلومات
   - نبذة (300 حرف)
   - 6 روابط اجتماعية
   - 7 أيام عمل
4. ✅ 3 أزرار إدارة البيانات

### الربط:
- ✅ localStorage: `business_card_${user?.id || user?.phone || 'default'}`
- ✅ IndexedDB: 3 صور (cover, logo, profile)
- ✅ Event: `'businessCardUpdated'` → MyPlatform
- ✅ vCard Generator: `/utils/vcardGenerator`
- ✅ Image Storage: `/utils/imageStorage`

**المجموع الكلي:** بطاقة الأعمال الرقمية موثقة 100% حرفياً!
