import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, Check, Building2, Home, MapPin, DollarSign, Layers, Filter, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { notifySmartMatchFound } from '../utils/notificationsSystem';

type MatchType = 'offer' | 'request';
type FilterType = 'all' | 'offers' | 'requests';

interface PropertyDetails {
  id: string;
  title: string;
  image: string;
  city: string;
  district: string;
  propertyType: string;
  category: 'سكني' | 'تجاري';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  agentName: string;
  agentPhone: string;
}

interface Match {
  id: string;
  type: MatchType;
  // إذا كان عرض: العرض من وسيط آخر + الطلب عند الوسيط الحالي
  // إذا كان طلب: الطلب من وسيط آخر + العرض عند الوسيط الحالي
  externalProperty: PropertyDetails; // العقار من الوسيط الآخر
  myProperty: PropertyDetails; // العقار عند الوسيط الحالي
  matchScore: number; // نسبة التطابق
  matchedFeatures: string[]; // المميزات المتطابقة
}

// بيانات تجريبية
const dummyMatches: Match[] = [
  {
    id: '1',
    type: 'offer',
    externalProperty: {
      id: 'ext-1',
      title: 'فيلا فاخرة للبيع - حي الملقا',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      city: 'الرياض',
      district: 'الملقا',
      propertyType: 'فيلا',
      category: 'سكني',
      price: 3500000,
      area: 450,
      bedrooms: 6,
      bathrooms: 5,
      agentName: 'أحمد الغامدي',
      agentPhone: '0501234567'
    },
    myProperty: {
      id: 'my-1',
      title: 'طلب فيلا في شمال الرياض',
      image: '',
      city: 'الرياض',
      district: 'الملقا',
      propertyType: 'فيلا',
      category: 'سكني',
      price: 3600000,
      area: 400,
      bedrooms: 5,
      bathrooms: 4,
      agentName: 'سلطان العقاري',
      agentPhone: '0509876543'
    },
    matchScore: 95,
    matchedFeatures: ['المدينة', 'الحي', 'نوع العقار', 'سكني', 'السعر']
  },
  {
    id: '2',
    type: 'request',
    externalProperty: {
      id: 'ext-2',
      title: 'طلب شقة في حي النرجس',
      image: '',
      city: 'الرياض',
      district: 'النرجس',
      propertyType: 'شقة',
      category: 'سكني',
      price: 850000,
      area: 200,
      bedrooms: 3,
      bathrooms: 2,
      agentName: 'محمد السالم',
      agentPhone: '0551234567'
    },
    myProperty: {
      id: 'my-2',
      title: 'شقة عصرية للبيع - حي النرجس',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      city: 'الرياض',
      district: 'النرجس',
      propertyType: 'شقة',
      category: 'سكني',
      price: 820000,
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      agentName: 'سلطان العقاري',
      agentPhone: '0509876543'
    },
    matchScore: 92,
    matchedFeatures: ['المدينة', 'الحي', 'نوع العقار', 'سكني', 'السعر']
  },
  {
    id: '3',
    type: 'offer',
    externalProperty: {
      id: 'ext-3',
      title: 'محل تجاري للبيع - طريق الملك فهد',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      city: 'جدة',
      district: 'حي الزهراء',
      propertyType: 'محل تجاري',
      category: 'تجاري',
      price: 1200000,
      area: 150,
      agentName: 'خالد الحربي',
      agentPhone: '0561234567'
    },
    myProperty: {
      id: 'my-3',
      title: 'طلب محل تجاري في جدة',
      image: '',
      city: 'جدة',
      district: 'حي الزهراء',
      propertyType: 'محل تجاري',
      category: 'تجاري',
      price: 1150000,
      area: 140,
      agentName: 'سلطان العقاري',
      agentPhone: '0509876543'
    },
    matchScore: 88,
    matchedFeatures: ['المدينة', 'نوع العقار', 'تجاري', 'السعر']
  },
  {
    id: '4',
    type: 'request',
    externalProperty: {
      id: 'ext-4',
      title: 'طلب أرض سكنية في الدمام',
      image: '',
      city: 'الدمام',
      district: 'الفيصلية',
      propertyType: 'أرض',
      category: 'سكني',
      price: 950000,
      area: 600,
      agentName: 'عبدالله الدوسري',
      agentPhone: '0571234567'
    },
    myProperty: {
      id: 'my-4',
      title: 'أرض سكنية ممتازة - حي الفيصلية',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      city: 'الدمام',
      district: 'الفيصلية',
      propertyType: 'أرض',
      category: 'سكني',
      price: 920000,
      area: 580,
      agentName: 'سلطان العقاري',
      agentPhone: '0509876543'
    },
    matchScore: 90,
    matchedFeatures: ['المدينة', 'الحي', 'نوع العقار', 'سكني', 'السعر']
  }
];

