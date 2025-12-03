import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';

interface AppointmentBookingClientProps {
  brokerId: string;
  onBack: () => void;
}

export default function AppointmentBookingClient({ brokerId, onBack }: AppointmentBookingClientProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    type: 'showing',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const appointmentTypes = [
    { value: 'showing', label: 'معاينة عقار', icon: '🏠' },
    { value: 'consultation', label: 'استشارة عقارية', icon: '💼' },
    { value: 'call', label: 'مكالمة هاتفية', icon: '📞' },
    { value: 'meeting', label: 'اجتماع شخصي', icon: '🤝' }
  ];

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = () => {
    // هنا يتم إرسال البيانات إلى API
    console.log('حجز موعد:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white p-6 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md w-full border-2 border-[#D4AF37] shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl text-[#01411C] mb-2">تم حجز الموعد بنجاح!</h2>
            <p className="text-gray-600 mb-6">
              سيتم التواصل معك قريباً لتأكيد الموعد
            </p>
            <div className="bg-[#f0fdf4] p-4 rounded-lg mb-6 text-right">
              <p className="text-sm text-gray-600"><strong>التاريخ:</strong> {formData.date}</p>
              <p className="text-sm text-gray-600"><strong>الوقت:</strong> {formData.time}</p>
              <p className="text-sm text-gray-600"><strong>النوع:</strong> {appointmentTypes.find(t => t.value === formData.type)?.label}</p>
            </div>
            <Button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
            >
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between max-w-4xl mx-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          عودة
        </Button>

        <div className="text-center flex-1">
          <h1 className="text-2xl text-[#01411C]">حجز موعد</h1>
          <p className="text-sm text-gray-600">احجز موعداً مع الوسيط العقاري</p>
        </div>

        <div className="w-24"></div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s ? 'bg-[#01411C] border-[#D4AF37] text-white' : 'border-gray-300 text-gray-400'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#01411C]' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span className={step === 1 ? 'text-[#01411C]' : ''}>معلوماتك</span>
          <span className={step === 2 ? 'text-[#01411C]' : ''}>نوع الموعد</span>
          <span className={step === 3 ? 'text-[#01411C]' : ''}>التاريخ والوقت</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-[#D4AF37] shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#D4AF37]" />
              {step === 1 && 'معلوماتك الشخصية'}
              {step === 2 && 'نوع الموعد'}
              {step === 3 && 'اختر التاريخ والوقت'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#01411C] mb-2">الاسم الكامل *</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pr-10 border-2 border-[#D4AF37]"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#01411C] mb-2">رقم الجوال *</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pr-10 border-2 border-[#D4AF37]"
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#01411C] mb-2">البريد الإلكتروني (اختياري)</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pr-10 border-2 border-[#D4AF37]"
                      placeholder="email@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.phone}
                  className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
                >
                  التالي
                </Button>
              </div>
            )}

            {/* Step 2: Appointment Type */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {appointmentTypes.map((type) => (
                    <Card
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`cursor-pointer transition-all border-2 ${formData.type === type.value ? 'border-[#01411C] bg-[#f0fdf4]' : 'border-gray-300 hover:border-[#D4AF37]'}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <p className="text-sm text-[#01411C]">{type.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <label className="block text-sm text-[#01411C] mb-2">ملاحظات إضافية (اختياري)</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="border-2 border-[#D4AF37]"
                    placeholder="أي تفاصيل إضافية تريد إضافتها..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-2 border-[#D4AF37]"
                  >
                    السابق
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#01411C] mb-2">اختر التاريخ *</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border-2 border-[#D4AF37]"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#01411C] mb-2">اختر الوقت *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        variant={formData.time === time ? 'default' : 'outline'}
                        className={formData.time === time ? 'bg-[#01411C] text-white' : 'border-[#D4AF37]'}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 border-2 border-[#D4AF37]"
                  >
                    السابق
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.date || !formData.time}
                    className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
                  >
                    تأكيد الحجز
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
