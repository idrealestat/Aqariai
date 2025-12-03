/**
 * 📋 صفحة الطلبات الخاصة - Special Requests Page
 * ────────────────────────────────────────────────────────────────
 * 🎯 الهدف: السماح للوسيط بطلب عقار محدد وبمواصفات دقيقة جداً
 * 💡 الفكرة: 
 *    1. الوسيط يبحث عن عقار معين (أرض، فيلا، شقة محددة)
 *    2. يرسل طلب خاص بتفاصيل دقيقة جداً
 *    3. النظام يبحث في قاعدة بيانات العقارات المعلنة
 *    4. عند الإيجاد: إشعار الوسيط + طلب دفع مقابل المعلومات
 *    5. بعد الدفع: إرسال معلومات الوسيط المعلن والعقار كاملة
 * 
 * 💰 نموذج الربح:
 *    - رسوم على كل طلب ناجح (مثلاً: 100-500 ريال)
 *    - اشتراك شهري للطلبات غير المحدودة
 * ────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Star,
  Phone,
  MessageSquare,
  X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { notifySpecialRequestCreated, notifySpecialRequestMatched } from '../utils/notificationsSystem';

interface SpecialRequestsPageProps {
  onBack: () => void;
  currentUser?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

// أنواع العقارات
const PROPERTY_TYPES = [
  { id: 'apartment', label: 'شقة', icon: '🏢' },
  { id: 'villa', label: 'فيلا', icon: '🏡' },
  { id: 'land', label: 'أرض', icon: '🏞️' },
  { id: 'building', label: 'عمارة', icon: '🏢' },
  { id: 'duplex', label: 'دبلكس', icon: '🏘️' },
  { id: 'commercial', label: 'تجاري', icon: '🏬' },
  { id: 'farm', label: 'مزرعة', icon: '🌾' },
  { id: 'other', label: 'أخرى', icon: '📦' }
];

// المدن السعودية
const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 
  'الخبر', 'الطائف', 'تبوك', 'أبها', 'حائل', 'الجبيل', 'ينبع'
];

export default function SpecialRequestsPage({ onBack, currentUser }: SpecialRequestsPageProps) {
  const [step, setStep] = useState<'form' | 'preview' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  
  // بيانات النموذج
  const [formData, setFormData] = useState({
    propertyType: '',
    city: '',
    district: '',
    specificLocation: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    urgency: 'normal', // normal, urgent, very-urgent
    budget: '', // budget for the request fee
  });

  // الطلبات السابقة
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'create' | 'view'>('create');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // تحميل الطلبات السابقة
  useEffect(() => {
    const requestsKey = `special_requests_${currentUser?.phone || 'guest'}`;
    const saved = localStorage.getItem(requestsKey);
    if (saved) {
      setMyRequests(JSON.parse(saved));
    }
  }, [currentUser]);

  // حفظ الطلب
  const handleSubmit = () => {
    // التحقق من البيانات الأساسية
    if (!formData.propertyType || !formData.city) {
      toast.error('يرجى إدخال نوع العقار والمدينة على الأقل');
      return;
    }

    setStep('preview');
  };

  // تأكيد والانتقال للدفع
  const handleConfirm = () => {
    setStep('payment');
  };

  // إتمام الطلب بعد الدفع
  const handlePayment = () => {
    setLoading(true);
    
    // محاكاة عملية الدفع
    setTimeout(() => {
      const newRequest = {
        id: `REQ-${Date.now()}`,
        ...formData,
        status: 'searching', // searching, found, paid, completed
        submittedAt: new Date().toISOString(),
        userName: currentUser?.name || 'ضيف',
        userPhone: currentUser?.phone || '',
      };

      // حفظ الطلب
      const requestsKey = `special_requests_${currentUser?.phone || 'guest'}`;
      const existingRequests = JSON.parse(localStorage.getItem(requestsKey) || '[]');
      existingRequests.unshift(newRequest);
      localStorage.setItem(requestsKey, JSON.stringify(existingRequests));
      
      setMyRequests(existingRequests);
      setLoading(false);
      setStep('success');
      
      toast.success('✅ تم إرسال طلبك الخاص بنجاح!');
      
      // إرسال إشعار طلب خاص جديد
      notifySpecialRequestCreated({
        id: newRequest.id,
        propertyType: PROPERTY_TYPES.find(t => t.id === formData.propertyType)?.label || 'عقار',
        location: `${formData.city}${formData.district ? ` - ${formData.district}` : ''}`,
        budget: formData.minPrice && formData.maxPrice 
          ? `${Number(formData.minPrice).toLocaleString()} - ${Number(formData.maxPrice).toLocaleString()} ريال`
          : 'غير محدد'
      });
      
      // إرسال الطلب للبحث في قاعدة البيانات
      searchForProperty(newRequest);
    }, 2000);
  };

  // البحث عن العقار في قاعدة البيانات
  const searchForProperty = (request: any) => {
    // هنا يمكن ربط النظام مع قاعدة بيانات العقارات
    console.log('🔍 جاري البحث عن عقار مطابق...', request);
    
    // محاكاة: البحث يستغرق وقت
    setTimeout(() => {
      // إشعار الوسيط عند الإيجاد
      const found = Math.random() > 0.5; // محاكاة
      
      if (found) {
        toast.success('🎉 تم العثور على عقار مطابق! سيتم التواصل معك قريباً.');
        
        // تحديث حالة الطلب
        const requestsKey = `special_requests_${currentUser?.phone || 'guest'}`;
        const requests = JSON.parse(localStorage.getItem(requestsKey) || '[]');
        const updated = requests.map((r: any) => 
          r.id === request.id ? { ...r, status: 'found' } : r
        );
        localStorage.setItem(requestsKey, JSON.stringify(updated));
        setMyRequests(updated);
        
        // إرسال إشعار للوسيط
        notifySpecialRequestMatched({
          requestId: request.id,
          propertyType: PROPERTY_TYPES.find(t => t.id === request.propertyType)?.label || 'عقار',
          location: `${request.city}${request.district ? ` - ${request.district}` : ''}`,
          ownerName: 'أحمد العقاري', // محاكاة - سيأتي من API
          ownerPhone: '0501234567' // محاكاة - سيأتي من API
        });
      }
    }, 5000);
  };

  // العودة لإنشاء طلب جديد
  const handleNewRequest = () => {
    setFormData({
      propertyType: '',
      city: '',
      district: '',
      specificLocation: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      urgency: 'normal',
      budget: '',
    });
    setStep('form');
    setViewMode('create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-2 border-[#D4AF37] hover:bg-white/20 bg-white/10 text-white"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              رجوع
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Target className="w-6 h-6 text-[#01411C]" />
              </div>
              <div className="text-right">
                <h1 className="text-lg font-bold text-white">الطلبات الخاصة</h1>
                <p className="text-xs text-white/80">ابحث عن عقار بمواصفات محددة</p>
              </div>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Toggle View Mode */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'create' ? 'default' : 'outline'}
            onClick={() => setViewMode('create')}
            className={viewMode === 'create' ? 'bg-[#01411C] text-white' : ''}
          >
            <Send className="w-4 h-4 ml-2" />
            إنشاء طلب جديد
          </Button>
          <Button
            variant={viewMode === 'view' ? 'default' : 'outline'}
            onClick={() => setViewMode('view')}
            className={viewMode === 'view' ? 'bg-[#01411C] text-white' : ''}
          >
            <Eye className="w-4 h-4 ml-2" />
            طلباتي ({myRequests.length})
          </Button>
        </div>

        {/* View My Requests */}
        {viewMode === 'view' && (
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <Card className="border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد طلبات بعد</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإنشاء طلبك الأول لبحث عن العقار المثالي</p>
                  <Button onClick={() => setViewMode('create')} className="bg-[#01411C]">
                    <Send className="w-4 h-4 ml-2" />
                    إنشاء طلب جديد
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myRequests.map((req) => (
                <Card key={req.id} className="border-2 border-[#D4AF37] hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-[#01411C]">
                            {PROPERTY_TYPES.find(t => t.id === req.propertyType)?.label || 'عقار'}
                          </h3>
                          <Badge className={
                            req.status === 'found' ? 'bg-green-500' :
                            req.status === 'searching' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }>
                            {req.status === 'found' ? '✅ تم الإيجاد' :
                             req.status === 'searching' ? '🔍 جاري البحث' :
                             '⏳ معلق'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline ml-1" />
                          {req.city} - {req.district || 'جميع الأحياء'}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500">رقم الطلب</p>
                        <p className="text-sm font-mono text-[#01411C]">{req.id}</p>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">السعر:</span>
                        <span className="font-medium mr-2">
                          {req.minPrice && req.maxPrice 
                            ? `${Number(req.minPrice).toLocaleString()} - ${Number(req.maxPrice).toLocaleString()} ريال`
                            : 'غير محدد'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">المساحة:</span>
                        <span className="font-medium mr-2">
                          {req.minArea && req.maxArea 
                            ? `${req.minArea} - ${req.maxArea} م²`
                            : 'غير محدد'}
                        </span>
                      </div>
                    </div>

                    {req.description && (
                      <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg">
                        {req.description}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => setSelectedRequest(req)}>
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </Button>
                      {req.status === 'found' && (
                        <Button size="sm" className="bg-green-600">
                          <CreditCard className="w-4 h-4 ml-2" />
                          ادفع واحصل على المعلومات
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Create New Request */}
        {viewMode === 'create' && (
          <AnimatePresence mode="wait">
            {/* Step 1: Form */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-2 border-[#D4AF37] shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                      اطلب عقارك المثالي
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      أدخل المواصفات الدقيقة للعقار الذي تبحث عنه وسنبحث لك في قاعدة بياناتنا
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Alert Info */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">كيف يعمل النظام؟</p>
                        <ol className="list-decimal mr-4 space-y-1">
                          <li>أدخل موصفات العقار بدقة</li>
                          <li>سنبحث في قاعدة بياناتنا عن عقار مطابق</li>
                          <li>عند الإيجاد: ستصلك رسالة فورية</li>
                          <li>ادفع رسوم المعلومات واحصل على تفاصيل العقار كاملة</li>
                        </ol>
                      </div>
                    </div>

                    {/* نوع العقار */}
                    <div>
                      <Label className="text-lg font-bold text-[#01411C] mb-3 block">
                        <Home className="w-5 h-5 inline ml-2" />
                        نوع العقار *
                      </Label>
                      <div className="grid grid-cols-4 gap-3">
                        {PROPERTY_TYPES.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setFormData({ ...formData, propertyType: type.id })}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              formData.propertyType === type.id
                                ? 'border-[#01411C] bg-[#01411C] text-white'
                                : 'border-gray-300 hover:border-[#D4AF37]'
                            }`}
                          >
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <div className="text-sm font-medium">{type.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* الموقع */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="font-bold text-[#01411C]">
                          <MapPin className="w-4 h-4 inline ml-1" />
                          المدينة *
                        </Label>
                        <select
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full mt-2 p-3 border-2 border-gray-300 rounded-lg focus:border-[#01411C] focus:ring-2 focus:ring-[#01411C]/20"
                        >
                          <option value="">اختر المدينة</option>
                          {SAUDI_CITIES.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="district" className="font-bold text-[#01411C]">الحي (اختياري)</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          placeholder="مثال: حي النرجس"
                          className="mt-2 border-2"
                        />
                      </div>
                    </div>

                    {/* موقع محدد */}
                    <div>
                      <Label htmlFor="specificLocation" className="font-bold text-[#01411C]">
                        موقع محدد (اختياري)
                      </Label>
                      <Input
                        id="specificLocation"
                        value={formData.specificLocation}
                        onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
                        placeholder="مثال: قريب من مدرسة الأمل، بجانب مسجد الهدى"
                        className="mt-2 border-2"
                      />
                    </div>

                    {/* السعر */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minPrice" className="font-bold text-[#01411C]">
                          <DollarSign className="w-4 h-4 inline ml-1" />
                          السعر الأدنى (ريال)
                        </Label>
                        <Input
                          id="minPrice"
                          type="number"
                          value={formData.minPrice}
                          onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                          placeholder="500,000"
                          className="mt-2 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxPrice" className="font-bold text-[#01411C]">السعر الأقصى (ريال)</Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          value={formData.maxPrice}
                          onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                          placeholder="1,000,000"
                          className="mt-2 border-2"
                        />
                      </div>
                    </div>

                    {/* المساحة */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minArea" className="font-bold text-[#01411C]">المساحة الأدنى (م²)</Label>
                        <Input
                          id="minArea"
                          type="number"
                          value={formData.minArea}
                          onChange={(e) => setFormData({ ...formData, minArea: e.target.value })}
                          placeholder="200"
                          className="mt-2 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxArea" className="font-bold text-[#01411C]">المساحة القصوى (م²)</Label>
                        <Input
                          id="maxArea"
                          type="number"
                          value={formData.maxArea}
                          onChange={(e) => setFormData({ ...formData, maxArea: e.target.value })}
                          placeholder="400"
                          className="mt-2 border-2"
                        />
                      </div>
                    </div>

                    {/* الغرف */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bedrooms" className="font-bold text-[#01411C]">عدد الغرف (اختياري)</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                          placeholder="3"
                          className="mt-2 border-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms" className="font-bold text-[#01411C]">عدد الحمامات (اختياري)</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                          placeholder="2"
                          className="mt-2 border-2"
                        />
                      </div>
                    </div>

                    {/* الوصف */}
                    <div>
                      <Label htmlFor="description" className="font-bold text-[#01411C]">
                        <FileText className="w-4 h-4 inline ml-1" />
                        وصف تفصيلي (اختياري)
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="أضف أي تفاصيل إضافية: تشطيب، موقع، مميزات..."
                        className="mt-2 border-2 min-h-[100px]"
                      />
                    </div>

                    {/* الاستعجال */}
                    <div>
                      <Label className="font-bold text-[#01411C] mb-3 block">
                        <Clock className="w-4 h-4 inline ml-1" />
                        مدى الاستعجال
                      </Label>
                      <RadioGroup value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v })}>
                        <div className="grid md:grid-cols-3 gap-3">
                          <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.urgency === 'normal' ? 'border-[#01411C] bg-[#01411C]/5' : 'border-gray-300'
                          }`}>
                            <RadioGroupItem value="normal" id="normal" />
                            <div>
                              <div className="font-medium">عادي</div>
                              <div className="text-xs text-gray-500">أسبوع - أسبوعين</div>
                            </div>
                          </label>
                          <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.urgency === 'urgent' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                          }`}>
                            <RadioGroupItem value="urgent" id="urgent" />
                            <div>
                              <div className="font-medium">مستعجل</div>
                              <div className="text-xs text-gray-500">3-5 أيام</div>
                            </div>
                          </label>
                          <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.urgency === 'very-urgent' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}>
                            <RadioGroupItem value="very-urgent" id="very-urgent" />
                            <div>
                              <div className="font-medium">مستعجل جداً</div>
                              <div className="text-xs text-gray-500">24 ساعة</div>
                            </div>
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={onBack} variant="outline" className="flex-1">
                        إلغاء
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        className="flex-1 bg-[#01411C] hover:bg-[#065f41]"
                      >
                        <Search className="w-4 h-4 ml-2" />
                        معاينة ومتابعة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-2 border-[#D4AF37] shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
                    <CardTitle>معاينة الطلب</CardTitle>
                    <CardDescription className="text-white/80">
                      تأكد من صحة المعلومات قبل الإرسال
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع العقار:</span>
                        <span className="font-bold text-[#01411C]">
                          {PROPERTY_TYPES.find(t => t.id === formData.propertyType)?.label}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-600">الموقع:</span>
                        <span className="font-bold">{formData.city} {formData.district && `- ${formData.district}`}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-600">نطاق السعر:</span>
                        <span className="font-bold">
                          {formData.minPrice && formData.maxPrice 
                            ? `${Number(formData.minPrice).toLocaleString()} - ${Number(formData.maxPrice).toLocaleString()} ريال`
                            : 'غير محدد'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-gray-600">الاستعجال:</span>
                        <Badge className={
                          formData.urgency === 'very-urgent' ? 'bg-red-500' :
                          formData.urgency === 'urgent' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }>
                          {formData.urgency === 'very-urgent' ? 'مستعجل جداً' :
                           formData.urgency === 'urgent' ? 'مستعجل' :
                           'عادي'}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-2">💰 رسوم الخدمة</h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex justify-between">
                          <span>رسوم البحث:</span>
                          <span className="font-bold">ماناً</span>
                        </div>
                        <div className="flex justify-between">
                          <span>رسوم المعلومات (عند الإيجاد):</span>
                          <span className="font-bold text-lg">
                            {formData.urgency === 'very-urgent' ? '500' :
                             formData.urgency === 'urgent' ? '300' :
                             '150'} ريال
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          * سيتم طلب الدفع فقط عند العثور على عقار مطابق
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => setStep('form')} variant="outline" className="flex-1">
                        <ArrowRight className="w-4 h-4 ml-2" />
                        تعديل
                      </Button>
                      <Button onClick={handleConfirm} className="flex-1 bg-[#01411C]">
                        تأكيد وإرسال
                        <Send className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment (simulated) */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="border-2 border-[#D4AF37] shadow-xl">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-[#01411C] rounded-full flex items-center justify-center mx-auto mb-6">
                      {loading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                      ) : (
                        <CreditCard className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-[#01411C] mb-4">
                      {loading ? 'جاري المعالجة...' : 'إرسال الطلب'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      سيتم إرسال طلبك للبحث في قاعدة البيانات فوراً
                    </p>
                    {!loading && (
                      <Button 
                        onClick={handlePayment} 
                        size="lg"
                        className="bg-[#01411C] hover:bg-[#065f41]"
                      >
                        <Send className="w-5 h-5 ml-2" />
                        إرسال الطلب الآن
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-green-500 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 mb-4">تم إرسال طلبك بنجاح!</h3>
                    <p className="text-gray-600 mb-6">
                      جاي البحث عن عقار مطابق في قاعدة بياناتنا. <br />
                      سنرسل لك إشعاراً فور العثور على تطابق.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={handleNewRequest} className="bg-[#01411C]">
                        <Send className="w-4 h-4 ml-2" />
                        إنشاء طلب جديد
                      </Button>
                      <Button onClick={() => setViewMode('view')} variant="outline">
                        <Eye className="w-4 h-4 ml-2" />
                        عرض طلباتي
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}