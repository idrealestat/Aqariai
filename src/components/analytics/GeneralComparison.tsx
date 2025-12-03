import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  MapPin, 
  TrendingUp, 
  Award,
  Users,
  Target,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area
} from 'recharts';

export default function GeneralComparison() {
  const [myStats, setMyStats] = useState({
    ads: 0,
    customers: 0,
    appointments: 0,
    performance: 0
  });

  useEffect(() => {
    loadMyStats();
  }, []);

  const loadMyStats = () => {
    try {
      const ads = localStorage.getItem('published_ads_storage');
      const customers = localStorage.getItem('customers');
      const appointments = localStorage.getItem('calendar_events');

      const adsCount = ads ? JSON.parse(ads).length : 0;
      const customersCount = customers ? JSON.parse(customers).length : 0;
      const appointmentsCount = appointments ? JSON.parse(appointments).length : 0;

      const performance = Math.round((adsCount + customersCount + appointmentsCount) / 3);

      setMyStats({
        ads: adsCount,
        customers: customersCount,
        appointments: appointmentsCount,
        performance
      });
    } catch (error) {
      console.error('❌ خطأ في تحميل الإحصائيات:', error);
    }
  };

  // مقارنة مع المستخدمين الآخرين (بيانات وهمية للمقارنة)
  const comparisonData = [
    { metric: 'الإعلانات', أنت: myStats.ads, 'المتوسط': 25, 'الأفضل': 50 },
    { metric: 'العملاء', أنت: myStats.customers, 'المتوسط': 40, 'الأفضل': 80 },
    { metric: 'المواعيد', أنت: myStats.appointments, 'المتوسط': 30, 'الأفضل': 60 },
    { metric: 'التفاعل', أنت: myStats.performance, 'المتوسط': 35, 'الأفضل': 70 }
  ];

  // بيانات الخريطة - التوزيع الجغرافي
  const geographicData = [
    { city: 'الرياض', brokers: 450, ads: 2800, color: '#01411C' },
    { city: 'جدة', brokers: 380, ads: 2200, color: '#D4AF37' },
    { city: 'الدمام', brokers: 220, ads: 1400, color: '#10b981' },
    { city: 'مكة', brokers: 180, ads: 1100, color: '#3b82f6' },
    { city: 'المدينة', brokers: 150, ads: 950, color: '#8b5cf6' },
    { city: 'الطائف', brokers: 120, ads: 780, color: '#f59e0b' },
    { city: 'تبوك', brokers: 90, ads: 580, color: '#ef4444' },
    { city: 'أخرى', brokers: 210, ads: 1390, color: '#6b7280' }
  ];

  // بيانات الأحياء النشطة
  const activeNeighborhoods = [
    { name: 'الملقا', activity: 95, brokers: 45 },
    { name: 'العليا', activity: 92, brokers: 52 },
    { name: 'النرجس', activity: 88, brokers: 38 },
    { name: 'الياسمين', activity: 85, brokers: 41 },
    { name: 'الرحمانية', activity: 82, brokers: 33 },
    { name: 'حطين', activity: 80, brokers: 36 },
    { name: 'المعذر', activity: 78, brokers: 29 },
    { name: 'الروضة', activity: 75, brokers: 31 }
  ];

  // بيانات الأداء الإقليمي
  const regionalPerformance = [
    { region: 'المنطقة الوسطى', أداء: 92, إعلانات: 3200, عملاء: 1800 },
    { region: 'المنطقة الغربية', أداء: 88, إعلانات: 2800, عملاء: 1600 },
    { region: 'المنطقة الشرقية', أداء: 85, إعلانات: 1900, عملاء: 1200 },
    { region: 'المنطقة الجنوبية', أداء: 78, إعلانات: 1200, عملاء: 800 },
    { region: 'المنطقة الشمالية', أداء: 72, إعلانات: 950, عملاء: 650 }
  ];

  // حساب الترتيب
  const calculateRank = (value: number, average: number, best: number) => {
    if (value >= best * 0.8) return { rank: 'ممتاز', color: 'bg-green-500', icon: '🏆' };
    if (value >= average) return { rank: 'جيد جداً', color: 'bg-blue-500', icon: '⭐' };
    if (value >= average * 0.7) return { rank: 'جيد', color: 'bg-yellow-500', icon: '👍' };
    return { rank: 'بحاجة تحسين', color: 'bg-orange-500', icon: '📈' };
  };

  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* 📊 المقارنة مع المشتركين */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-4 border-[#D4AF37] shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-green-700 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Users className="w-8 h-8" />
              مقارنة أدائك مع جميع المشتركين
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* الرسم البياني للمقارنة */}
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="أنت" fill="#01411C" />
                <Line type="monotone" dataKey="المتوسط" stroke="#D4AF37" strokeWidth={3} />
                <Area type="monotone" dataKey="الأفضل" fill="#10b981" stroke="#10b981" fillOpacity={0.2} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* جدول التفاصيل */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {comparisonData.map((item, index) => {
                const status = calculateRank(item.أنت, item.المتوسط, item.الأفضل);
                return (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-[#01411C]">{item.metric}</p>
                        <Badge className={status.color}>
                          {status.icon} {status.rank}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">أنت</p>
                          <p className="font-bold text-lg">{item.أنت}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">المتوسط</p>
                          <p className="font-bold text-lg">{item.المتوسط}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">الأفضل</p>
                          <p className="font-bold text-lg">{item.الأفضل}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#01411C] h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((item.أنت / item.الأفضل) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* الترتيب العام */}
            <Card className="mt-6 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">ترتيبك العام</p>
                    <p className="text-5xl font-bold">#{Math.round(Math.random() * 100 + 50)}</p>
                    <p className="text-sm opacity-90 mt-1">من أصل 1,847 وسيط</p>
                  </div>
                  <div className="text-right">
                    <Award className="w-20 h-20 opacity-50" />
                    <p className="mt-2">
                      {myStats.performance >= 35 ? 'أداء ممتاز! 🏆' : 'استمر في التحسين! 📈'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* 🗺️ التوزيع الجغرافي */}
      {/* ============================================ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* خريطة المدن */}
        <Card className="border-4 border-[#01411C]">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-green-700 text-white">
            <CardTitle className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              التوزيع الجغرافي - المدن الرئيسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={geographicData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="city" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="brokers" fill="#01411C" name="الوسطاء" />
                <Bar dataKey="ads" fill="#D4AF37" name="الإعلانات" />
              </BarChart>
            </ResponsiveContainer>

            {/* قائمة المدن */}
            <div className="mt-4 space-y-2">
              {geographicData.slice(0, 5).map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: city.color }}
                    />
                    <p className="font-bold">{city.city}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-600">{city.brokers} وسيط</p>
                    <p className="text-[#D4AF37] font-bold">{city.ads} إعلان</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الأحياء النشطة */}
        <Card className="border-4 border-[#D4AF37]">
          <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-white">
            <CardTitle className="flex items-center gap-3">
              <Activity className="w-6 h-6" />
              الأحياء الأكثر نشاطاً
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={activeNeighborhoods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="activity" fill="#D4AF37" name="النشاط %" />
              </BarChart>
            </ResponsiveContainer>

            {/* قائمة الأحياء */}
            <div className="mt-4 space-y-2">
              {activeNeighborhoods.slice(0, 5).map((neighborhood, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#D4AF37]">#{index + 1}</Badge>
                    <p className="font-bold">{neighborhood.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <p className="font-bold text-[#D4AF37]">{neighborhood.activity}%</p>
                    </div>
                    <p className="text-sm text-gray-600">{neighborhood.brokers} وسيط</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================ */}
      {/* 📊 الأداء الإقليمي */}
      {/* ============================================ */}
      <Card className="border-4 border-green-500">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-3 text-xl">
            <TrendingUp className="w-6 h-6" />
            الأداء حسب المناطق الإدارية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={regionalPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="عملاء" fill="#10b981" stroke="#10b981" fillOpacity={0.3} />
              <Bar dataKey="إعلانات" fill="#01411C" />
              <Line type="monotone" dataKey="أداء" stroke="#D4AF37" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>

          {/* جدول المناطق */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-right">المنطقة</th>
                  <th className="p-3 text-right">الأداء</th>
                  <th className="p-3 text-right">الإعلانات</th>
                  <th className="p-3 text-right">العملاء</th>
                  <th className="p-3 text-right">التقييم</th>
                </tr>
              </thead>
              <tbody>
                {regionalPerformance.map((region, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold">{region.region}</td>
                    <td className="p-3">
                      <Badge className={
                        region.أداء >= 85 ? 'bg-green-500' :
                        region.أداء >= 75 ? 'bg-blue-500' : 'bg-orange-500'
                      }>
                        {region.أداء}%
                      </Badge>
                    </td>
                    <td className="p-3">{region.إعلانات.toLocaleString('ar-SA')}</td>
                    <td className="p-3">{region.عملاء.toLocaleString('ar-SA')}</td>
                    <td className="p-3">
                      {region.أداء >= 85 ? '⭐⭐⭐⭐⭐' :
                       region.أداء >= 80 ? '⭐⭐⭐⭐' :
                       region.أداء >= 75 ? '⭐⭐⭐' : '⭐⭐'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* نصائح للتحسين */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6" />
            نصائح لتحسين أدائك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="font-bold mb-2">📈 زد إعلاناتك</p>
              <p className="text-sm opacity-90">
                المتوسط 25 إعلان. حاول الوصول إلى 30+ للتفوق على المنافسين
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="font-bold mb-2">👥 وسع قاعدة عملائك</p>
              <p className="text-sm opacity-90">
                أضف 5 عملاء جدد شهرياً لزيادة فرص الصفقات
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <p className="font-bold mb-2">🎯 ركز على المناطق النشطة</p>
              <p className="text-sm opacity-90">
                الملقا والعليا لديهم أعلى نشاط - ركز جهودك هناك
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
