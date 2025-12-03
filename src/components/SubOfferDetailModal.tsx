import React, { useState, useEffect } from 'react';
import { X, Save, Camera, MapPin, Home, DollarSign, Ruler, Calendar, Tag, TrendingUp, Users, Settings, UserCircle, Phone, FileText, ArrowRight, Share2, Plus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShareOfferModal } from './ShareOfferModal';
import { getAdByNumber, updatePublishedAd, PublishedAd } from '../utils/publishedAds';

// 🔧 دالة موحدة لاستخراج رقم الإعلان النظيف من أي شكل
const extractAdNumber = (adNumber: string): string => {
  if (!adNumber) return '';
  
  let clean = adNumber
    .replace(/^#/, '')                           // إزالة # من البداية
    .replace(/^إعلان رقم:\s*/, '')              // إزالة "إعلان رقم: "
    .replace(/^رقم الاعلان:\s*/, '')            // إزالة "رقم الاعلان: "
    .replace(/^رقم الإعلان:\s*/, '')            // إزالة "رقم الإعلان: "
    .replace(/\.{3,}/g, '')                      // إزالة "..."
    .trim();
  
  // إذا كان يبدأ بـ AD- استخرجه مباشرة
  const adMatch = clean.match(/AD-\d+-\d+/);
  if (adMatch) {
    return adMatch[0];
  }
  
  return clean;
};

interface SubOfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subOffer: {
    id: string;
    title: string;
    price: string;
    adNumber: string;
    image: string;
    imageCount: number;
    ownerName?: string; // اسم المالك - للربط مع CRM
    ownerPhone?: string; // رقم جوال المالك - المفتاح الرئيسي للربط
  };
  onSave: (data: any) => void;
}

