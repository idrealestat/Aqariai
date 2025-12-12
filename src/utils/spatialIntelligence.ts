/**
 * نظام الذكاء المكاني المتكامل (Soni Spatial Intelligence)
 * يعمل بالكامل على الواجهة (Frontend-Only) باستخدام:
 * - Leaflet للخرائط
 * - Turf.js للتحليل المكاني
 * - ArcGIS Reverse Geocode للعناوين الدقيقة
 * - Overpass API (OpenStreetMap) للبحث الديناميكي عن الخدمات
 * 
 * الوظائف:
 * ✅ Snapping للمباني (مع حد أقصى 500 متر)
 * ✅ تحليل السياق العمراني (Density, Urban Form)
 * ✅ قرب الخدمات (Proximity to Schools, Hospitals, Mosques, etc)
 * ✅ بحث ديناميكي عن الخدمات الحقيقية (Overpass API)
 * ✅ تقييم جاذبية عقاري (Attractiveness Score 0-100)
 * ✅ تقييم مخاطر (Risk Assessment - Flood Zones)
 * ✅ ربط بالرمز البريدي (Postal Code Matching)
 * ✅ تقرير فوري شامل (Instant Spatial Report)
 */

import * as turf from '@turf/turf';
import type { AmenitiesCollection, AmenityFeature } from '../components/map/amenitiesData';
import type { FloodZonesCollection } from '../components/map/floodZonesData';
import { 
  searchNearbyAmenities, 
  findNearestByCategory, 
  checkEssentialServices,
  getAmenitiesStats,
  type OverpassAmenity 
} from './overpassAPI';

// ===================== TYPES =====================

export interface SpatialAnalysisInput {
  lng: number;
  lat: number;
  buildingsData: any; // GeoJSON FeatureCollection
  amenitiesData: AmenitiesCollection;
  floodZonesData: FloodZonesCollection;
  postalData?: any; // GeoJSON FeatureCollection (optional)
  useDynamicSearch?: boolean; // استخدام Overpass API للبحث الديناميكي
}

export interface SpatialAnalysisOutput {
  location: {
    query: { lat: number; lng: number };
    used: { lat: number; lng: number };
    snappedToBuilding: boolean;
  };
  address: {
    arcgis: any;
    postal: any;
  };
  building: any;
  spatial_context: {
    density: DensityInfo;
    shape: ShapeInfo;
    urban_form: 'high' | 'medium' | 'low';
  };
  proximity: ProximityInfo;
  dynamicAmenities?: OverpassAmenity[]; // الخدمات الديناميكية من Overpass
  amenitiesStats?: any; // إحصائيات الخدمات
  essentialServices?: any; // تقييم الخدمات الأساسية
  risk: RiskInfo;
  attractiveness_score: number;
  suggested_use: string;
  ai_comment: string;
}

export interface DensityInfo {
  count: number;
  area_km2: number;
  density: number; // buildings per km²
  category: 'high' | 'medium' | 'low';
}

export interface ShapeInfo {
  area_m2: number | null;
  bbox_area_m2?: number;
  compactness_ratio?: number;
  shape: 'compact' | 'regular' | 'irregular' | 'unknown';
}

export interface ProximityInfo {
  school: ProximityDetail | null;
  hospital: ProximityDetail | null;
  mosque: ProximityDetail | null;
  fuel: ProximityDetail | null;
  mall: ProximityDetail | null;
  park: ProximityDetail | null;
  supermarket: ProximityDetail | null;
  restaurant: ProximityDetail | null;
  gas_station: ProximityDetail | null;
  commercial_street: ProximityDetail | null;
}

export interface ProximityDetail {
  name: string;
  distance_m: number;
  walk_min?: number;
  drive_min?: number;
}

export interface RiskInfo {
  flood: 'high' | 'medium' | 'low';
  severity?: 'high' | 'medium' | 'low';
  description?: string;
}

// ===================== CONSTANTS =====================

const SPEED_WALK_M_PER_MIN = 83.33; // 5km/h → ~83.33 m/min
const SPEED_DRIVE_M_PER_MIN = 800;  // 48 km/h → ~800 m/min
const SNAP_THRESHOLD_M = 500;       // حد أقصى للـ snapping (500 متر)
const DENSITY_BUFFER_KM = 0.5;      // نصف قطر Buffer للكثافة (500 متر)

