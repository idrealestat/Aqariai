// /api/kernel/query-real.ts
// Route handler final - معالج النواة الحقيقي
import DecisionCore from '../../core/ai-cores/DecisionCore';
import { AI_DataPulseCore } from '../../core/ai-cores/AI_DataPulseCore';

export interface KernelRequest {
  userId?: string;
  user?: string;
  message?: string;
  query?: string;
  page?: string;
  metadata?: any;
}

export interface KernelResponse {
  success: boolean;
  result?: any;
  error?: string;
}

export default async function handler(req: KernelRequest): Promise<KernelResponse> {
  try {
    const userId = req.userId || req.user || 'anonymous';
    const message = req.message || req.query || '';
    const page = req.page || 'dashboard';
    const metadata = req.metadata || {};

    console.log('🧠 [Kernel Query Real] Processing:', { userId, message, page });

    // 1) register/update pulse
    await AI_DataPulseCore.updateFromUserInput(userId, message, { page, ...metadata });

    // 2) analyze + process
    const normalized = await DecisionCore.handleMessage(message, { userId, page });

    // 3) log intent
    await AI_DataPulseCore.logIntent(userId, normalized.intent, normalized.confidence, message);

    console.log('✅ [Kernel Query Real] Result:', {
      intent: normalized.intent,
      confidence: normalized.confidence,
      dataCount: Array.isArray(normalized.data) ? normalized.data.length : 'object'
    });

    // 4) standardized response (no free-text required)
    return {
      success: true,
      result: normalized
    };
  } catch (err) {
    console.error('❌ [/api/kernel/query-real] error', err);
    return { 
      success: false, 
      error: String(err) 
    };
  }
}

// For direct usage (non-HTTP)
export async function queryKernel(req: KernelRequest): Promise<KernelResponse> {
  return handler(req);
}
