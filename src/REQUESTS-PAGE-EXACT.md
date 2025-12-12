# 📋 صفحة الطلبات - التوثيق الحرفي الكامل

## ⚠️ كل حرف وزر وحقل ووظيفة - بدون أي إضافة

---

# 📄 الملف: `/components/RequestsPage.tsx`

## معلومات أساسية:
- **السطور:** ~700 سطر
- **المكون:** `RequestsPage`
- **النوع:** Default Export

---

# 🎯 Props

```typescript
interface RequestsPageProps {
  onNavigate?: (page: string, options?: any) => void;
}
```

**الوظيفة:** دالة التنقل (اختيارية)

---

# 📊 Types & Interfaces

```typescript
type PropertyType = 'شقة' | 'فيلا' | 'أرض' | 'عمارة' | 'محل' | 'مكتب' | 'مستودع' | 'مزرعة' | 'استراحة';
type TransactionType = 'شراء' | 'استئجار';
type PropertyCategory = 'سكني' | 'تجاري';
type PaymentMethod = 'كاش' | 'تمويل';
type Urgency = 'مستعجل' | 'عادي';

interface PropertyRequest {
  id: string;
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  category: PropertyCategory;
  budget: number;
  urgency: Urgency;
  city: string;
  districts: string[]; // 3 أحياء بالترتيب
  paymentMethod: PaymentMethod;
  description?: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
  customerId?: string;
  customerName?: string;
}
```

---

# 📊 States (5 states)

```typescript
const [requests, setRequests] = useState<PropertyRequest[]>(demoRequests);
const [showCreateForm, setShowCreateForm] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
const [formData, setFormData] = useState<Partial<PropertyRequest>>({
  title: '',
  propertyType: 'شقة',
  transactionType: 'شراء',
  category: 'سكني',
  budget: 0,
  urgency: 'عادي',
  city: 'الرياض',
  districts: [],
  paymentMethod: 'كاش',
  description: ''
});
```

**القيم الافتراضية:**
- `showCreateForm`: `false`
- `searchQuery`: `''`
- `formData.propertyType`: `'شقة'`
- `formData.transactionType`: `'شراء'`
- `formData.category`: `'سكني'`
- `formData.urgency`: `'عادي'`
- `formData.city`: `'الرياض'`
- `formData.paymentMethod`: `'كاش'`

---

# 🏙️ المدن والأحياء (const)

```typescript
const cityDistricts: Record<string, string[]> = {
  'الرياض': ['النرجس', 'العليا', 'الملقا', 'الياسمين', ...],
  'جدة': ['الروضة', 'الزهراء', 'الشاطئ', ...],
  'مكة': ['العزيزية', 'المعابدة', ...],
  // ... المزيد من المدن
};
```

**عدد المدن:** 20 مدينة
**عدد الأحياء:** يتراوح من 10-17 حي لكل مدينة

---

# 🎨 الهيكل العام (بالترتيب)

```
RequestsPage
├── 1. Header
│   ├── عنوان "📋 الطلبات"
│   ├── وصف "إدارة طلبات البحث عن العقارات"
│   └── زر "إنشاء طلب جديد"
│
├── 2. نموذج إنشاء الطلب (قابل للتوسيع)
│   ├── عنوان الطلب
│   ├── درجة الأهمية (2 زر)
│   ├── المدينة (select)
│   ├── الأحياء (Multi-Select - حتى 3)
│   ├── نوع العقار (select)
│   ├── نوع العملية (2 زر)
│   ├── التصنيف (2 زر)
│   ├── الميزانية (number)
│   ├── طريقة الدفع (2 زر)
│   ├── ملاحظات (textarea)
│   └── أزرار (إنشاء + إلغاء)
│
├── 3. شريط البحث والفلترة
│   ├── حقل البحث
│   └── زر فلترة
│
└── 4. شبكة الطلبات
    └── بطاقة طلب
        ├── عنوان + Badge الأهمية
        ├── معلومات (نوع العملية + نوع العقار + التصنيف)
        ├── الموقع (المدينة + الأحياء)
        ├── الميزانية + طريقة الدفع
        ├── الوصف (إذا وجد)
        ├── التاريخ + الحالة
        └── أزرار إجراءات
```

---

# 1️⃣ Header

## الحاوية:
```css
flex items-center justify-between
mb-6
```

---

## أ. النصوص