// ===================== UTILITY FUNCTIONS =====================

/**
 * تحويل مسافة بالأمتار إلى وقت مشي بالدقائق
 */
export function metersToMinutesWalking(m: number): number {
  return m / SPEED_WALK_M_PER_MIN;
}

/**
 * تحويل مسافة بالأمتار إلى وقت قيادة بالدقائق
 */
export function metersToMinutesDriving(m: number): number {
  return m / SPEED_DRIVE_M_PER_MIN;
}

/**
 * Snapping لأقرب مبنى (مع حد أقصى 500 متر)
 */
export function snapToNearestBuilding(
  lng: number,
  lat: number,
  buildingsFC: any
): { feature: any; coord: [number, number]; distance: number } | null {
  const pt = turf.point([lng, lat]);
  let bestDistance = Infinity;
  let best: { feature: any; snapped: any } | null = null;

  for (const f of buildingsFC.features) {
    try {
      // حساب أقرب نقطة على محيط المبنى
      const line = turf.polygonToLine(f);
      const nearestOn = turf.nearestPointOnLine(line, pt);
      const dist = turf.distance(pt, nearestOn, { units: 'meters' });

      if (dist < bestDistance) {
        bestDistance = dist;
        best = { feature: f, snapped: nearestOn };
      }
    } catch (e) {
      // fallback: استخدم centroid
      try {
        const c = turf.centroid(f);
        const dist = turf.distance(pt, c, { units: 'meters' });
        if (dist < bestDistance) {
          bestDistance = dist;
          best = { feature: f, snapped: c };
        }
      } catch {}
    }
  }

  // فقط استخدم snapping إذا كانت المسافة <= 500 متر
  if (best && bestDistance <= SNAP_THRESHOLD_M) {
    return {
      feature: best.feature,
      coord: best.snapped.geometry.coordinates,
      distance: bestDistance,
    };
  }

  return null;
}

/**
 * إيجاد الرمز البريدي للنقطة
 */
export function findPostalForPoint(lng: number, lat: number, postalFC: any): any {
  if (!postalFC || !postalFC.features) return null;
  
  const pt = turf.point([lng, lat]);
  for (const poly of postalFC.features) {
    try {
      if (turf.booleanPointInPolygon(pt, poly)) return poly;
    } catch {}
  }
  return null;
}

/**
 * إيجاد أقرب خدمة من نوع معين
 */
export function nearestAmenity(
  lng: number,
  lat: number,
  amenitiesFC: AmenitiesCollection,
  type?: string
): { feature: AmenityFeature; distance_m: number } | null {
  const pt = turf.point([lng, lat]);
  let best: AmenityFeature | null = null;
  let bestDist = Infinity;

  for (const a of amenitiesFC.features) {
    if (type && a.properties.type !== type) continue;
    const dist = turf.distance(pt, turf.point(a.geometry.coordinates), { units: 'meters' });
    if (dist < bestDist) {
      bestDist = dist;
      best = a;
    }
  }

  return best ? { feature: best, distance_m: bestDist } : null;
}

/**
 * حساب كثافة المباني (buildings per km²)
 */
export function computeDensity(lng: number, lat: number, buildingsFC: any): DensityInfo {
  const buf = turf.buffer(turf.point([lng, lat]), DENSITY_BUFFER_KM, { units: 'kilometers' });
  
  let count = 0;
  for (const f of buildingsFC.features) {
    try {
      const centroid = turf.centroid(f);
      if (turf.booleanWithin(centroid, buf)) count++;
    } catch {}
  }

  const area_km2 = turf.area(buf) / 1e6;
  const density = area_km2 > 0 ? count / area_km2 : 0;

  // تصنيف الكثافة
  const category = density > 1500 ? 'high' : density > 400 ? 'medium' : 'low';

  return {
    count,
    area_km2: +area_km2.toFixed(3),
    density: +density.toFixed(2),
    category,
  };
}

/**
 * تحليل شكل المبنى (compactness)
 */
