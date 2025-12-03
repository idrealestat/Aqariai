/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔌 API Clients - التغليف النهائي لاستدعاءات الـ API الحقيقية
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * هذا الملف يوفر واجهة موحدة للتعامل مع جميع APIs في النظام
 * 
 * المميزات:
 * - استدعاءات API حقيقية
 * - معالجة الأخطاء
 * - دعم جميع Endpoints
 * 
 * تاريخ الإنشاء: 5 نوفمبر 2025
 * آخر تحديث: 5 نوفمبر 2025
 * ═══════════════════════════════════════════════════════════════════════════
 */

const API_BASE = '/api';

/**
 * دالة مساعدة لـ GET requests
 */
async function apiGet(path: string, params?: Record<string, any>) {
  const url = new URL(
    API_BASE + path, 
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  );
  
  if (params) {
    Object.keys(params).forEach(k => url.searchParams.append(k, String(params[k])));
  }
  
  const res = await fetch(url.toString(), { 
    method: 'GET', 
    credentials: 'same-origin' 
  });
  
  if (!res.ok) {
    throw new Error(`GET ${path} failed ${res.status}`);
  }
  
  return res.json();
}

/**
 * دالة مساعدة لـ POST requests
 */
async function apiPost(path: string, body: any) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`POST ${path} failed ${res.status} - ${txt}`);
  }
  
  return res.json();
}

// ═══════════════════════════════════════════════════════════════════════════
// 📇 CUSTOMERS API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * البحث عن العملاء بالاسم
 * @param name - الاسم للبحث
 * @returns قائمة العملاء المطابقين
 */
export async function searchCustomersAPI(name: string) {
  if (!name) return [];
  
  try {
    // استخدام customersManager مباشرة
    const { searchCustomers } = await import('../utils/customersManager');
    return searchCustomers(name);
  } catch (error) {
    console.error('searchCustomersAPI error:', error);
    return [];
  }
}

/**
 * جلب عميل بالمعرف
 * @param id - معرف العميل
 * @returns بيانات العميل أو null
 */
export async function getCustomerByIdAPI(id: string) {
  if (!id) return null;
  
  try {
    const { findCustomerById } = await import('../utils/customersManager');
    return findCustomerById(id);
  } catch (error) {
    console.error('getCustomerByIdAPI error:', error);
    return null;
  }
}

/**
 * إنشاء عميل جديد
 * @param payload - بيانات العميل
 * @returns العميل المُنشأ
 */
export async function createCustomerAPI(payload: any) {
  try {
    const { createCustomer } = await import('../utils/customersManager');
    return createCustomer(payload);
  } catch (error) {
    console.error('createCustomerAPI error:', error);
    throw error;
  }
}

/**
 * تحديث بيانات عميل
 * @param id - معرف العميل
 * @param payload - البيانات المحدثة
 * @returns العميل المحدث
 */
export async function updateCustomerAPI(id: string, payload: any) {
  try {
    const { updateCustomer } = await import('../utils/customersManager');
    return updateCustomer(id, payload);
  } catch (error) {
    console.error('updateCustomerAPI error:', error);
    throw error;
  }
}

/**
 * حذف عميل
 * @param id - معرف العميل
 * @returns true إذا تم الحذف بنجاح
 */
export async function deleteCustomerAPI(id: string) {
  try {
    const { deleteCustomer } = await import('../utils/customersManager');
    return deleteCustomer(id);
  } catch (error) {
    console.error('deleteCustomerAPI error:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📅 APPOINTMENTS API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * إنشاء موعد جديد
 * @param payload - بيانات الموعد
 * @returns الموعد المُنشأ
 */
export async function createAppointmentAPI(payload: any) {
  try {
    const CalendarAPI = await import('../api/calendar');
    return await CalendarAPI.createAppointment(payload);
  } catch (error) {
    console.error('createAppointmentAPI error:', error);
    throw error;
  }
}

/**
 * جلب موعد بالمعرف
 * @param id - معرف الموعد
 * @returns بيانات الموعد أو null
 */
export async function getAppointmentByIdAPI(id: string) {
  try {
    const CalendarAPI = await import('../api/calendar');
    return await CalendarAPI.getAppointmentById(id);
  } catch (error) {
    console.error('getAppointmentByIdAPI error:', error);
    return null;
  }
}

/**
 * جلب مواعيد اليوم
 * @returns قائمة المواعيد
 */
export async function getTodayAppointmentsAPI() {
  try {
    const CalendarAPI = await import('../api/calendar');
    return CalendarAPI.getTodayAppointments();
  } catch (error) {
    console.error('getTodayAppointmentsAPI error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 ARCHIVE API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * البحث في الأرشيف
 * @param query - نص البحث
 * @returns نتائج البحث
 */
export async function searchArchiveAPI(query: string) {
  try {
    const ArchiveAPI = await import('../api/archive');
    return await ArchiveAPI.searchArchive({
      userId: 'current-user',
      query: query
    });
  } catch (error) {
    console.error('searchArchiveAPI error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏠 OFFERS API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * البحث في العروض
 * @param q - نص البحث
 * @returns نتائج البحث
 */
export async function searchOffersAPI(q: string) {
  try {
    // العروض معطلة مؤقتاً - نرجع مصفوفة فارغة
    console.warn('Offers API temporarily disabled');
    return [];
  } catch (error) {
    console.error('searchOffersAPI error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 REQUESTS API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * البحث في الطلبات
 * @param q - نص البحث
 * @returns نتائج البحث
 */
export async function searchRequestsAPI(q: string) {
  try {
    const { searchRequests } = await import('../api/requests');
    return searchRequests(q);
  } catch (error) {
    console.error('searchRequestsAPI error:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 ANALYTICS API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * جلب ملخص التحليلات
 * @returns بيانات التحليلات
 */
export async function analyticsSummaryAPI() {
  try {
    const { getQuickStats } = await import('../api/analytics');
    return await getQuickStats();
  } catch (error) {
    console.error('analyticsSummaryAPI error:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📤 EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Customers
  searchCustomersAPI,
  getCustomerByIdAPI,
  createCustomerAPI,
  updateCustomerAPI,
  deleteCustomerAPI,
  
  // Appointments
  createAppointmentAPI,
  getAppointmentByIdAPI,
  getTodayAppointmentsAPI,
  
  // Archive
  searchArchiveAPI,
  
  // Offers
  searchOffersAPI,
  
  // Requests
  searchRequestsAPI,
  
  // Analytics
  analyticsSummaryAPI
};
