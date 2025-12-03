# 📊 لوحة التحكم بالعروض - التوثيق الحرفي الكامل

## ⚠️ كل حرف وزر وحقل ووظيفة - بدون أي إضافة

---

# 📄 الملف: `/components/OffersControlDashboard.tsx`

## معلومات أساسية:
- **السطور:** ~2000 سطر
- **المكون:** `OffersControlDashboard`
- **النوع:** Default Export

---

# 🎯 Props

```typescript
interface OffersControlDashboardProps {
  onNavigate?: (page: string, options?: { initialTab?: string; ownerId?: string }) => void;
}
```

**الوظيفة:** دالة التنقل (اختيارية)

---

# 📊 States (15 state)

## 1. States التصفية والبحث:
```typescript
const [activeTimeFilter, setActiveTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
const [activeCity, setActiveCity] = useState<string>('الكل');
const [searchQuery, setSearchQuery] = useState<string>('');
```

**القيم الافتراضية:**
- `activeTimeFilter`: `'all'`
- `activeCity`: `'الكل'`
- `searchQuery`: `''`

## 2. States العروض:
```typescript
const [selectedSubOffers, setSelectedSubOffers] = useState<Set<string>>(new Set());
const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
const [draggedSubOffer, setDraggedSubOffer] = useState<{offerId: string, subOfferId: string} | null>(null);
const [selectedSubOfferForEdit, setSelectedSubOfferForEdit] = useState<SubOffer | null>(null);
const [allOffers, setAllOffers] = useState<Offer[]>([]);
const [openMenuId, setOpenMenuId] = useState<string | null>(null);
const [publishedAdsMap, setPublishedAdsMap] = useState<Map<string, PublishedAd>>(new Map());
```

## 3. States التحليلات:
```typescript
const [liveViewersData, setLiveViewersData] = useState<Map<string, LiveViewData>>(new Map());
const [heatMapTimeRange, setHeatMapTimeRange] = useState<TimeRange>('24h');
const [topViewedProperties, setTopViewedProperties] = useState<PropertyEngagement[]>([]);
const [showComparison, setShowComparison] = useState(false);
```

---

# 🏙️ المدن السعودية (const)

```typescript
const cities = [
  'الكل', 'الرياض', 'جدة', 'مكة', 'المدينة', 
  'الدمام', 'الخبر', 'تبوك', 'أبها', 'الطائف'
];
```

**عدد المدن:** 10 (بما فيها "الكل")

---

# 🔧 دالة مهمة: extractAdNumber

```typescript
const extractAdNumber = (adNumber: string): string => {
  // إزالة البادئات:
  // "#AD-123" → "AD-123"
  // "إعلان رقم: AD-123" → "AD-123"
  // "رقم الاعلان: ...384009" → "384009"
  
  let clean = adNumber
    .replace(/^#/, '')
    .replace(/^إعلان رقم:\s*/, '')
    .replace(/^رقم الاعلان:\s*/, '')
    .replace(/^رقم الإعلان:\s*/, '')
    .replace(/\.{3,}/g, '')
    .trim();
  
  const adMatch = clean.match(/AD-\d+-\d+/);
  if (adMatch) {
    return adMatch[0];
  }
  
  return clean;
};
```

**الوظيفة:** تنظيف رقم الإعلان من أي بادئات

---

# 🎨 الهيكل العام (بالترتيب)

```
OffersControlDashboard
├── 1. شريط الفلاتر العلوي
│   ├── أ. فلاتر الوقت (4 أزرار)
│   ├── ب. فلاتر المدن (10 أزرار)
│   └── ج. شريط البحث
│
├── 2. الإحصائيات السريعة (4 بطاقات)
│   ├── إجمالي العروض
│   ├── نشطة
│   ├── منتهية
│   └── معدل التحويل
│
├── 3. Live Viewers Panel (اختياري)
│   └── عرض المشاهدين الحاليين
│
├── 4. Heat Map (اختياري)
│   └── أكثر العقارات مشاهدة
│
└── 5. قائمة العروض
    ├── بطاقة عرض رئيسية
    │   ├── صورة + معلومات
    │   ├── إحصائيات (👁️ مشاهدات + 💬 طلبات)
    │   ├── أزرار إجراءات (3 نقاط)
    │   └── العروض الفرعية (قابلة للتوسيع)
    │       └── بطاقة عرض فرعي
    │           ├── صورة + عنوان
    │           ├── سعر + عدد صور
    │           └── أزرار (تعديل + حذف)
    └── حالات خاصة
        ├── لا توجد عروض
        └── لا توجد نتائج بحث
```

