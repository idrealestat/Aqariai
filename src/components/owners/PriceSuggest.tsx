import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, DollarSign, MapPin, RefreshCw, Info, CheckCircle } from "lucide-react";
import { PriceSuggestion } from "../../types/owners";

interface PriceSuggestProps {
  city?: string;
  district?: string;
  propertyType?: string;
  area?: number;
  mode: 'sale' | 'rent';
  onPriceSelect?: (price: number) => void;
  className?: string;
}

export function PriceSuggest({ 
  city, 
  district, 
  propertyType, 
  area, 
  mode,
  onPriceSelect,
  className = ""
}: PriceSuggestProps) {
  const [suggestion, setSuggestion] = useState<PriceSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  // جلب اقتراح السعر - باستخدام بيانات محاكاة ذكية
  const fetchPriceSuggestion = useCallback(async () => {
    if (!city || !propertyType) return;

    setIsLoading(true);
    setError(null);

    // محاكاة تأخير بسيط للتحميل
    await new Promise(resolve => setTimeout(resolve, 500));

    // حساب السعر الأساسي بناءً على نوع العملية
    let basePrice = mode === 'sale' ? 1000000 : 30000;
    
    // تعديل السعر بناءً على المدينة (جميع المدن السعودية)
    if (city) {
      const cityMultipliers: { [key: string]: number } = {
        'الرياض': 1.2,
        'جدة': 1.15,
        'الدمام': 1.0,
        'مكة': 1.05,
        'المدينة': 1.0,
        'الخبر': 1.1,
        'الظهران': 1.1,
        'الطائف': 0.9,
        'أبها': 0.85,
        'تبوك': 0.8,
        'بريدة': 0.85,
        'خميس مشيط': 0.8,
        'نجران': 0.75,
        'جزان': 0.75,
        'حفر الباطن': 0.7,
        'الجبيل': 0.95,
        'ينبع': 0.9,
        'القطيف': 0.95,
        'القصيم': 0.85,
        'عرعر': 0.7
      };
      basePrice *= cityMultipliers[city] || 1.0;
    }
    
    // تعديل السعر بناءً على نوع العقار (جميع الأنواع)
    if (propertyType) {
      const typeMultipliers: { [key: string]: number } = {
        'فيلا': mode === 'sale' ? 1.6 : 1.8,
        'شقة': 1.0,
        'أرض': mode === 'sale' ? 0.7 : 0.3,
        'عمارة': mode === 'sale' ? 2.5 : 2.0,
        'محل': mode === 'sale' ? 0.8 : 1.2,
        'مكتب': mode === 'sale' ? 0.9 : 1.3,
        'مستودع': mode === 'sale' ? 1.2 : 1.5,
        'مزرعة': mode === 'sale' ? 1.4 : 1.0,
        'استراحة': mode === 'sale' ? 1.1 : 1.4,
        'دوبلكس': mode === 'sale' ? 1.4 : 1.5,
        'استوديو': mode === 'sale' ? 0.6 : 0.7
      };
      basePrice *= typeMultipliers[propertyType] || 1.0;
    }
    
    // تعديل السعر بناءً على المساحة
    if (area) {
      if (area > 500) basePrice *= 1.6;
      else if (area > 400) basePrice *= 1.45;
      else if (area > 300) basePrice *= 1.3;
      else if (area > 200) basePrice *= 1.15;
      else if (area > 150) basePrice *= 1.0;
      else if (area < 100) basePrice *= 0.75;
      else if (area < 80) basePrice *= 0.65;
    }
    
    // تعديل السعر بناءً على الحي (أحياء راقية)
    if (district) {
      const premiumDistricts = [
        'النرجس', 'العليا', 'الملقا', 'الياسمين', 'حطين',
        'الروضة', 'الزهراء', 'الحمراء',
        'العقربية', 'الكورنيش'
      ];
      if (premiumDistricts.includes(district)) {
        basePrice *= 1.15;
      }
    }
    
    const mockSuggestion: PriceSuggestion = {
      min: Math.round(basePrice * 0.85),
      max: Math.round(basePrice * 1.25),
      average: Math.round(basePrice),
      confidence: area ? 85 : 75,
      basedOn: [
        'تحليل السوق المحلي للعقارات',
        `معدل أسعار ${propertyType} في ${city}${district ? ` - ${district}` : ''}`,
        'مقارنة مع العقارات المماثلة في المنطقة',
        mode === 'sale' ? 'اتجاهات سوق البيع الحالية' : 'اتجاهات سوق الإيجار الحالية',
        area ? `تقييم بناءً على مساحة ${area} متر مربع` : 'تقييم عام للمنطقة'
      ]
    };
    
    setSuggestion(mockSuggestion);
    setError(null);
    setIsLoading(false);
  }, [city, district, propertyType, area, mode]);

  // جلب البيانات عند تغيير المعطيات
  useEffect(() => {
    if (city && propertyType) {
      fetchPriceSuggestion();
    }
  }, [fetchPriceSuggestion]);

  // معالج اختيار السعر
  const handlePriceSelect = useCallback((price: number) => {
    setSelectedPrice(price);
    onPriceSelect?.(price);
  }, [onPriceSelect]);

  // تنسيق السعر
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  // عرض التحميل
  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#D4AF37] animate-spin" />
          <span className="text-[#065f41]">جاري جلب اقتراحات الأسعار...</span>
        </div>
      </div>
    );
  }

  // عرض رسالة عدم توفر البيانات
  if (!suggestion && !isLoading) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-yellow-800 font-medium">
              اقتراح الأسعار غير متوفر
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              يرجى إدخال المدينة ونوع العقار للحصول على اقتراحات الأسعار
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-[#f0fdf4] to-white border border-[#D4AF37]/30 rounded-xl shadow-lg ${className}`}
    >
      
      {/* الرأس */}
      <div className="p-4 border-b border-[#D4AF37]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#01411C]" />
            </div>
            <div>
              <h3 className="font-bold text-[#01411C]">
                اقتراح الأسعار
              </h3>
              <p className="text-[#065f41] text-sm">
                بناءً على السوق الحالي
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-[#D4AF37] text-sm border border-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 transition-colors"
          >
            {showDetails ? 'إخفاء' : 'تفاصيل'}
          </button>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-yellow-700 text-xs"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* المحتوى الرئيسي */}
      <div className="p-4">
        
        {/* نطاق السعر */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#01411C] font-semibold">
              النطاق السعري المقترح:
            </span>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-[#D4AF37]/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#01411C] mb-2">
                {formatPrice(suggestion.min)} - {formatPrice(suggestion.max)}
              </div>
              <div className="text-[#065f41] mb-3">
                متوسط السوق: <span className="font-semibold">{formatPrice(suggestion.average)}</span>
              </div>
              
              {/* شريط الثقة */}
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-[#065f41] mb-1">
                  <span>مستوى الثقة</span>
                  <span>{suggestion.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${suggestion.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الاختيار السريع */}
        <div className="mb-4">
          <p className="text-[#065f41] text-sm mb-3">اختيار سريع:</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'الحد الأدنى', value: suggestion.min },
              { label: 'المتوسط', value: suggestion.average },
              { label: 'الحد الأقصى', value: suggestion.max }
            ].map((option) => (
              <motion.button
                key={option.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePriceSelect(option.value)}
                className={`
                  p-3 text-center rounded-lg border-2 transition-all
                  ${selectedPrice === option.value
                    ? 'border-[#01411C] bg-[#01411C] text-white'
                    : 'border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37]/10'
                  }
                `}
              >
                <div className="text-xs opacity-80 mb-1">{option.label}</div>
                <div className="font-semibold text-sm">
                  {formatPrice(option.value).replace('ر.س.', '')}
                </div>
                {selectedPrice === option.value && (
                  <CheckCircle className="w-4 h-4 mx-auto mt-1" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* التفاصيل */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#D4AF37]/20 pt-4"
            >
              <div className="space-y-3">
                
                {/* معلومات المنطقة */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[#065f41]">
                    {city}{district && ` - ${district}`} • {propertyType}
                    {area && ` • ${area} م²`}
                  </span>
                </div>

                {/* مصادر البيانات */}
                <div>
                  <p className="text-[#01411C] font-semibold text-sm mb-2">
                    مصادر البيانات:
                  </p>
                  <ul className="space-y-1">
                    {suggestion.basedOn.map((source, index) => (
                      <li key={index} className="text-[#065f41] text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ملاحظة */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-xs">
                    💡 <strong>ملاحظة:</strong> هذه الأسعار تقديرية وقد تختلف حسب الحالة الفعلية للعقار وظروف السوق
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر التحديث */}
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchPriceSuggestion}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 disabled:opacity-50 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث الأسعار
          </button>
        </div>
      </div>
    </motion.div>
  );
}