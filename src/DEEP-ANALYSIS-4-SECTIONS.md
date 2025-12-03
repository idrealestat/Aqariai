# 🔍 **التحليل العميق للأقسام الأربعة - Deep Analysis**

> **تحليل دقيق وشامل لـ 4 أقسام رئيسية**  
> **المستوى:** Supreme - Complete Detailed Analysis  
> **التاريخ:** نوفمبر 2025  
> **الهدف:** وصف دقيق لكل زر، حقل، تبويب، وربط

---

## 📋 **جدول المحتويات**

1. [بطاقة أعمالي الرقمية](#1-بطاقة-أعمالي-الرقمية)
2. [بطاقات الأسماء في CRM](#2-بطاقات-الأسماء-في-crm)
3. [إدارة الفريق](#3-إدارة-الفريق)
4. [تحليلات السوق](#4-تحليلات-السوق)

---

# 1️⃣ **بطاقة أعمالي الرقمية**

## 📱 **نظرة عامة:**

```typescript
const BusinessCardSystem = {
  path: '/business-card-profile',
  component: 'BusinessCardProfile',
  accessLevel: 'protected', // يحتاج تسجيل دخول
  storage: {
    data: 'business_card_{userId} (localStorage)',
    images: 'IndexedDB (cover, logo, profile)'
  },
  autoSave: true,
  editMode: 'business-card-edit'
};
```

---

## 🎨 **البنية الكاملة للصفحة:**

### **A) الهيدر (Header Section)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    📸 صورة الغلاف (Cover Image)                 │
│                    يمكن رفعها من التعديل                       │
│                    تظهر كخلفية للهيدر                           │
└─────────────────────────────────────────────────────────────────┘
     ┌──────────────────────────────────────────────────┐
     │                 🎭 الصور التفاعلية               │
     │  ┌──────────────────────────────────────────┐    │
     │  │   🖼️ صورة البروفايل الرئيسية          │    │
     │  │   (192x192px - دائرية)                 │    │
     │  │   • يمكن النقر عليها للتبديل           │    │
     │  │   • تتبدل مع شعار الشركة               │    │
     │  │                                          │    │
     │  │   ┌────────────────┐                     │    │
     │  │   │  🏢 شعار صغير  │                     │    │
     │  │   │  (64x64px)     │                     │    │
     │  │   │  في الزاوية    │                     │    │
     │  │   └────────────────┘                     │    │
     │  └──────────────────────────────────────────┘    │
     │                                                   │
     │  💡 التفاعل:                                     │
     │  • Click → تبديل بين الصورة الشخصية والشعار     │
     │  • Hover → Scale 105%                            │
     │  • Active → Scale 95%                            │
     └──────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────┐
     │           👤 معلومات الهوية الأساسية             │
     │                                                   │
     │  📛 الاسم الكامل                                 │
     │  🏆 شارة المستوى (Badge)                         │
     │     • Starter (⚡ أزرق)                           │
     │     • Bronze (🥉 برونزي)   - 5+ صفقات، سنة+      │
     │     • Silver (🥈 فضي)      - 15+ صفقات، سنتين+   │
     │     • Gold (🥇 ذهبي)       - 30+ صفقات، 3 سنوات+ │
     │     • Platinum (🏆 بلاتيني) - 50+ صفقات، 5 سنوات+│
     │     • Diamond (👑 ماسي)     - 100+ صفقات، 10 سنوات│
     │                                                   │
     │  💡 التفاعل مع الشارة:                           │
     │  • Hover → Tooltip يظهر:                         │
     │    - اسم المستوى                                 │
     │    - عدد الصفقات                                 │
     │    - سنوات الخبرة                                │
     │  • Scale 110% عند Hover                          │
     └──────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────┐
     │            🏢 معلومات الشركة والرخصة             │
     │                                                   │
     │  🏢 اسم الشركة (إن وجد)                         │
     │  📜 رخصة فال + تاريخ الانتهاء                    │
     │     Badge ملون:                                  │
     │     • 🟢 أخضر: أكثر من 90 يوم                   │
     │     • 🟡 أصفر: 30-90 يوم                         │
     │     • 🔴 أحمر: أقل من 30 يوم                    │
     │                                                   │
     │  📋 السجل التجاري + تاريخ الانتهاء              │
     │     نفس نظام الألوان                             │
     └──────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────┐
     │              📞 معلومات الاتصال السريع            │
     │                                                   │
     │  📱 رقم الجوال (Primary)                         │
     │  ✉️ البريد الإلكتروني                           │
     │  🌐 الموقع الإلكتروني                           │
     │  📍 الموقع (المدينة)                             │
     └──────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────┐
     │            🎯 أزرار التحكم (في الأعلى)           │
     │                                                   │
     │  [◄ عودة]                [✏️ تحرير]             │
     │  • عودة → onBack()                               │
     │  • تحرير → onEditClick() → business-card-edit   │
     └──────────────────────────────────────────────────┘
```

---

### **B) القسم الرئيسي (Main Content)**

#### **1. بطاقة السيرة الذاتية (Bio Section)**

```typescript
const BioSection = {
  location: 'أول بطاقة بعد الهيدر',
  
  content: {
    title: '📝 نبذة عني',
    bio: 'نص السيرة الذاتية (200-500 حرف)',
    editButton: '✏️ تعديل النبذة',
    
    editMode: {
      trigger: 'Click على "تعديل النبذة"',
      component: 'Textarea',
      maxLength: 500,
      buttons: [
        {
          text: 'حفظ',
          action: 'saveData() + showSaveSuccess toast',
          color: 'green'
        },
        {
          text: 'إلغاء',
          action: 'setIsEditingBio(false)',
          color: 'gray'
        }
      ]
    }
  },
  
  styling: {
    border: '2px border-[#D4AF37]',
    shadow: 'shadow-lg',
    padding: 'p-6'
  }
};
```

#### **2. بطاقة الإنجازات (Achievements Card)**

```typescript
const AchievementsCard = {
  title: '🏆 الإنجازات والإحصائيات',
  
  stats: [
    {
      icon: '🤝',
      value: 'formData.achievements.totalDeals',
      label: 'صفقة مكتملة',
      color: 'text-[#01411C]'
    },
    {
      icon: '🏢',
      value: 'formData.achievements.totalProperties',
      label: 'عقار مدرج',
      color: 'text-[#01411C]'
    },
    {
      icon: '👥',
      value: 'formData.achievements.totalClients',
      label: 'عميل',
      color: 'text-[#01411C]'
    },
    {
      icon: '⏱️',
      value: 'formData.achievements.yearsOfExperience',
      label: 'سنوات خبرة',
      color: 'text-[#01411C]'
    }
  ],
  
  layout: 'grid grid-cols-4 gap-4',
  
  additionalInfo: {
    awards: {
      condition: 'formData.achievements.awards?.length > 0',
      display: 'قائمة بالجوائز مع أيقونة 🏅',
      example: ['أفضل وسيط 2024', 'وسيط متميز 2023']
    },
    certifications: {
      condition: 'formData.achievements.certifications?.length > 0',
      display: 'قائمة بالشهادات مع أيقونة 📜',
      example: ['رخصة فال', 'شهادة التسويق العقاري']
    },
    badges: {
      topPerformer: {
        condition: 'formData.achievements.topPerformer === true',
        badge: '⭐ أفضل أداء',
        color: 'bg-yellow-100 text-yellow-800'
      },
      verified: {
        condition: 'formData.achievements.verified === true',
        badge: '✅ موثق',
        color: 'bg-green-100 text-green-800'
      }
    }
  }
};
```

#### **3. بطاقة ساعات العمل (Working Hours Card)**

```typescript
const WorkingHoursCard = {
  title: '⏰ ساعات العمل',
  
  days: {
    sunday: { ar: 'الأحد', open: '8:00 ص', close: '2:00 م', isOpen: true },
    monday: { ar: 'الإثنين', open: '8:00 ص', close: '2:00 م', isOpen: true },
    tuesday: { ar: 'الثلاثاء', open: '8:00 ص', close: '2:00 م', isOpen: true },
    wednesday: { ar: 'الأربعاء', open: '8:00 ص', close: '2:00 م', isOpen: true },
    thursday: { ar: 'الخميس', open: '8:00 ص', close: '2:00 م', isOpen: true },
    friday: { ar: 'الجمعة', open: '', close: '', isOpen: false },
    saturday: { ar: 'السبت', open: '8:00 ص', close: '2:00 م', isOpen: true }
  },
  
  display: {
    openDay: {
      icon: '✅',
      text: '{day}: {open} - {close}',
      color: 'text-green-600'
    },
    closedDay: {
      icon: '❌',
      text: '{day}: مغلق',
      color: 'text-red-600'
    }
  }
};
```

#### **4. بطاقة الأزرار التفاعلية (Action Buttons Card)**

```typescript
const ActionButtonsCard = {
  title: '🎯 خدماتي',
  layout: 'grid grid-cols-2 md:grid-cols-4 gap-3',
  
  buttons: [
    {
      id: 1,
      icon: 'Globe 🌐',
      text: 'الموقع',
      action: 'window.open(formData.domain, "_blank")',
      enabled: 'formData.domain !== ""',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    },
    {
      id: 2,
      icon: 'MapPin 📍',
      text: 'خرائط جوجل',
      action: 'window.open(formData.googleMapsLocation, "_blank")',
      enabled: 'formData.googleMapsLocation !== ""',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    },
    {
      id: 3,
      icon: 'Phone 📞',
      text: 'اتصال مباشر',
      action: 'window.open(`tel:${formData.primaryPhone}`)',
      enabled: 'always',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    },
    {
      id: 4,
      icon: 'MessageSquare 💬',
      text: 'واتساب',
      action: 'window.open(`https://wa.me/${cleanPhone}`)',
      enabled: 'always',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    },
    {
      id: 5,
      icon: 'Mail ✉️',
      text: 'إيميل',
      action: 'window.open(`mailto:${formData.email}`)',
      enabled: 'formData.email !== ""',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    },
    {
      id: 6,
      icon: 'Download 💾',
      text: 'تحميل بطاقة',
      action: 'handleDownloadVCard()',
      description: 'تحميل vCard للحفظ في جهات الاتصال',
      enabled: 'always',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]',
      function: `
        const handleDownloadVCard = () => {
          downloadVCard({
            name: user.name,
            phone: formData.primaryPhone,
            email: formData.email,
            organization: formData.companyName,
            title: 'وسيط عقاري',
            url: formData.domain,
            address: formData.location
          });
          toast.success('تم تحميل البطاقة!');
        }
      `
    },
    {
      id: 7,
      icon: 'Home 🏠',
      text: 'إرسال عرض',
      action: 'handleSendOffer()',
      description: 'فتح نموذج إرسال عرض عقاري',
      enabled: 'always',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]',
      navigation: 'navigates to /send-offer page',
      dataFlow: {
        from: 'Business Card',
        to: 'Offer Form',
        passedData: [
          'brokerName: user.name',
          'brokerPhone: formData.primaryPhone',
          'brokerEmail: formData.email',
          'brokerCompany: formData.companyName'
        ]
      }
    },
    {
      id: 8,
      icon: 'Search 🔍',
      text: 'إرسال طلب',
      action: 'handleSendRequest()',
      description: 'فتح نموذج إرسال طلب عقار',
      enabled: 'always',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]',
      navigation: 'navigates to /send-request page',
      dataFlow: {
        from: 'Business Card',
        to: 'Request Form',
        passedData: [
          'brokerName: user.name',
          'brokerPhone: formData.primaryPhone',
          'brokerEmail: formData.email'
        ]
      }
    },
    {
      id: 9,
      icon: 'Calculator 🧮',
      text: 'حاسبة تمويل',
      action: 'handleFinanceCalculator()',
      description: 'فتح حاسبة التمويل العقاري',
      enabled: 'always',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]',
      navigation: 'navigates to /finance-calculator page',
      dataFlow: {
        from: 'Business Card',
        to: 'Finance Calculator',
        passedData: [
          'brokerName: user.name',
          'brokerPhone: formData.primaryPhone'
        ]
      }
    },
    {
      id: 10,
      icon: 'FileText 📄',
      text: 'عرض سعر',
      action: 'alert("عرض سعر")',
      enabled: 'future feature',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    },
    {
      id: 11,
      icon: 'FileText 📋',
      text: 'سند قبض',
      action: 'alert("سند قبض")',
      enabled: 'future feature',
      color: 'from-[#01411C] to-[#065f41]',
      border: '2px border-[#D4AF37]'
    }
  ]
};
```

#### **5. أزرار المشاركة (Share Buttons)**

```typescript
const ShareButtons = {
  layout: 'grid grid-cols-2 gap-4',
  height: 'h-16 (64px)',
  
  buttons: [
    {
      id: 1,
      icon: 'Share2',
      text: 'مشاركة البطاقة',
      action: 'shareBusinessCard()',
      color: 'from-[#01411C] to-[#065f41]',
      hover: 'from-[#065f41] to-[#01411C]',
      border: '2px border-[#D4AF37]',
      
      shareOptions: [
        {
          method: 'whatsapp',
          url: 'https://wa.me/?text={cardLink}',
          text: 'تفضل بزيارة بطاقتي الرقمية: {cardLink}'
        },
        {
          method: 'sms',
          url: 'sms:?body={cardLink}',
          text: 'بطاقتي: {cardLink}'
        },
        {
          method: 'email',
          url: 'mailto:?subject=بطاقة أعمالي&body={cardLink}',
          text: 'بطاقة أعمالي: {cardLink}'
        },
        {
          method: 'copy',
          action: 'navigator.clipboard.writeText(cardLink)',
          toast: 'تم نسخ الرابط!'
        },
        {
          method: 'native',
          action: 'navigator.share({ title, text, url })',
          condition: 'navigator.share supported'
        }
      ]
    },
    {
      id: 2,
      icon: 'Star',
      text: 'مشاركة التقييم',
      action: 'shareRating()',
      color: 'from-[#D4AF37] to-[#f1c40f]',
      hover: 'from-[#f1c40f] to-[#D4AF37]',
      border: '2px border-[#01411C]',
      textColor: 'text-[#01411C]',
      fontWeight: 'font-bold',
      
      shareOptions: [
        {
          method: 'whatsapp',
          text: '⭐ تقييمي: {rating}/5\n🏆 {totalDeals} صفقة مكتملة\n🔗 {cardLink}'
        },
        {
          method: 'twitter',
          text: 'فخور بإنجازاتي: ⭐{rating}/5 | 🤝{totalDeals} صفقة'
        }
      ]
    }
  ]
};
```

#### **6. بطاقة السوشيال ميديا (Social Media Card)**

```typescript
const SocialMediaCard = {
  title: '📱 تابعني على',
  condition: 'Object.values(formData.socialMedia).some(link => link)',
  
  platforms: [
    {
      key: 'tiktok',
      icon: 'TikTok',
      color: '#000000',
      display: '⚫',
      enabled: 'formData.socialMedia.tiktok !== ""'
    },
    {
      key: 'twitter',
      icon: 'Twitter/X',
      color: '#e5e7eb',
      display: '🐦',
      enabled: 'formData.socialMedia.twitter !== ""'
    },
    {
      key: 'instagram',
      icon: 'Instagram',
      gradient: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
      display: '📸',
      enabled: 'formData.socialMedia.instagram !== ""'
    },
    {
      key: 'snapchat',
      icon: 'Snapchat',
      color: '#FFFC00',
      display: '👻',
      enabled: 'formData.socialMedia.snapchat !== ""'
    },
    {
      key: 'youtube',
      icon: 'Youtube',
      color: '#FF0000',
      display: '▶️',
      enabled: 'formData.socialMedia.youtube !== ""'
    },
    {
      key: 'facebook',
      icon: 'Facebook',
      color: '#1877F2',
      display: '📘',
      enabled: 'formData.socialMedia.facebook !== ""'
    }
  ],
  
  interaction: {
    onClick: 'window.open(link, "_blank")',
    hover: 'scale-110',
    transition: 'transition-transform',
    size: 'p-3 (48x48px)'
  },
  
  layout: 'flex justify-center gap-4 flex-wrap'
};
```

---

### **C) الأزرار العائمة (Floating Buttons)**

```typescript
const FloatingButtons = {
  saveButton: {
    position: 'fixed bottom-24 left-4',
    zIndex: 40,
    icon: 'Save 💾',
    action: 'handleManualSave()',
    color: 'from-[#01411C] to-[#065f41]',
    border: '2px border-[#D4AF37]',
    size: 'p-4 (56x56px)',
    shape: 'rounded-full',
    hover: 'scale-110',
    shadow: 'shadow-2xl',
    
    function: `
      const handleManualSave = () => {
        try {
          // حفظ في localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
          
          // حفظ الصور في IndexedDB
          if (coverImage) saveImage(userId, 'cover', coverImage);
          if (logoImage) saveImage(userId, 'logo', logoImage);
          if (profileImage) saveImage(userId, 'profile', profileImage);
          
          // إظهار toast نجاح
          setShowSaveSuccess(true);
          setTimeout(() => setShowSaveSuccess(false), 3000);
          
          toast.success('تم حفظ التغييرات بنجاح!');
        } catch (error) {
          setShowError(true);
          setErrorMessage('حدث خطأ في الحفظ');
          toast.error('فشل الحفظ!');
        }
      }
    `
  }
};
```

---

### **D) الإشعارات (Notifications/Toasts)**

```typescript
const NotificationSystem = {
  welcomeMessage: {
    condition: 'showWelcomeMessage === true',
    position: 'fixed top-4 left-1/2 transform -translate-x-1/2',
    zIndex: 50,
    duration: 3000,
    animation: 'animate-slide-down',
    
    content: {
      icon: 'CheckCircle ✅',
      title: 'مرحباً بعودتك! 🎉',
      text: 'تم استعادة بياناتك المحفوظة بنجاح',
      color: 'bg-blue-500 text-white'
    }
  },
  
  saveSuccess: {
    condition: 'showSaveSuccess === true',
    position: 'fixed top-4 left-1/2 transform -translate-x-1/2',
    zIndex: 50,
    duration: 2000,
    
    content: {
      icon: 'CheckCircle ✅',
      text: 'تم الحفظ بنجاح! ✅',
      color: 'bg-green-500 text-white'
    }
  },
  
  error: {
    condition: 'showError === true',
    position: 'fixed top-4 left-1/2 transform -translate-x-1/2',
    zIndex: 50,
    duration: 3000,
    
    content: {
      icon: 'AlertCircle ⚠️',
      text: '{errorMessage}',
      color: 'bg-red-500 text-white'
    }
  }
};
```

---

## 🔗 **الربط والتكامل:**

### **1. التنقل من البطاقة إلى الأقسام الأخرى:**

```typescript
const NavigationFlow = {
  // من البطاقة إلى التعديل
  toEdit: {
    trigger: 'Click زر "تحرير" في الهيدر',
    action: 'onEditClick()',
    destination: 'business-card-edit',
    dataFlow: 'يمرر جميع formData',
    return: 'onBack() → business-card-profile'
  },
  
  // من البطاقة إلى إرسال عرض
  toSendOffer: {
    trigger: 'Click زر "إرسال عرض"',
    action: 'handleSendOffer()',
    destination: 'OfferFormPublic',
    dataFlow: {
      brokerName: 'user.name',
      brokerPhone: 'formData.primaryPhone',
      brokerEmail: 'formData.email',
      brokerCompany: 'formData.companyName'
    },
    usage: 'يملأ معلومات الوسيط مسبقاً في النموذج'
  },
  
  // من البطاقة إلى إرسال طلب
  toSendRequest: {
    trigger: 'Click زر "إرسال طلب"',
    action: 'handleSendRequest()',
    destination: 'RequestFormPublic',
    dataFlow: {
      brokerName: 'user.name',
      brokerPhone: 'formData.primaryPhone',
      brokerEmail: 'formData.email'
    }
  },
  
  // من البطاقة إلى حاسبة التمويل
  toFinanceCalculator: {
    trigger: 'Click زر "حاسبة تمويل"',
    action: 'handleFinanceCalculator()',
    destination: 'FinanceCalculatorPublic',
    dataFlow: {
      brokerName: 'user.name',
      brokerPhone: 'formData.primaryPhone'
    },
    usage: 'يملأ اسم الوسيط والجوال في الحاسبة'
  },
  
  // من البطاقة إلى Dashboard
  toBack: {
    trigger: 'Click زر "عودة" في الهيدر',
    action: 'onBack()',
    destination: 'dashboard',
    dataFlow: 'none'
  }
};
```

### **2. التكامل مع أنظمة التخزين:**

```typescript
const StorageIntegration = {
  // localStorage - البيانات النصية
  localStorage: {
    key: 'business_card_{userId}',
    data: {
      userName: 'string',
      companyName: 'string',
      falLicense: 'string',
      falExpiry: 'string',
      commercialRegistration: 'string',
      commercialExpiryDate: 'string',
      primaryPhone: 'string',
      email: 'string',
      domain: 'string',
      googleMapsLocation: 'string',
      location: 'string',
      officialPlatform: 'string',
      bio: 'string (max 500)',
      socialMedia: {
        tiktok: 'string (URL)',
        twitter: 'string (URL)',
        instagram: 'string (URL)',
        snapchat: 'string (URL)',
        youtube: 'string (URL)',
        facebook: 'string (URL)'
      },
      workingHours: {
        sunday: { open: 'string', close: 'string', isOpen: 'boolean' },
        monday: { open: 'string', close: 'string', isOpen: 'boolean' },
        tuesday: { open: 'string', close: 'string', isOpen: 'boolean' },
        wednesday: { open: 'string', close: 'string', isOpen: 'boolean' },
        thursday: { open: 'string', close: 'string', isOpen: 'boolean' },
        friday: { open: 'string', close: 'string', isOpen: 'boolean' },
        saturday: { open: 'string', close: 'string', isOpen: 'boolean' }
      },
      achievements: {
        totalDeals: 'number',
        totalProperties: 'number',
        totalClients: 'number',
        yearsOfExperience: 'number',
        awards: 'string[]',
        certifications: 'string[]',
        topPerformer: 'boolean',
        verified: 'boolean'
      }
    },
    autoSave: true,
    saveOn: [
      'blur event',
      'manual save button',
      'navigation away'
    ]
  },
  
  // IndexedDB - الصور
  indexedDB: {
    database: 'aqary-crm-db',
    objectStore: 'images',
    
    images: [
      {
        key: '{userId}_cover',
        type: 'Blob',
        maxSize: '5MB',
        formats: ['image/jpeg', 'image/png', 'image/webp']
      },
      {
        key: '{userId}_logo',
        type: 'Blob',
        maxSize: '2MB',
        formats: ['image/jpeg', 'image/png', 'image/webp']
      },
      {
        key: '{userId}_profile',
        type: 'Blob',
        maxSize: '2MB',
        formats: ['image/jpeg', 'image/png', 'image/webp']
      }
    ],
    
    functions: {
      saveImage: 'async (userId, type, blob) => {...}',
      getImage: 'async (userId, type) => Blob | null',
      hasEnoughSpace: 'async () => boolean'
    }
  }
};
```

### **3. التكامل مع CRM:**

```typescript
const CRMIntegration = {
  // مشاركة البطاقة مع عميل
  shareWithCustomer: {
    trigger: 'من CRM → Customer Details → Share Business Card',
    action: 'shareBusinessCardWithCustomer(customerId)',
    
    flow: [
      '1. جلب معلومات العميل من CRM',
      '2. إنشاء رابط بطاقة مخصص',
      '3. إرسال عبر واتساب/SMS/بريد',
      '4. تسجيل في activityLogs'
    ],
    
    message: {
      whatsapp: 'مرحباً {customerName}، هذه بطاقة أعمالي الرقمية: {cardLink}',
      sms: 'بطاقة أعمالي: {cardLink}',
      email: {
        subject: 'بطاقة أعمالي - {brokerName}',
        body: 'تفضل بزيارة بطاقتي الرقمية: {cardLink}'
      }
    },
    
    tracking: {
      views: 'عدد مرات فتح البطاقة',
      clicks: 'النقرات على أزرار التواصل',
      location: 'CRM → Customer → receivedBusinessCards[]'
    }
  }
};
```

---

## 📊 **حقول البيانات الكاملة:**

```typescript
interface BusinessCardData {
  // معلومات أساسية
  userName: string;              // الاسم الكامل
  companyName?: string;          // اسم الشركة
  
