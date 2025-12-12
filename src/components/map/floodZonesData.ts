/**
 * بيانات مناطق المخاطر (Flood Zones / Risk Zones)
 * للاستخدام في الذكاء المكاني - تقييم المخاطر
 * 
 * ملاحظة: هذه عينات افتراضية لمناطق معرضة للسيول/الفيضانات
 * في التطبيق الفعلي يجب الحصول على البيانات الرسمية من:
 * - وزارة البيئة والمياه والزراعة
 * - الهيئة الوطنية لإدارة الطوارئ
 * - المديرية العامة للدفاع المدني
 */

export interface FloodZoneFeature {
  type: 'Feature';
  properties: {
    risk: 'flood-prone' | 'landslide' | 'earthquake';
    severity: 'high' | 'medium' | 'low';
    city: string;
    district?: string;
    description?: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [[[lng, lat], ...]]
  };
}

export interface FloodZonesCollection {
  type: 'FeatureCollection';
  features: FloodZoneFeature[];
}

/**
 * مناطق المخاطر - الرياض
 * (عينات افتراضية - للاختبار فقط)
 */
const riyadhFloodZones: FloodZoneFeature[] = [
  {
    type: 'Feature',
    properties: {
      risk: 'flood-prone',
      severity: 'medium',
      city: 'الرياض',
      district: 'الورود',
      description: 'منطقة منخفضة معرضة للسيول في موسم الأمطار',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [46.6748, 24.7128],
        [46.6765, 24.7128],
        [46.6765, 24.7145],
        [46.6748, 24.7145],
        [46.6748, 24.7128],
      ]],
    },
  },
  {
    type: 'Feature',
    properties: {
      risk: 'flood-prone',
      severity: 'low',
      city: 'الرياض',
      district: 'العليا',
      description: 'منطقة قريبة من مجرى وادي حنيفة',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [46.6800, 24.7090],
        [46.6820, 24.7090],
        [46.6820, 24.7110],
        [46.6800, 24.7110],
        [46.6800, 24.7090],
      ]],
    },
  },
];

/**
 * مناطق المخاطر - جدة
 * (عينات افتراضية - للاختبار فقط)
 */
const jeddahFloodZones: FloodZoneFeature[] = [
  {
    type: 'Feature',
    properties: {
      risk: 'flood-prone',
      severity: 'high',
      city: 'جدة',
      district: 'مشرفة',
      description: 'منطقة معرضة للسيول الشديدة - تحتاج دراسة تفصيلية',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [39.1800, 21.5400],
        [39.1850, 21.5400],
        [39.1850, 21.5450],
        [39.1800, 21.5450],
        [39.1800, 21.5400],
      ]],
    },
  },
];

/**
 * مناطق المخاطر - الدمام والخبر
 * (عينات افتراضية - للاختبار فقط)
 */
const easternFloodZones: FloodZoneFeature[] = [
  {
    type: 'Feature',
    properties: {
      risk: 'flood-prone',
      severity: 'low',
      city: 'الدمام',
      district: 'الفيصلية',
      description: 'منطقة قريبة من الساحل',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [50.2050, 26.3900],
        [50.2100, 26.3900],
        [50.2100, 26.3950],
        [50.2050, 26.3950],
        [50.2050, 26.3900],
      ]],
    },
  },
];

/**
 * GeoJSON كامل لجميع مناطق المخاطر
 */
export const floodZonesGeoJSON: FloodZonesCollection = {
  type: 'FeatureCollection',
  features: [
    ...riyadhFloodZones,
    ...jeddahFloodZones,
    ...easternFloodZones,
  ],
};

/**
 * ألوان المخاطر حسب الخطورة
 */
export const riskColors = {
  high: '#dc3545',    // أحمر
  medium: '#fd7e14',  // برتقالي
  low: '#ffc107',     // أصفر
};

/**
 * تسميات المخاطر
 */
export const riskLabels = {
  'flood-prone': 'معرض للسيول',
  'landslide': 'انزلاقات أرضية',
  'earthquake': 'نشاط زلزالي',
};

/**
 * تسميات مستويات الخطورة
 */
export const severityLabels = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
};
