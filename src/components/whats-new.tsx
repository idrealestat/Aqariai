import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Star,
  Zap,
  Smartphone,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface WhatsNewProps {
  onBack: () => void;
}

interface Update {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'security';
  title: string;
  description: string;
  details: string[];
  isNew: boolean;
  icon: React.ReactNode;
}

export function WhatsNew({ onBack }: WhatsNewProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null);

  const updates: Update[] = [
    {
      id: '1',
      version: '2.5.0',
      date: '2024-01-15',
      type: 'feature',
      title: 'نظام العروض المطور الجديد',
      description: 'نظام شامل لإدارة العروض العقارية مع فصل واجهات العملاء والوسطاء',
      details: [
        'واجهة منفصلة للعملاء لتصفح العروض',
        'لوحة تحكم متطورة للوسطاء',
        'نظام تقييم وتصنيف العروض',
        'إشعارات فورية للعروض الجديدة',
        'تحليلات متقدمة للأداء'
      ],
      isNew: true,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: '2',
      version: '2.4.8',
      date: '2024-01-10',
      type: 'improvement',
      title: 'تحسينات واجهة المستخدم',
      description: 'تحسينات شاملة على التصميم وسهولة الاستخدام',
      details: [
        'تصميم أكثر عصرية وجاذبية',
        'تحسين الألوان والخطوط العربية',
        'واجهة أكثر سهولة للمبتدئين',
        'تحسين التنقل بين الصفحات',
        'إضافة المزيد من الرموز التوضيحية'
      ],
      isNew: true,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: '3',
      version: '2.4.7',
      date: '2024-01-05',
      type: 'feature',
      title: 'إدارة المهام والتذكيرات',
      description: 'نظام متكامل لإدارة المهام اليومية وجدولة المتابعات',
      details: [
        'إنشاء وإدارة المهام اليومية',
        'تذكيرات ذكية للمواعيد',
        'تصنيف المهام حسب الأولوية',
        'تتبع تقدم إنجاز المهام',
        'تقارير الإنتاجية الشخصية'
      ],
      isNew: false,
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: '4',
      version: '2.4.6',
      date: '2024-01-01',
      type: 'feature',
      title: 'نظام تحليلات السوق',
      description: 'تحليلات متقدمة لاتجاهات السوق العقاري والأسعار',
      details: [
        'تحليل أسعار العقارات حسب المنطقة',
        'إحصائيات العرض والطلب',
        'توقعات الأسعار المستقبلية',
        'مقارنة الأحياء والمدن',
        'تقارير شهرية مفصلة'
      ],
      isNew: false,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: '5',
      version: '2.4.5',
      date: '2023-12-25',
      type: 'security',
      title: 'تحسينات الأمان',
      description: 'تعزيز حماية البيانات وأمان التطبيق',
      details: [
        'تشفير أقوى للبيانات الحساسة',
        'مصادقة ثنائية اختيارية',
        'مراقبة أنشطة الحساب',
        'حماية من محاولات الاختراق',
        'نسخ احتياطية آمنة للبيانات'
      ],
      isNew: false,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: '6',
      version: '2.4.4',
      date: '2023-12-20',
      type: 'feature',
      title: 'إدارة الفريق والزملاء',
      description: 'أدوات متطورة لإدارة فرق العمل والتعاون',
      details: [
        'دعوة زملاء جدد للفريق',
        'إدارة الصلاحيات والأدوار',
        'تتبع أداء أعضاء الفريق',
        'مشاركة العملاء والعقارات',
        'إحصائيات الفريق الموحدة'
      ],
      isNew: false,
      icon: <Users className="w-5 h-5" />
    },
    {
      id: '7',
      version: '2.4.3',
      date: '2023-12-15',
      type: 'improvement',
      title: 'تحسين الأداء والسرعة',
      description: 'تحسينات جذرية على سرعة التطبيق واستجابته',
      details: [
        'تحميل أسرع للصفحات بنسبة 60%',
        'تحسين استهلاك البطارية',
        'تحسين التنقل باللمس',
        'تحميل تدريجي للصور والبيانات',
        'تحسين الأداء على الأجهزة القديمة'
      ],
      isNew: false,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: '8',
      version: '2.4.2',
      date: '2023-12-10',
      type: 'feature',
      title: 'حجز المواعيد والدورات',
      description: 'نظام شامل لحجز المواعيد والتسجيل في الدورات التدريبية',
      details: [
        'حجز مواعيد المعاينات والاستشارات',
        'جدولة المواعيد الذكية',
        'التسجيل في دورات الوساطة',
        'تذكيرات المواعيد التلقائية',
        'إدارة التقويم الشخصي'
      ],
      isNew: false,
      icon: <Calendar className="w-5 h-5" />
    }
  ];

  const upcomingFeatures = [
    {
      title: 'ذكاء اصطناعي لتقييم العقارات',
      description: 'استخدام الذكاء الاصطناعي لتقدير أسعار العقارات تلقائياً',
      expectedDate: 'فبراير 2024'
    },
    {
      title: 'تطبيق الهاتف المحمول',
      description: 'تطبيق مخصص للهواتف الذكية مع جميع المزايا',
      expectedDate: 'مارس 2024'
    },
    {
      title: 'التكامل مع منصات التواصل',
      description: 'ربط مباشر مع فيسبوك وإنستغرام للتسويق',
      expectedDate: 'أبريل 2024'
    }
  ];

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'feature':
        return { label: 'ميزة جديدة', color: 'bg-blue-100 text-blue-800' };
      case 'improvement':
        return { label: 'تحسين', color: 'bg-green-100 text-green-800' };
      case 'bugfix':
        return { label: 'إصلاح', color: 'bg-yellow-100 text-yellow-800' };
      case 'security':
        return { label: 'أمان', color: 'bg-red-100 text-red-800' };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold text-[#01411C]">ما الجديد</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* إحصائيات التحديثات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-[#D4AF37]">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#01411C]" />
                <span className="text-2xl font-bold text-[#01411C]">
                  {updates.filter(u => u.isNew).length}
                </span>
              </div>
              <p className="text-sm text-gray-600">تحديثات جديدة</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {updates.filter(u => u.type === 'feature').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">مزايا جديدة</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {updates.filter(u => u.type === 'improvement').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">تحسينات</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">
                  {updates.filter(u => u.type === 'security').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">تحديثات أمان</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* التحديثات الأخيرة */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#D4AF37] shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  آخر التحديثات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {updates.map((update) => {
                    const typeInfo = getTypeInfo(update.type);
                    const isExpanded = selectedUpdate === update.id;
                    
                    return (
                      <Card 
                        key={update.id} 
                        className={`border hover:shadow-md transition-all cursor-pointer ${
                          update.isNew ? 'border-[#D4AF37] bg-[#f0fdf4]' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedUpdate(isExpanded ? null : update.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#01411C] flex items-center justify-center text-white">
                                {update.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-[#01411C]">{update.title}</h3>
                                  {update.isNew && (
                                    <Badge className="bg-[#D4AF37] text-[#01411C] animate-pulse">
                                      جديد
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Badge className={typeInfo.color}>
                                    {typeInfo.label}
                                  </Badge>
                                  <span>الإصدار {update.version}</span>
                                  <span>•</span>
                                  <span>{update.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{update.description}</p>
                          
                          {isExpanded && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-[#01411C] mb-3">تفاصيل التحديث:</h4>
                              <ul className="space-y-2">
                                {update.details.map((detail, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-3 text-center">
                            <Button variant="ghost" className="text-[#01411C] hover:text-[#065f41]">
                              {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الميزات القادمة */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  قريباً
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingFeatures.map((feature, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-[#01411C] mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{feature.description}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">{feature.expectedDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ملاحظات التحديث */}
            <Card className="border-2 border-[#D4AF37] bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  ملاحظات مهمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white p-3 rounded border border-[#D4AF37]">
                  <p className="text-sm text-gray-700">
                    <strong>تحديث تلقائي:</strong> يتم تحديث التطبيق تلقائياً عند توفر إصدار جديد
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-[#D4AF37]">
                  <p className="text-sm text-gray-700">
                    <strong>نسخ البيانات:</strong> يتم إنشاء نسخة احتياطية قبل كل تحديث رئيسي
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-[#D4AF37]">
                  <p className="text-sm text-gray-700">
                    <strong>الدعم:</strong> في حالة مواجهة أي مشاكل، تواصل مع فريق الدعم
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* تقييم التحديث */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  قيّم التحديثات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  ما رأيك في التحديثات الأخيرة؟ تقييمك يساعدنا على التطوير
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className="p-1 hover:bg-transparent"
                    >
                      <Star className="w-5 h-5 text-yellow-500 hover:fill-current transition-colors" />
                    </Button>
                  ))}
                </div>
                <Button className="w-full bg-[#01411C] hover:bg-[#065f41] text-white">
                  إرسال التقييم
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}