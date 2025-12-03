import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RegistrationData, Address, PropertyFeatures, Offer, Guarantee, PriceSuggestion, AIDescriptionRequest, AIDescriptionResponse } from "../../types/owners";
import { Save, MapPin, Home, FileText, Upload, Plus, Minus, X, Camera, Star, Hash, Sparkles, TrendingUp, DollarSign, RefreshCw, Info, CheckCircle, Wand2, Copy } from "lucide-react";

interface SaleOfferFormProps {
  user?: RegistrationData;
  onSave: (offer: Partial<Offer>) => void;
  onCancel: () => void;
  initialData?: Partial<Offer>;
}

const propertyTypes = ['شقة', 'فيلا', 'أرض', 'دبلكس', 'تجاري', 'استراحة', 'مزرعة', 'مخزن', 'مكتب'];
const kitchenAppliances = ['ثلاجة', 'غسالة', 'غسالة أطباق', 'فرن', 'مكروويف', 'خلاط', 'محضرة طعام', 'صانعة قهوة', 'غلاية كهربائية', 'محمصة'];

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  isPrimary?: boolean;
}

export function SaleOfferForm({ user, onSave, onCancel }: SaleOfferFormProps) {
  // نوع العملية
  const [offerType, setOfferType] = useState<'sale' | 'rent'>('sale');
  
  // بيانات الاتصال
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [nationalId, setNationalId] = useState(user?.nationalId || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // تفاصيل الموقع
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [building, setBuilding] = useState('');

  // تفاصيل العقار
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [area, setArea] = useState<number>();

  // المواصفات
  const [entrances, setEntrances] = useState('مدخل واحد');
  const [position, setPosition] = useState('بطن');
  const [level, setLevel] = useState('أرضي');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [storageRooms, setStorageRooms] = useState(0);
  const [balconies, setBalconies] = useState(0);
  const [curtains, setCurtains] = useState(0);
  const [airConditioners, setAirConditioners] = useState(0);
  const [parkingSpaces, setParkingSpaces] = useState(0);
  const [floors, setFloors] = useState(1);

  // خصائص منطقية
  const [hasAnnex, setHasAnnex] = useState(false);
  const [hasMaidRoom, setHasMaidRoom] = useState(false);
  const [hasLaundryRoom, setHasLaundryRoom] = useState(false);
  const [hasJacuzzi, setHasJacuzzi] = useState(false);
  const [hasRainShower, setHasRainShower] = useState(false);
  const [isSmartHome, setIsSmartHome] = useState(false);
  const [hasSmartEntry, setHasSmartEntry] = useState(false);
  const [hasPool, setHasPool] = useState(false);
  const [hasPlayground, setHasPlayground] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [hasExternalMajlis, setHasExternalMajlis] = useState(false);
  const [hasPrivateRoof, setHasPrivateRoof] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);
  const [hasBuiltInKitchen, setHasBuiltInKitchen] = useState(false);
  const [kitchenWithAppliances, setKitchenWithAppliances] = useState(false);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);

  // الضمانات (متعددة)
  const [guarantees, setGuarantees] = useState<Array<{
    id: string;
    type: string;
    duration: string;
    notes: string;
  }>>([]);

  // إحداثيات الموقع
  const [mapLocation, setMapLocation] = useState<{lat: number; lng: number} | null>(null);

  // الصك
  const [deedNumber, setDeedNumber] = useState('');
  const [deedDate, setDeedDate] = useState('');

  // السعر والوصف
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState('');
  
  // أسعار الإيجار
  const [rentPaymentMethods, setRentPaymentMethods] = useState<string[]>([]);
  const [rentSingle, setRentSingle] = useState<number>();
  const [rentTwo, setRentTwo] = useState<number>();
  const [rentFour, setRentFour] = useState<number>();
  const [rentMonthly, setRentMonthly] = useState<number>();

  // الصور والفيديو
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploadQuality, setUploadQuality] = useState<'standard' | 'hd'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // الجولة الافتراضية
  const [virtualTourLink, setVirtualTourLink] = useState('');

  // المميزات المخصصة
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);
  const [newCustomFeature, setNewCustomFeature] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // States جديدة للـ PriceSuggest
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  // States جديدة للـ AIDescription
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<AIDescriptionResponse | null>(null);
  const [selectedAISuggestion, setSelectedAISuggestion] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // رفع الملفات
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const imageCount = mediaFiles.filter(f => f.type === 'image').length;
    const videoCount = mediaFiles.filter(f => f.type === 'video').length;

    Array.from(files).forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      if (fileType === 'image' && imageCount >= 10) return;
      if (fileType === 'video' && videoCount >= 1) return;

      // ✅ تحويل إلى Base64 بالحجم الكامل
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaFiles(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          type: fileType,
          url: e.target?.result as string,
          isPrimary: fileType === 'image' && mediaFiles.length === 0
        }]);
        console.log(`📸 [SaleOfferForm] تم رفع ${fileType} بالحجم الكامل`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setMediaFiles(prev => prev.filter(f => f.id !== id));
  };

  const setPrimaryImage = (id: string) => {
    setMediaFiles(prev => prev.map(f => ({ ...f, isPrimary: f.id === id && f.type === 'image' })));
  };

  // المميزات المخصصة
  const addCustomFeature = () => {
    if (newCustomFeature.trim() && !customFeatures.includes(newCustomFeature.trim())) {
      setCustomFeatures([...customFeatures, newCustomFeature.trim()]);
      setNewCustomFeature('');
    }
  };

  const removeCustomFeature = (feature: string) => {
    setCustomFeatures(customFeatures.filter(f => f !== feature));
  };

  // تبديل الأجهزة
  const toggleAppliance = (appliance: string) => {
    setSelectedAppliances(prev =>
      prev.includes(appliance) ? prev.filter(a => a !== appliance) : [...prev, appliance]
    );
  };

  // العدادات
  const Counter = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
      <span className="text-sm text-[#01411C] mb-2">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center">
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-semibold text-[#01411C]">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="w-8 h-8 bg-[#D4AF37] hover:bg-[#f1c40f] rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4 text-[#01411C]" />
        </button>
      </div>
    </div>
  );

  // حساب الهاشتاقات
  const getAutoHashtags = () => {
    const tags: string[] = [];
    if (propertyType) tags.push(`#${propertyType}`);
    if (city) tags.push(`#${city}`);
    if (district) tags.push(`#${district}`);
    if (bedrooms > 0) tags.push(`#${bedrooms}_غرف`);
    if (guarantees.length > 0) tags.push('#ضمان');
    if (hasPool) tags.push('#مسبح');
    if (hasGarden) tags.push('#حديقة');
    if (isFurnished) tags.push('#مفروش');
    return tags;
  };

  // الحفظ
  const handleSave = async () => {
    setIsLoading(true);
    
    const features: PropertyFeatures = {
      entrances, position, level,
      bedrooms, bathrooms, storageRooms, balconies, curtains, airConditioners, parkingSpaces, floors,
      hasAnnex, hasMaidRoom, hasLaundryRoom, hasJacuzzi, hasRainShower,
      isSmartHome, hasSmartEntry, hasPool, hasPlayground, hasGarden,
      hasElevator, hasExternalMajlis, hasPrivateRoof, isFurnished,
      hasBuiltInKitchen, kitchenWithAppliances, kitchenAppliances: selectedAppliances
    };

    const offerData: Partial<Offer> = {
      contact: { fullName, nationalId, dob, phone, email: user?.email || '' },
      title,
      type: propertyType,
      areaM2: area,
      address: { city, district, street, postalCode, building },
      features,
      guarantees: offerType === 'sale' ? guarantees.map(g => ({ type: g.type, duration: g.duration, notes: g.notes })) : [],
      deedNumber,
      deedDate,
      pricePlan: offerType === 'sale' 
        ? { salePrice: price, currency: 'SAR' } 
        : { rentSingle, rentTwo, rentFour, monthly: rentMonthly, currency: 'SAR' },
      description: description.startsWith(offerType === 'sale' ? 'للبيع:' : 'للإيجار:') ? description : `${offerType === 'sale' ? 'للبيع:' : 'للإيجار:'} ${description}`,
      images: mediaFiles.filter(f => f.type === 'image').map(f => f.url),
      offerType: offerType === 'sale' ? 'sale' : 'rent'
    };

    await onSave(offerData);

    // 🆕 1) حفظ الصور والفيديو في IndexedDB وجلب IDs
    const fullOfferId = `full-offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const mediaToSave = mediaFiles.map(f => ({ 
      type: f.type, 
      dataUrl: f.url 
    }));
    
    let mediaIds: string[] = [];
    if (mediaToSave.length > 0) {
      console.log(`💾 [SaleOfferForm] حفظ ${mediaToSave.length} ملف في IndexedDB...`);
      const { saveMultipleMediaToIndexedDB } = await import('../../utils/indexedDBStorage');
      mediaIds = await saveMultipleMediaToIndexedDB(fullOfferId, mediaToSave);
      console.log(`✅ [SaleOfferForm] تم حفظ الملفات في IndexedDB:`, mediaIds);
    }

    // 🆕 2) حفظ العرض الكامل مع IDs فقط (بدون Base64)
    const fullOfferData = {
      id: fullOfferId,
      title: title || `${propertyType} ${offerType === 'sale' ? 'للبيع' : 'للإيجار'} - ${city}`,
      type: offerType,
      transactionType: offerType,
      propertyType,
      propertyCategory: 'residential',
      
      // معلومات المالك الكاملة
      ownerName: fullName,
      ownerPhone: phone,
      ownerNationalId: nationalId,
      ownerDob: dob,
      
      // الموقع الكامل
      city,
      district,
      street,
      postalCode,
      building,
      mapLocation,
      
      // المواصفات الكاملة
      area,
      price: offerType === 'sale' ? price : rentSingle,
      priceFrom: offerType === 'sale' ? price : rentSingle,
      priceTo: offerType === 'sale' ? price : rentSingle,
      
      // أسعار الإيجار
      rentPaymentMethods,
      rentSingle,
      rentTwo,
      rentFour,
      rentMonthly,
      
      // الغرف والمرافق
      bedrooms,
      bathrooms,
      storageRooms,
      balconies,
      curtains,
      airConditioners,
      parkingSpaces,
      floors,
      
      // المواصفات الإضافية
      entrances,
      position,
      level,
      
      // الخصائص المنطقية
      hasAnnex,
      hasMaidRoom,
      hasLaundryRoom,
      hasJacuzzi,
      hasRainShower,
      isSmartHome,
      hasSmartEntry,
      hasPool,
      hasPlayground,
      hasGarden,
      hasElevator,
      hasExternalMajlis,
      hasPrivateRoof,
      isFurnished,
      hasBuiltInKitchen,
      kitchenWithAppliances,
      selectedAppliances,
      
      // الصك
      deedNumber,
      deedDate,
      
      // الضمانات
      guarantees,
      
      // الوصف والمميزات
      description: description || title,
      features: features,
      customFeatures,
      
      // الجولة الافتراضية
      virtualTourLink,
      
      // 🆕 حفظ IDs فقط (بدلاً من Base64)
      mediaIds: mediaIds,
      
      // حالة العرض
      status: 'active',
      brokerResponses: [],
      acceptedBrokers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // حفظ العرض الكامل - استخدام userId بدلاً من phone
    const currentUser = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    const userId = currentUser.id || user?.id || 'demo-user';
    const ownerFullOffersKey = `owner-full-offers-${userId}`;
    const existingFullOffers = JSON.parse(localStorage.getItem(ownerFullOffersKey) || '[]');
    existingFullOffers.push(fullOfferData);
    localStorage.setItem(ownerFullOffersKey, JSON.stringify(existingFullOffers));
    
    console.log('✅ [SaleOfferForm] تم حفظ العرض الكامل (مع IDs فقط):', fullOfferData);

    // 🆕 3) نشر نسخة مختصرة في Marketplace
    const marketplaceOffer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullOfferId: fullOfferId, // 🔗 مرجع للعرض الكامل
      title: title || `${propertyType} ${offerType === 'sale' ? 'للبيع' : 'للإيجار'}`,
      type: 'offer' as const,
      transactionType: offerType === 'sale' ? 'sale' as const : 'rent' as const,
      propertyCategory: 'residential' as const,
      userRole: offerType === 'sale' ? 'seller' as const : 'lessor' as const,
      userId: user?.id || 'unknown',
      userName: fullName,
      userPhone: phone,
      propertyType,
      city,
      district,
      area,
      priceFrom: offerType === 'sale' ? price : rentSingle,
      priceTo: offerType === 'sale' ? price : rentSingle,
      description: (description || title).substring(0, 150) + ((description || title).length > 150 ? '...' : ''),
      // 🆕 بدون صور في marketplace (لتوفير المساحة)
      status: 'active' as const,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingMarketplaceOffers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
    existingMarketplaceOffers.push(marketplaceOffer);
    localStorage.setItem('marketplace-offers', JSON.stringify(existingMarketplaceOffers));
    
    console.log('✅ [SaleOfferForm] تم نشر النسخة المختصرة في Marketplace:', marketplaceOffer);

    setIsLoading(false);
  };

  // ============= PriceSuggest Functions =============
  
  const fetchPriceSuggestion = useCallback(async () => {
    if (!city || !propertyType) return;

    try {
      setIsPriceLoading(true);

      const params = new URLSearchParams({
        city: city,
        type: propertyType,
        mode: offerType
      });

      if (district) params.append('district', district);
      if (area) params.append('area', area.toString());

      const response = await fetch(`/api/pricing/suggest?${params}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب اقتراحات الأسعار');
      }

      const data = await response.json();
      setPriceSuggestion(data);

    } catch (err) {
      // معالجة صامتة - استخدام النظام الذكي المحلي
      
      // Fallback: اقتراح ذكي محلي
      let basePrice = offerType === 'sale' ? 1000000 : 50000;
      
      if (city) {
        const cityMultipliers: { [key: string]: number } = {
          'الرياض': 1.2, 'جدة': 1.1, 'الدمام': 1.0, 'مكة': 0.9, 'المدينة': 0.9
        };
        basePrice *= cityMultipliers[city] || 1.0;
      }
      
      if (propertyType) {
        const typeMultipliers: { [key: string]: number } = {
          'فيلا': 1.5, 'شقة': 1.0, 'دبلكس': 1.3, 'أرض': 0.8
        };
        basePrice *= typeMultipliers[propertyType] || 1.0;
      }
      
      if (area) {
        if (area > 300) basePrice *= 1.3;
        else if (area > 200) basePrice *= 1.1;
        else if (area < 100) basePrice *= 0.8;
      }
      
      const mockSuggestion: PriceSuggestion = {
        min: Math.round(basePrice * 0.85),
        max: Math.round(basePrice * 1.25),
        average: Math.round(basePrice),
        confidence: 70,
        basedOn: [
          'تحليل السوق المحلي',
          `معدل أسعار ${propertyType || 'العقارات'} في ${city || 'المنطقة'}`,
          'مقارنة مع العقارات المماثلة',
          'الاتجاهات السعرية الحالية'
        ]
      };
      
      setPriceSuggestion(mockSuggestion);
    } finally {
      setIsPriceLoading(false);
    }
  }, [city, district, propertyType, area, offerType]);

  useEffect(() => {
    if (city && propertyType) {
      fetchPriceSuggestion();
    }
  }, [fetchPriceSuggestion]);

  const handlePriceSelect = (priceValue: number) => {
    setSelectedPrice(priceValue);
    if (offerType === 'sale') {
      setPrice(priceValue);
    } else {
      setRentSingle(priceValue);
    }
  };

  const formatPrice = (priceValue: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceValue);
  };

  // ============= AIDescription Functions =============
  
  const getModePrefix = (mode: string): string => {
    switch (mode) {
      case 'sale': return 'للبيع:';
      case 'rent': return 'للإيجار:';
      case 'buy-request': return 'مطلوب:';
      case 'rent-request': return 'مطلوب:';
      default: return '';
    }
  };

  const generateMockDescription = (
    mode: string, 
    type?: string, 
    cityName?: string, 
    districtName?: string, 
    feats?: PropertyFeatures,
    variant: number = 0
  ): string => {
    const prefix = getModePrefix(mode);
    const property = type || 'عقار';
    const location = districtName && cityName ? `في ${districtName}, ${cityName}` : (cityName ? `في ${cityName}` : 'في موقع مميز');
    
    const descriptions = [
      `${prefix} ${property} ${location}، يتميز بموقع استراتيجي وتصميم عصري. العقار مطابق للمواصفات العالمية ويوفر راحة وأمان للسكن.`,
      `${prefix} ${property} فاخر ${location}، يجمع بين الأناقة والعملية. مساحات واسعة وتشطيبات عالية الجودة تجعله الخيار الأمثل.`,
      `${prefix} ${property} مميز ${location}، بتصميم معاصر ومرافق متكاملة. يوفر بيئة سكنية هادئة ومريحة للعائلات.`,
      `${prefix} ${property} راقي ${location}، يتميز بإطلالة جميلة وقرب من الخدمات الأساسية. فرصة استثمارية ممتازة.`
    ];

    let desc = descriptions[variant] || descriptions[0];

    if (feats) {
      const featuresList = [];
      if (feats.bedrooms) featuresList.push(`${feats.bedrooms} غرف نوم`);
      if (feats.bathrooms) featuresList.push(`${feats.bathrooms} دورات مياه`);
      if (feats.hasPool) featuresList.push('مسبح');
      if (feats.hasGarden) featuresList.push('حديقة');
      if (feats.hasElevator) featuresList.push('مصعد');
      
      if (featuresList.length > 0) {
        desc += ` يشمل: ${featuresList.join('، ')}.`;
      }
    }

    return desc;
  };

  const generateAIDescription = useCallback(async () => {
    try {
      setIsAILoading(true);

      const currentFeatures: PropertyFeatures = {
        entrances, position, level,
        bedrooms, bathrooms, storageRooms, balconies, curtains, airConditioners, parkingSpaces, floors,
        hasAnnex, hasMaidRoom, hasLaundryRoom, hasJacuzzi, hasRainShower,
        isSmartHome, hasSmartEntry, hasPool, hasPlayground, hasGarden,
        hasElevator, hasExternalMajlis, hasPrivateRoof, isFurnished,
        hasBuiltInKitchen, kitchenWithAppliances, kitchenAppliances: selectedAppliances
      };

      const request: AIDescriptionRequest = {
        mode: offerType === 'sale' ? 'sale' : 'rent',
        city,
        district,
        type: propertyType,
        features: currentFeatures,
        price: offerType === 'sale' ? price : (rentSingle || rentTwo || rentFour || rentMonthly)
      };

      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
      }

      const data: AIDescriptionResponse = await response.json();
      setAISuggestions(data);
      setSelectedAISuggestion(data.description);

    } catch (err) {
      // معالجة صامتة - استخدام النظام الذكي المحلي
      
      const mode = offerType === 'sale' ? 'sale' : 'rent';
      let descriptionWithPrices = generateMockDescription(mode, propertyType, city, district, {
          entrances, position, level,
          bedrooms, bathrooms, storageRooms, balconies, curtains, airConditioners, parkingSpaces, floors,
          hasAnnex, hasMaidRoom, hasLaundryRoom, hasJacuzzi, hasRainShower,
          isSmartHome, hasSmartEntry, hasPool, hasPlayground, hasGarden,
          hasElevator, hasExternalMajlis, hasPrivateRoof, isFurnished,
          hasBuiltInKitchen, kitchenWithAppliances, kitchenAppliances: selectedAppliances
        });
      
      if (offerType === 'rent' && rentPaymentMethods.length > 0) {
        const prices = [];
        if (rentPaymentMethods.includes('دفعة') && rentSingle) prices.push(`دفعة واحدة: ${new Intl.NumberFormat('ar-SA').format(rentSingle)} ريال`);
        if (rentPaymentMethods.includes('دفعتان') && rentTwo) prices.push(`دفعتان: ${new Intl.NumberFormat('ar-SA').format(rentTwo)} ريال`);
        if (rentPaymentMethods.includes('أربع دفعات') && rentFour) prices.push(`أربع دفعات: ${new Intl.NumberFormat('ar-SA').format(rentFour)} ريال`);
        if (rentPaymentMethods.includes('شهري') && rentMonthly) prices.push(`شهري: ${new Intl.NumberFormat('ar-SA').format(rentMonthly)} ريال`);
        
        if (prices.length > 0) {
          descriptionWithPrices += `\n\nالأسعار المتاحة:\n${prices.join('\n')}`;
        }
      }
      
      const mockSuggestions: AIDescriptionResponse = {
        title: getModePrefix(mode),
        description: descriptionWithPrices,
        suggestions: [
          generateMockDescription(mode, propertyType, city, district, undefined, 1),
          generateMockDescription(mode, propertyType, city, district, undefined, 2),
          generateMockDescription(mode, propertyType, city, district, undefined, 3)
        ],
        neighborhoods: district ? ['الأحياء المجاورة', 'المنطقة المحيطة'] : []
      };
      
      setAISuggestions(mockSuggestions);
      setSelectedAISuggestion(mockSuggestions.description);

    } finally {
      setIsAILoading(false);
    }
  }, [city, district, propertyType, price, entrances, position, level, bedrooms, bathrooms, storageRooms, balconies, curtains, airConditioners, parkingSpaces, floors, hasAnnex, hasMaidRoom, hasLaundryRoom, hasJacuzzi, hasRainShower, isSmartHome, hasSmartEntry, hasPool, hasPlayground, hasGarden, hasElevator, hasExternalMajlis, hasPrivateRoof, isFurnished, hasBuiltInKitchen, kitchenWithAppliances, selectedAppliances]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAIConfirm = () => {
    if (selectedAISuggestion) {
      setDescription(selectedAISuggestion);
      setIsAIModalOpen(false);
    }
  };

  const toggleRentPaymentMethod = (method: string) => {
    setRentPaymentMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* خيارات بيع أو تأجير */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-bold text-[#01411C]">نوع العملية</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setOfferType('sale')}
            className={`p-4 rounded-lg border-2 transition-all ${
              offerType === 'sale'
                ? 'bg-[#01411C] text-white border-[#01411C]'
                : 'bg-white text-[#01411C] border-gray-300 hover:border-[#01411C]'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🏷️</div>
              <div className="font-semibold">بيع</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setOfferType('rent')}
            className={`p-4 rounded-lg border-2 transition-all ${
              offerType === 'rent'
                ? 'bg-[#01411C] text-white border-[#01411C]'
                : 'bg-white text-[#01411C] border-gray-300 hover:border-[#01411C]'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🔑</div>
              <div className="font-semibold">تأجير</div>
            </div>
          </button>
        </div>
      </motion.div>
      
      {/* 1. ألبوم الصور والفيديو */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">ألبوم الصور والفيديو</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button type="button" className={`h-16 ${uploadQuality === 'standard' ? 'bg-[#01411C] text-white' : 'border-2 border-gray-300'} rounded-lg transition-all`} onClick={() => setUploadQuality('standard')}>
            <Upload className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs">رفع عادي</div>
          </button>
          <button type="button" className={`h-16 ${uploadQuality === 'hd' ? 'bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C]' : 'border-2 border-[#D4AF37]'} rounded-lg transition-all`} onClick={() => setUploadQuality('hd')}>
            <Sparkles className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs">رفع HD</div>
          </button>
        </div>

        <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 bg-[#f0fdf4] cursor-pointer mb-4 hover:bg-[#e6f9f0] transition-all" onClick={() => fileInputRef.current?.click()}>
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-2 text-[#D4AF37]" />
            <p className="font-medium text-[#01411C]">اسحب الملفات أو انقر للاختيار</p>
            <p className="text-sm text-gray-600">حتى 10 صور + فيديو واحد</p>
          </div>
        </div>
        
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />

        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {mediaFiles.map((file) => (
              <div key={file.id} className="relative group">
                {file.type === 'image' ? (
                  <img src={file.url} alt="" className={`w-full h-24 object-cover rounded-lg border-2 ${file.isPrimary ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-gray-200'}`} />
                ) : (
                  <div className="relative">
                    <video src={file.url} className="w-full h-24 object-cover rounded-lg border-2 border-blue-300" />
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center text-2xl">📹</div>
                  </div>
                )}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.type === 'image' && (
                    <button type="button" className={`w-7 h-7 rounded flex items-center justify-center ${file.isPrimary ? 'bg-[#D4AF37]' : 'bg-white border'}`} onClick={() => setPrimaryImage(file.id)}>
                      <Star className={`w-4 h-4 ${file.isPrimary ? 'fill-current text-[#01411C]' : ''}`} />
                    </button>
                  )}
                  <button type="button" className="w-7 h-7 bg-red-500 text-white rounded flex items-center justify-center" onClick={() => removeFile(file.id)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 2. الجولة الافتراضية */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3D</div>
          <h3 className="font-bold text-blue-800">الجولة الافتراضية</h3>
        </div>
        <input type="url" value={virtualTourLink} onChange={(e) => setVirtualTourLink(e.target.value)} placeholder="رابط الجولة الافتراضية (Matterport, 360 Tours...)" className="w-full p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p className="text-xs text-blue-700 mt-2">💡 يمكنك إضافة رابط جولة افتراضية للعقار</p>
      </motion.div>

      {/* 3. البيانات الأساسية */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">البيانات الأساسية</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#01411C] mb-2">الاسم الكامل *</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">رقم الهوية *</label>
            <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">تاريخ الميلاد</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">رقم الجوال</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="05xxxxxxxx" />
          </div>
        </div>
      </motion.div>

      {/* 4. الصك والوثائق */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">الصك والوثائق</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#01411C] mb-2">رقم الصك *</label>
            <input type="text" value={deedNumber} onChange={(e) => setDeedNumber(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">تاريخ الصك *</label>
            <input type="date" value={deedDate} onChange={(e) => setDeedDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
          </div>
        </div>
      </motion.div>

      {/* 5. تفاصيل الموقع */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">تفاصيل الموقع</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#01411C] mb-2">المدينة *</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">الحي *</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">الشارع</label>
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">الرمز البريدي</label>
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[#01411C] mb-2">رقم المبنى</label>
            <input type="text" value={building} onChange={(e) => setBuilding(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
          </div>
        </div>
        
        {/* زر التحديد على خريطة قوقل */}
        <div className="mt-4">
          <button 
            type="button" 
            onClick={() => {
              const searchQuery = `${city || ''} ${district || ''} ${street || ''}`.trim();
              const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
              window.open(url, '_blank');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all shadow-md"
          >
            <MapPin className="w-5 h-5" />
            تحديد الموقع على خريطة قوقل
          </button>
        </div>
      </motion.div>

      {/* 6. تفاصيل العقار */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">تفاصيل العقار</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[#01411C] mb-2">عنوان العقار *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="مثال: فيلا فاخرة في حي الملقا" required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#01411C] mb-2">نوع العقار *</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" required>
                <option value="">اختر نوع العقار</option>
                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#01411C] mb-2">مساحة العقار (م²) *</label>
              <input type="number" value={area || ''} onChange={(e) => setArea(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" min="1" required />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 7. المواصفات التفصيلية */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🏗️</span>
          <h3 className="font-bold text-[#01411C]">المواصفات التفصيلية</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-[#01411C] mb-2">المدخل</label>
            <select value={entrances} onChange={(e) => setEntrances(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              <option value="مدخل واحد">مدخل واحد</option>
              <option value="مدخلين">مدخلين</option>
            </select>
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">الموقع</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              <option value="زاوية">زاوية</option>
              <option value="بطن">بطن</option>
            </select>
          </div>
          <div>
            <label className="block text-[#01411C] mb-2">المستوى</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              <option value="أرضي">أرضي</option>
              <option value="علوي">علوي</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Counter value={bedrooms} onChange={setBedrooms} label="غرف النوم" />
          <Counter value={bathrooms} onChange={setBathrooms} label="دورات المياه" />
          <Counter value={storageRooms} onChange={setStorageRooms} label="مستودعات" />
          <Counter value={balconies} onChange={setBalconies} label="بلكونات" />
          <Counter value={curtains} onChange={setCurtains} label="ستائر" />
          <Counter value={airConditioners} onChange={setAirConditioners} label="مكيفات" />
          <Counter value={parkingSpaces} onChange={setParkingSpaces} label="موقف" />
          <Counter value={floors} onChange={setFloors} label="أدوار" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { state: hasAnnex, setState: setHasAnnex, label: 'ملحق' },
            { state: hasMaidRoom, setState: setHasMaidRoom, label: 'غرفة خادمة' },
            { state: hasLaundryRoom, setState: setHasLaundryRoom, label: 'غرفة غسيل' },
            { state: hasJacuzzi, setState: setHasJacuzzi, label: 'جاكوزي' },
            { state: hasRainShower, setState: setHasRainShower, label: 'دش مطري' },
            { state: isSmartHome, setState: setIsSmartHome, label: 'سمارت هوم' },
            { state: hasSmartEntry, setState: setHasSmartEntry, label: 'دخول ذكي' },
            { state: hasPool, setState: setHasPool, label: 'مسبح' },
            { state: hasPlayground, setState: setHasPlayground, label: 'ملعب' },
            { state: hasGarden, setState: setHasGarden, label: 'حديقة' },
            { state: hasElevator, setState: setHasElevator, label: 'مصعد' },
            { state: hasExternalMajlis, setState: setHasExternalMajlis, label: 'مجلس خارجي' },
            { state: hasPrivateRoof, setState: setHasPrivateRoof, label: 'سطح خاص' },
            { state: isFurnished, setState: setIsFurnished, label: 'مؤثث' },
            { state: hasBuiltInKitchen, setState: setHasBuiltInKitchen, label: 'مطبخ راكب' }
          ].map(({ state, setState, label }) => (
            <label key={label} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
              <input type="checkbox" checked={state} onChange={(e) => setState(e.target.checked)} className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]" />
              <span className="text-sm text-[#01411C]">{label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
            <input type="checkbox" checked={kitchenWithAppliances} onChange={(e) => setKitchenWithAppliances(e.target.checked)} className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]" />
            <span className="text-[#01411C] font-medium">مطبخ بالأجهزة</span>
          </label>
          {kitchenWithAppliances && (
            <div className="bg-gray-50 p-4 rounded-lg mt-3">
              <h4 className="text-[#01411C] font-medium mb-3">اختر الأجهزة:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {kitchenAppliances.map(app => (
                  <label key={app} className="flex items-center gap-2 p-2 bg-white rounded border cursor-pointer hover:bg-gray-50 transition-all">
                    <input type="checkbox" checked={selectedAppliances.includes(app)} onChange={() => toggleAppliance(app)} className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]" />
                    <span className="text-sm text-[#01411C]">{app}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 8. المميزات المخصصة */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✨</span>
          <h3 className="font-bold text-[#01411C]">المميزات المخصصة</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <input type="text" value={newCustomFeature} onChange={(e) => setNewCustomFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()} className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="أضف ميزة (مثال: إطلالة بحرية)" />
          <button type="button" onClick={addCustomFeature} className="px-6 py-3 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] font-medium transition-all">إضافة</button>
        </div>
        {customFeatures.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {customFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#f0fdf4] border border-[#D4AF37] rounded-lg">
                <span className="text-[#01411C]">{f}</span>
                <button type="button" onClick={() => removeCustomFeature(f)} className="text-red-500 hover:text-red-700 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-400 text-sm">لم تتم إضافة مميزات بعد</p>
        )}
      </motion.div>

      {/* 9. الضمانات والكفالات */}
      {offerType === 'sale' && (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🛡️</span>
          <h3 className="font-bold text-[#01411C]">الضمانات والكفالات</h3>
        </div>
        <label className="flex items-center gap-3 mb-4">
          <input type="checkbox" checked={guarantees.length > 0} onChange={(e) => e.target.checked ? setGuarantees([{ id: Math.random().toString(36).substr(2, 9), type: '', duration: '', notes: '' }]) : setGuarantees([])} className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]" />
          <span className="text-[#01411C] font-medium">يوجد ضمانات</span>
        </label>
        {guarantees.length > 0 && (
          <div className="space-y-4">
            {guarantees.map((g, index) => (
              <div key={g.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#01411C]">ضمان {index + 1}</h4>
                  <button 
                    type="button" 
                    onClick={() => setGuarantees(prev => prev.filter(pg => pg.id !== g.id))}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#01411C] mb-2">نوع الضمان</label>
                    <select value={g.type} onChange={(e) => setGuarantees(prev => prev.map(pg => pg.id === g.id ? { ...pg, type: e.target.value } : pg))} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                      <option value="">اختر النوع</option>
                      <option value="ضمان كهرباء">ضمان كهرباء</option>
                      <option value="ضمان سباكة">ضمان سباكة</option>
                      <option value="ضمان مكيفات">ضمان مكيفات</option>
                      <option value="ضمان عام">ضمان عام</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#01411C] mb-2">المدة</label>
                    <select value={g.duration} onChange={(e) => setGuarantees(prev => prev.map(pg => pg.id === g.id ? { ...pg, duration: e.target.value } : pg))} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                      <option value="">اختر المدة</option>
                      <option value="سنة واحدة">سنة</option>
                      <option value="سنتان">سنتان</option>
                      <option value="ثلاث سنوات">3 سنوات</option>
                      <option value="خمس سنوات">5 سنوات</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#01411C] mb-2">ملاحظات</label>
                    <textarea value={g.notes} onChange={(e) => setGuarantees(prev => prev.map(pg => pg.id === g.id ? { ...pg, notes: e.target.value } : pg))} className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-y focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="تفاصيل إضافية" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* زر إضافة ضمان */}
            <button 
              type="button" 
              onClick={() => setGuarantees(prev => [...prev, { 
                id: Math.random().toString(36).substr(2, 9), 
                type: '', 
                duration: '', 
                notes: '' 
              }])}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] font-medium transition-all w-full justify-center"
            >
              <Plus className="w-5 h-5" />
              إضافة ضمان آخر
            </button>
          </div>
        )}
      </motion.div>
      )}

      {/* 9. السعر */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💰</span>
          <h3 className="font-bold text-[#01411C]">السعر</h3>
        </div>
        
        {offerType === 'sale' ? (
          <div>
            <label className="block text-[#01411C] mb-2">سعر البيع (ريال) *</label>
            <input type="number" value={price || ''} onChange={(e) => setPrice(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" min="1" placeholder="مثال: 1500000" required />
            {price && <p className="text-[#065f41] font-medium mt-2">السعر: {new Intl.NumberFormat('ar-SA').format(price)} ريال</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[#01411C] mb-3">اختر طرق الدفع المتاحة:</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'دفعة', label: 'دفعة واحدة' },
                  { key: 'دفعتان', label: 'دفعتان' },
                  { key: 'أربع دفعات', label: 'أربع دفعات' },
                  { key: 'شهري', label: 'شهري' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleRentPaymentMethod(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      rentPaymentMethods.includes(key)
                        ? 'bg-[#01411C] text-white border-[#01411C]'
                        : 'bg-white text-[#01411C] border-gray-300 hover:border-[#01411C]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {rentPaymentMethods.length > 0 && (
              <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg">
                {rentPaymentMethods.includes('دفعة') && (
                  <div>
                    <label className="block text-[#01411C] mb-2">سعر الدفعة الواحدة (ريال)</label>
                    <input
                      type="number"
                      value={rentSingle || ''}
                      onChange={(e) => setRentSingle(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      min="1"
                      placeholder="مثال: 50000"
                    />
                    {rentSingle && <p className="text-[#065f41] text-sm mt-1">{new Intl.NumberFormat('ar-SA').format(rentSingle)} ريال</p>}
                  </div>
                )}
                
                {rentPaymentMethods.includes('دفعتان') && (
                  <div>
                    <label className="block text-[#01411C] mb-2">سعر الدفعتان (ريال)</label>
                    <input
                      type="number"
                      value={rentTwo || ''}
                      onChange={(e) => setRentTwo(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      min="1"
                      placeholder="مثال: 26000"
                    />
                    {rentTwo && <p className="text-[#065f41] text-sm mt-1">{new Intl.NumberFormat('ar-SA').format(rentTwo)} ريال</p>}
                  </div>
                )}
                
                {rentPaymentMethods.includes('أربع دفعات') && (
                  <div>
                    <label className="block text-[#01411C] mb-2">سعر الأربع دفعات (ريال)</label>
                    <input
                      type="number"
                      value={rentFour || ''}
                      onChange={(e) => setRentFour(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      min="1"
                      placeholder="مثال: 13500"
                    />
                    {rentFour && <p className="text-[#065f41] text-sm mt-1">{new Intl.NumberFormat('ar-SA').format(rentFour)} ريال</p>}
                  </div>
                )}
                
                {rentPaymentMethods.includes('شهري') && (
                  <div>
                    <label className="block text-[#01411C] mb-2">السعر الشهري (ريال)</label>
                    <input
                      type="number"
                      value={rentMonthly || ''}
                      onChange={(e) => setRentMonthly(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      min="1"
                      placeholder="مثال: 4500"
                    />
                    {rentMonthly && <p className="text-[#065f41] text-sm mt-1">{new Intl.NumberFormat('ar-SA').format(rentMonthly)} ريال</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* سعر اقتراح */}
        <div className="mt-4">
          <button type="button" onClick={() => setShowPriceDetails(!showPriceDetails)} className="px-6 py-3 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] font-medium transition-all">
            {isPriceLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                اقتراحات الأسعار
              </>
            )}
          </button>
        </div>

        {showPriceDetails && (
          <div className="mt-4">
            {isPriceLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                جاري جلب اقتراحات الأسعار...
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                {priceSuggestion ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">النطاق السعري المقترح بناءً على بياناتك:</p>
                    <div className="bg-white p-4 rounded-lg border-2 border-[#D4AF37] mb-3">
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">من</p>
                          <p className="text-lg font-bold text-[#01411C]">{formatPrice(priceSuggestion.min)}</p>
                        </div>
                        <div className="text-2xl text-[#D4AF37]">←</div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">إلى</p>
                          <p className="text-lg font-bold text-[#01411C]">{formatPrice(priceSuggestion.max)}</p>
                        </div>
                      </div>
                      <div className="text-center mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">المتوسط: <span className="font-semibold text-[#065f41]">{formatPrice(priceSuggestion.average)}</span></p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">ثقة الاقتراح: {priceSuggestion.confidence}%</p>
                    <p className="text-xs text-gray-500 mb-3">بناءً على: {priceSuggestion.basedOn.map((item, index) => <span key={index}>{item}{index < priceSuggestion.basedOn.length - 1 ? '، ' : ''}</span>)}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button type="button" onClick={() => handlePriceSelect(priceSuggestion.min)} className="px-3 py-2 bg-white border-2 border-[#01411C] text-[#01411C] rounded-lg hover:bg-[#01411C] hover:text-white font-medium transition-all text-sm">
                        الحد الأدنى
                      </button>
                      <button type="button" onClick={() => handlePriceSelect(priceSuggestion.average)} className="px-3 py-2 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] font-medium transition-all text-sm">
                        المتوسط
                      </button>
                      <button type="button" onClick={() => handlePriceSelect(priceSuggestion.max)} className="px-3 py-2 bg-white border-2 border-[#01411C] text-[#01411C] rounded-lg hover:bg-[#01411C] hover:text-white font-medium transition-all text-sm">
                        الحد الأعلى
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">لا تتوفر اقتراحات أسعار حالياً. تأكد من تعبئة جميع البيانات المطلوبة.</p>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 10. وصف ا��عقار */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">وصف العقار</h3>
        </div>
        <textarea value={description} onChange={(e) => { let v = e.target.value; const prefix = offerType === 'sale' ? 'للبيع:' : 'للإيجار:'; if (v && !v.startsWith(prefix)) v = `${prefix} ${v}`; setDescription(v); }} className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder={`${offerType === 'sale' ? 'للبيع:' : 'للإيجار:'} أدخل وصف تفصيلي للعقار...`} />
        <p className="text-xs text-[#065f41] mt-2">💡 سيبدأ الوصف تلقائياً بـ "{offerType === 'sale' ? 'للبيع:' : 'للإيجار:'}"</p>

        {/* زر توليد وصف ذكي */}
        <div className="mt-4">
          <button type="button" onClick={() => setIsAIModalOpen(true)} className="px-6 py-3 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] font-medium transition-all">
            {isAILoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                توليد وصف ذكي
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* 11. الهاشتاقات التلقائية */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <Hash className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-[#01411C]">الهاشتاقات التلقائية</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">تحديث تلقائي من المواصفات والموقع</p>
        {getAutoHashtags().length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {getAutoHashtags().map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-[#f0fdf4] text-[#01411C] border border-[#D4AF37] rounded-full text-sm">{tag}</span>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-400 text-sm">سيتم إنشاء الهاشتاقات تلقائياً</p>
        )}
      </motion.div>

      {/* الأزرار */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-3 justify-end sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg">
        <button type="button" onClick={onCancel} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">إلغاء</button>
        
        <button 
          type="button" 
          onClick={handleSave} 
          disabled={isLoading} 
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 font-semibold transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              حفظ كمسودة
            </>
          )}
        </button>

        <button 
          type="button" 
          onClick={async () => {
            await handleSave();
            // هنا يمكن إضافة منطق إرسال العرض للنشر
          }} 
          disabled={isLoading} 
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg hover:from-[#065f41] hover:to-[#01411C] disabled:opacity-50 font-bold transition-all shadow-md"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              إرسال العرض
            </>
          )}
        </button>
      </motion.div>

      {/* مودال توليد الوصف بالذكاء الاصطناعي */}
      <AnimatePresence>
        {isAIModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIsAIModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" dir="rtl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-[#01411C]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#01411C]">مولد الوصف بالذكاء الاصطناعي</h2>
                    <p className="text-[#065f41] text-sm">احصل على وصف احترافي لعقارك في ثوانِ</p>
                  </div>
                </div>
                <button onClick={() => setIsAIModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-[#f0fdf4] rounded-xl p-4 mb-6">
                  <h3 className="text-[#01411C] font-semibold mb-3">معلومات العقار:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><strong>النوع:</strong> {propertyType || 'غير محدد'}</div>
                    <div><strong>المدينة:</strong> {city || 'غير محدد'}</div>
                    <div><strong>الحي:</strong> {district || 'غير محدد'}</div>
                    <div><strong>الغرض:</strong> للبيع</div>
                  </div>
                </div>

                {!aiSuggestions && (
                  <div className="text-center mb-6">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={generateAIDescription} disabled={isAILoading} className="px-8 py-4 bg-[#01411C] text-white rounded-xl hover:bg-[#065f41] disabled:opacity-50 transition-colors font-semibold shadow-lg">
                      {isAILoading ? (
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          جاري التوليد...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          بدء التوليد
                        </div>
                      )}
                    </motion.button>
                  </div>
                )}

                {aiSuggestions && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[#01411C] font-semibold">الوصف المقترح:</h3>
                        <button onClick={() => copyToClipboard(aiSuggestions.description, -1)} className="flex items-center gap-2 px-3 py-1 text-[#D4AF37] border border-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 transition-colors text-sm">
                          {copiedIndex === -1 ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              تم النسخ
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              نسخ
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAISuggestion === aiSuggestions.description ? 'border-[#01411C] bg-[#f0fdf4]' : 'border-gray-200 hover:border-[#D4AF37]'}`} onClick={() => setSelectedAISuggestion(aiSuggestions.description)}>
                        <p className="text-[#065f41] leading-relaxed">{aiSuggestions.description}</p>
                        {selectedAISuggestion === aiSuggestions.description && (
                          <div className="flex items-center gap-2 mt-2 text-[#01411C]">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">محدد</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {aiSuggestions.suggestions.length > 0 && (
                      <div>
                        <h3 className="text-[#01411C] font-semibold mb-3">اقتراحات أخرى:</h3>
                        <div className="space-y-3">
                          {aiSuggestions.suggestions.map((suggestion, index) => (
                            <div key={index} className={`p-4 border-2 rounded-xl cursor-pointer transition-all group ${selectedAISuggestion === suggestion ? 'border-[#01411C] bg-[#f0fdf4]' : 'border-gray-200 hover:border-[#D4AF37]'}`} onClick={() => setSelectedAISuggestion(suggestion)}>
                              <div className="flex items-start justify-between">
                                <p className="text-[#065f41] leading-relaxed flex-1">{suggestion}</p>
                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(suggestion, index); }} className="flex items-center gap-1 px-2 py-1 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                                  {copiedIndex === index ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                              {selectedAISuggestion === suggestion && (
                                <div className="flex items-center gap-2 mt-2 text-[#01411C]">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">محدد</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiSuggestions.neighborhoods.length > 0 && (
                      <div>
                        <h3 className="text-[#01411C] font-semibold mb-3">أحياء مقترحة:</h3>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions.neighborhoods.map((neighborhood, index) => (
                            <span key={index} className="px-3 py-1 bg-[#D4AF37]/20 text-[#01411C] rounded-full text-sm border border-[#D4AF37]/30">{neighborhood}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                {aiSuggestions && (
                  <button onClick={generateAIDescription} disabled={isAILoading} className="px-4 py-2 border-2 border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 disabled:opacity-50 transition-colors">
                    توليد جديد
                  </button>
                )}
                <button onClick={handleAIConfirm} disabled={!selectedAISuggestion} className="flex-1 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
                  استخدام هذا الوصف
                </button>
                <button onClick={() => setIsAIModalOpen(false)} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}