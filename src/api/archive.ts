/*
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                           📦 Archive API - نظام الأرشيف                              ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

📋 الوصف: API حقيقي لإدارة الأرشيف (المستندات، العقود، التقارير، الصور)
📅 تاريخ الإنشاء: 4 نوفمبر 2025
🔗 مرتبط بـ: /components/archive.tsx, /components/ArchivePage.tsx
*/

// ============================================
// Types & Interfaces
// ============================================

export type ArchiveItemType =
  | 'contract'      // عقد
  | 'report'        // تقرير
  | 'document'      // مستند
  | 'image'         // صورة
  | 'video'         // فيديو
  | 'list'          // قائمة
  | 'message'       // رسائل
  | 'offer'         // عرض
  | 'request'       // طلب
  | 'other';        // أخرى

export type ArchiveCategory =
  | 'contracts'     // العقود
  | 'reports'       // التقارير
  | 'clients'       // العملاء
  | 'properties'    // العقارات
  | 'messages'      // المراسلات
  | 'financial'     // المالية
  | 'marketing'     // التسويق
  | 'legal'         // القانونية
  | 'other';        // أخرى

export type ArchiveStatus =
  | 'active'        // نشط
  | 'archived'      // مؤرشف
  | 'deleted'       // محذوف
  | 'pending';      // قيد الانتظار

export interface ArchiveItem {
  id: string;
  userId: string;
  
  // معلومات أساسية
  name: string;
  description?: string;
  type: ArchiveItemType;
  category: ArchiveCategory;
  
  // الملفات
  files: ArchiveFile[];
  
  // البيانات الوصفية
  tags: string[];
  metadata: {
    [key: string]: any;
  };
  
  // الحالة والتواريخ
  status: ArchiveStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  expiresAt?: string;
  
  // الأذونات والمشاركة
  isPublic: boolean;
  sharedWith?: string[];
  
  // معلومات إضافية
  relatedTo?: {
    type: 'customer' | 'property' | 'deal' | 'offer' | 'request';
    id: string;
  };
  
  // الإحصائيات
  views: number;
  downloads: number;
}

export interface ArchiveFile {
  id: string;
  name: string;
  url: string;
  type: string; // MIME type
  size: number; // بالبايت
  thumbnail?: string;
  uploadedAt: string;
}

export interface ArchiveCreateRequest {
  userId: string;
  name: string;
  description?: string;
  type: ArchiveItemType;
  category: ArchiveCategory;
  files: ArchiveFile[];
  tags?: string[];
  metadata?: { [key: string]: any };
  relatedTo?: {
    type: 'customer' | 'property' | 'deal' | 'offer' | 'request';
    id: string;
  };
}

export interface ArchiveSearchQuery {
  userId: string;
  query?: string;
  type?: ArchiveItemType;
  category?: ArchiveCategory;
  status?: ArchiveStatus;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  relatedTo?: {
    type: string;
    id: string;
  };
}

export interface ArchiveStats {
  userId: string;
  totalItems: number;
  totalSize: number; // بالبايت
  itemsByType: { type: ArchiveItemType; count: number }[];
  itemsByCategory: { category: ArchiveCategory; count: number }[];
  recentItems: ArchiveItem[];
  popularTags: { tag: string; count: number }[];
}

// ============================================
// Mock Database
// ============================================

let archiveDB: Map<string, ArchiveItem> = new Map();

// ============================================
// Helper Functions
// ============================================

