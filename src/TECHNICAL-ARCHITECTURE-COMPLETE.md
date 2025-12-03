# 🏗️ **تقرير البنية التقنية الشامل - Technical Architecture Complete Report**

> **الإصدار:** 1.0.0-SUPREME  
> **التاريخ:** نوفمبر 2025  
> **الهدف:** توثيق شامل يسمح لأي AI بإعادة بناء التطبيق بالكامل  
> **المستوى:** Supreme - دقة تقنية كاملة

---

## 📋 **جدول المحتويات**

1. [نظرة عامة على البنية](#1-نظرة-عامة-على-البنية)
2. [بنية الملفات الكاملة](#2-بنية-الملفات-الكاملة)
3. [نظام التنقل والمسارات](#3-نظام-التنقل-والمسارات)
4. [State Management](#4-state-management)
5. [أنواع البيانات الكاملة](#5-أنواع-البيانات-الكاملة)
6. [APIs والـ Hooks](#6-apis-والـ-hooks)
7. [نظام الذكاء الاصطناعي](#7-نظام-الذكاء-الاصطناعي)
8. [نظام التخزين](#8-نظام-التخزين)
9. [المكونات الرئيسية](#9-المكونات-الرئيسية)
10. [التكاملات الخارجية](#10-التكاملات-الخارجية)
11. [Event System](#11-event-system)
12. [خريطة الاستيراد الكاملة](#12-خريطة-الاستيراد-الكاملة)

---

## 1️⃣ **نظرة عامة على البنية**

### **التقنيات الأساسية:**
```typescript
{
  "framework": "React 18+",
  "language": "TypeScript 5.0+",
  "styling": "TailwindCSS 4.0",
  "animation": "motion/react (Framer Motion)",
  "state": "React Context API + localStorage + IndexedDB",
  "routing": "Custom Hash-based Navigation",
  "forms": "react-hook-form@7.55.0",
  "charts": "recharts",
  "dnd": "@dnd-kit/core",
  "ui": "shadcn/ui components"
}
```

### **البنية المعمارية:**
```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx (Entry)                      │
│                  DashboardProvider (Context)                │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐
   │ AI Core  │      │   Layout   │     │  Services  │
   │ System   │      │ Components │     │  & APIs    │
   └──────────┘      └────────────┘     └────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                   ┌────────▼─────────┐
                   │  50+ Page        │
                   │  Components      │
                   └──────────────────┘
```

---

## 2️⃣ **بنية الملفات الكاملة**

### **الهيكل الرئيسي:**
```
/
├── App.tsx                          # نقطة الدخول الرئيسية
├── /components                      # 100+ مكون
│   ├── /ui                         # 30+ ShadCN component
│   ├── /layout                     # مكونات التخطيط
│   │   ├── PageLayout.tsx         # Wrapper للهيدر والـ sliders
│   │   ├── UnifiedMainHeader.tsx  # الهيدر الموحد
│   │   ├── DynamicHeader.tsx      # هيدر ديناميكي
│   │   └── ...
│   ├── /crm                        # نظام CRM
│   │   ├── EnhancedBrokerCRM-with-back.tsx
│   │   ├── customer-details-page.tsx
│   │   ├── draggable-lead-card.tsx
│   │   ├── enhanced-kanban-board.tsx
│   │   └── ...
│   ├── /analytics                  # نظام التحليلات
│   │   ├── CRMAnalytics.tsx
│   │   ├── OffersAnalytics.tsx
│   │   ├── CalendarAnalytics.tsx
│   │   └── ...
│   ├── /marketplace                # نظام السوق
│   │   ├── MarketplacePage.tsx
│   │   ├── AcceptedOffersView.tsx
│   │   └── ...
│   ├── /owners                     # نظام الملاك
│   │   ├── SaleOfferForm.tsx
│   │   ├── RentOfferForm.tsx
│   │   └── ...
│   ├── /notifications              # نظام الإشعارات
│   ├── LeftSliderComplete.tsx      # القائمة اليسرى
│   ├── RightSliderComplete-fixed.tsx # القائمة اليمنى (18 عنصر)
│   ├── SimpleDashboard-updated.tsx # الداشبورد الرئيسي
│   ├── AI_BubbleAssistant.tsx     # المساعد الذكي
│   └── ... (100+ component)
│
├── /context                         # React Context
│   └── DashboardContext.tsx        # السياق المركزي للوعي
│
├── /core                            # نواة الذكاء الاصطناعي
│   ├── /ai-cores
│   │   ├── AI_AwarenessTracker.ts
│   │   ├── AI_ConsciousAssistantCore.ts
│   │   ├── AI_DataPulseCore.ts
│   │   ├── AI_NotificationsEnhancedCore.ts
│   │   ├── AI_ShortTermMemory.ts
│   │   ├── DecisionCore.ts
│   │   ├── DecisionCoreEnhanced.ts
│   │   └── DecisionCoreIntegrated.ts
│   ├── /kernel
│   │   └── useKernel.ts           # Hook للاتصال بالنواة
│   ├── /identity
│   │   └── AqarAIIdentity.ts      # هوية الذكاء الاصطناعي
│   └── /hooks
│       └── useAIAwareness.ts      # نظام الوعي
│
├── /hooks                           # Custom Hooks
│   ├── useAwareness.ts             # الوعي الكامل
│   ├── useMemorySync.ts            # مزامنة الذاكرة
│   ├── useSmartAssistantEnhanced.ts # المساعد المحسن
│   ├── useNotificationsAPI.ts      # API الإشعارات
│   ├── useDynamicIntents.ts        # النوايا الديناميكية
│   └── ... (13 hook)
│
├── /utils                           # وظائف مساعدة
│   ├── customersManager.ts         # إدارة العملاء المركزية
│   ├── notificationsSystem.ts      # نظام الإشعارات
│   ├── teamAssignment.ts           # تعيين الفريق
│   ├── phoneCallSync.ts            # مزامنة المكالمات
│   ├── storage.ts                  # localStorage helper
│   ├── indexedDBStorage.ts         # IndexedDB helper
│   └── ... (20+ utility)
│
├── /api                             # API Services
│   ├── /kernel
│   │   └── processAIIntent.ts     # معالج النوايا
│   ├── notifications-real.ts       # Notifications API
│   ├── customers.ts                # Customers API
│   ├── offers.ts                   # Offers API
│   ├── requests.ts                 # Requests API
│   └── ... (15+ API)
│
├── /types                           # TypeScript Types
│   ├── crm.ts                      # أنواع CRM
│   ├── offers.ts                   # أنواع العروض
│   ├── owners.ts                   # أنواع الملاك
│   ├── marketplace.ts              # أنواع السوق
│   ├── calendar.ts                 # أنواع المواعيد
│   └── ... (8 type files)
│
├── /pages                           # صفحات خاصة
│   └── /owners
│       └── HomeOwners.tsx          # صفحة "اطلب وسيطك"
│
├── /styles
│   └── globals.css                 # الأنماط العامة + Tailwind
│
└── /public                          # الملفات الثابتة
    ├── sw.js                       # Service Worker
    └── bankRates.json              # معدلات البنوك
```

---

## 3️⃣ **نظام التنقل والمسارات**

### **A) نظام التنقل الأساسي:**

#### **الدالة المركزية: `handleNavigate`**
```typescript
// في App.tsx
const handleNavigate = useCallback((
  page: string, 
  tabOrOptions?: string | { initialTab?: string }
) => {
  // 1. معالجة الـ initialTab للصفحات التي تدعمها
  if (page === "settings" && initialTab) {
    setSettingsInitialTab(initialTab);
  }
  
  // 2. تحديث الوعي المركزي
  setActivePage(page);
  
  // 3. تغيير الصفحة الحالية
  setCurrentPage(page);
}, [setActivePage]);
```

#### **صيغ الاستدعاء:**
```typescript
// صيغة 1: تنقل بسيط
handleNavigate("dashboard")

// صيغة 2: مع تبويب مبدئي (string)
handleNavigate("settings", "notifications")

// صيغة 3: مع تبويب مبدئي (object)
handleNavigate("settings", { initialTab: "notifications" })
```

### **B) أسماء الصفحات الكاملة (50+ صفحة):**

```typescript
type PageName = 
  // صفحات أساسية
  | "dashboard"                    // الصفحة الرئيسية
  | "registration"                 // التسجيل
  | "pricing"                      // الأسعار
  
  // CRM
  | "enhanced-crm"                 // نظام CRM المحسن
  | "customer-management-72"       // إدارة العملاء
  | "customer-details/{id}"        // تفاصيل العميل
  | "comprehensive-crm"            // CRM الشامل
  | "leader-crm-complete"          // CRM القائد
  | "leader-crm-calendar"          // تقويم CRM القائد
  
  // العروض والطلبات
  | "requests"                     // الطلبات
  | "special-requests"             // الطلبات الخاصة
  | "marketplace-page"             // صفحة السوق
  | "property-upload-complete"     // رفع العقارات
  | "saved-offers"                 // العروض المحفوظة
  
  // التحليلات
  | "analytics"                    // التحليلات الأساسية
  | "analytics-page"               // صفحة التحليلات
  | "analytics-dashboard"          // لوحة التحليلات
  | "market-insights"              // رؤى السوق
  
  // المواعيد
  | "calendar"                     // التقويم
  | "calendar-system-complete"     // نظام التقويم الكامل
  | "appointment-booking"          // حجز المواعيد
  | "working-hours"                // ساعات العمل
  | "leader-crm-calendar"          // تقويم القائد
  
  // الحاسبات
  | "quick-calculator"             // الحاسبة السريعة
  | "finance-calculator"           // حاسبة التمويل
  | "commission-calculator"        // حاسبة العمولة
  | "land-calculator"              // حاسبة الأرض
  | "building-area-calculator"     // حاسبة مساحة البناء
  | "standard-calculator"          // حاسبة قياسية
  
  // الإعدادات والإدارة
  | "settings"                     // الإعدادات
  | "colleagues"                   // الزملاء
  | "team-management"              // إدارة الفريق
  | "tasks-management"             // إدارة المهام
  | "workspace"                    // مساحة العمل
  | "archive"                      // الأرشيف
  
  // المستندات
  | "financial-documents"          // المستندات المالية
  | "contracts"                    // العقود
  | "receipts"                     // سندات القبض
  
  // الأدوات
  | "social-media-post"            // منشور السوشيال ميديا
  | "broker-tools"                 // أدوات الوسيط
  | "blog"                         // المدونة
  | "help"                         // المساعدة
  
  // البطاقة الرقمية
  | "business-card"                // بطاقة الأعمال
  | "business-card-profile"        // ملف البطاقة
  | "business-card-edit"           // تعديل البطاقة
  
  // الإضافية
  | "my-platform"                  // منصتي
  | "dashboard-main-252"           // داشبورد 252
  | "pricing-management"           // إدارة الأسعار
  | "smart-matches"                // المطابقات الذكية
  | "scroll-test"                  // اختبار التمرير
  | "properties"                   // العقارات
  | "tasks"                        // المهام
  | "reports"                      // التقارير
  
  // صفحات عامة (بدون تسجيل)
  | "home-owners"                  // اطلب وسيطك
  | "send-offer"                   // إرسال عرض عام
  | "send-request"                 // إرسال طلب عام
  | "finance-link"                 // رابط حاسبة التمويل العام
  
  // صفحات اختبار
  | "test-crm-systems"             // اختبار أنظمة CRM
  | "test-dashboard-systems"       // اختبار أنظمة الداشبورد
  | "test-team"                    // اختبار الفريق
  | "test-right-slider-complete"   // اختبار القائمة اليمنى
```

### **C) العلاقة بين الصفحات:**

```typescript
// شجرة التنقل
Dashboard (الرئيسية)
├─ Enhanced CRM (إدارة العملاء)
│  └─ Customer Details/{id} (تفاصيل العميل)
├─ Requests (الطلبات)
│  ├─ Special Requests (طلبات خاصة)
│  └─ Marketplace (السوق)
├─ Analytics (التحليلات)
│  ├─ Analytics Dashboard
│  └─ Market Insights
├─ Calendar (المواعيد)
│  ├─ Appointment Booking
│  └─ Working Hours
├─ Calculators (الحاسبات)
│  ├─ Quick Calculator
│  ├─ Finance Calculator
│  ├─ Commission Calculator
│  ├─ Land Calculator
│  ├─ Building Area Calculator
│  └─ Standard Calculator
├─ Settings (الإعدادات)
│  ├─ Colleagues
│  ├─ Team Management
│  └─ Tasks Management
└─ Tools (الأدوات)
   ├─ Social Media Post
   ├─ Broker Tools
   └─ Blog
```

### **D) Hash Navigation:**

```typescript
// نظام الـ Hash المدمج
const hashToPage: Record<string, string> = {
  '#/home': 'dashboard',
  '#/crm/customers': 'customer-management-72',
  '#/calendar': 'calendar',
  '#/analytics': 'analytics-page',
  '#/properties': 'properties',
  '#/requests': 'marketplace-page',
  '#/notifications': 'notifications-center-complete',
  '#/profile': 'business-card-profile',
  '#/settings': 'settings',
  '#/digital-business-card': 'business-card-profile'
};

// Listener للـ hash change
window.addEventListener('hashchange', handleHashChange);
```

---

## 4️⃣ **State Management**

### **A) DashboardContext (السياق المركزي):**

```typescript
// في /context/DashboardContext.tsx
export interface DashboardContextType {
  // الصفحة النشطة
  activePage: string | null;
  setActivePage: (page: string | null) => void;

  // العميل النشط
  activeCustomer: any | null;
  setActiveCustomer: (customer: any | null) => void;

  // العرض النشط
  activeOffer: any | null;
  setActiveOffer: (offer: any | null) => void;

  // الطلب النشط
  activeRequest: any | null;
  setActiveRequest: (request: any | null) => void;

  // التبويب النشط
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;

  // المستخدم الحالي
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;

  // حالة القائمة اليسرى
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
}
```

#### **استخدام DashboardContext:**
```typescript
// في أي مكون
import { useDashboardContext } from '../context/DashboardContext';

function MyComponent() {
  const {
    activePage,
    setActivePage,
    activeCustomer,
    setActiveCustomer
  } = useDashboardContext();
  
  // ...
}
```

### **B) Local State في App.tsx:**

```typescript
// في AppContent component
const [customersData, setCustomersData] = useState<any[]>(() => {
  const saved = localStorage.getItem('crm_customers');
  return saved ? JSON.parse(saved) : [];
});

const [currentPage, setCurrentPage] = useState<string>(() => {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  if (path.startsWith('/finance-link/')) return "finance-link";
  if (hash.startsWith('#/send-offer/')) return "send-offer";
  if (hash.startsWith('#/send-request/')) return "send-request";
  
  return "dashboard";
});

const [user, setUser] = useState<User | null>(() => {
  try {
    const savedUser = localStorage.getItem('aqary-crm-user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error('خطأ في تحميل المستخدم:', error);
  }
  
  // بيانات تجريبية افتراضية
  return {
    id: "demo-user-0501234567",
    name: "مستخدم تجريبي",
    phone: "0501234567",
    type: "individual",
    plan: "bronze",
    email: "demo@test.com"
  } as User;
});

const [settingsInitialTab, setSettingsInitialTab] = useState<string | undefined>(undefined);
const [propertyUploadInitialTab, setPropertyUploadInitialTab] = useState<string | undefined>(undefined);
const [assistantMessages, setAssistantMessages] = useState<any[]>([]);
```

### **C) مزامنة localStorage:**

```typescript
// تحديث تلقائي عند تغيير المستخدم
useEffect(() => {
  if (user) {
    try {
      localStorage.setItem('aqary-crm-user', JSON.stringify(user));
      console.log('🔄 تمت مزامنة بيانات المستخدم:', user);
    } catch (error) {
      console.error('❌ خطأ في المزامنة:', error);
    }
  }
}, [user]);

// تحديث customersData تلقائياً كل ثانية
useEffect(() => {
  const interval = setInterval(() => {
    const customers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
    setCustomersData(customers);
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

---

## 5️⃣ **أنواع البيانات الكاملة**

### **A) User Types:**

```typescript
// من /components/unified-registration.tsx
export type UserType = 
  | "individual"     // فردي
  | "team"          // فريق
  | "office"        // مكتب
  | "company"       // شركة
  | "owner-buyer";  // مالك/مشتري

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  birthDate?: string;
  type: UserType;
  companyName?: string;
  licenseNumber?: string;
  licenseImage?: string;
  city?: string;
  district?: string;
  plan?: string;
  profileImage?: string;
  planExpiry?: string;
  licenseExpiry?: string;
  rating?: number;
}
```

### **B) Customer Types:**

```typescript
// من /utils/customersManager.ts
export type CustomerType = 
  | 'مالك'        // Owner
  | 'مشتري'       // Buyer
  | 'مؤجر'        // Lessor
  | 'مستأجر'      // Tenant
  | 'تمويل'       // Finance
  | 'آخر';        // Other

export type InterestLevel = 
  | 'passionate'        // شغوف
  | 'interested'        // مهتم
  | 'moderate'          // معتدل
  | 'limited'           // محدود
  | 'not-interested';   // غير مهتم

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  idNumber?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  district?: string;
  
  // التصنيف
  category: CustomerType;
  interestLevel?: InterestLevel;
  tags?: string[];
  source?: string;
  
  // التواصل
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  twitter?: string;
  
  // التفاصيل
  notes?: string;
  preferredContact?: string;
  language?: string;
  
  // البيانات المالية
  budget?: string;
  paymentMethod?: string;
  creditScore?: number;
  
  // الملفات والوسائط
  mediaFiles?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    uploadedAt: string;
  }>;
  
  // النشاط
  lastContact?: string;
  nextFollowUp?: string;
  meetingsCount?: number;
  callsCount?: number;
  messagesCount?: number;
  
  // التواريخ
  createdAt: string;
  updatedAt: string;
  
  // الحالة
  status?: 'active' | 'inactive' | 'converted' | 'lost';
  
  // العلاقات
  assignedTo?: string;
  assignedToName?: string;
  
  // الإعلانات المرتبطة
  linkedAdsCount?: number;
  
  // إضافات
  activities?: any[];
  activityLogs?: any[];
  
  // العروض والطلبات المستقبلة
  receivedOffers?: Array<{
    id: string;
    offerId: string;
    propertyType: string;
    propertyCategory: 'residential' | 'commercial';
    city: string;
    district?: string;
    area?: number;
    priceFrom?: number;
    priceTo?: number;
    description: string;
    features?: string[];
    transactionType: 'sale' | 'rent';
    offerType: 'offer' | 'request';
    userRole: 'seller' | 'lessor' | 'buyer' | 'tenant';
    commissionPercentage: number;
    serviceDescription: string;
    acceptedAt: string;
    ownerPhone?: string;
    ownerName?: string;
  }>;
  
  receivedRequests?: Array<{...}>; // نفس البنية
  
  hasNotification?: boolean;
}
```

### **C) Property Types:**

```typescript
// من /types/crm.ts
export type PropertyType =
  | "apartment"    // شقة
  | "villa"        // فيلا
  | "land"         // أرض
  | "duplex"       // دوبلكس
  | "triplex"      // تربلكس
  | "shop"         // محل تجاري
  | "hotel"        // فندق
  | "other";       // أخرى

export interface PropertyFeatures {
  pool?: boolean;                    // مسبح
  frontYard?: boolean;               // ساحة أمامية
  backYard?: boolean;                // ساحة خلفية
  balconies?: number;                // شرفات
  storages?: number;                 // مخازن
  privateEntrance?: number;          // مدخل خاص
  apartmentsCount?: number;          // عدد الشقق
  playground?: boolean;              // ملعب
  externalMajlis?: boolean;          // مجلس خارجي
  annex?: boolean;                   // ملحق
  internalGarden?: boolean;          // حديقة داخلية
  fountain?: boolean;                // نافورة
  modernDesign?: boolean;            // تصميم عصري
  elevator?: boolean;                // مصعد
  twoEntrances?: boolean;            // مدخلان
  oneEntrance?: boolean;             // مدخل واحد
  openKitchen?: boolean;             // مطبخ مفتوح
  closedKitchen?: boolean;           // مطبخ مغلق
  dirtyKitchen?: boolean;            // مطبخ وسخ
  stairs?: boolean;                  // درج
  furnished?: boolean;               // مفروش
  fittedKitchen?: boolean;           // مطبخ راكب
  appliancesIncluded?: boolean;      // أجهزة مدرجة
  curtains?: boolean;                // ستائر
}

export interface PropertyForm {
  id: string;
  ownerId: string;
  title: string;
  city: string;
  district: string;
  propertyType: PropertyType;
  deedNumber?: string;
  deedDate?: string;
  commission?: number;
  rooms?: number;
  floors?: number;
  bathrooms?: number;
  kitchens?: number;
  majlis?: number;
  livingRooms?: number;
  area?: number;
  price?: number;
  priceMarketRange?: string;
  priceStatus?: string;
  guarantees?: string;
  features?: PropertyFeatures;
  description?: string;
  descriptionMode?: "manual" | "ai";
  createdAt?: string;
  paymentOptions?: PaymentOptions | null;
}
```

---

## 6️⃣ **APIs والـ Hooks**

### **A) Custom Hooks:**

#### **1. useKernel - الاتصال ب��واة الذكاء الاصطناعي:**
```typescript
// من /core/kernel/useKernel.ts
export interface UseKernelReturn {
  sendAwareness: (payload: AIAwarenessPayload) => void;
  sendQuery: (query: string, context?: any) => Promise<KernelResponse>;
  isConnected: boolean;
  lastAwareness: AIAwarenessPayload | null;
}

// الاستخدام
const kernel = useKernel();

// إرسال وعي
kernel.sendAwareness({
  page: 'dashboard',
  customer: currentCustomer,
  offer: null,
  request: null,
  user: currentUser,
  timestamp: Date.now()
});

// إرسال استعلام
const response = await kernel.sendQuery("ابحث عن العميل أحمد");
```

#### **2. useAwareness - نظام الوعي الكامل:**
```typescript
// من /hooks/useAwareness.ts
const awareness = useAwareness(userId, currentPage);

// يتتبع:
// - الصفحة الحالية
// - نشاط المستخدم
// - السياق العام
// - آخر تفاعل
```

#### **3. useMemorySync - مزامنة الذاكرة:**
```typescript
// من /hooks/useMemorySync.ts
const memorySync = useMemorySync(userId);

// يحفظ آخر 5 محادثات
// يزامن مع localStorage
// يوفر التاريخ للمساعد الذكي
```

#### **4. useSmartAssistantEnhanced - المساعد المحسن:**
```typescript
// من /hooks/useSmartAssistantEnhanced.ts
const smartAssistant = useSmartAssistantEnhanced({
  userId: user?.id || 'demo-user',
  currentPage,
  setMessages: setAssistantMessages
});

// يدمج:
// - الوعي الكامل
// - الذاكرة قصيرة المدى
// - معالجة اللغة الطبيعية
// - الإشعارات
```

#### **5. useNotificationsAPI - API الإشعارات:**
```typescript
// من /hooks/useNotificationsAPI.ts
const notificationsAPI = useNotificationsAPI(userId, setMessages);

// يوفر:
// - getNotifications()
// - markAsRead()
// - sendNotification()
// - subscribeToRealtime()
```

### **B) API Services:**

#### **1. customersManager - إدارة العملاء:**
```typescript
// من /utils/customersManager.ts

// الحصول على جميع العملاء
export function getAllCustomers(): Customer[];

// البحث عن عميل
export function findCustomerByPhone(phone: string): Customer | null;
export function findCustomerById(id: string): Customer | null;

// إنشاء/تحديث عميل
export function createCustomer(customerData: Partial<Customer>): Customer;
export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null;

// حذف عميل
export function deleteCustomer(id: string): boolean;

// ضمان وجود عميل
export function ensureCustomerExists(customerData: {...}): Customer;

// البحث
export function searchCustomers(query: string): Customer[];

// التصدير/الاستيراد
export function exportCustomers(): string;
export function importCustomers(jsonData: string): boolean;
```

#### **2. NotificationsAPI - نظام الإشعارات:**
```typescript
// من /api/notifications-real.ts
export const NotificationsAPI = {
  // إشعار بإضافة عميل
  notifyCustomerAdded(userId: string, customer: Customer): void,
  
  // إشعار بتحديث عميل
  notifyCustomerUpdated(
    userId: string, 
    customer: Customer, 
    changes: string[]
  ): void,
  
  // إشعار بموعد جديد
  notifyAppointmentAdded(userId: string, appointment: any): void,
  
  // إشعار بقبول عرض
  notifyOfferAccepted(userId: string, offer: any): void,
  
  // الحصول على الإشعارات
  getNotifications(userId: string): Notification[],
  
  // تمييز كمقروء
  markAsRead(userId: string, notificationId: string): void,
  
  // حذف إشعار
  deleteNotification(userId: string, notificationId: string): void,
  
  // عدد غير المقروءة
  getUnreadCount(userId: string): number
};
```

---

## 7️⃣ **نظام الذكاء الاصطناعي**

### **الطبقات الأساسية:**

```
┌─────────────────────────────────────────────────────────┐
│              AI_BubbleAssistant (الواجهة)              │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼─────┐
    │ useKernel│   │Awareness│   │  Memory  │
    └────┬────┘    └────┬────┘    └────┬─────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
         ┌──────────────▼──────────────┐
         │    AI_DataPulseCore         │
         │    (معالجة البيانات)        │
         └──────────────┬──────────────┘
                        │
         ┌──────────────▼──────────────┐
         │  DecisionCoreIntegrated     │
         │  (اتخاذ القرارات)           │
         └──────────────┬──────────────┘
                        │
         ┌──────────────▼──────────────┐
         │   processAIIntent           │
         │   (تنفيذ الأوامر)           │
         └─────────────────────────────┘
```

### **A) AI_BubbleAssistant:**
```typescript
// من /components/AI_BubbleAssistant.tsx
interface Props {
  // Callbacks للتكامل
  onOpenCustomer?: (customerId: string) => void;
  onOpenOffer?: (offerId: string) => void;
  onOpenRequest?: (requestId: string) => void;
  onOpenAnalytics?: () => void;
  onNavigate?: (page: string, params?: any) => void;
  onAddAppointment?: (appointment: any) => void;
  
  // معلومات السياق
  currentContext?: string;
  currentPage?: string;
  userId?: string;
}

// يستخدم:
// - useKernel() للاتصال بالنواة
// - useDashboardContext() للوعي
// - useNotificationsAIIntegration() للإشعارات
```

### **B) نظام النوايا (Intents):**
```typescript
// من /api/kernel/processAIIntent.ts
export type IntentType =
  | 'search_customer'        // البحث عن عميل
  | 'list_customers'         // عرض العملاء
  | 'search_request'         // البحث عن طلب
  | 'list_requests'          // عرض الطلبات
  | 'list_urgent_requests'   // الطلبات المستعجلة
  | 'show_analytics'         // عرض التحليلات
  | 'add_appointment'        // إضافة موعد
  | 'navigate_to'            // الانتقال لصفحة
  | 'greeting'               // تحية
  | 'unknown';               // غير معروف

export interface AIResponse {
  intent: IntentType;
  entity: string;            // 'customer' | 'request' | 'offer' | 'appointment'
  action: string;            // 'search' | 'list' | 'create' | 'update'
  query?: string;
  data: any;
  metadata?: any;
}

// مثال على معالجة النية
const response = processAIIntent(userQuery, context);
```

---

## 8️⃣ **نظام التخزين**

### **A) localStorage Keys:**
```typescript
const STORAGE_KEYS = {
  // المستخدم
  USER: 'aqary-crm-user',
  USER_LEGACY: 'aqari_current_user',
  
  // العملاء
  CUSTOMERS: 'crm_customers',
  
  // العروض والطلبات
  OWNER_FULL_OFFERS: 'owner-full-offers-{userId}',
  OWNER_FULL_REQUESTS: 'owner-full-requests-{userId}',
  MARKETPLACE_OFFERS: 'marketplace-offers',
  
  // المواعيد
  APPOINTMENTS: 'calendar_appointments',
  
  // الإشعارات
  NOTIFICATIONS: 'notifications-{userId}',
  
  // ساعات العمل
  WORKING_HOURS: 'working-hours-{userId}',
  
  // التسجيل
  BROKER_REGISTRATION: 'broker-registration-data',
  
  // التاقات المؤقتة (CRM)
  TEMPORARY_TAGS: 'crm_temporary_tags',
  
  // الذاكرة قصيرة المدى (AI)
  AI_SHORT_MEMORY: 'ai-short-memory-{userId}',
  
  // الإعلانات المنشورة
  PUBLISHED_ADS: 'published-ads-{userId}'
};
```

### **B) بنية البيانات في localStorage:**

#### **1. العملاء (crm_customers):**
```typescript
// Array of Customer
[
  {
    id: "customer-1234567890-abc123",
    name: "أحمد محمد",
    phone: "0501234567",
    email: "ahmed@example.com",
    category: "مشتري",
    tags: ["vip", "مهتم-بالفلل"],
    interestLevel: "passionate",
    createdAt: "2025-11-01T10:00:00.000Z",
    updatedAt: "2025-11-23T15:30:00.000Z",
    status: "active",
    assignedTo: "broker-001",
    linkedAdsCount: 3,
    receivedOffers: [...],
    receivedRequests: [...]
  },
  // ...
]
```

#### **2. العروض الكاملة (owner-full-offers-{userId}):**
```typescript
// Array of FullOffer
[
  {
    id: "offer-1234567890",
    propertyType: "villa",
    propertyCategory: "residential",
    city: "الرياض",
    district: "العليا",
    transactionType: "sale",
    price: 2500000,
    area: 350,
    rooms: 5,
    bathrooms: 4,
    features: ["pool", "garden"],
    description: "فيلا فخمة مع مسبح",
    ownerPhone: "0501234567",
    ownerName: "محمد أحمد",
    ownerIdNumber: "1234567890",
    createdAt: "2025-11-20T10:00:00.000Z",
    status: "active",
    
    // التسويق
    commission: 2.5,
    serviceDescription: "تسويق كامل",
    maxBrokers: 10,
    acceptedBrokers: [
      {
        brokerId: "broker-001",
        brokerName: "خالد السعيد",
        brokerPhone: "0509876543",
        acceptedAt: "2025-11-21T12:00:00.000Z"
      }
    ]
  },
  // ...
]
```

#### **3. العروض في السوق (marketplace-offers):**
```typescript
// نسخة مختصرة للعرض في السوق (بدون معلومات المالك الحساسة)
[
  {
    id: "offer-1234567890",
    propertyType: "villa",
    propertyCategory: "residential",
    city: "الرياض",
    district: "العليا",
    transactionType: "sale",
    priceRange: "2,000,000 - 3,000,000",
    area: 350,
    rooms: 5,
    bathrooms: 4,
    features: ["pool", "garden"],
    description: "فيلا فخمة مع مسبح",
    commission: 2.5,
    maxBrokers: 10,
    acceptedCount: 1,
    createdAt: "2025-11-20T10:00:00.000Z"
  },
  // ...
]
```

#### **4. المواعيد (calendar_appointments):**
```typescript
[
  {
    id: "apt-1234567890",
    title: "معاينة فيلا العليا",
    customerName: "أحمد محمد",
    customerPhone: "0501234567",
    customerId: "customer-abc123",
    propertyAddress: "شارع الملك فهد، العليا",
    date: "2025-11-25",
    time: "14:00",
    duration: 60, // minutes
    notes: "المعاينة مع المالك",
    status: "pending",
    createdAt: "2025-11-23T10:00:00.000Z",
    reminderSent: false
  },
  // ...
]
```

### **C) IndexedDB Structure:**
```typescript
// للملفات الكبيرة والوسائط
const DB_NAME = 'aqary-crm-db';
const DB_VERSION = 1;

const OBJECT_STORES = {
  IMAGES: 'images',          // صور العقارات
  DOCUMENTS: 'documents',    // المستندات
  CUSTOMER_MEDIA: 'customer_media',  // وسائط العملاء
  CACHE: 'cache'             // التخزين المؤقت
};

// بنية الصورة
interface StoredImage {
  id: string;
  customerId?: string;
  propertyId?: string;
  blob: Blob;
  type: string;  // 'image/jpeg' | 'image/png'
  size: number;
  uploadedAt: string;
}
```

---

## 9️⃣ **المكونات الرئيسية**

### **A) LeftSliderComplete:**
```typescript
// من /components/LeftSliderComplete.tsx
interface LeftSliderCompleteProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    name: string;
    phone?: string;
    type?: string;
  };
  onNavigate?: (page: string) => void;
  mode?: "menu" | "tools";  // وضع القائمة أو الأدوات
}

// عناصر القائمة (8 عناصر + دعم):
const menuItems = [
  { icon: Home, title: "الرئيسية", action: () => onNavigate("dashboard") },
  { icon: Users, title: "إدارة العملاء", action: () => onNavigate("enhanced-crm") },
  { icon: Target, title: "الطلبات الخاصة", action: () => onNavigate("special-requests") },
  { icon: BarChart, title: "التحليلات", action: () => onNavigate("analytics") },
  { icon: Calendar, title: "المواعيد", action: () => onNavigate("calendar") },
  { icon: FileText, title: "العقود", action: () => onNavigate("contracts") },
  { icon: Tag, title: "العروض المحفوظة", action: () => onNavigate("saved-offers") },
  { icon: Settings, title: "الإعدادات والزملاء", action: () => onNavigate("settings") }
];
```

### **B) RightSliderComplete:**
```typescript
// من /components/RightSliderComplete-fixed.tsx
interface RightSliderCompleteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  mode?: "navigation" | "brokers";
  currentUser?: {...} | null;
}

// 13 عنصر محمي (18 عنصر سابقاً قبل التنظيف):
const RIGHT_SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'الرئيسية' },
  { id: 'business-card', icon: UserCheck, label: 'بطاقة أعمالي الرقمية' },
  { id: 'course', icon: BookOpen, label: 'دورة الوساطة' },
  { id: 'colleagues', icon: Crown, label: 'إدارة الفريق' },
  { id: 'workspace', icon: Briefcase, label: 'مساحة العمل' },
  { id: 'archive', icon: Archive, label: 'الأرشيف' },
  { id: 'calendar', icon: FileText, label: 'عروض الأسعار' },
  { id: 'receipts', icon: Receipt, label: 'سندات القبض' },
  { id: 'tasks-management', icon: Plus, label: 'إدارة المهام' },
  { id: 'analytics', icon: BarChart3, label: 'التحليلات' },
  { id: 'blog', icon: Info, label: 'ما الجديد؟' },
  { id: 'support', icon: Headphones, label: 'الدعم الفني' },
  { id: 'settings', icon: Settings, label: 'الإعدادات' }
];
```

### **C) PageLayout Wrapper:**
```typescript
// من /components/layout/PageLayout.tsx
interface PageLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
}

// الصفحات المستثناة (بدون PageLayout):
const EXCLUDED_PAGES = [
  'registration',
  'pricing',
  'dashboard',
  'business-card',
  'business-card-profile',
  'business-card-edit',
  'home-owners',
  'send-offer',
  'send-request',
  'finance-link'
];

// الاستخدام في App.tsx:
const withPageLayout = (content: ReactNode, skipLayout = false) => {
  if (skipLayout) return content;
  
  return (
    <PageLayout user={user} onNavigate={handleNavigate} currentPage={currentPage}>
      {content}
    </PageLayout>
  );
};
```

### **D) EnhancedBrokerCRM:**
```typescript
// من /components/EnhancedBrokerCRM-with-back.tsx
// نظام CRM الكامل مع:
// - Drag & Drop (DnD Kit)
// - نظام التاقات (13 لون)
// - مستويات الاهتمام
// - تعيين الفريق
// - مزامنة المكالمات
// - الإشعارات

interface EnhancedBrokerCRMProps {
  onBack?: () => void;
}

// الأعمدة (Columns):
const columns = [
  { id: 'new', title: 'جديد', color: '#3b82f6' },
  { id: 'contacted', title: 'تم التواصل', color: '#10b981' },
  { id: 'qualified', title: 'مؤهل', color: '#f59e0b' },
  { id: 'negotiating', title: 'تفاوض', color: '#8b5cf6' },
  { id: 'converted', title: 'تم التحويل', color: '#22c55e' },
  { id: 'lost', title: 'مفقود', color: '#ef4444' }
];
```

---

## 🔟 **التكاملات الخارجية**

### **A) Google Maps (معطل حالياً):**
```typescript
// معالجة أخطاء Google Maps
useEffect(() => {
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (!message.includes('Google Maps') && !message.includes('gmp-')) {
      originalError.apply(console, args);
    }
  };
  
  return () => {
    console.error = originalError;
  };
}, []);
```

### **B) WhatsApp Integration:**
```typescript
// روابط WhatsApp
const whatsappLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

// مثال في LeftSlider
{
  icon: MessageCircle,
  title: "واتساب",
  action: () => window.open("https://wa.me/966501234567")
}
```

### **C) Bank APIs (للحاسبات):**
```typescript
// قائمة البنوك السعودية
const banks = [
  { name: "بنك الراجحي", url: "https://www.alrajhibank.com.sa/personal/finance/calculator" },
  { name: "البنك الأهلي", url: "https://www.alahli.com/ar-sa/personal/Pages/finance-calculator.aspx" },
  { name: "بنك البلاد", url: "https://www.bankalbilad.com/ar/personal/Pages/FinanceCalculator.aspx" },
  // ... 10 بنوك
];

// في /public/bankRates.json
{
  "banks": [
    {
      "name": "الراجحي",
      "rate": 4.5,
      "maxFinance": 85,
      "minDownPayment": 15
    },
    // ...
  ]
}
```

---

## 1️⃣1️⃣ **Event System**

### **أحداث مخصصة (Custom Events):**

```typescript
// A) التنقل من TreeManager
window.dispatchEvent(new CustomEvent('navigateFromTreeManager', {
  detail: { page: 'settings' }
}));

// B) فتح عميل بالجوال
window.dispatchEvent(new CustomEvent('openCustomerByPhone', {
  detail: { phone: '0501234567' }
}));

// C) فتح عميل بالمعرف
window.dispatchEvent(new CustomEvent('openCustomerById', {
  detail: { customerId: 'customer-123' }
}));

// D) فتح طلب
window.dispatchEvent(new CustomEvent('openRequestById', {
  detail: { requestId: 'request-456' }
}));

// E) فتح مستند مالي
window.dispatchEvent(new CustomEvent('openFinancialDocument', {
  detail: { documentId: 'doc-789' }
}));

// F) التنقل لصفحة
window.dispatchEvent(new CustomEvent('navigateToPage', {
  detail: 'analytics'
}));

// G) التنقل لعميل
window.dispatchEvent(new CustomEvent('navigateToCustomer', {
  detail: { customerPhone: '0501234567' }
}));

// H) تحديث العملاء
window.dispatchEvent(new Event('customersUpdated'));
```

### **Listeners في App.tsx:**
```typescript
useEffect(() => {
  // Hash change listener
  const handleHashChange = () => {
    const hash = window.location.hash;
    const hashToPage = {
      '#/home': 'dashboard',
      '#/crm/customers': 'customer-management-72',
      // ...
    };
    const page = hashToPage[hash];
    if (page) setCurrentPage(page);
  };
  
  // Custom event listeners
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('navigateFromTreeManager', handleTreeManagerNavigation);
  window.addEventListener('navigateToPage', handleNavigateToPage);
  window.addEventListener('openFinancialDocument', handleOpenFinancialDocument);
  window.addEventListener('navigateToCustomer', handleNavigateToCustomer);
  
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
    window.removeEventListener('navigateFromTreeManager', handleTreeManagerNavigation);
    window.removeEventListener('navigateToPage', handleNavigateToPage);
    window.removeEventListener('openFinancialDocument', handleOpenFinancialDocument);
    window.removeEventListener('navigateToCustomer', handleNavigateToCustomer);
  };
}, []);
```

---

## 1️⃣2️⃣ **خريطة الاستيراد الكاملة**

### **App.tsx Imports (100+ import):**
```typescript
// React Core
import React, { useState, lazy, Suspense, useCallback, useEffect, Component } from "react";

// Context & Core
import { DashboardProvider, useDashboardContext } from "./context/DashboardContext";
import { findCustomerById } from "./utils/customersManager";
import { useSmartAssistantEnhanced } from "./hooks/useSmartAssistantEnhanced";
import { useMemorySync } from "./hooks/useMemorySync";
import { useAwareness } from "./hooks/useAwareness";
import { useNotificationsAPI } from "./hooks/useNotificationsAPI";
import { useDynamicIntents } from "./hooks/useDynamicIntents";

// Components - Direct Imports
import { UnifiedRegistration, UserType, User } from "./components/unified-registration";
import { UnifiedPricing } from "./components/unified-pricing";
import SimpleDashboard from "./components/SimpleDashboard-updated";
import { BottomNavigationBar } from "./components/bottom-navigation-bar";
import { PlaceholderPage } from "./components/placeholder-page";
import AI_BubbleAssistant from "./components/AI_BubbleAssistant";
import { SettingsAdvanced } from "./components/settings-advanced";
import { Settings } from "./components/settings";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { PageLayout } from "./components/layout/PageLayout";
import { PersistentRightSidebar } from "./components/layout/PersistentRightSidebar";
import { IntegratedCRMLayout } from "./components/layout/IntegratedCRMLayout";
import { EnhancedCRMLayout } from "./components/layout/EnhancedCRMLayout";
import { PersistentSidebarPage } from "./components/layout/PersistentSidebarPages";
import { MarketplacePage } from "./components/marketplace/MarketplacePage";

// Components - Lazy Loaded (30+)
const DashboardMainView252 = lazy(() => import("./components/DashboardMainView252"));
const PricingManagementB2B = lazy(() => import("./components/PricingManagementB2B"));
const FinanceCalculator = lazy(() => import("./components/finance-calculator"));
const FinanceCalculatorPublic = lazy(() => import("./components/FinanceCalculatorPublic"));
const OfferFormPublic = lazy(() => import("./components/OfferFormPublic").then(m => ({ default: m.OfferFormPublic })));
const RequestFormPublic = lazy(() => import("./components/RequestFormPublic").then(m => ({ default: m.RequestFormPublic })));
const PropertyUploadComplete = lazy(() => import("./components/property-upload-complete"));
const SocialMediaPostEnhanced = lazy(() => import("./components/social-media-post-enhanced"));
const FinancialDocumentsView = lazy(() => import("./components/FinancialDocumentsView").then(m => ({ default: m.FinancialDocumentsView })));
const SpecialRequestsPage = lazy(() => import("./components/SpecialRequestsPage"));
const CalendarSystemComplete = lazy(() => import("./components/calendar-system-complete"));
const AppointmentBookingClient = lazy(() => import("./components/appointment-booking-client"));
const WorkingHoursManager = lazy(() => import("./components/working-hours-manager"));
const LeaderCRMSystemComplete = lazy(() => import("./components/leader-crm-system-complete"));
const BusinessCardProfile = lazy(() => import("./components/business-card-profile"));
const BusinessCardEdit = lazy(() => import("./components/business-card-edit"));
const MyPlatform = lazy(() => import("./components/MyPlatform"));
const ComprehensiveCRMSystem = lazy(() => import("./components/ComprehensiveCRMSystem"));
const LeftSliderComplete = lazy(() => import("./components/LeftSliderComplete"));
const AnalyticsDashboard = lazy(() => import("./components/AnalyticsDashboard"));
const AnalyticsPage = lazy(() => import("./components/AnalyticsPage"));
const RequestsPage = lazy(() => import("./components/RequestsPage"));
const HomeOwners = lazy(() => import("./pages/owners/HomeOwners"));
const QuickCalculator = lazy(() => import("./components/QuickCalculator"));
const CommissionCalculator = lazy(() => import("./components/CommissionCalculator"));
const LandCalculator = lazy(() => import("./components/LandCalculator"));
const BuildingAreaCalculator = lazy(() => import("./components/BuildingAreaCalculator"));
const StandardCalculator = lazy(() => import("./components/StandardCalculator"));
const EnhancedBrokerCRM = lazy(() => import("./components/EnhancedBrokerCRM-with-back"));
const CustomerDetailsPage = lazy(() => import("./components/customer-details-page"));
const ArchivePage = lazy(() => import("./components/ArchivePage"));
const FinancialDocuments = lazy(() => import("./components/FinancialDocuments"));
const SmartMatches = lazy(() => import("./components/SmartMatches"));

// Utils
import './utils/debugStorage';
```

### **المكونات الأساسية Imports:**

#### **LeftSliderComplete:**
```typescript
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Home, Users, BarChart, Settings, User, 
  Phone, Mail, HelpCircle, LogOut, MessageCircle,
  TrendingUp, Calendar, FileText, Tag, Grid,
  Upload, Share2, FileSignature, Stamp, Calculator,
  PlusCircle, BookOpen, ChevronDown, ExternalLink,
  Building, Gift, Star, Target
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
```

#### **EnhancedBrokerCRM:**
```typescript
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import UnifiedMainHeader from './layout/UnifiedMainHeader';
import RightSliderComplete from './RightSliderComplete-fixed';
import LeftSliderComplete from './LeftSliderComplete';
import { MiniUserCard } from './layout/DynamicHeader';
import { CRMBottomBar, getTagColor, getColorByName } from './crm-bottom-bar';
import { CallSyncButton } from './CallSyncButton';
import { NotificationsPanel } from './NotificationsPanel';
import { mergeCallsWithCRM, type RecentCall } from '../utils/phoneCallSync';
import { getAllCustomers, deleteCustomer } from '../utils/customersManager';
import { 
  getTeamMembers, 
  getCustomerAssignment, 
  assignCustomerToTeamMember, 
  unassignCustomer 
} from '../utils/teamAssignment';
import { isCustomerUnread, getUnreadNotificationsCount, markCustomerAsRead } from '../utils/notificationsSystem';
import { 
  ArrowRight, Plus, Settings, Users, Search, Filter, 
  Phone, MessageSquare, Mail, MoreVertical, Star,
  MapPin, Building2, Briefcase, Calendar, FileText,
  Share2, ChevronDown, ChevronUp, Tag, Archive,
  Home, DollarSign, Key, X, AlertTriangle, Bell, Menu, PanelLeft, GripVertical,
  UserPlus, ListPlus, SlidersHorizontal, UserCheck, Trash2, Edit, Copy, Send,
  Upload, CheckCircle, UserMinus, Badge as BadgeIcon
} from 'lucide-react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, DragOverEvent, PointerSensor, TouchSensor, MouseSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDashboardContext } from '../context/DashboardContext';
```

---

## 📝 **ملاحظات للإعادة البناء**

### **1. البنية الأساسية:**
```bash
# الخطوات الأساسية
1. إنشاء React App مع TypeScript
2. تثبيت TailwindCSS 4.0
3. إنشاء المجلدات: /components, /hooks, /utils, /types, /api, /context, /core
4. إضافة shadcn/ui components
5. إنشاء DashboardContext
6. بناء App.tsx مع نظام التنقل
```

### **2. الأولويات في التطوير:**
```
المرحلة 1: البنية الأساسية
- App.tsx + DashboardContext
- PageLayout + Headers
- LeftSlider + RightSlider

المرحلة 2: نظام CRM
- customersManager
- EnhancedBrokerCRM
- CustomerDetailsPage

المرحلة 3: الذكاء الاصطناعي
- AI Cores
- useKernel
- AI_BubbleAssistant

المرحلة 4: الميزات الإضافية
- Analytics
- Calendar
- Marketplace
- Calculators

المرحلة 5: التحسينات
- Notifications
- Team Management
- Financial Documents
```

### **3. الاعتمادات الحرجة:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "motion": "latest",
    "lucide-react": "latest",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0",
    "@dnd-kit/utilities": "^3.2.0",
    "react-hook-form": "7.55.0",
    "recharts": "^2.5.0",
    "sonner": "2.0.3"
  }
}
```

---

## 🎯 **الخلاصة النهائية**

### **ما يميز هذا التقرير:**
✅ **خريطة كاملة للمسارات** (50+ صفحة)  
✅ **أنواع بيانات دقيقة** (TypeScript Interfaces)  
✅ **نظام الأحداث الكامل** (Custom Events)  
✅ **State Management موثق** (Context + localStorage)  
✅ **APIs و Hooks موثقة** (13+ hook, 15+ API)  
✅ **خريطة استيراد شاملة** (100+ import)  
✅ **بنية الملفات الكاملة** (structure tree)  
✅ **نظام التخزين** (localStorage + IndexedDB)  

### **استخدام هذا التقرير:**
أي AI يمكنه الآن:
1. فهم البنية الكاملة للتطبيق
2. إعادة بناء أي جزء بدقة
3. إضافة ميزات جديدة بدون تعارض
4. فهم العلاقات بين المكونات
5. تتبع تدفق البيانات
6. معرفة كل الاستيرادات المطلوبة

---

**✨ تم إنشاء هذا التقرير بواسطة: Nova + Soni AI Supreme**  
**📅 التاريخ: نوفمبر 2025**  
**🎯 المستوى: Technical Architecture - Complete**
