import React, { useState } from "react";
import { useDashboardContext } from "../context/DashboardContext";
import { 
  Home, 
  BarChart3, 
  Plus, 
  CheckSquare, 
  Sparkles, 
  X, 
  Users, 
  FileText, 
  Send, 
  Calendar, 
  Calculator 
} from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  page: string;
}

export function BottomNavigationBar({ currentPage, onNavigate }: BottomNavigationProps) {
  const [showMore, setShowMore] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTasksPanel, setShowTasksPanel] = useState(false);

  // 🎯 الوصول لحالة Left Sidebar من Context
  const { leftSidebarOpen } = useDashboardContext();

  const mainNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: <Home className="w-5 h-5" />,
      page: 'dashboard'
    },
    {
      id: 'market-insights',
      label: 'تحليلات السوق',
      icon: <BarChart3 className="w-5 h-5" />,
      page: 'market-insights'
    },
    {
      id: 'add',
      label: 'إضافة',
      icon: <Plus className="w-6 h-6" />,
      page: 'add'
    },
    {
      id: 'tasks',
      label: 'المهام',
      icon: <CheckSquare className="w-5 h-5" />,
      page: 'tasks'
    },
    {
      id: 'smart-opportunities',
      label: 'الفرص الذكية',
      icon: <Sparkles className="w-5 h-5" />,
      page: 'smart-opportunities'
    }
  ];

  const addMenuItems = [
    { id: 'add-contact', label: 'إضافة جهة اتصال', page: 'add-contact' },
    { id: 'send-quote', label: 'إرسال عرض سعر', page: 'send-quote' },
    { id: 'send-receipt', label: 'إرسال سند قبض', page: 'send-receipt' },
    { id: 'send-appointment', label: 'إرسال موعد', page: 'send-appointment' },
    { id: 'send-finance', label: 'إرسال حسبة تمويل', page: 'send-finance' }
  ];

  const moreMenuItems = [
    { id: 'enhanced-crm', label: 'CRM محسن للوسطاء ⚡', page: 'enhanced-crm' },
    { id: 'crm', label: 'CRM تقليدي', page: 'crm' },
    { id: 'social-media', label: 'النشر الاجتماعي', page: 'social-media-post' },
    { id: 'website', label: 'إنشاء موقع', page: 'website-creator' },
    { id: 'finance', label: 'حاسبة التمويل', page: 'finance-calculator' },
    { id: 'calendar', label: 'المواعيد', page: 'calendar-booking' },
    { id: 'pipeline', label: 'مراحل البيع', page: 'pipeline' },
    { id: 'settings', label: 'الإعدادات', page: 'settings' },
    { id: 'profile', label: 'الملف الشخصي', page: 'profile' },
    { id: 'colleagues', label: 'الزملاء', page: 'colleagues' },
    { id: 'contact-us', label: 'اتصل بنا', page: 'contact-us' },
    { id: 'whats-new', label: 'ما الجديد', page: 'whats-new' }
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.id === 'add') {
      setShowAddMenu(!showAddMenu);
      setShowTasksPanel(false);
    } else if (item.id === 'tasks') {
      setShowTasksPanel(!showTasksPanel);
      setShowAddMenu(false);
    } else if (item.id === 'smart-opportunities') {
      // اختصار مباشر للفرص الذكية من الواجهة الرئيسية
      setShowAddMenu(false);
      setShowTasksPanel(false);
      onNavigate('smart-matches');
    } else {
      setShowAddMenu(false);
      setShowTasksPanel(false);
      onNavigate(item.page);
    }
  };

  const handleAddItemClick = (page: string) => {
    setShowAddMenu(false);
    onNavigate(page);
  };

  const handleMoreItemClick = (page: string) => {
    setShowMore(false);
    onNavigate(page);
  };

  const isActive = (page: string) => {
    if (page === 'dashboard') {
      return currentPage === 'dashboard';
    }
    if (page === 'market-insights') {
      return currentPage === 'market-insights';
    }
    if (page === 'tasks') {
      return currentPage === 'tasks';
    }
    if (page === 'smart-opportunities') {
      return currentPage === 'smart-opportunities' || currentPage === 'smart-matches';
    }
    return false;
  };

  return (
    <>
      {/* قائمة المزيد المنبثقة */}
      {showMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMore(false)}>
          <div className="fixed bottom-20 right-4 left-4 bg-white rounded-lg shadow-xl border border-[#D4AF37] max-w-sm mx-auto z-50" dir="rtl">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#01411C] mb-4 text-center">
                المزيد من الخيارات
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {moreMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMoreItemClick(item.page)}
                    className="p-3 rounded-lg border border-[#D4AF37] text-[#01411C] hover:bg-[#f0fdf4] transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* قائمة الإضافة المنبثقة - محسّنة وملونة */}
      {showAddMenu && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-[#D4AF37] shadow-2xl z-50" dir="rtl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#01411C]">إضافة سريعة</h3>
              <button onClick={() => setShowAddMenu(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleAddItemClick('add-contact')}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-all"
              >
                <Users className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-blue-900">إضافة جهة اتصال</span>
              </button>

              <button 
                onClick={() => handleAddItemClick('send-quote')}
                className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 hover:border-green-500 transition-all"
              >
                <FileText className="w-6 h-6 text-green-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-green-900">إرسال عرض سعر</span>
              </button>

              <button 
                onClick={() => handleAddItemClick('send-receipt')}
                className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 transition-all"
              >
                <Send className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-yellow-900">إرسال سند قبض</span>
              </button>

              <button 
                onClick={() => handleAddItemClick('send-appointment')}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-300 hover:border-purple-500 transition-all"
              >
                <Calendar className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-purple-900">إرسال موعد</span>
              </button>

              <button 
                onClick={() => handleAddItemClick('send-finance')}
                className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300 hover:border-orange-500 transition-all col-span-2"
              >
                <Calculator className="w-6 h-6 text-orange-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-orange-900">إرسال حس��ة تمويل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* بانل المهام - مصفوفة أيزنهاور */}
      {showTasksPanel && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-[#D4AF37] shadow-2xl z-50 max-h-[70vh] overflow-y-auto" dir="rtl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#01411C]">المهام</h3>
              <button onClick={() => setShowTasksPanel(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* هام وعاجل */}
            <div className="mb-4 p-4 bg-red-50 rounded-lg border-2 border-red-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h4 className="font-bold text-red-800">🔥 هام وعاجل</h4>
              </div>
              <p className="text-xs text-red-600 mb-2">لا توجد مهام حالياً</p>
            </div>

            {/* هام وغير عاجل */}
            <div className="mb-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h4 className="font-bold text-orange-800">🟠 هام وغير عاجل</h4>
              </div>
              <p className="text-xs text-orange-600 mb-2">لا توجد مهام حالياً</p>
            </div>

            {/* غير هام وعاجل */}
            <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <h4 className="font-bold text-yellow-800">🟡 غير هام وعاجل</h4>
              </div>
              <p className="text-xs text-yellow-600 mb-2">لا توجد مهام حالياً</p>
            </div>

            {/* غير هام وغير عاجل */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="font-bold text-blue-800">🔵 غير هام وغير عاجل</h4>
              </div>
              <p className="text-xs text-blue-600 mb-2">لا توجد مهام حالياً</p>
            </div>
          </div>
        </div>
      )}

      {/* الشريط السفلي */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4AF37] shadow-lg z-30 transition-all duration-300"
        style={{
          marginLeft: leftSidebarOpen ? "350px" : "0"
        }}
      >
        <div className="grid grid-cols-5 h-16">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                item.id === 'add'
                  ? (showAddMenu ? 'text-[#01411C] bg-[#D4AF37]' : 'text-gray-600 hover:bg-gray-100')
                  : item.id === 'tasks'
                    ? (showTasksPanel ? 'text-white bg-[#01411C]' : 'text-gray-600 hover:bg-gray-100')
                    : (isActive(item.page)
                      ? 'text-[#01411C] bg-[#f0fdf4]'
                      : 'text-gray-600 hover:text-[#01411C] hover:bg-[#f0fdf4]')
              }`}
            >
              <div className={`transition-colors ${
                item.id === 'add'
                  ? (showAddMenu ? 'text-[#01411C]' : 'text-gray-600')
                  : item.id === 'tasks'
                    ? (showTasksPanel ? 'text-white' : 'text-gray-600')
                    : (isActive(item.page) 
                      ? 'text-[#01411C]' 
                      : 'text-gray-600')
              }`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* مؤشر النشاط */}
              {isActive(item.page) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#D4AF37] rounded-b-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* مساحة فارغة لتجنب تداخل المحتوى مع الشريط السفلي */}
      <div className="h-16"></div>
    </>
  );
}