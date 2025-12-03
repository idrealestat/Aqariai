/*
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                     🎴 Business Card API - بطاقة الأعمال الرقمية                    ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

📋 الوصف: API حقيقي لإدارة بطاقات الأعمال الرقمية
📅 تاريخ الإنشاء: 4 نوفمبر 2025
🔗 مرتبط بـ: /components/business-card-profile.tsx
*/

// ============================================
// Types & Interfaces
// ============================================

export interface BusinessCard {
  id: string;
  userId: string;
  // معلومات أساسية
  name: string;
  title?: string;
  companyName?: string;
  licenseNumber?: string;
  
  // معلومات التواصل
  phone: string;
  email: string;
  whatsapp?: string;
  website?: string;
  
  // العنوان
  city?: string;
  district?: string;
  fullAddress?: string;
  
  // وسائل التواصل الاجتماعي
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    snapchat?: string;
    tiktok?: string;
  };
  
  // معلومات إضافية
  bio?: string;
  specialties?: string[];
  achievements?: string[];
  
  // الصورة والشعار
  profileImage?: string;
  companyLogo?: string;
  backgroundImage?: string;
  
  // الإعدادات
  theme?: 'royal-green' | 'modern' | 'classic' | 'gradient';
  isPublic?: boolean;
  showStats?: boolean;
  
  // الإحصائيات
  stats?: {
    totalSales: number;
    activeListings: number;
    yearsExperience: number;
    clientSatisfaction: number;
  };
  
  // البيانات الوصفية
  createdAt: string;
  updatedAt: string;
  views?: number;
  shares?: number;
}

export interface BusinessCardCreateRequest {
  userId: string;
  name: string;
  phone: string;
  email: string;
  [key: string]: any;
}

export interface BusinessCardUpdateRequest {
  [key: string]: any;
}

export interface BusinessCardShareData {
  cardId: string;
  shareMethod: 'link' | 'qr' | 'whatsapp' | 'email' | 'sms';
  recipientInfo?: string;
}

export interface BusinessCardStats {
  cardId: string;
  views: number;
  shares: number;
  contacts: number;
  topSource: string;
  viewsByDay: { date: string; count: number }[];
  sharesByMethod: { method: string; count: number }[];
}

// ============================================
// Mock Database (سيتم استبداله بـ Supabase لاحقاً)
// ============================================

let businessCardsDB: Map<string, BusinessCard> = new Map();
let statsDB: Map<string, BusinessCardStats> = new Map();

// ============================================
// Helper Functions
// ============================================

function generateId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateShareLink(cardId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aqar-crm.com';
  return `${baseUrl}/card/${cardId}`;
}

