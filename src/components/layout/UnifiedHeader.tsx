import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, Building2 } from 'lucide-react';

interface UnifiedHeaderProps {
  onNavigate: (page: string) => void;
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
  stats?: {
    label: string;
    value: number | string;
  };
}

/**
 * الهيدر الموحد للتطبيق
 * يظهر في جميع الصفحات ما عدا صفحة بطاقة الأعمال
 */
export function UnifiedHeader({
  onNavigate,
  title,
  showBackButton = true,
  backRoute = "dashboard",
  stats
}: UnifiedHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#01411C] via-[#065f41] to-[#01411C] backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg">
      <div className="container mx-auto px-4 py-4">
        {/* الصف الأول - الأزرار والشعار */}
        <div className="flex items-center justify-between mb-3">
          {/* Right: Back Button + Burger Menu */}
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => onNavigate(backRoute)}
                className="flex items-center gap-2 text-white hover:text-[#D4AF37] hover:bg-white/10"
              >
                <ArrowRight className="w-5 h-5" />
                <span className="hidden sm:inline">العودة</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-2 rounded-full shadow-lg border-2 border-[#D4AF37] backdrop-blur-sm">
              <Building2 className="w-6 h-6" />
              <span className="font-bold text-lg">وسِيطي</span>
              <Badge className="bg-green-500 text-white animate-pulse text-xs">
                مباشر
              </Badge>
            </div>
          </div>

          {/* Left: Icons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all bg-white/10 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="border-2 border-[#D4AF37] hover:bg-white/20 hover:shadow-lg transition-all relative bg-white/10 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* مؤشر الإشعارات الجديدة */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
          </div>
        </div>

        {/* الصف الثاني: العنوان + الإحصائيات */}
        {(title || stats) && (
          <div className="flex items-center gap-4">
            {title && (
              <h1 className="text-xl font-bold text-white">
                {title}
              </h1>
            )}

            {stats && (
              <div className="mr-auto bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
                <span className="text-sm">{stats.label}: </span>
                <span className="font-bold text-lg">{stats.value}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
