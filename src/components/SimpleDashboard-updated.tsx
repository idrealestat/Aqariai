import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import LeftSliderComplete from "./LeftSliderComplete";
import RightSliderComplete from "./RightSliderComplete-fixed";
import NotificationsSidebar from "./notifications-sidebar";
import { SubscriptionTierSlab, useSubscriptionTier } from "./SubscriptionTierSlab";
import { useAIAwareness } from "../core/hooks/useAIAwareness";
import { useDashboardContext } from "../context/DashboardContext";
import RealEstateNewsTicker from "./RealEstateNewsTicker";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  Menu, 
  Bell,
  PanelLeft,
  Building2,
  Globe,
  User,
  Calendar,
  Users,
  Star,
  Activity,
  CheckCircle,
  Clock,
  MessageSquare,
  Phone,
  CalendarCheck,
  ArrowRight,
  X,
  FileText,
  Plus,
  Component,
  TrendingUp,
  Home,
  Sparkles,
  Calculator
} from "lucide-react";

export type UserType = "individual" | "team" | "office" | "company" | "owner-buyer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  birthDate?: string;
  type: UserType;
  companyName?: string;
  licenseNumber?: string;
  licenseImage?: string;
  city?: string;
  district?: string;
  plan?: string;
  profileImage?: string;
  planExpiry?: string;
  licenseExpiry?: string;
  rating?: number;
}

interface SimpleDashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

