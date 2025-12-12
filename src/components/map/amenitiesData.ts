/**
 * بيانات الخدمات (Amenities) - مدارس، مستشفيات، مساجد، محطات وقود
 * للاستخدام في الذكاء المكاني - تحليل القرب والخدمات
 * 
 * ملاحظة: هذه عينات للمدن الرئيسية (الرياض، جدة، الدمام، الخبر)
 * يمكن توسيعها بإضافة المزيد من النقاط أو تحميل من ملفات GeoJSON خارجية
 */

export interface AmenityFeature {
  type: 'Feature';
  properties: {
    type: 'school' | 'hospital' | 'mosque' | 'fuel' | 'mall' | 'park' | 'supermarket' | 'restaurant' | 'gas_station' | 'commercial_street';
    name: string;
    city: string;
    district?: string;
    category?: string; // للتمييز بين أنواع المدارس، المطاعم، إلخ
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface AmenitiesCollection {
  type: 'FeatureCollection';
  features: AmenityFeature[];
}

/**
 * بيانات الخدمات - الرياض
 */
const riyadhAmenities: AmenityFeature[] = [
  // مدارس
  { type: 'Feature', properties: { type: 'school', name: 'مدارس الرياض النموذجية', city: 'الرياض', district: 'العليا' }, geometry: { type: 'Point', coordinates: [46.6753, 24.7136] } },
  { type: 'Feature', properties: { type: 'school', name: 'مدارس الفيصلية الأهلية', city: 'الرياض', district: 'الفيصلية' }, geometry: { type: 'Point', coordinates: [46.7750, 24.6900] } },
  { type: 'Feature', properties: { type: 'school', name: 'مدارس المنهل الأهلية', city: 'الرياض', district: 'الورود' }, geometry: { type: 'Point', coordinates: [46.6763, 24.7146] } },
  { type: 'Feature', properties: { type: 'school', name: 'مدارس الحصان النموذجية', city: 'الرياض', district: 'الحمراء' }, geometry: { type: 'Point', coordinates: [46.6745, 24.7155] } },
  
  // مستشفيات
  { type: 'Feature', properties: { type: 'hospital', name: 'مستشفى الملك فيصل التخصصي', city: 'الرياض', district: 'العليا' }, geometry: { type: 'Point', coordinates: [46.6775, 24.7100] } },
  { type: 'Feature', properties: { type: 'hospital', name: 'مستشفى الحبيب العليا', city: 'الرياض', district: 'العليا' }, geometry: { type: 'Point', coordinates: [46.6800, 24.7180] } },
  { type: 'Feature', properties: { type: 'hospital', name: 'مركز الصحة الأولي - الورود', city: 'الرياض', district: 'الورود' }, geometry: { type: 'Point', coordinates: [46.6765, 24.7140] } },
  
  // مساجد
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الراجحي الكبير', city: 'الرياض', district: 'العليا' }, geometry: { type: 'Point', coordinates: [46.6755, 24.7125] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الأمير تركي', city: 'الرياض', district: 'الورود' }, geometry: { type: 'Point', coordinates: [46.6750, 24.7138] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الفيصلية', city: 'الرياض', district: 'الفيصلية' }, geometry: { type: 'Point', coordinates: [46.6820, 24.6890] } },
  
  // محطات وقود
  { type: 'Feature', properties: { type: 'fuel', name: 'محطة أرامكو - طريق الملك فهد', city: 'الرياض', district: 'العليا' }, geometry: { type: 'Point', coordinates: [46.6768, 24.7135] } },
  { type: 'Feature', properties: { type: 'fuel', name: 'محطة بترومين - الورود', city: 'الرياض', district: 'الورود' }, geometry: { type: 'Point', coordinates: [46.6790, 24.7165] } },
  
  // مولات وحدائق
  { type: 'Feature', properties: { type: 'mall', name: 'العثيم مول', city: 'الرياض', district: 'العليا' }, geometry: { type: 'Point', coordinates: [46.6770, 24.7115] } },
  { type: 'Feature', properties: { type: 'park', name: 'حديقة الورود', city: 'الرياض', district: 'الورود' }, geometry: { type: 'Point', coordinates: [46.6760, 24.7150] } },
];

/**
 * بيانات الخدمات - جدة
 */
const jeddahAmenities: AmenityFeature[] = [
  // مدارس
  { type: 'Feature', properties: { type: 'school', name: 'مدارس الأندلس الأهلية', city: 'جدة', district: 'الروضة' }, geometry: { type: 'Point', coordinates: [39.1850, 21.5433] } },
  { type: 'Feature', properties: { type: 'school', name: 'مدارس دار الفكر', city: 'جدة', district: 'الزهراء' }, geometry: { type: 'Point', coordinates: [39.1920, 21.5500] } },
  
  // مستشفيات
  { type: 'Feature', properties: { type: 'hospital', name: 'مستشفى الدكتور سليمان فقيه', city: 'جدة', district: 'الروضة' }, geometry: { type: 'Point', coordinates: [39.1875, 21.5455] } },
  { type: 'Feature', properties: { type: 'hospital', name: 'مستشفى بخش', city: 'جدة', district: 'الزهراء' }, geometry: { type: 'Point', coordinates: [39.1900, 21.5480] } },
  
  // مساجد
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الروضة الكبير', city: 'جدة', district: 'الروضة' }, geometry: { type: 'Point', coordinates: [39.1860, 21.5440] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الزهراء', city: 'جدة', district: 'الزهراء' }, geometry: { type: 'Point', coordinates: [39.1910, 21.5490] } },
  