  // الرخص والسجلات
  falLicense?: string;           // رقم رخصة فال
  falExpiry?: string;            // تاريخ انتهاء رخصة فال (YYYY-MM-DD)
  commercialRegistration?: string; // رقم السجل التجاري
  commercialExpiryDate?: string;   // تاريخ انتهاء السجل (YYYY-MM-DD)
  
  // معلومات الاتصال
  primaryPhone: string;          // رقم الجوال الأساسي
  email?: string;                // البريد الإلكتروني
  domain?: string;               // الموقع الإلكتروني
  googleMapsLocation?: string;   // رابط خرائط جوجل
  location?: string;             // المدينة/المنطقة
  
  // الصور
  coverImage?: string;           // صورة الغلاف (Base64 أو URL)
  logoImage?: string;            // شعار الشركة (Base64 أو URL)
  profileImage?: string;         // الصورة الشخصية (Base64 أو URL)
  
  // المحتوى
  officialPlatform?: string;     // المنصة الرسمية
  bio?: string;                  // نبذة عني (max 500 حرف)
  
  // وسائل التواصل الاجتماعي
  socialMedia: {
    tiktok?: string;             // رابط TikTok
    twitter?: string;            // رابط Twitter/X
    instagram?: string;          // رابط Instagram
    snapchat?: string;           // رابط Snapchat
    youtube?: string;            // رابط Youtube
    facebook?: string;           // رابط Facebook
  };
  
