/**
 * 🔗 نظام إدارة العملاء المركزي
 * ====================================
 * 
 * هذا النظام مسؤول عن:
 * - إنشاء وتحديث بطاقات العملاء
 * - البحث عن العملاء برقم الجوال
 * - ربط العملاء بالإعلانات المنشورة
 * - التكامل مع نظام CRM
 * - ✅ الإشعارات التلقائية (مربوط)
 */

// ✅ استيراد نظام الإشعارات
import { NotificationsAPI } from '../api/notifications-real';

// ============================================================
// 🔧 HELPER FUNCTIONS
// ============================================================

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

// ============================================================
// 📊 TYPES & INTERFACES
// ============================================================

export type CustomerType = 'مالك' | 'مشتري' | 'مؤجر' | 'مستأجر' | 'تمويل' | 'آخر';
export type InterestLevel = 'passionate' | 'interested' | 'moderate' | 'limited' | 'not-interested';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  idNumber?: string; // رقم بطاقة الأحوال
  birthDate?: string;
  address?: string;
  city?: string;
  district?: string;
  
  // التصنيف
  category: CustomerType;
  interestLevel?: InterestLevel;
  tags?: string[];
  source?: string; // مصدر العميل (إعلان منشور، استفسار، إحالة، إلخ)
  
  // التواصل
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  twitter?: string;
  
  // التفاصيل
  notes?: string;
  preferredContact?: string;
  language?: string;
  
  // البيانات المالية
  budget?: string;
  paymentMethod?: string;
  creditScore?: number;
  
  // الملفات والوسائط
  mediaFiles?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    uploadedAt: string;
  }>;
  
  // النشاط
  lastContact?: string;
  nextFollowUp?: string;
  meetingsCount?: number;
  callsCount?: number;
  messagesCount?: number;
  
  // التواريخ
  createdAt: string;
  updatedAt: string;
  
  // الحالة
  status?: 'active' | 'inactive' | 'converted' | 'lost';
  
  // العلاقات
  assignedTo?: string; // معرف الوسيط المسؤول
  assignedToName?: string;
  
  // الإعلانات المرتبطة
  linkedAdsCount?: number; // عدد الإعلانات المنشورة لهذا العميل
  
  // إضافات من EnhancedBrokerCRM
  activities?: any[];
  activityLogs?: any[];
  
  // ✅ العروض والطلبات المستقبلة من نظام الملاك
  receivedOffers?: Array<{
    id: string;
    offerId: string;
    propertyType: string;
    propertyCategory: 'residential' | 'commercial';
    city: string;
    district?: string;
    area?: number;
    priceFrom?: number;
    priceTo?: number;
    description: string;
    features?: string[];
    transactionType: 'sale' | 'rent';
    offerType: 'offer' | 'request';
    userRole: 'seller' | 'lessor' | 'buyer' | 'tenant';
    commissionPercentage: number;
    serviceDescription: string;
    acceptedAt: string;
    ownerPhone?: string;
    ownerName?: string;
  }>;
  
  receivedRequests?: Array<{
    id: string;
    offerId: string;
    propertyType: string;
    propertyCategory: 'residential' | 'commercial';
    city: string;
    district?: string;
    area?: number;
    priceFrom?: number;
    priceTo?: number;
    description: string;
    features?: string[];
    transactionType: 'sale' | 'rent';
    offerType: 'offer' | 'request';
    userRole: 'seller' | 'lessor' | 'buyer' | 'tenant';
    commissionPercentage: number;
    serviceDescription: string;
    acceptedAt: string;
    ownerPhone?: string;
    ownerName?: string;
  }>;
  
  // ✅ علامة الإشعار
  hasNotification?: boolean;
}

// ============================================================
// 🔧 STORAGE KEYS
// ============================================================

const CUSTOMERS_STORAGE_KEY = 'crm_customers';

// ============================================================
// 📝 CORE FUNCTIONS
// ============================================================

/**
 * الحصول على جميع العملاء
 */
