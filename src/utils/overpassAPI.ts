/**
 * 🗺️ Overpass API Integration - البحث الديناميكي عن الخدمات
 * 
 * يستخدم OpenStreetMap Overpass API للبحث عن الخدمات الحقيقية
 * حول أي موقع في السعودية بشكل تلقائي وديناميكي
 * 
 * الميزات:
 * ✅ بحث حقيقي عن الخدمات (ليس بيانات ثابتة)
 * ✅ يعمل في أي مكان في السعودية
 * ✅ 13 نوع من الخدمات
 * ✅ مجاني 100%
 */

export interface OverpassAmenity {
  id: string;
  type: string;
  name: string;
  lat: number;
  lon: number;
  distance_m: number;
  tags: Record<string, string>;
  category: string;
}

export interface OverpassSearchResult {
  amenities: OverpassAmenity[];
  searchRadius: number;
  centerLat: number;
  centerLon: number;
  timestamp: string;
}

/**
 * تعريف أنواع الخدمات المدعومة
 */
export const AMENITY_TYPES = {
  // الخدمات الدينية
  mosque: {
    label: 'مسجد / جامع',
    icon: '🕌',
    color: '#10b981',
    overpassTags: ['amenity=place_of_worship+religion=muslim', 'building=mosque'],
    priority: 1,
  },
  
  // التعليم
  school: {
    label: 'مدرسة',
    icon: '🏫',
    color: '#3b82f6',
    overpassTags: ['amenity=school'],
    priority: 2,
  },
  college: {
    label: 'معهد / جامعة',
    icon: '🎓',
    color: '#8b5cf6',
    overpassTags: ['amenity=college', 'amenity=university'],
    priority: 3,
  },
  
  // الصحة
  hospital: {
    label: 'مستشفى',
    icon: '🏥',
    color: '#ef4444',
    overpassTags: ['amenity=hospital'],
    priority: 1,
  },
  clinic: {
    label: 'مستوصف / عيادة',
    icon: '⚕️',
    color: '#f59e0b',
    overpassTags: ['amenity=clinic', 'amenity=doctors'],
    priority: 2,
  },
  
  // التسوق
  supermarket: {
    label: 'سوبرماركت / هايبر ماركت',
    icon: '🛒',
    color: '#6366f1',
    overpassTags: ['shop=supermarket', 'shop=mall', 'amenity=marketplace'],
    priority: 1,
  },
  mall: {
    label: 'مول / مركز تجاري',
    icon: '🛍️',
    color: '#ec4899',
    overpassTags: ['shop=mall', 'building=retail'],
    priority: 2,
  },
  
  // الطعام
  restaurant: {
    label: 'مطعم / كافيه',
    icon: '🍽️',
    color: '#f59e0b',
    overpassTags: ['amenity=restaurant', 'amenity=cafe', 'amenity=fast_food'],
    priority: 3,
  },
  
  // الطاقة والوقود
  fuel: {
    label: 'محطة بنزين (بترول)',
    icon: '⛽',
    color: '#14b8a6',
    overpassTags: ['amenity=fuel'],
    priority: 1,
  },
  gas_station: {
    label: 'محل تعبئة غاز',
    icon: '🔥',
    color: '#f97316',
    overpassTags: ['shop=gas', 'amenity=fuel+fuel:lpg=yes'],
    priority: 2,
  },
  
  // الترفيه والرياضة
  gym: {
    label: 'صالة رياضية',
    icon: '💪',
    color: '#a855f7',
    overpassTags: ['leisure=fitness_centre', 'leisure=sports_centre', 'amenity=gym'],
    priority: 2,
  },
  park: {
    label: 'حديقة عامة',
    icon: '🌳',
    color: '#22c55e',
    overpassTags: ['leisure=park', 'leisure=garden'],
    priority: 3,
  },
  beach: {
    label: 'واجهة بحرية / شاطئ',
    icon: '🏖️',
    color: '#06b6d4',
    overpassTags: ['natural=beach', 'leisure=beach_resort', 'natural=coastline'],
    priority: 1,
  },
};

