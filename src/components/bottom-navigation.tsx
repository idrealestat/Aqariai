import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  Users,
  UserPlus,
  Plus,
  Tag,
  CheckCircle,
  FileText,
  File,
  Phone,
  MessageCircle,
  Mail,
  MapPin
} from 'lucide-react';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onShowContacts?: () => void;
  onShowTags?: () => void;
  onShowTasks?: () => void;
  onAddContact?: () => void;
  onCreateQuote?: () => void;
  onCreateReceipt?: () => void;
  onAddTask?: () => void;
}

export function BottomNavigation({
  activeTab = "conical",
  onTabChange,
  onShowContacts,
  onShowTags,
  onShowTasks,
  onAddContact,
  onCreateQuote,
  onCreateReceipt,
  onAddTask
}: BottomNavigationProps) {
  const [showContactDetails, setShowContactDetails] = useState(false);

  const tabs = [
    {
      id: "conical",
      name: "الشكل المخروطي",
      icon: () => (
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#01411C] to-[#D4AF37] opacity-80"
               style={{
                 clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
               }}>
          </div>
        </div>
      ),
      badge: null
    },
    {
      id: "contacts",
      name: "جهات الاتصال",
      icon: Users,
      badge: "156"
    },
    {
      id: "add",
      name: "إضافة",
      icon: Plus,
      badge: null,
      isCenter: true
    },
    {
      id: "tags",
      name: "العلامات",
      icon: Tag,
      badge: "24"
    },
    {
      id: "tasks",
      name: "المهام",
      icon: CheckCircle,
      badge: "8"
    }
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "add") {
      // لا نغير التاب للإضافة
      return;
    }
    
    if (tabId === "contacts") {
      setShowContactDetails(true);
    } else if (tabId === "tags") {
      onShowTags?.();
    } else if (tabId === "tasks") {
      onShowTasks?.();
    } else {
      onTabChange?.(tabId);
    }
  };

  return (
    <>
      {/* الشريط السفلي */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-[#D4AF37] shadow-lg">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            const isCenter = tab.isCenter;

            if (isCenter) {
              // علامة الزائد في المنتصف مع قائمة منسدلة
              return (
                <DropdownMenu key={tab.id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={`relative flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#01411C] text-white scale-110 shadow-lg' 
                          : 'bg-[#D4AF37] text-[#01411C] hover:bg-[#01411C] hover:text-white'
                      }`}
                      style={{
                        minHeight: '64px',
                        minWidth: '64px',
                        transform: 'translateY(-8px)'
                      }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 mb-2" dir="rtl">
                    <DropdownMenuItem onClick={onAddContact}>
                      <UserPlus className="w-4 h-4 ml-2" />
                      إضافة جهة اتصال
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onCreateQuote}>
                      <FileText className="w-4 h-4 ml-2" />
                      إنشاء عرض سعر
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onCreateReceipt}>
                      <File className="w-4 h-4 ml-2" />
                      إنشاء سند قبض
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onAddTask}>
                      <CheckCircle className="w-4 h-4 ml-2" />
                      إضافة مهمة
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl min-w-[60px] transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#01411C] text-white scale-105 shadow-lg' 
                    : 'text-[#01411C] hover:bg-[#f0fdf4]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <IconComponent className="w-6 h-6" />
                  {tab.badge && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 min-w-[20px] text-xs bg-red-500 text-white border-2 border-white"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium mt-1 leading-tight text-center">
                  {tab.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* نافذة تفاصيل جهات الاتصال */}
      <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-[#01411C]">جهات الاتصال</DialogTitle>
            <DialogDescription>
              عرض وإدارة جميع جهات الاتصال المحفوظة في النظام والمتزامنة مع جوجل والكلاود
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* أزرار الإجراءات السريعة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center gap-2"
                onClick={() => {
                  onAddContact?.();
                  setShowContactDetails(false);
                }}
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-sm">إضافة جهة اتصال</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center gap-2"
                onClick={() => toast.info("استيراد من جوجل")}
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm">استيراد من جوجل</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center gap-2"
                onClick={() => toast.info("مزامنة الكلاود")}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">مزامنة الكلاود</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center gap-2"
                onClick={() => toast.info("تصدير جهات الاتصال")}
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">تصدير</span>
              </Button>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-blue-800">إجمالي جهات الاتصال</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-green-800">عملاء نشطين</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">24</div>
                <div className="text-sm text-purple-800">مجموعات</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-orange-800">جهات مفضلة</div>
              </div>
            </div>

            {/* قائمة جهات الاتصال */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-[#01411C]">جهات الاتصال الأخيرة</h3>
              
              {/* عينة من جهات الاتصال */}
              {[
                {
                  id: 1,
                  name: "أحمد محمد السالم",
                  phone: "+966501234567",
                  email: "ahmed@example.com",
                  company: "شركة السالم",
                  type: "عميل",
                  lastContact: "منذ ساعتين"
                },
                {
                  id: 2,
                  name: "سارة عبدالله الزهراني",
                  phone: "+966557891234",
                  email: "sara@example.com",
                  company: "مستقلة",
                  type: "عميلة",
                  lastContact: "منذ يوم"
                },
                {
                  id: 3,
                  name: "محمد القحطاني",
                  phone: "+966503456789",
                  email: "mohammed@company.com",
                  company: "شركة القحطاني",
                  type: "شريك",
                  lastContact: "منذ 3 أيام"
                }
              ].map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#01411C] text-white flex items-center justify-center font-medium">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-[#01411C]">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.phone}</div>
                      <div className="text-xs text-gray-500">{contact.company} • {contact.type}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-500">{contact.lastContact}</div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Mail className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* زر عرض الكل */}
            <div className="text-center">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  onShowContacts?.();
                  setShowContactDetails(false);
                }}
              >
                عرض جميع جهات الاتصال (156)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BottomNavigation;