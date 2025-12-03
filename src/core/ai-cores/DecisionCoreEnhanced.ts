// /core/ai-cores/DecisionCoreEnhanced.ts
// نسخة موحّدة محدّثة: تدمج AqariAI_Reply مع Pattern-matching intents, NLU extraction, Self-Awareness, Response Tone, Appointment flow.
// يصدّر: DecisionCoreEnhanced.handleMessage(input, context)
// يرجع: { intent, scope, confidence, data, action, entity, reply, followUp, actions }
// 🆕 إضافة: منطق AqariAI_Reply من البرومبت الجديد

// IMPORTS
import { customersSearch, requestsSearch, offersSearch, mockCreateBusinessCard } from '../../services/mockData';
import { AI_DataPulseCore } from './AI_DataPulseCore';

// ---------- NLU helper (embedded, خفيف) ----------
function extractEntitiesFromText(text: string) {
  const nameMatch = text.match(/([ء-يA-Za-z]{2,}\s?[ء-يA-Za-z]{0,})/i);
  const phoneMatch = text.match(/(\+?\d{7,15})/);
  const dateMatch = text.match(/(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/);
  const timeMatch = text.match(/(\d{1,2}[:]\d{2}|\d{1,2}\s?(ص|م|AM|PM)?)/i);
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  return {
    name: nameMatch ? nameMatch[0].trim() : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    date: dateMatch ? dateMatch[0] : null,
    time: timeMatch ? timeMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null
  };
}

// ---------- Patterns and intent map ----------
const patterns: { intent: string; regex: RegExp }[] = [
  { intent: 'greeting', regex: /\b(مرحبا|اهلا|هلا|سم|يا هلا|سلام)\b/i },
  { intent: 'search_customers', regex: /\b(ابحث عن عميل|ابحث عن|دور على|عميل اسمه|ابحث عن عميل|أبغى عميل|دور على عميل)\b/i },
  { intent: 'search_requests', regex: /\b(ابحث عن طلب|بحث عن طلب|الطلبات|طلب)\b/i },
  { intent: 'urgent_requests', regex: /\b(عاجل|طارئ|فوري)\b/i },
  { intent: 'search_offers', regex: /\b(ابحث عن عرض|عرض|عروض|اعرض)\b/i },
  { intent: 'show_analytics', regex: /\b(تحليل|احصائيات|إحصائيات|تحليلات السوق|سوق)\b/i },
  { intent: 'create_business_card', regex: /\b(انشئ بطاقة|بطاقة عملي|بطاقة أعمال|انشاء بطاقة)\b/i },
  { intent: 'show_business_card', regex: /\b(اعرض بطاقة|عرض بطاقة)\b/i },
  { intent: 'social_media_publish', regex: /\b(انشر|نشر على|انشر على انستغرام|انشر تويتر)\b/i },
  { intent: 'search_archive', regex: /\b(ارشيف|أرشيف|بحث في الأرشيف)\b/i },
  { intent: 'manage_appointments', regex: /\b(موعد|مواعيد|احجز موعد|انشئ موعد|حجز موعد|حدد موعد)\b/i },
  { intent: 'market_analysis', regex: /\b(تحليل السوق|اتجاهات السوق|market analysis)\b/i },
  { intent: 'create_offer', regex: /\b(انشئ عرض|انشاء عرض|اضف عرض)\b/i },
  { intent: 'update_customer', regex: /\b(تعديل عميل|حدث بيانات العميل|تحديث عميل)\b/i },
  { intent: 'delete_offer', regex: /\b(حذف عرض|امسح العرض|الغاء عرض)\b/i },
];

// ---------- Self-Awareness (helpful guided steps) ----------
function handleNoResultsGuidance(entity: string, query: string) {
  switch (entity) {
    case 'customer':
      return [
        `❌ ما حصلت العميل "${query}".`,
        `1️⃣ افتح: "إدارة العملاء".`,
        `2️⃣ في مربع البحث اكتب الاسم وتأكد من التهجئة.`,
        `3️⃣ إذا ما ظهر، الاحتمالات:`,
        `   - 🔹 مو مُسجل.`,
        `   - 🔹 بالأرشيف.`,
        `   - 🔹 تم حذفه.`,
        `هل تبي أبحث لك في الأرشيف تلقائياً؟`
      ].join('\n');
    case 'offer':
      return [
        `❌ ما لقيت عرض مطابق لـ "${query}".`,
        `1️⃣ افتح: "العروض".`,
        `2️⃣ جرب الفلاتر أو اكتب تفاصيل أكثر (منطقة/سعر).`,
        `3️⃣ قد يكون العرض منتهي أو غير منشور.`,
        `هل أبدي لك أتحقق من العروض المخفية؟`
      ].join('\n');
    case 'request':
      return [
        `❌ ما لقيت طلب باسم "${query}".`,
        `1️⃣ افتح: "إدارة الطلبات".`,
        `2️⃣ جرب البحث بالاسم أو رقم الطلب.`,
        `3️⃣ إن لم يظهر، قد يكون الطلب غير مسجل أو موقوف.`,
        `هل أتحقق لك من الطلبات الموقوفة؟`
      ].join('\n');
    default:
      return `❌ ما لقيت نتيجة واضحة لـ "${query}". تقدر تحدد النطاق (عميل/عرض/طلب) عشان أوجهك بدقة.`;
  }
}

// ---------- Response Tone (اللهجة السعودية الرسمية البسيطة) ----------
// 🆕 محدث: دمج منطق AqariAI_Reply
function applyResponseTone(payload: any) {
  // payload expected to include: intent, entity, data, baseReply, followUp (optional), actions (optional)
  const { intent, entity, data, baseReply, followUp, actions } = payload;
  const toneGreeting = (txt: string) => `👋 سم طال عمرك، ${txt}`;
  const toneConfirm = (txt: string) => `✅ ابشر طال عمرك، ${txt}`;
  const toneIssue = (txt: string) => `⚠️ طال عمرك فعلاً يبدو في مشكلة بالنظام: ${txt}`;
  const toneNeutral = (txt: string) => `طال عمرك ${txt}`;

  // decide phrasing based on intent/entity and presence of data
  let reply = '';
  let replyPlain = '';
  let replyRich = null;
  let responseActions: any[] = actions || [];

  if (intent === 'greeting') {
    // 🆕 من AqariAI_Reply: الترحيب الأساسي
    reply = 'سم طال عمرك 🤍، كيف أقدر أخدمك اليوم؟';
    replyPlain = 'سم طال عمرك، كيف أقدر أخدمك؟';
  } else if (intent === 'search_customers') {
    if (Array.isArray(data) && data.length > 0) {
      const list = data.map(d => `• ${d.name} — ${d.phone || '-'} — ${d.email || '-'}`).join('\n');
      reply = toneConfirm(`هذا هو (بإذن الله):\n${list}`);
      replyPlain = reply;
    } else {
      // 🆕 من AqariAI_Reply: البحث عن عميل - لم يُعثر عليه
      reply = 'ما حصلت العميل اللي تدور عليه، لكن تقدر تدخل قسم إدارة العملاء وتكتب اسمه في البحث.';
      replyRich = '🔍 ما حصلت العميل المطلوب.\nجرب تدخل إدارة العملاء وتبحث بالاسم.\nإذا ما طلع، ممكن يكون بالأرشيف أو غير مسجل.';
      replyPlain = 'ما حصلت العميل المطلوب';
      responseActions = [
        { name: 'navigate', label: 'إدارة العملاء', params: { section: 'clients', page: 'enhanced-crm' } },
        { name: 'navigate', label: 'ابحث في الأرشيف', params: { section: 'archive', page: 'archive' } }
      ];
    }
  } else if (intent === 'manage_appointments') {
    // 🆕 من AqariAI_Reply: إنشاء موعد مع خطوات
    if (followUp && followUp.step === 'chooseAppointmentType') {
      reply = 'ابشر تم فتح قسم المواعيد 📅، اختر نوع الموعد:';
      replyPlain = reply;
      responseActions = [
        { name: 'createAppointment', label: 'موعد معاينة عقار', params: { type: 'property' } },
        { name: 'createAppointment', label: 'اجتماع مع مستشار', params: { type: 'consultation' } }
      ];
    } else if (followUp && followUp.step === 'setDate') {
      reply = 'تم، حدد التاريخ اللي يناسبك؟';
      replyPlain = reply;
    } else if (followUp && followUp.step === 'setTime') {
      reply = 'تمام، الساعة كم يناسبك؟';
      replyPlain = reply;
    } else if (followUp && followUp.step === 'setGoal') {
      reply = 'طيب، وش الهدف من الموعد؟';
      replyPlain = reply;
    } else if (followUp && followUp.confirmed) {
      reply = 'تم إنشاء الموعد بنجاح ✅';
      replyPlain = reply;
      responseActions = [
        { name: 'navigate', label: 'عرض المواعيد', params: { section: 'appointments', page: 'calendar-system-complete' } }
      ];
    } else if (followUp && followUp.awaitingDetails) {
      reply = 'ابشر تم فتح قسم المواعيد 📅، اختر نوع الموعد:';
      replyPlain = reply;
      responseActions = [
        { name: 'createAppointment', label: 'موعد معاينة عقار', params: { type: 'property' } },
        { name: 'createAppointment', label: 'اجتماع مع مستشار', params: { type: 'consultation' } }
      ];
    } else {
      reply = toneConfirm(baseReply || 'فتحّت لك قسم المواعيد.');
      replyPlain = reply;
    }
  } else if (intent === 'system_issue') {
    // 🆕 من AqariAI_Reply: مشاكل النظام
    reply = 'طال عمرك، فعلاً واضح في مشكلة بالنظام حالياً ⚠️، بنراجعها ونعلمك إذا انحلت.';
    replyPlain = 'واضح في مشكلة بالنظام حالياً، جاري المراجعة.';
  } else if (intent === 'general_inquiry') {
    reply = toneGreeting(baseReply || 'وش المطلوب بالضبط طال عمرك؟');
    replyPlain = reply;
  } else {
    // 🆕 من AqariAI_Reply: رد افتراضي ذكي
    reply = 'ما عندي معلومة حالياً، هل ترغب أن أبحث عنها؟';
    replyRich = '❔ ما عندي معلومة حالياً.\nتبي أبحث عنها؟';
    replyPlain = 'ما عندي معلومة حالياً';
    responseActions = [
      { name: 'searchInfo', label: 'ابحث عنها', params: {} },
      { name: 'goBack', label: 'رجوع', params: {} }
    ];
  }

  return { 
    ...payload, 
    reply, 
    replyPlain: replyPlain || reply, 
    replyRich: replyRich || null, 
    actions: responseActions 
  };
}

// ---------- Appointment utilities (very simple in-memory pending state via context) ----------
function parseDateTimeFromText(text: string) {
  // محاولة بسيطة لاستخراج تاريخ/وقت بصيغ واضحة
  const dateMatch = text.match(/(\d{1,2}\s?(?:\/|-)\s?\d{1,2}\s?(?:\/|-)\s?\d{2,4})/);
  const timeMatch = text.match(/(\d{1,2}[:]\d{2}|\d{1,2}\s?(ص|م|AM|PM))/i);
  return {
    date: dateMatch ? dateMatch[0] : null,
    time: timeMatch ? timeMatch[0] : null
  };
}

// ---------- Main: DecisionCoreEnhanced ----------
class DecisionCoreEnhanced {
  // handleMessage is main entry
  // context is mutable object used to store conversation state (e.g. pendingAppointment)
  static async handleMessage(input: string, context: any = {}) {
    const text = (input || '').trim();
    const lower = text.toLowerCase();

    // 1) Discrimination: is user addressing assistant or giving a system command?
    // Simple heuristic: if includes "يا" or greeting or direct question -> addressed to AI
    const directAddress = /\b(يا|سيدي|أستاذ|أستاذة|سم|مرحبا|اهلا|هلا)\b/i.test(text) || text.length < 100;

    // 2) Check if we're inside an appointment workflow (context.step)
    // 🆕 من AqariAI_Reply: استخدام context.step بدلاً من context.pendingAppointment
    if (context.step) {
      const entities = extractEntitiesFromText(text);
      
      if (context.step === 'chooseAppointmentType') {
        // المستخدم يحدد نوع الموعد
        const appointmentType = /\b(معاينة|عقار|property)\b/i.test(text) ? 'property' : 'consultation';
        context.appointmentType = appointmentType;
        context.step = 'setDate';
        
        const normalized = {
          intent: 'manage_appointments',
          scope: 'appointments',
          confidence: 0.9,
          data: { type: appointmentType },
          action: 'create',
          entity: 'appointment',
          followUp: { step: 'setDate' }
        };
        const toned = applyResponseTone(normalized);
        await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
        return toned;
      }
      
      if (context.step === 'setDate') {
        // المستخدم يحدد التاريخ
        const dt = parseDateTimeFromText(text);
        context.appointmentDate = dt.date || entities.date || text;
        context.step = 'setTime';
        
        const normalized = {
          intent: 'manage_appointments',
          scope: 'appointments',
          confidence: 0.9,
          data: { date: context.appointmentDate },
          action: 'create',
          entity: 'appointment',
          followUp: { step: 'setTime' }
        };
        const toned = applyResponseTone(normalized);
        await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
        return toned;
      }
      
      if (context.step === 'setTime') {
        // المستخدم يحدد الوقت
        const dt = parseDateTimeFromText(text);
        context.appointmentTime = dt.time || entities.time || text;
        context.step = 'setGoal';
        
        const normalized = {
          intent: 'manage_appointments',
          scope: 'appointments',
          confidence: 0.9,
          data: { time: context.appointmentTime },
          action: 'create',
          entity: 'appointment',
          followUp: { step: 'setGoal' }
        };
        const toned = applyResponseTone(normalized);
        await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
        return toned;
      }
      
      if (context.step === 'setGoal') {
        // المستخدم يحدد الهدف
        context.appointmentGoal = text;
        
        // إنشاء الموعد
        const created = {
          id: `APPT-${Date.now()}`,
          type: context.appointmentType || 'consultation',
          date: context.appointmentDate || new Date().toLocaleDateString('ar-SA'),
          time: context.appointmentTime || 'غير محدد',
          purpose: context.appointmentGoal || 'اجتماع'
        };
        
        // تنظيف السياق
        context.step = null;
        context.appointmentType = null;
        context.appointmentDate = null;
        context.appointmentTime = null;
        context.appointmentGoal = null;
        
        const normalized = {
          intent: 'manage_appointments',
          scope: 'appointments',
          confidence: 0.95,
          data: created,
          action: 'create',
          entity: 'appointment',
          followUp: { confirmed: true }
        };
        const toned = applyResponseTone(normalized);
        await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
        return toned;
      }
    }

    // 3) Pattern matching for intents
    let matchedIntent: string | null = null;
    for (const p of patterns) {
      if (p.regex.test(text)) {
        matchedIntent = p.intent;
        break;
      }
    }

    // special colloquial phrases handling (user side)
    // 🆕 من AqariAI_Reply: إضافة معالجة أفضل للرسائل المحلية
    // map common user inputs to intents/actions
    if (/\b(ما حصلت|ما لقيت|ما عثرت|ماصار|ما تم|ما نُقلت)\b/i.test(text)) {
      matchedIntent = 'system_issue';
    } else if (/\b(ما صار|ما تم نقلي|ما تم نقلي على الموقع)\b/i.test(text)) {
      matchedIntent = 'system_navigation_issue';
    } else if (/\b(تم|خلص|موافق)\b/i.test(text) && context.expectingConfirmation) {
      // pass through: treated elsewhere or as confirmation
      matchedIntent = 'confirmation';
    } else if (/\b(ابغى أحجز|احجز موعد|انشئ موعد|انشئ لي موعد|احجز|أبي احجز|موعد|حجز)\b/i.test(text)) {
      matchedIntent = 'manage_appointments';
    } else if (/\b(عميل)\b/i.test(text)) {
      matchedIntent = 'search_customers';
    }

    // fallback if still null: greeting? short words -> greeting
    if (!matchedIntent && /\b(مرحبا|اهلا|هلا|سم)\b/i.test(text)) matchedIntent = 'greeting';

    // 4) Build analysis object baseline
    const entities = extractEntitiesFromText(text);
    let analysis = {
      intent: matchedIntent || 'general_inquiry',
      confidence: matchedIntent ? 0.9 : 0.6,
      action: 'unknown',
      entity: 'unknown',
      data: {},
    };

    // 5) Route to handler (processAIIntent-like logic)
    try {
      switch (analysis.intent) {
        case 'search_customers': {
          const name = entities.name || text;
          const results = await customersSearch(name);
          analysis = {
            intent: 'search_customers',
            confidence: 0.92,
            action: 'search',
            entity: 'customer',
            data: results
          };
          // If no results -> self-awareness guidance
          if (!results || results.length === 0) {
            const baseReply = handleNoResultsGuidance('customer', name);
            const normalized = {
              ...analysis,
              data: [],
              baseReply,
              followUp: { suggestArchiveSearch: true }
            };
            const toned = applyResponseTone(normalized);
            await AI_DataPulseCore.logIntent(context.userId || 'anon', analysis.intent, analysis.confidence, input).catch(()=>{});
            return toned;
          }
          const toned = applyResponseTone({ ...analysis, baseReply: '' });
          await AI_DataPulseCore.logIntent(context.userId || 'anon', analysis.intent, analysis.confidence, input).catch(()=>{});
          return toned;
        }

        case 'manage_appointments': {
          // 🆕 من AqariAI_Reply: بدء تدفق الموعد بخطوات
          if (!context.step) {
            context.step = 'chooseAppointmentType';
            const normalized = {
              intent: 'manage_appointments',
              confidence: 0.9,
              action: 'create',
              entity: 'appointment',
              data: {},
              scope: 'appointments',
              followUp: { step: 'chooseAppointmentType' }
            };
            const toned = applyResponseTone(normalized);
            await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
            return toned;
          }
          break;
        }

        case 'system_issue':
        case 'system_navigation_issue': {
          // 🆕 من AqariAI_Reply: معالجة مشاكل النظام
          const baseReply = 'طال عمرك، فعلاً واضح في مشكلة بالنظام حالياً ⚠️، بنراجعها ونعلمك إذا انحلت.';
          const normalized = {
            intent: 'system_issue',
            scope: 'system',
            confidence: 0.9,
            data: {},
            action: 'assist',
            entity: 'system',
            baseReply
          };
          const toned = applyResponseTone(normalized);
          await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
          return toned;
        }

        case 'greeting': {
          const normalized = {
            intent: 'greeting',
            scope: 'general',
            confidence: 0.95,
            data: {},
            action: 'greet',
            entity: 'user'
          };
          const toned = applyResponseTone({ ...normalized, baseReply: '' });
          await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
          return toned;
        }

        case 'search_offers': {
          const results = await offersSearch(text);
          const normalized = {
            intent: 'search_offers',
            scope: 'offers',
            confidence: 0.9,
            data: results,
            action: 'search',
            entity: 'offer'
          };
          if (!results || results.length === 0) {
            normalized['baseReply'] = handleNoResultsGuidance('offer', text);
            const toned = applyResponseTone(normalized);
            await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
            return toned;
          }
          const toned = applyResponseTone({ ...normalized, baseReply: '' });
          await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
          return toned;
        }

        default: {
          // fallback / generic
          const normalized = {
            intent: analysis.intent || 'general_inquiry',
            scope: 'general',
            confidence: analysis.confidence || 0.6,
            data: {},
            action: 'help',
            entity: 'unknown',
            baseReply: 'أحتاج منك تفاصيل أكثر أو حدّد النطاق (عميل/عرض/طلب/موعد).'
          };
          const toned = applyResponseTone(normalized);
          await AI_DataPulseCore.logIntent(context.userId || 'anon', normalized.intent, normalized.confidence, input).catch(()=>{});
          return toned;
        }
      }
    } catch (err) {
      console.error('[DecisionCoreEnhanced] error', err);
      const normalized = {
        intent: 'system_error',
        scope: 'system',
        confidence: 0,
        data: {},
        action: 'help',
        entity: 'system',
        baseReply: 'حصل خطأ داخلي—راح أبلغ الفريق التقني.'
      };
      const toned = applyResponseTone(normalized);
      return toned;
    }
  }
}

export default DecisionCoreEnhanced;
