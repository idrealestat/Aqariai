import { NewOffer as Offer, BrokerResponse } from '../types/offers';

// تكوين API - محدث ليعمل في المتصفح
const API_BASE_URL = 'https://api.waseety.com'; // يمكن تغييره لاحقاً من خلال متغير البيئة
const API_TIMEOUT = 15000; // 15 ثانية - زيادة الوقت للاتصالات البطيئة
const RETRY_ATTEMPTS = 3; // عدد المحاولات
const RETRY_DELAY = 1000; // تأخير بين المحاولات (بالمللي ثانية)

// معالج الأخطاء المخصص
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// دالة التأخير لإعادة المحاولة
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// دالة مساعدة للـ fetch مع معالجة الأخطاء وإعادة المحاولة
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  attempt: number = 1
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint} (محاولة ${attempt})`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Waseety-App/1.0',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = getErrorMessage(response.status, errorData.message);
      
      // إعادة المحاولة للأخطاء المؤقتة
      if (shouldRetry(response.status) && attempt < RETRY_ATTEMPTS) {
        console.log(`🔄 إعادة المحاولة بعد ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY * attempt); // تأخير متدرج
        return apiRequest<T>(endpoint, options, attempt + 1);
      }
      
      throw new ApiError(
        errorMessage,
        response.status,
        errorData.code || getErrorCode(response.status)
      );
    }

    console.log(`✅ API Success: ${endpoint}`);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === 'AbortError') {
      if (attempt < RETRY_ATTEMPTS) {
        console.log(`⏱️ انتهت المهلة، إعادة المحاولة...`);
        await delay(RETRY_DELAY * attempt);
        return apiRequest<T>(endpoint, options, attempt + 1);
      }
      throw new ApiError('انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.', 408, 'TIMEOUT');
    }
    
    if (!navigator.onLine) {
      throw new ApiError('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال.', 0, 'OFFLINE');
    }
    
    // إعادة المحاولة للأخطاء الشبكية
    if (attempt < RETRY_ATTEMPTS && (
      error.name === 'TypeError' || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed')
    )) {
      console.log(`🔄 خطأ شبكي، إعادة المحاولة...`);
      await delay(RETRY_DELAY * attempt);
      return apiRequest<T>(endpoint, options, attempt + 1);
    }
    
    throw new ApiError('حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.', 500, 'UNKNOWN');
  }
}

// دالة لتحديد ما إذا كان يجب إعادة المحاولة
function shouldRetry(status: number): boolean {
  return [408, 429, 500, 502, 503, 504].includes(status);
}

// دالة للحصول على رسالة خطأ واضحة
function getErrorMessage(status: number, serverMessage?: string): string {
  if (serverMessage) return serverMessage;
  
  switch (status) {
    case 400: return 'طلب غير صحيح. يرجى التحقق من البيانات المرسلة.';
    case 401: return 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.';
    case 403: return 'ليس لديك صلاحية للقيام بهذا الإجراء.';
    case 404: return 'العنصر المطلوب غير موجود.';
    case 408: return 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.';
    case 409: return 'تعارض في البيانات. العنصر موجود مسبقاً.';
    case 422: return 'بيانات غير صحيحة. يرجى التحقق من المدخلات.';
    case 429: return 'كثرة الطلبات. يرجى الانتظار قليلاً والمحاولة مرة أخرى.';
    case 500: return 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
    case 502: return 'خطأ في البوابة. يرجى المحاولة لاحقاً.';
    case 503: return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.';
    case 504: return 'انتهت مهلة البوابة. يرجى المحاولة لاحقاً.';
    default: return `خطأ HTTP: ${status}`;
  }
}

// دالة للحصول على كود الخطأ
function getErrorCode(status: number): string {
  switch (status) {
    case 400: return 'BAD_REQUEST';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 408: return 'TIMEOUT';
    case 409: return 'CONFLICT';
    case 422: return 'VALIDATION_ERROR';
    case 429: return 'RATE_LIMITED';
    case 500: return 'SERVER_ERROR';
    case 502: return 'BAD_GATEWAY';
    case 503: return 'SERVICE_UNAVAILABLE';
    case 504: return 'GATEWAY_TIMEOUT';
    default: return 'HTTP_ERROR';
  }
}

// **العروض - Offers API**

