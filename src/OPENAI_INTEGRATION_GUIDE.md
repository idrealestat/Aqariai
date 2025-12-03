# 🔌 دليل ربط OpenAI بالمساعد الذكي

## 📍 الوضع الحالي

المساعد الذكي حالياً يعمل بنظام **Pattern Matching** (مطابقة الأنماط) وليس OpenAI API الحقيقية.

### المسار الحالي:
```
AI_BubbleAssistant → /api/kernel/query-real.ts → DecisionCore → Pattern Matching
```

---

## 🎯 خيارات الربط مع OpenAI

### **الخيار 1: إضافة OpenAI في DecisionCore** (موصى به)

#### **الخطوات:**

1. **تثبيت مكتبة OpenAI:**
```bash
npm install openai
```

2. **إنشاء ملف للإعدادات:**

**الملف:** `/config/openai.config.ts`

```typescript
// /config/openai.config.ts
export const OPENAI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "YOUR_API_KEY_HERE",
  model: "gpt-4-turbo-preview", // أو "gpt-3.5-turbo"
  maxTokens: 1000,
  temperature: 0.7,
};
```

3. **تعديل DecisionCore.ts:**

**الملف:** `/core/ai-cores/DecisionCore.ts`

```typescript
// في بداية الملف
import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../../config/openai.config';

const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.apiKey,
  dangerouslyAllowBrowser: true // فقط للتطوير، في الإنتاج استخدم API Route
});

class DecisionCore {
  static async analyzeInput(input: string, context?: any): Promise<AIAnalysis> {
    const trimmed = (input || '').trim();

    try {
      // استدعاء OpenAI
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: "system",
            content: `أنت مساعد ذكي لنظام CRM عقاري سعودي اسمه "عقاري AI".
مهمتك تحليل رسائل المستخدم واستخراج:
- النية (intent): مثل search_customers, search_requests, show_analytics
- الثقة (confidence): من 0 إلى 1
- الإجراء (action): مثل search, create, update
- الكيان (entity): مثل customer, request, offer

رد بصيغة JSON فقط:
{
  "intent": "search_customers",
  "confidence": 0.95,
  "action": "search",
  "entity": "customer",
  "data": {}
}`
          },
          {
            role: "user",
            content: trimmed
          }
        ],
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.maxTokens
      });

      const content = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content);

      return {
        intent: parsed.intent || 'general_inquiry',
        confidence: parsed.confidence || 0.5,
        action: parsed.action || 'search',
        entity: parsed.entity || 'unknown',
        data: parsed.data || {}
      };

    } catch (error) {
      console.error('❌ OpenAI Error:', error);
      
      // Fallback إلى Pattern Matching في حالة الخطأ
      for (const p of patterns) {
        if (p.regex.test(trimmed)) {
          const entities = extractEntitiesFromText(trimmed);
          // ... باقي الكود القديم
        }
      }
      
      return {
        intent: 'general_inquiry',
        confidence: 0.3,
        action: 'none',
        entity: 'unknown',
        data: {}
      };
    }
  }
  
  // ... باقي الدوال
}
```

---

### **الخيار 2: إضافة OpenAI في ملف API منفصل** (أكثر أماناً)

#### **الخطوات:**

1. **إنشاء API Route جديد:**

**الملف:** `/api/openai/chat.ts`

```typescript
// /api/openai/chat.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // في ملف .env (سري)
});

export default async function handler(req: any) {
  if (req.method !== 'POST') {
    return { error: 'Method not allowed' };
  }

  const { message, context } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `أنت مساعد ذكي لنظام CRM عقاري سعودي.
الصفحة الحالية: ${context?.page || 'dashboard'}
المستخدم: ${context?.userId || 'anonymous'}

قدم ردود مفيدة، ودقيقة، ومختصرة بالعربية.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      success: true,
      reply: response.choices[0]?.message?.content || 'عذراً، لم أستطع المساعدة.',
      model: response.model,
      usage: response.usage
    };

  } catch (error: any) {
    console.error('❌ OpenAI API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

2. **تعديل AI_BubbleAssistant.tsx:**

```typescript
// في دالة handleSendMessage داخل AI_BubbleAssistant.tsx

const handleSendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = input.trim();
  setInput("");
  setIsLoading(true);

  // إضافة رسالة المستخدم
  setMessages(prev => [...prev, { 
    role: "user", 
    text: userMessage 
  }]);

  try {
    // استدعاء OpenAI API
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        context: {
          page: activePage,
          userId: currentUserId,
          hasActiveCustomer: !!activeCustomer,
          hasActiveOffer: !!activeOffer
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: data.reply
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
      }]);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    setMessages(prev => [...prev, {
      role: "assistant",
      text: "عذراً، لم أستطع الاتصال بالخادم."
    }]);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🔐 إضافة API Key بشكل آمن

### **1. إنشاء ملف `.env.local`** (في جذر المشروع):

```env
# ملف .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **ملاحظة مهمة:**
- `OPENAI_API_KEY` → للاستخدام في server-side فقط (آمن)
- `NEXT_PUBLIC_OPENAI_API_KEY` → للاستخدام في client-side (غير آمن - للتطوير فقط)

### **2. إضافة `.env.local` إلى `.gitignore`:**

```gitignore
# في ملف .gitignore
.env.local
.env*.local
```

---

## 🎯 الخلاصة والتوصيات

### **الخيار الموصى به:**

✅ **استخدام API Route منفصل** (`/api/openai/chat.ts`)

**الأسباب:**
1. ✅ **أكثر أماناً** - API Key لا يظهر في المتصفح
2. ✅ **أسهل في الصيانة** - فصل المنطق عن الواجهة
3. ✅ **أفضل أداء** - يمكن إضافة caching
4. ✅ **قابل للتوسع** - سهل إضافة features مثل streaming

### **خطوات التطبيق السريعة:**

1. احصل على API Key من: https://platform.openai.com/api-keys
2. أنشئ ملف `.env.local` وضع المفتاح فيه
3. أنشئ ملف `/api/openai/chat.ts` (الخيار 2 أعلاه)
4. عدل `AI_BubbleAssistant.tsx` ليستدعي API الجديد
5. جرب في المتصفح!

---

## 📚 مصادر إضافية

- OpenAI Documentation: https://platform.openai.com/docs
- OpenAI Node.js Library: https://github.com/openai/openai-node
- تسعير OpenAI: https://openai.com/pricing

---

## ⚠️ تحذيرات مهمة

1. **لا تضع API Key في الكود مباشرة**
2. **استخدم environment variables دائماً**
3. **راقب الاستخدام والتكاليف** في OpenAI Dashboard
4. **أضف rate limiting** لتجنب الاستخدام الزائد
5. **استخدم try/catch** لمعالجة الأخطاء

---

✅ **تم إنشاء الدليل بنجاح!**
