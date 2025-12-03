// 🔧 **Analytics Utilities - Production-Ready**
// تم إنشاؤه: 2025-01-01
// الهدف: وظائف مساعدة للـ Live View + Heat Map

import type { 
  PropertyEngagement, 
  LiveViewData, 
  LiveViewer,
  TrendType,
  DeviceType,
  SourceType,
  ExportOptions 
} from '../types/analytics';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1️⃣ Engagement Score Calculation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب نقاط التفاعل (Engagement Score) بناءً على الأوزان
 * 
 * الأوزان:
 * - مشاهدة: 1 نقطة
 * - نقرة: 2 نقطة
 * - رسالة واتساب: 3 نقاط
 * - مكالمة هاتفية: 4 نقاط
 * - حجز زيارة: 5 نقاط
 * - مشاركة: 2 نقطة
 * - إضافة للمفضلة: 1 نقطة
 */
export function calculateEngagementScore(property: Partial<PropertyEngagement>): number {
  const weights = {
    views: 1,
    clicks: 2,
    whatsappMessages: 3,
    phoneCalls: 4,
    bookings: 5,
    shares: 2,
    favorites: 1
  };

  return (
    (property.views || 0) * weights.views +
    (property.clicks || 0) * weights.clicks +
    (property.whatsappMessages || 0) * weights.whatsappMessages +
    (property.phoneCalls || 0) * weights.phoneCalls +
    (property.bookings || 0) * weights.bookings +
    (property.shares || 0) * weights.shares +
    (property.favorites || 0) * weights.favorites
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2️⃣ Trend Calculation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب الترند والنسبة المئوية للتغيير
 * 
 * @param current القيمة الحالية
 * @param previous القيمة السابقة
 * @param threshold عتبة التغيير (افتراضياً 5%)
 * @returns الترند والنسبة المئوية
 */
export function calculateTrend(
  current: number,
  previous: number,
  threshold: number = 5
): { trend: TrendType; percentageChange: number } {
  if (previous === 0) {
    return { 
      trend: 'stable', 
      percentageChange: 0 
    };
  }

  const change = ((current - previous) / previous) * 100;
  
  if (Math.abs(change) < threshold) {
    return { 
      trend: 'stable', 
      percentageChange: Math.round(change * 10) / 10 
    };
  }

  return {
    trend: change > 0 ? 'up' : 'down',
    percentageChange: Math.round(Math.abs(change) * 10) / 10
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3️⃣ Conversion Rate Calculation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب معدل التحويل (Conversion Rate)
 * 
 * @param conversions عدد التحويلات (حجوزات، رسائل، إلخ)
 * @param totalViews إجمالي المشاهدات
 * @returns النسبة المئوية (0-100)
 */
export function calculateConversionRate(conversions: number, totalViews: number): number {
  if (totalViews === 0) return 0;
  
  const rate = (conversions / totalViews) * 100;
  return Math.round(rate * 100) / 100; // رقمين عشريين
}

/**
 * حساب معدل النقر (Click-Through Rate)
 */
export function calculateClickThroughRate(clicks: number, views: number): number {
  return calculateConversionRate(clicks, views);
}

/**
 * حساب معدل الرسائل (Message Rate)
 */
export function calculateMessageRate(messages: number, views: number): number {
  return calculateConversionRate(messages, views);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4️⃣ Device/Source Analysis
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب توزيع الأجهزة
 */
export function calculateDeviceDistribution(viewers: LiveViewer[]) {
  const distribution = {
    desktop: 0,
    mobile: 0,
    tablet: 0
  };

  viewers.forEach(viewer => {
    distribution[viewer.device.type]++;
  });

  const total = viewers.length || 1;

  return {
    desktop: {
      count: distribution.desktop,
      percentage: Math.round((distribution.desktop / total) * 100)
    },
    mobile: {
      count: distribution.mobile,
      percentage: Math.round((distribution.mobile / total) * 100)
    },
    tablet: {
      count: distribution.tablet,
      percentage: Math.round((distribution.tablet / total) * 100)
    }
  };
}

/**
 * حساب توزيع المصادر
 */
export function calculateSourceDistribution(viewers: LiveViewer[]) {
  const distribution: Record<SourceType, number> = {
    web: 0,
    mobile_app: 0,
    whatsapp_link: 0,
    social_media: 0,
    direct: 0,
    qr_code: 0
  };

  viewers.forEach(viewer => {
    distribution[viewer.source]++;
  });

  const total = viewers.length || 1;

  return Object.entries(distribution).reduce((acc, [key, count]) => {
    acc[key as SourceType] = {
      count,
      percentage: Math.round((count / total) * 100)
    };
    return acc;
  }, {} as Record<SourceType, { count: number; percentage: number }>);
}

/**
 * حساب التوزيع الجغرافي
 */
export function calculateGeographicDistribution(viewers: LiveViewer[]) {
  const distribution: Record<string, number> = {};

  viewers.forEach(viewer => {
    const city = viewer.location.city;
    distribution[city] = (distribution[city] || 0) + 1;
  });

  const total = viewers.length || 1;

  return Object.entries(distribution).reduce((acc, [city, count]) => {
    acc[city] = {
      count,
      percentage: Math.round((count / total) * 100),
      conversionRate: 0 // يتم حسابه من البيانات الفعلية
    };
    return acc;
  }, {} as Record<string, { count: number; percentage: number; conversionRate: number }>);
}

/**
 * الحصول على أكثر جهاز/مصدر/موقع
 */
export function getTopItem<T>(items: Record<string, T>, getValue: (item: T) => number): string {
  const entries = Object.entries(items);
  if (entries.length === 0) return 'غير محدد';

  const sorted = entries.sort((a, b) => getValue(b[1]) - getValue(a[1]));
  return sorted[0][0];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5️⃣ Time Analysis
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * حساب متوسط المدة
 */
export function calculateAverageDuration(viewers: LiveViewer[]): number {
  if (viewers.length === 0) return 0;

  const totalDuration = viewers.reduce((sum, viewer) => sum + viewer.duration, 0);
  return Math.round(totalDuration / viewers.length);
}

/**
 * تنسيق المدة (ثوان → نص)
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} ث`;
  }

  return `${minutes} د ${remainingSeconds} ث`;
}

/**
 * تنسيق الوقت النسبي (منذ...)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'الآن';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `منذ ${diffInDays} يوم`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6️⃣ Export to CSV
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تصدير البيانات إلى CSV
 */
export function exportToCSV(
  properties: PropertyEngagement[],
  options: ExportOptions = { format: 'csv' }
): void {
  // Headers
  const headers = [
    'العنوان',
    'الموقع',
    'المشاهدات',
    'النقرات',
    'رسائل واتساب',
    'المكالمات',
    'الحجوزات',
    'المشاركات',
    'نقاط التفاعل',
    'الترند',
    'نسبة التغيير',
    'معدل التحويل',
    'المشاهدين الحاليين',
    'أعلى مصدر',
    'أعلى جهاز',
    'أعلى موقع'
  ];

  // Rows
  const rows = properties.map(prop => [
    prop.title,
    prop.location,
    prop.views,
    prop.clicks,
    prop.whatsappMessages,
    prop.phoneCalls,
    prop.bookings,
    prop.shares,
    prop.engagementScore,
    prop.trend === 'up' ? 'صاعد' : prop.trend === 'down' ? 'هابط' : 'مستقر',
    `${prop.percentageChange}%`,
    `${prop.conversionRate.toFixed(2)}%`,
    prop.currentViewers,
    prop.topSource,
    prop.topDevice,
    prop.topLocation
  ]);

  // Convert to CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `heat-map-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * تصدير البيانات إلى JSON
 */
export function exportToJSON(properties: PropertyEngagement[]): void {
  const jsonContent = JSON.stringify(properties, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `heat-map-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7️⃣ Mock Data Generators (للتطوير)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * توليد مشاهدين عشوائيين (للمحاكاة)
 */
export function generateMockViewers(count: number): LiveViewer[] {
  const cities = ['الرياض', 'جدة', 'مكة', 'الدمام', 'المدينة', 'الخبر', 'الطائف', 'تبوك', 'أبها'];
  const devices: DeviceType[] = ['mobile', 'desktop', 'tablet'];
  const sources: SourceType[] = ['web', 'mobile_app', 'whatsapp_link', 'social_media', 'direct', 'qr_code'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const os = ['iOS', 'Android', 'Windows', 'MacOS'];

  return Array.from({ length: count }, (_, i) => ({
    id: `viewer-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000), // آخر ساعة
    location: {
      city: cities[Math.floor(Math.random() * cities.length)],
      country: 'SA',
      region: 'منطقة مكة',
      ip: `192.168.${Math.floor(Math.random() * 255)}.***`
    },
    device: {
      type: devices[Math.floor(Math.random() * devices.length)],
      os: os[Math.floor(Math.random() * os.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)]
    },
    source: sources[Math.floor(Math.random() * sources.length)],
    duration: Math.floor(Math.random() * 300) + 30, // 30-330 ثانية
    pageViews: Math.floor(Math.random() * 5) + 1,
    scrollDepth: Math.floor(Math.random() * 100),
    interactions: Math.floor(Math.random() * 10),
    isActive: Math.random() > 0.3, // 70% نشطين
    lastActivity: new Date()
  }));
}

/**
 * توليد بيانات تفاعل عشوائية (للمحاكاة)
 */
export function generateMockEngagement(baseViews: number): Partial<PropertyEngagement> {
  const views = baseViews;
  const clicks = Math.floor(views * (Math.random() * 0.3 + 0.1)); // 10-40% CTR
  const whatsappMessages = Math.floor(clicks * (Math.random() * 0.4 + 0.1)); // 10-50% من النقرات
  const phoneCalls = Math.floor(whatsappMessages * (Math.random() * 0.3)); // 0-30% من الرسائل
  const bookings = Math.floor(phoneCalls * (Math.random() * 0.5 + 0.3)); // 30-80% من المكالمات
  const shares = Math.floor(views * (Math.random() * 0.05)); // 0-5% share rate
  const favorites = Math.floor(views * (Math.random() * 0.08)); // 0-8% favorite rate

  return {
    views,
    clicks,
    whatsappMessages,
    phoneCalls,
    bookings,
    shares,
    favorites
  };
}

/**
 * حساب بيانات المقارنة (للمحاكاة)
 */
export function generateComparisonData(currentViews: number) {
  const previousViews = Math.floor(currentViews * (Math.random() * 0.4 + 0.8)); // 80-120% من الحالي
  const trend = calculateTrend(currentViews, previousViews);

  return {
    previousViews,
    trend: trend.trend,
    percentageChange: trend.percentageChange,
    growthRate: currentViews > previousViews 
      ? ((currentViews - previousViews) / previousViews) * 100 
      : 0
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8️⃣ Formatting Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تنسيق الأرقام (فواصل)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ar-SA');
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * تنسيق اسم الجهاز
 */
export function formatDeviceType(device: DeviceType): string {
  const labels: Record<DeviceType, string> = {
    mobile: 'جوال',
    desktop: 'ديسكتوب',
    tablet: 'تابلت'
  };
  return labels[device];
}

/**
 * تنسيق اسم المصدر
 */
export function formatSourceType(source: SourceType): string {
  const labels: Record<SourceType, string> = {
    web: 'الموقع',
    mobile_app: 'التطبيق',
    whatsapp_link: 'واتساب',
    social_media: 'سوشال ميديا',
    direct: 'مباشر',
    qr_code: 'QR Code'
  };
  return labels[source];
}

/**
 * الحصول على أيقونة الترند
 */
export function getTrendIcon(trend: TrendType): string {
  const icons: Record<TrendType, string> = {
    up: '📈',
    down: '📉',
    stable: '➡️'
  };
  return icons[trend];
}

/**
 * الحصول على لون الترند
 */
export function getTrendColor(trend: TrendType): string {
  const colors: Record<TrendType, string> = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  };
  return colors[trend];
}

/**
 * الحصول على لون نقاط التفاعل
 */
export function getEngagementScoreColor(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 50) return 'text-orange-500';
  return 'text-gray-600';
}
