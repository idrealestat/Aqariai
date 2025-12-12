# 📋 ملخص حرفي كامل - ملف CUSTOMER_SYSTEMS_COMPLETE_PROMPT.md

## 📄 معلومات الملف
- **الاسم**: `CUSTOMER_SYSTEMS_COMPLETE_PROMPT.md`
- **الحجم**: 1060 سطر
- **الغرض**: توثيق حرفي 100% لـ 3 أنظمة من صفحة تفاصيل العميل

---

## 🎯 الأنظمة الثلاثة المغطاة

### 1️⃣ الملاحظات المحسنة (Enhanced Notes)
- **الموقع**: السطر 1497-1576 في `CustomerDetailsWithSlides-Enhanced.tsx`
- **الميزات**: السحب والإفلات، عنوان + نص، ترتيب ديناميكي

### 2️⃣ نظام المهام (Tasks System)
- **الموقع**: السطر 1626-1740
- **الميزات**: 4 أولويات، نجمة مفضلة، إكمال/إلغاء

### 3️⃣ المستندات المالية (Financial Documents)
- **الموقع**: السطر 1742-1759
- **الأنواع**: سند قبض + عرض سعر

---

## 📊 هيكل الملف الحرفي

```
المقدمة (السطور 1-26)
├── نظرة عامة
├── المعلومات الأساسية
└── الملف والموقع

النظام 1: الملاحظات المحسنة (السطور 27-319)
├── Interface (EnhancedNote)
├── State Management
├── الكود الحرفي الكامل (80 سطر)
├── الدوال (3 دوال)
│   ├── handleAddEnhancedNote
│   ├── handleUpdateEnhancedNote
│   └── handleDeleteEnhancedNote
├── السحب والإفلات (3 دوال)
│   ├── handleDragStart
│   ├── handleDragOver
│   └── handleDragEnd
└── التنسيق والألوان

النظام 2: نظام المهام (السطور 320-612)
├── Interface (Task)
├── PRIORITY_CONFIG (4 أولويات)
├── الكود الحرفي الكامل (114 سطر)
├── الدوال (2 دوال)
│   ├── toggleTaskComplete
│   └── toggleTaskFavorite
├── نجمة المفضلة الكبيرة
├── الترتيب (المفضلة أولاً)
├── التنسيق الديناميكي
└── نافذة إضافة مهمة

النظام 3: المستندات المالية (السطور 613-1012)
├── Interfaces (InvoiceItem + UserData)
├── الكود الحرفي للبطاقة (18 سطر)
├── نافذة اختيار النوع (quotation/receipt)
├── نافذة التحرير
├── الدوال (3 دوال)
│   ├── addItem
│   ├── removeItem
│   └── updateItem
├── حفظ المستند (handleSaveDocument)
├── معاينة المستند
└── CSS الطباعة

الملخص النهائي (السطور 1013-1060)
├── النسبة المئوية (100%)
└── النتيجة النهائية
```

---

## 1️⃣ الملاحظات المحسنة - التفاصيل الحرفية

### Interface
```typescript
interface EnhancedNote {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  attachments?: DocumentFile[];
  order: number;
}
```

### States
```typescript
const [enhancedNotes, setEnhancedNotes] = useState<EnhancedNote[]>(customer.enhancedNotes || []);
const [draggedNoteIndex, setDraggedNoteIndex] = useState<number | null>(null);
```

### الألوان
- **Border**: `border-2 border-[#D4AF37]` (ذهبي)
- **Header**: `bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]` (تدرج)
- **Background**: `bg-gradient-to-r from-green-50 to-emerald-50` (أخضر فاتح)
- **Hover**: `hover:border-[#D4AF37]`

### الأيقونات
- **العنوان**: `<FileText className="w-5 h-5 text-[#D4AF37]" />`
- **السحب**: `<GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />`
- **رفع**: `<Upload className="w-3 h-3" />`
- **حذف**: `<Trash2 className="w-3 h-3" />`

### الدوال (6 دوال)

#### 1. handleAddEnhancedNote
```typescript
const handleAddEnhancedNote = () => {
  const newNote: EnhancedNote = {
    id: Date.now().toString(),
    title: 'ملاحظة جديدة',
    text: '',
    createdAt: new Date(),
    attachments: [],
    order: enhancedNotes.length
  };
  setEnhancedNotes([...enhancedNotes, newNote]);
};
```

