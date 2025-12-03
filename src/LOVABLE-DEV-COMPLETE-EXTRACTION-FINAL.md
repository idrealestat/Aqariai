# 📋 Lovable.dev - دليل الاستخراج الكامل والشامل
## نسخة نهائية - تفاصيل كاملة لبناء نسخة طبق الأصل

---

## 🎯 الهدف
استخراج **كل** المكونات والتفاصيل التقنية من التطبيق الحالي لبناء نسخة **طبق الأصل** في Lovable.dev (React + TypeScript + Tailwind CSS)

---

## 📦 الملفات الرئيسية
```
/App.tsx                              - النقطة الرئيسية للتطبيق
/components/unified-registration.tsx  - واجهة التسجيل
/components/unified-pricing.tsx       - صفحة الباقات
/components/SimpleDashboard-updated.tsx - Dashboard الرئيسي
/components/RightSliderComplete-fixed.tsx - القائمة اليمنى (18 عنصر)
/components/LeftSliderComplete.tsx    - القائمة اليسرى (الأدوات)
/components/DigitalBusinessCardHeader.tsx - رأس بطاقة الأعمال الرقمية
```

---

# 1️⃣ واجهة التسجيل (Sign Up / Login)

## 📍 الملف: `/components/unified-registration.tsx`

### 🎨 التصميم العام
```typescript
// Background Gradient
background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)'

// Colors Palette
الأخضر الملكي: #01411C
الذهبي: #D4AF37
الأخضر الفاتح: #065f41
الأبيض: #ffffff
```

### 📊 أنواع الحسابات (4 أنواع محمية ومقفلة)

#### 🔒 LOCKED - النوع 1: فرد (Individual)
```typescript
{
  id: "individual",
  label: "فرد",
  icon: User,
  description: "وسيط عقاري يعمل بشكل مستقل",
  color: "#10B981",
  supportsTeam: false,
  maxUsers: 1,
  teamFeatures: []
}
```

#### 🔒 LOCKED - النوع 2: فريق (Team)
```typescript
{
  id: "team",
  label: "فريق",
  icon: Users,
  description: "مجموعة صغيرة من الوسطاء يعملون معاً",
  color: "#3B82F6",
  supportsTeam: true,
  maxUsers: 5,
  teamFeatures: [
    "إدارة أساسية للزملاء",
    "مشاركة العملاء",
    "تقارير الفريق"
  ]
}
```

#### 🔒 LOCKED - النوع 3: مكتب (Office)
```typescript
{
  id: "office",
  label: "مكتب",
  icon: Building,
  description: "مكتب عقاري متكامل",
  color: "#F59E0B",
  supportsTeam: true,
  maxUsers: 20,
  teamFeatures: [
    "إدارة متقدمة للموظفين",
    "صلاحيات متدرجة",
    "تقارير شاملة"
  ]
}
```

#### 🔒 LOCKED - النوع 4: شركة (Company)
```typescript
{
  id: "company",
  label: "شركة",
  icon: Building2,
  description: "شركة عقارية كبرى متعددة الفروع",
  color: "#8B5CF6",
  supportsTeam: true,
  maxUsers: 100,
  teamFeatures: [
    "إدارة شاملة للشركة",
    "متعدد الفروع",
    "تحليلات متقدمة"
  ]
}
```

### 📝 الخطوة 1: اختيار نوع الحساب

#### UI Layout (Grid 2x2)
```tsx
{/* الصف الأول: فرد + فريق */}
<div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
  {/* زر فرد */}
  <motion.button
    onClick={() => handleAccountTypeSelect("individual")}
    className="flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-3 min-h-[120px] md:min-h-[140px]"
    style={{
      backgroundColor: selected ? "#01411C" : "#ffffff",
      borderColor: selected ? "#D4AF37" : "#e2e8f0",
      color: selected ? "white" : "#01411C",
      borderWidth: '3px',
      boxShadow: selected 
        ? '0 20px 40px rgba(1, 65, 28, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.3)' 
        : '0 4px 15px rgba(0, 0, 0, 0.1)'
    }}
  >
    <User className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4" />
    <span className="text-base md:text-xl font-bold">فرد</span>
    {selected && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37] mt-2 animate-pulse" />}
  </motion.button>
  
  {/* زر فريق - نفس التصميم */}
</div>

{/* الصف الثاني: مكتب + شركة - نفس التصميم */}
```

#### States & Interactions
```typescript
// Hover State
whileHover={{ scale: 1.02 }}

// Click State
whileTap={{ scale: 0.98 }}

// Selected State
{
  backgroundColor: "#01411C",
  borderColor: "#D4AF37",
  boxShadow: '0 20px 40px rgba(1, 65, 28, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.3)'
}

// Default State
{
  backgroundColor: "#ffffff",
  borderColor: "#e2e8f0",
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
}
```

### 📝 الخطوة 2: بيانات الوسيط

#### حقول النموذج (Form Fields)

##### 1. الاسم الكامل (Name)
```typescript
// Field Definition
{
  id: "name",
  label: "الاسم الكامل *",
  type: "text",
  icon: User,
  placeholder: "أدخل اسمك الكامل",
  required: true,
  validation: {
    required: "الاسم الكامل مطلوب",
    minLength: 2
  }
}

// Input Component
<div>
  <Label htmlFor="name" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
    <User className="w-5 h-5" />
    الاسم الكامل *
  </Label>
  <Input
    id="name"
    value={formData.name}
    onChange={handleInputChange}
    placeholder="أدخل اسمك الكامل"
    className={`text-lg h-14 border-2 ${errors.name ? 'border-red-500' : 'border-[#D4AF37]'}`}
    required
  />
  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
</div>
```

##### 2. البريد الإلكتروني (Email)
```typescript
{
  id: "email",
  label: "البريد الإلكتروني *",
  type: "email",
  icon: Mail,
  placeholder: "example@domain.com",
  required: true,
  validation: {
    required: "البريد الإلكتروني مطلوب",
    pattern: /\S+@\S+\.\S+/,
    patternError: "البريد الإلكتروني غير صحيح"
  }
}
```

##### 3. رقم الجوال (Phone)
```typescript
{
  id: "phone",
  label: "رقم الجوال *",
  type: "tel",
  icon: Phone,
  placeholder: "05xxxxxxxx",
  required: true,
  validation: {
    required: "رقم الجوال مطلوب",
    pattern: /^05\d{8}$/,
    patternError: "رقم الجوال يجب أن يبدأ بـ 05 ويكون 10 أرقام"
  }
}
```

##### 4. تاريخ الميلاد (Birth Date)
```typescript
{
  id: "birthDate",
  label: "تاريخ الميلاد *",
  type: "date",
  icon: Calendar,
  required: true,
  validation: {
    required: "تاريخ الميلاد مطلوب"
  }
}
```

##### 5. المدينة (City)
```typescript
{
  id: "city",
  label: "المدينة *",
  type: "select",
  icon: MapPin,
  required: true,
  options: [
    "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة",
    "الدمام", "الخبر", "الظهران", "الطائف", "بريدة",
    "خميس مشيط", "حفر الباطن", "المبرز", "الهفوف",
    "حائل", "نجران", "الجبيل", "ينبع", "القطيف",
    "صفوى", "العلا", "سكاكا", "عرعر", "تبوك",
    "أبها", "الباحة", "جازان", "القنفذة", "الوجه"
  ],
  validation: {
    required: "المدينة مطلوبة"
  }
}

// Select Component
<Select value={formData.city} onValueChange={handleCitySelect}>
  <SelectTrigger className="h-14 border-2 border-[#D4AF37]">
    <SelectValue placeholder="اختر المدينة" />
  </SelectTrigger>
  <SelectContent className="max-h-60">
    {SAUDI_CITIES.map(city => (
      <SelectItem key={city} value={city}>
        {city}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

##### 6. الحي (District)
```typescript
{
  id: "district",
  label: "الحي *",
  type: "text",
  placeholder: "أدخل اسم الحي",
  required: true,
  validation: {
    required: "الحي مطلوب"
  }
}
```

##### 7. اسم الشركة/المكتب/الفريق (Company Name)
```typescript
// يظهر فقط لـ: team, office, company
{
  id: "companyName",
  label: userType === "company" ? "اسم الشركة *" : 
         userType === "office" ? "اسم المكتب *" : "اسم الفريق *",
  type: "text",
  icon: Building,
  placeholder: "أدخل اسم الشركة/المكتب/الفريق",
  required: true,
  condition: userType !== "individual",
  validation: {
    required: `${label} مطلوب`
  }
}
```

##### 8. رقم الرخصة العقارية (License Number)
```typescript
// يظهر لكل الأنواع ماعدا team
{
  id: "licenseNumber",
  label: "رقم الرخصة العقارية *",
  type: "text",
  placeholder: "أدخل رقم رخصة فال",
  required: true,
  condition: userType !== "team",
  validation: {
    required: "رقم الرخصة العقارية مطلوب"
  }
}
```

##### 9. رقم واتساب (WhatsApp) - اختياري
```typescript
{
  id: "whatsapp",
  label: "رقم واتساب (اختياري)",
  type: "tel",
  placeholder: "05xxxxxxxx",
  required: false,
  hint: "إذا كان مختلف عن رقم الجوال"
}
```

##### 10. صورة البروفايل (Profile Image) - اختياري
```typescript
{
  id: "profileImage",
  label: "صورة البروفايل (اختياري)",
  type: "file",
  accept: "image/*",
  icon: Camera,
  uploadButton: {
    label: "رفع صورة البروفايل",
    className: "border-2 border-[#D4AF37]"
  }
}

