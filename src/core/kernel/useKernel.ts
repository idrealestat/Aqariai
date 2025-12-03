/**
 * 🧠 هوك الاتصال بنواة الذكاء الصناعي - النسخة المُبسطة
 * =================================================================
 * 
 * الإصدار: 4.0.0-SIMPLIFIED
 * التاريخ: 5 نوفمبر 2025
 * 
 * الميزات:
 * - استدعاء مباشر لـ DecisionCore و AI_DataPulseCore
 * - معالجة محلية 100% - بدون HTTP
 * - بسيط وسريع وفعّال
 * - دعم كامل لـ processAIIntent
 * 
 * التدفق:
 * المستخدم → useKernel → AI_DataPulseCore → DecisionCore → processAIIntent → النتيجة
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';
import AI_DataPulseCore from '../ai-cores/AI_DataPulseCore';
import DecisionCoreEnhanced from '../ai-cores/DecisionCoreEnhanced';
// 🆕 استيراد النواة المتكاملة الجديدة
import DecisionCoreIntegrated from '../ai-cores/DecisionCoreIntegrated';

// 🆕 استيراد معالج النوايا الجديد (JSON Pure)
import processAIIntent, { AIResponse } from '../../api/kernel/processAIIntent';

// ============================================
// Types
// ============================================

export interface AIAwarenessPayload {
  page: string | null;
  customer: any | null;
  offer: any | null;
  request: any | null;
  tab?: string | null;
  user?: any | null;
  timestamp: number;
}

export interface KernelResponse {
  success: boolean;
  message?: string;
  data?: any;
  actions?: Array<{
    name: string;
    label?: string;
    params?: Record<string, any>;
  }>;
}

export interface UseKernelReturn {
  sendAwareness: (payload: AIAwarenessPayload) => void;
  sendQuery: (query: string, context?: any) => Promise<KernelResponse>;
  isConnected: boolean;
  lastAwareness: AIAwarenessPayload | null;
}

// ============================================
// دالة مساعدة لتحويل AIResponse إلى التنسيق القديم للتوافق
// ============================================

function convertAIResponseToLegacyFormat(aiResponse: AIResponse): any {
  // بناء الرسالة من البيانات
  let reply = '';
  
  switch (aiResponse.entity) {
    case 'customer':
      if (Array.isArray(aiResponse.data)) {
        const customers = aiResponse.data;
        if (customers.length === 0) {
          reply = `❌ لم أعثر على عميل`;
        } else if (customers.length === 1) {
          reply = `✅ عثرت على: ${customers[0].name}`;
        } else {
          const names = customers.slice(0, 5).map((c: any) => c.name).join('\n• ');
          reply = `عثرت على ${customers.length} عملاء:\n• ${names}`;
        }
      }
      break;
      
    case 'request':
      if (aiResponse.action === 'list_urgent') {
        const requests = aiResponse.data;
        if (requests.length === 0) {
          reply = '✅ لا توجد طلبات مستعجلة حالياً';
        } else {
          const list = requests.slice(0, 3).map((r: any) => 
            `• ${r.propertyType} في ${r.location} - ${r.budget}`
          ).join('\n');
          reply = `⚠️ لديك ${requests.length} طلب مستعجل:\n${list}`;
        }
      } else if (Array.isArray(aiResponse.data)) {
        const requests = aiResponse.data;
        if (requests.length === 0) {
          reply = `❌ لم أعثر على طلبات`;
        } else {
          const list = requests.slice(0, 3).map((r: any) => 
            `• ${r.propertyType} في ${r.location}`
          ).join('\n');
          reply = `✅ عثرت على ${requests.length} طلب:\n${list}`;
        }
      }
      break;
      
    case 'analytics':
      if (aiResponse.data) {
        const stats = aiResponse.data;
        reply = `📊 إحصائيات سريعة:\n• العملاء: ${stats.totalCustomers || 0}\n• الطلبات: ${stats.totalRequests || 0}\n• العروض: ${stats.totalOffers || 0}`;
      }
      break;
      
    case 'appointment':
      if (Array.isArray(aiResponse.data)) {
        const appointments = aiResponse.data;
        if (appointments.length === 0) {
          reply = '✅ لا توجد مواعيد اليوم';
        } else {
          const list = appointments.slice(0, 3).map((a: any) => 
            `• ${a.title}`
          ).join('\n');
          reply = `📅 لديك ${appointments.length} موعد اليوم:\n${list}`;
        }
      }
      break;
      
    case 'business_card':
      if (aiResponse.data && !aiResponse.data.error) {
        if (aiResponse.action === 'view' && aiResponse.data.name) {
          reply = `✅ بطاقتك الرقمية:\n${aiResponse.data.name}\n${aiResponse.data.title || ''}\n\nالمشاهدات: ${aiResponse.data.views || 0}`;
        } else if (aiResponse.action === 'create') {
          reply = '✅ يمكنني مساعدتك في إنشاء بطاقة أعمال رقمية احترافية!';
        }
      } else {
        reply = 'لم تقم بإنشاء بطاقة أعمال بعد';
      }
      break;
      
    case 'social_post':
    case 'social_platform':
      if (aiResponse.data && aiResponse.data.platforms) {
        const connected = aiResponse.data.connected || [];
        reply = `📱 لديك ${connected.length} منصة مربوطة من أصل ${aiResponse.data.platforms.length}\n\nالمنصات المربوطة: ${connected.map((p: any) => p.nameAr).join(', ') || 'لا يوجد'}`;
      }
      break;
      
    case 'archive_item':
      if (aiResponse.data && aiResponse.data.results) {
        const results = aiResponse.data.results;
        if (results.length === 0) {
          reply = `❌ لم أعثر على مستندات تطابق البحث`;
        } else {
          const items = results.slice(0, 3).map((item: any) => 
            `• ${item.name} (${item.type})`
          ).join('\n');
          reply = `✅ عثرت على ${results.length} مستند:\n${items}`;
        }
      }
      break;
      
    default:
      reply = aiResponse.data?.message || 'تم معالجة طلبك بنجاح';
  }
  
  return {
    success: aiResponse.success,
    reply,
    data: aiResponse.data
  };
}

// ============================================
// Hook Implementation
// ============================================

export function useKernel(): UseKernelReturn {
  const lastAwarenessRef = useRef<AIAwarenessPayload | null>(null);
  const isConnectedRef = useRef<boolean>(true);

  // 🎯 إرسال حالة الوعي
  const sendAwareness = useCallback((payload: AIAwarenessPayload) => {
    try {
      lastAwarenessRef.current = payload;

      console.log('🧠 [AI Awareness] State updated:', {
        page: payload.page,
        customer: payload.customer?.id || null,
        offer: payload.offer?.id || null,
        request: payload.request?.id || null,
        tab: payload.tab,
        timestamp: new Date(payload.timestamp).toLocaleTimeString('ar-SA'),
      });

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('ai_awareness_state', JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent('ai-awareness-updated', { detail: payload }));
      }
    } catch (error) {
      console.error('❌ [AI Awareness] Error sending awareness:', error);
    }
  }, []);

  // 🎯 إرسال استعلام نصي (استدعاء مباشر بدون HTTP + Integrated Core)
  // 
  // التدفق الجديد (DecisionCoreIntegrated):
  // 1️⃣ AI_DataPulseCore.updateFromUserInput → يحفظ السياق
  // 2️⃣ DecisionCoreIntegrated.handle → يحلل + يستدعي APIs الحقيقية + يُرجع Actions
  // 3️⃣ convertToKernelResponse → يحول للتنسيق المتوقع
  //
  const sendQuery = useCallback(async (query: string, context?: any): Promise<KernelResponse> => {
    try {
      console.log('📤 [Kernel] Processing query (Integrated Mode v5.0):', { query, context });
      
      // ✅ 1️⃣ تسجيل التفاعل في AI_DataPulseCore
      await AI_DataPulseCore.updateFromUserInput(
        context?.userId || 'anonymous',
        query,
        {
          context: context?.context,
          page: context?.page,
          customer: context?.customer,
          offer: context?.offer,
          request: context?.request,
          ...context?.metadata
        }
      );
      
      // ✅ 2️⃣ استدعاء DecisionCoreIntegrated مباشرة
      // يشمل: Pattern Matching + Real API Calls + Actions + Saudi Tone
      const integratedResponse = await DecisionCoreIntegrated.handle(
        context?.userId || 'anonymous',
        query,
        {
          page: context?.page,
          context: context?.context,
          customer: context?.customer,
          offer: context?.offer,
          request: context?.request,
          // حفظ حالة المحادثة
          ...(context?.conversationState || {})
        }
      );
      
      console.log('🧠 [Kernel] 2️⃣ DecisionCoreIntegrated Response:', integratedResponse);
      
      // ✅ 3️⃣ تحويل إلى KernelResponse format
      return {
        success: true,
        message: integratedResponse.reply || 'تم',
        data: integratedResponse,
        actions: integratedResponse.actions || []
      };
    } catch (error) {
      console.error('❌ [Kernel] Error processing query:', error);
      return {
        success: false,
        message: 'فشل في معالجة الطلب',
      };
    }
  }, []);

  useEffect(() => {
    console.log('✅ [useKernel] Initialized with direct call mode (no HTTP)');
    return () => {
      // cleanup if needed
    };
  }, []);

  // ⚡ استخدام useMemo لمنع إعادة إنشاء الـ return object
  return useMemo(() => ({
    sendAwareness,
    sendQuery,
    isConnected: isConnectedRef.current,
    lastAwareness: lastAwarenessRef.current,
  }), [sendAwareness, sendQuery]);
}

// ============================================
// 🆕 دالة مباشرة للاستدعاء (بدون Hook)
// ============================================

/**
 * دالة مباشرة لإرسال رسالة إلى النواة (Integrated Version)
 * 
 * @example
 * const response = await sendToKernel('demo-user-0501234567', 'ابحث عن عميل اسمه عبدالله');
 * console.log(response); // { success: true, reply: '...', actions: [...] }
 */
