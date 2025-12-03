import { ArrowRight, BarChart3, TrendingUp, Users, Home, Calendar, ClipboardList, FileText, DollarSign, Target, Activity, Award, PieChart, LineChart, AreaChart, Zap, TrendingDown, Package, Settings, Bell } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useDashboardContext } from '../context/DashboardContext';

// استيراد صفحات التحليلات الفرعية
import CalendarAnalytics from './analytics/CalendarAnalytics';
import CRMAnalytics from './analytics/CRMAnalytics';
import OffersAnalytics from './analytics/OffersAnalytics';
import RequestsAnalytics from './analytics/RequestsAnalytics';
import PlatformsAnalytics from './analytics/PlatformsAnalytics';
import GeneralComparison from './analytics/GeneralComparison';

// ============================================
// 📊 TYPES
// ============================================

type AnalyticsSection = 
  | 'main'
  | 'calendar'
  | 'crm'
  | 'myplatform'
  | 'dashboard'
  | 'offers'
  | 'requests'
  | 'platforms'
  | 'create-ad'
  | 'finance-calc'
  | 'social-media';

interface AnalyticsCard {
  id: AnalyticsSection;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  count?: number;
  description: string;
}

// ============================================
// 📊 MAIN COMPONENT
// ============================================

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export default function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const { leftSidebarOpen } = useDashboardContext();
  const [currentView, setCurrentView] = useState<AnalyticsSection>('main');
  const [stats, setStats] = useState({
    totalAds: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    totalRequests: 0,
    publishedPlatforms: 0
  });

  // ============================================
  // 📊 تحميل الإحصائيات الحقيقية
  // ============================================
  useEffect(() => {
    loadRealStats();
  }, []);

  const loadRealStats = () => {
    try {
      // الإعلانات المنشورة
      const adsData = localStorage.getItem('published_ads_storage');
      const ads = adsData ? JSON.parse(adsData) : [];
      
      // العملاء
      const customersData = localStorage.getItem('customers');
      const customers = customersData ? JSON.parse(customersData) : [];
      
      // المواعيد
      const appointmentsData = localStorage.getItem('calendar_events');
      const appointments = appointmentsData ? JSON.parse(appointmentsData) : [];
      
      // الطلبات
      const requestsData = localStorage.getItem('customer_requests');
      const requests = requestsData ? JSON.parse(requestsData) : [];

      setStats({
        totalAds: ads.length,
        totalCustomers: customers.length,
        totalAppointments: appointments.length,
        totalRequests: requests.length,
        publishedPlatforms: ads.filter((ad: any) => ad.publishedPlatforms?.length > 0).length
      });

      console.log('📊 تم تحميل الإحصائيات:', {
        totalAds: ads.length,
        totalCustomers: customers.length,
        totalAppointments: appointments.length,
        totalRequests: requests.length
      });
    } catch (error) {
      console.error('❌ خطأ في تحميل الإحصائيات:', error);
    }
  };

  // ============================================
  // 📊 بطاقات التحليلات
  // ============================================
  const analyticsCards: AnalyticsCard[] = [
    {
      id: 'calendar',
      title: 'التقويم والمواعيد',
      icon: <Calendar className="w-8 h-8" />,
      color: '#01411C',
      bgGradient: 'from-green-900 to-green-700',
      count: stats.totalAppointments,
      description: 'تحليل المواعيد والأنشطة'
    },
    {
      id: 'crm',
      title: 'إدارة العملاء CRM',
      icon: <Users className="w-8 h-8" />,
      color: '#D4AF37',
      bgGradient: 'from-yellow-600 to-yellow-500',
      count: stats.totalCustomers,
      description: 'تحليل العملاء والصفقات'
    },
    {
      id: 'myplatform',
      title: 'منصتي',
      icon: <Home className="w-8 h-8" />,
      color: '#01411C',
      bgGradient: 'from-emerald-800 to-emerald-600',
      count: stats.totalAds,
      description: 'تحليل الإعلانات المنشورة'
    },
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      icon: <BarChart3 className="w-8 h-8" />,
      color: '#D4AF37',
      bgGradient: 'from-amber-600 to-amber-500',
      description: 'نظرة شاملة على الأداء'
    },
    {
      id: 'offers',
      title: 'العروض العقارية',
      icon: <Home className="w-8 h-8" />,
      color: '#01411C',
      bgGradient: 'from-teal-800 to-teal-600',
      count: stats.totalAds,
      description: 'تحليل العروض والأسعار'
    },
    {
      id: 'requests',
      title: 'الطلبات',
      icon: <FileText className="w-8 h-8" />,
      color: '#D4AF37',
      bgGradient: 'from-orange-600 to-orange-500',
      count: stats.totalRequests,
      description: 'تحليل طلبات العملاء'
    },
    {
      id: 'platforms',
      title: 'النشر على المنصات',
      icon: <ClipboardList className="w-8 h-8" />,
      color: '#01411C',
      bgGradient: 'from-blue-800 to-blue-600',
      count: stats.publishedPlatforms,
      description: 'تحليل المنصات المرتبطة'
    },
    {
      id: 'create-ad',
      title: 'إنشاء الإعلانات',
      icon: <PlusCircle className="w-8 h-8" />,
      color: '#D4AF37',
      bgGradient: 'from-purple-600 to-purple-500',
      description: 'تحليل عملية الإنشاء'
    },
    {
      id: 'finance-calc',
      title: 'حاسبة التمويل',
      icon: <Calculator className="w-8 h-8" />,
      color: '#01411C',
      bgGradient: 'from-indigo-800 to-indigo-600',
      description: 'تحليل الحسابات المالية'
    },
    {
      id: 'social-media',
      title: 'النشر على التواصل',
      icon: <Share2 className="w-8 h-8" />,
      color: '#D4AF37',
      bgGradient: 'from-pink-600 to-pink-500',
      description: 'تحليل المشاركات الاجتماعية'
    }
  ];

  // ============================================
  // 🎨 RENDER: عرض الصفحة المختارة
  // ============================================
  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarAnalytics onBack={() => setCurrentView('main')} />;
      case 'crm':
        return <CRMAnalytics onBack={() => setCurrentView('main')} />;
      case 'offers':
      case 'myplatform':
      case 'dashboard':
        return <OffersAnalytics onBack={() => setCurrentView('main')} />;
      case 'requests':
        return <RequestsAnalytics onBack={() => setCurrentView('main')} />;
      case 'platforms':
      case 'create-ad':
      case 'social-media':
        return <PlatformsAnalytics onBack={() => setCurrentView('main')} section={currentView} />;
      case 'finance-calc':
        return <PlatformsAnalytics onBack={() => setCurrentView('main')} section="finance-calc" />;
      default:
        return null;
    }
  };

  if (currentView !== 'main') {
    return renderContent();
  }

  // ============================================
  // 🎨 RENDER: الصفحة الرئيسية
  // ============================================
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            رجوع
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl text-[#01411C] mb-2 flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37]" />
              <span>مركز التحليلات الشامل</span>
            </h1>
            <p className="text-gray-600">
              تحليلات متقدمة لجميع أقسام التطبيق
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-[#01411C] to-green-800 text-white border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-90">إجمالي الإعلانات</p>
              <p className="text-3xl font-bold">{stats.totalAds}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#D4AF37] to-yellow-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-90">إجمالي العملاء</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-90">المواعيد</p>
              <p className="text-3xl font-bold">{stats.totalAppointments}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-90">الطلبات</p>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-90">المنصات المتصلة</p>
              <p className="text-3xl font-bold">{stats.publishedPlatforms}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 overflow-hidden group aspect-square`}
              onClick={() => setCurrentView(card.id)}
            >
              <div className={`bg-gradient-to-br ${card.bgGradient} p-6 text-white relative h-full flex flex-col justify-between`}>
                <div className="absolute top-2 left-2 opacity-20 transform group-hover:scale-110 transition-transform">
                  {React.cloneElement(card.icon as React.ReactElement, { 
                    className: "w-24 h-24" 
                  })}
                </div>
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="mb-2">
                    {card.icon}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                    
                    {card.count !== undefined && (
                      <Badge className="bg-white/20 text-white border-0 mb-2">
                        {card.count} عنصر
                      </Badge>
                    )}
                    
                    <p className="text-sm opacity-90 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* General Comparison Section */}
      <GeneralComparison />
    </div>
  );
}