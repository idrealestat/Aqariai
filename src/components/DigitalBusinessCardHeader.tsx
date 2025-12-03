/*
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                          🎴 DIGITAL BUSINESS CARD HEADER - بطاقة العمل الرقمية للهيدر                      ║
║──────────────────────────────────────────────────────────────────────────────────────────────────────────────║
║  بطاقة عمل رقمية قابلة للقلب مع باركود vCard وتحميل PDF                                                   ║
║  مرتبطة بالكامل ببطاقة الأعمال الرقمية (business-card-profile)                                          ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
*/

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, Printer, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SubscriptionTierSlab, useSubscriptionTier } from "./SubscriptionTierSlab";
import logoImage from "figma:asset/3821378221125549f243ee4345da40c6457c2dae.png";

interface DigitalBusinessCardHeaderProps {
  currentUser?: {
    name: string;
    email?: string;
    phone?: string;
    type?: string;
    plan?: string;
    profileImage?: string;
    id?: string;
    companyName?: string;
    licenseNumber?: string;
    city?: string;
    district?: string;
    birthDate?: string;
    whatsapp?: string;
  } | null;
}

export const DigitalBusinessCardHeader: React.FC<DigitalBusinessCardHeaderProps> = ({
  currentUser
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  // 📌 تحميل البيانات من localStorage (من بطاقة الأعمال الرقمية)
  useEffect(() => {
    if (!currentUser) return;

    const STORAGE_KEY = `business_card_${currentUser.id || currentUser.phone || 'default'}`;
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setCardData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات البطاقة:', error);
    }
  }, [currentUser]);

  // 📌 حساب معلومات الباقة
  const { accountType, tierLevel, tierLabel } = useSubscriptionTier(
    currentUser?.type,
    currentUser?.plan
  );

  // 📌 حساب تاريخ انتهاء رخصة فال
  const calculateFalExpiry = () => {
    if (cardData?.falExpiry) {
      const expiryDate = new Date(cardData.falExpiry);
      const today = new Date();
      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { date: cardData.falExpiry, daysLeft };
    }
    return { date: null, daysLeft: null };
  };

  // 📌 حساب تاريخ انتهاء الاشتراك (مثال: 6 أشهر من الآن)
  const subscriptionExpiry = new Date();
  subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 6);

  // 📌 تحديد نوع العضوية
  const membershipType = currentUser?.plan === "pro" || currentUser?.plan === "enterprise" ? "expert" : "professional";
  const membershipLabel = membershipType === "expert" ? "عضو خبير" : "عضو محترف";

  // 📌 البيانات المستخدمة للعرض
  const displayName = cardData?.userName || currentUser?.name || "مستخدم تجريبي";
  const displayCompany = cardData?.companyName || currentUser?.companyName || currentUser?.name || "";
  const displayJob = cardData?.jobTitle || "وسيط عقاري";
  const displayEmail = cardData?.email || currentUser?.email || "";
  const displayPhone = cardData?.primaryPhone || currentUser?.phone || "";
  const displayWhatsapp = cardData?.whatsappPhone || currentUser?.whatsapp || currentUser?.phone || "";
  const displayFalLicense = cardData?.falLicense || currentUser?.licenseNumber || "";
  const displayWebsite = cardData?.domain || "";
  const displayLogo = cardData?.logoImage || "";
  const displayProfile = cardData?.profileImage || currentUser?.profileImage || "";
  const displayCity = currentUser?.city || "";
  const displayDistrict = currentUser?.district || "";
  const displayBirthDate = currentUser?.birthDate || "";
  const falExpiry = calculateFalExpiry();

  // 📌 إنشاء vCard للباركود
  const generateVCard = () => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${displayName}