function generateId(): string {
  return `archive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// Sample Data Generator
// ============================================

function generateSampleArchive(userId: string): void {
  const sampleItems: Omit<ArchiveItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'عقد بيع فيلا الرياض',
      description: 'عقد بيع فيلا في حي الملقا بالرياض',
      type: 'contract',
      category: 'contracts',
      files: [{
        id: 'file_1',
        name: 'contract_villa_riyadh.pdf',
        url: '/files/contract_villa_riyadh.pdf',
        type: 'application/pdf',
        size: 2400000, // 2.3 MB
        uploadedAt: new Date('2024-01-15').toISOString()
      }],
      tags: ['عقد', 'بيع', 'فيلا', 'الرياض'],
      metadata: { propertyType: 'villa', city: 'Riyadh', price: 2500000 },
      status: 'archived',
      archivedAt: new Date('2024-01-20').toISOString(),
      isPublic: false,
      views: 15,
      downloads: 3
    },
    {
      name: 'تقرير مبيعات يناير 2024',
      description: 'تقرير شامل لجميع عمليات البيع في شهر يناير',
      type: 'report',
      category: 'reports',
      files: [{
        id: 'file_2',
        name: 'sales_report_jan_2024.xlsx',
        url: '/files/sales_report_jan_2024.xlsx',
        type: 'application/vnd.ms-excel',
        size: 1800000, // 1.8 MB
        uploadedAt: new Date('2024-01-31').toISOString()
      }],
      tags: ['تقرير', 'مبيعات', 'يناير'],
      metadata: { month: 'January', year: 2024, totalSales: 45 },
      status: 'archived',
      archivedAt: new Date('2024-02-01').toISOString(),
      isPublic: false,
      views: 28,
      downloads: 8
    },
    {
      name: 'قائمة عملاء VIP',
      description: 'قائمة العملاء المميزين والأكثر تعاملاً',
      type: 'list',
      category: 'clients',
      files: [{
        id: 'file_3',
        name: 'vip_clients_list.pdf',
        url: '/files/vip_clients_list.pdf',
        type: 'application/pdf',
        size: 500000, // 0.5 MB
        uploadedAt: new Date('2024-01-10').toISOString()
      }],
      tags: ['عملاء', 'VIP', 'قائمة'],
      metadata: { totalClients: 35, tier: 'VIP' },
      status: 'archived',
      archivedAt: new Date('2024-01-11').toISOString(),
      isPublic: false,
      views: 42,
      downloads: 12
    },
    {
      name: 'صور عقار شقة النخيل',
      description: 'مجموعة صور احترافية للشقة',
      type: 'image',
      category: 'properties',
      files: [
        {
          id: 'file_4_1',
          name: 'property_img_1.jpg',
          url: '/files/property_img_1.jpg',
          type: 'image/jpeg',
          size: 5000000, // 5 MB
          thumbnail: '/thumbnails/property_img_1.jpg',
          uploadedAt: new Date('2024-01-05').toISOString()
        },
        {
          id: 'file_4_2',
          name: 'property_img_2.jpg',
          url: '/files/property_img_2.jpg',
          type: 'image/jpeg',
          size: 4800000, // 4.8 MB
          thumbnail: '/thumbnails/property_img_2.jpg',
          uploadedAt: new Date('2024-01-05').toISOString()
        }
      ],
      tags: ['صور', 'عقار', 'شقة'],
      metadata: { propertyType: 'apartment', rooms: 3, area: 180 },
      status: 'archived',
      archivedAt: new Date('2024-01-06').toISOString(),
      isPublic: true,
      views: 156,
      downloads: 23
    },
    {
      name: 'مراسلات عميل أحمد محمد',
      description: 'سجل كامل للمحادثات والمراسلات',
      type: 'message',
      category: 'messages',
      files: [{
        id: 'file_5',
        name: 'messages_ahmed_mohamed.txt',
        url: '/files/messages_ahmed_mohamed.txt',
        type: 'text/plain',
        size: 800000, // 0.8 MB
        uploadedAt: new Date('2023-12-28').toISOString()
      }],
      tags: ['مراسلات', 'عميل', 'أحمد'],
      metadata: { clientName: 'أحمد محمد', totalMessages: 234 },
      status: 'archived',
      archivedAt: new Date('2024-01-02').toISOString(),
      isPublic: false,
      views: 8,
      downloads: 2
    }
  ];

  const now = new Date().toISOString();
  
  sampleItems.forEach((item) => {
    const archiveItem: ArchiveItem = {
      ...item,
      id: generateId(),
      userId,
      createdAt: item.archivedAt || now,
      updatedAt: now
    };
    
    archiveDB.set(archiveItem.id, archiveItem);
  });
}

// ============================================
// API Functions
// ============================================

/**
 * إنشاء عنصر أرشيف جديد
 */
export async function createArchiveItem(data: ArchiveCreateRequest): Promise<ArchiveItem> {
  try {
    const itemId = generateId();
    const now = new Date().toISOString();
    
    const newItem: ArchiveItem = {
      id: itemId,
      userId: data.userId,
      name: data.name,
      description: data.description,
      type: data.type,
      category: data.category,
      files: data.files,
      tags: data.tags || [],
      metadata: data.metadata || {},
      status: 'active',
      createdAt: now,
      updatedAt: now,
      isPublic: false,
      views: 0,
      downloads: 0,
      relatedTo: data.relatedTo
    };
    
    archiveDB.set(itemId, newItem);
    
    console.log('✅ تم إنشاء عنصر الأرشيف:', itemId);
    
    return newItem;
  } catch (error) {
    console.error('❌ خطأ في إنشاء عنصر الأرشيف:', error);
    throw new Error('فشل إنشاء عنصر الأرشيف');
  }
}

/**
 * الحصول على عنصر أرشيف
 */
export async function getArchiveItem(itemId: string): Promise<ArchiveItem | null> {
  try {
    const item = archiveDB.get(itemId);
    
    if (item) {
      // تحديث عدد المشاهدات
      item.views++;
      archiveDB.set(itemId, item);
    }
    
    return item || null;
  } catch (error) {
    console.error('❌ خطأ في جلب عنصر الأرشيف:', error);
    return null;
  }
}

/**
 * الحصول على عناصر الأرشيف للمستخدم
 */
export async function getUserArchive(
  userId: string,
  options?: {
    status?: ArchiveStatus;
    limit?: number;
    offset?: number;
  }
): Promise<ArchiveItem[]> {
  try {
    // إنشاء بيانات تجريبية إذا كان الأرشيف فارغ
    const existingItems = Array.from(archiveDB.values()).filter(
      item => item.userId === userId
    );
    
    if (existingItems.length === 0) {
      generateSampleArchive(userId);
    }
    
    let items = Array.from(archiveDB.values()).filter(
      item => item.userId === userId
    );
    
    if (options?.status) {
      items = items.filter(item => item.status === options.status);
    }
    
    // ترتيب حسب التاريخ (الأحدث أولاً)
    items.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    // تطبيق الحد والإزاحة
    if (options?.offset !== undefined || options?.limit !== undefined) {
      const offset = options.offset || 0;
      const limit = options.limit || items.length;
      items = items.slice(offset, offset + limit);
    }
    
    return items;
  } catch (error) {
    console.error('❌ خطأ في جلب الأرشيف:', error);
    return [];
  }
}

/**
 * البحث في الأرشيف
 */
export async function searchArchive(query: ArchiveSearchQuery): Promise<ArchiveItem[]> {
  try {
    let items = Array.from(archiveDB.values()).filter(
      item => item.userId === query.userId
    );
    
    // البحث بالنص
    if (query.query) {
      const searchLower = query.query.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // الفلترة بالنوع
    if (query.type) {
      items = items.filter(item => item.type === query.type);
    }
    
    // الفلترة بالفئة
    if (query.category) {
      items = items.filter(item => item.category === query.category);
    }
    
    // الفلترة بالحالة
    if (query.status) {
      items = items.filter(item => item.status === query.status);
    }
    
    // الفلترة بالتاريخ
    if (query.dateFrom) {
      items = items.filter(item => 
        new Date(item.createdAt) >= new Date(query.dateFrom!)
      );
    }
    
    if (query.dateTo) {
      items = items.filter(item => 
        new Date(item.createdAt) <= new Date(query.dateTo!)
      );
    }
    
    // الفلترة بالعلاقة
    if (query.relatedTo) {
      items = items.filter(item =>
        item.relatedTo?.type === query.relatedTo!.type &&
        item.relatedTo?.id === query.relatedTo!.id
      );
    }
    
    return items;
  } catch (error) {
    console.error('❌ خطأ في البحث في الأرشيف:', error);
    return [];
  }
}

/**
 * تحديث عنصر الأرشيف
 */
export async function updateArchiveItem(
  itemId: string,
  updates: Partial<ArchiveItem>
): Promise<ArchiveItem | null> {
  try {
    const item = archiveDB.get(itemId);
    if (!item) {
      throw new Error('العنصر غير موجود');
    }
    
    const updatedItem: ArchiveItem = {
      ...item,
      ...updates,
      id: item.id, // الحفاظ على الـ ID
      userId: item.userId, // الحفاظ على userId
      updatedAt: new Date().toISOString()
    };
    
    archiveDB.set(itemId, updatedItem);
    
    console.log('✅ تم تحديث عنصر الأرشيف:', itemId);
    
    return updatedItem;
  } catch (error) {
    console.error('❌ خطأ في تحديث عنصر الأرشيف:', error);
    return null;
  }
}

/**
 * أرشفة عنصر
 */
export async function archiveItem(itemId: string): Promise<ArchiveItem | null> {
  try {
    return await updateArchiveItem(itemId, {
      status: 'archived',
      archivedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ خطأ في أرشفة العنصر:', error);
    return null;
  }
}

/**
 * استعادة عنصر من الأرشيف
 */
export async function restoreItem(itemId: string): Promise<ArchiveItem | null> {
  try {
    return await updateArchiveItem(itemId, {
      status: 'active',
      archivedAt: undefined
    });
  } catch (error) {
    console.error('❌ خطأ في استعادة العنصر:', error);
    return null;
  }
}

/**
 * حذف عنصر
 */
export async function deleteArchiveItem(itemId: string, soft: boolean = true): Promise<boolean> {
  try {
    if (soft) {
      // حذف ناعم - تغيير الحالة فقط
      const updated = await updateArchiveItem(itemId, {
        status: 'deleted'
      });
      return updated !== null;
    } else {
      // حذف نهائي
      const deleted = archiveDB.delete(itemId);
      if (deleted) {
        console.log('✅ تم حذف عنصر الأرشيف نهائياً:', itemId);
      }
      return deleted;
    }
  } catch (error) {
    console.error('❌ خطأ في حذف عنصر الأرشيف:', error);
    return false;
  }
}

/**
 * تحميل ملف
 */
export async function downloadFile(itemId: string, fileId: string): Promise<{ success: boolean; url?: string }> {
  try {
    const item = archiveDB.get(itemId);
    if (!item) {
      return { success: false };
    }
    
    const file = item.files.find(f => f.id === fileId);
    if (!file) {
      return { success: false };
    }
    
    // تحديث عدد التحميلات
    item.downloads++;
    archiveDB.set(itemId, item);
    
    console.log('✅ تم تحميل الملف:', file.name);
    
    return {
      success: true,
      url: file.url
    };
  } catch (error) {
    console.error('❌ خطأ في تحميل الملف:', error);
    return { success: false };
  }
}

/**
 * الحصول على إحصائيات الأرشيف
 */
export async function getArchiveStats(userId: string): Promise<ArchiveStats> {
  try {
    const items = await getUserArchive(userId);
    
    const totalSize = items.reduce((sum, item) => 
      sum + item.files.reduce((fileSum, file) => fileSum + file.size, 0), 
      0
    );
    
    // حساب العناصر حسب النوع
    const itemsByType = Object.values(
      items.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = { type: item.type, count: 0 };
        }
        acc[item.type].count++;
        return acc;
      }, {} as Record<string, { type: ArchiveItemType; count: number }>)
    );
    
    // حساب العناصر حسب الفئة
    const itemsByCategory = Object.values(
      items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { category: item.category, count: 0 };
        }
        acc[item.category].count++;
        return acc;
      }, {} as Record<string, { category: ArchiveCategory; count: number }>)
    );
    
    // الحصول على أحدث العناصر
    const recentItems = items.slice(0, 5);
    
    // حساب الوسوم الشائعة
    const tagCounts: Record<string, number> = {};
    items.forEach(item => {
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      userId,
      totalItems: items.length,
      totalSize,
      itemsByType,
      itemsByCategory,
      recentItems,
      popularTags
    };
  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات الأرشيف:', error);
    return {
      userId,
      totalItems: 0,
      totalSize: 0,
      itemsByType: [],
      itemsByCategory: [],
      recentItems: [],
      popularTags: []
    };
  }
}

// ============================================
// Export All Functions
// ============================================

export const ArchiveAPI = {
  create: createArchiveItem,
  get: getArchiveItem,
  getUserArchive,
  search: searchArchive,
  update: updateArchiveItem,
  archive: archiveItem,
  restore: restoreItem,
  delete: deleteArchiveItem,
  downloadFile,
  getStats: getArchiveStats,
  
  // Helper
  formatFileSize
};

export default ArchiveAPI;
