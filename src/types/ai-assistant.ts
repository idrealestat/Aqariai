/**
 * 🤖 TypeScript Types للمساعد الذكي
 * 
 * يحتوي على جميع الأنواع المطلوبة لدمج المساعد الذكي مع الوحدات المختلفة
 */

// ============================================
// 1. أنواع الطلبات والردود
// ============================================

/**
 * طلب المستخدم للمساعد الذكي
 */
export interface AIRequest {
  /** السياق الحالي (crm, offers, calendar, finance, general) */
  context: "crm" | "offers" | "calendar" | "finance" | "general";
  /** رسالة المستخدم */
  message: string;
  /** معرف المستخدم (اختياري) */
  userId?: string;
  /** بيانات إضافية (اختياري) */
  metadata?: Record<string, any>;
}

/**
 * رد المساعد الذكي
 */
export interface AIResponse {
  /** الرد النصي */
  reply: string;
  /** اقتراح للمستخدم (اختياري) */
  suggestion?: string;
  /** إجراء يمكن تنفيذه (اختياري) */
  action?: AIAction;
  /** بيانات إضافية (اختياري) */
  data?: any;
  /** حالة الطلب */
  status: "success" | "error" | "partial";
}

/**
 * إجراء يمكن للمساعد تنفيذه
 */
export interface AIAction {
  /** نوع الإجراء */
  type: 
    | "open_customer"       // فتح تفاصيل عميل
    | "open_offer"          // فتح تفاصيل عقار
    | "navigate"            // التنقل لصفحة
    | "add_appointment"     // إضافة موعد
    | "search"              // بحث
    | "publish"             // نشر
    | "calculate"           // حساب
    | "send_notification"   // إرسال إشعار
    | "custom";             // إجراء مخصص

  /** معاملات الإجراء */
  params: Record<string, any>;
  
  /** وصف الإجراء */
  description?: string;
}

// ============================================
// 2. أنواع النية (Intent)
// ============================================

/**
 * نية المستخدم المستخرجة من الرسالة
 */
export interface UserIntent {
  /** نوع النية */
  type: IntentType;
  /** الثقة في التحليل (0-1) */
  confidence: number;
  /** المعاملات المستخرجة */
  params: Record<string, any>;
  /** الكلمات المفتاحية */
  keywords: string[];
}

/**
 * أنواع النوايا المدعومة
 */
export type IntentType =
  // CRM
  | "search_customer"
  | "add_customer"
  | "update_customer"
  | "delete_customer"
  | "view_customer"
  | "assign_customer"
  
  // العقارات
  | "search_property"
  | "add_property"
  | "update_property"
  | "delete_property"
  | "view_property"
  | "publish_property"
  
  // التقويم
  | "show_appointments"
  | "add_appointment"
  | "update_appointment"
  | "delete_appointment"
  | "today_appointments"
  | "week_appointments"
  
  // الحاسبة
  | "calculate_mortgage"
  | "calculate_roi"
  | "calculate_profit"
  
  // النشر
  | "publish_to_platform"
  | "publish_to_social"
  | "check_publish_status"
  
  // عام
  | "general_help"
  | "navigation"
  | "unknown";

// ============================================
// 3. أنواع Props للمكونات
// ============================================

/**
 * Props للمساعد الذكي
 */
export interface AIBubbleAssistantProps {
  /** فتح تفاصيل عميل */
  onOpenCustomer?: (customerId: string) => void;
  
  /** فتح تفاصيل عقار */
  onOpenOffer?: (offerId: string) => void;
  
  /** التنقل لصفحة */
  onNavigate?: (page: string) => void;
  
  /** إضافة موعد */
  onAddAppointment?: (appointment: any) => void;
  
  /** إرسال إشعار */
  onSendNotification?: (notification: any) => void;
  
  /** معرف المستخدم الحالي */
  currentUserId?: string;
  
  /** السياق الحالي */
  currentContext?: string;
  
  /** إجراء مخصص */
  onCustomAction?: (action: AIAction) => void;
}

// ============================================
// 4. أنواع النتائج
// ============================================

