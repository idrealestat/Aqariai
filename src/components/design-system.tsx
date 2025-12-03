import React from 'react';
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveText, 
  TouchFriendlyButton,
  ResponsiveCard,
  useResponsiveBreakpoint 
} from './ui/responsive-utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  AlertCircle,
  Palette,
  Type,
  Layout,
  Languages,
  Zap
} from 'lucide-react';

interface DesignSystemProps {
  onBack?: () => void;
}

export function DesignSystem({ onBack }: DesignSystemProps) {
  const { breakpoint, isMobile, isTablet, isDesktop } = useResponsiveBreakpoint();

  const designRules = [
    {
      category: "التصميم المتجاوب",
      icon: Layout,
      status: "مطبق",
      rules: [
        "عرض عمودي على الموبايل مع عناصر متراصة",
        "عرض أفقي على الكمبيوتر بشبكة 2-4 أعمدة", 
        "توازن متوسط على التابلت",
        "تخطيط مرن حسب حجم الشاشة"
      ]
    },
    {
      category: "دعم اللغة العربية",
      icon: Languages,
      status: "مطبق",
      rules: [
        "جميع النصوص من اليمين لليسار (RTL)",
        "القوائم والأزرار تبدأ من الجهة اليمنى",
        "خط عربي واضح (Tajawal/Dubai)",
        "محاذاة صحيحة للمحتوى العربي"
      ]
    },
    {
      category: "التوافق مع الأجهزة",
      icon: Smartphone,
      status: "مطبق", 
      rules: [
        "واجهة لمس مريحة للموبايل (44px min)",
        "واجهة واسعة للكمبيوتر مع قوائم جانبية",
        "منع التكبير غير المرغوب في iOS",
        "دعم React + React Native"
      ]
    },
    {
      category: "التصميم البصري",
      icon: Palette,
      status: "مطبق",
      rules: [
        "أخضر ملكي (#01411C) كلون أساسي",
        "ذهبي (#D4AF37) كلون مميز",
        "خلفية رخامية بيضاء متدرجة",
        "أزرار كبيرة بحدود ذهبية"
      ]
    },
    {
      category: "التفاعل المحسن",
      icon: Zap,
      status: "مطبق",
      rules: [
        "أزرار ملء العرض في الموبايل",
        "أزرار متوسطة الحجم في الكمبيوتر", 
        "تأثيرات التحويم والضغط",
        "انتقالات سلسة بين الشاشات"
      ]
    },
    {
      category: "الحالات الخاصة",
      icon: AlertCircle,
      status: "مطبق",
      rules: [
        "شاشات أوسع من 1024px: توزيع أفقي",
        "شاشات أصغر من 640px: تخطيط عمودي",
        "حالات فارغة: رسائل وأيقونات واضحة",
        "معالجة الأخطاء وحالات التحميل"
      ]
    }
  ];

  const currentDevice = () => {
    if (isMobile) return { icon: Smartphone, label: "موبايل", color: "#10B981" };
    if (isTablet) return { icon: Tablet, label: "تابلت", color: "#F59E0B" };
    return { icon: Monitor, label: "كمبيوتر", color: "#3B82F6" };
  };

  const device = currentDevice();

  return (
    <ResponsiveContainer maxWidth="2xl" className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {onBack && (
          <TouchFriendlyButton variant="outline" onClick={onBack}>
            العودة
          </TouchFriendlyButton>
        )}
        <div className="text-center flex-1">
          <ResponsiveText as="h1" size="2xl" weight="bold" className="text-[#01411C] mb-2">
            نظام التصميم المتجاوب
          </ResponsiveText>
          <Badge 
            className="inline-flex items-center gap-2 px-4 py-2"
            style={{ backgroundColor: device.color, color: 'white' }}
          >
            <device.icon className="w-4 h-4" />
            يتم العرض حالياً على: {device.label} ({breakpoint})
          </Badge>
        </div>
        <div className="w-20 md:w-auto"></div>
      </div>

      {/* Current Screen Info */}
      <ResponsiveCard className="mb-8 bg-gradient-to-r from-[#f0fdf4] to-[#fffef7]">
        <div className="text-center">
          <ResponsiveText size="lg" weight="medium" className="text-[#01411C] mb-4">
            معلومات الشاشة الحالية
          </ResponsiveText>
          <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap={4}>
            <div className="text-center">
              <ResponsiveText size="sm" className="text-gray-600">حجم الشاشة</ResponsiveText>
              <ResponsiveText weight="bold" className="text-[#01411C]">{breakpoint.toUpperCase()}</ResponsiveText>
            </div>
            <div className="text-center">
              <ResponsiveText size="sm" className="text-gray-600">نوع الجهاز</ResponsiveText>
              <ResponsiveText weight="bold" className="text-[#01411C]">{device.label}</ResponsiveText>
            </div>
            <div className="text-center">
              <ResponsiveText size="sm" className="text-gray-600">الاتجاه</ResponsiveText>
              <ResponsiveText weight="bold" className="text-[#01411C]">من اليمين لليسار</ResponsiveText>
            </div>
            <div className="text-center">
              <ResponsiveText size="sm" className="text-gray-600">حالة التطبيق</ResponsiveText>
              <ResponsiveText weight="bold" className="text-green-600">مُحسّن ✓</ResponsiveText>
            </div>
          </ResponsiveGrid>
        </div>
      </ResponsiveCard>

      {/* Design Rules */}
      <ResponsiveGrid cols={{ xs: 1, md: 2, xl: 3 }} gap={6}>
        {designRules.map((rule, index) => (
          <ResponsiveCard key={index} hover className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#01411C]">
                <rule.icon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <ResponsiveText weight="bold" className="text-[#01411C]">
                  {rule.category}
                </ResponsiveText>
                <Badge 
                  variant={rule.status === "مطبق" ? "default" : "secondary"}
                  className="mt-1"
                  style={{ 
                    backgroundColor: rule.status === "مطبق" ? "#10B981" : "#6B7280",
                    color: "white"
                  }}
                >
                  <CheckCircle className="w-3 h-3 ml-1" />
                  {rule.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              {rule.rules.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <ResponsiveText size="sm" className="text-gray-700">
                    {item}
                  </ResponsiveText>
                </div>
              ))}
            </div>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>

      {/* Example Components */}
      <div className="mt-12">
        <ResponsiveText as="h2" size="xl" weight="bold" className="text-[#01411C] mb-6 text-center">
          أمثلة على المكونات المحسنة
        </ResponsiveText>
        
        <ResponsiveGrid cols={{ xs: 1, md: 2 }} gap={6}>
          {/* Buttons Example */}
          <ResponsiveCard>
            <ResponsiveText weight="bold" className="text-[#01411C] mb-4">
              الأزرار المتجاوبة
            </ResponsiveText>
            <div className="space-y-3">
              <TouchFriendlyButton variant="primary" fullWidth>
                زر أساسي (ملء العرض في الموبايل)
              </TouchFriendlyButton>
              <TouchFriendlyButton variant="secondary" fullWidth>
                زر ثانوي
              </TouchFriendlyButton>
              <TouchFriendlyButton variant="outline">
                زر مخطط (عرض تلقائي في الكمبيوتر)
              </TouchFriendlyButton>
            </div>
          </ResponsiveCard>

          {/* Typography Example */}
          <ResponsiveCard>
            <ResponsiveText weight="bold" className="text-[#01411C] mb-4">
              النصوص المتجاوبة
            </ResponsiveText>
            <div className="space-y-2">
              <ResponsiveText as="h3" size="lg" weight="bold">
                عنوان كبير متجاوب
              </ResponsiveText>
              <ResponsiveText size="base">
                نص عادي يتكيف مع حجم الشاشة ويدعم اللغة العربية بشكل كامل
              </ResponsiveText>
              <ResponsiveText size="sm" className="text-gray-600">
                نص صغير للتفاصيل الإضافية
              </ResponsiveText>
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>
      </div>

      {/* Guidelines Summary */}
      <ResponsiveCard className="mt-12 bg-[#01411C] text-white">
        <ResponsiveText as="h3" size="lg" weight="bold" className="mb-4 text-center">
          ملخص الإرشادات المطبقة
        </ResponsiveText>
        <ResponsiveGrid cols={{ xs: 1, md: 2, lg: 3 }} gap={4}>
          <div className="text-center">
            <Type className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <ResponsiveText size="sm" weight="medium">خط عربي واضح</ResponsiveText>
          </div>
          <div className="text-center">
            <Layout className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <ResponsiveText size="sm" weight="medium">تخطيط متجاوب</ResponsiveText>
          </div>
          <div className="text-center">
            <Zap className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
            <ResponsiveText size="sm" weight="medium">تفاعل محسن</ResponsiveText>
          </div>
        </ResponsiveGrid>
      </ResponsiveCard>
    </ResponsiveContainer>
  );
}