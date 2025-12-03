// components/DynamicBookingPage.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar, User, Phone, Mail, MapPin, CheckCircle } from 'lucide-react@0.487.0';
import { toast } from 'sonner@2.0.3';

interface Props {
  userSlug: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}

export default function DynamicBookingPage({ 
  userSlug, 
  agentName = 'الوسيط العقاري',
  agentPhone = '+966xxxxxxxxx',
  agentEmail = 'agent@example.com'
}: Props) {
  const [step, setStep] = useState<'select' | 'confirm' | 'create' | 'success'>('select');
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    appointment_type: 'showing',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  const handleConfirmAttendance = () => {
    toast.success('تم تأكيد حضورك بنجاح');
    setStep('success');
  };

  const handleCreateNewAppointment = () => {
    setStep('create');
  };

  const handleSubmitNewAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم إنشاء الموعد بنجاح');
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#fffef7] p-4" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* معلومات الوسيط */}
        <Card className="border-2 border-[#D4AF37] shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
            <CardTitle className="text-white text-center">
              حجز موعد مع {agentName}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{agentPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{agentEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* خطوة الاختيار */}
        {step === 'select' && (
          <Card className="border-2 border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#01411C]">اختر الإجراء</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button
                onClick={handleConfirmAttendance}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
                size="lg"
              >
                <CheckCircle className="w-5 h-5 ml-2" />
                تأكيد الحضور للموعد المجدول
              </Button>
              
              <Button
                onClick={handleCreateNewAppointment}
                className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:shadow-lg"
                size="lg"
              >
                <Calendar className="w-5 h-5 ml-2" />
                إنشاء موعد جديد
              </Button>
            </CardContent>
          </Card>
        )}

        {/* نموذج إنشاء موعد */}
        {step === 'create' && (
          <Card className="border-2 border-[#D4AF37]">
            <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
              <CardTitle className="text-white">إنشاء موعد جديد</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitNewAppointment} className="space-y-4">
                <div>
                  <Label htmlFor="client_name">الاسم الكامل</Label>
                  <div className="relative mt-2">
                    <User className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="client_name"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="pr-10"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="client_phone">رقم الجوال</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="client_phone"
                      type="tel"
                      required
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      className="pr-10"
                      placeholder="+966xxxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="client_email">البريد الإلكتروني</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="client_email"
                      type="email"
                      required
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      className="pr-10"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="appointment_type">نوع الموعد</Label>
                  <select
                    id="appointment_type"
                    value={formData.appointment_type}
                    onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                  >
                    <option value="showing">معاينة عقار</option>
                    <option value="meeting">اجتماع</option>
                    <option value="call">مكالمة هاتفية</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointment_date">التاريخ</Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      required
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointment_time">الوقت</Label>
                    <Input
                      id="appointment_time"
                      type="time"
                      required
                      value={formData.appointment_time}
                      onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2"
                    rows={3}
                    placeholder="أضف أي ملاحظات إضافية..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
                    حفظ الموعد
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep('select')}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* رسالة النجاح */}
        {step === 'success' && (
          <Card className="border-2 border-green-500">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-green-700 mb-2">تم بنجاح!</h3>
              <p className="text-gray-600 mb-6">
                تم تأكيد موعدك. سيتم إرسال رسالة تأكيد عبر البريد الإلكتروني والرسائل النصية.
              </p>
              <Button onClick={() => setStep('select')} variant="outline">
                العودة للبداية
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