export default function SmartMatches({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<'smart' | 'accepted'>('smart');
  const [filter, setFilter] = useState<FilterType>('all');
  const [matches, setMatches] = useState<Match[]>(dummyMatches);
  const [acceptedMatches, setAcceptedMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'offers') return match.type === 'offer';
    if (filter === 'requests') return match.type === 'request';
    return true;
  });

  const currentMatch = filteredMatches[currentIndex];

  const handleAccept = () => {
    if (currentMatch) {
      setAcceptedMatches([...acceptedMatches, currentMatch]);
      handleNext();
      
      // إرسال إشعار فرصة ذكية
      notifySmartMatchFound({
        id: currentMatch.id,
        offerType: currentMatch.type === 'offer' ? currentMatch.externalProperty.propertyType : currentMatch.myProperty.propertyType,
        requestType: currentMatch.type === 'offer' ? currentMatch.myProperty.propertyType : currentMatch.externalProperty.propertyType,
        matchScore: currentMatch.matchScore,
        location: currentMatch.externalProperty.city
      });
    }
  };

  const handleReject = () => {
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < filteredMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // سحب لليمين = قبول
      handleAccept();
    } else if (info.offset.x < -threshold) {
      // سحب لليسار = رفض
      handleReject();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20" dir="rtl">
      {/* الهيدر */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#01411C]" />
              </div>
              <div>
                <h1 className="text-2xl">العروض الذكية</h1>
                <p className="text-sm text-white/80">تطابق ذكي بين العروض والطلبات</p>
              </div>
            </div>
            {/* زر الرجوع */}
            <button
              onClick={() => onNavigate ? onNavigate('dashboard') : window.history.back()}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span>رجوع</span>
            </button>
          </div>
        </div>

        {/* التبويبات */}
        <div className="border-t border-white/20">
          <div className="container mx-auto px-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('smart')}
                className={`py-3 px-6 transition-all relative ${
                  activeTab === 'smart' 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                العروض الذكية
                {activeTab === 'smart' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`py-3 px-6 transition-all relative ${
                  activeTab === 'accepted' 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                المقبولة ({acceptedMatches.length})
                {activeTab === 'accepted' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37]"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'smart' ? (
          <>
            {/* الفلتر */}
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-5 h-5 text-[#01411C]" />
                  <span className="font-semibold text-[#01411C]">تصفية حسب النوع</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === 'all'
                        ? 'bg-[#01411C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    عروض وطلبات
                  </button>
                  <button
                    onClick={() => setFilter('offers')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === 'offers'
                        ? 'bg-[#01411C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    عروض فقط
                  </button>
                  <button
                    onClick={() => setFilter('requests')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === 'requests'
                        ? 'bg-[#01411C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    طلبات فقط
                  </button>
                </div>
              </div>
            </div>

            {/* البطاقات */}
            <div className="relative h-[calc(100vh-300px)] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {currentMatch ? (
                  <MatchCard
                    key={currentMatch.id}
                    match={currentMatch}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onDragEnd={handleDragEnd}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl text-gray-600 mb-2">لا توجد عروض جديدة</h3>
                    <p className="text-gray-500">تحقق لاحقاً للمزيد من التطابقات الذكية</p>
                  </div>
                )}
              </AnimatePresence>

              {/* مؤشر العدد */}
              {filteredMatches.length > 0 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm text-gray-700">
                    {currentIndex + 1} / {filteredMatches.length}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <AcceptedMatchesList matches={acceptedMatches} />
        )}
      </div>
    </div>
  );
}

// مكون البطاقة القابلة للسحب
function MatchCard({ 
  match, 
  onAccept, 
  onReject, 
  onDragEnd 
}: { 
  match: Match; 
  onAccept: () => void; 
  onReject: () => void;
  onDragEnd: (event: any, info: PanInfo) => void;
}) {
  const isOffer = match.type === 'offer';
  
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* شريط النوع */}
      <div className={`py-3 px-4 ${isOffer ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
        <div className="flex items-center justify-between">
          <span className="font-bold">{isOffer ? '📋 عرض متاح' : '🔍 طلب متاح'}</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">تطابق {match.matchScore}%</span>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-4">
        {isOffer ? (
          // بطاقة عرض
          <>
            {/* العرض من الوسيط الآخر */}
            <div className="mb-4">
              <h3 className="font-bold text-[#01411C] mb-2">عرض من {match.externalProperty.agentName}</h3>
              {match.externalProperty.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                  <ImageWithFallback
                    src={match.externalProperty.image}
                    alt={match.externalProperty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h4 className="font-semibold mb-2">{match.externalProperty.title}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {match.externalProperty.city}
                </div>
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {match.externalProperty.district}
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {match.externalProperty.propertyType}
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  {match.externalProperty.category}
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <DollarSign className="w-4 h-4" />
                  {match.externalProperty.price.toLocaleString('ar-SA')} ريال
                </div>
              </div>
            </div>

            {/* الخط الفاصل */}
            <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

            {/* الطلب عند الوسيط الحالي */}
            <div>
              <h3 className="font-bold text-[#D4AF37] mb-2">يطابق طلبك</h3>
              <h4 className="font-semibold mb-2">{match.myProperty.title}</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-semibold mb-2">
                  🎯 التطابقات: {match.matchedFeatures.join(' • ')}
                </p>
              </div>
            </div>
          </>
        ) : (
          // بطاقة طلب
          <>
            {/* الطلب من الوسيط الآخر */}
            <div className="mb-4">
              <h3 className="font-bold text-[#01411C] mb-2">طلب من {match.externalProperty.agentName}</h3>
              <h4 className="font-semibold mb-2">{match.externalProperty.title}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {match.externalProperty.city}
                </div>
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {match.externalProperty.district}
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {match.externalProperty.propertyType}
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  {match.externalProperty.category}
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <DollarSign className="w-4 h-4" />
                  {match.externalProperty.price.toLocaleString('ar-SA')} ريال
                </div>
              </div>
            </div>

            {/* الخط الفاصل */}
            <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

            {/* العرض عند الوسيط الحالي */}
            <div>
              <h3 className="font-bold text-[#D4AF37] mb-2">يطابق عرضك</h3>
              {match.myProperty.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                  <ImageWithFallback
                    src={match.myProperty.image}
                    alt={match.myProperty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h4 className="font-semibold mb-2">{match.myProperty.title}</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-semibold mb-2">
                  🎯 التطابقات: {match.matchedFeatures.join(' • ')}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* أزرار القبول والرفض */}
      <div className="flex gap-3 p-4 bg-gray-50">
        <button
          onClick={onReject}
          className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
        >
          <X className="w-5 h-5" />
          رفض
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
        >
          <Check className="w-5 h-5" />
          قبول
        </button>
      </div>

      {/* تلميحات السحب */}
      <div className="text-center text-xs text-gray-400 pb-2">
        اسحب لليمين للقبول أو لليسار للرفض
      </div>
    </motion.div>
  );
}

// قائمة العروض المقبولة
function AcceptedMatchesList({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
          <Check className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl text-gray-600 mb-2">لا توجد عروض مقبولة بعد</h3>
        <p className="text-gray-500">ابدأ بقبول العروض الذكية لتظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className={`py-2 px-4 ${match.type === 'offer' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{match.type === 'offer' ? 'عرض' : 'طلب'}</span>
              <span className="text-xs">تطابق {match.matchScore}%</span>
            </div>
          </div>
          
          <div className="p-4">
            {match.type === 'offer' && match.externalProperty.image && (
              <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                <ImageWithFallback
                  src={match.externalProperty.image}
                  alt={match.externalProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {match.type === 'request' && match.myProperty.image && (
              <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                <ImageWithFallback
                  src={match.myProperty.image}
                  alt={match.myProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2">
              {match.type === 'offer' ? match.externalProperty.title : match.externalProperty.title}
            </h4>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <MapPin className="w-3 h-3" />
              {match.externalProperty.city} - {match.externalProperty.district}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <DollarSign className="w-3 h-3" />
              {match.externalProperty.price.toLocaleString('ar-SA')} ريال
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                من: {match.externalProperty.agentName}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}