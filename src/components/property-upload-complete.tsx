import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDashboardContext } from '../context/DashboardContext';
import { savePublishedAd, generateAdNumber, type PublishedAd } from '../utils/publishedAds';
import { ensureCustomerExists } from '../utils/customersManager';
import { notifyNewCustomer, notifyCustomerUpdated, notifyAdPublished } from '../utils/notificationsSystem';
import { toast } from 'sonner@2.0.3';
import L from 'leaflet@1.9.4';
import * as turf from '@turf/turf';
import { buildingsGeoJSON } from './map/buildingsData';
import { amenitiesGeoJSON, amenityColors, amenityLabels } from './map/amenitiesData';
import { floodZonesGeoJSON, riskColors, severityLabels } from './map/floodZonesData';
import { analyzeSpatialIntelligence, type SpatialAnalysisOutput } from '../utils/spatialIntelligence';
import { SpatialIntelligenceReport } from './SpatialIntelligenceReport';
import { 
  ArrowRight, 
  Upload,
  Save,
  Eye,
  X,
  Camera,
  Star,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Link,
  Share2,
  BarChart3,
  Building,
  MapPin,
  Bed,
  Bath,
  Maximize,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  Shield,
  Sparkles,
  TrendingUp,
  Bot,
  Hash,
  Archive,
  Globe,
  Target,
  RefreshCw,
  ExternalLink,
  MapIcon,
  Loader2
} from 'lucide-react';

interface PropertyUploadCompleteProps {
  onBack: () => void;
  initialTab?: string;
}

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  isPrimary?: boolean;
}

interface Warranty {
  id: string;
  type: string;
  duration: string;
  notes: string;
}

interface LocationDetails {
  city: string;
  district: string;
  street: string;
  postalCode: string;
  buildingNumber: string;
  additionalNumber: string;
  latitude: number;
  longitude: number;
}

interface PlatformAPI {
  id: string;
  name: string;
  status: string;
  color: string;
  apiUrl: string;
  isConnected: boolean;
  lastSync?: Date;
}

interface MarketData {
  source: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  pricePerSqm: number;
  url: string;
}

interface PropertyData {
  // البيانات الأساسية (255)
  fullName: string;
  birthDate: string;
  idNumber: string;
  idIssueDate: string; // تاريخ إصدار بطاقة الأحوال
  idExpiryDate: string; // تاريخ انتهاء بطاقة الأحوال
  phoneNumber: string;
  
  // بيانات الصك
  deedNumber: string; // رقم الصك
  deedDate: string; // تاريخ الصك
  deedIssuer: string; // جهة إصدار الصك
  
  // تفاصيل العقار (256)
  propertyType: string;
  category: string;
  purpose: string;
  area: string;
  propertyCategory: 'سكني' | 'تجاري'; // 🆕 التصنيف الذكي (سكني/تجاري)
  
  // المواصفات التفصيلية
  entranceType: string;
  propertyLocation: string;
  propertyLevel: string;
  bedrooms: number;
  bathrooms: number;
  warehouses: number;
  balconies: number;
  curtains: number;
  airConditioners: number;
  privateParking: number;
  floors: number;
  
  // المميزات الفاخرة والحديثة
  jacuzzi: number; // جاكوزي
  rainShower: number; // دش مطري
  smartLighting: number; // إضاءة ذكية
  solarPanels: number; // ألواح شمسية
  securitySystem: number; // نظام أمني
  centralHeating: number; // تدفئة مركزية
  swimmingPool: number; // مسبح
  gym: number; // صالة رياضية
  garden: number; // حديقة
  elevator: number; // مصعد
  generator: number; // مولد كهرباء
  intercom: number; // انتركوم
  cctv: number; // كاميرات مراقبة
  fireAlarm: number; // جهاز إنذار حريق
  kitchenAppliances: number; // أجهزة مطبخ
  builtInWardrobe: number; // خزائن مدمجة
  ceramicFlooring: number; // أرضية سيراميك
  marbleFlooring: number; // أرضية رخام
  parquetFlooring: number; // أرضية باركيه
  paintedWalls: number; // جدران مدهونة
  wallpaper: number; // ورق جدران
  soundproofing: number; // عازل صوت
  thermalInsulation: number; // عازل حراري
  waterproofing: number; // عازل مائي
  fiberOptic: number; // فايبر أوبتك
  satelliteDish: number; // طبق استقبال
  laundryRoom: number; // غرفة غسيل
  maidsRoom: number; // غرفة خادمة
  driverRoom: number; // غرفة سائق
  guestRoom: number; // غرفة ضيوف
  office: number; // مكتب
  library: number; // مكتبة
  playroom: number; // غرفة ألعاب
  storageRoom: number; // غرفة تخزين
  basement: number; // ��بو
  attic: number; // علية
  terrace: number; // تراس
  patio: number; // فناء
  barbecueArea: number; // منطقة شواء
  
  // الضمانات والكفالات (259)
  warranties: Warranty[];
  
  // السعر والجولة الافتراضية
  finalPrice: string;
  virtualTourLink: string;
  
  // الذكاء الاصطناعي (267) - محسن
  aiDescription: {
    language: string;
    tone: string;
    generatedText: string;
  };
  
  // الترخيص الإعلاني (تم تحويله من عنوان العقار)
  advertisingLicense: string;
  advertisingLicenseStatus: 'valid' | 'invalid' | 'checking' | 'unknown';
  
  // تفاصيل الموقع الجديدة
  locationDetails: LocationDetails;
  useMapPicker: boolean;
  
  // بيانات السوق ومقدر الأسعار
  marketData: MarketData[];
  selectedMarketPrice: number;
  priceComparison: 'below' | 'average' | 'above' | 'unknown';
  
  // رقم الواتساب
  whatsappNumber: string;
  
  // الهاشتاقات والمسار
  autoHashtags: string[];
  platformPath: string;
  
  // المميزات المخصصة القا��لة للإضافة والحذف
  customFeatures: string[];
  
  // الملفات
  mediaFiles: MediaFile[];
}

interface Platform {
  id: string;
  name: string;
  color: string;
  status: string;
  isConnected: boolean;
}

// إصلاح أيقونات Leaflet (إلزامي)
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// المدن السعودية (20 مدينة)
const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الطائف', 'تبوك', 
  'بريدة', 'خميس مشيط', 'الهفوف', 'حائل', 'نجران', 'الجبيل', 'ضبا', 'القطيف',
  'الخرج', 'أبها', 'ينبع', 'عرعر'
];

