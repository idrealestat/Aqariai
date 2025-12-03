import React, { useState } from 'react';
import { Home, Users, Plus, Tag, CheckSquare, X, Search, FileText, Send, Calculator, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface CRMBottomBarProps {
  onNavigate?: (section: string) => void;
}

// قائمة التاقات المتاحة - مشتركة
export const ALL_TAGS = {
  orange: ['طلب حسبة', 'سكني', 'تجاري', 'كاش', 'تمويل'],
  blue: ['الخبر', 'الدمام', 'الرياض', 'القصيم', 'بريدة', 'تبوك', 'مكة', 'جدة', 'المدينة المنورة', 'أبها', 'جيزان', 'نجران'],
  green: ['العليا', 'التحلية', 'الاتصالات', 'أشبيلية', 'الحمراء']
};

// دالة للحصول على لون التاق
export function getTagColor(tag: string, customTags?: Array<{name: string, color: string}>): { bg: string; border: string; text: string } {
  // تحقق من التاقات المخصصة أولاً
  if (customTags) {
    const customTag = customTags.find(t => t.name === tag);
    if (customTag) {
      return getColorByName(customTag.color);
    }
  }
  
  if (ALL_TAGS.orange.includes(tag)) {
    return { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' };
  }
  if (ALL_TAGS.blue.includes(tag)) {
    return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' };
  }
  if (ALL_TAGS.green.includes(tag)) {
    return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' };
  }
  // افتراضي
  return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' };
}

// دالة مساعدة للحصول على الألوان حسب الاسم - 13 لون
export function getColorByName(color: string): { bg: string; border: string; text: string } {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    orange: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
    blue: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
    green: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
    purple: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
    red: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
    yellow: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
    pink: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700' },
    gray: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
    indigo: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700' },
    teal: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
    cyan: { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700' },
    lime: { bg: 'bg-lime-100', border: 'border-lime-300', text: 'text-lime-700' },
    amber: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
  };
  
  return colorMap[color] || colorMap.gray;
}

export function CRMBottomBar({ onNavigate }: CRMBottomBarProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [showContactsPanel, setShowContactsPanel] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [showTasksPanel, setShowTasksPanel] = useState(false);
  
  // التاقات المحددة المحفوظة
  const [savedTags, setSavedTags] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-selected-tags');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // التاقات المحددة مؤقتاً (قبل الضغط على "تم")
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(savedTags);
  
  // 🆕 حفظ ID العميل الحالي المفتوح لإضافة علامات له
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null);
  
  // التاقات المخصصة
  const [customTags, setCustomTags] = useState<Array<{name: string, color: string}>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-custom-tags');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // modal إضافة علامة جديدة
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('orange');
  
  // تبديل تحديد التاق مؤقتاً
  const toggleTag = (tag: string) => {
    const newSelected = tempSelectedTags.includes(tag)
      ? tempSelectedTags.filter(t => t !== tag)
      : [...tempSelectedTags, tag];
    
    setTempSelectedTags(newSelected);
  };
  
  // حفظ التاقات المحددة
  const handleSaveTags = () => {
    setSavedTags(tempSelectedTags);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-selected-tags', JSON.stringify(tempSelectedTags));
    }
    
    // ✅ إرسال Event مع customerId
    window.dispatchEvent(new CustomEvent('crm-tags-updated', { 
      detail: { 
        customerId: currentCustomerId,
        selectedTags: tempSelectedTags 
      } 
    }));
    
    setShowTagsPanel(false);
    setCurrentCustomerId(null); // إعادة تعيين
  };
  
  // إلغاء التغييرات
  const handleCancelTags = () => {
    setTempSelectedTags(savedTags);
    setShowTagsPanel(false);
    setCurrentCustomerId(null); // إعادة تعيين
  };
  
  // إضافة علامة مخصصة جديدة
  const handleAddCustomTag = () => {
    if (!newTagName.trim()) {
      alert('الرجاء إدخال اسم العلامة');
      return;
    }
    
    const newTag = { name: newTagName.trim(), color: newTagColor };
    const updatedCustomTags = [...customTags, newTag];
    
    setCustomTags(updatedCustomTags);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-custom-tags', JSON.stringify(updatedCustomTags));
    }
    
    // إضافة التاق الجديد للتحديد مباشرة
    setTempSelectedTags([...tempSelectedTags, newTagName.trim()]);
    
    // إعادة تعيين الحقول
    setNewTagName('');
    setNewTagColor('orange');
    setShowAddTagModal(false);
  };

  // 🆕 استمع لحدث فتح بانل العلامات من البطاقة
  React.useEffect(() => {
    const handleOpenTagsForCustomer = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { customerId, customerTags } = customEvent.detail;
      
      // حفظ ID العميل
      setCurrentCustomerId(customerId);
      
      // تحميل علامات العميل الحالية
      setTempSelectedTags(customerTags || []);
      
      // فتح البانل
      setShowTagsPanel(true);
      setActiveSection('tags');
    };
    
    window.addEventListener('crm-open-tags-panel', handleOpenTagsForCustomer);
    
    return () => {
      window.removeEventListener('crm-open-tags-panel', handleOpenTagsForCustomer);
    };
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    
    // إغلاق جميع البانلات
    setShowContactsPanel(false);
    setShowAddMenu(false);
    setShowTagsPanel(false);
    setShowTasksPanel(false);

    // فتح البانل المناسب
    if (section === 'home') {
      // عرض الاتصالات الأخيرة
      onNavigate?.('recent-calls');
    } else if (section === 'contacts') {
      setShowContactsPanel(true);
    } else if (section === 'add') {
      setShowAddMenu(true);
    } else if (section === 'tags') {
      setShowTagsPanel(true);
    } else if (section === 'tasks') {
      setShowTasksPanel(true);
    }
  };

  return (
    <>
      {/* الشريط السفلي */}
      <div data-crm-bottom-bar className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#D4AF37] shadow-lg z-40" dir="rtl">
        <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
          {/* 1. الهوم */}
          <button
            onClick={() => handleSectionClick('home')}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeSection === 'home' 
                ? 'bg-[#01411C] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">الهوم</span>
          </button>

          {/* 2. جهات الاتصال */}
          <button
            onClick={() => handleSectionClick('contacts')}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeSection === 'contacts' 
                ? 'bg-[#01411C] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">جهات الاتصال</span>
          </button>

          {/* 3. الإضافة */}
          <button
            onClick={() => handleSectionClick('add')}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeSection === 'add' 
                ? 'bg-[#D4AF37] text-[#01411C]' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">إضافة</span>
          </button>

          {/* 4. العلامات */}
          <button
            data-section="tags"
            onClick={() => handleSectionClick('tags')}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeSection === 'tags' 
                ? 'bg-[#01411C] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span className="text-xs">العلامات</span>
          </button>

          {/* 5. المهام */}
          <button
            onClick={() => handleSectionClick('tasks')}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeSection === 'tasks' 
                ? 'bg-[#01411C] text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">المهام</span>
          </button>
        </div>
      </div>

      {/* بانل جهات الاتصال */}
      {showContactsPanel && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-[#D4AF37] shadow-2xl z-50 max-h-[70vh] overflow-y-auto" dir="rtl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#01411C]">جهات الاتصال</h3>
              <button onClick={() => setShowContactsPanel(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* حقل البحث */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="بحث في جهات الاتصال..."
                  className="pr-10 border-[#D4AF37]"
                />
              </div>
            </div>

            {/* قائمة جهات الاتصال */}
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-bold text-sm">📋 الأرقام المسجلة في لوحة كانبان</span>
                </div>
                <p className="text-xs text-gray-600">جميع العملاء في الأعمدة الحالية</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="font-bold text-sm">📦 الأسماء في الأرشيف</span>
                </div>
                <p className="text-xs text-gray-600">العملاء المؤرشفون</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-bold text-sm">☁️ الأسماء المزامنة مع قوقل</span>
                </div>
                <p className="text-xs text-gray-600">جهات اتصال Google</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="font-bold text-sm">⛅ الأسماء المزامنة مع iCloud</span>
                </div>
                <p className="text-xs text-gray-600">جهات اتصال iCloud</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* قائمة الإضافة المنبثقة */}
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
              <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-all">
                <Users className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-blue-900">إضافة جهة اتصال</span>
              </button>

              <button className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 hover:border-green-500 transition-all">
                <FileText className="w-6 h-6 text-green-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-green-900">إرسال عرض سعر</span>
              </button>

              <button className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 transition-all">
                <Send className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-yellow-900">إرسال سند قبض</span>
              </button>

              <button className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-300 hover:border-purple-500 transition-all">
                <Calendar className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-purple-900">إرسال موعد</span>
              </button>

              <button className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300 hover:border-orange-500 transition-all col-span-2">
                <Calculator className="w-6 h-6 text-orange-600 mb-2 mx-auto" />
                <span className="text-sm font-bold text-orange-900">إرسال حسبة تمويل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* بانل العلامات */}
      {showTagsPanel && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-[#D4AF37] shadow-2xl z-50 max-h-[70vh] overflow-y-auto" dir="rtl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowAddTagModal(true)}
                  className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-[#01411C]">العلامات</h3>
                  {tempSelectedTags.length > 0 && (
                    <p className="text-xs text-gray-600">
                      {tempSelectedTags.length} علامة محددة
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tempSelectedTags.length > 0 && (
                  <button 
                    onClick={() => setTempSelectedTags([])}
                    className="text-sm text-red-600 hover:underline"
                  >
                    مسح الكل
                  </button>
                )}
              </div>
            </div>

            {/* العلامات المحددة */}
            {tempSelectedTags.length > 0 && (
              <div className="mb-4 p-3 bg-[#fffef7] border-2 border-[#D4AF37] rounded-lg">
                <h4 className="text-sm font-bold text-[#01411C] mb-2">العلامات المحددة مؤقتاً:</h4>
                <div className="flex flex-wrap gap-2">
                  {tempSelectedTags.map((tag, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-[#01411C] text-white px-3 py-1 cursor-pointer hover:bg-[#065f41] transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      ✓ {tag} <X className="inline w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* حقل البحث */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="بحث في العلامات..."
                  className="pr-10 border-[#D4AF37]"
                />
              </div>
            </div>

            {/* العلامات البرتقالية */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">نوع العقار والدفع</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.orange.map((tag) => {
                  const isSelected = tempSelectedTags.includes(tag);
                  return (
                    <Badge 
                      key={tag} 
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-orange-600 text-white border-2 border-[#01411C] shadow-lg scale-105' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isSelected && '✓ '}{tag}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* العلامات الزرقاء (المدن) */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">المدن</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.blue.map((tag) => {
                  const isSelected = tempSelectedTags.includes(tag);
                  return (
                    <Badge 
                      key={tag} 
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-2 border-[#01411C] shadow-lg scale-105' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isSelected && '✓ '}{tag}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* العلامات الخضراء (الأحياء) */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">الأحياء</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.green.map((tag) => {
                  const isSelected = tempSelectedTags.includes(tag);
                  return (
                    <Badge 
                      key={tag} 
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-green-600 text-white border-2 border-[#01411C] shadow-lg scale-105' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isSelected && '✓ '}{tag}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* العلامات المخصصة */}
            {customTags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">علاماتي المخصصة</h4>
                <div className="flex flex-wrap gap-2">
                  {customTags.map((customTag, idx) => {
                    const isSelected = tempSelectedTags.includes(customTag.name);
                    // خريطة الألوان الكاملة لحل مشكلة الألوان الديناميكية
                    const colorStyles: Record<string, { selected: string; unselected: string }> = {
                      orange: { selected: 'bg-orange-600 hover:bg-orange-700', unselected: 'bg-orange-500 hover:bg-orange-600' },
                      blue: { selected: 'bg-blue-600 hover:bg-blue-700', unselected: 'bg-blue-500 hover:bg-blue-600' },
                      green: { selected: 'bg-green-600 hover:bg-green-700', unselected: 'bg-green-500 hover:bg-green-600' },
                      purple: { selected: 'bg-purple-600 hover:bg-purple-700', unselected: 'bg-purple-500 hover:bg-purple-600' },
                      red: { selected: 'bg-red-600 hover:bg-red-700', unselected: 'bg-red-500 hover:bg-red-600' },
                      yellow: { selected: 'bg-yellow-600 hover:bg-yellow-700', unselected: 'bg-yellow-500 hover:bg-yellow-600' },
                      pink: { selected: 'bg-pink-600 hover:bg-pink-700', unselected: 'bg-pink-500 hover:bg-pink-600' },
                      gray: { selected: 'bg-gray-600 hover:bg-gray-700', unselected: 'bg-gray-500 hover:bg-gray-600' },
                      indigo: { selected: 'bg-indigo-600 hover:bg-indigo-700', unselected: 'bg-indigo-500 hover:bg-indigo-600' },
                      teal: { selected: 'bg-teal-600 hover:bg-teal-700', unselected: 'bg-teal-500 hover:bg-teal-600' },
                      cyan: { selected: 'bg-cyan-600 hover:bg-cyan-700', unselected: 'bg-cyan-500 hover:bg-cyan-600' },
                      lime: { selected: 'bg-lime-600 hover:bg-lime-700', unselected: 'bg-lime-500 hover:bg-lime-600' },
                      amber: { selected: 'bg-amber-600 hover:bg-amber-700', unselected: 'bg-amber-500 hover:bg-amber-600' },
                    };
                    const style = colorStyles[customTag.color] || colorStyles.gray;
                    return (
                      <Badge 
                        key={idx} 
                        onClick={() => toggleTag(customTag.name)}
                        className={`px-3 py-1 cursor-pointer transition-all text-white ${
                          isSelected 
                            ? `${style.selected} border-2 border-[#01411C] shadow-lg scale-105` 
                            : style.unselected
                        }`}
                      >
                        {isSelected && '✓ '}{customTag.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* أزرار تم وإلغاء */}
            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t-2 border-[#D4AF37] flex gap-3">
              <button
                onClick={handleSaveTags}
                className="flex-1 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg font-bold hover:from-[#065f41] hover:to-[#01411C] transition-all"
              >
                ✓ تم
              </button>
              <button
                onClick={handleCancelTags}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                ✗ إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal إضافة علامة جديدة */}
      {showAddTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" dir="rtl">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#01411C]">إضافة علامة جديدة</h3>
              <button onClick={() => setShowAddTagModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* اسم العلامة */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم العلامة</label>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="مثال: عميل VIP"
                  className="w-full border-[#D4AF37]"
                />
              </div>

              {/* اختيار اللون - 13 لون دائري */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">لون العلامة (13 لون)</label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['orange', 'blue', 'green', 'purple', 'red', 'yellow', 'pink', 'gray', 'indigo', 'teal', 'cyan', 'lime', 'amber'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={`w-12 h-12 rounded-full border-3 transition-all flex items-center justify-center ${
                        newTagColor === color 
                          ? 'border-[#01411C] scale-125 shadow-xl ring-4 ring-[#D4AF37] ring-opacity-50' 
                          : 'border-gray-300 hover:border-[#D4AF37] hover:scale-110'
                      } ${getColorByName(color).bg}`}
                      title={color}
                    >
                      {newTagColor === color && <span className="text-2xl">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddCustomTag}
                  className="flex-1 py-3 bg-gradient-to-r from-[#01411C] to-[#065f41] text-white rounded-lg font-bold hover:from-[#065f41] hover:to-[#01411C] transition-all"
                >
                  + إضافة
                </button>
                <button
                  onClick={() => setShowAddTagModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* بانل المهام */}
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
    </>
  );
}
