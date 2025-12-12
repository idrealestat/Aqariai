/**
 * واجهة تقرير الذكاء المكاني الجانبية
 * تعرض نتائج التحليل المكاني للموقع المحدد
 */

import React from 'react';
import { X, Star, Bot, Building, MapPin, AlertCircle, Check, Sparkles, Waves, Flame, GraduationCap, Dumbbell } from 'lucide-react';
import { Badge } from './ui/badge';
import type { SpatialAnalysisOutput } from '../utils/spatialIntelligence';
import { amenityLabels } from './map/amenitiesData';
import { severityLabels } from './map/floodZonesData';
import { AMENITY_TYPES } from '../utils/overpassAPI';

interface SpatialIntelligenceReportProps {
  report: SpatialAnalysisOutput;
  onClose: () => void;
}

export function SpatialIntelligenceReport({ report, onClose }: SpatialIntelligenceReportProps) {
  return (
    <div 
      className="absolute top-0 left-0 bottom-0 w-96 bg-white shadow-2xl overflow-y-auto border-l-4 border-blue-500"
      style={{ zIndex: 2000, pointerEvents: 'auto' }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold">تقرير الذكاء المكاني</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded p-1 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* درجة الجاذبية */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-700">درجة الجاذبية العقارية</span>
          </div>
          <div className="text-center mb-2">
            <div className="text-4xl font-bold text-green-600">{report.attractiveness_score}</div>
            <div className="text-sm text-gray-500">من 100</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all ${
                report.attractiveness_score >= 70 ? 'bg-green-500' :
                report.attractiveness_score >= 45 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${report.attractiveness_score}%` }}
            />
          </div>
          <div className="mt-2 text-sm font-medium text-gray-700 text-center">
            {report.suggested_use}
          </div>
        </div>
        
        {/* تعليق الذكاء الاصطناعي */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-700">تعليق سوني</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{report.ai_comment}</p>
        </div>
        
        {/* السياق العمراني */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-5 h-5 text-gray-600" />
            <span className="font-bold text-gray-700">السياق العمراني</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">الكثافة:</span>
              <Badge variant={
                report.spatial_context.density.category === 'high' ? 'destructive' :
                report.spatial_context.density.category === 'medium' ? 'default' : 'secondary'
              }>
                {report.spatial_context.density.category === 'high' ? 'عالية' :
                 report.spatial_context.density.category === 'medium' ? 'متوسطة' : 'منخفضة'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المباني ضمن 500م:</span>
              <span className="font-bold text-gray-700">{report.spatial_context.density.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">شكل المبنى:</span>
              <span className="font-medium text-gray-700">
                {report.spatial_context.shape.shape === 'compact' ? 'مدمج' :
                 report.spatial_context.shape.shape === 'regular' ? 'منتظم' :
                 report.spatial_context.shape.shape === 'irregular' ? 'غير منتظم' : 'غير محدد'}
              </span>
            </div>
            {report.spatial_context.shape.area_m2 && (
              <div className="flex justify-between">
                <span className="text-gray-600">المساحة:</span>
                <span className="font-bold text-gray-700">{report.spatial_context.shape.area_m2.toLocaleString()} م²</span>
              </div>
            )}
          </div>
        </div>
        
        {/* قرب الخدمات */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-gray-700">قرب الخدمات</span>
          </div>
          
          {/* الخدمات الديناميكية (Overpass API) */}
          {report.dynamicAmenities && report.dynamicAmenities.length > 0 ? (
            <div className="space-y-3">
              {/* إحصائيات سريعة */}
              {report.amenitiesStats && (
                <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
                  <div className="text-xs font-bold text-blue-700 mb-2">📊 ملخص الخدمات</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-lg text-blue-600">{report.amenitiesStats.total}</div>
                      <div className="text-gray-600">إجمالي</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-green-600">{report.amenitiesStats.within500m}</div>
                      <div className="text-gray-600">ضمن 500م</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-purple-600">{report.amenitiesStats.within1km}</div>
                      <div className="text-gray-600">ضمن 1كم</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* الخدمات الأساسية */}
              {report.essentialServices && (
                <div className="bg-green-50 rounded-lg p-3 mb-3 border border-green-200">
                  <div className="text-xs font-bold text-green-700 mb-2">✅ الخدمات الأساسية (ضمن 1 كم)</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">المجموع:</span>
                      <Badge variant={report.essentialServices.score >= 4 ? 'default' : 'secondary'}>
                        {report.essentialServices.score} من 5
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className={`flex items-center gap-1 ${report.essentialServices.hasMosque ? 'text-green-600' : 'text-gray-400'}`}>
                        {report.essentialServices.hasMosque ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>مسجد</span>
                      </div>
                      <div className={`flex items-center gap-1 ${report.essentialServices.hasSchool ? 'text-green-600' : 'text-gray-400'}`}>
                        {report.essentialServices.hasSchool ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>مدرسة</span>
                      </div>
                      <div className={`flex items-center gap-1 ${report.essentialServices.hasHospitalOrClinic ? 'text-green-600' : 'text-gray-400'}`}>
                        {report.essentialServices.hasHospitalOrClinic ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>مستشفى</span>
                      </div>
                      <div className={`flex items-center gap-1 ${report.essentialServices.hasSupermarket ? 'text-green-600' : 'text-gray-400'}`}>
                        {report.essentialServices.hasSupermarket ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>سوبرماركت</span>
                      </div>
                      <div className={`flex items-center gap-1 ${report.essentialServices.hasFuel ? 'text-green-600' : 'text-gray-400'}`}>
                        {report.essentialServices.hasFuel ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>وقود</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* قائمة الخدمات حسب النوع */}
              {Object.keys(AMENITY_TYPES).map((category) => {
                const amenitiesOfType = report.dynamicAmenities!.filter(a => a.category === category);
                if (amenitiesOfType.length === 0) return null;
                
                const config = AMENITY_TYPES[category as keyof typeof AMENITY_TYPES];
                const closest = amenitiesOfType[0]; // أقرب واحد
                
                return (
                  <div key={category} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{config.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-700 text-sm">{config.label}</div>
                        <div className="text-xs text-gray-500">{closest.name}</div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-700 text-sm">
                          {closest.distance_m < 1000 
                            ? `${closest.distance_m} م` 
                            : `${(closest.distance_m / 1000).toFixed(1)} كم`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(closest.distance_m / 83.33)} د مشي
                        </div>
                      </div>
                    </div>
                    
                    {/* عرض أقرب 3 إذا كان هناك أكثر من 1 */}
                    {amenitiesOfType.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">
                          أقرب {Math.min(3, amenitiesOfType.length)} خدمات:
                        </div>
                        <div className="space-y-1">
                          {amenitiesOfType.slice(0, 3).map((amenity, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate flex-1">{amenity.name}</span>
                              <span className="text-gray-500 ml-2">
                                {amenity.distance_m < 1000 
                                  ? `${amenity.distance_m} م` 
                                  : `${(amenity.distance_m / 1000).toFixed(1)} كم`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // عرض البيانات الثابتة إذا لم يكن هناك بحث ديناميكي
            <div className="space-y-2 text-sm">
              {Object.entries(report.proximity).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-700">{amenityLabels[key as keyof typeof amenityLabels]}</div>
                      <div className="text-xs text-gray-500">{value.name}</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-700">{(value.distance_m / 1000).toFixed(2)} كم</div>
                      <div className="text-xs text-gray-500">{value.walk_min} د مشي</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* تقييم المخاطر */}
        <div className={`rounded-lg p-4 border-2 ${
          report.risk.flood === 'high' ? 'bg-red-50 border-red-300' :
          report.risk.flood === 'medium' ? 'bg-yellow-50 border-yellow-300' :
          'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className={`w-5 h-5 ${
              report.risk.flood === 'high' ? 'text-red-600' :
              report.risk.flood === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <span className="font-bold text-gray-700">تقييم المخاطر</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">مخاطر السيول:</span>
              <Badge variant={
                report.risk.flood === 'high' ? 'destructive' :
                report.risk.flood === 'medium' ? 'default' : 'secondary'
              }>
                {severityLabels[report.risk.flood]}
              </Badge>
            </div>
            {report.risk.description && (
              <p className="text-gray-600 leading-relaxed">{report.risk.description}</p>
            )}
          </div>
        </div>
        
        {/* الموقع المستخدم */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div>الإحداثيات: {report.location.used.lat.toFixed(6)}, {report.location.used.lng.toFixed(6)}</div>
            <div className="flex items-center gap-1">
              {report.location.snappedToBuilding ? (
                <>
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">مربوط بمبنى</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-gray-600" />
                  <span>موقع حر</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}