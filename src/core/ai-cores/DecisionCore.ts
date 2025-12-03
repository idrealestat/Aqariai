// /core/ai-cores/DecisionCore.ts
// تحليل النص -> نية، كيان، إجراء، ثقة، وبيانات مستخرجة (pattern matching)

export interface AIAnalysis {
  intent: string;
  confidence: number; // 0..1
  action: string;
  entity: string;
  data: any;
}

const patterns = [
  { intent: 'search_customers', regex: /\b(ابحث عن|دور على|عميل|بحث عن عميل|البحث عن)\b/i },
  { intent: 'search_requests', regex: /\b(طلب|طلبات|استعلام عن طلب|بحث عن طلب)\b/i },
  { intent: 'urgent_requests', regex: /\b(عاجل|طارئ|urgent)\b/i },
  { intent: 'search_offers', regex: /\b(عرض|عروض|بحث عن عرض)\b/i },
  { intent: 'show_analytics', regex: /\b(تحليل|احصائيات|إحصائيات|تحليلات السوق|سوق)\b/i },
  { intent: 'create_business_card', regex: /\b(انشئ بطاقة|بطاقة عملي|بطاقة أعمال|create business card)\b/i },
  { intent: 'show_business_card', regex: /\b(اعرض بطاقة|عرض بطاقة|show business card)\b/i },
  { intent: 'social_media_publish', regex: /\b(انشر|نشر|انشر على|نشر على انستغرام|نشر تويتر)\b/i },
  { intent: 'search_archive', regex: /\b(ارشيف|أرشيف|بحث في الأرشيف|archive)\b/i },
  { intent: 'manage_appointments', regex: /\b(موعد|مواعيد|جدول المواعيد|appointment)\b/i },
  { intent: 'market_analysis', regex: /\b(تحليل السوق|market analysis|اتجاهات السوق)\b/i },
  { intent: 'general_inquiry', regex: /\b(ماذا|كيف|لماذا|استفسار|سؤال)\b/i },
  { intent: 'create_offer', regex: /\b(انشئ عرض|انشاء عرض|create offer)\b/i },
  { intent: 'update_customer', regex: /\b(تعديل عميل|حدث بيانات العميل|update customer)\b/i },
  { intent: 'delete_offer', regex: /\b(حذف عرض|امسح العرض|delete offer)\b/i },
];

import { extractEntitiesFromText } from './nlu-utils';
import processAIIntent from '../../api/kernel/processAIIntent';

class DecisionCore {
  static async analyzeInput(input: string, context?: any): Promise<AIAnalysis> {
    const trimmed = (input || '').trim();

    // quick patterns
    for (const p of patterns) {
      if (p.regex.test(trimmed)) {
        const confidence = 0.9; // baseline for pattern matches
        // extract named entities (names, numbers, dates, urls) – helper below
        const entities = extractEntitiesFromText(trimmed);

        // map to action/entity default (more specific in processAIIntent)
        let action = 'search';
        let entity = 'unknown';
        switch (p.intent) {
          case 'search_customers': entity = 'customer'; action = 'search'; break;
          case 'search_requests': entity = 'request'; action = 'search'; break;
          case 'urgent_requests': entity = 'request'; action = 'list_urgent'; break;
          case 'search_offers': entity = 'offer'; action = 'search'; break;
          case 'show_analytics': entity = 'analytics'; action = 'show'; break;
          case 'create_business_card': entity = 'business_card'; action = 'create'; break;
          case 'show_business_card': entity = 'business_card'; action = 'view'; break;
          case 'social_media_publish': entity = 'social_post'; action = 'publish'; break;
          case 'search_archive': entity = 'archive'; action = 'search'; break;
          case 'manage_appointments': entity = 'appointment'; action = 'list'; break;
          case 'market_analysis': entity = 'market'; action = 'analyze'; break;
          case 'create_offer': entity = 'offer'; action = 'create'; break;
          case 'update_customer': entity = 'customer'; action = 'update'; break;
          case 'delete_offer': entity = 'offer'; action = 'delete'; break;
          default: entity = 'unknown'; action = 'help';
        }

        // return early with analysis; detailed processing happens in processAIIntent
        return {
          intent: p.intent,
          confidence,
          action,
          entity,
          data: { extracted: entities }
        };
      }
    }

    // fallback: generic intent detection (small heuristics)
    if (/\b(مرحبا|اهلا|هلا|hello)\b/i.test(trimmed)) {
      return {
        intent: 'general_inquiry',
        confidence: 0.7,
        action: 'greeting',
        entity: 'unknown',
        data: {}
      };
    }

    // default unknown
    return {
      intent: 'general_inquiry',
      confidence: 0.5,
      action: 'help',
      entity: 'unknown',
      data: {}
    };
  }

  // orchestrator: analyze -> process -> normalize output JSON
  static async handleMessage(input: string, context?: any) {
    const analysis = await DecisionCore.analyzeInput(input, context);
    const result = await processAIIntent(analysis.intent, input, context, analysis);
    // normalize guarantee
    return {
      intent: result.intent || analysis.intent,
      scope: result.scope || (result.entity ? `${result.entity}s` : 'general'),
      confidence: typeof result.confidence === 'number' ? result.confidence : analysis.confidence,
      data: result.data || {},
      action: result.action || analysis.action,
      entity: result.entity || analysis.entity
    };
  }
}

export default DecisionCore;
