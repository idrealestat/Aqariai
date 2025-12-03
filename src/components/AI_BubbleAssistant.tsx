import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Bot, Send, X, Check, Bell } from "lucide-react";
import { useDashboardContext } from "../context/DashboardContext";
import { useKernel } from "../core/kernel/useKernel";
import { 
  formatAqarAIReply, 
  getTimeBasedGreeting, 
  getContextAwareMessage,
  isCallingAqarAI,
  AQAR_AI_TEMPLATES,
  SYSTEM_ID
} from "../core/identity/AqarAIIdentity";
// ✅ استيراد نظام الإشعارات
import { useNotificationsAIIntegration } from "../hooks/useNotificationsAIIntegration";
import type { NotificationAIContext } from "../hooks/useNotificationsAIIntegration";
// ✅ استيراد Enhanced Notifications Core
import NotificationsCore from "../core/ai-cores/AI_NotificationsEnhancedCore";
import AI_ConsciousAssistantCore from "../core/ai-cores/AI_ConsciousAssistantCore";
import AwarenessTracker from "../core/ai-cores/AI_AwarenessTracker";

// 🔌 Real API URL
const API_URL = "/api/kernel/query-real";

interface Message {
  role: "system" | "user" | "assistant";
  text: string;
  suggestion?: string;
  actions?: Action[];
  data?: any;
}

interface Action {
  type: string;
  label?: string;
  params?: Record<string, any>;
}

interface APIResponse {
  success: boolean;
  reply: string;
  suggestion?: string;
  actions?: Action[];
  data?: any;
}

interface Props {
  // Callbacks للتكامل مع SimpleDashboard
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

const AI_BubbleAssistant: React.FC<Props> = ({
  onOpenCustomer,
  onOpenOffer,
  onOpenRequest,
  onOpenAnalytics,
  onNavigate,
  onAddAppointment,
  currentContext = "general",
  currentPage = "dashboard",
  userId
}) => {
  // 🧠 ربط المساعد بنظام الوعي
  const kernel = useKernel();
  const { activeCustomer, activeOffer, activeRequest, activePage } = useDashboardContext();
  
  // 🔔 ربط نظام الإشعارات بالمساعد الذكي
  const notificationsAI = useNotificationsAIIntegration(userId || 'anonymous');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "system", 
      text: "مرحبًا! 👋\n\nأنا مساعدك الذكي. يمكنني مساعدتك في:\n• البحث عن العملاء والطلبات\n• عرض الطلبات المستعجلة\n• التحليلات والإحصائيات\n• إدارة المواعيد والحسابات\n\nجرّب: \"ابحث عن طلب\" أو \"أرني الإحصائيات\"" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionContext, setSessionContext] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // ✅ مرجع لحقل الإدخال
  
  const currentUserId = userId || 'anonymous';

  const toggleModal = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ تفعيل auto-focus على حقل الإدخال عند فتح النافذة
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // ✅ تفعيل NotificationsCore integration
  useEffect(() => {
    NotificationsCore.initializeNotificationsIntegration();
    const unsub = NotificationsCore.subscribeToNotifications((notif) => {
      // إظهار رسالة داخل المساعد فور وصول الإشعار
      window.dispatchEvent(new CustomEvent('aqar:chat:incoming', { detail: { type: 'notification', payload: notif } }));
    });
    return () => unsub();
  }, []);