export default function SubOfferDetailModal({ isOpen, onClose, subOffer, onSave }: SubOfferDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'valuations' | 'inventory' | 'marketing' | 'owner'>('basic');
  const [showShareModal, setShowShareModal] = useState(false);
  const [publishedAd, setPublishedAd] = useState<PublishedAd | null>(null);
  
  // تحميل بيانات الإعلان المنشور
  useEffect(() => {
    if (isOpen && subOffer.adNumber) {
      console.log('🔍 [SubOfferModal] بدء تحميل الإعلان:', {
        originalAdNumber: subOffer.adNumber
      });
      
      // ✅ استخراج رقم الإعلان النظيف
      const cleanAdNumber = extractAdNumber(subOffer.adNumber);
      console.log('🔧 [SubOfferModal] رقم الإعلان بعد التنظيف:', cleanAdNumber);
      
      const ad = getAdByNumber(cleanAdNumber);
      
      if (ad) {
        console.log('✅ [SubOfferModal] تم العثور على الإعلان:', {
          adNumber: ad.adNumber,
          hasDescription: !!ad.description,
          hasAiDescription: !!ad.aiGeneratedDescription,
          description: ad.description?.substring(0, 100) + '...',
          aiDescription: ad.aiGeneratedDescription?.substring(0, 100) + '...'
        });
        
        setPublishedAd(ad);
        
        // ✅ تحديث الوصف: الأولوية للوصف الأساسي، ثم AI
        const finalDescription = ad.description || ad.aiGeneratedDescription || '';
        
        if (finalDescription) {
          console.log('📝 [SubOfferModal] تحميل الوصف:', finalDescription.substring(0, 100) + '...');
          setFormData(prev => ({
            ...prev,
            description: finalDescription
          }));
        } else {
          console.warn('⚠️ [SubOfferModal] لا يوجد وصف للإعلان!');
        }
      } else {
        console.error('❌ [SubOfferModal] لم يتم العثور على الإعلان!', {
          searchedFor: cleanAdNumber,
          originalAdNumber: subOffer.adNumber
        });
      }
    }
  }, [isOpen, subOffer.adNumber]);
  
  const [formData, setFormData] = useState({
    // Basic Info - من نشر الاعلان
    title: subOffer.title,
    description: '',  // ✅ سيتم تحميله من الإعلان المنشور في useEffect
    hashtags: ['شقة_للبيع', 'مكة', 'مفروشة', 'فاخرة', 'موقع_مميز'],
    newHashtag: '',
    images: [
      'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      'https://images.unsplash.com/photo-1703355685626-57abd3bfbd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      'https://images.unsplash.com/photo-1664091007038-ed5f2b44baf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    ],
    mainImageIndex: 0,
    propertyType: 'شقة',
    offerType: 'للبيع',
    area: '150',
    rooms: '3',
    bathrooms: '2',
    livingRooms: '1',
    kitchens: '1',
    floor: '2',
    totalFloors: '5',
    furnished: 'نعم',
    furnishingLevel: 'كامل',
    age: '5',
    ageUnit: 'سنوات',
    buildingAge: '10',
    condition: 'ممتاز',
    facadeDirection: 'شمال',
    
    // Location
    location: 'مكة المكرمة',
    neighborhood: 'العزيزية',
    street: 'شارع الملك فهد',
    buildingNumber: '1234',
    unitNumber: '12',
    postalCode: '24231',
    
    // Pricing
    price: subOffer.price,
    pricePerMeter: '5,666',
    negotiable: true,
    currency: 'SAR',
    paymentTerms: 'نقدي',
    installmentAvailable: false,
    downPayment: '',
    monthlyInstallment: '',
    
    // Features
    parking: 'متوفر',
    parkingSpaces: '2',
    elevator: 'نعم',
    ac: 'مركزي',
    heating: 'مركزي',
    kitchen: 'مجهزة',
    view: 'شارع',
    balcony: 'نعم',
    garden: 'لا',
    pool: 'لا',
    gym: 'لا',
    security: 'نعم',
    
    // Utilities
    electricity: 'متصل',
    water: 'متصل',
    gas: 'متصل',
    internet: 'جاهز',
    
    // Valuations
    marketValue: '900,000',
    estimatedValue: '850,000',
    lastValuationDate: '2025-10-01',
    valuationCompany: 'شركة التقييم المعتمدة',
    
    // Inventory
    status: 'متاح',
    availability: 'فوري',
    ownerType: 'فرد',
    licenseNumber: '123456789',
    titleDeedNumber: 'TD-2024-001',
    
    // Marketing
    featured: true,
    publishedOn: ['ساكن', 'حراج', 'عقار'],
    clicks: '234',
    impressions: '1,234',
    conversionRate: '15%',
    
    // Owner Info - التعبئة من بيانات العرض الفرعي إن وجدت
    ownerName: subOffer.ownerName || 'أحمد محمد السعيدي',
    ownerPhone: subOffer.ownerPhone || '0501234567',
    ownerWhatsapp: subOffer.ownerPhone || '0501234567',
    ownerEmail: 'ahmed@example.com',
    ownerIdNumber: '1234567890',
    titleDeedDate: '2020-05-15',
    ownerNotes: 'عميل متعاون، يفضل التواصل عبر واتساب'
  });

  if (!isOpen) return null;

  const handleSave = () => {
    console.log('💾 [SubOfferModal] بدء حفظ التعديلات...');
    
    // حفظ التغييرات المحلية
    onSave(formData);
    
    // ✅ تحديث الإعلان المنشور في publishedAds
    if (publishedAd) {
      // ✅ استخراج رقم الإعلان النظيف
      const cleanAdNumber = extractAdNumber(subOffer.adNumber);
      console.log('🔧 [SubOfferModal] حفظ للإعلان:', cleanAdNumber);
      
      const updateResult = updatePublishedAd(cleanAdNumber, {
        title: formData.title,
        description: formData.description,  // ✅ حفظ الوصف المعدل
        price: formData.price,
        // يمكن إضافة المزيد من الحقول هنا
      });
      
      if (updateResult.success) {
        console.log('✅ [SubOfferModal] تم تحديث الإعلان المنشور بنجاح:', {
          adNumber: cleanAdNumber,
          descriptionLength: formData.description.length
        });
        
        // إطلاق أحداث التحديث
        window.dispatchEvent(new Event('publishedAdSaved'));
        window.dispatchEvent(new Event('publishedAdUpdated')); // 🔄 حدث التحديث الجديد
        window.dispatchEvent(new Event('offersUpdated'));
      } else {
        console.error('❌ [SubOfferModal] فشل تحديث الإعلان:', updateResult.message);
      }
    } else {
      console.warn('⚠️ [SubOfferModal] لا يوجد إعلان منشور للتحديث!');
    }
    
    onClose();
  };

  const handleNavigateToOwner = () => {
    // 🔗 التوجه لبطاقة العميل في CRM باستخدام رقم الجوال
    const event = new CustomEvent('navigateToCustomer', {
      detail: {
        customerPhone: formData.ownerPhone // ⭐ المفتاح الرئيسي للربط
      }
    });
    window.dispatchEvent(event);
    console.log('🔗 التوجه لبطاقة المالك:', formData.ownerName, formData.ownerPhone);
    onClose();
  };

  const tabs = [
    { id: 'basic', label: 'المعلومات الأساسية', icon: Home },
    { id: 'valuations', label: 'التقييمات', icon: DollarSign },
    { id: 'inventory', label: 'الجرد', icon: Tag },
    { id: 'marketing', label: 'التسويق', icon: TrendingUp },
    { id: 'owner', label: 'معلومات المالك', icon: UserCircle }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white p-6 border-b-4 border-[#D4AF37]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">تعديل العرض</h2>
              <p className="text-sm text-gray-200">{subOffer.adNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* زر المشاركة - يرسل رابط صفحة العرض في المنصة */}
              <button
                onClick={() => {
                  // 🔗 رابط صفحة العرض في المنصة
                  const platformUrl = `${window.location.origin}/my-platform?ad=${subOffer.adNumber}`;
                  
                  // نسخ الرابط
                  navigator.clipboard.writeText(platformUrl).then(() => {
                    alert(`✅ تم نسخ رابط العرض:\n\n${platformUrl}\n\n📲 يمكنك الآن مشاركته عبر WhatsApp أو أي تطبيق آخر`);
                  }).catch(() => {
                    // إذا فشل النسخ التلقائي، اعرض الرابط
                    alert(`🔗 رابط العرض على المنصة:\n\n${platformUrl}\n\n📋 انسخ هذا الرابط وشاركه`);
                  });
                }}
                className="px-6 py-3 bg-[#D4AF37] text-[#01411C] rounded-lg hover:bg-[#b8941f] transition-all font-bold flex items-center gap-2 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                مشاركة رابط العرض
              </button>
              {/* زر الإغلاق */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-[#01411C] shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-240px)] p-6">
          
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              
              {/* المعلومات الأساسية - من نشر الاعلان */}
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#D4AF37]" />
                    معلومات الإعلان (للتعديل)
                  </h3>
                  
                  <div className="space-y-4">
                    {/* العنوان */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">العنوان:</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        placeholder="عنوان الإعلان"
                      />
                    </div>
                    
                    {/* رقم الاعلان */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الاعلان:</label>
                      <input
                        type="text"
                        value={subOffer.adNumber}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    
                    {/* الوصف */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الوصف:</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none"
                        placeholder="وصف تفصيلي للعقار..."
                      />
                    </div>

                    {/* الهاشتاقات */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الهاشتاقات:</label>
                      <div className="flex flex-wrap gap-2 mb-3 p-3 border-2 border-gray-200 rounded-lg min-h-[60px] bg-gray-50">
                        {formData.hashtags?.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#01411C] text-white rounded-full text-sm"
                          >
                            #{tag}
                            <button
                              onClick={() => {
                                const newTags = formData.hashtags.filter((_: string, i: number) => i !== index);
                                setFormData({...formData, hashtags: newTags});
                              }}
                              className="hover:bg-red-500 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* اضف هاشتاق */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">اضف هاشتاق:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.newHashtag || ''}
                          onChange={(e) => setFormData({...formData, newHashtag: e.target.value})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && formData.newHashtag?.trim()) {
                              const newTags = [...(formData.hashtags || []), formData.newHashtag.trim()];
                              setFormData({...formData, hashtags: newTags, newHashtag: ''});
                            }
                          }}
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                          placeholder="اكتب هاشتاق واضغط Enter"
                        />
                        <button
                          onClick={() => {
                            if (formData.newHashtag?.trim()) {
                              const newTags = [...(formData.hashtags || []), formData.newHashtag.trim()];
                              setFormData({...formData, hashtags: newTags, newHashtag: ''});
                            }
                          }}
                          className="px-6 py-3 bg-[#01411C] text-white rounded-lg hover:bg-[#065f41] transition-all font-bold"
                        >
                          إضافة
                        </button>
                      </div>
                    </div>

                    {/* الصور على شكل دوائر صغيرة مع تحديد الرئيسية + زر إضافة */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">الصور (اختر الصورة الرئيسية):</label>
                      <div className="flex flex-wrap gap-3">
                        {formData.images?.map((image: string, index: number) => (
                          <div
                            key={index}
                            onClick={() => setFormData({...formData, mainImageIndex: index})}
                            className={`relative cursor-pointer transition-all ${
                              formData.mainImageIndex === index
                                ? 'ring-4 ring-[#D4AF37] scale-110'
                                : 'hover:scale-105'
                            }`}
                          >
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <ImageWithFallback
                                src={image}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {formData.mainImageIndex === index && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs">★</span>
                              </div>
                            )}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                        
                        {/* دائرة إضافة صورة جديدة */}
                        <div
                          onClick={() => {
                            // فتح input file
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event: any) => {
                                  const newImages = [...formData.images, event.target.result];
                                  setFormData({...formData, images: newImages});
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                          className="relative cursor-pointer transition-all hover:scale-110"
                        >
                          <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-[#f0fdf4] shadow-lg flex items-center justify-center hover:from-[#D4AF37] hover:to-[#b8941f] transition-all group">
                            <Plus className="w-10 h-10 text-[#D4AF37] group-hover:text-white transition-colors" />
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            إضافة
                          </div>
                        </div>
                      </div>
                      {formData.mainImageIndex !== undefined && (
                        <p className="text-sm text-gray-600 mt-3">
                          ✓ الصورة رقم {(formData.mainImageIndex || 0) + 1} هي الصورة الرئيسية
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ملاحظة */}
              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">ℹ️ ملاحظة:</span> هذه المعلومات مأخوذة من <span className="font-bold">زر النشر على المنصات → تبويب نشر الإعلان</span>
                </p>
              </div>

              {/* مواصفات العقار - مخفي مؤقتاً */}
              <Card className="border-2 border-[#D4AF37]" style={{display: 'none'}}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-[#D4AF37]" />
                    مواصفات العقار
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">المساحة (م²)</label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">عدد الغرف</label>
                      <input
                        type="text"
                        value={formData.rooms}
                        onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">عدد الحمامات</label>
                      <input
                        type="text"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">غرف المعيشة</label>
                      <input
                        type="text"
                        value={formData.livingRooms}
                        onChange={(e) => setFormData({...formData, livingRooms: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">المطابخ</label>
                      <input
                        type="text"
                        value={formData.kitchens}
                        onChange={(e) => setFormData({...formData, kitchens: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الطابق</label>
                      <input
                        type="text"
                        value={formData.floor}
                        onChange={(e) => setFormData({...formData, floor: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">إجمالي الطوابق</label>
                      <input
                        type="text"
                        value={formData.totalFloors}
                        onChange={(e) => setFormData({...formData, totalFloors: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">مفروش</label>
                      <select
                        value={formData.furnished}
                        onChange={(e) => setFormData({...formData, furnished: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                        <option>جزئياً</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">مستوى التأثيث</label>
                      <select
                        value={formData.furnishingLevel}
                        onChange={(e) => setFormData({...formData, furnishingLevel: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>كامل</option>
                        <option>جزئي</option>
                        <option>فاخر</option>
                        <option>عادي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">عمر العقار</label>
                      <input
                        type="text"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الوحدة</label>
                      <select
                        value={formData.ageUnit}
                        onChange={(e) => setFormData({...formData, ageUnit: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>سنوات</option>
                        <option>أشهر</option>
                        <option>جديد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>ممتاز</option>
                        <option>جيد جداً</option>
                        <option>جيد</option>
                        <option>يحتاج تجديد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">اتجاه الواجهة</label>
                      <select
                        value={formData.facadeDirection}
                        onChange={(e) => setFormData({...formData, facadeDirection: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>شمال</option>
                        <option>جنوب</option>
                        <option>شرق</option>
                        <option>غرب</option>
                        <option>شمال شرقي</option>
                        <option>شمال غربي</option>
                        <option>جنوب شرقي</option>
                        <option>جنوب غربي</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* الموقع - مخفي */}
              <Card className="border-2 border-[#D4AF37]" style={{display: 'none'}}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    الموقع
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الحي</label>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الشارع</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم المبنى</label>
                      <input
                        type="text"
                        value={formData.buildingNumber}
                        onChange={(e) => setFormData({...formData, buildingNumber: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الوحدة</label>
                      <input
                        type="text"
                        value={formData.unitNumber}
                        onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الرمز البريدي</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* السعر - مخفي */}
              <Card className="border-2 border-[#D4AF37]" style={{display: 'none'}}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                    التسعير
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">السعر</label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">سعر المتر</label>
                      <input
                        type="text"
                        value={formData.pricePerMeter}
                        onChange={(e) => setFormData({...formData, pricePerMeter: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">العملة</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>SAR</option>
                        <option>USD</option>
                        <option>EUR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">شروط الدفع</label>
                      <input
                        type="text"
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.negotiable}
                          onChange={(e) => setFormData({...formData, negotiable: e.target.checked})}
                          className="w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="font-bold text-gray-700">السعر قابل للتفاوض</span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.installmentAvailable}
                          onChange={(e) => setFormData({...formData, installmentAvailable: e.target.checked})}
                          className="w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="font-bold text-gray-700">التقسيط متاح</span>
                      </label>
                    </div>

                    {formData.installmentAvailable && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">الدفعة المقدمة</label>
                          <input
                            type="text"
                            value={formData.downPayment}
                            onChange={(e) => setFormData({...formData, downPayment: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">القسط الشهري</label>
                          <input
                            type="text"
                            value={formData.monthlyInstallment}
                            onChange={(e) => setFormData({...formData, monthlyInstallment: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* المميزات والخدمات - مخفي */}
              <Card className="border-2 border-[#D4AF37]" style={{display: 'none'}}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#D4AF37]" />
                    المميزات والخدمات
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">موقف سيارات</label>
                      <select
                        value={formData.parking}
                        onChange={(e) => setFormData({...formData, parking: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>متوفر</option>
                        <option>غير متوفر</option>
                      </select>
                    </div>

                    {formData.parking === 'متوفر' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">عدد المواقف</label>
                        <input
                          type="text"
                          value={formData.parkingSpaces}
                          onChange={(e) => setFormData({...formData, parkingSpaces: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">مصعد</label>
                      <select
                        value={formData.elevator}
                        onChange={(e) => setFormData({...formData, elevator: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">التكييف</label>
                      <select
                        value={formData.ac}
                        onChange={(e) => setFormData({...formData, ac: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>مركزي</option>
                        <option>سبليت</option>
                        <option>شباك</option>
                        <option>غير متوفر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">التدفئة</label>
                      <select
                        value={formData.heating}
                        onChange={(e) => setFormData({...formData, heating: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>مركزي</option>
                        <option>فردي</option>
                        <option>غير متوفر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">المطبخ</label>
                      <select
                        value={formData.kitchen}
                        onChange={(e) => setFormData({...formData, kitchen: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>مجهزة</option>
                        <option>جاهزة</option>
                        <option>غير مجهزة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الإطلالة</label>
                      <select
                        value={formData.view}
                        onChange={(e) => setFormData({...formData, view: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>شارع</option>
                        <option>حديقة</option>
                        <option>بحر</option>
                        <option>جبل</option>
                        <option>مدينة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">شرفة</label>
                      <select
                        value={formData.balcony}
                        onChange={(e) => setFormData({...formData, balcony: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">حديقة</label>
                      <select
                        value={formData.garden}
                        onChange={(e) => setFormData({...formData, garden: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">مسبح</label>
                      <select
                        value={formData.pool}
                        onChange={(e) => setFormData({...formData, pool: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">صالة رياضية</label>
                      <select
                        value={formData.gym}
                        onChange={(e) => setFormData({...formData, gym: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">حارس أمن</label>
                      <select
                        value={formData.security}
                        onChange={(e) => setFormData({...formData, security: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>نعم</option>
                        <option>لا</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* المرافق - مخفي */}
              <Card className="border-2 border-[#D4AF37]" style={{display: 'none'}}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4">المرافق والخدمات</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الكهرباء</label>
                      <select
                        value={formData.electricity}
                        onChange={(e) => setFormData({...formData, electricity: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>متصل</option>
                        <option>غير متصل</option>
                        <option>قيد التوصيل</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">المياه</label>
                      <select
                        value={formData.water}
                        onChange={(e) => setFormData({...formData, water: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>متصل</option>
                        <option>غير متصل</option>
                        <option>قيد التوصيل</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الغاز</label>
                      <select
                        value={formData.gas}
                        onChange={(e) => setFormData({...formData, gas: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>متصل</option>
                        <option>غير متصل</option>
                        <option>قيد التوصيل</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الإنترنت</label>
                      <select
                        value={formData.internet}
                        onChange={(e) => setFormData({...formData, internet: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>جاهز</option>
                        <option>غير جاهز</option>
                        <option>قيد التجهيز</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Valuations Tab */}
          {activeTab === 'valuations' && (
            <div className="space-y-6">
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4">التقييمات العقارية</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">القيمة السوقية</label>
                      <input
                        type="text"
                        value={formData.marketValue}
                        onChange={(e) => setFormData({...formData, marketValue: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">القيمة التقديرية</label>
                      <input
                        type="text"
                        value={formData.estimatedValue}
                        onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ آخر تقييم</label>
                      <input
                        type="date"
                        value={formData.lastValuationDate}
                        onChange={(e) => setFormData({...formData, lastValuationDate: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">شركة التقييم</label>
                      <input
                        type="text"
                        value={formData.valuationCompany}
                        onChange={(e) => setFormData({...formData, valuationCompany: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4">الجرد والوثائق</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>متاح</option>
                        <option>محجوز</option>
                        <option>مباع</option>
                        <option>مؤجر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">التوفر</label>
                      <input
                        type="text"
                        value={formData.availability}
                        onChange={(e) => setFormData({...formData, availability: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">نوع المالك</label>
                      <select
                        value={formData.ownerType}
                        onChange={(e) => setFormData({...formData, ownerType: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      >
                        <option>فرد</option>
                        <option>شركة</option>
                        <option>مؤسسة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الرخصة</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الصك</label>
                      <input
                        type="text"
                        value={formData.titleDeedNumber}
                        onChange={(e) => setFormData({...formData, titleDeedNumber: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Marketing Tab */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-[#01411C] mb-4">التسويق والإحصائيات</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                          className="w-5 h-5 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span className="font-bold text-gray-700">عرض مميز</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">النقرات</label>
                      <input
                        type="text"
                        value={formData.clicks}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">المشاهدات</label>
                      <input
                        type="text"
                        value={formData.impressions}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">معدل التحويل</label>
                      <input
                        type="text"
                        value={formData.conversionRate}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">منشور على المنصات</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.publishedOn.map((platform) => (
                          <span
                            key={platform}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Owner Info Tab */}
          {activeTab === 'owner' && (
            <div className="space-y-6">
              <Card className="border-2 border-[#D4AF37]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-[#01411C] flex items-center gap-2">
                      <UserCircle className="w-5 h-5 text-[#D4AF37]" />
                      معلومات المالك
                    </h3>
                    <button
                      onClick={handleNavigateToOwner}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <span className="font-bold text-sm">الانتقال لبطاقة المالك</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.ownerPhone}
                          onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                          className="w-full pr-10 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">واتساب</label>
                      <input
                        type="tel"
                        value={formData.ownerWhatsapp}
                        onChange={(e) => setFormData({...formData, ownerWhatsapp: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهوية</label>
                      <input
                        type="text"
                        value={formData.ownerIdNumber}
                        onChange={(e) => setFormData({...formData, ownerIdNumber: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">رقم الصك</label>
                      <div className="relative">
                        <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.titleDeedNumber}
                          onChange={(e) => setFormData({...formData, titleDeedNumber: e.target.value})}
                          className="w-full pr-10 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الصك</label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.titleDeedDate}
                          onChange={(e) => setFormData({...formData, titleDeedDate: e.target.value})}
                          className="w-full pr-10 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات</label>
                      <textarea
                        value={formData.ownerNotes}
                        onChange={(e) => setFormData({...formData, ownerNotes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* معلومات سريعة */}
              <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <h4 className="font-bold text-blue-800 mb-3">معلومات سريعة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">آخر اتصال: منذ 3 أيام</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-gray-700">عدد العقارات: 5</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                      <span className="text-gray-700">التصنيف: VIP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white border-t-2 border-[#D4AF37] p-4 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareOfferModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        offerTitle={formData.title}
        offerId={subOffer.id}
        adNumber={subOffer.adNumber}
        offerDescription={formData.description}
        offerPrice={subOffer.price}
      />
    </div>
  );
}
