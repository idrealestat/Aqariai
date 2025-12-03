// ============================================================
// 📢 نظام إدارة الإعلانات المنشورة
// يربط الإعلانات المنشورة ببطاقات العملاء (المالكين) في CRM
// ============================================================

export interface PublishedAd {
  // معرفات
  id: string;
  adNumber: string; // رقم الإعلان الفريد
  
  // ربط المالك
  ownerPhone: string; // رقم جوال المالك (المفتاح الأساسي للربط)
  ownerName: string; // اسم المالك
  ownerId: string; // معرف المالك في CRM
  
  // بيانات الإعلان الأساسية
  title: string;
  description: string; // الوصف النهائي (سيحفظ في ملاحظات بطاقة المالك)
  propertyType: string; // نوع العقار (شقة، فيلا، إلخ)
  purpose: string; // الغرض (بيع، إيجار، إلخ)
  price: string;
  area: string;
  
  // تفاصيل العقار
  bedrooms: number;
  bathrooms: number;
  location: {
    city: string;
    district: string;
    street: string;
    postalCode: string;
    buildingNumber: string;
    additionalNumber: string;
    latitude: number;
    longitude: number;
    nationalAddress?: string; // العنوان الوطني
  };
  
  // معلومات المالك الإضافية
  idNumber: string; // رقم بطاقة الأحوال
  idIssueDate: string; // تاريخ إصدار بطاقة الأحوال
  idExpiryDate: string; // تاريخ انتهاء بطاقة الأحوال
  deedNumber: string; // رقم الصك
  deedDate: string; // تاريخ الصك
  deedIssuer: string; // جهة إصدار الصك
  
  // الوسائط (سيتم حفظها في الوسائط المتعددة لبطاقة المالك)
  mediaFiles: {
    id: string;
    url: string;
    type: 'image' | 'video';
    name: string;
  }[];
  
  // المنصات المعلن عليها
  publishedPlatforms: {
    id: string;
    name: string; // اسم المنصة (حراج، عقار ماب، إلخ)
    status: 'published' | 'pending' | 'failed';
    publishedAt: Date;
    adUrl?: string; // رابط الإعلان على المنصة
  }[];
  
  // الهاشتاقات والمسار
  hashtags: string[];
  platformPath: string;
  
  // معلومات الترخيص
  advertisingLicense: string;
  advertisingLicenseStatus: 'valid' | 'invalid' | 'checking' | 'unknown';
  
  // الذكاء الاصطناعي
  aiGeneratedDescription: string;
  aiLanguage: string;
  aiTone: string;
  
  // التواريخ
  createdAt: Date;
  publishedAt: Date;
  updatedAt: Date;
  
  // رابط الجولة الافتراضية
  virtualTourLink?: string;
  
  // رقم الواتساب
  whatsappNumber: string;
  
  // الضمانات
  warranties: {
    id: string;
    type: string;
    duration: string;
    notes: string;
  }[];
  
  // المميزات المخصصة
  customFeatures: string[];
  
  // الإحصائيات (للتحليل)
  stats: {
    views: number;
    requests: number;
    likes: number;
    shares: number;
  };
  
  // الحالة
  // 🔄 draft = في لوحة التحكم فقط
  // 🌐 published = منشور على منصتي العامة
  // ⚠️ active/inactive/sold/rented/archived = حالات إضافية
  status: 'draft' | 'published' | 'active' | 'inactive' | 'sold' | 'rented' | 'archived';
  
  // ملاحظات إضافية
  notes: string;
  
  // 🆕 التصنيف الذكي (المضاف: 31 أكتوبر 2025)
  propertyCategory: 'سكني' | 'تجاري'; // التصنيف: سكني أو تجاري
  
  // 🆕 المسار الذكي (يتم توليده تلقائياً)
  smartPath?: string; // مثال: "الخبر/العقربية/شقة/بيع/سكني"
}

// مفتاح التخزين في localStorage
const STORAGE_KEY = 'published_ads_storage';

// ============================================================
// 📝 دوال إدارة الإعلانات المنشورة
// ============================================================

/**
 * التحقق من تطابق الإعلان 100% مع إعلان موجود
 */
function isAdDuplicate(ad: PublishedAd, existingAds: PublishedAd[]): PublishedAd | null {
  // البحث عن إعلان مطابق تماماً بنفس:
  // - نفس رقم الجوال المالك
  // - نفس نوع العقار
  // - نفس الغرض (بيع/إيجار)
  // - نفس المساحة
  // - نفس السعر
  // - نفس المدينة والحي
  // - نفس عدد الغرف والحمامات
  
  for (const existing of existingAds) {
    if (
      existing.ownerPhone === ad.ownerPhone &&
      existing.propertyType === ad.propertyType &&
      existing.purpose === ad.purpose &&
      existing.area === ad.area &&
      existing.price === ad.price &&
      existing.location.city === ad.location.city &&
      existing.location.district === ad.location.district &&
      existing.bedrooms === ad.bedrooms &&
      existing.bathrooms === ad.bathrooms
    ) {
      console.log('⚠️ تم العثور على إعلان مطابق 100%:', existing.adNumber);
      return existing;
    }
  }
  
  return null;
}

