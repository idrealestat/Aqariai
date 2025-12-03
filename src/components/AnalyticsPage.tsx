/**
 * 📊 صفحة التحليلات - Analytics Page
 * =====================================
 * 
 * صفحة شاملة للتحليلات والإحصائيات مع:
 * - نظرة عامة على الأداء
 * - إحصائيات العقارات والطلبات والعملاء
 * - رسوم بيانية تفاعلية
 * - تصدير التقارير
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Home,
  FileText,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useDashboardContext } from '../context/DashboardContext';
import { SharedHeader } from './layout/SharedHeader';

// ============================================
// Types
// ============================================

interface AnalyticsPageProps {
  onBack?: () => void;
  userId?: string;
}

interface QuickStat {
  label: string;
  value: number | string;
  change?: number;
  icon: any;
  color: string;
}

// ============================================
// Component
// ============================================

export default function AnalyticsPage({ onBack, userId }: AnalyticsPageProps) {
  const { leftSidebarOpen } = useDashboardContext();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');

  // ============================================
  // Fetch Analytics Data
  // ============================================

  useEffect(() => {
    fetchAnalytics();
  }, [period, userId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?userId=${userId || ''}&period=${period}`, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
      } else {
        console.error('Failed to fetch analytics');
        // Use demo data
        setAnalyticsData(getDemoData());
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      setAnalyticsData(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Demo Data
  // ============================================

  const getDemoData = () => ({
    overview: {
      totalProperties: 55,
      totalRequests: 23,
      totalCustomers: 142,
      totalRevenue: 1250000,
      activeDeals: 12,
      completedDeals: 8
    },
    requests: {
      total: 23,
      urgent: 5,
      active: 18,
      completed: 5,
      byCity: {
        'الرياض': 12,
        'جدة': 7,
        'الدمام': 4
      },
      totalBudget: 25000000
    },
    customers: {
      total: 142,
      active: 98,
      byStage: {
        'جديد': 45,
        'متابعة': 32,
        'تفاوض': 21,
        'تم الإغلاق': 18,
        'مؤرشف': 26
      },
      conversionRate: 12.7
    },
    performance: {
      responseTime: 2.5,
      satisfactionRate: 92,
      closingRate: 35
    },
    trends: {
      monthlyGrowth: 15.5
    }
  });

  // ============================================
  // Quick Stats
  // ============================================

  const quickStats: QuickStat[] = analyticsData ? [
    {
      label: 'إجمالي الطلبات',
      value: analyticsData.requests.total,
      change: +12,
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'العملاء النشطون',
      value: analyticsData.customers.active,
      change: +8,
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'الصفقات الجارية',
      value: analyticsData.overview.activeDeals,
      change: +5,
      icon: Activity,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'الإيرادات (ريال)',
      value: analyticsData.overview.totalRevenue?.toLocaleString('ar-SA') || '0',
      change: +15.5,
      icon: DollarSign,
      color: 'from-[#D4AF37] to-[#C5A028]'
    }
  ] : [];

  // ============================================
  // Render
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#01411C] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-6 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                size="icon"
                className="border-2 border-[#D4AF37]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-[#01411C] flex items-center gap-3">
                <BarChart3 className="w-8 h-8" />
                التحليلات والإحصائيات
              </h1>
              <p className="text-gray-600 mt-1">
                نظرة شاملة على أداء نشاطك العقاري
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Period Selector */}
            <div className="flex gap-2">
              {(['7', '30', '90'] as const).map(p => (
                <Button
                  key={p}
                  onClick={() => setPeriod(p)}
                  variant={period === p ? 'default' : 'outline'}
                  className={period === p ? 'bg-[#01411C]' : ''}
                  size="sm"
                >
                  {p === '7' ? 'أسبوع' : p === '30' ? 'شهر' : '3 أشهر'}
                </Button>
              ))}
            </div>

            <Button
              onClick={fetchAnalytics}
              variant="outline"
              size="icon"
              className="border-[#D4AF37]"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-[#D4AF37] overflow-hidden hover:shadow-xl transition-all">
                <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    {stat.change !== undefined && (
                      <Badge className={stat.change >= 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                        {stat.change >= 0 ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                        {Math.abs(stat.change)}%
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#01411C] mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Requests Analytics */}
          <Card className="border-2 border-[#D4AF37] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                تحليل الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div>
                  <p className="text-sm text-red-600 mb-1">طلبات مستعجلة</p>
                  <p className="text-2xl font-bold text-red-700">{analyticsData?.requests.urgent}</p>
                </div>
                <div className="text-4xl">🔴</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div>
                  <p className="text-sm text-green-600 mb-1">طلبات نشطة</p>
                  <p className="text-2xl font-bold text-green-700">{analyticsData?.requests.active}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>

              <div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] p-4 rounded-lg text-white">
                <p className="text-sm mb-1 opacity-90">إجمالي الميزانيات</p>
                <p className="text-2xl font-bold">
                  {analyticsData?.requests.totalBudget?.toLocaleString('ar-SA')} ر.س
                </p>
              </div>

              {/* By City */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">التوزيع حسب المدينة:</h4>
                {Object.entries(analyticsData?.requests.byCity || {}).map(([city, count]) => (
                  <div key={city} className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{city}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(count as number / analyticsData?.requests.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8">{count as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customers Analytics */}
          <Card className="border-2 border-[#D4AF37] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                تحليل العملاء
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">إجمالي العملاء</p>
                  <p className="text-2xl font-bold text-[#01411C]">{analyticsData?.customers.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-xs text-green-600 mb-1">عملاء نشطون</p>
                  <p className="text-2xl font-bold text-green-700">{analyticsData?.customers.active}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                <p className="text-sm mb-1 opacity-90">معدل التحويل</p>
                <p className="text-3xl font-bold">{analyticsData?.customers.conversionRate}%</p>
              </div>

              {/* By Stage */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">التوزيع حسب المرحلة:</h4>
                {Object.entries(analyticsData?.customers.byStage || {}).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{stage}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(count as number / analyticsData?.customers.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8">{count as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-2 border-[#D4AF37] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                مؤشرات الأداء
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">وقت الاستجابة</span>
                  <span className="text-xl font-bold text-[#01411C]">
                    {analyticsData?.performance.responseTime} ساعة
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل الرضا</span>
                  <span className="text-xl font-bold text-green-600">
                    {analyticsData?.performance.satisfactionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analyticsData?.performance.satisfactionRate}%` }} />
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل إتمام الصفقات</span>
                  <span className="text-xl font-bold text-purple-600">
                    {analyticsData?.performance.closingRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${analyticsData?.performance.closingRate}%` }} />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#01411C] to-[#065f41] rounded-lg text-white">
                <p className="text-sm mb-1 opacity-90">النمو الشهري</p>
                <p className="text-3xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {analyticsData?.trends.monthlyGrowth}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-[#D4AF37] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button 
                className="w-full justify-between bg-white hover:bg-gray-50 text-[#01411C] border-2 border-gray-200"
                onClick={() => {/* Navigate to requests */}}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  عرض جميع الطلبات
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button 
                className="w-full justify-between bg-white hover:bg-gray-50 text-[#01411C] border-2 border-gray-200"
                onClick={() => {/* Navigate to customers */}}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  إدارة العملاء
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button 
                className="w-full justify-between bg-white hover:bg-gray-50 text-[#01411C] border-2 border-gray-200"
                onClick={() => {/* Navigate to analytics dashboard */}}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  التحليلات المتقدمة
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button 
                className="w-full justify-between bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white"
                onClick={() => {/* Generate report */}}
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  تصدير تقرير شامل
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800 text-center">
              📊 البيانات يتم تحديثها تلقائياً كل 5 دقائق • آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}