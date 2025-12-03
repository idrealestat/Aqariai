import { useEffect } from "react";
import { useKernel } from "../kernel/useKernel";
import { useDashboardContext } from "../../context/DashboardContext";

/**
 * 🧠 useAIAwareness - نقطة الوعي المركزي
 * ====================================
 * 
 * هذا الهوك هو "العين التي ترى كل ما يحدث داخل النظام"
 * 
 * الوظيفة:
 * - يراقب جميع التغييرات في حالة لوحة التحكم
 * - يرسل الحالة الحالية للذكاء الصناعي في الوقت الفعلي
 * - يمكّن AI من فهم السياق الحالي للمستخدم
 * 
 * الحالات المراقبة:
 * - activePage: الصفحة الحالية (dashboard, offers, requests, analytics, etc.)
 * - activeCustomer: العميل المفتوح حالياً (إن وجد)
 * - activeOffer: العرض المفتوح حالياً (إن وجد)
 * - activeRequest: الطلب المفتوح حالياً (إن وجد)
 * - activeTab: التبويب النشط (في حالة الصفحات متعددة التبويبات)
 * 
 * الاستخدام:
 * ```tsx
 * function Dashboard() {
 *   useAIAwareness(); // فقط استدعاء الهوك
 *   return <div>...</div>;
 * }
 * ```
 * 
 * ملاحظات:
 * - لا يوجد UI - هذا هوك خلفي فقط
 * - يعمل بشكل تلقائي في الخلفية
 * - يستخدم debouncing لتجنب الإرسال المفرط
 */
export function useAIAwareness() {
  const kernel = useKernel();
  const { 
    activePage, 
    activeCustomer, 
    activeOffer, 
    activeRequest,
    activeTab,
    currentUser
  } = useDashboardContext();

  useEffect(() => {
    // إرسال حالة الوعي للـ AI Kernel
    kernel.sendAwareness({
      page: activePage,
      customer: activeCustomer,
      offer: activeOffer,
      request: activeRequest,
      tab: activeTab,
      user: currentUser,
      timestamp: Date.now(),
    });

    // Log للتطوير
    console.log('🎯 [AI Awareness] Context changed:', {
      page: activePage,
      hasCustomer: !!activeCustomer,
      hasOffer: !!activeOffer,
      hasRequest: !!activeRequest,
      tab: activeTab,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activePage, 
    activeCustomer, 
    activeOffer, 
    activeRequest, 
    activeTab,
    currentUser
    // ⚠️ إزالة kernel من dependencies - هو stable function
  ]);

  // يمكن إرجاع معلومات إضافية إذا لزم الأمر
  return {
    isActive: true,
    lastUpdate: kernel.lastAwareness?.timestamp || null,
  };
}

/**
 * 🎯 useAIAwarenessWithDebounce - نسخة مع debouncing
 * 
 * نفس useAIAwareness لكن مع تأخير لتجنب الإرسال المفرط
 * مفيد عند التغييرات السريعة (مثل التمرير أو الكتابة)
 */
export function useAIAwarenessWithDebounce(delay: number = 500) {
  const kernel = useKernel();
  const context = useDashboardContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      kernel.sendAwareness({
        page: context.activePage,
        customer: context.activeCustomer,
        offer: context.activeOffer,
        request: context.activeRequest,
        tab: context.activeTab,
        user: context.currentUser,
        timestamp: Date.now(),
      });
    }, delay);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    context.activePage,
    context.activeCustomer,
    context.activeOffer,
    context.activeRequest,
    context.activeTab,
    context.currentUser,
    delay
    // ⚠️ إزالة kernel من dependencies - هو stable function
  ]);

  return {
    isActive: true,
    lastUpdate: kernel.lastAwareness?.timestamp || null,
  };
}