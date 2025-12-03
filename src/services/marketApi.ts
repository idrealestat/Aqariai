// خدمة API لتحليلات السوق العقاري

import { MarketData, MarketFilter, TrendData } from "../types/market";

// محاكاة بيانات حقيقية للاختبار
const MOCK_MARKET_DATA: Record<string, MarketData> = {
  "الرياض-العليا-شقة-بيع": {
    avgPrice: 850000,
    pricePerSqm: 4200,
    demand: 74,
    trend: [
      { month: "يناير", value: 800000, volume: 45, change: 2.5 },
      { month: "فبراير", value: 820000, volume: 52, change: 2.5 },
      { month: "مارس", value: 850000, volume: 48, change: 3.7 },
      { month: "أبريل", value: 870000, volume: 55, change: 2.4 },
      { month: "مايو", value: 900000, volume: 62, change: 3.4 },
      { month: "يونيو", value: 880000, volume: 58, change: -2.2 },
      { month: "يوليو", value: 860000, volume: 44, change: -2.3 },
      { month: "أغسطس", value: 870000, volume: 49, change: 1.2 },
      { month: "سبتمبر", value: 890000, volume: 56, change: 2.3 },
      { month: "أكتوبر", value: 910000, volume: 61, change: 2.2 },
      { month: "نوفمبر", value: 940000, volume: 67, change: 3.3 },
      { month: "ديسمبر", value: 960000, value: 72, change: 2.1 }
    ],
    marketActivity: {
      totalListings: 324,
      newListings: 28,
      soldProperties: 19,
      averageDaysOnMarket: 42
    },
    priceRange: {
      min: 650000,
      max: 1200000,
      q1: 750000,
      q3: 950000,
      median: 850000
    },
    lastUpdated: new Date().toISOString()
  },
  
  "جدة-الروضة-فيلا-بيع": {
    avgPrice: 1250000,
    pricePerSqm: 3800,
    demand: 68,
    trend: [
      { month: "يناير", value: 1150000, volume: 32, change: 1.8 },
      { month: "فبراير", value: 1180000, volume: 38, change: 2.6 },
      { month: "مارس", value: 1200000, volume: 35, change: 1.7 },
      { month: "أبريل", value: 1220000, volume: 42, change: 1.7 },
      { month: "مايو", value: 1260000, volume: 45, change: 3.3 },
      { month: "يونيو", value: 1240000, volume: 41, change: -1.6 },
      { month: "يوليو", value: 1220000, volume: 36, change: -1.6 },
      { month: "أغسطس", value: 1230000, volume: 39, change: 0.8 },
      { month: "سبتمبر", value: 1250000, volume: 44, change: 1.6 },
      { month: "أكتوبر", value: 1270000, volume: 47, change: 1.6 },
      { month: "نوفمبر", value: 1290000, volume: 51, change: 1.6 },
      { month: "ديسمبر", value: 1320000, volume: 55, change: 2.3 }
    ],
    marketActivity: {
      totalListings: 189,
      newListings: 15,
      soldProperties: 12,
      averageDaysOnMarket: 58
    },
    priceRange: {
      min: 900000,
      max: 1800000,
      q1: 1100000,
      q3: 1400000,
      median: 1250000
    },
    lastUpdated: new Date().toISOString()
  },

  "الخبر-الكورنيش-شقة-إيجار": {
    avgPrice: 3200,
    pricePerSqm: 18,
    demand: 82,
    trend: [
      { month: "يناير", value: 2800, volume: 78, change: 3.2 },
      { month: "فبراير", value: 2900, volume: 82, change: 3.6 },
      { month: "مارس", value: 3000, volume: 89, change: 3.4 },
      { month: "أبريل", value: 3100, volume: 94, change: 3.3 },
      { month: "مايو", value: 3250, volume: 102, change: 4.8 },
      { month: "يونيو", value: 3300, volume: 98, change: 1.5 },
      { month: "يوليو", value: 3200, volume: 85, change: -3.0 },
      { month: "أغسطس", value: 3150, volume: 91, change: -1.6 },
      { month: "سبتمبر", value: 3200, volume: 97, change: 1.6 },
      { month: "أكتوبر", value: 3250, volume: 104, change: 1.6 },
      { month: "نوفمبر", value: 3300, volume: 108, change: 1.5 },
      { month: "ديسمبر", value: 3400, volume: 115, change: 3.0 }
    ],
    marketActivity: {
      totalListings: 456,
      newListings: 67,
      soldProperties: 58,
      averageDaysOnMarket: 18
    },
    priceRange: {
      min: 2500,
      max: 4500,
      q1: 2900,
      q3: 3600,
      median: 3200
    },
    lastUpdated: new Date().toISOString()
  }
};

// دالة لتوليد مفتاح البحث
function generateSearchKey(filter: MarketFilter): string {
  return `${filter.city}-${filter.district}-${filter.propertyType}-${filter.dealType}`;
}

