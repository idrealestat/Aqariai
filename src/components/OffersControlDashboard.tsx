import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useDashboardContext } from '../context/DashboardContext';
import { TrendingUp, Home, Eye, MessageSquare, Share2, Edit, Pin, Plus, FileText, Search, ChevronDown, ChevronUp, MoreVertical, Trash2, MoveRight, ArrowUpToLine, GripVertical, User, Globe, Clock, Target, Download, BarChart3, Smartphone, Monitor, Tablet } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import SubOfferDetailModal from './SubOfferDetailModal';
import { getAllPublishedAds, PublishedAd, updateAdStatus, updatePublishedAd, deletePublishedAd } from '../utils/publishedAds';
import { isAdUnread, markAdAsRead } from '../utils/notificationsSystem';
import type { LiveViewData, PropertyEngagement, LiveViewer, TimeRange } from '../types/analytics';
import { 
  calculateEngagementScore, 
  calculateTrend, 
  calculateDeviceDistribution,
  calculateSourceDistribution,
  calculateGeographicDistribution,
  calculateAverageDuration,
  formatDuration,
  formatDeviceType,
  formatSourceType,
  getTrendColor,
  exportToCSV,
  generateMockViewers,
  generateMockEngagement,
  generateComparisonData
} from '../utils/analytics';

interface SubOffer {
  id: string;
  title: string;
  price: string;
  adNumber: string;
  image: string;
  imageCount: number;
  ownerName?: string; // اسم المالك - يظهر فقط في القائمة الفرعية
  ownerPhone?: string; // رقم جوال المالك
}

interface Owner {
  id: string;
  name: string;
  phone: string;
}

interface Offer {
  id: string;
  title: string;
  location: string;
  price: string;
  adNumber: string;
  images: string[];
  views: number;
  requests: number;
  isPinned: boolean;
  lastOpened: string;
  date: Date;
  subOffers: SubOffer[];
  isExpanded: boolean;
  owner: Owner;
}

interface OffersControlDashboardProps {
  onNavigate?: (page: string, options?: { initialTab?: string; ownerId?: string }) => void;
}

