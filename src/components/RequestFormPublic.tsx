/**
 * 📨 نموذج إرسال طلب عقاري - النسخة العامة للعميل
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: السماح للعميل بإرسال طلب مباشرة للوسيط
 * 📌 الفكرة: نسخة طبق الأصل من BuyRequestForm لكن للعميل
 * 📌 النتيجة: البيانات تُرسل للوسيط مع إشعار + دائرة حمراء نابضة
 * ────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Search, MapPin, DollarSign, Send, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadVCard } from '../utils/vcardGenerator';

interface RequestFormPublicProps {
  brokerPhone: string;
  brokerName: string;
}

const propertyTypes = ['شقة', 'فيلا', 'أرض', 'دبلكس', 'تجاري', 'استراحة', 'مزرعة', 'مخزن', 'مكتب'];

export function RequestFormPublic({ brokerPhone, brokerName }: RequestFormPublicProps) {
  const [requestType, setRequestType] = useState<'buy' | 'rent'>('buy');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone) {
      toast.error('يرجى إدخال الاسم ورقم الجوال');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        type: requestType,
        fullName,
        phone,
        city,
        district,
        propertyType,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        bedrooms,
        bathrooms,
        description,
        submittedAt: new Date().toISOString(),
        brokerPhone,
        status: 'pending'
      };

      // حفظ في localStorage للوسيط
      const requestsKey = `broker_received_requests_${brokerPhone}`;
      const existingRequests = JSON.parse(localStorage.getItem(requestsKey) || '[]');
      const newRequest = {
        ...requestData,
        id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isNew: true // علامة للدائرة الحمراء النابضة
      };
      existingRequests.push(newRequest);
      localStorage.setItem(requestsKey, JSON.stringify(existingRequests));

      // إضافة إشعار للوسيط
      const notificationsKey = `notifications_${brokerPhone}`;
      const existingNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
      existingNotifications.unshift({
        id: `notif-${Date.now()}`,
        type: 'new_request',
        title: '🔍 طلب عقاري جديد',
        message: `طلب ${requestType === 'buy' ? 'شراء' : 'استئجار'} جديد من ${fullName}`,
        timestamp: new Date().toISOString(),
        read: false,
        requestId: newRequest.id
      });
      localStorage.setItem(notificationsKey, JSON.stringify(existingNotifications));

      setSubmitted(true);
      toast.success('✅ تم إرسال الطلب بنجاح!');
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full border-2 border-blue-500">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">تم الإرسال بنجاح!</h2>
            <p className="text-gray-600 leading-relaxed">
              شكراً لك! تم إرسال طلبك إلى {brokerName}.<br />
              سيتواصل معك قريباً ببدائل مناسبة.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-2 border-[#D4AF37]">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Search className="w-6 h-6" />
              إرسال طلب عقاري إلى {brokerName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* نوع الطلب */}
              <div className="space-y-3">
                <Label className="text-lg">نوع الطلب</Label>
                <RadioGroup value={requestType} onValueChange={(v) => setRequestType(v as 'buy' | 'rent')} className="flex gap-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy" className="cursor-pointer">مشتري</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent" className="cursor-pointer">مستأجر</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* البيانات الشخصية */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-[#01411C]">البيانات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>الاسم الكامل *</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أحمد محمد العبدالله"
                      required
                      className="border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <Label>رقم الجوال *</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      required
                      dir="ltr"
                      className="border-[#D4AF37]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* تفاصيل الطلب */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    تفاصيل الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>المدينة</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="الرياض"
                        className="border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <Label>الحي المفضل</Label>
                      <Input
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="العليا"
                        className="border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>نوع العقار المطلوب</Label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full p-2 border-2 border-[#D4AF37] rounded-md"
                    >
                      <option value="">اختر النوع</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>الميزانية الدنيا (ريال)</Label>
                      <Input
                        type="number"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        placeholder="300000"
                        className="border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <Label>الميزانية القصوى (ريال)</Label>
                      <Input
                        type="number"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                        placeholder="500000"
                        className="border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>عدد الغرف المطلوب</Label>
                      <Input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        placeholder="3"
                        className="border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <Label>عدد الحمامات المطلوب</Label>
                      <Input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        placeholder="2"
                        className="border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>متطلبات إضافية</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="أضف أي متطلبات أو ملاحظات إضافية..."
                      className="border-[#D4AF37] min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* الأزرار */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* زر إرسال الطلب */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white text-lg"
                >
                  {isSubmitting ? (
                    <>جاري الإرسال...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الطلب
                    </>
                  )}
                </Button>

                {/* زر حفظ vCard */}
                <Button
                  type="button"
                  onClick={() => {
                    if (!fullName || !phone) {
                      toast.error('يرجى إدخال الاسم ورقم الجوال أولاً');
                      return;
                    }
                    downloadVCard({
                      name: fullName,
                      phone: phone,
                      email: '',
                      company: '',
                      jobTitle: 'باحث عن عقار',
                      website1: '',
                      website2: '',
                      whatsapp: phone
                    }, fullName);
                    toast.success('✅ تم تحميل بطاقة الاتصال!');
                  }}
                  className="h-14 bg-purple-500 hover:bg-purple-600 text-white text-lg"
                >
                  <Download className="w-5 h-5 ml-2" />
                  حفظ بطاقة الاتصال
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}