/**
 * حفظ إعلان منشور جديد (مع فحص التكرار)
 */
export function savePublishedAd(ad: PublishedAd): { success: boolean; duplicate?: PublishedAd; message: string } {
  try {
    console.log('🚀 ==================== بدء حفظ إعلان جديد ====================');
    
    const ads = getAllPublishedAds();
    console.log('📊 عدد الإعلانات الموجودة قبل الحفظ:', ads.length);
    
    console.log('💾 بيانات الإعلان المراد حفظه:', {
      id: ad.id,
      adNumber: ad.adNumber,
      status: ad.status,  // 🔍 يجب أن تكون "draft" أو "published"
      ownerName: ad.ownerName,
      ownerPhone: ad.ownerPhone,
      city: ad.location.city,
      title: ad.title
    });
    
    // ✅ فحص التكرار 100%
    const duplicate = isAdDuplicate(ad, ads);
    if (duplicate) {
      console.log('🚫 الإعلان مكرر! لن يتم الحفظ. الإعلان الموجود:', duplicate.adNumber);
      return {
        success: false,
        duplicate,
        message: `⚠️ هذا الإعلان موجود بالفعل!\n\nرقم الإعلان الموجود: ${duplicate.adNumber}\nتاريخ النشر: ${new Date(duplicate.createdAt).toLocaleDateString('ar-SA')}\n\nلا يمكن إضافة إعلان مكرر 100%.`
      };
    }
    
    // التحقق من عدم وجود إعلان بنفس الرقم (تحديث)
    const existingIndex = ads.findIndex(a => a.id === ad.id);
    
    if (existingIndex >= 0) {
      // تحديث الإعلان الموجود
      ads[existingIndex] = ad;
      console.log('🔄 تم تحديث إعلان موجود في الموقع:', existingIndex);
    } else {
      // إضافة إعلان جديد
      ads.push(ad);
      console.log('➕ تم إضافة إعلان جديد في الموقع:', ads.length - 1);
    }
    
    // حفظ في localStorage
    const jsonData = JSON.stringify(ads);
    localStorage.setItem(STORAGE_KEY, jsonData);
    console.log('💿 تم حفظ الإعلانات في localStorage');
    console.log('📊 العدد الكلي بعد الحفظ:', ads.length);
    
    // التحقق من الحفظ
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('✅ تم التحقق من الحفظ: عدد الإعلانات =', parsedData.length);
    }
    
    // إرسال حدث مخصص لتحديث UI
    window.dispatchEvent(new CustomEvent('publishedAdSaved', { detail: ad }));
    console.log('📡 تم إطلاق حدث publishedAdSaved');
    
    console.log('✅ تم حفظ الإعلان المنشور بنجاح:', ad.adNumber);
    console.log('🚀 ==========================================================');
    
    return {
      success: true,
      message: `✅ تم حفظ الإعلان بنجاح!\nرقم الإعلان: ${ad.adNumber}`
    };
  } catch (error) {
    console.error('❌ خطأ في حفظ الإعلان:', error);
    return {
      success: false,
      message: '❌ حدث خطأ أثناء حفظ الإعلان'
    };
  }
}

/**
 * الحصول على جميع الإعلانات المنشورة
 */
export function getAllPublishedAds(): PublishedAd[] {
  try {
    console.log('🔍 قراءة الإعلانات من localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      console.log('📭 لا توجد إعلانات محفوظة في localStorage');
      console.log('🔑 المفتاح المستخدم:', STORAGE_KEY);
      return [];
    }
    
    const ads = JSON.parse(stored);
    console.log('📊 تم قراءة الإعلانات من localStorage. العدد:', ads.length);
    
    // تحويل التواريخ من strings إلى Date objects
    const parsedAds = ads.map((ad: any) => ({
      ...ad,
      createdAt: new Date(ad.createdAt),
      publishedAt: new Date(ad.publishedAt),
      updatedAt: new Date(ad.updatedAt),
      publishedPlatforms: ad.publishedPlatforms.map((p: any) => ({
        ...p,
        publishedAt: new Date(p.publishedAt)
      }))
    }));
    
    console.log('✅ تم معالجة الإعلانات:', parsedAds.map((ad, index) => ({
      index,
      adNumber: ad.adNumber,
      status: ad.status,
      city: ad.location?.city,
      ownerName: ad.ownerName
    })));
    
    return parsedAds;
  } catch (error) {
    console.error('❌ خطأ في قراءة الإعلانات:', error);
    return [];
  }
}

