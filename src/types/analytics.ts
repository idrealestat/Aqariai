// 📊 **Analytics Types - Production-Ready**
// تم إنشاؤه: 2025-01-01
// الهدف: دعم Live View + Heat Map بشكل احترافي

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1️⃣ Live View Indicator Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface LiveViewer {
  id: string;
  userId?: string; // معرف المستخدم (إن كان مسجلاً)
  timestamp: Date; // وقت بدء المشاهدة
  
  // 📍 Location Data
  location: {
    city: string;
    country: string;
    region?: string;
    ip?: string; // آخر 3 أرقام فقط لأسباب الخصوصية
  };
  
  // 📱 Device Information
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string; // iOS, Android, Windows, MacOS
    browser: string; // Safari, Chrome, Firefox
    screenSize?: string; // للتحليل
  };
  
  // 🔗 Source Tracking
  source: 'web' | 'mobile_app' | 'whatsapp_link' | 'social_media' | 'direct' | 'qr_code';
  referrer?: string; // من أين جاء؟
  
  // ⏱️ Engagement Metrics
  duration: number; // المدة بالثوان
  pageViews: number; // عدد مرات تصفح الصفحة
  scrollDepth: number; // نسبة التمرير (0-100%)
  interactions: number; // عدد التفاعلات (نقرات، تكبير صور، إلخ)
  
  // 🔴 Real-time Status
  isActive: boolean; // مازال نشط؟
  lastActivity: Date; // آخر نشاط
}

export interface LiveViewData {
  offerId: string;
  viewers: LiveViewer[];
  
  // 📊 Statistics
  totalCount: number; // إجمالي المشاهدين الحاليين
  peakCount: number; // أعلى عدد اليوم
  peakTime?: Date; // وقت الذروة
  
  // ⏱️ Time-based Metrics
  averageDuration: number; // متوسط المدة (ثوان)
  averageScrollDepth: number; // متوسط التمرير (%)
  averageInteractions: number; // متوسط التفاعلات
  
  // 📈 Conversion Metrics
  conversionRate: number; // نسبة التحويل (رسائل/مشاهدات)
  whatsappClicks: number; // نقرات واتساب
  phoneClicks: number; // نقرات الهاتف
  shareClicks: number; // مشاركات
  
  // 🎯 Top Sources
  topSource: string; // أكثر مصدر
  topDevice: string; // أكثر جهاز
  topLocation: string; // أكثر موقع
  
  // 📱 Device Breakdown
  deviceBreakdown: {
    desktop: number; // عدد المشاهدين من ديسكتوب
    mobile: number; // عدد المشاهدين من جوال
    tablet: number; // عدد المشاهدين من تابلت
  };
  
  // 🌍 Geographic Breakdown
  locationBreakdown: {
    [city: string]: number; // عدد المشاهدين لكل مدينة
  };
  
