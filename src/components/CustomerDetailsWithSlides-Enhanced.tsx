import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ChevronLeft, ChevronRight, User, Phone, Mail, Building2, Briefcase,
  DollarSign, Home, TrendingUp, FileText, Clock, CheckCircle, Calendar,
  Plus, Trash2, Star, Circle, CheckCircle2, Tag, Download, Send,
  AlertCircle, Bell, ArrowRight, MessageCircle, PhoneCall, MapPin, Globe,
  PhoneOff, Wifi, Upload, Image as ImageIcon, Video, File, Edit2,
  Search, FolderOpen, Share2, Eye, GripVertical, Users, Repeat, Copy,
  Filter, Activity, PhoneIncoming, PhoneOutgoing, Megaphone, ExternalLink, Pin
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { getAdsByOwnerPhone, type PublishedAd } from '../utils/publishedAds';
import { ReceivedOffersSlide as ReceivedOffersSlideNew } from './crm/ReceivedOffersSlide';

// ============================================================
// 📊 TYPES & INTERFACES
// ============================================================

interface Note {
  id: string;
  text: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'urgent-important' | 'important' | 'urgent' | 'normal';
  completed: boolean;
  favorite: boolean;
}

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

type CustomerType = 'seller' | 'buyer' | 'lessor' | 'tenant' | 'finance' | 'other';
type InterestLevel = 'passionate' | 'interested' | 'moderate' | 'limited' | 'not-interested';

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  uploadedAt: Date;
  tags?: string[];
}

interface DocumentFile {
  id: string;
  url: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'other';
  size: number;
  uploadedAt: Date;
}

interface EnhancedNote {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  attachments?: DocumentFile[];
  order: number;
}

// 🆕 واجهات جدولة الاجتماع المحسنة
interface EnhancedMeeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  notes: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  participants: string[];
  location: string;
  reminders: number[]; // بالدقائق قبل الاجتماع
  createdAt: Date;
}

// 🆕 واجهات سجل النشاط التلقائي
type ActivityType = 'call' | 'message' | 'edit' | 'document' | 'meeting' | 'task' | 'tag';

interface ActivityLog {
  id: string;
  type: ActivityType;
  action: string;
  details: string;
  timestamp: Date;
  metadata?: {
    callDirection?: 'incoming' | 'outgoing';
    duration?: number;
    documentName?: string;
    fieldChanged?: string;
    oldValue?: string;
    newValue?: string;
  };
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  image?: string;
  profileImage?: string; // صورة بطاقة العمل للوسطاء المشتركين
  type: CustomerType;
  interestLevel: InterestLevel;
  tags: string[];
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  customerNotes?: Note[];
  customerTasks?: Task[];
  // 🆕 حقول إضافية جديدة
  alternativePhones?: { id: string; number: string; type: 'home' | 'work' | 'mobile'; }[];
  whatsappNumber?: string;
  companyEmail?: string;
  website?: string;
  additionalWebsites?: string[];
  location?: {
    lat: number;
    lng: number;
    city?: string;
    district?: string;
    street?: string;
    building?: string;
    postalCode?: string;
  };
  isPrimaryPhoneEnabled?: boolean;
  // 🆕 الوسائط والمستندات
  mediaFiles?: MediaFile[];
  documents?: DocumentFile[];
  enhancedNotes?: EnhancedNote[];
  // 🆕 الاجتماعات وسجل النشاط
  enhancedMeetings?: EnhancedMeeting[];
  activityLogs?: ActivityLog[];
}

interface CustomerDetailsWithSlidesProps {
  customer: Customer;
  onClose: () => void;
  onUpdate?: (customer: Customer) => void;
  isFullPage?: boolean; // ← إضافة
  onNavigate?: (page: string, options?: any) => void; // ← للانتقال بين الصفحات
}

// 🆕 واجهة السلايد المخصص - نسخة كاملة من معلومات عامة
interface CustomSlide {
  id: string;
  title: string;
  icon: typeof User; // نوع الأيقونة
  iconName: string; // اسم الأيقونة للحفظ
  color: string;
  isPrimary: boolean;
  data: {
    // 🆕 المعلومات الأساسية (الاسم، الشركة، الوظيفة)
    name?: string;
    company?: string;
    position?: string;
    // معلومات الاتصال
    phone?: string;
    email?: string;
    whatsappNumber?: string;
    alternativePhones?: { id: string; number: string; type: 'home' | 'work' | 'mobile'; }[];
    companyEmail?: string;
    website?: string;
    additionalWebsites?: string[];
    // الموقع
    location?: {
      lat: number;
      lng: number;
      city?: string;
      district?: string;
      street?: string;
      building?: string;
      postalCode?: string;
    };
    isPrimaryPhoneEnabled?: boolean;
    // التصنيف والاهتمام
    type?: CustomerType;
    interestLevel?: InterestLevel;
    tags?: string[];
    assignedTo?: string;
    // ملاحظات
    notes?: string;
  };
}

