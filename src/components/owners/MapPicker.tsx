import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, X, Search, Navigation, CheckCircle, AlertTriangle, Wifi } from "lucide-react";
import { Address } from "../../types/owners";

// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
    googleMapsLoaded?: boolean;
  }
}

// مدير تحميل Google Maps المحسن لمنع التحميل المتكرر
let googleMapsLoading = false;
let googleMapsPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
  // إذا كان Google Maps محمل بالفعل
  if (window.google && window.google.maps && window.google.maps.Map) {
    return Promise.resolve();
  }

  // إذا كان هناك تحميل جاري
  if (googleMapsLoading && googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsLoading = true;
  googleMapsPromise = new Promise((resolve, reject) => {
    // إزالة script مكرر إن وجد
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // إزالة معالجات مكررة
    if (window.initMap) {
      delete window.initMap;
    }

    // تحقق من وجود مفتاح API - تحسن معالجة مفاتيح متعددة
    let apiKey;
    try {
      // البحث في عدة مواقع محتملة للمفتاح
      apiKey = localStorage.getItem('googleMapsApiKey') ||
               (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : undefined) ||
               (typeof window !== 'undefined' && (window as any).GOOGLE_MAPS_API_KEY);
    } catch (e) {
      apiKey = undefined;
    }
    
    // إذا لم يتم العثور على مفتاح صحيح، استخدم الوضع البديل مباشرة
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' || apiKey.trim() === '') {
      googleMapsLoading = false;
      googleMapsPromise = null;
      // لا نرمي خطأ، بل نرفض بهدوء للانتقال للوضع البديل
      reject(new Error('FALLBACK_MODE'));
      return;
    }

    // إنشاء معرف فريد للمعالج
    const callbackName = `initGoogleMaps_${Date.now()}`;
    
    // إنشاء script جديد
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';

    // معالج تحميل ناجح
    (window as any)[callbackName] = () => {
      googleMapsLoading = false;
      googleMapsPromise = null;
      // تنظيف المعالج
      delete (window as any)[callbackName];
      resolve();
    };

    // معالج خطأ في التحميل
    script.onerror = (event) => {
      googleMapsLoading = false;
      googleMapsPromise = null;
      script.remove();
      delete (window as any)[callbackName];
      
      // تحديد نوع الخطأ
      let errorMessage = 'فشل في تحميل Google Maps API';
      if (!navigator.onLine) {
        errorMessage = 'لا يوجد اتصال بالإنترنت. سيتم استخدام وضع الإدخال اليدوي.';
      }
      
      reject(new Error(errorMessage));
    };

    // إضافة timeout للحماية من التعليق
    const timeoutId = setTimeout(() => {
      if (googleMapsLoading) {
        googleMapsLoading = false;
        googleMapsPromise = null;
        script.remove();
        delete (window as any)[callbackName];
        reject(new Error('انتهت مهلة تحميل Google Maps API'));
      }
    }, 15000);

    // تنظيف timeout عند النجاح
    const originalCallback = (window as any)[callbackName];
    (window as any)[callbackName] = () => {
      clearTimeout(timeoutId);
      originalCallback();
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

interface MapPickerProps {
  address?: Address;
  onAddressSelect: (address: Address) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function MapPicker({ address, onAddressSelect, onClose, isOpen }: MapPickerProps) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(address || null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mapsReady, setMapsReady] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // تهيئة الخريطة مع معالجة شاملة للأخطاء
  const initializeMap = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setFallbackMode(false);

      // تحميل Google Maps إذا لم يكن محملاً
      if (!window.google || !window.google.maps || !window.google.maps.Map) {
        await loadGoogleMapsScript();
      }

      // التأكد من أن المكتبة محملة بالكامل
      if (!window.google || !window.google.maps || !window.google.maps.Map) {
        throw new Error('فشل في تحميل مكتبة Google Maps');
      }

      // التحقق من وجود الحاوية
      if (!mapRef.current) {
        throw new Error('حاوية الخريطة غير موجودة');
      }

      // الموقع الافتراضي (الرياض)
      const defaultCenter = { lat: 24.7136, lng: 46.6753 };
      const center = selectedAddress?.latitude && selectedAddress?.longitude 
        ? { lat: selectedAddress.latitude, lng: selectedAddress.longitude }
        : defaultCenter;

      // إنشاء الخريطة
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: center,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        restriction: {
          latLngBounds: {
            north: 32.0,
            south: 16.0,
            west: 34.0,
            east: 56.0
          }
        }
      });

      // إنشاء المؤشر
      const markerInstance = new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: true,
        title: 'اسحب لتحديد الموقع'
      });

      // معالج سحب المؤشر
      markerInstance.addListener('dragend', async (event: any) => {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        await reverseGeocode(position);
      });

      // معالج النقر على الخريطة
      mapInstance.addListener('click', async (event: any) => {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        markerInstance.setPosition(position);
        await reverseGeocode(position);
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      // تهيئة البحث التلقائي
      if (searchRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          searchRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'sa' },
            fields: ['place_id', 'geometry', 'formatted_address', 'address_components']
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const position = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            
            mapInstance.setCenter(position);
            markerInstance.setPosition(position);
            
            processPlaceResult(place);
          }
        });

        autocompleteRef.current = autocomplete;
      }

      setMapsReady(true);

    } catch (err: any) {
      console.warn('Maps not available, using manual input mode:', err.message);
      setFallbackMode(true);
      
      // تحديد نوع الخطأ - بدون عرض رسائل خطأ مزعجة
      let errorMessage = '';
      
      if (err.message === 'FALLBACK_MODE') {
        // الانتقال للوضع البديل بصمت
        errorMessage = '';
      } else if (err.message.includes('مفتاح Google Maps API') || err.message.includes('InvalidKey')) {
        errorMessage = '';
      } else if (err.message.includes('انتهت مهلة')) {
        errorMessage = 'تم التبديل إلى الإدخال اليدوي بسبب بطء الاتصال.';
      } else if (err.message.includes('حاوية الخريطة')) {
        errorMessage = '';
      } else if (err.message.includes('فشل في تحميل مكتبة')) {
        errorMessage = '';
      }
      
      // عرض رسالة إيجابية بدلاً من رسالة خطأ
      if (!errorMessage) {
        errorMessage = '';
      }
      
      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedAddress]);

  // إجراء Reverse Geocoding
  const reverseGeocode = useCallback(async (position: { lat: number; lng: number }) => {
    if (!window.google) {
      // في حالة عدم توفر Google Maps، إنشاء عنوان بناءً على الإحداثيات
      const fallbackAddress: Address = {
        formattedAddress: `موقع في إحداثيات ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`,
        city: 'الرياض', // افتراضي
        district: 'غير محدد',
        street: 'غير محدد',
        latitude: position.lat,
        longitude: position.lng
      };
      setSelectedAddress(fallbackAddress);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: position },
          (results: any[], status: string) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('فشل في تحديد العنوان'));
            }
          }
        );
      });

      processPlaceResult(result);
      
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      
      // إنشاء عنوان بديل بناءً على الإحداثيات
      const fallbackAddress: Address = {
        formattedAddress: `موقع مختار في إحداثيات ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`,
        city: 'الرياض',
        district: 'موقع مختار',
        street: 'غير محدد',
        latitude: position.lat,
        longitude: position.lng
      };
      setSelectedAddress(fallbackAddress);
      setError('تم تحديد الموقع بنجاح - لكن لا يمكن تحديد تفاصيل العنوان تلقائياً');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // معالجة نتيجة المكان
  const processPlaceResult = useCallback((place: any) => {
    const addressComponents = place.address_components || [];
    const geometry = place.geometry;
    
    let city = '';
    let district = '';
    let street = '';
    let postalCode = '';
    let buildingNumber = '';
    
    // استخراج مكونات العنوان
    addressComponents.forEach((component: any) => {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      }
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
        district = component.long_name;
      }
      if (types.includes('route')) {
        street = component.long_name;
      }
      if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
      if (types.includes('street_number')) {
        buildingNumber = component.long_name;
      }
    });

    const newAddress: Address = {
      formattedAddress: place.formatted_address,
      city: city,
      district: district,
      street: street,
      postalCode: postalCode,
      building: buildingNumber, // للتوافق مع النظام الحالي
      buildingNumber: buildingNumber, // الحقل الجديد المطلوب
      latitude: geometry?.location ? geometry.location.lat() : undefined,
      longitude: geometry?.location ? geometry.location.lng() : undefined
    };

    setSelectedAddress(newAddress);
    setError(null);
  }, []);

  // الحصول على الموقع الحالي
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          if (map && marker) {
            map.setCenter(pos);
            marker.setPosition(pos);
            await reverseGeocode(pos);
          } else if (fallbackMode) {
            // في وضع الإدخال اليدوي، إنشاء عنوان بناءً على الإحداثيات
            const fallbackAddress: Address = {
              formattedAddress: `موقعك الحالي في إحداثيات ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`,
              city: 'الرياض',
              district: 'موقعك الحالي',
              street: 'غير محدد',
              latitude: pos.lat,
              longitude: pos.lng
            };
            setSelectedAddress(fallbackAddress);
          }
        } catch (err) {
          console.warn('Error processing current location:', err);
          setError('تم تحديد موقعك ولكن لا يمكن تحديد تفاصيل العنوان');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        
        let errorMessage = 'فشل في تحديد موقعك الحالي';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض السماح بتحديد الموقع. يرجى السماح بالوصول للموقع من إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متوفرة حالياً';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع. حاول مرة أخرى';
            break;
          default:
            errorMessage = 'خطأ غير معروف في تحديد الموقع';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 60000 
      }
    );
  }, [map, marker, reverseGeocode, fallbackMode]);

  // تأكيد الاختيار
  const handleConfirm = useCallback(() => {
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
      onClose();
    }
  }, [selectedAddress, onAddressSelect, onClose]);

  // تهيئة الخريطة عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      // بدء بالوضع البديل مباشرة إذا لم يكن هناك مفتاح API
      const hasApiKey = localStorage.getItem('googleMapsApiKey') ||
                       (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : undefined) ||
                       (typeof window !== 'undefined' && (window as any).GOOGLE_MAPS_API_KEY);
      
      if (!hasApiKey || hasApiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' || hasApiKey.trim() === '') {
        // الانتقال مباشرة للوضع البديل بدون محاولة تحميل Google Maps
        setFallbackMode(true);
        setMapsReady(false);
      } else {
        // محاولة تحميل Google Maps
        setTimeout(() => {
          initializeMap();
        }, 300);
      }
    }
  }, [isOpen, initializeMap]);

  // إضافة معالجة للإدخال اليدوي في حالة فشل Google Maps
  const handleManualAddressInput = useCallback((field: keyof Address, value: string) => {
    setSelectedAddress(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          dir="rtl"
        >
          
          {/* الرأس */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#01411C] rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#01411C]">
                  اختيار الموقع
                </h2>
                <p className="text-[#065f41] text-sm">
                  اسحب المؤشر أو ابحث لتحديد موقع العقار
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* شريط البحث */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="ابحث عن العنوان (مثال: شارع الملك فهد، الرياض)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-right"
                />
              </div>
              <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="px-4 py-3 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#f1c40f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                موقعي
              </button>
            </div>
          </div>

          {/* الخريطة أو نمط الإدخال اليدوي */}
          <div className="flex-1 relative min-h-[400px]">
            {!fallbackMode ? (
              <>
                <div 
                  ref={mapRef}
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: '400px' }}
                />
                
                {/* مؤشر التحميل */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#01411C]">جاري تحميل الخرائط...</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* نمط الإدخال اليدوي */
              <div className="w-full h-full bg-gray-50 rounded-lg p-6 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#01411C] mb-2">
                    إدخال العنوان يدوياً
                  </h3>
                  <p className="text-[#065f41] text-sm">
                    لا يمكن تحميل الخرائط حالياً. يرجى إدخال العنوان يدوياً
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#01411C] font-medium mb-2">المدينة</label>
                    <input
                      type="text"
                      value={selectedAddress?.city || ''}
                      onChange={(e) => handleManualAddressInput('city', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                      placeholder="مثال: الرياض"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#01411C] font-medium mb-2">الحي</label>
                    <input
                      type="text"
                      value={selectedAddress?.district || ''}
                      onChange={(e) => handleManualAddressInput('district', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                      placeholder="مثال: العليا"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#01411C] font-medium mb-2">الشارع</label>
                    <input
                      type="text"
                      value={selectedAddress?.street || ''}
                      onChange={(e) => handleManualAddressInput('street', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                      placeholder="مثال: شارع الملك فهد"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#01411C] font-medium mb-2">رقم المبنى</label>
                    <input
                      type="text"
                      value={selectedAddress?.buildingNumber || selectedAddress?.building || ''}
                      onChange={(e) => {
                        handleManualAddressInput('buildingNumber', e.target.value);
                        handleManualAddressInput('building', e.target.value);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                      placeholder="مثال: 1234"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-[#01411C] font-medium mb-2">العنوان الكامل</label>
                    <input
                      type="text"
                      value={selectedAddress?.formattedAddress || ''}
                      onChange={(e) => handleManualAddressInput('formattedAddress', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                      placeholder="مثال: 1234 شارع الملك فهد، العليا، الرياض 12345"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* رسائل المعلومات */}
            {error && error.trim() && (
              <div className="absolute top-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-800 font-semibold mb-1">
                      معلومة
                    </h4>
                    <p className="text-blue-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* معلومات العنوان المحدد */}
          {selectedAddress && (
            <div className="p-4 bg-[#f0fdf4] border-t border-gray-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#01411C] mb-2">العنوان المحدد:</h4>
                  <div className="space-y-1 text-sm text-[#065f41]">
                    {selectedAddress.formattedAddress && (
                      <p><strong>العنوان الكامل:</strong> {selectedAddress.formattedAddress}</p>
                    )}
                    {selectedAddress.city && (
                      <p><strong>المدينة:</strong> {selectedAddress.city}</p>
                    )}
                    {selectedAddress.district && (
                      <p><strong>الحي:</strong> {selectedAddress.district}</p>
                    )}
                    {selectedAddress.street && (
                      <p><strong>الشارع:</strong> {selectedAddress.street}</p>
                    )}
                    <div className="flex gap-4 flex-wrap">
                      {(selectedAddress.buildingNumber || selectedAddress.building) && (
                        <span><strong>رقم المبنى:</strong> {selectedAddress.buildingNumber || selectedAddress.building}</span>
                      )}
                      {selectedAddress.postalCode && (
                        <span><strong>الرمز البريدي:</strong> {selectedAddress.postalCode}</span>
                      )}
                      {selectedAddress.additionalNumber && (
                        <span><strong>الرقم الإضافي:</strong> {selectedAddress.additionalNumber}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* الأزرار السفلية */}
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={(!selectedAddress || isLoading) && !fallbackMode}
              className="flex-1 px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {fallbackMode ? 'حفظ العنوان' : 'تأكيد الاختيار'}
            </button>
            
            {fallbackMode && !mapsReady && (
              <button
                onClick={() => {
                  setFallbackMode(false);
                  setError(null);
                  initializeMap();
                }}
                className="px-6 py-3 border-2 border-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#D4AF37]/10 transition-colors flex items-center gap-2"
              >
                <Wifi className="w-4 h-4" />
                إعادة تحميل الخرائط
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}