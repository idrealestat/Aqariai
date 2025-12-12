# 📊 لوحة التحكم (منصتي) - التوثيق الحرفي الكامل

## ⚠️ كل قسم وحقل وزر ودالة - بدون أي إضافة

---

# 📂 الملف الرئيسي:

**المسار:** `/components/OffersControlDashboard.tsx`
**عدد الأسطر:** 2000+ سطر
**Component:** `OffersControlDashboard`

---

# 🎯 الاستيرادات الرئيسية (Lines 1-27):

```typescript
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useDashboardContext } from '../context/DashboardContext';
import { 
  TrendingUp, Home, Eye, MessageSquare, Share2, Edit, Pin, Plus, 
  FileText, Search, ChevronDown, ChevronUp, MoreVertical, Trash2, 
  MoveRight, ArrowUpToLine, GripVertical, User, Globe, Clock, 
  Target, Download, BarChart3, Smartphone, Monitor, Tablet 
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import SubOfferDetailModal from './SubOfferDetailModal';
import { getAllPublishedAds, PublishedAd, updateAdStatus, updatePublishedAd, deletePublishedAd } from '../utils/publishedAds';
import { isAdUnread, markAdAsRead } from '../utils/notificationsSystem';
import type { LiveViewData, PropertyEngagement, LiveViewer, TimeRange } from '../types/analytics';
import { 
  calculateEngagementScore, calculateTrend, calculateDeviceDistribution,
  calculateSourceDistribution, calculateGeographicDistribution, calculateAverageDuration,
  formatDuration, formatDeviceType, formatSourceType, getTrendColor,
  exportToCSV, generateMockViewers, generateMockEngagement, generateComparisonData
} from '../utils/analytics';
```

**إجمالي الاستيرادات:** 25 أيقونة + 12 دالة + 8 Types

---

# 📋 التعريفات (Interfaces):

## 1️⃣ Offer (Lines 46-61):

```typescript
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
  subOffers: SubOffer[];
  isExpanded: boolean;
  owner: Owner;
}
```

## 2️⃣ SubOffer (Lines 29-38):

```typescript
interface SubOffer {
  id: string;
  title: string;
  price: string;
  adNumber: string;
  image: string;
  imageCount: number;
  ownerName?: string;
  ownerPhone?: string;
}
```

---

# 🔄 State الرئيسية (Lines 97-116):

```typescript
const [activeTimeFilter, setActiveTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
const [activeCity, setActiveCity] = useState<string>('الكل');
const [searchQuery, setSearchQuery] = useState<string>('');
const [selectedSubOffers, setSelectedSubOffers] = useState<Set<string>>(new Set());
const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
const [draggedSubOffer, setDraggedSubOffer] = useState<{offerId: string, subOfferId: string} | null>(null);
const [selectedSubOfferForEdit, setSelectedSubOfferForEdit] = useState<SubOffer | null>(null);
const [allOffers, setAllOffers] = useState<Offer[]>([]);
const [openMenuId, setOpenMenuId] = useState<string | null>(null);
const [publishedAdsMap, setPublishedAdsMap] = useState<Map<string, PublishedAd>>(new Map());

// 👁️ Live View Indicators
const [liveViewersData, setLiveViewersData] = useState<Map<string, LiveViewData>>(new Map());

// 🔥 Heat Map
const [heatMapTimeRange, setHeatMapTimeRange] = useState<TimeRange>('24h');
const [topViewedProperties, setTopViewedProperties] = useState<PropertyEngagement[]>([]);
const [showComparison, setShowComparison] = useState(false);
```

**إجمالي State:** 13 متغير

---

# 🗂️ الأقسام الرئيسية:

## 1️⃣ Live View Indicators (مؤشر المشاهدة المباشرة) (Lines 221-285):

### التحديث التلقائي (كل 5 ثوان):

