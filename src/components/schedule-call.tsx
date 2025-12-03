import React, { useState } from "react";
import { ArrowRight, Phone, Calendar, Clock, User, MessageCircle, CheckCircle, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface ScheduleCallProps {
  onBack: () => void;
  user?: any;
}

export function ScheduleCall({ onBack, user }: ScheduleCallProps) {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [callType, setCallType] = useState("consultation");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    topic: "",
    description: ""
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const callTypes = [
    {
      id: "consultation",
      name: "استشارة مجانية",
      duration: "30 دقيقة",
      description: "استشارة مجانية حول استخدام المنصة",
      icon: "💡",
      price: "مجاني"
    },
    {
      id: "technical",
      name: "دعم فني",
      duration: "20 دقيقة",
      description: "حل المشاكل التقنية والاستفسارات",
      icon: "🔧",
      price: "مجاني"
    },
    {
      id: "business",
      name: "استشارة تجارية",
      duration: "45 دقيقة",
      description: "استراتيجيات النمو وتطوير الأعمال",
      icon: "📈",
      price: "199 ريال"
    },
    {
      id: "training",
      name: "تدريب شخصي",
      duration: "60 دقيقة",
      description: "تدريب مخصص على ميزات المنصة",
      icon: "🎓",
      price: "299 ريال"
    }
  ];

  const availableDates = [
    { date: "2024-02-15", day: "الخميس", available: true },
    { date: "2024-02-16", day: "الجمعة", available: false },
    { date: "2024-02-17", day: "السبت", available: true },
    { date: "2024-02-18", day: "الأحد", available: true },
    { date: "2024-02-19", day: "الإثنين", available: true },
    { date: "2024-02-20", day: "الثلاثاء", available: true },
    { date: "2024-02-21", day: "الأربعاء", available: true }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Call scheduled:", { ...formData, selectedDate, selectedTime, callType });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b-2 border-[#D4AF37] shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-[#01411C] hover:text-[#D4AF37] hover:bg-[#f0fdf4]"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold flex items-center justify-center gap-2" style={{ color: "#01411C" }}>
                <Phone className="w-6 h-6 text-[#D4AF37]" />
                جدولة مكالمة
              </h1>
            </div>
            
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          <Card className="mb-8 border-2 border-[#D4AF37] bg-gradient-to-br from-[#f0fdf4] to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#01411C]">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#01411C" }}>
                احجز مكالمة مع فريق الخبراء
              </h2>
              <p className="text-gray-600">
                تحدث مع خبرائنا واحصل على المساعدة التي تحتاجها لتطوير أعمالك
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Call Types */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    نوع المكالمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {callTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setCallType(type.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          callType === type.id 
                            ? 'border-[#D4AF37] bg-[#fff8e6]' 
                            : 'border-gray-200 hover:border-[#D4AF37]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{type.icon}</div>
                            <div>
                              <h4 className="font-semibold text-[#01411C]">{type.name}</h4>
                              <p className="text-sm text-gray-600 mb-1">{type.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 ml-1" />
                                  {type.duration}
                                </Badge>
                                <Badge 
                                  className={type.price === "مجاني" ? "bg-green-100 text-green-800" : "bg-[#D4AF37] text-white"}
                                >
                                  {type.price}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {callType === type.id && (
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Expert Info */}
              <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#f0fdf4] to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#01411C]">
                      <User className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#01411C]">فريق خبراء وسِيطي</h4>
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                        ))}
                        <span className="text-sm text-gray-600 mr-2">4.9 (120+ تقييم)</span>
                      </div>
                      <p className="text-sm text-gray-600">متخصصون في الحلول العقارية</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>✅ أكثر من 5 سنوات خبرة</p>
                    <p>✅ 1000+ عميل راضي</p>
                    <p>✅ استشارات مخصصة</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    احجز موعدك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder="اسمك الكامل"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          placeholder="05xxxxxxxx"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label>اختر التاريخ</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {availableDates.map((date) => (
                          <button
                            key={date.date}
                            type="button"
                            onClick={() => date.available && setSelectedDate(date.date)}
                            disabled={!date.available}
                            className={`p-2 text-xs rounded-lg border-2 transition-all ${
                              selectedDate === date.date
                                ? 'border-[#D4AF37] bg-[#fff8e6] text-[#01411C]'
                                : date.available
                                ? 'border-gray-200 hover:border-[#D4AF37]'
                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <div className="font-medium">{date.day}</div>
                            <div>{date.date.split('-')[2]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <Label>اختر الوقت</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 text-sm rounded-lg border-2 transition-all ${
                                selectedTime === time
                                  ? 'border-[#D4AF37] bg-[#fff8e6] text-[#01411C]'
                                  : 'border-gray-200 hover:border-[#D4AF37]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Topic */}
                    <div>
                      <Label htmlFor="topic">موضوع المكالمة</Label>
                      <Input
                        id="topic"
                        value={formData.topic}
                        onChange={(e) => updateFormData('topic', e.target.value)}
                        placeholder="ما الموضوع الذي تريد مناقشته؟"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">تفاصيل إضافية (اختياري)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="أي تفاصيل إضافية تريد مشاركتها..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit"
                      className="w-full bg-[#01411C] text-white hover:bg-[#065f41] py-3"
                      disabled={!selectedDate || !selectedTime}
                    >
                      <Phone className="w-5 h-5 ml-2" />
                      احجز المكالمة الآن
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}