#### 2. handleUpdateEnhancedNote
```typescript
const handleUpdateEnhancedNote = (id: string, updates: Partial<EnhancedNote>) => {
  setEnhancedNotes(enhancedNotes.map(note => 
    note.id === id ? { ...note, ...updates } : note
  ));
};
```

#### 3. handleDeleteEnhancedNote
```typescript
const handleDeleteEnhancedNote = (id: string) => {
  setEnhancedNotes(enhancedNotes.filter(note => note.id !== id));
};
```

#### 4. handleDragStart
```typescript
const handleDragStart = (index: number) => {
  setDraggedNoteIndex(index);
};
```

#### 5. handleDragOver
```typescript
const handleDragOver = (e: React.DragEvent, index: number) => {
  e.preventDefault();
  if (draggedNoteIndex === null || draggedNoteIndex === index) return;

  const newNotes = [...enhancedNotes];
  const draggedNote = newNotes[draggedNoteIndex];
  newNotes.splice(draggedNoteIndex, 1);
  newNotes.splice(index, 0, draggedNote);
  
  setEnhancedNotes(newNotes.map((note, i) => ({ ...note, order: i })));
  setDraggedNoteIndex(index);
};
```

#### 6. handleDragEnd
```typescript
const handleDragEnd = () => {
  setDraggedNoteIndex(null);
};
```

### الربط في HTML
```tsx
<div
  draggable
  onDragStart={() => handleDragStart(index)}
  onDragOver={(e) => handleDragOver(e, index)}
  onDragEnd={handleDragEnd}
  className={`... ${draggedNoteIndex === index ? 'opacity-50 scale-95' : ''}`}
>
```

### التأثيرات البصرية
- **أثناء السحب**: `opacity-50 scale-95` (شفافية 50% + تصغير 5%)
- **Cursor**: `cursor-move` (يد السحب)

### حقول الإدخال

#### العنوان
```tsx
<Input
  value={note.title}
  onChange={(e) => handleUpdateEnhancedNote(note.id, { title: e.target.value })}
  className="font-bold border-0 bg-transparent p-0 focus:ring-0"
  placeholder="عنوان الملاحظة"
/>
```

#### النص
```tsx
<Textarea
  value={note.text}
  onChange={(e) => handleUpdateEnhancedNote(note.id, { text: e.target.value })}
  className="border-green-200 bg-white min-h-[80px]"
  placeholder="اكتب ملاحظتك هنا..."
/>
```

---

## 2️⃣ نظام المهام - التفاصيل الحرفية