  // ساعات العمل
  workingHours: {
    [day: string]: {
      open: string;              // وقت الفتح (e.g. "8:00 ص")
      close: string;             // وقت الإغلاق (e.g. "2:00 م")
      isOpen: boolean;           // مفتوح/مغلق
    };
  };
  
  // الإنجازات والإحصائيات
  achievements: {
    totalDeals: number;          // عدد الصفقات المكتملة
    totalProperties: number;     // عدد العقارات المدرجة
    totalClients: number;        // عدد العملاء
    yearsOfExperience: number;   // سنوات الخبرة
    awards?: string[];           // قائمة الجوائز
    certifications?: string[];   // قائمة الشهادات
    topPerformer: boolean;       // أفضل أداء
    verified: boolean;           // موثق
  };
}
```

---

## 🎯 **خريطة تدفق البطاقة الكاملة:**

```
┌────────────────────────────────────────────────────────────────┐
│                    👤 المستخدم يفتح البطاقة                   │
└────────────────────────┬───────────────────────────────────────┘
                         │
            ┌────────────▼────────────┐
            │  تحميل من localStorage  │
            │  business_card_{userId} │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │  تحميل الصور من        │
            │  IndexedDB              │
            │  • cover                │
            │  • logo                 │
            │  • profile              │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │  عرض البطاقة الكاملة    │
            │  مع جميع المكونات       │
            └────────────┬────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │ تعديل   │     │ مشاركة  │     │ تنقل    │
   │ البيانات│     │ البطاقة │     │ لأقسام  │
   └────┬────┘     └────┬────┘     └────┬────┘
        │                │                │
        │                │                │
   ┌────▼────────────────▼────────────────▼────┐
   │          حفظ تلقائي في localStorage        │
   │          + IndexedDB للصور                 │
   └───────────────────────────────────────────┘
