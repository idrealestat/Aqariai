// أنواع البيانات لتحليلات السوق العقاري

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface MarketData {
  avgPrice: number;
  pricePerSqm: number;
  demand: number;
  trend: TrendData[];
  priceRanges: PriceRange[];
  marketActivity?: MarketActivity;
  lastUpdated: string;
}

export interface TrendData {
  month: string;
  value: number;
  volume?: number;
  change?: number;
}

export interface MarketActivity {
  totalListings: number;
  newListings: number;
  soldProperties: number;
  averageDaysOnMarket: number;
}

export interface PriceRangeLegacy {
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
}

export interface MarketFilter {
  city: string;
  district: string;
  propertyType: string;
  dealType: string;
}

export interface MarketInsightError {
  message: string;
  code?: string;
  details?: string;
}

// البيانات المرجعية
export const SAUDI_CITIES = [
  "الرياض",
  "جدة", 
  "الدمام",
  "الخبر",
  "مكة المكرمة",
  "المدينة المنورة",
  "تبوك",
  "أبها",
  "الطائف",
  "بريدة",
  "خميس مشيط",
  "حائل",
  "الجبيل",
  "ينبع",
  "الأحساء",
  "جازان",
  "نجران",
  "عرعر",
  "سكاكا",
  "القريات",
  "رفحاء",
  "طريف",
  "الباحة",
  "بيشة",
  "محايل عسير",
  "صبيا",
  "القنفذة",
  "الليث",
  "رابغ",
  "الخرج",
  "الدوادمي",
  "الافلاج",
  "وادي الدواسر",
  "حوطة بني تميم",
  "المجمعة",
  "الزلفي",
  "شقراء",
  "عنيزة",
  "الرس",
  "البكيرية",
  "المذنب",
  "البدائع",
  "الهفوف",
  "المبرز",
  "العيون",
  "الجفر",
  "القطيف",
  "رأس تنورة",
  "سيهات",
  "صفوى",
  "النعيرية",
  "بقيق",
  "الظهران"
];

export const PROPERTY_TYPES = [
  "شقة",
  "فيلا", 
  "دوبلكس",
  "قصر",
  "أرض",
  "عمارة",
  "مكتب",
  "محل تجاري",
  "مستودع",
  "استراحة"
];

export const DEAL_TYPES = [
  "بيع",
  "إيجار"
];

// أحياء الرياض
export const RIYADH_DISTRICTS = [
  "العليا",
  "الملقا", 
  "النرجس",
  "الياسمين",
  "الورود",
  "المروج",
  "الربوة",
  "الصحافة",
  "قرطبة",
  "الغدير",
  "المهدية",
  "الروضة",
  "السليمانية",
  "الحمراء",
  "الواحة"
];

// أحياء جدة
export const JEDDAH_DISTRICTS = [
  "الروضة",
  "السلامة",
  "الزهراء",
  "الفيصلية",
  "الحمراء",
  "البساتين",
  "المروة",
  "النزهة",
  "الشاطئ",
  "الكندرة",
  "أبحر",
  "الصفا",
  "المرجان",
  "الأندلس"
];

// مناطق الخبر/الدمام
export const EASTERN_DISTRICTS = [
  "الكورنيش",
  "الثقبة",
  "العقربية",
  "الراكة",
  "الضباب",
  "الفيصلية",
  "المدينة الجامعية",
  "حي الخليج",
  "العليا",
  "النور",
  "الشفا",
  "الموانئ"
];