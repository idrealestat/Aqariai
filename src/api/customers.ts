/**
 * 🔌 Real API - إدارة العملاء (CRM)
 * 
 * API حقيقي متصل مباشرة مع customersManager.ts
 */

import { 
  getAllCustomers, 
  findCustomerById, 
  createCustomer as addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  searchCustomers,
  assignCustomerToAgent
} from '../utils/customersManager';

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

/**
 * معالج الطلبات - CRM
 */
export default async function handler(req: Request, res: Response) {
  const { method, url, body, query } = req;

  try {
    // GET /api/customers/search?q=...
    if (method === 'GET' && url.includes('/search')) {
      const searchQuery = query?.q || '';
      const results = searchCustomers(searchQuery);
      
      return res.status(200).json({
        success: true,
        data: results,
        count: results.length
      });
    }

    // GET /api/customers/:id
    if (method === 'GET' && url.includes('/customers/') && !url.includes('/search')) {
      const id = url.split('/').pop();
      const customer = findCustomerById(id!);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'العميل غير موجود'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: customer
      });
    }

    // GET /api/customers (جميع العملاء)
    if (method === 'GET') {
      const customers = getAllCustomers();
      
      return res.status(200).json({
        success: true,
        data: customers,
        count: customers.length
      });
    }

    // POST /api/customers (إضافة عميل)
    if (method === 'POST') {
      const newCustomer = body;
      
      if (!newCustomer.name || !newCustomer.phone) {
        return res.status(400).json({
          success: false,
          error: 'الاسم ورقم الهاتف مطلوبان'
        });
      }
      
      const customer = addCustomer(newCustomer);
      
      return res.status(201).json({
        success: true,
        data: customer,
        message: 'تم إضافة العميل بنجاح'
      });
    }

    // PUT /api/customers/:id (تحديث عميل)
    if (method === 'PUT') {
      const id = url.split('/').pop();
      const updates = body;
      
      const updated = updateCustomer(id!, updates);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'العميل غير موجود'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updated,
        message: 'تم تحديث العميل بنجاح'
      });
    }

    // DELETE /api/customers/:id (حذف عميل)
    if (method === 'DELETE') {
      const id = url.split('/').pop();
      
      const deleted = deleteCustomer(id!);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'العميل غير موجود'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'تم حذف العميل بنجاح'
      });
    }

    // POST /api/customers/:id/assign (تعيين عميل)
    if (method === 'POST' && url.includes('/assign')) {
      const id = url.split('/')[3]; // /api/customers/:id/assign
      const { agentId } = body;
      
      if (!agentId) {
        return res.status(400).json({
          success: false,
          error: 'معرف الوكيل مطلوب'
        });
      }
      
      const assigned = assignCustomerToAgent(id, agentId);
      
      if (!assigned) {
        return res.status(404).json({
          success: false,
          error: 'العميل غير موجود'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: assigned,
        message: 'تم تعيين العميل بنجاح'
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'طريقة غير مسموحة'
    });

  } catch (error) {
    console.error('CRM API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطأ في الخادم',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Helper function لاستخراج ID من URL
 */
function extractId(url: string): string | null {
  const parts = url.split('/');
  const id = parts[parts.length - 1];
  return id && id !== 'customers' ? id : null;
}

/**
 * أمثلة الاستخدام:
 * 
 * // البحث
 * GET /api/customers/search?q=أحمد
 * 
 * // الحصول على عميل
 * GET /api/customers/customer-123
 * 
 * // إضافة عميل
 * POST /api/customers
 * Body: { name: "أحمد", phone: "0501234567", type: "buyer" }
 * 
 * // تحديث عميل
 * PUT /api/customers/customer-123
 * Body: { status: "qualified" }
 * 
 * // حذف عميل
 * DELETE /api/customers/customer-123
 * 
 * // تعيين عميل
 * POST /api/customers/customer-123/assign
 * Body: { agentId: "agent-456" }
 */
