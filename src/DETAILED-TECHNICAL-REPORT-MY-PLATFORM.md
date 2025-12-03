# 📊 **تقرير تفصيلي شامل: منصتي (My Platform)**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          📱 منصتي - MY PLATFORM - التقرير الكامل 📱         ║
║                                                               ║
║  كل شيء بالتفصيل الممل: المسارات، الدوال، الاستدعاءات،      ║
║  الاستيراد، الربط، التعاريف، الأزرار، الحقول، التبويبات    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📋 **جدول المحتويات**

1. [نظرة عامة](#1-نظرة-عامة)
2. [المسارات والملفات](#2-المسارات-والملفات)
3. [التعاريف والأنواع](#3-التعاريف-والأنواع)
4. [الاستيرادات](#4-الاستيرادات)
5. [الـ State Management](#5-الـ-state-management)
6. [الدوال الرئيسية](#6-الدوال-الرئيسية)
7. [استدعاءات API](#7-استدعاءات-api)
8. [الربط مع المكونات الأخرى](#8-الربط-مع-المكونات-الأخرى)
9. [واجهة المستخدم](#9-واجهة-المستخدم)
10. [التبويبات والأقسام](#10-التبويبات-والأقسام)
11. [الأزرار ووظائفها](#11-الأزرار-ووظائفها)
12. [الحقول والخانات](#12-الحقول-والخانات)
13. [سير العمل](#13-سير-العمل)

---

## 1️⃣ **نظرة عامة**

### **الغرض من منصتي:**
صفحة "منصتي" هي مركز التحكم الشخصي للوسيط العقاري، تعرض:
- إحصائيات شاملة عن نشاطه
- إعلاناته المنشورة على المنصات المختلفة
- طلباته وعروضه
- أدائه على مختلف المنصات

### **الموقع في النظام:**
- **المسار:** `/my-platform`
- **المكون الرئيسي:** `MyPlatform.tsx`
- **النوع:** صفحة رئيسية (Main Page)
- **الوصول:** للوسطاء المسجلين فقط (Authenticated)

---

## 2️⃣ **المسارات والملفات**

### **المسارات الفعلية:**

```
📁 Project Root
│
├── 📁 components/
│   │
│   ├── 📄 MyPlatform.tsx               ← المكون الرئيسي
│   │   المسار: /components/MyPlatform.tsx
│   │   الدور: واجهة منصتي الكاملة
│   │
│   ├── 📁 marketplace/
│   │   ├── 📄 MarketplacePage.tsx      ← صفحة السوق
│   │   ├── 📄 AcceptedOffersView.tsx   ← العروض المقبولة
│   │   └── 📄 MarketplaceModal.tsx     ← نافذة تفاصيل العرض
│   │
│   ├── 📁 owners/
│   │   ├── 📄 MyOffersView.tsx         ← عروضي
│   │   └── 📄 OfferCard.tsx            ← بطاقة العرض
│   │
│   └── 📁 notifications/
│       └── 📄 NotificationSystem.tsx    ← نظام الإشعارات
│
├── 📁 api/
│   ├── 📄 offers.ts                     ← API العروض
│   ├── 📄 requests.ts                   ← API الطلبات
│   ├── 📄 platforms.js                  ← API المنصات
│   └── 📄 analytics.ts                  ← API التحليلات
│
├── 📁 types/
│   ├── 📄 offers.ts                     ← أنواع العروض
│   └── 📄 marketplace.ts                ← أنواع السوق
│
├── 📁 utils/
│   ├── 📄 storage.ts                    ← التخزين المحلي
│   └── 📄 publishedAds.ts               ← الإعلانات المنشورة
│
└── 📁 hooks/
    └── 📄 useNotifications.ts           ← Hook الإشعارات
```

---

## 3️⃣ **التعاريف والأنواع**

### **التعاريف الأساسية:**

```typescript
// ==========================================
// FILE: types/offers.ts
// ==========================================

/**
 * نوع العرض - بيع أو إيجار
 */
export type OfferType = 'sale' | 'rent';

/**
 * حالة العرض
 */
export type OfferStatus = 
  | 'active'      // نشط
  | 'pending'     // قيد الانتظار
  | 'accepted'    // مقبول
  | 'rejected'    // مرفوض
  | 'expired';    // منتهي

/**
 * نوع العقار
 */
export type PropertyType = 
  | 'apartment'   // شقة
  | 'villa'       // فيلا
  | 'house'       // منزل
  | 'land'        // أرض
  | 'commercial'  // تجاري
  | 'office';     // مكتب

/**
 * واجهة العرض الكامل
 */
export interface Offer {
  // المعرف الفريد
  id: string;
  
  // معلومات أساسية
  title: string;                    // عنوان العرض
  description: string;              // الوصف
  type: OfferType;                  // نوع العرض (بيع/إيجار)
  propertyType: PropertyType;       // نوع العقار
  
  // السعر والمساحة
  price: number;                    // السعر
  area: number;                     // المساحة
  
  // الموقع
  location: {
    city: string;                   // المدينة
    district: string;               // الحي
    street?: string;                // الشارع
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // المواصفات
  bedrooms?: number;                // عدد الغرف
  bathrooms?: number;               // عدد الحمامات
  features: string[];               // المميزات
  
  // الصور والمستندات
  images: string[];                 // صور العقار
  videos?: string[];                // فيديوهات
  documents?: string[];             // مستندات
  
  // حالة العرض
  status: OfferStatus;
  
  // معلومات المالك
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  
  // معلومات النشر
  publishedPlatforms: string[];     // المنصات المنشور عليها
  publishedAt: Date;                // تاريخ النشر
  expiresAt?: Date;                 // تاريخ الانتهاء
  
  // التفاعل
  views: number;                    // عدد المشاهدات
  inquiries: number;                // عدد الاستفسارات
  shares: number;                   // عدد المشاركات
  
  // البيانات الوصفية
  createdAt: Date;
  updatedAt: Date;
}

/**
 * واجهة الطلب
 */
export interface Request {
  id: string;
  userId: string;
  type: OfferType;
  propertyType: PropertyType;
  budget: {
    min: number;
    max: number;
  };
  location: {
    city: string;
    districts: string[];
  };
  requirements: {
    minArea?: number;
    maxArea?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    features?: string[];
  };
  status: 'active' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * واجهة المنصة
 */
export interface Platform {
  id: string;
  name: string;                     // اسم المنصة
  nameAr: string;                   // الاسم بالعربية
  type: 'marketplace' | 'social' | 'real-estate' | 'custom';
  icon: string;                     // أيقونة المنصة
  isConnected: boolean;             // هل متصلة؟
  isActive: boolean;                // هل نشطة؟
  credentials?: {
    apiKey?: string;
    username?: string;
    token?: string;
  };
  statistics: {
    totalAds: number;               // إجمالي الإعلانات
    activeAds: number;              // الإعلانات النشطة
    views: number;                  // المشاهدات
    inquiries: number;              // الاستفسارات
  };
}

/**
 * واجهة إحصائيات منصتي
 */
export interface MyPlatformStats {
  // إحصائيات العروض
  offers: {
    total: number;                  // إجمالي العروض
    active: number;                 // النشطة
    pending: number;                // قيد الانتظار
    accepted: number;               // المقبولة
    expired: number;                // المنتهية
  };
  
  // إحصائيات الطلبات
  requests: {
    total: number;
    active: number;
    fulfilled: number;
  };
  
  // إحصائيات المنصات
  platforms: {
    total: number;                  // إجمالي المنصات
    connected: number;              // المتصلة
    totalAds: number;               // إجمالي الإعلانات
    totalViews: number;             // إجمالي المشاهدات
    totalInquiries: number;         // إجمالي الاستفسارات
  };
  
  // الأداء
  performance: {
    responseRate: number;           // معدل الاستجابة (%)
    conversionRate: number;         // معدل التحويل (%)
    averageResponseTime: number;    // متوسط وقت الاستجابة (دقائق)
  };
}
```

---

## 4️⃣ **الاستيرادات**

### **استيرادات المكون الرئيسي:**

```typescript
// ==========================================
// FILE: components/MyPlatform.tsx
// ==========================================

// React Core
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// UI Components (shadcn/ui)
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

// Icons (lucide-react)
import {
  BarChart3,          // أيقونة الإحصائيات
  Home,               // أيقونة العقارات
  Users,              // أيقونة المستخدمين
  TrendingUp,         // أيقونة النمو
  Activity,           // أيقونة النشاط
  Eye,                // أيقونة المشاهدات
  MessageSquare,      // أيقونة الرسائل
  Share2,             // أيقونة المشاركة
  CheckCircle,        // أيقونة التأكيد
  XCircle,            // أيقونة الإلغاء
  Clock,              // أيقونة الوقت
  AlertCircle,        // أيقونة التنبيه
  Plus,               // أيقونة الإضافة
  Edit,               // أيقونة التعديل
  Trash2,             // أيقونة الحذف
  ExternalLink,       // أيقونة الرابط الخارجي
  Download,           // أيقونة التحميل
  Upload,             // أيقونة الرفع
  RefreshCw,          // أيقونة التحديث
  Settings,           // أيقونة الإعدادات
  Filter              // أيقونة التصفية
} from 'lucide-react';

// API Functions
import { 
  getMyOffers,              // جلب عروضي
  getMyRequests,            // جلب طلباتي
  getOfferById,             // جلب عرض بالمعرف
  updateOfferStatus,        // تحديث حالة العرض
  deleteOffer               // حذف عرض
} from '../api/offers';

import {
  getConnectedPlatforms,    // جلب المنصات المتصلة
  getPlatformStats,         // جلب إحصائيات المنصة
  syncPlatformData          // مزامنة بيانات المنصة
} from '../api/platforms';

import {
  getMyPlatformStats,       // جلب إحصائيات منصتي
  trackEvent                // تتبع حدث
} from '../api/analytics';

// Types
import type { 
  Offer, 
  Request, 
  Platform, 
  MyPlatformStats,
  OfferStatus,
  OfferType,
  PropertyType
} from '../types/offers';

// Utils
import { 
  formatPrice,              // تنسيق السعر
  formatDate,               // تنسيق التاريخ
  formatNumber              // تنسيق الأرقام
} from '../utils/formatting';

import {
  saveToLocalStorage,       // حفظ في التخزين المحلي
  getFromLocalStorage       // جلب من التخزين المحلي
} from '../utils/storage';

// Hooks
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
```

### **استيرادات ملف API:**

```typescript
// ==========================================
// FILE: api/offers.ts
// ==========================================

// Supabase Client
import { supabase } from '../lib/supabase';

// Types
import type { Offer, Request, OfferStatus } from '../types/offers';

// Utils
import { handleApiError } from '../utils/errorHandling';
```

---

## 5️⃣ **الـ State Management**

### **State المكون الرئيسي:**

```typescript
// ==========================================
// State Variables
// ==========================================

export function MyPlatform() {
  // ===== 1. حالة البيانات =====
  
  /**
   * الإحصائيات العامة
   */
  const [stats, setStats] = useState<MyPlatformStats | null>(null);
  
  /**
   * قائمة عروضي
   */
  const [offers, setOffers] = useState<Offer[]>([]);
  
  /**
   * قائمة طلباتي
   */
  const [requests, setRequests] = useState<Request[]>([]);
  
  /**
   * المنصات المتصلة
   */
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  
  /**
   * العرض المحدد حالياً
   */
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  // ===== 2. حالة واجهة المستخدم =====
  
  /**
   * التبويب النشط
   * القيم الممكنة: 'overview' | 'offers' | 'requests' | 'platforms'
   */
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  /**
   * هل النافذة المنبثقة مفتوحة؟
   */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  /**
   * الفلاتر المطبقة
   */
  const [filters, setFilters] = useState({
    type: 'all' as OfferType | 'all',
    status: 'all' as OfferStatus | 'all',
    platform: 'all' as string,
    dateFrom: null as Date | null,
    dateTo: null as Date | null
  });
  
  /**
   * نص البحث
   */
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  /**
   * ترتيب العرض
   * القيم: 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc' | 'views-desc'
   */
  const [sortBy, setSortBy] = useState<string>('date-desc');
  
  // ===== 3. حالة التحميل والأخطاء =====
  
  /**
   * هل يتم تحميل البيانات؟
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /**
   * هل يتم تحميل الإحصائيات؟
   */
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  
  /**
   * هل يتم إجراء عملية؟
   */
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  /**
   * رسالة الخطأ إن وجدت
   */
  const [error, setError] = useState<string | null>(null);
  
  // ===== 4. حالة الصفحة =====
  
  /**
   * رقم الصفحة الحالي
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  /**
   * عدد العناصر في الصفحة
   */
  const [itemsPerPage] = useState<number>(12);
  
  /**
   * إجمالي عدد الصفحات
   */
  const totalPages = useMemo(() => {
    return Math.ceil(filteredOffers.length / itemsPerPage);
  }, [filteredOffers, itemsPerPage]);
  
  // ===== 5. Hooks مخصصة =====
  
  /**
   * معلومات المستخدم المسجل
   */
  const { user } = useAuth();
  
  /**
   * نظام الإشعارات
   */
  const { addNotification } = useNotifications();
  
  // ... بقية الـ State
}
```

---

## 6️⃣ **الدوال الرئيسية**

### **دوال جلب البيانات:**

```typescript
// ==========================================
// Data Fetching Functions
// ==========================================

/**
 * جلب جميع البيانات عند تحميل المكون
 * 
 * @description يتم استدعاؤها في useEffect عند mount
 * @returns Promise<void>
 */
const fetchAllData = useCallback(async (): Promise<void> => {
  try {
    setIsLoading(true);
    setError(null);
    
    // جلب البيانات بالتوازي
    const [statsData, offersData, requestsData, platformsData] = await Promise.all([
      getMyPlatformStats(user.id),
      getMyOffers(user.id),
      getMyRequests(user.id),
      getConnectedPlatforms(user.id)
    ]);
    
    // تحديث الـ State
    setStats(statsData);
    setOffers(offersData);
    setRequests(requestsData);
    setPlatforms(platformsData);
    
    // تتبع الحدث
    await trackEvent({
      userId: user.id,
      eventType: 'page_view',
      eventName: 'my_platform_viewed',
      category: 'PLATFORM'
    });
    
  } catch (err) {
    console.error('Error fetching data:', err);
    setError('فشل في تحميل البيانات');
    addNotification({
      type: 'error',
      title: 'خطأ',
      message: 'فشل في تحميل البيانات'
    });
  } finally {
    setIsLoading(false);
  }
}, [user.id, addNotification]);

/**
 * جلب الإحصائيات فقط
 * 
 * @description يستخدم لتحديث الإحصائيات بدون إعادة تحميل كل البيانات
 * @returns Promise<void>
 */
const refreshStats = useCallback(async (): Promise<void> => {
  try {
    setIsLoadingStats(true);
    const statsData = await getMyPlatformStats(user.id);
    setStats(statsData);
  } catch (err) {
    console.error('Error refreshing stats:', err);
  } finally {
    setIsLoadingStats(false);
  }
}, [user.id]);

/**
 * جلب تفاصيل عرض محدد
 * 
 * @param offerId - معرف العرض
 * @returns Promise<void>
 */
const fetchOfferDetails = useCallback(async (offerId: string): Promise<void> => {
  try {
    setIsProcessing(true);
    const offerData = await getOfferById(offerId);
    setSelectedOffer(offerData);
    setIsModalOpen(true);
  } catch (err) {
    console.error('Error fetching offer:', err);
    addNotification({
      type: 'error',
      title: 'خطأ',
      message: 'فشل في تحميل تفاصيل العرض'
    });
  } finally {
    setIsProcessing(false);
  }
}, [addNotification]);
```

### **دوال معالجة العروض:**

```typescript
// ==========================================
// Offer Management Functions
// ==========================================

/**
 * تحديث حالة العرض
 * 
 * @param offerId - معرف العرض
 * @param newStatus - الحالة الجديدة
 * @returns Promise<void>
 */
const handleUpdateOfferStatus = useCallback(async (
  offerId: string, 
  newStatus: OfferStatus
): Promise<void> => {
  try {
    setIsProcessing(true);
    
    // تحديث في قاعدة البيانات
    await updateOfferStatus(offerId, newStatus);
    
    // تحديث الـ State المحلي
    setOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: newStatus, updatedAt: new Date() }
          : offer
      )
    );
    
    // إشعار نجاح
    addNotification({
      type: 'success',
      title: 'تم التحديث',
      message: `تم تحديث حالة العرض إلى: ${getStatusText(newStatus)}`
    });
    
    // تحديث الإحصائيات
    await refreshStats();
    
    // تتبع الحدث
    await trackEvent({
      userId: user.id,
      eventType: 'user_action',
      eventName: 'offer_status_updated',
      category: 'OFFERS',
      properties: { offerId, newStatus }
    });
    
  } catch (err) {
    console.error('Error updating offer status:', err);
    addNotification({
      type: 'error',
      title: 'خطأ',
      message: 'فشل في تحديث حالة العرض'
    });
  } finally {
    setIsProcessing(false);
  }
}, [user.id, addNotification, refreshStats]);

/**
 * حذف عرض
 * 
 * @param offerId - معرف العرض
 * @returns Promise<void>
 */
const handleDeleteOffer = useCallback(async (offerId: string): Promise<void> => {
  // تأكيد الحذف
  const confirmed = window.confirm('هل أنت متأكد من حذف هذا العرض؟');
  if (!confirmed) return;
  
  try {
    setIsProcessing(true);
    
    // حذف من قاعدة البيانات
    await deleteOffer(offerId);
    
    // تحديث الـ State المحلي
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
    
    // إشعار نجاح
    addNotification({
      type: 'success',
      title: 'تم الحذف',
      message: 'تم حذف العرض بنجاح'
    });
    
    // تحديث الإحصائيات
    await refreshStats();
    
    // إغلاق النافذة إذا كان العرض المحذوف مفتوحاً
    if (selectedOffer?.id === offerId) {
      setIsModalOpen(false);
      setSelectedOffer(null);
    }
    
  } catch (err) {
    console.error('Error deleting offer:', err);
    addNotification({
      type: 'error',
      title: 'خطأ',
      message: 'فشل في حذف العرض'
    });
  } finally {
    setIsProcessing(false);
  }
}, [selectedOffer, addNotification, refreshStats]);

/**
 * نسخ رابط العرض
 * 
 * @param offerId - معرف العرض
 * @returns Promise<void>
 */
const handleCopyOfferLink = useCallback(async (offerId: string): Promise<void> => {
  const link = `${window.location.origin}/offers/${offerId}`;
  
  try {
    await navigator.clipboard.writeText(link);
    
    addNotification({
      type: 'success',
      title: 'تم النسخ',
      message: 'تم نسخ رابط العرض'
    });
    
    // تتبع الحدث
    await trackEvent({
      userId: user.id,
      eventType: 'user_action',
      eventName: 'offer_link_copied',
      category: 'OFFERS',
      properties: { offerId }
    });
    
  } catch (err) {
    addNotification({
      type: 'error',
      title: 'خطأ',
      message: 'فشل في نسخ الرابط'
    });
  }
}, [user.id, addNotification]);

/**
 * مشاركة العرض
 * 
 * @param offer - بيانات العرض
 * @returns Promise<void>
 */
const handleShareOffer = useCallback(async (offer: Offer): Promise<void> => {
  const shareData = {
    title: offer.title,
    text: offer.description.substring(0, 100) + '...',
    url: `${window.location.origin}/offers/${offer.id}`
  };
  
  try {
    if (navigator.share) {
      // استخدام Web Share API إذا كان متاحاً
      await navigator.share(shareData);
      
      addNotification({
        type: 'success',
        title: 'تمت المشاركة',
        message: 'تمت مشاركة العرض بنجاح'
      });
      
      // تحديث عداد المشاركات
      setOffers(prev =>
        prev.map(o =>
          o.id === offer.id
            ? { ...o, shares: o.shares + 1 }
            : o
        )
      );
      
      // تتبع الحدث
      await trackEvent({
        userId: user.id,
        eventType: 'user_action',
        eventName: 'offer_shared',
        category: 'OFFERS',
        properties: { offerId: offer.id }
      });
      
    } else {
      // Fallback: نسخ الرابط
      await handleCopyOfferLink(offer.id);
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Error sharing offer:', err);
    }
  }
}, [user.id, addNotification, handleCopyOfferLink]);
```

### **دوال التصفية والترتيب:**

```typescript
// ==========================================
// Filtering & Sorting Functions
// ==========================================

/**
 * تصفية العروض حسب الفلاتر المطبقة
 * 
 * @description يتم حسابها في useMemo لتحسين الأداء
 */
const filteredOffers = useMemo(() => {
  let result = [...offers];
  
  // فلتر حسب النوع (بيع/إيجار)
  if (filters.type !== 'all') {
    result = result.filter(offer => offer.type === filters.type);
  }
  
  // فلتر حسب الحالة
  if (filters.status !== 'all') {
    result = result.filter(offer => offer.status === filters.status);
  }
  
  // فلتر حسب المنصة
  if (filters.platform !== 'all') {
    result = result.filter(offer => 
      offer.publishedPlatforms.includes(filters.platform)
    );
  }
  
  // فلتر حسب التاريخ
  if (filters.dateFrom) {
    result = result.filter(offer => 
      new Date(offer.createdAt) >= filters.dateFrom!
    );
  }
  
  if (filters.dateTo) {
    result = result.filter(offer => 
      new Date(offer.createdAt) <= filters.dateTo!
    );
  }
  
  // فلتر حسب البحث
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(offer =>
      offer.title.toLowerCase().includes(query) ||
      offer.description.toLowerCase().includes(query) ||
      offer.location.city.toLowerCase().includes(query) ||
      offer.location.district.toLowerCase().includes(query)
    );
  }
  
  // الترتيب
  switch (sortBy) {
    case 'date-desc':
      result.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'date-asc':
      result.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'views-desc':
      result.sort((a, b) => b.views - a.views);
      break;
    default:
      break;
  }
  
  return result;
}, [offers, filters, searchQuery, sortBy]);

/**
 * العروض المعروضة في الصفحة الحالية
 */
const paginatedOffers = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredOffers.slice(startIndex, endIndex);
}, [filteredOffers, currentPage, itemsPerPage]);

/**
 * إعادة تعيين الفلاتر
 */
const handleResetFilters = useCallback(() => {
  setFilters({
    type: 'all',
    status: 'all',
    platform: 'all',
    dateFrom: null,
    dateTo: null
  });
  setSearchQuery('');
  setSortBy('date-desc');
  setCurrentPage(1);
}, []);
```

---

## 7️⃣ **استدعاءات API**

### **ملف API الرئيسي:**

```typescript
// ==========================================
// FILE: api/offers.ts
// ==========================================

/**
 * جلب عروض المستخدم
 * 
 * @param userId - معرف المستخدم
 * @returns Promise<Offer[]>
 */
export async function getMyOffers(userId: string): Promise<Offer[]> {
  try {
    // الاستعلام من Supabase
    const { data, error } = await supabase
      .from('owner_full_offers')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    
    // معالجة البيانات
    const offers: Offer[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as OfferType,
      propertyType: item.propertyType as PropertyType,
      price: item.price,
      area: item.area,
      location: {
        city: item.city,
        district: item.district,
        street: item.street,
        coordinates: item.coordinates
      },
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      features: item.features || [],
      images: item.images || [],
      videos: item.videos || [],
      documents: item.documents || [],
      status: item.status as OfferStatus,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      ownerPhone: item.ownerPhone,
      publishedPlatforms: item.publishedPlatforms || [],
      publishedAt: new Date(item.publishedAt),
      expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
      views: item.views || 0,
      inquiries: item.inquiries || 0,
      shares: item.shares || 0,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }));
    
    return offers;
    
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw new Error('فشل في جلب العروض');
  }
}

/**
 * جلب طلبات المستخدم
 * 
 * @param userId - معرف المستخدم
 * @returns Promise<Request[]>
 */
export async function getMyRequests(userId: string): Promise<Request[]> {
  try {
    const { data, error } = await supabase
      .from('owner_full_requests')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    
    const requests: Request[] = data.map(item => ({
      id: item.id,
      userId: item.userId,
      type: item.type as OfferType,
      propertyType: item.propertyType as PropertyType,
      budget: {
        min: item.budgetMin,
        max: item.budgetMax
      },
      location: {
        city: item.city,
        districts: item.districts || []
      },
      requirements: {
        minArea: item.minArea,
        maxArea: item.maxArea,
        minBedrooms: item.minBedrooms,
        minBathrooms: item.minBathrooms,
        features: item.features || []
      },
      status: item.status,
      createdAt: new Date(item.createdAt),
      expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined
    }));
    
    return requests;
    
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw new Error('فشل في جلب الطلبات');
  }
}

/**
 * جلب تفاصيل عرض محدد
 * 
 * @param offerId - معرف العرض
 * @returns Promise<Offer>
 */
export async function getOfferById(offerId: string): Promise<Offer> {
  try {
    const { data, error } = await supabase
      .from('owner_full_offers')
      .select('*')
      .eq('id', offerId)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('العرض غير موجود');
    
    // معالجة البيانات (نفس المعالجة في getMyOffers)
    const offer: Offer = {
      // ... mapping البيانات
    };
    
    // زيادة عداد المشاهدات
    await incrementOfferViews(offerId);
    
    return offer;
    
  } catch (error) {
    console.error('Error fetching offer:', error);
    throw new Error('فشل في جلب تفاصيل العرض');
  }
}

/**
 * تحديث حالة العرض
 * 
 * @param offerId - معرف العرض
 * @param newStatus - الحالة الجديدة
 * @returns Promise<void>
 */
export async function updateOfferStatus(
  offerId: string,
  newStatus: OfferStatus
): Promise<void> {
  try {
    const { error } = await supabase
      .from('owner_full_offers')
      .update({ 
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      .eq('id', offerId);
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error updating offer status:', error);
    throw new Error('فشل في تحديث حالة العرض');
  }
}

/**
 * حذف عرض
 * 
 * @param offerId - معرف العرض
 * @returns Promise<void>
 */
export async function deleteOffer(offerId: string): Promise<void> {
  try {
    // حذف من الجدول الرئيسي
    const { error } = await supabase
      .from('owner_full_offers')
      .delete()
      .eq('id', offerId);
    
    if (error) throw error;
    
    // حذف من marketplace إذا كان منشوراً
    await supabase
      .from('marketplace_offers')
      .delete()
      .eq('originalOfferId', offerId);
    
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw new Error('فشل في حذف العرض');
  }
}

/**
 * زيادة عداد المشاهدات
 * 
 * @param offerId - معرف العرض
 * @returns Promise<void>
 */
async function incrementOfferViews(offerId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_offer_views', {
      offer_id: offerId
    });
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error incrementing views:', error);
    // لا نرمي خطأ هنا لأنها عملية غير حرجة
  }
}
```

### **API الإحصائيات:**

```typescript
// ==========================================
// FILE: api/analytics.ts
// ==========================================

/**
 * جلب إحصائيات منصتي
 * 
 * @param userId - معرف المستخدم
 * @returns Promise<MyPlatformStats>
 */
export async function getMyPlatformStats(
  userId: string
): Promise<MyPlatformStats> {
  try {
    // استدعاء دالة قاعدة البيانات
    const { data, error } = await supabase.rpc('get_my_platform_stats', {
      user_id: userId
    });
    
    if (error) throw error;
    
    const stats: MyPlatformStats = {
      offers: {
        total: data.total_offers || 0,
        active: data.active_offers || 0,
        pending: data.pending_offers || 0,
        accepted: data.accepted_offers || 0,
        expired: data.expired_offers || 0
      },
      requests: {
        total: data.total_requests || 0,
        active: data.active_requests || 0,
        fulfilled: data.fulfilled_requests || 0
      },
      platforms: {
        total: data.total_platforms || 0,
        connected: data.connected_platforms || 0,
        totalAds: data.total_ads || 0,
        totalViews: data.total_views || 0,
        totalInquiries: data.total_inquiries || 0
      },
      performance: {
        responseRate: data.response_rate || 0,
        conversionRate: data.conversion_rate || 0,
        averageResponseTime: data.avg_response_time || 0
      }
    };
    
    return stats;
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error('فشل في جلب الإحصائيات');
  }
}

/**
 * تتبع حدث
 * 
 * @param event - بيانات الحدث
 * @returns Promise<void>
 */
export async function trackEvent(event: {
  userId: string;
  eventType: string;
  eventName: string;
  category: string;
  properties?: Record<string, any>;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        userId: event.userId,
        eventType: event.eventType,
        eventName: event.eventName,
        category: event.category,
        properties: event.properties,
        createdAt: new Date().toISOString()
      });
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error tracking event:', error);
    // لا نرمي خطأ لأن التتبع غير حرج
  }
}
```

---

**(يتبع في الملف التالي...)**
