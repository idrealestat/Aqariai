import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, TrendingUp, Users, Building2, Settings } from 'lucide-react';
import UnifiedMainHeader from './layout/UnifiedMainHeader';
import OffersControlDashboard from './OffersControlDashboard';
import { MyPlatform } from './MyPlatform';
import RequestsPage from './RequestsPage';

// Types
interface User {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  type?: 'individual' | 'team' | 'office' | 'company';
  companyName?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  plan?: string;
  planExpiry?: string;
}

interface DashboardMainView252Props {
  user: User | null;
  onNavigate: (page: string, options?: { initialTab?: string; ownerId?: string }) => void;
  onBack: () => void;
}

export default function DashboardMainView252({ user, onNavigate, onBack }: DashboardMainView252Props) {
  // حالة التبويب النشط: 'platform' أو 'dashboard'
  const [activeTab, setActiveTab] = useState<'platform' | 'dashboard'>('platform');
  // حالة التبويب الفرعي في لوحة التحكم: 'offers' أو 'requests'
  const [dashboardSubTab, setDashboardSubTab] = useState<'offers' | 'requests'>('offers');

  // ✅ الاستماع لحدث الانتقال للوحة التحكم بعد النشر
  React.useEffect(() => {
    const handleSwitchToDashboard = () => {
      console.log('📊 الانتقال التلقائي للوحة التحكم');
      setActiveTab('dashboard');
      setDashboardSubTab('offers');
    };

    window.addEventListener('switchToDashboardTab', handleSwitchToDashboard);
    
    return () => {
      window.removeEventListener('switchToDashboardTab', handleSwitchToDashboard);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffef7]" dir="rtl">
      {/* الشريط العلوي الموحد */}
      <UnifiedMainHeader user={user} onNavigate={onNavigate} />

      {/* زر العودة + شريط التبويبات */}
      <div className="sticky top-[72px] z-40 bg-white border-b-2 border-[#D4AF37] shadow-md">
        <div className="container mx-auto px-4 py-3">
          {/* زر العودة */}
          <div className="mb-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-2 border-[#D4AF37] hover:bg-[#f0fdf4] text-[#01411C]"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للواجهة الرئيسية
            </Button>
          </div>
          
          {/* شريط التبويبات */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab('platform')}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                activeTab === 'platform'
                  ? 'bg-gradient-to-r from-[#01411C] to-[#065f41] text-white border-2 border-[#D4AF37] shadow-lg scale-105'
                  : 'bg-gray-100 text-[#01411C] hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              منصتي
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#01411C] to-[#065f41] text-white border-2 border-[#D4AF37] shadow-lg scale-105'
                  : 'bg-gray-100 text-[#01411C] hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              لوحة التحكم
            </button>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <main className="py-0">
        {activeTab === 'platform' && (
          <MyPlatform
            user={user}
            onBack={onBack}
            showHeader={true}
          />
        )}

        {activeTab === 'dashboard' && (
          <Card className="border-2 border-[#D4AF37] bg-white shadow-xl">
            {/* التبويبات الفرعية: العروض | الطلبات */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="container mx-auto px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setDashboardSubTab('offers')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      dashboardSubTab === 'offers'
                        ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
                        : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
                    }`}
                  >
                    العروض
                  </button>
                  <button
                    onClick={() => setDashboardSubTab('requests')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      dashboardSubTab === 'requests'
                        ? 'bg-[#01411C] text-white border-2 border-[#D4AF37] shadow-md'
                        : 'bg-white text-[#01411C] hover:bg-gray-100 border-2 border-gray-300'
                    }`}
                  >
                    الطلبات
                  </button>
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              {/* عرض نظام العروض أو الطلبات */}
              {dashboardSubTab === 'offers' ? (
                <OffersControlDashboard onNavigate={onNavigate} />
              ) : (
                <RequestsPage onNavigate={onNavigate} />
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}