```

---

# 2️⃣ **بطاقات الأسماء في CRM**

## 📇 **نظرة عامة:**

```typescript
const CustomerCardSystem = {
  component: 'CustomerCard (in EnhancedBrokerCRM)',
  location: 'Kanban Board Columns',
  dragAndDrop: true,
  features: [
    'Drag & Drop بين المراحل',
    'Quick Actions مباشرة من البطاقة',
    'تعديل سريع In-line',
    'قائمة إجراءات منبثقة',
    'إشعارات غير مقروءة',
    'نظام تاقات ملون (13 لون)',
    'مستويات اهتمام'
  ]
};
```

---

## 🎴 **البنية الكاملة لبطاقة العميل:**

### **A) الهيدر (Card Header)**

```
┌─────────────────────────────────────────────────────────────┐
│  🔴 [نقطة إشعار]      [Avatar]           👤 الاسم الكامل  │
│     hasNotification    (صورة)            14px font-bold    │
│                                                              │
│  📱 0501234567                     📊 مستوى الاهتمام       │
│     رقم الجوال                         شغوف 🔥             │
│                                                              │
│  🏷️ [مالك]  [VIP]  [مستعجل]                               │
│     category + custom tags                                  │
└─────────────────────────────────────────────────────────────┘
```

#### **التفاصيل الدقيقة:**

```typescript
const CardHeader = {
  // النقطة الحمراء للإشعارات
  notificationDot: {
    condition: 'customer.hasNotification === true',
    position: 'absolute top-2 right-2',
    size: 'w-3 h-3',
    color: 'bg-red-500',
    shape: 'rounded-full',
    animation: 'animate-pulse',
    meaning: 'هناك إشعار جديد لهذا العميل'
  },
  
  // الصورة الرمزية
  avatar: {
    size: 'w-10 h-10 (40x40px)',
    shape: 'rounded-full',
    border: '2px border-[#D4AF37]',
    fallback: 'الحرفان الأولان من الاسم',
    bgColor: 'bg-[#01411C]',
    textColor: 'text-[#D4AF37]'
  },
  
  // الاسم
  name: {
    fontSize: '14px',
    fontWeight: 'font-bold',
    color: 'text-gray-900',
    maxLength: '30 حرف',
    overflow: 'truncate'
  },
  
  // رقم الجوال
  phone: {
    fontSize: '12px',
    color: 'text-gray-600',
    icon: 'Phone 📱',
    format: '05XX XXX XXX',
    clickable: true,
    onClick: 'window.open(`tel:${phone}`)'
  },
  
  // التصنيف (Category Badge)
  categoryBadge: {
    options: [
      { value: 'مالك', color: 'bg-blue-100 text-blue-800', icon: '🏠' },
      { value: 'مشتري', color: 'bg-green-100 text-green-800', icon: '💰' },
      { value: 'مؤجر', color: 'bg-purple-100 text-purple-800', icon: '🔑' },
      { value: 'مستأجر', color: 'bg-orange-100 text-orange-800', icon: '📋' },
      { value: 'تمويل', color: 'bg-yellow-100 text-yellow-800', icon: '🏦' },
      { value: 'آخر', color: 'bg-gray-100 text-gray-800', icon: '👤' }
    ],
    size: 'text-xs px-2 py-1',
    shape: 'rounded'
  },
  
  // مستوى الاهتمام
  interestLevel: {
    position: 'top-left corner',
    options: [
      {
        id: 'passionate',
        label: 'شغوف 🔥',
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: '🔥',
        priority: 'عالية جداً'
      },
      {
        id: 'interested',
        label: 'مهتم ✅',
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: '✅',
        priority: 'عالية'
      },
      {
        id: 'moderate',
        label: 'معتدل 💭',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: '💭',
        priority: 'متوسطة'
      },
      {
        id: 'limited',
        label: 'محدود 🤔',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: '🤔',
        priority: 'منخفضة'
      },
      {
        id: 'not-interested',
        label: 'غير مهتم ❌',
        color: 'bg-gray-200 text-gray-500 border-gray-300',
        icon: '❌',
        priority: 'أرشفة'
      }
    ],
    editable: true,
    onClick: 'فتح قائمة منسدلة لتغيير المستوى'
  },
  
  // التاقات المخصصة
  customTags: {
    display: 'flex flex-wrap gap-1',
    maxVisible: 3,
    moreIndicator: '+{count} أخرى',
    
    tagStructure: {
      text: 'string',
      color: 'من 13 لون',
      temporary: 'boolean',
      size: 'text-xs px-2 py-0.5',
      shape: 'rounded-full'
    },
    
    colors: [
      '#ef4444', // أحمر
      '#f97316', // برتقالي
      '#f59e0b', // أصفر
      '#84cc16', // أخضر ليموني
      '#10b981', // أخضر
      '#14b8a6', // تيركواز
      '#06b6d4', // سماوي
      '#3b82f6', // أزرق
      '#6366f1', // نيلي
      '#8b5cf6', // بنفسجي
      '#a855f7', // أرجواني
      '#ec4899', // وردي
      '#f43f5e'  // أحمر وردي
    ],
    
    interactions: {
      onClick: 'حذف التاق',
      onRightClick: 'تعديل التاق',
      onDoubleClick: 'تثبيت/إلغاء تثبيت'
    }
  }
};
```

---

### **B) جسم البطاقة (Card Body)**

```
┌─────────────────────────────────────────────────────────────┐
│  💼 الشركة: شركة العقارات السعودية                         │
│  📍 الموقع: الرياض - العليا                                │
│  💰 الميزانية: 2,000,000 ريال                              │
│                                                              │
│  📞 آخر اتصال: منذ ساعتين                                  │
│  📅 المتابعة القادمة: غداً في 2:00 م                       │
│                                                              │
│  🏠 العقارات المرتبطة: 3 عقارات                           │
│  📋 المهام المعلقة: مهمة واحدة                             │
└─────────────────────────────────────────────────────────────┘
```

#### **التفاصيل الدقيقة:**

```typescript
const CardBody = {
  // معلومات إضافية
  additionalInfo: [
    {
      field: 'company',
      icon: 'Building 💼',
      label: 'الشركة',
      condition: 'customer.company !== ""',
      display: '{company}',
      color: 'text-gray-700'
    },
    {
      field: 'address',
      icon: 'MapPin 📍',
      label: 'الموقع',
      condition: 'customer.city || customer.district',
      display: '{city} - {district}',
      color: 'text-gray-600'
    },
    {
      field: 'budget',
      icon: 'DollarSign 💰',
      label: 'الميزانية',
      condition: 'customer.budget !== ""',
      display: '{budget} ريال',
      color: 'text-green-600',
      format: 'number with commas'
    }
  ],
  
  // آخر تفاعل
  lastInteraction: {
    field: 'lastContact',
    icon: 'Phone 📞',
    label: 'آخر اتصال',
    format: 'relative time (e.g. منذ ساعتين)',
    color: 'text-gray-500',
    fontSize: 'text-xs'
  },
  
  // المتابعة القادمة
  nextFollowUp: {
    field: 'nextFollowUp',
    icon: 'Calendar 📅',
    label: 'المتابعة القادمة',
    format: 'date + time (e.g. غداً في 2:00 م)',
    color: {
      overdue: 'text-red-600',
      today: 'text-orange-600',
      tomorrow: 'text-blue-600',
      later: 'text-gray-600'
    },
    highlight: 'bg-yellow-50 border-l-4 border-yellow-500'
  },
  
  // العقارات المرتبطة
  linkedProperties: {
    field: 'linkedAdsCount',
    icon: 'Home 🏠',
    label: 'العقارات المرتبطة',
    display: '{count} عقارات',
    color: 'text-blue-600',
    clickable: true,
    onClick: 'navigate to properties tab in customer details'
  },
  
  // المهام المعلقة
  pendingTasks: {
    icon: 'CheckCircle 📋',
    label: 'المهام المعلقة',
    display: '{count} مهمة',
    color: 'text-purple-600',
    clickable: true,
    onClick: 'navigate to tasks'
  }
};
```

---

### **C) الفوتر - أزرار الإجراءات السريعة**

```
┌─────────────────────────────────────────────────────────────┐
│  [📞]  [💬]  [✉️]  [📅]  [📄]  [⋯]  [🔗]                    │
│  اتصال واتساب بريد موعد تفاصيل المزيد مشاركة              │
└─────────────────────────────────────────────────────────────┘
```

#### **التفاصيل الدقيقة لكل زر:**

```typescript
const QuickActionButtons = {
  layout: 'grid grid-cols-7 gap-1',
  
  buttons: [
    {
      id: 1,
      icon: 'Phone 📞',
      label: 'اتصال',
      color: 'bg-green-500',
      hoverColor: 'bg-green-600',
      textColor: 'text-white',
      action: 'window.open(`tel:${customer.phone}`)',
      size: 'px-2 py-2',
      tooltip: 'اتصال مباشر',
      
      tracking: {
        event: 'call_initiated',
        saveToActivityLog: true,
        incrementCallsCount: true
      }
    },
    {
      id: 2,
      icon: 'MessageSquare 💬',
      label: 'واتساب',
      color: 'bg-green-500',
      hoverColor: 'bg-green-600',
      textColor: 'text-white',
      action: 'window.open(`https://wa.me/${cleanPhone}`)',
      size: 'px-2 py-2',
      tooltip: 'فتح واتساب',
      
      tracking: {
        event: 'whatsapp_opened',
        saveToActivityLog: true,
        incrementMessagesCount: true
      }
    },
    {
      id: 3,
      icon: 'Mail ✉️',
      label: 'بريد',
      color: 'bg-blue-500',
      hoverColor: 'bg-blue-600',
      textColor: 'text-white',
      action: 'window.open(`mailto:${customer.email}`)',
      size: 'px-2 py-2',
      tooltip: 'إرسال بريد إلكتروني',
      enabled: 'customer.email !== ""',
      
      tracking: {
        event: 'email_opened',
        saveToActivityLog: true
      }
    },
    {
      id: 4,
      icon: 'Calendar 📅',
      label: 'موعد',
      color: 'bg-orange-500',
      hoverColor: 'bg-orange-600',
      textColor: 'text-white',
      size: 'px-2 py-2',
      tooltip: 'جدولة موعد',
      
      action: `
        // 1. إطلاق حدث مخصص
        window.dispatchEvent(new CustomEvent('scheduleAppointmentFromCRM', {
          detail: {
            clientName: customer.name,
            clientPhone: customer.phone,
            clientWhatsapp: customer.whatsapp || customer.phone,
            clientId: customer.id
          }
        }));
        
        // 2. الانتقال لصفحة التقويم
        window.dispatchEvent(new CustomEvent('navigateToPage', { 
          detail: 'calendar-system-complete' 
        }));
      `,
      
      flow: [
        '1. نقل بيانات العميل',
        '2. فتح صفحة التقويم',
        '3. فتح نموذج موعد جديد',
        '4. معلومات العميل مملوءة مسبقاً',
        '5. حفظ الموعد يضيف للتقويم + activityLog'
      ],
      
      tracking: {
        event: 'appointment_scheduled',
        incrementMeetingsCount: true
      }
    },
    {
      id: 5,
      icon: 'FileText 📄',
      label: 'التفاصيل',
      color: 'bg-blue-500',
      hoverColor: 'bg-blue-600',
      textColor: 'text-white',
      size: 'px-2 py-2',
      tooltip: 'عرض التفاصيل الكاملة',
      
      action: 'onShowDetails(customer.id)',
      
      destination: 'customer-details-page',
      
      dataFlow: {
        method: 'Context API',
        steps: [
          'setActiveCustomer(customer)',
          'navigate to customer-details-page',
          'عرض جميع التبويبات (8 tabs)'
        ]
      }
    },
    {
      id: 6,
      icon: 'MoreVertical ⋯',
      label: 'المزيد',
      color: 'bg-gray-500',
      hoverColor: 'bg-gray-600',
      textColor: 'text-white',
      size: 'px-2 py-2',
      tooltip: 'المزيد من الإجراءات',
      
      action: 'toggleActionsMenu()',
      
      menu: {
        position: 'Portal Menu (top)',
        items: [
          {
            icon: 'UserMinus',
            text: 'تعيين لعضو فريق',
            action: `assignToTeamMember(customer.id)`,
            condition: 'user.type !== "individual"',
            
            modal: {
              title: 'تعيين العميل',
              content: 'قائمة أعضاء الفريق',
              buttons: ['تعيين', 'إلغاء']
            }
          },
          {
            icon: 'Edit',
            text: 'تعديل',
            action: 'openEditModal(customer)',
            
            modal: {
              title: 'تعديل بيانات العميل',
              fields: [
                'name', 'phone', 'email', 'company',
                'category', 'interestLevel', 'budget',
                'notes'
              ]
            }
          },
          {
            icon: 'FileText',
            text: 'إضافة ملاحظة',
            action: 'openNoteModal()',
            
            modal: {
              title: 'إضافة ملاحظة',
              content: 'Textarea',
              maxLength: 1000,
              save: 'updateCustomer({ notes })'
            }
          },
          {
            icon: 'Tag',
            text: 'إضافة علامة',
            action: 'openTagModal()',
            
            modal: {
              title: 'إضافة علامة',
              content: [
                'Input للعلامة الجديدة',
                'Color Picker (13 لون)',
                'Checkbox: مؤقتة/دائمة',
                'قائمة العلامات الحالية'
              ],
              save: 'updateCustomer({ tags: [...tags, newTag] })'
            }
          },
          {
            icon: 'Upload',
            text: 'إضافة ملف',
            action: 'openFileModal()',
            
            modal: {
              title: 'إضافة ملف',
              content: 'File Upload (Drag & Drop)',
              types: ['PDF', 'JPG', 'PNG', 'DOC', 'XLS'],
              maxSize: '10MB',
              save: 'uploadToIndexedDB + updateCustomer'
            }
          },
          {
            icon: 'DollarSign',
            text: 'إضافة سند قبض',
            action: `
              window.dispatchEvent(new CustomEvent('openFinancialDocument', {
                detail: {
                  type: 'receipt',
                  client: { 
                    name: customer.name, 
                    phone: customer.phone, 
                    company: customer.company 
                  }
                }
              }));
            `,
            destination: 'financial-documents (receipts tab)',
            dataFlow: 'يمرر معلومات العميل للنموذج'
          },
          {
            icon: 'FileText',
            text: 'إضافة عرض سعر',
            action: `
              window.dispatchEvent(new CustomEvent('openFinancialDocument', {
                detail: {
                  type: 'quotation',
                  client: { 
                    name: customer.name, 
                    phone: customer.phone, 
                    company: customer.company 
                  }
                }
              }));
            `,
            destination: 'financial-documents (quotations tab)',
            dataFlow: 'يمرر معلومات العميل للنموذج'
          },
          {
            icon: 'CheckCircle',
            text: 'إضافة مهمة',
            action: `
              window.dispatchEvent(new CustomEvent('navigateToPage', { 
                detail: 'tasks-management' 
              }));
            `,
            destination: 'tasks-management',
            note: 'يجب إضافة dataFlow لتمرير معلومات العميل'
          },
          {
            icon: 'Calendar',
            text: 'إضافة موعد',
            action: 'نفس زر "موعد" في Quick Actions'
          },
          {
            icon: 'Archive',
            text: 'أرشفة',
            action: 'archiveCustomer(customer.id)',
            confirm: {
              title: 'تأكيد الأرشفة',
              message: 'هل تريد أرشفة هذا العميل؟',
              buttons: ['نعم، أرشف', 'إلغاء']
            },
            result: 'updateCustomer({ status: "archived" })'
          },
          {
            icon: 'Trash2',
            text: 'حذف',
            action: 'deleteCustomer(customer.id)',
            color: 'text-red-600',
            confirm: {
              title: 'تأكيد الحذف',
              message: 'هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.',
              buttons: ['نعم، احذف', 'إلغاء'],
              danger: true
            },
            result: 'removeFromLocalStorage + refresh'
          }
        ]
      }
    },
    {
      id: 7,
      icon: 'Share2 🔗',
      label: 'مشاركة',
      color: 'bg-[#01411C]',
      hoverColor: 'bg-[#065f41]',
      textColor: 'text-white',
      size: 'px-2 py-2',
      tooltip: 'مشاركة معلومات العميل',
      
      action: 'toggleShareMenu()',
      
      menu: {
        position: 'Portal Menu (top)',
        items: [
          {
            icon: 'Copy',
            text: 'نسخ الرابط',
            action: `
              navigator.clipboard.writeText(
                \`\${window.location.origin}/customer/\${customer.id}\`
              );
              toast.success('تم نسخ الرابط!');
            `
          },
          {
            icon: 'MessageSquare',
            text: 'واتساب أعمال',
            action: `
              const text = \`العميل: \${customer.name}\\nالهاتف: \${customer.phone}\`;
              window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
            `
          },
          {
            icon: 'Send',
            text: 'رسائل نصية',
            action: `
              const text = \`العميل: \${customer.name}\\nالهاتف: \${customer.phone}\`;
              window.open(\`sms:?body=\${encodeURIComponent(text)}\`, '_blank');
            `
          },
          {
            icon: 'Share2',
            text: 'اختر تطبيق',
            action: `
              if (navigator.share) {
                navigator.share({
                  title: customer.name,
                  text: \`العميل: \${customer.name}\\nالهاتف: \${customer.phone}\`,
                  url: \`\${window.location.origin}/customer/\${customer.id}\`
                });
              }
            `,
            condition: 'navigator.share supported'
          }
        ]
      }
    }
  ]
};
```

---

### **D) Drag & Drop Functionality**

```typescript
const DragDropSystem = {
  library: '@dnd-kit/core + @dnd-kit/sortable',
  
  sensors: [
    'PointerSensor',
    'TouchSensor',
    'MouseSensor'
  ],
  
  dragHandle: {
    icon: 'GripVertical',
    position: 'absolute right-2 top-1/2 transform -translate-y-1/2',
    cursor: 'grab',
    color: 'text-gray-400',
    hoverColor: 'text-gray-600'
  },
  
  dragState: {
    active: {
      opacity: 0.5,
      cursor: 'grabbing',
      shadow: 'shadow-2xl',
      scale: 1.05
    },
    overlay: {
      enabled: true,
      component: 'DragOverlay',
      content: 'نسخة من البطاقة'
    }
  },
  
  dropTargets: {
    columns: ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'],
    visual: {
      canDrop: 'border-2 border-dashed border-green-400',
      isOver: 'bg-green-50'
    }
  },
  
  events: {
    onDragStart: `
      (event) => {
        setActiveId(event.active.id);
        setDraggedCustomer(findCustomerById(event.active.id));
      }
    `,
    
    onDragEnd: `
      (event) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
          const oldColumn = findColumnByCustomerId(active.id);
          const newColumn = over.id;
          
          // تحديث البيانات
          moveCustomer(active.id, oldColumn, newColumn);
          
          // حفظ في localStorage
          saveAllCustomers(updatedCustomers);
          
          // إشعار
          toast.success(\`تم نقل \${customer.name} إلى \${newColumn}\`);
        }
        
        setActiveId(null);
        setDraggedCustomer(null);
      }
    `
  }
};
```

---

## 🔗 **الربط والتكامل:**

### **1. الربط مع صفحة التفاصيل:**

```typescript
const CustomerDetailsIntegration = {
  trigger: 'Click زر "التفاصيل" في البطاقة',
  
  flow: [
    '1. onShowDetails(customer.id)',
    '2. setActiveCustomer(customer) في Context',
    '3. navigate to customer-details-page',
    '4. عرض 8 تبويبات'
  ],
  
  tabs: [
    {
      id: 'overview',
      name: 'نظرة عامة 📊',
      content: [
        'المعلومات الشخصية الكاملة',
        'معلومات العمل',
        'الإحصائيات',
        'التقييم'
      ]
    },
    {
      id: 'activity',
      name: 'سجل النشاط 📝',
      content: [
        'Timeline كامل للأنشطة',
        'المكالمات',
        'الرسائل',
        'المواعيد',
        'العروض',
        'الملاحظات'
      ],
      filters: ['الكل', 'المكالمات', 'الرسائل', 'المواعيد', 'العروض', 'الملاحظات']
    },
    {
      id: 'properties',
      name: 'العقارات المرتبطة 🏠',
      content: [
        'العروض المستلمة',
        'الطلبات المستلمة',
        'العقارات المحفوظة'
      ]
    },
    {
      id: 'appointments',
      name: 'المواعيد 📅',
      content: [
        'المواعيد القادمة',
        'المواعيد السابقة',
        'زر: جدولة موعد جديد'
      ]
    },
    {
      id: 'communications',
      name: 'الاتصالات 💬',
      content: [
        'سجل المكالمات',
        'الرسائل (واتساب، SMS)',
        'البريد الإلكتروني',
        'أزرار تواصل سريعة'
      ]
    },
    {
      id: 'documents',
      name: 'المستندات 📄',
      content: [
        'المستندات المرفوعة',
        'الفئات (هوية، عقود، صور، أخرى)',
        'زر: إضافة مستند جديد'
      ]
    },
    {
      id: 'notes',
      name: 'الملاحظات 📝',
      content: [
        'جميع الملاحظات',
        'الملاحظات المثبتة',
        'زر: إضافة ملاحظة جديدة'
      ]
    },
    {
      id: 'team',
      name: 'الفريق 👥',
      content: [
        'العضو المكلف',
        'تاريخ التعيين',
        'سجل التعيينات السابقة',
        'زر: إعادة التعيين'
      ]
    }
  ],
  
  backNavigation: {
    trigger: 'زر "عودة" في صفحة التفاصيل',
    destination: 'enhanced-crm (نفس الموقع في Kanban)'
  }
};
```

### **2. الربط مع التقويم:**

```typescript
const CalendarIntegration = {
  trigger: 'Click زر "موعد" في البطاقة',
  
  dataFlow: {
    event: 'scheduleAppointmentFromCRM',
    payload: {
      clientName: 'customer.name',
      clientPhone: 'customer.phone',
      clientWhatsapp: 'customer.whatsapp || customer.phone',
      clientId: 'customer.id'
    }
  },
  
  destination: 'calendar-system-complete',
  
  automaticActions: [
    'فتح صفحة التقويم',
    'فتح نموذج موعد جديد',
    'ملء معلومات العميل مسبقاً',
    'المستخدم يكمل: التاريخ، الوقت، الموقع، الملاحظات',
    'حفظ يضيف للتقويم + activityLog في ملف العميل'
  ],
  
  reverseFlow: {
    condition: 'من التقويم إلى CRM',
    action: 'Click على موعد في التقويم',
    result: 'فتح تفاصيل العميل المرتبط'
  }
};
```

### **3. الربط مع المستندات المالية:**

```typescript
const FinancialDocsIntegration = {
  // سند قبض
  receipt: {
    trigger: 'Click "إضافة سند قبض" من القائمة',
    event: 'openFinancialDocument',
    payload: {
      type: 'receipt',
      client: {
        name: 'customer.name',
        phone: 'customer.phone',
        company: 'customer.company'
      }
    },
    destination: 'financial-documents (receipts tab)',
    preFilledFields: [
      'اسم العميل',
      'رقم الجوال',
      'الشركة'
    ]
  },
  
  // عرض سعر
  quotation: {
    trigger: 'Click "إضافة عرض سعر" من القائمة',
    event: 'openFinancialDocument',
    payload: {
      type: 'quotation',
      client: {
        name: 'customer.name',
        phone: 'customer.phone',
        company: 'customer.company'
      }
    },
    destination: 'financial-documents (quotations tab)',
    preFilledFields: [
      'اسم العميل',
      'رقم الجوال',
      'الشركة'
    ]
  }
};
```

---

## 📊 **خريطة التدفق الكاملة:**

```
┌────────────────────────────────────────────────────────────┐
│            👤 المستخدم يرى البطاقة في Kanban              │
└────────────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │ Drag &  │     │ Quick   │     │ More    │
   │ Drop    │     │ Actions │     │ Menu    │
   └────┬────┘     └────┬────┘     └────┬────┘
        │                │                │
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │ نقل بين │     │ اتصال   │     │ تعديل   │
   │ المراحل │     │ واتساب  │     │ ملاحظة  │
   │         │     │ بريد    │     │ تاق     │
   │         │     │ موعد    │     │ ملف     │
   │         │     │ تفاصيل  │     │ سند ��بض │
   └─────────┘     └────┬────┘     │ عرض سعر │
                        │           │ مهمة    │
                   ┌────▼────┐     │ أرشفة   │
                   │Customer │     │ حذف     │
                   │ Details │     └─────────┘
                   │ Page    │
                   │ 8 Tabs  │
                   └─────────┘