### Interface
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'urgent-important' | 'important' | 'urgent' | 'normal';
  completed: boolean;
  favorite: boolean;
}
```

### PRIORITY_CONFIG
```typescript
const PRIORITY_CONFIG = {
  'urgent-important': { label: 'هام وعاجل', color: 'bg-red-100 text-red-700 border-red-300' },
  'important': { label: 'هام وغير عاجل', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  'urgent': { label: 'غير هام وعاجل', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  'normal': { label: 'غير هام وغير عاجل', color: 'bg-green-100 text-green-700 border-green-300' }
};
```

### الألوان الجانبية (Priority Borders)

| الأولوية | اللون الإنجليزي | الكود الحرفي |
|----------|-----------------|---------------|
| هام وعاجل | Red | `border-l-4 border-l-[#FF0000]` |
| هام وغير عاجل | Orange | `border-l-4 border-l-[#FFA500]` |
| غير هام وعاجل | Yellow | `border-l-4 border-l-[#FFFF00]` |
| غير هام وغير عاجل | Blue | `border-l-4 border-l-[#0000FF]` |

### نجمة المفضلة الكبيرة
```tsx
{task.favorite && !task.completed && (
  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg animate-pulse">
    <Star className="w-4 h-4 fill-white text-white" />
  </div>
)}
```

**الخصائص:**
- **الموقع**: `absolute -top-2 -right-2` (أعلى اليمين خارج البطاقة)
- **الحجم**: `w-8 h-8` (32×32px)
- **اللون**: `bg-[#D4AF37]` (ذهبي)
- **الأنيميشن**: `animate-pulse` (نبض مستمر)
- **الشرط**: `favorite && !completed` (مفضلة وغير مكتملة)
- **الظل**: `shadow-lg`
- **الأيقونة**: `w-4 h-4 fill-white text-white`

### الدوال

#### toggleTaskComplete
```typescript
const toggleTaskComplete = (id: string) => {
  setTasks(tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  ));
};
```

**الأيقونات:**
```tsx
{task.completed ? (
  <CheckCircle2 className="w-6 h-6 text-green-600" />
) : (
  <Circle className="w-6 h-6 text-gray-400 hover:text-[#01411C]" />
)}
```

#### toggleTaskFavorite
```typescript
const toggleTaskFavorite = (id: string) => {
  setTasks(tasks.map(task =>
    task.id === id ? { ...task, favorite: !task.favorite } : task
  ));
};
```

**الأيقونات:**
```tsx
<Star
  className={`w-5 h-5 ${
    task.favorite ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-400 hover:text-[#D4AF37]'
  }`}
/>
```

### الترتيب (Sorting)
```typescript
tasks
  .sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return 0;
  })
```

**المنطق:**
1. المفضلة (`favorite = true`) تظهر أولاً
2. غير المفضلة تظهر بعدها
3. نفس الحالة → نفس الترتيب

### التنسيق الديناميكي

#### الخلفية
```tsx
className={`${
  task.completed ? 'bg-gray-50 border-gray-300 opacity-75' : 'bg-white'
}`}
```

#### الظل
```tsx
style={{
  boxShadow: task.favorite && !task.completed ? '0 4px 12px rgba(212, 175, 55, 0.2)' : 'none'
}}
```

#### النص
```tsx
className={`font-bold text-base ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
```

---

## 3️⃣ المستندات المالية - التفاصيل الحرفية

### Interfaces

#### InvoiceItem
```typescript
interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}
```

#### UserData
```typescript
interface UserData {
  name: string;
  companyName: string;
  falLicense: string;
  phone: string;
  profileImage: string;
  logoImage: string;
  coverImage: string;
}
```

### States
```typescript
const [docType, setDocType] = useState<'receipt' | 'quotation' | null>(null);
const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', description: '', amount: 0 }]);
const [vat, setVat] = useState(15);
const [showPreview, setShowPreview] = useState(false);

const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
const vatAmount = (subtotal * vat) / 100;
const total = subtotal + vatAmount;
```

### نافذة اختيار النوع

```tsx
<div className="grid grid-cols-2 gap-4">
  {/* عرض سعر */}
  <button
    onClick={() => setDocType('quotation')}
    className="p-6 border-2 border-[#D4AF37] rounded-lg hover:bg-gradient-to-r hover:from-[#fffef7] hover:to-[#f0fdf4] transition-all"
  >
    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
    <p className="font-bold">عرض سعر</p>
  </button>
  
  {/* سند قبض */}
  <button
    onClick={() => setDocType('receipt')}
    className="p-6 border-2 border-[#D4AF37] rounded-lg hover:bg-gradient-to-r hover:from-[#fffef7] hover:to-[#f0fdf4] transition-all"
  >
    <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
    <p className="font-bold">سند قبض</p>
  </button>
</div>
```

**الخيارات:**
| النوع | الأيقونة | اللون | `docType` |
|-------|----------|-------|-----------|
| عرض سعر | `FileText` | أزرق | `'quotation'` |
| سند قبض | `DollarSign` | أخضر | `'receipt'` |

### الدوال

#### 1. addItem
```typescript
const addItem = () => {
  setItems([...items, { id: Date.now().toString(), description: '', amount: 0 }]);
};
```

#### 2. removeItem
```typescript
const removeItem = (id: string) => {
  if (items.length > 1) {
    setItems(items.filter(item => item.id !== id));
  }
};
```

#### 3. updateItem
```typescript
const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
  setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
};
```

### handleSaveDocument
```typescript
const handleSaveDocument = () => {
  const document = {
    id: Date.now().toString(),
    type: docType,
    customerName,
    customerPhone,
    items,
    vat,
    subtotal,
    vatAmount,
    total,
    createdAt: new Date()
  };
  
  // حفظ في localStorage
  const storageKey = `financial_documents_${customerPhone}`;
  const existingDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');
  localStorage.setItem(storageKey, JSON.stringify([...existingDocs, document]));
  
  // طباعة
  setShowPreview(true);
};
```

**المفتاح في localStorage:** `financial_documents_{customerPhone}`

### معاينة المستند

#### العنوان
```tsx
<h3 className="text-2xl font-bold text-center mb-6 text-[#01411C]">
  {docType === 'quotation' ? 'عرض سعر' : 'سند قبض'}
</h3>
```

#### معلومات العميل
```tsx
<div className="mb-6 p-4 bg-gray-50 rounded-lg text-right" dir="rtl">
  <p className="font-bold text-right">العميل: {customerName}</p>
  <p className="text-right">الجوال: {customerPhone}</p>
</div>
```

#### جدول البنود
```tsx
<table className="w-full mb-6" dir="rtl">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 text-right">الوصف</th>
      <th className="p-2 text-right">المبلغ</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item: InvoiceItem) => (
      <tr key={item.id} className="border-b">
        <td className="p-2 text-right">{item.description}</td>
        <td className="p-2 text-right">{item.amount.toFixed(2)} ريال</td>
      </tr>
    ))}
  </tbody>
