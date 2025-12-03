# 🎨 **التفاصيل الكاملة لتطبيق عقاري AI - جاهز لـ Lovable.dev**

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║           📱 AQARI AI - COMPLETE UI/UX SPECIFICATIONS 📱                     ║
║                                                                               ║
║   🎯 استخراج كامل من Figma → Lovable.dev                                   ║
║   ⚡ React + TypeScript + Tailwind CSS + Shadcn UI                          ║
║   🎨 نسخة طبق الأصل - جاهزة للبناء الفوري                                  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🎨 **نظام الألوان الرئيسي (Color System)**

### **Primary Colors:**

```css
/* الألوان الرئيسية للتطبيق */
--primary-green: #01411C;           /* أخضر ملكي - اللون الأساسي */
--primary-green-dark: #065f41;      /* أخضر داكن - للـ hover */
--secondary-gold: #D4AF37;          /* ذهبي - اللون الثانوي */

/* درجات الذهبي */
--gold-50: #fffef7;
--gold-100: #fef9e7;
--gold-200: #fdf3cf;
--gold-300: #fbecb7;
--gold-400: #f9e69f;
--gold-500: #D4AF37;      /* Default */
--gold-600: #b8941f;
--gold-700: #9c7a19;
--gold-800: #806013;
--gold-900: #64460d;

/* الألوان الحيادية */
--background: #ffffff;
--foreground: #01411C;
--muted: #f0fdf4;                   /* أخضر فاتح جداً */
--muted-foreground: #065f41;

/* الخلفيات المتدرجة */
--gradient-main: linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%);
--gradient-header: linear-gradient(to right, #01411C, #065f41, #01411C);

/* ألوان الحالات */
--destructive: #d4183d;
--success: #10b981;
--warning: #f59e0b;
--info: #3b82f6;
```

---

### **Semantic Colors:**

```typescript
// في Lovable.dev
const colorSystem = {
  // Primary
  primary: {
    DEFAULT: '#01411C',
    foreground: '#ffffff',
    hover: '#065f41'
  },
  
  // Secondary (Gold)
  secondary: {
    DEFAULT: '#D4AF37',
    foreground: '#01411C',
    50: '#fffef7',
    100: '#fef9e7',
    500: '#D4AF37',
    900: '#64460d'
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#d4183d',
  info: '#3b82f6',
  
  // Account Types (من unified-registration)
  individual: '#10B981',  // أخضر
  team: '#3B82F6',        // أزرق
  office: '#F59E0B',      // برتقالي
  company: '#8B5CF6'      // بنفسجي
}
```

---

## ✏️ **نظام الخطوط (Typography)**

### **Font Families:**

```css
/* النظام الافتراضي مع دعم العربية */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
             'Droid Sans', 'Helvetica Neue', sans-serif;

/* أحجام الخطوط */
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */

/* أوزان الخطوط */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## 📏 **نظام المسافات (Spacing System)**

```css
/* المسافات القياسية */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */

/* Border Radius */
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.625rem;  /* 10px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-3xl: 1.5rem;   /* 24px */
```

---

## 🎭 **نظام الظلال (Shadows)**

```css
/* الظلال المستخدمة */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* ظلال ملونة */
--shadow-green: 0 10px 15px -3px rgba(1, 65, 28, 0.2);
--shadow-gold: 0 10px 15px -3px rgba(212, 175, 55, 0.2);
```

---

## 📱 **1. واجهة التسجيل (Sign Up / Registration)**

### **1.1 اختيار نوع الحساب:**

```typescript
// المكون: UnifiedRegistration
// الموقع: /components/unified-registration.tsx

interface AccountType {
  id: 'individual' | 'team' | 'office' | 'company';
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
  supportsTeam: boolean;
  maxUsers: number;
  teamFeatures: string[];
}

