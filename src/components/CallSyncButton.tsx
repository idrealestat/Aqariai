/**
 * 📞 زر مزامنة الاتصالات الأخيرة
 * يتزامن مع جهاز المستخدم أو يستورد من ملف
 */

import React, { useState } from 'react';
import { Phone, Upload, Download, Trash2, RefreshCw, Users, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  pickContactsFromDevice,
  getRecentCallsFromStorage,
  parseCallsFromCSV,
  generateDemoRecentCalls,
  clearRecentCalls,
  downloadCallsCSV,
  isContactPickerSupported,
  type RecentCall
} from '../utils/phoneCallSync';

interface CallSyncButtonProps {
  onCallsImported: (calls: RecentCall[]) => void;
  onError?: (error: string) => void;
}

export function CallSyncButton({ onCallsImported, onError }: CallSyncButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);

  const isSupported = isContactPickerSupported();

  // مزامنة من جهاز المستخدم
  const handleSyncFromDevice = async () => {
    if (!isSupported) {
      onError?.('متصفحك لا يدعم الوصول لجهات الاتصال. استخدم Chrome 80+ على Android');
      return;
    }

    setIsLoading(true);
    try {
      const calls = await pickContactsFromDevice();
      if (calls.length > 0) {
        setRecentCalls(calls);
        onCallsImported(calls);
      } else {
        onError?.('لم يتم اختيار أي جهات اتصال');
      }
    } catch (error: any) {
      onError?.(error.message || 'فشل استيراد جهات الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  // استيراد من ملف CSV
  const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const calls = parseCallsFromCSV(csv);
        
        if (calls.length > 0) {
          setRecentCalls(calls);
          onCallsImported(calls);
        } else {
          onError?.('الملف فارغ أو بتنسيق غير صحيح');
        }
      } catch (error: any) {
        onError?.(error.message || 'فشل قراءة الملف');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  // تحميل بيانات تجريبية
  const handleLoadDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      const calls = generateDemoRecentCalls();
      setRecentCalls(calls);
      onCallsImported(calls);
      setIsLoading(false);
    }, 500);
  };

  // تصدير إلى CSV
  const handleExport = () => {
    const storedCalls = getRecentCallsFromStorage();
    if (storedCalls.length === 0) {
      onError?.('لا توجد مكالمات لتصديرها');
      return;
    }
    downloadCallsCSV(storedCalls);
  };

  // مسح البيانات
  const handleClear = () => {
    if (confirm('هل تريد مسح جميع المكالمات المحفوظة؟')) {
      clearRecentCalls();
      setRecentCalls([]);
      onCallsImported([]);
    }
  };

  return (
    <div className="relative" dir="rtl">
      {/* زر رئيسي */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg"
      >
        <Phone className="w-4 h-4 ml-2" />
        مزامنة الاتصالات
      </Button>

      {/* القائمة المنبثقة */}
      {isOpen && (
        <>
          {/* خلفية للإغلاق */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* القائمة */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-200 z-50 overflow-hidden">
            {/* هيدر */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Phone className="w-5 h-5" />
                مزامنة الاتصالات الأخيرة
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                استورد الاتصالات من جهازك أو من ملف
              </p>
            </div>

            {/* المحتوى */}
            <div className="p-4 space-y-3">
              {/* تحذير عدم الدعم */}
              {!isSupported && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-bold mb-1">متصفحك لا يدعم الوصول لجهات الاتصال</p>
                    <p className="text-xs">استخدم Chrome 80+ على Android للمزامنة المباشرة</p>
                  </div>
                </div>
              )}

              {/* مزامنة من الجهاز */}
              <button
                onClick={handleSyncFromDevice}
                disabled={!isSupported || isLoading}
                className={`w-full p-3 rounded-lg text-right flex items-center gap-3 transition-all ${
                  isSupported && !isLoading
                    ? 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 cursor-pointer'
                    : 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">مزامنة من الجهاز</p>
                  <p className="text-xs text-gray-600">استيراد جهات الاتصال من هاتفك</p>
                </div>
              </button>

              {/* استيراد من ملف */}
              <label className="w-full p-3 rounded-lg text-right flex items-center gap-3 transition-all bg-green-50 hover:bg-green-100 border-2 border-green-200 cursor-pointer">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">استيراد من ملف CSV</p>
                  <p className="text-xs text-gray-600">رفع ملف يحتوي على بيانات الاتصالات</p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportFromFile}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>

              {/* بيانات تجريبية */}
              <button
                onClick={handleLoadDemo}
                disabled={isLoading}
                className="w-full p-3 rounded-lg text-right flex items-center gap-3 transition-all bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 cursor-pointer"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">تحميل بيانات تجريبية</p>
                  <p className="text-xs text-gray-600">8 اتصالات تجريبية للاختبار</p>
                </div>
              </button>

              {/* خط فاصل */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* أزرار إضافية */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExport}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  تصدير
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  مسح الكل
                </button>
              </div>

              {/* معلومات إضافية */}
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                <p className="font-bold mb-2">💡 نصيحة:</p>
                <ul className="space-y-1 mr-4">
                  <li>• سيتم إضافة الاتصالات إلى عمود "الاتصالات الأخيرة"</li>
                  <li>• الاتصالات المكررة سيتم تحديثها تلقائياً</li>
                  <li>• يمكنك تصدير البيانات كملف CSV</li>
                </ul>
              </div>
            </div>

            {/* حالة التحميل */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">جاري المزامنة...</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