// جلب جميع العروض مع فلترة
export async function getOffers(filters: {
  role?: string;
  type?: string;
  city?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} = {}): Promise<{ offers: Offer[]; total: number; pages: number }> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/offers${queryString ? `?${queryString}` : ''}`;
    
    const result = await apiRequest<{ offers: Offer[]; total: number; pages: number }>(endpoint);
    
    // إضافة معلومات إضافية للعروض
    if (result.offers) {
      result.offers = result.offers.map(offer => ({
        ...offer,
        // إضافة حقول محسوبة
        isNew: isOfferNew(offer.createdAt),
        hasActiveResponses: offer.brokerOffers?.some(br => br.status === 'pending') || false,
        responseCount: offer.brokerOffers?.length || 0
      }));
    }
    
    return result;
  } catch (error) {
    // fallback للبيانات التجريبية مع رسالة توضيحية
    console.warn('⚠️ فشل الاتصال بـ API، سيتم استخدام البيانات التجريبية');
    return getOffersMock(filters);
  }
}

// التحقق من كون العرض جديد (خلال 24 ساعة)
function isOfferNew(createdAt: string): boolean {
  const offerDate = new Date(createdAt);
  const now = new Date();
  const diffHours = (now.getTime() - offerDate.getTime()) / (1000 * 60 * 60);
  return diffHours <= 24;
}

// جلب عرض محدد
export async function getOfferById(id: string): Promise<Offer> {
  try {
    const offer = await apiRequest<Offer>(`/offers/${id}`);
    return {
      ...offer,
      isNew: isOfferNew(offer.createdAt),
      hasActiveResponses: offer.brokerOffers?.some(br => br.status === 'pending') || false,
      responseCount: offer.brokerOffers?.length || 0
    };
  } catch (error) {
    // fallback للبيانات التجريبية
    const mockOffer = mockOffers.find(offer => offer.id === id);
    if (mockOffer) {
      console.log(`📋 استخدام بيانات تجريبية للعرض: ${id}`);
      return {
        ...mockOffer,
        isNew: isOfferNew(mockOffer.createdAt),
        hasActiveResponses: mockOffer.brokerOffers?.some(br => br.status === 'pending') || false,
        responseCount: mockOffer.brokerOffers?.length || 0
      };
    }
    throw new ApiError('العرض غير موجود', 404, 'NOT_FOUND');
  }
}

// إنشاء عرض جديد
export async function createOffer(offer: Omit<Offer, 'id' | 'createdAt' | 'brokerOffers'>): Promise<Offer> {
  try {
    return await apiRequest<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(offer),
    });
  } catch (error) {
    // محاكاة إنشاء عرض جديد في البيانات التجريبية
    console.log('🆕 إنشاء عرض جديد (بيانات تجريبية)');
    const newOffer: Offer = {
      ...offer,
      id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      brokerOffers: []
    };
    
    mockOffers.unshift(newOffer); // إضافة في أول القائمة
    console.log(`✅ تم إنشاء العرض: ${newOffer.propertyType} في ${newOffer.city}`);
    return newOffer;
  }
}

// تحديث عرض
export async function updateOffer(id: string, updates: Partial<Offer>): Promise<Offer> {
  return await apiRequest<Offer>(`/offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// حذف عرض
export async function deleteOffer(id: string): Promise<void> {
  await apiRequest<void>(`/offers/${id}`, {
    method: 'DELETE',
  });
}

// **عروض الوسطاء - Broker Responses API**