const accountTypes: AccountType[] = [
  {
    id: 'individual',
    label: 'فرد',
    icon: User,  // من lucide-react
    description: 'وسيط عقاري يعمل بشكل مستقل',
    color: '#10B981',  // أخضر
    supportsTeam: false,
    maxUsers: 1,
    teamFeatures: []
  },
  {
    id: 'team',
    label: 'فريق',
    icon: Users,
    description: 'مجموعة صغيرة من الوسطاء يعملون معاً',
    color: '#3B82F6',  // أزرق
    supportsTeam: true,
    maxUsers: 5,
    teamFeatures: [
      'إدارة أساسية للزملاء',
      'مشاركة العملاء',
      'تقارير الفريق'
    ]
  },
  {
    id: 'office',
    label: 'مكتب',
    icon: Building,
    description: 'مكتب عقاري متكامل',
    color: '#F59E0B',  // برتقالي
    supportsTeam: true,
    maxUsers: 20,
    teamFeatures: [
      'إدارة متقدمة للموظفين',
      'صلاحيات متدرجة',
      'تقارير شاملة'
    ]
  },
  {
    id: 'company',
    label: 'شركة',
    icon: Building2,
    description: 'شركة عقارية كبرى متعددة الفروع',
    color: '#8B5CF6',  // بنفسجي
    supportsTeam: true,
    maxUsers: 100,
    teamFeatures: [
      'إدارة شاملة للشركة',
      'متعدد الفروع',
      'تحليلات متقدمة'
    ]
  }
];
```

---

### **تصميم بطاقة نوع الحساب:**

```tsx
// Card Component للاختيار
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="relative"
>
  <Card 
    className={`
      cursor-pointer transition-all duration-300
      border-2 hover:shadow-xl
      ${selected ? 'border-[color] bg-[color]/5' : 'border-gray-200'}
    `}
    onClick={() => handleSelect(type.id)}
  >
    <CardContent className="p-6">
      {/* أيقونة */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${type.color}20` }}
      >
        <type.icon 
          className="w-8 h-8"
          style={{ color: type.color }}
        />
      </div>
      
      {/* العنوان */}
      <h3 className="text-xl font-bold mb-2">
        {type.label}
      </h3>
      
      {/* الوصف */}
      <p className="text-gray-600 text-sm mb-4">
        {type.description}
      </p>
      
      {/* الميزات (إذا كان يدعم فريق) */}
      {type.supportsTeam && (
        <div className="space-y-2">
          <Badge variant="secondary">
            حتى {type.maxUsers} مستخدم
          </Badge>
          <ul className="text-xs text-gray-500">
            {type.teamFeatures.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* مؤشر الاختيار */}
      {selected && (
        <div className="absolute top-4 left-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
      )}
    </CardContent>
  </Card>
</motion.div>
```

---

### **1.2 نموذج التسجيل (Registration Form):**

```typescript
// الحقول المطلوبة
interface RegistrationFormData {
  // معلومات أساسية
  name: string;              // الاسم الكامل
  email: string;             // البريد الإلكتروني
  phone: string;             // رقم الجوال (05xxxxxxxx)
  whatsapp: string;          // رقم الواتساب
  birthDate: string;         // تاريخ الميلاد (YYYY-MM-DD)
  
  // معلومات الشركة/المكتب (اختياري حسب النوع)
  companyName?: string;      // اسم الشركة/المكتب
  licenseNumber?: string;    // رقم الرخصة
  
  // الموقع
  city: string;              // المدينة (dropdown)
  district: string;          // الحي
  
  // الصور
  profileImage?: string;     // صورة الملف الشخصي
  licenseImage?: string;     // صورة الرخصة
}

// المدن السعودية (Dropdown Options)
const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
  'الدمام', 'الخبر', 'الظهران', 'الطائف', 'بريدة',
  'خميس مشيط', 'حفر الباطن', 'المبرز', 'الهفوف',
  'حائل', 'نجران', 'الجبيل', 'ينبع', 'القطيف',
  'صفوى', 'العلا', 'سكاكا', 'عرعر', 'تبوك',
  'أبها', 'الباحة', 'جازان', 'القنفذة', 'الوجه'
];
```

---

### **تصميم النموذج:**

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  {/* الاسم الكامل */}
  <div className="space-y-2">
    <Label htmlFor="name">
      الاسم الكامل *
    </Label>
    <Input
      id="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="أدخل اسمك الكامل"
      className="text-right"
      required
    />
    {errors.name && (
      <p className="text-sm text-red-500">{errors.name}</p>
    )}
  </div>

  {/* البريد الإلكتروني */}
  <div className="space-y-2">
    <Label htmlFor="email">
      البريد الإلكتروني *
    </Label>
    <Input
      id="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="example@email.com"
      className="text-right"
      required
    />
    {errors.email && (
      <p className="text-sm text-red-500">{errors.email}</p>
    )}
  </div>

  {/* رقم الجوال */}
  <div className="space-y-2">
    <Label htmlFor="phone">
      رقم الجوال *
    </Label>
    <Input
      id="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="05xxxxxxxx"
      pattern="^05\d{8}$"
      maxLength={10}
      className="text-right"
      required
    />
    <p className="text-xs text-gray-500">
      يجب أن يبدأ بـ 05 ويكون 10 أرقام
    </p>
    {errors.phone && (
      <p className="text-sm text-red-500">{errors.phone}</p>
    )}
  </div>

  {/* رقم الواتساب */}
  <div className="space-y-2">
    <Label htmlFor="whatsapp">
      رقم الواتساب
    </Label>
    <Input
      id="whatsapp"
      value={formData.whatsapp}
      onChange={handleChange}
      placeholder="05xxxxxxxx"
      className="text-right"
    />
  </div>

  {/* تاريخ الميلاد */}
  <div className="space-y-2">
    <Label htmlFor="birthDate">
      تاريخ الميلاد *
    </Label>
    <Input
      id="birthDate"
      type="date"
      value={formData.birthDate}
      onChange={handleChange}
      className="text-right"
      required
    />
  </div>

  {/* المدينة (Dropdown) */}
  <div className="space-y-2">
    <Label>المدينة *</Label>
    <Select
      value={formData.city}
      onValueChange={(value) => handleCitySelect(value)}
    >
      <SelectTrigger className="text-right">
        <SelectValue placeholder="اختر المدينة" />
      </SelectTrigger>
      <SelectContent>
        {SAUDI_CITIES.map(city => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* الحي */}
  <div className="space-y-2">
    <Label htmlFor="district">
      الحي *
    </Label>
    <Input
      id="district"
      value={formData.district}
      onChange={handleChange}
      placeholder="أدخل اسم الحي"
      className="text-right"
      required
    />
  </div>

  {/* اسم الشركة (إذا كان النوع ليس فرد) */}
  {userType !== 'individual' && (
    <div className="space-y-2">
      <Label htmlFor="companyName">
        اسم {userType === 'team' ? 'الفريق' : userType === 'office' ? 'المكتب' : 'الشركة'} *
      </Label>
      <Input
        id="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="أدخل الاسم"
        className="text-right"
        required
      </Input>
    </div>
  )}

  {/* رقم الرخصة */}
  <div className="space-y-2">
    <Label htmlFor="licenseNumber">
      رقم الرخصة
    </Label>
    <Input
      id="licenseNumber"
      value={formData.licenseNumber}
      onChange={handleChange}
      placeholder="رقم رخصة فال"
      className="text-right"
    />
  </div>

  {/* رفع صورة الملف الشخصي */}
  <div className="space-y-2">
    <Label>صورة الملف الشخصي</Label>
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('profile-upload')?.click()}
      >
        <Upload className="w-4 h-4 ml-2" />
        رفع صورة
      </Button>
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  </div>

  {/* زر التسجيل */}
  <div className="flex gap-4">
    <Button
      type="button"
      variant="outline"
      onClick={onBack}
      className="flex-1"
    >
      <ArrowRight className="w-4 h-4 ml-2" />
      رجوع
    </Button>
    <Button
      type="submit"
      className="flex-1 bg-[#01411C] hover:bg-[#065f41]"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />
          جاري التسجيل...
        </>
      ) : (
        <>
          <ArrowLeft className="w-4 h-4 ml-2" />
          متابعة
        </>
      )}
    </Button>
  </div>
