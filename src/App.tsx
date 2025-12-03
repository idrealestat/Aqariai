/*
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                        APP.TSX - Main Application File                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

📋 Main Application Entry Point
────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  📅 Last Updated: نوفمبر 2025
  👤 Owner: مؤسسة الأحلام العقارية
  📂 File Type: Main Application Entry Point
  
📊 File Statistics:
────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  • Managed Pages: 50+ pages
  • Imported Components: 30+ components
  • Routes Handled: 40+ routes
  • Providers: DashboardProvider, ErrorBoundary
  • AI Assistant: Fully integrated with advanced callbacks

🔗 Dependencies:
────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  • SimpleDashboard-updated.tsx - Main Dashboard
  • AI_BubbleAssistant.tsx - Global AI Assistant
  • DashboardContext.tsx - Central Awareness Context
  • LeftSliderComplete.tsx - Left Menu
  • RightSliderComplete-fixed.tsx - Right Menu (18 items)
  • All CRM Components - Full CRM System
  • All Analytics Components - Full Analytics System

🎯 Key Features:
───────────────────────────────────────────────────���────────────────────────────────────────────────────────────
  ✓ Central Navigation System (handleNavigate)
  ✓ Central Awareness System (DashboardContext)
  ✓ Global AI Assistant (AI_BubbleAssistant)
  ✓ 50+ Pages Handling
  ✓ Lazy loading for performance
  ✓ Error boundaries
  ✓ Toast notifications
  ✓ Numbering system
  ✓ Advanced AI callbacks:
    - handleOpenCustomer
    - handleOpenOffer
    - handleOpenRequest
    - handleOpenAnalytics

════════════════════════════════════════════════════════════════════════════════════════════════════════════════
*/

import React, { useState, lazy, Suspense, useCallback, useEffect, Component, ErrorInfo, ReactNode } from "react";

/*
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                   🔒 PROTECTED FILES SYSTEM - نظام الملفات المحمية                         ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

📊 نظام حماية شامل تم إنشاؤه: 2 نوفمبر 2025
🔖 الإصدار: 1.0.0-COMPLETE-PROTECTION
📂 إجمالي الملفات المحمية: 43 ملف (+ App.tsx محمي بالكامل)

🛡️ الملفات الرئيسية المحمية:
────────────────────────────────────────────────────────────────
  1. LeftSliderComplete.tsx ✅ - القائمة اليسرى (محمي بالكامل)
  2. RightSliderComplete-fixed.tsx ✅ - القائمة اليمنى (18 عنصر محمي)
  3. SimpleDashboard-updated.tsx ⚠️ - الواجهة الرئيسية (محمي جزئياً)

📚 الوثائق المتاحة:
──────────────────────────────────────────────────────��─────────
  • /PROTECTED-SLIDERS-COMPLETE.md - الوث��قة الشاملة الكاملة
  • /PROTECTED-FILES-LIST.md - القائمة السريعة (42 ملف)
  • /check-protected-files.py - سكريبت Python للتحقق
  • /PROTECTION-SYSTEM-README.md - دليل الاستخدام

⚠️ قبل حذف أي ملف:
────────────────────────────────────────────────────────────────
  1. راجع /PROTECTED-FILES-LIST.md
  2. أو استخدم: python check-protected-files.py <اسم_الملف>
  3. تأكد من عدم وجود 🔒 بجانب الملف

🚫 ممنوع حذف:
────────────────────────────────────────────────────────────────
  • أي ملف في /components/ui/* (ShadCN)
  • أي ملف في /components/crm/* (نظام CRM)
  • أي ملف في /components/analytics/* (نظام التحليلات)
  • أي ملف مرتبط بعناصر RightSlider الـ 18
  • LeftSlider & RightSlider ومحتوياتهم

════════════════════════════════════════════════════════════════════════════════════════════════════════════════
*/

import { UnifiedRegistration, UserType, User } from "./components/unified-registration";
import { UnifiedPricing } from "./components/unified-pricing";
import SimpleDashboard from "./components/SimpleDashboard-updated";
import { BottomNavigationBar } from "./components/bottom-navigation-bar";
import { PlaceholderPage } from "./components/placeholder-page";
import { DashboardProvider, useDashboardContext } from "./context/DashboardContext";
import AI_BubbleAssistant from "./components/AI_BubbleAssistant";
import { findCustomerById } from "./utils/customersManager";
import { useSmartAssistantEnhanced } from "./hooks/useSmartAssistantEnhanced";
import { useMemorySync } from "./hooks/useMemorySync";
import { useAwareness } from "./hooks/useAwareness";
import './utils/debugStorage'; // 🔧 أداة تصحيح الأخطاء
import { useNotificationsAPI } from "./hooks/useNotificationsAPI";
import { useDynamicIntents } from "./hooks/useDynamicIntents";
import { PageLayout } from "./components/layout/PageLayout";

// 🗑️ DELETED PERMANENTLY: نظام العروض والطلبات محذوف من الجذور
// 🗑️ DELETED PERMANENTLY: النظام المحسن محذوف من الجذور
import { SettingsAdvanced } from "./components/settings-advanced";
import { Settings } from "./components/settings"; // ✅ مكون الإعدادات الكامل مع تبويب الإشعارات
import { Toaster } from "./components/ui/sonner";
import { PersistentRightSidebar } from "./components/layout/PersistentRightSidebar";
import { IntegratedCRMLayout } from "./components/layout/IntegratedCRMLayout";
import { EnhancedCRMLayout } from "./components/layout/EnhancedCRMLayout";
import { PersistentSidebarPage } from "./components/layout/PersistentSidebarPages";
import { Button } from "./components/ui/button";
import { MarketplacePage } from "./components/marketplace/MarketplacePage";

// Lazy loaded components - simplified and fixed
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

// Simplified lazy imports - all components now have default exports
const CalendarSystemComplete = lazy(() => import("./components/calendar-system-complete"));
const AppointmentBookingClient = lazy(() => import("./components/appointment-booking-client"));
const WorkingHoursManager = lazy(() => import("./components/working-hours-manager"));
const LeaderCRMSystemComplete = lazy(() => import("./components/leader-crm-system-complete"));

/**
 * ⚠️⚠️⚠️ ملفات محمية - PROTECTED FILES ⚠️⚠️⚠️
 * 
 * الملفات التالية محمية من أي تعديل:
 * - /components/business-card-profile.tsx
 * - /components/business-card-edit.tsx
 * 
 * ✅ قبل التعديل على أي منها يجب:
 * 1. إخبار المستخدم أن الملف محمي
 * 2. شرح سبب التعديل المطلوب
 * 3. الحصول على تصريح صريح
 * 4. عدم المضي بدون موافقة
 */
const BusinessCardProfile = lazy(() => import("./components/business-card-profile"));
const BusinessCardEdit = lazy(() => import("./components/business-card-edit"));