/**
 * بناء Overpass Query للبحث عن الخدمات
 */
function buildOverpassQuery(lat: number, lon: number, radius: number = 2000): string {
  const queries: string[] = [];
  
  // لكل نوع خدمة، أضف استعلام
  Object.entries(AMENITY_TYPES).forEach(([key, config]) => {
    config.overpassTags.forEach(tag => {
      queries.push(`
        node[${tag}](around:${radius},${lat},${lon});
        way[${tag}](around:${radius},${lat},${lon});
      `);
    });
  });
  
  const fullQuery = `
    [out:json][timeout:25];
    (
      ${queries.join('')}
    );
    out body;
    >;
    out skel qt;
  `;
  
  return fullQuery;
}

/**
 * حساب المسافة بين نقطتين (Haversine Formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // نصف قطر الأرض بالأمتار
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // المسافة بالأمتار
}

/**
 * تحديد نوع الخدمة من الـ tags
 */
function categorizeAmenity(tags: Record<string, string>): string | null {
  // مسجد
  if (tags.amenity === 'place_of_worship' && tags.religion === 'muslim') return 'mosque';
  if (tags.building === 'mosque') return 'mosque';
  
  // تعليم
  if (tags.amenity === 'school') return 'school';
  if (tags.amenity === 'college' || tags.amenity === 'university') return 'college';
  
  // صحة
  if (tags.amenity === 'hospital') return 'hospital';
  if (tags.amenity === 'clinic' || tags.amenity === 'doctors') return 'clinic';
  
  // تسوق
  if (tags.shop === 'supermarket' || tags.shop === 'mall') return 'supermarket';
  if (tags.amenity === 'marketplace') return 'supermarket';
  if (tags.building === 'retail') return 'mall';
  
  // طعام
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe' || tags.amenity === 'fast_food') return 'restaurant';
  
  // وقود
  if (tags.amenity === 'fuel') {
    if (tags['fuel:lpg'] === 'yes') return 'gas_station';
    return 'fuel';
  }
  if (tags.shop === 'gas') return 'gas_station';
  
  // رياضة
  if (tags.leisure === 'fitness_centre' || tags.leisure === 'sports_centre' || tags.amenity === 'gym') return 'gym';
  if (tags.leisure === 'park' || tags.leisure === 'garden') return 'park';
  
  // بحر
  if (tags.natural === 'beach' || tags.leisure === 'beach_resort' || tags.natural === 'coastline') return 'beach';
  
  return null;
}

/**
 * البحث عن الخدمات باستخدام Overpass API
 */