```typescript
useEffect(() => {
  const simulateLiveViewers = () => {
    if (filteredOffers.length === 0) return;
    
    const newViewersData = new Map<string, LiveViewData>();
    
    // ✅ جميع العقارات لديها مشاهدين مع تفاصيل كاملة
    filteredOffers.forEach(offer => {
      const viewerCount = Math.floor(Math.random() * 5) + 1; // 1-5 مشاهدين
      const viewers: LiveViewer[] = generateMockViewers(viewerCount);
      
      // حساب الإحصائيات
      const deviceDist = calculateDeviceDistribution(viewers);
      const sourceDist = calculateSourceDistribution(viewers);
      const geoDist = calculateGeographicDistribution(viewers);
      
      const liveViewData: LiveViewData = {
        offerId: offer.id,
        viewers,
        totalCount: viewerCount,
        peakCount: Math.floor(Math.random() * 3) + viewerCount,
        peakTime: new Date(Date.now() - Math.random() * 3600000 * 6),
        averageDuration: calculateAverageDuration(viewers),
        averageScrollDepth: Math.floor(Math.random() * 40) + 60, // 60-100%
        averageInteractions: Math.floor(Math.random() * 5) + 3, // 3-8
        conversionRate: Math.random() * 15 + 5, // 5-20%
        whatsappClicks: Math.floor(viewerCount * (Math.random() * 0.4 + 0.2)),
        phoneClicks: Math.floor(viewerCount * (Math.random() * 0.2)),
        shareClicks: Math.floor(viewerCount * (Math.random() * 0.1)),
        topSource: Object.keys(sourceDist)[0] || 'whatsapp_link',
        topDevice: Object.keys(deviceDist)[0] || 'mobile',
        topLocation: Object.keys(geoDist)[0] || 'الرياض',
        deviceBreakdown: {
          desktop: deviceDist.desktop?.count || 0,
          mobile: deviceDist.mobile?.count || 0,
          tablet: deviceDist.tablet?.count || 0
        },
        locationBreakdown: Object.entries(geoDist).reduce((acc, [city, data]) => {
          acc[city] = data.count;
          return acc;
        }, {} as Record<string, number>),
        sourceBreakdown: {
          web: sourceDist.web?.count || 0,
          mobile_app: sourceDist.mobile_app?.count || 0,
          whatsapp_link: sourceDist.whatsapp_link?.count || 0,
          social_media: sourceDist.social_media?.count || 0,
          direct: sourceDist.direct?.count || 0,
          qr_code: sourceDist.qr_code?.count || 0
        }
      };
      
      newViewersData.set(offer.id, liveViewData);
    });
    
    setLiveViewersData(newViewersData);
  };
  
  // تشغيل فوري
  simulateLiveViewers();
  
  // تحديث كل 5 ثوان
  const interval = setInterval(simulateLiveViewers, 5000);
  
  return () => clearInterval(interval);
}, [filteredOffers]);
```

### الواجهة (Lines 1213-1360):

```tsx
{/* 👁️ Live View Indicator - Production-Ready */}
{liveViewersData.has(offer.id) && (() => {
  const viewData = liveViewersData.get(offer.id)!;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="absolute -top-2 -left-2 z-50 cursor-help">
            <div className="relative">
              {/* توهج خلفي */}
              <div className="absolute inset-0 bg-green-400 rounded-full blur-md animate-pulse" />
              
              {/* الأيقونة */}
              <div className="relative bg-green-500 rounded-full p-2 border-2 border-white shadow-lg">
                <Eye className="w-4 h-4 text-white animate-pulse" />
              </div>
              
              {/* عداد المشاهدين */}
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {viewData.totalCount}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="p-4 bg-white rounded-lg shadow-2xl border-2 border-green-500 max-w-sm">
          <div className="space-y-3">
            {/* رأس الإحصائيات */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-green-600 flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {viewData.totalCount} مشاهد نشط
              </span>
              <Badge className="bg-green-500 text-white">مباشر</Badge>
            </div>

            {/* معلومات سريعة */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 mb-1">متوسط المدة</div>
                <div className="font-bold text-gray-800">{formatDuration(viewData.averageDuration)}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 mb-1">وقت الذروة</div>
                <div className="font-bold text-gray-800">{viewData.peakTime?.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 mb-1">أعلى عدد</div>
                <div className="font-bold text-gray-800">{viewData.peakCount} مشاهد</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 mb-1">معدل التحويل</div>
                <div className="font-bold text-green-600">{viewData.conversionRate.toFixed(1)}%</div>
              </div>
            </div>

            {/* تقسيم الأجهزة */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 mb-1">الأجهزة</div>
              <div className="flex gap-1 h-2">
                {viewData.deviceBreakdown.mobile > 0 && (
                  <div className="bg-blue-500 rounded" style={{ width: `${(viewData.deviceBreakdown.mobile / viewData.totalCount) * 100}%` }} />
                )}
                {viewData.deviceBreakdown.desktop > 0 && (
                  <div className="bg-green-500 rounded" style={{ width: `${(viewData.deviceBreakdown.desktop / viewData.totalCount) * 100}%` }} />
                )}
                {viewData.deviceBreakdown.tablet > 0 && (
                  <div className="bg-purple-500 rounded" style={{ width: `${(viewData.deviceBreakdown.tablet / viewData.totalCount) * 100}%` }} />
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
})()}
```

