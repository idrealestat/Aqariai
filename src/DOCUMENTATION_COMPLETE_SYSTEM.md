# 📋 التوثيق الحرفي الشامل - نظام العروض الأساسية والفرعية مع الربط الكامل

## 🎯 الملخص التنفيذي

### النظام المتكامل:
1. ✅ **نظام الأقسام**: أساسي (Main Offers) + فرعي (Sub Offers)
2. ✅ **الربط بمنصتي**: عرض الإعلانات المنشورة للجمهور
3. ✅ **الربط بزر النشر**: من صفحة النشر → لوحة التحكم → منصتي

---

## 1️⃣ نظام الأقسام الأساسية والفرعية

### 📐 الهيكلية الكاملة

```
العروض في لوحة التحكم
│
├── عرض أساسي (Main Offer)
│   ├── العنوان: "شقق للبيع - الرياض"
│   ├── الموقع: المدينة (تجميع)
│   ├── السعر: من أول عقار
│   ├── الصور: من أول عقار
│   ├── الإحصائيات: مجموع الكل
│   │
│   └── عروض فرعية (Sub Offers) ← يتم فتحها بزر التوسيع
│       ├── عرض فرعي 1: شقة 3 غرف (#AD-2025-001)
│       ├── عرض فرعي 2: شقة 4 غرف (#AD-2025-002)
│       └── عرض فرعي 3: شقة دوبليكس (#AD-2025-003)
│
└── عرض أساسي آخر
    └── عروض فرعية...
```

### 📝 التعريفات (Interfaces) - حرفياً

```typescript
// السطر 29-38 من /components/OffersControlDashboard.tsx
interface SubOffer {
  id: string;
  title: string;
  price: string;
  adNumber: string;
  image: string;
  imageCount: number;
  ownerName?: string; // اسم المالك - يظهر فقط في القائمة الفرعية
  ownerPhone?: string; // رقم جوال المالك
}

// السطر 46-61 من /components/OffersControlDashboard.tsx
interface Offer {
  id: string;
  title: string;
  location: string;
  price: string;
  adNumber: string;
  images: string[];
  views: number;
  requests: number;
  isPinned: boolean;
  lastOpened: string;
  date: Date;
  subOffers: SubOffer[];  // ← المصفوفة الفرعية
  isExpanded: boolean;     // ← حالة التوسيع
  owner: Owner;
}
```

### 🔄 آلية التحويل والتجميع

#### الدالة الرئيسية: `convertPublishedAdsToOffers`

**الموقع**: السطر 579-647 من `/components/OffersControlDashboard.tsx`

