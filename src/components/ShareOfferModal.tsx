import React, { useState } from 'react';
import { X, Copy, Share2, Check, Phone, Mail, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { SharingSettingsModal } from './SharingSettingsModal';
import { TextShareConfirmModal } from './TextShareConfirmModal';

interface SharingSettings {
  showTitle: boolean;
  showPricing: boolean;
  shareAdditionalPictures: boolean;
  shareVideo: boolean;
  showSKU: boolean;
  addLogoWatermark: boolean;
  customNote: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface ShareOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerTitle: string;
  offerId: string;
  adNumber: string;
  offerDescription?: string;
  offerPrice?: string;
}

export function ShareOfferModal({ isOpen, onClose, offerTitle, offerId, adNumber, offerDescription, offerPrice }: ShareOfferModalProps) {
  const [copied, setCopied] = useState(false);
  const [showSharingSettings, setShowSharingSettings] = useState(false);
  const [showTextConfirm, setShowTextConfirm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'whatsapp' | 'whatsapp-business' | null>(null);
  
  // إنشاء رابط العرض (مثال - يمكن تخصيصه لاحقاً)
  const offerUrl = `https://id-realestat.catalog.to/s/---/---/${adNumber}`;
  
  // وظيفة نسخ الرابط
  const handleCopyLink = () => {
    navigator.clipboard.writeText(offerUrl).then(() => {
      setCopied(true);
      toast.success('تم نسخ الرابط بنجاح! ✓');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('فشل نسخ الرابط');
    });
  };

  // فتح إعدادات المشاركة
  const handleOpenSharingSettings = (platform: 'whatsapp' | 'whatsapp-business') => {
    setSelectedPlatform(platform);
    setShowSharingSettings(true);
  };

  // تأكيد إعدادات المشاركة
  const handleConfirmSettings = (settings: SharingSettings) => {
    setShowSharingSettings(false);
    
    // محاكاة إرسال الصور
    toast.success('جاري إرسال الصور مع الإعدادات المختارة...');
    
    // بعد 2 ثانية، إظهار سؤال النص
    setTimeout(() => {
      setShowTextConfirm(true);
    }, 2000);
  };

  // إرسال النص
  const handleSendText = () => {
    setShowTextConfirm(false);
    
    // إنشاء النص الكامل
    const fullText = `
${offerTitle}

${offerDescription || 'شقة فاخرة في موقع متميز'}

💰 السعر: ${offerPrice || '500,000 ريال'}

📍 رقم الإعلان: ${adNumber}

🔗 للمزيد من التفاصيل:
${offerUrl}
    `.trim();
    
    // فتح واتساب مع النص جاهز
    const whatsappUrl = selectedPlatform === 'whatsapp-business' 
      ? `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`
      : `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('تم فتح واتساب مع النص جاهزاً! ✓');
    
    // إغلاق كل المودالات
    onClose();
  };

  // تخطي إرسال النص
  const handleSkipText = () => {
    setShowTextConfirm(false);
    toast.info('تم إرسال الصور فقط');
    onClose();
  };

  // وظائف المشاركة المباشرة (بدون إعدادات)
  const handleShareWhatsApp = () => {
    handleOpenSharingSettings('whatsapp');
  };

  const handleShareWhatsAppBusiness = () => {
    handleOpenSharingSettings('whatsapp-business');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(offerUrl)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(offerTitle);
    const body = encodeURIComponent(`شاهد هذا العرض:\n\n${offerTitle}\n\n${offerUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareSMS = () => {
    const message = encodeURIComponent(`${offerTitle}\n${offerUrl}`);
    window.location.href = `sms:?body=${message}`;
  };

  const handleSharePhone = () => {
    toast.info('يمكنك مشاركة الرابط عبر مكالمة هاتفية');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b-2 border-[#D4AF37] p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-[#01411C]">مشاركة العرض</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Product Link Section */}
          <div>
            <label className="block text-sm font-bold text-[#01411C] mb-3">رابط العرض</label>
            
            {/* Link Box with Tap to Copy */}
            <div 
              onClick={handleCopyLink}
              className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-gray-800 truncate font-mono">
                    {offerUrl}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Copy Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink();
                    }}
                    className="p-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#D4AF37] hover:bg-[#fffef7] transition-all"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  
                  {/* Share Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: offerTitle,
                          url: offerUrl
                        });
                      }
                    }}
                    className="p-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#D4AF37] hover:bg-[#fffef7] transition-all"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Tap to Copy Text */}
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {copied ? '✓ تم النسخ' : 'اضغط للنسخ'}
                </span>
              </div>
            </div>
          </div>

          {/* Share Via Section */}
          <div>
            <label className="block text-sm font-bold text-[#01411C] mb-4">مشاركة عبر</label>
            
            <div className="grid grid-cols-4 gap-4">
              
              {/* WhatsApp Business */}
              <button
                onClick={handleShareWhatsAppBusiness}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">B</span>
                </div>
                <span className="text-xs font-bold text-green-800">واتساب أعمال</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-green-800">واتساب</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleShareFacebook}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl font-bold text-white">f</span>
                </div>
                <span className="text-xs font-bold text-blue-800">فيسبوك</span>
              </button>

              {/* SMS */}
              <button
                onClick={handleShareSMS}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-800">رسالة</span>
              </button>

              {/* Email */}
              <button
                onClick={handleShareEmail}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-yellow-800">بريد</span>
              </button>

              {/* Phone */}
              <button
                onClick={handleSharePhone}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-gray-800">هاتف</span>
              </button>

              {/* PDF */}
              <button
                onClick={() => toast.info('وظيفة PDF قيد التطوير')}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl hover:border-red-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-sm font-bold text-white">PDF</span>
                </div>
                <span className="text-xs font-bold text-red-800">ملف PDF</span>
              </button>

              {/* More */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: offerTitle,
                      url: offerUrl
                    });
                  } else {
                    toast.info('المزيد من خيارات المشاركة');
                  }
                }}
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-xl hover:border-teal-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold text-teal-800">المزيد</span>
              </button>

            </div>
          </div>

          {/* Note about WhatsApp Business */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-bold">✨ ميزة جديدة:</span> عند اختيار واتساب أو واتساب الأعمال، ستتمكن من تخصيص <span className="font-bold">إعدادات المشاركة</span> (العنوان، السعر، الشعار، إلخ)
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Sharing Settings Modal */}
      {selectedPlatform && (
        <SharingSettingsModal
          isOpen={showSharingSettings}
          onClose={() => setShowSharingSettings(false)}
          onConfirm={handleConfirmSettings}
          platform={selectedPlatform}
        />
      )}

      {/* Text Share Confirm Modal */}
      {selectedPlatform && (
        <TextShareConfirmModal
          isOpen={showTextConfirm}
          onYes={handleSendText}
          onNo={handleSkipText}
          platform={selectedPlatform}
        />
      )}
    </div>
  );
}