  // 🔗 Source Breakdown
  sourceBreakdown: {
    web: number;
    mobile_app: number;
    whatsapp_link: number;
    social_media: number;
    direct: number;
    qr_code: number;
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2️⃣ Heat Activity Map Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface PropertyEngagement {
  id: string;
  title: string;
  location: string;
  
  // 📊 Core Metrics
  views: number;
  clicks: number; // نقرات على "عرض التفاصيل"
  whatsappMessages: number; // رسائل واتساب
  phoneCalls: number; // مكالمات هاتفية
  bookings: number; // حجوزات زيارة
  shares: number; // مشاركات
  favorites: number; // إضافة للمفضلة
  
  // 🎯 Engagement Score (weighted calculation)
  engagementScore: number;
  // Formula: views*1 + clicks*2 + whatsappMessages*3 + phoneCalls*4 + bookings*5 + shares*2 + favorites*1
  
  // 📈 Trend Analysis
  trend: 'up' | 'down' | 'stable';
  percentageChange: number; // نسبة التغيير مقارنة بالفترة السابقة
  trendDirection: 'increasing' | 'decreasing' | 'stable'; // اتجاه الترند
  
  // ⏰ Time-based Metrics
  viewsLastHour: number;
  viewsLast24h: number;
  viewsLast7d: number;
  viewsLast30d: number;
  
  // 📊 Analytics
  viewsPerHour: number; // متوسط المشاهدات بالساعة
  conversionRate: number; // معدل التحويل (bookings/views * 100)
  clickThroughRate: number; // معدل النقر (clicks/views * 100)
  messageRate: number; // معدل الرسائل (messages/views * 100)
  averageTimeOnPage: number; // متوسط الوقت على الصفحة (ثوان)
  bounceRate: number; // معدل الارتداد (%)
  
  // 🎯 Demographics
  topSource: string; // أكثر مصدر زيارات
  topDevice: string; // أكثر جهاز
  topLocation: string; // أكثر مدينة
  topAgeGroup?: string; // أكثر فئة عمرية (إن توفر)
  topTimeSlot?: string; // أكثر وقت نشاط
  
  // 🔴 Real-time
  currentViewers: number; // المشاهدين الحاليين الآن
  peakViewers: number; // أعلى عدد مشاهدين
  peakTime: Date; // وقت الذروة
  
  // 📊 Historical Comparison
  comparisonPeriod?: {
    period: '1h' | '24h' | '7d' | '30d';
    previousViews: number;
    previousEngagement: number;
    growthRate: number; // نسبة النمو
  };
  
  // 📱 Device Distribution
  deviceDistribution: {
    desktop: { count: number; percentage: number };
    mobile: { count: number; percentage: number };
    tablet: { count: number; percentage: number };
  };
  
  // 🌍 Geographic Distribution
  geographicDistribution: {
    [city: string]: {
      count: number;
      percentage: number;
      conversionRate: number;
    };
  };
  
  // 🔗 Source Distribution
  sourceDistribution: {
    web: { count: number; percentage: number };
    mobile_app: { count: number; percentage: number };
    whatsapp: { count: number; percentage: number };
    social_media: { count: number; percentage: number };
    direct: { count: number; percentage: number };
    qr_code: { count: number; percentage: number };
  };
  
  // 💰 Revenue Potential (optional)
  estimatedRevenue?: number; // الإيرادات المتوقعة
  leadQualityScore?: number; // تقييم جودة العميل (1-10)
}

export interface HeatMapData {
  timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
  properties: PropertyEngagement[];
  
  // 📊 Overall Statistics
  totalViews: number;
  totalClicks: number;
  totalMessages: number;
  totalBookings: number;
  averageEngagementScore: number;
  
  // 📈 Trends
  overallTrend: 'up' | 'down' | 'stable';
  overallPercentageChange: number;
  
  // 🏆 Top Performers
  topProperty: PropertyEngagement | null;
  mostImproved: PropertyEngagement | null; // أكثر تحسن
  fastestGrowing: PropertyEngagement | null; // أسرع نمو
  
  // ⏰ Time Analysis
  peakHour: number; // ساعة الذروة (0-23)
  peakDay: string; // يوم الذروة
  
  // 📊 Distribution
  totalDeviceDistribution: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  
  totalSourceDistribution: {
    web: number;
    mobile_app: number;
    whatsapp: number;
    social_media: number;
    direct: number;
    qr_code: number;
  };
  
  totalGeographicDistribution: {
    [city: string]: number;
  };
  
  // 🔄 Update Info
  lastUpdated: Date;
  nextUpdate: Date;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3️⃣ WebSocket Mock Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface WebSocketMessage {
  type: 'liveViewers:update' | 'heatMap:update' | 'viewer:join' | 'viewer:leave' | 'engagement:update';
  data: any;
  timestamp: Date;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number; // ميلي ثانية
  maxReconnectAttempts: number;
  pingInterval: number; // للتحقق من الاتصال
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4️⃣ Export Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ExportData {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
  properties: PropertyEngagement[];
  exportedAt: Date;
  exportedBy?: string; // معرف المستخدم
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  includeCharts?: boolean; // للـ PDF
  includeComparison?: boolean;
  customFields?: string[]; // حقول مخصصة
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5️⃣ Filter Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AnalyticsFilters {
  timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
  cities?: string[];
  propertyTypes?: string[];
  minEngagementScore?: number;
  sortBy: 'views' | 'engagement' | 'conversionRate' | 'trend';
  sortOrder: 'asc' | 'desc';
  showOnlyActive?: boolean; // فقط العقارات النشطة
  minViews?: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6️⃣ Helper Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type TrendType = 'up' | 'down' | 'stable';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';
export type SourceType = 'web' | 'mobile_app' | 'whatsapp_link' | 'social_media' | 'direct' | 'qr_code';
export type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7️⃣ API Response Types (للمستقبل)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: Date;
}

export interface LiveViewApiResponse extends ApiResponse<LiveViewData> {}
export interface HeatMapApiResponse extends ApiResponse<HeatMapData> {}
export interface ExportApiResponse extends ApiResponse<ExportData> {}
