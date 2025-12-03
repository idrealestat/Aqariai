import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  CheckCircle, 
  Crown, 
  Gift, 
  ArrowRight, 
  Sparkles,
  Zap,
  Shield,
  Trophy
} from "lucide-react";

interface SuccessConfirmationProps {
  onContinue: () => void;
  userType: "individual" | "team" | "office" | "company";
  selectedPlan: string;
}

export function SuccessConfirmation({ onContinue, userType, selectedPlan }: SuccessConfirmationProps) {
  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "individual": return "وسيط فردي";
      case "team": return "فريق عقاري";
      case "office": return "مكتب عقاري";
      case "company": return "شركة عقارية";
      default: return "وسيط";
    }
  };

  const getPlanLabel = (plan: string) => {
    if (plan.includes("free") || plan.includes("starter")) return "البداية";
    if (plan.includes("professional")) return "المحترف";
    if (plan.includes("expert")) return "الخبير";
    if (plan.includes("basic")) return "الأساسي";
    if (plan.includes("advanced")) return "المتقدم";
    if (plan.includes("standard")) return "القياسي";
    if (plan.includes("premium")) return "المتميز";
    if (plan.includes("corporate")) return "الشركات";
    if (plan.includes("enterprise")) return "المؤسسات";
    return "الباقة المختارة";
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8" 
      dir="rtl"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)'
      }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-2" style={{
          borderColor: '#D4AF37',
          boxShadow: '0 25px 50px -12px rgba(1, 65, 28, 0.3)'
        }}>
          <CardContent className="p-8 md:p-12 text-center">
            {/* أيقونة النجاح الكبيرة */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.6, 
                type: "spring", 
                bounce: 0.4 
              }}
              className="mb-8"
            >
              <div className="relative">
                {/* الدائرة الخارجية */}
                <div 
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderColor: '#D4AF37',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle className="w-20 h-20 text-white" />
                </div>
                
                {/* تأثيرات متحركة */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0, 0.7] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                  className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-[#D4AF37]"
                />
                
                {/* نجوم متطايرة */}
                <motion.div
                  animate={{ 
                    y: [-10, -30, -10],
                    x: [0, 10, 0],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: 0.5
                  }}
                  className="absolute -top-4 -right-4"
                >
                  <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [-5, -25, -5],
                    x: [0, -15, 0],
                    rotate: [0, -180, -360] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: 1
                  }}
                  className="absolute -top-2 -left-6"
                >
                  <Crown className="w-6 h-6 text-[#D4AF37]" />
                </motion.div>
              </div>
            </motion.div>

            {/* رسالة النجاح */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-black text-[#01411C] mb-4">
                🎉 تم تفعيل حسابك بنجاح!
              </h1>
              
              <p className="text-xl text-gray-700 mb-6">
                مرحباً بك في منصة وسِيطي المتطورة
              </p>

              {/* تفاصيل الحساب */}
              <div className="bg-gradient-to-r from-[#f0fdf4] to-[#fffef7] rounded-2xl p-6 mb-8 border-2 border-[#D4AF37]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-[#01411C]">نوع الحساب</h3>
                    <p className="text-gray-600">{getUserTypeLabel(userType)}</p>
                  </div>
                  <div className="text-center">
                    <Crown className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-[#01411C]">الباقة المختارة</h3>
                    <p className="text-gray-600">{getPlanLabel(selectedPlan)}</p>
                  </div>
                </div>
              </div>

              {/* العرض المميز */}
              <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Gift className="w-8 h-8 text-[#D4AF37]" />
                  <h3 className="text-xl font-bold">عرض ترحيبي مميز!</h3>
                </div>
                <p className="text-lg mb-4">
                  الشهر الأول مجاني تماماً - لا حاجة لبطاقة ائتمانية
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#D4AF37]" />
                    <span>تفعيل فوري</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                    <span>ضمان 30 يوم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>جميع المميزات</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* زر الانتقال للوحة التحكم */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button
                onClick={onContinue}
                className="w-full md:w-auto h-16 px-12 text-lg font-bold bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white border-2 border-[#D4AF37] rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl touch-manipulation btn-touch"
              >
                <span>انتقل إلى لوحة التحكم</span>
                <ArrowRight className="w-6 h-6 mr-3" />
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                استمتع بتجربة مجانية كاملة لمدة 30 يوم
              </p>
            </motion.div>

            {/* رسائل تشجيعية */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">📈</span>
                  <p>زيادة المبيعات حتى 300%</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl mb-2 block">⏰</span>
                  <p>توفير 5+ ساعات يومياً</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl mb-2 block">🎯</span>
                  <p>إدارة احترافية للعملاء</p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}