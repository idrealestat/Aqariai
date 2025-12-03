/**
 * 🧠 هوك الاتصال بنواة الذكاء الصناعي - النسخة المُصلحة
 * =================================================================
 * 
 * الإصدار: 3.0.0-DIRECT-CALL
 * التاريخ: 4 نوفمبر 2025
 * 
 * التغيير الجذري:
 * - تم إزالة HTTP fetch (كان يسبب 404)
 * - استدعاء مباشر لـ AI_DataPulseCore
 * - معالجة محلية بدون server
 * 
 * السبب:
 * - المشروع Vite/React وليس Next.js
 * - لا يوجد API server لخدمة /api/*
 * - الاستدعاء المباشر أسرع وأبسط
 */

import { useCallback, useRef, useEffect } from 'react';
import AI_DataPulseCore from '../ai-cores/AI_DataPulseCore';

// استيراد الدوال المساعدة
import { searchCustomers, findCustomerById } from '../../utils/customersManager';
import { searchRequests, getRequestById, getUrgentRequests } from '../../api/requests';
import { getQuickStats } from '../../api/analytics';
import { getTodayAppointments } from '../../api/calendar';
import { BusinessCardAPI } from '../../api/businessCard';
import { SocialMediaAPI } from '../../api/socialMedia';
import { ArchiveAPI } from '../../api/archive';

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
// معالجة النية المحلية (بدون HTTP)
// ============================================