export async function sendToKernel(userId: string, message: string, opts: any = {}) {
  try {
    console.log('📤 [sendToKernel] Processing (Integrated v5.0):', { userId, message, opts });
    
    // ✅ 1️⃣ تسجيل في AI_DataPulseCore
    await AI_DataPulseCore.updateFromUserInput(userId, message, opts.metadata || {});
    
    // ✅ 2️⃣ استدعاء DecisionCoreIntegrated (مع APIs الحقيقية)
    const result = await DecisionCoreIntegrated.handle(userId, message, {
      page: opts.page || 'dashboard',
      ...opts.metadata,
      ...(opts.conversationState || {})
    });
    
    console.log('✅ [sendToKernel] Success:', result);
    
    return result; // يرجع { intent, confidence, reply, actions, data }
  } catch (err) {
    console.error('[sendToKernel] Error', err);
    return { 
      success: false, 
      error: String(err),
      intent: 'error',
      confidence: 0,
      reply: 'حدث خطأ أثناء المعالجة'
    };
  }
}

/**
 * للتوافق مع الإصدارات القديمة
 */
export function getSession(userId: string) {
  // يمكن تخزين الجلسة في localStorage أو Context
  const sessionKey = `ai_session_${userId}`;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(sessionKey);
    return saved ? JSON.parse(saved) : null;
  }
  return null;
}