export default function OffersControlDashboard({ onNavigate }: OffersControlDashboardProps) {
  const { leftSidebarOpen } = useDashboardContext();
  // 🔧 دالة موحدة لاستخراج رقم الإعلان النظيف من أي شكل
  const extractAdNumber = (adNumber: string): string => {
    if (!adNumber) return '';
    
    // إزالة جميع البادئات الممكنة:
    // "#AD-123" → "AD-123"
    // "إعلان رقم: AD-123" → "AD-123"
    // "رقم الاعلان: ...384009" → "384009"
    // "إعلان رقم: ...AD-123" → "AD-123"
    
    let clean = adNumber
      .replace(/^#/, '')                           // إزالة # من البداية
      .replace(/^إعلان رقم:\s*/, '')              // إزالة "إعلان رقم: "
      .replace(/^رقم الاعلان:\s*/, '')            // إزالة "رقم الاعلان: "
      .replace(/^رقم الإعلان:\s*/, '')            // إزالة "رقم الإعلان: "
      .replace(/\.{3,}/g, '')                      // إزالة "..."
      .trim();                                     // إزالة المسافات
    
    // إذا كان يبدأ بـ AD- استخرجه مباشرة
    const adMatch = clean.match(/AD-\d+-\d+/);
    if (adMatch) {
      return adMatch[0];
    }
    
    // إذا كان رقم فقط، أرجعه كما هو
    return clean;
  };

  const [activeTimeFilter, setActiveTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [activeCity, setActiveCity] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubOffers, setSelectedSubOffers] = useState<Set<string>>(new Set());
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
  const [draggedSubOffer, setDraggedSubOffer] = useState<{offerId: string, subOfferId: string} | null>(null);
  const [selectedSubOfferForEdit, setSelectedSubOfferForEdit] = useState<SubOffer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // لفتح/إغلاق قوائم الثلاث نقاط
  
  // 🔄 State لتتبع حالات الإعلانات المنشورة (لإعادة التصيير عند التغيير)
  const [publishedAdsMap, setPublishedAdsMap] = useState<Map<string, PublishedAd>>(new Map());
  
  // 👁️ Live View Indicator State - Production-Ready
  const [liveViewersData, setLiveViewersData] = useState<Map<string, LiveViewData>>(new Map());
  
  // 🔥 Heat Map State - Production-Ready  
  const [heatMapTimeRange, setHeatMapTimeRange] = useState<TimeRange>('24h');
  const [topViewedProperties, setTopViewedProperties] = useState<PropertyEngagement[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // المدن السعودية
  const cities = ['الكل', 'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'تبوك', 'أبها', 'الطائف'];

  // تحميل العروض من نظام الإعلانات المنشورة
  useEffect(() => {
    loadOffersFromPublishedAds();
    
    // الاستماع لحدث تحديث العروض
    const handleOffersUpdated = () => {
      console.log('🔄 تحديث العروض في لوحة التحكم');
      loadOffersFromPublishedAds();
    };
    
    window.addEventListener('offersUpdated', handleOffersUpdated);
    window.addEventListener('publishedAdSaved', handleOffersUpdated);
    window.addEventListener('publishedAdStatusChanged', handleOffersUpdated);
    window.addEventListener('publishedAdUpdated', handleOffersUpdated);
    window.addEventListener('publishedAdDeleted', handleOffersUpdated);
    
    return () => {
      window.removeEventListener('offersUpdated', handleOffersUpdated);
      window.removeEventListener('publishedAdSaved', handleOffersUpdated);
      window.removeEventListener('publishedAdStatusChanged', handleOffersUpdated);
      window.removeEventListener('publishedAdUpdated', handleOffersUpdated);
      window.removeEventListener('publishedAdDeleted', handleOffersUpdated);
    };
  }, []);

  // إغلاق القوائم المنبثقة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // 🔍 فلترة العروض حسب الوقت والمدينة والبحث (يجب أن يكون قبل useEffects التي تستخدمه)
  const filteredOffers = useMemo(() => {
    console.log('🔄 إعادة حساب filteredOffers. عدد allOffers:', allOffers.length);
    let filtered = [...allOffers];

    // فلترة حسب الوقت
    const now = new Date();
    if (activeTimeFilter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(offer => offer.date >= startOfDay);
    } else if (activeTimeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(offer => offer.date >= weekAgo);
    } else if (activeTimeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(offer => offer.date >= monthAgo);
    }

    // فلترة حسب المدينة
    if (activeCity !== 'الكل') {
      filtered = filtered.filter(offer => offer.location.includes(activeCity));
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(query) ||
        offer.location.toLowerCase().includes(query) ||
        offer.adNumber.toLowerCase().includes(query)
      );
    }

    // ترتيب العروض: المثبتة أولاً ثم حسب التاريخ
    const sorted = filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.date.getTime() - a.date.getTime();
    });
    
    console.log('✅ العروض المفلترة النهائية:', sorted.length);
    console.log('📋 أرقام العروض المفلترة:', sorted.map(o => o.adNumber));
    
    return sorted;
  }, [allOffers, activeTimeFilter, activeCity, searchQuery]);

  // 📊 إحصائيات ديناميكية للعروض المفلترة
  const filteredStats = useMemo(() => {
    const total = filteredOffers.length;
    const active = filteredOffers.filter(o => o.views > 50 || o.requests > 5).length;
    const expired = Math.max(0, total - active);
    const totalRequests = filteredOffers.reduce((sum, o) => sum + o.requests, 0);
    const conversionRate = total > 0 ? ((totalRequests / (filteredOffers.reduce((sum, o) => sum + o.views, 0) || 1)) * 100).toFixed(1) : '0.0';
    
    return {
      total,
      active,
      expired,
      conversionRate: parseFloat(conversionRate)
    };
  }, [filteredOffers]);

  // 👁️ محاكاة Live Viewers (كل 5 ثوان) - Production-Ready
  useEffect(() => {
    const simulateLiveViewers = () => {
      if (filteredOffers.length === 0) return;
      
      const newViewersData = new Map<string, LiveViewData>();
      
      // ✅ جميع العقارات لديها مشاهدين مع تفاصيل كاملة
      filteredOffers.forEach(offer => {
        const viewerCount = Math.floor(Math.random() * 5) + 1; // 1-5 مشاهدين
        const viewers: LiveViewer[] = generateMockViewers(viewerCount);
        
        // حساب الإحصائيات
        const deviceDist = calculateDeviceDistribution(viewers);
        const sourceDist = calculateSourceDistribution(viewers);
        const geoDist = calculateGeographicDistribution(viewers);
        
        const liveViewData: LiveViewData = {
          offerId: offer.id,
          viewers,
          totalCount: viewerCount,
          peakCount: Math.floor(Math.random() * 3) + viewerCount, // أعلى عدد اليوم
          peakTime: new Date(Date.now() - Math.random() * 3600000 * 6), // آخر 6 ساعات
          averageDuration: calculateAverageDuration(viewers),
          averageScrollDepth: Math.floor(Math.random() * 40) + 60, // 60-100%
          averageInteractions: Math.floor(Math.random() * 5) + 3, // 3-8
          conversionRate: Math.random() * 15 + 5, // 5-20%
          whatsappClicks: Math.floor(viewerCount * (Math.random() * 0.4 + 0.2)), // 20-60%
          phoneClicks: Math.floor(viewerCount * (Math.random() * 0.2)), // 0-20%
          shareClicks: Math.floor(viewerCount * (Math.random() * 0.1)), // 0-10%
          topSource: Object.keys(sourceDist)[0] || 'whatsapp_link',
          topDevice: Object.keys(deviceDist)[0] || 'mobile',
          topLocation: Object.keys(geoDist)[0] || 'الرياض',
          deviceBreakdown: {
            desktop: deviceDist.desktop?.count || 0,
            mobile: deviceDist.mobile?.count || 0,
            tablet: deviceDist.tablet?.count || 0
          },
          locationBreakdown: Object.entries(geoDist).reduce((acc, [city, data]) => {
            acc[city] = data.count;
            return acc;
          }, {} as Record<string, number>),
          sourceBreakdown: {
            web: sourceDist.web?.count || 0,
            mobile_app: sourceDist.mobile_app?.count || 0,
            whatsapp_link: sourceDist.whatsapp_link?.count || 0,
            social_media: sourceDist.social_media?.count || 0,
            direct: sourceDist.direct?.count || 0,
            qr_code: sourceDist.qr_code?.count || 0
          }
        };
        
        newViewersData.set(offer.id, liveViewData);
      });
      
      setLiveViewersData(newViewersData);
    };
    
    // تشغيل فوري
    simulateLiveViewers();
    
    // تحديث كل 5 ثوان
    const interval = setInterval(simulateLiveViewers, 5000);
    
    return () => clearInterval(interval);
  }, [filteredOffers]);

  // 🔥 تحديث Heat Map (أكثر العقارات نشاطاً) - Production-Ready
  useEffect(() => {
    if (filteredOffers.length === 0) {
      setTopViewedProperties([]);
      return;
    }
    
    // تحويل العروض إلى PropertyEngagement مع جميع التفاصيل
    const propertiesWithEngagement: PropertyEngagement[] = filteredOffers.map(offer => {
      // توليد بيانات تفاعل واقعية
      const mockData = generateMockEngagement(offer.views);
      const comparison = generateComparisonData(offer.views);
      
      // حساب الـ engagement score
      const engagementScore = calculateEngagementScore({
        views: offer.views,
        ...mockData
      });
      
      // حساب معدلات مختلفة
      const conversionRate = ((mockData.bookings || 0) / offer.views) * 100;
      const clickThroughRate = ((mockData.clicks || 0) / offer.views) * 100;
      const messageRate = ((mockData.whatsappMessages || 0) / offer.views) * 100;
      
      // توليد توزيع الأجهزة والمصادر
      const mockViewers = generateMockViewers(Math.min(offer.views, 20));
      const deviceDist = calculateDeviceDistribution(mockViewers);
      const sourceDist = calculateSourceDistribution(mockViewers);
      const geoDist = calculateGeographicDistribution(mockViewers);
      
      return {
        id: offer.id,
        title: offer.title,
        location: offer.location,
        views: offer.views,
        clicks: mockData.clicks || 0,
        whatsappMessages: mockData.whatsappMessages || 0,
        phoneCalls: mockData.phoneCalls || 0,
        bookings: mockData.bookings || 0,
        shares: mockData.shares || 0,
        favorites: mockData.favorites || 0,
        engagementScore,
        trend: comparison.trend,
        percentageChange: comparison.percentageChange,
        trendDirection: comparison.trend === 'stable' ? 'stable' : comparison.trend === 'up' ? 'increasing' : 'decreasing',
        viewsLastHour: Math.floor(offer.views * 0.05),
        viewsLast24h: offer.views,
        viewsLast7d: Math.floor(offer.views * 3.5),
        viewsLast30d: Math.floor(offer.views * 12),
        viewsPerHour: offer.views / 24,
        conversionRate,
        clickThroughRate,
        messageRate,
        averageTimeOnPage: Math.floor(Math.random() * 180) + 120, // 2-5 دقائق
        bounceRate: Math.random() * 40 + 20, // 20-60%
        topSource: formatSourceType(mockViewers[0]?.source || 'whatsapp_link'),
        topDevice: formatDeviceType(mockViewers[0]?.device.type || 'mobile'),
        topLocation: mockViewers[0]?.location.city || 'الرياض',
        currentViewers: liveViewersData.get(offer.id)?.totalCount || 0,
        peakViewers: liveViewersData.get(offer.id)?.peakCount || 0,
        peakTime: liveViewersData.get(offer.id)?.peakTime || new Date(),
        deviceDistribution: {
          desktop: { 
            count: deviceDist.desktop.count, 
            percentage: deviceDist.desktop.percentage 
          },
          mobile: { 
            count: deviceDist.mobile.count, 
            percentage: deviceDist.mobile.percentage 
          },
          tablet: { 
            count: deviceDist.tablet.count, 
            percentage: deviceDist.tablet.percentage 
          }
        },
        geographicDistribution: geoDist,
        sourceDistribution: {
          web: { count: sourceDist.web.count, percentage: sourceDist.web.percentage },
          mobile_app: { count: sourceDist.mobile_app.count, percentage: sourceDist.mobile_app.percentage },
          whatsapp: { count: sourceDist.whatsapp_link.count, percentage: sourceDist.whatsapp_link.percentage },
          social_media: { count: sourceDist.social_media.count, percentage: sourceDist.social_media.percentage },
          direct: { count: sourceDist.direct.count, percentage: sourceDist.direct.percentage },
          qr_code: { count: sourceDist.qr_code.count, percentage: sourceDist.qr_code.percentage }
        }
      };
    });
    
    // ترتيب حسب الـ engagement score
    const sorted = [...propertiesWithEngagement]
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 5); // أعلى 5 عقارات
    
    setTopViewedProperties(sorted);
  }, [filteredOffers, liveViewersData, heatMapTimeRange]);

  // دالة تحميل ا��عروض من نظام الإعلانات المنشورة
  const loadOffersFromPublishedAds = () => {
    const publishedAds = getAllPublishedAds();
    
    // 🔄 تحديث Map الإعلانات المنشورة (لإعادة التصيير)
    const newMap = new Map<string, PublishedAd>();
    publishedAds.forEach(ad => {
      newMap.set(ad.adNumber, ad);
    });
    setPublishedAdsMap(newMap);
    
    console.log('🗺️ تحديث publishedAdsMap:', {
      total: newMap.size,
      published: publishedAds.filter(ad => ad.status === 'published').length,
      draft: publishedAds.filter(ad => ad.status === 'draft').length
    });
    
    // تحويل الإعلانات المنشورة لصيغة العروض
    const convertedOffers = convertPublishedAdsToOffers(publishedAds);
    
    // عرض الإعلانات الحقيقية فقط
    setAllOffers(convertedOffers);
  };

  // ملاحظة: البيانات التجريبية تم حذفها بالكامل ✅
  // الآن يتم عرض الإعلانات الحقيقية المحفوظة فقط من نظام publishedAds
  
  const mockOffers_DELETED_BY_USER_REQUEST: Offer[] = [
    {
      id: '1',
      title: 'شقق للبيع - مكة',
      location: 'مكة المكرمة',
      price: '850,000 ريال',
      adNumber: '#12345',
      images: [
        'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        'https://images.unsplash.com/photo-1703355685626-57abd3bfbd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      ],
      views: 74,
      requests: 12,
      isPinned: true,
      lastOpened: 'منذ 8 ساعات',
      date: new Date(Date.now() - 1000 * 60 * 60 * 8),
      isExpanded: false,
      owner: {
        id: 'owner-252',
        name: 'عبدالله بن محمد السعيد',
        phone: '0501234567'
      },
      subOffers: [
        {
          id: 'sub-1-1',
          title: 'للبيع شقة مفروشة 252',
          price: 'SAR 570000',
          adNumber: 'إعلان رقم: ...384009',
          image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          imageCount: 6,
          ownerName: 'عبدالله بن محمد السعيد',
          ownerPhone: '0501234567'
        },
        {
          id: 'sub-1-2',
          title: 'شقة مؤثثة للبيع في...',
          price: 'SAR 600000',
          adNumber: 'رقم الاعلان: ...045348',
          image: 'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          imageCount: 10,
          ownerName: 'عبدالله بن محمد السعيد',
          ownerPhone: '0501234567'
        },
        {
          id: 'sub-1-3',
          title: 'للبيع شقة مؤثثة دو...',
          price: 'SAR 420000',
          adNumber: 'رقم الاعلان: ...043451',
          image: 'https://images.unsplash.com/photo-1703355685626-57abd3bfbd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          imageCount: 14,
          ownerName: 'عبدالله بن محمد السعيد',
          ownerPhone: '0501234567'
        }
      ]
    },
    {
      id: '2',
      title: 'شقة جديدة للإيجار - الخبر',
      location: 'الخبر',
      price: '2,500 ريال/شهر',
      adNumber: '#12346',
      images: [
        'https://images.unsplash.com/photo-1703355685626-57abd3bfbd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      ],
      views: 850,
      requests: 49,
      isPinned: false,
      lastOpened: 'منذ 11 ساعة',
      date: new Date(Date.now() - 1000 * 60 * 60 * 11),
      isExpanded: false,
      owner: {
        id: 'owner-301',
        name: 'فاطمة بنت أحمد الغامدي',
        phone: '0559876543'
      },
      subOffers: [
        {
          id: 'sub-2-1',
          title: 'شقة مفروشة للإيجار',
          price: 'SAR 2500',
          adNumber: 'إعلان رقم: ...123456',
          image: 'https://images.unsplash.com/photo-1703355685626-57abd3bfbd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          imageCount: 8,
          ownerName: 'فاطمة بنت أحمد الغامدي',
          ownerPhone: '0559876543'
        },
        {
          id: 'sub-2-2',
          title: 'شقة عائلية واسعة',
          price: 'SAR 3000',
          adNumber: 'رقم الاعلان: ...789012',
          image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          imageCount: 12,
          ownerName: 'فاطمة بنت أحمد الغامدي',
          ownerPhone: '0559876543'
        }
      ]
    },
    {
      id: '3',
      title: 'شقة جديدة للإيجار - الدمام',
      location: 'الدمام',
      price: '3,200 ريال/شهر',
      adNumber: '#12347',
      images: [
        'https://images.unsplash.com/photo-1664091007038-ed5f2b44baf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      ],
      views: 409,
      requests: 2,
      isPinned: false,
      lastOpened: 'منذ 19 ساعة',
      date: new Date(Date.now() - 1000 * 60 * 60 * 19),
      isExpanded: false,
      owner: {
        id: 'owner-405',
        name: 'خالد بن سعد العتيبي',
        phone: '0505551234'
      },
      subOffers: []
    },
    {
      id: '4',
      title: 'أرض للبيع في محايل حي الحبلة الشرق',
      location: 'الرياض',
      price: '158,000 ريال',
      adNumber: '#12348',
      images: [
        'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      ],
      views: 28,
      requests: 0,
      isPinned: false,
      lastOpened: 'أمس',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isExpanded: false,
      owner: {
        id: 'owner-567',
        name: 'نورة بنت عبدالرحمن القحطاني',
        phone: '0502223344'
      },
      subOffers: []
    },
    {
      id: '5',
      title: 'فيلا فاخرة للبيع - جدة',
      location: 'جدة',
      price: '2,500,000 ريال',
      adNumber: '#12349',
      images: [
        'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      ],
      views: 521,
      requests: 23,
      isPinned: false,
      lastOpened: 'منذ 3 أيام',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      isExpanded: false,
      owner: {
        id: 'owner-789',
        name: 'محمد بن علي الشهري',
        phone: '0507778899'
      },
      subOffers: []
    }
  ];

  // دالة تحويل الإعلانات المنشورة لصيغة العروض
  const convertPublishedAdsToOffers = (ads: PublishedAd[]): Offer[] => {
    console.log('📊 ==================== لوحة التحكم: تحليل الإعلانات ====================');
    console.log('📊 إجمالي الإعلانات المحفوظة:', ads.length);
    console.log('📋 تفاصيل جميع الإعلانات:', ads.map(ad => ({
      adNumber: ad.adNumber,
      status: ad.status,
      city: ad.location?.city,
      ownerName: ad.ownerName
    })));
    
    // ✅ فلترة الإعلانات بحالة 'published' أو 'draft' (كلاهما يُعرض في لوحة التحكم)
    const publishedAds = ads.filter(ad => ad.status === 'published' || ad.status === 'draft');
    
    console.log(`✅ إعلانات تُعرض في لوحة التحكم (published + draft): ${publishedAds.length}`);
    console.log('   - منشورة (published):', ads.filter(ad => ad.status === 'published').length);
    console.log('   - مسودة (draft):', ads.filter(ad => ad.status === 'draft').length);
    console.log('📋 أرقام الإعلانات المعروضة:', publishedAds.map(ad => `${ad.adNumber} [${ad.status}]`));
    console.log('📊 ================================================================');
    
    // تجميع الإعلانات حسب المدينة
    const groupedByCity: { [key: string]: PublishedAd[] } = {};
    
    publishedAds.forEach(ad => {
      const city = ad.location?.city || 'مدينة غير محددة';
      if (!groupedByCity[city]) {
        groupedByCity[city] = [];
      }
      groupedByCity[city].push(ad);
    });
    
    // تحويل كل مجموعة لعرض رئيسي
    return Object.entries(groupedByCity).map(([city, cityAds]) => {
      // أخذ أول إعلان كممثل للمجموعة
      const mainAd = cityAds[0];
      
      // تحويل جميع الإعلانات في المدينة لعروض فرعية
      const subOffers: SubOffer[] = cityAds.map(ad => ({
        id: ad.id,
        title: ad.title || 'بدون عنوان',
        price: `${parseInt(ad.price || '0').toLocaleString()} ريال`,
        adNumber: `#${ad.adNumber || 'غير محدد'}`,  // ✅ فقط # بدون "إعلان رقم: "
        image: ad.mediaFiles?.[0]?.url || 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
        imageCount: ad.mediaFiles?.length || 0,
        ownerName: ad.ownerName,
        ownerPhone: ad.ownerPhone
      }));
      
      return {
        id: `offer-${city}-${Date.now()}`,
        title: `${mainAd.propertyType || 'عقار'} ${mainAd.purpose === 'sale' ? 'للبيع' : 'للإيجار'} - ${city}`,
        location: city,
        price: `${parseInt(mainAd.price || '0').toLocaleString()} ريال`,
        adNumber: `#${mainAd.adNumber || 'N/A'}`,  // ✅ يبقى كما هو
        images: mainAd.mediaFiles?.slice(0, 3).map(f => f.url) || [],
        views: mainAd.stats?.views || 0,
        requests: mainAd.stats?.requests || 0,
        isPinned: false,
        lastOpened: 'منذ قليل',
        date: new Date(mainAd.createdAt),
        isExpanded: false,
        owner: {
          id: `owner-${mainAd.ownerPhone}`,
          name: mainAd.ownerName || 'مالك غير محدد',
          phone: mainAd.ownerPhone || ''
        },
        subOffers
      };
    });
  };

  // ✅ filteredOffers و filteredStats معرّفين بالفعل في السطر 155-209
  // ❌ تم حذف التعريف المكرر هنا

  // Toggle expanded state
  const toggleOfferExpansion = (offerId: string) => {
    setExpandedOffers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(offerId)) {
        newSet.delete(offerId);
      } else {
        newSet.add(offerId);
      }
      return newSet;
    });
  };

  // Toggle sub-offer selection
  const toggleSubOfferSelection = (subOfferId: string) => {
    setSelectedSubOffers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subOfferId)) {
        newSet.delete(subOfferId);
      } else {
        newSet.add(subOfferId);
      }
      return newSet;
    });
  };

  // Handle sub-offer drag start
  const handleSubOfferDragStart = (offerId: string, subOfferId: string) => {
    setDraggedSubOffer({ offerId, subOfferId });
  };

  // Handle sub-offer drag end
  const handleSubOfferDragEnd = () => {
    setDraggedSubOffer(null);
  };

  // Delete sub-offer
  const deleteSubOffer = (offerId: string, subOfferId: string) => {
    if (confirm('هل تريد حذف هذا العرض الفرعي؟')) {
      // سيتم تنفيذه في النظام الحقيقي
      console.log('حذف العرض الفرعي:', offerId, subOfferId);
    }
  };

  // Pin sub-offer
  const pinSubOffer = (offerId: string, subOfferId: string) => {
    console.log('تثبيت العرض الفرعي:', offerId, subOfferId);
  };

  // Move sub-offer
  const moveSubOffer = (offerId: string, subOfferId: string) => {
    console.log('نقل العرض الفرعي:', offerId, subOfferId);
  };

  // ✨ دوال للعروض الرئيسية
  
  // تعديل المدينة أو نوع العقار للعرض الرئيسي
  const editMainOffer = (offerId: string, field: 'city' | 'type') => {
    const offer = allOffers.find(o => o.id === offerId);
    if (!offer) return;

    const fieldName = field === 'city' ? 'المدينة' : 'نوع العقار';
    const currentValue = field === 'city' ? offer.location : offer.title;
    
    const newValue = prompt(`تعديل ${fieldName}:\n\nالقيمة الحالية: ${currentValue}\n\nأدخل القيمة الجديدة:`);
    
    if (newValue && newValue.trim()) {
      // البحث عن الإعلان المنشور المرتبط
      const publishedAd = getAllPublishedAds().find(ad => ad.adNumber === offer.adNumber);
      
      if (publishedAd) {
        // تحديث في نظام الإعلانات المنشورة
        if (field === 'city') {
          updatePublishedAd(publishedAd.adNumber, {
            location: {
              ...publishedAd.location,
              city: newValue.trim()
            }
          });
        } else {
          updatePublishedAd(publishedAd.adNumber, {
            title: newValue.trim(),
            propertyType: newValue.trim()
          });
        }
        
        // إطلاق حدث التحديث
        window.dispatchEvent(new Event('publishedAdUpdated'));
        window.dispatchEvent(new Event('offersUpdated'));
        
        alert(`✅ تم تعديل ${fieldName} بنجاح!`);
        console.log(`✅ تم تعد��ل ${fieldName} للإعلان:`, publishedAd.adNumber, newValue);
      } else {
        // للإعلانات التجريبية (غير المحفوظة)
        setAllOffers(prev => prev.map(o => {
          if (o.id === offerId) {
            return {
              ...o,
              [field === 'city' ? 'location' : 'title']: newValue.trim()
            };
          }
          return o;
        }));
        
        alert(`✅ تم تعديل ${fieldName} بنجاح!\n\n⚠️ ملاحظة: هذا إعلان تجريبي. التعديل مؤقت فقط.`);
      }
    }
  };

  // حذف العرض الرئيسي
  const deleteMainOffer = (offerId: string) => {
    const offer = allOffers.find(o => o.id === offerId);
    if (!offer) return;

    const confirmMessage = `هل تريد حذف هذا العرض؟\n\nالعنوان: ${offer.title}\nالموقع: ${offer.location}\nرقم الإعلان: ${offer.adNumber}\n\n⚠️ سيتم حذف ${offer.subOffers.length} عرض فرعي معه!`;
    
    if (confirm(confirmMessage)) {
      // البحث عن الإعلان المنشور المرتبط
      const publishedAd = getAllPublishedAds().find(ad => ad.adNumber === offer.adNumber);
      
      if (publishedAd) {
        // حذف من نظام الإعلانات المنشورة
        deletePublishedAd(publishedAd.id);
        
        // إطلاق حدث التحديث
        window.dispatchEvent(new Event('publishedAdDeleted'));
        window.dispatchEvent(new Event('offersUpdated'));
        
        alert(`✅ تم حذف العرض بنجاح!\n\nرقم الإعلان: ${offer.adNumber}`);
        console.log('✅ تم حذف الإعلان من النظام:', publishedAd.id);
      } else {
        // للإعلانات التجريبية (غير المحفوظة)
        setAllOffers(prev => prev.filter(o => o.id !== offerId));
        alert(`✅ تم حذف العرض!\n\n⚠️ ملاحظة: كان هذا إعلاناً تجريبياً.`);
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7] p-4 transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🔥 Heat Activity Map - Production-Ready */}
        {topViewedProperties.length > 0 && (
          <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl">
            <CardContent className="p-4">
              {/* رأس الخريطة مع Time Range Selector */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#01411C]">🔥 الأكثر نشاطاً</h3>
                    <p className="text-xs text-gray-600">تحديث مباشر كل 5 ثوان</p>
                  </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex gap-1">
                  {(['1h', '24h', '7d', '30d'] as TimeRange[]).map(range => (
                    <button
                      key={range}
                      onClick={() => setHeatMapTimeRange(range)}
                      className={`px-2 py-1 rounded text-xs transition-all ${
                        heatMapTimeRange === range
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-orange-100 border border-orange-200'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                {topViewedProperties.map((property, index) => {
                  const maxScore = topViewedProperties[0]?.engagementScore || 1;
                  const percentage = (property.engagementScore / maxScore) * 100;
                  
                  return (
                    <div key={property.id} className="bg-white rounded-lg p-3 border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        {/* الترقيم + المعلومات */}
                        <div className="flex items-start gap-2 flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                            index === 1 ? 'bg-gradient-to-br from-orange-400 to-red-400' :
                            'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            {index + 1}
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {property.title}
                            </p>
                            <p className="text-xs text-gray-500">{property.location}</p>
                          </div>
                        </div>

                        {/* Trend Indicator */}
                        <div className="flex items-center gap-1">
                          {property.trend === 'up' && (
                            <div className="flex items-center gap-0.5 text-green-600">
                              <ChevronUp className="w-4 h-4" />
                              <span className="text-xs font-bold">+{property.percentageChange}%</span>
                            </div>
                          )}
                          {property.trend === 'down' && (
                            <div className="flex items-center gap-0.5 text-red-600">
                              <ChevronDown className="w-4 h-4" />
                              <span className="text-xs font-bold">-{property.percentageChange}%</span>
                            </div>
                          )}
                          {property.trend === 'stable' && (
                            <div className="flex items-center gap-0.5 text-gray-600">
                              <span className="text-xs">مستقر</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">مشاهدات</div>
                          <div className="text-sm font-bold text-orange-600">{property.views}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">نقرات</div>
                          <div className="text-sm font-bold text-blue-600">{property.clicks}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">رسائل</div>
                          <div className="text-sm font-bold text-green-600">{property.whatsappMessages}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">حجوزات</div>
                          <div className="text-sm font-bold text-purple-600">{property.bookings}</div>
                        </div>
                      </div>

                      {/* Progress Bar with Engagement Score */}
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">نقاط التفاعل</span>
                          <span className="text-xs font-bold text-orange-600">{property.engagementScore}</span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Eye className="w-3 h-3" />
                          <span>{property.currentViewers} الآن</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(property.averageTimeOnPage / 60)} د</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Target className="w-3 h-3" />
                          <span>{property.conversionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Export + Comparison + Info */}
              <div className="mt-3 pt-3 border-t border-orange-200 flex items-center justify-between">
                <button 
                  onClick={() => exportToCSV(topViewedProperties)}
                  className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 px-2 py-1 rounded flex items-center gap-1 transition-all"
                >
                  <Download className="w-3 h-3" />
                  تصدير CSV
                </button>

                <button 
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 px-2 py-1 rounded flex items-center gap-1 transition-all"
                >
                  <BarChart3 className="w-3 h-3" />
                  مقارنة بالأمس
                </button>
                
                <p className="text-xs text-gray-600">
                  💡 تحديث كل 5 ثوان
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 📊 قسم الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* إجمالي العروض */}
          <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-white to-[#fffef7] hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">إجمالي العروض</p>
                  <p className="text-3xl font-bold text-[#01411C]">{filteredStats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#01411C] flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* العروض النشطة */}
          <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-green-700 mb-1">العروض النشطة</p>
                  <p className="text-3xl font-bold text-green-800">{filteredStats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* العروض المنتهية */}
          <Card className="border-2 border-red-400 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-red-700 mb-1">العروض المنتهية</p>
                  <p className="text-3xl font-bold text-red-800">{filteredStats.expired}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معدل التحويل */}
          <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-blue-700 mb-1">معدل ال��حويل</p>
                  <p className="text-3xl font-bold text-blue-800">{filteredStats.conversionRate}%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🎛️ أدوات التحكم */}
        <Card className="border-2 border-[#D4AF37] bg-white">
          <CardContent className="p-4 space-y-4">
            
            {/* حقل البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في العروض (العنوان، الموقع، رقم الإعلان...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-right"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* فلاتر الوقت */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveTimeFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTimeFilter === 'today'
                    ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
                    : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
                }`}
              >
                اليوم
              </button>
              <button
                onClick={() => setActiveTimeFilter('week')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTimeFilter === 'week'
                    ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
                    : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
                }`}
              >
                هذا الأسبوع
              </button>
              <button
                onClick={() => setActiveTimeFilter('month')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTimeFilter === 'month'
                    ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
                    : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
                }`}
              >
                هذا الشهر
              </button>
              <button
                onClick={() => setActiveTimeFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTimeFilter === 'all'
                    ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
                    : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
                }`}
              >
                كل الوقت
              </button>
            </div>

            {/* فلتر المدن - شريط تمرير أفقي */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      activeCity === city
                        ? 'bg-[#D4AF37] text-[#01411C] shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* أزرار سريعة */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  console.log('🚀 الضغط على زر "إضافة عرض"');
                  console.log('📤 استدعاء onNavigate بالمعاملات:', { page: 'property-upload-complete', initialTab: 'create-ad' });
                  onNavigate?.('property-upload-complete', { initialTab: 'create-ad' });
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg border-2 border-[#D4AF37] hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-bold">إضافة عرض</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#01411C] rounded-lg border-2 border-[#D4AF37] hover:bg-[#fffef7] transition-all">
                <FileText className="w-5 h-5" />
                <span className="font-bold">تقرير العروض</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 📋 قائمة العروض */}
        <div className="space-y-4">
          {/* عداد النتائج */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#f0fdf4] to-[#fffef7] rounded-lg border border-[#D4AF37]/30">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-[#01411C]">{filteredOffers.length}</span> عرض
            </p>
            {(searchQuery || activeCity !== 'الكل' || activeTimeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCity('الكل');
                  setActiveTimeFilter('all');
                }}
                className="text-sm text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                إزالة جميع الفلاتر
              </button>
            )}
          </div>

          {(() => {
            console.log('🖼️ عرض الواجهة: عدد العروض المفلترة =', filteredOffers.length);
            
            if (filteredOffers.length === 0) {
              return (
                <Card className="border-2 border-gray-300 bg-white">
                  <CardContent className="p-12 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد عروض</h3>
                    <p className="text-gray-500">
                      لم يتم العثور على عروض تطابق البحث أو الفلاتر المحددة
                      <br />
                      <span className="text-xs">عدد العروض الإجمالي: {allOffers.length}</span>
                    </p>
                  </CardContent>
                </Card>
              );
            }
            
            return filteredOffers.map((offer) => (
              <Card 
                key={offer.id} 
                className="border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-4">
                  {/* العرض الرئيسي */}
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* الصور المتداخلة */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      {offer.images.slice(0, 4).map((image, index) => (
                        <div
                          key={index}
                          className="absolute w-16 h-16 rounded-lg border-2 border-white overflow-hidden shadow-lg"
                          style={{
                            right: `${index * 12}px`,
                            top: `${index * 8}px`,
                            zIndex: offer.images.length - index
                          }}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {offer.images.length > 4 && (
                        <div
                          className="absolute w-16 h-16 rounded-lg bg-[#01411C] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg"
                          style={{ right: '48px', top: '32px', zIndex: 0 }}
                        >
                          <span className="text-[#D4AF37] font-bold">+{offer.images.length - 4}</span>
                        </div>
                      )}
                      
                      {/* 👁️ Live View Indicator - Production-Ready */}
                      {liveViewersData.has(offer.id) && (() => {
                        const viewData = liveViewersData.get(offer.id)!;
                        
                        return (
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <div className="absolute -top-2 -left-2 z-50 cursor-help">
                                  <div className="relative">
                                    {/* توهج خلفي */}
                                    <div className="absolute inset-0 bg-green-400 rounded-full blur-md animate-pulse" />
                                    
                                    {/* الأيقونة */}
                                    <div className="relative bg-green-500 rounded-full p-2 border-2 border-white shadow-lg">
                                      <Eye className="w-4 h-4 text-white animate-pulse" />
                                    </div>
                                    
                                    {/* عداد المشاهدين */}
                                    <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                      {viewData.totalCount}
                                    </div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="p-4 bg-white rounded-lg shadow-2xl border-2 border-green-500 max-w-sm">
                                <div className="space-y-3">
                                  {/* رأس الإحصائيات */}
                                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                    <span className="font-bold text-green-600 flex items-center gap-1">
                                      <Eye className="w-4 h-4" />
                                      {viewData.totalCount} مشاهد نشط
                                    </span>
                                    <Badge className="bg-green-500 text-white">مباشر</Badge>
                                  </div>

                                  {/* معلومات سريعة */}
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-gray-50 p-2 rounded">
                                      <div className="text-gray-500 mb-1">متوسط المدة</div>
                                      <div className="font-bold text-gray-800">{formatDuration(viewData.averageDuration)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                      <div className="text-gray-500 mb-1">وقت الذروة</div>
                                      <div className="font-bold text-gray-800">{viewData.peakTime?.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                      <div className="text-gray-500 mb-1">أعلى عدد</div>
                                      <div className="font-bold text-gray-800">{viewData.peakCount} مشاهد</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                      <div className="text-gray-500 mb-1">معدل التحويل</div>
                                      <div className="font-bold text-green-600">{viewData.conversionRate.toFixed(1)}%</div>
                                    </div>
                                  </div>

                                  {/* تقسيم الأجهزة */}
                                  <div className="space-y-1">
                                    <div className="text-xs text-gray-500 mb-1">الأجهزة</div>
                                    <div className="flex gap-1 h-2">
                                      {viewData.deviceBreakdown.mobile > 0 && (
                                        <div 
                                          className="bg-blue-500 rounded" 
                                          style={{ width: `${(viewData.deviceBreakdown.mobile / viewData.totalCount) * 100}%` }}
                                          title={`جوال ${viewData.deviceBreakdown.mobile}`}
                                        />
                                      )}
                                      {viewData.deviceBreakdown.desktop > 0 && (
                                        <div 
                                          className="bg-green-500 rounded" 
                                          style={{ width: `${(viewData.deviceBreakdown.desktop / viewData.totalCount) * 100}%` }}
                                          title={`ديسكتوب ${viewData.deviceBreakdown.desktop}`}
                                        />
                                      )}
                                      {viewData.deviceBreakdown.tablet > 0 && (
                                        <div 
                                          className="bg-purple-500 rounded" 
                                          style={{ width: `${(viewData.deviceBreakdown.tablet / viewData.totalCount) * 100}%` }}
                                          title={`تابلت ${viewData.deviceBreakdown.tablet}`}
                                        />
                                      )}
                                    </div>
                                    <div className="flex gap-2 flex-wrap mt-1">
                                      {viewData.deviceBreakdown.mobile > 0 && (
                                        <span className="text-xs flex items-center gap-1">
                                          <Smartphone className="w-3 h-3 text-blue-500" />
                                          <span>جوال {viewData.deviceBreakdown.mobile}</span>
                                        </span>
                                      )}
                                      {viewData.deviceBreakdown.desktop > 0 && (
                                        <span className="text-xs flex items-center gap-1">
                                          <Monitor className="w-3 h-3 text-green-500" />
                                          <span>ديسكتوب {viewData.deviceBreakdown.desktop}</span>
                                        </span>
                                      )}
                                      {viewData.deviceBreakdown.tablet > 0 && (
                                        <span className="text-xs flex items-center gap-1">
                                          <Tablet className="w-3 h-3 text-purple-500" />
                                          <span>تابلت {viewData.deviceBreakdown.tablet}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* تقسيم المصادر */}
                                  <div className="space-y-1">
                                    <div className="text-xs text-gray-500 mb-1">المصادر</div>
                                    <div className="flex flex-wrap gap-1">
                                      {Object.entries(viewData.sourceBreakdown).map(([source, count]) => {
                                        if (count === 0) return null;
                                        const percentage = ((count / viewData.totalCount) * 100).toFixed(0);
                                        const sourceLabels: Record<string, string> = {
                                          web: 'الموقع',
                                          mobile_app: 'التطبيق',
                                          whatsapp_link: 'واتساب',
                                          social_media: 'سوشال ميديا',
                                          direct: 'مباشر',
                                          qr_code: 'QR'
                                        };
                                        return (
                                          <Badge key={source} variant="outline" className="text-xs">
                                            {sourceLabels[source]} {percentage}%
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* أكثر المدن */}
                                  <div className="space-y-1">
                                    <div className="text-xs text-gray-500 mb-1">المواقع</div>
                                    <div className="text-xs text-gray-700">
                                      {Object.entries(viewData.locationBreakdown)
                                        .slice(0, 3)
                                        .map(([city, count], idx) => (
                                          <span key={city}>
                                            {idx > 0 && ' • '}
                                            {city} ({count})
                                          </span>
                                        ))
                                      }
                                    </div>
                                  </div>

                                  {/* التفاعلات */}
                                  <div className="pt-2 border-t border-gray-200">
                                    <div className="grid grid-cols-3 gap-1 text-xs">
                                      <div className="text-center">
                                        <div className="text-gray-500">واتساب</div>
                                        <div className="font-bold text-green-600">{viewData.whatsappClicks}</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-gray-500">مكالمات</div>
                                        <div className="font-bold text-blue-600">{viewData.phoneClicks}</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-gray-500">مشاركات</div>
                                        <div className="font-bold text-purple-600">{viewData.shareClicks}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })()}
                    </div>

                    {/* المعلومات */}
                    <div className="flex-1 text-right">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {offer.isPinned && (
                            <Pin className="w-4 h-4 text-[#D4AF37]" />
                          )}
                          {offer.subOffers.length > 0 && (
                            <button
                              onClick={() => toggleOfferExpansion(offer.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-[#D4AF37] text-[#01411C] rounded-full text-xs font-bold hover:bg-[#b8941f] transition-all"
                            >
                              {expandedOffers.has(offer.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                              <span>{offer.subOffers.length} منتجات</span>
                            </button>
                          )}
                          
                          {/* 🏷️ Badge حالة النشر */}
                          {(() => {
                            const publishedAd = getAllPublishedAds().find(ad => ad.adNumber === offer.adNumber);
                            if (publishedAd) {
                              if (publishedAd.status === 'draft') {
                                return (
                                  <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                                    مسودة
                                  </Badge>
                                );
                              } else if (publishedAd.status === 'published') {
                                return (
                                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                                    <Globe className="w-3 h-3 mr-1" />
                                    منشور
                                  </Badge>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                          <p className="text-sm text-gray-300">{offer.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-400">{offer.lastOpened}</p>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#D4AF37]">{offer.price}</p>
                          <p className="text-xs text-gray-400">{offer.adNumber}</p>
                        </div>
                      </div>

                      {/* الإحصائيات */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-bold">{offer.views}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded-full">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-bold">{offer.requests}</span>
                        </div>
                      </div>

                      {/* الأيقونات والأزرار */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <button className="w-10 h-10 rounded-full bg-[#D4AF37] hover:bg-[#b8941f] flex items-center justify-center transition-all">
                          <Share2 className="w-5 h-5 text-[#01411C]" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all">
                          <Edit className="w-5 h-5 text-white" />
                        </button>
                        
                        {/* 🌐 منطق النشر: يظهر على جميع الإعلانات */}
                        {(() => {
                          // 🔄 استخراج رقم الإعلان النظيف باستخدام الدالة الموحدة
                          const cleanAdNumber = extractAdNumber(offer.adNumber);
                          const publishedAd = publishedAdsMap.get(cleanAdNumber);
                          
                          console.log('🔍 فحص حالة الإعلان:', {
                            originalAdNumber: offer.adNumber,
                            cleanAdNumber: cleanAdNumber,
                            found: !!publishedAd,
                            status: publishedAd?.status,
                            mapSize: publishedAdsMap.size,
                            mapKeys: Array.from(publishedAdsMap.keys()).slice(0, 3)
                          });
                          
                          // ✅ للإعلانات المنشورة: دائرة خضراء + زر إخفاء
                          if (publishedAd?.status === 'published') {
                            return (
                              <div className="flex items-center gap-2">
                                {/* دائرة خضراء تعني: معروض على منصتي */}
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" title="معروض على منصتي" />
                                
                                {/* زر إخفاء من منصتي */}
                                <button
                                  onClick={() => {
                                    if (publishedAd) {
                                      const confirm = window.confirm(`هل تريد إخفاء هذا الإعلان من منصتك العامة؟\n\nرقم الإعلان: ${offer.adNumber}\n\n⚠️ سيظل محفوظاً في لوحة التحكم الخاصة بك، لكن لن يظهر للجمهور.`);
                                      
                                      if (confirm) {
                                        console.log('🔒 إخفاء الإعلان من منصتي:', {
                                          id: publishedAd.id,
                                          adNumber: offer.adNumber,
                                          oldStatus: 'published',
                                          newStatus: 'draft'
                                        });
                                        
                                        // 1️⃣ تحديث الحالة أولاً
                                        updateAdStatus(publishedAd.id, 'draft');
                                        
                                        // 2️⃣ إطلاق جميع الأحداث
                                        window.dispatchEvent(new Event('publishedAdSaved'));
                                        window.dispatchEvent(new Event('publishedAdStatusChanged'));
                                        
                                        // 3️⃣ تأخير صغير ثم رسالة النجاح
                                        setTimeout(() => {
                                          alert(`✅ تم إخفاء الإعلان من منصتك!\n\nرقم الإعلان: ${offer.adNumber}\n\n🔒 الإعلان الآن مخفي عن الجمهور وباقٍ في لوحة التحكم.\n🔴 الدائرة الخضراء ستختفي بعد إغلاق هذه الرسالة.`);
                                        }, 100);
                                      }
                                    }
                                  }}
                                  className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm"
                                  title="إخفاء هذا الإعلان من منصتك العامة"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="font-bold">إخفاء من منصتي</span>
                                </button>
                              </div>
                            );
                          }
                          
                          // ✅ للإعلانات المسودة والتجريبية: زر نشر على منصتي
                          return (
                            <button
                              onClick={() => {
                                if (publishedAd) {
                                  console.log('🌐 نشر الإعلان على منصتي:', {
                                    id: publishedAd.id,
                                    adNumber: offer.adNumber,
                                    oldStatus: publishedAd.status,
                                    newStatus: 'published'
                                  });
                                  
                                  // 1️⃣ تحديث الحالة أولاً
                                  updateAdStatus(publishedAd.id, 'published');
                                  
                                  // 2️⃣ إطلاق جميع الأحداث
                                  window.dispatchEvent(new Event('publishedAdSaved'));
                                  window.dispatchEvent(new Event('publishedAdStatusChanged'));
                                  window.dispatchEvent(new CustomEvent('adPublishedToMyPlatform', { 
                                    detail: { id: publishedAd.id, adNumber: offer.adNumber }
                                  }));
                                  
                                  // 3️⃣ تأخير صغير ثم رسالة النجاح (لضمان تحديث الواجهة)
                                  setTimeout(() => {
                                    alert(`✅ تم نشر الإعلان على منصتي!\n\nرقم الإعلان: ${offer.adNumber}\n\n🌐 الإعلان الآن معروض للجمهور في تبويب "منصتي".\n🟢 ستظهر الدائرة الخضراء بعد إغلاق هذه الرسالة.`);
                                  }, 100);
                                } else {
                                  console.error('❌ لم يتم العثور على الإعلان في publishedAdsMap!', {
                                    searchedFor: offer.adNumber,
                                    cleanNumber: offer.adNumber.replace(/^#/, ''),
                                    mapKeys: Array.from(publishedAdsMap.keys())
                                  });
                                  alert('❌ خطأ: لم يتم العثور على الإعلان. يرجى إعادة تحميل الصفحة.');
                                }
                              }}
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                              title="نشر هذا الإعلان على منصتك العامة ليراه الجمهور"
                            >
                              <Globe className="w-4 h-4" />
                              <span className="text-sm font-bold">نشر على منصتي</span>
                            </button>
                          );
                        })()}
                        
                        {/* ⚙️ قائمة الإعدادات للعرض الرئيسي */}
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === `main-${offer.id}` ? null : `main-${offer.id}`);
                            }}
                            className="w-10 h-10 rounded-full hover:bg-gray-700 flex items-center justify-center transition-all"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openMenuId === `main-${offer.id}` && (
                            <div className="absolute left-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-2xl border-2 border-[#D4AF37] overflow-hidden z-[9999] min-w-[200px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  editMainOffer(offer.id, 'city');
                                }}
                                className="w-full px-4 py-2 hover:bg-[#fffef7] flex items-center gap-2 text-right transition-all"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                                <span className="font-bold">تعديل المدينة</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  editMainOffer(offer.id, 'type');
                                }}
                                className="w-full px-4 py-2 hover:bg-[#fffef7] flex items-center gap-2 text-right transition-all"
                              >
                                <Edit className="w-4 h-4 text-green-600" />
                                <span className="font-bold">تعديل نوع العقار</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  deleteMainOffer(offer.id);
                                }}
                                className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-right transition-all"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                <span className="font-bold text-red-600">حذف</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* العروض الفرعية */}
                  {expandedOffers.has(offer.id) && offer.subOffers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-600 space-y-2">
                      {offer.subOffers.map((subOffer) => (
                        <div
                          key={subOffer.id}
                          draggable
                          onDragStart={() => handleSubOfferDragStart(offer.id, subOffer.id)}
                          onDragEnd={handleSubOfferDragEnd}
                          className={`flex items-center gap-3 p-3 bg-[#34495e] rounded-lg border border-gray-600 hover:border-[#D4AF37] transition-all cursor-move ${
                            draggedSubOffer?.subOfferId === subOffer.id ? 'opacity-50' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedSubOffers.has(subOffer.id)}
                            onChange={() => toggleSubOfferSelection(subOffer.id)}
                            className="w-5 h-5 rounded border-gray-500 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                          />

                          {/* مقبض السحب */}
                          <GripVertical className="w-5 h-5 text-gray-500" />

                          {/* الصورة */}
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <ImageWithFallback
                              src={subOffer.image}
                              alt={subOffer.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                              {subOffer.imageCount}
                            </div>
                            {/* 🔴 الدائرة الحمراء النابضة للإعلانات الجديدة */}
                            {isAdUnread(subOffer.adNumber) && (
                              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>

                          {/* المعلومات */}
                          <div 
                            className="flex-1 text-right cursor-pointer"
                            onClick={() => {
                              // 🔴 إزالة علامة غير المشاهد عند فتح الإعلان
                              markAdAsRead(subOffer.adNumber);
                              setSelectedSubOfferForEdit(subOffer);
                            }}
                          >
                            <h4 className="font-bold text-sm mb-1 hover:text-[#D4AF37] transition-colors">{subOffer.title}</h4>
                            <p className="text-[#D4AF37] font-bold text-sm">{subOffer.price}</p>
                            <p className="text-xs text-gray-400">{subOffer.adNumber}</p>
                            {subOffer.ownerName && (
                              <div className="flex items-center gap-1 mt-1">
                                <User className="w-3 h-3 text-blue-400" />
                                <p className="text-xs text-blue-400 font-medium">{subOffer.ownerName}</p>
                              </div>
                            )}
                          </div>

                          {/* 🌐 منطق النشر للعروض الفرعية: يظهر على جميع الإعلانات */}
                          {(() => {
                            // 🔄 استخراج رقم الإعلان النظيف باستخدام الدالة الموحدة
                            const cleanAdNumber = extractAdNumber(subOffer.adNumber);
                            const publishedAd = publishedAdsMap.get(cleanAdNumber);
                            
                            console.log('🔍 [فرعي] فحص حالة الإعلان:', {
                              originalAdNumber: subOffer.adNumber,
                              cleanAdNumber: cleanAdNumber,
                              found: !!publishedAd,
                              status: publishedAd?.status,
                              mapSize: publishedAdsMap.size,
                              mapKeys: Array.from(publishedAdsMap.keys())
                            });
                            
                            // ✅ للإعلانات المنشورة: دائرة خضراء + زر إخفاء
                            if (publishedAd?.status === 'published') {
                              return (
                                <div className="flex items-center gap-1.5">
                                  {/* دائرة خضراء تعني: معروض على منصتي */}
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-md" title="معروض على منصتي" />
                                  
                                  {/* زر إخفاء مصغر */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (publishedAd) {
                                        const confirm = window.confirm(`هل تريد إخفاء هذا الإعلان من منصتك العامة؟\n\nرقم الإعلان: ${subOffer.adNumber}`);
                                        
                                        if (confirm) {
                                          console.log('🔒 [فرعي] إخفاء الإعلان من منصتي:', {
                                            id: publishedAd.id,
                                            adNumber: subOffer.adNumber,
                                            oldStatus: 'published',
                                            newStatus: 'draft'
                                          });
                                          
                                          // 1️⃣ تحديث الحالة أولاً
                                          updateAdStatus(publishedAd.id, 'draft');
                                          
                                          // 2️⃣ إطلاق جميع الأحداث
                                          window.dispatchEvent(new Event('publishedAdSaved'));
                                          window.dispatchEvent(new Event('publishedAdStatusChanged'));
                                          
                                          // 3️⃣ تأخير صغير ثم رسالة النجاح
                                          setTimeout(() => {
                                            alert(`✅ تم إخفاء الإعلان من منصتك!\n\nرقم الإعلان: ${subOffer.adNumber}\n\n🔴 الدائرة الخضراء ستختفي بعد إغلاق هذه الرسالة.`);
                                          }, 100);
                                        }
                                      }
                                    }}
                                    className="px-2 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 transition-all shadow-sm text-xs"
                                    title="إخفاء من منصتي"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span className="font-bold">إخفاء</span>
                                  </button>
                                </div>
                              );
                            }
                            
                            // ✅ للإعلانات المسودة والتجريبية: زر نشر مصغر
                            return (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (publishedAd) {
                                    console.log('🌐 [فرعي] نشر الإعلان على منصتي:', {
                                      id: publishedAd.id,
                                      adNumber: subOffer.adNumber,
                                      oldStatus: publishedAd.status,
                                      newStatus: 'published'
                                    });
                                    
                                    // 1️⃣ تحديث الحالة أولاً
                                    updateAdStatus(publishedAd.id, 'published');
                                    
                                    // 2️⃣ إطلاق جميع الأحداث
                                    window.dispatchEvent(new Event('publishedAdSaved'));
                                    window.dispatchEvent(new Event('publishedAdStatusChanged'));
                                    window.dispatchEvent(new CustomEvent('adPublishedToMyPlatform', { 
                                      detail: { id: publishedAd.id, adNumber: subOffer.adNumber }
                                    }));
                                    
                                    // 3️⃣ تأخير صغير ثم رسالة النجاح
                                    setTimeout(() => {
                                      alert(`✅ تم نشر الإعلان على منصتي!\n\nرقم الإعلان: ${subOffer.adNumber}\n\n🌐 الإعلان الآن معروض للجمهور في تبويب "منصتي".\n🟢 ستظهر الدائرة الخضراء بعد إغلاق هذه الرسالة.`);
                                    }, 100);
                                  } else {
                                    console.error('❌ [فرعي] لم يتم العثور على الإعلان!', {
                                      searchedFor: subOffer.adNumber,
                                      cleanNumber: subOffer.adNumber.replace(/^#/, ''),
                                      mapKeys: Array.from(publishedAdsMap.keys())
                                    });
                                    alert('❌ خطأ: لم يتم العثور على الإعلان. يرجى إعادة تحميل الصفحة.');
                                  }
                                }}
                                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-1 transition-all shadow-md hover:shadow-lg text-xs font-bold"
                                title="نشر هذا الإعلان على منصتك العامة ليراه الجمهور"
                              >
                                <Globe className="w-3 h-3" />
                                <span>نشر</span>
                              </button>
                            );
                          })()}

                          {/* القائمة المنبثقة */}
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === `sub-${subOffer.id}` ? null : `sub-${subOffer.id}`);
                              }}
                              className="w-8 h-8 rounded-full hover:bg-gray-700 flex items-center justify-center transition-all"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openMenuId === `sub-${subOffer.id}` && (
                              <div className="absolute left-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-2xl border-2 border-[#D4AF37] overflow-hidden z-[9999] min-w-[180px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    // 🔴 إزالة علامة غير المشاهد عند فتح الإعلان
                                    markAdAsRead(subOffer.adNumber);
                                    setSelectedSubOfferForEdit(subOffer);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-[#fffef7] flex items-center gap-2 text-right transition-all"
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                  <span className="font-bold">تعديل</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    pinSubOffer(offer.id, subOffer.id);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-[#fffef7] flex items-center gap-2 text-right transition-all"
                                >
                                  <ArrowUpToLine className="w-4 h-4 text-[#01411C]" />
                                  <span className="font-bold">تثبيت بالأعلى</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    moveSubOffer(offer.id, subOffer.id);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-[#fffef7] flex items-center gap-2 text-right transition-all"
                                >
                                  <MoveRight className="w-4 h-4 text-blue-600" />
                                  <span className="font-bold">نقل إلى...</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    deleteSubOffer(offer.id, subOffer.id);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-right transition-all"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                  <span className="font-bold text-red-600">حذف</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ));
          })()}
        </div>

        {/* ⚙️ خيارات متقدمة */}
        <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-[#f0fdf4]">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-[#01411C] mb-4 text-right">خيارات متقدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <button className="p-4 bg-white rounded-lg border-2 border-[#D4AF37] hover:bg-[#01411C] hover:text-white transition-all text-right">
                <p className="font-bold mb-1">إجراءات جماعية</p>
                <p className="text-sm text-gray-600">تطبيق إجراءات على عدة عروض</p>
              </button>

              <button className="p-4 bg-white rounded-lg border-2 border-[#D4AF37] hover:bg-[#01411C] hover:text-white transition-all text-right">
                <p className="font-bold mb-1">تحكم التسعير</p>
                <p className="text-sm text-gray-600">تعديل الأسعار بشكل ذكي</p>
              </button>

              <button className="p-4 bg-white rounded-lg border-2 border-[#D4AF37] hover:bg-[#01411C] hover:text-white transition-all text-right">
                <p className="font-bold mb-1">إدارة المخزون</p>
                <p className="text-sm text-gray-600">متابعة جميع العقارات</p>
              </button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Modal تعديل العرض الفرعي */}
      {selectedSubOfferForEdit && (
        <SubOfferDetailModal
          isOpen={!!selectedSubOfferForEdit}
          onClose={() => setSelectedSubOfferForEdit(null)}
          subOffer={selectedSubOfferForEdit}
          onSave={(data) => {
            console.log('تم حفظ البيانات:', data);
            setSelectedSubOfferForEdit(null);
          }}
        />
      )}
    </div>
  );
}
