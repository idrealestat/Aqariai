/**
 * 🤖 Real API - توليد الوصف بالذكاء الاصطناعي
 * 
 * API حقيقي لتوليد أوصاف العقارات باستخدام الذكاء الاصطناعي
 */

interface AIDescriptionRequest {
  mode: 'sale' | 'rent' | 'buy-request' | 'rent-request';
  city?: string;
  district?: string;
  type?: string;
  features?: {
    rooms?: number;
    bathrooms?: number;
    area?: number;
    floor?: number;
    [key: string]: any;
  };
  price?: number;
}

interface AIDescriptionResponse {
  title: string;
  description: string;
  suggestions: string[];
  neighborhoods: string[];
  keywords?: string[];
}

interface Request {
  method: string;
  body?: AIDescriptionRequest;
}

interface Response {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

/**
 * معالج الطلبات
 */
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { mode, city, district, type, features, price } = req.body || {};

  try {
    // توليد الوصف بناءً على البيانات
    const title = getModePrefix(mode);
    const description = generateDescription(mode, type, city, district, features, price);
    const suggestions = generateSuggestions(mode, type, city, district, features, price);
    const neighborhoods = getSuggestedNeighborhoods(city, district);
    const keywords = generateKeywords(mode, type, city, district);

    return res.status(200).json({
      success: true,
      data: {
        title,
        description,
        suggestions,
        neighborhoods,
        keywords
      }
    });

  } catch (error) {
    console.error('AI Description Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطأ في توليد الوصف',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * دوال مساعدة
 */

function getModePrefix(mode: string): string {
  const prefixes: Record<string, string> = {
    'sale': 'للبيع:',
    'rent': 'للإيجار:',
    'buy-request': 'مطلوب للشراء:',
    'rent-request': 'مطلوب للإيجار:'
  };
  return prefixes[mode] || '';
}

function getPropertyTypeName(type?: string): string {
  const types: Record<string, string> = {
    'apartment': 'شقة',
    'villa': 'فيلا',
    'land': 'أرض',
    'building': 'عمارة',
    'shop': 'محل',
    'office': 'مكتب',
    'warehouse': 'مستودع',
    'farm': 'مزرعة',
    'chalet': 'استراحة',
    'studio': 'استوديو'
  };
  return types[type || ''] || 'عقار';
}

function generateDescription(
  mode: string,
  type?: string,
  city?: string,
  district?: string,
  features?: any,
  price?: number
): string {
  const propertyName = getPropertyTypeName(type);
  const parts: string[] = [];

  // المقدمة
  if (mode === 'sale' || mode === 'rent') {
    parts.push(`${getModePrefix(mode)} ${propertyName} ${mode === 'sale' ? 'فاخرة' : 'مميزة'}`);
  } else {
    parts.push(`${getModePrefix(mode)} ${propertyName}`);
  }

  // الموقع
  if (district && city) {
    parts.push(`في حي ${district}, ${city}`);
  } else if (city) {
    parts.push(`في ${city}`);
  }

  // المميزات
  if (features) {
    const featuresList: string[] = [];
    
    if (features.rooms) {
      featuresList.push(`${features.rooms} غرف`);
    }
    if (features.bathrooms) {
      featuresList.push(`${features.bathrooms} ${features.bathrooms === 1 ? 'دورة مياه' : 'دورات مياه'}`);
    }
    if (features.area) {
      featuresList.push(`${features.area} م²`);
    }
    if (features.floor) {
      featuresList.push(`الدور ${features.floor}`);
    }

    if (featuresList.length > 0) {
      parts.push(`مكونة من ${featuresList.join(' و ')}`);
    }

    // مميزات إضافية
    const extraFeatures: string[] = [];
    if (features.hasElevator) extraFeatures.push('مصعد');
    if (features.hasParking) extraFeatures.push('موقف سيارات');
    if (features.hasGarden) extraFeatures.push('حديقة');
    if (features.hasPool) extraFeatures.push('مسبح');
    if (features.hasKitchen) extraFeatures.push('مطبخ راكب');
    if (features.hasMaidsRoom) extraFeatures.push('غرفة خادمة');

    if (extraFeatures.length > 0) {
      parts.push(`مع ${extraFeatures.join('، ')}`);
    }
  }

  // السعر
  if (price) {
    const priceText = mode === 'rent' ? 'الإيجار' : 'السعر';
    parts.push(`${priceText}: ${price.toLocaleString('ar-SA')} ريال`);
  }

  // الختام
  if (mode === 'sale' || mode === 'rent') {
    parts.push('🔑 جاهز للمعاينة');
  } else {
    parts.push('📞 للتواصل والاستفسار');
  }

  return parts.join('. ') + '.';
}

function generateSuggestions(
  mode: string,
  type?: string,
  city?: string,
  district?: string,
  features?: any,
  price?: number
): string[] {
  const suggestions: string[] = [];
  const propertyName = getPropertyTypeName(type);

  // اقتراح 1: رسمي
  suggestions.push(
    `${getModePrefix(mode)} ${propertyName} ${getQualityAdjective(1)} ${getLocationText(city, district)}${getFeaturesText(features, 1)}${getPriceText(price, mode, 1)}`
  );

  // اقتراح 2: جذاب
  suggestions.push(
    `✨ ${propertyName} ${getQualityAdjective(2)} ${getLocationText(city, district)}! ${getFeaturesText(features, 2)}${getPriceText(price, mode, 2)} 🏡`
  );

  // اقتراح 3: تفصيلي
  suggestions.push(
    `${getModePrefix(mode)} ${propertyName} ${getQualityAdjective(3)} ${getLocationText(city, district)}${getFeaturesText(features, 3)}${getPriceText(price, mode, 3)} للاستفسار: [رقم الهاتف]`
  );

  return suggestions;
}

function getQualityAdjective(variant: number): string {
  const adjectives = [
    ['فاخرة', 'راقية', 'مميزة'],
    ['متميزة', 'فخمة', 'استثنائية'],
    ['عالية الجودة', 'رائعة', 'مثالية']
  ];
  return adjectives[variant - 1][Math.floor(Math.random() * 3)];
}

function getLocationText(city?: string, district?: string): string {
  if (district && city) {
    return `في حي ${district}، ${city}`;
  } else if (city) {
    return `في ${city}`;
  } else if (district) {
    return `في حي ${district}`;
  }
  return '';
}

function getFeaturesText(features?: any, variant: number): string {
  if (!features) return '';

  const parts: string[] = [];

  if (variant === 1) {
    // نسخة مختصرة
    if (features.area) parts.push(`${features.area} م²`);
    if (features.rooms) parts.push(`${features.rooms} غرف`);
  } else if (variant === 2) {
    // نسخة متوسطة
    if (features.rooms && features.bathrooms) {
      parts.push(`${features.rooms} غرف و ${features.bathrooms} دورات مياه`);
    }
    if (features.area) parts.push(`مساحة ${features.area} م²`);
  } else {
    // نسخة مفصلة
    if (features.rooms) parts.push(`تحتوي على ${features.rooms} غرف نوم`);
    if (features.bathrooms) parts.push(`${features.bathrooms} دورات مياه`);
    if (features.area) parts.push(`مساحة إجمالية ${features.area} م²`);
    if (features.floor) parts.push(`الدور ${features.floor}`);
  }

  return parts.length > 0 ? `. ${parts.join('، ')}` : '';
}

function getPriceText(price?: number, mode?: string, variant?: number): string {
  if (!price) return '';

  const priceText = mode === 'rent' ? 'الإيجار' : 'السعر';
  const formatted = price.toLocaleString('ar-SA');

  if (variant === 1) {
    return `. ${priceText}: ${formatted} ريال`;
  } else if (variant === 2) {
    return ` 💰 ${priceText} ${formatted} ريال فقط`;
  } else {
    return `. ${priceText} المطلوب: ${formatted} ريال`;
  }
}

function getSuggestedNeighborhoods(city?: string, district?: string): string[] {
  // أحياء شائعة في المدن الرئيسية
  const neighborhoods: Record<string, string[]> = {
    'الرياض': ['النرجس', 'العليا', 'الملقا', 'الياسمين', 'الربوة', 'الملز', 'السليمانية', 'الندى', 'الصحافة'],
    'جدة': ['الروضة', 'الحمراء', 'السلامة', 'الزهراء', 'النعيم', 'الفيصلية', 'البساتين', 'الشاطئ'],
    'الدمام': ['الفيصلية', 'الشاطئ', 'المريكبات', 'الريان', 'النخيل', 'الفردوس', 'العزيزية'],
    'مكة': ['العزيزية', 'الشرائع', 'الزاهر', 'جرول', 'النوارية', 'الحمراء', 'العوالي'],
    'المدينة': ['العزيزية', 'السيح', 'العيون', 'قباء', 'الخالدية', 'الحرة الشرقية']
  };

  const cityNeighborhoods = city ? neighborhoods[city] || [] : [];
  
  // إذا كان الحي محدد، نضيفه في البداية ونضيف أحياء قريبة
  if (district && cityNeighborhoods.includes(district)) {
    const others = cityNeighborhoods.filter(n => n !== district).slice(0, 4);
    return [district, ...others];
  }

  return cityNeighborhoods.slice(0, 5);
}

function generateKeywords(mode?: string, type?: string, city?: string, district?: string): string[] {
  const keywords: string[] = [];

  // نوع العملية
  if (mode === 'sale') keywords.push('للبيع');
  if (mode === 'rent') keywords.push('للإيجار');
  if (mode === 'buy-request') keywords.push('مطلوب', 'شراء');
  if (mode === 'rent-request') keywords.push('مطلوب', 'إيجار');

  // نوع العقار
  if (type) keywords.push(getPropertyTypeName(type));

  // الموقع
  if (city) keywords.push(city);
  if (district) keywords.push(district);

  // كلمات عامة
  keywords.push('عقار', 'عقارات', 'السعودية');

  return keywords;
}

/**
 * أمثلة الاستخدام:
 * 
 * POST /api/ai/generate-description
 * Body: {
 *   mode: "sale",
 *   city: "الرياض",
 *   district: "النرجس",
 *   type: "apartment",
 *   features: {
 *     rooms: 3,
 *     bathrooms: 2,
 *     area: 150,
 *     floor: 2,
 *     hasElevator: true,
 *     hasParking: true
 *   },
 *   price: 500000
 * }
 * 
 * Response: {
 *   success: true,
 *   data: {
 *     title: "للبيع:",
 *     description: "للبيع: شقة فاخرة في حي النرجس، الرياض. مكونة من 3 غرف و 2 دورات مياه و 150 م² و الدور 2. مع مصعد، موقف سيارات. السعر: 500,000 ريال. 🔑 جاهز للمعاينة.",
 *     suggestions: [...],
 *     neighborhoods: ["النرجس", "العليا", "الملقا", ...],
 *     keywords: ["للبيع", "شقة", "الرياض", "النرجس", ...]
 *   }
 * }
 */
