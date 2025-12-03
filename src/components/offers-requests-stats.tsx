"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Home, 
  Users, 
  Eye,
  Calendar,
  DollarSign,
  Building2,
  MapPin,
  Star,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { OffersRequestsBottomNav } from "./offers-requests-bottom-nav";

interface OffersRequestsStatsProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export function OffersRequestsStats({ onBack, onNavigate }: OffersRequestsStatsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today");

  // بيانات وهمية للإحصائيات
  const marketStats = {
    totalOffers: 1247,
    todayOffers: 23,
    avgPrice: "850,000",
    trending: "+12%",
    totalViews: "15,420",
    activeUsers: "2,847",
    completedDeals: "156",
    avgResponseTime: "2.3 ساعة"
  };

  const personalStats = {
    myOffers: 0,
    totalViews: 0,
    inquiries: 0,
    completedDeals: 0,
    averagePrice: "0",
    topLocation: "غير محدد"
  };

  const topLocations = [
    { name: "الرياض - حي النرجس", offers: 145, growth: "+18%" },
    { name: "جدة - الصفا", offers: 98, growth: "+12%" },
    { name: "الدمام - الفردوس", offers: 76, growth: "+8%" },
    { name: "الرياض - المروج", offers: 65, growth: "+15%" },
    { name: "جدة - أبحر الشمالية", offers: 54, growth: "+5%" }
  ];

  const priceRanges = [
    { range: "أقل من 500,000", count: 234, percentage: 35 },
    { range: "500,000 - 1,000,000", count: 189, percentage: 28 },
    { range: "1,000,000 - 2,000,000", count: 145, percentage: 22 },
    { range: "أكثر من 2,000,000", count: 98, percentage: 15 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" dir="rtl">
      {/* الهيدر */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">الإحصائيات والتحليلات</h1>
              <p className="text-sm text-gray-500">تحليل شامل للسوق العقاري</p>
            </div>

            <div className="flex gap-1">
              {(["today", "week", "month"] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="text-xs"
                >
                  {period === "today" ? "اليوم" : period === "week" ? "الأسبوع" : "الشهر"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* إحصائيات السوق العامة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                إحصائيات السوق العامة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div 
                  className="text-center p-4 bg-blue-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{marketStats.totalOffers}</div>
                  <div className="text-sm text-gray-600">إجمالي العروض</div>
                  <Badge className="mt-1 bg-green-500 text-white text-xs">نشط</Badge>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-green-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{marketStats.todayOffers}</div>
                  <div className="text-sm text-gray-600">عروض اليوم</div>
                  <Badge className="mt-1 bg-green-500 text-white text-xs">جديد</Badge>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-purple-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{marketStats.avgPrice}</div>
                  <div className="text-sm text-gray-600">متوسط السعر (ريال)</div>
                  <Badge className="mt-1 bg-purple-500 text-white text-xs">محدث</Badge>
                </motion.div>
                
                <motion.div 
                  className="text-center p-4 bg-orange-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{marketStats.trending}</div>
                  <div className="text-sm text-gray-600">نمو السوق</div>
                  <Badge className="mt-1 bg-orange-500 text-white text-xs">صاعد</Badge>
                </motion.div>
              </div>

              {/* إحصائيات إضافية */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-700">{marketStats.totalViews}</div>
                  <div className="text-xs text-gray-500">إجمالي المشاهدات</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-700">{marketStats.activeUsers}</div>
                  <div className="text-xs text-gray-500">المستخدمون النشطون</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-700">{marketStats.completedDeals}</div>
                  <div className="text-xs text-gray-500">صفقات مكتملة</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-700">{marketStats.avgResponseTime}</div>
                  <div className="text-xs text-gray-500">متوسط الاستجابة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* إحصائياتك الشخصية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Users className="w-5 h-5" />
                إحصائياتك الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{personalStats.myOffers}</div>
                  <div className="text-sm text-gray-600">عروضك النشطة</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{personalStats.totalViews}</div>
                  <div className="text-sm text-gray-600">مشاهدات العروض</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{personalStats.inquiries}</div>
                  <div className="text-sm text-gray-600">استفسارات واردة</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{personalStats.completedDeals}</div>
                  <div className="text-sm text-gray-600">عروض مكتملة</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{personalStats.averagePrice}</div>
                  <div className="text-sm text-gray-600">متوسط أسعارك</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">{personalStats.topLocation}</div>
                  <div className="text-sm text-gray-600">موقعك الأكثر نشاطاً</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm text-yellow-700">
                  💡 <strong>نصيحة:</strong> أضف عقارك الأول لتبدأ في جمع الإحصائيات والاستفسارات
                </p>
                <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white" size="sm">
                  أضف عقار الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* أهم المواقع */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                أهم المواقع النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLocations.map((location, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.offers} عرض نشط</div>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        location.growth.startsWith('+') 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {location.growth}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* تحليل الأسعار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-indigo-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-indigo-700 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                تحليل الأسعار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceRanges.map((range, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{range.range} ريال</span>
                        <span className="text-sm text-gray-600">{range.count} عرض</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${range.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="mr-3">
                      {range.percentage}%
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* الشريط السفلي */}
      {onNavigate && (
        <OffersRequestsBottomNav 
          currentPage="offers-requests-stats"
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}