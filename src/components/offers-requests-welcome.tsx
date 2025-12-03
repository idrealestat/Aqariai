"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Check, 
  Phone, 
  MessageCircle, 
  Star, 
  Shield, 
  Zap, 
  ArrowLeft,
  Confetti,
  Users,
  Calendar
} from "lucide-react";

interface OffersRequestsUser {
  id: string;
  name: string;
  nickname?: string;
  idNumber?: string;
  birthDate?: string;
  phone: string;
  whatsapp?: string;
  type: string;
  plan: string;
  profileImage?: string;
}

interface OffersRequestsWelcomeProps {
  user: OffersRequestsUser;
  onContinue: () => void;
}

export function OffersRequestsWelcome({ user, onContinue }: OffersRequestsWelcomeProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getPlanDetails = () => {
    if (user.plan === "basic") {
      return {
        name: "الباقة الأساسية",
        price: "199",
        color: "blue",
        icon: Shield,
        features: ["10 عروض شهرياً", "5 وسطاء", "دعم أساسي"]
      };
    } else {
      return {
        name: "الباقة المتقدمة",
        price: "349",
        color: "orange",
        icon: Zap,
        features: ["عروض غير محدودة", "جميع الوسطاء", "دعم 24/7"]
      };
    }
  };

  const planDetails = getPlanDetails();
  const PlanIcon = planDetails.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50" dir="rtl">
      {showAnimation && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center animate-pulse">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-700">تم التسجيل بنجاح!</h2>
            <p className="text-gray-600 mt-2">جاري إعداد حسابك...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* رسالة الترحيب الرئيسية */}
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                🎉 أهلاً وسهلاً، {user.name}!
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                نرحب بك في منصة العروض والطلبات العقارية الأكثر تطوراً في المملكة.
                تم إعداد حسابك بنجاح وأنت الآن جاهز لبدء رحلتك العقارية معنا.
              </p>

              <div className="flex items-center justify-center gap-2 mt-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  انضممت اليوم: {new Date().toLocaleDateString('ar-SA')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الباقة المختارة */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                  <PlanIcon className={`w-6 h-6 text-${planDetails.color}-500`} />
                  باقتك المختارة
                </h2>
                {user.plan === "premium" && (
                  <Badge className="bg-orange-500 text-white flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    الأكثر شعبية
                  </Badge>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold text-${planDetails.color}-700`}>
                    {planDetails.name}
                  </h3>
                  <div className="text-left">
                    <span className={`text-2xl font-bold text-${planDetails.color}-600`}>
                      {planDetails.price}
                    </span>
                    <span className="text-gray-500 mr-1">ريال/شهر</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 text-${planDetails.color}-500`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-blue-700 text-sm text-center font-medium">
                  ✨ ستتم محاسبتك شهرياً بدءاً من اليوم • يمكنك إلغاء الاشتراك في أي وقت
                </p>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الاتصال المسجلة */}
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                معلومات الاتصال المسجلة
              </h2>

              <div className="space-y-3">
                {/* رقم الجوال */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">رقم الجوال</div>
                      <div className="text-sm text-gray-600">{user.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">مُحقق</span>
                  </div>
                </div>

                {/* رقم الواتساب */}
                {user.whatsapp && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">واتساب</div>
                        <div className="text-sm text-gray-600">{user.whatsapp}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      نشط
                    </Badge>
                  </div>
                )}

                {/* معلومات إضافية */}
                {(user.nickname || user.idNumber) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2">معلومات إضافية:</h4>
                    <div className="text-sm text-blue-600 space-y-1">
                      {user.nickname && <div>• الكنية: {user.nickname}</div>}
                      {user.idNumber && <div>• رقم البطاقة: {user.idNumber}</div>}
                      {user.birthDate && <div>• تاريخ الميلاد: {new Date(user.birthDate).toLocaleDateString('ar-SA')}</div>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* اختيار نوع النظام */}
          <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#01411C] mb-4 text-center">
                🎯 اختر نوع النظام المناسب لك
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* النظام الكلاسيكي */}
                <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50 hover:border-blue-400 transition-all cursor-pointer"
                     onClick={onContinue}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-700 mb-2">النظام الكلاسيكي</h3>
                    <p className="text-sm text-blue-600 mb-3">
                      نظام إدارة العروض والطلبات الأساسي مع إدارة CRM متكاملة
                    </p>
                    <ul className="text-xs text-blue-500 space-y-1 mb-4">
                      <li>• إدارة العروض والطلبات</li>
                      <li>• نظام CRM شامل</li>
                      <li>• 4 تبويبات رئيسية</li>
                      <li>• إدارة البيانات المتقدمة</li>
                    </ul>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={onContinue}
                    >
                      اختيار النظام الكلاسيكي
                    </Button>
                  </div>
                </div>

                {/* النظام المحسن */}
                <div className="border-2 border-[#D4AF37] rounded-xl p-4 bg-gradient-to-br from-[#fffef7] to-[#f0fdf4] hover:border-[#01411C] transition-all cursor-pointer">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-[#01411C] mb-2">النظام المحسن ⭐</h3>
                    <p className="text-sm text-[#065f41] mb-3">
                      نظام إدارة تفاعلي محسن مع واجهة عصرية وميزات متقدمة
                    </p>
                    <ul className="text-xs text-[#065f41] space-y-1 mb-4">
                      <li>• أدوار ديناميكية (بائع، مشتري، مؤجر، مستأجر)</li>
                      <li>• واجهة تفاعلية حديثة</li>
                      <li>• نظام CRM جانبي متطور</li>
                      <li>• إدارة الوسطاء المحسنة</li>
                    </ul>
                    <Button 
                      className="w-full bg-gradient-to-l from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white border-2 border-[#D4AF37]"
                      onClick={() => {
                        // تحديث معرف المستخدم ليشير إلى النظام المحسن
                        const enhancedUser = { ...user, id: "demo-enhanced-" + user.id };
                        // استدعاء onContinue مع إشارة للنظام المحسن
                        if (typeof onContinue === 'function') {
                          // إرسال إشارة للتطبيق الرئيسي للانتقال للنظام المحسن
                          window.dispatchEvent(new CustomEvent('navigateToEnhanced', { detail: enhancedUser }));
                        }
                      }}
                    >
                      <Star className="w-4 h-4 ml-2" />
                      تجربة النظام المحسن
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  يمكنك التبديل بين الأنظمة في أي وقت من الإعدادات
                </p>
                <Badge variant="outline" className="text-[#D4AF37] border-[#D4AF37]">
                  جديد: النظام المحسن متاح الآن!
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}