function generateQRCode(cardId: string): string {
  // في الإنتاج، سيتم استخدام مكتبة QR code حقيقية
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generateShareLink(cardId))}`;
}

// ============================================
// API Functions
// ============================================

/**
 * إنشاء بطاقة أعمال جديدة
 */
export async function createBusinessCard(data: BusinessCardCreateRequest): Promise<BusinessCard> {
  try {
    const cardId = generateId();
    const now = new Date().toISOString();
    
    const newCard: BusinessCard = {
      id: cardId,
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      title: data.title,
      companyName: data.companyName,
      licenseNumber: data.licenseNumber,
      city: data.city,
      district: data.district,
      fullAddress: data.fullAddress,
      whatsapp: data.whatsapp,
      website: data.website,
      socialMedia: data.socialMedia,
      bio: data.bio,
      specialties: data.specialties || [],
      achievements: data.achievements || [],
      profileImage: data.profileImage,
      companyLogo: data.companyLogo,
      backgroundImage: data.backgroundImage,
      theme: data.theme || 'royal-green',
      isPublic: data.isPublic !== false,
      showStats: data.showStats !== false,
      stats: data.stats || {
        totalSales: 0,
        activeListings: 0,
        yearsExperience: 0,
        clientSatisfaction: 95
      },
      createdAt: now,
      updatedAt: now,
      views: 0,
      shares: 0
    };
    
    businessCardsDB.set(cardId, newCard);
    
    // إنشاء سجل إحصائيات
    const stats: BusinessCardStats = {
      cardId,
      views: 0,
      shares: 0,
      contacts: 0,
      topSource: 'direct',
      viewsByDay: [],
      sharesByMethod: []
    };
    statsDB.set(cardId, stats);
    
    console.log('✅ تم إنشاء بطاقة الأعمال:', cardId);
    
    return newCard;
  } catch (error) {
    console.error('❌ خطأ في إنشاء بطاقة الأعمال:', error);
    throw new Error('فشل إنشاء بطاقة الأعمال');
  }
}

/**
 * الحصول على بطاقة أعمال بواسطة ID
 */
export async function getBusinessCard(cardId: string): Promise<BusinessCard | null> {
  try {
    const card = businessCardsDB.get(cardId);
    
    if (card) {
      // تحديث عدد المشاهدات
      card.views = (card.views || 0) + 1;
      businessCardsDB.set(cardId, card);
      
      // تحديث الإحصائيات
      const stats = statsDB.get(cardId);
      if (stats) {
        stats.views++;
        const today = new Date().toISOString().split('T')[0];
        const todayStats = stats.viewsByDay.find(d => d.date === today);
        if (todayStats) {
          todayStats.count++;
        } else {
          stats.viewsByDay.push({ date: today, count: 1 });
        }
        statsDB.set(cardId, stats);
      }
    }
    
    return card || null;
  } catch (error) {
    console.error('❌ خطأ في جلب بطاقة الأعمال:', error);
    return null;
  }
}

/**
 * الحصول على بطاقة أعمال بواسطة userId
 */
export async function getBusinessCardByUserId(userId: string): Promise<BusinessCard | null> {
  try {
    for (const card of businessCardsDB.values()) {
      if (card.userId === userId) {
        return card;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ خطأ في جلب بطاقة الأعمال:', error);
    return null;
  }
}

/**
 * تحديث بطاقة الأعمال
 */
export async function updateBusinessCard(
  cardId: string,
  updates: BusinessCardUpdateRequest
): Promise<BusinessCard | null> {
  try {
    const card = businessCardsDB.get(cardId);
    if (!card) {
      throw new Error('البطاقة غير موجودة');
    }
    
    const updatedCard: BusinessCard = {
      ...card,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    businessCardsDB.set(cardId, updatedCard);
    
    console.log('✅ تم تحديث بطاقة الأعمال:', cardId);
    
    return updatedCard;
  } catch (error) {
    console.error('❌ خطأ في تحديث بطاقة الأعمال:', error);
    return null;
  }
}

/**
 * حذف بطاقة الأعمال
 */
export async function deleteBusinessCard(cardId: string): Promise<boolean> {
  try {
    const deleted = businessCardsDB.delete(cardId);
    statsDB.delete(cardId);
    
    if (deleted) {
      console.log('✅ تم حذف بطاقة الأعمال:', cardId);
    }
    
    return deleted;
  } catch (error) {
    console.error('❌ خطأ في حذف بطاقة الأعمال:', error);
    return false;
  }
}

/**
 * مشاركة بطاقة الأعمال
 */
export async function shareBusinessCard(data: BusinessCardShareData): Promise<{
  success: boolean;
  shareLink?: string;
  qrCode?: string;
  message?: string;
}> {
  try {
    const card = businessCardsDB.get(data.cardId);
    if (!card) {
      return { success: false, message: 'البطاقة غير موجودة' };
    }
    
    // تحديث عدد المشاركات
    card.shares = (card.shares || 0) + 1;
    businessCardsDB.set(data.cardId, card);
    
    // تحديث الإحصائيات
    const stats = statsDB.get(data.cardId);
    if (stats) {
      stats.shares++;
      const methodStats = stats.sharesByMethod.find(s => s.method === data.shareMethod);
      if (methodStats) {
        methodStats.count++;
      } else {
        stats.sharesByMethod.push({ method: data.shareMethod, count: 1 });
      }
      statsDB.set(data.cardId, stats);
    }
    
    const shareLink = generateShareLink(data.cardId);
    const qrCode = generateQRCode(data.cardId);
    
    console.log(`✅ تمت مشاركة البطاقة عبر ${data.shareMethod}:`, data.cardId);
    
    return {
      success: true,
      shareLink,
      qrCode,
      message: 'تمت المشاركة بنجاح'
    };
  } catch (error) {
    console.error('❌ خطأ في مشاركة بطاقة الأعمال:', error);
    return { success: false, message: 'فشلت المشاركة' };
  }
}

/**
 * الحصول على إحصائيات البطاقة
 */
export async function getBusinessCardStats(cardId: string): Promise<BusinessCardStats | null> {
  try {
    return statsDB.get(cardId) || null;
  } catch (error) {
    console.error('❌ خطأ في جلب إحصائيات البطاقة:', error);
    return null;
  }
}

/**
 * الحصول على جميع بطاقات الأعمال
 */
export async function getAllBusinessCards(): Promise<BusinessCard[]> {
  try {
    return Array.from(businessCardsDB.values());
  } catch (error) {
    console.error('❌ خطأ في جلب بطاقات الأعمال:', error);
    return [];
  }
}

/**
 * البحث عن بطاقات الأعمال
 */
export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  try {
    const searchLower = query.toLowerCase();
    const allCards = Array.from(businessCardsDB.values());
    
    return allCards.filter(card => 
      card.name.toLowerCase().includes(searchLower) ||
      card.companyName?.toLowerCase().includes(searchLower) ||
      card.email.toLowerCase().includes(searchLower) ||
      card.phone.includes(query) ||
      card.city?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('❌ خطأ في البحث عن بطاقات الأعمال:', error);
    return [];
  }
}

// ============================================
// Export All Functions
// ============================================

export const BusinessCardAPI = {
  create: createBusinessCard,
  get: getBusinessCard,
  getByUserId: getBusinessCardByUserId,
  update: updateBusinessCard,
  delete: deleteBusinessCard,
  share: shareBusinessCard,
  getStats: getBusinessCardStats,
  getAll: getAllBusinessCards,
  search: searchBusinessCards
};

export default BusinessCardAPI;
