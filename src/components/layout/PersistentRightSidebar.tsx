import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Users, Building2, CheckSquare, BarChart3, Settings,
  ChevronLeft, ChevronRight, Bell, Star, User, Phone, Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "team" | "office" | "company";
  avatar?: string;
  plan?: string;
}

interface PersistentRightSidebarProps {
  user?: User | null;
  onNavigate?: (page: string) => void;
  currentPage?: string;
  className?: string;
}

interface NavigationItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  description: string;
  badge?: boolean;
  badgeCount?: number;
  color?: string;
}

export const PersistentRightSidebar: React.FC<PersistentRightSidebarProps> = ({
  user,
  onNavigate,
  currentPage = 'dashboard',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      icon: <Home className="w-5 h-5" />,
      label: 'الرئيسية',
      path: 'dashboard',
      description: 'العودة للوحة التحكم الرئيسية',
      color: '#01411C'
    },
    {
      id: 'crm',
      icon: <Users className="w-5 h-5" />,
      label: 'إدارة العملاء',
      path: 'enhanced-crm',
      description: 'نظام CRM المتقدم مع Kanban',
      badge: true,
      badgeCount: 5,
      color: '#D4AF37'
    },
    {
      id: 'properties',
      icon: <Building2 className="w-5 h-5" />,
      label: 'العقارات',
      path: 'properties',
      description: 'إدارة العقارات والعروض',
      color: '#065f41'
    },
    {
      id: 'tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      label: 'المهام',
      path: 'tasks',
      description: 'المهام والتذكيرات والمتابعات',
      badgeCount: 2,
      color: '#f59e0b'
    },
    {
      id: 'reports',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'التقارير',
      path: 'reports',
      description: 'التقارير والتحليلات المتقدمة',
      color: '#8b5cf6'
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'الإعدادات',
      path: 'settings',
      description: 'الإعدادات العامة والتخصيص',
      color: '#6b7280'
    }
  ];

  const handleItemClick = (item: NavigationItem) => {
    onNavigate?.(item.path);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`flex ${className}`} dir="rtl">
      {/* الشريط الجانبي الدائم */}
      <motion.div
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-gradient-to-b from-[#01411C] to-[#065f41] border-l-2 border-[#D4AF37] shadow-2xl relative z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <span className="text-[#01411C] font-bold text-lg">ع</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-1">
                    <span>عقاري</span>
                    <span className="text-[#D4AF37]">AI</span>
                    <span className="text-xs">Aqari</span>
                  </h3>
                  <p className="text-[#D4AF37] text-xs">نظام CRM متقدم</p>
                </div>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpanded}
              className="text-white hover:bg-white/10 p-2"
            >
              {isExpanded ? 
                <ChevronRight className="w-4 h-4" /> : 
                <ChevronLeft className="w-4 h-4" />
              }
            </Button>
          </div>
        </div>

        {/* معلومات المستخدم المصغرة */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-b border-[#D4AF37]/30"
          >
            <Card className="bg-white/10 border-[#D4AF37]/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-[#D4AF37]">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#D4AF37] text-[#01411C] font-bold">
                      {user?.name?.charAt(0) || "و"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {user?.name || "الوسيط"}
                    </p>
                    <p className="text-[#D4AF37] text-xs truncate">
                      {user?.email || "user@waseety.com"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                    <Mail className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white hover:bg-white/20">
                    <User className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 flex-1">
          {navigationItems.map((item, index) => {
            const isActive = currentPage === item.path || 
                           (item.path === 'enhanced-crm' && currentPage === 'crm');
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => handleItemClick(item)}
                  className={`w-full justify-start text-white hover:bg-white/10 p-3 relative group transition-all duration-300 ${
                    isActive ? 'bg-white/20 border-r-4 border-[#D4AF37]' : ''
                  }`}
                  style={{
                    minHeight: '48px'
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div 
                      className={`transition-colors duration-200 ${
                        isActive ? 'text-[#D4AF37]' : 'text-white'
                      }`}
                      style={{ color: isActive ? '#D4AF37' : item.color }}
                    >
                      {item.icon}
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 text-right"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium text-sm ${
                                isActive ? 'text-[#D4AF37]' : 'text-white'
                              }`}>
                                {item.label}
                              </p>
                              <p className="text-white/70 text-xs">
                                {item.description}
                              </p>
                            </div>
                            
                            {(item.badge || item.badgeCount) && (
                              <Badge 
                                variant="secondary" 
                                className="bg-red-500 text-white text-xs"
                              >
                                {item.badgeCount || '!'}
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {!isExpanded && (item.badge || item.badgeCount) && (
                    <div className="absolute -top-1 -left-1">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {item.badgeCount || '!'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tooltip للعرض المصغر */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 bg-black/90 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#D4AF37]/30">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Bell className="w-3 h-3" />
                <span>{notifications} إشعارات جديدة</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Star className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-white/70">
                  {user?.plan || "خطة مميزة"}
                </span>
              </div>
            </motion.div>
          )}
          
          {!isExpanded && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PersistentRightSidebar;