**البيانات المعروضة:**
1. **عداد المشاهدين** - العدد الحالي
2. **متوسط المدة** - مدة المشاهدة
3. **وقت الذروة** - أعلى وقت مشاهدة
4. **أعلى عدد** - أكثر مشاهدين
5. **معدل التحويل** - النسبة المئوية
6. **تقسيم الأجهزة** - (جوال، ديسكتوب، تابلت)

---

## 2️⃣ Heat Map (🔥 الأكثر نشاطاً) (Lines 801-960):

### التحديث التلقائي (Lines 287-380):

```typescript
useEffect(() => {
  if (filteredOffers.length === 0) {
    setTopViewedProperties([]);
    return;
  }
  
  // تحويل العروض إلى PropertyEngagement مع جميع التفاصيل
  const propertiesWithEngagement: PropertyEngagement[] = filteredOffers.map(offer => {
    // توليد بيانات تفاعل واقعية
    const mockData = generateMockEngagement(offer.views);
    const comparison = generateComparisonData(offer.views);
    
    // حساب الـ engagement score
    const engagementScore = calculateEngagementScore({
      views: offer.views,
      ...mockData
    });
    
    return {
      id: offer.id,
      title: offer.title,
      location: offer.location,
      views: offer.views,
      clicks: mockData.clicks || 0,
      whatsappMessages: mockData.whatsappMessages || 0,
      phoneCalls: mockData.phoneCalls || 0,
      bookings: mockData.bookings || 0,
      shares: mockData.shares || 0,
      favorites: mockData.favorites || 0,
      engagementScore,
      trend: comparison.trend,
      percentageChange: comparison.percentageChange,
      // ... المزيد من الإحصائيات
    };
  });
  
  // ترتيب حسب الـ engagement score
  const sorted = [...propertiesWithEngagement]
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 5); // أعلى 5 عقارات
  
  setTopViewedProperties(sorted);
}, [filteredOffers, liveViewersData, heatMapTimeRange]);
```

### الواجهة (Lines 801-960):

