/**
 * 📄 صفحة تفاصيل الطلب الكاملة
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: عرض جميع تفاصيل الطلب مع عروض الوسطاء
 * 📌 التصميم: صفحة كاملة + الألوان الذهبية #D4AF37
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

interface RequestDetailsPageProps {
  request: any;
  onBack: () => void;
  onAcceptBroker: (responseId: string, requestId: string) => void;
  onRejectBroker: (responseId: string) => void;
}

export function RequestDetailsPage({
  request,
  onBack,
  onAcceptBroker,
  onRejectBroker
}: RequestDetailsPageProps) {
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
              className="flex items-center gap-2 text-[#D4AF37] hover:text-[#f1c40f] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="font-bold">عودة</span>
            </button>
            <div className="flex-1">
              <h1 className="text-[#D4AF37] text-lg sm:text-xl font-bold">{request.title}</h1>
              <p className="text-gray-600 text-sm">{request.propertyType} - {request.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* التفاصيل الكاملة */}
        <Card className="mb-6 border-2 border-[#D4AF37]/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-bold">تفاصيل الطلب الكاملة</h2>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* المعلومات الأساسية */}
            <div className="mb-6">
              <h4 className="flex items-center gap-2 mb-4 text-[#D4AF37] font-bold">
                <Home className="w-5 h-5" />
                المعلومات الأساسية
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InfoCard icon={<Home />} label="نوع العقار" value={request.propertyType} />
                <InfoCard icon={<DollarSign />} label="نوع المعاملة" value={request.type === 'buy' ? 'شراء' : 'إيجار'} />
                {request.area && <InfoCard icon={<Ruler />} label="المساحة المطلوبة" value={`${request.area} م²`} />}
                {request.budget && <InfoCard icon={<DollarSign />} label="الميزانية" value={formatPrice(request.budget)} />}
                {request.priceFrom && request.priceTo && (
                  <InfoCard 
                    icon={<DollarSign />} 
                    label="نطاق السعر" 
                    value={`${formatPrice(request.priceFrom)} - ${formatPrice(request.priceTo)}`} 
                  />
                )}
              </div>
            </div>

            {/* الموقع الكامل */}
            <div className="mb-6">
              <h4 className="flex items-center gap-2 mb-4 text-[#D4AF37] font-bold">
                <MapPin className="w-5 h-5" />
                الموقع المطلوب
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoCard icon={<MapPinned />} label="المدينة" value={request.city} />
                {request.districts && request.districts.length > 0 && (
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm mb-2">الأحياء المفضلة</p>
                    <div className="flex flex-wrap gap-2">
                      {request.districts.map((district: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                          {district}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* طريقة الدفع */}
            {request.paymentMethod && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#D4AF37] font-bold">
                  <DollarSign className="w-5 h-5" />
                  طريقة الدفع
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Badge className="bg-[#D4AF37] text-white px-4 py-2 text-base">
                    {request.paymentMethod}
                  </Badge>
                </div>
              </div>
            )}

            {/* درجة الأهمية */}
            {request.urgency && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#D4AF37] font-bold">
                  <AlertCircle className="w-5 h-5" />
                  درجة الأهمية
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Badge 
                    className={`${
                      request.urgency === 'مستعجل' 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                    } text-white px-4 py-2 text-base`}
                  >
                    {request.urgency === 'مستعجل' ? '🔴' : '🟢'} {request.urgency}
                  </Badge>
                </div>
              </div>
            )}

            {/* الوصف */}
            {request.description && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 mb-4 text-[#D4AF37] font-bold">
                  <FileText className="w-5 h-5" />
                  الوصف
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
                </div>
              </div>
            )}

            {/* معلومات صاحب الطلب */}
            <div className="mb-6 bg-[#D4AF37]/5 p-4 rounded-lg border border-[#D4AF37]/10">
              <h4 className="flex items-center gap-2 mb-4 text-[#D4AF37] font-bold">
                <User className="w-5 h-5" />
                معلومات صاحب الطلب
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {request.ownerFullName && (
                  <div>
                    <p className="text-gray-600 text-sm">الاسم الثلاثي</p>
                    <p className="text-[#D4AF37] font-bold">{request.ownerFullName}</p>
                  </div>
                )}
                {request.ownerNationalId && (
                  <div>
                    <p className="text-gray-600 text-sm">رقم الهوية</p>
                    <p className="text-[#D4AF37] font-bold">{request.ownerNationalId}</p>
                  </div>
                )}
                {request.ownerDob && (
                  <div>
                    <p className="text-gray-600 text-sm">تاريخ الميلاد</p>
                    <p className="text-[#D4AF37] font-bold">{new Date(request.ownerDob).toLocaleDateString('ar-SA')}</p>
                  </div>
                )}
                {request.ownerAddress && (
                  <div>
                    <p className="text-gray-600 text-sm">العنوان الحالي</p>
                    <p className="text-[#D4AF37] font-bold">{request.ownerAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-sm">رقم الهاتف</p>
                  <p className="text-[#D4AF37] font-bold">{request.ownerPhone}</p>
                </div>
              </div>
            </div>

            {/* تاريخ الإنشاء */}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              تم الإنشاء: {new Date(request.createdAt).toLocaleDateString('ar-SA')}
            </div>
          </div>
        </Card>

        {/* عروض الوسطاء */}
        <Card className="border-2 border-[#D4AF37]/20">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6" />
                <h2 className="text-xl font-bold">عروض الوسطاء ({(request.responses || request.brokerResponses || []).length})</h2>
              </div>
              {request.acceptedBrokers > 0 && (
                <Badge className="bg-green-500 text-white">
                  {request.acceptedBrokers} مقبول
                </Badge>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* تحذير إذا بلغ الحد الأقصى */}
            {request.acceptedBrokers >= 10 && (
              <div className="mb-4 bg-red-100 border-2 border-red-500 text-red-900 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 font-bold">تم إغلاق الطلب</p>
                  <p className="text-red-700 text-sm mt-1">
                    لقد بلغت 10 وسطاء. لن يتمكن وسطاء آخرون من إرسال عروض جديدة.
                  </p>
                </div>
              </div>
            )}

            {!(request.responses || request.brokerResponses) || (request.responses || request.brokerResponses || []).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>لا توجد عروض من الوسطاء حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(request.responses || request.brokerResponses || []).map((response: any) => (
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
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center text-white font-bold">
                            {response.brokerName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#D4AF37]">{response.brokerName}</h4>
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
                              onClick={() => onAcceptBroker(response.id, request.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={request.acceptedBrokers >= 10}
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
                        <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
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
    </div>
  );
}

// مكون بطاقة معلومة
function InfoCard({ icon, label, value }: { icon?: React.ReactNode; label: string; value: any }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      {icon && <div className="text-[#D4AF37] mb-2">{icon}</div>}
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-[#D4AF37] font-bold">{value}</p>
    </div>
  );
}