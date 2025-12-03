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
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  GraduationCap,
  Award,
  CheckCircle,
  Star,
  Users,
  MapPin
} from 'lucide-react';

interface CourseBookingProps {
  onBack: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  format: 'حضوري' | 'عن بُعد' | 'مختلط';
  maxStudents: number;
  currentStudents: number;
  instructor: string;
  rating: number;
  nextSession: string;
  features: string[];
  certificate: boolean;
}

export function CourseBooking({ onBack }: CourseBookingProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [goals, setGoals] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const courses: Course[] = [
    {
      id: '1',
      title: 'دورة أساسيات الوساطة العقارية',
      description: 'دورة شاملة تغطي أسس الوساطة العقارية والقوانين السعودية',
      duration: '4 أسابيع',
      price: 2500,
      level: 'مبتدئ',
      format: 'مختلط',
      maxStudents: 20,
      currentStudents: 12,
      instructor: 'م. أحمد الزهراني',
      rating: 4.8,
      nextSession: '2024-01-15',
      certificate: true,
      features: [
        'مقدمة في الوساطة العقارية',
        'القوانين واللوائح السعودية',
        'كيفية تقييم العقارات',
        'مهارات التفاوض',
        'استخدام التكنولوجيا في العقارات'
      ]
    },
    {
      id: '2',
      title: 'دورة التسويق العقاري الرقمي',
      description: 'تعلم استراتيجيات التسويق الحديثة للعقارات',
      duration: '3 أسابيع',
      price: 2000,
      level: 'متوسط',
      format: 'عن بُعد',
      maxStudents: 25,
      currentStudents: 8,
      instructor: 'أ. فاطمة السعيد',
      rating: 4.9,
      nextSession: '2024-01-20',
      certificate: true,
      features: [
        'التسويق عبر وسائل التواصل الاجتماعي',
        'إنشاء المحتوى المرئي',
        'استخدام الإعلانات المدفوعة',
        'تحليل البيانات والمقاييس',
        'بناء العلامة التجارية الشخصية'
      ]
    },
    {
      id: '3',
      title: 'دورة إدارة الاستثمار العقاري',
      description: 'دورة متقدمة في إدارة وتطوير الاستثمارات العقارية',
      duration: '6 أسابيع',
      price: 4000,
      level: 'متقدم',
      format: 'حضوري',
      maxStudents: 15,
      currentStudents: 5,
      instructor: 'د. محمد الراشد',
      rating: 4.7,
      nextSession: '2024-02-01',
      certificate: true,
      features: [
        'تحليل السوق العقاري',
        'إدارة المخاطر',
        'التمويل العقاري',
        'تطوير المشاريع',
        'إدارة المحافظ العقارية'
      ]
    }
  ];

  const experienceLevels = [
    'مبتدئ تماماً',
    'لدي خبرة بسيطة',
    'خبرة متوسطة',
    'خبرة عالية',
    'خبير في المجال'
  ];

  const paymentMethods = [
    'تحويل بنكي',
    'بطاقة ائتمانية',
    'مدى',
    'التقسيط (3 أشهر)',
    'التقسيط (6 أشهر)'
  ];

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  const handleBooking = () => {
    if (!selectedCourse || !studentName || !studentPhone || !paymentMethod) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    alert('تم تسجيلك بنجاح! سيتم التواصل معك لتأكيد التسجيل وتفاصيل الدفع.');
    
    // إعادة تعيين النموذج
    setSelectedCourse('');
    setStudentName('');
    setStudentPhone('');
    setStudentEmail('');
    setExperience('');
    setGoals('');
    setPaymentMethod('');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'مبتدئ': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'متقدم': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'حضوري': return 'bg-blue-100 text-blue-800';
      case 'عن بُعد': return 'bg-purple-100 text-purple-800';
      case 'مختلط': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-[#01411C]">التسجيل في دورة الوساطة</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* عرض الدورات المتاحة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedCourse === course.id 
                  ? 'border-[#D4AF37] bg-[#f0fdf4]' 
                  : 'border-gray-200 hover:border-[#D4AF37]'
              }`}
              onClick={() => setSelectedCourse(course.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#01411C] mb-2">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                      <Badge className={getFormatColor(course.format)}>
                        {course.format}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-[#D4AF37]">
                      {course.price.toLocaleString()} ريال
                    </div>
                    <div className="text-sm text-gray-500">{course.duration}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{course.currentStudents}/{course.maxStudents}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-[#01411C]" />
                    <span>المدرب: {course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#01411C]" />
                    <span>البداية: {course.nextSession}</span>
                  </div>
                  {course.certificate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span>شهادة معتمدة</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium text-[#01411C] text-sm">محتوى الدورة:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {course.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* نموذج التسجيل */}
        {selectedCourse && (
          <Card className="border-2 border-[#D4AF37] shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <BookOpen className="w-6 h-6" />
                تسجيل في الدورة: {selectedCourseData?.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* بيانات الطالب */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#01411C] font-medium">
                    👤 الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#01411C] font-medium">
                    📞 رقم الجوال *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="border-[#D4AF37] focus:ring-[#D4AF37]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#01411C] font-medium">
                  📧 البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="border-[#D4AF37] focus:ring-[#D4AF37]"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-[#01411C] font-medium">
                  📊 مستوى الخبرة الحالي
                </Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                    <SelectValue placeholder="اختر مستوى خبرتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals" className="text-[#01411C] font-medium">
                  🎯 أهدافك من الدورة
                </Label>
                <Textarea
                  id="goals"
                  placeholder="ما الذي تأمل في تحقيقه من خلال هذه الدورة؟"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="border-[#D4AF37] focus:ring-[#D4AF37] min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment" className="text-[#01411C] font-medium">
                  💳 طريقة الدفع *
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="border-[#D4AF37] focus:ring-[#D4AF37]">
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ملخص الطلب */}
              {selectedCourseData && (
                <div className="bg-[#f0fdf4] p-4 rounded-lg border border-[#D4AF37]">
                  <h3 className="font-semibold text-[#01411C] mb-3">ملخص التسجيل:</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">الدورة:</span> {selectedCourseData.title}</div>
                    <div><span className="font-medium">السعر:</span> {selectedCourseData.price.toLocaleString()} ريال</div>
                    <div><span className="font-medium">المدة:</span> {selectedCourseData.duration}</div>
                    <div><span className="font-medium">المدرب:</span> {selectedCourseData.instructor}</div>
                    <div><span className="font-medium">تاريخ البداية:</span> {selectedCourseData.nextSession}</div>
                    <div><span className="font-medium">نوع الدورة:</span> {selectedCourseData.format}</div>
                  </div>
                </div>
              )}

              {/* أزرار التحكم */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleBooking}
                  className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white py-3"
                  disabled={!selectedCourse || !studentName || !studentPhone || !paymentMethod}
                >
                  <BookOpen className="w-4 h-4 ml-2" />
                  تأكيد التسجيل
                </Button>
                
                <Button
                  onClick={() => setSelectedCourse('')}
                  variant="outline"
                  className="flex-1 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C] py-3"
                >
                  اختيار دورة أخرى
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* معلومات مفيدة */}
        <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 معلومات مهمة:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• جميع الدورات معتمدة من الهيئة العامة للعقار</li>
              <li>• يتم إرسال شهادة إتمام رقمية بعد اجتياز الدورة</li>
              <li>• إمكانية الحصول على استشارات مجانية لمدة 3 أشهر بعد الدورة</li>
              <li>• خصم 20% للتسجيل المبكر (قبل 15 يوم من بداية الدورة)</li>
              <li>• إمكانية استرداد 100% من الرسوم في حالة إلغاء الدورة من قبلنا</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}