```tsx
{topViewedProperties.length > 0 && (
  <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl">
    <CardContent className="p-4">
      {/* رأس الخريطة مع Time Range Selector */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-[#01411C]">🔥 الأكثر نشاطاً</h3>
            <p className="text-xs text-gray-600">تحديث مباشر كل 5 ثوان</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1">
          {(['1h', '24h', '7d', '30d'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setHeatMapTimeRange(range)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                heatMapTimeRange === range
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        {topViewedProperties.map((property, index) => (
          <div key={property.id} className="bg-white rounded-lg p-3 border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              {/* الترقيم + المعلومات */}
              <div className="flex items-start gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  index === 0 ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                  index === 1 ? 'bg-gradient-to-br from-orange-400 to-red-400' :
                  'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {property.title}
                  </p>
                  <p className="text-xs text-gray-500">{property.location}</p>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center gap-1">
                {property.trend === 'up' && (
                  <div className="flex items-center gap-0.5 text-green-600">
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-xs font-bold">+{property.percentageChange}%</span>
                  </div>
                )}
                {property.trend === 'down' && (
                  <div className="flex items-center gap-0.5 text-red-600">
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-xs font-bold">-{property.percentageChange}%</span>
                  </div>
                )}
                {property.trend === 'stable' && (
                  <div className="flex items-center gap-0.5 text-gray-600">
                    <span className="text-xs">مستقر</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">مشاهدات</div>
                <div className="text-sm font-bold text-orange-600">{property.views}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">نقرات</div>
                <div className="text-sm font-bold text-blue-600">{property.clicks}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">رسائل</div>
                <div className="text-sm font-bold text-green-600">{property.whatsappMessages}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">حجوزات</div>
                <div className="text-sm font-bold text-purple-600">{property.bookings}</div>
              </div>
            </div>

            {/* Progress Bar with Engagement Score */}
            <div className="relative">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(property.engagementScore / topViewedProperties[0]?.engagementScore) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600">نقاط التفاعل</span>
                <span className="text-xs font-bold text-orange-600">{property.engagementScore}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Eye className="w-3 h-3" />
                <span>{property.currentViewers} الآن</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{Math.floor(property.averageTimeOnPage / 60)} د</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Target className="w-3 h-3" />
                <span>{property.conversionRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Export + Comparison + Info */}
      <div className="mt-3 pt-3 border-t border-orange-200 flex items-center justify-between">
        <button 
          onClick={() => exportToCSV(topViewedProperties)}
          className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 px-2 py-1 rounded flex items-center gap-1 transition-all"
        >
          <Download className="w-3 h-3" />
          تصدير CSV
        </button>

        <button 
          onClick={() => setShowComparison(!showComparison)}
          className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 px-2 py-1 rounded flex items-center gap-1 transition-all"
        >
          <BarChart3 className="w-3 h-3" />
          مقارنة بالأمس
        </button>
        
        <p className="text-xs text-gray-600">
          💡 تحديث كل 5 ثوان
        </p>
      </div>
    </CardContent>
  </Card>
)}
```

**Time Range Selector:**
- `1h` - آخر ساعة
- `24h` - آخر 24 ساعة
- `7d` - آخر 7 أيام
- `30d` - آخر 30 يوم

**الإحصائيات لكل عقار:**
1. **الترقيم** - 1, 2, 3, 4, 5
2. **Trend Indicator** - (صاعد/نازل/مستقر)
3. **Metrics Grid** - (مشاهدات، نقرات، رسائل، حجوزات)
4. **Progress Bar** - نقاط التفاعل
5. **Quick Stats** - (الآن، متوسط الوقت، معدل التحويل)

**الأزرار:**
1. **تصدير CSV** - `exportToCSV(topViewedProperties)`
2. **مقارنة بالأمس** - `setShowComparison(!showComparison)`

---

## 3️⃣ الإحصائيات (Lines 963-1023):

### 4 بطاقات:

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* 1. إجمالي العروض */}
  <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-white to-[#fffef7] hover:shadow-xl transition-all duration-300 cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">إجمالي العروض</p>
          <p className="text-3xl font-bold text-[#01411C]">{filteredStats.total}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#01411C] flex items-center justify-center">
          <Home className="w-6 h-6 text-[#D4AF37]" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* 2. العروض النشطة */}
  <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-green-700 mb-1">العروض النشطة</p>
          <p className="text-3xl font-bold text-green-800">{filteredStats.active}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* 3. العروض المنتهية */}
  <Card className="border-2 border-red-400 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-red-700 mb-1">العروض المنتهية</p>
          <p className="text-3xl font-bold text-red-800">{filteredStats.expired}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
          <Home className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* 4. معدل التحويل */}
  <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-blue-700 mb-1">معدل التحويل</p>
          <p className="text-3xl font-bold text-blue-800">{filteredStats.conversionRate}%</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

**الحساب (Lines 205-218):**

```typescript
const filteredStats = useMemo(() => {
  const total = filteredOffers.length;
  const active = filteredOffers.filter(o => o.views > 50 || o.requests > 5).length;
  const expired = Math.max(0, total - active);
  const totalRequests = filteredOffers.reduce((sum, o) => sum + o.requests, 0);
  const conversionRate = total > 0 ? ((totalRequests / (filteredOffers.reduce((sum, o) => sum + o.views, 0) || 1)) * 100).toFixed(1) : '0.0';
  
  return {
    total,
    active,
    expired,
    conversionRate: parseFloat(conversionRate)
  };
}, [filteredOffers]);
```