  // محطات وقود
  { type: 'Feature', properties: { type: 'fuel', name: 'محطة أرامكو - طريق المدينة', city: 'جدة', district: 'الروضة' }, geometry: { type: 'Point', coordinates: [39.1870, 21.5450] } },
  
  // مولات
  { type: 'Feature', properties: { type: 'mall', name: 'مول العرب', city: 'جدة', district: 'الزهراء' }, geometry: { type: 'Point', coordinates: [39.1895, 21.5475] } },
];

/**
 * بيانات الخدمات - الدمام والخبر
 */
const easternAmenities: AmenityFeature[] = [
  // الدمام
  { type: 'Feature', properties: { type: 'school', name: 'مدارس الظهران الأهلية', city: 'الدمام', district: 'الفيصلية' }, geometry: { type: 'Point', coordinates: [50.2084, 26.3927] } },
  { type: 'Feature', properties: { type: 'hospital', name: 'مستشفى الدمام المركزي', city: 'الدمام', district: 'الفيصلية' }, geometry: { type: 'Point', coordinates: [50.2100, 26.3940] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الدمام الكبير', city: 'الدمام', district: 'الفيصلية' }, geometry: { type: 'Point', coordinates: [50.2090, 26.3935] } },
  { type: 'Feature', properties: { type: 'fuel', name: 'محطة بترومين - الدمام', city: 'الدمام', district: 'الفيصلية' }, geometry: { type: 'Point', coordinates: [50.2095, 26.3930] } },
  
  // الخبر
  { type: 'Feature', properties: { type: 'school', name: 'مدارس الخبر الأهلية', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2092, 26.2874] } },
  { type: 'Feature', properties: { type: 'school', name: 'مدارس بنات قريبة', city: 'الخبر', district: 'الخبر الشمالية', category: 'بنات' }, geometry: { type: 'Point', coordinates: [50.2088, 26.2872] } },
  { type: 'Feature', properties: { type: 'hospital', name: 'مستشفى سعد التخصصي', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2100, 26.2880] } },
  { type: 'Feature', properties: { type: 'hospital', name: 'المستشفى التعليمي بالخبر', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2095, 26.2878] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد الخبر المركزي', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2095, 26.2877] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد 1 - قريب', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2090, 26.2873] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'مسجد 2 - قريب', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2098, 26.2876] } },
  { type: 'Feature', properties: { type: 'mosque', name: 'جامع كبير', city: 'الخبر', district: 'الخبر الشمالية', category: 'جامع' }, geometry: { type: 'Point', coordinates: [50.2093, 26.2875] } },
  { type: 'Feature', properties: { type: 'fuel', name: 'محطة أرامكو - الخبر', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2105, 26.2885] } },
  { type: 'Feature', properties: { type: 'mall', name: 'الراشد مول', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2110, 26.2890] } },
  
  // أسواق ومتاجر - الخبر
  { type: 'Feature', properties: { type: 'supermarket', name: 'أسواق المزرعة', city: 'الخبر', district: 'الخبر الشمالية', category: 'هايبر ماركت' }, geometry: { type: 'Point', coordinates: [50.2091, 26.2876] } },
  { type: 'Feature', properties: { type: 'supermarket', name: 'بنده', city: 'الخبر', district: 'الخبر الشمالية', category: 'هايبر ماركت' }, geometry: { type: 'Point', coordinates: [50.2108, 26.2888] } },
  
  // شوارع تجارية - الخبر
  { type: 'Feature', properties: { type: 'commercial_street', name: 'شارع 10 (شارع تجاري)', city: 'الخبر', district: 'الخبر الشمالية', category: 'محلات ومطاعم' }, geometry: { type: 'Point', coordinates: [50.2094, 26.2877] } },
  
  // مطاعم - الخبر
  { type: 'Feature', properties: { type: 'restaurant', name: 'مطعم سعودي برقر', city: 'الخبر', district: 'الخبر الشمالية', category: 'مطعم' }, geometry: { type: 'Point', coordinates: [50.2094, 26.2878] } },
  
  // محطة تعبئة غاز - الخبر
  { type: 'Feature', properties: { type: 'gas_station', name: 'محل تعبئة اسطوانات غاز - شارع الأبرار', city: 'الخبر', district: 'الخبر الشمالية' }, geometry: { type: 'Point', coordinates: [50.2089, 26.2874] } },
];

