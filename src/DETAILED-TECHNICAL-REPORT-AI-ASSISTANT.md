# 📊 **تقرير تفصيلي شامل: المساعد الذكي (AI Assistant)**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          🤖 المساعد الذكي - التقرير الكامل 🤖              ║
║                                                               ║
║  كل شيء بالتفصيل: المسارات، الدوال، الاستدعاءات،            ║
║  الربط، التعاريف، الأزرار، الحقول، طريقة العمل              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📋 **جدول المحتويات**

1. [نظرة عامة](#1-نظرة-عامة)
2. [المسارات والملفات](#2-المسارات-والملفات)
3. [التعاريف والأنواع](#3-التعاريف-والأنواع)
4. [الاستيرادات](#4-الاستيرادات)
5. [State Management](#5-state-management)
6. [الدوال الرئيسية](#6-الدوال-الرئيسية)
7. [معالجة اللغة الطبيعية](#7-معالجة-اللغة-الطبيعية)
8. [استدعاءات AI](#8-استدعاءات-ai)
9. [الربط مع الأنظمة](#9-الربط-مع-الأنظمة)
10. [واجهة المستخدم](#10-واجهة-المستخدم)
11. [الأوامر المدعومة](#11-الأوامر-المدعومة)
12. [سير العمل](#12-سير-العمل)

---

## 1️⃣ **نظرة عامة**

### **الغرض من المساعد الذكي:**
المساعد الذكي (AI Assistant) هو نظام ذكي متقدم يقوم بـ:
- فهم أوامر المستخدم باللغة الطبيعية (عربي/إنجليزي)
- تنفيذ المهام تلقائياً (إنشاء عروض، جدولة مواعيد، البحث)
- تقديم اقتراحات ذكية
- الإجابة على الأسئلة
- تحليل البيانات وتقديم رؤى
- التعلم من سلوك المستخدم

### **الموقع في النظام:**
- **المكون الرئيسي:** `AI_BubbleAssistant.tsx`
- **المكون الفرعي:** `AI_ConsciousAssistantCore.ts`
- **Hook:** `useSmartAssistantEnhanced.ts`
- **API:** `ai/generate-description.ts`
- **النوع:** نظام عام (Global System)
- **الوصول:** متاح في جميع الصفحات

---

## 2️⃣ **المسارات والملفات**

### **المسارات الفعلية:**

```
📁 Project Root
│
├── 📁 components/
│   │
│   ├── 📄 AI_BubbleAssistant.tsx
│   │   المسار: /components/AI_BubbleAssistant.tsx
│   │   الدور: واجهة المساعد الذكي (Bubble UI)
│   │   المكونات:
│   │     - FloatingButton (زر عائم)
│   │     - ChatBubble (فقاعة الدردشة)
│   │     - MessageList (قائمة الرسائل)
│   │     - InputArea (منطقة الإدخال)
│   │     - SuggestionChips (شرائح الاقتراحات)
│   │     - VoiceInput (إدخال صوتي)
│   │
│   ├── 📄 VoiceCommandsPanel.tsx
│   │   المسار: /components/VoiceCommandsPanel.tsx
│   │   الدور: لوحة الأوامر الصوتية
│   │
│   └── 📄 AIDescriptionGenerator.tsx
│       المسار: /components/AIDescriptionGenerator.tsx
│       الدور: مولد الوصف الذكي للعقارات
│
├── 📁 core/ai-cores/
│   │
│   ├── 📄 AI_ConsciousAssistantCore.ts
│   │   المسار: /core/ai-cores/AI_ConsciousAssistantCore.ts
│   │   الدور: القلب الواعي للمساعد الذكي
│   │   الوظائف:
│   │     - processIntent() - معالجة النية
│   │     - executeAction() - تنفيذ الإجراء
│   │     - generateResponse() - توليد الرد
│   │     - learnFromInteraction() - التعلم
│   │
│   ├── 📄 AI_AwarenessTracker.ts
│   │   المسار: /core/ai-cores/AI_AwarenessTracker.ts
│   │   الدور: تتبع سياق المحادثة والوعي
│   │
│   ├── 📄 AI_DataPulseCore.ts
│   │   المسار: /core/ai-cores/AI_DataPulseCore.ts
│   │   الدور: نبض البيانات - تحديثات فورية
│   │
│   ├── 📄 DecisionCore.ts
│   │   المسار: /core/ai-cores/DecisionCore.ts
│   │   الدور: محرك اتخاذ القرار
│   │
│   ├── 📄 DecisionCoreEnhanced.ts
│   │   المسار: /core/ai-cores/DecisionCoreEnhanced.ts
│   │   الدور: محرك قرار محسّن
│   │
│   └── 📄 AI_ShortTermMemory.ts
│       المسار: /core/ai-cores/AI_ShortTermMemory.ts
│       الدور: الذاكرة قصيرة المدى
│
├── 📁 core/utils/
│   │
│   └── 📄 aiTools.ts
│       المسار: /core/utils/aiTools.ts
│       الدور: أدوات مساعدة للذكاء الاصطناعي
│
├── 📁 hooks/
│   │
│   ├── 📄 useSmartAssistantEnhanced.ts
│   │   المسار: /hooks/useSmartAssistantEnhanced.ts
│   │   الدور: Hook رئيسي للمساعد الذكي
│   │
│   ├── 📄 useVoiceCommands.ts
│   │   المسار: /hooks/useVoiceCommands.ts
│   │   الدور: Hook الأوامر الصوتية
│   │
│   ├── 📄 useAIActions.ts
│   │   المسار: /hooks/useAIActions.ts
│   │   الدور: Hook إجراءات الذكاء الاصطناعي
│   │
│   ├── 📄 useDynamicIntents.ts
│   │   المسار: /hooks/useDynamicIntents.ts
│   │   الدور: Hook النيات الديناميكية
│   │
│   └── 📄 useAwareness.ts
│       المسار: /hooks/useAwareness.ts
│       الدور: Hook الوعي بالسياق
│
├── 📁 api/
│   │
│   ├── 📄 ai/generate-description.ts
│   │   المسار: /api/ai/generate-description.ts
│   │   الدور: API توليد الوصف
│   │
│   └── 📁 kernel/
│       ├── 📄 query.ts
│       │   المسار: /api/kernel/query.ts
│       │   الدور: استعلامات الذكاء الاصطناعي
│       │
│       ├── 📄 processAIIntent.ts
│       │   المسار: /api/kernel/processAIIntent.ts
│       │   الدور: معالجة نية الذكاء الاصطناعي
│       │
│       └── 📄 query-real.ts
│           المسار: /api/kernel/query-real.ts
│           الدور: استعلامات حقيقية (مع OpenAI)
│
└── 📁 types/
    │
    └── 📄 ai-assistant.ts
        المسار: /types/ai-assistant.ts
        الدور: تعاريف TypeScript للمساعد الذكي
```

---

## 3️⃣ **التعاريف والأنواع**

### **أنواع المساعد الذكي:**

```typescript
// ==========================================
// FILE: types/ai-assistant.ts
// ==========================================

/**
 * نوع الرسالة في المحادثة
 */
export type MessageRole = 
  | 'user'        // رسالة المستخدم
  | 'assistant'   // رد المساعد
  | 'system';     // رسالة النظام

/**
 * نوع النية المستخرجة من الرسالة
 */
export type IntentType =
  // إدارة العروض
  | 'create_offer'        // إنشاء عرض
  | 'edit_offer'          // تعديل عرض
  | 'delete_offer'        // حذف عرض
  | 'search_offers'       // البحث عن عروض
  | 'publish_offer'       // نشر عرض
  
  // إدارة الطلبات
  | 'create_request'      // إنشاء طلب
  | 'search_requests'     // البحث عن طلبات
  
  // إدارة المواعيد
  | 'schedule_appointment' // جدولة موعد
  | 'view_calendar'       // عرض التقويم
  | 'cancel_appointment'  // إلغاء موعد
  
  // إدارة العملاء
  | 'add_customer'        // إضافة عميل
  | 'search_customers'    // البحث عن عملاء
  | 'call_customer'       // الاتصال بعميل
  
  // التحليلات والتقارير
  | 'get_statistics'      // الحصول على إحصائيات
  | 'generate_report'     // توليد تقرير
  | 'analyze_data'        // تحليل البيانات
  
  // معلومات عامة
  | 'get_info'            // الحصول على معلومات
  | 'help'                // المساعدة
  | 'greeting'            // تحية
  
  // أخرى
  | 'navigate'            // التنقل
  | 'settings'            // الإعدادات
  | 'unknown';            // غير معروف

/**
 * مستوى الثقة في النية
 */
export type ConfidenceLevel = 
  | 'high'      // ثقة عالية (> 0.8)
  | 'medium'    // ثقة متوسطة (0.5 - 0.8)
  | 'low';      // ثقة منخفضة (< 0.5)

/**
 * حالة معالجة الرسالة
 */
export type MessageStatus =
  | 'pending'     // قيد الانتظار
  | 'processing'  // قيد المعالجة
  | 'completed'   // مكتملة
  | 'error';      // خطأ

/**
 * واجهة الرسالة
 */
export interface ChatMessage {
  // المعرف الفريد
  id: string;
  
  // الدور (user/assistant/system)
  role: MessageRole;
  
  // محتوى الرسالة
  content: string;
  
  // التوقيت
  timestamp: Date;
  
  // الحالة
  status: MessageStatus;
  
  // النية المستخرجة (إذا كانت من المستخدم)
  intent?: IntentType;
  
  // مستوى الثقة في النية
  confidence?: number;
  
  // الكيانات المستخرجة
  entities?: Record<string, any>;
  
  // الإجراء المنفذ
  action?: {
    type: string;
    result: any;
    success: boolean;
    error?: string;
  };
  
  // البيانات الوصفية
  metadata?: {
    duration?: number;        // مدة المعالجة (ms)
    model?: string;           // نموذج AI المستخدم
    tokens?: number;          // عدد Tokens
    context?: string[];       // السياق المستخدم
  };
}

/**
 * واجهة النية المستخرجة
 */
export interface ExtractedIntent {
  // نوع النية
  type: IntentType;
  
  // مستوى الثقة (0-1)
  confidence: number;
  
  // مستوى الثقة (high/medium/low)
  confidenceLevel: ConfidenceLevel;
  
  // الكيانات المستخرجة
  entities: {
    // نوع العقار
    propertyType?: string;
    
    // السعر
    price?: number | { min: number; max: number };
    
    // الموقع
    location?: {
      city?: string;
      district?: string;
    };
    
    // التاريخ
    date?: Date;
    
    // الوقت
    time?: string;
    
    // اسم الشخص
    personName?: string;
    
    // رقم الهاتف
    phone?: string;
    
    // أي بيانات أخرى
    [key: string]: any;
  };
  
  // السياق المطلوب
  requiredContext?: string[];
  
  // الإجراءات المقترحة
  suggestedActions?: Array<{
    label: string;
    action: string;
    parameters?: any;
  }>;
}

/**
 * واجهة سياق المحادثة
 */
export interface ConversationContext {
  // معرف المحادثة
  conversationId: string;
  
  // معرف المستخدم
  userId: string;
  
  // تاريخ المحادثة (آخر N رسالة)
  history: ChatMessage[];
  
  // الصفحة الحالية
  currentPage?: string;
  
  // العنصر المحدد حالياً
  currentEntity?: {
    type: string;
    id: string;
    data: any;
  };
  
  // المتغيرات المؤقتة
  tempVariables: Record<string, any>;
  
  // بيانات المستخدم
  userData: {
    name: string;
    role: string;
    preferences: Record<string, any>;
  };
}

/**
 * واجهة إعدادات المساعد
 */
export interface AssistantSettings {
  // هل المساعد مفعل؟
  enabled: boolean;
  
  // اللغة
  language: 'ar' | 'en';
  
  // نموذج AI
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude';
  
  // الصوت
  voice: {
    enabled: boolean;
    language: string;
    rate: number;        // سرعة الكلام
    pitch: number;       // طبقة الصوت
  };
  
  // الأوامر الصوتية
  voiceCommands: {
    enabled: boolean;
    wakeWord: string;    // كلمة الإيقاظ
    continuous: boolean; // استماع مستمر
  };
  
  // الاقتراحات
  suggestions: {
    enabled: boolean;
    showOnStart: boolean;
  };
  
  // التعلم
  learning: {
    enabled: boolean;
    saveHistory: boolean;
  };
}

/**
 * واجهة الاقتراح
 */
export interface Suggestion {
  // المعرف
  id: string;
  
  // النص المعروض
  label: string;
  
  // النص الكامل
  fullText: string;
  
  // الأيقونة
  icon?: string;
  
  // الفئة
  category: string;
  
  // الأولوية
  priority: number;
  
  // السياق المطلوب
  context?: string[];
}

/**
 * واجهة نتيجة الإجراء
 */
export interface ActionResult {
  // هل نجح الإجراء؟
  success: boolean;
  
  // البيانات الناتجة
  data?: any;
  
  // رسالة للمستخدم
  message: string;
  
  // الخطأ إن وجد
  error?: string;
  
  // إجراءات للمتابعة
  followUpActions?: Array<{
    label: string;
    action: string;
  }>;
}

/**
 * واجهة إحصائيات المساعد
 */
export interface AssistantStats {
  // عدد المحادثات
  totalConversations: number;
  
  // عدد الرسائل
  totalMessages: number;
  
  // معدل النجاح
  successRate: number;
  
  // متوسط وقت الاستجابة (ms)
  averageResponseTime: number;
  
  // أكثر النيات استخداماً
  topIntents: Array<{
    intent: IntentType;
    count: number;
    percentage: number;
  }>;
  
  // تقييم المستخدم
  userRating?: {
    average: number;
    total: number;
  };
}
```

---

## 4️⃣ **الاستيرادات**

### **استيرادات المكون الرئيسي:**

```typescript
// ==========================================
// FILE: components/AI_BubbleAssistant.tsx
// ==========================================

// React Core
import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback,
  useMemo 
} from 'react';

// UI Components (shadcn/ui)
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

// Icons (lucide-react)
import {
  MessageCircle,     // أيقونة الرسائل
  Send,              // إرسال
  Mic,               // ميكروفون
  MicOff,            // ميكروفون مطفأ
  Volume2,           // صوت
  VolumeX,           // صوت مطفأ
  Settings,          // إعدادات
  X,                 // إغلاق
  Minimize2,         // تصغير
  Maximize2,         // تكبير
  RotateCcw,         // إعادة تشغيل
  Trash2,            // حذف
  Copy,              // نسخ
  CheckCircle,       // دائرة مع صح
  AlertCircle,       // دائرة مع تنبيه
  Loader2,           // محمل
  Sparkles,          // شرارات (AI)
  Zap,               // صاعقة
  Brain,             // دماغ
  Eye,               // عين
  ThumbsUp,          // إعجاب
  ThumbsDown         // عدم إعجاب
} from 'lucide-react';

// Motion (animation)
import { motion, AnimatePresence } from 'motion/react';

// Toast
import { toast } from 'sonner';

// Custom Hooks
import { useSmartAssistantEnhanced } from '../hooks/useSmartAssistantEnhanced';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useAuth } from '../hooks/useAuth';

// AI Core
import { AI_ConsciousAssistantCore } from '../core/ai-cores/AI_ConsciousAssistantCore';
import { AI_AwarenessTracker } from '../core/ai-cores/AI_AwarenessTracker';

// Types
import type {
  ChatMessage,
  IntentType,
  ExtractedIntent,
  ConversationContext,
  AssistantSettings,
  Suggestion,
  ActionResult
} from '../types/ai-assistant';

// Utils
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
```

---

## 5️⃣ **State Management**

### **State المكون الرئيسي:**

```typescript
// ==========================================
// State في AI_BubbleAssistant
// ==========================================

export function AI_BubbleAssistant() {
  // ===== 1. حالة المحادثة =====
  
  /**
   * قائمة الرسائل
   */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  /**
   * الرسالة الحالية (قيد الكتابة)
   */
  const [currentMessage, setCurrentMessage] = useState<string>('');
  
  /**
   * السياق الحالي
   */
  const [context, setContext] = useState<ConversationContext>({
    conversationId: generateId(),
    userId: user.id,
    history: [],
    tempVariables: {},
    userData: {
      name: user.name,
      role: user.role,
      preferences: {}
    }
  });
  
  // ===== 2. حالة واجهة المستخدم =====
  
  /**
   * هل النافذة مفتوحة؟
   */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  /**
   * هل في وضع الشاشة الكاملة؟
   */
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  
  /**
   * هل يتم عرض الإعدادات؟
   */
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  /**
   * الموضع (للزر العائم)
   */
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth - 80,
    y: window.innerHeight - 80
  });
  
  // ===== 3. حالة المعالجة =====
  
  /**
   * هل يتم معالجة رسالة؟
   */
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  /**
   * هل يكتب المساعد؟ (مؤشر الكتابة)
   */
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  /**
   * النية المستخرجة الحالية
   */
  const [currentIntent, setCurrentIntent] = useState<ExtractedIntent | null>(null);
  
  // ===== 4. الأوامر الصوتية =====
  
  /**
   * هل التسجيل الصوتي نشط؟
   */
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  /**
   * النص المستخرج من الصوت
   */
  const [voiceText, setVoiceText] = useState<string>('');
  
  /**
   * هل التحويل الصوتي مدعوم؟
   */
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(false);
  
  // ===== 5. الاقتراحات =====
  
  /**
   * الاقتراحات الحالية
   */
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  /**
   * هل يتم عرض الاقتراحات؟
   */
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  
  // ===== 6. الإعدادات =====
  
  /**
   * إعدادات المساعد
   */
  const [settings, setSettings] = useState<AssistantSettings>({
    enabled: true,
    language: 'ar',
    model: 'gpt-4',
    voice: {
      enabled: true,
      language: 'ar-SA',
      rate: 1,
      pitch: 1
    },
    voiceCommands: {
      enabled: true,
      wakeWord: 'مساعد',
      continuous: false
    },
    suggestions: {
      enabled: true,
      showOnStart: true
    },
    learning: {
      enabled: true,
      saveHistory: true
    }
  });
  
  // ===== 7. References =====
  
  /**
   * مرجع لمنطقة الرسائل (للتمرير التلقائي)
   */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  /**
   * مرجع لحقل الإدخال
   */
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  /**
   * مرجع لمحرك AI
   */
  const aiCoreRef = useRef<AI_ConsciousAssistantCore | null>(null);
  
  /**
   * مرجع لمتتبع الوعي
   */
  const awarenessRef = useRef<AI_AwarenessTracker | null>(null);
  
  // ===== 8. Custom Hooks =====
  
  /**
   * Hook المساعد الذكي
   */
  const {
    processMessage,
    executeAction,
    getSuggestions,
    clearHistory
  } = useSmartAssistantEnhanced();
  
  /**
   * Hook الأوامر الصوتية
   */
  const {
    startListening,
    stopListening,
    isListening,
    transcript
  } = useVoiceCommands({
    onResult: (text) => {
      setVoiceText(text);
      setCurrentMessage(text);
    }
  });
  
  /**
   * معلومات المستخدم
   */
  const { user } = useAuth();
  
  // ===== 9. Computed Values =====
  
  /**
   * عدد الرسائل غير المقروءة
   */
  const unreadCount = useMemo(() => {
    return messages.filter(m => 
      m.role === 'assistant' && !m.metadata?.read
    ).length;
  }, [messages]);
  
  /**
   * هل يمكن الإرسال؟
   */
  const canSend = useMemo(() => {
    return currentMessage.trim().length > 0 && !isProcessing;
  }, [currentMessage, isProcessing]);
}
```

---

**(يتبع في الملف التالي للأوامر والتفاعلات...)**
