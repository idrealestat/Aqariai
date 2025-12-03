import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Building2, CheckSquare, BarChart3, Settings, Users, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "team" | "office" | "company";
  avatar?: string;
  plan?: string;
}

interface PersistentSidebarPageProps {
  user?: User | null;
  onNavigate?: (page: string) => void;
  pageType: 'properties' | 'tasks' | 'reports' | 'settings';
}

export const PersistentSidebarPage: React.FC<PersistentSidebarPageProps> = ({
  user,
  onNavigate,
  pageType
}) => {
  const pageConfig = {
    properties: {
      icon: <Building2 className="w-16 h-16" />,
      title: 'إدارة العقارات',
      description: 'إدارة شاملة للعقارات والعروض والطلبات',
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      features: [
        'إضافة وتعديل العقارات',
        'إدارة العروض والطلبات', 
        'تتبع حالة العقارات',
        'تقارير أداء العقارات'
      ]
    },
    tasks: {
      icon: <CheckSquare className="w-16 h-16" />,
      title: 'إدارة المهام',
      description: 'نظام شامل للمهام والتذكيرات والمتابعات',
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-300',
      features: [
        'إنشاء وتنظيم المهام',
        'تذكيرات ذكية',
        'متابعة التقدم',
        'تعيين المهام للفريق'
      ]
    },
    reports: {
      icon: <BarChart3 className="w-16 h-16" />,
      title: 'التقارير والتحليلات',
      description: 'تقارير مفصلة وتحليلات متقدمة للأداء',
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      features: [
        'تقارير المبيعات',
        'تحليل أداء العملاء',
        'إحصائيات العقارات',
        'مؤشرات الأداء الرئيسية'
      ]
    },
    settings: {
      icon: <Settings className="w-16 h-16" />,
      title: 'الإعدادات العامة',
      description: 'إعدادات النظام والتخصيص الشخصي',
      color: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300',
      features: [
        'إعدادات الحساب',
        'تخصيص الواجهة',
        'إدارة الصلاحيات',
        'النسخ الاحتياطي'
      ]
    }
  };

  const config = pageConfig[pageType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-2 border-[#D4AF37] shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onNavigate?.("dashboard")}
              className="flex items-center gap-2 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#01411C]">
                {config.title}
              </h1>
              <p className="text-sm text-gray-600">
                {config.description}
              </p>
            </div>
            
            <Badge variant="outline" className="bg-[#f0fdf4] border-[#D4AF37]">
              قيد التطوير
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Status Card */}
          <Card className={`border-2 ${config.borderColor} bg-gradient-to-r ${config.color} mb-8`}>
            <CardContent className="p-8 text-center">
              <div className="mb-6 text-gray-600">
                {config.icon}
              </div>
              <h2 className="text-2xl font-bold text-[#01411C] mb-4">
                {config.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {config.description}
              </p>
              <Badge className="bg-yellow-500 text-white">
                🚧 قيد التطوير - متوفر قريباً
              </Badge>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card className="border-2 border-[#D4AF37]/30 mb-8">
            <CardHeader>
              <CardTitle className="text-[#01411C] text-center">
                ✨ الميزات القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-[#01411C] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Now */}
          <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="text-[#01411C] text-center">
                🎯 متوفر الآن
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-600">
                يمكنك البدء باستخدام نظام CRM المتقدم والواجهة الرئيسية
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => onNavigate?.("enhanced-crm")}
                  className="bg-[#01411C] hover:bg-[#065f41] text-white h-16 flex-col gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span>نظام CRM المتقدم</span>
                </Button>
                
                <Button
                  onClick={() => onNavigate?.("dashboard")}
                  variant="outline"
                  className="border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4] h-16 flex-col gap-2"
                >
                  <Home className="w-6 h-6" />
                  <span>الواجهة الرئيسية</span>
                </Button>
                
                <Button
                  onClick={() => onNavigate?.("settings")}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 h-16 flex-col gap-2"
                >
                  <Settings className="w-6 h-6" />
                  <span>الإعدادات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default PersistentSidebarPage;