</form>
```

---

### **Validation Rules:**

```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};

  // الاسم
  if (!formData.name.trim()) {
    errors.name = 'الاسم الكامل مطلوب';
  }

  // البريد الإلكتروني
  if (!formData.email.trim()) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'البريد الإلكتروني غير صحيح';
  }

  // رقم الجوال
  if (!formData.phone.trim()) {
    errors.phone = 'رقم الجوال مطلوب';
  } else if (!/^05\d{8}$/.test(formData.phone)) {
    errors.phone = 'رقم الجوال يجب أن يبدأ بـ 05 ويكون 10 أرقام';
  }

  // تاريخ الميلاد
  if (!formData.birthDate) {
    errors.birthDate = 'تاريخ الميلاد مطلوب';
  }

  // المدينة
  if (!formData.city) {
    errors.city = 'المدينة مطلوبة';
  }

  // الحي
  if (!formData.district.trim()) {
    errors.district = 'الحي مطلوب';
  }

  // اسم الشركة (إذا لم يكن فرد)
  if (userType !== 'individual' && !formData.companyName?.trim()) {
    errors.companyName = 'الاسم مطلوب';
  }

  return errors;
};
```

---

## 💎 **3. الباقات (Pricing Plans)**

### **3.1 باقات الأفراد:**

```typescript
const individualPlans = [
  {
    id: 'bronze',
    name: 'البداية',
    icon: Sparkles,
    price: '0',
    period: 'مجاني للأبد',
    popular: false,
    description: 'مثالي للوسطاء الجدد',
    color: '#CD7F32',  // برونزي
    features: [
      'إدارة 5 عقارات',
      'قاعدة بيانات 20 عميل',
      'تقويم أساسي',
      '500 ميجا تخزين',
      'نشر على منصة واحدة',
      'دعم فني أساسي',
      'تطبيق الموبايل',
      'تقارير شهرية'
    ],
    ctaText: 'ابدأ مجاناً'
  },
  {
    id: 'silver',
    name: 'المحترف',
    icon: Crown,
    price: '149',
    period: 'شهرياً',
    popular: true,  // الباقة الأكثر شيوعاً
    description: 'للوسطاء النشطين',
    color: '#C0C0C0',  // فضي
    features: [
      'إدارة 50 عقار',
      'قاعدة بيانات 200 عميل',
      'تقويم متقدم + تذكيرات',
      '5 جيجا تخزين',
      'نشر على 5 منصات',
      'AI وصف العقارات',
      'تقارير أسبوعية',
      'إحصائيات متقدمة',
      'دعم فني مميز',
      'تكامل WhatsApp Business',
      'بطاقة عمل رقمية',
      'حاسبة التمويل'
    ],
    ctaText: 'اختر هذه الباقة'
  },
  {
    id: 'gold',
    name: 'الخبير',
    icon: Star,
    price: '299',
    period: 'شهرياً',
    popular: false,
    description: 'للوسطاء المتمرسين',
    color: '#FFD700',  // ذهبي
    features: [
      'عقارات غير محدودة',
      'عملاء غير محدودين',
      'تقويم ذكي + أتمتة',
      '20 جيجا تخزين',
      'نشر على جميع المنصات',
      'AI متقدم للأسعار والوصف',
      'تقارير يومية',
      'تحليلات السوق',
      'دعم فني أولوية',
      'موقع شخصي مخصص',
      'تكامل CRM متقدم',
      'أدوات التسويق الرقمي'
    ],
    ctaText: 'اختر هذه الباقة'
  }
];
```

---

### **3.2 باقات الفرق:**

```typescript
const teamPlans = [
  {
    id: 'dark',
    name: 'الفريق الأساسي',
    icon: Users,
    price: '399',
    period: 'شهرياً',
    popular: false,
    description: 'للفرق الصغيرة (2-5 أعضاء)',
    features: [
      'حتى 5 أعضاء فريق',
      'إدارة 100 عقار مشترك',
      'قاعدة بيانات 500 عميل',
      'تقويم مشترك للفريق',
      '10 جيجا تخزين مشترك',
      'لوحة تحكم موحدة',
      'تقارير الفريق',
      'إدارة المهام الجماعية',
      'دردشة الفريق الداخلية',
      'صلاحيات متدرجة',
      'تتبع أداء الأعضاء',
      'دعم فني للفريق'
    ]
  },
  {
    id: 'royal',
    name: 'الفريق المتقدم',
    icon: Crown,
    price: '699',
    period: 'شهرياً',
    popular: true,
    description: 'للفرق النشطة (5-15 عضو)',
    features: [
      'حتى 15 عضو فريق',
      'عقارات غير محدودة',
      'عملاء غير محدودين',
      'تقويم ذكي للفريق',
      '50 جيجا تخزين',
      'CRM متقدم للفريق',
      'أتمتة سير العمل',
      'تقارير تفصيلية بالأعضاء',
      'نظام المهام الذكي',
      'إدارة العمولات الجماعية',
      'تكامل منصات التواصل',
      'تحليلات أداء الفريق',
      'دعم فني أولوية',
      'تدريب مخصص للفريق'
    ]
  }
];
```

---

### **تصميم بطاقة الباقة:**

```tsx
<Card 
  className={`
    relative overflow-hidden transition-all duration-300
    ${plan.popular 
      ? 'border-4 border-[#D4AF37] shadow-2xl scale-105' 
      : 'border-2 border-gray-200 hover:border-[#01411C]'
    }
  `}
>
  {/* Badge الشعبية */}
  {plan.popular && (
    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#D4AF37] to-[#b8941f] text-white px-4 py-1 rounded-bl-lg">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 fill-white" />
        <span className="text-sm font-bold">الأكثر شعبية</span>
      </div>
    </div>
  )}

  <CardHeader className="text-center pb-4">
    {/* الأيقونة */}
    <div className="flex justify-center mb-4">
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${plan.color}20` }}
      >
        <plan.icon 
          className="w-10 h-10"
          style={{ color: plan.color }}
        />
      </div>
    </div>

    {/* الاسم */}
    <CardTitle className="text-2xl font-bold mb-2">
      {plan.name}
    </CardTitle>

    {/* الوصف */}
    <p className="text-gray-600 text-sm mb-4">
      {plan.description}
    </p>

    {/* السعر */}
    <div className="mb-4">
      <div className="flex items-baseline justify-center gap-2">
        {plan.price === '0' ? (
          <span className="text-4xl font-bold text-green-600">
            مجاني
          </span>
        ) : (
          <>
            <span className="text-4xl font-bold text-[#01411C]">
              {plan.price}
            </span>
            <span className="text-xl text-gray-600">
              ريال
            </span>
          </>
        )}
      </div>
      <p className="text-gray-500 text-sm mt-1">
        {plan.period}
      </p>
    </div>
  </CardHeader>

  <CardContent>
    {/* الميزات */}
    <ul className="space-y-3 mb-6">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <span className="text-gray-700 text-sm">
            {feature}
          </span>
        </li>
      ))}
    </ul>

    {/* زر الاختيار */}
    <Button
      onClick={() => handleSelectPlan(plan.id)}
      disabled={isLoading && selectedPlan === plan.id}
      className={`
        w-full h-12
        ${plan.popular 
          ? 'bg-gradient-to-l from-[#D4AF37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#D4AF37] text-white' 
          : 'bg-[#01411C] hover:bg-[#065f41] text-white'
        }
      `}
    >
      {isLoading && selectedPlan === plan.id ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>جاري المعالجة...</span>
        </div>
      ) : (
        plan.ctaText
      )}
    </Button>
  </CardContent>
</Card>
```