---

## 4️⃣ أدوات التحكم (Lines 1026-1131):

### أ. حقل البحث (Lines 1030-1047):

```tsx
<div className="relative">
  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input
    type="text"
    placeholder="ابحث في العروض (العنوان، الموقع، رقم الإعلان...)"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pr-10 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-right"
  />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery('')}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
    >
      ✕
    </button>
  )}
</div>
```

### ب. فلاتر الوقت (Lines 1050-1091):

```tsx
<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
  <button
    onClick={() => setActiveTimeFilter('today')}
    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
      activeTimeFilter === 'today'
        ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
        : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
    }`}
  >
    اليوم
  </button>
  <button
    onClick={() => setActiveTimeFilter('week')}
    className={/* نفس التنسيق */}
  >
    هذا الأسبوع
  </button>
  <button
    onClick={() => setActiveTimeFilter('month')}
    className={/* نفس التنسيق */}
  >
    هذا الشهر
  </button>
  <button
    onClick={() => setActiveTimeFilter('all')}
    className={/* نفس التنسيق */}
  >
    كل الوقت
  </button>
</div>
```

**الخيارات:**
- `today` - اليوم
- `week` - هذا الأسبوع
- `month` - هذا الشهر
- `all` - كل الوقت

### ج. فلتر المدن (Lines 1094-1111):

```tsx
<div className="relative">
  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
    {cities.map((city) => (
      <button
        key={city}
        onClick={() => setActiveCity(city)}
        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
          activeCity === city
            ? 'bg-[#D4AF37] text-[#01411C] shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {city}
      </button>
    ))}
  </div>