```typescript
<div>
  <h1 className="text-3xl font-bold text-[#01411C] mb-2">
    📋 الطلبات
  </h1>
  <p className="text-gray-600">
    إدارة طلبات البحث عن العقارات
  </p>
</div>
```

**التفاصيل:**
- **العنوان:** "📋 الطلبات" (`text-3xl font-bold text-[#01411C]`)
- **الوصف:** "إدارة طلبات البحث عن العقارات" (`text-gray-600`)

---

## ب. زر إنشاء طلب جديد

```typescript
<Button
  onClick={() => setShowCreateForm(!showCreateForm)}
  className="bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white px-6 py-3 shadow-lg"
>
  <PlusCircle className="w-5 h-5 ml-2" />
  إنشاء طلب جديد
</Button>
```

**التفاصيل:**
- **الأيقونة:** `<PlusCircle className="w-5 h-5 ml-2" />`
- **النص:** "إنشاء طلب جديد"
- **onClick:** `setShowCreateForm(!showCreateForm)`
- **الألوان:**
  - **Normal:** Gradient من `#01411C` إلى `#065f41`
  - **Hover:** Gradient من `#065f41` إلى `#01411C`

---

# 2️⃣ نموذج إنشاء الطلب

## الحاوية:
```css
border-2 border-[#D4AF37]
shadow-xl
```

**Animation:**
```typescript
<AnimatePresence>
  {showCreateForm && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
```

---

## Header النموذج

```typescript
<CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
  <div className="flex items-center justify-between">
    <CardTitle className="flex items-center gap-2">
      <PlusCircle className="w-6 h-6" />
      إنشاء طلب جديد
    </CardTitle>
    <button
      onClick={() => setShowCreateForm(false)}
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
</CardHeader>
```

**الألوان:**
- **Background:** Gradient من `#01411C` إلى `#065f41`
- **Text:** `text-white`

---

## 1. حقل عنوان الطلب

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    عنوان الطلب *
  </label>
  <Input
    value={formData.title}
    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
    placeholder="مثال: مطلوب شقة 3 غرف في حي راقي"
    className="border-2 border-gray-200 focus:border-[#D4AF37]"
  />
</div>
```

**التفاصيل:**
- **Label:** "عنوان الطلب *"
- **Placeholder:** "مثال: مطلوب شقة 3 غرف في حي راقي"
- **Value:** `formData.title`
- **onChange:** `setFormData(prev => ({ ...prev, title: e.target.value }))`
- **Focus Border:** `border-[#D4AF37]`

---

## 2. درجة الأهمية (2 زر)

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    درجة الأهمية *
  </label>
  <div className="grid grid-cols-2 gap-3">
```

### زر "مستعجل":
```typescript
<button
  type="button"
  onClick={() => setFormData(prev => ({ ...prev, urgency: 'مستعجل' }))}
  className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
    formData.urgency === 'مستعجل'
      ? 'bg-red-500 text-white shadow-lg'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }`}
>
  🔴
  <span>مستعجل</span>
</button>
```

### زر "عادي":
```typescript
<button
  // ... نفس البنية
  className={`... ${
    formData.urgency === 'عادي'
      ? 'bg-green-500 text-white shadow-lg'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }`}
>
  🟢
  <span>عادي</span>
</button>
```

**الألوان:**
- **مستعجل (نشط):** `bg-red-500 text-white shadow-lg`
- **عادي (نشط):** `bg-green-500 text-white shadow-lg`
- **غير نشط:** `bg-gray-100 hover:bg-gray-200 text-gray-700`

---

## 3. المدينة (Select)

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    المدينة *
  </label>
  <select
    value={formData.city}
    onChange={(e) => {
      setFormData(prev => ({ ...prev, city: e.target.value, districts: [] }));
      setAvailableDistricts(cityDistricts[e.target.value] || []);
    }}
    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none"
  >
    <option value="الرياض">الرياض</option>
    <option value="جدة">جدة</option>
    <option value="الدمام">الدمام</option>
    <option value="مكة">مكة المكرمة</option>
    <option value="المدينة">المدينة المنورة</option>
    <option value="الخبر">الخبر</option>
    <option value="الظهران">الظهران</option>
    <option value="الطائف">الطائف</option>
    <option value="أبها">أبها</option>
    <option value="تبوك">تبوك</option>
    <option value="بريدة">بريدة</option>
    <option value="خميس مشيط">خميس مشيط</option>
    <option value="نجران">نجران</option>
    <option value="جزان">جزان</option>
    <option value="حفر الباطن">حفر الباطن</option>
    <option value="الجبيل">الجبيل</option>
    <option value="ينبع">ينبع</option>
    <option value="القطيف">القطيف</option>
    <option value="القصيم">القصيم</option>
    <option value="عرعر">عرعر</option>
  </select>