---

### **Responsive Layout للباقات:**

```tsx
{/* Grid للباقات */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {plans.map(plan => (
    <PlanCard key={plan.id} plan={plan} />
  ))}
</div>

{/* للموبايل: Slider */}
<div className="md:hidden">
  <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
    {plans.map(plan => (
      <div key={plan.id} className="flex-shrink-0 w-[85%] snap-center">
        <PlanCard plan={plan} />
      </div>
    ))}
  </div>
</div>
```

---

## 🎉 **4. رسالة الترحيب (Welcome Message)**

```tsx
// المكون: SuccessConfirmation
// بعد اختيار الباقة

<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-white">
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="max-w-2xl w-full"
  >
    <Card className="border-4 border-green-500 shadow-2xl">
      <CardContent className="p-8 text-center">
        {/* أيقونة النجاح */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </motion.div>

        {/* العنوان */}
        <h1 className="text-3xl font-bold text-[#01411C] mb-4">
          🎉 مرحباً بك في عقاري AI
        </h1>

        {/* الرسالة */}
        <p className="text-lg text-gray-700 mb-6">
          تم تسجيلك بنجاح! أنت الآن جاهز لبدء رحلتك في عالم الوساطة العقارية الذكية.
        </p>

        {/* معلومات الباقة */}
        <div className="bg-gradient-to-l from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gift className="w-6 h-6 text-[#D4AF37]" />
            <h3 className="text-xl font-bold text-[#01411C]">
              باقتك: {selectedPlan.name}
            </h3>
          </div>
          
          {selectedPlan.price === '0' ? (
            <p className="text-green-600 font-bold">
              ✨ مجانية للأبد
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-[#D4AF37] font-bold">
                🎁 أول شهر مجاني
              </p>
              <p className="text-gray-600">
                بعدها {selectedPlan.price} ريال/شهرياً
              </p>
            </div>
          )}
        </div>

        {/* الخطوات التالية */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-100 mb-6">
          <h4 className="font-bold text-[#01411C] mb-4">
            الخطوات التالية:
          </h4>
          <ul className="space-y-3 text-right">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                1
              </div>
              <span className="text-gray-700">
                استكشف لوحة التحكم الخاصة بك
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                2
              </div>
              <span className="text-gray-700">
                أضف أول عقار لك
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#01411C] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                3
              </div>
              <span className="text-gray-700">
                ابدأ بإدارة عملائك
              </span>
            </li>
          </ul>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 h-12 bg-[#01411C] hover:bg-[#065f41] text-white"
          >
            <Home className="w-5 h-5 ml-2" />
            انتقل إلى لوحة التحكم
          </Button>
          <Button
            onClick={() => onNavigate('help')}
            variant="outline"
            className="flex-1 h-12 border-2 border-[#D4AF37]"
          >
            <HelpCircle className="w-5 h-5 ml-2" />
            شاهد الدليل التعريفي
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</div>
```

