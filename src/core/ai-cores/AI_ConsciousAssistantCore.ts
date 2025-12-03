// /core/ai-cores/AI_ConsciousAssistantCore.ts
import Api from '../../services/apiClients';
import NotificationsCore from './AI_NotificationsEnhancedCore';
import AwarenessTracker from './AI_AwarenessTracker';
import ShortTermMemory from './AI_ShortTermMemory';
import DecisionCoreIntegrated from './DecisionCoreIntegrated'; // existing intent detector or use detectIntent below

// ═══════════════════════════════════════════════════════════════
// 🔑 مفتاح OpenAI - ضع مفتاحك هنا
// ═══════════════════════════════════════════════════════════════
const OPENAI_API_KEY = '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'; // ⬅️ ضع مفتاحك هنا

// ═══════════════════════════════════════════════════════════════
// 🎯 اختيار النموذج المناسب
// ═══════════════════════════════════════════════════════════════
// النماذج المتاحة (من الأقل تكلفة للأعلى):
// - gpt-4o-mini (موصى به - سريع ورخيص)
// - gpt-3.5-turbo (قديم لكن متوفر دائماً)
// - gpt-4o (الأفضل لكن أغلى)
// - gpt-4-turbo (متقدم لكن قد لا يكون متاح)
const OPENAI_MODEL = 'gpt-4o-mini'; // ✅ تم التغيير للنموذج المتاح

const USE_OPENAI = OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE';

// تشخيص: طباعة حالة OpenAI عند التشغيل
console.log('🔍 [OpenAI Debug] USE_OPENAI:', USE_OPENAI);
console.log('🔍 [OpenAI Debug] API Key exists:', !!OPENAI_API_KEY);
console.log('🔍 [OpenAI Debug] API Key length:', OPENAI_API_KEY?.length);
console.log('🔍 [OpenAI Debug] Model:', OPENAI_MODEL);

// ═══════════════════════════════════════════════════════════════
// 🤖 دالة استدعاء OpenAI
// ═══════════════════════════════════════════════════════════════
async function callOpenAI(userMessage: string, conversationHistory: any[] = []): Promise<string> {
  console.log('🔍 [OpenAI] callOpenAI called with message:', userMessage);
  console.log('🔍 [OpenAI] conversationHistory type:', typeof conversationHistory);
  console.log('🔍 [OpenAI] conversationHistory value:', conversationHistory);
  
  if (!USE_OPENAI) {
    console.log('❌ [OpenAI] USE_OPENAI is false, skipping...');
    return ''; // إذا لم يكن المفتاح موجود، لا تستدعي OpenAI
  }

  console.log('✅ [OpenAI] USE_OPENAI is true, calling API...');

  try {
    // تحويل conversationHistory إلى array إذا لم يكن كذلك
    const historyArray = Array.isArray(conversationHistory) ? conversationHistory : [];
    
    const messages = [
      {
        role: 'system',
        content: `أنت "عقاري AI" - مساعد ذكي متخصص في إدارة العقارات والـ CRM للوسطاء العقاريين.

🎯 مهامك:
- مساعدة الوسطاء في إدارة العملاء والعروض والطلبات
- الإجابة على الاستفسارات حول العقارات
- تقديم التحليلات والإحصائيات

📋 قواعد الرد:
- استخدم اللهجة السعودية الودية (طال عمرك، أبشر، الله يعطيك العافية)
- كن مختصراً ومباشراً
- استخدم الإيموجي بشكل معتدل`
      },
      ...historyArray.slice(-5).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    console.log('📤 [OpenAI] Sending request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    console.log('📥 [OpenAI] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OpenAI] Error Response:', errorText);
      return '';
    }

    const data = await response.json();
    console.log('✅ [OpenAI] Success! Response:', data);
    const reply = data.choices?.[0]?.message?.content || '';
    console.log('✅ [OpenAI] Extracted reply:', reply);
    return reply;
  } catch (error) {
    console.error('❌ [OpenAI] Exception:', error);
    return '';
  }
}

// helpers for UI integration (these should exist or be adjusted to your project)
const systemReply = (setMessages:any, txt:string) => setMessages((p:any[])=>[...p,{role:'assistant', text:txt}]);

// small utilities used by conversation flows
async function promptUserAndWait(setMessages:any, prompt:string, onChoice: (value:string)=>Promise<void>) {
  // show prompt and options as message; in real UI you'd create UI widgets; here we push message and expect user to click
  systemReply(setMessages, prompt);
  // onChoice should be called by the UI when the user selects (we expect UI to call back)
  // For integration: UI will call sendToKernel with selected text -> kernel handles disambiguation
}

// fallback intent detection (if DecisionCoreIntegrated not used)
async function detectIntent(input:string) {
  return DecisionCoreIntegrated ? DecisionCoreIntegrated.handle('system', input, {}) : { type: 'unknown' };
}