export function analyzeShape(feature: any): ShapeInfo {
  try {
    const bbox = turf.bbox(feature);
    const bpoly = turf.bboxPolygon(bbox);
    const areaParcel = turf.area(feature);
    const areaBbox = turf.area(bpoly);
    const ratio = areaParcel / areaBbox;

    const shape = ratio > 0.6 ? 'compact' : ratio > 0.35 ? 'regular' : 'irregular';

    return {
      area_m2: Math.round(areaParcel),
      bbox_area_m2: Math.round(areaBbox),
      compactness_ratio: +ratio.toFixed(2),
      shape,
    };
  } catch (e) {
    return { area_m2: null, shape: 'unknown' };
  }
}

/**
 * تقييم المخاطر (Flood Zones)
 */
export function assessRisk(lng: number, lat: number, floodFC: FloodZonesCollection): RiskInfo {
  const pt = turf.point([lng, lat]);

  // تحقق من وجود النقطة داخل منطقة خطرة
  for (const f of floodFC.features) {
    try {
      if (turf.booleanPointInPolygon(pt, f)) {
        return {
          flood: f.properties.severity || 'high',
          severity: f.properties.severity,
          description: f.properties.description,
        };
      }
    } catch {}
  }

  // تحقق من القرب من منطقة خطرة (ضمن 500 متر)
  for (const f of floodFC.features) {
    try {
      const center = turf.centerOfMass(f);
      const dist = turf.distance(pt, center, { units: 'meters' });
      if (dist <= 500) {
        return {
          flood: 'medium',
          description: 'قريب من منطقة خطرة',
        };
      }
    } catch {}
  }

  return { flood: 'low' };
}

/**
 * حساب درجة الجاذبية العقارية (0-100)
 */
