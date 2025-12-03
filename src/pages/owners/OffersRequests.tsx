import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OfferCard } from "../../components/owners/OfferCard";
import { Offer, Request } from "../../types/owners";
import { X, FileText, ShoppingCart, Menu, Home, MessageSquare, BarChart3, MoreHorizontal, Users, CheckCircle } from "lucide-react";
import { MyOffersView } from "../../components/owners/MyOffersView";
import { AcceptedOffersView } from "../../components/marketplace/AcceptedOffersView";

interface OffersRequestsProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[];
  requests: Request[];
  onUpdate: () => void;
  onEdit: (data: Offer | Request) => void;
  onDelete: (id: string) => void;
  onOpenCRM?: () => void;
  onOpenRightSlider?: () => void;
  userId?: string;
}

export function OffersRequests({
  isOpen,
  onClose,
  offers,
  requests,
  onUpdate,
  onEdit,
  onDelete,
  onOpenCRM,
  onOpenRightSlider,
  userId
}: OffersRequestsProps) {
  const [activeTab, setActiveTab] = useState<'my-offers' | 'accepted-offers'>('my-offers');

  // جمع جميع العروض (البيع + الإيجار)
  const allOffers = offers || [];

  // جمع جميع الطلبات (الشراء + الاستئجار)
  const allRequests = requests || [];
  
  // الحصول على معلومات المستخد�� الحالي
  const currentUser = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white z-30 overflow-y-auto pb-20" dir="rtl">
      {/* الهيدر */}
      <div className="bg-gradient-to-br from-[#01411C] to-[#065f41] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* زر المنيو */}
              <button
                onClick={onOpenRightSlider}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="text-2xl font-bold">عروضي</h1>
            </div>
            
            {/* زر العودة */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="bg-white border-b border-[#D4AF37]/20 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            {/* تبويب عروضي */}
            <button
              onClick={() => setActiveTab('my-offers')}
              className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
                activeTab === 'my-offers'
                  ? 'text-[#01411C]'
                  : 'text-[#065f41]/60 hover:text-[#065f41]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                <span>عروضي</span>
              </div>
              {activeTab === 'my-offers' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 right-0 left-0 h-1 bg-[#D4AF37]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>

            {/* تبويب العروض المقبولة */}
            <button
              onClick={() => setActiveTab('accepted-offers')}
              className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
                activeTab === 'accepted-offers'
                  ? 'text-[#01411C]'
                  : 'text-[#065f41]/60 hover:text-[#065f41]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>العروض المقولة</span>
              </div>
              {activeTab === 'accepted-offers' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 right-0 left-0 h-1 bg-[#D4AF37]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="container mx-auto px-4 py-6 pb-24 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <AnimatePresence mode="wait">
          {/* محتوى عروضي */}
          {activeTab === 'my-offers' && (
            <motion.div
              key="my-offers-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <MyOffersView />
            </motion.div>
          )}

          {/* محتوى العروض المقبولة */}
          {activeTab === 'accepted-offers' && (
            <motion.div
              key="accepted-offers-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <AcceptedOffersView userId={userId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* الشريط السفلي الثابت */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4AF37]/20 shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* الرئيسية - أقصى اليمين */}
            <button
              onClick={onClose}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
            >
              <Home className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#065f41]">الرئيسية</span>
            </button>

            {/* إدارة العملاء */}
            <button
              onClick={onOpenCRM}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#065f41]">إدارة العملاء</span>
            </button>

            {/* العروض */}
            <button
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-[#f0fdf4]"
            >
              <FileText className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#01411C] font-semibold">عروضي</span>
            </button>

            {/* التحليلات */}
            <button
              onClick={() => console.log('التحليلات')}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#065f41]">التحليلات</span>
            </button>

            {/* المزيد - أقصى اليسار */}
            <button
              onClick={onOpenRightSlider}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#f0fdf4] transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-[#01411C]" />
              <span className="text-xs text-[#065f41]">المزيد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}