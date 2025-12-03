import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, ShoppingCart, Download, Share2, MapPin, Building, Percent, Home, Ruler, DollarSign } from "lucide-react";
import { createCustomer, findCustomerByPhone } from '../../utils/customersManager';
import { LicenseModal } from './LicenseModal';

interface ReceivedOffer {
  id: string;
  offerId?: string;
  fullOfferId?: string;
  
  // معلومات العقار الكاملة
  propertyType: string;
  propertyCategory?: 'residential' | 'commercial';
  city: string;
  district?: string;
  area?: number;
  priceFrom?: number;
  priceTo?: number;
  description: string;
  features?: any; // يمكن أن يكون array أو object
  
  // 🆕 الوسائط (الصور والفيديو)
  images?: string[];
  videos?: string[];
  mediaIds?: string[];
  
  // نوع العملية
  transactionType: 'sale' | 'rent';
  offerType: 'offer' | 'request';
  userRole?: 'seller' | 'lessor' | 'buyer' | 'tenant';
  
  // تفاصيل الاتفاق
  commissionPercentage: number;
  serviceDescription: string;
  acceptedAt: string;
  
  // معلومات العميل (المالك أو الباحث)
  ownerPhone?: string; // رقم جوال العميل
  ownerName?: string;  // اسم العميل
}

interface ReceivedOffersSlideProps {
  receivedOffers?: ReceivedOffer[];
  receivedRequests?: ReceivedOffer[];
  customerName: string;
  customerPhone?: string; // رقم جوال العميل
  onNavigate?: (page: string, options?: any) => void;
}