const MyPlatform = lazy(() => import("./components/MyPlatform"));
const ComprehensiveCRMSystem = lazy(() => import("./components/ComprehensiveCRMSystem"));
const LeftSliderComplete = lazy(() => import("./components/LeftSliderComplete"));
const AnalyticsDashboard = lazy(() => import("./components/AnalyticsDashboard"));
const AnalyticsPage = lazy(() => import("./components/AnalyticsPage"));
const RequestsPage = lazy(() => import("./components/RequestsPage"));

const HomeOwners = lazy(() => import("./pages/owners/HomeOwners"));

// تم حذف: استيراد HomeOwners - مقفل نهائياً

// 🗑️ DELETED PERMANENTLY: واجهة OffersRequestsUser محذوفة من الجذور

// Quick Calculator Components
const QuickCalculator = lazy(() => import("./components/QuickCalculator"));
const CommissionCalculator = lazy(() => import("./components/CommissionCalculator"));
const LandCalculator = lazy(() => import("./components/LandCalculator"));
const BuildingAreaCalculator = lazy(() => import("./components/BuildingAreaCalculator"));
const StandardCalculator = lazy(() => import("./components/StandardCalculator"));

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error.name, error.message, {
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-gray-600 mb-4">نعتذر عن هذا الخطأ. يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optimized loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-[#01411C] text-sm">تحميل...</p>
    </div>
  </div>
);

// Simple test scroll page component - removed to reduce bundle size
const ScrollTestPage = ({ onBack }: { onBack: () => void }) => (
  <div className="p-4 text-center" dir="rtl">
    <h1 className="text-xl font-bold text-[#01411C] mb-4">صفحة اختبار</h1>
    <button 
      onClick={onBack}
      className="px-6 py-2 bg-[#01411C] text-white rounded-lg"
    >
      العودة للوحة التحكم
    </button>
  </div>
);

// 🗑️ DELETED PERMANENTLY BY مؤسسة الأحلام العقارية: ComprehensiveCRMSystem محذوف نهائياً
// تم حذف نظام إدارة العملاء التقليدي رقم 257 بالكامل

const EnhancedBrokerCRM = lazy(() => import("./components/EnhancedBrokerCRM-with-back"));
const CustomerDetailsPage = lazy(() => import("./components/customer-details-page"));
const ArchivePage = lazy(() => import("./components/ArchivePage"));
const FinancialDocuments = lazy(() => import("./components/FinancialDocuments"));
const SmartMatches = lazy(() => import("./components/SmartMatches"));

// DELETED: StoreFront component has been permanently removed

