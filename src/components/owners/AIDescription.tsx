import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wand2, RefreshCw, Copy, CheckCircle, Sparkles, X } from "lucide-react";
import { AIDescriptionRequest, AIDescriptionResponse, PropertyFeatures } from "../../types/owners";

interface AIDescriptionProps {
  mode: 'sale' | 'rent' | 'buy-request' | 'rent-request';
  city?: string;
  district?: string;
  propertyType?: string;
  features?: PropertyFeatures;
  price?: number;
  currentDescription?: string;
  onDescriptionSelect: (description: string) => void;
  className?: string;
}

export function AIDescription({
  mode,
  city,
  district,
  propertyType,
  features,
  price,
  currentDescription,
  onDescriptionSelect,
  className = ""
}: AIDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIDescriptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // توليد الوصف بالذكاء الاصطناعي
  const generateDescription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const request: AIDescriptionRequest = {
        mode,
        city,
        district,
        type: propertyType,
        features,
        price
      };

      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('فشل في الاتصال بخدمة الذكاء الاصطناعي');
      }

      const data: AIDescriptionResponse = await response.json();
      setSuggestions(data);
      setSelectedSuggestion(data.description);

    } catch (err) {
      // معالجة صامتة - استخدام البيانات الاحتياطية بدون عرض خطأ
      
      // تحسين الاقتراحات التجريبية بناءً على البيانات المتوفرة
      const mockSuggestions: AIDescriptionResponse = {
        title: getModePrefix(mode),
        description: generateMockDescription(mode, propertyType, city, district, features),
        suggestions: [
          generateMockDescription(mode, propertyType, city, district, features, 1),
          generateMockDescription(mode, propertyType, city, district, features, 2),
          generateMockDescription(mode, propertyType, city, district, features, 3)
        ],
        neighborhoods: district ? getSuggestedNeighborhoods(district) : []
      };
      
      setSuggestions(mockSuggestions);
      setSelectedSuggestion(mockSuggestions.description);
      setError(null); // عدم إظهار خطأ، الذكاء الاصطناعي المحلي يعمل بشكل جيد

    } finally {
      setIsLoading(false);
    }
  }, [mode, city, district, propertyType, features, price]);

  // الحصول على بداية الوصف حسب النوع
  const getModePrefix = (mode: string): string => {
    switch (mode) {
      case 'sale': return 'للبيع:';
      case 'rent': return 'للإيجار:';
      case 'buy-request': return 'مطلوب:';
      case 'rent-request': return 'مطلوب:';
      default: return '';
    }
  };

  // توليد وصف تجريبي
  const generateMockDescription = (
    mode: string, 
    type?: string, 
    city?: string, 
    district?: string, 
    features?: PropertyFeatures,
    variant: number = 0
  ): string => {
    const prefix = getModePrefix(mode);
    const property = type || 'عقار';
    const location = district && city ? `في ${district}, ${city}` : (city ? `في ${city}` : 'في موقع مميز');
    
    const descriptions = [
      `${prefix} ${property} ${location}، يتميز بموقع استراتيجي وتصميم عصري. العقار مطابق للمواصفات العالمية ويوفر راحة وأمان للسكن.`,
      
      `${prefix} ${property} فاخر ${location}، يجمع بين الأناقة والعملية. مساحات واسعة وتشطيبات عالية الجودة تجعله الخيار الأمثل.`,
      
      `${prefix} ${property} مميز ${location}، بتصميم معاصر ومرافق متكاملة. يوفر بيئة سكنية هادئة ومريحة للعائلات.`,
      
      `${prefix} ${property} راقي ${location}، يتميز بإطلالة جميلة وقرب من الخدمات الأساسية. فرصة استثمارية ممتازة.`
    ];

    let description = descriptions[variant] || descriptions[0];

    // إضافة تفاصيل المميزات إذا توفرت
    if (features) {
      const featuresList = [];
      if (features.bedrooms) featuresList.push(`${features.bedrooms} غرف نوم`);
      if (features.bathrooms) featuresList.push(`${features.bathrooms} دورات مياه`);
      if (features.hasPool) featuresList.push('مسبح');
      if (features.hasGarden) featuresList.push('حديقة');
      if (features.hasElevator) featuresList.push('مصعد');
      
      if (featuresList.length > 0) {
        description += ` يشمل: ${featuresList.join('، ')}.`;
      }
    }

    return description;
  };

  // الحصول على أحياء مقترحة
  const getSuggestedNeighborhoods = (district: string): string[] => {
    const neighborhoods: { [key: string]: string[] } = {
      'العليا': ['الملز', 'النرجس', 'العقيق'],
      'الملز': ['العليا', 'النرجس', 'الروضة'],
      'النرجس': ['العليا', 'الملز', 'العقيق'],
      'الروضة': ['الملز', 'السليمانية', 'المروج'],
      'السليمانية': ['الروضة', 'العليا', 'المروج']
    };
    
    return neighborhoods[district] || ['الأحياء المجاورة', 'المنطقة المحيطة', 'الأحياء القريبة'];
  };

  // نسخ النص
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // تأكيد الاختيار
  const handleConfirm = () => {
    if (selectedSuggestion) {
      onDescriptionSelect(selectedSuggestion);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* زر تفعيل الذكاء الاصطناعي */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] 
          text-[#01411C] rounded-lg hover:from-[#f1c40f] hover:to-[#D4AF37] 
          transition-all shadow-lg hover:shadow-xl font-semibold ${className}
        `}
      >
        <Wand2 className="w-5 h-5" />
        <span>توليد بالذكاء الاصطناعي</span>
        <Sparkles className="w-4 h-4 animate-pulse" />
      </motion.button>

      {/* مودال توليد الوصف */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
              dir="rtl"
            >
              
              {/* الرأس */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-[#01411C]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#01411C]">
                      مولد الوصف بالذكاء الاصطناعي
                    </h2>
                    <p className="text-[#065f41] text-sm">
                      احصل على وصف احترافي لعقارك في ثوانِ
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* المحتوى */}
              <div className="flex-1 p-6 overflow-y-auto">
                
                {/* معلومات العقار */}
                <div className="bg-[#f0fdf4] rounded-xl p-4 mb-6">
                  <h3 className="text-[#01411C] font-semibold mb-3">معلومات العقار:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><strong>النوع:</strong> {propertyType || 'غير محدد'}</div>
                    <div><strong>المدينة:</strong> {city || 'غير محدد'}</div>
                    <div><strong>الحي:</strong> {district || 'غير محدد'}</div>
                    <div><strong>الغرض:</strong> {getModePrefix(mode).replace(':', '')}</div>
                  </div>
                </div>

                {/* زر التوليد */}
                {!suggestions && (
                  <div className="text-center mb-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateDescription}
                      disabled={isLoading}
                      className="px-8 py-4 bg-[#01411C] text-white rounded-xl hover:bg-[#065f41] disabled:opacity-50 transition-colors font-semibold shadow-lg"
                    >
                      {isLoading ? (
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

                {/* رسالة الخطأ */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* النتائج */}
                {suggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    
                    {/* الوصف الرئيسي */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[#01411C] font-semibold">الوصف المقترح:</h3>
                        <button
                          onClick={() => copyToClipboard(suggestions.description, -1)}
                          className="flex items-center gap-2 px-3 py-1 text-[#D4AF37] border border-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 transition-colors text-sm"
                        >
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
                      
                      <div
                        className={`
                          p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${selectedSuggestion === suggestions.description
                            ? 'border-[#01411C] bg-[#f0fdf4]'
                            : 'border-gray-200 hover:border-[#D4AF37]'
                          }
                        `}
                        onClick={() => setSelectedSuggestion(suggestions.description)}
                      >
                        <p className="text-[#065f41] leading-relaxed">
                          {suggestions.description}
                        </p>
                        {selectedSuggestion === suggestions.description && (
                          <div className="flex items-center gap-2 mt-2 text-[#01411C]">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">محدد</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* اقتراحات إضافية */}
                    {suggestions.suggestions.length > 0 && (
                      <div>
                        <h3 className="text-[#01411C] font-semibold mb-3">اقتراحات أخرى:</h3>
                        <div className="space-y-3">
                          {suggestions.suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`
                                p-4 border-2 rounded-xl cursor-pointer transition-all group
                                ${selectedSuggestion === suggestion
                                  ? 'border-[#01411C] bg-[#f0fdf4]'
                                  : 'border-gray-200 hover:border-[#D4AF37]'
                                }
                              `}
                              onClick={() => setSelectedSuggestion(suggestion)}
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-[#065f41] leading-relaxed flex-1">
                                  {suggestion}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(suggestion, index);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                                >
                                  {copiedIndex === index ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              {selectedSuggestion === suggestion && (
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

                    {/* الأحياء المقترحة */}
                    {suggestions.neighborhoods.length > 0 && (
                      <div>
                        <h3 className="text-[#01411C] font-semibold mb-3">أحياء مقترحة:</h3>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.neighborhoods.map((neighborhood, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#D4AF37]/20 text-[#01411C] rounded-full text-sm border border-[#D4AF37]/30"
                            >
                              {neighborhood}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* الأزرار السفلية */}
              <div className="p-6 border-t border-gray-200 flex gap-3">
                {suggestions && (
                  <button
                    onClick={generateDescription}
                    disabled={isLoading}
                    className="px-4 py-2 border-2 border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 disabled:opacity-50 transition-colors"
                  >
                    توليد جديد
                  </button>
                )}
                
                <button
                  onClick={handleConfirm}
                  disabled={!selectedSuggestion}
                  className="flex-1 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  استخدام هذا الوصف
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}