```typescript
const convertPublishedAdsToOffers = (ads: PublishedAd[]): Offer[] => {
  console.log('📊 ==================== لوحة التحكم: تحليل الإعلانات ====================');
  console.log('📊 إجمالي الإعلانات المحفوظة:', ads.length);
  console.log('📋 تفاصيل جميع الإعلانات:', ads.map(ad => ({
    adNumber: ad.adNumber,
    status: ad.status,
    city: ad.location?.city,
    ownerName: ad.ownerName
  })));
  
  // ✅ فلترة الإعلانات بحالة 'published' أو 'draft' (كلاهما يُعرض في لوحة التحكم)
  const publishedAds = ads.filter(ad => ad.status === 'published' || ad.status === 'draft');
  
  console.log(`✅ إعلانات تُعرض في لوحة التحكم (published + draft): ${publishedAds.length}`);
  console.log('   - منشورة (published):', ads.filter(ad => ad.status === 'published').length);
  console.log('   - مسودة (draft):', ads.filter(ad => ad.status === 'draft').length);
  console.log('📋 أرقام الإعلانات المعروضة:', publishedAds.map(ad => `${ad.adNumber} [${ad.status}]`));
  console.log('📊 ================================================================');
  
  // تجميع الإعلانات حسب المدينة
  const groupedByCity: { [key: string]: PublishedAd[] } = {};
  
  publishedAds.forEach(ad => {
    const city = ad.location?.city || 'مدينة غير محددة';
    if (!groupedByCity[city]) {
      groupedByCity[city] = [];
    }
    groupedByCity[city].push(ad);
  });
  
  // تحويل كل مجموعة لعرض رئيسي
  return Object.entries(groupedByCity).map(([city, cityAds]) => {
    // أخذ أول إعلان كممثل للمجموعة
    const mainAd = cityAds[0];
    
    // تحويل جميع الإعلانات في المدينة لعروض فرعية
    const subOffers: SubOffer[] = cityAds.map(ad => ({
      id: ad.id,
      title: ad.title || 'بدون عنوان',
      price: `${parseInt(ad.price || '0').toLocaleString()} ريال`,
      adNumber: `#${ad.adNumber || 'غير محدد'}`,  // ✅ فقط # بدون "إعلان رقم: "
      image: ad.mediaFiles?.[0]?.url || 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      imageCount: ad.mediaFiles?.length || 0,
      ownerName: ad.ownerName,
      ownerPhone: ad.ownerPhone
    }));
    
    return {
      id: `offer-${city}-${Date.now()}`,
      title: `${mainAd.propertyType || 'عقار'} ${mainAd.purpose === 'sale' ? 'للبيع' : 'للإيجار'} - ${city}`,
      location: city,
      price: `${parseInt(mainAd.price || '0').toLocaleString()} ريال`,
      adNumber: `#${mainAd.adNumber || 'N/A'}`,  // ✅ يبقى كما هو
      images: mainAd.mediaFiles?.slice(0, 3).map(f => f.url) || [],
      views: mainAd.stats?.views || 0,
      requests: mainAd.stats?.requests || 0,
      isPinned: false,
      lastOpened: 'منذ قليل',
      date: new Date(mainAd.createdAt),
      isExpanded: false,
      owner: {
        id: `owner-${mainAd.ownerPhone}`,
        name: mainAd.ownerName || 'مالك غير محدد',
        phone: mainAd.ownerPhone || ''
      },
      subOffers  // ← هنا تُضاف العروض الفرعية
    };
  });
};
```

### 📊 خطوات التجميع التفصيلية

#### الخطوة 1: الفلترة
```typescript
// السطر 590
const publishedAds = ads.filter(ad => ad.status === 'published' || ad.status === 'draft');
```
- **يُعرض**: الإعلانات بحالة `published` أو `draft`
- **لا يُعرض**: الإعلانات بحالة `demo` أو أي حالة أخرى

#### الخطوة 2: التجميع حسب المدينة
```typescript
// السطر 599-607
const groupedByCity: { [key: string]: PublishedAd[] } = {};

publishedAds.forEach(ad => {
  const city = ad.location?.city || 'مدينة غير محددة';
  if (!groupedByCity[city]) {
    groupedByCity[city] = [];
  }
  groupedByCity[city].push(ad);
});
```

**مثال**:
```javascript
{
  'الرياض': [ad1, ad2, ad3],
  'جدة': [ad4, ad5],
  'مكة': [ad6]
}
```

#### الخطوة 3: إنشاء العروض الرئيسية + الفرعية
```typescript
// السطر 610-646
return Object.entries(groupedByCity).map(([city, cityAds]) => {
  const mainAd = cityAds[0];  // أول إعلان = البيانات الرئيسية
  
  const subOffers: SubOffer[] = cityAds.map(ad => ({
    // تحويل كل إعلان لعرض فرعي
  }));
  
  return {
    // بيانات العرض الرئيسي من mainAd
    subOffers  // جميع الإعلانات كعروض فرعية
  };
});
```

### 🎨 العرض المرئي

#### العرض الأساسي (مطوي)

```tsx
{/* السطر 1170-1410 تقريباً */}
<Card className="relative border-2 border-[#D4AF37] bg-white shadow-xl rounded-xl overflow-hidden">
  {/* صورة العقار */}
  <div className="relative h-64">
    <img src={offer.images[0]} className="w-full h-full object-cover" />
  </div>
  
  {/* العنوان والمعلومات */}
  <div className="p-4">
    <h3 className="text-xl font-bold text-[#01411C]">
      {offer.title}  {/* مثال: "شقق للبيع - الرياض" */}
    </h3>
    
    <div className="flex items-center gap-2 text-gray-600">
      <MapPin className="w-4 h-4" />
      <span>{offer.location}</span>  {/* مثال: "الرياض" */}
    </div>
    
    <div className="text-2xl font-bold text-[#D4AF37]">
      {offer.price}  {/* مثال: "850,000 ريال" */}
    </div>
  </div>
  
  {/* زر التوسيع (إذا كان هناك عروض فرعية) */}
  {offer.subOffers.length > 0 && (
    <button
      onClick={() => toggleOfferExpansion(offer.id)}
      className="flex items-center gap-1 px-2 py-1 bg-[#D4AF37] text-[#01411C] rounded-full text-xs font-bold hover:bg-[#b8941f] transition-all"
    >
      {expandedOffers.has(offer.id) ? (
        <>
          <ChevronUp className="w-4 h-4" />
          <span>إخفاء العروض ({offer.subOffers.length})</span>
        </>
      ) : (
        <>
          <ChevronDown className="w-4 h-4" />
          <span>عرض جميع العقارات ({offer.subOffers.length})</span>
        </>
      )}
    </button>
  )}