---

# 1️⃣ شريط الفلاتر العلوي

## الحاوية:
```css
sticky top-0 z-10
bg-white
border-b border-gray-200
p-4
shadow-sm
```

---

## أ. فلاتر الوقت (4 أزرار)

**الحاوية:** `flex gap-2 mb-4 overflow-x-auto`

### زر "اليوم":
```typescript
<button
  onClick={() => setActiveTimeFilter('today')}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    activeTimeFilter === 'today'
      ? 'bg-[#01411C] text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`}
>
  اليوم
</button>
```

### زر "هذا الأسبوع":
```typescript
<button
  onClick={() => setActiveTimeFilter('week')}
  // نفس الألوان
>
  هذا الأسبوع
</button>
```

### زر "هذا الشهر":
```typescript
<button
  onClick={() => setActiveTimeFilter('month')}
  // نفس الألوان
>
  هذا الشهر
</button>
```

### زر "الكل":
```typescript
<button
  onClick={() => setActiveTimeFilter('all')}
  // نفس الألوان
>
  الكل
</button>
```

**الألوان (لجميع الأزرار):**
- **عند النشاط:** `bg-[#01411C] text-white`
- **عند عدم النشاط:** `bg-gray-100 text-gray-700 hover:bg-gray-200`

---

## ب. فلاتر المدن (10 أزرار)

**الحاوية:** `flex gap-2 overflow-x-auto pb-2`

**الأزرار (تُولّد من المصفوفة `cities`):**
```typescript
{cities.map(city => (
  <button
    key={city}
    onClick={() => setActiveCity(city)}
    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
      activeCity === city
        ? 'bg-[#D4AF37] text-[#01411C]'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {city}
  </button>
))}
```

**المدن (بالترتيب):**
1. الكل
2. الرياض
3. جدة
4. مكة
5. المدينة
6. الدمام
7. الخبر
8. تبوك
9. أبها
10. الطائف

**الألوان:**
- **عند النشاط:** `bg-[#D4AF37] text-[#01411C]`
- **عند عدم النشاط:** `bg-gray-100 text-gray-600 hover:bg-gray-200`

---

## ج. شريط البحث

```typescript
<div className="relative">
  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input
    type="text"
    placeholder="ابحث في العروض..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37]"
  />
</div>
```

**التفاصيل:**
- **الأيقونة:** `<Search />` في اليمين
- **Placeholder:** "ابحث في العروض..."
- **Value:** `searchQuery`
- **onChange:** `setSearchQuery(e.target.value)`
- **Focus Border:** `border-[#D4AF37]`

---

# 2️⃣ الإحصائيات السريعة (4 بطاقات)

**Grid:** `grid grid-cols-2 md:grid-cols-4 gap-4 mb-6`

---

## بطاقة 1: إجمالي العروض

```typescript
<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">إجمالي العروض</p>
        <p className="text-3xl font-bold mt-1">{filteredStats.total}</p>
      </div>
      <Home className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** `bg-gradient-to-br from-blue-500 to-blue-600`
- **Text:** `text-white`
- **الأيقونة:** `<Home className="w-10 h-10 opacity-80" />`

---

## بطاقة 2: نشطة

```typescript
<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">نشطة</p>
        <p className="text-3xl font-bold mt-1">{filteredStats.active}</p>
      </div>
      <TrendingUp className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** `bg-gradient-to-br from-green-500 to-green-600`
- **الأيقونة:** `<TrendingUp />`

---

## بطاقة 3: منتهية

```typescript
<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">منتهية</p>
        <p className="text-3xl font-bold mt-1">{filteredStats.expired}</p>
      </div>
      <Clock className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** `bg-gradient-to-br from-orange-500 to-orange-600`
- **الأيقونة:** `<Clock />`

---

## بطاقة 4: معدل التحويل

```typescript
<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">معدل التحويل</p>
        <p className="text-3xl font-bold mt-1">{filteredStats.conversionRate}%</p>
      </div>
      <BarChart3 className="w-10 h-10 opacity-80" />
    </div>
  </CardContent>
</Card>
```

**الألوان:**
- **Background:** `bg-gradient-to-br from-purple-500 to-purple-600`
- **الأيقونة:** `<BarChart3 />`

---

# 3️⃣ بطاقة العرض الرئيسية

## الحاوية:
```css
border-2 border-[#D4AF37]
rounded-xl
bg-white
shadow-lg
hover:shadow-xl
transition-all
```

---

## أ. صورة العرض (أعلى البطاقة)

```typescript
<div className="relative h-48 overflow-hidden rounded-t-xl">
  <img 
    src={offer.images[0]} 
    alt={offer.title}
    className="w-full h-full object-cover"
  />
  
  {/* Badge المثبت (إذا isPinned = true) */}
  {offer.isPinned && (
    <div className="absolute top-2 right-2">
      <Badge className="bg-[#D4AF37] text-[#01411C] flex items-center gap-1">
        <Pin className="w-3 h-3" />
        مثبت
      </Badge>
    </div>
  )}
  
  {/* رقم الإعلان (أسفل اليمين) */}
  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
    {offer.adNumber}
  </div>
</div>
```

---

## ب. معلومات العرض

```typescript
<div className="p-4">
  {/* العنوان */}
  <h3 className="text-lg font-bold text-[#01411C] mb-2 line-clamp-1">
    {offer.title}
  </h3>
  
  {/* الموقع */}
  <div className="flex items-center gap-2 text-gray-600 mb-3">
    <MapPin className="w-4 h-4 text-[#D4AF37]" />
    <span className="text-sm">{offer.location}</span>
  </div>
  
  {/* السعر */}
  <div className="flex items-center justify-between mb-3">
    <span className="text-2xl font-bold text-[#01411C]">{offer.price}</span>
    
    {/* الإحصائيات */}
    <div className="flex gap-3">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Eye className="w-4 h-4" />
        <span>{offer.views}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <MessageSquare className="w-4 h-4" />
        <span>{offer.requests}</span>
      </div>
    </div>
  </div>
</div>
```

---

## ج. أزرار الإجراءات

```typescript
<div className="px-4 pb-4 flex gap-2">
  {/* زر المشاهدة */}
  <Button
    size="sm"
    variant="outline"
    className="flex-1 border-[#01411C] text-[#01411C] hover:bg-[#01411C] hover:text-white"
    onClick={() => onShowDetails && onShowDetails(offer.id)}
  >
    <Eye className="w-4 h-4 ml-1" />
    مشاهدة
  </Button>
  
  {/* زر التعديل */}
  <Button
    size="sm"
    className="flex-1 bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f]"
    onClick={() => onNavigate && onNavigate('property-upload-complete', { offerId: offer.id })}
  >
    <Edit className="w-4 h-4 ml-1" />
    تعديل
  </Button>
  
  {/* زر القائمة (3 نقاط) */}
  <button
    className="p-2 hover:bg-gray-100 rounded"
    onClick={(e) => {
      e.stopPropagation();
      setOpenMenuId(openMenuId === offer.id ? null : offer.id);
    }}
  >
    <MoreVertical className="w-5 h-5 text-gray-600" />
  </button>
</div>
```

---

## د. القائمة المنبثقة (3 نقاط)

```typescript
{openMenuId === offer.id && (
  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-[#D4AF37] z-50">
    {/* تثبيت/إلغاء التثبيت */}
    <button
      onClick={() => {
        // Toggle pin
        setOpenMenuId(null);
      }}
      className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
    >
      <Pin className="w-4 h-4" />
      {offer.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
    </button>
    
    {/* نقل للأرشيف */}
    <button
      onClick={() => {
        // Archive logic
        setOpenMenuId(null);
      }}
      className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
    >
      <Archive className="w-4 h-4" />
      نقل للأرشيف
    </button>
    
    {/* حذف */}
    <button
      onClick={() => {
        if (confirm('هل تريد حذف هذا العرض؟')) {
          // Delete logic
        }
        setOpenMenuId(null);
      }}
      className="w-full text-right px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
    >
      <Trash2 className="w-4 h-4" />
      حذف
    </button>
  </div>
)}
```

---

## هـ. العروض الفرعية (Sub-Offers)

### زر التوسيع:
```typescript
{offer.subOffers.length > 0 && (
  <button
    onClick={() => {
      const newExpanded = new Set(expandedOffers);
      if (newExpanded.has(offer.id)) {
        newExpanded.delete(offer.id);
      } else {
        newExpanded.add(offer.id);
      }
      setExpandedOffers(newExpanded);
    }}
    className="w-full px-4 py-2 border-t border-gray-200 hover:bg-gray-50 flex items-center justify-between text-sm text-gray-600"
  >
    <span>العروض الفرعية ({offer.subOffers.length})</span>
    {expandedOffers.has(offer.id) ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )}
  </button>
)}
```

### بطاقة العرض الفرعي:
```typescript
{expandedOffers.has(offer.id) && (
  <div className="px-4 pb-4 space-y-2 bg-gray-50">
    {offer.subOffers.map(subOffer => (
      <div 
        key={subOffer.id}
        className="bg-white rounded-lg p-3 border border-gray-200 hover:border-[#D4AF37] transition-colors"
      >
        <div className="flex gap-3">
          {/* صورة صغيرة */}
          <img 
            src={subOffer.image} 
            alt={subOffer.title}
            className="w-20 h-20 object-cover rounded"
          />
          
          {/* المعلومات */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {subOffer.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {extractAdNumber(subOffer.adNumber)}
            </p>
            <p className="text-sm font-bold text-[#01411C] mt-1">
              {subOffer.price}
            </p>
            <p className="text-xs text-gray-500">
              📷 {subOffer.imageCount} صور
            </p>
          </div>
          
          {/* أزرار */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEditSubOffer && onEditSubOffer(subOffer)}
              className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('حذف هذا العرض الفرعي؟')) {
                  // Delete logic
                }
              }}
              className="p-1.5 hover:bg-red-50 rounded text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
```

---

# 4️⃣ Live Viewers Panel (المشاهدين المباشرين)

```typescript
{liveViewersData.size > 0 && (
  <Card className="mb-6 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-purple-700">
        <Activity className="w-5 h-5 animate-pulse" />
        👁️ المشاهدون المباشرون ({liveViewersData.size} عقار)
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(liveViewersData.entries()).map(([offerId, viewData]) => {
          const offer = filteredOffers.find(o => o.id === offerId);
          if (!offer) return null;
          
          return (
            <div 
              key={offerId}
              className="bg-white rounded-lg border-2 border-purple-200 p-3 hover:border-purple-400 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="font-bold text-purple-700">
                  {viewData.totalCount} مشاهد الآن
                </span>
              </div>
              
              <p className="text-sm text-gray-700 truncate mb-2">{offer.title}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  {viewData.deviceBreakdown.mobile}
                </div>
                <div className="flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  {viewData.deviceBreakdown.desktop}
                </div>
                <div className="flex items-center gap-1">
                  <Tablet className="w-3 h-3" />
                  {viewData.deviceBreakdown.tablet}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

---

# 5️⃣ Heat Map (الخريطة الحرارية)

```typescript
{topViewedProperties.length > 0 && (
  <Card className="mb-6 border-2 border-red-300 bg-gradient-to-br from-red-50 to-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-red-700">
        <TrendingUp className="w-5 h-5" />
        🔥 أكثر 5 عقارات مشاهدة
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {topViewedProperties.map((property, index) => (
          <div 
            key={property.id}
            className="bg-white rounded-lg border-2 border-red-200 p-4 hover:border-red-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center justify-center font-bold">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{property.title}</h4>
                  <p className="text-xs text-gray-500">{property.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{property.views}</p>
                <p className="text-xs text-gray-500">مشاهدة</p>
              </div>
            </div>
            
            {/* شريط التقدم */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                style={{ width: `${(property.views / topViewedProperties[0].views) * 100}%` }}
              ></div>
            </div>
            
            {/* إحصائيات إضافية */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div className="text-center">
                <p className="text-gray-500">رسائل واتساب</p>
                <p className="font-bold text-green-600">{property.whatsappMessages}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">مكالمات</p>
                <p className="font-bold text-blue-600">{property.phoneCalls}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">نقرات</p>
                <p className="font-bold text-purple-600">{property.clicks}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

---

# 🎉 انتهى توثيق OffersControlDashboard

## ✅ ما تم توثيقه:

1. ✅ Props والـ States (15 state)
2. ✅ فلاتر الوقت (4 أزرار)
3. ✅ فلاتر المدن (10 أزرار)
4. ✅ شريط البحث (كامل)
5. ✅ الإحصائيات السريعة (4 بطاقات)
6. ✅ بطاقة العرض الرئيسية (كل التفاصيل)
7. ✅ بطاقة العرض الفرعي (كل التفاصيل)
8. ✅ Live Viewers Panel (كامل)
9. ✅ Heat Map (كامل)
10. ✅ جميع الألوان والأحجام
11. ✅ جميع onClick handlers
12. ✅ جميع الأيقونات

**التالي:** RequestsPage
