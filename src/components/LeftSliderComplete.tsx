/*
 * LeftSliderComplete.tsx
 * Left Sidebar Menu Component - Tools & Settings
 * القائمة اليسرى للتطبيق - أدوات وإعدادات المستخدم
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Home, Users, BarChart, Settings, User, 
  Phone, Mail, HelpCircle, LogOut, MessageCircle,
  TrendingUp, Calendar, FileText, Tag, Grid,
  Upload, Share2, FileSignature, Stamp, Calculator,
  PlusCircle, BookOpen, ChevronDown, ExternalLink,
  Building, Gift, Star, Target
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface LeftSliderCompleteProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    name: string;
    phone?: string;
    type?: string;
  };
  onNavigate?: (page: string) => void;
  mode?: "menu" | "tools"; // وضع القائمة العادية أو الأدوات
}

export function LeftSliderComplete({ 
  isOpen, 
  onClose, 
  currentUser, 
  onNavigate,
  mode = "menu"
}: LeftSliderCompleteProps) {
  const [calcOpen, setCalcOpen] = useState(false);

  // قائمة البنوك السعودية للحاسبة
  const banks = [
    { name: "بنك الراجحي", url: "https://www.alrajhibank.com.sa/personal/finance/calculator" },
    { name: "البنك الأهلي", url: "https://www.alahli.com/ar-sa/personal/Pages/finance-calculator.aspx" },
    { name: "بنك البلاد", url: "https://www.bankalbilad.com/ar/personal/Pages/FinanceCalculator.aspx" },
    { name: "بنك ساب", url: "https://www.sab.com/ar/personal/finance/calculators" },
    { name: "بنك الإنماء", url: "https://www.alinma.com/wps/portal/alinma/Personal/finance/finance-calculator" },
    { name: "بنك الرياض", url: "https://www.riyadbank.com/ar/personal/finance/calculators" },
    { name: "البنك العربي", url: "https://www.anb.com.sa/calculator" },
    { name: "بنك الجزيرة", url: "https://www.baj.com.sa/ar/personal/finance/calculator" },
    { name: "سامبا", url: "https://www.samba.com/ar/personal/calculator" },
    { name: "بنك الخليج", url: "https://www.gulfbank.com/ar/calculators" },
  ];

  // القائمة الرئيسية للوضع العادي
  const menuItems = [
    {
      icon: Home,
      title: "الرئيسية",
      description: "العودة للصفحة الرئيسية",
      action: () => onNavigate?.("dashboard"),
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "إدارة العملاء", // ✅ محدث حسب الطلب
      description: "إدارة العملاء وقاعدة البيانات",
      action: () => onNavigate?.("enhanced-crm"),
      color: "text-green-600",
      bgColor: "bg-green-50",
      badge: "جديد"
    },
    {
      icon: Target,
      title: "الطلبات الخاصة",
      description: "اطلب عقار بمواصفات محددة",
      action: () => onNavigate?.("special-requests"),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      badge: "VIP"
    },
    {
      icon: BarChart,
      title: "التحليلات",
      description: "إحصائيات وتقارير",
      action: () => onNavigate?.("analytics"),
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Calendar,
      title: "المواعيد",
      description: "جدولة المواعيد والمعاينات",
      action: () => onNavigate?.("calendar"),
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: FileText,
      title: "العقود",
      description: "إدارة العقود والوثائق",
      action: () => onNavigate?.("contracts"),
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: Tag,
      title: "العروض احفوظة",
      description: "العروض التي أعجبتك",
      action: () => onNavigate?.("saved-offers"),
      color: "text-pink-600",  
      bgColor: "bg-pink-50"
    },
    {
      icon: Settings,
      title: "الإعدادات والزملاء", // ✅ إضافة إدارة الزملاء حسب الطلب
      description: `إدارة الحساب ${currentUser?.type === 'team' ? '• إدارة الفريق' : currentUser?.type === 'office' ? '• إدارة المكتب' : currentUser?.type === 'company' ? '• إدارة الشركة' : ''}`,
      action: () => onNavigate?.("settings"),
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      badge: currentUser?.type !== 'individual' ? "فريق" : undefined
    }
  ];

  // قائمة الدعم
  const supportItems = [
    {
      icon: Phone,
      title: "اتصل بنا",
      description: "+966 50 123 4567",
      action: () => window.open("tel:+966501234567"),
      color: "text-green-600"
    },
    {
      icon: MessageCircle,
      title: "واتساب",
      description: "دعم فوري عبر واتساب",
      action: () => window.open("https://wa.me/966501234567"),
      color: "text-green-500"
    },
    {
      icon: HelpCircle,
      title: "مركز المساعدة",
      description: "الأسئلة الشائعة واد",
      action: () => onNavigate?.("help"),
      color: "text-blue-600"
    }
  ];

  // مكون البطاقة للأدوات
  const ToolCard = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="left-slider-tool-card flex flex-col items-center justify-center gap-2 p-4 rounded-xl border hover:bg-[#01411C] hover:text-white transition text-center group"
      style={{ borderColor: "#D4AF37" }}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-white">
        {React.cloneElement(icon as any, { className: "w-6 h-6 text-[#01411C] group-hover:text-[#01411C]" })}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const MenuContent = () => (
    <div className="p-4 space-y-6">
      {/* Main Menu */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          القائمة الرئيسية
        </h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => {
                item.action();
                onClose();
              }}
              className="left-slider-menu-item w-full text-right p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs bg-[#D4AF37] text-[#01411C]">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 text-right">{item.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Statistics */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          إحصائيات سريعة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-xs text-blue-700">عروض نشطة</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-green-700">عملاء جدد</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-xs text-yellow-700">عروض معلقة</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-xs text-purple-700">معدل النجاح</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Support */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          الدعم والمساعدة
        </h3>
        <div className="space-y-2">
          {supportItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => {
                item.action();
                onClose();
              }}
              className="left-slider-support-item w-full text-right p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 block text-right">{item.title}</span>
                  <p className="text-sm text-gray-500 text-right">{item.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const ToolsContent = () => (
    <div className="p-5 overflow-y-auto flex-1 space-y-4">
      {/* 🎯 الطلبات الخاصة VIP - في الأعلى */}
      <div className="w-full">
        <button
          onClick={() => {
            onNavigate?.("special-requests");
            onClose();
          }}
          aria-label="الطلبات الخاصة"
          className="w-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 hover:text-white shadow-xl group relative overflow-hidden"
          style={{ 
            borderColor: "#D4AF37",
            background: "linear-gradient(135deg, #f3e5f5 0%, #ffffff 50%, #fff9e6 100%)",
            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.25)"
          }}
        >
          {/* شارة VIP */}
          <div className="absolute top-2 left-2">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] text-[#01411C] px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              ⭐ VIP
            </div>
          </div>

          {/* أيقونة الطلبات الخاصة */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Target className="w-8 h-8 text-white" />
          </div>
          
          {/* النص الرئيسي */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#01411C] mb-1 group-hover:text-white">الطلبات الخاصة</h3>
            <p className="text-sm text-gray-600 group-hover:text-white/90">ابحث عن عقار بمواصفات دقيقة جداً</p>
          </div>
          
          {/* وصف إضافي */}
          <div className="bg-purple-50 group-hover:bg-white/20 rounded-lg p-3 w-full transition-all">
            <div className="text-xs text-purple-900 group-hover:text-white text-center">
              <p className="font-bold mb-1">🎯 خدمة مميزة:</p>
              <p>نبحث لك عن العقار المثالي وتدفع فقط عند الإيجاد!</p>
            </div>
          </div>
        </button>
      </div>

      {/* Finance Calculator في الأعلى - عرض كامل */}
      <div className="w-full">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCalcOpen(!calcOpen);
          }}
          aria-label="حاسبة التمويل"
          className="finance-calculator-main w-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-300 hover:bg-[#01411C] hover:text-white shadow-lg"
          style={{ 
            borderColor: "#D4AF37", 
            backgroundColor: calcOpen ? "#f0fdf4" : "white",
            boxShadow: calcOpen ? "0 8px 25px rgba(212, 175, 55, 0.15)" : "0 4px 15px rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* أيقونة الحاسبة */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#01411C] to-[#065f41] flex items-center justify-center shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          
          {/* النص الرئيسي */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#01411C] mb-1">حاسبة التمويل</h3>
            <p className="text-sm text-gray-600">أداة شاملة لحساب التمويل العقاري</p>
          </div>
          
          {/* سهم التوسع */}
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-[#D4AF37] ${calcOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {calcOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="finance-calculator-expanded mt-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 p-4 space-y-3 shadow-lg"
              style={{ borderColor: "#D4AF37" }}
            >
              {/* الحاسبة الداخلية */}
              <button
                onClick={() => {
                  onNavigate?.("finance-calculator");
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 text-sm text-[#01411C] bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#01411C] flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#01411C]">حاسبة التمويل الذكية</div>
                    <div className="text-xs text-gray-600">حاسبة متطورة مع جميع البنوك</div>
                  </div>
                </div>
                <span className="text-xs bg-gradient-to-r from-[#01411C] to-[#065f41] text-white px-3 py-1 rounded-full font-bold shadow-sm">
                  جديد ✨
                </span>
              </button>
              
              {/* فاصل مع يقونة */}
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <Building className="w-4 h-4 text-[#D4AF37]" />
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* البنوك الخارجية */}
              <div className="text-center mb-3">
                <h4 className="text-sm font-bold text-[#01411C] mb-1">حاسبات البنوك السعودية</h4>
                <p className="text-xs text-gray-500">روابط مباشرة لحاسبات البنوك الرسمية</p>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {banks.map((bank, idx) => (
                  <a
                    key={idx}
                    href={bank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 text-sm text-[#01411C] border border-transparent hover:border-blue-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="font-medium">{bank.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* التحليلات الشاملة وتحليلات السوق - بجانب بعض */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* التحليلات الشاملة - مصغرة */}
        <button
          onClick={() => { onNavigate?.("analytics"); onClose(); }}
          aria-label="التحليلات الشاملة"
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 hover:bg-[#01411C] hover:text-white shadow-lg group"
          style={{ 
            borderColor: "#D4AF37", 
            backgroundColor: "white",
            background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 25%, #fffef7 100%)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* أيقونة التحليلات */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:bg-white">
            <BarChart className="w-6 h-6 text-white group-hover:text-indigo-600" />
          </div>
          
          {/* النص */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-[#01411C] group-hover:text-white">التحليلات الشاملة</h3>
            <div className="text-lg mt-1">📊</div>
          </div>
        </button>

        {/* تحليلات السوق - مصغرة */}
        <button
          onClick={() => { onNavigate?.("market-insights"); onClose(); }}
          aria-label="تحليلات السوق"
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 hover:bg-[#01411C] hover:text-white shadow-lg group"
          style={{ 
            borderColor: "#D4AF37", 
            backgroundColor: "white",
            background: "linear-gradient(135deg, #fffef7 0%, #ffffff 25%, #f0fdf4 100%)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* أيقونة تحليلات السوق */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:bg-white">
            <TrendingUp className="w-6 h-6 text-white group-hover:text-green-600" />
          </div>
          
          {/* النص */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-[#01411C] group-hover:text-white">تحليلات السوق</h3>
            <div className="text-lg mt-1">📈</div>
          </div>
        </button>
      </div>

      {/* باقي الأدوات في شبكة */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* DELETED: منصتي - محذوف نهائياً (كان يفتح store المحذوف) */}
        
        {/* أدوات محمية - قابلة للنقر مع مؤشر الحماية */}
        <button
          onClick={() => { onNavigate?.("property-upload-complete"); onClose(); }}
          className="left-slider-tool-card flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 hover:bg-[#01411C] hover:text-white shadow-lg group relative"
          style={{ borderColor: "#D4AF37" }}
        >
          {/* شارة الحماية */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[#01411C] text-xs font-bold">🛡️</span>
          </div>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-white">
            <Upload className="w-6 h-6 text-[#01411C] group-hover:text-[#01411C]" />
          </div>
          <span className="text-sm font-medium">نشر عقار</span>
          <span className="text-xs text-[#D4AF37] font-bold">خدمة محمية</span>
        </button>

        <button
          onClick={() => { onNavigate?.("social-media-post"); onClose(); }}
          className="left-slider-tool-card flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 hover:bg-[#01411C] hover:text-white shadow-lg group relative"
          style={{ borderColor: "#D4AF37" }}
        >
          {/* شارة الحماية */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#D4AF37] to-[#f1c40f] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[#01411C] text-xs font-bold">🛡️</span>
          </div>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-white">
            <Share2 className="w-6 h-6 text-[#01411C] group-hover:text-[#01411C]" />
          </div>
          <span className="text-sm font-medium">النشر على التواصل</span>
          <span className="text-xs text-[#D4AF37] font-bold">خدمة محمية</span>
        </button>

        {/* 🗑️ DELETED: النماذج التفصيلية - محذوفة من الجذور */}
        <ToolCard icon={<FileText />} label="عقد وساطة" onClick={() => window.open("https://rega.gov.sa/rega-services/platforms/fal-real-estate-brokerage/", "_blank")} />
        <ToolCard icon={<FileSignature />} label="عقد إيجاري" onClick={() => window.open("https://www.ejar.sa/ar", "_blank")} />
        <ToolCard icon={<Stamp />} label="الإفراغ" onClick={() => window.open("https://najiz.sa", "_blank")} />
        <ToolCard icon={<PlusCircle />} label="إضافات للوسيط" onClick={() => { onNavigate?.("broker-tools"); onClose(); }} />
        <ToolCard icon={<BookOpen />} label="مدونة الوسطاء" onClick={() => { onNavigate?.("blog"); onClose(); }} />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - إزالته للتمدد المباشر */}
          {/* <motion.div ... /> */}

          {/* Left Slider - تحويله من fixed overlay إلى inline expansion */}
          <motion.div
            dir="rtl"
            className="fixed top-0 left-0 z-50 h-full bg-white shadow-2xl flex flex-col"
            initial={{ width: 0 }}
            animate={{ width: "350px" }}
            exit={{ width: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Header - Dynamic Header المحسن */}
            <div className="px-4 py-4 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] text-white relative overflow-hidden border-b-2 border-[#D4AF37]">
              {/* زر الإغلاق الثابت */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white transition-all duration-200 border border-white/20 hover:border-[#D4AF37]"
              >
                <X className="h-5 w-5" />
              </button>

              {/* العنوان مع المؤشر النابض */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
                  <Grid className="w-5 h-5 text-white" />
                  {mode === "tools" ? "صندوق الأدوات (283)" : "القائمة الرئيسية"}
                </h3>
              </div>

              {/* تم إزالة الهيدر */}
              {false && currentUser && (() => {
                // تحديد نوع العضوية المحسن
                const membershipType = currentUser.type === 'company' ? 'expert' : 
                                     currentUser.type === 'office' ? 'professional' :
                                     currentUser.type === 'team' ? 'team' : 'individual';
                const membershipLabel = membershipType === 'expert' ? 'عضو خبير' : 
                                      membershipType === 'professional' ? 'عضو محترف' :
                                      membershipType === 'team' ? 'عضو فريق' : 'عضو فردي';
                const membershipColor = membershipType === 'expert' ? 'from-[#D4AF37] to-[#f1c40f]' : 
                                      membershipType === 'professional' ? 'from-blue-400 to-blue-500' :
                                      membershipType === 'team' ? 'from-green-400 to-green-500' :
                                      'from-gray-400 to-gray-500';
                const membershipIcon = membershipType === 'expert' ? '👑' : 
                                     membershipType === 'professional' ? '🏢' :
                                     membershipType === 'team' ? '👥' : '⭐';

                // تقييم المستخدم (مثال)
                const userRating = 4.8;

                return (
                  <div className="space-y-3 mb-4 relative z-10">
                    {/* المعلومات الأساسية */}
                    <div className="bg-white/10 rounded-xl p-4 border-2 border-[#D4AF37] backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-3 border-[#D4AF37] shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#f1c40f] text-[#01411C] font-bold text-xl">
                              {currentUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {/* مؤشر الحالة - متصل */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          {/* اسم المستخدم */}
                          <div className="font-bold text-white text-lg">{currentUser.name}</div>
                          {/* هاتف المستخدم */}
                          <div className="text-sm text-white/70 mb-2">{currentUser.phone || "مستخدم النظام"}</div>
                          
                          {/* تقييمات المستخدم بالنجوم */}
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(userRating) ? "text-[#D4AF37] fill-current" : "text-white/30"}`} 
                              />
                            ))}
                            <span className="text-[#D4AF37] text-sm font-bold mr-1">{userRating}</span>
                            <span className="text-white/60 text-xs">(تقييم الأداء)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* نوع العضوية المحسن */}
                      <div className="mt-3 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${membershipColor} text-white shadow-lg`}>
                          {membershipIcon} {membershipLabel}
                        </div>
                      </div>
                      
                      {/* إحصائية سريعة للأدوات */}
                      {mode === "tools" && (
                        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-[#D4AF37]/30">
                          <div className="flex items-center justify-between text-center">
                            <div>
                              <div className="text-[#D4AF37] text-sm font-bold">12</div>
                              <div className="text-xs text-white/70">أدوات متاحة</div>
                            </div>
                            <div>
                              <div className="text-[#D4AF37] text-sm font-bold">5</div>
                              <div className="text-xs text-white/70">مستخدمة اليوم</div>
                            </div>
                            <div>
                              <div className="text-[#D4AF37] text-sm font-bold">98%</div>
                              <div className="text-xs text-white/70">معدل الاستخدام</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* محتوى قابل للتمرير بالكامل */}
            <div className="h-full full-scroll-container left-slider-enhanced touch-optimized">
              {/* المحتوى الرئيسي */}
              <div className="bg-gradient-to-b from-transparent to-[#f0fdf4]/30 min-h-screen">
                <div className="p-4 space-y-4">
                  {mode === "tools" ? <ToolsContent /> : <MenuContent />}
                  
                  {/* مساحة إضافية في الأسفل للتمرير المريح */}
                  <div className="h-20"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="left-slider-footer p-4 border-t border-gray-200 bg-gray-50">
              {mode === "tools" ? (
                <div className="text-xs text-gray-500 text-center">
                  ⚠️ ملاحظة: الروابط الحكومية والبنكية تفتح في نافذة جديدة.
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">الإعدادات</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      // Handle logout
                      onClose();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    تسجيل خروج
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LeftSliderComplete;