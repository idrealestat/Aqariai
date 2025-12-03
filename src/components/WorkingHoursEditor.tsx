// components/WorkingHoursEditor.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Clock, Save, Copy, CheckCircle, Calendar, Link as LinkIcon } from 'lucide-react@0.487.0';
import { toast } from 'sonner@2.0.3';

interface DayHours {
  enabled: boolean;
  from: string;
  to: string;
}

interface WorkingHours {
  [key: string]: DayHours;
}

export default function WorkingHoursEditor() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(() => {
    const saved = localStorage.getItem('broker_working_hours');
    return saved ? JSON.parse(saved) : {
      saturday: { enabled: true, from: '09:00', to: '17:00' },
      sunday: { enabled: true, from: '09:00', to: '17:00' },
      monday: { enabled: true, from: '09:00', to: '17:00' },
      tuesday: { enabled: true, from: '09:00', to: '17:00' },
      wednesday: { enabled: true, from: '09:00', to: '17:00' },
      thursday: { enabled: true, from: '09:00', to: '17:00' },
      friday: { enabled: false, from: '09:00', to: '17:00' }
    };
  });

  const [bookingUrl, setBookingUrl] = useState('');

  useEffect(() => {
    // محاكاة رابط الحجز الديناميكي
    const userName = localStorage.getItem('user_name') || 'وسيط-عقاري';
    const slug = userName.replace(/\s+/g, '-').toLowerCase();
    setBookingUrl(`${window.location.origin}/booking/${slug}`);
  }, []);

  const daysInArabic: { [key: string]: string } = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة'
  };

  const handleToggleDay = (day: string) => {
    setWorkingHours({
      ...workingHours,
      [day]: { ...workingHours[day], enabled: !workingHours[day].enabled }
    });
  };

  const handleTimeChange = (day: string, field: 'from' | 'to', value: string) => {
    setWorkingHours({
      ...workingHours,
      [day]: { ...workingHours[day], [field]: value }
    });
  };

  const handleSave = () => {
    localStorage.setItem('broker_working_hours', JSON.stringify(workingHours));
    toast.success('تم حفظ ساعات العمل بنجاح', {
      description: 'سيتم استخدامها في صفحة الحجز الديناميكي'
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast.success('تم نسخ رابط الحجز', {
      description: 'يمكنك مشاركته مع العملاء الآن'
    });
  };

  const handleApplyToAll = () => {
    const firstEnabledDay = Object.values(workingHours).find(day => day.enabled);
    if (!firstEnabledDay) return;

    const newHours = { ...workingHours };
    Object.keys(newHours).forEach(day => {
      if (newHours[day].enabled) {
        newHours[day].from = firstEnabledDay.from;
        newHours[day].to = firstEnabledDay.to;
      }
    });
    setWorkingHours(newHours);
    toast.info('تم تطبيق الساعات على جميع الأيام المفعلة');
  };

  return (
    <div className="space-y-6">
      {/* رابط الحجز */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#D4AF37]" />
            رابط الحجز الديناميكي
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">رابط صفحة الحجز الخاصة بك:</p>
              <p className="text-[#01411C] font-semibold break-all">{bookingUrl}</p>
            </div>
            <Button
              onClick={handleCopyUrl}
              className="bg-[#D4AF37] hover:bg-[#b8941f] text-[#01411C]"
            >
              <Copy className="w-4 h-4 ml-2" />
              نسخ
            </Button>
          </div>
          <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 شارك هذا الرابط مع عملائك ليتمكنوا من حجز موعد معك مباشرة حسب الأوقات المتاحة المحددة أدناه
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ساعات العمل */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              ساعات العمل الأسبوعية
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleApplyToAll}
              className="text-white hover:bg-white/20"
            >
              <Copy className="w-4 h-4 ml-2" />
              تطبيق على الكل
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Object.entries(workingHours).map(([day, hours]) => (
              <div
                key={day}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${hours.enabled 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'}
                `}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* اليوم والتفعيل */}
                  <div className="flex items-center gap-3 md:w-40">
                    <Switch
                      checked={hours.enabled}
                      onCheckedChange={() => handleToggleDay(day)}
                      className="data-[state=checked]:bg-[#01411C]"
                    />
                    <Label className="font-semibold text-[#01411C] cursor-pointer">
                      {daysInArabic[day]}
                    </Label>
                  </div>

                  {/* الساعات */}
                  {hours.enabled && (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600 mb-1">من</Label>
                        <input
                          type="time"
                          value={hours.from}
                          onChange={(e) => handleTimeChange(day, 'from', e.target.value)}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-semibold"
                        />
                      </div>
                      <span className="text-gray-400 mt-5">-</span>
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600 mb-1">إلى</Label>
                        <input
                          type="time"
                          value={hours.to}
                          onChange={(e) => handleTimeChange(day, 'to', e.target.value)}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-semibold"
                        />
                      </div>
                      <Badge className="bg-[#01411C] text-white mt-5">
                        {calculateHours(hours.from, hours.to)} ساعات
                      </Badge>
                    </div>
                  )}

                  {!hours.enabled && (
                    <div className="text-sm text-gray-400 flex-1">إجازة</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(workingHours).filter(h => h.enabled).length}
              </div>
              <div className="text-xs text-gray-600">أيام عمل</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {calculateTotalWeeklyHours(workingHours)}
              </div>
              <div className="text-xs text-gray-600">ساعة أسبوعياً</div>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(workingHours).filter(h => !h.enabled).length}
              </div>
              <div className="text-xs text-gray-600">أيام إجازة</div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getAverageDailyHours(workingHours)}
              </div>
              <div className="text-xs text-gray-600">متوسط ساعات اليوم</div>
            </div>
          </div>

          {/* زر الحفظ */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#01411C] hover:bg-[#065f41] text-white"
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ ساعات العمل
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(bookingUrl, '_blank')}
              className="border-2 border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37]/10"
            >
              <Calendar className="w-4 h-4 ml-2" />
              معاينة صفحة الحجز
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نصائح */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-[#01411C] flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            نصائح لإدارة ساعات العمل
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>حدد ساعات عملك بدقة لتجنب الحجوزات في أوقات غير مناسبة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>الأيام المعطلة لن تظهر في صفحة الحجز الديناميكي</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>يمكنك تطبيق نفس الساعات على جميع الأيام باستخدام زر "تطبيق على الكل"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>رابط الحجز الديناميكي يمكن مشاركته في البطاقة الرقمية ووسائل التواصل</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function calculateHours(from: string, to: string): number {
  const [fromH, fromM] = from.split(':').map(Number);
  const [toH, toM] = to.split(':').map(Number);
  const fromMinutes = fromH * 60 + fromM;
  const toMinutes = toH * 60 + toM;
  const diff = toMinutes - fromMinutes;
  return Math.round((diff / 60) * 10) / 10;
}

function calculateTotalWeeklyHours(hours: WorkingHours): number {
  return Object.values(hours)
    .filter(h => h.enabled)
    .reduce((total, h) => total + calculateHours(h.from, h.to), 0)
    .toFixed(1);
}

function getAverageDailyHours(hours: WorkingHours): string {
  const enabledDays = Object.values(hours).filter(h => h.enabled);
  if (enabledDays.length === 0) return '0';
  const total = enabledDays.reduce((sum, h) => sum + calculateHours(h.from, h.to), 0);
  return (total / enabledDays.length).toFixed(1);
}
