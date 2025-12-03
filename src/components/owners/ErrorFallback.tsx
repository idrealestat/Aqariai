import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";

interface ErrorFallbackProps {
  error: string;
  onRetry?: () => void;
  onBack?: () => void;
  title?: string;
}

export function ErrorFallback({ 
  error, 
  onRetry, 
  onBack, 
  title = "حدث خطأ غير متوقع" 
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        
        {/* أيقونة الخطأ */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </motion.div>

        {/* العنوان */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl font-bold text-red-600 mb-4"
        >
          {title}
        </motion.h1>

        {/* رسالة الخطأ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <p className="text-red-700 text-sm leading-relaxed">
            {error}
          </p>
        </motion.div>

        {/* نصائح للمستخدم */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
        >
          <h3 className="text-yellow-800 font-semibold mb-2">
            💡 نصائح لحل المشكلة:
          </h3>
          <ul className="text-yellow-700 text-sm space-y-1 text-right">
            <li>• تأكد من اتصالك بالإنترنت</li>
            <li>• حاول تحديث الصفحة</li>
            <li>• تأكد من صحة البيانات المدخلة</li>
            <li>• إذا استمرت المشكلة، تواصل مع الدعم الفني</li>
          </ul>
        </motion.div>

        {/* الأزرار */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-3"
        >
          
          {/* زر إعادة المحاولة */}
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-colors font-semibold"
            >
              <RefreshCw className="w-5 h-5" />
              إعادة المحاولة
            </motion.button>
          )}

          {/* زر العودة */}
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 transition-colors font-semibold"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للصفحة السابقة
            </motion.button>
          )}

          {/* زر تحديث الصفحة */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2 text-[#065f41] text-sm hover:text-[#01411C] transition-colors underline"
          >
            تحديث الصفحة
          </motion.button>
        </motion.div>

        {/* معلومات إضافية للدعم الفني */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-gray-500 text-xs mb-2">
            إذا استمرت المشكلة، يرجى إرسال لقطة شاشة من هذه الرسالة إلى الدعم الفني
          </p>
          <div className="bg-gray-100 rounded p-2 text-xs text-gray-600 font-mono text-left" dir="ltr">
            Error ID: {Date.now()}
            <br />
            Timestamp: {new Date().toISOString()}
            <br />
            UserAgent: {navigator.userAgent.substring(0, 50)}...
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}