/**
 * نتيجة البحث عن عميل
 */
export interface CustomerSearchResult {
  id: string;
  name: string;
  phone: string;
  type: "owner" | "buyer";
  status: string;
  matchScore: number;
}

/**
 * نتيجة البحث عن عقار
 */
export interface PropertySearchResult {
  id: string;
  adNumber: string;
  title: string;
  price: number;
  location: string;
  matchScore: number;
}

/**
 * نتائج الحساب
 */
export interface CalculationResult {
  input: Record<string, any>;
  output: Record<string, any>;
  summary: string;
  recommendations?: string[];
}

// ============================================
// 5. أنواع السياقات
// ============================================

/**
 * سياق المحادثة
 */
export interface ConversationContext {
  /** معرف المحادثة */
  conversationId: string;
  
  /** السياق الحالي */
  currentContext: string;
  
  /** الصفحة الحالية */
  currentPage?: string;
  
  /** العميل المختار حالياً */
  selectedCustomer?: string;
  
  /** العقار المختار حالياً */
  selectedOffer?: string;
  
  /** سجل المحادثة */
  history: AIMessage[];
  
  /** بيانات مؤقتة */
  tempData?: Record<string, any>;
}

/**
 * رسالة في المحادثة
 */
export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ============================================
// 6. أنواع الأوامر
// ============================================

/**
 * أمر صوتي أو نصي
 */
export interface Command {
  /** نص الأمر */
  text: string;
  
  /** نوع الأمر */
  type: "voice" | "text";
  
  /** اللغة */
  language: "ar" | "en";
  
  /** معاملات إضافية */
  params?: Record<string, any>;
}

/**
 * نتيجة تنفيذ الأمر
 */
export interface CommandResult {
  /** نجح أم لا */
  success: boolean;
  
  /** رسالة النتيجة */
  message: string;
  
  /** البيانات الناتجة */
  data?: any;
  
  /** الخطأ (إن وجد) */
  error?: string;
}

// ============================================
// 7. أنواع التحليلات
// ============================================

/**
 * تحليل النص
 */
export interface TextAnalysis {
  /** النص الأصلي */
  originalText: string;
  
  /** النص المنظف */
  cleanedText: string;
  
  /** الكلمات المفتاحية */
  keywords: string[];
  
  /** الكيانات المستخرجة (أسماء، أرقام، مواقع) */
  entities: Entity[];
  
  /** المشاعر (إيجابي، سلبي، محايد) */
  sentiment?: "positive" | "negative" | "neutral";
  
  /** اللغة المكتشفة */
  detectedLanguage: string;
}

/**
 * كيان مستخرج من النص
 */
export interface Entity {
  /** نوع الكيان */
  type: "person" | "location" | "price" | "date" | "phone" | "email" | "other";
  
  /** القيمة */
  value: string;
  
  /** الموقع في النص */
  position: { start: number; end: number };
  
  /** الثقة (0-1) */
  confidence: number;
}

// ============================================
// 8. أنواع الإجراءات المتقدمة
// ============================================

/**
 * إجراء متعدد الخطوات
 */
export interface MultiStepAction {
  /** معرف الإجراء */
  id: string;
  
  /** الخطوات */
  steps: ActionStep[];
  
  /** الخطوة الحالية */
  currentStep: number;
  
  /** الحالة */
  status: "pending" | "in_progress" | "completed" | "failed";
  
  /** النتائج */
  results?: any[];
}

/**
 * خطوة في إجراء
 */
export interface ActionStep {
  /** رقم الخطوة */
  stepNumber: number;
  
  /** الوصف */
  description: string;
  
  /** الإجراء */
  action: AIAction;
  
  /** الحالة */
  status: "pending" | "completed" | "failed" | "skipped";
  
  /** النتيجة */
  result?: any;
}

// ============================================
// 9. أنواع الاقتراحات
// ============================================

/**
 * اقتراح ذكي
 */
export interface SmartSuggestion {
  /** معرف الاقتراح */
  id: string;
  
  /** النص */
  text: string;
  
  /** الأولوية */
  priority: "high" | "medium" | "low";
  