</div>
```

**المدن (بالترتيب):**
1. الرياض
2. جدة
3. الدمام
4. مكة المكرمة
5. المدينة المنورة
6. الخبر
7. الظهران
8. الطائف
9. أبها
10. تبوك
11. بريدة
12. خميس مشيط
13. نجران
14. جزان
15. حفر الباطن
16. الجبيل
17. ينبع
18. القطيف
19. القصيم
20. عرعر

**onChange:**
- يغير `formData.city`
- يفرغ `formData.districts` (يعيد إلى `[]`)
- يحدث `availableDistricts` حسب المدينة المختارة

---

## 4. الأحياء (Multi-Select - حتى 3)

```typescript
<div>
  <MultiSelectOptions
    options={availableDistricts}
    selectedOptions={formData.districts || []}
    onToggle={handleDistrictToggle}
    onAddNew={handleAddNewDistrict}
    label={`الأحياء المفضلة (اختر حتى 3 - الترتيب مهم) - تم اختيار ${(formData.districts || []).length}/3`}
    addButtonText="إضافة حي جديد"
  />
  
  {/* عرض الترتيب */}
  {formData.districts && formData.districts.length > 0 && (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-xs text-blue-800 font-medium mb-2">
        ترتيب البحث:
      </p>
      <div className="flex gap-2">
        {formData.districts.map((district, index) => (
          <Badge key={district} className="bg-blue-600 text-white">
            {index + 1}. {district}
          </Badge>
        ))}
      </div>
    </div>
  )}
</div>
```

**الوظيفة:**
- يسمح باختيار حتى **3 أحياء**
- **الترتيب مهم** (يظهر بالأرقام 1، 2، 3)
- يمكن إضافة حي جديد غير موجود في القائمة

---

## 5. نوع العقار (Select)

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    نوع العقار *
  </label>
  <select
    value={formData.propertyType}
    onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none"
  >
    <option value="شقة">شقة</option>
    <option value="فيلا">فيلا</option>
    <option value="أرض">أرض</option>
    <option value="عمارة">عمارة</option>
    <option value="محل">محل</option>
    <option value="مكتب">مكتب</option>
    <option value="مستودع">مستودع</option>
    <option value="مزرعة">مزرعة</option>
    <option value="استراحة">استراحة</option>
  </select>
</div>
```

**الخيارات (بالترتيب):**
1. شقة
2. فيلا
3. أرض
4. عمارة
5. محل
6. مكتب
7. مستودع
8. مزرعة
9. استراحة

---

## 6. نوع العملية (2 زر)

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    نوع العملية *
  </label>
  <div className="grid grid-cols-2 gap-3">
```

### زر "شراء":
```typescript
<button
  type="button"
  onClick={() => setFormData(prev => ({ ...prev, transactionType: 'شراء' }))}
  className={`px-4 py-2 rounded-lg font-medium transition-all ${
    formData.transactionType === 'شراء'
      ? 'bg-[#01411C] text-white shadow-md'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }`}
>
  شراء
</button>
```

### زر "استئجار":
```typescript
<button
  // ... نفس البنية
  onClick={() => setFormData(prev => ({ ...prev, transactionType: 'استئجار' }))}
>
  استئجار
