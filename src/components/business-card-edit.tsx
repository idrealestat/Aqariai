/**
 * Business Card Edit Component
 * Edit & Update Digital Business Card Information
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowRight,
  Save,
  Upload,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { saveImage, getImage, hasEnoughSpace } from '../utils/imageStorage';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  plan?: string;
  companyName?: string;
  licenseNumber?: string;
  city?: string;
}

interface FormData {
  userName: string;
  companyName: string;
  commercialRegistration: string;
  commercialExpiryDate?: string;
  falLicense: string;
  falExpiry: string;
  coverImage: string;
  logoImage: string;
  profileImage: string;
  primaryPhone: string;
  email: string;
  location: string;
  domain: string;
  officialPlatform: string;
  googleMapsLocation: string;
  bio: string;
  socialMedia: {
    tiktok: string;
    twitter: string;
    instagram: string;
    snapchat: string;
    youtube: string;
    facebook: string;
  };
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  achievements: {
    totalDeals: number;
    totalProperties: number;
    totalClients: number;
    yearsOfExperience: number;
    awards: string[];
    certifications: string[];
    topPerformer: boolean;
    verified: boolean;
  };
}

interface BusinessCardEditProps {
  user: User | null;
  onBack: () => void;
}

export function BusinessCardEdit({ user, onBack }: BusinessCardEditProps) {
  // مفتاح التخزين المحلي للمستخدم الحالي
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

  const [formData, setFormData] = useState<FormData>(savedData || {
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

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // تحميل الصور من IndexedDB عند بدء المكون
  useEffect(() => {
    const loadImages = async () => {
      const userId = user?.id || user?.phone || 'demo-user';
      
      if (!userId) {
        console.log('⚠️ لا يوجد معرف مستخدم - تخطي تحميل الصور');
        return;
      }
      
      console.log(`🔄 بدء تحميل الصور لـ userId: ${userId}`);
      
      setIsLoadingImages(true);
      try {
        const [coverUrl, logoUrl, profileUrl] = await Promise.all([
          getImage(userId, 'cover'),
          getImage(userId, 'logo'),
          getImage(userId, 'profile')
        ]);
        
        setFormData(prev => ({
          ...prev,
          coverImage: coverUrl || prev.coverImage || '',
          logoImage: logoUrl || prev.logoImage || '',
          profileImage: profileUrl || prev.profileImage || ''
        }));
        
        const loadedCount = [coverUrl, logoUrl, profileUrl].filter(Boolean).length;
        if (loadedCount > 0) {
          console.log(`✅ تم تحميل ${loadedCount} صورة من IndexedDB`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'خطأ غير معروف';
        console.log('ℹ️ تنبيه تحميل الصور:', errorMsg);
      } finally {
        setIsLoadingImages(false);
        console.log('✅ انتهى تحميل الصور');
      }
    };
    
    loadImages();
  }, [user?.id, user?.phone]);

  // حفظ البيانات النصية فقط في localStorage (بدون الصور)
  useEffect(() => {
    if (autoSaveEnabled && !isLoadingImages) {
      try {
        const dataToSave = {
          ...formData,
          coverImage: '',
          logoImage: '',
          profileImage: ''
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('✅ تم حفظ البيانات النصية تلقائياً');
        
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

  const handleImageUpload = async (type: 'cover' | 'logo' | 'profile', file: File) => {
    console.log(`📤 بدء رفع صورة ${type}، حجم الملف: ${(file.size / 1024).toFixed(2)} KB`);
    
    const userId = user?.id || user?.phone || 'demo-user';
    
    if (!userId || userId === 'demo-user') {
      console.warn('⚠️ استخدام معرف افتراضي للمستخدم التجريبي');
    }
    
    if (!file.type.startsWith('image/')) {
      console.error('❌ نوع ملف غير صالح:', file.type);
      setErrorMessage('يرجى اختيار ملف صورة صالح');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    try {
      const hasSpace = await hasEnoughSpace();
      if (!hasSpace) {
        console.error('❌ لا توجد مساحة تخزين كافية');
        setErrorMessage('لا توجد مساحة تخزين كافية');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
      
      const imageUrl = await saveImage(userId, type, file);
      
      setFormData(prev => {
        const updated = { ...prev };
        
        if (type === 'cover') {
          updated.coverImage = imageUrl;
        } else if (type === 'logo') {
          updated.logoImage = imageUrl;
        } else if (type === 'profile') {
          updated.profileImage = imageUrl;
        }
        
        return updated;
      });
      
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
      
      console.log(`✅ تم حفظ صورة ${type} بالحجم الكامل في IndexedDB بنجاح`);
      
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
      icon: <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white text-xs">T</div>
    },
    { 
      key: 'twitter', 
      name: 'اكس', 
      icon: <Twitter className="w-5 h-5 text-black" />
    },
    { 
      key: 'instagram', 
      name: 'انستقرام', 
      icon: <Instagram className="w-5 h-5 text-pink-600" />
    },
    { 
      key: 'snapchat', 
      name: 'سناب شات', 
      icon: <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center text-white text-xs">👻</div>
    },
    { 
      key: 'youtube', 
      name: 'يوتيوب', 
      icon: <Youtube className="w-5 h-5 text-red-600" />
    },
    { 
      key: 'facebook', 
      name: 'فيسبوك', 
      icon: <Facebook className="w-5 h-5 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
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

      {/* الهيدر */}
      <div className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              عودة
            </Button>
            
            <Button
              onClick={() => {
                handleManualSave();
                onBack();
              }}
              className="bg-[#D4AF37] text-[#01411C] hover:bg-[#D4AF37]/90"
            >
              <Save className="w-4 h-4 ml-1" />
              حفظ والعودة
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Upload className="w-6 h-6" />
            <h1 className="text-2xl font-bold">تحرير بطاقة الأعمال الرقمية</h1>
          </div>
          <p className="text-white/80 text-sm mt-1">
            قم بتحديث معلومات بطاقتك الرقمية بما في ذلك الصور والمعلومات الأساسية وأوقات العمل وروابط التواصل
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* شريط معلومات الحفظ التلقائي */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700">
                <strong>الحفظ التلقائي: {autoSaveEnabled ? 'مفعّل ✅' : 'معطّل ⏸️'}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className="border-[#D4AF37] text-[#01411C]"
              >
                {autoSaveEnabled ? '⏸️ إيقاف الحفظ التلقائي' : '▶️ تفعيل الحفظ التلقائي'}
              </Button>
              <Button
                size="sm"
                onClick={handleManualSave}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="w-4 h-4 ml-1" />
                حفظ الآن
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* قسم الصور */}
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border-2 border-[#D4AF37]">
            <h3 className="text-lg font-bold text-[#01411C] border-b-2 border-[#D4AF37] pb-2">
              الصور
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* صورة الغلاف */}
              <div className="space-y-2">
                <Label>صورة الغلاف</Label>
                <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 text-center">
                  {formData.coverImage ? (
                    <div className="relative">
                      <img src={formData.coverImage} alt="Cover" className="w-full max-w-full h-auto object-contain rounded" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData({ ...formData, coverImage: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-[#D4AF37]" />
                      <p className="text-sm text-gray-600 mt-2">اضغط لرفع الصورة</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('cover', file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* شعار الشركة */}
              <div className="space-y-2">
                <Label>شعار الشركة</Label>
                <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 text-center">
                  {formData.logoImage ? (
                    <div className="relative">
                      <img src={formData.logoImage} alt="Logo" className="w-full max-w-full h-auto object-contain rounded" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData({ ...formData, logoImage: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-[#D4AF37]" />
                      <p className="text-sm text-gray-600 mt-2">اضغط لرفع الشعار</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('logo', file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* الصورة الشخصية */}
              <div className="space-y-2">
                <Label>الصورة الشخصية</Label>
                <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 text-center">
                  {formData.profileImage ? (
                    <div className="relative">
                      <img src={formData.profileImage} alt="Profile" className="w-full max-w-full h-auto object-contain rounded-full" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData({ ...formData, profileImage: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-[#D4AF37]" />
                      <p className="text-sm text-gray-600 mt-2">اضغط لرفع الصورة</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('profile', file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* قسم المعلومات الأساسية */}
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border-2 border-[#D4AF37]">
            <h3 className="text-lg font-bold text-[#01411C] border-b-2 border-[#D4AF37] pb-2">
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>المنصة الإلكترونية الرسمية</Label>
                <Input
                  value={formData.officialPlatform}
                  onChange={(e) => setFormData({ ...formData, officialPlatform: e.target.value })}
                  placeholder="https://..."
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>النطاق (Domain)</Label>
                <Input
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="my-platform"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>موقع Google Maps</Label>
                <Input
                  value={formData.googleMapsLocation}
                  onChange={(e) => setFormData({ ...formData, googleMapsLocation: e.target.value })}
                  placeholder="رابط الموقع على خرائط جوجل"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>المدينة</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="المدينة"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم السجل التجاري</Label>
                <Input
                  value={formData.commercialRegistration}
                  onChange={(e) => setFormData({ ...formData, commercialRegistration: e.target.value })}
                  placeholder="1234567890"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>تاريخ انتهاء السجل التجاري</Label>
                <Input
                  type="date"
                  value={formData.commercialExpiryDate || ''}
                  onChange={(e) => setFormData({ ...formData, commercialExpiryDate: e.target.value })}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>تاريخ انتهاء رخصة فال</Label>
                <Input
                  type="date"
                  value={formData.falExpiry}
                  onChange={(e) => setFormData({ ...formData, falExpiry: e.target.value })}
                  className="text-right"
                />
              </div>
            </div>
          </div>

          {/* قسم النبذة */}
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border-2 border-[#D4AF37]">
            <h3 className="text-lg font-bold text-[#01411C] border-b-2 border-[#D4AF37] pb-2">
              نبذة عني
            </h3>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="اكتب نبذة عنك وعن خبراتك في المجال العقاري..."
              className="min-h-[120px] text-right"
              maxLength={300}
            />
            <p className="text-sm text-gray-500 text-left">{formData.bio.length}/300 حرف</p>
          </div>

          {/* قسم التواصل الاجتماعي */}
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border-2 border-[#D4AF37]">
            <h3 className="text-lg font-bold text-[#01411C] border-b-2 border-[#D4AF37] pb-2">
              روابط التواصل الاجتماعي
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialMediaPlatforms.map((platform) => (
                <div key={platform.key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {platform.icon}
                    {platform.name}
                  </Label>
                  <Input
                    value={formData.socialMedia[platform.key as keyof typeof formData.socialMedia]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { ...formData.socialMedia, [platform.key]: e.target.value }
                    })}
                    placeholder={`رابط ${platform.name}`}
                    className="text-right"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* قسم أيام وساعات العمل */}
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border-2 border-[#D4AF37]">
            <h3 className="text-lg font-bold text-[#01411C] border-b-2 border-[#D4AF37] pb-2">
              أيام وساعات العمل
            </h3>
            
            <div className="space-y-3">
              {Object.entries(formData.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-24 font-semibold text-[#01411C]">{daysArabic[day]}</div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => setFormData({
                        ...formData,
                        workingHours: {
                          ...formData.workingHours,
                          [day]: { ...hours, isOpen: e.target.checked }
                        }
                      })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">مفتوح</span>
                  </label>

                  {hours.isOpen && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => setFormData({
                          ...formData,
                          workingHours: {
                            ...formData.workingHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        })}
                        className="w-32 text-sm"
                      />
                      <span className="text-sm text-gray-600">إلى</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => setFormData({
                          ...formData,
                          workingHours: {
                            ...formData.workingHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        })}
                        className="w-32 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* أزرار إدارة البيانات المحفوظة */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">إدارة البيانات المحفوظة</h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const confirmed = confirm('هل تريد حذف جميع البيانات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء.');
                  if (confirmed) {
                    localStorage.removeItem(STORAGE_KEY);
                    setFormData({
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
                    alert('✅ تم حذف جميع البيانات المحفوظة بنجاح!');
                  }
                }}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                🗑️ مسح الذاكرة
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const savedData = loadSavedData();
                  if (savedData) {
                    setFormData(savedData);
                    setShowSaveSuccess(true);
                    setTimeout(() => setShowSaveSuccess(false), 2000);
                  } else {
                    alert('⚠️ لا توجد بيانات محفوظة للاستعادة');
                  }
                }}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                📥 استعادة البيانات
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  const dataStr = JSON.stringify(formData, null, 2);
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `business-card-backup-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  alert('✅ تم تنزيل نسخة احتياطية من بياناتك!');
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                💾 تنزيل نسخة احتياطية
              </Button>
            </div>
          </div>

          {/* أزرار الحفظ والعودة */}
          <div className="flex gap-4 justify-end pt-4 border-t-2 border-gray-200">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-300 hover:bg-gray-100"
            >
              عودة بدون حفظ
            </Button>
            <Button
              onClick={() => {
                handleManualSave();
                onBack();
              }}
              className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white hover:from-[#065f41] hover:to-[#01411C]"
            >
              <Save className="w-4 h-4 ml-1" />
              حفظ والعودة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCardEdit;