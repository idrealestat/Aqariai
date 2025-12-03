// ملف: components/share/ShareAnalytics.tsx
// إحصائيات المشاركة التفصيلية

'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointer, Share2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ShareAnalyticsProps {
  offerId: string;
}

interface AnalyticsData {
  totalShares: number;
  totalViews: number;
  totalClicks: number;
  conversionRate: number;
  byPlatform: Record<string, number>;
  timeline: Array<{ date: string; count: number }>;
}

export function ShareAnalytics({ offerId }: ShareAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [offerId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/share/analytics/${offerId}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01411C]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 py-12">
        لا توجد إحصائيات متاحة حالياً
      </div>
    );
  }

  const platformColors: Record<string, string> = {
    WHATSAPP: 'bg-green-500',
    WHATSAPP_BUSINESS: 'bg-green-600',
    EMAIL: 'bg-blue-500',
    SMS: 'bg-purple-500',
    FACEBOOK: 'bg-blue-600',
    TELEGRAM: 'bg-blue-400',
    DIRECT_LINK: 'bg-gray-600',
    PDF: 'bg-red-500',
    QR_CODE: 'bg-orange-500',
  };

  const platformNames: Record<string, string> = {
    WHATSAPP: 'واتساب',
    WHATSAPP_BUSINESS: 'واتساب أعمال',
    EMAIL: 'بريد إلكتروني',
    SMS: 'رسائل نصية',
    FACEBOOK: 'فيسبوك',
    TELEGRAM: 'تيليجرام',
    DIRECT_LINK: 'رابط مباشر',
    PDF: 'PDF',
    QR_CODE: 'QR Code',
  };

  return (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              إجمالي المشاركات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-[#01411C]">
                {data.totalShares}
              </span>
              <Share2 className="w-8 h-8 text-[#01411C]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              إجمالي المشاهدات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">
                {data.totalViews}
              </span>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              إجمالي النقرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-purple-600">
                {data.totalClicks}
              </span>
              <MousePointer className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              معدل التحويل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">
                {data.conversionRate.toFixed(1)}%
              </span>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المشاركات حسب المنصة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            المشاركات حسب المنصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.byPlatform).map(([platform, count]) => {
              const percentage = (count / data.totalShares) * 100;
              return (
                <div key={platform} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {platformNames[platform] || platform}
                    </span>
                    <span className="text-gray-600">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        platformColors[platform] || 'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أفضل منصة</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(data.byPlatform).length > 0 ? (
              <>
                {(() => {
                  const topPlatform = Object.entries(data.byPlatform).sort(
                    (a, b) => b[1] - a[1]
                  )[0];
                  return (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 ${
                          platformColors[topPlatform[0]] || 'bg-gray-500'
                        } rounded-lg flex items-center justify-center`}
                      >
                        <Share2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          {platformNames[topPlatform[0]] || topPlatform[0]}
                        </p>
                        <p className="text-sm text-gray-600">
                          {topPlatform[1]} مشاركة
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <p className="text-gray-500">لا توجد بيانات</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">متوسط التفاعل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">مشاهدات لكل مشاركة</span>
                <span className="font-bold">
                  {data.totalShares > 0
                    ? (data.totalViews / data.totalShares).toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نقرات لكل مشاركة</span>
                <span className="font-bold">
                  {data.totalShares > 0
                    ? (data.totalClicks / data.totalShares).toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">معدل النقر</span>
                <span className="font-bold text-green-600">
                  {data.totalViews > 0
                    ? ((data.totalClicks / data.totalViews) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
