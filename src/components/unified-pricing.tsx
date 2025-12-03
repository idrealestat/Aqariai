import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { SubscriptionTierSlab } from "./SubscriptionTierSlab";
import { 
  Check, 
  Crown, 
  Users, 
  Building2, 
  Sparkles, 
  ArrowLeft, 
  Building, 
  Star, 
  Zap, 
  Gift,
  User,
  Shield,
  Headphones,
  TrendingUp,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { UserType, User } from "./unified-registration";
import { SuccessConfirmation } from "./success-confirmation";

interface UnifiedPricingProps {
  onBack: () => void;
  onSelectPlan: (plan: string) => void;
  userType: UserType;
  user: User | null;
}

/**
 * صفحة التسعير الموحدة المتجاوبة بالكامل
 * PC: شبكة 3-4 بطاقات في صف
 * Mobile: بطاقة واحدة في صف مع مسافات محسنة
 */
export function UnifiedPricing({ onBack, onSelectPlan, userType, user }: UnifiedPricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelect = (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);
    
    if (planId === "enterprise" || planId.includes("custom")) {
      // نافذة منبثقة للباقات المخصصة
      setTimeout(() => {
        alert("📞 شكراً لاهتمامك! سيتم التواصل معك خلال 24 ساعة لتخصيص باقتك المثالية.");
        setIsLoading(false);
        setSelectedPlan(null);
      }, 1500);
      return;
    }
    
    // عرض صفحة النجاح أولاً
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 1000);
  };

  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case "individual": return "وسيط فردي";
      case "team": return "فريق عقاري";
      case "office": return "مكتب عقاري";
      case "company": return "شركة عقارية";
      default: return "وسيط";
    }
  };

  // باقات متخصصة لكل نوع حساب
  const getPlansByType = (type: UserType) => {
    switch (type) {
      case "individual":
        return [
          {
            id: "bronze",
            name: "البداية",
            icon: Sparkles,
            price: "0",
            period: "مجاني للأبد",
            popular: false,
            description: "مثالي للوسطاء الجدد",
            features: [
              "إدارة 5 عقارات",
              "قاعدة بيانات 20 عميل", 
              "تقويم أساسي",
              "500 ميجا تخزين",
              "نشر على منصة واحدة",
              "دعم فني أساسي",
              "تطبيق الموبايل",
              "تقارير شهرية"
            ],
            ctaText: "ابدأ مجاناً"
          },
          {
            id: "silver",
            name: "المحترف",
            icon: Crown,
            price: "149",
            period: "شهرياً",
            popular: true,
            description: "للوسطاء النشطين",
            features: [
              "إدارة 50 عقار",
              "قاعدة بيانات 200 عميل",
              "تقويم متقدم + تذكيرات",
              "5 جيجا تخزين",
              "نشر على 5 منصات",
              "AI وصف العقارات",
              "تقارير أسبوعية",
              "إحصائيات متقدمة",
              "دعم فني مميز",
              "تكامل WhatsApp Business",
              "بطاقة عمل رقمية",
              "حاسبة التمويل"
            ],
            ctaText: "اختر هذه الباقة"
          },
          {
            id: "gold",
            name: "الخبير",
            icon: Star,
            price: "299",
            period: "شهرياً",
            popular: false,
            description: "للوسطاء المتمرسين",
            features: [
              "عقارات غير محدودة",
              "عملاء غير محدودين",
              "تقويم ذكي + أتمتة",
              "20 جيجا تخزين",
              "نشر على جميع المنصات",
              "AI متقدم للأسعار والوصف",
              "تقارير يومية",
              "تحليلات السوق",
              "دعم فني أولوية",
              "موقع شخصي مخصص",
              "تكامل CRM متقدم",
              "أدوات التسويق الرقمي"
            ],
            ctaText: "اختر هذه الباقة"
          }
        ];
        
      case "team":
        return [
          {
            id: "dark",
            name: "الفريق الأساسي",
            icon: Users,
            price: "399",
            period: "شهرياً",
            popular: false,
            description: "للفرق الصغيرة (2-5 أعضاء)",
            features: [
              "حتى 5 أعضاء فريق",
              "إدارة 100 عقار مشترك",
              "قاعدة بيانات 500 عميل",
              "تقويم مشترك للفريق",
              "10 جيجا تخزين مشترك",
              "لوحة تحكم موحدة",
              "تقارير الفريق",
              "إدارة المهام الجماعية",
              "دردشة الفريق الداخلية",
              "صلاحيات متدرجة",
              "تتبع أداء الأعضاء",
              "دعم فني للفريق"
            ],
            ctaText: "اختر هذه الباقة"
          },
          {
            id: "royal",
            name: "الفريق المتقدم",
            icon: Crown,
            price: "699",
            period: "شهرياً",
            popular: true,
            description: "للفرق النشطة (5-15 عضو)",
            features: [
              "حتى 15 عضو فريق",
              "عقارات غير محدودة",
              "عملاء غير محدودين",
              "تقويم ذكي للفريق",
              "50 جيجا تخزين",
              "CRM متقدم للفريق",
              "أتمتة سير العمل",
              "تقارير تفصيلية بالأعضاء",
              "نظام المهام الذكي",
              "إدارة العمولات الجماعية",
              "تكامل منصات التواصل",
              "تحليلات أداء الفريق",
              "دعم فني أولوية",
              "تدريب مخصص للفريق"
            ],
            ctaText: "اختر هذه الباقة"
          },
          {
            id: "enterprise",
            name: "المؤسسة",
            icon: Building,
            price: "سعر مخصص",
            period: "حسب الحاجة",
            popular: false,
            description: "للفرق الكبيرة (+15 عضو)",
            features: [
              "أعضاء غير محدودين",
              "حلول مخصصة بالكامل",
              "تكامل مع أي نظام",
              "دعم فني مخصص",
              "تدريب شامل",
              "استشارات نمو الأعمال"
            ],
            ctaText: "طلب عرض سعر مخصص"
          }
        ];
        
      case "office":
        return [
          {
            id: "copper",
            name: "المكتب القياسي",
            icon: Building,
            price: "999",
            period: "شهرياً",
            popular: false,
            description: "للمكاتب المتوسطة (10-25 وسيط)",
            features: [
              "حتى 25 وسيط",
              "عقارات غير محدودة",
              "عملاء غير محدودين",
              "نظام إدارة المكتب",
              "100 جيجا تخزين",
              "CRM متكامل للمكتب",
              "نظام العمولات المتقدم",
              "تقارير إدارية شاملة",
              "لوحة تحكم المدير",
              "إدارة الصلاحيات",
              "تتبع أداء الوسطاء",
              "نظام الحوافز والمكافآت",
              "تكامل المحاسبة",
              "دعم فني مخصص",
              "موقع المكتب المخصص"
            ],
            ctaText: "اختر هذه الباقة"
          },
          {
            id: "goldlight",
            name: "المكتب المتميز",
            icon: Crown,
            price: "1799",
            period: "شهرياً",
            popular: true,
            description: "للمكاتب الكبيرة (25-50 وسيط)",
            features: [
              "حتى 50 وسيط",
              "عقارات وعملاء غير محدودين",
              "نظام إدارة متقدم",
              "500 جيجا تخزين",
              "AI لتحليل السوق",
              "أتمتة كاملة للعمليات",
              "تقارير تنفيذية متطورة",
              "نظام الموافقات والمراجعة",
              "إدارة فروع متعددة",
              "تكامل مع الأنظمة المحاسبية",
              "تحليلات السوق المحلي",
              "نظام التدريب والتأهيل",
              "دعم فني مميز 24/7",
              "استشارات نمو الأعمال",
              "تخصيص كامل للنظام",
              "تطبيق مخصص للمكتب"
            ],
            ctaText: "اختر هذه الباقة"
          },
          {
            id: "office_enterprise",
            name: "المؤسسة المتقدمة",
            icon: Building2,
            price: "سعر مخصص",
            period: "حسب الحاجة",
            popular: false,
            description: "للمكاتب الضخمة (+50 وسيط)",
            features: [
              "وسطاء غير محدودين",
              "حلول مخصصة بالكامل",
              "تكامل مع أي نظام",
              "دعم فني مخصص",
              "تدريب مؤسسي شامل",
              "استشارات تحول رقمي"
            ],
            ctaText: "طلب عرض سعر مخصص"
          }
        ];
        
      case "company":
        return [
          {
            id: "silver",
            name: "الشركات",
            icon: Building2,
            price: "2999",
            period: "شهرياً",
            popular: false,
            description: "للشركات الكبيرة (50-100 وسيط)",
            features: [
              "حتى 100 وسيط",
              "عقارات وعملاء غير محدودين",
              "نظام إدارة المؤسسة",
              "1 تيرابايت تخزين",
              "تحليلات AI متقدمة",
              "أتمتة شاملة للعمليات",
              "تقارير مجلس الإدارة",
              "إدارة محافظ استثمارية",
              "نظام الفروع والأقسام",
              "تكامل أنظمة ERP",
              "تحليلات سوق شاملة",
              "نظام تدريب مؤسسي",
              "إدارة المخاطر",
              "دعم فني مخصص",
              "استشارات استراتيجية",
              "حلول مخصصة",
              "SLA مضمون"
            ],
            ctaText: "اختر هذه الباقة"
          },
          {
            id: "golddark",
            name: "المؤسسة المتقدمة",
            icon: Building2,
            price: "سعر مخصص",
            period: "حسب الحاجة",
            popular: true,
            description: "للمؤسسات الضخمة (وسطاء غير محدودين)",
            features: [
              "وسطاء غير محدودين",
              "حلول مخصصة بالكامل",
              "نظام إدارة المؤسسة",
              "تخزين غير محدود",
              "AI وتعلم آلي مخصص",
              "تطوير ميزات خاصة",
              "تقارير مخصصة",
              "تكامل مع أي نظام",
              "إدارة مناطق جغرافية",
              "نظام فرانشايز",
              "تحليلات سوق عالمية",
              "تدريب مؤسسي شامل",
              "إدارة مخاطر متقدمة",
              "فريق دعم مخصص",
              "استشارات تحول رقمي",
              "ضمان SLA 99.9%",
              "أمان مؤسسي متقدم",
              "نشر سحابي خاص"
            ],
            ctaText: "طلب عرض سعر مخصص"
          }
        ];
        
      default:
        return [];
    }
  };

  const plans = getPlansByType(userType);

  // إذا تم اختيار باقة بنجاح، عرض صفحة التأكيد
  if (showSuccess && selectedPlan) {
    return (
      <SuccessConfirmation
        onContinue={() => onSelectPlan(selectedPlan)}
        userType={userType}
        selectedPlan={selectedPlan}
      />
    );
  }

  return (
    <div 
      className="min-h-screen px-4 py-6 touch-scroll-smooth hide-scrollbar" 
      dir="rtl" 
      style={{ 
        background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="h-12 px-6 border-2 border-[#D4AF37] hover:bg-[#f0fdf4] transition-all duration-200 touch-manipulation btn-touch"
          >
            <ArrowLeft className="w-5 h-5 ml-2" /> العودة
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#01411C" }}>
              باقات {getUserTypeLabel(userType)}
            </h1>
            <p className="text-[#065f41] text-sm md:text-base">
              اختر الباقة المناسبة لاحتياجاتك - الشهر الأول مجاني
            </p>
          </div>
          
          <div className="w-20 hidden md:block" />
        </motion.header>

        {/* عرض مميز */}
        <motion.div
          className="mb-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2" style={{
            background: 'linear-gradient(135deg, #01411C 0%, #065f41 100%)',
            borderColor: '#D4AF37',
            color: 'white'
          }}>
            <Gift className="w-5 h-5" style={{ color: '#D4AF37' }} />
            <span className="font-bold text-lg">🎉 أول شهر مجاني لجميع الباقات</span>
          </div>
        </motion.div>

        {/* شبكة الباقات - متجاوبة بالكامل */}
        <motion.div 
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isCustomPrice = plan.price === "سعر مخصص";
            
            return (
              <motion.div
                key={plan.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full"
              >
                <Card className={`
                  h-full relative overflow-hidden flex flex-col
                  ${plan.popular ? 'border-4 border-[#D4AF37] shadow-2xl' : 'border-2 border-gray-200'}
                  ${isSelected ? 'ring-4 ring-[#D4AF37]/30' : ''}
                  transition-all duration-300
                `}>
                  
                  {/* شارة الشائع */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#01411C] px-4 py-2 text-sm font-bold rounded-bl-lg z-10">
                      <div className="flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        الأكثر شيوعاً
                      </div>
                    </div>
                  )}

                  {/* شارة المجاني */}
                  {plan.price === "0" && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg z-10">
                      مجاني تماماً!
                    </div>
                  )}

                  {/* محتوى البطاقة */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* رأس البطاقة */}
                    <CardHeader className="text-center pt-0 pb-4">
                      <motion.div 
                        className="mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 mb-4"
                        style={{ 
                          borderColor: plan.popular ? "#D4AF37" : "#e5e7eb",
                          background: plan.popular ? "linear-gradient(135deg, #f0fdf4 0%, #D4AF37 100%)" : "#f9fafb"
                        }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#01411C]" />
                      </motion.div>
                      
                      <CardTitle className="text-lg md:text-xl font-bold text-[#01411C] mb-2">
                        {plan.name}
                      </CardTitle>
                      
                      {/* سبيكة الباقة */}
                      <div className="flex justify-center mb-3">
                        <SubscriptionTierSlab
                          accountType={
                            userType === "team" ? "team" :
                            userType === "office" ? "office" :
                            userType === "company" ? "company" :
                            "individual"
                          }
                          tierLevel={
                            plan.id.includes("free") || plan.id.includes("basic") ? "bronze" :
                            plan.id.includes("premium") || plan.id.includes("standard") ? "silver" :
                            plan.id.includes("enterprise") || plan.id.includes("plus") || plan.id.includes("advanced") ? "gold" :
                            "platinum"
                          }
                          label={plan.name}
                          compact={true}
                          animated={true}
                        />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {plan.description}
                      </p>
                      
                      {/* السعر */}
                      <div className="mb-4">
                        {!isCustomPrice ? (
                          <>
                            <div className="text-3xl md:text-4xl font-extrabold" style={{ color: "#01411C" }}>
                              {plan.price}
                              {plan.price !== "0" && (
                                <span className="text-lg text-gray-600 mr-2">ريال</span>
                              )}
                            </div>
                            <div className="text-sm text-[#D4AF37] font-medium mt-1">
                              {plan.period}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl md:text-2xl font-bold text-[#01411C]">
                              سعر مخصص
                            </div>
                            <div className="text-sm text-[#D4AF37] font-medium mt-1">
                              حسب احتياجاتك
                            </div>
                          </>
                        )}
                      </div>
                    </CardHeader>

                    {/* الميزات */}
                    <CardContent className="pt-0 flex-1">
                      <div className="max-h-64 overflow-y-auto hide-scrollbar">
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-2 text-gray-700"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.02 * i }}
                            >
                              <div className="mt-1 text-[#01411C] bg-green-100 rounded-full p-1 flex-shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                              <div className="text-sm leading-5">{feature}</div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </div>

                  {/* زر الاشتراك - مفصول في الأسفل دائماً */}
                  <div className="p-6 pt-0 mt-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleSelect(plan.id)}
                        className={`
                          w-full h-12 font-bold border-2 text-base rounded-xl touch-manipulation btn-touch
                          ${plan.popular 
                            ? 'bg-[#01411C] text-white border-[#D4AF37] hover:bg-[#065f41]' 
                            : 'bg-white text-[#01411C] border-[#D4AF37] hover:bg-[#f0fdf4]'
                          }
                          transition-all duration-200
                        `}
                        disabled={isSelected || isLoading}
                      >
                        {isSelected && isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            جاري المعالجة...
                          </div>
                        ) : (
                          plan.ctaText
                        )}
                      </Button>
                    </motion.div>
                    
                    {/* نص إضافي */}
                    {plan.price === "0" && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        بدون الحاجة لبطاقة ائتمانية
                      </p>
                    )}
                    {isCustomPrice && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        تواصل مباشر مع فريق المبيعات
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* مميزات وسِيطي */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="bg-white rounded-xl p-6 border-2 border-[#D4AF37] shadow-lg">
            <h3 className="text-xl font-bold text-[#01411C] mb-6">
              لماذا تختار وسِيطي؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-[#01411C] mb-2">ضمان 30 يوم</h4>
                <p className="text-sm text-gray-600">استرداد كامل للمال</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-[#01411C] mb-2">تفعيل فوري</h4>
                <p className="text-sm text-gray-600">ابدأ في نفس اللحظة</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                  <Headphones className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-[#01411C] mb-2">دعم فني 24/7</h4>
                <p className="text-sm text-gray-600">مساعدة على مدار الساعة</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-[#01411C] mb-2">نمو مضمون</h4>
                <p className="text-sm text-gray-600">زيادة مبيعاتك 300%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Modal عند الانتهاء */}
        <AnimatePresence>
          {isLoading && !selectedPlan?.includes("custom") && !selectedPlan?.includes("enterprise") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              style={{ direction: 'rtl' }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-8 text-center max-w-md w-full"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#01411C] mb-4">
                  تم تفعيل حسابك بنجاح! 🎉
                </h3>
                <p className="text-gray-600 mb-2">
                  مرحباً بك في وسِيطي
                </p>
                <p className="text-sm text-[#D4AF37] font-medium">
                  الشهر الأول مجاني - ابدأ الآن!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}