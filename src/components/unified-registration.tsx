// 🔒🔒🔒 CRITICAL SECURITY NOTICE 🔒🔒🔒
// ⚠️  هذا الملف يحتوي على أقسام محمية ومقفلة نهائياً
// 🛡️  الأنواع الأربعة الأساسية (فرد، فريق، مكتب، شركة) مقفلة ومحمية
// 🚫 ممنوع منعاً باتاً التعديل على:
//    - أيقونات الأنواع الأربعة
//    - ألوان الأنواع الأربعة  
//    - نصوص الأنواع الأربعة
//    - وصف الأنواع الأربعة
//    - ترتيب الأنواع الأربعة
//    - سلوك الأنواع الأربعة
// 📝 هذا القفل سيبقى فعالاً حتى طلب إزالته صراحة
// 🔒🔒🔒 END SECURITY NOTICE 🔒🔒🔒

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  User, 
  Users, 
  Building, 
  Building2, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Crown,
  Gift,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Eye,
  Zap,
  Home,
  Component,
  TreePine
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GuestDemoButton } from "./guest-demo-button";

export type UserType = "individual" | "team" | "office" | "company";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  birthDate: string;
  type: UserType;
  companyName?: string;
  licenseNumber?: string;
  city: string;
  district: string;
  plan?: string;
  profileImage?: string;
  licenseImage?: string;
  role?: "admin" | "agent" | "viewer";
}

interface UnifiedRegistrationProps {
  onComplete: (userData: User) => void;
  onUserTypeSelect: (type: UserType) => void;
  userType: UserType;
  onNavigate?: (page: string) => void;
}

const SAUDI_CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران",
  "الطائف", "بريدة", "خميس مشيط", "حفر الباطن", "المبرز", "الهفوف", "حائل",
  "نجران", "الجبيل", "ينبع", "القطيف", "صفوى", "العلا", "سكاكا", "عرعر",
  "تبوك", "أبها", "الباحة", "جازان", "القنفذة", "الوجه"
];

