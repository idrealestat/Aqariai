// components/WeeklySummaryPanel.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Users,
  Download
} from 'lucide-react@0.487.0';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ar } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status?: string;
  priority?: 'normal' | 'critical';
  type?: string;
  client_name?: string;
}

interface Props {
  events: CalendarEvent[];
}

export default function WeeklySummaryPanel({ events }: Props) {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 6 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 6 });

    const weekEvents = events.filter(event => 
      isWithinInterval(new Date(event.start), { start: weekStart, end: weekEnd })
    );

    const completed = weekEvents.filter(e => e.status === 'مكتمل').length;
    const confirmed = weekEvents.filter(e => e.status === 'مؤكد').length;
    const pending = weekEvents.filter(e => e.status === 'مجدول').length;
    const cancelled = weekEvents.filter(e => e.status === 'ملغي').length;
    const critical = weekEvents.filter(e => e.priority === 'critical').length;

    const upcomingCritical = weekEvents.filter(e => 
      e.priority === 'critical' && 
      new Date(e.start) > now &&
      e.status !== 'ملغي'
    );

    const typeDistribution = weekEvents.reduce((acc, event) => {
      const type = event.type || 'other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dailyCount = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return {
        day: format(day, 'EEEE', { locale: ar }),
        count: weekEvents.filter(e => 
          format(new Date(e.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ).length
      };
    });

    return {
      weekStart,
      weekEnd,
      total: weekEvents.length,
      completed,
      confirmed,
      pending,
      cancelled,
      critical,
      upcomingCritical,
      typeDistribution,
      dailyCount,
      completionRate: weekEvents.length > 0 ? ((completed / weekEvents.length) * 100).toFixed(1) : '0'
    };
  }, [events]);

  const exportSummary = () => {
    const summary = `
📊 الملخص الأسبوعي للمواعيد
📅 ${format(weeklyData.weekStart, 'dd MMMM yyyy', { locale: ar })} - ${format(weeklyData.weekEnd, 'dd MMMM yyyy', { locale: ar })}

📈 الإحصائيات:
━━━━━━━━━━━━━━━━━━━━
• إجمالي المواعيد: ${weeklyData.total}
• المكتملة: ${weeklyData.completed} (${weeklyData.completionRate}%)
• المؤكدة: ${weeklyData.confirmed}
• المجدولة: ${weeklyData.pending}
• الملغاة: ${weeklyData.cancelled}
• الحرجة: ${weeklyData.critical}

⚠️ المواعيد الحرجة القادمة: ${weeklyData.upcomingCritical.length}
${weeklyData.upcomingCritical.map(e => `  • ${e.title} - ${format(new Date(e.start), 'dd/MM HH:mm', { locale: ar })}`).join('\n')}

📊 التوزيع حسب النوع:
${Object.entries(weeklyData.typeDistribution).map(([type, count]) => `  • ${type}: ${count}`).join('\n')}

📅 التوزيع اليومي:
${weeklyData.dailyCount.map(d => `  ${d.day}: ${d.count} موعد`).join('\n')}
    `.trim();

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41]">
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
              الملخص الأسبوعي
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={exportSummary}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {format(weeklyData.weekStart, 'dd MMMM', { locale: ar })} - {format(weeklyData.weekEnd, 'dd MMMM yyyy', { locale: ar })}
            </p>
          </div>

          {/* الإحصائيات الرئيسية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{weeklyData.total}</div>
              <div className="text-xs text-gray-600">إجمالي المواعيد</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{weeklyData.completed}</div>
              <div className="text-xs text-gray-600">مكتملة ({weeklyData.completionRate}%)</div>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{weeklyData.confirmed}</div>
              <div className="text-xs text-gray-600">مؤكدة</div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{weeklyData.critical}</div>
              <div className="text-xs text-gray-600">حرجة</div>
            </div>
          </div>

          {/* المواعيد الحرجة القادمة */}
          {weeklyData.upcomingCritical.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-700">مواعيد حرجة قادمة ({weeklyData.upcomingCritical.length})</h3>
              </div>
              <div className="space-y-2">
                {weeklyData.upcomingCritical.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                    <span className="text-gray-700">{event.title}</span>
                    <Badge className="bg-red-500 text-white">
                      {format(new Date(event.start), 'dd/MM HH:mm', { locale: ar })}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* التوزيع اليومي */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#01411C] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              التوزيع اليومي
            </h3>
            <div className="space-y-2">
              {weeklyData.dailyCount.map((day, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">{day.day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#01411C] to-[#065f41] h-full rounded-full transition-all"
                      style={{ width: `${(day.count / Math.max(...weeklyData.dailyCount.map(d => d.count))) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الرؤى والتوصيات */}
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-700">رؤى وتوصيات</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {parseFloat(weeklyData.completionRate) >= 80 && (
                <li>✅ أداء ممتاز! معدل الإنجاز فوق 80%</li>
              )}
              {weeklyData.cancelled > weeklyData.total * 0.2 && (
                <li>⚠️ معدل الإلغاء مرتفع - يُنصح بالمتابعة مع العملاء</li>
              )}
              {weeklyData.critical > 0 && (
                <li>📌 لديك {weeklyData.critical} مواعيد حرجة هذا الأسبوع</li>
              )}
              {weeklyData.total < 5 && (
                <li>💡 يمكنك حجز المزيد من المواعيد لزيادة الإنتاجية</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
