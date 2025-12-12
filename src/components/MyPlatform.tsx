import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Eye,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  DollarSign,
  Home,
  Building,
  Search,
  Filter,
  Grid,
  List,
  TrendingUp
} from 'lucide-react';
import { getAllPublishedAds, PublishedAd } from '../utils/publishedAds';
import { getImage } from '../utils/imageStorage';
import { useDashboardContext } from '../context/DashboardContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  plan?: string;
  companyName?: string;
  licenseNumber?: string;
}

interface MyPlatformProps {
  user: User | null;
  onBack: () => void;
  showHeader?: boolean; // اختياري: إظهار الهيدر أم لا (افتراضياً true)
}

export function MyPlatform({ user, onBack, showHeader = true }: MyPlatformProps) {
  const { leftSidebarOpen } = useDashboardContext();
  const [publishedAds, setPublishedAds] = useState<PublishedAd[]>([]);
  const [filteredAds, setFilteredAds] = useState<PublishedAd[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'sale' | 'rent'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [selectedAdNumber, setSelectedAdNumber] = useState<string | null>(null);
  
  // 🆕 عرض تفاصيل العقار
  const [selectedAdForDetail, setSelectedAdForDetail] = useState<PublishedAd | null>(null);
  
  // 🔗 قراءة معامل URL لعرض إعلان محدد
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adNumber = urlParams.get('ad');
    if (adNumber) {
      setSelectedAdNumber(adNumber);
      // التمرير للإعلان المحدد بعد التحميل
      setTimeout(() => {
        const adElement = document.getElementById(`ad-${adNumber}`);
        if (adElement) {
          adElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // تأثير بصري لتمييز الإعلان
          adElement.style.animation = 'highlight-pulse 2s ease-in-out';
        }
      }, 500);
    }
  }, []);
  
  // تحميل بيانات بطاقة الأعمال من localStorage
  const STORAGE_KEY = `business_card_${user?.id || user?.phone || 'default'}`;
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    }
    return null;
  };

  // حالة البيانات - مع قيمة افتراضية
  const getDefaultFormData = () => ({
    userName: user?.name || '',
    companyName: user?.companyName || '',
    falLicense: user?.licenseNumber || '',
    falExpiry: '',
    commercialRegistration: '',
    commercialExpiryDate: '',
    primaryPhone: user?.phone || '',
    email: user?.email || '',
    domain: '',
    googleMapsLocation: '',
    location: '',
    coverImage: '',
    logoImage: '',
    profileImage: '',
    officialPlatform: '',
    bio: '',
    achievements: {
      totalDeals: 0,
      totalProperties: 0,
      totalClients: 0,
      yearsOfExperience: 0,
      awards: [],
      certifications: [],
      topPerformer: false,
      verified: false
    }
  });

  const [formData, setFormData] = useState(loadSavedData() || getDefaultFormData());
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  
  // 🎯 مرجع للصور المحملة من IndexedDB (لا تُمسح أبداً!)
  const loadedImagesRef = React.useRef<{
    coverImage: string;
    logoImage: string;
    profileImage: string;
  }>({
    coverImage: '',
    logoImage: '',
    profileImage: ''
  });

  // 🖼️ تحميل الصور من IndexedDB (يعمل مرة واحدة فقط عند التحميل)
  useEffect(() => {
    const loadImagesFromIndexedDB = async () => {
      setIsLoadingImages(true);
      const userId = user?.id || user?.phone || 'default';
      
      console.log('📸 بدء تحميل الصور من IndexedDB للمستخدم:', userId);
      
      try {
        // تحميل الصور الثلاث بشكل متزامن
        const [coverUrl, logoUrl, profileUrl] = await Promise.all([
          getImage(userId, 'cover'),
          getImage(userId, 'logo'),
          getImage(userId, 'profile')
        ]);

        // حفظ الصور في ref (محمية من التحديثات!)
        loadedImagesRef.current = {
          coverImage: coverUrl || '',
          logoImage: logoUrl || '',
          profileImage: profileUrl || ''
        };

        // تحديث formData بالصور المحملة
        setFormData(prev => ({
          ...prev,
          coverImage: coverUrl || '',
          logoImage: logoUrl || '',
          profileImage: profileUrl || ''
        }));

        console.log('✅ تم تحميل اصور وحفظها في ref:', {
          cover: !!coverUrl,
          logo: !!logoUrl,
          profile: !!profileUrl
        });
      } catch (error) {
        console.error('❌ خطأ في تحميل الصور:', error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadImagesFromIndexedDB();
  }, [user?.id, user?.phone]); // يعمل مرة واحدة فقط عند تغيير المستخدم

  // 🔗 الربط التلقائي مع بطقة الأعمال الرقمية (للنصوص فقط!)
  useEffect(() => {
    const updateFormData = () => {
      const newData = loadSavedData();
      if (newData) {
        // 🔧 دمج النصوص الجديدة مع الصور المحفوظة في ref
        setFormData(prev => ({
          ...prev,  // الحفاظ على جميع القيم الحالية
          // تحديث النصوص فقط
          userName: newData.userName || prev.userName,
          companyName: newData.companyName || prev.companyName,
          falLicense: newData.falLicense || prev.falLicense,
          falExpiry: newData.falExpiry || prev.falExpiry,
          commercialRegistration: newData.commercialRegistration || prev.commercialRegistration,
          commercialExpiryDate: newData.commercialExpiryDate || prev.commercialExpiryDate,
          primaryPhone: newData.primaryPhone || prev.primaryPhone,
          email: newData.email || prev.email,
          domain: newData.domain || prev.domain,
          googleMapsLocation: newData.googleMapsLocation || prev.googleMapsLocation,
          location: newData.location || prev.location,
          officialPlatform: newData.officialPlatform || prev.officialPlatform,
          bio: newData.bio || prev.bio,
          achievements: newData.achievements || prev.achievements,
          // الصور: دائماً من ref (المحمية!)
          coverImage: loadedImagesRef.current.coverImage || prev.coverImage,
          logoImage: loadedImagesRef.current.logoImage || prev.logoImage,
          profileImage: loadedImagesRef.current.profileImage || prev.profileImage
        }));
        console.log('✅ تم تحديث النصوص من بطاقة الأعمال (الصور محمية من ref)');
      }
    };

    // تحديث فوري عند التحميل (بعد تحميل الصور)
    if (!isLoadingImages) {
      updateFormData();
    }

    // الاستماع لتحديثات بطاقة الأعمال
    window.addEventListener('businessCardUpdated', updateFormData);
    
    // فحص دوري كل 5 ثوانٍ (مخفّض من 2 ثانية)
    const intervalId = setInterval(updateFormData, 5000);

    return () => {
      window.removeEventListener('businessCardUpdated', updateFormData);
      clearInterval(intervalId);
    };
  }, [user?.id, user?.phone, isLoadingImages]); // إضافة isLoadingImages للتبعيات

  // 🔄 إعادة تحميل الصور عند تحديث صورة من بطاقة الأعمال
  useEffect(() => {
    const handleImageUpdate = async () => {
      const userId = user?.id || user?.phone || 'default';
      console.log('🔄 إعادة تحميل الصور بعد التحديث');
      
      try {
        const [coverUrl, logoUrl, profileUrl] = await Promise.all([
          getImage(userId, 'cover'),
          getImage(userId, 'logo'),
          getImage(userId, 'profile')
        ]);

        // تحديث ref
        loadedImagesRef.current = {
          coverImage: coverUrl || loadedImagesRef.current.coverImage,
          logoImage: logoUrl || loadedImagesRef.current.logoImage,
          profileImage: profileUrl || loadedImagesRef.current.profileImage
        };

        // تحديث formData
        setFormData(prev => ({
          ...prev,
          coverImage: coverUrl || prev.coverImage,
          logoImage: logoUrl || prev.logoImage,
          profileImage: profileUrl || prev.profileImage
        }));

        console.log('✅ تم تحديث الصور في ref:', {
          cover: !!coverUrl,
          logo: !!logoUrl,
          profile: !!profileUrl
        });
      } catch (error) {
        console.error('❌ خطأ في إعادة تحميل الصور:', error);
      }
    };

    window.addEventListener('businessCardUpdated', handleImageUpdate);

    return () => {
      window.removeEventListener('businessCardUpdated', handleImageUpdate);
    };
  }, [user?.id, user?.phone]);

  // تحميل الإعلانات المنشورة على المنصة العامة فقط
  useEffect(() => {
    const loadPublishedAds = () => {
      const ads = getAllPublishedAds();
      
      console.log('🌐 ==================== منصتي: تحليل الإعلانات ====================');
      console.log('📊 إجمالي الإعلانات المحفوظة:', ads.length);
      console.log('📋 تفاصيل جميع الإعلانات:', ads.map(ad => ({
        adNumber: ad.adNumber,
        status: ad.status,
        city: ad.location.city,
        ownerName: ad.ownerName
      })));
      
      // 🌐 فلترة: عرض الإعلانات المنشورة على المنصة العامة فقط (status = 'published')
      const publishedOnlyAds = ads.filter(ad => ad.status === 'published');
      setPublishedAds(publishedOnlyAds);
      setFilteredAds(publishedOnlyAds);
      
      console.log(`✅ إعلانات منشورة (status = 'published'): ${publishedOnlyAds.length}`);
      console.log(`❌ إعلانات مسودة (status = 'draft'): ${ads.filter(ad => ad.status === 'draft').length}`);
      console.log('📝 الإعلانات المعروضة في منصتي:', publishedOnlyAds.map(ad => ad.adNumber));
      console.log('🌐 ================================================================');
    };

    loadPublishedAds();

    // الاستماع لتحديثات الإعلانات
    const handleAdUpdate = () => {
      loadPublishedAds();
    };

    window.addEventListener('publishedAdSaved', handleAdUpdate);
    window.addEventListener('publishedAdUpdated', handleAdUpdate); // 🔄 تحديث فوري عند التعديل
    window.addEventListener('publishedAdDeleted', handleAdUpdate);
    window.addEventListener('publishedAdStatusChanged', handleAdUpdate);
    window.addEventListener('adPublishedToMyPlatform', handleAdUpdate);

    return () => {
      window.removeEventListener('publishedAdSaved', handleAdUpdate);
      window.removeEventListener('publishedAdUpdated', handleAdUpdate);
      window.removeEventListener('publishedAdDeleted', handleAdUpdate);
      window.removeEventListener('publishedAdStatusChanged', handleAdUpdate);
      window.removeEventListener('adPublishedToMyPlatform', handleAdUpdate);
    };
  }, []);

  // فلترة الإعلانات حسب التبويب والبحث
  useEffect(() => {
    let filtered = publishedAds;

    // فلتر حسب التبويب
    if (activeTab === 'sale') {
      filtered = filtered.filter(ad => ad.purpose === 'بيع');
    } else if (activeTab === 'rent') {
      filtered = filtered.filter(ad => ad.purpose === 'إيجار');
    }

    // فلتر حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.propertyType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلتر حسب السعر
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(ad => {
        const price = parseFloat(ad.price.replace(/[^0-9.]/g, ''));
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredAds(filtered);
  }, [activeTab, searchQuery, priceRange, publishedAds]);

  // تحديث إحصائيات المشاهدة
  const handleViewAd = (ad: PublishedAd) => {
    setSelectedAdForDetail(ad);
  };

  // نموذج بطاقة العرض
  const OfferCard = ({ ad }: { ad: PublishedAd }) => {
    const mainImage = ad.mediaFiles.find(m => m.type === 'image')?.url || 'https://via.placeholder.com/400x300?text=عقار';
    const isHighlighted = selectedAdNumber === ad.adNumber;

    return (
      <Card 
        id={`ad-${ad.adNumber}`} // 🎯 ID للوصول المباشر عبر URL
        className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${
          isHighlighted ? 'ring-4 ring-[#D4AF37] shadow-2xl' : ''
        }`}
        onClick={() => handleViewAd(ad)}
      >
        {/* صورة العقار */}
        <div className="relative h-40 md:h-64 overflow-hidden">
          <img
            src={mainImage}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badge الغرض */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4">
            <Badge className={`text-xs md:text-sm ${ad.purpose === 'بيع' ? 'bg-[#01411C] text-[#D4AF37]' : 'bg-[#D4AF37] text-[#01411C]'}`}>
              {ad.purpose}
            </Badge>
          </div>

          {/* الإحصائيات */}
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 flex gap-2 md:gap-3 text-white">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded">
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{ad.stats.views}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded">
              <Heart className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{ad.stats.likes}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
          {/* العنوان */}
          <h3 className="font-bold text-sm md:text-lg text-[#01411C] line-clamp-1">{ad.title}</h3>

          {/* الموقع */}
          <div className="flex items-center gap-1 md:gap-2 text-gray-600">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 text-[#D4AF37]" />
            <span className="text-xs md:text-sm line-clamp-1">{ad.location.city} - {ad.location.district}</span>
          </div>

          {/* التفاصيل */}
          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="w-3 h-3 md:w-4 md:h-4 text-[#01411C]" />
              <span>{ad.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 md:w-4 md:h-4 text-[#01411C]" />
              <span>{ad.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-3 h-3 md:w-4 md:h-4 text-[#01411C]" />
              <span className="text-xs">{ad.area}</span>
            </div>
          </div>

          {/* السعر */}
          <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between pt-2 md:pt-3 border-t border-gray-200 gap-2">
            <div>
              <p className="text-lg md:text-2xl font-bold text-[#01411C]">{ad.price}</p>
              <p className="text-xs text-gray-500 hidden md:block">{ad.purpose === 'إيجار' ? 'شهرياً' : 'سعر كامل'}</p>
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="flex gap-1 md:gap-2 w-full md:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="text-[#01411C] border-[#01411C] hover:bg-[#01411C] hover:text-white flex-1 md:flex-none h-8 md:h-9"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://wa.me/${formData.primaryPhone}?text=مرحباً، أنا مهتم بـ: ${ad.title}`, '_blank');
                }}
              >
                <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-[#01411C] text-[#D4AF37] hover:bg-[#065f41] flex-1 md:flex-none h-8 md:h-9 text-xs md:text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${formData.primaryPhone}`;
                }}
              >
                <Phone className="w-3 h-3 md:w-4 md:h-4 md:ml-2" />
                <span className="hidden md:inline">اتصال</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div 
      className="bg-gradient-to-b from-gray-50 to-white transition-all duration-300" 
      dir="rtl"
      style={{
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        {/* النبذة التعريفية */}
        {formData.bio && (
          <Card className="mb-8 border-[#D4AF37]/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#01411C] mb-3">نبذة عنا</h2>
              <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* إحصائات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#01411C] to-[#065f41] text-white">
            <CardContent className="p-4 text-center">
              <Home className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]" />
              <p className="text-2xl font-bold">{publishedAds.length}</p>
              <p className="text-sm text-white/80">عقار متاح</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#D4AF37] to-[#b8941f] text-[#01411C]">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formData.achievements.totalDeals}</p>
              <p className="text-sm opacity-80">صفقة مكتملة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formData.achievements.yearsOfExperience}</p>
              <p className="text-sm text-white/80">سنوات خبرة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <Building className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formData.achievements.totalClients}</p>
              <p className="text-sm text-white/80">عميل راضي</p>
            </CardContent>
          </Card>
        </div>

        {/* شريط البحث والفلاتر */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* البحث */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="ابحث عن عقار..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* نطاق السعر */}
              <Input
                placeholder="السعر من"
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <Input
                placeholder="السعر إلى"
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* التبويبات وطريقة العرض */}
        <div className="flex items-center justify-between mb-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1">
            <TabsList className="bg-[#01411C]/10">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-[#D4AF37]">
                الكل ({publishedAds.length})
              </TabsTrigger>
              <TabsTrigger value="sale" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-[#D4AF37]">
                للبيع ({publishedAds.filter(a => a.purpose === 'بيع').length})
              </TabsTrigger>
              <TabsTrigger value="rent" className="data-[state=active]:bg-[#01411C] data-[state=active]:text-[#D4AF37]">
                للإيجار ({publishedAds.filter(a => a.purpose === 'إيجار').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* أزرار طريقة العرض */}
          <div className="flex gap-2 mr-4">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-[#01411C] text-[#D4AF37]' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-[#01411C] text-[#D4AF37]' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* عرض العقارات */}
        {filteredAds.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-gray-500">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl">لا توجد عقارات متاحة حالياً</p>
              <p className="text-sm mt-2">جارٍ إضافة عقارات جديدة قريباً</p>
            </div>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredAds.map(ad => (
              <OfferCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-2">
            {formData.companyName || user?.companyName || 'شركتنا العقارية'}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            {formData.primaryPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{formData.primaryPhone}</span>
              </div>
            )}
            {formData.email && (
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>{formData.email}</span>
              </div>
            )}
            {formData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{formData.location}</span>
              </div>
            )}
          </div>
          
          {formData.domain && (
            <p className="mt-4 text-xs text-gray-400">
              🌐 {formData.domain}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}