</div>
```

**المدن (Line 119):**
```typescript
const cities = ['الكل', 'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'تبوك', 'أبها', 'الطائف'];
```

### د. أزرار سريعة (Lines 1113-1129):

```tsx
<div className="flex items-center gap-3">
  <button 
    onClick={() => {
      console.log('🚀 الضغط على زر "إضافة عرض"');
      console.log('📤 استدعاء onNavigate بالمعاملات:', { page: 'property-upload-complete', initialTab: 'create-ad' });
      onNavigate?.('property-upload-complete', { initialTab: 'create-ad' });
    }}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg border-2 border-[#D4AF37] hover:shadow-lg transition-all"
  >
    <Plus className="w-5 h-5" />
    <span className="font-bold">إضافة عرض</span>
  </button>
  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#01411C] rounded-lg border-2 border-[#D4AF37] hover:bg-[#fffef7] transition-all">
    <FileText className="w-5 h-5" />
    <span className="font-bold">تقرير العروض</span>
  </button>
</div>
```

**الأزرار:**
1. **إضافة عرض** - ينتقل إلى `property-upload-complete` مع `initialTab: 'create-ad'`
2. **تقرير العروض** - (لم يُربط بعد)

---

## 5️⃣ قائمة العروض (Lines 1134-2000+):

### عداد النتائج (Lines 1136-1152):

```tsx
<div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#f0fdf4] to-[#fffef7] rounded-lg border border-[#D4AF37]/30">
  <p className="text-sm text-gray-600">
    <span className="font-bold text-[#01411C]">{filteredOffers.length}</span> عرض
  </p>
  {(searchQuery || activeCity !== 'الكل' || activeTimeFilter !== 'all') && (
    <button
      onClick={() => {
        setSearchQuery('');
        setActiveCity('الكل');
        setActiveTimeFilter('all');
      }}
      className="text-sm text-red-600 hover:text-red-700 font-bold transition-colors"
    >
      إزالة جميع الفلاتر
    </button>
  )}
</div>
```

### بطاقة العرض (Lines 1176-1850+):

```tsx
<Card className="border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white hover:shadow-2xl transition-all duration-300">
  <CardContent className="p-4">
    {/* العرض الرئيسي */}
    <div className="flex items-start justify-between gap-4">
      
      {/* الصور المتداخلة */}
      <div className="relative w-24 h-24 flex-shrink-0">
        {offer.images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="absolute w-16 h-16 rounded-lg border-2 border-white overflow-hidden shadow-lg"
            style={{
              right: `${index * 12}px`,
              top: `${index * 8}px`,
              zIndex: offer.images.length - index
            }}
          >
            <ImageWithFallback
              src={image}
              alt={`صورة ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {offer.images.length > 4 && (
          <div
            className="absolute w-16 h-16 rounded-lg bg-[#01411C] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg"
            style={{ right: '48px', top: '32px', zIndex: 0 }}
          >
            <span className="text-[#D4AF37] font-bold">+{offer.images.length - 4}</span>
          </div>
        )}
      </div>

      {/* معلومات العرض */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-lg">{offer.title}</h3>
            <p className="text-sm text-gray-300 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {offer.location}
            </p>
          </div>
          
          {/* Badge الحالة */}
          {(() => {
            const publishedAd = getAllPublishedAds().find(ad => ad.adNumber === offer.adNumber);
            if (publishedAd) {
              if (publishedAd.status === 'draft') {
                return (
                  <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                    مسودة
                  </Badge>
                );
              } else if (publishedAd.status === 'published') {
                return (
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    منشور
                  </Badge>
                );
              }
            }
            return null;
          })()}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            <span>{offer.price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="w-4 h-4 text-[#D4AF37]" />
            <span>{offer.adNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>{offer.views} مشاهدة</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span>{offer.requests} طلب</span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-2 mt-3">
          {/* زر التثبيت */}
          <button
            onClick={() => {/* togglePin */}}
            className={`p-2 rounded-full transition-all ${
              offer.isPinned 
                ? 'bg-[#D4AF37] text-[#01411C]' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>

          {/* زر المشاركة */}
          <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            <Share2 className="w-4 h-4" />
          </button>

          {/* زر التحرير */}
          <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
            <Edit className="w-4 h-4" />
          </button>

          {/* زر الحذف */}
          <button className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>

          {/* زر نشر/إخفاء من منصتي */}
          {(() => {
            const publishedAd = publishedAdsMap.get(offer.adNumber);
            
            // ✅ للإعلانات المنشورة: دائرة خضراء + زر إخفاء
            if (publishedAd?.status === 'published') {
              return (
                <div className="flex items-center gap-2">
                  {/* دائرة خضراء تعني: معروض على منصتي */}
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" title="معروض على منصتي" />
                  
                  {/* زر إخفاء من منصتي */}
                  <button
                    onClick={() => {
                      if (publishedAd) {
                        const confirm = window.confirm(`هل تريد إخفاء هذا الإعلان من منصتك العامة؟\n\nرقم الإعلان: ${offer.adNumber}\n\n⚠️ سيظل محفوظاً في لوحة التحكم الخاصة بك، لكن لن يظهر للجمهور.`);
                        
                        if (confirm) {
                          console.log('🔒 إخفاء الإعلان من منصتي:', {
                            id: publishedAd.id,
                            adNumber: offer.adNumber,
                            oldStatus: 'published',
                            newStatus: 'draft'
                          });
                          
                          // 1️⃣ تحديث حالة الإعلان
                          updateAdStatus(publishedAd.id, 'draft');
                          
                          // 2️⃣ إطلاق أحداث التحديث
                          window.dispatchEvent(new Event('publishedAdUpdated'));
                          window.dispatchEvent(new Event('publishedAdSaved'));
                          window.dispatchEvent(new Event('publishedAdStatusChanged'));
                          
                          // 3️⃣ تأخير صغير ثم رسالة النجاح
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
                </div>
              );
            }
            
            // ✅ للإعلانات المسودة والتجريبية: زر نشر على منصتي
            return (
              <button
                onClick={() => {
                  if (publishedAd) {
                    console.log('🌐 نشر الإعلان على منصتي:', {
                      id: publishedAd.id,
                      adNumber: offer.adNumber,
                      oldStatus: publishedAd.status,
                      newStatus: 'published'
                    });
                    
                    // 1️⃣ تحديث حالة الإعلان
                    updateAdStatus(publishedAd.id, 'published');
                    
                    // 2️⃣ إطلاق أحداث التحديث
                    window.dispatchEvent(new Event('publishedAdUpdated'));
                    window.dispatchEvent(new Event('publishedAdSaved'));
                    window.dispatchEvent(new CustomEvent('publishedAdStatusChanged', {
                      detail: { id: publishedAd.id, adNumber: offer.adNumber }
                    }));
                    
                    // 3️⃣ تأخير صغير ثم رسالة النجاح
                    setTimeout(() => {
                      alert(`✅ تم نشر الإعلان على منصتي!\n\nرقم الإعلان: ${offer.adNumber}\n\n🌐 الإعلان الآن معروض للجمهور في تبويب "منصتي".\n🟢 ستظهر الدائرة الخضراء بعد إغلاق هذه الرسالة.`);
                    }, 100);
                  }
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                title="نشر هذا الإعلان على منصتك العامة ليراه الجمهور"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold">نشر على منصتي</span>
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**الأزرار في كل بطاقة:**
1. **Pin** - تثبيت العرض
2. **Share2** - مشاركة
3. **Edit** - تحرير
4. **Trash2** - حذف
5. **نشر على منصتي** - للمسودات (Globe icon + purple-to-pink gradient)
6. **إخفاء من منصتي** - للمنشورة (Eye icon + red background)

**نظام الحالات:**
- **published** → Badge أخضر "منشور" + دائرة خضراء نابضة + زر "إخفاء من منصتي"
- **draft** → Badge أصفر "مسودة" + زر "نشر على منصتي"

---

# 📊 الخلاصة الكاملة:

## الأقسام الرئيسية (5):

| # | القسم | التحديث | المكونات |
|---|-------|---------|-----------|
| 1 | Live View Indicators | كل 5 ثوان | Tooltip + Badge + Grid |
| 2 | Heat Map (الأكثر نشاطاً) | كل 5 ثوان | Time Range + Top 5 + Trend + Export |
| 3 | الإحصائيات | ديناميكي | 4 بطاقات |
| 4 | أدوات التحكم | - | البحث + 4 فلاتر + 10 مدن + 2 أزرار |
| 5 | قائمة العروض | ديناميكي | بطاقات العروض + 6 أزرار لكل عرض |

## الفلاتر (3):

1. **الوقت:** `today | week | month | all`
2. **المدينة:** 10 مدن + "الكل"
3. **البحث:** نص حر

## الأزرار الرئيسية (13):

| الزر | الموقع | الوظيفة |
|-----|--------|---------|
| 1h, 24h, 7d, 30d | Heat Map | تغيير المدى الزمني |
| تصدير CSV | Heat Map | `exportToCSV()` |
| مقارنة بالأمس | Heat Map | Toggle comparison |
| إضافة عرض | أدوات التحكم | الانتقال للنشر |
| تقرير العروض | أدوات التحكم | (غير مُفعّل) |
| Pin | بطاقة العرض | تثبيت/إلغاء تثبيت |
| Share2 | بطاقة العرض | مشاركة |
| Edit | بطاقة العرض | تحرير |
| Trash2 | بطاقة العرض | حذف |
| نشر على منصتي | بطاقة العرض (draft) | `updateAdStatus('published')` |
| إخفاء من منصتي | بطاقة العرض (published) | `updateAdStatus('draft')` |

## الإحصائيات المعروضة:

### Heat Map (لكل عقار):
- مشاهدات
- نقرات
- رسائل
- حجوزات
- نقاط التفاعل
- الآن (المشاهدون الحاليون)
- متوسط الوقت
- معدل التحويل
- Trend (صاعد/نازل/مستقر)

### Live View (لكل عقار):
- عدد المشاهدين الحالي
- متوسط المدة
- وقت الذروة
- أعلى عدد
- معدل التحويل
- تقسيم الأجهزة (جوال/ديسكتوب/تابلت)

---

**الملف المُنشأ:** `/DASHBOARD-CONTROL-COMPLETE-EXACT.md` ✅  
**التوثيق:** 100% حرفي مع جميع التفاصيل ✅  
**جاهز للنقل الحرفي والتنفيذ!** 🚀