// مكون الخريطة التفاعلية
const MapLocationPicker = ({ onLocationSelect }: { onLocationSelect: (data: any) => void }) => {
  console.log('🗺️ MapLocationPicker component rendered');
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [buildingsData, setBuildingsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snappingEnabled, setSnappingEnabled] = useState(true);
  const [cssLoaded, setCssLoaded] = useState(false);
  const [spatialReport, setSpatialReport] = useState<SpatialAnalysisOutput | null>(null);
  const [showSpatialReport, setShowSpatialReport] = useState(false);

  // تحميل Leaflet CSS من CDN مرة واحدة
  useEffect(() => {
    // تحقق إذا كان CSS محملاً مسبقاً
    const existingLink = document.querySelector('link[href*="leaflet"]');
    if (existingLink) {
      setCssLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    link.integrity = 'sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==';
    link.crossOrigin = 'anonymous';
    link.onload = () => {
      console.log('✅ Leaflet CSS loaded successfully');
      setCssLoaded(true);
    };
    link.onerror = () => {
      console.error('❌ Failed to load Leaflet CSS');
      setCssLoaded(true); // المتابعة حتى مع فشل التحميل
    };
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    console.log('📦 Loading buildings data...');
    setBuildingsData(buildingsGeoJSON);
    setIsLoading(false);
    console.log('✅ Buildings data loaded, isLoading set to false');
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !cssLoaded) return;

    console.log('🚀 Starting map initialization...');

    // تأخير بسيط للتأكد من تحميل CSS واستقرار DOM
    const timer = setTimeout(() => {
      try {
        console.log('🗺️ Initializing Leaflet map...');
        
        // تهيئة Leaflet
        const map = L.map(mapContainerRef.current!).setView([24.7136, 46.6753], 13);
        
        // طبقة OpenStreetMap (الشوارع)
        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        });
        
        // طبقة الأقمار الصناعية (Esri World Imagery)
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: '© Esri'
        });
        
        // إضافة الطبقة الافتراضية (الشوارع)
        streetLayer.addTo(map);
        
        // التحكم في الطبقات
        const baseLayers = {
          '🗺️ الشوارع': streetLayer,
          '🛰️ أقمار صناعية': satelliteLayer
        };
        L.control.layers(baseLayers).addTo(map);
        
        mapRef.current = map;
        console.log('✅ Map initialized successfully with layers');

        // Marker أحمر
        const redIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        const marker = L.marker([24.7136, 46.6753], { 
          icon: redIcon,
          draggable: false 
        }).addTo(map);
        
        // Popup أولي
        marker.bindPopup(`
          <div style="text-align: right; font-family: 'Tajawal', sans-serif; direction: rtl;">
            <strong style="color: #01411C;">📍 الرياض</strong><br/>
            <span style="color: #999; font-size: 12px;">انقر على الخريطة لتحديد موقع جديد</span>
          </div>
        `);
        
        // إضافة دائرة حول العلامة
        const circle = L.circle([24.7136, 46.6753], {
          color: '#D4AF37',
          fillColor: '#D4AF37',
          fillOpacity: 0.2,
          radius: 50
        }).addTo(map);
        
        markerRef.current = marker;
        console.log('✅ Marker added successfully');
        
        // حفظ مرجع الدائرة
        const circleRef = { current: circle };

        // معالج النقر
        console.log('📝 ✅ Registering click handler on map...');
        map.on('click', async (e: any) => {
          console.log('');
          console.log('🖱️🖱️🖱️ ========== CLICK DETECTED! ========== 🖱️🖱️🖱️');
          console.log('');
          
      const lng = e.latlng.lng;
      const lat = e.latlng.lat;
      
      let finalLng = lng;
      let finalLat = lat;
      let snappedBuilding = null;
      
      console.log('🖱️ Click coordinates:', { lat, lng });
      console.log('🔧 Snapping enabled:', snappingEnabled);
      
      if (buildingsData && buildingsData.features) {
        console.log('🏢 Total buildings:', buildingsData.features.length);
      }
      
      // خطوة 1: Snapping باستخدام Turf.js
      // حد أقصى للمسافة للـ snapping (500 متر)
      const MAX_SNAP_DISTANCE = 0.5; // بالكيلومتر
      
      if (snappingEnabled && buildingsData) {
        try {
          const clickPoint = turf.point([lng, lat]);
          const nearest = turf.nearestPoint(clickPoint, buildingsData);
          
          const distance = nearest.properties.distanceToPoint;
          console.log('🎯 Nearest building found:', nearest.properties.name);
          console.log('📏 Distance:', distance, 'km');
          
          // فقط استخدم snapping إذا كان المبنى قريب (< 500m)
          if (nearest && nearest.geometry && distance <= MAX_SNAP_DISTANCE) {
            finalLng = nearest.geometry.coordinates[0];
            finalLat = nearest.geometry.coordinates[1];
            snappedBuilding = nearest.properties;
            
            console.log('✅ Snapped to building (within 500m):', snappedBuilding);
            console.log('📍 Snapped coordinates:', { lat: finalLat, lng: finalLng });
          } else if (distance > MAX_SNAP_DISTANCE) {
            console.log('⚠️ Building too far (' + distance.toFixed(2) + ' km) - using raw coordinates instead');
          }
        } catch (err) {
          console.error('❌ خطأ في Snapping:', err);
        }
      } else {
        console.log('⚠️ Snapping DISABLED - using raw coordinates');
      }
      
      // خطوة 2: تحريك Marker مع animation
      if (markerRef.current) {
        console.log('🎯 BEFORE - Marker position:', markerRef.current.getLatLng());
        console.log('🎯 MOVING marker to:', { lat: finalLat, lng: finalLng });
        
        // تحريك العلامة - الأمر الحاسم!
        markerRef.current.setLatLng([finalLat, finalLng]);
        
        // تحريك الدائرة أيضاً
        if (circleRef.current) {
          circleRef.current.setLatLng([finalLat, finalLng]);
          console.log('⭕ Circle moved with marker');
        }
        
        console.log('🎯 AFTER - Marker position:', markerRef.current.getLatLng());
        console.log('✅ ✅ ✅ Marker MOVED successfully! Check the map!');
        
        // إضافة bounce animation
        setTimeout(() => {
          if (markerRef.current) {
            const icon = markerRef.current.getElement();
            if (icon) {
              console.log('🎨 Adding bounce animation to marker');
              icon.style.animation = 'none';
              setTimeout(() => {
                icon.style.animation = 'bounce 0.5s ease-in-out';
              }, 10);
            } else {
              console.error('❌ Marker icon element not found!');
            }
          }
        }, 100);
        
        // تحريك الخريطة للمركز على الموقع الجديد مع animation
        console.log('🗺️ Flying map to:', { lat: finalLat, lng: finalLng });
        map.flyTo([finalLat, finalLng], map.getZoom(), {
          duration: 0.5,
          easeLinearity: 0.25
        });
        
        console.log('✅ ✅ ✅ EVERYTHING MOVED - CHECK THE MAP NOW!');
      } else {
        console.error('❌ Marker ref is null!');
      }
      
      // خطوة 3: ArcGIS Reverse Geocoding
      try {
        const arcgisUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${finalLng}%2C${finalLat}&outSR=4326&f=pjson`;
        const response = await fetch(arcgisUrl);
        const data = await response.json();
        
        const addr = data.address || {};
        
        // إضافة Popup للعلامة
        if (markerRef.current) {
          const popupContent = snappedBuilding 
            ? `<div style="text-align: right; font-family: 'Tajawal', sans-serif; direction: rtl;">
                 <strong style="color: #01411C;">🏢 ${snappedBuilding.name || 'مبنى'}</strong><br/>
                 <span style="color: #666;">📍 ${addr.City || 'الرياض'} - ${addr.Neighborhood || snappedBuilding.district || ''}</span><br/>
                 <span style="color: #999; font-size: 12px;">🎯 تم التثبيت على المبنى</span>
               </div>`
            : `<div style="text-align: right; font-family: 'Tajawal', sans-serif; direction: rtl;">
                 <strong style="color: #01411C;">📍 ${addr.City || 'الرياض'}</strong><br/>
                 <span style="color: #666;">${addr.Neighborhood || addr.District || 'موقع محدد'}</span><br/>
                 <span style="color: #999; font-size: 12px;">🗺️ موقع عادي</span>
               </div>`;
          
          markerRef.current.bindPopup(popupContent).openPopup();
        }
        
        // خطوة 4: تعبئة الحقول
        onLocationSelect({
          city: addr.City || addr.Region || '',
          district: addr.Neighborhood || addr.District || '',
          street: addr.Address || addr.Street || '',
          buildingNumber: addr.AddNum || snappedBuilding?.id || '',
          postalCode: addr.Postal || addr.PostalCode || '',
          additionalNumber: addr.Subregion || addr.MetroArea || '',
          coordinates: { lat: finalLat, lng: finalLng },
          buildingInfo: snappedBuilding
        });
        
        console.log('📍 ArcGIS Response:', addr);
        
        // خطوة 5: تشغيل الذكاء المكاني
        try {
          console.log('🧠 Running Spatial Intelligence Analysis...');
          const spatialAnalysis = await analyzeSpatialIntelligence({
            lng: finalLng,
            lat: finalLat,
            buildingsData: buildingsData,
            amenitiesData: amenitiesGeoJSON,
            floodZonesData: floodZonesGeoJSON,
            postalData: null, // يمكن إضافة بيانات الرموز البريدية لاحقاً
            useDynamicSearch: true, // ✨ تفعيل البحث الديناميكي عن الخدمات الحقيقية
          });
          
          setSpatialReport(spatialAnalysis);
          setShowSpatialReport(true);
          console.log('✅ Spatial Intelligence Report Generated:', spatialAnalysis);
        } catch (err) {
          console.error('❌ Error in Spatial Intelligence:', err);
        }
      } catch (err) {
        console.error('خطأ في ArcGIS Geocoding:', err);
        
        // Fallback
        onLocationSelect({
          city: 'الرياض',
          district: '',
          street: '',
          buildingNumber: '',
          postalCode: '',
          additionalNumber: '',
          coordinates: { lat: finalLat, lng: finalLng },
          buildingInfo: snappedBuilding
        });
        }
      });
      } catch (error) {
        console.error('❌ Error initializing map:', error);
      }
    }, 100);
    
    return () => {
      console.log('🧹 Cleaning up map...');
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cssLoaded]); // ✅ فقط cssLoaded - باقي المتغيرات يتم قراءتها من state مباشرة

  return (
    <div className="relative">
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .leaflet-marker-icon {
          animation: pulse 2s infinite;
        }
      `}</style>
      <div 
        ref={mapContainerRef} 
        className="w-full h-96 rounded-lg overflow-hidden border-2 border-red-300 bg-gray-100" 
        style={{ zIndex: 1, minHeight: '384px', pointerEvents: 'auto', cursor: 'crosshair' }}
        onClick={() => console.log('🖱️ DIV CLICKED! (This means clicks are reaching the div)')}
      />
      
      {(!cssLoaded || isLoading) && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg" style={{ zIndex: 10, pointerEvents: 'none' }}>
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700">{!cssLoaded ? 'جاري تحميل الخريطة...' : 'جاري تحميل البيانات...'}</p>
          </div>
        </div>
      )}
      
      {/* أدوات التحكم والإرشادات */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2" style={{ zIndex: 1000, pointerEvents: 'auto' }}>
        <button
          onClick={() => setSnappingEnabled(!snappingEnabled)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            snappingEnabled 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
          }`}
        >
          <Target className={`w-4 h-4 ${snappingEnabled ? 'animate-pulse' : ''}`} />
          {snappingEnabled ? 'محاذاة المباني: مفعّل' : 'محاذاة المباني: معطّل'}
        </button>
        {spatialReport && (
          <button
            onClick={() => setShowSpatialReport(!showSpatialReport)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border-2 border-blue-300 transition-all hover:bg-blue-200 w-full"
          >
            <Sparkles className="w-4 h-4" />
            {showSpatialReport ? 'إخفاء التقرير' : 'عرض التقرير المكاني'}
          </button>
        )}
        <div className="text-xs text-gray-500 max-w-xs">
          💡 انقر على الخريطة لتحديد الموقع وسيتم ملء بيانات العنوان الوطني تلقائياً
        </div>
      </div>
      
      {showSpatialReport && spatialReport && (
        <SpatialIntelligenceReport 
          report={spatialReport}
          onClose={() => setShowSpatialReport(false)}
        />
      )}
    </div>
  );
};

export default function PropertyUploadComplete({ onBack, initialTab }: PropertyUploadCompleteProps) {
  console.log('🎯 PropertyUploadComplete تم التحميل مع initialTab:', initialTab);
  const { leftSidebarOpen } = useDashboardContext();
  
  const [activeTab, setActiveTab] = useState(initialTab || "linking");
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // ✅ مصفوفة الصور المرفوعة
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [snappingEnabled, setSnappingEnabled] = useState(true);
  
  // ✅ تحديث التبويب النشط عند تغيير initialTab
  useEffect(() => {
    if (initialTab) {
      console.log('🔄 تحديث التبويب النشط إلى:', initialTab);
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // ⚠️ تم نقل تعريف propertyData هنا (قبل useEffect)
  const [propertyData, setPropertyData] = useState<PropertyData>({
    fullName: "",
    birthDate: "",
    idNumber: "",
    idIssueDate: "",
    idExpiryDate: "",
    phoneNumber: "",
    deedNumber: "",
    deedDate: "",
    deedIssuer: "",
    propertyType: "",
    category: "",
    purpose: "",
    area: "",
    propertyCategory: "سكني", // 🆕 القيمة الافتراضية للتصنيف
    entranceType: "",
    propertyLocation: "",
    propertyLevel: "",
    bedrooms: 0,
    bathrooms: 0,
    warehouses: 0,
    balconies: 0,
    curtains: 0,
    airConditioners: 0,
    privateParking: 0,
    floors: 1,
    
    // المميزات الفاخرة والحديثة - القيم الافتراضية
    jacuzzi: 0,
    rainShower: 0,
    smartLighting: 0,
    solarPanels: 0,
    securitySystem: 0,
    centralHeating: 0,
    swimmingPool: 0,
    gym: 0,
    garden: 0,
    elevator: 0,
    generator: 0,
    intercom: 0,
    cctv: 0,
    fireAlarm: 0,
    kitchenAppliances: 0,
    builtInWardrobe: 0,
    ceramicFlooring: 0,
    marbleFlooring: 0,
    parquetFlooring: 0,
    paintedWalls: 0,
    wallpaper: 0,
    soundproofing: 0,
    thermalInsulation: 0,
    waterproofing: 0,
    fiberOptic: 0,
    satelliteDish: 0,
    laundryRoom: 0,
    maidsRoom: 0,
    driverRoom: 0,
    guestRoom: 0,
    office: 0,
    library: 0,
    playroom: 0,
    storageRoom: 0,
    basement: 0,
    attic: 0,
    terrace: 0,
    patio: 0,
    barbecueArea: 0,
    warranties: [],
    finalPrice: "",
    virtualTourLink: "",
    aiDescription: {
      language: "ar",
      tone: "professional",
      generatedText: ""
    },
    advertisingLicense: "",
    advertisingLicenseStatus: 'unknown',
    whatsappNumber: "+966",
    autoHashtags: [],
    platformPath: "",
    customFeatures: [], // المميزات المخصصة القابلة للإضافة والحذف
    mediaFiles: [],
    locationDetails: {
      city: "",
      district: "",
      street: "",
      postalCode: "",
      buildingNumber: "",
      additionalNumber: "",
      latitude: 0,
      longitude: 0
    },
    useMapPicker: false,
    marketData: [],
    selectedMarketPrice: 0,
    priceComparison: 'unknown'
  });

  // 💾 استعادة البيانات المحفوظة مؤقتاً عند تحميل الصفحة
  useEffect(() => {
    const savedDraft = localStorage.getItem('property_draft_data');
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        const savedTime = parsedData.savedAt;
        const now = Date.now();
        
        // إذا كانت المسودة محفوظة منذ أقل من 7 أيام
        if (now - savedTime < 7 * 24 * 60 * 60 * 1000) {
          const shouldRestore = confirm(
            `📝 تم العثور على مسودة محفوظة!\n\n` +
            `💾 تاريخ الحفظ: ${new Date(savedTime).toLocaleString('ar-SA')}\n\n` +
            `🔄 هل تريد استعادة البيانات المحفوظة؟\n\n` +
            `✅ نعم - استعادة البيانات\n` +
            `❌ لا - البدء من جديد`
          );
          
          if (shouldRestore) {
            setPropertyData(parsedData.data);
            alert('✅ تم استعادة البيانات المحفوظة بنجاح!');
            console.log('🔄 تم استعادة المسودة:', parsedData);
          } else {
            localStorage.removeItem('property_draft_data');
          }
        } else {
          // مسح المسودات القديمة
          localStorage.removeItem('property_draft_data');
        }
      } catch (error) {
        console.error('❌ خطأ في استعادة المسودة:', error);
      }
    }
  }, []);

  // 💾 حفظ تلقائي للبيانات عند كل تغيير
  useEffect(() => {
    // التحقق من وجود بيانات مهمة
    const hasImportantData = 
      propertyData.fullName || 
      propertyData.phoneNumber || 
      propertyData.propertyType || 
      propertyData.area ||
      propertyData.mediaFiles.length > 0;
    
    if (hasImportantData) {
      const draftData = {
        data: propertyData,
        savedAt: Date.now()
      };
      
      localStorage.setItem('property_draft_data', JSON.stringify(draftData));
      console.log('💾 حفظ تلقائي للمسودة');
    }
  }, [propertyData]);

  // 🔄 التعبئة التلقائية من العروض المستقبلة
  useEffect(() => {
    const autoFillDataStr = localStorage.getItem('auto-fill-property');
    if (autoFillDataStr) {
      try {
        const autoFillData = JSON.parse(autoFillDataStr);
        console.log('✅ [property-upload-complete] تم العثور على بيانات للتعبئة التلقائية:', autoFillData);
        console.log('📦 [property-upload-complete] الصور:', autoFillData.images);
        console.log('📦 [property-upload-complete] الفيديو:', autoFillData.videos);
        console.log('📦 [property-upload-complete] mediaIds:', autoFillData.mediaIds);
        console.log('📦 [property-upload-complete] fullOfferId:', autoFillData.fullOfferId);
        console.log('📍 [property-upload-complete] المدينة:', autoFillData.city);
        console.log('📍 [property-upload-complete] الحي:', autoFillData.district);
        console.log('📍 [property-upload-complete] الموقع:', autoFillData.mapLocation);
        console.log('📜 [property-upload-complete] الترخيص الإعلاني:', autoFillData.advertisingLicense);
        
        // تعبئة جميع البيانات تلقائياً
        setPropertyData(prev => ({
          ...prev,
          // نوع العقار والتصنيف
          propertyType: autoFillData.propertyType || prev.propertyType,
          propertyCategory: autoFillData.propertyCategory || prev.propertyCategory,
          purpose: autoFillData.purpose || prev.purpose,
          category: autoFillData.propertyCategory || prev.category,
          
          // معلومات المالك الكاملة
          fullName: autoFillData.ownerName || prev.fullName,
          phoneNumber: autoFillData.ownerPhone || prev.phoneNumber,
          idNumber: autoFillData.ownerNationalId || prev.idNumber,
          birthDate: autoFillData.ownerDob || prev.birthDate,
          
          // الصك
          deedNumber: autoFillData.deedNumber || prev.deedNumber,
          deedDate: autoFillData.deedDate || prev.deedDate,
          
          // الموقع الكامل
          locationDetails: {
            ...prev.locationDetails,
            city: autoFillData.city || prev.locationDetails.city,
            district: autoFillData.district || prev.locationDetails.district,
            street: autoFillData.street || prev.locationDetails.street,
            buildingNumber: autoFillData.building || prev.locationDetails.buildingNumber,
            postalCode: autoFillData.postalCode || prev.locationDetails.postalCode,
            latitude: autoFillData.mapLocation?.lat || prev.locationDetails.latitude,
            longitude: autoFillData.mapLocation?.lng || prev.locationDetails.longitude
          },
          
          // المواصفات الأساسية
          area: autoFillData.area ? autoFillData.area.toString() : prev.area,
          
          // الأسعار
          finalPrice: autoFillData.price ? autoFillData.price.toString() : autoFillData.priceFrom ? autoFillData.priceFrom.toString() : prev.finalPrice,
          
          // الغرف والمرافق
          bedrooms: autoFillData.bedrooms || prev.bedrooms,
          bathrooms: autoFillData.bathrooms || prev.bathrooms,
          warehouses: autoFillData.storageRooms || prev.warehouses,
          balconies: autoFillData.balconies || prev.balconies,
          curtains: autoFillData.curtains || prev.curtains,
          airConditioners: autoFillData.airConditioners || prev.airConditioners,
          privateParking: autoFillData.parkingSpaces || prev.privateParking,
          floors: autoFillData.floors || prev.floors,
          
          // المواصفات الإضافية
          entranceType: autoFillData.entrances || prev.entranceType,
          propertyLocation: autoFillData.position || prev.propertyLocation,
          propertyLevel: autoFillData.level || prev.propertyLevel,
          
          // المميزات الفاخرة
          jacuzzi: autoFillData.hasJacuzzi ? 1 : prev.jacuzzi,
          rainShower: autoFillData.hasRainShower ? 1 : prev.rainShower,
          swimmingPool: autoFillData.hasPool ? 1 : prev.swimmingPool,
          garden: autoFillData.hasGarden ? 1 : prev.garden,
          elevator: autoFillData.hasElevator ? 1 : prev.elevator,
          laundryRoom: autoFillData.hasLaundryRoom ? 1 : prev.laundryRoom,
          maidsRoom: autoFillData.hasMaidRoom ? 1 : prev.maidsRoom,
          kitchenAppliances: autoFillData.kitchenWithAppliances ? 1 : prev.kitchenAppliances,
          
          // الضمانات
          warranties: autoFillData.guarantees || prev.warranties,
          
          // الوصف والمميزات
          aiDescription: {
            ...prev.aiDescription,
            generatedText: autoFillData.description || prev.aiDescription.generatedText
          },
          customFeatures: autoFillData.customFeatures || prev.customFeatures,
          
          // الجولة الافتراضية
          virtualTourLink: autoFillData.virtualTourLink || prev.virtualTourLink,
          
          // ✅ الترخيص الإعلاني
          advertisingLicense: autoFillData.advertisingLicense || prev.advertisingLicense,
          advertisingLicenseStatus: autoFillData.advertisingLicense ? 'valid' : prev.advertisingLicenseStatus
        }));
        
        // 🆕 تحميل الصور والفيديو من IndexedDB
        if (autoFillData.mediaIds && autoFillData.mediaIds.length > 0 && autoFillData.fullOfferId) {
          console.log(`📸 [property-upload-complete] محاولة تحميل ${autoFillData.mediaIds.length} ملف من IndexedDB...`);
          (async () => {
            try {
              const { getAllMediaForOffer } = await import('../utils/indexedDBStorage');
              const mediaItems = await getAllMediaForOffer(autoFillData.fullOfferId);
              console.log(`✅ [property-upload-complete] تم جلب ${mediaItems.length} ملف من IndexedDB:`, mediaItems);
              
              const images = mediaItems.filter(m => m.type === 'image').map((m, index) => ({ 
                id: `img-${index}-${Date.now()}`,
                url: m.data, 
                type: 'image' as const 
              }));
              const videos = mediaItems.filter(m => m.type === 'video').map((m, index) => ({ 
                id: `vid-${index}-${Date.now()}`,
                url: m.data, 
                type: 'video' as const 
              }));
              
              setPropertyData(prev => ({
                ...prev,
                mediaFiles: [...images, ...videos]
              }));
              console.log(`✅ [property-upload-complete] تم تعيين ${images.length} صورة و ${videos.length} فيديو إلى propertyData.mediaFiles`);
            } catch (error) {
              console.error('❌ [property-upload-complete] خطأ في تحميل الوسائط:', error);
            }
          })();
        } else if (autoFillData.images || autoFillData.videos) {
          console.log(`📸 [property-upload-complete] استخدام الصور المباشرة: ${autoFillData.images?.length || 0} صورة، ${autoFillData.videos?.length || 0} فيديو`);
          // fallback: استخدام الصور المباشرة إذا كانت موجودة
          const images = (autoFillData.images || []).map((url: string, index: number) => ({ 
            id: `img-${index}-${Date.now()}`,
            url, 
            type: 'image' as const 
          }));
          const videos = (autoFillData.videos || []).map((url: string, index: number) => ({ 
            id: `vid-${index}-${Date.now()}`,
            url, 
            type: 'video' as const 
          }));
          setPropertyData(prev => ({
            ...prev,
            mediaFiles: [...images, ...videos]
          }));
          console.log(`✅ [property-upload-complete] تم تعيين ${images.length} صورة و ${videos.length} فيديو إلى propertyData.mediaFiles (fallback)`);
        } else {
          console.warn('⚠️ [property-upload-complete] لا توجد صور أو فيديو في البيانات المستلمة');
        }
        
        // حذف البيانات بعد الاستخدام
        localStorage.removeItem('auto-fill-property');
        
        // إشعار بالنجاح
        alert('✅ تم تعبئة جميع البيانات تلقائياً من العرض المقبول!\n\n📝 يمكنك الآن مراجعة البيانات وإكمال المعلومات الناقصة إن وجدت.');
        
      } catch (error) {
        console.error('❌ خطأ في التعبئة التلقائية:', error);
      }
    }
  }, []);

  // تحديث التبويب عند تغيير initialTab
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // نظام توليد المسارات الذكي (258)
  const generateSmartPath = (data: PropertyData) => {
    if (!data.city && !data.locationDetails?.city) return null;
    
    const city = data.locationDetails?.city || data.city || '';
    const district = data.locationDetails?.district || data.neighborhood || '';
    const purpose = data.purpose?.replace('💰 ', '').replace('🏡 ', '') || '';
    const propertyType = data.propertyType || '';
    const category = data.category?.replace('🏠 ', '').replace('🏢 ', '') || '';
    
    if (city && purpose && propertyType) {
      let smartPath = `${purpose} / ${city}`;
      
      if (district) {
        smartPath += ` / ${district}`;
      }
      
      smartPath += ` / ${propertyType}`;
      
      if (category && category !== 'سكني') {
        smartPath += ` ${category}`;
      }
      
      // إضافة تفاصيل إضافية حسب المميزات
      if (data.bedrooms > 0 && propertyType === 'شقة') {
        smartPath += ` ${data.bedrooms} غرف`;
      }
      
      if (data.swimmingPool > 0 || data.gym > 0 || data.jacuzzi > 0) {
        smartPath += ' فاخر';
      }
      
      if (data.area && parseInt(data.area) > 500) {
        smartPath += ' كبير';
      }
      
      return smartPath;
    }
    
    return null;
  };

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformLinks, setPlatformLinks] = useState<{[key: string]: string}>({});
  const [platformStatus, setPlatformStatus] = useState<{[key: string]: 'idle' | 'checking' | 'available' | 'unavailable'}>({});
  
  // حالة إضافة ميزة مخصصة جديدة
  const [newCustomFeature, setNewCustomFeature] = useState("");
  
  // حالة جودة الرفع للصور والفيديو
  const [uploadQuality, setUploadQuality] = useState<'standard' | 'hd'>('standard');
  
  // 🧠 نظام الذكاء الاصطناعي لتتبع المميزات
  interface FeatureUsageStats {
    [featureName: string]: {
      count: number;        // عدد مرات الاستخدام
      lastUsed: number;     // آخر استخدام (timestamp)
      adsWithoutUsage: number; // عدد الإعلانات التي لم تُستخدم فيها
    };
  }
  
  // قاموس الميزات الأساسية للمزامنة
  const featuresDict: {[key: string]: string} = {
    'jacuzzi': 'جاكوزي',
    'swimmingPool': 'مسبح',
    'gym': 'صالة رياضية',
    'garden': 'حديقة',
    'smartLighting': 'إضاءة ذكية',
    'securitySystem': 'نظام أمني',
    'cctv': 'كاميرات مراقبة',
    'solarPanels': 'ألواح شمسية',
    'centralHeating': 'تدفئة مركزية',
    'elevator': 'مصعد',
    'maidsRoom': 'غرفة خادمة',
    'driverRoom': 'غرفة سائق'
  };
  
  // 🔥 المميزات الذكية الديناميكية
  const [dynamicFeatures, setDynamicFeatures] = useState<string[]>([]);
  
  // 🧠 دوال الذكاء الاصطناعي لإدارة المميزات
  
  // تحميل إحصائيات الاستخدام من localStorage
  const loadFeatureStats = (): FeatureUsageStats => {
    const savedStats = localStorage.getItem('featureUsageStats');
    if (savedStats) {
      try {
        return JSON.parse(savedStats);
      } catch {
        return {};
      }
    }
    return {};
  };
  
  // حفظ إحصائيات الاستخدام
  const saveFeatureStats = (stats: FeatureUsageStats) => {
    localStorage.setItem('featureUsageStats', JSON.stringify(stats));
  };
  
  // تسجيل استخدام ميزة
  const trackFeatureUsage = (featureName: string) => {
    const stats = loadFeatureStats();
    
    if (!stats[featureName]) {
      stats[featureName] = {
        count: 0,
        lastUsed: 0,
        adsWithoutUsage: 0
      };
    }
    
    stats[featureName].count += 1;
    stats[featureName].lastUsed = Date.now();
    stats[featureName].adsWithoutUsage = 0; // إعادة تعيين العداد
    
    saveFeatureStats(stats);
  };
  
  // زيادة عداد "الإعلانات بدون استخدام" لكل الميزات غير المستخدمة
  const incrementAdsWithoutUsage = (usedFeatures: string[]) => {
    const stats = loadFeatureStats();
    
    Object.keys(stats).forEach(featureName => {
      if (!usedFeatures.includes(featureName)) {
        stats[featureName].adsWithoutUsage += 1;
      }
    });
    
    saveFeatureStats(stats);
  };
  
  // تنظيف المميزات غير المستخدمة (بعد 11 إعلان)
  const cleanupUnusedFeatures = () => {
    const stats = loadFeatureStats();
    const featuresToRemove: string[] = [];
    
    Object.entries(stats).forEach(([featureName, data]) => {
      if (data.adsWithoutUsage >= 11) {
        featuresToRemove.push(featureName);
      }
    });
    
    // حذف المميزات غير المستخدمة
    featuresToRemove.forEach(featureName => {
      delete stats[featureName];
    });
    
    saveFeatureStats(stats);
    return featuresToRemove;
  };
  
  // الحصول على المميزات الشائعة (استخدمت 3 مرات أو أكثر)
  const getPopularFeatures = (): string[] => {
    const stats = loadFeatureStats();
    const popularFeatures: string[] = [];
    
    Object.entries(stats).forEach(([featureName, data]) => {
      if (data.count >= 3 && data.adsWithoutUsage < 5) {
        popularFeatures.push(featureName);
      }
    });
    
    return popularFeatures;
  };
  
  // تحديث المميزات الديناميكية
  const updateDynamicFeatures = () => {
    const popular = getPopularFeatures();
    const baseFeatureValues = Object.values(featuresDict);
    
    // إضافة المميزات الشائعة التي ليست في القائمة الأساسية
    const newDynamicFeatures = popular.filter(
      feature => !baseFeatureValues.includes(feature)
    );
    
    setDynamicFeatures(newDynamicFeatures);
  };
  
  // تحميل المميزات المحفوظة من localStorage عند بدء التشغيل
  useEffect(() => {
    const savedFeatures = localStorage.getItem('customPropertyFeatures');
    if (savedFeatures) {
      try {
        const features = JSON.parse(savedFeatures);
        setPropertyData(prev => {
          const updatedData = { ...prev, customFeatures: features };
          
          // مزامنة المميزات المحفوظة مع الأزرار الأساسية
          Object.entries(featuresDict).forEach(([key, value]) => {
            if (features.includes(value)) {
              updatedData[key] = 1;
            }
          });
          
          return updatedData;
        });
      } catch (error) {
        console.error('خطأ في تحميل المميزات المحفوظة:', error);
      }
    }
    
    // تحديث المميزات الديناميكية
    updateDynamicFeatures();
    
    // تنظيف المميزات غير المستخدمة
    const removed = cleanupUnusedFeatures();
    if (removed.length > 0) {
      console.log('🧹 تم حذف المميزات غير المستخدمة:', removed);
    }
  }, []);
  
  // حفظ المميزات في localStorage كلما تغيرت
  useEffect(() => {
    if (propertyData.customFeatures && propertyData.customFeatures.length > 0) {
      localStorage.setItem('customPropertyFeatures', JSON.stringify(propertyData.customFeatures));
    }
  }, [propertyData.customFeatures]);

  // منصات العقارات المحدثة مع API
  const platforms: Platform[] = [
    { id: "wasalt", name: "وصلت", color: "#2E7D32", status: "✅", isConnected: false },
    { id: "deel", name: "ديل", color: "#FF6F00", status: "⏳", isConnected: false },
    { id: "aqar", name: "عقار", color: "#1976D2", status: "✅", isConnected: false },
    { id: "haraj", name: "حراج", color: "#7B1FA2", status: "❌", isConnected: false },
    { id: "sanadak", name: "سندك", color: "#D32F2F", status: "✅", isConnected: false },
    { id: "muktamal", name: "مكتمل", color: "#388E3C", status: "⏳", isConnected: false },
    { id: "dhaki", name: "ذكي", color: "#00796B", status: "✅", isConnected: false },
    { id: "aqaryoun", name: "عقاريون", color: "#E65100", status: "❌", isConnected: false },
    { id: "nozol", name: "نزل", color: "#FF5722", status: "✅", isConnected: false },
    { id: "larat", name: "لارات", color: "#3F51B5", status: "⏳", isConnected: false },
    { id: "bayut", name: "بيوت", color: "#795548", status: "✅", isConnected: false }
  ];

  // مصادر بيانات السوق العقاري
  const marketSources = [
    {
      name: "عقار ساس",
      url: "https://aqarsaas.com",
      apiEndpoint: "/api/market-data"
    },
    {
      name: "موقع عقار",
      url: "https://sa.aqar.fm/",
      apiEndpoint: "/api/prices"
    },
    {
      name: "البورصة العقارية", 
      url: "https://realestate-market.sa",
      apiEndpoint: "/api/market-analysis"
    }
  ];

  const propertyTypes = ["شقة", "فيلا", "عمارة", "أرض", "محل تجاري", "مكتب", "مستودع"];
  const categories = ["🏠 سكني", "🏢 تجاري"];
  const purposes = ["💰 للبيع", "🏡 للإيجار"];
  const entranceTypes = ["شارع رئيسي", "شارع فرعي", "طريق داخلي"];
  const propertyLevels = ["الأرضي", "الأول", "الثاني", "الثالث", "الرابع", "الخامس فما فوق"];

  const warrantyTypes = [
    "العيوب الخفية", "السخانات", "الأبواب", "المنيوم النوافذ والأبواب",
    "الأدوات الصحية المغاسل والمراحيض", "كهرباء", "سباكة", "مكيفات", "عام", "أخرى"
  ];

  const warrantyDurations = ["5 سنوات", "10 سنوات", "15 سنة", "أخرى"];

  // تحديث الهاشتاقات التلقائية
  useEffect(() => {
    const tags = [];
    if (propertyData.propertyType) tags.push(`#${propertyData.propertyType}`);
    if (propertyData.purpose) tags.push(`#${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')}`);
    if (propertyData.propertyLocation) tags.push(`#${propertyData.propertyLocation}`);
    if (propertyData.bedrooms > 0) tags.push(`#${propertyData.bedrooms}غرف`);
    if (propertyData.area) tags.push(`#${propertyData.area}متر`);
    if (propertyData.warranties.length > 0) {
      propertyData.warranties.forEach(w => tags.push(`#${w.type.replace(/\s+/g, '_')}`));
    }
    
    // إضافة هاشتاقات المميزات الفاخرة
    if (propertyData.jacuzzi > 0) tags.push('#جاكوزي');
    if (propertyData.rainShower > 0) tags.push('#دش_مطري');
    if (propertyData.swimmingPool > 0) tags.push('#مسبح');
    if (propertyData.gym > 0) tags.push('#صالة_رياضية');
    if (propertyData.garden > 0) tags.push('#حديقة');
    if (propertyData.smartLighting > 0) tags.push('#إضاءة_ذكية');
    if (propertyData.securitySystem > 0) tags.push('#نظام_أمني');
    if (propertyData.elevator > 0) tags.push('#مصعد');
    if (propertyData.solarPanels > 0) tags.push('#طاقة_شمسية');
    
    setPropertyData(prev => ({ ...prev, autoHashtags: tags }));
  }, [
    propertyData.propertyType, propertyData.purpose, propertyData.propertyLocation, 
    propertyData.bedrooms, propertyData.warranties, propertyData.area,
    propertyData.jacuzzi, propertyData.rainShower, propertyData.swimmingPool,
    propertyData.gym, propertyData.garden, propertyData.smartLighting,
    propertyData.securitySystem, propertyData.elevator, propertyData.solarPanels
  ]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: MediaFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      newFiles.push({
        id: Date.now() + i + '',
        type,
        url,
        isPrimary: propertyData.mediaFiles.length === 0 && i === 0
      });
    }
    
    setPropertyData(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...newFiles].slice(0, 11) // 10 صور + 1 فيديو
    }));
  };

  const setPrimaryImage = (id: string) => {
    setPropertyData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.map(file => ({
        ...file,
        isPrimary: file.id === id
      }))
    }));
  };

  const removeFile = (id: string) => {
    setPropertyData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter(file => file.id !== id)
    }));
  };

  const addWarranty = () => {
    const newWarranty: Warranty = {
      id: Date.now() + '',
      type: "",
      duration: "",
      notes: ""
    };
    setPropertyData(prev => ({
      ...prev,
      warranties: [...prev.warranties, newWarranty]
    }));
  };

  // دوال إدارة المميزات المخصصة - محسنة مع localStorage والذكاء الاصطناعي
  const addCustomFeature = () => {
    const trimmedFeature = newCustomFeature.trim();
    if (!trimmedFeature) return;
    
    // تجنب التكرار
    if (propertyData.customFeatures.includes(trimmedFeature)) {
      setNewCustomFeature("");
      return;
    }
    
    const updatedFeatures = [...propertyData.customFeatures, trimmedFeature];
    setPropertyData(prev => ({
      ...prev,
      customFeatures: updatedFeatures
    }));
    
    // حفظ في localStorage
    localStorage.setItem('customPropertyFeatures', JSON.stringify(updatedFeatures));
    
    // 🧠 تتبع الاستخدام بالذكاء الاصطناعي
    trackFeatureUsage(trimmedFeature);
    
    // 🔥 إضافة الميزة للقائمة الديناميكية مباشرة
    if (!dynamicFeatures.includes(trimmedFeature)) {
      setDynamicFeatures(prev => {
        const newList = [...prev, trimmedFeature];
        console.log('✅ تمت إضافة ميزة جديدة:', trimmedFeature);
        console.log('📋 القائمة الديناميكية الحالية:', newList);
        return newList;
      });
    }
    
    setNewCustomFeature("");
  };

  const removeCustomFeature = (featureToRemove: string) => {
    const updatedFeatures = propertyData.customFeatures.filter(f => f !== featureToRemove);
    setPropertyData(prev => ({
      ...prev,
      customFeatures: updatedFeatures
    }));
    
    // حفظ في localStorage
    localStorage.setItem('customPropertyFeatures', JSON.stringify(updatedFeatures));
    
    // إلغاء تفعيل الميزة في القائمة الأساسية إذا كانت موجودة
    Object.entries(featuresDict).forEach(([key, value]) => {
      if (value === featureToRemove) {
        setPropertyData(prev => ({ ...prev, [key]: 0 }));
      }
    });
    
    // 🗑️ حذف من المميزات الديناميكية أيضاً
    setDynamicFeatures(prev => prev.filter(f => f !== featureToRemove));
  };

  // 📢 حفظ الإعلان المنشور وربطه بالمالك
  const handlePublishAndSaveAd = async () => {
    if (!propertyData.fullName || !propertyData.phoneNumber) {
      alert('يرجى إدخال اسم المالك ورقم الجوال على الأقل');
      return null;
    }

    try {
      const adNumber = generateAdNumber();
      const publishedPlatforms = platforms
        .filter(p => selectedPlatforms.includes(p.id))
        .map(p => ({
          id: p.id,
          name: p.name,
          status: 'published' as const,
          publishedAt: new Date(),
          adUrl: platformLinks[p.id] || undefined
        }));

      const publishedAd: PublishedAd = {
        id: Date.now().toString(),
        adNumber,
        ownerPhone: propertyData.phoneNumber,
        ownerName: propertyData.fullName,
        ownerId: `owner-${Date.now()}`,
        title: `${propertyData.purpose} ${propertyData.propertyType}`,
        description: propertyData.aiDescription.generatedText || '',
        propertyType: propertyData.propertyType,
        purpose: propertyData.purpose,
        price: propertyData.finalPrice,
        area: propertyData.area,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        location: {
          city: propertyData.locationDetails.city,
          district: propertyData.locationDetails.district,
          street: propertyData.locationDetails.street,
          postalCode: propertyData.locationDetails.postalCode,
          buildingNumber: propertyData.locationDetails.buildingNumber,
          additionalNumber: propertyData.locationDetails.additionalNumber,
          latitude: propertyData.locationDetails.latitude,
          longitude: propertyData.locationDetails.longitude,
          nationalAddress: undefined
        },
        idNumber: propertyData.idNumber,
        idIssueDate: propertyData.idIssueDate,
        idExpiryDate: propertyData.idExpiryDate,
        deedNumber: propertyData.deedNumber,
        deedDate: propertyData.deedDate,
        deedIssuer: propertyData.deedIssuer,
        mediaFiles: propertyData.mediaFiles.map(m => ({
          id: m.id,
          url: m.url,
          type: m.type,
          name: `media-${m.id}`
        })),
        publishedPlatforms,
        hashtags: propertyData.autoHashtags,
        platformPath: propertyData.platformPath,
        advertisingLicense: propertyData.advertisingLicense,
        advertisingLicenseStatus: propertyData.advertisingLicenseStatus,
        aiGeneratedDescription: propertyData.aiDescription.generatedText,
        aiLanguage: propertyData.aiDescription.language,
        aiTone: propertyData.aiDescription.tone,
        createdAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
        virtualTourLink: propertyData.virtualTourLink,
        whatsappNumber: propertyData.whatsappNumber,
        warranties: propertyData.warranties,
        customFeatures: propertyData.customFeatures,
        stats: {
          views: 0,
          requests: 0,
          likes: 0,
          shares: 0
        },
        status: 'published',  // 🌐 منشور مباشرة على منصتي!
        notes: '',
        propertyCategory: propertyData.propertyCategory || 'سكني', // 🆕 التصنيف الذكي
        smartPath: undefined // 🆕 سيتم توليده تلقائياً
      };

      // 🆕 توليد المسار الذكي
      const { generateSmartPath } = await import('../utils/publishedAds');
      publishedAd.smartPath = generateSmartPath(publishedAd);

      // حفظ الإعلان في نظام الإعلانات المنشورة (مع فحص التكرار)
      const saveResult = savePublishedAd(publishedAd);
      
      // ✅ التحقق من نتيجة الحفظ
      if (!saveResult.success) {
        // الإعلان مكرر 100% - لا نحفظه
        alert(saveResult.message);
        return null;
      }
      
      // 🔗 إنشاء/تحديث بطاقة العميل تلقائياً
      const customer = ensureCustomerExists({
        phone: propertyData.phoneNumber,
        name: propertyData.fullName,
        idNumber: propertyData.idNumber,
        birthDate: propertyData.birthDate,
        category: 'مالك',
        source: 'إعلان منشور',
        notes: propertyData.aiDescription.generatedText,
        whatsapp: propertyData.whatsappNumber || propertyData.phoneNumber,
        mediaFiles: propertyData.mediaFiles.map(m => ({
          id: m.id,
          type: m.type as 'image' | 'video' | 'document',
          url: m.url,
          uploadedAt: new Date().toISOString()
        }))
      });
      
      console.log('✅ تم إنشاء/تحديث بطاقة العميل:', customer.id, customer.name);
      
      // إطلاق حدث تحديث العروض
      window.dispatchEvent(new Event('offersUpdated'));
      window.dispatchEvent(new Event('publishedAdSaved'));
      window.dispatchEvent(new CustomEvent('customersUpdated'));
      
      console.log('✅ تم حفظ الإعلان المنشور:', adNumber);
      console.log('✅ تم إنشاء/تحديث بطاقة العميل:', customer.id, customer.name);
      
      return publishedAd;
    } catch (error) {
      console.error('❌ خطأ في حفظ الإعلان:', error);
      alert('حدث خطأ أثناء حفظ الإعلان');
      return null;
    }
  };
  
  // 📢 تسجيل نشر إعلان جديد
  const handleAdPublish = () => {
    // الحصول على المميزات المستخدمة في الإعلان الحالي
    const usedFeatures = propertyData.customFeatures;
    
    // تحديث عداد "الإ��لانا�� بدون استخدام" للمميزات غير المستخدمة
    incrementAdsWithoutUsage(usedFeatures);
    
    // تنظيف المميزات غير المستخدمة بعد 11 إعلان
    const removedFeatures = cleanupUnusedFeatures();
    
    if (removedFeatures.length > 0) {
      console.log('🧹 تم حذف المميزات التالية تلقائياً (لم تستخدم في آخر 11 إعلان):', removedFeatures);
      
      // إشعار للمستخدم (اختياري)
      // alert(`تم حذف ${removedFeatures.length} ميزة غير مستخدمة تلقائياً`);
    }
    
    // تحديث المميزات الديناميكية
    updateDynamicFeatures();
  };

  // 🚀 نشر الإعلان (الدالة الرئيسية المطلوبة)
  const handlePublish = async () => {
    // التحقق من البيانات الأساسية
    if (!propertyData.fullName || !propertyData.phoneNumber) {
      alert('⚠️ يرجى إدخال اسم المالك ورقم الجوال على الأقل');
      return;
    }

    // ✅ لا نشترط اختيار منصات - يمكن الحفظ بدون منصات
    // الإعلان سيُحفظ في لوحة التحكم على كل حال

    setIsUploading(true);

    try {
      // محاكاة عملية النشر
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 1️⃣ البحث عن العميل أو إنشائه
      const existingCustomer = ensureCustomerExists({
        phone: propertyData.phoneNumber,
        name: propertyData.fullName,
        idNumber: propertyData.idNumber,
        birthDate: propertyData.birthDate,
        category: 'مالك',
        source: 'إعلان منشور',
        whatsapp: propertyData.whatsappNumber || propertyData.phoneNumber
      });

      const isNewCustomer = !existingCustomer.linkedAdsCount || existingCustomer.linkedAdsCount <= 1;

      // 2️⃣ حفظ الإعلان في نظام الإعلانات المنشورة
      const adNumber = generateAdNumber();
      const publishedPlatforms = platforms
        .filter(p => selectedPlatforms.includes(p.id))
        .map(p => ({
          id: p.id,
          name: p.name,
          status: 'published' as const,
          publishedAt: new Date(),
          adUrl: platformLinks[p.id] || undefined
        }));

      const publishedAd: PublishedAd = {
        id: Date.now().toString(),
        adNumber,
        ownerPhone: propertyData.phoneNumber,
        ownerName: propertyData.fullName,
        ownerId: existingCustomer.id,
        title: `${propertyData.purpose} ${propertyData.propertyType}`,
        description: propertyData.aiDescription.generatedText || '',
        propertyType: propertyData.propertyType,
        purpose: propertyData.purpose,
        price: propertyData.finalPrice,
        area: propertyData.area,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        location: {
          city: propertyData.locationDetails?.city || '',
          district: propertyData.locationDetails?.district || '',
          street: propertyData.locationDetails?.street || '',
          postalCode: propertyData.locationDetails?.postalCode || '',
          buildingNumber: propertyData.locationDetails?.buildingNumber || '',
          additionalNumber: propertyData.locationDetails?.additionalNumber || '',
          latitude: propertyData.locationDetails?.latitude || 0,
          longitude: propertyData.locationDetails?.longitude || 0
        },
        idNumber: propertyData.idNumber,
        idIssueDate: propertyData.idIssueDate,
        idExpiryDate: propertyData.idExpiryDate,
        deedNumber: propertyData.deedNumber,
        deedDate: propertyData.deedDate,
        deedIssuer: propertyData.deedIssuer,
        mediaFiles: propertyData.mediaFiles.map(m => ({
          id: m.id,
          url: m.url,
          type: m.type,
          name: `media-${m.id}`
        })),
        publishedPlatforms,
        hashtags: propertyData.autoHashtags,
        platformPath: propertyData.platformPath,
        advertisingLicense: propertyData.advertisingLicense,
        advertisingLicenseStatus: propertyData.advertisingLicenseStatus || 'unknown',
        aiGeneratedDescription: propertyData.aiDescription.generatedText,
        aiLanguage: propertyData.aiDescription.language,
        aiTone: propertyData.aiDescription.tone,
        createdAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date(),
        virtualTourLink: propertyData.virtualTourLink,
        whatsappNumber: propertyData.whatsappNumber,
        warranties: propertyData.warranties,
        customFeatures: propertyData.customFeatures,
        stats: {
          views: 0,
          requests: 0,
          likes: 0,
          shares: 0
        },
        status: 'published',  // 🌐 منشور مباشرة على منصتي!
        notes: '',
        propertyCategory: propertyData.propertyCategory || 'سكني', // 🆕 التصنيف الذكي
        smartPath: undefined // 🆕 سيتم توليده تلقائياً
      };

      // 🆕 توليد المسار الذكي
      const { generateSmartPath: genPath } = await import('../utils/publishedAds');
      publishedAd.smartPath = genPath(publishedAd);

      // حفظ الإعلان (مع فحص التكرار)
      const saveResult = savePublishedAd(publishedAd);
      
      // ✅ التحقق من نتيجة الحفظ
      if (!saveResult.success) {
        // الإعلان مكرر 100% - لا نحفظه
        setIsUploading(false);
        alert(saveResult.message);
        return;
      }
      
      // 🔍 تأكيد الحالة للتشخيص
      console.log('🔍 ==================== تأكيد حفظ الإعلان ====================');
      console.log('✅ تم حفظ الإعلان بنجاح:', {
        adNumber,
        status: publishedAd.status,  // يجب أن تكون 'published' مباشرة!
        city: publishedAd.location.city,
        ownerName: publishedAd.ownerName
      });
      console.log('📊 الحالة: "published" (منشور مباشرة على منصتي)');
      console.log('✅ الإعلان جاهز للعرض على الجمهور فوراً!');
      console.log('🔍 ==========================================================');

      // 3️⃣ إطلاق الأحداث لتحديث لوحة التحكم ومنصتي
      window.dispatchEvent(new Event('offersUpdated'));
      window.dispatchEvent(new Event('publishedAdSaved'));
      window.dispatchEvent(new CustomEvent('customersUpdated'));
      console.log('📡 تم إطلاق الأحداث: offersUpdated, publishedAdSaved, customersUpdated');

      // 4️⃣ إنشاء الإشعارات
      // إشعار العميل
      if (isNewCustomer) {
        notifyNewCustomer({
          id: existingCustomer.id,
          name: propertyData.fullName,
          phone: propertyData.phoneNumber,
          adNumber
        });
      } else {
        notifyCustomerUpdated({
          id: existingCustomer.id,
          name: propertyData.fullName,
          phone: propertyData.phoneNumber,
          adNumber
        });
      }

      // إشعار الإعلان المنشور
      notifyAdPublished({
        adNumber,
        ownerName: propertyData.fullName,
        ownerPhone: propertyData.phoneNumber,
        customerId: existingCustomer.id,
        platformsCount: publishedPlatforms.length
      });

      // 5️⃣ عرض الرسائل المنبثقة
      const customerMessage = isNewCustomer 
        ? '✅ تم إضافة عميل جديد في إدارة العملاء'
        : '🔄 تم إضافة معلومات إلى اسم العميل';

      const platformsInfo = publishedPlatforms.length > 0 
        ? `المنصات المختارة: ${publishedPlatforms.length} منصة`
        : '📝 لم يتم اختيار منصات (سيتم حفظ الإعلان في لوحة التحكم فقط)';

      const successMessage = `
${customerMessage}

🌐 تم نشر الإعلان على منصتك بنجاح!

رقم الإعلان: ${adNumber}
المالك: ${propertyData.fullName}
الجوال: ${propertyData.phoneNumber}
${platformsInfo}

✨ الإعلان الآن معروض في:
• منصتي (الموقع العام - متاح للجمهور)
• لوحة التحكم (يمكنك إدارته من هناك)
• إدارة العملاء (بطاقة المالك)

💡 تم إضافة إشعار - اضغط عليه للانتقال إلى بطاقة العميل

✅ الإعلان جاهز ومعروض للجمهور الآن!
      `.trim();

      alert(successMessage);

      console.log('✅ نشر ناجح:', {
        ad: publishedAd,
        customer: existingCustomer,
        isNew: isNewCustomer
      });

      setIsUploading(false);

      // تسجيل نشر الإعلان في النظام
      handleAdPublish();
      
      // ✅ الانتقال التلقائي للوحة التحكم لعرض الإعلان المنشور
      setTimeout(() => {
        console.log('🔄 الانتقال للوحة التحكم...');
        // إطلاق حدث للانتقال للوحة التحكم
        window.dispatchEvent(new CustomEvent('navigateToPage', { 
          detail: 'dashboard' 
        }));
        // تحديد التبويب على "لوحة التحكم"
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('switchToDashboardTab'));
        }, 200);
      }, 1000);

    } catch (error) {
      console.error('❌ خطأ في نشر الإعلان:', error);
      alert('❌ حدث خطأ أثناء نشر الإعلان. يرجى المحاولة مرة أخرى.');
      setIsUploading(false);
    }
  };
  
  // دالة لتبديل الميزة الأساسية مع إضافتها للمميزات المخصصة + الذكاء الاصطناعي
  const toggleBasicFeature = (key: string, label: string) => {
    const isActive = propertyData[key] > 0;
    
    setPropertyData(prev => ({ 
      ...prev, 
      [key]: isActive ? 0 : 1 
    }));
    
    // إضافة أو إزالة من المميزات المخصصة
    if (!isActive) {
      // تفعيل الميزة → إضافتها للمميزات المخصصة
      if (!propertyData.customFeatures.includes(label)) {
        const updatedFeatures = [...propertyData.customFeatures, label];
        setPropertyData(prev => ({
          ...prev,
          customFeatures: updatedFeatures
        }));
        localStorage.setItem('customPropertyFeatures', JSON.stringify(updatedFeatures));
        
        // 🧠 تتبع الاستخدام
        trackFeatureUsage(label);
      }
    } else {
      // إلغاء التفعيل → إزالتها من المميزات المخصصة
      const updatedFeatures = propertyData.customFeatures.filter(f => f !== label);
      setPropertyData(prev => ({
        ...prev,
        customFeatures: updatedFeatures
      }));
      localStorage.setItem('customPropertyFeatures', JSON.stringify(updatedFeatures));
    }
    
    // تحديث المميزات الديناميكية
    updateDynamicFeatures();
  };

  const updateWarranty = (id: string, field: keyof Warranty, value: string) => {
    setPropertyData(prev => ({
      ...prev,
      warranties: prev.warranties.map(w => 
        w.id === id ? { ...w, [field]: value } : w
      )
    }));
  };

  const removeWarranty = (id: string) => {
    setPropertyData(prev => ({
      ...prev,
      warranties: prev.warranties.filter(w => w.id !== id)
    }));
  };

  const updateCounter = (field: string, increment: boolean) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: Math.max(field === 'floors' ? 1 : 0, prev[field] + (increment ? 1 : -1))
    }));
  };

  // قاموس ترجمة شامل للمصطلحات العقارية
  const translateTerms = {
    // أنواع العقارات
    "شقة": "apartment",
    "فيلا": "villa", 
    "عمارة": "building",
    "أرض": "land",
    "محل تجاري": "commercial shop",
    "مكتب": "office",
    "مستودع": "warehouse",
    
    // المدن والأحياء
    "الرياض": "Riyadh",
    "جدة": "Jeddah", 
    "الدمام": "Dammam",
    "الخبر": "Al-Khobar",
    "مكة المكرمة": "Makkah",
    "المدينة المنورة": "Madinah",
    "الطائف": "Taif",
    "النرجس": "Al-Narjis",
    "الشراع": "Al-Shira",
    "الملقا": "Al-Malqa",
    "العليا": "Al-Olaya",
    "الحمراء": "Al-Hamra",
    
    // المميزات والضمانات الأساسية
    "مخازن": "storage rooms",
    "شرفات": "balconies",
    "ستائر": "curtains", 
    "مكيفات": "air conditioners",
    "مواقف خاصة": "private parking spaces",
    "طوابق": "floors",
    
    // المميزات الفاخرة والحديثة
    "جاكوزي": "jacuzzi",
    "دش مطري": "rain shower",
    "إضاءة ذكية": "smart lighting",
    "ألواح شمسية": "solar panels",
    "نظام أمني": "security system",
    "تدفئة مركزية": "central heating",
    "مسبح": "swimming pool",
    "صالة رياضية": "gym",
    "حديقة": "garden",
    "مصعد": "elevator",
    "مولد كهرباء": "generator",
    "انتركوم": "intercom",
    "كاميرات مراقبة": "CCTV cameras",
    "إنذار حريق": "fire alarm",
    "أجهزة مطبخ": "kitchen appliances",
    "خزائن مدمجة": "built-in wardrobes",
    "أرضية سيراميك": "ceramic flooring",
    "أرضية رخام": "marble flooring",
    "أرضية باركيه": "parquet flooring",
    "جدران مدهونة": "painted walls",
    "ورق جدران": "wallpaper",
    "عازل صوت": "soundproofing",
    "عازل حراري": "thermal insulation",
    "عازل مائي": "waterproofing",
    "فايبر أوبتك": "fiber optic",
    "طبق استقبال": "satellite dish",
    "غرفة غسيل": "laundry room",
    "غرفة خادمة": "maid's room",
    "غرفة سائق": "driver's room",
    "غرفة ضيوف": "guest room",
    "مكتب": "office",
    "مكتبة": "library",
    "غرفة ألعاب": "playroom",
    "غرفة تخزين": "storage room",
    "قبو": "basement",
    "علية": "attic",
    "تراس": "terrace",
    "فناء": "patio",
    "منطقة شواء": "barbecue area",
    "العيوب الخفية": "Hidden defects warranty",
    "ضم��ن العيوب الخفية": "Hidden defects warranty",
    "العيوب الخفيه": "Hidden defects warranty",
    "ضمان العيوب الخفيه": "Hidden defects warranty",
    "كهرباء": "Electrical systems warranty",
    "ضمان كهرباء": "Electrical systems warranty",
    "سباكة": "Plumbing warranty",
    "سباكه": "Plumbing warranty", 
    "ضمان سباكة": "Plumbing warranty",
    "ضمان سباكه": "Plumbing warranty",
    "مكيفات": "Air conditioning warranty",
    "ضمان مكيفات": "Air conditioning warranty",
    "السخانات": "Water heater warranty",
    "ضمان السخانات": "Water heater warranty",
    "الأبواب": "Doors warranty",
    "ضمان الأبواب": "Doors warranty",
    "المنيوم النوافذ والأبواب": "Aluminum windows and doors warranty",
    "الأدوات الصحية المغاسل والمراحيض": "Bathroom fixtures warranty",
    "عام": "General warranty",
    "ضمان عام": "General warranty",
    "أخرى": "Other warranty",
    
    // الأرقام والمدد
    "1": "1",
    "2": "2", 
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "15": "15",
    "5 سنوات": "5 years",
    "10 سنوات": "10 years", 
    "15 سنة": "15 years",
    "سنه": "years",
    "سنوات": "years"
  };

  const generateAIDescription = () => {
    const { 
      purpose, propertyType, propertyLocation, area, bedrooms, bathrooms,
      warehouses, balconies, curtains, airConditioners, privateParking, floors,
      warranties, finalPrice, advertisingLicense, whatsappNumber, locationDetails,
      city, neighborhood
    } = propertyData;
    const { language, tone } = propertyData.aiDescription;
    
    let arabicDescription = "";
    let englishDescription = "";
    
    // استخراج معلومات الموقع المحدثة
    const cityInfo = locationDetails?.city || city || '';
    const districtInfo = locationDetails?.district || neighborhood || '';
    const areaInfo = locationDetails?.area || area || '';
    
    // بناء الوصف العربي
    if (purpose && propertyType) {
      const purposeText = purpose.replace('💰 ', '').replace('🏡 ', '');
      
      if (tone === "professional") {
        arabicDescription = `🏡 ${purposeText}: ${propertyType} سكني مميز بتصميم عصري\n\n`;
        
        // الموقع المحدث مع الحي والمدينة
        if (cityInfo || districtInfo || propertyLocation) {
          arabicDescription += `📍 الموقع: `;
          if (cityInfo) arabicDescription += cityInfo;
          if (districtInfo) arabicDescription += `${cityInfo ? ' - حي ' : 'حي '}${districtInfo}`;
          if (propertyLocation && !cityInfo && !districtInfo) arabicDescription += propertyLocation;
          if (cityInfo && cityInfo.includes('الرياض')) arabicDescription += ' - العاصمة النابضة بالحياة';
          arabicDescription += `\n`;
        }
        
        // المساحة المحدثة
        if (areaInfo) {
          arabicDescription += `📐 المساحة: ${areaInfo} متر مربع - مساحة واسعة ومريحة\n`;
          arabicDescription += `📐 المساحة: ${area} متر مربع - مساحة واسعة ومريحة\n`;
        }
        if (bedrooms > 0 || bathrooms > 0) {
          arabicDescription += `🏠 التفاصيل: `;
          if (bedrooms > 0) arabicDescription += `${bedrooms} غرف نوم فسيحة`;
          if (bathrooms > 0) arabicDescription += `${bedrooms > 0 ? ' • ' : ''}${bathrooms} دورات مياه بتجهيزات عصرية`;
          arabicDescription += `\n\n`;
        }
      } else if (tone === "marketing") {
        arabicDescription = `🏡 ${purposeText}: ${propertyType} رائع لا يُقاوم! 🌟\n\n`;
        
        // الموقع التسويقي مع الحي والمدينة
        if (cityInfo || districtInfo || propertyLocation) {
          arabicDescription += `📍 `;
          if (cityInfo) arabicDescription += cityInfo;
          if (districtInfo) arabicDescription += `${cityInfo ? ' - حي ' : 'حي '}${districtInfo}`;
          if (propertyLocation && !cityInfo && !districtInfo) arabicDescription += propertyLocation;
          arabicDescription += ` - الموقع الأكثر طلباً في المنطقة! 🔥\n`;
        }
        
        // المساحة التسويقية
        if (areaInfo) {
          arabicDescription += `📐 ${areaInfo} م² من المساحة الفاخرة والراحة المطلقة! ✨\n`;
        }
        if (bedrooms > 0 || bathrooms > 0) {
          arabicDescription += `🏠 `;
          if (bedrooms > 0) arabicDescription += `${bedrooms} غرف نوم أحلامك 🛏️`;
          if (bathrooms > 0) arabicDescription += `${bedrooms > 0 ? ' • ' : ''}${bathrooms} دورات مياه فاخرة 🚿`;
          arabicDescription += `\n\n`;
        }
      } else if (tone === "luxury") {
        arabicDescription = `🏛️ ${purposeText}: ${propertyType} استثنائي بمستوى عالمي\n\n`;
        
        // الموقع الفاخر مع الحي والمدينة
        if (cityInfo || districtInfo || propertyLocation) {
          arabicDescription += `📍 `;
          if (cityInfo) arabicDescription += cityInfo;
          if (districtInfo) arabicDescription += `${cityInfo ? ' - حي ' : 'حي '}${districtInfo}`;
          if (propertyLocation && !cityInfo && !districtInfo) arabicDescription += propertyLocation;
          arabicDescription += ` - أرقى المواقع وأكثرها تميزاً\n`;
        }
        
        // المساحة الفاخرة
        if (areaInfo) {
          arabicDescription += `📐 ${areaInfo} متر مربع من الفخامة والرقي\n`;
        }
        if (bedrooms > 0 || bathrooms > 0) {
          arabicDescription += `🏠 تصميم راقي: `;
          if (bedrooms > 0) arabicDescription += `${bedrooms} أجنحة فاخرة`;
          if (bathrooms > 0) arabicDescription += `${bedrooms > 0 ? ' • ' : ''}${bathrooms} دورات مياه بتجهيزات إيطالية`;
          arabicDescription += `\n\n`;
        }
      }
      
      // إضافة ��لمميزات الخاصة (الأساسية والفاخرة)
      const features = [];
      // المميزات الأساسية
      if (warehouses > 0) features.push(`${warehouses} مخازن`);
      if (balconies > 0) features.push(`${balconies} شرفات بإطلالة جميلة`);
      if (curtains > 0) features.push(`${curtains} ستائر`);
      if (airConditioners > 0) features.push(`${airConditioners} مكيفات توفير في الكهرباء`);
      if (privateParking > 0) features.push(`${privateParking} مواقف خاصة محمية`);
      if (floors > 1) features.push(`${floors} طوابق`);
      
      // المميزات الفاخرة والحديثة
      if (propertyData.jacuzzi > 0) features.push(`${propertyData.jacuzzi} جاكوزي فاخر`);
      if (propertyData.rainShower > 0) features.push(`${propertyData.rainShower} دش مطري عصري`);
      if (propertyData.swimmingPool > 0) features.push(`${propertyData.swimmingPool} مسبح خاص`);
      if (propertyData.gym > 0) features.push(`${propertyData.gym} صالة رياضية مجهزة`);
      if (propertyData.garden > 0) features.push(`${propertyData.garden} حديقة منسقة`);
      if (propertyData.smartLighting > 0) features.push(`${propertyData.smartLighting} إضاءة ذكية`);
      if (propertyData.securitySystem > 0) features.push(`${propertyData.securitySystem} ��ظام أمني متطور`);
      if (propertyData.centralHeating > 0) features.push(`${propertyData.centralHeating} تدفئة مركزية`);
      if (propertyData.solarPanels > 0) features.push(`${propertyData.solarPanels} ألواح شمسية للطاقة المتجددة`);
      if (propertyData.elevator > 0) features.push(`${propertyData.elevator} مصعد حديث`);
      if (propertyData.cctv > 0) features.push(`${propertyData.cctv} كاميرات مراقبة`);
      if (propertyData.intercom > 0) features.push(`${propertyData.intercom} نظام انتركوم`);
      if (propertyData.fireAlarm > 0) features.push(`${propertyData.fireAlarm} جهاز إنذار حريق`);
      if (propertyData.generator > 0) features.push(`${propertyData.generator} مولد كهرباء احتياطي`);
      if (propertyData.fiberOptic > 0) features.push(`${propertyData.fiberOptic} إنترنت فايبر أوبتك`);
      
      // الغرف الإضافية
      if (propertyData.laundryRoom > 0) features.push(`${propertyData.laundryRoom} غرفة غسيل`);
      if (propertyData.maidsRoom > 0) features.push(`${propertyData.maidsRoom} غرفة خادمة`);
      if (propertyData.driverRoom > 0) features.push(`${propertyData.driverRoom} غرفة سائق`);
      if (propertyData.guestRoom > 0) features.push(`${propertyData.guestRoom} غرفة ضيوف`);
      if (propertyData.office > 0) features.push(`${propertyData.office} مكتب منزلي`);
      if (propertyData.library > 0) features.push(`${propertyData.library} مكتبة`);
      if (propertyData.playroom > 0) features.push(`${propertyData.playroom} غرفة ألعاب`);
      if (propertyData.basement > 0) features.push(`${propertyData.basement} قبو للتخزين`);
      
      // المساحات الخارجية
      if (propertyData.terrace > 0) features.push(`${propertyData.terrace} تراس بإطلالة`);
      if (propertyData.patio > 0) features.push(`${propertyData.patio} فناء خاص`);
      if (propertyData.barbecueArea > 0) features.push(`${propertyData.barbecueArea} منطقة شواء`);
      
      // التشطيبات
      if (propertyData.marbleFlooring > 0) features.push(`أرضية رخام فاخرة`);
      if (propertyData.parquetFlooring > 0) features.push(`أرضية باركيه طبيعي`);
      if (propertyData.builtInWardrobe > 0) features.push(`خزائن مدمجة`);
      if (propertyData.kitchenAppliances > 0) features.push(`أجهزة مطبخ حديثة`);
      
      // العوازل
      if (propertyData.soundproofing > 0) features.push(`عازل صوت`);
      if (propertyData.thermalInsulation > 0) features.push(`عازل حراري`);
      if (propertyData.waterproofing > 0) features.push(`عازل مائي`);
      
      // إضا��ة الضمانات
      warranties.forEach(warranty => {
        if (warranty.type && warranty.duration) {
          features.push(`ضمان ${warranty.type}`);
          features.push(`ضمان ${warranty.duration}`);
        }
      });
      
      // إضافة المميزات المخصصة إلى القائمة
      if (propertyData.customFeatures && propertyData.customFeatures.length > 0) {
        propertyData.customFeatures.forEach(customFeature => {
          features.push(customFeature);
        });
      }
      
      if (features.length > 0) {
        arabicDescription += `✨ المميزات الخاصة:\n`;
        features.forEach(feature => {
          arabicDescription += `• ${feature}\n`;
        });
        arabicDescription += `\n`;
      }
      
      // مميزات العقار العامة
      if (propertyType === "فيلا") {
        arabicDescription += `🏡 مميزات الفيلا:\n• حديقة خاصة\n• مدخل خاص\n• موقف سيارات\n\n`;
      } else if (propertyType === "شقة") {
        arabicDescription += `🏠 مميزات الشقة:\n• تصميم حديث\n• إطلالة رائعة\n• موقع مميز\n\n`;
      }
      
      // النهاية حسب النبرة
      if (tone === "marketing") {
        arabicDescription += `🔥 فرصة ذهبية لا تُفوّت! عقار مميز في موقع حيوي ومطلوب بشدة. العرض محدود المدة!\n\n`;
      } else if (tone === "luxury") {
        arabicDescription += `💎 عقار مميز يجمع بين الراحة والأناقة، في موقع استراتيجي مناسب ل��ميع احتياجاتكم.\n\n`;
      } else {
        arabicDescription += `🏡 عقار مثالي يوفر الراحة والخصوصي�� في بيئة هادئة ومميزة.\n\n`;
      }
      
      // الترخيص الإعلاني والسعر (تم تغيير الترتيب)
      if (advertisingLicense) {
        arabicDescription += `📋 رقم الترخيص الإعلاني: ${advertisingLicense}\n`;
      } else {
        arabicDescription += `📋 رقم الترخيص الإعلاني: سيتم إضافته\n`;
      }
      
      if (finalPrice) {
        const formattedPrice = new Intl.NumberFormat('ar-SA').format(parseInt(finalPrice));
        arabicDescription += `💰 السعر: ${formattedPrice} ريال سعودي شامل جميع الرسوم\n\n`;
      }
      
      // معلومات التواصل
      arabicDescription += `📞 للاستفسار والمعاينة الفورية، تواصل معنا الآن!\n`;
      arabicDescription += `✅ استشارة مجانية مع خبرائنا\n`;
      arabicDescription += `✅ معاينة فورية في الوقت المناسب لك\n`;
      arabicDescription += `✅ إجراءات مبسطة وسريعة\n`;
      arabicDescription += `✅ ضمان أفضل الأسعار\n\n`;
      arabicDescription += `🕐 متاح للاستفسار على مدار الساع��\n`;
      arabicDescription += `📱 يمكن��م التواصل عبر الواتساب أيضاً`;
      
      // الوصف الإنجليزي المحسن مع الترجمة الكاملة
      if (language === "en" || language === "bilingual") {
        const purposeEn = purposeText === "للبيع" ? "FOR SALE" : "FOR RENT";
        const propertyTypeEn = translateTerms[propertyType] || propertyType;
        
        if (tone === "professional") {
          englishDescription = `🏡 ${purposeEn}: Premium Residential ${propertyTypeEn} with modern design\n\n`;
          
          // English location with city and district
          if (cityInfo || districtInfo || propertyLocation) {
            englishDescription += `📍 Location: `;
            if (cityInfo) {
              const cityEn = translateTerms[cityInfo] || cityInfo;
              englishDescription += cityEn;
            }
            if (districtInfo) {
              const districtEn = translateTerms[districtInfo] || districtInfo;
              englishDescription += `${cityInfo ? ' - ' : ''}${districtEn} District`;
            }
            if (propertyLocation && !cityInfo && !districtInfo) {
              const locationEn = translateTerms[propertyLocation] || propertyLocation;
              englishDescription += locationEn;
            }
            if (cityInfo && cityInfo.includes('الرياض')) englishDescription += ' - The heart of Saudi Arabia';
            englishDescription += `\n`;
          }
          
          // English area
          if (areaInfo) {
            englishDescription += `📐 Total Area: ${areaInfo} sqm - Spacious and comfortable\n`;
          }
          if (bedrooms > 0 || bathrooms > 0) {
            englishDescription += `🏠 Layout: `;
            if (bedrooms > 0) englishDescription += `${bedrooms} bedrooms (spacious)`;
            if (bathrooms > 0) englishDescription += `${bedrooms > 0 ? ' • ' : ''}${bathrooms} bathrooms with modern fixtures`;
            englishDescription += `\n\n`;
          }
        } else if (tone === "marketing") {
          englishDescription = `🏡 ${purposeEn}: Amazing ${propertyTypeEn} you can't resist! 🌟\n\n`;
          
          // Marketing English location
          if (cityInfo || districtInfo || propertyLocation) {
            englishDescription += `📍 `;
            if (cityInfo) {
              const cityEn = translateTerms[cityInfo] || cityInfo;
              englishDescription += cityEn;
            }
            if (districtInfo) {
              const districtEn = translateTerms[districtInfo] || districtInfo;
              englishDescription += `${cityInfo ? ' - ' : ''}${districtEn} District`;
            }
            if (propertyLocation && !cityInfo && !districtInfo) {
              const locationEn = translateTerms[propertyLocation] || propertyLocation;
              englishDescription += locationEn;
            }
            englishDescription += ` - Most sought-after location in the area! 🔥\n`;
          }
          
          // Marketing English area
          if (areaInfo) {
            englishDescription += `📐 ${areaInfo} sqm of luxury space and absolute comfort! ✨\n`;
          }
          if (bedrooms > 0 || bathrooms > 0) {
            englishDescription += `🏠 `;
            if (bedrooms > 0) englishDescription += `${bedrooms} bedrooms of your dreams 🛏️`;
            if (bathrooms > 0) englishDescription += `${bedrooms > 0 ? ' • ' : ''}${bathrooms} luxury bathrooms 🚿`;
            englishDescription += `\n\n`;
          }
        } else if (tone === "luxury") {
          englishDescription = `🏛️ ${purposeEn}: Exceptional ${propertyTypeEn} with world-class standards\n\n`;
          
          // Luxury English location
          if (cityInfo || districtInfo || propertyLocation) {
            englishDescription += `📍 `;
            if (cityInfo) {
              const cityEn = translateTerms[cityInfo] || cityInfo;
              englishDescription += cityEn;
            }
            if (districtInfo) {
              const districtEn = translateTerms[districtInfo] || districtInfo;
              englishDescription += `${cityInfo ? ' - ' : ''}${districtEn} District`;
            }
            if (propertyLocation && !cityInfo && !districtInfo) {
              const locationEn = translateTerms[propertyLocation] || propertyLocation;
              englishDescription += locationEn;
            }
            englishDescription += ` - Most prestigious and distinguished location\n`;
          }
          
          // Luxury English area
          if (areaInfo) {
            englishDescription += `📐 ${areaInfo} sqm of luxury and elegance\n`;
          }
          if (bedrooms > 0 || bathrooms > 0) {
            englishDescription += `🏠 Elegant design: `;
            if (bedrooms > 0) englishDescription += `${bedrooms} luxury suites`;
            if (bathrooms > 0) englishDescription += `${bedrooms > 0 ? ' • ' : ''}${bathrooms} bathrooms with Italian fixtures`;
            englishDescription += `\n\n`;
          }
        }
        
        // المميزات المترجمة بالكامل (الأساسية والفاخرة)
        const englishFeatures = [];
        // المميزات الأساسية
        if (warehouses > 0) englishFeatures.push(`${warehouses} storage rooms (spacious and organized)`);
        if (balconies > 0) englishFeatures.push(`${balconies} balconies with scenic views`);
        if (curtains > 0) englishFeatures.push(`${curtains} curtains (modern and elegant)`);
        if (airConditioners > 0) englishFeatures.push(`${airConditioners} air conditioners (energy efficient)`);
        if (privateParking > 0) englishFeatures.push(`${privateParking} private parking spaces (covered and secure)`);
        if (floors > 1) englishFeatures.push(`${floors} floors (well-designed layout)`);
        
        // المميزات الفاخرة والحديثة
        if (propertyData.jacuzzi > 0) englishFeatures.push(`${propertyData.jacuzzi} luxury jacuzzi`);
        if (propertyData.rainShower > 0) englishFeatures.push(`${propertyData.rainShower} modern rain shower`);
        if (propertyData.swimmingPool > 0) englishFeatures.push(`${propertyData.swimmingPool} private swimming pool`);
        if (propertyData.gym > 0) englishFeatures.push(`${propertyData.gym} fully equipped gym`);
        if (propertyData.garden > 0) englishFeatures.push(`${propertyData.garden} landscaped garden`);
        if (propertyData.smartLighting > 0) englishFeatures.push(`${propertyData.smartLighting} smart lighting system`);
        if (propertyData.securitySystem > 0) englishFeatures.push(`${propertyData.securitySystem} advanced security system`);
        if (propertyData.centralHeating > 0) englishFeatures.push(`${propertyData.centralHeating} central heating system`);
        if (propertyData.solarPanels > 0) englishFeatures.push(`${propertyData.solarPanels} solar panels for renewable energy`);
        if (propertyData.elevator > 0) englishFeatures.push(`${propertyData.elevator} modern elevator`);
        if (propertyData.cctv > 0) englishFeatures.push(`${propertyData.cctv} CCTV surveillance system`);
        if (propertyData.intercom > 0) englishFeatures.push(`${propertyData.intercom} intercom system`);
        if (propertyData.fireAlarm > 0) englishFeatures.push(`${propertyData.fireAlarm} fire alarm system`);
        if (propertyData.generator > 0) englishFeatures.push(`${propertyData.generator} backup generator`);
        if (propertyData.fiberOptic > 0) englishFeatures.push(`${propertyData.fiberOptic} fiber optic internet`);
        
        // الغرف الإضافية
        if (propertyData.laundryRoom > 0) englishFeatures.push(`${propertyData.laundryRoom} laundry room`);
        if (propertyData.maidsRoom > 0) englishFeatures.push(`${propertyData.maidsRoom} maid's room`);
        if (propertyData.driverRoom > 0) englishFeatures.push(`${propertyData.driverRoom} driver's room`);
        if (propertyData.guestRoom > 0) englishFeatures.push(`${propertyData.guestRoom} guest room`);
        if (propertyData.office > 0) englishFeatures.push(`${propertyData.office} home office`);
        if (propertyData.library > 0) englishFeatures.push(`${propertyData.library} library`);
        if (propertyData.playroom > 0) englishFeatures.push(`${propertyData.playroom} playroom`);
        if (propertyData.basement > 0) englishFeatures.push(`${propertyData.basement} basement storage`);
        
        // المساحات الخارجية
        if (propertyData.terrace > 0) englishFeatures.push(`${propertyData.terrace} terrace with view`);
        if (propertyData.patio > 0) englishFeatures.push(`${propertyData.patio} private patio`);
        if (propertyData.barbecueArea > 0) englishFeatures.push(`${propertyData.barbecueArea} barbecue area`);
        
        // التشطيبات
        if (propertyData.marbleFlooring > 0) englishFeatures.push(`luxury marble flooring`);
        if (propertyData.parquetFlooring > 0) englishFeatures.push(`natural parquet flooring`);
        if (propertyData.builtInWardrobe > 0) englishFeatures.push(`built-in wardrobes`);
        if (propertyData.kitchenAppliances > 0) englishFeatures.push(`modern kitchen appliances`);
        
        // العوازل
        if (propertyData.soundproofing > 0) englishFeatures.push(`soundproofing`);
        if (propertyData.thermalInsulation > 0) englishFeatures.push(`thermal insulation`);
        if (propertyData.waterproofing > 0) englishFeatures.push(`waterproofing`);
        
        // ترجمة الضمانات
        warranties.forEach(warranty => {
          if (warranty.type && warranty.duration) {
            const typeEn = translateTerms[warranty.type] || warranty.type;
            const durationEn = translateTerms[warranty.duration] || warranty.duration;
            englishFeatures.push(`${typeEn} - ${durationEn}`);
          }
        });
        
        // إضافة المميزات المخصصة (بالنص العربي)
        if (propertyData.customFeatures && propertyData.customFeatures.length > 0) {
          propertyData.customFeatures.forEach(customFeature => {
            englishFeatures.push(customFeature);
          });
        }
        
        if (englishFeatures.length > 0) {
          englishDescription += `✨ Premium Features:\n`;
          englishFeatures.forEach(feature => {
            englishDescription += `• ${feature}\n`;
          });
          englishDescription += `\n`;
        }
        
        // مميزات العقار
        if (propertyType === "فيلا") {
          englishDescription += `🏡 Villa Amenities:\n• Private garden\n• Private entrance\n• Dedicated parking\n\n`;
        } else if (propertyType === "شقة") {
          englishDescription += `🏠 Apartment Features:\n• Modern design\n• Great view\n• Prime location\n\n`;
        }
        
        // النهاية المترجمة
        if (tone === "marketing") {
          englishDescription += `🔥 Don't miss this golden opportunity! Premium property in highly sought-after location. Limited time offer!\n\n`;
        } else if (tone === "luxury") {
          englishDescription += `💎 Distinguished property combining comfort and elegance in a strategic location suitable for all your needs.\n\n`;
        } else {
          englishDescription += `🏡 Perfect property offering comfort and privacy in a quiet and distinguished environment.\n\n`;
        }
        
        // السعر والترخيص بالإنجليزية
        if (finalPrice) {
          englishDescription += `💰 Price: ${new Intl.NumberFormat('en-US').format(parseInt(finalPrice))} SAR inclusive of all fees\n`;
        }
        if (advertisingLicense) {
          englishDescription += `📋 Advertising License No.: ${advertisingLicense}\n\n`;
        } else {
          englishDescription += `📋 Advertising License No.: To be added\n\n`;
        }
        
        // الضمانات المترجمة
        if (warranties.length > 0) {
          englishDescription += `🛡️ Available Warranties:\n`;
          warranties.forEach(warranty => {
            if (warranty.type && warranty.duration) {
              const typeEn = translateTerms[warranty.type] || warranty.type;
              const durationEn = translateTerms[warranty.duration] || warranty.duration;
              englishDescription += `• ${typeEn} - ${durationEn}\n`;
            }
          });
          englishDescription += `\n`;
        }
        
        // معلومات التواصل
        englishDescription += `📞 For immediate inquiries and viewing, contact us now!\n`;
        englishDescription += `✅ Free consultation with our experts\n`;
        englishDescription += `✅ Immediate viewing at your convenience\n`;
        englishDescription += `✅ Fast and simplified procedures\n`;
        englishDescription += `✅ Best price guarantee\n\n`;
        englishDescription += `🕐 Available for inquiries 24/7\n`;
        englishDescription += `📱 WhatsApp communication available`;
      }
    }
    
    // تجميع الوصف النهائي
    let finalDescription = "";
    
    if (language === "ar") {
      finalDescription = arabicDescription;
    } else if (language === "en") {
      finalDescription = englishDescription;
    } else if (language === "bilingual") {
      finalDescription = arabicDescription + "\n\n" + englishDescription;
    }
    
    // إضافة اقتراحات السعر (378) - السعر المحدد
    if (finalPrice && parseInt(finalPrice) > 0) {
      const formattedPrice = new Intl.NumberFormat('ar-SA').format(parseInt(finalPrice));
      
      if (language === "ar" || language === "bilingual") {
        finalDescription += `\n\n💡 اقتراحات السعر:\n`;
        finalDescription += `• السعر المحدد: ${formattedPrice} ريال سعودي\n`;
        finalDescription += `• يشمل جميع الرسوم والعمولات\n`;
        finalDescription += `• قابل للتفاوض حسب ظروف السوق\n`;
      }
      
      if (language === "en" || language === "bilingual") {
        const englishFormattedPrice = new Intl.NumberFormat('en-US').format(parseInt(finalPrice));
        finalDescription += `\n\n💡 Price Suggestions:\n`;
        finalDescription += `• Listed Price: ${englishFormattedPrice} SAR\n`;
        finalDescription += `• Includes all fees and commissions\n`;
        finalDescription += `• Negotiable based on market conditions\n`;
      }
    }
    
    // إضافة رقم الواتساب في النهاية
    if (whatsappNumber && whatsappNumber !== "+966") {
      finalDescription += `\n\n📱 واتساب: ${whatsappNumber}`;
      if (language === "en" || language === "bilingual") {
        finalDescription += `\n📱 WhatsApp: ${whatsappNumber}`;
      }
    }
    
    // إضافة الهاشتاقات في النهاية (378)
    const generateHashtags = () => {
      const hashtags = {
        arabic: [],
        english: []
      };
      
      // هاشتاقات عامة
      hashtags.arabic.push('#عقار', '#السعودية', '#استثمار_عقاري');
      hashtags.english.push('#RealEstate', '#SaudiArabia', '#PropertyInvestment');
      
      // هاشتاقات حسب الغرض
      if (purpose) {
        const purposeText = purpose.replace('💰 ', '').replace('🏡 ', '');
        if (purposeText.includes('للبيع')) {
          hashtags.arabic.push('#للبيع', '#شراء_عقار');
          hashtags.english.push('#ForSale', '#PropertyForSale');
        } else if (purposeText.includes('للإيجار')) {
          hashtags.arabic.push('#للإيجار', '#إيجار_عقار');
          hashtags.english.push('#ForRent', '#PropertyForRent');
        }
      }
      
      // هاشتاقات حسب نوع العقار
      if (propertyType) {
        if (propertyType === 'فيلا') {
          hashtags.arabic.push('#فيلا', '#فيلا_فاخرة');
          hashtags.english.push('#Villa', '#LuxuryVilla');
        } else if (propertyType === 'شقة') {
          hashtags.arabic.push('#شقة', '#شقة_سكنية');
          hashtags.english.push('#Apartment', '#ResidentialApartment');
        } else if (propertyType === 'دوبلكس') {
          hashtags.arabic.push('#دوبلكس', '#دوبلكس_فاخر');
          hashtags.english.push('#Duplex', '#LuxuryDuplex');
        } else if (propertyType === 'قصر') {
          hashtags.arabic.push('#قصر', '#قصر_ملكي');
          hashtags.english.push('#Palace', '#RoyalPalace');
        }
      }
      
      // هاشتاقات حسب المدينة
      const cityInfo = locationDetails?.city || city || '';
      if (cityInfo) {
        if (cityInfo.includes('الرياض')) {
          hashtags.arabic.push('#الرياض', '#عقار_الرياض');
          hashtags.english.push('#Riyadh', '#RiyadhProperty');
        } else if (cityInfo.includes('جدة')) {
          hashtags.arabic.push('#جدة', '#عقار_جدة');
          hashtags.english.push('#Jeddah', '#JeddahProperty');
        } else if (cityInfo.includes('الدمام')) {
          hashtags.arabic.push('#الدمام', '#الشرقية');
          hashtags.english.push('#Dammam', '#EasternProvince');
        }
      }
      
      // هاشتاقات المميزات الفاخرة
      if (propertyData.swimmingPool > 0) {
        hashtags.arabic.push('#مسبح_خاص');
        hashtags.english.push('#PrivatePool');
      }
      if (propertyData.gym > 0) {
        hashtags.arabic.push('#جيم_خاص');
        hashtags.english.push('#PrivateGym');
      }
      if (propertyData.garden > 0) {
        hashtags.arabic.push('#حديقة_خاصة');
        hashtags.english.push('#PrivateGarden');
      }
      if (propertyData.jacuzzi > 0) {
        hashtags.arabic.push('#جاكوزي');
        hashtags.english.push('#Jacuzzi');
      }
      
      return hashtags;
    };
    
    const hashtags = generateHashtags();
    
    // إضافة الهاشتاقات العربية
    if ((language === "ar" || language === "bilingual") && hashtags.arabic.length > 0) {
      finalDescription += `\n\n${hashtags.arabic.join(' ')}`;
    }
    
    // إضافة الهاشتاقات الإنجليزية
    if ((language === "en" || language === "bilingual") && hashtags.english.length > 0) {
      if (language === "bilingual") {
        finalDescription += `\n\n${hashtags.english.join(' ')}`;
      } else {
        finalDescription += `\n\n${hashtags.english.join(' ')}`;
      }
    }
    
    setPropertyData(prev => ({
      ...prev,
      aiDescription: {
        ...prev.aiDescription,
        generatedText: finalDescription
      }
    }));
  };

  // دالة التحقق من المنصة مع API
  const checkPlatform = async (platformId: string) => {
    const link = platformLinks[platformId];
    if (!link) return;

    setPlatformStatus(prev => ({ ...prev, [platformId]: 'checking' }));
    
    try {
      // محاكاة API التحقق من المنصة
      const response = await fetch(`/api/platforms/${platformId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: link,
          apiKey: 'demo-key' 
        })
      });
      
      // محاكاة النتيجة
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isAvailable = Math.random() > 0.3;
      
      setPlatformStatus(prev => ({ 
        ...prev, 
        [platformId]: isAvailable ? 'available' : 'unavailable' 
      }));
    } catch (error) {
      console.error('خطأ في التحقق من المنصة:', error);
      setPlatformStatus(prev => ({ ...prev, [platformId]: 'unavailable' }));
    }
  };

  // دالة التحقق من الترخيص الإعلاني
  const checkAdvertisingLicense = async (licenseNumber: string) => {
    if (!licenseNumber) return;
    
    setPropertyData(prev => ({ ...prev, advertisingLicenseStatus: 'checking' }));
    
    try {
      // محاكاة API الهيئة العامة للعقار
      const response = await fetch('/api/general-authority/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          licenseNumber,
          brokerLicense: '1234567890' // من بطاقة العمل
        })
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // محاكاة النتيجة (80% صحيح)
      const isValid = Math.random() > 0.2;
      
      setPropertyData(prev => ({ 
        ...prev, 
        advertisingLicenseStatus: isValid ? 'valid' : 'invalid' 
      }));
    } catch (error) {
      console.error('خطأ في التحقق من الترخيص:', error);
      setPropertyData(prev => ({ ...prev, advertisingLicenseStatus: 'invalid' }));
    }
  };

  // دالة تحديد الموقع من الخريطة التفاعلية
  const handleMapLocationSelect = (locationData: any) => {
    console.log('📍 بيانات الموقع المستلمة:', locationData);
    
    // عرض رسالة نجاح مع تفاصيل
    if (locationData.buildingInfo) {
      console.log('✅ تم التثبيت على مبنى:', locationData.buildingInfo);
      toast.success('✅ تم التثبيت على المبنى', {
        description: `${locationData.buildingInfo.name || 'مبنى'} - ${locationData.buildingInfo.district || locationData.city || 'الرياض'}`,
        duration: 3000
      });
    } else {
      toast.success('📍 تم تحديد الموقع', {
        description: `${locationData.city || 'الرياض'} - ${locationData.district || 'يمكنك النقر مرة أخرى لتغيير الموقع'}`,
        duration: 3000
      });
    }
    
    setPropertyData(prev => ({
      ...prev,
      locationDetails: {
        city: locationData.city || '',
        district: locationData.district || '',
        street: locationData.street || '',
        postalCode: locationData.postalCode || '',
        buildingNumber: locationData.buildingNumber || '',
        additionalNumber: locationData.additionalNumber || '',
        latitude: locationData.coordinates?.lat || 0,
        longitude: locationData.coordinates?.lng || 0
      }
    }));
    // ✅ تم إزالة setShowMapPicker(false) - الخريطة تبقى مفتوحة للمستخدم
    // يمكن للمستخدم النقر عدة مرات لتحريك العلامة
    // ويُغلق الخريطة يدوياً بزر "إغلاق الخريطة"
  };

  // دالة جلب بيانات السوق
  const fetchMarketData = async () => {
    if (!propertyData.locationDetails.city || !propertyData.locationDetails.district || !propertyData.area || !propertyData.propertyType) {
      return;
    }

    try {
      const marketPromises = marketSources.map(async (source) => {
        // محاكاة API لكل مصدر
        const response = await fetch(`${source.apiEndpoint}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            city: propertyData.locationDetails.city,
            district: propertyData.locationDetails.district,
            propertyType: propertyData.propertyType,
            area: parseInt(propertyData.area),
            purpose: propertyData.purpose
          })
        });
        
        // محاكاة البيانات
        const basePrice = 800000 + Math.random() * 400000;
        return {
          source: source.name,
          minPrice: Math.round(basePrice * 0.8),
          maxPrice: Math.round(basePrice * 1.3),
          avgPrice: Math.round(basePrice),
          pricePerSqm: Math.round(basePrice / parseInt(propertyData.area || "100")),
          url: source.url
        };
      });

      const marketData = await Promise.all(marketPromises);
      
      setPropertyData(prev => ({
        ...prev,
        marketData
      }));
    } catch (error) {
      console.error('خطأ في جلب بيانات السوق:', error);
    }
  };


  const connectedPlatforms = platforms.filter(p => p.isConnected);
  const pendingPlatforms = platforms.filter(p => !p.isConnected);

  // التبويب الأول: ربط المنصات (351)
  const renderPlatformLinking = () => (
    <div className="space-y-6" dir="rtl">
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader>
          <CardTitle className="text-[#01411C] text-right">المنصات العقارية</CardTitle>
          <p className="text-gray-600 text-right">اربط حساباتك مرة واحدة وانشر على جميع المنصات بنقرة واحدة</p>
        </CardHeader>
        <CardContent>

          {/* المنصات العقارية بالتصميم الجديد */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#01411C] text-right mb-4">المنصات ال��قارية</h4>
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 min-w-[100px]">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  ></div>
                  <span className="font-medium text-[#01411C] text-sm">{platform.name}</span>
                </div>
                
                <div className="flex-1">
                  <Input 
                    placeholder={`رابط ${platform.name}`}
                    value={platformLinks[platform.id] || ''}
                    onChange={(e) => setPlatformLinks(prev => ({ ...prev, [platform.id]: e.target.value }))}
                    className="border-[#D4AF37] focus:border-[#01411C] text-right text-sm h-8"
                    dir="rtl"
                  />
                </div>
                
                <Button 
                  onClick={() => checkPlatform(platform.id)}
                  disabled={!platformLinks[platform.id] || platformStatus[platform.id] === 'checking'}
                  className="bg-[#01411C] text-white hover:bg-[#065f41] h-8 px-3 text-sm touch-manipulation"
                  size="sm"
                >
                  {platformStatus[platform.id] === 'checking' ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'تحقق'
                  )}
                </Button>
                
                <div className="w-16 text-center">
                  {platformStatus[platform.id] === 'available' && (
                    <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded">متاح</span>
                  )}
                  {platformStatus[platform.id] === 'unavailable' && (
                    <span className="text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded">غير متاح</span>
                  )}
                  {!platformStatus[platform.id] && (
                    <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded">متاح</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* طلب منصة جديدة */}
          <Card className="border-2 border-dashed border-[#D4AF37] mt-6">
            <CardContent className="p-6 text-center">
              <Plus className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h4 className="font-bold text-[#01411C] mb-2">طلب إضافة منصة جديدة</h4>
              <p className="text-gray-600 mb-4">لا ترى منصتك المفضلة؟ اطلب إضافتها</p>
              <Button className="bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f]">
                طلب إضافة منصة
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  // التبويب الثاني: إنشاء الإعلان (352)
  const renderCreateAd = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir="rtl">
      {/* العمود الرئيسي: إنشاء الإعلان */}
      <div className="space-y-6">
        <Card className="border-2 border-[#D4AF37]">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-t-lg">
            <CardTitle className="text-right">إنشاء الإعلان</CardTitle>
            <p className="text-sm opacity-90 text-right">ارفع الصور والفيديوهات واملأ التفاصيل</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* ألبوم الصور والفيديو */}
            <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2 text-right">
                  <Camera className="w-5 h-5 text-[#D4AF37]" />
                  ألبوم الصور والفيديو
                </CardTitle>
                <p className="text-sm text-gray-600 text-right">
                  رفع ذكي بجودة عالية مع معاينة فورية
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* خيارات الجودة */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={uploadQuality === 'standard' ? 'default' : 'outline'}
                    className={`h-16 ${uploadQuality === 'standard' ? 'bg-gradient-to-r from-[#01411C] to-[#065f41] text-white' : 'border-2 border-[#D4AF37]'}`}
                    onClick={() => setUploadQuality('standard')}
                  >
                    <div className="text-center">
                      <Upload className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs">رفع عادي</div>
                      <div className="text-[10px] opacity-70">سريع ومناسب</div>
                    </div>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={uploadQuality === 'hd' ? 'default' : 'outline'}
                    className={`h-16 ${uploadQuality === 'hd' ? 'bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] border-2 border-[#01411C]' : 'border-2 border-[#D4AF37]'}`}
                    onClick={() => setUploadQuality('hd')}
                  >
                    <div className="text-center">
                      <Sparkles className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-bold">رفع HD</div>
                      <div className="text-[10px] opacity-70">جودة عالية</div>
                    </div>
                  </Button>
                </div>

                {/* مؤشر الجودة المختارة */}
                {uploadQuality === 'hd' && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-[#D4AF37] rounded-lg p-3">
                    <div className="flex items-center gap-2 text-right">
                      <Star className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-sm font-medium text-[#01411C]">
                        ✨ جودة HD مفعّلة - أفضل جودة للصور والفيديو
                      </span>
                    </div>
                  </div>
                )}

                {/* منطقة الرفع المحسّنة */}
                <div 
                  className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 bg-gradient-to-r from-[#f0fdf4] to-white hover:from-[#e0f2fe] hover:to-[#f0fdf4] transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#01411C] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium text-[#01411C] mb-1">اسحب وأفلت الملفات هنا</p>
                    <p className="text-sm text-gray-600 mb-3">أو انقر لاختيار الملفات</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        حتى 10 صور
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📹</span>
                        فيديو واحد
                      </span>
                    </div>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />

                {/* شبكة الألبوم 3×3 - محسّنة من 253 */}
                {propertyData.mediaFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-[#01411C]">
                        الملفات المرفوعة ({propertyData.mediaFiles.length})
                      </h5>
                      {uploadQuality === 'hd' && (
                        <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C]">
                          <Sparkles className="w-3 h-3 mr-1" />
                          HD
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {propertyData.mediaFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          {file.type === 'image' ? (
                            <img 
                              src={file.url} 
                              alt="" 
                              className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                                file.isPrimary 
                                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] ring-offset-2' 
                                  : 'border-gray-200'
                              }`}
                            />
                          ) : (
                            <div className="relative">
                              <video 
                                src={file.url} 
                                className="w-full h-24 object-cover rounded-lg border-2 border-blue-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📹</span>
                              </div>
                            </div>
                          )}
                        
                        {/* أزرار ��لتحكم */}
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {file.type === 'image' && (
                              <Button
                                size="sm"
                                variant={file.isPrimary ? "default" : "outline"}
                                className={`w-7 h-7 p-0 ${
                                  file.isPrimary 
                                    ? 'bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f]' 
                                    : 'bg-white'
                                }`}
                                onClick={() => setPrimaryImage(file.id)}
                                title="تعيين كصورة رئيسية"
                              >
                                <Star className={`w-4 h-4 ${file.isPrimary ? 'fill-current' : ''}`} />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-7 h-7 p-0 bg-red-500 hover:bg-red-600"
                              onClick={() => removeFile(file.id)}
                              title="حذف"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {file.isPrimary && (
                            <div className="absolute bottom-1 right-1">
                              <Badge className="bg-[#D4AF37] text-[#01411C] text-[10px] px-1 py-0">
                                رئيسية
                              </Badge>
                            </div>
                          )}

                          {uploadQuality === 'hd' && (
                            <div className="absolute bottom-1 left-1">
                              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] px-1 py-0">
                                HD
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Camera className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            <span className="font-bold text-blue-600">
                              {propertyData.mediaFiles.filter(f => f.type === 'image').length}
                            </span>
                            <span className="text-gray-600">/10 صور</span>
                          </span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">📹</span>
                          <span className="text-sm">
                            <span className="font-bold text-purple-600">
                              {propertyData.mediaFiles.filter(f => f.type === 'video').length}
                            </span>
                            <span className="text-gray-600">/1 فيديو</span>
                          </span>
                        </div>
                      </div>
                      
                      {propertyData.mediaFiles.some(f => f.isPrimary) && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="w-3 h-3" />
                          <span>صورة رئيسية محددة</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {propertyData.mediaFiles.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2 text-right">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700">
                        <p className="font-medium mb-1">💡 نصائح للحصول على أفضل النتائج:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-right">
                          <li>استخدم جودة HD للعقارات الفاخرة</li>
                          <li>الصورة الأولى ستكون الصورة الرئيسية تلقائياً</li>
                          <li>يمكنك تغيير الصورة الرئيسية بالنقر على ⭐</li>
                          <li>الفيديو يساعد في زيادة التفاعل بنسبة 80%</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* الجولة الافتراضية ثلاثية الأبعاد (268) */}
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    3D
                  </div>
                  الجولة الافتراضية ثلاثية الأبعاد (268)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input 
                  value={propertyData.virtualTourLink}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, virtualTourLink: e.target.value }))}
                  placeholder="رابط الجولة الافتراضية"
                  className="border-blue-300 focus:border-blue-600"
                />
                <div className="text-sm text-blue-700">
                  <p className="mb-2">المنصات المدعومة:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Matterport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>360 Virtual Tours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Google Street View</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  حفظ الرابط
                </Button>
              </CardContent>
            </Card>

            {/* البيانات الأساسية (255) */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2 text-right">
                  <User className="w-5 h-5" />
                  البيانات الأساسية (255)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#01411C] text-right">الاسم الكامل *</Label>
                  <Input 
                    value={propertyData.fullName}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="border-[#D4AF37] focus:border-[#01411C] text-right"
                    dir="rtl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#01411C] text-right">تاريخ الميلاد</Label>
                    <Input 
                      type="date"
                      value={propertyData.birthDate}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="border-[#D4AF37] focus:border-[#01411C] text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label className="text-[#01411C] text-right">رقم الهوية *</Label>
                    <Input 
                      value={propertyData.idNumber}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, idNumber: e.target.value }))}
                      className="border-[#D4AF37] focus:border-[#01411C] text-right"
                      dir="rtl"
                      placeholder="رقم بطاقة الأحوال"
                    />
                  </div>
                </div>
                
                {/* تواريخ بطاقة الأحوال */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#01411C] text-right">تاريخ إصدار بطاقة الأحوال</Label>
                    <Input 
                      type="date"
                      value={propertyData.idIssueDate}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, idIssueDate: e.target.value }))}
                      className="border-[#D4AF37] focus:border-[#01411C] text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label className="text-[#01411C] text-right">تاريخ انتهاء بطاقة الأحوال</Label>
                    <Input 
                      type="date"
                      value={propertyData.idExpiryDate}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, idExpiryDate: e.target.value }))}
                      className="border-[#D4AF37] focus:border-[#01411C] text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                {/* بيانات الصك */}
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300">
                  <CardHeader>
                    <CardTitle className="text-green-800 text-right flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      بيانات الصك
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-green-800 text-right">رقم الصك *</Label>
                      <Input 
                        value={propertyData.deedNumber}
                        onChange={(e) => setPropertyData(prev => ({ ...prev, deedNumber: e.target.value }))}
                        className="border-green-300 focus:border-green-600 text-right"
                        dir="rtl"
                        placeholder="أدخل رقم الصك"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-green-800 text-right">تاريخ الصك</Label>
                        <Input 
                          type="date"
                          value={propertyData.deedDate}
                          onChange={(e) => setPropertyData(prev => ({ ...prev, deedDate: e.target.value }))}
                          className="border-green-300 focus:border-green-600 text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <Label className="text-green-800 text-right">جهة إصدار الصك</Label>
                        <Input 
                          value={propertyData.deedIssuer}
                          onChange={(e) => setPropertyData(prev => ({ ...prev, deedIssuer: e.target.value }))}
                          className="border-green-300 focus:border-green-600 text-right"
                          dir="rtl"
                          placeholder="مثال: كتابة العدل بالرياض"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div>
                  <Label className="text-[#01411C] text-right">رقم الجوال</Label>
                  <Input 
                    value={propertyData.phoneNumber}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="border-[#D4AF37] focus:border-[#01411C] text-right"
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* تفاصيل الموقع - جديد */}
            <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2 text-right">
                  <MapIcon className="w-5 h-5" />
                  العنوان الوطني السعودي
                </CardTitle>
                <p className="text-sm text-gray-600 text-right">
                  حدد الموقع من الخريطة التفاعلية للتعبئة التلقائية باستخدام ArcGIS + Turf.js
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* زر فتح الخريطة */}
                {!showMapPicker && (
                  <div className="flex items-center justify-between p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-bold text-blue-800 text-right">تحديد الموقع من الخريطة</h4>
                        <p className="text-sm text-blue-600 text-right">انقر لفتح الخريطة التفاعلية وتحديد الموقع بدقة</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setShowMapPicker(true)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      فتح الخريطة
                    </Button>
                  </div>
                )}

                {/* الخريطة التفاعلية */}
                {showMapPicker && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-200">
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-800 flex items-center gap-2">
                          <MapPin className="w-5 h-5 animate-bounce" />
                          انقر على الخريطة لتحديد الموقع
                        </h4>
                        <p className="text-sm text-blue-600 mt-1">
                          💡 يمكنك النقر عدة مرات لتغيير الموقع • استخدم زر "محاذاة المباني" للتثبيت التلقائي على أقرب مبنى
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMapPicker(false)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4 ml-2" />
                        إغلاق الخريطة
                      </Button>
                    </div>
                    <MapLocationPicker onLocationSelect={handleMapLocationSelect} />
                  </div>
                )}

                {/* البيانات المستخرجة تلقائياً */}
                {propertyData.locationDetails.latitude !== 0 && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="col-span-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">✅ تم استخراج بيانات العنوان الوطني تلقائياً (ArcGIS Geocoding)</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-[#01411C] text-right text-sm">المدينة</Label>
                      <Input 
                        value={propertyData.locationDetails.city}
                        onChange={(e) => setPropertyData(prev => ({ 
                          ...prev, 
                          locationDetails: { ...prev.locationDetails, city: e.target.value }
                        }))}
                        className="border-green-300 focus:border-green-600 text-right h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-[#01411C] text-right text-sm">الحي</Label>
                      <Input 
                        value={propertyData.locationDetails.district}
                        onChange={(e) => setPropertyData(prev => ({ 
                          ...prev, 
                          locationDetails: { ...prev.locationDetails, district: e.target.value }
                        }))}
                        className="border-green-300 focus:border-green-600 text-right h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-[#01411C] text-right text-sm">الشارع</Label>
                      <Input 
                        value={propertyData.locationDetails.street}
                        onChange={(e) => setPropertyData(prev => ({ 
                          ...prev, 
                          locationDetails: { ...prev.locationDetails, street: e.target.value }
                        }))}
                        className="border-green-300 focus:border-green-600 text-right h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-[#01411C] text-right text-sm">ا��رمز البريدي</Label>
                      <Input 
                        value={propertyData.locationDetails.postalCode}
                        onChange={(e) => setPropertyData(prev => ({ 
                          ...prev, 
                          locationDetails: { ...prev.locationDetails, postalCode: e.target.value }
                        }))}
                        className="border-green-300 focus:border-green-600 text-right h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-[#01411C] text-right text-sm">رقم المبنى</Label>
                      <Input 
                        value={propertyData.locationDetails.buildingNumber}
                        onChange={(e) => setPropertyData(prev => ({ 
                          ...prev, 
                          locationDetails: { ...prev.locationDetails, buildingNumber: e.target.value }
                        }))}
                        className="border-green-300 focus:border-green-600 text-right h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-[#01411C] text-right text-sm">الرقم الإضافي</Label>
                      <Input 
                        value={propertyData.locationDetails.additionalNumber}
                        onChange={(e) => setPropertyData(prev => ({ 
                          ...prev, 
                          locationDetails: { ...prev.locationDetails, additionalNumber: e.target.value }
                        }))}
                        className="border-green-300 focus:border-green-600 text-right h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                {/* زر جلب ب��انات السوق */}
                {propertyData.locationDetails.city && propertyData.locationDetails.district && (
                  <div className="text-center">
                    <Button 
                      onClick={fetchMarketData}
                      className="bg-[#01411C] text-white hover:bg-[#065f41]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      جلب بيانات السوق للمنطقة
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* تفاصيل العقار (256) */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2 text-right">
                  <Building className="w-5 h-5" />
                  تفاصيل العقار (256)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#01411C] text-right">نوع العقار *</Label>
                    <Select value={propertyData.propertyType} onValueChange={(value) => setPropertyData(prev => ({ ...prev, propertyType: value }))}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C] text-right" dir="rtl">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#01411C] text-right">الفئة *</Label>
                    <Select value={propertyData.category} onValueChange={(value) => setPropertyData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C] text-right" dir="rtl">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#01411C] text-right">الغرض *</Label>
                    <Select value={propertyData.purpose} onValueChange={(value) => setPropertyData(prev => ({ ...prev, purpose: value }))}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C] text-right" dir="rtl">
                        <SelectValue placeholder="اختر الغرض" />
                      </SelectTrigger>
                      <SelectContent>
                        {purposes.map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#01411C] text-right">مساحة العقار (م²) *</Label>
                    <Input 
                      type="number"
                      value={propertyData.area}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, area: e.target.value }))}
                      className="border-[#D4AF37] focus:border-[#01411C] text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                {/* 🆕 التصنيف الذكي (سكني/تجاري) */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-5 h-5 text-amber-700" />
                    <Label className="text-amber-900 font-bold text-right">التصنيف الذكي *</Label>
                    <Badge className="bg-amber-200 text-amber-900 text-xs">جديد</Badge>
                  </div>
                  <Select 
                    value={propertyData.propertyCategory} 
                    onValueChange={(value: 'سكني' | 'تجاري') => setPropertyData(prev => ({ ...prev, propertyCategory: value }))}
                  >
                    <SelectTrigger className="border-amber-400 focus:border-amber-600 text-right bg-white" dir="rtl">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="سكني">🏠 سكني</SelectItem>
                      <SelectItem value="تجاري">🏢 تجاري</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-amber-700 mt-2 text-right">
                    💡 هذا التصنيف سيساعد في تنظيم العروض في منصتي بشكل ذكي
                  </p>
                </div>

              </CardContent>
            </Card>

            {/* تحديد مسار العرض على المنصة الخاصة */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  تحديد مسار العرض على المنصة الخاصة
                </CardTitle>
                <p className="text-sm text-gray-600">نظام تصنيف ديناميكي ذكي يربط الموقع والنوع بالمسار الهرمي الداخلي</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* المسار المحدد حالياً */}
                {propertyData.platformPath && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 mb-1">المسار المحدد:</p>
                        <p className="font-bold text-green-800">{propertyData.platformPath}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        محدد
                      </Badge>
                    </div>
                  </div>
                )}

                {/* الاقتراحات التلقائية الذكية */}
                {(propertyData.purpose || propertyData.propertyType) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <h4 className="font-bold text-[#01411C]">اقتراحات ذكية تلقائية</h4>
                      <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
                        <Bot className="w-3 h-3 mr-1" />
                        مولدة تلقائياً
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {/* الاقتراح الأساسي */}
                      {propertyData.purpose && propertyData.propertyType && (
                        <div 
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                          onClick={() => {
                            const basicPath = `${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / ${propertyData.propertyType}`;
                            setPropertyData(prev => ({ ...prev, platformPath: basicPath }));
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                            <span className="text-[#01411C] font-medium">
                              {propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / {propertyData.propertyType}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-[#01411C] text-white hover:bg-[#065f41]"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            اختيار
                          </Button>
                        </div>
                      )}

                      {/* اقتراح مع الموقع */}
                      {propertyData.purpose && propertyData.propertyLocation && propertyData.propertyType && (
                        <div 
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                          onClick={() => {
                            const locationPath = `${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / ${propertyData.propertyLocation} / ${propertyData.propertyType}`;
                            setPropertyData(prev => ({ ...prev, platformPath: locationPath }));
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                            <span className="text-[#01411C] font-medium">
                              {propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / {propertyData.propertyLocation} / {propertyData.propertyType}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-[#01411C] text-white hover:bg-[#065f41]"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            اختيار
                          </Button>
                        </div>
                      )}

                      {/* اقتراحات متقدمة حسب النوع */}
                      {propertyData.propertyType === "شقة" && propertyData.purpose && (
                        <>
                          <div 
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                            onClick={() => {
                              const advancedPath = `${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / شقق حديثة`;
                              setPropertyData(prev => ({ ...prev, platformPath: advancedPath }));
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="text-[#01411C] font-medium">
                                {propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / شقق حديثة
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              اختيار
                            </Button>
                          </div>
                          <div 
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                            onClick={() => {
                              const familyPath = `${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / شقق عائلية`;
                              setPropertyData(prev => ({ ...prev, platformPath: familyPath }));
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <span className="text-[#01411C] font-medium">
                                {propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / شقق عائلية
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              اختيار
                            </Button>
                          </div>
                        </>
                      )}

                      {propertyData.propertyType === "فيلا" && propertyData.purpose && (
                        <>
                          <div 
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                            onClick={() => {
                              const luxuryPath = `${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / فلل راقية`;
                              setPropertyData(prev => ({ ...prev, platformPath: luxuryPath }));
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              <span className="text-[#01411C] font-medium">
                                {propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / فلل راقية
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              اختيار
                            </Button>
                          </div>
                          <div 
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                            onClick={() => {
                              const compoundPath = `${propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / فلل كمبوند`;
                              setPropertyData(prev => ({ ...prev, platformPath: compoundPath }));
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                              <span className="text-[#01411C] font-medium">
                                {propertyData.purpose.replace('💰 ', '').replace('🏡 ', '')} / فلل كمبوند
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-[#01411C]"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              اختيار
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* نظام توليد المسارات الذكي (258) */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-[#D4AF37]">
                  <h4 className="font-bold text-[#01411C] mb-3 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    🤖 نظام توليد المسارات الذكي (258)
                  </h4>
                  
                  {/* المسار المقترح بناءً على البيانات */}
                  {(() => {
                    const suggestedPath = generateSmartPath(propertyData);
                    return suggestedPath && (
                      <div className="mb-4 p-3 bg-white rounded-lg border border-green-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">مسار مقترح بناءً على البيانات:</p>
                            <p className="font-bold text-[#01411C]">{suggestedPath}</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => setPropertyData(prev => ({ ...prev, platformPath: suggestedPath }))}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            استخدام
                          </Button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* المس��رات المحفوظة والمقترحة */}
                  <div>
                    <h5 className="font-medium text-[#065f41] mb-2">مسارات محفوظة ومقترحة</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(() => {
                        const basePaths = [
                          "للبيع / الرياض / شقق",
                          "للإيجار / جدة / فلل", 
                          "للبيع / الدمام / أراضي",
                          "للإيجار / الرياض / شقق مفروشة",
                          "للبيع / مكة المكرمة / عمائر",
                          "للاستثمار / الخبر / محلات تجارية"
                        ];
                        
                        // إضافة مسارات ديناميكية بناءً على بيانات المستخدم
                        const dynamicPaths = [];
                        if (propertyData.city && propertyData.purpose && propertyData.propertyType) {
                          const purpose = propertyData.purpose.replace('💰 ', '').replace('🏡 ', '');
                          dynamicPaths.push(`${purpose} / ${propertyData.city} / ${propertyData.propertyType}`);
                          
                          if (propertyData.neighborhood) {
                            dynamicPaths.push(`${purpose} / ${propertyData.city} / ${propertyData.neighborhood} / ${propertyData.propertyType}`);
                          }
                        }
                        
                        const allPaths = [...new Set([...dynamicPaths, ...basePaths])].slice(0, 6);
                        
                        return allPaths.map((path, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setPropertyData(prev => ({ ...prev, platformPath: path }))}
                            className={`justify-start border-gray-200 hover:border-[#D4AF37] hover:bg-[#f0fdf4] text-right h-auto py-2 ${
                              index < dynamicPaths.length ? 'border-green-300 bg-green-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                              <span className="text-xs">{path}</span>
                              {index < dynamicPaths.length && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  ذكي
                                </Badge>
                              )}
                            </div>
                          </Button>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                {/* إنشاء أو تعديل مسار مخصص */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-[#01411C] flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      إنشاء أو تعديل مسار مخصص
                    </h4>
                    <Button
                      size="sm"
                      className="bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f] border-2 border-[#01411C]"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      مسار جديد
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-[#01411C] font-medium">مسار مخصص (Tagger Strip View)</Label>
                      <Input
                        value={propertyData.platformPath}
                        onChange={(e) => setPropertyData(prev => ({ ...prev, platformPath: e.target.value }))}
                        placeholder="مثال: للإيجار / الرياض / شقق فاخرة / مفروشة"
                        className="border-2 border-[#D4AF37] focus:border-[#01411C] mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        استخدم الشرطة المائلة (/) للفصل بين مستويات التصنيف - سيتم حفظ هذا المسار للاستخدام المستقبلي
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        نظام التعلم الذكي
                      </h5>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        سيقوم النظام بحفظ هذا المسار المخصص واقتراحه تلقائياً للعقار��ت المشابهة في المستقبل. 
                        هذا يساعد في تحسين تجربة التصنيف وسرعة النشر.
                      </p>
                    </div>
                  </div>
                </div>

                {/* معاينة المسار على الموقع */}
                {propertyData.platformPath && (
                  <div className="bg-gradient-to-r from-[#f0fdf4] to-[#fffef7] p-4 rounded-lg border border-[#D4AF37]">
                    <h5 className="font-bold text-[#01411C] mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      معاينة الرابط على المنصة
                    </h5>
                    <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded border">
                      apptitie-usertitile.com/{propertyData.platformPath.replace(/\s*\/\s*/g, '/')}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="mt-2 border-[#01411C] text-[#01411C]"
                      onClick={() => window.open(`https://apptitie-usertitile.com/${propertyData.platformPath.replace(/\s*\/\s*/g, '/')}`, '_blank')}
                    >
                      <Link className="w-3 h-3 mr-1" />
                      فتح الرابط
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* المواصفات التفصيلية */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C]">المواصفات التفصيلية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* خيارات المدخل والموقع */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-[#01411C]">نوع المدخل</Label>
                    <Select value={propertyData.entranceType} onValueChange={(value) => setPropertyData(prev => ({ ...prev, entranceType: value }))}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        {entranceTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#01411C]">موقع العقار</Label>
                    <Input 
                      value={propertyData.propertyLocation}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, propertyLocation: e.target.value }))}
                      placeholder="الموقع التفصيلي"
                      className="border-[#D4AF37] focus:border-[#01411C]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#01411C]">مستوى العقار</Label>
                    <Select value={propertyData.propertyLevel} onValueChange={(value) => setPropertyData(prev => ({ ...prev, propertyLevel: value }))}>
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* المواصفات التفصيلية بدون عدادات (262) */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-[#01411C] mb-3 text-right">📊 المواصفات التفصيلية (262)</h5>
                  <p className="text-sm text-gray-600 text-right">أدخل الأرقام مباشرة - تم إزالة العدادات لتحسين تجربة الهواتف</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'bedrooms', label: 'غرف النوم', icon: Bed },
                      { key: 'bathrooms', label: 'دورات المياه', icon: Bath },
                      { key: 'warehouses', label: 'مستودعات', icon: Building },
                      { key: 'balconies', label: 'بلكونات', icon: Maximize },
                      { key: 'curtains', label: 'ستائر', icon: Building },
                      { key: 'airConditioners', label: 'مكيفات', icon: Building },
                      { key: 'privateParking', label: 'مواقف خاصة', icon: Building },
                      { key: 'floors', label: 'الطوابق', icon: Building }
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
                        <Label className="text-[#01411C] text-sm block mb-2 text-right flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </Label>
                        
                        {/* حقل إدخال مباشر بدون عدادات */}
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={propertyData[key] || ''}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
                            setPropertyData(prev => ({ ...prev, [key]: value }));
                          }}
                          className="h-12 text-center border-[#D4AF37] focus:border-[#01411C] text-lg font-bold"
                          placeholder="00"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المميزات المخصصة (266) - نظام محسّن ومبسّط */}
            <Card className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-[#01411C] text-right flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                      المميزات المخصص�� (266)
                    </CardTitle>
                    <p className="text-sm text-gray-600 text-right mt-1">
                      اختر أو أضف مميزات عقارك - تظهر تلقائياً في الوصف
                    </p>
                  </div>
                  
                  {/* مؤشر الذكاء الاصطناعي المدمج */}
                  {propertyData.customFeatures.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-2 rounded-lg border border-purple-300">
                      <div className="flex items-center gap-2">
                        <div className="text-purple-700 text-xs text-right">
                          <p className="font-bold">🧠 AI نشط</p>
                          <p className="text-[10px]">{propertyData.customFeatures.length} ميزة</p>
                        </div>
                        <div className="w-px h-8 bg-purple-300"></div>
                        <div className="text-purple-700 text-xs">
                          <p className="font-bold">{dynamicFeatures.length}</p>
                          <p className="text-[10px]">شائعة 🔥</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* المميزات - عرض مبسط */}
                <div className="flex flex-wrap gap-2">
                  {/* المميزات الأساسية */}
                  {[
                    'جاكوزي', 'مسبح', 'صالة رياضية', 'حديقة', 
                    'إضاءة ذكية', 'نظام أمني', 'كاميرات مراقبة', 'ألواح شمسية',
                    'تدفئة مركزية', 'مصعد', 'غرفة خادمة', 'غرفة سائق'
                  ].map((label) => {
                    const key = {
                      'جاكوزي': 'jacuzzi',
                      'مسبح': 'swimmingPool',
                      'صالة رياضية': 'gym',
                      'حديقة': 'garden',
                      'إضاءة ذكية': 'smartLighting',
                      'نظام أمني': 'securitySystem',
                      'كاميرات مراقبة': 'cctv',
                      'ألواح شمسية': 'solarPanels',
                      'تدفئة مركزية': 'centralHeating',
                      'مصعد': 'elevator',
                      'غرفة خادمة': 'maidsRoom',
                      'غرفة سائق': 'driverRoom'
                    }[label];
                    
                    const isActive = propertyData[key] > 0;
                    
                    return (
                      <Badge
                        key={key}
                        className={`cursor-pointer px-3 py-1.5 text-xs relative group transition-all ${
                          isActive
                            ? 'bg-[#01411C] text-white hover:bg-[#065f41]'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:bg-gray-50'
                        }`}
                        onClick={() => toggleBasicFeature(key, label)}
                      >
                        {label} {isActive && '✓'}
                        {isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPropertyData(prev => ({ ...prev, [key]: 0 }));
                              removeCustomFeature(label);
                            }}
                            className="absolute -left-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                  
                  {/* المميزات الديناميكية (الشائعة) */}
                  {dynamicFeatures.map((feature, index) => {
                    const isActive = propertyData.customFeatures.includes(feature);
                    return (
                      <Badge
                        key={`dynamic-${index}`}
                        className={`cursor-pointer px-3 py-1.5 text-xs relative group transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-2 border-amber-600'
                            : 'bg-white border-2 border-amber-400 text-amber-700 hover:bg-amber-50'
                        }`}
                        onClick={() => {
                          if (isActive) {
                            removeCustomFeature(feature);
                          } else {
                            const updatedFeatures = [...propertyData.customFeatures, feature];
                            setPropertyData(prev => ({
                              ...prev,
                              customFeatures: updatedFeatures
                            }));
                            localStorage.setItem('customPropertyFeatures', JSON.stringify(updatedFeatures));
                            trackFeatureUsage(feature);
                          }
                        }}
                      >
                        🔥 {feature} {isActive && '✓'}
                        {isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomFeature(feature);
                            }}
                            className="absolute -left-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    );
                  })}
                </div>

                {/* إضافة ميزة جديدة - مبسط */}
                <div className="flex gap-2">
                  <Input
                    value={newCustomFeature}
                    onChange={(e) => setNewCustomFeature(e.target.value)}
                    placeholder="أضف ميزة جديدة... (مثال: إطلالة بحرية، قريب من المسجد)"
                    className="flex-1 text-right"
                    dir="rtl"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomFeature();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addCustomFeature}
                    disabled={!newCustomFeature.trim()}
                    className="bg-[#01411C] text-white hover:bg-[#065f41]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    إضافة
                  </Button>
                </div>

                {/* قسم الشروحات الموحد - بالأسفل */}
                <div className="mt-4 space-y-2 p-4 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <h4 className="font-bold text-[#01411C] text-right flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    دليل الاستخدام السريع
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-right">
                    {/* كيفية الإضافة */}
                    <div className="bg-white p-3 rounded border border-green-300">
                      <p className="font-bold text-green-700 mb-2 text-right">✅ كيفية الإضافة:</p>
                      <ul className="space-y-1 text-green-600 text-right">
                        <li>• اكتب الميزة في الحقل أعلاه</li>
                        <li>• اضغط "إضافة" أو Enter</li>
                        <li>• ستظهر فوراً مع علامة 🔥</li>
                      </ul>
                    </div>
                    
                    {/* كيفية الحذف */}
                    <div className="bg-white p-3 rounded border border-red-300">
                      <p className="font-bold text-red-700 mb-2 text-right">🗑️ كيفية الحذف:</p>
                      <ul className="space-y-1 text-red-600 text-right">
                        <li>• مرّر الماوس على أي ميزة مُفعّلة</li>
                        <li>• اضغط زر X الأحمر</li>
                        <li>• أو: اضغط الميزة لإلغاء تفعيلها</li>
                      </ul>
                    </div>
                    
                    {/* الذكاء الاصطناعي */}
                    <div className="bg-white p-3 rounded border border-purple-300">
                      <p className="font-bold text-purple-700 mb-2 text-right">🧠 الذكاء الاصطناعي:</p>
                      <ul className="space-y-1 text-purple-600 text-right">
                        <li>• يتتبع استخدام كل ميزة</li>
                        <li>• المستخدمة كثيراً تبقى دائماً</li>
                        <li>• غير المستخدمة 11 إعلان تُحذف</li>
                      </ul>
                    </div>
                    
                    {/* الارتباط بالوصف */}
                    <div className="bg-white p-3 rounded border border-blue-300">
                      <p className="font-bold text-blue-700 mb-2 text-right">📝 مرتبط بالوصف (267):</p>
                      <ul className="space-y-1 text-blue-600 text-right">
                        <li>• كل ميزة تُضاف → تظهر في الوصف</li>
                        <li>• كل ميزة تُحذف → تختفي من الوصف</li>
                        <li>• تحديث فوري وتلقائي</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* نصائح إضافية */}
                  <div className="bg-white p-3 rounded border border-yellow-300 mt-2">
                    <p className="font-bold text-yellow-700 mb-2 text-right">💡 نصائح مهمة:</p>
                    <ul className="space-y-1 text-yellow-600 text-xs text-right">
                      <li>• أضف مميزات فريدة تميز عقارك عن غيره</li>
                      <li>• اذكر الموقع الاستراتيجي (قرب المدارس، المستشفيات، المساجد)</li>
                      <li>• وضّح التشطيبات الخاصة أو التحديثات الحديثة</li>
                      <li>• المميزات المضافة تُحفظ تلقائياً ولا تحتاج لإعادة كتابتها</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* الضمانات والكفالات */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  الضمانات والكفالات
                </CardTitle>
                <Button
                  type="button"
                  size="sm"
                  onClick={addWarranty}
                  className="bg-[#D4AF37] text-[#01411C] hover:bg-[#b8941f] rounded-full w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {propertyData.warranties.map((warranty, index) => (
                  <div key={warranty.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-[#01411C]">ضمان {index + 1}</h5>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeWarranty(warranty.id)}
                        className="w-8 h-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#01411C]">نوع الضمان</Label>
                        <Select 
                          value={warranty.type} 
                          onValueChange={(value) => updateWarranty(warranty.id, 'type', value)}
                        >
                          <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            {warrantyTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[#01411C]">مدة الضمان</Label>
                        <Select 
                          value={warranty.duration} 
                          onValueChange={(value) => updateWarranty(warranty.id, 'duration', value)}
                        >
                          <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C]">
                            <SelectValue placeholder="اختر المدة" />
                          </SelectTrigger>
                          <SelectContent>
                            {warrantyDurations.map((duration) => (
                              <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#01411C]">ملاحظات الضمان</Label>
                      <Textarea
                        value={warranty.notes}
                        onChange={(e) => updateWarranty(warranty.id, 'notes', e.target.value)}
                        placeholder="ملاحظات إضافية..."
                        className="border-[#D4AF37] focus:border-[#01411C] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>



            {/* السعر النهائي مع تقديرات السوق */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2 text-right">
                  <DollarSign className="w-5 h-5" />
                  السعر النهائي (ريال سعودي) *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  type="number"
                  value={propertyData.finalPrice}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, finalPrice: e.target.value }))}
                  placeholder="ادخل السعر النهائي"
                  className="border-[#D4AF37] focus:border-[#01411C] text-right"
                  dir="rtl"
                />
                
                {/* مقدر الأسعار المحدث (296) */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-300">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <h5 className="font-bold text-blue-800 text-right">💡 مولد الأسعار (296)</h5>
                    <Button 
                      size="sm" 
                      onClick={fetchMarketData}
                      className="bg-blue-600 text-white hover:bg-blue-700 text-xs"
                    >
                      تحديث البيانات
                    </Button>
                  </div>
                  
                  <p className="text-sm text-blue-700 mb-3 text-right">
                    بناءً على: {propertyData.locationDetails.city && propertyData.locationDetails.district ? 
                      `${propertyData.locationDetails.city} - ${propertyData.locationDetails.district}` : 'لم يتم تحديد الموقع'} 
                    {propertyData.area ? ` - ${propertyData.area} م²` : ''} 
                    {propertyData.propertyType ? ` - ${propertyData.propertyType}` : ''}
                  </p>

                  {/* عرض بيانات السوق من المصادر */}
                  <div className="space-y-3">
                    {propertyData.marketData.length > 0 ? (
                      propertyData.marketData.map((market, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
                          onClick={() => window.open(market.url, '_blank')}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-blue-600" />
                              <span className="font-bold text-blue-800 text-sm">{market.source}</span>
                            </div>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPropertyData(prev => ({ 
                                  ...prev, 
                                  finalPrice: market.avgPrice.toString(),
                                  selectedMarketPrice: market.avgPrice
                                }));
                              }}
                              className="bg-green-600 text-white hover:bg-green-700 text-xs px-2 py-1"
                            >
                              استخدام هذا السعر
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-bold text-red-600">{market.minPrice.toLocaleString()}</div>
                              <div className="text-gray-600">أقل</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-green-600">{market.avgPrice.toLocaleString()}</div>
                              <div className="text-gray-600">متوسط</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-blue-600">{market.maxPrice.toLocaleString()}</div>
                              <div className="text-gray-600">أعلى</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-purple-600">{market.pricePerSqm.toLocaleString()}</div>
                              <div className="text-gray-600">سعر المتر</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        <p className="text-sm">لا توجد بيانات سوق متاحة</p>
                        <p className="text-xs mt-1">يرجى تحديد الموقع وتفاصيل العقار أولاً</p>
                      </div>
                    )}
                  </div>

                  {/* مقارنة السعر المدخل بالسوق */}
                  {propertyData.finalPrice && propertyData.marketData.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <h6 className="font-bold text-gray-800 text-sm text-right mb-2">تحليل السعر المدخل:</h6>
                      {(() => {
                        const inputPrice = parseInt(propertyData.finalPrice);
                        const avgMarketPrice = propertyData.marketData.reduce((sum, m) => sum + m.avgPrice, 0) / propertyData.marketData.length;
                        const difference = ((inputPrice - avgMarketPrice) / avgMarketPrice) * 100;
                        
                        if (difference < -10) {
                          return (
                            <div className="flex items-center gap-2 text-green-700">
                              <Check className="w-4 h-4" />
                              <span className="text-sm">أقل من سعر السوق بـ {Math.abs(difference).toFixed(1)}% - سعر مناسب ومنافس</span>
                            </div>
                          );
                        } else if (difference > 10) {
                          return (
                            <div className="flex items-center gap-2 text-red-700">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">أعلى من سعر السوق بـ {difference.toFixed(1)}% - قد يكون مبالغ فيه</span>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center gap-2 text-blue-700">
                              <Check className="w-4 h-4" />
                              <span className="text-sm">سعر متوسط ومناسب للسوق (فرق {Math.abs(difference).toFixed(1)}%)</span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>





            {/* ال��اشتاقات التلقائية */}
            <Card className="border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-[#01411C] flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  الهاشتاقات التلقائية
                </CardTitle>
                <p className="text-sm text-gray-600">
                  تحديث تلقائي من المواصفات والضمانات
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {propertyData.autoHashtags.map((tag, index) => (
                    <Badge key={index} className="bg-[#f0fdf4] text-[#01411C] border-[#D4AF37]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2">البيانات ا��مقروءة:</p>
                  <div className="flex flex-wrap gap-2">
                    {propertyData.propertyType && (
                      <Badge className="bg-green-100 text-green-700">
                        🏠 النوع: {propertyData.propertyType}
                      </Badge>
                    )}
                    {propertyData.warranties.length > 0 && (
                      <Badge className="bg-blue-100 text-blue-700">
                        🛡️ ضمانات: {propertyData.warranties.length}
                      </Badge>
                    )}
                    {propertyData.bedrooms > 0 && (
                      <Badge className="bg-purple-100 text-purple-700">
                        🛏️ غرف: {propertyData.bedrooms}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* مولد الوصف بالذكاء الاصطناعي (378) */}
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2 text-right">
                  <Bot className="w-5 h-5" />
                  مولد الوصف بالذكاء الاصطناعي (378)
                </CardTitle>
                <p className="text-sm text-blue-700 text-right">
                  يقرأ: الحي والمدينة والمساحة + جميع المميزات ما عدا البيانات الأساسية (255) والوثائق (259)
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#01411C] text-right text-sm">اللغة</Label>
                    <Select 
                      value={propertyData.aiDescription.language} 
                      onValueChange={(value) => setPropertyData(prev => ({ 
                        ...prev, 
                        aiDescription: { ...prev.aiDescription, language: value }
                      }))}
                    >
                      <SelectTrigger className="border-[#D4AF37] focus:border-[#01411C] text-right h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">عربي</SelectItem>
                        <SelectItem value="en">إنجليزي</SelectItem>
                        <SelectItem value="bilingual">عربي وإنجليزي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#01411C] text-right text-sm">رقم الواتساب</Label>
                    <Input 
                      value={propertyData.whatsappNumber}
                      onChange={(e) => setPropertyData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="+966501234567"
                      className="border-[#D4AF37] focus:border-[#01411C] text-right h-8 text-sm"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-[#01411C] text-right mb-2 block text-sm">النبرة</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "professional", label: "مهني", color: "bg-blue-50 border-blue-300 text-blue-700" },
                      { value: "marketing", label: "تسويقي", color: "bg-green-50 border-green-300 text-green-700" },
                      { value: "luxury", label: "فاخر", color: "bg-purple-50 border-purple-300 text-purple-700" }
                    ].map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => setPropertyData(prev => ({ 
                          ...prev, 
                          aiDescription: { ...prev.aiDescription, tone: tone.value }
                        }))}
                        className={`ai-tone-selector p-2 border-2 rounded-lg text-center transition-all text-sm ${
                          propertyData.aiDescription.tone === tone.value 
                            ? "selected border-[#01411C] bg-[#01411C] text-white" 
                            : `${tone.color} hover:border-[#D4AF37]`
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-[#01411C] text-right text-sm">رقم الترخيص الإعلاني</Label>
                  <Input 
                    value={propertyData.advertisingLicense}
                    onChange={(e) => setPropertyData(prev => ({ ...prev, advertisingLicense: e.target.value }))}
                    placeholder="أدخل رقم الترخيص الإعلاني"
                    className="border-[#D4AF37] focus:border-[#01411C] text-right h-8 text-sm"
                    dir="rtl"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    يُضاف تلقائياً أسفل السعر في الوصف
                  </p>
                </div>
                
                <Button 
                  onClick={generateAIDescription}
                  className="w-full ai-generate-button bg-gradient-to-r from-[#01411C] to-[#065f41] text-white touch-manipulation"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  توليد الوصف بالذكاء الاصطناعي
                </Button>
                
                {propertyData.aiDescription.generatedText && (
                  <Textarea
                    value={propertyData.aiDescription.generatedText}
                    onChange={(e) => setPropertyData(prev => ({ 
                      ...prev, 
                      aiDescription: { ...prev.aiDescription, generatedText: e.target.value }
                    }))}
                    className="ai-description-textarea border-[#D4AF37] focus:border-[#01411C] min-h-[150px] text-right"
                    dir="rtl"
                  />
                )}
                

                
                <div className="text-sm text-gray-600 text-right">
                  <p>سيتم إضافة تلقائياً:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>رقم الترخيص الإعلاني أسفل السعر</li>
                    <li>💡 اقتراحات السعر المحدد مع تفاصيل الرسوم</li>
                    <li>رقم الواتساب في نهاية الإعلان</li>
                    <li>🏷️ هاشتاقات ذكية باللغة العربية والإنجليزية</li>
                    <li>الضمانات مترجمة ب��لكامل للإنجليزية</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* العمود الأيمن: اختبار المنصات (273) */}
      <div className="space-y-4">
        <Card className="border-2 border-[#D4AF37]">
          <CardHeader>
            <CardTitle className="text-[#01411C] text-right">اختبار المنصات (273)</CardTitle>
            <p className="text-sm text-gray-600 text-right">
              المنصات المتاحة فقط - {Object.values(platformStatus).filter(status => status === 'available').length} منصة متاحة
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {platforms
                .filter(platform => platformStatus[platform.id] === 'available')
                .map((platform) => (
                <div 
                  key={platform.id}
                  className={`p-2 border-2 rounded-lg cursor-pointer touch-manipulation transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-[#01411C] bg-green-50 scale-105'
                      : 'border-gray-200 hover:border-[#D4AF37]'
                  }`}
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes(platform.id)
                        ? prev.filter(id => id !== platform.id)
                        : [...prev, platform.id]
                    );
                  }}
                >
                  <div className="text-center">
                    <div className="text-xs font-bold" style={{ color: platform.color }}>
                      {platform.name}
                    </div>
                    <div className="text-sm text-green-600">✓ متاح</div>
                    {selectedPlatforms.includes(platform.id) && (
                      <Check className="w-3 h-3 text-green-600 mx-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {Object.values(platformStatus).filter(status => status === 'available').length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <div className="text-sm">لا توجد منصات متاحة</div>
                <div className="text-xs mt-1">يرجى التحقق من المنصات في تبويب "ربط المنصات"</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* إظهار المنصات المرتبطة سابقاً عند النشر */}
        {isUploading && (
          <Card className="border-2 border-[#D4AF37]">
            <CardHeader>
              <CardTitle className="text-[#01411C] text-right">المنصات المرتبطة</CardTitle>
              <p className="text-sm text-gray-600 text-right">حالة النشر على المنصات</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find(p => p.id === platformId);
                  if (!platform) return null;
                  
                  // محاكاة حالات النشر مع إضافة الربط الخاطئ
                  const random = Math.random();
                  const publishStatus = random > 0.6 ? 'success' : random > 0.4 ? 'loading' : random > 0.2 ? 'error' : 'invalid-link';
                  
                  return (
                    <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        ></div>
                        <span className="font-medium text-[#01411C]">{platform.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {publishStatus === 'loading' && (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-blue-600">جاري النشر...</span>
                          </>
                        )}
                        {publishStatus === 'success' && (
                          <>
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-sm text-green-600">تم النشر ✓</span>
                          </>
                        )}
                        {publishStatus === 'error' && (
                          <>
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="text-sm text-red-600">فشل النشر ✗</span>
                          </>
                        )}
                        {publishStatus === 'invalid-link' && (
                          <>
                            <div className="w-4 h-4 rounded-full bg-gray-400 opacity-50"></div>
                            <span className="text-sm text-gray-500">ربط غير صحيح</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* أزرار الإجراءات */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full border-gray-300"
            onClick={() => setPropertyData({
              fullName: "", birthDate: "", idNumber: "", idIssueDate: "", idExpiryDate: "", 
              phoneNumber: "", deedNumber: "", deedDate: "", deedIssuer: "",
              propertyType: "", category: "", purpose: "", area: "",
              entranceType: "", propertyLocation: "", propertyLevel: "",
              bedrooms: 0, bathrooms: 0, warehouses: 0, balconies: 0,
              curtains: 0, airConditioners: 0, privateParking: 0, floors: 1,
              // إعادة تعيين المميزات الفاخرة
              jacuzzi: 0, rainShower: 0, smartLighting: 0, solarPanels: 0,
              securitySystem: 0, centralHeating: 0, swimmingPool: 0, gym: 0,
              garden: 0, elevator: 0, generator: 0, intercom: 0, cctv: 0,
              fireAlarm: 0, kitchenAppliances: 0, builtInWardrobe: 0,
              ceramicFlooring: 0, marbleFlooring: 0, parquetFlooring: 0,
              paintedWalls: 0, wallpaper: 0, soundproofing: 0,
              thermalInsulation: 0, waterproofing: 0, fiberOptic: 0,
              satelliteDish: 0, laundryRoom: 0, maidsRoom: 0, driverRoom: 0,
              guestRoom: 0, office: 0, library: 0, playroom: 0,
              storageRoom: 0, basement: 0, attic: 0, terrace: 0,
              patio: 0, barbecueArea: 0,
              warranties: [], finalPrice: "", virtualTourLink: "",
              aiDescription: { language: "ar", tone: "professional", generatedText: "" },
              advertisingLicense: "", whatsappNumber: "+966",
              autoHashtags: [], platformPath: "", mediaFiles: []
            })}
          >
            <X className="w-4 h-4 mr-2" />
            إلغاء
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-[#D4AF37] text-[#D4AF37]"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            معاينة
          </Button>
          <Button 
            className="w-full bg-[#01411C] text-white hover:bg-[#023a1a] transition-all"
            onClick={async () => {
              const savedAd = await handlePublishAndSaveAd();
              if (savedAd) {
                alert(`✅ تم حفظ العرض في لوحة التحكم!\n\nرقم الإعلان: ${savedAd.adNumber}\n\n📌 يمكنك:\n• مراجعة العرض في لوحة التحكم\n• نشره على منصتي متى تريد`);
              }
            }}
            disabled={isUploading}
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ العرض
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 font-bold hover:shadow-lg transition-all"
            onClick={async () => {
              const savedAd = await handlePublishAndSaveAd();
              if (savedAd) {
                // 🔄 التوجه إلى لوحة التحكم (وليس منصتي)
                alert(`✅ تم حفظ الإعلان في لوحة التحكم!\n\nرقم الإعلان: ${savedAd.adNumber}\n\n📌 يمكنك الآن:\n• مراجعة الإعلان في لوحة التحكم\n• نشره على منصتي العامة عبر زر "نشر على منصتي"`);
                
                // إغلاق صفحة النشر بعد ثانية
                setTimeout(() => {
                  onBack();
                }, 1000);
              }
            }}
            disabled={isUploading}
          >
            <Archive className="w-5 h-5 mr-2" />
            حفظ وإغلاق الإعلان
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white text-lg py-3 font-bold hover:shadow-xl transition-all"
            onClick={handlePublish}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري النشر...</span>
              </div>
            ) : (
              <>
                🚀 نشر العقار الآن
              </>
            )}
          </Button>
          
          {selectedPlatforms.length > 0 ? (
            <p className="text-sm text-gray-600 text-center">
              سيتم نشر العقار على {selectedPlatforms.length} منصة مع جميع البيانات والضمانات
            </p>
          ) : (
            <p className="text-sm text-orange-600 text-center">
              💡 لم يتم اختيار منصات - سيتم حفظ الإعلان في لوحة التحكم فقط
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // التبويب الثالث: التحليل والبيانات
  const renderAnalyticsData = () => (
    <div className="space-y-6">
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader>
          <CardTitle className="text-[#01411C]">تحليل أداء آخر 30 يوم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.filter(p => platformStatus[p.id] === 'available').map((platform) => (
              <Card key={platform.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: platform.color }}>{platform.status}</span>
                    <h4 className="font-bold" style={{ color: platform.color }}>
                      {platform.name}
                    </h4>
                    <span className="text-sm text-gray-500">آخر 30 يوم</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="text-blue-600 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        المشاهدات
                      </span>
                      <span className="font-bold">1,234</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span className="text-red-600 flex items-center gap-1">
                        ❤️ الإعجابات
                      </span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-green-600 flex items-center gap-1">
                        💬 التعليقات
                      </span>
                      <span className="font-bold">23</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span className="text-purple-600 flex items-center gap-1">
                        🔄 المشاركات
                      </span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-bold text-[#D4AF37]">8.5%</span>
                      <span className="text-sm text-gray-600">معدل التفاعل</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 mt-2">
                      ممتاز ≥8%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#D4AF37]">
        <CardHeader>
          <CardTitle className="text-[#01411C]">ملخص الأداء العام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-[#01411C]">4,567</p>
              <p className="text-gray-600">إجمالي المشاهدات</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-[#D4AF37]">234</p>
              <p className="text-gray-600">إجمالي الإعجابات</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-[#01411C]">67</p>
              <p className="text-gray-600">إجمالي التعليقات</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-[#D4AF37]">7.2%</p>
              <p className="text-gray-600">متوسط التفاعل</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-[#ffffff] property-upload-container" dir="rtl">
      {/* Header الثابت */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4]"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            عودة
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#01411C]">نشر العقارات على المنصات (251)</h1>
            <p className="text-sm text-gray-600">إدارة ونشر العقارات على جميع المنصات العقارية</p>
            <Badge className="bg-green-100 text-green-700 mt-1">
              مقدر الأسعار محدث للسوق السعودي
            </Badge>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-8 px-4 max-w-7xl mx-auto">
        {/* ✅ زر تحديث لإعلان جديد */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => {
              // ✅ التحقق من وجود بيانات مهمة
              const hasImportantData = 
                propertyData.fullName || 
                propertyData.phoneNumber || 
                propertyData.propertyType || 
                propertyData.area ||
                propertyData.mediaFiles.length > 0 ||
                propertyData.finalPrice;
              
              if (hasImportantData) {
                // 🔍 عد الحقول المعبأة
                const filledFieldsCount = [
                  propertyData.fullName,
                  propertyData.phoneNumber,
                  propertyData.propertyType,
                  propertyData.area,
                  propertyData.finalPrice
                ].filter(Boolean).length + propertyData.mediaFiles.length;
                
                // ⚠️ تحذير المستخدم
                const shouldClear = confirm(
                  `⚠️ تحذير: يوجد بيانات معبأة!\n\n` +
                  `📊 عدد الحقول المعبأة: ${filledFieldsCount}\n` +
                  `📷 عدد الصور: ${propertyData.mediaFiles.length}\n\n` +
                  `💾 تم حفظ البيانات تلقائياً في المسودة\n` +
                  `🔄 يمكنك استعادتها لاحقاً عند فتح الصفحة\n\n` +
                  `❌ هل تريد حقاً مسح جميع البيانات والبدء من جديد؟`
                );
                
                if (!shouldClear) {
                  return; // إلغاء العملية
                }
              }
              
              // مسح جميع البيانات
              setPropertyData({
                fullName: "", birthDate: "", idNumber: "", idIssueDate: "", idExpiryDate: "", 
                phoneNumber: "", deedNumber: "", deedDate: "", deedIssuer: "",
                propertyType: "", category: "", purpose: "", area: "",
                entranceType: "", propertyLocation: "", propertyLevel: "",
                bedrooms: 0, bathrooms: 0, warehouses: 0, balconies: 0,
                curtains: 0, airConditioners: 0, privateParking: 0, floors: 1,
                jacuzzi: 0, rainShower: 0, smartLighting: 0, solarPanels: 0,
                securitySystem: 0, centralHeating: 0, swimmingPool: 0, gym: 0,
                garden: 0, elevator: 0, generator: 0, intercom: 0, cctv: 0,
                fireAlarm: 0, kitchenAppliances: 0, builtInWardrobe: 0,
                ceramicFlooring: 0, marbleFlooring: 0, parquetFlooring: 0,
                paintedWalls: 0, wallpaper: 0, soundproofing: 0,
                thermalInsulation: 0, waterproofing: 0, fiberOptic: 0,
                satelliteDish: 0, laundryRoom: 0, maidsRoom: 0, driverRoom: 0,
                guestRoom: 0, office: 0, library: 0, playroom: 0,
                storageRoom: 0, basement: 0, attic: 0, terrace: 0,
                patio: 0, barbecueArea: 0,
                warranties: [], finalPrice: "", virtualTourLink: "",
                aiDescription: { language: "ar", tone: "professional", generatedText: "" },
                advertisingLicense: "", whatsappNumber: "+966",
                autoHashtags: [], platformPath: "", mediaFiles: [],
                customFeatures: [],
                locationDetails: {
                  city: "", district: "", street: "", postalCode: "",
                  buildingNumber: "", additionalNumber: "", latitude: 0, longitude: 0
                },
                advertisingLicenseStatus: 'unknown',
                useMapPicker: false,
                marketData: [],
                selectedMarketPrice: 0,
                priceComparison: 'unknown'
              });
              
              // مسح الصور
              setUploadedImages([]);
              
              // مسح المسودة الم��فوظة
              localStorage.removeItem('property_draft_data');
              
              // إظهار رسالة نجاح
              alert('✅ تم مسح جميع البيانات والصور بنجاح!\n\n🆕 يمكنك الآن إضافة إعلان جديد');
              
              console.log('🔄 تم تحديث النموذج لإعلان جديد');
            }}
            className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg"
          >
            <Plus className="w-5 h-5 ml-2" />
            تحديث لإعلان جديد
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* شريط التبويبات */}
          <div className="property-tabs-container mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-[#D4AF37]" dir="rtl">
              <TabsTrigger 
                value="linking" 
                className="property-tab-button data-[state=active]:bg-[#01411C] data-[state=active]:text-white touch-manipulation"
              >
                🔗 ربط المنصات
              </TabsTrigger>
              <TabsTrigger 
                value="create-ad" 
                className="property-tab-button data-[state=active]:bg-[#01411C] data-[state=active]:text-white touch-manipulation"
              >
                📝 إنشاء الإعلان
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="property-tab-button data-[state=active]:bg-[#01411C] data-[state=active]:text-white touch-manipulation"
              >
                📊 التحليل والبيانات
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="linking">
              {renderPlatformLinking()}
            </TabsContent>

            <TabsContent value="create-ad">
              {renderCreateAd()}
            </TabsContent>

            <TabsContent value="analytics">
              {renderAnalyticsData()}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* مودال المعاينة */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#01411C]">معاينة الإعلان</h2>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#f0fdf4] to-[#fffef7] p-4 rounded-lg">
                  <h3 className="font-bold text-[#01411C] mb-2">
                    {propertyData.propertyType} {propertyData.purpose}
                  </h3>
                  {propertyData.aiDescription.generatedText && (
                    <p className="text-gray-700">{propertyData.aiDescription.generatedText}</p>
                  )}
                  {propertyData.finalPrice && (
                    <p className="text-2xl font-bold text-[#D4AF37] mt-2">
                      {parseInt(propertyData.finalPrice).toLocaleString()} ريال
                    </p>
                  )}
                </div>
                
                {propertyData.autoHashtags.length > 0 && (
                  <div>
                    <h4 className="font-bold text-[#01411C] mb-2">الهاشتاقات:</h4>
                    <div className="flex flex-wrap gap-2">
                      {propertyData.autoHashtags.map((tag, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}