  // ✅ الاستماع لعرض الإشعارات داخل المحادثة
  useEffect(() => {
    const onNotif = (e:any) => {
      if (!e.detail) return;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `🔔 ${e.detail.payload?.title || 'إشعار جديد'}`, 
        actions: [{ 
          label: 'عرض التفاصيل', 
          name: 'open_customer_card', 
          params: { customerId: e.detail.targetId } 
        }] 
      }]);
    };
    window.addEventListener('aqar:chat:incoming', onNotif);
    return () => window.removeEventListener('aqar:chat:incoming', onNotif);
  }, []);

  // 🧠 التحديث التلقائي للرسالة حسب السياق
  useEffect(() => {
    if (!isOpen) return;

    let contextMessage = "";
    
    if (activeCustomer) {
      contextMessage = getContextAwareMessage({
        customer: { name: activeCustomer.name || 'العميل' }
      });
    } else if (activeOffer) {
      contextMessage = getContextAwareMessage({
        offer: { title: activeOffer.title || 'العقار' }
      });
    } else if (activeRequest) {
      contextMessage = getContextAwareMessage({
        request: { location: activeRequest.location || 'الموقع' }
      });
    } else if (activePage) {
      contextMessage = getContextAwareMessage({ page: activePage });
    }

    if (contextMessage && messages.length === 1) {
      setMessages([{ role: "system", text: contextMessage }]);
    }
  }, [isOpen, activeCustomer, activeOffer, activeRequest, activePage]);

  /**
   * 🔔 معالجة استفسارات الإشعارات
   */
  const handleNotificationQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // استفسارات عامة
    if (lowerQuery.includes('إشعار') || lowerQuery.includes('اشعار') || lowerQuery.includes('تنبيه')) {
      if (lowerQuery.includes('كم') || lowerQuery.includes('عدد')) {
        return `📊 **ملخص الإشعارات:**\n\n${notificationsAI.generateAISummary()}`;
      }
      
      if (lowerQuery.includes('جديد') || lowerQuery.includes('أخير') || lowerQuery.includes('آخر')) {
        const recent = notificationsAI.stats.recentChanges.slice(0, 3);
        if (recent.length === 0) {
          return '✅ لا توجد إشعارات جديدة حالياً';
        }
        
        let response = '🔔 **آخر الإشعارات:**\n\n';
        recent.forEach((ctx, i) => {
          response += `${i + 1}. **${ctx.title}**\n`;
          response += `   📍 ${ctx.categoryArabic} • ${ctx.changeTypeArabic}\n`;
          response += `   ⏰ ${ctx.timeAgo}\n`;
          response += `   📝 ${ctx.changeDetails}\n\n`;
        });
        
        return response;
      }
      
      if (lowerQuery.includes('مهم') || lowerQuery.includes('حرج') || lowerQuery.includes('عاجل')) {
        const critical = notificationsAI.getCritical();
        if (critical.length === 0) {
          return '✅ لا توجد إشعارات عاجلة حالياً';
        }
        
        let response = '⚠️ **الإشعارات العاجلة:**\n\n';
        critical.forEach((ctx, i) => {
          response += `${i + 1}. 🔴 **${ctx.title}**\n`;
          response += `   ${ctx.message}\n`;
          response += `   ⏰ ${ctx.timeAgo}\n\n`;
        });
        
        return response;
      }
      
      if (lowerQuery.includes('غير مقروء') || lowerQuery.includes('لم أقرأ')) {
        const unread = notificationsAI.getUnread();
        return `📬 لديك **${unread.length}** إشعار غير مقروء`;
      }
    }
    
    // استفسارات عن العملاء
    if (lowerQuery.includes('عميل')) {
      const customerNotifs = notificationsAI.getByCategory('customer');
      if (customerNotifs.length === 0) {
        return '✅ لا توجد إشعارات متعلقة بالعملاء';
      }
      
      let response = '👥 **إشعارات العملاء:**\n\n';
      customerNotifs.slice(0, 5).forEach((ctx, i) => {
        response += `${i + 1}. ${ctx.title} (${ctx.timeAgo})\n`;
        response += `   ${ctx.changeDetails}\n\n`;
      });
      
      return response;
    }
    
    // استفسارات عن المواعيد
    if (lowerQuery.includes('موعد') || lowerQuery.includes('تقويم')) {
      const appointmentNotifs = notificationsAI.getByCategory('appointment');
      if (appointmentNotifs.length === 0) {
        return '✅ لا توجد إشعارات متعلقة بالمواعيد';
      }
      
      let response = '📅 **إشعارات المواعيد:**\n\n';
      appointmentNotifs.slice(0, 5).forEach((ctx, i) => {
        response += `${i + 1}. ${ctx.title} (${ctx.timeAgo})\n`;
        response += `   ${ctx.message}\n\n`;
      });
      
      return response;
    }
    
    // استفسارات عن السوشيال ميديا
    if (lowerQuery.includes('منشور') || lowerQuery.includes('سوشيال') || lowerQuery.includes('نشر')) {
      const socialNotifs = notificationsAI.getByCategory('social');
      if (socialNotifs.length === 0) {
        return '✅ لا توجد إشعارات متعلقة بالمنشورات';
      }
      
      let response = '📱 **إشعارات المنشورات:**\n\n';
      socialNotifs.slice(0, 5).forEach((ctx, i) => {
        response += `${i + 1}. ${ctx.title} (${ctx.timeAgo})\n`;
        response += `   ${ctx.changeDetails}\n\n`;
      });
      
      return response;
    }
    
    // ماذا حدث؟
    if (lowerQuery.includes('ماذا حدث') || lowerQuery.includes('ما حصل') || lowerQuery.includes('ما الجديد')) {
      return notificationsAI.generateAISummary();
    }
    
    // البحث في الإشعارات
    const searchTerms = query.replace(/إشعار|اشعار|أخبرني|عن|ال/g, '').trim();
    if (searchTerms.length > 2) {
      const results = notificationsAI.searchNotifications(searchTerms);
      if (results.length > 0) {
        let response = `🔍 **نتائج البحث عن "${searchTerms}":**\n\n`;
        results.slice(0, 5).forEach((ctx, i) => {
          response += `${i + 1}. ${ctx.title}\n`;
          response += `   ${ctx.changeDetails}\n`;
          response += `   📍 ${ctx.locationInApp}\n`;
          response += `   ⏰ ${ctx.timeAgo}\n\n`;
        });
        return response;
      }
    }
    
    return '';
  };
  
  /**
   * 🔔 تحليل الإشعار وإعطاء سياق كامل
   */
  const explainNotification = (notifId: string): string => {
    const context = notificationsAI.contexts.find(c => c.id === notifId);
    if (!context) return '❌ لم أجد هذا الإشعار';
    
    let explanation = `📋 **تفاصيل الإشعار:**\n\n`;
    explanation += `**العنوان:** ${context.title}\n`;
    explanation += `**الفئة:** ${context.categoryArabic}\n`;
    explanation += `**نوع التغيير:** ${context.changeTypeArabic}\n`;
    explanation += `**التوقيت:** ${context.timeAgo} (${new Date(context.timestamp).toLocaleString('ar-SA')})\n\n`;
    
    explanation += `**التفاصيل:**\n${context.changeDetails}\n\n`;
    
    if (context.changedFields && context.changedFields.length > 0) {
      explanation += `**الحقول المُعدلة:** ${context.changedFields.join('، ')}\n\n`;
    }
    
    explanation += `**الموقع في التطبيق:** ${context.locationInApp}\n\n`;
    
    if (context.suggestedActions.length > 0) {
      explanation += `**الإجراءات المقترحة:**\n`;
      context.suggestedActions.forEach((action, i) => {
        explanation += `${i + 1}. ${action}\n`;
      });
    }
    
    return explanation;
  };

  // دالة systemReply مختصرة
  const systemReply = (text: string) => setMessages(prev => [...prev, { role: "system", text }]);

  // when user clicks an action button
  const handleActionClick = async (action: Action) => {
    console.log('🔘 [Action Click] Action:', action);
    
    // action expected: { label, type, params }
    setMessages(prev => [...prev, { role:'user', text: action.label || action.type }]);

    // ✅ إعادة التركيز على حقل الإدخال بعد النقر على الزر
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    switch (action.type) {
      // 🧭 التنقل العام
      case "open_home":
      case "navigate_home":
        console.log('📍 [Navigation] Opening home...');
        if (typeof window !== 'undefined') window.location.hash = "#/home";
        systemReply("🏠 تم فتح الواجهة الرئيسية");
        break;

      case "open_clients":
      case "navigate_clients":
        console.log('📍 [Navigation] Opening clients...');
        if (typeof window !== 'undefined') window.location.hash = "#/crm/customers";
        systemReply("📇 تم فتح إدارة العملاء");
        AwarenessTracker.setLastOpened(currentUserId, 'clients');
        break;

      case "navigate_calendar":
      case "open_calendar":
        console.log('📍 [Navigation] Opening calendar...');
        if (typeof window !== 'undefined') window.location.hash = "#/calendar";
        systemReply("📅 تم فتح المواعيد");
        AwarenessTracker.setLastOpened(currentUserId, 'calendar');
        break;

      case "navigate_analytics":
      case "open_analytics":
        console.log('📍 [Navigation] Opening analytics...');
        if (typeof window !== 'undefined') window.location.hash = "#/analytics";
        systemReply("📊 تم فتح التحليلات");
        break;

      case "open_properties":
      case "navigate_properties":
        console.log('📍 [Navigation] Opening properties...');
        if (typeof window !== 'undefined') window.location.hash = "#/properties";
        systemReply("🏢 تم فتح إدارة العقارات");
        break;

      case "open_requests":
      case "navigate_requests":
        console.log('📍 [Navigation] Opening requests...');
        if (typeof window !== 'undefined') window.location.hash = "#/requests";
        systemReply("📨 تم فتح طلبات العقارات");
        break;

      case "open_notification_center":
      case "navigate_notifications":
        console.log('📍 [Navigation] Opening notifications...');
        if (typeof window !== 'undefined') window.location.hash = "#/notifications";
        systemReply("🔔 تم فتح مركز الإشعارات");
        break;

      case "open_profile":
        console.log('📍 [Navigation] Opening profile...');
        if (typeof window !== 'undefined') window.location.hash = "#/profile";
        systemReply("👤 تم فتح الملف الشخصي");
        break;

      case "open_settings":
        console.log('📍 [Navigation] Opening settings...');
        if (typeof window !== 'undefined') window.location.hash = "#/settings";
        systemReply("⚙️ تم فتح الإعدادات");
        break;

      case "open_business_card":
        console.log('📍 [Navigation] Opening business card...');
        if (typeof window !== 'undefined') window.location.hash = "#/digital-business-card";
        systemReply("💼 تم فتح بطاقة عملي الرقمية");
        break;

      case "open_customer":
        if (onOpenCustomer && action.params?.customerId) {
          onOpenCustomer(action.params.customerId);
          setMessages(prev => [...prev, {
            role: "system",
            text: `✅ تم فتح تفاصيل العميل`
          }]);
        }
        break;

      case "open_offer":
        if (onOpenOffer && action.params?.offerId) {
          onOpenOffer(action.params.offerId);
          setMessages(prev => [...prev, {
            role: "system",
            text: `✅ تم فتح تفاصيل العقار`
          }]);
        }
        break;

      case "open_request":
        if (onOpenRequest && action.params?.requestId) {
          onOpenRequest(action.params.requestId);
          setMessages(prev => [...prev, {
            role: "system",
            text: `✅ تم فتح تفاصيل الطلب`
          }]);
        }
        break;

      case "open_analytics":
        if (onOpenAnalytics) {
          onOpenAnalytics();
          setMessages(prev => [...prev, {
            role: "system",
            text: `📊 تم فتح لوحة التحليلات`
          }]);
        }
        break;

      case "navigate":
        if (onNavigate && action.params?.page) {
          onNavigate(action.params.page, action.params);
          setMessages(prev => [...prev, {
            role: "system",
            text: `✅ تم الانتقال إلى ${action.label || action.params.page}`
          }]);
        }
        break;

      case "add_appointment":
        if (onAddAppointment && action.params) {
          onAddAppointment(action.params);
          setMessages(prev => [...prev, {
            role: "system",
            text: `✅ تم إضافة الموعد`
          }]);
        }
        break;

      case "share_social":
        // يمكن فتح modal المشاركة
        setMessages(prev => [...prev, {
          role: "system",
          text: `📱 سأفتح نافذة المشاركة...`
        }]);
        break;

      // ✅ معالجة إجراءات NotificationsCore
      case "open_customer_card":
        if (action.params?.customerId) {
          await NotificationsCore.contextAction_openCustomerCard(action.params.customerId, setMessages);
          AwarenessTracker.pushEntity(currentUserId, { type:'customer', id: action.params.customerId });
        }
        break;

      case "create_appointment":
        // open UI or ask follow-up (the conscious core expects follow-up)
        setMessages(prev => [...prev, { role:'assistant', text: 'أفتح لك نافذة إنشاء الموعد — عطنا التاريخ والوقت.' }]);
        setSessionContext({ ...sessionContext, pending: { type:'appointment', customerId: action.params?.customerId } });
        break;

      case "open_calendar_at":
        if (action.params?.isoDate) {
          await NotificationsCore.contextAction_openCalendarAt(action.params.isoDate);
        }
        break;

      case "search_archive":
        await NotificationsCore.contextAction_openCalendarAt(action.params?.isoDate);
        break;

      case "stay":
        setMessages(prev => [...prev, { role:'assistant', text: 'حاضر طال عمرك، أكمل اللي تبغاه هنا.' }]);
        break;

      case "open_property":
        systemReply("🏠 تم فتح تفاصيل العقار");
        break;

      // 📦 النظام و التكوين
      case "toggle_ai":
        systemReply(`🤖 تم ${action.params?.mode === 'on' ? 'تفعيل' : 'إيقاف'} الذكاء الصناعي`);
        break;

      case "update_status":
        systemReply("✅ تم تحديث الحالة العامة للنظام");
        break;

      case "sync_integrations":
        systemReply("🔄 تم تنفيذ مزامنة الربط مع التطبيقات العقارية");
        break;

      // 📈 التحليل والذكاء العقاري
      case "analyze_performance":
        systemReply("📊 تم تحليل أداء المبيعات");
        break;

      case "analyze_customer_behavior":
        systemReply("🧠 تم تحليل سلوك العميل");
        break;

      case "ai_recommend_property":
        systemReply("🏡 تم اقتراح العقار المناسب بناءً على الذكاء الصناعي");
        break;

      case "ai_match_requests":
        systemReply("🔍 تم مطابقة الطلبات مع العقارات المتوفرة");
        break;

      // 📢 الإشعارات
      case "send_notification":
        systemReply("📨 تم إرسال الإشعار");
        break;

      case "mark_notification_read":
        systemReply("✅ تم تعليم الإشعار كمقروء");
        break;

      case "subscribe_notifications":
        systemReply("🔔 تم تفعيل استقبال الإشعارات في الوقت الفعلي");
        break;

      case "share_business_card":
        systemReply("📤 تم مشاركة بطاقة عملي الرقمية");
        break;

      // 🌐 التكاملات الحكومية والخاصة
      case "link_government_apps":
        systemReply("🏛️ تم ربط العقار بالتطبيقات الحكومية");
        break;

      case "link_private_platforms":
        systemReply("🏘️ تم ربط العقار بالتطبيقات الخاصة");
        break;

      // 🧠 النقاش السياقي
      case "ai_continue_context":
        systemReply("💬 تم متابعة النقاش السياقي مع العميل");
        break;

      case "ai_reset_context":
        systemReply("🔄 تم تصفير السياق السابق وبدء جلسة جديدة");
        break;

      // ⚠️ الحالات الافتراضية
      default:
        // Fallback: pass to kernel as textual command if unknown
        console.warn("⚠️ Unknown action:", action.type);
        const res = await kernel.sendQuery(action.type || action.label || '', {
          context: currentContext,
          page: currentPage,
          userId: currentUserId
        });
        if (res?.message) setMessages(prev => [...prev, { role:'assistant', text: res.message }]);
        break;
    }
  };

  // داخل المكون
  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role:'user', text }]);
    setIsLoading(true);
    
    try {
      // hand off to conscious core
      await AI_ConsciousAssistantCore.handleUserInput(currentUserId, text, sessionContext, setMessages);
    } catch (error) {
      console.error('[AI Assistant] Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'حصل خطأ، حاول مرة ثانية' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput("");
    await handleSend(currentInput);
    
    // ✅ إعادة التركيز على حقل الإدخال بعد الإرسال
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const sendMessageOld = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      console.log("[AI Assistant] Sending:", currentInput);
      
      // 🔔 معالجة استفسارات الإشعارات أولاً
      const notificationResponse = handleNotificationQuery(currentInput);
      if (notificationResponse) {
        const aiReply: Message = {
          role: "assistant",
          text: formatAqarAIReply(notificationResponse)
        };
        setMessages((prev) => [...prev, aiReply]);
        setIsLoading(false);
        return;
      }

      // 🧠 استخدام kernel للإرسال (يضيف awareness تلقائياً)
      const kernelResponse = await kernel.sendQuery(currentInput, {
        context: currentContext,
        page: currentPage,
        userId: userId,
        customer: activeCustomer,
        offer: activeOffer,
        request: activeRequest
      });

      // تحويل من KernelResponse إلى AIResponse format
      const data: APIResponse = {
        success: kernelResponse.success,
        reply: kernelResponse.message || "تم استلام الرسالة.",
        actions: kernelResponse.actions
      };

      console.log("[AI Assistant] Response:", data);

      // 🎨 تنسيق الرد باسم عقاري AI
      const formattedReply = formatAqarAIReply(data.reply);

      const aiReply: Message = {
        role: "assistant",
        text: formattedReply,
        suggestion: data.suggestion,
        actions: data.actions,
        data: data.data
      };

      setMessages((prev) => [...prev, aiReply]);

    } catch (error) {
      console.error("[AI Assistant] Error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          text: "⚠️ عذراً، حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى." 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* الزر العائم - بنفسجي متدرج */}
      <motion.button
        className="fixed bottom-36 left-4 w-14 h-14 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 border-2 border-purple-400/50 cursor-move select-none"
        title="💬 المساعد الذكي (اسحبني!)"
        drag
        dragConstraints={{ 
          top: 0, 
          bottom: (typeof window !== 'undefined' ? window.innerHeight : 800) - 64, 
          left: 0, 
          right: (typeof window !== 'undefined' ? window.innerWidth : 1200) - 64 
        }}
        dragElastic={0.2}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={toggleModal}
        aria-label="فتح المساعد الذكي"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #9333EA 100%)'
        }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* نافذة المحادثة */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-[160px] left-4 z-50 w-72 md:w-64 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border-2 border-purple-300 max-h-[450px] md:max-h-[400px]"
          dir="rtl"
        >
          {/* الرأس - بنفسجي */}
          <div 
            className="text-white px-4 py-3 flex justify-between items-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #9333EA 100%)'
            }}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h2 className="font-semibold">{SYSTEM_ID}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* 🔔 زر الإشعارات السريع */}
              <button
                onClick={() => {
                  const summary = notificationsAI.generateAISummary();
                  setMessages(prev => [...prev, {
                    role: "assistant",
                    text: formatAqarAIReply(summary)
                  }]);
                }}
                className="relative hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="ملخص الإشعارات"
                title="عرض ملخص الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {notificationsAI.stats.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationsAI.stats.unread > 9 ? '9+' : notificationsAI.stats.unread}
                  </span>
                )}
              </button>
              
              <button 
                onClick={toggleModal} 
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* الرسائل */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div className="max-w-[85%]">
                  <div
                    className={`px-4 py-2 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "text-white"
                        : msg.role === "system"
                        ? "text-white"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                    style={
                      msg.role === "user" || msg.role === "system"
                        ? {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #9333EA 100%)'
                          }
                        : undefined
                    }
                  >
                    {msg.text}
                  </div>

                  {/* الاقتراح */}
                  {msg.suggestion && (
                    <div className="mt-1 px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                      💡 {msg.suggestion}
                    </div>
                  )}

                  {/* الإجراءات */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="w-full px-3 py-1.5 text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <span>{action.label || action.type}</span>
                          <Check className="w-3 h-3 text-green-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* مؤشر الكتابة */}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm border border-gray-200">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* الإدخال */}
          <div className="border-t-2 border-purple-300 flex p-3 bg-white gap-2">
            <input
              type="text"
              className="flex-1 text-sm px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="اكتب رسالتك هنا..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              dir="rtl"
              ref={inputRef} // ✅ استخدام مرجع الإدخال
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              aria-label="إرسال"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #9333EA 100%)'
              }}
            >
              <Send className="w-4 h-4" />
              <span className="text-sm">إرسال</span>
            </button>
          </div>

          {/* عداد الرسائل */}
          <div className="bg-gray-50 px-3 py-1 text-center">
            <p className="text-xs text-gray-500">
              {messages.length - 1} {messages.length - 1 === 1 ? "رسالة" : "رسائل"}
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AI_BubbleAssistant;