```

---

# 3️⃣ **إدارة الفريق**

## 👥 **نظرة عامة:**

```typescript
const TeamManagementSystem = {
  accessFrom: [
    'RightSlider → إدارة الفريق',
    'LeftSlider → الإعدادات والزملاء'
  ],
  component: 'Colleagues',
  path: '/colleagues',
  
  userTypes: [
    'individual → مخفي',
    'team → مرئي',
    'office → مرئي',
    'company → مرئي'
  ],
  
  features: [
    'إضافة أعضاء فريق',
    'إدارة الصلاحيات',
    'توزيع العملاء',
    'تحليلات الأداء',
    'الأدوار والمسميات'
  ]
};
```

---

## 🎯 **البنية الكاملة للصفحة:**

### **A) الهيدر والإحصائيات**

```
┌─────────────────────────────────────────────────────────────┐
│  [◄ العودة]         الزملاء والفريق              [ ]      │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 👥 إجمالي    │ ✅ نشط      │ 💰 الإيرادات │ 🤝 الصفقات   │
│   4          │   3          │  1,660,000   │   86         │
│ أعضاء الفريق│  أعضاء      │    ريال      │  صفقة        │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### **التفاصيل:**

```typescript
const TeamStats = {
  layout: 'grid grid-cols-1 md:grid-cols-4 gap-4',
  
  cards: [
    {
      icon: 'Users 👥',
      value: 'colleagues.length',
      label: 'إجمالي أعضاء الفريق',
      color: 'text-[#01411C]',
      border: '2px border-[#D4AF37]'
    },
    {
      icon: 'CheckCircle ✅',
      value: 'colleagues.filter(c => c.status === "active").length',
      label: 'أعضاء نشطون',
      color: 'text-green-600',
      border: '2px border-green-300'
    },
    {
      icon: 'TrendingUp 💰',
      value: 'colleagues.reduce((sum, c) => sum + c.revenue, 0)',
      label: 'إجمالي الإيرادات',
      format: 'currency (ريال)',
      color: 'text-[#D4AF37]',
      border: '2px border-[#D4AF37]'
    },
    {
      icon: 'Star 🤝',
      value: 'colleagues.reduce((sum, c) => sum + c.dealsCount, 0)',
      label: 'إجمالي الصفقات',
      color: 'text-blue-600',
      border: '2px border-blue-300'
    }
  ]
};
```