</button>
```

**الألوان:**
- **نشط:** `bg-[#01411C] text-white shadow-md`
- **غير نشط:** `bg-gray-100 hover:bg-gray-200 text-gray-700`

---

## 7. التصنيف (2 زر)

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    التصنيف *
  </label>
  <div className="grid grid-cols-2 gap-3">
```

### زر "سكني":
```typescript
<button
  type="button"
  onClick={() => setFormData(prev => ({ ...prev, category: 'سكني' }))}
  className={`px-4 py-2 rounded-lg font-medium transition-all ${
    formData.category === 'سكني'
      ? 'bg-[#01411C] text-white shadow-md'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }`}
>
  سكني
</button>
```

### زر "تجاري":
```typescript
<button
  // ... نفس البنية
  onClick={() => setFormData(prev => ({ ...prev, category: 'تجاري' }))}
>
  تجاري
</button>
```

**الألوان:** نفس "نوع العملية"

---

## 8. الميزانية

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    الميزانية (ريال) *
  </label>
  <Input
    type="number"
    value={formData.budget || ''}
    onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
    placeholder="500000"
    className="border-2 border-gray-200 focus:border-[#D4AF37]"
  />
</div>
```

**التفاصيل:**
- **Type:** `number`
- **Placeholder:** "500000"
- **Value:** `formData.budget || ''`
- **onChange:** `setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))`

---

## 9. طريقة الدفع (2 زر)

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    طريقة الدفع *
  </label>
  <div className="grid grid-cols-2 gap-3">
```

### زر "كاش":
```typescript
<button
  type="button"
  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'كاش' }))}
  className={`px-4 py-2 rounded-lg font-medium transition-all ${
    formData.paymentMethod === 'كاش'
      ? 'bg-[#01411C] text-white shadow-md'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
  }`}
>
  كاش
</button>
```

### زر "تمويل":
```typescript
<button
  // ... نفس البنية
  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'تمويل' }))}
>
  تمويل
</button>
```

**الألوان:** نفس الأزرار السابقة

---

## 10. ملاحظات إضافية

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    ملاحظات إضافية
  </label>
  <Textarea
    value={formData.description}
    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
    placeholder="أضف أي ملاحظات أو متطلبات إضافية..."
    rows={3}
    className="border-2 border-gray-200 focus:border-[#D4AF37]"
  />
</div>
```

**التفاصيل:**
- **Placeholder:** "أضف أي ملاحظات أو متطلبات إضافية..."
- **Rows:** 3
- **Value:** `formData.description`

---

## 11. أزرار النموذج (2 زر)

```typescript
<div className="flex gap-3 pt-4">
  {/* زر إنشاء */}
  <Button
    onClick={handleCreateRequest}
    className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white py-3"
  >
    <PlusCircle className="w-5 h-5 ml-2" />
    إنشاء الطلب
  </Button>
  
  {/* زر إلغاء */}
  <Button
    onClick={() => setShowCreateForm(false)}
    variant="outline"
    className="px-6"
  >
    إلغاء
  </Button>
</div>
```

**زر "إنشاء الطلب":**
- **الأيقونة:** `<PlusCircle className="w-5 h-5 ml-2" />`
- **onClick:** `handleCreateRequest`
- **الألوان:** Gradient من `#01411C` إلى `#065f41`

**زر "إلغاء":**
- **onClick:** `setShowCreateForm(false)`
- **Variant:** `outline`

---

# 3️⃣ شريط البحث والفلترة

```typescript
<div className="flex gap-3">
  <div className="relative flex-1">
    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <Input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="ابحث في الطلبات..."
      className="pr-10 border-2 border-gray-200 focus:border-[#D4AF37]"
    />
  </div>
  <Button variant="outline" className="px-6">
    <Filter className="w-5 h-5 ml-2" />
    فلترة
  </Button>
</div>
```

**حقل البحث:**
- **الأيقونة:** `<Search />` في اليمين
- **Placeholder:** "ابحث في الطلبات..."
- **Value:** `searchQuery`
- **onChange:** `setSearchQuery(e.target.value)`
- **Focus Border:** `border-[#D4AF37]`

**زر فلترة:**
- **الأيقونة:** `<Filter className="w-5 h-5 ml-2" />`
- **النص:** "فلترة"
- **Variant:** `outline`

---

# 4️⃣ شبكة الطلبات

**Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

**Animation:** Motion (Framer Motion)
```typescript
<AnimatePresence>
  {filteredRequests.map((request) => (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
```

---

## بطاقة الطلب

**الحاوية:**
```css
border-2 border-[#D4AF37]
shadow-lg
hover:shadow-xl
transition-all
overflow-hidden
```

---

### أ. Header الذهبي (أعلى البطاقة)

```typescript
<div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] p-4 border-b-4 border-[#D4AF37]">
  <div className="flex items-center justify-between">
    {/* الميزانية (يسار) */}
    <div>
      <p className="text-white/80 text-xs mb-1">الميزانية</p>
      <p className="text-white font-bold text-xl">
        {request.budget.toLocaleString('ar-SA')} ر.س
      </p>
    </div>
    
    {/* درجة الأهمية (يمين) */}
    <div className={`px-4 py-2 rounded-lg ${getUrgencyColor(request.urgency)}`}>
      {request.urgency === 'مستعجل' ? '🔴' : '🟢'} {request.urgency}
    </div>
  </div>
</div>
```