export function ReceivedOffersSlide({ 
  receivedOffers = [], 
  receivedRequests = [],
  customerName,
  customerPhone,
  onNavigate
}: ReceivedOffersSlideProps) {
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>(
    receivedOffers.length > 0 ? 'offers' : 'requests'
  );
  const [offersWithMedia, setOffersWithMedia] = useState<ReceivedOffer[]>([]);
  const [requestsWithMedia, setRequestsWithMedia] = useState<ReceivedOffer[]>([]);
  
  // 🆕 حالة المودال والترخيص الإعلاني
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [advertisingLicense, setAdvertisingLicense] = useState('');
  const [selectedOfferForPublish, setSelectedOfferForPublish] = useState<ReceivedOffer | null>(null);
  
  // 🆕 جلب الصور من IndexedDB عند التحميل
  useEffect(() => {
    const loadMediaForOffers = async () => {
      const { getAllMediaForOffer } = await import('../../utils/indexedDBStorage');
      
      const offersWithImages = await Promise.all(receivedOffers.map(async (offer) => {
        if (offer.mediaIds && offer.mediaIds.length > 0 && offer.fullOfferId) {
          const mediaItems = await getAllMediaForOffer(offer.fullOfferId);
          const images = mediaItems.filter(m => m.type === 'image').map(m => m.data);
          const videos = mediaItems.filter(m => m.type === 'video').map(m => m.data);
          return { ...offer, images, videos };
        }
        return offer;
      }));
      
      const requestsWithImages = await Promise.all(receivedRequests.map(async (req) => {
        if (req.mediaIds && req.mediaIds.length > 0 && req.fullOfferId) {
          const mediaItems = await getAllMediaForOffer(req.fullOfferId);
          const images = mediaItems.filter(m => m.type === 'image').map(m => m.data);
          const videos = mediaItems.filter(m => m.type === 'video').map(m => m.data);
          return { ...req, images, videos };
        }
        return req;
      }));
      
      setOffersWithMedia(offersWithImages);
      setRequestsWithMedia(requestsWithImages);
    };
    
    loadMediaForOffers();
  }, [receivedOffers, receivedRequests]);

  const handlePublish = (item: ReceivedOffer) => {
    console.log('🎯 [handlePublish] بدء معالجة نشر العرض...');
    console.log('📸 [handlePublish] عدد الصور في item:', item.images?.length || 0);
    console.log('📹 [handlePublish] عدد الفيديوهات في item:', item.videos?.length || 0);
    console.log('🔗 [handlePublish] fullOfferId:', item.fullOfferId);
    console.log('🆔 [handlePublish] mediaIds:', item.mediaIds);
    
    // تحديد نوع العنصر: عرض أم طلب
    if (item.offerType === 'offer') {
      // فتح المودال للحصول على الترخيص الإعلاني
      setSelectedOfferForPublish(item);
      setShowLicenseModal(true);
    } else {
      // طلب → ينشر تلقائياً في لوحة التحكم
      handlePublishRequest(item);
    }
  };

  // 🆕 دالة النشر بعد الموافقة على الترخيص
  const proceedWithPublish = (license: string) => {
    if (!selectedOfferForPublish) return;
    
    const item = selectedOfferForPublish;
    
    console.log('🎯 [proceedWithPublish] بدء معالجة النشر مع الترخيص:', license);
    
    // ============================================================
    // 🆕 جلب العرض الكامل من localStorage
    // ============================================================
    let fullOffer: any = null;
    
    if (item.fullOfferId) {
      // البحث في جميع ملفات owner-full-offers-*
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('owner-full-offers-')) {
          const offers = JSON.parse(localStorage.getItem(key) || '[]');
          const foundOffer = offers.find((o: any) => o.id === item.fullOfferId);
          if (foundOffer) {
            fullOffer = foundOffer;
            console.log('✅ [proceedWithPublish] تم جلب العرض الكامل:', fullOffer);
            break;
          }
        }
      }
    }
    
    // إذا لم نجد العرض الكامل، نستخدم البيانات الموجودة في item
    const offerData = fullOffer || item;
    console.log('📦 [proceedWithPublish] البيانات المستخدمة:', offerData);
    console.log('📸 [proceedWithPublish] item.images:', item.images);
    console.log('📹 [proceedWithPublish] item.videos:', item.videos);
    console.log('🔗 [proceedWithPublish] item.fullOfferId:', item.fullOfferId);
    console.log('🆔 [proceedWithPublish] offerData.mediaIds:', offerData.mediaIds);
    
    // ============================================================
    // 🆕 بناء بيانات الملء التلقائي الكاملة
    // ============================================================
    const autoFillData = {
      // نوع العقار والتصنيف
      propertyType: offerData.propertyType,
      propertyCategory: offerData.propertyCategory === 'residential' ? 'سكني' : 'تجاري',
      purpose: offerData.transactionType === 'sale' ? 'للبيع' : 'للإيجار',
      
      // معلومات المالك الكاملة
      ownerName: offerData.ownerName || customerName || '',
      ownerPhone: offerData.ownerPhone || customerPhone || '',
      ownerNationalId: offerData.ownerNationalId || '',
      ownerDob: offerData.ownerDob || '',
      
      // الصك
      deedNumber: offerData.deedNumber || '',
      deedDate: offerData.deedDate || '',
      
      // الموقع الكامل
      city: offerData.city,
      district: offerData.district || '',
      street: offerData.street || '',
      building: offerData.building || '',
      postalCode: offerData.postalCode || '',
      mapLocation: offerData.mapLocation || null,
      
      // المواصفات الأساسية
      area: offerData.area || '',
      
      // الأسعار
      price: offerData.price || offerData.priceFrom || 0,
      priceFrom: offerData.priceFrom || 0,
      priceTo: offerData.priceTo || 0,
      
      // أسعار الإيجار
      rentPaymentMethods: offerData.rentPaymentMethods || [],
      rentSingle: offerData.rentSingle || 0,
      rentTwo: offerData.rentTwo || 0,
      rentFour: offerData.rentFour || 0,
      rentMonthly: offerData.rentMonthly || 0,
      
      // الغرف والمرافق
      bedrooms: offerData.bedrooms || 0,
      bathrooms: offerData.bathrooms || 0,
      storageRooms: offerData.storageRooms || 0,
      balconies: offerData.balconies || 0,
      curtains: offerData.curtains || 0,
      airConditioners: offerData.airConditioners || 0,
      parkingSpaces: offerData.parkingSpaces || 0,
      floors: offerData.floors || 0,
      
      // المواصفات الإضافية
      entrances: offerData.entrances || '',
      position: offerData.position || '',
      level: offerData.level || '',
      
      // الخصائص المنطقية
      hasAnnex: offerData.hasAnnex || false,
      hasMaidRoom: offerData.hasMaidRoom || false,
      hasLaundryRoom: offerData.hasLaundryRoom || false,
      hasJacuzzi: offerData.hasJacuzzi || false,
      hasRainShower: offerData.hasRainShower || false,
      isSmartHome: offerData.isSmartHome || false,
      hasSmartEntry: offerData.hasSmartEntry || false,
      hasPool: offerData.hasPool || false,
      hasPlayground: offerData.hasPlayground || false,
      hasGarden: offerData.hasGarden || false,
      hasElevator: offerData.hasElevator || false,
      hasExternalMajlis: offerData.hasExternalMajlis || false,
      hasPrivateRoof: offerData.hasPrivateRoof || false,
      isFurnished: offerData.isFurnished || false,
      hasBuiltInKitchen: offerData.hasBuiltInKitchen || false,
      kitchenWithAppliances: offerData.kitchenWithAppliances || false,
      selectedAppliances: offerData.selectedAppliances || [],
      
      // الضمانات
      guarantees: offerData.guarantees || [],
      
      // الوصف والمميزات
      description: offerData.description || '',
      features: offerData.features || {},
      customFeatures: offerData.customFeatures || [],
      
      // الجولة الافتراضية
      virtualTourLink: offerData.virtualTourLink || '',
      
      // 🆕 الصور والفيديو
      images: item.images || [],
      videos: item.videos || [],
      mediaIds: offerData.mediaIds || [],
      
      // 🆕 الترخيص الإعلاني
      advertisingLicense: license,
      
      // معلومات إضافية من الوسيط
      userRole: offerData.userRole || item.userRole,
      offerId: item.offerId,
      acceptedOfferId: item.id,
      fullOfferId: item.fullOfferId,
      
      // تاريخ القبول
      acceptedAt: item.acceptedAt,
      
      // علامة للتعرف على المصدر
      source: 'marketplace-accepted-offer',
      
      timestamp: new Date().toISOString()
    };
    
    // حفظ في localStorage
    localStorage.setItem('auto-fill-property', JSON.stringify(autoFillData));
    
    console.log('✅ [proceedWithPublish] تم حفظ جميع بيانات الملء التلقائي:', autoFillData);
    console.log('✅ [proceedWithPublish] عدد الصور المحفوظة:', autoFillData.images?.length || 0);
    console.log('✅ [proceedWithPublish] عدد الفيديوهات المحفوظة:', autoFillData.videos?.length || 0);
    console.log('✅ [proceedWithPublish] عدد mediaIds:', autoFillData.mediaIds?.length || 0);
    console.log('✅ [proceedWithPublish] fullOfferId:', autoFillData.fullOfferId);
    
    // إغلاق المودال
    setShowLicenseModal(false);
    setSelectedOfferForPublish(null);
    setAdvertisingLicense('');
    
    // الانتقال لصفحة النشر
    if (onNavigate) {
      onNavigate('property-upload-complete', { autoFill: true });
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { page: 'property-upload-complete', options: { autoFill: true } }
      }));
    }
    
    return;
    
    // ============================================================
    // 🚫 الكود القديم - لن يُنفذ
    // ============================================================
    
    // الحصول على رقم الجوال من item أو من props
    const phone = item.ownerPhone || customerPhone;
    
    if (phone) {
      console.log('📞 [handlePublish] رقم الجوال:', phone);
      
      // التحقق من وجود العميل مسبقاً
      let customer = findCustomerByPhone(phone);
      
      if (!customer) {
        console.log('🆕 [handlePublish] إنشاء بطاقة عميل جديدة بجميع المعلومات...');
        
        // تحديد تصنيف العميل بناءً على نوع العرض
        let category: 'مالك' | 'مشتري' | 'مؤجر' | 'مستأجر' = 'آخر';
        if (item.userRole === 'seller') category = 'مالك';
        else if (item.userRole === 'buyer') category = 'مشتري';
        else if (item.userRole === 'lessor') category = 'مؤجر';
        else if (item.userRole === 'tenant') category = 'مستأجر';
        
        // 🆕 بناء ملاحظات شاملة تحتوي على كل المعلومات
        let comprehensiveNotes = `عرض ${item.propertyType} ${item.transactionType === 'sale' ? 'للشراء' : 'للإيجار'} في ${item.city}\n`;
        
        // معلومات المالك الكاملة
        if (item.ownerName) comprehensiveNotes += `\n👤 المالك: ${item.ownerName}`;
        if (item.ownerNationalId) comprehensiveNotes += `\n🆔 رقم الهوية: ${item.ownerNationalId}`;
        if (item.ownerDob) comprehensiveNotes += `\n📅 تاريخ الميلاد: ${item.ownerDob}`;
        
        // معلومات الصك
        if (item.deedNumber) comprehensiveNotes += `\n\n📜 معلومات الصك:\n  • رقم الصك: ${item.deedNumber}`;
        if (item.deedDate) comprehensiveNotes += `\n  • تاريخ الصك: ${item.deedDate}`;
        
        // الموقع الكامل
        comprehensiveNotes += `\n\n📍 الموقع:`;
        comprehensiveNotes += `\n  • المدينة: ${item.city}`;
        if (item.district) comprehensiveNotes += `\n  • الحي: ${item.district}`;
        if (item.street) comprehensiveNotes += `\n  • الشارع: ${item.street}`;
        if (item.building) comprehensiveNotes += `\n  • المبنى: ${item.building}`;
        if (item.postalCode) comprehensiveNotes += `\n  • الرمز البريدي: ${item.postalCode}`;
        if (item.mapLocation) comprehensiveNotes += `\n  • الإحداثيات: ${item.mapLocation.lat}, ${item.mapLocation.lng}`;
        
        // المواصفات
        comprehensiveNotes += `\n\n🏠 المواصفات:`;
        if (item.area) comprehensiveNotes += `\n  • المساحة: ${item.area} م²`;
        if (item.bedrooms) comprehensiveNotes += `\n  • غرف النوم: ${item.bedrooms}`;
        if (item.bathrooms) comprehensiveNotes += `\n  • دورات المياه: ${item.bathrooms}`;
        if (item.storageRooms) comprehensiveNotes += `\n  • مستودعات: ${item.storageRooms}`;
        if (item.balconies) comprehensiveNotes += `\n  • شرفات: ${item.balconies}`;
        if (item.parkingSpaces) comprehensiveNotes += `\n  • مواقف السيارات: ${item.parkingSpaces}`;
        if (item.floors) comprehensiveNotes += `\n  • عدد الأدوار: ${item.floors}`;
        if (item.entrances) comprehensiveNotes += `\n  • المداخل: ${item.entrances}`;
        if (item.position) comprehensiveNotes += `\n  • الموقع: ${item.position}`;
        if (item.level) comprehensiveNotes += `\n  • المستوى: ${item.level}`;
        
        // المميزات الإضافية
        const additionalFeatures = [];
        if (item.hasAnnex) additionalFeatures.push('ملحق');
        if (item.hasMaidRoom) additionalFeatures.push('غرفة خادمة');
        if (item.hasLaundryRoom) additionalFeatures.push('غرفة غسيل');
        if (item.hasJacuzzi) additionalFeatures.push('جاكوزي');
        if (item.hasRainShower) additionalFeatures.push('دش مطري');
        if (item.isSmartHome) additionalFeatures.push('منزل ذكي');
        if (item.hasSmartEntry) additionalFeatures.push('مدخل ذكي');
        if (item.hasPool) additionalFeatures.push('مسبح');
        if (item.hasPlayground) additionalFeatures.push('ملعب');
        if (item.hasGarden) additionalFeatures.push('حديقة');
        if (item.hasElevator) additionalFeatures.push('مصعد');
        if (item.hasExternalMajlis) additionalFeatures.push('مجلس خارجي');
        if (item.hasPrivateRoof) additionalFeatures.push('سطح خاص');
        if (item.isFurnished) additionalFeatures.push('مفروش');
        if (item.hasBuiltInKitchen) additionalFeatures.push('مطبخ راكب');
        if (item.kitchenWithAppliances) additionalFeatures.push('مطبخ بأجهزته');
        
        if (additionalFeatures.length > 0) {
          comprehensiveNotes += `\n\n✨ المميزات:\n  • ${additionalFeatures.join('\n  • ')}`;
        }
        
        // الأسعار
        comprehensiveNotes += `\n\n💰 السعر:`;
        if (item.price) comprehensiveNotes += `\n  • السعر: ${item.price.toLocaleString()} ريال`;
        if (item.priceFrom) comprehensiveNotes += `\n  • السعر من: ${item.priceFrom.toLocaleString()} ريال`;
        if (item.priceTo && item.priceTo !== item.priceFrom) comprehensiveNotes += `\n  • السعر إلى: ${item.priceTo.toLocaleString()} ريال`;
        
        // أسعار الإيجار
        if (item.rentSingle) comprehensiveNotes += `\n  • إيجار سنوي (دفعة واحدة): ${item.rentSingle.toLocaleString()} ريال`;
        if (item.rentTwo) comprehensiveNotes += `\n  • إيجار سنوي (دفعتين): ${item.rentTwo.toLocaleString()} ريال`;
        if (item.rentFour) comprehensiveNotes += `\n  • إيجار سنوي (4 دفعات): ${item.rentFour.toLocaleString()} ريال`;
        if (item.rentMonthly) comprehensiveNotes += `\n  • إيجار شهري: ${item.rentMonthly.toLocaleString()} ريال`;
        
        // الضمانات
        if (item.guarantees && item.guarantees.length > 0) {
          comprehensiveNotes += `\n\n🛡️ الضمانات:`;
          item.guarantees.forEach((g: any) => {
            comprehensiveNotes += `\n  • ${g.type} - ${g.duration} - ${g.notes}`;
          });
        }
        
        // الوصف
        if (item.description) comprehensiveNotes += `\n\n📝 الوصف:\n${item.description}`;
        
        // الجولة الافتراضية
        if (item.virtualTourLink) comprehensiveNotes += `\n\n🎥 رابط الجولة الافتراضية:\n${item.virtualTourLink}`;
        
        // معلومات الاتفاقية
        comprehensiveNotes += `\n\n🤝 معلومات الاتفاقية:`;
        comprehensiveNotes += `\n  • نسبة العمولة: ${item.commissionPercentage}%`;
        comprehensiveNotes += `\n  • الخدمات المتفق عليها: ${item.serviceDescription}`;
        comprehensiveNotes += `\n  • تاريخ القبول: ${new Date(item.acceptedAt).toLocaleDateString('ar-SA')}`;
        
        // إنشاء العميل بجميع المعلومات
        customer = createCustomer({
          name: item.ownerName || customerName || 'عميل جديد',
          phone: phone,
          category: category,
          source: 'اطلب وسيط - عرض مقبول',
          city: item.city,
          district: item.district,
          budget: item.priceFrom ? `${item.priceFrom.toLocaleString()} - ${(item.priceTo || item.priceFrom).toLocaleString()} ريال` : undefined,
          notes: comprehensiveNotes,
          tags: [
            'اطلب وسيط', 
            item.transactionType === 'sale' ? 'شراء' : 'إيجار',
            item.propertyType,
            item.city
          ],
          status: 'active',
          // 🆕 حفظ البيانات الإضافية كـ JSON في حقل مخصص
          customData: JSON.stringify({
            fullOfferId: item.fullOfferId,
            deedNumber: item.deedNumber,
            deedDate: item.deedDate,
            ownerNationalId: item.ownerNationalId,
            ownerDob: item.ownerDob,
            street: item.street,
            building: item.building,
            postalCode: item.postalCode,
            mapLocation: item.mapLocation,
            virtualTourLink: item.virtualTourLink,
            features: item.features,
            guarantees: item.guarantees,
            mediaIds: item.mediaIds,
            commissionPercentage: item.commissionPercentage,
            serviceDescription: item.serviceDescription,
            acceptedAt: item.acceptedAt
          })
        });
        
        console.log('✅ [handlePublish] تم إنشاء بطاقة العميل بجميع المعلومات:', customer.id, customer.name);
      } else {
        console.log('✅ [handlePublish] العميل موجود مسبقاً:', customer.id, customer.name);
      }
      
      // ============================================================
      // الخطوة 2: نشر العرض في لوحة التحكم (كما هو)
      // ============================================================
      
      const newOffer = {
        id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${item.propertyType} - ${item.city} ${item.district ? '- ' + item.district : ''}`,
        propertyType: item.propertyType,
        transactionType: item.transactionType === 'sale' ? 'شراء' : 'استئجار',
        category: item.propertyCategory === 'residential' ? 'سكني' : 'تجاري',
        budget: item.priceFrom || item.priceTo || 0,
        urgency: 'عادي' as const,
        city: item.city,
        districts: item.district ? [item.district] : [],
        paymentMethod: 'كاش' as const,
        description: item.description || '',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        // ✅ ربط العرض ببطاقة العميل الجديدة
        customerId: customer?.id || item.id,
        customerName: customer?.name || customerName,
        features: item.features || [],
        commissionPercentage: item.commissionPercentage,
        serviceDescription: item.serviceDescription
      };
      
      // حفظ في localStorage - customer_offers
      const existingOffers = JSON.parse(localStorage.getItem('customer_offers') || '[]');
      existingOffers.unshift(newOffer);
      localStorage.setItem('customer_offers', JSON.stringify(existingOffers));
      
      console.log('✅ [handlePublish] تم نشر العرض بنجاح:', newOffer.id);
      
      // ============================================================
      // الخطوة 3: إطلاق حدث تحديث العملاء
      // ============================================================
      window.dispatchEvent(new Event('customersUpdated'));
      console.log('✅ [handlePublish] تم إطلاق حدث تحديث العملاء');
      
      alert(`✅ تم نشر العرض وإنشاء بطاقة العميل بنجاح!\n\n📋 اسم العميل: ${customer?.name}\n📞 الجوال: ${phone}`);
    } else {
      console.warn('⚠️ [handlePublish] لا يوجد رقم جوال - سيتم حفظ العرض فقط بدون إنشاء بطاقة عميل');
      
      // حفظ العرض فقط بدون إنشاء عميل
      const newOffer = {
        id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${item.propertyType} - ${item.city} ${item.district ? '- ' + item.district : ''}`,
        propertyType: item.propertyType,
        transactionType: item.transactionType === 'sale' ? 'شراء' : 'استئجار',
        category: item.propertyCategory === 'residential' ? 'سكني' : 'تجاري',
        budget: item.priceFrom || item.priceTo || 0,
        urgency: 'عادي' as const,
        city: item.city,
        districts: item.district ? [item.district] : [],
        paymentMethod: 'كاش' as const,
        description: item.description || '',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        customerId: item.id,
        customerName: customerName,
        features: item.features || [],
        commissionPercentage: item.commissionPercentage,
        serviceDescription: item.serviceDescription
      };
      
      const existingOffers = JSON.parse(localStorage.getItem('customer_offers') || '[]');
      existingOffers.unshift(newOffer);
      localStorage.setItem('customer_offers', JSON.stringify(existingOffers));
      
      alert('✅ تم نشر العرض في لوحة التحكم بنجاح!');
    }
  };

  const handlePublishRequest = (item: ReceivedOffer) => {
    console.log('🎯 [handlePublishRequest] بدء معالجة قبول الطلب...');
    
    // ============================================================
    // 🆕 جلب العرض/الطلب الكامل من localStorage
    // ============================================================
    let fullOffer: any = null;
    
    if (item.fullOfferId) {
      // محاولة جلب العرض الكامل من owner-full-offers
      const currentUser = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
      
      // البحث في جميع ملفات owner-full-offers-* (لجميع المستخدمين)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('owner-full-offers-')) {
          const offers = JSON.parse(localStorage.getItem(key) || '[]');
          const foundOffer = offers.find((o: any) => o.id === item.fullOfferId);
          if (foundOffer) {
            fullOffer = foundOffer;
            console.log('✅ [handlePublishRequest] تم جلب العرض الكامل:', fullOffer);
            break;
          }
        }
        
        // البحث أيضاً في owner-full-requests-*
        if (key && key.startsWith('owner-full-requests-')) {
          const requests = JSON.parse(localStorage.getItem(key) || '[]');
          const foundRequest = requests.find((r: any) => r.id === item.fullOfferId);
          if (foundRequest) {
            fullOffer = foundRequest;
            console.log('✅ [handlePublishRequest] تم جلب الطلب الكامل:', fullOffer);
            break;
          }
        }
      }
    }
    
    // إذا لم نجد العرض الكامل، نستخدم البيانات الموجودة في item
    const offerData = fullOffer || item;
    console.log('📦 [handlePublishRequest] البيانات المستخدمة:', offerData);
    
    // ============================================================
    // 🆕 الخطوة 1: إنشاء بطاقة عميل جديدة تلقائياً بجميع المعلومات
    // ============================================================
    
    // الحصول على رقم الجوال من offerData أو من props
    const phone = offerData.ownerPhone || customerPhone;
    
    if (phone) {
      console.log('📞 [handlePublishRequest] رقم الجوال:', phone);
      
      // التحقق من وجود العميل مسبقاً
      let customer = findCustomerByPhone(phone);
      
      if (!customer) {
        console.log('🆕 [handlePublishRequest] إنشاء بطاقة عميل جديدة بجميع المعلومات...');
        
        // تحديد تصنيف العميل بناءً على نوع الطلب
        let category: 'مالك' | 'مشتري' | 'مؤجر' | 'مستأجر' = 'آخر';
        if (item.userRole === 'seller') category = 'مالك';
        else if (item.userRole === 'buyer') category = 'مشتري';
        else if (item.userRole === 'lessor') category = 'مؤجر';
        else if (item.userRole === 'tenant') category = 'مستأجر';
        
        // 🆕 بناء ملاحظات شاملة تحتوي على كل المعلومات
        let comprehensiveNotes = `طلب ${offerData.propertyType} ${offerData.transactionType === 'sale' ? 'للشراء' : 'للإيجار'} في ${offerData.city}\n`;
        
        // معلومات المالك الكاملة
        if (offerData.ownerName) comprehensiveNotes += `\n👤 المالك: ${offerData.ownerName}`;
        if (offerData.ownerNationalId) comprehensiveNotes += `\n🆔 رقم الهوية: ${offerData.ownerNationalId}`;
        if (offerData.ownerDob) comprehensiveNotes += `\n📅 تاريخ الميلاد: ${offerData.ownerDob}`;
        
        // معلومات الصك
        if (offerData.deedNumber) comprehensiveNotes += `\n\n📜 معلومات الصك:\n  • رقم الصك: ${offerData.deedNumber}`;
        if (offerData.deedDate) comprehensiveNotes += `\n  • تاريخ الصك: ${offerData.deedDate}`;
        
        // الموقع الكامل
        comprehensiveNotes += `\n\n📍 الموقع:`;
        comprehensiveNotes += `\n  • المدينة: ${offerData.city}`;
        if (offerData.district) comprehensiveNotes += `\n  • الحي: ${offerData.district}`;
        if (offerData.street) comprehensiveNotes += `\n  • الشارع: ${offerData.street}`;
        if (offerData.building) comprehensiveNotes += `\n  • المبنى: ${offerData.building}`;
        if (offerData.postalCode) comprehensiveNotes += `\n  • الرمز البريدي: ${offerData.postalCode}`;
        if (offerData.mapLocation) comprehensiveNotes += `\n  • الإحداثيات: ${offerData.mapLocation.lat}, ${offerData.mapLocation.lng}`;
        
        // المواصفات
        comprehensiveNotes += `\n\n🏠 المواصفات:`;
        if (offerData.area) comprehensiveNotes += `\n  • المساحة: ${offerData.area} م²`;
        if (offerData.bedrooms) comprehensiveNotes += `\n  • غرف النوم: ${offerData.bedrooms}`;
        if (offerData.bathrooms) comprehensiveNotes += `\n  • دورات المياه: ${offerData.bathrooms}`;
        if (offerData.storageRooms) comprehensiveNotes += `\n  • مستودعات: ${offerData.storageRooms}`;
        if (offerData.balconies) comprehensiveNotes += `\n  • شرفات: ${offerData.balconies}`;
        if (offerData.parkingSpaces) comprehensiveNotes += `\n  • مواقف السيارات: ${offerData.parkingSpaces}`;
        if (offerData.floors) comprehensiveNotes += `\n  • عدد الأدوار: ${offerData.floors}`;
        if (offerData.entrances) comprehensiveNotes += `\n  • المداخل: ${offerData.entrances}`;
        if (offerData.position) comprehensiveNotes += `\n  • الموقع: ${offerData.position}`;
        if (offerData.level) comprehensiveNotes += `\n  • المستوى: ${offerData.level}`;
        
        // المميزات الإضافية
        const additionalFeatures = [];
        if (offerData.hasAnnex) additionalFeatures.push('ملحق');
        if (offerData.hasMaidRoom) additionalFeatures.push('غرفة خادمة');
        if (offerData.hasLaundryRoom) additionalFeatures.push('غرفة غسيل');
        if (offerData.hasJacuzzi) additionalFeatures.push('جاكوزي');
        if (offerData.hasRainShower) additionalFeatures.push('دش مطري');
        if (offerData.isSmartHome) additionalFeatures.push('منزل ذكي');
        if (offerData.hasSmartEntry) additionalFeatures.push('مدخل ذكي');
        if (offerData.hasPool) additionalFeatures.push('مسبح');
        if (offerData.hasPlayground) additionalFeatures.push('ملعب');
        if (offerData.hasGarden) additionalFeatures.push('حديقة');
        if (offerData.hasElevator) additionalFeatures.push('مصعد');
        if (offerData.hasExternalMajlis) additionalFeatures.push('مجلس خارجي');
        if (offerData.hasPrivateRoof) additionalFeatures.push('سطح خاص');
        if (offerData.isFurnished) additionalFeatures.push('مفروش');
        if (offerData.hasBuiltInKitchen) additionalFeatures.push('مطبخ راكب');
        if (offerData.kitchenWithAppliances) additionalFeatures.push('مطبخ بأجهزته');
        
        if (additionalFeatures.length > 0) {
          comprehensiveNotes += `\n\n✨ المميزات:\n  • ${additionalFeatures.join('\n  • ')}`;
        }
        
        // الأسعار
        comprehensiveNotes += `\n\n💰 السعر:`;
        if (offerData.price) comprehensiveNotes += `\n  • السعر: ${offerData.price.toLocaleString()} ريال`;
        if (offerData.priceFrom) comprehensiveNotes += `\n  • السعر من: ${offerData.priceFrom.toLocaleString()} ريال`;
        if (offerData.priceTo && offerData.priceTo !== offerData.priceFrom) comprehensiveNotes += `\n  • السعر إلى: ${offerData.priceTo.toLocaleString()} ريال`;
        
        // أسعار الإيجار
        if (offerData.rentSingle) comprehensiveNotes += `\n  • إيجار سنوي (دفعة واحدة): ${offerData.rentSingle.toLocaleString()} ريال`;
        if (offerData.rentTwo) comprehensiveNotes += `\n  • إيجار سنوي (دفعتين): ${offerData.rentTwo.toLocaleString()} ريال`;
        if (offerData.rentFour) comprehensiveNotes += `\n  • إيجار سنوي (4 دفعات): ${offerData.rentFour.toLocaleString()} ريال`;
        if (offerData.rentMonthly) comprehensiveNotes += `\n  • إيجار شهري: ${offerData.rentMonthly.toLocaleString()} ريال`;
        
        // الضمانات
        if (offerData.guarantees && offerData.guarantees.length > 0) {
          comprehensiveNotes += `\n\n🛡️ الضمانات:`;
          offerData.guarantees.forEach((g: any) => {
            comprehensiveNotes += `\n  • ${g.type} - ${g.duration} - ${g.notes}`;
          });
        }
        
        // الوصف
        if (offerData.description) comprehensiveNotes += `\n\n📝 الوصف:\n${offerData.description}`;
        
        // الجولة الافتراضية
        if (offerData.virtualTourLink) comprehensiveNotes += `\n\n🎥 رابط الجولة الافتراضية:\n${offerData.virtualTourLink}`;
        
        // معلومات الاتفاقية
        comprehensiveNotes += `\n\n🤝 معلومات الاتفاقية:`;
        comprehensiveNotes += `\n  • نسبة العمولة: ${item.commissionPercentage}%`;
        comprehensiveNotes += `\n  • الخدمات المتفق عليها: ${item.serviceDescription}`;
        comprehensiveNotes += `\n  • تاريخ القبول: ${new Date(item.acceptedAt).toLocaleDateString('ar-SA')}`;
        
        // إنشاء العميل بجميع المعلومات
        customer = createCustomer({
          name: offerData.ownerName || customerName || 'عميل جديد',
          phone: phone,
          category: category,
          source: 'اطلب وسيط - طلب مقبول',
          city: offerData.city,
          district: offerData.district,
          budget: offerData.priceFrom ? `${offerData.priceFrom.toLocaleString()} - ${(offerData.priceTo || offerData.priceFrom).toLocaleString()} ريال` : undefined,
          notes: comprehensiveNotes,
          tags: [
            'اطلب وسيط', 
            offerData.transactionType === 'sale' ? 'شراء' : 'إيجار',
            offerData.propertyType,
            offerData.city
          ],
          status: 'active',
          // 🆕 حفظ البيانات الإضافية كـ JSON في حقل مخصص
          customData: JSON.stringify({
            fullOfferId: item.fullOfferId,
            deedNumber: offerData.deedNumber,
            deedDate: offerData.deedDate,
            ownerNationalId: offerData.ownerNationalId,
            ownerDob: offerData.ownerDob,
            street: offerData.street,
            building: offerData.building,
            postalCode: offerData.postalCode,
            mapLocation: offerData.mapLocation,
            virtualTourLink: offerData.virtualTourLink,
            features: offerData.features,
            guarantees: offerData.guarantees,
            mediaIds: offerData.mediaIds,
            commissionPercentage: item.commissionPercentage,
            serviceDescription: item.serviceDescription,
            acceptedAt: item.acceptedAt
          })
        });
        
        console.log('✅ [handlePublishRequest] تم إنشاء بطاقة العميل بجميع المعلومات:', customer.id, customer.name);
      } else {
        console.log('✅ [handlePublishRequest] العميل موجود مسبقاً:', customer.id, customer.name);
      }
      
      // ============================================================
      // الخطوة 2: نشر الطلب في لوحة التحكم (كما هو)
      // ============================================================
      
      const newRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${item.propertyType} - ${item.city} ${item.district ? '- ' + item.district : ''}`,
        propertyType: item.propertyType,
        transactionType: item.transactionType === 'sale' ? 'شراء' : 'استئجار',
        category: item.propertyCategory === 'residential' ? 'سكني' : 'تجاري',
        budget: item.priceFrom || item.priceTo || 0,
        urgency: 'عادي' as const,
        city: item.city,
        districts: item.district ? [item.district] : [],
        paymentMethod: 'كاش' as const,
        description: item.description || '',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        // ✅ ربط الطلب ببطاقة العميل الجديدة
        customerId: customer?.id || item.id,
        customerName: customer?.name || customerName,
        features: item.features || [],
        commissionPercentage: item.commissionPercentage,
        serviceDescription: item.serviceDescription
      };
      
      // حفظ في localStorage - customer_requests
      const existingRequests = JSON.parse(localStorage.getItem('customer_requests') || '[]');
      existingRequests.unshift(newRequest);
      localStorage.setItem('customer_requests', JSON.stringify(existingRequests));
      
      console.log('✅ [handlePublishRequest] تم نشر الطلب بنجاح:', newRequest.id);
      
      // ============================================================
      // الخطوة 3: إطلاق حدث تحديث العملاء
      // ============================================================
      window.dispatchEvent(new Event('customersUpdated'));
      console.log('✅ [handlePublishRequest] تم إطلاق حدث تحديث العملاء');
      
      alert(`✅ تم نشر الطلب وإنشاء بطاقة العميل بنجاح!\n\n📋 اسم العميل: ${customer?.name}\n📞 الجوال: ${phone}`);
    } else {
      console.warn('⚠️ [handlePublishRequest] لا يوجد رقم جوال - سيتم حفظ الطلب فقط بدون إنشاء بطاقة عميل');
      
      // حفظ الطلب فقط بدون إنشاء عميل
      const newRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${item.propertyType} - ${item.city} ${item.district ? '- ' + item.district : ''}`,
        propertyType: item.propertyType,
        transactionType: item.transactionType === 'sale' ? 'شراء' : 'استئجار',
        category: item.propertyCategory === 'residential' ? 'سكني' : 'تجاري',
        budget: item.priceFrom || item.priceTo || 0,
        urgency: 'عادي' as const,
        city: item.city,
        districts: item.district ? [item.district] : [],
        paymentMethod: 'كاش' as const,
        description: item.description || '',
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        customerId: item.id,
        customerName: customerName,
        features: item.features || [],
        commissionPercentage: item.commissionPercentage,
        serviceDescription: item.serviceDescription
      };
      
      const existingRequests = JSON.parse(localStorage.getItem('customer_requests') || '[]');
      existingRequests.unshift(newRequest);
      localStorage.setItem('customer_requests', JSON.stringify(existingRequests));
      
      alert('✅ تم نشر الطلب في لوحة التحكم بنجاح!');
    }
  };

  const handleDownloadPDF = (item: ReceivedOffer) => {
    // إنشاء محتوى HTML للاتفاقية
    const pdfContent = `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>اتفاقية عمولة عقارية</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #01411C; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #01411C; margin: 0; }
    .header p { color: #D4AF37; margin: 5px 0; }
    .section { margin-bottom: 25px; padding: 20px; background: #f9f9f9; border-right: 4px solid #D4AF37; }
    .section h2 { color: #01411C; margin-top: 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
    .info-label { font-weight: bold; color: #555; }
    .info-value { color: #000; }
    .agreement-box { background: #fff8e1; border: 2px solid #D4AF37; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .agreement-box h3 { color: #01411C; margin-top: 0; }
    .image { max-width: 300px; max-height: 300px; border: 2px solid #01411C; margin: 10px auto; display: block; }
    .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #01411C; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 اتفاقية عمولة عقارية</h1>
    <p>نظام عقاري CRM</p>
    <p>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
  </div>

  <div class="section">
    <h2>📋 تاصيل العقار</h2>
    <div class="info-row">
      <span class="info-label">نوع العقار:</span>
      <span class="info-value">${item.propertyType}</span>
    </div>
    <div class="info-row">
      <span class="info-label">الموقع:</span>
      <span class="info-value">${item.city}${item.district ? ' - ' + item.district : ''}</span>
    </div>
    <div class="info-row">
      <span class="info-label">المساحة:</span>
      <span class="info-value">${item.area || 'غير محدد'} م²</span>
    </div>
    <div class="info-row">
      <span class="info-label">الغرض:</span>
      <span class="info-value">${item.transactionType === 'sale' ? 'للبيع' : 'للإيجار'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">التصنيف:</span>
      <span class="info-value">${item.propertyCategory === 'residential' ? 'سكني' : 'تجاري'}</span>
    </div>
  </div>

  ${item.images && item.images.length > 0 ? `
  <div class="section">
    <h2>📷 صورة العقار</h2>
    <img src="${item.images[0]}" alt="صورة العقار" class="image">
  </div>
  ` : ''}

  <div class="agreement-box">
    <h3>💰 تفاصيل الاتفاقية</h3>
    <div class="info-row">
      <span class="info-label">عرض المالك:</span>
      <span class="info-value">
        ${item.priceFrom && item.priceTo 
          ? `${item.priceFrom.toLocaleString()} - ${item.priceTo.toLocaleString()} ريال`
          : item.priceFrom 
          ? `${item.priceFrom.toLocaleString()} ريال`
          : item.priceTo 
          ? `${item.priceTo.toLocaleString()} ريال`
          : 'غير محدد'
        }
      </span>
    </div>
    <div class="info-row">
      <span class="info-label">نسبة العمولة المتفق عليها:</span>
      <span class="info-value" style="color: #D4AF37; font-weight: bold; font-size: 1.2em;">
        ${item.commissionPercentage}%
      </span>
    </div>
    <div class="info-row">
      <span class="info-label">الخدمات المقدمة:</span>
      <span class="info-value">${item.serviceDescription}</span>
    </div>
  </div>

  <div class="section">
    <h2>📝 الوصف</h2>
    <p>${item.description}</p>
  </div>

  ${item.features && item.features.length > 0 ? `
  <div class="section">
    <h2>✨ المميزات</h2>
    <p>${item.features.join(' • ')}</p>
  </div>
  ` : ''}

  <div class="section">
    <h2>👤 معلومات الأطراف</h2>
    <div class="info-row">
      <span class="info-label">العميل (${item.userRole === 'seller' ? 'البائع' : item.userRole === 'lessor' ? 'المؤجر' : item.userRole === 'buyer' ? 'المشتري' : 'المستأجر'}):</span>
      <span class="info-value">${customerName || item.ownerName || 'غير محدد'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">رقم الجوال:</span>
      <span class="info-value">${customerPhone || item.ownerPhone || 'غير محدد'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">تاريخ الاتفاق:</span>
      <span class="info-value">${new Date(item.acceptedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </div>
  </div>

  <div class="footer">
    <p>هذا المستند تم إنشاؤه تلقائياً من نظام عقاري CRM</p>
    <p>لحفظ الحقوق وتوثيق الاتفاقية</p>
  </div>
</body>
</html>
    `.trim();

    // فتح نافذة جديدة للطباعة/الحفظ
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // الانتظار حتى يتم تحميل الصورة ثم الطباعة
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      alert('✅ تم فتح نافذة الطباعة. يمكنك حفظ الاتفاقية كـ PDF من خيار "حفظ كـ PDF"');
    } else {
      alert('⚠️ يرجى السماح بفتح النوافذ المنبثقة لتحميل الاتفاقية');
    }
  };

  const allOffers = activeTab === 'offers' ? offersWithMedia : requestsWithMedia;

  if (receivedOffers.length === 0 && receivedRequests.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">لا توجد عروض أو طلبات مستقبلة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#01411C] to-[#065f41] rounded-xl p-4">
        <h3 className="text-lg text-white font-semibold">
          العروض والطلبات من {customerName}
        </h3>
        <p className="text-white/80 text-sm mt-1">
          العروض والطلبات التي تم قبول عرضك عليها
        </p>
      </div>

      {/* Tabs - Only show if both exist */}
      {receivedOffers.length > 0 && receivedRequests.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'offers'
                ? 'bg-[#01411C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>العروض المستقبلة ({receivedOffers.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'requests'
                ? 'bg-[#01411C] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>الطلبات المستقبلة ({receivedRequests.length})</span>
            </div>
          </button>
        </div>
      )}

      {/* Single Tab Header - Show if only one type exists */}
      {receivedOffers.length > 0 && receivedRequests.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-900">
            <FileText className="w-5 h-5" />
            <span className="font-medium">العروض المستقبلة ({receivedOffers.length})</span>
          </div>
        </div>
      )}

      {receivedRequests.length > 0 && receivedOffers.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-900">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">الطلبات المستقبلة ({receivedRequests.length})</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {allOffers.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#D4AF37] transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.offerType === 'offer' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {item.offerType === 'offer' ? (
                    <Building className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.propertyType}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{item.city}</span>
                    {item.district && <span>• {item.district}</span>}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.transactionType === 'sale'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {item.transactionType === 'sale' ? 'للبيع' : 'للإيجار'}
              </span>
            </div>

            {/* Property Details - كل المعلومات الأصلية */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
              <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>تفاصيل العقار الكاملة</span>
              </h5>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                {/* نوع الاستخدام */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-700">
                    {item.propertyCategory === 'residential' ? 'سكني' : 'تجاري'}
                  </span>
                </div>

                {/* المساحة */}
                {item.area && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{item.area} م²</span>
                  </div>
                )}

                {/* السعر */}
                {(item.priceFrom || item.priceTo) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">
                      {item.priceFrom && item.priceTo 
                        ? `${item.priceFrom.toLocaleString()} - ${item.priceTo.toLocaleString()} ريال`
                        : item.priceFrom 
                        ? `${item.priceFrom.toLocaleString()} ريال`
                        : `${item.priceTo?.toLocaleString()} ريال`
                      }
                    </span>
                  </div>
                )}

                {/* دور المستخدم */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-700">
                    {item.userRole === 'seller' ? 'بائع' : 
                     item.userRole === 'lessor' ? 'مؤجر' : 
                     item.userRole === 'buyer' ? 'مشتري' : 'مستأجر'}
                  </span>
                </div>
              </div>

              {/* الوصف */}
              {item.description && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )}

              {/* المميزات */}
              {item.features && (() => {
                // التحقق من نوع features: إذا كان object نحوله لعرض مناسب
                if (typeof item.features === 'object' && !Array.isArray(item.features)) {
                  const features = item.features as any;
                  const featuresList: string[] = [];
                  
                  // استخراج المميزات من الـ object
                  if (features.bedrooms) featuresList.push(`${features.bedrooms} غرف نوم`);
                  if (features.bathrooms) featuresList.push(`${features.bathrooms} دورات مياه`);
                  if (features.parkingSpaces) featuresList.push(`${features.parkingSpaces} مواقف سيارات`);
                  if (features.floors) featuresList.push(`${features.floors} أدوار`);
                  if (features.storageRooms) featuresList.push(`${features.storageRooms} مستودعات`);
                  if (features.balconies) featuresList.push(`${features.balconies} شرفات`);
                  if (features.curtains) featuresList.push(`${features.curtains} ستائر`);
                  if (features.airConditioners) featuresList.push(`${features.airConditioners} مكيفات`);
                  
                  if (features.entrances) featuresList.push(`${features.entrances}`);
                  if (features.position) featuresList.push(`الموقع: ${features.position}`);
                  if (features.level) featuresList.push(`${features.level}`);
                  
                  if (features.hasAnnex) featuresList.push('ملحق');
                  if (features.hasMaidRoom) featuresList.push('غرفة خادمة');
                  if (features.hasLaundryRoom) featuresList.push('غرفة غسيل');
                  if (features.hasJacuzzi) featuresList.push('جاكوزي');
                  if (features.hasRainShower) featuresList.push('دش مطري');
                  if (features.isSmartHome) featuresList.push('منزل ذكي');
                  if (features.hasSmartEntry) featuresList.push('مدخل ذكي');
                  if (features.hasPool) featuresList.push('مسبح');
                  if (features.hasPlayground) featuresList.push('ملعب');
                  if (features.hasGarden) featuresList.push('حديقة');
                  if (features.hasElevator) featuresList.push('مصعد');
                  if (features.hasExternalMajlis) featuresList.push('مجلس خارجي');
                  if (features.hasPrivateRoof) featuresList.push('سطح خاص');
                  if (features.isFurnished) featuresList.push('مفروش');
                  if (features.hasBuiltInKitchen) featuresList.push('مطبخ راكب');
                  if (features.kitchenWithAppliances) featuresList.push('مطبخ بأجهزته');
                  
                  if (features.kitchenAppliances && Array.isArray(features.kitchenAppliances) && features.kitchenAppliances.length > 0) {
                    featuresList.push(...features.kitchenAppliances);
                  }
                  
                  if (featuresList.length > 0) {
                    return (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <h6 className="text-sm font-medium text-blue-900 mb-2">المميزات:</h6>
                        <div className="flex flex-wrap gap-2">
                          {featuresList.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-800"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                } else if (Array.isArray(item.features) && item.features.length > 0) {
                  // إذا كان array (كما كان سابقاً)
                  return (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <h6 className="text-sm font-medium text-blue-900 mb-2">المميزات:</h6>
                      <div className="flex flex-wrap gap-2">
                        {item.features.map((feature, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              {/* 🆕 الصور والفيديو */}
              {((item.images && item.images.length > 0) || (item.videos && item.videos.length > 0)) && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h6 className="text-sm font-medium text-blue-900 mb-2">صور وفيديو العقار:</h6>
                  
                  {/* الصور */}
                  {item.images && item.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {item.images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`صورة ${idx + 1}`} 
                          className="w-full h-24 object-cover rounded-lg border border-blue-300"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* الفيديو */}
                  {item.videos && item.videos.length > 0 && (
                    <div className="space-y-2">
                      {item.videos.map((video, idx) => (
                        <video 
                          key={idx}
                          src={video} 
                          controls 
                          className="w-full max-h-32 rounded-lg border border-blue-300"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 🆕 مستطيل الاتفاقية - بلون مختلف */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 mb-3 shadow-sm">
              <h5 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>تفاصيل الاتفاقية</span>
              </h5>
              
              <div className="space-y-3">
                {/* عرض المالك */}
                <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-900 font-medium">💰 عرض المالك:</span>
                    <span className="text-lg font-bold text-amber-900">
                      {item.priceFrom && item.priceTo 
                        ? `${item.priceFrom.toLocaleString()} - ${item.priceTo.toLocaleString()} ريال`
                        : item.priceFrom 
                        ? `${item.priceFrom.toLocaleString()} ريال`
                        : item.priceTo 
                        ? `${item.priceTo.toLocaleString()} ريال`
                        : 'غير محدد'
                      }
                    </span>
                  </div>
                </div>
                
                {/* عرض الوسيط */}
                <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-900 font-medium">🤝 عمولة الوسيط:</span>
                    <div className="flex items-center gap-1">
                      <Percent className="w-5 h-5 text-amber-900" />
                      <span className="text-xl font-bold text-amber-900">{item.commissionPercentage}%</span>
                    </div>
                  </div>
                </div>
                
                {/* الخدمات المتفق عليها */}
                <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-semibold">الخدمات:</span> {item.serviceDescription}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-amber-300">
                <p className="text-xs text-amber-700 text-center italic">
                  ⚠️ هذه المعلومات لن يتم نقلها عند النشر - خاصة بالاتفاقية فقط
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handlePublish(item)}
                className="flex-1 px-3 py-2 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>نشر</span>
              </button>
              <button
                onClick={() => handleDownloadPDF(item)}
                className="flex-1 px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل PDF</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                تم القبول في: {new Date(item.acceptedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* 🆕 مودال الترخيص الإعلاني */}
      <LicenseModal
        isOpen={showLicenseModal}
        onClose={() => {
          setShowLicenseModal(false);
          setSelectedOfferForPublish(null);
          setAdvertisingLicense('');
        }}
        onConfirm={(license) => proceedWithPublish(license)}
        onContinueWithoutLicense={() => proceedWithPublish('')}
      />
    </div>
  );
}