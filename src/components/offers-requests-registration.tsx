"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ArrowRight, ArrowLeft, Check, MessageCircle, Star, Shield, Users, Zap, Phone } from "lucide-react";

export type OffersRequestsUserType = "property-owner" | "buyer" | "client" | "developer";

interface OffersRequestsUser {
  id: string;
  name: string;
  nickname?: string;
  idNumber?: string;
  birthDate?: string;
  phone: string;
  whatsapp?: string;
  type: OffersRequestsUserType;
  plan: string;
  profileImage?: string;
}

interface OffersRequestsRegistrationProps {
  userType: OffersRequestsUserType;
  onComplete: (user: OffersRequestsUser) => void;
  onBack: () => void;
}

export function OffersRequestsRegistration({ userType, onComplete, onBack }: OffersRequestsRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    idNumber: "",
    birthDate: "",
    phone: "",
    whatsapp: "",
  });
  const [selectedPlan, setSelectedPlan] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneVerification = () => {
    if (formData.phone.length >= 10) {
      setPhoneVerified(true);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.name.trim()) {
      setCurrentStep(2);
    }
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleComplete = () => {
    if (formData.name.trim() && formData.phone.trim() && selectedPlan) {
      const userData: OffersRequestsUser = {
        id: Date.now().toString(),
        name: formData.name,
        nickname: formData.nickname,
        idNumber: formData.idNumber,
        birthDate: formData.birthDate,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        type: userType,
        plan: selectedPlan,
      };
      onComplete(userData);
    }
  };

  const plans = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: "199",
      isPopular: false,
      features: [
        "إضافة حتى 10 عروض شهرياً",
        "تصفح جميع العروض المتاحة",
        "تواصل مع 5 وسطاء",
        "دعم فني أساسي",
        "تقارير شهرية"
      ]
    },
    {
      id: "premium", 
      name: "الباقة المتقدمة",
      price: "349",
      isPopular: true,
      features: [
        "عروض غير محدودة",
        "أولوية في عرض العروض",
        "تواصل مع جميع الوسطاء",
        "دعم فني 24/7",
        "تقارير يومية تفصيلية",
        "إحصائيات متقدمة",
        "تنبيهات فورية"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50" dir="rtl">
      {/* الهيدر */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Button>
            
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold text-blue-700">تسجيل عميل جديد</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className="w-8 h-1 bg-gray-300">
                  <div className={`h-full bg-blue-500 transition-all duration-300 ${currentStep >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              </div>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* الخطوة الأولى - البيانات الشخصية */}
        {currentStep === 1 && (
          <div className="max-w-md mx-auto space-y-6">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-blue-700 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  البيانات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* اسم العميل */}
                <div>
                  <Label htmlFor="name" className="text-right text-blue-700 font-medium flex items-center gap-1">
                    اسم العميل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="أدخل اسم العميل"
                    className="mt-2 text-right"
                    required
                  />
                </div>

                {/* الكنية */}
                <div>
                  <Label htmlFor="nickname" className="text-right text-blue-700 font-medium">
                    الكنية
                  </Label>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                    placeholder="الكنية (اختياري)"
                    className="mt-2 text-right"
                  />
                </div>

                {/* رقم البطاقة */}
                <div>
                  <Label htmlFor="idNumber" className="text-right text-blue-700 font-medium">
                    رقم البطاقة
                  </Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    placeholder="رقم البطاقة (اختياري)"
                    className="mt-2 text-right"
                  />
                </div>

                {/* تاريخ الميلاد */}
                <div>
                  <Label htmlFor="birthDate" className="text-right text-blue-700 font-medium">
                    تاريخ الميلاد
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="mt-2 text-right"
                  />
                </div>

                {/* رقم الجوال */}
                <div>
                  <Label htmlFor="phone" className="text-right text-blue-700 font-medium flex items-center gap-1">
                    رقم الجوال <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="text-right flex-1"
                      required
                    />
                    {formData.phone.length >= 10 && (
                      <Button
                        onClick={handlePhoneVerification}
                        size="sm"
                        className={`px-3 ${phoneVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {phoneVerified ? <Check className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  {phoneVerified && (
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      تم التحقق من الرقم
                    </div>
                  )}
                </div>

                {/* رقم الواتساب */}
                <div>
                  <Label htmlFor="whatsapp" className="text-right text-blue-700 font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    رقم الواتساب
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="mt-2 text-right"
                  />
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!formData.name.trim()}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
                >
                  التالي - اختيار الباقة
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* الخطوة الثانية - اختيار الباقة */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">اختر الباقة المناسبة</h2>
              <p className="text-gray-600">اختر الباقة التي تناسب احتياجاتك</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-300 border-2 ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 shadow-xl scale-105' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  } ${plan.isPopular ? 'ring-2 ring-orange-400' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white px-4 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        الأكثر شعبية
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {plan.id === 'basic' ? (
                        <Shield className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Zap className="w-6 h-6 text-orange-500" />
                      )}
                      <CardTitle className={`text-xl ${plan.id === 'basic' ? 'text-blue-700' : 'text-orange-700'}`}>
                        {plan.name}
                      </CardTitle>
                    </div>
                    <div className="text-center">
                      <span className={`text-3xl font-bold ${plan.id === 'basic' ? 'text-blue-600' : 'text-orange-600'}`}>
                        {plan.price}
                      </span>
                      <span className="text-gray-500 mr-2">ريال / شهرياً</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-right">
                          <Check className={`w-4 h-4 flex-shrink-0 ${plan.id === 'basic' ? 'text-blue-500' : 'text-orange-500'}`} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      className={`w-full font-medium ${
                        selectedPlan === plan.id 
                          ? plan.id === 'basic' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-orange-600 hover:bg-orange-700'
                          : plan.id === 'basic'
                            ? 'border-blue-300 text-blue-600 hover:bg-blue-50'
                            : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {selectedPlan === plan.id ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          تم الاختيار
                        </div>
                      ) : (
                        'اختيار هذه الباقة'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </Button>
              
              <Button 
                onClick={handleComplete}
                disabled={!selectedPlan}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 font-medium"
              >
                إتمام التسجيل
                <Check className="w-4 h-4 mr-2" />
              </Button>
            </div>

            {/* خيار الانتقال إلى النظام المحسن */}
            <div className="max-w-md mx-auto mt-6">
              <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">نظام إدارة العروض والطلبات المحسن</h3>
                  <p className="text-sm text-[#065f41] mb-4">
                    جرب النظام الجديد لإدارة العروض والطلبات مع واجهة محسنة ونظام CRM متطور
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // إنشاء مستخدم تجريبي للنظام المحسن
                      const demoUser = {
                        id: "demo-enhanced-" + Date.now(),
                        name: formData.name || "مستخدم تجريبي",
                        nickname: formData.nickname,
                        idNumber: formData.idNumber,
                        birthDate: formData.birthDate,
                        phone: formData.phone || "0501234567",
                        whatsapp: formData.whatsapp,
                        type: "property-owner" as OffersRequestsUserType,
                        plan: selectedPlan || "الباقة التجريبية"
                      };
                      onComplete(demoUser);
                    }}
                    className="w-full border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37]/10"
                  >
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    تجربة النظام المحسن
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}