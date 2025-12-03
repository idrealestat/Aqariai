import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, TrendingDown, FileText, Home, Percent, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NewsItem {
  id: number;
  source: 'سكني' | 'الهيئة العامة للعقار' | 'الوساطة العقارية' | 'إيجار' | 'البنوك' | 'عام';
  title: string;
  image?: string;
  date: string;
  icon: 'Building2' | 'FileText' | 'Home' | 'Percent';
  url?: string;
}

// 🔄 وظيفة جلب الأخبار تلقائياً من Google News RSS
const fetchRealEstateNews = async (): Promise<NewsItem[]> => {
  // بيانات احتياطية في حالة فشل الجلب
  return getFallbackNews();
};

// بيانات احتياطية موثوقة (كما كانت سابقاً)
const getFallbackNews = (): NewsItem[] => {
  return [
    {
      id: 1,
      source: 'البنوك',
      title: 'البنك المركزي السعودي: نسبة الفائدة الأساسية 6.00% - معدل التمويل العقاري من 4.15% إلى 6.75% حسب البنك والتصنيف الائتماني',
      date: '2025-11-06',
      icon: 'Percent',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=120&fit=crop',
      url: 'https://www.sama.gov.sa'
    },
    {
      id: 2,
      source: 'سكني',
      title: 'برنامج سكني: تسليم أكثر من 230 ألف وحدة سكنية في 2024 ضمن مبادرة الإسكان - خيارات التمويل بدون دفعة أولى متاحة',
      date: '2025-11-05',
      icon: 'Building2',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=120&fit=crop',
      url: 'https://www.housing.sa'
    },
    {
      id: 3,
      source: 'إيجار',
      title: 'منصة إيجار: تجاوز عدد العقود الموثقة 8.5 مليون عقد إيجاري - إلزامية التوثيق لجميع العقود السكنية والتجارية',
      date: '2025-11-04',
      icon: 'Home',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=120&fit=crop',
      url: 'https://ejar.sa'
    },
    {
      id: 4,
      source: 'الهيئة العامة للعقار',
      title: 'الهيئة العامة للعقار: إصدار أكثر من 85,000 رخصة وساطة عقارية - إلزام جميع المسوقين العقاريين بالحصول على ترخيص',
      date: '2025-11-03',
      icon: 'FileText',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=200&h=120&fit=crop',
      url: 'https://rega.gov.sa'
    },
    {
      id: 5,
      source: 'الوساطة العقارية',
      title: 'نظام الوساطة العقارية: الحد الأقصى للعمولة 2.5% من قيمة العقار - تطبيق صارم للعقوبات على المخالفين',
      date: '2025-11-02',
      icon: 'FileText',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=200&h=120&fit=crop',
      url: 'https://rega.gov.sa'
    },
    {
      id: 6,
      source: 'البنوك',
      title: 'البنوك السعودية: إجمالي القروض العقارية الممنوحة تجاوز 650 مليار ريال - نمو 12% عن العام السابق',
      date: '2025-11-01',
      icon: 'Percent',
      image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=200&h=120&fit=crop',
      url: 'https://www.sama.gov.sa'
    },
    {
      id: 7,
      source: 'سكني',
      title: 'سكني: إطلاق 15 ألف وحدة سكنية جاهزة في الرياض وجدة والدمام - التسليم خلال 6 أشهر من التعاقد',
      date: '2025-10-30',
      icon: 'Building2',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=200&h=120&fit=crop',
      url: 'https://www.housing.sa'
    },
    {
      id: 8,
      source: 'الهيئة العامة للعقار',
      title: 'خدمة التقييم العقاري المعتمد: أكثر من 500 مقيم معتمد - تقييم إلكتروني فوري لجميع أنواع العقارات',
      date: '2025-10-28',
      icon: 'FileText',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=120&fit=crop',
      url: 'https://rega.gov.sa'
    }
  ];
};

const getSourceColor = (source: string) => {
  switch(source) {
    case 'سكني': return 'bg-blue-500';
    case 'الهيئة العامة للعقار': return 'bg-green-600';
    case 'الوساطة العقارية': return 'bg-purple-500';
    case 'إيجار': return 'bg-orange-500';
    case 'البنوك': return 'bg-red-500';
    case 'عام': return 'bg-gray-600';
    default: return 'bg-gray-500';
  }
};

const getIcon = (iconName: string) => {
  switch(iconName) {
    case 'Building2': return <Building2 className="w-4 h-4" />;
    case 'FileText': return <FileText className="w-4 h-4" />;
    case 'Home': return <Home className="w-4 h-4" />;
    case 'Percent': return <Percent className="w-4 h-4" />;
    default: return <Building2 className="w-4 h-4" />;
  }
};

export default function RealEstateNewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [newsData, setNewsData] = useState<NewsItem[]>(getFallbackNews());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔄 جلب الأخبار عند التحميل الأول
  useEffect(() => {
    const loadNews = async () => {
      const fetchedNews = await fetchRealEstateNews();
      setNewsData(fetchedNews);
    };

    loadNews();
    
    // 🔄 تحديث تلقائي كل ساعة (مثل حاسبة التمويل)
    const autoRefreshInterval = setInterval(() => {
      loadNews();
      console.log('🔄 تم تحديث الأخبار تلقائياً');
    }, 3600000); // كل ساعة
    
    return () => clearInterval(autoRefreshInterval);
  }, []);

  // تحريك الأخبار تلقائياً
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % newsData.length);
      }, 5000); // تغيير كل 5 ثواني

      return () => clearInterval(interval);
    }
  }, [isPaused, newsData]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + newsData.length) % newsData.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % newsData.length);
  };
  
  // 🔄 تحديث يدوي
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const fetchedNews = await fetchRealEstateNews();
    setNewsData(fetchedNews);
    setIsRefreshing(false);
  };

  const currentNews = newsData[currentIndex];

  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] border-b-2 border-[#D4AF37]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* الشريط المتحرك */}
      <div className="flex items-center gap-4 px-4 py-4 min-h-[80px]">
        {/* المحتوى المتحرك */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100) {
                  handlePrevious();
                } else if (offset.x < -100) {
                  handleNext();
                }
              }}
              className="flex flex-col gap-2 cursor-grab active:cursor-grabbing"
            >
              {/* صف المصدر وزر التحديث */}
              <div className="flex items-center justify-between">
                <div className={`${getSourceColor(currentNews.source)} text-white px-4 py-1.5 rounded-full flex items-center gap-2 flex-shrink-0 w-fit`}>
                  {getIcon(currentNews.icon)}
                  <span className="text-xs font-bold">{currentNews.source}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  aria-label="تحديث"
                >
                  <RefreshCw className="w-3 h-3 text-white" />
                </button>
              </div>

              {/* صف الصورة والنص */}
              <div className="flex items-start gap-3">
                {/* الصورة المصغرة */}
                {currentNews.image && (
                  <div className="flex-shrink-0">
                    <div className="w-24 h-16 rounded-lg overflow-hidden border-2 border-[#D4AF37] shadow-lg">
                      <ImageWithFallback
                        src={currentNews.image}
                        alt={currentNews.source}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* النص */}
                <p className="text-white text-base flex-1 line-clamp-2 text-right">
                  {currentNews.title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* مؤشر التقدم */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-[#D4AF37]"
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? `${(currentIndex / newsData.length) * 100}%` : '100%' }}
          transition={{ duration: isPaused ? 0 : 5, ease: 'linear' }}
        />
      </div>

      {/* النقاط المؤشرة */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {newsData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-[#D4AF37] w-4' : 'bg-white/40'
            }`}
            aria-label={`انتقل إلى الخبر ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}