**الألوان:**
- **Background:** Gradient من `#D4AF37` إلى `#C5A028`
- **Border Bottom:** `border-[#D4AF37]` بسمك `4px`

**Badge الأهمية:**
- **مستعجل:** `bg-red-500 text-white` + 🔴
- **عادي:** `bg-green-500 text-white` + 🟢

---

### ب. محتوى البطاقة

**Padding:** `p-4`  
**Spacing:** `space-y-3`

---

#### 1. العنوان
```typescript
<h3 className="font-bold text-lg text-[#01411C]">
  {request.title}
</h3>
```

---

#### 2. الموقع
```typescript
<div className="flex items-center gap-2 text-gray-600">
  <MapPin className="w-4 h-4 text-[#D4AF37]" />
  <span className="text-sm">
    {request.city} - {request.districts[0] || 'جميع الأحياء'}
  </span>
</div>
```

**عرض:** المدينة + أول حي فقط (أو "جميع الأحياء" إذا لم يكن هناك أحياء)

---

#### 3. نوع العقار والعملية
```typescript
<div className="space-y-1">
  <div className="flex items-center gap-2">
    <Building2 className="w-4 h-4 text-[#01411C]" />
    <span className="text-sm text-gray-700">
      {request.propertyType} - {request.transactionType}
    </span>
  </div>
  <div className="flex items-center gap-2">
    <Home className="w-4 h-4 text-[#01411C]" />
    <span className="text-sm text-gray-700">
      {request.category}
    </span>
  </div>
</div>
```

**السطر 1:** نوع العقار - نوع العملية  
**السطر 2:** التصنيف

---

#### 4. طريقة الدفع
```typescript
<Badge className="bg-[#01411C] text-white">
  <DollarSign className="w-3 h-3 ml-1" />
  {request.paymentMethod}
</Badge>
```

---

#### 5. عرض الأحياء (إذا وجدت)
```typescript
{request.districts.length > 0 && (
  <div className="pt-2 border-t">
    <p className="text-xs text-gray-500 mb-2">الأحياء بالترتيب:</p>
    <div className="flex flex-wrap gap-1">
      {request.districts.map((district, idx) => (
        <Badge key={district} variant="outline" className="text-xs">
          {idx + 1}. {district}
        </Badge>
      ))}
    </div>
  </div>
)}
```

**الوظيفة:** يعرض جميع الأحياء مع أرقامها بالترتيب

---

#### 6. أزرار الإجراءات (4 أزرار)

```typescript
<div className="flex gap-2 pt-3 border-t">
```

**زر 1: عرض التفاصيل**
```typescript
<Button 
  size="sm" 
  className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white"
  onClick={() => setSelectedRequest(request)}
>
  <Eye className="w-4 h-4 ml-1" />
  عرض التفاصيل
</Button>
```

**زر 2: العميل** (يظهر فقط إذا كان `customerId` موجود)
```typescript
{request.customerId && onNavigate && (
  <Button 
    size="sm" 
    variant="outline"
    className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4]"
    onClick={() => onNavigate('customer-details', { customerId: request.customerId })}
  >
    <Users className="w-4 h-4 ml-1" />
    العميل
  </Button>
)}
```

**زر 3: تعديل**
```typescript
<Button size="sm" variant="outline">
  <Edit className="w-4 h-4 ml-1" />
  تعديل
</Button>
```

**زر 4: حذف**
```typescript
<Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
  <Trash2 className="w-4 h-4" />
</Button>
```

---

# 5️⃣ Empty State (لا توجد طلبات)

```typescript
{filteredRequests.length === 0 && (
  <div className="text-center py-16">
    <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
      <Search className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-600 mb-2">
      لا توجد طلبات
    </h3>
    <p className="text-gray-500">
      {searchQuery ? 'لم يتم العثور على نتائج' : 'ابدأ بإنشاء طلب جديد'}
    </p>
  </div>
)}
```

---

# 6️⃣ Modal تفاصيل الطلب

**Component:** `Dialog` من Shadcn  
**Open:** `!!selectedRequest`  
**onOpenChange:** `setSelectedRequest(null)`