export function getAllCustomers(): Customer[] {
  try {
    const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
}

/**
 * حفظ جميع العملاء
 * ⚠️ هذه الدالة تحفظ العملاء بشكل مباشر - لا تستخدمها إلا إذا كنت متأكداً
 */
function saveAllCustomers(customers: Customer[]): void {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    // إطلاق حدث تحديث العملاء
    window.dispatchEvent(new Event('customersUpdated'));
  } catch (error) {
    console.error('Error saving customers:', error);
  }
}

/**
 * البحث عن عميل برقم الجوال
 */
export function findCustomerByPhone(phone: string): Customer | null {
  const customers = getAllCustomers();
  
  // تنظيف رقم الجوال للبحث (إزالة المسافات والرموز)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  return customers.find(c => {
    const customerCleanPhone = c.phone.replace(/[\s\-\(\)]/g, '');
    return customerCleanPhone === cleanPhone || 
           customerCleanPhone.endsWith(cleanPhone.slice(-9)) || // آخر 9 أرقام
           cleanPhone.endsWith(customerCleanPhone.slice(-9));
  }) || null;
}

/**
 * البحث عن عميل بالمعرف
 */
export function findCustomerById(id: string): Customer | null {
  const customers = getAllCustomers();
  return customers.find(c => c.id === id) || null;
}

/**
 * إنشاء عميل جديد
 */