---

## 🏠 **5. الواجهة الرئيسية (Main Dashboard)**

### **5.1 الهيدر (Header):**

```tsx
// المكون: SimpleDashboard Header
// Sticky header مع gradient

<header className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
  <div className="container mx-auto px-4 py-2">
    <div className="flex items-center justify-between">
      
      {/* Right: Burger Menu */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setRightMenuOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 bg-white/10 text-white h-9 w-9"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Center: Logo */}
      <div className="flex-1 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
          <Building2 className="w-5 h-5" />
          <span className="font-bold">عقاري</span>
          <span className="font-bold text-[#D4AF37]">AI</span>
          <span className="font-bold">Aqari</span>
        </div>
      </div>

      {/* Left: Icons */}
      <div className="flex items-center gap-2">
        {/* Left Sidebar Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLeftSidebarOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 bg-white/10 text-white"
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
        
        {/* Notifications */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setNotificationsOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 bg-white/10 text-white relative"
        >
          <Bell className="w-5 h-5" />
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </Button>
      </div>
    </div>
  </div>
</header>
```

---

### **مواصفات الهيدر:**

```css
/* Header Styles */
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: linear-gradient(to right, #01411C, #065f41, #01411C);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid #D4AF37;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Logo Container */
.logo-container {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 2px solid #D4AF37;
  backdrop-filter: blur(4px);
}

/* Icon Buttons */
.icon-button {
  border: 2px solid #D4AF37;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 36px;
  height: 36px;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

### **5.2 شريط الأخبار (News Ticker):**

```tsx
// المكون: RealEstateNewsTicker

