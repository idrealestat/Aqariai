import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GoogleMapsSetup } from "./GoogleMapsSetup";
import { GoogleMapsTest } from "./GoogleMapsTest";
import { MapPicker } from "./MapPicker";
import { Address } from "../../types/owners";
import { 
  Settings, 
  TestTube, 
  Map, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  RotateCcw
} from "lucide-react";

interface GoogleMapsSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleMapsSettings({ isOpen, onClose }: GoogleMapsSettingsProps) {
  const [currentTab, setCurrentTab] = useState<'setup' | 'test' | 'demo'>('setup');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
  const [showDemo, setShowDemo] = useState(false);
  const [demoAddress, setDemoAddress] = useState<Address>({});

  // تحقق من حالة مفتاح API عند التحميل
  useEffect(() => {
    if (isOpen) {
      checkApiKeyStatus();
    }
  }, [isOpen]);

  const checkApiKeyStatus = () => {
    const savedKey = localStorage.getItem('googleMapsApiKey');
    if (!savedKey || savedKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      setApiKeyStatus('invalid');
    } else {
      // محاولة التحقق من صحة المفتاح (يمكن تحسينه)
      setApiKeyStatus('valid');
    }
  };

  const handleApiKeyUpdate = (apiKey: string) => {
    setApiKeyStatus('valid');
  };

  const clearApiKey = () => {
    localStorage.removeItem('googleMapsApiKey');
    setApiKeyStatus('invalid');
  };

  const tabs = [
    { id: 'setup', label: 'الإعداد', icon: Settings },
    { id: 'test', label: 'الاختبار', icon: TestTube },
    { id: 'demo', label: 'العرض التوضيحي', icon: Map }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        
        {/* الرأس */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#01411C] rounded-full flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#01411C]">
                إعدادات خرائط Google
              </h2>
              <div className="flex items-center gap-2">
                {apiKeyStatus === 'valid' ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    مفعل ويعمل
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-orange-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    غير مفعل
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearApiKey}
              title="إعادة تعيين الإعدادات"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" />
            </button>
            
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <EyeOff className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* التبويبات */}
        <div className="flex border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-colors ${
                currentTab === id
                  ? 'bg-[#01411C] text-white'
                  : 'text-[#01411C] hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto">
          {currentTab === 'setup' && (
            <div className="p-6">
              <GoogleMapsSetup onApiKeyUpdate={handleApiKeyUpdate} />
            </div>
          )}

          {currentTab === 'test' && (
            <div className="p-6">
              <GoogleMapsTest />
            </div>
          )}

          {currentTab === 'demo' && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* مقدمة العرض التوضيحي */}
                <div className="bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">العرض التوضيحي التفاعلي</h3>
                  <p className="text-white/90 text-sm mb-4">
                    تجربة كاملة لكيفية عمل اختيار المواقع والملء التلقائي للعناوين
                  </p>
                  
                  <button
                    onClick={() => setShowDemo(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    ابدأ العرض التوضيحي
                  </button>
                </div>

                {/* النتائج */}
                {demoAddress.formattedAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-green-200"
                  >
                    <h4 className="font-bold text-[#01411C] mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      العنوان المحدد من العرض التوضيحي
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {demoAddress.formattedAddress && (
                        <div className="md:col-span-2 p-3 bg-[#f0fdf4] rounded border border-green-200">
                          <strong className="text-[#01411C]">العنوان الكامل:</strong>
                          <p className="text-[#065f41] mt-1">{demoAddress.formattedAddress}</p>
                        </div>
                      )}
                      
                      {[
                        { label: 'المدينة', value: demoAddress.city },
                        { label: 'الحي', value: demoAddress.district },
                        { label: 'الشارع', value: demoAddress.street },
                        { label: 'رقم المبنى', value: demoAddress.buildingNumber || demoAddress.building },
                        { label: 'الرمز البريدي', value: demoAddress.postalCode },
                        { label: 'الرقم الإضافي', value: demoAddress.additionalNumber }
                      ].map(({ label, value }) => 
                        value && (
                          <div key={label}>
                            <strong className="text-[#01411C]">{label}:</strong>
                            <p className="text-[#065f41]">{value}</p>
                          </div>
                        )
                      )}
                      
                      {demoAddress.latitude && demoAddress.longitude && (
                        <div className="md:col-span-2">
                          <strong className="text-[#01411C]">الإحداثيات:</strong>
                          <p className="text-[#065f41]">
                            {demoAddress.latitude.toFixed(6)}, {demoAddress.longitude.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* تعليمات الاستخدام */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3">كيفية استخدام الخرائط في النماذج:</h4>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• انقر على زر "اختيار على الخريطة" في أي نموذج عقاري</li>
                    <li>• استخدم البحث أو انقر مباشرة على الخريطة</li>
                    <li>• سيتم ملء جميع حقول العنوان تلقائياً</li>
                    <li>• يمكنك تعديل أي حقل يدوياً بعد الاختيار</li>
                    <li>• الموقع والعنوان سيُحفظان مع العقار</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* الأزرار السفلية */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors font-semibold"
          >
            إغلاق
          </button>
        </div>

        {/* MapPicker للعرض التوضيحي */}
        <MapPicker
          isOpen={showDemo}
          address={demoAddress}
          onAddressSelect={setDemoAddress}
          onClose={() => setShowDemo(false)}
        />
      </motion.div>
    </motion.div>
  );
}