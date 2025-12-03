import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  Globe, 
  Palette, 
  Layout, 
  Eye, 
  Smartphone, 
  Monitor,
  CheckCircle,
  Star,
  Zap,
  Share2
} from 'lucide-react';

interface WebsiteCreatorProps {
  onBack: () => void;
}

interface WebsiteData {
  companyName: string;
  domain: string;
  template: string;
  primaryColor: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  services: string[];
}

export function WebsiteCreator({ onBack }: WebsiteCreatorProps) {
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    companyName: '',
    domain: '',
    template: '',
    primaryColor: '#01411C',
    description: '',
    phone: '',
    email: '',
    address: '',
    services: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      id: 'modern',
      name: 'عصري',
      description: 'تصميم نظيف وعصري مع تركيز على البساطة',
      preview: '🎨',
      popular: true
    },
    {
      id: 'luxury',
      name: 'فاخر',
      description: 'تصميم أنيق ومتطور للعقارات الراقية',
      preview: '👑',
      popular: false
    },
    {
      id: 'minimal',
      name: 'بسيط',
      description: 'تصميم بسيط يركز على المحتوى',
      preview: '⚡',
      popular: true
    },
    {
      id: 'professional',
      name: 'مهني',
      description: 'تصميم مهني للشركات العقارية الكبيرة',
      preview: '🏢',
      popular: false
    }
  ];

  const colorOptions = [
    { name: 'أخضر ملكي', value: '#01411C' },
    { name: 'أزرق داكن', value: '#1e40af' },
    { name: 'رمادي أنيق', value: '#374151' },
    { name: 'بني دافئ', value: '#92400e' },
    { name: 'أزرق فاتح', value: '#0ea5e9' },
    { name: 'أخضر طبيعي', value: '#059669' }
  ];

  const serviceOptions = [
    'بيع العقارات',
    'تأجير العقارات',
    'إدارة العقارات',
    'استشارات عقارية',
    'تقييم العقارات',
    'تطوير العقارات',
    'تسويق عقاري',
    'خدمات تمويل عقاري'
  ];

  const updateWebsiteData = (field: keyof WebsiteData, value: any) => {
    setWebsiteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleService = (service: string) => {
    const currentServices = websiteData.services;
    if (currentServices.includes(service)) {
      updateWebsiteData('services', currentServices.filter(s => s !== service));
    } else {
      updateWebsiteData('services', [...currentServices, service]);
    }
  };

  const generateWebsite = () => {
    setIsGenerating(true);
    
    // محاكاة إنشاء الموقع
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(4);
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep === 3) {
      generateWebsite();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'معلومات الشركة';
      case 2: return 'اختيار التصميم';
      case 3: return 'التخصيص والإعدادات';
      case 4: return 'موقعك جاهز!';
      default: return '';
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
        <h1 className="text-2xl font-bold text-[#01411C]">إنشاء موقع إلكتروني</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* مؤشر التقدم */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-[#01411C] text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`h-1 w-20 ml-4 ${
                    step < currentStep ? 'bg-[#01411C]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#01411C]">
              الخطوة {currentStep}: {getStepTitle(currentStep)}
            </h2>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <Card className="border-2 border-[#D4AF37] shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-[#01411C] mb-2">جاري إنشاء موقعك...</h3>
              <p className="text-gray-600 mb-4">يتم تجهيز موقعك الإلكتروني بالتصميم والمحتوى المطلوب</p>
              <div className="text-sm text-gray-500">
                هذا قد يستغرق بضع دقائق
              </div>
            </CardContent>
          </Card>
        )}

        {/* المحتوى */}
        {!isGenerating && (
          <Card className="border-2 border-[#D4AF37] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Globe className="w-6 h-6" />
                {getStepTitle(currentStep)}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* الخطوة 1: معلومات الشركة */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-[#01411C] font-medium">
                      🏢 اسم الشركة *
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="مثال: مؤسسة العقارات المتميزة"
                      value={websiteData.companyName}
                      onChange={(e) => updateWebsiteData('companyName', e.target.value)}
                      className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-[#01411C] font-medium">
                      🌐 اسم النطاق المرغوب
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="domain"
                        placeholder="mycompany"
                        value={websiteData.domain}
                        onChange={(e) => updateWebsiteData('domain', e.target.value)}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span className="text-gray-500">.waseeti.sa</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      سيكون رابط موقعك: {websiteData.domain || 'mycompany'}.waseeti.sa
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#01411C] font-medium">
                      📝 نبذة عن الشركة
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="اكتب نبذة مختصرة عن شركتك وخدماتها..."
                      value={websiteData.description}
                      onChange={(e) => updateWebsiteData('description', e.target.value)}
                      className="border-[#D4AF37] focus:ring-[#D4AF37] min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#01411C] font-medium">
                        📞 رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        placeholder="05xxxxxxxx"
                        value={websiteData.phone}
                        onChange={(e) => updateWebsiteData('phone', e.target.value)}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#01411C] font-medium">
                        📧 البريد الإلكتروني
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@company.com"
                        value={websiteData.email}
                        onChange={(e) => updateWebsiteData('email', e.target.value)}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-[#01411C] font-medium">
                        📍 العنوان
                      </Label>
                      <Input
                        id="address"
                        placeholder="الرياض، السعودية"
                        value={websiteData.address}
                        onChange={(e) => updateWebsiteData('address', e.target.value)}
                        className="border-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* الخطوة 2: اختيار التصميم */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[#01411C] font-medium">🎨 اختر قالب التصميم</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer border-2 transition-all hover:shadow-lg ${
                            websiteData.template === template.id
                              ? 'border-[#D4AF37] bg-[#f0fdf4]'
                              : 'border-gray-200 hover:border-[#D4AF37]'
                          }`}
                          onClick={() => updateWebsiteData('template', template.id)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="text-4xl mb-4">{template.preview}</div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h3 className="font-bold text-[#01411C]">{template.name}</h3>
                              {template.popular && (
                                <Badge className="bg-[#D4AF37] text-[#01411C]">
                                  <Star className="w-3 h-3 ml-1" />
                                  مشهور
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[#01411C] font-medium">🎨 اللون الأساسي</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            websiteData.primaryColor === color.value
                              ? 'border-[#D4AF37] shadow-lg'
                              : 'border-gray-200 hover:border-[#D4AF37]'
                          }`}
                          onClick={() => updateWebsiteData('primaryColor', color.value)}
                        >
                          <div
                            className="w-full h-8 rounded mb-2"
                            style={{ backgroundColor: color.value }}
                          ></div>
                          <p className="text-xs text-center">{color.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* الخطوة 3: التخصيص والإعدادات */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[#01411C] font-medium">🛠️ الخدمات المقدمة</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {serviceOptions.map((service) => (
                        <div
                          key={service}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                            websiteData.services.includes(service)
                              ? 'border-[#D4AF37] bg-[#f0fdf4] text-[#01411C]'
                              : 'border-gray-200 hover:border-[#D4AF37] text-gray-600'
                          }`}
                          onClick={() => toggleService(service)}
                        >
                          <p className="text-sm font-medium">{service}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* معاينة سطح المكتب والموبايل */}
                  <div className="bg-[#f0fdf4] p-6 rounded-lg border border-[#D4AF37]">
                    <h3 className="font-semibold text-[#01411C] mb-4">👁️ معاينة الموقع:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <Monitor className="w-12 h-12 text-[#01411C] mx-auto mb-2" />
                        <h4 className="font-medium text-[#01411C] mb-2">سطح المكتب</h4>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 aspect-video">
                          <div className="h-full flex flex-col">
                            <div className="h-8 bg-gray-100 rounded mb-2"></div>
                            <div className="flex-1 bg-gray-50 rounded"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Smartphone className="w-12 h-12 text-[#01411C] mx-auto mb-2" />
                        <h4 className="font-medium text-[#01411C] mb-2">الهاتف المحمول</h4>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-2 aspect-[9/16] max-w-32 mx-auto">
                          <div className="h-full flex flex-col">
                            <div className="h-6 bg-gray-100 rounded mb-2"></div>
                            <div className="flex-1 bg-gray-50 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* الخطوة 4: الموقع جاهز */}
              {currentStep === 4 && (
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#01411C] mb-4">
                    🎉 تهانينا! موقعك جاهز الآن
                  </h3>
                  
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    تم إنشاء موقعك الإلكتروني بنجاح وهو جاهز لاستقبال الزوار. يمكنك الآن مشاركة الرابط مع عملائك.
                  </p>

                  <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#D4AF37] mb-6">
                    <p className="text-sm text-gray-600 mb-2">رابط موقعك:</p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="bg-white px-3 py-2 rounded border text-[#01411C] font-medium">
                        {websiteData.domain || 'mycompany'}.waseeti.sa
                      </code>
                      <Button size="sm" className="bg-[#01411C] hover:bg-[#065f41] text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button className="bg-[#01411C] hover:bg-[#065f41] text-white">
                      <Eye className="w-4 h-4 ml-2" />
                      معاينة الموقع
                    </Button>
                    <Button variant="outline" className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]">
                      تحرير المحتوى
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
                    <h4 className="font-semibold text-blue-800 mb-2">✨ الخطوات التالية:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• إضافة المزيد من العقارات</li>
                      <li>• تخصيص الألوان والخطوط</li>
                      <li>• ربط وسائل التواصل الاجتماعي</li>
                      <li>• إعداد نماذج التواصل</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* أزرار التنقل */}
              {currentStep < 4 && (
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                    disabled={currentStep === 1}
                  >
                    السابق
                  </Button>

                  <Button
                    onClick={nextStep}
                    className="bg-[#01411C] hover:bg-[#065f41] text-white"
                    disabled={currentStep === 1 && !websiteData.companyName}
                  >
                    {currentStep === 3 ? (
                      <>
                        <Zap className="w-4 h-4 ml-2" />
                        إنشاء الموقع
                      </>
                    ) : (
                      'التالي'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}