const AI_ConsciousAssistantCore = {
  // main entry: setMessages is the chat setter from AI_BubbleAssistant
  async handleUserInput(userId:string, input:string, context:any, setMessages:any) {
    ShortTermMemory.pushMessage(userId, { role: 'user', text: input, timestamp: new Date().toISOString() });
    const shortContext = ShortTermMemory.getRecentContext(userId);
    
    let lastAssistantMessage = '';
    const trackingSetMessages = (fn: any) => {
      setMessages((p: any[]) => {
        const result = typeof fn === 'function' ? fn(p) : p;
        const lastMsg = result[result.length - 1];
        if (lastMsg?.role === 'assistant') lastAssistantMessage = lastMsg.text;
        return result;
      });
    };
    
    // record awareness
    AwarenessTracker.pushEntity(userId, { type:'utterance', name: input });
    
    // ✅ detect intent من DecisionCoreIntegrated أولاً
    const analysis = await (DecisionCoreIntegrated ? DecisionCoreIntegrated.handle(userId, input, context) : detectIntent(input));
    
    // ✅ تحويل actions من صيغة DecisionCoreIntegrated إلى صيغة موحدة
    if (analysis.actions) {
      analysis.actions = analysis.actions.map((a: any) => ({
        type: a.action || a.type,
        label: a.label,
        params: a.params
      }));
    }
    
    console.log('🧠 [AI Core] Intent detected:', analysis.intent);
    console.log('🧠 [AI Core] Actions:', analysis.actions);
    
    // set last intent
    AwarenessTracker.setLastIntent(userId, analysis.intent || 'unknown');

    // If analysis returned actions and clear (no ambiguity), we can ask before executing if severity is high
    // But we implement conversation-aware flows for main intents:

    switch (analysis.intent) {
      case 'greeting':
        lastAssistantMessage = 'سم طال عمرك 🌟 كيف أقدر أخدمك اليوم؟';
        systemReply(setMessages, lastAssistantMessage);
        ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
        return analysis;

      case 'search_customers': {
        // if multiple results -> disambiguation flow
        const matches = analysis.data || [];
        if (!matches || matches.length === 0) {
          // no results: offer guided steps
          const msg = `طال عمرك، ما حصلت نتيجة تطابق. تبي أدخل على إدارة العملاء وأبحث لك؟`;
          lastAssistantMessage = msg;
          systemReply(setMessages, msg);
          // present actions
          setMessages((p:any[]) => [...p, { role: 'assistant', text: msg, actions: [{ label:'فتح إدارة العملاء', type:'open_clients' }, { label:'ابحث في الأرشيف', type:'search_archive', params:{ query: input } } ] }]);
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
        if (matches.length === 1) {
          const c = matches[0];
          // push to awareness and offer actions
          AwarenessTracker.pushEntity(userId, { type:'customer', id:c.id, name:c.name });
          const reply = `✅ ابشر — هذا العميل: ${c.name}. تبي افتح بطاقة العميل أو أحجز له موعد؟`;
          lastAssistantMessage = reply;
          setMessages((p:any[]) => [...p, { role:'assistant', text: reply, actions: [{ label:'افتح بطاقة العميل', type:'open_customer_card', params:{ customerId:c.id } }, { label:'حجز موعد', type:'create_appointment', params:{ customerId:c.id } }] }]);
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
        // multiple matches: show list with actions
        const actions = matches.map((m:any) => ({ label: m.name, type: 'open_customer_card', params:{ customerId: m.id } }));
        lastAssistantMessage = `طل عمرك، فيه ${matches.length} نتائج. اختَر أحدهم:`;
        setMessages((p:any[]) => [...p, { role:'assistant', text: lastAssistantMessage, actions }]);
        ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
        return analysis;
      }

      case 'addAppointment':
      case 'manage_appointments': {
        // If analysis contains customer and time, proceed. Else ask follow-up questions.
        const cust = analysis.data?.customer || context?.pending?.customer || shortContext.lastCustomer;
        if (!cust) {
          // ask for name or open appointment UI
          const msg = 'أبشر، تبغاني أحجز لمين أو أفتح لك واجهة المواعيد؟';
          lastAssistantMessage = msg;
          setMessages((p:any[]) => [...p, { role:'assistant', text: msg, actions: [{ label:'فتح إنشاء موعد', type:'create_appointment' }, { label:'أدخِل اسم العميل', type:'ask_text' }] }]);
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
        // if customer present but missing date/time -> ask details
        if (!analysis.data?.date || !analysis.data?.time) {
          lastAssistantMessage = 'متى التاريخ والوقت اللي تفضّل؟';
          setMessages((p:any[]) => [...p, { role:'assistant', text: lastAssistantMessage }]);
          // set pending context to expect date/time
          context.pending = { type: 'appointment', customerId: cust.id };
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
        // has all info -> call API
        try {
          const payload = { customerId: cust.id, date: analysis.data.date, time: analysis.data.time, purpose: analysis.data.purpose || 'معاينة' };
          const res = await Api.createAppointmentAPI(payload);
          AwarenessTracker.pushEntity(userId, { type:'appointment', id: res.id, name: payload.purpose });
          const msg = `✅ تم إنشاء الموعد — ID: ${res.id}`;
          lastAssistantMessage = msg;
          setMessages((p:any[]) => [...p, { role:'assistant', text: msg }]);
          // create system notification
          await NotificationsCore.createAINotification({ source:'appointments', category:'appointment', type:'created', targetId: res.id, payload });
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return { ...analysis, data: res };
        } catch (err:any) {
          console.error('create appointment failed', err);
          lastAssistantMessage = 'صار خطأ أثناء إنشاء الموعد — أبي أحاول مرة ثانية؟';
          setMessages((p:any[]) => [...p, { role:'assistant', text: lastAssistantMessage }]);
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
      }

      case 'navigation_issue':
      case 'open_clients':
      case 'navigate_clients':
      case 'open_calendar':
      case 'navigate_calendar':
      case 'navigate_analytics':
      case 'open_analytics': {
        // conversation-aware navigation: confirm if user is mid-flow
        const last = AwarenessTracker.getState(userId).lastIntent;
        if (last && last !== analysis.intent) {
          // if user was in another flow, ask whether to switch
          const prompt = `طال عمرك، أنت حالياً في سياق \"${last}\". تبي أفتح ${analysis.intent.replace('_',' ')} فعلاً؟`;
          lastAssistantMessage = prompt;
          setMessages((p:any[]) => [...p, { role:'assistant', text: prompt, actions: [{ label:'نعم افتحها', type: analysis.intent }, { label:'لا ابقَ هنا', type: 'stay' }] }]);
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
        // otherwise execute navigation directly via context actions (UI handles mapping)
        lastAssistantMessage = 'تمام، أفتح لك...';
        setMessages((p:any[]) => [...p, { role:'assistant', text: lastAssistantMessage }]);
        // emit event for UI to handle navigation
        window.dispatchEvent(new CustomEvent('aqar:navigate', { detail:{ page: analysis.intent.replace(/(open_|navigate_)/,'') } }));
        AwarenessTracker.setLastOpened(userId, analysis.intent.replace(/(open_|navigate_)/,''), undefined);
        ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
        return analysis;
      }

      default:
        // ═══════════════════════════════════════════════════════════════
        // 🔄 دمج Pattern Matching مع OpenAI
        // ═══════════════════════════════════════════════════════════════
        
        // ✅ إذا DecisionCoreIntegrated رجع رد + actions، استخدمه مباشرة
        if (analysis.reply && analysis.intent !== 'unknown') {
          console.log('✅ [AI] Pattern Matching فهم، استخدم الرد الجاهز');
          lastAssistantMessage = analysis.reply;
          
          // إضافة الرد مع الـ actions إذا كانت موجودة
          if (analysis.actions && analysis.actions.length > 0) {
            setMessages((p:any[]) => [...p, { role:'assistant', text: analysis.reply, actions: analysis.actions }]);
          } else {
            setMessages((p:any[]) => [...p, { role:'assistant', text: analysis.reply }]);
          }
          
          ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
          return analysis;
        }
        
        // ✅ إذا Pattern Matching ما فهم (intent: unknown, reply: null)، استخدم OpenAI
        if (USE_OPENAI) {
          console.log('🤖 [AI] Pattern Matching ما فهم (unknown), أستخدم OpenAI...');
          const conversationHistory = ShortTermMemory.getConversationHistory(userId);
          const openaiReply = await callOpenAI(input, conversationHistory);
          
          if (openaiReply) {
            lastAssistantMessage = openaiReply;
            setMessages((p:any[]) => [...p, { role:'assistant', text: openaiReply }]);
            ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
            return { ...analysis, reply: openaiReply, source: 'openai' };
          }
        }
        
        // إذا OpenAI مو شغال أو ما رد، استخدم الرد الافتراضي
        const fallback = 'طال عمرك ما فهمت المقصود تمام، تبي افتح إدارة العملاء أو المواعيد أو أفتح التحليلات؟';
        lastAssistantMessage = fallback;
        setMessages((p:any[]) => [...p, { role:'assistant', text: fallback, actions: [{ label:'فتح إدارة العملاء', type:'open_clients' }, { label:'فتح المواعيد', type:'navigate_calendar' }, { label:'فتح التحليلات', type:'navigate_analytics' }] }]);
        ShortTermMemory.pushMessage(userId, { role: 'assistant', text: lastAssistantMessage, timestamp: new Date().toISOString() });
        return analysis;
    }
  }
};

export default AI_ConsciousAssistantCore;