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
<div className