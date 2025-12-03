/**
 * 📄 صفحة تفاصيل العرض الكاملة
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: عرض جميع تفاصيل العرض مع الصور/فيديو وعروض الوسطاء
 * 📌 التصميم: صفحة كاملة + شريط منزلق + عروض الوسطاء
 * ────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ArrowRight, MapPin, DollarSign, User, Phone, Star, Award,
  Check, X, Image as ImageIcon, Video, Calendar, AlertCircle,
  FileText, Home, Building2, MapPinned, Hash, Ruler, BedDouble,
  Bath, Car, Layers, Grid3x3, Wind, Droplets, Zap, TreePine,
  Baby, Warehouse, Sofa, ChefHat, Shield, Link as LinkIcon, ChevronDown
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OfferDetailsPageProps {
  offer: any;
  onBack: () => void;
  onAcceptBroker: (responseId: string, offerId: string) => void;
  onRejectBroker: (responseId: string) => void;
}

export function OfferDetailsPage({
  offer,
  onBack,
  onAcceptBroker,
  onRejectBroker
}: OfferDetailsPageProps) {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // تحميل الصور والفيديو من IndexedDB
  useEffect(() => {
    const loadMediaFromIndexedDB = async () => {
      if (!offer.mediaIds || offer.mediaIds.length === 0) {
        setImages([]);
        setVideos([]);
        return;
      }

      setIsLoadingMedia(true);
      try {
        const { loadMediaFromIndexedDB } = await import('../../utils/indexedDBStorage');
        const mediaFiles = await loadMediaFromIndexedDB(offer.mediaIds);

        const loadedImages: string[] = [];
        const loadedVideos: string[] = [];

        mediaFiles.forEach((media) => {
          if (media.type === 'image') {
            loadedImages.push(media.dataUrl);
          } else if (media.type === 'video') {
            loadedVideos.push(media.dataUrl);
          }
        });

        setImages(loadedImages);
        setVideos(loadedVideos);
        console.log(`✅ [OfferDetailsPage] تم تحميل ${loadedImages.length} صورة و ${loadedVideos.length} فيديو`);
      } catch (error) {
        console.error('❌ خطأ في تحميل الميديا:', error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    loadMediaFromIndexedDB();
  }, [offer.mediaIds]);

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-[#D4AF37] to-[#f1c40f]';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'bronze': return 'bg-gradient-to-r from-[#CD7F32] to-[#B87333]';
      default: return 'bg-gray-500';
    }
  };

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'platinum': return 'بلاتيني';
      case 'gold': return 'ذهبي';
      case 'silver': return 'فضي';
      case 'bronze': return 'برونزي';
      default: return '';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto" dir="rtl">
      {/* Header مع زر العودة */}
      <div className="bg-white border-b-2 border-[#D4AF37] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#01411C] hover:text-[#D4AF37] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="font-bold">عودة</span>
            </button>
            <div className="flex-1">
              <h1 className="text-[#01411C] text-lg sm:text-xl font-bold">{offer.title}</h1>
              <p className="text-gray-600 text-sm">{offer.propertyType} - {offer.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* الشريط المنزلق - التفاصيل الكاملة */}
        <Card className="mb-6 border-2 border-[#01411C]/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#01411C] to-[#01411C]/80 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-bold">تفاصيل العرض الكاملة</h2>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* الصور والفيديو */}
            {isLoadingMedia ? (
              <div className="mb-6 text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01411C] mx-auto"></div>
                <p className="text-gray-500 mt-4">جاري تحميل الوسائط...</p>
              </div>
            ) : (
              <>
                {/* الصور */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                      <ImageIcon className="w-5 h-5" />
                      الصور ({images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#01411C] hover:shadow-lg transition-all transform hover:scale-105"
                          onClick={() => setSelectedImage(idx)}
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`صورة ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
                              <ImageIcon className="w-5 h-5 text-[#01411C]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الفيديو */}
                {videos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                      <Video className="w-5 h-5" />
                      الفيديو ({videos.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {videos.map((vid, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#01411C] hover:shadow-lg transition-all transform hover:scale-105 bg-black"
                          onClick={() => setSelectedVideo(idx)}
                        >
                          <video
                            src={vid}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-all flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3">
                              <Video className="w-6 h-6 text-[#01411C]" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                            فيديو
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* المعلومات الأساسية */}
            <div className="mb-6">
              <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                <Home className="w-5 h-5" />
                المعلومات الأساسية
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoCard icon={<Home />} label="نوع العقار" value={offer.propertyType} />
                <InfoCard icon={<DollarSign />} label="نوع المعاملة" value={offer.type === 'sale' ? 'بيع' : 'إيجار'} />
                <InfoCard icon={<Ruler />} label="المساحة" value={`${offer.area} م²`} />
                <InfoCard icon={<DollarSign />} label="السعر" value={formatPrice(offer.price)} />
                {offer.bedrooms !== undefined && offer.bedrooms > 0 && <InfoCard icon={<BedDouble />} label="غرف النوم" value={offer.bedrooms} />}
                {offer.bathrooms !== undefined && offer.bathrooms > 0 && <InfoCard icon={<Bath />} label="دورات المياه" value={offer.bathrooms} />}
                {offer.storageRooms !== undefined && offer.storageRooms > 0 && <InfoCard icon={<Warehouse />} label="غرف التخزين" value={offer.storageRooms} />}
                {offer.balconies !== undefined && offer.balconies > 0 && <InfoCard icon={<Grid3x3 />} label="الشرفات" value={offer.balconies} />}
                {offer.parkingSpaces !== undefined && offer.parkingSpaces > 0 && <InfoCard icon={<Car />} label="مواقف السيارات" value={offer.parkingSpaces} />}
                {offer.floors !== undefined && offer.floors > 0 && <InfoCard icon={<Layers />} label="عدد الطوابق" value={offer.floors} />}
                {offer.airConditioners !== undefined && offer.airConditioners > 0 && <InfoCard icon={<Wind />} label="المكيفات" value={offer.airConditioners} />}
                {offer.curtains !== undefined && offer.curtains > 0 && <InfoCard icon={<Grid3x3 />} label="الستائر" value={offer.curtains} />}
              </div>
            </div>

            {/* الموقع الكامل */}
            <div className="mb-6">
              <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                <MapPin className="w-5 h-5" />
                الموقع
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoCard icon={<MapPinned />} label="المدينة" value={offer.city} />
                <InfoCard icon={<MapPinned />} label="الحي" value={offer.district} />
                {offer.street && <InfoCard icon={<MapPinned />} label="الشارع" value={offer.street} />}
                {offer.building && <InfoCard icon={<Building2 />} label="المبنى" value={offer.building} />}
                {offer.postalCode && <InfoCard icon={<Hash />} label="الرمز البريدي" value={offer.postalCode} />}
              </div>
            </div>

            {/* المواصفات الإضافية */}
            {(offer.entrances || offer.position || offer.level) && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <Grid3x3 className="w-5 h-5" />
                  المواصفات الإضافية
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {offer.entrances && <InfoCard label="المداخل" value={offer.entrances} />}
                  {offer.position && <InfoCard label="الموضع" value={offer.position} />}
                  {offer.level && <InfoCard label="الدور" value={offer.level} />}
                </div>
              </div>
            )}

            {/* الصك */}
            {(offer.deedNumber || offer.deedDate) && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <FileText className="w-5 h-5" />
                  بيانات الصك
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {offer.deedNumber && <InfoCard icon={<Hash />} label="رقم الصك" value={offer.deedNumber} />}
                  {offer.deedDate && <InfoCard icon={<Calendar />} label="تاريخ الصك" value={offer.deedDate} />}
                </div>
              </div>
            )}

            {/* أسعار الإيجار */}
            {offer.type === 'rent' && (offer.rentSingle || offer.rentTwo || offer.rentFour || offer.rentMonthly) && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <DollarSign className="w-5 h-5" />
                  خيارات الدفع
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {offer.rentSingle && <InfoCard label="دفعة واحدة" value={formatPrice(offer.rentSingle)} />}
                  {offer.rentTwo && <InfoCard label="دفعتين" value={formatPrice(offer.rentTwo)} />}
                  {offer.rentFour && <InfoCard label="4 دفعات" value={formatPrice(offer.rentFour)} />}
                  {offer.rentMonthly && <InfoCard label="شهري" value={formatPrice(offer.rentMonthly)} />}
                </div>
              </div>
            )}

            {/* الخصائص المنطقية */}
            {hasAnyBooleanFeature(offer) && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <Star className="w-5 h-5" />
                  المميزات
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {offer.hasPool && <FeatureBadge icon={<Droplets />} label="مسبح" />}
                  {offer.hasGarden && <FeatureBadge icon={<TreePine />} label="حديقة" />}
                  {offer.hasPlayground && <FeatureBadge icon={<Baby />} label="ملعب" />}
                  {offer.hasElevator && <FeatureBadge label="مصعد" />}
                  {offer.hasMaidRoom && <FeatureBadge label="غرفة خادمة" />}
                  {offer.hasLaundryRoom && <FeatureBadge label="غرفة غسيل" />}
                  {offer.hasAnnex && <FeatureBadge label="ملحق" />}
                  {offer.hasJacuzzi && <FeatureBadge label="جاكوزي" />}
                  {offer.hasRainShower && <FeatureBadge label="دش مطري" />}
                  {offer.isSmartHome && <FeatureBadge icon={<Zap />} label="منزل ذكي" />}
                  {offer.hasSmartEntry && <FeatureBadge icon={<Zap />} label="مدخل ذكي" />}
                  {offer.hasExternalMajlis && <FeatureBadge label="مجلس خارجي" />}
                  {offer.hasPrivateRoof && <FeatureBadge label="سطح خاص" />}
                  {offer.isFurnished && <FeatureBadge icon={<Sofa />} label="مفروش" />}
                  {offer.hasBuiltInKitchen && <FeatureBadge icon={<ChefHat />} label="مطبخ مجهز" />}
                </div>
              </div>
            )}

            {/* أجهزة المطبخ */}
            {offer.selectedAppliances && offer.selectedAppliances.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <ChefHat className="w-5 h-5" />
                  أجهزة المطبخ
                </h4>
                <div className="flex flex-wrap gap-2">
                  {offer.selectedAppliances.map((appliance: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="border-[#01411C] text-[#01411C] px-3 py-1">
                      {appliance}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* الميزات المخصصة */}
            {offer.customFeatures && offer.customFeatures.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <Star className="w-5 h-5" />
                  مميزات إضافية
                </h4>
                <div className="flex flex-wrap gap-2">
                  {offer.customFeatures.map((feature: string, idx: number) => (
                    <Badge key={idx} className="bg-[#D4AF37] text-white px-3 py-1">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* الضمانات */}
            {offer.guarantees && offer.guarantees.length > 0 && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <Shield className="w-5 h-5" />
                  الضمانات
                </h4>
                <div className="space-y-3">
                  {offer.guarantees.map((guarantee: any, idx: number) => (
                    <Card key={idx} className="border-[#01411C]/20">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-gray-600 text-sm">النوع</p>
                            <p className="text-[#01411C] font-bold">{guarantee.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">المدة</p>
                            <p className="text-[#01411C] font-bold">{guarantee.duration}</p>
                          </div>
                          <div className="md:col-span-1">
                            <p className="text-gray-600 text-sm">ملاحظات</p>
                            <p className="text-[#01411C]">{guarantee.notes || '-'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* الوصف */}
            {offer.description && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <FileText className="w-5 h-5" />
                  الوصف
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{offer.description}</p>
                </div>
              </div>
            )}

            {/* الجولة الافتراضية */}
            {offer.virtualTourLink && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                  <LinkIcon className="w-5 h-5" />
                  الجولة الافتراضية
                </h4>
                <a
                  href={offer.virtualTourLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#01411C] text-white px-4 py-2 rounded-lg hover:bg-[#01411C]/90 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  افتح الجولة الافتراضية
                </a>
              </div>
            )}

            {/* معلومات المالك */}
            <div className="mb-6 bg-[#01411C]/5 p-4 rounded-lg border border-[#01411C]/10">
              <h4 className="flex items-center gap-2 mb-4 text-[#01411C] font-bold">
                <User className="w-5 h-5" />
                معلومات المالك
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">الاسم</p>
                  <p className="text-[#01411C] font-bold">{offer.ownerName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">رقم الهاتف</p>
                  <p className="text-[#01411C] font-bold">{offer.ownerPhone}</p>
                </div>
                {offer.ownerNationalId && (
                  <div>
                    <p className="text-gray-600 text-sm">الهوية الوطنية</p>
                    <p className="text-[#01411C] font-bold">{offer.ownerNationalId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* تاريخ الإنشاء */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              تم الإنشاء: {new Date(offer.createdAt).toLocaleDateString('ar-SA')}
            </div>
          </div>
        </Card>

        {/* عروض الوسطاء */}
        <Card className="border-2 border-[#01411C]/20">
          <div className="bg-gradient-to-r from-[#01411C] to-[#01411C]/80 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6" />
                <h2 className="text-xl font-bold">عروض الوسطاء ({(offer.responses || offer.brokerResponses || []).length})</h2>
              </div>
              {offer.acceptedBrokers > 0 && (
                <Badge className="bg-green-500 text-white">
                  {offer.acceptedBrokers} مقبول
                </Badge>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* تحذير إذا بلغ الحد الأقصى */}
            {offer.acceptedBrokers >= 10 && (
              <div className="mb-4 bg-red-100 border-2 border-red-500 text-red-900 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 font-bold">تم إغلاق العرض</p>
                  <p className="text-red-700 text-sm mt-1">
                    لقد بلغت 10 وسطاء. لن يتمكن وسطاء آخرون من إرسال عروض جديدة.
                  </p>
                </div>
              </div>
            )}

            {!(offer.responses || offer.brokerResponses) || (offer.responses || offer.brokerResponses || []).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>لا توجد عروض من الوسطاء حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(offer.responses || offer.brokerResponses || []).map((response: any) => (
                  <Card
                    key={response.id}
                    className={`border-2 ${
                      response.status === 'accepted'
                        ? 'border-green-500 bg-green-50'
                        : response.status === 'rejected'
                        ? 'border-red-300 bg-gray-50 opacity-60'
                        : 'border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#01411C] to-[#01411C]/70 rounded-full flex items-center justify-center text-white font-bold">
                            {response.brokerName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#01411C]">{response.brokerName}</h4>
                              {response.brokerBadge && (
                                <Badge className={`${getBadgeColor(response.brokerBadge)} text-white text-xs`}>
                                  <Award className="w-3 h-3 ml-1" />
                                  {getBadgeLabel(response.brokerBadge)}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {response.brokerPhone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {response.brokerRating.toFixed(1)}
                              </span>
                            </div>
                            {response.brokerLicense && (
                              <p className="text-xs text-gray-500 mt-1">
                                رخصة: {response.brokerLicense}
                              </p>
                            )}
                          </div>
                        </div>

                        {response.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => onAcceptBroker(response.id, offer.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={offer.acceptedBrokers >= 10}
                            >
                              <Check className="w-4 h-4 ml-1" />
                              قبول
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRejectBroker(response.id)}
                              className="border-red-500 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 ml-1" />
                              رفض
                            </Button>
                          </div>
                        )}

                        {response.status === 'accepted' && (
                          <Badge className="bg-green-500 text-white">
                            <Check className="w-3 h-3 ml-1" />
                            مقبول
                          </Badge>
                        )}

                        {response.status === 'rejected' && (
                          <Badge variant="outline" className="border-red-500 text-red-600">
                            <X className="w-3 h-3 ml-1" />
                            مرفوض
                          </Badge>
                        )}
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-gray-700">{response.serviceDescription}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-[#01411C] font-bold">
                          <DollarSign className="w-4 h-4" />
                          العمولة: {response.commissionPercentage}%
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(response.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* عرض الصورة بحجم كامل */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <ImageWithFallback
            src={images[selectedImage]}
            alt={`صورة ${selectedImage + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-[#01411C] font-bold">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      {/* عرض الفيديو بحجم كامل */}
      {selectedVideo !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <video
            src={videos[selectedVideo]}
            className="max-w-full max-h-full object-contain rounded-lg"
            controls
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-[#01411C] font-bold">
            {selectedVideo + 1} / {videos.length}
          </div>
        </div>
      )}
    </div>
  );
}

// مكون بطاقة معلومة
function InfoCard({ icon, label, value }: { icon?: React.ReactNode; label: string; value: any }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      {icon && <div className="text-[#01411C] mb-2">{icon}</div>}
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-[#01411C] font-bold">{value}</p>
    </div>
  );
}

// مكون بطاقة ميزة
function FeatureBadge({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-[#01411C]/10 text-[#01411C] px-3 py-2 rounded-lg border border-[#01411C]/20">
      {icon && <div className="w-4 h-4">{icon}</div>}
      <span className="text-sm font-medium">{label}</span>
      <Check className="w-4 h-4 text-green-600 mr-auto" />
    </div>
  );
}

// دالة مساعدة للتحقق من وجود أي ميزة منطقية
function hasAnyBooleanFeature(offer: any) {
  return (
    offer.hasPool ||
    offer.hasGarden ||
    offer.hasPlayground ||
    offer.hasElevator ||
    offer.hasMaidRoom ||
    offer.hasLaundryRoom ||
    offer.hasAnnex ||
    offer.hasJacuzzi ||
    offer.hasRainShower ||
    offer.isSmartHome ||
    offer.hasSmartEntry ||
    offer.hasExternalMajlis ||
    offer.hasPrivateRoof ||
    offer.isFurnished ||
    offer.hasBuiltInKitchen
  );
}