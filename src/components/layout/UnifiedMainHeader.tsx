import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Menu, Bell, PanelLeft, Building2 } from 'lucide-react';
import LeftSliderComplete from '../LeftSliderComplete';
import RightSliderComplete from '../RightSliderComplete-fixed';
import NotificationsSidebar from '../notifications-sidebar';
import { NotificationsButton } from '../NotificationsPanel';

interface User {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  type?: 'individual' | 'team' | 'office' | 'company';
  companyName?: string;
  licenseNumber?: string;
  plan?: string;
  planExpiry?: string;
}

interface UnifiedMainHeaderProps {
  user?: User | null;
  onNavigate?: (page: string) => void;
}

export default function UnifiedMainHeader({ user, onNavigate }: UnifiedMainHeaderProps) {
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    // إغلاق القوائم بعد التنقل
    setRightMenuOpen(false);
    setLeftSidebarOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <>
      {/* Header - الشريط العلوي الموحد */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Right: Burger Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRightMenuOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-2 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
                <Building2 className="w-6 h-6" />
                <span className="font-bold text-lg">عقاري</span>
                <span className="font-bold text-lg text-[#D4AF37]">AI</span>
                <span className="font-bold text-lg">Aqari</span>
              </div>
            </div>

            {/* Left: Left Sidebar Icon + Notifications */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLeftSidebarOpen(true)}
                className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
              
              {/* 🔔 زر الإشعارات الجديد مع العداد الذكي */}
              <div className="notifications-button-wrapper">
                <NotificationsButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Right Slider - القائمة الجانبية اليمنى */}
      {rightMenuOpen && (
        <RightSliderComplete
          isOpen={rightMenuOpen}
          onClose={() => setRightMenuOpen(false)}
          currentUser={user}
          onNavigate={handleNavigate}
        />
      )}

      {/* Left Slider - صندوق الأدوات */}
      {leftSidebarOpen && (
        <LeftSliderComplete
          isOpen={leftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
          currentUser={user}
          onNavigate={handleNavigate}
          mode="tools"
        />
      )}

      {/* Notifications Sidebar - الإشعارات */}
      {notificationsOpen && (
        <NotificationsSidebar
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      )}
    </>
  );
}
