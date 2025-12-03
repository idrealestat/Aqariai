import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface CalendarAnalyticsProps {
  onBack: () => void;
}

export default function CalendarAnalytics({ onBack }: CalendarAnalyticsProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = () => {
    try {
      const data = localStorage.getItem('calendar_events');
      const events = data ? JSON.parse(data) : [];
      setAppointments(events);

      // حساب الإحصائيات
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        total: events.length,
        completed: events.filter((e: any) => e.status === 'completed').length,
        pending: events.filter((e: any) => e.status === 'pending').length,
        cancelled: events.filter((e: any) => e.status === 'cancelled').length,
        thisWeek: events.filter((e: any) => new Date(e.date) >= weekStart).length,
        thisMonth: events.filter((e: any) => new Date(e.date) >= monthStart).length
      };

      setStats(stats);

      console.log('📊 تحليلات التقويم:', stats);
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات التقويم:', error);
    }
  };

  // بيانات الرسوم البيانية
  const monthlyData = [
    { month: 'يناير', مواعيد: 12, منجزة: 8, ملغاة: 2 },
    { month: 'فبراير', مواعيد: 19, منجزة: 14, ملغاة: 3 },
    { month: 'مارس', مواعيد: 15, منجزة: 12, ملغاة: 1 },
    { month: 'أبريل', مواعيد: 22, منجزة: 18, ملغاة: 2 },
    { month: 'مايو', مواعيد: 28, منجزة: 24, ملغاة: 1 },
    { month: 'يونيو', مواعيد: stats.total, منجزة: stats.completed, ملغاة: stats.cancelled }
  ];

  const statusData = [
    { name: 'منجزة', value: stats.completed, color: '#10b981' },
    { name: 'قيد الانتظار', value: stats.pending, color: '#f59e0b' },
    { name: 'ملغاة', value: stats.cancelled, color: '#ef4444' }
  ];

  const weeklyData = [
    { day: 'السبت', مواعيد: 3 },
    { day: 'الأحد', مواعيد: 5 },
    { day: 'الاثنين', مواعيد: 4 },
    { day: 'الثلاثاء', مواعيد: 6 },
    { day: 'الأربعاء', مواعيد: 2 },
    { day: 'الخميس', مواعيد: 4 },
    { day: 'الجمعة', مواعيد: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          رجوع للتحليلات
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#01411C] to-green-700 p-4 rounded-xl">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#01411C]">تحليلات التقويم والمواعيد</h1>
            <p className="text-gray-600">تحليل شامل لجميع المواعيد والأنشطة</p>
          </div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* 🎯 KPIs - مؤشرات الأداء الرئيسية */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8" />
              <Badge className="bg-white/20 text-white border-0">إجمالي</Badge>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm opacity-90">إجمالي المواعيد</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" />
              <Badge className="bg-white/20 text-white border-0">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Badge>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.completed}</p>
            <p className="text-sm opacity-90">منجزة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8" />
              <Badge className="bg-white/20 text-white border-0">قيد الانتظار</Badge>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.pending}</p>
            <p className="text-sm opacity-90">معلقة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8" />
              <Badge className="bg-white/20 text-white border-0">
                {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%
              </Badge>
            </div>
            <p className="text-4xl font-bold mb-1">{stats.cancelled}</p>
            <p className="text-sm opacity-90">ملغاة</p>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* 📈 Charts - الرسوم البيانية */}
      {/* ============================================ */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Line Chart - الاتجاهات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              اتجاه المواعيد الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="مواعيد" stroke="#01411C" strokeWidth={3} />
                <Line type="monotone" dataKey="منجزة" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="ملغاة" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - النسب */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <AlertCircle className="w-5 h-5" />
              توزيع حالة المواعيد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - الأسبوعي */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Calendar className="w-5 h-5" />
              توزيع المواعيد الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="مواعيد" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* 📋 Tables - الجداول التفصيلية */}
      {/* ============================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#01411C]">قائمة المواعيد التفصيلية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#01411C] text-white">
                <tr>
                  <th className="p-3 text-right">العميل</th>
                  <th className="p-3 text-right">التاريخ</th>
                  <th className="p-3 text-right">الوقت</th>
                  <th className="p-3 text-right">النوع</th>
                  <th className="p-3 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 10).map((appointment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{appointment.customer || 'غير محدد'}</td>
                    <td className="p-3">{appointment.date || '-'}</td>
                    <td className="p-3">{appointment.time || '-'}</td>
                    <td className="p-3">{appointment.type || 'موعد'}</td>
                    <td className="p-3">
                      <Badge className={
                        appointment.status === 'completed' ? 'bg-green-500' :
                        appointment.status === 'cancelled' ? 'bg-red-500' :
                        'bg-orange-500'
                      }>
                        {appointment.status === 'completed' ? 'منجز' :
                         appointment.status === 'cancelled' ? 'ملغي' : 'معلق'}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      لا توجد مواعيد مسجلة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ============================================ */}
      {/* 📅 Timeline Analysis - التحليل الزمني */}
      {/* ============================================ */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-gradient-to-br from-[#01411C] to-green-700 text-white">
          <CardHeader>
            <CardTitle>مواعيد هذا الأسبوع</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.thisWeek}</p>
            <p className="opacity-90">موعد مجدول</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">معدل: {Math.round(stats.thisWeek / 7)} موعد/يوم</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white">
          <CardHeader>
            <CardTitle>مواعيد هذا الشهر</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.thisMonth}</p>
            <p className="opacity-90">موعد مجدول</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">معدل: {Math.round(stats.thisMonth / 30)} موعد/يوم</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