export default function SimpleDashboard({ user, onNavigate }: SimpleDashboardProps) {
  // 🧠 تفعيل نظام الوعي المركزي - Core Awareness System
  useAIAwareness();
  
  // 🎯 الوصول لسياق لوحة التحكم
  const {
    setActivePage,
    setActiveCustomer,
    setActiveOffer,
    setActiveRequest,
    setActiveTab,
    setCurrentUser,
    leftSidebarOpen,
    setLeftSidebarOpen
  } = useDashboardContext();

  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLeftSlider, setShowLeftSlider] = useState(false);
  const [showRightSlider, setShowRightSlider] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // 🧠 تحديث السياق عند التحميل الأول
  useEffect(() => {
    setActivePage('dashboard');
    if (user) {
      setCurrentUser(user);
    }
    console.log('🧠 [AI Awareness] Dashboard initialized');
  }, [user, setActivePage, setCurrentUser]);

  // 🎯 الاستماع لحدث الانتقال من property-upload-complete
  useEffect(() => {
    const handleNavigate = (event: any) => {
      const page = event.detail;
      console.log('📡 تم استقبال حدث navigateToPage:', page);
      if (page && onNavigate) {
        onNavigate(page);
      }
    };

    window.addEventListener('navigateToPage', handleNavigate);
    console.log('✅ تم تفعيل listener للانتقال التلقائي');

    return () => {
      window.removeEventListener('navigateToPage', handleNavigate);
    };
  }, [onNavigate]);

  return (
    <div 
      dir="rtl" 
      className="min-h-screen transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)",
        marginLeft: leftSidebarOpen ? "350px" : "0"
      }}
    >
      {/* Header - محسن مع Dynamic Header Style */}
      <header 
        className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg transition-all duration-300"
      >
        <div className="container mx-auto px-4 py-2">
          {/* الصف الأول - الأزرار والشعار */}
          <div className="flex items-center justify-between">
            {/* Right: Burger Menu فقط */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRightMenuOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white h-9 w-9"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
                <Building2 className="w-5 h-5" />
                <span className="font-bold">عقاري</span>
                <span className="font-bold text-[#D4AF37]">AI</span>
                <span className="font-bold">Aqari</span>
              </div>
            </div>

            {/* Left: Left Sidebar Icon + Bell فقط */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLeftSidebarOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all relative bg-white/10 text-white"
              >
                <Bell className="w-5 h-5" />
                {/* مؤشر الإشعارات الجديدة */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="container mx-auto px-4 py-6 space-y-8"
      >
        {/* Real Estate News Ticker - شريط الأخبار العقارية */}
        <RealEstateNewsTicker />
        
        {/* Profile Card */}
        {user && (
          <Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-white to-[#f0fdf4] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                {/* الصورة - أقصى اليمين */}
                <Avatar className="w-16 h-16 border-4 border-[#D4AF37] shadow-lg flex-shrink-0">
                  <AvatarFallback className="bg-[#01411C] text-white text-xl font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* الاسم والشركة - في المنتصف */}
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-bold text-[#01411C] text-right">مرحباً، {user.name}</h1>
                  {user.companyName && (
                    <p className="text-sm md:text-base text-gray-600 text-right">{user.companyName}</p>
                  )}
                </div>

                {/* النجوم - أقصى اليسار */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (user.rating || 4) ? "text-[#D4AF37] fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">({user.rating || 4.0})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services Grid (2x2) */}
        <Card className="border-2 border-[#D4AF37] bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#01411C] text-center">الخدمات الرئيسية (4 خدمات)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* ═══════════════════════════════════════════════════════════════════════════════════
                  🔒 PROTECTED ELEMENT #1 - منصتي (رقم 252)
                  ⚠️ محمي من الحذف - يتطلب إذن مباشر من المستخدم
                  📝 التعديل مسموح فقط بأمر حرفي من المستخدم
                  🚫 لا يمكن الحذف أو التعديل من تلقاء نفسي
                  ═══════════════════════════════════════════════════════════════════════════════════ */}
              <Card 
                onClick={() => onNavigate("dashboard-main-252")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
                      النظام الجديد
                    </Badge>
                  </div>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
                    <Component className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">منصتي</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">نظام متكامل مع CRM وإحصائيات متقدمة وإدارة العقارات</p>
                </CardContent>
              </Card>

              {/* 🗑️ DELETED PERMANENTLY: لوة التحكم الشاملة - رقم 253 محذوفة من الجذور */}

              {/* 🗑️ DELETED PERMANENTLY: النظام 254 محذوف - تم دمجه في الخدمة 31 */}

              {/* ═══════════════════════════════════════════════════════════════════════════════════
                  🔒 PROTECTED ELEMENT #2 - النشر على المنصات (رقم 31)
                  ⚠️ محمي من الحذف - يتطلب إذن مباشر من المستخدم
                  📝 التعديل مسموح فقط بأمر حرفي من المستخدم
                  🚫 لا يمكن الحذف أو التعديل من تلقاء نفسي
                  ═══════════════════════════════════════════════════════════════════════════════════ */}
              <Card 
                onClick={() => onNavigate("property-upload-complete")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
                    <Globe className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">النشر على المنصات</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">انشر عقاراتك على منصتك الخاصه وعلى المنصات العقارية من مكان واحد</p>
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════════════════════════════════════════
                  🔒 PROTECTED ELEMENT #3 - إدارة العملاء (رقم 72)
                  ⚠️ محمي من الحذف - يتطلب إذن مباشر من المستخدم
                  📝 التعديل مسموح فقط بأمر حرفي من المستخدم
                  🚫 لا يمكن الحذف أو التعديل من تلقاء نفسي
                  ══════════════════════════════════════════════════════════════════════════════════ */}
              <Card 
                onClick={() => onNavigate("customer-management-72")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#D4AF37] text-[#01411C] text-xs">
                      جديد
                    </Badge>
                  </div>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41] shadow-lg">
                    <Users className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">إدارة العملاء</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">نظام كانبان متقدم لإدارة العملاء مع السحب والإفلات</p>
                </CardContent>
              </Card>

              {/* DELETED PERMANENTLY BY مؤسسة الأحلام العقارية: منصتي محذوفة نهائياً */}

              {/* NEW FEATURE - العروض والطلبات */}
              <Card 
                onClick={() => onNavigate("marketplace-page")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] text-xs animate-pulse">
                      جديد
                    </Badge>
                  </div>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41] shadow-lg">
                    <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">العروض والطلبات</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">واصل مع الملاك والباحثين عن عقارات وقدم خدماتك</p>
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════════════════════════════════════════
                  🔒 PROTECTED ELEMENT #4 - تحليلات السوق
                  ⚠️ محمي من الحذف - يتطلب إذن مباشر من المستخدم
                  📝 التعديل مسموح فقط بأمر حرفي من المستخدم
                  🚫 لا يمكن الحذف أو التعديل من تلقاء نفسي
                  ═══════════════════════════════════════════════════════════════════════════════════ */}
              <Card 
                onClick={() => onNavigate("analytics-dashboard")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
                    <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">تحليلات السوق</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">اكتشف اتجاهات السوق العقاري</p>
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════════════════════════════════════════
                  🔒 PROTECTED ELEMENT #5 - الفرص الذكية
                  ⚠️ محمي من الحذف - يتطلب إذن مباشر من المستخدم
                  📝 التعديل مسموح فقط بأمر حرفي من المستخدم
                  🚫 لا يمكن الحذف أو التعديل من تلقاء نفسي
                  ══════════════════════════════════════════════════════════════════════════════════ */}
              <Card 
                onClick={() => onNavigate("smart-matches")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center relative h-full min-h-[220px] flex flex-col justify-center">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
                      ✨ ذكاء اصطناعي
                    </Badge>
                  </div>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
                    <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">الفرص الذكية</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">تطابق ذكي بين عروضك وطلباتك مع الوسطاء الآخرين</p>
                </CardContent>
              </Card>

              {/* ═══════════════════════════════════════════════════════════════════════════════════
                  🔒 PROTECTED ELEMENT #6 - التقويم والمواعيد (رقم 259)
                  ⚠️ محمي من الحذف - يتطلب إذن مباشر من المستخدم
                  📝 التعديل مسموح فقط بأمر حرفي من المستخدم
                  🚫 لا يمكن الحذف أو التعديل من تلقاء نفسي
                  ═══════════════════════════════════════════════════════════════════════════════════ */}
              <Card 
                onClick={() => onNavigate("calendar-system-complete")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
                    <Calendar className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">التقويم والمواعيد</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">جدولة المواعيد والمعاينات مع العملاء</p>
                </CardContent>
              </Card>

              {/* حاسبة سريعة */}
              <Card 
                onClick={() => onNavigate("quick-calculator")}
                className="border-2 border-[#D4AF37] bg-gradient-to-br from-[#fffef7] to-white hover:border-[#01411C] transition-all hover:shadow-xl cursor-pointer group h-full"
              >
                <CardContent className="p-6 text-center h-full min-h-[220px] flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform bg-gradient-to-r from-[#01411C] to-[#065f41]">
                    <Calculator className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-bold text-[#01411C] mb-2">حاسبة سريعة</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">حساب العمولة المساحة، ومسطح البناء</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* ✅ تم حذف 10 بطاقات داخلية + قسم التحذير الأحمر */}
        
        {/* Stats Box */}
        <Card className="border-2 border-[#D4AF37] bg-gradient-to-r from-white via-[#f0fdf4] to-white shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
                <div className="text-sm text-gray-600">مهام جديدة</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
                <div className="text-sm text-gray-600">أنشطة</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
                <div className="text-sm text-gray-600">عملاء جدد</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-[#01411C] mb-1">4</div>
                <div className="text-sm text-gray-600">إشعارات</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white rounded-lg p-3 transition-colors">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#01411C]">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-[#01411C]">اتصال</span>
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white rounded-lg p-3 transition-colors">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#01411C]">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-[#01411C]">رسالة</span>
              </div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white rounded-lg p-3 transition-colors" onClick={() => onNavigate("calendar")}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#01411C] hover:bg-[#065f41] transition-colors">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-[#01411C]">موعد</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Left Sidebar - أدوات */}
      <LeftSliderComplete 
        isOpen={leftSidebarOpen} 
        onClose={() => setLeftSidebarOpen(false)}
        currentUser={user ? {
          name: user.name,
          phone: user.phone,
          type: user.type
        } : undefined}
        onNavigate={onNavigate}
        mode="tools"
      />

      {/* Notifications Sidebar - إشعارات */}
      <NotificationsSidebar 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Right Menu - الشريط الجانبي الأيمن المحدث */}
      <RightSliderComplete 
        isOpen={rightMenuOpen}
        onClose={() => setRightMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage={undefined}
        mode="navigation"
        currentUser={user ? {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          whatsapp: user.whatsapp,
          type: user.type,
          plan: user.plan,
          profileImage: user.profileImage,
          companyName: user.companyName,
          licenseNumber: user.licenseNumber,
          city: user.city,
          district: user.district,
          birthDate: user.birthDate,
          licenseImage: user.licenseImage
        } : undefined}
      />

      {/* DELETED: زر الذكاء الاصطناعي القديم - تم الاستبدال بـ AI_BubbleAssistant-Real */}

      {/* Left Slider للعروض */}
      {showLeftSlider && selectedOffer && (
        <LeftSliderComplete 
          isOpen={showLeftSlider}
          onClose={() => {
            setShowLeftSlider(false);
            setSelectedOffer(null);
          }}
          selectedOffer={selectedOffer}
          currentUser={user ? {
            name: user.name,
            phone: user.phone,
            type: user.type
          } : undefined}
          onNavigate={onNavigate}
        />
      )}

      {/* Right Slider للعملاء */}
      {showRightSlider && selectedCustomer && (
        <RightSliderComplete 
          isOpen={showRightSlider}
          onClose={() => {
            setShowRightSlider(false);
            setSelectedCustomer(null);
          }}
          selectedCustomer={selectedCustomer}
        />
      )}

      {/* ✅ المساعد الذكي اآن في App.tsx - مدمج باكامل عالمياً */}
      {/* تم نقل AI_BubbleAssistant إلى App.tsx للتغطية الشاملة */}

      {/* DELETED: تلميح سريع للمستخدمين الجدد - محذوف */}

    </div>
  );
}