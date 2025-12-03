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
  Phone, 
  Mail, 
  MessageSquare, 
  Clock,
  MapPin,
  Send,
  HelpCircle,
  Bug,
  Lightbulb,
  Star,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface ContactUsProps {
  onBack: () => void;
}

export function ContactUs({ onBack }: ContactUsProps) {
  const [messageData, setMessageData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'technical', label: 'مشكلة تقنية', icon: <Bug className="w-4 h-4" /> },
    { value: 'billing', label: 'استفسار مالي', icon: <Star className="w-4 h-4" /> },
    { value: 'feature', label: 'طلب ميزة جديدة', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'general', label: 'استفسار عام', icon: <HelpCircle className="w-4 h-4" /> },
    { value: 'account', label: 'مشكلة في الحساب', icon: <Mail className="w-4 h-4" /> }
  ];

  const priorities = [
    { value: 'low', label: 'منخفضة', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'عالية', color: 'bg-red-100 text-red-800' }
  ];

  const contactMethods = [
    {
      type: 'phone',
      title: 'الهاتف',
      value: '+966 11 234 5678',
      description: 'متاح من السبت إلى الخميس، 9 صباحاً - 6 مساءً',
      icon: <Phone className="w-6 h-6" />,
      color: 'border-blue-200 bg-blue-50'
    },
    {
      type: 'email',
      title: 'البريد الإلكتروني',
      value: 'support@waseeti.sa',
      description: 'نرد خلال 24 ساعة',
      icon: <Mail className="w-6 h-6" />,
      color: 'border-green-200 bg-green-50'
    },
    {
      type: 'whatsapp',
      title: 'واتساب',
      value: '+966 55 123 4567',
      description: 'دعم فوري، متاح 24/7',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'border-[#D4AF37] bg-yellow-50'
    }
  ];

  const faqItems = [
    {
      question: 'كيف يمكنني تغيير خطة الاشتراك؟',
      answer: 'يمكنك تغيير خطة الاشتراك من خلال الإعدادات > الاشتراك والفواتير'
    },
    {
      question: 'هل يمكنني استرداد المبلغ المدفوع؟',
      answer: 'نعم، يمكن استرداد المبلغ خلال 30 يوم من تاريخ الدفع حسب شروط الاسترداد'
    },
    {
      question: 'كيف أضيف زملاء جدد لفريقي؟',
      answer: 'اذهب إلى صفحة الزملاء واضغط على "دعوة زميل" وأدخل بياناته'
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل بطاقات الائتمان، مدى، التحويل البنكي، وأبل باي'
    }
  ];

  const handleSubmit = async () => {
    if (!messageData.name || !messageData.email || !messageData.message) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    // محاكاة إرسال الرسالة
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // إعادة تعيين النموذج بعد 3 ثواني
      setTimeout(() => {
        setIsSubmitted(false);
        setMessageData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: '',
          priority: 'medium'
        });
      }, 3000);
    }, 2000);
  };

  const openWhatsApp = () => {
    const phone = '966551234567';
    const message = 'مرحباً، أحتاج مساعدة في تطبيق وسِيطي';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openEmail = () => {
    window.open('mailto:support@waseeti.sa?subject=استفسار من تطبيق وسِيطي', '_blank');
  };

  const openPhone = () => {
    window.open('tel:+966112345678', '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4 flex items-center justify-center" dir="rtl">
        <Card className="border-2 border-[#D4AF37] shadow-xl max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#01411C] mb-2">تم الإرسال بنجاح!</h3>
            <p className="text-gray-600 mb-4">
              شكراً لك على تواصلك معنا. سنرد عليك خلال 24 ساعة عبر البريد الإلكتروني.
            </p>
            <Button onClick={onBack} className="bg-[#01411C] hover:bg-[#065f41] text-white">
              العودة للوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-[#01411C]">اتصل بنا</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* طرق التواصل السريع */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card 
              key={index} 
              className={`border-2 ${method.color} hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => {
                if (method.type === 'phone') openPhone();
                else if (method.type === 'email') openEmail();
                else if (method.type === 'whatsapp') openWhatsApp();
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-md">
                  <div className="text-[#01411C]">{method.icon}</div>
                </div>
                <h3 className="font-semibold text-[#01411C] mb-2">{method.title}</h3>
                <p className="text-lg font-medium text-gray-800 mb-2">{method.value}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
                <div className="mt-4">
                  <Button className="bg-[#01411C] hover:bg-[#065f41] text-white">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    تواصل الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* نموذج التواصل */}
          <Card className="border-2 border-[#D4AF37] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <Send className="w-6 h-6" />
                إرسال رسالة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    placeholder="أدخل اسمك"
                    value={messageData.name}
                    onChange={(e) => setMessageData({...messageData, name: e.target.value})}
                    className="border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={messageData.email}
                    onChange={(e) => setMessageData({...messageData, email: e.target.value})}
                    className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                  <Input
                    id="phone"
                    placeholder="05xxxxxxxx"
                    value={messageData.phone}
                    onChange={(e) => setMessageData({...messageData, phone: e.target.value})}
                    className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع الاستفسار</Label>
                  <Select value={messageData.category} onValueChange={(value) => setMessageData({...messageData, category: value})}>
                    <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                      <SelectValue placeholder="اختر نوع الاستفسار" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            {category.icon}
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">موضوع الرسالة</Label>
                <Input
                  id="subject"
                  placeholder="اكتب موضوع رسالتك"
                  value={messageData.subject}
                  onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                  className="border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <Label>أولوية الرسالة</Label>
                <div className="flex gap-2">
                  {priorities.map((priority) => (
                    <Button
                      key={priority.value}
                      onClick={() => setMessageData({...messageData, priority: priority.value})}
                      variant={messageData.priority === priority.value ? 'default' : 'outline'}
                      className={messageData.priority === priority.value ? 'bg-[#01411C] text-white' : 'border-[#D4AF37] text-[#01411C]'}
                    >
                      {priority.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">الرسالة *</Label>
                <Textarea
                  id="message"
                  placeholder="اكتب رسالتك هنا..."
                  value={messageData.message}
                  onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                  className="border-[#D4AF37] focus:ring-[#D4AF37] min-h-[120px] resize-none"
                />
                <p className="text-sm text-gray-500">
                  {messageData.message.length}/500 حرف
                </p>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#01411C] hover:bg-[#065f41] text-white py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال الرسالة
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* الأسئلة الشائعة */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  الأسئلة الشائعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-[#01411C] mb-2">{item.question}</h4>
                    <p className="text-gray-700 text-sm">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ساعات العمل */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  ساعات العمل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>السبت - الأربعاء</span>
                    <span>9:00 ص - 6:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الخميس</span>
                    <span>9:00 ص - 2:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الجمعة</span>
                    <span className="text-red-600">مغلق</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>ملاحظة:</strong> الدعم عبر واتساب متاح 24/7 للحالات العاجلة
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* العنوان */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  العنوان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  شركة وسِيطي للتقنية<br />
                  طريق الملك فهد، حي العليا<br />
                  الرياض 12211، المملكة العربية السعودية
                </p>
                <Button variant="outline" className="border-[#D4AF37] text-[#01411C]">
                  <ExternalLink className="w-4 h-4 ml-2" />
                  عرض على الخريطة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}