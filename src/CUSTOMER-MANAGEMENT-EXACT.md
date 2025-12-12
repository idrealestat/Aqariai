# 👥 إدارة العملاء - التوثيق الحرفي الكامل

## ⚠️ كل حرف وزر وحقل ووظيفة - بدون أي إضافة

---

# 📄 الملف: `/components/EnhancedBrokerCRM-with-back.tsx`

## معلومات أساسية:
- **السطور:** ~2800 سطر
- **المكون:** `EnhancedBrokerCRM`
- **النوع:** Default Export
- **آخر تحديث:** الإثنين 20 أكتوبر 2025

---

# 🎯 Props

```typescript
interface EnhancedBrokerCRMProps {
  user: User | null;
  onNavigate: (page: string) => void;
}
```

**User Interface:**
```typescript
interface User {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  type: "individual" | "team" | "office" | "company";
}
```

---

# 📊 Types & Interfaces (8 types رئيسية)

## 1. CustomerType (6 أنواع):
```typescript
type CustomerType = 'seller' | 'buyer' | 'lessor' | 'tenant' | 'finance' | 'other';
```

**الترجمة:**
- `seller`: بائع
- `buyer`: مشتري
- `lessor`: مؤجر
- `tenant`: مستأجر
- `finance`: تمويل
- `other`: أخرى

---

## 2. InterestLevel (5 مستويات):
```typescript
type InterestLevel = 'passionate' | 'interested' | 'moderate' | 'limited' | 'not-interested';
```

**الترجمة:**
- `passionate`: شغوف
- `interested`: مهتم
- `moderate`: معتدل
- `limited`: محدود
- `not-interested`: غير مهتم

---

## 3. Customer Interface (17 حقل):
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  image?: string;
  profileImage?: string; // صورة بطاقة العمل للوسطاء المشتركين
  type?: CustomerType; // اختياري
  category?: string; // من customersManager (عربي: 'مالك', 'مشتري')
  interestLevel?: InterestLevel; // اختياري
  tags: string[];
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  activities: Activity[];
  activityLogs?: ActivityLog[]; // سجل النشاط التلقائي
  financingRequest?: FinancingRequest;
  propertyOffer?: PropertyOffer;
  propertyRequest?: PropertyRequest;
}
```

---

## 4. Activity Interface:
```typescript
interface Activity {
  id: string;
  type: string;
  description: string;
  date: Date;
  icon: string;
}
```

---

## 5. ActivityLog Interface (سجل النشاط التلقائي):
```typescript
type ActivityLogType = 'call' | 'message' | 'edit' | 'document' | 'meeting' | 'task' | 'tag';

interface ActivityLog {
  id: string;
  type: ActivityLogType;
  action: string;
  details: string;
  timestamp: Date;
  metadata?: {
    callDirection?: 'incoming' | 'outgoing';
    duration?: number;
    documentName?: string;
    fieldChanged?: string;
    oldValue?: string;
    newValue?: string;
  };
}
```

---

## 6. Column Interface (الأعمدة Kanban):
```typescript
interface Column {
  id: string;
  title: string;
  customerIds: string[];
}
```

---

# 🎨 الألوان (Colors)

## أ. CUSTOMER_TYPE_COLORS (خط علوي - 6 ألوان):

```typescript
const CUSTOMER_TYPE_COLORS: Record<CustomerType, { border: string; bg: string; label: string }> = {
  seller: { 
    border: 'border-t-4 border-t-[#1E90FF]', 
    bg: 'bg-[#1E90FF]/10', 
    label: 'بائع' 
  },
  buyer: { 
    border: 'border-t-4 border-t-[#32CD32]', 
    bg: 'bg-[#32CD32]/10', 
    label: 'مشتري' 
  },
  lessor: { 
    border: 'border-t-4 border-t-[#FF8C00]', 
    bg: 'bg-[#FF8C00]/10', 
    label: 'مؤجر' 
  },
  tenant: { 
    border: 'border-t-4 border-t-[#FFD700]', 
    bg: 'bg-[#FFD700]/10', 
    label: 'مستأجر' 
  },
  finance: { 
    border: 'border-t-4 border-t-[#9370DB]', 
    bg: 'bg-[#9370DB]/10', 
    label: 'تمويل' 
  },
  other: { 
    border: 'border-t-4 border-t-[#A9A9A9]', 
    bg: 'bg-[#A9A9A9]/10', 
    label: 'أخرى' 
  }
};
```

**الألوان بالتفصيل:**
- **بائع:** `#1E90FF` (أزرق)
- **مشتري:** `#32CD32` (أخضر ليموني)
- **مؤجر:** `#FF8C00` (برتقالي داكن)
- **مستأجر:** `#FFD700` (ذهبي)
- **تمويل:** `#9370DB` (بنفسجي فاتح)
- **أخرى:** `#A9A9A9` (رمادي داكن)