// Upload Handler
const handleImageUpload = (type: 'profile' | 'license') => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, profileImage: imageUrl }));
        } else {
          setFormData(prev => ({ ...prev, licenseImage: imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  fileInput.click();
};
```

##### 11. صورة الرخصة (License Image) - اختياري
```typescript
{
  id: "licenseImage",
  label: "صورة الرخصة العقارية (اختياري)",
  type: "file",
  accept: "image/*",
  icon: Upload,
  uploadButton: {
    label: "رفع صورة الرخصة",
    className: "border-2 border-[#D4AF37]"
  }
}
```

### 🎯 Validation Rules

#### Client-Side Validation
```typescript
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Name Validation
  if (!formData.name.trim()) {
    newErrors.name = "الاسم الكامل مطلوب";
  }

  // Email Validation
  if (!formData.email.trim()) {
    newErrors.email = "البريد الإلكتروني مطلوب";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "البريد الإلكتروني غير صحيح";
  }

  // Phone Validation
  if (!formData.phone.trim()) {
    newErrors.phone = "رقم الجوال مطلوب";
  } else if (!/^05\d{8}$/.test(formData.phone)) {
    newErrors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويكون 10 أرقام";
  }

  // Birth Date Validation
  if (!formData.birthDate) {
    newErrors.birthDate = "تاريخ الميلاد مطلوب";
  }

  // City Validation
  if (!formData.city) {
    newErrors.city = "المدينة مطلوبة";
  }

  // District Validation
  if (!formData.district.trim()) {
    newErrors.district = "الحي مطلوب";
  }

  // Company Name Validation (للأنواع: team, office, company)
  if ((userType === "team" || userType === "office" || userType === "company") && !formData.companyName.trim()) {
    const label = userType === "company" ? "اسم الشركة" : 
                 userType === "office" ? "اسم المكتب" : "اسم الفريق";
    newErrors.companyName = `${label} مطلوب`;
  }

  // License Number Validation (للأنواع ماعدا team)
  if (userType !== "team" && !formData.licenseNumber.trim()) {
    newErrors.licenseNumber = "رقم الرخصة العقارية مطلوب";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 📊 Progress Indicator

```tsx
{/* شريط التقدم - خطوتين */}
<div className="flex items-center justify-center mb-8">
  <div className="flex items-center space-x-4 space-x-reverse">
    {/* الخطوة 1 */}
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300 ${
      currentStep >= 1 ? 'bg-[#01411C] border-[#D4AF37] text-white shadow-lg' : 'border-gray-300 text-gray-300'
    }`}>
      {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
    </div>
    
    {/* الخط الفاصل */}
    <div className={`w-16 h-2 rounded-full transition-all duration-500 ${
      currentStep > 1 ? 'bg-[#01411C]' : 'bg-gray-300'
    }`}></div>
    
    {/* الخطوة 2 */}
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300 ${
      currentStep >= 2 ? 'bg-[#01411C] border-[#D4AF37] text-white shadow-lg' : 'border-gray-300 text-gray-300'
    }`}>
      2
    </div>
  </div>
</div>
```

### 🎬 Animations

```typescript
// Framer Motion Variants
const pageTransition = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.3 }
}

// Button Hover Animation
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Icon Rotation on Hover
whileHover={{ rotate: 360, scale: 1.1 }}
transition={{ duration: 0.6 }}

// Badge Pulse Animation
className="animate-pulse"
```

### 🎨 Buttons

#### زر التسجيل (Submit Button)
```tsx
<Button
  onClick={handleSubmit}
  className="w-full h-14 font-bold border-2 text-lg bg-[#01411C] text-white border-[#D4AF37] hover:bg-[#065f41]"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      جاري التسجيل...
    </div>
  ) : (
    <>
      <CheckCircle className="w-5 h-5 ml-2" />
      إتمام التسجيل
    </>
  )}
</Button>
```

#### زر العودة (Back Button)
```tsx
<Button
  onClick={() => setCurrentStep(1)}
  variant="outline"
  className="h-12 border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
>
  <ArrowRight className="w-5 h-5 ml-2" />
  العودة
</Button>
```

### 🎁 عرض ترحيبي
```tsx
{/* شارة العرض المميز */}
<motion.div 
  className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full border-2"
  style={{
    background: 'linear-gradient(135deg, #01411C 0%, #065f41 100%)',
    borderColor: '#D4AF37',
    color: 'white',
    boxShadow: '0 4px 15px rgba(1, 65, 28, 0.3)'
  }}
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  <Crown className="w-5 h-5" style={{ color: '#D4AF37' }} />
  <span className="font-bold text-lg">🎉 أول شهر مجاني لجميع الباقات</span>
</motion.div>
```

---

# 2️⃣ صفحة الباقات (Pricing Plans)

## 📍 الملف: `/components/unified-pricing.tsx`

### 🎨 التصميم العام
```typescript
// Background
background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)"

// Grid Layout - متجاوب
className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
```

### 📦 الباقات حسب نوع الحساب

#### 1. باقات فرد (Individual)

##### باقة البداية (Bronze)
```typescript
{
  id: "bronze",
  name: "البداية",
  icon: Sparkles,
  price: "0",
  period: "مجاني للأبد",
  popular: false,
  description: "مثالي للوسطاء الجدد",
  features: [
    "إدارة 5 عقارات",
    "قاعدة بيانات 20 عميل",
    "تقويم أساسي",
    "500 ميجا تخزين",
    "نشر على منصة واحدة",
    "دعم فني أساسي",
    "تطبيق الموبايل",
    "تقارير شهرية"
  ],
  ctaText: "ابدأ مجاناً"
}
```

##### باقة المحترف (Silver) ⭐ الأكثر شيوعاً
```typescript
{
  id: "silver",
  name: "المحترف",
  icon: Crown,
  price: "149",
  period: "شهرياً",
  popular: true, // ⭐ Badge: "الأكثر شيوعاً"
  description: "للوسطاء النشطين",
  features: [
    "إدارة 50 عقار",
    "قاعدة بيانات 200 عميل",
    "تقويم متقدم + تذكيرات",
    "5 جيجا تخزين",
    "نشر على 5 منصات",
    "AI وصف العقارات",
    "تقارير أسبوعية",
    "إحصائيات متقدمة",
    "دعم فني مميز",
    "تكامل WhatsApp Business",
    "بطاقة عمل رقمية",
    "حاسبة التمويل"
  ],
  ctaText: "اختر هذه الباقة"
}
```

##### باقة الخبير (Gold)
```typescript
{
  id: "gold",
  name: "الخبير",
  icon: Star,
  price: "299",
  period: "شهرياً",
  popular: false,
  description: "للوسطاء المتمرسين",
  features: [
    "عقارات غير محدودة",
    "عملاء غير محدودين",
    "تقويم ذكي + أتمتة",
    "20 جيجا تخزين",
    "نشر على جميع المنصات",
    "AI متقدم للأسعار والوصف",
    "تقارير يومية",
    "تحليلات السوق",
    "دعم فني أولوية",
    "موقع شخصي مخصص",
    "تكامل CRM متقدم",
    "أدوات التسويق الرقمي"
  ],
  ctaText: "اختر هذه الباقة"
}
```

#### 2. باقات فريق (Team)

##### الفريق الأساسي (Dark)
```typescript
{
  id: "dark",
  name: "الفريق الأساسي",
  icon: Users,
  price: "399",
  period: "شهرياً",
  popular: false,
  description: "للفرق الصغيرة (2-5 أعضاء)",
  features: [
    "حتى 5 أعضاء فريق",
    "إدارة 100 عقار مشترك",
    "قاعدة بيانات 500 عميل",
    "تقويم مشترك للفريق",
    "10 جيجا تخزين مشترك",
    "لوحة تحكم موحدة",
    "تقارير الفريق",
    "إدارة المهام الجماعية",
    "دردشة الفريق الداخلية",
    "صلاحيات متدرجة",
    "تتبع أداء الأعضاء",
    "دعم فني للفريق"
  ],
  ctaText: "اختر هذه الباقة"
}
```

##### الفريق المتقدم (Royal) ⭐
```typescript
{
  id: "royal",
  name: "الفريق المتقدم",
  icon: Crown,
  price: "699",
  period: "شهرياً",
  popular: true,
  description: "للفرق النشطة (5-15 عضو)",
  features: [
    "حتى 15 عضو فريق",
    "عقارات غير محدودة",
    "عملاء غير محدودين",
    "تقويم ذكي للفريق",
    "50 جيجا تخزين",
    "CRM متقدم للفريق",
    "أتمتة سير العمل",
    "تقارير تفصيلية بالأعضاء",
    "نظام المهام الذكي",
    "إدارة العمولات الجماعية",
    "تكامل منصات التواصل",
    "تحليلات أداء الفريق",
    "دعم فني أولوية",
    "تدريب مخصص للفريق"
  ],
  ctaText: "اختر هذه الباقة"
}
```

##### المؤسسة (Enterprise)
```typescript
{
  id: "enterprise",
  name: "المؤسسة",
  icon: Building,
  price: "سعر مخصص",
  period: "حسب الحاجة",
  popular: false,
  description: "للفرق الكبيرة (+15 عضو)",
  features: [
    "أعضاء غير محدودين",
    "حلول مخصصة بالكامل",
    "تكامل مع أي نظام",
    "دعم فني مخصص",
    "تدريب شامل",
    "استشارات نمو الأعمال"
  ],
  ctaText: "طلب عرض سعر مخصص"
}
```

#### 3. باقات مكتب (Office)

##### المكتب القياسي (Copper)
```typescript
{
  id: "copper",
  name: "المكتب القياسي",
  icon: Building,
  price: "999",
  period: "شهرياً",
  popular: false,
  description: "للمكاتب المتوسطة (10-25 وسيط)",
  features: [
    "حتى 25 وسيط",
    "عقارات غير محدودة",
    "عملاء غير محدودين",
    "نظام إدارة المكتب",
    "100 جيجا تخزين",
    "CRM متكامل للمكتب",
    "نظام العمولات المتقدم",
    "تقارير إدارية شاملة",
    "لوحة تحكم المدير",
    "إدارة الصلاحيات",
    "تتبع أداء الوسطاء",
    "نظام الحوافز والمكافآت",
    "تكامل المحاسبة",
    "دعم فني مخصص",
    "موقع المكتب المخصص"
  ],
  ctaText: "اختر هذه الباقة"
}
```

##### المكتب المتميز (Gold Light) ⭐
```typescript
{
  id: "goldlight",
  name: "المكتب المتميز",
  icon: Crown,
  price: "1799",
  period: "شهرياً",
  popular: true,
  description: "للمكاتب الكبيرة (25-50 وسيط)",
  features: [
    "حتى 50 وسيط",
    "عقارات وعملاء غير محدودين",
    "نظام إدارة متقدم",
    "500 جيجا تخزين",
    "AI لتحليل السوق",
    "أتمتة كاملة للعمليات",
    "تقارير تنفيذية متطورة",
    "نظام الموافقات والمراجعة",
    "إدارة فروع متعددة",
    "تكامل مع الأنظمة المحاسبية",
    "تحليلات السوق المحلي",
    "نظام التدريب والتأهيل",
    "دعم فني مميز 24/7",
    "استشارات نمو الأعمال",
    "تخصيص كامل للنظام",
    "تطبيق مخصص للمكتب"
  ],
  ctaText: "اختر هذه الباقة"
}
```

##### المؤسسة المتقدمة (Office Enterprise)
```typescript
{
  id: "office_enterprise",
  name: "المؤسسة المتقدمة",
  icon: Building2,
  price: "سعر مخصص",
  period: "حسب الحاجة",
  popular: false,
  description: "للمكاتب الضخمة (+50 وسيط)",
  features: [
    "وسطاء غير محدودين",
    "حلول مخصصة بالكامل",
    "تكامل مع أي نظام",
    "دعم فني مخصص",
    "تدريب مؤسسي شامل",
    "استشارات تحول رقمي"
  ],
  ctaText: "طلب عرض سعر مخصص"
}
```

#### 4. باقات شركة (Company)

##### الشركات (Silver Company)
```typescript
{
  id: "silver",
  name: "الشركات",
  icon: Building2,
  price: "2999",
  period: "شهرياً",
  popular: false,
  description: "للشركات الكبيرة (50-100 وسيط)",
  features: [
    "حتى 100 وسيط",
    "عقارات وعملاء غير محدودين",
    "نظام إدارة المؤسسة",
    "1 تيرابايت تخزين",
    "تحليلات AI متقدمة",
    "أتمتة شاملة للعمليات",
    "تقارير مجلس الإدارة",
    "إدارة محافظ استثمارية",
    "نظام الفروع والأقسام",
    "تكامل أنظمة ERP",
    "تحليلات سوق شاملة",
    "نظام تدريب مؤسسي",
    "إدارة المخاطر",
    "دعم فني مخصص",
    "استشارات استراتيجية",
    "حلول مخصصة",
    "SLA مضمون"
  ],
  ctaText: "اختر هذه الباقة"
}
```

##### المؤسسة المتقدمة (Gold Dark) ⭐
```typescript
{
  id: "golddark",
  name: "المؤسسة المتقدمة",
  icon: Building2,
  price: "سعر مخصص",
  period: "حسب الحاجة",
  popular: true,
  description: "للمؤسسات الضخمة (وسطاء غير محدودين)",
  features: [
    "وسطاء غير محدودين",
    "حلول مخصصة بالكامل",
    "نظام إدارة المؤسسة",
    "تخزين غير محدود",
    "AI وتعلم آلي مخصص",
    "تطوير ميزات خاصة",
    "تقارير مخصصة",
    "تكامل مع أي نظام",
    "إدارة مناطق جغرافية",
    "نظام فرانشايز",
    "تحليلات سوق عالمية",
    "تدريب مؤسسي شامل",
    "إدارة مخاطر متقدمة",
    "فريق دعم مخصص",
    "استشارات تحول رقمي",
    "ضمان SLA 99.9%",
    "أمان مؤسسي متقدم",
    "نشر سحابي خاص"
  ],
  ctaText: "طلب عرض سعر مخصص"
}
```

### 🎨 تصميم البطاقة (Card Design)

```tsx
<Card className={`
  h-full relative overflow-hidden flex flex-col
  ${plan.popular ? 'border-4 border-[#D4AF37] shadow-2xl' : 'border-2 border-gray-200'}
  ${isSelected ? 'ring-4 ring-[#D4AF37]/30' : ''}
  transition-all duration-300
`}>
  
  {/* شارة الشائع */}
  {plan.popular && (
    <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#01411C] px-4 py-2 text-sm font-bold rounded-bl-lg z-10">
      <div className="flex items-center gap-1">
        <Crown className="w-4 h-4" />
        الأكثر شيوعاً
      </div>
    </div>
  )}

  {/* شارة المجاني */}
  {plan.price === "0" && (
    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg z-10">
      مجاني تماماً!
    </div>
  )}

  {/* محتوى البطاقة */}
  <div className="p-6 flex-1 flex flex-col">
    {/* رأس البطاقة */}
    <CardHeader className="text-center pt-0 pb-4">
      {/* أيقونة دائرية */}
      <motion.div 
        className="mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 mb-4"
        style={{ 
          borderColor: plan.popular ? "#D4AF37" : "#e5e7eb",
          background: plan.popular ? "linear-gradient(135deg, #f0fdf4 0%, #D4AF37 100%)" : "#f9fafb"
        }}
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#01411C]" />
      </motion.div>
      
      {/* اسم الباقة */}
      <CardTitle className="text-lg md:text-xl font-bold text-[#01411C] mb-2">
        {plan.name}
      </CardTitle>
      
      {/* سبيكة الباقة */}
      <div className="flex justify-center mb-3">
        <SubscriptionTierSlab
          accountType={userType}
          tierLevel={getTierLevel(plan.id)}
          label={plan.name}
          compact={true}
          animated={true}
        />
      </div>
      
      {/* الوصف */}
      <p className="text-sm text-gray-600 mb-4">
        {plan.description}
      </p>
      
      {/* السعر */}
      <div className="mb-4">
        {!isCustomPrice ? (
          <>
            <div className="text-3xl md:text-4xl font-extrabold" style={{ color: "#01411C" }}>
              {plan.price}
              {plan.price !== "0" && (
                <span className="text-lg text-gray-600 mr-2">ريال</span>
              )}
            </div>
            <div className="text-sm text-[#D4AF37] font-medium mt-1">
              {plan.period}
            </div>
          </>
        ) : (
          <>
            <div className="text-xl md:text-2xl font-bold text-[#01411C]">
              سعر مخصص
            </div>
            <div className="text-sm text-[#D4AF37] font-medium mt-1">
              حسب احتياجاتك
            </div>
          </>
        )}
      </div>
    </CardHeader>

    {/* الميزات */}
    <CardContent className="pt-0 flex-1">
      <div className="max-h-64 overflow-y-auto hide-scrollbar">
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, i) => (
            <motion.li 
              key={i} 
              className="flex items-start gap-2 text-gray-700"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.02 * i }}
            >
              <div className="mt-1 text-[#01411C] bg-green-100 rounded-full p-1 flex-shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <div className="text-sm leading-5">{feature}</div>
            </motion.li>
          ))}
        </ul>
      </div>
    </CardContent>
  </div>

  {/* زر الاشتراك */}
  <div className="p-6 pt-0 mt-auto">
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={() => handleSelect(plan.id)}
        className={`
          w-full h-12 font-bold border-2 text-base rounded-xl
          ${plan.popular 
            ? 'bg-[#01411C] text-white border-[#D4AF37] hover:bg-[#065f41]' 
            : 'bg-white text-[#01411C] border-[#D4AF37] hover:bg-[#f0fdf4]'
          }
          transition-all duration-200
        `}
        disabled={isSelected || isLoading}
      >
        {isSelected && isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            جاري المعالجة...
          </div>
        ) : (
          plan.ctaText
        )}
      </Button>
    </motion.div>
    
    {/* نص إضافي */}
    {plan.price === "0" && (
      <p className="text-xs text-center text-gray-500 mt-2">
        بدون الحاجة لبطاقة ائتمانية
      </p>
    )}
    {isCustomPrice && (
      <p className="text-xs text-center text-gray-500 mt-2">
        تواصل مباشر مع فريق المبيعات
      </p>
    )}
  </div>
</Card>
```

### 🎁 قسم "لماذا تختار وسِيطي؟"

```tsx
<div className="mt-12">
  <div className="bg-white rounded-xl p-6 border-2 border-[#D4AF37] shadow-lg">
    <h3 className="text-xl font-bold text-[#01411C] mb-6 text-center">
      لماذا تختار وسِيطي؟
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ميزة 1: ضمان 30 يوم */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="font-semibold text-[#01411C] mb-2">ضمان 30 يوم</h4>
        <p className="text-sm text-gray-600">استرداد كامل للمال</p>
      </div>
      
      {/* ميزة 2: تفعيل فوري */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <h4 className="font-semibold text-[#01411C] mb-2">تفعيل فوري</h4>
        <p className="text-sm text-gray-600">ابدأ في نفس اللحظة</p>
      </div>
      
      {/* ميزة 3: دعم فني 24/7 */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
          <Headphones className="w-6 h-6 text-yellow-600" />
        </div>
        <h4 className="font-semibold text-[#01411C] mb-2">دعم فني 24/7</h4>
        <p className="text-sm text-gray-600">مساعدة على مدار الساعة</p>
      </div>
      
      {/* ميزة 4: نمو مضمون */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>
        <h4 className="font-semibold text-[#01411C] mb-2">نمو مضمون</h4>
        <p className="text-sm text-gray-600">زيادة مبيعاتك 300%</p>
      </div>
    </div>
  </div>
</div>
```

---

# 3️⃣ Dashboard الرئيسي

## 📍 الملف: `/components/SimpleDashboard-updated.tsx`

### 🎨 التصميم العام

```typescript
// Container
<div 
  dir="rtl" 
  className="min-h-screen transition-all duration-300"
  style={{
    background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)",
    marginLeft: leftSidebarOpen ? "350px" : "0"
  }}
>
```

### 🎯 Header (الهيدر)

```tsx
<header 
  className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg"
>
  <div className="container mx-auto px-4 py-2">
    <div className="flex items-center justify-between">
      {/* اليمين: Burger Menu */}
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

      {/* الوسط: Logo */}
      <div className="flex-1 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
          <Building2 className="w-5 h-5" />
          <span className="font-bold">عقاري</span>
          <span className="font-bold text-[#D4AF37]">AI</span>
          <span className="font-bold">Aqari</span>
        </div>
      </div>

      {/* اليسار: Left Sidebar + Bell */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLeftSidebarOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 bg-white/10 text-white"
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setNotificationsOpen(true)}
          className="border-2 border-[#D4AF37] hover:bg-white/20 bg-white/10 text-white relative"
        >
          <Bell className="w-5 h-5" />
          {/* مؤشر إشعارات جديدة */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </Button>
      </div>
    </div>
  </div>
</header>
```

### 📰 شريط الأخبار العقارية
```tsx
<RealEstateNewsTicker />
// Component منفصل: /components/RealEstateNewsTicker.tsx
```

### 👤 بطاقة البروفايل

```tsx
<Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-white to-[#f0fdf4] shadow-xl">
  <CardContent className="p-6">
    <div className="flex items-center justify-between gap-4">
      {/* الصورة - أقصى اليمين */}
      <Avatar className="w-16 h-16 border-4 border-[#D4AF37] shadow-lg flex-shrink-0">
        <AvatarFallback className="bg-[#01411C] text-white text-xl font-bold">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      {/* الاسم والشركة - المنتصف */}
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold text-[#01411C] text-right">
          مرحباً، {user.name}
        </h1>
        {user.companyName && (
          <p className="text-sm md:text-base text-gray-600 text-right">
            {user.companyName}
          </p>
        )}
      </div>

      {/* النجوم - أقصى اليسار */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= (user.rating || 4) ? "text-[#D4AF37] fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs md:text-sm text-gray-600">({user.rating || 4.0})</span>
      </div>
    </div>
  </CardContent>
</Card>
```

### 🎯 الخدمات الرئيسية (Services Grid)

#### عدد الخدمات: 8 خدمات
#### التخطيط: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

##### 🔒 الخدمة #1 - منصتي (Dashboard Main 252)
```tsx
<Card 
  onClick={() => onNavigate("dashboard-main-252")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge: النظام الجديد */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
        النظام الجديد
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Component className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">منصتي</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      نظام متكامل مع CRM وإحصائيات متقدمة وإدارة العقارات
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("dashboard-main-252") → /components/DashboardMainView252.tsx
```

##### 🔒 الخدمة #2 - النشر على المنصات (Property Upload 31)
```tsx
<Card 
  onClick={() => onNavigate("property-upload-complete")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Globe className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">النشر على المنصات</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      انشر عقاراتك على منصتك الخاصه وعلى المنصات العقارية من مكان واحد
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("property-upload-complete") → /components/property-upload-complete.tsx
```

##### 🔒 الخدمة #3 - إدارة العملاء (Customer Management 72)
```tsx
<Card 
  onClick={() => onNavigate("customer-management-72")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge: جديد */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
        جديد
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41] shadow-lg">
      <Users className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">إدارة العملاء</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      نظام كانبان متقدم لإدارة العملاء مع السحب والإفلات
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("customer-management-72") → /components/EnhancedBrokerCRM-with-back.tsx
```

##### الخدمة #4 - العروض والطلبات (Marketplace)
```tsx
<Card 
  onClick={() => onNavigate("marketplace-page")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge: جديد - متحرك */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] text-xs animate-pulse">
        جديد
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41] shadow-lg">
      <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">العروض والطلبات</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      واصل مع الملاك والباحثين عن عقارات وقدم خدماتك
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("marketplace-page") → /components/marketplace/MarketplacePage.tsx
```

##### 🔒 الخدمة #5 - تحليلات السوق
```tsx
<Card 
  onClick={() => onNavigate("analytics-dashboard")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">تحليلات السوق</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      اكتشف اتجاهات السوق العقاري
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("analytics-dashboard") → /components/AnalyticsDashboard.tsx
```

##### 🔒 الخدمة #6 - الفرص الذكية
```tsx
<Card 
  onClick={() => onNavigate("smart-matches")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
    {/* Badge: ذكاء اصطناعي */}
    <div className="absolute top-2 right-2">
      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
        ✨ ذكاء اصطناعي
      </Badge>
    </div>
    
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Sparkles className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">الفرص الذكية</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      تطابق ذكي بين عروضك وطلباتك مع الوسطاء الآخرين
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("smart-matches") → /components/SmartMatches.tsx
```

##### 🔒 الخدمة #7 - التقويم والمواعيد (259)
```tsx
<Card 
  onClick={() => onNavigate("calendar-system-complete")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Calendar className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">التقويم والمواعيد</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      جدولة المواعيد والمعاينات مع العملاء
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("calendar-system-complete") → /components/calendar-system-complete.tsx
```

##### الخدمة #8 - حاسبة سريعة
```tsx
<Card 
  onClick={() => onNavigate("quick-calculator")}
  className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
>
  <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
    {/* الأيقونة */}
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
      <Calculator className="w-8 h-8 text-[#D4AF37]" />
    </div>
    
    {/* العنوان */}
    <h3 className="font-bold text-[#01411C] mb-2">حاسبة سريعة</h3>
    
    {/* الوصف */}
    <p className="text-sm text-gray-600 leading-relaxed">
      حساب العمولة المساحة، ومسطح البناء
    </p>
  </CardContent>
</Card>

// Navigation Handler
onNavigate("quick-calculator") → /components/QuickCalculator.tsx
```

### 📊 Stats Box (صندوق الإحصائيات)

```tsx
<Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-white via-[#f0fdf4] to-white shadow-xl">
  <CardContent className="p-6">
    {/* Grid الإحصائيات - 4 خانات */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      {/* مهام جديدة */}
      <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
        <div className="text-sm text-gray-600">مهام جديدة</div>
      </div>
      
      {/* أنشطة */}
      <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
        <div className="text-sm text-gray-600">أنشطة</div>
      </div>
      
      {/* عملاء جدد */}
      <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
        <div className="text-sm text-gray-600">عملاء جدد</div>
      </div>
      
      {/* إشعارات */}
      <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
        <div className="text-sm text-gray-600">إشعارات</div>
      </div>
    </div>

    {/* أزرار الإجراءات السريعة */}
    <div className="flex items-center justify-center gap-8">
      {/* اتصال */}
      <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white rounded-lg p-3 transition-colors">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#01411C]">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-[#01411C]">اتصال</span>
      </div>
      
      {/* رسالة */}
      <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white rounded-lg p-3 transition-colors">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#01411C]">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-[#01411C]">رسالة</span>
      </div>
      
      {/* موعد */}
      <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white rounded-lg p-3 transition-colors" onClick={() => onNavigate("calendar")}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#01411C] hover:bg-[#065f41] transition-colors">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-[#01411C]">موعد</span>
      </div>
    </div>
  </CardContent>
</Card>
```

---

# 4️⃣ القائمة اليمنى (Right Sidebar)

## 📍 الملف: `/components/RightSliderComplete-fixed.tsx`

### 📊 التخطيط العام

```tsx
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: isOpen ? 0 : "100%" }}
  transition={{ type: "spring", damping: 25 }}
  className="fixed inset-y-0 right-0 w-[380px] md:w-[420px] bg-gradient-to-b from-white via-[#f0fdf4] to-white shadow-2xl z-50 overflow-y-auto border-l-4 border-[#D4AF37]"
  dir="rtl"
>
```

### 📌 العناصر الـ 18 (Navigation Items)

#### النوع العام للعنصر
```tsx
<div
  key={item.id}
  className="flex items-center justify-center text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-[#D4AF37] border-l-4 cursor-pointer hover:shadow-lg transition-all duration-200 group"
  style={{ borderLeftColor: item.color }}
  onClick={() => {
    if (item.path.startsWith('/')) {
      onNavigate(item.path.substring(1));
    } else {
      onNavigate(item.path);
    }
    onClose();
  }}
>
  {/* الأيقونة */}
  <div 
    className="p-2 rounded-lg transition-colors"
    style={{ backgroundColor: `${item.color}15`, color: item.color }}
  >
    <IconComponent className="w-5 h-5" />
  </div>
  
  {/* النص */}
  <div className="flex-1">
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-900 group-hover:text-[#01411C] transition-colors">
        {item.label}
      </span>
      {item.badge && (
        <span className="text-sm">{item.badge}</span>
      )}
    </div>
    {item.description && (
      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
    )}
  </div>
</div>
```

#### القائمة الكاملة (18 عنصر)

```typescript
const navigationItems = [
  // 1. الصفحة الرئيسية
  {
    id: "home",
    label: "الصفحة الرئيسية",
    icon: Home,
    path: "dashboard",
    color: "#01411C",
    description: "العودة للرئيسية"
  },
  
  // 2. بطاقة الأعمال الرقمية
  {
    id: "business-card",
    label: "بطاقة الأعمال الرقمية",
    icon: User,
    path: "business-card-profile",
    color: "#D4AF37",
    description: "عرض ومشاركة بطاقتك"
  },
  
  // 3. إدارة العملاء
  {
    id: "customers",
    label: "إدارة العملاء",
    icon: Users,
    path: "customer-management-72",
    color: "#3B82F6",
    badge: "🔥",
    description: "نظام CRM متقدم"
  },
  
  // 4. التقويم والمواعيد
  {
    id: "calendar",
    label: "التقويم والمواعيد",
    icon: Calendar,
    path: "calendar-system-complete",
    color: "#10B981",
    description: "جدولة المواعيد"
  },
  
  // 5. التحليلات
  {
    id: "analytics",
    label: "التحليلات",
    icon: BarChart3,
    path: "analytics-page",
    color: "#8B5CF6",
    description: "تقارير شاملة"
  },
  
  // 6. الإعدادات
  {
    id: "settings",
    label: "الإعدادات",
    icon: Settings,
    path: "settings",
    color: "#6B7280",
    description: "إعدادات الحساب"
  },
  
  // 7. الإشعارات
  {
    id: "notifications",
    label: "الإشعارات",
    icon: Bell,
    path: "notifications-center-complete",
    color: "#EF4444",
    badge: "3",
    description: "مركز الإشعارات"
  },
  
  // 8. الأرشيف
  {
    id: "archive",
    label: "الأرشيف",
    icon: Archive,
    path: "archive",
    color: "#F59E0B",
    description: "العملاء المؤرشفون"
  },
  
  // 9. الطلبات الخاصة
  {
    id: "special-requests",
    label: "الطلبات الخاصة",
    icon: FileText,
    path: "special-requests",
    color: "#EC4899",
    description: "إدارة الطلبات"
  },
  
  // 10. المساعدة والدعم
  {
    id: "help",
    label: "المساعدة والدعم",
    icon: LifeBuoy,
    path: "help",
    color: "#14B8A6",
    description: "مركز المساعدة"
  },
  
  // 11. الباقات والاشتراك
  {
    id: "subscription",
    label: "الباقات والاشتراك",
    icon: Crown,
    path: "pricing",
    color: "#D4AF37",
    description: "ترقية باقتك"
  },
  
  // 12. إدارة الفريق
  {
    id: "team",
    label: "إدارة الفريق",
    icon: UserPlus,
    path: "team-management",
    color: "#3B82F6",
    description: "إضافة وإدارة الأعضاء"
  },
  
  // 13. الفواتير
  {
    id: "billing",
    label: "الفواتير",
    icon: Receipt,
    path: "billing",
    color: "#10B981",
    description: "إدارة الفواتير"
  },
  
  // 14. مركز التعليم
  {
    id: "learning",
    label: "مركز التعليم",
    icon: BookOpen,
    path: "learning-center",
    color: "#8B5CF6",
    description: "دروس وشروحات"
  },
  
  // 15. الاتصال بنا
  {
    id: "contact",
    label: "الاتصال بنا",
    icon: Headphones,
    path: "contact-us",
    color: "#EF4444",
    description: "تواصل مع الدعم"
  },
  
  // 16. عن التطبيق
  {
    id: "about",
    label: "عن التطبيق",
    icon: Info,
    path: "about",
    color: "#6B7280",
    description: "معلومات التطبيق"
  },
  
  // 17. ما الجديد
  {
    id: "whats-new",
    label: "ما الجديد",
    icon: Lightbulb,
    path: "whats-new",
    color: "#F59E0B",
    badge: "NEW",
    description: "آخر التحديثات"
  },
  
  // 18. تسجيل الخروج
  {
    id: "logout",
    label: "تسجيل الخروج",
    icon: LogOut,
    path: "logout",
    color: "#EF4444",
    description: "الخروج من الحساب"
  }
];
```

### 🎯 الفرق بين العنصر والـ Header

#### العنصر (Navigation Item):
```
- الموقع: داخل القائمة اليمنى
- الملف: RightSliderComplete-fixed.tsx
- النوع: <div> يعمل كزر واحد
- الحجم: صغير (عنصر من 18)
- المحتوى: أيقونة + نص + Badge اختياري
- الوظيفة: التنقل لصفحة معينة عند الضغط
- Border: يسار بلون مميز
- States: Hover, Click
- عدد العناصر: 1 من 18 عنصر
```

#### رأس بطاقة الأعمال (Digital Business Card Header):
```
- الموقع: Right Slider (الهيدر)
- الملف: DigitalBusinessCardHeader.tsx
- النوع: مكون كامل <div>
- الحجم: كبير
- المحتوى:
  - بطاقة قابلة للقلب (Front / Back)
  - أزرار Download: Image, PDF, Print
  - معلومات الاشتراك والرخصة
- الوظيفة: عرض البطاقة مع كل الإجراءات الممكنة
- Border: ذهبي حول البطاقة
- States: Hover, Click, Flip, Download, Print
- عدد العناصر: مكون واحد شامل
```

---

# 5️⃣ Quick Calculator (الحاسبة السريعة)

## 📍 الملف: `/components/QuickCalculator.tsx`

### 🎯 الأنواع (4 أنواع)

#### 1. حاسبة العمولة (Commission Calculator)
```typescript
// الملف: /components/CommissionCalculator.tsx

interface CommissionInputs {
  price: number;      // سعر العقار
  percentage: number; // نسبة العمولة (%)
}

interface CommissionOutputs {
  commission: number;      // العمولة
  priceAfterCommission: number; // السعر بعد العمولة
  vat: number;              // ضريبة القيمة المضافة (15%)
  totalCommission: number;   // إجمالي العمولة مع الضريبة
}

// الحسابات
commission = price * (percentage / 100)
vat = commission * 0.15
totalCommission = commission + vat
priceAfterCommission = price - totalCommission
```

#### 2. حاسبة الأرض (Land Calculator)
```typescript
// الملف: /components/LandCalculator.tsx

interface LandInputs {
  frontWidth: number;   // العرض (متر)
  depth: number;        // العمق (متر)
  pricePerMeter: number; // سعر المتر
}

interface LandOutputs {
  area: number;         // المساحة (متر مربع)
  totalPrice: number;   // إجمالي السعر
  corner: boolean;      // هل الأرض زاوية؟
  cornerBonus: number;  // إضافة الزاوية (إن وجدت)
}

// الحسابات
area = frontWidth * depth
totalPrice = area * pricePerMeter
cornerBonus = corner ? totalPrice * 0.1 : 0 // 10% إضافة للزاوية
```

#### 3. حاسبة مسطح البناء (Building Area Calculator)
```typescript
// الملف: /components/BuildingAreaCalculator.tsx

interface BuildingInputs {
  landArea: number;         // مساحة الأرض (متر مربع)
  buildingPercentage: number; // نسبة البناء (%)
  floors: number;            // عدد الأدوار
}

interface BuildingOutputs {
  buildableArea: number;     // المساحة القابلة للبناء في الدور الواحد
  totalBuildingArea: number; // إجمالي مساحة البناء
  remainingArea: number;     // المساحة المتبقية (فناء)
}

// الحسابات
buildableArea = landArea * (buildingPercentage / 100)
totalBuildingArea = buildableArea * floors
remainingArea = landArea - buildableArea
```

#### 4. الآلة الحاسبة القياسية (Standard Calculator)
```typescript
// الملف: /components/StandardCalculator.tsx

// عمليات أساسية
operations = ['+', '-', '*', '/', '%']

// أزرار
buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['C', '0', '=', '+']
]
```

### 🎨 التصميم الموحد لكل الحاسبات

```tsx
<Card className="border-2 border-[#D4AF37] bg-white shadow-xl">
  <CardHeader>
    <CardTitle className="text-[#01411C] text-center flex items-center justify-center gap-2">
      <Calculator className="w-6 h-6" />
      {calculatorName}
    </CardTitle>
  </CardHeader>
  
  <CardContent className="space-y-4">
    {/* حقول الإدخال */}
    <div className="space-y-3">
      <div>
        <Label className="text-[#01411C] mb-2 block">{fieldLabel}</Label>
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="h-12 border-2 border-[#D4AF37]"
        />
      </div>
    </div>
    
    {/* زر الحساب */}
    <Button
      onClick={calculate}
      className="w-full h-12 bg-[#01411C] text-white border-2 border-[#D4AF37] hover:bg-[#065f41]"
    >
      احسب
    </Button>
    
    {/* النتائج */}
    {result && (
      <div className="mt-4 p-4 bg-[#f0fdf4] rounded-lg border-2 border-[#D4AF37]">
        <h3 className="font-bold text-[#01411C] mb-2">النتيجة:</h3>
        <div className="space-y-1 text-gray-700">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{getLabel(key)}:</span>
              <span className="font-bold">{formatNumber(value)}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </CardContent>
</Card>
```

### 🎯 Validation & Tooltips

```typescript
// Validation Rules
const validate = (inputs: any) => {
  const errors: Record<string, string> = {};
  
  Object.entries(inputs).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) {
      errors[key] = 'هذا الحقل مطلوب';
    }
    if (typeof value === 'number' && value < 0) {
      errors[key] = 'يجب أن تكون القيمة موجبة';
    }
  });
  
  return errors;
};

// Tooltips
const tooltips: Record<string, string> = {
  price: 'أدخل سعر العقار بالريال',
  percentage: 'نسبة العمولة المتفق عليها',
  frontWidth: 'عرض الواجهة بالمتر',
  depth: 'عمق الأرض من الخلف بالمتر',
  pricePerMeter: 'سعر المتر المربع بالريال'
};
```

---

# 6️⃣ رأس بطاقة الأعمال الرقمية

## 📍 الملف: `/components/DigitalBusinessCardHeader.tsx`

### 🎨 التخطيط الكامل

```tsx
<div 
  className="px-4 py-3 pt-6 relative"
  onMouseEnter={() => setShowActions(true)}
  onMouseLeave={() => setShowActions(false)}
>
  {/* أزرار الإجراءات - فوق البطاقة */}
  {showActions && (
    <motion.div
      className="flex justify-center gap-2 mb-2 z-20 relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* زر تحميل صورة */}
      <Button
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
        onClick={(e) => {
          e.stopPropagation();
          handleDownloadImage();
        }}
      >
        <Download className="w-3 h-3 mr-1" />
        صورة
      </Button>
      
      {/* زر تحميل PDF */}
      <Button
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
        onClick={(e) => {
          e.stopPropagation();
          handleDownloadPDF();
        }}
      >
        <Download className="w-3 h-3 mr-1" />
        PDF
      </Button>
      
      {/* زر الطباعة */}
      <Button
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
        onClick={(e) => {
          e.stopPropagation();
          handlePrint();
        }}
      >
        <Printer className="w-3 h-3 mr-1" />
        طباعة
      </Button>
    </motion.div>
  )}

  {/* البطاقة القابلة للقلب */}
  <div 
    className="relative w-full h-[180px] perspective-1000 mb-4"
    onClick={() => setIsFlipped(!isFlipped)}
  >
    <motion.div
      className="relative w-full h-full"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* الوجه الأمامي */}
      <div 
        className="absolute w-full h-full backface-hidden rounded-xl border-4 border-[#D4AF37] shadow-2xl overflow-hidden"
        style={{ 
          backfaceVisibility: "hidden",
          backgroundImage: `url(${logoImage})`,
          backgroundSize: "40%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "white"
        }}
      >
        {/* طبقة شفافة */}
        <div className="absolute inset-0 bg-white/92" />

        <div className="relative z-10 p-3 h-full flex">
          {/* القسم الأيمن: صورة + معلومات */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* صورة البروفايل */}
              <div className="flex items-start gap-2 mb-2">
                <Avatar className="w-12 h-12 border-3 border-[#D4AF37] shadow-lg flex-shrink-0">
                  {displayProfile ? (
                    <AvatarImage src={displayProfile} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-[#01411C] to-[#065f41] text-[#D4AF37] font-bold text-lg">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* معلومات النص */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#01411C] text-base truncate">{displayName}</h3>
                  <p className="text-xs text-gray-600 truncate text-left">{displayJob}</p>
                  <p className="text-xs text-gray-700 font-medium truncate text-left">{displayCompany}</p>
                </div>
              </div>

              {/* معلومات الاتصال - مضغوطة */}
              <div className="space-y-0.5 text-[10px]">
                {displayWebsite && (
                  <div className="flex items-center gap-1 text-[#01411C] truncate">
                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate" dir="ltr">{displayWebsite}</span>
                  </div>
                )}
                {displayEmail && (
                  <div className="flex items-center gap-1 text-gray-700 truncate">
                    <span className="flex-shrink-0">📧</span>
                    <span className="truncate" dir="ltr">{displayEmail}</span>
                  </div>
                )}
                {displayFalLicense && (
                  <div className="flex items-center gap-1 text-gray-700 truncate">
                    <span className="flex-shrink-0">🪪</span>
                    <span className="truncate">رخصة: {displayFalLicense}</span>
                  </div>
                )}
                {displayPhone && (
                  <div className="flex items-center gap-1 text-gray-700 truncate">
                    <span className="flex-shrink-0">📱</span>
                    <span className="truncate" dir="ltr">{displayPhone}</span>
                  </div>
                )}
                {displayWhatsapp && displayWhatsapp !== displayPhone && (
                  <div className="flex items-center gap-1 text-gray-700 truncate">
                    <span className="flex-shrink-0">💬</span>
                    <span className="truncate" dir="ltr">{displayWhatsapp}</span>
                  </div>
                )}
              </div>
            </div>

            {/* شعار عقاري AI صغير - أسفل اليمين */}
            <div className="flex items-center gap-1">
              <img src={logoImage} alt="Logo" className="w-3 h-3 opacity-60" />
            </div>
          </div>

          {/* القسم الأيسر: الباركود */}
          <div className="flex items-end justify-end">
            <div className="bg-white p-1 rounded border border-gray-300">
              <svg width="50" height="50" className="opacity-80">
                {/* محاكاة باركود QR */}
                <rect width="50" height="50" fill="white"/>
                <rect x="4" y="4" width="8" height="8" fill="black"/>
                <rect x="16" y="4" width="8" height="8" fill="black"/>
                <rect x="28" y="4" width="8" height="8" fill="black"/>
                <rect x="40" y="4" width="6" height="8" fill="black"/>
                <rect x="4" y="16" width="8" height="8" fill="black"/>
                <rect x="28" y="16" width="8" height="8" fill="black"/>
                <rect x="4" y="28" width="8" height="8" fill="black"/>
                <rect x="16" y="28" width="8" height="8" fill="black"/>
                <rect x="40" y="28" width="6" height="8" fill="black"/>
                <rect x="4" y="40" width="8" height="6" fill="black"/>
                <rect x="28" y="40" width="8" height="6" fill="black"/>
              </svg>
              <div className="text-[7px] text-center text-gray-500 mt-0.5">vCard</div>
            </div>
          </div>
        </div>
      </div>

      {/* الوجه الخلفي */}
      <div 
        className="absolute w-full h-full backface-hidden rounded-xl border-4 border-[#D4AF37] shadow-2xl overflow-hidden bg-gradient-to-br from-[#01411C] via-[#065f41] to-[#01411C]"
        style={{ 
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)"
        }}
      >
        <div className="relative z-10 p-3 h-full flex flex-col items-center justify-center">
          {/* شعار عقاري AI - أعلى اليمين */}
          <div className="absolute top-2 right-2">
            <img src={logoImage} alt="Aqari AI" className="w-10 h-10 opacity-80" />
          </div>

          {/* شعار الشركة - وسط البطاقة */}
          <div className="flex-1 flex items-center justify-center">
            {displayLogo ? (
              <img 
                src={displayLogo} 
                alt="Company Logo" 
                className="max-w-[180px] max-h-[130px] object-contain"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border-4 border-[#D4AF37] flex items-center justify-center">
                <span className="text-6xl font-bold text-[#D4AF37]">
                  {displayCompany.charAt(0) || displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  </div>

  {/* معلومات الاشتراك والعضوية */}
  <div className="space-y-2 mt-6">
    {/* العضوية + تاريخ انتهاء الاشتراك */}
    <div className="flex items-center justify-between text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
      <div className="flex items-center gap-2">
        <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs">
          {membershipLabel}
        </Badge>
        <span className="text-white/80">العضوية</span>
      </div>
      <div className="text-white/80">
        الاشتراك ينتهي في: {subscriptionExpiry.toLocaleDateString('ar-SA')}
      </div>
    </div>

    {/* الباج الأصلي - SubscriptionTierSlab */}
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md">
        <SubscriptionTierSlab 
          accountType={accountType}
          tierLevel={tierLevel}
          label={tierLabel}
          compact={false}
          animated={true}
        />
      </div>
    </div>

    {/* رخصة فال تنتهي خلال - العد التنازلي */}
    {falExpiry.date && (
      <div className="flex items-center justify-between text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
        <span className="text-white/80">🪪 رخصة فال تنتهي خلال</span>
        <span className={`font-bold ${falExpiry.daysLeft && falExpiry.daysLeft < 60 ? 'text-red-400' : 'text-green-400'}`}>
          {falExpiry.daysLeft ? `${falExpiry.daysLeft} يوم` : 'غير محدد'}
        </span>
      </div>
    )}
  </div>
</div>
```

### 🎯 Functions & Handlers

```typescript
// تحميل كصورة
const handleDownloadImage = () => {
  // استخدام html2canvas لتحويل البطاقة لصورة
  const element = document.getElementById('business-card');
  if (element) {
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = `business-card-${user.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  }
};

// تحميل كـ PDF
const handleDownloadPDF = () => {
  // استخدام jsPDF لتحويل البطاقة لـ PDF
  const pdf = new jsPDF();
  const element = document.getElementById('business-card');
  if (element) {
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
      pdf.save(`business-card-${user.name}.pdf`);
    });
  }
};

// الطباعة
const handlePrint = () => {
  window.print();
};

// قلب البطاقة
const [isFlipped, setIsFlipped] = useState(false);
onClick={() => setIsFlipped(!isFlipped)}
```

---

# 7️⃣ ملخص التصميم والألوان

## 🎨 Color Palette

```css
/* الألوان الرئيسية */
--green-royal: #01411C;      /* الأخضر الملكي */
--gold: #D4AF37;             /* الذهبي */
--green-light: #065f41;      /* الأخضر الفاتح */
--green-bg: #f0fdf4;         /* خلفية خضراء فاتحة */
--gold-bg: #fffef7;          /* خلفية ذهبية فاتحة */
--white: #ffffff;            /* الأبيض */

/* الألوان الإضافية */
--gray-100: #f9fafb;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-600: #6B7280;
--gray-700: #374151;
--gray-900: #111827;

/* الألوان الوظيفية */
--success: #10B981;
--error: #EF4444;
--warning: #F59E0B;
--info: #3B82F6;
--purple: #8B5CF6;
```

## 📐 Spacing & Sizing

```css
/* Padding & Margin */
p-2: 8px
p-3: 12px
p-4: 16px
p-6: 24px
gap-2: 8px
gap-4: 16px
gap-6: 24px

/* Border Radius */
rounded-lg: 8px
rounded-xl: 12px
rounded-2xl: 16px
rounded-full: 9999px

/* Border Width */
border: 1px
border-2: 2px
border-3: 3px
border-4: 4px

/* Font Sizes */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px

/* Heights */
h-7: 28px
h-9: 36px
h-12: 48px
h-14: 56px
h-16: 64px

/* Widths */
w-16: 64px
w-20: 80px
max-w-md: 448px
max-w-2xl: 672px
max-w-4xl: 896px
max-w-7xl: 1280px
```

## 🎬 Animations

```typescript
// Framer Motion - صفحة
const pageVariants = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.3 }
}

