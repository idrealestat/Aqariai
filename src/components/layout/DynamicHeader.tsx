/*
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                              🎨 DYNAMIC HEADER - هيدر ديناميكي موحد للتطبيق                               ║
║──────────────────────────────────────────────────────────────────────────────────────────────────────────────║
║  مكون موحد يطبق على جميع صفحات التطبيق مع دعم كامل لسبائك الباقات                                        ║
║  يتضمن: معلومات المستخدم، تقييمات، رخصة فال، نوع العضوية، تاريخ الانتهاء                                ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

import React from "react";
import { motion } from "motion/react";
import { Star, Crown, CheckCircle, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SubscriptionTierSlab, useSubscriptionTier } from "../SubscriptionTierSlab";
import { NotificationSystem } from "../notifications/NotificationSystem";

interface DynamicHeaderProps {
  title?: string;
  subtitle?: string;
  currentUser?: {
    name: string;
    email?: string;
    phone?: string;
    type?: string;
    plan?: string;
    profileImage?: string;
  } | null;
  showUserProfile?: boolean;
  showTierSlab?: boolean;
  showRating?: boolean;
  showLicense?: boolean;
  showMembership?: boolean;
  showSubscriptionExpiry?: boolean;
  showNotifications?: boolean;
  onNavigateToOffer?: (offerId: string, offerType: 'offer' | 'request') => void;
  customContent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  compact?: boolean;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({
  title = "القائمة الرئيسية",
  subtitle,
  currentUser,
  showUserProfile = true,
  showTierSlab = true,
  showRating = true,
  showLicense = true,
  showMembership = true,
  showSubscriptionExpiry = true,
  showNotifications = true,
  onNavigateToOffer,
  customContent,
  backgroundColor = "from-[#01411C] via-[#065f41] to-[#01411C]",
  textColor = "text-white",
  className = "",
  compact = false
}) => {
  // حساب معلومات الباقة
  const { accountType, tierLevel, tierLabel } = useSubscriptionTier(
    currentUser?.type,
    currentUser?.plan
  );

  // حساب تاريخ انتهاء رخصة فال (مثال)
  const falLicenseExpiry = new Date();
  falLicenseExpiry.setDate(falLicenseExpiry.getDate() + 45); // 45 يوم من الآن
  const daysLeft = Math.ceil((falLicenseExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 60; // أقل من شهرين

  // حساب تاريخ انتهاء الاشتراك
  const subscriptionExpiry = new Date();
  subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 6); // 6 أشهر من الآن

  // تحديد نوع العضوية
  const membershipType = currentUser?.plan === "pro" || currentUser?.plan === "enterprise" ? "expert" : "professional";
  const membershipLabel = membershipType === "expert" ? "عضو خبير" : "عضو محترف";
  const membershipColor = membershipType === "expert" ? "from-[#D4AF37] to-[#f1c40f]" : "from-gray-400 to-gray-500";

  // تقييم العملاء (مثال - يمكن أن يأتي من API)
  const customerRating = 4.7;

  const paddingClass = compact ? "px-4 py-3 pt-6" : "px-6 py-4 pt-16";

  return (
    <div 
      className={`
        ${paddingClass}
        bg-gradient-to-r ${backgroundColor} 
        ${textColor} 
        relative overflow-hidden 
        dynamic-header
        ${className}
      `}
    >
      {/* خلفية متحركة ديناميكية */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* العنوان الرئيسي */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-white/70 mt-1">{subtitle}</p>
        )}
      </div>

      {/* معلومات المستخدم الكاملة */}
      {showUserProfile && currentUser && (
        <div className="space-y-3 mb-4 relative z-10">
          <motion.div 
            className="bg-white/10 rounded-xl p-4 border-2 border-[#D4AF37] backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar className="w-16 h-16 border-3 border-[#D4AF37] shadow-lg">
                  {currentUser.profileImage ? (
                    <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] text-[#01411C] font-bold text-xl">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* مؤشر الحالة - متصل */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                {/* اسم المستخدم */}
                <div className="font-bold text-white text-lg">{currentUser.name}</div>
                {/* ايميل المستخدم */}
                <div className="text-sm text-white/70 mb-2">
                  {currentUser.email || currentUser.phone || "user@waseety.com"}
                </div>

                {/* تقييمات العملاء بالنجوم */}
                {showRating && (
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(customerRating)
                            ? "text-[#D4AF37] fill-current"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                    <span className="text-[#D4AF37] text-sm font-bold mr-1">
                      {customerRating}
                    </span>
                    <span className="text-white/60 text-xs">(مراجعات العملاء)</span>
                  </div>
                )}
              </div>
            </div>

            {/* سبيكة الباقة المصغرة */}
            {showTierSlab && (
              <div className="mb-3">
                <SubscriptionTierSlab
                  accountType={accountType}
                  tierLevel={tierLevel}
                  label={tierLabel}
                  compact={true}
                  animated={false}
                />
              </div>
            )}

            {/* رخصة فال مع العد التنازلي */}
            {showLicense && (
              <div className="mb-2 p-2 rounded-lg bg-white/5 border border-[#D4AF37]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isExpiringSoon ? (
                      <AlertCircle className="w-4 h-4 text-red-300" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    )}
                    <div className="text-xs text-white/70">رخصة فال تنتهي خلال:</div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      isExpiringSoon ? "text-red-300 animate-pulse" : "text-[#D4AF37]"
                    }`}
                  >
                    {daysLeft} يوم
                  </div>
                </div>
              </div>
            )}

            {/* نوع العضوية */}
            {showMembership && (
              <div className="mb-2 text-center">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${membershipColor} text-white shadow-lg`}
                >
                  {membershipType === "expert" ? (
                    <Crown className="w-3 h-3" />
                  ) : (
                    <Star className="w-3 h-3" />
                  )}
                  {membershipLabel}
                </div>
              </div>
            )}

            {/* تاريخ انتهاء الاشتراك */}
            {showSubscriptionExpiry && (
              <div className="text-center pt-2 border-t border-white/10">
                <div className="text-white/70 text-xs mb-1">الاشتراك ينتهي في:</div>
                <div className="text-[#D4AF37] text-sm font-bold">
                  {subscriptionExpiry.toLocaleDateString("ar-SA")}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* نظام الإشعارات */}
      {showNotifications && currentUser && (
        <div className="absolute top-4 left-4 z-20">
          <NotificationSystem 
            currentUser={currentUser}
            onNavigateToOffer={onNavigateToOffer} 
          />
        </div>
      )}

      {/* محتوى مخصص إضافي */}
      {customContent && (
        <div className="relative z-10">
          {customContent}
        </div>
      )}
    </div>
  );
};

// مكون مصغر للبطاقة المصغرة
interface MiniUserCardProps {
  currentUser?: {
    name: string;
    email?: string;
    phone?: string;
    type?: string;
    plan?: string;
    profileImage?: string;
  } | null;
  onClick?: () => void;
}

export const MiniUserCard: React.FC<MiniUserCardProps> = ({ currentUser, onClick }) => {
  if (!currentUser) return null;

  const { accountType, tierLevel, tierLabel } = useSubscriptionTier(
    currentUser?.type,
    currentUser?.plan
  );

  return (
    <motion.div
      className="bg-white/10 rounded-lg p-2 border border-[#D4AF37]/30 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10 border-2 border-[#D4AF37]">
          {currentUser.profileImage ? (
            <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] text-[#01411C] font-bold text-sm">
            {currentUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-bold truncate">{currentUser.name}</div>
          <div className="mt-1">
            <SubscriptionTierSlab
              accountType={accountType}
              tierLevel={tierLevel}
              label={tierLabel}
              compact={true}
              animated={false}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicHeader;