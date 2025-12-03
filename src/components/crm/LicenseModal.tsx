import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (license: string) => void;
  onContinueWithoutLicense: () => void;
}

export function LicenseModal({ isOpen, onClose, onConfirm, onContinueWithoutLicense }: LicenseModalProps) {
  const [license, setLicense] = useState('');

  const handleConfirm = () => {
    if (license.trim()) {
      onConfirm(license);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#01411C]">
                  رقم الترخيص الإعلاني
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أدخل رقم الترخيص الإعلاني (اختياري)
                  </label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="مثال: 1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    💡 يمكنك إدخال رقم الترخيص الإعلاني إذا كان متوفراً، أو المتابعة بدون ترخيص
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                {/* زر تم - للمتابعة مع الترخيص */}
                <button
                  onClick={handleConfirm}
                  disabled={!license.trim()}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    license.trim()
                      ? 'bg-[#01411C] text-white hover:bg-[#065f41]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  تم - المتابعة مع الترخيص
                </button>

                {/* زر المتابعة بدون ترخيص */}
                <button
                  onClick={onContinueWithoutLicense}
                  className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  المتابعة بدون ترخيص إعلاني
                </button>

                {/* زر الإلغاء */}
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}