---

### **B) زر إضافة عضو جديد**

```
┌─────────────────────────────────────────────────────────────┐
│              [+ إضافة عضو جديد للفريق]                     │
└─────────────────────────────────────────────────────────────┘
```

#### **نموذج الإضافة (Dialog):**

```typescript
const AddMemberDialog = {
  trigger: 'Click زر "إضافة عضو جديد"',
  component: 'Dialog (shadcn/ui)',
  
  form: {
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'الاسم الكامل',
        required: true,
        placeholder: 'محمد أحمد السعيد'
      },
      {
        name: 'email',
        type: 'email',
        label: 'البريد الإلكتروني',
        required: true,
        placeholder: 'mohammed@example.com'
      },
      {
        name: 'phone',
        type: 'tel',
        label: 'رقم الجوال',
        required: true,
        placeholder: '0501234567',
        validation: 'يبدأ بـ 05 ويتكون من 10 أرقام'
      },
      {
        name: 'role',
        type: 'select',
        label: 'الدور',
        required: true,
        options: [
          { value: 'admin', label: 'مدير 👑', permissions: 'all_permissions' },
          { value: 'agent', label: 'وسيط 👤', permissions: 'standard' },
          { value: 'viewer', label: 'مراقب 👁️', permissions: 'view_only' }
        ],
        default: 'agent'
      }
    ],
    
    buttons: [
      {
        text: 'إلغاء',
        variant: 'outline',
        action: 'setShowInviteDialog(false)'
      },
      {
        text: 'إرسال دعوة',
        variant: 'default',
        color: 'bg-[#01411C]',
        action: 'handleInviteColleague()',
        validation: 'جميع الحقول المطلوبة'
      }
    ]
  },
  
  onSubmit: `
    const handleInviteColleague = () => {
      // 1. التحقق من البيانات
      if (!inviteData.name || !inviteData.email || !inviteData.phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
      }
      
      // 2. إنشاء عضو جديد
      const newColleague = {
        id: Date.now().toString(),
        name: inviteData.name,
        email: inviteData.email,
        phone: inviteData.phone,
        role: inviteData.role,
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'لم يسجل دخول بعد',
        dealsCount: 0,
        revenue: 0,
        rating: 0,
        permissions: getDefaultPermissions(inviteData.role)
      };
      
      // 3. إضافة للقائمة
      setColleagues([...colleagues, newColleague]);
      
      // 4. حفظ في localStorage
      localStorage.setItem('team_colleagues', JSON.stringify([...colleagues, newColleague]));
      
      // 5. إرسال دعوة (مستقبلاً عبر API)
      // sendInvitationEmail(newColleague);
      
      // 6. إغلاق النموذج
      setInviteData({ name: '', email: '', phone: '', role: 'agent' });
      setShowInviteDialog(false);
      
      // 7. إشعار
      toast.success(\`تم إرسال دعوة لـ \${inviteData.name}!\`);
    }
  `
};
```

---

### **C) بطاقات الأعضاء**

```
┌─────────────────────────────────────────────────────────────┐
│  👤 [صورة]      أحمد الزهراني                   [وسيط]     │
│                 ahmed@example.com                [نشط]      │
│                 0555123456                                   │
│                                                              │
│  📊 الإحصائيات:                                             │
│     🤝 23 صفقة  |  💰 450,000 ريال  |  ⭐ 4.8  |  📅 منذ سنة│
│                                                              │
│  🔐 الصلاحيات:                                              │
│     • عرض العقارات                                          │
│     • إنشاء عملاء                                           │
│     • إدارة العملاء                                         │
│                                                              │
│  [👁️ عرض التفاصيل]  [⚙️ تعديل الصلاحيات]  [⋯ المزيد]    │
└─────────────────────────────────────────────────────────────┘
```

#### **التفاصيل الدقيقة:**

```typescript
const MemberCard = {
  layout: 'Card with border-2 border-[#D4AF37]',
  
  header: {
    avatar: {
      size: 'w-16 h-16',
      shape: 'rounded-full',
      border: '2px border-[#D4AF37]',
      fallback: 'الحرفان الأولان',
      bgColor: 'bg-[#01411C]',
      textColor: 'text-[#D4AF37]'
    },
    
    name: {
      fontSize: 'text-lg',
      fontWeight: 'font-bold',
      color: 'text-[#01411C]'
    },
    
    email: {
      fontSize: 'text-sm',
      color: 'text-gray-600',
      icon: 'Mail'
    },
    
    phone: {
      fontSize: 'text-sm',
      color: 'text-gray-600',
      icon: 'Phone'
    },
    
    roleBadge: {
      admin: {
        label: 'مدير 👑',
        color: 'bg-red-100 text-red-800',
        icon: 'Crown',
        permissions: 'جميع الصلاحيات'
      },
      agent: {
        label: 'وسيط 👤',
        color: 'bg-blue-100 text-blue-800',
        icon: 'Users',
        permissions: 'صلاحيات قياسية'
      },
      viewer: {
        label: 'مراقب 👁️',
        color: 'bg-gray-100 text-gray-800',
        icon: 'Eye',
        permissions: 'عرض فقط'
      }
    },
    
    statusBadge: {
      active: {
        label: 'نشط ✅',
        color: 'bg-green-100 text-green-800'
      },
      pending: {
        label: 'في انتظار التفعيل ⏳',
        color: 'bg-yellow-100 text-yellow-800'
      },
      inactive: {
        label: 'غير نشط ❌',
        color: 'bg-red-100 text-red-800'
      }
    }
  },
  
  stats: {
    layout: 'grid grid-cols-4 gap-2',
    items: [
      {
        icon: '🤝',
        value: 'colleague.dealsCount',
        label: 'صفقة'
      },
      {
        icon: '💰',
        value: 'colleague.revenue',
        label: 'ريال',
        format: 'currency'
      },
      {
        icon: '⭐',
        value: 'colleague.rating',
        label: 'التقييم',
        format: 'decimal (1 decimal)'
      },
      {
        icon: '📅',
        value: 'relativeTime(colleague.joinDate)',
        label: 'الانضمام'
      }
    ]
  },
  
  permissions: {
    title: '🔐 الصلاحيات',
    display: 'قائمة نقطية',
    maxVisible: 3,
    moreIndicator: '+{count} صلاحية أخرى',
    
    examples: [
      'عرض العقارات',
      'إنشاء عملاء',
      'إدارة العملاء',
      'عرض التحليلات',
      'إدارة المواعيد'
    ]
  },
  
  actions: {
    layout: 'grid grid-cols-3 gap-2',
    buttons: [
      {
        icon: 'Eye 👁️',
        text: 'عرض التفاصيل',
        action: 'openMemberDetails(colleague.id)',
        color: 'bg-blue-500',
        
        modal: {
          title: 'تفاصيل العضو',
          tabs: [
            {
              id: 'overview',
              name: 'نظرة عامة',
              content: [
                'المعلومات الكاملة',
                'الإحصائيات التفصيلية',
                'التقييم والأداء'
              ]
            },
            {
              id: 'permissions',
              name: 'الصلاحيات',
              content: 'قائمة كاملة بالصلاحيات'
            },
            {
              id: 'activity',
              name: 'النشاط',
              content: 'سجل النشاط والمعاملات'
            },
            {
              id: 'clients',
              name: 'العملاء',
              content: 'العملاء المعينين له'
            }
          ]
        }
      },
      {
        icon: 'Settings ⚙️',
        text: 'تعديل الصلاحيات',
        action: 'openPermissionsDialog(colleague.id)',
        color: 'bg-[#D4AF37]',
        textColor: 'text-[#01411C]',
        
        dialog: {
          title: 'تعديل الصلاحيات',
          
          categories: [
            {
              name: 'CRM',
              permissions: [
                { id: 'crm_view_all', label: 'عرض جميع العملاء', checked: true },
                { id: 'crm_view_own', label: 'عرض عملائه فقط', checked: false },
                { id: 'crm_create', label: 'إنشاء عملاء جدد', checked: true },
                { id: 'crm_edit_all', label: 'تعديل جميع العملاء', checked: false },
                { id: 'crm_edit_own', label: 'تعديل عملائه فقط', checked: true },
                { id: 'crm_delete', label: 'حذف عملاء', checked: false },
                { id: 'crm_assign', label: 'تعيين عملاء لأعضاء', checked: false }
              ]
            },
            {
              name: 'العروض والطلبات',
              permissions: [
                { id: 'offers_view', label: 'عرض العروض', checked: true },
                { id: 'offers_accept', label: 'قبول عروض من السوق', checked: true },
                { id: 'offers_create', label: 'إنشاء عروض', checked: true },
                { id: 'offers_edit', label: 'تعديل العروض', checked: true }
              ]
            },
            {
              name: 'المواعيد',
              permissions: [
                { id: 'calendar_view_all', label: 'عرض جميع المواعيد', checked: false },
                { id: 'calendar_view_own', label: 'عرض مواعيده فقط', checked: true },
                { id: 'calendar_create', label: 'إنشاء مواعيد', checked: true },
                { id: 'calendar_edit', label: 'تعديل المواعيد', checked: true }
              ]
            },
            {
              name: 'التحليلات',
              permissions: [
                { id: 'analytics_view_all', label: 'عرض تحليلات الشركة', checked: false },
                { id: 'analytics_view_own', label: 'عرض تحليلاته الشخصية', checked: true }
              ]
            },
            {
              name: 'المستندات',
              permissions: [
                { id: 'documents_view', label: 'عرض المستندات', checked: true },
                { id: 'documents_create', label: 'إنشاء مستندات', checked: true },
                { id: 'documents_edit', label: 'تعديل المستندات', checked: false }
              ]
            },
            {
              name: 'الإعدادات',
              permissions: [
                { id: 'settings_company', label: 'إعدادات الشركة', checked: false },
                { id: 'settings_team', label: 'إدارة الفريق', checked: false },
                { id: 'settings_billing', label: 'الفواتير والاشتراكات', checked: false }
              ]
            }
          ],
          
          presets: [
            {
              name: 'مدير',
              permissions: 'all except settings_billing'
            },
            {
              name: 'وسيط أول',
              permissions: 'crm_view_all + own management'
            },
            {
              name: 'وسيط',
              permissions: 'own only'
            },
            {
              name: 'مراقب',
              permissions: 'view only'
            }
          ],
          
          buttons: [
            { text: 'إلغاء', variant: 'outline' },
            { text: 'حفظ التغييرات', variant: 'default', color: 'bg-[#01411C]' }
          ]
        }
      },
      {
        icon: 'MoreVertical ⋯',
        text: 'المزيد',
        action: 'toggleMemberMenu(colleague.id)',
        color: 'bg-gray-500',
        
        menu: [
          {
            icon: 'MessageSquare',
            text: 'إرسال رسالة',
            action: `window.open(\`https://wa.me/\${colleague.phone}\`)`
          },
          {
            icon: 'Phone',
            text: 'اتصال',
            action: `window.open(\`tel:\${colleague.phone}\`)`
          },
          {
            icon: 'Mail',
            text: 'إرسال بريد',
            action: `window.open(\`mailto:\${colleague.email}\`)`
          },
          {
            icon: 'UserPlus',
            text: 'إعادة تعيين العملاء',
            action: 'openReassignDialog(colleague.id)',
            
            dialog: {
              title: 'إعادة تعيين العملاء',
              content: [
                'قائمة العملاء المعينين حالياً',
                'اختيار عضو جديد',
                'سبب إعادة التعيين (اختياري)'
              ],
              action: 'reassignCustomers()'
            }
          },
          {
            icon: 'TrendingUp',
            text: 'عرض الأداء',
            action: 'openPerformanceAnalytics(colleague.id)',
            
            page: {
              title: 'تحليلات الأداء',
              charts: [
                'الصفقات الشهرية',
                'الإيرادات',
                'معدل التحويل',
                'رضا العملاء',
                'مقارنة بالفريق'
              ]
            }
          },
          {
            icon: 'Shield',
            text: 'تغيير الدور',
            action: 'openChangeRoleDialog(colleague.id)',
            
            dialog: {
              title: 'تغيير الدور',
              options: ['مدير', 'وسيط', 'مراقب'],
              warning: 'تغيير الدور سيؤثر على الصلاحيات'
            }
          },
          {
            icon: 'UserMinus',
            text: 'إيقاف مؤقت',
            action: 'suspendMember(colleague.id)',
            color: 'text-orange-600',
            confirm: {
              title: 'تأكيد الإيقاف',
              message: 'هل تريد إيقاف هذا العضو مؤقتاً؟',
              note: 'لن يتمكن من تسجيل الدخول حتى إعادة التفعيل'
            }
          },
          {
            icon: 'Trash2',
            text: 'إزالة من الفريق',
            action: 'removeMember(colleague.id)',
            color: 'text-red-600',
            confirm: {
              title: 'تأكيد الإزالة',
              message: 'هل أنت متأكد من إزالة هذا العضو؟',
              warning: 'سيتم نقل عملائه إلى المدير',
              danger: true
            }
          }
        ]
      }
    ]
  }
};
```

---

### **D) نظام الصلاحيات الكامل**

```typescript
const PermissionsSystem = {
  roles: {
    admin: {
      name: 'مدير 👑',
      color: 'red',
      permissions: 'all_permissions',
      description: 'صلاحيات كاملة على النظام',
      
      defaultPermissions: [
        // CRM
        'crm_view_all', 'crm_create', 'crm_edit_all', 'crm_delete', 'crm_assign',
        
        // Offers
        'offers_view', 'offers_accept', 'offers_create', 'offers_edit',
        
        // Calendar
        'calendar_view_all', 'calendar_create', 'calendar_edit',
        
        // Analytics
        'analytics_view_all',
        
        // Documents
        'documents_view', 'documents_create', 'documents_edit',
        
        // Settings
        'settings_company', 'settings_team'
      ]
    },
    
    agent: {
      name: 'وسيط 👤',
      color: 'blue',
      permissions: 'standard',
      description: 'صلاحيات قياسية للوسطاء',
      
      defaultPermissions: [
        // CRM - own only
        'crm_view_own', 'crm_create', 'crm_edit_own',
        
        // Offers
        'offers_view', 'offers_accept', 'offers_create',
        
        // Calendar - own only
        'calendar_view_own', 'calendar_create',
        
        // Analytics - own only
        'analytics_view_own',
        
        // Documents
        'documents_view', 'documents_create'
      ]
    },
    
    viewer: {
      name: 'مراقب 👁️',
      color: 'gray',
      permissions: 'view_only',
      description: 'عرض فقط بدون تعديل',
      
      defaultPermissions: [
        'crm_view_own',
        'offers_view',
        'calendar_view_own',
        'analytics_view_own',
        'documents_view'
      ]
    }
  },
  
  categories: [
    {
      id: 'crm',
      name: 'إدارة العملاء',
      icon: 'Users',
      permissions: [
        {
          id: 'crm_view_all',
          name: 'عرض جميع العملاء',
          description: 'يمكنه رؤية جميع عملاء الشركة',
          restrictedTo: ['admin']
        },
        {
          id: 'crm_view_own',
          name: 'عرض عملائه فقط',
          description: 'يرى العملاء المعينين له فقط',
          defaultFor: ['agent', 'viewer']
        },
        {
          id: 'crm_create',
          name: 'إنشاء عملاء جدد',
          description: 'يمكنه إضافة عملاء جدد',
          defaultFor: ['admin', 'agent']
        },
        {
          id: 'crm_edit_all',
          name: 'تعديل جميع العملاء',
          description: 'يمكنه تعديل بيانات جميع العملاء',
          restrictedTo: ['admin']
        },
        {
          id: 'crm_edit_own',
          name: 'تعديل عملائه فقط',
          description: 'يمكنه تعديل عملائه فقط',
          defaultFor: ['agent']
        },
        {
          id: 'crm_delete',
          name: 'حذف عملاء',
          description: 'يمكنه حذف العملاء',
          restrictedTo: ['admin'],
          dangerous: true
        },
        {
          id: 'crm_assign',
          name: 'تعيين عملاء',
          description: 'يمكنه تعيين العملاء لأعضاء الفريق',
          restrictedTo: ['admin']
        }
      ]
    },
    {
      id: 'offers',
      name: 'العروض والطلبات',
      icon: 'Home',
      permissions: [
        {
          id: 'offers_view',
          name: 'عرض العروض',
          description: 'يمكنه رؤية العروض في السوق',
          defaultFor: ['admin', 'agent', 'viewer']
        },
        {
          id: 'offers_accept',
          name: 'قبول عروض',
          description: 'يمكنه قبول عروض من السوق',
          defaultFor: ['admin', 'agent']
        },
        {
          id: 'offers_create',
          name: 'إنشاء عروض',
          description: 'يمكنه إنشاء عروض جديدة',
          defaultFor: ['admin', 'agent']
        },
        {
          id: 'offers_edit',
          name: 'تعديل العروض',
          description: 'يمكنه تعديل العروض',
          defaultFor: ['admin']
        }
      ]
    },
    {
      id: 'calendar',
      name: 'المواعيد',
      icon: 'Calendar',
      permissions: [
        {
          id: 'calendar_view_all',
          name: 'عرض جميع المواعيد',
          description: 'يرى مواعيد جميع أعضاء الفريق',
          restrictedTo: ['admin']
        },
        {
          id: 'calendar_view_own',
          name: 'عرض مواعيده فقط',
          description: 'يرى مواعيده الشخصية فقط',
          defaultFor: ['agent', 'viewer']
        },
        {
          id: 'calendar_create',
          name: 'إنشاء مواعيد',
          description: 'يمكنه جدولة مواعيد جديدة',
          defaultFor: ['admin', 'agent']
        },
        {
          id: 'calendar_edit',
          name: 'تعديل المواعيد',
          description: 'يمكنه تعديل وإلغاء المواعيد',
          defaultFor: ['admin', 'agent']
        }
      ]
    },
    {
      id: 'analytics',
      name: 'التحليلات',
      icon: 'BarChart',
      permissions: [
        {
          id: 'analytics_view_all',
          name: 'تحليلات الشركة',
          description: 'يرى تحليلات وأداء الشركة بالكامل',
          restrictedTo: ['admin']
        },
        {
          id: 'analytics_view_own',
          name: 'تحليلاته الشخصية',
          description: 'يرى أداءه الشخصي فقط',
          defaultFor: ['agent', 'viewer']
        }
      ]
    },
    {
      id: 'documents',
      name: 'المستندات',
      icon: 'FileText',
      permissions: [
        {
          id: 'documents_view',
          name: 'عرض المستندات',
          description: 'يمكنه رؤية المستندات',
          defaultFor: ['admin', 'agent', 'viewer']
        },
        {
          id: 'documents_create',
          name: 'إنشاء مستندات',
          description: 'يمكنه إنشاء سندات قبض وعروض أسعار',
          defaultFor: ['admin', 'agent']
        },
        {
          id: 'documents_edit',
          name: 'تعديل المستندات',
          description: 'يمكنه تعديل وحذف المستندات',
          restrictedTo: ['admin']
        }
      ]
    },
    {
      id: 'settings',
      name: 'الإعدادات',
      icon: 'Settings',
      permissions: [
        {
          id: 'settings_company',
          name: 'إعدادات الشركة',
          description: 'يمكنه تعديل إعدادات الشركة',
          restrictedTo: ['admin'],
          dangerous: true
        },
        {
          id: 'settings_team',
          name: 'إدارة الفريق',
          description: 'يمكنه إضافة وإزالة أعضاء الفريق',
          restrictedTo: ['admin'],
          dangerous: true
        },
        {
          id: 'settings_billing',
          name: 'الفواتير',
          description: 'يمكنه رؤية وإدارة الفواتير والاشتراكات',
          restrictedTo: ['owner_only'],
          dangerous: true
        }
      ]
    }
  ]
};
```

---

## 🔗 **الربط والتكامل:**

### **1. الربط مع CRM - تعيين العملاء:**

```typescript
const CRMAssignmentIntegration = {
  // من CRM إلى تعيين عضو
  fromCRM: {
    trigger: 'Click "تعيين لعضو فريق" في بطاقة العميل',
    condition: 'user.type !== "individual"',
    
    modal: {
      title: 'تعيين العميل لعضو فريق',
      content: {
        customer: {
          name: 'customer.name',
          phone: 'customer.phone',
          category: 'customer.category'
        },
        
        teamMembers: {
          source: 'getTeamMembers()',
          filter: 'role !== "viewer" && status === "active"',
          display: [
            {
              avatar: 'صورة العضو',
              name: 'الاسم',
              role: 'الدور',
              stats: {
                currentClients: 'عدد العملاء الحالي',
                maxCapacity: 'الحد الأقصى',
                loadPercentage: 'نسبة التحميل'
              }
            }
          ],
          
          recommendation: {
            enabled: true,
            algorithm: 'أقل تحميل + التخصص',
            badge: '⭐ مقترح'
          }
        }
      },
      
      buttons: [
        { text: 'إلغاء', action: 'close' },
        { text: 'تعيين', action: 'assignCustomer()' }
      ]
    },
    
    onAssign: `
      const assignCustomerToTeamMember = (customerId, memberId) => {
        // 1. تحديث العميل
        updateCustomer(customerId, {
          assignedTo: memberId,
          assignedToName: member.name,
          assignedAt: new Date().toISOString()
        });
        
        // 2. إضافة لسجل التعيينات
        addAssignmentHistory({
          customerId,
          memberId,
          assignedBy: currentUser.id,
          timestamp: new Date().toISOString()
        });
        
        // 3. إشعار للعضو
        NotificationsAPI.notifyNewAssignment(memberId, customer);
        
        // 4. تحديث إحصائيات العضو
        updateMemberStats(memberId, {
          assignedCustomers: +1
        });
        
        // 5. حفظ
        saveAllCustomers(customers);
        
        // 6. إشعار نجاح
        toast.success(\`تم تعيين \${customer.name} لـ \${member.name}\`);
      }
    `
  },
  
  // من إدارة الفريق إلى إعادة التعيين
  fromTeamManagement: {
    trigger: 'Click "إعادة تعيين العملاء" في قائمة العضو',
    
    modal: {
      title: 'إعادة تعيين العملاء',
      content: {
        currentMember: {
          name: 'اسم العضو الحالي',
          assignedCustomers: 'قائمة العملاء (مع checkboxes)'
        },
        
        newMember: {
          selector: 'اختيار عضو جديد',
          options: 'قائمة أعضاء الفريق (عدا الحالي)'
        },
        
        reason: {
          textarea: 'سبب إعادة التعيين (اختياري)',
          placeholder: 'مثل: إعادة توزيع الحمل، تخصص مختلف، إلخ'
        },
        
        selectAll: {
          checkbox: 'تحديد الكل',
          count: 'عدد العملاء المحددين'
        }
      },
      
      buttons: [
        { text: 'إلغاء', action: 'close' },
        { text: 'إعادة التعيين', action: 'reassignCustomers()' }
      ]
    }
  }
};
```

### **2. الربط مع التحليلات:**

```typescript
const AnalyticsIntegration = {
  teamAnalytics: {
    path: '/analytics',
    tab: 'team-performance',
    
    metrics: [
      {
        name: 'أداء الفريق الشهري',
        chart: 'Bar Chart',
        data: {
          x: 'الأشهر',
          y: 'الصفقات',
          groupBy: 'member'
        }
      },
      {
        name: 'مقارنة الإيرادات',
        chart: 'Pie Chart',
        data: {
          members: 'قائمة الأعضاء',
          revenue: 'إيرادات كل عضو',
          percentage: 'النسبة من الإجمالي'
        }
      },
      {
        name: 'معدل التحويل',
        chart: 'Line Chart',
        data: {
          x: 'الوقت',
          y: 'معدل التحويل %',
          compare: 'بين الأعضاء'
        }
      },
      {
        name: 'توزيع العملاء',
        chart: 'Donut Chart',
        data: {
          members: 'الأعضاء',
          assignedCustomers: 'عدد العملاء المعينين'
        }
      }
    ],
    
    leaderboard: {
      title: 'لوحة المتصدرين',
      sortBy: ['صفقات', 'إيرادات', 'تقييم'],
      display: [
        {
          rank: 1,
          badge: '🥇 الأول',
          member: 'معلومات العضو',
          stats: 'الإحصائيات'
        },
        {
          rank: 2,
          badge: '🥈 الثاني',
          member: 'معلومات العضو',
          stats: 'الإحصائيات'
        },
        {
          rank: 3,
          badge: '🥉 الثالث',
          member: 'معلومات العضو',
          stats: 'الإحصائيات'
        }
      ]
    }
  },
  
  memberAnalytics: {
    trigger: 'Click "عرض الأداء" في قائمة العضو',
    
    page: {
      title: 'تحليلات أداء {memberName}',
      
      overview: {
        period: 'آخر 6 أشهر',
        stats: [
          { label: 'الصفقات المكتملة', value: 23, trend: '+15%' },
          { label: '��لإيرادات', value: '450,000 ريال', trend: '+22%' },
          { label: 'العملاء النشطون', value: 18, trend: '+8%' },
          { label: 'معدل التحويل', value: '35%', trend: '+5%' }
        ]
      },
      
      charts: [
        {
          title: 'الصفقات الشهرية',
          type: 'Bar + Line',
          data: 'صفقات + هدف',
          period: 'آخر 12 شهر'
        },
        {
          title: 'قمع المبيعات',
          type: 'Funnel',
          stages: [
            'عملاء جدد',
            'تم التواصل',
            'مؤهل',
            'تفاوض',
            'تم التحويل'
          ]
        },
        {
          title: 'توزيع الوقت',
          type: 'Pie',
          data: [
            'المكالمات',
            'المواعيد',
            'المتابعات',
            'إدارية'
          ]
        }
      ],
      
      comparison: {
        title: 'المقارنة بالفريق',
        metrics: [
          'متوسط الصفقات',
          'متوسط الإيرادات',
          'متوسط معدل التحويل'
        ],
        display: 'Bar Chart مع خط للمتوسط'
      }
    }
  }
};
```

---

## 📊 **خريطة التدفق الكاملة:**

```
┌────────────────────────────────────────────────────────────┐
│         👤 المستخدم يفتح إدارة الفريق                     │
│         (من RightSlider أو LeftSlider)                    │
└────────────────────────┬───────────────────────────────────┘
                         │
            ┌────────────▼────────────┐
            │  عرض إحصائيات الفريق   │
            │  • إجمالي الأعضاء       │
            │  • النشطون             │
            │  • الإيرادات           │
            │  • الصفقات             │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │  عرض بطاقات الأعضاء    │
            │  • معلومات كاملة        │
            │  • إحصائيات            │
            │  • صلاحيات             │
            └────────────┬────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │ إضافة   │     │ تعديل   │     │ إدارة    │
   │ عضو     │     │ صلاحيات │     │ عملاء    │
   └────┬────┘     └────┬────┘     └────┬────┘
        │                │                │
        │                │                │
   ┌────▼────────────────▼────────────────▼────┐
   │          حفظ في localStorage               │
   │          team_colleagues                   │
   │          + مزامنة مع CRM                   │
   └───────────────────────────────────────────┘
```

---

**يتبع في الجزء الثاني: تحليلات السوق...**