export function createCustomer(customerData: Partial<Customer>): Customer {
  // ✅ قراءة جميع العملاء الموجودين (بما فيهم التجريبيين من EnhancedBrokerCRM)
  const customers = getAllCustomers();
  
  console.log('📊 [createCustomer] عدد العملاء الموجودين قبل الإضافة:', customers.length);
  
  // التحقق من عدم وجود العميل مسبقاً
  if (customerData.phone) {
    const existing = findCustomerByPhone(customerData.phone);
    if (existing) {
      console.log('✅ العميل موجود مسبقاً، إرجاع الموجود:', existing.id, existing.name);
      return existing;
    }
  }
  
  // إنشاء العميل الجديد
  const newCustomer: Customer = {
    id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: customerData.name || 'عميل جديد',
    phone: customerData.phone || '',
    email: customerData.email,
    company: customerData.company,
    idNumber: customerData.idNumber,
    birthDate: customerData.birthDate,
    address: customerData.address,
    city: customerData.city,
    district: customerData.district,
    category: customerData.category || 'آخر',
    interestLevel: customerData.interestLevel,
    tags: customerData.tags || [],
    source: customerData.source || 'إدخال يدوي',
    whatsapp: customerData.whatsapp || customerData.phone,
    telegram: customerData.telegram,
    instagram: customerData.instagram,
    twitter: customerData.twitter,
    notes: customerData.notes,
    preferredContact: customerData.preferredContact,
    language: customerData.language || 'ar',
    budget: customerData.budget,
    paymentMethod: customerData.paymentMethod,
    creditScore: customerData.creditScore,
    mediaFiles: customerData.mediaFiles || [],
    lastContact: customerData.lastContact,
    nextFollowUp: customerData.nextFollowUp,
    meetingsCount: 0,
    callsCount: 0,
    messagesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: customerData.status || 'active',
    assignedTo: customerData.assignedTo,
    assignedToName: customerData.assignedToName,
    linkedAdsCount: 0
  };
  
  // ✅ إضافة العميل الجديد للقائمة الموجودة (وليس استبدالها)
  customers.push(newCustomer);
  
  console.log('📊 [createCustomer] عدد العملاء بعد الإضافة:', customers.length);
  console.log('💾 [createCustomer] حفظ جميع العملاء في localStorage...');
  
  saveAllCustomers(customers);
  
  console.log('✅ تم إنشاء عميل جديد:', newCustomer.id, newCustomer.name);
  
  // ✅ إشعار بإضافة عميل جديد
  try {
    NotificationsAPI.notifyCustomerAdded(getCurrentUserId(), newCustomer);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
  
  return newCustomer;
}

/**
 * تحديث بيانات عميل
 */
export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
  const customers = getAllCustomers();
  const index = customers.findIndex(c => c.id === id);
  
  if (index === -1) {
    console.error('Customer not found:', id);
    return null;
  }
  
  // تحديث البيانات
  customers[index] = {
    ...customers[index],
    ...updates,
    id: customers[index].id, // الحفاظ على المعرف
    createdAt: customers[index].createdAt, // الحفاظ على تاريخ الإنشاء
    updatedAt: new Date().toISOString()
  };
  
  saveAllCustomers(customers);
  
  console.log('✅ تم تحديث بيانات العميل:', id);
  
  // ✅ إشعار بتحديث بيانات العميل
  try {
    const changes = Object.keys(updates).filter(key => 
      key !== 'id' && key !== 'createdAt' && key !== 'updatedAt'
    );
    
    if (changes.length > 0) {
      // ترجمة أسماء الحقول للعربية
      const arabicChanges = changes.map(key => {
        const translations: Record<string, string> = {
          'name': 'الاسم',
          'phone': 'الجوال',
          'email': 'البريد الإلكتروني',
          'category': 'التصنيف',
          'status': 'الحالة',
          'notes': 'الملاحظات',
          'budget': 'الميزانية',
          'address': 'العنوان',
          'city': 'المدينة',
          'district': 'الحي'
        };
        return translations[key] || key;
      });
      
      NotificationsAPI.notifyCustomerUpdated(getCurrentUserId(), customers[index], arabicChanges);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
  
  return customers[index];
}

/**
 * حذف عميل
 */
export function deleteCustomer(id: string): boolean {
  const customers = getAllCustomers();
  const filtered = customers.filter(c => c.id !== id);
  
  if (filtered.length === customers.length) {
    console.error('Customer not found:', id);
    return false;
  }
  
  saveAllCustomers(filtered);
  
  console.log('✅ تم حذف العميل:', id);
  
  return true;
}

/**
 * ضمان وجود عميل (إنشاء أو تحديث)
 * هذه الدالة تستخدم عند حفظ إعلان منشور
 */
export function ensureCustomerExists(customerData: {
  phone: string;
  name?: string;
  idNumber?: string;
  category?: CustomerType;
  source?: string;
  [key: string]: any;
}): Customer {
  // البحث عن العميل
  let customer = findCustomerByPhone(customerData.phone);
  
  if (customer) {
    // تحديث البيانات إذا كان موجوداً
    const updates: Partial<Customer> = {
      name: customerData.name || customer.name,
      idNumber: customerData.idNumber || customer.idNumber,
      category: customerData.category || customer.category,
      source: customerData.source || customer.source,
      linkedAdsCount: (customer.linkedAdsCount || 0) + 1
    };
    
    // إضافة أي حقول إضافية
    Object.keys(customerData).forEach(key => {
      if (key !== 'phone' && customerData[key] !== undefined) {
        updates[key as keyof Customer] = customerData[key];
      }
    });
    
    return updateCustomer(customer.id, updates) || customer;
  } else {
    // إنشاء عميل جديد
    return createCustomer({
      ...customerData,
      category: customerData.category || 'مالك',
      source: customerData.source || 'إعلان منشور',
      linkedAdsCount: 1
    });
  }
}

/**
 * زيادة عدد الإعلانات المرتبطة بالعميل
 */
export function incrementCustomerAdsCount(phone: string): void {
  const customer = findCustomerByPhone(phone);
  if (customer) {
    updateCustomer(customer.id, {
      linkedAdsCount: (customer.linkedAdsCount || 0) + 1
    });
  }
}

/**
 * البحث عن العملاء بالاسم أو الجوال
 */
export function searchCustomers(query: string): Customer[] {
  const customers = getAllCustomers();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return customers;
  }
  
  return customers.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.phone.includes(lowerQuery) ||
    c.email?.toLowerCase().includes(lowerQuery) ||
    c.company?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * الحصول على عدد العملاء
 */
export function getCustomersCount(): number {
  return getAllCustomers().length;
}

/**
 * تصدير العملاء (للنسخ الاحتياطي)
 */
export function exportCustomers(): string {
  return JSON.stringify(getAllCustomers(), null, 2);
}

/**
 * استيراد العملاء (من نسخة احتياطية)
 */
export function importCustomers(jsonData: string): boolean {
  try {
    const customers = JSON.parse(jsonData);
    if (Array.isArray(customers)) {
      saveAllCustomers(customers);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing customers:', error);
    return false;
  }
}