import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Save, ArrowRight, Calendar } from 'lucide-react';

interface WorkingHoursManagerProps {
  onBack: () => void;
  onSave: (workingHours: any) => void;
}

interface DayHours {
  enabled: boolean;
  from: string;
  to: string;
}

interface WorkingHours {
  [key: string]: DayHours;
}

export default function WorkingHoursManager({ onBack, onSave }: WorkingHoursManagerProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    saturday: { enabled: true, from: '09:00', to: '17:00' },
    sunday: { enabled: true, from: '09:00', to: '17:00' },
    monday: { enabled: true, from: '09:00', to: '17:00' },
    tuesday: { enabled: true, from: '09:00', to: '17:00' },
    wednesday: { enabled: true, from: '09:00', to: '17:00' },
    thursday: { enabled: true, from: '09:00', to: '17:00' },
    friday: { enabled: false, from: '09:00', to: '17:00' }
  });

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
    onSave(workingHours);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          عودة
        </Button>

        <div className="text-center flex-1">
          <h1 className="text-2xl text-[#01411C]">إدارة ساعات العمل</h1>
          <p className="text-sm text-gray-600">حدد أوقات العمل المتاحة للمواعيد</p>
        </div>

        <div className="w-24"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-[#D4AF37] shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#D4AF37]" />
              جدول ساعات العمل الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(workingHours).map(([day, hours]) => (
                <Card key={day} className={`border-2 ${hours.enabled ? 'border-[#D4AF37]' : 'border-gray-300'} transition-all`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Day Name */}
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={hours.enabled}
                          onChange={() => handleToggleDay(day)}
                          className="w-5 h-5 accent-[#01411C]"
                        />
                        <span className={hours.enabled ? 'text-[#01411C]' : 'text-gray-400'}>
                          {daysInArabic[day]}
                        </span>
                        {hours.enabled && (
                          <Badge className="bg-[#01411C] text-white">متاح</Badge>
                        )}
                      </div>

                      {/* Time Inputs */}
                      {hours.enabled && (
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">من</label>
                            <input
                              type="time"
                              value={hours.from}
                              onChange={(e) => handleTimeChange(day, 'from', e.target.value)}
                              className="px-3 py-2 border-2 border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01411C]"
                            />
                          </div>
                          <span className="text-gray-400">—</span>
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">إلى</label>
                            <input
                              type="time"
                              value={hours.to}
                              onChange={(e) => handleTimeChange(day, 'to', e.target.value)}
                              className="px-3 py-2 border-2 border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01411C]"
                            />
                          </div>
                        </div>
                      )}

                      {!hours.enabled && (
                        <span className="text-gray-400">يوم عطلة</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white px-8 py-6 border-2 border-[#D4AF37] hover:shadow-xl transition-all"
              >
                <Save className="w-5 h-5 ml-2" />
                حفظ ساعات العمل
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-[#01411C] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-[#01411C] mb-2">معلومات هامة</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• سيتمكن العملاء من حجز المواعيد فقط خلال الأوقات المحددة</li>
                  <li>• يمكنك تعديل ساعات العمل في أي وقت</li>
                  <li>• الأيام غير المفعّلة لن تظهر في نظام الحجز</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
