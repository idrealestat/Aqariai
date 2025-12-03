/**
 * 📨 نموذج إرسال عرض عقاري - النسخة العامة للعميل
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: السماح للعميل بإرسال عرض مباشرة للوسيط
 * 📌 الفكرة: نسخة طبق الأصل من SaleOfferForm لكن للعميل
 * 📌 النتيجة: البيانات تُرسل للوسيط مع إشعار + دائرة حمراء نابضة
 * ────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Home, MapPin, DollarSign, FileText, Send, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadVCard } from '../utils/vcardGenerator';
import { Camera } from "lucide-react";
import { saveMultipleMediaToIndexedDB } from '../utils/indexedDBStorage';

interface OfferFormPublicProps {
  brokerPhone: string;
  brokerName: string;
}

const propertyTypes = ['شقة', 'فيلا', 'أرض', 'دبلكس', 'تجاري', 'استراحة', 'مزرعة', 'مخزن', 'مكتب'];

export function OfferFormPublic({ brokerPhone, brokerName }: OfferFormPublicProps) {
  const [offerType, setOfferType] = useState<'sale' | 'rent'>('sale');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // 🆕 حالة الصور والفيديو
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone) {
      toast.error('يرجى إدخال الاسم ورقم الجوال');
      return;
    }

    setIsSubmitting(true);

    try {
      // 🆕 1) حفظ الصور والفيديو في IndexedDB وجلب IDs
      const fullOfferId = `full-offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const mediaToSave = [
        ...images.map(img => ({ type: 'image' as const, dataUrl: img })),
        ...videos.map(vid => ({ type: 'video' as const, dataUrl: vid }))
      ];
      
      let mediaIds: string[] = [];
      if (mediaToSave.length > 0) {
        console.log(`💾 [OfferFormPublic] حفظ ${mediaToSave.length} ملف في IndexedDB...`);
        mediaIds = await saveMultipleMediaToIndexedDB(fullOfferId, mediaToSave);
        console.log(`✅ [OfferFormPublic] تم حفظ الملفات في IndexedDB:`, mediaIds);
      }

      // 🆕 2) حفظ العرض الكامل مع IDs فقط (بدون Base64)
      const fullOfferData = {
        id: fullOfferId,
        title: `${propertyType} ${offerType === 'sale' ? 'للبيع' : 'للإيجار'} - ${city}`,
        type: offerType,
        transactionType: offerType,
        propertyType,
        propertyCategory: propertyType === 'تجاري' || propertyType === 'محل' || propertyType === 'مكتب' || propertyType === 'مستودع' ? 'commercial' : 'residential',
        
        // معلومات المالك
        ownerName: fullName,
        ownerPhone: phone,
        
        // الموقع
        city,
        district,
        
        // المواصفات الكاملة
        area: Number(area),
        price: Number(price),
        priceFrom: Number(price),
        priceTo: Number(price),
        bedrooms,
        bathrooms,
        description,
        
        // 🆕 حفظ IDs فقط (بدلاً من Base64)
        mediaIds: mediaIds,
        
        // حالة العرض
        status: 'active',
        brokerResponses: [], // عروض الوسطاء
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // حفظ العرض الكامل
      const currentUser = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
      const userId = currentUser.id || phone || 'demo-user';
      const ownerFullOffersKey = `owner-full-offers-${userId}`;
      const existingFullOffers = JSON.parse(localStorage.getItem(ownerFullOffersKey) || '[]');
      existingFullOffers.push(fullOfferData);
      localStorage.setItem(ownerFullOffersKey, JSON.stringify(existingFullOffers));
      
      console.log('✅ [OfferFormPublic] تم حفظ العرض الكامل (مع IDs فقط):', fullOfferData);

      // 🆕 3) نشر نسخة مختصرة في Marketplace للوسطاء
      const marketplaceOfferId = `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const marketplaceOffer = {
        id: marketplaceOfferId,
        fullOfferId: fullOfferId, // 🔗 مرجع للعرض الكامل
        
        // المعلومات المختصرة للبحث
        title: `${propertyType} ${offerType === 'sale' ? 'للبيع' : 'للإيجار'}`,
        type: 'offer' as const,
        transactionType: offerType === 'sale' ? 'sale' as const : 'rent' as const,
        propertyCategory: (propertyType === 'تجاري' || propertyType === 'محل' || propertyType === 'مكتب' || propertyType === 'مستودع' ? 'commercial' : 'residential') as const,
        userRole: offerType === 'sale' ? 'seller' as const : 'lessor' as const,
        
        // معلومات المالك
        userId: phone,
        userName: fullName,
        userPhone: phone,
        
        // معلومات أساسية
        propertyType,
        city,
        district,
        area: Number(area),
        priceFrom: Number(price),
        priceTo: Number(price),
        description: description.substring(0, 150) + (description.length > 150 ? '...' : ''), // وصف مختصر
        
        // بدون صور وفيديو في النسخة المختصرة
        status: 'active' as const,
        responsesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const existingMarketplaceOffers = JSON.parse(localStorage.getItem('marketplace-offers') || '[]');
      existingMarketplaceOffers.push(marketplaceOffer);
      localStorage.setItem('marketplace-offers', JSON.stringify(existingMarketplaceOffers));
      
      console.log('✅ [OfferFormPublic] تم نشر النسخة المختصرة في Marketplace:', marketplaceOffer);

      // 🆕 4) إضافة إشعار للوسيط (إذا كان موجود)
      if (brokerPhone) {
        const notificationsKey = `notifications_${brokerPhone}`;
        const existingNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
        existingNotifications.unshift({
          id: `notif-${Date.now()}`,
          type: 'new_offer',
          title: '🏠 عرض عقاري جديد',
          message: `عرض ${offerType === 'sale' ? 'بيع' : 'تأجير'} جديد من ${fullName}`,
          timestamp: new Date().toISOString(),
          read: false,
          offerId: marketplaceOfferId
        });
        localStorage.setItem(notificationsKey, JSON.stringify(existingNotifications));
      }

      setSubmitted(true);
      toast.success('✅ تم إرسال العرض بنجاح!');
    } catch (error) {
      console.error('خطأ في إرسال العرض:', error);
      toast.error('حدث خطأ أثناء إرسال العرض');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full border-2 border-green-500">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">تم الإرسال بنجاح!</h2>
            <p className="text-gray-600 leading-relaxed">
              شكراً لك! تم إرسال عرضك إلى {brokerName}.<br />
              سيتواصل معك قريباً.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-2 border-[#D4AF37]">
          <CardHeader className="bg-gradient-to-r from-[#01411C] to-[#065f41] text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Home className="w-6 h-6" />
              إرسال عرض عقاري إلى {brokerName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* نوع العرض */}
              <div className="space-y-3">
                <Label className="text-lg">نوع العرض</Label>
                <RadioGroup value={offerType} onValueChange={(v) => setOfferType(v as 'sale' | 'rent')} className="flex gap-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="sale" id="sale" />
                    <Label htmlFor="sale" className="cursor-pointer">بيع</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent" className="cursor-pointer">تأجير</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* البيانات الشخصية */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-[#01411C]">البيانات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>الاسم الكامل *</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أحمد محمد العبدالله"
                      required
                      className="border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <Label>رقم الجوال *</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      required
                      dir="ltr"
                      className="border-[#D4AF37]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* تفاصيل العقار */}
              <Card className="border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-[#01411C] flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    تفاصيل العقار
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>المدينة</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="الرياض"
                        className="border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <Label>الحي</Label>
                      <Input
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="العليا"
                        className="border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نوع العقار</Label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-2 border-2 border-[#D4AF37] rounded-md"
                      >
                        <option value="">اختر النوع</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>المساحة (م²)</Label>
                      <Input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="200"
                        className="border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>السعر (ريال)</Label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="500000"
                        className="border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <Label>عدد الغرف</Label>
                      <Input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        placeholder="3"
                        className="border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <Label>عدد الحمامات</Label>
                      <Input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        placeholder="2"
                        className="border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="أضف وصف للعقار..."
                      className="border-[#D4AF37] min-h-[100px]"
                    />
                  </div>
                  
                  {/* 🆕 قسم رفع الصور والفيديو */}
                  <div className="space-y-3">
                    <Label className="text-lg flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      صور وفيديو العقار
                    </Label>
                    
                    {/* زر رفع الصور */}
                    <div>
                      <Label>الصور</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            setUploadingMedia(true);
                            
                            try {
                              // تحويل الصور إلى Base64
                              const base64Images = await Promise.all(
                                files.map(file => {
                                  return new Promise<string>((resolve) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => resolve(reader.result as string);
                                    reader.readAsDataURL(file);
                                  });
                                })
                              );
                              
                              setImages(prev => [...prev, ...base64Images]);
                              setUploadingMedia(false);
                              toast.success(`✅ تم رفع ${files.length} صورة`);
                              console.log('📸 [OfferFormPublic] تم رفع الصور بالحجم الكامل');
                            } catch (error) {
                              console.error('❌ [OfferFormPublic] خطأ في رفع الصور:', error);
                              toast.error('فشل رفع الصور');
                              setUploadingMedia(false);
                            }
                          }
                        }}
                        className="border-[#D4AF37]"
                      />
                      {uploadingMedia && (
                        <p className="text-sm text-gray-500 mt-1">جاري رفع الصور...</p>
                      )}
                    </div>
                    
                    {/* عرض الصور المرفوعة */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img 
                              src={img} 
                              alt={`صورة ${idx + 1}`} 
                              className="w-full h-24 object-cover rounded-lg border-2 border-[#D4AF37]"
                            />
                            <button
                              type="button"
                              onClick={() => setImages(images.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* زر رفع الفيديو */}
                    <div>
                      <Label>فيديو (اختياري)</Label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingMedia(true);
                            
                            try {
                              // تحويل الفيديو إلى Base64
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setVideos([reader.result as string]);
                                setUploadingMedia(false);
                                toast.success('✅ تم رفع الفيديو');
                                console.log('🎥 [OfferFormPublic] تم رفع الفيديو بالحجم الكامل');
                              };
                              reader.readAsDataURL(file);
                            } catch (error) {
                              console.error('❌ [OfferFormPublic] خطأ في رفع الفيديو:', error);
                              toast.error('فشل رفع الفيديو');
                              setUploadingMedia(false);
                            }
                          }
                        }}
                        className="border-[#D4AF37]"
                      />
                      <p className="text-xs text-gray-500 mt-1">فيديو واحد (اختياري)</p>
                    </div>
                    
                    {/* عرض الفيديو المرفوع */}
                    {videos.length > 0 && (
                      <div className="space-y-2">
                        {videos.map((video, idx) => (
                          <div key={idx} className="relative group">
                            <video 
                              src={video} 
                              controls 
                              className="w-full max-h-48 rounded-lg border-2 border-[#D4AF37]"
                            />
                            <button
                              type="button"
                              onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {uploadingMedia && (
                      <p className="text-sm text-blue-600 animate-pulse">جاري رفع الملفات...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* الأزرار */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* زر إرسال العرض */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 bg-gradient-to-r from-[#01411C] to-[#065f41] hover:from-[#065f41] hover:to-[#01411C] text-white text-lg"
                >
                  {isSubmitting ? (
                    <>جاري الإرسال...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      إرسال العرض
                    </>
                  )}
                </Button>

                {/* زر حفظ vCard */}
                <Button
                  type="button"
                  onClick={() => {
                    if (!fullName || !phone) {
                      toast.error('يرجى إدخال الاسم ورقم الجوال أولاً');
                      return;
                    }
                    downloadVCard({
                      name: fullName,
                      phone: phone,
                      email: '',
                      company: '',
                      jobTitle: 'مالك عقار',
                      website1: '',
                      website2: '',
                      whatsapp: phone
                    }, fullName);
                    toast.success('✅ تم تحميل بطاقة الاتصال!');
                  }}
                  className="h-14 bg-purple-500 hover:bg-purple-600 text-white text-lg"
                >
                  <Download className="w-5 h-5 ml-2" />
                  حفظ بطاقة الاتصال
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}