const PRIORITY_CONFIG = {
  'urgent-important': { label: 'هام وعاجل', color: 'bg-red-100 text-red-700 border-red-300' },
  'important': { label: 'هام وغير عاجل', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  'urgent': { label: 'غير هام وعاجل', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  'normal': { label: 'غير هام وغير عاجل', color: 'bg-green-100 text-green-700 border-green-300' }
};

// ============================================================
// 🎨 CUSTOMER TYPE COLORS (خط علوي)
// ============================================================

const CUSTOMER_TYPE_COLORS: Record<CustomerType, { border: string; bg: string; label: string }> = {
  seller: { border: 'border-t-4 border-t-[#1E90FF]', bg: 'bg-[#1E90FF]/10', label: 'بائع' },
  buyer: { border: 'border-t-4 border-t-[#32CD32]', bg: 'bg-[#32CD32]/10', label: 'مشتري' },
  lessor: { border: 'border-t-4 border-t-[#FF8C00]', bg: 'bg-[#FF8C00]/10', label: 'مؤجر' },
  tenant: { border: 'border-t-4 border-t-[#FFD700]', bg: 'bg-[#FFD700]/10', label: 'مستأجر' },
  finance: { border: 'border-t-4 border-t-[#9370DB]', bg: 'bg-[#9370DB]/10', label: 'تمويل' },
  other: { border: 'border-t-4 border-t-[#A9A9A9]', bg: 'bg-[#A9A9A9]/10', label: 'أخرى' }
};

// ============================================================
// ❤️ INTEREST LEVEL COLORS (خط سفلي)
// ============================================================

const INTEREST_LEVEL_COLORS: Record<InterestLevel, { border: string; bg: string; label: string }> = {
  'passionate': { border: 'border-b-4 border-b-[#DC143C]', bg: 'bg-[#DC143C]/10', label: 'شغوف' },
  'interested': { border: 'border-b-4 border-b-[#8B4513]', bg: 'bg-[#8B4513]/10', label: 'مهتم' },
  'moderate': { border: 'border-b-4 border-b-[#800020]', bg: 'bg-[#800020]/10', label: 'معتدل' },
  'limited': { border: 'border-b-4 border-b-[#7B3F00]', bg: 'bg-[#7B3F00]/10', label: 'محدود' },
  'not-interested': { border: 'border-b-4 border-b-[#000000]', bg: 'bg-[#000000]/10', label: 'غير مهتم' }
};

// ============================================================
// 🎯 MAIN COMPONENT
// ============================================================

// دوال إدارة السلايدات المخصصة في localStorage
const CUSTOM_SLIDES_STORAGE_KEY = 'crm_custom_slides';

function getCustomSlides(customerId: string): CustomSlide[] {
  try {
    const stored = localStorage.getItem(`${CUSTOM_SLIDES_STORAGE_KEY}_${customerId}`);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveCustomSlides(customerId: string, slides: CustomSlide[]) {
  localStorage.setItem(`${CUSTOM_SLIDES_STORAGE_KEY}_${customerId}`, JSON.stringify(slides));
}

function getPrimarySlideIndex(customerId: string): number {
  try {
    const stored = localStorage.getItem(`${CUSTOM_SLIDES_STORAGE_KEY}_${customerId}_primary`);
    return stored ? parseInt(stored) : 0;
  } catch {
    return 0;
  }
}

function setPrimarySlideIndex(customerId: string, index: number) {
  localStorage.setItem(`${CUSTOM_SLIDES_STORAGE_KEY}_${customerId}_primary`, index.toString());
}

export default function CustomerDetailsWithSlides({
  customer,
  onClose,
  onUpdate,
  isFullPage = false, // ← إضافة
  onNavigate // ← إضافة
}: CustomerDetailsWithSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(() => getPrimarySlideIndex(customer.id));
  const [direction, setDirection] = useState(0);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [customSlides, setCustomSlides] = useState<CustomSlide[]>(() => getCustomSlides(customer.id));
  const [customerImage, setCustomerImage] = useState<string | undefined>(customer.profileImage || customer.image);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 📱 التمرير بين السلايدات باللمس (swipe)
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const minSwipeDistance = 50; // الحد الأدنى للمسافة للانتقال بين السلايدات

  // إضافة المتغيرات الديناميكية
  const containerClass = isFullPage
    ? "min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#fffef7]"
    : "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4";
  
  const contentClass = isFullPage
    ? "w-full min-h-screen"
    : "bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl";

  // ✨ التحقق من وجود عروض/طلبات جديدة من العملاء
  const brokerPhone = customer.phone;
  const receivedOffers = customer.receivedOffers || [];
  const receivedRequests = customer.receivedRequests || [];
  const hasNewOffers = customer.hasNotification || false;
  const hasNewRequests = customer.hasNotification || false;

  const defaultSlides = [
    { id: 'general-info', title: 'معلومات عامة', icon: User, color: '#D4AF37', isDefault: true },
    { id: 'published-ads', title: 'إعلان منشور', icon: Megaphone, color: '#DC143C', isDefault: true },
    { id: 'financing', title: 'طلب حسبة التمويل', icon: DollarSign, color: '#01411C', isDefault: true },
    { id: 'property-offer', title: 'عرض العقار', icon: Home, color: '#D4AF37', isDefault: true },
    { id: 'property-request', title: 'طلب العقار', icon: TrendingUp, color: '#065f41', isDefault: true },
    { id: 'received-offers', title: `العروض المستقبلة (${receivedOffers.length})`, icon: Home, color: '#10B981', isDefault: true, hasNotification: hasNewOffers },
    { id: 'received-requests', title: `الطلبات المستقبلة (${receivedRequests.length})`, icon: Search, color: '#F59E0B', isDefault: true, hasNotification: hasNewRequests },
    { id: 'additional-info', title: 'معلومات إضافية', icon: FileText, color: '#01411C', isDefault: true }
  ];

  // دمج السلايدات الافتراضية مع المخصصة
  const iconMap: Record<string, typeof User> = {
    User, Phone, Mail, Building2, Briefcase, DollarSign, Home, TrendingUp,
    FileText, Clock, CheckCircle, Calendar, Star, Tag, MapPin, Globe, Bell
  };

  const allSlides = [
    ...defaultSlides,
    ...customSlides.map(cs => ({
      id: cs.id,
      title: cs.title,
      icon: iconMap[cs.iconName] || User,
      color: cs.color,
      isDefault: false,
      customData: cs.data
    }))
  ];

  // حفظ السلايدات المخصصة عند التغيير
  useEffect(() => {
    saveCustomSlides(customer.id, customSlides);
  }, [customSlides, customer.id]);

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % allSlides.length);
  };

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  };

  const handleSlideClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    
    // ✅ حذف الدائرة الحمراء عند فتح سلايد "العروض المستقبلة" أو "الطلبات المستقبلة"
    const clickedSlide = allSlides[index];
    if (clickedSlide.id === 'received-offers' || clickedSlide.id === 'received-requests') {
      // حذف hasNotification من بطاقة العميل
      const brokerCustomers = JSON.parse(localStorage.getItem('crm_customers') || '[]');
      
      const updatedCustomers = brokerCustomers.map((c: any) => 
        c.id === customer.id ? { ...c, hasNotification: false } : c
      );
      
      localStorage.setItem('crm_customers', JSON.stringify(updatedCustomers));
      console.log('✅ تم حذف الدائرة الحمراء النابضة من بطاقة:', customer.name);
      
      // ✅ تحديث الواجهة
      if (onUpdate) {
        onUpdate({ ...customer, hasNotification: false });
      }
    }
  };

  // 📱 معالجات التمرير باللمس للانتقال بين السلايدات
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = swipeDistance > minSwipeDistance;
    const isRightSwipe = swipeDistance < -minSwipeDistance;

    if (isLeftSwipe) {
      // السحب لليسار = الانتقال للسلايد التالي (في RTL)
      handleNextSlide();
    } else if (isRightSwipe) {
      // السحب لليمين = الانتقال للسلايد السابق (في RTL)
      handlePrevSlide();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setCustomerImage(imageData);
        if (onUpdate) {
          onUpdate({ ...customer, image: imageData });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (!customer.profileImage) {
      imageInputRef.current?.click();
    }
  };

  const handleAddCustomSlide = (newSlide: CustomSlide) => {
    setCustomSlides(prev => [...prev, newSlide]);
    setShowAddSlideModal(false);
    // الانتقال للسلايد الجديد
    setCurrentSlide(allSlides.length);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السلايد؟')) {
      const slideIndex = allSlides.findIndex(s => s.id === slideId);
      setCustomSlides(prev => prev.filter(s => s.id !== slideId));
      
      // إذا كان السلايد المحذوف هو الحالي، الانتقال للأول
      if (currentSlide === slideIndex) {
        setCurrentSlide(0);
      } else if (currentSlide > slideIndex) {
        setCurrentSlide(prev => prev - 1);
      }
    }
  };

  const handleSetPrimary = (index: number) => {
    setPrimarySlideIndex(customer.id, index);
    setCurrentSlide(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClass} // ← ديناميكي
      dir="rtl"
    >
      <motion.div
        initial={isFullPage ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
        animate={isFullPage ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        exit={isFullPage ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
        className={contentClass} // ← ديناميكي
      >
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] p-6 text-white relative">
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div 
                className={`w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-[#D4AF37] overflow-hidden ${!customer.profileImage ? 'cursor-pointer hover:bg-white/30 transition-all' : ''}`}
                onClick={handleImageClick}
                title={!customer.profileImage ? 'انقر لرفع صورة' : ''}
              >
                {customerImage ? (
                  <img src={customerImage} alt={customer.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#D4AF37]" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-right text-[20px]">{customer.name}</h2>
                <p className="text-white/80 text-right">{customer.phone}</p>
              </div>
            </div>

            {/* زر العودة - الزاوية العلوية اليسرى */}
            <div className="flex flex-col items-end gap-2">
              <Button 
                variant="ghost" 
                size={isFullPage ? "default" : "icon"} 
                onClick={onClose} 
                className="text-white hover:bg-white/20"
              >
                {isFullPage ? (
                  <>
                    <ArrowRight className="w-5 h-5 ml-2" />
                    عودة
                  </>
                ) : (
                  <X className="w-6 h-6" />
                )}
              </Button>
              
              {/* زر إضافة سلايد - تحت زر عودة في الموبايل */}
              <button
                onClick={() => setShowAddSlideModal(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#D4AF37] text-white hover:bg-[#C4A037] transition-all shadow-lg"
                title="إضافة سلايد جديد"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* زر إضافة سلايد - للشاشات الكبيرة */}
          <button
            onClick={() => setShowAddSlideModal(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-white hover:bg-[#C4A037] transition-all shadow-lg absolute left-6 top-6"
            title="إضافة سلايد جديد"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">إضافة سلايد</span>
          </button>

          {/* مؤشرات السلايدات */}
          <div 
            className="overflow-x-auto scrollbar-hide touch-scroll-x"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}
          >
            <div className="flex gap-2 min-w-max px-1">
              {allSlides.map((slide, index) => (
                <div key={slide.id} className="relative group flex-shrink-0">
                  <button
                    onClick={() => handleSlideClick(index)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      currentSlide === index
                        ? 'bg-white text-[#01411C] scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <slide.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{slide.title}</span>
                    
                    {/* أيقونة التثبيت */}
                    {getPrimarySlideIndex(customer.id) === index && (
                      <Pin className="w-3 h-3 text-[#D4AF37]" fill="currentColor" />
                    )}
                    
                    {/* 🔴 الدائرة الحمراء النابضة للإشعارات الجديدة */}
                    {slide.hasNotification && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </button>

                  {/* أزرار الإجراءات (تظهر عند المرور) */}
                  {!slide.isDefault && (
                    <div className="absolute -top-2 -left-2 hidden group-hover:flex gap-1 z-10">
                      {/* زر التثبيت كرئيسي */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(index);
                        }}
                        className="p-1 rounded-full bg-[#D4AF37] text-white hover:bg-[#C4A037] shadow-lg"
                        title="تثبيت كرئيسي"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      
                      {/* زر الحذف */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(slide.id);
                        }}
                        className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg"
                        title="حذف السلايد"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div 
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto touch-scroll-enabled"
              style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
            >
              {currentSlide === 0 && <GeneralInfoSlide customer={customer} onUpdate={onUpdate} />}
              {currentSlide === 1 && <PublishedAdsSlide customer={customer} onUpdate={onUpdate} />}
              {currentSlide === 2 && <FinancingSlide />}
              {currentSlide === 3 && <PropertyOfferSlide />}
              {currentSlide === 4 && <PropertyRequestSlide />}
              {currentSlide === 5 && <ReceivedOffersSlideNew receivedOffers={receivedOffers} receivedRequests={receivedRequests} customerName={customer.name} customerPhone={customer.phone} onNavigate={onNavigate} />}
              {currentSlide === 6 && <ReceivedRequestsSlide brokerPhone={brokerPhone} />}
              {currentSlide === 7 && <AdditionalInfoSlide />}
              {currentSlide >= defaultSlides.length && (
                <CustomSlideView 
                  slideData={allSlides[currentSlide].customData || {}}
                  onUpdate={(data) => {
                    const slideId = allSlides[currentSlide].id;
                    setCustomSlides(prev => prev.map(s => 
                      s.id === slideId ? { ...s, data } : s
                    ));
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* أزرار التنقل */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Button variant="outline" size="icon" onClick={handlePrevSlide} className="rounded-full bg-white/90 hover:bg-white shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Button variant="outline" size="icon" onClick={handleNextSlide} className="rounded-full bg-white/90 hover:bg-white shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* الفوتر */}
        <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
          <div className="flex gap-2">
            {allSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'bg-[#01411C] w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>إغلاق</Button>
            <Button className="bg-[#01411C] hover:bg-[#065f41]">
              <CheckCircle className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </motion.div>

      {/* مودال إضافة سلايد جديد */}
      {showAddSlideModal && (
        <AddSlideModal
          onClose={() => setShowAddSlideModal(false)}
          onAdd={handleAddCustomSlide}
        />
      )}
    </motion.div>
  );
}

// ============================================================
// 📋 GENERAL INFO SLIDE - المعلومات العامة المحسنة
// ============================================================

function GeneralInfoSlide({ customer, onUpdate }: { customer: Customer; onUpdate?: (customer: Customer) => void }) {
  const [editedCustomer, setEditedCustomer] = useState({
    ...customer,
    type: customer.type || 'other',
    interestLevel: customer.interestLevel || 'moderate'
  });
  const [notes, setNotes] = useState<Note[]>(customer.customerNotes || []);
  const [tasks, setTasks] = useState<Task[]>(customer.customerTasks || []);
  const [newNoteText, setNewNoteText] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFinancialForm, setShowFinancialForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  
  // 🆕 حالات جديدة للوسائط والمستندات
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(customer.mediaFiles || []);
  const [documents, setDocuments] = useState<DocumentFile[]>(customer.documents || []);
  const [enhancedNotes, setEnhancedNotes] = useState<EnhancedNote[]>(customer.enhancedNotes || []);
  const [draggedNoteIndex, setDraggedNoteIndex] = useState<number | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  // 🆕 حالات الاجتماعات المحسنة وسجل النشاط
  const [enhancedMeetings, setEnhancedMeetings] = useState<EnhancedMeeting[]>(customer.enhancedMeetings || []);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(customer.activityLogs || []);
  const [showEnhancedMeetingForm, setShowEnhancedMeetingForm] = useState(false);
  const [activityFilter, setActivityFilter] = useState<ActivityType | 'all'>('all');

  // إضافة ملاحظة
  const handleAddNote = () => {
    if (newNoteText.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        text: newNoteText,
        createdAt: new Date()
      };
      setNotes([...notes, newNote]);
      setNewNoteText('');
    }
  };

  // حذف ملاحظة
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // تبديل حالة إكمال المهمة
  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // تبديل حالة المفضلة
  const toggleTaskFavorite = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, favorite: !task.favorite } : task
    ));
  };

  // 🆕 معالجات الوسائط المتعددة
  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const maxFiles = 27;
    if (mediaFiles.length + files.length > maxFiles) {
      alert(`يمكنك رفع ${maxFiles} ملف كحد أقصى`);
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia: MediaFile = {
          id: Date.now().toString() + Math.random(),
          url: e.target?.result as string,
          type: file.type.startsWith('video') ? 'video' : 'image',
          name: file.name,
          uploadedAt: new Date(),
          tags: []
        };
        setMediaFiles(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter(m => m.id !== id));
  };

  // 🆕 معالجات المستندات
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 100 * 1024 * 1024) { // 100MB
        alert('حجم الملف يجب أن يكون أقل من 100 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        let fileType: DocumentFile['type'] = 'other';
        if (file.type.includes('pdf')) fileType = 'pdf';
        else if (file.type.includes('word') || file.type.includes('document')) fileType = 'word';
        else if (file.type.includes('excel') || file.type.includes('spreadsheet')) fileType = 'excel';

        const newDoc: DocumentFile = {
          id: Date.now().toString() + Math.random(),
          url: e.target?.result as string,
          name: file.name,
          type: fileType,
          size: file.size,
          uploadedAt: new Date()
        };
        setDocuments(prev => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // 🆕 معالجات الملاحظات المحسنة
  const handleAddEnhancedNote = () => {
    const newNote: EnhancedNote = {
      id: Date.now().toString(),
      title: 'ملاحظة جديدة',
      text: '',
      createdAt: new Date(),
      attachments: [],
      order: enhancedNotes.length
    };
    setEnhancedNotes([...enhancedNotes, newNote]);
  };

  const handleUpdateEnhancedNote = (id: string, updates: Partial<EnhancedNote>) => {
    setEnhancedNotes(enhancedNotes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const handleDeleteEnhancedNote = (id: string) => {
    setEnhancedNotes(enhancedNotes.filter(note => note.id !== id));
  };

  const handleDragStart = (index: number) => {
    setDraggedNoteIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedNoteIndex === null || draggedNoteIndex === index) return;

    const newNotes = [...enhancedNotes];
    const draggedNote = newNotes[draggedNoteIndex];
    newNotes.splice(draggedNoteIndex, 1);
    newNotes.splice(index, 0, draggedNote);
    
    setEnhancedNotes(newNotes.map((note, i) => ({ ...note, order: i })));
    setDraggedNoteIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedNoteIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#01411C]">📋 المعلومات العامة</h3>
          <p className="text-gray-600 text-sm">البيانات الأساسية والأنشطة</p>
        </div>
      </div>

      {/* قسم المعلومات العامة المطلوب */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <CardTitle className="flex items-center gap-2 text-[#01411C]">
            <User className="w-5 h-5 text-[#D4AF37]" />
            المعلومات العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* العمود الأيمن: الحقول النصية */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 text-right block">الاسم</label>
                <Input 
                  value={editedCustomer.name} 
                  onChange={(e) => {
                    setEditedCustomer({ ...editedCustomer, name: e.target.value });
                    if (onUpdate) onUpdate({ ...editedCustomer, name: e.target.value });
                  }}
                  className="border-2 border-gray-200 focus:border-[#D4AF37]" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 text-right block">الوظيفة</label>
                <Input 
                  value={editedCustomer.position || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ ...editedCustomer, position: e.target.value });
                    if (onUpdate) onUpdate({ ...editedCustomer, position: e.target.value });
                  }}
                  className="border-2 border-gray-200 focus:border-[#D4AF37]" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block text-right">الشركة</label>
                <Input 
                  value={editedCustomer.company || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ ...editedCustomer, company: e.target.value });
                    if (onUpdate) onUpdate({ ...editedCustomer, company: e.target.value });
                  }}
                  className="border-2 border-gray-200 focus:border-[#D4AF37]" 
                />
              </div>
            </div>

            {/* العمود الأيسر: المستطيلات */}
            <div className="flex flex-col gap-4 md:w-1/3">
              {/* نوع العميل */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block text-right">نوع العميل</label>
                <select
                  value={editedCustomer.type}
                  onChange={(e) => {
                    const newType = e.target.value as CustomerType;
                    setEditedCustomer({ ...editedCustomer, type: newType });
                    if (onUpdate) onUpdate({ ...editedCustomer, type: newType });
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-sm ${CUSTOMER_TYPE_COLORS[editedCustomer.type]?.border || 'border-gray-300'} ${CUSTOMER_TYPE_COLORS[editedCustomer.type]?.bg || 'bg-white'} focus:ring-2 focus:ring-[#D4AF37]`}
                >
                  <option value="seller">🔵 بائع</option>
                  <option value="buyer">🟢 مشتري</option>
                  <option value="lessor">🟠 مؤجر</option>
                  <option value="tenant">🟡 مستأجر</option>
                  <option value="finance">🟣 تمويل</option>
                  <option value="other">⚫ أخرى</option>
                </select>
              </div>

              {/* درجة الاهتمام */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block text-right">درجة الاهتمام</label>
                <select
                  value={editedCustomer.interestLevel}
                  onChange={(e) => {
                    const newInterest = e.target.value as InterestLevel;
                    setEditedCustomer({ ...editedCustomer, interestLevel: newInterest });
                    if (onUpdate) onUpdate({ ...editedCustomer, interestLevel: newInterest });
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-sm ${editedCustomer.interestLevel ? INTEREST_LEVEL_COLORS[editedCustomer.interestLevel].border : 'border-gray-300'} ${editedCustomer.interestLevel ? INTEREST_LEVEL_COLORS[editedCustomer.interestLevel].bg : 'bg-gray-50'} focus:ring-2 focus:ring-[#D4AF37]`}
                >
                  <option value="passionate">🔴 شغوف</option>
                  <option value="interested">🟠 مهتم</option>
                  <option value="moderate">🟣 معتدل</option>
                  <option value="limited">🟤 محدود</option>
                  <option value="not-interested">⚫ غير مهتم</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الاتصال الموسعة */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <CardTitle className="flex items-center gap-2 text-[#01411C]">
            <Phone className="w-5 h-5 text-[#D4AF37]" />
            معلومات الاتصال الكاملة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* 1️⃣ رقم الجوال الأساسي */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 text-right">
                <Phone className="w-4 h-4 text-green-600" />
                📱 رقم الجوال الأساسي
              </label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 flex items-center gap-1 text-right">
                  <input
                    type="checkbox"
                    checked={editedCustomer.isPrimaryPhoneEnabled !== false}
                    onChange={(e) => {
                      setEditedCustomer({ ...editedCustomer, isPrimaryPhoneEnabled: e.target.checked });
                      if (onUpdate) onUpdate({ ...editedCustomer, isPrimaryPhoneEnabled: e.target.checked });
                    }}
                    className="rounded"
                  />
                  تفعيل الاتصال
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Input 
                value={editedCustomer.phone} 
                onChange={(e) => {
                  setEditedCustomer({ ...editedCustomer, phone: e.target.value });
                  if (onUpdate) onUpdate({ ...editedCustomer, phone: e.target.value });
                }}
                placeholder="05XXXXXXXX"
                className="border-2 border-gray-200 focus:border-green-500" 
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={editedCustomer.isPrimaryPhoneEnabled === false}
                  className={`${editedCustomer.isPrimaryPhoneEnabled === false ? 'opacity-50' : 'hover:bg-green-100'}`}
                  title="اتصال"
                >
                  <PhoneCall className="w-4 h-4 text-green-600" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={editedCustomer.isPrimaryPhoneEnabled === false}
                  className={`${editedCustomer.isPrimaryPhoneEnabled === false ? 'opacity-50' : 'hover:bg-green-100'}`}
                  title="واتساب"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={editedCustomer.isPrimaryPhoneEnabled === false}
                  className={`${editedCustomer.isPrimaryPhoneEnabled === false ? 'opacity-50' : 'hover:bg-blue-100'}`}
                  title="رسالة نصية"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* 2️⃣ رقم إضافي (فرعي) */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 text-right block">
              <Phone className="w-4 h-4 text-blue-600" />
              📞 رقم إضافي (فرعي)
            </label>
            <div className="space-y-2">
              {(editedCustomer.alternativePhones || []).map((altPhone, index) => (
                <div key={altPhone.id} className="flex gap-2">
                  <Input 
                    value={altPhone.number} 
                    onChange={(e) => {
                      const newPhones = [...(editedCustomer.alternativePhones || [])];
                      newPhones[index] = { ...altPhone, number: e.target.value };
                      setEditedCustomer({ ...editedCustomer, alternativePhones: newPhones });
                      if (onUpdate) onUpdate({ ...editedCustomer, alternativePhones: newPhones });
                    }}
                    placeholder="05XXXXXXXX"
                    className="flex-1 border-2 border-gray-200" 
                  />
                  <select
                    value={altPhone.type}
                    onChange={(e) => {
                      const newPhones = [...(editedCustomer.alternativePhones || [])];
                      newPhones[index] = { ...altPhone, type: e.target.value as 'home' | 'work' | 'mobile' };
                      setEditedCustomer({ ...editedCustomer, alternativePhones: newPhones });
                      if (onUpdate) onUpdate({ ...editedCustomer, alternativePhones: newPhones });
                    }}
                    className="px-3 py-2 border-2 border-gray-200 rounded-md text-sm"
                  >
                    <option value="mobile">جوال</option>
                    <option value="home">منزل</option>
                    <option value="work">عمل</option>
                  </select>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const newPhones = (editedCustomer.alternativePhones || []).filter((_, i) => i !== index);
                      setEditedCustomer({ ...editedCustomer, alternativePhones: newPhones });
                      if (onUpdate) onUpdate({ ...editedCustomer, alternativePhones: newPhones });
                    }}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newPhone = {
                    id: Date.now().toString(),
                    number: '',
                    type: 'mobile' as 'mobile'
                  };
                  setEditedCustomer({ 
                    ...editedCustomer, 
                    alternativePhones: [...(editedCustomer.alternativePhones || []), newPhone] 
                  });
                  if (onUpdate) onUpdate({ 
                    ...editedCustomer, 
                    alternativePhones: [...(editedCustomer.alternativePhones || []), newPhone] 
                  });
                }}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة رقم فرعي
              </Button>
            </div>
          </div>

          {/* 3️⃣ رقم واتساب (منفصل) */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 text-right block">
              <MessageCircle className="w-4 h-4 text-green-600" />
              💬 رقم واتساب (اختياري)
            </label>
            <div className="flex gap-2">
              <Input 
                value={editedCustomer.whatsappNumber || ''} 
                onChange={(e) => {
                  setEditedCustomer({ ...editedCustomer, whatsappNumber: e.target.value });
                  if (onUpdate) onUpdate({ ...editedCustomer, whatsappNumber: e.target.value });
                }}
                placeholder="05XXXXXXXX - منفصل عن الرقم الأساسي"
                className="border-2 border-gray-200 focus:border-green-500" 
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="hover:bg-green-100"
                title="فتح واتساب"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
              </Button>
            </div>
          </div>

          {/* 4️⃣ البريد الإلكتروني */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 text-right block">
                <Mail className="w-4 h-4 text-blue-600" />
                📧 البريد الشخصي
              </label>
              <Input 
                value={editedCustomer.email || ''} 
                onChange={(e) => {
                  setEditedCustomer({ ...editedCustomer, email: e.target.value });
                  if (onUpdate) onUpdate({ ...editedCustomer, email: e.target.value });
                }}
                placeholder="example@email.com"
                type="email"
                className="border-2 border-gray-200 focus:border-blue-500" 
              />
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 text-right block">
                <Building2 className="w-4 h-4 text-purple-600" />
                🏢 بريد الشركة (اختياري)
              </label>
              <Input 
                value={editedCustomer.companyEmail || ''} 
                onChange={(e) => {
                  setEditedCustomer({ ...editedCustomer, companyEmail: e.target.value });
                  if (onUpdate) onUpdate({ ...editedCustomer, companyEmail: e.target.value });
                }}
                placeholder="work@company.com"
                type="email"
                className="border-2 border-gray-200 focus:border-purple-500" 
              />
            </div>
          </div>

          {/* 5️⃣ الموقع الإلكتروني / النطاق */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 text-right block">
              <Globe className="w-4 h-4 text-indigo-600" />
              🌐 الموقع الإلكتروني / النطاق
            </label>
            <div className="space-y-2">
              <Input 
                value={editedCustomer.website || ''} 
                onChange={(e) => {
                  setEditedCustomer({ ...editedCustomer, website: e.target.value });
                  if (onUpdate) onUpdate({ ...editedCustomer, website: e.target.value });
                }}
                placeholder="https://example.com"
                type="url"
                className="border-2 border-gray-200 focus:border-indigo-500" 
              />
              {(editedCustomer.additionalWebsites || []).map((site, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={site} 
                    onChange={(e) => {
                      const newSites = [...(editedCustomer.additionalWebsites || [])];
                      newSites[index] = e.target.value;
                      setEditedCustomer({ ...editedCustomer, additionalWebsites: newSites });
                      if (onUpdate) onUpdate({ ...editedCustomer, additionalWebsites: newSites });
                    }}
                    placeholder="https://additional-site.com"
                    type="url"
                    className="flex-1 border-2 border-gray-200" 
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const newSites = (editedCustomer.additionalWebsites || []).filter((_, i) => i !== index);
                      setEditedCustomer({ ...editedCustomer, additionalWebsites: newSites });
                      if (onUpdate) onUpdate({ ...editedCustomer, additionalWebsites: newSites });
                    }}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditedCustomer({ 
                    ...editedCustomer, 
                    additionalWebsites: [...(editedCustomer.additionalWebsites || []), ''] 
                  });
                  if (onUpdate) onUpdate({ 
                    ...editedCustomer, 
                    additionalWebsites: [...(editedCustomer.additionalWebsites || []), ''] 
                  });
                }}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة موقع إضافي
              </Button>
            </div>
          </div>

          {/* 6️⃣ الموقع الجغرافي */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3 text-right block">
              <MapPin className="w-4 h-4 text-red-600" />
              📍 الموقع الجغرافي
            </label>
            <div className="space-y-3">
              {/* خريطة تفاعلية - placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">انقر للاختيار من خرائط قوقل</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <MapPin className="w-4 h-4 ml-2" />
                    فتح الخريطة
                  </Button>
                </div>
              </div>

              {/* الحقول النصية */}
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  value={editedCustomer.location?.city || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ 
                      ...editedCustomer, 
                      location: { ...(editedCustomer.location || { lat: 0, lng: 0 }), city: e.target.value } 
                    });
                  }}
                  placeholder="🏙️ المدينة"
                  className="border-2 border-gray-200" 
                />
                <Input 
                  value={editedCustomer.location?.district || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ 
                      ...editedCustomer, 
                      location: { ...(editedCustomer.location || { lat: 0, lng: 0 }), district: e.target.value } 
                    });
                  }}
                  placeholder="🏘️ الحي / المنطقة"
                  className="border-2 border-gray-200" 
                />
                <Input 
                  value={editedCustomer.location?.street || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ 
                      ...editedCustomer, 
                      location: { ...(editedCustomer.location || { lat: 0, lng: 0 }), street: e.target.value } 
                    });
                  }}
                  placeholder="🛣️ الشارع"
                  className="border-2 border-gray-200" 
                />
                <Input 
                  value={editedCustomer.location?.building || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ 
                      ...editedCustomer, 
                      location: { ...(editedCustomer.location || { lat: 0, lng: 0 }), building: e.target.value } 
                    });
                  }}
                  placeholder="🏢 المبنى / البرج"
                  className="border-2 border-gray-200" 
                />
                <Input 
                  value={editedCustomer.location?.postalCode || ''} 
                  onChange={(e) => {
                    setEditedCustomer({ 
                      ...editedCustomer, 
                      location: { ...(editedCustomer.location || { lat: 0, lng: 0 }), postalCode: e.target.value } 
                    });
                  }}
                  placeholder="📮 الرمز البريدي"
                  className="border-2 border-gray-200 col-span-2" 
                />
              </div>

              {/* عرض الإحداثيات */}
              {editedCustomer.location?.lat && editedCustomer.location?.lng && (
                <div className="flex items-center gap-2 p-2 bg-white rounded border text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>الإحداثيات: {editedCustomer.location.lat.toFixed(6)}, {editedCustomer.location.lng.toFixed(6)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7️⃣ الوسائط المتعددة - صور وفيديو */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
              🖼️ الوسائط المتعددة ({mediaFiles.length}/27)
            </CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={() => mediaInputRef.current?.click()}
              className="bg-[#01411C] hover:bg-[#065f41]"
              disabled={mediaFiles.length >= 27}
            >
              <Upload className="w-4 h-4 ml-2" />
              رفع صور/فيديو
            </Button>
            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {mediaFiles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">لا توجد وسائط محملة</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => mediaInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 ml-2" />
                اسحب وأفلت أو انقر للرفع
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {mediaFiles.map((media) => (
                <div key={media.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#D4AF37] transition-all">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={() => handleDeleteMedia(media.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{media.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 8️⃣ المستندات والملفات */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <File className="w-5 h-5 text-[#D4AF37]" />
              📁 المستندات والملفات ({documents.length})
            </CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={() => documentInputRef.current?.click()}
              className="bg-[#01411C] hover:bg-[#065f41]"
            >
              <Upload className="w-4 h-4 ml-2" />
              رفع مستند
            </Button>
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple
              onChange={handleDocumentUpload}
              className="hidden"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {documents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">لا توجد مستندات محملة</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => documentInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 ml-2" />
                رفع PDF, Word, Excel
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#D4AF37] transition-all">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.type === 'pdf' ? 'bg-red-100' :
                    doc.type === 'word' ? 'bg-blue-100' :
                    doc.type === 'excel' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <File className={`w-5 h-5 ${
                      doc.type === 'pdf' ? 'text-red-600' :
                      doc.type === 'word' ? 'text-blue-600' :
                      doc.type === 'excel' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {(doc.size / 1024).toFixed(2)} KB - {new Date(doc.uploadedAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button type="button" size="icon" variant="outline" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 9️⃣ الملاحظات المحسنة - مع عناوين وإمكانية السحب */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              📝 الملاحظات المحسنة ({enhancedNotes.length})
            </CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={handleAddEnhancedNote}
              className="bg-[#01411C] hover:bg-[#065f41]"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة ملاحظة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {enhancedNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد ملاحظات. انقر "إضافة ملاحظة" للبدء.</p>
            </div>
          ) : (
            enhancedNotes
              .sort((a, b) => a.order - b.order)
              .map((note, index) => (
                <div
                  key={note.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 rounded-lg border-2 transition-all cursor-move bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-[#D4AF37] ${
                    draggedNoteIndex === index ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Input
                        value={note.title}
                        onChange={(e) => handleUpdateEnhancedNote(note.id, { title: e.target.value })}
                        className="font-bold border-0 bg-transparent p-0 focus:ring-0"
                        placeholder="عنوان الملاحظة"
                      />
                      <Textarea
                        value={note.text}
                        onChange={(e) => handleUpdateEnhancedNote(note.id, { text: e.target.value })}
                        className="border-green-200 bg-white min-h-[80px]"
                        placeholder="اكتب ملاحظتك هنا..."
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                        <div className="flex gap-1">
                          <Button type="button" size="icon" variant="outline" className="h-7 w-7">
                            <Upload className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleDeleteEnhancedNote(note.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      {/* الملاحظات القديمة - محفوظة */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <CardTitle className="flex items-center gap-2 text-[#01411C]">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            الملاحظات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {/* قائمة الملاحظات */}
          {notes.map((note) => (
            <div key={note.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="text-gray-800">{note.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(note.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* إضافة ملاحظة جديدة */}
          <div className="flex gap-2">
            <Textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="اكتب ملاحظة جديدة..."
              className="border-2 border-gray-200"
              rows={2}
            />
            <Button
              onClick={handleAddNote}
              className="bg-[#01411C] text-white hover:bg-[#065f41]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔟 نظام المهام المحسن */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              ✅ نظام المهام ({tasks.filter(t => !t.completed).length} نشطة)
            </CardTitle>
            <Button
              onClick={() => setShowTaskForm(true)}
              size="sm"
              className="bg-[#01411C] text-white hover:bg-[#065f41]"
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {/* المهام المفضلة أولاً */}
          {tasks
            .sort((a, b) => {
              if (a.favorite && !b.favorite) return -1;
              if (!a.favorite && b.favorite) return 1;
              return 0;
            })
            .map((task) => (
              <div
                key={task.id}
                className={`relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                  task.completed ? 'bg-gray-50 border-gray-300 opacity-75' : 'bg-white'
                } ${
                  task.priority === 'urgent-important' ? 'border-l-4 border-l-[#FF0000]' :
                  task.priority === 'important' ? 'border-l-4 border-l-[#FFA500]' :
                  task.priority === 'urgent' ? 'border-l-4 border-l-[#FFFF00]' :
                  'border-l-4 border-l-[#0000FF]'
                }`}
                style={{
                  boxShadow: task.favorite && !task.completed ? '0 4px 12px rgba(212, 175, 55, 0.2)' : 'none'
                }}
              >
                {/* المفضلة - نجمة كبيرة في الأعلى */}
                {task.favorite && !task.completed && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                )}

                {/* دائرة الإكمال */}
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="mt-1 transition-transform hover:scale-110"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-[#01411C]" />
                  )}
                </button>

                {/* محتوى المهمة */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-bold text-base ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h4>
                    {/* نجمة المفضلة */}
                    <button
                      onClick={() => toggleTaskFavorite(task.id)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          task.favorite ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-400 hover:text-[#D4AF37]'
                        }`}
                      />
                    </button>
                  </div>
                  <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {/* مستوى الأهمية بألوان محددة */}
                    <Badge 
                      className={`border-2 ${
                        task.priority === 'urgent-important' ? 'bg-red-100 text-red-700 border-red-300' :
                        task.priority === 'important' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                        task.priority === 'urgent' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                        'bg-blue-100 text-blue-700 border-blue-300'
                      }`}
                    >
                      {task.priority === 'urgent-important' && '🔴'}
                      {task.priority === 'important' && '🟠'}
                      {task.priority === 'urgent' && '🟡'}
                      {task.priority === 'normal' && '🔵'}
                      {' '}
                      {PRIORITY_CONFIG[task.priority].label}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد مهام. انقر "إضافة مهمة" للبدء.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* إضافة سند قبض/عرض سعر */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <CardTitle className="flex items-center gap-2 text-[#01411C]">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            المستندات المالية
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={() => setShowFinancialForm(true)}
            className="w-full bg-gradient-to-r from-[#01411C] to-[#065f41] text-white"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة سند قبض / عرض سعر
          </Button>
        </CardContent>
      </Card>

      {/* 1️⃣1️⃣ جدولة الاجتماعات المحسنة */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Calendar className="w-5 h-5 text-[#D4AF37]" />
              📅 جدولة الاجتماعات ({enhancedMeetings.length})
            </CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={() => setShowEnhancedMeetingForm(true)}
              className="bg-[#01411C] hover:bg-[#065f41]"
            >
              <Plus className="w-4 h-4 ml-2" />
              جدولة اجتماع
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {enhancedMeetings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد اجتماعات مجدولة. انقر "جدولة اجتماع" للبدء.</p>
            </div>
          ) : (
            enhancedMeetings
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((meeting) => (
                <div key={meeting.id} className="p-4 rounded-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{meeting.title}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(meeting.date).toLocaleDateString('ar-SA')} - {meeting.time}
                        </div>
                        {meeting.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {meeting.location}
                          </div>
                        )}
                        {meeting.participants.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            {meeting.participants.length} مشارك
                          </div>
                        )}
                        {meeting.recurrence !== 'none' && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Repeat className="w-4 h-4" />
                            {meeting.recurrence === 'daily' && 'يومي'}
                            {meeting.recurrence === 'weekly' && 'أسبوعي'}
                            {meeting.recurrence === 'monthly' && 'شهري'}
                          </div>
                        )}
                        {meeting.notes && (
                          <p className="text-gray-600 bg-white p-2 rounded">{meeting.notes}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => {
                        setEnhancedMeetings(enhancedMeetings.filter(m => m.id !== meeting.id));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      {/* 1️⃣2️⃣ سجل النشاط التلقائي */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#01411C]">
              <Activity className="w-5 h-5 text-[#D4AF37]" />
              📊 سجل النشاط التلقائي
            </CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Download className="w-3 h-3 ml-1" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* فلاتر النشاط */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'call', 'message', 'edit', 'document', 'meeting', 'task', 'tag'] as const).map((filterType) => (
              <Button
                key={filterType}
                type="button"
                size="sm"
                variant={activityFilter === filterType ? 'default' : 'outline'}
                onClick={() => setActivityFilter(filterType)}
                className={`text-xs ${
                  activityFilter === filterType 
                    ? 'bg-[#01411C] text-white' 
                    : 'border-gray-300'
                }`}
              >
                {filterType === 'all' && '📋 الكل'}
                {filterType === 'call' && '📞 مكالمات'}
                {filterType === 'message' && '💬 رسائل'}
                {filterType === 'edit' && '✏️ تعديلات'}
                {filterType === 'document' && '📎 مستندات'}
                {filterType === 'meeting' && '📅 مواعيد'}
                {filterType === 'task' && '✅ مهام'}
                {filterType === 'tag' && '🏷️ تصنيفات'}
              </Button>
            ))}
          </div>

          {/* قائمة الأنشطة */}
          <div className="space-y-2">
            {activityLogs
              .filter(log => activityFilter === 'all' || log.type === activityFilter)
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 10) // آخر 10 أنشطة
              .map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    log.type === 'call' ? 'bg-green-100' :
                    log.type === 'message' ? 'bg-blue-100' :
                    log.type === 'edit' ? 'bg-yellow-100' :
                    log.type === 'document' ? 'bg-purple-100' :
                    log.type === 'meeting' ? 'bg-pink-100' :
                    log.type === 'task' ? 'bg-orange-100' :
                    'bg-gray-100'
                  }`}>
                    {log.type === 'call' && (
                      log.metadata?.callDirection === 'incoming' 
                        ? <PhoneIncoming className="w-5 h-5 text-green-600" />
                        : <PhoneOutgoing className="w-5 h-5 text-green-600" />
                    )}
                    {log.type === 'message' && <MessageCircle className="w-5 h-5 text-blue-600" />}
                    {log.type === 'edit' && <Edit2 className="w-5 h-5 text-yellow-600" />}
                    {log.type === 'document' && <File className="w-5 h-5 text-purple-600" />}
                    {log.type === 'meeting' && <Calendar className="w-5 h-5 text-pink-600" />}
                    {log.type === 'task' && <CheckCircle className="w-5 h-5 text-orange-600" />}
                    {log.type === 'tag' && <Tag className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{log.action}</p>
                    <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline ml-1" />
                        {new Date(log.timestamp).toLocaleString('ar-SA')}
                      </span>
                      {log.metadata?.duration && (
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(log.metadata.duration / 60)}:{(log.metadata.duration % 60).toString().padStart(2, '0')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {activityLogs.filter(log => activityFilter === 'all' || log.type === activityFilter).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>لا يوجد نشاط مسجل بعد.</p>
              </div>
            )}
          </div>

          {/* عداد الأنشطة */}
          {activityLogs.length > 10 && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                عرض 10 من أصل {activityLogs.filter(log => activityFilter === 'all' || log.type === activityFilter).length} نشاط
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نماذج منبثقة */}
      {showTaskForm && <TaskFormModal onClose={() => setShowTaskForm(false)} onSave={(task) => {
        setTasks([...tasks, task]);
        setShowTaskForm(false);
      }} />}

      {showFinancialForm && (
        <FinancialDocumentModal
          customerName={customer.name}
          customerPhone={customer.phone}
          userData={{
            name: 'محمد أحمد العتيبي',
            companyName: 'مؤسسة الأحلام العقارية',
            falLicense: '1234567890',
            phone: '0501234567',
            profileImage: 'https://ui-avatars.com/api/?name=محمد+العتيبي&background=01411C&color=D4AF37&size=192&bold=true&font-size=0.4',
            logoImage: 'https://ui-avatars.com/api/?name=مؤسسة+الأحلام&background=D4AF37&color=01411C&size=192&bold=true&font-size=0.35',
            coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop'
          }}
          onClose={() => setShowFinancialForm(false)}
        />
      )}

      {showMeetingForm && (
        <MeetingFormModal
          customerName={customer.name}
          customerPhone={customer.phone}
          onClose={() => setShowMeetingForm(false)}
        />
      )}

      {/* 🆕 نموذج جدولة الاجتماع المحسن */}
      {showEnhancedMeetingForm && (
        <EnhancedMeetingFormModal
          customerName={customer.name}
          customerPhone={customer.phone}
          onClose={() => setShowEnhancedMeetingForm(false)}
          onSave={(meeting) => {
            setEnhancedMeetings([...enhancedMeetings, meeting]);
            // إضافة إلى سجل النشاط
            const newActivity: ActivityLog = {
              id: Date.now().toString(),
              type: 'meeting',
              action: 'جدولة اجتماع جديد',
              details: `تم جدولة اجتماع: ${meeting.title}`,
              timestamp: new Date()
            };
            setActivityLogs([newActivity, ...activityLogs]);
            setShowEnhancedMeetingForm(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// 📢 PUBLISHED ADS SLIDE - سلايد الإعلانات المنشورة
// ============================================================

function PublishedAdsSlide({ customer, onUpdate }: { customer: Customer; onUpdate?: (customer: Customer) => void }) {
  const [publishedAds, setPublishedAds] = useState<PublishedAd[]>([]);
  const [selectedAdIndex, setSelectedAdIndex] = useState(0);

  // تحميل الإعلانات المنشورة للمالك باستخدام رقم الجوال
  useEffect(() => {
    console.log('🔍 PublishedAdsSlide: جاري تحميل الإعلانات للعميل:', customer.name, customer.phone);
    const ads = getAdsByOwnerPhone(customer.phone);
    console.log('📢 PublishedAdsSlide: تم العثور على', ads.length, 'إعلانات');
    setPublishedAds(ads);

    // الاستماع للتحديثات التلقائية
    const handleAdSaved = () => {
      const updatedAds = getAdsByOwnerPhone(customer.phone);
      setPublishedAds(updatedAds);
      console.log('🔄 تم تحديث الإعلانات تلقائياً:', updatedAds.length);
    };

    window.addEventListener('publishedAdSaved', handleAdSaved);
    return () => window.removeEventListener('publishedAdSaved', handleAdSaved);
  }, [customer.phone]);

  if (publishedAds.length === 0) {
    return (
      <div className="text-center py-12">
        <Megaphone className="w-24 h-24 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد إعلانات منشورة</h3>
        <p className="text-gray-500 mb-6">
          لم يتم نشر أي إعلانات لهذا العميل حتى الآن
        </p>
        <p className="text-sm text-gray-400">
          رقم الجوال: {customer.phone}
        </p>
      </div>
    );
  }

  const selectedAd = publishedAds[selectedAdIndex];

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DC143C] to-[#B22222] flex items-center justify-center">
          <Megaphone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#DC143C]">📢 إعلان منشور</h3>
          <p className="text-gray-600 text-sm">تفاصيل الإعلانات المنشورة</p>
        </div>
      </div>

      {/* 📋 قائمة اختيار الإعلانات */}
      <Card className="border-2 border-[#DC143C] shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
          <CardTitle className="flex items-center justify-between text-[#DC143C]">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              📋 اختر الإعلان
            </div>
            <Badge className="bg-[#DC143C] text-white">
              {publishedAds.length} {publishedAds.length === 1 ? 'إعلان' : 'إعلانات'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {publishedAds.length === 1 ? (
            // إذا كان هناك إعلان واحد فقط
            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <p className="text-center text-green-700 font-bold">
                ✅ إعلان واحد موجود - يتم عرضه تلقائياً
              </p>
            </div>
          ) : (
            // إذا كان هناك أكثر من إعلان - قائمة الاختيار
            <div className="grid md:grid-cols-2 gap-3">
              {publishedAds.map((ad, index) => (
                <Button
                  key={ad.id}
                  variant={index === selectedAdIndex ? "default" : "outline"}
                  onClick={() => setSelectedAdIndex(index)}
                  className={`h-auto py-4 px-4 text-right justify-start ${
                    index === selectedAdIndex 
                      ? "bg-[#DC143C] hover:bg-[#B22222] text-white border-[#DC143C]" 
                      : "hover:bg-red-50 hover:border-[#DC143C]"
                  }`}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2 w-full">
                      <Badge className={index === selectedAdIndex ? "bg-white text-[#DC143C]" : "bg-[#DC143C] text-white"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-bold truncate flex-1">
                        {ad.propertyType} - {ad.purpose}
                      </span>
                    </div>
                    <span className="text-xs opacity-80 truncate w-full">
                      رقم الإعلان: {ad.adNumber}
                    </span>
                    <span className="text-xs opacity-80">
                      📍 {ad.location.city} - {ad.location.district}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          {/* معلومات إضافية */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <span className="font-bold">ملاحظة:</span> يتم عرض الإعلانات بناءً على رقم الجوال: {customer.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* معلومات العقار الأساسية */}
      <Card className="border-2 border-[#D4AF37]">
        <CardHeader className="bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]">
          <CardTitle className="flex items-center gap-2 text-[#01411C]">
            <Home className="w-5 h-5 text-[#D4AF37]" />
            معلومات العقار الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">العنوان</label>
              <Input value={selectedAd.title} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">رقم الإعلان</label>
              <Input value={selectedAd.adNumber} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">نوع العقار</label>
              <Input value={selectedAd.propertyType} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">الغرض</label>
              <Input value={selectedAd.purpose} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">السعر</label>
              <Input value={selectedAd.price + " ريال"} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">المساحة</label>
              <Input value={selectedAd.area + " م²"} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">عدد الغرف</label>
              <Input value={`${selectedAd.bedrooms} غرفة نوم`} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block text-right">عدد الحمامات</label>
              <Input value={`${selectedAd.bathrooms} حمام`} readOnly className="border-2 border-gray-200 bg-gray-50" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700 block text-right">الحالة</label>
              <div className="mt-2">
                <Badge className={`${
                  selectedAd.status === 'draft' ? 'bg-yellow-500' :
                  selectedAd.status === 'published' ? 'bg-green-500' :
                  selectedAd.status === 'active' ? 'bg-blue-500' :
                  selectedAd.status === 'inactive' ? 'bg-gray-500' :
                  selectedAd.status === 'sold' ? 'bg-purple-500' :
                  selectedAd.status === 'rented' ? 'bg-orange-500' :
                  'bg-red-500'
                } text-white`}>
                  {selectedAd.status === 'draft' ? '📝 مسودة' :
                   selectedAd.status === 'published' ? '✅ منشور' :
                   selectedAd.status === 'active' ? '🟢 نشط' :
                   selectedAd.status === 'inactive' ? '⚫ غير نشط' :
                   selectedAd.status === 'sold' ? '💰 مباع' :
                   selectedAd.status === 'rented' ? '🔑 مؤجر' : '📦 مؤرشف'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات المالك */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <User className="w-5 h-5" />
            معلومات المالك
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-blue-700">اسم المالك</label>
            <Input value={selectedAd.ownerName} readOnly className="border-2 border-blue-200 bg-white" />
          </div>
          <div>
            <label className="text-sm font-bold text-blue-700">رقم الجوال</label>
            <Input value={selectedAd.ownerPhone} readOnly className="border-2 border-blue-200 bg-white" dir="ltr" />
          </div>
          {selectedAd.idNumber && (
            <div>
              <label className="text-sm font-bold text-blue-700">رقم بطاقة الأحوال</label>
              <Input value={selectedAd.idNumber} readOnly className="border-2 border-blue-200 bg-white" />
            </div>
          )}
          {selectedAd.idIssueDate && (
            <div>
              <label className="text-sm font-bold text-blue-700">تاريخ إصدار البطاقة</label>
              <Input value={selectedAd.idIssueDate} readOnly className="border-2 border-blue-200 bg-white" />
            </div>
          )}
          {selectedAd.idExpiryDate && (
            <div>
              <label className="text-sm font-bold text-blue-700">تاريخ انتهاء البطاقة</label>
              <Input value={selectedAd.idExpiryDate} readOnly className="border-2 border-blue-200 bg-white" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات الصك */}
      {(selectedAd.deedNumber || selectedAd.deedDate || selectedAd.deedIssuer) && (
        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <FileText className="w-5 h-5" />
              معلومات الصك
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {selectedAd.deedNumber && (
              <div>
                <label className="text-sm font-bold text-purple-700">رقم الصك</label>
                <Input value={selectedAd.deedNumber} readOnly className="border-2 border-purple-200 bg-white" />
              </div>
            )}
            {selectedAd.deedDate && (
              <div>
                <label className="text-sm font-bold text-purple-700">تاريخ الصك</label>
                <Input value={selectedAd.deedDate} readOnly className="border-2 border-purple-200 bg-white" />
              </div>
            )}
            {selectedAd.deedIssuer && (
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-purple-700">جهة إصدار الصك</label>
                <Input value={selectedAd.deedIssuer} readOnly className="border-2 border-purple-200 bg-white" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* الموقع الجغرافي */}
      <Card className="border-2 border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <MapPin className="w-5 h-5" />
            الموقع الجغرافي
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-green-700">المدينة</label>
            <Input value={selectedAd.location.city} readOnly className="border-2 border-green-200 bg-white" />
          </div>
          <div>
            <label className="text-sm font-bold text-green-700">الحي</label>
            <Input value={selectedAd.location.district} readOnly className="border-2 border-green-200 bg-white" />
          </div>
          {selectedAd.location.street && (
            <div>
              <label className="text-sm font-bold text-green-700">الشارع</label>
              <Input value={selectedAd.location.street} readOnly className="border-2 border-green-200 bg-white" />
            </div>
          )}
          {selectedAd.location.postalCode && (
            <div>
              <label className="text-sm font-bold text-green-700">الرمز البريدي</label>
              <Input value={selectedAd.location.postalCode} readOnly className="border-2 border-green-200 bg-white" />
            </div>
          )}
          {selectedAd.location.buildingNumber && (
            <div>
              <label className="text-sm font-bold text-green-700">رقم المبنى</label>
              <Input value={selectedAd.location.buildingNumber} readOnly className="border-2 border-green-200 bg-white" />
            </div>
          )}
          {selectedAd.location.additionalNumber && (
            <div>
              <label className="text-sm font-bold text-green-700">الرقم الإضافي</label>
              <Input value={selectedAd.location.additionalNumber} readOnly className="border-2 border-green-200 bg-white" />
            </div>
          )}
          {selectedAd.location.nationalAddress && (
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-green-700">العنوان الوطني</label>
              <Input value={selectedAd.location.nationalAddress} readOnly className="border-2 border-green-200 bg-white" />
            </div>
          )}
          {selectedAd.location.latitude !== 0 && selectedAd.location.longitude !== 0 && (
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-green-700">الإحداثيات</label>
              <Input 
                value={`${selectedAd.location.latitude.toFixed(6)}, ${selectedAd.location.longitude.toFixed(6)}`} 
                readOnly 
                className="border-2 border-green-200 bg-white" 
                dir="ltr"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* الملاحظات (الوصف) */}
      {selectedAd.description && (
        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <FileText className="w-5 h-5" />
              الملاحظات (الوصف)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={selectedAd.description} 
              readOnly 
              className="border-2 border-orange-200 bg-white min-h-[120px]" 
            />
          </CardContent>
        </Card>
      )}

      {/* الوصف من AI */}
      {selectedAd.aiGeneratedDescription && (
        <Card className="border-2 border-indigo-300 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Star className="w-5 h-5" />
              الوصف المولّد بالذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={selectedAd.aiGeneratedDescription} 
              readOnly 
              className="border-2 border-indigo-200 bg-white min-h-[120px]" 
            />
            <div className="flex gap-2 mt-3">
              {selectedAd.aiLanguage && (
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
                  اللغة: {selectedAd.aiLanguage}
                </Badge>
              )}
              {selectedAd.aiTone && (
                <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
                  الأسلوب: {selectedAd.aiTone}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* رفع الوسائط المتعددة */}
      {selectedAd.mediaFiles && selectedAd.mediaFiles.length > 0 && (
        <Card className="border-2 border-pink-300 bg-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-900">
              <ImageIcon className="w-5 h-5" />
              الوسائط المتعددة ({selectedAd.mediaFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedAd.mediaFiles.map((media) => (
                <div key={media.id} className="relative rounded-lg overflow-hidden border-2 border-pink-200 aspect-square bg-white">
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt={media.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Video className="w-12 h-12 text-pink-500" />
                      <span className="text-xs text-pink-700 text-center px-2">{media.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* المنصات المنشور عليها */}
      {selectedAd.publishedPlatforms && selectedAd.publishedPlatforms.length > 0 && (
        <Card className="border-2 border-teal-300 bg-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-900">
              <Globe className="w-5 h-5" />
              المنصات المنشور عليها ({selectedAd.publishedPlatforms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedAd.publishedPlatforms.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-teal-200">
                  <div className="flex items-center gap-3">
                    <Badge className={`${
                      platform.status === 'published' ? 'bg-green-500' :
                      platform.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {platform.status === 'published' ? '✅ منشور' :
                       platform.status === 'pending' ? '⏳ قيد المراجعة' : '❌ فشل'}
                    </Badge>
                    <span className="font-bold text-teal-900">{platform.name}</span>
                    <span className="text-sm text-teal-600">
                      {platform.publishedAt.toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {platform.adUrl && (
                    <a 
                      href={platform.adUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      فتح
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* معلومات إضافية */}
      <Card className="border-2 border-gray-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Activity className="w-5 h-5" />
            معلومات إضافية
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {selectedAd.whatsappNumber && (
              <div>
                <label className="text-sm font-bold text-gray-700">رقم الواتساب</label>
                <Input value={selectedAd.whatsappNumber} readOnly className="border-2 border-gray-200 bg-gray-50" dir="ltr" />
              </div>
            )}
            {selectedAd.virtualTourLink && (
              <div>
                <label className="text-sm font-bold text-gray-700">رابط الجولة الافتراضية</label>
                <div className="flex gap-2">
                  <Input value={selectedAd.virtualTourLink} readOnly className="border-2 border-gray-200 bg-gray-50 flex-1" dir="ltr" />
                  <a 
                    href={selectedAd.virtualTourLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح
                  </a>
                </div>
              </div>
            )}
            {selectedAd.advertisingLicense && (
              <div>
                <label className="text-sm font-bold text-gray-700">رقم الترخيص الإعلاني</label>
                <Input value={selectedAd.advertisingLicense} readOnly className="border-2 border-gray-200 bg-gray-50" />
              </div>
            )}
            {selectedAd.advertisingLicenseStatus && (
              <div>
                <label className="text-sm font-bold text-gray-700">حالة الترخيص</label>
                <div className="mt-2">
                  <Badge className={`${
                    selectedAd.advertisingLicenseStatus === 'valid' ? 'bg-green-500' :
                    selectedAd.advertisingLicenseStatus === 'invalid' ? 'bg-red-500' :
                    selectedAd.advertisingLicenseStatus === 'checking' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  } text-white`}>
                    {selectedAd.advertisingLicenseStatus === 'valid' ? '✅ صالح' :
                     selectedAd.advertisingLicenseStatus === 'invalid' ? '❌ غير صالح' :
                     selectedAd.advertisingLicenseStatus === 'checking' ? '⏳ قيد التحقق' : '❓ غير معروف'}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* التواريخ */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-bold text-gray-700">تاريخ الإنشاء</label>
              <Input 
                value={selectedAd.createdAt.toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} 
                readOnly 
                className="border-2 border-gray-200 bg-gray-50 text-sm" 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">تاريخ النشر</label>
              <Input 
                value={selectedAd.publishedAt.toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} 
                readOnly 
                className="border-2 border-gray-200 bg-gray-50 text-sm" 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">آخر تحديث</label>
              <Input 
                value={selectedAd.updatedAt.toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} 
                readOnly 
                className="border-2 border-gray-200 bg-gray-50 text-sm" 
              />
            </div>
          </div>

          {/* الإحصائيات */}
          {selectedAd.stats && (
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-900">{selectedAd.stats.views || 0}</p>
                <p className="text-xs text-blue-600">مشاهدة</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Phone className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-900">{selectedAd.stats.requests || 0}</p>
                <p className="text-xs text-green-600">طلب</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <Star className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-900">{selectedAd.stats.likes || 0}</p>
                <p className="text-xs text-red-600">إعجاب</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Share2 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-900">{selectedAd.stats.shares || 0}</p>
                <p className="text-xs text-purple-600">مشاركة</p>
              </div>
            </div>
          )}

          {/* الملاحظات الإضافية */}
          {selectedAd.notes && (
            <div className="pt-4 border-t">
              <label className="text-sm font-bold text-gray-700 mb-2 block">ملاحظات إضافية</label>
              <Textarea 
                value={selectedAd.notes} 
                readOnly 
                className="border-2 border-gray-200 bg-gray-50 min-h-[80px]" 
              />
            </div>
          )}

          {/* المميزات المخصصة */}
          {selectedAd.customFeatures && selectedAd.customFeatures.length > 0 && (
            <div className="pt-4 border-t">
              <label className="text-sm font-bold text-gray-700 mb-2 block">المميزات المخصصة</label>
              <div className="flex gap-2 flex-wrap">
                {selectedAd.customFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* الهاشتاقات */}
          {selectedAd.hashtags && selectedAd.hashtags.length > 0 && (
            <div className="pt-4 border-t">
              <label className="text-sm font-bold text-gray-700 mb-2 block">الهاشتاقات</label>
              <div className="flex gap-2 flex-wrap">
                {selectedAd.hashtags.map((tag, index) => (
                  <Badge key={index} className="bg-blue-500 text-white">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* مسار المنصة */}
          {selectedAd.platformPath && (
            <div className="pt-4 border-t">
              <label className="text-sm font-bold text-gray-700">مسار المنصة</label>
              <Input value={selectedAd.platformPath} readOnly className="border-2 border-gray-200 bg-gray-50 mt-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* زر التوجه للإعلان في منصتي */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => {
            // التنقل إلى لوحة التحكم → العروض
            const event = new CustomEvent('navigateToOffer', { 
              detail: { offerId: selectedAd.id, adNumber: selectedAd.adNumber }
            });
            window.dispatchEvent(event);
          }}
          className="flex-1 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:shadow-lg"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          التوجه للإعلان في منصتي
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// 📋 AD DETAILS MODAL - نافذة تفاصيل الإعلان
// ============================================================

function AdDetailsModal({ 
  ad, 
  customerName,
  onClose 
}: { 
  ad: PublishedAd; 
  customerName: string;
  onClose: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* الهيدر */}
        <div className="sticky top-0 bg-gradient-to-r from-[#DC143C] to-[#B22222] p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">تفاصيل الإعلان</h2>
                <p className="text-white/80 text-sm">المالك: {customerName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* المحتوى */}
        <div className="p-6 space-y-6">
          {/* البيانات الأساسية */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="text-[#DC143C]">📋 البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">نوع الإعلان</label>
                  <p className="font-bold text-gray-800">
                    {ad.purpose || 'غير محدد'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">نوع العقار</label>
                  <p className="font-bold text-gray-800">
                    {ad.propertyType || 'غير محدد'}
                  </p>
                </div>
              </div>

              {ad.title && (
                <div>
                  <label className="text-sm text-gray-500">العنوان</label>
                  <p className="font-bold text-gray-800">{ad.title}</p>
                </div>
              )}

              {ad.description && (
                <div>
                  <label className="text-sm text-gray-500">الوصف</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
                </div>
              )}

              {ad.price && (
                <div>
                  <label className="text-sm text-gray-500">السعر</label>
                  <p className="font-bold text-gray-800 text-xl">
                    {typeof ad.price === 'string' ? ad.price : ad.price.toLocaleString('ar-SA')} ريال
                  </p>
                </div>
              )}

              {ad.location && (
                <div>
                  <label className="text-sm text-gray-500">الموقع</label>
                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#DC143C]" />
                    {typeof ad.location === 'string' ? ad.location : `${ad.location.city}${ad.location.district ? ' - ' + ad.location.district : ''}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* معلومات العقار */}
          {(ad.area || ad.bedrooms || ad.bathrooms) && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-blue-700">🏠 معلومات العقار</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  {ad.area && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{ad.area}</p>
                      <p className="text-sm text-gray-500">م²</p>
                    </div>
                  )}
                  {ad.bedrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{ad.bedrooms}</p>
                      <p className="text-sm text-gray-500">غرف نوم</p>
                    </div>
                  )}
                  {ad.bathrooms && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-800">{ad.bathrooms}</p>
                      <p className="text-sm text-gray-500">حمامات</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* معلومات المالك */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-green-700">👤 معلومات المالك</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="font-bold">{ad.ownerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span dir="ltr">{ad.ownerPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* حالة الإعلان */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-purple-700">📊 حالة الإعلان</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <label className="text-sm text-gray-500">الحالة الحالية</label>
                <div className="mt-1">
                  <Badge 
                    className={`text-sm ${
                      ad.status === 'draft' ? 'bg-yellow-500 text-white' :
                      ad.status === 'published' ? 'bg-green-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}
                  >
                    {ad.status === 'draft' ? '📝 مسودة' :
                     ad.status === 'published' ? '✅ منشور' : '🔒 محذوف'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">تاريخ الإنشاء</label>
                <p className="text-gray-700">
                  {new Date(ad.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              إغلاق
            </Button>
            <Button
              className="flex-1 bg-[#DC143C] hover:bg-[#B22222] text-white"
              onClick={() => {
                // TODO: فتح صفحة تعديل الإعلان
                alert('سيتم فتح صفحة تعديل الإعلان قريباً');
              }}
            >
              <Edit2 className="w-4 h-4 ml-2" />
              تعديل الإعلان
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 📝 TASK FORM MODAL
// ============================================================

function TaskFormModal({ onClose, onSave }: { onClose: () => void; onSave: (task: Task) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateOption, setDateOption] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('normal');
  const [showPrioritySelect, setShowPrioritySelect] = useState(false);

  const calculateDueDate = () => {
    if (dateOption === 'today') {
      return new Date();
    } else if (dateOption === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    } else {
      return new Date(`${customDate}T${customTime}`);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('يرجى إدخال عنوان المهمة');
      return;
    }

    if (dateOption === 'custom' && (!customDate || !customTime)) {
      alert('يرجى تحديد التاريخ والوقت');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      dueDate: calculateDueDate(),
      priority,
      completed: false,
      favorite: false
    };

    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto touch-scroll-enabled"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">إضافة مهمة جديدة</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
          {/* عنوان المهمة */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المهمة *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: متابعة مع العميل"
              className="border-2 border-gray-200"
            />
          </div>

          {/* وصف المهمة */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">وصف المهمة</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="تفاصيل المهمة..."
              rows={3}
              className="border-2 border-gray-200"
            />
          </div>

          {/* موعد المهمة */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">موعد المهمة *</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => setDateOption('today')}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  dateOption === 'today'
                    ? 'border-[#D4AF37] bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]'
                    : 'border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                اليوم
              </button>
              <button
                onClick={() => setDateOption('tomorrow')}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  dateOption === 'tomorrow'
                    ? 'border-[#D4AF37] bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]'
                    : 'border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                غداً
              </button>
              <button
                onClick={() => setDateOption('custom')}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  dateOption === 'custom'
                    ? 'border-[#D4AF37] bg-gradient-to-r from-[#fffef7] to-[#f0fdf4]'
                    : 'border-gray-200 hover:border-[#D4AF37]'
                }`}
              >
                مخصص
              </button>
            </div>

            {dateOption === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="border-2 border-gray-200"
                />
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          {/* الأولوية */}
          {showPrioritySelect && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">الأولوية</label>
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setPriority(key as Task['priority']);
                    setShowPrioritySelect(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-lg border-2 transition-all ${
                    priority === key
                      ? config.color
                      : 'border-gray-200 hover:border-[#D4AF37]'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          )}

          {!showPrioritySelect && (
            <Button
              onClick={() => setShowPrioritySelect(true)}
              variant="outline"
              className="w-full border-2 border-[#D4AF37]"
            >
              تحديد الأولوية: {PRIORITY_CONFIG[priority].label}
            </Button>
          )}
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-[#01411C] text-white">
              <CheckCircle className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 💰 FINANCIAL DOCUMENT MODAL
// ============================================================

interface UserData {
  name: string;
  companyName: string;
  falLicense: string;
  phone: string;
  profileImage?: string;
  logoImage?: string;
  coverImage?: string;
}

function FinancialDocumentModal({
  customerName,
  customerPhone,
  userData,
  onClose
}: {
  customerName: string;
  customerPhone: string;
  userData: UserData;
  onClose: () => void;
}) {
  const [docType, setDocType] = useState<'receipt' | 'quotation' | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', description: '', amount: 0 }]);
  const [vat, setVat] = useState(15);
  const [showPreview, setShowPreview] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = (subtotal * vat) / 100;
  const total = subtotal + vatAmount;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSaveDocument = () => {
    const document = {
      id: Date.now().toString(),
      type: docType,
      customerName,
      customerPhone,
      items,
      subtotal,
      vat,
      vatAmount,
      total,
      createdAt: new Date().toISOString(),
      brokerName: userData?.name || '',
      brokerPhone: userData?.phone || '',
      brokerLicense: userData?.falLicense || '',
      brokerCompanyName: userData?.companyName || '',
      brokerProfileImage: userData?.profileImage || '',
      brokerLogoImage: userData?.logoImage || '',
      brokerCoverImage: userData?.coverImage || ''
    };

    const storageKey = docType === 'quotation' ? 'quotations' : 'receipts';
    const existingDocs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingDocs.push(document);
    localStorage.setItem(storageKey, JSON.stringify(existingDocs));

    window.dispatchEvent(new CustomEvent('financial-documents-updated', {
      detail: { type: docType, document }
    }));
  };

  if (!docType) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">اختر نوع المستند</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDocType('quotation')}
              className="p-6 border-2 border-[#D4AF37] rounded-lg hover:bg-gradient-to-r hover:from-[#fffef7] hover:to-[#f0fdf4] transition-all"
            >
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="font-bold">عرض سعر</p>
            </button>
            <button
              onClick={() => setDocType('receipt')}
              className="p-6 border-2 border-[#D4AF37] rounded-lg hover:bg-gradient-to-r hover:from-[#fffef7] hover:to-[#f0fdf4] transition-all"
            >
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="font-bold">سند قبض</p>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <InvoicePreview
        docType={docType}
        customerName={customerName}
        customerPhone={customerPhone}
        userData={userData}
        items={items}
        vat={vat}
        subtotal={subtotal}
        total={total}
        onBack={() => setShowPreview(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto touch-scroll-enabled"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {docType === 'quotation' ? 'عرض سعر' : 'سند قبض'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* البنود */}
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="الوصف"
                  className="mb-2"
                />
              </div>
              <div className="w-32">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={item.amount === 0 ? '' : item.amount.toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    updateItem(item.id, 'amount', value === '' ? 0 : parseFloat(value) || 0);
                  }}
                  placeholder="0.00"
                  className="text-left"
                  dir="ltr"
                />
              </div>
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button onClick={addItem} variant="outline" className="w-full">
            <Plus className="w-4 h-4 ml-2" />
            إضافة بند
          </Button>

          {/* الضريبة */}
          <div className="flex items-center gap-2">
            <label className="font-bold">الضريبة (%):</label>
            <Input
              type="text"
              inputMode="decimal"
              value={vat === 0 ? '' : vat.toString()}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.]/g, '');
                setVat(value === '' ? 0 : parseFloat(value) || 0);
              }}
              placeholder="15"
              className="w-24 text-left"
              dir="ltr"
            />
          </div>

          {/* الملخص */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-bold">{subtotal.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between">
              <span>ضريبة القيمة المضافة ({vat}%):</span>
              <span className="font-bold">{vatAmount.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between text-lg border-t pt-2">
              <span className="font-bold">المجموع الإجمالي:</span>
              <span className="font-bold text-[#01411C]">{total.toFixed(2)} ريال</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            إلغاء
          </Button>
          <Button
            onClick={() => setShowPreview(true)}
            className="flex-1 bg-[#01411C] text-white"
          >
            معاينة
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 📄 INVOICE PREVIEW
// ============================================================

function InvoicePreview({
  docType,
  customerName,
  customerPhone,
  userData,
  items,
  vat,
  subtotal,
  total,
  onBack,
  onClose
}: any) {
  const [showSendMenu, setShowSendMenu] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  const handleSwapImages = () => {
    setIsSwapped(!isSwapped);
  };

  // الصور الافتراضية إذا لم تكن موجودة
  const defaultProfileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'وسيط')}&background=01411C&color=D4AF37&size=192&bold=true&font-size=0.4`;
  const defaultLogoImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.companyName || 'شركة')}&background=D4AF37&color=01411C&size=192&bold=true&font-size=0.35`;
  
  const profileImage = userData?.profileImage || defaultProfileImage;
  const logoImage = userData?.logoImage || defaultLogoImage;
  const coverImage = userData?.coverImage;

  // تسجيل البيانات للتحقق
  console.log('🖼️ بيانات الصور في المعاينة:', {
    userData,
    profileImage,
    logoImage,
    coverImage
  });

  const handleSendOption = (method: string) => {
    setShowSendMenu(false);
    alert(`سيتم الإرسال عبر ${method}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto touch-scroll-enabled"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
        dir="rtl"
      >
        {/* هيدر بطاقة الأعمال - مطابق تماماً */}
        <div 
          className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 rounded-t-2xl relative bg-cover bg-center"
          style={coverImage ? { 
            backgroundImage: `url(${coverImage})`, 
            backgroundBlendMode: 'overlay', 
            backgroundColor: 'rgba(1, 65, 28, 0.85)' 
          } : {}}
        >
          <div className="text-center space-y-2">
            {/* صورة البروفايل */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* الصورة الرئيسية - تتبدل - مكبرة 50% */}
                <img 
                  src={!isSwapped ? profileImage : logoImage} 
                  alt={!isSwapped ? "Profile" : "Logo"} 
                  className="w-48 h-48 rounded-full border-4 border-[#D4AF37] shadow-lg object-cover cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={handleSwapImages}
                  onError={(e) => {
                    console.error('فشل تحميل الصورة:', !isSwapped ? 'Profile' : 'Logo');
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjMDE0MTFDIHN0eWxlPSIiLz4KPHBhdGggZD0iTTk2IDk2YzE3LjY3MyAwIDMyLTE0LjMyNyAzMi0zMlM4NC44NDYgMzIgOTYgMzJzMzIgMTQuMzI3IDMyIDMyIiBmaWxsPSIjRDRBRjM3Ii8+Cjwvc3ZnPg==';
                  }}
                />
                {/* الشعار الصغير - يتبدل */}
                <div 
                  className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                  onClick={handleSwapImages}
                >
                  <img 
                    src={isSwapped ? profileImage : logoImage} 
                    alt={isSwapped ? "Profile" : "Logo"} 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      console.error('فشل تحميل الشعار الصغير:', isSwapped ? 'Profile' : 'Logo');
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRDRBRjM3Ii8+CjxwYXRoIGQ9Ik0zMiAzMmM1Ljg5MSAwIDEwLjY2Ny00Ljc3NiAxMC42NjctMTAuNjY3UzM3Ljg5MSAxMC42NjcgMzIgMTAuNjY3IDIxLjMzMyAxNS40NDMgMjEuMzMzIDIxLjMzMyAyNi4xMDkgMzIgMzIgMzJ6IiBmaWxsPSIjMDE0MTFDIHN0eWxlPSIiLz4KPC9zdmc+';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* الاسم */}
            <h1 className="text-xl font-bold">{userData?.name || 'اسم الوسيط'}</h1>
            
            {/* اسم الشركة */}
            <p className="text-base">{userData?.companyName || 'اسم الشركة'}</p>
            
            {/* التقييم */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
              <span className="mr-2 text-sm">5.0</span>
            </div>

            {/* رخصة FAL */}
            <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>رخصة FAL: {userData?.falLicense || '123456789'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs mt-1">
                <Phone className="w-3 h-3" />
                <span>الجوال: {userData?.phone || '0501234567'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* محتوى المستند */}
        <div className="p-8">
          {/* عنوان المستن�� */}
          <h3 className="text-2xl font-bold text-center mb-6 text-[#01411C]">
            {docType === 'quotation' ? 'عرض سعر' : 'سند قبض'}
          </h3>

          {/* معلومات العميل */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-right" dir="rtl">
            <p className="font-bold text-right">العميل: {customerName}</p>
            <p className="text-right">الجوال: {customerPhone}</p>
          </div>

          {/* البنود */}
          <table className="w-full mb-6" dir="rtl">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-right">الوصف</th>
                <th className="p-2 text-right">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: InvoiceItem) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 text-right">{item.description}</td>
                  <td className="p-2 text-right">{item.amount.toFixed(2)} ريال</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* المجاميع */}
          <div className="space-y-2 mb-6 text-right" dir="rtl">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>{subtotal.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between">
              <span>ضريبة القيمة المضافة ({vat}%):</span>
              <span>{((subtotal * vat) / 100).toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>المجموع الإجمالي:</span>
              <span>{total.toFixed(2)} ريال</span>
            </div>
          </div>

          {/* التوقيع */}
          <div className="border-t pt-6 mt-6 text-right" dir="rtl">
            <p className="mb-12">مكان التوقيع: __________________</p>
            <div className="text-center">
              <p className="font-bold">{userData?.name || 'اسم الوسيط'}</p>
              <p>رخصة فال: {userData?.falLicense || '123456789'}</p>
              <p>الجوال: {userData?.phone || '0501234567'}</p>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowRight className="w-4 h-4 ml-2" />
              تعديل
            </Button>
            <Button 
              onClick={handleSaveDocument}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Download className="w-4 h-4 ml-2" />
              تحميل PDF
            </Button>
            <div className="flex-1 relative">
              <Button 
                onClick={() => setShowSendMenu(!showSendMenu)}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال
              </Button>

              {/* القائمة المنبثقة للإرسال */}
              <AnimatePresence>
                {showSendMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border-2 border-[#D4AF37] overflow-hidden z-10"
                  >
                    <button
                      onClick={() => handleSendOption('رسائل نصية')}
                      className="w-full px-4 py-3 text-right hover:bg-green-50 transition-colors flex items-center gap-2 border-b"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                      <span>رسائل نصية</span>
                    </button>
                    <button
                      onClick={() => handleSendOption('واتساب')}
                      className="w-full px-4 py-3 text-right hover:bg-green-50 transition-colors flex items-center gap-2 border-b"
                    >
                      <Send className="w-4 h-4 text-green-600" />
                      <span>واتساب</span>
                    </button>
                    <button
                      onClick={() => handleSendOption('إيميل')}
                      className="w-full px-4 py-3 text-right hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-green-600" />
                      <span>إيميل</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 📅 MEETING FORM MODAL
// ============================================================

function MeetingFormModal({
  customerName,
  customerPhone,
  onClose
}: {
  customerName: string;
  customerPhone: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title || !date || !time) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    alert('تم حفظ الموعد بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto touch-scroll-enabled"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">إنشاء موعد اجتماع</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
          {/* معلومات العميل */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-bold">{customerName}</p>
            <p className="text-sm text-gray-600">{customerPhone}</p>
          </div>

          {/* عنوان الموعد */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الموعد *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: اجتماع لمعاينة العقار"
              className="border-2 border-gray-200"
            />
          </div>

          {/* التاريخ والوقت */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">التاريخ *</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-2 border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الوقت *</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-2 border-gray-200"
              />
            </div>
          </div>

          {/* المكان */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المكان</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مكان الاجتماع"
              className="border-2 border-gray-200"
            />
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات إضافية..."
              rows={3}
              className="border-2 border-gray-200"
            />
            </div>
          </div>

          {/* ا��أزرار */}
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-[#01411C] text-white">
              <Calendar className="w-4 h-4 ml-2" />
              حفظ الموعد
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 🆕 نموذج جدولة الاجتماع المحسن
// ============================================================

function EnhancedMeetingFormModal({ 
  customerName, 
  customerPhone, 
  onClose, 
  onSave 
}: { 
  customerName: string; 
  customerPhone: string; 
  onClose: () => void; 
  onSave: (meeting: EnhancedMeeting) => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [recurrence, setRecurrence] = useState<EnhancedMeeting['recurrence']>('none');
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [location, setLocation] = useState('');
  const [reminders, setReminders] = useState<number[]>([30]); // 30 دقيقة افتراضياً
  const [shareLink, setShareLink] = useState('');

  // إنشاء رابط المشاركة
  const generateShareLink = () => {
    const meetingData = {
      title,
      date,
      time,
      location,
      notes: 'حدد اليوم والوقت المناسب لك عبر الرابط'
    };
    const link = `https://calendly.com/meeting?data=${encodeURIComponent(JSON.stringify(meetingData))}`;
    setShareLink(link);
    return link;
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const handleToggleReminder = (minutes: number) => {
    if (reminders.includes(minutes)) {
      setReminders(reminders.filter(r => r !== minutes));
    } else {
      setReminders([...reminders, minutes].sort((a, b) => b - a));
    }
  };

  const handleShare = async (method: 'whatsapp' | 'sms' | 'link' | 'other') => {
    const link = generateShareLink();
    const message = `حدد اليوم والوقت المناسب لك عبر الرابط: ${link}`;

    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'sms':
        window.location.href = `sms:${customerPhone}?body=${encodeURIComponent(message)}`;
        break;
      case 'link':
        navigator.clipboard.writeText(link);
        alert('تم نسخ الرابط إلى الحافظة');
        break;
      case 'other':
        if (navigator.share) {
          navigator.share({ title: 'جدولة اجتماع', text: message });
        } else {
          alert('المشاركة غير مدعومة في هذا المتصفح');
        }
        break;
    }
  };

  const handleSave = () => {
    if (!title.trim() || !date || !time) {
      alert('يرجى إدخال جميع الحقول المطلوبة');
      return;
    }

    const newMeeting: EnhancedMeeting = {
      id: Date.now().toString(),
      title,
      date: new Date(date),
      time,
      notes,
      recurrence,
      participants,
      location,
      reminders,
      createdAt: new Date()
    };

    onSave(newMeeting);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto touch-scroll-enabled"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="p-6">
          {/* العنوان */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#D4AF37]" />
              جدولة اجتماع مع {customerName}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* عنوان الاجتماع */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📝 عنوان الاجتماع *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="اجتماع مع العميل..."
                className="border-2 border-gray-200"
              />
            </div>

            {/* التاريخ والوقت */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">📅 التاريخ *</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">⏰ الوقت *</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-2 border-gray-200"
                />
              </div>
            </div>

            {/* الموقع */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📍 موقع الاجتماع</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="المكتب، عبر الإنترنت، أو موقع مخصص..."
                className="border-2 border-gray-200"
              />
            </div>

            {/* التكرار */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🔄 التكرار</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as EnhancedMeeting['recurrence'])}
                className="w-full p-2 border-2 border-gray-200 rounded-md"
              >
                <option value="none">لا يتكرر</option>
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>

            {/* المشاركون */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">👥 المشاركون</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    placeholder="اسم أو بريد المشارك..."
                    className="flex-1 border-2 border-gray-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                  />
                  <Button type="button" onClick={handleAddParticipant} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {participant}
                      <button onClick={() => handleRemoveParticipant(participant)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* الإشعارات */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">🔔 إشعارات مسبقة</label>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 60, 120].map((minutes) => (
                  <Button
                    key={minutes}
                    type="button"
                    variant={reminders.includes(minutes) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleReminder(minutes)}
                    className={reminders.includes(minutes) ? 'bg-[#01411C]' : ''}
                  >
                    {minutes < 60 ? `${minutes} دقيقة` : `${minutes / 60} ساعة`}
                  </Button>
                ))}
              </div>
            </div>

            {/* الملاحظات */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📝 ملاحظات</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ملاحظات إضافية عن الاجتماع..."
                rows={3}
                className="border-2 border-gray-200"
              />
            </div>

            {/* خيارات المشاركة */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">📤 مشاركة الموعد</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleShare('link')}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  نسخ الرابط
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  واتساب
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleShare('sms')}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  رسالة نصية
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleShare('other')}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  اختر تطبيق
                </Button>
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-[#01411C] text-white hover:bg-[#065f41]">
              <Calendar className="w-4 h-4 ml-2" />
              حفظ الاجتماع
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 💰 FINANCING SLIDE - Placeholder
// ============================================================

function FinancingSlide() {
  return (
    <div className="text-center py-12">
      <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">طلب حسبة التمويل</h3>
      <p className="text-gray-600">قيد التطوير...</p>
    </div>
  );
}

// ============================================================
// 🏠 PROPERTY OFFER SLIDE - Placeholder
// ============================================================

function PropertyOfferSlide() {
  return (
    <div className="text-center py-12">
      <Home className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">عرض العقار</h3>
      <p className="text-gray-600">قيد التطوير...</p>
    </div>
  );
}

// ============================================================
// 📈 PROPERTY REQUEST SLIDE - Placeholder
// ============================================================

function PropertyRequestSlide() {
  return (
    <div className="text-center py-12">
      <TrendingUp className="w-16 h-16 text-purple-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">طلب العقار</h3>
      <p className="text-gray-600">قيد التطوير...</p>
    </div>
  );
}

// ============================================================
// 📄 ADDITIONAL INFO SLIDE - Placeholder
// ============================================================

function AdditionalInfoSlide() {
  return (
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">معلومات إضافية</h3>
      <p className="text-gray-600">قيد التطوير...</p>
    </div>
  );
}

// ============================================================
// ➕ ADD SLIDE MODAL - مودال إضافة سلايد جديد
// ============================================================

function AddSlideModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (slide: CustomSlide) => void;
}) {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('User');
  const [selectedColor, setSelectedColor] = useState('#D4AF37');
  
  // 🆕 جميع الحقول من GeneralInfoSlide (نسخة كاملة)
  // المعلومات الأساسية
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  
  // معلومات الاتصال
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [alternativePhones, setAlternativePhones] = useState<{ id: string; number: string; type: 'home' | 'work' | 'mobile'; }[]>([]);
  const [companyEmail, setCompanyEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [additionalWebsites, setAdditionalWebsites] = useState<string[]>([]);
  
  // التصنيف والاهتمام
  const [customerType, setCustomerType] = useState<CustomerType>('buyer');
  const [interestLevel, setInterestLevel] = useState<InterestLevel>('interested');
  const [tags, setTags] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState('');
  
  // الموقع
  const [notes, setNotes] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const icons = [
    { name: 'User', component: User, label: 'مستخدم' },
    { name: 'Phone', component: Phone, label: 'هاتف' },
    { name: 'Mail', component: Mail, label: 'بريد' },
    { name: 'Building2', component: Building2, label: 'مبنى' },
    { name: 'Home', component: Home, label: 'منزل' },
    { name: 'Star', component: Star, label: 'نجمة' },
    { name: 'Tag', component: Tag, label: 'وسم' },
    { name: 'MapPin', component: MapPin, label: 'موقع' },
    { name: 'Globe', component: Globe, label: 'عالمي' },
    { name: 'Bell', component: Bell, label: 'جرس' },
    { name: 'FileText', component: FileText, label: 'ملف' },
    { name: 'Calendar', component: Calendar, label: 'تقويم' }
  ];

  const colors = [
    { value: '#D4AF37', label: 'ذهبي' },
    { value: '#01411C', label: 'أخضر داكن' },
    { value: '#065f41', label: 'أخضر فاتح' },
    { value: '#DC143C', label: 'أحمر قرمزي' },
    { value: '#1E90FF', label: 'أزرق' },
    { value: '#FF8C00', label: 'برتقالي' },
    { value: '#9370DB', label: 'بنفسجي' },
    { value: '#32CD32', label: 'أخضر ليموني' }
  ];

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('يرجى إدخال عنوان السلايد');
      return;
    }

    const newSlide: CustomSlide = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      iconName: selectedIcon,
      icon: icons.find(i => i.name === selectedIcon)!.component,
      color: selectedColor,
      isPrimary: false,
      data: {
        // المعلومات الأساسية
        name,
        company,
        position,
        // معلومات الاتصال
        phone,
        email,
        whatsappNumber,
        alternativePhones,
        companyEmail,
        website,
        additionalWebsites,
        // التصنيف والاهتمام
        type: customerType,
        interestLevel,
        tags,
        assignedTo,
        // الموقع
        location: city || district || street || building || postalCode ? {
          lat: 0,
          lng: 0,
          city,
          district,
          street,
          building,
          postalCode
        } : undefined,
        notes
      }
    };

    onAdd(newSlide);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37] to-[#C4A037] p-6 text-white rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Plus className="w-6 h-6" />
              إضافة سلايد جديد
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* إعدادات السلايد */}
          <div className="space-y-4 bg-[#D4AF37]/10 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-gray-800 border-b pb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              إعدادات السلايد
            </h4>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">عنوان السلايد *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: معلومات عقار 1 - شقة مكة"
                className="border-2 border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الأيقونة</label>
                <select
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 rounded-md"
                >
                  {icons.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اللون</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 rounded-md"
                >
                  {colors.map(color => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* المعلومات الشخصية */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 border-b pb-2">المعلومات الشخصية</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="عبدالله بن محمد"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الشركة</label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="شركة العقارات المتميزة"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوظيفة</label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="مدير مبيعات"
                  className="border-2 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* التصنيف ومستوى الاهتمام */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 border-b pb-2">التصنيف والاهتمام</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع العميل</label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                  className="w-full p-2 border-2 border-gray-200 rounded-md"
                >
                  <option value="buyer">مشتري</option>
                  <option value="seller">بائع</option>
                  <option value="tenant">مستأجر</option>
                  <option value="lessor">مؤجر</option>
                  <option value="finance">تمويل</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">مستوى الاهتمام</label>
                <select
                  value={interestLevel}
                  onChange={(e) => setInterestLevel(e.target.value as InterestLevel)}
                  className="w-full p-2 border-2 border-gray-200 rounded-md"
                >
                  <option value="passionate">شغوف</option>
                  <option value="interested">مهتم</option>
                  <option value="moderate">معتدل</option>
                  <option value="limited">محدود</option>
                  <option value="not-interested">غير مهتم</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">مسند إلى</label>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="اسم الموظف المسؤول"
                className="border-2 border-gray-200"
              />
            </div>
          </div>

          {/* معلومات الاتصال */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 border-b pb-2">معلومات الاتصال</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب</label>
                <Input
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  type="email"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">بريد الشركة</label>
                <Input
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="info@company.com"
                  type="email"
                  className="border-2 border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الموقع الإلكتروني</label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="border-2 border-gray-200"
              />
            </div>
          </div>

          {/* معلومات الموقع */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 border-b pb-2">معلومات الموقع</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مكة المكرمة"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الحي</label>
                <Input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="العزيزية"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الشارع</label>
                <Input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="شارع الملك عبدالعزيز"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم المبنى</label>
                <Input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="123"
                  className="border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الرمز البريدي</label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="12345"
                  className="border-2 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات إضافية..."
              rows={4}
              className="border-2 border-gray-200"
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C4A037] text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة السلايد
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 📄 CUSTOM SLIDE VIEW - عرض السلايد المخصص (نسخة كاملة من GeneralInfoSlide)
// ============================================================

function CustomSlideView({ slideData, onUpdate }: {
  slideData: CustomSlide['data'];
  onUpdate: (data: CustomSlide['data']) => void;
}) {
  const typeConfig = slideData.type ? CUSTOMER_TYPE_COLORS[slideData.type] : null;
  const interestConfig = slideData.interestLevel ? INTEREST_LEVEL_COLORS[slideData.interestLevel] : null;

  return (
    <div className="space-y-6">
      {/* المعلومات الأساسية */}
      {(slideData.name || slideData.company || slideData.position) && (
        <Card className={`border-2 ${typeConfig?.border || 'border-[#D4AF37]'} ${typeConfig?.bg || 'bg-gradient-to-br from-white to-[#D4AF37]/5'}`}>
          <CardHeader>
            <CardTitle className="text-[#01411C] flex items-center gap-2">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {slideData.name && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#01411C]" />
                <div>
                  <p className="text-sm text-gray-600">الاسم</p>
                  <p className="font-bold text-gray-800">{slideData.name}</p>
                </div>
              </div>
            )}

            {slideData.company && (
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#01411C]" />
                <div>
                  <p className="text-sm text-gray-600">الشركة</p>
                  <p className="font-bold text-gray-800">{slideData.company}</p>
                </div>
              </div>
            )}

            {slideData.position && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-[#01411C]" />
                <div>
                  <p className="text-sm text-gray-600">الوظيفة</p>
                  <p className="font-bold text-gray-800">{slideData.position}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* التصنيف والاهتمام */}
      {(slideData.type || slideData.interestLevel || slideData.assignedTo) && (
        <Card className={`border-2 ${interestConfig?.border || 'border-blue-300'} ${interestConfig?.bg || 'bg-blue-50'}`}>
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              التصنيف والاهتمام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {slideData.type && (
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">نوع العميل</p>
                  <Badge className={typeConfig?.bg || ''}>
                    {typeConfig?.label || slideData.type}
                  </Badge>
                </div>
              </div>
            )}

            {slideData.interestLevel && (
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">مستوى الاهتمام</p>
                  <Badge className={interestConfig?.bg || ''}>
                    {interestConfig?.label || slideData.interestLevel}
                  </Badge>
                </div>
              </div>
            )}

            {slideData.assignedTo && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">مسند إلى</p>
                  <p className="font-bold text-gray-800">{slideData.assignedTo}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* معلومات الاتصال */}
      {(slideData.phone || slideData.email || slideData.whatsappNumber) && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {slideData.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">رقم الجوال</p>
                  <p className="font-bold text-gray-800">{slideData.phone}</p>
                </div>
              </div>
            )}

          {slideData.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="font-bold text-gray-800">{slideData.email}</p>
              </div>
            </div>
          )}

          {slideData.whatsappNumber && (
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">واتساب</p>
                <p className="font-bold text-gray-800">{slideData.whatsappNumber}</p>
              </div>
            </div>
          )}

          {slideData.companyEmail && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">بريد الشركة</p>
                <p className="font-bold text-gray-800">{slideData.companyEmail}</p>
              </div>
            </div>
          )}

          {slideData.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">الموقع الإلكتروني</p>
                <a 
                  href={slideData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:underline"
                >
                  {slideData.website}
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* معلومات الموقع */}
      {slideData.location && (
        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              معلومات الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slideData.location.city && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">المدينة:</span>
                  <span className="font-bold text-gray-800">{slideData.location.city}</span>
                </div>
              )}
              {slideData.location.district && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">الحي:</span>
                  <span className="font-bold text-gray-800">{slideData.location.district}</span>
                </div>
              )}
              {slideData.location.street && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">الشارع:</span>
                  <span className="font-bold text-gray-800">{slideData.location.street}</span>
                </div>
              )}
              {slideData.location.building && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">رقم المبنى:</span>
                  <span className="font-bold text-gray-800">{slideData.location.building}</span>
                </div>
              )}
              {slideData.location.postalCode && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">الرمز البريدي:</span>
                  <span className="font-bold text-gray-800">{slideData.location.postalCode}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* الوسوم */}
      {slideData.tags && slideData.tags.length > 0 && (
        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              الوسوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {slideData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* الملاحظات */}
      {slideData.notes && (
        <Card className="border-2 border-gray-300 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ملاحظات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800 whitespace-pre-wrap">{slideData.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* رسالة فارغة */}
      {!slideData.name && !slideData.company && !slideData.position && !slideData.phone && !slideData.email && !slideData.whatsappNumber && !slideData.website && !slideData.location && !slideData.notes && !slideData.type && !slideData.interestLevel && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">لا توجد بيانات</h3>
          <p>لم يتم إضافة أي معلومات في هذا السلايد بعد</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 🗑️ DELETED: المكون القديم ReceivedOffersSlide تم استبداله بالمكون الجديد من /components/crm/ReceivedOffersSlide.tsx
// ============================================================

// ============================================================
// 🔍 سلايد الطلبات المستقبلة من العملاء
// ============================================================
function ReceivedRequestsSlide({ brokerPhone }: { brokerPhone: string }) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const requestsKey = `broker_received_requests_${brokerPhone}`;
    const loadedRequests = JSON.parse(localStorage.getItem(requestsKey) || '[]');
    setRequests(loadedRequests);
  }, [brokerPhone]);

  const handleMarkAsRead = (requestId: string) => {
    const requestsKey = `broker_received_requests_${brokerPhone}`;
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, isNew: false } : r
    );
    localStorage.setItem(requestsKey, JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold mb-2">لا توجد طلبات مستقبلة</h3>
        <p>لم يرسل العملاء أي طلبات بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className={`border-2 ${request.isNew ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-600" />
                {request.type === 'buy' ? 'طلب شراء' : 'طلب استئجار'}
                {request.isNew && (
                  <Badge className="bg-red-500 text-white animate-pulse">جديد</Badge>
                )}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(request.submittedAt).toLocaleDateString('ar-SA')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>الاسم:</strong> {request.fullName}</div>
              <div><strong>الجوال:</strong> {request.phone}</div>
              <div><strong>المدينة:</strong> {request.city}</div>
              <div><strong>الحي:</strong> {request.district}</div>
              <div><strong>النوع:</strong> {request.propertyType}</div>
              <div><strong>الميزانية:</strong> {request.budgetMin?.toLocaleString()} - {request.budgetMax?.toLocaleString()} ريال</div>
              <div><strong>الغرف:</strong> {request.bedrooms}</div>
              <div><strong>الحمامات:</strong> {request.bathrooms}</div>
            </div>
            {request.description && (
              <div className="p-2 bg-gray-100 rounded">
                <strong>المتطلبات:</strong> {request.description}
              </div>
            )}
            {request.isNew && (
              <Button
                onClick={() => handleMarkAsRead(request.id)}
                variant="outline"
                className="w-full border-orange-500 text-orange-600"
              >
                <CheckCircle className="w-4 h-4 ml-1" />
                تم الاطلاع
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