/**
 * GeoJSON كامل لجميع الخدمات
 */
export const amenitiesGeoJSON: AmenitiesCollection = {
  type: 'FeatureCollection',
  features: [
    ...riyadhAmenities,
    ...jeddahAmenities,
    ...easternAmenities,
  ],
};

/**
 * أيقونات الخدمات حسب النوع
 */
export const amenityIcons = {
  school: '🏫',
  hospital: '🏥',
  mosque: '🕌',
  fuel: '⛽',
  mall: '🛍️',
  park: '🌳',
  supermarket: '🛒',
  restaurant: '🍽️',
  gas_station: '⛽',
  commercial_street: '🛍️',
};

/**
 * ألوان الخدمات حسب النوع
 */
export const amenityColors = {
  school: '#198754',    // أخضر
  hospital: '#dc3545',  // أحمر
  mosque: '#0d6efd',    // أزرق
  fuel: '#6f42c1',      // بنفسجي
  mall: '#fd7e14',      // برتقالي
  park: '#20c997',      // تركواز
  supermarket: '#6c757d', // رمادي
  restaurant: '#ffc107', // ذهبي
  gas_station: '#6f42c1', // بنفسجي
  commercial_street: '#fd7e14', // برتقالي
};

/**
 * أسماء الخدمات بالعربية
 */
export const amenityLabels = {
  school: 'مدرسة',
  hospital: 'مستشفى',
  mosque: 'مسجد',
  fuel: 'محطة وقود',
  mall: 'مول',
  park: 'حديقة',
  supermarket: 'سوبرماركت',
  restaurant: 'مطعم',
  gas_station: 'محطة وقود',
  commercial_street: 'شارع تجاري',
};