export function UnifiedRegistration({ onComplete, onUserTypeSelect, userType, onNavigate }: UnifiedRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    birthDate: "",
    companyName: "",
    licenseNumber: "",
    city: "",
    district: "",
    profileImage: "",
    licenseImage: ""
  });

  // 🔒 LOCKED SECTION - DO NOT MODIFY ANYTHING BELOW THIS LINE 🔒
  // ⚠️  هذا القسم مقفل نهائياً - ممنوع التعديل أو الحذف أو الإضافة
  // 🛡️  الأنواع الأربعة الأساسية محمية ولا يجب المساس بها مطلقاً
  // 🚫 لا تقم بتغيير: الأيقونات، الألوان، النصوص، الوصف، أو أي خاصية
  // 📝 هذا القفل سيبقى حتى طلب إزالته صراحة
  // 🔒 LOCKED SECTION START 🔒
  const accountTypes = [
    {
      id: "individual" as const,
      label: "فرد",
      icon: User,
      description: "وسيط عقاري يعمل بشكل مستقل",
      color: "#10B981",
      // ❌ لا يدعم تعدد المستخدمين
      supportsTeam: false,
      maxUsers: 1,
      teamFeatures: []
    },
    {
      id: "team" as const,
      label: "فريق",
      icon: Users,
      description: "مجموعة صغيرة من الوسطاء يعملون معاً",
      color: "#3B82F6",
      // ✅ يدعم تعدد المستخدمين (الزملاء)
      supportsTeam: true,
      maxUsers: 5,
      teamFeatures: ["إدارة أساسية للزملاء", "مشاركة العملاء", "تقارير الفريق"]
    },
    {
      id: "office" as const,
      label: "مكتب",
      icon: Building,
      description: "مكتب عقاري متكامل",
      color: "#F59E0B",
      // ✅ يدعم تعدد المستخدمين (الزملاء)  
      supportsTeam: true,
      maxUsers: 20,
      teamFeatures: ["إدارة متقدمة للموظفين", "صلاحيات متدرجة", "تقارير شاملة"]
    },
    {
      id: "company" as const,
      label: "شركة",
      icon: Building2,
      description: "شركة عقارية كبرى متعددة الفروع",
      color: "#8B5CF6",
      // ✅ يدعم تعدد المستخدمين (الزملاء)
      supportsTeam: true,
      maxUsers: 100,
      teamFeatures: ["إدارة شاملة للشركة", "متعدد الفروع", "تحليلات متقدمة"]
    }
  ];
  // 🔒 LOCKED SECTION END 🔒
  // ⚠️  نهاية القسم المقفل - لا تعدل أي شيء أعلاه ⚠️

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const handleCitySelect = (value: string) => {
    setFormData(prev => ({ ...prev, city: value }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: "" }));
    }
  };

  // 🔒 LOCKED FUNCTION - PROTECTED BEHAVIOR 🔒
  // ⚠️  هذه الدالة تتعامل مع الأنواع المحمية - لا تعدل السلوك
  const handleAccountTypeSelect = (type: UserType) => {
    // 🛡️ Protected: الأنواع الأربعة الأساسية محمية
    // 🚫 لا تقم بتغيير منطق التعامل مع: individual, team, office, company
    onUserTypeSelect(type);
    
    // للوسطاء العقاريين - متابعة عملية التسجيل العادية
    // 🔒 LOCKED: هذا السلوك محمي ولا يجب تعديله
    setCurrentStep(2);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم الكامل مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الجوال مطلوب";
    } else if (!/^05\d{8}$/.test(formData.phone)) {
      newErrors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويكون 10 أرقام";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "تاريخ الميلاد مطلوب";
    }

    if (!formData.city) {
      newErrors.city = "المدينة مطلوبة";
    }

    if (!formData.district.trim()) {
      newErrors.district = "الحي مطلوب";
    }

    // التحقق من الحقول الإضافية حسب نوع الحساب
    if ((userType === "team" || userType === "office" || userType === "company") && !formData.companyName.trim()) {
      const label = userType === "company" ? "اسم الشركة" : 
                   userType === "office" ? "اسم المكتب" : "اسم الفريق";
      newErrors.companyName = `${label} مطلوب`;
    }

    if (userType !== "team" && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "رقم الرخصة العقارية مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        birthDate: formData.birthDate,
        type: userType,
        companyName: formData.companyName || undefined,
        licenseNumber: formData.licenseNumber || undefined,
        city: formData.city,
        district: formData.district,
        profileImage: formData.profileImage || undefined,
        licenseImage: formData.licenseImage || undefined
      };

      setTimeout(() => {
        onComplete(userData);
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ submit: "حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى." });
    }
  };

  const handleImageUpload = (type: 'profile' | 'license') => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (type === 'profile') {
            setFormData(prev => ({ ...prev, profileImage: imageUrl }));
          } else {
            setFormData(prev => ({ ...prev, licenseImage: imageUrl }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "اختيار نوع الحساب";
      case 2: return "بيانات الوسيط";
      default: return "";
    }
  };

  const selectedAccountType = accountTypes.find(type => type.id === userType);

  // دخول كضيف بدون تسجيل
  const handleGuestLogin = () => {
    const guestUser: User = {
      id: "guest-" + Date.now(),
      name: "مستخدم ضيف",
      email: "guest@demo.com",
      phone: "0501234567",
      whatsapp: "0501234567",
      birthDate: "1990-01-01",
      type: "individual",
      city: "الرياض",
      district: "النرجس",
      plan: "تجريبي",
      planExpiry: "2024-12-31",
      licenseExpiry: "2025-12-31",
      rating: 4.5
    };
    
    onComplete(guestUser);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 touch-scroll-smooth hide-scrollbar" 
      dir="rtl"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)'
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-2" style={{
          borderColor: '#D4AF37',
          boxShadow: '0 25px 50px -12px rgba(1, 65, 28, 0.3)'
        }}>
          {/* Header */}
          <CardHeader className="text-center pb-6">
            {/* أيقونة دائرية */}
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-4" style={{
                background: 'linear-gradient(135deg, #01411C 0%, #065f41 100%)',
                borderColor: '#D4AF37',
                boxShadow: '0 8px 25px rgba(1, 65, 28, 0.4)'
              }}>
                <Building2 className="w-10 h-10 text-[#D4AF37]" />
              </div>
            </motion.div>

            {/* العنوان */}
            <CardTitle className="text-3xl md:text-4xl font-black text-[#01411C] mb-4">
              انضم إلى وسِيطي
            </CardTitle>
            
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-6">
              نظام إدارة شامل للوسطاء العقاريين في المملكة العربية السعودية
            </p>

            {/* شريط العرض المميز */}
            <motion.div 
              className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full border-2"
              style={{
                background: 'linear-gradient(135deg, #01411C 0%, #065f41 100%)',
                borderColor: '#D4AF37',
                color: 'white',
                boxShadow: '0 4px 15px rgba(1, 65, 28, 0.3)'
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Crown className="w-5 h-5" style={{ color: '#D4AF37' }} />
              <span className="font-bold text-lg">🎉 أول شهر مجاني لجميع الباقات</span>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-[#01411C] border-[#D4AF37] text-white shadow-lg' : 'border-gray-300 text-gray-300'
                }`}>
                  {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
                </div>
                <div className={`w-16 h-2 rounded-full transition-all duration-500 ${
                  currentStep > 1 ? 'bg-[#01411C]' : 'bg-gray-300'
                }`}></div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-[#01411C] border-[#D4AF37] text-white shadow-lg' : 'border-gray-300 text-gray-300'
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Step Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#01411C] mb-3">{getStepTitle()}</h2>
              {currentStep === 1 && (
                <p className="text-gray-600 text-lg">اختر نوع الحساب الذي يناسب نشاطك العقاري</p>
              )}
              {currentStep === 2 && selectedAccountType && (
                <div className="flex items-center justify-center gap-2">
                  <Badge className="px-4 py-2 text-base" style={{ 
                    backgroundColor: selectedAccountType.color, 
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}>
                    <selectedAccountType.icon className="w-5 h-5 ml-2" />
                    {selectedAccountType.label}
                  </Badge>
                </div>
              )}
            </div>

            {/* Step 1: Account Type Selection - Grid 2x2 */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  className="space-y-8"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Grid 2x2: الصف الأول (فرد + فريق) والصف الثاني (مكتب + شركة) */}
                  <div className="max-w-4xl mx-auto">
                    
                    {/* 🔒 LOCKED UI SECTION - PROTECTED ACCOUNT TYPES 🔒 */}
                    {/* ⚠️  هذا القسم مقفل نهائياً - ممنوع التعديل */}
                    {/* 🛡️  UI الأنواع الأربعة الأساسية محمي */}
                    {/* 🚫 لا تقم بتغيير التصميم أو الألوان أو الترتيب */}
                    
                    {/* الصف الأول: فرد وفريق - LOCKED */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                      {[
                        { type: "individual", label: "فرد", icon: User },
                        { type: "team", label: "فريق", icon: Users }
                      ].map((option) => (
                        <motion.button
                          key={option.type}
                          type="button"
                          onClick={() => handleAccountTypeSelect(option.type as any)}
                          className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-3 transition-all duration-300 min-h-[120px] md:min-h-[140px] hover:shadow-xl touch-manipulation btn-touch ${
                            userType === option.type
                              ? "shadow-2xl transform scale-105"
                              : "hover:transform hover:scale-102"
                          }`}
                          style={{
                            backgroundColor: userType === option.type ? "#01411C" : "#ffffff",
                            borderColor: userType === option.type ? "#D4AF37" : "#e2e8f0",
                            color: userType === option.type ? "white" : "#01411C",
                            borderWidth: '3px',
                            boxShadow: userType === option.type 
                              ? '0 20px 40px rgba(1, 65, 28, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <option.icon
                            className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4"
                            style={{
                              color: userType === option.type ? "#D4AF37" : "#01411C"
                            }}
                          />
                          <span className="text-base md:text-xl font-bold text-center leading-tight">
                            {option.label}
                          </span>
                          {userType === option.type && (
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37] mt-2 animate-pulse" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* الصف الثاني: مكتب وشركة - LOCKED */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                      {[
                        { type: "office", label: "مكتب", icon: Building },
                        { type: "company", label: "شركة", icon: Building2 }
                      ].map((option) => (
                        <motion.button
                          key={option.type}
                          type="button"
                          onClick={() => handleAccountTypeSelect(option.type as any)}
                          className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-3 transition-all duration-300 min-h-[120px] md:min-h-[140px] hover:shadow-xl touch-manipulation btn-touch ${
                            userType === option.type
                              ? "shadow-2xl transform scale-105"
                              : "hover:transform hover:scale-102"
                          }`}
                          style={{
                            backgroundColor: userType === option.type ? "#01411C" : "#ffffff",
                            borderColor: userType === option.type ? "#D4AF37" : "#e2e8f0",
                            color: userType === option.type ? "white" : "#01411C",
                            borderWidth: '3px',
                            boxShadow: userType === option.type 
                              ? '0 20px 40px rgba(1, 65, 28, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <option.icon
                            className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4"
                            style={{
                              color: userType === option.type ? "#D4AF37" : "#01411C"
                            }}
                          />
                          <span className="text-base md:text-xl font-bold text-center leading-tight">
                            {option.label}
                          </span>
                          {userType === option.type && (
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37] mt-2 animate-pulse" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                    {/* 🔒 END OF LOCKED UI SECTION 🔒 */}
                    {/* ⚠️  نهاية UI المحمي للأنواع الأربعة الأساسية ⚠️ */}

                    {/* الصف الثالث: أصحاب العروض والطلبات + المطورين العقاريين */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                      {/* اطلب وسيطك */}
                      <motion.button
                        onClick={() => onNavigate?.('home-owners')}
                        className="relative overflow-hidden rounded-2xl p-4 md:p-6 text-right transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2"
                        style={{
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          borderColor: '#D4AF37',
                          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                        }}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-end mb-3">
                            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border-2 border-[#D4AF37]">
                              <Home className="w-6 h-6 md:w-8 md:h-8 text-[#01411C]" />
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-[#01411C] mb-2">
                            اطلب وسيطك
                          </h3>
                          <p className="text-xs md:text-sm text-[#065f41] leading-relaxed">
                            للبائعين والمشترين والمؤجرين والمستأجرين
                          </p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #f1c40f 100%)' }}></div>
                      </motion.button>

                      {/* المطورين العقاريين */}
                      <motion.button
                        onClick={() => onNavigate?.('developers')}
                        className="relative overflow-hidden rounded-2xl p-4 md:p-6 text-right transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2"
                        style={{
                          background: 'linear-gradient(135deg, #fffef7 0%, #fef3c7 100%)',
                          borderColor: '#D4AF37',
                          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                        }}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-end mb-3">
                            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border-2 border-[#D4AF37]">
                              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-[#01411C]" />
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-[#01411C] mb-2">
                            المطورين العقاريين
                          </h3>
                          <p className="text-xs md:text-sm text-[#065f41] leading-relaxed">
                            شركات التطوير والاستثمار العقاري
                          </p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #f1c40f 100%)' }}></div>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* وصف النوع المختار */}
                  {userType && (
                    <motion.div 
                      className="text-center p-6 rounded-xl border-2"
                      style={{
                        backgroundColor: '#f0fdf4',
                        borderColor: '#D4AF37',
                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.15)'
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-lg font-medium text-[#01411C]">
                        {accountTypes.find(type => type.id === userType)?.description}
                      </p>
                    </motion.div>
                  )}
                  
                  {/* أيقونة الدخول السريع للوسطاء المحترفين */}
                  <div className="text-center mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 mb-4 text-sm">أو للوسطاء المحترفين فقط:</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <GuestDemoButton onClick={handleGuestLogin} />
                      
                      {/* زر إدارة هيكل التطبيق الشجري - الزر رقم 31 */}
                      <motion.button
                        onClick={() => onNavigate?.("component-tree-manager")}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] hover:from-[#f1c40f] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation btn-touch group"
                        style={{
                          borderColor: '#01411C',
                          color: '#01411C'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#01411C] text-white shadow-md group-hover:shadow-lg transition-all">
                          <Component className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm">إدارة هيكل التطبيق</span>
                        <TreePine className="w-4 h-4 text-[#01411C] animate-pulse" />
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      🌲 إدارة متقدمة لهيكل وتنظيم التطبيق
                    </p>
                  </div>


                </motion.div>
              )}

              {/* Step 2: User Information */}
              {currentStep === 2 && (
                <motion.div 
                  className="space-y-6 max-w-3xl mx-auto"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* الاسم الكامل */}
                  <div>
                    <Label htmlFor="name" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                      <User className="w-5 h-5" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      className={`text-lg h-14 border-2 ${errors.name ? 'border-red-500' : 'border-[#D4AF37]'}`}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* اسم الشركة/المكتب/الفريق */}
                  {(userType === "team" || userType === "office" || userType === "company") && (
                    <div>
                      <Label htmlFor="companyName" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        {userType === "company" ? "اسم الشركة" : 
                         userType === "office" ? "اسم المكتب" : "اسم الفريق"} *
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder={
                          userType === "company" ? "أدخل اسم الشركة" : 
                          userType === "office" ? "أدخل اسم المكتب" : "أدخل اسم الفريق"
                        }
                        className={`text-lg h-14 border-2 ${errors.companyName ? 'border-red-500' : 'border-[#D4AF37]'}`}
                        required
                      />
                      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                    </div>
                  )}

                  {/* رقم الرخصة */}
                  {userType !== "team" && (
                    <div>
                      <Label htmlFor="licenseNumber" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <Badge className="w-5 h-5" />
                        رقم الرخصة العقارية *
                      </Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم الرخصة العقارية"
                        className={`text-lg h-14 border-2 ${errors.licenseNumber ? 'border-red-500' : 'border-[#D4AF37]'}`}
                        required
                      />
                      {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                    </div>
                  )}

                  {/* الهاتف والواتساب */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        رقم الجوال *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="05xxxxxxxx"
                        className={`text-lg h-14 border-2 ${errors.phone ? 'border-red-500' : 'border-[#D4AF37]'}`}
                        required
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        رقم الواتساب
                      </Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="05xxxxxxxx (اختياري)"
                        className="text-lg h-14 border-2 border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* البريد الإلكتروني */}
                  <div>
                    <Label htmlFor="email" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@domain.com"
                      className={`text-lg h-14 border-2 ${errors.email ? 'border-red-500' : 'border-[#D4AF37]'}`}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* تاريخ الميلاد */}
                  <div>
                    <Label htmlFor="birthDate" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      تاريخ الميلاد *
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`text-lg h-14 border-2 ${errors.birthDate ? 'border-red-500' : 'border-[#D4AF37]'}`}
                      required
                    />
                    {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                  </div>

                  {/* المدينة والحي */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        المدينة *
                      </Label>
                      <Select value={formData.city} onValueChange={handleCitySelect}>
                        <SelectTrigger className={`text-lg h-14 border-2 ${errors.city ? 'border-red-500' : 'border-[#D4AF37]'}`}>
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {SAUDI_CITIES.map((city) => (
                            <SelectItem key={city} value={city} className="text-lg">{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="district" className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        الحي *
                      </Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="أدخل اسم الحي"
                        className={`text-lg h-14 border-2 ${errors.district ? 'border-red-500' : 'border-[#D4AF37]'}`}
                        required
                      />
                      {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                    </div>
                  </div>

                  {/* رفع الصور */}
                  <div className="space-y-6">
                    {/* صورة شخصية */}
                    <div>
                      <Label className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        صورة شخصية (اختياري)
                      </Label>
                      <div 
                        onClick={() => handleImageUpload('profile')}
                        className="border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-gray-50 touch-manipulation btn-touch"
                        style={{ borderColor: '#D4AF37' }}
                      >
                        {formData.profileImage ? (
                          <div className="space-y-3">
                            <img 
                              src={formData.profileImage} 
                              alt="صورة شخصية" 
                              className="w-24 h-24 rounded-full mx-auto object-cover border-4" 
                              style={{ borderColor: '#D4AF37' }}
                            />
                            <p className="text-base text-green-600 font-medium">تم رفع الصورة بنجاح</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Camera className="w-12 h-12 text-[#D4AF37] mx-auto" />
                            <p className="text-base text-gray-600">اضغط لرفع صورة شخصية</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* صورة الرخصة */}
                    {userType !== "team" && (
                      <div>
                        <Label className="text-[#01411C] mb-3 block text-lg font-medium flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          صورة الرخصة العقارية (اختياري)
                        </Label>
                        <div 
                          onClick={() => handleImageUpload('license')}
                          className="border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-gray-50 touch-manipulation btn-touch"
                          style={{ borderColor: '#D4AF37' }}
                        >
                          {formData.licenseImage ? (
                            <div className="space-y-3">
                              <img 
                                src={formData.licenseImage} 
                                alt="صورة الرخصة" 
                                className="w-32 h-24 mx-auto object-cover rounded-lg border-2" 
                                style={{ borderColor: '#D4AF37' }}
                              />
                              <p className="text-base text-green-600 font-medium">تم رفع صورة الرخصة بنجاح</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Upload className="w-12 h-12 text-[#D4AF37] mx-auto" />
                              <p className="text-base text-gray-600">اضغط لرفع صورة الرخصة العقارية</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* أزرار التنقل */}
                  <div className="flex items-center justify-between pt-8">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="px-8 py-3 text-lg border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4] touch-manipulation btn-touch"
                    >
                      <ArrowLeft className="w-5 h-5 ml-2" />
                      السابق
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-3 text-lg bg-[#01411C] border-2 border-[#D4AF37] text-white hover:bg-[#065f41] disabled:opacity-50 touch-manipulation btn-touch"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                          جاري التسجيل...
                        </>
                      ) : (
                        <>
                          إنشاء الحساب
                          <ArrowRight className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* رسالة خطأ عامة */}
                  {errors.submit && (
                    <div className="text-center mt-4">
                      <p className="text-red-500 text-lg font-medium">{errors.submit}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}