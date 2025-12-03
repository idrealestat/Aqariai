/**
 * Business Card Profile Component
 * Digital Business Card Display & Management
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Badge } from './ui/badge';
import { 
  Share2,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageSquare,
  FileText,
  Calculator,
  Activity,
  TrendingUp,
  Users,
  Home,
  BarChart3,
  Upload,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Save,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Search,
  ArrowRight,
  Edit,
  Building,
  BadgeIcon,
  Calendar,
  Trophy,
  Medal,
  Award,
  Crown,
  Zap
} from 'lucide-react';
import { saveImage, getImage, hasEnoughSpace } from '../utils/imageStorage';
import { downloadVCard } from '../utils/vcardGenerator';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  type: string;
  plan?: string;
  companyName?: string;
  licenseNumber?: string;
  city?: string;
  district?: string;
}

interface BusinessCardProfileProps {
  user: User | null;
  onBack: () => void;
  onEditClick?: () => void;
}

export function BusinessCardProfile({ user, onBack, onEditClick }: BusinessCardProfileProps) {
  // مفتاح التخزين المحلي للمستخدم الحالي
  // ✅ استخدام رقم الجوال كمفتاح بديل إذا لم يكن هناك id
  const STORAGE_KEY = `business_card_${user?.id || user?.phone || 'default'}`;

  // تحميل البيانات من localStorage عند بدء المكون
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات المحفوظة:', error);
    }
    return null;
  };

  const savedData = loadSavedData();

  const [formData, setFormData] = useState(savedData || {
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
    location: user?.city || '',
    coverImage: '',
    logoImage: '',
    profileImage: '',
    officialPlatform: '',
    bio: '',
    socialMedia: {
      tiktok: '',
      twitter: '',
      instagram: '',
      snapchat: '',
      youtube: '',
      facebook: ''
    },
    workingHours: {
      sunday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
      monday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
      tuesday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
      wednesday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
      thursday: { open: '8:00 ص', close: '2:00 م', isOpen: true },
      friday: { open: '', close: '', isOpen: false },
      saturday: { open: '8:00 ص', close: '2:00 م', isOpen: true }
    },
    achievements: {
      totalDeals: 8,
      totalProperties: 12,
      totalClients: 45,
      yearsOfExperience: 5,
      awards: ['أفضل وسيط 2024'],
      certifications: ['رخصة فال'],
      topPerformer: true,
      verified: true
    }
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);

  // تحميل الصور من IndexedDB عند بدء المكون
  useEffect(() => {
    const loadImages = async () => {
      // ✅ استخدام رقم الجوال كمعرف بديل
      const userId = user?.id || user?.phone || 'demo-user';
      
      if (!userId) {
        console.log('⚠️ لا يوجد معرف مستخدم - تخطي تحميل الصور');
        return;
      }
      
      console.log(`🔄 بدء تحميل الصور لـ userId: ${userId}`);
      
      setIsLoadingImages(true);
      try {
        // تحميل جميع الصور
        // ✅ استخدام userId بدلاً من user.id
        const [coverUrl, logoUrl, profileUrl] = await Promise.all([
          getImage(userId, 'cover'),
          getImage(userId, 'logo'),
          getImage(userId, 'profile')
        ]);
        
        console.log('📦 نتائج التحميل:', {
          cover: coverUrl ? '✅ موجودة' : '❌ غير موجودة',
          logo: logoUrl ? '✅ موجودة' : '❌ غير موجودة',
          profile: profileUrl ? '✅ موجودة' : '❌ غير موجودة'
        });
        
        // 🆕 تحديث البيانات بالصور المحملة فقط إذا كانت موجودة
        setFormData(prev => ({
          ...prev,
          coverImage: coverUrl || prev.coverImage || '', // استخدام string فارغ كـ fallback
          logoImage: logoUrl || prev.logoImage || '',
          profileImage: profileUrl || prev.profileImage || ''
        }));
        
        // 🆕 تسجيل محسّن للنتائج
        const loadedCount = [coverUrl, logoUrl, profileUrl].filter(Boolean).length;
        if (loadedCount > 0) {
          console.log(`✅ تم تحميل ${loadedCount} صورة من IndexedDB`);
        } else {
          console.log('ℹ️ لا توجد صور محفوظة - سيتم استخدام placeholders');
        }
      } catch (error) {
        // 🆕 معالجة محسّنة للأخطاء - لا نطبع خطأ إذا كانت قاعدة البيانات فارغة
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        console.log('ℹ️ تنبيه تحميل الصور:', errorMessage);
      } finally {
        setIsLoadingImages(false);
        console.log('✅ انتهى تحميل الصور');
      }
    };
    
    loadImages();
  }, [user?.id, user?.phone]); // ✅ إضافة user?.phone للتبعيات

  // رسالة ترحيب عند التحميل الأول
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`welcome_${STORAGE_KEY}`);
    if (!hasSeenWelcome && savedData) {
      setShowWelcomeMessage(true);
      localStorage.setItem(`welcome_${STORAGE_KEY}`, 'true');
      setTimeout(() => setShowWelcomeMessage(false), 5000);
    }
  }, [STORAGE_KEY, savedData]);

  // حفظ البيانات النصية فقط في localStorage (بدون الصور)
  useEffect(() => {
    if (autoSaveEnabled && !isLoadingImages) {
      try {
        // إزالة الصور من البيانات المحفوظة في localStorage
        const dataToSave = {
          ...formData,
          coverImage: '', // لا نحفظ الصور في localStorage
          logoImage: '',
          profileImage: ''
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('✅ تم حفظ البيانات النصية تلقائياً');
        
        // 🔗 إرسال حدث للتطبيقات الأخرى (منصتي)
        window.dispatchEvent(new CustomEvent('businessCardUpdated', {
          detail: { storageKey: STORAGE_KEY, data: dataToSave }
        }));
      } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        setErrorMessage('حدث خطأ في حفظ البيانات');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  }, [formData, autoSaveEnabled, STORAGE_KEY, isLoadingImages]);

  // حفظ يدوي مع إشعار
  const handleManualSave = () => {
    try {
      // حفظ البيانات النصية فقط في localStorage
      const dataToSave = {
        ...formData,
        coverImage: '',
        logoImage: '',
        profileImage: ''
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      console.log('✅ تم الحفظ اليدوي بنجاح');
      
      // 🔗 إرسال حدث للتطبيقات الأخرى (منصتي)
      window.dispatchEvent(new CustomEvent('businessCardUpdated', {
        detail: { storageKey: STORAGE_KEY, data: dataToSave }
      }));
    } catch (error) {
      console.error('❌ خطأ في الحفظ:', error);
      setErrorMessage('حدث خطأ أثناء الحفظ');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  /**
   * رفع الصورة وحفظها في IndexedDB بالحجم الكامل
   * - من: حفظ الصورة كـ Base64 في localStorage (يسبب QuotaExceededError)
   * - إلى: حفظ الصورة بالحجم الكامل في IndexedDB (بدون ضغط)
   */
  const handleImageUpload = async (type: 'cover' | 'logo' | 'profile', file: File) => {
    console.log(`📤 بدء رفع صورة ${type}، حجم الملف: ${(file.size / 1024).toFixed(2)} KB`);
    
    // ✅ استخدام رقم الجوال كمعرف بديل إذا لم يكن هناك id
    const userId = user?.id || user?.phone || 'demo-user';
    
    if (!userId || userId === 'demo-user') {
      console.warn('⚠️ استخدام معرف افتراضي للمستخدم التجريبي');
    }
    
    console.log(`🔑 معرف المستخدم: ${userId}`);
    
    // ✅ لا يوجد قيد على حجم الملف - يقبل أي حجم
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      console.error('❌ نوع ملف غير صالح:', file.type);
      setErrorMessage('يرجى اختيار ملف صورة صالح');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    try {
      // التحقق من توفر مساحة كافية
      const hasSpace = await hasEnoughSpace();
      if (!hasSpace) {
        console.error('❌ لا توجد مساحة تخزين كافية');
        setErrorMessage('لا توجد مساحة تخزين كافية');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
      
      console.log(`💾 حفظ الصورة في IndexedDB...`);
      
      // حفظ الصورة في IndexedDB بالحجم الكامل (بدون ضغط)
      // ✅ استخدام userId بدلاً من user.id لضمان وجود قيمة صالحة
      const imageUrl = await saveImage(userId, type, file);
      
      console.log(`✅ تم إنشاء ObjectURL: ${imageUrl}`);
      
      // تحديث البيانات بالرابط الجديد
      setFormData(prev => {
        const updated = { ...prev };
        
        if (type === 'cover') {
          updated.coverImage = imageUrl;
          console.log(`📸 تحديث coverImage:`, imageUrl);
        } else if (type === 'logo') {
          updated.logoImage = imageUrl;
          console.log(`📸 تحديث logoImage:`, imageUrl);
        } else if (type === 'profile') {
          updated.profileImage = imageUrl;
          console.log(`📸 تحديث profileImage:`, imageUrl);
        }
        
        return updated;
      });
      
      // إظهار رسالة نجاح
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
      
      console.log(`✅ تم حفظ صورة ${type} بالحجم الكامل في IndexedDB بنجاح`);
      
      // 🔗 إرسال حدث لتحديث الصور في منصتي
      window.dispatchEvent(new CustomEvent('businessCardUpdated', {
        detail: { 
          storageKey: STORAGE_KEY, 
          imageType: type,
          updated: true
        }
      }));
      
    } catch (error) {
      console.error('❌ خطأ في حفظ الصورة:', error);
      setErrorMessage('حدث خطأ أثناء حفظ الصورة. يرجى المحاولة مرة أخرى');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const recentActivities = [
    { id: 1, title: 'عقد صفقة جديدة', time: 'منذ ساعتين', icon: Home, color: 'green' },
    { id: 2, title: 'اجتماع مع عميل', time: 'منذ 3 ساعات', icon: Users, color: 'blue' },
    { id: 3, title: 'معاينة عقار', time: 'منذ 5 ساعات', icon: MapPin, color: 'purple' },
    { id: 4, title: 'تحديث قائمة العقارات', time: 'أمس', icon: FileText, color: 'orange' },
    { id: 5, title: 'اتصال مع مالك عقار', time: 'أمس', icon: Phone, color: 'red' }
  ];

  const statistics = [
    { id: 1, label: 'العقارات المباعة', value: '24', icon: Home, color: 'blue' },
    { id: 2, label: 'العملاء النشطين', value: '45', icon: Users, color: 'green' },
    { id: 3, label: 'الصفقات الجارية', value: '12', icon: TrendingUp, color: 'purple' },
    { id: 4, label: 'المعاينات هذا الشهر', value: '18', icon: MapPin, color: 'orange' },
    { id: 5, label: 'متوسط التقييم', value: '4.8', icon: Star, color: 'yellow' }
  ];

  const daysArabic: { [key: string]: string } = {
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت'
  };

  const socialMediaPlatforms = [
    { 
      key: 'tiktok', 
      name: 'تيكتوك', 
      icon: <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white text-xs">T</div>,
      displayIcon: <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">T</div>
    },
    { 
      key: 'twitter', 
      name: 'اكس', 
      icon: <Twitter className="w-5 h-5 text-black" />,
      displayIcon: <Twitter className="w-8 h-8 text-black" />
    },
    { 
      key: 'instagram', 
      name: 'انستقرام', 
      icon: <Instagram className="w-5 h-5 text-pink-600" />,
      displayIcon: <Instagram className="w-8 h-8 text-pink-600" />
    },
    { 
      key: 'snapchat', 
      name: 'سناب شات', 
      icon: <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center text-white text-xs">👻</div>,
      displayIcon: <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-2xl">👻</div>
    },
    { 
      key: 'youtube', 
      name: 'يوتيوب', 
      icon: <Youtube className="w-5 h-5 text-red-600" />,
      displayIcon: <Youtube className="w-8 h-8 text-red-600" />
    },
    { 
      key: 'facebook', 
      name: 'فيسبوك', 
      icon: <Facebook className="w-5 h-5 text-blue-600" />,
      displayIcon: <Facebook className="w-8 h-8 text-blue-600" />
    }
  ];

  // ==========================================
  // 📇 1. زر تحميل vCard
  // ==========================================
  const handleDownloadVCard = () => {
    try {
      downloadVCard({
        name: formData.userName || user?.name || '',
        jobTitle: 'وسيط عقاري',
        company: formData.companyName || user?.companyName || '',
        phone: formData.primaryPhone || user?.phone || '',
        whatsapp: user?.whatsapp || formData.primaryPhone || '',
        email: formData.email || user?.email || '',
        website1: formData.domain ? `https://${formData.domain}.aqariai.com` : '',
        website2: formData.officialPlatform || '',
        googleMapsLocation: formData.googleMapsLocation || ''
      }, `${formData.userName || 'contact'}`);
      
      toast.success('✅ تم تحميل بطاقة الاتصال بنجاح!');
    } catch (error) {
      console.error('خطأ في تحميل vCard:', error);
      toast.error('حدث خطأ أثناء إنشاء بطاقة الاتصال');
    }
  };

  // ==========================================
  // 🏠 2. زر إرسال عرض
  // ==========================================
  const handleSendOffer = () => {
    const brokerPhone = user?.phone || formData.primaryPhone;
    const brokerName = user?.name || formData.userName;
    
    if (!brokerPhone) {
      toast.error('رقم الجوال غير متوفر');
      return;
    }

    const link = `${window.location.origin}#/send-offer/${brokerPhone}/${encodeURIComponent(brokerName)}`;
    
    const fallbackCopyToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(() => fallbackCopyToClipboard(link));
    } else {
      fallbackCopyToClipboard(link);
    }

    toast.success(`✅ تم نسخ رابط إرسال العرض!`);
    const whatsappMessage = `السلام عليكم\n\nيمكنك إرسال عرضك العقاري عبر هذا الرابط:\n${link}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
  };

  // ==========================================
  // 🔍 3. زر إرسال طلب
  // ==========================================
  const handleSendRequest = () => {
    const brokerPhone = user?.phone || formData.primaryPhone;
    const brokerName = user?.name || formData.userName;
    
    if (!brokerPhone) {
      toast.error('رقم الجوال غير متوفر');
      return;
    }

    const link = `${window.location.origin}#/send-request/${brokerPhone}/${encodeURIComponent(brokerName)}`;
    
    const fallbackCopyToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(() => fallbackCopyToClipboard(link));
    } else {
      fallbackCopyToClipboard(link);
    }

    toast.success(`✅ تم نسخ رابط إرسال الطلب!`);
    const whatsappMessage = `السلام عليكم\n\nيمكنك إرسال طلبك العقاري عبر هذا الرابط:\n${link}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
  };

  // ==========================================
  // 💰 4. زر حاسبة التمويل
  // ==========================================
  const handleFinanceCalculator = () => {
    const brokerPhone = user?.phone || formData.primaryPhone;
    
    if (!brokerPhone) {
      toast.error('رقم الجوال غير متوفر');
      return;
    }

    const linkId = `finance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const link = `${window.location.origin}/finance-link/${linkId}`;
    
    localStorage.setItem(`finance_link_broker_${linkId}`, JSON.stringify({
      formData: {},
      selectedBank: 'مصرف الراجحي',
      loanType: 'realEstate',
      bankRates: {},
      createdAt: new Date().toISOString(),
      brokerPhone: brokerPhone
    }));
    
    const fallbackCopyToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(() => fallbackCopyToClipboard(link));
    } else {
      fallbackCopyToClipboard(link);
    }

    toast.success(`✅ تم نسخ رابط حاسبة التمويل!`);
    const whatsappMessage = `السلام عليكم\n\nتفضل رابط حاسبة التمويل العقاري:\n${link}\n\nيرجى تعبئة البيانات وسنتواصل معك قريباً`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
  };

  // ==========================================
  // 🔧 دوال الهيدر
  // ==========================================
  
  // حساب أيام انتهاء رخصة FAL
  const calculateDaysLeft = () => {
    if (!formData.falExpiry) return null;
    const expiry = new Date(formData.falExpiry);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // حساب أيام انتهاء السجل التجاري
  const calculateCommercialDaysLeft = () => {
    if (!formData.commercialExpiryDate) return null;
    const expiry = new Date(formData.commercialExpiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // دالة التبديل بين الصورة والشعار
  const handleSwapImages = () => {
    setIsSwapped(!isSwapped);
  };

  // تحديد نوع الشارة
  const getBadgeType = () => {
    const { totalDeals, yearsOfExperience } = formData.achievements;
    
    if (totalDeals >= 100 && yearsOfExperience >= 10) return 'diamond';
    if (totalDeals >= 50 && yearsOfExperience >= 5) return 'platinum';
    if (totalDeals >= 30 && yearsOfExperience >= 3) return 'gold';
    if (totalDeals >= 15 && yearsOfExperience >= 2) return 'silver';
    if (totalDeals >= 5 && yearsOfExperience >= 1) return 'bronze';
    
    return 'starter';
  };

  const getBadgeConfig = (type: string) => {
    const configs: any = {
      diamond: {
        icon: Crown,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-50',
        label: 'وسيط ماسي',
        gradient: 'from-cyan-400 to-blue-600'
      },
      platinum: {
        icon: Trophy,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        label: 'وسيط بلاتيني',
        gradient: 'from-purple-400 to-pink-400'
      },
      gold: {
        icon: Trophy,
        color: 'text-[#D4AF37]',
        bgColor: 'bg-yellow-50',
        label: 'وسيط ذهبي',
        gradient: 'from-yellow-400 to-yellow-600'
      },
      silver: {
        icon: Medal,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        label: 'وسيط فضي',
        gradient: 'from-gray-300 to-gray-500'
      },
      bronze: {
        icon: Award,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        label: 'وسيط برونزي',
        gradient: 'from-orange-400 to-orange-600'
      },
      starter: {
        icon: Zap,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        label: 'وسيط نشط',
        gradient: 'from-blue-400 to-blue-600'
      }
    };
    return configs[type] || configs.starter;
  };

  const daysLeft = calculateDaysLeft();
  const licenseColor = daysLeft === null ? 'gray' : 
                       daysLeft > 90 ? 'green' : 
                       daysLeft > 30 ? 'yellow' : 'red';

  const commercialDaysLeft = calculateCommercialDaysLeft();
  const commercialColor = commercialDaysLeft === null ? 'gray' : 
                          commercialDaysLeft > 90 ? 'green' : 
                          commercialDaysLeft > 30 ? 'yellow' : 'red';

  const badgeType = getBadgeType();
  const badgeConfig = getBadgeConfig(badgeType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* رسالة ترحيب عند استعادة البيانات */}
      {showWelcomeMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">مرحباً بعودتك! 🎉</span>
            </div>
            <p className="text-sm">تم استعادة بياناتك المحفوظة بنجاح</p>
          </div>
        </div>
      )}

      {/* إشعار الحفظ الناجح */}
      {showSaveSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">تم الحفظ بنجاح! ✅</span>
          </div>
        </div>
      )}

      {/* إشعار الخطأ */}
      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* زر الحفظ العائم */}
      <button
        onClick={handleManualSave}
        className="fixed bottom-24 left-4 z-40 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-[#D4AF37]"
        title="حفظ التغييرات"
      >
        <Save className="w-6 h-6" />
      </button>

      {/* الهيدر - غير محمي الآن */}
      <div 
        className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 relative bg-cover bg-center"
        style={formData.coverImage ? { 
          backgroundImage: `url(${formData.coverImage})`, 
          backgroundBlendMode: 'overlay', 
          backgroundColor: 'rgba(1, 65, 28, 0.85)' 
        } : {}}
      >
        <div className="max-w-4xl mx-auto">
          {/* أزرار التحكم */}
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              عودة
            </Button>

            {onEditClick && (
              <Button
                onClick={onEditClick}
                variant="ghost"
                className="text-white hover:bg-white/20 border border-white/30"
              >
                <Edit className="w-4 h-4 ml-2" />
                تحرير
              </Button>
            )}
          </div>

          {/* محتوى الهيدر */}
          <div className="text-center space-y-2">
            {/* صورة البروفايل */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* الصورة الرئيسية - تتبدل حسب الحالة - مكبرة 40% */}
                <img 
                  src={!isSwapped 
                    ? (formData.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=01411C&color=D4AF37&size=192')
                    : (formData.logoImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.companyName || 'Company') + '&background=D4AF37&color=01411C&size=192')
                  } 
                  alt={!isSwapped ? "Profile" : "Company Logo"} 
                  className="w-48 h-48 rounded-full border-4 border-[#D4AF37] shadow-lg object-cover cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={handleSwapImages}
                />
                {/* الشعار الصغير - يتبدل حسب الحالة */}
                {(formData.logoImage || formData.profileImage) && (
                  <div 
                    className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                    onClick={handleSwapImages}
                  >
                    <img 
                      src={isSwapped 
                        ? (formData.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=01411C&color=D4AF37&size=128')
                        : (formData.logoImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.companyName || 'Company') + '&background=D4AF37&color=01411C&size=128')
                      } 
                      alt={isSwapped ? "Profile" : "Company Logo"} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* الاسم والشارة */}
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-2xl font-bold">{user?.name || 'اسم المستخدم'}</h1>
              
              <div 
                className="relative group cursor-pointer"
                title={badgeConfig.label}
              >
                <div className={`${badgeConfig.bgColor} ${badgeConfig.color} p-2 rounded-full shadow-lg hover:scale-110 transition-transform`}>
                  <badgeConfig.icon className="w-5 h-5" />
                </div>
                
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    <p className="font-semibold">{badgeConfig.label}</p>
                    <p className="text-gray-300 mt-1">{formData.achievements.totalDeals} صفقة مكتملة</p>
                    <p className="text-gray-300">{formData.achievements.yearsOfExperience} سنوات خبرة</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {formData.achievements.verified && (
                <div 
                  className="bg-blue-100 text-blue-600 p-2 rounded-full shadow-lg"
                  title="موثق ✓"
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
            
            {/* اسم الشركة */}
            <p className="text-lg">{formData.companyName || 'اسم الشركة'}</p>
            
            {/* التقييم */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
              <span className="mr-2">5.0</span>
            </div>

            {/* الباقة */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge className="bg-[#D4AF37] text-[#01411C]">
                {user?.plan || 'فردي'}
              </Badge>
            </div>

            {/* معلومات الترخيص - أسفل الهيدر */}
            <div className="mt-6 flex flex-col sm:flex-row items-start justify-between gap-3 text-xs">
              {/* رخصة FAL - اليسار */}
              {formData.falLicense && (
                <div className="flex items-start gap-2">
                  {/* الدائرة الملونة */}
                  <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${
                    licenseColor === 'green' ? 'bg-green-400' :
                    licenseColor === 'yellow' ? 'bg-yellow-400' :
                    licenseColor === 'red' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`} />
                  
                  {/* المعلومات */}
                  <div>
                    <p className="text-white/90">
                      رخصة فال: <span className="font-semibold">{formData.falLicense}</span>
                    </p>
                    {formData.falExpiry && (
                      <p className="text-white/70 text-[10px] mt-0.5">
                        تنتهي في: {formData.falExpiry}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* السجل التجاري - اليمين */}
              {formData.commercialRegistration && (
                <div className="flex items-start gap-2">
                  {/* الدائرة الملونة */}
                  <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${
                    commercialColor === 'green' ? 'bg-green-400' :
                    commercialColor === 'yellow' ? 'bg-yellow-400' :
                    commercialColor === 'red' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`} />
                  
                  {/* المعلومات */}
                  <div>
                    <p className="text-white/90">
                      سجل تجاري: <span className="font-semibold">{formData.commercialRegistration}</span>
                    </p>
                    {formData.commercialExpiryDate && (
                      <p className="text-white/70 text-[10px] mt-0.5">
                        تنتهي في: {formData.commercialExpiryDate}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        
        {/* نبذة عني */}
        <Card className="border-2 border-[#D4AF37] shadow-lg bg-gradient-to-br from-white to-[#fffef7]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="text-2xl">🖊️</div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
            
            {isEditingBio ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="min-h-[120px] text-right"
                placeholder="اكتب نبذة عنك..."
                maxLength={300}
              />
            ) : (
              <p className="text-center text-gray-700 leading-relaxed min-h-[80px]">
                {formData.bio || 'لا توجد نبذة حتى الآن'}
              </p>
            )}
            
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setIsEditingBio(!isEditingBio)}
                variant="outline"
                className="border-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37] hover:text-white"
              >
                {isEditingBio ? 'حفظ' : 'تحرير'}
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="text-2xl">🖊️</div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </CardContent>
        </Card>

        {/* === PC VERSION === */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 gap-6">
            {/* العمود الأول في RTL = اليسار */}
            <div className="space-y-4">
              <Card className="border-2 border-[#D4AF37] shadow-lg">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-t-lg">
                  <h3 className="text-sm flex items-center gap-2 font-bold">
                    <Activity className="w-4 h-4" />النشاطات
                  </h3>
                </div>
                <CardContent className="pt-3 px-3">
                  <div className="space-y-2">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                          <div className={`p-1.5 rounded-full bg-${activity.color}-100 shrink-0`}>
                            <IconComponent className={`w-3.5 h-3.5 text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#01411C] truncate">{activity.title}</p>
                            <p className="text-[10px] text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#D4AF37] shadow-lg">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-3 rounded-t-lg">
                  <h3 className="text-sm flex items-center gap-2 font-bold">
                    <BarChart3 className="w-4 h-4" />الإحصائيات
                  </h3>
                </div>
                <CardContent className="pt-3 px-3">
                  <div className="space-y-2">
                    {statistics.map((stat) => {
                      const IconComponent = stat.icon;
                      return (
                        <div key={stat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full bg-${stat.color}-100`}>
                              <IconComponent className={`w-3.5 h-3.5 text-${stat.color}-600`} />
                            </div>
                            <span className="text-xs text-gray-600">{stat.label}</span>
                          </div>
                          <span className="text-sm font-bold text-[#01411C]">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* العمود الثاني في RTL = اليمين */}
            <Card className="border-2 border-[#D4AF37] shadow-lg">
              <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-4 rounded-t-lg">
                <h3 className="font-bold flex items-center gap-2">⏰ أوقات العمل</h3>
              </div>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {Object.entries(formData.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-[#01411C]">{daysArabic[day]}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${hours.isOpen ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : '🟥 إجازة'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* === MOBILE VERSION === */}
        <div className="lg:hidden space-y-4">
          <Card className="border-2 border-[#D4AF37] shadow-lg">
            <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-4 rounded-t-lg">
              <h3 className="font-bold flex items-center gap-2">⏰ أوقات العمل</h3>
            </div>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {Object.entries(formData.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-[#01411C]">{daysArabic[day]}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${hours.isOpen ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {hours.isOpen ? `${hours.open} - ${hours.close}` : '🟥 إجازة'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-[#D4AF37] shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 rounded-t-lg">
                <h3 className="text-xs flex items-center gap-1 font-bold">
                  <Activity className="w-3 h-3" />النشاطات
                </h3>
              </div>
              <CardContent className="pt-2 px-2">
                <div className="space-y-1.5">
                  {recentActivities.slice(0, 3).map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-1.5 p-1.5 bg-gray-50 rounded">
                        <div className={`p-1 rounded-full bg-${activity.color}-100 shrink-0`}>
                          <IconComponent className={`w-2.5 h-2.5 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-[#01411C] truncate">{activity.title}</p>
                          <p className="text-[9px] text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#D4AF37] shadow-lg">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-2 rounded-t-lg">
                <h3 className="text-xs flex items-center gap-1 font-bold">
                  <BarChart3 className="w-3 h-3" />الإحصائيات
                </h3>
              </div>
              <CardContent className="pt-2 px-2">
                <div className="space-y-1.5">
                  {statistics.slice(0, 3).map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={stat.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                        <div className="flex items-center gap-1.5">
                          <div className={`p-1 rounded-full bg-${stat.color}-100`}>
                            <IconComponent className={`w-2.5 h-2.5 text-${stat.color}-600`} />
                          </div>
                          <span className="text-[10px] text-gray-600">{stat.label}</span>
                        </div>
                        <span className="text-xs font-bold text-[#01411C]">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* شبكة الأزرار 3×6 */}
        <Card className="border-2 border-[#D4AF37] shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <Globe className="w-6 h-6" />
                <span>منصتي</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <Globe className="w-6 h-6" />
                <span>الموقع الرسمي</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <MapPin className="w-6 h-6" />
                <span>خرائط جوجل</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <Phone className="w-6 h-6" />
                <span>اتصال مباشر</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <MessageSquare className="w-6 h-6" />
                <span>واتساب</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <Mail className="w-6 h-6" />
                <span>إيميل</span>
              </Button>
              
              {/* ✨ 1. زر تحميل vCard */}
              <Button 
                onClick={handleDownloadVCard}
                className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3"
              >
                <Download className="w-6 h-6" />
                <span>تحميل بطاقة</span>
              </Button>
              
              {/* ✨ 2. زر إرسال عرض */}
              <Button 
                onClick={handleSendOffer}
                className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3"
              >
                <Home className="w-6 h-6" />
                <span>إرسال عرض</span>
              </Button>
              
              {/* ✨ 3. زر إرسال طلب */}
              <Button 
                onClick={handleSendRequest}
                className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3"
              >
                <Search className="w-6 h-6" />
                <span>إرسال طلب</span>
              </Button>
              
              {/* ✨ 4. زر حاسبة التمويل */}
              <Button 
                onClick={handleFinanceCalculator}
                className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3"
              >
                <Calculator className="w-6 h-6" />
                <span>حاسبة تمويل</span>
              </Button>
              
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <FileText className="w-6 h-6" />
                <span>عرض سعر</span>
              </Button>
              <Button className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:opacity-90 px-6 py-3 text-lg border-2 border-[#D4AF37] flex flex-row items-center justify-center gap-3">
                <FileText className="w-6 h-6" />
                <span>سند قبض</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* زرين المشاركة */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="h-16 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white border-2 border-[#D4AF37] shadow-lg"
            onClick={() => alert('مشاركة البطاقة')}
          >
            <Share2 className="w-5 h-5 ml-2" />
            مشاركة البطاقة
          </Button>
          
          <Button 
            className="h-16 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] hover:from-[#f1c40f] hover:to-[#D4AF37] text-[#01411C] border-2 border-[#01411C] shadow-lg font-bold"
            onClick={() => alert('مشاركة التقييم')}
          >
            <Star className="w-5 h-5 ml-2" />
            مشاركة التقييم
          </Button>
        </div>

        {/* روابط التواصل الاجتماعي - تظهر فقط إذا تم إضافة رابط */}
        {Object.values(formData.socialMedia).some(link => link) && (
          <Card className="border-2 border-[#D4AF37] shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-center font-bold text-[#01411C] mb-4 text-lg">تابعني على</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {socialMediaPlatforms.map((platform) => {
                  const link = formData.socialMedia[platform.key as keyof typeof formData.socialMedia];
                  if (!link) return null;
                  
                  return (
                    <a
                      key={platform.key}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                      style={{ 
                        background: 
                          platform.key === 'tiktok' ? '#000' : 
                          platform.key === 'twitter' ? '#e5e7eb' : 
                          platform.key === 'instagram' ? 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' : 
                          platform.key === 'snapchat' ? '#FFFC00' : 
                          platform.key === 'youtube' ? '#FF0000' : 
                          '#1877F2' 
                      }}
                    >
                      {platform.displayIcon}
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

export default BusinessCardProfile;