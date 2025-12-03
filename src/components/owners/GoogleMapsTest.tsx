import { useState } from "react";
import { motion } from "motion/react";
import { MapPicker } from "./MapPicker";
import { Address } from "../../types/owners";
import { Map, TestTube, CheckCircle, Copy, MapPin } from "lucide-react";

export function GoogleMapsTest() {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    
    // إضافة نتيجة الاختبار
    const result = `✅ تم تحديد موقع بنجاح: ${address.formattedAddress || 'موقع مخصص'}`;
    setTestResults(prev => [result, ...prev]);
  };

  const copyAddressToClipboard = () => {
    if (selectedAddress) {
      const addressText = `
العنوان الكامل: ${selectedAddress.formattedAddress || 'غير محدد'}
المدينة: ${selectedAddress.city || 'غير محدد'}
الحي: ${selectedAddress.district || 'غير محدد'}
الشارع: ${selectedAddress.street || 'غير محدد'}
رقم المبنى: ${selectedAddress.buildingNumber || selectedAddress.building || 'غير محدد'}
الرمز البريدي: ${selectedAddress.postalCode || 'غير محدد'}
الرقم الإضافي: ${selectedAddress.additionalNumber || 'غير محدد'}
الإحداثيات: ${selectedAddress.latitude}, ${selectedAddress.longitude}
      `.trim();
      
      navigator.clipboard.writeText(addressText);
      setTestResults(prev => ['📋 تم نسخ تفاصيل العنوان', ...prev]);
    }
  };

  const runConnectivityTest = () => {
    setTestResults(prev => ['🔍 جاري اختبار الاتصال بـ Google Maps...', ...prev]);
    
    // محاولة تحميل script اختبار
    const testScript = document.createElement('script');
    testScript.src = 'https://maps.googleapis.com/maps/api/js?key=test&callback=testCallback';
    
    const timeout = setTimeout(() => {
      testScript.remove();
      setTestResults(prev => ['❌ انتهت مهلة الاتصال - تحقق من الإنترنت', ...prev]);
    }, 10000);

    testScript.onerror = () => {
      clearTimeout(timeout);
      testScript.remove();
      setTestResults(prev => ['❌ فشل الاتصال - تحقق من مفتاح API', ...prev]);
    };

    // في الواقع، سنقوم باختبار الاتصال بالإنترنت فقط
    fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' })
      .then(() => {
        clearTimeout(timeout);
        setTestResults(prev => ['✅ الاتصال بالإنترنت يعمل بشكل صحيح', ...prev]);
      })
      .catch(() => {
        clearTimeout(timeout);
        setTestResults(prev => ['❌ لا يوجد اتصال بالإنترنت', ...prev]);
      });
  };

  const clearResults = () => {
    setTestResults([]);
    setSelectedAddress(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* العنوان */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#01411C] rounded-full flex items-center justify-center">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#01411C]">اختبار خرائط Google</h2>
            <p className="text-[#065f41] text-sm">
              اختبر وظائف الخرائط والملء التلقائي للعناوين
            </p>
          </div>
        </div>

        {/* أزرار الاختبار */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowMapPicker(true)}
            className="flex items-center gap-3 p-4 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors"
          >
            <Map className="w-5 h-5" />
            <span>اختبار الخريطة</span>
          </button>

          <button
            onClick={runConnectivityTest}
            className="flex items-center gap-3 p-4 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>اختبار الاتصال</span>
          </button>

          <button
            onClick={clearResults}
            className="flex items-center gap-3 p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>مسح النتائج</span>
          </button>
        </div>
      </motion.div>

      {/* العنوان المحدد */}
      {selectedAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-green-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#01411C] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              العنوان المحدد
            </h3>
            <button
              onClick={copyAddressToClipboard}
              className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37] text-[#01411C] rounded hover:bg-[#f1c40f] transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              نسخ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {selectedAddress.formattedAddress && (
              <div className="md:col-span-2 p-3 bg-[#f0fdf4] rounded border border-green-200">
                <strong className="text-[#01411C]">العنوان الكامل:</strong>
                <p className="text-[#065f41] mt-1">{selectedAddress.formattedAddress}</p>
              </div>
            )}
            
            {selectedAddress.city && (
              <div>
                <strong className="text-[#01411C]">المدينة:</strong>
                <p className="text-[#065f41]">{selectedAddress.city}</p>
              </div>
            )}
            
            {selectedAddress.district && (
              <div>
                <strong className="text-[#01411C]">الحي:</strong>
                <p className="text-[#065f41]">{selectedAddress.district}</p>
              </div>
            )}
            
            {selectedAddress.street && (
              <div>
                <strong className="text-[#01411C]">الشارع:</strong>
                <p className="text-[#065f41]">{selectedAddress.street}</p>
              </div>
            )}
            
            {(selectedAddress.buildingNumber || selectedAddress.building) && (
              <div>
                <strong className="text-[#01411C]">رقم المبنى:</strong>
                <p className="text-[#065f41]">{selectedAddress.buildingNumber || selectedAddress.building}</p>
              </div>
            )}
            
            {selectedAddress.postalCode && (
              <div>
                <strong className="text-[#01411C]">الرمز البريدي:</strong>
                <p className="text-[#065f41]">{selectedAddress.postalCode}</p>
              </div>
            )}
            
            {selectedAddress.additionalNumber && (
              <div>
                <strong className="text-[#01411C]">الرقم الإضافي:</strong>
                <p className="text-[#065f41]">{selectedAddress.additionalNumber}</p>
              </div>
            )}
            
            {selectedAddress.latitude && selectedAddress.longitude && (
              <div className="md:col-span-2">
                <strong className="text-[#01411C]">الإحداثيات:</strong>
                <p className="text-[#065f41]">
                  خط العرض: {selectedAddress.latitude.toFixed(6)}، خط الطول: {selectedAddress.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* نتائج الاختبار */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-[#D4AF37]/20"
        >
          <h3 className="text-lg font-bold text-[#01411C] mb-4">نتائج الاختبار</h3>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-[#065f41]"
              >
                {result}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* تعليمات الاستخدام */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-xl p-6 border border-blue-200"
      >
        <h3 className="text-lg font-bold text-blue-800 mb-3">كيفية الاستخدام:</h3>
        <ul className="space-y-2 text-blue-700 text-sm">
          <li>• انقر على "اختبار الخريطة" لفتح نافذة اختيار الموقع</li>
          <li>• استخدم البحث أو انقر على الخريطة لتحديد موقع</li>
          <li>• ستظهر تفاصيل العنوان تلقائياً مع الملء التلقائي للحقول</li>
          <li>• يمكنك نسخ تفاصيل العنوان للاستخدام في مكان آخر</li>
          <li>• استخدم "اختبار الاتصال" للتأكد من عمل الاتصال بالإنترنت</li>
        </ul>
      </motion.div>

      {/* MapPicker */}
      <MapPicker
        isOpen={showMapPicker}
        address={selectedAddress || {}}
        onAddressSelect={handleAddressSelect}
        onClose={() => setShowMapPicker(false)}
      />
    </div>
  );
}