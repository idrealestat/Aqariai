import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  Home, 
  TrendingUp, 
  DollarSign,
  Eye,
  Share2,
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
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';

interface OffersAnalyticsProps {
  onBack: () => void;
}

export default function OffersAnalytics({ onBack }: OffersAnalyticsProps) {
  const [offers, setOffers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    avgPrice: 0,
    totalViews: 0,
    avgViews: 0
  });

  useEffect(() => {
    loadOffersData();
  }, []);

  const loadOffersData = () => {
    try {
      const data = localStorage.getItem('published_ads_storage');
      const offersList = data ? JSON.parse(data) : [];
      setOffers(offersList);

      const totalViews = offersList.reduce((sum: number, offer: any) => sum + (offer.views || 0), 0);
      const prices = offersList.map((o: any) => o.price || 0).filter((p: number) => p > 0);
      const avgPrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : 0;

      const stats = {
        total: offersList.length,
        published: offersList.filter((o: any) => o.status === 'published').length,
        draft: offersList.filter((o: any) => o.status === 'draft').length,
        avgPrice: avgPrice,
        totalViews: totalViews,
        avgViews: offersList.length > 0 ? totalViews / offersList.length : 0
      };

      setStats(stats);

      console.log('📊 تحليلات العروض:', stats);
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات العروض:', error);
    }
  };

  const propertyTypeData = [
    { name: 'شقة', value: offers.filter(o => o.propertyType === 'شقة').length, color: '#01411C' },
    { name: 'فيلا', value: offers.filter(o => o.propertyType === 'فيلا').length, color: '#D4AF37' },
    { name: 'أرض', value: offers.filter(o => o.propertyType === 'أرض').length, color: '#10b981' },
    { name: 'عمارة', value: offers.filter(o => o.propertyType === 'عمارة').length, color: '#3b82f6' },
    { name: 'أخرى', value: offers.filter(o => !['شقة', 'فيلا', 'أرض', 'عمارة'].includes(o.propertyType)).length, color: '#8b5cf6' }
  ];

  const priceRangeData = [
    { range: '< 500K', count: offers.filter(o => (o.price || 0) < 500000).length },
    { range: '500K-1M', count: offers.filter(o => (o.price || 0) >= 500000 && (o.price || 0) < 1000000).length },
    { range: '1M-2M', count: offers.filter(o => (o.price || 0) >= 1000000 && (o.price || 0) < 2000000).length },
    { range: '2M-5M', count: offers.filter(o => (o.price || 0) >= 2000000 && (o.price || 0) < 5000000).length },
    { range: '> 5M', count: offers.filter(o => (o.price || 0) >= 5000000).length }
  ];

  const monthlyPublish = [
    { month: 'يناير', منشور: 12, مسودة: 5 },
    { month: 'فبراير', منشور: 15, مسودة: 3 },
    { month: 'مارس', منشور: 18, مسودة: 4 },
    { month: 'أبريل', منشور: 22, مسودة: 6 },
    { month: 'مايو', منشور: 28, مسودة: 2 },
    { month: 'يونيو', منشور: stats.published, مسودة: stats.draft }
  ];

  // بيانات المشاهدات مقابل السعر
  const viewsPriceData = offers.map(offer => ({
    price: (offer.price || 0) / 1000000, // تحويل لمليون
    views: offer.views || 0,
    name: offer.title || 'عرض'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6" dir="rtl">
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
            <Home className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#01411C]">تحليلات العروض العقارية</h1>
            <p className="text-gray-600">تحليل شامل للعروض والأسعار والأداء</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-[#01411C] to-green-700 text-white border-0">
          <CardContent className="p-6">
            <Home className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm opacity-90">إجمالي العروض</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <Share2 className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.published}</p>
            <p className="text-sm opacity-90">منشور</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{(stats.avgPrice / 1000000).toFixed(1)}M</p>
            <p className="text-sm opacity-90">متوسط السعر</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <Eye className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{Math.round(stats.avgViews)}</p>
            <p className="text-sm opacity-90">متوسط المشاهدات</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Property Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Home className="w-5 h-5" />
              توزيع أنواع العقارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.value > 0 ? `${entry.name}: ${entry.value}` : null}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <DollarSign className="w-5 h-5" />
              توزيع الأسعار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceRangeData}>
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

        {/* Monthly Publishing Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              اتجاه النشر الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPublish}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="منشور" stroke="#01411C" strokeWidth={3} />
                <Line type="monotone" dataKey="مسودة" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Views vs Price Scatter */}
        {viewsPriceData.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#01411C]">
                <Eye className="w-5 h-5" />
                العلاقة بين السعر والمشاهدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="price" name="السعر (مليون)" unit="M" />
                  <YAxis type="number" dataKey="views" name="المشاهدات" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="العروض" data={viewsPriceData} fill="#01411C" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#01411C]">أفضل العروض أداءً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#01411C] text-white">
                <tr>
                  <th className="p-3 text-right">العنوان</th>
                  <th className="p-3 text-right">النوع</th>
                  <th className="p-3 text-right">السعر</th>
                  <th className="p-3 text-right">المشاهدات</th>
                  <th className="p-3 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {offers
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 10)
                  .map((offer, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{offer.title || 'عرض عقاري'}</td>
                      <td className="p-3">
                        <Badge className="bg-[#01411C]">
                          {offer.propertyType || 'غير محدد'}
                        </Badge>
                      </td>
                      <td className="p-3">{(offer.price || 0).toLocaleString('ar-SA')} ر.س</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {offer.views || 0}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={offer.status === 'published' ? 'bg-green-500' : 'bg-gray-500'}>
                          {offer.status === 'published' ? 'منشور' : 'مسودة'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      لا توجد عروض مسجلة
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
            <CardTitle>إجمالي المشاهدات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.totalViews.toLocaleString('ar-SA')}</p>
            <p className="opacity-90">مشاهدة كلية</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">متوسط: {Math.round(stats.avgViews)} مشاهدة/عرض</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white">
          <CardHeader>
            <CardTitle>معدل النشر</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}%</p>
            <p className="opacity-90">من العروض منشورة</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">{stats.published} منشور / {stats.total} إجمالي</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle>إجمالي القيمة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">
              {(offers.reduce((sum, o) => sum + (o.price || 0), 0) / 1000000).toFixed(1)}M
            </p>
            <p className="opacity-90">ريال سعودي</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">قيمة المحفظة العقارية</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