export function computeAttractiveness(params: {
  densityCategory: 'high' | 'medium' | 'low';
  servicesScore: number;
  shapeScore: number;
  streetWidth?: number;
  distanceToMainRoad_m: number;
  risk: 'high' | 'medium' | 'low';
}): number {
  let score = 50; // قاعدة أساسية

  // الكثافة
  const densityFactor = params.densityCategory === 'high' ? 5 : params.densityCategory === 'medium' ? 10 : 15;
  score += densityFactor;

  // الخدمات (كل خدمة متوفرة تضي�� نقاط)
  score += Math.min(20, params.servicesScore * 5);

  // شكل المبنى
  score += params.shapeScore;

  // عرض الشارع
  if (params.streetWidth) {
    score += Math.min(10, params.streetWidth / 4);
  }

  // القرب من الطرق الرئيسية (المسافة المثالية: 300-800 متر)
  if (params.distanceToMainRoad_m < 300) {
    score += 2; // قريب جداً (قد يكون صاخب)
  } else if (params.distanceToMainRoad_m < 800) {
    score += 6; // مثالي
  } else {
    score += 0; // بعيد
  }

  // المخاطر (تخفيض الدرجة)
  if (params.risk === 'high') score -= 30;
  else if (params.risk === 'medium') score -= 10;

  // تقييد النتيجة بين 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * تحليل القرب من الخدمات (Proximity Analysis)
 */
export function analyzeProximity(
  lng: number,
  lat: number,
  amenitiesFC: AmenitiesCollection
): ProximityInfo {
  const types = ['school', 'hospital', 'mosque', 'fuel', 'mall', 'park', 'supermarket', 'restaurant', 'gas_station', 'commercial_street'] as const;
  const result: any = {};

  for (const type of types) {
    const nearest = nearestAmenity(lng, lat, amenitiesFC, type);
    if (nearest) {
      result[type] = {
        name: nearest.feature.properties.name,
        distance_m: Math.round(nearest.distance_m),
        walk_min: Math.round(metersToMinutesWalking(nearest.distance_m)),
        drive_min: Math.round(metersToMinutesDriving(nearest.distance_m)),
      };
    } else {
      result[type] = null;
    }
  }

  return result as ProximityInfo;
}

/**
 * التحليل المكاني الكامل (Main Analysis Function)
 */
export async function analyzeSpatialIntelligence(
  input: SpatialAnalysisInput
): Promise<SpatialAnalysisOutput> {
  const { lng, lat, buildingsData, amenitiesData, floodZonesData, postalData, useDynamicSearch } = input;

  // 1) Snapping للمباني
  const snap = snapToNearestBuilding(lng, lat, buildingsData);
  let usedLng = lng;
  let usedLat = lat;
  let snappedBuilding = null;

  if (snap) {
    usedLng = snap.coord[0];
    usedLat = snap.coord[1];
    snappedBuilding = snap.feature;
  }

  // 2) الرمز البريدي
  const postalPoly = postalData ? findPostalForPoint(usedLng, usedLat, postalData) : null;

  // 3) Reverse Geocode (ArcGIS)
  let arcRes: any = null;
  try {
    const arcUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${usedLng}%2C${usedLat}&outSR=4326&f=pjson`;
    const r = await fetch(arcUrl);
    arcRes = await r.json();
  } catch (e) {
    console.error('ArcGIS Reverse Geocode Error:', e);
  }
  const arcAddr = arcRes?.address || {};

  // 4) تحليل القرب من الخدمات
  const proximity = analyzeProximity(usedLng, usedLat, amenitiesData);

  // 5) حساب الكثافة
  const density = computeDensity(usedLng, usedLat, buildingsData);

  // 6) تقييم المخاطر
  const risk = assessRisk(usedLng, usedLat, floodZonesData);
  const riskLevel = risk.flood || 'low';

  // 7) تحليل الشكل (إذا كان هناك مبنى مربوط)
  const shapeInfo = snappedBuilding ? analyzeShape(snappedBuilding) : { shape: 'unknown' as const, area_m2: null };

  // 8) عدد الخدمات المتوفرة ضمن 800 متر
  const servicesCount = Object.values(proximity).filter(
    (p) => p && p.distance_m <= 800
  ).length;

  // 9) تقدير المسافة لأقرب طريق رئيسي (نستخدم محطة الوقود كمؤشر)
  const distanceToMainRoad_m = proximity.fuel ? proximity.fuel.distance_m : 1200;

  // 10) حساب درجة الجاذبية
  const shapeScore = shapeInfo.shape === 'compact' ? 5 : shapeInfo.shape === 'regular' ? 3 : 0;
  const score = computeAttractiveness({
    densityCategory: density.category,
    servicesScore: servicesCount,
    shapeScore,
    distanceToMainRoad_m,
    risk: riskLevel,
  });

  // 11) توصية الاستخدام
  const suggested_use =
    score >= 70
      ? 'سكني / تجاري مختلط (مرغوب)'
      : score >= 45
      ? 'سكني (مناسب)'
      : 'تحتاج دراسة موقعية (مخاطر/خدمات)';

  // 12) تعليق الذكاء الاصطناعي
  const ai_comment = (() => {
    if (riskLevel === 'high')
      return 'ملاحظة: الموقع داخل منطقة عالية التعرض للسيول — يلزم دراسة تفصيلية للهيدرولوجيا قبل الاستثمار.';
    if (score >= 80) return 'موقع متميز؛ خدمات قريبة وكثافة جيدة.';
    if (score >= 50) return 'موقع متوسط الجاذبية؛ راجع توفر المواقف والضوضاء.';
    return 'موقع منخفض الجاذبية؛ تفقد البنية التحتية والقيود البلدية.';
  })();

  // البحث الديناميكي عن الخدمات (إذا تم تفعيله)
  let dynamicAmenities: OverpassAmenity[] | undefined = undefined;
  let amenitiesStats: any | undefined = undefined;
  let essentialServices: any | undefined = undefined;

  if (useDynamicSearch) {
    const searchResult = await searchNearbyAmenities(usedLat, usedLng, 2000);
    dynamicAmenities = searchResult.amenities;
    amenitiesStats = getAmenitiesStats(dynamicAmenities);
    essentialServices = checkEssentialServices(dynamicAmenities);
  }

  // النتيجة النهائية
  return {
    location: {
      query: { lat, lng },
      used: { lat: usedLat, lng: usedLng },
      snappedToBuilding: !!snappedBuilding,
    },
    address: {
      arcgis: arcAddr,
      postal: postalPoly ? postalPoly.properties : null,
    },
    building: snappedBuilding ? snappedBuilding.properties : null,
    spatial_context: {
      density,
      shape: shapeInfo,
      urban_form: density.category,
    },
    proximity,
    dynamicAmenities,
    amenitiesStats,
    essentialServices,
    risk,
    attractiveness_score: score,
    suggested_use,
    ai_comment,
  };
}