ORG:${displayCompany}
TITLE:${displayJob}
TEL;TYPE=CELL:${displayPhone}
${displayWhatsapp && displayWhatsapp !== displayPhone ? `TEL;TYPE=WORK:${displayWhatsapp}` : ''}
EMAIL:${displayEmail}
URL:${displayWebsite}
END:VCARD`;
  };

  // 📌 تحميل البطاقة كصورة (محاكاة)
  const handleDownloadImage = () => {
    alert('📥 جاري تحميل البطاقة كصورة...\n(سيتم تفعيل هذه الميزة قريباً)');
  };

  // 📌 تحميل البطاقة كـ PDF (محاكاة)
  const handleDownloadPDF = () => {
    alert('📄 جاري تحميل البطاقة كـ PDF...\n(سيتم تفعيل هذه الميزة قريباً)');
  };

  // 📌 طباعة البطاقة
  const handlePrint = () => {
    window.print();
  };

  if (!currentUser) return null;

  return (
    <div 
      className="px-4 py-3 pt-6 relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* أزرار الإجراءات - فوق البطاقة */}
      {showActions && (
        <motion.div
          className="flex justify-center gap-2 mb-2 z-20 relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadImage();
            }}
          >
            <Download className="w-3 h-3 mr-1" />
            صورة
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadPDF();
            }}
          >
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              handlePrint();
            }}
          >
            <Printer className="w-3 h-3 mr-1" />
            طباعة
          </Button>
        </motion.div>
      )}

      {/* 🎴 البطاقة القابلة للقلب */}
      <div 
        className="relative w-full h-[180px] perspective-1000 mb-4"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 🔵 الوجه الأمامي */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-xl border-4 border-[#D4AF37] shadow-2xl overflow-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              backgroundImage: `url(${logoImage})`,
              backgroundSize: "40%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "white"
            }}
          >
            {/* طبقة شفافة فوق الخلفية */}
            <div className="absolute inset-0 bg-white/92" />

            <div className="relative z-10 p-3 h-full flex">
              {/* القسم الأيمن: صورة البروفايل + معلومات */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* صورة البروفايل - أقصى اليمين */}
                  <div className="flex items-start gap-2 mb-2">
                    <Avatar className="w-12 h-12 border-3 border-[#D4AF37] shadow-lg flex-shrink-0">
                      {displayProfile ? (
                        <AvatarImage src={displayProfile} alt={displayName} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-[#01411C] to-[#065f41] text-[#D4AF37] font-bold text-lg">
                        {displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* معلومات النص */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#01411C] text-base truncate">{displayName}</h3>
                      <p className="text-xs text-gray-600 truncate text-left">{displayJob}</p>
                      <p className="text-xs text-gray-700 font-medium truncate text-left">{displayCompany}</p>
                    </div>
                  </div>

                  {/* معلومات الاتصال - مضغوطة */}
                  <div className="space-y-0.5 text-[10px]">
                    {displayWebsite && (
                      <div className="flex items-center gap-1 text-[#01411C] truncate">
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate" dir="ltr">{displayWebsite}</span>
                      </div>
                    )}
                    {displayEmail && (
                      <div className="flex items-center gap-1 text-gray-700 truncate">
                        <span className="flex-shrink-0">📧</span>
                        <span className="truncate" dir="ltr">{displayEmail}</span>
                      </div>
                    )}
                    {displayFalLicense && (
                      <div className="flex items-center gap-1 text-gray-700 truncate">
                        <span className="flex-shrink-0">🪪</span>
                        <span className="truncate">رخصة: {displayFalLicense}</span>
                      </div>
                    )}
                    {displayPhone && (
                      <div className="flex items-center gap-1 text-gray-700 truncate">
                        <span className="flex-shrink-0">📱</span>
                        <span className="truncate" dir="ltr">{displayPhone}</span>
                      </div>
                    )}
                    {displayWhatsapp && displayWhatsapp !== displayPhone && (
                      <div className="flex items-center gap-1 text-gray-700 truncate">
                        <span className="flex-shrink-0">💬</span>
                        <span className="truncate" dir="ltr">{displayWhatsapp}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* شعار عقاري AI صغير - أسفل اليمين */}
                <div className="flex items-center gap-1">
                  <img src={logoImage} alt="Logo" className="w-3 h-3 opacity-60" />
                </div>
              </div>

              {/* القسم الأيسر: الباركود */}
              <div className="flex items-end justify-end">
                <div className="bg-white p-1 rounded border border-gray-300">
                  <svg width="50" height="50" className="opacity-80">
                    {/* محاكاة باركود QR */}
                    <rect width="50" height="50" fill="white"/>
                    <rect x="4" y="4" width="8" height="8" fill="black"/>
                    <rect x="16" y="4" width="8" height="8" fill="black"/>
                    <rect x="28" y="4" width="8" height="8" fill="black"/>
                    <rect x="40" y="4" width="6" height="8" fill="black"/>
                    <rect x="4" y="16" width="8" height="8" fill="black"/>
                    <rect x="28" y="16" width="8" height="8" fill="black"/>
                    <rect x="4" y="28" width="8" height="8" fill="black"/>
                    <rect x="16" y="28" width="8" height="8" fill="black"/>
                    <rect x="40" y="28" width="6" height="8" fill="black"/>
                    <rect x="4" y="40" width="8" height="6" fill="black"/>
                    <rect x="28" y="40" width="8" height="6" fill="black"/>
                  </svg>
                  <div className="text-[7px] text-center text-gray-500 mt-0.5">vCard</div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔴 الوجه الخلفي */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-xl border-4 border-[#D4AF37] shadow-2xl overflow-hidden bg-gradient-to-br from-[#01411C] via-[#065f41] to-[#01411C]"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="relative z-10 p-3 h-full flex flex-col items-center justify-center">
              {/* شعار عقاري AI - أعلى اليمين */}
              <div className="absolute top-2 right-2">
                <img src={logoImage} alt="Aqari AI" className="w-10 h-10 opacity-80" />
              </div>

              {/* شعار الشركة - وسط البطاقة */}
              <div className="flex-1 flex items-center justify-center">
                {displayLogo ? (
                  <img 
                    src={displayLogo} 
                    alt="Company Logo" 
                    className="max-w-[180px] max-h-[130px] object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border-4 border-[#D4AF37] flex items-center justify-center">
                    <span className="text-6xl font-bold text-[#D4AF37]">
                      {displayCompany.charAt(0) || displayName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 📊 معلومات الاشتراك والعضوية */}
      <div className="space-y-2 mt-6">
        {/* العضوية + تاريخ انتهاء الاشتراك */}
        <div className="flex items-center justify-between text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs">
              {membershipLabel}
            </Badge>
            <span className="text-white/80">العضوية</span>
          </div>
          <div className="text-white/80">
            الاشتراك ينتهي في: {subscriptionExpiry.toLocaleDateString('ar-SA')}
          </div>
        </div>

        {/* الباج الأصلي - SubscriptionTierSlab - أطول */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-md">
            <SubscriptionTierSlab 
              accountType={accountType}
              tierLevel={tierLevel}
              label={tierLabel}
              compact={false}
              animated={true}
            />
          </div>
        </div>

        {/* رخصة فال تنتهي خلال - العد التنازلي */}
        {falExpiry.date && (
          <div className="flex items-center justify-between text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
            <span className="text-white/80">🪪 رخصة فال تنتهي خلال</span>
            <span className={`font-bold ${falExpiry.daysLeft && falExpiry.daysLeft < 60 ? 'text-red-400' : 'text-green-400'}`}>
              {falExpiry.daysLeft ? `${falExpiry.daysLeft} يوم` : 'غير محدد'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalBusinessCardHeader;