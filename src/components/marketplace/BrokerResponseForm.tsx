import { useState } from "react";
import { motion } from "motion/react";
import { X, Save, Percent, FileText, Phone, CreditCard, Star } from "lucide-react";
import { MarketplaceOffer, BrokerResponse } from "../../types/marketplace";

interface BrokerResponseFormProps {
  offer: MarketplaceOffer;
  onClose: () => void;
  userPlan: string;
}

export function BrokerResponseForm({ offer, onClose, userPlan }: BrokerResponseFormProps) {
  const [formData, setFormData] = useState({
    serviceDescription: '',
    commissionPercentage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
  const userRating = parseFloat(localStorage.getItem('user-rating') || '4.5');

  const getBadgeFromPlan = (plan: string) => {
    const badges: Record<string, 'bronze' | 'silver' | 'gold' | 'platinum'> = {
      bronze: 'bronze',
      silver: 'silver',
      gold: 'gold',
      platinum: 'platinum'
    };
    return badges[plan] || 'bronze';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceDescription.trim() || !formData.commissionPercentage) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const commission = parseFloat(formData.commissionPercentage);
    if (isNaN(commission) || commission <= 0 || commission > 100) {
      alert('يرجى إدخال نسبة صحيحة بين 0 و 100');
      return;
    }

    setIsSubmitting(true);

    const response: BrokerResponse = {
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      offerId: offer.id,
      offerType: offer.type,
      
      brokerId: userData.id || 'unknown',
      brokerName: userData.name || 'وسيط',
      brokerPhone: userData.phone || '',
      brokerLicense: userData.license || '',
      brokerRating: userRating,
      brokerBadge: getBadgeFromPlan(userPlan),
      brokerCity: userData.city,
      brokerDistrict: userData.district,
      
      serviceDescription: formData.serviceDescription.trim(),
      commissionPercentage: commission,
      
      status: 'pending',
      ownerViewed: false,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingResponses = JSON.parse(localStorage.getItem('broker-responses') || '[]');
    existingResponses.push(response);
    localStorage.setItem('broker-responses', JSON.stringify(existingResponses));

    // Update offer responses count
    const offers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
    const updatedOffers = offers.map((o: MarketplaceOffer) => 
      o.id === offer.id 
        ? { ...o, responsesCount: (o.responsesCount || 0) + 1, updatedAt: new Date().toISOString() }
        : o
    );
    localStorage.setItem('marketplace-offers', JSON.stringify(updatedOffers));

    // 🔔 إضافة إشعار للمالك
    try {
      // استيراد دالة إشعارات المالك
      const { createOwnerNotification } = await import('../../utils/ownerNotificationsManager');
      
      // الحصول على معلومات المالك من العرض الكامل
      const fullOfferId = offer.fullOfferId;
      const ownerFullOffers = JSON.parse(localStorage.getItem(`owner-full-offers-${offer.userId}`) || '[]');
      const fullOffer = ownerFullOffers.find((o: any) => o.id === fullOfferId);
      
      if (fullOffer) {
        // تحديد نوع العرض بناءً على type و transactionType
        let offerType: 'sale' | 'rent' | 'buy-request' | 'rent-request';
        
        if (offer.type === 'offer') {
          // عروض البيع والإيجار
          offerType = offer.transactionType === 'sale' ? 'sale' : 'rent';
        } else {
          // طلبات الشراء والاستئجار
          offerType = offer.transactionType === 'sale' ? 'buy-request' : 'rent-request';
        }
        
        // إنشاء إشعار للمالك
        createOwnerNotification(
          offer.userId, // معرف المالك
          offer.id, // معرف العرض في الماركت بليس
          offer.title, // عنوان العرض
          offerType, // نوع العرض
          {
            brokerId: response.brokerId,
            brokerName: response.brokerName,
            brokerPhone: response.brokerPhone,
            brokerEmail: userData.email || '',
            message: response.serviceDescription,
            commission: response.commissionPercentage,
            timestamp: Date.now(),
            ownerViewed: false
          }
        );
        console.log('✅ [BrokerResponseForm] تم إنشاء إشعار للمالك');
      }
    } catch (error) {
      console.error('❌ [BrokerResponseForm] خطأ في إنشاء الإشعار:', error);
    }

    alert('✅ تم إرسال عرضك بنجاح!');
    setIsSubmitting(false);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-[#01411C] to-[#065f41] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-white mb-1">قدم عرضك للعميل</h2>
              <p className="text-sm text-white/80">{offer.propertyType} • {offer.city}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Offer Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">تفاصيل {offer.type === 'offer' ? 'العرض' : 'الطلب'}</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">النوع:</span> {offer.propertyType}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">الموقع:</span> {offer.city}
                {offer.district && ` - ${offer.district}`}
              </p>
              {offer.area && (
                <p className="text-gray-700">
                  <span className="font-medium">المساحة:</span> {offer.area} م²
                </p>
              )}
              {(offer.priceFrom || offer.priceTo) && (
                <p className="text-gray-700">
                  <span className="font-medium">النطاق السعري:</span>{' '}
                  {offer.priceFrom && formatPrice(offer.priceFrom)}
                  {offer.priceFrom && offer.priceTo && ' - '}
                  {offer.priceTo && formatPrice(offer.priceTo)}
                </p>
              )}
              {offer.description && (
                <p className="text-gray-700">
                  <span className="font-medium">الوصف:</span> {offer.description}
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#01411C]" />
                  <span>ما يمكنك تقديمه للعميل *</span>
                </div>
              </label>
              <textarea
                value={formData.serviceDescription}
                onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                placeholder="اشرح الخدمات التي ستقدمها: خبرتك في السوق، خدمات الإعلان، معرفتك بالأسعار..."
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01411C] focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                مثال: لدي خبرة 10 سنوات في سوق العقارات بالرياض، أقدم خدمات التسويق الإلكتروني والتصوير الاحترافي
              </p>
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#01411C]" />
                  <span>نسبة العمولة المطلوبة *</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.commissionPercentage}
                  onChange={(e) => setFormData({ ...formData, commissionPercentage: e.target.value })}
                  placeholder="2.5"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01411C] focus:border-transparent pr-12"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                العمولة المعتادة في السوق السعودي: 2% - 2.5%
              </p>
            </div>

            {/* Broker Info Preview */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-3">المعلومات التي سيتم إرسالها:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-[#01411C]" />
                  <span>الاسم: {userData.name || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-[#01411C]" />
                  <span>الجوال: {userData.phone || 'غير محدد'}</span>
                </div>
                {userData.license && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <CreditCard className="w-4 h-4 text-[#01411C]" />
                    <span>رخصة فال: {userData.license}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-4 h-4 text-[#D4AF37]" />
                  <span>التقييم: {userRating.toFixed(1)} نجمة</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userPlan === 'platinum' ? 'bg-purple-100 text-purple-700' :
                    userPlan === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                    userPlan === 'silver' ? 'bg-gray-200 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {userPlan === 'platinum' ? '💎 بلاتيني' :
                     userPlan === 'gold' ? '🥇 ذهبي' :
                     userPlan === 'silver' ? '🥈 فضي' :
                     '🥉 برونزي'}
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>ملاحظة:</strong> سيتم عرض تقييمك وشارة العضوية للعميل. معلومات التواصل الخاصة بك لن تظهر إلا بعد قبول عرضك.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال العرض'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}