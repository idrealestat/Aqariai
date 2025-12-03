import React from 'react';
import { MessageCircle } from 'lucide-react';

interface TextShareConfirmModalProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
  platform: 'whatsapp' | 'whatsapp-business';
}

export function TextShareConfirmModal({ isOpen, onYes, onNo, platform }: TextShareConfirmModalProps) {
  if (!isOpen) return null;

  const platformName = platform === 'whatsapp-business' ? 'واتساب الأعمال' : 'واتساب';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl animate-fade-in-scale">
        
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <h2 className="text-2xl font-bold text-[#01411C] mb-4">
            تم إرسال الصور بنجاح! ✓
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            هل تريد إرسال الوصف النصي أيضاً؟
          </p>

          <div className="flex gap-4">
            <button
              onClick={onNo}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-bold text-lg"
            >
              لا، شكراً
            </button>
            <button
              onClick={onYes}
              className="flex-1 px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold text-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              نعم، أرسل النص
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            سيتم فتح {platformName} مع النص جاهزاً للإرسال
          </p>
        </div>
      </div>
    </div>
  );
}