<div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white py-2 overflow-hidden">
  <div className="flex items-center gap-4">
    {/* أيقونة */}
    <div className="flex items-center gap-2 px-4 flex-shrink-0">
      <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
      <span className="font-bold">آخر الأخبار</span>
    </div>

    {/* الأخبار المتحركة */}
    <div className="flex-1 overflow-hidden">
      <motion.div
        className="flex gap-8"
        animate={{
          x: [0, -1000]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }
        }}
      >
        {news.map((item, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[#D4AF37]">•</span>
            <span>{item.title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
</div>
```

---

### **5.3 بطاقة الملف الشخصي:**

```tsx
// Profile Card في Dashboard

<Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-white to-[#f0fdf4] shadow-xl">
  <CardContent className="p-6">
    <div className="flex items-center justify-between gap-4">
      
      {/* الصورة */}
      <Avatar className="w-16 h-16 border-4 border-[#D4AF37] shadow-lg flex-shrink-0">
        {user.profileImage ? (
          <AvatarImage src={user.profileImage} alt={user.name} />
        ) : (
          <AvatarFallback className="bg-[#01411C] text-white text-xl font-bold">
            {user.name.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>

      {/* المعلومات */}
      <div className="flex-1 text-right">
        <h2 className="text-xl font-bold text-[#01411C] mb-1">
          {user.name}
        </h2>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge 
            className="bg-[#D4AF37] text-[#01411C]"
            style={{ backgroundColor: getUserTypeColor(user.type) }}
          >
            {getUserTypeLabel(user.type)}
          </Badge>
          
          {user.plan && (
            <Badge variant="outline" className="border-[#01411C]">
              {getPlanLabel(user.plan)}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* زر التعديل */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate('settings')}
        className="border-2 border-[#D4AF37]"
      >
        <Settings className="w-4 h-4 ml-2" />
        تعديل
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 📊 **6. الإحصائيات السريعة (Quick Stats)**

```tsx
// Stats Cards في Dashboard

const stats = [
  {
    icon: Home,
    label: 'إجمالي العقارات',
    value: '24',
    change: '+3',
    changeType: 'positive',
    color: '#01411C'
  },
  {
    icon: Users,
    label: 'العملاء',
    value: '156',
    change: '+12',
    changeType: 'positive',
    color: '#3B82F6'
  },
  {
    icon: Calendar,
    label: 'المواعيد',
    value: '8',
    change: '+2',
    changeType: 'positive',
    color: '#F59E0B'
  },
  {
    icon: TrendingUp,
    label: 'الصفقات المكتملة',
    value: '42',
    change: '+5',
    changeType: 'positive',
    color: '#10B981'
  }
];

// Grid للإحصائيات
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat, index) => (
    <Card key={index} className="border-2 border-gray-100 hover:border-[#D4AF37] transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            <stat.icon 
              className="w-6 h-6"
              style={{ color: stat.color }}
            />
          </div>
          
          {stat.change && (
            <Badge 
              variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {stat.change}
            </Badge>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-[#01411C] mb-1">
            {stat.value}
          </p>
          <p className="text-sm text-gray-600">
            {stat.label}
          </p>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

سأكمل الملف في الرد التالي...
