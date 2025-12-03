import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, Star, Phone, CreditCard, FileText, Download } from "lucide-react";

interface AcceptedOffer {
  id: string;
  offerId: string;
  offerType: 'offer' | 'request';
  transactionType: 'sale' | 'rent';
  propertyType: string;
  city: string;
  district?: string;
  description: string;
  
  // معلومات الوسيط
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerWhatsapp?: string;
  brokerLicense?: string;
  brokerRating: number;
  brokerBadge?: 'bronze' | 'silver' | 'gold' | 'platinum';
  brokerCity?: string;
  brokerDistrict?: string;
  
  // تفاصيل الاتفاق
  commissionPercentage: number;
  serviceDescription: string;
  
  acceptedAt: string;
}

interface AcceptedOffersViewProps {
  userId?: string;
}

export function AcceptedOffersView({ userId }: AcceptedOffersViewProps) {
  const [acceptedOffers, setAcceptedOffers] = useState<AcceptedOffer[]>([]);

  // Get userId from localStorage if not provided
  const currentUserId = userId || JSON.parse(localStorage.getItem('aqary-crm-user') || '{}').id;

  useEffect(() => {
    if (currentUserId) {
      loadAcceptedOffers();
    }
  }, [currentUserId]);

  const loadAcceptedOffers = () => {
    const stored = localStorage.getItem('accepted-offers');
    if (stored) {
      const allAccepted: AcceptedOffer[] = JSON.parse(stored);
      
      // جلب marketplace offers كـ array
      const marketplaceOffersStr = localStorage.getItem('marketplace-offers');
      const marketplaceOffers = marketplaceOffersStr ? JSON.parse(marketplaceOffersStr) : [];
      
      // جلب owner-full-offers
      const ownerFullOffersStr = localStorage.getItem(`owner-full-offers-${currentUserId}`);
      const ownerFullOffers = ownerFullOffersStr ? JSON.parse(ownerFullOffersStr) : [];
      
      // جلب owner-full-requests
      const ownerFullRequestsStr = localStorage.getItem(`owner-full-requests-${currentUserId}`);
      const ownerFullRequests = ownerFullRequestsStr ? JSON.parse(ownerFullRequestsStr) : [];
      
      // استخراج IDs للعروض والطلبات الخاصة بالمالك
      const myOfferIds = ownerFullOffers.map((o: any) => o.id);
      const myRequestIds = ownerFullRequests.map((r: any) => r.id);
      
      // البحث عن marketplace offers التي تخص هذا المالك
      // ملاحظة: العروض تستخدم fullOfferId والطلبات تستخدم fullRequestId
      const myMarketplaceOfferIds = marketplaceOffers
        .filter((mo: any) => 
          myOfferIds.includes(mo.fullOfferId) || myRequestIds.includes(mo.fullRequestId)
        )
        .map((mo: any) => mo.id);
      
      // فلترة العروض المقبولة للمالك الحالي فقط
      const myAccepted = allAccepted.filter(offer => 
        myMarketplaceOfferIds.includes(offer.offerId)
      );
      
      console.log('🔍 [AcceptedOffersView] جميع العروض المقبولة:', allAccepted.length);
      console.log('🔍 [AcceptedOffersView] عروضي المقبولة:', myAccepted.length);
      console.log('🔍 [AcceptedOffersView] myMarketplaceOfferIds:', myMarketplaceOfferIds);
      console.log('🔍 [AcceptedOffersView] العروض المقبولة:', myAccepted);
      
      setAcceptedOffers(myAccepted);
    } else {
      console.log('⚠️ [AcceptedOffersView] لا توجد عروض مقبولة في localStorage');
      setAcceptedOffers([]);
    }
  };

  const getBadgeColor = (badge?: string) => {
    const colors: Record<string, string> = {
      platinum: 'bg-purple-100 text-purple-700 border-purple-300',
      gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      silver: 'bg-gray-200 text-gray-700 border-gray-400',
      bronze: 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return colors[badge || 'bronze'];
  };

  const getBadgeLabel = (badge?: string) => {
    const labels: Record<string, string> = {
      platinum: '💎 بلاتيني',
      gold: '🥇 ذهبي',
      silver: '🥈 فضي',
      bronze: '🥉 برونزي'
    };
    return labels[badge || 'bronze'];
  };

  const handleDownloadPDF = (offer: AcceptedOffer) => {
    alert('سيتم تحميل الاتفاقية قريباً');
    // TODO: Implement PDF generation
  };

  if (acceptedOffers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl text-gray-900 mb-2">لا توجد عروض مقبولة</h3>
        <p className="text-gray-600">عندما تقبل عرض من وسيط، سيظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {acceptedOffers.map((offer) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {offer.propertyType} - {offer.city}
                </h3>
                <p className="text-sm text-gray-600">
                  {offer.offerType === 'offer' ? 'عرض' : 'طلب'} • {offer.transactionType === 'sale' ? 'بيع' : 'إيجار'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              تم القبول ✓
            </span>
          </div>

          {/* Broker Info */}
          <div className="bg-gradient-to-br from-[#f0fdf4] to-white p-5 rounded-xl mb-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <span>معلومات الوسيط</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#01411C] to-[#065f41] flex items-center justify-center text-white">
                    {offer.brokerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الاسم</p>
                    <p className="font-semibold text-gray-900">{offer.brokerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#01411C] mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">رقم الجوال</p>
                    <p className="font-semibold text-gray-900 direction-ltr">{offer.brokerPhone}</p>
                  </div>
                </div>

                {offer.brokerWhatsapp && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">رقم الواتساب</p>
                      <p className="font-semibold text-gray-900 direction-ltr">{offer.brokerWhatsapp}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                {offer.brokerLicense && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-[#01411C] mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">رخصة فال</p>
                      <p className="font-semibold text-gray-900">{offer.brokerLicense}</p>
                    </div>
                  </div>
                )}

                {(offer.brokerCity || offer.brokerDistrict) && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#01411C] mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">الموقع</p>
                      <p className="font-semibold text-gray-900">
                        {offer.brokerCity} {offer.brokerDistrict && `- ${offer.brokerDistrict}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(offer.brokerRating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({offer.brokerRating.toFixed(1)})</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(offer.brokerBadge)}`}>
                    {getBadgeLabel(offer.brokerBadge)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Details */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-amber-900 mb-3">تفاصيل الاتفاق</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-800">نسبة العمولة المتفق عليها:</span>
                <span className="text-xl font-bold text-amber-900">{offer.commissionPercentage}%</span>
              </div>
              <div className="pt-2 border-t border-amber-200">
                <p className="text-sm text-amber-800 mb-1">الخدمات المقدمة:</p>
                <p className="text-sm text-amber-900">{offer.serviceDescription}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => handleDownloadPDF(offer)}
              className="flex-1 px-4 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] font-medium transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>تحميل الاتفاقية PDF</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              تم قبول العرض في: {new Date(offer.acceptedAt).toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}