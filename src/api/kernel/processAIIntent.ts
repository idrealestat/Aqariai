// /api/kernel/processAIIntent.ts
// يتعامل مع النوايا عمليا: يبحث في mock data أو ينشئ/يعدل/يحذف
import { customersSearch, requestsSearch, offersSearch, mockCreateBusinessCard } from '../../services/mockData';

// ============================================
// Types
// ============================================

export interface AIResponse {
  intent: string;
  scope: string;
  confidence: number;
  data: any;
  action: string;
  entity: string;
  success: boolean;
  error?: string;
}

export default async function processAIIntent(intent: string, input: string, context: any, analysis: any): Promise<AIResponse> {
  try {
    switch (intent) {
      case 'search_customers': {
        // استخدم analyzer.extracted.name إن وجد
        const name = analysis.data?.extracted?.name || input;
        const results = await customersSearch(name);
        return {
          intent,
          scope: 'customers',
          confidence: analysis.confidence,
          data: results, // [] or items
          action: 'search',
          entity: 'customer',
          success: true
        };
      }

      case 'search_requests': {
        const results = await requestsSearch(input);
        return {
          intent,
          scope: 'requests',
          confidence: analysis.confidence,
          data: results,
          action: 'search',
          entity: 'request',
          success: true
        };
      }

      case 'urgent_requests': {
        const results = await requestsSearch({ urgent: true });
        return {
          intent,
          scope: 'requests',
          confidence: analysis.confidence,
          data: results,
          action: 'list_urgent',
          entity: 'request',
          success: true
        };
      }

      case 'search_offers': {
        const results = await offersSearch(input);
        return {
          intent,
          scope: 'offers',
          confidence: analysis.confidence,
          data: results,
          action: 'search',
          entity: 'offer',
          success: true
        };
      }

      case 'create_business_card': {
        const card = mockCreateBusinessCard(context?.userId || 'anonymous', input);
        return {
          intent,
          scope: 'business_card',
          confidence: 0.95,
          data: card,
          action: 'create',
          entity: 'business_card',
          success: true
        };
      }

      case 'show_analytics': {
        // placeholder analytics
        return {
          intent,
          scope: 'analytics',
          confidence: analysis.confidence,
          data: { visitsLast7Days: 123, leads: 8 },
          action: 'show',
          entity: 'analytics',
          success: true
        };
      }

      // other handlers: create_offer, update_customer, delete_offer...
      case 'create_offer': {
        return {
          intent,
          scope: 'offers',
          confidence: 0.9,
          data: { created: true },
          action: 'create',
          entity: 'offer',
          success: true
        };
      }

      case 'update_customer': {
        return {
          intent,
          scope: 'customers',
          confidence: 0.88,
          data: { updated: true },
          action: 'update',
          entity: 'customer',
          success: true
        };
      }

      case 'delete_offer': {
        return {
          intent,
          scope: 'offers',
          confidence: 0.9,
          data: { deleted: true },
          action: 'delete',
          entity: 'offer',
          success: true
        };
      }

      case 'social_media_publish': {
        return {
          intent,
          scope: 'social',
          confidence: 0.9,
          data: { posted: true },
          action: 'publish',
          entity: 'social_post',
          success: true
        };
      }

      case 'search_archive': {
        return {
          intent,
          scope: 'archive',
          confidence: 0.85,
          data: [],
          action: 'search',
          entity: 'archive',
          success: true
        };
      }

      case 'manage_appointments': {
        return {
          intent,
          scope: 'appointments',
          confidence: 0.9,
          data: [{ id: 1, when: '2025-11-10T10:00:00Z', title: 'زيارة عقار' }],
          action: 'list',
          entity: 'appointment',
          success: true
        };
      }

      case 'market_analysis': {
        return {
          intent,
          scope: 'market',
          confidence: 0.86,
          data: { trend: 'up', recommendedAction: 'list_more' },
          action: 'analyze',
          entity: 'market',
          success: true
        };
      }

      case 'general_inquiry':
      default: {
        return {
          intent,
          scope: 'general',
          confidence: analysis.confidence || 0.5,
          data: { text: 'أحتاج مزيد من التفاصيل أو سؤال محدد' },
          action: 'help',
          entity: 'unknown',
          success: true
        };
      }
    }
  } catch (err) {
    console.error('[processAIIntent] error', err);
    return {
      intent,
      scope: 'general',
      confidence: 0,
      data: {},
      action: 'help',
      entity: 'unknown',
      success: false,
      error: String(err)
    };
  }
}
