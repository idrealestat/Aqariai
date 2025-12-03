import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  UserPlus,
  DollarSign,
  Target,
  Award
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

interface CRMAnalyticsProps {
  onBack: () => void;
}

export default function CRMAnalytics({ onBack }: CRMAnalyticsProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    buyers: 0,
    sellers: 0,
    active: 0,
    thisMonth: 0,
    avgValue: 0
  });

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = () => {
    try {
      const data = localStorage.getItem('customers');
      const customersList = data ? JSON.parse(data) : [];
      setCustomers(customersList);

      const stats = {
        total: customersList.length,
        buyers: customersList.filter((c: any) => c.type === 'buyer').length,
        sellers: customersList.filter((c: any) => c.type === 'seller').length,
        active: customersList.filter((c: any) => c.status === 'active').length,
        thisMonth: customersList.filter((c: any) => {
          const date = new Date(c.createdAt || Date.now());
          const now = new Date();
          return date.getMonth() === now.getMonth();
        }).length,
        avgValue: 750000 // قيمة افتراضية
      };

      setStats(stats);

      console.log('📊 تحليلات CRM:', stats);
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات CRM:', error);
    }
  };

  const customerTypeData = [
    { name: 'مشترون', value: stats.buyers, color: '#01411C' },
    { name: 'بائعون', value: stats.sellers, color: '#D4AF37' },
    { name: 'كلاهما', value: stats.total - stats.buyers - stats.sellers, color: '#10b981' }
  ];

  const monthlyGrowth = [
    { month: 'يناير', عملاء: 45 },
    { month: 'فبراير', عملاء: 52 },
    { month: 'مارس', عملاء: 48 },
    { month: 'أبريل', عملاء: 61 },
    { month: 'مايو', عملاء: 73 },
    { month: 'يونيو', عملاء: stats.total }
  ];

  const conversionData = [
    { stage: 'عملاء جدد', count: stats.total },
    { stage: 'تواصل أولي', count: Math.round(stats.total * 0.8) },
    { stage: 'معاينة', count: Math.round(stats.total * 0.6) },
    { stage: 'عرض سعر', count: Math.round(stats.total * 0.4) },
    { stage: 'صفقة', count: Math.round(stats.total * 0.25) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-4 md:p-6" dir="rtl">
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
          <div className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 p-4 rounded-xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#01411C]">تحليلات إدارة العملاء CRM</h1>
            <p className="text-gray-600">تحليل شامل لقاعدة العملاء والصفقات</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm opacity-90">إجمالي العملاء</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <Target className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.active}</p>
            <p className="text-sm opacity-90">عملاء نشطون</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <UserPlus className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.thisMonth}</p>
            <p className="text-sm opacity-90">عملاء جدد هذا الشهر</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <Award className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{Math.round((stats.active / stats.total) * 100) || 0}%</p>
            <p className="text-sm opacity-90">معدل النشاط</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Customer Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Users className="w-5 h-5" />
              توزيع أنواع العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              نمو قاعدة العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="عملاء" stroke="#D4AF37" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Target className="w-5 h-5" />
              قمع التحويل - من عميل محتمل إلى صفقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#01411C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#01411C]">قائمة العملاء الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#D4AF37] text-white">
                <tr>
                  <th className="p-3 text-right">الاسم</th>
                  <th className="p-3 text-right">النوع</th>
                  <th className="p-3 text-right">الهاتف</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">تاريخ الإضافة</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 10).map((customer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{customer.name || 'غير محدد'}</td>
                    <td className="p-3">
                      <Badge className={customer.type === 'buyer' ? 'bg-green-500' : 'bg-blue-500'}>
                        {customer.type === 'buyer' ? 'مشتري' : 'بائع'}
                      </Badge>
                    </td>
                    <td className="p-3" dir="ltr">{customer.phone || '-'}</td>
                    <td className="p-3">
                      <Badge className={customer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="p-3">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('ar-SA') : '-'}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      لا يوجد عملاء مسجلون
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
        <Card className="bg-gradient-to-br from-[#01411C] to-green-700 text-white">
          <CardHeader>
            <CardTitle>معدل نمو العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">+{stats.thisMonth}</p>
            <p className="opacity-90">عميل جديد هذا الشهر</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">نمو: {Math.round((stats.thisMonth / stats.total) * 100) || 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white">
          <CardHeader>
            <CardTitle>متوسط قيمة الصفقة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.avgValue.toLocaleString('ar-SA')}</p>
            <p className="opacity-90">ريال سعودي</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">إجمالي المبيعات المتوقعة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle>معدل التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">25%</p>
            <p className="opacity-90">من عميل إلى صفقة</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">متوسط الصناعة: 20%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