---

## ب. INTEREST_LEVEL_COLORS (خط سفلي - 5 ألوان):

```typescript
const INTEREST_LEVEL_COLORS: Record<InterestLevel, { border: string; bg: string; label: string }> = {
  'passionate': { 
    border: 'border-b-4 border-b-[#DC143C]', 
    bg: 'bg-[#DC143C]/10', 
    label: 'شغوف' 
  },
  'interested': { 
    border: 'border-b-4 border-b-[#8B4513]', 
    bg: 'bg-[#8B4513]/10', 
    label: 'مهتم' 
  },
  'moderate': { 
    border: 'border-b-4 border-b-[#800020]', 
    bg: 'bg-[#800020]/10', 
    label: 'معتدل' 
  },
  'limited': { 
    border: 'border-b-4 border-b-[#7B3F00]', 
    bg: 'bg-[#7B3F00]/10', 
    label: 'محدود' 
  },
  'not-interested': { 
    border: 'border-b-4 border-b-[#000000]', 
    bg: 'bg-[#000000]/10', 
    label: 'غير مهتم' 
  }
};
```

**الألوان بالتفصيل:**
- **شغوف:** `#DC143C` (أحمر قرمزي)
- **مهتم:** `#8B4513` (بني محمر)
- **معتدل:** `#800020` (بورجوندي)
- **محدود:** `#7B3F00` (شوكولاتة داكن)
- **غير مهتم:** `#000000` (أسود)

---

# 🚨 REPORT_TYPES (23 نوع للبلاغات):

```typescript
const REPORT_TYPES = [
  { id: '1', label: '🚫 وسيط غير مرخص', value: 'unlicensed-broker' },
  { id: '2', label: '🆔 انتحال الهوية أو الشخصية', value: 'identity-theft' },
  { id: '3', label: '👥 الحسابات الوهمية', value: 'fake-accounts' },
  { id: '4', label: '📝 تزوير معلومات', value: 'information-forgery' },
  { id: '5', label: '🔒 انتهاك الخصوصية', value: 'privacy-violation' },
  { id: '6', label: '🤥 التضليل أو الخداع', value: 'misleading-deception' },
  { id: '7', label: '💰 عمليات الاحتيال والنصب', value: 'fraud-scam' },
  { id: '8', label: '📄 المعلومات المضللة أو المزيفة', value: 'fake-information' },
  { id: '9', label: '🚫 المحتوى أو السلوك المسيء', value: 'abusive-content' },
  { id: '10', label: '🚫 التحرش', value: 'harassment' },
  { id: '11', label: '💬 خطاب الكراهية', value: 'hate-speech' },
  { id: '12', label: '👊 التنمر الإلكتروني', value: 'cyberbullying' },
  { id: '13', label: '🚫 المحتوى غير اللائق', value: 'inappropriate-content' },
  { id: '14', label: '🔞 المحتوى الجنسي الصريح', value: 'explicit-content' },
  { id: '15', label: '⚔️ التحريض على العنف', value: 'violence-incitement' },
  { id: '16', label: '📩 النشاط غير المرغوب ��يه أو البريد المزعج', value: 'spam' },
  { id: '17', label: '🤖 البوتات', value: 'bots' },
  { id: '18', label: '🔄 الإرسال المتكرر', value: 'repeated-posting' },
  { id: '19', label: '🖥️ انتحال منصة', value: 'platform-impersonation' },
  { id: '20', label: '⚖️ النشاط غير القانوني', value: 'illegal-activity' },
  { id: '21', label: '🆔 انتحال الهوية', value: 'impersonation' },
  { id: '22', label: '📢 إعلانات غير مصرح بها', value: 'unauthorized-ads' },
  { id: '23', label: '🔗 روابط ضارة', value: 'malicious-links' }
];
```