export async function searchNearbyAmenities(
  lat: number,
  lon: number,
  radius: number = 2000
): Promise<OverpassSearchResult> {
  const query = buildOverpassQuery(lat, lon, radius);
  const url = 'https://overpass-api.de/api/interpreter';
  
  console.log('🔍 Searching for amenities using Overpass API...');
  console.log('📍 Location:', lat, lon);
  console.log('📏 Radius:', radius, 'meters');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Overpass API Response:', data);
    
    // معالجة النتائج
    const amenities: OverpassAmenity[] = [];
    const seen = new Set<string>(); // لتجنب التكرار
    
    for (const element of data.elements) {
      const tags = element.tags || {};
      
      // تحديد نوع الخدمة
      const category = categorizeAmenity(tags);
      if (!category) continue;
      
      // اسم الخدمة (عربي أو إنجليزي)
      const name = tags['name:ar'] || tags.name || tags.brand || AMENITY_TYPES[category as keyof typeof AMENITY_TYPES]?.label || 'غير محدد';
      
      // الإحداثيات
      let amenityLat = element.lat;
      let amenityLon = element.lon;
      
      // إذا كان Way (مضلع)، استخدم center من الـ bounds
      if (element.type === 'way' && element.center) {
        amenityLat = element.center.lat;
        amenityLon = element.center.lon;
      }
      
      if (!amenityLat || !amenityLon) continue;
      
      // حساب المسافة
      const distance = calculateDistance(lat, lon, amenityLat, amenityLon);
      
      // تجنب التكرار
      const key = `${category}-${name}-${amenityLat.toFixed(5)}-${amenityLon.toFixed(5)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      
      amenities.push({
        id: element.id.toString(),
        type: element.type,
        name,
        lat: amenityLat,
        lon: amenityLon,
        distance_m: Math.round(distance),
        tags,
        category,
      });
    }
    
    // ترتيب حسب المسافة
    amenities.sort((a, b) => a.distance_m - b.distance_m);
    
    console.log(`✅ Found ${amenities.length} amenities`);
    
    return {
      amenities,
      searchRadius: radius,
      centerLat: lat,
      centerLon: lon,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error('❌ Error fetching from Overpass API:', error);
    throw error;
  }
}

/**
 * إيجاد أقرب خدمة من نوع معين
 */
export function findNearestByCategory(
  amenities: OverpassAmenity[],
  category: string
): OverpassAmenity | null {
  const filtered = amenities.filter(a => a.category === category);
  if (filtered.length === 0) return null;
  
  // أقرب واحد (مرتب مسبقاً)
  return filtered[0];
}

/**
 * إيجاد أقرب 3 خدمات من نوع معين
 */
export function findTop3ByCategory(
  amenities: OverpassAmenity[],
  category: string
): OverpassAmenity[] {
  const filtered = amenities.filter(a => a.category === category);
  return filtered.slice(0, 3);
}

/**
 * تجميع الخدمات حسب النوع
 */
export function groupByCategory(amenities: OverpassAmenity[]): Record<string, OverpassAmenity[]> {
  const groups: Record<string, OverpassAmenity[]> = {};
  
  for (const amenity of amenities) {
    if (!groups[amenity.category]) {
      groups[amenity.category] = [];
    }
    groups[amenity.category].push(amenity);
  }
  
  return groups;
}

/**
 * إحصائيات عن الخدمات المتوفرة
 */
export function getAmenitiesStats(amenities: OverpassAmenity[]): {
  total: number;
  byCategory: Record<string, number>;
  within500m: number;
  within1km: number;
  within2km: number;
} {
  const byCategory: Record<string, number> = {};
  let within500m = 0;
  let within1km = 0;
  let within2km = 0;
  
  for (const amenity of amenities) {
    // عدد حسب النوع
    byCategory[amenity.category] = (byCategory[amenity.category] || 0) + 1;
    
    // عدد حسب المسافة
    if (amenity.distance_m <= 500) within500m++;
    if (amenity.distance_m <= 1000) within1km++;
    if (amenity.distance_m <= 2000) within2km++;
  }
  
  return {
    total: amenities.length,
    byCategory,
    within500m,
    within1km,
    within2km,
  };
}

/**
 * التحقق من توفر الخدمات الأساسية (ضمن 1 كم)
 */
export function checkEssentialServices(amenities: OverpassAmenity[]): {
  hasMosque: boolean;
  hasSchool: boolean;
  hasHospitalOrClinic: boolean;
  hasSupermarket: boolean;
  hasFuel: boolean;
  score: number; // من 5
} {
  const within1km = amenities.filter(a => a.distance_m <= 1000);
  
  const hasMosque = within1km.some(a => a.category === 'mosque');
  const hasSchool = within1km.some(a => a.category === 'school');
  const hasHospitalOrClinic = within1km.some(a => a.category === 'hospital' || a.category === 'clinic');
  const hasSupermarket = within1km.some(a => a.category === 'supermarket');
  const hasFuel = within1km.some(a => a.category === 'fuel');
  
  const score = [hasMosque, hasSchool, hasHospitalOrClinic, hasSupermarket, hasFuel].filter(Boolean).length;
  
  return {
    hasMosque,
    hasSchool,
    hasHospitalOrClinic,
    hasSupermarket,
    hasFuel,
    score,
  };
}
