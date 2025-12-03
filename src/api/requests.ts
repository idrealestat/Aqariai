/**
 * 🔌 API - إدارة الطلبات (Requests)
 * =====================================
 * 
 * Real API للطلبات العقارية
 * يوفر: البحث، الإضافة، التحديث، الحذف
 * ✅ الإشعارات: مربوط بنظام الإشعارات الحقيقي
 */

// ✅ استيراد نظام الإشعارات
import { NotificationsAPI } from './notifications-real';

// ============================================
// 🔧 HELPER FUNCTIONS
// ============================================

/**
 * الحصول على معرف المستخدم الحالي
 */
function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  try {
    const brokerData = localStorage.getItem('broker-registration-data');
    if (brokerData) {
      const parsed = JSON.parse(brokerData);
      return parsed.phone || parsed.id || 'anonymous';
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  
  return 'anonymous';
}

// ============================================
// Types
// ============================================

type PropertyType = 'شقة' | 'فيلا' | 'أرض' | 'عمارة' | 'محل' | 'مكتب' | 'مستودع' | 'مزرعة' | 'استراحة';
type TransactionType = 'شراء' | 'استئجار';
type PropertyCategory = 'سكني' | 'تجاري';
type PaymentMethod = 'كاش' | 'تمويل';
type Urgency = 'مستعجل' | 'عادي';

export interface PropertyRequest {
  id: string;
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  category: PropertyCategory;
  budget: number;
  urgency: Urgency;
  city: string;
  districts: string[];
  paymentMethod: PaymentMethod;
  description?: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
  userId?: string;
}

// ============================================
// In-Memory Storage (سيتم استبداله بـ Supabase)
// ============================================

let requestsDatabase: PropertyRequest[] = [
  {
    id: 'req-2025-001',
    title: 'مطلوب فيلا فاخرة في حي راقي - الرياض',
    propertyType: 'فيلا',
    transactionType: 'شراء',
    category: 'سكني',
    budget: 2500000,
    urgency: 'مستعجل',
    city: 'الرياض',
    districts: ['النرجس', 'العليا', 'الملقا'],
    paymentMethod: 'تمويل',
    description: 'أبحث عن فيلا فاخرة 4 غرف نوم + مجلس + صالة كبيرة، مع حديقة ومسبح، في حي هادئ وراقي',
    createdAt: new Date('2025-01-01'),
    status: 'active',
    userId: 'demo-user-0501234567'
  },
  {
    id: 'req-2025-002',
    title: 'شقة للإيجار 3 غرف - جدة',
    propertyType: 'شقة',
    transactionType: 'استئجار',
    category: 'سكني',
    budget: 45000,
    urgency: 'عادي',
    city: 'جدة',
    districts: ['الروضة', 'الزهراء'],
    paymentMethod: 'كاش',
    description: 'مطلوب شقة 3 غرف نوم، مطبخ راكب، موقف سيارتين، قريبة من المدارس',
    createdAt: new Date('2024-12-28'),
    status: 'active',
    userId: 'demo-user-0501234567'
  },
  {
    id: 'req-2025-003',
    title: 'أرض تجارية على شارع رئيسي',
    propertyType: 'أرض',
    transactionType: 'شراء',
    category: 'تجاري',
    budget: 3000000,
    urgency: 'مستعجل',
    city: 'الرياض',
    districts: ['العليا'],
    paymentMethod: 'كاش',
    description: 'أبحث عن أرض تجارية على شارع رئيسي، مساحة لا تقل عن 800 متر، للاستثمار',
    createdAt: new Date('2025-01-02'),
    status: 'active',
    userId: 'demo-user-0501234567'
  }
];

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
  const { method, query, body } = req;

  try {
    // GET - جلب جميع الطلبات أو طلب محدد
    if (method === 'GET') {
      const { id, userId, search } = query || {};

      // جلب طلب محدد
      if (id) {
        const request = requestsDatabase.find(r => r.id === id);
        if (!request) {
          return res.status(404).json({
            success: false,
            error: 'الطلب غير موجود'
          });
        }
        return res.status(200).json({
          success: true,
          data: request
        });
      }

      // جلب جميع الطلبات
      let results = [...requestsDatabase];

      // فلترة حسب المستخدم
      if (userId) {
        results = results.filter(r => r.userId === userId);
      }

      // بحث
      if (search) {
        const searchLower = search.toLowerCase();
        results = results.filter(r =>
          r.title.toLowerCase().includes(searchLower) ||
          r.city.toLowerCase().includes(searchLower) ||
          r.propertyType.toLowerCase().includes(searchLower)
        );
      }

      return res.status(200).json({
        success: true,
        data: results,
        count: results.length
      });
    }

    // POST - إنشاء طلب جديد
    if (method === 'POST') {
      const newRequest: PropertyRequest = {
        id: `req-${Date.now()}`,
        ...body,
        createdAt: new Date(),
        status: 'active'
      };

      requestsDatabase.push(newRequest);
      
      // ✅ إشعار بطلب جديد
      try {
        const userId = body.userId || getCurrentUserId();
        NotificationsAPI.notifyRequestAdded(userId, newRequest);
        
        // إطلاق event للتكامل
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('requestAdded', {
            detail: newRequest
          }));
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }

      return res.status(201).json({
        success: true,
        data: newRequest,
        message: 'تم إنشاء الطلب بنجاح'
      });
    }

    // PUT - تحديث طلب
    if (method === 'PUT') {
      const { id } = query || {};
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'معرف الطلب مطلوب'
        });
      }

      const index = requestsDatabase.findIndex(r => r.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'الطلب غير موجود'
        });
      }

      requestsDatabase[index] = {
        ...requestsDatabase[index],
        ...body
      };

      return res.status(200).json({
        success: true,
        data: requestsDatabase[index],
        message: 'تم تحديث الطلب بنجاح'
      });
    }

    // DELETE - حذف طلب
    if (method === 'DELETE') {
      const { id } = query || {};
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'معرف الطلب مطلوب'
        });
      }

      const index = requestsDatabase.findIndex(r => r.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'الطلب غير موجود'
        });
      }

      requestsDatabase.splice(index, 1);

      return res.status(200).json({
        success: true,
        message: 'تم حذف الطلب بنجاح'
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('[Requests API] Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    });
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * البحث عن الطلبات
 */
export function searchRequests(query: string): PropertyRequest[] {
  if (!query) return requestsDatabase;

  const searchLower = query.toLowerCase();
  return requestsDatabase.filter(req =>
    req.title.toLowerCase().includes(searchLower) ||
    req.city.toLowerCase().includes(searchLower) ||
    req.propertyType.toLowerCase().includes(searchLower) ||
    req.districts.some(d => d.toLowerCase().includes(searchLower))
  );
}

/**
 * جلب طلب بالمعرف
 */
export function getRequestById(id: string): PropertyRequest | undefined {
  return requestsDatabase.find(req => req.id === id);
}

/**
 * جلب الطلبات المستعجلة
 */
export function getUrgentRequests(userId?: string): PropertyRequest[] {
  let results = requestsDatabase.filter(req => 
    req.urgency === 'مستعجل' && req.status === 'active'
  );

  if (userId) {
    results = results.filter(req => req.userId === userId);
  }

  return results;
}

/**
 * إحصائيات الطلبات
 */
export function getRequestsStats(userId?: string) {
  let requests = requestsDatabase;

  if (userId) {
    requests = requests.filter(req => req.userId === userId);
  }

  return {
    total: requests.length,
    active: requests.filter(r => r.status === 'active').length,
    urgent: requests.filter(r => r.urgency === 'مستعجل').length,
    completed: requests.filter(r => r.status === 'completed').length,
    totalBudget: requests.reduce((sum, r) => sum + r.budget, 0),
    byCity: requests.reduce((acc, r) => {
      acc[r.city] = (acc[r.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byType: requests.reduce((acc, r) => {
      acc[r.propertyType] = (acc[r.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

/**
 * ✅ إضافة طلب جديد مع إشعار
 */
export function addRequest(requestData: Omit<PropertyRequest, 'id' | 'createdAt' | 'status'>): PropertyRequest {
  const newRequest: PropertyRequest = {
    id: `req-${Date.now()}`,
    ...requestData,
    createdAt: new Date(),
    status: 'active'
  };

  requestsDatabase.push(newRequest);
  
  // ✅ إشعار بطلب جديد
  try {
    const userId = requestData.userId || getCurrentUserId();
    NotificationsAPI.notifyRequestAdded(userId, newRequest);
  } catch (error) {
    console.error('Error sending notification:', error);
  }

  return newRequest;
}