// Framer Motion - زر
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Framer Motion - أيقونة
whileHover={{ rotate: 360, scale: 1.1 }}
transition={{ duration: 0.6 }}

// Tailwind - Pulse
className="animate-pulse"

// Tailwind - Spin
className="animate-spin"

// Framer Motion - Slide from Bottom
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: 0.2 }}
```

## 📱 Responsive Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px    /* الهواتف الصغيرة */
md: 768px    /* التابلت */
lg: 1024px   /* الشاشات المتوسطة */
xl: 1280px   /* الشاشات الكبيرة */
2xl: 1536px  /* الشاشات الضخمة */

/* Grid Responsive */
grid-cols-1      /* موبايل: عمود واحد */
md:grid-cols-2   /* تابلت: عمودين */
lg:grid-cols-3   /* شاشة متوسطة: 3 أعمدة */
xl:grid-cols-4   /* شاشة كبيرة: 4 أعمدة */
```

---

# 8️⃣ المكتبات والـ Imports

## 📦 Core Libraries

```typescript
// React
import React, { useState, useEffect, useCallback } from "react";

// Framer Motion (Animation)
import { motion, AnimatePresence } from "motion/react";

// Lucide React (Icons)
import { 
  User, Users, Building, Building2, 
  Crown, Star, CheckCircle, Calendar,
  Phone, Mail, MapPin, Camera, Upload,
  Download, Printer, ExternalLink,
  Menu, Bell, PanelLeft, Globe,
  TrendingUp, Home, Sparkles, Calculator,
  Plus, Component, TreePine
} from "lucide-react";
```