**Max Width:** `max-w-3xl`  
**Max Height:** `max-h-[90vh]`  
**Overflow:** `overflow-y-auto`

---

## أ. Header Modal

```typescript
<DialogHeader>
  <DialogTitle className="text-2xl font-bold text-[#01411C] flex items-center gap-3">
    <div className={`px-4 py-2 rounded-lg ${
      selectedRequest.urgency === 'مستعجل' 
        ? 'bg-red-500 text-white' 
        : 'bg-green-500 text-white'
    }`}>
      {selectedRequest.urgency === 'مستعجل' ? '🔴' : '🟢'} {selectedRequest.urgency}
    </div>
    تفاصيل الطلب
  </DialogTitle>
  <DialogDescription className="text-gray-600">
    عرض جميع معلومات الطلب بما في ذلك الميزانية والموقع والمواصفات المطلوبة
  </DialogDescription>
</DialogHeader>
```

---

## ب. محتوى Modal (7 أقسام)

**Container:** `space-y-6 mt-4`

---

### 1. Header الذهبي الكبير (الميزانية)

```typescript
<div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] p-6 rounded-xl border-4 border-[#D4AF37] shadow-xl">
  <div className="flex items-center justify-between">
    {/* الميزانية (يسار) */}
    <div>
      <p className="text-white/80 text-sm mb-1">الميزانية المحددة</p>
      <p className="text-white font-bold text-3xl">
        {selectedRequest.budget.toLocaleString('ar-SA')} ريال سعودي
      </p>
    </div>
    
    {/* طريقة الدفع (يمين) */}
    <div className="text-right">
      <p className="text-white/80 text-sm mb-1">طريقة الدفع</p>
      <Badge className="bg-white text-[#01411C] text-lg px-4 py-2">
        {selectedRequest.paymentMethod}
      </Badge>
    </div>
  </div>
</div>
```

**الحجم:** 
- حجم الميزانية: `text-3xl` (أكبر من البطاقة العادية)
- Border: `border-4` (أكثر سمكاً)

---

### 2. العنوان

```typescript
<div className="bg-white p-4 rounded-lg border-2 border-gray-200">
  <p className="text-xs text-gray-500 mb-1">عنوان الطلب</p>
  <h2 className="text-xl font-bold text-[#01411C]">{selectedRequest.title}</h2>
</div>
```

---

### 3. المعلومات الأساسية (Grid 2×2)

**Grid:** `grid-cols-2 gap-4`

**البطاقة 1: نوع العقار**
```typescript
<div className="bg-gradient-to-br from-[#f0fdf4] to-white p-4 rounded-lg border-2 border-[#01411C]/20">
  <div className="flex items-center gap-2 mb-2">
    <Building2 className="w-5 h-5 text-[#01411C]" />
    <p className="text-xs text-gray-500">نوع العقار</p>
  </div>
  <p className="text-lg font-bold text-[#01411C]">{selectedRequest.propertyType}</p>
</div>
```

**البطاقة 2: نوع العملية**
```typescript
<div className="bg-gradient-to-br from-[#fffef7] to-white p-4 rounded-lg border-2 border-[#D4AF37]/20">
  <div className="flex items-center gap-2 mb-2">
    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
    <p className="text-xs text-gray-500">نوع العملية</p>
  </div>
  <p className="text-lg font-bold text-[#D4AF37]">{selectedRequest.transactionType}</p>
</div>
```

**البطاقة 3: التصنيف**
```typescript
<div className="bg-gradient-to-br from-[#f0fdf4] to-white p-4 rounded-lg border-2 border-[#01411C]/20">
  <div className="flex items-center gap-2 mb-2">
    <Home className="w-5 h-5 text-[#01411C]" />
    <p className="text-xs text-gray-500">التصنيف</p>
  </div>
  <p className="text-lg font-bold text-[#01411C]">{selectedRequest.category}</p>
</div>
```

**البطاقة 4: المدينة**
```typescript
<div className="bg-gradient-to-br from-[#fffef7] to-white p-4 rounded-lg border-2 border-[#D4AF37]/20">
  <div className="flex items-center gap-2 mb-2">
    <MapPin className="w-5 h-5 text-[#D4AF37]" />
    <p className="text-xs text-gray-500">المدينة</p>
  </div>
  <p className="text-lg font-bold text-[#D4AF37]">{selectedRequest.city}</p>
</div>
```

