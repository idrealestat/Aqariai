import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  MapPin
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

interface RequestsAnalyticsProps {
  onBack: () => void;
}

export default function RequestsAnalytics({ onBack }: RequestsAnalyticsProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    urgent: 0,
    normal: 0,
    avgBudget: 0,
    thisMonth: 0
  });

  useEffect(() => {
    loadRequestsData();
  }, []);

  const loadRequestsData = () => {
    try {
      const data = localStorage.getItem('customer_requests');
      const requestsList = data ? JSON.parse(data) : [];
      setRequests(requestsList);

      const budgets = requestsList.map((r: any) => r.budget || 0).filter((b: number) => b > 0);
      const avgBudget = budgets.length > 0 ? budgets.reduce((a: number, b: number) => a + b, 0) / budgets.length : 0;

      const stats = {
        total: requestsList.length,
        urgent: requestsList.filter((r: any) => r.urgency === 'مستعجل').length,
        normal: requestsList.filter((r: any) => r.urgency === 'عادي').length,
        avgBudget: avgBudget,
        thisMonth: requestsList.length // simplified
      };

      setStats(stats);

      console.log('📊 تحليلات الطلبات:', stats);
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات الطلبات:', error);
    }
  };

  const urgencyData = [
    { name: 'مستعجل', value: stats.urgent, color: '#ef4444' },
    { name: 'عادي', value: stats.normal, color: '#10b981' }
  ];

  const budgetRanges = [
    { range: '< 500K', count: requests.filter(r => (r.budget || 0) < 500000).length },
    { range: '500K-1M', count: requests.filter(r => (r.budget || 0) >= 500000 && (r.budget || 0) < 1000000).length },
    { range: '1M-2M', count: requests.filter(r => (r.budget || 0) >= 1000000 && (r.budget || 0) < 2000000).length },
    { range: '2M-5M', count: requests.filter(r => (r.budget || 0) >= 2000000 && (r.budget || 0) < 5000000).length },
    { range: '> 5M', count: requests.filter(r => (r.budget || 0) >= 5000000).length }
  ];

  const monthlyRequests = [
    { month: 'يناير', طلبات: 8 },
    { month: 'فبراير', طلبات: 12 },
    { month: 'مارس', طلبات: 10 },
    { month: 'أبريل', طلبات: 15 },
    { month: 'مايو', طلبات: 18 },
    { month: 'يونيو', طلبات: stats.total }
  ];

  // توزيع المناطق
  const areaData = [
    { name: 'الرياض', value: Math.floor(stats.total * 0.4), color: '#01411C' },
    { name: 'جدة', value: Math.floor(stats.total * 0.3), color: '#D4AF37' },
    { name: 'الدمام', value: Math.floor(stats.total * 0.2), color: '#10b981' },
    { name: 'أخرى', value: Math.floor(stats.total * 0.1), color: '#3b82f6' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6" dir="rtl">
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
          <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#01411C]">تحليلات الطلبات</h1>
            <p className="text-gray-600">تحليل شامل لطلبات العملاء والميزانيات</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <FileText className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm opacity-90">إجمالي الطلبات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.urgent}</p>
            <p className="text-sm opacity-90">طلبات مستعجلة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <CheckCircle className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.normal}</p>
            <p className="text-sm opacity-90">طلبات عادية</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{(stats.avgBudget / 1000000).toFixed(1)}M</p>
            <p className="text-sm opacity-90">متوسط الميزانية</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Urgency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Clock className="w-5 h-5" />
              توزيع حسب الاستعجال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={urgencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {urgencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              توزيع الميزانيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              اتجاه الطلبات الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="طلبات" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Distribution */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <MapPin className="w-5 h-5" />
              التوزيع الجغرافي للطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#01411C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#01411C]">قائمة الطلبات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-600 text-white">
                <tr>
                  <th className="p-3 text-right">نوع العقار</th>
                  <th className="p-3 text-right">الميزانية</th>
                  <th className="p-3 text-right">الموقع</th>
                  <th className="p-3 text-right">الاستعجال</th>
                  <th className="p-3 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 10).map((request, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{request.propertyType || 'غير محدد'}</td>
                    <td className="p-3">{(request.budget || 0).toLocaleString('ar-SA')} ر.س</td>
                    <td className="p-3">{request.location || '-'}</td>
                    <td className="p-3">
                      <Badge className={request.urgency === 'مستعجل' ? 'bg-red-500' : 'bg-green-500'}>
                        {request.urgency || 'عادي'}
                      </Badge>
                    </td>
                    <td className="p-3">{request.createdAt ? new Date(request.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      لا توجد طلبات مسجلة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-gradient-to-br from-red-600 to-orange-600 text-white">
          <CardHeader>
            <CardTitle>نسبة الطلبات المستعجلة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">
              {stats.total > 0 ? Math.round((stats.urgent / stats.total) * 100) : 0}%
            </p>
            <p className="opacity-90">من إجمالي الطلبات</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">{stats.urgent} طلب مستعجل</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white">
          <CardHeader>
            <CardTitle>إجمالي الميزانيات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">
              {(requests.reduce((sum, r) => sum + (r.budget || 0), 0) / 1000000).toFixed(1)}M
            </p>
            <p className="opacity-90">ريال سعودي</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">القيمة الإجمالية للطلبات</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#01411C] to-green-700 text-white">
          <CardHeader>
            <CardTitle>معدل الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{Math.round(stats.total / 6)}</p>
            <p className="opacity-90">طلب شهرياً</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">متوسط آخر 6 أشهر</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