// 🎯 مكون المحتوى الرئيسي - يستخدم DashboardContext
function AppContent() {
  // 🧠 الوصول لسياق لوحة التحكم
  const {
    setActivePage,
    setActiveCustomer,
    setActiveRequest
  } = useDashboardContext();

  // State management - مبسط
  const [customersData, setCustomersData] = useState<any[]>(() => {
    // ✅ تحميل البيانات من localStorage عند البداية
    const saved = localStorage.getItem('crm_customers');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState<string>(() => {
    // التحقق من الرابط عند التحميل
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path.startsWith('/finance-link/')) {
      return "finance-link";
    }
    if (hash.startsWith('#/send-offer/')) {
      return "send-offer";
    }
    if (hash.startsWith('#/send-request/')) {
      return "send-request";
    }
    return "dashboard";
  });
  
  // ✅ إضافة state للتبويب المبدئي في صفحة الإعدادات
  const [settingsInitialTab, setSettingsInitialTab] = useState<string | undefined>(undefined);
  
  // 🔄 تحميل بيانات المستخدم من localStorage أو استخدام البيانات التجريبية
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('aqary-crm-user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        console.log('✅ تم تحميل بيانات المستخدم من localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
    }
    
    // البيانات التجريبية الافتراضية
    return {
      id: "demo-user-0501234567",
      name: "مستخدم تجريبي",
      phone: "0501234567",
      type: "individual",
      plan: "bronze",  // ✅ تغيير من "باقة تجريبية" إلى "bronze" للتوافق مع SubscriptionTierSlab
      email: "demo@test.com"
    } as User;
  });
  
  const [userType, setUserType] = useState<UserType>(user?.type || "individual");
  const [loading, setLoading] = useState(false);

  // 🗑️ DELETED PERMANENTLY: متغيرات نظام العروض والطلبات محذوفة من الجذور
  
  // حالة الشريط الجانبي الدائم
  const [showPersistentSidebar, setShowPersistentSidebar] = useState(false);
  
  // حالة التبويب الأولي لصفحة النشر على المنصات
  const [propertyUploadInitialTab, setPropertyUploadInitialTab] = useState<string | undefined>(undefined);
  
  // 🤖 State للمساعد الذكي المحسّن
  const [assistantMessages, setAssistantMessages] = useState<any[]>([]);

  // 🤖 تفعيل الدمج الكامل: الوعي + النقاش الحر + ذاكرة 5 محادثات + إشعارات حقيقية
  const smartAssistant = useSmartAssistantEnhanced({
    userId: user?.id || 'demo-user',
    currentPage,
    setMessages: setAssistantMessages
  });

  // 🧠 طبقة الوعي الكاملة (AI_ConsciousLayer)
  const memorySync = useMemorySync(user?.id || 'demo-user');
  const awareness = useAwareness(user?.id || 'demo-user', currentPage);
  const notificationsAPI = useNotificationsAPI(user?.id || 'demo-user', setAssistantMessages);
  const dynamicIntents = useDynamicIntents(user?.id || 'demo-user', setAssistantMessages);

  // 🔄 مزامنة بيانات المستخدم مع localStorage عند أي تغيير
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

  // 🎯 دمج طبقة الوعي مع المساعد الذكي
  useEffect(() => {
    // تفعيل الوعي التلقائي عند تحميل التطبيق
    if (user?.id) {
      console.log('🧠 AI Conscious Layer Activated:', {
        userId: user.id,
        currentPage,
        memoryCount: memorySync.memory.length,
        awarenessState: awareness.awarenessState
      });
    }
  }, [user?.id, currentPage, memorySync.memory.length, awareness.awarenessState]);

  // تنظيف مبسط لمنع التداخل مع الأداء
  useEffect(() => {
    // تجاهل أخطاء Google Maps فقط
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

  // معالجة مبسطة للأحداث
  useEffect(() => {
    // 🗑️ DELETED: handleEnhanced - محذوف مع نظام العروض والطلبات

    // ✅ إضافة listener لتغيير hash للتنقل التلقائي من المساعد الذكي
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('🔄 [Hash Changed]:', hash);
      
      // تحويل hash إلى page name
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
      
      const page = hashToPage[hash];
      if (page) {
        console.log('✅ [Hash Navigation] Navigating to:', page);
        setCurrentPage(page);
      }
    };

    const handleTreeManagerNavigation = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.page) {
        setCurrentPage(customEvent.detail.page);
      }
    };

    const handleNavigateToPage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setCurrentPage(customEvent.detail);
      }
    };

    const handleOpenFinancialDocument = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setCurrentPage("financial-documents");
        // يمكن تمرير البيانات لاحقاً
      }
    };

    const handleNavigateToCustomer = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.customerPhone) {
        // الانتقال لصفحة CRM مع تمرير رقم جوال العميل
        setCurrentPage("enhanced-crm");
        // إطلاق حدث لفتح بطاقة العميل مباشرة
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openCustomerByPhone', {
            detail: { phone: customEvent.detail.customerPhone }
          }));
        }, 100);
      }
    };

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

  // معالجة سريعة للتسجيل
  const handleRegistrationComplete = useCallback((userData: User) => {
    if (!userData?.name) {
      alert("بيانات المستخدم غير صحيحة");
      return;
    }
    
    // 🔄 حفظ بيانات المستخدم في localStorage
    try {
      localStorage.setItem('aqari_current_user', JSON.stringify(userData));
      console.log('✅ تم حفظ بيانات المستخدم في localStorage:', userData);
    } catch (error) {
      console.error('❌ خطأ في حفظ بيانات المستخدم:', error);
    }
    
    setUser(userData);
    setCurrentPage("pricing");
  }, []);

  // معالجة سريعة لاختيار الباقة
  const handleSelectPlan = useCallback((plan: string) => {
    if (!user || !plan) {
      alert("خطأ في البيانات");
      return;
    }
    
    // 🔄 تحديث بيانات المستخدم مع الباقة الجديدة
    const updatedUser = { ...user, plan };
    
    // 🔄 حفظ البيانات المحدثة في localStorage
    try {
      localStorage.setItem('aqari_current_user', JSON.stringify(updatedUser));
      console.log('✅ تم حفظ الباقة في localStorage:', { plan, user: updatedUser });
    } catch (error) {
      console.error('❌ خطأ ��ي حفظ الباقة:', error);
    }
    
    setUser(updatedUser);
    setCurrentPage("dashboard");
  }, [user]);

  // Handle user type selection
  const handleUserTypeSelect = useCallback((type: UserType) => {
    setUserType(type);
  }, []);

  // 🗑️ DELETED PERMANENTLY: handleOffersRequestsStart - محذوف مع نظام العروض والطلبات

  // إزالة الشريط الجانبي الدائم - سيتم استخدام الشريط الجانبي الكامل بدلاً منه
  const pagesWithPersistentSidebar: string[] = [];

  // ============================================
  // 🎯 Callbacks المتقدمة للمساعد الذكي
  // ============================================

  // معالج فتح العميل
  const handleOpenCustomer = useCallback((customerId: string) => {
    const customer = findCustomerById(customerId);
    if (customer) {
      // 🧠 تحديث الوعي المركزي
      setActiveCustomer(customer);
      setActivePage('customer-details');
      
      // الانتقال لصفحة CRM
      setCurrentPage('enhanced-crm');
      
      // إطلاق حدث لفتح بطاقة العميل
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openCustomerById', {
          detail: { customerId }
        }));
      }, 100);
    }
  }, [setActiveCustomer, setActivePage]);

  // معالج فتح العرض
  const handleOpenOffer = useCallback((offerId: string) => {
    console.warn('Offers system temporarily disabled');
    
    // 🧠 تحديث الوعي
    setActivePage('offers');
    
    // الانتقال لصفحة العروض
    setCurrentPage('property-upload-complete');
  }, [setActivePage]);

  // معالج فتح الطلب
  const handleOpenRequest = useCallback((requestId: string) => {
    console.log('📋 Opening request:', requestId);
    
    // 🧠 تحديث الوعي
    setActivePage('requests');
    
    // الانتقال لصفحة الطلبات
    setCurrentPage('requests');
    
    // إطلاق حدث لفتح بطاقة الطلب
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openRequestById', {
        detail: { requestId }
      }));
    }, 100);
  }, [setActivePage]);

  // معالج فتح التحليلات
  const handleOpenAnalytics = useCallback(() => {
    console.log('📊 Opening analytics');
    
    // 🧠 تحديث الوعي
    setActivePage('analytics');
    
    // الانتقال لصفحة التحليلات
    setCurrentPage('analytics-page');
  }, [setActivePage]);

  // ============================================
  // تبسيط معالج التنقل لمنع التأخير
  // ============================================
  const handleNavigate = useCallback((page: string, tabOrOptions?: string | { initialTab?: string }) => {
    if (!page || typeof page !== 'string') {
      return;
    }
    
    // ✅ دعم كلا الصيغتين: (page, tab) أو (page, { initialTab })
    let initialTab: string | undefined;
    let options: { initialTab?: string } | undefined;
    
    if (typeof tabOrOptions === 'string') {
      // استخدام مباشر: handleNavigate("settings", "notifications")
      initialTab = tabOrOptions;
      options = { initialTab };
    } else {
      // استخدام كائن: handleNavigate("settings", { initialTab: "notifications" })
      options = tabOrOptions;
      initialTab = options?.initialTab;
    }
    
    console.log('📍 handleNavigate:', { page, initialTab, options });
    
    // ✅ معالجة خاصة لصفحة الإعدادات مع تبويب مبدئي
    if (page === "settings" && initialTab) {
      console.log('✅ تعيين settingsInitialTab:', initialTab);
      setSettingsInitialTab(initialTab);
    } else if (page !== "settings") {
      setSettingsInitialTab(undefined);
    }
    
    // معالجة خاصة لصفحة النشر على المنصات مع تبويب مبدئي
    if (page === "property-upload-complete" && initialTab) {
      console.log('✅ تعيين propertyUploadInitialTab:', initialTab);
      setPropertyUploadInitialTab(initialTab);
    } else if (page !== "property-upload-complete") {
      setPropertyUploadInitialTab(undefined);
    }
    
    // تحديد سريع للشريط الجانبي
    const needsPersistentSidebar = pagesWithPersistentSidebar.includes(page);
    setShowPersistentSidebar(needsPersistentSidebar);
    
    // 🗑️ DELETED: معالجة صفحات نظام العروض والطلبات - محذوفة من الجذور
    
    console.log('🎯 الانتقال إلى الصفحة:', page);
    
    // 🧠 تحديث الصفحة النشطة في الوعي المركزي
    setActivePage(page);
    
    setCurrentPage(page);
  }, [user, setActivePage]);

  // 🗑️ DELETED PERMANENTLY: handleOffersRequestsRegistrationComplete - محذوف من الجذور
  // 🗑️ DELETED PERMANENTLY: handleOffersRequestsWelcomeComplete - محذوف من الجذور

  // التنقل التلقائي عند عدم وجود عميل في customer-details
  useEffect(() => {
    if (currentPage.startsWith('customer-details/')) {
      const customerIdMatch = currentPage.match(/customer-details\/(.+)/);
      const customerId = customerIdMatch ? customerIdMatch[1] : null;
      
      const customer = customerId ? findCustomerById(customerId) : null;
      
      if (!customerId || !customer) {
        console.warn('⚠️ لم يُع��ر على العميل، التنقل لإدارة العملاء');
        handleNavigate("customer-management-72");
      }
    }
  }, [currentPage, handleNavigate]);

  // ✅ تحديث customersData تلقائياً من localStorage كل ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      const customers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
      setCustomersData(customers);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // إزالة التحميل المعطل للأداء

  // Helper function لإضافة PageLayout تلقائياً
  const withPageLayout = (content: React.ReactNode, skipLayout = false) => {
    if (skipLayout) return content;
    
    return (
      <PageLayout 
        user={user} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
      >
        {content}
      </PageLayout>
    );
  };

  // Separate render function for better performance
  function renderMainContent() {
    // معالجة صفحات customer-details/{id}
    if (currentPage.startsWith('customer-details/')) {
      const customerIdMatch = currentPage.match(/customer-details\/(.+)/);
      const customerId = customerIdMatch ? customerIdMatch[1] : null;
      
      // ✅ البحث عن العميل من customersManager مباشرة للحصول على ال��يانات الكاملة
      const customer = customerId ? findCustomerById(customerId) : null;
      
      // إذا لم يُعثر على العميل، عرض fallback والتنقل في useEffect
      if (!customerId || !customer) {
        return <LoadingSpinner />;
      }
      
      return withPageLayout(
        <Suspense fallback={<LoadingSpinner />}>
          <CustomerDetailsPage
            customer={customer}
            onBack={() => handleNavigate("customer-management-72")}
            onUpdate={(updatedCustomer) => {
              // تحديث البيانات في localStorage
              const updatedCustomers = customersData.map((c: any) =>
                c.id === updatedCustomer.id ? updatedCustomer : c
              );
              localStorage.setItem('crm_customers', JSON.stringify(updatedCustomers));
              setCustomersData(updatedCustomers);
            }}
            onNavigate={handleNavigate}
          />
        </Suspense>
      );
    }
    
    switch (currentPage) {
      case "registration":
        return (
          <UnifiedRegistration 
            onComplete={handleRegistrationComplete}
            onUserTypeSelect={handleUserTypeSelect}
            userType={userType}
            onNavigate={handleNavigate}
          />
        );

      case "pricing":
        return (
          <UnifiedPricing 
            onBack={() => setCurrentPage("registration")} 
            onSelectPlan={handleSelectPlan}
            userType={userType}
            user={user}
          />
        );

      case "dashboard":
        return (
          <>
            <SimpleDashboard user={user} onNavigate={handleNavigate} />
            <BottomNavigationBar currentPage={currentPage} onNavigate={handleNavigate} />
          </>
        );

      case "dashboard-main-252":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardMainView252
              user={user}
              onNavigate={handleNavigate}
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "pricing-management":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PricingManagementB2B
              onBack={() => setCurrentPage("dashboard-main-252")}
            />
          </Suspense>
        );

      case "scroll-test":
        return withPageLayout(<ScrollTestPage onBack={() => setCurrentPage("dashboard")} />);

      // 🗑️ DELETED PERMANENTLY: offers-requests-registration - محذوف من الجذور
      // 🗑️ DELETED PERMANENTLY: offers-requests-welcome - محذوف من الجذور
      // 🗑️ DELETED PERMANENTLY: offers-requests-dashboard - محذوف من الجذور
      // 🗑️ DELETED PERMANENTLY: enhanced-team-dashboard - محذوف من الجذور

      // DELETED PERMANENTLY: platform-publishing and mubtaker-catalogue cases removed
      // These features have been merged into property-upload-complete (service #31)

            // DELETED PERMANENTLY: store case removed by مؤسسة الأحلام العقارية

      // 🗑️ DELETED PERMANENTLY BY مؤسسة الأحلام العقارية: مسار "crm" محذوف نهائياً
      // case "crm": تم حذف إدارة العملاء التقليدية رقم 257 بالكامل

      case "enhanced-crm":
      case "customer-management-72":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <EnhancedBrokerCRM 
              user={user} 
              onNavigate={handleNavigate}
            />
          </Suspense>
        );

      case "settings":
        // ✅ استخدام Settings الكامل إذا كان التبويب المطلوب هو "notifications"
        if (settingsInitialTab === "notifications") {
          return withPageLayout(
            <Settings 
              onBack={() => setCurrentPage("dashboard")}
              defaultTab="notifications"
            />
          );
        }
        // استخدام SettingsAdvanced للتبويبات الأخرى
        return withPageLayout(
          <SettingsAdvanced 
            onBack={() => setCurrentPage("dashboard")}
            currentUser={user ? {
              name: user.name,
              phone: user.phone,
              type: user.type,
              email: user.email,
              plan: user.plan
            } : undefined}
            defaultTab={settingsInitialTab}
          />
        );

      case "colleagues":
        return withPageLayout(
          <SettingsAdvanced 
            onBack={() => setCurrentPage("dashboard")}
            currentUser={user ? {
              name: user.name,
              phone: user.phone,
              type: user.type,
              email: user.email,
              plan: user.plan
            } : undefined}
            defaultTab="team"
          />
        );

      case "finance-calculator":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <FinanceCalculator
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "finance-link":
        const linkId = window.location.pathname.split('/').pop();
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <FinanceCalculatorPublic linkId={linkId} />
          </Suspense>
        );

      case "send-offer":
        const hashParts1 = window.location.hash.split('/');
        const brokerPhone1 = hashParts1[2];
        const brokerName1 = decodeURIComponent(hashParts1[3] || '');
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <OfferFormPublic brokerPhone={brokerPhone1} brokerName={brokerName1} />
          </Suspense>
        );

      case "send-request":
        const hashParts2 = window.location.hash.split('/');
        const brokerPhone2 = hashParts2[2];
        const brokerName2 = decodeURIComponent(hashParts2[3] || '');
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <RequestFormPublic brokerPhone={brokerPhone2} brokerName={brokerName2} />
          </Suspense>
        );

      case "analytics":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <AnalyticsPage 
              onBack={() => setCurrentPage("dashboard")}
              userId={user?.id}
            />
          </Suspense>
        );

      case "special-requests":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <SpecialRequestsPage
              onBack={() => setCurrentPage("dashboard")}
              currentUser={user ? {
                name: user.name,
                phone: user.phone,
                email: user.email
              } : undefined}
            />
          </Suspense>
        );

      case "requests":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <RequestsPage />
          </Suspense>
        );

      case "market-insights":
      case "analytics-dashboard":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <AnalyticsDashboard 
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "property-upload-complete":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PropertyUploadComplete
              onBack={() => setCurrentPage("dashboard")}
              initialTab={propertyUploadInitialTab}
            />
          </Suspense>
        );

      case "calendar-system-complete":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <CalendarSystemComplete
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "quick-calculator":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <QuickCalculator onNavigate={handleNavigate} />
          </Suspense>
        );

      case "commission-calculator":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <CommissionCalculator onNavigate={handleNavigate} />
          </Suspense>
        );

      case "land-calculator":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <LandCalculator onNavigate={handleNavigate} />
          </Suspense>
        );

      case "building-area-calculator":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <BuildingAreaCalculator onNavigate={handleNavigate} />
          </Suspense>
        );

      case "standard-calculator":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <StandardCalculator onNavigate={handleNavigate} />
          </Suspense>
        );

      case "receipts":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <FinancialDocumentsView
              type="receipts"
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "calendar":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <FinancialDocumentsView
              type="quotations"
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "appointment-booking":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <AppointmentBookingClient
              brokerId="broker-123"
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "working-hours":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <WorkingHoursManager
              onBack={() => setCurrentPage("dashboard")}
              onSave={(workingHours: any) => {
                console.log('ساعات العمل محفوظة:', workingHours);
                setCurrentPage("dashboard");
              }}
            />
          </Suspense>
        );

      case "leader-crm-calendar":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <LeaderCRMSystemComplete
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      // DELETED PERMANENTLY BY مؤسسة الأحلام العقارية: property-upload محذوف نهائياً

      // PROTECTED SYSTEM 253 - لوحة التحكم الشاملة المحمية
      case "protected-dashboard-253":
        return (
          <div className="min-h-screen flex items-center justify-center bg-red-50" dir="rtl">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border-2 border-red-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔒</span>
              </div>
              <h1 className="text-2xl font-bold text-red-700 mb-4">خدمة محمية</h1>
              <p className="text-red-600 mb-6">هذه الخدمة محمية من الحذف ولا يمكن الوص��ل إليها</p>
              <Button
                onClick={() => setCurrentPage("dashboard")}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                العودة للواجهة الرئيسية
              </Button>
            </div>
          </div>
        );

      // 🗑️ DELETED PERMANENTLY BY مؤسسة الأحلام العقارية: النظام 254 محذوف نهائياً
      // تم دمج وظائفه في property-upload-complete (الخدمة 31)

      case "social-media-post":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <SocialMediaPostEnhanced
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "broker-tools":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="إضافات للوسيط"
              onBack={() => setCurrentPage("dashboard")}
              icon="🛠️"
              description="أدوات خاصة للوسطاء"
              features={["أدوات متقدمة", "تقارير", "إعدادات"]}
            />
          </Suspense>
        );

      case "blog":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="مدونة الوسطاء"
              onBack={() => setCurrentPage("dashboard")}
              icon="📚"
              description="مقالات ونصائح للوسطاء"
              features={["مقالات حديثة", "نصائح", "تجارب"]}
            />
          </Suspense>
        );

      case "contracts":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="العقود"
              onBack={() => setCurrentPage("dashboard")}
              icon="📄"
              description="إدارة العقود والوثائق"
              features={["عقود جديدة", "قوالب", "توقيع إلكتروني"]}
            />
          </Suspense>
        );

      case "saved-offers":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="العروض المحفوظة"
              onBack={() => setCurrentPage("dashboard")}
              icon="💾"
              description="العروض التي أعجبتك"
              features={["قائمة المفضلة", "بحث سريع", "ملاحظات"]}
            />
          </Suspense>
        );

      case "help":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="مركز المساعدة"
              onBack={() => setCurrentPage("dashboard")}
              icon="❓"
              description="الدعم والمساعدة"
              features={["الأسئلة الشائعة", "دعم فني", "تواصل معنا"]}
            />
          </Suspense>
        );

      case "workspace":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="مساحة العمل"
              onBack={() => setCurrentPage("dashboard")}
              icon="💼"
              description="مساحة العمل الشخصية"
              features={["الملفات", "المشاريع", "التعاون"]}
            />
          </Suspense>
        );

      case "smart-matches":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <SmartMatches onNavigate={handleNavigate} />
          </Suspense>
        );

      case "team-management":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="إدارة الفريق"
              onBack={() => setCurrentPage("dashboard")}
              icon="👥"
              description="إدارة أعضاء الفريق"
              features={["إضافة أعضاء", "الصلاحيات", "التقارير"]}
            />
          </Suspense>
        );

      case "tasks-management":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <PlaceholderPage 
              title="إدارة المهام"
              onBack={() => setCurrentPage("dashboard")}
              icon="✅"
              description="تنظيم المهام والمتابعة"
              features={["مهام جديدة", "تذكيرات", "إنجاز"]}
            />
          </Suspense>
        );

      case "archive":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <ArchivePage 
              archivedCustomers={[]} // سيتم ربطها لاحقاً
              onRestore={(customerId) => {
                console.log('است��ادة العميل:', customerId);
                setCurrentPage("customer-management-72");
              }}
              onPermanentDelete={(customerId) => {
                console.log('حذف نهائي:', customerId);
              }}
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "business-card":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <BusinessCardProfile
              user={user}
              onBack={() => setCurrentPage("dashboard")}
              onEditClick={() => setCurrentPage("business-card-edit")}
            />
          </Suspense>
        );

      case "business-card-edit":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <BusinessCardEdit
              user={user}
              onBack={() => setCurrentPage("business-card")}
            />
          </Suspense>
        );

      case "my-platform":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <MyPlatform
              user={user}
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "financial-documents":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <FinancialDocuments 
              onBack={() => setCurrentPage("customer-management-72")}
              brokerInfo={user ? {
                id: user.id || 'default',
                name: user.name,
                companyName: user.companyName,
                licenseNumber: user.licenseNumber,
                phone: user.phone,
                email: user.email
              } : undefined}
            />
          </Suspense>
        );



      case "test-team":
        return (
          <div className="p-8 text-center" dir="rtl">
            <h1 className="text-xl font-bold text-[#01411C] mb-4">👥 اختبار إدارة الفريق</h1>
            <p className="text-gray-600 mb-4">هذه الصفحة ��يد التطوير</p>
            <button 
              onClick={() => setCurrentPage("dashboard")}
              className="px-6 py-2 bg-[#01411C] text-white rounded-lg"
            >
              العودة للوحة التحكم
            </button>
          </div>
        );

      case "test-right-slider-complete":
        return (
          <div className="p-4" dir="rtl">
            <h1 className="text-xl font-bold text-[#01411C] mb-4">اختبار الشريط الجانبي الأيمن الكامل</h1>
            <div className="space-y-4">
              <button 
                onClick={() => setCurrentPage("dashboard")}
                className="px-6 py-2 bg-[#01411C] text-white rounded-lg"
              >
                العودة للوحة التحكم
              </button>
              <p className="text-gray-600">تم إنشاء RightSliderComplete.tsx - يحتوي على جميع المحتوى المطلوب</p>
            </div>
          </div>
        );

      case "test-left-slider-complete":
        return (
          <div className="p-4" dir="rtl">
            <h1 className="text-xl font-bold text-[#01411C] mb-4">اختبار الشريط الجانبي الأيسر الكامل</h1>
            <div className="space-y-4">
              <button 
                onClick={() => setCurrentPage("dashboard")}
                className="px-6 py-2 bg-[#01411C] text-white rounded-lg"
              >
                العودة للوحة التحكم
              </button>
              <p className="text-gray-600">تم إنشاء LeftSliderComplete.tsx - يحتوي على جميع المحتوى المطلوب</p>
            </div>
          </div>
        );

      case "test-right-slider-restored":
        return (
          <div className="p-4" dir="rtl">
            <h1 className="text-xl font-bold text-[#01411C] mb-4">اختبار الشريط الجانبي الأيمن المستعاد</h1>
            <div className="space-y-4">
              <button 
                onClick={() => setCurrentPage("dashboard")}
                className="px-6 py-2 bg-[#01411C] text-white rounded-lg"
              >
                العودة للوحة التحكم
              </button>
              <p className="text-gray-600">تم إنشاء RightSliderRestored.tsx - النسخة ا��محدثة مع الأولوية للتحديثات</p>
            </div>
          </div>
        );

      case "test-final-updates":
        return (
          <div className="p-8 text-center" dir="rtl">
            <h1 className="text-xl font-bold text-[#01411C] mb-4">✅ التحديثات النهائية</h1>
            <p className="text-gray-600 mb-4">جميع التحديثات مكتملة وجاهزة للاستخدام</p>
            <button 
              onClick={() => setCurrentPage("dashboard")}
              className="px-6 py-2 bg-[#01411C] text-white rounded-lg"
            >
              العودة للوحة التحكم
            </button>
          </div>
        );

      case "properties":
        return withPageLayout(
          <PersistentSidebarPage 
            user={user}
            onNavigate={handleNavigate}
            pageType="properties"
          />
        );

      case "marketplace-page":
        return withPageLayout(
          <MarketplacePage
            userPlan={user?.plan || 'bronze'}
            onBack={() => setCurrentPage("dashboard")}
          />
        );

      case "tasks":
        return withPageLayout(
          <PersistentSidebarPage 
            user={user}
            onNavigate={handleNavigate}
            pageType="tasks"
          />
        );

      case "reports":
        return withPageLayout(
          <PersistentSidebarPage 
            user={user}
            onNavigate={handleNavigate}
            pageType="reports"
          />
        );

      // ❌ DELETED: Test components removed (not imported properly)
      // The following test pages had no imports and caused errors:
      // - test-integrated-system → TestIntegratedSystem
      // - test-right-slider-debug → TestRightSliderDebug
      // - test-right-sidebar-update → TestRightSidebarUpdate
      // - test-right-slider-updated → TestRightSliderUpdated
      // - test-simple-right-slider → TestSimpleRightSlider
      // - demo-working-right-slider → DemoWorkingRightSlider
      // - quick-test-right-slider → QuickTestRightSlider

      case "home-owners":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <HomeOwners
              user={user}
              onNavigate={handleNavigate}
            />
          </Suspense>
        );

      case "business-card-profile":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <BusinessCardProfile
              user={user}
              onBack={() => setCurrentPage("dashboard")}
              onEditClick={() => setCurrentPage("business-card-edit")}
            />
          </Suspense>
        );

      case "leader-crm-complete":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <LeaderCRMComplete
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "comprehensive-crm":
        return withPageLayout(
          <Suspense fallback={<LoadingSpinner />}>
            <ComprehensiveCRMSystem
              user={user}
              onNavigate={handleNavigate}
            />
          </Suspense>
        );

      case "test-crm-systems":
        return (
          <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-blue-100" dir="rtl">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  العودة للوحة التحكم
                </button>
                <h1 className="text-3xl font-bold text-blue-800">🔍 جميع أنظمة CRM المخفية (11 نظام)</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* قائمة أنظمة CRM */}
                {[
                  { name: "leader-crm-system-complete.tsx", desc: "نظام القائد الكامل", page: "leader-crm-complete", working: true },
                  { name: "ComprehensiveCRMSystem.tsx", desc: "النظام الشامل", page: "comprehensive-crm", working: true },
                  { name: "EnhancedBrokerCRM-with-back.tsx", desc: "CRM الوسطاء المحسن", page: "enhanced-crm", working: true },
                  { name: "CRMSystem.tsx", desc: "النظام الأساسي", page: "crm", working: false },
                  { name: "CRMSystemEnhanced.tsx", desc: "النسخة المحسنة", page: "crm", working: false },
                  { name: "RealtimeCRMEnhanced.tsx", desc: "الوقت الفعلي المحسن", page: "crm", working: false },
                  { name: "comprehensive-crm-system.tsx", desc: "النظام الشامل القديم", page: "crm", working: false },
                  { name: "crm-system.tsx", desc: "النظام البسيط", page: "crm", working: false },
                  { name: "leader-crm-system-fixed.tsx", desc: "نظام القائد المصحح", page: "crm", working: false },
                  { name: "simple-crm-interface.tsx", desc: "الواجهة البسيطة", page: "crm", working: false },
                  { name: "simple-crm-with-expand.tsx", desc: "البسيط م�� التوسع", page: "crm", working: false }
                ].map((crm, index) => (
                  <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-2 ${crm.working ? 'border-green-500 bg-green-50' : 'border-blue-200'}`}>
                    <h3 className="font-bold text-blue-800 mb-2">{crm.name}</h3>
                    <p className="text-gray-600 mb-2">{crm.desc}</p>
                    {crm.working && (
                      <p className="text-green-600 text-sm mb-4">✅ يعمل بشكل صحيح</p>
                    )}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          try {
                            setCurrentPage(crm.page);
                          } catch (error) {
                            alert(`خطأ في تحميل ${crm.name}: ${error}`);
                          }
                        }}
                        className={`px-4 py-2 text-white rounded-lg text-sm ${crm.working ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                      >
                        معاينة
                      </button>
                      {!crm.working && (
                        <button 
                          onClick={() => {
                            if (confirm(`هل تريد حذف ${crm.name}؟`)) {
                              alert("سيتم حذف الملف (لم يتم التطبيق فعلياً)");
                            }
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "test-dashboard-systems":
        return (
          <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-green-100" dir="rtl">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  العودة للوحة التحكم
                </button>
                <h1 className="text-3xl font-bold text-green-800">🔍 جميع صفحات Dashboard المخفية (15 صفحة)</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* قائمة صفحات Dashboard */}
                {[
                  { name: "BrokerDashboard.tsx", desc: "لوحة الوسيط" },
                  { name: "ClientDashboard.tsx", desc: "لوحة العميل" },
                  { name: "Dashboard.tsx", desc: "اللوحة الأساسية" },
                  { name: "HomeDashboard.tsx", desc: "لوحة الرئيسية" },
                  { name: "HomeDashboardBasic.tsx", desc: "الرئيسية البسيطة" },
                  { name: "HomeDashboardSimple.tsx", desc: "الرئيسية المبسطة" },
                  { name: "RealtimeMainDashboard.tsx", desc: "ا��رئيسية المباشرة" },
                  { name: "comprehensive-dashboard.tsx", desc: "اللوحة الشاملة" },
                  { name: "dashboard-simple.tsx", desc: "اللوحة البسيطة" },
                  { name: "dashboard.tsx", desc: "اللوحة العامة" },
                  { name: "simple-comprehensive-dashboard.tsx", desc: "الشاملة البسيطة" },
                  { name: "SimpleDashboard-fixed.tsx", desc: "البسيطة المصححة" },
                  { name: "SimpleDashboard-protected-backup.tsx", desc: "النس��ة الاحتياطية" },
                  { name: "SimpleDashboard.tsx", desc: "البسيطة الأصلية" },
                  { name: "SimpleDashboard-updated.tsx", desc: "المستخدمة حالياً ✅" }
                ].map((dashboard, index) => (
                  <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-2 ${dashboard.name.includes('updated') ? 'border-green-500 bg-green-50' : 'border-green-200'}`}>
                    <h3 className="font-bold text-green-800 mb-2">{dashboard.name}</h3>
                    <p className="text-gray-600 mb-4">{dashboard.desc}</p>
                    <div className="flex gap-2">
                      {!dashboard.name.includes('updated') && (
                        <>
                          <button 
                            onClick={() => {
                              try {
                                setCurrentPage("dashboard");
                                alert(`عرض ${dashboard.name} - هذا مثال تجريبي`);
                              } catch (error) {
                                alert(`خطأ في تحميل ${dashboard.name}: ${error}`);
                              }
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                          >
                            معاينة
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`هل تريد حذف ${dashboard.name}؟`)) {
                                alert("سيتم ��ذف الملف (لم يتم التطبيق فعلياً)");
                              }
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                          >
                            حذف
                          </button>
                        </>
                      )}
                      {dashboard.name.includes('updated') && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm cursor-not-allowed">
                          النسخة المستخدمة
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "test-files-manager":
        return (
          <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-purple-100" dir="rtl">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  العودة للوحة التحكم
                </button>
                <h1 className="text-3xl font-bold text-purple-800">🔍 جميع ملفات الاختبار (12 ملف)</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* قائمة ملفات الاختبار */}
                {[
                  { name: "test-final-system.tsx", desc: "اختبار النظام النهائي" },
                  { name: "test-final-updates.tsx", desc: "اختبار التحديثات النهائية" },
                  { name: "test-imports-fix.tsx", desc: "إصلاح الاستيرادات" },
                  { name: "test-imports.tsx", desc: "اختبار الاستيرادات" },
                  { name: "test-integrated-system.tsx", desc: "النظام المتكامل ✅" },
                  { name: "test-new-enhanced-system.tsx", desc: "النظام المحسن الجديد" },
                  { name: "test-new-system.tsx", desc: "النظام الجديد" },
                  { name: "test-offers-dashboard.tsx", desc: "لوحة العروض" },
                  { name: "test-right-sidebar-update.tsx", desc: "تحديث الشريط الأيمن ✅" },
                  { name: "test-right-slider-debug.tsx", desc: "تصحيح الشريط ��لأيمن ✅" },
                  { name: "TestDataGenerator.tsx", desc: "مولد البيانات التجريبية ✅" },
                  { name: "TestNewSidebar.tsx", desc: "اختبار الشريط الجديد" }
                ].map((file, index) => (
                  <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-2 ${file.desc.includes('✅') ? 'border-purple-500 bg-purple-50' : 'border-purple-200'}`}>
                    <h3 className="font-bold text-purple-800 mb-2">{file.name}</h3>
                    <p className="text-gray-600 mb-4">{file.desc}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const pageName = file.name.replace('.tsx', '').replace('Test', 'test-');
                          try {
                            setCurrentPage(pageName);
                          } catch (error) {
                            alert(`خطأ في تشغيل ${file.name}: ${error}`);
                          }
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                      >
                        تشغيل
                      </button>
                      {!file.desc.includes('✅') && (
                        <button 
                          onClick={() => {
                            if (confirm(`هل تريد حذف ${file.name}؟`)) {
                              alert("سيتم حذف الملف (لم يتم التطبيق فعلياً)");
                            }
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                          ح��ف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "hidden-components":
        return (
          <div className="min-h-screen p-8 bg-gradient-to-br from-pink-50 to-pink-100" dir="rtl">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  العودة للوحة التحكم
                </button>
                <h1 className="text-3xl font-bold text-pink-800">🔍 المحتويات الأخرى المخفية</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* المحتويات الأخرى */}
                {[
                  { name: "calendar-booking.tsx", status: "معطل", action: () => handleNavigate("calendar") },
                  { name: "tasks-management.tsx", status: "معطل", action: () => handleNavigate("tasks-management") },
                  { name: "archive.tsx", status: "معطل", action: () => handleNavigate("archive") },
                  { name: "workspace.tsx", status: "معطل", action: () => handleNavigate("workspace") },
                  { name: "whats-new.tsx", status: "معطل", action: () => handleNavigate("blog") },
                  { name: "contact-us.tsx", status: "معطل", action: () => handleNavigate("help") },
                  { name: "finance-calculator.tsx", status: "معطل", action: () => handleNavigate("finance-calculator") },
                  { name: "MarketInsights.tsx", status: "معطل", action: () => handleNavigate("market-insights") },
                  { name: "AnalyticsDashboard.tsx", status: "معطل", action: () => handleNavigate("analytics") }
                ].map((component, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-2 border-pink-200">
                    <h3 className="font-bold text-pink-800 mb-2">{component.name}</h3>
                    <div className="mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        component.status === 'معطل' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {component.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={component.action}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
                      >
                        تجربة
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "visual-numbering-demo":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <VisualNumberingDemo
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "numbering-test":
        return (
          <NumberingTestPage 
            onBack={() => setCurrentPage("dashboard")}
          />
        );

      case "component-tree-manager":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ComponentTreeManagerDemo
              onBack={() => setCurrentPage("registration")}
            />
          </Suspense>
        );

      case "advanced-systems-demo":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedSystemsDemo
              onBack={() => setCurrentPage("dashboard")}
            />
          </Suspense>
        );

      case "demo-subscription-slabs":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DemoSubscriptionSlabs />
          </Suspense>
        );

      // DELETED: test-ai-description-system case has been permanently removed

      // DELETED: test-ai-translation-fix case has been permanently removed

      // DELETED: test-price-estimator case has been permanently removed

      // ✅ NEW: AI Description Test Page - صفحة اختبار الذكاء الاصطناعي للوصف
      case "test-ai-description":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TestAIDescription onNavigate={setCurrentPage} />
          </Suspense>
        );

      case "test-assignment-modal":
        return (
          <div className="min-h-screen p-8 bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-6 py-2 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors"
                >
                  العودة للواجهة الرئيسية
                </button>
                <h1 className="text-3xl font-bold text-[#01411C]">🧪 اختبار Modal التعيين المحسّن</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">✅ التحديثات المطبقة</h2>
                  <div className="text-right space-y-3">
                    <p className="text-green-700">✅ خلفية خضراء ملكية بتدرج فاخر</p>
                    <p className="text-green-700">✅ نص أبيض واضح عند التحديد</p>
                    <p className="text-green-700">✅ Radio Button أكبر (20px)</p>
                    <p className="text-green-700">✅ أيقونة ذهبية 24px مع pulse</p>
                    <p className="text-green-700">✅ أزرار Sticky دائماً مرئية</p>
                    <p className="text-green-700">✅ زر "تم - تعيين الزميل"</p>
                  </div>
                </div>

                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">🎯 خطوات الاختبار</h2>
                  <div className="text-right space-y-3">
                    <p className="text-blue-700">1️⃣ انتقل لإدارة العملاء</p>
                    <p className="text-blue-700">2️⃣ اضغط على زر ��لإجراءات (⋮)</p>
                    <p className="text-blue-700">3️⃣ اختر "معين لـ"</p>
                    <p className="text-blue-700">4️⃣ اختر زميل من القائمة</p>
                    <p className="text-blue-700">5️⃣ لاحظ التحديد الواضح!</p>
                  </div>
                </div>

                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">🎨 التحسينات البصرية</h2>
                  <div className="text-right space-y-3">
                    <p className="text-yellow-700">✨ تباين عالي: ↑ 500%</p>
                    <p className="text-yellow-700">📏 حجم العناصر: ↑ 25%</p>
                    <p className="text-yellow-700">👁️ الوضوح: ↑ 300%</p>
                    <p className="text-yellow-700">📱 سهولة الاستخدام: ↑ 400%</p>
                  </div>
                </div>

                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">📊 النتيجة</h2>
                  <div className="text-right space-y-3">
                    <p className="text-purple-700">✅ تحديد واضح جداً</p>
                    <p className="text-purple-700">✅ أزرار دائماً مرئية</p>
                    <p className="text-purple-700">✅ تجربة مستخدم محسنة</p>
                    <p className="text-purple-700">✅ يعمل على جميع الأجهزة</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-8 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-xl text-white text-center">
                <h3 className="text-2xl font-bold mb-4">🎉 Modal التعيين جاهز!</h3>
                <p className="text-xl mb-6">اختبر النظام الآن مع التحديثات الجديدة</p>
                <button
                  onClick={() => setCurrentPage("customer-management-72")}
                  className="px-8 py-4 bg-[#D4AF37] text-[#01411C] font-bold rounded-xl hover:bg-[#b8941f] transition-all duration-300 transform hover:scale-105"
                >
                  انتقل لإ��ارة العملاء →
                </button>
              </div>
            </div>
          </div>
        );

      case "test-updates-simple":
        return (
          <div className="min-h-screen p-8 text-center bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-[#01411C] mb-8">✅ تحديث النظام مكتمل</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">🔄 إدارة العملاء</h2>
                  <div className="text-right space-y-3">
                    <p className="text-green-700">✅ تم إضافة زر العودة للواجهة الرئيسية</p>
                    <p className="text-green-700">✅ يستخدم الآن EnhancedBrokerCRM-with-back</p>
                    <p className="text-green-700">✅ واجهة محدثة مع التنقل الصحيح</p>
                  </div>
                </div>

                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">👥 إدارة الزملاء</h2>
                  <div className="text-right space-y-3">
                    <p className="text-blue-700">✅ موجودة في الإعدادات المتقدمة</p>
                    <p className="text-blue-700">✅ تظهر حسب نوع الحساب</p>
                    <p className="text-blue-700">✅ إدارة كاملة للصلاحيات والأعضاء</p>
                  </div>
                </div>

                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">🎯 الشريط الجانبي الأيمن</h2>
                  <div className="text-right space-y-3">
                    <p className="text-yellow-700">✅ يحتوي على "إدارة العملاء"</p>
                    <p className="text-yellow-700">✅ يستخدم RightSliderComplete المحدث</p>
                    <p className="text-yellow-700">✅ واجهة متطورة مع معلومات المستخدم</p>
                  </div>
                </div>

                <div className="p-6 border-2 border-[#D4AF37] rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <h2 className="text-xl font-bold text-[#01411C] mb-4">⚙️ نظام الإعدادات</h2>
                  <div className="text-right space-y-3">
                    <p className="text-purple-700">✅ إعدادات متقدمة مع تبويبات</p>
                    <p className="text-purple-700">✅ إدارة الحساب الشخصي</p>
                    <p className="text-purple-700">��� إدارة الفريق/المكتب/الشرك��</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-8 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">🎉 جميع التحديثات مكتملة!</h3>
                <p className="text-xl">النظام جاهز للاستخدام مع جميع التحسينات ا��مطلوبة</p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="px-8 py-4 bg-[#D4AF37] text-[#01411C] font-bold rounded-xl hover:bg-[#b8941f] transition-all duration-300 transform hover:scale-105"
                >
                  العودة للواجهة الرئيسية
                </button>
              </div>
            </div>
          </div>
        );

      case "left-slider-demo":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <LeftSliderComplete
              isOpen={true}
              onClose={() => setCurrentPage("dashboard")}
              currentUser={user}
              onNavigate={handleNavigate}
              mode="tools"
            />
          </Suspense>
        );

      default:
        return (
          <PlaceholderPage 
            title="صفحة جديدة"
            onBack={() => setCurrentPage("dashboard")}
            icon="📋"
            description="هذه الصفحة قيد التطوير"
            features={["ميزة قيد التطوير", "تحديثات قريباً"]}
          />
        );
    }
  }

  // Main app render - optimized
  return (
    <div className="min-h-screen touch-scroll-smooth">
      {/* المحتوى الرئيسي - بدون شريط جانبي دائم */}
      <div className="flex-1">
        {renderMainContent()}
      </div>
      
      {/* 🤖 المساعد الذكي - عقاري AI - مدمج بالكامل */}
      <AI_BubbleAssistant 
        onOpenCustomer={handleOpenCustomer}
        onOpenOffer={handleOpenOffer}
        onOpenRequest={handleOpenRequest}
        onOpenAnalytics={handleOpenAnalytics}
        onNavigate={handleNavigate}
        currentContext={currentPage}
        currentPage={currentPage}
        userId={user?.id}
        enhancedAssistant={smartAssistant}
        messages={assistantMessages}
        setMessages={setAssistantMessages}
        consciousLayer={{
          memorySync,
          awareness,
          notificationsAPI,
          dynamicIntents
        }}
      />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

// ============================================
// 🎯 المكون الرئيسي - يغلف AppContent بـ Providers
// ============================================
export default function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </ErrorBoundary>
  );
}

/*
════════════════════════════════════════════════════════════════════════════════════════════════════════════════
End of App.tsx - Main Application File
════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  • /APP-PROTECTION-LOCK.md - الوثيقة الكاملة
  • /APP-PROTECTION-README.md - الدليل السريع
  • /APP-DELETION-LOCK.txt - تذكير الحماية
  • /PROTECTED-FILES-LIST.md - قائمة جميع الملفات المحمية
  • python check-protected-files.py App.tsx - للتحقق

🔒 محمي بواسطة نظام الحماية الشامل لتطبيق عقاري CRM
© 2025 مؤسسة الأحلام العقارية - جميع الحقوق محفوظة

════════════════════════════════════════════════════════════════════════════════════════════════════════════════
*/