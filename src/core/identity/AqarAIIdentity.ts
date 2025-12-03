/**
 * 🏢 نظام الهوية التفاعلية لـ عقاري AI
 * =====================================
 * 
 * الإصدار: 1.0.0
 * التاريخ: 3 نوفمبر 2025
 * 
 * المسؤولية:
 * - تحديد الهوية الرسمية للمساعد الذكي
 * - توحيد أسلوب الردود
 * - دعم المناداة بأسماء متعددة
 * - تنسيق الرسائل بشكل احترافي
 */

// 🧠 تعريف الهوية الرسمية للمساعد
export const SYSTEM_ID = "عقاري AI";

// 🎯 الأسماء المستعارة المقبولة للمناداة
export const SYSTEM_ALIASES = [
  "عقاري",
  "عقاري AI",
  "عقاري اى آي",
  "عقاري اي اي",
  "aqari",
  "aqari ai",
  "عقاري الذكي",
  "المساعد الذكي"
];

// 🎨 تنسيق الردود الرسمية
export function formatAqarAIReply(message: string): string {
  return `${SYSTEM_ID}: ${message}`;
}

// 🎨 تنسيق رد مع emoji
export function formatAqarAIReplyWithEmoji(message: string, emoji: string = "💬"): string {
  return `${SYSTEM_ID} ${emoji}: ${message}`;
}

// 📡 التحقق من المناداة
export function isCallingAqarAI(text: string): boolean {
  const normalizedText = text.toLowerCase().trim();
  return SYSTEM_ALIASES.some(alias => 
    normalizedText.includes(alias.toLowerCase())
  );
}

// 💬 قوالب الردود الجاهزة
export const AQAR_AI_TEMPLATES = {
  // التحية
  greeting: {
    default: "مرحبًا! تفضل، كيف أقدر أساعدك؟ 👋",
    morning: "صباح الخير! ☀️ كيف أقدر أساعدك اليوم؟",
    afternoon: "مساء الخير! 🌆 تفضل، أنا جاهز لمساعدتك",
    evening: "مساء الخير! 🌙 كيف أقدر أساعدك؟"
  },

  // الوداع
  farewell: {
    default: "تمام! أي خدمة ثانية، أنا موجود 👍",
    polite: "بالتوفيق! دائمًا تحت أمرك 🌟",
    quick: "حاضر، أي شيء تاني أنا هنا ✨"
  },

  // التأكيد
  confirmation: {
    done: "تم بنجاح ✅",
    processing: "جاري المعالجة... ⏳",
    understood: "فهمت، سأساعدك الآن 👌",
    working: "أشتغل عليها الآن... 🔄"
  },

  // الأخطاء
  errors: {
    notFound: "عذراً، ما قدرت ألاقي المعلومات المطلوبة 🔍",
    invalid: "في خطأ في البيانات المدخلة، تأكد منها 🔴",
    generic: "حصل خطأ، جرب مرة ثانية 😅",
    needMoreInfo: "ممكن توضح أكثر؟ 🤔"
  },

  // السياق العقاري
  realEstate: {
    customer: "أشوف العميل الآن... 👤",
    offer: "أفتح تفاصيل العقار... 🏘️",
    request: "أراجع الطلب... 📋",
    analytics: "أحلل البيانات... 📊",
    appointment: "أجهز الموعد... 📅",
    finance: "أحسب التمويل... 💰"
  },

  // الوعي بالسياق
  contextAware: {
    viewingCustomer: "أشوف إنك تتصفح معلومات {customerName}. تبي تسوي إيش؟ 👀",
    viewingOffer: "العقار اللي أمامك: {offerTitle}. كيف أساعدك فيه؟ 🏠",
    viewingRequest: "الطلب الحالي: {requestLocation}. وش تحتاج؟ 📍",
    onDashboard: "أنت في لوحة التحكم. وش تبي تسوي؟ 🎯"
  }
};

// 🎯 دالة للحصول على التحية المناسبة حسب الوقت
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return formatAqarAIReply(AQAR_AI_TEMPLATES.greeting.morning);
  } else if (hour >= 12 && hour < 17) {
    return formatAqarAIReply(AQAR_AI_TEMPLATES.greeting.afternoon);
  } else if (hour >= 17 && hour < 22) {
    return formatAqarAIReply(AQAR_AI_TEMPLATES.greeting.evening);
  }
  
  return formatAqarAIReply(AQAR_AI_TEMPLATES.greeting.default);
}

// 🎯 دالة لتوليد رد واعي بالسياق
export function getContextAwareMessage(context: {
  customer?: { name: string };
  offer?: { title: string };
  request?: { location: string };
  page?: string;
}): string {
  if (context.customer) {
    return formatAqarAIReply(
      AQAR_AI_TEMPLATES.contextAware.viewingCustomer
        .replace('{customerName}', context.customer.name)
    );
  }
  
  if (context.offer) {
    return formatAqarAIReply(
      AQAR_AI_TEMPLATES.contextAware.viewingOffer
        .replace('{offerTitle}', context.offer.title)
    );
  }
  
  if (context.request) {
    return formatAqarAIReply(
      AQAR_AI_TEMPLATES.contextAware.viewingRequest
        .replace('{requestLocation}', context.request.location)
    );
  }
  
  if (context.page === 'dashboard') {
    return formatAqarAIReply(AQAR_AI_TEMPLATES.contextAware.onDashboard);
  }
  
  return getTimeBasedGreeting();
}

// 📝 أمثلة على الاستخدام:
/*
// مثال 1: تحقق من المناداة
if (isCallingAqarAI(userMessage)) {
  return getTimeBasedGreeting();
}

// مثال 2: رد بسيط
const reply = formatAqarAIReply("تمام، تم ربط العميل بالوعي التلقائي");
// النتيجة: "عقاري AI: تمام، تم ربط العميل بالوعي التلقائي"

// مثال 3: رد واعي بالسياق
const contextReply = getContextAwareMessage({
  customer: { name: "أحمد السعيد" }
});
// النتيجة: "عقاري AI: أشوف إنك تتصفح معلومات أحمد السعيد. تبي تسوي إيش؟ 👀"

// مثال 4: استخدام قالب جاهز
const processingMessage = formatAqarAIReply(AQAR_AI_TEMPLATES.confirmation.processing);
// النتيجة: "عقاري AI: جاري المعالجة... ⏳"
*/

// 🎨 تصدير جميع الدوال والثوابت
export default {
  SYSTEM_ID,
  SYSTEM_ALIASES,
  AQAR_AI_TEMPLATES,
  formatAqarAIReply,
  formatAqarAIReplyWithEmoji,
  isCallingAqarAI,
  getTimeBasedGreeting,
  getContextAwareMessage
};