## 🎨 ShadCN Components

```typescript
// UI Components
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Separator } from "./components/ui/separator";
```

## 🛠️ Custom Components

```typescript
// Custom Components
import { SubscriptionTierSlab } from "./components/SubscriptionTierSlab";
import { DigitalBusinessCardHeader } from "./components/DigitalBusinessCardHeader";
import LeftSliderComplete from "./components/LeftSliderComplete";
import RightSliderComplete from "./components/RightSliderComplete-fixed";
import { DashboardProvider, useDashboardContext } from "./context/DashboardContext";
```

---

# 9️⃣ Routes & Navigation

## 🗺️ النظام الكامل للـ Routes

```typescript
const routes: Record<string, string> = {
  // الرئيسية
  "dashboard": "/components/SimpleDashboard-updated.tsx",
  
  // التسجيل والباقات
  "registration": "/components/unified-registration.tsx",
  "pricing": "/components/unified-pricing.tsx",
  
  // منصتي
  "dashboard-main-252": "/components/DashboardMainView252.tsx",
  
  // النشر على المنصات
  "property-upload-complete": "/components/property-upload-complete.tsx",
  
  // إدارة العملاء
  "customer-management-72": "/components/EnhancedBrokerCRM-with-back.tsx",
  "customer-details/:id": "/components/customer-details-page.tsx",
  
  // العروض والطلبات
  "marketplace-page": "/components/marketplace/MarketplacePage.tsx",
  
  // التحليلات
  "analytics-dashboard": "/components/AnalyticsDashboard.tsx",
  "analytics-page": "/components/AnalyticsPage.tsx",
  
  // الفرص الذكية
  "smart-matches": "/components/SmartMatches.tsx",
  
  // التقويم
  "calendar-system-complete": "/components/calendar-system-complete.tsx",
  
  // الحاسبات
  "quick-calculator": "/components/QuickCalculator.tsx",
  "commission-calculator": "/components/CommissionCalculator.tsx",
  "land-calculator": "/components/LandCalculator.tsx",
  "building-area-calculator": "/components/BuildingAreaCalculator.tsx",
  "standard-calculator": "/components/StandardCalculator.tsx",
  
  // بطاقة الأعمال
  "business-card-profile": "/components/business-card-profile.tsx",
  "business-card-edit": "/components/business-card-edit.tsx",
  
  // الإعدادات والدعم
  "settings": "/components/settings.tsx",
  "help": "/components/help.tsx",
  "contact-us": "/components/contact-us.tsx",
  
  // الأرشيف
  "archive": "/components/ArchivePage.tsx",
  
  // الإشعارات
  "notifications-center-complete": "/components/notifications-sidebar.tsx"
};
```

