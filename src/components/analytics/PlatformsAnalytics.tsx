import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  Globe, 
  TrendingUp, 
  Share2,
  Eye,
  MousePointerClick,
  Calculator,
  PlusCircle
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface PlatformsAnalyticsProps {
  onBack: () => void;
  section: string;
}

export default function PlatformsAnalytics({ onBack, section }: PlatformsAnalyticsProps) {
  const [stats, setStats] = useState({
    totalPublished: 0,
    totalPlatforms: 0,
    totalViews: 0,
    totalShares: 0,
    financeCalcs: 0
  });

  useEffect(() => {
    loadPlatformsData();
  }, []);

  const loadPlatformsData = () => {
    try {
      const data = localStorage.getItem('published_ads_storage');
      const ads = data ? JSON.parse(data) : [];
      
      const totalPlatforms = ads.reduce((sum: number, ad: any) => 
        sum + (ad.publishedPlatforms?.length || 0), 0);
      
      const stats = {
        totalPublished: ads.length,
        totalPlatforms: totalPlatforms,
        totalViews: ads.reduce((sum: number, ad: any) => sum + (ad.views || 0), 0),
        totalShares: ads.reduce((sum: number, ad: any) => sum + (ad.shares || 0), 0),
        financeCalcs: 45 // قيمة افتراضية
      };

      setStats(stats);

      console.log('📊 تحليلات المنصات:', stats);
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات المنصات:', error);
    }
  };

  // بيانات المنصات
  const platformsData = [
    { name: 'Instagram', posts: 45, engagement: 850, color: '#E1306C' },
    { name: 'WhatsApp', posts: 120, engagement: 1200, color: '#25D366' },
    { name: 'Twitter/X', posts: 30, engagement: 420, color: '#1DA1F2' },
    { name: 'Facebook', posts: 25, engagement: 380, color: '#4267B2' },
    { name: 'LinkedIn', posts: 15, engagement: 210, color: '#0077B5' },
    { name: 'TikTok', posts: 20, engagement: 950, color: '#000000' }
  ];

  const monthlyPublishing = [
    { month: 'يناير', منشورات: 45, تفاعل: 850 },
    { month: 'فبراير', منشورات: 52, تفاعل: 920 },
    { month: 'مارس', منشورات: 48, تفاعل: 880 },
    { month: 'أبريل', منشورات: 61, تفاعل: 1150 },
    { month: 'مايو', منشورات: 73, تفاعل: 1340 },
    { month: 'يونيو', منشورات: stats.totalPublished, تفاعل: stats.totalViews }
  ];

  const performanceData = [
    { platform: 'Instagram', نشر: 90, تفاعل: 85, وصول: 88 },
    { platform: 'WhatsApp', نشر: 95, تفاعل: 92, وصول: 98 },
    { platform: 'Twitter', نشر: 70, تفاعل: 65, وصول: 72 },
    { platform: 'Facebook', نشر: 60, تفاعل: 58, وصول: 63 },
    { platform: 'LinkedIn', نشر: 50, تفاعل: 55, وصول: 52 },
    { platform: 'TikTok', نشر: 75, تفاعل: 88, وصول: 80 }
  ];

  // حاسبة التمويل
  const financeData = [
    { type: 'حساب تمويل', count: 25 },
    { type: 'جدولة أقساط', count: 15 },
    { type: 'مقارنة بنوك', count: 10 },
    { type: 'استشارات', count: 8 }
  ];

  const getTitle = () => {
    switch (section) {
      case 'platforms':
        return 'تحليلات النشر على المنصات';
      case 'create-ad':
        return 'تحليلات إنشاء الإعلانات';
      case 'social-media':
        return 'تحليلات التواصل الاجتماعي';
      case 'finance-calc':
        return 'تحليلات حاسبة التمويل';
      default:
        return 'تحليلات المنصات';
    }
  };

  const getIcon = () => {
    switch (section) {
      case 'finance-calc':
        return <Calculator className="w-10 h-10 text-white" />;
      case 'create-ad':
        return <PlusCircle className="w-10 h-10 text-white" />;
      default:
        return <Globe className="w-10 h-10 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6" dir="rtl">
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
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-xl">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#01411C]">{getTitle()}</h1>
            <p className="text-gray-600">تحليل شامل للأداء والتفاعل</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
          <CardContent className="p-6">
            <Globe className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.totalPlatforms}</p>
            <p className="text-sm opacity-90">إجمالي النشر</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <Eye className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.totalViews}</p>
            <p className="text-sm opacity-90">المشاهدات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
          <CardContent className="p-6">
            <Share2 className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{stats.totalShares}</p>
            <p className="text-sm opacity-90">المشاركات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <MousePointerClick className="w-8 h-8 mb-2" />
            <p className="text-4xl font-bold mb-1">{Math.round(stats.totalViews * 0.15)}</p>
            <p className="text-sm opacity-90">النقرات</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Platforms Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Globe className="w-5 h-5" />
              توزيع المنشورات على المنصات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              توزيع التفاعل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="engagement"
                >
                  {platformsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Publishing Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              اتجاه النشر والتفاعل الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPublishing}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="منشورات" stroke="#8b5cf6" strokeWidth={3} />
                <Line type="monotone" dataKey="تفاعل" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <TrendingUp className="w-5 h-5" />
              مقارنة أداء المنصات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="platform" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="النشر" dataKey="نشر" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Radar name="التفاعل" dataKey="تفاعل" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                <Radar name="الوصول" dataKey="وصول" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* حاسبة التمويل - إذا كانت الصفحة finance-calc */}
      {section === 'finance-calc' && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#01411C]">
                <Calculator className="w-5 h-5" />
                استخدام حاسبة التمويل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#D4AF37" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white">
            <CardHeader>
              <CardTitle>إحصائيات الحاسبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-90">إجمالي الحسابات</p>
                  <p className="text-3xl font-bold">{stats.financeCalcs}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-90">متوسط مبلغ التمويل</p>
                  <p className="text-3xl font-bold">1.2M ر.س</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-90">مدة التمويل الأكثر شيوعاً</p>
                  <p className="text-3xl font-bold">20 سنة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Platforms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#01411C]">تفاصيل أداء المنصات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="p-3 text-right">المنصة</th>
                  <th className="p-3 text-right">المنشورات</th>
                  <th className="p-3 text-right">التفاعل</th>
                  <th className="p-3 text-right">معدل التفاعل</th>
                  <th className="p-3 text-right">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {platformsData.map((platform, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: platform.color }}
                      />
                      {platform.name}
                    </td>
                    <td className="p-3">{platform.posts}</td>
                    <td className="p-3">{platform.engagement}</td>
                    <td className="p-3">
                      {platform.posts > 0 ? ((platform.engagement / platform.posts) * 100).toFixed(1) : 0}%
                    </td>
                    <td className="p-3">
                      <Badge className="bg-green-500">نشط</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <CardHeader>
            <CardTitle>معدل النشر</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">{Math.round(stats.totalPublished / 6)}</p>
            <p className="opacity-90">منشور شهرياً</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">متوسط آخر 6 أشهر</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardHeader>
            <CardTitle>معدل التفاعل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">
              {stats.totalPublished > 0 ? ((stats.totalViews / stats.totalPublished) * 100).toFixed(1) : 0}%
            </p>
            <p className="opacity-90">نسبة التفاعل</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">أعلى من متوسط الصناعة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#01411C] to-green-700 text-white">
          <CardHeader>
            <CardTitle>أفضل منصة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-2">WhatsApp</p>
            <p className="opacity-90">الأعلى تفاعلاً</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">{platformsData[1].engagement} تفاعل</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
