import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Phone, CreditCard, Calendar, Award, Building2, FileCheck, HelpCircle, TrendingUp, LogOut, User } from "lucide-react";

interface OwnerRightSliderProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function OwnerRightSlider({ isOpen, onClose, user, onNavigate, onLogout }: OwnerRightSliderProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  // حساب العد التنازلي للاشتراك
  useEffect(() => {
    if (!user?.subscriptionEndDate) return;

    const calculateTimeRemaining = () => {
      const endDate = new Date(user.subscriptionEndDate);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining({ days, hours, minutes });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // تحديث كل دقيقة

    return () => clearInterval(interval);
  }, [user?.subscriptionEndDate]);

  const menuItems = [
    {
      id: 'appraisers',
      label: 'مقيمين عقاريين',
      icon: Award,
      onClick: () => {
        console.log('مقيمين عقاريين');
        onClose();
      }
    },
    {
      id: 'engineering-offices',
      label: 'مكاتب هندسية',
      icon: Building2,
      onClick: () => {
        console.log('مكاتب هندسية');
        onClose();
      }
    },
    {
      id: 'property-inspection',
      label: 'فحص العقار',
      icon: FileCheck,
      onClick: () => {
        console.log('فحص العقار');
        onClose();
      }
    },
    {
      id: 'advisory-tips',
      label: 'نصائح إرشادية',
      icon: HelpCircle,
      onClick: () => {
        console.log('نصائح إرشادية');
        onClose();
      }
    },
    {
      id: 'upgrade-subscription',
      label: 'رفع باقة الاشتراك',
      icon: TrendingUp,
      onClick: () => {
        console.log('رفع باقة الاشتراك');
        onClose();
      }
    },
    {
      id: 'logout',
      label: 'تسجيل خروج',
      icon: LogOut,
      onClick: () => {
        if (onLogout) {
          onLogout();
        }
        onClose();
      },
      danger: true
    }
  ];

  // بيانات تجريبية للعميل
  const customerData = {
    name: user?.fullName || user?.name || 'عميل تجريبي',
    nationalId: user?.nationalId || '1234567890',
    phone: user?.phone || '0501234567',
    rating: user?.rating || 4.5,
    subscriptionPlan: user?.subscriptionPlan || 'الباقة الأساسية',
    subscriptionStartDate: user?.subscriptionStartDate || new Date().toISOString(),
    subscriptionEndDate: user?.subscriptionEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية الداكنة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
          />

          {/* السلايدر */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] shadow-2xl z-[9999] overflow-y-auto"
            dir="rtl"
          >
            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white border-2 border-[#D4AF37] transition-all z-10"
            >
              <X className="w-5 h-5 text-[#01411C]" />
            </button>

            {/* بطاقة معلومات العميل */}
            <div className="p-6 bg-gradient-to-br from-[#01411C] to-[#065f41] text-white">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-[#D4AF37]">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{customerData.name}</h2>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(customerData.rating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-white/40'
                        }`}
                      />
                    ))}
                    <span className="text-sm mr-2">({customerData.rating})</span>
                  </div>
                </div>
              </div>

              {/* معلومات الاتصال */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs text-white/70">رقم بطاقة الأحوال</p>
                    <p className="font-medium">{customerData.nationalId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs text-white/70">رقم الجوال</p>
                    <p className="font-medium">{customerData.phone}</p>
                  </div>
                </div>
              </div>

              {/* باقة الاشتراك */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <p className="text-sm font-medium">باقة الاشتراك</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-lg font-bold text-[#D4AF37]">{customerData.subscriptionPlan}</p>
                  <p className="text-xs text-white/70 mt-1">
                    من {new Date(customerData.subscriptionStartDate).toLocaleDateString('ar-SA')} 
                    {' '}إلى{' '}
                    {new Date(customerData.subscriptionEndDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>

                {/* العد التنازلي */}
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/70 mb-2">الوقت المتبقي</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-center">
                      <div className="bg-[#D4AF37] text-[#01411C] rounded-lg px-3 py-2 font-bold text-lg min-w-[50px]">
                        {timeRemaining.days}
                      </div>
                      <p className="text-xs mt-1">يوم</p>
                    </div>
                    <span className="text-2xl font-bold">:</span>
                    <div className="text-center">
                      <div className="bg-[#D4AF37] text-[#01411C] rounded-lg px-3 py-2 font-bold text-lg min-w-[50px]">
                        {timeRemaining.hours}
                      </div>
                      <p className="text-xs mt-1">ساعة</p>
                    </div>
                    <span className="text-2xl font-bold">:</span>
                    <div className="text-center">
                      <div className="bg-[#D4AF37] text-[#01411C] rounded-lg px-3 py-2 font-bold text-lg min-w-[50px]">
                        {timeRemaining.minutes}
                      </div>
                      <p className="text-xs mt-1">دقيقة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* قائمة الخيارات */}
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#01411C] mb-4">الخدمات والإعدادات</h3>
              
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={item.onClick}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    item.danger
                      ? 'bg-red-50 hover:bg-red-100 border-2 border-red-200'
                      : 'bg-white hover:bg-[#f0fdf4] border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]'
                  } shadow-sm hover:shadow-md`}
                >
                  <div className={`p-2 rounded-lg ${
                    item.danger
                      ? 'bg-red-100'
                      : 'bg-gradient-to-br from-[#01411C] to-[#065f41]'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.danger ? 'text-red-600' : 'text-white'
                    }`} />
                  </div>
                  <span className={`flex-1 text-right font-medium ${
                    item.danger ? 'text-red-600' : 'text-[#01411C]'
                  }`}>
                    {item.label}
                  </span>
                  <div className={`text-xl ${
                    item.danger ? 'text-red-400' : 'text-[#D4AF37]'
                  }`}>
                    ←
                  </div>
                </motion.button>
              ))}
            </div>

            {/* تذييل */}
            <div className="p-6 text-center border-t border-[#D4AF37]/20">
              <p className="text-sm text-[#065f41]">
                نظام إدارة العروض والطلبات العقارية
              </p>
              <p className="text-xs text-[#065f41]/60 mt-1">
                © 2025 جميع الحقوق محفوظة
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