## 🎯 Navigation Handler

```typescript
const handleNavigate = (page: string, options?: { initialTab?: string }) => {
  console.log('🎯 التنقل إلى:', page, options);
  
  // معالجة خاصة للإعدادات مع تبويب مبدئي
  if (page === "settings" && options?.initialTab) {
    setSettingsInitialTab(options.initialTab);
  }
  
  // معالجة خاصة للنشر على المنصات مع تبويب مبدئي
  if (page === "property-upload-complete" && options?.initialTab) {
    setPropertyUploadInitialTab(options.initialTab);
  }
  
  // تحديث الصفحة النشطة في Context
  setActivePage(page);
  
  // تحديث الصفحة الحالية
  setCurrentPage(page);
};
```

---

# 🔟 States & Context

## 🧠 Dashboard Context

```typescript
interface DashboardContextType {
  // الصفحة النشطة
  activePage: string;
  setActivePage: (page: string) => void;
  
  // العميل النشط
  activeCustomer: any | null;
  setActiveCustomer: (customer: any) => void;
  
  // العرض النشط
  activeOffer: any | null;
  setActiveOffer: (offer: any) => void;
  
  // الطلب النشط
  activeRequest: any | null;
  setActiveRequest: (request: any) => void;
  
  // التبويب النشط
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // المستخدم الحالي
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  
  // حالة الـ Sidebars
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
}

// Provider
<DashboardProvider>
  <App />
</DashboardProvider>

// Usage
const {
  activePage,
  setActivePage,
  activeCustomer,
  setActiveCustomer
} = useDashboardContext();
```