  /** الإجراء المقترح */
  action?: AIAction;
  
  /** السبب */
  reason?: string;
  
  /** مدى الصلة (0-1) */
  relevance: number;
}

// ============================================
// 10. أنواع التكاملات
// ============================================

/**
 * تكامل مع وحدة CRM
 */
export interface CRMIntegration {
  searchCustomers: (query: string) => Promise<CustomerSearchResult[]>;
  getCustomerById: (id: string) => Promise<any>;
  addCustomer: (customer: any) => Promise<any>;
  updateCustomer: (id: string, updates: any) => Promise<any>;
  deleteCustomer: (id: string) => Promise<boolean>;
}

/**
 * تكامل مع وحدة العقارات
 */
export interface PropertyIntegration {
  searchProperties: (query: string) => Promise<PropertySearchResult[]>;
  getPropertyById: (id: string) => Promise<any>;
  addProperty: (property: any) => Promise<any>;
  updateProperty: (id: string, updates: any) => Promise<any>;
  publishProperty: (id: string, platforms: string[]) => Promise<boolean>;
}

/**
 * تكامل مع التقويم
 */
export interface CalendarIntegration {
  getAppointments: (start: Date, end: Date) => Promise<any[]>;
  addAppointment: (appointment: any) => Promise<any>;
  updateAppointment: (id: string, updates: any) => Promise<any>;
  deleteAppointment: (id: string) => Promise<boolean>;
  getTodayAppointments: () => Promise<any[]>;
}

/**
 * تكامل مع الحاسبة
 */
export interface CalculatorIntegration {
  calculateMortgage: (params: any) => CalculationResult;
  calculateROI: (params: any) => CalculationResult;
  calculateProfit: (params: any) => CalculationResult;
}

// ============================================
// 11. أنواع الأخطاء
// ============================================

/**
 * خطأ في المساعد الذكي
 */
export interface AIError {
  /** كود الخطأ */
  code: string;
  
  /** رسالة الخطأ */
  message: string;
  
  /** التفاصيل */
  details?: any;
  
  /** الحل المقترح */
  suggestion?: string;
}

/**
 * أكواد الأخطاء
 */
export enum AIErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  NOT_FOUND = "NOT_FOUND",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN"
}

// ============================================
// 12. Utilities
// ============================================

/**
 * تكوين المساعد الذكي
 */
export interface AIConfig {
  /** API URL */
  apiUrl: string;
  
  /** مهلة الطلب (ميلي ثانية) */
  timeout: number;
  
  /** عدد محاولات إعادة الإرسال */
  retries: number;
  
  /** تفعيل السجلات */
  enableLogging: boolean;
  
  /** اللغة الافتراضية */
  defaultLanguage: "ar" | "en";
  
  /** الوضع (تطوير أو إنتاج) */
  mode: "development" | "production";
}

/**
 * إحصائيات المساعد
 */
export interface AIStats {
  /** عدد الطلبات */
  totalRequests: number;
  
  /** الطلبات الناجحة */
  successfulRequests: number;
  
  /** الطلبات الفاشلة */
  failedRequests: number;
  
  /** متوسط وقت الاستجابة (ميلي ثانية) */
  averageResponseTime: number;
  
  /** أكثر النوايا استخداماً */
  topIntents: { intent: IntentType; count: number }[];
  
  /** آخر تحديث */
  lastUpdated: Date;
}

// ============================================
// تصدير جميع الأنواع
// ============================================

export type {
  AIRequest,
  AIResponse,
  AIAction,
  UserIntent,
  IntentType,
  AIBubbleAssistantProps,
  CustomerSearchResult,
  PropertySearchResult,
  CalculationResult,
  ConversationContext,
  AIMessage,
  Command,
  CommandResult,
  TextAnalysis,
  Entity,
  MultiStepAction,
  ActionStep,
  SmartSuggestion,
  CRMIntegration,
  PropertyIntegration,
  CalendarIntegration,
  CalculatorIntegration,
  AIError,
  AIConfig,
  AIStats
};

export { AIErrorCode };