/**
 * الحصول على إعلانات مالك معين (بناءً على رقم الجوال)
 */
export function getAdsByOwnerPhone(ownerPhone: string): PublishedAd[] {
  const allAds = getAllPublishedAds();
  return allAds.filter(ad => ad.ownerPhone === ownerPhone);
}

/**
 * الحصول على إعلان بواسطة رقم الإعلان
 */
export function getAdByNumber(adNumber: string): PublishedAd | null {
  const ads = getAllPublishedAds();
  return ads.find(ad => ad.adNumber === adNumber) || null;
}

/**
 * تحديث إعلان منشور
 */
export function updatePublishedAd(adNumber: string, updates: Partial<PublishedAd>): { success: boolean; message: string } {
  try {
    const ads = getAllPublishedAds();
    const index = ads.findIndex(ad => ad.adNumber === adNumber);
    
    if (index === -1) {
      return {
        success: false,
        message: `لم يتم العثور على الإعلان: ${adNumber}`
      };
    }
    
    // تحديث الإعلان
    ads[index] = {
      ...ads[index],
      ...updates,
      updatedAt: new Date()
    };
    
    // حفظ في localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    
    // إطلاق حدث التحديث
    window.dispatchEvent(new CustomEvent('publishedAdUpdated', { detail: ads[index] }));
    
    console.log('✅ تم تحديث الإعلان:', adNumber);
    
    return {
      success: true,
      message: 'تم تحديث الإعلان بنجاح'
    };
  } catch (error) {
    console.error('❌ خطأ في تحديث الإعلان:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث الإعلان'
    };
  }
}

/**
 * الحصول على إعلان محدد
 */
export function getPublishedAdById(id: string): PublishedAd | null {
  const ads = getAllPublishedAds();
  return ads.find(ad => ad.id === id) || null;
}

/**
 * حذف إعلان منشور
 */
export function deletePublishedAd(id: string): void {
  try {
    const ads = getAllPublishedAds();
    const filteredAds = ads.filter(ad => ad.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAds));
    
    // إرسال حدث مخصص
    window.dispatchEvent(new CustomEvent('publishedAdDeleted', { detail: { id } }));
    
    console.log('✅ تم حذف الإعلان:', id);
  } catch (error) {
    console.error('❌ خطأ في حذف الإعلان:', error);
  }
}

/**
 * تحديث حالة الإعلان
 */
export function updateAdStatus(id: string, status: PublishedAd['status']): void {
  try {
    const ads = getAllPublishedAds();
    const adIndex = ads.findIndex(ad => ad.id === id);
    
    if (adIndex >= 0) {
      ads[adIndex].status = status;
      ads[adIndex].updatedAt = new Date();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
      
      console.log('✅ تم تحديث حالة الإعلان:', id, status);
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث حالة الإعلان:', error);
  }
}

/**
 * تحديث إحصائيات الإعلان
 */
export function updateAdStats(id: string, stats: Partial<PublishedAd['stats']>): void {
  try {
    const ads = getAllPublishedAds();
    const adIndex = ads.findIndex(ad => ad.id === id);
    
    if (adIndex >= 0) {
      ads[adIndex].stats = { ...ads[adIndex].stats, ...stats };
      ads[adIndex].updatedAt = new Date();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث إحصائيات الإعلان:', error);
  }
}

/**
 * توليد رقم إعلان فريد
 */
export function generateAdNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `AD-${timestamp}-${random}`;
}

/**
 * تصدير الإعلانات (للنسخ الاحتياطي)
 */
export function exportPublishedAds(): string {
  const ads = getAllPublishedAds();
  return JSON.stringify(ads, null, 2);
}

/**
 * استيراد الإعلانات (من نسخة احتياطية)
 */
export function importPublishedAds(jsonData: string): void {
  try {
    const ads = JSON.parse(jsonData);
    localStorage.setItem(STORAGE_KEY, jsonData);
    console.log(`✅ تم استيراد ${ads.length} إعلان`);
  } catch (error) {
    console.error('❌ خطأ في استيراد الإعلانات:', error);
  }
}

// ============================================================
// 🆕 نظام المسارات الذكية (المضاف: 31 أكتوبر 2025)
// ============================================================

/**
 * توليد المسار الذكي للإعلان
 * الترتيب: المدينة/الحي/نوع العقار/الغرض/التصنيف
 */
export function generateSmartPath(ad: PublishedAd): string {
  const parts = [
    ad.location.city || 'غير محدد',
    ad.location.district || 'غير محدد',
    ad.propertyType || 'غير محدد',
    ad.purpose || 'غير محدد',
    ad.propertyCategory || 'غير محدد'
  ];
  
  return parts.join('/');
}

/**
 * الحصول على المسارات الموجودة فعلياً
 * يرجع فقط المسارات التي لها إعلانات منشورة
 */
export function getExistingPaths(): string[] {
  const ads = getAllPublishedAds().filter(ad => ad.status === 'published');
  const paths = new Set<string>();
  
  ads.forEach(ad => {
    const path = ad.smartPath || generateSmartPath(ad);
    paths.add(path);
  });
  
  return Array.from(paths).sort();
}

/**
 * الحصول على ترشيحات المسارات بناءً على البيانات الموجودة
 * يرجع قيم فريدة لكل مستوى من المسار
 */
export interface PathSuggestions {
  cities: string[];
  districts: string[]; // بناءً على المدينة المختارة
  propertyTypes: string[]; // بناءً على المدينة والحي
  purposes: string[]; // بناءً على المدينة والحي ونوع العقار
  categories: string[]; // بناءً على كل ما سبق
}

export function getPathSuggestions(filters?: {
  city?: string;
  district?: string;
  propertyType?: string;
  purpose?: string;
}): PathSuggestions {
  const ads = getAllPublishedAds().filter(ad => ad.status === 'published');
  
  // فلترة الإعلانات بناءً على الفلاتر المطبقة
  let filteredAds = ads;
  
  if (filters?.city) {
    filteredAds = filteredAds.filter(ad => ad.location.city === filters.city);
  }
  
  if (filters?.district) {
    filteredAds = filteredAds.filter(ad => ad.location.district === filters.district);
  }
  
  if (filters?.propertyType) {
    filteredAds = filteredAds.filter(ad => ad.propertyType === filters.propertyType);
  }
  
  if (filters?.purpose) {
    filteredAds = filteredAds.filter(ad => ad.purpose === filters.purpose);
  }
  
  // استخراج القيم الفريدة
  const cities = Array.from(new Set(ads.map(ad => ad.location.city).filter(Boolean)));
  const districts = Array.from(new Set(filteredAds.map(ad => ad.location.district).filter(Boolean)));
  const propertyTypes = Array.from(new Set(filteredAds.map(ad => ad.propertyType).filter(Boolean)));
  const purposes = Array.from(new Set(filteredAds.map(ad => ad.purpose).filter(Boolean)));
  const categories = Array.from(new Set(filteredAds.map(ad => ad.propertyCategory).filter(Boolean)));
  
  return {
    cities: cities.sort(),
    districts: districts.sort(),
    propertyTypes: propertyTypes.sort(),
    purposes: purposes.sort(),
    categories: categories.sort()
  };
}

/**
 * تجميع الإعلانات حسب المسار الذكي
 */
export interface GroupedAds {
  path: string;
  ads: PublishedAd[];
  firstImage: string; // أول صورة من أول إعلان (الأقدم)
  count: number;
  pathParts: {
    city: string;
    district: string;
    propertyType: string;
    purpose: string;
    category: string;
  };
}

export function groupAdsBySmartPath(): GroupedAds[] {
  const ads = getAllPublishedAds().filter(ad => ad.status === 'published');
  const groups = new Map<string, PublishedAd[]>();
  
  // تجميع الإعلانات حسب المسار
  ads.forEach(ad => {
    const path = ad.smartPath || generateSmartPath(ad);
    
    if (!groups.has(path)) {
      groups.set(path, []);
    }
    
    groups.get(path)!.push(ad);
  });
  
  // تحويل إلى مصفوفة GroupedAds
  const result: GroupedAds[] = [];
  
  groups.forEach((groupAds, path) => {
    // ترتيب الإعلانات حسب التاريخ (الأقدم أولاً)
    groupAds.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // الحصول على أول صورة من أول إعلان
    const firstAd = groupAds[0];
    const firstImage = firstAd.mediaFiles.length > 0 
      ? firstAd.mediaFiles[0].url 
      : '';
    
    // تقسيم المسار
    const parts = path.split('/');
    
    result.push({
      path,
      ads: groupAds,
      firstImage,
      count: groupAds.length,
      pathParts: {
        city: parts[0] || 'غير محدد',
        district: parts[1] || 'غير محدد',
        propertyType: parts[2] || 'غير محدد',
        purpose: parts[3] || 'غير محدد',
        category: parts[4] || 'غير محدد'
      }
    });
  });
  
  // ترتيب حسب عدد الإعلانات (الأكثر أولاً)
  result.sort((a, b) => b.count - a.count);
  
  return result;
}

/**
 * الحصول على إعلانات مسار معين
 */
export function getAdsByPath(path: string): PublishedAd[] {
  const ads = getAllPublishedAds().filter(ad => ad.status === 'published');
  return ads.filter(ad => {
    const adPath = ad.smartPath || generateSmartPath(ad);
    return adPath === path;
  }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
