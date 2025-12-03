// ملف: components/share/ScheduleShare.tsx
// جدولة المشاركات لإرسالها في وقت محدد

'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar as CalendarIcon, Clock, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ScheduleShareProps {
  offerId: string;
  shareUrl: string;
  onSchedule: () => void;
}

export function ScheduleShare({
  offerId,
  shareUrl,
  onSchedule,
}: ScheduleShareProps) {
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error('يرجى تحديد التاريخ والوقت');
      return;
    }

    setLoading(true);

    try {
      const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);

      const response = await fetch('/api/share/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          shareUrl,
          scheduledFor: scheduledFor.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('تم جدولة المشاركة بنجاح!');
        onSchedule();
      } else {
        toast.error('فشل في جدولة المشاركة');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-[#01411C]" />
        <h3 className="text-lg font-bold">جدولة المشاركة</h3>
      </div>

      {/* نموذج الجدولة */}
      <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="date">التاريخ</Label>
          <div className="relative">
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="pr-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">الوقت</Label>
          <div className="relative">
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="time"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {scheduleDate && scheduleTime && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-bold">سيتم الإرسال في:</span>{' '}
              {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('ar-SA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
      </div>

      {/* زر الجدولة */}
      <Button
        onClick={handleSchedule}
        disabled={loading || !scheduleDate || !scheduleTime}
        className="w-full bg-[#01411C] hover:bg-[#01411C]/90"
        size="lg"
      >
        {loading ? (
          'جاري الجدولة...'
        ) : (
          <>
            <Send className="w-5 h-5 ml-2" />
            جدولة المشاركة
          </>
        )}
      </Button>

      {/* معلومات */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <span className="font-bold">ملاحظة:</span> سيتم إرسال المشاركة تلقائياً
          في الوقت المحدد. يمكنك إلغاء الجدولة من صفحة الإحصائيات
        </p>
      </div>
    </div>
  );
}
