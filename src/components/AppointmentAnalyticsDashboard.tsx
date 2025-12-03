// components/AppointmentAnalyticsDashboard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CalendarEvent } from '../types/calendar';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react@0.487.0';

interface Props {
  events: CalendarEvent[];
}

export default function AppointmentAnalyticsDashboard({ events }: Props) {
  const analytics = useMemo(() => {
    const total = events.length;
    const confirmed = events.filter(e => e.status === 'مؤكد').length;
    const completed = events.filter(e => e.status === 'مكتمل').length;
    const cancelled = events.filter(e => e.status === 'ملغي').length;
    const scheduled = events.filter(e => e.status === 'مجدول').length;

    const attendanceRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
    const cancellationRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : '0';
    const confirmationRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : '0';

    const hourDistribution = events.reduce((acc, event) => {
      const hour = new Date(event.start).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHour = Object.entries(hourDistribution)
      .sort(([, a], [, b]) => b - a)[0];

    const typeDistribution = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      confirmed,
      completed,
      cancelled,
      scheduled,
      attendanceRate,
      cancellationRate,
      confirmationRate,
      peakHour: peakHour ? `${peakHour[0]}:00` : 'N/A',
      typeDistribution
    };
  }, [events]);

  const typeLabels: Record<string, string> = {
    meeting: 'اجتماع',
    showing: 'معاينة عقار',
    call: 'اتصال',
    custom: 'مخصص',
    short_followup: 'متابعة قصيرة'
  };

  return (
    <div className="space-y-6">
      {/* إحصائيات رئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المواعيد</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المكتملة</p>
                <p className="text-2xl font-bold text-green-600">{analytics.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الملغاة</p>
                <p className="text-2xl font-bold text-red-600">{analytics.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المجدولة</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* معدلات الأداء */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            معدلات الأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">معدل الحضور</span>
              <Badge className="bg-green-500 text-white">{analytics.attendanceRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">معدل التأكيد</span>
              <Badge className="bg-blue-500 text-white">{analytics.confirmationRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">معدل الإلغاء</span>
              <Badge className="bg-red-500 text-white">{analytics.cancellationRate}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">ساعة الذروة</span>
              <Badge className="bg-[#01411C] text-white">{analytics.peakHour}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* توزيع أنواع المواعيد */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
            توزيع أنواع المواعيد
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Object.entries(analytics.typeDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-700">{typeLabels[type] || type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#01411C] h-2 rounded-full"
                      style={{ width: `${(count / analytics.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-left">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
