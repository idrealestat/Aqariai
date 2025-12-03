import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Map, Key, CheckCircle, AlertTriangle, Globe, Settings } from "lucide-react";

interface GoogleMapsSetupProps {
  onApiKeyUpdate?: (apiKey: string) => void;
}

export function GoogleMapsSetup({ onApiKeyUpdate }: GoogleMapsSetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // تحقق من صحة مفتاح API
  const validateApiKey = async (key: string) => {
    if (!key || key.length < 30) {
      setIsValid(false);
      return;
    }

    setIsChecking(true);
    try {
      // محاولة تحميل Google Maps مع المفتاح
      const testUrl = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      const script = document.createElement('script');
      script.src = testUrl;
      
      const promise = new Promise((resolve, reject) => {
        script.onload = () => {
          setIsValid(true);
          script.remove();
          resolve(true);
        };
        script.onerror = () => {
          setIsValid(false);
          script.remove();
          reject(false);
        };
      });

      document.head.appendChild(script);
      await promise;

    } catch (error) {
      setIsValid(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValid(null);
    
    // تحقق تلقائي بعد توقف الكتابة
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        validateApiKey(value.trim());
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleSave = () => {
    if (isValid && apiKey) {
      // حفظ المفتاح في localStorage
      localStorage.setItem('googleMapsApiKey', apiKey);
      onApiKeyUpdate?.(apiKey);
    }
  };

  // تحميل المفتاح المحفوظ عند بدء التحميل
  useEffect(() => {
    const savedKey = localStorage.getItem('googleMapsApiKey');
    if (savedKey) {
      setApiKey(savedKey);
      validateApiKey(savedKey);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-[#D4AF37]/20"
      >
        <div className="p-6">
          {/* العنوان */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#01411C]">إعداد خرائط Google</h2>
              <p className="text-[#065f41] text-sm">
                أدخل مفتاح Google Maps API لتفعيل الخرائط التفاعلية
              </p>
            </div>
          </div>

          {/* حقل إدخال المفتاح */}
          <div className="space-y-4">
            <div>
              <label className="block text-[#01411C] font-medium mb-2">
                مفتاح Google Maps API
              </label>
              <div className="relative">
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="أدخل مفتاح Google Maps API"
                  className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] ${
                    isValid === false ? 'border-red-500' : 
                    isValid === true ? 'border-green-500' : 'border-gray-300'
                  }`}
                />
                
                {/* مؤشر الحالة */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {isChecking ? (
                    <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  ) : isValid === true ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isValid === false ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : null}
                </div>
              </div>
              
              {/* رسائل الحالة */}
              {isValid === true && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  مفتاح API صحيح ويعمل بشكل سليم
                </p>
              )}
              
              {isValid === false && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  مفتاح API غير صحيح أو غير مفعل
                </p>
              )}
            </div>

            {/* أزرار العمل */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!isValid || !apiKey}
                className="flex-1 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                حفظ الإعدادات
              </button>
              
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="px-6 py-3 border-2 border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                التعليمات
              </button>
            </div>
          </div>

          {/* التعليمات */}
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-[#f0fdf4] rounded-lg border border-[#D4AF37]/30"
            >
              <h3 className="font-semibold text-[#01411C] mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D4AF37]" />
                كيفية الحصول على مفتاح Google Maps API
              </h3>
              
              <ol className="space-y-2 text-[#065f41] text-sm">
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-[#D4AF37] text-[#01411C] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  اذهب إلى <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline">Google Cloud Console</a>
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-[#D4AF37] text-[#01411C] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  أنشئ مشروع جديد أو اختر مشروع موجود
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-[#D4AF37] text-[#01411C] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  فعّل "Maps JavaScript API" و "Places API"
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-[#D4AF37] text-[#01411C] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  اذهب إلى "Credentials" وأنشئ مفتاح API جديد
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-[#D4AF37] text-[#01411C] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                  قيد المفتاح للنطاقات المصرح بها لتحسين الأمان
                </li>
              </ol>

              <div className="mt-4 p-3 bg-white rounded border border-[#D4AF37]/20">
                <p className="text-[#01411C] text-sm font-medium mb-2">⚠️ تنبيه أمني مهم:</p>
                <p className="text-[#065f41] text-xs">
                  تأكد من تقييد استخدام مفتاح API للنطاقات المصرح بها فقط لتجنب الاستخدام غير المصرح به والرسوم الإضافية.
                </p>
              </div>
            </motion.div>
          )}

          {/* معلومات إضافية */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 نصائح مهمة:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• سيتم حفظ المفتاح محلياً في متصفحك فقط</li>
              <li>• يمكنك استخدام الإدخال اليدوي إذا لم يكن لديك مفتاح API</li>
              <li>• الخرائط تحسن من دقة تحديد المواقع والعناوين</li>
              <li>• يمكنك تغيير المفتاح في أي وقت من هذه الصفحة</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}