## 📦 Local State Examples

```typescript
// واجهة التسجيل
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  // ...
});
const [errors, setErrors] = useState<Record<string, string>>({});

// صفحة الباقات
const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);

// Dashboard
const [rightMenuOpen, setRightMenuOpen] = useState(false);
const [notificationsOpen, setNotificationsOpen] = useState(false);
const [showLeftSlider, setShowLeftSlider] = useState(false);
```

---

# 📋 الخلاصة النهائية

## ✅ تم توثيق:

1. ✅ واجهة التسجيل - كل حقل، كل validation، كل state، كل interaction
2. ✅ صفحة الباقات - كل باقة بكل تفاصيلها لكل نوع حساب
3. ✅ Dashboard الرئيسي - كل component، كل خدمة، كل interaction
4. ✅ القائمة اليمنى - كل عنصر من الـ 18 عنصر بالتفصيل
5. ✅ القائمة اليسرى - الأدوات والتنقل
6. ✅ Quick Calculator - كل نوع من الـ 4 أنواع
7. ✅ رأس بطاقة الأعمال - كل detail وكل function
8. ✅ الألوان والتصاميم - كل قيمة بالـ hex
9. ✅ الـ Routes والـ Navigation - كل صفحة ومسارها
10. ✅ الـ States والـ Context - كل متغير وغرضه

## 📦 ملفات جاهزة للنقل

كل المعلومات أعلاه جاهزة للنقل الفوري إلى Lovable.dev بدون أي تخمين أو إضافات.

## 🚀 خطوات التنفيذ في Lovable.dev

1. إنشاء المشروع: `npx create-lovable-app my-crm`
2. نسخ كل الـ Components من التوثيق أعلاه
3. نسخ كل الـ Colors وال Styles
4. نسخ كل الـ Routes
5. نسخ كل الـ State Management
6. نسخ كل الـ Functions والـ Handlers
7. اختبار كل feature واحدة تلو الأخرى
8. التأكد من كل interaction يعمل بشكل صحيح

---

**نهاية التوثيق الشامل** 🎉
