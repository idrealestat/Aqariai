// أنواع TypeScript لنظام أصحاب العروض والطلبات
export interface RegistrationData {
  id?: string;
  fullName: string;
  dob?: string;
  nationalId?: string;
  email?: string;
  phone?: string;
}

export interface Address {
  formattedAddress?: string;
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
  building?: string;
  buildingNumber?: string; // رقم المبنى
  additionalNumber?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyFeatures {
  // المدخل والموقع
  entrances?: 'مدخلين' | 'مدخل واحد';
  position?: 'زاوية' | 'بطن';
  level?: 'أرضي' | 'علوي';
  hasAnnex?: boolean; // ملحق
  
  // غرف إضافية ومميزات حديثة
  hasMaidRoom?: boolean; // غرفة خادمة
  hasLaundryRoom?: boolean; // غرفة غسيل
  hasJacuzzi?: boolean; // جاكوزي
  hasRainShower?: boolean; // دش مطري
  isSmartHome?: boolean; // سمارت هوم
  hasSmartEntry?: boolean; // دخول ذكي
  
  // الغرف والمساحات
  bedrooms?: number;
  bathrooms?: number;
  storageRooms?: number; // مستودعات
  balconies?: number; // بلكونات
  curtains?: number; // ستائر
  airConditioners?: number; // مكيفات
  parkingSpaces?: number; // موقف خاص
  floors?: number; // الأدوار
  
  // المرافق
  hasPool?: boolean; // مسبح
  hasPlayground?: boolean; // مساحة ألعاب أطفال
  hasGarden?: boolean; // حديقة
  hasElevator?: boolean; // مصعد
  hasExternalMajlis?: boolean; // مجلس خارجي
  hasPrivateRoof?: boolean; // سطح خاص
  
  // المطبخ والأثاث
  isFurnished?: boolean; // مؤثث
  hasBuiltInKitchen?: boolean; // مطبخ راكب
  kitchenWithAppliances?: boolean; // مطبخ بالأجهزة
  kitchenAppliances?: string[]; // قائمة الأجهزة
}

export interface PricePlan {
  // للبيع
  salePrice?: number;
  
  // للإيجار
  rentSingle?: number; // دفعة واحدة
  rentTwo?: number; // دفعتان
  rentFour?: number; // أربع دفعات
  monthly?: number; // شهري
  
  currency?: string;
  customPriceItems?: Array<{
    name: string;
    price: number;
  }>;
}

export interface Guarantee {
  exists: boolean;
  type?: string;
  duration?: string;
  notes?: string;
}

export interface Offer {
  id?: string;
  ownerId?: string;
  contact?: RegistrationData;
  
  // تفاصيل العقار
  title?: string;
  type: string; // شقة، فيلا، أرض، دبلكس، تجاري
  areaM2?: number;
  address: Address;
  features?: PropertyFeatures;
  
  // الوثائق والضمانات
  deedNumber?: string;
  deedDate?: string;
  guarantees?: Guarantee;
  
  // السعر والوصف
  pricePlan?: PricePlan;
  description?: string;
  aiGenerated?: boolean;
  
  // المرفقات
  images?: string[];
  documents?: string[]; // pdf للصك
  
  // حالة العرض
  status?: 'open' | 'accepted' | 'rejected' | 'draft';
  offerType: 'sale' | 'rent';
  
  // التوقيت
  createdAt?: string;
  updatedAt?: string;
  
  // عروض الوسطاء
  brokerProposals?: BrokerProposal[];
}

export interface Request {
  id?: string;
  ownerId?: string;
  contact?: RegistrationData;
  
  // تفاصيل الطلب
  type: string; // شقة، فيلا، أرض، دبلكس، تجاري
  city?: string;
  district?: string;
  suggestedDistricts?: string[]; // الأحياء المقترحة
  
  // الميزانية
  budgetMin?: number;
  budgetMax?: number;
  paymentType?: 'نقد' | 'تمويل';
  paymentMethod?: 'دفعتان' | 'أربع دفعات' | 'شهري';
  
  // المواصفات المطلوبة
  features?: PropertyFeatures;
  guarantees?: Guarantee;
  
  // الوصف
  description?: string;
  aiGenerated?: boolean;
  
  // حالة الطلب
  status?: 'open' | 'accepted' | 'rejected' | 'draft';
  requestType: 'buy' | 'rent';
  
  // التوقيت
  createdAt?: string;
  updatedAt?: string;
  
  // عروض الوسطاء
  brokerProposals?: BrokerProposal[];
}

export interface BrokerProposal {
  id?: string;
  brokerId: string;
  brokerName: string;
  brokerRating?: number;
  brokerReviewsCount?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  
  // العرض
  commissionPercent?: number;
  message?: string;
  offeredPrice?: number;
  
  // الحالة
  status?: 'pending' | 'accepted' | 'rejected';
  
  // التوقيت
  createdAt?: string;
  respondedAt?: string;
}

export interface PriceSuggestion {
  min: number;
  max: number;
  average: number;
  confidence: number; // 0-100
  basedOn: string[]; // مصادر البيانات
}

export interface AIDescriptionRequest {
  mode: 'sale' | 'rent' | 'buy-request' | 'rent-request';
  city?: string;
  district?: string;
  type?: string;
  features?: PropertyFeatures;
  price?: number;
}

export interface AIDescriptionResponse {
  title: string;
  description: string;
  suggestions: string[];
  neighborhoods: string[];
}

export type OwnerRole = 'seller' | 'buyer';

export interface CRMContact {
  id: string;
  brokerId: string;
  brokerName: string;
  brokerRating?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  
  // التفاعلات
  offers?: string[]; // معرفات العروض/الطلبات
  lastInteraction?: string;
  status: 'active' | 'completed' | 'blocked';
  
  // الملاحظات
  notes?: string;
  tags?: string[];
  
  // تاريخ الميلاد
  birthDate?: string; // ISO format: YYYY-MM-DD
}

// خطأ في النظام
export interface SystemError {
  code: string;
  message: string;
  details?: any;
}

// حالة التحميل
export interface LoadingState {
  isLoading: boolean;
  error?: SystemError;
}