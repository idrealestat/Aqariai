"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { OffersRequestsUser } from "./offers-requests-dashboard";
import { OffersRequestsBottomNav } from "./offers-requests-bottom-nav";

interface OffersRequestsProfileProps {
  user: OffersRequestsUser | null;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export function OffersRequestsProfile({ user, onBack, onNavigate }: OffersRequestsProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const userTypeLabels = {
    "property-owner": "مالك عقار",
    "buyer": "مشتري",
    "client": "عميل",
    "developer": "مطور"
  };

  const menuItems = [
    {
      icon: Settings,
      label: "الإعدادات",
      description: "إدارة إعدادات الحساب",
      color: "text-gray-600"
    },
    {
      icon: Bell,
      label: "الإشعارات",
      description: "إدارة إشعارات التطبيق",
      color: "text-blue-600"
    },
    {
      icon: HelpCircle,
      label: "المساعدة والدعم",
      description: "الحصول على المساعدة",
      color: "text-green-600"
    },
    {
      icon: LogOut,
      label: "تسجيل الخروج",
      description: "الخروج من الحساب",
      color: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" dir="rtl">
      {/* الهيدر */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">الملف الشخصي</h1>
              <p className="text-sm text-gray-500">إدارة بياناتك الشخصية</p>
            </div>

            <Button
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              {isEditing ? "حفظ" : "تعديل"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* بطاقة المستخدم */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                    {user?.name?.charAt(0) || "م"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{user?.name || "مستخدم"}</h2>
                    <Badge className="bg-green-500 text-white">
                      {user?.type ? userTypeLabels[user.type] : "عميل"}
                    </Badge>
                  </div>
                  
                  {user?.nickname && (
                    <p className="text-gray-600 mb-1">الكنية: {user.nickname}</p>
                  )}
                  
                  {user?.plan && (
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      باقة {user.plan === "199" ? "الأساسية" : "المتقدمة"} - {user.plan} ريال
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* المعلومات الشخصية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <User className="w-5 h-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">رقم الهوية</div>
                    <div className="font-medium">{user?.idNumber || "غير محدد"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">تاريخ الميلاد</div>
                    <div className="font-medium">{user?.birthDate || "غير محدد"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">رقم الجوال</div>
                    <div className="font-medium">{user?.phone || "غير محدد"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">رقم الواتساب</div>
                    <div className="font-medium">{user?.whatsapp || "غير محدد"}</div>
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    💡 لتعديل البيانات الشخصية، يرجى التواصل مع الدعم الفني
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    التواصل مع الدعم
                  </Button>
                </div>
              )}
              
            </CardContent>
          </Card>
        </motion.div>

        {/* قائمة الإعدادات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                الإعدادات والخيارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-right"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* معلومات التطبيق */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🏠</div>
                <h3 className="font-bold text-gray-800 mb-1">منصة العروض والطلبات</h3>
                <p className="text-sm text-gray-500 mb-2">الإصدار 1.0.0</p>
                <p className="text-xs text-gray-400">
                  © 2024 جميع الحقوق محفوظة
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
      
      {/* مساحة إضافية للشريط السفلي */}
      <div className="h-24"></div>

      {/* الشريط السفلي */}
      {onNavigate && (
        <OffersRequestsBottomNav 
          currentPage="offers-requests-profile"
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}