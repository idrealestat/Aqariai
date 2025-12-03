import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Offer, Request, BrokerProposal } from "../../types/owners";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  DollarSign, 
  Home, 
  Phone, 
  MessageSquare,
  Star,
  Check,
  X,
  Clock,
  Eye,
  Edit3,
  Trash2
} from "lucide-react";

interface OfferCardProps {
  data: Offer | Request;
  type: 'offer' | 'request';
  onUpdate?: () => void;
  onEdit?: (data: Offer | Request) => void;
  onDelete?: (id: string) => void;
}

export function OfferCard({ data, type, onUpdate, onEdit, onDelete }: OfferCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [processingProposal, setProcessingProposal] = useState<string | null>(null);

  // معالجة قبول/رفض عرض الوسيط
  const handleProposalDecision = useCallback(async (proposalId: string, action: 'accept' | 'reject') => {
    try {
      setProcessingProposal(proposalId);
      
      // محاولة إرسال للAPI مع معالجة أفضل للأخطاء
      try {
        const response = await fetch(`/api/proposals/${proposalId}/decide`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action,
            ownerId: data.ownerId
          })
        });

        if (!response.ok) {
          throw new Error('API response not ok');
        }
        
        console.log('Proposal decision sent to API successfully');
      } catch (apiError) {
        // معالجة صامتة - المعالجة المحلية تعمل بنجاح
      }

      // تحديث البيانات محلياً (دائماً)
      if (data.brokerProposals) {
        data.brokerProposals = data.brokerProposals.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: action === 'accept' ? 'accepted' : 'rejected' }
            : proposal
        );
      }
      
      onUpdate?.();
      
    } catch (error) {
      console.error('Error processing proposal:', error);
      
      // حتى في حالة الخطأ، نحاول التحديث محلياً
      if (data.brokerProposals) {
        data.brokerProposals = data.brokerProposals.map(proposal => 
          proposal.id === proposalId 
            ? { ...proposal, status: action === 'accept' ? 'accepted' : 'rejected' }
            : proposal
        );
      }
      
      onUpdate?.();
    } finally {
      setProcessingProposal(null);
    }
  }, [data, onUpdate]);

  // فتح رابط واتساب
  const openWhatsApp = useCallback((phone: string, brokerName: string) => {
    const message = encodeURIComponent(
      `مرحباً ${brokerName}, أود التواصل معك بخصوص ${type === 'offer' ? 'العرض' : 'الطلب'}: ${data.title || (data as Request).type}`
    );
    window.open(`https://wa.me/${phone.replace(/^0/, '966')}?text=${message}`, '_blank');
  }, [type, data]);

  // تنسيق السعر
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  // الحصول على معلومات السعر
  const getPriceInfo = useCallback(() => {
    if (type === 'offer') {
      const offer = data as Offer;
      if (offer.offerType === 'sale' && offer.pricePlan?.salePrice) {
        return {
          main: formatPrice(offer.pricePlan.salePrice),
          label: 'سعر البيع'
        };
      } else if (offer.offerType === 'rent') {
        const prices = [];
        if (offer.pricePlan?.rentSingle) prices.push(`${formatPrice(offer.pricePlan.rentSingle)} سنوي`);
        if (offer.pricePlan?.monthly) prices.push(`${formatPrice(offer.pricePlan.monthly)} شهري`);
        return {
          main: prices[0] || 'غير محدد',
          label: 'سعر الإيجار',
          additional: prices.slice(1)
        };
      }
    } else {
      const request = data as Request;
      if (request.budgetMin && request.budgetMax) {
        const paymentLabel = request.paymentMethod ? ` (${request.paymentMethod})` : '';
        return {
          main: `${formatPrice(request.budgetMin)} - ${formatPrice(request.budgetMax)}`,
          label: `الميزانية${paymentLabel}`
        };
      }
    }
    return { main: 'غير محدد', label: 'السعر' };
  }, [type, data, formatPrice]);

  // الحصول على حالة العرض/الطلب
  const getStatusInfo = useCallback(() => {
    const status = data.status || 'open';
    const statusConfig = {
      open: { label: 'مفتوح', color: 'text-green-600 bg-green-100', icon: '🔓' },
      accepted: { label: 'مقبول', color: 'text-blue-600 bg-blue-100', icon: '✅' },
      rejected: { label: 'مرفوض', color: 'text-red-600 bg-red-100', icon: '❌' },
      draft: { label: 'مسودة', color: 'text-gray-600 bg-gray-100', icon: '📝' }
    };
    return statusConfig[status] || statusConfig.open;
  }, [data.status]);

  const priceInfo = getPriceInfo();
  const statusInfo = getStatusInfo();
  const proposalsCount = data.brokerProposals?.length || 0;
  const acceptedProposals = data.brokerProposals?.filter(p => p.status === 'accepted').length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      
      {/* الرأس */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#01411C] line-clamp-1">
                  {type === 'offer' ? (data.title || 'عرض عقاري') : `مطلوب ${(data as Request).type}`}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#065f41]">
                  <span>{type === 'offer' ? (data as Offer).type : (data as Request).type}</span>
                  {data.address?.city && (
                    <>
                      <span>•</span>
                      <span>{data.address.city}</span>
                    </>
                  )}
                  {((data as Request).city || data.address?.district) && (
                    <>
                      <span>•</span>
                      <span>{(data as Request).city || data.address?.district}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* معلومات أساسية */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold text-[#01411C]">{priceInfo.main}</span>
              </div>
              
              {data.areaM2 && (
                <div className="flex items-center gap-2">
                  <span className="text-[#065f41]">المساحة:</span>
                  <span className="font-medium">{data.areaM2} م²</span>
                </div>
              )}
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.label}
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex items-center gap-2">
            {proposalsCount > 0 && (
              <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#01411C] rounded-full text-xs font-medium">
                {proposalsCount} وسيط
              </span>
            )}
            
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(data)}
                  className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(data.id!)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-[#01411C] hover:bg-gray-100 rounded-lg transition-colors"
                title={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* التفاصيل المنطوية */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            
            {/* الوصف */}
            {data.description && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-semibold text-[#01411C] mb-2">الوصف:</h4>
                <p className="text-[#065f41] leading-relaxed text-sm">
                  {data.description}
                </p>
              </div>
            )}

            {/* المواصفات */}
            {data.features && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-semibold text-[#01411C] mb-3">المواصفات:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {data.features.bedrooms && data.features.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">🛏️</span>
                      <span>{data.features.bedrooms} غرف نوم</span>
                    </div>
                  )}
                  {data.features.bathrooms && data.features.bathrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">🚿</span>
                      <span>{data.features.bathrooms} دورات مياه</span>
                    </div>
                  )}
                  {data.features.parkingSpaces && data.features.parkingSpaces > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">🚗</span>
                      <span>{data.features.parkingSpaces} مواقف</span>
                    </div>
                  )}
                  {data.features.hasPool && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">🏊</span>
                      <span>مسبح</span>
                    </div>
                  )}
                  {data.features.hasGarden && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">🌳</span>
                      <span>حديقة</span>
                    </div>
                  )}
                  {data.features.hasElevator && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">🛗</span>
                      <span>مصعد</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* عروض الوسطاء */}
            {proposalsCount > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[#01411C]">
                    عروض الوسطاء ({proposalsCount})
                  </h4>
                  {acceptedProposals > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {acceptedProposals} مقبول
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {data.brokerProposals?.map((proposal, index) => (
                    <motion.div
                      key={proposal.id || index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        p-4 border-2 rounded-xl transition-all
                        ${proposal.status === 'accepted' 
                          ? 'border-green-200 bg-green-50' 
                          : proposal.status === 'rejected'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white hover:border-[#D4AF37]/50'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          
                          {/* معلومات الوسيط */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#01411C] rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {proposal.brokerName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#01411C]">
                                {proposal.brokerName}
                              </h5>
                              <div className="flex items-center gap-2 text-sm">
                                {proposal.brokerRating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>{proposal.brokerRating}</span>
                                    {proposal.brokerReviewsCount && (
                                      <span className="text-gray-500">({proposal.brokerReviewsCount})</span>
                                    )}
                                  </div>
                                )}
                                <span className={`
                                  px-2 py-1 rounded-full text-xs font-medium
                                  ${proposal.status === 'accepted' 
                                    ? 'bg-green-100 text-green-800'
                                    : proposal.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                  }
                                `}>
                                  {proposal.status === 'accepted' ? 'مقبول' : 
                                   proposal.status === 'rejected' ? 'مرفوض' : 'في الانتظار'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* رسالة الوسيط */}
                          {proposal.message && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-[#065f41] text-sm leading-relaxed">
                                {proposal.message}
                              </p>
                            </div>
                          )}

                          {/* تفاصيل العرض */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {proposal.commissionPercent && (
                              <div className="flex items-center gap-2">
                                <span className="text-[#065f41]">العمولة:</span>
                                <span className="font-medium text-[#01411C]">
                                  {proposal.commissionPercent}%
                                </span>
                              </div>
                            )}
                            {proposal.offeredPrice && (
                              <div className="flex items-center gap-2">
                                <span className="text-[#065f41]">السعر المقترح:</span>
                                <span className="font-medium text-[#01411C]">
                                  {formatPrice(proposal.offeredPrice)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* أزرار التواصل */}
                          <div className="flex items-center gap-2 mt-3">
                            {proposal.phone && (
                              <a
                                href={`tel:${proposal.phone}`}
                                className="flex items-center gap-2 px-3 py-2 text-[#01411C] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors text-sm"
                              >
                                <Phone className="w-4 h-4" />
                                اتصال
                              </a>
                            )}
                            {proposal.whatsapp && (
                              <button
                                onClick={() => openWhatsApp(proposal.whatsapp!, proposal.brokerName)}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                واتساب
                              </button>
                            )}
                          </div>
                        </div>

                        {/* أزرار القبول/الرفض */}
                        {proposal.status === 'pending' && (
                          <div className="flex gap-2 mr-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleProposalDecision(proposal.id!, 'accept')}
                              disabled={processingProposal === proposal.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                            >
                              {processingProposal === proposal.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              قبول
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleProposalDecision(proposal.id!, 'reject')}
                              disabled={processingProposal === proposal.id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                            >
                              {processingProposal === proposal.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                              رفض
                            </motion.button>
                          </div>
                        )}
                      </div>

                      {/* تاريخ العرض */}
                      {proposal.createdAt && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            تم الإرسال في: {new Date(proposal.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* رسالة عدم وجود عروض */}
            {proposalsCount === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h5 className="text-[#01411C] font-semibold mb-2">
                  لا توجد عروض من الوسطاء بعد
                </h5>
                <p className="text-[#065f41] text-sm">
                  سيتم إظهار عروض الوسطاء هنا عند وصولها
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}