import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Menu, Bell, PanelLeft, Building2 } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import RightSliderComplete from '../RightSliderComplete-fixed';
import NotificationsSidebar from '../notifications-sidebar';

interface SharedHeaderProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

/**
 * الهيدر المشترك لجميع الصفحات
 * يظهر في كل الصفحات ما عدا:
 * - بطاقة الأعمال الرقمية (business-card-profile)
 * - تحرير بطاقة الأعمال (business-card-edit)
 * - اطلب وسيطك (home-owners)
 */
export function SharedHeader({ user, onNavigate }: SharedHeaderProps) {
  const { leftSidebarOpen, setLeftSidebarOpen } = useDashboardContext();
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
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

      {/* Right Slider */}
      {rightMenuOpen && (
        <RightSliderComplete
          isOpen={rightMenuOpen}
          onClose={() => setRightMenuOpen(false)}
          currentUser={user}
          onNavigate={onNavigate || (() => {})}
        />
      )}

      {/* Notifications Sidebar */}
      {notificationsOpen && (
        <NotificationsSidebar
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          onNavigate={onNavigate || (() => {})}
        />
      )}
    </>
  );
}