---

# 🏗️ الهيكل العام (بالترتيب)

```
EnhancedBrokerCRM
├── 1. UnifiedMainHeader (الهيدر الموحد)
│   ├── زر Menu (يمين) → RightSliderComplete
│   ├── Logo: 🏢 عقاري AI Aqari (وسط)
│   ├── زر Bell (يسار) - إشعارات
│   └── زر PanelLeft (يسار) → LeftSliderComplete
│
├── 2. زر العودة
│   └── أيقونة: ← + نص: "العودة للواجهة الرئيسية"
│
├── 3. العنوان الرئيسي
│   ├── أيقونة: <Users />
│   └── نص: "إدارة العملاء"
│
├── 4. شريط الإحصائيات السريعة
│   ├── إجمالي العملاء
│   ├── عملاء نشطين
│   ├── عملاء جدد هذا الشهر
│   └── معدل التحويل
│
├── 5. شريط الأدوات
│   ├── حقل البحث
│   ├── زر الفلترة
│   ├── زر إضافة عميل
│   └── زر CallSyncButton
│
└── 6. لوحة Kanban
    ├── عمود "عملاء جدد"
    ├── عمود "تواصل أولي"
    ├── عمود "عروض مقدمة"
    ├── عمود "تفاوض"
    └── عمود "إتمام الصفقة"
        └── بطاقات العملاء (Drag & Drop)
```

---

# 1️⃣ UnifiedMainHeader (الهيدر)

**Component:** `/components/layout/UnifiedMainHeader.tsx`

**محتوياته بالترتيب:**

### أ. الخلفية
```css
sticky top-0 z-40
bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C]
backdrop-blur-md
border-b-2 border-[#D4AF37]
shadow-lg
```

### ب. الأزرار (4 أزرار):

**1. زر Menu (اليمين):**
```typescript
<button className="border-2 border-[#D4AF37] bg-white/10 text-white h-9 w-9">
  <Menu className="w-5 h-5" />
</button>
```

**2. Logo (الوسط):**
```typescript
<div className="bg-white/10 text-white px-6 py-2 rounded-full border-2 border-[#D4AF37]">
  <Building2 className="w-6 h-6" />
  <span>عقاري</span>
  <span className="text-[#D4AF37]">AI</span>
  <span>Aqari</span>
</div>
```

**3. زر Bell (اليسار):**
```typescript
<button className="border-2 border-[#D4AF37] bg-white/10 text-white h-9 w-9">
  <Bell className="w-5 h-5" />
  {/* مؤشر أحمر */}
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
</button>
```

**4. زر PanelLeft (اليسار):**
```typescript
<button className="border-2 border-[#D4AF37] bg-white/10 text-white h-9 w-9">
  <PanelLeft className="w-5 h-5" />
</button>
```

---

# 2️⃣ زر العودة

```typescript
<Button
  variant="outline"
  onClick={onBack}
  className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4] text-[#01411C]"
>
  <ArrowRight className="w-4 h-4 ml-2" />
  العودة للواجهة الرئيسية
</Button>
```

**التفاصيل:**
- **الأيقونة:** `<ArrowRight className="w-4 h-4 ml-2" />`
- **النص:** "العودة للواجهة الرئيسية"
- **onClick:** `onBack`
- **الألوان:**
  - Border: `border-[#D4AF37]`
  - Hover BG: `bg-[#f0fdf4]`
  - Text: `text-[#01411C]`

---

# 3️⃣ العنوان الرئيسي

```typescript
<div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-2 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
  <Users className="w-6 h-6" />
  <span className="font-bold text-lg">إدارة العملاء</span>
</div>
```