</table>
```

#### المجاميع
```tsx
<div className="space-y-2 mb-6 text-right" dir="rtl">
  <div className="flex justify-between">
    <span>الإجمالي قبل الضريبة:</span>
    <span className="font-bold">{subtotal.toFixed(2)} ريال</span>
  </div>
  <div className="flex justify-between">
    <span>ضريبة القيمة المضافة ({vat}%):</span>
    <span className="font-bold">{vatAmount.toFixed(2)} ريال</span>
  </div>
  <div className="flex justify-between text-xl font-bold text-[#01411C] border-t-2 pt-2">
    <span>المجموع النهائي:</span>
    <span>{total.toFixed(2)} ريال</span>
  </div>
</div>
```

#### أزرار الطباعة
```tsx
<div className="flex gap-2">
  <Button onClick={() => window.print()} className="flex-1 bg-[#01411C]">
    <Download className="w-4 h-4 ml-2" />
    طباعة
  </Button>
  <Button onClick={onClose} variant="outline" className="flex-1">
    إغلاق
  </Button>
</div>
```

### CSS الطباعة
```css
@media print {
  /* إخفاء الأزرار */
  button { display: none; }
  
  /* تحسين المظهر */
  body { background: white; }
  
  /* حجم الصفحة */
  @page { size: A4; }
}
```

---

## ✅ الملخص النهائي

### النسبة المئوية للتطابق

| النظام | عدد الحقول | النسبة | الحالة |
|--------|------------|--------|--------|
| 1. الملاحظات المحسنة | 3 حقول + سحب | **100%** | ✅ موثق بالكامل |
| 2. نظام المهام | 8 خصائص | **100%** | ✅ موثق بالكامل |
| 3. المستندات المالية | 2 نوع + 3 دوال | **100%** | ✅ موثق بالكامل |

**المتوسط الإجمالي: 100%** ✅

### النتيجة النهائية

#### 1️⃣ الملاحظات المحسنة
- ✅ السحب والإفلات الكامل (3 دوال)
- ✅ عنوان + نص + تاريخ
- ✅ ترتيب ديناميكي (`order`)
- ✅ تأثيرات بصرية (opacity + scale)
- ✅ حفظ في `customer.enhancedNotes`

#### 2️⃣ نظام المهام
- ✅ 4 مستويات أولوية (خط جانبي ملون)
- ✅ نظام المفضلة (نجمة ذهبية نابضة)
- ✅ إكمال/إلغاء إكمال
- ✅ ترتيب (المفضلة أولاً)
- ✅ ظل ذهبي للمفضلة
- ✅ حفظ في `customer.customerTasks`

#### 3️⃣ المستندات المالية
- ✅ نوعان (عرض سعر + سند قبض)
- ✅ بنود متعددة (إضافة/حذف/تحديث)
- ✅ ضريبة القيمة المضافة ديناميكية
- ✅ معاينة احترافية للطباعة
- ✅ حفظ في localStorage
- ✅ بيانات الوسيط (صورة + شعار + غلاف)

---

## 📦 الملفات المرتبطة

1. **الملف الرئيسي**: `/components/CustomerDetailsWithSlides-Enhanced.tsx`
2. **عدد الأسطر**: ~3500+ سطر
3. **السلايد**: "معلومات عامة" (GeneralInfoSlide)
4. **السطور**: 681-2000+

---

## 🎨 الألوان الرئيسية المستخدمة

| اللون | الكود | الاستخدام |
|-------|-------|----------|
| أخضر ملكي | `#01411C` | العناوين والأزرار |
| أخضر متوسط | `#065f41` | Hover States |
| ذهبي | `#D4AF37` | الحدود والنجمة |
| أحمر | `#FF0000` | هام وعاجل |
| برتقالي | `#FFA500` | هام وغير عاجل |
| أصفر | `#FFFF00` | غير هام وعاجل |
| أزرق | `#0000FF` | غير هام وغير عاجل |

---

**🎉 هذا الملخص الكامل الحرفي 100% من ملف CUSTOMER_SYSTEMS_COMPLETE_PROMPT.md**
