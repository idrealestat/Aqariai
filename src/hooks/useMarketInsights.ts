// hooks/useMarketInsights.ts
import { useEffect, useState } from "react";

type TrendPoint = { month: string; value: number };
type PriceRange = { label: string; min: number; max: number };
type MarketData = {
  avgPrice: number;
  priceRanges: PriceRange[];
  pricePerSqm?: number;
  demand: number; // %
  trend: TrendPoint[];
  source?: string[];
};

const API_ENDPOINT = "https://YOUR_MARKET_API.example.com/market-insights";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 ساعة

function cacheKey(city: string, district: string, propertyType: string, dealType: string) {
  return `market:${city || "any"}:${district || "any"}:${propertyType}:${dealType}`;
}

export function useMarketInsights(
  city: string,
  district: string,
  propertyType: string,
  dealType: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    let mounted = true;
    const key = cacheKey(city, district, propertyType, dealType);

    async function load() {
      // تحقق من صحة المدخلات
      if (!city || !district || !propertyType || !dealType) {
        if (mounted) {
          setData(null);
          setError(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        // check cache
        const cachedRaw = localStorage.getItem(key);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (Date.now() - cached.__ts < CACHE_TTL_MS) {
            if (mounted) {
              setData(cached.payload);
              setLoading(false);
              return;
            }
          } else localStorage.removeItem(key);
        }

        // استخدام البيانات التجريبية مباشرة (تجنب API call فاشل)
        const payload = generateFallbackData(city, district, propertyType, dealType);

        if (payload && mounted) {
          setData(payload);
          localStorage.setItem(key, JSON.stringify({ __ts: Date.now(), payload }));
        }
      } catch (e: any) {
        if (mounted) setError("⚠️ فشل تحميل بيانات السوق. تحقق من اتصالك أو الواجهة.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // تأخير بسيط لمحاكاة تحميل البيانات
    const timeoutId = setTimeout(() => {
      load();
    }, 500);

    return () => { 
      mounted = false; 
      clearTimeout(timeoutId);
    };
  }, [city, district, propertyType, dealType]);

  return { loading, error, data };
}

// ✅ fallback يولد نطاقات سعرية واضحة حسب النوع
function generateFallbackData(city: string, district: string, propertyType: string, dealType: string) {
  const base = 500000;
  const multiplierCity = city ? Math.min(2, 1 + city.length % 5 * 0.15) : 1;
  const multiplierDistrict = district ? Math.min(1.8, 1 + district.length % 4 * 0.12) : 1;
  const avg = Math.round(base * multiplierCity * multiplierDistrict);

  const ranges: PriceRange[] = [];

  if (propertyType === "شقة") {
    ranges.push(
      { label: "شقة صغيرة / متوسطة (110-150م²)", min: Math.round(avg * 0.9), max: Math.round(avg * 1.1) },
      { label: "شقة كبيرة أو فاخرة", min: Math.round(avg * 1.2), max: Math.round(avg * 1.6) }
    );
  } else if (propertyType === "فيلا") {
    ranges.push(
      { label: "فيلا متوسطة", min: Math.round(avg * 1.5), max: Math.round(avg * 2) },
      { label: "فيلا كبيرة / فاخرة", min: Math.round(avg * 2), max: Math.round(avg * 3) }
    );
  } else if (propertyType === "أرض") {
    ranges.push({ label: "أراضي سكنية", min: Math.round(avg * 0.8), max: Math.round(avg * 1.2) });
  } else {
    ranges.push({ label: "عقار", min: Math.round(avg * 0.9), max: Math.round(avg * 1.4) });
  }

  // Trend 12 شهر
  const trend = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(Date.now() - (11 - i) * 30 * 24 * 3600 * 1000)
      .toLocaleString("ar-SA", { month: "short", year: "numeric" });
    const value = Math.round(avg * (0.9 + Math.sin(i / 2) * 0.05 + i * 0.01));
    return { month, value };
  });

  const demand = Math.min(100, Math.round(30 + (avg % 70)));

  return {
    avgPrice: avg,
    priceRanges: ranges,
    pricePerSqm: Math.round(avg / 120),
    demand,
    trend,
    source: ["fallback-mock"],
  };
}

// Hook للحصول على قائمة المناطق
export function useDistrictsByCity(city: string): string[] {
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (!city?.trim()) {
      setDistricts([]);
      return;
    }

    // مناطق المدن السعودية
    const cityDistricts: Record<string, string[]> = {
      "الرياض": [
        "العليا", "الملقا", "النرجس", "الياسمين", "الورود", "المروج",
        "الربوة", "الصحافة", "قرطبة", "الغدير", "المهدية", "الروضة",
        "السليمانية", "الحمراء", "الواحة", "الملز", "الفلاح", "الشفا",
        "العريجاء", "الديرة", "المطار", "الشميسي"
      ],
      "جدة": [
        "الروضة", "السلامة", "الزهراء", "الفيصلية", "الحمراء", "البساتين",
        "المروة", "النزهة", "الشاطئ", "الكندرة", "أبحر", "الصفا",
        "المرجان", "الأندلس", "الرحاب", "الواحة", "السليمانية", "الثغر"
      ],
      "الخبر": [
        "الكورنيش", "الثقبة", "العقربية", "الراكة", "الضباب", "الفيصلية",
        "المدينة الجامعية", "حي الخليج", "العليا", "النور", "الشفا", "الموانئ"
      ],
      "الدمام": [
        "الموانئ", "الشاطئ", "الفيصلية", "الأندلس", "النور", "الإسكان",
        "المحمدية", "الجوهرة", "الراكة", "العدامة", "الخضرية", "الشعلة"
      ],
      "مكة المكرمة": [
        "العزيزية", "المسفلة", "أجياد", "الشوقية", "جرول", "الكعكية",
        "المعابدة", "الشامية", "الحجون", "الغزة"
      ]
    };

    const foundDistricts = cityDistricts[city] || [
      "المركز", "الشرق", "الغرب", "الشمال", "الجنوب", "العليا", 
      "السفلى", "الجديد", "القديم", "الصناعية", "التجاري", "السكني"
    ];

    setDistricts(foundDistricts);
  }, [city]);

  return districts;
}