**التفاصيل:**
- **الأيقونة:** `<Users className="w-6 h-6" />`
- **النص:** "إدارة العملاء" (حجم `text-lg`)
- **الألوان:**
  - BG: `bg-white/10`
  - Border: `border-[#D4AF37]`
  - Text: `text-white`

---

# 4️⃣ شريط الإحصائيات السريعة (4 بطاقات)

**Grid:** `grid-cols-2 md:grid-cols-4 gap-4 mb-6`

---

## بطاقة 1: إجمالي العملاء

```typescript
<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">إجمالي العملاء</p>
        <p className="text-3xl font-bold mt-1">{totalCustomers}</p>
      </div>
      <Users className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** Gradient من `blue-500` إلى `blue-600`
- **Text:** `text-white`
- **الأيقونة:** `<Users className="w-10 h-10 opacity-80" />`

---

## بطاقة 2: عملاء نشطين

```typescript
<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">عملاء نشطين</p>
        <p className="text-3xl font-bold mt-1">{activeCustomers}</p>
      </div>
      <TrendingUp className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** Gradient من `green-500` إلى `green-600`
- **الأيقونة:** `<TrendingUp />`

---

## بطاقة 3: عملاء جدد هذا الشهر

```typescript
<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">عملاء جدد هذا الشهر</p>
        <p className="text-3xl font-bold mt-1">{newCustomersThisMonth}</p>
      </div>
      <UserPlus className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** Gradient من `purple-500` إلى `purple-600`
- **الأيقونة:** `<UserPlus />`

---

## بطاقة 4: معدل التحويل

```typescript
<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">معدل التحويل</p>
        <p className="text-3xl font-bold mt-1">{conversionRate}%</p>
      </div>
      <TrendingUp className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** Gradient من `orange-500` إلى `orange-600`

---

# 5️⃣ شريط الأدوات (4 أزرار)

**Grid:** `grid-cols-1 md:grid-cols-4 gap-4 mb-6`

---

## 1. حقل البحث

```typescript
<div className="relative md:col-span-2">
  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <Input
    type="text"
    placeholder="ابحث عن عميل..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pr-10 border-2 border-gray-300 focus:border-[#D4AF37]"
  />
</div>
```

**التفاصيل:**
- **الأيقونة:** `<Search />` في اليمين
- **Placeholder:** "ابحث عن عميل..."
- **Value:** `searchQuery`
- **onChange:** `setSearchQuery(e.target.value)`
- **Focus Border:** `border-[#D4AF37]`

---

## 2. زر الفلترة

```typescript
<Button
  variant="outline"
  onClick={() => setShowFilters(!showFilters)}
  className="border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
>
  <Filter className="w-5 h-5 ml-2" />
  فلترة
</Button>
```

**التفاصيل:**
- **الأيقونة:** `<Filter className="w-5 h-5 ml-2" />`
- **النص:** "فلترة"
- **onClick:** `setShowFilters(!showFilters)`
- **الألوان:**
  - Border: `border-[#D4AF37]`
  - Text: `text-[#01411C]`
  - Hover BG: `bg-[#f0fdf4]`

---

## 3. زر إضافة عميل

```typescript
<Button
  onClick={() => setShowAddCustomerModal(true)}
  className="bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white"
>
  <Plus className="w-5 h-5 ml-2" />
  إضافة عميل
</Button>
```

**التفاصيل:**
- **الأيقونة:** `<Plus className="w-5 h-5 ml-2" />`
- **النص:** "إضافة عميل"
- **onClick:** `setShowAddCustomerModal(true)`
- **الألوان:**
  - Normal: Gradient من `#01411C` إلى `#065f41`
  - Hover: Gradient من `#065f41` إلى `#01411C`

---

## 4. CallSyncButton

```typescript
<CallSyncButton />
```

**Component:** `/components/CallSyncButton.tsx`  
**الوظيفة:** زر مزامنة المكالمات

---

# 📱 التالي: بطاقة العميل (Customer Card)
سأكمل في الملف التالي بسبب الحجم...