// دالة لتوليد بيانات عشوائية واقعية
function generateRandomMarketData(filter: MarketFilter): MarketData {
  const isRental = filter.dealType === "إيجار";
  const basePrice = isRental ? 
    Math.floor(Math.random() * 3000) + 2000 : // إيجار: 2000-5000
    Math.floor(Math.random() * 800000) + 400000; // بيع: 400k-1.2M
  
  const basePricePerSqm = isRental ?
    Math.floor(Math.random() * 30) + 15 : // إيجار: 15-45 ريال/متر
    Math.floor(Math.random() * 3000) + 2000; // بيع: 2000-5000 ريال/متر

  const demand = Math.floor(Math.random() * 40) + 50; // 50-90%
  
  // توليد بيانات الاتجاه لـ 12 شهر
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  
  const trend: TrendData[] = months.map((month, index) => {
    const variation = (Math.random() - 0.5) * 0.2; // ±10%
    const value = Math.floor(basePrice * (1 + variation));
    const volume = Math.floor(Math.random() * 50) + 20;
    const change = (Math.random() - 0.5) * 8; // ±4%
    
    return { month, value, volume, change };
  });

  return {
    avgPrice: basePrice,
    pricePerSqm: basePricePerSqm,
    demand,
    trend,
    marketActivity: {
      totalListings: Math.floor(Math.random() * 300) + 100,
      newListings: Math.floor(Math.random() * 50) + 10,
      soldProperties: Math.floor(Math.random() * 30) + 5,
      averageDaysOnMarket: Math.floor(Math.random() * 60) + 20
    },
    priceRange: {
      min: Math.floor(basePrice * 0.7),
      max: Math.floor(basePrice * 1.4),
      q1: Math.floor(basePrice * 0.85),
      q3: Math.floor(basePrice * 1.15),
      median: basePrice
    },
    lastUpdated: new Date().toISOString()
  };
}

// دالة جلب بيانات السوق
export async function fetchMarketData(
  city: string,
  district: string,
  propertyType: string,
  dealType: string
): Promise<MarketData> {
  
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // التحقق من صحة المدخلات
  if (!city?.trim() || !district?.trim()) {
    throw new Error("يرجى إدخال المدينة والحي");
  }

  if (!propertyType?.trim() || !dealType?.trim()) {
    throw new Error("يرجى تحديد نوع العقار ونوع الصفقة");
  }

  // التحقق من أن المدخلات ليست قصيرة جداً
  if (city.trim().length < 3 || district.trim().length < 3) {
    throw new Error("يرجى إدخال أسماء كاملة للمدينة والحي (على الأقل 3 أحرف)");
  }

  // التحقق من أن المدخلات تحتوي على أحرف عربية
  const arabicRegex = /^[\u0600-\u06FF\s]+$/;
  if (!arabicRegex.test(city.trim()) || !arabicRegex.test(district.trim())) {
    throw new Error("يرجى إدخال أسماء عربية للمدينة والحي");
  }

  const filter: MarketFilter = { city, district, propertyType, dealType };
  const searchKey = generateSearchKey(filter);
  
  // البحث في البيانات المحفوظة أولاً
  const mockData = MOCK_MARKET_DATA[searchKey];
  if (mockData) {
    return mockData;
  }
  
  // إذا لم تجد بيانات محفوظة، أنشئ بيانات عشوائية واقعية
  const generatedData = generateRandomMarketData(filter);
  
  // محاكاة احتمالية عدم وجود بيانات (نسبة أقل)
  if (Math.random() < 0.05) { // 5% احتمال عدم وجود بيانات
    throw new Error(`عذراً، لا توجد بيانات سوق متاحة لـ "${propertyType}" في "${district}, ${city}" حالياً. جرب منطقة أخرى أو نوع عقار مختلف.`);
  }
  
  return generatedData;
}

// دالة جلب المناطق حسب المدينة
export function getDistrictsByCity(city: string): string[] {
  const districts: Record<string, string[]> = {
    "الرياض": [
      "العليا", "الملقا", "النرجس", "الياسمين", "الورود", "المروج",
      "الربوة", "الصحافة", "قرطبة", "الغدير", "المهدية", "الروضة",
      "السليمانية", "الحمراء", "الواحة", "الملز", "الفلاح", "الشفا"
    ],
    "جدة": [
      "الروضة", "السلامة", "الزهراء", "الفيصلية", "الحمراء", "البساتين",
      "المروة", "النزهة", "الشاطئ", "الكندرة", "أبحر", "الصفا",
      "المرجان", "الأندلس", "الرحاب", "الواحة"
    ],
    "الخبر": [
      "الكورنيش", "الثقبة", "العقربية", "الراكة", "الضباب", "الفيصلية",
      "المدينة الجامعية", "حي الخليج", "العليا", "النور", "الشفا"
    ],
    "الدمام": [
      "الموانئ", "الشاطئ", "الفيصلية", "الأندلس", "النور", "الإسكان",
      "المحمدية", "الجوهرة", "الراكة", "العدامة"
    ]
  };
  
  return districts[city] || [
    "المركز", "الشرق", "الغرب", "الشمال", "الجنوب", "العليا"
  ];
}

// دالة للحصول على إحصائيات السوق العامة
export async function fetchMarketSummary(): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalListings: 12847,
    activeCities: 15,
    averagePrice: 750000,
    monthlyGrowth: 2.3,
    mostActiveCity: "الرياض",
    hottestDistricts: ["العليا", "الملقا", "النرجس"]
  };
}

// دالة للبحث المفتوح
export async function searchMarketData(
  query: string,
  filters?: Partial<MarketFilter>
): Promise<MarketData[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // محاكاة نتائج البحث
  const mockResults: MarketData[] = [
    await fetchMarketData("الرياض", "العليا", "شقة", "بيع"),
    await fetchMarketData("جدة", "الروضة", "فيلا", "بيع")
  ];
  
  return mockResults.slice(0, Math.floor(Math.random() * 3) + 1);
}