// إضافة رد وسيط على عرض
export async function addBrokerResponse(
  offerId: string,
  response: Omit<BrokerResponse, 'status'>
): Promise<BrokerResponse> {
  try {
    return await apiRequest<BrokerResponse>(`/offers/${offerId}/broker-responses`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  } catch (error) {
    // محاكاة إضافة الرد في البيانات التجريبية
    console.log('محاكاة إضافة رد الوسيط');
    const newResponse: BrokerResponse = {
      ...response,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // إضافة الرد للعرض في البيانات التجريبية
    const offerIndex = mockOffers.findIndex(o => o.id === offerId);
    if (offerIndex !== -1) {
      if (!mockOffers[offerIndex].brokerOffers) {
        mockOffers[offerIndex].brokerOffers = [];
      }
      mockOffers[offerIndex].brokerOffers!.push(newResponse);
    }
    
    return newResponse;
  }
}

// تحديث حالة رد الوسيط
export async function updateBrokerResponseStatus(
  offerId: string,
  brokerId: string,
  status: 'accepted' | 'rejected'
): Promise<BrokerResponse> {
  try {
    return await apiRequest<BrokerResponse>(`/offers/${offerId}/broker-responses/${brokerId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    // محاكاة تحديث حالة الرد في البيانات التجريبية
    console.log('محاكاة تحديث حالة رد الوسيط');
    const offerIndex = mockOffers.findIndex(o => o.id === offerId);
    if (offerIndex !== -1 && mockOffers[offerIndex].brokerOffers) {
      const responseIndex = mockOffers[offerIndex].brokerOffers!.findIndex(
        br => br.brokerId === brokerId
      );
      if (responseIndex !== -1) {
        mockOffers[offerIndex].brokerOffers![responseIndex].status = status;
        return mockOffers[offerIndex].brokerOffers![responseIndex];
      }
    }
    throw new Error('رد الوسيط غير موجود');
  }
}

// جلب عروض وسيط محدد
export async function getBrokerOffers(brokerId: string): Promise<Offer[]> {
  try {
    return await apiRequest<Offer[]>(`/brokers/${brokerId}/offers`);
  } catch (error) {
    // fallback للبيانات التجريبية
    console.log('استخدام البيانات التجريبية للوسيط');
    return mockOffers.filter(offer => 
      offer.brokerOffers?.some(br => br.brokerId === brokerId)
    );
  }
}

// **الإحصائيات - Statistics API**

export async function getOfferStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byCity: Record<string, number>;
  recentActivity: number;
}> {
  // محاولة طلب API الحقيقي، مع fallback للبيانات التجريبية
  try {
    return await apiRequest<{
      total: number;
      byStatus: Record<string, number>;
      byType: Record<string, number>;
      byCity: Record<string, number>;
      recentActivity: number;
    }>('/offers/stats');
  } catch (error) {
    // fallback للبيانات التجريبية
    return {
      total: mockOffers.length,
      byStatus: {
        open: mockOffers.filter(o => o.status === 'open').length,
        accepted: mockOffers.filter(o => o.status === 'accepted').length,
        rejected: mockOffers.filter(o => o.status === 'rejected').length,
        closed: mockOffers.filter(o => o.status === 'closed').length
      },
      byType: {
        sale: mockOffers.filter(o => o.type === 'sale').length,
        rent: mockOffers.filter(o => o.type === 'rent').length
      },
      byCity: {
        'الرياض': mockOffers.filter(o => o.city === 'الرياض').length,
        'جدة': mockOffers.filter(o => o.city === 'جدة').length,
        'الدمام': mockOffers.filter(o => o.city === 'الدمام').length
      },
      recentActivity: 7
    };
  }
}

// **البحث المتقدم - Advanced Search API**

export async function searchOffers(query: {
  text?: string;
  filters: {
    role?: string;
    type?: string;
    cities?: string[];
    priceRange?: [number, number];
    propertyTypes?: string[];
  };
  sort?: {
    field: 'price' | 'createdAt' | 'city';
    direction: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}): Promise<{ offers: Offer[]; total: number; suggestions?: string[] }> {
  try {
    return await apiRequest<{ offers: Offer[]; total: number; suggestions?: string[] }>('/offers/search', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  } catch (error) {
    // fallback للبحث في البيانات التجريبية
    console.log('🔍 البحث في البيانات التجريبية...');
    return searchOffersMock(query);
  }
}

// بحث محلي في البيانات التجريبية
function searchOffersMock(query: {
  text?: string;
  filters: {
    role?: string;
    type?: string;
    cities?: string[];
    priceRange?: [number, number];
    propertyTypes?: string[];
  };
  sort?: {
    field: 'price' | 'createdAt' | 'city';
    direction: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}): { offers: Offer[]; total: number; suggestions?: string[] } {
  let filteredOffers = [...mockOffers];
  
  // البحث النصي
  if (query.text) {
    const searchTerm = query.text.toLowerCase();
    filteredOffers = filteredOffers.filter(offer => 
      offer.description.toLowerCase().includes(searchTerm) ||
      offer.city.toLowerCase().includes(searchTerm) ||
      offer.district.toLowerCase().includes(searchTerm) ||
      offer.propertyType.toLowerCase().includes(searchTerm)
    );
  }
  
  // الفلاتر
  const { role, type, cities, priceRange, propertyTypes } = query.filters;
  
  if (role) {
    filteredOffers = filteredOffers.filter(offer => offer.role === role);
  }
  
  if (type) {
    filteredOffers = filteredOffers.filter(offer => offer.type === type);
  }
  
  if (cities && cities.length > 0) {
    filteredOffers = filteredOffers.filter(offer => cities.includes(offer.city));
  }
  
  if (priceRange) {
    const [min, max] = priceRange;
    filteredOffers = filteredOffers.filter(offer => 
      offer.price >= min && offer.price <= max
    );
  }
  
  if (propertyTypes && propertyTypes.length > 0) {
    filteredOffers = filteredOffers.filter(offer => 
      propertyTypes.includes(offer.propertyType)
    );
  }
  
  // الترتيب
  if (query.sort) {
    const { field, direction } = query.sort;
    filteredOffers.sort((a, b) => {
      let aVal, bVal;
      
      switch (field) {
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'city':
          aVal = a.city;
          bVal = b.city;
          break;
        default:
          return 0;
      }
      
      if (direction === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
  
  // التصفيح
  const page = query.page || 1;
  const limit = query.limit || 10;
  const startIndex = (page - 1) * limit;
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + limit);
  
  // اقتراحات البحث
  const suggestions = generateSearchSuggestions(query.text);
  
  return {
    offers: paginatedOffers,
    total: filteredOffers.length,
    suggestions
  };
}

// توليد اقتراحات البحث
function generateSearchSuggestions(searchTerm?: string): string[] {
  const allSuggestions = [
    'شقة للبيع في الرياض',
    'فيلا للإيجار في جدة', 
    'أرض للبيع في الدمام',
    'شقة مفروشة للإيجار',
    'فيلا بمسبح',
    'شقة 3 غرف',
    'عقارات في الياسمين',
    'فلل فاخرة'
  ];
  
  if (!searchTerm) {
    return allSuggestions.slice(0, 5);
  }
  
  // فلترة الاقتراحات حسب مصطلح البحث
  const filtered = allSuggestions.filter(suggestion => 
    suggestion.includes(searchTerm) || searchTerm.includes(suggestion.split(' ')[0])
  );
  
  return filtered.length > 0 ? filtered.slice(0, 5) : allSuggestions.slice(0, 3);
}

// **دوال مساعدة إضافية**

// جلب العروض الشائعة/الرائجة
export async function getTrendingOffers(limit: number = 5): Promise<Offer[]> {
  try {
    return await apiRequest<Offer[]>(`/offers/trending?limit=${limit}`);
  } catch (error) {
    // fallback للبيانات التجريبية
    console.log('📈 استخدام العروض الرائجة التجريبية');
    return mockOffers
      .filter(offer => offer.brokerOffers && offer.brokerOffers.length > 0)
      .sort((a, b) => (b.brokerOffers?.length || 0) - (a.brokerOffers?.length || 0))
      .slice(0, limit);
  }
}

// جلب العروض القريبة حسب الموقع
export async function getNearbyOffers(
  city: string, 
  district?: string, 
  radius?: number
): Promise<Offer[]> {
  try {
    const params = new URLSearchParams({ city });
    if (district) params.append('district', district);
    if (radius) params.append('radius', radius.toString());
    
    return await apiRequest<Offer[]>(`/offers/nearby?${params.toString()}`);
  } catch (error) {
    // fallback للبيانات التجريبية
    console.log('📍 استخدام العروض القريبة التجريبية');
    return mockOffers.filter(offer => 
      offer.city === city && (!district || offer.district === district)
    );
  }
}

// جلب العروض المقترحة للمستخدم
export async function getRecommendedOffers(
  userPreferences: {
    cities?: string[];
    propertyTypes?: string[];
    priceRange?: [number, number];
    type?: string;
  },
  limit: number = 10
): Promise<Offer[]> {
  try {
    return await apiRequest<Offer[]>('/offers/recommendations', {
      method: 'POST',
      body: JSON.stringify({ ...userPreferences, limit }),
    });
  } catch (error) {
    // fallback للبيانات التجريبية
    console.log('💡 استخدام العروض المقترحة التجريبية');
    let recommendations = [...mockOffers];
    
    // فلترة حسب التفضيلات
    if (userPreferences.cities && userPreferences.cities.length > 0) {
      recommendations = recommendations.filter(offer => 
        userPreferences.cities!.includes(offer.city)
      );
    }
    
    if (userPreferences.propertyTypes && userPreferences.propertyTypes.length > 0) {
      recommendations = recommendations.filter(offer => 
        userPreferences.propertyTypes!.includes(offer.propertyType)
      );
    }
    
    if (userPreferences.priceRange) {
      const [min, max] = userPreferences.priceRange;
      recommendations = recommendations.filter(offer => 
        offer.price >= min && offer.price <= max
      );
    }
    
    if (userPreferences.type) {
      recommendations = recommendations.filter(offer => 
        offer.type === userPreferences.type
      );
    }
    
    return recommendations.slice(0, limit);
  }
}

// إحصائيات أداء العرض
export async function getOfferPerformance(offerId: string): Promise<{
  views: number;
  favorites: number;
  responses: number;
  avgResponseTime: number; // بالساعات
  responseRate: number; // نسبة مئوية
}> {
  try {
    return await apiRequest<{
      views: number;
      favorites: number;
      responses: number;
      avgResponseTime: number;
      responseRate: number;
    }>(`/offers/${offerId}/performance`);
  } catch (error) {
    // fallback للبيانات التجريبية
    const offer = mockOffers.find(o => o.id === offerId);
    if (!offer) {
      throw new ApiError('العرض غير موجود', 404, 'NOT_FOUND');
    }
    
    return {
      views: Math.floor(Math.random() * 100) + 20,
      favorites: Math.floor(Math.random() * 20) + 2,
      responses: offer.brokerOffers?.length || 0,
      avgResponseTime: Math.floor(Math.random() * 24) + 2,
      responseRate: offer.brokerOffers?.length ? 
        (offer.brokerOffers.length / Math.max(1, Math.floor(Math.random() * 10) + 5)) * 100 : 0
    };
  }
}

// **Mock Data للتطوير**
// هذه الدوال ستستخدم البيانات المحلية عندما يكون الـ API غير متاح

const mockOffers: Offer[] = [
  {
    id: '1',
    role: 'owner',
    type: 'sale',
    city: 'الرياض',
    district: 'الياسمين',
    propertyType: 'شقة',
    price: 650000,
    description: 'شقة 3 غرف نوم، مفروشة بالكامل، موقع مميز قريب من الخدمات والمولات التجارية، إطلالة رائعة على الحديقة العامة',
    status: 'open',
    createdAt: new Date().toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker1',
        brokerName: 'أحمد العقاري',
        commission: 2.5,
        message: 'لدي خبرة واسعة في منطقة الياسمين، يمكنني تسويق العقار بفعالية وإيجاد مشتري مناسب خلال وقت قصير',
        status: 'pending'
      },
      {
        brokerId: 'broker2',
        brokerName: 'سارة الوسطاء',
        commission: 2.0,
        message: 'متخصصة في الشقق المفروشة، معي قاعدة عملاء كبيرة تبحث عن هذا النوع من العقارات',
        status: 'accepted'
      }
    ]
  },
  {
    id: '2',
    role: 'buyer',
    type: 'buy',
    city: 'جدة',
    district: 'الصفا',
    propertyType: 'فيلا',
    price: 1200000,
    description: 'أبحث عن فيلا للشراء في مجمع سكني راقي، 4-5 غرف مع حديقة ومسبح، منطقة هادئة ومناسبة للعائلة',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker3',
        brokerName: 'محمد الوسيط',
        commission: 3.0,
        message: 'لدي عدة فلل مناسبة لمتطلباتكم في مجمعات راقية، يمكنني ترتيب معاينات فورية',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    role: 'owner',
    type: 'rent',
    city: 'الدمام',
    district: 'الفيصلية',
    propertyType: 'شقة',
    price: 25000,
    description: 'شقة للإيجار السنوي، غرفتين وصالة، مؤثثة بالكامل مع مكيفات وجميع الخدمات، قريبة من المترو ومراكز التسوق',
    status: 'accepted',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker2',
        brokerName: 'سارة الوسطاء',
        commission: 3.0,
        message: 'متخصصة في الإيجارات، يمكنني المساعدة في إيجاد مستأجر مناسب بسرعة ومضمون',
        status: 'accepted'
      }
    ]
  },
  {
    id: '4',
    role: 'lessee',
    type: 'lease',
    city: 'الرياض',
    district: 'النرجس',
    propertyType: 'فيلا',
    price: 80000,
    description: 'أبحث عن فيلا للإيجار في مجمع سكني راقي، 5 غرف مع حديقة ومسبح، إيجار سنوي مع إمكانية التجديد',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker1',
        brokerName: 'أحمد العقاري',
        commission: 2.0,
        message: 'لدي فيلا مناسبة جداً لمتطلباتكم في نفس المنطقة، موقع ممتاز ومرافق متكاملة',
        status: 'pending'
      },
      {
        brokerId: 'broker3',
        brokerName: 'محمد الوسيط',
        commission: 2.5,
        message: 'متخصص في الفلل الفاخرة، معي خيارات ممتازة في النرجس وحي الملقا',
        status: 'pending'
      }
    ]
  },
  {
    id: '5',
    role: 'owner',
    type: 'sale',
    city: 'مكة المكرمة',
    district: 'العزيزية',
    propertyType: 'أرض',
    price: 2500000,
    description: 'أرض سكنية للبيع في موقع استراتيجي قريب من الحرم، مساحة 600 متر مربع، صك إلكتروني جاهز',
    status: 'open',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    brokerOffers: []
  },
  {
    id: '6',
    role: 'lessor',
    type: 'rent',
    city: 'الرياض',
    district: 'حي الملك فهد',
    propertyType: 'دوبليكس',
    price: 45000,
    description: 'دوبليكس للإيجار، 4 غرف نوم، مع روف وحديقة صغيرة، مفروش جزئياً، موقف سيارتين',
    status: 'open',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker4',
        brokerName: 'فاطمة العقارية',
        commission: 2.8,
        message: 'متخصصة في الدوبليكس والفلل، معي قاعدة عملاء واسعة تبحث عن هذا النوع',
        status: 'pending'
      }
    ]
  },
  {
    id: '7',
    role: 'buyer',
    type: 'buy',
    city: 'جدة',
    district: 'أبحر الشمالية',
    propertyType: 'شقة',
    price: 800000,
    description: 'أبحث عن شقة للشراء بإطلالة بحرية، 3-4 غرف، في برج حديث مع مرافق متكاملة وخدمات فندقية',
    status: 'open',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker5',
        brokerName: 'خالد البحري',
        commission: 2.2,
        message: 'متخصص في العقارات البحرية بجدة، لدي شقق ممتازة بإطلالات رائعة في أبراج حديثة',
        status: 'pending'
      },
      {
        brokerId: 'broker6',
        brokerName: 'نورا التجارية',
        commission: 2.7,
        message: 'معي شقق فاخرة في أبحر مع إطلالات بحرية مباشرة، تشطيبات عالية الجودة',
        status: 'pending'
      }
    ]
  },
  {
    id: '8',
    role: 'owner',
    type: 'sale',
    city: 'الخرج',
    district: 'السيح',
    propertyType: 'بيت شعبي',
    price: 450000,
    description: 'بيت شعبي أصيل للبيع، مبني على الطراز النجدي التقليدي، 5 غرف مع صالة كبيرة وحوش واسع',
    status: 'open',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    brokerOffers: []
  },
  {
    id: '9',
    role: 'lessee',
    type: 'lease',
    city: 'الدمام',
    district: 'الواحة',
    propertyType: 'مكتب',
    price: 35000,
    description: 'أبحث عن مكتب للإيجار في برج تجاري، مساحة 100-150 متر، موقف سيارات، إنترنت عالي السرعة',
    status: 'open',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker7',
        brokerName: 'سعد التجاري',
        commission: 3.5,
        message: 'متخصص في العقارات التجارية، لدي مكاتب مجهزة في أفضل الأبراج بالدمام',
        status: 'pending'
      }
    ]
  },
  {
    id: '10',
    role: 'owner',
    type: 'rent',
    city: 'المدينة المنورة',
    district: 'قباء',
    propertyType: 'شقة',
    price: 30000,
    description: 'شقة للإيجار قريبة من مسجد قباء، 3 غرف وصالة، مفروشة للزوار والمعتمرين، موقف داخلي',
    status: 'open',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    brokerOffers: [
      {
        brokerId: 'broker8',
        brokerName: 'عبدالرحمن المدني',
        commission: 2.5,
        message: 'متخصص في عقارات المدينة المنورة، خاصة القريبة من المسجد النبوي والمعالم الدينية',
        status: 'pending'
      }
    ]
  }
];

// Fallback للبيانات المحلية مع فلترة
export async function getOffersMock(filters: {
  role?: string;
  type?: string;
  city?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} = {}): Promise<{ offers: Offer[]; total: number; pages: number }> {
  return new Promise((resolve) => {
    console.log('📋 تحميل البيانات التجريبية...');
    setTimeout(() => {
      let filteredOffers = [...mockOffers];
      
      // تطبيق الفلاتر
      if (filters.role) {
        filteredOffers = filteredOffers.filter(offer => offer.role === filters.role);
      }
      
      if (filters.type) {
        filteredOffers = filteredOffers.filter(offer => offer.type === filters.type);
      }
      
      if (filters.city) {
        filteredOffers = filteredOffers.filter(offer => 
          offer.city.includes(filters.city!) || filters.city!.includes(offer.city)
        );
      }
      
      if (filters.status) {
        filteredOffers = filteredOffers.filter(offer => offer.status === filters.status);
      }
      
      if (filters.minPrice !== undefined) {
        filteredOffers = filteredOffers.filter(offer => offer.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        filteredOffers = filteredOffers.filter(offer => offer.price <= filters.maxPrice!);
      }
      
      // التصفيح
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const total = filteredOffers.length;
      const pages = Math.ceil(total / limit) || 1;
      
      const startIndex = (page - 1) * limit;
      const paginatedOffers = filteredOffers.slice(startIndex, startIndex + limit);
      
      // إضافة الحقول المحسوبة
      const enrichedOffers = paginatedOffers.map(offer => ({
        ...offer,
        isNew: isOfferNew(offer.createdAt),
        hasActiveResponses: offer.brokerOffers?.some(br => br.status === 'pending') || false,
        responseCount: offer.brokerOffers?.length || 0,
        views: Math.floor(Math.random() * 50) + 10,
        favorites: Math.floor(Math.random() * 10) + 1
      }));
      
      console.log(`✅ تم تحميل ${enrichedOffers.length} من ${total} عرض تجريبي`);
      resolve({
        offers: enrichedOffers,
        total,
        pages
      });
    }, Math.random() * 1000 + 500); // محاكاة تأخير شبكي واقعي
  });
}

// معالج الأخطاء للمكونات - محسن
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'TIMEOUT':
        return 'انتهت مهلة الطلب. تحقق من اتصال الإنترنت وحاول مرة أخرى.';
      case 'OFFLINE':
        return 'لا يوجد اتصال بالإنترنت. تحقق من الاتصال وحاول مرة أخرى.';
      case 'UNAUTHORIZED':
        return 'انتهت جلسة المستخدم. يرجى تسجيل الدخول مرة أخرى.';
      case 'FORBIDDEN':
        return 'ليس لديك صلاحية للقيام بهذا الإجراء. تواصل مع الإدارة.';
      case 'NOT_FOUND':
        return 'العنصر المطلوب غير موجود أو تم حذفه.';
      case 'CONFLICT':
        return 'البيانات موجودة مسبقاً. يرجى التحقق من المدخلات.';
      case 'VALIDATION_ERROR':
        return 'بيانات غير صحيحة. تحقق من جميع الحقول المطلوبة.';
      case 'RATE_LIMITED':
        return 'كثرة الطلبات. انتظر دقيقة واحدة ثم حاول مرة أخرى.';
      case 'SERVER_ERROR':
        return 'خطأ في الخادم. تم إبلاغ الفريق التقني. حاول لاحقاً.';
      case 'SERVICE_UNAVAILABLE':
        return 'الخدمة غير متاحة حالياً للصيانة. حاول خلال دقائق.';
      default:
        return error.message || 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.';
    }
  }
  
  if (error instanceof Error) {
    return `خطأ: ${error.message}`;
  }
  
  return 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً أو تواصل مع الدعم الفني.';
}

// دالة للتحقق من حالة الشبكة
export function getNetworkStatus(): {
  isOnline: boolean;
  type: 'wifi' | 'cellular' | 'unknown' | 'none';
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
} {
  const isOnline = navigator.onLine;
  
  // @ts-ignore - للوصول لـ connection API
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    isOnline,
    type: connection?.type || (isOnline ? 'unknown' : 'none'),
    effectiveType: connection?.effectiveType
  };
}

// دالة للحصول على معلومات صحة API
export async function getApiHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  version: string;
  features: string[];
}> {
  const startTime = Date.now();
  
  try {
    const health = await apiRequest<{
      status: string;
      version: string;
      features: string[];
    }>('/health');
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: health.status === 'ok' ? 'healthy' : 'degraded',
      responseTime,
      version: health.version,
      features: health.features
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    // إذا استغرق أكثر من 5 ثوان، الخدمة بطيئة
    if (responseTime > 5000) {
      return {
        status: 'degraded',
        responseTime,
        version: 'unknown',
        features: ['basic-fallback']
      };
    }
    
    return {
      status: 'down',
      responseTime,
      version: 'unknown',
      features: ['offline-mode']
    };
  }
}

// دالة للحصول على إحصائيات الاستخدام
export async function getUsageStats(): Promise<{
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  errorBreakdown: Record<string, number>;
}> {
  try {
    return await apiRequest<{
      totalRequests: number;
      successRate: number;
      avgResponseTime: number;
      errorBreakdown: Record<string, number>;
    }>('/stats/usage');
  } catch (error) {
    // fallback للإحصائيات التجريبية
    return {
      totalRequests: Math.floor(Math.random() * 10000) + 1000,
      successRate: 95.2 + Math.random() * 3,
      avgResponseTime: 200 + Math.random() * 300,
      errorBreakdown: {
        'TIMEOUT': 2,
        'SERVER_ERROR': 1,
        'NOT_FOUND': 5,
        'VALIDATION_ERROR': 3
      }
    };
  }
}

// حالة التحميل والخطأ للمكونات - محسنة
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
  isEmpty?: boolean;
  hasMore?: boolean;
}

export function createInitialApiState<T>(): ApiState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    lastUpdated: undefined,
    isEmpty: false,
    hasMore: true
  };
}

// hook مساعد للـ API state
export function createApiSuccessState<T>(data: T): ApiState<T> {
  return {
    data,
    loading: false,
    error: null,
    lastUpdated: new Date(),
    isEmpty: Array.isArray(data) ? data.length === 0 : !data,
    hasMore: true
  };
}

export function createApiLoadingState<T>(currentData?: T): ApiState<T> {
  return {
    data: currentData || null,
    loading: true,
    error: null,
    lastUpdated: undefined,
    isEmpty: false,
    hasMore: true
  };
}

export function createApiErrorState<T>(error: string, currentData?: T): ApiState<T> {
  return {
    data: currentData || null,
    loading: false,
    error,
    lastUpdated: undefined,
    isEmpty: false,
    hasMore: false
  };
}

// دوال مساعدة للتحقق من البيانات
export function isOfferExpired(createdAt: string, daysToExpire: number = 30): boolean {
  const offerDate = new Date(createdAt);
  const expiryDate = new Date(offerDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  return new Date() > expiryDate;
}

export function getOfferAgeInDays(createdAt: string): number {
  const offerDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - offerDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatOfferAge(createdAt: string): string {
  const now = new Date();
  const offerDate = new Date(createdAt);
  const diffMs = now.getTime() - offerDate.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `منذ ${diffMinutes} دقيقة`;
  } else if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  } else if (diffDays < 30) {
    return `منذ ${diffDays} يوم`;
  } else {
    const diffMonths = Math.floor(diffDays / 30);
    return `منذ ${diffMonths} شهر`;
  }
}

// تصدير الثوابت للاستخدام في المكونات
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
  RETRY_ATTEMPTS,
  RETRY_DELAY
} as const;

// تصدير أنواع الأخطاء
export { ApiError };

// تصدير دالة التحقق من البيانات الجديدة
export { isOfferNew };

// دالة لطباعة حالة API للتطوير
export function logApiStatus(): void {
  const networkStatus = getNetworkStatus();
  console.group('🔧 حالة API');
  console.log('📡 حالة الشبكة:', networkStatus.isOnline ? '✅ متصل' : '❌ غير متصل');
  console.log('🌐 نوع الاتصال:', networkStatus.type);
  if (networkStatus.effectiveType) {
    console.log('📶 سرعة الاتصال:', networkStatus.effectiveType);
  }
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('⏱️ مهلة الطلب:', `${API_TIMEOUT / 1000} ثانية`);
  console.log('🔄 عدد المحاولات:', RETRY_ATTEMPTS);
  console.groupEnd();
}

// تصدير البيانات التجريبية للاختبار
export const MOCK_DATA = {
  offers: [...mockOffers],
  generateRandomOffer: (): Offer => {
    const roles = ['owner', 'buyer', 'lessor', 'lessee'];
    const types = ['sale', 'rent', 'buy', 'lease'];
    const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'];
    const propertyTypes = ['شقة', 'فيلا', 'أرض', 'مكتب', 'دوبليكس', 'بيت شعبي'];
    
    return {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: roles[Math.floor(Math.random() * roles.length)] as any,
      type: types[Math.floor(Math.random() * types.length)] as any,
      city: cities[Math.floor(Math.random() * cities.length)],
      district: 'حي تجريبي',
      propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      price: Math.floor(Math.random() * 2000000) + 100000,
      description: 'وصف تجريبي للعقار مع تفاصيل مختلفة وميزات متنوعة',
      status: 'open',
      createdAt: new Date().toISOString(),
      brokerOffers: []
    };
  }
} as const;

// إضافة log للإصدار عند تحميل الملف
console.log('🚀 Waseety API Client v1.2.0 - Ready');
if (process.env.NODE_ENV === 'development') {
  logApiStatus();
}