async function processAIIntent(
  aiAnalysis: any,
  context: { context?: string; page?: string; userId?: string }
): Promise<any> {
  const { intent, data, confidence, action, entity } = aiAnalysis;

  console.log(`🎯 [Kernel] Processing AI intent: ${intent} (${action} ${entity})`);

  try {
    // بطاقة الأعمال
    if (intent === 'create_business_card' || entity === 'business_card') {
      if (action === 'create') {
        return {
          success: true,
          reply: '✅ يمكنني مساعدتك في إنشاء بطاقة أعمال رقمية احترافية!',
          suggestion: 'انتقل إلى صفحة بطاقة الأعمال لإكمال المعلومات',
          actions: [{
            name: 'navigate',
            label: 'إنشاء بطاقة الآن',
            params: { page: 'business-card' }
          }]
        };
      } else if (action === 'view') {
        const card = await BusinessCardAPI.getByUserId(context.userId || '');
        if (card) {
          return {
            success: true,
            reply: `✅ بطاقتك الرقمية:\n${card.name}\n${card.title || ''}\n\nالمشاهدات: ${card.views || 0}`,
            actions: [{
              name: 'navigate',
              label: 'عرض البطاقة',
              params: { page: 'business-card' }
            }],
            data: card
          };
        } else {
          return {
            success: true,
            reply: 'لم تقم بإنشاء بطاقة أعمال بعد',
            suggestion: 'هل تريد إنشاء واحدة الآن؟',
            actions: [{
              name: 'navigate',
              label: 'إنشاء بطاقة',
              params: { page: 'business-card' }
            }]
          };
        }
      }
    }

    // النشر على وسائل التواصل
    if (intent === 'social_media_publish' || entity === 'social_post') {
      const platforms = await SocialMediaAPI.getUserPlatforms(context.userId || '');
      const connected = platforms.filter(p => p.isConnected);
      
      return {
        success: true,
        reply: `📱 لديك ${connected.length} منصة مربوطة من أصل ${platforms.length}\n\nالمنصات المربوطة: ${connected.map(p => p.nameAr).join(', ') || 'لا يوجد'}`,
        suggestion: connected.length > 0 
          ? 'يمكنك النشر الآن على المنصات المربوطة'
          : 'قم بربط منصاتك أولاً للبدء بالنشر',
        actions: [{
          name: 'navigate',
          label: connected.length > 0 ? 'نشر الآن' : 'ربط المنصات',
          params: { page: 'social-media' }
        }],
        data: { platforms, connected }
      };
    }

    // البحث في الأرشيف
    if (intent === 'search_archive' || entity === 'archive') {
      const results = await ArchiveAPI.search({
        userId: context.userId || '',
        query: data.query || '',
        type: data.type
      });

      if (results.length === 0) {
        return {
          success: true,
          reply: `❌ لم أعثر على مستندات تطابق البحث`,
          suggestion: 'جرب كلمات بحث أخرى'
        };
      }

      const items = results.slice(0, 3).map(item => 
        `• ${item.name} (${item.type})`
      ).join('\n');

      return {
        success: true,
        reply: `✅ عثرت على ${results.length} مستند:\n${items}`,
        actions: [{
          name: 'navigate',
          label: 'عرض الأرشيف',
          params: { page: 'archive' }
        }],
        data: results
      };
    }

    // العملاء
    if (intent === 'search_customers' || entity === 'customer') {
      const results = searchCustomers(data.query || '');

      if (results.length === 0) {
        return {
          success: true,
          reply: `❌ لم أعثر على عميل يطابق "${data.query}"`,
          suggestion: 'هل تريد إضافة عميل جديد؟'
        };
      }

      if (results.length === 1) {
        return {
          success: true,
          reply: `✅ عثرت على: ${results[0].name}`,
          suggestion: 'هل تريد فتح تفاصيل هذا العميل؟',
          actions: [{
            name: 'open_customer',
            label: 'فتح التفاصيل',
            params: { customerId: results[0].id }
          }],
          data: results[0]
        };
      }

      const names = results.slice(0, 5).map(c => c.name).join('\n• ');
      return {
        success: true,
        reply: `عثرت على ${results.length} عملاء:\n• ${names}`,
        actions: results.slice(0, 3).map(c => ({
          name: 'open_customer',
          label: c.name,
          params: { customerId: c.id }
        })),
        data: results
      };
    }

    // الطلبات المستعجلة
    if (intent === 'urgent_requests') {
      const requests = getUrgentRequests();
      
      if (requests.length === 0) {
        return {
          success: true,
          reply: '✅ لا توجد طلبات مستعجلة حالياً',
          suggestion: 'كل شيء تحت السيطرة!'
        };
      }

      const list = requests.slice(0, 3).map(r => 
        `• ${r.propertyType} في ${r.location} - ${r.budget}`
      ).join('\n');

      return {
        success: true,
        reply: `⚠️ لديك ${requests.length} طلب مستعجل:\n${list}`,
        actions: [{
          name: 'open_request',
          label: 'عرض الطلب الأول',
          params: { requestId: requests[0].id }
        }],
        data: requests
      };
    }

    // البحث عن طلبات
    if (intent === 'search_requests' || entity === 'request') {
      const results = searchRequests(data.query || '');

      if (results.length === 0) {
        return {
          success: true,
          reply: `❌ لم أعثر على طلبات تطابق "${data.query}"`,
          suggestion: 'جرب كلمات بحث أخرى'
        };
      }

      const list = results.slice(0, 3).map(r => 
        `• ${r.propertyType} في ${r.location}`
      ).join('\n');

      return {
        success: true,
        reply: `✅ عثرت على ${results.length} طلب:\n${list}`,
        actions: [{
          name: 'open_request',
          label: 'عرض الأول',
          params: { requestId: results[0].id }
        }],
        data: results
      };
    }

    // الإحصائيات
    if (intent === 'show_analytics' || entity === 'analytics') {
      const stats = getQuickStats();
      
      return {
        success: true,
        reply: `📊 إحصائيات سريعة:\n• العملاء: ${stats.totalCustomers}\n• الطلبات: ${stats.totalRequests}\n• العروض: ${stats.totalOffers}`,
        actions: [{
          name: 'open_analytics',
          label: 'عرض التحليلات الكاملة'
        }],
        data: stats
      };
    }

    // المواعيد
    if (intent === 'manage_appointments' || entity === 'appointment') {
      const appointments = getTodayAppointments();
      
      if (appointments.length === 0) {
        return {
          success: true,
          reply: '✅ لا توجد مواعيد اليوم',
          suggestion: 'يمكنك الاسترخاء قليلاً!'
        };
      }

      const list = appointments.slice(0, 3).map(a => 
        `• ${a.title} - ${a.time}`
      ).join('\n');

      return {
        success: true,
        reply: `📅 لديك ${appointments.length} موعد اليوم:\n${list}`,
        data: appointments
      };
    }

    // نية عامة أو غير معروفة
    if (confidence < 0.7 || intent === 'general_inquiry') {
      return {
        success: true,
        reply: 'مرحباً! 👋\n\nيمكنني مساعدتك في:\n• البحث عن العملاء والطلبات\n• عرض الإحصائيات\n• إدارة المواعيد\n• بطاقة الأعمال\n• وسائل التواصل\n• الأرشيف',
        suggestion: 'جرب: "ابحث عن عميل" أو "أرني الإحصائيات"'
      };
    }

    // Fallback
    return {
      success: true,
      reply: `تم تحليل طلبك: ${intent}\nالثقة: ${(confidence * 100).toFixed(0)}%`,
      suggestion: 'كيف يمكنني مساعدتك؟',
      data: aiAnalysis
    };

  } catch (error) {
    console.error('❌ [Kernel] Error in processAIIntent:', error);
    return {
      success: false,
      reply: '⚠️ عذراً، حدث خطأ في معالجة طلبك',
      suggestion: 'الرجاء المحاولة مرة أخرى'
    };
  }
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

  // 🎯 إرسال استعلام نصي (استدعاء مباشر بدون HTTP)
  const sendQuery = useCallback(async (query: string, context?: any): Promise<KernelResponse> => {
    try {
      console.log('📤 [Kernel] Processing query (direct call):', { query, context });
      
      // ✅ استدعاء AI_DataPulseCore مباشرة (بدون HTTP)
      const aiAnalysis = await AI_DataPulseCore.updateFromUserInput(
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
      
      console.log('🧠 [Kernel] AI Analysis complete:', {
        intent: aiAnalysis.intent,
        confidence: aiAnalysis.confidence,
        action: aiAnalysis.action,
        entity: aiAnalysis.entity
      });
      
      // ✅ معالجة النية محلياً (بدون HTTP)
      const response = await processAIIntent(aiAnalysis, {
        context: context?.context,
        page: context?.page,
        userId: context?.userId
      });
      
      console.log('✅ [Kernel] Response ready (no HTTP):', response);
      
      return {
        success: response.success,
        message: response.reply,
        data: response.data,
        actions: response.actions
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

  return {
    sendAwareness,
    sendQuery,
    isConnected: isConnectedRef.current,
    lastAwareness: lastAwarenessRef.current,
  };
}
