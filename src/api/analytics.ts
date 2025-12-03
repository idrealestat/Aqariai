/**
 * 🔌 API - التحليلات والإحصائيات (Analytics)
 * =====================================
 * 
 * Real API للتحليلات الشاملة
 * يوفر: إحصائيات العقارات، الطلبات، العملاء، الأداء
 */

import { searchCustomers } from '../utils/customersManager';
import { searchRequests, getRequestsStats } from './requests';

// ============================================
// Types
// ============================================

export interface AnalyticsData {
  overview: {
    totalProperties: number;
    totalRequests: number;
    totalCustomers: number;
    totalRevenue: number;
    activeDeals: number;
    completedDeals: number;
  };
  properties: {
    byType: Record<string, number>;
    byCity: Record<string, number>;
    byStatus: Record<string, number>;
    averagePrice: number;
  };
  requests: {
    total: number;
    urgent: number;
    active: number;
    completed: number;
    byCity: Record<string, number>;
    totalBudget: number;
  };
  customers: {
    total: number;
    active: number;
    byStage: Record<string, number>;
    conversionRate: number;
  };
  performance: {
    responseTime: number;
    satisfactionRate: number;
    closingRate: number;
  };
  trends: {
    last7Days: number[];
    last30Days: number[];
    monthlyGrowth: number;
  };
}

// ============================================
// API Handler
// ============================================

interface Request {
  method: string;
  url: string;
  body?: any;
  query?: Record<string, string>;
}

interface Response {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

export default async function handler(req: Request, res: Response) {
  const { method, query } = req;

  if (method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { userId, type, period } = query || {};

    // جلب التحليلات حسب النوع
    if (type === 'overview') {
      const data = await getOverviewAnalytics(userId);
      return res.status(200).json({
        success: true,
        data
      });
    }

    if (type === 'properties') {
      const data = await getPropertiesAnalytics(userId);
      return res.status(200).json({
        success: true,
        data
      });
    }

    if (type === 'requests') {
      const data = getRequestsStats(userId);
      return res.status(200).json({
        success: true,
        data
      });
    }

    if (type === 'customers') {
      const data = await getCustomersAnalytics(userId);
      return res.status(200).json({
        success: true,
        data
      });
    }

    // جلب التحليلات الشاملة
    const analytics = await getComprehensiveAnalytics(userId, period);
    
    return res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    });
  }
}

// ============================================
// Analytics Functions
// ============================================

/**
 * نظرة عامة على الإحصائيات
 */
async function getOverviewAnalytics(userId?: string) {
  const customers = searchCustomers('');
  const requestsStats = getRequestsStats(userId);

  return {
    totalProperties: 0, // سيتم ربطه مع offers API
    totalRequests: requestsStats.total,
    totalCustomers: customers.length,
    totalRevenue: 0,
    activeDeals: requestsStats.active,
    completedDeals: requestsStats.completed,
    urgentRequests: requestsStats.urgent
  };
}

/**
 * تحليلات العقارات
 */
async function getPropertiesAnalytics(userId?: string) {
  // سيتم ربطه مع offers API الحقيقي
  return {
    byType: {
      'شقة': 25,
      'فيلا': 15,
      'أرض': 10,
      'عمارة': 5
    },
    byCity: {
      'الرياض': 30,
      'جدة': 15,
      'الدمام': 10
    },
    byStatus: {
      'متاح': 40,
      'محجوز': 10,
      'مباع': 5
    },
    averagePrice: 750000
  };
}

/**
 * تحليلات العملاء
 */
async function getCustomersAnalytics(userId?: string) {
  const customers = searchCustomers('');

  // حساب التوزيع حسب المرحلة
  const byStage = customers.reduce((acc, customer) => {
    const stage = customer.stage || 'جديد';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = customers.length;
  const active = customers.filter(c => c.stage !== 'مؤرشف').length;

  return {
    total,
    active,
    byStage,
    conversionRate: total > 0 ? ((byStage['تم الإغلاق'] || 0) / total) * 100 : 0
  };
}

/**
 * التحليلات الشاملة
 */
async function getComprehensiveAnalytics(userId?: string, period: string = '30'): Promise<AnalyticsData> {
  const overview = await getOverviewAnalytics(userId);
  const properties = await getPropertiesAnalytics(userId);
  const requests = getRequestsStats(userId);
  const customers = await getCustomersAnalytics(userId);

  // بيانات الأداء (demo - سيتم ربطها بالبيانات الحقيقية)
  const performance = {
    responseTime: 2.5, // ساعات
    satisfactionRate: 92, // %
    closingRate: 35 // %
  };

  // اتجاهات النمو (demo)
  const trends = {
    last7Days: [5, 8, 12, 7, 15, 20, 18],
    last30Days: Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * 25) + 5),
    monthlyGrowth: 15.5 // %
  };

  return {
    overview: {
      totalProperties: overview.totalProperties,
      totalRequests: overview.totalRequests,
      totalCustomers: overview.totalCustomers,
      totalRevenue: overview.totalRevenue,
      activeDeals: overview.activeDeals,
      completedDeals: overview.completedDeals
    },
    properties,
    requests,
    customers,
    performance,
    trends
  };
}

// ============================================
// Helper Functions للاستخدام الخارجي
// ============================================

/**
 * جلب إحصائيات سريعة
 */
export async function getQuickStats(userId?: string) {
  const overview = await getOverviewAnalytics(userId);
  return {
    properties: overview.totalProperties,
    requests: overview.totalRequests,
    customers: overview.totalCustomers,
    activeDeals: overview.activeDeals
  };
}

/**
 * جلب أهم المؤشرات
 */
export async function getKeyMetrics(userId?: string) {
  const analytics = await getComprehensiveAnalytics(userId);
  
  return {
    revenue: analytics.overview.totalRevenue,
    closingRate: analytics.performance.closingRate,
    satisfaction: analytics.performance.satisfactionRate,
    growth: analytics.trends.monthlyGrowth
  };
}