**الألوان:**
- خضري: `from-[#f0fdf4] to-white` + `border-[#01411C]/20`
- ذهبي: `from-[#fffef7] to-white` + `border-[#D4AF37]/20`

---

### 4. الأحياء المفضلة بالترتيب (إذا وجدت)

```typescript
{selectedRequest.districts.length > 0 && (
  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border-2 border-blue-300 shadow-md">
    <div className="flex items-center gap-2 mb-3">
      <MapPin className="w-5 h-5 text-blue-600" />
      <h3 className="font-bold text-blue-800">الأحياء المفضلة بالترتيب</h3>
    </div>
    <p className="text-xs text-blue-600 mb-3">
      ⚠️ البحث سيبدأ من الحي الأول ثم الثاني ثم الثالث حسب الترتيب
    </p>
    <div className="flex flex-wrap gap-3">
      {selectedRequest.districts.map((district, idx) => (
        <div 
          key={district}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <span className="bg-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            {idx + 1}
          </span>
          <span className="font-medium">{district}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

**الألوان:** أزرق (`blue-600`, `blue-50`)  
**الوظيفة:** يعرض الأحياء مع أرقامها داخل دوائر بيضاء

---

### 5. الوصف (إذا وجد)

```typescript
{selectedRequest.description && (
  <div className="bg-gray-50 p-5 rounded-lg border-2 border-gray-200">
    <p className="text-xs text-gray-500 mb-2">ملاحظات إضافية</p>
    <p className="text-gray-700 leading-relaxed">{selectedRequest.description}</p>
  </div>
)}
```

---

### 6. معلومات إضافية (تاريخ + حالة)

```typescript
<div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-300">
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <p className="text-gray-500 mb-1">تاريخ الإنشاء</p>
      <p className="font-medium text-gray-800">
        {selectedRequest.createdAt.toLocaleDateString('ar-SA')}
      </p>
    </div>
    <div>
      <p className="text-gray-500 mb-1">حالة الطلب</p>
      <Badge className={
        selectedRequest.status === 'active' 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-500 text-white'
      }>
        {selectedRequest.status === 'active' ? 'نشط' : 'مكتمل'}
      </Badge>
    </div>
  </div>
</div>
```

**الحالات:**
- **نشط:** `bg-green-500 text-white`
- **مكتمل:** `bg-gray-500 text-white`

---

### 7. أزرار الإجراءات (3 أزرار)

```typescript
<div className="flex gap-3 pt-4 border-t-2 border-gray-200">
  {/* زر تعديل */}
  <Button 
    className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white py-3"
  >
    <Edit className="w-5 h-5 ml-2" />
    تعديل الطلب
  </Button>
  
  {/* زر حذف */}
  <Button 
    variant="outline" 
    className="px-6 text-red-600 border-red-600 hover:bg-red-50"
  >
    <Trash2 className="w-5 h-5 ml-2" />
    حذف
  </Button>
  
  {/* زر إغلاق */}
  <Button 
    variant="outline" 
    className="px-6"
    onClick={() => setSelectedRequest(null)}
  >
    إغلاق
  </Button>
</div>
```

---

# 🎉 انتهى توثيق RequestsPage

## ✅ ما تم توثيقه بالكامل:

1. ✅ Props والـ States (5 states)
2. ✅ Types الكاملة (9 types)
3. ✅ Header (عنوان + زر إنشاء)
4. ✅ نموذج إنشاء الطلب (11 حقل)
   - عنوان الطلب
   - درجة الأهمية (2 زر)
   - المدينة (20 خيار)
   - الأحياء (Multi-Select - حتى 3)
   - نوع العقار (9 خيارات)
   - نوع العملية (2 زر)
   - التصنيف (2 زر)
   - الميزانية
   - طريقة الدفع (2 زر)
   - ملاحظات
   - أزرار (إنشاء + إلغاء)
5. ✅ شريط البحث والفلترة
6. ✅ بطاقة الطلب الكاملة (6 أقسام + 4 أزرار)
7. ✅ Empty State
8. ✅ Modal تفاصيل الطلب (7 أقسام + 3 أزرار)
9. ✅ جميع الألوان والأحجام
10. ✅ جميع onClick handlers
11. ✅ جميع الأيقونات

**الملف جاهز 100%!**