</Card>
```

#### العروض الفرعية (عند التوسيع)

```tsx
{/* السطر 1580-1800 تقريباً */}
{expandedOffers.has(offer.id) && offer.subOffers.length > 0 && (
  <div className="mt-4 space-y-3 bg-gradient-to-b from-gray-50 to-white p-4 rounded-lg border-2 border-dashed border-[#D4AF37]">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-bold text-[#01411C] flex items-center gap-2">
        <Home className="w-5 h-5 text-[#D4AF37]" />
        العقارات المتاحة ({offer.subOffers.length})
      </h4>
    </div>
    
    {/* قائمة العروض الفرعية */}
    <div className="space-y-2">
      {offer.subOffers.map((subOffer, index) => (
        <div
          key={subOffer.id}
          className="bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-[#D4AF37] transition-all cursor-pointer"
          onClick={() => setSelectedSubOfferForEdit(subOffer)}
        >
          <div className="flex items-center gap-3">
            {/* Checkbox للتحديد */}
            <input
              type="checkbox"
              checked={selectedSubOffers.has(subOffer.id)}
              onChange={() => toggleSubOfferSelection(subOffer.id)}
              className="w-5 h-5 rounded border-gray-500 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
            />
            
            {/* صورة مصغرة */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img src={subOffer.image} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                {subOffer.imageCount} صور
              </div>
            </div>
            
            {/* المعلومات */}
            <div className="flex-1">
              <h5 className="font-bold text-sm text-[#01411C]">
                {subOffer.title}
              </h5>
              <div className="text-xs text-gray-500">
                {subOffer.adNumber}
              </div>
              <div className="text-sm font-bold text-[#D4AF37]">
                {subOffer.price}
              </div>
              
              {/* معلومات المالك (تظهر فقط في الفرعي) */}
              {subOffer.ownerName && (
                <div className="text-xs text-gray-600 mt-1">
                  👤 {subOffer.ownerName}
                </div>
              )}
            </div>
            
            {/* حالة النشر (دائرة خضراء أو زر نشر) */}
            <div className="flex items-center gap-1.5">
              {/* سيتم شرحها في القسم التالي */}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

### 🔄 State Management للتوسيع

```typescript
// السطر 101
const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());

// السطر 653-663
const toggleOfferExpansion = (offerId: string) => {
  setExpandedOffers(prev => {
    const newSet = new Set(prev);
    if (newSet.has(offerId)) {
      newSet.delete(offerId);  // إغلاق
    } else {
      newSet.add(offerId);     // فتح
    }
    return newSet;
  });
};
```

**الاستخدام**:
```tsx
{/* فحص حالة التوسيع */}
{expandedOffers.has(offer.id) && (
  /* عرض العروض الفرعية */
)}

{/* زر التوسيع */}
<button onClick={() => toggleOfferExpansion(offer.id)}>
  {expandedOffers.has(offer.id) ? 'إخفاء' : 'عرض'}
</button>
```

---

## 2️⃣ الربط بمنصتي للعرض

### 🌐 آلية الربط الكاملة

```
زر النشر (property-upload-complete.tsx)
         ↓
حفظ الإعلان بحالة 'published'
         ↓
localStorage: publishedAds
         ↓
لوحة التحكم (OffersControlDashboard.tsx)
         ↓
عرض: published + draft
         ↓
منصتي (MyPlatform.tsx)
         ↓
عرض: published فقط ✅
```

### 📂 التخزين في localStorage

**المفتاح**: `'publishedAds'`

**البنية**:
```typescript
interface PublishedAd {
  id: string;
  adNumber: string;
  status: 'published' | 'draft' | 'demo';  // ← المفتاح الرئيسي
  ownerPhone: string;
  ownerName: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: string;
  purpose: string;
  price: string;
  area: string;
  bedrooms?: string;
  bathrooms?: string;
  location: {
    city: string;
    district: string;
    street?: string;
    postalCode?: string;
    buildingNumber?: string;
    additionalNumber?: string;
    latitude?: number;
    longitude?: number;
  };
  mediaFiles: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    name: string;
  }>;
  publishedPlatforms: Array<{
    id: string;
    name: string;
    status: 'published' | 'failed';
    publishedAt: Date;
    adUrl?: string;
  }>;
  hashtags: string[];
  platformPath?: string;
  advertisingLicense?: string;
  advertisingLicenseStatus?: string;
  aiGeneratedDescription?: string;
  aiLanguage?: string;
  aiTone?: string;
  createdAt: Date;
  publishedAt: Date;
  updatedAt: Date;
  virtualTourLink?: string;
  whatsappNumber?: string;
  warranties?: Array<{
    type: string;
    duration: string;
    details: string;
  }>;
  customFeatures?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  stats?: {
    views: number;
    requests: number;
    likes: number;
    shares: number;
  };
  notes?: string;
}
```

### 🎯 الحالات الثلاث

| الحالة | لوحة التحكم | منصتي | الوصف |
|--------|-------------|-------|-------|
| `published` | ✅ يظهر | ✅ يظهر | منشور للجمهور |
| `draft` | ✅ يظهر | ❌ مخفي | محفوظ للوسيط فقط |
| `demo` | ❌ مخفي | ❌ مخفي | بيانات تجريبية |

### 🔍 الفلترة في لوحة التحكم

```typescript
// السطر 590 من OffersControlDashboard.tsx
const publishedAds = ads.filter(ad => ad.status === 'published' || ad.status === 'draft');
```

### 🔍 الفلترة في منصتي

**الموقع**: `/components/MyPlatform.tsx`

```typescript
// تحميل الإعلانات المنشورة فقط
useEffect(() => {
  const loadPublishedAds = () => {
    const allAds = getAllPublishedAds();
    
    // فلترة: published فقط ✅
    const onlyPublished = allAds.filter(ad => ad.status === 'published');
    
    setPublishedAds(onlyPublished);
  };
  
  loadPublishedAds();
  
  // الاستماع للتحديثات
  window.addEventListener('publishedAdSaved', loadPublishedAds);
  window.addEventListener('publishedAdStatusChanged', loadPublishedAds);
  
  return () => {
    window.removeEventListener('publishedAdSaved', loadPublishedAds);
    window.removeEventListener('publishedAdStatusChanged', loadPublishedAds);
  };
}, []);
```

### 🟢 الدائرة الخضراء (مؤشر النشر)

**الشرط للظهور**:
```typescript
const publishedAd = publishedAdsMap.get(cleanAdNumber);

if (publishedAd?.status === 'published') {
  // يظهر: دائرة خضراء + زر إخفاء
} else {
  // يظهر: زر نشر على منصتي
}
```

**الكود الحرفي**:
```tsx
{/* السطر 1481-1482 */}
{/* دائرة خضراء تعني: معروض على منصتي */}
<div 
  className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" 
  title="معروض على منصتي" 
/>
```

**الخصائص**:
- `w-3 h-3`: 12×12px
- `rounded-full`: دائري 100%
- `bg-green-500`: خلفية خضراء #22C55E
- `animate-pulse`: نبض متكرر
- `shadow-lg`: ظل كبير
- `title`: "معروض على منصتي"

### 🔄 تحديث الحالة في الوقت الفعلي

```typescript
// السطر 122-144 من OffersControlDashboard.tsx
useEffect(() => {
  loadOffersFromPublishedAds();
  
  // الاستماع لحدث تحديث العروض
  const handleOffersUpdated = () => {
    console.log('🔄 تحديث العروض في لوحة التحكم');
    loadOffersFromPublishedAds();
  };
  
  window.addEventListener('offersUpdated', handleOffersUpdated);
  window.addEventListener('publishedAdSaved', handleOffersUpdated);
  window.addEventListener('publishedAdStatusChanged', handleOffersUpdated);
  window.addEventListener('publishedAdUpdated', handleOffersUpdated);
  window.addEventListener('publishedAdDeleted', handleOffersUpdated);
  
  return () => {
    window.removeEventListener('offersUpdated', handleOffersUpdated);
    window.removeEventListener('publishedAdSaved', handleOffersUpdated);
    window.removeEventListener('publishedAdStatusChanged', handleOffersUpdated);
    window.removeEventListener('publishedAdUpdated', handleOffersUpdated);
    window.removeEventListener('publishedAdDeleted', handleOffersUpdated);
  };
}, []);
```

---

## 3️⃣ الربط بزر نشر العقار

### 📍 الموقع: `/components/property-upload-complete.tsx`

### 🚀 دالة النشر الرئيسية

**الموقع**: السطر 1130-1354

```typescript
const handlePublish = async () => {
  // 1️⃣ التحقق من البيانات الأساسية
  if (!propertyData.fullName || !propertyData.phoneNumber) {
    alert('⚠️ يرجى إدخال اسم المالك ورقم الجوال على الأقل');
    return;
  }

  // ✅ لا نشترط اختيار منصات - يمكن الحفظ بدون منصات
  // الإعلان سيُحفظ في لوحة التحكم على كل حال

  setIsUploading(true);

  try {
    // 2️⃣ محاكاة عملية النشر
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3️⃣ البحث عن العميل أو إنشائه
    const existingCustomer = ensureCustomerExists({
      phone: propertyData.phoneNumber,
      name: propertyData.fullName,
      idNumber: propertyData.idNumber,
      birthDate: propertyData.birthDate,
      category: 'مالك',
      source: 'إعلان منشور',
      whatsapp: propertyData.whatsappNumber || propertyData.phoneNumber
    });

    const isNewCustomer = !existingCustomer.linkedAdsCount || existingCustomer.linkedAdsCount <= 1;

    // 4️⃣ توليد رقم الإعلان
    const adNumber = generateAdNumber();
    
    // 5️⃣ جمع المنصات المنشور عليها
    const publishedPlatforms = platforms
      .filter(p => selectedPlatforms.includes(p.id))
      .map(p => ({
        id: p.id,
        name: p.name,
        status: 'published' as const,
        publishedAt: new Date(),
        adUrl: platformLinks[p.id] || undefined
      }));

    // 6️⃣ إنشاء كائن الإعلان المنشور
    const publishedAd: PublishedAd = {
      id: Date.now().toString(),
      adNumber,
      ownerPhone: propertyData.phoneNumber,
      ownerName: propertyData.fullName,
      ownerId: existingCustomer.id,
      title: `${propertyData.purpose} ${propertyData.propertyType}`,
      description: propertyData.aiDescription.generatedText || '',
      propertyType: propertyData.propertyType,
      purpose: propertyData.purpose,
      price: propertyData.finalPrice,
      area: propertyData.area,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      location: {
        city: propertyData.locationDetails?.city || '',
        district: propertyData.locationDetails?.district || '',
        street: propertyData.locationDetails?.street || '',
        postalCode: propertyData.locationDetails?.postalCode || '',
        buildingNumber: propertyData.locationDetails?.buildingNumber || '',
        additionalNumber: propertyData.locationDetails?.additionalNumber || '',
        latitude: propertyData.locationDetails?.latitude || 0,
        longitude: propertyData.locationDetails?.longitude || 0
      },
      idNumber: propertyData.idNumber,
      idIssueDate: propertyData.idIssueDate,
      idExpiryDate: propertyData.idExpiryDate,
      deedNumber: propertyData.deedNumber,
      deedDate: propertyData.deedDate,
      deedIssuer: propertyData.deedIssuer,
      mediaFiles: propertyData.mediaFiles.map(m => ({
        id: m.id,
        url: m.url,
        type: m.type,
        name: `media-${m.id}`
      })),
      publishedPlatforms,
      hashtags: propertyData.autoHashtags,
      platformPath: propertyData.platformPath,
      advertisingLicense: propertyData.advertisingLicense,
      advertisingLicenseStatus: propertyData.advertisingLicenseStatus || 'unknown',
      aiGeneratedDescription: propertyData.aiDescription.generatedText,
      aiLanguage: propertyData.aiDescription.language,
      aiTone: propertyData.aiDescription.tone,
      createdAt: new Date(),
      publishedAt: new Date(),
      updatedAt: new Date(),
      virtualTourLink: propertyData.virtualTourLink,
      whatsappNumber: propertyData.whatsappNumber,
      warranties: propertyData.warranties,
      customFeatures: propertyData.customFeatures,
      stats: {
        views: 0,
        requests: 0,
        likes: 0,
        shares: 0
      },
      status: 'published',  // 🌐 ← منشور مباشرة على منصتي!
      notes: ''
    };

    // 7️⃣ حفظ في localStorage
    const existingAds = getAllPublishedAds();
    const updatedAds = [...existingAds, publishedAd];
    localStorage.setItem('publishedAds', JSON.stringify(updatedAds));

    // 8️⃣ تحديث عدد الإعلانات للعميل
    const customerKey = `customer_${existingCustomer.id}`;
    const customerData = JSON.parse(localStorage.getItem(customerKey) || '{}');
    customerData.linkedAdsCount = (customerData.linkedAdsCount || 0) + 1;
    customerData.linkedAds = [...(customerData.linkedAds || []), adNumber];
    localStorage.setItem(customerKey, JSON.stringify(customerData));

    // 9️⃣ رسائل النجاح
    const platformMessage = selectedPlatforms.length > 0 
      ? `\n📢 تم النشر على: ${platforms.filter(p => selectedPlatforms.includes(p.id)).map(p => p.name).join('، ')}`
      : '';

    const customerMessage = isNewCustomer
      ? `✅ تم إنشاء بطاقة عميل جديدة للمالك: ${propertyData.fullName}`
      : `✅ تم ربط الإعلان ببطاقة العميل الموجودة: ${existingCustomer.name}`;

    const successMessage = `
${customerMessage}

🌐 تم نشر الإعلان على منصتك بنجاح!

رقم الإعلان: ${adNumber}
المالك: ${propertyData.fullName}
الجوال: ${propertyData.phoneNumber}
${platformMessage}

✨ يمكنك الآن:
- إدارة الإعلان من لوحة التحكم
- تتبع الإحصائيات والطلبات
- تحديث البيانات في أي وقت
`;

    alert(successMessage);

    // 🔟 إطلاق الأحداث
    window.dispatchEvent(new Event('publishedAdSaved'));
    window.dispatchEvent(new Event('offersUpdated'));
    window.dispatchEvent(new CustomEvent('adPublishedToMyPlatform', {
      detail: { id: publishedAd.id, adNumber }
    }));

    setIsUploading(false);

    // 1️⃣1️⃣ تسجيل نشر الإعلان في نظام الإشعارات
    handleAdPublish();
    
    // 1️⃣2️⃣ الانتقال التلقائي للوحة التحكم
    setTimeout(() => {
      console.log('📊 الانتقال التلقائي للوحة التحكم...');
      
      // إطلاق حدث الانتقال للوحة التحكم
      window.dispatchEvent(new Event('switchToDashboardTab'));
      
      // الانتقال للصفحة
      if (onNavigate) {
        onNavigate('dashboard');
      }
      
      console.log('✅ تم الانتقال للوحة التحكم');
    }, 1000);

  } catch (error) {
    console.error('❌ خطأ في نشر الإعلان:', error);
    alert('❌ حدث خطأ أثناء نشر الإعلان. يرجى المحاولة مرة أخرى.');
    setIsUploading(false);
  }
};
```

### 🔗 ربط زر النشر في الواجهة

```tsx
{/* السطر 2500+ تقريباً */}
<Button
  onClick={handlePublish}
  disabled={isUploading}
  className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white py-6 text-xl font-bold hover:scale-105 transition-all shadow-2xl"
>
  {isUploading ? (
    <div className="flex items-center gap-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
      <span>جاري النشر...</span>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Globe className="w-6 h-6" />
      <span>نشر الإعلان على منصتي</span>
    </div>
  )}
</Button>
```

### 📊 سلسلة الأحداث الكاملة

```
1. المستخدم يملأ بيانات العقار
   ↓
2. يضغط زر "نشر الإعلان على منصتي"
   ↓
3. handlePublish() تبدأ العمل
   ↓
4. التحقق من البيانات الأساسية
   ↓
5. البحث عن العميل أو إنشائه
   ↓
6. توليد رقم إعلان فريد
   ↓
7. إنشاء كائن PublishedAd بحالة 'published'
   ↓
8. حفظ في localStorage → 'publishedAds'
   ↓
9. إطلاق الأحداث:
   - publishedAdSaved
   - offersUpdated
   - adPublishedToMyPlatform
   - switchToDashboardTab
   ↓
10. لوحة التحكم تستمع للأحداث
   ↓
11. loadOffersFromPublishedAds() تُنفذ
   ↓
12. convertPublishedAdsToOffers() تحول البيانات
   ↓
13. التجميع حسب المدينة
   ↓
14. إنشاء عرض رئيسي + عروض فرعية
   ↓
15. setAllOffers() تحدث الواجهة
   ↓
16. الإعلان يظهر في لوحة التحكم مع دائرة خضراء ✅
   ↓
17. منصتي تستمع للأحداث
   ↓
18. فلترة الإعلانات (published فقط)
   ↓
19. الإعلان يظهر في منصتي للجمهور ✅
   ↓
20. الانتقال التلقائي للوحة التحكم
   ↓
21. ✅ العملية مكتملة
```

### 🔄 أزرار الإخفاء/الإظهار

#### زر الإخفاء (عندما status = 'published')

```tsx
{/* السطر 1485-1517 */}
<button
  onClick={() => {
    if (publishedAd) {
      const confirm = window.confirm(`هل تريد إخفاء هذا الإعلان من منصتك العامة؟\n\nرقم الإعلان: ${offer.adNumber}\n\n⚠️ سيظل محفوظاً في لوحة التحكم الخاصة بك، لكن لن يظهر للجمهور.`);
      
      if (confirm) {
        // 1️⃣ تحديث الحالة
        updateAdStatus(publishedAd.id, 'draft');
        
        // 2️⃣ إطلاق الأحداث
        window.dispatchEvent(new Event('publishedAdSaved'));
        window.dispatchEvent(new Event('publishedAdStatusChanged'));
        
        // 3️⃣ رسالة النجاح
        setTimeout(() => {
          alert(`✅ تم إخفاء الإعلان من منصتك!\n\nرقم الإعلان: ${offer.adNumber}\n\n🔒 الإعلان الآن مخفي عن الجمهور وباقٍ في لوحة التحكم.\n🔴 الدائرة الخضراء ستختفي بعد إغلاق هذه الرسالة.`);
        }, 100);
      }
    }
  }}
  className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm"
  title="إخفاء هذا الإعلان من منصتك العامة"
>
  <Eye className="w-4 h-4" />
  <span className="font-bold">إخفاء من منصتي</span>
</button>
```

**ما يحدث**:
1. تحديث `status` من `'published'` إلى `'draft'`
2. الإعلان يبقى في لوحة التحكم ✅
3. الإعلان يختفي من منصتي ❌
4. الدائرة الخضراء تختفي ❌

#### زر النشر (عندما status = 'draft')

```tsx
{/* السطر 1524-1560 */}
<button
  onClick={() => {
    if (publishedAd) {
      // 1️⃣ تحديث الحالة
      updateAdStatus(publishedAd.id, 'published');
      
      // 2️⃣ إطلاق الأحداث
      window.dispatchEvent(new Event('publishedAdSaved'));
      window.dispatchEvent(new Event('publishedAdStatusChanged'));
      window.dispatchEvent(new CustomEvent('adPublishedToMyPlatform', { 
        detail: { id: publishedAd.id, adNumber: offer.adNumber }
      }));
      
      // 3️⃣ رسالة النجاح
      setTimeout(() => {
        alert(`✅ تم نشر الإعلان على منصتي!\n\nرقم الإعلان: ${offer.adNumber}\n\n🌐 الإعلان الآن معروض للجمهور في تبويب "منصتي".\n🟢 ستظهر الدائرة الخضراء بعد إغلاق هذه الرسالة.`);
      }, 100);
    }
  }}
  className="px-4 py-2 rounded-full bg-[#01411C] hover:bg-[#065f41] text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm"
  title="نشر هذا الإعلان على منصتك العامة"
>
  <Globe className="w-4 h-4" />
  <span className="font-bold">نشر على منصتي</span>
</button>
```

**ما يحدث**:
1. تحديث `status` من `'draft'` إلى `'published'`
2. الإعلان يبقى في لوحة التحكم ✅
3. الإعلان يظهر في منصتي ✅
4. الدائرة الخضراء تظهر ✅

---

## 4️⃣ دوال المساعدة (Utils)

### من `/utils/publishedAds.ts`

```typescript
// جلب جميع الإعلانات
export function getAllPublishedAds(): PublishedAd[] {
  const stored = localStorage.getItem('publishedAds');
  return stored ? JSON.parse(stored) : [];
}

// تحديث حالة الإعلان
export function updateAdStatus(id: string, status: 'published' | 'draft'): void {
  const ads = getAllPublishedAds();
  const index = ads.findIndex(ad => ad.id === id);
  if (index !== -1) {
    ads[index].status = status;
    ads[index].updatedAt = new Date();
    localStorage.setItem('publishedAds', JSON.stringify(ads));
  }
}

// تحديث بيانات الإعلان
export function updatePublishedAd(id: string, updates: Partial<PublishedAd>): void {
  const ads = getAllPublishedAds();
  const index = ads.findIndex(ad => ad.id === id);
  if (index !== -1) {
    ads[index] = { ...ads[index], ...updates, updatedAt: new Date() };
    localStorage.setItem('publishedAds', JSON.stringify(ads));
  }
}

// حذف الإعلان
export function deletePublishedAd(id: string): void {
  const ads = getAllPublishedAds();
  const filtered = ads.filter(ad => ad.id !== id);
  localStorage.setItem('publishedAds', JSON.stringify(filtered));
  
  // إطلاق حدث الحذف
  window.dispatchEvent(new Event('publishedAdDeleted'));
}
```

---

## 5️⃣ مخطط التدفق الكامل (Flowchart)

```
┌─────────────────────────────────────┐
│   صفحة نشر العقار                   │
│   property-upload-complete.tsx      │
└──────────────┬──────────────────────┘
               │
               │ handlePublish()
               ↓
┌─────────────────────────────────────┐
│ إنشاء PublishedAd                   │
│ status: 'published'                 │
└──────────────┬──────────────────────┘
               │
               │ localStorage.setItem()
               ↓
┌─────────────────────────────────────┐
│   localStorage                      │
│   Key: 'publishedAds'               │
│   Value: PublishedAd[]              │
└──────────────┬──────────────────────┘
               │
               │ window.dispatchEvent()
               ↓
┌─────────────────────────────────────┐
│   أحداث (Events)                    │
│   - publishedAdSaved                │
│   - offersUpdated                   │
│   - switchToDashboardTab            │
└───┬──────────────────┬──────────────┘
    │                  │
    │                  │
    ↓                  ↓
┌───────────┐    ┌─────────────┐
│ لوحة      │    │   منصتي     │
│ التحكم    │    │  MyPlatform │
└─────┬─────┘    └──────┬──────┘
      │                 │
      │ فلترة:         │ فلترة:
      │ published +    │ published فقط
      │ draft          │
      ↓                 ↓
┌─────────────┐   ┌──────────────┐
│ التجميع     │   │ عرض للجمهور  │
│ حسب المدينة │   │              │
└─────┬───────┘   └──────────────┘
      │
      ↓
┌─────────────────────────┐
│ عرض رئيسي               │
│ + عروض فرعية            │
│ + دائرة خضراء/زر نشر    │
└─────────────────────────┘
```

---

## 6️⃣ خلاصة الربط النهائية

### ✅ الأقسام الأساسية والفرعية

- **العرض الرئيسي**: يمثل مدينة كاملة
- **العروض الفرعية**: كل إعلان في تلك المدينة
- **التجميع**: تلقائي حسب المدينة
- **التوسيع**: بزر chevron

### ✅ الربط بمنصتي

- **published**: يظهر في منصتي ✅
- **draft**: مخفي من منصتي ❌
- **الدائرة الخضراء**: مؤشر النشر
- **التحديث**: فوري عند تغيير الحالة

### ✅ الربط بزر النشر

- **الحفظ**: مباشرة بحالة 'published'
- **الأحداث**: 3 أحداث رئيسية
- **الانتقال**: تلقائي للوحة التحكم
- **الظهور**: فوري في لوحة التحكم ومنصتي

---

## 7️⃣ الملفات الرئيسية المعنية

| الملف | المسار | الوظيفة |
|-------|--------|---------|
| DashboardMainView252 | `/components/DashboardMainView252.tsx` | الصفحة الرئيسية - التبويبات |
| OffersControlDashboard | `/components/OffersControlDashboard.tsx` | لوحة العروض - الأساسي والفرعي |
| MyPlatform | `/components/MyPlatform.tsx` | منصتي - العرض للجمهور |
| property-upload-complete | `/components/property-upload-complete.tsx` | صفحة النشر - زر النشر |
| publishedAds utils | `/utils/publishedAds.ts` | دوال الإدارة |
| analytics types | `/types/analytics.ts` | أنواع البيانات |

---

هذا التوثيق الحرفي الشامل 100% يوضح:
✅ نظام الأقسام الأساسية والفرعية
✅ الربط الكامل بمنصتي للعرض
✅ الربط الكامل بزر نشر العقار
✅ كل الدوال والأحداث والتدفقات
