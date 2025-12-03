// Marketplace Types - نظام العروض والطلبات

export type MarketplaceType = 'offer' | 'request';
export type TransactionType = 'sale' | 'rent';
export type PropertyCategory = 'residential' | 'commercial';
export type UserRole = 'seller' | 'lessor' | 'buyer' | 'tenant';

export interface MarketplaceOffer {
  id: string;
  type: MarketplaceType; // عرض أو طلب
  transactionType: TransactionType; // بيع أو إيجار
  propertyCategory: PropertyCategory; // سكني أو تجاري
  userRole: UserRole; // دور المستخدم
  
  // 🆕 مرجع للعرض/الطلب الكامل
  fullOfferId?: string; // ID للعرض الكامل في owner-full-offers
  fullRequestId?: string; // ID للطلب الكامل في owner-full-requests
  title?: string; // عنوان العرض/الطلب
  
  // معلومات المستخدم
  userId: string;
  userName: string;
  userPhone: string;
  
  // معلومات العقار
  propertyType: string;
  city: string;
  district?: string;
  area?: number;
  priceFrom?: number;
  priceTo?: number;
  
  // تفاصيل إضافية
  description: string;
  features?: string[];
  
  // 🆕 الوسائط (الصور والفيديو)
  images?: string[]; // روابط الصور
  videos?: string[]; // روابط الفيديو
  
  // الحالة
  status: 'active' | 'closed' | 'matched';
  responsesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrokerResponse {
  id: string;
  offerId: string;
  offerType: MarketplaceType;
  
  // معلومات الوسيط
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerLicense?: string;
  brokerRating: number;
  brokerBadge?: 'bronze' | 'silver' | 'gold' | 'platinum';
  brokerCity?: string;
  brokerDistrict?: string;
  
  // العرض المقدم
  serviceDescription: string; // ما يمكنه تقديمه
  commissionPercentage: number; // النسبة المطلوبة
  
  // الحالة
  status: 'pending' | 'accepted' | 'rejected';
  ownerViewed: boolean;
  createdAt: string;
  respondedAt?: string;
}

export interface MarketplaceFilters {
  city?: string;
  district?: string;
  propertyType?: string;
  transactionType?: TransactionType;
  propertyCategory?: PropertyCategory;
  priceFrom?: number;
  priceTo?: number;
}