/**
 * 📁 عروضي - واجهة المالك لإدارة عروضه
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: عرض جميع العروض التي أرسلها المالك مع عروض الوسطاء
 * 📌 التصميم: مستطيلات بسيطة → صفحة كاملة → شريط منزلق ثابت + عروض الوسطاء
 * ────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { OfferDetailsPage } from './OfferDetailsPage';
import { RequestDetailsPage } from './RequestDetailsPage';
import { 
  Home, MapPin, DollarSign, User, Calendar, Star, Award, 
  Trash2, Eye, EyeOff, FileText, Building2, ArrowUpCircle, 
  AlertCircle, Maximize2, Search 
} from 'lucide-react';
import { UnreadIndicator, getUnreadResponsesCount } from '../notifications/UnreadIndicator';
import { addBrokerResponseNotification, removeNotificationByResponse } from '../notifications/NotificationSystem';

interface FullOffer {
  id: string;
  title: string;
  type: 'sale' | 'rent';
  transactionType: string;
  propertyType: string;
  propertyCategory: string;
  
  // معلومات المالك الكاملة
  ownerName: string;
  ownerPhone: string;
  ownerNationalId?: string;
  ownerDob?: string;
  
  // الموقع الكامل
  city: string;
  district: string;
  street?: string;
  postalCode?: string;
  building?: string;
  mapLocation?: { lat: number; lng: number };
  
  // المواصفات
  area: number;
  price: number;
  priceFrom: number;
  priceTo: number;
  
  // أسعار الإيجار
  rentPaymentMethods?: string[];
  rentSingle?: number;
  rentTwo?: number;
  rentFour?: number;
  rentMonthly?: number;
  
  // الغرف والمرافق
  bedrooms?: number;
  bathrooms?: number;
  storageRooms?: number;
  balconies?: number;
  curtains?: number;
  airConditioners?: number;
  parkingSpaces?: number;
  floors?: number;
  
  // المواصفات الإضافية
  entrances?: string;
  position?: string;
  level?: string;
  
  // الخصائص المنطقية
  hasAnnex?: boolean;
  hasMaidRoom?: boolean;
  hasLaundryRoom?: boolean;
  hasJacuzzi?: boolean;
  hasRainShower?: boolean;
  isSmartHome?: boolean;
  hasSmartEntry?: boolean;
  hasPool?: boolean;
  hasPlayground?: boolean;
  hasGarden?: boolean;
  hasElevator?: boolean;
  hasExternalMajlis?: boolean;
  hasPrivateRoof?: boolean;
  isFurnished?: boolean;
  hasBuiltInKitchen?: boolean;
  kitchenWithAppliances?: boolean;
  selectedAppliances?: string[];
  
  // الصك
  deedNumber?: string;
  deedDate?: string;
  
  // الضمانات
  guarantees?: Array<{
    id: string;
    type: string;
    duration: string;
    notes: string;
  }>;
  
  // الوصف والمميزات
  description: string;
  features?: string[];
  customFeatures?: string[];
  
  // الجولة الافتراضية
  virtualTourLink?: string;
  
  // الميديا
  images: string[];
  videos: string[];
  mediaIds?: string[];
  
  // حالة العرض
  status: string;
  brokerResponses: any[];
  acceptedBrokers?: number;
  createdAt: string;
  updatedAt: string;
  
  // 🆕 للتمييز بين العروض والطلبات
  itemType?: 'offer' | 'request';
}

// 🆕 نوع للطلبات
interface FullRequest {
  id: string;
  title: string;
  type: 'buy' | 'rent';
  transactionType: string;
  propertyType: string;
  propertyCategory: string;
  
  ownerName: string;
  ownerPhone: string;
  
  // 🆕 معلومات صاحب الطلب الكاملة
  ownerFullName?: string;
  ownerNationalId?: string;
  ownerDob?: string;
  ownerAddress?: string;
  
  city: string;
  districts?: string[];
  
  area?: number;
  budget?: number;
  priceFrom?: number;
  priceTo?: number;
  
  paymentMethod?: string;
  urgency?: string;
  description?: string;
  
  status: string;
  brokerResponses: any[];
  acceptedBrokers?: number;
  createdAt: string;
  updatedAt: string;
  
  itemType: 'request';
}

interface BrokerResponse {
  id: string;
  offerId: string;
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerLicense?: string;
  brokerRating: number;
  brokerBadge?: 'bronze' | 'silver' | 'gold' | 'platinum';
  brokerCity?: string;
  brokerDistrict?: string;
  serviceDescription: string;
  commissionPercentage: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export function MyOffersView() {
  const [myOffers, setMyOffers] = useState<(FullOffer | FullRequest)[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<FullOffer | FullRequest | null>(null);

  useEffect(() => {
    loadMyOffersAndRequests();
  }, []);

  // 🧹 زر تصفير البيانات (للتطوير فقط)
  const clearAllData = () => {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع البيانات؟\n\nسيتم حذف:\n- جميع العروض\n- جميع الطلبات\n- جميع عروض الوسطاء\n- جميع بطاقات العملاء\n- جميع الصور والفيديو من IndexedDB')) {
      const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
      const userId = user.id;
      
      // حذف العروض الكاملة
      localStorage.removeItem(`owner-full-offers-${userId}`);
      
      // حذف الطلبات الكاملة
      localStorage.removeItem(`owner-full-requests-${userId}`);
      
      // حذف عروض السوق
      localStorage.removeItem('marketplace-offers');
      
      // حذف ردود الوسطاء
      localStorage.removeItem('broker-responses');
      
      // حذف بطاقات العملاء
      localStorage.removeItem(`crm-customers-${userId}`);
      localStorage.removeItem('crm_customers');
      
      // مسح IndexedDB
      import('../../utils/indexedDBStorage').then(({ clearAllMedia }) => {
        clearAllMedia().then(() => {
          console.log('✅ تم مسح جميع البيانات!');
          alert('✅ تم مسح جميع البيانات بنجاح!');
          loadMyOffersAndRequests(); // إعادة تحميل (ستكون فارغة)
        });
      });
    }
  };

  const loadMyOffersAndRequests = async () => {
    console.log('🔍 [MyOffersView] ========== بدء تحميل العروض والطلبات ==========');
    
    const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    const userId = user.id;
    console.log('🆔 [MyOffersView] معرّف المستخدم:', userId);
    
    if (!userId) {
      console.error('❌❌ [MyOffersView] لا يوجد معرّف مستخدم - إيقاف التحميل');
      return;
    }

    // جلب جميع عروضي الكاملة
    const ownerFullOffersKey = `owner-full-offers-${userId}`;
    const fullOffers = JSON.parse(localStorage.getItem(ownerFullOffersKey) || '[]');
    console.log(`📦 [MyOffersView] عدد العروض: ${fullOffers.length}`);
    
    // 🆕 جلب جميع طلباتي الكاملة
    const ownerFullRequestsKey = `owner-full-requests-${userId}`;
    const fullRequests = JSON.parse(localStorage.getItem(ownerFullRequestsKey) || '[]');
    console.log(`📦 [MyOffersView] عدد الطلبات: ${fullRequests.length}`);
    
    // 🆕 جلب الصور من IndexedDB
    const { getAllMediaForOffer } = await import('../../utils/indexedDBStorage');
    
    // جلب عروض الوسطاء
    const allBrokerResponses = JSON.parse(localStorage.getItem('broker-responses') || '[]');
    console.log(`💼 [MyOffersView] عدد ردود الوسطاء: ${allBrokerResponses.length}`);
    
    // ربط العروض بعروض الوسطاء
    const offersWithResponses = await Promise.all(fullOffers.map(async (offer: FullOffer, index: number) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔍 [MyOffersView] معالجة العرض ${index + 1}/${fullOffers.length}`);
      console.log(`📌 [MyOffersView] معرّف العرض: ${offer.id}`);
      console.log(`📌 [MyOffersView] عنوان العرض: ${offer.title}`);
      console.log(`📸 [MyOffersView] mediaIds:`, offer.mediaIds);
      console.log(`📸 [MyOffersView] عدد mediaIds: ${offer.mediaIds?.length || 0}`);
      
      // 🆕 جلب الصور والفيديو من IndexedDB
      let mediaItems = [];
      let images: string[] = [];
      let videos: string[] = [];
      
      if (offer.mediaIds && offer.mediaIds.length > 0) {
        console.log(`🔄 [MyOffersView] جلب ${offer.mediaIds.length} ملف من IndexedDB...`);
        try {
          mediaItems = await getAllMediaForOffer(offer.id);
          console.log(`✅ [MyOffersView] تم جلب ${mediaItems.length} ملف من IndexedDB:`, mediaItems);
          
          images = mediaItems.filter(m => m.type === 'image').map(m => m.data);
          videos = mediaItems.filter(m => m.type === 'video').map(m => m.data);
          
          console.log(`📸 [MyOffersView] عدد الصور المجلوبة: ${images.length}`);
          console.log(`🎥 [MyOffersView] عدد الفيديوهات المجلوبة: ${videos.length}`);
        } catch (error) {
          console.error(`❌ [MyOffersView] خطأ في جلب الوسائط للعرض ${offer.id}:`, error);
        }
      } else {
        console.warn(`⚠️ [MyOffersView] لا توجد mediaIds للعرض ${offer.id}`);
        
        // 🔄 Fallback: محاولة استخدام الصور القديمة المحفوظة مباشرة
        if (offer.images || offer.videos) {
          console.log('🔄 [MyOffersView] استخدام الصور القديمة (Fallback)...');
          images = offer.images || [];
          videos = offer.videos || [];
          console.log(`📸 [MyOffersView] عدد الصور القديمة: ${images.length}`);
          console.log(`🎥 [MyOffersView] عدد الفيديوهات القديمة: ${videos.length}`);
        }
      }
      
      // البحث عن marketplace offer لهذا العرض
      const marketplaceOffers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
      const marketplaceOffer = marketplaceOffers.find((mo: any) => mo.fullOfferId === offer.id);
      console.log(`🏪 [MyOffersView] marketplace offer موجود؟`, !!marketplaceOffer);
      console.log(`🏪 [MyOffersView] marketplace offer:`, marketplaceOffer);
      console.log(`🏪 [MyOffersView] offer.id:`, offer.id);
      console.log(`🏪 [MyOffersView] جميع marketplace offers:`, marketplaceOffers);
      
      if (marketplaceOffer) {
        // جلب عروض الوسطاء لهذا العرض
        const responses = allBrokerResponses.filter((r: BrokerResponse) => r.offerId === marketplaceOffer.id);
        const acceptedCount = responses.filter((r: BrokerResponse) => r.status === 'accepted').length;
        console.log(`💼 [MyOffersView] عدد ردود الوسطاء لهذا العرض: ${responses.length}`);
        console.log(`✅ [MyOffersView] عدد الوسطاء المقبولين: ${acceptedCount}`);
        console.log(`💼 [MyOffersView] ردود الوسطاء:`, responses);
        console.log(`💼 [MyOffersView] جميع broker responses:`, allBrokerResponses);
        
        return {
          ...offer,
          images,
          videos,
          responses,
          acceptedBrokers: acceptedCount,
          remainingSlots: 10 - acceptedCount,
          isOpen: acceptedCount < 10
        };
      }
      
      console.log(`⚠️ [MyOffersView] لا يوجد marketplace offer - عرض بدون ردود`);
      return {
        ...offer,
        images,
        videos,
        responses: [],
        acceptedBrokers: 0,
        remainingSlots: 10,
        isOpen: true
      };
    }));
    
    // 🆕 ربط الطلبات بعروض الوسطاء
    const requestsWithResponses = fullRequests.map((request: FullRequest) => {
      // البحث عن marketplace offer للطلب
      const marketplaceOffers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
      const marketplaceOffer = marketplaceOffers.find((mo: any) => mo.fullRequestId === request.id);
      
      if (marketplaceOffer) {
        const responses = allBrokerResponses.filter((r: BrokerResponse) => r.offerId === marketplaceOffer.id);
        const acceptedCount = responses.filter((r: BrokerResponse) => r.status === 'accepted').length;
        
        return {
          ...request,
          responses,
          acceptedBrokers: acceptedCount,
          remainingSlots: 10 - acceptedCount,
          isOpen: acceptedCount < 10
        };
      }
      
      return {
        ...request,
        responses: [],
        acceptedBrokers: 0,
        remainingSlots: 10,
        isOpen: true
      };
    });
    
    setMyOffers([...offersWithResponses, ...requestsWithResponses]);
    console.log('\n✅ [MyOffersView] ========== اكتمل التحميل ==========');
    console.log(`✅ [MyOffersView] العروض والطلبات النهائية (${offersWithResponses.length + fullRequests.length}):`, [...offersWithResponses, ...requestsWithResponses]);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━\n');
  };

  const handleAcceptBroker = (responseId: string, offerId: string) => {
    if (!confirm('هل أنت متأكد من قبول هذا الوسيط؟')) return;

    const offer = myOffers.find(o => o.id === offerId);
    if (!offer) return;

    // التحقق من عدد الوسطاء المقبولين
    const acceptedCount = offer.acceptedBrokers || 0;
    if (acceptedCount >= 10) {
      alert('⚠️ لقد وصلت للحد الأقصى من الوسطاء المقبولين (10 وسطاء)');
      return;
    }

    // تحديث حالة الرد
    const allResponses = JSON.parse(localStorage.getItem('broker-responses') || '[]');
    const response = allResponses.find((r: BrokerResponse) => r.id === responseId);
    
    if (!response) return;

    const updatedResponses = allResponses.map((r: BrokerResponse) => 
      r.id === responseId 
        ? { ...r, status: 'accepted' as const, respondedAt: new Date().toISOString() }
        : r
    );
    
    localStorage.setItem('broker-responses', JSON.stringify(updatedResponses));

    // تحديث عدد الوسطاء المقبولين في العرض الكامل
    const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    const isRequest = offer.itemType === 'request';
    
    // تحديث العرض أو الطلب الكامل
    if (isRequest) {
      // تحديث الطلبات
      const ownerFullRequestsKey = `owner-full-requests-${user.id}`;
      const fullRequests = JSON.parse(localStorage.getItem(ownerFullRequestsKey) || '[]');
      
      const updatedFullRequests = fullRequests.map((fr: FullRequest) => {
        if (fr.id === offerId) {
          const newAcceptedCount = (fr.acceptedBrokers || 0) + 1;
          return {
            ...fr,
            acceptedBrokers: newAcceptedCount,
            status: newAcceptedCount >= 10 ? 'closed' : fr.status
          };
        }
        return fr;
      });
      
      localStorage.setItem(ownerFullRequestsKey, JSON.stringify(updatedFullRequests));
    } else {
      // تحديث العروض
      const ownerFullOffersKey = `owner-full-offers-${user.id}`;
      const fullOffers = JSON.parse(localStorage.getItem(ownerFullOffersKey) || '[]');
      
      const updatedFullOffers = fullOffers.map((fo: FullOffer) => {
        if (fo.id === offerId) {
          const newAcceptedCount = (fo.acceptedBrokers || 0) + 1;
          return {
            ...fo,
            acceptedBrokers: newAcceptedCount,
            status: newAcceptedCount >= 10 ? 'closed' : fo.status
          };
        }
        return fo;
      });
      
      localStorage.setItem(ownerFullOffersKey, JSON.stringify(updatedFullOffers));
    }

    // إذا وصل العدد إلى 10، أغلق العرض في marketplace
    const newAcceptedCount = (offer.acceptedBrokers || 0) + 1;
    if (newAcceptedCount >= 10 && offer.marketplaceOfferId) {
      const marketplaceOffers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
      const updatedMarketplaceOffers = marketplaceOffers.map((mo: any) => 
        mo.id === offer.marketplaceOfferId 
          ? { ...mo, status: 'closed', updatedAt: new Date().toISOString() }
          : mo
      );
      localStorage.setItem('marketplace-offers', JSON.stringify(updatedMarketplaceOffers));
      
      alert('🎉 تم قبول 10 وسطاء! تم إغلاق العرض تلقائياً.');
    }

    // إنشاء بطاقة عميل للوسيط في نظام CRM
    const brokerCustomerCard = {
      id: response.brokerId,
      name: response.brokerName,
      phone: response.brokerPhone,
      whatsapp: response.brokerPhone,
      email: '',
      status: 'متابعة',
      rating: response.brokerRating,
      badge: response.brokerBadge,
      license: response.brokerLicense,
      type: 'وسيط',
      category: 'broker',
      notes: `وسيط مقبول - عمولة ${response.commissionPercentage}%`,
      createdAt: new Date().toISOString(),
      receivedOffers: [],
      hasNotification: false
    };

    // حفظ في نظام إدارة العملاء
    const ownerCrmKey = `crm-customers-${user.id}`;
    const ownerCustomers = JSON.parse(localStorage.getItem(ownerCrmKey) || '[]');
    
    // التحقق من عدم التكرار
    const existingIndex = ownerCustomers.findIndex((c: any) => c.phone === response.brokerPhone);
    if (existingIndex === -1) {
      ownerCustomers.push(brokerCustomerCard);
      localStorage.setItem(ownerCrmKey, JSON.stringify(ownerCustomers));
    }

    // إنشاء بطاقة عميل للمالك في نظام CRM الخاص بالوسيط
    const ownerCustomerCard = {
      id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: offer.ownerName,
      phone: offer.ownerPhone,
      whatsapp: offer.ownerPhone,
      email: '',
      status: 'جديد',
      type: offer.type === 'sale' ? 'seller' : 'lessor',
      category: offer.type === 'sale' ? 'مالك' : 'مؤجر',
      notes: `${offer.propertyType} ${offer.type === 'sale' ? 'للبيع' : 'للإيجار'} في ${offer.city}`,
      createdAt: new Date().toISOString(),
      receivedOffers: [{
        id: `accepted-${Date.now()}`,
        fullOfferId: offer.id,
        propertyType: offer.propertyType,
        city: offer.city,
        district: offer.district,
        area: offer.area,
        priceFrom: offer.priceFrom,
        priceTo: offer.priceTo,
        description: offer.description,
        features: offer.features || [],
        mediaIds: offer.mediaIds || [],
        transactionType: offer.transactionType,
        offerType: 'offer',
        commissionPercentage: response.commissionPercentage,
        serviceDescription: response.serviceDescription,
        acceptedAt: new Date().toISOString(),
        ownerPhone: offer.ownerPhone,
        ownerName: offer.ownerName
      }],
      hasNotification: true,
      notificationCount: 1
    };

    // حفظ في نظام CRM الموحد
    let brokerCustomers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
    brokerCustomers.push(ownerCustomerCard);
    localStorage.setItem('crm_customers', JSON.stringify(brokerCustomers));

    // إضافة إشعار للوسيط
    const brokerNotificationsKey = `notifications_${response.brokerPhone}`;
    const brokerNotifications = JSON.parse(localStorage.getItem(brokerNotificationsKey) || '[]');
    brokerNotifications.unshift({
      id: `notif-${Date.now()}`,
      type: 'accepted-offer',
      title: 'تم قبول عرضك! 🎉',
      message: `قبل ${offer.ownerName} عرضك على ${offer.propertyType} في ${offer.city}`,
      customerName: offer.ownerName,
      customerPhone: offer.ownerPhone,
      customerId: ownerCustomerCard.id,
      read: false,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(brokerNotificationsKey, JSON.stringify(brokerNotifications));

    // 🆕 حفظ العرض المقبول في accepted-offers للمالك
    const acceptedOfferData = {
      id: `accepted-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      offerId: response.offerId, // marketplace offer ID
      offerType: isRequest ? 'request' : 'offer',
      transactionType: isRequest 
        ? (offer.type === 'buy' ? 'sale' : 'rent')
        : (offer.type || offer.transactionType),
      propertyType: offer.propertyType,
      city: offer.city,
      district: isRequest ? (offer.districts && offer.districts[0]) : offer.district,
      description: offer.description || offer.title,
      
      // معلومات الوسيط
      brokerId: response.brokerId,
      brokerName: response.brokerName,
      brokerPhone: response.brokerPhone,
      brokerWhatsapp: response.brokerPhone,
      brokerLicense: response.brokerLicense,
      brokerRating: response.brokerRating,
      brokerBadge: response.brokerBadge,
      brokerCity: response.brokerCity,
      brokerDistrict: response.brokerDistrict,
      
      // تفاصيل الاتفاق
      commissionPercentage: response.commissionPercentage,
      serviceDescription: response.serviceDescription,
      
      acceptedAt: new Date().toISOString()
    };

    const storedAcceptedOffers = localStorage.getItem('accepted-offers');
    const acceptedOffers = storedAcceptedOffers ? JSON.parse(storedAcceptedOffers) : [];
    acceptedOffers.unshift(acceptedOfferData);
    localStorage.setItem('accepted-offers', JSON.stringify(acceptedOffers));

    alert('✅ تم قبول الوسيط بنجاح! تمت إضافة بطاقة عميل للوسيط.');
    setSelectedOffer(null);
    loadMyOffersAndRequests();
  };

  const handleRejectBroker = (responseId: string) => {
    if (!confirm('هل أنت متأكد من رفض هذا الوسيط؟')) return;

    const allResponses = JSON.parse(localStorage.getItem('broker-responses') || '[]');
    const updatedResponses = allResponses.map((r: BrokerResponse) => 
      r.id === responseId 
        ? { ...r, status: 'rejected' as const, respondedAt: new Date().toISOString() }
        : r
    );
    
    localStorage.setItem('broker-responses', JSON.stringify(updatedResponses));
    
    alert('✅ تم رفض الوسيط.');
    loadMyOffersAndRequests();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(price);
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gray-500';
    }
  };

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'platinum': return 'بلاتيني';
      case 'gold': return 'ذهبي';
      case 'silver': return 'فضي';
      case 'bronze': return 'برونزي';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01411C]/5 to-white p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-[#01411C] mb-2">📁 عروضي</h1>
          <p className="text-gray-600">جميع العروض التي أرسلتها مع عروض الوسطاء</p>
        </div>

        {myOffers.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">لا توجد عروض أو طلبات حالياً</p>
              <p className="text-gray-500 text-sm">قم بإرسال عرضك أو طلبك الأول من \"اطلب وسيط\"</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myOffers.map((item) => {
              const isRequest = item.itemType === 'request';
              const borderColor = isRequest ? 'border-[#D4AF37]/20 hover:border-[#D4AF37]' : 'border-[#01411C]/20 hover:border-[#01411C]';
              const bgColor = isRequest ? 'bg-gradient-to-br from-[#D4AF37] to-[#f1c40f]' : 'bg-gradient-to-br from-[#01411C] to-[#01411C]/70';
              const iconColor = isRequest ? 'text-[#D4AF37]' : 'text-[#01411C]';
              const textColor = isRequest ? 'text-[#D4AF37]' : 'text-[#01411C]';
              
              // 🔴 حساب عدد الردود الجديدة
              const responses = item.responses || item.brokerResponses || [];
              const unreadCount = getUnreadResponsesCount(responses);
              
              return (
                <Card 
                  key={item.id} 
                  className={`border-2 ${borderColor} transition-all cursor-pointer relative`}
                  onClick={() => setSelectedOffer(item)}
                >
                  {/* 🔴 دائرة حمراء نابضة للردود الجديدة */}
                  {unreadCount > 0 && (
                    <UnreadIndicator 
                      count={unreadCount} 
                      size="lg" 
                      position="top-right" 
                    />
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                          <Home className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-bold ${textColor}`}>{item.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item.city}
                            </span>
                            <span className="flex items-center gap-1">
                              {isRequest ? <Search className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                              {isRequest 
                                ? (item.type === 'buy' ? 'طلب شراء' : 'طلب إيجار')
                                : (item.type === 'sale' ? 'عرض بيع' : 'عرض إيجار')
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.acceptedBrokers! >= 10 && (
                          <Badge className="bg-red-500 text-white">
                            مغلق
                          </Badge>
                        )}
                        {responses.length > 0 && (
                          <Badge className={isRequest ? 'bg-[#D4AF37] text-white' : 'bg-[#01411C] text-white'}>
                            {responses.length} عرض
                          </Badge>
                        )}
                        <Maximize2 className={`w-5 h-5 ${iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* صفحة تفاصيل العرض أو الطلب */}
        {selectedOffer && selectedOffer.itemType === 'request' && (
          <RequestDetailsPage
            request={selectedOffer as FullRequest}
            onBack={() => setSelectedOffer(null)}
            onAcceptBroker={handleAcceptBroker}
            onRejectBroker={handleRejectBroker}
          />
        )}
        
        {selectedOffer && selectedOffer.itemType !== 'request' && (
          <OfferDetailsPage
            offer={selectedOffer as FullOffer}
            onBack={() => setSelectedOffer(null)}
            onAcceptBroker={handleAcceptBroker}
            onRejectBroker={handleRejectBroker}
          />
        )}
      </div>
    </div>
  );
}