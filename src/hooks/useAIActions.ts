/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚡ useAIActions - ينفذ الأزرار فعلياً عبر الـ API والـ UI
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Hook لتنفيذ الإجراءات (Actions) التي يحددها المساعد الذكي
 * 
 * المميزات:
 * - تنفيذ Actions المختلفة
 * - التنقل في التطبيق
 * - استدعاء APIs
 * - تحديث واجهة المحادثة
 * 
 * تاريخ الإنشاء: 5 نوفمبر 2025
 * آخر تحديث: 5 نوفمبر 2025
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Api from '../services/apiClients';
import { sendToKernel } from '../core/kernel/useKernel';

/**
 * Hook useAIActions
 * @returns { executeAction } - دالة تنفيذ الإجراءات
 */
export function useAIActions() {
  /**
   * تنفيذ إجراء معين
   * @param actionObj - كائن الإجراء { action, params }
   * @param setMessages - دالة تحديث الرسائل (اختياري)
   * @param userId - معرف المستخدم (اختياري)
   */
  async function executeAction(
    actionObj: { action: string; params?: any }, 
    setMessages?: any, 
    userId?: string
  ) {
    try {
      switch (actionObj.action) {
        // ═════════════════════════════════════════════════════════════════
        // 📇 فتح إدارة العملاء
        // ═════════════════════════════════════════════════════════════════
        case 'open_clients':
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '✅ جاري فتح إدارة العملاء...' }
            ]);
          }
          
          // التنقل
          window.location.hash = '#/crm/customers';
          
          // إغلاق المساعد الذكي بعد ثانية
          setTimeout(() => {
            const aiPanel = document.querySelector('[data-ai-assistant]');
            if (aiPanel) {
              const closeBtn = aiPanel.querySelector('[data-close-btn]');
              if (closeBtn instanceof HTMLElement) {
                closeBtn.click();
              }
            }
          }, 1000);
          return;

        // ═════════════════════════════════════════════════════════════════
        // 🔍 البحث في الأرشيف
        // ═════════════════════════════════════════════════════════════════
        case 'search_archive': {
          const q = actionObj.params?.query || '';
          
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: `🔎 جاري البحث في الأرشيف عن "${q}"...` }
            ]);
          }
          
          const res = await Api.searchArchiveAPI(q);
          
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { 
                from: 'ai', 
                text: `🔎 نتائج الأرشيف: ${res.length} عنصر` 
              }
            ]);
          }
          
          window.location.hash = '#/archive';
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // 📇 فتح بطاقة عميل
        // ═════════════════════════════════════════════════════════════════
        case 'open_customer_card': {
          const cid = actionObj.params?.customerId;
          
          if (!cid) {
            throw new Error('customerId missing');
          }
          
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '📇 جاري فتح بطاقة العميل...' }
            ]);
          }
          
          const cust = await Api.getCustomerByIdAPI(cid);
          
          if (setMessages && cust) {
            setMessages((prev: any[]) => [
              ...prev, 
              { 
                from: 'ai', 
                text: `📇 **${cust.name}**\n📞 ${cust.phone || '-'}\n📧 ${cust.email || '-'}` 
              }
            ]);
          }
          
          // فتح مودال تفاصيل العميل
          // يمكن تخصيص هذا حسب التطبيق
          window.location.hash = `#/crm/customers?selected=${cid}`;
          
          // أو استخدام event custom
          window.dispatchEvent(new CustomEvent('openCustomerCard', { 
            detail: { customerId: cid } 
          }));
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // 📅 إنشاء موعد
        // ═════════════════════════════════════════════════════════════════
        case 'create_appointment': {
          const payload = actionObj.params || {};
          
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '📅 جاري إنشاء الموعد...' }
            ]);
          }
          
          // إذا كان هناك customerId فقط، نفتح واجهة إنشاء موعد
          if (payload.customerId && !payload.start) {
            window.location.hash = '#/calendar/new';
            
            // إرسال معرف العميل
            window.dispatchEvent(new CustomEvent('createAppointmentForCustomer', { 
              detail: { customerId: payload.customerId } 
            }));
            
            if (setMessages) {
              setMessages((prev: any[]) => [
                ...prev, 
                { from: 'ai', text: '✅ افتح واجهة إنشاء الموعد. حدد التاريخ والوقت.' }
              ]);
            }
          } else {
            // إنشاء موعد كامل
            const res = await Api.createAppointmentAPI(payload);
            
            if (setMessages) {
              setMessages((prev: any[]) => [
                ...prev, 
                { 
                  from: 'ai', 
                  text: `✅ تم إنشاء الموعد بنجاح\n📌 ID: ${res.id || '-'}` 
                }
              ]);
            }
          }
          return;
        }

        // ═════════════════════════════════════════════════════════════════
        // 📊 فتح التحليلات
        // ═════════════════════════════════════════════════════════════════
        case 'navigate_analytics':
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '📊 جاري فتح التحليلات...' }
            ]);
          }
          window.location.hash = '#/dashboard/analytics';
          return;

        // ═════════════════════════════════════════════════════════════════
        // 📋 فتح الطلبات
        // ═════════════════════════════════════════════════════════════════
        case 'navigate_requests':
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '📋 جاري فتح الطلبات...' }
            ]);
          }
          window.location.hash = '#/requests';
          return;

        // ═════════════════════════════════════════════════════════════════
        // 📅 فتح التقويم
        // ═════════════════════════════════════════════════════════════════
        case 'navigate_calendar':
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '📅 جاري فتح التقويم...' }
            ]);
          }
          window.location.hash = '#/calendar';
          return;

        // ═════════════════════════════════════════════════════════════════
        // 🏠 فتح الصفحة الرئيسية
        // ═════════════════════════════════════════════════════════════════
        case 'navigate_home':
          if (setMessages) {
            setMessages((prev: any[]) => [
              ...prev, 
              { from: 'ai', text: '🏠 جاري فتح الصفحة الرئيسية...' }
            ]);
          }
          window.location.hash = '#/';
          return;

        // ═════════════════════════════════════════════════════════════════
        // 🔄 Fallback - استدعاء الـ Kernel
        // ═════════════════════════════════════════════════════════════════
        default:
          if (userId) {
            const res = await sendToKernel(userId, actionObj.action);
            
            if (setMessages) {
              setMessages((prev: any[]) => [
                ...prev, 
                { from: 'ai', text: res.reply }
              ]);
            }
          } else {
            console.warn('No userId provided for fallback action:', actionObj.action);
            
            if (setMessages) {
              setMessages((prev: any[]) => [
                ...prev, 
                { from: 'ai', text: '⚠️ لم يتم التعرف على الإجراء.' }
              ]);
            }
          }
      }
    } catch (err: any) {
      console.error('executeAction error:', err);
      
      if (setMessages) {
        setMessages((prev: any[]) => [
          ...prev, 
          { 
            from: 'ai', 
            text: `❌ صار خطأ أثناء تنفيذ الإجراء:\n${err.message || 'خطأ غير معروف'}` 
          }
        ]);
      }
    }
  }

  return { executeAction };
}
